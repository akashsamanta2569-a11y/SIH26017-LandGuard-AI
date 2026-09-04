import PageHeader from "../components/common/PageHeader";

export default function GisMap() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="GIS Map"
        subtitle="Interactive district-level land-use map for West Bengal"
      />
      {/* GisMapView + LayerControls will be wired here in Phase 2 */}
      <div
        className="flex-1 rounded-xl flex items-center justify-center"
        style={{ border: "1px dashed #1F2937", background: "#101826" }}
      >
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          GIS Map — Phase 2
        </p>
      </div>
    </div>
  );
}
