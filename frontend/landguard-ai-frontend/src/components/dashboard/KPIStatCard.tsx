import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  trend?: number;
  trendLabel?: string;
  accentColor?: "emerald" | "rose" | "amber" | "cyan" | "purple" | "blue";
  bottomLeft?: string;
  bottomRight?: string;
  bottomRightColor?: string;
  delay?: number;
}

const accentMap = {
  emerald: {
    border: "border-emerald-500/25 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconText: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    glow: "from-emerald-500/5 to-transparent",
  },
  rose: {
    border: "border-rose-500/30 hover:border-rose-500/55",
    iconBg: "bg-rose-500/10 border-rose-500/25",
    iconText: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    glow: "from-rose-500/5 to-transparent",
  },
  amber: {
    border: "border-amber-500/25 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconText: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    glow: "from-amber-500/5 to-transparent",
  },
  cyan: {
    border: "border-cyan-500/25 hover:border-cyan-500/50",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconText: "text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    glow: "from-cyan-500/5 to-transparent",
  },
  purple: {
    border: "border-purple-500/25 hover:border-purple-500/50",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconText: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    glow: "from-purple-500/5 to-transparent",
  },
  blue: {
    border: "border-blue-500/25 hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconText: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    glow: "from-blue-500/5 to-transparent",
  },
};

export default function KPIStatCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  trendLabel,
  accentColor = "emerald",
  bottomLeft,
  bottomRight,
  bottomRightColor,
  delay = 0,
}: KPIStatCardProps) {
  const acc = accentMap[accentColor];

  const TrendIcon =
    trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;

  const trendColor =
    trend === undefined || trend === 0
      ? "text-slate-400"
      : trend > 0
      ? "text-emerald-400"
      : "text-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={`relative rounded-xl border bg-[var(--card)] p-5 backdrop-blur-md transition-all duration-200 group shadow-lg overflow-hidden ${acc.border}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${acc.glow} pointer-events-none rounded-xl`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-[var(--muted)] uppercase">
            {label}
          </span>
          <div className={`p-2 rounded-lg border ${acc.iconBg} ${acc.iconText} group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold tracking-tight text-[var(--text)] leading-none">
            {value}
          </span>
          {trend !== undefined && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${acc.badge}`}>
              {trendLabel}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1.5 text-[11px] text-[var(--muted)] leading-snug line-clamp-2">
            {description}
          </p>
        )}

        {(bottomLeft || bottomRight) && (
          <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono">
            {bottomLeft && <span>{bottomLeft}</span>}
            {bottomRight && (
              <span className={`font-semibold ${bottomRightColor ?? acc.iconText}`}>
                {bottomRight}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
