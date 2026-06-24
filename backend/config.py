import json
from pathlib import Path
from typing import List

import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    # Application
    APP_NAME: str = "QA Document Intelligence Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///database/qa.db"
    POSTGRES_URL: str = ""

    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 200 * 1024 * 1024

    # CORS
    # Can be provided either as a JSON string array, or as a python list env var.
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Security
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    TOKEN_EXPIRY: int = 3600

    # Logging
    LOG_LEVEL: str = "INFO"

    # Rate limiting
    RATE_LIMIT_UPLOAD_PER_MINUTE: str = "5/minute"
    RATE_LIMIT_DEFAULT_PER_HOUR: str = "50/hour"
    RATE_LIMIT_DEFAULT_PER_DAY: str = "200/day"

    class Config:
        env_file = ".env"
        case_sensitive = False

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, str):
            return json.loads(self.ALLOWED_ORIGINS)
        return list(self.ALLOWED_ORIGINS)


settings = Settings()

# In dev, allow default SECRET_KEY.
# In production, override via environment variable.
if not settings.DEBUG and settings.ENVIRONMENT == "production":
    if settings.SECRET_KEY == "change-me-in-production":
        raise ValueError("SECRET_KEY must be changed in production")

