import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PageLoaderProps {
  fullscreen?: boolean;
  onComplete?: () => void;
  autoCycle?: boolean;
  cycleInterval?: number;
  className?: string;
}

const LOADING_STEPS = [
  {
    id: 1,
    title: "Initializing AI Geospatial Intelligence...",
    subtitle: "Loading neural change-detection models & weights",
    code: "SYS_INIT_RES_10M",
  },
  {
    id: 2,
    title: "Connecting Sentinel-2...",
    subtitle: "Establishing ESA Copernicus Open Access Hub uplink",
    code: "SENTINEL2_MSI_SYNC",
  },
  {
    id: 3,
    title: "Loading RFCTLARR Layers...",
    subtitle: "Fetching Land Acquisition & Rehabilitation spatial boundaries",
    code: "RFCTLARR_SHP_BUILD",
  },
  {
    id: 4,
    title: "Loading Cadastre Database...",
    subtitle: "Cross-referencing revenue parcel plots & survey numbers",
    code: "CADASTRE_DB_INDEX",
  },
];

/**
 * Detailed Government Satellite Intelligence SVG Icon
 * Designed exclusively with pure SVG for zero-dependency high visual fidelity
 */
function SatelliteIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="solar-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00F5C3" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="body-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Central Satellite Chassis */}
      <rect
        x="48"
        y="48"
        width="24"
        height="24"
        rx="3"
        fill="url(#body-gradient)"
        stroke="#00F5C3"
        strokeWidth="1.5"
      />
      {/* Sensor Core Lens */}
      <circle cx="60" cy="60" r="5" fill="#00F5C3" />
      <circle cx="60" cy="60" r="2.5" fill="#FFFFFF" />

      {/* Left Solar Panel Truss */}
      <line
        x1="48"
        y1="60"
        x2="28"
        y2="60"
        stroke="#00F5C3"
        strokeWidth="2"
      />
      {/* Left Solar Array */}
      <rect
        x="8"
        y="42"
        width="20"
        height="36"
        rx="2"
        fill="url(#solar-gradient)"
        stroke="#00E5FF"
        strokeWidth="1.2"
      />
      {/* Left Panel Grid Lines */}
      <line x1="8" y1="54" x2="28" y2="54" stroke="#050C18" strokeWidth="1" />
      <line x1="8" y1="66" x2="28" y2="66" stroke="#050C18" strokeWidth="1" />
      <line x1="18" y1="42" x2="18" y2="78" stroke="#050C18" strokeWidth="1" />

      {/* Right Solar Panel Truss */}
      <line
        x1="72"
        y1="60"
        x2="92"
        y2="60"
        stroke="#00F5C3"
        strokeWidth="2"
      />
      {/* Right Solar Array */}
      <rect
        x="92"
        y="42"
        width="20"
        height="36"
        rx="2"
        fill="url(#solar-gradient)"
        stroke="#00E5FF"
        strokeWidth="1.2"
      />
      {/* Right Panel Grid Lines */}
      <line x1="92" y1="54" x2="112" y2="54" stroke="#050C18" strokeWidth="1" />
      <line x1="92" y1="66" x2="112" y2="66" stroke="#050C18" strokeWidth="1" />
      <line x1="102" y1="42" x2="102" y2="78" stroke="#050C18" strokeWidth="1" />

      {/* Top Telemetry Antenna Mast */}
      <line x1="60" y1="48" x2="60" y2="34" stroke="#00E5FF" strokeWidth="1.8" />
      <circle cx="60" cy="32" r="2.5" fill="#00E5FF" />

      {/* Bottom Parabolic Downlink Dish */}
      <path
        d="M 52 74 Q 60 84 68 74"
        fill="none"
        stroke="#00F5C3"
        strokeWidth="2"
      />
      <line x1="60" y1="72" x2="60" y2="82" stroke="#00F5C3" strokeWidth="1.5" />
      <circle cx="60" cy="85" r="2" fill="#00F5C3" />
    </svg>
  );
}

/**
 * LandGuard AI - PageLoader
 * Premium Government Satellite Intelligence Page Loader
 */
