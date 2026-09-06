import type { ChangeEvent } from "react";

type AIUploadPanelProps = {
  uploadedImage: string | null;
  onImageUpload: (image: string) => void;
  onRunDetection: () => void;
  isScanning: boolean;
};

export default function AIUploadPanel({
  uploadedImage,
  onImageUpload,
  onRunDetection,
  isScanning,
}: AIUploadPanelProps) {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    onImageUpload(imageUrl);
  };

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-5 space-y-5">
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400">
          Upload Station
        </p>

        <h2 className="text-xl font-bold text-white mt-2">
          Satellite Intelligence
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          Upload Sentinel-2, Cartosat-3 or Drone imagery for AI detection.
        </p>
      </div>

      <label className="cursor-pointer block rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-6 text-center hover:border-emerald-400 transition">
        <p className="text-emerald-400 font-semibold">Browse Files</p>
        <p className="text-xs text-slate-500 mt-1">
          PNG • JPG • TIFF • GeoTIFF
        </p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isScanning}
        />
      </label>

      {uploadedImage && (
        <img
          src={uploadedImage}
          alt="Preview"
          className="w-full h-28 rounded-xl object-cover border border-emerald-500/30"
        />
      )}

      <button
        onClick={onRunDetection}
        disabled={!uploadedImage || isScanning}
        className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 font-bold text-black disabled:opacity-60"
      >
        {isScanning ? "Scanning Satellite Image..." : "Run AI Detection"}
      </button>
    </div>
  );
}