import L from "leaflet";
import { C } from "../theme";

// Map markers and styles shared by the RTS map and the floor plans.
// Animations live in index.css (waygo-heartbeat, waygo-arrow, waygo-route-flow).

export const ARROW_SIZE = 44;

// A downward arrow; the "up" variant is the same arrow rotated via CSS.
function arrowIcon(pointsUp) {
  return L.divIcon({
    className: `waygo-arrow${pointsUp ? " waygo-arrow-up" : ""}`,
    iconSize: [ARROW_SIZE, ARROW_SIZE],
    iconAnchor: [ARROW_SIZE / 2, pointsUp ? 0 : ARROW_SIZE],
    html: `<div><svg width="${ARROW_SIZE}" height="${ARROW_SIZE}" viewBox="0 0 24 24" fill="${C.brand}" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"><path d="M9 2h6v10h5l-8 10-8-10h5z"/></svg></div>`,
  });
}

export const ARROW_ICONS = { down: arrowIcon(false), up: arrowIcon(true) };

// "You are here" pin for the start of a route.
export const START_ICON = L.divIcon({
  className: "waygo-pin",
  iconSize: [34, 44],
  iconAnchor: [17, 42],
  html: `<svg width="34" height="44" viewBox="0 0 34 44"><path d="M17 1C8.2 1 1 8 1 16.8 1 28.5 17 43 17 43s16-14.5 16-26.2C33 8 25.8 1 17 1z" fill="${C.brandDark}" stroke="#FFFFFF" stroke-width="2"/><circle cx="17" cy="16.5" r="6" fill="#FFFFFF"/></svg>`,
});

export const targetStyle = {
  color: C.brand,
  weight: 3,
  fillColor: C.brand,
  fillOpacity: 0.35,
};

// Leaflet only applies pathOptions.className when a shape is first drawn,
// so the animation class is added in the layer's `add` event instead.
export const addClass = (className) => (e) => e.target.getElement()?.classList.add(className);

export function polygonBounds(polygon) {
  const xs = polygon.map(([x]) => x);
  const ys = polygon.map(([, y]) => y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

// Arrow above a shape pointing down, or below it pointing up when the shape
// is at the top edge of the artwork.
export function arrowFor(polygon, toLatLng) {
  const { minX, maxX, minY, maxY } = polygonBounds(polygon);
  const pointsUp = minY < ARROW_SIZE * 2;
  return {
    position: toLatLng([(minX + maxX) / 2, pointsUp ? maxY + 8 : minY - 8]),
    icon: pointsUp ? ARROW_ICONS.up : ARROW_ICONS.down,
  };
}
