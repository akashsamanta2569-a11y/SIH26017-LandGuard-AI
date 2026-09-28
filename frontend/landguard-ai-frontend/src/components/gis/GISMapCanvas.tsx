import { useState, useRef } from "react";
import {
  AimOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
  CompressOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  SatelliteScanOverlay,
  DistrictPulse,
  HeatmapLegend,
  MiniMapNavigator,
  ReplayScanner,
  REPLAY_STAGES,
  type ReplayStage,
} from "./index";

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
  label: string;
  district: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
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

// ─── Constants & Clean Government Palette ─────────────────────────────────────

const SEVERITY_CONFIG: Record<
  MarkerSeverity,
  { dot: string; text: string; bg: string; border: string; label: string }
> = {
  critical: {
    dot: "#DC2626",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    label: "Critical Risk",
  },
  high: {
    dot: "#F59E0B",
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    label: "High Priority",
  },
  moderate: {
    dot: "#0F766E",
    text: "text-teal-700 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    border: "border-teal-200 dark:border-teal-800",
    label: "Moderate Monitoring",
  },
};

// ─── 18 Detection Hotspots across West Bengal (SIH26017) ───────────────────────

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

// ─── AI Detection Polygons ────────────────────────────────────────────────────

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

// ─── West Bengal Cartographic SVG Paths ───────────────────────────────────────

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

interface GISMapCanvasProps {
  theme?: "dark" | "light";
  selectedDistrict?: string;
  onSelectDistrict?: (district: string) => void;
}

