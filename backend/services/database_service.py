import sqlite3
from pathlib import Path


class DatabaseService:

    def __init__(self):

        self.db_path = (
            Path("database")
            / "qa.db"
        )

        self.db_path.parent.mkdir(
            exist_ok=True
        )

        self.initialize_database()

    def get_connection(self):

        return sqlite3.connect(
            self.db_path
        )

    def initialize_database(self):

        conn = self.get_connection()

        cursor = conn.cursor()

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            document_name TEXT,

            document_type TEXT,

            file_size INTEGER,

            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS requirements (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            document_id INTEGER,

            requirement_text TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS risks (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            document_id INTEGER,

            risk_text TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS gaps (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            document_id INTEGER,

            gap_text TEXT
        )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS testcases (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            document_id INTEGER,

            testcase_id TEXT,

            test_title TEXT,

            pre_requisites TEXT,

            test_data TEXT,

            test_step_number INTEGER,

            test_steps TEXT,

            expected_result TEXT,

            actual_result TEXT,

            test_step_status TEXT,

            overall_status TEXT,

            priority TEXT,

            comments TEXT,

            requirement_id TEXT,

            release_sprint TEXT
        )
        """)

        conn.commit()
        conn.close()

    def save_document(
        self,
        document_name,
        document_type,
        file_size
    ):

        conn = self.get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO documents
            (
                document_name,
                document_type,
                file_size
            )
            VALUES
            (?, ?, ?)
            """,
            (
                document_name,
                document_type,
                file_size
            )
        )

        conn.commit()

        document_id = (
            cursor.lastrowid
        )

        conn.close()

        return document_id

    def save_requirements(
        self,
        document_id,
        requirements
    ):

        conn = self.get_connection()

        cursor = conn.cursor()

        for req in requirements:

            cursor.execute(
                """
                INSERT INTO requirements
                (
                    document_id,
                    requirement_text
                )
                VALUES
                (?, ?)
                """,
                (
                    document_id,
                    req
                )
            )

        conn.commit()
        conn.close()

    def save_risks(
        self,
        document_id,
        risks
    ):

        conn = self.get_connection()

        cursor = conn.cursor()

        for risk in risks:

            cursor.execute(
                """
                INSERT INTO risks
                (
                    document_id,
                    risk_text
                )
                VALUES
                (?, ?)
                """,
                (
                    document_id,
                    risk
                )
            )

        conn.commit()
        conn.close()

    def save_gaps(
        self,
        document_id,
        gaps
    ):

        conn = self.get_connection()

        cursor = conn.cursor()

        for gap in gaps:

            cursor.execute(
                """
                INSERT INTO gaps
                (
                    document_id,
                    gap_text
                )
                VALUES
                (?, ?)
                """,
                (
                    document_id,
                    gap
                )
            )

        conn.commit()
        conn.close()

    def save_testcases(
        self,
        document_id,
        testcases
    ):

        conn = self.get_connection()

        cursor = conn.cursor()

        for tc in testcases:

            cursor.execute(
                """
                INSERT INTO testcases
                (
                    document_id,
                    testcase_id,
                    test_title,
                    pre_requisites,
                    test_data,
                    test_step_number,
                    test_steps,
                    expected_result,
                    actual_result,
                    test_step_status,
                    overall_status,
                    priority,
                    comments,
                    requirement_id,
                    release_sprint
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    document_id,
                    tc["testcase_id"],
                    tc["test_title"],
                    tc["pre_requisites"],
                    tc["test_data"],
                    tc["test_step_number"],
                    tc["test_steps"],
                    tc["expected_result"],
                    tc["actual_result"],
                    tc["test_step_status"],
                    tc["overall_status"],
                    tc["priority"],
                    tc["comments"],
                    tc["requirement_id"],
                    tc["release_sprint"]
                )
            )

        conn.commit()
        conn.close()