from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.document_routes import router as document_router
from api.testcase_routes import router as testcase_router
from api.rtm_routes import router as rtm_router
from api.health_routes import router as health_router
from services.database_service import (
    DatabaseService
)

MAX_UPLOAD_SIZE = 200 * 1024 * 1024
# =====================================================
# APPLICATION CONFIGURATION
# =====================================================

APP_NAME = "QA Document Intelligence Platform"
APP_VERSION = "1.0.0"

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"
REPORT_DIR = BASE_DIR / "reports"
LOG_DIR = BASE_DIR / "logs"
EXPORT_DIR = BASE_DIR / "exports"
DATABASE_DIR = BASE_DIR / "database"
TEMPLATE_DIR = BASE_DIR / "templates"


# =====================================================
# CREATE REQUIRED DIRECTORIES
# =====================================================

UPLOAD_DIR.mkdir(exist_ok=True)

REPORT_DIR.mkdir(exist_ok=True)

LOG_DIR.mkdir(exist_ok=True)

EXPORT_DIR.mkdir(exist_ok=True)

DATABASE_DIR.mkdir(exist_ok=True)

TEMPLATE_DIR.mkdir(exist_ok=True)


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="""
QA Document Intelligence Platform

Features

- Upload Documents
- PDF Analysis
- DOCX Analysis
- XLSX Analysis
- PPTX Analysis
- Requirement Extraction
- Risk Analysis
- Gap Analysis
- Test Case Generation
- RTM Generation
- Report Export
""",
    docs_url="/docs",
    redoc_url="/redoc",
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():

    return {
        "application": APP_NAME,
        "version": APP_VERSION,
        "status": "running",
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "application": APP_NAME,
        "version": APP_VERSION,
    }


# =====================================================
# APPLICATION INFO
# =====================================================

@app.get("/api/info")
def application_info():

    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "upload_folder": str(UPLOAD_DIR),
        "report_folder": str(REPORT_DIR),
    }


# =====================================================
# STARTUP
# =====================================================

@app.on_event("startup")
async def startup_event():

    print("\n" + "=" * 60)
    print("QA DOCUMENT INTELLIGENCE PLATFORM")
    print("Server Started Successfully")
    print(f"Version : {APP_VERSION}")
    print(f"Uploads : {UPLOAD_DIR}")
    print(f"Reports : {REPORT_DIR}")
    print("=" * 60 + "\n")


# =====================================================
# ROUTERS
# =====================================================

app.include_router(
    health_router,
    prefix="/api",
    tags=["Health"],
)

app.include_router(
    document_router,
    prefix="/api/documents",
    tags=["Documents"],
)

app.include_router(
    testcase_router,
    prefix="/api/testcases",
    tags=["Test Cases"],
)

app.include_router(
    rtm_router,
    prefix="/api/rtm",
    tags=["RTM"],
)


# =====================================================
# SHUTDOWN
# =====================================================

@app.on_event("shutdown")
async def shutdown_event():

    print("\n" + "=" * 60)
    print("QA DOCUMENT INTELLIGENCE PLATFORM")
    print("Server Shutdown")
    print("=" * 60 + "\n")

@app.on_event("startup")
async def startup_event():

    DatabaseService()

    print(
        "Database Initialized"
    )