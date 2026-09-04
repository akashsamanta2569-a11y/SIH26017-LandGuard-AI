import { useQuery } from "@tanstack/react-query";
import { getHeatmap } from "../api/gis";

export function useHeatmap() {
  return useQuery({
    queryKey: ["gis", "heatmap"],
    queryFn: getHeatmap,
    staleTime: 120_000,
  });
}
