import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  Satellite,
  Compass,
  Shield,
  Download,
  FileText,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react";
import rawPredictionHistory from "../mock/predictionHistory.json";
import {
  BeforeAfterSlider,
  ReplayTimeline,
  HistoryMetrics,
  ReplayControls,
  type PredictionHistoryMonth,
} from "../components/history";

const DISTRICT_COORDS: Record<string, { lat: number; lng: number; district: string }> = {
  Howrah: { lat: 22.595, lng: 88.263, district: "Howrah" },
  "South 24 Parganas": { lat: 22.164, lng: 88.812, district: "South 24 Parganas" },
  "Paschim Bardhaman": { lat: 23.674, lng: 87.118, district: "Paschim Bardhaman" },
  Kolkata: { lat: 22.572, lng: 88.363, district: "Kolkata" },
  Darjeeling: { lat: 27.041, lng: 88.241, district: "Darjeeling" },
};

export default function PredictionHistory() {
  const location = useLocation();
  const months: PredictionHistoryMonth[] = rawPredictionHistory as PredictionHistoryMonth[];

  // Replay progression state (Feature 2 & 6)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  // Incoming district state or fallback
  const initialDistrict = useMemo(() => {
    const state = location.state as { district?: string } | null;
    return state?.district || "Howrah";
  }, [location.state]);

  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentMonth = months[currentIndex] || months[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Feature 2: Animation automatically progresses every 2 seconds (adjusted by speed multiplier)
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 2000 / speed;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < months.length - 1) {
          return prev + 1;
        } else {
          return 0; // seamless loop
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, speed, months.length]);

  const handlePrevMonth = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentIndex((prev) => Math.min(months.length - 1, prev + 1));
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  const coords = DISTRICT_COORDS[selectedDistrict] || DISTRICT_COORDS.Howrah;

  const handleExportDossier = () => {
    const reportData = {
      agency: "LandGuard AI // ISRO SIH26017 Division",
      district: selectedDistrict,
      coordinates: coords,
      currentPhase: currentMonth.label,
      month: currentMonth.month,
      canopyLoss: `${currentMonth.canopyLoss}%`,
      builtFootprint: `${currentMonth.builtArea} sq.m`,
      plotsEncroached: currentMonth.plots,
      confidenceScore: `${currentMonth.confidence}%`,
      ndviIntegrity: currentMonth.ndviOpacity,
      statutoryReference: "RFCTLARR 2013 & Forest Conservation Act",
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ISRO_S2_Dossier_${selectedDistrict.replace(/\s+/g, "_")}_${currentMonth.month}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`Official ISRO Multi-Temporal Dossier Exported for ${selectedDistrict}`);
  };

  return (
    <div
      id="landguard-report"
      className="min-h-screen bg-[#050C18] text-white print:bg-white print:text-black pb-16 space-y-8 select-none overflow-x-hidden w-full max-w-full"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#00F5C3] bg-[#050C18]/95 px-4 py-3 font-mono text-xs text-[#00F5C3] shadow-[0_0_20px_rgba(0,245,195,0.3)] backdrop-blur-xl"
          >
            <CheckCircle className="h-4 w-4 shrink-0 text-[#00F5C3]" />
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PREMIUM ISRO-STYLE HEADER */}
      <div className="rounded-2xl border border-[#00F5C3]/20 bg-gradient-to-r from-[#050C18]/95 via-[#081326]/90 to-[#050C18]/95 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Cyan Ambient Glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#00F5C3]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#00E5FF]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-[#00F5C3]/15 text-[#00F5C3] border border-[#00F5C3]/30 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#00F5C3] animate-pulse" />
                ISRO Satellite Geospatial Intelligence &bull; SIH26017
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                <Radio className="w-3 h-3 text-[#00E5FF] animate-pulse" />
                TEMPORAL ARCHIVE: 4-MONTH SEQUENCE
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3 font-mono">
              <span>ISRO-Style Satellite Multi-Temporal Comparison</span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
              Automated multi-spectral change-detection comparing historical baseline passes against monthly satellite sweeps. Chronological progression reveals vegetation clearing, foundation excavation, and illegal perimeter breaches.
            </p>
          </div>

          {/* Right Telemetry Column */}
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end justify-between gap-3 shrink-0 border-t sm:border-t-0 sm:border-l border-[#00F5C3]/20 sm:pl-6 pt-4 sm:pt-0 font-mono">
            <div className="flex items-center gap-2 text-xs text-[#00F5C3] bg-[#00F5C3]/10 border border-[#00F5C3]/30 px-3 py-1.5 rounded-lg shadow-sm">
              <Satellite className="w-4 h-4 text-[#00F5C3]" />
              <span>SENSOR: SENTINEL-2B / CARTOSAT-3</span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>PASS CADENCE: 30-DAY SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* DISTRICT TARGET SELECTOR BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#00F5C3]/20 bg-[#081326]/80 p-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <Compass className="h-4 w-4 text-[#00F5C3]" />
          <span className="font-semibold uppercase tracking-wider">
            Surveillance Target Sector:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(DISTRICT_COORDS).map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => {
                setSelectedDistrict(dist);
                triggerToast(`Switched satellite baseline to ${dist} Sector`);
              }}
              className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                selectedDistrict === dist
                  ? "border border-[#00F5C3] bg-[#00F5C3]/20 text-[#00F5C3] shadow-[0_0_12px_rgba(0,245,195,0.25)]"
                  : "border border-slate-800 bg-[#050C18]/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* 2. FEATURE 2: REPLAY TIMELINE */}
      <ReplayTimeline
        months={months}
        currentIndex={currentIndex}
        onSelectIndex={(idx) => setCurrentIndex(idx)}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onRestart={handleRestart}
      />

      {/* 3. FEATURE 5: LIVE METRICS (ANIMATED COUNTERS) */}
      <HistoryMetrics currentMonth={currentMonth} />

      {/* 4. FEATURE 1, 3, 4: BEFORE / AFTER SATELLITE SLIDER WITH DETECTION OVERLAY */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#00E5FF]" />
            <span className="font-bold uppercase tracking-wider text-white">
              Multi-Spectral Vector Inspection Slider &bull; {selectedDistrict}
            </span>
          </div>
          <span className="text-[#00F5C3]">
            CURRENT REPLAY STAGE: {currentMonth.label.toUpperCase()} ({currentMonth.month})
          </span>
        </div>

        <BeforeAfterSlider
          currentMonth={currentMonth}
          monthIndex={currentIndex}
        />
      </div>

      {/* 5. FEATURE 6: REPLAY CONTROLS BAR */}
      <ReplayControls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < months.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
        onRestart={handleRestart}
        currentMonth={currentMonth}
      />

      {/* 6. DOSSIER ACTION & STATUTORY AUDIT SUMMARY CARD */}
      <div className="rounded-2xl border border-slate-800 bg-[#081326]/85 p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00F5C3]">
            <Shield className="h-4 w-4 text-[#00F5C3]" />
            <span>STATUTORY EVIDENCE RECONSTRUCTION COMPLETED</span>
          </div>
          <h4 className="text-base font-bold text-white">
            Official Multi-Temporal Satellite Dossier &bull; {selectedDistrict} ({currentMonth.month})
          </h4>
          <p className="text-xs text-slate-400 font-sans max-w-2xl">
            Geo-referenced audit package ready for presentation before the District Magistrate and Forest Tribunal under Section 11/19 of RFCTLARR 2013 and Section 26 of the Forest Conservation Act.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportDossier}
            className="flex items-center gap-2 rounded-xl border border-[#00F5C3] bg-[#00F5C3]/15 px-4 py-2.5 text-xs font-bold text-[#00F5C3] backdrop-blur-md transition-all hover:bg-[#00F5C3] hover:text-[#050C18] shadow-[0_0_15px_rgba(0,245,195,0.25)]"
          >
            <Download className="h-4 w-4" />
            <span>EXPORT FULL DOSSIER (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => triggerToast("Generating High-Resolution GeoTIFF Orthomosaic...")}
            className="flex items-center gap-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-4 py-2.5 text-xs font-bold text-[#00E5FF] backdrop-blur-md transition-all hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]"
          >
            <FileText className="h-4 w-4" />
            <span>EXPORT GEOTIFF (10m)</span>
          </button>
        </div>
      </div>
    </div>
  );
}