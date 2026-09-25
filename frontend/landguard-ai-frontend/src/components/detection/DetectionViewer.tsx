import {
  AlertTriangle,
  Radio,
  Scan,
  Layers,
  Satellite,
  Crosshair,
  ShieldAlert,
} from "lucide-react";

export interface DetectionViewerProps {
  imageUrl: string;
  isScanning: boolean;
  completed: boolean;
}

interface DetectionBox {
  id: number;
  top: string;
  left: string;
  width: string;
  height: string;
  confidence: string;
  label: string;
}

const DETECTION_REGIONS: DetectionBox[] = [
  {
    id: 1,
    top: "16%",
    left: "18%",
    width: "22%",
    height: "19%",
    confidence: "97%",
    label: "ENCROACHMENT DETECTED",
  },
  {
    id: 2,
    top: "32%",
    left: "58%",
    width: "24%",
    height: "22%",
    confidence: "94%",
    label: "ENCROACHMENT DETECTED",
  },
  {
    id: 3,
    top: "58%",
    left: "14%",
    width: "19%",
    height: "20%",
    confidence: "91%",
    label: "ENCROACHMENT DETECTED",
  },
  {
    id: 4,
    top: "62%",
    left: "48%",
    width: "26%",
    height: "21%",
    confidence: "89%",
    label: "ENCROACHMENT DETECTED",
  },
  {
    id: 5,
    top: "14%",
    left: "52%",
    width: "18%",
    height: "15%",
    confidence: "93%",
    label: "ENCROACHMENT DETECTED",
  },
];

