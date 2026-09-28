import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Zap,
} from "lucide-react";
import type { PredictionHistoryMonth } from "./types";

export interface ReplayControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  speed: 1 | 2 | 4;
  onSpeedChange: (speed: 1 | 2 | 4) => void;
  onRestart: () => void;
  currentMonth: PredictionHistoryMonth;
}

export default function ReplayControls({
  isPlaying,
  onTogglePlay,
  onPrevMonth,
  onNextMonth,
  hasPrev,
  hasNext,
  speed,
  onSpeedChange,
  onRestart,
  currentMonth,
}: ReplayControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#081326]/90 p-3.5 backdrop-blur-md shadow-lg">
      {/* Current Month & Label Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-[#00F5C3]/30 bg-[#00F5C3]/10 px-3 py-1 font-mono text-xs text-[#00F5C3]">
          <span className="h-2 w-2 rounded-full bg-[#00F5C3] animate-pulse" />
          <span className="font-bold">{currentMonth.month}</span>
          <span className="text-slate-400">({currentMonth.label})</span>
        </div>
      </div>

      {/* Main Transport Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Restart Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 transition hover:border-slate-500 hover:text-white"
          title="Restart to June 2026 Baseline"
        >
          <RotateCcw className="h-4 w-4" />
        </motion.button>

        {/* Previous Month */}
        <motion.button
          type="button"
          whileHover={{ scale: hasPrev ? 1.05 : 1 }}
          whileTap={{ scale: hasPrev ? 0.95 : 1 }}
          onClick={onPrevMonth}
          disabled={!hasPrev}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
            hasPrev
              ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:border-[#00E5FF] hover:text-[#00E5FF]"
              : "border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed"
          }`}
          title="Previous Month"
        >
          <SkipBack className="h-4 w-4" />
        </motion.button>

        {/* Play / Pause Toggle Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTogglePlay}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs font-bold transition-all shadow-md ${
            isPlaying
              ? "border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              : "border-[#00F5C3] bg-[#00F5C3]/20 text-[#00F5C3] shadow-[0_0_15px_rgba(0,245,195,0.35)]"
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              <span>PAUSE REPLAY</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>START REPLAY</span>
            </>
          )}
        </motion.button>

        {/* Next Month */}
        <motion.button
          type="button"
          whileHover={{ scale: hasNext ? 1.05 : 1 }}
          whileTap={{ scale: hasNext ? 0.95 : 1 }}
          onClick={onNextMonth}
          disabled={!hasNext}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
            hasNext
              ? "border-slate-700 bg-slate-800/80 text-slate-200 hover:border-[#00E5FF] hover:text-[#00E5FF]"
              : "border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed"
          }`}
          title="Next Month"
        >
          <SkipForward className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Speed Selector (1x, 2x, 4x) */}
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 p-1">
        <span className="flex items-center gap-1 px-1.5 font-mono text-[10px] text-slate-500">
          <Zap className="h-3 w-3 text-[#00F5C3]" />
          <span>SPEED:</span>
        </span>
        {([1, 2, 4] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={`rounded px-2.5 py-0.5 font-mono text-xs font-bold transition-all ${
              speed === s
                ? "border border-[#00F5C3]/60 bg-[#00F5C3]/20 text-[#00F5C3] shadow-[0_0_8px_rgba(0,245,195,0.3)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
