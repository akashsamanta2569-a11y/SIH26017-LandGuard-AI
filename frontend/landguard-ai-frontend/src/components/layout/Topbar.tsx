import { Bell, Search } from "lucide-react";
import { Badge } from "antd";
import { COLORS } from "../../utils/constants";

interface TopbarProps {
  collapsed?: boolean;
}

export default function Topbar({ collapsed: _collapsed }: TopbarProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 shrink-0"
      style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
        height: 60,
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          color: COLORS.muted,
          minWidth: 220,
        }}
      >
        <Search size={14} />
        <span className="text-xs">Search districts, alerts…</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Alert bell */}
        <Badge count={3} size="small" color={COLORS.red}>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <Bell size={16} style={{ color: COLORS.muted }} />
          </button>
        </Badge>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: COLORS.primary, color: "#fff" }}
        >
          LG
        </div>
      </div>
    </header>
  );
}
