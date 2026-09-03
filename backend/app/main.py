from pathlib import Path
from fastapi.responses import JSONResponse
from fastapi import Request
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.projects import router as project_router
from app.routers.dashboard import router as dashboard_router
from app.routers.gis import router as gis_router
from app.routers.heatmap import router as heatmap_router
from app.routers.alerts import router as alerts_router
from app.routers.prediction import router as prediction_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="LandGuard AI Backend for Smart India Hackathon 2026"
)

# ---------------------------------------------------
# Project Root
# ---------------------------------------------------
ROOT_DIR = Path(__file__).resolve().parents[2]

# ---------------------------------------------------
# CORS (React Frontend)
# ---------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# Static Image Hosting
# ---------------------------------------------------
app.mount(
    "/static/uploads",
    StaticFiles(directory=ROOT_DIR / "ai_model" / "uploads"),
    name="uploads",
)

app.mount(
    "/static/predictions",
    StaticFiles(directory=ROOT_DIR / "ai_model" / "predictions"),
    name="predictions",
)

# ---------------------------------------------------
# API Routers
# ---------------------------------------------------
app.include_router(project_router)
app.include_router(dashboard_router)
app.include_router(gis_router)
app.include_router(heatmap_router)
app.include_router(alerts_router)
app.include_router(prediction_router)

# ---------------------------------------------------
# System Endpoints
# ---------------------------------------------------
@app.get("/", tags=["System"])
def root():
    return {
        "message": "LandGuard AI Backend is running 🚀",
        "project": settings.APP_NAME,
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
            "error": str(exc)
        },
    )

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "healthy",
        "project": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "version": settings.API_VERSION
    }