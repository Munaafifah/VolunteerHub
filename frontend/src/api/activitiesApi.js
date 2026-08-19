import { apiRequest } from "./client";

export function getPagedActivities(params, token) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  return apiRequest(`/activities/paged?${query.toString()}`, { token });
}

export function getActivityById(id, token) {
  return apiRequest(`/activities/${id}`, { token });
}