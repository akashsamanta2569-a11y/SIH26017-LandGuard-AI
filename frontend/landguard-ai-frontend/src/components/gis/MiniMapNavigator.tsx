import { motion } from "framer-motion";
import { Compass, Maximize2 } from "lucide-react";

export interface MiniMapNavigatorProps {
  currentDistrict?: string;
  onSelectDistrict?: (districtName: string) => void;
  className?: string;
}

interface DistrictRegion {
  id: string;
  name: string;
  path: string;
  centroid: { x: number; y: number };
}

// Simplified West Bengal district polygon regions for tactical minimap
const WB_REGIONS: DistrictRegion[] = [
  { id: "darjeeling", name: "Darjeeling", path: "M 48 10 L 62 8 L 68 22 L 54 28 Z", centroid: { x: 58, y: 17 } },
  { id: "jalpaiguri", name: "Jalpaiguri", path: "M 68 22 L 95 18 L 88 38 L 62 34 Z", centroid: { x: 78, y: 26 } },
  { id: "alipurduar", name: "Alipurduar", path: "M 95 18 L 122 15 L 115 36 L 88 38 Z", centroid: { x: 105, y: 24 } },
  { id: "coochbehar", name: "Cooch Behar", path: "M 88 38 L 115 36 L 118 52 L 86 50 Z", centroid: { x: 102, y: 44 } },
  { id: "uttar-dinajpur", name: "Uttar Dinajpur", path: "M 52 38 L 74 36 L 70 66 L 50 64 Z", centroid: { x: 62, y: 50 } },
  { id: "dakshin-dinajpur", name: "Dakshin Dinajpur", path: "M 54 66 L 82 65 L 78 88 L 52 86 Z", centroid: { x: 67, y: 76 } },
  { id: "malda", name: "Malda", path: "M 46 88 L 75 86 L 72 112 L 44 110 Z", centroid: { x: 60, y: 99 } },
  { id: "murshidabad", name: "Murshidabad", path: "M 48 112 L 82 108 L 86 138 L 50 140 Z", centroid: { x: 66, y: 125 } },
  { id: "birbhum", name: "Birbhum", path: "M 28 128 L 50 126 L 46 158 L 24 154 Z", centroid: { x: 37, y: 142 } },
  { id: "nadia", name: "Nadia", path: "M 68 138 L 92 136 L 88 172 L 66 170 Z", centroid: { x: 78, y: 155 } },
  { id: "purba-bardhaman", name: "Purba Bardhaman", path: "M 46 142 L 72 140 L 68 168 L 42 166 Z", centroid: { x: 57, y: 154 } },
  { id: "paschim-bardhaman", name: "Paschim Bardhaman", path: "M 22 154 L 46 150 L 42 174 L 18 172 Z", centroid: { x: 32, y: 163 } },
  { id: "bankura", name: "Bankura", path: "M 18 172 L 48 170 L 44 200 L 16 198 Z", centroid: { x: 32, y: 186 } },
  { id: "purulia", name: "Purulia", path: "M 2 168 L 22 166 L 18 206 L 2 202 Z", centroid: { x: 11, y: 187 } },
  { id: "hooghly", name: "Hooghly", path: "M 52 168 L 72 166 L 70 188 L 50 186 Z", centroid: { x: 61, y: 177 } },
  { id: "howrah", name: "Howrah", path: "M 56 188 L 74 186 L 72 202 L 54 200 Z", centroid: { x: 64, y: 195 } },
  { id: "kolkata", name: "Kolkata", path: "M 74 190 L 84 188 L 82 200 L 72 200 Z", centroid: { x: 78, y: 195 } },
  { id: "north-24-parganas", name: "North 24 Parganas", path: "M 72 172 L 98 170 L 96 210 L 74 208 Z", centroid: { x: 86, y: 190 } },
  { id: "south-24-parganas", name: "South 24 Parganas", path: "M 64 206 L 98 204 L 92 248 L 58 244 Z", centroid: { x: 78, y: 226 } },
  { id: "paschim-medinipur", name: "Paschim Medinipur", path: "M 22 200 L 52 198 L 48 232 L 18 230 Z", centroid: { x: 35, y: 215 } },
  { id: "purba-medinipur", name: "Purba Medinipur", path: "M 52 204 L 72 202 L 68 244 L 48 240 Z", centroid: { x: 60, y: 223 } },
  { id: "jhargram", name: "Jhargram", path: "M 8 208 L 24 206 L 20 236 L 4 232 Z", centroid: { x: 14, y: 221 } },
];

export default function MiniMapNavigator({
  currentDistrict = "Howrah",
  onSelectDistrict,
  className = "",
}: MiniMapNavigatorProps) {
  return (
    <div
      className={`rounded-2xl border border-[#00F5C3]/30 bg-[#050C18]/92 p-3 font-mono shadow-[0_8px_32px_rgba(5,12,24,0.95)] backdrop-blur-xl w-48 sm:w-56 select-none ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-[#00F5C3]">
          <Compass className="h-3 w-3" />
          <span className="font-bold uppercase tracking-wider">West Bengal</span>
        </div>
        <span className="text-slate-400 flex items-center gap-1">
          <Maximize2 className="h-2.5 w-2.5 text-[#00E5FF]" />
          <span>NAV</span>
        </span>
      </div>

      {/* SVG Minimap Canvas */}
      <div className="relative aspect-[3/4] w-full flex items-center justify-center bg-[#081326]/60 rounded-xl border border-slate-800/80 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:12px_12px] opacity-15" />

        <svg viewBox="0 0 130 260" className="h-full w-full p-2">
          {WB_REGIONS.map((region) => {
            const isSelected =
              region.name.toLowerCase() === currentDistrict.toLowerCase() ||
              (currentDistrict.toLowerCase().includes("24") && region.name.toLowerCase().includes("24"));

            return (
              <g key={region.id} className="cursor-pointer">
                <motion.path
                  d={region.path}
                  onClick={() => onSelectDistrict?.(region.name)}
                  whileHover={{ scale: 1.05 }}
                  className={`transition-colors duration-200 ${
                    isSelected
                      ? "fill-[#00F5C3]/40 stroke-[#00F5C3] stroke-[1.8]"
                      : "fill-slate-800/50 stroke-slate-600/70 hover:fill-[#00E5FF]/20 hover:stroke-[#00E5FF] stroke-[0.8]"
                  }`}
                />
                {isSelected && (
                  <circle
                    cx={region.centroid.x}
                    cy={region.centroid.y}
                    r="3.5"
                    fill="#00F5C3"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected District Callout Pill */}
        <div className="absolute bottom-1.5 inset-x-1.5 rounded-lg border border-[#00F5C3]/40 bg-[#050C18]/90 px-2 py-0.5 text-center text-[9px] font-bold text-[#00F5C3] backdrop-blur-md shadow-sm truncate">
          {currentDistrict}
        </div>
      </div>
    </div>
  );
}
