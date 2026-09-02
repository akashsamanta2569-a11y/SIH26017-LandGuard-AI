import uuid

from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.models.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    district_name = Column(String(100), nullable=False)
    alert_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    confidence = Column(Float, nullable=False)
    source = Column(String(50), nullable=False)
    status = Column(String(30), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())