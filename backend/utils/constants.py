from pydantic import BaseModel


class RTMResponse(BaseModel):

    requirement: str

    testcase: str

    status: str