const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export async function apiClient(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default apiClient;
