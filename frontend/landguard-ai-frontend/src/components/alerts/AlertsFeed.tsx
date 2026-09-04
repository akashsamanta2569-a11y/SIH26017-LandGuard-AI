import {
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  AimOutlined,
  RightOutlined,
  FilterOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type AlertStatus = "ACTIVE" | "INVESTIGATING" | "VERIFIED" | "RESOLVED";

export interface IncidentAlert {
  id: string;
  code: string;
  title: string;
  category:
    | "Illegal Construction"
    | "Encroachment"
    | "Vegetation Clearing"
    | "Boundary Deviation"
    | "Water Body Infill";
  severity: Severity;
  status: AlertStatus;
  district: string;
  mouza: string;
  jlNo: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
    khatianNo: string;
    plotNo: string;
  };
  timestamp: string;
  timeAgo: string;
  confidence: number;
  modelBreakdown: {
    yoloV8: number;
    resnetSiamese: number;
    spectralAnomaly: number;
  };
  affectedAreaSqM: number;
  satelliteSource: string;
  ndviDelta: number;
  spectralAnomaly: string;
  aiModel: string;
  description: string;
  evidenceTags: string[];
  hotspot: { x: number; y: number }; // SVG map percentage coordinates
  historyTimeline: {
    time: string;
    event: string;
    source: string;
  }[];
}

// ─── 8 Realistic West Bengal Sample Incidents ─────────────────────────────────

