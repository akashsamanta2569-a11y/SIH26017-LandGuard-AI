import { ShieldCheck, AlertCircle, FileCheck, Scale } from "lucide-react";

export interface LegalComplianceCardProps {
  rfctlarr: string[];
  status?: string;
}

interface StatutoryItem {
  section: string;
  title: string;
  status: "Completed" | "Pending" | "Violated";
  details: string;
}

export default function LegalComplianceCard({
  rfctlarr,
}: LegalComplianceCardProps) {
  // Parse and map RFCTLARR statutory clauses
  const hasClause = (term: string) =>
    rfctlarr?.some((c) => c.toLowerCase().includes(term.toLowerCase())) ?? false;

  const section11Status: "Completed" | "Pending" | "Violated" =
    hasClause("Section 11 Gazette Verified") || hasClause("Section 11 Completed")
      ? "Completed"
      : hasClause("Section 11")
      ? "Pending"
      : "Violated";

  const section19Status: "Completed" | "Pending" | "Violated" =
    hasClause("Compensation Verified") || hasClause("Award Passed")
      ? "Completed"
      : hasClause("Compensation Pending") || hasClause("Section 19")
      ? "Pending"
      : "Pending";

  const section31Status: "Completed" | "Pending" | "Violated" =
    hasClause("CRZ Buffer Violation") || hasClause("Buffer Violation") || hasClause("Encroachment Confirmed")
      ? "Violated"
      : hasClause("Rehabilitation Required") || hasClause("Section 31")
      ? "Pending"
      : "Completed";

  const statutoryBadges: StatutoryItem[] = [
    {
      section: "Section 11",
      title: "Preliminary Notification",
      status: section11Status,
      details: "State Gazette publication & DGPS preliminary land survey",
    },
    {
      section: "Section 19",
      title: "Declaration & Award",
      status: section19Status,
      details: "Statutory compensation & cadastral measurement audit",
    },
    {
      section: "Section 31",
      title: "Rehabilitation & Buffer",
      status: section31Status,
      details: "R&R scheme mandatory for protected reserve perimeters",
    },
  ];

  const getStatusBadgeStyle = (status: "Completed" | "Pending" | "Violated") => {
    switch (status) {
      case "Completed":
        return {
          card: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
          pill: "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]",
          icon: ShieldCheck,
          text: "COMPLETED",
        };
      case "Pending":
        return {
          card: "border-amber-500/40 bg-amber-950/20 text-amber-300",
          pill: "border-amber-500/60 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]",
          icon: FileCheck,
          text: "PENDING REVIEW",
        };
      case "Violated":
        return {
          card: "border-[#FF4D6D]/40 bg-rose-950/20 text-[#FF4D6D]",
          pill: "border-[#FF4D6D]/60 bg-[#FF4D6D]/20 text-[#FF4D6D] shadow-[0_0_10px_rgba(255,77,109,0.3)]",
          icon: AlertCircle,
          text: "CRITICAL VIOLATED",
        };
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#081326]/90 p-4.5 space-y-3.5 backdrop-blur-md shadow-lg font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-2.5">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            RFCTLARR Statutory Legal Compliance
          </h4>
        </div>
        <span className="text-[10px] text-amber-400">ACT NO. 30 OF 2013</span>
      </div>

      {/* Cyber Legal Badges (Section 11, Section 19, Section 31) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {statutoryBadges.map((badge) => {
          const style = getStatusBadgeStyle(badge.status);
          const Icon = style.icon;

          return (
            <div
              key={badge.section}
              className={`rounded-lg border p-3 space-y-1.5 transition ${style.card}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{badge.section}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ${style.pill}`}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {style.text}
                </span>
              </div>
              <div className="text-xs font-semibold text-white">{badge.title}</div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {badge.details}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional specific statutory flags from alert data */}
      {rfctlarr && rfctlarr.length > 0 && (
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400">TRIGGERED ACT CLAUSES:</span>
          {rfctlarr.map((clause, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[10px] text-slate-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>{clause}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
