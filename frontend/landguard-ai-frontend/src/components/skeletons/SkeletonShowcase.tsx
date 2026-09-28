import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import KPICardSkeleton from "./KPICardSkeleton";
import AlertSkeleton from "./AlertSkeleton";
import MapSkeleton from "./MapSkeleton";
import PageLoader from "./PageLoader";

/**
 * Interactive Showcase demonstrating all 4 LandGuard AI Skeleton components
 * Built with Dark Blue (#050C18), Neon Teal (#00F5C3), Cyan Glow (#00E5FF),
 * Glassmorphism, and Government Satellite Intelligence UI.
 */
export default function SkeletonShowcase() {
  const [showFullPageLoader, setShowFullPageLoader] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "kpi" | "alert" | "map" | "loader">("all");

  return (
    <div className="min-h-screen w-full bg-[#050C18] text-slate-100 p-4 sm:p-8 font-sans selection:bg-[#00F5C3] selection:text-black">
      {/* Fullscreen PageLoader Modal / Overlay */}
      <AnimatePresence>
        {showFullPageLoader && (
          <div className="fixed inset-0 z-50">
            <PageLoader fullscreen={true} />
            <button
              onClick={() => setShowFullPageLoader(false)}
              className="fixed top-6 right-6 z-[60] flex items-center gap-2 rounded-lg border border-[#00F5C3]/40 bg-[#050C18]/90 px-4 py-2 font-mono text-xs font-semibold text-[#00F5C3] backdrop-blur-md transition-all hover:bg-[#00F5C3]/20 hover:border-[#00F5C3] shadow-[0_0_15px_rgba(0,245,195,0.3)]"
            >
              ✕ CLOSE PREVIEW
            </button>
          </div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Government Intelligence Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00F5C3]/20 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#00F5C3]">
              <span className="h-2 w-2 rounded-full bg-[#00F5C3] animate-pulse" />
              <span>SIH26017 // LANDGUARD AI INTELLIGENCE SYSTEM</span>
            </div>
            <h1 className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold tracking-wide text-white drop-shadow-[0_0_12px_rgba(0,245,195,0.4)]">
              Government Satellite Intelligence Skeletons
            </h1>
            <p className="mt-1 font-mono text-xs text-slate-400">
              Theme: #050C18 Deep Space Dark Blue • #00F5C3 Neon Teal • #00E5FF Cyan Glow • Glassmorphism
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFullPageLoader(true)}
              className="flex items-center gap-2 rounded-xl border border-[#00F5C3] bg-[#00F5C3]/15 px-4 py-2.5 font-mono text-xs font-bold text-[#00F5C3] backdrop-blur-md shadow-[0_0_20px_rgba(0,245,195,0.25)] transition-all hover:bg-[#00F5C3] hover:text-[#050C18]"
            >
              <span className="h-2 w-2 rounded-full bg-[#00F5C3] animate-ping" />
              LAUNCH FULLSCREEN PAGE LOADER
            </button>
          </div>
        </header>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {[
            { id: "all", label: "Full Dashboard View" },
            { id: "kpi", label: "1. KPICardSkeleton" },
            { id: "alert", label: "2. AlertSkeleton" },
            { id: "map", label: "3. MapSkeleton" },
            { id: "loader", label: "4. PageLoader (Inline)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-lg px-3.5 py-1.5 transition-all ${
                activeTab === tab.id
                  ? "border border-[#00F5C3] bg-[#00F5C3]/20 text-[#00F5C3] shadow-[0_0_12px_rgba(0,245,195,0.2)]"
                  : "border border-slate-800 bg-[#081326]/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SECTION 1: KPICardSkeleton */}
        {(activeTab === "all" || activeTab === "kpi") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-semibold tracking-wider text-[#00F5C3] uppercase flex items-center gap-2">
                <span>[01]</span> KPICardSkeleton Grid (Shimmer + Pulse Border Glow)
              </h2>
              <span className="font-mono text-[10px] text-slate-500">4-METRIC TACTICAL ARRAY</span>
            </div>
            <KPICardSkeleton count={4} />
          </section>
        )}

        {/* SECTION 2 & 3: MapSkeleton and AlertSkeleton Side-by-Side */}
        {(activeTab === "all" || activeTab === "map" || activeTab === "alert") && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* GIS Map Skeleton */}
            {(activeTab === "all" || activeTab === "map") && (
              <div className={`${activeTab === "map" ? "lg:col-span-12" : "lg:col-span-7"} space-y-3`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-sm font-semibold tracking-wider text-[#00F5C3] uppercase flex items-center gap-2">
                    <span>[02]</span> MapSkeleton (GIS Grid + Scanning Line)
                  </h2>
                  <span className="font-mono text-[10px] text-[#00E5FF]">SENTINEL-2 TILES</span>
                </div>
                <MapSkeleton height="h-[520px]" />
              </div>
            )}

            {/* Alert Feed Skeleton */}
            {(activeTab === "all" || activeTab === "alert") && (
              <div className={`${activeTab === "alert" ? "lg:col-span-12" : "lg:col-span-5"} space-y-3`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-sm font-semibold tracking-wider text-[#00F5C3] uppercase flex items-center gap-2">
                    <span>[03]</span> AlertSkeleton (Timeline + Confidence Bar)
                  </h2>
                  <span className="font-mono text-[10px] text-slate-500">LIVE INCIDENT FEED</span>
                </div>
                <div className="rounded-2xl border border-slate-800/80 bg-[#050C18]/60 p-4 backdrop-blur-md max-h-[520px] overflow-y-auto">
                  <AlertSkeleton count={3} showTimeline={true} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: PageLoader (Embedded Demonstration) */}
        {(activeTab === "all" || activeTab === "loader") && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-semibold tracking-wider text-[#00F5C3] uppercase flex items-center gap-2">
                <span>[04]</span> PageLoader (Rotating Satellite & 4-Step Text Cycle)
              </h2>
              <span className="font-mono text-[10px] text-[#00E5FF]">TACTICAL INITIALIZATION</span>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-[#00F5C3]/30 shadow-[0_0_30px_rgba(0,245,195,0.1)]">
              <PageLoader fullscreen={false} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
