import { motion, AnimatePresence } from "framer-motion";
import { TreePine, Building2, MapPin, Sparkles } from "lucide-react";
import type { PredictionHistoryMonth } from "./types";

export interface HistoryMetricsProps {
  currentMonth: PredictionHistoryMonth;
}

export default function HistoryMetrics({ currentMonth }: HistoryMetricsProps) {
  const cards = [
    {
      id: "canopy-loss",
      label: "Canopy Loss Index",
      value: `${currentMonth.canopyLoss}%`,
      subtext: currentMonth.canopyLoss === 0 ? "Full Baseline Coverage" : "Vegetation Deficit Detected",
      icon: TreePine,
      color: "text-[#FF4D6D]",
      borderColor: "border-[#FF4D6D]/30",
      glowColor: "shadow-[0_0_15px_rgba(255,77,109,0.15)]",
      badge: currentMonth.canopyLoss > 15 ? "CRITICAL DEFICIT" : currentMonth.canopyLoss > 0 ? "WARNING" : "INTACT",
      badgeStyle: currentMonth.canopyLoss > 15 ? "bg-[#FF4D6D]/20 text-[#FF4D6D] border-[#FF4D6D]/40" : currentMonth.canopyLoss > 0 ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    },
    {
      id: "built-area",
      label: "Built Footprint",
      value: `${currentMonth.builtArea.toLocaleString()} m²`,
      subtext: currentMonth.builtArea > 0 ? `~${(currentMonth.builtArea / 10000).toFixed(2)} Ha Artificial Surface` : "Zero Man-made Structures",
      icon: Building2,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
      badge: "EXCAVATION",
      badgeStyle: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    },
    {
      id: "plots-encroached",
      label: "Cadastral Plots Encroached",
      value: `${currentMonth.plots} Plots`,
      subtext: "Revenue Survey Register #14-#16",
      icon: MapPin,
      color: "text-[#00E5FF]",
      borderColor: "border-[#00E5FF]/30",
      glowColor: "shadow-[0_0_15px_rgba(0,229,255,0.15)]",
      badge: "CADASTRE",
      badgeStyle: "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40",
    },
    {
      id: "ai-confidence",
      label: "AI Neural Confidence",
      value: `${currentMonth.confidence}%`,
      subtext: "YOLOv8 Multi-Spectral Model",
      icon: Sparkles,
      color: "text-[#00F5C3]",
      borderColor: "border-[#00F5C3]/30",
      glowColor: "shadow-[0_0_15px_rgba(0,245,195,0.2)]",
      badge: "IoU: 0.94",
      badgeStyle: "bg-[#00F5C3]/20 text-[#00F5C3] border-[#00F5C3]/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-xl border ${card.borderColor} bg-[#081326]/80 p-4.5 backdrop-blur-md transition-all duration-300 hover:border-opacity-60 ${card.glowColor}`}
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/5 blur-xl" />

            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold ${card.badgeStyle}`}>
                  {card.badge}
                </span>
                <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Number Counter with Smooth Transition */}
            <div className="mt-3 min-h-[38px] flex items-baseline">
              <AnimatePresence mode="wait">
                <motion.div
                  key={card.value}
                  initial={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-tight ${card.color}`}
                >
                  {card.value}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Subtext and Delta Metadata */}
            <div className="mt-1 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono text-[10px] text-slate-400">
              <span className="truncate">{card.subtext}</span>
              <span className="text-[#00F5C3]/70 font-semibold">{currentMonth.month}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
