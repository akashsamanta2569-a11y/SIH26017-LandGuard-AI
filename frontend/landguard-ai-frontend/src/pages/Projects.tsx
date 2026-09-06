import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";

const PROJECTS = [
  {
    id: "WB-001",
    name: "Howrah Smart City Corridor",
    district: "Howrah",
    progress: 82,
    risk: "Critical",
    area: "18.6 Ha",
    agency: "Howrah Municipal Corporation",
    image: "/mock/howrah_after.jpg",
  },
  {
    id: "WB-002",
    name: "Sundarbans Mangrove Protection",
    district: "South 24 Parganas",
    progress: 68,
    risk: "Critical",
    area: "24.2 Ha",
    agency: "Forest Department WB",
    image: "/mock/s24_after.jpg",
  },
  {
    id: "WB-003",
    name: "East Kolkata Wetland Restoration",
    district: "Kolkata",
    progress: 74,
    risk: "High",
    area: "14.8 Ha",
    agency: "KMC Environment Cell",
    image: "/mock/kolkata_after.jpg",
  },
  {
    id: "WB-004",
    name: "Mining Expansion Monitoring",
    district: "Paschim Bardhaman",
    progress: 91,
    risk: "Critical",
    area: "13.8 Ha",
    agency: "Department of Mines",
    image: "/mock/bardhaman_after.jpg",
  },
];

export default function Projects() {
  const navigate = useNavigate(); // ✅ Hook must be inside component

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Land monitoring projects managed by departments across West Bengal"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950/70"
          >
            <img
              src={project.image}
              alt={project.name}
              className="h-48 w-full object-cover"
            />

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  {project.name}
                </h2>

                <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
                  {project.risk}
                </span>
              </div>

              <p className="text-sm text-slate-400">{project.agency}</p>

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div>District: {project.district}</div>
                <div>Area: {project.area}</div>
                <div>Progress: {project.progress}%</div>
                <div>ID: {project.id}</div>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <button
                onClick={() =>
                  navigate("/gis", {
                    state: {
                      district: project.district,
                      fromProjects: true,
                    },
                  })
                }
                className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                View on GIS Map →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}