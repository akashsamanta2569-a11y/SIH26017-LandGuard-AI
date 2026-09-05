import {
  AlertTriangle,
  ShieldCheck,
  MapPinned,
  Trees,
  Radar,
  CheckCircle2,
} from "lucide-react";

export default function DetectionReport() {
  return (
    <div className="h-[560px] rounded-2xl border border-emerald-500/20 bg-slate-950/70 backdrop-blur-xl p-4 flex flex-col gap-4">

      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] font-mono text-emerald-400">
          AI Intelligence
        </p>

        <h2 className="text-xl font-bold text-white mt-1">
          Detection Report
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          South 24 Parganas • Sentinel-2 MSI
        </p>
      </div>

      {/* Severity */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
        <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
          <AlertTriangle size={18} />
          Critical Encroachment
        </div>

        <p className="text-xs text-slate-300 mt-2">
          Illegal mangrove clearing detected with 97% AI confidence.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">

        <MetricCard
          icon={<Radar size={16} />}
          label="AI Confidence"
          value="97%"
          color="emerald"
        />

        <MetricCard
          icon={<MapPinned size={16} />}
          label="Affected Area"
          value="14.7 ha"
          color="amber"
        />

        <MetricCard
          icon={<Trees size={16} />}
          label="NDVI Loss"
          value="-18.2%"
          color="cyan"
        />

        <MetricCard
          icon={<ShieldCheck size={16} />}
          label="Risk Score"
          value="92 /100"
          color="red"
        />
      </div>

      {/* Recommendation */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
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

      {/* Confidence Bars */}
      <div className="space-y-3 mt-auto">
        <ConfidenceBar label="YOLOv8 Detection" value={97} />
        <ConfidenceBar label="NDVI Vegetation Loss" value={91} />
        <ConfidenceBar label="Cadastre Match" value={88} />
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: any) {
  const colors: any = {
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

      <div className="text-white font-bold text-lg mt-2">
        {value}
      </div>
    </div>
  );
}

function ConfidenceBar({ label, value }: any) {
  return (
    <div>
      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}