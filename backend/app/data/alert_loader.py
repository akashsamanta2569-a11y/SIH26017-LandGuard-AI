import csv
from pathlib import Path
from uuid import uuid4

from app.core.database import SessionLocal
from app.models.alert import Alert

# Project root
ROOT_DIR = Path(__file__).resolve().parents[3]

DATA_PATH = ROOT_DIR / "dataset" / "raw" / "alerts" / "west_bengal_alerts.csv"

print("Loading Alerts CSV:")
print(DATA_PATH)
print("Exists:", DATA_PATH.exists())


def seed_alerts():
    db = SessionLocal()

    # Clear old alerts
    db.query(Alert).delete()

    with open(DATA_PATH, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            alert = Alert(
                id=uuid4(),
                district_name=row["district_name"],
                alert_type=row["alert_type"],
                severity=row["severity"],
                latitude=float(row["latitude"]),
                longitude=float(row["longitude"]),
                confidence=float(row["confidence"]),
                source=row["source"],
                status=row["status"],
            )

            db.add(alert)

    db.commit()
    db.close()

    print("✅ AI Alerts imported successfully!")


if __name__ == "__main__":
    seed_alerts()