import { useState, useId } from "react";
import {
  AppstoreOutlined,
  GlobalOutlined,
  RadarChartOutlined,
  EnvironmentOutlined,
  DatabaseOutlined,
  CloudOutlined,
  BorderOutlined,
  ApartmentOutlined,
  CarOutlined,
  BranchesOutlined,
  SlidersOutlined,
  CheckOutlined,
  DownOutlined,
  UpOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

// ─── Exported State Interfaces (Ready for FastAPI GIS API Integration) ───────

export interface SatelliteLayersState {
  sentinel2: boolean;
  cartosat3: boolean;
  planetscope: boolean;
}

export interface AIAnalysisLayersState {
  encroachmentHeatmap: boolean;
  ndviVegetationLoss: boolean;
  changeDetection: boolean;
  floodRiskOverlay: boolean;
  illegalConstruction: boolean;
}

export interface AdministrativeLayersState {
  districtBoundaries: boolean;
  mouzaBoundaries: boolean;
  jlNumbers: boolean;
  khatianParcels: boolean;
  plotNumbers: boolean;
}

export interface InfrastructureLayersState {
  metroCorridor: boolean;
  railwayAlignment: boolean;
  nationalHighways: boolean;
  riversCanals: boolean;
  forestBufferZones: boolean;
}

export interface LayerOpacityState {
  heatmap: number;
  ndvi: number;
  cadastre: number;
  infrastructure: number;
}

export interface SpatialLayersConfig {
  satellite: SatelliteLayersState;
  aiAnalysis: AIAnalysisLayersState;
  administrative: AdministrativeLayersState;
  infrastructure: InfrastructureLayersState;
  opacity: LayerOpacityState;
}

export interface LayerControlPanelProps {
  initialConfig?: Partial<SpatialLayersConfig>;
  onLayersChange?: (config: SpatialLayersConfig) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LayerControlPanel({
  initialConfig,
  onLayersChange,
}: LayerControlPanelProps) {
  // ── Section 1: Satellite Sources State ──
  const [satellite, setSatellite] = useState<SatelliteLayersState>({
    sentinel2: initialConfig?.satellite?.sentinel2 ?? true,
    cartosat3: initialConfig?.satellite?.cartosat3 ?? true,
    planetscope: initialConfig?.satellite?.planetscope ?? false,
  });

  // ── Section 2: AI Analysis Layers State ──
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisLayersState>({
    encroachmentHeatmap: initialConfig?.aiAnalysis?.encroachmentHeatmap ?? true,
    ndviVegetationLoss: initialConfig?.aiAnalysis?.ndviVegetationLoss ?? true,
    changeDetection: initialConfig?.aiAnalysis?.changeDetection ?? true,
    floodRiskOverlay: initialConfig?.aiAnalysis?.floodRiskOverlay ?? false,
    illegalConstruction: initialConfig?.aiAnalysis?.illegalConstruction ?? true,
  });

  // ── Section 3: Administrative Layers State ──
  const [administrative, setAdministrative] = useState<AdministrativeLayersState>({
    districtBoundaries: initialConfig?.administrative?.districtBoundaries ?? true,
    mouzaBoundaries: initialConfig?.administrative?.mouzaBoundaries ?? true,
    jlNumbers: initialConfig?.administrative?.jlNumbers ?? false,
    khatianParcels: initialConfig?.administrative?.khatianParcels ?? true,
    plotNumbers: initialConfig?.administrative?.plotNumbers ?? false,
  });

  // ── Section 4: Infrastructure Layers State ──
  const [infrastructure, setInfrastructure] = useState<InfrastructureLayersState>({
    metroCorridor: initialConfig?.infrastructure?.metroCorridor ?? true,
    railwayAlignment: initialConfig?.infrastructure?.railwayAlignment ?? true,
    nationalHighways: initialConfig?.infrastructure?.nationalHighways ?? true,
    riversCanals: initialConfig?.infrastructure?.riversCanals ?? true,
    forestBufferZones: initialConfig?.infrastructure?.forestBufferZones ?? false,
  });

  // ── Opacity Controls State ──
  const [opacity, setOpacity] = useState<LayerOpacityState>({
    heatmap: initialConfig?.opacity?.heatmap ?? 82,
    ndvi: initialConfig?.opacity?.ndvi ?? 64,
    cadastre: initialConfig?.opacity?.cadastre ?? 100,
    infrastructure: initialConfig?.opacity?.infrastructure ?? 55,
  });

  // Accordion collapsed states for responsive/mobile optimization
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({
    satellite: false,
    ai: false,
    admin: false,
    infra: false,
    opacity: false,
    legend: false,
  });

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper dispatcher to notify parent components
  const notifyChange = (
    newSatellite = satellite,
    newAi = aiAnalysis,
    newAdmin = administrative,
    newInfra = infrastructure,
    newOpacity = opacity
  ) => {
    if (onLayersChange) {
      onLayersChange({
        satellite: newSatellite,
        aiAnalysis: newAi,
        administrative: newAdmin,
        infrastructure: newInfra,
        opacity: newOpacity,
      });
    }
  };

  // Toggle Handlers
  const handleToggleSatellite = (key: keyof SatelliteLayersState) => {
    const updated = { ...satellite, [key]: !satellite[key] };
    setSatellite(updated);
    notifyChange(updated, aiAnalysis, administrative, infrastructure, opacity);
  };

  const handleToggleAi = (key: keyof AIAnalysisLayersState) => {
    const updated = { ...aiAnalysis, [key]: !aiAnalysis[key] };
    setAiAnalysis(updated);
    notifyChange(satellite, updated, administrative, infrastructure, opacity);
  };

  const handleToggleAdmin = (key: keyof AdministrativeLayersState) => {
    const updated = { ...administrative, [key]: !administrative[key] };
    setAdministrative(updated);
    notifyChange(satellite, aiAnalysis, updated, infrastructure, opacity);
  };

  const handleToggleInfra = (key: keyof InfrastructureLayersState) => {
    const updated = { ...infrastructure, [key]: !infrastructure[key] };
    setInfrastructure(updated);
    notifyChange(satellite, aiAnalysis, administrative, updated, opacity);
  };

  const handleOpacityChange = (key: keyof LayerOpacityState, val: number) => {
    const updated = { ...opacity, [key]: val };
    setOpacity(updated);
    notifyChange(satellite, aiAnalysis, administrative, infrastructure, updated);
  };

  // Count active layers
  const activeCount =
    Object.values(satellite).filter(Boolean).length +
    Object.values(aiAnalysis).filter(Boolean).length +
    Object.values(administrative).filter(Boolean).length +
    Object.values(infrastructure).filter(Boolean).length;

  return (
    <aside
      className="relative w-full lg:w-[340px] lg:sticky lg:top-6 self-start rounded-3xl p-5 sm:p-5.5 flex flex-col gap-4.5 select-none transition-all duration-300 overflow-hidden"
      style={{
        background: "rgba(17, 24, 39, 0.84)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(51, 65, 85, 0.8)",
        boxShadow:
          "0 0 0 1px rgba(16,185,129,0.06), 0 20px 48px -12px rgba(0,0,0,0.68), 0 0 60px rgba(16,185,129,0.05)",
        animation: "layerFade 0.4s ease-out both",
      }}
    >
      {/* ── Scoped Animation Keyframes ── */}
      <style>{`
        @keyframes layerFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes layerPulse {
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
        /* Custom input slider styles */
        .layer-slider::-webkit-slider-thumb {
          appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #10B981;
          border: 2px solid #064E3B;
          box-shadow: 0 0 8px rgba(16,185,129,0.8);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .layer-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>

      {/* ── Ambient Radial Glow ── */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(20,184,166,0.15) 50%, transparent 70%)",
        }}
      />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-start justify-between gap-2.5 pb-3.5 border-b border-slate-800/80">
        <div className="flex items-start gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
            style={{
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              boxShadow: "0 0 12px rgba(16, 185, 129, 0.15)",
            }}
          >
            <AppstoreOutlined style={{ color: "#10B981", fontSize: 16 }} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight leading-none flex items-center gap-1.5">
              Spatial Intelligence Layers
            </h2>
            <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-wide">
              AI-powered satellite overlays
            </p>
          </div>
        </div>

        {/* ACTIVE badge with emerald pulse */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border select-none"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            borderColor: "rgba(16, 185, 129, 0.35)",
            color: "#10B981",
            boxShadow: "0 0 12px rgba(16, 185, 129, 0.18)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              style={{ animation: "layerPulse 2s cubic-bezier(0,0,0.2,1) infinite" }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>ACTIVE</span>
        </div>
      </div>

      {/* ── SECTION 1: SATELLITE SOURCES ── */}
      <div className="relative z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => toggleSection("satellite")}
          className="w-full flex items-center justify-between text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <GlobalOutlined style={{ color: "#10B981" }} />
            Satellite Sources
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-normal">
            <span>3 Feeds</span>
            {collapsedSections.satellite ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.satellite && (
          <div className="flex flex-col gap-1.5 pt-0.5">
            {/* Sentinel-2 MSI */}
            <SatelliteSourceRow
              icon={<GlobalOutlined style={{ color: "#10B981" }} />}
              label="Sentinel-2 MSI"
              resChip="10m"
              active={satellite.sentinel2}
              onToggle={() => handleToggleSatellite("sentinel2")}
              accentColor="#10B981"
            />

            {/* Cartosat-3 PAN */}
            <SatelliteSourceRow
              icon={<RadarChartOutlined style={{ color: "#14B8A6" }} />}
              label="Cartosat-3 PAN"
              resChip="0.28m"
              active={satellite.cartosat3}
              onToggle={() => handleToggleSatellite("cartosat3")}
              accentColor="#14B8A6"
            />

            {/* PlanetScope RGB */}
            <SatelliteSourceRow
              icon={<CloudOutlined style={{ color: "#8B5CF6" }} />}
              label="PlanetScope RGB"
              resChip="3m"
              active={satellite.planetscope}
              onToggle={() => handleToggleSatellite("planetscope")}
              accentColor="#8B5CF6"
            />
          </div>
        )}
      </div>

      {/* ── SECTION 2: AI ANALYSIS LAYERS ── */}
      <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("ai")}
          className="w-full flex items-center justify-between text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <RadarChartOutlined style={{ color: "#EF4444" }} />
            AI Analysis
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-normal">
            <span>5 Models</span>
            {collapsedSections.ai ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.ai && (
          <div className="flex flex-col gap-1.5 pt-0.5">
            {/* Encroachment Heatmap */}
            <AiToggleRow
              label="Encroachment Heatmap"
              accentColor="#EF4444"
              active={aiAnalysis.encroachmentHeatmap}
              onToggle={() => handleToggleAi("encroachmentHeatmap")}
            />

            {/* NDVI Vegetation Loss */}
            <AiToggleRow
              label="NDVI Vegetation Loss"
              accentColor="#10B981"
              active={aiAnalysis.ndviVegetationLoss}
              onToggle={() => handleToggleAi("ndviVegetationLoss")}
            />

            {/* Change Detection */}
            <AiToggleRow
              label="Change Detection"
              accentColor="#14B8A6"
              active={aiAnalysis.changeDetection}
              onToggle={() => handleToggleAi("changeDetection")}
            />

            {/* Flood Risk Overlay */}
            <AiToggleRow
              label="Flood Risk Overlay"
              accentColor="#3B82F6"
              active={aiAnalysis.floodRiskOverlay}
              onToggle={() => handleToggleAi("floodRiskOverlay")}
            />

            {/* Illegal Construction */}
            <AiToggleRow
              label="Illegal Construction"
              accentColor="#F59E0B"
              active={aiAnalysis.illegalConstruction}
              onToggle={() => handleToggleAi("illegalConstruction")}
            />
          </div>
        )}
      </div>

      {/* ── SECTION 3: ADMINISTRATIVE LAYERS (CHECKBOXES) ── */}
      <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("admin")}
          className="w-full flex items-center justify-between text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <DatabaseOutlined style={{ color: "#10B981" }} />
            Administrative Layers
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-normal">
            <span>Cadastral</span>
            {collapsedSections.admin ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.admin && (
          <div className="grid grid-cols-1 gap-1.5 pt-0.5">
            <CheckboxRow
              icon={<BorderOutlined style={{ fontSize: 11 }} />}
              label="District Boundaries"
              checked={administrative.districtBoundaries}
              onToggle={() => handleToggleAdmin("districtBoundaries")}
            />
            <CheckboxRow
              icon={<EnvironmentOutlined style={{ fontSize: 11 }} />}
              label="Mouza Boundaries"
              checked={administrative.mouzaBoundaries}
              onToggle={() => handleToggleAdmin("mouzaBoundaries")}
            />
            <CheckboxRow
              icon={<InfoCircleOutlined style={{ fontSize: 11 }} />}
              label="JL Numbers"
              checked={administrative.jlNumbers}
              onToggle={() => handleToggleAdmin("jlNumbers")}
            />
            <CheckboxRow
              icon={<DatabaseOutlined style={{ fontSize: 11 }} />}
              label="Khatian Parcels"
              checked={administrative.khatianParcels}
              onToggle={() => handleToggleAdmin("khatianParcels")}
            />
            <CheckboxRow
              icon={<BorderOutlined style={{ fontSize: 11 }} />}
              label="Plot (Dag) Numbers"
              checked={administrative.plotNumbers}
              onToggle={() => handleToggleAdmin("plotNumbers")}
            />
          </div>
        )}
      </div>

      {/* ── SECTION 4: INFRASTRUCTURE LAYERS (CHECKBOXES) ── */}
      <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("infra")}
          className="w-full flex items-center justify-between text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <ApartmentOutlined style={{ color: "#14B8A6" }} />
            Infrastructure Layers
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-normal">
            <span>Corridors</span>
            {collapsedSections.infra ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.infra && (
          <div className="grid grid-cols-1 gap-1.5 pt-0.5">
            <CheckboxRow
              icon={<BranchesOutlined style={{ fontSize: 11 }} />}
              label="Metro Corridor"
              checked={infrastructure.metroCorridor}
              onToggle={() => handleToggleInfra("metroCorridor")}
            />
            <CheckboxRow
              icon={<BranchesOutlined style={{ fontSize: 11 }} />}
              label="Railway Alignment"
              checked={infrastructure.railwayAlignment}
              onToggle={() => handleToggleInfra("railwayAlignment")}
            />
            <CheckboxRow
              icon={<CarOutlined style={{ fontSize: 11 }} />}
              label="National Highways"
              checked={infrastructure.nationalHighways}
              onToggle={() => handleToggleInfra("nationalHighways")}
            />
            <CheckboxRow
              icon={<BranchesOutlined style={{ fontSize: 11 }} />}
              label="Rivers & Canals"
              checked={infrastructure.riversCanals}
              onToggle={() => handleToggleInfra("riversCanals")}
            />
            <CheckboxRow
              icon={<EnvironmentOutlined style={{ fontSize: 11 }} />}
              label="Forest Buffer Zones"
              checked={infrastructure.forestBufferZones}
              onToggle={() => handleToggleInfra("forestBufferZones")}
            />
          </div>
        )}
      </div>

      {/* ── OPACITY CONTROLS ── */}
      <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("opacity")}
          className="w-full flex items-center justify-between text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <SlidersOutlined style={{ color: "#10B981" }} />
            Opacity Controls
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            {collapsedSections.opacity ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.opacity && (
          <div className="flex flex-col gap-2.5 pt-1">
            <OpacitySliderRow
              label="Heatmap"
              value={opacity.heatmap}
              onChange={(val) => handleOpacityChange("heatmap", val)}
              color="#EF4444"
            />
            <OpacitySliderRow
              label="NDVI"
              value={opacity.ndvi}
              onChange={(val) => handleOpacityChange("ndvi", val)}
              color="#10B981"
            />
            <OpacitySliderRow
              label="Cadastre"
              value={opacity.cadastre}
              onChange={(val) => handleOpacityChange("cadastre", val)}
              color="#14B8A6"
            />
            <OpacitySliderRow
              label="Infrastructure"
              value={opacity.infrastructure}
              onChange={(val) => handleOpacityChange("infrastructure", val)}
              color="#8B5CF6"
            />
          </div>
        )}
      </div>

      {/* ── LEGEND CARD ── */}
      <div className="relative z-10 flex flex-col gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => toggleSection("legend")}
          className="w-full flex items-center justify-between text-[11px] font-mono font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Map Risk Legend</span>
          <span className="text-[10px] text-slate-400 font-normal">
            {collapsedSections.legend ? <DownOutlined /> : <UpOutlined />}
          </span>
        </button>

        {!collapsedSections.legend && (
          <div
            className="rounded-2xl p-3 border flex flex-col gap-2"
            style={{
              background: "rgba(15, 23, 42, 0.65)",
              borderColor: "rgba(51, 65, 85, 0.7)",
            }}
          >
            <LegendItem label="Critical" color="#EF4444" desc="Direct encroachment" />
            <LegendItem label="High" color="#F59E0B" desc="Boundary violation" />
            <LegendItem label="Moderate" color="#10B981" desc="Canopy loss" />
            <LegendItem label="Protected Zone" color="#8B5CF6" desc="Forest buffer" />
            <LegendItem label="Water Body" color="#3B82F6" desc="Hooghly buffer" />
          </div>
        )}
      </div>

      {/* ── FOOTER TELEMETRY ── */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-slate-400">Layers Active</span>
            <span className="text-emerald-400 font-bold text-xs mt-0.5">
              {activeCount} Layers Enabled
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col">
            <span className="text-slate-400">Raster Mosaics</span>
            <span className="text-teal-300 font-bold text-xs mt-0.5">142 Tiles Synced</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            CRS: <strong className="text-slate-200">EPSG:4326</strong>
          </span>
          <span>Last Sync • 20:35 IST</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Satellite Source Row with Resolution Chip and Switch
function SatelliteSourceRow({
  icon,
  label,
  resChip,
  active,
  onToggle,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  resChip: string;
  active: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  return (
    <div
      onClick={onToggle}
      className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
        active
          ? "bg-slate-900/80 border-slate-700 shadow-[0_0_12px_rgba(0,0,0,0.3)]"
          : "bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-80"
      }`}
    >
      <div className="flex items-center gap-2 truncate">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-semibold text-slate-200 truncate">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="text-[9.5px] font-mono px-1.5 py-0.5 rounded border"
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            borderColor: `${accentColor}40`,
            color: accentColor,
          }}
        >
          {resChip}
        </span>
        <CustomSwitch active={active} accentColor={accentColor} />
      </div>
    </div>
  );
}

