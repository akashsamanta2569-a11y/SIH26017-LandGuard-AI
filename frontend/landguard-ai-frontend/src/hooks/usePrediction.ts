import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadPredictionImage, getPredictionHistory } from "../api/prediction";

export function usePredictionHistory() {
  return useQuery({
    queryKey: ["prediction", "history"],
    queryFn: getPredictionHistory,
    staleTime: 60_000,
  });
}

export function useUploadPrediction() {
  return useMutation({
    mutationFn: (file: File) => uploadPredictionImage(file),
  });
}
