import { motion } from "framer-motion";
import { MapPin, Sparkles, Clock, ChevronRight } from "lucide-react";

interface AlertPreviewCardProps {
  id: string;
  district: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  confidence: number;
  areaHa: number;
  timestamp: string;
  title: string;
  status?: string;
  delay?: number;
}

const severityStyle = {
  Critical: "bg-rose-500/15 text-rose-300 border-rose-500/40",
  High: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  Medium: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  Low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const severityDot = {
  Critical: "bg-rose-400 animate-pulse",
  High: "bg-amber-400",
  Medium: "bg-yellow-400",
  Low: "bg-emerald-400",
};

export default function AlertPreviewCard({
  id,
  district,
  severity,
  confidence,
  areaHa,
  timestamp,
  title,
  delay = 0,
}: AlertPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-emerald-500/35 transition-all duration-200 hover:bg-[var(--card)] group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${severityStyle[severity]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${severityDot[severity]}`} />
              {severity}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--text)] bg-[var(--card)] px-2 py-0.5 rounded border border-[var(--border)]">
              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
              {district}
            </span>
            <span className="text-[10px] font-mono text-[var(--muted)]">{id}</span>
          </div>

          {/* Title */}
          <p className="text-xs font-semibold text-[var(--text)] group-hover:text-emerald-300 transition-colors leading-snug line-clamp-1">
            {title}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 text-[10px] text-[var(--muted)]">
            <span>Area: {areaHa} Ha</span>
            <span>•</span>
            <Clock className="w-2.5 h-2.5" />
            <span>{timestamp}</span>
          </div>
        </div>

        {/* Confidence */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
            <Sparkles className="w-2.5 h-2.5" />
            {confidence}%
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
