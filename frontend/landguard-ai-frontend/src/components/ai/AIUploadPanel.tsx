import { Upload, Satellite, Drone, ImageIcon, ScanSearch } from "lucide-react";

export default function AIUploadPanel() {
  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-slate-950/70 backdrop-blur-xl p-5 h-[560px] flex flex-col justify-between">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Upload className="w-5 h-5 text-emerald-400" />
          </div>

          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400">
              Upload Station
            </p>

            <h3 className="text-white font-bold">
              Satellite Intelligence
            </h3>
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Upload Sentinel-2, Cartosat-3 or Drone imagery for automatic AI encroachment detection.
        </p>

        {/* Upload Box */}
        <div className="border border-dashed border-emerald-500/30 rounded-2xl bg-emerald-500/5 p-6 text-center hover:border-emerald-400 transition">

          <Upload className="mx-auto w-9 h-9 text-emerald-400 mb-3" />

          <p className="text-white font-semibold text-sm">
            Drag & Drop Image
          </p>

          <p className="text-xs text-slate-500 mt-1">
            PNG • JPG • TIFF • GeoTIFF
          </p>

          <button className="mt-4 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2 transition">
            Browse Files
          </button>
        </div>

        {/* Sources */}
        <div className="mt-6 space-y-3">

          <SourceRow
            icon={<Satellite className="w-4 h-4 text-cyan-400" />}
            title="Sentinel-2 MSI"
            subtitle="10m Multispectral"
            color="cyan"
          />

          <SourceRow
            icon={<Satellite className="w-4 h-4 text-purple-400" />}
            title="Cartosat-3 PAN"
            subtitle="0.28m Panchromatic"
            color="purple"
          />

          <SourceRow
            icon={<Drone className="w-4 h-4 text-amber-400" />}
            title="Drone RGB Survey"
            subtitle="Ultra HD Survey Image"
            color="amber"
          />

          <SourceRow
            icon={<ImageIcon className="w-4 h-4 text-emerald-400" />}
            title="GeoTIFF Parcel Image"
            subtitle="GIS Coordinate Enabled"
            color="emerald"
          />

        </div>
      </div>

      {/* Bottom Scan Button */}
      <button className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold py-3 flex items-center justify-center gap-2 hover:brightness-110 transition">
        <ScanSearch className="w-5 h-5" />
        Run AI Detection
      </button>

    </div>
  );
}

function SourceRow({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: "cyan" | "purple" | "amber" | "emerald";
}) {
  const glow = {
    cyan: "border-cyan-500/20 bg-cyan-500/5",
    purple: "border-purple-500/20 bg-purple-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
    emerald: "border-emerald-500/20 bg-emerald-500/5",
  };

  return (
    <div className={`rounded-xl border ${glow[color]} p-3 flex items-center gap-3`}>
      <div>{icon}</div>

      <div>
        <p className="text-white text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}