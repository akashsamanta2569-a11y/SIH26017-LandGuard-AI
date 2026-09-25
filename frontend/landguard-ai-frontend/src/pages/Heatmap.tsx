import { useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Search,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Satellite,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  TrendingUp,
  Radio,
  FileText,
  Send,
  CheckCircle2,
  X,
  Eye,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type RiskLevel = "Critical" | "High" | "Medium" | "Low";

export interface DistrictData {
  id: string;
  name: string;
  code: string;
  riskScore: number;
  riskLevel: RiskLevel;
  encroachmentCases: number;
  lastSatelliteScan: string;
  vegetationLoss: number;
  primaryThreat: string;
  zoneType: string;
  satelliteProvider: string;
  hq: string;
  areaKm2: number;
  coordinates: { lat: number; lng: number };
  historicalTrend: number[];
  path: string;
  centroid: { x: number; y: number };
}

// ─── 23 WEST BENGAL DISTRICTS STATIC MOCK DATA ───────────────────────────────

const DISTRICTS_DATA: DistrictData[] = [
  // 1. Darjeeling
  {
    id: "darjeeling",
    name: "Darjeeling",
    code: "DAR",
    riskScore: 78,
    riskLevel: "High",
    encroachmentCases: 34,
    lastSatelliteScan: "18 mins ago",
    vegetationLoss: 9.4,
    primaryThreat: "Hillside Forest Deforestation & Illegal Resorts",
    zoneType: "Sub-Himalayan Eco-Fragile",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Darjeeling",
    areaKm2: 2092,
    coordinates: { lat: 27.036, lng: 88.2627 },
    historicalTrend: [64, 68, 71, 75, 76, 78],
    path: "M 215 35 L 245 22 L 270 30 L 265 58 L 248 78 L 222 82 L 208 62 Z",
    centroid: { x: 236, y: 55 },
  },
  // 2. Kalimpong
  {
    id: "kalimpong",
    name: "Kalimpong",
    code: "KAL",
    riskScore: 28,
    riskLevel: "Low",
    encroachmentCases: 6,
    lastSatelliteScan: "34 mins ago",
    vegetationLoss: 1.2,
    primaryThreat: "Fringe Terrace Clearing",
    zoneType: "Protected Himalayan Ridge",
    satelliteProvider: "Cartosat-3 Optical",
    hq: "Kalimpong",
    areaKm2: 1053,
    coordinates: { lat: 27.0667, lng: 88.4667 },
    historicalTrend: [24, 25, 27, 26, 27, 28],
    path: "M 270 30 L 305 25 L 322 48 L 310 72 L 278 74 L 265 58 Z",
    centroid: { x: 290, y: 52 },
  },
  // 3. Jalpaiguri
  {
    id: "jalpaiguri",
    name: "Jalpaiguri",
    code: "JPG",
    riskScore: 74,
    riskLevel: "High",
    encroachmentCases: 31,
    lastSatelliteScan: "12 mins ago",
    vegetationLoss: 8.7,
    primaryThreat: "Tea Estate Buffer Settlement & Timber Felling",
    zoneType: "Dooars Foothill Corridor",
    satelliteProvider: "Landsat-9 OLI",
    hq: "Jalpaiguri",
    areaKm2: 3044,
    coordinates: { lat: 26.54, lng: 88.71 },
    historicalTrend: [62, 65, 69, 70, 72, 74],
    path: "M 248 78 L 278 74 L 310 72 L 325 82 L 332 108 L 305 128 L 270 125 L 245 110 L 252 90 Z",
    centroid: { x: 284, y: 102 },
  },
  // 4. Alipurduar
  {
    id: "alipurduar",
    name: "Alipurduar",
    code: "APD",
    riskScore: 65,
    riskLevel: "High",
    encroachmentCases: 23,
    lastSatelliteScan: "45 mins ago",
    vegetationLoss: 6.8,
    primaryThreat: "Buxa Tiger Reserve Buffer Incursion",
    zoneType: "Wildlife Reserve Fringe",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Alipurduar",
    areaKm2: 3136,
    coordinates: { lat: 26.4919, lng: 89.5271 },
    historicalTrend: [55, 58, 60, 62, 64, 65],
    path: "M 325 82 L 365 65 L 415 70 L 420 98 L 388 118 L 345 115 L 332 108 Z",
    centroid: { x: 372, y: 92 },
  },
  // 5. Cooch Behar
  {
    id: "coochbehar",
    name: "Cooch Behar",
    code: "COB",
    riskScore: 25,
    riskLevel: "Low",
    encroachmentCases: 8,
    lastSatelliteScan: "2 hours ago",
    vegetationLoss: 1.5,
    primaryThreat: "Torsa Alluvial Silt Occupation",
    zoneType: "Agricultural Riverplain",
    satelliteProvider: "IRS-1C LISS-III",
    hq: "Cooch Behar",
    areaKm2: 3387,
    coordinates: { lat: 26.3239, lng: 89.451 },
    historicalTrend: [22, 23, 23, 24, 25, 25],
    path: "M 332 108 L 345 115 L 388 118 L 410 135 L 400 165 L 358 162 L 330 140 Z",
    centroid: { x: 366, y: 140 },
  },
  // 6. Uttar Dinajpur
  {
    id: "uttardinajpur",
    name: "Uttar Dinajpur",
    code: "UDI",
    riskScore: 40,
    riskLevel: "Medium",
    encroachmentCases: 15,
    lastSatelliteScan: "1 hour ago",
    vegetationLoss: 3.9,
    primaryThreat: "NH-31 Highway Corridor Ribbon Sprawl",
    zoneType: "Strategic Transport Spine",
    satelliteProvider: "Landsat-9 OLI",
    hq: "Raiganj",
    areaKm2: 3140,
    coordinates: { lat: 25.6167, lng: 88.1167 },
    historicalTrend: [35, 36, 38, 39, 39, 40],
    path: "M 225 115 L 255 118 L 268 142 L 260 185 L 240 210 L 220 195 L 212 150 Z",
    centroid: { x: 240, y: 165 },
  },
  // 7. Dakshin Dinajpur
  {
    id: "dakshindinajpur",
    name: "Dakshin Dinajpur",
    code: "DDI",
    riskScore: 22,
    riskLevel: "Low",
    encroachmentCases: 5,
    lastSatelliteScan: "3 hours ago",
    vegetationLoss: 0.9,
    primaryThreat: "Border Wetland Boundary Shifts",
    zoneType: "Border Rural Agro-belt",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Balurghat",
    areaKm2: 2219,
    coordinates: { lat: 25.2167, lng: 88.7667 },
    historicalTrend: [20, 20, 21, 21, 22, 22],
    path: "M 260 185 L 295 178 L 332 192 L 335 225 L 298 235 L 258 220 L 240 210 Z",
    centroid: { x: 288, y: 208 },
  },
  // 8. Malda
  {
    id: "malda",
    name: "Malda",
    code: "MLD",
    riskScore: 55,
    riskLevel: "Medium",
    encroachmentCases: 22,
    lastSatelliteScan: "55 mins ago",
    vegetationLoss: 5.1,
    primaryThreat: "Mango Orchard Conversion & Ganga Char Occupation",
    zoneType: "Ganges Floodplain Junction",
    satelliteProvider: "Cartosat-3 Optical",
    hq: "English Bazar",
    areaKm2: 3733,
    coordinates: { lat: 25.0, lng: 88.1333 },
    historicalTrend: [48, 50, 52, 53, 54, 55],
    path: "M 218 208 L 240 210 L 258 220 L 272 242 L 268 280 L 235 285 L 205 258 L 210 225 Z",
    centroid: { x: 238, y: 250 },
  },
  // 9. Murshidabad
  {
    id: "murshidabad",
    name: "Murshidabad",
    code: "MSD",
    riskScore: 67,
    riskLevel: "High",
    encroachmentCases: 29,
    lastSatelliteScan: "24 mins ago",
    vegetationLoss: 7.3,
    primaryThreat: "Bhagirathi Riverbank Sand Dredging & Brick Kilns",
    zoneType: "Riparian Alluvial Plain",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Baharampur",
    areaKm2: 5324,
    coordinates: { lat: 24.175, lng: 88.28 },
    historicalTrend: [59, 61, 63, 64, 66, 67],
    path: "M 235 285 L 268 280 L 295 295 L 320 325 L 312 360 L 275 362 L 242 342 L 232 312 Z",
    centroid: { x: 275, y: 326 },
  },
  // 10. Birbhum
  {
    id: "birbhum",
    name: "Birbhum",
    code: "BRB",
    riskScore: 45,
    riskLevel: "Medium",
    encroachmentCases: 18,
    lastSatelliteScan: "1 hour ago",
    vegetationLoss: 4.2,
    primaryThreat: "Stone Quarry Fringe Land Degradation",
    zoneType: "Rarh Laterite Plateau",
    satelliteProvider: "Landsat-9 OLI",
    hq: "Suri",
    areaKm2: 4545,
    coordinates: { lat: 23.91, lng: 87.52 },
    historicalTrend: [40, 41, 42, 43, 44, 45],
    path: "M 172 305 L 232 312 L 242 342 L 238 378 L 195 385 L 165 360 L 168 328 Z",
    centroid: { x: 202, y: 348 },
  },
  // 11. Paschim Bardhaman
  {
    id: "paschimbardhaman",
    name: "Paschim Bardhaman",
    code: "PBD",
    riskScore: 84,
    riskLevel: "Critical",
    encroachmentCases: 46,
    lastSatelliteScan: "8 mins ago",
    vegetationLoss: 12.3,
    primaryThreat: "Open-Cast Coal Mining Buffer Incursion",
    zoneType: "Heavy Industrial Coal Belt",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Asansol",
    areaKm2: 1603,
    coordinates: { lat: 23.6833, lng: 86.9833 },
    historicalTrend: [72, 75, 78, 80, 82, 84],
    path: "M 132 382 L 195 385 L 205 412 L 180 432 L 140 430 L 120 405 Z",
    centroid: { x: 162, y: 408 },
  },
  // 12. Purba Bardhaman
  {
    id: "purbabardhaman",
    name: "Purba Bardhaman",
    code: "EBD",
    riskScore: 52,
    riskLevel: "Medium",
    encroachmentCases: 20,
    lastSatelliteScan: "40 mins ago",
    vegetationLoss: 4.8,
    primaryThreat: "Prime Agricultural Basin Commercial Conversion",
    zoneType: "Rice Bowl Delta Plain",
    satelliteProvider: "Cartosat-3 Optical",
    hq: "Bardhaman",
    areaKm2: 5430,
    coordinates: { lat: 23.2333, lng: 87.8667 },
    historicalTrend: [46, 48, 49, 50, 51, 52],
    path: "M 195 385 L 238 378 L 275 362 L 282 398 L 260 432 L 212 435 L 205 412 Z",
    centroid: { x: 242, y: 402 },
  },
  // 13. Nadia
  {
    id: "nadia",
    name: "Nadia",
    code: "NDA",
    riskScore: 58,
    riskLevel: "Medium",
    encroachmentCases: 25,
    lastSatelliteScan: "30 mins ago",
    vegetationLoss: 5.7,
    primaryThreat: "Oxbow Lake Drainage & Lowland Infill",
    zoneType: "Deltaic Riverine Basin",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Krishnanagar",
    areaKm2: 3927,
    coordinates: { lat: 23.4, lng: 88.5 },
    historicalTrend: [51, 53, 54, 56, 57, 58],
    path: "M 275 362 L 312 360 L 338 388 L 332 438 L 298 445 L 282 398 Z",
    centroid: { x: 308, y: 406 },
  },
  // 14. Purulia
  {
    id: "purulia",
    name: "Purulia",
    code: "PRL",
    riskScore: 16,
    riskLevel: "Low",
    encroachmentCases: 4,
    lastSatelliteScan: "4 hours ago",
    vegetationLoss: 0.6,
    primaryThreat: "Ajodhya Foothill Scrub Clearing",
    zoneType: "Chota Nagpur Uplands",
    satelliteProvider: "Landsat-9 OLI",
    hq: "Purulia",
    areaKm2: 6259,
    coordinates: { lat: 23.3333, lng: 86.3667 },
    historicalTrend: [14, 15, 15, 16, 16, 16],
    path: "M 62 398 L 120 405 L 140 430 L 138 475 L 102 492 L 68 465 L 55 428 Z",
    centroid: { x: 96, y: 445 },
  },
  // 15. Bankura
  {
    id: "bankura",
    name: "Bankura",
    code: "BNK",
    riskScore: 48,
    riskLevel: "Medium",
    encroachmentCases: 17,
    lastSatelliteScan: "1.5 hours ago",
    vegetationLoss: 4.0,
    primaryThreat: "Dry Deciduous Forest Buffer Degradation",
    zoneType: "Undulating Laterite Forest",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Bankura",
    areaKm2: 6882,
    coordinates: { lat: 23.2333, lng: 87.0667 },
    historicalTrend: [42, 44, 45, 46, 47, 48],
    path: "M 138 432 L 180 432 L 212 435 L 222 468 L 202 505 L 155 502 L 138 475 Z",
    centroid: { x: 178, y: 468 },
  },
  // 16. Hooghly
  {
    id: "hooghly",
    name: "Hooghly",
    code: "HGY",
    riskScore: 69,
    riskLevel: "High",
    encroachmentCases: 33,
    lastSatelliteScan: "15 mins ago",
    vegetationLoss: 7.9,
    primaryThreat: "Riparian Wetland Conversion & Unapproved Real Estate",
    zoneType: "Peri-Urban Waterfront",
    satelliteProvider: "Cartosat-3 Optical",
    hq: "Chinsurah",
    areaKm2: 3149,
    coordinates: { lat: 22.9, lng: 88.39 },
    historicalTrend: [60, 62, 64, 66, 68, 69],
    path: "M 222 442 L 260 432 L 282 445 L 278 485 L 245 488 L 225 465 Z",
    centroid: { x: 252, y: 462 },
  },
  // 17. Howrah
  {
    id: "howrah",
    name: "Howrah",
    code: "HWH",
    riskScore: 72,
    riskLevel: "High",
    encroachmentCases: 37,
    lastSatelliteScan: "10 mins ago",
    vegetationLoss: 8.4,
    primaryThreat: "Industrial Riverfront Drainage Canal Infill",
    zoneType: "Dense Riverfront Metro",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Howrah",
    areaKm2: 1467,
    coordinates: { lat: 22.5833, lng: 88.3167 },
    historicalTrend: [63, 65, 68, 70, 71, 72],
    path: "M 235 485 L 275 485 L 278 518 L 248 525 L 228 505 Z",
    centroid: { x: 254, y: 504 },
  },
  // 18. Kolkata
  {
    id: "kolkata",
    name: "Kolkata",
    code: "CCU",
    riskScore: 94,
    riskLevel: "Critical",
    encroachmentCases: 58,
    lastSatelliteScan: "5 mins ago",
    vegetationLoss: 16.2,
    primaryThreat: "Severe East Kolkata Ramsar Wetlands Encroachment",
    zoneType: "High-Density Metropolis",
    satelliteProvider: "Cartosat-3 Optical",
    hq: "Kolkata",
    areaKm2: 206,
    coordinates: { lat: 22.5726, lng: 88.3639 },
    historicalTrend: [84, 87, 89, 91, 93, 94],
    path: "M 280 488 L 305 488 L 306 512 L 282 514 Z",
    centroid: { x: 293, y: 501 },
  },
  // 19. North 24 Parganas
  {
    id: "north24parganas",
    name: "North 24 Parganas",
    code: "N24",
    riskScore: 88,
    riskLevel: "Critical",
    encroachmentCases: 52,
    lastSatelliteScan: "7 mins ago",
    vegetationLoss: 14.1,
    primaryThreat: "Wetland Polder Conversion & Rapid Urban Sprawl",
    zoneType: "Metro-Sundarbans Transition",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Barasat",
    areaKm2: 4094,
    coordinates: { lat: 22.72, lng: 88.48 },
    historicalTrend: [78, 80, 83, 85, 87, 88],
    path: "M 298 445 L 332 438 L 365 462 L 368 522 L 322 532 L 305 488 L 280 488 L 282 445 Z",
    centroid: { x: 330, y: 485 },
  },
  // 20. Jhargram
  {
    id: "jhargram",
    name: "Jhargram",
    code: "JHG",
    riskScore: 19,
    riskLevel: "Low",
    encroachmentCases: 3,
    lastSatelliteScan: "5 hours ago",
    vegetationLoss: 0.8,
    primaryThreat: "Minor Tribal Forest Boundary Fringe Gathering",
    zoneType: "Junglemahal Sal Forest",
    satelliteProvider: "Landsat-9 OLI",
    hq: "Jhargram",
    areaKm2: 3037,
    coordinates: { lat: 22.45, lng: 86.98 },
    historicalTrend: [17, 18, 18, 19, 19, 19],
    path: "M 95 495 L 155 502 L 160 545 L 135 582 L 92 572 L 85 530 Z",
    centroid: { x: 124, y: 538 },
  },
  // 21. Paschim Medinipur
  {
    id: "paschimmedinipur",
    name: "Paschim Medinipur",
    code: "WMD",
    riskScore: 42,
    riskLevel: "Medium",
    encroachmentCases: 16,
    lastSatelliteScan: "1.2 hours ago",
    vegetationLoss: 3.8,
    primaryThreat: "Kangsabati Riverbed Unregulated Sand Extraction",
    zoneType: "Laterite Red Soil Plain",
    satelliteProvider: "IRS-1C LISS-III",
    hq: "Medinipur",
    areaKm2: 6308,
    coordinates: { lat: 22.4167, lng: 87.3167 },
    historicalTrend: [38, 39, 40, 41, 41, 42],
    path: "M 155 502 L 202 505 L 228 505 L 235 548 L 198 582 L 160 545 Z",
    centroid: { x: 195, y: 540 },
  },
  // 22. Purba Medinipur
  {
    id: "purbamedinipur",
    name: "Purba Medinipur",
    code: "EMD",
    riskScore: 82,
    riskLevel: "Critical",
    encroachmentCases: 44,
    lastSatelliteScan: "9 mins ago",
    vegetationLoss: 11.8,
    primaryThreat: "CRZ Coastal Mangrove Clearing & Illegal Shrimp Ponds",
    zoneType: "Coastal Regulation Zone",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Tamluk",
    areaKm2: 4736,
    coordinates: { lat: 22.3, lng: 87.92 },
    historicalTrend: [70, 73, 76, 78, 80, 82],
    path: "M 228 505 L 255 518 L 282 538 L 272 608 L 225 602 L 210 568 L 235 548 Z",
    centroid: { x: 248, y: 560 },
  },
  // 23. South 24 Parganas
  {
    id: "south24parganas",
    name: "South 24 Parganas",
    code: "S24",
    riskScore: 91,
    riskLevel: "Critical",
    encroachmentCases: 54,
    lastSatelliteScan: "6 mins ago",
    vegetationLoss: 15.6,
    primaryThreat: "Sundarbans Core Mangrove Intrusion & Aquaculture Levees",
    zoneType: "Sundarbans Biosphere Delta",
    satelliteProvider: "Sentinel-2 MSI",
    hq: "Alipore",
    areaKm2: 9960,
    coordinates: { lat: 22.15, lng: 88.55 },
    historicalTrend: [81, 84, 86, 88, 90, 91],
    path: "M 282 514 L 306 512 L 322 532 L 368 522 L 382 575 L 372 652 L 328 665 L 292 642 L 280 598 L 282 538 Z",
    centroid: { x: 332, y: 590 },
  },
];

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────

const RISK_THEME: Record<
  RiskLevel,
  {
    label: string;
    color: string;
    stroke: string;
    bgBadge: string;
    borderBadge: string;
    textBadge: string;
    glow: string;
    gradientId: string;
    fillHex: string;
    hoverFillHex: string;
  }
> = {
  Critical: {
    label: "Critical",
    color: "#EF4444",
    stroke: "#F87171",
    bgBadge: "bg-red-500/15",
    borderBadge: "border-red-500/40",
    textBadge: "text-red-400",
    glow: "rgba(239, 68, 68, 0.45)",
    gradientId: "risk-crit-grad",
    fillHex: "rgba(239, 68, 68, 0.55)",
    hoverFillHex: "rgba(239, 68, 68, 0.85)",
  },
  High: {
    label: "High",
    color: "#F97316",
    stroke: "#FB923C",
    bgBadge: "bg-orange-500/15",
    borderBadge: "border-orange-500/40",
    textBadge: "text-orange-400",
    glow: "rgba(249, 115, 22, 0.45)",
    gradientId: "risk-high-grad",
    fillHex: "rgba(249, 115, 22, 0.55)",
    hoverFillHex: "rgba(249, 115, 22, 0.85)",
  },
  Medium: {
    label: "Medium",
    color: "#EAB308",
    stroke: "#FACC15",
    bgBadge: "bg-yellow-500/15",
    borderBadge: "border-yellow-500/40",
    textBadge: "text-yellow-400",
    glow: "rgba(234, 179, 8, 0.45)",
    gradientId: "risk-med-grad",
    fillHex: "rgba(234, 179, 8, 0.50)",
    hoverFillHex: "rgba(234, 179, 8, 0.80)",
  },
  Low: {
    label: "Low",
    color: "#10B981",
    stroke: "#34D399",
    bgBadge: "bg-emerald-500/15",
    borderBadge: "border-emerald-500/40",
    textBadge: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.45)",
    gradientId: "risk-low-grad",
    fillHex: "rgba(16, 185, 129, 0.45)",
    hoverFillHex: "rgba(16, 185, 129, 0.78)",
  },
};

