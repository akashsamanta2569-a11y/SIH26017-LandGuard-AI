import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  FileDown,
  Download,
  Plane,
  Bell,
  X,
  Zap,
  CheckCircle,
} from "lucide-react";
import { usePrintReport } from "../../hooks/usePrintReport";

export default function FloatingActionDock() {
  const exportPDF = usePrintReport();
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const triggerAction = (_label: string, message: string) => {
    setIsOpen(false);
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const actionItems = [
    {
      id: "pdf",
      label: "Export PDF",
      icon: FileDown,
      color: "bg-purple-600/30 border-purple-500/50 text-purple-300 hover:bg-purple-600/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
      action: () => {
        triggerAction("PDF", "Comprehensive West Bengal GIS Intelligence Report (PDF) generating...");
        exportPDF();
      },
    },
    {
      id: "geojson",
      label: "Export GeoJSON",
      icon: Download,
      color: "bg-cyan-600/30 border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
      action: () => triggerAction("GeoJSON", "District Encroachment Boundaries exported in EPSG:4326 GeoJSON format."),
    },
    {
      id: "drone",
      label: "Drone Dispatch",
      icon: Plane,
      color: "bg-emerald-600/30 border-[#00F5C3]/50 text-[#00F5C3] hover:bg-emerald-600/50 shadow-[0_0_15px_rgba(0,245,195,0.3)]",
      action: () => triggerAction("Drone", "Immediate QRT Drone Patrol task queued for Howrah & S24 Parganas."),
    },
    {
      id: "fir",
      label: "Emergency FIR",
      icon: ShieldAlert,
      color: "bg-rose-600/30 border-[#FF4D6D]/50 text-[#FF4D6D] hover:bg-rose-600/50 shadow-[0_0_15px_rgba(255,77,109,0.3)]",
      action: () => triggerAction("FIR", "Statutory Forest Act Violation FIR Draft dispatched to DM & SP."),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "bg-amber-600/30 border-amber-500/50 text-amber-300 hover:bg-amber-600/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      action: () => triggerAction("Notifications", "Telemetry Channel synchronizing with 23 Divisional Checkposts."),
    },
  ];

  // Radial fan-out parameters: Radius R and Angle arc from 0 to 90 degrees (upwards to leftwards)
  const radius = 105;

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            data-print="hide"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-20 sm:bottom-24 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#00F5C3] bg-[#050C18]/95 px-4 py-3 font-mono text-xs text-[#00F5C3] shadow-[0_0_25px_rgba(0,245,195,0.35)] backdrop-blur-xl max-w-sm"
          >
            <CheckCircle className="h-4 w-4 shrink-0 text-[#00F5C3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Dock Container (Bottom-Right, above mobile nav) */}
      <div
        data-print="hide"
        className="floating-action-dock fixed bottom-20 sm:bottom-8 right-6 z-40 font-mono select-none"
      >
        {/* Radial Action Items */}
        <AnimatePresence>
          {isOpen &&
            actionItems.map((item, idx) => {
              const Icon = item.icon;
              // Angle from 0 (straight up) to 90 deg (straight left)
              const angleRad = (idx / (actionItems.length - 1)) * (Math.PI / 2);
              const xOffset = -Math.sin(angleRad) * radius;
              const yOffset = -Math.cos(angleRad) * radius;

              return (
                <motion.div
                  key={item.id}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                  animate={{
                    x: xOffset,
                    y: yOffset,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 22,
                      delay: idx * 0.035,
                    },
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.2,
                    transition: { duration: 0.18 },
                  }}
                  className="absolute bottom-1 right-1 flex items-center"
                >
                  {/* Tooltip Label on Hover */}
                  <AnimatePresence>
                    {hoveredId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: -8 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="pointer-events-none absolute right-12 whitespace-nowrap rounded-lg border border-slate-700 bg-[#050C18]/95 px-2.5 py-1 text-[11px] font-semibold text-slate-200 shadow-xl backdrop-blur-md"
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Circular Button */}
                  <button
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(item.id)}
                    onBlur={() => setHoveredId(null)}
                    aria-label={item.label}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 backdrop-blur-xl transition-transform hover:scale-115 active:scale-95 ${item.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Master Radial Toggle Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all shadow-[0_0_25px_rgba(0,245,195,0.35)] ${
            isOpen
              ? "border-[#FF4D6D] bg-[#050C18] text-[#FF4D6D] shadow-[0_0_20px_#FF4D6D]"
              : "border-[#00F5C3] bg-gradient-to-tr from-[#050C18] via-[#081326] to-[#0d2238] text-[#00F5C3]"
          }`}
          title="Quick Surveillance Actions (Radial)"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Zap className="h-6 w-6 fill-current animate-pulse" />
          )}
        </motion.button>
      </div>
    </>
  );
}
