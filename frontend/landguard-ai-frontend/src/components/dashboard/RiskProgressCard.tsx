import { motion } from "framer-motion";

interface RiskProgressCardProps {
  label: string;
  count: number;
  total?: number;
  percent: number;
  variant: "critical" | "high" | "moderate" | "low";
  delay?: number;
}

const variantMap = {
  critical: {
    bar: "bg-gradient-to-r from-rose-600 via-rose-500 to-red-400",
    text: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/25",
    dot: "bg-rose-400",
  },
  high: {
    bar: "bg-gradient-to-r from-amber-600 via-amber-500 to-orange-400",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    dot: "bg-amber-400",
  },
  moderate: {
    bar: "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400",
    text: "text-yellow-400",
    badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
    dot: "bg-yellow-400",
  },
  low: {
    bar: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
};

export default function RiskProgressCard({
  label,
  count,
  percent,
  variant,
  delay = 0,
}: RiskProgressCardProps) {
  const v = variantMap[variant];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${v.dot}`} />
          <span className="font-semibold text-[var(--text)]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold text-sm ${v.text}`}>{count}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] border font-mono ${v.badge}`}>
            {percent}%
          </span>
        </div>
      </div>
      <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-[var(--border)]">
        <motion.div
          className={`h-full rounded-full ${v.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
