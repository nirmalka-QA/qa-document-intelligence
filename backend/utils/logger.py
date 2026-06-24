import logging
import logging.handlers
from pathlib import Path

from backend.config import settings


def setup_logging() -> logging.Logger:
    log_dir = Path("backend") / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger("qa_platform")

    # Avoid duplicate handlers on reload
    if logger.handlers:
        return logger

    logger.setLevel(logging.DEBUG)

    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(level)
    console_format = logging.Formatter(
        "%(asctime)s | %(name)s | %(levelname)s | %(message)s"
    )
    console_handler.setFormatter(console_format)
    logger.addHandler(console_handler)

    file_handler = logging.handlers.RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_format = logging.Formatter(
        "%(asctime)s | %(name)s | %(levelname)s | %(funcName)s:%(lineno)d | %(message)s"
    )
    file_handler.setFormatter(file_format)
    logger.addHandler(file_handler)

    error_handler = logging.handlers.RotatingFileHandler(
        log_dir / "errors.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(file_format)
    logger.addHandler(error_handler)

    logger.propagate = False
    return logger


logger = setup_logging()

