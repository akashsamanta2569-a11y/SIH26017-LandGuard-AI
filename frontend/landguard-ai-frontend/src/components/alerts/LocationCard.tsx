import {
  MapPin,
  Navigation,
  Layers,
  UserCheck,
  Clock,
  Building2,
} from "lucide-react";
import type { AlertData } from "./types";

export interface LocationCardProps {
  alert: AlertData;
}

export function formatISTTime(timestamp: string): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return timestamp;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }) + " IST";
  } catch {
    return timestamp;
  }
}

export default function LocationCard({ alert }: LocationCardProps) {
  const fields = [
    {
      label: "Administrative District",
      value: alert.district,
      icon: Building2,
      color: "text-[#00F5C3]",
    },
    {
      label: "Geodetic Coordinates",
      value: `${alert.coordinates.lat.toFixed(4)}° N, ${alert.coordinates.lng.toFixed(4)}° E`,
      icon: Navigation,
      color: "text-[#00E5FF]",
      isMono: true,
    },
    {
      label: "Revenue Mouza",
      value: alert.mouza,
      icon: Layers,
      color: "text-amber-400",
    },
    {
      label: "Cadastre JL Number",
      value: `JL #${alert.jlNumber}`,
      icon: MapPin,
      color: "text-purple-400",
      isMono: true,
    },
    {
      label: "Assigned Field Officer",
      value: alert.officer,
      icon: UserCheck,
      color: "text-emerald-400",
    },
    {
      label: "Satellite Survey Time",
      value: formatISTTime(alert.timestamp),
      icon: Clock,
      color: "text-slate-300",
      isMono: true,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#081326]/90 p-4.5 space-y-3.5 backdrop-blur-md shadow-lg font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#00F5C3]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Field Intelligence
          </h4>
        </div>
        <span className="text-[10px] text-[#00E5FF]">PM GATISHAKTI MAPPING</span>
      </div>

      {/* Grid of 6 fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.label}
              className="rounded-lg border border-slate-800/80 bg-[#050C18]/60 p-2.5 space-y-1 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Icon className={`h-3.5 w-3.5 ${field.color}`} />
                <span className="uppercase tracking-wider">{field.label}</span>
              </div>
              <div
                className={`text-xs font-semibold truncate ${
                  field.isMono ? "font-mono" : "font-sans"
                } ${field.color === "text-[#00F5C3]" ? "text-[#00F5C3]" : "text-white"}`}
              >
                {field.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
