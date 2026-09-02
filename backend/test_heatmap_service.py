from app.services.heatmap_service import generate_heatmap

print("🔥 Testing AI Heatmap Service...\n")

geojson = generate_heatmap()

print("GeoJSON Type :", geojson["type"])
print("Districts    :", len(geojson["features"]))

print("\nFirst District Heatmap Data\n")

props = geojson["features"][0]["properties"]

for key, value in props.items():
    print(f"{key:20}: {value}")