import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export interface CriticalDistrict {
  id: string;
  name: string;
  xPercent: number; // position on map canvas
  yPercent: number;
  risk: "Critical" | "High";
  confidence: number;
  affectedArea: number; // in Ha
  primaryThreat: string;
}

export const CRITICAL_DISTRICTS: CriticalDistrict[] = [
  {
    id: "paschim-bardhaman",
    name: "Paschim Bardhaman",
    xPercent: 32,
    yPercent: 44,
    risk: "Critical",
    confidence: 96.8,
    affectedArea: 4.8,
    primaryThreat: "Coal Boundary Excavation Breach",
  },
  {
    id: "howrah",
    name: "Howrah",
    xPercent: 54,
    yPercent: 62,
    risk: "Critical",
    confidence: 94.5,
    affectedArea: 18.6,
    primaryThreat: "River Corridor Illegal Structures",
  },
  {
    id: "north-24-parganas",
    name: "North 24 Parganas",
    xPercent: 68,
    yPercent: 58,
    risk: "High",
    confidence: 92.1,
    affectedArea: 9.4,
    primaryThreat: "Fisheries Dyke Intrusion",
  },
  {
    id: "sundarbans",
    name: "Sundarbans (South 24 Parganas)",
    xPercent: 72,
    yPercent: 78,
    risk: "Critical",
    confidence: 95.2,
    affectedArea: 14.2,
    primaryThreat: "Mangrove Clearing & Aquaculture Bunding",
  },
];

export interface DistrictPulseProps {
  districts?: CriticalDistrict[];
  activeDistrictId?: string;
  onSelectDistrict?: (district: CriticalDistrict) => void;
}

export default function DistrictPulse({
  districts = CRITICAL_DISTRICTS,
  activeDistrictId: _activeDistrictId,
  onSelectDistrict,
}: DistrictPulseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 font-mono">
      {districts.map((district) => {
        const isHovered = hoveredId === district.id;

        return (
          <div
            key={district.id}
            style={{
              left: `${district.xPercent}%`,
              top: `${district.yPercent}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            onMouseEnter={() => setHoveredId(district.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectDistrict?.(district)}
          >
            {/* Concentric Pulsing Glow Rings */}
            <div className="relative flex items-center justify-center cursor-pointer">
              {/* Outer expanding ping ring */}
              <motion.div
                animate={{
                  scale: [1, 2.4, 3.2],
                  opacity: [0.7, 0.25, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute h-6 w-6 rounded-full bg-[#FF4D6D]/40"
              />

              {/* Secondary teal-cyan ping ring */}
              <motion.div
                animate={{
                  scale: [1, 1.8, 2.2],
                  opacity: [0.8, 0.35, 0],
                }}
                transition={{
                  duration: 2.2,
                  delay: 0.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute h-5 w-5 rounded-full bg-[#00E5FF]/40"
              />

              {/* Core beacon dot */}
              <motion.div
                whileHover={{ scale: 1.3 }}
                className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#FF4D6D] shadow-[0_0_15px_#FF4D6D]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </motion.div>
            </div>

            {/* Interactive Hover Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 rounded-xl border border-[#FF4D6D]/60 bg-[#050C18]/95 p-3 text-xs shadow-[0_0_25px_rgba(255,77,109,0.35)] backdrop-blur-xl z-50 pointer-events-none"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                    <span className="font-bold text-white text-xs truncate">
                      {district.name}
                    </span>
                    <span className="rounded border border-[#FF4D6D]/50 bg-[#FF4D6D]/20 px-1.5 py-0.2 text-[9px] font-bold text-[#FF4D6D]">
                      {district.risk}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Risk Assessment:</span>
                      <span className="font-bold text-[#FF4D6D] flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>High Priority</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">AI Confidence:</span>
                      <span className="font-bold text-[#00F5C3]">
                        {district.confidence}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Affected Area:</span>
                      <span className="font-bold text-amber-300">
                        {district.affectedArea} Ha
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-sans border-t border-slate-800/80 pt-1 mt-1 leading-snug">
                      {district.primaryThreat}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
