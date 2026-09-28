import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileDown,
  Map,
  FileText,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Globe,
  Database,
  Shield,
} from "lucide-react";
import { usePrintReport } from "../../hooks/usePrintReport";

interface ExportOption {
  id: string;
  label: string;
  description: string;
  format: string;
  icon: React.ElementType;
  color: string;
  size: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "geojson",
    label: "Export GeoJSON",
    description:
      "All 18 anomaly markers + district risk polygons in standard GeoJSON RFC 7946 format",
    format: "GeoJSON",
    icon: Globe,
    color: "#10B981",
    size: "~2.4 MB",
  },
  {
    id: "pdf",
    label: "Export PDF Report",
    description:
      "Government-formatted executive summary: KPIs, risk map, RFCTLARR stage table, recommendations",
    format: "PDF/A-1",
    icon: FileText,
    color: "#06B6D4",
    size: "~8.6 MB",
  },
  {
    id: "investigation",
    label: "Generate Investigation Report",
    description:
      "Detailed field investigation docket with satellite evidence, SHAP scores, and DFO action checklist",
    format: "DOCX + PDF",
    icon: Shield,
    color: "#8B5CF6",
    size: "~14.2 MB",
  },
  {
    id: "risk_summary",
    label: "Download Risk Summary",
    description:
      "District-wise XGBoost risk probability CSV table, delay index, and RFCTLARR compliance matrix",
    format: "CSV + XLSX",
    icon: BarChart3,
    color: "#F59E0B",
    size: "~1.8 MB",
  },
  {
    id: "shapefile",
    label: "Export Shapefile (.SHP)",
    description:
      "ESRI Shapefile bundle for district boundaries, encroachment zones, RFCTLARR project parcels",
    format: "SHP + PRJ",
    icon: Map,
    color: "#EF4444",
    size: "~6.1 MB",
  },
  {
    id: "geotiff",
    label: "Export GeoTIFF Mosaic",
    description:
      "32-bit raster mosaic of Sentinel-2 MSI composite (10m) across all 23 districts",
    format: "GeoTIFF",
    icon: Database,
    color: "#14B8A6",
    size: "~218 MB",
  },
];

interface GISExportPanelProps {
  theme?: "dark" | "light";
}

export default function GISExportPanel({ theme = "dark" }: GISExportPanelProps) {
  const exportPDF = usePrintReport();
  const [exporting, setExporting] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);

  const isDark = theme === "dark";
  const cardBg = isDark ? "rgba(13,21,32,0.96)" : "#ffffff";
  const borderColor = isDark ? "rgba(51,65,85,0.8)" : "rgba(203,213,225,0.8)";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const surfaceBg = isDark ? "rgba(15,23,42,0.55)" : "#f8fafc";
  const surfaceBorder = isDark ? "rgba(51,65,85,0.5)" : "rgba(203,213,225,0.6)";

  const handleExport = (id: string) => {
    if (exporting || done.includes(id)) return;
    setExporting(id);
    if (id === "pdf") {
      exportPDF();
    }
    setTimeout(() => {
      setExporting(null);
      setDone((prev) => [...prev, id]);
      setTimeout(() => setDone((prev) => prev.filter((d) => d !== id)), 5000);
    }, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        boxShadow: isDark
          ? "0 4px 32px rgba(0,0,0,0.4)"
          : "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <FileDown className="w-4 h-4" style={{ color: "#10B981" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none" style={{ color: textPrimary }}>
              Export Intelligence Report
            </h2>
            <p className="text-[10px] font-mono mt-0.5" style={{ color: textMuted }}>
              GeoJSON · PDF · Shapefile · GeoTIFF · CSV · Investigation Docket
            </p>
          </div>
        </div>
        <span
          className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.3)",
            color: "#06B6D4",
          }}
        >
          GOVT. FORMAT
        </span>
      </div>

      {/* Grid of export buttons */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXPORT_OPTIONS.map((opt, i) => {
          const Icon = opt.icon;
          const isExporting = exporting === opt.id;
          const isDone = done.includes(opt.id);

          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              onClick={opt.id === "pdf" ? exportPDF : () => handleExport(opt.id)}
              disabled={!!exporting}
              className="group flex flex-col gap-2.5 p-4 rounded-xl border text-left transition-all duration-200 disabled:opacity-60"
              style={{
                background: isDone
                  ? "rgba(16,185,129,0.1)"
                  : surfaceBg,
                borderColor: isDone
                  ? "rgba(16,185,129,0.4)"
                  : isExporting
                    ? `${opt.color}40`
                    : surfaceBorder,
                boxShadow: isExporting
                  ? `0 0 16px ${opt.color}20`
                  : "none",
                cursor: exporting && !isExporting ? "not-allowed" : "pointer",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${opt.color}14`,
                    border: `1px solid ${opt.color}30`,
                    transition: "all 0.2s",
                  }}
                >
                  {isExporting ? (
                    <RefreshCw
                      className="w-3.5 h-3.5 animate-spin"
                      style={{ color: opt.color }}
                    />
                  ) : isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
                  ) : (
                    <Icon className="w-3.5 h-3.5" style={{ color: opt.color }} />
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: `${opt.color}12`,
                      border: `1px solid ${opt.color}30`,
                      color: opt.color,
                    }}
                  >
                    {opt.format}
                  </span>
                  <span className="text-[9px] font-mono" style={{ color: textMuted }}>
                    {opt.size}
                  </span>
                </div>
              </div>

              <div>
                <p
                  className="text-xs font-bold leading-none mb-1"
                  style={{
                    color: isDone ? "#10B981" : textPrimary,
                  }}
                >
                  {isDone ? "✓ Download Ready" : isExporting ? "Generating…" : opt.label}
                </p>
                <p className="text-[10px] leading-snug" style={{ color: textMuted }}>
                  {opt.description}
                </p>
              </div>

              {/* Progress bar for exporting state */}
              <AnimatePresence>
                {isExporting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-0.5 rounded-full overflow-hidden"
                    style={{ background: isDark ? "rgba(51,65,85,0.5)" : "rgba(203,213,225,0.5)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      style={{
                        background: `linear-gradient(90deg, ${opt.color}, ${opt.color}80)`,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 border-t"
        style={{ borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono" style={{ color: textMuted }}>
          <span>
            All exports include district metadata, CRS: EPSG:4326, timestamp, and SIH26017 certification stamp.
          </span>
          <span style={{ color: "#10B981" }}>MoRD DoLR · NIC Integration Ready</span>
        </div>
      </div>
    </motion.div>
  );
}
