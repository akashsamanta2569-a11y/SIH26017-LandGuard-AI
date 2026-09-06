import GISHero from "../components/gis/GISHero";
import GISMapCanvas from "../components/gis/GISMapCanvas";
import LayerControlPanel from "../components/gis/LayerControlPanel";
import DistrictInspector from "../components/gis/DistrictInspector";
import TimelineComparison from "../components/gis/TimelineComparison";

export default function GisMap() {
  
  return (
    <div className="relative w-full max-w-screen-2xl mx-auto px-4 lg:px-6 space-y-6 pb-12 fade-up select-none">
      {/* ── Background: Two Radial Emerald Glows + One Teal Glow ── */}
      <div
        className="pointer-events-none absolute -top-12 left-1/4 w-[650px] h-[650px] rounded-full opacity-20 -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-72 right-12 w-[550px] h-[550px] rounded-full opacity-18 -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.3) 0%, rgba(20,184,166,0.06) 50%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-16 left-10 w-[500px] h-[500px] rounded-full opacity-15 -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
        }}
      />

      {/* ── 1. Full-Width GISHero Toolbar ── */}
      <div className="w-full">
        <GISHero />
      </div>

      {/* ── 2. Responsive 12-Column Workstation Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: LayerControlPanel */}
        <div className="order-2 lg:col-span-3 w-full min-w-0">
          <LayerControlPanel />
        </div>

        {/* CENTER COLUMN: GIS Map Canvas */}
        <div className="order-1 lg:col-span-6 w-full min-w-0 flex flex-col h-full">
          <GISMapCanvas />
        </div>

        {/* RIGHT COLUMN: DistrictInspector */}
        <div className="order-3 lg:col-span-3 w-full min-w-0">
          <DistrictInspector />
        </div>
      </div>

      {/* ── 3. Full-Width Satellite Timeline Comparison ── */}
      <div className="w-full -mt-2 lg:mt-0">
        <TimelineComparison />
      </div>
    </div>
  );
}