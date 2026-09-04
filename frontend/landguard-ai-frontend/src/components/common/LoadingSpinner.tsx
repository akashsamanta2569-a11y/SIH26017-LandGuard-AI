import { Spin } from "antd";
import { COLORS } from "../../utils/constants";

interface LoadingSpinnerProps {
  tip?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  tip = "Loading…",
  fullPage = false,
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-3 z-50"
        style={{ background: COLORS.background }}
      >
        <Spin size="large" />
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {tip}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12">
      <Spin size="default" />
      <p className="text-xs" style={{ color: COLORS.muted }}>
        {tip}
      </p>
    </div>
  );
}
