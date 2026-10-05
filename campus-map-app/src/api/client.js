// All requests to the WayGo backend go through here.
//
// Set VITE_API_URL (see .env.example) to the backend's address. When it's
// empty the app runs without a backend: no login, and every page is open.

export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const hasBackend = API_URL !== "";

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api(path, { method = "GET", body, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      // The backend keeps the session in an httpOnly cookie, so the browser
      // must send it with every request. No token is stored in JavaScript.
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.message || `Request failed (${res.status})`, data);
  }
  return data;
}
