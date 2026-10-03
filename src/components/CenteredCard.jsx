import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { C } from "../theme";

/**
 * Modal card centered over a dimmed backdrop. Closes with the X button,
 * a backdrop click, or Escape. `width` is a Tailwind max-width class.
 */
export default function CenteredCard({ onClose, label, width = "max-w-md", children }) {
  const closeRef = useRef(null);
  // Keep the latest onClose without re-running the effect below.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
      style={{ background: "rgba(35, 26, 41, 0.55)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative w-full ${width} max-h-[90dvh] overflow-y-auto p-5 md:p-6 rounded-xl shadow-2xl`}
        style={{ background: C.ink, color: C.paper, borderTop: `4px solid ${C.brand}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full opacity-80 hover:opacity-100 z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
