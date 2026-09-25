import React, { useEffect, useState, useRef } from "react";
import {
  Satellite,
  Activity,
  Scan,
  CheckCircle2,
  Loader2,
  Radio,
  Layers,
  MapPin,
  Scale,
  BrainCircuit,
  FileCheck,
} from "lucide-react";

export interface DetectionProgressProps {
  isRunning: boolean;
  onComplete: () => void;
  className?: string;
  theme?: "dark" | "light";
}

interface PipelineStage {
  id: number;
  name: string;
  subtext: string;
  icon: React.ElementType;
}

const EIGHT_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: "Sentinel-2 Multi-Spectral Ingestion",
    subtext: "Bands B02-B08 Level-2A BOA",
    icon: Satellite,
  },
  {
    id: 2,
    name: "Atmospheric & Cloud Masking",
    subtext: "ESA S2Cor cloud shadow removal",
    icon: Layers,
  },
  {
    id: 3,
    name: "NDVI Radiometric Differential",
    subtext: "Canopy density & biophysical loss",
    icon: Activity,
  },
  {
    id: 4,
    name: "YOLOv8 Neural Segmentation",
    subtext: "Deep boundary polygon inference",
    icon: Scan,
  },
  {
    id: 5,
    name: "DoLR / LRO Cadastre Intersect",
    subtext: "BanglarBhumi Dag & Khatian match",
    icon: MapPin,
  },
  {
    id: 6,
    name: "RFCTLARR 2013 Statutory Scan",
    subtext: "Section 11 notice & §38 checks",
    icon: Scale,
  },
  {
    id: 7,
    name: "XGBoost & SHAP Attribution",
    subtext: "Delay Shapley value attribution",
    icon: BrainCircuit,
  },
  {
    id: 8,
    name: "Final Intelligence Dossier",
    subtext: "LAO alert & GeoJSON packaging",
    icon: FileCheck,
  },
];

export default function DetectionProgress({
  isRunning,
  onComplete,
  className = "",
  theme = "dark",
}: DetectionProgressProps) {
  const [progress, setProgress] = useState<number>(0);
  const [prevIsRunning, setPrevIsRunning] = useState(isRunning);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  if (isRunning !== prevIsRunning) {
    setPrevIsRunning(isRunning);
    if (!isRunning) {
      setProgress(0);
    }
  }

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 3.5-second smooth progression across 8 stages
  useEffect(() => {
    if (!isRunning) return;

    const duration = 3500; // 3.5 seconds
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

  // 8 stages: each stage takes 12.5%
  const currentStageIndex =
    progress >= 100
      ? 8
      : Math.floor(progress / 12.5);

  const currentStageLabel =
    progress >= 100
      ? "AI Investigation Dossier Finalized"
      : currentStageIndex >= 0 && currentStageIndex < EIGHT_STAGES.length
        ? EIGHT_STAGES[currentStageIndex].name
        : "Awaiting Ingestion Trigger";

  const isDark = theme === "dark";
  const bgCard = isDark ? "rgba(10,18,28,0.95)" : "rgba(255,255,255,0.96)";
  const borderCard = isDark ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.3)";
  const textTitle = isDark ? "#ffffff" : "#0f172a";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 ${className}`}
      style={{
        background: bgCard,
        border: `1px solid ${borderCard}`,
        boxShadow: isDark
          ? "0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.12)"
          : "0 10px 30px rgba(0,0,0,0.06)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Top ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-36 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header section: Status pill and animated percentage */}
      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-4">
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
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {progress >= 100
                ? "8-Stage Pipeline Complete"
                : isRunning
                  ? "Multi-Spectral AI Pipeline Active"
                  : "Engine Idle"}
            </span>
            {isRunning && progress < 100 && (
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                <Radio className="h-3 w-3 animate-pulse text-emerald-400" />
                Live 8-Stage Execution
              </span>
            )}
          </div>
          <h3 className="mt-1 text-base md:text-lg font-bold" style={{ color: textTitle }}>
            {currentStageLabel}
          </h3>
        </div>

        {/* Digital percentage display */}
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-3xl md:text-4xl font-black tracking-tight text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]">
            {Math.round(progress)}
          </span>
          <span className="text-lg font-bold text-emerald-500/80">%</span>
        </div>
      </div>

      {/* Main animated progress bar */}
      <div className="relative mb-6">
        <div className="h-3 w-full overflow-hidden rounded-full border border-emerald-500/20 bg-slate-900/90 p-0.5 shadow-inner">
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-400 to-cyan-400 transition-[width] duration-75 ease-out shadow-[0_0_18px_rgba(52,211,153,0.55)]"
            style={{ width: `${progress}%` }}
          >
            {isRunning && progress < 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            )}
          </div>
        </div>

        {/* Milestone tick marks at every 12.5% (8 intervals) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-3 items-center justify-between px-2">
          {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((tickVal) => (
            <div
              key={tickVal}
              className={`h-2 w-0.5 rounded-full ${progress >= tickVal ? "bg-emerald-300/70" : "bg-slate-700/60"
                }`}
            />
          ))}
        </div>
      </div>

      {/* 8-Stage Pipeline Investigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {EIGHT_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const stageThreshold = (idx + 1) * 12.5;
          const prevThreshold = idx * 12.5;
          const isComplete = progress >= stageThreshold;
          const isActive =
            isRunning &&
            !isComplete &&
            progress >= prevThreshold &&
            progress < stageThreshold;

          return (
            <div
              key={stage.id}
              className="relative flex flex-col justify-between rounded-2xl border p-3 transition-all duration-300"
              style={{
                background: isComplete
                  ? "rgba(16,185,129,0.1)"
                  : isActive
                    ? "rgba(16,185,129,0.18)"
                    : isDark
                      ? "rgba(15,23,42,0.4)"
                      : "rgba(241,245,249,0.6)",
                borderColor: isComplete
                  ? "rgba(16,185,129,0.4)"
                  : isActive
                    ? "#10b981"
                    : isDark
                      ? "rgba(51,65,85,0.6)"
                      : "rgba(226,232,240,0.8)",
                boxShadow: isActive ? "0 0 20px rgba(16,185,129,0.25)" : "none",
              }}
            >
              {/* Top row: Stage number, Icon & Status */}
              <div className="flex items-center justify-between">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg border transition-colors"
                  style={{
                    background: isComplete
                      ? "rgba(16,185,129,0.2)"
                      : isActive
                        ? "rgba(16,185,129,0.3)"
                        : "rgba(30,41,59,0.6)",
                    borderColor: isComplete || isActive ? "rgba(16,185,129,0.4)" : "rgba(51,65,85,0.6)",
                    color: isComplete || isActive ? "#10b981" : "#64748b",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono font-bold text-slate-500">
                    0{stage.id}
                  </span>
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
              </div>

              {/* Stage title & details */}
              <div className="mt-2.5">
                <p
                  className="text-[11px] font-bold leading-tight"
                  style={{
                    color: isComplete ? "#a7f3d0" : isActive ? "#10b981" : textTitle,
                  }}
                >
                  {stage.name}
                </p>
                <p className="mt-0.5 text-[9px] leading-snug text-slate-400 line-clamp-1">
                  {stage.subtext}
                </p>
              </div>

              {/* Mini progress line on active stage */}
              {isActive && (
                <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-emerald-950">
                  <div
                    className="h-full bg-emerald-400 transition-[width] duration-75"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, ((progress - prevThreshold) / 12.5) * 100)
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
