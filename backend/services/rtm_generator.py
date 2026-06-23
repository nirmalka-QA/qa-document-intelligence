class RTMGenerator:

    def generate(
        self,
        requirements,
        testcases
    ):

        rtm_rows = []

        for index, req in enumerate(
            requirements,
            start=1
        ):

            req_id = (
                f"REQ-{index:03}"
            )

            related_tc = [

                tc
                for tc in testcases
                if tc.get(
                    "requirement_id"
                ) == req_id

            ]

            testcase_ids = ",".join(

                [
                    tc["testcase_id"]
                    for tc
                    in related_tc
                ]

            )

            rtm_rows.append({

                "requirement_id":
                    req_id,

                "requirement":
                    req,

                "testcase_ids":
                    testcase_ids,

                "coverage":
                    "Covered",

                "status":
                    "Mapped"
            })

        return rtm_rows