import { useEffect, useState } from "react";

/**
 * Full-window mode for a map. While expanded, Esc closes it and the page
 * behind doesn't scroll.
 *
 * Returns [expanded, toggle].
 */
export function useExpandable() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e) => e.key === "Escape" && setExpanded(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return [expanded, () => setExpanded((v) => !v)];
}

// Classes for the element that fills the window while expanded. It sits
// above the page header but below room cards and photo viewers.
export const EXPANDED_CLASS = "fixed inset-0 z-[1060] flex flex-col p-2 md:p-4";
