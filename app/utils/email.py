import smtplib
from email.mime.text import MIMEText

from app.core.config import settings


def send_invitation_email(to_email: str, token: str):
    # FRONTEND_BASE_URL should be a single URL; if a comma-separated value is supplied,
    # use the first origin so signup links remain valid.
    frontend_base = settings.FRONTEND_BASE_URL.split(",")[0].strip().rstrip("/")
    signup_link = f"{frontend_base}/signup?token={token}"

    subject = "You're invited!"
    body = f"""
    You have been invited to join.

    Click the link below to sign up:
    {signup_link}

    This link will expire soon.
    """

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.MAIL_FROM
    msg["To"] = to_email

    try:
        with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
            if settings.MAIL_STARTTLS:
                server.starttls()
            server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            server.send_message(msg)

    except Exception as e:
        print(f"Email failed: {e}")
