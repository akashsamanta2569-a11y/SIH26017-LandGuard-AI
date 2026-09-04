import api from "./axios";

export const uploadPredictionImage = async (file: File) => {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/predict/image", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getPredictionHistory = async () => {
  const res = await api.get("/predict/history");
  return res.data;
};