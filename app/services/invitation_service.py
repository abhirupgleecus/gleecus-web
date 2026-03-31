import uuid
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.invitation import Invitation
from app.utils.email import send_invitation_email


async def create_invitation(
    session: AsyncSession,
    email: str,
    role,
) -> Invitation:
    email = email.lower()

    token = uuid.uuid4()

    invitation = Invitation(
        email=email,
        role=role,
        token=token,
        is_used=False,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(hours=48),
    )

    session.add(invitation)
    await session.commit()
    await session.refresh(invitation)

    send_invitation_email(email, str(token))

    return invitation