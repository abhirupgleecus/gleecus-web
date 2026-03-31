import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.invitation import Invitation
from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
)


# -------------------------
# LOGIN
# -------------------------
async def login_user(
    session: AsyncSession,
    email: str,
    password: str,
) -> str:
    email = email.lower()

    result = await session.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise ValueError("Invalid credentials")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role.value,
    })

    return token


# -------------------------
# SIGNUP (INVITE-BASED)
# -------------------------
async def signup_user(
    session: AsyncSession,
    token: str,
    username: str,
    password: str,
) -> str:
    # Validate token format
    try:
        token_uuid = uuid.UUID(token)
    except ValueError:
        raise ValueError("Invalid invitation token")

    result = await session.execute(
        select(Invitation).where(Invitation.token == token_uuid)
    )
    invitation = result.scalar_one_or_none()

    if invitation is None:
        raise ValueError("Invitation not found")

    if invitation.is_used:
        raise ValueError("Invitation already used")

    if invitation.expires_at < datetime.utcnow():
        raise ValueError("Invitation expired")

    email = invitation.email.lower()

    # Check if user already exists
    result = await session.execute(
        select(User).where(User.email == email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise ValueError("User already exists")

    # Create user
    new_user = User(
        email=email,
        username=username,
        password_hash=hash_password(password),
        role=invitation.role,
    )

    session.add(new_user)

    # Mark invitation as used
    invitation.is_used = True

    await session.commit()

    # Generate token
    token = create_access_token({
        "sub": str(new_user.id),
        "role": new_user.role.value,
    })

    return token