import { useState, useMemo } from "react";
import AlertsHero from "../components/alerts/AlertsHero";
import AlertMapPreview from "../components/alerts/AlertMapPreview";
import AlertsFeed, {
    type IncidentAlert,
    type Severity,
    type AlertStatus,
    SAMPLE_ALERTS,
} from "../components/alerts/AlertsFeed";
import AlertDetailsPanel from "../components/alerts/AlertDetailsPanel";

export default function Alerts() {
    const [alerts, setAlerts] = useState<IncidentAlert[]>(SAMPLE_ALERTS);
    const [selectedAlertId, setSelectedAlertId] = useState<string>(
        SAMPLE_ALERTS[0]?.id ?? ""
    );
    const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Derived filtered incidents
    const filteredAlerts = useMemo(() => {
        return alerts.filter((alert) => {
            // Severity Filter
            if (severityFilter !== "ALL") {
                if (severityFilter === "MEDIUM") {
                    if (alert.severity !== "MEDIUM" && alert.severity !== "LOW") {
                        return false;
                    }
                } else if (alert.severity !== severityFilter) {
                    return false;
                }
            }

            // Search Query Filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchCode = alert.code.toLowerCase().includes(q);
                const matchTitle = alert.title.toLowerCase().includes(q);
                const matchDistrict = alert.district.toLowerCase().includes(q);
                const matchLocation = alert.location.toLowerCase().includes(q);
                const matchCategory = alert.category.toLowerCase().includes(q);
                const matchKhatian = alert.coordinates.khatianNo
                    .toLowerCase()
                    .includes(q);
                const matchPlot = alert.coordinates.plotNo.toLowerCase().includes(q);

                if (
                    !matchCode &&
                    !matchTitle &&
                    !matchDistrict &&
                    !matchLocation &&
                    !matchCategory &&
                    !matchKhatian &&
                    !matchPlot
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [alerts, severityFilter, searchQuery]);

    // Currently focused alert instance
    const selectedAlert = useMemo(() => {
        return (
            alerts.find((a) => a.id === selectedAlertId) ||
            filteredAlerts[0] ||
            alerts[0] ||
            null
        );
    }, [alerts, selectedAlertId, filteredAlerts]);

    // Handler for incident status updates (Active, Investigating, Resolved)
    const handleUpdateStatus = (alertId: string, newStatus: AlertStatus) => {
        setAlerts((prev) =>
            prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
        );
    };

    // Severity metrics calculation for Hero KPIs
    const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
    const highCount = alerts.filter((a) => a.severity === "HIGH").length;
    const lowMedCount = alerts.filter(
        (a) => a.severity === "MEDIUM" || a.severity === "LOW"
    ).length;

    return (
        <div className="relative max-w-[1700px] mx-auto space-y-6 pb-12 fade-up select-none">
            {/* ── Background Radial Emerald + Teal Glows ── */}
            <div
                className="pointer-events-none absolute -top-12 left-1/4 w-[650px] h-[650px] rounded-full opacity-20 -z-10"
                style={{
                    background:
                        "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)",
                }}
            />
            <div
                className="pointer-events-none absolute top-72 right-12 w-[550px] h-[550px] rounded-full opacity-18 -z-10"
                style={{
                    background:
                        "radial-gradient(circle, rgba(20,184,166,0.3) 0%, rgba(20,184,166,0.06) 50%, transparent 70%)",
                }}
            />
            <div
                className="pointer-events-none absolute bottom-12 left-10 w-[500px] h-[500px] rounded-full opacity-12 -z-10"
                style={{
                    background:
                        "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
                }}
            />

            {/* ── 1. Hero Full Width ── */}
            <div className="w-full">
                <AlertsHero
                    totalAlerts={alerts.length}
                    criticalAlerts={criticalCount}
                    highAlerts={highCount}
                    lowMedAlerts={lowMedCount}
                    onFilterCritical={() => setSeverityFilter("CRITICAL")}
                    onTriggerRescan={() => {
                        setAlerts([...SAMPLE_ALERTS]);
                    }}
                />
            </div>

            {/* ── 2. Responsive 12-Column Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN (Map + Feed) */}
                <div className="lg:col-span-7 w-full space-y-6">
                    <AlertMapPreview
                        alerts={filteredAlerts}
                        selectedAlert={selectedAlert}
                        onSelectAlert={(a) => setSelectedAlertId(a.id)}
                    />

                    <AlertsFeed
                        alerts={filteredAlerts}
                        selectedAlertId={selectedAlert?.id}
                        onSelectAlert={(a) => setSelectedAlertId(a.id)}
                        activeSeverityFilter={severityFilter}
                        onChangeSeverityFilter={setSeverityFilter}
                        searchQuery={searchQuery}
                        onChangeSearchQuery={setSearchQuery}
                    />
                </div>

                {/* RIGHT COLUMN (Sticky Details Panel) */}
                <div className="lg:col-span-5 w-full">
                    <AlertDetailsPanel
                        alert={selectedAlert}
                        onUpdateStatus={handleUpdateStatus}
                    />
                </div>
            </div>
        </div>
    );
}