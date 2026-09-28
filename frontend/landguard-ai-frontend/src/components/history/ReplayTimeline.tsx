import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { PredictionHistoryMonth } from "./types";

export interface ReplayTimelineProps {
  months: PredictionHistoryMonth[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
}

export default function ReplayTimeline({
  months,
  currentIndex,
  onSelectIndex,
  isPlaying,
  onTogglePlay,
  onRestart,
}: ReplayTimelineProps) {
  const progressPercent = (currentIndex / (months.length - 1)) * 100;

  return (
    <div className="relative rounded-2xl border border-[#00F5C3]/20 bg-[#081326]/85 p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Top Header Row with Replay Controls Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#00F5C3] animate-pulse shadow-[0_0_8px_#00F5C3]" />
          <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            ISRO-Style Multi-Temporal Replay Progression (2026)
          </h3>
          <span className="hidden sm:inline-block rounded border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2 py-0.5 font-mono text-[10px] text-[#00E5FF]">
            ORBIT PASS: S2B-MSI
          </span>
        </div>

        {/* Quick Timeline Play / Pause / Reset Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs font-semibold backdrop-blur-md transition-all ${
              isPlaying
                ? "border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "border-[#00F5C3]/50 bg-[#00F5C3]/20 text-[#00F5C3] shadow-[0_0_12px_rgba(0,245,195,0.25)]"
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
                <span>PLAY REPLAY</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 font-mono text-xs text-slate-300 hover:text-white hover:border-slate-500"
            title="Restart Replay from June 2026"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">RESET</span>
          </motion.button>
        </div>
      </div>

      {/* Progress Track & Nodes */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[500px] relative pt-6 pb-2 px-3 sm:px-6">
        {/* Background Inactive Track */}
        <div className="absolute top-10 left-6 right-6 h-1 rounded-full bg-slate-800" />

        {/* Glowing Teal Progress Line */}
        <motion.div
          className="absolute top-10 left-6 h-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00F5C3] shadow-[0_0_12px_#00F5C3]"
          animate={{
            width: `calc(${progressPercent}% * 0.92)`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* 4 Interactive Timeline Stages */}
        <div className="relative z-10 flex justify-between items-start">
          {months.map((item, idx) => {
            const isSelected = idx === currentIndex;
            const isPassed = idx < currentIndex;

            return (
              <button
                key={item.month}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className="group flex flex-col items-center focus:outline-none"
              >
                {/* Stage Circle Node */}
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
                      : isPassed
                      ? "0 0 8px rgba(0,229,255,0.3)"
                      : "none",
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 bg-[#050C18] transition-colors ${
                    isSelected
                      ? "border-[#00F5C3] bg-[#00F5C3]/20"
                      : isPassed
                      ? "border-[#00E5FF]/70"
                      : "border-slate-700"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full transition-transform ${
                      isSelected
                        ? "bg-[#00F5C3] scale-125 shadow-[0_0_8px_#00F5C3]"
                        : isPassed
                        ? "bg-[#00E5FF]"
                        : "bg-slate-700"
                    }`}
                  />
                </motion.div>

                {/* Stage Month & Label */}
                <div className="mt-3 flex flex-col items-center text-center">
                  <span
                    className={`font-mono text-xs font-bold transition-colors ${
                      isSelected
                        ? "text-[#00F5C3] drop-shadow-[0_0_8px_rgba(0,245,195,0.5)]"
                        : isPassed
                        ? "text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    {item.month}
                  </span>
                  <span
                    className={`mt-0.5 font-mono text-[10px] hidden sm:block ${
                      isSelected ? "text-slate-300 font-semibold" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Micro metric preview */}
                  <span
                    className={`mt-1 rounded px-1.5 py-0.2 font-mono text-[9px] ${
                      isSelected
                        ? "bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40"
                        : "text-slate-500"
                    }`}
                  >
                    {item.canopyLoss > 0 ? `-${item.canopyLoss}% NDVI` : "Intact"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
}
