import re
import uuid
from dataclasses import dataclass
from pathlib import Path

import httpx
from fastapi import UploadFile

from app.core.config import settings


IMAGEKIT_UPLOAD_API_URL = "https://upload.imagekit.io/api/v1/files/upload"

ALLOWED_POST_ATTACHMENT_MIME_TYPES = {
    "application/msword",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
    "text/plain",
}

ALLOWED_POST_ATTACHMENT_EXTENSIONS = {
    ".doc",
    ".docx",
    ".gif",
    ".jpeg",
    ".jpg",
    ".pdf",
    ".png",
    ".svg",
    ".txt",
    ".webp",
}


class AttachmentUploadValidationError(ValueError):
    pass


@dataclass
class UploadedPostAttachment:
    url: str
    filename: str
    content_type: str
    filesize: int


def _normalize_filename(filename: str) -> str:
    path = Path(filename)
    extension = path.suffix.lower()
    stem = re.sub(r"[^a-zA-Z0-9_-]+", "-", path.stem).strip("-").lower()
    stem = stem or "attachment"
    return f"{stem}-{uuid.uuid4().hex}{extension}"


def _matches_expected_signature(content_type: str, file_bytes: bytes) -> bool:
    head = file_bytes[:512]

    if content_type == "application/pdf":
        return head.startswith(b"%PDF-")

    if content_type == "image/png":
        return head.startswith(b"\x89PNG\r\n\x1a\n")

    if content_type == "image/jpeg":
        return head.startswith(b"\xff\xd8\xff")

    if content_type == "image/gif":
        return head.startswith((b"GIF87a", b"GIF89a"))

    if content_type == "image/webp":
        return head.startswith(b"RIFF") and head[8:12] == b"WEBP"

    if content_type == "image/svg+xml":
        text_head = head.decode("utf-8", errors="ignore").lower()
        return "<svg" in text_head

    return True


def validate_post_attachment(upload: UploadFile, file_size: int, file_bytes: bytes) -> None:
    filename = upload.filename or ""
    content_type = (upload.content_type or "").lower()
    extension = Path(filename).suffix.lower()
    max_size = settings.POST_ATTACHMENT_MAX_BYTES

    if not filename:
        raise AttachmentUploadValidationError("Attachment filename is missing.")

    if file_size <= 0:
        raise AttachmentUploadValidationError("Attachment file is empty.")

    if file_size > max_size:
        raise AttachmentUploadValidationError(
            f"Attachment exceeds {max_size // (1024 * 1024)} MB size limit."
        )

    if content_type not in ALLOWED_POST_ATTACHMENT_MIME_TYPES:
        raise AttachmentUploadValidationError("Unsupported attachment file type.")

    if extension not in ALLOWED_POST_ATTACHMENT_EXTENSIONS:
        raise AttachmentUploadValidationError("Unsupported attachment file extension.")

    if not _matches_expected_signature(content_type, file_bytes):
        raise AttachmentUploadValidationError("Attachment content does not match the declared file type.")


async def upload_post_attachment_to_imagekit(
    upload: UploadFile,
    file_bytes: bytes,
) -> UploadedPostAttachment:
    if not settings.IMAGEKIT_PRIVATE_KEY:
        raise RuntimeError("ImageKit is not configured. Missing IMAGEKIT_PRIVATE_KEY.")

    validate_post_attachment(upload, len(file_bytes), file_bytes)
    unique_filename = _normalize_filename(upload.filename or "attachment")

    data = {
        "fileName": unique_filename,
        "isPrivateFile": "false",
        "useUniqueFileName": "false",
    }

    folder = settings.IMAGEKIT_UPLOAD_FOLDER.strip()
    if folder:
        data["folder"] = folder

    async with httpx.AsyncClient(timeout=45.0) as client:
        response = await client.post(
            IMAGEKIT_UPLOAD_API_URL,
            auth=(settings.IMAGEKIT_PRIVATE_KEY, ""),
            data=data,
            files={"file": (unique_filename, file_bytes, upload.content_type or "application/octet-stream")},
        )

    if response.status_code >= 400:
        detail = "Unable to upload attachment to storage."
        try:
            payload = response.json()
            if isinstance(payload, dict) and isinstance(payload.get("message"), str):
                detail = payload["message"]
        except Exception:
            pass

        raise RuntimeError(detail)

    payload = response.json()
    url = payload.get("url") if isinstance(payload, dict) else None
    file_path = payload.get("filePath") if isinstance(payload, dict) else None

    if (not isinstance(url, str) or not url.strip()) and isinstance(file_path, str) and settings.IMAGEKIT_URL_ENDPOINT:
        url = f"{settings.IMAGEKIT_URL_ENDPOINT.rstrip('/')}/{file_path.lstrip('/')}"

    if not isinstance(url, str) or not url.strip():
        raise RuntimeError("Storage provider did not return a valid public URL.")

    return UploadedPostAttachment(
        url=url,
        filename=payload.get("name") if isinstance(payload.get("name"), str) else unique_filename,
        content_type=upload.content_type or "application/octet-stream",
        filesize=len(file_bytes),
    )
