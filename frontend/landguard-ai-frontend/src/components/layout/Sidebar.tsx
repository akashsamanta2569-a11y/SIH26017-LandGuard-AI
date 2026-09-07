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
  badge?: { text: string; variant: "red" | "emerald" | "teal" };
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", path: "/", Icon: DashboardOutlined },
  { key: "heatmap", label: "GIS Heatmap", path: "/heatmap", Icon: HeatMapOutlined },
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
  { key: "history", label: "Prediction History", path: "/history", Icon: HistoryOutlined },
  { key: "gis", label: "GIS Map", path: "/gis", Icon: GlobalOutlined },
  { key: "projects", label: "Projects", path: "/projects", Icon: ProjectOutlined },
  { key: "settings", label: "Settings", path: "/settings", Icon: SettingOutlined },
];

const BADGE_STYLES = {
  red: {
    bg: "rgba(239,68,68,.15)",
    color: "#F87171",
    border: "1px solid rgba(239,68,68,.35)",
  },
  emerald: {
    bg: "rgba(16,185,129,.15)",
    color: "#34D399",
    border: "1px solid rgba(16,185,129,.35)",
  },
  teal: {
    bg: "rgba(20,184,166,.15)",
    color: "#2DD4BF",
    border: "1px solid rgba(20,184,166,.35)",
  },
};

function Badge({ text, variant }: { text: string; variant: "red" | "emerald" | "teal" }) {
  const s = BADGE_STYLES[variant];

  return (
    <span
      className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{
        background: s.bg,
        color: s.color,
        border: s.border,
      }}
    >
      {text}
    </span>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  return (
    <aside
      className="flex flex-col h-screen shrink-0"
      style={{
        width: 280,
        background: "linear-gradient(180deg,#0F172A,#090D16)",
        borderRight: "1px solid rgba(148,163,184,.08)",
      }}
    >
      {/* Sidebar Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <LandGuardLogo size={46} showText />
        </div>

        <div
          className="mt-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(16,185,129,.25), transparent)",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
          Main Menu
        </p>

        {NAV_ITEMS.map(({ key, label, path, Icon, badge }) => {
          const active = path === "/"
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
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
              style={{
                background: active
                  ? "linear-gradient(90deg,rgba(16,185,129,.18),rgba(20,184,166,.08))"
                  : hovered
                  ? "rgba(30,41,59,.6)"
                  : "transparent",
                border: active
                  ? "1px solid rgba(16,185,129,.25)"
                  : "1px solid transparent",
                color: active ? "#fff" : "#94A3B8",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: active
                    ? "rgba(16,185,129,.25)"
                    : "rgba(15,23,42,.7)",
                }}
              >
                <Icon style={{ color: active ? "#10B981" : "#64748B", fontSize: 15 }} />
              </div>

              <span className="flex-1 text-sm font-medium">{label}</span>

              {badge && <Badge text={badge.text} variant={badge.variant} />}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Engine Card */}
      <div className="px-3 pb-5 mt-auto">
        <div className="mb-4 h-px bg-slate-800" />

        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
                YOLOv8 Engine
              </p>
              <p className="text-[10px] text-slate-500">Sentinel-2 Sync</p>
            </div>

            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
              LIVE
            </span>
          </div>

          <div className="mt-3 flex justify-between text-[10px] text-slate-500">
            <span>Uplink</span>
            <span className="text-emerald-400">GPU 94%</span>
          </div>

          <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: "94%",
                background: "linear-gradient(90deg,#10B981,#14B8A6)",
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}