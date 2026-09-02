from uuid import uuid4
from sqlalchemy import Column, String, Float, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from geoalchemy2 import Geometry

from app.models.base import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    project_name = Column(String(255), nullable=False)
    department = Column(String(150), nullable=False)
    district_name = Column(String(100), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    location = Column(Geometry("POINT", srid=4326), nullable=False)

    status = Column(String(30), default="Ongoing")
    estimated_cost = Column(Numeric(12, 2))
    start_date = Column(DateTime)

    created_at = Column(DateTime(timezone=True), server_default=func.now())