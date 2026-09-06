import type { AlertItem } from "../types/alert";

const STORAGE_KEY = "landguard-alerts";

export const getAlerts = (): AlertItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addAlert = (alert: AlertItem) => {
  const alerts = getAlerts();

  alerts.unshift(alert);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
};