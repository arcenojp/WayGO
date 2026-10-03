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

  brand       logo magenta: selected states, map shapes, highlights
  brandDark   magenta for text and icons on light backgrounds
  brandTint   light magenta backgrounds (hover, focus)
  brandLine   light magenta borders
  amber       stairwells only
  accent, accentSoft are aliases of brandDark, brandTint.
*/
export const C = {
  paper: "#FBF9FB",
  paperDark: "#F2EEF3",
  ink: "#231A29",
  inkSoft: "#6D6475",
  line: "#E3DBE5",
  stone: "#E9E4EB",
  stoneHover: "#DDD5E0",
  green: "#A7D2AF",
  greenLine: "#6FA47E",
  brand: "#C331C1",
  brandDark: "#8E1F8C",
  brandTint: "#F8E7F7",
  brandLine: "#E9C4E7",
  accent: "#8E1F8C",
  accentSoft: "#F8E7F7",
  amber: "#D89B3C",
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
