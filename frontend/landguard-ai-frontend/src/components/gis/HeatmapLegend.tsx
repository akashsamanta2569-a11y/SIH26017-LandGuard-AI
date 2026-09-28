import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ShieldAlert, Activity, ChevronDown, ChevronUp } from "lucide-react";

export interface HeatmapLegendProps {
  showNdvi?: boolean;
  showCadastre?: boolean;
  initialCollapsed?: boolean;
}

export default function HeatmapLegend({
  showNdvi = true,
  showCadastre = true,
  initialCollapsed = false,
}: HeatmapLegendProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const riskLevels = [
    { label: "Critical Risk (>80%)", color: "bg-[#FF4D6D]", border: "border-[#FF4D6D]/40", text: "text-[#FF4D6D]" },
    { label: "High Risk (60-80%)", color: "bg-amber-400", border: "border-amber-400/40", text: "text-amber-400" },
    { label: "Moderate Risk (40-60%)", color: "bg-[#00E5FF]", border: "border-[#00E5FF]/40", text: "text-[#00E5FF]" },
    { label: "Low Risk (<40%)", color: "bg-emerald-400", border: "border-emerald-400/40", text: "text-emerald-400" },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#050C18]/90 font-mono text-xs shadow-xl backdrop-blur-xl select-none transition-all duration-200 overflow-hidden">
      {/* Risk Legend Header (Clickable Collapse Header) */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="w-full flex items-center justify-between p-3 cursor-pointer hover:bg-slate-900/60 transition-colors text-left"
        title={isCollapsed ? "Expand Heatmap Risk Legend" : "Collapse Heatmap Risk Legend"}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#00F5C3]" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            GIS Encroachment Risk Index
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="hidden sm:inline text-slate-500">ISRO</span>
          {isCollapsed ? (
            <ChevronDown className="h-3.5 w-3.5 text-[#00F5C3]" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="px-3.5 pb-3.5 space-y-3 border-t border-slate-800/80 pt-2.5"
          >
            {/* 4 Risk Categories */}
            <div className="grid grid-cols-2 gap-2">
              {riskLevels.map((lvl) => (
                <div key={lvl.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${lvl.color} shadow-sm shrink-0`} />
                  <span className="text-[10px] text-slate-300 truncate">{lvl.label}</span>
                </div>
              ))}
            </div>

            {/* NDVI Vegetation Scale */}
            {showNdvi && (
              <div className="border-t border-slate-800 pt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-[#00F5C3]" />
                    <span>NDVI Multi-Spectral Canopy Scale</span>
                  </span>
                  <span className="text-emerald-400 font-bold">+0.8</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500 shadow-inner" />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>-0.2 (Clearing)</span>
                  <span>+0.3 (Grassland)</span>
                  <span>+0.8 (Dense Canopy)</span>
                </div>
              </div>
            )}

            {/* Cadastre Overlay Indicator */}
            {showCadastre && (
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#00E5FF]" />
                  <span>Cadastre RS Plots Layer</span>
                </div>
                <span className="text-[#00F5C3] font-bold">1:5,000 WGS84</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
