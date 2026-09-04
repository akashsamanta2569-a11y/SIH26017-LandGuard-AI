import { useState, useEffect } from "react";
import {
  EnvironmentOutlined,
  RadarChartOutlined,
  GlobalOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

// ─── Live Clock Hook ─────────────────────────────────────────────────────────

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatIST(d: Date): string {
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  const date = d
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    })
    .toUpperCase();
  return `${time} IST • ${date}`;
}

// ─── Floating Particle Props ──────────────────────────────────────────────────

interface FloatParticle {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  duration: number;
}

const PARTICLES: FloatParticle[] = [
  { x: 58, y: 24, size: 4, delay: 0, color: "rgba(16,185,129,0.7)", duration: 5.2 },
  { x: 74, y: 52, size: 3.5, delay: 1.2, color: "rgba(20,184,166,0.65)", duration: 6.0 },
  { x: 84, y: 28, size: 5, delay: 0.5, color: "rgba(16,185,129,0.5)", duration: 4.8 },
  { x: 92, y: 68, size: 3, delay: 2.1, color: "rgba(20,184,166,0.6)", duration: 5.5 },
  { x: 66, y: 78, size: 4.5, delay: 1.5, color: "rgba(16,185,129,0.45)", duration: 6.5 },
  { x: 88, y: 82, size: 3.5, delay: 0.8, color: "rgba(16,185,129,0.6)", duration: 5.0 },
];

