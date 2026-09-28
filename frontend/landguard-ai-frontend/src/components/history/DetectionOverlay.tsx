import { motion } from "framer-motion";
import type { PredictionHistoryMonth } from "./types";

export interface DetectionOverlayProps {
  currentMonth: PredictionHistoryMonth;
  monthIndex: number;
}

export default function DetectionOverlay({
  currentMonth,
  monthIndex,
}: DetectionOverlayProps) {
  // Polygon configurations progressing through the 4 stages
  const polygonStages = [
    // Month 0: Jun 2026 (Baseline - No illegal structure)
    null,
    // Month 1: Jul 2026 (Early Clearing - small nascent clearing polygon)
    {
      points: "320,160 410,145 435,215 330,225",
      bbox: { x: 310, y: 135, width: 135, height: 100 },
      breach: { x: 410, y: 145 },
      label: "VEGETATION REMOVAL DETECTED",
    },
    // Month 2: Aug 2026 (Foundation Phase - expanding excavation)
    {
      points: "280,130 460,110 495,260 295,275",
      bbox: { x: 270, y: 100, width: 235, height: 185 },
      breach: { x: 460, y: 110 },
      label: "FOUNDATION EXCAVATION PHASE",
    },
    // Month 3: Sep 2026 (Active Encroachment - full unauthorized footprint)
    {
      points: "240,100 520,80 560,310 260,330",
      bbox: { x: 230, y: 70, width: 340, height: 270 },
      breach: { x: 520, y: 80 },
      label: "ACTIVE ENCROACHMENT CONFIRMED",
    },
  ];

  const currentPolygon = polygonStages[monthIndex];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-hidden">
      {/* 1. FEATURE 4: NDVI VEGETATION LOSS LAYER (ANIMATED OPACITY) */}
      <motion.div
        animate={{ opacity: currentMonth.ndviOpacity }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-tr from-emerald-600/35 via-teal-500/25 to-transparent mix-blend-color-dodge"
      />

      <svg
        className="h-full w-full"
        viewBox="0 0 800 500"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Buffer zone diagonal hatch pattern */}
          <pattern
            id="buffer-zone-hatch"
            width="16"
            height="16"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="16"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
          </pattern>

          {/* Glowing Red Filter for Structure Polygon */}
          <filter id="crimson-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Cyan Glow for Cadastre */}
          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 2. STATUTORY CADASTRE BOUNDARIES (GOVERNMENT REVENUE PLOTS) */}
        <g id="cadastre-boundaries" filter="url(#cyan-glow)">
          {/* Cadastre Plot #14 */}
          <polygon
            points="140,60 480,40 500,220 180,240"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeOpacity="0.75"
          />
          {/* Cadastre Plot #15 */}
          <polygon
            points="480,40 760,20 780,260 500,220"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeOpacity="0.5"
          />
          {/* Cadastre Plot #16 (Lower parcel) */}
          <polygon
            points="180,240 500,220 530,460 210,480"
            fill="none"
            stroke="#00F5C3"
            strokeWidth="1.2"
            strokeDasharray="5 3"
            strokeOpacity="0.6"
          />
          {/* Vertex dots */}
          <circle cx="140" cy="60" r="3" fill="#00E5FF" />
          <circle cx="480" cy="40" r="3" fill="#00E5FF" />
          <circle cx="500" cy="220" r="3.5" fill="#00F5C3" />
          <circle cx="180" cy="240" r="3" fill="#00E5FF" />
          <circle cx="760" cy="20" r="3" fill="#00E5FF" />
        </g>

        {/* 3. 50-METER BUFFER RESTRICTED CORRIDOR OVERLAP ZONE */}
        <polygon
          points="200,90 620,60 660,360 240,390"
          fill="url(#buffer-zone-hatch)"
          stroke="#F59E0B"
          strokeWidth="1"
          strokeDasharray="8 4"
          strokeOpacity="0.6"
        />

        {/* 4. RED POLYGON AROUND ILLEGAL STRUCTURE & ANIMATED DASHED BOUNDING BOX */}
        {currentPolygon && (
          <g id="illegal-structure-detection" filter="url(#crimson-glow)">
            {/* Animated Red Polygon around illegal structure */}
            <motion.polygon
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              points={currentPolygon.points}
              fill="rgba(255, 77, 109, 0.28)"
              stroke="#FF4D6D"
              strokeWidth="2.5"
            />

            {/* Polygon Corner Anchors */}
            {currentPolygon.points.split(" ").map((pt, i) => {
              const [x, y] = pt.split(",").map(Number);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#FF4D6D"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              );
            })}

            {/* Animated Dashed Bounding Box (Marching Ants) */}
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.7, 1, 0.7],
                strokeDashoffset: [0, -24],
              }}
              transition={{
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
              }}
              x={currentPolygon.bbox.x}
              y={currentPolygon.bbox.y}
              width={currentPolygon.bbox.width}
              height={currentPolygon.bbox.height}
              fill="none"
              stroke="#FF4D6D"
              strokeWidth="1.5"
              strokeDasharray="8 6"
            />
          </g>
        )}
      </svg>

      {/* 5. TACTICAL HUD LABELS OVERLAY */}
      {currentPolygon && (
        <div className="absolute inset-0">
          {/* Top-Right: Blinking AI DETECTED Badge & YOLOv8 Confidence */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {/* Blinking AI Detected Badge */}
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 rounded-lg border border-[#FF4D6D] bg-[#050C18]/90 px-3 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(255,77,109,0.4)]"
            >
              <span className="h-2 w-2 rounded-full bg-[#FF4D6D] animate-ping" />
              <span className="font-mono text-xs font-bold tracking-wider text-[#FF4D6D]">
                AI DETECTED • {currentPolygon.label}
              </span>
            </motion.div>

            {/* YOLOv8 Confidence Label */}
            <div className="rounded-md border border-[#00F5C3]/40 bg-[#050C18]/80 px-2.5 py-1 font-mono text-[10px] text-[#00F5C3] backdrop-blur-md">
              <span>YOLOv8x-Encroach v4.2 • </span>
              <span className="font-bold text-white">{currentMonth.confidence}% CONF</span>
            </div>
          </div>

          {/* Perimeter Breach Marker (Flashing Pin on Breach Coord) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              left: `${(currentPolygon.breach.x / 800) * 100}%`,
              top: `${(currentPolygon.breach.y / 500) * 100}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
          >
            <div className="rounded border border-[#FF4D6D] bg-[#FF4D6D] px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-[0_0_10px_#FF4D6D]">
              BREACH POINT // PLOT #{currentMonth.plots || 2}
            </div>
            <div className="h-2 w-0.5 bg-[#FF4D6D]" />
            <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#FF4D6D]" />
          </motion.div>

          {/* Cadastre Overlay Watermark Tag (Bottom Left) */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md border border-[#00E5FF]/30 bg-[#050C18]/85 px-3 py-1 font-mono text-[10px] text-[#00E5FF] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
            <span>CADASTRE OVERLAY: HOWRAH RS PLOTS #14-#16 (50m BUFFER VIOLATION)</span>
          </div>
        </div>
      )}

      {/* Baseline Clean Pass Indicator (Only Month 0) */}
      {monthIndex === 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-[#050C18]/85 px-3 py-1.5 font-mono text-xs font-bold text-emerald-400 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>CANOPY INTACT • ZERO ENCROACHMENT BASELINE</span>
        </div>
      )}
    </div>
  );
}
