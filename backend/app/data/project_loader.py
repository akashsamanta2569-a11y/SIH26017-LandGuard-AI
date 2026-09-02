import csv
from pathlib import Path

from geoalchemy2.shape import from_shape
from shapely.geometry import Point

from app.core.database import SessionLocal
from app.models.project import Project

# Project Root (SIH26017-LandGuard-AI)
ROOT_DIR = Path(__file__).resolve().parents[3]

CSV_PATH = ROOT_DIR / "dataset" / "raw" / "projects" / "west_bengal_projects.csv"

print("Loading Projects CSV:")
print(CSV_PATH)
print("Exists:", CSV_PATH.exists())


def seed_projects():
    db = SessionLocal()

    # Remove old data (for testing)
    db.query(Project).delete()

    with open(CSV_PATH, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            point = Point(float(row["longitude"]), float(row["latitude"]))

            project = Project(
                project_name=row["project_name"],
                department=row["department"],
                district_name=row["district_name"],
                latitude=float(row["latitude"]),
                longitude=float(row["longitude"]),
                location=from_shape(point, srid=4326),
                status=row["status"],
                estimated_cost=float(row["estimated_cost"]),
            )

            db.add(project)

    db.commit()
    db.close()

    print("✅ West Bengal projects imported successfully!")


if __name__ == "__main__":
    seed_projects()