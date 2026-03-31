import httpx

from app.core.config import settings


async def verify_recaptcha(token: str) -> bool:
    url = "https://www.google.com/recaptcha/api/siteverify"

    data = {
        "secret": settings.RECAPTCHA_SECRET_KEY,
        "response": token,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data)
        result = response.json()

    return result.get("success", False)