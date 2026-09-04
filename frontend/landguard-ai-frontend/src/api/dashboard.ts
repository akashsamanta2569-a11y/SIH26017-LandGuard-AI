import api from "./axios";

export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};

export const getDepartmentChart = async () => {
  const res = await api.get("/dashboard/department-chart");
  return res.data;
};

export const getStatusChart = async () => {
  const res = await api.get("/dashboard/status-chart");
  return res.data;
};

export const getTopRiskDistricts = async () => {
  const res = await api.get("/dashboard/top-risk-districts");
  return res.data;
};