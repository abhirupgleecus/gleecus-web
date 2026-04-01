from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import import_models
from app.api.router import router
from app.core.config import settings


# Ensure models are registered before any DB operations.
import_models()


def _build_allowed_origins() -> list[str]:
    raw = settings.FRONTEND_ALLOWED_ORIGINS or settings.FRONTEND_BASE_URL or ""
    origins = [item.strip().rstrip("/") for item in raw.split(",") if item.strip()]

    # Keep local development origins enabled unless explicitly blocked.
    defaults = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    for origin in defaults:
        if origin not in origins:
            origins.append(origin)

    return origins


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=_build_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
