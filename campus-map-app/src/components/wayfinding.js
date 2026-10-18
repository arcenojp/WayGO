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

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const fits = new WeakMap(); // map -> the zoom under way

/**
 * Glides the map to `bounds` (Leaflet fitBounds options, plus `duration`
 * in seconds). Leaflet's flyTo redraws the whole floor drawing, blurs and
 * shadows included, on every frame, which stutters; here the browser slides
 * and scales the map as a ready-made picture while it moves, and Leaflet
 * redraws it once at the end. A new glide while one is under way carries on
 * from wherever the first one is.
 */
export function fitSmoothly(map, bounds, { duration = 0.9, ...options } = {}) {
  const { center, zoom } = map._getBoundsCenterZoom(L.latLngBounds(bounds), options);
  const pane = map.getPane("mapPane");
  const running = fits.get(map);
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !pane.animate) {
    running?.anim.finish();
    map.setView(center, zoom, { animate: false });
    return;
  }

  // Views are { z: zoom, p: centre as a point on the map as it was when the
  // glide began }. Leaflet keeps that view until the end, so the moving
  // picture is that view, scaled and shifted.
  let glide = running;
  let from;
  if (running) {
    const t = Math.min(1, running.anim.currentTime / running.ms);
    const u = running.ease(t);
    from = { z: running.from.z + (running.to.z - running.from.z) * u, p: running.from.p.add(running.to.p.subtract(running.from.p).multiplyBy(u)) };
    running.anim.onfinish = null;
    running.anim.cancel(); // the next glide starts in the same frame
  } else {
    // Anything else moving the map (e.g. switching floors) ends the glide.
    const stop = () => {
      fits.get(map)?.anim.cancel();
      fits.delete(map);
      map.getContainer().classList.remove("waygo-gliding");
    };
    glide = { z0: map.getZoom(), pos: L.DomUtil.getPosition(pane), stop };
    map.once("movestart", stop);
    from = { z: glide.z0, p: map.getSize().divideBy(2) };
    pane.style.transformOrigin = "0 0";
    map.getContainer().classList.add("waygo-gliding");
  }
  const to = { z: zoom, p: map.latLngToContainerPoint(center) };
  const ease = running ? easeOut : easeInOut;
  const half = map.getSize().divideBy(2);
  const frames = [];
  for (let i = 0; i <= 30; i++) {
    const u = ease(i / 30);
    const k = map.getZoomScale(from.z + (to.z - from.z) * u, glide.z0);
    const p = from.p.add(to.p.subtract(from.p).multiplyBy(u));
    const shift = half.add(glide.pos.subtract(p).multiplyBy(k));
    frames.push({ transform: `translate3d(${shift.x}px, ${shift.y}px, 0) scale(${k})` });
  }
  const ms = duration * 1000;
  const anim = pane.animate(frames, { duration: ms, fill: "forwards" });
  Object.assign(glide, { from, to, ease, ms, anim });
  fits.set(map, glide);
  anim.onfinish = () => {
    map.off("movestart", glide.stop);
    fits.delete(map);
    map.getContainer().classList.remove("waygo-gliding");
    map.setView(center, zoom, { animate: false });
    anim.cancel();
  };
}
