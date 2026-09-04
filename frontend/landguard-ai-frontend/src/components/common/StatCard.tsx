import { COLORS } from "../../utils/constants";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  accentColor?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  trend,
  accentColor = COLORS.primary,
}: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.muted }}>
          {label}
        </span>
        {icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${accentColor}1A` }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold" style={{ color: COLORS.text }}>
          {value}
        </span>
        {trend && (
          <span
            className="text-xs font-medium mb-1"
            style={{ color: trend.positive ? COLORS.primary : COLORS.red }}
          >
            {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
