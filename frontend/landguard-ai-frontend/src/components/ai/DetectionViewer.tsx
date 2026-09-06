
type DetectionViewerProps = {
  image: string | null;
  isScanning: boolean;
  detectionDone: boolean;
  district: string;
};

const districtImages: Record<string, string> = {
  Howrah: "/mock/howrah.jpg",
  Kolkata: "/mock/kolkata.jpg",
  "South 24 Parganas": "/mock/s24pgs.jpg",
  Darjeeling: "/mock/darjeeling.jpg",
  "Paschim Bardhaman": "/mock/bardhaman.jpg",
};

export default function DetectionViewer({
  image,
  isScanning,
  detectionDone,
  district,
}: DetectionViewerProps) {
  
  const displayImage =
    image || districtImages[district] || "/mock/default-satellite.jpg";

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-slate-950/70 overflow-hidden relative">
      {displayImage ? (
        <div className="relative w-full h-[430px]">
          <img
            src={displayImage}
            alt="Satellite"
            className="w-full h-full object-cover rounded-2xl"
          />
          
          {/* Scanning Animation Overlay */}
          {isScanning && (
            <div className="absolute inset-0 bg-emerald-900/20 overflow-hidden rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
              {/* Scanning laser line */}
              <div className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-[ping_2s_ease-in-out_infinite]"></div>
              
              <div className="bg-slate-900/80 px-6 py-2 rounded-full border border-emerald-500/30 text-emerald-400 font-bold animate-pulse z-10 shadow-lg">
                Analyzing Terrain & Anomalies...
              </div>
            </div>
          )}

          {/* Detection Results Overlay (appears after scan completes) */}
          {detectionDone && !isScanning && (
            <div className="absolute inset-0 pointer-events-none rounded-2xl animate-fadeIn">

              {/* AI Scan Completed Badge */}
              <div className="absolute top-4 left-4 bg-emerald-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                ✓ AI Detection Complete
              </div>

              {/* High Risk Detection Box */}
              <div className="absolute top-[24%] left-[30%] w-36 h-28 border-[3px] border-red-500 rounded-md bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
                <div className="bg-red-500 text-white text-[11px] font-bold px-2 py-1 uppercase tracking-wider">
                  HIGH RISK • 97%
                </div>
              </div>

              {/* Medium Risk Detection Box */}
              <div className="absolute top-[60%] left-[66%] w-24 h-24 border-[3px] border-yellow-400 rounded-md bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse">
                <div className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                  ANOMALY
                </div>
              </div>

              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

              {/* Scan Complete Footer */}
              <div className="absolute bottom-4 right-4 bg-slate-900/80 border border-emerald-500/30 px-3 py-2 rounded-lg text-[11px] text-emerald-300 font-mono">
                TARGET LOCKED • CONFIDENCE 97.2%
              </div>

            </div>
          )}
        </div>
      ) : (
        <div className="h-[430px] flex items-center justify-center text-slate-500">
          Upload a satellite image to begin AI detection.
        </div>
      )}
    </div>
  );
}