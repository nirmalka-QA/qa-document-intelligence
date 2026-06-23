from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from pydantic import BaseModel

from services.document_service import (
    DocumentService
)

router = APIRouter()

UPLOAD_FOLDER = Path(
    "uploads"
)

UPLOAD_FOLDER.mkdir(
    exist_ok=True
)

MAX_FILE_SIZE = (
    200 * 1024 * 1024
)

document_service = (
    DocumentService()
)


class TextAnalysisRequest(
    BaseModel
):
    content: str


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    try:

        contents = (
            await file.read()
        )

        if len(contents) > MAX_FILE_SIZE:

            raise HTTPException(
                status_code=413,
                detail="File exceeds 200 MB limit"
            )

        file_path = (
            UPLOAD_FOLDER /
            file.filename
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            buffer.write(
                contents
            )

        return (
            document_service
            .analyze_document(
                str(file_path)
            )
        )

    except HTTPException:

        raise

    except Exception as ex:

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


@router.get(
    "/supported-files"
)
def supported_files():

    return {

        "supported": [

            ".pdf",
            ".docx",
            ".xlsx",
            ".pptx",
            ".txt"
        ],

        "max_file_size_mb":
            200
    }