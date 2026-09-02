from fastapi import APIRouter
from app.services.heatmap_service import generate_heatmap

router = APIRouter(
    prefix="/api/v1/gis",
    tags=["AI Heatmap"]
)

@router.get("/heatmap")
def district_heatmap():
    return generate_heatmap()