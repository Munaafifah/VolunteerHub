import { apiRequest } from "./client";

export function getPopularActivities(limit, token) {
  return apiRequest(`/reports/popular-activities?limit=${limit}`, { token });
}