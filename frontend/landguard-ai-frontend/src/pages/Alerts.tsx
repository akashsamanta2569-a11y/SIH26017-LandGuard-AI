import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAlerts } from "../utils/alertStore";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Satellite,
  Sparkles,
  UserCheck,
  FileDown,
  Eye,
  ChevronDown,
  ChevronUp,
  Radio,
  Send,
  Check,
  Compass,
  ArrowUpRight,
  Shield,
  Filter,
} from "lucide-react";

// Types
type Severity = "Critical" | "High" | "Medium" | "Resolved";
type FilterType = "All" | "Critical" | "High" | "Medium" | "Resolved";

interface AlertData {
  id: string;
  district: string;
  threatTitle: string;
  severity: Severity;
  confidence: number;
  timestamp: string;
  affectedArea: string;
  satelliteSource: string;
  shortSummary: string;
  coordinates: string;
  plotDetails: string;
  assignedOfficer: {
    name: string;
    rank: string;
    division: string;
    phone: string;
  };
  status: "Active Patrol Dispatched" | "Under Field Verification" | "FIR Lodged" | "Resolved" | "Awaiting Beat Allocation";
  aiRecommendation: string;
}

// 12 Mock Alerts covering West Bengal
const MOCK_ALERTS: AlertData[] = [
  {
    id: "ALT-WB-101",
    district: "Paschim Bardhaman",
    threatTitle: "Unsanctioned Open-Cast Coal Boundary Earthmoving",
    severity: "Critical",
    confidence: 96.8,
    timestamp: "12 mins ago",
    affectedArea: "4.8 Ha",
    satelliteSource: "Sentinel-2B (10m MSI)",
    shortSummary: "Heavy earth excavation and canopy felling detected beyond the sanctioned ECL coal lease peripheral boundary.",
    coordinates: "23.7328° N, 86.8521° E",
    plotDetails: "Plot #412/A, Khatian 89, Raniganj Coal Range",
    assignedOfficer: {
      name: "Sri Animesh Mukherjee, IFS",
      rank: "Divisional Forest Officer",
      division: "Asansol-Durgapur Division",
      phone: "+91 94340 XXXXX",
    },
    status: "Active Patrol Dispatched",
    aiRecommendation: "Deploy immediate motorized QRT to cease excavator operation. Impound unauthorized earthmovers under Section 26 of the Indian Forest Act and issue stop-work injunction.",
  },
  {
    id: "ALT-WB-102",
    district: "South 24 Parganas",
    threatTitle: "Mangrove Canopy Clearing & Commercial Aquaculture Bunding",
    severity: "Critical",
    confidence: 94.4,
    timestamp: "35 mins ago",
    affectedArea: "6.2 Ha",
    satelliteSource: "PlanetScope SuperDove (3m)",
    shortSummary: "Tidal mangrove buffer clearing and new saltwater aquaculture bund construction identified inside UNESCO Core Buffer zone.",
    coordinates: "22.1642° N, 88.8130° E",
    plotDetails: "Sundarbans Compartment SB-14, Gosaba Block",
    assignedOfficer: {
      name: "Smt. Debashree Roy, WBFS",
      rank: "Assistant Conservator of Forests",
      division: "Sundarban Tiger Reserve",
      phone: "+91 94342 XXXXX",
    },
    status: "Active Patrol Dispatched",
    aiRecommendation: "Dispatch speed boat patrol from Canning Range base. Demolish artificial saltwater embankments and initiate CRZ Violation FIR against illegal commercial farm operators.",
  },
  {
    id: "ALT-WB-103",
    district: "Purba Medinipur",
    threatTitle: "Dune Leveling & Unauthorized Resort Foundation",
    severity: "Critical",
    confidence: 92.1,
    timestamp: "1 hour ago",
    affectedArea: "3.1 Ha",
    satelliteSource: "Landsat-9 OLI-2 (15m)",
    shortSummary: "Severe dune leveling and casuarina shelterbelt removal detected within 200 meters of the high-tide waterline.",
    coordinates: "21.6621° N, 87.7145° E",
    plotDetails: "Plot #189, Mandarmani Coastal Mouza",
    assignedOfficer: {
      name: "Sri Subhashish Roy, IFS",
      rank: "Divisional Forest Officer",
      division: "Purba Medinipur Coastal Div",
      phone: "+91 94345 XXXXX",
    },
    status: "Under Field Verification",
    aiRecommendation: "Enforce Coastal Regulation Zone (CRZ-I) stay order. Notify District Magistrate for immediate electrical and municipal disconnection to halt illegal RCC pouring.",
  },
  {
    id: "ALT-WB-104",
    district: "Darjeeling",
    threatTitle: "Teak & Sal Timber Logging in Senchal Buffer",
    severity: "High",
    confidence: 89.7,
    timestamp: "2 hours ago",
    affectedArea: "2.4 Ha",
    satelliteSource: "Sentinel-2A L2A (10m)",
    shortSummary: "Concentrated canopy density index drop indicates selective high-value timber harvesting along hill ridge slopes.",
    coordinates: "27.0142° N, 88.2415° E",
    plotDetails: "Senchal Wildlife Sanctuary Beat #3",
    assignedOfficer: {
      name: "Sri Tenzing Norbu Lepcha, WBFS",
      rank: "Range Forest Officer",
      division: "Darjeeling Wildlife Division",
      phone: "+91 94348 XXXXX",
    },
    status: "Under Field Verification",
    aiRecommendation: "Setup surprise forest check-post along Sukhia-Pokhri highway. Mobilize sniffer dog squad to trace clandestine skid trails and seize timber cache.",
  },
  {
    id: "ALT-WB-105",
    district: "Jalpaiguri",
    threatTitle: "Riverbed Sand Excavation along Teesta Riparian Corridor",
    severity: "High",
    confidence: 88.3,
    timestamp: "3 hours ago",
    affectedArea: "3.9 Ha",
    satelliteSource: "ISRO Cartosat-3 (0.3m)",
    shortSummary: "Illegal mechanical sand dredging and unauthorized truck staging points encroaching into riverine forest buffer.",
    coordinates: "26.8920° N, 88.8814° E",
    plotDetails: "Teesta Riverbed Beat, Malbazar",
    assignedOfficer: {
      name: "Sri Rajesh Minz, WBFS",
      rank: "Assistant Conservator of Forests",
      division: "Jalpaiguri Territorial Div",
      phone: "+91 94349 XXXXX",
    },
    status: "Awaiting Beat Allocation",
    aiRecommendation: "Joint raid coordinated with District Police and Mines Department. Confiscate submersible pumps and trench excavator access tracks.",
  },
  {
    id: "ALT-WB-106",
    district: "Alipurduar",
    threatTitle: "Encroachment into Buxa Wildlife Corridor Fringe",
    severity: "High",
    confidence: 87.5,
    timestamp: "4 hours ago",
    affectedArea: "2.8 Ha",
    satelliteSource: "PlanetScope SuperDove (3m)",
    shortSummary: "Fencing and semi-permanent wooden structures erected across critical elephant crossing migratory corridor.",
    coordinates: "26.7540° N, 89.5822° E",
    plotDetails: "Buxa Tiger Reserve West Range, Rajabhatkhawa",
    assignedOfficer: {
      name: "Dr. Kalyan Banerjee, IFS",
      rank: "Field Director",
      division: "Buxa Tiger Reserve",
      phone: "+91 94351 XXXXX",
    },
    status: "FIR Lodged",
    aiRecommendation: "Dismantle illegal fencing immediately to prevent elephant herd distress and retaliatory human-wildlife conflict incidents.",
  },
  {
    id: "ALT-WB-107",
    district: "Bankura",
    threatTitle: "Sal Forest Edge Clearing for Agricultural Encroachment",
    severity: "High",
    confidence: 85.9,
    timestamp: "5 hours ago",
    affectedArea: "1.7 Ha",
    satelliteSource: "Sentinel-2B (10m MSI)",
    shortSummary: "Dry deciduous undergrowth and boundary vegetation burned to expand private paddy cultivation into reserve boundaries.",
    coordinates: "23.3120° N, 87.1890° E",
    plotDetails: "Beliatore Range, Plot #78 Forest Mouza",
    assignedOfficer: {
      name: "Sri Somnath Pal, WBFS",
      rank: "Beat Officer",
      division: "Bankura North Division",
      phone: "+91 94353 XXXXX",
    },
    status: "Under Field Verification",
    aiRecommendation: "Conduct drone demarcation survey using Geo-referenced cadastre map. Erect RCC boundary pillaring and issue trespass warnings.",
  },
  {
    id: "ALT-WB-108",
    district: "Paschim Medinipur",
    threatTitle: "Boundary Stone Displacement & Charcoal Kiln Operation",
    severity: "Medium",
    confidence: 82.4,
    timestamp: "6 hours ago",
    affectedArea: "1.2 Ha",
    satelliteSource: "Landsat-9 OLI-2 (15m)",
    shortSummary: "Thermal anomaly detected inside social forestry beat. Illegal traditional charcoal kilns utilizing forest deadwood.",
    coordinates: "22.4210° N, 87.3190° E",
    plotDetails: "Midnapore Sadar Range, Mouza Gurguripal",
    assignedOfficer: {
      name: "Sri Ashoke Sen, WBFS",
      rank: "Range Officer",
      division: "Midnapore Division",
      phone: "+91 94354 XXXXX",
    },
    status: "Under Field Verification",
    aiRecommendation: "Douse unauthorized kilns and inspect timber source origins. Engage Joint Forest Management Committee (JFMC) for community vigil.",
  },
  {
    id: "ALT-WB-109",
    district: "Birbhum",
    threatTitle: "Laterite Quarry Expansion in Reserved Forest Beat",
    severity: "Medium",
    confidence: 80.8,
    timestamp: "7 hours ago",
    affectedArea: "1.5 Ha",
    satelliteSource: "Sentinel-2A L2A (10m)",
    shortSummary: "Gradual mechanical lateral scraping beyond leased stone extraction quota encroaching into territorial forest boundary.",
    coordinates: "23.9125° N, 87.5240° E",
    plotDetails: "Md. Bazar Forest Range, Khoyrasole Border",
    assignedOfficer: {
      name: "Sri Bikash Mondal, WBFS",
      rank: "Assistant Conservator of Forests",
      division: "Birbhum Territorial Div",
      phone: "+91 94356 XXXXX",
    },
    status: "Awaiting Beat Allocation",
    aiRecommendation: "Issue statutory stop notice to quarry leaseholder. Re-survey DGPS boundary coordinates with Land Records department.",
  },
  {
    id: "ALT-WB-110",
    district: "Jhargram",
    threatTitle: "Unlicensed Brick Kiln Intrusion into Tribal Forest Boundary",
    severity: "Medium",
    confidence: 79.2,
    timestamp: "9 hours ago",
    affectedArea: "1.9 Ha",
    satelliteSource: "PlanetScope SuperDove (3m)",
    shortSummary: "Clay excavation pits and temporary brick chimneys situated within protected Sal coppice forest periphery.",
    coordinates: "22.4510° N, 86.9940° E",
    plotDetails: "Lodhasuli Beat, Jhargram Division",
    assignedOfficer: {
      name: "Sri Amitava Kar, WBFS",
      rank: "Range Officer",
      division: "Jhargram Territorial Div",
      phone: "+91 94358 XXXXX",
    },
    status: "Under Field Verification",
    aiRecommendation: "Conduct joint inspection with Pollution Control Board. Serve closure notice under West Bengal Non-Biodegradable & Forest Laws.",
  },
  {
    id: "ALT-WB-111",
    district: "Nadia",
    threatTitle: "Wetland Filling & Riparian Tree Felling",
    severity: "Resolved",
    confidence: 91.0,
    timestamp: "18 hours ago",
    affectedArea: "0.8 Ha",
    satelliteSource: "Sentinel-2B (10m MSI)",
    shortSummary: "Encroachers filled oxbow waterbody edge with construction debris. Patrol intervened and restored natural floodplain channel.",
    coordinates: "23.4110° N, 88.4980° E",
    plotDetails: "Ranaghat Social Forestry Beat",
    assignedOfficer: {
      name: "Sri Pradip Saha, WBFS",
      rank: "Beat Officer",
      division: "Nadia-Murshidabad Div",
      phone: "+91 94360 XXXXX",
    },
    status: "Resolved",
    aiRecommendation: "Debris removed under administrative order. Native aquatic saplings planted by local eco-club. Case marked closed.",
  },
  {
    id: "ALT-WB-112",
    district: "North 24 Parganas",
    threatTitle: "Bhery Dyke Demolished & Restored to Social Forestry",
    severity: "Resolved",
    confidence: 93.6,
    timestamp: "1 day ago",
    affectedArea: "1.4 Ha",
    satelliteSource: "ISRO Cartosat-3 (0.3m)",
    shortSummary: "Unsanctioned fisheries bund that destroyed riverine mangrove saplings has been completely demolished and reclaimed.",
    coordinates: "22.7120° N, 88.9100° E",
    plotDetails: "Hingalganj Social Forestry Range",
    assignedOfficer: {
      name: "Sri Dipankar Ghosh, WBFS",
      rank: "Range Officer",
      division: "24 Parganas North Division",
      phone: "+91 94362 XXXXX",
    },
    status: "Resolved",
    aiRecommendation: "Encroachment cleared by executive joint raid. Geo-fenced sensor beacon placed for 30-day anti-re-encroachment surveillance.",
  },
];

