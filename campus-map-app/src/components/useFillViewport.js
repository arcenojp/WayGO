import { useLayoutEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

/**
 * Sizes an element to fill the window from its top edge down, so a map
 * never extends below the screen. Never smaller than minHeight.
 *
 * Returns [ref, height]; height is null until measured, so render the map
 * only once it's set.
 */
export function useFillViewport(minHeight = 360, bottomGap = 16) {
  const ref = useRef(null);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      setHeight(Math.max(minHeight, Math.round(window.innerHeight - top - bottomGap)));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [minHeight, bottomGap]);

  return [ref, height];
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
