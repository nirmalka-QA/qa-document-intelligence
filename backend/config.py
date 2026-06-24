import json
import os
from typing import List

from dotenv import load_dotenv

load_dotenv()


def _get_env(key: str, default: str = "") -> str:
    return os.environ.get(key, default)


def _get_bool(key: str, default: bool = False) -> bool:
    val = os.environ.get(key, "").strip().lower()
    if val in ("1", "true", "yes"):
        return True
    if val in ("0", "false", "no"):
        return False
    return default


def _get_int(key: str, default: int = 0) -> int:
    try:
        return int(os.environ.get(key, default))
    except (TypeError, ValueError):
        return default


class Settings:
    # Application
    # Updated default name from "QA Document Intelligence Platform" to "Nexa QA"
    APP_NAME: str = _get_env("APP_NAME", "Nexa QA")
    APP_VERSION: str = _get_env("APP_VERSION", "1.0.0")
    DEBUG: bool = _get_bool("DEBUG", True)
    ENVIRONMENT: str = _get_env("ENVIRONMENT", "development")
    
    # ... keep the rest of your config exactly the same ...

    # Database
    DATABASE_URL: str = _get_env("DATABASE_URL", "sqlite:///database/qa.db")
    POSTGRES_URL: str = _get_env("POSTGRES_URL", "")

    # File Upload
    UPLOAD_DIR: str = _get_env("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE: int = _get_int("MAX_FILE_SIZE", 200 * 1024 * 1024)

    # CORS — supports JSON array string or comma-separated
    _raw_origins: str = _get_env(
        "ALLOWED_ORIGINS",
        '["http://localhost:3000","http://localhost:5173"]',
    )

    # Security
    SECRET_KEY: str = _get_env("SECRET_KEY", "change-me-in-production")
    ALGORITHM: str = _get_env("ALGORITHM", "HS256")
    TOKEN_EXPIRY: int = _get_int("TOKEN_EXPIRY", 3600)

    # Logging
    LOG_LEVEL: str = _get_env("LOG_LEVEL", "INFO")

    # Rate limiting
    RATE_LIMIT_UPLOAD_PER_MINUTE: str = _get_env("RATE_LIMIT_UPLOAD_PER_MINUTE", "5/minute")
    RATE_LIMIT_DEFAULT_PER_HOUR: str = _get_env("RATE_LIMIT_DEFAULT_PER_HOUR", "50/hour")
    RATE_LIMIT_DEFAULT_PER_DAY: str = _get_env("RATE_LIMIT_DEFAULT_PER_DAY", "200/day")

    def get_cors_origins(self) -> List[str]:
        raw = self._raw_origins.strip()
        if raw.startswith("["):
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                pass
        # fallback: comma-separated
        return [o.strip() for o in raw.split(",") if o.strip()]


settings = Settings()

# Refuse to start in production with default secret
if not settings.DEBUG and settings.ENVIRONMENT == "production":
    if settings.SECRET_KEY == "change-me-in-production":
        raise ValueError("SECRET_KEY must be changed in production")