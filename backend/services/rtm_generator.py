class RTMGenerator:
    def generate(self, requirements: list, testcases: list):
        """
        Maps generated test cases back to original requirements.
        """
        rtm_matrix = []
        
        for req in requirements:
            # Handle both string requirements and JSON object requirements
            if isinstance(req, dict):
                req_id = req.get("requirement_id", "UNKNOWN")
                req_desc = req.get("description", str(req))
            else:
                req_id = "UNKNOWN"
                req_desc = str(req)

            # Find all test cases where this req_id exists in their linked_requirements array
            linked_tests = []
            for tc in testcases:
                linked_reqs = tc.get("linked_requirements", [])
                if req_id in linked_reqs or req_desc in linked_reqs:
                    linked_tests.append(tc.get("testcase_id", "TC-XXX"))

            # Determine Coverage Status
            if len(linked_tests) == 0:
                status = "Missing Coverage"
                coverage_type = "0 Tests"
            else:
                status = "Covered"
                coverage_type = f"{len(linked_tests)} Tests"

            rtm_matrix.append({
                "requirement_id": req_id,
                "requirement": req_desc,
                "testcase_ids": ", ".join(linked_tests) if linked_tests else "None",
                "coverage": coverage_type,
                "status": status
            })

        return {"rtm": rtm_matrix}