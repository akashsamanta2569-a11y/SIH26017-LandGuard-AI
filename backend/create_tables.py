from app.core.database import engine
from app.models.base import Base

# Import models here
from app.models.district import District

print("Creating LandGuard AI tables...")

Base.metadata.create_all(bind=engine)

print("All tables created successfully.")