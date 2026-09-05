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
  CloseOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MarkerSeverity = "critical" | "high" | "moderate";

export type AnomalyCategory =
  | "Illegal Structure"
  | "Vegetation Loss"
  | "Sand Mining"
  | "Wetland Encroachment"
  | "Canal Filling";

export interface MapMarker {
  id: string;
  label: string; // Incident code (e.g. ALT-001)
  district: string;
  lat: number;
  lon: number;
  x: number; // % of SVG width (0-100)
  y: number; // % of SVG height (0-100)
  confidence: number;
  category: AnomalyCategory;
  severity: MarkerSeverity;
  affectedArea: string;
  landClass: string;
  satelliteSource: string;
  description: string;
}

export interface DetectionPolygon {
  id: string;
  name: string;
  points: string;
  severity: MarkerSeverity;
  category: AnomalyCategory;
}

// ─── Constants & Color Themes ─────────────────────────────────────────────────

const SEVERITY_COLOR: Record<
  MarkerSeverity,
  { ring: string; dot: string; text: string; bg: string; border: string; glow: string }
> = {
  critical: {
    ring: "rgba(239,68,68,0.45)",
    dot: "#EF4444",
    text: "text-red-400",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.45)",
    glow: "rgba(239,68,68,0.35)",
  },
  high: {
    ring: "rgba(245,158,11,0.45)",
    dot: "#F59E0B",
    text: "text-amber-400",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.45)",
    glow: "rgba(245,158,11,0.30)",
  },
  moderate: {
    ring: "rgba(16,185,129,0.45)",
    dot: "#10B981",
    text: "text-emerald-400",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.45)",
    glow: "rgba(16,185,129,0.30)",
  },
};

// ─── 18 Detection Hotspots across West Bengal ─────────────────────────────────

