import PageHeader from "../components/common/PageHeader";

export default function Projects() {
  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Land monitoring projects managed by departments across West Bengal"
      />
      {/* ProjectsGrid will be wired here in Phase 2 */}
      <div
        className="h-64 rounded-xl flex items-center justify-center"
        style={{ border: "1px dashed #1F2937", background: "#101826" }}
      >
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          Projects — Phase 2
        </p>
      </div>
    </div>
  );
}
