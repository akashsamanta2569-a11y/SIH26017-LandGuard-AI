import React, { useState } from "react";
import {
  CompassOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  PieChartOutlined,
  BankOutlined,
  AlertOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapRightOutlined,
  SyncOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

// ─── Shared card shell ────────────────────────────────────────────────────────

interface GlassCardProps {
  accentRgb: string;  // e.g. "16,185,129"
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  accentRgb,
  children,
  className = "",
  minHeight = 340,
}) => {
  const [hovered, setHovered] = useState(false);
  const borderAlpha = hovered ? "0.38" : "0.08";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(15,23,42,0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid rgba(${accentRgb},${borderAlpha})`,
        boxShadow: hovered
          ? `0 18px 40px -10px rgba(${accentRgb},0.2), 0 4px 14px rgba(0,0,0,0.55)`
          : "0 4px 20px -2px rgba(0,0,0,0.45)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        minHeight,
      }}
      className={`relative flex flex-col rounded-[20px] p-5 md:p-6 transition-all duration-300 ease-out overflow-hidden group select-none h-full ${className}`}
    >
      {/* Corner ambient glow */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, rgba(${accentRgb},0.25) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.38,
        }}
      />
      {children}
    </div>
  );
};

// ─── Shared card header ───────────────────────────────────────────────────────

interface CardHeaderProps {
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  iconColor, iconBg, iconBorder, icon, title, subtitle, badge,
}) => (
  <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
    <div className="flex items-center gap-3 min-w-0">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconBorder}`, color: iconColor }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold text-white tracking-tight leading-snug truncate">{title}</h3>
        <p className="text-[11px] text-slate-400 font-medium tracking-wide truncate">{subtitle}</p>
      </div>
    </div>
    {badge && <div className="shrink-0">{badge}</div>}
  </div>
);

// ─── CARD 1: Corridor Map Preview ─────────────────────────────────────────────

const CorridorMapCard: React.FC = () => (
  <GlassCard accentRgb="16,185,129" minHeight={360}>
    <CardHeader
      iconColor="#10B981" iconBg="rgba(16,185,129,0.12)" iconBorder="rgba(16,185,129,0.3)"
      icon={<CompassOutlined style={{ fontSize: 18 }} />}
      title="Kolkata Metro Corridor Extension"
      subtitle="Sentinel-2 Resampled • 0.5m GSD"
      badge={
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          S-2B ORBITAL
        </div>
      }
    />

    {/* Map viewport */}
    <div className="relative z-10 flex-1 w-full rounded-xl overflow-hidden border border-slate-700/40 bg-[#07101C]" style={{ minHeight: 190 }}>
      {/* Coordinate grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right,rgba(148,163,184,0.2) 1px,transparent 1px),linear-gradient(to bottom,rgba(148,163,184,0.2) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* River glow */}
      <div
        className="absolute top-0 right-0 w-3/5 h-full opacity-25"
        style={{ background: "radial-gradient(ellipse at 80% 50%,rgba(13,148,136,0.4) 0%,transparent 70%)" }}
      />
      {/* SVG overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {/* Hooghly River bed */}
        <path d="M 40,0 Q 80,80 60,140 T 110,220" fill="none" stroke="rgba(6,182,212,0.16)" strokeWidth="40" strokeLinecap="round" />
        {/* Corridor glow track */}
        <path d="M 20,130 C 100,110 180,140 280,70 S 420,80 500,40" fill="none" stroke="rgba(16,185,129,0.2)" strokeWidth="9" />
        {/* Dashed alignment */}
        <path d="M 20,130 C 100,110 180,140 280,70 S 420,80 500,40" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="4 3" className="animate-pulse" />
        {/* Station nodes */}
        <circle cx="95"  cy="115" r="4" fill="#10B981" stroke="#07101C" strokeWidth="2" />
        <circle cx="210" cy="120" r="4" fill="#10B981" stroke="#07101C" strokeWidth="2" />
        <circle cx="340" cy="74"  r="5" fill="#F59E0B" stroke="#07101C" strokeWidth="2" />
        <circle cx="440" cy="65"  r="4" fill="#10B981" stroke="#07101C" strokeWidth="2" />
      </svg>

      {/* Anomaly marker */}
      <div
        className="absolute top-[35%] left-[55%] -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/55 backdrop-blur-sm flex flex-col gap-0.5"
        style={{ boxShadow: "0 0 18px rgba(245,158,11,0.28)" }}
      >
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          SEC-V BUFFER ANOMALY
        </div>
        <span className="text-[9.5px] text-amber-200/80 font-mono">+14.2m DEVIATION DETECTED</span>
      </div>

      {/* Scanline sweep — uses global grid-overlay animation as timing reference, define inline */}
      <div
        className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70"
        style={{ animation: "ag-scan 3.5s linear infinite" }}
      />

      {/* Corner telemetry badges */}
      <div className="absolute top-2 left-2.5 px-2 py-0.5 rounded bg-black/60 border border-slate-700/50 text-[10px] font-mono text-slate-300">
        FOV: 1.2 KM²&nbsp;•&nbsp;EPSG:4326
      </div>
      <div className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded bg-black/60 border border-slate-700/50 text-[10px] font-mono text-emerald-400">
        BAND B4-B3-B2 (RGB)
      </div>
    </div>

    {/* Footer */}
    <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-400 text-xs font-semibold">
        <AlertOutlined style={{ fontSize: 12 }} />
        Critical Delay Risk
      </div>
      <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
        <EnvironmentOutlined style={{ fontSize: 11, color: "#64748B" }} />
        22.5726° N, 88.3639° E
      </div>
    </div>
  </GlassCard>
);

