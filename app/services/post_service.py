from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.post import Post


async def create_post(
    session: AsyncSession,
    title: str,
    body: str,
    post_type,
    author_id,
) -> Post:
    post = Post(
        title=title,
        body=body,
        type=post_type,
        author_id=author_id,
    )

    session.add(post)
    await session.commit()
    await session.refresh(post)

    return post


async def get_posts(session: AsyncSession):
    result = await session.execute(select(Post))
    return result.scalars().all()


async def get_post_by_id(session: AsyncSession, post_id):
    result = await session.execute(
        select(Post).where(Post.id == post_id)
    )
    return result.scalar_one_or_none()


async def update_post(
    session: AsyncSession,
    post,
    title: str,
    body: str,
    post_type,
):
    post.title = title
    post.body = body
    post.type = post_type

    await session.commit()
    await session.refresh(post)

    return post


async def delete_post(
    session: AsyncSession,
    post,
):
    await session.delete(post)
    await session.commit()