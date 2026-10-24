import secrets
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import func, select

from app.api.dependencies import CurrentUser, DbSession, OptionalCurrentUser
from app.core.config import get_settings
from app.models import (
    Comment,
    Post,
    PostReaction,
    PostView,
    University,
    User,
    ViewSession,
)
from app.schemas import (
    CommentCreate,
    CommentRead,
    PostAuthorRead,
    PostPage,
    PostRead,
    ReactionResult,
    ViewCompleted,
    ViewStarted,
)


router = APIRouter()
settings = get_settings()
ALLOWED_MEDIA = {
    "image/jpeg": (".jpg", b"\xff\xd8\xff"),
    "image/png": (".png", b"\x89PNG\r\n\x1a\n"),
    "image/webp": (".webp", b"RIFF"),
    "video/mp4": (".mp4", b"\x00\x00\x00"),
    "video/webm": (".webm", b"\x1aE\xdf\xa3"),
}


def _post_statement(viewer_id: str | None = None):
    reaction_count = lambda kind: (
        select(func.count(PostReaction.id))
        .where(PostReaction.post_id == Post.id, PostReaction.kind == kind)
        .correlate(Post)
        .scalar_subquery()
    )
    comment_count = (
        select(func.count(Comment.id))
        .where(Comment.post_id == Post.id)
        .correlate(Post)
        .scalar_subquery()
    )
    view_count = (
        select(func.count(PostView.id))
        .where(PostView.post_id == Post.id)
        .correlate(Post)
        .scalar_subquery()
    )
    statement = select(
            Post,
            User,
            reaction_count("like").label("likes"),
            reaction_count("save").label("saves"),
            reaction_count("repost").label("reposts"),
            comment_count.label("comments"),
            view_count.label("views"),
        ).join(User, User.id == Post.user_id)
    if viewer_id:
        statement = statement.add_columns(
            select(PostReaction.id)
            .where(
                PostReaction.post_id == Post.id,
                PostReaction.user_id == viewer_id,
                PostReaction.kind == "like",
            )
            .exists()
            .label("liked_by_me"),
            select(PostReaction.id)
            .where(
                PostReaction.post_id == Post.id,
                PostReaction.user_id == viewer_id,
                PostReaction.kind == "save",
            )
            .exists()
            .label("saved_by_me"),
            select(PostReaction.id)
            .where(
                PostReaction.post_id == Post.id,
                PostReaction.user_id == viewer_id,
                PostReaction.kind == "repost",
            )
            .exists()
            .label("reposted_by_me"),
        )
    return statement


def _post_read(row) -> PostRead:
    post, user, likes, saves, reposts, comments, views, *viewer_state = row
    return PostRead(
        id=post.id,
        caption=post.caption,
        media_type=post.media_type,
        media_url=f"/api/v1/media/{post.media_path}" if post.media_path else None,
        category=post.category,
        hashtags=post.hashtags,
        university_id=post.university_id,
        season_year=post.season_year,
        created_at=post.created_at,
        author=PostAuthorRead(
            id=user.id,
            username=user.username,
            display_name=user.display_name,
            university_id=user.university_id,
            is_student=user.is_student,
            verification_status=user.verification_status,
            avatar_url=user.avatar_url,
        ),
        likes=likes,
        saves=saves,
        reposts=reposts,
        comments=comments,
        views=views,
        liked_by_me=viewer_state[0] if viewer_state else False,
        saved_by_me=viewer_state[1] if viewer_state else False,
        reposted_by_me=viewer_state[2] if viewer_state else False,
    )


def _require_verified_student(user: User) -> None:
    if not user.is_student or user.verification_status != "verified" or not user.university_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="A verified student account is required to create posts",
        )


