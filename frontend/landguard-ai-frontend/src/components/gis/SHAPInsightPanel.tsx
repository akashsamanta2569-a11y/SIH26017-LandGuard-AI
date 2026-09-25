import { motion } from "framer-motion";

// ─── SHAP Delay Driver data (SIH26017-aligned) ───────────────────────────────

interface SHAPDriver {
  label: string;
  shapValue: number; // +ve = increases delay, -ve = reduces
  category: "administrative" | "legal" | "financial" | "field";
  description: string;
}

const SHAP_DRIVERS: SHAPDriver[] = [
  {
    label: "Pending Compensation Approval",
    shapValue: 0.82,
    category: "financial",
    description: "DM Office compensation order not issued — RFCTLARR § 26",
  },
  {
    label: "Legal Appeal (High Court)",
    shapValue: 0.71,
    category: "legal",
    description: "Writ petition filed; possession blocked by court stay order",
  },
  {
    label: "Missing Land Records",
    shapValue: 0.64,
    category: "administrative",
    description: "Khatian/RS Dag records not updated in BL&LRO portal",
  },
  {
    label: "Rehabilitation Pending (R&R)",
    shapValue: 0.58,
    category: "financial",
    description: "Affected families yet to receive R&R entitlement package",
  },
  {
    label: "SIA Report Expired",
    shapValue: 0.47,
    category: "administrative",
    description: "Social Impact Assessment report older than 12 months",
  },
  {
    label: "Boundary Dispute (Survey)",
    shapValue: 0.39,
    category: "field",
    description: "Plot boundary contested by adjacent landowner",
  },
  {
    label: "Possession Stage Complete",
    shapValue: -0.45,
    category: "field",
    description: "Reduces delay risk — possession handed over to authority",
  },
  {
    label: "Preliminary Notification Issued",
    shapValue: -0.28,
    category: "administrative",
    description: "Reduces risk — § 11 notification published in gazette",
  },
];

const categoryColor = {
  administrative: { color: "#06B6D4", bg: "rgba(6,182,212,0.12)" },
  legal: { color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  financial: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  field: { color: "#10B981", bg: "rgba(16,185,129,0.12)" },
};

const MAX_SHAP = 0.9;

interface SHAPInsightPanelProps {
  theme?: "dark" | "light";
}

export default function SHAPInsightPanel({ theme = "dark" }: SHAPInsightPanelProps) {
  const isDark = theme === "dark";
  const cardBg = isDark ? "rgba(13,21,32,0.96)" : "#ffffff";
  const borderColor = isDark ? "rgba(51,65,85,0.8)" : "rgba(203,213,225,0.8)";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const surfaceBg = isDark ? "rgba(15,23,42,0.6)" : "#f8fafc";
  const surfaceBorder = isDark ? "rgba(51,65,85,0.5)" : "rgba(203,213,225,0.6)";

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
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            🧠
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none" style={{ color: textPrimary }}>
              SHAP Delay Driver Analysis
            </h2>
            <p className="text-[10px] font-mono mt-0.5" style={{ color: textMuted }}>
              XGBoost feature importance · TreeExplainer v1.3 · SIH26017
            </p>
          </div>
        </div>
        <span
          className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.3)",
            color: "#8B5CF6",
          }}
        >
          SHAP ANALYSIS
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Legend row */}
        <div className="flex flex-wrap gap-3 text-[10px] font-mono pb-3 border-b" style={{ borderColor }}>
          {Object.entries(categoryColor).map(([cat, { color }]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span style={{ color: textMuted }} className="capitalize">{cat}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-amber-500" />
              <span style={{ color: textMuted }}>Increases Delay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
              <span style={{ color: textMuted }}>Reduces Delay</span>
            </div>
          </div>
        </div>

        {/* SHAP bars */}
        <div className="space-y-2.5">
          {SHAP_DRIVERS.map((d, i) => {
            const isPositive = d.shapValue > 0;
            const pct = (Math.abs(d.shapValue) / MAX_SHAP) * 100;
            const { color, bg } = categoryColor[d.category];

            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="p-3 rounded-xl group transition-all duration-200"
                style={{ background: surfaceBg, border: `1px solid ${surfaceBorder}` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0"
                      style={{ background: bg, color, border: `1px solid ${color}30` }}
                    >
                      {d.category.slice(0, 4)}
                    </span>
                    <span
                      className="text-xs font-semibold truncate"
                      style={{ color: textPrimary }}
                    >
                      {d.label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono font-bold shrink-0"
                    style={{ color: isPositive ? "#EF4444" : "#10B981" }}
                  >
                    {isPositive ? "+" : ""}{d.shapValue.toFixed(2)}
                  </span>
                </div>

                {/* SHAP bar */}
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: isDark ? "rgba(51,65,85,0.5)" : "rgba(203,213,225,0.5)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                    style={{
                      background: isPositive
                        ? "linear-gradient(90deg, #EF4444, #F59E0B)"
                        : "linear-gradient(90deg, #10B981, #06B6D4)",
                      boxShadow: isPositive
                        ? "0 0 6px rgba(239,68,68,0.4)"
                        : "0 0 6px rgba(16,185,129,0.4)",
                    }}
                  />
                </div>

                <p className="text-[10px] mt-1.5 leading-snug" style={{ color: textMuted }}>
                  {d.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer summary */}
        <div
          className="flex items-center justify-between text-[10px] font-mono pt-3 border-t"
          style={{ borderColor, color: textMuted }}
        >
          <span>Model: XGBoost v2.1 · North 24 Parganas (Barasat Pilot)</span>
          <span style={{ color: "#10B981" }}>94.7% Model Accuracy</span>
        </div>
      </div>
    </motion.div>
  );
}
