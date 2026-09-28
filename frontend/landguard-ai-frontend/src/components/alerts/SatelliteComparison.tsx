import { useState } from "react";
import { motion } from "framer-motion";
import { Satellite, ShieldAlert, Crosshair, AlertTriangle } from "lucide-react";
import type { AlertData } from "./types";

export interface SatelliteComparisonProps {
  alert: AlertData;
}

const DISTRICT_FALLBACKS: Record<string, { before: string; after: string }> = {
  "South 24 Parganas": { before: "/mock/s24_before.jpg", after: "/mock/s24_after.jpg" },
  "Paschim Bardhaman": { before: "/mock/bardhaman_before.jpg", after: "/mock/bardhaman_after.jpg" },
  "Howrah": { before: "/mock/howrah_before.jpg", after: "/mock/howrah_after.jpg" },
  "Purba Medinipur": { before: "/mock/kolkata_before.jpg", after: "/mock/kolkata_after.jpg" },
  "Darjeeling": { before: "/mock/darjeeling_before.jpg", after: "/mock/darjeeling_after.jpg" },
};

export default function SatelliteComparison({ alert }: SatelliteComparisonProps) {
  const fallback = DISTRICT_FALLBACKS[alert.district] || {
    before: "/mock/howrah_before.jpg",
    after: "/mock/howrah_after.jpg",
  };

  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  const beforeSrc = beforeError ? fallback.before : (alert.beforeImage || fallback.before);
  const afterSrc = afterError ? fallback.after : (alert.afterImage || fallback.after);

  return (
    <div className="space-y-3">
      {/* Header telemetry row */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2 text-[#00F5C3]">
          <Satellite className="h-4 w-4" />
          <span className="font-bold uppercase tracking-wider">
            Satellite Before / After Multi-Temporal Inspection
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="rounded border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2 py-0.5 text-[#00E5FF]">
            {alert.sensor}
          </span>
          <span>ORBITAL SYNC: 10m RESOLUTION</span>
        </div>
      </div>

      {/* Dual 16:9 Image Comparison Grid (Desktop: 2 columns, Mobile: 1 column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT IMAGE: Historical Baseline Jun 2026 */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#081326] shadow-xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
            <img
              src={beforeSrc}
              alt={`${alert.title} - Historical Baseline`}
              onError={() => setBeforeError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Radar Grid Texture Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

            {/* Top-Left Badge: Historical Baseline Jun 2026 */}
            <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-slate-700/80 bg-[#050C18]/90 px-3 py-1 font-mono text-xs font-semibold text-slate-200 backdrop-blur-md shadow-md">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>Historical Baseline &bull; Jun 2026</span>
            </div>

            {/* Bottom Telemetry Chip */}
            <div className="absolute bottom-3 left-3 rounded border border-slate-800 bg-[#050C18]/80 px-2 py-0.5 font-mono text-[10px] text-slate-400 backdrop-blur-md">
              PASS: S2A_MSIL2A_BASELINE
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-800/90 px-3 py-2 font-mono text-[10px] text-slate-400">
            <span>CANOPY INTEGRITY: 99.1%</span>
            <span className="text-emerald-400 font-semibold">T-0 REFERENCE</span>
          </div>
        </div>

        {/* RIGHT IMAGE: Latest Satellite Scan Sep 2026 with Overlays */}
        <div className="group relative overflow-hidden rounded-xl border border-[#FF4D6D]/40 bg-[#081326] shadow-[0_0_25px_rgba(255,77,109,0.18)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
            <img
              src={afterSrc}
              alt={`${alert.title} - Latest Satellite Scan`}
              onError={() => setAfterError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* SVG Overlays: Red AI Bounding Polygon + Dashed Animated Rectangle */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 500 280"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="crimson-ai-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Red AI Bounding Polygon around illegal structure */}
              <polygon
                points="110,65 390,45 425,215 145,235"
                fill="rgba(255, 77, 109, 0.28)"
                stroke="#FF4D6D"
                strokeWidth="2.2"
                filter="url(#crimson-ai-glow)"
              />

              {/* Animated Dashed Bounding Rectangle (Marching Ants) */}
              <motion.rect
                animate={{
                  strokeDashoffset: [0, -24],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "linear",
                }}
                x="95"
                y="35"
                width="345"
                height="215"
                fill="none"
                stroke="#FF4D6D"
                strokeWidth="1.5"
                strokeDasharray="8 6"
              />

              {/* Polygon Anchor Vertices */}
              <circle cx="110" cy="65" r="4" fill="#00F5C3" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="390" cy="45" r="4" fill="#00F5C3" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="425" cy="215" r="4" fill="#00F5C3" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="145" cy="235" r="4" fill="#00F5C3" stroke="#FFFFFF" strokeWidth="1" />
            </svg>

            {/* Top-Left Badge: AI DETECTED with Pulse Beacon */}
            <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-[#FF4D6D] bg-[#050C18]/90 px-3 py-1 font-mono text-xs font-bold text-[#FF4D6D] backdrop-blur-md shadow-[0_0_15px_rgba(255,77,109,0.4)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4D6D]" />
              </span>
              <span>AI DETECTED &bull; Latest Scan Sep 2026</span>
            </div>

            {/* Top-Right Label: YOLOv8 Structure Detection */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-[#00F5C3]/50 bg-[#050C18]/90 px-2.5 py-1 font-mono text-[10px] text-[#00F5C3] backdrop-blur-md shadow-[0_0_12px_rgba(0,245,195,0.25)]">
              <Crosshair className="h-3 w-3 text-[#00F5C3]" />
              <span>YOLOv8 Structure Detection {alert.confidence}%</span>
            </div>

            {/* Bottom-Right Badge: PERIMETER BREACH */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-[#FF4D6D]/60 bg-[#FF4D6D]/20 px-2.5 py-1 font-mono text-[10px] font-bold text-[#FF4D6D] backdrop-blur-md shadow-[0_0_15px_rgba(255,77,109,0.3)]">
              <AlertTriangle className="h-3.5 w-3.5 text-[#FF4D6D]" />
              <span>PERIMETER BREACH</span>
            </div>

            {/* Bottom-Left Telemetry Coordinates */}
            <div className="absolute bottom-3 left-3 rounded border border-slate-800 bg-[#050C18]/80 px-2 py-0.5 font-mono text-[10px] text-[#00E5FF] backdrop-blur-md">
              OFFSET: 42m CADASTRE INTRUSION
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#FF4D6D]/30 px-3 py-2 font-mono text-[10px]">
            <span className="text-[#FF4D6D] font-bold flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              VEGETATION LOSS: -{alert.vegetationLoss}%
            </span>
            <span className="text-[#00F5C3] font-bold">
              SURFACE ALTERATION: {alert.affectedArea} Ha
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
