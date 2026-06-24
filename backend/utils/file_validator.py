import hashlib
import uuid
from pathlib import Path
from typing import Optional, Tuple

try:
    import magic  # python-magic
except ModuleNotFoundError:  # pragma: no cover
    magic = None


from backend.config import settings


ALLOWED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".pptx", ".txt"}
ALLOWED_MIMETYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
}


class FileValidationError(Exception):
    pass


class FileValidator:
    @staticmethod
    def validate_extension(filename: str) -> str:
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise FileValidationError(f"Extension {ext} not allowed")
        return ext

    @staticmethod
    def validate_filename(filename: str) -> str:
        # Remove path separators
        cleaned = filename.replace("\\", "").replace("/", "")
        if not cleaned or cleaned in {".", ".."}:
            raise FileValidationError("Invalid filename")

        # Check for traversal
        if ".." in cleaned or cleaned.startswith("/"):
            raise FileValidationError("Invalid filename")

        return cleaned[:255]

    @staticmethod
    def validate_size(file_size: int) -> None:
        if file_size == 0:
            raise FileValidationError("File is empty")
        if file_size > settings.MAX_FILE_SIZE:
            mb = settings.MAX_FILE_SIZE / (1024 * 1024)
            raise FileValidationError(f"File exceeds {mb:.0f}MB limit")

    @staticmethod
    def validate_signature(file_path: str) -> None:
        with open(file_path, "rb") as f:
            header = f.read(4)

        signatures = [
            b"%PDF",  # PDF
            b"PK\x03\x04",  # OOXML zip
            b"\xd0\xcf\x11\xe0",  # OLE2 older Office
            b"\xef\xbb\xbf\x00",  # (rare) utf-8 bom patterns
        ]

        if not any(header.startswith(sig) for sig in signatures):
            raise FileValidationError("Invalid file signature")

    @staticmethod
    def validate_mimetype(file_path: str) -> None:
        # If python-magic isn't available, we can't reliably validate MIME.
        # Keep validation strict enough via extension + signature.
        if magic is None:
            return

        mime = magic.Magic(mime=True).from_file(file_path)
        if mime not in ALLOWED_MIMETYPES:
            # Allow text/*
            if not mime.startswith("text/"):
                raise FileValidationError(f"MIME {mime} not allowed")


    @staticmethod
    def validate_all(
        filename: str, file_size: int, file_path: str
    ) -> Tuple[bool, Optional[str]]:
        try:
            FileValidator.validate_extension(filename)
            FileValidator.validate_filename(filename)
            FileValidator.validate_size(file_size)
            FileValidator.validate_signature(file_path)
            FileValidator.validate_mimetype(file_path)
            return True, None
        except FileValidationError as e:
            return False, str(e)


class FileStorage:
    @staticmethod
    def get_safe_filename(original_filename: str) -> str:
        ext = Path(original_filename).suffix.lower()
        return f"{uuid.uuid4().hex}{ext}"

    @staticmethod
    def get_file_hash(file_path: str) -> str:
        sha = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha.update(chunk)
        return sha.hexdigest()

