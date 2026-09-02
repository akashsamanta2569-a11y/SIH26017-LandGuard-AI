from app.services.project_service import get_projects_with_detected_district

print("📍 Testing Spatial District Detection...\n")

projects = get_projects_with_detected_district()

print(f"Projects Found: {len(projects)}\n")

for project in projects:
    print("=" * 50)
    print("Project :", project["project_name"])
    print("District:", project["detected_district"])
    print("Status  :", project["status"])
    print("Cost    :", project["estimated_cost"])
    print("Lat/Lng :", project["latitude"], project["longitude"])