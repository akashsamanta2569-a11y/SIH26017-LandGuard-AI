import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AlertData } from "./types";
export type { AlertData };
import {
  MapPin,
  Satellite,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Radio,
} from "lucide-react";
import AlertExpanded from "./AlertExpanded";
export interface AlertCardProps {
  alert: AlertData;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  showTimeline?: boolean;
  isLast?: boolean;
}
const formatIST = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};
export default function AlertCard({
  alert,
  isExpanded: controlledExpanded,
  onToggleExpand,
  showTimeline = true,
  isLast = false,
}: AlertCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  // Severity color mappings matching specification:
  // Critical → Red (#FF4D6D)
  // High → Amber
  // Medium → Yellow
  // Resolved → Green
  const getSeverityStyle = (sev: string) => {
    const lower = sev.toLowerCase();
    if (lower.includes("crit")) {
      return {
        badge: "bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/50 shadow-[0_0_10px_rgba(255,77,109,0.2)]",
        node: "border-[#FF4D6D] shadow-[0_0_12px_#FF4D6D]",
        glow: "bg-[#FF4D6D]",
      };
    }
    if (lower.includes("high")) {
      return {
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
        node: "border-amber-400 shadow-[0_0_12px_#F59E0B]",
        glow: "bg-amber-400",
      };
    }
    if (lower.includes("med")) {
      return {
        badge: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
        node: "border-yellow-400 shadow-[0_0_12px_#EAB308]",
        glow: "bg-yellow-400",
      };
    }
    // Resolved or Low -> Green
    return {
      badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      node: "border-emerald-400 shadow-[0_0_12px_#10B981]",
      glow: "bg-emerald-400",
    };
  };

  const severityStyle = getSeverityStyle(alert.severity);

  return (
    <div className="relative flex items-start gap-4">
      {/* STEP 6: TIMELINE EFFECT */}
      {showTimeline && (
        <div className="relative flex flex-col items-center self-stretch">
          {/* Timeline Node with Hover Enlarge and Continuous Pulse */}
          <motion.div
            whileHover={{ scale: 1.25 }}
            animate={{
              boxShadow: [
                "0 0 8px rgba(0,245,195,0.4)",
                "0 0 18px rgba(0,245,195,0.85)",
                "0 0 8px rgba(0,245,195,0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#050C18] border-2 transition-transform duration-200 cursor-pointer ${severityStyle.node}`}
            onClick={handleToggle}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full ${severityStyle.glow} animate-pulse`}
            />
          </motion.div>

          {/* Continuous or glowing vertical line - Laser beam animates downward */}
          {!isLast && (
            <div
              className={`relative w-0.5 flex-1 transition-all duration-300 ${
                isExpanded
                  ? "bg-gradient-to-b from-[#00F5C3] via-[#00E5FF] to-[#00F5C3]/40 shadow-[0_0_12px_#00F5C3]"
                  : "bg-slate-800"
              }`}
            >
              {isExpanded && (
                <motion.div
                  initial={{ y: "-100%" }}
                  animate={{ y: "150%" }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                  className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#00F5C3] to-transparent shadow-[0_0_15px_#00F5C3]"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Glassmorphic Card Container */}
      <motion.div
        layout
        onClick={handleToggle}
        className={`group relative mb-5 flex-1 cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
          isExpanded
            ? "border-[#00F5C3]/60 bg-[#050C18]/95 shadow-[0_4px_30px_rgba(5,12,24,0.9),0_0_25px_rgba(0,245,195,0.18)] ring-1 ring-[#00F5C3]/40"
            : "border-slate-800/90 bg-[#050C18]/85 hover:border-[#00F5C3]/40 hover:bg-[#081326]/90 hover:shadow-[0_4px_25px_rgba(5,12,24,0.8),0_0_15px_rgba(0,245,195,0.08)]"
        }`}
      >
        {/* Card Header Content */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Row 1: Badges & Telemetry Readouts */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Severity Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${severityStyle.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${severityStyle.glow} animate-pulse`} />
                {alert.severity}
              </span>

              {/* District Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-200">
                <MapPin className="h-3.5 w-3.5 text-[#00F5C3]" />
                {alert.district}
              </span>

              {/* Sensor Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2.5 py-1 font-mono text-xs text-[#00E5FF]">
                <Satellite className="h-3 w-3 text-[#00E5FF]" />
                {alert.sensor}
              </span>

              {/* Area Badge with Crimson Outline */}
              <span className="inline-flex items-center gap-1 rounded-lg border border-[#FF4D6D]/50 bg-[#FF4D6D]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[#FF4D6D]">
                <Maximize2 className="h-3 w-3 text-[#FF4D6D]" />
                <span>{alert.affectedArea} Ha</span>
              </span>

              {/* Status Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-[#081326] px-2.5 py-1 font-mono text-[11px] text-slate-300">
                <Radio className="h-3 w-3 text-[#00F5C3] animate-pulse" />
                <span>{alert.status}</span>
              </span>
            </div>

            {/* Right: Neon Teal Confidence Badge & IST Timestamp */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              {/* Confidence Badge using Neon Teal */}
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#00F5C3]/40 bg-[#00F5C3]/10 px-3 py-1 font-mono text-xs font-bold text-[#00F5C3] shadow-[0_0_12px_rgba(0,245,195,0.25)]">
                <Sparkles className="h-3.5 w-3.5 text-[#00F5C3]" />
                <span>{alert.confidence}% AI CONF</span>
              </div>

              {/* Formatted IST Timestamp */}
              <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>{formatIST(alert.timestamp)}</span>
              </span>

              {/* Accordion Chevron */}
              <button
                type="button"
                className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                aria-label={isExpanded ? "Collapse Alert Dossier" : "Expand Alert Dossier"}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-[#00F5C3]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-[#00F5C3]" />
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Title */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#00F5C3]/70">
                [{alert.id}]
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white transition-colors group-hover:text-[#00F5C3]">
                {alert.title}
              </h3>
            </div>
          </div>

          {/* Row 3: Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {alert.description}
          </p>
        </div>

        {/* STEP 3: EXPANDABLE DOSSIER ACCORDION */}
        <AnimatePresence>
          {isExpanded && <AlertExpanded alert={alert} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
