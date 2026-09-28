import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Shield,
  Building2,
  Download,
  CheckCircle,
  Radio,
} from "lucide-react";
import type { AlertData } from "./types";

export interface DispatchButtonsProps {
  alert: AlertData;
  onStatusChange?: (newStatus: string) => void;
}

export type TacticalDispatchStatus =
  | "Pending"
  | "Drone Scheduled"
  | "Ranger Assigned"
  | "DM Notified";

export default function DispatchButtons({
  alert,
  onStatusChange,
}: DispatchButtonsProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(
    alert.status && alert.status !== "Pending Field Verification"
      ? alert.status
      : "Pending"
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string, nextStatus?: string) => {
    setToastMessage(message);
    if (nextStatus) {
      setCurrentStatus(nextStatus);
      if (onStatusChange) {
        onStatusChange(nextStatus);
      }
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLaunchDrone = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToast(
      `Drone Patrol scheduled for ${alert.mouza} (${alert.district}). High-resolution orthomosaic task created.`,
      "Drone Scheduled"
    );
  };

  const handleGenerateFIR = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToast(
      `Statutory FIR Draft generated under Indian Forest Act Section 26. Ranger assigned for immediate execution.`,
      "Ranger Assigned"
    );
  };

  const handleNotifyDM = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToast(
      `District Magistrate of ${alert.district} notified via GatiShakti Red-Alert telemetry bridge.`,
      "DM Notified"
    );
  };

  const handleExportGeoJSON = (e: React.MouseEvent) => {
    e.stopPropagation();
    const geojsonData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [alert.coordinates.lng, alert.coordinates.lat],
          },
          properties: {
            alertId: alert.id,
            district: alert.district,
            mouza: alert.mouza,
            jlNumber: alert.jlNumber,
            severity: alert.severity,
            confidence: alert.confidence,
            affectedAreaHa: alert.affectedArea,
            vegetationLossPercent: alert.vegetationLoss,
            cadastreMatchPercent: alert.cadastreMatch,
            sensorPlatform: alert.sensor,
            dispatchStatus: currentStatus,
            statutoryRfctlarr: alert.rfctlarr,
            timestamp: alert.timestamp,
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], {
      type: "application/geo+json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PMGS_${alert.id}_${alert.district.replace(/\s+/g, "_")}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast("Geo-referenced incident GeoJSON exported successfully.");
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Dynamic Status Workflow Pipeline */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#050C18]/90 p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">DISPATCH PIPELINE:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00F5C3]/40 bg-[#00F5C3]/10 px-2.5 py-0.5 text-[#00F5C3] font-bold shadow-[0_0_10px_rgba(0,245,195,0.2)]">
            <Radio className="h-3 w-3 animate-pulse" />
            {currentStatus}
          </span>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className={currentStatus === "Pending" ? "text-[#00F5C3] font-bold" : ""}>
            Pending
          </span>
          <span>&gt;</span>
          <span className={currentStatus === "Drone Scheduled" ? "text-[#00F5C3] font-bold" : ""}>
            Drone Scheduled
          </span>
          <span>&gt;</span>
          <span className={currentStatus === "Ranger Assigned" ? "text-[#00F5C3] font-bold" : ""}>
            Ranger Assigned
          </span>
          <span>&gt;</span>
          <span className={currentStatus === "DM Notified" ? "text-[#00F5C3] font-bold" : ""}>
            DM Notified
          </span>
        </div>
      </div>

      {/* Feature 7 & 10: 4 Dispatch Buttons (Mobile: 1 column, Tablet: 2 columns, Desktop: flex) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap items-center gap-2.5 sm:gap-3">
        {/* 1. Launch Drone Patrol */}
        <motion.button
          type="button"
          onClick={handleLaunchDrone}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#00F5C3]/40 bg-[#00F5C3]/10 px-3.5 py-2.5 text-xs font-bold text-[#00F5C3] backdrop-blur-md transition-all hover:bg-[#00F5C3]/20 hover:border-[#00F5C3] hover:shadow-[0_0_16px_rgba(0,245,195,0.35)]"
        >
          <Plane className="h-4 w-4 shrink-0" />
          <span>Launch Drone Patrol</span>
        </motion.button>

        {/* 2. Generate FIR Draft */}
        <motion.button
          type="button"
          onClick={handleGenerateFIR}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 text-xs font-bold text-amber-300 backdrop-blur-md transition-all hover:bg-amber-500/20 hover:border-amber-400 hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]"
        >
          <Shield className="h-4 w-4 shrink-0" />
          <span>Generate FIR Draft</span>
        </motion.button>

        {/* 3. Notify District Magistrate */}
        <motion.button
          type="button"
          onClick={handleNotifyDM}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#FF4D6D]/40 bg-[#FF4D6D]/10 px-3.5 py-2.5 text-xs font-bold text-[#FF4D6D] backdrop-blur-md transition-all hover:bg-[#FF4D6D]/20 hover:border-[#FF4D6D] hover:shadow-[0_0_16px_rgba(255,77,109,0.35)]"
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span>Notify DM</span>
        </motion.button>

        {/* 4. Export GeoJSON */}
        <motion.button
          type="button"
          onClick={handleExportGeoJSON}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3.5 py-2.5 text-xs font-bold text-[#00E5FF] backdrop-blur-md transition-all hover:bg-[#00E5FF]/20 hover:border-[#00E5FF] hover:shadow-[0_0_16px_rgba(0,229,255,0.35)]"
        >
          <Download className="h-4 w-4 shrink-0" />
          <span>Export GeoJSON</span>
        </motion.button>
      </div>

      {/* Feature 7: Bottom-Right Animated Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#00F5C3] bg-[#050C18]/95 px-4 py-3.5 text-xs text-[#00F5C3] shadow-[0_0_25px_rgba(0,245,195,0.35)] backdrop-blur-xl max-w-md"
          >
            <CheckCircle className="h-4 w-4 shrink-0 text-[#00F5C3]" />
            <span className="font-semibold leading-relaxed">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
