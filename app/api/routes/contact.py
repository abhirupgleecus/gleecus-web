from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.contact import (
    ContactCreateRequest,
    ContactResponse,
)
from app.services.contact_service import (
    create_contact_submission,
    get_contact_submissions,
)
from app.api.dependencies import require_role
from app.db.session import get_db

from app.utils.recaptcha import verify_recaptcha 


router = APIRouter(prefix="/contact", tags=["Contact"])


# -------------------------
# CREATE (GUEST ONLY)
# -------------------------
@router.post("/", response_model=ContactResponse)
async def create_contact(
    data: ContactCreateRequest,
    request: Request,
    session: AsyncSession = Depends(get_db),
):
    # 🚨 Special rule: reject if Authorization header present
    auth_header = request.headers.get("authorization")

    if auth_header:
        raise HTTPException(
            status_code=403,
            detail="Authenticated users cannot use this endpoint",
        )
    
    # 🚨 Verify reCAPTCHA
    is_valid = await verify_recaptcha(data.captcha_token)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid reCAPTCHA",
        )

    submission = await create_contact_submission(
        session=session,
        full_name=data.full_name,
        business_email=data.business_email,
        service_category=data.service_category,
        message=data.message,
    )

    return submission


# -------------------------
# GET ALL (ADMIN ONLY)
# -------------------------
@router.get("/submissions", response_model=list[ContactResponse])
async def get_submissions(
    session: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("admin", "superadmin")),
):
    return await get_contact_submissions(session)