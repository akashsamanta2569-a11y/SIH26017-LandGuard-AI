import uuid

from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.models.base import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    image_name = Column(String(255), nullable=False)

    image_path = Column(String(500), nullable=False)

    prediction_path = Column(String(500), nullable=False)

    total_detections = Column(Integer, default=0)

    highest_confidence = Column(Float, default=0)

    district_name = Column(String(100))

    created_at = Column(DateTime(timezone=True), server_default=func.now())