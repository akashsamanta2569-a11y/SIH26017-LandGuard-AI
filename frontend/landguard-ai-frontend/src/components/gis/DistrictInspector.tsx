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
  ArrowUpOutlined,
} from "@ant-design/icons";

interface DistrictInspectorProps {
  districtName?: string;
  onClose?: () => void;
  theme?: "dark" | "light";
}

export default function DistrictInspector({
  districtName = "North 24 Parganas",
  theme = "light",
}: DistrictInspectorProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "infra">("overview");
  const isDark = theme === "dark";

  return (
    <aside
      className="relative w-full rounded-2xl p-5 sm:p-6 flex flex-col gap-4 border transition-all duration-200"
      style={{
        backgroundColor: isDark ? "#111C2E" : "#FFFFFF",
        borderColor: isDark ? "#1E293B" : "#E2E8F0",
        boxShadow: isDark
          ? "0 4px 6px -1px rgba(0,0,0,0.3)"
          : "0 1px 3px 0 rgba(0,0,0,0.05)",
      }}
    >
      {/* ── SECTION 1: District Header ── */}
      <div
        className="flex items-start justify-between gap-3 pb-4 border-b"
        style={{ borderColor: isDark ? "#1E293B" : "#F1F5F9" }}
      >
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            <EnvironmentOutlined />
            <span>District Intelligence</span>
          </div>
          <h2
            className="text-lg sm:text-xl font-bold tracking-tight mt-1"
            style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
          >
            {districtName}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            {/* Risk Level Badge */}
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800">
              Critical Risk
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
              ZONE WB-NORTH
            </span>
          </div>
        </div>

        {/* AI Score Badge */}
        <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 text-center select-none shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Delay Risk
          </span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-black tracking-tight">92</span>
            <span className="text-[10px] font-semibold opacity-75">/100</span>
          </div>
        </div>
      </div>

      {/* ── Sub-navigation Tab Selector ── */}
      <div
        className="flex items-center gap-1.5 p-1 rounded-xl border text-xs"
        style={{
          backgroundColor: isDark ? "#0A0F1D" : "#F8FAFC",
          borderColor: isDark ? "#1E293B" : "#E2E8F0",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === "overview"
              ? "bg-white text-teal-800 dark:bg-slate-800 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Overview & AI
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("infra")}
          className={`flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all cursor-pointer text-center ${
            activeTab === "infra"
              ? "bg-white text-teal-800 dark:bg-slate-800 dark:text-teal-300 shadow-sm border border-slate-200/60 dark:border-slate-700"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Infrastructure (3)
        </button>
      </div>

      {/* ── SECTION 2: 4 Key Metrics Grid ── */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Active Alerts */}
        <div
          className="rounded-xl p-3 border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-medium">Active Alerts</span>
            <AlertOutlined className="text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              14
            </span>
            <span className="text-[10px] font-semibold text-red-600 flex items-center">
              <ArrowUpOutlined style={{ fontSize: 9 }} /> +3 today
            </span>
          </div>
        </div>

        {/* Metric 2: Budget Exposure */}
        <div
          className="rounded-xl p-3 border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-medium">Compensation Exposure</span>
            <BankOutlined className="text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              className="text-lg font-bold tracking-tight text-amber-700 dark:text-amber-400"
            >
              ₹18.4
            </span>
            <span className="text-xs text-slate-500 font-medium">Cr</span>
          </div>
        </div>

        {/* Metric 3: Projects Impacted */}
        <div
          className="rounded-xl p-3 border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-medium">Projects Impacted</span>
            <ApartmentOutlined className="text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              5
            </span>
            <span className="text-[10px] text-slate-500">Corridors</span>
          </div>
        </div>

        {/* Metric 4: NDVI Loss */}
        <div
          className="rounded-xl p-3 border flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span className="font-medium">NDVI Canopy Delta</span>
            <RiseOutlined className="text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
              -18.2%
            </span>
            <span className="text-[10px] text-slate-500">MoM</span>
          </div>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* ── SECTION 3: AI Ensemble Confidence Bars ── */}
          <div
            className="rounded-xl p-3.5 border flex flex-col gap-2.5"
            style={{
              backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
              borderColor: isDark ? "#1E293B" : "#E2E8F0",
            }}
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <SafetyCertificateOutlined className="text-teal-600" />
                AI Ensemble Verification
              </span>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                Multi-Model
              </span>
            </div>

            {/* Bar 1: YOLOv8 Detection */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  YOLOv8 Structure Detection
                </span>
                <span className="font-bold text-teal-700 dark:text-teal-400">94%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-500"
                  style={{ width: "94%" }}
                />
              </div>
            </div>

            {/* Bar 2: Change Detection */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Bi-Temporal Change Analysis
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">91%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: "91%" }}
                />
              </div>
            </div>

            {/* Bar 3: Cadastre Match */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Cadastral Plot Alignment
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">88%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: "88%" }}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 4: AI Recommendation Card ── */}
          <div className="rounded-xl p-3.5 border bg-teal-50/70 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/80">
            <div className="flex items-center gap-2 mb-1">
              <ThunderboltOutlined className="text-teal-700 dark:text-teal-400 text-xs" />
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                Statutory Recommendation
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              Issue immediate Section 4(1) stop-work notice on NH-12 corridor km 18–22.
              Cadastral boundaries indicate unauthorized commercial plot merger encroaching 42m
              into public highway reservation buffer.
            </p>
          </div>
        </>
      ) : (
        /* ── SECTION 5: Infrastructure Projects List ── */
        <div className="flex flex-col gap-2.5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Critical Infrastructure at Risk</span>
            <span className="text-teal-700 dark:text-teal-400 font-bold">3 Tracked</span>
          </div>

          {/* Project 1: NH-12 Corridor */}
          <div
            className="rounded-xl p-3 border flex flex-col gap-1.5"
            style={{
              backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
              borderColor: isDark ? "#1E293B" : "#E2E8F0",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold flex items-center gap-1.5"
                style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
              >
                <BranchesOutlined className="text-red-600" />
                NH-12 Highway Corridor
              </span>
              <span className="text-[10px] font-semibold text-red-700 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Encroachment within 42m of highway reservation line (Barasat stretch).
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Exposure: ₹11.2 Cr</span>
              <span className="text-red-600 font-semibold">42m buffer violated</span>
            </div>
          </div>

          {/* Project 2: Kolkata Metro Extension */}
          <div
            className="rounded-xl p-3 border flex flex-col gap-1.5"
            style={{
              backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
              borderColor: isDark ? "#1E293B" : "#E2E8F0",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold flex items-center gap-1.5"
                style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
              >
                <BranchesOutlined className="text-amber-600" />
                Kolkata Metro Extension
              </span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Airport–New Barrackpore line pillar alignment blocked by 2 sheds.
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Exposure: ₹4.8 Cr</span>
              <span className="text-amber-600 font-semibold">Pier #104–#106</span>
            </div>
          </div>

          {/* Project 3: Eastern Freight Corridor */}
          <div
            className="rounded-xl p-3 border flex flex-col gap-1.5"
            style={{
              backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
              borderColor: isDark ? "#1E293B" : "#E2E8F0",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold flex items-center gap-1.5"
                style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
              >
                <BranchesOutlined className="text-teal-600" />
                Eastern Dedicated Freight Corridor
              </span>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                MONITORING
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Boundary fencing breach detected near Dankuni freight interchange.
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Exposure: ₹2.4 Cr</span>
              <span className="text-teal-700 dark:text-teal-400 font-semibold">Spur Track 4B</span>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 6: Satellite Sync Info ── */}
      <div
        className="pt-3 border-t flex flex-col gap-2"
        style={{ borderColor: isDark ? "#1E293B" : "#F1F5F9" }}
      >
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarOutlined className="text-teal-600" />
            LATEST SATELLITE PASS
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircleOutlined /> Synced 42m ago
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Sentinel-2 Chip */}
          <div className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between font-semibold text-teal-700 dark:text-teal-400 text-[11px]">
              <span>Sentinel-2 MSI</span>
              <span className="text-[10px] font-normal text-slate-400">10m</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              03 Sep 2026 · 10:42 IST
            </span>
          </div>

          {/* Cartosat-3 Chip */}
          <div className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between font-semibold text-blue-700 dark:text-blue-400 text-[11px]">
              <span>Cartosat-3 PAN</span>
              <span className="text-[10px] font-normal text-slate-400">0.28m</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              04 Sep 2026 · 07:15 IST
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}