// ─── CARD 2: Real-Time Telemetry ──────────────────────────────────────────────

interface MetricBarProps {
  label: React.ReactNode;
  value: string;
  valueColor: string;
  barWidth: string;
  barClass: string;
  shimmer?: boolean;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, valueColor, barWidth, barClass, shimmer }) => (
  <div>
    <div className="flex items-center justify-between text-xs mb-1.5">
      <span className="text-slate-300 font-medium">{label}</span>
      <span className="font-bold font-mono" style={{ color: valueColor }}>{value}</span>
    </div>
    <div className="w-full rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/50 p-[1px]" style={{ height: 12 }}>
      <div className={`h-full rounded-full ${barClass} transition-all duration-700 relative overflow-hidden`} style={{ width: barWidth }}>
        {shimmer && (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.35) 50%,transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "ag-bar-sweep 2.5s infinite",
            }}
          />
        )}
      </div>
    </div>
  </div>
);

const TelemetryCard: React.FC = () => (
  <GlassCard accentRgb="20,184,166" minHeight={360}>
    <CardHeader
      iconColor="#14B8A6" iconBg="rgba(20,184,166,0.12)" iconBorder="rgba(20,184,166,0.3)"
      icon={<ThunderboltOutlined style={{ fontSize: 18 }} />}
      title="YOLOv8 Stream"
      subtitle="Neural Edge Inference • Node WB-01"
      badge={
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-[11px] text-teal-300 font-mono font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
          48.2 FPS
        </div>
      }
    />

    <div className="relative z-10 flex flex-col flex-1 justify-around gap-3.5">
      <MetricBar
        label="GPU Utilization" value="94%" valueColor="#10B981"
        barWidth="94%" barClass="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" shimmer
      />
      <MetricBar
        label={
          <span className="flex items-center gap-1.5">
            <SyncOutlined spin style={{ fontSize: 11, color: "#10B981" }} />
            Sentinel Sync Active
          </span>
        }
        value="SYNCHRONIZED" valueColor="#2DD4BF"
        barWidth="100%" barClass="bg-gradient-to-r from-teal-500 to-emerald-400"
      />
      <MetricBar
        label="AI Latency" value="0.38s (Optimal)" valueColor="#22D3EE"
        barWidth="38%" barClass="bg-gradient-to-r from-cyan-500 to-blue-400"
      />
      <MetricBar
        label="Critical Threat Load" value="38 Active Alerts" valueColor="#F87171"
        barWidth="62%" barClass="bg-gradient-to-r from-amber-500 to-rose-500"
      />
    </div>

    <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-slate-300">Tensor Core Pipeline 04</span>
      </div>
      <span className="font-mono text-[11px]">VRAM: 32.4 / 40 GB</span>
    </div>
  </GlassCard>
);

// ─── CARD 3: Department Budget ────────────────────────────────────────────────

const DEPARTMENTS = [
  { name: "PWD",       budget: "₹2,480 Cr", pct: 85, bar: "from-emerald-500 to-teal-400" },
  { name: "Railways",  budget: "₹1,810 Cr", pct: 62, bar: "from-teal-500 to-cyan-400" },
  { name: "Housing",   budget: "₹980 Cr",   pct: 34, bar: "from-cyan-500 to-blue-400" },
  { name: "Urban Dev", budget: "₹720 Cr",   pct: 25, bar: "from-blue-500 to-indigo-400" },
];

