import { useEffect, useState } from "react";

// Light or dark theme. The choice is saved in this browser and set on
// <html data-theme>. index.html sets it before the app loads so the page
// doesn't flash the wrong colors.
const KEY = "waygo-theme";

function readTheme() {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // Storage blocked (e.g. private browsing): the choice just isn't remembered.
    }
  }, [theme]);

  return [theme, setTheme];
}
