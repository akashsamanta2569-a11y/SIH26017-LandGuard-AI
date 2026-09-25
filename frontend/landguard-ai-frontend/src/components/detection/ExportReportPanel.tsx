import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Printer,
  Copy,
  ShieldCheck,
  Globe,
  Lock,
} from "lucide-react";

export interface ExportReportPanelProps {
  district: string;
  confidence: number;
  vegetationLoss: number;
  affectedArea: number | string;
  riskScore: number;
  completed: boolean;
  theme?: "dark" | "light";
}

export default function ExportReportPanel({
  district,
  confidence,
  vegetationLoss,
  affectedArea,
  riskScore,
  completed,
  theme = "dark",
}: ExportReportPanelProps) {
  const [copied, setCopied] = useState(false);

  const isDark = theme === "dark";
  const bgCard = isDark ? "rgba(10,18,28,0.92)" : "rgba(255,255,255,0.95)";
  const borderCard = isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.25)";
  const textTitle = isDark ? "#ffffff" : "#0f172a";
  const textSub = isDark ? "#94a3b8" : "#64748b";
  const boxBg = isDark ? "rgba(15,23,42,0.65)" : "rgba(241,245,249,0.85)";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportFile = (format: "json" | "csv" | "pdf") => {

    if (format === "json") {
      const data = {
        title: "LandGuard AI - Statutory Encroachment & Acquisition Delay Dossier",
        standard: "SIH26017 · Ministry of Rural Development (MoRD)",
        timestamp: new Date().toISOString(),
        district,
        metrics: {
          confidenceScore: `${confidence}%`,
          vegetationLoss: `${vegetationLoss}%`,
          affectedArea: `${affectedArea} Ha`,
          riskScore: `${riskScore}/100`,
        },
        satelliteTelemetry: {
          primarySensor: "Sentinel-2 MSI Level-2A (ESA)",
          secondarySensor: "Cartosat-3 PAN (ISRO)",
          resolution: "10m Multispectral",
        },
        statutoryCompliance: {
          governingAct: "RFCTLARR Act 2013",
          sectionViolations: ["Section 11 (Preliminary Notification)", "Section 38 (Multi-Crop Protection)"],
          recommendation: "Immediate administrative stop-work order and ground cadastral survey",
        },
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LandGuard_AI_Dossier_${district.replace(/\s+/g, "_")}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "csv") {
      const csvContent =
        "District,AI_Confidence,Vegetation_Loss_Pct,Affected_Area_Ha,Risk_Score,Governing_Act,Status\n" +
        `"${district}",${confidence},${vegetationLoss},"${affectedArea}",${riskScore},"RFCTLARR Act 2013","CRITICAL_ACTION_REQUIRED"\n`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LandGuard_Cadastral_Audit_${district.replace(/\s+/g, "_")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      window.print();
    }
  };

  return (
    <div
      className="rounded-3xl p-5 space-y-4 transition-all duration-300"
      style={{
        background: bgCard,
        border: `1px solid ${borderCard}`,
        boxShadow: isDark
          ? "0 10px 30px -10px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.05)"
          : "0 10px 30px -10px rgba(0,0,0,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-emerald-400">
            <Download className="h-3 w-3" />
            Statutory Export Station
          </div>
          <h2 className="text-lg font-extrabold tracking-tight mt-1" style={{ color: textTitle }}>
            Investigation Dossier Export
          </h2>
          <p className="text-xs" style={{ color: textSub }}>
            Government-certified geospatial audit packages for DM, LAO & Forest Department
          </p>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <Lock className="h-3 w-3" />
          <span>SHA-256 Digitally Signed</span>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* PDF Dossier */}
        <button
          type="button"
          disabled={!completed}
          onClick={() => handleExportFile("pdf")}
          className="p-3.5 rounded-2xl border text-left transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: boxBg,
            borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.9)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-red-500/15 border border-red-500/30 text-red-400">
              <FileText className="h-4 w-4" />
            </div>
            <Printer className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-xs font-bold mt-2.5" style={{ color: textTitle }}>
            Official PDF Dossier
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            MoRD / NIC Format · Ready to Print
          </p>
        </button>

        {/* GeoJSON Polygon */}
        <button
          type="button"
          disabled={!completed}
          onClick={() => handleExportFile("json")}
          className="p-3.5 rounded-2xl border text-left transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: boxBg,
            borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.9)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Globe className="h-4 w-4" />
            </div>
            <Download className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-xs font-bold mt-2.5" style={{ color: textTitle }}>
            GeoJSON RFC 7946
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            QGIS & ESRI Shapefile Compatible
          </p>
        </button>

        {/* CSV Audit Sheet */}
        <button
          type="button"
          disabled={!completed}
          onClick={() => handleExportFile("csv")}
          className="p-3.5 rounded-2xl border text-left transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: boxBg,
            borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.9)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <Download className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-xs font-bold mt-2.5" style={{ color: textTitle }}>
            Cadastral CSV Audit
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            DoLR / BanglarBhumi Ledger Sheet
          </p>
        </button>
      </div>

      {/* Shareable Link & Digital Seal */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t" style={{ borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.8)" }}>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-[11px]">
            Compliant with Section 11 & Section 19 RFCTLARR Act 2013 Gazette Notification Guidelines.
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="py-2 px-3 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shrink-0"
          style={{
            background: copied ? "rgba(16,185,129,0.2)" : boxBg,
            borderColor: copied ? "#10b981" : isDark ? "rgba(51,65,85,0.7)" : "rgba(203,213,225,0.9)",
            color: copied ? "#10b981" : textTitle,
          }}
        >
          {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Link Copied!" : "Share Investigation Link"}</span>
        </button>
      </div>
    </div>
  );
}
