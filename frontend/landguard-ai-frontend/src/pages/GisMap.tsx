import { useState, useEffect } from "react";
import GISHeroNew from "../components/gis/GISHeroNew";
import GISMapCanvas from "../components/gis/GISMapCanvas";
import LayerControlPanel from "../components/gis/LayerControlPanel";
import DistrictInspector from "../components/gis/DistrictInspector";
import TimelineComparison from "../components/gis/TimelineComparison";
import SHAPInsightPanel from "../components/gis/SHAPInsightPanel";
import AIRecommendationPanel from "../components/gis/AIRecommendationPanel";
import GISExportPanel from "../components/gis/GISExportPanel";

export default function GisMap() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("landguard-theme") as "dark" | "light") ?? "light";
  });
  const [selectedDistrict, setSelectedDistrict] = useState("All 23 Districts");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync theme with root document so CSS variables apply globally
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("theme-light");
      root.classList.remove("theme-dark");
    } else {
      root.classList.add("theme-dark");
      root.classList.remove("theme-light");
    }
    localStorage.setItem("landguard-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div
      id="landguard-report"
      className="min-h-screen bg-[#050C18] text-white print:bg-white print:text-black relative w-full max-w-[1720px] mx-auto space-y-6 pb-12 transition-colors duration-200"
    >
      {/* ══════════════════════════════════════════════════════════
          SECTION 1 + 2: Minimal Government Header & 6 KPI Cards
      ══════════════════════════════════════════════════════════ */}
      <GISHeroNew
        theme={theme}
        onThemeToggle={toggleTheme}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: Main Content (70% Large GIS Map + 30% Right-side District Inspector)
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 70% Leaflet GIS Map */}
        <div className="lg:col-span-8 w-full min-w-0">
          <GISMapCanvas
            theme={theme}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
          />
        </div>

        {/* 30% District Intelligence Sidebar Inspector */}
        <div className="lg:col-span-4 w-full min-w-0">
          <DistrictInspector
            districtName={selectedDistrict === "All 23 Districts" ? "North 24 Parganas" : selectedDistrict}
            theme={theme}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: Layer Control (Simple Checkbox Panel)
      ══════════════════════════════════════════════════════════ */}
      <div>
        <LayerControlPanel theme={theme} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: Timeline Comparison (Before/After Satellite Slider)
      ══════════════════════════════════════════════════════════ */}
      <div>
        <TimelineComparison theme={theme} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6 + 7: SHAP Explainability & AI Recommendation Cards
      ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Section 6: SHAP Feature Importance Chart (5 cols) */}
        <div className="lg:col-span-5">
          <SHAPInsightPanel theme={theme} />
        </div>

        {/* Section 7: AI Recommendation Cards (7 cols: High / Medium / Monitoring) */}
        <div className="lg:col-span-7">
          <AIRecommendationPanel theme={theme} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 8: Export Panel (PDF, CSV, GeoJSON, Share)
      ══════════════════════════════════════════════════════════ */}
      <div>
        <GISExportPanel theme={theme} />
      </div>
    </div>
  );
}