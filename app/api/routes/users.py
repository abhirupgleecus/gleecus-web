from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.schemas.user import UserResponse
from app.services.user_service import (
    get_users,
    get_user_by_id,
    delete_user,
)
from app.api.dependencies import require_role
from app.db.session import get_db


router = APIRouter(prefix="/users", tags=["Users"])


# -------------------------
# GET USERS (SUPERADMIN ONLY)
# -------------------------
@router.get("/", response_model=list[UserResponse])
async def list_users(
    session: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("superadmin")),
):
    return await get_users(session)


# -------------------------
# DELETE USER
# -------------------------
@router.delete("/{user_id}", status_code=204)
async def delete_user_route(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("superadmin")),
):
    user = await get_user_by_id(session, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 🚨 Cannot delete self
    if user.id == current_user["user_id"]:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    await delete_user(session, user)