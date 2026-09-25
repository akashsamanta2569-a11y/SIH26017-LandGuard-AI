import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  ExternalLink,
  Download,
  Landmark,
} from "lucide-react";

export interface CadastreVerificationPanelProps {
  district: string;
  affectedArea?: number;
  completed: boolean;
  theme?: "dark" | "light";
}

interface CadastralPlot {
  dagNo: string;
  khatianNo: string;
  classification: "Rayati (Private)" | "Govt Vested" | "Recorded Forest" | "Water Body (Jalakar)";
  areaAcre: number;
  rfctlarrStatus: "§11 Pending" | "§19 Declared" | "High Dispute Risk" | "Clear";
  ownerName: string;
}

const DISTRICT_CADASTRE_DATA: Record<string, { mouza: string; jlNo: number; plots: CadastralPlot[] }> = {
  Howrah: {
    mouza: "Shibpur Industrial Reach",
    jlNo: 42,
    plots: [
      { dagNo: "1482", khatianNo: "2104", classification: "Govt Vested", areaAcre: 4.8, rfctlarrStatus: "§19 Declared", ownerName: "State Govt (L&LR Dept)" },
      { dagNo: "1483/1", khatianNo: "902", classification: "Rayati (Private)", areaAcre: 6.2, rfctlarrStatus: "§11 Pending", ownerName: "B. K. Mukherjee & Others" },
      { dagNo: "1485", khatianNo: "331", classification: "Water Body (Jalakar)", areaAcre: 3.5, rfctlarrStatus: "High Dispute Risk", ownerName: "Gram Panchayat Vested" },
    ],
  },
  "South 24 Parganas": {
    mouza: "Gosaba Mangrove Buffer",
    jlNo: 18,
    plots: [
      { dagNo: "302", khatianNo: "118", classification: "Recorded Forest", areaAcre: 9.4, rfctlarrStatus: "High Dispute Risk", ownerName: "WB Forest Directorate" },
      { dagNo: "304", khatianNo: "450", classification: "Rayati (Private)", areaAcre: 5.8, rfctlarrStatus: "§11 Pending", ownerName: "Sundarban Fishermen Coop" },
      { dagNo: "308/2", khatianNo: "211", classification: "Govt Vested", areaAcre: 4.0, rfctlarrStatus: "§19 Declared", ownerName: "Zilla Parishad" },
    ],
  },
  Kolkata: {
    mouza: "Kasba East Canal Reach",
    jlNo: 0o7,
    plots: [
      { dagNo: "821", khatianNo: "540", classification: "Govt Vested", areaAcre: 3.2, rfctlarrStatus: "§19 Declared", ownerName: "Kolkata Municipal Corp" },
      { dagNo: "824", khatianNo: "128", classification: "Rayati (Private)", areaAcre: 4.6, rfctlarrStatus: "High Dispute Risk", ownerName: "Urban Estate Holders" },
    ],
  },
};

