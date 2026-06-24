from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings

# Import routers
from backend.api.document_routes import router as document_router
from backend.api.testcase_routes import router as testcase_router
from backend.api.rtm_routes import router as rtm_router
from backend.api.health_routes import router as health_router

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

# CRITICAL: Fix CORS so the React frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(health_router, prefix="/api/health", tags=["Health"])
app.include_router(document_router, prefix="/api/documents", tags=["Documents"])
app.include_router(testcase_router, prefix="/api/testcases", tags=["Test Cases"])
app.include_router(rtm_router, prefix="/api/rtm", tags=["RTM"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="127.0.0.1", port=8000, reload=True)