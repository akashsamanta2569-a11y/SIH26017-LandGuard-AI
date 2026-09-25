export interface AlertItem {
  id: string;
  district: string;
  confidence: number;
  riskScore: number;
  vegetationLoss: number;
  affectedArea: number;
  timestamp: string;
  status: "NEW" | "ACTIVE";
  severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priority?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}