import { useLayoutEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * Sizes an element to fill the window from its top edge down, so a map
 * never extends below the screen. Never smaller than minHeight.
 *
 * Returns [ref, height]; height is null until measured, so render the map
 * only once it's set. Changing `recalcKey` measures again (e.g. when the
 * map moves into full-screen mode).
 */
export function useFillViewport(minHeight = 360, bottomGap = 16, recalcKey) {
  const ref = useRef(null);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    const update = () => {
      if (!ref.current) return;
      // Inside a full-screen map the element doesn't scroll with the page.
      const fixed = ref.current.closest("[data-map-expanded]");
      const top = ref.current.getBoundingClientRect().top + (fixed ? 0 : window.scrollY);
      setHeight(Math.max(minHeight, Math.round(window.innerHeight - top - bottomGap)));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [minHeight, bottomGap, recalcKey]);

  return [ref, height];
}

/**
 * Redraws room, stair and route shapes whenever the map stops moving. A zoom
 * animation that gets cut short (e.g. when the map is nudged back inside its
 * edges) skips Leaflet's own redraw, which would leave the shapes drawn for
 * the old zoom, out of line with the floor drawing. Place inside MapContainer.
 */
export function KeepShapesAligned() {
  const map = useMap();
  useLayoutEffect(() => {
    const redraw = () => map.eachLayer((layer) => layer instanceof L.Path && layer.redraw());
    map.on("moveend", redraw);
    return () => map.off("moveend", redraw);
  }, [map]);
  return null;
}

/**
 * Tells Leaflet the map container changed size. Place inside MapContainer.
 */
export function SyncMapSize({ height }) {
  const map = useMap();
  useLayoutEffect(() => {
    map.invalidateSize();
  }, [map, height]);
  return null;
}
