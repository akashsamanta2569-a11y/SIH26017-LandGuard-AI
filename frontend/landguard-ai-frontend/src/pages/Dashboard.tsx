import HeroCommandCenter from "../components/dashboard/HeroCommandCenter";
import KPIGrid from "../components/dashboard/KPIGrid";
import AnalyticsGrid from "../components/dashboard/AnalyticsGrid";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <HeroCommandCenter />
      <KPIGrid />
      <AnalyticsGrid />
    </div>
  );
}