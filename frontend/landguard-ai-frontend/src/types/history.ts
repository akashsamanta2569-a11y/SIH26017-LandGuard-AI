export interface HistoryItem {
  id?: string | number;

  district: string;
  date: string;
  threat: string;

  beforeImage?: string;
  afterImage?: string;

  confidence?: number;

  // 👇 Allow number OR formatted string ("-12.8%", "18.6 Ha")
  vegetationLoss?: number | string;
  affectedArea?: number | string;

  riskScore?: number;

  severity?: "Critical" | "High" | "Medium" | "Low";

  isNew?: boolean;
}