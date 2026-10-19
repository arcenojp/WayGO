import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Polygon, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import rtsMapUrl from "../assets/rts-campus-map.svg?url";
import { BUILDING_SHAPES, RTS_MAP_SIZE } from "../data/rtsBuildingShapes";
import { routeToBuilding } from "../data/rtsWalkways";
import { C, RAW } from "../theme";
import { useFillViewport, SyncMapSize, KeepShapesAligned } from "./useFillViewport";
import { useExpandable, EXPANDED_CLASS } from "./useExpandable";
import { START_ICON, targetStyle, addClass, arrowFor, fitSmoothly } from "./wayfinding";
import RouteBanner from "./RouteBanner";
import TravelingArrow from "./TravelingArrow";
import ExpandMapButton from "./ExpandMapButton";
import VectorOverlay from "./VectorOverlay";

/**
 * RTS Campus map: the illustrated artwork as an image overlay (Leaflet
 * CRS.Simple) with clickable building polygons on top.
 *
 * With a `route` ({ buildingId, label }), a glowing path runs from the
 * entrance to that building, which pulses until the user clicks it.
 */
const { width, height } = RTS_MAP_SIZE;
const BOUNDS = [
  [-height, 0],
  [0, width],
];

// Image [x, y] -> Leaflet [lat, lng]. y is negated because image y grows
// downward while CRS.Simple lat grows upward.
const toLatLng = ([x, y]) => [-y, x];

const baseStyle = {
  color: "transparent",
  weight: 0,
  fillColor: C.brand,
  fillOpacity: 0,
};

const hoverStyle = {
  color: C.brand,
  weight: 2,
  fillColor: C.brand,
  fillOpacity: 0.22,
};

const routeGlowStyle = { color: C.brand, weight: 14, opacity: 0.3, lineCap: "round", lineJoin: "round", interactive: false };
const routeLineStyle = { color: C.brand, weight: 6, opacity: 0.95, dashArray: "4 16", lineCap: "round", lineJoin: "round", interactive: false };

// Shows the whole route and the building when the route changes.
function FitRoute({ points, routeKey }) {
  const map = useMap();
  useEffect(() => {
    if (!points) return;
    const t = setTimeout(() => {
      fitSmoothly(map, L.latLngBounds(points.map(toLatLng)), {
        paddingTopLeft: [40, 90], // room for the directions banner
        paddingBottomRight: [40, 40],
        maxZoom: -1,
        duration: 0.8,
      });
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);
  return null;
}

// After the map enters or leaves full screen, shows the route again, or the
// whole campus when there's no route.
function RefitOnExpand({ expanded, routeBounds }) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      map.invalidateSize();
      if (routeBounds) map.fitBounds(routeBounds, { paddingTopLeft: [40, 90], paddingBottomRight: [40, 40], maxZoom: -1, animate: false });
      else map.fitBounds(BOUNDS, { padding: [16, 16], animate: false });
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);
  return null;
}

export default function RtsCampusMap({ onSelectBuilding, route, routeKey, onEndRoute, minHeight = 360 }) {
  const [expanded, toggleExpanded] = useExpandable();
  const [frameRef, frameHeight] = useFillViewport(minHeight, expanded ? 12 : 16, expanded);
  const points = route ? routeToBuilding(route.buildingId) : null;
  // Kept stable between renders so the travelling arrow keeps going.
  const routeBuildingId = route?.buildingId;
  const routeLatLngs = useMemo(() => {
    const p = routeBuildingId ? routeToBuilding(routeBuildingId) : null;
    return p && p.map(toLatLng);
  }, [routeBuildingId]);
  const targetShape = points ? BUILDING_SHAPES.find((b) => b.id === route.buildingId) : null;
  const arrow = targetShape ? arrowFor(targetShape.polygons[0], toLatLng) : null;

  return (
    <div className={expanded ? EXPANDED_CLASS : undefined} style={expanded ? { background: C.paper } : undefined} data-map-expanded={expanded || undefined}>
    <div
      ref={frameRef}
      className="relative w-full rounded-sm overflow-hidden"
      style={{ height: frameHeight ?? minHeight, border: `1px solid ${C.line}` }}
    >
      <ExpandMapButton expanded={expanded} onToggle={toggleExpanded} />
      {points && (
        <RouteBanner onClose={onEndRoute}>
          Follow the path from the entrance to <strong>{targetShape.label}</strong>, then tap the building
          {route.label ? <> to find <strong>{route.label}</strong></> : null}.
        </RouteBanner>
      )}
      {frameHeight !== null && (
      <MapContainer
        crs={L.CRS.Simple}
        bounds={BOUNDS}
        maxBounds={BOUNDS}
        maxBoundsViscosity={1}
        minZoom={-4}
        // Any zoom level, so the map fills the frame; +/- still step by 1.
        zoomSnap={0}
        // Up to 2x the drawing's own size; closer shows no more detail.
        maxZoom={1}
        style={{ height: "100%", width: "100%", background: RAW.paperDark }}
      >
        <SyncMapSize height={frameHeight} />
        <KeepShapesAligned />
        <VectorOverlay url={rtsMapUrl} bounds={BOUNDS} softEdges />
        <FitRoute points={points && [...points, ...targetShape.polygons[0]]} routeKey={routeKey} />
        <RefitOnExpand
          expanded={expanded}
          routeBounds={points && L.latLngBounds([...points, ...targetShape.polygons[0]].map(toLatLng))}
        />

        {BUILDING_SHAPES.map((b) =>
          b.polygons.map((poly, i) => {
            const isTarget = targetShape?.id === b.id;
            return (
              <Polygon
                key={isTarget ? `${b.id}-${i}-target` : `${b.id}-${i}`}
                positions={poly.map(toLatLng)}
                pathOptions={isTarget ? targetStyle : baseStyle}
                eventHandlers={{
                  add: isTarget ? addClass("waygo-heartbeat") : undefined,
                  click: (e) => {
                    // Zoom into the building for a moment, then open it.
                    fitSmoothly(e.target._map, e.target.getBounds(), { padding: [120, 120], duration: 0.45 });
                    setTimeout(() => onSelectBuilding(b.id), 420);
                  },
                  mouseover: (e) => !isTarget && e.target.setStyle(hoverStyle),
                  mouseout: (e) => !isTarget && e.target.setStyle(baseStyle),
                }}
              />
            );
          })
        )}

        {points && (
          <>
            <Polyline
              key={`${routeKey}-glow`}
              positions={points.map(toLatLng)}
              pathOptions={routeGlowStyle}
              eventHandlers={{ add: addClass("waygo-route-glow") }}
            />
            <Polyline
              key={`${routeKey}-line`}
              positions={points.map(toLatLng)}
              pathOptions={routeLineStyle}
              eventHandlers={{ add: addClass("waygo-route-flow") }}
            />
            <Marker position={toLatLng(points[0])} icon={START_ICON} interactive={false} title="Entrance" />
            <Marker key={`${routeKey}-arrow`} position={arrow.position} icon={arrow.icon} interactive={false} />
            <TravelingArrow key={`${routeKey}-traveler`} positions={routeLatLngs} />
          </>
        )}
      </MapContainer>
      )}
    </div>
    </div>
  );
}
