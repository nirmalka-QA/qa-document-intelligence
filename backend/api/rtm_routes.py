from fastapi import (
    APIRouter
)

from backend.services.rtm_generator import RTMGenerator


router = APIRouter()

rtm_service = (
    RTMGenerator()
)


@router.post(
    "/generate"
)
async def generate_rtm(
    payload: dict,
):

    requirements = (
        payload.get(
            "requirements",
            []
        )
    )

    testcases = (
        payload.get(
            "testcases",
            []
        )
    )

    rtm_rows = (
        rtm_service
        .generate(
            requirements,
            testcases
        )
    )

    # Persist RTM into DB if payload contains document_id
    document_id = payload.get("document_id")
    if document_id is not None:
        from backend.services.database_service import DatabaseService
        db = DatabaseService()

        requirements_by_id = db.get_requirements_db_ids(document_id)
        testcases_by_id = db.get_testcases_db_ids(document_id)

        db.persist_rtm(
            document_id=document_id,
            rtm_rows=rtm_rows,
            requirements_by_id=requirements_by_id,
            testcases_by_id=testcases_by_id,
        )

    return {
        "rtm": rtm_rows
    }
