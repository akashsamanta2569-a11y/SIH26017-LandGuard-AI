from app.services.dashboard_service import get_dashboard_summary

print("📊 Testing Dashboard Summary...\n")

summary = get_dashboard_summary()

print("=" * 40)

for key, value in summary.items():
    print(f"{key:25}: {value}")

print("=" * 40)