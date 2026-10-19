import { Maximize2, Minimize2 } from "lucide-react";
import { RAW } from "../theme";

/**
 * Full-screen toggle shown under the map's zoom buttons, styled to match them.
 */
export default function ExpandMapButton({ expanded, onToggle }) {
  const label = expanded ? "Exit full screen" : "View map full screen";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="absolute left-[10px] top-[84px] z-[1000] flex h-[34px] w-[34px] items-center justify-center rounded-[4px] bg-white waygo-hover-tint"
      style={{ border: "2px solid rgba(0,0,0,0.2)", backgroundClip: "padding-box", color: RAW.ink }}
    >
      {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
    </button>
  );
}