export default function PageLoader({
  fullscreen = true,
  onComplete,
  autoCycle = true,
  cycleInterval = 1800,
  className = "",
}: PageLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!autoCycle) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        } else {
          if (onComplete) onComplete();
          return 0; // loop seamlessly
        }
      });
    }, cycleInterval);

    return () => clearInterval(timer);
  }, [autoCycle, cycleInterval, onComplete]);

  const activeStep = LOADING_STEPS[currentStepIndex];
  const progressPercent = Math.round(
    ((currentStepIndex + 1) / LOADING_STEPS.length) * 100
  );

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#050C18] text-white selection:bg-[#00F5C3] selection:text-black ${
        fullscreen ? "fixed inset-0 z-50 min-h-screen w-screen" : "w-full py-16"
      } ${className}`}
    >
      {/* Tactical Ambient Glow & Surveillance Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,245,195,0.08)_0%,rgba(0,229,255,0.03)_40%,transparent_75%)]" />
      
      {/* Micro Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, #00F5C3 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Government Classification Banner */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#00F5C3] shadow-[0_0_8px_#00F5C3]" />
          <span className="font-bold tracking-widest text-[#00F5C3]">
            LANDGUARD AI // SIH26017
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            MINISTRY OF LAND & REVENUE (GOV. SYSTEM)
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="rounded border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2 py-0.5 text-[#00E5FF]">
            SECURE ORBITAL LINK: ACTIVE
          </span>
          <span className="text-slate-500">CLASSIFIED DISCLOSURE</span>
        </div>
      </div>

      {/* Center Stage: Rotating Satellite + Orbital Rings + Status */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-lg w-full">
        {/* Orbital Resonance Visualizer */}
        <div className="relative mb-8 flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center">
          {/* Outer Orbital Ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#00F5C3]/30"
          >
            {/* Orbital node 1 */}
            <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#00F5C3] shadow-[0_0_10px_#00F5C3]" />
          </motion.div>

          {/* Middle Orbital Ring 2 (Counter-Rotating) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-5 rounded-full border border-[#00E5FF]/25 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
          >
            {/* Orbital node 2 */}
            <div className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
          </motion.div>

          {/* Inner Pulsing Radar Glow */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.35, 0.7, 0.35],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(0,245,195,0.25)_0%,transparent_70%)]"
          />

          {/* Central Rotating Satellite Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative z-20 flex h-28 w-28 items-center justify-center drop-shadow-[0_0_25px_rgba(0,245,195,0.7)]"
          >
            <SatelliteIcon className="h-full w-full" />
          </motion.div>
        </div>

        {/* Dynamic Stepped Text Sequence */}
        <div className="w-full text-center">
          <div className="min-h-[72px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {/* Main Text Item */}
                <h3 className="font-mono text-lg sm:text-xl font-bold tracking-wider text-[#00F5C3] drop-shadow-[0_0_12px_rgba(0,245,195,0.6)]">
                  {activeStep.title}
                </h3>
                {/* Secondary Tactical Subtitle */}
                <p className="mt-1 font-mono text-xs text-slate-400">
                  {activeStep.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar & Telemetry Details */}
          <div className="mt-6 w-full">
            {/* Telemetry info row */}
            <div className="mb-2 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">
                SYSTEM TELEMETRY:{" "}
                <span className="text-[#00E5FF] font-semibold">
                  {activeStep.code}
                </span>
              </span>
              <span className="font-bold text-[#00F5C3]">
                {progressPercent}%
              </span>
            </div>

            {/* Glowing Progress Track */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800">
              <motion.div
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00F5C3] shadow-[0_0_12px_#00F5C3]"
              >
                {/* Shimmer sweep inside progress bar */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </motion.div>
            </div>
          </div>

          {/* Multi-step status badges */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LOADING_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono text-[9px] transition-all duration-300 ${
                    isCurrent
                      ? "border-[#00F5C3] bg-[#00F5C3]/15 text-[#00F5C3] shadow-[0_0_10px_rgba(0,245,195,0.2)]"
                      : isDone
                      ? "border-emerald-700/60 bg-emerald-950/30 text-emerald-400"
                      : "border-slate-800/80 bg-[#050C18]/60 text-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>STEP 0{step.id}</span>
                    <span>{isDone ? "✓" : isCurrent ? "●" : "○"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Coordinates & System Version HUD */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-slate-500">
        <div>ORBIT: 786 KM // POLAR SUN-SYNCHRONOUS</div>
        <div className="text-right">
          RFCTLARR CADASTRE SUITE <span className="text-[#00F5C3]">v2.4-PRO</span>
        </div>
      </div>
    </div>
  );
}
