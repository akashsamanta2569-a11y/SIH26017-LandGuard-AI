from app.services.gis_service import get_all_districts

print("🗺️ Testing GIS Service...")

geojson = get_all_districts()

print("✅ GIS Service Working!")
print("GeoJSON Type:", geojson["type"])
print("District Count:", len(geojson["features"]))

first = geojson["features"][0]

print("\nFirst District:")
print("Name:", first["properties"]["district_name"])
print("State:", first["properties"]["state"])
print("Risk Level:", first["properties"]["risk_level"])
print("Geometry Type:", first["geometry"]["type"])