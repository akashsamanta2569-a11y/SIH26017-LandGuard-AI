import { useState, useEffect } from "react";
import { addAlert } from "../utils/alertStore";
import { useLocation } from "react-router-dom";
import DetectionHero from "../components/detection/DetectionHero";
import DetectionViewer from "../components/detection/DetectionViewer";
import DetectionProgress from "../components/detection/DetectionProgress";
import DetectionMetrics from "../components/detection/DetectionMetrics";
import AIUploadPanel, { type DemoPreset } from "../components/ai/AIUploadPanel";
import NDVIAnalysisPanel from "../components/detection/NDVIAnalysisPanel";
import CadastreVerificationPanel from "../components/detection/CadastreVerificationPanel";
import DetectionReport from "../components/ai/DetectionReport";
import ExportReportPanel from "../components/detection/ExportReportPanel";

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
  if (lower.includes("24") || lower.includes("sundarban") || lower.includes("south"))
    return "/mock/s24_after.jpg";
  if (lower.includes("kolkata")) return "/mock/kolkata_after.jpg";
  if (lower.includes("bardhaman") || lower.includes("paschim"))
    return "/mock/bardhaman_after.jpg";
  if (
    lower.includes("darjeeling") ||
    lower.includes("kalimpong") ||
    lower.includes("jalpaiguri")
  )
    return "/mock/darjeeling_after.jpg";
  return "/mock/howrah_after.jpg";
}

export default function Prediction() {
  const location = useLocation();

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("landguard-theme") as "dark" | "light") ?? "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("theme-light");
    } else {
      root.classList.remove("theme-light");
    }
    localStorage.setItem("landguard-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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

  const [imageUrl, setImageUrl] = useState(() => {
    if (detectionData?.district) {
      return detectionData.imageUrl || getMockAfterImage(detectionData.district);
    }
    return "/mock/howrah_after.jpg";
  });
  const [isScanning, setIsScanning] = useState(() => Boolean(detectionData?.autoLoad));
  const [completed, setCompleted] = useState(false);

  const [result, setResult] = useState(() => ({
    district: detectionData?.district ?? "Howrah",
    confidence: detectionData?.confidence ?? 94,
    vegetationLoss: detectionData?.vegetationLoss ?? -12.8,
    affectedArea: detectionData?.affectedArea ?? 18.6,
    riskScore: detectionData?.riskScore ?? 91,
  }));

  const [prevDetectionData, setPrevDetectionData] = useState(detectionData);

  if (detectionData !== prevDetectionData) {
    setPrevDetectionData(detectionData);
    if (detectionData?.district) {
      const districtName = detectionData.district;
      setImageUrl(detectionData.imageUrl || getMockAfterImage(districtName));
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
    }
  }

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setCompleted(false);
  };

  const handleDistrictChange = (newDistrict: string) => {
    const newImg = getMockAfterImage(newDistrict);
    setImageUrl(newImg);
    setCompleted(false);
    setResult((prev) => ({
      ...prev,
      district: newDistrict,
      confidence: 93,
      vegetationLoss: -14.2,
      affectedArea: 16.4,
      riskScore: 89,
    }));
  };

  const handleSelectPreset = (sample: DemoPreset) => {
    setImageUrl(sample.url);
    setCompleted(false);
    setResult({
      district: sample.district,
      confidence: sample.confidence ?? 94,
      vegetationLoss: sample.vegetationLoss ?? -12.8,
      affectedArea: sample.affectedArea ?? 18.6,
      riskScore: sample.riskScore ?? 91,
    });
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

  return (
    <div
      id="landguard-report"
      className="min-h-screen bg-[#050C18] text-white print:bg-white print:text-black w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* 1. Command Center Hero Banner */}
      <DetectionHero
        theme={theme}
        onThemeToggle={toggleTheme}
        district={result.district}
        onDistrictChange={handleDistrictChange}
        completed={completed}
        isScanning={isScanning}
      />

      {/* 2. Main 3-Column Satellite Intelligence Investigation Workstation */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Government Satellite Upload Station */}
        <div className="xl:col-span-3 space-y-6">
          <AIUploadPanel
            uploadedImage={imageUrl}
            onImageUpload={handleImageUpload}
            onRunDetection={runDetection}
            isScanning={isScanning}
            theme={theme}
            selectedPreset={imageUrl}
            onSelectPreset={handleSelectPreset}
          />
        </div>

        {/* Center Column: Detection Viewer, 8-Stage Progress, NDVI & Cadastre Panels */}
        <div className="xl:col-span-5 space-y-6">
          {/* Satellite Multi-Spectral Viewer */}
          <DetectionViewer
            imageUrl={imageUrl}
            isScanning={isScanning}
            completed={completed}
          />

          {/* 8-Stage Pipeline Investigation Timeline */}
          {isScanning && (
            <DetectionProgress
              isRunning={isScanning}
              onComplete={handleDetectionComplete}
              theme={theme}
            />
          )}

          {/* NDVI Vegetation Dynamics Panel */}
          <NDVIAnalysisPanel
            district={result.district}
            vegetationLoss={result.vegetationLoss}
            completed={completed}
            isScanning={isScanning}
            theme={theme}
          />

          {/* DoLR / LRO Cadastre Parcel Intersect Panel */}
          <CadastreVerificationPanel
            district={result.district}
            affectedArea={result.affectedArea}
            completed={completed}
            theme={theme}
          />
        </div>

        {/* Right Column: Metrics, Live Intelligence Sidebar & Statutory Export Station */}
        <div className="xl:col-span-4 space-y-6">
          {/* Core Detection Metrics Breakdown */}
          <DetectionMetrics
            district={result.district}
            confidence={result.confidence}
            vegetationLoss={Math.abs(result.vegetationLoss)}
            affectedArea={result.affectedArea}
            riskScore={result.riskScore}
            completed={completed}
          />

          {/* Live Intelligence Sidebar with Administrative Directives */}
          <DetectionReport
            detectionDone={completed}
            isScanning={isScanning}
            district={result.district}
            risk={result.riskScore}
            cases={`${result.affectedArea} Ha`}
            threat={`High risk unauthorized clearance and land use conversion detected in ${result.district}. Potential statutory violation under Section 11 & Section 38 of RFCTLARR Act 2013.`}
            vegetationLoss={result.vegetationLoss}
            confidence={result.confidence}
            theme={theme}
            onDispatchNotice={() => {
              addAlert({
                id: `NOTICE-${Date.now()}`,
                district: result.district,
                confidence: result.confidence,
                vegetationLoss: result.vegetationLoss,
                affectedArea: result.affectedArea,
                riskScore: result.riskScore,
                timestamp: new Date().toLocaleString(),
                status: "NEW",
                severity: "CRITICAL",
              });
            }}
          />

          {/* Government Certified Investigation Dossier Export */}
          <ExportReportPanel
            district={result.district}
            confidence={result.confidence}
            vegetationLoss={result.vegetationLoss}
            affectedArea={result.affectedArea}
            riskScore={result.riskScore}
            completed={completed}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}