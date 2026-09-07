import { useState, useEffect, type ChangeEvent } from "react";
import { addAlert } from "../utils/alertStore";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UploadCloud,
  Sparkles,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import DetectionViewer from "../components/detection/DetectionViewer";
import DetectionProgress from "../components/detection/DetectionProgress";
import DetectionMetrics from "../components/detection/DetectionMetrics";

const SAMPLE_AOI_IMAGES = [
  {
    name: "Howrah Sector 4",
    district: "Howrah",
    confidence: 94,
    vegetationLoss: -12.8,
    affectedArea: 18.6,
    riskScore: 91,
    url: "/mock/howrah_after.jpg",
  },
  {
    name: "Sundarbans Delta",
    district: "South 24 Parganas",
    confidence: 97,
    vegetationLoss: -18.4,
    affectedArea: 24.2,
    riskScore: 96,
    url: "/mock/s24_after.jpg",
  },
  {
    name: "Kolkata Riverside",
    district: "Kolkata",
    confidence: 92,
    vegetationLoss: -9.4,
    affectedArea: 14.8,
    riskScore: 86,
    url: "/mock/kolkata_after.jpg",
  },
  {
    name: "Paschim Bardhaman Mine Belt",
    district: "Paschim Bardhaman",
    confidence: 95,
    vegetationLoss: -15.3,
    affectedArea: 12.8,
    riskScore: 84,
    url: "/mock/bardhaman_after.jpg",
  },
  {
    name: "Darjeeling Forest Edge",
    district: "Darjeeling",
    confidence: 90,
    vegetationLoss: -8.5,
    affectedArea: 10.2,
    riskScore: 76,
    url: "/mock/darjeeling_after.jpg",
  },
];

const DISTRICT_MOCK_MAP: Record<string, string> = {
  Howrah: "/mock/howrah_after.jpg",
  "South 24 Parganas": "/mock/s24_after.jpg",
  Kolkata: "/mock/kolkata_after.jpg",
  "Paschim Bardhaman": "/mock/bardhaman_after.jpg",
  Darjeeling: "/mock/darjeeling_after.jpg",
};

function getMockAfterImage(districtName: string): string {
  if (DISTRICT_MOCK_MAP[districtName]) {
    return DISTRICT_MOCK_MAP[districtName];
  }
  const lower = districtName.toLowerCase();
  if (lower.includes("howrah")) return "/mock/howrah_after.jpg";
  if (lower.includes("24") || lower.includes("sundarban") || lower.includes("south")) return "/mock/s24_after.jpg";
  if (lower.includes("kolkata")) return "/mock/kolkata_after.jpg";
  if (lower.includes("bardhaman") || lower.includes("paschim")) return "/mock/bardhaman_after.jpg";
  if (lower.includes("darjeeling") || lower.includes("kalimpong") || lower.includes("jalpaiguri")) return "/mock/darjeeling_after.jpg";
  return "/mock/howrah_after.jpg";
}

