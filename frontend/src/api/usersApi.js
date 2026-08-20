import { apiRequest } from "./client";

export function getAllUsers(token) {
  return apiRequest("/users", { token });
}