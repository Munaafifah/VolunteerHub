const BASE_URL = "/api";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(buildErrorMessage(data));
  }

  return data;
}

function buildErrorMessage(data) {
  if (!data) {
    return "Something went wrong. Please try again.";
  }

  if (data.fieldErrors && data.fieldErrors.length > 0) {
    return data.fieldErrors.map((fe) => fe.message).join(" ");
  }

  return data.message || "Something went wrong. Please try again.";
}