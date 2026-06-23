import json
from pathlib import Path


class ExportService:

    def export_json(
        self,
        data,
        output_file
    ):

        Path(
            output_file
        ).parent.mkdir(
            exist_ok=True
        )

        with open(
            output_file,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                data,
                file,
                indent=4
            )

        return output_file