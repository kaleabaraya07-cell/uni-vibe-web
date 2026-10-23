from fastapi import APIRouter, HTTPException

from app.api.dependencies import DbSession
from app.models import User
from app.schemas import PublicUserRead


router = APIRouter()


@router.get("/{user_id}", response_model=PublicUserRead)
def get_user(user_id: str, db: DbSession) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
