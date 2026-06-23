from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_testcases():
    return {
        "message": "Test Case API Running"
    }