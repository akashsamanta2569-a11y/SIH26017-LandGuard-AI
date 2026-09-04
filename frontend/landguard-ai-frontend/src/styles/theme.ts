import type { ThemeConfig } from "antd";
import { theme } from "antd";

// ─── Legacy light colours (kept for reference, prefer COLORS from constants.ts)
export const colors = {
  primary: "#10B981",
  darkGreen: "#059669",
  lightGreen: "#6EE7B7",

  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#2563EB",

  background: "#090D16",
  surface: "#101826",
};

// ─── Ant Design dark theme config ────────────────────────────────────────────
export const antdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgBase: "#090D16",
    colorBgContainer: "#111827",
    colorBgElevated: "#101826",
    colorBorder: "#1F2937",
    colorPrimary: "#10B981",
    colorSuccess: "#10B981",
    colorWarning: "#F59E0B",
    colorError: "#EF4444",
    colorInfo: "#2563EB",
    colorText: "#F9FAFB",
    colorTextSecondary: "#94A3B8",
    borderRadius: 10,
    fontFamily: "'Inter', sans-serif",
  },
};