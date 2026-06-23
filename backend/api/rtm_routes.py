from fastapi import (
    APIRouter
)

from services.rtm_generator import (
    RTMGenerator
)

router = APIRouter()

rtm_service = (
    RTMGenerator()
)


@router.post(
    "/generate"
)
async def generate_rtm(
    payload: dict
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

    return {

        "rtm":
            rtm_service
            .generate(
                requirements,
                testcases
            )
    }