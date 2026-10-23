from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.dependencies import AdminUser, CurrentUser, DbSession
from app.models import AdminAuditLog, User, VerificationRequest
from app.schemas import (
    VerificationDecision,
    VerificationRequestCreate,
    VerificationRequestRead,
)


router = APIRouter()


@router.post("/requests", response_model=VerificationRequestRead, status_code=201)
def submit_verification_request(
    payload: VerificationRequestCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> VerificationRequest:
    if not current_user.is_student or not current_user.university_id:
        raise HTTPException(status_code=403, detail="A university student account is required")
    existing = db.scalar(
        select(VerificationRequest).where(
            VerificationRequest.user_id == current_user.id,
            VerificationRequest.status == "pending",
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="A verification request is already pending")
    request = VerificationRequest(
        user_id=current_user.id,
        university_id=current_user.university_id,
        university_email=str(payload.university_email).lower(),
        note=payload.note.strip(),
    )
    current_user.verification_status = "pending"
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


@router.get("/requests", response_model=list[VerificationRequestRead])
def list_verification_requests(
    admin: AdminUser,
    db: DbSession,
) -> list[VerificationRequest]:
    return list(
        db.scalars(
            select(VerificationRequest)
            .where(VerificationRequest.status == "pending")
            .order_by(VerificationRequest.submitted_at)
        )
    )


@router.post("/requests/{request_id}/decision", response_model=VerificationRequestRead)
def decide_verification_request(
    request_id: str,
    payload: VerificationDecision,
    admin: AdminUser,
    db: DbSession,
) -> VerificationRequest:
    request = db.get(VerificationRequest, request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Verification request not found")
    if request.status != "pending":
        raise HTTPException(status_code=409, detail="Verification request was already reviewed")
    user = db.get(User, request.user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Applicant not found")

    request.status = payload.decision
    request.reviewed_at = datetime.now(timezone.utc)
    request.reviewed_by = admin.id
    request.decision_note = payload.note.strip()
    user.verification_status = "verified" if payload.decision == "approved" else "rejected"
    db.add(
        AdminAuditLog(
            actor_id=admin.id,
            action=f"verification.{payload.decision}",
            entity_type="verification_request",
            entity_id=request.id,
            details=payload.note.strip(),
        )
    )
    db.commit()
    db.refresh(request)
    return request
