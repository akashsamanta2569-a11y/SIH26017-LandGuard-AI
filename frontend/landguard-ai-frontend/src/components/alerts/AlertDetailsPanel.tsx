import { useState } from "react";
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  SendOutlined,
  FileTextOutlined,
  ScanOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  DeploymentUnitOutlined,
  CompassOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import {
  type IncidentAlert,
  type AlertStatus,
  SEVERITY_THEME,
  STATUS_THEME,
} from "./AlertsFeed";

interface AlertDetailsPanelProps {
  alert?: IncidentAlert | null;
  onUpdateStatus?: (alertId: string, newStatus: AlertStatus) => void;
}

export default function AlertDetailsPanel({
  alert,
  onUpdateStatus,
}: AlertDetailsPanelProps) {
  const [fieldTeamDispatched, setFieldTeamDispatched] = useState(false);
  const [noticeIssued, setNoticeIssued] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  if (!alert) {
    return (
      <div
        className="lg:sticky lg:top-6 rounded-[24px] p-8 text-center flex flex-col items-center justify-center min-h-[500px]"
        style={{
          background: "rgba(15, 23, 42, 0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
        }}
      >
        <ScanOutlined style={{ fontSize: 44, color: "#64748B", marginBottom: 12 }} />
        <h3 className="text-base font-bold text-slate-200">
          No Incident Selected
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Select an incident from the feed or GIS radar map to review deep
          satellite telemetry and cadastral records.
        </p>
      </div>
    );
  }

  const sevTheme = SEVERITY_THEME[alert.severity];
  const statTheme = STATUS_THEME[alert.status];

  const handleDispatch = () => {
    setFieldTeamDispatched(true);
    setActionSuccessMsg("🚨 Ground Enforcement Task-Force dispatched to site coordinates.");
    if (onUpdateStatus && alert.status === "ACTIVE") {
      onUpdateStatus(alert.id, "INVESTIGATING");
    }
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleNotice = () => {
    setNoticeIssued(true);
    setActionSuccessMsg(
      `📄 Section 4(1) Show-Cause Encroachment Notice generated for Plot ${alert.coordinates.plotNo}.`
    );
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleResolve = () => {
    const nextStatus: AlertStatus =
      alert.status === "RESOLVED" ? "ACTIVE" : "RESOLVED";
    if (onUpdateStatus) {
      onUpdateStatus(alert.id, nextStatus);
    }
    setActionSuccessMsg(
      nextStatus === "RESOLVED"
        ? "✓ Incident flagged as RESOLVED in district register."
        : "Incident re-opened as ACTIVE."
    );
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div
      className="lg:sticky lg:top-6 rounded-[24px] p-5 sm:p-6 flex flex-col gap-4.5 transition-all duration-300 overflow-hidden select-none"
      style={{
        background: "rgba(15, 23, 42, 0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid rgba(${sevTheme.rgb}, 0.24)`,
        boxShadow: `0 0 28px -8px rgba(${sevTheme.rgb}, 0.16), 0 20px 48px -12px rgba(0,0,0,0.7)`,
      }}
    >
      {/* ── Soft Dynamic Ambient Glow ── */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 transition-all duration-500"
        style={{
          background: `radial-gradient(circle, rgba(${sevTheme.rgb},0.4) 0%, transparent 70%)`,
        }}
      />

      {/* ── 1. INCIDENT HEADER WITH SEVERITY BADGE ── */}
      <div className="relative z-10 pb-3.5 border-b border-slate-800/70">
        {/* Top Badges and Action Icons */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold tracking-wider text-slate-100 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80">
              {alert.code}
            </span>

            {/* Severity Badge */}
            <span
              className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{
                background: sevTheme.badgeBg,
                color: sevTheme.color,
                border: `1px solid ${sevTheme.border}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: sevTheme.color,
                  boxShadow: `0 0 6px ${sevTheme.color}`,
                }}
              />
              {sevTheme.label}
            </span>

            {/* Status Pill */}
            <span
              className="px-2.5 py-1 rounded-lg text-[10.5px] font-semibold font-mono"
              style={{
                background: statTheme.bg,
                color: statTheme.color,
              }}
            >
              {statTheme.label}
            </span>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              title="Share Incident Dossier"
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ShareAltOutlined style={{ fontSize: 13 }} />
            </button>
            <button
              title="Print Brief"
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <PrinterOutlined style={{ fontSize: 13 }} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-white leading-snug tracking-tight mb-2">
          {alert.title}
        </h2>

        {/* Location Banner */}
        <div className="flex items-start gap-2 text-xs text-slate-300">
          <EnvironmentOutlined
            style={{ color: sevTheme.color, marginTop: 2, fontSize: 13 }}
          />
          <div>
            <span className="font-semibold text-slate-200">
              {alert.location}
            </span>
            <span className="text-slate-400 text-[11px] block mt-0.5 font-mono">
              District: {alert.district} • Detected: {alert.timestamp} ({alert.timeAgo})
            </span>
          </div>
        </div>
      </div>

      {/* ── Interactive Toast Feedback Banner ── */}
      {actionSuccessMsg && (
        <div className="relative z-10 px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/35 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-bounce">
          <CheckCircleOutlined style={{ color: "#10B981" }} />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* ── 2. AI CONFIDENCE MATRIX (4 Animated Progress Bars with 6px Height) ── */}
      <div className="relative z-10 rounded-2xl p-4 bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <ThunderboltOutlined style={{ color: "#10B981", fontSize: 14 }} />
            <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
              AI Confidence Matrix
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">
            P(False Positive) &lt; 1.4%
          </span>
        </div>

        <div className="space-y-3 text-[11px]">
          {/* Bar 1: Overall Consensus Score (6px) */}
          <div>
            <div className="flex justify-between text-slate-300 mb-1.5 font-semibold">
              <span>1. Consensus Spatial Anomaly Score</span>
              <span className="font-mono font-bold" style={{ color: sevTheme.color }}>
                {alert.confidence}%
              </span>
            </div>
            <div
              className="w-full bg-slate-800/80 rounded-full overflow-hidden"
              style={{ height: 6 }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${alert.confidence}%`,
                  background: `linear-gradient(90deg, #10B981 0%, ${sevTheme.color} 100%)`,
                  height: 6,
                  boxShadow: `0 0 6px ${sevTheme.color}`,
                }}
              />
            </div>
          </div>

          {/* Bar 2: YOLOv8x-OBB Feature Detection (6px) */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1.5">
              <span>2. YOLOv8x-OBB Structural Detection</span>
              <span className="font-mono text-slate-200 font-bold">
                {alert.modelBreakdown.yoloV8}%
              </span>
            </div>
            <div
              className="w-full bg-slate-800/80 rounded-full overflow-hidden"
              style={{ height: 6 }}
            >
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                style={{
                  width: `${alert.modelBreakdown.yoloV8}%`,
                  height: 6,
                  boxShadow: "0 0 6px #10B981",
                }}
              />
            </div>
          </div>

          {/* Bar 3: ResNet-50 Siamese Bi-Temporal Change (6px) */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1.5">
              <span>3. ResNet-50 Siamese Change Net</span>
              <span className="font-mono text-slate-200 font-bold">
                {alert.modelBreakdown.resnetSiamese}%
              </span>
            </div>
            <div
              className="w-full bg-slate-800/80 rounded-full overflow-hidden"
              style={{ height: 6 }}
            >
              <div
                className="h-full rounded-full bg-teal-400 transition-all duration-700"
                style={{
                  width: `${alert.modelBreakdown.resnetSiamese}%`,
                  height: 6,
                  boxShadow: "0 0 6px #14B8A6",
                }}
              />
            </div>
          </div>

          {/* Bar 4: Multi-Spectral Anomaly Deviation (6px) */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1.5">
              <span>4. Multi-Spectral Reflectance Deviation</span>
              <span className="font-mono text-slate-200 font-bold">
                {alert.modelBreakdown.spectralAnomaly}%
              </span>
            </div>
            <div
              className="w-full bg-slate-800/80 rounded-full overflow-hidden"
              style={{ height: 6 }}
            >
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-700"
                style={{
                  width: `${alert.modelBreakdown.spectralAnomaly}%`,
                  height: 6,
                  boxShadow: "0 0 6px #F59E0B",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. CADASTRAL REGISTRY INFORMATION GRID ── */}
      <div className="relative z-10 rounded-2xl p-4 bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-3">
          <SafetyCertificateOutlined style={{ color: "#10B981", fontSize: 14 }} />
          <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
            Cadastral & Revenue Registry
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {/* Khatian No */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
              Khatian No.
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {alert.coordinates.khatianNo}
            </span>
          </div>

          {/* Plot No */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
              Plot (Dag) No.
            </span>
            <span className="font-mono font-bold text-slate-200 text-sm">
              {alert.coordinates.plotNo}
            </span>
          </div>

          {/* Mouza & JL */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
              Mouza & JL
            </span>
            <span className="font-medium text-slate-300 truncate block">
              {alert.mouza} • {alert.jlNo}
            </span>
          </div>

          {/* Recorded Land Type */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
              Classification
            </span>
            <span className="font-medium text-amber-300 truncate block">
              {alert.category}
            </span>
          </div>
        </div>

        {/* GPS Geodetic Readout */}
        <div className="mt-2.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">Geodetic Footprint:</span>
          <span className="text-slate-200 font-bold">
            {alert.coordinates.lat.toFixed(6)}° N, {alert.coordinates.lng.toFixed(6)}° E
          </span>
        </div>
      </div>

      {/* ── 4. SATELLITE TELEMETRY CHIPS ── */}
      <div className="relative z-10 flex items-center gap-2 flex-wrap">
        <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
          <DeploymentUnitOutlined style={{ color: "#14B8A6" }} />
          <span className="text-slate-500">Sensor:</span>
          <span className="text-teal-300 font-semibold">{alert.satelliteSource.split(" ")[0]}</span>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
          <span className="text-slate-500">NDVI Shift:</span>
          <span className="text-red-400 font-semibold">
            {alert.ndviDelta > 0 ? `+${alert.ndviDelta}` : alert.ndviDelta} Δ
          </span>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
          <span className="text-slate-500">Footprint:</span>
          <span className="text-slate-200 font-semibold">{alert.affectedAreaSqM.toLocaleString()} m²</span>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
          <CompassOutlined style={{ color: "#38BDF8" }} />
          <span className="text-slate-500">GSD:</span>
          <span className="text-sky-300 font-semibold">0.5m Pixel</span>
        </div>
      </div>

      {/* ── 5. AI OBSERVATION SUMMARY CARD ── */}
      <div className="relative z-10 rounded-2xl p-4 bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <AlertOutlined style={{ color: sevTheme.color }} />
          <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
            AI Observation Summary
          </h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
          {alert.description}
        </p>

        {/* Evidence Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
          {alert.evidenceTags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── 6. RESPONSE BUTTONS (Dispatch, Notice, Resolve) ── */}
      <div className="relative z-10 rounded-2xl p-4 bg-slate-900/70 border border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase mb-3 flex items-center gap-2 font-mono">
          <SendOutlined style={{ color: "#10B981" }} /> Incident Response Actions
        </h4>

        <div className="flex flex-col gap-2">
          {/* Button 1: Dispatch */}
          <button
            type="button"
            onClick={handleDispatch}
            disabled={fieldTeamDispatched}
            className={`w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
              fieldTeamDispatched
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                : "bg-red-600/90 hover:bg-red-500 text-white border border-red-500/30 shadow-[0_0_14px_rgba(239,68,68,0.2)]"
            }`}
          >
            <SendOutlined />
            {fieldTeamDispatched
              ? "✓ Ground Enforcement Dispatched"
              : "🚨 Dispatch Ground Enforcement Team"}
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Button 2: Notice */}
            <button
              type="button"
              onClick={handleNotice}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                noticeIssued
                  ? "bg-amber-600/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-900/60 hover:bg-slate-800 text-slate-200 border-slate-800"
              }`}
            >
              <FileTextOutlined />
              {noticeIssued ? "✓ Notice Drafted" : "Draft Sec 4(1) Notice"}
            </button>

            {/* Button 3: Resolve */}
            <button
              type="button"
              onClick={handleResolve}
              className="py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-slate-800 cursor-pointer"
            >
              <CheckCircleOutlined style={{ color: alert.status === "RESOLVED" ? "#F59E0B" : "#10B981" }} />
              {alert.status === "RESOLVED" ? "Re-Open Incident" : "Mark Resolved"}
            </button>
          </div>
        </div>
      </div>

      {/* ── 7. AUDIT TIMELINE WITH GLOWING DOTS ── */}
      <div className="relative z-10 rounded-2xl p-4 bg-slate-900/50 border border-slate-800/70">
        <div className="flex items-center gap-2 mb-3">
          <FieldTimeOutlined style={{ color: "#14B8A6" }} />
          <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase font-mono">
            Orbital Audit & Telemetry Trail
          </h4>
        </div>

        <div className="space-y-3 border-l-2 border-slate-800 pl-3.5 ml-2 text-xs">
          {alert.historyTimeline.map((item, idx) => (
            <div key={idx} className="relative pb-0.5">
              {/* Glowing Dot on Timeline */}
              <span
                className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
                style={{
                  boxShadow: "0 0 8px #10B981, 0 0 14px rgba(16, 185, 129, 0.4)",
                }}
              />
              <div className="text-[10.5px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="font-semibold text-slate-300">{item.time}</span>
                <span className="text-slate-600">•</span>
                <span className="text-teal-400 font-medium">{item.source}</span>
              </div>
              <div className="text-slate-300 text-xs mt-0.5 leading-snug">
                {item.event}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
