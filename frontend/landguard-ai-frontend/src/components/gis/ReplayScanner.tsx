import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Activity, ShieldAlert, Sparkles } from "lucide-react";

export interface ReplayStage {
  month: string;
  label: string;
  ndviOpacity: number;
  confidence: number;
  lossArea: number;
  polygonScale: number;
  threatLevel: "None" | "Early Warning" | "Excavation" | "Critical Breach";
}

export const REPLAY_STAGES: ReplayStage[] = [
  {
    month: "Jun 2026",
    label: "Intact Canopy Baseline",
    ndviOpacity: 1.0,
    confidence: 78.0,
    lossArea: 0,
    polygonScale: 0,
    threatLevel: "None",
  },
  {
    month: "Jul 2026",
    label: "Nascent Vegetation Thinning",
    ndviOpacity: 0.75,
    confidence: 84.5,
    lossArea: 4.2,
    polygonScale: 0.45,
    threatLevel: "Early Warning",
  },
  {
    month: "Aug 2026",
    label: "Foundation Earthmoving",
    ndviOpacity: 0.45,
    confidence: 91.2,
    lossArea: 11.6,
    polygonScale: 0.8,
    threatLevel: "Excavation",
  },
  {
    month: "Sep 2026",
    label: "Illegal Perimeter Encroachment",
    ndviOpacity: 0.15,
    confidence: 96.4,
    lossArea: 18.6,
    polygonScale: 1.0,
    threatLevel: "Critical Breach",
  },
];

export interface ReplayScannerProps {
  onStageChange?: (stage: ReplayStage, stageIndex: number) => void;
  className?: string;
}

export default function ReplayScanner({
  onStageChange,
  className = "",
}: ReplayScannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    onStageChange?.(REPLAY_STAGES[currentIndex], currentIndex);
  }, [currentIndex, onStageChange]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < REPLAY_STAGES.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return 0;
        }
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStage = REPLAY_STAGES[currentIndex];
  const progressPercent = (currentIndex / (REPLAY_STAGES.length - 1)) * 100;

  return (
    <div
      className={`rounded-2xl border border-[#00F5C3]/30 bg-[#050C18]/95 p-4 font-mono shadow-[0_8px_32px_rgba(5,12,24,0.95)] backdrop-blur-2xl space-y-4 select-none ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#00F5C3]/30 bg-[#00F5C3]/10 text-[#00F5C3]">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              GIS Multi-Temporal Replay Engine
            </h4>
            <span className="text-[10px] text-[#00E5FF]">
              HISTORICAL CHANGE-DETECTION CADENCE
            </span>
          </div>
        </div>

        {/* Play/Pause & Reset Transport Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? "border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                : "border-[#00F5C3] bg-[#00F5C3]/20 text-[#00F5C3] shadow-[0_0_12px_rgba(0,245,195,0.25)]"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>START REPLAY</span>
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentIndex(0);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white"
            title="Reset to June 2026 Baseline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stepped Timeline Track with Glowing Teal Path */}
      <div className="relative pt-6 pb-2 px-3 sm:px-6">
        {/* Background Track */}
        <div className="absolute top-10 left-6 right-6 h-1 rounded-full bg-slate-800" />

        {/* Glowing Teal Line Following Timeline */}
        <motion.div
          className="absolute top-10 left-6 h-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00F5C3] shadow-[0_0_12px_#00F5C3]"
          animate={{
            width: `calc(${progressPercent}% * 0.92)`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* 4 Interactive Nodes */}
        <div className="relative z-10 flex justify-between items-start">
          {REPLAY_STAGES.map((stage, idx) => {
            const isSelected = idx === currentIndex;
            const isPassed = idx < currentIndex;

            return (
              <button
                key={stage.month}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="group flex flex-col items-center focus:outline-none"
              >
                {/* Node Dot */}
                <motion.div
                  whileHover={{ scale: 1.25 }}
                  animate={{
                    borderColor: isSelected
                      ? "#00F5C3"
                      : isPassed
                      ? "#00E5FF"
                      : "rgba(51, 65, 85, 0.8)",
                    boxShadow: isSelected
                      ? "0 0 16px #00F5C3, 0 0 25px rgba(0,245,195,0.4)"
                      : "none",
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-[#050C18] transition-colors ${
                    isSelected ? "bg-[#00F5C3]/20" : ""
                  }`}
                >
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      isSelected
                        ? "bg-[#00F5C3] shadow-[0_0_8px_#00F5C3]"
                        : isPassed
                        ? "bg-[#00E5FF]"
                        : "bg-slate-700"
                    }`}
                  />
                </motion.div>

                {/* Labels */}
                <div className="mt-2.5 flex flex-col items-center text-center">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-[#00F5C3]" : "text-slate-400"
                    }`}
                  >
                    {stage.month}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:block">
                    {stage.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Replay Stage Readout Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-t border-slate-800/80 pt-3 text-xs">
        <div className="rounded-lg border border-slate-800 bg-[#081326] p-2">
          <span className="text-[10px] text-slate-500">STAGE THREAT:</span>
          <div className="font-bold text-[#FF4D6D] flex items-center gap-1 mt-0.5">
            <ShieldAlert className="h-3 w-3" />
            <span className="truncate">{currentStage.threatLevel}</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#081326] p-2">
          <span className="text-[10px] text-slate-500">CANOPY LOSS:</span>
          <div className="font-bold text-amber-300 mt-0.5">
            {currentStage.lossArea} Ha
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#081326] p-2">
          <span className="text-[10px] text-slate-500">AI CONFIDENCE:</span>
          <div className="font-bold text-[#00F5C3] flex items-center gap-1 mt-0.5">
            <Sparkles className="h-3 w-3" />
            <span>{currentStage.confidence}%</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#081326] p-2">
          <span className="text-[10px] text-slate-500">NDVI REMNANT:</span>
          <div className="font-bold text-[#00E5FF] mt-0.5">
            {(currentStage.ndviOpacity * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
