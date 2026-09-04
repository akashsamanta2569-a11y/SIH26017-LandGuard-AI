import { AlertTriangle } from "lucide-react";
import { Button } from "antd";
import { COLORS } from "../../utils/constants";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <AlertTriangle size={40} style={{ color: COLORS.red }} />
      <p className="text-sm text-center max-w-xs" style={{ color: COLORS.muted }}>
        {message}
      </p>
      {onRetry && (
        <Button
          size="small"
          onClick={onRetry}
          style={{
            background: COLORS.primary,
            color: "#fff",
            border: "none",
            borderRadius: 8,
          }}
        >
          Retry
        </Button>
      )}
    </div>
  );
}
