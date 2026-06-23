from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():

    return {
        "status": "healthy",
        "message": "QA Document Intelligence Platform"
    }