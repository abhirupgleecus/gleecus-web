from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.schemas.post import PostCreateRequest, PostResponse
from app.services.post_service import (
    create_post,
    get_posts,
    get_post_by_id,
    update_post,
    delete_post,
)
from app.api.dependencies import require_role
from app.db.session import get_db


router = APIRouter(prefix="/posts", tags=["Posts"])


# -------------------------
# CREATE POST
# -------------------------
@router.post("/", response_model=PostResponse)
async def create_post_route(
    data: PostCreateRequest,
    session: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("admin", "superadmin")),
):
    post = await create_post(
        session=session,
        title=data.title,
        body=data.body,
        post_type=data.type,
        author_id=current_user["user_id"],
    )

    return post


# -------------------------
# GET ALL POSTS
# -------------------------
@router.get("/", response_model=list[PostResponse])
async def get_all_posts(
    session: AsyncSession = Depends(get_db),
):
    return await get_posts(session)


# -------------------------
# GET SINGLE POST
# -------------------------
@router.get("/{post_id}", response_model=PostResponse)
async def get_single_post(
    post_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
):
    post = await get_post_by_id(session, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return post


# -------------------------
# UPDATE POST
# -------------------------
@router.patch("/{post_id}", response_model=PostResponse)
async def update_post_route(
    post_id: uuid.UUID,
    data: PostCreateRequest,
    session: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("admin", "superadmin")),
):
    post = await get_post_by_id(session, post_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Ownership check
    if current_user["role"] != "superadmin":
        if post.author_id != current_user["user_id"]:
            raise HTTPException(
                status_code=403,
                detail="Not allowed to modify this post",
            )

    updated = await update_post(
        session,
        post,
        data.title,
        data.body,
        data.type,
    )

    return updated


# -------------------------
# DELETE POST
# -------------------------
@router.delete("/{post_id}", status_code=204)
async def delete_post_route(
    post_id: uuid.UUID,
    session: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("admin", "superadmin")),
):
    post = await get_post_by_id(session, post_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Ownership check
    if current_user["role"] != "superadmin":
        if post.author_id != current_user["user_id"]:
            raise HTTPException(
                status_code=403,
                detail="Not allowed to delete this post",
            )

    await delete_post(session, post)