from pydantic import BaseModel

class DashboardSummaryResponse(BaseModel):
    total_projects: int
    ongoing_projects: int
    planned_projects: int

    high_risk_districts: int
    medium_risk_districts: int
    low_risk_districts: int

    total_estimated_cost: float

    total_alerts: int
    active_alerts: int

    high_severity_alerts: int
    medium_severity_alerts: int
    low_severity_alerts: int