const DepartmentBudgetCard: React.FC = () => (
  <GlassCard accentRgb="16,185,129">
    <CardHeader
      iconColor="#10B981" iconBg="rgba(16,185,129,0.12)" iconBorder="rgba(16,185,129,0.3)"
      icon={<BarChartOutlined style={{ fontSize: 18 }} />}
      title="Department Budget"
      subtitle="Capex Allocation Breakdown"
      badge={
        <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
          ₹5,990 Cr
        </span>
      }
    />

    <div className="relative z-10 flex flex-col flex-1 justify-around gap-4">
      {DEPARTMENTS.map((d) => (
        <div key={d.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">{d.name}</span>
            <span className="text-white font-mono font-bold">{d.budget}</span>
          </div>
          <div className="w-full rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/40 p-[1px]" style={{ height: 10 }}>
            <div className={`h-full rounded-full bg-gradient-to-r ${d.bar} transition-all duration-700`} style={{ width: `${d.pct}%` }} />
          </div>
        </div>
      ))}
    </div>

    <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
      <span>4 Active Departments</span>
      <span className="text-emerald-400 font-semibold">↑ +9.2% YoY</span>
    </div>
  </GlassCard>
);

// ─── CARD 4: Project Status Donut ─────────────────────────────────────────────

const DONUT_LEGEND = [
  { label: "Ongoing",   pct: "54%", color: "#10B981" },
  { label: "Planned",   pct: "28%", color: "#06B6D4" },
  { label: "Completed", pct: "18%", color: "#6366F1" },
];

const ProjectStatusCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <GlassCard accentRgb="6,182,212">
      <CardHeader
        iconColor="#06B6D4" iconBg="rgba(6,182,212,0.12)" iconBorder="rgba(6,182,212,0.3)"
        icon={<PieChartOutlined style={{ fontSize: 18 }} />}
        title="Project Status"
        subtitle="142 Monitored Infrastructure Assets"
      />

      {/* Donut */}
      <div className="relative z-10 flex items-center justify-center my-2 flex-1">
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 148,
            height: 148,
            background: "conic-gradient(#10B981 0% 54%, #06B6D4 54% 82%, #6366F1 82% 100%)",
            boxShadow: hovered ? "0 0 32px rgba(16,185,129,0.3)" : "0 0 14px rgba(16,185,129,0.12)",
            transition: "box-shadow 0.3s",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="rounded-full bg-[#0F1728] flex flex-col items-center justify-center border border-slate-700/50" style={{ width: 100, height: 100 }}>
            <span className="text-[26px] font-extrabold text-white tracking-tight leading-none">54%</span>
            <span className="text-[9.5px] font-bold text-emerald-400 uppercase tracking-wider mt-0.5 text-center px-1">
              Ongoing
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/70">
        {DONUT_LEGEND.map((l) => (
          <div key={l.label} className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
              {l.pct}
            </div>
            <span className="text-[10.5px] text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ─── CARD 5: Budget Exposure ──────────────────────────────────────────────────

const DISTRICTS_EXPOSURE = [
  { name: "North 24 Parganas", amount: "₹3,410 Cr", pct: 92, risk: "Critical" },
  { name: "Nadia",             amount: "₹2,890 Cr", pct: 78, risk: "High" },
  { name: "Hooghly",           amount: "₹2,100 Cr", pct: 58, risk: "High" },
  { name: "Birbhum",           amount: "₹1,740 Cr", pct: 46, risk: "Medium" },
];

const BudgetExposureCard: React.FC = () => (
  <GlassCard accentRgb="59,130,246">
    <CardHeader
      iconColor="#3B82F6" iconBg="rgba(59,130,246,0.12)" iconBorder="rgba(59,130,246,0.3)"
      icon={<BankOutlined style={{ fontSize: 18 }} />}
      title="Budget Exposure"
      subtitle="Capex Under Encroachment Risk"
      badge={
        <span className="text-xs font-bold text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/25">
          ₹10,140 Cr
        </span>
      }
    />

    <div className="relative z-10 flex flex-col flex-1 justify-around gap-2.5">
      {DISTRICTS_EXPOSURE.map((d) => (
        <div key={d.name} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/35 hover:border-slate-600/55 transition-colors">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-200 font-semibold">{d.name}</span>
            <span className="text-blue-300 font-bold font-mono">{d.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full bg-slate-900/80 overflow-hidden border border-slate-700/50" style={{ height: 8 }}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  d.risk === "Critical"
                    ? "bg-gradient-to-r from-amber-500 to-rose-500"
                    : d.risk === "High"
                    ? "bg-gradient-to-r from-blue-500 to-amber-500"
                    : "bg-gradient-to-r from-teal-500 to-blue-500"
                }`}
                style={{ width: `${d.pct}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{d.pct}%</span>
          </div>
        </div>
      ))}
    </div>

    <div className="relative z-10 mt-2 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
      <span>Monitored District Assets</span>
      <span className="text-blue-400 font-semibold">Cross-Ref DL&amp;LRO</span>
    </div>
  </GlassCard>
);

// ─── CARD 6: Top Risk Districts ───────────────────────────────────────────────

const RISK_DISTRICTS = [
  { id: "north-24-pgs", rank: 1, name: "North 24 Parganas", score: 94.6, severity: "Critical", trend: "up",      val: "+6.4%", alerts: 14, corridor: "Kolkata Metro Ext / Wetland Buffer" },
  { id: "nadia",        rank: 2, name: "Nadia",             score: 88.2, severity: "High",     trend: "up",      val: "+3.8%", alerts: 9,  corridor: "NH-34 National Highway Bypass" },
  { id: "hooghly",      rank: 3, name: "Hooghly",           score: 79.5, severity: "High",     trend: "down",    val: "−1.2%", alerts: 6,  corridor: "Dankuni Industrial Freight Ring" },
  { id: "birbhum",      rank: 4, name: "Birbhum",           score: 71.0, severity: "Medium",   trend: "up",      val: "+1.8%", alerts: 5,  corridor: "Deocha Pachami Infrastructure Zone" },
  { id: "murshidabad",  rank: 5, name: "Murshidabad",       score: 65.4, severity: "Medium",   trend: "neutral", val: "0.0%",  alerts: 4,  corridor: "Bhagirathi Riverbank Embankment" },
];

const SEVERITY_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  Critical: { bg: "bg-rose-500/15",   border: "border-rose-500/40",   text: "text-rose-400" },
  High:     { bg: "bg-amber-500/15",  border: "border-amber-500/40",  text: "text-amber-400" },
  Medium:   { bg: "bg-yellow-500/15", border: "border-yellow-500/40", text: "text-yellow-300" },
};

const TopRiskDistrictsCard: React.FC = () => (
  <GlassCard accentRgb="239,68,68" minHeight={0}>
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}
        >
          <AlertOutlined style={{ fontSize: 18 }} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-white tracking-tight leading-snug">Top Risk Districts</h3>
          <p className="text-[11px] text-slate-400 font-medium">Vulnerability Index &amp; AI Encroachment Severity</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        North 24 Parganas at Critical Threshold
      </div>
    </div>

    <div className="relative z-10 flex flex-col gap-2.5">
      {RISK_DISTRICTS.map((d) => {
        const sev = SEVERITY_STYLE[d.severity];
        return (
          <div
            key={d.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/35 hover:border-slate-600/55 transition-colors gap-3"
          >
            {/* Rank + name */}
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  d.rank === 1 ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : d.rank <= 3 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-slate-700/50 text-slate-300 border border-slate-600/40"
                }`}
              >
                #{d.rank}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{d.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono hidden lg:inline">• {d.corridor}</span>
                </div>
                <div className="text-[11px] text-slate-400">{d.alerts} active spatial alerts</div>
              </div>
            </div>

            {/* Right: score + severity + trend */}
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-medium">Risk Score</div>
                <div className="text-sm font-extrabold font-mono text-white">
                  {d.score}<span className="text-[10px] text-slate-500 font-normal"> /100</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full border text-xs font-bold inline-flex items-center gap-1 ${sev.bg} ${sev.border} ${sev.text}`}>
                {d.severity === "Critical" && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />}
                {d.severity}
              </span>

              <span className={`min-w-[60px] flex items-center justify-end font-mono text-xs font-semibold ${
                d.trend === "up" ? "text-rose-400" : d.trend === "down" ? "text-emerald-400" : "text-slate-400"
              }`}>
                {d.trend === "up"      && <ArrowUpOutlined   style={{ fontSize: 11, marginRight: 2 }} />}
                {d.trend === "down"    && <ArrowDownOutlined  style={{ fontSize: 11, marginRight: 2 }} />}
                {d.trend === "neutral" && <SwapRightOutlined  style={{ fontSize: 11, marginRight: 2 }} />}
                {d.val}
              </span>
            </div>
          </div>
        );
      })}
    </div>

    <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        AI Sentinel Index updated 6 mins ago
      </span>
      <span className="text-emerald-400 font-semibold">Cross-referencing LandGuard Grid WB-23</span>
    </div>
  </GlassCard>
);

// ─── Main AnalyticsGrid ───────────────────────────────────────────────────────

export const AnalyticsGrid: React.FC = () => (
  <>
    <style>{`
      @keyframes ag-scan {
        0%   { top: 0%;   opacity: 0.8; }
        50%  {            opacity: 1;   }
        100% { top: 100%; opacity: 0.1; }
      }
      @keyframes ag-bar-sweep {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
    `}</style>

    <div className="w-full flex flex-col gap-5">
      {/* Row 1: Map (7/12) + Telemetry (5/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7"><CorridorMapCard /></div>
        <div className="lg:col-span-5"><TelemetryCard /></div>
      </div>

      {/* Row 2: Budget + Donut + Exposure (equal height) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        <DepartmentBudgetCard />
        <ProjectStatusCard />
        <div className="md:col-span-2 lg:col-span-1"><BudgetExposureCard /></div>
      </div>

      {/* Row 3: Full-width risk table */}
      <TopRiskDistrictsCard />
    </div>
  </>
);

export default AnalyticsGrid;
