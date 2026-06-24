from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Union, Any

from backend.services.testcase_generator import TestCaseGenerator
from backend.services.testcase_analyzer import TestCaseAnalyzer

router = APIRouter()
generator = TestCaseGenerator()
analyzer = TestCaseAnalyzer()

# Request Models
class GenerateRequest(BaseModel):
    # Accepts either raw text string OR a structured list of requirements
    requirements: Union[str, List[Any]]

@router.get("/")
def get_testcases_status():
    return {"message": "Test Case API Running", "ai_enabled": True}

@router.post("/generate")
def generate_testcases(request: GenerateRequest):
    """Generates an AI-driven test suite based on requirements."""
    try:
        if not request.requirements:
            raise ValueError("Requirements payload cannot be empty.")
            
        testcases = generator.generate(request.requirements)
        return {
            "message": "Generation successful",
            "count": len(testcases),
            "testcases": testcases
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
def analyze_testcases(testcases: List[Any]):
    """Analyzes a generated test suite for metrics and gaps."""
    try:
        analysis = analyzer.analyze(testcases)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))