import { NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { NAV_ITEMS, COLORS } from "../../utils/constants";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      style={{
        width: collapsed ? 64 : 240,
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
      className="flex flex-col h-full relative z-20 shrink-0"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: COLORS.border }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: COLORS.primary }}
        >
          <Shield size={16} color="#fff" />
        </div>
        {!collapsed && (
          <span
            className="font-bold text-sm tracking-wide whitespace-nowrap overflow-hidden"
            style={{ color: COLORS.text }}
          >
            LandGuard <span style={{ color: COLORS.primary }}>AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ key, label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={key}
              to={path}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 mx-2 mb-1 px-3 py-2.5 rounded-lg transition-all duration-150 group"
              style={{
                background: isActive
                  ? `rgba(16,185,129,0.12)`
                  : "transparent",
                color: isActive ? COLORS.primary : COLORS.muted,
              }}
            >
              <Icon
                size={18}
                className="shrink-0"
                style={{ color: isActive ? COLORS.primary : COLORS.muted }}
              />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {label}
                </span>
              )}
              {isActive && !collapsed && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: COLORS.primary }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div
        className="border-t px-3 py-3"
        style={{ borderColor: COLORS.border }}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
          style={{ color: COLORS.muted }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && (
            <span className="text-xs font-medium">Collapse</span>
          )}
        </button>
      </div>
    </aside>
  );
}
