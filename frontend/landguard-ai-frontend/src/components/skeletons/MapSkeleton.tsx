import { motion } from "framer-motion";
import { SkeletonShimmer } from "./KPICardSkeleton";

export interface MapSkeletonProps {
  className?: string;
  height?: string;
  title?: string;
  subtitle?: string;
}

/**
 * LandGuard AI - MapSkeleton
 * Large GIS Container with Tactical Grid Overlay, Animated Scanning Line, and Loading Telemetry HUD
 */
export default function MapSkeleton({
  className = "",
  height = "h-[540px]",
  title = "Loading Sentinel-2 Tiles...",
  subtitle = "SYNCHRONIZING SATELLITE TILES & CADASTRE PARCELS",
}: MapSkeletonProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-[#00F5C3]/25 bg-[#050C18] shadow-[0_8px_32px_rgba(5,12,24,0.95)] ${height} ${className}`}
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,195,0.06),transparent_70%)]" />

      {/* High-Precision GIS Satellite Grid Overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="gis-fine-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="0.5"
              strokeOpacity="0.25"
            />
            <circle cx="0" cy="0" r="1" fill="#00F5C3" fillOpacity="0.6" />
          </pattern>
          <pattern
            id="gis-macro-grid"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="160"
              height="160"
              fill="url(#gis-fine-grid)"
            />
            <path
              d="M 160 0 L 0 0 0 160"
              fill="none"
              stroke="#00F5C3"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            <path
              d="M 80 75 L 80 85 M 75 80 L 85 80"
              stroke="#00E5FF"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gis-macro-grid)" />
      </svg>

      {/* Simulated Ghost Cadastre Parcels in Background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="140,120 280,100 320,240 180,260"
          fill="none"
          stroke="#00F5C3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <polygon
          points="340,90 490,130 450,280 330,250"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <polygon
          points="520,180 710,160 670,350 490,320"
          fill="none"
          stroke="#00F5C3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <polygon
          points="200,320 380,300 410,480 180,450"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Animated Scanning Line Moving Vertically */}
      <motion.div
        initial={{ y: "-10%" }}
        animate={{ y: ["0%", "480%", "0%"] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-0 right-0 z-20 h-28"
      >
        {/* Glow trailing gradient */}
        <div className="h-full w-full bg-gradient-to-b from-transparent via-[#00E5FF]/10 to-[#00F5C3]/35" />
        {/* Laser beam edge */}
        <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-[#00F5C3] to-transparent shadow-[0_0_15px_#00F5C3,0_0_30px_#00E5FF]">
          {/* Luminous scanning head nodes */}
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_#00F5C3]" />
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_#00E5FF]" />
        </div>
      </motion.div>

      {/* Top HUD: Layer & Sensor Switcher Skeleton */}
      <div className="absolute left-4 right-4 top-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Satellite Target info */}
        <div className="flex items-center gap-2 rounded-lg border border-[#00F5C3]/20 bg-[#050C18]/85 px-3 py-1.5 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-[#00F5C3] animate-ping" />
          <span className="font-mono text-xs font-semibold text-[#00F5C3] tracking-wider">
            SENTINEL-2B / MSI L2A
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            [10m Multispectral]
          </span>
        </div>

        {/* Right: Layer Selector Pills Skeleton */}
        <div className="hidden sm:flex items-center gap-2">
          {["RGB True Color", "NDVI Delta", "RFCTLARR Cadastre", "Elevation"].map(
            (layer, idx) => (
              <div
                key={layer}
                className={`relative overflow-hidden rounded-md border px-3 py-1 text-xs font-mono backdrop-blur-md ${
                  idx === 0
                    ? "border-[#00F5C3]/40 bg-[#00F5C3]/15 text-[#00F5C3]"
                    : "border-slate-800 bg-[#050C18]/80 text-slate-400"
                }`}
              >
                <SkeletonShimmer />
                {layer}
              </div>
            )
          )}
        </div>
      </div>

      {/* Center Reticle & Loading HUD Card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-30 pointer-events-none">
        {/* Concentric Rotating Radar Target Rings */}
        <div className="relative mb-6 flex h-36 w-36 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#00F5C3]/35"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dotted border-[#00E5FF]/40"
          />
          <div className="absolute inset-10 rounded-full border border-[#00F5C3]/20 bg-[#050C18]/60 backdrop-blur-md" />

          {/* Central Target Crosshairs */}
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#00F5C3]/50 to-transparent" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F5C3]/50 to-transparent" />

          {/* Center Pulsing Satellite Core */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#00F5C3]/20 shadow-[0_0_15px_#00F5C3]"
          >
            <div className="h-3 w-3 rounded-full bg-[#00F5C3]" />
          </motion.div>
        </div>

        {/* Tactical Loading Label HUD Card */}
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{
            borderColor: [
              "rgba(0, 245, 195, 0.3)",
              "rgba(0, 229, 255, 0.6)",
              "rgba(0, 245, 195, 0.3)",
            ],
            boxShadow: [
              "0 8px 32px rgba(5, 12, 24, 0.9), 0 0 15px rgba(0, 245, 195, 0.15)",
              "0 8px 32px rgba(5, 12, 24, 0.9), 0 0 30px rgba(0, 229, 255, 0.3)",
              "0 8px 32px rgba(5, 12, 24, 0.9), 0 0 15px rgba(0, 245, 195, 0.15)",
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity }}
          className="relative max-w-md overflow-hidden rounded-xl border bg-[#050C18]/90 px-6 py-4 text-center backdrop-blur-xl"
        >
          <SkeletonShimmer />

          {/* Loading label as requested */}
          <div className="flex items-center justify-center gap-3 mb-1.5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="h-3.5 w-3.5 border-2 border-[#00F5C3] border-t-transparent rounded-full"
            />
            <h4 className="font-mono text-base font-bold tracking-wider text-[#00F5C3] drop-shadow-[0_0_8px_rgba(0,245,195,0.6)]">
              {title}
            </h4>
          </div>

          <p className="font-mono text-[10px] tracking-widest text-slate-400">
            {subtitle}
          </p>

          {/* Telemetry Stream Badges */}
          <div className="mt-3 flex items-center justify-center gap-2 border-t border-slate-800/80 pt-2.5 font-mono text-[9px] text-[#00E5FF]/80">
            <span className="rounded bg-[#00E5FF]/10 px-1.5 py-0.5">
              GRID: WGS84 / UTM 45N
            </span>
            <span className="rounded bg-[#00F5C3]/10 px-1.5 py-0.5">
              RES: 10m/px
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
              BUFFER: 16 TILES
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom HUD: Coordinates Readout & GIS Scale Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
        {/* Coordinates Pill */}
        <div className="rounded-lg border border-slate-800 bg-[#050C18]/85 px-3 py-2 font-mono text-[10px] text-slate-400 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[#00F5C3]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F5C3]" />
            <span>GEO-REF: 22°53'18.2&quot;N 88°21'44.9&quot;E</span>
          </div>
          <div className="mt-0.5 text-slate-500">
            ELEVATION: 14m AMSL • BEARING: 004° N
          </div>
        </div>

        {/* GIS Scale Bar Skeleton */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
            <span>500 m</span>
          </div>
          <div className="flex h-1.5 w-24 overflow-hidden rounded border border-slate-700 bg-slate-800">
            <div className="w-1/2 bg-[#00F5C3]/70" />
            <div className="w-1/2 bg-slate-700" />
          </div>
        </div>
      </div>

      {/* North Arrow / Compass Rose HUD (top-right absolute) */}
      <div className="absolute right-4 top-16 z-30 hidden sm:flex h-12 w-12 items-center justify-center rounded-full border border-[#00F5C3]/20 bg-[#050C18]/80 backdrop-blur-md pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="h-0 w-0 border-x-4 border-b-8 border-x-transparent border-b-[#00F5C3]" />
          <span className="font-mono text-[8px] font-bold text-[#00F5C3]">N</span>
        </motion.div>
      </div>
    </div>
  );
}
