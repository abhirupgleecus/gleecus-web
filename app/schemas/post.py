import uuid
from datetime import datetime

from pydantic import BaseModel

from app.db.enums import PostType


class PostCreateRequest(BaseModel):
    title: str
    body: str
    type: PostType


class PostResponse(BaseModel):
    id: uuid.UUID
    title: str
    body: str
    type: PostType
    author_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True