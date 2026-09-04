import api from "./axios";

export const getLiveAlerts = async () => {
  const res = await api.get("/alerts/live");
  return res.data;
};