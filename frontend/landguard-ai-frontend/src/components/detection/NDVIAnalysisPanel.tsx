import { useState } from "react";
import {
  Trees,
  Activity,
  ShieldAlert,
  Info,
} from "lucide-react";

export interface NDVIAnalysisPanelProps {
  district: string;
  vegetationLoss?: number;
  completed: boolean;
  isScanning: boolean;
  theme?: "dark" | "light";
}

export default function NDVIAnalysisPanel({
  district,
  vegetationLoss = 12.8,
  completed,
  isScanning,
  theme = "dark",
}: NDVIAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<"NDVI" | "NDWI" | "NBR">("NDVI");

  const isDark = theme === "dark";
  const bgCard = isDark ? "rgba(10,18,28,0.92)" : "rgba(255,255,255,0.95)";
  const borderCard = isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.25)";
  const textTitle = isDark ? "#ffffff" : "#0f172a";
  const textSub = isDark ? "#94a3b8" : "#64748b";
  const boxBg = isDark ? "rgba(15,23,42,0.65)" : "rgba(241,245,249,0.85)";

  const lossValue = Math.abs(vegetationLoss);
  const baselineNDVI = 0.74; // Standard healthy pre-clearance canopy
  const postNDVI = Math.max(0.12, +(baselineNDVI - (lossValue / 100) * 1.5).toFixed(2));
  const ndwiValue = +(0.32 - (lossValue / 200)).toFixed(2);
  const nbrValue = +(0.58 - (lossValue / 150)).toFixed(2);

  const currentBaseline =
    activeTab === "NDVI" ? baselineNDVI : activeTab === "NDWI" ? 0.45 : 0.65;
  const currentPost =
    activeTab === "NDVI" ? postNDVI : activeTab === "NDWI" ? ndwiValue : nbrValue;

  return (
    <div
      className="rounded-3xl p-5 space-y-4 transition-all duration-300"
      style={{
        background: bgCard,
        border: `1px solid ${borderCard}`,
        boxShadow: isDark
          ? "0 10px 30px -10px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.05)"
          : "0 10px 30px -10px rgba(0,0,0,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-emerald-400">
            <Activity className="h-3 w-3" />
            Bio-Spectral Radiometry
          </div>
          <h2 className="text-lg font-extrabold tracking-tight mt-1" style={{ color: textTitle }}>
            NDVI Vegetation Dynamics
          </h2>
          <p className="text-xs" style={{ color: textSub }}>
            Sentinel-2 Band 8 (NIR 842nm) vs Band 4 (Red 665nm) Differential
          </p>
        </div>

        <span
          className="text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold shrink-0"
          style={{
            background: completed
              ? "rgba(239,68,68,0.15)"
              : isScanning
                ? "rgba(245,158,11,0.15)"
                : "rgba(16,185,129,0.12)",
            color: completed ? "#ef4444" : isScanning ? "#f59e0b" : "#10b981",
            border: `1px solid ${completed ? "rgba(239,68,68,0.3)" : isScanning ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
          }}
        >
          {completed ? "DEPLETION DETECTED" : isScanning ? "PROCESSING BANDS" : "CALIBRATED"}
        </span>
      </div>

      {/* Index Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl border" style={{ background: boxBg, borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.8)" }}>
        {(["NDVI", "NDWI", "NBR"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all"
            style={{
              background: activeTab === tab ? "rgba(16,185,129,0.2)" : "transparent",
              color: activeTab === tab ? "#10b981" : textSub,
              border: activeTab === tab ? "1px solid rgba(16,185,129,0.4)" : "1px solid transparent",
            }}
          >
            {tab === "NDVI" && "NDVI (Canopy)"}
            {tab === "NDWI" && "NDWI (Moisture)"}
            {tab === "NBR" && "NBR (Clearance)"}
          </button>
        ))}
      </div>

      {/* Core Comparative Readout */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-2xl border" style={{ background: boxBg, borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(226,232,240,0.8)" }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Historical Baseline (T-0)
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-mono font-black text-emerald-400">
              +{currentBaseline}
            </span>
            <span className="text-[10px] text-slate-400 font-sans">
              {activeTab === "NDVI" ? "Dense Forest" : activeTab === "NDWI" ? "Hydrated" : "Pre-Disturbance"}
            </span>
          </div>
          <p className="text-[9px] font-mono text-slate-500 mt-1">Sentinel-2 Archive · 2024</p>
        </div>

        <div className="p-3 rounded-2xl border" style={{ background: boxBg, borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(226,232,240,0.8)" }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Current Scene (T-1)
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-mono font-black" style={{ color: completed ? "#ef4444" : "#06b6d4" }}>
              {completed ? `+${currentPost}` : "--"}
            </span>
            <span className="text-[10px] text-slate-400 font-sans">
              {completed ? "Degraded Scrub" : "Pending"}
            </span>
          </div>
          <p className="text-[9px] font-mono text-slate-500 mt-1">
            {completed ? `Δ Loss: -${lossValue}%` : "Awaiting scan"}
          </p>
        </div>
      </div>

      {/* Graphical Canopy Gradient Bar */}
      <div className="space-y-1.5 p-3 rounded-2xl border" style={{ background: boxBg, borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(226,232,240,0.8)" }}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Trees className="h-3.5 w-3.5 text-emerald-400" />
            Canopy Density Classification
          </span>
          <span className="font-mono text-xs font-bold" style={{ color: completed ? "#ef4444" : "#10b981" }}>
            {completed ? `-${lossValue}% Loss` : "Standard Density"}
          </span>
        </div>

        {/* Spectral Range Bar */}
        <div className="relative h-3 w-full rounded-full overflow-hidden bg-slate-800">
          <div
            className="absolute inset-0 bg-gradient-to-r from-red-600 via-amber-500 via-emerald-500 to-emerald-300"
            style={{ opacity: 0.85 }}
          />
          {completed && (
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_#ffffff] -translate-x-1/2 transition-all duration-700"
              style={{ left: `${Math.max(10, Math.min(90, (1 - lossValue / 50) * 100))}%` }}
            />
          )}
        </div>

        <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-0.5">
          <span>0.0 (Cleared)</span>
          <span>0.3 (Scrub)</span>
          <span>0.5 (Moderate)</span>
          <span>0.8+ (Dense)</span>
        </div>
      </div>

      {/* Statutory Environmental Impact Warning */}
      {completed && (
        <div
          className="p-3 rounded-2xl border flex items-start gap-3 transition-all animate-fadeIn"
          style={{
            background: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.3)",
          }}
        >
          <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-red-400">
              Forest Conservation Act 1980 Alert
            </p>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Significant canopy depletion observed across {district}. Non-forest land conversion requires prior Stage-I statutory clearance from MoEF&CC.
            </p>
          </div>
        </div>
      )}

      {/* Technical Meta Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t" style={{ borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(226,232,240,0.8)" }}>
        <span className="flex items-center gap-1">
          <Info className="h-3 w-3 text-emerald-400" /> Formula: (B8 - B4) / (B8 + B4)
        </span>
        <span className="text-emerald-400">ESA Copernicus L2A</span>
      </div>
    </div>
  );
}