// ─── COMPONENT: HEATMAP ───────────────────────────────────────────────────────

export default function Heatmap() {
  const navigate = useNavigate();
  const location = useLocation();

  const incomingAlert = location.state as {
    district?: string;
    confidence?: number;
    riskScore?: number;
    vegetationLoss?: number;
    affectedArea?: number;
    fromAlerts?: boolean;
  } | null;
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<
    "All" | RiskLevel
  >("All");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() =>
    incomingAlert?.fromAlerts && incomingAlert.district ? incomingAlert.district : "kolkata"
  );
  const [prevAlert, setPrevAlert] = useState(incomingAlert);

  if (incomingAlert !== prevAlert) {
    setPrevAlert(incomingAlert);
    if (incomingAlert?.fromAlerts && incomingAlert.district) {
      setSelectedDistrictId(incomingAlert.district);
    }
  }
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(
    null
  );
  const [showLabels, setShowLabels] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [actionToast, setActionToast] = useState<string | null>(null);
  // SVG ref
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Selected district
  const selectedDistrict = useMemo(
    () =>
      DISTRICTS_DATA.find((d) => d.id === selectedDistrictId) ||
      DISTRICTS_DATA[0],
    [selectedDistrictId]
  );

  // Hovered district
  const hoveredDistrict = useMemo(
    () =>
      hoveredDistrictId
        ? DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId) || null
        : null,
    [hoveredDistrictId]
  );

  // Filtered districts for left panel
  const filteredDistricts = useMemo(() => {
    return DISTRICTS_DATA.filter((district) => {
      const matchesSearch =
        district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        district.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        district.hq.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk =
        selectedRiskFilter === "All" || district.riskLevel === selectedRiskFilter;

      return matchesSearch && matchesRisk;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [searchQuery, selectedRiskFilter]);

  // Statistics counters
  const counts = useMemo(() => {
    return {
      total: DISTRICTS_DATA.length,
      critical: DISTRICTS_DATA.filter((d) => d.riskLevel === "Critical").length,
      high: DISTRICTS_DATA.filter((d) => d.riskLevel === "High").length,
      medium: DISTRICTS_DATA.filter((d) => d.riskLevel === "Medium").length,
      low: DISTRICTS_DATA.filter((d) => d.riskLevel === "Low").length,
    };
  }, []);

  // Toast trigger
  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => {
      setActionToast(null);
    }, 3500);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleZoomReset = () => setZoomLevel(1);

  // Navigation to Detection Viewer
  const handleViewDetection = () => {
    const confidence = Math.min(
      98,
      Math.max(88, Math.round(selectedDistrict.riskScore * 0.95 + 4))
    );
    const affectedArea = +(selectedDistrict.encroachmentCases * 0.55 + 2.5).toFixed(1);
    const vegetationLoss = -Math.abs(selectedDistrict.vegetationLoss || 12.8);

    navigate("/prediction", {
      state: {
        district: selectedDistrict.name,
        confidence,
        vegetationLoss,
        affectedArea,
        riskScore: selectedDistrict.riskScore,
        autoLoad: true,
      },
    });
  };

  return (
    <div className="relative w-full space-y-6 pb-12 fade-up select-none">
      {/* ── Background Atmospheric Emerald Radiance ── */}
      <div
        className="pointer-events-none absolute -top-16 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0.06) 60%, transparent 80%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-80 right-10 w-[500px] h-[500px] rounded-full opacity-15 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.35) 0%, transparent 70%)",
        }}
      />

      {/* ── Top Header Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b121e]/90 border border-emerald-500/20 backdrop-blur-xl shadow-2xl shadow-emerald-950/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                West Bengal AI Risk Heatmap
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Phase 2 MVP Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 flex items-center gap-2">
              <span>State Spatial Encroachment & Ecological Vulnerability Grid</span>
              <span className="text-gray-600">•</span>
              <span className="font-mono text-emerald-400/90 text-xs">
                23 Districts Synced
              </span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Metadata */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-[#070b13] border border-gray-800 flex items-center gap-2 text-gray-300">
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            <span>GEO-ENGINE: ONLINE</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#070b13] border border-gray-800 flex items-center gap-2 text-gray-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI SCAN: 10m/px</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>CRITICAL: {counts.critical}</span>
          </div>
        </div>
      </div>

      {/* ── Action Notification Toast ── */}
      {actionToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{actionToast}</span>
        </div>
      )}

      {/* ── 3-COLUMN RESPONSIVE WORKSTATION LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================================================================== */}
        {/* LEFT PANEL: District Risk Overview & Legend & Search */}
        {/* ==================================================================== */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b121e]/90 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-5">
            {/* Panel Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white tracking-wide">
                  District Risk Overview
                </h2>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                {filteredDistricts.length}/{DISTRICTS_DATA.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district name, HQ..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#070b13] border border-gray-800/90 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Risk Legend */}
            <div className="space-y-2.5 pt-1 border-t border-gray-800/80">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold tracking-wider uppercase">
                <span>Risk Legend</span>
                <span className="text-[10px] text-gray-500">Filter By Tier</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Red = Critical */}
                <button
                  onClick={() =>
                    setSelectedRiskFilter((prev) =>
                      prev === "Critical" ? "All" : "Critical"
                    )
                  }
                  className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${selectedRiskFilter === "Critical"
                    ? "bg-red-500/20 border-red-500 ring-1 ring-red-500/50"
                    : "bg-[#070b13] border-red-500/30 hover:border-red-500/60"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/80 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-red-400">Red</div>
                      <div className="text-[10px] text-gray-400">Critical</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                    {counts.critical}
                  </span>
                </button>

                {/* Orange = High */}
                <button
                  onClick={() =>
                    setSelectedRiskFilter((prev) =>
                      prev === "High" ? "All" : "High"
                    )
                  }
                  className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${selectedRiskFilter === "High"
                    ? "bg-orange-500/20 border-orange-500 ring-1 ring-orange-500/50"
                    : "bg-[#070b13] border-orange-500/30 hover:border-orange-500/60"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/80" />
                    <div>
                      <div className="text-xs font-bold text-orange-400">Orange</div>
                      <div className="text-[10px] text-gray-400">High</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300">
                    {counts.high}
                  </span>
                </button>

                {/* Yellow = Medium */}
                <button
                  onClick={() =>
                    setSelectedRiskFilter((prev) =>
                      prev === "Medium" ? "All" : "Medium"
                    )
                  }
                  className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${selectedRiskFilter === "Medium"
                    ? "bg-yellow-500/20 border-yellow-500 ring-1 ring-yellow-500/50"
                    : "bg-[#070b13] border-yellow-500/30 hover:border-yellow-500/60"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/80" />
                    <div>
                      <div className="text-xs font-bold text-yellow-400">Yellow</div>
                      <div className="text-[10px] text-gray-400">Medium</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                    {counts.medium}
                  </span>
                </button>

                {/* Green = Low */}
                <button
                  onClick={() =>
                    setSelectedRiskFilter((prev) =>
                      prev === "Low" ? "All" : "Low"
                    )
                  }
                  className={`flex items-center justify-between p-2 rounded-xl text-left border transition-all ${selectedRiskFilter === "Low"
                    ? "bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500/50"
                    : "bg-[#070b13] border-emerald-500/30 hover:border-emerald-500/60"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/80" />
                    <div>
                      <div className="text-xs font-bold text-emerald-400">Green</div>
                      <div className="text-[10px] text-gray-400">Low</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {counts.low}
                  </span>
                </button>
              </div>

              {selectedRiskFilter !== "All" && (
                <button
                  onClick={() => setSelectedRiskFilter("All")}
                  className="w-full text-center py-1 text-xs text-emerald-400 hover:text-emerald-300 transition underline underline-offset-4"
                >
                  Reset risk filter (Showing {selectedRiskFilter} only)
                </button>
              )}
            </div>

            {/* Scrollable District List */}
            <div className="space-y-2 pt-2 border-t border-gray-800/80">
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>Districts ({filteredDistricts.length})</span>
                <span className="text-[11px] font-mono text-gray-500">
                  Ranked by AI Score
                </span>
              </div>

              <div className="max-h-[380px] overflow-y-auto pr-1 space-y-1.5">
                {filteredDistricts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500 bg-[#070b13] rounded-xl border border-gray-800/60">
                    No districts match &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredDistricts.map((d) => {
                    const isSelected = d.id === selectedDistrictId;
                    const isHovered = d.id === hoveredDistrictId;
                    const tier = RISK_THEME[d.riskLevel];

                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDistrictId(d.id)}
                        onMouseEnter={() => setHoveredDistrictId(d.id)}
                        onMouseLeave={() => setHoveredDistrictId(null)}
                        className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${isSelected
                          ? "bg-emerald-500/15 border-emerald-500/60 shadow-md shadow-emerald-950/40"
                          : isHovered
                            ? "bg-[#0e1726] border-gray-700"
                            : "bg-[#070b13] border-gray-800/70 hover:border-gray-700"
                          }`}
                      >
                        {/* Active Selection Indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-emerald-400" />
                        )}

                        <div className="pl-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-200 group-hover:text-white transition">
                              {d.name}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              {d.code}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{d.encroachmentCases} cases</span>
                            <span>•</span>
                            <span className="text-gray-500">
                              {d.vegetationLoss}% loss
                            </span>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div className="flex items-center gap-2">
                          <div className="w-12 text-right">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-extrabold border ${tier.bgBadge} ${tier.borderBadge} ${tier.textBadge}`}
                            >
                              {d.riskScore}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CENTER PANEL: West Bengal District SVG Map */}
        {/* ==================================================================== */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="relative rounded-2xl bg-[#0b121e]/95 border border-emerald-500/30 backdrop-blur-xl shadow-2xl p-4 sm:p-5 flex flex-col overflow-hidden">
            {/* Map Canvas Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-800/90">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold tracking-wider text-emerald-300 uppercase">
                  WB Tactical Spatial Surface
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono text-gray-500">
                  EPSG:4326 // WGS84
                </span>
              </div>

              {/* Viewport Control Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition ${showLabels
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-[#070b13] border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  title="Toggle District Labels"
                >
                  Labels: {showLabels ? "ON" : "OFF"}
                </button>

                <button
                  onClick={() => setShowRivers(!showRivers)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition ${showRivers
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                    : "bg-[#070b13] border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  title="Toggle Hooghly River Channel"
                >
                  River: {showRivers ? "ON" : "OFF"}
                </button>

                <div className="h-4 w-px bg-gray-800 mx-1" />

                <button
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg bg-[#070b13] border border-gray-800 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg bg-[#070b13] border border-gray-800 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleZoomReset}
                  className="p-1.5 rounded-lg bg-[#070b13] border border-gray-800 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 transition"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SVG MAP CONTAINER */}
            <div
              ref={svgContainerRef}
              className="relative w-full aspect-[520/660] max-h-[640px] mt-3 rounded-xl bg-[#060a11] border border-emerald-500/20 flex items-center justify-center overflow-hidden"
            >
              {/* Tactical coordinate grid background */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(16,185,129,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.2) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Tactical compass indicator */}
              <div className="absolute top-3 right-3 pointer-events-none flex flex-col items-center gap-0.5 text-emerald-400/80 font-mono text-[10px] bg-[#090d16]/80 px-2 py-1.5 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span className="font-bold">N</span>
              </div>

              {/* Live Hover Float Badge (top-left) */}
              <div className="absolute top-3 left-3 pointer-events-none z-20">
                {hoveredDistrict ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090d16]/95 border border-emerald-500/50 shadow-xl backdrop-blur-md">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          RISK_THEME[hoveredDistrict.riskLevel].color,
                      }}
                    />
                    <div className="text-xs font-bold text-white">
                      {hoveredDistrict.name}
                    </div>
                    <span className="text-xs font-mono font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      Score: {hoveredDistrict.riskScore}
                    </span>
                    <span
                      className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded"
                      style={{
                        color: RISK_THEME[hoveredDistrict.riskLevel].color,
                        backgroundColor: `${RISK_THEME[hoveredDistrict.riskLevel].color
                          }22`,
                      }}
                    >
                      {hoveredDistrict.riskLevel}
                    </span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-lg bg-[#090d16]/80 border border-gray-800 text-[11px] text-gray-400 font-mono">
                    Hover a district to inspect risk
                  </div>
                )}
              </div>

              {/* Pure SVG Map with Zoom and Pan Transform */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
              >
                <svg
                  viewBox="0 0 520 720"
                  className="w-full h-full max-h-[630px] select-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* SVG Definitions */}
                  <defs>
                    {/* Gradients for risk levels */}
                    <linearGradient
                      id="risk-crit-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#991B1B" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient
                      id="risk-high-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#C2410C" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient
                      id="risk-med-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#EAB308" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#A16207" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient
                      id="risk-low-grad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Glow Filter for Selected District */}
                    <filter
                      id="district-glow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Latitude / Longitude lines */}
                  <g
                    stroke="rgba(16,185,129,0.12)"
                    strokeDasharray="4 6"
                    strokeWidth="0.8"
                  >
                    <line x1="30" y1="100" x2="490" y2="100" />
                    <line x1="30" y1="260" x2="490" y2="260" />
                    <line x1="30" y1="420" x2="490" y2="420" />
                    <line x1="30" y1="580" x2="490" y2="580" />
                    <line x1="140" y1="30" x2="140" y2="690" />
                    <line x1="280" y1="30" x2="280" y2="690" />
                    <line x1="420" y1="30" x2="420" y2="690" />
                  </g>

                  {/* State Boundary Silhouette Backdrop */}
                  <path
                    d="M 215 35 L 245 22 L 305 25 L 322 48 L 365 65 L 415 70 L 420 98 L 410 135 L 400 165 L 358 162 L 332 192 L 335 225 L 298 235 L 272 242 L 268 280 L 295 295 L 320 325 L 312 360 L 338 388 L 332 438 L 365 462 L 368 522 L 382 575 L 372 652 L 328 665 L 292 642 L 272 608 L 225 602 L 198 582 L 135 582 L 92 572 L 85 530 L 68 465 L 55 428 L 62 398 L 120 405 L 132 382 L 165 360 L 168 328 L 205 258 L 210 225 L 212 150 L 225 115 L 245 110 L 222 82 L 208 62 Z"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.4)"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter="url(#district-glow)"
                  />

                  {/* ── 23 WEST BENGAL DISTRICT POLYGONS ── */}
                  <g id="wb-districts-group">
                    {DISTRICTS_DATA.map((district) => {
                      const isSelected = district.id === selectedDistrictId;
                      const isHovered = district.id === hoveredDistrictId;
                      const tier = RISK_THEME[district.riskLevel];

                      // Dynamic styling based on state
                      const fill = isSelected
                        ? tier.hoverFillHex
                        : isHovered
                          ? tier.hoverFillHex
                          : tier.fillHex;

                      const stroke = isSelected
                        ? "#FFFFFF"
                        : isHovered
                          ? tier.stroke
                          : "rgba(9, 13, 22, 0.9)";

                      const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 1.2;

                      return (
                        <path
                          key={district.id}
                          d={district.path}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={strokeWidth}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            filter: isSelected
                              ? `drop-shadow(0 0 10px ${tier.color})`
                              : isHovered
                                ? `drop-shadow(0 0 6px ${tier.color})`
                                : "none",
                          }}
                          onClick={() => setSelectedDistrictId(district.id)}
                          onMouseEnter={() => setHoveredDistrictId(district.id)}
                          onMouseLeave={() => setHoveredDistrictId(null)}
                        >
                          <title>{`${district.name} - Risk Score: ${district.riskScore} (${district.riskLevel})`}</title>
                        </path>
                      );
                    })}
                  </g>

                  {/* Hooghly / Bhagirathi River System Overlay */}
                  {showRivers && (
                    <g pointerEvents="none">
                      <path
                        d="M 218 208 C 235 240 250 270 260 300 C 270 330 275 360 278 400 C 280 440 275 480 275 518 C 275 540 278 570 282 610 C 284 635 292 650 300 665"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.75"
                        filter="drop-shadow(0 0 4px #06b6d4)"
                      />
                      {/* Damodar River branch */}
                      <path
                        d="M 132 382 C 160 410 190 425 222 442 C 240 452 255 470 268 485"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                      {/* River label */}
                      <text
                        x="285"
                        y="360"
                        fill="#67e8f9"
                        fontSize="8"
                        fontFamily="monospace"
                        letterSpacing="1"
                        opacity="0.8"
                      >
                        Bhagirathi-Hooghly River
                      </text>
                    </g>
                  )}

                  {/* District Text Labels */}
                  {showLabels && (
                    <g pointerEvents="none">
                      {DISTRICTS_DATA.map((district) => {
                        const isSelected = district.id === selectedDistrictId;
                        const isHovered = district.id === hoveredDistrictId;
                        const tier = RISK_THEME[district.riskLevel];

                        return (
                          <g
                            key={`label-${district.id}`}
                            transform={`translate(${district.centroid.x}, ${district.centroid.y})`}
                          >
                            {/* Label Background Pill for high readability */}
                            <rect
                              x="-26"
                              y="-8"
                              width="52"
                              height="16"
                              rx="4"
                              fill="#090D16"
                              fillOpacity={isSelected || isHovered ? 0.95 : 0.8}
                              stroke={
                                isSelected
                                  ? "#FFFFFF"
                                  : isHovered
                                    ? tier.color
                                    : "rgba(16,185,129,0.3)"
                              }
                              strokeWidth={isSelected ? 1.5 : 0.8}
                            />
                            {/* District Name Text */}
                            <text
                              x="0"
                              y="1.5"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={
                                isSelected
                                  ? "#FFFFFF"
                                  : isHovered
                                    ? "#F9FAFB"
                                    : "#D1D5DB"
                              }
                              fontSize="8"
                              fontWeight={isSelected || isHovered ? "bold" : "600"}
                              fontFamily="sans-serif"
                            >
                              {district.name.length > 10
                                ? district.code
                                : district.name}
                            </text>
                            {/* Risk score mini tag */}
                            <circle
                              cx="20"
                              cy="-6"
                              r="3.5"
                              fill={tier.color}
                              stroke="#090D16"
                              strokeWidth="1"
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* Selected District Tactical Reticle */}
                  {selectedDistrict && (
                    <g
                      transform={`translate(${selectedDistrict.centroid.x}, ${selectedDistrict.centroid.y})`}
                      pointerEvents="none"
                    >
                      {/* Pulsing Target Rings */}
                      <circle
                        r="18"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="animate-spin-slow"
                        opacity="0.8"
                      />
                      <circle
                        r="10"
                        fill="none"
                        stroke={RISK_THEME[selectedDistrict.riskLevel].color}
                        strokeWidth="2"
                        className="animate-ping"
                        opacity="0.75"
                      />
                      <circle
                        r="3.5"
                        fill="#FFFFFF"
                        stroke={RISK_THEME[selectedDistrict.riskLevel].color}
                        strokeWidth="1.5"
                      />
                      {/* Reticle Crosshairs */}
                      <line
                        x1="-24"
                        y1="0"
                        x2="-12"
                        y2="0"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="12"
                        y1="0"
                        x2="24"
                        y2="0"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="0"
                        y1="-24"
                        x2="0"
                        y2="-12"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="0"
                        y1="12"
                        x2="0"
                        y2="24"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>
              </div>

              {/* Bottom Map Status Bar */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-gray-400 pointer-events-none bg-[#090d16]/80 px-3 py-1.5 rounded-lg border border-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>
                    TARGET:{" "}
                    <strong className="text-white">
                      {selectedDistrict.name}
                    </strong>{" "}
                    [{selectedDistrict.coordinates.lat.toFixed(2)}°N,{" "}
                    {selectedDistrict.coordinates.lng.toFixed(2)}°E]
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span>AI RISK:</span>
                  <span
                    className="font-bold px-1.5 py-0.2 rounded"
                    style={{
                      color: RISK_THEME[selectedDistrict.riskLevel].color,
                      backgroundColor: `${RISK_THEME[selectedDistrict.riskLevel].color
                        }20`,
                    }}
                  >
                    {selectedDistrict.riskScore}/100 [
                    {selectedDistrict.riskLevel.toUpperCase()}]
                  </span>
                </div>
              </div>
            </div>

            {/* Helper Hint Footer */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Click district polygon or left list to inspect detailed GIS dossier
              </span>
              <span className="text-[11px] font-mono text-emerald-400/80">
                Vector Precision: 0.05 km²
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT PANEL: Selected District Card */}
        {/* ==================================================================== */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="p-5 rounded-2xl bg-[#0b121e]/95 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-5">
            {/* Header: Selected District Card */}
            <div className="flex items-center justify-between border-b border-gray-800/90 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white tracking-wide">
                  Selected District Card
                </h2>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-extrabold uppercase border ${RISK_THEME[selectedDistrict.riskLevel].bgBadge
                  } ${RISK_THEME[selectedDistrict.riskLevel].borderBadge} ${RISK_THEME[selectedDistrict.riskLevel].textBadge
                  }`}
              >
                {selectedDistrict.riskLevel}
              </span>
            </div>

            {/* District Identity Header */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {selectedDistrict.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    HQ: {selectedDistrict.hq} • Code: {selectedDistrict.code}
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-gray-400">
                  <div>{selectedDistrict.areaKm2.toLocaleString()} km²</div>
                  <div className="text-[10px] text-gray-500">Total Area</div>
                </div>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#070b13] border border-gray-800 text-[11px] text-emerald-300 font-medium">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{selectedDistrict.zoneType}</span>
              </div>
            </div>

            {/* AI Risk Score Prominent Meter */}
            <div className="p-4 rounded-xl bg-[#070b13] border border-emerald-500/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  AI Risk Score
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{
                    color: RISK_THEME[selectedDistrict.riskLevel].color,
                  }}
                >
                  {selectedDistrict.riskLevel.toUpperCase()} RISK
                </span>
              </div>

              {/* Large Score Display & Circular Progress Ring */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
                      {selectedDistrict.riskScore}
                    </span>
                    <span className="text-gray-500 text-sm font-mono">/100</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Threat Index calibrated via multispectral satellite feeds
                  </p>
                </div>

                {/* Mini Visual Score Ring */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#1f2937"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={RISK_THEME[selectedDistrict.riskLevel].color}
                      strokeWidth="5"
                      strokeDasharray={163.36}
                      strokeDashoffset={
                        163.36 - (163.36 * selectedDistrict.riskScore) / 100
                      }
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <Activity
                    className="absolute w-5 h-5"
                    style={{
                      color: RISK_THEME[selectedDistrict.riskLevel].color,
                    }}
                  />
                </div>
              </div>

              {/* Linear Progress Indicator */}
              <div className="w-full bg-gray-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${selectedDistrict.riskScore}%`,
                    backgroundColor:
                      RISK_THEME[selectedDistrict.riskLevel].color,
                    boxShadow: `0 0 10px ${RISK_THEME[selectedDistrict.riskLevel].color
                      }`,
                  }}
                />
              </div>
            </div>

            {/* Metric Grid: Encroachment Cases, Last Satellite Scan, Vegetation Loss */}
            <div className="grid grid-cols-1 gap-3">
              {/* Encroachment Cases */}
              <div className="p-3.5 rounded-xl bg-[#070b13] border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">
                      Encroachment Cases
                    </div>
                    <div className="text-lg font-bold font-mono text-white">
                      {selectedDistrict.encroachmentCases} Active
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-400 font-semibold">
                  +3 this wk
                </span>
              </div>

              {/* Last Satellite Scan */}
              <div className="p-3.5 rounded-xl bg-[#070b13] border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Satellite className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">
                      Last Satellite Scan
                    </div>
                    <div className="text-sm font-bold font-mono text-white">
                      {selectedDistrict.lastSatelliteScan}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  {selectedDistrict.satelliteProvider}
                </span>
              </div>

              {/* Vegetation Loss % */}
              <div className="p-3.5 rounded-xl bg-[#070b13] border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">
                      Vegetation Loss %
                    </div>
                    <div className="text-lg font-bold font-mono text-orange-300">
                      {selectedDistrict.vegetationLoss}%
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  MoM Delta: +0.4%
                </span>
              </div>
            </div>

            {/* Primary Threat Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/20 border border-emerald-500/20 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Primary Threat Vector
              </div>
              <div className="text-xs text-gray-200 leading-relaxed font-medium">
                {selectedDistrict.primaryThreat}
              </div>
            </div>

            {/* 6-Month Risk History Trend Sparkline */}
            <div className="p-3.5 rounded-xl bg-[#070b13] border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>6-Month AI Risk Trend</span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  {selectedDistrict.historicalTrend[0]} →{" "}
                  {
                    selectedDistrict.historicalTrend[
                    selectedDistrict.historicalTrend.length - 1
                    ]
                  }
                </span>
              </div>
              <div className="flex items-end gap-1.5 h-10 pt-2">
                {selectedDistrict.historicalTrend.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 group/bar"
                  >
                    <div
                      className="w-full rounded-t transition-all duration-300 group-hover/bar:brightness-125"
                      style={{
                        height: `${(val / 100) * 32}px`,
                        backgroundColor:
                          RISK_THEME[selectedDistrict.riskLevel].color,
                        opacity: 0.5 + (idx / 5) * 0.5,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action: "View Detection" Button */}
            <button
              onClick={handleViewDetection}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 font-semibold text-slate-950 transition hover:brightness-110 cursor-pointer"
            >
              View Detection
            </button>

            {/* Secondary Tactical Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() =>
                  triggerToast(
                    `Automated drone dispatch task queued for ${selectedDistrict.name}.`
                  )
                }
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#070b13] border border-gray-800 text-xs text-gray-300 hover:text-emerald-300 hover:border-emerald-500/40 transition"
              >
                <Send className="w-3 h-3 text-emerald-400" />
                <span>Drone Patrol</span>
              </button>

              <button
                onClick={() =>
                  triggerToast(
                    `Generating official LandGuard AI audit PDF for ${selectedDistrict.name}...`
                  )
                }
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#070b13] border border-gray-800 text-xs text-gray-300 hover:text-emerald-300 hover:border-emerald-500/40 transition"
              >
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}