import { motion } from "framer-motion";

export interface KPICardSkeletonProps {
  className?: string;
  count?: number;
  hasGraph?: boolean;
}

/**
 * Shimmer beam overlay for intelligence skeletons
 */
export function SkeletonShimmer() {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "200%" }}
      transition={{
        repeat: Infinity,
        duration: 1.8,
        ease: "easeInOut",
      }}
      className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[rgba(0,245,195,0.08)] to-transparent"
    />
  );
}

/**
 * LandGuard AI - KPICardSkeleton
 * Premium Government Satellite Intelligence KPI Card Skeleton
 * Theme: Dark Blue (#050C18), Neon Teal (#00F5C3), Cyan Glow (#00E5FF)
 */
export function KPICardSkeletonItem({
  className = "",
  hasGraph = true,
}: {
  className?: string;
  hasGraph?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{
        borderColor: [
          "rgba(0, 245, 195, 0.2)",
          "rgba(0, 229, 255, 0.45)",
          "rgba(0, 245, 195, 0.2)",
        ],
        boxShadow: [
          "0 4px 20px -2px rgba(5, 12, 24, 0.9), 0 0 15px rgba(0, 245, 195, 0.08)",
          "0 4px 25px -2px rgba(5, 12, 24, 0.9), 0 0 25px rgba(0, 229, 255, 0.22)",
          "0 4px 20px -2px rgba(5, 12, 24, 0.9), 0 0 15px rgba(0, 245, 195, 0.08)",
        ],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative overflow-hidden rounded-xl border bg-[#050C18]/90 p-5 backdrop-blur-xl ${className}`}
    >
      {/* Dynamic angled shimmer */}
      <SkeletonShimmer />

      {/* Tactical HUD Corner Reticles */}
      <div className="pointer-events-none absolute left-1.5 top-1.5 font-mono text-[9px] font-bold text-[#00F5C3]/40">
        +
      </div>
      <div className="pointer-events-none absolute right-1.5 top-1.5 font-mono text-[9px] font-bold text-[#00F5C3]/40">
        +
      </div>
      <div className="pointer-events-none absolute bottom-1.5 left-1.5 font-mono text-[9px] font-bold text-[#00F5C3]/40">
        +
      </div>
      <div className="pointer-events-none absolute bottom-1.5 right-1.5 font-mono text-[9px] font-bold text-[#00F5C3]/40">
        +
      </div>

      {/* Top Header: Title placeholder & Icon/Badge placeholder */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Status micro-pulsar */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-[#00F5C3] shadow-[0_0_8px_#00F5C3]"
          />
          {/* Title Placeholder */}
          <div className="relative h-3.5 w-28 overflow-hidden rounded bg-slate-800/80">
            <SkeletonShimmer />
          </div>
        </div>

        {/* Tactical Icon Box Placeholder */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#00F5C3]/20 bg-[#00F5C3]/5">
          <div className="h-4 w-4 rounded bg-[#00E5FF]/20" />
          <SkeletonShimmer />
        </div>
      </div>

      {/* Central Number Placeholder */}
      <div className="mb-3 flex items-baseline gap-3">
        <div className="relative h-9 w-36 overflow-hidden rounded-md bg-slate-800/90 shadow-[inset_0_0_12px_rgba(0,245,195,0.06)]">
          <SkeletonShimmer />
        </div>
        {/* Trend delta pill placeholder */}
        <div className="relative h-5 w-16 overflow-hidden rounded-full border border-[#00F5C3]/20 bg-[#00F5C3]/10">
          <SkeletonShimmer />
        </div>
      </div>

      {/* Subtitle / Telemetry coordinate metadata placeholder */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
        <div className="relative h-2.5 w-32 overflow-hidden rounded bg-slate-800/60">
          <SkeletonShimmer />
        </div>
        <div className="relative h-2.5 w-16 overflow-hidden rounded bg-slate-800/40 font-mono">
          <SkeletonShimmer />
        </div>
      </div>

      {/* Optional Mini Trend Sparkline / Graph Placeholder */}
      {hasGraph && (
        <div className="mt-3 flex items-end gap-1.5 h-6 w-full pt-1 opacity-70">
          {[40, 65, 30, 80, 55, 90, 70, 85].map((height, idx) => (
            <motion.div
              key={idx}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                height: [`${height * 0.7}%`, `${height}%`, `${height * 0.7}%`],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: idx * 0.15,
                ease: "easeInOut",
              }}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-[#00F5C3]/10 via-[#00E5FF]/30 to-[#00F5C3]/50"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function KPICardSkeleton({
  className = "",
  count = 1,
  hasGraph = true,
}: KPICardSkeletonProps) {
  if (count <= 1) {
    return <KPICardSkeletonItem className={className} hasGraph={hasGraph} />;
  }

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <KPICardSkeletonItem key={index} hasGraph={hasGraph} />
      ))}
    </div>
  );
}
