import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { C } from "../theme";

const ROLE_LABEL = { student: "Student", faculty: "Faculty", staff: "Staff", admin: "Admin" };

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

// Avatar button with the signed-in user's details and Log out. Renders
// nothing when no one is signed in (or there's no backend yet).
export default function ProfileMenu() {
  const { status, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (status !== "signedIn" || !user) return null;

  async function onLogout() {
    setLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account: ${user.name}`}
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
        style={{ background: C.brand, fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {initials(user.name)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-lg border shadow-lg overflow-hidden z-[1100]"
          style={{ background: "#FFFFFF", borderColor: C.line }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: C.line }}>
            <div className="font-semibold truncate">{user.name}</div>
            {(user.studentId || user.email) && (
              <div className="text-sm truncate" style={{ color: C.inkSoft }}>
                {user.studentId || user.email}
              </div>
            )}
            {user.role && (
              <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded" style={{ background: C.brandTint, color: C.brandDark }}>
                {ROLE_LABEL[user.role] || user.role}
              </span>
            )}
          </div>
          {user.role === "admin" && (
            <Link
              role="menuitem"
              to="/admin"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium waygo-hover-tint border-b"
              style={{ color: C.brandDark, borderColor: C.line }}
            >
              <LayoutDashboard size={16} />
              Admin dashboard
            </Link>
          )}
          <button
            role="menuitem"
            onClick={onLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-left waygo-hover-tint disabled:opacity-60"
            style={{ color: C.brandDark }}
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
