import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  Bell,
  Scan,
  History,
  FolderKanban,
  Settings,
  Layers,
  Menu,
  X,
  Radio,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LandGuardLogo from "../common/LandGuardLogo";

interface NavItemConfig {
  key: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: { text: string; variant: "red" | "teal" };
}

const NAV_ITEMS: NavItemConfig[] = [
  { key: "gis", label: "GIS Command Center", path: "/gis", icon: Layers },
  { key: "dashboard", label: "Overview Dashboard", path: "/", icon: LayoutDashboard },
  { key: "heatmap", label: "District Heatmap", path: "/heatmap", icon: MapPin },
  {
    key: "detection",
    label: "AI Satellite Detection",
    path: "/prediction",
    icon: Scan,
    badge: { text: "YOLOv8", variant: "teal" },
  },
  {
    key: "alerts",
    label: "Live Statutory Alerts",
    path: "/alerts",
    icon: Bell,
    badge: { text: "5 LIVE", variant: "red" },
  },
  { key: "history", label: "Prediction History", path: "/history", icon: History },
  { key: "projects", label: "Monitored Projects", path: "/projects", icon: FolderKanban },
  { key: "settings", label: "System Settings", path: "/settings", icon: Settings },
];

export interface ResponsiveSidebarProps {
  onOpenCommandPalette?: () => void;
}

export default function ResponsiveSidebar({
  onOpenCommandPalette,
}: ResponsiveSidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1280;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Hamburger Header Bar (Visible on mobile screens < md) */}
      <div
        data-print="hide"
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-slate-800 bg-[#050C18]/90 px-4 backdrop-blur-xl font-mono"
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleMobile}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-[#00F5C3]"
            aria-label="Toggle navigation menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <LandGuardLogo size={28} showText />
        </div>

        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 rounded-lg border border-[#00F5C3]/30 bg-[#00F5C3]/10 px-2.5 py-1 text-[11px] text-[#00F5C3]"
          >
            <span>Ctrl + K</span>
          </button>
        )}
      </div>

      {/* Mobile Slide-Out Drawer (with backdrop) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div data-print="hide" className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobile}
              className="fixed inset-0 bg-[#050C18]/80 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative flex w-72 sm:w-80 flex-col border-r border-[#00F5C3]/30 bg-[#050C18]/98 p-5 shadow-2xl font-mono"
            >
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <LandGuardLogo size={32} showText />
                <button
                  type="button"
                  onClick={toggleMobile}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-4 flex-1 space-y-1.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.key}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        active
                          ? "border border-[#00F5C3]/40 bg-[#00F5C3]/15 text-[#00F5C3] shadow-[0_0_12px_rgba(0,245,195,0.2)]"
                          : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            item.badge.variant === "red"
                              ? "bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40"
                              : "bg-[#00F5C3]/20 text-[#00F5C3] border border-[#00F5C3]/40"
                          }`}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 text-[#00F5C3]">
                  <Radio className="h-3 w-3 animate-pulse" />
                  <span>ISRO / PM GATISHAKTI &bull; SIH26017</span>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop / Tablet Sidebar (Hidden on mobile < md) */}
      <aside
        data-print="hide"
        className={`hidden md:flex flex-col h-screen shrink-0 border-r border-[#00F5C3]/20 bg-[#050C18]/95 backdrop-blur-2xl transition-all duration-300 z-30 font-mono select-none ${
          isCollapsed ? "w-[72px]" : "w-[280px]"
        }`}
      >
        {/* Header Branding */}
        <div className={`border-b border-slate-800/90 flex items-center ${
          isCollapsed ? "flex-col justify-center p-3 gap-2" : "justify-between p-4"
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <LandGuardLogo size={30} showText={!isCollapsed} />
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-[#081326] text-slate-400 hover:border-[#00F5C3]/40 hover:text-[#00F5C3] transition"
            title={isCollapsed ? "Expand sidebar (280px)" : "Collapse sidebar (72px)"}
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Global Search Shortcut Pill */}
        {!isCollapsed && onOpenCommandPalette && (
          <div className="px-4 pt-3">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-[#081326]/80 px-3 py-2 text-xs text-slate-400 hover:border-[#00F5C3]/40 hover:text-slate-200 transition shadow-inner"
            >
              <span>Search entities...</span>
              <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-[#00F5C3]">
                Ctrl+K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.16em] text-slate-500 font-bold">
              Surveillance Network
            </p>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.key}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  active
                    ? "border border-[#00F5C3]/40 bg-[#00F5C3]/15 text-[#00F5C3] shadow-[0_0_15px_rgba(0,245,195,0.2)]"
                    : "text-slate-400 hover:bg-[#081326] hover:text-slate-100 border border-transparent"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? "bg-[#00F5C3]/20 text-[#00F5C3]"
                      : "bg-slate-900 text-slate-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      item.badge.variant === "red"
                        ? "bg-[#FF4D6D]/20 text-[#FF4D6D] border-[#FF4D6D]/40 shadow-[0_0_8px_rgba(255,77,109,0.3)]"
                        : "bg-[#00F5C3]/20 text-[#00F5C3] border-[#00F5C3]/40 shadow-[0_0_8px_rgba(0,245,195,0.2)]"
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Mission Badge */}
        <div className="p-4 border-t border-slate-800/90 text-[11px] text-slate-400 space-y-1">
          {!isCollapsed ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">LandGuard AI v2.4</span>
                <span className="text-[#00F5C3] text-[9px] border border-[#00F5C3]/30 bg-[#00F5C3]/10 px-1.5 rounded">
                  PROD
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                MoRD &bull; ISRO Bhuvan &bull; Sentinel-2
              </p>
            </>
          ) : (
            <div className="flex justify-center text-[#00F5C3]">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
