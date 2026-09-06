import {
  MapPin,
  Trees,
  Maximize2,
  Gauge,
  AlertTriangle,
  Radio,
} from "lucide-react";

export interface BeforeAfterCardProps {
  /** Name of the administrative district */
  district: string;
  /** Image URL for pre-encroachment baseline satellite capture */
  beforeImage: string;
  /** Image URL for post-encroachment detection satellite capture */
  afterImage: string;
  /** AI detection confidence (number or string, e.g. 97 or "97%") */
  confidence: number | string;
  /** Vegetation loss metric (e.g. -18.2 or "-18.2%") */
  vegetationLoss: number | string;
  /** Total affected land area (e.g. 14.7 or "14.7 Ha") */
  affectedArea: number | string;
  /** Optional threat classification */
  threat?: string;
  /** Optional detection timestamp */
  date?: string;
  /** Optional custom container CSS classes */
  className?: string;
}

export default function BeforeAfterCard({
  district,
  beforeImage,
  afterImage,
  confidence,
  vegetationLoss,
  affectedArea,
  threat,
  date,
  className = "",
}: BeforeAfterCardProps) {
  // Format confidence
  const formattedConfidence =
    typeof confidence === "number"
      ? `${confidence}%`
      : confidence?.toString().endsWith("%")
      ? confidence
      : `${confidence}%`;

  // Format vegetation loss
  let formattedLoss = "--";
  if (vegetationLoss !== undefined && vegetationLoss !== null) {
    if (typeof vegetationLoss === "number") {
      formattedLoss = `${vegetationLoss > 0 ? `-${vegetationLoss}` : vegetationLoss}%`;
    } else {
      const str = String(vegetationLoss);
      formattedLoss = str.endsWith("%") ? str : `${str}%`;
    }
  }

  // Format affected area
  let formattedArea = "--";
  if (affectedArea !== undefined && affectedArea !== null) {
    const str = String(affectedArea);
    formattedArea = str.toLowerCase().includes("ha") ? str : `${str} Ha`;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/25 bg-slate-950/85 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_50px_rgba(16,185,129,0.05)] backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* ── Header: District & Telemetry Details ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-white font-bold text-lg sm:text-xl tracking-tight">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{district}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 uppercase tracking-wider">
              CADASTRE COMPARISON
            </span>
          </div>

          {(threat || date) && (
            <p className="mt-1 text-xs text-slate-400">
              {threat && <span className="text-slate-300 font-medium">{threat}</span>}
              {threat && date && <span className="mx-2 text-slate-600">•</span>}
              {date && <span className="font-mono text-slate-400">{date}</span>}
            </p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10.5px] font-mono text-emerald-400 bg-slate-900/90 border border-emerald-500/20 px-3 py-1 rounded-xl">
          <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span>SENTINEL-2 MSI • 10M GSD</span>
        </div>
      </div>

      {/* ── Side-by-Side Satellite Images ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Before Image Frame */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Before Detection</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">BASELINE ARCHIVE</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900 h-64 sm:h-72 lg:h-80 shadow-inner">
            <img
              src={beforeImage}
              alt={`${district} before satellite capture`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Baseline timestamp overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
              HISTORICAL BASELINE
            </div>
          </div>
        </div>

        {/* After Image Frame with Animated AI DETECTED Badge & Anomaly Reticle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 font-mono uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>After Detection</span>
            </div>
            <span className="text-[10px] font-mono text-red-400/80">CHANGE ANOMALY</span>
          </div>

          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-red-500/30 bg-slate-900 h-64 sm:h-72 lg:h-80 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <img
              src={afterImage}
              alt={`${district} after satellite AI detection`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Subtle scanning grid texture */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* ── Animated AI DETECTED Badge ── */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600/90 text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.65)] border border-red-400/60 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-85 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span>AI DETECTED</span>
            </div>

            {/* ── Bounding Box / Targeted Anomaly Zone ── */}
            <div className="pointer-events-none absolute top-14 left-10 sm:top-16 sm:left-14 w-36 sm:w-44 h-24 sm:h-28 border-2 border-red-500 rounded-lg bg-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.4)] animate-pulse flex flex-col justify-between p-1.5">
              <div className="flex items-center justify-between">
                <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                  ENCROACHMENT
                </span>
                <span className="text-[9px] font-mono font-bold text-red-200 bg-red-950/80 px-1 py-0.5 rounded border border-red-400/30">
                  {formattedConfidence}
                </span>
              </div>
              <div className="flex items-center justify-between text-[8px] font-mono text-red-300">
                <span>NDVI SHIFT</span>
                <span>SEC-WB</span>
              </div>
            </div>

            {/* Telemetry bottom-right pill */}
            <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-red-500/30 text-[10px] font-mono text-red-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span>PERIMETER BREACH</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Metrics with Emerald Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
        {/* Emerald Metric Card 1: Vegetation Loss */}
        <div className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.05)] text-center flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <Trees className="h-3.5 w-3.5 text-red-400" />
            <span>Vegetation Loss</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-red-400 tracking-tight">
            {formattedLoss}
          </p>
          <div className="w-full bg-emerald-950/60 rounded-full h-1 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500"
              style={{ width: "80%" }}
            />
          </div>
        </div>

        {/* Emerald Metric Card 2: Affected Area */}
        <div className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.05)] text-center flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Affected Area</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tracking-tight">
            {formattedArea}
          </p>
          <div className="w-full bg-emerald-950/60 rounded-full h-1 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: "65%" }}
            />
          </div>
        </div>

        {/* Emerald Metric Card 3: AI Confidence */}
        <div className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.05)] text-center flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400">
            <Gauge className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Confidence</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tracking-tight">
            {formattedConfidence}
          </p>
          <div className="w-full bg-emerald-950/60 rounded-full h-1 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              style={{
                width:
                  typeof confidence === "number"
                    ? `${Math.min(100, Math.max(0, confidence))}%`
                    : formattedConfidence,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
