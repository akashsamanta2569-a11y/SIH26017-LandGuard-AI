import { useState, useRef } from "react";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

interface TopbarProps {
  onOpenCommandPalette?: () => void;
}

export default function Topbar({ onOpenCommandPalette }: TopbarProps = {}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <header
      className="hidden md:flex shrink-0 items-center justify-between gap-4 sticky top-0 z-20 px-6 py-3 border-b transition-colors duration-200 print:hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* ── LEFT: Government Identity ── */}
      <div className="flex items-center gap-3 shrink-0 select-none">
        <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
          <GlobalOutlined className="text-teal-700 dark:text-teal-300" style={{ fontSize: 16 }} />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-teal-800 dark:text-teal-300 leading-none">
            MoRD · Government of India
          </p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-none mt-1">
            PM GatiShakti Spatial Intelligence
          </p>
        </div>
      </div>

      {/* ── CENTER: Quick Search ── */}
      <div className="flex-1 min-w-0 max-w-lg mx-4">
        <div
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all cursor-text text-xs"
          style={{
            backgroundColor: "var(--bg-card-subtle)",
            borderColor: searchFocused ? "#0F766E" : "var(--border-color)",
          }}
          onClick={() => {
            if (onOpenCommandPalette) {
              onOpenCommandPalette();
            } else {
              searchRef.current?.focus();
            }
          }}
        >
          <SearchOutlined style={{ color: searchFocused ? "#0F766E" : "#64748B" }} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search Project, Cadastre Plot, or District... (Ctrl + K)"
            onFocus={() => {
              if (onOpenCommandPalette) onOpenCommandPalette();
              setSearchFocused(true);
            }}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent border-none outline-none text-xs min-w-0"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ── RIGHT: Feeds, Alerts & User ── */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Feed Status Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>ISRO Bhuvan / S2 Live</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          title="14 Active Statutory Alerts"
          className="relative p-2 rounded-xl border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          style={{ borderColor: "var(--border-color)" }}
        >
          <BellOutlined style={{ fontSize: 15 }} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
        </button>

        {/* User Badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border select-none"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-card-subtle)",
          }}
        >
          <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">
            <UserOutlined />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-none">
              LAO Officer
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              West Bengal Div
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
