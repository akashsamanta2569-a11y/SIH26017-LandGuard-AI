import React from "react";
import {
  Satellite,
  Activity,
  BrainCircuit,
  Layers,
  ShieldAlert,
  Send,
  Clock,
  Radio,
  CheckCircle2,
} from "lucide-react";

export interface TimelineStep {
  id: number;
  title: string;
  tag: string;
  description: string;
  timeOffset?: string;
  status: "completed" | "in-progress" | "pending";
  icon: React.ReactNode;
}

export interface DetectionTimelineProps {
  /** Name of the district under investigation */
  district: string;
  /** Primary timestamp of the AI detection or investigation start */
  timestamp?: string;
  /** Optional custom investigation steps to override the 6 default steps */
  steps?: TimelineStep[];
  /** Optional custom container CSS classes */
  className?: string;
}

export default function DetectionTimeline({
  district,
  timestamp = "Recent Detection",
  steps,
  className = "",
}: DetectionTimelineProps) {
  // 6 Tactical Investigation Steps tailored for LandGuard AI spatial monitoring
  const defaultSteps: TimelineStep[] = [
    {
      id: 1,
      title: "Satellite Ingestion & Orthorectification",
      tag: "STEP 01 • INGESTION",
      description: `Sentinel-2 MSI & Cartosat-3 multispectral imagery ingested for ${district}. Atmospheric correction, cloud-masking, and spatial tile registration completed.`,
      timeOffset: "T - 00:14:20",
      status: "completed",
      icon: <Satellite className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: 2,
      title: "NDVI & Multi-Spectral Variance Calculation",
      tag: "STEP 02 • SPECTRAL ANALYSIS",
      description: `Automated band arithmetic computed Normalized Difference Vegetation Index (NDVI) and NDWI anomalies, isolating vegetative canopy degradation against baseline archives.`,
      timeOffset: "T - 00:09:45",
      status: "completed",
      icon: <Activity className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: 3,
      title: "YOLOv8 Computer Vision Inference",
      tag: "STEP 03 • AI MODEL PASS",
      description: `Spatial convolutional neural network evaluated 10m-resolution tiles. Detected illegal clearing contours, unauthorized ground equipment, and perimeter breaches.`,
      timeOffset: "T - 00:05:12",
      status: "completed",
      icon: <BrainCircuit className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: 4,
      title: "Cadastral Boundary Cross-Verification",
      tag: "STEP 04 • CADASTRAL AUDIT",
      description: `Target bounding box cross-referenced with West Bengal Directorate of Forests cadastral database. Land parcel verified as protected state forest reserve.`,
      timeOffset: "T - 00:02:30",
      status: "completed",
      icon: <Layers className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: 5,
      title: "Risk Score & Critical Severity Classification",
      tag: "STEP 05 • RISK EVALUATION",
      description: `Heuristic engine assigned incident threat classification. Confidence score validated above threshold with multi-temporal change verification.`,
      timeOffset: "T - 00:00:55",
      status: "completed",
      icon: <ShieldAlert className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: 6,
      title: "Tactical Enforcement Dossier Dispatch",
      tag: "STEP 06 • ACTION PROTOCOL",
      description: `Geotagged incident report with GeoJSON boundary vectors transmitted to West Bengal Forest Department & District Magistrate field vigilance unit.`,
      timeOffset: "T - 00:00:00",
      status: "completed",
      icon: <Send className="h-4 w-4 text-emerald-400" />,
    },
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/25 bg-slate-950/85 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_50px_rgba(16,185,129,0.05)] backdrop-blur-xl transition-all duration-300 select-none ${className}`}
    >
      {/* ── Background Tactical Ambient Glow ── */}
      <div
        className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
        }}
      />

      {/* ── Header: Title, District & Timestamp ── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase tracking-wider">
              INVESTIGATION AUDIT TRAIL
            </span>
            <span className="text-[11px] font-mono text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-300 font-semibold uppercase">
              {district} SECTOR
            </span>
          </div>

          <h2 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-white">
            AI Detection <span className="text-emerald-400">Timeline</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Chronological multi-stage pipeline telemetry from initial satellite telemetry capture to enforcement dispatch.
          </p>
        </div>

        {/* Tactical Timestamp Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/90 border border-emerald-500/20 px-3 py-1.5 rounded-xl shadow-sm">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span>{timestamp}</span>
        </div>
      </div>

      {/* ── Vertical Timeline Container ── */}
      <div className="relative z-10 mt-7">
        {/* Continuous Emerald Tactical Spine Line */}
        <div className="absolute left-[17px] sm:left-[21px] top-4 bottom-6 w-[2px] bg-gradient-to-b from-emerald-400 via-emerald-500/40 to-emerald-500/10" />

        <div className="space-y-6 sm:space-y-7">
          {displaySteps.map((step, index) => {
            const isLast = index === displaySteps.length - 1;

            return (
              <div key={step.id} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* ── Emerald Glowing Dot & Icon Node ── */}
                <div className="relative shrink-0 mt-0.5 flex items-center justify-center">
                  {/* Outer Glowing Ring */}
                  <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-[0_0_22px_rgba(16,185,129,0.6)]">
                    {/* Pulsing Beacon inside latest or active step */}
                    {isLast && (
                      <span className="absolute -inset-1 rounded-2xl bg-emerald-500/20 animate-ping pointer-events-none" />
                    )}

                    {/* Step Icon */}
                    <div className="relative z-10 flex items-center justify-center">
                      {step.icon}
                    </div>

                    {/* Emerald Glowing Center Indicator Pin */}
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                    </span>
                  </div>
                </div>

                {/* ── Tactical Content Card ── */}
                <div className="flex-1 rounded-xl sm:rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-5 transition-all duration-200 group-hover:border-emerald-500/30 group-hover:bg-slate-900/80 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                        {step.tag}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                        {step.title}
                      </h3>
                    </div>

                    {/* Offset Timestamp & Verification Chip */}
                    <div className="flex items-center gap-2">
                      {step.timeOffset && (
                        <span className="text-[10.5px] font-mono text-slate-400">
                          {step.timeOffset}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        PASSED
                      </span>
                    </div>
                  </div>

                  {/* Step Description */}
                  <p className="mt-2 text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tactical Footer ── */}
      <div className="relative z-10 mt-7 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>CRYPTOGRAPHIC SHA-256 AUDIT LOG LOCKED</span>
        </div>
        <div className="text-slate-400">
          ALL 6 AUTOMATED CHECKS VERIFIED
        </div>
      </div>
    </div>
  );
}
