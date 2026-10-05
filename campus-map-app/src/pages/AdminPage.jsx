import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Upload, UserPlus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { SCHOOL } from "../data/campuses";
import * as adminApi from "../api/admin";
import { csvToEntries } from "../utils/csv";
import { C } from "../theme";

// Admin dashboard: who may register (the allowlist), and their status.
const PAGE_SIZE = 50;
const ROLES = ["student", "faculty", "staff"];
const STATUS_STYLE = {
  approved: { background: "#E7F6EC", color: "#1E7A3E" },
  pending: { background: "#FFF4DE", color: "#8A5A00" },
  blocked: { background: "#FDECEC", color: "#B42318" },
};
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const inputClass = "rounded-md border px-3 py-2 md:py-2.5 text-sm md:text-base outline-none waygo-input";
const inputStyle = { borderColor: C.line, background: "#FFFFFF", color: C.ink };
const buttonClass = "rounded-md border px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base font-medium waygo-hover-tint disabled:opacity-50";
const buttonStyle = { borderColor: C.brandLine, color: C.brandDark, background: "#FFFFFF" };
const smallButtonClass = "rounded border px-2 md:px-2.5 py-1 md:py-1.5 text-xs md:text-sm font-medium waygo-hover-tint disabled:opacity-50 whitespace-nowrap";

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border px-4 py-3 md:px-5 md:py-4" style={{ background: "#FFFFFF", borderColor: C.line }}>
      <div className="text-xs md:text-sm" style={{ color: C.inkSoft }}>
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {value ?? "–"}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null); // { kind: "ok" | "error", text }
  const [form, setForm] = useState({ schoolId: "", fullName: "", role: "student" });
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef(null);

  const showError = (err) => setMessage({ kind: "error", text: err.message });

  const loadStats = useCallback(() => adminApi.fetchStats().then(setStats).catch(showError), []);

  const loadEntries = useCallback(
    async (offset = 0) => {
      setLoading(true);
      try {
        const page = await adminApi.fetchAllowlist({ q: query.trim(), status, limit: PAGE_SIZE, offset });
        setEntries((prev) => (offset === 0 ? page.entries : [...prev, ...page.entries]));
        setTotal(page.total);
      } catch (err) {
        showError(err);
      } finally {
        setLoading(false);
      }
    },
    [query, status]
  );

  // Reload when the search or filter changes (after a pause in typing).
  useEffect(() => {
    const t = setTimeout(() => loadEntries(0), 250);
    return () => clearTimeout(t);
  }, [loadEntries]);

  useEffect(() => {
    const t = setTimeout(loadStats, 0);
    return () => clearTimeout(t);
  }, [loadStats]);

  async function onAdd(e) {
    e.preventDefault();
    if (!form.schoolId.trim() || !form.fullName.trim()) {
      setMessage({ kind: "error", text: "Enter the student or employee ID and the full name." });
      return;
    }
    setAdding(true);
    try {
      const { entry } = await adminApi.addEntry({ ...form, status: "approved" });
      setMessage({ kind: "ok", text: `Added ${entry.fullName} (${entry.schoolId}). They can register now.` });
      setForm({ schoolId: "", fullName: "", role: form.role });
      loadEntries(0);
      loadStats();
    } catch (err) {
      showError(err);
    } finally {
      setAdding(false);
    }
  }

  async function onImport(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const list = csvToEntries(await file.text());
      if (list.length === 0) throw new Error("That file has no rows to import.");
      const { added, skipped, errors } = await adminApi.importEntries(list);
      const parts = [`Added ${added}`];
      if (skipped) parts.push(`skipped ${skipped} already on the list`);
      if (errors.length) {
        const rows = errors.slice(0, 5).map((er) => `row ${er.row}: ${er.message}`).join("; ");
        parts.push(`${errors.length} with problems (${rows}${errors.length > 5 ? "; …" : ""})`);
      }
      setMessage({ kind: errors.length ? "error" : "ok", text: `${parts.join(", ")}.` });
      loadEntries(0);
      loadStats();
    } catch (err) {
      showError(err);
    } finally {
      setImporting(false);
    }
  }

  async function act(entry, action) {
    if (action === "reset" && !window.confirm(`Delete ${entry.fullName}'s account so they can register again?`)) return;
    if (action === "remove" && !window.confirm(`Remove ${entry.fullName} from the allowlist? Their account is deleted too.`)) return;
    setBusyId(entry.id);
    try {
      if (action === "reset") {
        await adminApi.resetRegistration(entry.id);
        setEntries((list) => list.map((x) => (x.id === entry.id ? { ...x, registered: false, email: null } : x)));
        setMessage({ kind: "ok", text: `${entry.fullName} can register again.` });
      } else if (action === "remove") {
        await adminApi.removeEntry(entry.id);
        setEntries((list) => list.filter((x) => x.id !== entry.id));
        setTotal((n) => n - 1);
        setMessage({ kind: "ok", text: `Removed ${entry.fullName}.` });
      } else {
        const { entry: updated } = await adminApi.updateEntry(entry.id, { status: action });
        setEntries((list) => list.map((x) => (x.id === entry.id ? updated : x)));
        const verb = { approved: "Approved", blocked: "Blocked" }[action];
        setMessage({ kind: "ok", text: `${verb} ${entry.fullName}.` });
      }
      loadStats();
    } catch (err) {
      showError(err);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ background: C.paper, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <PageHeader
        crumbs={[
          { label: SCHOOL, to: "/" },
          { label: "Admin", to: "/admin" },
        ]}
        backTo="/"
        backLabel="Campus map"
      />
      <main className="px-4 py-5 md:px-6 md:py-8 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-3xl font-semibold mb-5 md:mb-8 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Admin dashboard
        </h1>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" aria-label="Summary">
          <Stat label="On the allowlist" value={stats?.total} />
          <Stat label="Registered" value={stats?.registered} />
          <Stat label="Pending approval" value={stats?.pending} />
          <Stat label="Blocked" value={stats?.blocked} />
        </section>

        <section className="rounded-lg border p-4 md:p-6 mb-4 md:mb-6" style={{ background: "#FFFFFF", borderColor: C.line }}>
          <h2 className="text-base md:text-lg font-semibold mb-3">Add people</h2>
          <form onSubmit={onAdd} className="flex flex-col sm:flex-row gap-2" noValidate>
            <input
              aria-label="Student or employee ID"
              placeholder="Student or employee ID"
              className={`${inputClass} sm:w-48`}
              style={inputStyle}
              value={form.schoolId}
              onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
            />
            <input
              aria-label="Full name"
              placeholder="Full name"
              className={`${inputClass} flex-1`}
              style={inputStyle}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <select
              aria-label="Role"
              className={inputClass}
              style={inputStyle}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {capitalize(r)}
                </option>
              ))}
            </select>
            <button type="submit" disabled={adding} className={`${buttonClass} flex items-center justify-center gap-1.5`} style={buttonStyle}>
              <UserPlus size={16} />
              {adding ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              disabled={importing}
              onClick={() => fileRef.current?.click()}
              className={`${buttonClass} flex items-center justify-center gap-1.5`}
              style={buttonStyle}
            >
              <Upload size={16} />
              {importing ? "Importing…" : "Import CSV"}
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={onImport} />
          </form>
          <p className="text-xs md:text-sm mt-2" style={{ color: C.inkSoft }}>
            CSV columns: ID, full name, role (student, faculty or staff; optional). A header row is fine. IDs already on the list are
            skipped.
          </p>
        </section>

        {message && (
          <div
            role={message.kind === "error" ? "alert" : "status"}
            className="rounded-md px-3 py-2 md:px-4 md:py-3 mb-4 text-sm md:text-base flex justify-between gap-3"
            style={message.kind === "error" ? STATUS_STYLE.blocked : { background: C.brandTint, color: C.brandDark }}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} aria-label="Dismiss" className="shrink-0 font-semibold">
              ×
            </button>
          </div>
        )}

        <section className="rounded-lg border" style={{ background: "#FFFFFF", borderColor: C.line }}>
          <div className="flex flex-col sm:flex-row gap-2 p-4 border-b" style={{ borderColor: C.line }}>
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.inkSoft }} />
              <input
                aria-label="Search by name or ID"
                placeholder="Search by name or ID"
                className={`${inputClass} w-full pl-9`}
                style={inputStyle}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select aria-label="Filter by status" className={inputClass} style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-[15px] min-w-[760px]">
              <thead>
                <tr className="text-left" style={{ color: C.inkSoft }}>
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Role</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Account</th>
                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const busy = busyId === entry.id;
                  return (
                    <tr key={entry.id} className="border-t" style={{ borderColor: C.line }}>
                      <td className="px-4 py-2.5 md:py-3 font-mono text-xs md:text-sm">{entry.schoolId}</td>
                      <td className="px-4 py-2.5 md:py-3">{entry.fullName}</td>
                      <td className="px-4 py-2.5 md:py-3">{capitalize(entry.role)}</td>
                      <td className="px-4 py-2.5 md:py-3">
                        <span className="text-xs md:text-sm font-medium px-2 py-0.5 rounded" style={STATUS_STYLE[entry.status]}>
                          {capitalize(entry.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 md:py-3" style={{ color: entry.registered ? C.ink : C.inkSoft }}>
                        {entry.registered ? entry.email : "Not registered"}
                      </td>
                      <td className="px-4 py-2.5 md:py-3">
                        <div className="flex justify-end gap-1.5">
                          {entry.status === "pending" && (
                            <button disabled={busy} onClick={() => act(entry, "approved")} className={smallButtonClass} style={buttonStyle}>
                              Approve
                            </button>
                          )}
                          {entry.status === "approved" && (
                            <button disabled={busy} onClick={() => act(entry, "blocked")} className={smallButtonClass} style={buttonStyle}>
                              Block
                            </button>
                          )}
                          {entry.status === "blocked" && (
                            <button disabled={busy} onClick={() => act(entry, "approved")} className={smallButtonClass} style={buttonStyle}>
                              Unblock
                            </button>
                          )}
                          {entry.registered && (
                            <button disabled={busy} onClick={() => act(entry, "reset")} className={smallButtonClass} style={buttonStyle}>
                              Reset account
                            </button>
                          )}
                          <button
                            disabled={busy}
                            onClick={() => act(entry, "remove")}
                            className={smallButtonClass}
                            style={{ ...buttonStyle, color: "#B42318", borderColor: "#F3C4C0" }}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-between text-sm md:text-base" style={{ borderColor: C.line, color: C.inkSoft }}>
            <span>
              {loading && entries.length === 0
                ? "Loading…"
                : total === 0
                  ? query || status
                    ? "No one matches that search."
                    : "No one on the allowlist yet. Add people above."
                  : `Showing ${entries.length} of ${total}`}
            </span>
            {entries.length < total && (
              <button disabled={loading} onClick={() => loadEntries(entries.length)} className={buttonClass} style={buttonStyle}>
                {loading ? "Loading…" : "Show more"}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
