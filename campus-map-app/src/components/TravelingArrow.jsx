import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * An arrow that walks along a route, turning to face where it's going, then
 * starts over. `positions` are Leaflet [lat, lng] points (CRS.Simple, so
 * they're plain pixel coordinates). With reduced motion it stays still at
 * the start.
 */

const ICON = L.divIcon({
  className: "waygo-traveler",
  html:
    '<div class="waygo-traveler-arrow"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">' +
    '<path d="M4 12h13M12 6l6 6-6 6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const SPEED = 420; // artwork pixels per second
const PAUSE = 700; // ms at the end before starting over

export default function TravelingArrow({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;
    const pts = positions.map(([lat, lng]) => [lng, -lat]); // to x, y (y down)
    const lengths = [0];
    for (let i = 1; i < pts.length; i++) lengths.push(lengths[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = lengths[lengths.length - 1];
    const duration = Math.min(7000, Math.max(2200, (total / SPEED) * 1000));

    const marker = L.marker(positions[0], { icon: ICON, interactive: false, keyboard: false, zIndexOffset: 1000 }).addTo(map);
    const place = (d) => {
      let i = 1;
      while (i < lengths.length - 1 && lengths[i] < d) i++;
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const seg = lengths[i] - lengths[i - 1] || 1;
      const t = Math.min(1, Math.max(0, (d - lengths[i - 1]) / seg));
      marker.setLatLng([-(y0 + (y1 - y0) * t), x0 + (x1 - x0) * t]);
      const el = marker.getElement()?.firstChild;
      if (el) el.style.transform = `rotate(${Math.atan2(y1 - y0, x1 - x0)}rad)`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(0);
      return () => marker.remove();
    }

    let frame;
    let startTime = null;
    const tick = (now) => {
      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) % (duration + PAUSE);
      const p = Math.min(1, elapsed / duration);
      // Ease in and out so the arrow sets off and arrives gently.
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      place(eased * total);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      marker.remove();
    };
  }, [map, positions]);

  return null;
}
