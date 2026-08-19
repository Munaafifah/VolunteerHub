import { apiRequest } from "./client";

export function createRegistration(activityId, token) {
  return apiRequest("/registrations", {
    method: "POST",
    body: { activityId },
    token
  });
}

export function getMyRegistrations(token) {
  return apiRequest("/registrations/my", { token });
}

export function cancelRegistration(id, token) {
  return apiRequest(`/registrations/${id}`, {
    method: "DELETE",
    token
  });
}