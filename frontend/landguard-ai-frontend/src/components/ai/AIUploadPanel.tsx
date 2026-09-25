import { useState, type ChangeEvent } from "react";
import {
  UploadCloud,
  Satellite,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Layers,
  Sliders,
  FileCheck,
  Info,
} from "lucide-react";

export interface DemoPreset {
  name: string;
  district: string;
  url: string;
  confidence?: number;
  vegetationLoss?: number;
  affectedArea?: number;
  riskScore?: number;
  sensor?: string;
}

export type AIUploadPanelProps = {
  uploadedImage: string | null;
  onImageUpload: (image: string) => void;
  onRunDetection: () => void;
  isScanning: boolean;
  // Optional enhancements for full workstation usage
  theme?: "dark" | "light";
  selectedPreset?: string;
  onSelectPreset?: (preset: DemoPreset) => void;
  selectedSensor?: string;
  onSensorChange?: (sensor: string) => void;
};

const DEFAULT_PRESETS: DemoPreset[] = [
  {
    name: "Howrah Sector 4 - Riverfront",
    district: "Howrah",
    confidence: 94,
    vegetationLoss: -12.8,
    affectedArea: 18.6,
    riskScore: 91,
    url: "/mock/howrah_after.jpg",
    sensor: "Sentinel-2 MSI",
  },
  {
    name: "Sundarbans Delta - Forest Fringe",
    district: "South 24 Parganas",
    confidence: 97,
    vegetationLoss: -18.4,
    affectedArea: 24.2,
    riskScore: 96,
    url: "/mock/s24_after.jpg",
    sensor: "Sentinel-2 MSI",
  },
  {
    name: "Kolkata Riverside - Industrial Belt",
    district: "Kolkata",
    confidence: 92,
    vegetationLoss: -9.4,
    affectedArea: 14.8,
    riskScore: 86,
    url: "/mock/kolkata_after.jpg",
    sensor: "Cartosat-3 PAN",
  },
  {
    name: "Paschim Bardhaman - Coalfield Zone",
    district: "Paschim Bardhaman",
    confidence: 95,
    vegetationLoss: -15.3,
    affectedArea: 12.8,
    riskScore: 84,
    url: "/mock/bardhaman_after.jpg",
    sensor: "Sentinel-2 MSI",
  },
  {
    name: "Darjeeling - Tea Estate Slope",
    district: "Darjeeling",
    confidence: 90,
    vegetationLoss: -8.5,
    affectedArea: 10.2,
    riskScore: 76,
    url: "/mock/darjeeling_after.jpg",
    sensor: "Cartosat-3 PAN",
  },
];

const SENSORS = [
  { id: "sentinel-2", name: "Sentinel-2 MSI", res: "10m Multispectral", bands: "B02-B08" },
  { id: "cartosat-3", name: "Cartosat-3 PAN", res: "0.28m High-Res", bands: "Panchromatic" },
  { id: "drone-uav", name: "Drone UAV Ortho", res: "5cm Sub-decimeter", bands: "RGB+NIR" },
];

