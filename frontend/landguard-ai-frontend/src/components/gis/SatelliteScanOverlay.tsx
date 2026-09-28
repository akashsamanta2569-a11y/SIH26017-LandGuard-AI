import { motion } from "framer-motion";

export interface SatelliteScanOverlayProps {
  label?: string;
  sublabel?: string;
}

export default function SatelliteScanOverlay({
  label = "Sentinel-2 MSI",
  sublabel = "10m GSD • LIVE SCAN",
}: SatelliteScanOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden font-mono select-none">
      {/* 1. ANIMATED VERTICAL SCANNING LASER BEAM */}
      <motion.div
        initial={{ y: "-10%" }}
        animate={{ y: ["0%", "520%", "0%"] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 right-0 h-32"
      >
        {/* Glow trail behind the laser bar */}
        <div className="h-full w-full bg-gradient-to-b from-transparent via-[#00E5FF]/10 to-[#00F5C3]/30" />
        
        {/* Leading edge laser bar */}
        <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-[#00F5C3] to-transparent shadow-[0_0_15px_#00F5C3,0_0_30px_#00E5FF]">
          {/* Luminous nodes on scanning line */}
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#00F5C3]" />
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#00F5C3] shadow-[0_0_12px_#00F5C3]" />
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#00E5FF]" />
        </div>
      </motion.div>

      {/* 2. TOP SCANNING TELEMETRY BADGE */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-lg border border-[#00F5C3]/40 bg-[#050C18]/90 px-3 py-1.5 text-xs backdrop-blur-md shadow-[0_0_15px_rgba(0,245,195,0.25)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5C3] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F5C3]" />
        </span>
        <span className="font-bold text-[#00F5C3]">{label}</span>
        <span className="text-slate-500">|</span>
        <span className="text-[#00E5FF] text-[10px]">{sublabel}</span>
      </div>

      {/* 3. TACTICAL RETICLE CORNERS */}
      <div className="absolute top-2 left-2 text-[9px] text-[#00F5C3]/40 font-bold">+</div>
      <div className="absolute top-2 right-2 text-[9px] text-[#00F5C3]/40 font-bold">+</div>
      <div className="absolute bottom-2 left-2 text-[9px] text-[#00F5C3]/40 font-bold">+</div>
      <div className="absolute bottom-2 right-2 text-[9px] text-[#00F5C3]/40 font-bold">+</div>
    </div>
  );
}
