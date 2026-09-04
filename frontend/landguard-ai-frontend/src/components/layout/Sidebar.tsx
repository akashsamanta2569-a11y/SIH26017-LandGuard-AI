import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  HeatMapOutlined,
  AlertOutlined,
  ScanOutlined,
  HistoryOutlined,
  ProjectOutlined,
  SettingOutlined,
  RocketOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  key: string;
  label: string;
  path: string;
  Icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  badge?: { text: string; variant: "red" | "emerald" | "teal" };
}

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
    Icon: DashboardOutlined,
  },
  {
    key: "heatmap",
    label: "GIS Heatmap",
    path: "/heatmap",
    Icon: HeatMapOutlined,
  },
  {
    key: "alerts",
    label: "Live Alerts",
    path: "/alerts",
    Icon: AlertOutlined,
    badge: { text: "14", variant: "red" },
  },
  {
    key: "detection",
    label: "AI Detection",
    path: "/prediction",
    Icon: ScanOutlined,
    badge: { text: "YOLOv8", variant: "emerald" },
  },
  {
    key: "history",
    label: "Prediction History",
    path: "/history",
    Icon: HistoryOutlined,
  },
  {
    key: "gis",
    label: "GIS Map",
    path: "/gis",
    Icon: GlobalOutlined,
  },
  {
    key: "projects",
    label: "Projects",
    path: "/projects",
    Icon: ProjectOutlined,
  },
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    Icon: SettingOutlined,
  },
];

// ─── Badge variants ───────────────────────────────────────────────────────────

const BADGE_STYLES: Record<
  "red" | "emerald" | "teal",
  { bg: string; color: string; border: string; shadow: string }
