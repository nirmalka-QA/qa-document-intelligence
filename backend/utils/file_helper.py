from pathlib import Path


def get_file_size(
    file_path: str
):

    return (
        Path(file_path)
        .stat()
        .st_size
    )