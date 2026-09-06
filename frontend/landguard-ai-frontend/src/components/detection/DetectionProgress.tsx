import React, { useEffect, useState, useRef } from "react";
import {
  Satellite,
  Activity,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Radio,
} from "lucide-react";

export interface DetectionProgressProps {
  isRunning: boolean;
  onComplete: () => void;
  className?: string;
}

interface PipelineStage {
  id: number;
  name: string;
  subtext: string;
  icon: React.ElementType;
}

const STAGES: PipelineStage[] = [
  {
    id: 1,
    name: "Satellite Ingestion",
    subtext: "Sentinel-2 multispectral feed",
    icon: Satellite,
  },
  {
    id: 2,
    name: "NDVI Vegetation Analysis",
    subtext: "Canopy density & loss index",
    icon: Activity,
  },
  {
    id: 3,
    name: "YOLOv8 Encroachment Detection",
    subtext: "Neural boundary & object inference",
    icon: Scan,
  },
  {
    id: 4,
    name: "Risk Classification Complete",
    subtext: "Zoning threat matrix evaluated",
    icon: ShieldCheck,
  },
];

export default function DetectionProgress({
  isRunning,
  onComplete,
  className = "",
}: DetectionProgressProps) {
  const [progress, setProgress] = useState<number>(0);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  // Keep callback reference updated without restarting the effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 3-second auto-progress animation
  useEffect(() => {
    if (!isRunning) {
      setProgress(0);
      completedRef.current = false;
      return;
    }

    const duration = 3000; // 3 seconds
    let animationFrameId: number;
    const startTime = performance.now();
    completedRef.current = false;

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(calculatedProgress);

      if (calculatedProgress < 100) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        if (!completedRef.current) {
          completedRef.current = true;
          onCompleteRef.current?.();
        }
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning]);

  // Determine active stage index (0 to 3, or 4 when 100% complete)
  const currentStageIndex =
    progress >= 100
      ? 4
      : progress >= 75
      ? 3
      : progress >= 50
      ? 2
      : progress >= 25
      ? 1
      : isRunning
      ? 0
      : -1;

  const currentStageLabel =
    progress >= 100
      ? "Analysis Complete"
      : currentStageIndex >= 0 && currentStageIndex < STAGES.length
      ? STAGES[currentStageIndex].name
      : "Awaiting Trigger";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-slate-950/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-xl ${className}`}
    >
      {/* Subtle top ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header section: Status pill and animated percentage */}
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isRunning && progress < 100 ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </>
              ) : progress >= 100 ? (
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              ) : (
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-slate-600" />
              )}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">
              {progress >= 100
                ? "Inspection Finalized"
                : isRunning
                ? "Neural Pipeline Active"
                : "Engine Idle"}
            </span>
            {isRunning && progress < 100 && (
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
                Live 3.0s Auto-scan
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-slate-100">
            {currentStageLabel}
          </h3>
        </div>

        {/* Big digital percentage display */}
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-4xl font-black tracking-tight text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">
            {Math.round(progress)}
          </span>
          <span className="text-xl font-bold text-emerald-500/80">%</span>
        </div>
      </div>

      {/* Main animated progress bar */}
      <div className="relative mb-8">
        <div className="h-3.5 w-full overflow-hidden rounded-full border border-emerald-500/20 bg-slate-900/90 p-0.5 shadow-inner">
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 transition-[width] duration-75 ease-out shadow-[0_0_18px_rgba(52,211,153,0.55)]"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer sweep overlay */}
            {isRunning && progress < 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            )}
          </div>
        </div>

        {/* Milestone tick marks at 25%, 50%, 75% */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-3.5 items-center justify-between px-[25%]">
          <div
            className={`h-2.5 w-0.5 rounded-full ${
              progress >= 25 ? "bg-emerald-300/60" : "bg-slate-700/60"
            }`}
          />
          <div
            className={`h-2.5 w-0.5 rounded-full ${
              progress >= 50 ? "bg-emerald-300/60" : "bg-slate-700/60"
            }`}
          />
          <div
            className={`h-2.5 w-0.5 rounded-full ${
              progress >= 75 ? "bg-emerald-300/60" : "bg-slate-700/60"
            }`}
          />
        </div>
      </div>

      {/* 4 Pipeline Stages Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isComplete = progress >= (idx + 1) * 25;
          const isActive =
            isRunning &&
            !isComplete &&
            progress >= idx * 25 &&
            progress < (idx + 1) * 25;

          return (
            <div
              key={stage.id}
              className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-300 ${
                isComplete
                  ? "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                  : isActive
                  ? "border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/40"
                  : "border-slate-800/80 bg-slate-900/40 opacity-60"
              }`}
            >
              {/* Top row: Stage number, Icon & Status indicator */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                    isComplete
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                      : isActive
                      ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                      : "border-slate-800 bg-slate-800/60 text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-semibold text-slate-500">
                    0{stage.id}
                  </span>
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                  )}
                </div>
              </div>

              {/* Stage title & details */}
              <div className="mt-3">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    isComplete
                      ? "text-emerald-200"
                      : isActive
                      ? "text-emerald-300 font-bold"
                      : "text-slate-400"
                  }`}
                >
                  {stage.name}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-slate-500 line-clamp-2">
                  {stage.subtext}
                </p>
              </div>

              {/* Mini progress cue line on active card */}
              {isActive && (
                <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-emerald-950">
                  <div
                    className="h-full bg-emerald-400 transition-[width] duration-75"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, ((progress - idx * 25) / 25) * 100)
                      )}%`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
