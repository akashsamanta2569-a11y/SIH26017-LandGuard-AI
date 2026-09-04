import {
  LayoutDashboard,
  MapPin,
  Bell,
  Brain,
  History,
  Layers,
  FolderKanban,
} from "lucide-react";

// ─── Color Palette ───────────────────────────────────────────────────────────

export const COLORS = {
  background: "#090D16",
  surface: "#101826",
  card: "#111827",
  border: "#1F2937",

  primary: "#10B981",   // emerald-500
  primaryDark: "#059669", // emerald-600
  teal: "#14B8A6",
  blue: "#2563EB",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",

  text: "#F9FAFB",
  muted: "#94A3B8",
  subtle: "#6B7280",
} as const;

// ─── App Routes ──────────────────────────────────────────────────────────────

export const APP_ROUTES = {
  DASHBOARD: "/",
  HEATMAP: "/heatmap",
  ALERTS: "/alerts",
  PREDICTION: "/prediction",
  PREDICTION_HISTORY: "/history",
  GIS_MAP: "/gis",
  PROJECTS: "/projects",
  DETECTION: "/detection",
} as const;

// ─── Navigation Items ────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: APP_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    key: "heatmap",
    label: "Risk Heatmap",
    path: APP_ROUTES.HEATMAP,
    icon: MapPin,
  },
  {
    key: "alerts",
    label: "Live Alerts",
    path: APP_ROUTES.ALERTS,
    icon: Bell,
  },
  {
    key: "prediction",
    label: "AI Prediction",
    path: APP_ROUTES.PREDICTION,
    icon: Brain,
  },
  {
    key: "history",
    label: "History",
    path: APP_ROUTES.PREDICTION_HISTORY,
    icon: History,
  },
  {
    key: "gis",
    label: "GIS Map",
    path: APP_ROUTES.GIS_MAP,
    icon: Layers,
  },
  {
    key: "projects",
    label: "Projects",
    path: APP_ROUTES.PROJECTS,
    icon: FolderKanban,
  },
] as const;

// ─── Severity Config ─────────────────────────────────────────────────────────

export const SEVERITY_CONFIG = {
  CRITICAL: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", label: "Critical" },
  HIGH:     { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", label: "High" },
  MEDIUM:   { color: "#2563EB", bg: "rgba(37,99,235,0.12)", label: "Medium" },
  LOW:      { color: "#10B981", bg: "rgba(16,185,129,0.12)", label: "Low" },
} as const;

// ─── Status Config ───────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  OPEN:        { color: "#EF4444", label: "Open" },
  IN_PROGRESS: { color: "#F59E0B", label: "In Progress" },
  RESOLVED:    { color: "#10B981", label: "Resolved" },
  DISMISSED:   { color: "#6B7280", label: "Dismissed" },
} as const;

// ─── API ──────────────────────────────────────────────────────────────────────

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

// ─── Map Defaults (West Bengal) ───────────────────────────────────────────────

export const MAP_DEFAULTS = {
  center: [22.9868, 87.855] as [number, number],
  zoom: 7,
  maxZoom: 18,
  minZoom: 5,
} as const;