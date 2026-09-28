import { useState } from "react";
import { useLocation } from "react-router-dom";
import AIUploadPanel from "../components/ai/AIUploadPanel";
import DetectionViewer from "../components/ai/DetectionViewer";
import DetectionReport from "../components/ai/DetectionReport";

export default function AIDetection() {
  const location = useLocation();

  const districtData = location.state || {};

  const district = districtData.district || "South 24 Parganas";
  const risk = districtData.risk || 97;
  const cases = districtData.cases || "14.7 Ha";
  const threat =
    districtData.threat ||
    "Illegal mangrove clearing detected with AI confidence.";

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectionDone, setDetectionDone] = useState(false);

  const runDetection = () => {
    if (!uploadedImage) {
      alert("Please upload a satellite image first.");
      return;
    }

    setIsScanning(true);
    setDetectionDone(false);

    // Fake AI scan (3 seconds)
    setTimeout(() => {
      setIsScanning(false);
      setDetectionDone(true);
    }, 3000);
  };

  return (
    <div
      id="landguard-report"
      className="min-h-screen bg-[#050C18] text-white print:bg-white print:text-black w-full max-w-[1600px] mx-auto px-6 py-6"
    >
      <h1 className="text-4xl font-black text-emerald-400 mb-6">
        AI Detection Command Center
      </h1>

      <div className="grid grid-cols-12 gap-5 items-start">
        <div className="col-span-3">
          <AIUploadPanel
            uploadedImage={uploadedImage}
            onImageUpload={setUploadedImage}
            onRunDetection={runDetection}
            isScanning={isScanning}
          />
        </div>

        <div className="col-span-6">
          <DetectionViewer
            image={uploadedImage}
            isScanning={isScanning}
            detectionDone={detectionDone}
            district={district}
          />
        </div>

        <div className="col-span-3">
          <DetectionReport
            detectionDone={detectionDone}
            isScanning={isScanning}
            district={district}
            risk={risk}
            cases={cases}
            threat={threat}
          />
        </div>
      </div>
    </div>
  );
}