export const SAMPLE_ALERTS: IncidentAlert[] = [
  {
    id: "ALT-01",
    code: "ALT-2026-0841",
    title: "Unauthorized Reinforced Concrete Footings on Protected Wetland",
    category: "Illegal Construction",
    severity: "CRITICAL",
    status: "ACTIVE",
    district: "South 24 Parganas",
    mouza: "Hatgachha",
    jlNo: "JL-84",
    location: "East Kolkata Wetlands Ramsar Site, Sector V Periphery",
    coordinates: {
      lat: 22.5284,
      lng: 88.4312,
      khatianNo: "KH-9824",
      plotNo: "PL-104/A",
    },
    timestamp: "04 Sep 2026, 17:28 IST",
    timeAgo: "4 mins ago",
    confidence: 98.6,
    modelBreakdown: {
      yoloV8: 99.1,
      resnetSiamese: 98.2,
      spectralAnomaly: 98.5,
    },
    affectedAreaSqM: 1420,
    satelliteSource: "Sentinel-2 MSI (10m) + PlanetScope (3m)",
    ndviDelta: -0.42,
    spectralAnomaly: "High NIR drop / Concrete signature rise (+44%)",
    aiModel: "YOLOv8x-OBB + ResNet50-Siamese Change Net",
    description:
      "Rapid foundation laying detected within ecologically sensitive Ramsar zone buffer. Heavy equipment and perimeter barricades identified with high optical contrast against 14-day baseline imagery.",
    evidenceTags: [
      "Ramsar Zone",
      "Excavator Detected",
      "NDVI Loss -42%",
      "Unregistered Khatian",
    ],
    hotspot: { x: 58, y: 64 },
    historyTimeline: [
      {
        time: "17:28:12 IST",
        event: "Sentinel-2 spectral change flag triggered",
        source: "Orbital Downlink",
      },
      {
        time: "17:28:45 IST",
        event: "YOLOv8x verified structural footings (98.6%)",
        source: "AI Inference Engine",
      },
      {
        time: "17:29:10 IST",
        event: "Critical alert dispatched to District Magistrate portal",
        source: "LandGuard Bot",
      },
    ],
  },
  {
    id: "ALT-02",
    code: "ALT-2026-0839",
    title: "Heavy Excavation & Perimeter Berm in Railway Freight Buffer",
    category: "Encroachment",
    severity: "CRITICAL",
    status: "ACTIVE",
    district: "Howrah",
    mouza: "Dankuni South",
    jlNo: "JL-32",
    location: "Dankuni Dedicated Freight Corridor Right-of-Way, Km 14.2",
    coordinates: {
      lat: 22.6841,
      lng: 88.291,
      khatianNo: "KH-4412",
      plotNo: "PL-88/C",
    },
    timestamp: "04 Sep 2026, 17:14 IST",
    timeAgo: "18 mins ago",
    confidence: 96.4,
    modelBreakdown: {
      yoloV8: 97.0,
      resnetSiamese: 95.8,
      spectralAnomaly: 96.4,
    },
    affectedAreaSqM: 2850,
    satelliteSource: "Cartosat-3 Pan (0.28m) + Sentinel-2",
    ndviDelta: -0.38,
    spectralAnomaly: "Bare soil exposure / Earthmoving signature (+62%)",
    aiModel: "YOLOv8x-OBB Infrastructure Guard",
    description:
      "Earthwork excavation encroaching 24 meters into designated statutory railway security easement. Two heavy earth-movers detected alongside pre-cast fencing.",
    evidenceTags: [
      "Railway ROW",
      "Earthworks Encroachment",
      "Cartosat 0.28m",
      "High Priority Corridor",
    ],
    hotspot: { x: 52, y: 58 },
    historyTimeline: [
      {
        time: "17:14:02 IST",
        event: "Cartosat-3 Pan pass auto-ingested",
        source: "ISRO Ground Station",
      },
      {
        time: "17:14:50 IST",
        event: "Right-of-Way breach detected (+24m encroachment)",
        source: "Spatial Vector Engine",
      },
      {
        time: "17:15:30 IST",
        event: "Notice flagged for Eastern Railway Land Cell",
        source: "Automated Dispatch",
      },
    ],
  },
  {
    id: "ALT-03",
    code: "ALT-2026-0835",
    title: "Rapid Mangrove Canopy Clearing Along Tidal Estuary Buffer",
    category: "Vegetation Clearing",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    district: "North 24 Parganas",
    mouza: "Hingalganj Coastal",
    jlNo: "JL-112",
    location: "Hingalganj Coastal Zone Buffer, Sundarbans Interface",
    coordinates: {
      lat: 22.4678,
      lng: 88.9872,
      khatianNo: "KH-1102",
      plotNo: "PL-09",
    },
    timestamp: "04 Sep 2026, 16:50 IST",
    timeAgo: "42 mins ago",
    confidence: 94.8,
    modelBreakdown: {
      yoloV8: 93.5,
      resnetSiamese: 96.0,
      spectralAnomaly: 94.9,
    },
    affectedAreaSqM: 4120,
    satelliteSource: "Sentinel-2 MSI (10m) Multi-Spectral",
    ndviDelta: -0.68,
    spectralAnomaly: "Severe NDVI collapse from 0.76 to 0.08",
    aiModel: "Bi-Temporal Siamese UNet + Sentinel-2",
    description:
      "Aggressive clearance of dense tidal mangrove vegetation. High probability of illegal commercial aquaculture bund creation in protected coastal regulation zone (CRZ-I).",
    evidenceTags: [
      "CRZ-I Ecological Zone",
      "Mangrove Loss",
      "Bund Formation",
      "Forest Dept Alert",
    ],
    hotspot: { x: 74, y: 67 },
    historyTimeline: [
      {
        time: "16:50:11 IST",
        event: "Bi-temporal change detection registered -0.68 NDVI",
        source: "Sentinel Ingestion",
      },
      {
        time: "16:51:20 IST",
        event: "CRZ-I violation polygon generated",
        source: "GIS Vector System",
      },
      {
        time: "16:52:00 IST",
        event: "Forest Beat Officer assigned for on-site inspection",
        source: "DM Dashboard",
      },
    ],
  },
  {
    id: "ALT-04",
    code: "ALT-2026-0828",
    title: "Unsanctioned Commercial Warehouse Expansion On Agri Land",
    category: "Illegal Construction",
    severity: "HIGH",
    status: "ACTIVE",
    district: "Hooghly",
    mouza: "Dankuni Industrial",
    jlNo: "JL-45",
    location: "NH-19 Frontage, Dankuni Industrial Corridor",
    coordinates: {
      lat: 22.7112,
      lng: 88.3145,
      khatianNo: "KH-3091",
      plotNo: "PL-204",
    },
    timestamp: "04 Sep 2026, 16:15 IST",
    timeAgo: "1 hr 15m ago",
    confidence: 91.5,
    modelBreakdown: {
      yoloV8: 92.4,
      resnetSiamese: 90.6,
      spectralAnomaly: 91.5,
    },
    affectedAreaSqM: 890,
    satelliteSource: "Sentinel-2 MSI + PlanetScope",
    ndviDelta: -0.29,
    spectralAnomaly: "Metallic blue roof panel spectral reflectance",
    aiModel: "YOLOv8x-OBB Roof Net",
    description:
      "New prefabricated corrugated steel superstructure detected on prime agricultural parcel without conversion clearance (mutation pending under Section 4C WBLR Act).",
    evidenceTags: [
      "Agricultural Parcel",
      "Tin Roof Reflectance",
      "Section 4C Breach",
      "NH-19 Frontage",
    ],
    hotspot: { x: 50, y: 50 },
    historyTimeline: [
      {
        time: "16:15:33 IST",
        event: "Structural roof spectral signature identified",
        source: "Sensor Array",
      },
      {
        time: "16:16:40 IST",
        event: "L&LR revenue registry cross-referenced: Sali land",
        source: "Banglarbhumi API",
      },
      {
        time: "16:18:00 IST",
        event: "Notice draft queued for BDO Hooghly",
        source: "Legal Cell",
      },
    ],
  },
  {
    id: "ALT-05",
    code: "ALT-2026-0822",
    title: "Perimeter Boundary Wall Encroachment on Vested Plot",
    category: "Boundary Deviation",
    severity: "HIGH",
    status: "INVESTIGATING",
    district: "Paschim Bardhaman",
    mouza: "Kalyanpur",
    jlNo: "JL-19",
    location: "Asansol Industrial Growth Center, Plot Block D",
    coordinates: {
      lat: 23.6889,
      lng: 86.9661,
      khatianNo: "KH-7740",
      plotNo: "PL-512",
    },
    timestamp: "04 Sep 2026, 15:30 IST",
    timeAgo: "2 hrs ago",
    confidence: 89.4,
    modelBreakdown: {
      yoloV8: 88.0,
      resnetSiamese: 90.8,
      spectralAnomaly: 89.4,
    },
    affectedAreaSqM: 640,
    satelliteSource: "Cartosat-3 Pan (0.28m)",
    ndviDelta: -0.15,
    spectralAnomaly: "Linear masonry contrast against state vested plot",
    aiModel: "Edge-Enhanced Linear Feature Extractor",
    description:
      "Masonry compound wall extended 18 meters past authorized boundary markers into adjacent state-owned vested land parcel KH-7740.",
    evidenceTags: [
      "State Vested Land",
      "Masonry Boundary",
      "18m Deviation",
      "High Precision 0.28m",
    ],
    hotspot: { x: 28, y: 44 },
    historyTimeline: [
      {
        time: "15:30:19 IST",
        event: "Linear boundary shift detected by EdgeNet",
        source: "Cadastral Matcher",
      },
      {
        time: "15:32:00 IST",
        event: "Plot overlay deviation confirmed > 15%",
        source: "GIS Cadastre",
      },
    ],
  },
  {
    id: "ALT-06",
    code: "ALT-2026-0817",
    title: "Natural Drainage Canal Infill & Unauthorized Earth Filling",
    category: "Water Body Infill",
    severity: "HIGH",
    status: "ACTIVE",
    district: "Nadia",
    mouza: "Kalyani Canal Link",
    jlNo: "JL-77",
    location: "Kalyani Canal Drainage Basin, Sector 3 Connector",
    coordinates: {
      lat: 22.975,
      lng: 88.4344,
      khatianNo: "KH-5118",
      plotNo: "PL-77",
    },
    timestamp: "04 Sep 2026, 14:20 IST",
    timeAgo: "3 hrs ago",
    confidence: 87.9,
    modelBreakdown: {
      yoloV8: 86.5,
      resnetSiamese: 89.3,
      spectralAnomaly: 87.9,
    },
    affectedAreaSqM: 1180,
    satelliteSource: "Sentinel-2 MSI (10m)",
    ndviDelta: -0.31,
    spectralAnomaly: "MNDWI water index plummet from +0.62 to -0.18",
    aiModel: "MNDWI Hydro-Anomaly Network",
    description:
      "Deliberate dumping of silt and construction debris into government irrigation canal. Threat of flash waterlogging across surrounding 25 hectares.",
    evidenceTags: [
      "Drainage Canal",
      "MNDWI Drop",
      "Flood Hazard Risk",
      "Irrigation Dept Alert",
    ],
    hotspot: { x: 57, y: 46 },
    historyTimeline: [
      {
        time: "14:20:05 IST",
        event: "MNDWI water signature disappeared across 1180m²",
        source: "Hydro Sentinel",
      },
      {
        time: "14:22:15 IST",
        event: "Flood risk flagged to Irrigation & Waterways Directorate",
        source: "Emergency Dispatch",
      },
    ],
  },
  {
    id: "ALT-07",
    code: "ALT-2026-0810",
    title: "Temporary Commercial Shed On Irrigation Canal Embankment",
    category: "Encroachment",
    severity: "MEDIUM",
    status: "INVESTIGATING",
    district: "Murshidabad",
    mouza: "Berhampore North",
    jlNo: "JL-14",
    location: "Berhampore Bypass Canal Linkage Road",
    coordinates: {
      lat: 24.1012,
      lng: 88.2486,
      khatianNo: "KH-2190",
      plotNo: "PL-14",
    },
    timestamp: "04 Sep 2026, 12:10 IST",
    timeAgo: "5 hrs ago",
    confidence: 83.2,
    modelBreakdown: {
      yoloV8: 84.1,
      resnetSiamese: 82.3,
      spectralAnomaly: 83.2,
    },
    affectedAreaSqM: 340,
    satelliteSource: "Sentinel-2 MSI (10m)",
    ndviDelta: -0.19,
    spectralAnomaly: "Blue tarpaulin & timber shadow pattern",
    aiModel: "YOLOv8x Temporary Structure Detector",
    description:
      "Temporary commercial vending stalls and timber frames erected along public canal embankment right-of-way.",
    evidenceTags: [
      "Canal Embankment",
      "Temporary Shed",
      "Tarpaulin Signature",
      "Local Body Escalation",
    ],
    hotspot: { x: 53, y: 28 },
    historyTimeline: [
      {
        time: "12:10:44 IST",
        event: "Tarpaulin spectral anomaly identified",
        source: "Sentinel-2 MSI",
      },
      {
        time: "12:13:00 IST",
        event: "Municipality enforcement squad notified",
        source: "Civic Portal",
      },
    ],
  },
  {
    id: "ALT-08",
    code: "ALT-2026-0803",
    title: "Minor Agricultural Boundary Hedgerow Displacement",
    category: "Boundary Deviation",
    severity: "LOW",
    status: "VERIFIED",
    district: "Purba Medinipur",
    mouza: "Tamluk Agrarian",
    jlNo: "JL-52",
    location: "Tamluk Sub-division Agricultural Corridor",
    coordinates: {
      lat: 22.2986,
      lng: 87.9258,
      khatianNo: "KH-6302",
      plotNo: "PL-38",
    },
    timestamp: "04 Sep 2026, 10:15 IST",
    timeAgo: "7 hrs ago",
    confidence: 79.1,
    modelBreakdown: {
      yoloV8: 80.0,
      resnetSiamese: 78.2,
      spectralAnomaly: 79.1,
    },
    affectedAreaSqM: 195,
    satelliteSource: "Sentinel-2 MSI (10m)",
    ndviDelta: -0.11,
    spectralAnomaly: "Marginal field boundary hedge realignment",
    aiModel: "Cadastral Edge Boundary Net",
    description:
      "Minor realignment of natural vegetation boundary between adjacent private agricultural plots. Low risk of systemic encroachment.",
    evidenceTags: [
      "Agricultural Parcel",
      "Low Deviation",
      "Private Boundary",
      "Monitoring Only",
    ],
    hotspot: { x: 44, y: 72 },
    historyTimeline: [
      {
        time: "10:15:20 IST",
        event: "Sub-pixel edge variation flagged",
        source: "Cadastral Matcher",
      },
      {
        time: "10:18:00 IST",
        event: "Categorized as low-priority boundary drift",
        source: "AI Classifier",
      },
    ],
  },
];