export default function AIUploadPanel({
  uploadedImage,
  onImageUpload,
  onRunDetection,
  isScanning,
  theme = "dark",
  selectedPreset,
  onSelectPreset,
  selectedSensor: propSensor,
  onSensorChange,
}: AIUploadPanelProps) {
  const [internalSensor, setInternalSensor] = useState("sentinel-2");
  const [cloudTolerance, setCloudTolerance] = useState(10);
  const [dragOver, setDragOver] = useState(false);

  const activeSensor = propSensor || internalSensor;

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    onImageUpload(imageUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  };

  const isDark = theme === "dark";
  const bgCard = isDark ? "rgba(10,18,28,0.92)" : "rgba(255,255,255,0.95)";
  const borderCard = isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.25)";
  const textTitle = isDark ? "#ffffff" : "#0f172a";
  const textSub = isDark ? "#94a3b8" : "#64748b";
  const boxBg = isDark ? "rgba(15,23,42,0.6)" : "rgba(241,245,249,0.8)";

  return (
    <div
      className="rounded-3xl p-5 space-y-5 transition-all duration-300"
      style={{
        background: bgCard,
        border: `1px solid ${borderCard}`,
        boxShadow: isDark
          ? "0 10px 30px -10px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.05)"
          : "0 10px 30px -10px rgba(0,0,0,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-emerald-400">
            <Satellite className="h-3 w-3" />
            Upload Station
          </span>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(16,185,129,0.12)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            NIC-STATION #04
          </span>
        </div>

        <h2 className="text-lg font-extrabold tracking-tight mt-1.5" style={{ color: textTitle }}>
          Satellite Ingestion Terminal
        </h2>

        <p className="text-xs mt-1" style={{ color: textSub }}>
          Ingest Sentinel-2 MSI, Cartosat-3 or Drone UAV imagery for automated encroachment boundary inference.
        </p>
      </div>

      {/* Sensor Selection Grid */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase tracking-wider font-semibold flex items-center justify-between" style={{ color: textSub }}>
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3 text-emerald-400" /> Sensor Feed
          </span>
          <span className="text-[10px] text-emerald-400 font-normal">Level-2A BOA</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {SENSORS.map((s) => {
            const isSelected = activeSensor === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setInternalSensor(s.id);
                  onSensorChange?.(s.id);
                }}
                disabled={isScanning}
                className="p-2 rounded-xl text-left border transition-all duration-200"
                style={{
                  background: isSelected ? "rgba(16,185,129,0.15)" : boxBg,
                  borderColor: isSelected ? "#10b981" : isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.9)",
                }}
              >
                <p className="text-[11px] font-bold truncate" style={{ color: isSelected ? "#10b981" : textTitle }}>
                  {s.name}
                </p>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">{s.res}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`group relative block cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 ${isScanning ? "opacity-60 cursor-not-allowed" : ""
          }`}
        style={{
          background: dragOver ? "rgba(16,185,129,0.12)" : isDark ? "rgba(16,185,129,0.03)" : "rgba(16,185,129,0.04)",
          borderColor: dragOver ? "#10b981" : isDark ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.35)",
        }}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-emerald-400 transition-transform group-hover:scale-110 duration-200" />
        <p className="mt-2 text-xs font-bold text-emerald-400">
          Upload Satellite Scene / GeoTIFF
        </p>
        <p className="mt-1 text-[10px] font-mono text-slate-400">
          Drop TIFF, GeoTIFF, JP2, PNG, JPG (Max 50MB)
        </p>
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-emerald-400/80">
          <FileCheck className="h-3 w-3" />
          <span>WGS84 / UTM Zone 45N Supported</span>
        </div>

        <input
          type="file"
          accept="image/*,.tif,.tiff"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isScanning}
        />
      </label>

      {/* Satellite Imagery Preview */}
      {uploadedImage && (
        <div
          className="relative overflow-hidden rounded-2xl border transition-all"
          style={{
            borderColor: "rgba(16,185,129,0.35)",
            background: isDark ? "#090d16" : "#f8fafc",
          }}
        >
          <img
            src={uploadedImage}
            alt="Ingested Satellite Scene"
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
            <span>AOI Loaded · Ready</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3 text-emerald-400" /> Multispectral Bands (B2-B8)
            </span>
            <span className="text-white/80">1024 x 1024 px</span>
          </div>
        </div>
      )}

      {/* Cloud Masking Tolerance Slider */}
      <div className="space-y-1.5 p-3 rounded-xl border" style={{ background: boxBg, borderColor: isDark ? "rgba(51,65,85,0.6)" : "rgba(226,232,240,0.8)" }}>
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <Sliders className="h-3 w-3 text-emerald-400" /> Cloud Masking Threshold
          </span>
          <span className="font-bold text-emerald-400">{cloudTolerance}% Max</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          value={cloudTolerance}
          onChange={(e) => setCloudTolerance(Number(e.target.value))}
          disabled={isScanning}
          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
        />
        <div className="flex justify-between text-[9px] font-mono text-slate-500">
          <span>0% (Cloud-free)</span>
          <span>ESA S2Cor Mask</span>
          <span>30% (High haze)</span>
        </div>
      </div>

      {/* Demo AOI Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400">
            Official Demo AOI Presets:
          </p>
          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
            <Info className="h-2.5 w-2.5" /> SIH26017 Verified
          </span>
        </div>

        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {DEFAULT_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.url || uploadedImage === preset.url;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  onImageUpload(preset.url);
                  onSelectPreset?.(preset);
                }}
                disabled={isScanning}
                className="w-full text-left rounded-xl border p-2.5 transition-all text-xs flex items-center justify-between group"
                style={{
                  background: isSelected ? "rgba(16,185,129,0.14)" : boxBg,
                  borderColor: isSelected ? "#10b981" : isDark ? "rgba(51,65,85,0.7)" : "rgba(226,232,240,0.8)",
                }}
              >
                <div className="truncate mr-2">
                  <p
                    className="font-medium truncate text-xs"
                    style={{ color: isSelected ? "#10b981" : textTitle }}
                  >
                    {preset.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {preset.district} · {preset.sensor || "Sentinel-2"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background: isSelected ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.12)",
                      color: isSelected ? "#10b981" : "#ef4444",
                    }}
                  >
                    {preset.riskScore}% Risk
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Run AI Detection Trigger Button */}
      <button
        type="button"
        onClick={onRunDetection}
        disabled={!uploadedImage || isScanning}
        className="w-full relative overflow-hidden rounded-2xl py-3.5 font-bold text-sm tracking-wide transition-all duration-300 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
        style={{
          background: isScanning
            ? "rgba(16,185,129,0.25)"
            : uploadedImage
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : isDark
                ? "rgba(30,41,59,0.8)"
                : "rgba(203,213,225,0.8)",
          color: uploadedImage && !isScanning ? "#ffffff" : isDark ? "#64748b" : "#94a3b8",
          boxShadow: uploadedImage && !isScanning ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
        }}
      >
        {isScanning ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <span className="text-emerald-400 font-mono text-xs">
              AI Pipeline Executing...
            </span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-emerald-200" />
            <span>Run Multi-Spectral AI Detection</span>
          </>
        )}
      </button>
    </div>
  );
}