const MARKERS: MapMarker[] = [
  {
    id: "mk1",
    label: "ALT-001",
    district: "South 24 Parganas",
    lat: 21.82,
    lon: 88.65,
    x: 58,
    y: 76,
    confidence: 97,
    category: "Vegetation Loss",
    severity: "critical",
    affectedArea: "14.7 ha",
    landClass: "Protected Mangrove Biosphere",
    satelliteSource: "Sentinel-2 SWIR",
    description: "Illegal mangrove clearance detected via Sentinel-2 SWIR band reflectance anomaly",
  },
  {
    id: "mk2",
    label: "ALT-002",
    district: "North 24 Parganas",
    lat: 22.72,
    lon: 88.48,
    x: 54,
    y: 61,
    confidence: 94,
    category: "Illegal Structure",
    severity: "critical",
    affectedArea: "3.2 ha",
    landClass: "Peri-Urban Agricultural Zone",
    satelliteSource: "Cartosat-3 PAN",
    description: "Unauthorised commercial structure cluster spanning 3 merged agricultural plots",
  },
  {
    id: "mk3",
    label: "ALT-003",
    district: "Kolkata",
    lat: 22.54,
    lon: 88.40,
    x: 48,
    y: 56,
    confidence: 91,
    category: "Wetland Encroachment",
    severity: "high",
    affectedArea: "8.4 ha",
    landClass: "East Kolkata Wetlands (Ramsar)",
    satelliteSource: "Sentinel-2 NDWI",
    description: "Solid construction dumping and boundary encroachment along natural sewage bheris",
  },
  {
    id: "mk4",
    label: "ALT-004",
    district: "Purba Bardhaman",
    lat: 23.23,
    lon: 87.86,
    x: 38,
    y: 38,
    confidence: 86,
    category: "Illegal Structure",
    severity: "high",
    affectedArea: "5.1 ha",
    landClass: "Multi-crop Prime Farmland",
    satelliteSource: "Cartosat-3 PAN",
    description: "Commercial logistics warehouse built over cadastral-registered agricultural buffer",
  },
  {
    id: "mk5",
    label: "ALT-005",
    district: "Birbhum",
    lat: 23.90,
    lon: 87.52,
    x: 29,
    y: 28,
    confidence: 78,
    category: "Vegetation Loss",
    severity: "moderate",
    affectedArea: "6.3 ha",
    landClass: "Sal Forest Fringe Reserve",
    satelliteSource: "Sentinel-2 NDVI",
    description: "Canopy fragmentation and illegal charcoal kiln operation within forest boundary",
  },
  {
    id: "mk6",
    label: "ALT-006",
    district: "Murshidabad",
    lat: 24.18,
    lon: 88.27,
    x: 68,
    y: 42,
    confidence: 96,
    category: "Sand Mining",
    severity: "critical",
    affectedArea: "12.8 ha",
    landClass: "Bhagirathi Riparian Buffer",
    satelliteSource: "PlanetScope 3m",
    description: "Mechanised riverbed sand dredging altering natural hydrological flood line",
  },
  {
    id: "mk7",
    label: "ALT-007",
    district: "Darjeeling",
    lat: 27.04,
    lon: 88.26,
    x: 56,
    y: 7,
    confidence: 76,
    category: "Illegal Structure",
    severity: "moderate",
    affectedArea: "2.4 ha",
    landClass: "Ecological Slope Zone",
    satelliteSource: "Cartosat-3 PAN",
    description: "Unauthorised hillside terracing and foundation excavation in landslide risk zone",
  },
  {
    id: "mk8",
    label: "ALT-008",
    district: "Sundarbans",
    lat: 21.75,
    lon: 88.82,
    x: 46,
    y: 84,
    confidence: 98,
    category: "Canal Filling",
    severity: "critical",
    affectedArea: "11.2 ha",
    landClass: "Tiger Reserve Buffer Estuary",
    satelliteSource: "Sentinel-2 MSI",
    description: "Tidal inlet blockade and earthen bund creation for illegal brackish prawn farming",
  },
  {
    id: "mk9",
    label: "ALT-009",
    district: "Paschim Medinipur",
    lat: 22.42,
    lon: 87.32,
    x: 27,
    y: 68,
    confidence: 89,
    category: "Sand Mining",
    severity: "high",
    affectedArea: "7.9 ha",
    landClass: "Subarnarekha River Basin",
    satelliteSource: "Landsat-9 OLI",
    description: "Unlicensed commercial excavation pit operating within 50m of river embankment dyke",
  },
  {
    id: "mk10",
    label: "ALT-010",
    district: "Purulia",
    lat: 23.33,
    lon: 86.36,
    x: 20,
    y: 48,
    confidence: 82,
    category: "Vegetation Loss",
    severity: "moderate",
    affectedArea: "5.6 ha",
    landClass: "Ayodhya Hills Reserved Forest",
    satelliteSource: "Sentinel-2 NDVI",
    description: "Deciduous canopy depletion and unauthorized scrub clearing along hill commons",
  },
  {
    id: "mk11",
    label: "ALT-011",
    district: "Bankura",
    lat: 23.23,
    lon: 87.07,
    x: 28,
    y: 56,
    confidence: 87,
    category: "Canal Filling",
    severity: "high",
    affectedArea: "4.8 ha",
    landClass: "Kangsabati Canal Right-of-Way",
    satelliteSource: "Cartosat-3 PAN",
    description: "Debris fill and construction encroachment narrowing state irrigation distributary",
  },
  {
    id: "mk12",
    label: "ALT-012",
    district: "Howrah",
    lat: 22.59,
    lon: 88.26,
    x: 43,
    y: 60,
    confidence: 95,
    category: "Illegal Structure",
    severity: "critical",
    affectedArea: "4.6 ha",
    landClass: "Drainage Basin Catchment",
    satelliteSource: "WorldView-3 SWIR",
    description: "Heavy engineering shed constructed directly over designated urban stormwater basin",
  },
  {
    id: "mk13",
    label: "ALT-013",
    district: "Hooghly",
    lat: 22.90,
    lon: 88.39,
    x: 44,
    y: 50,
    confidence: 88,
    category: "Wetland Encroachment",
    severity: "high",
    affectedArea: "6.2 ha",
    landClass: "Dankuni Lowland Basin",
    satelliteSource: "Sentinel-2 NDWI",
    description: "Perennial floodplain wetland filled with commercial silt and industrial debris",
  },
  {
    id: "mk14",
    label: "ALT-014",
    district: "Nadia",
    lat: 23.47,
    lon: 88.55,
    x: 58,
    y: 46,
    confidence: 83,
    category: "Sand Mining",
    severity: "moderate",
    affectedArea: "5.3 ha",
    landClass: "Jalangi Riverbed Alluvium",
    satelliteSource: "PlanetScope 3m",
    description: "Night-time sand extraction operations tracked via repeated thermal radiance changes",
  },
  {
    id: "mk15",
    label: "ALT-015",
    district: "Malda",
    lat: 25.01,
    lon: 88.14,
    x: 64,
    y: 22,
    confidence: 93,
    category: "Canal Filling",
    severity: "critical",
    affectedArea: "9.1 ha",
    landClass: "Mahananda Flood Corridor",
    satelliteSource: "Sentinel-2 MSI",
    description: "Artificial earthen embankment constructed across natural flood discharge branch",
  },
  {
    id: "mk16",
    label: "ALT-016",
    district: "Jalpaiguri",
    lat: 26.54,
    lon: 88.72,
    x: 60,
    y: 13,
    confidence: 89,
    category: "Vegetation Loss",
    severity: "high",
    affectedArea: "8.7 ha",
    landClass: "Dooars Wildlife Corridor",
    satelliteSource: "Sentinel-2 NDVI",
    description: "Deforestation and clear-cutting along designated elephant transit buffer strip",
  },
  {
    id: "mk17",
    label: "ALT-017",
    district: "Alipurduar",
    lat: 26.49,
    lon: 89.52,
    x: 66,
    y: 10,
    confidence: 79,
    category: "Illegal Structure",
    severity: "moderate",
    affectedArea: "3.1 ha",
    landClass: "Buxa Tiger Reserve Periphery",
    satelliteSource: "Cartosat-3 PAN",
    description: "Commercial brick kiln establishment operating within eco-sensitive protected radius",
  },
  {
    id: "mk18",
    label: "ALT-018",
    district: "Paschim Bardhaman",
    lat: 23.68,
    lon: 86.98,
    x: 32,
    y: 44,
    confidence: 96,
    category: "Illegal Structure",
    severity: "critical",
    affectedArea: "15.2 ha",
    landClass: "Colliery Reclamation Land",
    satelliteSource: "Cartosat-3 PAN",
    description: "Massive unpermitted steel fabrication complex sprawling across coal authority lease",
  },
];

