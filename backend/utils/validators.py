from pathlib import Path


SUPPORTED_TYPES = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".pptx"
]


def validate_file_type(
    file_name: str
):

    extension = (
        Path(file_name)
        .suffix
        .lower()
    )

    return extension in SUPPORTED_TYPES