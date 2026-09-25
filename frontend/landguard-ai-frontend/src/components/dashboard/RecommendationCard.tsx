import { motion } from "framer-motion";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

interface LifecycleStep {
  label: string;
  percent: number;
  done: boolean;
}

interface RecommendationCardProps {
  district: string;
  recommendation: string;
  priority: "High" | "Medium" | "Low";
  module: string;
  delay?: number;
}

const priorityStyle = {
  High: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  Medium: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  Low: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
};

export function RecommendationCard({
  district,
  recommendation,
  priority,
  module,
  delay = 0,
}: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-emerald-500/30 transition-all duration-200 group space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-[var(--text)] truncate">{district}</span>
          <span className="text-[10px] font-mono text-[var(--muted)] truncate hidden sm:block">
            — {module}
          </span>
        </div>
        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityStyle[priority]}`}>
          {priority} Priority
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] leading-relaxed">{recommendation}</p>
      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium group-hover:gap-1.5 transition-all">
        <span>Take Action</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}

// ─── RFCTLARR Lifecycle Tracker ───────────────────────────────────────────────

interface LifecycleTrackerProps {
  steps: LifecycleStep[];
}

const stepColors = [
  { bar: "bg-emerald-500", text: "text-emerald-400" },
  { bar: "bg-cyan-500", text: "text-cyan-400" },
  { bar: "bg-blue-500", text: "text-blue-400" },
  { bar: "bg-purple-500", text: "text-purple-400" },
  { bar: "bg-amber-500", text: "text-amber-400" },
];

export function LifecycleTracker({ steps }: LifecycleTrackerProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const color = stepColors[i % stepColors.length];
        return (
          <div key={step.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                )}
                <span className="font-medium text-[var(--text)]">{step.label}</span>
              </div>
              <span className={`font-mono font-bold text-xs ${color.text}`}>{step.percent}%</span>
            </div>
            <div className="w-full bg-slate-950/60 h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
              <motion.div
                className={`h-full rounded-full ${color.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${step.percent}%` }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
