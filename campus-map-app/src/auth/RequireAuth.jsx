import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { C } from "../theme";

// Shows the page only to signed-in users when a backend is connected; sends
// everyone else to the login page and back here afterwards. With a role
// (e.g. "admin"), other signed-in users go to the map instead; without a
// backend there are no roles, so such pages aren't available at all.
export default function RequireAuth({ role, children }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "off") return role ? <Navigate to="/" replace /> : children;
  if (status === "signedIn") return !role || user.role === role ? children : <Navigate to="/" replace />;
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ background: C.paper, color: C.inkSoft }}>
        Loading…
      </div>
    );
  }
  return <Navigate to="/login" replace state={{ from: location }} />;
}
