import AIUploadPanel from "../components/ai/AIUploadPanel";
import DetectionViewer from "../components/ai/DetectionViewer";
import DetectionReport from "../components/ai/DetectionReport";

export default function AIDetection() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-emerald-400">
        AI Detection Command Center
      </h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <AIUploadPanel />
        </div>

        <div className="col-span-6">
          <DetectionViewer />
        </div>

        <div className="col-span-3">
          <DetectionReport />
        </div>
      </div>
    </div>
  );
}