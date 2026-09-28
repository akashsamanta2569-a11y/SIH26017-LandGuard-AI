import { motion } from "framer-motion";
import {
  Sparkles,
  Activity,
  Maximize2,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { AlertData } from "./types";
import SatelliteComparison from "./SatelliteComparison";
import AIConfidencePanel from "./AIConfidencePanel";
import LocationCard from "./LocationCard";
import LegalComplianceCard from "./LegalComplianceCard";
import DispatchButtons from "./DispatchButtons";

export interface AlertExpandedProps {
  alert: AlertData;
}

export default function AlertExpanded({ alert }: AlertExpandedProps) {
  // Feature 4: Four Intelligence Metrics KPI Cards
  const kpiMetrics = [
    {
      label: "AI Confidence",
      value: `${alert.confidence}%`,
      sub: "Neural Multi-Band Pass",
      icon: Sparkles,
      color: "text-[#00F5C3]",
      borderColor: "border-[#00F5C3]/30",
      glowColor: "hover:shadow-[0_0_15px_rgba(0,245,195,0.25)]",
    },
    {
      label: "NDVI Loss",
      value: `-${alert.vegetationLoss}%`,
      sub: "Sentinel-2 Canopy Deficit",
      icon: Activity,
      color: "text-[#FF4D6D]",
      borderColor: "border-[#FF4D6D]/30",
      glowColor: "hover:shadow-[0_0_15px_rgba(255,77,109,0.25)]",
    },
    {
      label: "Affected Area",
      value: `${alert.affectedArea} Ha`,
      sub: "Cadastre Encroachment Footprint",
      icon: Maximize2,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      glowColor: "hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]",
    },
    {
      label: "Cadastre Match",
      value: `${alert.cadastreMatch}%`,
      sub: "Revenue Survey Register",
      icon: Layers,
      color: "text-[#00E5FF]",
      borderColor: "border-[#00E5FF]/30",
      glowColor: "hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, filter: "blur(6px)", y: -12 }}
      animate={{ opacity: 1, height: "auto", filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, height: 0, filter: "blur(6px)", y: -12 }}
      transition={{ duration: 0.38, ease: "easeInOut" }}
      className="overflow-hidden border-t border-[#00F5C3]/30 bg-[#050C18]/95 p-4 sm:p-6 space-y-6 backdrop-blur-xl shadow-[inset_0_0_20px_rgba(0,245,195,0.06)]"
    >
      {/* FEATURE 2: SATELLITE BEFORE/AFTER COMPARISON */}
      <SatelliteComparison alert={alert} />

      {/* FEATURE 4: FOUR INTELLIGENCE METRICS KPI CARDS (HOVER GLOW) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpiMetrics.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`rounded-xl border ${kpi.borderColor} bg-[#081326]/85 p-3.5 transition-all duration-300 ${kpi.glowColor} group`}
            >
              <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                <span>{kpi.label}</span>
                <Icon className={`h-4 w-4 ${kpi.color} transition-transform group-hover:scale-110`} />
              </div>
              <div className={`mt-2 font-mono text-2xl font-bold tracking-tight ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="mt-1 font-mono text-[10px] text-slate-400 truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* FEATURE 10: 2-COLUMN DOSSIER GRID ON DESKTOP, STACK ON TABLET/MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: AI Confidence Panel & Field Location */}
        <div className="space-y-5">
          {/* FEATURE 3: AI CONFIDENCE PANEL */}
          <AIConfidencePanel alert={alert} />

          {/* FEATURE 5: LOCATION INTELLIGENCE CARD */}
          <LocationCard alert={alert} />
        </div>

        {/* Right Column: Legal Compliance & Investigation Notes */}
        <div className="space-y-5">
          {/* FEATURE 6: RFCTLARR COMPLIANCE CARD */}
          <LegalComplianceCard rfctlarr={alert.rfctlarr} status={alert.status} />

          {/* FEATURE 8: SCROLLABLE INVESTIGATION NOTES */}
          <div className="rounded-xl border border-slate-800 bg-[#081326]/90 p-4.5 space-y-3 backdrop-blur-md shadow-lg font-mono">
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#00E5FF]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Investigation Telemetry &amp; AI Summary
                </h4>
              </div>
              <span className="text-[10px] text-slate-400">RESTRICTED DOSSIER</span>
            </div>

            {/* Scrollable Intelligence Feed */}
            <div className="max-h-48 overflow-y-auto pr-1 space-y-2.5 text-xs text-slate-300 font-sans leading-relaxed">
              <div className="rounded-lg border border-[#00F5C3]/20 bg-[#050C18]/60 p-3 space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#00F5C3] font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>AI Summary</span>
                </div>
                <p className="font-sans text-slate-300">
                  {alert.description}
                </p>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                  <span>Detected illegal construction along protected buffer zone.</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Vegetation loss detected using Sentinel-2 NDVI.</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>Cadastre overlap 42 meters beyond sanctioned lease boundary.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#00F5C3] shrink-0 mt-0.5" />
                  <span>Confidence above enforcement threshold ({alert.confidence}% &gt; 80%).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 7: DISPATCH ACTION CENTER */}
      <div className="rounded-xl border border-[#00F5C3]/30 bg-[#050C18]/80 p-4.5 space-y-2 backdrop-blur-md shadow-md">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00F5C3]">
          Command Action &amp; Enforcement Dispatch Center
        </h4>
        <DispatchButtons alert={alert} />
      </div>
    </motion.div>
  );
}
