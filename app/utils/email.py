import smtplib
from email.mime.text import MIMEText

from app.core.config import settings


def send_invitation_email(to_email: str, token: str):
    signup_link = f"{settings.FRONTEND_BASE_URL}/signup?token={token}"

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