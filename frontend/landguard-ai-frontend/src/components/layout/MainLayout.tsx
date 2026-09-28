import { Outlet } from "react-router-dom";
import ResponsiveSidebar from "./ResponsiveSidebar";
import MobileBottomNav from "./MobileBottomNav";
import CommandPalette from "./CommandPalette";
import FloatingActionDock from "./FloatingActionDock";
import AmbientBackground from "./AmbientBackground";
import Topbar from "./Topbar";
import { useCommandPalette } from "../../hooks/useCommandPalette";

export default function MainLayout() {
  const { isOpen, open, close } = useCommandPalette();

  return (
    <div
      className="relative flex h-screen overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      {/* Ambient background particles & grid */}
      <AmbientBackground />

      {/* Responsive Sidebar (desktop, tablet collapsed, mobile drawer) */}
      <ResponsiveSidebar onOpenCommandPalette={open} />

      {/* Right Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 pt-14 md:pt-0">
        <Topbar onOpenCommandPalette={open} />

        <main
          className="main-content flex-1 overflow-y-auto transition-colors duration-200 pb-28 lg:pb-6 print:pb-0 print:overflow-visible"
          style={{
            backgroundColor: "transparent",
          }}
        >
          <div className="mx-auto w-full max-w-[1720px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (only visible < lg) */}
      <MobileBottomNav />

      {/* Floating Action Dock (bottom right) */}
      <FloatingActionDock />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={isOpen} onClose={close} />
    </div>
  );
}