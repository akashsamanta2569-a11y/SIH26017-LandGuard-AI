from app.services.dashboard_service import get_top_risk_districts

print("🔥 Top Risk Districts\n")

districts = get_top_risk_districts()

for d in districts:
    print("-" * 40)
    print("District :", d["district_name"])
    print("Risk     :", d["risk_level"], d["risk_score"])
    print("Projects :", d["project_count"])
    print("Cost     :", d["total_cost"])