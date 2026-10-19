import {
  DoorOpen,
  Briefcase,
  FlaskConical,
  Bath,
  MoveVertical,
  BookOpen,
  Dumbbell,
  BedDouble,
} from "lucide-react";

/*
  WayGo palette, based on the logo color (#C331C1).

  paper       page background; paperDark behind maps
  surface     cards, menus and text fields
  ink         text; inkSoft for secondary text
  brand       logo magenta: selected states, map shapes, highlights
  brandDark   magenta for text and icons
  brandTint   light magenta backgrounds (hover, focus)
  brandLine   light magenta borders
  amber       stairwells only
  danger      errors and destructive buttons
  accent, accentSoft are aliases of brandDark, brandTint.

  Most colors are CSS variables so they follow the light or dark theme
  (set in index.css, chosen in themeMode.js). brand, amber and the greens
  are the same in both themes. The maps stay light in both themes, and map
  layers drawn with SVG attributes can't read CSS variables, so they use RAW.
*/
export const RAW = {
  paper: "#FBF9FB",
  paperDark: "#F2EEF3",
  ink: "#231A29",
  brand: "#C331C1",
  brandDark: "#8E1F8C",
};

export const C = {
  paper: "var(--c-paper)",
  paperDark: "var(--c-paper-dark)",
  surface: "var(--c-surface)",
  ink: "var(--c-ink)",
  inkSoft: "var(--c-ink-soft)",
  line: "var(--c-line)",
  stone: "var(--c-stone)",
  stoneHover: "var(--c-stone-hover)",
  green: "#A7D2AF",
  greenLine: "#6FA47E",
  brand: RAW.brand,
  brandDark: "var(--brand-dark)",
  brandTint: "var(--brand-tint)",
  brandLine: "var(--brand-line)",
  accent: "var(--brand-dark)",
  accentSoft: "var(--brand-tint)",
  amber: "#D89B3C",
  danger: "var(--c-danger)",
  dangerLine: "var(--c-danger-line)",
};

export const ROOM_ICON = {
  classroom: BookOpen,
  lab: FlaskConical,
  office: Briefcase,
  restroom: Bath,
  stairs: MoveVertical,
  hall: DoorOpen,
  gym: Dumbbell,
  dorm: BedDouble,
};
