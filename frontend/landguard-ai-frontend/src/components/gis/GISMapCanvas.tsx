import { useState, useRef } from "react";
import {
  AimOutlined,
  RadarChartOutlined,
  EnvironmentOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
  CompressOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type MarkerSeverity = "critical" | "high" | "moderate";

interface MapMarker {
  id: string;
  x: number; // % of SVG width
  y: number; // % of SVG height
  severity: MarkerSeverity;
  label: string;
  district: string;
  description: string;
  confidence: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_COLOR: Record<
  MarkerSeverity,
  { ring: string; dot: string; text: string; bg: string; border: string }
> = {
  critical: {
    ring: "rgba(239,68,68,0.45)",
    dot: "#EF4444",
    text: "text-red-400",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.45)",
  },
  high: {
    ring: "rgba(245,158,11,0.45)",
    dot: "#F59E0B",
    text: "text-amber-400",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.45)",
  },
  moderate: {
    ring: "rgba(16,185,129,0.45)",
    dot: "#10B981",
    text: "text-emerald-400",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.45)",
  },
};

const MARKERS: MapMarker[] = [
  {
    id: "mk1",
    x: 62,
    y: 72,
    severity: "critical",
    label: "ALT-001",
    district: "South 24 Parganas",
    description: "Illegal mangrove clearance — 14.7 ha detected via Sentinel-2 SWIR band",
    confidence: 97,
  },
  {
    id: "mk2",
    x: 55,
    y: 61,
    severity: "critical",
    label: "ALT-002",
    district: "North 24 Parganas",
    description: "Unauthorised commercial construction — 3 plots merged",
    confidence: 92,
  },
  {
    id: "mk3",
    x: 48,
    y: 50,
    severity: "high",
    label: "ALT-003",
    district: "Kolkata",
    description: "Wetland encroachment near East Kolkata — NDWI anomaly",
    confidence: 88,
  },
  {
    id: "mk4",
    x: 38,
    y: 32,
    severity: "high",
    label: "ALT-004",
    district: "Bardhaman",
    description: "Agricultural plot boundary violation — cadastral mismatch",
    confidence: 83,
  },
  {
    id: "mk5",
    x: 29,
    y: 24,
    severity: "moderate",
    label: "ALT-005",
    district: "Birbhum",
    description: "Potential forest fringe encroachment — partial canopy loss",
    confidence: 75,
  },
  {
    id: "mk6",
    x: 70,
    y: 44,
    severity: "high",
    label: "ALT-006",
    district: "Murshidabad",
    description: "Riparian buffer zone violation along Bhagirathi river",
    confidence: 85,
  },
  {
    id: "mk7",
    x: 22,
    y: 14,
    severity: "moderate",
    label: "ALT-007",
    district: "Darjeeling",
    description: "Hillside terracing exceeds permitted limits — Cartosat-3 PAN",
    confidence: 71,
  },
  {
    id: "mk8",
    x: 44,
    y: 80,
    severity: "critical",
    label: "ALT-008",
    district: "Sundarbans",
    description: "Tidal inlet blockade for aquaculture — tiger reserve buffer",
    confidence: 95,
  },
];

// ─── West Bengal Approximate SVG Paths ────────────────────────────────────────

const WB_BOUNDARY =
  "M 185 20 L 210 28 L 230 45 L 248 55 L 258 72 L 265 90 L 270 110 L 268 132 L 260 152 L 252 170 L 245 192 L 250 212 L 248 230 L 240 252 L 228 268 L 218 285 L 205 298 L 198 312 L 192 328 L 186 342 L 174 354 L 162 364 L 150 372 L 142 382 L 138 392 L 132 400 L 122 406 L 110 412 L 98 416 L 88 418 L 78 416 L 70 410 L 65 400 L 62 388 L 60 374 L 62 358 L 68 344 L 72 332 L 75 318 L 72 302 L 68 290 L 65 276 L 62 258 L 60 242 L 58 224 L 55 205 L 54 185 L 56 165 L 60 148 L 64 132 L 70 116 L 80 100 L 90 86 L 102 75 L 116 64 L 132 56 L 148 50 L 162 44 L 172 34 Z";

