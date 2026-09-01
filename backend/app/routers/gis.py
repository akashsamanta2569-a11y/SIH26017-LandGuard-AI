from fastapi import APIRouter
from app.services.gis_service import get_all_districts

router = APIRouter(
    prefix="/api/v1/gis",
    tags=["GIS"]
)


@router.get("/districts")
def districts():
    """
    Returns West Bengal district boundaries as GeoJSON.
    """
    return get_all_districts()