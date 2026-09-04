import { useState, useEffect } from "react";
import {
  AlertOutlined,
  RadarChartOutlined,
  DownloadOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  DeploymentUnitOutlined,
  CompassOutlined,
} from "@ant-design/icons";

interface AlertsHeroProps {
  totalAlerts?: number;
  criticalAlerts?: number;
  highAlerts?: number;
  lowMedAlerts?: number;
  onFilterCritical?: () => void;
  onTriggerRescan?: () => void;
  onExportGeoJSON?: () => void;
}

// ─── Live Clock Hook ─────────────────────────────────────────────────────────

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatIST(d: Date): string {
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  const date = d
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    })
    .toUpperCase();
  return `${time} IST • ${date}`;
}

export default function AlertsHero({
  totalAlerts = 8,
  criticalAlerts = 3,
  highAlerts = 3,
  onFilterCritical,
  onTriggerRescan,
  onExportGeoJSON,
}: AlertsHeroProps) {
  const now = useLiveClock();
  const [isScanning, setIsScanning] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleRescan = () => {
    setIsScanning(true);
    setToastMsg("🛰 Triggering orbital radar sweep across West Bengal spatial grid...");
    if (onTriggerRescan) onTriggerRescan();
    setTimeout(() => {
      setIsScanning(false);
      setToastMsg("✓ Satellite sweep synchronized. 8 incidents confirmed.");
      setTimeout(() => setToastMsg(null), 3500);
    }, 1600);
  };

  const handleExport = () => {
    if (onExportGeoJSON) {
      onExportGeoJSON();
    } else {
      setToastMsg("📑 Exporting incident dossier GeoJSON with cadastral metadata...");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleDispatch = () => {
    if (onFilterCritical) {
      onFilterCritical();
    }
    setToastMsg("🚨 Field inspection task-force protocol initialized for Critical Sectors.");
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div
      className="relative min-h-[320px] rounded-[24px] p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden select-none"
      style={{
        background: "rgba(15, 23, 42, 0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.04), 0 20px 48px -12px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.05)",
      }}
    >
      {/* ── Component-Scoped Keyframe for Critical Beacon Waves ── */}
      <style>{`
        @keyframes alh-beacon-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(239, 68, 68, 0.25), 0 0 20px rgba(239, 68, 68, 0.1);
          }
          50% {
            box-shadow: 0 0 18px rgba(239, 68, 68, 0.5), 0 0 32px rgba(239, 68, 68, 0.2);
          }
        }
        @keyframes alh-beacon-ring {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          75% {
            transform: scale(2.1);
            opacity: 0;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
      `}</style>

      {/* ── Reused Global Grid Overlay ── */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-50" />

      {/* ── Soft Emerald Radial Glow Accent ── */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(20,184,166,0.12) 45%, transparent 70%)",
        }}
      />

      {/* ── TOP ROW: Badges, Animated Critical Beacon, Live IST Clock ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/70">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Node Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-mono font-semibold tracking-wider uppercase select-none"
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#10B981",
              boxShadow: "0 0 12px rgba(16, 185, 129, 0.1)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>SPATIAL SURVEILLANCE GRID • NODE WB-01</span>
          </div>

          {/* Animated Critical Beacon */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-mono font-semibold tracking-wider uppercase text-red-300 select-none"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              animation: "alh-beacon-glow 2.6s ease-in-out infinite",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-red-500"
                style={{
                  animation: "alh-beacon-ring 2.2s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="font-mono text-[10.5px]">CRITICAL BEACON ACTIVE</span>
          </div>
        </div>

        {/* Live IST Clock */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 self-start sm:self-auto bg-slate-900/60 px-3 py-1 rounded-xl border border-slate-800/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300 tracking-wider">
            {formatIST(now)}
          </span>
        </div>
      </div>

      {/* ── MIDDLE ROW: Title & Right Quick Response Panel ── */}
      <div className="relative z-10 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Main Heading & Description (7 cols) */}
        <div className="lg:col-span-7">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Live Alerts{" "}
            <span className="shimmer-text">Command Center</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Real-time geospatial incident tracking, cadastral encroachment alerts,
            and automated multi-spectral satellite telemetry across West Bengal.
          </p>

          {/* Micro Status Indicators */}
          <div className="mt-3.5 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5 font-mono">
              <CompassOutlined style={{ color: "#10B981" }} />
              <span>GSD: 0.28m — 10m Dual Constellation</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <ThunderboltOutlined style={{ color: "#14B8A6" }} />
              <span>Inference Latency: 0.38s</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Response Panel with 3 Buttons (5 cols) */}
        <div className="lg:col-span-5">
          <div
            className="rounded-2xl p-4 flex flex-col gap-2.5 border transition-all"
            style={{
              background: "rgba(15, 23, 42, 0.72)",
              borderColor: "rgba(148, 163, 184, 0.1)",
              boxShadow: "0 8px 24px -6px rgba(0, 0, 0, 0.45)",
            }}
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
              <span className="text-[10.5px] font-mono font-semibold tracking-widest text-slate-400 uppercase">
                Quick Response Panel
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                READY
              </span>
            </div>

            {/* 3 Quick Response Buttons */}
            <div className="grid grid-cols-1 gap-2 pt-0.5">
              {/* Button 1: Isolate Critical Incidents */}
              <button
                type="button"
                onClick={handleDispatch}
                className="w-full py-2 px-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-600/90 to-red-500/90 hover:from-red-500 hover:to-red-400 border border-red-500/30 shadow-[0_0_14px_rgba(239,68,68,0.2)] transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <AlertOutlined className="group-hover:scale-105 transition-transform" />
                  <span>Isolate Critical Incidents</span>
                </span>
                <span className="text-[10px] font-mono bg-red-950/60 px-2 py-0.5 rounded-md border border-red-400/30 text-red-200">
                  {criticalAlerts} Alerts
                </span>
              </button>

              {/* Button 2: Orbital Re-Scan */}
              <button
                type="button"
                onClick={handleRescan}
                disabled={isScanning}
                className="w-full py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 shadow-sm transition-all flex items-center justify-between cursor-pointer disabled:opacity-60 group"
              >
                <span className="flex items-center gap-2">
                  <SyncOutlined
                    spin={isScanning}
                    style={{ color: "#10B981" }}
                    className="group-hover:text-emerald-300"
                  />
                  <span>{isScanning ? "Scanning Orbit..." : "Trigger Orbital Re-Scan"}</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-800/30">
                  Node WB-01
                </span>
              </button>

              {/* Button 3: Export Incident Dossier */}
              <button
                type="button"
                onClick={handleExport}
                className="w-full py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 shadow-sm transition-all flex items-center justify-between cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <DownloadOutlined
                    style={{ color: "#14B8A6" }}
                    className="group-hover:scale-105 transition-transform"
                  />
                  <span>Export GeoJSON Dossier</span>
                </span>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/30 px-2 py-0.5 rounded-md border border-teal-800/30">
                  Cadastral Vectors
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {toastMsg && (
        <div className="relative z-10 -mt-1 mb-2 px-4 py-2 rounded-xl bg-slate-900/95 border border-emerald-500/35 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-bounce">
          <CheckCircleOutlined style={{ color: "#10B981" }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── BOTTOM ROW: KPI Pills (8 Total, 3 Critical, 3 High) with 6px Progress Bars ── */}
      <div className="relative z-10 pt-4 border-t border-slate-800/70 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* KPI 1: 8 Total */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] text-slate-400 font-semibold uppercase tracking-wider">
              Total Incidents
            </div>
            <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300">
              <DeploymentUnitOutlined style={{ fontSize: 13 }} />
            </div>
          </div>
          <div className="text-xl font-bold text-white font-mono leading-none">
            {totalAlerts}
          </div>
          <div className="w-full bg-slate-800/70 rounded-full overflow-hidden" style={{ height: 6 }}>
            <div
              className="h-full rounded-full bg-slate-400 transition-all duration-700"
              style={{ width: "100%", height: 6 }}
            />
          </div>
        </div>

        {/* KPI 2: 3 Critical */}
        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 cursor-pointer hover:scale-[1.01] transition-all"
          onClick={onFilterCritical}
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            borderColor: "rgba(239, 68, 68, 0.28)",
            boxShadow: "0 4px 16px -2px rgba(239, 68, 68, 0.12)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] text-red-300 font-semibold uppercase tracking-wider">
              Critical Severity
            </div>
            <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400">
              <AlertOutlined style={{ fontSize: 13 }} />
            </div>
          </div>
          <div className="text-xl font-bold text-red-400 font-mono leading-none flex items-center gap-1.5">
            <span>{criticalAlerts}</span>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          </div>
          <div className="w-full bg-slate-800/70 rounded-full overflow-hidden" style={{ height: 6 }}>
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-700"
              style={{ width: "37.5%", height: 6, boxShadow: "0 0 6px #EF4444" }}
            />
          </div>
        </div>

        {/* KPI 3: 3 High */}
        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between gap-2.5"
          style={{
            background: "rgba(245, 158, 11, 0.07)",
            borderColor: "rgba(245, 158, 11, 0.25)",
            boxShadow: "0 4px 16px -2px rgba(245, 158, 11, 0.1)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] text-amber-300 font-semibold uppercase tracking-wider">
              High Risk
            </div>
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <RadarChartOutlined style={{ fontSize: 13 }} />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono leading-none">
            {highAlerts}
          </div>
          <div className="w-full bg-slate-800/70 rounded-full overflow-hidden" style={{ height: 6 }}>
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-700"
              style={{ width: "37.5%", height: 6, boxShadow: "0 0 6px #F59E0B" }}
            />
          </div>
        </div>

        {/* KPI 4: Mean Anomaly Confidence */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between gap-2.5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] text-slate-400 font-semibold uppercase tracking-wider">
              Consensus Score
            </div>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <ThunderboltOutlined style={{ fontSize: 13 }} />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono leading-none">
            94.2%
          </div>
          <div className="w-full bg-slate-800/70 rounded-full overflow-hidden" style={{ height: 6 }}>
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{ width: "94.2%", height: 6, boxShadow: "0 0 6px #10B981" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
