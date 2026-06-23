from pathlib import Path

from services.pdf_extractor import PDFExtractor
from services.docx_extractor import DOCXExtractor
from services.xlsx_analyzer import XLSXAnalyzer
from services.pptx_analyzer import PPTXAnalyzer

from services.requirement_analyzer import RequirementAnalyzer
from services.risk_analyzer import RiskAnalyzer
from services.gap_analyzer import GapAnalyzer
from services.testcase_generator import TestCaseGenerator
from services.rtm_generator import RTMGenerator
from services.database_service import DatabaseService


class DocumentService:

    def __init__(self):

        self.requirement_analyzer = (
            RequirementAnalyzer()
        )

        self.risk_analyzer = (
            RiskAnalyzer()
        )

        self.gap_analyzer = (
            GapAnalyzer()
        )

        self.testcase_generator = (
            TestCaseGenerator()
        )

        self.rtm_generator = (
            RTMGenerator()
        )

        self.database_service = (
            DatabaseService()
        )

    # =====================================================
    # DOCUMENT ANALYSIS
    # =====================================================

    def analyze_document(
        self,
        file_path: str
    ):

        path = Path(file_path)

        extension = (
            path.suffix.lower()
        )

        extracted_content = ""

        if extension == ".pdf":

            extracted_content = (
                PDFExtractor()
                .extract(file_path)
            )

        elif extension == ".docx":

            extracted_content = (
                DOCXExtractor()
                .extract(file_path)
            )

        elif extension == ".xlsx":

            extracted_content = (
                XLSXAnalyzer()
                .extract(file_path)
            )

        elif extension == ".pptx":

            extracted_content = (
                PPTXAnalyzer()
                .extract(file_path)
            )

        else:

            raise Exception(
                f"Unsupported file type: {extension}"
            )

        return self._process_content(
            extracted_content,
            path.name,
            extension,
            path.stat().st_size
        )

    # =====================================================
    # MANUAL TEXT ANALYSIS
    # =====================================================

    def analyze_text(
        self,
        content: str
    ):

        return self._process_content(
            content,
            "Manual Input",
            "TEXT",
            len(content)
        )

    # =====================================================
    # COMMON PROCESSING ENGINE
    # =====================================================

    def _process_content(
        self,
        content: str,
        document_name: str,
        document_type: str,
        file_size: int
    ):

        requirements = (
            self.requirement_analyzer
            .extract_requirements(
                content
            )
        )

        risks = (
            self.risk_analyzer
            .analyze(content)
        )

        gaps = (
            self.gap_analyzer
            .analyze(content)
        )

        testcases = (
            self.testcase_generator
            .generate(
                requirements
            )
        )

        rtm = (
            self.rtm_generator
            .generate(
                requirements,
                testcases
            )
        )

        document_id = (
            self.database_service
            .save_document(
                document_name,
                document_type,
                file_size
            )
        )

        self.database_service.save_requirements(
            document_id,
            requirements
        )

        self.database_service.save_risks(
            document_id,
            risks
        )

        self.database_service.save_gaps(
            document_id,
            gaps
        )

        self.database_service.save_testcases(
            document_id,
            testcases
        )

        return {

            "document_id":
                document_id,

            "document_name":
                document_name,

            "document_type":
                document_type,

            "file_size":
                file_size,

            "requirements":
                requirements,

            "business_rules":
                [],

            "validations":
                [],

            "risks":
                risks,

            "gaps":
                gaps,

            "testcases":
                testcases,

            "rtm":
                rtm,

            "generated_testcases":
                len(testcases),

            "generated_rtm":
                len(rtm),

            "extracted_text_length":
                len(content)
        }