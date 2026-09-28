import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Bell,
  History,
  FolderKanban,
} from "lucide-react";

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { key: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
    { key: "gis", label: "GIS Map", path: "/gis", icon: Layers },
    // Center button: Live Alerts with pulsing red beacon
    { key: "alerts", label: "Alerts", path: "/alerts", icon: Bell, isCenter: true },
    { key: "history", label: "History", path: "/history", icon: History },
    { key: "projects", label: "Projects", path: "/projects", icon: FolderKanban },
  ];

  return (
    <div
      data-print="hide"
      className="mobile-bottom-nav lg:hidden print:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-[#050C18]/95 px-2 py-1.5 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.8)] font-mono"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          if (item.isCenter) {
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className="relative -top-4 flex flex-col items-center group focus:outline-none"
              >
                {/* Center Glowing Elevated Circular Button */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all shadow-xl ${
                    active
                      ? "border-[#FF4D6D] bg-[#FF4D6D] text-white shadow-[0_0_20px_#FF4D6D]"
                      : "border-[#FF4D6D]/70 bg-[#081326] text-[#FF4D6D] shadow-[0_0_15px_rgba(255,77,109,0.35)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {/* Pulsing Red Beacon */}
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF4D6D]" />
                  </span>
                </div>
                <span
                  className={`mt-1 text-[10px] font-bold ${
                    active ? "text-[#FF4D6D]" : "text-slate-300"
                  }`}
                >
                  Alerts
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-all ${
                active
                  ? "text-[#00F5C3]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  active ? "bg-[#00F5C3]/15 shadow-[0_0_10px_rgba(0,245,195,0.25)]" : ""
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
