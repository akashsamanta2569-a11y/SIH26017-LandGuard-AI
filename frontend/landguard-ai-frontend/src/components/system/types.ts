export type ServiceStatus = "ONLINE" | "PROCESSING" | "SYNCING" | "OFFLINE";

export interface ServiceHealthItem {
  id: string;
  name: string;
  status: ServiceStatus;
  latency: number;
  uptime: number;
  color: "green" | "cyan" | "yellow" | "orange" | "red" | string;
}

export interface ApiHealthData {
  updated: string;
  overallHealth: number;
  services: ServiceHealthItem[];
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: "SYNC" | "INFERENCE" | "CADASTRE" | "EXPORT" | "DISPATCH" | "SYSTEM";
  message: string;
}

export interface LatencyDataPoint {
  time: string;
  sentinel: number;
  cartosat: number;
  fastapi: number;
  mongodb: number;
  cadastre: number;
  yolo: number;
  avgLatency: number;
}
