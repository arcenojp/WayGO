import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { C } from "../theme";

// Shows the page only to signed-in users when a backend is connected; sends
// everyone else to the login page and back here afterwards.
export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "off" || status === "signedIn") return children;
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ background: C.paper, color: C.inkSoft }}>
        Loading…
      </div>
    );
  }
  return <Navigate to="/login" replace state={{ from: location }} />;
}
