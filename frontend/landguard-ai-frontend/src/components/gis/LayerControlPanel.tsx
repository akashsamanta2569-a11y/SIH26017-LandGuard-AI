import { useState } from "react";
import {
  AppstoreOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  BranchesOutlined,
  SlidersOutlined,
} from "@ant-design/icons";

// ─── Exported State Interfaces (100% Preserved) ───────────────────────────────

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
  theme?: "dark" | "light";
}

export default function LayerControlPanel({
  initialConfig,
  onLayersChange,
  theme = "light",
}: LayerControlPanelProps) {
  const isDark = theme === "dark";

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

  return (
    <div
      className="w-full rounded-2xl border p-5 sm:p-6 transition-all duration-200"
      style={{
        backgroundColor: isDark ? "#111C2E" : "#FFFFFF",
        borderColor: isDark ? "#1E293B" : "#E2E8F0",
        boxShadow: isDark
          ? "0 4px 6px -1px rgba(0,0,0,0.3)"
          : "0 1px 3px 0 rgba(0,0,0,0.05)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between pb-4 border-b gap-3 flex-wrap"
        style={{ borderColor: isDark ? "#1E293B" : "#F1F5F9" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
            <AppstoreOutlined className="text-teal-700 dark:text-teal-300" style={{ fontSize: 16 }} />
          </div>
          <div>
            <h2
              className="text-sm font-bold tracking-tight leading-none"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              GIS Spatial Layer Control
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Select active raster feeds, vector overlays, and cadastral boundaries
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800">
          PostGIS + Leaflet Active
        </span>
      </div>

      {/* ── 4 Category Columns (Checkboxes) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Category 1: Satellite Feeds */}
        <div
          className="rounded-xl p-4 border flex flex-col gap-2.5"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <GlobalOutlined className="text-teal-600 text-xs" />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              Satellite Feeds
            </h3>
          </div>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={satellite.sentinel2}
              onChange={() => handleToggleSatellite("sentinel2")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Sentinel-2 MSI (10m)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={satellite.cartosat3}
              onChange={() => handleToggleSatellite("cartosat3")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">ISRO Cartosat-3 (0.28m)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={satellite.planetscope}
              onChange={() => handleToggleSatellite("planetscope")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">PlanetScope Daily (3m)</span>
          </label>
        </div>

        {/* Category 2: AI Analytics */}
        <div
          className="rounded-xl p-4 border flex flex-col gap-2.5"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <AppstoreOutlined className="text-red-600 text-xs" />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              AI Detection Layers
            </h3>
          </div>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={aiAnalysis.encroachmentHeatmap}
              onChange={() => handleToggleAi("encroachmentHeatmap")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Encroachment Heatmap</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={aiAnalysis.ndviVegetationLoss}
              onChange={() => handleToggleAi("ndviVegetationLoss")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">NDVI Vegetation Loss</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={aiAnalysis.changeDetection}
              onChange={() => handleToggleAi("changeDetection")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Bi-Temporal Changes</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={aiAnalysis.illegalConstruction}
              onChange={() => handleToggleAi("illegalConstruction")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">YOLOv8 Structures</span>
          </label>
        </div>

        {/* Category 3: Administrative Cadastre */}
        <div
          className="rounded-xl p-4 border flex flex-col gap-2.5"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <DatabaseOutlined className="text-blue-600 text-xs" />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              Administrative Cadastre
            </h3>
          </div>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={administrative.districtBoundaries}
              onChange={() => handleToggleAdmin("districtBoundaries")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">District Boundaries</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={administrative.mouzaBoundaries}
              onChange={() => handleToggleAdmin("mouzaBoundaries")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Mouza Boundaries</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={administrative.khatianParcels}
              onChange={() => handleToggleAdmin("khatianParcels")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Khatian / Dag Plots</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={administrative.jlNumbers}
              onChange={() => handleToggleAdmin("jlNumbers")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">JL Numbers Overlay</span>
          </label>
        </div>

        {/* Category 4: Infrastructure Corridors */}
        <div
          className="rounded-xl p-4 border flex flex-col gap-2.5"
          style={{
            backgroundColor: isDark ? "#0E1726" : "#FAFAFA",
            borderColor: isDark ? "#1E293B" : "#E2E8F0",
          }}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <BranchesOutlined className="text-amber-600 text-xs" />
            <h3
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              Infrastructure Corridors
            </h3>
          </div>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={infrastructure.nationalHighways}
              onChange={() => handleToggleInfra("nationalHighways")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">National Highways (NH-12/14)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={infrastructure.railwayAlignment}
              onChange={() => handleToggleInfra("railwayAlignment")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Dedicated Freight Corridor</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={infrastructure.metroCorridor}
              onChange={() => handleToggleInfra("metroCorridor")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Kolkata Metro Lines</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={infrastructure.riversCanals}
              onChange={() => handleToggleInfra("riversCanals")}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
            />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Hooghly / Canals Buffer</span>
          </label>
        </div>
      </div>

      {/* ── Opacity Controls Bar ── */}
      <div
        className="mt-5 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        style={{ borderColor: isDark ? "#1E293B" : "#F1F5F9" }}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <SlidersOutlined style={{ fontSize: 11 }} /> Heatmap Opacity
            </span>
            <span className="font-semibold text-teal-700 dark:text-teal-400">{opacity.heatmap}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity.heatmap}
            onChange={(e) => handleOpacityChange("heatmap", Number(e.target.value))}
            className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <SlidersOutlined style={{ fontSize: 11 }} /> NDVI Opacity
            </span>
            <span className="font-semibold text-teal-700 dark:text-teal-400">{opacity.ndvi}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity.ndvi}
            onChange={(e) => handleOpacityChange("ndvi", Number(e.target.value))}
            className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <SlidersOutlined style={{ fontSize: 11 }} /> Cadastre Opacity
            </span>
            <span className="font-semibold text-teal-700 dark:text-teal-400">{opacity.cadastre}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity.cadastre}
            onChange={(e) => handleOpacityChange("cadastre", Number(e.target.value))}
            className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
              <SlidersOutlined style={{ fontSize: 11 }} /> Infra Alignment
            </span>
            <span className="font-semibold text-teal-700 dark:text-teal-400">{opacity.infrastructure}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity.infrastructure}
            onChange={(e) => handleOpacityChange("infrastructure", Number(e.target.value))}
            className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}