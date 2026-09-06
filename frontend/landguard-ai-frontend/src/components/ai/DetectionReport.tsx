import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ShieldCheck,
  MapPinned,
  Trees,
  Radar,
  CheckCircle2,
} from "lucide-react";

type DetectionReportProps = {
  detectionDone: boolean;
  isScanning: boolean;
  district: string;
  risk: number;
  cases: string;
  threat: string;
  vegetationLoss?: number;
};

export default function DetectionReport({
  detectionDone,
  isScanning,
  district,
  risk,
  cases,
  threat,
  vegetationLoss = 91,
}: DetectionReportProps) {
  
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-5 min-h-[430px] flex flex-col justify-between gap-4">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] font-mono text-emerald-400">
          AI Intelligence
        </p>

        <h2 className="text-xl font-bold text-white mt-1">
          Detection Report
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          {district} • Sentinel-2 MSI
        </p>
      </div>

      {/* Severity */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
        <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
          <AlertTriangle size={18} />

          {isScanning
            ? "Scanning..."
            : detectionDone
              ? "Critical Encroachment"
              : "Awaiting Detection"}
        </div>

        <p className="text-xs text-slate-300 mt-2">
          {isScanning
            ? "YOLOv8 is analyzing satellite imagery."
            : detectionDone
              ? threat
              : "Upload an image and click Run AI Detection."}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <MetricCard
          icon={<Radar size={16} />}
          label="AI Confidence"
          value={detectionDone ? `${risk}%` : "--"}
          color="emerald"
        />

        <MetricCard
          icon={<MapPinned size={16} />}
          label="Affected Area"
          value={detectionDone ? cases : "--"}
          color="amber"
        />

        <MetricCard
          icon={<Trees size={16} />}
          label="NDVI Loss"
          value={detectionDone ? `${vegetationLoss}%` : "--"}
          color="cyan"
        />

        <MetricCard
          icon={<ShieldCheck size={16} />}
          label="Risk Score"
          value={detectionDone ? `${risk}/100` : "--"}
          color="red"
        />
      </div>

      {/* Recommendation */}
      {detectionDone && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
            <CheckCircle2 size={18} />
            AI Recommendation
          </div>

          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li>• Issue stop-work notice.</li>
            <li>• Verify cadastral ownership.</li>
            <li>• Dispatch drone survey.</li>
            <li>• Notify Forest Department.</li>
          </ul>
        </div>
      )}

      {/* Confidence Bars */}
      <div className="space-y-3 mt-auto">
        <ConfidenceBar label="YOLOv8 Detection" value={detectionDone ? risk : 0} />
        <ConfidenceBar label="NDVI Vegetation Loss" value={detectionDone ? vegetationLoss : 0} />
        <ConfidenceBar label="Cadastre Match" value={detectionDone ? 88 : 0} />
      </div>

      {/* 🔗 CONNECT DETECTION -> HISTORY BUTTON */}
      <button
        onClick={() => navigate("/history")}
        disabled={!detectionDone}
        className="w-full mt-4 rounded-xl bg-emerald-500 py-3 font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        View Change Timeline
      </button>
    </div>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  color: "emerald" | "amber" | "cyan" | "red";
};

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500/20",
    amber: "text-amber-400 border-amber-500/20",
    cyan: "text-cyan-400 border-cyan-500/20",
    red: "text-red-400 border-red-500/20",
  };

  return (
    <div className={`rounded-lg border p-3 ${colors[color]}`}>
      <div className="flex items-center gap-2 text-[11px]">
        {icon}
        {label}
      </div>

      <div className="text-white font-bold text-lg mt-2">{value}</div>
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
      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
        <span>{label}</span>
        <span>{value > 0 ? `${value}%` : "--"}</span>
      </div>

      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}