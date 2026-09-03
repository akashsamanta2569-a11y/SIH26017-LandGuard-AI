import uuid

from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from geoalchemy2 import Geometry

from app.models.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # District + GPS
    district_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # PostGIS Point
    location = Column(Geometry("POINT", srid=4326), nullable=False)

    # AI Alert Details
    alert_type = Column(String(100), nullable=False)
    severity = Column(String(30), nullable=False)
    confidence = Column(Float, nullable=False)

    # Alert Source
    source = Column(String(50), nullable=False)

    # Active / Resolved
    status = Column(String(30), default="Active")

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())