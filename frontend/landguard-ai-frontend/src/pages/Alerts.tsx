import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Compass,
  Filter,
  Sparkles,
} from "lucide-react";
import liveAlerts from "../mock/liveAlerts.json";
import AlertCard from "../components/alerts/AlertCard";
import type { AlertData } from "../components/alerts/types";
import { KPICardSkeleton, AlertSkeleton } from "../components/skeletons";

type FilterType = "All" | "Critical" | "High" | "Medium" | "Resolved";

export default function Alerts() {
  // Step 1: Use liveAlerts mock data (removed all hardcoded legacy arrays)
  const alerts: AlertData[] = liveAlerts as AlertData[];

  // Step 7: 1-second loading skeleton state
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("All");
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(
    alerts[0]?.id ?? null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // KPI Calculations
  const activeAlertsCount = useMemo(
    () => alerts.filter((a) => a.severity !== "Resolved").length,
    [alerts]
  );
  const criticalAlertsCount = useMemo(
    () => alerts.filter((a) => a.severity === "Critical").length,
    [alerts]
  );
  const totalEncroachedArea = useMemo(
    () => alerts.reduce((acc, curr) => acc + (curr.affectedArea || 0), 0).toFixed(1),
    [alerts]
  );
  const avgConfidence = useMemo(() => {
    if (!alerts.length) return "0%";
    const total = alerts.reduce((acc, curr) => acc + (curr.confidence || 0), 0);
    return `${(total / alerts.length).toFixed(1)}%`;
  }, [alerts]);

  // Filtered Alerts List based on Filter Chips
  const filteredAlerts = useMemo(() => {
    if (filter === "All") return alerts;
    return alerts.filter((alert) => alert.severity === filter);
  }, [alerts, filter]);

  const handleToggleExpand = (alertId: string) => {
    setExpandedAlertId((prev) => (prev === alertId ? null : alertId));
  };

  return (
    <div
      id="landguard-report"
      className="min-h-screen bg-[#050C18] text-white print:bg-white print:text-black pb-16 space-y-8 select-none overflow-x-hidden w-full max-w-full"
    >
      {/* 1. GOVERNMENT INTELLIGENCE HEADER */}
      <div className="rounded-2xl border border-[#00F5C3]/20 bg-gradient-to-r from-[#050C18]/95 via-[#081326]/90 to-[#050C18]/95 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Cyber Ambiance Ambient Glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#00F5C3]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#00E5FF]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-[#00F5C3]/15 text-[#00F5C3] border border-[#00F5C3]/30 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#00F5C3] animate-pulse" />
                ISRO &bull; PM GatiShakti &bull; LandGuard AI Surveillance Console
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                <Radio className="w-3 h-3 text-[#00E5FF] animate-pulse" />
                TACTICAL FEED &bull; 10M MULTI-SPECTRAL
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3 font-mono">
              <span>ISRO / PM GatiShakti AI Surveillance Dossier</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed font-sans">
              National Earth Observation &amp; Cadastral Encroachment Surveillance Console powered by Copernicus Sentinel-2 MSI and ISRO Cartosat-3 telemetry.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-[#00F5C3]/20 sm:pl-6 pt-4 sm:pt-0">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F5C3] bg-[#00F5C3]/10 border border-[#00F5C3]/30 px-3 py-1.5 rounded-lg shadow-sm">
              <Sparkles className="w-4 h-4 text-[#00F5C3]" />
              <span>AI INFERENCE ENGINE: ONLINE</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Cadastre Sync: Continuous (5 Active Sectors)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI CARDS (SHOW SKELETON WHILE LOADING) */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <KPICardSkeleton key="kpi-skeletons" count={4} />
        ) : (
          <motion.div
            key="kpi-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {/* KPI 1: Active Alerts */}
            <div className="rounded-xl border border-[#00F5C3]/20 bg-[#081326]/70 p-5 backdrop-blur-md hover:border-[#00F5C3]/40 transition-all duration-200 group shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  Active Alerts
                </span>
                <div className="p-2 rounded-lg bg-[#00F5C3]/10 text-[#00F5C3] border border-[#00F5C3]/20 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,245,195,0.15)]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tracking-tight text-white">
                  {activeAlertsCount}
                </span>
                <span className="inline-flex items-center text-xs font-mono font-semibold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/30">
                  Live Stream
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Active incidents requiring field surveyor inspection or drone dispatch
              </p>
            </div>

            {/* KPI 2: Critical Alerts */}
            <div className="rounded-xl border border-[#FF4D6D]/30 bg-[#081326]/70 p-5 backdrop-blur-md hover:border-[#FF4D6D]/50 transition-all duration-200 group shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  Critical Alerts
                </span>
                <div className="p-2 rounded-lg bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/30 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,77,109,0.2)]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tracking-tight text-[#FF4D6D]">
                  {criticalAlertsCount}
                </span>
                <span className="inline-flex items-center text-xs font-mono font-medium text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full border border-[#FF4D6D]/30">
                  Red Alert
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                High-confidence canopy loss &amp; illegal open earthmoving operations
              </p>
            </div>

            {/* KPI 3: Impacted Area */}
            <div className="rounded-xl border border-amber-500/20 bg-[#081326]/70 p-5 backdrop-blur-md hover:border-amber-500/40 transition-all duration-200 group shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  Total Impact Area
                </span>
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tracking-tight text-amber-300">
                  {totalEncroachedArea} <span className="text-lg">Ha</span>
                </span>
                <span className="inline-flex items-center text-xs font-mono font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Aggregated
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Sum of government cadastre land acreage under active dispute
              </p>
            </div>

            {/* KPI 4: Mean AI Confidence */}
            <div className="rounded-xl border border-[#00E5FF]/20 bg-[#081326]/70 p-5 backdrop-blur-md hover:border-[#00E5FF]/40 transition-all duration-200 group shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  Mean AI Confidence
                </span>
                <div className="p-2 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,229,255,0.15)]">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono tracking-tight text-[#00E5FF]">
                  {avgConfidence}
                </span>
                <span className="inline-flex items-center text-xs font-mono font-semibold text-[#00F5C3]">
                  Precision SLA
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Cross-validated against historical cadastral registry polygons
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. FILTER CHIPS */}
      <div className="rounded-xl border border-[#00F5C3]/20 bg-[#081326]/80 p-4 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#00F5C3]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Filter Incidents by Severity:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Critical", "High", "Medium", "Resolved"] as const).map((chip) => {
            const count =
              chip === "All"
                ? alerts.length
                : alerts.filter((a) => a.severity === chip).length;

            const isSelected = filter === chip;

            return (
              <button
                key={chip}
                type="button"
                onClick={() => setFilter(chip)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-150 border ${
                  isSelected
                    ? chip === "Critical"
                      ? "bg-[#FF4D6D]/25 text-[#FF4D6D] border-[#FF4D6D]/60 shadow-md shadow-[#FF4D6D]/20"
                      : chip === "High"
                      ? "bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-md shadow-amber-950/40"
                      : chip === "Medium"
                      ? "bg-yellow-500/25 text-yellow-200 border-yellow-500/50 shadow-md shadow-yellow-950/40"
                      : chip === "Resolved"
                      ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-950/40"
                      : "bg-[#00F5C3]/20 text-[#00F5C3] border-[#00F5C3]/60 shadow-[0_0_12px_rgba(0,245,195,0.25)]"
                    : "bg-[#050C18]/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span>{chip}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. EXPANDABLE ALERT TIMELINE (STEP 6 & STEP 7 SKELETON) */}
      <div className="rounded-2xl border border-[#00F5C3]/20 bg-[#081326]/75 p-5 md:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00F5C3]/10 text-[#00F5C3] border border-[#00F5C3]/25">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>Alert Timeline &amp; Expandable AI Dossiers</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#00F5C3]/15 text-[#00F5C3] border border-[#00F5C3]/30">
                  {filteredAlerts.length} OF {alerts.length} ALERTS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any alert card to toggle interactive satellite evidence, AI feature progress bars, and tactical action dispatch buttons.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5C3] animate-pulse shadow-[0_0_8px_#00F5C3]" />
            <span>Telemetry Pipeline Stream Active</span>
          </div>
        </div>

        {/* Timeline Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* STEP 7: Show AlertSkeleton for 1 second */
            <div key="loading-skeleton">
              <AlertSkeleton count={4} showTimeline={true} />
            </div>
          ) : (
            <motion.div
              key="alerts-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              {filteredAlerts.length === 0 ? (
                <div className="p-12 text-center text-slate-400 rounded-xl bg-[#050C18]/60 border border-slate-800 text-sm font-mono">
                  No alerts matching the selected filter &quot;{filter}&quot;.
                </div>
              ) : (
                /* STEP 1: Render alerts.map(alert => <AlertCard key={alert.id} alert={alert}/>) */
                filteredAlerts.map((alert, idx) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    isExpanded={expandedAlertId === alert.id}
                    onToggleExpand={() => handleToggleExpand(alert.id)}
                    showTimeline={true}
                    isLast={idx === filteredAlerts.length - 1}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}