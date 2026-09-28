import { useState, useEffect, useRef } from "react";
import { Terminal, Shield, Pause, Play, Trash2 } from "lucide-react";
import type { TelemetryLog } from "./types";

const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: "log-1",
    timestamp: "20:47:01 IST",
    type: "SYNC",
    message: "Sentinel-2 Tile 221A downloaded via Copernicus Hub",
  },
  {
    id: "log-2",
    timestamp: "20:47:03 IST",
    type: "INFERENCE",
    message: "YOLOv8 inference completed on 10m multispectral bands B04/B08",
  },
  {
    id: "log-3",
    timestamp: "20:47:05 IST",
    type: "CADASTRE",
    message: "Cadastre parcel WB-N24-118 matched (96.3% confidence)",
  },
  {
    id: "log-4",
    timestamp: "20:47:07 IST",
    type: "EXPORT",
    message: "GeoJSON exported successfully to state revenue geodatabase",
  },
  {
    id: "log-5",
    timestamp: "20:47:09 IST",
    type: "DISPATCH",
    message: "Dispatch alert sent to District Magistrate (Red Priority)",
  },
];

const TELEMETRY_STREAM_MESSAGES = [
  { type: "SYNC", msg: "Sentinel-2 Tile 221A downloaded" },
  { type: "INFERENCE", msg: "YOLOv8 inference completed: 0.94 IoU threshold" },
  { type: "CADASTRE", msg: "Cadastre parcel WB-N24-118 matched" },
  { type: "EXPORT", msg: "GeoJSON exported successfully to GIS queue" },
  { type: "DISPATCH", msg: "Dispatch sent to District Magistrate (Howrah LAO)" },
  { type: "SYNC", msg: "Cartosat-3 PAN 0.3m orthorectification pass synced" },
  { type: "CADASTRE", msg: "RFCTLARR Section 11 boundary verified on Mouza Gosaba" },
  { type: "INFERENCE", msg: "NDVI canopy deficit computed (-24.8% delta)" },
  { type: "SYSTEM", msg: "MongoDB Atlas cluster primary heartbeat ack (34ms)" },
  { type: "DISPATCH", msg: "Forest Patrol drone mission telemetry uplink established" },
];

export default function TelemetryConsole() {
  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Feature 3: Add telemetry messages every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    let index = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(" ")[0]} IST`;
      const template = TELEMETRY_STREAM_MESSAGES[index % TELEMETRY_STREAM_MESSAGES.length];
      index++;

      const newLog: TelemetryLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        type: template.type as TelemetryLog["type"],
        message: template.msg,
      };

      setLogs((prev) => [...prev.slice(-30), newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeStyle = (type: TelemetryLog["type"]) => {
    switch (type) {
      case "SYNC":
        return "text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10";
      case "INFERENCE":
        return "text-[#00F5C3] border-[#00F5C3]/30 bg-[#00F5C3]/10";
      case "CADASTRE":
        return "text-purple-400 border-purple-500/30 bg-purple-500/10";
      case "DISPATCH":
        return "text-[#FF4D6D] border-[#FF4D6D]/30 bg-[#FF4D6D]/10";
      case "EXPORT":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      default:
        return "text-slate-300 border-slate-700 bg-slate-800";
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#050C18]/95 p-4 font-mono shadow-xl backdrop-blur-xl">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-3 mb-3">
        <div className="flex items-center gap-2">
          {/* Mac/Terminal Dots */}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF4D6D]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-600 font-bold ml-1">|</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-white tracking-wide">
            <Terminal className="h-3.5 w-3.5 text-[#00F5C3]" />
            <span>MISSION CONTROL TELEMETRY CONSOLE</span>
          </div>
        </div>

        {/* Console Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
            title={isPaused ? "Resume Stream" : "Pause Stream"}
          >
            {isPaused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
            <span>{isPaused ? "RESUME" : "PAUSE"}</span>
          </button>
          <button
            type="button"
            onClick={() => setLogs([])}
            className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
            title="Clear Console"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content (Auto-Scroll) */}
      <div
        ref={scrollRef}
        className="h-56 overflow-y-auto space-y-2 pr-1.5 font-mono text-[11px] select-text scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            Console cleared. Waiting for telemetry packets...
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/40 rounded p-1 transition-colors"
            >
              {/* Green / Cyan Timestamp */}
              <span className="text-[#00F5C3] shrink-0 font-bold">
                [{log.timestamp}]
              </span>

              {/* Tag Pill */}
              <span
                className={`rounded border px-1.5 py-0.2 text-[9px] font-bold shrink-0 ${getTypeStyle(
                  log.type
                )}`}
              >
                {log.type}
              </span>

              {/* Message */}
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Terminal Footer Status */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-800/90 pt-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Shield className="h-3 w-3" />
          <span>SOCKET 127.0.0.1:8000/ws/telemetry (CONNECTED)</span>
        </span>
        <span className="text-[#00F5C3] font-bold">RATE: 1 MSG / 2 SEC</span>
      </div>
    </div>
  );
}
