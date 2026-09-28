import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Satellite,
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
  ShieldCheck,
  Check,
  Brain,
  Cpu,
  TreePine,
  Gavel,
  Home,
  BadgeCheck,
  AlertCircle,
  BarChart3,
  Globe,
  Database,
  Zap,
  GitBranch,
  ExternalLink,
  Sun,
  Moon,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import KPIStatCard from "../components/dashboard/KPIStatCard";
import RiskProgressCard from "../components/dashboard/RiskProgressCard";
import AlertPreviewCard from "../components/dashboard/AlertPreviewCard";
import ModelHealthCard from "../components/dashboard/ModelHealthCard";
import { RecommendationCard, LifecycleTracker } from "../components/dashboard/RecommendationCard";
import { ApiHealthPanel } from "../components/system";
import { usePrintReport } from "../hooks/usePrintReport";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockAlerts: AlertItem[] = [
  {
    id: "ALT-WB-9021",
    title: "Unsanctioned Clearing & Earthmoving in Coal Boundary",
    district: "Paschim Bardhaman",
    division: "Asansol Industrial Range",
    severity: "Critical",
    timestamp: "3 min ago",
    confidence: 96.8,
    areaHa: 4.8,
    type: "Forest Encroachment",
  },
  {
    id: "ALT-WB-9018",
    title: "Dense Mangrove Canopy Thinning & Canal Bunding",
    district: "South 24 Parganas",
    division: "Sundarban Biosphere Core",
    severity: "Critical",
    timestamp: "18 min ago",
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
    timestamp: "45 min ago",
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
    timestamp: "1 hr ago",
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
    timestamp: "2 hrs ago",
    confidence: 88.3,
    areaHa: 3.9,
    type: "Riverbed Extraction",
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

const rfctlarrSteps = [
  { label: "Social Impact Assessment (SIA)", percent: 78, done: true },
  { label: "Preliminary Notification (Sec 11)", percent: 65, done: true },
  { label: "Compensation Determination", percent: 52, done: false },
  { label: "Rehabilitation & Resettlement", percent: 38, done: false },
  { label: "Possession & Award", percent: 21, done: false },
];

const recommendations = [
  {
    district: "Howrah",
    recommendation: "Verify compensation approval before proceeding to possession stage. 14 affected families pending R&R package.",
    priority: "High" as const,
    module: "RFCTLARR § 31",
  },
  {
    district: "North 24 Parganas",
    recommendation: "Schedule DFO field verification for Barasat corridor boundary encroachment before next satellite pass.",
    priority: "High" as const,
    module: "AI Alert ALT-WB-8901",
  },
  {
    district: "Murshidabad",
    recommendation: "Update SIA report — current document is 14 months old. Regulatory compliance threshold is 12 months.",
    priority: "Medium" as const,
    module: "RFCTLARR § 4(2)",
  },
  {
    district: "Birbhum",
    recommendation: "Initiate final notification for NH-14 widening project. Land acquisition award period expires in 22 days.",
    priority: "Medium" as const,
    module: "RFCTLARR § 19",
  },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

const getStatusBadgeClass = (status: DetectionActivity["status"]) => {
  switch (status) {
    case "Verified by DFO": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Action Initiated": return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    case "Pending Field Check": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Automated Flag": return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    default: return "bg-slate-800 text-slate-300 border-slate-700";
  }
};

// ─── West Bengal Mini SVG Map ─────────────────────────────────────────────────

function WBMiniMap() {
  // Simplified West Bengal silhouette path
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 180" className="w-full max-w-[120px] opacity-90" fill="none">
        {/* Simplified WB outline */}
        <path
          d="M55 8 L75 12 L88 22 L92 38 L85 52 L90 65 L88 80 L82 95 L78 110 L72 125 L60 140 L48 150 L38 145 L30 132 L28 118 L32 105 L28 90 L25 75 L30 60 L25 45 L32 32 L42 18 Z"
          fill="url(#wbGrad)"
          stroke="rgba(16,185,129,0.5)"
          strokeWidth="1.5"
        />
        {/* Risk district dots */}
        <circle cx="68" cy="72" r="5" fill="#EF4444" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="56" cy="118" r="4.5" fill="#EF4444" opacity="0.85">
          <animate attributeName="opacity" values="0.85;0.3;0.85" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="62" cy="98" r="3.5" fill="#F59E0B" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="72" cy="32" r="3" fill="#F59E0B" opacity="0.75">
          <animate attributeName="opacity" values="0.75;0.35;0.75" dur="1.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="52" cy="52" r="3" fill="#EAB308" opacity="0.7" />
        <defs>
          <linearGradient id="wbGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(16,185,129,0.18)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0.10)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Legend */}
      <div className="absolute bottom-0 right-0 space-y-0.5">
        <div className="flex items-center gap-1 text-[9px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-rose-500" />Critical
        </div>
        <div className="flex items-center gap-1 text-[9px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-500" />High
        </div>
        <div className="flex items-center gap-1 text-[9px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />Moderate
        </div>
      </div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-xl shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  badge,
  right,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  badge?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-lg border ${iconBg} ${iconColor}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
            {title}
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {badge}
              </span>
            )}
          </h2>
          {subtitle && <p className="text-xs text-[var(--muted)]">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("landguard-theme") as "dark" | "light") ?? "dark";
  });
  const [currentTime, setCurrentTime] = useState("");
  const [selectedDistrict] = useState("All 23 Districts");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportPDF = usePrintReport();

  // Live clock
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
    const t = setInterval(updateClock, 1000);
    return () => clearInterval(t);
  }, []);

  // Theme persistence
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("theme-light");
      root.classList.remove("theme-dark");
    } else {
      root.classList.add("theme-dark");
      root.classList.remove("theme-light");
    }
    localStorage.setItem("landguard-theme", theme);
  }, [theme]);

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      await exportPDF();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } finally {
      setIsExporting(false);
    }
  };

  const BADGES = [
    "SIH26017",
    "RFCTLARR 2013",
    "Sentinel-2",
    "Cartosat-3",
    "AI Enabled",
  ];

  const KPI_DATA = [
    {
      icon: Activity,
      label: "Active Projects",
      value: "142",
      trend: 8,
      description: "Land acquisition projects actively monitored across 23 West Bengal districts",
      bottomLeft: "Updated: Today 13:25 IST",
      bottomRight: "23 Districts",
      accentColor: "emerald" as const,
    },
    {
      icon: AlertTriangle,
      label: "High Risk Projects",
      value: "37",
      trend: -5,
      description: "Projects with delay probability >70% requiring immediate DFO attention",
      bottomLeft: "Critical: 12",
      bottomRight: "14 Pending DFO",
      bottomRightColor: "text-rose-400",
      accentColor: "rose" as const,
    },
    {
      icon: MapPin,
      label: "Districts Monitored",
      value: "23 / 23",
      trendLabel: "100% Coverage",
      description: "Full coverage of all West Bengal districts via Sentinel-2 telemetry",
      bottomLeft: "Pilot: Barasat",
      bottomRight: "SYSTEM ONLINE",
      accentColor: "cyan" as const,
    },
    {
      icon: BarChart3,
      label: "Avg Delay Probability",
      value: "54.3%",
      trend: 3,
      description: "State-wide XGBoost predicted acquisition delay probability index",
      bottomLeft: "XGBoost v2.1",
      bottomRight: "↑ Risk Trending",
      bottomRightColor: "text-amber-400",
      accentColor: "amber" as const,
    },
    {
      icon: Brain,
      label: "AI Confidence",
      value: "94.7%",
      trend: 2,
      description: "YOLOv8 + SHAP model ensemble average confidence across today's detections",
      bottomLeft: "Model: v3.4.1",
      bottomRight: "98.2% Accuracy",
      accentColor: "purple" as const,
    },
    {
      icon: Gavel,
      label: "Compensation Pending",
      value: "284",
      trendLabel: "+18 this week",
      description: "Cases awaiting compensation award under RFCTLARR § 26 proceedings",
      bottomLeft: "Value: ₹248 Cr",
      bottomRight: "↑ Escalation",
      bottomRightColor: "text-rose-400",
      accentColor: "rose" as const,
    },
    {
      icon: AlertCircle,
      label: "Legal Dispute Cases",
      value: "61",
      trend: -12,
      description: "Active legal disputes at district courts & high court under RFCTLARR § 64",
      bottomLeft: "HC: 12 | DC: 49",
      bottomRight: "7 Resolved",
      accentColor: "amber" as const,
    },
    {
      icon: Home,
      label: "Rehabilitation Pending",
      value: "197",
      trendLabel: "R&R Phase 2",
      description: "Families pending resettlement package under Sec 31 RFCTLARR 2013",
      bottomLeft: "Budget: ₹182 Cr",
      bottomRight: "32% Done",
      accentColor: "blue" as const,
    },
  ];

  const MODEL_STATUS = [
    { name: "YOLOv8 Detection", status: "online" as const, metric: "96.8%", metricLabel: "Avg Confidence", version: "v8.3.1 — GPU Mode" },
    { name: "NDVI Monitoring", status: "online" as const, metric: "10m/px", metricLabel: "Resolution", version: "Sentinel-2A Band 8" },
    { name: "SHAP Explainability", status: "syncing" as const, metric: "0.84", metricLabel: "SHAP Score", version: "TreeExplainer v1.3" },
    { name: "Cadastre Matching", status: "online" as const, metric: "87.4%", metricLabel: "Match Rate", version: "WBDLR v2.1" },
    { name: "GIS Sync", status: "online" as const, metric: "14m ago", metricLabel: "Last Sync", version: "PostGIS 3.4" },
    { name: "API Status", status: "online" as const, metric: "23ms", metricLabel: "Response Time", version: "FastAPI v0.141" },
  ];

  return (
    <div
      id="landguard-report"
      className="min-h-screen bg-[#050C18] text-white print:bg-white print:text-black pb-14 space-y-6 overflow-x-hidden w-full max-w-full"
    >

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO HEADER
      ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-[var(--card)] via-[var(--card)]/80 to-emerald-950/30 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        {/* Ambient glows */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top row: Org label + live indicator + theme toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/12 text-emerald-300 border border-emerald-500/28 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Govt. of West Bengal · Directorate of Forests
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                ORBIT CYCLE: S2-B PASS 48
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-300 font-mono">
                {currentTime}
              </span>
              <button
                onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:border-emerald-500/40 transition-all duration-200"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                LandGuard AI
                <span className="block text-lg md:text-xl font-semibold text-emerald-400 mt-1">
                  Predictive Land Acquisition Intelligence Platform
                </span>
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                AI-powered geospatial decision support system for predicting land acquisition delays
                before they occur — Ministry of Rural Development · SIH26017
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/30 bg-emerald-500/8 text-emerald-300 font-mono tracking-wide"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Status pills */}
            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" />
                SYSTEM ONLINE · 23 / 23 DIVISIONS
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-3 h-3" />
                Last Synced: Today 13:25 IST
              </div>
              {/* District Selector */}
              <div className="relative">
                <button className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/40 px-3 py-1.5 rounded-lg transition-all duration-200">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {selectedDistrict}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — KPI GRID (8 cards)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BadgeCheck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">
            Key Performance Indicators
          </h2>
          <span className="text-xs font-mono text-[var(--muted)] ml-auto">
            Live · Refreshes every 30s
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_DATA.map((kpi, i) => (
            <KPIStatCard
              key={kpi.label}
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              trendLabel={kpi.trendLabel}
              description={kpi.description}
              bottomLeft={kpi.bottomLeft}
              bottomRight={kpi.bottomRight}
              bottomRightColor={kpi.bottomRightColor}
              accentColor={kpi.accentColor}
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MISSION CONTROL — SYSTEM HEALTH CENTER (GOVERNMENT SURVEILLANCE SLA)
      ═══════════════════════════════════════════════════════════════════════ */}
      <ApiHealthPanel />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — WEST BENGAL RISK OVERVIEW + SECTION 4 LIVE ALERTS
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* WB Risk Overview — 4 cols */}
        <SectionCard className="lg:col-span-4 space-y-5">
          <SectionHeader
            icon={Globe}
            iconColor="text-cyan-400"
            iconBg="bg-cyan-500/10 border-cyan-500/20"
            title="West Bengal Risk Overview"
            subtitle="District-level risk distribution across 23 zones"
          />
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <div className="shrink-0 w-28">
              <WBMiniMap />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              <RiskProgressCard label="Critical" count={5} percent={22} variant="critical" delay={0.1} />
              <RiskProgressCard label="High" count={7} percent={30} variant="high" delay={0.15} />
              <RiskProgressCard label="Moderate" count={8} percent={35} variant="moderate" delay={0.2} />
              <RiskProgressCard label="Low" count={3} percent={13} variant="low" delay={0.25} />
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
            <span className="text-[var(--muted)]">Computed via NDVI + FIR density</span>
            <button
              onClick={() => navigate("/heatmap")}
              className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group"
            >
              Explore Full Map
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </SectionCard>

        {/* Live AI Alerts Preview — 8 cols */}
        <SectionCard className="lg:col-span-8 flex flex-col">
          <SectionHeader
            icon={ShieldAlert}
            iconColor="text-rose-400"
            iconBg="bg-rose-500/10 border-rose-500/25"
            title="Live AI Alerts Preview"
            subtitle="Top 5 high-priority anomaly detections from satellite telemetry"
            badge="LIVE STREAM"
          />
          <div className="mt-4 space-y-2 flex-1">
            {mockAlerts.map((alert, i) => (
              <AlertPreviewCard
                key={alert.id}
                id={alert.id}
                district={alert.district}
                severity={alert.severity}
                confidence={alert.confidence}
                areaHa={alert.areaHa}
                timestamp={alert.timestamp}
                title={alert.title}
                delay={i * 0.07}
              />
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs text-[var(--muted)]">
              Showing top 5 of 37 active incidents
            </span>
            <button
              onClick={() => navigate("/alerts")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 hover:text-emerald-300 text-xs font-semibold transition-all duration-200 group"
            >
              View All Alerts
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — AI MODEL STATUS + SECTION 6 RFCTLARR LIFECYCLE
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* AI Model Status — 7 cols */}
        <SectionCard className="lg:col-span-7 space-y-4">
          <SectionHeader
            icon={Cpu}
            iconColor="text-purple-400"
            iconBg="bg-purple-500/10 border-purple-500/20"
            title="AI Model & System Status"
            subtitle="Real-time health of all AI inference and GIS pipeline components"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MODEL_STATUS.map((m, i) => (
              <ModelHealthCard
                key={m.name}
                name={m.name}
                status={m.status}
                metric={m.metric}
                metricLabel={m.metricLabel}
                version={m.version}
                delay={i * 0.06}
              />
            ))}
          </div>

          {/* Quick Actions row */}
          <div className="pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Run AI Detection", icon: Play, color: "emerald", path: "/prediction" },
              { label: "GIS Heatmap", icon: Layers, color: "cyan", path: "/heatmap" },
              { label: "Live Alerts", icon: Bell, color: "amber", path: "/alerts" },
              { label: "Export Report", icon: FileDown, color: "purple", path: null },
            ].map(({ label, icon: Icon, color, path }) => (
              <button
                key={label}
                onClick={() => path ? navigate(path) : handleExportReport()}
                disabled={label === "Export Report" && isExporting}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-100 disabled:opacity-50
                  ${color === "emerald" ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20" : ""}
                  ${color === "cyan" ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/20" : ""}
                  ${color === "amber" ? "bg-amber-500/10 border-amber-500/25 text-amber-300 hover:bg-amber-500/20" : ""}
                  ${color === "purple" ? "bg-purple-500/10 border-purple-500/25 text-purple-300 hover:bg-purple-500/20" : ""}
                `}
              >
                {label === "Export Report" && isExporting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="truncate">{label === "Export Report" && isExporting ? "Generating..." : label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence>
            {exportSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 text-xs font-medium"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Executive report exported (PDF/GeoJSON) successfully
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>

        {/* RFCTLARR Lifecycle — 5 cols */}
        <SectionCard className="lg:col-span-5 space-y-4">
          <SectionHeader
            icon={Gavel}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/10 border-blue-500/20"
            title="RFCTLARR Lifecycle"
            subtitle="Acquisition stage completion across 142 active projects"
          />
          <LifecycleTracker steps={rfctlarrSteps} />
          <div className="pt-3 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {[
              { label: "Completed Stages", value: "2/5", color: "text-emerald-400" },
              { label: "Avg Completion", value: "50.8%", color: "text-cyan-400" },
              { label: "Delayed Projects", value: "37", color: "text-rose-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7 — AI RECOMMENDATIONS
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionCard>
        <SectionHeader
          icon={Sparkles}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          title="AI Recommendations"
          subtitle="Priority action items generated by XGBoost + SHAP analysis engine"
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((r, i) => (
            <RecommendationCard
              key={r.district + i}
              district={r.district}
              recommendation={r.recommendation}
              priority={r.priority}
              module={r.module}
              delay={i * 0.08}
            />
          ))}
        </div>
      </SectionCard>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — RECENT DETECTION ACTIVITY (TIMELINE)
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionCard>
        <SectionHeader
          icon={Activity}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          title="Recent Detection Activity"
          subtitle="Chronological satellite ingest timeline across West Bengal divisions"
          badge="SATELLITE INGEST"
          right={
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Telemetry Pipeline Active
            </div>
          }
        />

        <div className="mt-5 relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/60 before:via-emerald-500/30 before:to-transparent">
          {mockDetectionTimeline.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="relative group"
            >
              {/* Timeline node */}
              <div className="absolute -left-[30px] sm:-left-[34px] top-1 w-5 h-5 rounded-full bg-[var(--surface)] border-2 border-emerald-500/60 flex items-center justify-center group-hover:border-emerald-400 group-hover:scale-110 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-emerald-500/35 hover:bg-[var(--card)] transition-all duration-200 shadow-sm space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/25">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {item.district}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-slate-800/70 border border-slate-700">
                      <Satellite className="w-2.5 h-2.5 text-cyan-400" />
                      {item.sensor}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadgeClass(item.status)}`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="text-rose-400 font-semibold">{item.lossArea}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {item.time}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[var(--text)] font-medium leading-relaxed">{item.event}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-[var(--muted)] font-mono gap-1 pt-2 border-t border-[var(--border)]">
                  <span className="truncate">Coordinates: {item.location}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span>ID: {item.id}</span>
                    <span className="text-emerald-400 font-semibold">{item.confidence}% Confidence</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 8 — TECH STACK & DEPLOYMENT FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <SectionCard>
        <SectionHeader
          icon={Zap}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10 border-cyan-500/20"
          title="Deployment & Technology Stack"
          subtitle="LandGuard AI — SIH26017 Prototype · Ministry of Rural Development"
        />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { layer: "Frontend", stack: "React 19 + Vite", detail: "TypeScript · Tailwind CSS v4 · Framer Motion", icon: Globe, color: "emerald" },
            { layer: "Backend", stack: "FastAPI 0.141", detail: "Python 3.13 · Uvicorn · Pydantic v2", icon: Zap, color: "blue" },
            { layer: "Database", stack: "PostgreSQL + PostGIS", detail: "SQLAlchemy 2.0 · GeoAlchemy2 · psycopg2", icon: Database, color: "purple" },
            { layer: "AI Models", stack: "YOLOv8 + XGBoost", detail: "SHAP Explainability · NDVI · OpenCV", icon: Brain, color: "amber" },
            { layer: "GIS Engine", stack: "Leaflet + Sentinel-2", detail: "ISRO Cartosat-3 · PostGIS ST_* Functions", icon: TreePine, color: "cyan" },
          ].map(({ layer, stack, detail, icon: Icon, color }) => (
            <div
              key={layer}
              className={`p-3 rounded-xl border bg-[var(--surface)] hover:border-opacity-50 transition-all duration-200 group space-y-1.5
                ${color === "emerald" ? "border-emerald-500/20 hover:border-emerald-500/40" : ""}
                ${color === "blue" ? "border-blue-500/20 hover:border-blue-500/40" : ""}
                ${color === "purple" ? "border-purple-500/20 hover:border-purple-500/40" : ""}
                ${color === "amber" ? "border-amber-500/20 hover:border-amber-500/40" : ""}
                ${color === "cyan" ? "border-cyan-500/20 hover:border-cyan-500/40" : ""}
              `}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border
                ${color === "emerald" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : ""}
                ${color === "blue" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : ""}
                ${color === "purple" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : ""}
                ${color === "amber" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : ""}
                ${color === "cyan" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : ""}
              `}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">{layer}</p>
              <p className="text-xs font-bold text-[var(--text)]">{stack}</p>
              <p className="text-[10px] text-[var(--muted)] leading-snug">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/25 transition-all duration-200">
            <ExternalLink className="w-3.5 h-3.5" />
            Live Prototype
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 text-xs font-semibold hover:border-slate-600 hover:text-white transition-all duration-200">
            <GitBranch className="w-3.5 h-3.5" />
            GitHub Frontend
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 text-xs font-semibold hover:border-slate-600 hover:text-white transition-all duration-200">
            <GitBranch className="w-3.5 h-3.5" />
            GitHub Backend
          </button>
          <div className="ml-auto flex items-center gap-2 text-[10px] font-mono text-[var(--muted)]">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
            SIH26017 · DoLR · Directorate of Forests, West Bengal · 2026
          </div>
        </div>
      </SectionCard>

    </div>
  );
}