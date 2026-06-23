import json
from pathlib import Path


class ReportService:

    def save_report(
        self,
        data,
        report_path
    ):

        with open(
            report_path,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                data,
                f,
                indent=4
            )