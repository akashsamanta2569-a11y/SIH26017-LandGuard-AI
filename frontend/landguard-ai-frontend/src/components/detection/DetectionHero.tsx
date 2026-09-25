import { useEffect, useState } from "react";
import {
  Satellite,
  Brain,
  Shield,
  Clock,
  Radio,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatIST(d: Date) {
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

function LiveDot({ color = "#10B981" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: color, animation: "detectHeroPing 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
      />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: color }} />
    </span>
  );
}

const WB_DISTRICTS = [
  "All Districts", "North 24 Parganas", "South 24 Parganas", "Kolkata",
  "Howrah", "Hooghly", "Nadia", "Murshidabad", "Paschim Bardhaman",
  "Purba Bardhaman", "Birbhum", "Purulia", "Bankura", "Paschim Medinipur",
  "Purba Medinipur", "Jhargram", "Malda", "Darjeeling", "Jalpaiguri",
  "Cooch Behar", "Alipurduar", "Kalimpong", "Uttar Dinajpur", "Dakshin Dinajpur",
];

export interface DetectionHeroProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  district: string;
  onDistrictChange: (d: string) => void;
  completed: boolean;
  isScanning: boolean;
}

export default function DetectionHero({
  theme, onThemeToggle, district, onDistrictChange, completed, isScanning,
}: DetectionHeroProps) {
  const now = useLiveClock();
  const [distOpen, setDistOpen] = useState(false);

  const isDark = theme === "dark";
  const cardBg = isDark ? "rgba(10,18,28,0.97)" : "rgba(255,255,255,0.97)";
  const border = isDark ? "rgba(16,185,129,0.22)" : "rgba(16,185,129,0.25)";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: cardBg, border: `1px solid ${border}`, boxShadow: isDark ? "0 4px 40px rgba(0,0,0,0.5)" : "0 4px 24px rgba(0,0,0,0.07)", backdropFilter: "blur(24px)" }}
    >
      <style>{`
        @keyframes detectHeroPing { 75%, 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes detectHeroGrid { from { background-position: 0 0; } to { background-position: 40px 40px; } }
        @keyframes detectHeroShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{ backgroundImage: isDark ? "linear-gradient(rgba(16,185,129,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.07) 1px,transparent 1px)" : "linear-gradient(rgba(16,185,129,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.06) 1px,transparent 1px)", backgroundSize: "40px 40px", animation: "detectHeroGrid 14s linear infinite" }}
      />
      <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.45) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 p-5 md:p-6 space-y-4">
        {/* Row 1: Org badge + Clock + Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.35)", color: "#10B981" }}>
              <LiveDot color="#10B981" />
              WEST BENGAL SPATIAL COMMAND
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full"
              style={{ background: isDark ? "rgba(30,41,59,0.9)" : "rgba(241,245,249,0.9)", border: `1px solid ${isDark ? "rgba(51,65,85,0.8)" : "rgba(203,213,225,0.8)"}`, color: textMuted }}>
              🛰️ AI Satellite Intelligence · SIH26017 · MoRD GoI
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono"
              style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.3)", color: "#06B6D4" }}>
              <Clock className="w-3 h-3" />
              <span className="font-semibold">{formatIST(now)} IST</span>
            </div>
            <button onClick={onThemeToggle} className="p-2 rounded-xl border transition-all duration-200 hover:scale-105"
              style={{ background: isDark ? "rgba(30,41,59,0.8)" : "rgba(241,245,249,0.9)", borderColor: isDark ? "rgba(51,65,85,0.8)" : "rgba(203,213,225,0.8)", color: isDark ? "#94a3b8" : "#475569" }}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Row 2: Title + District selector */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight" style={{ color: textPrimary }}>
              Satellite Intelligence{" "}
              <span style={{ background: "linear-gradient(90deg,#10b981,#06b6d4,#8b5cf6,#10b981)", backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "detectHeroShimmer 5s linear infinite" }}>
                Investigation Workstation
              </span>
            </h1>
            <p className="text-sm max-w-2xl" style={{ color: textMuted }}>
              YOLOv8 · NDVI Analysis · Cadastral Boundary Verification · RFCTLARR 2013 Intelligence Engine
            </p>
          </div>
          <div className="relative shrink-0">
            <button onClick={() => setDistOpen(v => !v)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.35)", color: "#10B981" }}>
              <MapPin className="w-4 h-4" />
              {district}
              <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" style={{ transform: distOpen ? "rotate(180deg)" : "none" }} />
            </button>
            {distOpen && (
              <div className="absolute top-full mt-1.5 right-0 w-56 rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
                style={{ background: isDark ? "#0d1520" : "#ffffff", border: "1px solid rgba(16,185,129,0.3)", boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}>
                {WB_DISTRICTS.map(d => (
                  <button key={d} onClick={() => { onDistrictChange(d); setDistOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs transition-all"
                    style={{ color: district === d ? "#10B981" : isDark ? "#cbd5e1" : "#334155", background: district === d ? "rgba(16,185,129,0.12)" : "transparent", fontWeight: district === d ? 700 : 400 }}>
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Status grid */}
        <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: isDark ? "rgba(51,65,85,0.7)" : "rgba(203,213,225,0.7)" }}>
          {[
            { icon: Satellite, label: "Sentinel-2 MSI", value: "Connected · 10m", color: "#10B981" },
            { icon: Satellite, label: "Cartosat-3 PAN", value: "Connected · 0.28m", color: "#06B6D4" },
            { icon: Brain, label: "YOLOv8 Model", value: isScanning ? "Inferencing…" : completed ? "Detection Complete" : "Ready", color: isScanning ? "#F59E0B" : completed ? "#10B981" : "#8B5CF6" },
            { icon: Radio, label: "Geospatial Grid", value: "NIC Connected", color: "#14B8A6" },
            { icon: Shield, label: "RFCTLARR Engine", value: "Active", color: "#EF4444" },
            { icon: CheckCircle2, label: "Govt. Security", value: "NIC / DoLR Certified", color: "#10B981" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
              style={{ background: `${color}10`, borderColor: `${color}30` }}>
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
              <div>
                <p className="text-[9px] font-mono font-semibold uppercase tracking-wider leading-none" style={{ color: `${color}cc` }}>{label}</p>
                <p className="font-semibold leading-none mt-0.5" style={{ color }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
