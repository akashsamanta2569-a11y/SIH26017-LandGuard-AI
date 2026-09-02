from fastapi import APIRouter

from app.services.alert_service import (
    get_live_alerts,
    get_alert_summary,
    get_high_severity_alerts
)

router = APIRouter(
    prefix="/api/v1/alerts",
    tags=["AI Alerts"]
)

@router.get("/live")
def live_alerts():
    return get_live_alerts()


@router.get("/summary")
def alert_summary():
    return get_alert_summary()


@router.get("/high-severity")
def high_severity():
    return get_high_severity_alerts()