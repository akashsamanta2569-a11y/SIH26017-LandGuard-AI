import { useQuery } from "@tanstack/react-query";
import { getLiveAlerts } from "../api/alerts";

export function useLiveAlerts() {
  return useQuery({
    queryKey: ["alerts", "live"],
    queryFn: getLiveAlerts,
    refetchInterval: 30_000, // auto-refresh every 30s
    staleTime: 15_000,
  });
}
