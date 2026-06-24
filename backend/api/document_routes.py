from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from backend.config import settings
from backend.api.exceptions import FileError
from backend.services.document_service import DocumentService
from backend.utils.file_validator import FileValidator, FileStorage
from backend.utils.logger import logger

router = APIRouter()

UPLOAD_FOLDER = Path(settings.UPLOAD_DIR)
UPLOAD_FOLDER.mkdir(exist_ok=True)

document_service = DocumentService()


class TextAnalysisRequest(
    BaseModel
):
    content: str


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    if not file.filename:
        raise FileError(
            "No filename provided"
        )

    try:

        contents = await file.read()

        file_size = len(contents)

        # Validation

        FileValidator.validate_extension(
            file.filename
        )

        FileValidator.validate_filename(
            file.filename
        )

        FileValidator.validate_size(
            file_size
        )

        # Safe filename

        safe_filename = (
            FileStorage.get_safe_filename(
                file.filename
            )
        )

        file_path = (
            UPLOAD_FOLDER /
            safe_filename
        )

        # Save file

        with open(
            file_path,
            "wb"
        ) as buffer:

            buffer.write(
                contents
            )

        print(
            f"STEP 1: File Saved -> {file_path}"
        )

        # Deep validation

        is_valid, error_msg = (
            FileValidator.validate_all(
                filename=file.filename,
                file_size=file_size,
                file_path=str(
                    file_path
                ),
            )
        )

        if not is_valid:

            try:
                file_path.unlink()
            except Exception:
                pass

            raise FileError(
                error_msg
            )

        print(
            "STEP 2: Validation Passed"
        )

        # File hash

        file_hash = (
            FileStorage.get_file_hash(
                str(file_path)
            )
        )

        print(
            "STEP 3: Calling Document Service"
        )

        result = (
            document_service
            .analyze_document(
                file_path=str(
                    file_path
                ),
                original_filename=file.filename,
                file_hash=file_hash,
            )
        )

        print(
            "STEP 4: Analysis Complete"
        )

        return result

    except FileError as ex:

        logger.exception(
            f"File Validation Error: {ex}"
        )

        raise HTTPException(
            status_code=400,
            detail=str(ex)
        )

    except HTTPException:
        raise

    except Exception as ex:

        import traceback

        traceback.print_exc()

        logger.exception(
            f"Upload failed: {ex}"
        )

        try:

            if (
                'file_path' in locals()
                and file_path.exists()
            ):
                file_path.unlink()

        except Exception:
            pass

        raise HTTPException(
            status_code=500,
            detail=str(ex)
        )


@router.post("/analyze-text")
async def analyze_text(
    request:
    TextAnalysisRequest
):

    return (
        document_service
        .analyze_text(
            request.content
        )
    )


@router.get("/supported-files")
def supported_files():
    return {
        "supported": [".pdf", ".docx", ".xlsx", ".pptx", ".txt"],
        "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
    }
