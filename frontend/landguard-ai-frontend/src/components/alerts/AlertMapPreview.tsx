import { useState } from "react";
import {
  CompassOutlined,
  AimOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  RadarChartOutlined,
  ThunderboltOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { type IncidentAlert, SEVERITY_THEME } from "./AlertsFeed";

interface AlertMapPreviewProps {
  alerts: IncidentAlert[];
  selectedAlert?: IncidentAlert | null;
  onSelectAlert: (alert: IncidentAlert) => void;
}

export default function AlertMapPreview({
  alerts,
  selectedAlert,
  onSelectAlert,
}: AlertMapPreviewProps) {
  const [hoveredAlert, setHoveredAlert] = useState<IncidentAlert | null>(null);
  const [showRadarBeam, setShowRadarBeam] = useState(true);

  // Active target to highlight
  const activeAlert = hoveredAlert || selectedAlert || alerts[0];

  return (
    <div
      className="relative rounded-[24px] p-5 sm:p-6 flex flex-col transition-all duration-300 overflow-hidden select-none"
      style={{
        background: "rgba(15, 23, 42, 0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.04), 0 20px 48px -12px rgba(0,0,0,0.6)",
      }}
    >
      {/* ── Component-Scoped CSS Keyframes: Slower & Smoother Radar Sweep ── */}
      <style>{`
        @keyframes amp-sweep-beam {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes amp-pulse-wave {
          0% { r: 6px; opacity: 0.9; }
          75% { r: 22px; opacity: 0; }
          100% { r: 26px; opacity: 0; }
        }
        @keyframes amp-reticle-turn {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes amp-metro-flow {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ── Global Grid Overlay ── */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />

      {/* ── Softer Ambient Radial Glow Accent ── */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-18"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(20,184,166,0.1) 50%, transparent 70%)",
        }}
      />

      {/* ── HEADER ROW: Title & Multi-Sensor Chips ── */}
      <div className="relative z-10 flex flex-col gap-3 pb-4 border-b border-slate-800/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Title and Radar Pulse */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.28)",
                boxShadow: "0 0 14px rgba(16, 185, 129, 0.15)",
              }}
            >
              <RadarChartOutlined style={{ color: "#10B981", fontSize: 18 }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-tight">
                  Tactical GIS Radar & Hotspot Map
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE SWEEP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Spatial Anomaly Vectorization • Sub-meter Encroachment Telemetry
              </p>
            </div>
          </div>

          {/* Toggle Radar Sweep Button */}
          <button
            type="button"
            onClick={() => setShowRadarBeam(!showRadarBeam)}
            className={`self-start sm:self-auto px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              showRadarBeam
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                : "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200"
            }`}
          >
            <EyeOutlined />
            <span>{showRadarBeam ? "Radar Beam ON" : "Radar Beam Muted"}</span>
          </button>
        </div>

        {/* ── 4 Telemetry Chips (Dashboard Matching Style) ── */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5 text-[11px] font-mono">
          {/* FOV Chip */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 flex items-center gap-1.5 shadow-sm">
            <CompassOutlined style={{ color: "#10B981" }} />
            <span className="text-slate-500">FOV:</span>
            <span className="font-semibold text-emerald-400">18.4 km² Wide Area</span>
          </div>

          {/* Sentinel-2 Chip */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 flex items-center gap-1.5 shadow-sm">
            <DeploymentUnitOutlined style={{ color: "#14B8A6" }} />
            <span className="text-slate-500">Sensor 1:</span>
            <span className="font-semibold text-teal-300">SENTINEL-2 MSI (10m)</span>
          </div>

          {/* Cartosat-3 Chip */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 flex items-center gap-1.5 shadow-sm">
            <AimOutlined style={{ color: "#F59E0B" }} />
            <span className="text-slate-500">Sensor 2:</span>
            <span className="font-semibold text-amber-300">CARTOSAT-3 PAN (0.28m)</span>
          </div>

          {/* RGB Band Chip */}
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 flex items-center gap-1.5 shadow-sm">
            <ThunderboltOutlined style={{ color: "#38BDF8" }} />
            <span className="text-slate-500">Band:</span>
            <span className="font-semibold text-sky-300">RGB B04/B03/B02 + NIR B08</span>
          </div>
        </div>
      </div>

      {/* ── MAP VIEWPORT (Pure SVG Tactical Canvas) ── */}
      <div className="relative mt-3.5 rounded-2xl overflow-hidden bg-[#070b14] border border-slate-800/80 aspect-[16/9] min-h-[300px] md:min-h-[360px] flex items-center justify-center">
        {/* SVG Tactical Canvas */}
        <svg
          viewBox="0 0 620 400"
          className="w-full h-full object-contain"
          style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}
        >
          <defs>
            {/* Smoother Radar Beam Gradient Fan */}
            <linearGradient id="gisSweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.35)" />
              <stop offset="45%" stopColor="rgba(16, 185, 129, 0.08)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
            </linearGradient>

            {/* River Water Glow Filter */}
            <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Metro Glow Filter */}
            <filter id="metroGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Dot Matrix Pattern */}
            <pattern id="tacDotGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.75" fill="rgba(148, 163, 184, 0.08)" />
            </pattern>
          </defs>

          {/* Canvas Dot Matrix Pattern */}
          <rect width="620" height="400" fill="url(#tacDotGrid)" />

          {/* Tactical Geographic Lat/Long Coordinates Grid Lines */}
          <g stroke="rgba(148, 163, 184, 0.07)" strokeDasharray="3 4">
            <line x1="0" y1="80" x2="620" y2="80" />
            <line x1="0" y1="180" x2="620" y2="180" />
            <line x1="0" y1="280" x2="620" y2="280" />
            <line x1="0" y1="360" x2="620" y2="360" />

            <line x1="160" y1="0" x2="160" y2="400" />
            <line x1="310" y1="0" x2="310" y2="400" />
            <line x1="460" y1="0" x2="460" y2="400" />
          </g>

          {/* Coordinate Labels */}
          <text x="8" y="76" fill="rgba(148,163,184,0.3)" fontSize="9" fontFamily="monospace">
            24°15' N
          </text>
          <text x="8" y="176" fill="rgba(148,163,184,0.3)" fontSize="9" fontFamily="monospace">
            23°00' N
          </text>
          <text x="8" y="276" fill="rgba(148,163,184,0.3)" fontSize="9" fontFamily="monospace">
            22°30' N
          </text>
          <text x="165" y="18" fill="rgba(148,163,184,0.3)" fontSize="9" fontFamily="monospace">
            87°00' E
          </text>
          <text x="315" y="18" fill="rgba(148,163,184,0.3)" fontSize="9" fontFamily="monospace">
            88°20' E
          </text>
          <text x="465" y="18" fill="rgba(148,163,184,0.3)" fontSize="9" fontFamily="monospace">
            89°00' E
          </text>

          {/* Concentric Tactical Radar Range Rings centered on Kolkata Hub (330, 230) */}
          <g>
            <circle
              cx="330"
              cy="230"
              r="60"
              fill="none"
              stroke="rgba(16, 185, 129, 0.12)"
              strokeDasharray="3 3"
            />
            <circle
              cx="330"
              cy="230"
              r="125"
              fill="none"
              stroke="rgba(16, 185, 129, 0.08)"
              strokeDasharray="4 4"
            />
            <circle
              cx="330"
              cy="230"
              r="200"
              fill="none"
              stroke="rgba(16, 185, 129, 0.06)"
              strokeDasharray="4 6"
            />

            <text
              x="335"
              y="165"
              fill="rgba(16,185,129,0.35)"
              fontSize="8"
              fontFamily="monospace"
            >
              25 KM
            </text>
            <text
              x="335"
              y="100"
              fill="rgba(16,185,129,0.25)"
              fontSize="8"
              fontFamily="monospace"
            >
              50 KM
            </text>
            <text
              x="335"
              y="25"
              fill="rgba(16,185,129,0.18)"
              fontSize="8"
              fontFamily="monospace"
            >
              100 KM
            </text>
          </g>

          {/* Regional Geographic West Bengal Border Contour */}
          <path
            d="M 330 20 
               L 375 45 
               L 360 90 
               L 320 115 
               L 340 145 
               L 330 185 
               L 415 195 
               L 480 245 
               L 510 295 
               L 435 365 
               L 370 355 
               L 300 370 
               L 225 350 
               L 175 295 
               L 155 220 
               L 195 170 
               L 280 150 
               L 290 90 
               L 310 40 
               Z"
            fill="rgba(16, 185, 129, 0.02)"
            stroke="rgba(16, 185, 129, 0.22)"
            strokeWidth="1.2"
          />

          {/* ── SVG HOOGHLY RIVER CHANNEL ── */}
          <g filter="url(#riverGlow)">
            {/* Outer River Body */}
            <path
              d="M 340 30 
                 Q 325 80 345 130 
                 T 328 190 
                 T 342 245 
                 T 318 300 
                 T 338 355 
                 T 370 400"
              fill="none"
              stroke="rgba(37, 99, 235, 0.22)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Inner Flow Ribbon */}
            <path
              d="M 340 30 
                 Q 325 80 345 130 
                 T 328 190 
                 T 342 245 
                 T 318 300 
                 T 338 355 
                 T 370 400"
              fill="none"
              stroke="rgba(56, 189, 248, 0.6)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* River Core Thread */}
            <path
              d="M 340 30 
                 Q 325 80 345 130 
                 T 328 190 
                 T 342 245 
                 T 318 300 
                 T 338 355 
                 T 370 400"
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="0.8"
              strokeDasharray="8 6"
            />
          </g>
          <text
            x="355"
            y="135"
            fill="rgba(56, 189, 248, 0.65)"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            HOOGHLY RIVER
          </text>

          {/* ── SVG METRO CORRIDOR ── */}
          <g filter="url(#metroGlow)">
            <path
              d="M 230 250 
                 L 275 240 
                 L 315 235 
                 L 355 242 
                 L 400 248 
                 L 445 260"
              fill="none"
              stroke="rgba(245, 158, 11, 0.75)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="6 3"
              style={{ animation: "amp-metro-flow 2.4s linear infinite" }}
            />
            <path
              d="M 330 180 
                 L 330 238 
                 L 322 300"
              fill="none"
              stroke="rgba(16, 185, 129, 0.7)"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
            {/* Metro Stations Nodes */}
            <circle cx="230" cy="250" r="3" fill="#F59E0B" stroke="#000" strokeWidth="1" />
            <circle cx="275" cy="240" r="3" fill="#F59E0B" stroke="#000" strokeWidth="1" />
            <circle cx="315" cy="235" r="4" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="355" cy="242" r="3" fill="#F59E0B" stroke="#000" strokeWidth="1" />
            <circle cx="400" cy="248" r="4" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="445" cy="260" r="3" fill="#F59E0B" stroke="#000" strokeWidth="1" />
          </g>
          <text
            x="395"
            y="238"
            fill="rgba(245, 158, 11, 0.75)"
            fontSize="7.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            METRO CORRIDOR
          </text>

          {/* ── SMOOTHER, SLOWER RADAR SWEEP BEAM (14s) ── */}
          {showRadarBeam && (
            <g
              style={{
                transformOrigin: "330px 230px",
                animation: "amp-sweep-beam 14s linear infinite",
              }}
            >
              {/* Radar Wedge Fan (90 degree quadrant) */}
              <path
                d="M 330 230 L 530 230 A 200 200 0 0 1 330 430 Z"
                fill="url(#gisSweepGradient)"
                opacity="0.7"
              />
              {/* Soft Leading Radar Edge Beam */}
              <line
                x1="330"
                y1="230"
                x2="530"
                y2="230"
                stroke="#10B981"
                strokeWidth="1.5"
                opacity="0.85"
                filter="drop-shadow(0 0 5px rgba(16,185,129,0.7))"
              />
            </g>
          )}

          {/* ── 8 INTERACTIVE ALERT MARKERS ── */}
          {alerts.map((alert) => {
            const isSelected = selectedAlert?.id === alert.id;
            const isHovered = hoveredAlert?.id === alert.id;
            const sevTheme = SEVERITY_THEME[alert.severity];

            const cx = (alert.hotspot.x * 620) / 100;
            const cy = (alert.hotspot.y * 400) / 100;

            return (
              <g
                key={alert.id}
                className="cursor-pointer transition-all"
                onClick={() => onSelectAlert(alert)}
                onMouseEnter={() => setHoveredAlert(alert)}
                onMouseLeave={() => setHoveredAlert(null)}
              >
                {/* Expanding Pulse Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="6"
                  fill="none"
                  stroke={sevTheme.color}
                  strokeWidth={isSelected ? "1.8" : "1"}
                  style={{
                    animation: `amp-pulse-wave ${
                      alert.severity === "CRITICAL" ? "2.2s" : "3s"
                    } cubic-bezier(0.16,1,0.3,1) infinite`,
                    transformOrigin: `${cx}px ${cy}px`,
                  }}
                />

                {/* Secondary Ping Ring for Critical */}
                {alert.severity === "CRITICAL" && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="none"
                    stroke={sevTheme.color}
                    strokeWidth="0.9"
                    style={{
                      animation: "amp-pulse-wave 2.2s cubic-bezier(0.16,1,0.3,1) 1.1s infinite",
                      transformOrigin: `${cx}px ${cy}px`,
                    }}
                  />
                )}

                {/* Anomaly Reticle (When Selected or Hovered) */}
                {(isSelected || isHovered) && (
                  <g>
                    {/* Rotating Dashed Reticle Circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="none"
                      stroke={sevTheme.color}
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                      style={{
                        transformOrigin: `${cx}px ${cy}px`,
                        animation: "amp-reticle-turn 8s linear infinite",
                      }}
                    />

                    {/* Corner Target Bracket Marks */}
                    <path
                      d={`M ${cx - 20} ${cy - 8} L ${cx - 20} ${cy - 20} L ${cx - 8} ${cy - 20}
                          M ${cx + 8} ${cy - 20} L ${cx + 20} ${cy - 20} L ${cx + 20} ${cy - 8}
                          M ${cx + 20} ${cy + 8} L ${cx + 20} ${cy + 20} L ${cx + 8} ${cy + 20}
                          M ${cx - 8} ${cy + 20} L ${cx - 20} ${cy + 20} L ${cx - 20} ${cy + 8}`}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                    />

                    {/* Center Crosshair */}
                    <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} stroke="#FFFFFF" strokeWidth="0.9" />
                    <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} stroke="#FFFFFF" strokeWidth="0.9" />
                  </g>
                )}

                {/* Soft Outer Glow Halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? "10" : "7.5"}
                  fill={sevTheme.color}
                  opacity={isSelected ? "0.35" : "0.18"}
                />

                {/* Core Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? "5.5" : "4.5"}
                  fill={sevTheme.color}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? "1.5" : "1"}
                  style={{ filter: `drop-shadow(0 0 5px ${sevTheme.color})` }}
                />

                {/* Floating Tooltip */}
                {(isSelected || isHovered) && (
                  <g
                    transform={`translate(${
                      cx > 450 ? cx - 146 : cx + 18
                    }, ${cy > 310 ? cy - 46 : cy - 18})`}
                    style={{ pointerEvents: "none" }}
                  >
                    <rect
                      width="140"
                      height="44"
                      rx="8"
                      fill="rgba(15, 23, 42, 0.92)"
                      stroke="rgba(148, 163, 184, 0.15)"
                      strokeWidth="1"
                      filter="drop-shadow(0 4px 14px rgba(0,0,0,0.6))"
                    />
                    <text
                      x="8"
                      y="15"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {alert.code}
                    </text>
                    <text
                      x="132"
                      y="15"
                      textAnchor="end"
                      fill={sevTheme.color}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {alert.severity}
                    </text>

                    <text
                      x="8"
                      y="27"
                      fill="#94A3B8"
                      fontSize="8"
                      fontFamily="sans-serif"
                    >
                      {alert.district} • {alert.coordinates.plotNo}
                    </text>
                    <text
                      x="8"
                      y="37"
                      fill="#38BDF8"
                      fontSize="7.5"
                      fontFamily="monospace"
                    >
                      Area: {alert.affectedAreaSqM}m² | {alert.confidence}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* ── TOP-LEFT HUD RETICLE READOUT ── */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-[11px] font-mono text-slate-200 flex items-center gap-2 shadow-md">
            <AimOutlined style={{ color: "#10B981" }} />
            <span>
              TARGET:{" "}
              <strong className="text-emerald-400 font-bold">
                {activeAlert?.code}
              </strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              {activeAlert?.coordinates.lat.toFixed(4)}°N,{" "}
              {activeAlert?.coordinates.lng.toFixed(4)}°E
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM LEGEND & TELEMETRY FOOTER ── */}
      <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Severity Legend */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="text-[10.5px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
            Hotspot Legend:
          </span>
          <div className="flex items-center gap-1.5 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse" />
            <span className="text-[11px] font-medium">Critical (3)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            <span className="text-[11px] font-medium">High (3)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="text-[11px] font-medium">Moderate (2)</span>
          </div>
        </div>

        {/* Selected Anomaly Footprint Readout */}
        <div className="flex items-center gap-2 text-slate-300 text-[11px] font-mono">
          <EnvironmentOutlined style={{ color: "#10B981" }} />
          <span>
            {activeAlert?.district} • {activeAlert?.coordinates.khatianNo} (
            {activeAlert?.coordinates.plotNo})
          </span>
        </div>
      </div>
    </div>
  );
}