> = {
  red: {
    bg: "rgba(239,68,68,0.15)",
    color: "#F87171",
    border: "1px solid rgba(239,68,68,0.35)",
    shadow: "0 0 8px rgba(239,68,68,0.3)",
  },
  emerald: {
    bg: "rgba(16,185,129,0.15)",
    color: "#34D399",
    border: "1px solid rgba(16,185,129,0.35)",
    shadow: "0 0 8px rgba(16,185,129,0.3)",
  },
  teal: {
    bg: "rgba(20,184,166,0.15)",
    color: "#2DD4BF",
    border: "1px solid rgba(20,184,166,0.35)",
    shadow: "0 0 8px rgba(20,184,166,0.3)",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({
  text,
  variant,
}: {
  text: string;
  variant: "red" | "emerald" | "teal";
}) {
  const s = BADGE_STYLES[variant];
  return (
    <span
      className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shrink-0"
      style={{
        background: s.bg,
        color: s.color,
        border: s.border,
        boxShadow: s.shadow,
        fontFamily: "'Inter', monospace",
      }}
    >
      {text}
    </span>
  );
}

function TelemetryDot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="pulse-dot inline-block w-1 h-1 rounded-full"
      style={{
        background: "#10B981",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Sidebar() {
  const location = useLocation();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <aside
      className="flex flex-col h-screen shrink-0 relative"
      style={{
        width: 280,
        background: "linear-gradient(180deg, #0F172A 0%, #0B1220 60%, #090D16 100%)",
        borderRight: "1px solid rgba(148,163,184,0.08)",
        borderRadius: "0 20px 20px 0",
        boxShadow: "4px 0 32px rgba(0,0,0,0.6), inset -1px 0 0 rgba(16,185,129,0.06)",
        zIndex: 30,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* ── Ambient top glow ──────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-64"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(16,185,129,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Branding ──────────────────────────────────────────────────────── */}
      <div className="relative px-6 pt-8 pb-6">
        <div className="flex items-center gap-4">
          {/* Shield icon with glow ring */}
          <div className="relative flex-shrink-0">
            <div
              className="glow-ring w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(20,184,166,0.15) 100%)",
                border: "1.5px solid rgba(16,185,129,0.5)",
              }}
            >
              <RocketOutlined
                style={{ fontSize: 20, color: "#10B981" }}
              />
            </div>
            {/* Online indicator */}
            <span
              className="pulse-dot absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                background: "#10B981",
                borderColor: "#0F172A",
                boxShadow: "0 0 8px #10B981",
              }}
            />
          </div>

          {/* Wordmark */}
          <div>
            <h1
              className="text-base font-bold leading-none tracking-wide"
              style={{
                background: "linear-gradient(90deg, #F9FAFB 0%, #94A3B8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LandGuard{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #10B981, #14B8A6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI
              </span>
            </h1>
            <p
              className="mt-1 text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "rgba(148,163,184,0.6)" }}
            >
              GOVT OF WB&nbsp;/&nbsp;SIH 2026
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(16,185,129,0.25) 30%, rgba(20,184,166,0.2) 70%, transparent)",
          }}
        />
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {/* Section label */}
        <p
          className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em]"
          style={{ color: "rgba(100,116,139,0.7)" }}
        >
          Main Menu
        </p>

        {NAV_ITEMS.map(({ key, label, path, Icon, badge }, index) => {
          const isActive =
            path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);
          const isHovered = hoveredKey === key;

          return (
            <NavLink
              key={key}
              to={path}
              end={path === "/"}
              className="sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl relative group select-none"
              style={{
                animationDelay: `${index * 40}ms`,
                textDecoration: "none",
                background: isActive
                  ? "linear-gradient(90deg, rgba(16,185,129,0.18) 0%, rgba(20,184,166,0.08) 100%)"
                  : isHovered
                  ? "rgba(30,41,59,0.7)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(16,185,129,0.22)"
                  : "1px solid transparent",
                transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
                transform: isHovered && !isActive ? "translateX(3px)" : "translateX(0)",
                boxShadow: isActive
                  ? "0 2px 12px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "none",
              }}
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {/* Active left indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                  style={{
                    background: "linear-gradient(180deg, #10B981, #14B8A6)",
                    boxShadow: "2px 0 10px rgba(16,185,129,0.6)",
                  }}
                />
              )}

              {/* Icon container */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(20,184,166,0.2) 100%)"
                    : isHovered
                    ? "rgba(30,41,59,0.9)"
                    : "rgba(15,23,42,0.6)",
                  border: isActive
                    ? "1px solid rgba(16,185,129,0.4)"
                    : "1px solid rgba(148,163,184,0.08)",
                  boxShadow: isActive
                    ? "0 0 12px rgba(16,185,129,0.25)"
                    : "none",
                }}
              >
                <Icon
                  style={{
                    fontSize: 15,
                    color: isActive
                      ? "#10B981"
                      : isHovered
                      ? "#CBD5E1"
                      : "#64748B",
                    transition: "color 0.18s",
                    filter: isActive
                      ? "drop-shadow(0 0 4px rgba(16,185,129,0.6))"
                      : "none",
                  }}
                />
              </div>

              {/* Label */}
              <span
                className="text-sm font-medium flex-1 whitespace-nowrap"
                style={{
                  color: isActive
                    ? "#F9FAFB"
                    : isHovered
                    ? "#CBD5E1"
                    : "#64748B",
                  transition: "color 0.18s",
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </span>

              {/* Badge */}
              {badge && <Badge text={badge.text} variant={badge.variant} />}

              {/* Active chevron */}
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #10B981, #14B8A6)",
                    boxShadow: "0 0 6px #10B981",
                  }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom Status Card ────────────────────────────────────────────── */}
      <div className="px-3 pb-6 mt-auto">
        {/* Divider */}
        <div
          className="mb-4 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(30,41,59,0.8) 50%, transparent)",
          }}
        />

        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(11,18,32,0.98) 100%)",
            border: "1px solid rgba(148,163,184,0.1)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Glass shimmer top edge */}
          <div
            className="pointer-events-none absolute top-0 left-4 right-4 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent)",
            }}
          />

          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
            }}
          />

          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p
                className="text-[10px] font-bold tracking-[0.15em] uppercase"
                style={{ color: "#10B981" }}
              >
                YOLOv8 ENGINE
              </p>
              <p
                className="text-[9px] mt-0.5 tracking-wide"
                style={{ color: "rgba(100,116,139,0.8)" }}
              >
                Sentinel-2 Sync
              </p>
            </div>

            {/* LIVE badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              <span
                className="pulse-dot w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#10B981",
                  boxShadow: "0 0 6px #10B981",
                }}
              />
              <span
                className="text-[9px] font-bold tracking-widest"
                style={{ color: "#10B981" }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Telemetry row */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "1px solid rgba(30,41,59,0.8)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px]" style={{ color: "rgba(100,116,139,0.7)" }}>
                Uplink
              </span>
              <div className="flex items-center gap-1">
                <TelemetryDot delay={0} />
                <TelemetryDot delay={200} />
                <TelemetryDot delay={400} />
                <TelemetryDot delay={600} />
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "rgba(100,116,139,0.2)" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px]" style={{ color: "rgba(100,116,139,0.7)" }}>
                GPU
              </span>
              <span
                className="text-[9px] font-semibold font-mono"
                style={{ color: "#34D399" }}
              >
                94%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="mt-2.5 h-0.5 rounded-full overflow-hidden"
            style={{ background: "rgba(30,41,59,0.8)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "94%",
                background: "linear-gradient(90deg, #10B981, #14B8A6)",
                boxShadow: "0 0 8px rgba(16,185,129,0.5)",
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
