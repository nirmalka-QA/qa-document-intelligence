from typing import List
from pydantic import BaseModel


class AnalysisResponse(BaseModel):

    document_name: str
    document_type: str
    file_size: int

    requirements: List[str]
    business_rules: List[str]
    validations: List[str]

    risks: List[str]
    gaps: List[str]

    generated_testcases: int

    extracted_text_length: int