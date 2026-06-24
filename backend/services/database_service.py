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

        conn = sqlite3.connect(
            self.db_path
        )

        conn.execute(
            "PRAGMA foreign_keys = ON"
        )

        return conn

    def initialize_database(self):

        # Dev migration: recreate DB schema
        if self.db_path.exists():
            self.db_path.unlink()

        conn = self.get_connection()
        cursor = conn.cursor()

        # =====================================================
        # USERS (needed for enterprise)
        # =====================================================
        cursor.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255),
            role VARCHAR(50),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP
        )
        """)

        # =====================================================
        # DOCUMENTS
        # =====================================================
        cursor.execute("""
        CREATE TABLE documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            document_name VARCHAR(255) NOT NULL,
            document_type VARCHAR(50) NOT NULL,
            file_path VARCHAR(500),
            file_size INTEGER,
            status VARCHAR(50) DEFAULT 'PENDING',
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_documents_user_id ON documents(user_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_documents_created_at ON documents(created_at)"
        )

        # =====================================================
        # REQUIREMENTS
        # =====================================================
        cursor.execute("""
        CREATE TABLE requirements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            requirement_id VARCHAR(50) NOT NULL,
            requirement_text TEXT NOT NULL,
            category VARCHAR(100),
            priority VARCHAR(50),
            status VARCHAR(50),
            confidence DECIMAL(3,2),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP,

            UNIQUE(document_id, requirement_id),
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_requirements_document_id ON requirements(document_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_requirements_requirement_id ON requirements(requirement_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_requirements_status ON requirements(status)"
        )

        # =====================================================
        # TEST CASES
        # =====================================================
        cursor.execute("""
        CREATE TABLE test_cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            testcase_id VARCHAR(50) NOT NULL,
            test_title VARCHAR(255) NOT NULL,
            pre_requisites TEXT,
            test_data TEXT,
            expected_result TEXT,
            actual_result TEXT,
            priority VARCHAR(50),
            status VARCHAR(50) DEFAULT 'DRAFT',
            overall_result VARCHAR(50),
            comments TEXT,
            requirement_id VARCHAR(50),
            release_sprint VARCHAR(50),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            UNIQUE(document_id, testcase_id)
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_test_cases_document_id ON test_cases(document_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_test_cases_testcase_id ON test_cases(testcase_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_test_cases_status ON test_cases(status)"
        )

        # =====================================================
        # TEST STEPS
        # =====================================================
        cursor.execute("""
        CREATE TABLE test_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            testcase_id INTEGER NOT NULL,
            step_number INTEGER NOT NULL,
            step_description TEXT NOT NULL,
            expected_result TEXT,
            actual_result TEXT,
            status VARCHAR(50) DEFAULT 'NOT_EXECUTED',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(testcase_id, step_number),
            FOREIGN KEY(testcase_id) REFERENCES test_cases(id) ON DELETE CASCADE
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_test_steps_testcase_id ON test_steps(testcase_id)"
        )

        # =====================================================
        # RTM mapping (optional persistence)
        # =====================================================
        cursor.execute("""
        CREATE TABLE rtm (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            requirement_id INTEGER,
            testcase_id INTEGER,
            coverage_status VARCHAR(50),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(requirement_id) REFERENCES requirements(id) ON DELETE CASCADE,
            FOREIGN KEY(testcase_id) REFERENCES test_cases(id) ON DELETE CASCADE,
            UNIQUE(requirement_id, testcase_id)
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_rtm_document_id ON rtm(document_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_rtm_requirement_id ON rtm(requirement_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_rtm_testcase_id ON rtm(testcase_id)"
        )

        # =====================================================
        # RISKS
        # =====================================================
        cursor.execute("""
        CREATE TABLE risks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            risk_text TEXT NOT NULL,
            severity VARCHAR(50),
            likelihood VARCHAR(50),
            mitigation TEXT,
            owner_id INTEGER,
            status VARCHAR(50),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(owner_id) REFERENCES users(id)
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_risks_document_id ON risks(document_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_risks_severity ON risks(severity)"
        )
        cursor.execute(
            "CREATE INDEX idx_risks_status ON risks(status)"
        )

        # =====================================================
        # GAPS
        # =====================================================
        cursor.execute("""
        CREATE TABLE gaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            gap_text TEXT NOT NULL,
            category VARCHAR(100),
            priority VARCHAR(50),
            remediation TEXT,
            owner_id INTEGER,
            status VARCHAR(50),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(owner_id) REFERENCES users(id)
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_gaps_document_id ON gaps(document_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_gaps_category ON gaps(category)"
        )
        cursor.execute(
            "CREATE INDEX idx_gaps_status ON gaps(status)"
        )

        # =====================================================
        # AUDIT + ACTIVITY LOGS (not used yet)
        # =====================================================
        cursor.execute("""
        CREATE TABLE audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            entity_type VARCHAR(100),
            entity_id INTEGER,
            action VARCHAR(50),
            changes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(50),
            user_agent TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_audit_user_id ON audit_logs(user_id)"
        )


        cursor.execute(
            "CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_audit_created_at ON audit_logs(created_at)"
        )

        cursor.execute("""
        CREATE TABLE activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER,
            user_id INTEGER,
            action_type VARCHAR(100),
            message TEXT,
            metadata TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
        """)

        cursor.execute(
            "CREATE INDEX idx_activity_document_id ON activity_logs(document_id)"
        )
        cursor.execute(
            "CREATE INDEX idx_activity_created_at ON activity_logs(created_at)"
        )

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

        # Map legacy columns -> enterprise columns
        cursor.execute(
            """
            INSERT INTO documents
            (
                document_name,
                document_type,
                file_size,
                status,
                is_active
            )
            VALUES
            (?, ?, ?, 'PENDING', 1)
            """,
            (
                document_name,
                document_type,
                file_size,
            )
        )

        conn.commit()
        document_id = cursor.lastrowid
        conn.close()
        return document_id

    def save_requirements(
        self,
        document_id,
        requirements
    ):

        conn = self.get_connection()
        cursor = conn.cursor()

        for index, req_text in enumerate(requirements, start=1):
            requirement_id = f"REQ-{index:03}"

            cursor.execute(
                """
                INSERT INTO requirements
                (
                    document_id,
                    requirement_id,
                    requirement_text,
                    is_active
                )
                VALUES
                (?, ?, ?, 1)
                """,
                (
                    document_id,
                    requirement_id,
                    req_text,
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

        for risk_text in risks:
            cursor.execute(
                """
                INSERT INTO risks
                (
                    document_id,
                    risk_text,
                    status,
                    is_active
                )
                VALUES
                (?, ?, NULL, 1)
                """,
                (
                    document_id,
                    risk_text,
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

        for gap_text in gaps:
            cursor.execute(
                """
                INSERT INTO gaps
                (
                    document_id,
                    gap_text,
                    status,
                    is_active
                )
                VALUES
                (?, ?, NULL, 1)
                """,
                (
                    document_id,
                    gap_text,
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
                INSERT INTO test_cases
                (
                    document_id,
                    testcase_id,
                    test_title,
                    pre_requisites,
                    test_data,
                    expected_result,
                    actual_result,
                    priority,
                    status,
                    overall_result,
                    comments,
                    requirement_id,
                    release_sprint,
                    is_active
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?, ?, 1)
                """,
                (
                    document_id,
                    tc["testcase_id"],
                    tc["test_title"],
                    tc["pre_requisites"],
                    tc["test_data"],
                    tc["expected_result"],
                    tc["actual_result"],
                    tc["priority"],
                    tc["overall_status"],
                    tc["comments"],
                    tc["requirement_id"],
                    tc["release_sprint"],
                )
            )

            test_case_db_id = cursor.lastrowid

            cursor.execute(
                """
                INSERT INTO test_steps
                (
                    testcase_id,
                    step_number,
                    step_description,
                    expected_result,
                    actual_result,
                    status
                )
                VALUES
                (?, ?, ?, ?, ?, ?)
                """,
                (
                    test_case_db_id,
                    tc["test_step_number"],
                    tc["test_steps"],
                    tc["expected_result"],
                    tc["actual_result"],
                    tc["test_step_status"],
                )
            )

        conn.commit()
        conn.close()

    def persist_rtm(
        self,
        document_id,
        rtm_rows,
        requirements_by_id,
        testcases_by_id
    ):
        """Persist RTM rows into rtm table.

        requirements_by_id: mapping requirement_id(str:REQ-xxx) -> requirements.id
        testcases_by_id: mapping testcase_id(str:TC-xxx) -> test_cases.id
        """

        conn = self.get_connection()
        cursor = conn.cursor()

        for row in rtm_rows:
            req_id_str = row.get("requirement_id")
            testcase_ids_csv = row.get("testcase_ids", "")

            if not req_id_str:
                continue

            requirement_db_id = requirements_by_id.get(req_id_str)
            if not requirement_db_id:
                continue

            testcase_ids = [t.strip() for t in testcase_ids_csv.split(",") if t.strip()]

            for tc_id_str in testcase_ids:
                test_case_db_id = testcases_by_id.get(tc_id_str)
                if not test_case_db_id:
                    continue

                cursor.execute(
                    """
                    INSERT OR IGNORE INTO rtm
                    (
                        document_id,
                        requirement_id,
                        testcase_id,
                        coverage_status,
                        is_active
                    )
                    VALUES
                    (?, ?, ?, ?, 1)
                    """,
                    (
                        document_id,
                        requirement_db_id,
                        test_case_db_id,
                        row.get("coverage"),
                    )
                )

        conn.commit()
        conn.close()

    def get_requirements_db_ids(self, document_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT requirement_id, id FROM requirements WHERE document_id = ?",
            (document_id,)
        )
        rows = cursor.fetchall()
        conn.close()
        return {req_id: req_db_id for req_id, req_db_id in rows}

    def get_testcases_db_ids(self, document_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT testcase_id, id FROM test_cases WHERE document_id = ?",
            (document_id,)
        )
        rows = cursor.fetchall()
        conn.close()
        return {tc_id: tc_db_id for tc_id, tc_db_id in rows}

