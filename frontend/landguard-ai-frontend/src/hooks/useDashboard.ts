import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummary,
  getDepartmentChart,
  getStatusChart,
  getTopRiskDistricts,
} from "../api/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
    staleTime: 30_000,
  });
}

export function useDepartmentChart() {
  return useQuery({
    queryKey: ["dashboard", "department-chart"],
    queryFn: getDepartmentChart,
    staleTime: 60_000,
  });
}

export function useStatusChart() {
  return useQuery({
    queryKey: ["dashboard", "status-chart"],
    queryFn: getStatusChart,
    staleTime: 60_000,
  });
}

export function useTopRiskDistricts() {
  return useQuery({
    queryKey: ["dashboard", "top-risk-districts"],
    queryFn: getTopRiskDistricts,
    staleTime: 60_000,
  });
}