export default function GISHero() {
  const now = useLiveClock();
  const [activeLayers, setActiveLayers] = useState<{ [key: string]: boolean }>({
    sentinel: true,
    cartosat: true,
    cadastre: true,
  });
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const toggleLayer = (layerKey: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleExport = () => {
    setExportNotice("Exporting high-resolution GeoTIFF tile mosaic (23 districts)...");
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div
      className="relative min-h-[310px] lg:h-[320px] rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden select-none"
      style={{
        background: "rgba(17, 24, 39, 0.82)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(51, 65, 85, 0.8)", // border-slate-800
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.05), 0 20px 48px -12px rgba(0,0,0,0.65), 0 0 70px rgba(16,185,129,0.06)",
        animation: "gisHeroFade 0.6s ease-out both",
      }}
    >
      {/* ── Scoped Animation Keyframes ── */}
      <style>{`
        @keyframes gisHeroFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gisPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          70% {
            transform: scale(2.2);
            opacity: 0;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        @keyframes gisFloat {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.85;
          }
        }
      `}</style>

      {/* ── Reused Global Grid Overlay ── */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      {/* ── Emerald Radial Glow Accent ── */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0.1) 45%, transparent 70%)",
        }}
      />

      {/* ── Subtle Teal Glow Accent ── */}
      <div
        className="pointer-events-none absolute -bottom-20 right-1/4 w-[380px] h-[380px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)",
        }}
      />

      {/* ── Two Translucent GIS Orbital Circles on Right ── */}
      <div
        className="pointer-events-none absolute right-[4%] top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-emerald-500/15"
        style={{
          borderStyle: "dashed",
          boxShadow: "0 0 40px rgba(16,185,129,0.04)",
        }}
      />
      <div
        className="pointer-events-none absolute right-[0%] top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-teal-500/10"
      />

      {/* ── 6 Floating Telemetry Particles ── */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `gisFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ── TOP TELEMETRY ROW ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        {/* Left Badge: WEST BENGAL GEOINT COMMAND • LIVE */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase select-none"
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#10B981",
              boxShadow: "0 0 16px rgba(16, 185, 129, 0.15)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                style={{ animation: "gisPulse 2s cubic-bezier(0,0,0.2,1) infinite" }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>WEST BENGAL GEOINT COMMAND • LIVE</span>
          </div>
        </div>

        {/* Right Live Clock with Pulsing LIVE Dot */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 self-start sm:self-auto bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          <ClockCircleOutlined style={{ color: "#14B8A6", fontSize: 13 }} />
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: "gisPulse 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold text-slate-200 tracking-wider">
            {formatIST(now)}
          </span>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA (Left 65% / Right 35%) ── */}
      <div className="relative z-10 py-3 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* ── LEFT SIDE (65% / 8 Cols Desktop) ── */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          {/* Title with Emerald Shimmer */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Interactive GIS{" "}
            <span className="shimmer-text">Heatmap</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            AI-powered satellite anomaly visualization across all West Bengal districts
            using Sentinel-2, Cartosat-3 and cadastral intelligence.
          </p>

          {/* 3 KPI Pills */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            {/* Pill 1: 23 District Layers Active */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs select-none border transition-all"
              style={{
                background: "rgba(16, 185, 129, 0.08)",
                borderColor: "rgba(16, 185, 129, 0.28)",
                boxShadow: "0 0 12px rgba(16, 185, 129, 0.1)",
              }}
            >
              <EnvironmentOutlined style={{ color: "#10B981", fontSize: 13 }} />
              <span className="font-mono font-bold text-emerald-400">23</span>
              <span className="text-slate-300 font-medium">District Layers Active</span>
            </div>

            {/* Pill 2: 142 Satellite Tiles Synced */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs select-none border transition-all"
              style={{
                background: "rgba(20, 184, 166, 0.08)",
                borderColor: "rgba(20, 184, 166, 0.28)",
                boxShadow: "0 0 12px rgba(20, 184, 166, 0.1)",
              }}
            >
              <CloudServerOutlined style={{ color: "#14B8A6", fontSize: 13 }} />
              <span className="font-mono font-bold text-teal-300">142</span>
              <span className="text-slate-300 font-medium">Satellite Tiles Synced</span>
            </div>

            {/* Pill 3: 38 Live Encroachment Alerts */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs select-none border transition-all"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                borderColor: "rgba(239, 68, 68, 0.28)",
                boxShadow: "0 0 14px rgba(239, 68, 68, 0.12)",
              }}
            >
              <RadarChartOutlined style={{ color: "#EF4444", fontSize: 13 }} />
              <span className="font-mono font-bold text-red-400">38</span>
              <span className="text-slate-300 font-medium">Live Encroachment Alerts</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE (35% / 4 Cols Desktop): Floating Glass Command Panel ── */}
        <div className="lg:col-span-4 w-full">
          <div
            className="rounded-2xl p-4 flex flex-col gap-2.5 border"
            style={{
              background: "rgba(15, 23, 42, 0.72)",
              borderColor: "rgba(148, 163, 184, 0.12)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Command Panel Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
              <span className="text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
                <DatabaseOutlined style={{ color: "#10B981" }} />
                Spatial Layers
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                ACTIVE
              </span>
            </div>

            {/* 4 Command Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {/* Button 1: Sentinel-2 MSI */}
              <button
                type="button"
                onClick={() => toggleLayer("sentinel")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                  activeLayers.sentinel
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.18)]"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <GlobalOutlined style={{ color: "#10B981" }} />
                  <span className="truncate">Sentinel-2 MSI</span>
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeLayers.sentinel ? "bg-emerald-400 shadow-[0_0_6px_#10B981]" : "bg-slate-600"
                  }`}
                />
              </button>

              {/* Button 2: Cartosat-3 PAN */}
              <button
                type="button"
                onClick={() => toggleLayer("cartosat")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                  activeLayers.cartosat
                    ? "bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.18)]"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <RadarChartOutlined style={{ color: "#14B8A6" }} />
                  <span className="truncate">Cartosat-3 PAN</span>
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeLayers.cartosat ? "bg-teal-400 shadow-[0_0_6px_#14B8A6]" : "bg-slate-600"
                  }`}
                />
              </button>

              {/* Button 3: DL&LRO Cadastre */}
              <button
                type="button"
                onClick={() => toggleLayer("cadastre")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border transition-all cursor-pointer ${
                  activeLayers.cadastre
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.18)]"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <DatabaseOutlined style={{ color: "#10B981" }} />
                  <span className="truncate">DL&LRO Cadastre</span>
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeLayers.cadastre ? "bg-emerald-400 shadow-[0_0_6px_#10B981]" : "bg-slate-600"
                  }`}
                />
              </button>

              {/* Button 4: Export GeoTIFF */}
              <button
                type="button"
                onClick={handleExport}
                className="py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border transition-all cursor-pointer bg-slate-900/60 text-slate-200 border-slate-800 hover:border-emerald-500/40 hover:text-white hover:shadow-[0_0_14px_rgba(16,185,129,0.15)] group"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <DownloadOutlined
                    style={{ color: "#10B981" }}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="truncate">Export GeoTIFF</span>
                </span>
                <span className="text-[9.5px] font-mono text-emerald-400/80">32-BIT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast Notification Banner ── */}
      {exportNotice && (
        <div className="relative z-10 mt-2 px-4 py-2 rounded-xl bg-slate-900/95 border border-emerald-500/35 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-bounce">
          <DownloadOutlined style={{ color: "#10B981" }} />
          <span>{exportNotice}</span>
        </div>
      )}
    </div>
  );
}