const HOOGHLY_RIVER =
  "M 148 50 C 145 65 142 80 140 96 C 138 112 136 128 135 144 C 133 160 132 176 130 192 C 128 208 126 225 125 241 C 124 255 125 268 126 280 C 127 294 128 308 126 322 C 124 336 120 350 118 362 C 116 375 115 386 114 398";

const METRO_CORRIDOR =
  "M 132 200 L 128 222 L 126 244 L 125 264 L 126 282 L 128 298";

const SILIGURI_CORRIDOR =
  "M 185 20 L 180 38 L 174 56 L 168 74 L 165 90";

const SUNDARBANS_COAST =
  "M 78 416 C 88 420 100 424 112 426 C 126 428 140 428 154 424 C 168 420 180 414 192 408 C 200 404 208 398 214 392";

const DISTRICT_LINES = [
  "M 100 110 L 180 95",
  "M 90 160 L 200 148",
  "M 80 220 L 220 208",
  "M 75 275 L 210 265",
  "M 70 330 L 200 322",
  "M 135 90 L 145 200",
  "M 175 100 L 185 240",
  "M 115 130 L 125 380",
  "M 155 115 L 165 320",
];

// ─── Scoped Keyframes ────────────────────────────────────────────────────────

const CANVAS_STYLES = `
  @keyframes radarSweep {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes markerPingC {
    0%   { transform: scale(0.9); opacity: 0.85; }
    70%  { transform: scale(2.4); opacity: 0; }
    100% { transform: scale(2.6); opacity: 0; }
  }
  @keyframes markerPingH {
    0%   { transform: scale(0.9); opacity: 0.75; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes markerPingM {
    0%   { transform: scale(0.9); opacity: 0.65; }
    70%  { transform: scale(2.0); opacity: 0; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes gisCanvasFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes reticleSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes tooltipPop {
    from { opacity: 0; transform: scale(0.92) translateY(4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes scanlineMove {
    from { background-position: 0 0; }
    to   { background-position: 0 24px; }
  }
  @keyframes livePulse {
    0%   { transform: scale(0.9); opacity: 0.85; }
    70%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.4); opacity: 0; }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function HUDChip({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider"
      style={{ background: `${color}18`, border: `1px solid ${color}55`, color }}
    >
      {label}
    </div>
  );
}

function BandChip({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono"
      style={{ background: `${color}12`, border: `1px solid ${color}40`, color }}
    >
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </div>
  );
}

function LegendRow({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span className="text-[11px] text-slate-300 flex-1">{label}</span>
      <span className="text-[10px] font-mono font-bold" style={{ color }}>
        {count}
      </span>
    </div>
  );
}

function LayerRow({ color, label, dash }: { color: string; label: string; dash: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="20" height="8" className="flex-shrink-0">
        <line
          x1={0}
          y1={4}
          x2={20}
          y2={4}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dash ? "4 2" : "0"}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[11px] text-slate-400">{label}</span>
    </div>
  );
}

// ─── MapMarker SVG Component ──────────────────────────────────────────────────

interface PinProps {
  marker: MapMarker;
  isSelected: boolean;
  onClick: (id: string) => void;
  svgW: number;
  svgH: number;
}

function MarkerPin({ marker, isSelected, onClick, svgW, svgH }: PinProps) {
  const cx = (marker.x / 100) * svgW;
  const cy = (marker.y / 100) * svgH;
  const col = SEVERITY_COLOR[marker.severity];
  const pingAnim =
    marker.severity === "critical"
      ? "markerPingC"
      : marker.severity === "high"
      ? "markerPingH"
      : "markerPingM";
  const pingDur =
    marker.severity === "critical" ? "1.4s" : marker.severity === "high" ? "1.8s" : "2.4s";

  return (
    <g style={{ cursor: "pointer" }} onClick={() => onClick(marker.id)}>
      {/* Pulse ring */}
      <circle
        cx={cx}
        cy={cy}
        r={isSelected ? 14 : 9}
        fill="none"
        stroke={col.dot}
        strokeWidth={isSelected ? 1.5 : 1}
        opacity={isSelected ? 0.65 : 0.38}
        style={{
          animation: `${pingAnim} ${pingDur} cubic-bezier(0,0,0.2,1) infinite`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
      {/* Spinning dashed ring when selected */}
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r={20}
          fill="none"
          stroke={col.dot}
          strokeWidth={0.8}
          opacity={0.25}
          strokeDasharray="3 3"
          style={{
            animation: "reticleSpin 8s linear infinite",
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
      )}
      {/* Core dot */}
      <circle
        cx={cx}
        cy={cy}
        r={isSelected ? 6 : 4.5}
        fill={col.dot}
        opacity={0.92}
        style={{
          filter: `drop-shadow(0 0 ${isSelected ? 8 : 5}px ${col.dot})`,
          transition: "r 0.2s ease",
        }}
      />
      {/* Specular highlight */}
      <circle cx={cx - 1.2} cy={cy - 1.2} r={1.2} fill="white" opacity={0.5} />
      {/* Label */}
      <text
        x={cx + 8}
        y={cy - 7}
        fontSize={7}
        fill={col.dot}
        fontFamily="monospace"
        fontWeight="bold"
        opacity={isSelected ? 1 : 0.75}
      >
        {marker.label}
      </text>
    </g>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function MarkerTooltip({
  marker,
  onClose,
}: {
  marker: MapMarker;
  onClose: () => void;
}) {
  const col = SEVERITY_COLOR[marker.severity];
  // Adjust tooltip position to avoid clipping edges
  const leftPct = Math.min(Math.max(marker.x, 20), 78);
  const topOffset = marker.y < 25 ? 30 : -155;

  return (
    <div
      className="absolute z-40 w-60 rounded-xl p-3.5 text-xs pointer-events-auto"
      style={{
        left: `${leftPct}%`,
        top: `calc(${marker.y}% + ${topOffset}px)`,
        transform: "translateX(-50%)",
        background: "rgba(10,16,28,0.97)",
        border: `1px solid ${col.border}`,
        backdropFilter: "blur(16px)",
        boxShadow: `0 0 24px ${col.ring}, 0 8px 24px rgba(0,0,0,0.6)`,
        animation: "tooltipPop 0.18s ease-out both",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono font-bold text-[11px] tracking-wider" style={{ color: col.dot }}>
          {marker.label}
        </span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-[12px] leading-none"
        >
          ✕
        </button>
      </div>
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-2"
        style={{ background: col.bg, color: col.dot, border: `1px solid ${col.border}` }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: col.dot }} />
        {marker.severity}
      </div>
      <div className="flex items-center gap-1.5 text-slate-300 mb-1">
        <EnvironmentOutlined style={{ color: "#10B981", fontSize: 10 }} />
        <span className="font-semibold text-[11px]">{marker.district}</span>
      </div>
      <p className="text-slate-400 leading-relaxed mb-2 text-[10px]">{marker.description}</p>
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-500 text-[10px]">AI Confidence</span>
        <span className="font-mono font-bold text-[11px]" style={{ color: col.dot }}>
          {marker.confidence}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${marker.confidence}%`,
            background: `linear-gradient(90deg, ${col.dot}cc, ${col.dot})`,
            boxShadow: `0 0 6px ${col.dot}88`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GISMapCanvas() {
  const [selectedId, setSelectedId] = useState<string | null>("mk1");
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [radarActive, setRadarActive] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const SVG_W = 320;
  const SVG_H = 440;

  const selected = MARKERS.find((m) => m.id === selectedId) ?? null;

  const handleMarkerClick = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));

  const critCount = MARKERS.filter((m) => m.severity === "critical").length;
  const highCount = MARKERS.filter((m) => m.severity === "high").length;
  const modCount = MARKERS.filter((m) => m.severity === "moderate").length;

  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
        fullscreen ? "fixed inset-4 z-50" : "w-full min-h-[560px]"
      }`}
      style={{
        background: "rgba(17,24,39,0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(51,65,85,0.8)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.05), 0 24px 60px -12px rgba(0,0,0,0.7), 0 0 80px rgba(16,185,129,0.05)",
        animation: "gisCanvasFadeIn 0.5s ease-out both",
      }}
    >
      {/* Scoped Keyframes */}
      <style>{CANVAS_STYLES}</style>

      {/* Global grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />

      {/* Animated scanline */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 22px, rgba(16,185,129,0.025) 22px, rgba(16,185,129,0.025) 24px)",
          animation: "scanlineMove 4s linear infinite",
        }}
      />

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
        }}
      />

      {/* ── Header Bar ── */}
      <div
        className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b"
        style={{ borderColor: "rgba(51,65,85,0.7)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.35)",
            }}
          >
            <RadarChartOutlined style={{ color: "#10B981", fontSize: 16 }} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-none">
              Tactical GIS Workstation
            </h2>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-wider">
              WEST BENGAL • SENTINEL-2 + CARTOSAT-3 COMPOSITE
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <HUDChip label={`${critCount} CRITICAL`} color="#EF4444" />
          <HUDChip label={`${highCount} HIGH`} color="#F59E0B" />
          <HUDChip label={`${modCount} MOD`} color="#10B981" />
          <button
            type="button"
            onClick={() => setRadarActive((v) => !v)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border cursor-pointer transition-all ${
              radarActive
                ? "text-teal-300 border-teal-500/40 bg-teal-500/10 shadow-[0_0_10px_rgba(20,184,166,0.2)]"
                : "text-slate-500 border-slate-700 bg-slate-900/60"
            }`}
          >
            RADAR {radarActive ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition-all"
          >
            {fullscreen ? (
              <CompressOutlined style={{ fontSize: 13 }} />
            ) : (
              <ExpandOutlined style={{ fontSize: 13 }} />
            )}
          </button>
        </div>
      </div>

      {/* ── Main Canvas + Sidebar ── */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[480px]">
        {/* SVG Map Area */}
        <div className="relative flex-1 min-h-[460px] overflow-hidden">
          {/* Tooltip */}
          {selected && (
            <div className="absolute inset-0 pointer-events-none z-30">
              <MarkerTooltip marker={selected} onClose={() => setSelectedId(null)} />
            </div>
          )}

          {/* SVG */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full h-full"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease",
              minHeight: "460px",
            }}
          >
            <defs>
              <radialGradient id="gisRadarGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(16,185,129,0)" />
                <stop offset="60%" stopColor="rgba(16,185,129,0.05)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.22)" />
              </radialGradient>
              <linearGradient id="gisSweepGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(16,185,129,0)" />
                <stop offset="80%" stopColor="rgba(16,185,129,0.18)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.55)" />
              </linearGradient>
              <linearGradient id="gisRiverGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
              </linearGradient>
              <filter id="gisGlowFilter">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="gisWbClip">
                <path d={WB_BOUNDARY} />
              </clipPath>
            </defs>

            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="rgba(9,13,22,0.3)" />

            {/* Coordinate grid lines */}
            {Array.from({ length: 19 }, (_, i) => i * 24).map((y) => (
              <line key={`glat-${y}`} x1={0} y1={y} x2={SVG_W} y2={y}
                stroke="rgba(16,185,129,0.07)" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 14 }, (_, i) => i * 24).map((x) => (
              <line key={`glon-${x}`} x1={x} y1={0} x2={x} y2={SVG_H}
                stroke="rgba(16,185,129,0.07)" strokeWidth={0.5} />
            ))}
            {/* Lat labels */}
            {[88.5, 88.0, 87.5, 87.0, 86.5].map((lat, i) => (
              <text key={`llat-${lat}`} x={4} y={i * 88 + 14} fontSize={6}
                fill="rgba(16,185,129,0.45)" fontFamily="monospace">{lat}°N</text>
            ))}
            {/* Lon labels */}
            {[21.5, 22.5, 23.5, 24.5].map((lon, i) => (
              <text key={`llon-${lon}`} x={i * 80 + 20} y={SVG_H - 4} fontSize={6}
                fill="rgba(16,185,129,0.45)" fontFamily="monospace">{lon}°E</text>
            ))}

            {/* WB Boundary */}
            <path d={WB_BOUNDARY}
              fill="rgba(16,185,129,0.04)"
              stroke="rgba(16,185,129,0.55)"
              strokeWidth={1.5}
              filter="url(#gisGlowFilter)"
            />

            {/* District lines */}
            {DISTRICT_LINES.map((d, i) => (
              <path key={`gdist-${i}`} d={d} fill="none"
                stroke="rgba(20,184,166,0.22)" strokeWidth={0.7} strokeDasharray="4 3" />
            ))}

            {/* Hooghly River */}
            <path d={HOOGHLY_RIVER} fill="none"
              stroke="url(#gisRiverGrad)" strokeWidth={2.5} strokeLinecap="round"
              filter="url(#gisGlowFilter)" />
            <text x={106} y={280} fontSize={6}
              fill="rgba(20,184,166,0.65)" fontFamily="monospace"
              transform="rotate(-8,106,280)">Hooghly R.</text>

            {/* Metro Corridor */}
            <path d={METRO_CORRIDOR} fill="none"
              stroke="rgba(139,92,246,0.6)" strokeWidth={2} strokeLinecap="round" strokeDasharray="6 2" />
            <text x={130} y={244} fontSize={5.5} fill="rgba(139,92,246,0.75)" fontFamily="monospace">
              Metro
            </text>

            {/* Siliguri Corridor */}
            <path d={SILIGURI_CORRIDOR} fill="none"
              stroke="rgba(251,191,36,0.5)" strokeWidth={2} strokeLinecap="round" strokeDasharray="5 3" />
            <text x={170} y={68} fontSize={5.5}
              fill="rgba(251,191,36,0.7)" fontFamily="monospace"
              transform="rotate(-40,170,68)">Siliguri Corridor</text>

            {/* Sundarbans Coastline */}
            <path d={SUNDARBANS_COAST} fill="none"
              stroke="rgba(6,182,212,0.55)" strokeWidth={2} strokeLinecap="round" />
            <text x={136} y={422} fontSize={6}
              fill="rgba(6,182,212,0.7)" fontFamily="monospace">Sundarbans</text>

            {/* Radar sweep */}
            {radarActive && (
              <g clipPath="url(#gisWbClip)">
                <circle cx={160} cy={240} r={140} fill="url(#gisRadarGrad)" />
                {[40, 80, 120].map((r) => (
                  <circle key={`gring-${r}`} cx={160} cy={240} r={r}
                    fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth={0.8} />
                ))}
                <line x1={160} y1={100} x2={160} y2={380}
                  stroke="rgba(16,185,129,0.1)" strokeWidth={0.6} />
                <line x1={20} y1={240} x2={300} y2={240}
                  stroke="rgba(16,185,129,0.1)" strokeWidth={0.6} />
                <g
                  style={{
                    animation: "radarSweep 6s linear infinite",
                    transformOrigin: "160px 240px",
                  }}
                >
                  <path
                    d="M 160 240 L 300 240 A 140 140 0 0 0 279 156 Z"
                    fill="url(#gisSweepGrad)"
                    opacity={0.85}
                  />
                </g>
              </g>
            )}

            {/* Map Markers */}
            {MARKERS.map((marker) => (
              <MarkerPin
                key={marker.id}
                marker={marker}
                isSelected={selectedId === marker.id}
                onClick={handleMarkerClick}
                svgW={SVG_W}
                svgH={SVG_H}
              />
            ))}

            {/* Corner tactical brackets */}
            <path d="M 8 8 L 22 8 M 8 8 L 8 22"
              stroke="rgba(16,185,129,0.5)" strokeWidth={1.5} />
            <path d={`M ${SVG_W - 8} 8 L ${SVG_W - 22} 8 M ${SVG_W - 8} 8 L ${SVG_W - 8} 22`}
              stroke="rgba(16,185,129,0.5)" strokeWidth={1.5} />
            <path d={`M 8 ${SVG_H - 8} L 22 ${SVG_H - 8} M 8 ${SVG_H - 8} L 8 ${SVG_H - 22}`}
              stroke="rgba(16,185,129,0.5)" strokeWidth={1.5} />
            <path d={`M ${SVG_W - 8} ${SVG_H - 8} L ${SVG_W - 22} ${SVG_H - 8} M ${SVG_W - 8} ${SVG_H - 8} L ${SVG_W - 8} ${SVG_H - 22}`}
              stroke="rgba(16,185,129,0.5)" strokeWidth={1.5} />

            {/* Watermark */}
            <text x={SVG_W / 2} y={SVG_H - 14} fontSize={6.5}
              fill="rgba(16,185,129,0.28)" fontFamily="monospace" textAnchor="middle" letterSpacing={2}>
              LANDGUARD AI • GEOINT COMPOSITE • WEST BENGAL
            </text>
          </svg>

          {/* Floating Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
            <button type="button" onClick={() => setZoom((z) => Math.min(z + 0.2, 2.0))}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-900/85 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all">
              <ZoomInOutlined style={{ fontSize: 14 }} />
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-900/85 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all">
              <ZoomOutOutlined style={{ fontSize: 14 }} />
            </button>
            <button type="button" onClick={() => { setZoom(1); setSelectedId(null); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-900/85 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all">
              <ReloadOutlined style={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Coordinate HUD */}
          <div className="absolute bottom-4 left-4 z-20 font-mono text-[10px] text-slate-500 bg-slate-900/75 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400/80">
              <AimOutlined style={{ fontSize: 11 }} />
              <span>22.5726°N 88.3639°E</span>
            </div>
            <div className="text-[9px] text-slate-600 mt-0.5">WEST BENGAL STATE</div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div
          className="w-full lg:w-52 flex-shrink-0 flex flex-col gap-3 p-4 border-t lg:border-t-0 lg:border-l"
          style={{ borderColor: "rgba(51,65,85,0.55)", background: "rgba(9,13,22,0.45)" }}
        >
          {/* Active Bands */}
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
              Active Bands
            </p>
            <div className="flex flex-wrap gap-1.5">
              <BandChip label="FOV 290km" color="#10B981" />
              <BandChip label="Sentinel-2" color="#14B8A6" />
              <BandChip label="Cartosat-3" color="#8B5CF6" />
              <BandChip label="RGB Band" color="#F59E0B" />
            </div>
          </div>

          <div className="border-t border-slate-800/70" />

          {/* Legend */}
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
              Alert Legend
            </p>
            <div className="flex flex-col gap-1.5">
              <LegendRow color="#EF4444" label="Critical" count={critCount} />
              <LegendRow color="#F59E0B" label="High" count={highCount} />
              <LegendRow color="#10B981" label="Moderate" count={modCount} />
            </div>
          </div>

          <div className="border-t border-slate-800/70" />

          {/* Map layers */}
          <div>
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
              Map Layers
            </p>
            <div className="flex flex-col gap-1.5">
              <LayerRow color="#10B981" label="WB Boundary" dash={false} />
              <LayerRow color="#14B8A6" label="Hooghly River" dash={false} />
              <LayerRow color="#8B5CF6" label="Metro Corridor" dash={true} />
              <LayerRow color="#F59E0B" label="Siliguri Corridor" dash={true} />
              <LayerRow color="#06B6D4" label="Sundarbans Coast" dash={false} />
              <LayerRow color="rgba(51,65,85,0.8)" label="District Lines" dash={true} />
            </div>
          </div>

          <div className="border-t border-slate-800/70" />

          {/* Selected incident */}
          {selected ? (
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                Selected Incident
              </p>
              <div
                className="rounded-xl p-3 text-xs"
                style={{
                  background: SEVERITY_COLOR[selected.severity].bg,
                  border: `1px solid ${SEVERITY_COLOR[selected.severity].border}`,
                }}
              >
                <div
                  className="font-mono font-bold text-[11px] mb-1"
                  style={{ color: SEVERITY_COLOR[selected.severity].dot }}
                >
                  {selected.label}
                </div>
                <div className="text-slate-300 font-semibold mb-1 text-[11px]">{selected.district}</div>
                <div className="text-slate-400 leading-relaxed text-[10px] mb-2">
                  {selected.description}
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 text-[10px]">Confidence</span>
                  <span className="font-mono font-bold text-[11px]"
                    style={{ color: SEVERITY_COLOR[selected.severity].dot }}>
                    {selected.confidence}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selected.confidence}%`,
                      background: `linear-gradient(90deg, ${SEVERITY_COLOR[selected.severity].dot}99, ${SEVERITY_COLOR[selected.severity].dot})`,
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-slate-600 text-center py-3 font-mono">
              Click a marker to inspect incident
            </div>
          )}

          {/* Telemetry footer */}
          <div className="mt-auto pt-2 border-t border-slate-800/70">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"
                style={{ animation: "livePulse 2s cubic-bezier(0,0,0.2,1) infinite" }}
              />
              <span>Live telemetry · 15s refresh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