export default function GISMapCanvas({
  theme = "light",
  selectedDistrict,
  onSelectDistrict,
}: GISMapCanvasProps) {
  const isDark = theme === "dark";
  const [selectedId, setSelectedId] = useState<string | null>("mk1");
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  // GIS Replay & Tactical Overlays
  const [showReplay, setShowReplay] = useState(false);
  const [replayStage, setReplayStage] = useState<ReplayStage>(REPLAY_STAGES[0]);
  const [replayStageIndex, setReplayStageIndex] = useState(0);
  const [showScanner, setShowScanner] = useState(true);
  const [showPulse, setShowPulse] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showLegend, setShowLegend] = useState(false);

  // 4 Raster heat overlay layers
  const [layers, setLayers] = useState({
    encroachment: true,
    ndvi: true,
    flood: false,
    change: true,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const SVG_W = 320;
  const SVG_H = 440;

  const selected = MARKERS.find((m) => m.id === selectedId) ?? null;
  const activeTooltip = hoveredMarker || selected;

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const critCount = MARKERS.filter((m) => m.severity === "critical").length;
  const highCount = MARKERS.filter((m) => m.severity === "high").length;
  const modCount = MARKERS.filter((m) => m.severity === "moderate").length;

  return (
    <div
      className={`relative w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
        fullscreen ? "fixed inset-4 z-50 shadow-2xl" : ""
      }`}
      style={{
        backgroundColor: isDark ? "#111C2E" : "#FFFFFF",
        borderColor: isDark ? "#1E293B" : "#E2E8F0",
        boxShadow: isDark
          ? "0 4px 6px -1px rgba(0,0,0,0.3)"
          : "0 1px 3px 0 rgba(0,0,0,0.05)",
      }}
    >
      {/* ── Top Header Toolbar ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b"
        style={{
          borderColor: isDark ? "#1E293B" : "#E2E8F0",
          backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
            <AimOutlined className="text-teal-700 dark:text-teal-300" style={{ fontSize: 16 }} />
          </div>
          <div>
            <h2
              className="text-sm font-bold tracking-tight leading-none"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              Geospatial Anomaly Map · West Bengal
            </h2>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Sentinel-2 MSI · Cartosat-3 Composite · {MARKERS.length} Anomaly Zones Inferred
            </p>
          </div>
        </div>

        {/* Severity Summary Chips & Fullscreen */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800">
            {critCount} Critical
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
            {highCount} High
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800">
            {modCount} Moderate
          </span>

          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {fullscreen ? <CompressOutlined /> : <ExpandOutlined />}
          </button>
        </div>
      </div>

      {/* ── Sub-toolbar: Active Layer Filters ── */}
      <div
        className="flex items-center gap-2 px-5 py-2 border-b overflow-x-auto text-xs"
        style={{
          borderColor: isDark ? "#1E293B" : "#F1F5F9",
          backgroundColor: isDark ? "#111C2E" : "#FFFFFF",
        }}
      >
        <span className="text-[11px] font-semibold text-slate-500 mr-1 shrink-0">
          Layers:
        </span>
        <button
          type="button"
          onClick={() => toggleLayer("encroachment")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer shrink-0 ${
            layers.encroachment
              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
              : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700"
          }`}
        >
          ● Encroachment Heatmap
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("ndvi")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer shrink-0 ${
            layers.ndvi
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700"
          }`}
        >
          ● NDVI Canopy Loss
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("flood")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer shrink-0 ${
            layers.flood
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
              : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700"
          }`}
        >
          ● Flood Inundation Model
        </button>
        <button
          type="button"
          onClick={() => toggleLayer("change")}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer shrink-0 ${
            layers.change
              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
              : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700"
          }`}
        >
          ● Temporal Change
        </button>

        {/* GIS Tactical & Replay Controls */}
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowReplay((prev) => !prev)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showReplay
                ? "bg-[#00F5C3]/20 text-[#00F5C3] border-[#00F5C3]/60 shadow-[0_0_12px_rgba(0,245,195,0.3)]"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
            }`}
          >
            <span>▶ Temporal Replay (Jun → Sep 2026)</span>
            {showReplay && <span className="h-1.5 w-1.5 rounded-full bg-[#00F5C3] animate-ping" />}
          </button>
          <button
            type="button"
            onClick={() => setShowScanner((prev) => !prev)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              showScanner ? "bg-teal-500/20 text-teal-300 border-teal-500/40" : "bg-slate-800/40 text-slate-400 border-slate-700"
            }`}
            title="Toggle Sentinel-2 Scan Beam"
          >
            Scan Beam
          </button>
          <button
            type="button"
            onClick={() => setShowPulse((prev) => !prev)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              showPulse ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-slate-800/40 text-slate-400 border-slate-700"
            }`}
            title="Toggle Critical District Pulse Rings"
          >
            District Pulse
          </button>
          <button
            type="button"
            onClick={() => setShowMiniMap((prev) => !prev)}
            className={`hidden sm:inline-block px-2 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              showMiniMap ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-800/40 text-slate-400 border-slate-700"
            }`}
            title="Toggle WB Minimap Navigator"
          >
            Minimap
          </button>
          <button
            type="button"
            onClick={() => setShowLegend((prev) => !prev)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              showLegend ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-slate-800/40 text-slate-400 border-slate-700"
            }`}
            title="Toggle Heatmap Risk Legend"
          >
            Legend
          </button>
        </div>
      </div>

      {/* Replay Multi-Temporal Progression Scanner */}
      {showReplay && (
        <div className="p-3 bg-[#050C18]/95 border-b border-[#00F5C3]/30">
          <ReplayScanner
            onStageChange={(stage, index) => {
              setReplayStage(stage);
              setReplayStageIndex(index);
            }}
          />
        </div>
      )}

      {/* ── Main Map Canvas Viewport ── */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden"
        style={{ backgroundColor: isDark ? "#0A0F1D" : "#F8FAFC" }}
      >
        {/* SVG Cartographic Renderer */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.25s ease-out",
          }}
        >
          <defs>
            {/* Gradients for Heatmaps */}
            <radialGradient id="encroachGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#EA580C" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="ndviLossGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EAB308" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#16A34A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="floodRiskGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#2563EB" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="changeDetectGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#0F766E" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#7E22CE" stopOpacity="0" />
            </radialGradient>

            <clipPath id="wbClip">
              <path d={WB_BOUNDARY} />
            </clipPath>
          </defs>

          {/* Coordinate grid lines */}
          {Array.from({ length: 18 }, (_, i) => i * 25).map((y) => (
            <line
              key={`glat-${y}`}
              x1={0}
              y1={y}
              x2={SVG_W}
              y2={y}
              stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)"}
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: 13 }, (_, i) => i * 25).map((x) => (
            <line
              key={`glon-${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={SVG_H}
              stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)"}
              strokeWidth={0.5}
            />
          ))}

          {/* West Bengal State Silhouette */}
          <path
            d={WB_BOUNDARY}
            fill={isDark ? "rgba(15, 118, 110, 0.12)" : "rgba(240, 253, 250, 0.9)"}
            stroke={isDark ? "#0F766E" : "#0D9488"}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />

          {/* District Internal Division Lines */}
          {DISTRICT_LINES.map((d, i) => (
            <path
              key={`dline-${i}`}
              d={d}
              fill="none"
              stroke={isDark ? "rgba(148, 163, 184, 0.25)" : "rgba(148, 163, 184, 0.45)"}
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
          ))}

          {/* Hooghly River */}
          <path
            d={HOOGHLY_RIVER}
            fill="none"
            stroke="#0284C7"
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.85}
          />
          <text
            x={106}
            y={280}
            fontSize={5.5}
            fill="#0284C7"
            fontFamily="Inter, sans-serif"
            fontWeight={600}
            transform="rotate(-8,106,280)"
          >
            Hooghly River
          </text>

          {/* Metro Corridor Alignment */}
          <path
            d={METRO_CORRIDOR}
            fill="none"
            stroke="#7C3AED"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray="5 2"
          />

          {/* Siliguri Corridor */}
          <path
            d={SILIGURI_CORRIDOR}
            fill="none"
            stroke="#D97706"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray="4 2"
          />

          {/* Sundarbans Coast */}
          <path
            d={SUNDARBANS_COAST}
            fill="none"
            stroke="#0D9488"
            strokeWidth={1.5}
          />

          {/* ── Active Raster Overlays ── */}
          {layers.encroachment && (
            <g clipPath="url(#wbClip)">
              <circle cx={155} cy={232} r={80} fill="url(#encroachGrad)" />
              <circle cx={215} cy={185} r={55} fill="url(#encroachGrad)" />
              <circle cx={95} cy={195} r={65} fill="url(#encroachGrad)" />
              <circle cx={145} cy={355} r={68} fill="url(#encroachGrad)" />
            </g>
          )}

          {layers.ndvi && (
            <g
              clipPath="url(#wbClip)"
              opacity={showReplay ? replayStage.ndviOpacity : 1}
              style={{ transition: "opacity 0.6s ease-in-out" }}
            >
              <circle cx={185} cy={334} r={75} fill="url(#ndviLossGrad)" />
              <circle cx={92} cy={123} r={55} fill="url(#ndviLossGrad)" />
              <circle cx={64} cy={211} r={60} fill="url(#ndviLossGrad)" />
              <circle cx={192} cy={57} r={50} fill="url(#ndviLossGrad)" />
            </g>
          )}

          {layers.flood && (
            <g clipPath="url(#wbClip)">
              <ellipse cx={135} cy={280} rx={45} ry={110} fill="url(#floodRiskGrad)" />
              <circle cx={147} cy={370} r={80} fill="url(#floodRiskGrad)" />
              <circle cx={204} cy={97} r={48} fill="url(#floodRiskGrad)" />
            </g>
          )}

          {layers.change && (
            <g clipPath="url(#wbClip)">
              <circle cx={185} cy={202} r={60} fill="url(#changeDetectGrad)" />
              <circle cx={121} cy={167} r={52} fill="url(#changeDetectGrad)" />
              <circle cx={86} cy={299} r={58} fill="url(#changeDetectGrad)" />
              <circle cx={211} cy={44} r={45} fill="url(#changeDetectGrad)" />
            </g>
          )}

          {/* ── Detection Polygons with Replay Expansion ── */}
          {DETECTION_POLYGONS.map((poly) => {
            const isIllegal = poly.category === "Illegal Structure";
            if (showReplay && isIllegal && replayStageIndex === 0) {
              return null; // Baseline June 2026: no illegal structures detected yet
            }

            const scale = showReplay && isIllegal ? replayStage.polygonScale : 1;
            const strokeCol =
              poly.severity === "critical"
                ? "#DC2626"
                : poly.severity === "high"
                ? "#D97706"
                : "#0F766E";
            const fillCol =
              poly.severity === "critical"
                ? `rgba(220, 38, 38, ${showReplay ? 0.25 * scale : 0.2})`
                : poly.severity === "high"
                ? `rgba(217, 119, 6, ${showReplay ? 0.25 * scale : 0.2})`
                : `rgba(15, 118, 110, ${showReplay ? 0.25 * scale : 0.2})`;

            return (
              <polygon
                key={poly.id}
                points={poly.points}
                fill={fillCol}
                stroke={strokeCol}
                strokeWidth={showReplay && isIllegal ? 1.5 * scale : 1.2}
                strokeDasharray="3 1.5"
                style={{
                  transformOrigin: "center center",
                  transform: showReplay && isIllegal ? `scale(${0.7 + 0.3 * scale})` : undefined,
                  transition: "all 0.5s ease-out",
                }}
              />
            );
          })}

          {/* Expanding Illegal Construction Structures during Replay */}
          {showReplay && replayStageIndex >= 1 && (
            <g className="transition-all duration-500">
              <rect
                x={146 - 6 * replayStage.polygonScale}
                y={348 - 5 * replayStage.polygonScale}
                width={14 * replayStage.polygonScale}
                height={10 * replayStage.polygonScale}
                fill="#DC2626"
                fillOpacity={0.7}
                stroke="#FF4D6D"
                strokeWidth={1.2}
                className={replayStageIndex === 3 ? "animate-pulse" : ""}
              />
              <rect
                x={210 - 7 * replayStage.polygonScale}
                y={180 - 5 * replayStage.polygonScale}
                width={16 * replayStage.polygonScale}
                height={11 * replayStage.polygonScale}
                fill="#DC2626"
                fillOpacity={0.7}
                stroke="#FF4D6D"
                strokeWidth={1.2}
                className={replayStageIndex === 3 ? "animate-pulse" : ""}
              />
            </g>
          )}

          {/* ── 18 Anomaly Marker Pins ── */}
          {MARKERS.map((m) => {
            const cx = (m.x / 100) * SVG_W;
            const cy = (m.y / 100) * SVG_H;
            const isSelected = selectedId === m.id;
            const col = SEVERITY_CONFIG[m.severity];

            return (
              <g
                key={m.id}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => setSelectedId((prev) => (prev === m.id ? null : m.id))}
                onMouseEnter={() => setHoveredMarker(m)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {/* Selection Ring */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={9}
                    fill="none"
                    stroke={col.dot}
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                  />
                )}

                {/* Pin Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 5.5 : 4}
                  fill={col.dot}
                  stroke="#FFFFFF"
                  strokeWidth={1.2}
                />

                {/* Marker Code Label */}
                <text
                  x={cx + 6}
                  y={cy - 5}
                  fontSize={5.5}
                  fill={isDark ? "#F8FAFC" : "#0F172A"}
                  fontFamily="Inter, sans-serif"
                  fontWeight={isSelected ? 700 : 500}
                >
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Sentinel-2 Laser Scan Beam Overlay — Always above map canvas */}
        {(showReplay || showScanner) && (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            <SatelliteScanOverlay
              label="Sentinel-2 MSI"
              sublabel={showReplay ? `${replayStage.month} • ${replayStage.label}` : "10m GSD • LIVE SCAN"}
            />
          </div>
        )}

        {/* Critical District Pulse Rings with Tooltips */}
        {showPulse && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            <DistrictPulse
              activeDistrictId={selectedDistrict || selected?.district}
              onSelectDistrict={(dist) => {
                if (onSelectDistrict) onSelectDistrict(dist.name);
              }}
            />
          </div>
        )}

        {/* ── Active Intelligence Tooltip (Material-3 Card) ── */}
        {activeTooltip && (
          <div
            className="absolute top-4 left-4 z-30 w-72 rounded-2xl p-4 border shadow-lg transition-all animate-fadeIn"
            style={{
              backgroundColor: isDark ? "#111C2E" : "#FFFFFF",
              borderColor: isDark ? "#1E293B" : "#E2E8F0",
              color: isDark ? "#F8FAFC" : "#0F172A",
            }}
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs">{activeTooltip.label}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    SEVERITY_CONFIG[activeTooltip.severity].bg
                  } ${SEVERITY_CONFIG[activeTooltip.severity].text} ${
                    SEVERITY_CONFIG[activeTooltip.severity].border
                  }`}
                >
                  {SEVERITY_CONFIG[activeTooltip.severity].label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setHoveredMarker(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <CloseOutlined style={{ fontSize: 10 }} />
              </button>
            </div>

            <p className="text-xs font-semibold mt-2">{activeTooltip.district}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {activeTooltip.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[10px] border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block font-medium">Affected Area</span>
                <span className="font-semibold">{activeTooltip.affectedArea}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Sensor Feed</span>
                <span className="font-semibold">{activeTooltip.satelliteSource}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-400 block font-medium">Land Class</span>
                <span className="font-semibold truncate block">{activeTooltip.landClass}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">AI Inferred Confidence</span>
              <span className="font-bold text-teal-700 dark:text-teal-400">
                {showReplay ? replayStage.confidence : activeTooltip.confidence}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-300"
                style={{ width: `${showReplay ? replayStage.confidence : activeTooltip.confidence}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Zoom & Reset Controls ── */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2.2))}
            title="Zoom In"
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center shadow cursor-pointer transition-all"
          >
            <ZoomInOutlined style={{ fontSize: 13 }} />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            title="Zoom Out"
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center shadow cursor-pointer transition-all"
          >
            <ZoomOutOutlined style={{ fontSize: 13 }} />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setSelectedId(null);
            }}
            title="Reset Map"
            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center shadow cursor-pointer transition-all"
          >
            <ReloadOutlined style={{ fontSize: 12 }} />
          </button>
        </div>

        {/* ── Floating MiniMap Navigator in Bottom Right ── */}
        {showMiniMap && (
          <div className="absolute bottom-4 right-4 z-30 pointer-events-auto shadow-2xl">
            <MiniMapNavigator
              currentDistrict={selectedDistrict || selected?.district || "Howrah"}
              onSelectDistrict={(name) => {
                if (onSelectDistrict) onSelectDistrict(name);
              }}
            />
          </div>
        )}

        {/* ── Heatmap Legend in Bottom Left ── */}
        {showLegend && (
          <div className="absolute bottom-14 left-4 z-30 pointer-events-auto max-w-xs">
            <HeatmapLegend showNdvi={layers.ndvi} />
          </div>
        )}

        {/* ── Coordinate & Timeline HUD Badge in Bottom Left ── */}
        <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 text-[11px] font-mono shadow-sm flex items-center gap-2 select-none">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          <span className="text-slate-700 dark:text-slate-300">
            {showReplay ? (
              <span className="text-cyan-600 dark:text-cyan-400 font-bold mr-1">
                [{replayStage.month} &bull; {replayStage.label}]
              </span>
            ) : null}
            {activeTooltip
              ? `${activeTooltip.lat.toFixed(4)}°N, ${activeTooltip.lon.toFixed(4)}°E · ${activeTooltip.district}`
              : "22.5726°N, 88.3639°E · West Bengal State"}
          </span>
        </div>
      </div>
    </div>
  );
}