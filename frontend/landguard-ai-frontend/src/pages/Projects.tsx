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
  const navigate = useNavigate();

  return (
    <div
      id="landguard-report"
      className="min-h-screen bg-[#050C18] text-white print:bg-white print:text-black pb-10 space-y-8 overflow-x-hidden w-full max-w-full"
    >
      <PageHeader
        title="Land Monitoring Projects"
        subtitle="Active AI surveillance projects across West Bengal."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            className="group rounded-3xl border border-emerald-500/20 bg-slate-900/70 backdrop-blur-xl overflow-hidden shadow-lg hover:border-emerald-400/60 transition-all duration-300"
          >
            <img
              src={project.image}
              alt={project.name}
              className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
            />

            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold">{project.name}</h2>
                  <p className="text-emerald-400 text-sm">
                    {project.district}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${project.risk === "Critical"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                >
                  {project.risk}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Agency</span>
                  <span>{project.agency}</span>
                </div>

                <div className="flex justify-between">
                  <span>Affected Area</span>
                  <span>{project.area}</span>
                </div>

                <div className="flex justify-between">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <button
                // onClick={() =>
                //   navigate("/gis", {
                //     state: {
                //       district: project.district,
                //       fromProjects: true,
                //     },
                //   })
                // }
                onClick={() =>
                  navigate("/prediction", {
                    state: {
                      district: project.district,
                      fromProjects: true,
                    },
                  })
                }
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 font-semibold text-slate-950 hover:brightness-110 transition"
              >
                Open GIS Workspace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}