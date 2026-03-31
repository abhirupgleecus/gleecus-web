import uuid
from datetime import datetime

from pydantic import BaseModel

from app.db.enums import UserRole


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    username: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True