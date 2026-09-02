from fastapi import APIRouter
from app.services.project_service import get_project_markers

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["Projects"]
)

@router.get("/map")
def project_map():
    return get_project_markers()