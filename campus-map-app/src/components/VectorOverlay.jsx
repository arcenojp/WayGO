import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { fetchSvg } from "./svgCache";

/**
 * Shows an SVG file on the map as live vector shapes (Leaflet svgOverlay)
 * rather than as a picture. A picture is drawn once and then stretched, so
 * it turns blurry when zoomed in; vector shapes are redrawn sharp at every
 * zoom level.
 *
 * Props: url, bounds, opacity, onLoad(url) once the artwork is on the map,
 * softEdges to let the drawing's glow fade out past its frame (bounds must
 * be in the artwork's own pixels, as on the floor plans and RTS map).
 */

// How far (artwork px) the glow may spread past the drawing's frame.
const BLEED = 400;

/**
 * Hides the drawing's frame so its edges don't show on the map: a flat
 * background covering the whole drawing (white, or a solid ground colour)
 * is hidden, clips and masks to the frame are lifted, and the view box is widened by
 * BLEED on every side so the blurred glow around the building fades out
 * into the map instead of stopping at a hard edge. The svg must be on the
 * page; returns the widened view box as [x, y, width, height].
 */
function openEdges(svg) {
  const [vx, vy, vw, vh] = (svg.getAttribute("viewBox") || "0 0 0 0").split(/[\s,]+/).map(Number);
  const coversFrame = (el) => {
    try {
      const b = el.getBBox();
      return b.width >= vw * 0.98 && b.height >= vh * 0.98;
    } catch {
      return false;
    }
  };
  // Shapes drawn directly (not definitions), in drawing order; backgrounds
  // come first.
  const drawn = [...svg.querySelectorAll("rect, path, use")].filter((el) => !el.closest("defs, clipPath, mask, filter"));
  for (const el of drawn.slice(0, 4)) {
    const blurred = el.closest("[filter]");
    if (!blurred && el.getAttribute("fill") && el.getAttribute("fill") !== "none" && coversFrame(el)) el.style.display = "none";
  }
  for (const attr of ["clip-path", "mask"]) {
    for (const el of svg.querySelectorAll(`[${attr}]`)) {
      if (el.closest("defs")) continue;
      const id = el.getAttribute(attr).match(/url\(#(.+)\)/)?.[1];
      const shape = id && svg.getElementById(id)?.firstElementChild;
      if (shape && coversFrame(shape)) el.removeAttribute(attr);
    }
  }
  const box = [vx - BLEED, vy - BLEED, vw + 2 * BLEED, vh + 2 * BLEED];
  svg.setAttribute("viewBox", box.join(" "));
  svg.setAttribute("overflow", "visible");
  return box;
}

export default function VectorOverlay({ url, bounds, opacity = 1, onLoad, softEdges = false }) {
  const map = useMap();
  const layerRef = useRef(null);
  const opacityRef = useRef(opacity);
  useEffect(() => {
    opacityRef.current = opacity;
  });

  useEffect(() => {
    let cancelled = false;
    let frame;
    fetchSvg(url).then((text) => {
      if (cancelled) return;
      const svg = new DOMParser().parseFromString(text, "image/svg+xml").documentElement;
      // Leaflet sizes the element to the bounds; the drawing scales with it.
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      // Clicks go to the room and stair shapes drawn above it.
      svg.style.pointerEvents = "none";
      // Starts invisible and fades in (waygo-fade-art in index.css).
      svg.classList.add("waygo-fade-art");
      const layer = L.svgOverlay(svg, bounds, { interactive: false, opacity: 0 }).addTo(map);
      layer.bringToBack();
      layerRef.current = layer;
      if (softEdges) {
        // Same scale as before; the overlay just covers the extra margin.
        openEdges(svg);
        const [[s0, w0], [n0, e0]] = bounds;
        layer.setBounds(L.latLngBounds([s0 - BLEED, w0 - BLEED], [n0 + BLEED, e0 + BLEED]));
      }
      frame = requestAnimationFrame(() => layer.setOpacity(opacityRef.current));
      onLoad?.(url);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      layerRef.current?.remove();
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, url]);

  useEffect(() => {
    layerRef.current?.setOpacity(opacity);
  }, [opacity]);

  return null;
}
