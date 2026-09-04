import { useState, useRef } from "react";
import {
  SearchOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  BellOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Persistent pulse animation dot */
function PulseDot({
  color = "#10B981",
  size = 8,
  delay = 0,
}: {
  color?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {/* Expanding ripple */}
      <span
        className="absolute inset-0 rounded-full opacity-75"
        style={{
          background: color,
          animation: `ping 1.8s cubic-bezier(0,0,0.2,1) infinite`,
          animationDelay: `${delay}ms`,
        }}
      />
      {/* Solid core */}
      <span
        className="relative rounded-full"
        style={{ width: size, height: size, background: color }}
      />
    </span>
  );
}

/** Vertical divider */
function Divider() {
  return (
    <div
      className="shrink-0 self-stretch"
      style={{ width: 1, background: "rgba(148,163,184,0.1)", margin: "8px 0" }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Topbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [bellHovered, setBellHovered] = useState(false);
  const [districtHovered, setDistrictHovered] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [nggHovered, setNggHovered] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <header
      className="shrink-0 flex items-center gap-4 sticky top-0 z-20"
      style={{
        height: 76,
        paddingLeft: 24,
        paddingRight: 24,
        background: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(148,163,184,0.08)",
        borderRadius: "0 0 16px 16px",
        boxShadow:
          "0 1px 0 rgba(148,163,184,0.06), 0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      {/* ── LEFT — Command Badge ─────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 shrink-0 px-4 py-2 rounded-xl select-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(20,184,166,0.08) 100%)",
          border: "1px solid rgba(16,185,129,0.25)",
          boxShadow: "0 0 20px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <PulseDot color="#10B981" size={9} />
        <div>
          <p
            className="text-[9px] font-black tracking-[0.18em] uppercase leading-none"
            style={{ color: "#10B981" }}
          >
            WEST BENGAL
          </p>
          <p
            className="text-[10px] font-bold tracking-[0.12em] uppercase leading-none mt-0.5"
            style={{ color: "#F1F5F9" }}
          >
            SPATIAL COMMAND
          </p>
        </div>
      </div>

      <Divider />

      {/* ── CENTER — Search ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 max-w-xl mx-auto">
        <div
          className="flex items-center gap-3 px-4 rounded-xl transition-all duration-200 cursor-text"
          style={{
            height: 44,
            background: searchFocused
              ? "rgba(15,23,42,0.9)"
              : "rgba(15,23,42,0.6)",
            border: searchFocused
              ? "1px solid rgba(16,185,129,0.45)"
              : "1px solid rgba(148,163,184,0.12)",
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(16,185,129,0.12), 0 4px 20px rgba(0,0,0,0.3)"
              : "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={() => searchRef.current?.focus()}
        >
          <SearchOutlined
            style={{
              fontSize: 15,
              color: searchFocused ? "#10B981" : "#64748B",
              transition: "color 0.2s",
              flexShrink: 0,
            }}
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search Project / Khatian / Plot / District..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
            style={{
              color: "#F1F5F9",
              fontFamily: "'Inter', sans-serif",
            }}
          />
          {/* ⌘K chip */}
          <kbd
            className="shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold select-none"
            style={{
              background: "rgba(30,41,59,0.8)",
              border: "1px solid rgba(148,163,184,0.15)",
              color: "#64748B",
              letterSpacing: "0.05em",
            }}
          >
            ⌘&thinsp;K
          </kbd>
        </div>
      </div>

      <Divider />

      {/* ── RIGHT — Chips ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">

        {/* 1. National Geospatial Grid chip */}
        <div
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-200 select-none"
          onMouseEnter={() => setNggHovered(true)}
          onMouseLeave={() => setNggHovered(false)}
          style={{
            background: nggHovered
              ? "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(20,184,166,0.12) 100%)"
              : "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(20,184,166,0.06) 100%)",
            border: "1px solid rgba(37,99,235,0.25)",
            boxShadow: nggHovered
              ? "0 4px 16px rgba(37,99,235,0.2)"
              : "0 2px 8px rgba(0,0,0,0.2)",
            transform: nggHovered ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          <GlobalOutlined
            style={{ fontSize: 14, color: "#60A5FA" }}
          />
          <div className="hidden lg:block">
            <p
              className="text-[10px] font-bold leading-none tracking-wide"
              style={{ color: "#93C5FD" }}
            >
              National Geospatial Grid
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <PulseDot color="#10B981" size={6} />
              <p
                className="text-[9px] leading-none"
                style={{ color: "rgba(148,163,184,0.7)" }}
              >
                Connected
              </p>
            </div>
          </div>
        </div>

        {/* 2. District Selector */}
        <button
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 select-none"
          onMouseEnter={() => setDistrictHovered(true)}
          onMouseLeave={() => setDistrictHovered(false)}
          style={{
            background: districtHovered
              ? "rgba(30,41,59,0.9)"
              : "rgba(15,23,42,0.7)",
            border: districtHovered
              ? "1px solid rgba(148,163,184,0.2)"
              : "1px solid rgba(148,163,184,0.1)",
            boxShadow: districtHovered
              ? "0 4px 16px rgba(0,0,0,0.3)"
              : "0 2px 8px rgba(0,0,0,0.15)",
            transform: districtHovered ? "translateY(-1px)" : "translateY(0)",
            cursor: "pointer",
          }}
        >
          <EnvironmentOutlined
            style={{ fontSize: 14, color: "#10B981" }}
          />
          <span
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: "#E2E8F0" }}
          >
            All 23 Districts
          </span>
          <DownOutlined
            style={{
              fontSize: 10,
              color: "#64748B",
              transition: "transform 0.2s",
              transform: districtHovered ? "rotate(-180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {/* 3. Notification Bell */}
        <button
          className="relative flex items-center justify-center rounded-xl transition-all duration-200"
          onMouseEnter={() => setBellHovered(true)}
          onMouseLeave={() => setBellHovered(false)}
          style={{
            width: 44,
            height: 44,
            background: bellHovered ? "rgba(239,68,68,0.1)" : "rgba(15,23,42,0.7)",
            border: bellHovered
              ? "1px solid rgba(239,68,68,0.3)"
              : "1px solid rgba(148,163,184,0.1)",
            boxShadow: bellHovered ? "0 0 16px rgba(239,68,68,0.15)" : "none",
            transform: bellHovered ? "translateY(-1px)" : "translateY(0)",
            animation: bellHovered ? "bell-shake 0.4s ease" : "none",
          }}
        >
          <BellOutlined
            style={{
              fontSize: 17,
              color: bellHovered ? "#FCA5A5" : "#64748B",
              transition: "color 0.2s",
            }}
          />
          {/* Red badge */}
          <span
            className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-full text-[8px] font-black"
            style={{
              width: 16,
              height: 16,
              background: "linear-gradient(135deg, #EF4444, #DC2626)",
              color: "#fff",
              boxShadow: "0 0 8px rgba(239,68,68,0.6)",
              border: "1.5px solid rgba(15,23,42,0.9)",
              lineHeight: 1,
            }}
          >
            14
          </span>
        </button>

        {/* 4. Officer Avatar */}
        <button
          className="relative flex-shrink-0 transition-all duration-200"
          onMouseEnter={() => setAvatarHovered(true)}
          onMouseLeave={() => setAvatarHovered(false)}
          style={{
            borderRadius: "50%",
            boxShadow: avatarHovered
              ? "0 0 0 3px rgba(16,185,129,0.5), 0 0 20px rgba(16,185,129,0.25)"
              : "0 0 0 2px rgba(148,163,184,0.15)",
            transform: avatarHovered ? "translateY(-1px) scale(1.04)" : "none",
            transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Avatar circle */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)",
              border: "2px solid rgba(148,163,184,0.15)",
            }}
          >
            <UserOutlined style={{ fontSize: 16, color: "#94A3B8" }} />
          </div>
          {/* Green online dot */}
          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
            style={{
              background: "#10B981",
              borderColor: "#090D16",
              boxShadow: "0 0 6px rgba(16,185,129,0.8)",
            }}
          />
        </button>
      </div>

      {/* ── Bell shake keyframe (inline style inject) ──────────────────── */}
      <style>{`
        @keyframes bell-shake {
          0%, 100% { transform: translateY(-1px) rotate(0deg); }
          20%       { transform: translateY(-1px) rotate(-10deg); }
          40%       { transform: translateY(-1px) rotate(10deg); }
          60%       { transform: translateY(-1px) rotate(-6deg); }
          80%       { transform: translateY(-1px) rotate(6deg); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        input::placeholder {
          color: #475569;
          font-size: 13px;
        }
      `}</style>
    </header>
  );
}
