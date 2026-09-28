import { motion } from "framer-motion";
import { SkeletonShimmer } from "./KPICardSkeleton";

export interface AlertSkeletonProps {
  className?: string;
  count?: number;
  showTimeline?: boolean;
}

/**
 * Single Alert Item Skeleton with Timeline Indicator, Badge Placeholders, and Confidence Bar Shimmer
 */
export function AlertSkeletonItem({
  isLast = false,
  showTimeline = true,
}: {
  isLast?: boolean;
  showTimeline?: boolean;
}) {
  return (
    <div className="relative flex items-start gap-4">
      {/* Timeline Indicator Column */}
      {showTimeline && (
        <div className="relative flex flex-col items-center self-stretch">
          {/* Pulsing Radar Timeline Node */}
          <div className="relative z-10 flex h-7 w-7 items-center justify-center">
            {/* Outer expanding ring */}
            <motion.div
              animate={{
                scale: [1, 1.8, 2.2],
                opacity: [0.6, 0.2, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full bg-[#00F5C3]/30"
            />
            {/* Secondary cyan ring */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1.6],
                opacity: [0.8, 0.4, 0],
              }}
              transition={{
                duration: 2.4,
                delay: 0.4,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-1 rounded-full bg-[#00E5FF]/40"
            />
            {/* Core glowing bead */}
            <div className="relative h-2.5 w-2.5 rounded-full bg-[#00F5C3] shadow-[0_0_10px_#00F5C3]" />
          </div>

          {/* Continuous vertical timeline connector rail */}
          {!isLast && (
            <div className="relative w-0.5 flex-1 overflow-hidden bg-slate-800/80 my-1">
              <motion.div
                animate={{
                  y: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#00F5C3]/70 to-transparent"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Glassmorphic Alert Card */}
      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{
          borderColor: [
            "rgba(0, 245, 195, 0.15)",
            "rgba(0, 229, 255, 0.35)",
            "rgba(0, 245, 195, 0.15)",
          ],
          boxShadow: [
            "0 4px 20px -2px rgba(5, 12, 24, 0.8), 0 0 12px rgba(0, 245, 195, 0.05)",
            "0 4px 24px -2px rgba(5, 12, 24, 0.8), 0 0 20px rgba(0, 229, 255, 0.15)",
            "0 4px 20px -2px rgba(5, 12, 24, 0.8), 0 0 12px rgba(0, 245, 195, 0.05)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative mb-4 flex-1 overflow-hidden rounded-xl border bg-[#050C18]/90 p-4 sm:p-5 backdrop-blur-xl"
      >
        <SkeletonShimmer />

        {/* Tactical Crosshair Markers */}
        <div className="pointer-events-none absolute right-2 top-2 font-mono text-[8px] text-[#00F5C3]/40">
          [ALERT_PENDING]
        </div>

        {/* Header Row: Badge Placeholders & Timestamp */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {/* Severity Badge Placeholder */}
          <div className="relative h-6 w-20 overflow-hidden rounded-full border border-red-500/30 bg-red-500/10">
            <SkeletonShimmer />
          </div>

          {/* Cadastre / Layer Badge Placeholder */}
          <div className="relative h-6 w-24 overflow-hidden rounded-full border border-[#00F5C3]/20 bg-[#00F5C3]/10">
            <SkeletonShimmer />
          </div>

          {/* Sensor Badge Placeholder (e.g. Sentinel-2) */}
          <div className="relative hidden sm:block h-6 w-28 overflow-hidden rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5">
            <SkeletonShimmer />
          </div>

          {/* Timestamp Placeholder (right-aligned) */}
          <div className="relative ml-auto h-4 w-20 overflow-hidden rounded bg-slate-800/70">
            <SkeletonShimmer />
          </div>
        </div>

        {/* Alert Title & Location Placeholders */}
        <div className="mb-3 space-y-2">
          {/* Main Title bar */}
          <div className="relative h-5 w-4/5 max-w-md overflow-hidden rounded bg-slate-800/90">
            <SkeletonShimmer />
          </div>

          {/* Geospatial Coordinate / Plot Description */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00E5FF]/50" />
            <div className="relative h-3.5 w-3/5 max-w-xs overflow-hidden rounded bg-slate-800/60">
              <SkeletonShimmer />
            </div>
          </div>
        </div>

        {/* Confidence Bar Shimmer Section */}
        <div className="my-4 rounded-lg border border-slate-800/80 bg-[#081326]/80 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-wider text-[#00F5C3]/80 uppercase">
                AI Confidence Rating
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-[#00F5C3] animate-pulse" />
            </div>
            <div className="relative h-4 w-12 overflow-hidden rounded bg-[#00F5C3]/10">
              <SkeletonShimmer />
            </div>
          </div>

          {/* Progress Bar Track with Neon Shimmer */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800/90 shadow-inner">
            {/* Filled confidence bar skeleton with cyan/teal glow */}
            <div className="relative h-full w-[78%] overflow-hidden rounded-full bg-gradient-to-r from-[#00F5C3]/40 via-[#00E5FF] to-[#00F5C3] shadow-[0_0_12px_#00F5C3]">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
          </div>

          {/* Segment marks for intelligence readout */}
          <div className="mt-1 flex justify-between font-mono text-[8px] text-slate-500">
            <span>0% BASELINE</span>
            <span>THRESHOLD 75%</span>
            <span>100% CERTAINTY</span>
          </div>
        </div>

        {/* Footer Actions / Inspector Buttons Placeholder */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="relative h-4 w-40 overflow-hidden rounded bg-slate-800/50">
            <SkeletonShimmer />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-24 overflow-hidden rounded-lg border border-slate-700/60 bg-slate-800/50">
              <SkeletonShimmer />
            </div>
            <div className="relative h-8 w-28 overflow-hidden rounded-lg border border-[#00F5C3]/30 bg-[#00F5C3]/15">
              <SkeletonShimmer />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * LandGuard AI - AlertSkeleton
 * Premium Government Satellite Intelligence Alert Skeleton Component
 */
export default function AlertSkeleton({
  className = "",
  count = 3,
  showTimeline = true,
}: AlertSkeletonProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <AlertSkeletonItem
          key={idx}
          isLast={idx === count - 1}
          showTimeline={showTimeline}
        />
      ))}
    </div>
  );
}
