from pathlib import Path

from backend.services.pdf_extractor import PDFExtractor
from backend.services.docx_extractor import DOCXExtractor
from backend.services.xlsx_analyzer import XLSXAnalyzer
from backend.services.pptx_analyzer import PPTXAnalyzer

from backend.services.requirement_analyzer import RequirementAnalyzer
from backend.services.risk_analyzer import RiskAnalyzer
from backend.services.gap_analyzer import GapAnalyzer
from backend.services.testcase_generator import TestCaseGenerator
from backend.services.rtm_generator import RTMGenerator
from backend.services.database_service import DatabaseService


class DocumentService:

    def __init__(self):
        # Initialize our AI-powered analyzers
        self.requirement_analyzer = RequirementAnalyzer()
        self.testcase_generator = TestCaseGenerator()
        self.rtm_generator = RTMGenerator()
        self.database_service = DatabaseService()
        
        # Note: We keep these for legacy fallback, but the new AI Requirement Analyzer
        # now handles Risks and Gaps natively in one single pass!
        self.risk_analyzer = RiskAnalyzer()
        self.gap_analyzer = GapAnalyzer()

    # =========================================================
    # FILE UPLOAD ANALYSIS
    # =========================================================

    def analyze_document(
        self,
        file_path: str,
        original_filename: str = "",
        file_hash: str = "",
    ):
        path = Path(file_path)
        extension = path.suffix.lower()

        extractors = {
            ".pdf": PDFExtractor,
            ".docx": DOCXExtractor,
            ".xlsx": XLSXAnalyzer,
            ".pptx": PPTXAnalyzer,
        }

        if extension not in extractors:
            raise ValueError(f"Unsupported file type: {extension}")

        extracted_content = extractors[extension]().extract(file_path)
        display_name = original_filename or path.name

        return self._process_content(
            content=extracted_content,
            document_name=display_name,
            document_type=extension,
            file_size=path.stat().st_size,
        )

    # =========================================================
    # TEXT / PASTE ANALYSIS
    # =========================================================

    def analyze_text(self, content: str):
        return self._process_content(
            content=content,
            document_name="Manual Input",
            document_type="TEXT",
            file_size=len(content.encode("utf-8")),
        )

    # =========================================================
    # SHARED PROCESSING ENGINE
    # =========================================================

    def _process_content(
        self,
        content: str,
        document_name: str,
        document_type: str,
        file_size: int,
    ):
        # 1. Single pass AI Extraction (Gets Reqs, Risks, and Gaps at the same time!)
        analysis_results = self.requirement_analyzer.analyze_text(content)
        
        requirements = analysis_results.get("requirements", [])
        risks = analysis_results.get("risks", [])
        gaps = analysis_results.get("gaps", [])

        # 2. AI Test Case Generation
        testcases = self.testcase_generator.generate(requirements)
        
        # 3. RTM Mapping
        rtm = self.rtm_generator.generate(requirements, testcases)

        # 4. Save to Database
        document_id = self.database_service.save_document(
            document_name, document_type, file_size
        )
        self.database_service.save_requirements(document_id, requirements)
        self.database_service.save_risks(document_id, risks)
        self.database_service.save_gaps(document_id, gaps)
        self.database_service.save_testcases(document_id, testcases)

        return {
            "document_id": document_id,
            "document_name": document_name,
            "document_type": document_type,
            "file_size": file_size,
            "requirements": requirements,
            "business_rules": [],
            "validations": [],
            "risks": risks,
            "gaps": gaps,
            "testcases": testcases,
            "rtm": rtm,
            "generated_testcases": len(testcases),
            "generated_rtm": len(rtm),
            "extracted_text_length": len(content),
        }