// ─── AI Detection Encroachment Polygons ────────────────────────────────────────

const DETECTION_POLYGONS: DetectionPolygon[] = [
  {
    id: "poly-kolkata",
    name: "Zone Alpha — E. Kolkata Basin",
    points: "140,225 165,220 176,245 164,268 142,262 135,238",
    severity: "critical",
    category: "Wetland Encroachment",
  },
  {
    id: "poly-sundarbans",
    name: "Zone Bravo — Sundarbans Tidal Inlet",
    points: "128,345 158,340 182,365 170,395 138,398 122,370",
    severity: "critical",
    category: "Canal Filling",
  },
  {
    id: "poly-asansol",
    name: "Zone Charlie — Asansol Sprawl",
    points: "90,185 116,180 122,208 102,220 86,204",
    severity: "critical",
    category: "Illegal Structure",
  },
  {
    id: "poly-murshidabad",
    name: "Zone Delta — Bhagirathi Sand Dredge",
    points: "206,172 232,176 238,202 218,210 202,192",
    severity: "critical",
    category: "Sand Mining",
  },
  {
    id: "poly-jalpaiguri",
    name: "Zone Echo — Dooars Forest Corridor",
    points: "182,42 215,38 224,64 195,72 178,55",
    severity: "high",
    category: "Vegetation Loss",
  },
  {
    id: "poly-bankura",
    name: "Zone Foxtrot — Kangsabati Distributary",
    points: "78,235 102,238 98,260 76,255",
    severity: "high",
    category: "Canal Filling",
  },
  {
    id: "poly-birbhum",
    name: "Zone Golf — Birbhum Canopy Fringe",
    points: "84,115 106,112 112,135 90,140",
    severity: "moderate",
    category: "Vegetation Loss",
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
    0%   { transform: scale(0.9); opacity: 0.9; }
    65%  { transform: scale(2.5); opacity: 0; }
    100% { transform: scale(2.7); opacity: 0; }
  }
  @keyframes markerPingH {
    0%   { transform: scale(0.9); opacity: 0.8; }
    65%  { transform: scale(2.2); opacity: 0; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes markerPingM {
    0%   { transform: scale(0.9); opacity: 0.7; }
    65%  { transform: scale(2.0); opacity: 0; }
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
    from { opacity: 0; transform: scale(0.94) translateY(6px); }
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
  @keyframes polygonPulse {
    0%, 100% { fill-opacity: 0.25; stroke-opacity: 0.65; }
    50%      { fill-opacity: 0.45; stroke-opacity: 0.95; }
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

function LayerRow({
  color,
  label,
  dash,
  active = true,
  onToggle,
}: {
  color: string;
  label: string;
  dash: boolean;
  active?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 w-full text-left transition-opacity cursor-pointer ${active ? "opacity-100" : "opacity-40"
        }`}
    >
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
      <span className="text-[11px] text-slate-300 flex-1">{label}</span>
      {onToggle && (
        <span
          className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
          style={{
            background: active ? `${color}20` : "rgba(51,65,85,0.4)",
            color: active ? color : "#64748B",
          }}
        >
          {active ? "ON" : "OFF"}
        </span>
      )}
    </button>
  );
}

// ─── MapMarker SVG Pin Component ─────────────────────────────────────────────

interface PinProps {
  marker: MapMarker;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (id: string) => void;
  onHover: (marker: MapMarker | null) => void;
  svgW: number;
  svgH: number;
}

function MarkerPin({
  marker,
  isSelected,
  isHovered,
  onClick,
  onHover,
  svgW,
  svgH,
}: PinProps) {
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

  const active = isSelected || isHovered;

  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={() => onClick(marker.id)}
      onMouseEnter={() => onHover(marker)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Outer Pulse Ring */}
      <circle
        cx={cx}
        cy={cy}
        r={active ? 15 : 9}
        fill="none"
        stroke={col.dot}
        strokeWidth={active ? 1.6 : 1}
        opacity={active ? 0.75 : 0.4}
        style={{
          animation: `${pingAnim} ${pingDur} cubic-bezier(0,0,0.2,1) infinite`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />

      {/* Secondary Pulse for Critical */}
      {marker.severity === "critical" && (
        <circle
          cx={cx}
          cy={cy}
          r={active ? 20 : 13}
          fill="none"
          stroke={col.dot}
          strokeWidth={0.8}
          opacity={0.3}
          style={{
            animation: `${pingAnim} ${pingDur} cubic-bezier(0,0,0.2,1) 0.6s infinite`,
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
      )}

      {/* Spinning dashed reticle ring when selected */}
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r={20}
          fill="none"
          stroke={col.dot}
          strokeWidth={0.9}
          opacity={0.65}
          strokeDasharray="3 3"
          style={{
            animation: "reticleSpin 7s linear infinite",
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
      )}

      {/* Halo glow */}
      <circle
        cx={cx}
        cy={cy}
        r={active ? 8 : 6}
        fill={col.dot}
        opacity={active ? 0.45 : 0.25}
      />

      {/* Core Dot */}
      <circle
        cx={cx}
        cy={cy}
        r={active ? 5.5 : 4}
        fill={col.dot}
        opacity={0.95}
        style={{
          filter: `drop-shadow(0 0 ${active ? 8 : 5}px ${col.dot})`,
          transition: "r 0.15s ease",
        }}
      />

      {/* Specular highlight */}
      <circle cx={cx - 1.2} cy={cy - 1.2} r={1.2} fill="white" opacity={0.6} />

      {/* Label */}
      <text
        x={cx + 8}
        y={cy - 7}
        fontSize={6.5}
        fill={col.dot}
        fontFamily="monospace"
        fontWeight="bold"
        opacity={active ? 1 : 0.8}
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        {marker.label}
      </text>
    </g>
  );
}

// ─── Floating Glass Hover Intelligence Tooltip ────────────────────────────────

function HoverIntelligenceTooltip({
  marker,
  onClose,
}: {
  marker: MapMarker;
  onClose: () => void;
}) {
  const col = SEVERITY_COLOR[marker.severity];

  // Adjust tooltip position to avoid clipping viewport edges
  const leftPct = Math.min(Math.max(marker.x, 24), 76);
  const isNearTop = marker.y < 34;

  return (
    <div
      className="absolute z-40 w-72 rounded-2xl p-4 text-xs pointer-events-auto shadow-2xl transition-all"
      style={{
        left: `${leftPct}%`,
        top: isNearTop ? `calc(${marker.y}% + 28px)` : `calc(${marker.y}% - 14px)`,
        transform: isNearTop ? "translateX(-50%)" : "translate(-50%, -100%)",
        background: "rgba(17,24,39,0.88)",
        border: `1px solid ${col.border}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 0 28px ${col.ring}, 0 16px 36px rgba(0,0,0,0.75)`,
        animation: "tooltipPop 0.18s ease-out both",
      }}
    >
      {/* Top Header: Incident Code, Severity pill, Close button */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="font-mono font-extrabold text-xs tracking-wider"
            style={{ color: col.dot }}
          >
            {marker.label}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider"
            style={{ background: col.bg, color: col.dot, border: `1px solid ${col.border}` }}
          >
            {marker.severity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">
            {marker.lat.toFixed(2)}°N {marker.lon.toFixed(2)}°E
          </span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer text-[12px] leading-none p-0.5"
            title="Dismiss"
          >
            <CloseOutlined />
          </button>
        </div>
      </div>

      {/* District & Category */}
      <div className="mb-2">
        <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
          <EnvironmentOutlined style={{ color: col.dot, fontSize: 12 }} />
          {marker.district}
        </div>
        <div className="text-[11px] font-medium text-emerald-400 mt-0.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#10B981]" />
          <span>Category:</span>
          <span className="font-semibold text-teal-300">{marker.category}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[10px] text-slate-300 leading-relaxed mb-2.5 border-t border-slate-800/80 pt-2">
        {marker.description}
      </p>

      {/* Intelligence Grid: Affected Area, Satellite Source, Land Classification */}
      <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900/70 rounded-xl p-2.5 border border-slate-800/80 mb-2.5 font-mono">
        <div>
          <span className="text-slate-500 block text-[9px] uppercase tracking-wider">
            Affected Area
          </span>
          <span className="text-slate-100 font-bold">{marker.affectedArea}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px] uppercase tracking-wider">
            Satellite Source
          </span>
          <span className="text-slate-100 font-bold">{marker.satelliteSource}</span>
        </div>
        <div className="col-span-2 border-t border-slate-800/70 pt-1.5 mt-0.5">
          <span className="text-slate-500 block text-[9px] uppercase tracking-wider">
            Land Classification
          </span>
          <span className="text-teal-300 font-medium">{marker.landClass}</span>
        </div>
      </div>

      {/* AI Confidence Meter */}
      <div>
        <div className="flex items-center justify-between mb-1 text-[10px]">
          <span className="text-slate-400 font-mono">AI Confidence</span>
          <span className="font-mono font-bold" style={{ color: col.dot }}>
            {marker.confidence}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${marker.confidence}%`,
              background: `linear-gradient(90deg, ${col.dot}99, ${col.dot})`,
              boxShadow: `0 0 8px ${col.dot}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GISMapCanvas() {
  const [selectedId, setSelectedId] = useState<string | null>("mk1");
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [radarActive, setRadarActive] = useState(true);

  // 4 Independent Multi-layer raster overlays
  const [layers, setLayers] = useState({
    encroachment: true,
    ndvi: true,
    flood: true,
    change: true,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  const SVG_W = 320;
  const SVG_H = 440;

  const selected = MARKERS.find((m) => m.id === selectedId) ?? null;
  const activeTooltip = hoveredMarker || selected;

  const handleMarkerClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const critCount = MARKERS.filter((m) => m.severity === "critical").length;
  const highCount = MARKERS.filter((m) => m.severity === "high").length;
  const modCount = MARKERS.filter((m) => m.severity === "moderate").length;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl transition-all duration-500 ${fullscreen ? "fixed inset-4 z-50" : ""
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

      {/* Animated scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 22px, rgba(16,185,129,0.025) 22px, rgba(16,185,129,0.025) 24px)",
          animation: "scanlineMove 4s linear infinite",
        }}
      />

      {/* Radial glow background */}
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
              WEST BENGAL • SENTINEL-2 + CARTOSAT-3 COMPOSITE • 18 ANOMALIES
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
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border cursor-pointer transition-all ${radarActive
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

      {/* ── Main Canvas ── */}
      <div className="relative z-10">
        {/* SVG Map Viewport Area */}
        <div className="relative w-full aspect-[16/10] lg:aspect-[5/6] flex-1 overflow-hidden rounded-2xl p-5 lg:p-6 min-w-0">
          {/* Tactical HUD Chips: Top-Left Inside Map */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-[65%] pointer-events-auto">
            <button
              type="button"
              onClick={() => toggleLayer("encroachment")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${layers.encroachment
                ? "border-red-500/50 bg-red-500/15 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                : "border-slate-800 bg-slate-900/70 text-slate-500 hover:text-slate-400"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${layers.encroachment ? "bg-red-400 animate-pulse" : "bg-slate-600"
                  }`}
              />
              YOLOv8 ACTIVE
            </button>

            <button
              type="button"
              onClick={() => toggleLayer("ndvi")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${layers.ndvi
                ? "border-yellow-500/50 bg-yellow-500/15 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.2)]"
                : "border-slate-800 bg-slate-900/70 text-slate-500 hover:text-slate-400"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${layers.ndvi ? "bg-yellow-400 animate-pulse" : "bg-slate-600"
                  }`}
              />
              NDVI LAYER
            </button>

            <button
              type="button"
              onClick={() => toggleLayer("flood")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${layers.flood
                ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "border-slate-800 bg-slate-900/70 text-slate-500 hover:text-slate-400"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${layers.flood ? "bg-cyan-400 animate-pulse" : "bg-slate-600"
                  }`}
              />
              FLOOD MODEL
            </button>

            <button
              type="button"
              onClick={() => toggleLayer("change")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${layers.change
                ? "border-purple-500/50 bg-purple-500/15 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                : "border-slate-800 bg-slate-900/70 text-slate-500 hover:text-slate-400"
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${layers.change ? "bg-purple-400 animate-pulse" : "bg-slate-600"
                  }`}
              />
              CHANGE DETECTION
            </button>
          </div>

          {/* Tactical HUD Chips: Top-Right Inside Map */}
          <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-none">
            <div className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border border-emerald-500/40 bg-slate-900/85 text-emerald-300 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.18)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
              AI Scan Confidence 96.4%
            </div>
            <div className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border border-teal-500/40 bg-slate-900/85 text-teal-300 backdrop-blur-md shadow-[0_0_12px_rgba(20,184,166,0.18)]">
              Raster Resolution 10m
            </div>
          </div>

          {/* Floating Glass Tooltip on Hotspot Hover / Selection */}
          {activeTooltip && (
            <div className="absolute top-24 left-6 pointer-events-none z-30 w-[300px] max-w-[85%]">
              <HoverIntelligenceTooltip
                marker={activeTooltip}
                onClose={() => {
                  setSelectedId(null);
                  setHoveredMarker(null);
                }}
              />
            </div>
          )}

          {/* SVG Map Canvas */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="absolute inset-6 w-[calc(100%-48px)] h-[calc(100%-48px)]"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease",
            }}
          >
            <defs>
              {/* Radar Gradients */}
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

              {/* Glowing Filters */}
              <filter id="gisGlowFilter">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Heat Intensity Gaussian Blur Filter */}
              <filter id="gisHeatBlobFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 1.5 0"
                />
              </filter>

              {/* WB Boundary ClipPath */}
              <clipPath id="gisWbClip">
                <path d={WB_BOUNDARY} />
              </clipPath>

              {/* ── Radial Gradients for Heat Intensity Blobs ── */}
              {/* Critical: Red Glow (radius 90px) */}
              <radialGradient id="heatBlobCritical" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
                <stop offset="35%" stopColor="#DC2626" stopOpacity="0.32" />
                <stop offset="70%" stopColor="#B91C1C" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </radialGradient>

              {/* High: Orange Glow (radius 70px) */}
              <radialGradient id="heatBlobHigh" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.42" />
                <stop offset="40%" stopColor="#EA580C" stopOpacity="0.28" />
                <stop offset="75%" stopColor="#C2410C" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
              </radialGradient>

              {/* Moderate: Emerald Glow (radius 55px) */}
              <radialGradient id="heatBlobModerate" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.38" />
                <stop offset="40%" stopColor="#059669" stopOpacity="0.24" />
                <stop offset="75%" stopColor="#047857" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>

              {/* ── 4 Multi-Layer Raster Heatmap Gradients ── */}
              {/* 1. Encroachment Heatmap (red/orange) */}
              <radialGradient id="encroachGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#F97316" stopOpacity="0.38" />
                <stop offset="70%" stopColor="#FB923C" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
              </radialGradient>

              {/* 2. NDVI Vegetation Loss (green/yellow) */}
              <radialGradient id="ndviLossGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EAB308" stopOpacity="0.55" />
                <stop offset="35%" stopColor="#84CC16" stopOpacity="0.35" />
                <stop offset="75%" stopColor="#22C55E" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
              </radialGradient>

              {/* 3. Flood Risk (blue/cyan) */}
              <radialGradient id="floodRiskGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.58" />
                <stop offset="45%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#1D4ED8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </radialGradient>

              {/* 4. Change Detection (purple/teal) */}
              <radialGradient id="changeDetectGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.58" />
                <stop offset="40%" stopColor="#14B8A6" stopOpacity="0.35" />
                <stop offset="75%" stopColor="#8B5CF6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Canvas */}
            <rect width={SVG_W} height={SVG_H} fill="rgba(9,13,22,0.3)" />

            {/* Coordinate grid lines */}
            {Array.from({ length: 19 }, (_, i) => i * 24).map((y) => (
              <line
                key={`glat-${y}`}
                x1={0}
                y1={y}
                x2={SVG_W}
                y2={y}
                stroke="rgba(16,185,129,0.07)"
                strokeWidth={0.5}
              />
            ))}
            {Array.from({ length: 14 }, (_, i) => i * 24).map((x) => (
              <line
                key={`glon-${x}`}
                x1={x}
                y1={0}
                x2={x}
                y2={SVG_H}
                stroke="rgba(16,185,129,0.07)"
                strokeWidth={0.5}
              />
            ))}

            {/* Latitude labels */}
            {[88.5, 88.0, 87.5, 87.0, 86.5].map((lat, i) => (
              <text
                key={`llat-${lat}`}
                x={4}
                y={i * 88 + 14}
                fontSize={6}
                fill="rgba(16,185,129,0.45)"
                fontFamily="monospace"
              >
                {lat}°N
              </text>
            ))}

            {/* Longitude labels */}
            {[21.5, 22.5, 23.5, 24.5].map((lon, i) => (
              <text
                key={`llon-${lon}`}
                x={i * 80 + 20}
                y={SVG_H - 4}
                fontSize={6}
                fill="rgba(16,185,129,0.45)"
                fontFamily="monospace"
              >
                {lon}°E
              </text>
            ))}

            {/* WB Boundary Silhouette */}
            <path
              d={WB_BOUNDARY}
              fill="rgba(16,185,129,0.04)"
              stroke="rgba(16,185,129,0.55)"
              strokeWidth={1.5}
              filter="url(#gisGlowFilter)"
            />

            {/* District Boundary Lines */}
            {DISTRICT_LINES.map((d, i) => (
              <path
                key={`gdist-${i}`}
                d={d}
                fill="none"
                stroke="rgba(20,184,166,0.22)"
                strokeWidth={0.7}
                strokeDasharray="4 3"
              />
            ))}

            {/* Hooghly River */}
            <path
              d={HOOGHLY_RIVER}
              fill="none"
              stroke="url(#gisRiverGrad)"
              strokeWidth={2.5}
              strokeLinecap="round"
              filter="url(#gisGlowFilter)"
            />
            <text
              x={106}
              y={280}
              fontSize={6}
              fill="rgba(20,184,166,0.65)"
              fontFamily="monospace"
              transform="rotate(-8,106,280)"
            >
              Hooghly R.
            </text>

            {/* Metro Corridor */}
            <path
              d={METRO_CORRIDOR}
              fill="none"
              stroke="rgba(139,92,246,0.6)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="6 2"
            />
            <text
              x={130}
              y={244}
              fontSize={5.5}
              fill="rgba(139,92,246,0.75)"
              fontFamily="monospace"
            >
              Metro
            </text>

            {/* Siliguri Corridor */}
            <path
              d={SILIGURI_CORRIDOR}
              fill="none"
              stroke="rgba(251,191,36,0.5)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="5 3"
            />
            <text
              x={170}
              y={68}
              fontSize={5.5}
              fill="rgba(251,191,36,0.7)"
              fontFamily="monospace"
              transform="rotate(-40,170,68)"
            >
              Siliguri Corridor
            </text>

            {/* Sundarbans Coastline */}
            <path
              d={SUNDARBANS_COAST}
              fill="none"
              stroke="rgba(6,182,212,0.55)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <text
              x={136}
              y={422}
              fontSize={6}
              fill="rgba(6,182,212,0.7)"
              fontFamily="monospace"
            >
              Sundarbans
            </text>

            {/* ── 1. Multi-layer Raster Heatmap Overlays (4 Independent Groups) ── */}
            {/* Overlay Group 1: Encroachment Heatmap (red/orange) */}
            {layers.encroachment && (
              <g
                id="overlay-encroachment"
                clipPath="url(#gisWbClip)"
                style={{ mixBlendMode: "screen" }}
              >
                <circle cx={172} cy={268} r={65} fill="url(#encroachGrad)" />
                <circle cx={153} cy={246} r={55} fill="url(#encroachGrad)" />
                <circle cx={102} cy={193} r={70} fill="url(#encroachGrad)" />
                <circle cx={205} cy={95} r={50} fill="url(#encroachGrad)" />
                <circle cx={217} cy={184} r={60} fill="url(#encroachGrad)" />
              </g>
            )}

            {/* Overlay Group 2: NDVI Vegetation Loss (green/yellow) */}
            {layers.ndvi && (
              <g
                id="overlay-ndvi"
                clipPath="url(#gisWbClip)"
                style={{ mixBlendMode: "screen" }}
              >
                <circle cx={185} cy={334} r={75} fill="url(#ndviLossGrad)" />
                <circle cx={92} cy={123} r={55} fill="url(#ndviLossGrad)" />
                <circle cx={64} cy={211} r={60} fill="url(#ndviLossGrad)" />
                <circle cx={192} cy={57} r={50} fill="url(#ndviLossGrad)" />
              </g>
            )}

            {/* Overlay Group 3: Flood Risk (blue/cyan) */}
            {layers.flood && (
              <g
                id="overlay-flood"
                clipPath="url(#gisWbClip)"
                style={{ mixBlendMode: "screen" }}
              >
                <ellipse cx={135} cy={280} rx={45} ry={110} fill="url(#floodRiskGrad)" />
                <circle cx={147} cy={370} r={80} fill="url(#floodRiskGrad)" />
                <circle cx={204} cy={97} r={48} fill="url(#floodRiskGrad)" />
              </g>
            )}

            {/* Overlay Group 4: Change Detection (purple/teal) */}
            {layers.change && (
              <g
                id="overlay-change"
                clipPath="url(#gisWbClip)"
                style={{ mixBlendMode: "screen" }}
              >
                <circle cx={185} cy={202} r={60} fill="url(#changeDetectGrad)" />
                <circle cx={121} cy={167} r={52} fill="url(#changeDetectGrad)" />
                <circle cx={86} cy={299} r={58} fill="url(#changeDetectGrad)" />
                <circle cx={211} cy={44} r={45} fill="url(#changeDetectGrad)" />
              </g>
            )}

            {/* ── 3. Heat Intensity Blobs (Soft Gaussian blobs underneath hotspots) ── */}
            <g
              id="heat-intensity-blobs"
              clipPath="url(#gisWbClip)"
              filter="url(#gisHeatBlobFilter)"
              style={{ mixBlendMode: "screen", pointerEvents: "none" }}
            >
              {MARKERS.map((marker) => {
                const cx = (marker.x / 100) * SVG_W;
                const cy = (marker.y / 100) * SVG_H;
                const radius =
                  marker.severity === "critical"
                    ? 90
                    : marker.severity === "high"
                      ? 70
                      : 55;
                const fillGrad =
                  marker.severity === "critical"
                    ? "url(#heatBlobCritical)"
                    : marker.severity === "high"
                      ? "url(#heatBlobHigh)"
                      : "url(#heatBlobModerate)";

                return (
                  <circle
                    key={`heat-blob-${marker.id}`}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={fillGrad}
                  />
                );
              })}
            </g>

            {/* ── 4. AI Detection Polygons over Encroachment Zones ── */}
            {layers.encroachment && (
              <g id="ai-detection-polygons">
                {DETECTION_POLYGONS.map((poly) => {
                  const col = SEVERITY_COLOR[poly.severity];
                  return (
                    <polygon
                      key={poly.id}
                      points={poly.points}
                      fill={col.dot}
                      stroke={col.dot}
                      strokeWidth={1.3}
                      strokeDasharray="4 2.5"
                      style={{
                        animation: "polygonPulse 3s ease-in-out infinite",
                      }}
                    />
                  );
                })}
              </g>
            )}

            {/* Radar Sweep */}
            {radarActive && (
              <g clipPath="url(#gisWbClip)">
                <circle cx={160} cy={240} r={140} fill="url(#gisRadarGrad)" />
                {[40, 80, 120].map((r) => (
                  <circle
                    key={`gring-${r}`}
                    cx={160}
                    cy={240}
                    r={r}
                    fill="none"
                    stroke="rgba(16,185,129,0.12)"
                    strokeWidth={0.8}
                  />
                ))}
                <line
                  x1={160}
                  y1={100}
                  x2={160}
                  y2={380}
                  stroke="rgba(16,185,129,0.1)"
                  strokeWidth={0.6}
                />
                <line
                  x1={20}
                  y1={240}
                  x2={300}
                  y2={240}
                  stroke="rgba(16,185,129,0.1)"
                  strokeWidth={0.6}
                />
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

            {/* ── 2. Detection Hotspots (18 Anomaly Hotspots) ── */}
            {MARKERS.map((marker) => (
              <MarkerPin
                key={marker.id}
                marker={marker}
                isSelected={selectedId === marker.id}
                isHovered={hoveredMarker?.id === marker.id}
                onClick={handleMarkerClick}
                onHover={setHoveredMarker}
                svgW={SVG_W}
                svgH={SVG_H}
              />
            ))}

            {/* Tactical Corner Brackets */}
            <path
              d="M 8 8 L 22 8 M 8 8 L 8 22"
              stroke="rgba(16,185,129,0.5)"
              strokeWidth={1.5}
            />
            <path
              d={`M ${SVG_W - 8} 8 L ${SVG_W - 22} 8 M ${SVG_W - 8} 8 L ${SVG_W - 8} 22`}
              stroke="rgba(16,185,129,0.5)"
              strokeWidth={1.5}
            />
            <path
              d={`M 8 ${SVG_H - 8} L 22 ${SVG_H - 8} M 8 ${SVG_H - 8} L 8 ${SVG_H - 22}`}
              stroke="rgba(16,185,129,0.5)"
              strokeWidth={1.5}
            />
            <path
              d={`M ${SVG_W - 8} ${SVG_H - 8} L ${SVG_W - 22} ${SVG_H - 8} M ${SVG_W - 8
                } ${SVG_H - 8} L ${SVG_W - 8} ${SVG_H - 22}`}
              stroke="rgba(16,185,129,0.5)"
              strokeWidth={1.5}
            />

            {/* Watermark */}
            <text
              x={SVG_W / 2}
              y={SVG_H - 14}
              fontSize={6.5}
              fill="rgba(16,185,129,0.28)"
              fontFamily="monospace"
              textAnchor="middle"
              letterSpacing={2}
            >
              LANDGUARD AI • GEOINT COMPOSITE • WEST BENGAL
            </text>
          </svg>

          {/* Floating Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2.0))}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-900/85 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all shadow-md"
              title="Zoom In"
            >
              <ZoomInOutlined style={{ fontSize: 14 }} />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-900/85 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all shadow-md"
              title="Zoom Out"
            >
              <ZoomOutOutlined style={{ fontSize: 14 }} />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setSelectedId(null);
                setHoveredMarker(null);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-900/85 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 cursor-pointer transition-all shadow-md"
              title="Reset View"
            >
              <ReloadOutlined style={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Coordinate HUD */}
          <div className="absolute bottom-4 left-4 z-20 font-mono text-[10px] text-slate-500 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 pointer-events-none backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-emerald-400/90">
              <AimOutlined style={{ fontSize: 11 }} />
              <span>
                {activeTooltip
                  ? `${activeTooltip.lat.toFixed(4)}°N ${activeTooltip.lon.toFixed(4)}°E`
                  : "22.5726°N 88.3639°E"}
              </span>
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              {activeTooltip ? activeTooltip.district.toUpperCase() : "WEST BENGAL STATE"}
            </div>
          </div>
        </div>

        {/* ── Right Tactical Sidebar ── */}
        <div
          className="w-full lg:w-56 flex-shrink-0 flex flex-col gap-3 p-4 border-t lg:border-t-0 lg:border-l"
          style={{ borderColor: "rgba(51,65,85,0.55)", background: "rgba(9,13,22,0.45)" }}
        >
          {/* Floating Right Legend */}
          <div className="absolute top-24 right-5 z-20 hidden xl:block w-52">
            <div className="rounded-xl border border-emerald-500/20 bg-slate-950/75 backdrop-blur-md p-3 space-y-2 text-[11px] shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              {/* Active Bands */}
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Active Bands
                </p>
                <div className="flex flex-wrap gap-1">
                  <BandChip label="FOV 290km" color="#10B981" />
                  <BandChip label="Sentinel-2" color="#14B8A6" />
                  <BandChip label="Cartosat-3" color="#8B5CF6" />
                  <BandChip label="RGB Band" color="#F59E0B" />
                </div>
              </div>

              <div className="border-t border-slate-800/70" />

              {/* Alert Legend */}
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Alert Legend ({MARKERS.length} Hotspots)
                </p>
                <div className="flex flex-col gap-1">
                  <LegendRow color="#EF4444" label="Critical Anomaly" count={critCount} />
                  <LegendRow color="#F59E0B" label="High Priority" count={highCount} />
                  <LegendRow color="#10B981" label="Moderate Risk" count={modCount} />
                </div>
              </div>

              <div className="border-t border-slate-800/70" />

              {/* AI Heatmap Overlays */}
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Heatmap Overlays
                </p>
                <div className="flex flex-col gap-1">
                  <LayerRow
                    color="#EF4444"
                    label="Encroachment Heatmap"
                    dash={false}
                    active={layers.encroachment}
                    onToggle={() => toggleLayer("encroachment")}
                  />
                  <LayerRow
                    color="#EAB308"
                    label="NDVI Vegetation Loss"
                    dash={false}
                    active={layers.ndvi}
                    onToggle={() => toggleLayer("ndvi")}
                  />
                  <LayerRow
                    color="#06B6D4"
                    label="Flood Risk Model"
                    dash={false}
                    active={layers.flood}
                    onToggle={() => toggleLayer("flood")}
                  />
                  <LayerRow
                    color="#A855F7"
                    label="Change Detection"
                    dash={false}
                    active={layers.change}
                    onToggle={() => toggleLayer("change")}
                  />
                </div>
              </div>

              <div className="border-t border-slate-800/70" />

              {/* Map Base Layers */}
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Base GIS Layers
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
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="mt-auto pt-2 border-t border-slate-800/70">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"
                style={{ animation: "livePulse 2s cubic-bezier(0,0,0.2,1) infinite" }}
              />
              <span>Live telemetry · 15s refresh</span>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}