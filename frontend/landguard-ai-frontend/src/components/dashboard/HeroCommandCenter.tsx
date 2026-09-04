import { useState, useEffect } from "react";
import {
  DeploymentUnitOutlined,
  DownloadOutlined,
  RadarChartOutlined,
  GlobalOutlined,
  AlertOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloatDotProps {
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  duration: number;
}

// ─── Live clock ───────────────────────────────────────────────────────────────

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

function getGreeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatDot({ x, y, size, delay, color, duration }: FloatDotProps) {
  return (
    <span
      className="pointer-events-none absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 2.5}px ${color}`,
        opacity: 0,
        animation: `hcc-float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function PulseRing({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <span
      className="pointer-events-none absolute rounded-full border"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: 90,
        height: 90,
        borderColor: "rgba(16,185,129,0.2)",
        transform: "translate(-50%, -50%)",
        animation: `hcc-ring 3.6s ease-out ${delay}s infinite`,
      }}
    />
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  variant: "primary" | "secondary" | "tertiary";
}

function ActionButton({ icon, label, variant }: ActionButtonProps) {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 18px",
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.02em",
    transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
    border: "none",
    width: "100%",
    whiteSpace: "nowrap",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: hovered
        ? "linear-gradient(135deg,#059669 0%,#0D9488 100%)"
        : "linear-gradient(135deg,#10B981 0%,#14B8A6 100%)",
      color: "#fff",
      boxShadow: hovered
        ? "0 10px 32px rgba(16,185,129,0.55),0 0 0 1px rgba(16,185,129,0.3)"
        : "0 4px 18px rgba(16,185,129,0.3)",
    },
    secondary: {
      background: hovered ? "rgba(30,41,59,0.95)" : "rgba(15,23,42,0.72)",
      color: "#CBD5E1",
      border: "1px solid rgba(148,163,184,0.14)",
      boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.25)",
    },
    tertiary: {
      background: hovered ? "rgba(20,184,166,0.13)" : "transparent",
      color: hovered ? "#2DD4BF" : "#94A3B8",
      border: "1px solid",
      borderColor: hovered ? "rgba(20,184,166,0.45)" : "rgba(148,163,184,0.2)",
      boxShadow: hovered ? "0 0 18px rgba(20,184,166,0.22)" : "none",
    },
  };

  return (
    <button
      type="button"
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}

function StatPill({
  value,
  label,
  color,
  icon,
}: {
  value: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl select-none"
      style={{
        background: `${color}14`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 14px ${color}18`,
      }}
    >
      <span style={{ color, fontSize: 14, lineHeight: 1 }}>{icon}</span>
      <span className="text-base font-black tabular-nums leading-none" style={{ color }}>
        {value}
      </span>
      <span
        className="text-[10.5px] font-semibold uppercase tracking-wider"
        style={{ color: "rgba(148,163,184,0.75)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────

const FLOAT_DOTS: FloatDotProps[] = [
  { x: 62, y: 18, size: 4, delay: 0,   color: "rgba(16,185,129,0.75)",  duration: 4.5 },
  { x: 74, y: 52, size: 3, delay: 1.2, color: "rgba(20,184,166,0.65)",  duration: 5.2 },
  { x: 85, y: 33, size: 5, delay: 0.6, color: "rgba(16,185,129,0.5)",   duration: 3.8 },
  { x: 91, y: 68, size: 3, delay: 2.0, color: "rgba(37,99,235,0.55)",   duration: 6.0 },
  { x: 68, y: 78, size: 4, delay: 1.5, color: "rgba(20,184,166,0.48)",  duration: 4.2 },
  { x: 79, y: 12, size: 3, delay: 0.9, color: "rgba(16,185,129,0.42)",  duration: 5.5 },
  { x: 95, y: 44, size: 4, delay: 2.5, color: "rgba(16,185,129,0.62)",  duration: 3.5 },
  { x: 58, y: 63, size: 3, delay: 0.3, color: "rgba(20,184,166,0.52)",  duration: 4.8 },
];

const PULSE_RINGS = [
  { x: 83, y: 50, delay: 0 },
  { x: 91, y: 22, delay: 1.3 },
  { x: 70, y: 76, delay: 2.6 },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HeroCommandCenter() {
  const now = useLiveClock();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const greeting = getGreeting(now);

  return (
    <>
      {/* Scoped keyframes — all prefixed hcc- to avoid global conflicts */}
      <style>{`
        @keyframes hcc-float {
          0%,100% { opacity:0;   transform:translateY(0) scale(1);   }
          30%      { opacity:1;                                        }
          50%      { opacity:0.7; transform:translateY(-16px) scale(1.2); }
          80%      { opacity:0.3;                                     }
        }
        @keyframes hcc-ring {
          0%   { transform:translate(-50%,-50%) scale(0.5); opacity:0.7; }
          100% { transform:translate(-50%,-50%) scale(3.2); opacity:0;   }
        }
        @keyframes hcc-mount {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes hcc-breathe {
          0%,100% { opacity:0.5; }
          50%     { opacity:0.92; }
        }
        @keyframes hcc-badge-ping {
          75%,100% { transform:scale(2); opacity:0; }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: 320,
          borderRadius: 24,
          background:
            "linear-gradient(135deg, rgba(10,22,40,0.97) 0%, rgba(13,27,42,0.95) 55%, rgba(8,14,26,0.98) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(148,163,184,0.1)",
          boxShadow:
            "0 0 0 1px rgba(16,185,129,0.05), 0 24px 64px rgba(0,0,0,0.65), 0 0 80px rgba(16,185,129,0.06)",
          padding: "40px 32px",
          opacity: mounted ? 1 : 0,
          animation: mounted ? "hcc-mount 0.55s cubic-bezier(0.16,1,0.3,1) both" : "none",
        }}
      >
        {/* BG: global grid overlay from index.css */}
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-70" />

        {/* BG: right emerald glow orb */}
        <div
          className="pointer-events-none absolute"
          style={{
            right: -80,
            top: -80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.17) 0%, rgba(20,184,166,0.07) 38%, transparent 68%)",
            animation: "hcc-breathe 4.5s ease-in-out infinite",
          }}
        />

        {/* BG: bottom-left blue glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: -100,
            bottom: -100,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 60%)",
          }}
        />

        {/* BG: top border highlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.4) 40%, rgba(20,184,166,0.28) 60%, transparent 100%)",
          }}
        />

        {/* Floating telemetry dots */}
        {FLOAT_DOTS.map((d, i) => (
          <FloatDot key={i} {...d} />
        ))}

        {/* Pulse rings */}
        {PULSE_RINGS.map((r, i) => (
          <PulseRing key={i} {...r} />
        ))}

        {/* ════════════════ CONTENT ════════════════ */}
        <div className="relative z-10 flex flex-col gap-6">

          {/* Row 1: badge + live clock */}
          <div className="flex items-start justify-between flex-wrap gap-3">

            {/* Surveillance badge */}
            <div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full select-none"
              style={{
                background: "rgba(16,185,129,0.09)",
                border: "1px solid rgba(16,185,129,0.26)",
                boxShadow: "0 0 14px rgba(16,185,129,0.09)",
              }}
            >
              {/* Animated ping dot */}
              <span className="relative flex shrink-0" style={{ width: 8, height: 8 }}>
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#10B981",
                    animation: "hcc-badge-ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                  }}
                />
                <span
                  className="relative block rounded-full"
                  style={{ width: 8, height: 8, background: "#10B981", boxShadow: "0 0 8px #10B981" }}
                />
              </span>
              <span
                className="text-[10px] font-bold uppercase"
                style={{ color: "#10B981", letterSpacing: "0.18em" }}
              >
                SPATIAL SURVEILLANCE GRID&nbsp;•&nbsp;NODE WB-01
              </span>
            </div>

            {/* Live timestamp */}
            <p
              className="shrink-0 text-[13px] font-mono font-semibold tabular-nums tracking-wide select-none"
              style={{ color: "#94A3B8" }}
            >
              {formatIST(now)}
            </p>
          </div>

          {/* Row 2: content + action panel */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">

            {/* LEFT */}
            <div className="flex-1 min-w-0">
              {/* Greeting */}
              <p className="text-lg font-medium leading-none mb-1.5" style={{ color: "#64748B" }}>
                {greeting}
              </p>

              {/* Hero name — reuses global .shimmer-text */}
              <h1
                className="shimmer-text font-black leading-none tracking-tight"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
                  filter: "drop-shadow(0 0 28px rgba(16,185,129,0.3))",
                }}
              >
                Director Roy
              </h1>

              {/* Platform subtitle */}
              <p
                className="mt-4 text-[11px] font-bold uppercase"
                style={{ color: "#475569", letterSpacing: "0.13em" }}
              >
                AI-Powered Land Acquisition Intelligence Platform
              </p>

              {/* Body text */}
              <p className="mt-2 text-sm leading-relaxed max-w-xl" style={{ color: "#64748B" }}>
                Real-time monitoring of high-priority infrastructure corridors across West
                Bengal. Proactively intercepting land acquisition delays, unauthorized
                encroachment, and cadastral litigation.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mt-5">
                <StatPill value="23" label="Active Districts" color="#10B981" icon={<GlobalOutlined />} />
                <StatPill value="147" label="Open Projects"   color="#F59E0B" icon={<RadarChartOutlined />} />
                <StatPill value="38"  label="AI Alerts"       color="#EF4444" icon={<AlertOutlined />} />
              </div>
            </div>

            {/* RIGHT: action panel */}
            <div className="flex flex-col gap-3 w-full lg:w-56 shrink-0">
              <div
                className="flex flex-col gap-3 p-4 rounded-2xl"
                style={{
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(148,163,184,0.08)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {/* Panel header */}
                <div className="flex items-center gap-2 select-none">
                  <CheckCircleOutlined style={{ fontSize: 12, color: "#10B981" }} />
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{ color: "#475569", letterSpacing: "0.14em" }}
                  >
                    Quick Actions
                  </span>
                </div>

                <ActionButton variant="primary"   icon={<DeploymentUnitOutlined />} label="Run Satellite Audit"    />
                <ActionButton variant="secondary" icon={<DownloadOutlined />}       label="Export District Report" />
                <ActionButton variant="tertiary"  icon={<RadarChartOutlined />}     label="Simulate Corridor"      />
              </div>

              <p className="text-center text-[10px] font-medium select-none" style={{ color: "#334155" }}>
                LandGuard AI v2.4.1&nbsp;•&nbsp;YOLOv8 Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
