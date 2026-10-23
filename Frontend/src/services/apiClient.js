const API_URL = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function mediaUrl(path) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/api/v1/")) {
    if (API_URL.startsWith("http")) return `${new URL(API_URL).origin}${path}`;
    return path;
  }
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiClient(endpoint, options = {}) {
  const { headers: suppliedHeaders, body, ...requestOptions } = options;
  const headers = new Headers(suppliedHeaders);
  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...requestOptions,
      body,
      headers,
      credentials: "include",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "network_error", "Unable to reach the Uni Vibe server.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail = payload?.error;
    throw new ApiError(
      response.status,
      detail?.code || "request_failed",
      detail?.message || `Request failed (${response.status}).`
    );
  }
  if (response.status === 204) return null;
  return response.json();
}

export default apiClient;