export default function DetectionViewer({
  imageUrl,
  isScanning,
  completed,
}: DetectionViewerProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-emerald-500/20 bg-black shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.06)] aspect-[16/10] min-h-[380px] select-none">
      <style>{`
        @keyframes scanSweep {
          0% {
            top: -5%;
            opacity: 0.1;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 105%;
            opacity: 0.1;
          }
        }
        @keyframes radarPulse {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>

      {/* 1. Base Satellite Imagery */}
      <div className="absolute inset-0 h-full w-full bg-slate-950">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Satellite Feed AOI"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950/20 to-black">
            <div className="text-center">
              <Satellite className="mx-auto h-12 w-12 text-emerald-600/40 animate-pulse" />
              <p className="mt-2 text-xs font-mono text-emerald-500/60 uppercase tracking-widest">
                Optical Feed Stream Standby
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Emerald Tactical Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Crosshair coordinate markers */}
      <div className="pointer-events-none absolute inset-0 flex justify-between p-6 opacity-30">
        <Crosshair className="h-5 w-5 text-emerald-400" />
        <Crosshair className="h-5 w-5 text-emerald-400" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-between px-6 opacity-30">
        <Crosshair className="h-5 w-5 text-emerald-400" />
        <Crosshair className="h-5 w-5 text-emerald-400" />
      </div>

      {/* 3. Subtle Vignette Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />

      {/* 4. Scanning State Layer */}
      {isScanning && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between">
          {/* Animated Green Scan Line + Light Beam moving top to bottom */}
          <div
            className="absolute left-0 right-0 h-1 z-30 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981,0_0_35px_#34d399]"
            style={{
              animation: "scanSweep 2.2s ease-in-out infinite",
            }}
          >
            {/* Trailing luminous scanner wash */}
            <div className="absolute bottom-0 left-0 right-0 h-28 -translate-y-full bg-gradient-to-t from-emerald-500/25 via-emerald-500/05 to-transparent" />
          </div>

          {/* Central Pulsing Radar Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div
                className="h-56 w-56 rounded-full border-2 border-emerald-400/40"
                style={{ animation: "radarPulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite" }}
              />
              <div
                className="absolute h-40 w-40 rounded-full border border-emerald-400/30"
                style={{
                  animation: "radarPulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.5s",
                }}
              />
              <div className="absolute h-24 w-24 rounded-full border border-emerald-400/50 bg-emerald-950/20 backdrop-blur-sm" />
              <div className="absolute h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            </div>
          </div>

          {/* Central Badge: YOLOv8 ANALYZING SATELLITE DATA... */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center px-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-400/60 bg-slate-950/90 px-5 py-2.5 shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-md">
              <Scan className="h-4 w-4 animate-spin text-emerald-400" />
              <span className="font-mono text-xs font-bold tracking-widest text-emerald-300 uppercase">
                YOLOv8 ANALYZING SATELLITE DATA...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar HUD: Category & Live Inference Chip */}
      <div className="relative z-30 flex items-center justify-between p-4 md:p-5">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-black/60 px-3 py-1.5 backdrop-blur-md">
          <Satellite className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            LANDGUARD SATELLITE OPTICAL AOI
          </span>
        </div>

        {/* Top-right Chip: LIVE INFERENCE */}
        {isScanning && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-950/80 px-3 py-1 shadow-[0_0_15px_rgba(16,185,129,0.4)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-300 uppercase">
              LIVE INFERENCE
            </span>
          </div>
        )}

        {completed && (
          <div className="flex items-center gap-1.5 rounded-full border border-red-500/50 bg-red-950/80 px-3 py-1 shadow-[0_0_15px_rgba(239,68,68,0.4)] backdrop-blur-md">
            <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-red-300 uppercase">
              5 TARGETS IDENTIFIED
            </span>
          </div>
        )}
      </div>

      {/* 5. Completed State: 5 Overlay Detection Regions with Military Targeting UI */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-700 ease-out ${completed ? "opacity-100" : "opacity-0"
          }`}
      >
        {DETECTION_REGIONS.map((region) => (
          <div
            key={region.id}
            className="absolute rounded-sm border border-red-500/90 bg-red-500/15 shadow-[0_0_18px_rgba(239,68,68,0.45),inset_0_0_14px_rgba(239,68,68,0.2)] backdrop-blur-[0.5px] transition-transform duration-500"
            style={{
              top: region.top,
              left: region.left,
              width: region.width,
              height: region.height,
            }}
          >
            {/* Military AI Target Corners */}
            {/* Top-Left */}
            <div className="absolute -top-1.5 -left-1.5 h-3.5 w-3.5 border-t-2 border-l-2 border-red-400 shadow-[0_0_8px_#ef4444]" />
            {/* Top-Right */}
            <div className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 border-t-2 border-r-2 border-red-400 shadow-[0_0_8px_#ef4444]" />
            {/* Bottom-Left */}
            <div className="absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 border-b-2 border-l-2 border-red-400 shadow-[0_0_8px_#ef4444]" />
            {/* Bottom-Right */}
            <div className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 border-b-2 border-r-2 border-red-400 shadow-[0_0_8px_#ef4444]" />

            {/* Target Crosshair in Box Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="h-2 w-2 border border-red-400" />
            </div>

            {/* Badge & Confidence Tag */}
            <div className="absolute -top-6 left-0 flex items-center gap-1 whitespace-nowrap">
              <span className="flex items-center gap-1 rounded bg-red-600/95 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-sm shadow-black">
                <AlertTriangle className="h-2.5 w-2.5" />
                {region.label}
              </span>
              <span className="rounded border border-red-500/60 bg-black/90 px-1 py-0.5 font-mono text-[9px] font-bold text-red-400 shadow-sm shadow-black">
                {region.confidence}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Bottom Telemetry Bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-emerald-500/20 bg-slate-950/85 px-4 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            {/* Sentinel-2 MSI */}
            <div className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">FEED:</span>
              <span className="font-semibold text-emerald-300">Sentinel-2 MSI</span>
            </div>

            {/* Cartosat-3 */}
            <div className="flex items-center gap-1.5">
              <Satellite className="h-3.5 w-3.5 text-teal-400" />
              <span className="text-slate-400">SURFACE:</span>
              <span className="font-semibold text-teal-300">Cartosat-3</span>
            </div>

            {/* NDVI Layer Active */}
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-400">SPECTRAL:</span>
              <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.2 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                NDVI Layer Active
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-emerald-500/60">
            <span>RES: 0.5m/px</span>
            <span>•</span>
            <span>BAND: RGB-NIR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
