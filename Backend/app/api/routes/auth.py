from datetime import datetime, timedelta, timezone
import logging
import re
import secrets
from threading import Lock

from fastapi import APIRouter, File, HTTPException, Request, Response, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from starlette.concurrency import run_in_threadpool

from app.api.dependencies import CurrentUser, DbSession
from app.core.config import get_settings
from app.core.security import (
    hash_password,
    hash_session_token,
    new_session_token,
    verify_password,
)
from app.models import AuthSession, University, User
from app.schemas import LoginRequest, UserCreate, UserProfileUpdate, UserRead


router = APIRouter()
logger = logging.getLogger(__name__)
settings = get_settings()
_failure_lock = Lock()
_login_failures: dict[str, tuple[int, float]] = {}
_MAX_FAILURES = 5
_FAILURE_WINDOW_SECONDS = 900
PROFILE_IMAGE_TYPES = {
    "image/jpeg": (".jpg", lambda content: content.startswith(b"\xff\xd8\xff")),
    "image/png": (".png", lambda content: content.startswith(b"\x89PNG\r\n\x1a\n")),
    "image/webp": (
        ".webp",
        lambda content: content.startswith(b"RIFF") and content[8:12] == b"WEBP",
    ),
}
PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024


def _identity_key(email: str, client_host: str) -> str:
    return f"{email}:{client_host}"


def _rate_limited(key: str) -> bool:
    now = datetime.now(timezone.utc).timestamp()
    with _failure_lock:
        failures, first_failure = _login_failures.get(key, (0, now))
        if now - first_failure >= _FAILURE_WINDOW_SECONDS:
            _login_failures.pop(key, None)
            return False
        return failures >= _MAX_FAILURES


def _record_failure(key: str) -> None:
    now = datetime.now(timezone.utc).timestamp()
    with _failure_lock:
        failures, first_failure = _login_failures.get(key, (0, now))
        if now - first_failure >= _FAILURE_WINDOW_SECONDS:
            failures, first_failure = 0, now
        _login_failures[key] = (failures + 1, first_failure)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: DbSession) -> User:
    email = str(payload.email).strip().lower()
    username = payload.username.strip().lower()
    if payload.is_student:
        if not payload.university_id:
            raise HTTPException(status_code=422, detail="University students must select a university")
        if not db.get(University, payload.university_id):
            raise HTTPException(status_code=422, detail="Selected university was not found")

    user = User(
        email=email,
        username=username,
        display_name=payload.display_name.strip(),
        password_hash=hash_password(payload.password),
        is_student=payload.is_student,
        verification_status="pending" if payload.is_student else "none",
        university_id=payload.university_id if payload.is_student else None,
        department=payload.department if payload.is_student else None,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email or username is already registered") from exc
    db.refresh(user)
    return user


@router.post("/login", response_model=UserRead)
def login(payload: LoginRequest, request: Request, response: Response, db: DbSession) -> User:
    email = str(payload.email).strip().lower()
    key = _identity_key(email, request.client.host if request.client else "unknown")
    if _rate_limited(key):
        raise HTTPException(status_code=429, detail="Too many login attempts; try again later")

    user = db.scalar(select(User).where(func.lower(User.email) == email))
    if user is None or not verify_password(payload.password, user.password_hash):
        _record_failure(key)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    _login_failures.pop(key, None)
    token = new_session_token()
    session_ttl = settings.session_ttl_seconds if payload.remember_me else 60 * 60 * 8
    auth_session = AuthSession(
        user_id=user.id,
        token_hash=hash_session_token(token),
        expires_at=datetime.now(timezone.utc) + timedelta(seconds=session_ttl),
    )
    db.add(auth_session)
    db.commit()
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        max_age=session_ttl if payload.remember_me else None,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite="lax",
        path="/",
    )
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    current_user: CurrentUser,
    request: Request,
    response: Response,
    db: DbSession,
) -> Response:
    token = request.cookies.get(settings.session_cookie_name)
    if token:
        session = db.scalar(
            select(AuthSession).where(AuthSession.token_hash == hash_session_token(token))
        )
        if session and session.user_id == current_user.id:
            session.revoked_at = datetime.now(timezone.utc)
            db.commit()
    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        secure=settings.session_cookie_secure,
        httponly=True,
        samesite="lax",
    )
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.get("/me", response_model=UserRead)
def get_me(current_user: CurrentUser) -> User:
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserProfileUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> User:
    current_user.display_name = payload.display_name.strip()
    current_user.bio = payload.bio.strip()
    current_user.department = payload.department.strip() if payload.department else None
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/images/{image_type}", response_model=UserRead)
async def update_profile_image(
    image_type: str,
    current_user: CurrentUser,
    db: DbSession,
    image: UploadFile = File(...),
) -> User:
    if image_type not in {"avatar", "cover"}:
        raise HTTPException(status_code=404, detail="Profile image type not found")

    metadata = PROFILE_IMAGE_TYPES.get(image.content_type or "")
    if metadata is None:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, or WebP image")

    extension, is_valid_image = metadata
    content = await image.read(PROFILE_IMAGE_MAX_BYTES + 1)
    if len(content) > PROFILE_IMAGE_MAX_BYTES:
        raise HTTPException(status_code=413, detail="Profile image must be 5 MB or smaller")
    if not is_valid_image(content):
        raise HTTPException(status_code=415, detail="Image content does not match its file type")

    filename = f"{secrets.token_hex(16)}{extension}"
    settings.uploads_dir.mkdir(parents=True, exist_ok=True)
    saved_path = settings.uploads_dir / filename
    try:
        await run_in_threadpool(saved_path.write_bytes, content)
        attribute = "avatar_path" if image_type == "avatar" else "cover_image_path"
        previous_filename = getattr(current_user, attribute)
        setattr(current_user, attribute, filename)
        db.commit()
        db.refresh(current_user)
    except Exception:
        db.rollback()
        saved_path.unlink(missing_ok=True)
        raise

    if previous_filename and re.fullmatch(r"[a-f0-9]{32}\.(?:jpg|png|webp)", previous_filename):
        previous_path = settings.uploads_dir / previous_filename
        if previous_path != saved_path:
            try:
                previous_path.unlink(missing_ok=True)
            except OSError:
                logger.warning("Unable to remove replaced profile image", exc_info=True)
    return current_user
