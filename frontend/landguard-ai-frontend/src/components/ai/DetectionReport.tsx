import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ShieldCheck,
  MapPinned,
  Trees,
  Radar,
  CheckCircle2,
  FileCheck2,
  Send,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export type DetectionReportProps = {
  detectionDone: boolean;
  isScanning: boolean;
  district: string;
  risk: number;
  cases: string;
  threat: string;
  vegetationLoss?: number;
  affectedArea?: number;
  confidence?: number;
  theme?: "dark" | "light";
  onDispatchNotice?: () => void;
};

export default function DetectionReport({
  detectionDone,
  isScanning,
  district,
  risk,
  cases,
  threat,
  vegetationLoss = 12.8,
  confidence = 94,
  theme = "dark",
  onDispatchNotice,
}: DetectionReportProps) {
  const navigate = useNavigate();
  const [noticeSent, setNoticeSent] = useState(false);

  const isDark = theme === "dark";
  const bgCard = isDark ? "rgba(10,18,28,0.92)" : "rgba(255,255,255,0.95)";
  const borderCard = isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.25)";
  const textTitle = isDark ? "#ffffff" : "#0f172a";
  const textSub = isDark ? "#94a3b8" : "#64748b";
  const boxBg = isDark ? "rgba(15,23,42,0.65)" : "rgba(241,245,249,0.85)";

  const handleSendNotice = () => {
    setNoticeSent(true);
    onDispatchNotice?.();
    setTimeout(() => setNoticeSent(false), 3500);
  };

  return (
    <div
      className="rounded-3xl p-5 space-y-4 transition-all duration-300 flex flex-col justify-between"
      style={{
        background: bgCard,
        border: `1px solid ${borderCard}`,
        boxShadow: isDark
          ? "0 10px 30px -10px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.05)"
          : "0 10px 30px -10px rgba(0,0,0,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-emerald-400">
            Intelligence Dossier
          </p>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
            style={{
              background: detectionDone
                ? "rgba(239,68,68,0.15)"
                : isScanning
                  ? "rgba(245,158,11,0.15)"
                  : "rgba(16,185,129,0.1)",
              color: detectionDone ? "#ef4444" : isScanning ? "#f59e0b" : "#10b981",
              border: `1px solid ${detectionDone ? "rgba(239,68,68,0.3)" : isScanning ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
            }}
          >
            {detectionDone ? "PRIORITY ALPHA" : isScanning ? "INFERENCING" : "STANDBY"}
          </span>
        </div>

        <h2 className="text-lg font-extrabold tracking-tight mt-1.5" style={{ color: textTitle }}>
          Live Intelligence Summary
        </h2>

        <p className="text-xs mt-0.5" style={{ color: textSub }}>
          {district} · Sentinel-2 MSI & Cadastre Correlated
        </p>
      </div>

      {/* Threat Severity Assessment */}
      <div
        className="rounded-2xl border p-3.5 transition-all"
        style={{
          background: detectionDone
            ? "rgba(239,68,68,0.08)"
            : isScanning
              ? "rgba(245,158,11,0.08)"
              : boxBg,
          borderColor: detectionDone
            ? "rgba(239,68,68,0.3)"
            : isScanning
              ? "rgba(245,158,11,0.3)"
              : isDark
                ? "rgba(51,65,85,0.6)"
                : "rgba(226,232,240,0.8)",
        }}
      >
        <div className="flex items-center gap-2 font-bold text-xs" style={{ color: detectionDone ? "#ef4444" : isScanning ? "#f59e0b" : "#10b981" }}>
          {detectionDone ? (
            <ShieldAlert size={16} />
          ) : isScanning ? (
            <AlertTriangle size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <span>
            {isScanning
              ? "Executing Multi-Modal AI Neural Pipeline..."
              : detectionDone
                ? "Critical Encroachment & Acquisition Risk"
                : "Awaiting Satellite Inspection Trigger"}
          </span>
        </div>

        <p className="text-xs mt-2 leading-relaxed" style={{ color: textSub }}>
          {isScanning
            ? "YOLOv8 is segmenting boundary lines while NDVI spectral bands compute canopy degradation."
            : detectionDone
              ? threat
              : "Upload an image or select a pre-staged AOI to generate the live legal & geospatial dossier."}
        </p>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <MetricCard
          icon={<Radar size={15} />}
          label="AI Confidence"
          value={detectionDone ? `${confidence || risk}%` : "--"}
          sub="YOLOv8 IoU 0.88"
          color="emerald"
          theme={theme}
        />

        <MetricCard
          icon={<MapPinned size={15} />}
          label="Affected Area"
          value={detectionDone ? cases : "--"}
          sub="Cadastre Overlay"
          color="amber"
          theme={theme}
        />

        <MetricCard
          icon={<Trees size={15} />}
          label="NDVI Depletion"
          value={detectionDone ? `-${Math.abs(vegetationLoss)}%` : "--"}
          sub="Δ Canopy Band 8"
          color="cyan"
          theme={theme}
        />

        <MetricCard
          icon={<ShieldCheck size={15} />}
          label="Risk Index"
          value={detectionDone ? `${risk}/100` : "--"}
          sub="RFCTLARR Critical"
          color="red"
          theme={theme}
        />
      </div>

      {/* Statutory Recommendations & Directives */}
      {detectionDone && (
        <div
          className="rounded-2xl border p-3.5 space-y-2.5 animate-fadeIn"
          style={{
            background: "rgba(16,185,129,0.06)",
            borderColor: "rgba(16,185,129,0.25)",
          }}
        >
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <FileCheck2 size={15} />
            <span>Administrative Directives (DM / LAO)</span>
          </div>

          <ul className="space-y-1.5 text-[11px]" style={{ color: isDark ? "#cbd5e1" : "#334155" }}>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold shrink-0">•</span>
              <span>
                <strong>§ 38 RFCTLARR Act 2013:</strong> Issue stop-work notice on encroached parcel.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold shrink-0">•</span>
              <span>
                <strong>BanglarBhumi Cross-Check:</strong> Verify Khatian title with District L&LR Office.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold shrink-0">•</span>
              <span>
                <strong>Field Enforcement:</strong> Dispatch sub-decimeter drone survey team to ground-truth coordinates.
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Multimodal Confidence Breakdown Bars */}
      <div className="space-y-2.5 pt-1">
        <p className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400">
          Sensor Correlation Confidence:
        </p>
        <ConfidenceBar label="YOLOv8 Encroachment Boundary" value={detectionDone ? (confidence || risk) : 0} />
        <ConfidenceBar label="NDVI Spectral Degradation" value={detectionDone ? Math.min(100, Math.round(Math.abs(vegetationLoss) * 5)) : 0} />
        <ConfidenceBar label="DoLR Cadastral Parcel Match" value={detectionDone ? 94 : 0} />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t" style={{ borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.8)" }}>
        {detectionDone && (
          <button
            type="button"
            onClick={handleSendNotice}
            className="w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            style={{
              background: noticeSent ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.12)",
              borderColor: noticeSent ? "#10b981" : "rgba(239,68,68,0.3)",
              color: noticeSent ? "#10b981" : "#ef4444",
            }}
          >
            {noticeSent ? (
              <>
                <CheckCircle2 size={14} />
                <span>Notice Dispatched to Land Acquisition Officer!</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Issue Statutory Stop-Work Order (§38)</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          disabled={!detectionDone}
          onClick={() =>
            navigate("/history", {
              state: {
                district,
                confidence: confidence || risk,
                vegetationLoss,
                affectedArea: cases,
                riskScore: risk,
              },
            })
          }
          className="w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            background: detectionDone
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : isDark
                ? "rgba(30,41,59,0.6)"
                : "rgba(203,213,225,0.6)",
            color: detectionDone ? "#ffffff" : textSub,
            boxShadow: detectionDone ? "0 4px 15px rgba(16,185,129,0.3)" : "none",
          }}
        >
          <span>View Change Timeline & Audit Log</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  color: "emerald" | "amber" | "cyan" | "red";
  theme: "dark" | "light";
};

function MetricCard({ icon, label, value, sub, color, theme }: MetricCardProps) {
  const isDark = theme === "dark";
  const boxBg = isDark ? "rgba(15,23,42,0.65)" : "rgba(241,245,249,0.85)";

  const colorStyles: Record<string, { border: string; text: string }> = {
    emerald: { border: "rgba(16,185,129,0.25)", text: "#10b981" },
    amber: { border: "rgba(245,158,11,0.25)", text: "#f59e0b" },
    cyan: { border: "rgba(6,182,212,0.25)", text: "#06b6d4" },
    red: { border: "rgba(239,68,68,0.25)", text: "#ef4444" },
  };

  return (
    <div
      className="rounded-xl border p-2.5 space-y-1 transition-all"
      style={{
        background: boxBg,
        borderColor: colorStyles[color].border,
      }}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
        <span style={{ color: colorStyles[color].text }}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>

      <div className="text-base font-mono font-extrabold" style={{ color: colorStyles[color].text }}>
        {value}
      </div>

      <div className="text-[9px] font-mono text-slate-500 truncate">
        {sub}
      </div>
    </div>
  );
}

type ConfidenceBarProps = {
  label: string;
  value: number;
};

function ConfidenceBar({ label, value }: ConfidenceBarProps) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
        <span className="truncate">{label}</span>
        <span className="font-bold text-emerald-400">{value > 0 ? `${value}%` : "--"}</span>
      </div>

      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}