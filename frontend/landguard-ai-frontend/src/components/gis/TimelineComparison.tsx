import { useState, useRef, useCallback, useLayoutEffect } from "react";
import {
  CalendarOutlined,
  SwapOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FieldTimeOutlined,
  AlertOutlined,
  RiseOutlined,
  BuildOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

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

interface TimelineComparisonProps {
  theme?: "dark" | "light";
}

export default function TimelineComparison({ theme = "light" }: TimelineComparisonProps) {
  const isDark = theme === "dark";
  const [activeDateIndex, setActiveDateIndex] = useState<number>(3); // Default to Sep 2026
  const [sliderPos, setSliderPos] = useState<number>(50); // Split percentage 0..100
  const [viewMode, setViewMode] = useState<"split" | "before" | "after" | "vertical">("split");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    setContainerWidth(el.clientWidth || 800);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const activePoint = TIMELINE_POINTS[activeDateIndex];

  // Drag handler for split slider
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
      className="w-full rounded-2xl p-5 sm:p-6 flex flex-col gap-5 border transition-all duration-200 select-none overflow-hidden"
      style={{
        backgroundColor: isDark ? "#111C2E" : "#FFFFFF",
        borderColor: isDark ? "#1E293B" : "#E2E8F0",
        boxShadow: isDark
          ? "0 4px 6px -1px rgba(0,0,0,0.3)"
          : "0 1px 3px 0 rgba(0,0,0,0.05)",
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* ── TOP HEADER ── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b"
        style={{ borderColor: isDark ? "#1E293B" : "#F1F5F9" }}
      >
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            <FieldTimeOutlined />
            <span>Temporal Bi-Spectral Analysis</span>
          </div>
          <h2
            className="text-base sm:text-lg font-bold tracking-tight mt-1"
            style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
          >
            Satellite Timeline Comparison (Before vs After)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            June 2026 Baseline Pass vs September 2026 Inferred Cadastral Encroachment
          </p>
        </div>

        {/* View Mode Selector */}
        <div
          className="flex items-center p-1 rounded-xl border text-xs"
          style={{
            backgroundColor: isDark ? "#0A0F1D" : "#F8FAFC",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setViewMode("before");
              setSliderPos(100);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === "before"
                ? "bg-white text-teal-800 dark:bg-slate-800 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === "split"
                ? "bg-white text-teal-800 dark:bg-slate-800 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === "after"
                ? "bg-white text-teal-800 dark:bg-slate-800 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            After (Sep)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("vertical")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === "vertical"
                ? "bg-white text-teal-800 dark:bg-slate-800 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Vertical Stack
          </button>
        </div>
      </div>

      {/* ── 4-STEP INTERACTIVE TIMELINE SELECTOR ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
            <CalendarOutlined className="text-teal-600" />
            Selected Epoch: <strong className="font-semibold text-teal-700 dark:text-teal-400">{activePoint.label}</strong> ({activePoint.sub})
          </span>
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <PauseCircleOutlined /> Pause Simulation
              </>
            ) : (
              <>
                <PlayCircleOutlined /> Replay Progression
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto pb-1 scrollbar-thin">
          <div className="grid grid-cols-4 min-w-[500px] sm:min-w-0 gap-2.5">
          {TIMELINE_POINTS.map((pt, idx) => {
            const isSelected = activeDateIndex === idx;

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
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-teal-50 border-teal-400 text-teal-900 dark:bg-teal-950/40 dark:border-teal-700 dark:text-teal-200 shadow-sm"
                    : "bg-slate-50/60 border-slate-200/80 text-slate-700 dark:bg-slate-800/40 dark:border-slate-700/80 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm">{pt.label}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {pt.sub}
                </p>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* ── SATELLITE COMPARISON VIEWPORT (SPLIT OR VERTICAL STACK) ── */}
      {viewMode === "vertical" ? (
        <div className="flex flex-col gap-4 w-full">
          {/* Before View (Top) */}
          <div
            className="relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            style={{ backgroundColor: isDark ? "#0A121A" : "#E2E8F0" }}
          >
            <svg viewBox="0 0 800 500" className="w-full h-full object-cover" preserveAspectRatio="none">
              <rect width="800" height="500" fill={isDark ? "#0A121A" : "#E2E8F0"} />
              <path
                d="M 50 80 Q 250 50 480 120 T 750 200 L 780 460 Q 400 480 100 440 Z"
                fill={isDark ? "rgba(22, 101, 52, 0.45)" : "#86EFAC"}
                stroke="#16A34A"
                strokeWidth="2"
              />
              <path
                d="M 200 0 C 240 150 180 320 300 500"
                fill="none"
                stroke="#0284C7"
                strokeWidth="36"
                strokeLinecap="round"
                opacity="0.8"
              />
              <line x1="0" y1="340" x2="800" y2="180" stroke="#64748B" strokeWidth="14" />
              <line x1="0" y1="340" x2="800" y2="180" stroke="#16A34A" strokeWidth="2" strokeDasharray="10 8" />
              <rect x="420" y="190" width="140" height="90" fill="none" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" />
              <text x="425" y="180" fill="#16A34A" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="bold">
                ✓ Cadastre Dag 412 (Pristine Baseline)
              </text>
            </svg>
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800 shadow">
              Before: Jun 2026 (Baseline Pass)
            </div>
          </div>

          {/* After View (Bottom) */}
          <div
            className="relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            style={{ backgroundColor: isDark ? "#0B131E" : "#E2E8F0" }}
          >
            <svg viewBox="0 0 800 500" className="w-full h-full object-cover" preserveAspectRatio="none">
              <rect width="800" height="500" fill={isDark ? "#0B131E" : "#E2E8F0"} />
              <path
                d="M 50 80 Q 250 50 480 120 T 750 200 L 780 460 Q 400 480 100 440 Z"
                fill={isDark ? "rgba(34, 45, 30, 0.7)" : "#CBD5E1"}
                stroke={isDark ? "rgba(50, 70, 45, 0.6)" : "#94A3B8"}
                strokeWidth="2"
              />
              <path
                d="M 200 0 C 240 150 180 320 300 500"
                fill="none"
                stroke="#0284C7"
                strokeWidth="36"
                strokeLinecap="round"
                opacity="0.8"
              />
              <line x1="0" y1="340" x2="800" y2="180" stroke="#64748B" strokeWidth="14" />
              <line x1="0" y1="340" x2="800" y2="180" stroke="#F59E0B" strokeWidth="2" strokeDasharray="10 8" />
              <g>
                <rect x="420" y="190" width="140" height="90" fill="rgba(220, 38, 38, 0.25)" stroke="#DC2626" strokeWidth="2" strokeDasharray="6 4" />
                <rect x="440" y="210" width="45" height="35" fill="rgba(220, 38, 38, 0.6)" stroke="#B91C1C" strokeWidth="1.5" />
                <rect x="495" y="220" width="50" height="40" fill="rgba(220, 38, 38, 0.6)" stroke="#B91C1C" strokeWidth="1.5" />
                <text x="425" y="180" fill="#DC2626" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="bold">
                  [!] YOLOv8: ILLEGAL STRUCTURE (97%)
                </text>
              </g>
              <g>
                <polygon points="580,260 710,240 730,340 600,350" fill="rgba(245, 158, 11, 0.25)" stroke="#D97706" strokeWidth="2" strokeDasharray="5 3" />
                <text x="585" y="250" fill="#D97706" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="bold">
                  CADASTRE BUFFER OVERLAP: 42m
                </text>
              </g>
            </svg>
            <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800 shadow">
              After: Sep 2026 (Encroachment Detected)
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-ew-resize select-none"
          style={{ backgroundColor: isDark ? "#0A0F1D" : "#F1F5F9" }}
        >
          {/* ── AFTER VIEW (Sep 2026 Anomaly) ── */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <svg viewBox="0 0 800 500" className="w-full h-full object-cover" preserveAspectRatio="none">
              {/* Background */}
              <rect width="800" height="500" fill={isDark ? "#0B131E" : "#E2E8F0"} />

              {/* Disturbed Vegetation Zone */}
              <path
                d="M 50 80 Q 250 50 480 120 T 750 200 L 780 460 Q 400 480 100 440 Z"
                fill={isDark ? "rgba(34, 45, 30, 0.7)" : "#CBD5E1"}
                stroke={isDark ? "rgba(50, 70, 45, 0.6)" : "#94A3B8"}
                strokeWidth="2"
              />

              {/* River Tributary */}
              <path
                d="M 200 0 C 240 150 180 320 300 500"
                fill="none"
                stroke="#0284C7"
                strokeWidth="36"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Highway NH-12 Corridor */}
              <line x1="0" y1="340" x2="800" y2="180" stroke="#64748B" strokeWidth="14" />
              <line x1="0" y1="340" x2="800" y2="180" stroke="#F59E0B" strokeWidth="2" strokeDasharray="10 8" />

              {/* Encroachment Violations */}
              <g>
                <rect
                  x="420"
                  y="190"
                  width="140"
                  height="90"
                  fill="rgba(220, 38, 38, 0.25)"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <rect x="440" y="210" width="45" height="35" fill="rgba(220, 38, 38, 0.6)" stroke="#B91C1C" strokeWidth="1.5" />
                <rect x="495" y="220" width="50" height="40" fill="rgba(220, 38, 38, 0.6)" stroke="#B91C1C" strokeWidth="1.5" />
                <text x="425" y="180" fill="#DC2626" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="bold">
                  [!] YOLOv8: ILLEGAL STRUCTURE (97%)
                </text>
              </g>

              <g>
                <polygon
                  points="580,260 710,240 730,340 600,350"
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#D97706"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <text x="585" y="250" fill="#D97706" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="bold">
                  CADASTRE BUFFER OVERLAP: 42m
                </text>
              </g>
            </svg>

            {/* After Label Chip */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800 shadow">
              After: Sep 2026 (Encroachment Detected)
            </div>
          </div>

          {/* ── BEFORE VIEW (Jun 2026 Baseline - Clipped by Slider) ── */}
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div style={{ width: containerWidth, height: "100%" }}>
              <svg viewBox="0 0 800 500" className="w-full h-full object-cover" preserveAspectRatio="none">
                <rect width="800" height="500" fill={isDark ? "#0A121A" : "#E2E8F0"} />

                {/* Pristine Vegetation Zone (Lush Green) */}
                <path
                  d="M 50 80 Q 250 50 480 120 T 750 200 L 780 460 Q 400 480 100 440 Z"
                  fill={isDark ? "rgba(22, 101, 52, 0.45)" : "#86EFAC"}
                  stroke="#16A34A"
                  strokeWidth="2"
                />

                {/* River Tributary */}
                <path
                  d="M 200 0 C 240 150 180 320 300 500"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="36"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                {/* Highway Corridor Clean Alignment */}
                <line x1="0" y1="340" x2="800" y2="180" stroke="#64748B" strokeWidth="14" />
                <line x1="0" y1="340" x2="800" y2="180" stroke="#16A34A" strokeWidth="2" strokeDasharray="10 8" />

                {/* Preserved Cadastral Plot Line */}
                <rect
                  x="420"
                  y="190"
                  width="140"
                  height="90"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text x="425" y="180" fill="#16A34A" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="bold">
                  ✓ Cadastre Dag 412 (Pristine Buffer)
                </text>
              </svg>
            </div>

            {/* Before Label Chip */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800 shadow">
              Before: Jun 2026 (Baseline Pass)
            </div>
          </div>

          {/* ── DRAGGABLE SPLIT HANDLE ── */}
          <div
            className="absolute top-0 bottom-0 z-20 w-0.5 bg-teal-600 dark:bg-teal-400"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-teal-600 shadow-md flex items-center justify-center text-teal-700 dark:text-teal-300 text-xs cursor-ew-resize">
              <SwapOutlined />
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM STATISTICAL METRICS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className="p-3 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Canopy Loss</span>
            <RiseOutlined className="text-red-600" />
          </div>
          <span className="text-base sm:text-lg font-bold text-red-600 mt-1">
            {activePoint.vegLoss}
          </span>
        </div>

        <div
          className="p-3 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Built Footprint</span>
            <BuildOutlined className="text-amber-600" />
          </div>
          <span className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-400 mt-1">
            {activePoint.construction}
          </span>
        </div>

        <div
          className="p-3 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Plots Encroached</span>
            <AlertOutlined className="text-orange-600" />
          </div>
          <span className="text-base sm:text-lg font-bold text-orange-600 mt-1">
            {activePoint.encroachment}
          </span>
        </div>

        <div
          className="p-3 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>AI Confidence</span>
            <SafetyCertificateOutlined className="text-teal-600" />
          </div>
          <span className="text-base sm:text-lg font-bold text-teal-700 dark:text-teal-400 mt-1">
            {activePoint.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
}
