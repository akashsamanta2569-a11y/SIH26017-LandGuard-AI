export interface AlertItem {
  id: string;
  district: string;
  confidence: number;
  riskScore: number;
  vegetationLoss: number;
  affectedArea: number;
  timestamp: string;
  status: "NEW" | "ACTIVE";
}