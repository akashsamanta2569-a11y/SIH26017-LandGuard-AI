from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class AlertResponse(BaseModel):
    id: UUID

    district_name: str
    alert_type: str

    severity: str
    confidence: float

    latitude: float
    longitude: float

    status: str

    created_at: datetime