import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Activity } from "lucide-react";
import type { LatencyDataPoint } from "./types";

export interface LiveLatencyChartProps {
  data?: LatencyDataPoint[];
}

const DEFAULT_LATENCY_DATA: LatencyDataPoint[] = [
  { time: "20:41", sentinel: 124, cartosat: 158, fastapi: 52, mongodb: 36, cadastre: 215, yolo: 88, avgLatency: 112 },
  { time: "20:42", sentinel: 118, cartosat: 152, fastapi: 48, mongodb: 33, cadastre: 208, yolo: 84, avgLatency: 107 },
  { time: "20:43", sentinel: 122, cartosat: 160, fastapi: 55, mongodb: 38, cadastre: 220, yolo: 90, avgLatency: 114 },
  { time: "20:44", sentinel: 128, cartosat: 155, fastapi: 47, mongodb: 34, cadastre: 212, yolo: 82, avgLatency: 109 },
  { time: "20:45", sentinel: 119, cartosat: 151, fastapi: 50, mongodb: 35, cadastre: 205, yolo: 85, avgLatency: 107 },
  { time: "20:46", sentinel: 121, cartosat: 156, fastapi: 49, mongodb: 34, cadastre: 214, yolo: 83, avgLatency: 109 },
  { time: "20:47", sentinel: 120, cartosat: 154, fastapi: 49, mongodb: 34, cadastre: 210, yolo: 83, avgLatency: 108 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomCyberTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-[#00F5C3]/40 bg-[#050C18]/95 p-3.5 font-mono text-xs shadow-[0_0_20px_rgba(0,245,195,0.25)] backdrop-blur-xl space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400">
        <span className="font-bold text-[#00F5C3]">TIME: {label} IST</span>
        <span className="text-[10px]">PACKET ROUNDTRIP</span>
      </div>

      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300 text-[11px]">{item.name}:</span>
            </div>
            <span className="font-bold text-white">{item.value} ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveLatencyChart({
  data = DEFAULT_LATENCY_DATA,
}: LiveLatencyChartProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#081326]/85 p-4.5 font-mono shadow-xl backdrop-blur-xl space-y-4">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/90 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#00F5C3]/30 bg-[#00F5C3]/10 text-[#00F5C3]">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Live Network &amp; API Latency Stream
            </h4>
            <p className="text-[10px] text-slate-400 font-sans">
              Real-time HTTP / gRPC roundtrip response times across 6 core microservices
            </p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-[#00F5C3]">
            <span className="h-2 w-2 rounded-full bg-[#00F5C3]" />
            <span>Avg Latency</span>
          </span>
          <span className="flex items-center gap-1 text-[#00E5FF]">
            <span className="h-2 w-2 rounded-full bg-[#00E5FF]" />
            <span>Sentinel-2 Feed</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>FastAPI Engine</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" strokeOpacity={0.6} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              unit="ms"
              domain={[0, 240]}
            />
            <Tooltip content={<CustomCyberTooltip />} />

            {/* Line 1: Overall Average Latency (Prominent Teal with Glow) */}
            <Line
              type="monotone"
              dataKey="avgLatency"
              name="Avg Latency"
              stroke="#00F5C3"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#00F5C3", stroke: "#050C18", strokeWidth: 1.5 }}
              activeDot={{ r: 6, fill: "#00F5C3", stroke: "#FFFFFF", strokeWidth: 2 }}
            />

            {/* Line 2: Sentinel-2 Feed (ISRO Cyan) */}
            <Line
              type="monotone"
              dataKey="sentinel"
              name="Sentinel-2"
              stroke="#00E5FF"
              strokeWidth={1.8}
              strokeDasharray="4 3"
              dot={false}
            />

            {/* Line 3: FastAPI Backend Engine */}
            <Line
              type="monotone"
              dataKey="fastapi"
              name="FastAPI"
              stroke="#10B981"
              strokeWidth={1.6}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Benchmark */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
        <span>SLA THRESHOLD: &lt; 300 ms (HEALTHY)</span>
        <span className="text-[#00F5C3] font-bold">CURRENT AVG: 108 ms</span>
      </div>
    </div>
  );
}