// AI Analysis Toggle Row with Custom Accent Color
function AiToggleRow({
  label,
  accentColor,
  active,
  onToggle,
}: {
  label: string;
  accentColor: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
        active
          ? "bg-slate-900/80 border-slate-700"
          : "bg-slate-900/40 border-slate-800/60 opacity-60 hover:opacity-80"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: accentColor,
            boxShadow: active ? `0 0 8px ${accentColor}` : "none",
          }}
        />
        <span className="text-xs font-medium text-slate-200">{label}</span>
      </div>
      <CustomSwitch active={active} accentColor={accentColor} />
    </div>
  );
}

// Administrative / Infrastructure Checkbox Row
function CheckboxRow({
  icon,
  label,
  checked,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
        checked
          ? "text-slate-200 bg-slate-900/60 hover:bg-slate-900/80"
          : "text-slate-400 hover:text-slate-300 opacity-70"
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <span>{label}</span>
      </span>

      {/* Styled Custom Checkbox */}
      <div
        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
          checked
            ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "bg-slate-900 border-slate-700 text-transparent"
        }`}
      >
        <CheckOutlined style={{ fontSize: 9 }} />
      </div>
    </div>
  );
}

// Opacity Slider Row
function OpacitySliderRow({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300 font-medium text-[11px]">{label}</span>
        <span className="font-mono font-bold text-[11px]" style={{ color }}>
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="layer-slider w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-800"
        style={{
          accentColor: color,
        }}
      />
    </div>
  );
}

// Legend Item Row
function LegendItem({
  label,
  color,
  desc,
}: {
  label: string;
  color: string;
  desc: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
        <span className="text-slate-200 font-medium text-[11px]">{label}</span>
      </div>
      <span className="text-[10px] font-mono text-slate-400">{desc}</span>
    </div>
  );
}

// Custom Switch Component
function CustomSwitch({
  active,
  accentColor,
}: {
  active: boolean;
  accentColor: string;
}) {
  return (
    <div
      className="w-8 h-4.5 rounded-full p-0.5 flex items-center transition-all cursor-pointer"
      style={{
        backgroundColor: active ? accentColor : "#1E293B",
        boxShadow: active ? `0 0 10px ${accentColor}66` : "none",
      }}
    >
      <div
        className={`w-3.5 h-3.5 rounded-full bg-white transition-all transform ${
          active ? "translate-x-3.5" : "translate-x-0"
        }`}
      />
    </div>
  );
}