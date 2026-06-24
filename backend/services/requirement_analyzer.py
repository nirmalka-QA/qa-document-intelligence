import json
import os
import google.generativeai as genai

class RequirementAnalyzer:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            system_prompt = """You are an Expert Business Analyst. Analyze the provided text/document and extract all software requirements, project risks, and functional gaps.
            
            Output strictly in valid JSON format with this exact structure:
            {
              "requirements": [
                {
                  "requirement_id": "REQ-001",
                  "description": "The system shall...",
                  "type": "Functional"
                }
              ],
              "risks": ["Risk 1 description...", "Risk 2 description..."],
              "gaps": ["Gap 1 description..."]
            }"""
            
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_prompt,
                generation_config={"response_mime_type": "application/json"}
            )
        else:
            self.model = None

    def analyze_text(self, text: str):
        if not self.model:
            return self._fallback_analyze(text)

        try:
            response = self.model.generate_content(f"Extract intelligence from this document:\n\n{text}")
            parsed_data = json.loads(response.text.strip())
            
            return {
                "requirements": parsed_data.get("requirements", []),
                "risks": parsed_data.get("risks", []),
                "gaps": parsed_data.get("gaps", [])
            }
        except Exception as e:
            print(f"Requirement Extraction Failed: {e}")
            return self._fallback_analyze(text)

    def _fallback_analyze(self, text: str):
        # Safety fallback if AI fails
        lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 10]
        reqs = [{"requirement_id": f"REQ-{i+1:03d}", "description": line, "type": "Functional"} for i, line in enumerate(lines[:20])]
        return {"requirements": reqs, "risks": ["AI Analysis Unavailable"], "gaps": []}