import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar,
  AlertTriangle,
  Activity,
  Satellite,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  FileDown,
  Play,
  Layers,
  MapPin,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Radio,
  Bell,
  ChevronRight,
  Flame,
  ShieldCheck,
  Check,
} from "lucide-react";

// Mock Data Types
interface AlertItem {
  id: string;
  title: string;
  district: string;
  division: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  timestamp: string;
  confidence: number;
  areaHa: number;
  type: string;
}

interface HighRiskDistrict {
  name: string;
  division: string;
  riskScore: number;
  encroachmentCases: number;
  vegetationLossPercent: number;
  status: "Critical" | "High" | "Medium";
}

interface DetectionActivity {
  id: string;
  time: string;
  district: string;
  location: string;
  sensor: string;
  event: string;
  confidence: number;
  status: "Verified by DFO" | "Pending Field Check" | "Automated Flag" | "Action Initiated";
  lossArea: string;
}

const mockAlerts: AlertItem[] = [
  {
    id: "ALT-WB-9021",
    title: "Unsanctioned Clearing & Earthmoving in Coal Boundary",
    district: "Paschim Bardhaman",
    division: "Asansol Industrial Range",
    severity: "Critical",
    timestamp: "3 minutes ago",
    confidence: 96.8,
    areaHa: 4.8,
    type: "Forest Encroachment",
  },
  {
    id: "ALT-WB-9018",
    title: "Dense Mangrove Canopy Thinning & Canal Bunding",
    district: "South 24 Parganas",
    division: "Sundarban Biosphere Core Buffer",
    severity: "Critical",
    timestamp: "18 minutes ago",
    confidence: 94.2,
    areaHa: 6.2,
    type: "Mangrove Depletion",
  },
  {
    id: "ALT-WB-9015",
    title: "Coastal Sand Excavation & Pine Belt Encroachment",
    district: "Purba Medinipur",
    division: "Digha-Sankarpur CRZ",
    severity: "High",
    timestamp: "45 minutes ago",
    confidence: 91.5,
    areaHa: 3.1,
    type: "Coastal Degradation",
  },
  {
    id: "ALT-WB-9011",
    title: "Canopy Density Loss near Senchal Wildlife Sanctuary",
    district: "Darjeeling",
    division: "Darjeeling Wildlife Div II",
    severity: "High",
    timestamp: "1 hour ago",
    confidence: 89.7,
    areaHa: 2.4,
    type: "Illegal Felling",
  },
  {
    id: "ALT-WB-9008",
    title: "Riparian Buffer Encroachment near Teesta Riverbed",
    district: "Jalpaiguri",
    division: "Jalpaiguri Territorial Div",
    severity: "High",
    timestamp: "2 hours ago",
    confidence: 88.3,
    areaHa: 3.9,
    type: "Riverbed Extraction",
  },
  {
    id: "ALT-WB-9004",
    title: "Dry Deciduous Forest Scrub Clearance for Farming",
    district: "Bankura",
    division: "Beliatore North Range",
    severity: "Medium",
    timestamp: "3 hours ago",
    confidence: 85.1,
    areaHa: 1.7,
    type: "Agricultural Encroachment",
  },
  {
    id: "ALT-WB-8999",
    title: "Sal Plantation Edge Boundary Stone Dislocation",
    district: "Paschim Medinipur",
    division: "Jhargram Border Div",
    severity: "Medium",
    timestamp: "4 hours ago",
    confidence: 82.4,
    areaHa: 1.2,
    type: "Boundary Breach",
  },
];

const mockHighRiskDistricts: HighRiskDistrict[] = [
  {
    name: "Paschim Bardhaman",
    division: "Asansol & Durgapur Ranges",
    riskScore: 92,
    encroachmentCases: 84,
    vegetationLossPercent: 18.4,
    status: "Critical",
  },
  {
    name: "South 24 Parganas",
    division: "Sundarban Biosphere Reserve",
    riskScore: 88,
    encroachmentCases: 76,
    vegetationLossPercent: 14.2,
    status: "Critical",
  },
  {
    name: "Purba Medinipur",
    division: "Contai & Tamluk Coast",
    riskScore: 81,
    encroachmentCases: 52,
    vegetationLossPercent: 11.5,
    status: "High",
  },
  {
    name: "Darjeeling",
    division: "Senchal & Kurseong Forest",
    riskScore: 77,
    encroachmentCases: 49,
    vegetationLossPercent: 9.8,
    status: "High",
  },
  {
    name: "Jalpaiguri",
    division: "Dooars Foot Hills Corridor",
    riskScore: 73,
    encroachmentCases: 38,
    vegetationLossPercent: 8.1,
    status: "High",
  },
];

