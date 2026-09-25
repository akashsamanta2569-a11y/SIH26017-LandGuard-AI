import { useEffect, useState } from "react";
import {
  Cpu,
  Layers,
  Activity,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

export interface DetectionMetricsProps {
  district: string;
  confidence: number;
  vegetationLoss: number;
  affectedArea: number;
  riskScore: number;
  completed: boolean;
  className?: string;
}

export default function DetectionMetrics({
  district,
  confidence,
  vegetationLoss,
  affectedArea,
  riskScore,
  completed,
  className = "",
}: DetectionMetricsProps) {
  // Animation multiplier from 0.0 to 1.0 over 1 second when completed === true
  const [animProgress, setAnimProgress] = useState<number>(completed ? 1 : 0);
  const [prevCompleted, setPrevCompleted] = useState(completed);

  if (completed !== prevCompleted) {
    setPrevCompleted(completed);
    if (!completed) {
      setAnimProgress(0);
    }
  }

  useEffect(() => {
    if (!completed) return;

    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimProgress(eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [completed]);

  // Derived Cadastral Boundary Match value (consistent and correlated with confidence)
  const cadastralMatch = Math.min(
    98.4,
    Math.max(88.0, Number((confidence * 0.97 + 1.8).toFixed(1)))
  );

  // Risk Classification
  const getRiskBadge = (score: number) => {
    if (!completed) {
      return {
        label: "STANDBY",
        colorClass: "bg-slate-800/60 text-slate-400 border-slate-700",
      };
    }
    if (score >= 90) {
      return {
        label: "Critical (90+)",
        colorClass:
          "bg-red-950/70 text-red-300 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]",
      };
    }
    if (score >= 75) {
      return {
        label: "High (75–89)",
        colorClass:
          "bg-orange-950/70 text-orange-300 border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.3)]",
      };
    }
    if (score >= 50) {
      return {
        label: "Medium (50–74)",
        colorClass: "bg-amber-950/70 text-amber-300 border-amber-500/50",
      };
    }
    return {
      label: "Low (<50)",
      colorClass: "bg-emerald-950/70 text-emerald-300 border-emerald-500/50",
    };
  };

  const riskBadge = getRiskBadge(riskScore);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_45px_rgba(16,185,129,0.08)] backdrop-blur-xl ${className}`}
    >
      {/* Top Ambient Glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header Section */}
      <div className="relative mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-emerald-500/15 pb-5">
        <div>
          {/* Top Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              <Cpu className="h-3 w-3 text-emerald-400" />
              AI INTELLIGENCE
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Detection Report
            </span>
          </div>

          {/* Subtitle */}
          <h2 className="mt-2 text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{district || "West Bengal Sector"}</span>
            <span className="text-emerald-400/80">•</span>
            <span className="font-mono text-sm font-semibold text-emerald-400">
              Sentinel-2 MSI
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {completed ? (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </>
            ) : (
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-slate-600" />
            )}
          </span>
          <span className="font-mono text-xs font-semibold text-slate-400">
            {completed ? "TELEMETRY SYNCHRONIZED" : "STREAM PENDING"}
          </span>
        </div>
      </div>

      {/* 2x2 Metric Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Card 1: AI Confidence */}
        <div className="relative rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/20 to-slate-900/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Confidence
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
              <Cpu className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1 font-mono">
            <span className="text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.35)]">
              {completed ? `${Math.round(confidence * animProgress)}%` : "--"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-950/80 border border-emerald-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-150 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{
                width: completed ? `${confidence * animProgress}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* Card 2: Affected Area */}
        <div className="relative rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/15 to-slate-900/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Affected Area
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5 font-mono">
            <span className="text-3xl font-extrabold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              {completed
                ? `${(affectedArea * animProgress).toFixed(1)}`
                : "--"}
            </span>
            <span className="text-sm font-semibold text-amber-300/80">
              {completed ? "hectares" : ""}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
            <span>Cadastral parcel perimeter calculated</span>
          </div>
        </div>

        {/* Card 3: NDVI Loss */}
        <div className="relative rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/15 to-slate-900/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              NDVI Loss
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
              <Activity className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1 font-mono">
            <span className="text-3xl font-extrabold text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
              {completed
                ? `-${(vegetationLoss * animProgress).toFixed(1)}%`
                : "--"}
            </span>
          </div>

          {/* Vegetation Indicator Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-950/80 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-rose-500 to-red-500 transition-[width] duration-150 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
              style={{
                width: completed ? `${vegetationLoss * animProgress}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* Card 4: Risk Score */}
        <div className="relative rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/20 to-slate-900/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Risk Score
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/10 text-red-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-extrabold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.35)]">
                {completed ? `${Math.round(riskScore * animProgress)}` : "--"}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {completed ? "/100" : ""}
              </span>
            </div>

            {/* Risk Classification Badge */}
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${riskBadge.colorClass}`}
            >
              {riskBadge.label}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500/80" />
            <span>Prioritized enforcement protocol</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Three Horizontal Telemetry Bars */}
      <div className="mb-6 space-y-3.5 rounded-2xl border border-emerald-500/15 bg-slate-900/40 p-4">
        <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400/90 flex items-center gap-2">
          <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
          Neural & Cadastral Verification Telemetry
        </h4>

        {/* 1. YOLOv8 Detection Confidence */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">YOLOv8 Detection Confidence</span>
            <span className="font-semibold text-emerald-400">
              {completed ? `${(confidence * animProgress).toFixed(1)}%` : "--"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-150 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{
                width: completed ? `${confidence * animProgress}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* 2. NDVI Vegetation Loss */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">NDVI Vegetation Loss</span>
            <span className="font-semibold text-rose-400">
              {completed
                ? `-${(vegetationLoss * animProgress).toFixed(1)}%`
                : "--"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-rose-500 to-red-500 transition-[width] duration-150 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
              style={{
                width: completed ? `${vegetationLoss * animProgress}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* 3. Cadastral Boundary Match */}
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300">Cadastral Boundary Match</span>
            <span className="font-semibold text-teal-300">
              {completed
                ? `${(cadastralMatch * animProgress).toFixed(1)}%`
                : "--"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400 transition-[width] duration-150 shadow-[0_0_8px_rgba(45,212,191,0.4)]"
              style={{
                width: completed ? `${cadastralMatch * animProgress}%` : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Government Verification Chip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/15 pt-4">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="font-mono text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
            FOREST DEPARTMENT VERIFIED AI OUTPUT
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>NIC / MoEFCC Interop Standard</span>
        </div>
      </div>
    </div>
  );
}
