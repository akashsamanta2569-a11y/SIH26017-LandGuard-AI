import {
    Search,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Radar,
} from "lucide-react";

export default function DetectionViewer() {
    return (
        <div className="relative h-[560px] rounded-2xl border border-emerald-500/20 bg-slate-950/70 overflow-hidden backdrop-blur-xl">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-500/10 bg-slate-950/90">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-mono">
                        YOLOv8 Detection Feed
                    </p>

                    <h3 className="text-lg font-bold text-white">
                        Live Satellite Detection Viewer
                    </h3>
                </div>

                <div className="flex gap-2">
                    {[
                        <Search size={16} />,
                        <ZoomIn size={16} />,
                        <ZoomOut size={16} />,
                        <Maximize2 size={16} />,
                    ].map((icon, i) => (
                        <button
                            key={i}
                            className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-900/60 hover:border-emerald-400/40 flex items-center justify-center text-slate-300"
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* IMAGE COMES NEXT */}
            <div className="relative h-[470px] bg-slate-950">
                {/* AI Detection Boxes */}

                {/* Illegal Structure */}
                <div className="absolute top-24 left-28">
                    <div className="rounded-md border-2 border-red-500 shadow-[0_0_18px_rgba(239,68,68,0.8)] w-28 h-20 animate-pulse" />

                    <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold">
                        Illegal Structure • 97%
                    </div>
                </div>

                {/* Vegetation Loss */}
                <div className="absolute top-40 right-24">
                    <div className="rounded-md border-2 border-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.7)] w-32 h-20 animate-pulse" />

                    <div className="absolute -top-6 left-0 bg-yellow-500 text-black text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                        Vegetation Loss • 92%
                    </div>
                </div>

                {/* Sand Mining */}
                <div className="absolute bottom-24 left-44">
                    <div className="rounded-md border-2 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.8)] w-36 h-20 animate-pulse" />

                    <div className="absolute -top-6 left-0 bg-emerald-500 text-black text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                        Sand Mining • 89%
                    </div>
                </div>

                {/* Detection Pulse */}
                <div className="absolute top-[42%] left-[48%]">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />

                    <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping" />
                </div>
                {/* Satellite Image */}
                <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                    alt="Satellite"
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/40 to-emerald-950/40" />

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
      linear-gradient(rgba(16,185,129,.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16,185,129,.15) 1px, transparent 1px)
    `,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* AI Status */}
                <div className="absolute top-4 left-4 rounded-xl border border-emerald-500/30 bg-slate-900/80 px-3 py-2 backdrop-blur">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                        <Radar size={14} className="animate-pulse" />
                        AI Scan Active
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1">
                        18 anomalies detected • Live inference
                    </p>
                </div>

                {/* Horizontal Scan Line */}
                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-emerald-400/60 shadow-[0_0_20px_#10b981]" />

                <div className="absolute inset-x-0 top-[48%] h-16 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent animate-pulse" />
            </div>
        </div>
    );
}