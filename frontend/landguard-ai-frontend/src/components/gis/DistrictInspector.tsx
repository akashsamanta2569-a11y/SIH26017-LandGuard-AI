import { useState } from "react";
import {
  EnvironmentOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  BranchesOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  BankOutlined,
  ApartmentOutlined,
  RadarChartOutlined,
  ArrowUpOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

interface DistrictInspectorProps {
  districtName?: string;
  onClose?: () => void;
}

export default function DistrictInspector({
  districtName = "North 24 Parganas",
  onClose,
}: DistrictInspectorProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "infra">("overview");

  return (
    <aside
      className="relative w-full lg:w-[380px] rounded-3xl p-5 sm:p-6 flex flex-col gap-5 select-none transition-all duration-300"
      style={{
        background: "rgba(17, 24, 39, 0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(51, 65, 85, 0.8)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.06), 0 20px 48px -12px rgba(0,0,0,0.65), 0 0 60px rgba(16,185,129,0.05)",
        animation: "districtPanelFade 0.4s ease-out both",
      }}
    >
      {/* ── Scoped Keyframe Animations ── */}
      <style>{`
        @keyframes districtPanelFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes districtBeaconPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          70% {
            transform: scale(2.3);
            opacity: 0;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes barGrow {
          from {
            width: 0%;
          }
        }
      `}</style>

      {/* ── Ambient Radial Glow Inside Card ── */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-52 h-52 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(16,185,129,0.15) 50%, transparent 70%)",
        }}
      />

      {/* ── SECTION 1: District Header ── */}
      <div className="relative z-10 flex items-start justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-400">
            <EnvironmentOutlined style={{ color: "#10B981" }} />
            <span>District Intelligence</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            {districtName}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            {/* Risk Level Badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border"
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                borderColor: "rgba(239, 68, 68, 0.4)",
                color: "#EF4444",
                boxShadow: "0 0 12px rgba(239, 68, 68, 0.2)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                  style={{ animation: "districtBeaconPulse 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span>Critical Risk</span>
            </div>

            {/* Zone Tag */}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800">
              ZONE WB-NORTH
            </span>
          </div>
        </div>

        {/* AI Score Badge */}
        <div
          className="flex flex-col items-center justify-center px-3.5 py-2 rounded-2xl border text-center select-none"
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            borderColor: "rgba(239, 68, 68, 0.35)",
            boxShadow: "0 0 16px rgba(239, 68, 68, 0.15)",
          }}
        >
          <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase">
            AI Score
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black font-mono text-white tracking-tight">92</span>
            <span className="text-[11px] font-mono text-red-400/80">/100</span>
          </div>
        </div>
      </div>

      {/* ── Sub-navigation Tab Selector ── */}
      <div className="relative z-10 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              : "text-slate-400 hover:text-slate-200 border border-transparent"
          }`}
        >
          Overview & AI
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("infra")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            activeTab === "infra"
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
              : "text-slate-400 hover:text-slate-200 border border-transparent"
          }`}
        >
          Infrastructure (3)
        </button>
      </div>

      {/* ── SECTION 2: Metrics Grid ── */}
      <div className="relative z-10 grid grid-cols-2 gap-2.5">
        {/* Metric 1: Active Alerts */}
        <div
          className="rounded-2xl p-3 border flex flex-col justify-between"
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            borderColor: "rgba(239, 68, 68, 0.25)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="font-medium">Active Alerts</span>
            <AlertOutlined style={{ color: "#EF4444" }} />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black font-mono text-red-400">14</span>
            <span className="text-[10px] font-mono text-red-400/80 flex items-center">
              <ArrowUpOutlined style={{ fontSize: 9 }} /> +3 today
            </span>
          </div>
        </div>

        {/* Metric 2: Budget Exposure */}
        <div
          className="rounded-2xl p-3 border flex flex-col justify-between"
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            borderColor: "rgba(245, 158, 11, 0.25)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="font-medium">Budget Exposure</span>
            <BankOutlined style={{ color: "#F59E0B" }} />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black font-mono text-amber-400">₹18.4</span>
            <span className="text-xs font-mono text-slate-300">Cr</span>
          </div>
        </div>

        {/* Metric 3: Projects Impacted */}
        <div
          className="rounded-2xl p-3 border flex flex-col justify-between"
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            borderColor: "rgba(20, 184, 166, 0.25)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="font-medium">Projects Impacted</span>
            <ApartmentOutlined style={{ color: "#14B8A6" }} />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black font-mono text-teal-300">5</span>
            <span className="text-[10px] text-slate-400">Major Corridors</span>
          </div>
        </div>

        {/* Metric 4: NDVI Loss */}
        <div
          className="rounded-2xl p-3 border flex flex-col justify-between"
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            borderColor: "rgba(16, 185, 129, 0.25)",
          }}
        >
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="font-medium">NDVI Loss</span>
            <RiseOutlined style={{ color: "#10B981" }} />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black font-mono text-emerald-400">-18.2%</span>
            <span className="text-[10px] text-slate-400">MoM delta</span>
          </div>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* ── SECTION 3: AI Confidence Bars ── */}
          <div
            className="relative z-10 rounded-2xl p-4 border flex flex-col gap-3"
            style={{
              background: "rgba(15, 23, 42, 0.72)",
              borderColor: "rgba(51, 65, 85, 0.8)",
            }}
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300 flex items-center gap-1.5">
                <SafetyCertificateOutlined style={{ color: "#10B981" }} />
                AI Ensemble Confidence
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/50">
                MULTI-MODEL
              </span>
            </div>

            {/* Bar 1: YOLOv8 Detection */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">YOLOv8 Detection</span>
                <span className="font-mono font-bold text-emerald-400">94%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{ width: "94%", boxShadow: "0 0 8px rgba(16,185,129,0.5)" }}
                />
              </div>
            </div>

            {/* Bar 2: Change Detection */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Change Detection</span>
                <span className="font-mono font-bold text-teal-300">91%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700"
                  style={{ width: "91%", boxShadow: "0 0 8px rgba(20,184,166,0.5)" }}
                />
              </div>
            </div>

            {/* Bar 3: Cadastre Match */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Cadastre Match</span>
                <span className="font-mono font-bold text-amber-400">88%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
                  style={{ width: "88%", boxShadow: "0 0 8px rgba(245,158,11,0.5)" }}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 5: AI Recommendation Card (Emerald Callout) ── */}
          <div
            className="relative z-10 rounded-2xl p-4 border transition-all"
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              borderColor: "rgba(16, 185, 129, 0.38)",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <ThunderboltOutlined style={{ color: "#10B981", fontSize: 14 }} />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                AI Recommendation
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Issue immediate Section 4(1) stop-work notice on NH-12 corridor km 18–22.
              Cadastral boundaries indicate unauthorized commercial plot merger encroaching 42m
              into public highway reservation buffer.
            </p>
          </div>
        </>
      ) : (
        /* ── SECTION 4: Infrastructure Projects List ── */
        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400 flex items-center justify-between">
            <span>Critical Infrastructure at Risk</span>
            <span className="text-teal-400">3 Tracked</span>
          </div>

          {/* Project 1: NH-12 Corridor */}
          <div
            className="rounded-2xl p-3 border flex flex-col gap-1.5 transition-all hover:border-red-500/50"
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BranchesOutlined style={{ color: "#EF4444" }} />
                NH-12 Corridor
              </span>
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/70 px-2 py-0.5 rounded-full border border-red-800/60">
                CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Encroachment within 42m of highway reservation line (Barasat stretch).
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>Impact: ₹11.2 Cr</span>
              <span className="text-amber-400">Buffer: 42m violated</span>
            </div>
          </div>

          {/* Project 2: Kolkata Metro Extension */}
          <div
            className="rounded-2xl p-3 border flex flex-col gap-1.5 transition-all hover:border-amber-500/50"
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              borderColor: "rgba(245, 158, 11, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BranchesOutlined style={{ color: "#F59E0B" }} />
                Kolkata Metro Extension
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-800/60">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Airport–New Barrackpore line pillar alignment blocked by 2 sheds.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>Impact: ₹4.8 Cr</span>
              <span className="text-amber-400">Pier #104–#106</span>
            </div>
          </div>

          {/* Project 3: Eastern Freight Corridor */}
          <div
            className="rounded-2xl p-3 border flex flex-col gap-1.5 transition-all hover:border-teal-500/50"
            style={{
              background: "rgba(15, 23, 42, 0.7)",
              borderColor: "rgba(20, 184, 166, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BranchesOutlined style={{ color: "#14B8A6" }} />
                Eastern Freight Corridor
              </span>
              <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-950/70 px-2 py-0.5 rounded-full border border-teal-800/60">
                WATCHLIST
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Boundary fencing breach detected near Dankuni freight interchange.
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
              <span>Impact: ₹2.4 Cr</span>
              <span className="text-teal-300">Spur Track 4B</span>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 6: Last Satellite Pass (Sentinel-2 + Cartosat-3 Chips) ── */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <CalendarOutlined style={{ color: "#10B981" }} />
            LAST SATELLITE PASS
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircleOutlined /> Synced 42m ago
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Sentinel-2 Chip */}
          <div
            className="flex flex-col gap-1 px-3 py-2 rounded-xl border text-xs"
            style={{
              background: "rgba(16, 185, 129, 0.06)",
              borderColor: "rgba(16, 185, 129, 0.28)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-400 text-[11px]">
                Sentinel-2 MSI
              </span>
              <span className="text-[9px] font-mono text-slate-400">10m</span>
            </div>
            <span className="text-[10px] text-slate-300 font-mono">03 Sep 2026 • 10:42 IST</span>
          </div>

          {/* Cartosat-3 Chip */}
          <div
            className="flex flex-col gap-1 px-3 py-2 rounded-xl border text-xs"
            style={{
              background: "rgba(20, 184, 166, 0.06)",
              borderColor: "rgba(20, 184, 166, 0.28)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-teal-300 text-[11px]">
                Cartosat-3 PAN
              </span>
              <span className="text-[9px] font-mono text-slate-400">0.28m</span>
            </div>
            <span className="text-[10px] text-slate-300 font-mono">04 Sep 2026 • 07:15 IST</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
