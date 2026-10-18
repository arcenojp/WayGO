import { useEffect, useState } from "react";

// True while the window matches the CSS media query.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);
  return matches;
}

// Wide screens get the sidebar layout (see AppShell).
export const WIDE_QUERY = "(min-width: 1024px)";
