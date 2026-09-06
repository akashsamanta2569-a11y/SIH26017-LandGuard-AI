import type { HistoryItem } from "../../types/history";
import {
  MapPin,
  Calendar,
  Gauge,
  Trees,
  Maximize2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Inbox,
} from "lucide-react";



interface HistoryGridProps {
  items: HistoryItem[];
  selectedId?: string;
  onSelect: (item: HistoryItem) => void;
}

/**
 * Derives a standardized severity tier if not directly supplied on the item.
 */
function resolveSeverity(item: HistoryItem): "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" {
  if (item.severity) {
    const norm = item.severity.toUpperCase();
    if (norm === "CRITICAL" || norm === "HIGH" || norm === "MEDIUM" || norm === "LOW") {
      return norm as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    }
  }

  const conf = Number(item.confidence) || 0;
  const rawLoss = typeof item.vegetationLoss === "string"
    ? parseFloat(item.vegetationLoss.replace(/[^0-9.-]/g, ""))
    : Number(item.vegetationLoss) || 0;
  const loss = Math.abs(rawLoss);
  const rawArea = typeof item.affectedArea === "string"
    ? parseFloat(item.affectedArea.replace(/[^0-9.-]/g, ""))
    : Number(item.affectedArea) || 0;

  if (conf >= 95 || loss >= 15 || rawArea >= 12) return "CRITICAL";
  if (conf >= 90 || loss >= 9 || rawArea >= 5) return "HIGH";
  if (conf >= 80 || loss >= 4) return "MEDIUM";
  return "LOW";
}

/**
 * Renders the high-tech government severity badge
 */
function SeverityBadge({ severity }: { severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" }) {
  switch (severity) {
    case "CRITICAL":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold tracking-wider uppercase bg-red-500/10 border border-red-500/35 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span>CRITICAL</span>
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold tracking-wider uppercase bg-amber-500/10 border border-amber-500/35 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span>HIGH RISK</span>
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/35 text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span>MEDIUM RISK</span>
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/35 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>MONITORED</span>
        </span>
      );
  }
}

export default function HistoryGrid({
  items = [],
  onSelect,
  selectedId,
}: HistoryGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-500/25 bg-slate-950/60 p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
          <Inbox className="h-7 w-7 text-emerald-400/60" />
        </div>
        <h3 className="text-base font-semibold text-white">No Historical Predictions</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">
          No detection reports match the current criteria or archive feed. Run a satellite inference to log records.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
      {items.map((item, index) => {
        const itemKey = item.id ? String(item.id) : `${item.district}-${item.date}-${index}`;
        const severity = resolveSeverity(item);
        const isSelected = Boolean(
          selectedId &&
            (selectedId.toLowerCase() === item.district.toLowerCase() ||
              selectedId === String(item.id))
        );

        // Format metrics cleanly
        const displayConfidence =
          item.confidence !== undefined && item.confidence !== null
            ? `${item.confidence}%`
            : "--";

        let displayVegetationLoss = "--";
        if (item.vegetationLoss !== undefined && item.vegetationLoss !== null) {
          if (typeof item.vegetationLoss === "number") {
            displayVegetationLoss = `${item.vegetationLoss > 0 ? `-${item.vegetationLoss}` : item.vegetationLoss}%`;
          } else {
            displayVegetationLoss = String(item.vegetationLoss);
          }
        }

        let displayAffectedArea = "--";
        if (item.affectedArea !== undefined && item.affectedArea !== null) {
          const areaStr = String(item.affectedArea);
          displayAffectedArea = areaStr.toLowerCase().includes("ha") ? areaStr : `${areaStr} Ha`;
        }

        return (
          <div
            key={itemKey}
            onClick={() => onSelect(item)}
            className={`group relative cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between select-none ${isSelected
              ? "border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-slate-900/90"
              : "border border-emerald-500/20 bg-slate-950/80 hover:border-emerald-500/50 hover:bg-slate-900/70"
              }`}
          >
            {/* Ambient subtle card glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(16,185,129,0.06) 0%, transparent 60%)",
              }}
            />

            <div>
              {/* Header: District, Badges, & Severity */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-white font-bold text-lg sm:text-xl tracking-tight">
                      <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{item.district}</span>
                    </div>

                    {item.isNew && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        Latest Scan
                      </span>
                    )}
                  </div>

                  {/* Threat description */}
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                    <ShieldAlert className="h-3.5 w-3.5 text-emerald-400/80 shrink-0" />
                    <span className="font-medium text-slate-200">{item.threat}</span>
                  </div>
                </div>

                {/* Severity Badge */}
                <div className="shrink-0">
                  <SeverityBadge severity={severity} />
                </div>
              </div>

              {/* Timestamp Row */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 my-3">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Detected: {item.date}</span>
              </div>

              {/* Metric Pill Grid (Confidence, Vegetation Loss, Affected Area) */}
              <div className="grid grid-cols-3 gap-2.5 my-2">
                {/* AI Confidence */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800/90 p-3 text-center transition-colors group-hover:border-emerald-500/20">
                  <div className="flex items-center justify-center gap-1 text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                    <Gauge className="h-3 w-3 text-emerald-400" />
                    <span>Confidence</span>
                  </div>
                  <p className="mt-1 text-sm sm:text-base font-mono font-bold text-emerald-400">
                    {displayConfidence}
                  </p>
                </div>

                {/* Vegetation Loss */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800/90 p-3 text-center transition-colors group-hover:border-red-500/20">
                  <div className="flex items-center justify-center gap-1 text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                    <Trees className="h-3 w-3 text-red-400" />
                    <span>Veg Loss</span>
                  </div>
                  <p className="mt-1 text-sm sm:text-base font-mono font-bold text-red-400">
                    {displayVegetationLoss}
                  </p>
                </div>

                {/* Affected Area */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800/90 p-3 text-center transition-colors group-hover:border-amber-500/20">
                  <div className="flex items-center justify-center gap-1 text-[10.5px] font-mono uppercase tracking-wider text-slate-400">
                    <Maximize2 className="h-3 w-3 text-amber-400" />
                    <span>Area</span>
                  </div>
                  <p className="mt-1 text-sm sm:text-base font-mono font-bold text-amber-400">
                    {displayAffectedArea}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Row with 'View Comparison' Button */}
            <div className="mt-4 pt-3.5 border-t border-slate-800/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>DUAL SATELLITE REPOSITORIES</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(item);
                }}
                aria-label={`View comparison for ${item.district}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/60 px-4 py-2 text-xs font-semibold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.08)] transition-all duration-200 cursor-pointer group/btn"
              >
                <span>View Comparison</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-400 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
