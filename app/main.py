from fastapi import FastAPI

from app.db import import_models
from app.api.router import router

import_models()  # Ensure models are registered before any DB operations
app = FastAPI()

app.include_router(router)