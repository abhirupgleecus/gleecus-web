from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int

    # Database
    DATABASE_URL: str

    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool

    # Frontend
    FRONTEND_BASE_URL: str

    # Seed
    SEED_SUPERADMIN_EMAIL: str
    SEED_SUPERADMIN_USERNAME: str
    SEED_SUPERADMIN_PASSWORD: str

    # Recaptcha
    RECAPTCHA_SECRET_KEY: str

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()