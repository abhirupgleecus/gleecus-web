from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.auth import LoginRequest, LoginResponse, SignupRequest
from app.services.auth_service import login_user, signup_user
from app.db.session import get_db


router = APIRouter(prefix="/auth", tags=["Auth"])


# -------------------------
# LOGIN
# -------------------------
@router.post("/login", response_model=LoginResponse)
async def login(
    data: LoginRequest,
    session: AsyncSession = Depends(get_db),
):
    try:
        token = await login_user(
            session=session,
            email=data.email,
            password=data.password,
        )
        return {"access_token": token}

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )


# -------------------------
# SIGNUP (INVITE-BASED)
# -------------------------
@router.post("/signup", response_model=LoginResponse)
async def signup(
    data: SignupRequest,
    token: str,
    session: AsyncSession = Depends(get_db),
):
    try:
        access_token = await signup_user(
            session=session,
            token=token,
            username=data.username,
            password=data.password,
        )
        return {"access_token": access_token}

    except ValueError as e:
        message = str(e)

        if message == "Invitation not found":
            raise HTTPException(status_code=404, detail=message)

        elif message == "Invitation already used":
            raise HTTPException(status_code=409, detail=message)

        elif message == "Invitation expired":
            raise HTTPException(status_code=410, detail=message)

        elif message == "User already exists":
            raise HTTPException(status_code=409, detail=message)

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )