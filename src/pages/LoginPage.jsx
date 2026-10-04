import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { C } from "../theme";

// Shared login for students, faculty, staff and admins: a student ID or an
// email address, plus a password. The backend decides the role.
export default function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Back to the page that sent the user here (keeping its search state).
  const from = location.state?.from;
  const backTo = from ? from.pathname + from.search : "/";

  if (status === "off" || status === "signedIn") {
    return <Navigate to={backTo} replace state={from?.state} />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your student ID or email, and your password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await login(identifier.trim(), password);
      navigate(backTo, { replace: true, state: from?.state });
    } catch (err) {
      // Same message for a wrong ID and a wrong password, so the form can't
      // be used to find out which accounts exist.
      setError(err.status === 401 ? "Wrong student ID, email, or password." : err.message);
      setSubmitting(false);
    }
  }

  const inputClass = "w-full rounded-md border px-3 py-2.5 text-base outline-none waygo-input";
  const inputStyle = { borderColor: C.line, background: "#FFFFFF", color: C.ink };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{ background: C.paper, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif", borderTop: `3px solid ${C.brand}` }}
    >
      <main className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src="/WayGo-logo.svg" alt="" className="w-14 h-14 mb-2" />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.brandDark }}>
            WayGo
          </h1>
          <p className="text-sm" style={{ color: C.inkSoft }}>
            Log in to the campus map
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="rounded-lg border p-5 sm:p-6" style={{ background: "#FFFFFF", borderColor: C.line }}>
          <label htmlFor="identifier" className="block text-sm font-medium mb-1.5">
            Student ID or email
          </label>
          <input
            id="identifier"
            autoComplete="username"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError("");
            }}
            className={inputClass}
            style={inputStyle}
          />

          <label htmlFor="password" className="block text-sm font-medium mb-1.5 mt-4">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className={inputClass}
            style={inputStyle}
          />

          {error && (
            <p role="alert" className="text-sm mt-3" style={{ color: "#B42318" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-5 rounded-md py-2.5 font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: C.brand }}
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>
      </main>
    </div>
  );
}