export default function Prediction() {
  const navigate = useNavigate();
  const location = useLocation();

  const detectionData = location.state as
    | {
      district?: string;
      imageUrl?: string;
      confidence?: number;
      vegetationLoss?: number;
      affectedArea?: number;
      riskScore?: number;
      autoLoad?: boolean;
    }
    | undefined;

  const [imageUrl, setImageUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [result, setResult] = useState({
    district: "Howrah",
    confidence: 94,
    vegetationLoss: -12.8,
    affectedArea: 18.6,
    riskScore: 91,
  });

  useEffect(() => {
    if (!detectionData?.district) return;

    const districtName = detectionData.district;
    const loadedImage = detectionData.imageUrl || getMockAfterImage(districtName);

    setImageUrl(loadedImage);

    setResult({
      district: districtName,
      confidence: detectionData.confidence ?? 94,
      vegetationLoss: detectionData.vegetationLoss ?? -12.8,
      affectedArea: detectionData.affectedArea ?? 18.6,
      riskScore: detectionData.riskScore ?? 91,
    });

    setCompleted(false);

    if (detectionData.autoLoad) {
      setIsScanning(true);
    }
  }, [detectionData]);

  const handleImageUpload = (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setCompleted(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const runDetection = () => {
    if (!imageUrl) return;

    setCompleted(false);
    setIsScanning(true);
  };

  const handleDetectionComplete = () => {
    setIsScanning(false);
    setCompleted(true);

    addAlert({
      id: Date.now().toString(),
      district: result.district,
      confidence: result.confidence,
      vegetationLoss: result.vegetationLoss,
      affectedArea: result.affectedArea,
      riskScore: result.riskScore,
      timestamp: new Date().toLocaleString(),
      status: "NEW",
    });
  };
  const handleSelectPreset = (sample: typeof SAMPLE_AOI_IMAGES[0]) => {
    setImageUrl(sample.url);
    setCompleted(false);
    setResult({
      district: sample.district,
      confidence: sample.confidence,
      vegetationLoss: sample.vegetationLoss,
      affectedArea: sample.affectedArea,
      riskScore: sample.riskScore,
    });
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              LandGuard Neural Core
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              YOLOv8 + Sentinel-2 MSI
            </span>
          </div>
          <h1 className="mt-2 text-3xl lg:text-4xl font-black tracking-tight text-white">
            AI Encroachment Prediction
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Autonomous multi-spectral satellite ingestion and deforestation boundary detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-slate-950/70 px-4 py-2 text-xs font-mono text-emerald-400">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            Target: <span className="font-bold text-white">{result.district}</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column AI Detection Flow */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload Station Card */}
        <div className="xl:col-span-3 space-y-4">
          <div className="rounded-3xl border border-emerald-500/20 bg-slate-950/80 p-5 shadow-xl backdrop-blur-xl space-y-5">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400">
                Upload Station
              </p>
              <h2 className="text-xl font-bold text-white mt-1">
                Satellite Intelligence
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload Sentinel-2, Cartosat-3 or Drone imagery for AI detection.
              </p>
            </div>

            {/* Drop / Browse Area */}
            <label className="group relative block cursor-pointer rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-6 text-center hover:border-emerald-400 hover:bg-emerald-500/10 transition">
              <UploadCloud className="mx-auto h-8 w-8 text-emerald-400 transition-transform group-hover:scale-110" />
              <p className="mt-2 text-sm font-semibold text-emerald-300">
                Browse Satellite Image
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                PNG • JPG • TIFF • GeoTIFF
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
                disabled={isScanning}
              />
            </label>

            {/* Thumbnail Preview */}
            {imageUrl && (
              <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-900">
                <img
                  src={imageUrl}
                  alt="Satellite Preview"
                  className="h-28 w-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" /> AOI Staged
                  </span>
                  <span>Ready</span>
                </div>
              </div>
            )}

            {/* Quick Demo Presets */}
            <div>
              <p className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Or Select Demo Satellite AOI:
              </p>
              <div className="space-y-2">
                {SAMPLE_AOI_IMAGES.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => handleSelectPreset(sample)}
                    disabled={isScanning}
                    className={`w-full text-left rounded-xl border p-2.5 transition text-xs flex items-center justify-between ${imageUrl === sample.url
                      ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-emerald-500/40 hover:text-slate-200"
                      }`}
                  >
                    <span>{sample.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {sample.district}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Run AI Detection Button */}
            <button
              type="button"
              onClick={runDetection}
              disabled={!imageUrl || isScanning}
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isScanning ? "Analyzing..." : "Run AI Detection"}
            </button>
          </div>
        </div>

        {/* Center Column: Detection Viewer & Detection Progress */}
        <div className="xl:col-span-5 space-y-4">
          <DetectionViewer
            imageUrl={imageUrl}
            isScanning={isScanning}
            completed={completed}
          />

          {isScanning && (
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-5 shadow-[0_0_30px_rgba(16,185,129,0.18)] backdrop-blur-xl">

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5" />

              {/* Moving Scan Line */}
              <div className="absolute left-0 right-0 top-0 h-1 animate-[scan-line_2s_linear_infinite] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

              <div className="relative z-10 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
                    AI Detection Engine
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    Analyzing Sentinel-2 Satellite Imagery...
                  </h3>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-emerald-300">LIVE SCAN</span>
                </div>
              </div>

              <DetectionProgress
                isRunning={isScanning}
                onComplete={handleDetectionComplete}
              />
            </div>
          )}
        </div>

        {/* Right Column: Detection Metrics & Timeline Navigation */}
        <div className="xl:col-span-4 space-y-4">
          <DetectionMetrics
            district={result.district}
            confidence={result.confidence}
            vegetationLoss={Math.abs(result.vegetationLoss)}
            affectedArea={result.affectedArea}
            riskScore={result.riskScore}
            completed={completed}
          />

          {/* View Change Timeline Button */}
          <button
            type="button"
            disabled={!completed}
            onClick={() =>
              completed &&
              navigate("/history", {
                state: {
                  district: result.district,
                  confidence: result.confidence,
                  vegetationLoss: result.vegetationLoss,
                  affectedArea: result.affectedArea,
                  riskScore: result.riskScore,
                },
              })
            }
            className={`w-full rounded-xl py-3 font-semibold transition-all duration-300
    ${completed
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-70"
              }`}
          >
            View Change Timeline
          </button>
        </div>
      </div>
    </div>
  );
}