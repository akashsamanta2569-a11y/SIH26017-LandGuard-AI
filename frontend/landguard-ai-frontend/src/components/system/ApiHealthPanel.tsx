import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  RefreshCw,
  Radio,
  Server,
  Database,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import rawApiHealth from "../../mock/apiHealth.json";
import type { ApiHealthData, LatencyDataPoint, ServiceHealthItem } from "./types";
import HealthGauge from "./HealthGauge";
import ServiceStatusCard from "./ServiceStatusCard";
import TelemetryConsole from "./TelemetryConsole";
import LiveLatencyChart from "./LiveLatencyChart";

const INITIAL_LATENCY_HISTORY: LatencyDataPoint[] = [
  { time: "20:41", sentinel: 124, cartosat: 158, fastapi: 52, mongodb: 36, cadastre: 215, yolo: 88, avgLatency: 112 },
  { time: "20:42", sentinel: 118, cartosat: 152, fastapi: 48, mongodb: 33, cadastre: 208, yolo: 84, avgLatency: 107 },
  { time: "20:43", sentinel: 122, cartosat: 160, fastapi: 55, mongodb: 38, cadastre: 220, yolo: 90, avgLatency: 114 },
  { time: "20:44", sentinel: 128, cartosat: 155, fastapi: 47, mongodb: 34, cadastre: 212, yolo: 82, avgLatency: 109 },
  { time: "20:45", sentinel: 119, cartosat: 151, fastapi: 50, mongodb: 35, cadastre: 205, yolo: 85, avgLatency: 107 },
  { time: "20:46", sentinel: 121, cartosat: 156, fastapi: 49, mongodb: 34, cadastre: 214, yolo: 83, avgLatency: 109 },
  { time: "20:47", sentinel: 120, cartosat: 154, fastapi: 49, mongodb: 34, cadastre: 210, yolo: 83, avgLatency: 108 },
];

const MARQUEE_ITEMS = [
  { label: "Satellite Feed LIVE", icon: Radio, color: "text-[#00F5C3]" },
  { label: "MongoDB Connected", icon: Database, color: "text-emerald-400" },
  { label: "FastAPI Healthy", icon: Server, color: "text-[#00E5FF]" },
  { label: "Model Accuracy 96.4%", icon: Cpu, color: "text-purple-400" },
  { label: "DLR Sync Running", icon: Layers, color: "text-amber-400" },
];