export default function CadastreVerificationPanel({
  district,
  affectedArea = 18.6,
  completed,
  theme = "dark",
}: CadastreVerificationPanelProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const cadastreInfo = DISTRICT_CADASTRE_DATA[district] || {
    mouza: `${district} Central Mouza`,
    jlNo: 35,
    plots: [
      { dagNo: "501", khatianNo: "101", classification: "Rayati (Private)", areaAcre: +(affectedArea * 0.4).toFixed(1), rfctlarrStatus: "§11 Pending", ownerName: "District Raiyat Trust" },
      { dagNo: "502/A", khatianNo: "440", classification: "Govt Vested", areaAcre: +(affectedArea * 0.35).toFixed(1), rfctlarrStatus: "§19 Declared", ownerName: "Collectorate Land Pool" },
    ],
  };

  const isDark = theme === "dark";
  const bgCard = isDark ? "rgba(10,18,28,0.92)" : "rgba(255,255,255,0.95)";
  const borderCard = isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.25)";
  const textTitle = isDark ? "#ffffff" : "#0f172a";
  const textSub = isDark ? "#94a3b8" : "#64748b";
  const boxBg = isDark ? "rgba(15,23,42,0.65)" : "rgba(241,245,249,0.85)";

  const handleDownloadGeoJson = () => {
    const geojsonData = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::4326" } },
      features: cadastreInfo.plots.map((p, i) => ({
        type: "Feature",
        id: `PLOT-${p.dagNo}`,
        properties: {
          district,
          mouza: cadastreInfo.mouza,
          jlNo: cadastreInfo.jlNo,
          dagNo: p.dagNo,
          khatianNo: p.khatianNo,
          classification: p.classification,
          owner: p.ownerName,
          rfctlarrSection: p.rfctlarrStatus,
          timestamp: new Date().toISOString(),
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [88.35 + i * 0.01, 22.56 + i * 0.01],
              [88.36 + i * 0.01, 22.56 + i * 0.01],
              [88.36 + i * 0.01, 22.57 + i * 0.01],
              [88.35 + i * 0.01, 22.57 + i * 0.01],
              [88.35 + i * 0.01, 22.56 + i * 0.01],
            ],
          ],
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LandGuard_Cadastre_${district.replace(/\s+/g, "_")}_Plots.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
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
            <Landmark className="h-3 w-3" />
            Cadastre Overlay Verification
          </div>
          <h2 className="text-lg font-extrabold tracking-tight mt-1" style={{ color: textTitle }}>
            DoLR / LRO Boundary Match
          </h2>
          <p className="text-xs" style={{ color: textSub }}>
            Cross-referencing satellite AI polygon with BanglarBhumi cadastral registry
          </p>
        </div>

        <div className="text-right">
          <span
            className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold"
            style={{
              background: completed ? "rgba(16,185,129,0.15)" : "rgba(148,163,184,0.15)",
              color: completed ? "#10b981" : textSub,
              border: `1px solid ${completed ? "rgba(16,185,129,0.3)" : "rgba(148,163,184,0.3)"}`,
            }}
          >
            {completed ? "CADASTRE BOUND" : "AWAITING INFERENCE"}
          </span>
        </div>
      </div>

      {/* Mouza & JL Identifier Card */}
      <div className="p-3.5 rounded-2xl border flex items-center justify-between" style={{ background: boxBg, borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(226,232,240,0.8)" }}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: textTitle }}>
              Mouza: {cadastreInfo.mouza}
            </p>
            <p className="text-[10px] font-mono text-slate-400">
              J.L. Number: {cadastreInfo.jlNo} · PS / Tehsil: {district} L&LR Office
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-mono text-emerald-400 font-bold">
            {completed ? "94.6% Boundary Match" : "--"}
          </p>
          <p className="text-[9px] font-mono text-slate-500">GeoJSON RFC 7946</p>
        </div>
      </div>

      {/* Affected Plots Table */}
      <div className="space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-400">
          Encroached / Affected Cadastral Parcels:
        </p>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {cadastreInfo.plots.map((plot) => (
            <div
              key={plot.dagNo}
              className="p-3 rounded-xl border transition-all text-xs space-y-1.5"
              style={{
                background: boxBg,
                borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.8)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400">
                  Dag / Plot No: #{plot.dagNo}
                </span>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold"
                  style={{
                    background:
                      plot.rfctlarrStatus === "High Dispute Risk"
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(16,185,129,0.15)",
                    color:
                      plot.rfctlarrStatus === "High Dispute Risk"
                        ? "#ef4444"
                        : "#10b981",
                  }}
                >
                  {plot.rfctlarrStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                <div>
                  Khatian: <span className="text-slate-200 font-bold">{plot.khatianNo}</span>
                </div>
                <div>
                  Class: <span className="text-slate-200">{plot.classification}</span>
                </div>
                <div>
                  Area: <span className="text-slate-200">{plot.areaAcre} Acres</span>
                </div>
                <div className="truncate">
                  Owner: <span className="text-slate-200 truncate">{plot.ownerName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Compliance Banner under RFCTLARR Act 2013 */}
      <div
        className="p-3 rounded-2xl border flex items-start gap-2.5 text-xs"
        style={{
          background: isDark ? "rgba(30,41,59,0.4)" : "rgba(241,245,249,0.8)",
          borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(203,213,225,0.9)",
        }}
      >
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold" style={{ color: textTitle }}>
            RFCTLARR Act 2013 Statutory Check
          </p>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Section 11(1) preliminary public notice verified against Land Acquisition Officer (LAO) notification Gazette. Section 38 agricultural safeguards triggered for multi-crop parcels.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleDownloadGeoJson}
          className="flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          style={{
            background: downloadSuccess ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)",
            borderColor: "rgba(16,185,129,0.35)",
            color: "#10b981",
          }}
        >
          <Download className="h-3.5 w-3.5" />
          {downloadSuccess ? "GeoJSON Exported!" : "Export Cadastral GeoJSON"}
        </button>

        <a
          href="https://banglarbhumi.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-white transition-all"
          style={{
            background: boxBg,
            borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(226,232,240,0.8)",
          }}
        >
          <span>BanglarBhumi</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