@router.get("/feed", response_model=PostPage)
def get_feed(
    db: DbSession,
    current_user: OptionalCurrentUser,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=50),
    user_id: str | None = None,
    university_id: str | None = None,
) -> PostPage:
    statement = _post_statement(current_user.id if current_user else None)
    if user_id:
        statement = statement.where(Post.user_id == user_id)
    if university_id:
        statement = statement.where(Post.university_id == university_id)
    rows = db.execute(
        statement
        .order_by(Post.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
    ).all()
    return PostPage(data=[_post_read(row) for row in rows], page=page, limit=limit)


@router.post("/posts", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(
    current_user: CurrentUser,
    db: DbSession,
    caption: Annotated[str, Form(max_length=2000)] = "",
    category: Annotated[str, Form(max_length=64)] = "Campus life",
    hashtags: Annotated[str, Form(max_length=500)] = "",
    media: Annotated[UploadFile | None, File()] = None,
) -> PostRead:
    _require_verified_student(current_user)
    caption = caption.strip()
    if not caption and media is None:
        raise HTTPException(status_code=422, detail="A caption or media file is required")

    media_type = "text"
    media_path = None
    saved_path: Path | None = None
    if media is not None and media.filename:
        metadata = ALLOWED_MEDIA.get(media.content_type or "")
        if metadata is None:
            raise HTTPException(status_code=415, detail="Unsupported media type")
        extension, signature = metadata
        content = await media.read(settings.max_upload_bytes + 1)
        if len(content) > settings.max_upload_bytes:
            raise HTTPException(status_code=413, detail="Media file is too large")
        if not content.startswith(signature):
            raise HTTPException(status_code=415, detail="Media content does not match its type")
        media_type = "video" if (media.content_type or "").startswith("video/") else "image"
        media_path = f"{secrets.token_hex(16)}{extension}"
        settings.uploads_dir.mkdir(parents=True, exist_ok=True)
        saved_path = settings.uploads_dir / media_path
        with saved_path.open("xb") as output:
            output.write(content)

    post = Post(
        user_id=current_user.id,
        university_id=current_user.university_id,
        caption=caption,
        media_type=media_type,
        media_path=media_path,
        category=category.strip() or "Campus life",
        hashtags=[
            f"#{tag.lstrip('#')}"
            for tag in re.split(r"[\s,]+", hashtags.strip())
            if tag.strip("#")
        ][:10],
        season_year=datetime.now(timezone.utc).year,
    )
    db.add(post)
    try:
        db.commit()
    except Exception:
        db.rollback()
        if saved_path:
            saved_path.unlink(missing_ok=True)
        raise
    row = db.execute(_post_statement(current_user.id).where(Post.id == post.id)).one()
    return _post_read(row)


def _get_reacted_posts(
    current_user: User,
    db: DbSession,
    kind: str,
    limit: int,
) -> list[PostRead]:
    rows = db.execute(
        _post_statement(current_user.id)
        .where(
            Post.id.in_(
                select(PostReaction.post_id).where(
                    PostReaction.user_id == current_user.id,
                    PostReaction.kind == kind,
                )
            )
        )
        .order_by(Post.created_at.desc())
        .limit(limit)
    ).all()
    return [_post_read(row) for row in rows]


@router.get("/posts/saved", response_model=list[PostRead])
def get_saved_posts(
    current_user: CurrentUser,
    db: DbSession,
    limit: int = Query(default=100, ge=1, le=200),
) -> list[PostRead]:
    return _get_reacted_posts(current_user, db, "save", limit)


@router.get("/posts/liked", response_model=list[PostRead])
def get_liked_posts(
    current_user: CurrentUser,
    db: DbSession,
    limit: int = Query(default=100, ge=1, le=200),
) -> list[PostRead]:
    return _get_reacted_posts(current_user, db, "like", limit)


@router.get("/media/{filename}")
def get_media(filename: str):
    if not re.fullmatch(r"[a-f0-9]{32}\.(?:jpg|png|webp|mp4|webm)", filename):
        raise HTTPException(status_code=404, detail="Media not found")
    root = settings.uploads_dir.resolve()
    path = (root / filename).resolve()
    if path.parent != root:
        raise HTTPException(status_code=404, detail="Media not found")
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Media not found")
    return FileResponse(path)


@router.get("/posts/{post_id}", response_model=PostRead)
def get_post(
    post_id: str,
    db: DbSession,
    current_user: OptionalCurrentUser,
) -> PostRead:
    row = db.execute(
        _post_statement(current_user.id if current_user else None).where(Post.id == post_id)
    ).one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return _post_read(row)


@router.get("/posts/{post_id}/comments", response_model=list[CommentRead])
def get_comments(
    post_id: str,
    db: DbSession,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> list[CommentRead]:
    if db.get(Post, post_id) is None:
        raise HTTPException(status_code=404, detail="Post not found")
    rows = db.execute(
        select(Comment, User)
        .join(User, User.id == Comment.user_id)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .offset(offset)
        .limit(limit)
    )
    return [
        CommentRead(
            id=comment.id,
            post_id=comment.post_id,
            user_id=comment.user_id,
            body=comment.body,
            created_at=comment.created_at,
            author={
                "id": author.id,
                "username": author.username,
                "display_name": author.display_name,
            },
        )
        for comment, author in rows
    ]


@router.post("/posts/{post_id}/comments", response_model=CommentRead, status_code=201)
def add_comment(
    post_id: str,
    payload: CommentCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> Comment:
    if db.get(Post, post_id) is None:
        raise HTTPException(status_code=404, detail="Post not found")
    comment = Comment(post_id=post_id, user_id=current_user.id, body=payload.body)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return CommentRead(
        id=comment.id,
        post_id=comment.post_id,
        user_id=comment.user_id,
        body=comment.body,
        created_at=comment.created_at,
        author={
            "id": current_user.id,
            "username": current_user.username,
            "display_name": current_user.display_name,
        },
    )


@router.post("/posts/{post_id}/{kind}", response_model=ReactionResult)
def toggle_reaction(
    post_id: str,
    kind: str,
    current_user: CurrentUser,
    db: DbSession,
) -> ReactionResult:
    if kind not in {"likes", "saves", "reposts"}:
        raise HTTPException(status_code=404, detail="Reaction not found")
    if db.get(Post, post_id) is None:
        raise HTTPException(status_code=404, detail="Post not found")
    reaction_kind = kind[:-1] if kind != "reposts" else "repost"
    existing = db.scalar(
        select(PostReaction).where(
            PostReaction.post_id == post_id,
            PostReaction.user_id == current_user.id,
            PostReaction.kind == reaction_kind,
        )
    )
    if existing:
        db.delete(existing)
        active = False
    else:
        db.add(PostReaction(post_id=post_id, user_id=current_user.id, kind=reaction_kind))
        active = True
    db.commit()
    count = db.scalar(
        select(func.count(PostReaction.id)).where(
            PostReaction.post_id == post_id,
            PostReaction.kind == reaction_kind,
        )
    )
    return ReactionResult(active=active, count=count or 0)


@router.post("/posts/{post_id}/views/start", response_model=ViewStarted, status_code=201)
def start_view(
    post_id: str,
    current_user: CurrentUser,
    db: DbSession,
) -> ViewStarted:
    if db.get(Post, post_id) is None:
        raise HTTPException(status_code=404, detail="Post not found")
    view_session = ViewSession(post_id=post_id, user_id=current_user.id)
    db.add(view_session)
    db.commit()
    return ViewStarted(view_session_id=view_session.id)


@router.post("/posts/{post_id}/views/{view_session_id}/complete", status_code=204)
def complete_view(
    post_id: str,
    view_session_id: str,
    payload: ViewCompleted,
    current_user: CurrentUser,
    db: DbSession,
) -> None:
    view_session = db.scalar(
        select(ViewSession).where(
            ViewSession.id == view_session_id,
            ViewSession.post_id == post_id,
            ViewSession.user_id == current_user.id,
        )
    )
    if view_session is None:
        raise HTTPException(status_code=404, detail="View session not found")
    if view_session.completed_at is not None:
        raise HTTPException(status_code=409, detail="View session was already completed")

    now = datetime.now(timezone.utc)
    started_at = view_session.started_at
    if started_at.tzinfo is None:
        started_at = started_at.replace(tzinfo=timezone.utc)
    elapsed = int((now - started_at).total_seconds())
    if elapsed < 4:
        raise HTTPException(status_code=422, detail="A valid view requires at least four seconds")
    if payload.watched_seconds > elapsed + 1:
        raise HTTPException(
            status_code=422,
            detail="Reported playback cannot exceed elapsed view time",
        )

    view_session.completed_at = now
    already_counted = db.scalar(
        select(PostView.id).where(
            PostView.post_id == post_id,
            PostView.user_id == current_user.id,
        )
    )
    if already_counted is None:
        db.add(
            PostView(
                post_id=post_id,
                user_id=current_user.id,
                watched_seconds=payload.watched_seconds,
            )
        )
    db.commit()
