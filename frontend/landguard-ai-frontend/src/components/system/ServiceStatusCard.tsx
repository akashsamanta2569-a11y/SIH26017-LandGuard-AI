import { motion } from "framer-motion";
import {
  Satellite,
  Database,
  Zap,
  BrainCircuit,
  MapPin,
  Radio,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { ServiceHealthItem, ServiceStatus } from "./types";

export interface ServiceStatusCardProps {
  service: ServiceHealthItem;
}

export default function ServiceStatusCard({ service }: ServiceStatusCardProps) {
  const getStatusConfig = (status: ServiceStatus) => {
    switch (status) {
      case "ONLINE":
        return {
          dotColor: "bg-[#00F5C3]",
          pingColor: "bg-[#00F5C3]",
          badgeClass: "border-[#00F5C3]/40 bg-[#00F5C3]/15 text-[#00F5C3] shadow-[0_0_10px_rgba(0,245,195,0.25)]",
          cardBorder: "border-[#00F5C3]/25 hover:border-[#00F5C3]/60",
          glowShadow: "hover:shadow-[0_0_20px_rgba(0,245,195,0.18)]",
        };
      case "PROCESSING":
        return {
          dotColor: "bg-yellow-400",
          pingColor: "bg-yellow-400",
          badgeClass: "border-yellow-500/40 bg-yellow-500/15 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
          cardBorder: "border-yellow-500/30 hover:border-yellow-500/60",
          glowShadow: "hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]",
        };
      case "SYNCING":
        return {
          dotColor: "bg-amber-400",
          pingColor: "bg-amber-400",
          badgeClass: "border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
          cardBorder: "border-amber-500/30 hover:border-amber-500/60",
          glowShadow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
        };
      case "OFFLINE":
      default:
        return {
          dotColor: "bg-[#FF4D6D]",
          pingColor: "bg-[#FF4D6D]",
          badgeClass: "border-[#FF4D6D]/40 bg-[#FF4D6D]/15 text-[#FF4D6D] shadow-[0_0_10px_rgba(255,77,109,0.25)]",
          cardBorder: "border-[#FF4D6D]/30 hover:border-[#FF4D6D]/60",
          glowShadow: "hover:shadow-[0_0_20px_rgba(255,77,109,0.18)]",
        };
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "sentinel":
      case "cartosat":
        return Satellite;
      case "mongodb":
        return Database;
      case "fastapi":
        return Zap;
      case "yolo":
        return BrainCircuit;
      case "cadastre":
        return MapPin;
      default:
        return Radio;
    }
  };

  const config = getStatusConfig(service.status);
  const Icon = getServiceIcon(service.id);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-xl border ${config.cardBorder} bg-[#081326]/85 p-4 font-mono backdrop-blur-xl shadow-lg transition-all duration-300 ${config.glowShadow}`}
    >
      {/* Background radial gradient accent */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/5 blur-lg" />

      {/* Top row: Name & Status Badge with Pulse Dot */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-[#00E5FF]">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-white tracking-wide truncate max-w-[140px] sm:max-w-none">
            {service.name}
          </span>
        </div>

        {/* Status Badge with Live Dot */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pingColor} opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}
            />
          </span>
          <span>{service.status}</span>
        </span>
      </div>

      {/* Middle row: Latency & Uptime */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-800/90 pt-3 text-xs">
        {/* Latency */}
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            <span>LATENCY</span>
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-white">
              {service.latency}
            </span>
            <span className="text-[10px] text-[#00F5C3]">ms</span>
          </div>
        </div>

        {/* Uptime */}
        <div className="space-y-0.5 text-right">
          <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
            <span>UPTIME</span>
          </span>
          <div className="text-base font-extrabold text-emerald-400">
            {service.uptime}%
          </div>
        </div>
      </div>

      {/* Micro-bar health line */}
      <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-900">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, service.uptime)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#00F5C3] to-[#00E5FF]"
        />
      </div>
    </motion.div>
  );
}
