import GISHero from "../components/gis/GISHero";
import GISMapCanvas from "../components/gis/GISMapCanvas";
import LayerControlPanel from "../components/gis/LayerControlPanel";
import DistrictInspector from "../components/gis/DistrictInspector";
import TimelineComparison from "../components/gis/TimelineComparison";

export default function GisMap() {
  return (
    <div className="relative max-w-[1700px] mx-auto space-y-6 pb-12 fade-up select-none">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        {/* CENTER COLUMN: GISMapCanvas (Desktop 6 cols, Tablet full-width first, Mobile first) */}
        <div className="order-1 md:col-span-2 lg:order-2 lg:col-span-6 w-full self-start">
          <GISMapCanvas />
        </div>

        {/* LEFT COLUMN: LayerControlPanel (Desktop 3 cols sticky, Tablet stacked left, Mobile second) */}
        <div className="order-2 md:col-span-1 lg:order-1 lg:col-span-3 w-full lg:sticky lg:top-6 self-start">
          <LayerControlPanel />
        </div>

        {/* RIGHT COLUMN: DistrictInspector (Desktop 3 cols sticky, Tablet stacked right, Mobile third) */}
        <div className="order-3 md:col-span-1 lg:order-3 lg:col-span-3 w-full lg:sticky lg:top-6 self-start">
          <DistrictInspector />
        </div>
      </div>

      {/* ── 3. Full-Width Satellite Timeline Comparison ── */}
      <div className="w-full">
        <TimelineComparison />
      </div>
    </div>
  );
}
