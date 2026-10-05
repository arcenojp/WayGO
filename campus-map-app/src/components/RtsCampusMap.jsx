import { useEffect } from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import rtsMapUrl from "../assets/rts-campus-map.svg?url";
import { BUILDING_SHAPES, RTS_MAP_SIZE } from "../data/rtsBuildingShapes";
import { routeToBuilding } from "../data/rtsWalkways";
import { C } from "../theme";
import { useFillViewport, SyncMapSize } from "./useFillViewport";
import { START_ICON, targetStyle, addClass, arrowFor } from "./wayfinding";
import RouteBanner from "./RouteBanner";

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
      map.flyToBounds(L.latLngBounds(points.map(toLatLng)), {
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

export default function RtsCampusMap({ onSelectBuilding, route, routeKey, onEndRoute, minHeight = 360 }) {
  const [frameRef, frameHeight] = useFillViewport(minHeight);
  const points = route ? routeToBuilding(route.buildingId) : null;
  const targetShape = points ? BUILDING_SHAPES.find((b) => b.id === route.buildingId) : null;
  const arrow = targetShape ? arrowFor(targetShape.polygons[0], toLatLng) : null;

  return (
    <div
      ref={frameRef}
      className="relative w-full rounded-sm overflow-hidden"
      style={{ height: frameHeight ?? minHeight, border: `1px solid ${C.line}` }}
    >
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
        zoomSnap={0.25}
        maxZoom={3}
        style={{ height: "100%", width: "100%", background: C.paperDark }}
      >
        <SyncMapSize height={frameHeight} />
        <ImageOverlay url={rtsMapUrl} bounds={BOUNDS} />
        <FitRoute points={points && [...points, ...targetShape.polygons[0]]} routeKey={routeKey} />

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
                  click: () => onSelectBuilding(b.id),
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
          </>
        )}
      </MapContainer>
      )}
    </div>
  );
}
