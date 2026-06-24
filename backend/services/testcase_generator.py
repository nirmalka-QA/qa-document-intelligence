import json
import os
import google.generativeai as genai

class TestCaseGenerator:
    def __init__(self):
        # 1. Pull the API key from the environment
        api_key = os.getenv("GEMINI_API_KEY")
        
        if api_key:
            # 2. Configure the Gemini client
            genai.configure(api_key=api_key)
            
            # 3. Define the System Prompt (Instructions for the AI)
            system_prompt = """You are a Lead QA Automation Engineer. You will be provided with software requirements. Your task is to design a comprehensive test suite.

            Testing Strategy Guidelines:
            1. Generate test cases covering all requirements. Do NOT do a simple 1:1 mapping. Generate multiple cases per requirement if needed.
            2. Create End-to-End (E2E) test cases combining multiple requirements.
            3. For each requirement, generate Positive, Negative, and Boundary/Edge cases.
            4. Include Non-Functional test cases (Security, Performance, Accessibility) where applicable.
            
            For every testcase, you MUST define the "test_type" (e.g., Functional, Boundary, Security, UI/UX, Integration, Performance).

            Output strictly in valid JSON format with the following structure:
            {
              "testcases": [
                {
                  "testcase_id": "TC-001",
                  "test_title": "Validate user login with valid credentials",
                  "test_type": "Functional",
                  "priority": "High",
                  "pre_requisites": "User account must exist.",
                  "test_steps": "1. Navigate to login. 2. Enter valid email. 3. Enter password. 4. Click Login.",
                  "expected_result": "User is successfully authenticated.",
                  "linked_requirements": ["REQ-001", "REQ-002"] 
                }
              ]
            }"""
            
            # 4. Initialize the model (Using gemini-1.5-flash for high speed and free tier)
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_prompt,
                # This forces Gemini to return strict, clean JSON automatically
                generation_config={"response_mime_type": "application/json"}
            )
        else:
            self.model = None

    def generate(self, requirements):
        """
        Generates comprehensive test cases using Gemini AI based on extracted requirements.
        """
        if not self.model:
            print("WARNING: No GEMINI_API_KEY found in .env. Falling back to basic 1:1 generation.")
            return self._fallback_generate(requirements)

        try:
            # Format requirements for the AI
            if isinstance(requirements, list):
                req_payload = json.dumps(requirements, indent=2)
            else:
                req_payload = str(requirements)

            user_prompt = f"Here are the requirements to process:\n{req_payload}"

            # Call the Gemini API
            response = self.model.generate_content(user_prompt)

            # Because we used response_mime_type="application/json", the text is guaranteed to be clean JSON
            raw_content = response.text.strip()
            parsed_data = json.loads(raw_content)
            
            return parsed_data.get("testcases", [])

        except Exception as e:
            print(f"Gemini AI Generation Failed: {e}. Falling back to basic generation.")
            return self._fallback_generate(requirements)

    def _fallback_generate(self, requirements):
        """Standard 1:1 generation as a safety fallback if AI fails."""
        testcases = []
        
        if isinstance(requirements, str):
            req_list = [r.strip() for r in requirements.split('\n') if r.strip()]
        else:
            req_list = requirements

        for index, req in enumerate(req_list, start=1):
            req_text = str(req)
            testcases.append({
                "testcase_id": f"TC-{index:03}",
                "test_title": f"Validate {req_text[:50]}...",
                "test_type": "Functional",
                "pre_requisites": "Application is accessible",
                "test_steps": f"1. Trigger action for {req_text[:20]}",
                "expected_result": "System processes action successfully",
                "priority": "Medium",
                "linked_requirements": [f"REQ-{index:03}"]
            })
        return testcases