const mockDetectionTimeline: DetectionActivity[] = [
  {
    id: "DET-2026-1044",
    time: "13:22:15 IST",
    district: "Paschim Bardhaman",
    location: "Kulti Open Cast Periphery (23.73° N, 86.85° E)",
    sensor: "Sentinel-2B MultiSpectral (10m)",
    event: "AI detected 4.8 ha illegal overburden dumping & tree canopy removal",
    confidence: 96.8,
    status: "Verified by DFO",
    lossArea: "-4.8 Ha",
  },
  {
    id: "DET-2026-1043",
    time: "12:54:02 IST",
    district: "South 24 Parganas",
    location: "Gosaba Block IX, Sundarban Buffer (22.16° N, 88.81° E)",
    sensor: "PlanetScope SuperDove (3m)",
    event: "AI detected new aquaculture dykes intruding into reserve mangrove forest",
    confidence: 94.2,
    status: "Action Initiated",
    lossArea: "-6.2 Ha",
  },
  {
    id: "DET-2026-1042",
    time: "11:38:40 IST",
    district: "Purba Medinipur",
    location: "Mandarmani Coastal Forest Belt (21.66° N, 87.71° E)",
    sensor: "Landsat-9 OLI-2 (15m Pan)",
    event: "AI detected dune level destruction and unpermitted construction footprints",
    confidence: 91.5,
    status: "Pending Field Check",
    lossArea: "-3.1 Ha",
  },
  {
    id: "DET-2026-1041",
    time: "09:15:18 IST",
    district: "Darjeeling",
    location: "Ghum-Bhanjyang Slope Ridge (27.01° N, 88.24° E)",
    sensor: "Sentinel-2A L2A Surface Reflectance",
    event: "NDVI reduction index > 35% indicating concentrated commercial felling",
    confidence: 89.7,
    status: "Automated Flag",
    lossArea: "-2.4 Ha",
  },
  {
    id: "DET-2026-1040",
    time: "07:42:50 IST",
    district: "Jalpaiguri",
    location: "Nagrakata Elephant Corridor Range (26.89° N, 88.88° E)",
    sensor: "ISRO Cartosat-3 High-Res",
    event: "Linear encroachment & temporary settlement expansion along reserve boundary",
    confidence: 88.3,
    status: "Pending Field Check",
    lossArea: "-3.9 Ha",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium",
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);
  // Filter alerts by severity
  const filteredAlerts = mockAlerts.filter((alert) => {
    if (selectedSeverity === "All") return true;
    return alert.severity.toLowerCase() === selectedSeverity.toLowerCase();
  });

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    }, 1000);
  };

  const getSeverityBadgeClass = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-500/15 text-rose-400 border-rose-500/40";
      case "High":
        return "bg-amber-500/15 text-amber-400 border-amber-500/40";
      case "Medium":
        return "bg-yellow-500/15 text-yellow-300 border-yellow-500/40";
      case "Low":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getStatusBadgeClass = (status: DetectionActivity["status"]) => {
    switch (status) {
      case "Verified by DFO":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Action Initiated":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      case "Pending Field Check":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Automated Flag":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen pb-12 text-slate-100 space-y-8">
      {/* ========================================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-emerald-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Govt. of West Bengal • Directorate of Forests
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                ORBIT CYCLE: S2-B PASS 48
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">

              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-300 font-mono">
                {currentTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>LandGuard AI Command Center</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
              Live monitoring overview for West Bengal Forest &amp; Land Department.
              Real-time deep learning anomaly detection, satellite change surveillance, and tactical enforcement dispatcher.
            </p>
          </div>

          {/* System status pill / quick meta */}
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-emerald-500/20 sm:pl-6 pt-4 sm:pt-0">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SYSTEM ONLINE • 23 / 23 DIVISIONS</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last Synced: Today 13:25 IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1 — KPI CARDS (4 cards) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1: AI Detections Today */}
        <div className="rounded-xl border border-emerald-500/20 bg-slate-900/70 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-200 group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              AI Detections Today
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <Radar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">1,428</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +12.4%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            42 high-confidence anomalies processed across 23 forest divisions today
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Model: ResNet-UNet-v3</span>
            <span className="text-emerald-400 font-semibold">98.2% Accuracy</span>
          </div>
        </div>

        {/* KPI 2: Critical Alerts */}
        <div className="rounded-xl border border-rose-500/30 bg-slate-900/70 p-5 backdrop-blur-md hover:border-rose-500/50 transition-all duration-200 group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Critical Alerts
            </span>
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-rose-400">37</span>
            <span className="inline-flex items-center text-xs font-medium text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              +5 past 3 hrs
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Urgent land breaches requiring immediate territorial field dispatch
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Dispatched: 23</span>
            <span className="text-rose-400 font-semibold">14 Pending DFO</span>
          </div>
        </div>

        {/* KPI 3: High-Risk Districts */}
        <div className="rounded-xl border border-amber-500/20 bg-slate-900/70 p-5 backdrop-blur-md hover:border-amber-500/40 transition-all duration-200 group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              High-Risk Districts
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-amber-300">5 / 23</span>
            <span className="inline-flex items-center text-xs font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Risk Index &gt; 70
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Top vulnerable zones: Paschim Bardhaman, S 24 Parganas, Purba Medinipur
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Critical Severity: 2</span>
            <span className="text-amber-400 font-semibold">High Severity: 3</span>
          </div>
        </div>

        {/* KPI 4: Satellite Sync Status */}
        <div className="rounded-xl border border-emerald-500/20 bg-slate-900/70 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-200 group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Satellite Sync Status
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <Satellite className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
              ACTIVE
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </span>
            <span className="text-xs font-mono text-slate-300">100% Feed</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Copernicus Sentinel-2 &amp; Landsat-9 dual-constellation telemetry linked
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Pass: 14m ago</span>
            <span className="text-emerald-400 font-semibold">Next: In 52m</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5 — QUICK ACTIONS (Placed prominently for executive action) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/85 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-500/15 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Section 5 — Quick Actions</span>
            </h2>
            <p className="text-xs text-slate-400">
              Tactical operations for divisional forestry officers, analysts, and surveillance engineers.
            </p>
          </div>

          {exportSuccess && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>State LandGuard AI Executive Report Exported (PDF/GeoJSON)</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Run AI Detection */}
          <button
            type="button"
            onClick={() => navigate("/prediction")}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-600/30 text-left transition-all duration-200 group shadow-md"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-white group-hover:text-emerald-300 transition-colors">
                <Play className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform fill-emerald-400/20" />
                <span>Run AI Detection</span>
              </div>
              <p className="text-xs text-slate-400">
                Execute multispectral inference on latest satellite tiles
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Action 2: Open GIS Heatmap */}
          <button
            type="button"
            onClick={() => navigate("/heatmap")}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-cyan-600/20 to-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-600/30 text-left transition-all duration-200 group shadow-md"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Open GIS Heatmap</span>
              </div>
              <p className="text-xs text-slate-400">
                23-district interactive territorial risk matrix &amp; polygon viewer
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Action 3: View Live Alerts */}
          <button
            type="button"
            onClick={() => navigate("/alerts")}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-950/40 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-600/30 text-left transition-all duration-200 group shadow-md"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-white group-hover:text-amber-300 transition-colors">
                <Bell className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>View Live Alerts</span>
              </div>
              <p className="text-xs text-slate-400">
                Full incident ledger with FIR logs &amp; field task dispatches
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Action 4: Export AI Report */}
          <button
            type="button"
            onClick={handleExportReport}
            disabled={isExporting}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-950/40 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-600/30 text-left transition-all duration-200 group shadow-md disabled:opacity-50"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-white group-hover:text-purple-300 transition-colors">
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                )}
                <span>{isExporting ? "Generating Dossier..." : "Export AI Report"}</span>
              </div>
              <p className="text-xs text-slate-400">
                Official PDF/Shapefile summary for State Environmental Directorate
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2 & 3: TWO-COLUMN COMMAND PANELS */}
      {/* Left: Section 2 — Live Alert Feed */}
      {/* Right: Section 3 — High Risk Districts */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 2: LIVE ALERT FEED (7 Cols on desktop) */}
        <div className="lg:col-span-7 rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Section 2 — Live Alert Feed</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    LIVE STREAM
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time neural network detection alerts with district geolocation
                </p>
              </div>
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
              {(["All", "Critical", "High", "Medium"] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${selectedSeverity === sev
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable list */}
          <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No alerts matching severity &quot;{selectedSeverity}&quot;.
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-200 hover:bg-slate-900/60 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Severity Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getSeverityBadgeClass(
                            alert.severity
                          )}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${alert.severity === "Critical"
                              ? "bg-rose-400 animate-pulse"
                              : alert.severity === "High"
                                ? "bg-amber-400"
                                : "bg-yellow-400"
                              }`}
                          />
                          {alert.severity}
                        </span>

                        {/* District Badge */}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {alert.district}
                        </span>

                        {/* Alert ID */}
                        <span className="text-[11px] font-mono text-slate-400">
                          {alert.id}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {alert.title}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>Range: {alert.division}</span>
                        <span>•</span>
                        <span className="text-slate-300">Est. Area: {alert.areaHa} Ha</span>
                      </p>
                    </div>

                    {/* AI Confidence & Timestamp */}
                    <div className="text-right shrink-0 space-y-1">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>{alert.confidence}% AI Conf.</span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredAlerts.length} live incident telemetry signals</span>
            <button
              type="button"
              onClick={() => navigate("/alerts")}
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group"
            >
              <span>View All 37 Incident Logs</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* SECTION 3: HIGH RISK DISTRICTS (5 Cols on desktop) */}
        <div className="lg:col-span-5 rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/25">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Section 3 — High Risk Districts</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Top 5 vulnerable districts sorted by AI risk score
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                TOP 5 / 23
              </span>
            </div>

            {/* District Progress Bars List */}
            <div className="mt-5 space-y-5">
              {mockHighRiskDistricts.map((district, index) => {
                const isCritical = district.riskScore >= 85;
                const isHigh = district.riskScore >= 70 && district.riskScore < 85;

                return (
                  <div key={district.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center border border-slate-700 font-semibold">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-white hover:text-emerald-300 transition-colors">
                            {district.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {district.division}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-mono font-bold text-sm ${isCritical
                            ? "text-rose-400"
                            : isHigh
                              ? "text-amber-400"
                              : "text-emerald-400"
                            }`}
                        >
                          {district.riskScore} / 100
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {district.encroachmentCases} cases • -{district.vegetationLossPercent}% veg
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isCritical
                          ? "bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600"
                          : isHigh
                            ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500"
                          }`}
                        style={{ width: `${district.riskScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Computed via NDVI, canopy loss &amp; FIR density</span>
            <button
              type="button"
              onClick={() => navigate("/heatmap")}
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group"
            >
              <span>Explore All 23 on Map</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4 — RECENT DETECTION ACTIVITY (TIMELINE) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Section 4 — Recent Detection Activity</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  SATELLITE INGEST TIMELINE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Chronological timeline showing latest multi-satellite AI detections across West Bengal districts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Pipeline Active</span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/60 before:via-emerald-500/30 before:to-slate-800">
          {mockDetectionTimeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-[30px] sm:-left-[35px] top-1 w-6 h-6 rounded-full bg-slate-950 border-2 border-emerald-500/60 flex items-center justify-center group-hover:border-emerald-400 group-hover:scale-110 transition-all shadow-md shadow-emerald-950/40">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* Card Body */}
              <div className="rounded-xl border border-slate-800/90 bg-slate-950/50 p-4 sm:p-5 hover:border-emerald-500/40 transition-all duration-200 group-hover:bg-slate-900/60 shadow-lg space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* District Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {item.district}
                    </span>

                    {/* Sensor Badge */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-slate-300 bg-slate-800 border border-slate-700">
                      <Satellite className="w-3 h-3 text-cyan-400" />
                      {item.sensor}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span className="text-rose-400 font-semibold">{item.lossArea}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.time}
                    </span>
                  </div>
                </div>

                {/* Event Description */}
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {item.event}
                </p>

                {/* Footer Coordinates & Detection Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-mono gap-2 pt-2 border-t border-slate-800/60">
                  <span className="truncate">Coordinates: {item.location}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400">ID: {item.id}</span>
                    <span className="text-emerald-400 font-semibold">
                      {item.confidence}% Confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}