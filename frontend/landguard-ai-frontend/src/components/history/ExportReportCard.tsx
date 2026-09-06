import { Download } from "lucide-react";
import { generateDetectionReport } from "../../utils/reportGenerator";

interface ExportReportCardProps {
  district: string;
  confidence?: number;
  vegetationLoss?: number;
  affectedArea?: number;
  riskScore?: number;
  threat?: string;
  date?: string;
  onToast?: (message: string) => void;
}

export default function ExportReportCard({
  district,
  confidence = 94,
  vegetationLoss = -12.8,
  affectedArea = 18.6,
  riskScore = 91,
  threat = "Encroachment Detected",
  date,
  onToast,
}: ExportReportCardProps) {
  const handleExport = () => {
    generateDetectionReport({
      district,
      confidence,
      vegetationLoss,
      affectedArea,
      riskScore,
      threat,
      date: date ?? "Latest AI Scan",
    });

    onToast?.("📄 PDF Report Exported Successfully");
  };

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/80 p-5 shadow-xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-2">
        Detection Dossier
      </p>

      <h3 className="text-xl font-bold text-white mb-2">
        Export Investigation Report
      </h3>

      <p className="text-sm text-slate-400 mb-5">
        Generate an official PDF summary for the latest satellite AI detection.
      </p>

      <button
        type="button"
        onClick={handleExport}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-950/40 transition hover:brightness-110 active:scale-[0.99] cursor-pointer"
      >
        <Download className="h-4 w-4 text-slate-950" />
        <span>Export PDF Report</span>
      </button>
    </div>
  );
}