import api from "./axios";

export const getHeatmap = async () => {
  const res = await api.get("/gis/heatmap");
  return res.data;
};
