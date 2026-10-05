import { Navigation, X } from "lucide-react";
import { C } from "../theme";

// Directions shown over the top of a map while a route is active.
export default function RouteBanner({ children, onClose }) {
  return (
    <div className="absolute top-2 left-12 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-lg z-[1000] flex items-start gap-2 rounded-md px-3 py-2 text-sm shadow-md"
      style={{ background: "#FFFFFF", border: `1px solid ${C.brandLine}`, color: C.ink }}
      role="status"
    >
      <Navigation size={18} className="shrink-0 mt-0.5" style={{ color: C.brand }} />
      <div className="flex-1">{children}</div>
      <button onClick={onClose} aria-label="End directions" className="shrink-0 rounded p-0.5 waygo-hover-tint" style={{ color: C.inkSoft }}>
        <X size={18} />
      </button>
    </div>
  );
}
