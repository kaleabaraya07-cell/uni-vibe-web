from fastapi import APIRouter, Query
from sqlalchemy import func, select

from app.api.dependencies import DbSession, OptionalCurrentUser
from app.api.routes.posts import _post_read, _post_statement
from app.models import Post, University, User
from app.schemas import PostRead, PublicUserRead, SearchResults, UniversityRead


router = APIRouter()


@router.get("", response_model=SearchResults)
def search(
    db: DbSession,
    current_user: OptionalCurrentUser,
    query: str = Query(default="", max_length=100),
    limit: int = Query(default=20, ge=1, le=50),
) -> SearchResults:
    cleaned = query.strip()
    if not cleaned:
        return SearchResults(vibes=[], people=[], universities=[])
    pattern = f"%{cleaned}%"
    post_rows = db.execute(
        _post_statement(current_user.id if current_user else None)
        .where(Post.caption.ilike(pattern))
        .order_by(Post.created_at.desc())
        .limit(limit)
    ).all()
    people = list(
        db.scalars(
            select(User)
            .where(
                (func.lower(User.display_name).ilike(pattern.lower()))
                | (func.lower(User.username).ilike(pattern.lower()))
            )
            .order_by(User.display_name)
            .limit(limit)
        )
    )
    universities = list(
        db.scalars(
            select(University)
            .where(
                University.is_active.is_(True),
                (func.lower(University.name).ilike(pattern.lower()))
                | (func.lower(University.short_name).ilike(pattern.lower())),
            )
            .order_by(University.name)
            .limit(limit)
        )
    )
    return SearchResults(
        vibes=[_post_read(row) for row in post_rows],
        people=[PublicUserRead.model_validate(user) for user in people],
        universities=[UniversityRead.model_validate(university) for university in universities],
    )
