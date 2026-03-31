from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.invitation import (
    InvitationCreateRequest,
    InvitationResponse,
)
from app.services.invitation_service import create_invitation
from app.api.dependencies import require_role
from app.db.session import get_db


router = APIRouter(prefix="/invitations", tags=["Invitations"])


@router.post("/", response_model=InvitationResponse)
async def create_invite(
    data: InvitationCreateRequest,
    session: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("superadmin")),
):
    invitation = await create_invitation(
        session=session,
        email=data.email,
        role=data.role,
    )

    return invitation