export default function ApiHealthPanel() {
  const [healthData, setHealthData] = useState<ApiHealthData>(
    rawApiHealth as ApiHealthData
  );
  const [latencyData, setLatencyData] = useState<LatencyDataPoint[]>(
    INITIAL_LATENCY_HISTORY
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Feature 6: Auto Refresh every 5 seconds (randomly update latency & timestamps)
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData((prev) => {
        const updatedServices: ServiceHealthItem[] = prev.services.map((svc) => {
          // slight realistic jitter ±2 to ±6 ms
          const jitter = Math.floor(Math.random() * 9) - 4;
          const newLatency = Math.max(15, svc.latency + jitter);
          return {
            ...svc,
            latency: newLatency,
          };
        });

        const avg = Math.round(
          updatedServices.reduce((sum, s) => sum + s.latency, 0) /
            updatedServices.length
        );

        // Update latency data array
        const now = new Date();
        const timeMinutes = now.toTimeString().slice(0, 5);

        setLatencyData((prevHistory) => {
          const sentinel = updatedServices.find((s) => s.id === "sentinel")?.latency || 120;
          const cartosat = updatedServices.find((s) => s.id === "cartosat")?.latency || 154;
          const fastapi = updatedServices.find((s) => s.id === "fastapi")?.latency || 49;
          const mongodb = updatedServices.find((s) => s.id === "mongodb")?.latency || 34;
          const cadastre = updatedServices.find((s) => s.id === "cadastre")?.latency || 210;
          const yolo = updatedServices.find((s) => s.id === "yolo")?.latency || 83;

          const newPoint: LatencyDataPoint = {
            time: timeMinutes,
            sentinel,
            cartosat,
            fastapi,
            mongodb,
            cadastre,
            yolo,
            avgLatency: avg,
          };

          return [...prevHistory.slice(1), newPoint];
        });

        const timeStr = `${now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })} ${now.toTimeString().slice(0, 8)} IST`;

        return {
          ...prev,
          updated: timeStr,
          services: updatedServices,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#00F5C3]/25 bg-[#050C18]/95 p-5 md:p-7 backdrop-blur-xl shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Background cyber radial glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#00F5C3]/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#00E5FF]/8 blur-3xl" />

      {/* 1. TOP HEADER & TELEMETRY CONTROLS */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/90 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5C3] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00F5C3]" />
            </span>
            <span className="text-xs font-bold text-[#00F5C3] tracking-widest uppercase">
              ISRO &bull; PM GatiShakti Mission Control
            </span>
            <span className="rounded border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2 py-0.5 text-[10px] text-[#00E5FF]">
              SYSTEM HEALTH CENTER
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-[#00F5C3]" />
            <span>Real-Time Government Microservice Health &amp; Telemetry</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans max-w-2xl">
            Live telemetry health probes monitoring satellite ingest conduits, YOLOv8 inference nodes, PostGIS cadastre alignment, and database availability.
          </p>
        </div>

        {/* Sync Status & Refresh Button */}
        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] text-slate-400">
            <div>
              LAST SYNC:{" "}
              <span className="text-[#00F5C3] font-bold">
                {healthData.updated}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">POLLING CADENCE: 5s HEARTBEAT</div>
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-[#00F5C3]/40 bg-[#00F5C3]/10 px-3 py-2 text-xs font-bold text-[#00F5C3] backdrop-blur-md transition hover:bg-[#00F5C3]/20 hover:border-[#00F5C3] shadow-[0_0_12px_rgba(0,245,195,0.2)]"
            title="Force immediate ping refresh"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>PING</span>
          </button>
        </div>
      </div>

      {/* 2. FEATURE 5: LIVE ACTIVITY STRIP (ANIMATED MARQUEE) */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#081326]/80 py-2.5 px-3 backdrop-blur-md shadow-inner">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0 rounded bg-[#00F5C3]/15 border border-[#00F5C3]/30 px-2 py-0.5 text-[10px] font-bold text-[#00F5C3]">
            <Sparkles className="h-3 w-3" />
            <span>LIVE STRIP:</span>
          </div>

          {/* Marquee ticker container */}
          <div className="relative overflow-hidden w-full">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex items-center gap-8 whitespace-nowrap text-xs"
            >
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                    <span className="text-slate-300 font-semibold">{item.label}</span>
                    <span className="text-slate-600 font-bold">&bull;</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. FEATURE 1 & 4: OVERALL HEALTH GAUGE + LIVE LATENCY CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Overall Health Gauge (Feature 1) */}
        <div className="lg:col-span-4 flex flex-col">
          <HealthGauge
            score={healthData.overallHealth}
            label="OVERALL AI SYSTEM HEALTH"
            statusText="Mission Ready"
          />
        </div>

        {/* Right: Live Latency Chart (Feature 4, Full width responsive) */}
        <div className="lg:col-span-8 flex flex-col">
          <LiveLatencyChart data={latencyData} />
        </div>
      </div>

      {/* 4. FEATURE 2 & 7: SERVICE STATUS GRID (DESKTOP: 3 COLS, TABLET: 2 COLS, MOBILE: 1 COL) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Core Microservice Cluster Nodes (6 / 6 Operational)
          </span>
          <span className="text-[10px] text-[#00F5C3]">100% REGIONAL QUORUM</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {healthData.services.map((service) => (
            <ServiceStatusCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* 5. FEATURE 3 & 7: TELEMETRY CONSOLE (SCROLLING TERMINAL BELOW) */}
      <div className="w-full">
        <TelemetryConsole />
      </div>
    </section>
  );
}
