class TestCaseAnalyzer:
    def analyze(self, testcases):
        if not testcases:
            return {
                "total_testcases": 0,
                "duplicates": 0,
                "missing_expected_results": 0,
                "breakdown_by_priority": {},
                "breakdown_by_type": {}
            }

        total = len(testcases)
        
        # 1. Count test cases missing an expected result
        missing_expected = sum(1 for tc in testcases if not tc.get("expected_result", "").strip())
        
        # 2. Check for duplicate titles (ignoring case and whitespace)
        titles = [tc.get("test_title", "").lower().strip() for tc in testcases]
        duplicates = len(titles) - len(set(titles))

        # 3. Aggregate Priority and Test Types
        priorities = {}
        types = {}
        
        for tc in testcases:
            p = tc.get("priority", "Unassigned")
            t = tc.get("test_type", "Functional")
            
            priorities[p] = priorities.get(p, 0) + 1
            types[t] = types.get(t, 0) + 1

        return {
            "total_testcases": total,
            "duplicates": duplicates,
            "missing_expected_results": missing_expected,
            "breakdown_by_priority": priorities,
            "breakdown_by_type": types
        }