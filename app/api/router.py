from fastapi import APIRouter

from app.api.routes import auth
from app.api.routes import invitations
from app.api.routes import posts
from app.api.routes import contact
from app.api.routes import users


router = APIRouter()

router.include_router(auth.router)
router.include_router(invitations.router)
router.include_router(posts.router)
router.include_router(contact.router)
router.include_router(users.router)