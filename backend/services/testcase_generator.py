class TestCaseGenerator:

    def generate(
        self,
        requirements
    ):

        testcases = []

        for index, req in enumerate(
            requirements,
            start=1
        ):

            testcases.append({

                "testcase_id":
                    f"TC-{index:03}",

                "test_title":
                    f"Validate {req}",

                "pre_requisites":
                    "Application is available and user has access",

                "test_data":
                    "Valid Input Data",

                "test_step_number":
                    1,

                "test_steps":
                    f"Verify {req}",

                "expected_result":
                    f"{req} should work successfully",

                "actual_result":
                    "",

                "test_step_status":
                    "Not Executed",

                "overall_status":
                    "Not Executed",

                "priority":
                    "Medium",

                "comments":
                    "",

                "requirement_id":
                    f"REQ-{index:03}",

                "release_sprint":
                    "Sprint-1"
            })

        return testcases