import { api } from "./client";

// Allowlist management (admins only). An entry is
// { id, schoolId, fullName, role, status, registered, email, createdAt }.

export const fetchStats = () => api("/admin/stats");

export function fetchAllowlist({ q = "", status = "", limit = 100, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  return api(`/admin/allowlist?${params}`);
}

export const addEntry = (entry) => api("/admin/allowlist", { method: "POST", body: entry });

// entries: [{ schoolId, fullName, role }]. Returns { added, skipped, errors }.
export const importEntries = (entries) => api("/admin/allowlist/import", { method: "POST", body: { entries } });

export const updateEntry = (id, changes) => api(`/admin/allowlist/${id}`, { method: "PATCH", body: changes });

export const resetRegistration = (id) => api(`/admin/allowlist/${id}/reset-registration`, { method: "POST" });

export const removeEntry = (id) => api(`/admin/allowlist/${id}`, { method: "DELETE" });
