from fastapi import APIRouter, Query
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import (
    get_dashboard_summary,
    get_department_chart,
    get_status_chart,
    get_cost_by_district,
    get_top_projects
)

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"]
)

@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    summary="Dashboard Summary Analytics"
)
def dashboard_summary():
    return get_dashboard_summary()
@router.get("/department-chart")
def department_chart():
    return get_department_chart()


@router.get("/status-chart")
def status_chart():
    return get_status_chart()


@router.get("/cost-by-district")
def cost_by_district():
    return get_cost_by_district()


@router.get("/top-projects")
def top_projects(limit: int = Query(10, ge=1, le=20)):
    return get_top_projects(limit)
@router.get("/top-risk")
def top_risk_districts(limit: int = 10):
    return get_top_risk_districts(limit)