// ─── Severity Visual Configuration ───────────────────────────────────────────

export const SEVERITY_THEME: Record<
  Severity,
  {
    color: string;
    rgb: string;
    bg: string;
    border: string;
    badgeBg: string;
    label: string;
  }
> = {
  CRITICAL: {
    color: "#EF4444",
    rgb: "239,68,68",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.28)",
    badgeBg: "rgba(239,68,68,0.12)",
    label: "CRITICAL",
  },
  HIGH: {
    color: "#F59E0B",
    rgb: "245,158,11",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.28)",
    badgeBg: "rgba(245,158,11,0.12)",
    label: "HIGH RISK",
  },
  MEDIUM: {
    color: "#10B981",
    rgb: "16,185,129",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.24)",
    badgeBg: "rgba(16,185,129,0.12)",
    label: "MODERATE",
  },
  LOW: {
    color: "#10B981",
    rgb: "16,185,129",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.2)",
    badgeBg: "rgba(16,185,129,0.1)",
    label: "LOW RISK",
  },
};

export const STATUS_THEME: Record<
  AlertStatus,
  { color: string; bg: string; label: string }
> = {
  ACTIVE: {
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    label: "ACTIVE",
  },
  INVESTIGATING: {
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    label: "INVESTIGATING",
  },
  VERIFIED: {
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    label: "VERIFIED",
  },
  RESOLVED: {
    color: "#94A3B8",
    bg: "rgba(148,163,184,0.1)",
    label: "RESOLVED",
  },
};

