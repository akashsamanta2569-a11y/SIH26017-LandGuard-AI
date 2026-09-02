from fastapi import FastAPI
from app.core.config import settings
from app.routers.projects import router as project_router
from app.routers.dashboard import router as dashboard_router
from app.routers.gis import router as gis_router
from app.routers.heatmap import router as heatmap_router
from app.routers.alerts import router as alerts_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="LandGuard AI Backend for Smart India Hackathon 2026"
)

app.include_router(dashboard_router)
app.include_router(gis_router)
app.include_router(heatmap_router)
app.include_router(project_router)
app.include_router(alerts_router)

@app.get("/")
def root():
    return {
        "message": "LandGuard AI Backend is running 🚀",
        "project": settings.APP_NAME,
        "version": settings.API_VERSION
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }