from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, field_validator

from backend.config import settings
from backend.api.exceptions import FileError
from backend.services.document_service import DocumentService
from backend.utils.file_validator import FileValidator, FileStorage
from backend.utils.logger import logger

router = APIRouter()

UPLOAD_FOLDER = Path(settings.UPLOAD_DIR)
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

document_service = DocumentService()


class TextAnalysisRequest(BaseModel):
    content: str

    @field_validator("content")
    @classmethod
    def content_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Content cannot be empty")
        if len(stripped) < 10:
            raise ValueError("Content is too short (minimum 10 characters)")
        return stripped


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    file_path: Path | None = None

    try:
        contents = await file.read()
        file_size = len(contents)

        # Early size + extension check before writing to disk
        FileValidator.validate_size(file_size)
        FileValidator.validate_extension(file.filename)
        FileValidator.validate_filename(file.filename)

        safe_filename = FileStorage.get_safe_filename(file.filename)
        file_path = UPLOAD_FOLDER / safe_filename

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        logger.info("File saved: %s", file_path)

        # Deep validation after saving (signature + MIME)
        is_valid, error_msg = FileValidator.validate_all(
            filename=file.filename,
            file_size=file_size,
            file_path=str(file_path),
        )

        if not is_valid:
            raise FileError(error_msg or "File validation failed")

        logger.info("Validation passed: %s", file.filename)

        file_hash = FileStorage.get_file_hash(str(file_path))

        result = document_service.analyze_document(
            file_path=str(file_path),
            original_filename=file.filename,
            file_hash=file_hash,
        )

        logger.info("Analysis complete for: %s", file.filename)
        return result

    except (FileError, HTTPException):
        _cleanup(file_path)
        raise

    except Exception as exc:
        _cleanup(file_path)
        logger.exception("Upload failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


def _cleanup(file_path: Path | None) -> None:
    if file_path and file_path.exists():
        try:
            file_path.unlink()
        except Exception:
            pass


@router.post("/analyze-text")
async def analyze_text(request: TextAnalysisRequest):
    try:
        return document_service.analyze_text(request.content)
    except Exception as exc:
        logger.exception("Text analysis failed: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/supported-files")
def supported_files():
    return {
        "supported": [".pdf", ".docx", ".xlsx", ".pptx", ".txt"],
        "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
    }