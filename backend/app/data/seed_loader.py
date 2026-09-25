import json
import csv
from pathlib import Path

# from geoalchemy2.shape import from_shape
from shapely.geometry import shape

from app.core.database import SessionLocal
from app.models.district import District

# Project root (SIH26017-LandGuard-AI)
ROOT_DIR = Path(__file__).resolve().parents[3]

# GeoJSON boundaries
DATA_PATH = ROOT_DIR / "dataset" / "processed" / "west_bengal_districts.geojson"

# District risk metadata
METADATA_PATH = ROOT_DIR / "dataset" / "metadata" / "district_metadata.csv"


def seed_districts():
    db = SessionLocal()

    print(f"📍 Loading GeoJSON: {DATA_PATH}")
    print(f"📍 Loading Metadata: {METADATA_PATH}")

    # Load GeoJSON
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        geojson = json.load(f)

    # Load district risk metadata
    risk_lookup = {}

    with open(METADATA_PATH, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            risk_lookup[row["district_name"]] = row["risk_level"]

    # Remove old records
    db.query(District).delete()

    # Insert fresh records
    for feature in geojson["features"]:

        district_name = feature["properties"]["district"]
        geometry = shape(feature["geometry"])

        district = District(
            district_name=district_name,
            state="West Bengal",
            risk_level=risk_lookup.get(district_name, "Low"),
            boundary=from_shape(geometry, srid=4326),
        )

        db.add(district)

    db.commit()
    db.close()

    print(f"✅ Imported {len(geojson['features'])} districts successfully.")


if __name__ == "__main__":
    seed_districts()