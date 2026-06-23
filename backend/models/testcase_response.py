from pydantic import BaseModel


class TestCaseResponse(BaseModel):

    testcase_id: str

    test_title: str

    pre_requisites: str

    test_data: str

    test_step_number: int

    test_steps: str

    expected_result: str

    actual_result: str

    test_step_status: str

    overall_status: str

    priority: str

    comments: str

    requirement_id: str

    release_sprint: str