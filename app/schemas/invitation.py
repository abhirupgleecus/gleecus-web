import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.db.enums import UserRole


class InvitationCreateRequest(BaseModel):
    email: EmailStr
    role: UserRole


class InvitationResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: UserRole
    is_used: bool
    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True