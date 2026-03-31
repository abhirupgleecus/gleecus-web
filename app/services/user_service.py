from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


async def get_users(session: AsyncSession):
    result = await session.execute(select(User))
    return result.scalars().all()


async def get_user_by_id(session: AsyncSession, user_id):
    result = await session.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def delete_user(session: AsyncSession, user: User):
    await session.delete(user)
    await session.commit()