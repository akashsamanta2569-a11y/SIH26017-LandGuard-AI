import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Scale,
  Home,
  Activity,
} from "lucide-react";

// ─── AI Recommendations data (SIH26017-aligned) ──────────────────────────────

interface AIRecommendation {
  id: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  district: string;
  zone: string;
  action: string;
  rationale: string;
  rfctlarrClause: string;
  icon: React.ElementType;
  dueIn: string;
  status: "Pending" | "In Review" | "Actioned";
}

const RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: "REC-2026-041",
    priority: "Critical",
    district: "North 24 Parganas",
    zone: "Barasat Industrial Corridor",
    action: "Issue Section 4(1) Stop-Work Notice",
    rationale:
      "AI detected 3.2 ha unauthorized commercial cluster encroaching 42m into highway reservation buffer. Immediate halt required before foundation completion.",
    rfctlarrClause: "RFCTLARR § 4(1) · NH Act § 28",
    icon: AlertTriangle,
    dueIn: "Within 24 hrs",
    status: "Pending",
  },
  {
    id: "REC-2026-038",
    priority: "Critical",
    district: "South 24 Parganas",
    zone: "Sundarban Biosphere Reserve Buffer",
    action: "Prioritize Compensation Award — 14 Families",
    rationale:
      "RFCTLARR § 26 compensation order overdue by 78 days. DM approval pending. 14 displaced families blocked from resettlement package.",
    rfctlarrClause: "RFCTLARR § 26 · § 31",
    icon: Home,
    dueIn: "Within 48 hrs",
    status: "In Review",
  },
  {
    id: "REC-2026-035",
    priority: "High",
    district: "Howrah",
    zone: "Uluberia Industrial Growth Centre",
    action: "Schedule Emergency Field Survey",
    rationale:
      "Cartosat-3 imagery shows 4.6 ha stormwater basin encroached by industrial shed. Cadastral mismatch requires DFO physical verification before legal action.",
    rfctlarrClause: "Survey & Settlement Act · RFCTLARR § 11",
    icon: Activity,
    dueIn: "Within 72 hrs",
    status: "Pending",
  },
  {
    id: "REC-2026-031",
    priority: "High",
    district: "Murshidabad",
    zone: "Bhagirathi Riparian Reserve",
    action: "Escalate Legal Review — Sand Mining FIR",
    rationale:
      "12.8 ha riverbed dredging operation identified. FIR lodged but stalled at district level. Escalate to NGT West Bengal bench — environmental violation threshold exceeded.",
    rfctlarrClause: "NGT Act 2010 · Sand Mining Policy 2020",
    icon: Scale,
    dueIn: "Within 5 days",
    status: "In Review",
  },
  {
    id: "REC-2026-028",
    priority: "Medium",
    district: "Birbhum",
    zone: "NH-14 Widening Project",
    action: "Initiate Final Possession Notification",
    rationale:
      "RFCTLARR § 19 final notification required before award period expires. Award window closes in 22 days. Delay risks re-opening SIA process.",
    rfctlarrClause: "RFCTLARR § 19 · § 38",
    icon: FileText,
    dueIn: "Within 10 days",
    status: "Pending",
  },
  {
    id: "REC-2026-025",
    priority: "Medium",
    district: "Hooghly",
    zone: "Dankuni Inland Container Depot",
    action: "Update Rehabilitation Status in DMS",
    rationale:
      "District Management System shows 6.2 ha wetland encroachment case R&R status as 'Stage 1'. Actual progress at Stage 3. Update to unlock central funding tranche.",
    rfctlarrClause: "RFCTLARR § 31 · DoLR DMS Portal",
    icon: CheckCircle2,
    dueIn: "Within 7 days",
    status: "Actioned",
  },
];

const priorityConfig = {
  Critical: {
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    label: "CRITICAL",
  },
  High: {
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    label: "HIGH",
  },
  Medium: {
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.3)",
    label: "MEDIUM",
  },
  Low: {
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    label: "LOW",
  },
};

const statusConfig = {
  Pending: { color: "#F59E0B", label: "Pending" },
  "In Review": { color: "#06B6D4", label: "In Review" },
  Actioned: { color: "#10B981", label: "Actioned" },
};

interface AIRecommendationPanelProps {
  theme?: "dark" | "light";
}

