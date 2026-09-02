from app.core.database import engine
from app.models.base import Base

# Import models here
from app.models.district import District
from app.models.project import Project
from app.models.alert import Alert
print("Creating LandGuard AI tables...")

Base.metadata.create_all(bind=engine)

print("All tables created successfully.")