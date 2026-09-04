// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalAlerts: number;
  resolvedAlerts: number;
  pendingAlerts: number;
  activeProjects: number;
  riskScore: number;
  lastUpdated: string;
}

export interface DepartmentChartItem {
  department: string;
  count: number;
}

export interface StatusChartItem {
  status: string;
  value: number;
}

export interface TopRiskDistrict {
  district: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  score: number;
  lat: number;
  lng: number;
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type AlertSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type AlertStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  detectedAt: string;
  updatedAt: string;
  imageUrl?: string;
  confidence?: number;
}

// ─── Prediction ───────────────────────────────────────────────────────────────

export type DetectionClass =
  | "encroachment"
  | "deforestation"
  | "construction"
  | "water_body_change"
  | "vegetation_loss"
  | "unknown";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  class: DetectionClass;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface PredictionResult {
  id: string;
  imageUrl: string;
  annotatedImageUrl?: string;
  detections: Detection[];
  riskScore: number;
  processedAt: string;
  district?: string;
  uploadedBy?: string;
}

// ─── GIS / Heatmap ───────────────────────────────────────────────────────────

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  district: string;
  alertCount: number;
}

export interface GisLayer {
  id: string;
  name: string;
  type: "heatmap" | "marker" | "polygon";
  visible: boolean;
  color?: string;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "PENDING" | "ARCHIVED";

export interface Project {
  id: string;
  name: string;
  description: string;
  department: string;
  district: string;
  status: ProjectStatus;
  riskLevel: AlertSeverity;
  startDate: string;
  endDate?: string;
  alertCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Wrapper ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
