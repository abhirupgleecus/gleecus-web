from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact_submission import ContactSubmission


async def create_contact_submission(
    session: AsyncSession,
    full_name: str,
    business_email: str,
    service_category: str | None,
    message: str,
) -> ContactSubmission:
    submission = ContactSubmission(
        full_name=full_name,
        business_email=business_email,
        service_category=service_category,
        message=message,
    )

    session.add(submission)
    await session.commit()
    await session.refresh(submission)

    return submission


async def get_contact_submissions(session: AsyncSession):
    result = await session.execute(select(ContactSubmission))
    return result.scalars().all()