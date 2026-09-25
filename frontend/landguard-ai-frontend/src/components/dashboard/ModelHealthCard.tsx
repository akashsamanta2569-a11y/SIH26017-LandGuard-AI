import { motion } from "framer-motion";

interface ModelHealthCardProps {
  name: string;
  status: "online" | "syncing" | "offline";
  metric?: string;
  metricLabel?: string;
  version?: string;
  delay?: number;
}

const statusConfig = {
  online: {
    dot: "bg-emerald-400",
    ping: "bg-emerald-400",
    label: "Online",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  syncing: {
    dot: "bg-amber-400 animate-pulse",
    ping: "bg-amber-400",
    label: "Syncing",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  offline: {
    dot: "bg-slate-500",
    ping: "bg-slate-500",
    label: "Offline",
    text: "text-slate-400",
    badge: "bg-slate-800 text-slate-300 border-slate-700",
  },
};

export default function ModelHealthCard({
  name,
  status,
  metric,
  metricLabel,
  version,
  delay = 0,
}: ModelHealthCardProps) {
  const s = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-emerald-500/30 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--text)] truncate">{name}</p>
          {version && (
            <p className="text-[10px] font-mono text-[var(--muted)] mt-0.5">{version}</p>
          )}
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.badge}`}>
          <span className="relative flex h-1.5 w-1.5">
            {status === "online" && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${s.ping}`} />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${s.dot}`} />
          </span>
          {s.label}
        </span>
      </div>

      {metric && (
        <div className="mt-2 pt-2 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[var(--muted)] font-mono">{metricLabel}</span>
            <span className={`font-bold font-mono ${s.text}`}>{metric}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
