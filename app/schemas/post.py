import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.db.enums import PostType


class PostCreateRequest(BaseModel):
    title: str
    body: str = Field(description="Rich text HTML body. Server sanitizes before persistence.")
    type: PostType


class PostResponse(BaseModel):
    id: uuid.UUID
    title: str
    body: str = Field(description="Sanitized rich text HTML body.")
    type: PostType
    author_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class PostAttachmentUploadResponse(BaseModel):
    url: str
    href: str
    filename: str
    content_type: str
    filesize: int
