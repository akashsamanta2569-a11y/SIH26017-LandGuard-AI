import { useState, useRef, useCallback } from "react";
import {
  CalendarOutlined,
  SwapOutlined,
  EyeOutlined,
  RadarChartOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
  BuildOutlined,
  AlertOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

// ─── Timeline Dates ──────────────────────────────────────────────────────────

interface TimelinePoint {
  id: string;
  label: string;
  sub: string;
  vegLoss: string;
  construction: string;
  encroachment: string;
  confidence: number;
}

const TIMELINE_POINTS: TimelinePoint[] = [
  {
    id: "jun",
    label: "Jun 2026",
    sub: "Baseline Pass",
    vegLoss: "0.0%",
    construction: "0 m²",
    encroachment: "0 Plots",
    confidence: 98.2,
  },
  {
    id: "jul",
    label: "Jul 2026",
    sub: "Early Clearing",
    vegLoss: "-6.4%",
    construction: "+2,400 m²",
    encroachment: "+2 Plots",
    confidence: 94.8,
  },
  {
    id: "aug",
    label: "Aug 2026",
    sub: "Foundation Phase",
    vegLoss: "-15.2%",
    construction: "+8,100 m²",
    encroachment: "+5 Plots",
    confidence: 95.6,
  },
  {
    id: "sep",
    label: "Sep 2026",
    sub: "Active Encroachment",
    vegLoss: "-24.8%",
    construction: "+14,200 m²",
    encroachment: "+8 Plots",
    confidence: 96.4,
  },
];

export default function TimelineComparison() {
  const [activeDateIndex, setActiveDateIndex] = useState<number>(3); // Default to Sep 2026 (current)
  const [sliderPos, setSliderPos] = useState<number>(50); // Split percentage 0..100
  const [isComparing, setIsComparing] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"split" | "before" | "after">("split");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const activePoint = TIMELINE_POINTS[activeDateIndex];

  // ── Drag handler for split slider ──
  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSliderPos(pct);
    },
    []
  );

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Play timeline simulation
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % TIMELINE_POINTS.length;
      setActiveDateIndex(idx);
      if (idx === TIMELINE_POINTS.length - 1) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 1200);
  };

  return (
    <div
      className="relative w-full rounded-3xl p-5 sm:p-7 flex flex-col gap-6 select-none transition-all duration-300 overflow-hidden"
      style={{
        background: "rgba(17, 24, 39, 0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(51, 65, 85, 0.8)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.06), 0 24px 60px -12px rgba(0,0,0,0.7), 0 0 70px rgba(16,185,129,0.05)",
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* ── Scoped Keyframe Animations ── */}
      <style>{`
        @keyframes scanlineSweep {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 24px;
          }
        }
        @keyframes handlePulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }
      `}</style>

      {/* ── Ambient Radial Glows ── */}
      <div
        className="pointer-events-none absolute -top-24 left-1/3 w-96 h-96 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(20,184,166,0.15) 45%, transparent 70%)",
        }}
      />

      {/* ── TOP HEADER: Title + Before/After Selector ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-400">
            <FieldTimeOutlined style={{ color: "#10B981" }} />
            <span>Temporal Bi-Spectral Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            Satellite Timeline{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
              Intelligence
            </span>
          </h2>
        </div>

        {/* Before / Split / After Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setViewMode("before");
                setSliderPos(100);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all cursor-pointer ${
                viewMode === "before"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              Before (Jun)
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("split");
                setSliderPos(50);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "split"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_10px_rgba(20,184,166,0.2)]"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <SwapOutlined /> Split View
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("after");
                setSliderPos(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all cursor-pointer ${
                viewMode === "after"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              After (Sep)
            </button>
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL TIMELINE SLIDER (Jun 2026, Jul 2026, Aug 2026, Sep 2026) ── */}
      <div className="relative z-10 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CalendarOutlined style={{ color: "#10B981" }} />
            Temporal Epoch: <strong className="text-white font-mono">{activePoint.label}</strong> • {activePoint.sub}
          </span>
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <PauseCircleOutlined style={{ fontSize: 13 }} /> Pause Replay
              </>
            ) : (
              <>
                <PlayCircleOutlined style={{ fontSize: 13 }} /> Play Epoch Progression
              </>
            )}
          </button>
        </div>

        {/* 4-Step Interactive Timeline Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {TIMELINE_POINTS.map((pt, idx) => {
            const isSelected = activeDateIndex === idx;
            const isPast = activeDateIndex >= idx;

            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => {
                  setActiveDateIndex(idx);
                  if (idx === 0) {
                    setSliderPos(100);
                    setViewMode("before");
                  } else {
                    setViewMode("split");
                    setSliderPos(Math.max(15, 80 - idx * 20));
                  }
                }}
                className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? "bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_16px_rgba(16,185,129,0.18)]"
                    : isPast
                    ? "bg-slate-900/70 border-slate-700/80 hover:border-slate-600"
                    : "bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-80"
                }`}
              >
                {/* Active Indicator Top Accent Bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-300" />
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-bold text-xs sm:text-sm ${
                      isSelected ? "text-emerald-300" : "text-slate-200"
                    }`}
                  >
                    {pt.label}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected
                        ? "bg-emerald-400 shadow-[0_0_8px_#10B981]"
                        : isPast
                        ? "bg-teal-500/60"
                        : "bg-slate-700"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-1 truncate">{pt.sub}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CENTER COMPARISON VIEWPORT WITH SPLIT SLIDER ── */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-[320px] sm:h-[400px] md:h-[440px] rounded-2xl overflow-hidden border border-slate-800 cursor-ew-resize select-none"
        style={{
          background: "#080c14",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)",
        }}
      >
        {/* Tactical Scanline & Grid Effect */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 20px, rgba(16,185,129,0.04) 20px, rgba(16,185,129,0.04) 22px)",
            animation: "scanlineSweep 6s linear infinite",
          }}
        />

        {/* ── AFTER VIEW (Full Container Base) ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Simulated Satellite Image: AFTER (Sep 2026 - Encroachment Anomaly) */}
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="afterGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(239,68,68,0.08)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Earth & Field Background */}
            <rect width="800" height="500" fill="#0B131E" />
            <rect width="800" height="500" fill="url(#afterGrid)" />

            {/* Disturbed Vegetation Zone (Brownish / Dim Green) */}
            <path
              d="M 50 80 Q 250 50 480 120 T 750 200 L 780 460 Q 400 480 100 440 Z"
              fill="rgba(34, 45, 30, 0.7)"
              stroke="rgba(50, 70, 45, 0.6)"
              strokeWidth="2"
            />

            {/* River Tributary */}
            <path
              d="M 200 0 C 240 150 180 320 300 500"
              fill="none"
              stroke="#0E7490"
              strokeWidth="38"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Highway NH-12 Corridor */}
            <line
              x1="0"
              y1="340"
              x2="800"
              y2="180"
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="14"
            />
            <line
              x1="0"
              y1="340"
              x2="800"
              y2="180"
              stroke="rgba(245, 158, 11, 0.7)"
              strokeWidth="2"
              strokeDasharray="10 8"
            />

            {/* Cadastral Boundary Violations (Red Dashed Encroachment Footprints) */}
            <g>
              {/* Encroachment Anomaly Zone 1 */}
              <rect
                x="420"
                y="190"
                width="140"
                height="90"
                fill="rgba(239, 68, 68, 0.22)"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              {/* Construction Structures Detected */}
              <rect x="440" y="210" width="45" height="35" fill="rgba(239,68,68,0.6)" stroke="#F87171" strokeWidth="1.5" />
              <rect x="495" y="220" width="50" height="40" fill="rgba(239,68,68,0.6)" stroke="#F87171" strokeWidth="1.5" />
              <text
                x="425"
                y="180"
                fill="#EF4444"
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                [!] YOLOv8: ILLEGAL STRUCTURE (97%)
              </text>
            </g>

            {/* Encroachment Anomaly Zone 2 */}
            <g>
              <polygon
                points="580,260 710,240 730,340 600,350"
                fill="rgba(245, 158, 11, 0.18)"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <circle cx="650" cy="300" r="28" fill="rgba(245,158,11,0.4)" stroke="#F59E0B" strokeWidth="1.5" />
              <text
                x="585"
                y="250"
                fill="#F59E0B"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                CADASTRE OVERLAP: 42m
              </text>
            </g>

            {/* Bounding Box HUD Corners */}
            <path d="M 410 180 L 430 180 M 410 180 L 410 200" stroke="#EF4444" strokeWidth="2" />
            <path d="M 570 180 L 550 180 M 570 180 L 570 200" stroke="#EF4444" strokeWidth="2" />
            <path d="M 410 290 L 430 290 M 410 290 L 410 270" stroke="#EF4444" strokeWidth="2" />
            <path d="M 570 290 L 550 290 M 570 290 L 570 270" stroke="#EF4444" strokeWidth="2" />
          </svg>

          {/* Label Badge: AFTER */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-lg bg-red-950/80 border border-red-500/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-red-300">
              AFTER: SEP 2026 (ANOMALY DETECTED)
            </span>
          </div>
        </div>

        {/* ── BEFORE VIEW (Clipped with dynamic width) ── */}
        <div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{
            width: `${sliderPos}%`,
            borderRight: "2px solid #10B981",
            boxShadow: "4px 0 24px rgba(16,185,129,0.35)",
          }}
        >
          {/* Simulated Satellite Image: BEFORE (Jun 2026 - Clean Pristine Baseline) */}
          <div style={{ width: containerRef.current?.clientWidth || 800, height: "100%" }}>
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full object-cover"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="beforeGrid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(16,185,129,0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              {/* Pristine Earth / Field Background */}
              <rect width="800" height="500" fill="#091216" />
              <rect width="800" height="500" fill="url(#beforeGrid)" />

              {/* Dense Green Lush Agriculture Vegetation */}
              <path
                d="M 50 80 Q 250 50 480 120 T 750 200 L 780 460 Q 400 480 100 440 Z"
                fill="rgba(20, 83, 45, 0.65)"
                stroke="rgba(34, 197, 94, 0.4)"
                strokeWidth="2"
              />

              {/* River Tributary (Clearer) */}
              <path
                d="M 200 0 C 240 150 180 320 300 500"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="38"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Unobstructed Highway NH-12 */}
              <line
                x1="0"
                y1="340"
                x2="800"
                y2="180"
                stroke="rgba(148, 163, 184, 0.4)"
                strokeWidth="14"
              />
              <line
                x1="0"
                y1="340"
                x2="800"
                y2="180"
                stroke="rgba(16, 185, 129, 0.8)"
                strokeWidth="2"
                strokeDasharray="10 8"
              />

              {/* Pristine Cadastral Plots (Intact Green Lines) */}
              <rect
                x="420"
                y="190"
                width="140"
                height="90"
                fill="rgba(16, 185, 129, 0.12)"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x="430"
                y="240"
                fill="#10B981"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                PLOT #104: AGRICULTURAL RESERVE
              </text>

              <polygon
                points="580,260 710,240 730,340 600,350"
                fill="rgba(20, 184, 166, 0.1)"
                stroke="#14B8A6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x="590"
                y="300"
                fill="#14B8A6"
                fontSize="11"
                fontFamily="monospace"
              >
                HIGHWAY BUFFER 50m
              </text>
            </svg>
          </div>

          {/* Label Badge: BEFORE */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-mono font-bold text-emerald-300">
              BEFORE: JUN 2026 (BASELINE)
            </span>
          </div>
        </div>

        {/* ── DRAGGABLE COMPARISON DIVIDER HANDLE ── */}
        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center -translate-x-1/2 cursor-ew-resize pointer-events-auto"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Vertical Line */}
          <div className="w-0.5 h-full bg-gradient-to-b from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_12px_#10B981]" />

          {/* Center Floating Handle Thumb */}
          <div
            className="absolute w-10 h-10 rounded-full bg-slate-900 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center text-xs shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-transform hover:scale-110"
            style={{ animation: "handlePulse 2.5s infinite" }}
          >
            <SwapOutlined style={{ fontSize: 14 }} />
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 backdrop-blur-md">
          <EyeOutlined style={{ color: "#10B981" }} />
          <span>DRAG SLIDER TO REVEAL TEMPORAL CHANGE</span>
        </div>
      </div>

      {/* ── BOTTOM TELEMETRY GRID (4 CARDS) ── */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Vegetation Loss */}
        <div
          className="rounded-2xl p-4 border flex flex-col justify-between transition-all"
          style={{
            background: "rgba(15, 23, 42, 0.72)",
            borderColor: "rgba(239, 68, 68, 0.3)",
            boxShadow: "0 8px 20px -6px rgba(239, 68, 68, 0.1)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono font-medium">Vegetation Loss</span>
            <RiseOutlined style={{ color: "#EF4444" }} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-red-400">
              {activePoint.vegLoss}
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              NDVI Canopy Delta (SWIR)
            </p>
          </div>
        </div>

        {/* Card 2: Construction Growth */}
        <div
          className="rounded-2xl p-4 border flex flex-col justify-between transition-all"
          style={{
            background: "rgba(15, 23, 42, 0.72)",
            borderColor: "rgba(245, 158, 11, 0.3)",
            boxShadow: "0 8px 20px -6px rgba(245, 158, 11, 0.1)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono font-medium">Construction Growth</span>
            <BuildOutlined style={{ color: "#F59E0B" }} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-amber-400">
              {activePoint.construction}
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              Impervious Built-up Area
            </p>
          </div>
        </div>

        {/* Card 3: Encroachment Increase */}
        <div
          className="rounded-2xl p-4 border flex flex-col justify-between transition-all"
          style={{
            background: "rgba(15, 23, 42, 0.72)",
            borderColor: "rgba(20, 184, 166, 0.3)",
            boxShadow: "0 8px 20px -6px rgba(20, 184, 166, 0.1)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono font-medium">Encroachment Increase</span>
            <AlertOutlined style={{ color: "#14B8A6" }} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-teal-300">
              {activePoint.encroachment}
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              Cadastral Parcels Infringed
            </p>
          </div>
        </div>

        {/* Card 4: AI Confidence */}
        <div
          className="rounded-2xl p-4 border flex flex-col justify-between transition-all"
          style={{
            background: "rgba(15, 23, 42, 0.72)",
            borderColor: "rgba(16, 185, 129, 0.3)",
            boxShadow: "0 8px 20px -6px rgba(16, 185, 129, 0.1)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-mono font-medium">AI Confidence</span>
            <SafetyCertificateOutlined style={{ color: "#10B981" }} />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black font-mono text-emerald-400">
              {activePoint.confidence}%
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              Ensemble Model Consensus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
