import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  FolderKanban,
  FileText,
  AlertTriangle,
  Compass,
  ArrowRight,
  Hash,
  X,
  Layers,
} from "lucide-react";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchableItem {
  id: string;
  title: string;
  category: "District" | "Project" | "Cadastre Plot" | "Mouza" | "JL Number" | "Alert ID";
  path: string;
  subtitle: string;
  state?: Record<string, unknown>;
}

const SEARCH_DATABASE: SearchableItem[] = [
  // Districts
  { id: "dist-1", title: "South 24 Parganas", category: "District", path: "/heatmap", subtitle: "Critical Mangrove Buffer Zone · 94.2% Risk", state: { selectedDistrict: "South 24 Parganas" } },
  { id: "dist-2", title: "Howrah", category: "District", path: "/heatmap", subtitle: "River Corridor & Smart City Link · 91.5% Risk", state: { selectedDistrict: "Howrah" } },
  { id: "dist-3", title: "Paschim Bardhaman", category: "District", path: "/heatmap", subtitle: "Coal Mining Lease Peripheral Boundary · 96.8% Risk", state: { selectedDistrict: "Paschim Bardhaman" } },
  { id: "dist-4", title: "Purba Medinipur", category: "District", path: "/heatmap", subtitle: "Mandarmani Coastal Regulation Zone · 89.7% Risk", state: { selectedDistrict: "Purba Medinipur" } },
  { id: "dist-5", title: "Darjeeling", category: "District", path: "/heatmap", subtitle: "Senchal Wildlife Sanctuary Reserve · 88.3% Risk", state: { selectedDistrict: "Darjeeling" } },
  { id: "dist-6", title: "Kolkata", category: "District", path: "/heatmap", subtitle: "East Kolkata Wetlands Ramsar Site · 79.4% Risk", state: { selectedDistrict: "Kolkata" } },

  // Projects
  { id: "proj-1", title: "Durgapur Industrial Expressway Corridor", category: "Project", path: "/projects", subtitle: "NH-19 Expansion · 42.4 Ha · Land Acquisition Phase 2" },
  { id: "proj-2", title: "Sundarbans Coastal Mangrove Bio-Shield", category: "Project", path: "/projects", subtitle: "UNESCO Biosphere Reserve · 128 Ha Protected Area" },
  { id: "proj-3", title: "Howrah Freight Terminal Smart Link", category: "Project", path: "/projects", subtitle: "Eastern Dedicated Freight Corridor · 18.6 Ha" },
  { id: "proj-4", title: "Teesta Riparian Eco-Restoration", category: "Project", path: "/projects", subtitle: "Riparian Buffer & Floodplain Conservation · 64 Ha" },

  // Cadastre Plots
  { id: "plot-1", title: "Cadastre Plot #14 (Howrah RS)", category: "Cadastre Plot", path: "/gis", subtitle: "Encroachment Overlap 42m · Buffer Zone Breach" },
  { id: "plot-2", title: "Cadastre Plot #412/A, Khatian 89", category: "Cadastre Plot", path: "/gis", subtitle: "Raniganj Coal Peripheral Boundary · Forest Act Sec 26" },
  { id: "plot-3", title: "Plot #189, Mandarmani CRZ", category: "Cadastre Plot", path: "/gis", subtitle: "High-Tide Line 200m Buffer Zone · Stay Injunction" },
  { id: "plot-4", title: "Senchal Beat Plot #09", category: "Cadastre Plot", path: "/gis", subtitle: "Sub-Himalayan Reserve Forest Beat #3" },

  // Mouza
  { id: "mouza-1", title: "Mouza Gosaba IX", category: "Mouza", path: "/gis", subtitle: "South 24 Parganas · JL #42 · Tidal Mangrove Zone" },
  { id: "mouza-2", title: "Mouza Raniganj North", category: "Mouza", path: "/gis", subtitle: "Paschim Bardhaman · JL #18 · ECL Boundary Fringe" },
  { id: "mouza-3", title: "Mouza Howrah Municipal Zone", category: "Mouza", path: "/gis", subtitle: "Howrah Urban LAO Range · JL #73" },
  { id: "mouza-4", title: "Mouza Mandarmani Coastal Belt", category: "Mouza", path: "/gis", subtitle: "Purba Medinipur Coastal Range · JL #91" },
  { id: "mouza-5", title: "Mouza Senchal Wildlife Sanctuary", category: "Mouza", path: "/gis", subtitle: "Darjeeling Wildlife Division · JL #09" },

  // JL Numbers
  { id: "jl-1", title: "JL Number 42 (Gosaba)", category: "JL Number", path: "/gis", subtitle: "Revenue Jurisdiction: South 24 Parganas" },
  { id: "jl-2", title: "JL Number 18 (Raniganj)", category: "JL Number", path: "/gis", subtitle: "Revenue Jurisdiction: Paschim Bardhaman" },
  { id: "jl-3", title: "JL Number 73 (Howrah)", category: "JL Number", path: "/gis", subtitle: "Revenue Jurisdiction: Howrah Municipal Corporation" },
  { id: "jl-4", title: "JL Number 91 (Mandarmani)", category: "JL Number", path: "/gis", subtitle: "Revenue Jurisdiction: Purba Medinipur" },
  { id: "jl-5", title: "JL Number 09 (Senchal)", category: "JL Number", path: "/gis", subtitle: "Revenue Jurisdiction: Darjeeling Forest Division" },

  // Alert IDs
  { id: "alert-1", title: "ALT-WB-9018", category: "Alert ID", path: "/alerts", subtitle: "Mangrove Clearing & Commercial Aquaculture Bunding" },
  { id: "alert-2", title: "ALT-WB-9015", category: "Alert ID", path: "/alerts", subtitle: "Unauthorized Open-Cast Coal Boundary Earthmoving" },
  { id: "alert-3", title: "ALT-WB-9011", category: "Alert ID", path: "/alerts", subtitle: "River Corridor Encroachment Near Smart City Corridor" },
  { id: "alert-4", title: "ALT-WB-9008", category: "Alert ID", path: "/alerts", subtitle: "Dune Levelling & Unauthorized Resort Foundation" },
  { id: "alert-5", title: "ALT-WB-9004", category: "Alert ID", path: "/alerts", subtitle: "Teak & Sal Timber Logging in Senchal Buffer" },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return SEARCH_DATABASE.slice(0, 8);
    }
    const q = query.toLowerCase().trim();
    return SEARCH_DATABASE.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  const handleSelect = (item: SearchableItem) => {
    onClose();
    navigate(item.path, { state: item.state });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  const getCategoryIcon = (cat: SearchableItem["category"]) => {
    switch (cat) {
      case "District":
        return MapPin;
      case "Project":
        return FolderKanban;
      case "Cadastre Plot":
        return Layers;
      case "Mouza":
        return Compass;
      case "JL Number":
        return Hash;
      case "Alert ID":
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (cat: SearchableItem["category"]) => {
    switch (cat) {
      case "District":
        return "text-[#00F5C3] border-[#00F5C3]/40 bg-[#00F5C3]/10";
      case "Project":
        return "text-purple-400 border-purple-500/40 bg-purple-500/10";
      case "Cadastre Plot":
        return "text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/10";
      case "Mouza":
        return "text-amber-400 border-amber-500/40 bg-amber-500/10";
      case "JL Number":
        return "text-cyan-400 border-cyan-500/40 bg-cyan-500/10";
      case "Alert ID":
        return "text-[#FF4D6D] border-[#FF4D6D]/40 bg-[#FF4D6D]/10";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-mono select-none">
          {/* Backdrop with cyber blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050C18]/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#00F5C3]/40 bg-[#050C18]/95 shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(0,245,195,0.25)] backdrop-blur-2xl"
          >
            {/* Header / Search Input */}
            <div className="flex items-center gap-3 border-b border-slate-800/90 px-4 py-3.5">
              <Search className="h-5 w-5 text-[#00F5C3] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search District, Project, Cadastre Plot, Mouza, JL Number, Alert ID..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="flex items-center gap-1 rounded border border-slate-800 bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-400">
                <span>ESC</span>
              </div>
            </div>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 bg-[#081326]/60 px-4 py-2 text-[10px]">
              <span className="text-slate-500">FILTER:</span>
              {["District", "Project", "Cadastre Plot", "Mouza", "JL Number", "Alert ID"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setQuery(cat)}
                  className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-0.5 text-slate-400 hover:border-[#00F5C3]/40 hover:text-[#00F5C3] transition"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No matching surveillance entities found for &quot;{query}&quot;
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = getCategoryIcon(item.category);
                  const colorClass = getCategoryColor(item.category);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "border border-[#00F5C3]/50 bg-[#00F5C3]/15 text-white shadow-[0_0_15px_rgba(0,245,195,0.15)]"
                          : "border border-transparent hover:bg-slate-900/60 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${colorClass}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">
                              {item.title}
                            </span>
                            <span
                              className={`rounded border px-1.5 py-0.2 text-[9px] font-bold shrink-0 ${colorClass}`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-slate-500 pl-3">
                        <span className="text-[10px] hidden sm:inline">Navigate</span>
                        <ArrowRight
                          className={`h-3.5 w-3.5 transition-transform ${
                            isSelected ? "text-[#00F5C3] translate-x-1" : ""
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="flex items-center justify-between border-t border-slate-800/90 bg-[#050C18] px-4 py-2.5 text-[10px] text-slate-500">
              <div className="flex items-center gap-3">
                <span>&uarr;&darr; Navigate</span>
                <span>&crarr; Select</span>
                <span>ESC Close</span>
              </div>
              <span className="text-[#00F5C3] font-bold">
                ISRO / PM GATISHAKTI SURVEILLANCE INDEX
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
