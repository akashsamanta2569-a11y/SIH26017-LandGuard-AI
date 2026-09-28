import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import type { PredictionHistoryMonth } from "./types";
import DetectionOverlay from "./DetectionOverlay";

export interface BeforeAfterSliderProps {
  currentMonth: PredictionHistoryMonth;
  monthIndex: number;
  className?: string;
  defaultOrientation?: "horizontal" | "vertical";
}

const FALLBACK_BEFORE = "/mock/howrah_before.jpg";
const FALLBACK_AFTER = "/mock/howrah_after.jpg";

/**
 * Satellite Icon for circular slider handle
 */
function SatelliteHandleIcon() {
  return (
    <svg
      className="h-4 w-4 text-[#050C18]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

export default function BeforeAfterSlider({
  currentMonth,
  monthIndex,
  className = "",
  defaultOrientation,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(() => {
    if (defaultOrientation) return defaultOrientation;
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return "vertical";
    }
    return "horizontal";
  });

  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);

  // Framer motion value for continuous smooth tracking
  const motionSliderPos = useMotionValue(50);

  const [beforeImgSrc, setBeforeImgSrc] = useState(
    currentMonth.beforeImage || FALLBACK_BEFORE
  );
  const [afterImgSrc, setAfterImgSrc] = useState(
    currentMonth.afterImage || FALLBACK_AFTER
  );

  useEffect(() => {
    setBeforeImgSrc(currentMonth.beforeImage || FALLBACK_BEFORE);
    setAfterImgSrc(currentMonth.afterImage || FALLBACK_AFTER);
  }, [currentMonth]);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (orientation === "horizontal") {
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(percentage);
        motionSliderPos.set(percentage);
      } else {
        const y = clientY - rect.top;
        const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100));
        setSliderPos(percentage);
        motionSliderPos.set(percentage);
      }
    },
    [orientation, motionSliderPos]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  const isVertical = orientation === "vertical";

  return (
    <div className="relative space-y-2">
      {/* Slider Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`group relative h-[420px] sm:h-[500px] md:h-[560px] w-full select-none overflow-hidden rounded-2xl border border-[#00F5C3]/30 bg-[#050C18] shadow-[0_8px_32px_rgba(5,12,24,0.95)] ${
          isVertical ? "cursor-ns-resize" : "cursor-ew-resize"
        } ${className}`}
      >
        {/* 1. BASE / BEFORE LAYER (JUNE 2026 HISTORICAL BASELINE) */}
        <div className="absolute inset-0 h-full w-full">
          <img
            src={beforeImgSrc}
            alt="June 2026 Baseline Satellite Imagery"
            onError={() => setBeforeImgSrc(FALLBACK_BEFORE)}
            className="h-full w-full object-cover"
          />
          {/* Subtle Satellite Sensor Scan Grid */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>

        {/* 2. AFTER / AI DETECTED LAYER WITH CLIPPING (X or Y Axis) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{
            clipPath: isVertical
              ? `polygon(0 ${sliderPos}%, 100% ${sliderPos}%, 100% 100%, 0 100%)`
              : `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
          }}
        >
          <img
            src={afterImgSrc}
            alt={`${currentMonth.month} Satellite Scan`}
            onError={() => setAfterImgSrc(FALLBACK_AFTER)}
            className="h-full w-full object-cover"
          />

          {/* Detection Overlay with Red Polygon and NDVI Layer */}
          <DetectionOverlay
            currentMonth={currentMonth}
            monthIndex={monthIndex}
          />
        </div>

        {/* 3. DIVIDER & CIRCULAR SATELLITE HANDLE */}
        {isVertical ? (
          /* Horizontal Divider Line moving along Y axis */
          <div
            className="pointer-events-none absolute inset-x-0 z-30"
            style={{ top: `${sliderPos}%` }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px rgba(0, 229, 255, 0.6), 0 0 20px rgba(0, 245, 195, 0.3)",
                  "0 0 25px rgba(0, 245, 195, 0.9), 0 0 40px rgba(0, 229, 255, 0.5)",
                  "0 0 10px rgba(0, 229, 255, 0.6), 0 0 20px rgba(0, 245, 195, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-[2.5px] -translate-y-1/2 bg-gradient-to-r from-[#00F5C3] via-[#00E5FF] to-[#00F5C3]"
            />
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#00F5C3] shadow-[0_0_15px_#00F5C3] cursor-ns-resize"
              >
                <SatelliteHandleIcon />
              </motion.div>
            </div>
          </div>
        ) : (
          /* Vertical Divider Line moving along X axis */
          <div
            className="pointer-events-none absolute inset-y-0 z-30"
            style={{ left: `${sliderPos}%` }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px rgba(0, 229, 255, 0.6), 0 0 20px rgba(0, 245, 195, 0.3)",
                  "0 0 25px rgba(0, 245, 195, 0.9), 0 0 40px rgba(0, 229, 255, 0.5)",
                  "0 0 10px rgba(0, 229, 255, 0.6), 0 0 20px rgba(0, 245, 195, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-[2.5px] -translate-x-1/2 bg-gradient-to-b from-[#00F5C3] via-[#00E5FF] to-[#00F5C3]"
            />
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#00F5C3] shadow-[0_0_15px_#00F5C3] cursor-ew-resize"
              >
                <SatelliteHandleIcon />
              </motion.div>
            </div>
          </div>
        )}

        {/* 4. LABELS */}
        <div className="pointer-events-none absolute top-4 left-4 z-20 rounded-md border border-[#00F5C3]/40 bg-[#050C18]/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#00F5C3] backdrop-blur-md">
          {isVertical ? "TOP: HISTORICAL BASELINE (JUN)" : "BEFORE: JUN 2026 (BASELINE)"}
        </div>

        <div className="pointer-events-none absolute bottom-4 right-4 z-20 rounded-md border border-[#FF4D6D]/40 bg-[#050C18]/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#FF4D6D] backdrop-blur-md">
          {isVertical
            ? `BOTTOM: AI INFERRED (${currentMonth.month.toUpperCase()})`
            : `AFTER: ${currentMonth.month.toUpperCase()} (AI INFERRED)`}
        </div>

        {/* Orientation Toggle Floating Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOrientation((o) => (o === "horizontal" ? "vertical" : "horizontal"));
          }}
          className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-lg border border-[#00E5FF]/40 bg-[#050C18]/90 px-2.5 py-1 font-mono text-[11px] text-[#00E5FF] backdrop-blur-md hover:border-[#00E5FF] hover:bg-[#00E5FF]/20 transition-all cursor-pointer shadow-lg"
          title="Toggle Comparison Axis (Horizontal / Vertical)"
        >
          {isVertical ? (
            <>
              <ArrowLeftRight className="h-3 w-3" />
              <span>Horizontal Split</span>
            </>
          ) : (
            <>
              <ArrowUpDown className="h-3 w-3" />
              <span>Vertical Split</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
