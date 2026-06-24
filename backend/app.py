from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.document_routes import router as document_router
from backend.api.testcase_routes import router as testcase_router
from backend.api.rtm_routes import router as rtm_router
from backend.api.health_routes import router as health_router
from backend.config import settings
from backend.middleware.rate_limiter import limiter, add_rate_limiting
from backend.middleware.security import security_headers_middleware_factory
from backend.services.database_service import DatabaseService
from backend.utils.logger import logger

# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="QA Document Intelligence Platform",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# =====================================================
# RATE LIMITER — attach to app state
# =====================================================

add_rate_limiting(app)

# =====================================================
# CORS — whitelist only
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=600,
)

# =====================================================
# SECURITY HEADERS
# =====================================================

app.middleware("http")(security_headers_middleware_factory(settings))

# =====================================================
# GLOBAL EXCEPTION HANDLER
# =====================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"},
    )

# =====================================================
# ROUTES
# =====================================================

@app.get("/")
def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }

@app.get("/api/info")
def application_info():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }

app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(document_router, prefix="/api/documents", tags=["Documents"])
app.include_router(testcase_router, prefix="/api/testcases", tags=["Test Cases"])
app.include_router(rtm_router, prefix="/api/rtm", tags=["RTM"])

# =====================================================
# STARTUP
# =====================================================

@app.on_event("startup")
async def startup_event():
    print("\n" + "=" * 60)
    print(f"  {settings.APP_NAME}")
    print(f"  Version     : {settings.APP_VERSION}")
    print(f"  Environment : {settings.ENVIRONMENT}")
    print(f"  Debug       : {settings.DEBUG}")
    print(f"  Upload Dir  : {settings.UPLOAD_DIR}")
    print("=" * 60 + "\n")
    DatabaseService()
    logger.info("Database initialized")

# =====================================================
# SHUTDOWN
# =====================================================

@app.on_event("shutdown")
async def shutdown_event():
    print("\n" + "=" * 60)
    print("  SERVER SHUTDOWN")
    print("=" * 60 + "\n")