export default function AIRecommendationPanel({
  theme = "dark",
}: AIRecommendationPanelProps) {
  const [expanded, setExpanded] = useState<string | null>("REC-2026-041");
  const [filter, setFilter] = useState<"All" | "Critical" | "High" | "Medium">(
    "All"
  );

  const isDark = theme === "dark";
  const cardBg = isDark ? "rgba(13,21,32,0.96)" : "#ffffff";
  const borderColor = isDark
    ? "rgba(51,65,85,0.8)"
    : "rgba(203,213,225,0.8)";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const surfaceBg = isDark ? "rgba(15,23,42,0.55)" : "#f8fafc";
  const surfaceBorder = isDark
    ? "rgba(51,65,85,0.5)"
    : "rgba(203,213,225,0.6)";

  const filtered =
    filter === "All"
      ? RECOMMENDATIONS
      : RECOMMENDATIONS.filter((r) => r.priority === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: isDark
          ? "0 4px 32px rgba(0,0,0,0.4)"
          : "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{ borderColor }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "#10B981" }} />
          </div>
          <div>
            <h2
              className="text-sm font-bold leading-none"
              style={{ color: textPrimary }}
            >
              AI Government Recommendations
            </h2>
            <p
              className="text-[10px] font-mono mt-0.5"
              style={{ color: textMuted }}
            >
              XGBoost + SHAP priority action engine · RFCTLARR 2013 aligned
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {(["All", "Critical", "High", "Medium"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all duration-150"
              style={{
                background:
                  filter === f
                    ? f === "All"
                      ? "rgba(16,185,129,0.15)"
                      : priorityConfig[f]?.bg ?? "rgba(16,185,129,0.15)"
                    : isDark
                      ? "rgba(30,41,59,0.6)"
                      : "rgba(241,245,249,0.9)",
                borderColor:
                  filter === f
                    ? f === "All"
                      ? "rgba(16,185,129,0.4)"
                      : priorityConfig[f]?.border ?? "rgba(16,185,129,0.4)"
                    : isDark
                      ? "rgba(51,65,85,0.6)"
                      : "rgba(203,213,225,0.7)",
                color:
                  filter === f
                    ? f === "All"
                      ? "#10B981"
                      : priorityConfig[f]?.color ?? "#10B981"
                    : textMuted,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-2.5">
        {filtered.map((rec, i) => {
          const p = priorityConfig[rec.priority];
          const s = statusConfig[rec.status];
          const Icon = rec.icon;
          const isOpen = expanded === rec.id;

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              {/* Card */}
              <div
                className="rounded-xl overflow-hidden border transition-all duration-200"
                style={{
                  background: surfaceBg,
                  borderColor: isOpen ? p.border : surfaceBorder,
                  boxShadow: isOpen ? `0 0 16px ${p.color}15` : "none",
                }}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : rec.id)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: p.bg, border: `1px solid ${p.border}` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase"
                        style={{
                          background: p.bg,
                          border: `1px solid ${p.border}`,
                          color: p.color,
                        }}
                      >
                        {p.label}
                      </span>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                        style={{
                          color: s.color,
                          borderColor: `${s.color}30`,
                          background: `${s.color}10`,
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        className="text-[10px] font-mono flex items-center gap-1"
                        style={{ color: textMuted }}
                      >
                        <MapPin className="w-2.5 h-2.5" />
                        {rec.district}
                      </span>
                    </div>
                    <p
                      className="text-xs font-semibold mt-0.5 truncate"
                      style={{ color: textPrimary }}
                    >
                      {rec.action}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[10px] font-mono hidden sm:block"
                      style={{ color: p.color }}
                    >
                      <Clock className="w-2.5 h-2.5 inline mr-1" />
                      {rec.dueIn}
                    </span>
                    <ChevronRight
                      className="w-3.5 h-3.5 transition-transform duration-200"
                      style={{
                        color: textMuted,
                        transform: isOpen ? "rotate(90deg)" : "none",
                      }}
                    />
                  </div>
                </button>

                {/* Expanded body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4 space-y-2.5 pt-0 border-t"
                        style={{ borderColor: surfaceBorder }}
                      >
                        <p
                          className="text-xs leading-relaxed mt-3"
                          style={{ color: textMuted }}
                        >
                          {rec.rationale}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className="text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                            style={{
                              background: isDark
                                ? "rgba(30,41,59,0.8)"
                                : "rgba(241,245,249,0.9)",
                              border: `1px solid ${surfaceBorder}`,
                              color: "#06B6D4",
                            }}
                          >
                            📋 {rec.rfctlarrClause}
                          </span>
                          <span
                            className="text-[9px] font-mono"
                            style={{ color: textMuted }}
                          >
                            ID: {rec.id} · Zone: {rec.zone}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-200"
                            style={{
                              background: p.bg,
                              borderColor: p.border,
                              color: p.color,
                            }}
                          >
                            Mark Actioned
                          </button>
                          <button
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all duration-200"
                            style={{
                              background: isDark
                                ? "rgba(30,41,59,0.8)"
                                : "rgba(241,245,249,0.9)",
                              borderColor: surfaceBorder,
                              color: textMuted,
                            }}
                          >
                            Escalate to DM
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 border-t flex items-center justify-between text-[10px] font-mono"
        style={{ borderColor, color: textMuted }}
      >
        <span>Showing {filtered.length} of {RECOMMENDATIONS.length} recommendations</span>
        <span style={{ color: "#10B981" }}>
          Auto-refresh: every 30 min · XGBoost v2.1
        </span>
      </div>
    </motion.div>
  );
}
