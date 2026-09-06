import React from "react";
import {
  Search,
  X,
  AlertTriangle,
  Gauge,
  Radio,
  Clock,
  Database,
} from "lucide-react";

export interface HistoryHeroProps {
  /** Search query string (prop controlled) */
  searchQuery?: string;
  /** Search term alias for searchQuery */
  searchTerm?: string;
  /** Callback fired when the search value changes */
  onSearchChange?: (value: string) => void;
  /** Optional placeholder for the search input */
  searchPlaceholder?: string;
  /** Total number of historical AI detections */
  totalDetections?: number | string;
  /** Number of critical encroachment / breach cases */
  criticalCases?: number | string;
  /** Average model confidence across detections (e.g. 94 or "94%") */
  averageConfidence?: number | string;
}

export default function HistoryHero({
  searchQuery,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search by district, threat category, or coordinate ID...",
  totalDetections = 0,
  criticalCases = 0,
  averageConfidence = "0%",
}: HistoryHeroProps) {
  const currentQuery = searchQuery ?? searchTerm ?? "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const handleClear = () => {
    onSearchChange?.("");
  };

  // Format confidence display safely
  const formattedConfidence =
    typeof averageConfidence === "number"
      ? `${averageConfidence}%`
      : averageConfidence;

  return (
    <div
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-slate-950/85 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_60px_rgba(16,185,129,0.06)] backdrop-blur-xl transition-all duration-300 select-none"
    >
      {/* ── Background Subtle Tech Accents ── */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(20,184,166,0.15) 50%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-15 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)",
        }}
      />

      {/* ── Top Header Row: Badges & Telemetry Status ── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* WEST BENGAL SPATIAL COMMAND Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold tracking-wider uppercase border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.12)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>WEST BENGAL SPATIAL COMMAND</span>
          </div>

          {/* Classification & Telemetry Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10.5px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>ORBITAL REPOSITORIES • NODE HIST-01</span>
          </div>
        </div>

        {/* Live Archive State */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800/90">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">HISTORICAL AI AUDIT LOG</span>
        </div>
      </div>

      {/* ── Main Content Row: Title, Subtitle, & Controlled Search ── */}
      <div className="relative z-10 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Columns: Title & Subtitle */}
        <div className="lg:col-span-7 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Prediction <span className="text-emerald-400">History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Comprehensive audit registry of historical AI-driven satellite detections,
            vegetation index variance, and cadastral encroachment anomalies verified across
            West Bengal districts.
          </p>
        </div>

        {/* Right 5 Columns: Search Input (Prop-Controlled UI) */}
        <div className="lg:col-span-5">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={currentQuery}
              onChange={handleInputChange}
              placeholder={searchPlaceholder}
              aria-label="Search prediction history"
              className="w-full rounded-xl bg-slate-900/90 border border-emerald-500/25 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 shadow-inner outline-none transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:bg-slate-900"
            />
            {currentQuery && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between px-1 mt-1.5 text-[10.5px] font-mono text-slate-500">
            <span>FILTER BY DISTRICT • THREAT • DATE</span>
            <span className="text-emerald-500/80">CTRL + K</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Three KPI Cards ── */}
      <div className="relative z-10 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Total Detections */}
        <div className="rounded-xl bg-slate-900/70 border border-slate-800/90 p-4 flex flex-col justify-between gap-2.5 transition-all duration-200 hover:border-emerald-500/30 hover:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Detections
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {totalDetections}
            </span>
            <span className="text-[11px] font-mono text-slate-400">records logged</span>
          </div>
          <div className="w-full bg-slate-800/70 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* KPI 2: Critical Cases */}
        <div className="rounded-xl bg-slate-900/70 border border-red-500/20 p-4 flex flex-col justify-between gap-2.5 transition-all duration-200 hover:border-red-500/40 hover:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
              Critical Cases
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-400 tracking-tight">
              {criticalCases}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-red-400/80">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              high priority
            </span>
          </div>
          <div className="w-full bg-slate-800/70 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              style={{ width: Number(criticalCases) > 0 ? "65%" : "0%" }}
            />
          </div>
        </div>

        {/* KPI 3: Average AI Confidence */}
        <div className="rounded-xl bg-slate-900/70 border border-emerald-500/20 p-4 flex flex-col justify-between gap-2.5 transition-all duration-200 hover:border-emerald-500/40 hover:bg-slate-900/90">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Average AI Confidence
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Gauge className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-300 tracking-tight">
              {formattedConfidence}
            </span>
            <span className="text-[11px] font-mono text-emerald-500/80">YOLOv8 + NDVI</span>
          </div>
          <div className="w-full bg-slate-800/70 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
              style={{
                width:
                  typeof averageConfidence === "number"
                    ? `${Math.min(100, Math.max(0, averageConfidence))}%`
                    : averageConfidence.toString().endsWith("%")
                    ? averageConfidence.toString()
                    : "92%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
