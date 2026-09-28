import { motion } from "framer-motion";
import { ShieldCheck, Activity } from "lucide-react";

export interface HealthGaugeProps {
  score?: number;
  label?: string;
  statusText?: string;
}

export default function HealthGauge({
  score = 98,
  label = "OVERALL SYSTEM HEALTH",
  statusText = "Mission Ready",
}: HealthGaugeProps) {
  // SVG Circle parameters
  const radius = 64;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-4 rounded-2xl border border-[#00F5C3]/25 bg-[#050C18]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(5,12,24,0.9)] overflow-hidden font-mono">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,245,195,0.12),transparent_70%)]" />

      {/* Top Tag */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-2">
        <Activity className="h-3 w-3 text-[#00F5C3]" />
        <span className="tracking-widest uppercase">{label}</span>
      </div>

      {/* Circular Gauge Stage */}
      <div className="relative flex items-center justify-center h-44 w-44">
        {/* Pulsing Glow Ring (Animated every 2 seconds) */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-2 rounded-full border border-[#00F5C3]/30 shadow-[0_0_25px_rgba(0,245,195,0.35)]"
        />

        {/* Counter-rotating secondary reticle ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-5 rounded-full border border-dashed border-[#00E5FF]/25"
        />

        <svg className="h-44 w-44 -rotate-90 transform" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00F5C3" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Inactive background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="#101D33"
            strokeWidth={strokeWidth}
          />

          {/* Active Animated Progress Arc */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            key={score}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(0,245,195,0.6)]"
          >
            {score}%
          </motion.div>

          {/* Mission Ready Status Pill */}
          <div className="mt-1 flex items-center gap-1.5 rounded-full border border-[#00F5C3]/40 bg-[#00F5C3]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#00F5C3] shadow-[0_0_10px_rgba(0,245,195,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F5C3] animate-pulse" />
            <span>{statusText}</span>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="mt-2 flex items-center justify-between w-full border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          <span>SLA &gt; 99.9%</span>
        </span>
        <span className="text-[#00E5FF]">FAILOVER: ACTIVE</span>
      </div>
    </div>
  );
}
