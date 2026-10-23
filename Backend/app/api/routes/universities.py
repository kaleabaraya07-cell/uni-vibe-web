from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select

from app.api.dependencies import DbSession
from app.models import University, UniversityRequest
from app.schemas import UniversityRead, UniversityRequestCreate, UniversityRequestRead


router = APIRouter()


@router.get("", response_model=list[UniversityRead])
def list_universities(
    db: DbSession,
    limit: int = Query(default=100, ge=1, le=200),
) -> list[University]:
    return list(
        db.scalars(
            select(University)
            .where(University.is_active.is_(True))
            .order_by(University.name)
            .limit(limit)
        )
    )


@router.get("/{university_id}", response_model=UniversityRead)
def get_university(university_id: str, db: DbSession) -> University:
    university = db.get(University, university_id)
    if university is None or not university.is_active:
        raise HTTPException(status_code=404, detail="University not found")
    return university


@router.post(
    "/requests",
    response_model=UniversityRequestRead,
    status_code=status.HTTP_201_CREATED,
)
def request_university(
    payload: UniversityRequestCreate,
    db: DbSession,
) -> UniversityRequest:
    request = UniversityRequest(
        name=payload.name.strip(),
        location=payload.location.strip(),
        website=payload.website,
        applicant_email=str(payload.applicant_email).lower(),
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request
