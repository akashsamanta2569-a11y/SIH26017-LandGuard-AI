import geopandas as gpd
from pathlib import Path

INPUT = Path("../dataset/raw/districts/west_bengal_districts.json")
OUTPUT = Path("../dataset/processed/west_bengal_districts.geojson")

print("Reading TopoJSON...")

gdf = gpd.read_file(INPUT)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
gdf.to_file(OUTPUT, driver="GeoJSON")

print(f"✅ Converted {len(gdf)} districts.")
print(f"Saved at: {OUTPUT}")