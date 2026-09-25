import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Satellite,
  Brain,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
  Clock,
  AlertTriangle,
  Layers,
  Database,
  Activity,
} from "lucide-react";

// ─── Live Clock ───────────────────────────────────────────────────────────────

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatIST(d: Date): string {
  return d.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveDot({ color = "#10B981" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{
          background: color,
          animation: "gisHeroPing 1.8s cubic-bezier(0,0,0.2,1) infinite",
        }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ background: color }}
      />
    </span>
  );
}

function StatusChip({
  icon: Icon,
  label,
  value,
  color = "#10B981",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs select-none"
      style={{
        background: `${color}10`,
        borderColor: `${color}30`,
        boxShadow: `0 0 12px ${color}12`,
      }}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
      <div>
        <p
          className="text-[9px] font-mono font-semibold uppercase tracking-wider leading-none"
          style={{ color: `${color}cc` }}
        >
          {label}
        </p>
        <p className="font-semibold leading-none mt-0.5" style={{ color }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── District Selector ────────────────────────────────────────────────────────

const WB_DISTRICTS = [
  "All 23 Districts",
  "North 24 Parganas",
  "South 24 Parganas",
  "Kolkata",
  "Howrah",
  "Hooghly",
  "Nadia",
  "Murshidabad",
  "Paschim Bardhaman",
  "Purba Bardhaman",
  "Birbhum",
  "Purulia",
  "Bankura",
  "Paschim Medinipur",
  "Purba Medinipur",
  "Jhargram",
  "Malda",
  "Uttar Dinajpur",
  "Dakshin Dinajpur",
  "Cooch Behar",
  "Jalpaiguri",
  "Alipurduar",
  "Darjeeling",
  "Kalimpong",
];

// ─── Main Component ───────────────────────────────────────────────────────────

interface GISHeroNewProps {
  theme?: "dark" | "light";
  onThemeToggle?: () => void;
  selectedDistrict: string;
  onDistrictChange: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function GISHeroNew({
  theme = "dark",
  onThemeToggle,
  selectedDistrict,
  onDistrictChange,
  searchQuery,
  onSearchChange,
}: GISHeroNewProps) {
  const now = useLiveClock();
  const [districtOpen, setDistrictOpen] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    sentinel: true,
    cartosat: true,
    cadastre: true,
    rfctlarr: false,
    landAcq: true,
  });

  const toggleLayer = (key: keyof typeof activeLayers) =>
    setActiveLayers((p) => ({ ...p, [key]: !p[key] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative rounded-2xl border overflow-hidden"
      style={{
        background:
          theme === "dark"
            ? "rgba(13,21,32,0.96)"
            : "rgba(255,255,255,0.97)",
        borderColor:
          theme === "dark"
            ? "rgba(16,185,129,0.2)"
            : "rgba(16,185,129,0.25)",
        boxShadow:
          theme === "dark"
            ? "0 4px 40px rgba(0,0,0,0.5), 0 0 60px rgba(16,185,129,0.06)"
            : "0 4px 32px rgba(0,0,0,0.08)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Scoped keyframes */}
      <style>{`
        @keyframes gisHeroPing {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes gisHeroGridShift {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
      `}</style>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)"
              : "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gisHeroGridShift 12s linear infinite",
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-12 left-1/4 w-64 h-64 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 p-5 md:p-6 space-y-4">
        {/* ── TOP ROW: Org badge + clock + theme toggle ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Org badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.35)",
                color: "#10B981",
              }}
            >
              <LiveDot color="#10B981" />
              WEST BENGAL SPATIAL COMMAND
            </div>
            <span
              className="text-[10px] font-mono px-2.5 py-1 rounded-full"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(30,41,59,0.9)"
                    : "rgba(241,245,249,0.9)",
                border: `1px solid ${theme === "dark" ? "rgba(51,65,85,0.8)" : "rgba(203,213,225,0.8)"}`,
                color: theme === "dark" ? "#94a3b8" : "#475569",
              }}
            >
              🛰️ SIH26017 • Ministry of Rural Development • National Geospatial Grid Connected
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live clock */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-mono"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(6,182,212,0.08)"
                    : "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.3)",
                color: "#06B6D4",
              }}
            >
              <Clock className="w-3 h-3" />
              <span className="font-semibold">{formatIST(now)} IST</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-xl border transition-all duration-200 hover:scale-105"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(30,41,59,0.8)"
                    : "rgba(241,245,249,0.9)",
                borderColor:
                  theme === "dark"
                    ? "rgba(51,65,85,0.8)"
                    : "rgba(203,213,225,0.8)",
                color: theme === "dark" ? "#94a3b8" : "#475569",
              }}
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ── MAIN TITLE ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-1.5">
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
              style={{
                color: theme === "dark" ? "#f1f5f9" : "#0f172a",
              }}
            >
              Interactive GIS{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #10b981, #06b6d4, #10b981)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                Heatmap
              </span>
            </h1>
            <p
              className="text-sm max-w-2xl leading-relaxed"
              style={{ color: theme === "dark" ? "#94a3b8" : "#64748b" }}
            >
              AI-powered geospatial decision support for predicting land acquisition delays.
              Sentinel-2 MSI · Cartosat-3 · DLR/LRO Cadastre · RFCTLARR 2013 Lifecycle Tracking
            </p>
          </div>

          {/* Search Input & District Selector */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: theme === "dark" ? "#64748b" : "#94a3b8" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Project / Plot / District..."
                className="pl-9 pr-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all w-56 sm:w-64"
                style={{
                  background:
                    theme === "dark"
                      ? "rgba(30,41,59,0.8)"
                      : "rgba(241,245,249,0.9)",
                  borderColor:
                    theme === "dark"
                      ? "rgba(51,65,85,0.8)"
                      : "rgba(203,213,225,0.8)",
                  color: theme === "dark" ? "#f1f5f9" : "#0f172a",
                }}
              />
            </div>

            {/* District Selector */}
            <div className="relative shrink-0">
            <button
              onClick={() => setDistrictOpen((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.35)",
                color: "#10B981",
              }}
            >
              <MapPin className="w-4 h-4" />
              {selectedDistrict}
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: districtOpen ? "rotate(180deg)" : "none" }}
              />
            </button>

            <AnimatePresence>
              {districtOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full mt-1.5 right-0 w-56 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
                  style={{
                    background:
                      theme === "dark" ? "#0d1520" : "#ffffff",
                    border: "1px solid rgba(16,185,129,0.3)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  {WB_DISTRICTS.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        onDistrictChange(d);
                        setDistrictOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs transition-all duration-150"
                      style={{
                        color:
                          selectedDistrict === d
                            ? "#10B981"
                            : theme === "dark"
                              ? "#cbd5e1"
                              : "#334155",
                        background:
                          selectedDistrict === d
                            ? "rgba(16,185,129,0.12)"
                            : "transparent",
                        fontWeight: selectedDistrict === d ? 700 : 400,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(16,185,129,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          selectedDistrict === d
                            ? "rgba(16,185,129,0.12)"
                            : "transparent";
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </div>

        {/* ── STATUS CHIP ROW ── */}
        <div className="flex flex-wrap gap-2">
          <StatusChip
            icon={Globe}
            label="Layers Active"
            value="23 Districts"
            color="#10B981"
          />
          <StatusChip
            icon={Satellite}
            label="Satellite Feed"
            value="142 Tiles Synced"
            color="#06B6D4"
          />
          <StatusChip
            icon={Brain}
            label="AI Model"
            value="YOLOv8 Online"
            color="#8B5CF6"
          />
          <StatusChip
            icon={AlertTriangle}
            label="Live Alerts"
            value="38 Incidents"
            color="#EF4444"
          />
          <StatusChip
            icon={Activity}
            label="NDVI Status"
            value="-18.2% MoM"
            color="#F59E0B"
          />
          <StatusChip
            icon={Database}
            label="Cadastre"
            value="DLR/LRO Synced"
            color="#14B8A6"
          />
        </div>

        {/* ── LAYER TOGGLE BAR ── */}
        <div
          className="flex flex-wrap items-center gap-2 pt-3 border-t"
          style={{
            borderColor:
              theme === "dark"
                ? "rgba(51,65,85,0.7)"
                : "rgba(203,213,225,0.7)",
          }}
        >
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-widest shrink-0"
            style={{ color: theme === "dark" ? "#64748b" : "#94a3b8" }}
          >
            <Layers className="w-3 h-3 inline mr-1" />
            Quick Layers:
          </span>

          {[
            {
              key: "sentinel" as const,
              label: "Sentinel-2 MSI",
              color: "#10B981",
            },
            {
              key: "cartosat" as const,
              label: "Cartosat-3",
              color: "#06B6D4",
            },
            {
              key: "cadastre" as const,
              label: "DLR/LRO Cadastre",
              color: "#14B8A6",
            },
            {
              key: "rfctlarr" as const,
              label: "RFCTLARR Zones",
              color: "#8B5CF6",
            },
            {
              key: "landAcq" as const,
              label: "Land Acq. Projects",
              color: "#F59E0B",
            },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold font-mono tracking-wider border transition-all duration-200"
              style={{
                background: activeLayers[key]
                  ? `${color}14`
                  : theme === "dark"
                    ? "rgba(30,41,59,0.6)"
                    : "rgba(241,245,249,0.8)",
                borderColor: activeLayers[key]
                  ? `${color}45`
                  : theme === "dark"
                    ? "rgba(51,65,85,0.7)"
                    : "rgba(203,213,225,0.7)",
                color: activeLayers[key]
                  ? color
                  : theme === "dark"
                    ? "#64748b"
                    : "#94a3b8",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: activeLayers[key] ? color : "#64748b",
                  boxShadow: activeLayers[key] ? `0 0 6px ${color}` : "none",
                }}
              />
              {label}
            </button>
          ))}

          {/* System online badge */}
          <div className="ml-auto flex items-center gap-1.5">
            <LiveDot color="#10B981" />
            <span
              className="text-[10px] font-mono font-bold"
              style={{ color: "#10B981" }}
            >
              SYSTEM ONLINE · CRS: EPSG:4326
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
