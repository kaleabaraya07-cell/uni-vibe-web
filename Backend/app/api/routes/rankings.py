from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, select

from app.api.dependencies import DbSession
from app.models import Post, PostReaction, PostView, University
from app.schemas import RankingEntry, StudentLeagueRead
from app.services.league import calculate_post_pt


router = APIRouter()


def _metric_query(season_year: int):
    def reaction_count(kind: str):
        return (
            select(func.count(PostReaction.id))
            .where(PostReaction.post_id == Post.id, PostReaction.kind == kind)
            .correlate(Post)
            .scalar_subquery()
        )

    views = (
        select(func.count(PostView.id))
        .where(PostView.post_id == Post.id)
        .correlate(Post)
        .scalar_subquery()
    )
    return select(
        Post.id,
        Post.user_id,
        Post.university_id,
        views.label("valid_views"),
        reaction_count("like").label("likes"),
        reaction_count("save").label("saves"),
        reaction_count("repost").label("reposts"),
    ).where(Post.season_year == season_year)


@router.get("/universities", response_model=list[RankingEntry])
def university_rankings(
    db: DbSession,
    season_year: int = Query(default_factory=lambda: datetime.now(timezone.utc).year, ge=2000, le=2200),
) -> list[RankingEntry]:
    points: dict[str, Decimal] = defaultdict(Decimal)
    for row in db.execute(_metric_query(season_year)):
        points[row.university_id] += calculate_post_pt(
            valid_views=row.valid_views,
            likes=row.likes,
            saves=row.saves,
            reposts=row.reposts,
        )

    universities = {
        university.id: university
        for university in db.scalars(
            select(University).where(University.id.in_(points.keys()))
        )
    } if points else {}
    entries = [
        RankingEntry(
            university_id=university_id,
            name=universities[university_id].name,
            season_year=season_year,
            points=f"{score:.2f}",
        )
        for university_id, score in points.items()
        if university_id in universities
    ]
    return sorted(entries, key=lambda entry: (-Decimal(entry.points), entry.name))


@router.get("/students", response_model=list[dict[str, str]])
def student_rankings(
    db: DbSession,
    season_year: int = Query(default_factory=lambda: datetime.now(timezone.utc).year, ge=2000, le=2200),
    limit: int = Query(default=20, ge=1, le=100),
) -> list[dict[str, str | None]]:
    points: dict[str, Decimal] = defaultdict(Decimal)
    for row in db.execute(_metric_query(season_year)):
        points[row.user_id] += calculate_post_pt(
            valid_views=row.valid_views,
            likes=row.likes,
            saves=row.saves,
            reposts=row.reposts,
        )
    if not points:
        return []
    from app.models import User

    users = {
        user.id: user
        for user in db.scalars(select(User).where(User.id.in_(points.keys())))
    }
    ranked = sorted(points.items(), key=lambda item: (-item[1], users[item[0]].display_name))
    return [
        {
            "user_id": user_id,
            "display_name": users[user_id].display_name,
            "university_id": users[user_id].university_id,
            "season_year": str(season_year),
            "points": f"{score:.2f}",
        }
        for user_id, score in ranked
        if user_id in users
    ][:limit]


@router.get("/students/{user_id}", response_model=StudentLeagueRead)
def student_league(
    user_id: str,
    db: DbSession,
    season_year: int = Query(default_factory=lambda: datetime.now(timezone.utc).year, ge=2000, le=2200),
) -> StudentLeagueRead:
    from app.models import User

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    students: dict[str, Decimal] = defaultdict(Decimal)
    universities: dict[str, Decimal] = defaultdict(Decimal)
    for row in db.execute(_metric_query(season_year)):
        score = calculate_post_pt(
            valid_views=row.valid_views,
            likes=row.likes,
            saves=row.saves,
            reposts=row.reposts,
        )
        students[row.user_id] += score
        universities[row.university_id] += score

    student_order = sorted(
        students.items(),
        key=lambda item: (-item[1], db.get(User, item[0]).display_name),
    )
    university_order = sorted(
        universities.items(),
        key=lambda item: (
            -item[1],
            db.get(University, item[0]).name if db.get(University, item[0]) else "",
        ),
    )
    student_points = students.get(user_id, Decimal("0.00"))
    university_points = universities.get(user.university_id, Decimal("0.00"))
    return StudentLeagueRead(
        user_id=user.id,
        season_year=season_year,
        points=f"{student_points:.2f}",
        rank=next((index for index, (ranked_id, _) in enumerate(student_order, 1) if ranked_id == user_id), None),
        university_id=user.university_id,
        university_rank=next(
            (
                index
                for index, (ranked_id, _) in enumerate(university_order, 1)
                if ranked_id == user.university_id
            ),
            None,
        ),
        university_points=f"{university_points:.2f}",
    )
