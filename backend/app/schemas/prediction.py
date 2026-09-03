from pydantic import BaseModel
from typing import List
from datetime import datetime
from uuid import UUID

class DetectionSchema(BaseModel):
    class_name: str
    confidence: float
    bbox: List[int]


class PredictionResponse(BaseModel):
    success: bool = True
    message: str

    filename: str
    district_name: str | None = None

    image_url: str
    prediction_url: str

    total_detections: int
    highest_confidence: float

    detections: List[DetectionSchema]

class PredictionHistoryResponse(BaseModel):
    id: UUID

    image_name: str

    image_url: str
    prediction_url: str

    district_name: str | None = None

    total_detections: int
    highest_confidence: float

    created_at: datetime