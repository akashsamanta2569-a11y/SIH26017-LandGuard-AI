import { Tag } from "antd";
import { SEVERITY_CONFIG } from "../../utils/constants";
import type { AlertSeverity } from "../../types";

interface SeverityBadgeProps {
  severity: AlertSeverity;
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  return (
    <Tag
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}33`,
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        padding: "1px 8px",
      }}
    >
      {config.label}
    </Tag>
  );
}
