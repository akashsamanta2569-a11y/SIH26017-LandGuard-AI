from fastapi import FastAPI
from app.core.config import settings
from app.routers.gis import router as gis_router
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="LandGuard AI Backend for Smart India Hackathon 2026"
)

app.include_router(gis_router)

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