// ─── AlertsFeed Props ─────────────────────────────────────────────────────────

interface AlertsFeedProps {
  alerts: IncidentAlert[];
  selectedAlertId?: string;
  onSelectAlert: (alert: IncidentAlert) => void;
  activeSeverityFilter: Severity | "ALL";
  onChangeSeverityFilter: (filter: Severity | "ALL") => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
}

export default function AlertsFeed({
  alerts,
  selectedAlertId,
  onSelectAlert,
  activeSeverityFilter,
  onChangeSeverityFilter,
  searchQuery,
  onChangeSearchQuery,
}: AlertsFeedProps) {
  // Counts
  const totalCount = alerts.length;
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const highCount = alerts.filter((a) => a.severity === "HIGH").length;
  const lowMedCount = alerts.filter(
    (a) => a.severity === "MEDIUM" || a.severity === "LOW"
  ).length;

  return (
    <div
      className="relative rounded-[24px] p-5 sm:p-6 flex flex-col transition-all duration-300 overflow-hidden"
      style={{
        background: "rgba(15, 23, 42, 0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.04), 0 20px 48px -12px rgba(0,0,0,0.6)",
      }}
    >
      {/* Ambient top light */}
      <div
        className="pointer-events-none absolute -top-16 left-1/4 w-72 h-32 rounded-full opacity-18"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
        }}
      />

      {/* ── Section Header ── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.28)",
              boxShadow: "0 0 14px rgba(239, 68, 68, 0.14)",
            }}
          >
            <AlertOutlined style={{ color: "#EF4444", fontSize: 18 }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 tracking-tight">
                Live Incident Feed
              </h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                STREAMING
              </span>
            </div>
            <p className="text-xs text-slate-400">
              8 verified satellite incidents queued • Sorted by detection recency
            </p>
          </div>
        </div>

        {/* Counter Tag */}
        <div className="flex items-center gap-1.5 self-start md:self-auto text-xs font-mono text-slate-300 px-3 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-emerald-400 font-bold">{alerts.length}</span>
          <span>incidents listed</span>
        </div>
      </div>

      {/* ── Search Input & Severity Filter Chips (Dashboard Style) ── */}
      <div className="relative z-10 pt-4 pb-3 space-y-3">
        {/* Search Box */}
        <div className="relative">
          <SearchOutlined
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder="Search incident code (e.g. ALT-2026), district, khatian, or keyword..."
            className="w-full pl-9 pr-8 py-2.5 text-xs text-slate-100 placeholder-slate-500 rounded-xl bg-slate-900/60 border border-slate-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/25 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onChangeSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Severity Filter Chips (Dashboard Pill Style) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
            <FilterOutlined style={{ fontSize: 11 }} /> Severity:
          </span>

          {/* ALL */}
          <button
            onClick={() => onChangeSeverityFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all select-none cursor-pointer ${
              activeSeverityFilter === "ALL"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.18)]"
                : "bg-slate-900/50 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            All ({totalCount})
          </button>

          {/* CRITICAL */}
          <button
            onClick={() => onChangeSeverityFilter("CRITICAL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 select-none cursor-pointer ${
              activeSeverityFilter === "CRITICAL"
                ? "bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.22)]"
                : "bg-slate-900/50 text-slate-400 border border-slate-800/80 hover:text-red-400 hover:border-red-500/30"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Critical ({criticalCount})
          </button>

          {/* HIGH */}
          <button
            onClick={() => onChangeSeverityFilter("HIGH")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 select-none cursor-pointer ${
              activeSeverityFilter === "HIGH"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.22)]"
                : "bg-slate-900/50 text-slate-400 border border-slate-800/80 hover:text-amber-400 hover:border-amber-500/30"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            High ({highCount})
          </button>

          {/* MODERATE / LOW */}
          <button
            onClick={() => onChangeSeverityFilter("MEDIUM")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 select-none cursor-pointer ${
              activeSeverityFilter === "MEDIUM" || activeSeverityFilter === "LOW"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.18)]"
                : "bg-slate-900/50 text-slate-400 border border-slate-800/80 hover:text-emerald-400 hover:border-emerald-500/30"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Moderate ({lowMedCount})
          </button>
        </div>
      </div>

      {/* ── Scrollable Container of 8 Glassmorphism Incident Cards ── */}
      <div className="relative z-10 mt-1 space-y-3 max-h-[660px] overflow-y-auto pr-1.5">
        {alerts.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <AimOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <p className="text-sm font-medium">
              No matching incidents found
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Adjust search keywords or filter pills to display alerts.
            </p>
          </div>
        ) : (
          alerts.map((incident) => {
            const isSelected = incident.id === selectedAlertId;
            const sevTheme = SEVERITY_THEME[incident.severity];
            const statTheme = STATUS_THEME[incident.status];

            return (
              <div
                key={incident.id}
                onClick={() => onSelectAlert(incident)}
                style={{
                  background: isSelected
                    ? "rgba(17, 24, 39, 0.95)"
                    : "rgba(15, 23, 42, 0.62)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderTop: "1px solid rgba(148, 163, 184, 0.08)",
                  borderRight: "1px solid rgba(148, 163, 184, 0.08)",
                  borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
                  borderLeft: `3.5px solid ${sevTheme.color}`,
                  boxShadow: isSelected
                    ? `0 10px 28px -6px rgba(0,0,0,0.6), 0 0 24px -4px rgba(${sevTheme.rgb}, 0.22)`
                    : "0 2px 8px rgba(0,0,0,0.3)",
                }}
                className={`relative group rounded-xl p-4 transition-all duration-300 ease-out cursor-pointer select-none hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.6)] ${
                  isSelected
                    ? "ring-1 ring-offset-0"
                    : "hover:bg-slate-900/70"
                }`}
              >
                {/* ── Soft Ambient Hover Glow Layer ── */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `0 0 24px -2px rgba(${sevTheme.rgb}, 0.16)`,
                  }}
                />

                {/* ── Card Header: Code, Severity Badge, Status, Timestamp ── */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Incident Code */}
                    <span className="font-mono text-xs font-bold text-slate-200 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/60 tracking-wider">
                      {incident.code}
                    </span>

                    {/* Severity Pill */}
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase flex items-center gap-1"
                      style={{
                        background: sevTheme.badgeBg,
                        color: sevTheme.color,
                        border: `1px solid ${sevTheme.border}`,
                      }}
                    >
                      {incident.severity === "CRITICAL" && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-ping mr-0.5" />
                      )}
                      {sevTheme.label}
                    </span>

                    {/* Status Pill */}
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold"
                      style={{
                        background: statTheme.bg,
                        color: statTheme.color,
                      }}
                    >
                      {statTheme.label}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <ClockCircleOutlined style={{ fontSize: 11 }} />
                    <span className="font-semibold text-slate-300">{incident.timeAgo}</span>
                    <span className="hidden sm:inline text-slate-500 font-mono">
                      ({incident.timestamp.split(",")[1]?.trim() || incident.timestamp})
                    </span>
                  </div>
                </div>

                {/* ── Title ── */}
                <h3
                  className={`relative z-10 text-sm font-bold tracking-tight mb-1.5 line-clamp-1 transition-colors ${
                    isSelected
                      ? "text-white"
                      : "text-slate-200 group-hover:text-emerald-300"
                  }`}
                >
                  {incident.title}
                </h3>

                {/* ── Cadastral & Location Info ── */}
                <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400 mb-3 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-300">
                    <EnvironmentOutlined
                      style={{ color: sevTheme.color, fontSize: 12 }}
                    />
                    <strong className="font-semibold text-slate-200">
                      {incident.district}
                    </strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 truncate max-w-[200px] sm:max-w-[300px]">
                    {incident.location}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-[11px] text-emerald-400/95 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/40">
                    {incident.coordinates.khatianNo} | {incident.coordinates.plotNo}
                  </span>
                </div>

                {/* ── Telemetry Footer (6px Progress Bar, Satellite Chip, Area) ── */}
                <div className="relative z-10 pt-2.5 border-t border-slate-800/70 flex items-center justify-between gap-3 text-xs flex-wrap">
                  {/* AI Confidence Bar with 6px Height */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-slate-400 font-medium">
                      AI Confidence:
                    </span>
                    <div
                      className="w-24 bg-slate-800/80 rounded-full overflow-hidden"
                      style={{ height: 6 }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${incident.confidence}%`,
                          backgroundColor: sevTheme.color,
                          height: 6,
                          boxShadow: `0 0 6px ${sevTheme.color}`,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: sevTheme.color }}
                    >
                      {incident.confidence}%
                    </span>
                  </div>

                  {/* Satellite Source Chip */}
                  <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700/60 shadow-sm">
                    <GlobalOutlined style={{ color: "#14B8A6" }} />
                    <span className="text-slate-400">Sensor:</span>
                    <span className="font-semibold text-teal-300">
                      {incident.satelliteSource.split(" ")[0]}
                    </span>
                  </div>

                  {/* Area Footprint & Arrow */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-300">
                      <span className="text-slate-500">Area:</span>{" "}
                      <strong className="text-slate-200">
                        {incident.affectedAreaSqM.toLocaleString()} m²
                      </strong>
                    </span>
                    <RightOutlined
                      className={`text-xs transition-transform duration-300 ${
                        isSelected
                          ? "text-emerald-400 translate-x-1"
                          : "text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
