import React, { useState } from "react";
import {
  FolderOutlined,
  AlertOutlined,
  RadarChartOutlined,
  BankOutlined,
  ScanOutlined,
  SafetyCertificateOutlined,
  ArrowUpOutlined,
  RiseOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KPICardData {
  id: string;
  title: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ style?: React.CSSProperties; className?: string }>;
  footerText: string;
  footerTrend: "up" | "alert" | "neutral";
  footerColor?: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  bgBadge: string;
  telemetryPercent: number;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const KPI_CARDS: KPICardData[] = [
  {
    id: "total-projects",
    title: "Total Projects",
    label: "Active Projects",
    value: "142",
    icon: FolderOutlined,
    footerText: "+8.4% MoM",
    footerTrend: "up",
    accentColor: "#10B981",
    glowColor: "rgba(16,185,129,0.22)",
    borderColor: "rgba(16,185,129,0.35)",
    bgBadge: "rgba(16,185,129,0.12)",
    telemetryPercent: 78,
  },
  {
    id: "active-alerts",
    title: "Active AI Alerts",
    label: "Critical Alerts",
    value: "38",
    icon: AlertOutlined,
    footerText: "+12 detected today",
    footerTrend: "alert",
    accentColor: "#EF4444",
    glowColor: "rgba(239,68,68,0.25)",
    borderColor: "rgba(239,68,68,0.4)",
    bgBadge: "rgba(239,68,68,0.12)",
    telemetryPercent: 92,
  },
  {
    id: "high-risk-zones",
    title: "High Risk Zones",
    label: "High Risk Districts",
    value: "5 of 23",
    icon: RadarChartOutlined,
    footerText: "N24 Pgs, Nadia +3",
    footerTrend: "neutral",
    footerColor: "#F59E0B",
    accentColor: "#F59E0B",
    glowColor: "rgba(245,158,11,0.22)",
    borderColor: "rgba(245,158,11,0.35)",
    bgBadge: "rgba(245,158,11,0.12)",
    telemetryPercent: 64,
  },
  {
    id: "budget-at-risk",
    title: "Budget At Risk",
    label: "Monitored Capex",
    value: "₹4,820 Cr",
    icon: BankOutlined,
    footerText: "2.6% capex flagged",
    footerTrend: "neutral",
    footerColor: "#93C5FD",
    accentColor: "#3B82F6",
    glowColor: "rgba(59,130,246,0.22)",
    borderColor: "rgba(59,130,246,0.35)",
    bgBadge: "rgba(59,130,246,0.12)",
    telemetryPercent: 42,
  },
  {
    id: "ai-predictions",
    title: "AI Predictions",
    label: "Total AI Scans",
    value: "1,429",
    icon: ScanOutlined,
    footerText: "+18.2% scans today",
    footerTrend: "up",
    accentColor: "#14B8A6",
    glowColor: "rgba(20,184,166,0.22)",
    borderColor: "rgba(20,184,166,0.35)",
    bgBadge: "rgba(20,184,166,0.12)",
    telemetryPercent: 86,
  },
  {
    id: "model-accuracy",
    title: "Model Accuracy",
    label: "Survey Calibration",
    value: "96.8%",
    icon: SafetyCertificateOutlined,
    footerText: "Cross-ref Survey of India",
    footerTrend: "up",
    accentColor: "#10B981",
    glowColor: "rgba(16,185,129,0.22)",
    borderColor: "rgba(16,185,129,0.35)",
    bgBadge: "rgba(16,185,129,0.12)",
    telemetryPercent: 97,
  },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KPICard: React.FC<{ card: KPICardData; index: number }> = ({ card, index }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = card.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animation: `kpi-rise 0.55s cubic-bezier(0.16,1,0.3,1) ${index * 75}ms both`,
        background: "rgba(15,23,42,0.78)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: hovered
          ? `1px solid ${card.borderColor}`
          : "1px solid rgba(148,163,184,0.08)",
        boxShadow: hovered
          ? `0 0 32px rgba(16,185,129,0.18),
             0 16px 32px -8px ${card.glowColor},
             0 4px 14px rgba(0,0,0,0.55)`
          : "0 4px 16px -2px rgba(0,0,0,0.45)",
        transform: hovered ? "scale(1.025) translateY(-4px)" : "scale(1) translateY(0)",
      }}
      className="relative flex flex-col justify-between rounded-[20px] p-[18px] transition-all duration-300 ease-out cursor-default overflow-hidden group select-none"
      style2={{ height: 176 }}
    >
      {/* Top-right ambient glow */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${card.glowColor} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* ── Header: icon + label + telemetry dot ── */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Icon badge */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: card.bgBadge,
              border: `1px solid ${card.borderColor}`,
              color: card.accentColor,
            }}
          >
            <Icon style={{ fontSize: 15 }} />
          </div>
          <div className="min-w-0 flex flex-col gap-0.5">
            <span
              className="text-[9.5px] font-bold uppercase tracking-widest truncate"
              style={{ color: "#475569", letterSpacing: "0.14em" }}
            >
              {card.title}
            </span>
            <span className="text-[10.5px] font-semibold text-slate-400 truncate">
              {card.label}
            </span>
          </div>
        </div>
        {/* Live dot */}
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
          style={{
            backgroundColor: card.accentColor,
            boxShadow: hovered ? `0 0 8px ${card.accentColor}` : "none",
          }}
        />
      </div>

      {/* ── Value ── */}
      <div className="relative z-10 my-auto py-1">
        <span
          className="text-[27px] font-extrabold tracking-tight leading-none"
          style={{
            background: `linear-gradient(110deg, #FFFFFF 0%, #FFFFFF 42%, #CBD5E1 50%, #FFFFFF 58%, #FFFFFF 100%)`,
            backgroundSize: "240% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "kpi-shimmer 4.5s ease-in-out infinite",
            textShadow: "none",
            filter: hovered ? `drop-shadow(0 0 12px ${card.glowColor})` : "none",
          }}
        >
          {card.value}
        </span>

        {/* Telemetry progress bar */}
        <div className="mt-3 w-full bg-slate-800/60 rounded-full overflow-hidden" style={{ height: 6 }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${card.telemetryPercent}%`,
              backgroundColor: card.accentColor,
              opacity: hovered ? 1 : 0.7,
              boxShadow: hovered ? `0 0 6px ${card.accentColor}` : "none",
            }}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="relative z-10 pt-2.5 border-t flex items-center text-[11px] leading-none"
        style={{ borderColor: "rgba(148,163,184,0.08)" }}
      >
        {card.footerTrend === "up" && (
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            {card.id === "model-accuracy" ? (
              <RiseOutlined style={{ fontSize: 10 }} />
            ) : (
              <ArrowUpOutlined style={{ fontSize: 10 }} />
            )}
            {card.footerText}
          </span>
        )}
        {card.footerTrend === "alert" && (
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            {card.footerText}
          </span>
        )}
        {card.footerTrend === "neutral" && (
          <span className="truncate font-medium" style={{ color: card.footerColor ?? "#94A3B8" }}>
            {card.footerText}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main KPIGrid ─────────────────────────────────────────────────────────────

export const KPIGrid: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes kpi-rise {
          from { opacity:0; transform:translateY(16px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes kpi-shimmer {
          0%   { background-position: 240% 0; }
          100% { background-position: -240% 0; }
        }
      `}</style>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {KPI_CARDS.map((card, i) => (
          <KPICard key={card.id} card={card} index={i} />
        ))}
      </div>
    </>
  );
};

export default KPIGrid;
