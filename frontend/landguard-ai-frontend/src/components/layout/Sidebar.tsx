import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LandGuardLogo from "../common/LandGuardLogo";
import {
  DashboardOutlined,
  HeatMapOutlined,
  AlertOutlined,
  ScanOutlined,
  HistoryOutlined,
  ProjectOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

interface NavItem {
  key: string;
  label: string;
  path: string;
  Icon: React.ComponentType<{ style?: React.CSSProperties }>;
  badge?: { text: string; variant: "red" | "teal" };
}

const NAV_ITEMS: NavItem[] = [
  { key: "gis", label: "GIS Command Center", path: "/gis", Icon: GlobalOutlined },
  { key: "dashboard", label: "Overview Dashboard", path: "/", Icon: DashboardOutlined },
  { key: "heatmap", label: "District Heatmap", path: "/heatmap", Icon: HeatMapOutlined },
  {
    key: "detection",
    label: "AI Satellite Detection",
    path: "/prediction",
    Icon: ScanOutlined,
    badge: { text: "YOLOv8", variant: "teal" },
  },
  {
    key: "alerts",
    label: "Live Statutory Alerts",
    path: "/alerts",
    Icon: AlertOutlined,
    badge: { text: "14", variant: "red" },
  },
  { key: "history", label: "Prediction History", path: "/history", Icon: HistoryOutlined },
  { key: "projects", label: "Monitored Projects", path: "/projects", Icon: ProjectOutlined },
  { key: "settings", label: "System Settings", path: "/settings", Icon: SettingOutlined },
];

export default function Sidebar() {
  const location = useLocation();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <aside
      className="hidden md:flex flex-col h-screen shrink-0 border-r transition-colors duration-200"
      style={{
        width: 270,
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Sidebar Header */}
      <div className="px-5 pt-6 pb-4 border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex items-center gap-3">
          <LandGuardLogo size={38} showText />
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
            SIH26017
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Gov Decision Support
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 font-bold">
          Navigation
        </p>

        {NAV_ITEMS.map(({ key, label, path, Icon, badge }) => {
          const active =
            path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(path);

          const hovered = hoveredKey === key;

          return (
            <NavLink
              key={key}
              to={path}
              end={path === "/"}
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: active
                  ? "rgba(15, 118, 110, 0.12)"
                  : hovered
                  ? "var(--bg-card-subtle)"
                  : "transparent",
                color: active
                  ? "#0F766E"
                  : hovered
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
                border: active
                  ? "1px solid rgba(15, 118, 110, 0.3)"
                  : "1px solid transparent",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: active
                    ? "rgba(15, 118, 110, 0.2)"
                    : "rgba(100, 116, 139, 0.1)",
                }}
              >
                <Icon
                  style={{
                    color: active ? "#0F766E" : "#64748B",
                    fontSize: 14,
                  }}
                />
              </div>

              <span className="flex-1 truncate">{label}</span>

              {badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    badge.variant === "red"
                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800"
                      : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800"
                  }`}
                >
                  {badge.text}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div
        className="p-4 border-t text-[11px] text-slate-500 dark:text-slate-400 space-y-1"
        style={{ borderColor: "var(--border-color)" }}
      >
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          LandGuard AI v2.4
        </p>
        <p className="text-[10px]">
          MoRD · ISRO Bhuvan · Sentinel-2
        </p>
      </div>
    </aside>
  );
}