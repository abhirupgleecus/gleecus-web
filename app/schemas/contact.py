import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class ContactCreateRequest(BaseModel):
    full_name: str
    business_email: EmailStr
    service_category: str | None = None
    message: str
    captcha_token: str


class ContactResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    business_email: str
    service_category: str | None
    message: str
    submitted_at: datetime

    class Config:
        from_attributes = True