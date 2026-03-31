import asyncio

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.db.enums import UserRole
from app.core.security import hash_password
from app.core.config import settings
from app.db import import_models

import_models()


async def seed_superadmin():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.email == settings.SEED_SUPERADMIN_EMAIL)
        )
        existing = result.scalar_one_or_none()

        if existing:
            print("Superadmin already exists")
            return

        superadmin = User(
            email=settings.SEED_SUPERADMIN_EMAIL.lower(),
            username=settings.SEED_SUPERADMIN_USERNAME,
            password_hash=hash_password(settings.SEED_SUPERADMIN_PASSWORD),
            role=UserRole.SUPERADMIN,
            is_active=True,
        )

        session.add(superadmin)
        await session.commit()

        print("Superadmin created successfully")


if __name__ == "__main__":
    asyncio.run(seed_superadmin())