export default function Alerts() {
  const navigate = useNavigate();

  // React state for filtering and interactivity
  const [alerts, setAlerts] = useState<AlertData[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<FilterType>("All");
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>("ALT-WB-101");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };
  useEffect(() => {
    const liveAlerts = getAlerts();

    if (!liveAlerts.length) return;

    setAlerts((prev) => {
      const existing = new Set(prev.map((item) => item.id));

      const formatted: AlertData[] = liveAlerts
        .filter((a) => !existing.has(a.id))
        .map((a) => ({
          id: a.id,
          district: a.district,
          threatTitle: `${a.district} Encroachment Detected`,
          severity: "Critical",
          confidence: Number(a.confidence),
          timestamp: a.timestamp,
          affectedArea: `${Number(a.affectedArea).toFixed(1)} Ha`,
          satelliteSource: "Sentinel-2 MSI",
          shortSummary:
            "AI detected vegetation loss and cadastral encroachment from latest satellite scan.",
          coordinates: "22.58°N, 88.32°E",
          plotDetails: "Auto-generated from AI Detection",

          assignedOfficer: {
            name: "Forest Patrol Unit",
            rank: "Range Officer",
            division: "West Bengal Forest Department",
            phone: "+91 XXXXX XXXXX",
          },

          status: "Awaiting Beat Allocation",

          aiRecommendation:
            "Dispatch field patrol and verify encroachment using cadastral overlay.",
        }));

      return [...formatted, ...prev];
    });
  }, []);
  // KPI Calculations
  const activeAlertsCount = useMemo(
    () => alerts.filter((a) => a.severity !== "Resolved").length,
    [alerts]
  );
  const criticalAlertsCount = useMemo(
    () => alerts.filter((a) => a.severity === "Critical").length,
    [alerts]
  );
  const resolvedTodayCount = useMemo(
    () => alerts.filter((a) => a.severity === "Resolved").length,
    [alerts]
  );
  const avgResponseTime = "18.4 mins";

  // Filtered Alerts List based on Filter Chips
  const filteredAlerts = useMemo(() => {
    if (filter === "All") return alerts;
    return alerts.filter((alert) => alert.severity === filter);
  }, [alerts, filter]);

  // Action Handlers
  const handleToggleExpand = (alertId: string) => {
    setExpandedAlertId((prev) => (prev === alertId ? null : alertId));
  };

  const handleAssignPatrol = (alert: AlertData, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id ? { ...a, status: "Active Patrol Dispatched" } : a
      )
    );
    showToast(
      `Patrol Dispatched: Quick Response Team (QRT) mobilized for ${alert.district} (${alert.id}). Assigned: ${alert.assignedOfficer.name}.`
    );
  };

  const handleExportAlert = (alert: AlertData, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(
      `Official Incident Dossier Generated for ${alert.id} (${alert.district}) in PDF & GeoJSON format.`
    );
  };

  // Corrected mapping applied here
  const handleViewDetection = (alert: AlertData, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/prediction", {
      state: {
        district: alert.district,
        confidence: alert.confidence,
        vegetationLoss: 12.8, // temporary mock value
        affectedArea: parseFloat(alert.affectedArea),
        riskScore: alert.confidence,
        autoLoad: true,
      }
    });
  };
  const handleOpenHeatmap = (
    alert: AlertData,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    navigate("/heatmap", {
      state: {
        district: alert.district,
        confidence: alert.confidence,
        vegetationLoss: Number(alert.affectedArea.replace(" Ha", "")),
        affectedArea: Number(alert.affectedArea.replace(" Ha", "")),
        riskScore: alert.confidence,
        fromAlerts: true,
      },
    });
  };
  // Severity Badges helper
  const getSeverityBadgeClass = (severity: Severity) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-500/15 text-rose-400 border-rose-500/40";
      case "High":
        return "bg-amber-500/15 text-amber-400 border-amber-500/40";
      case "Medium":
        return "bg-yellow-500/15 text-yellow-300 border-yellow-500/40";
      case "Resolved":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getStatusBadgeClass = (status: AlertData["status"]) => {
    switch (status) {
      case "Active Patrol Dispatched":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      case "Under Field Verification":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "FIR Lodged":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "Resolved":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Awaiting Beat Allocation":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen pb-16 text-slate-100 space-y-8 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900/95 border border-emerald-500/50 p-4 rounded-xl shadow-2xl backdrop-blur-md text-sm text-emerald-300 flex items-start gap-3 animate-slideIn">
          <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-white">Action Executed</span>
            <p className="text-xs text-slate-300 leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* 1. HEADER */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-emerald-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Govt. of West Bengal • Forest Enforcement &amp; Vigilance Wing
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                TACTICAL FEED • LIVE
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>LandGuard Live Alerts Center</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
              AI-generated encroachment alerts across West Bengal. Automated multispectral satellite change detection, perimeter breach telemetry, and forest division dispatch workflow.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-emerald-500/20 sm:pl-6 pt-4 sm:pt-0">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>RADAR FEED: 23 DIVISIONS SYNCED</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated: Just now (Continuous Stream)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* KPI 1 */}
        <div className="rounded-xl border border-emerald-500/20 bg-slate-900/70 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-200 group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Active Alerts
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              {activeAlertsCount}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Live Ingest
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Encroachment cases requiring divisional tracking or patrol dispatch
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>23 Districts Polled</span>
            <span className="text-emerald-400 font-semibold">100% Coverage</span>
          </div>
        </div>

        {/* KPI 2 */}
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
            <span className="text-3xl font-bold tracking-tight text-rose-400">
              {criticalAlertsCount}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Immediate Action
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Severe canopy loss and unpermitted heavy earthmoving in high-risk zones
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Paschim Bardhaman &bull; S 24 Pgs</span>
            <span className="text-rose-400 font-semibold">QRT Mobilized</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-emerald-500/20 bg-slate-900/70 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-200 group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Resolved Today
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-400">
              {resolvedTodayCount}
            </span>
            <span className="inline-flex items-center text-xs font-medium text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              +100% Cleared
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Illegal earthworks stopped, land reclaimed, and boundary stones restored
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Nadia &bull; N 24 Parganas</span>
            <span className="text-emerald-400 font-semibold">FIRs Closed</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/70 p-5 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-200 group shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Average Response Time
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-cyan-300">
              {avgResponseTime}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
              -4.2m vs last wk
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            From automated satellite inference detection to field ranger confirmation
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Target: &lt; 30 mins</span>
            <span className="text-cyan-400 font-semibold">Optimal SLA</span>
          </div>
        </div>
      </div>

      {/* 3. FILTER CHIPS */}
      <div className="rounded-xl border border-emerald-500/20 bg-slate-900/80 p-4 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Filter Incidents by Severity:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Critical", "High", "Medium", "Resolved"] as const).map((chip) => {
            const count =
              chip === "All"
                ? alerts.length
                : alerts.filter((a) => a.severity === chip).length;

            const isSelected = filter === chip;

            return (
              <button
                key={chip}
                type="button"
                onClick={() => setFilter(chip)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${isSelected
                  ? chip === "Critical"
                    ? "bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-md shadow-rose-950/40"
                    : chip === "High"
                      ? "bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-md shadow-amber-950/40"
                      : chip === "Medium"
                        ? "bg-yellow-500/25 text-yellow-200 border-yellow-500/50 shadow-md shadow-yellow-950/40"
                        : chip === "Resolved"
                          ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-950/40"
                          : "bg-emerald-600/30 text-emerald-200 border-emerald-400/60 shadow-md shadow-emerald-950/40"
                  : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                  }`}
              >
                <span>{chip}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isSelected
                    ? "bg-slate-900 text-white font-bold"
                    : "bg-slate-800 text-slate-400"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ALERT TIMELINE */}
      <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-6 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Alert Timeline &amp; Detailed Incident Dossiers</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {filteredAlerts.length} OF 12 ALERTS DISPLAYED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any alert card to toggle expand coordinates, assigned field officer, and tactical action dispatch buttons.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Pipeline Stream Active</span>
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-9 space-y-6 before:absolute before:left-2.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/70 before:via-emerald-500/30 before:to-slate-800">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 rounded-xl bg-slate-950/40 border border-slate-800 text-sm">
              No alerts matching the selected filter &quot;{filter}&quot;.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isExpanded = expandedAlertId === alert.id;

              return (
                <div key={alert.id} className="relative group">
                  {/* Timeline Glowing Node */}
                  <div
                    className={`absolute -left-[29px] sm:-left-[35px] top-4 w-6 h-6 rounded-full bg-slate-950 border-2 flex items-center justify-center transition-all duration-200 shadow-md ${alert.severity === "Critical"
                      ? "border-rose-500 group-hover:scale-110 shadow-rose-950/50"
                      : alert.severity === "High"
                        ? "border-amber-500 group-hover:scale-110 shadow-amber-950/50"
                        : alert.severity === "Medium"
                          ? "border-yellow-500 group-hover:scale-110 shadow-yellow-950/50"
                          : "border-emerald-500 group-hover:scale-110 shadow-emerald-950/50"
                      }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${alert.severity === "Critical"
                        ? "bg-rose-400 animate-pulse"
                        : alert.severity === "High"
                          ? "bg-amber-400"
                          : alert.severity === "Medium"
                            ? "bg-yellow-400"
                            : "bg-emerald-400"
                        }`}
                    />
                  </div>

                  {/* Main Alert Card */}
                  <div
                    onClick={() => handleToggleExpand(alert.id)}
                    className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden shadow-lg ${isExpanded
                      ? "border-emerald-500/50 bg-slate-950/80 ring-1 ring-emerald-500/30"
                      : "border-slate-800/90 bg-slate-950/50 hover:border-emerald-500/30 hover:bg-slate-900/60"
                      }`}
                  >
                    {/* Header Row */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
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
                                  : alert.severity === "Medium"
                                    ? "bg-yellow-400"
                                    : "bg-emerald-400"
                                }`}
                            />
                            {alert.severity}
                          </span>

                          {/* District Badge */}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-700/60">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {alert.district}
                          </span>

                          {/* Satellite Source */}
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                            <Satellite className="w-3 h-3 text-cyan-400" />
                            {alert.satelliteSource}
                          </span>

                          {/* Affected Area */}
                          <span className="text-xs font-mono font-medium text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
                            Area: {alert.affectedArea}
                          </span>
                        </div>

                        {/* AI Confidence & Timestamp */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>{alert.confidence}% AI Conf.</span>
                          </div>

                          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {alert.timestamp}
                          </span>

                          <button
                            type="button"
                            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                            aria-label={isExpanded ? "Collapse Alert" : "Expand Alert"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Threat Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {alert.threatTitle}
                      </h3>

                      {/* Short Summary */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {alert.shortSummary}
                      </p>
                    </div>

                    {/* 5. EXPANDABLE DETAIL PANEL (SHOWN ON CLICK) */}
                    {isExpanded && (
                      <div className="border-t border-slate-800/80 bg-slate-900/60 p-4 sm:p-6 space-y-5 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Coordinates & Plot */}
                          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Coordinates &amp; Cadastre</span>
                            </div>
                            <p className="text-xs font-mono text-emerald-300 font-bold">
                              {alert.coordinates}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {alert.plotDetails}
                            </p>
                          </div>

                          {/* Assigned Officer */}
                          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Assigned Officer</span>
                            </div>
                            <p className="text-xs font-semibold text-white">
                              {alert.assignedOfficer.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {alert.assignedOfficer.rank} &bull; {alert.assignedOfficer.division}
                            </p>
                          </div>

                          {/* Status */}
                          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              <Shield className="w-3.5 h-3.5 text-amber-400" />
                              <span>Current Status</span>
                            </div>
                            <div className="pt-0.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadgeClass(
                                  alert.status
                                )}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                {alert.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Official state forest enforcement workflow
                            </p>
                          </div>
                        </div>

                        {/* AI Recommendation Callout */}
                        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span>AI Enforcement Recommendation</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                            {alert.aiRecommendation}
                          </p>
                        </div>

                        {/* Action Buttons: Assign Patrol | Export Alert | View Detection */}
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
                          {/* Button 1: Assign Patrol */}
                          <button
                            type="button"
                            onClick={(e) => handleAssignPatrol(alert, e)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 hover:border-cyan-400 text-xs font-semibold transition-all duration-150 group shadow-md"
                          >
                            <Send className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                            <span>Assign Patrol</span>
                          </button>

                          {/* Button 2: Export Alert */}
                          <button
                            type="button"
                            onClick={(e) => handleExportAlert(alert, e)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 hover:border-purple-400 text-xs font-semibold transition-all duration-150 group shadow-md"
                          >
                            <FileDown className="w-3.5 h-3.5 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
                            <span>Export Alert</span>
                          </button>

                          {/* Button 3: View Detection (Corrected properties & class attributes kept as requested) */}
                          <button
                            type="button"
                            onClick={(e) => handleViewDetection(alert, e)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600/25 text-emerald-200 border border-emerald-500/50 hover:bg-emerald-600/40 hover:border-emerald-400 text-xs font-semibold transition-all duration-150 group shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span>View Detection</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenHeatmap(alert, e)}
                            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                          >
                            <MapPin className="w-4 h-4" />
                            View on GIS Map
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}