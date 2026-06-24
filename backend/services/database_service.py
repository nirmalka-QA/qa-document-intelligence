import sqlite3
from pathlib import Path


class DatabaseService:

    def __init__(self):
        self.db_path = Path("database") / "qa.db"
        self.db_path.parent.mkdir(exist_ok=True)
        self._initialize_database()

    # =========================================================
    # CONNECTION
    # =========================================================

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row
        return conn

    # =========================================================
    # SCHEMA — CREATE IF NOT EXISTS (safe on every restart)
    # =========================================================

    def _initialize_database(self) -> None:
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            username    VARCHAR(255) UNIQUE NOT NULL,
            email       VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name   VARCHAR(255),
            role        VARCHAR(50),
            is_active   BOOLEAN DEFAULT 1,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at  TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS documents (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         INTEGER,
            document_name   VARCHAR(255) NOT NULL,
            document_type   VARCHAR(50)  NOT NULL,
            file_path       VARCHAR(500),
            file_size       INTEGER,
            status          VARCHAR(50) DEFAULT 'PENDING',
            is_active       BOOLEAN DEFAULT 1,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at      TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS requirements (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id      INTEGER NOT NULL,
            requirement_id   VARCHAR(50) NOT NULL,
            requirement_text TEXT NOT NULL,
            category         VARCHAR(100),
            priority         VARCHAR(50),
            status           VARCHAR(50),
            confidence       REAL,
            is_active        BOOLEAN DEFAULT 1,
            created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at       TIMESTAMP,
            UNIQUE(document_id, requirement_id),
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS test_cases (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id     INTEGER NOT NULL,
            testcase_id     VARCHAR(50) NOT NULL,
            test_title      VARCHAR(255) NOT NULL,
            pre_requisites  TEXT,
            test_data       TEXT,
            expected_result TEXT,
            actual_result   TEXT,
            priority        VARCHAR(50),
            status          VARCHAR(50) DEFAULT 'DRAFT',
            overall_result  VARCHAR(50),
            comments        TEXT,
            requirement_id  VARCHAR(50),
            release_sprint  VARCHAR(50),
            is_active       BOOLEAN DEFAULT 1,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at      TIMESTAMP,
            UNIQUE(document_id, testcase_id),
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS test_steps (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            testcase_id      INTEGER NOT NULL,
            step_number      INTEGER NOT NULL,
            step_description TEXT NOT NULL,
            expected_result  TEXT,
            actual_result    TEXT,
            status           VARCHAR(50) DEFAULT 'NOT_EXECUTED',
            created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(testcase_id, step_number),
            FOREIGN KEY(testcase_id) REFERENCES test_cases(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS rtm (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id     INTEGER NOT NULL,
            requirement_id  INTEGER,
            testcase_id     INTEGER,
            coverage_status VARCHAR(50),
            is_active       BOOLEAN DEFAULT 1,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(requirement_id, testcase_id),
            FOREIGN KEY(document_id)    REFERENCES documents(id)    ON DELETE CASCADE,
            FOREIGN KEY(requirement_id) REFERENCES requirements(id) ON DELETE CASCADE,
            FOREIGN KEY(testcase_id)    REFERENCES test_cases(id)   ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS risks (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            risk_text   TEXT NOT NULL,
            severity    VARCHAR(50),
            likelihood  VARCHAR(50),
            mitigation  TEXT,
            owner_id    INTEGER,
            status      VARCHAR(50),
            is_active   BOOLEAN DEFAULT 1,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at  TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(owner_id)    REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS gaps (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            gap_text    TEXT NOT NULL,
            category    VARCHAR(100),
            priority    VARCHAR(50),
            remediation TEXT,
            owner_id    INTEGER,
            status      VARCHAR(50),
            is_active   BOOLEAN DEFAULT 1,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at  TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(owner_id)    REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER,
            entity_type VARCHAR(100),
            entity_id   INTEGER,
            action      VARCHAR(50),
            changes     TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address  VARCHAR(50),
            user_agent  TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS activity_logs (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER,
            user_id     INTEGER,
            action_type VARCHAR(100),
            message     TEXT,
            metadata    TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE,
            FOREIGN KEY(user_id)     REFERENCES users(id)
        );
        """)

        # Indexes — CREATE IF NOT EXISTS equivalent via IF NOT EXISTS
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_documents_user_id    ON documents(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at)",
            "CREATE INDEX IF NOT EXISTS idx_req_document_id      ON requirements(document_id)",
            "CREATE INDEX IF NOT EXISTS idx_req_req_id           ON requirements(requirement_id)",
            "CREATE INDEX IF NOT EXISTS idx_req_status           ON requirements(status)",
            "CREATE INDEX IF NOT EXISTS idx_tc_document_id       ON test_cases(document_id)",
            "CREATE INDEX IF NOT EXISTS idx_tc_testcase_id       ON test_cases(testcase_id)",
            "CREATE INDEX IF NOT EXISTS idx_tc_status            ON test_cases(status)",
            "CREATE INDEX IF NOT EXISTS idx_steps_testcase_id    ON test_steps(testcase_id)",
            "CREATE INDEX IF NOT EXISTS idx_rtm_document_id      ON rtm(document_id)",
            "CREATE INDEX IF NOT EXISTS idx_rtm_req_id           ON rtm(requirement_id)",
            "CREATE INDEX IF NOT EXISTS idx_rtm_tc_id            ON rtm(testcase_id)",
            "CREATE INDEX IF NOT EXISTS idx_risks_document_id    ON risks(document_id)",
            "CREATE INDEX IF NOT EXISTS idx_risks_severity       ON risks(severity)",
            "CREATE INDEX IF NOT EXISTS idx_gaps_document_id     ON gaps(document_id)",
            "CREATE INDEX IF NOT EXISTS idx_gaps_category        ON gaps(category)",
            "CREATE INDEX IF NOT EXISTS idx_audit_user_id        ON audit_logs(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_audit_created_at     ON audit_logs(created_at)",
            "CREATE INDEX IF NOT EXISTS idx_activity_doc_id      ON activity_logs(document_id)",
        ]
        for idx in indexes:
            cursor.execute(idx)

        conn.commit()
        conn.close()

    # =========================================================
    # SAVE DOCUMENT
    # =========================================================

    def save_document(
        self,
        document_name: str,
        document_type: str,
        file_size: int,
    ) -> int:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO documents (document_name, document_type, file_size, status, is_active)
            VALUES (?, ?, ?, 'COMPLETED', 1)
            """,
            (document_name, document_type, file_size),
        )
        conn.commit()
        doc_id = cursor.lastrowid
        conn.close()
        return doc_id
    # =========================================================
    # SAVE REQUIREMENTS
    # =========================================================

    def save_requirements(self, document_id: int, requirements: list) -> None:
        conn = self.get_connection()
        cursor = conn.cursor()
        for index, req in enumerate(requirements, start=1):
            
            # Unpack the AI dictionary properly
            if isinstance(req, dict):
                req_id = req.get("requirement_id", f"REQ-{index:03}")
                req_text = req.get("description", str(req))
                category = req.get("type", "Functional")
            else:
                # Fallback if it's just a regular string
                req_id = f"REQ-{index:03}"
                req_text = str(req)
                category = "Functional"

            cursor.execute(
                """
                INSERT OR IGNORE INTO requirements
                    (document_id, requirement_id, requirement_text, category, is_active)
                VALUES (?, ?, ?, ?, 1)
                """,
                (document_id, req_id, req_text, category),
            )
        conn.commit()
        conn.close()

    # =========================================================
    # SAVE RISKS
    # =========================================================

    def save_risks(self, document_id: int, risks: list) -> None:
        conn = self.get_connection()
        cursor = conn.cursor()
        for risk_text in risks:
            cursor.execute(
                """
                INSERT INTO risks (document_id, risk_text, is_active)
                VALUES (?, ?, 1)
                """,
                (document_id, risk_text),
            )
        conn.commit()
        conn.close()

    # =========================================================
    # SAVE GAPS
    # =========================================================

    def save_gaps(self, document_id: int, gaps: list) -> None:
        conn = self.get_connection()
        cursor = conn.cursor()
        for gap_text in gaps:
            cursor.execute(
                """
                INSERT INTO gaps (document_id, gap_text, is_active)
                VALUES (?, ?, 1)
                """,
                (document_id, gap_text),
            )
        conn.commit()
        conn.close()

    # =========================================================
    # SAVE TEST CASES
    # =========================================================

    def save_testcases(self, document_id: int, testcases: list) -> None:
        conn = self.get_connection()
        cursor = conn.cursor()
        for tc in testcases:
            
            # Safety: Ensure linked_requirements is a comma-separated string, not a list
            linked_reqs = tc.get("linked_requirements", [])
            if isinstance(linked_reqs, list):
                req_id_str = ", ".join(str(r) for r in linked_reqs)
            else:
                req_id_str = str(linked_reqs)

            # Safety: Ensure test_steps is a string, not a list
            t_steps = tc.get("test_steps", "")
            if isinstance(t_steps, list):
                t_steps = "\n".join(str(s) for s in t_steps)

            cursor.execute(
                """
                INSERT OR IGNORE INTO test_cases (
                    document_id, testcase_id, test_title,
                    pre_requisites, test_data, expected_result,
                    actual_result, priority, status, overall_result,
                    comments, requirement_id, release_sprint, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?, ?, 1)
                """,
                (
                    document_id,
                    str(tc.get("testcase_id", "")),
                    str(tc.get("test_title", "")),
                    str(tc.get("pre_requisites", "")),
                    str(tc.get("test_data", "")),
                    str(tc.get("expected_result", "")),
                    str(tc.get("actual_result", "")),
                    str(tc.get("priority", "Medium")),
                    str(tc.get("overall_status", "Not Executed")),
                    str(tc.get("comments", "")),
                    req_id_str, # Safely stringified
                    str(tc.get("release_sprint", "")),
                ),
            )
            tc_db_id = cursor.lastrowid
            if tc_db_id:
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO test_steps (
                        testcase_id, step_number, step_description,
                        expected_result, actual_result, status
                    ) VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        tc_db_id,
                        tc.get("test_step_number", 1),
                        t_steps,
                        str(tc.get("expected_result", "")),
                        str(tc.get("actual_result", "")),
                        str(tc.get("test_step_status", "Not Executed")),
                    ),
                )
        conn.commit()
        conn.close()

    # =========================================================
    # RTM PERSISTENCE
    # =========================================================

    def persist_rtm(
        self,
        document_id: int,
        rtm_rows: list,
        requirements_by_id: dict,
        testcases_by_id: dict,
    ) -> None:
        conn = self.get_connection()
        cursor = conn.cursor()
        for row in rtm_rows:
            req_id_str = row.get("requirement_id")
            tc_ids_csv = row.get("testcase_ids", "")
            if not req_id_str:
                continue
            req_db_id = requirements_by_id.get(req_id_str)
            if not req_db_id:
                continue
            for tc_id_str in [t.strip() for t in tc_ids_csv.split(",") if t.strip()]:
                tc_db_id = testcases_by_id.get(tc_id_str)
                if not tc_db_id:
                    continue
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO rtm (
                        document_id, requirement_id, testcase_id, coverage_status, is_active
                    ) VALUES (?, ?, ?, ?, 1)
                    """,
                    (document_id, req_db_id, tc_db_id, row.get("coverage")),
                )
        conn.commit()
        conn.close()

    def get_requirements_db_ids(self, document_id: int) -> dict:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT requirement_id, id FROM requirements WHERE document_id = ?",
            (document_id,),
        )
        rows = cursor.fetchall()
        conn.close()
        return {r[0]: r[1] for r in rows}

    def get_testcases_db_ids(self, document_id: int) -> dict:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT testcase_id, id FROM test_cases WHERE document_id = ?",
            (document_id,),
        )
        rows = cursor.fetchall()
        conn.close()
        return {r[0]: r[1] for r in rows}