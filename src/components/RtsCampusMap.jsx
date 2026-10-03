import { MapContainer, ImageOverlay, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import rtsMapUrl from "../assets/rts-campus-map.svg?url";
import { BUILDING_SHAPES, RTS_MAP_SIZE } from "../data/rtsBuildingShapes";
import { C } from "../theme";
import { useFillViewport, SyncMapSize } from "./useFillViewport";

/**
 * RTS Campus map: the illustrated artwork as an image overlay (Leaflet
 * CRS.Simple) with clickable building polygons on top.
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

export default function RtsCampusMap({ onSelectBuilding, minHeight = 360 }) {
  const [frameRef, frameHeight] = useFillViewport(minHeight);
  return (
    <div
      ref={frameRef}
      className="w-full rounded-sm overflow-hidden"
      style={{ height: frameHeight ?? minHeight, border: `1px solid ${C.line}` }}
    >
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

        {BUILDING_SHAPES.map((b) =>
          b.polygons.map((poly, i) => (
            <Polygon
              key={`${b.id}-${i}`}
              positions={poly.map(toLatLng)}
              pathOptions={baseStyle}
              eventHandlers={{
                click: () => onSelectBuilding(b.id),
                mouseover: (e) => e.target.setStyle(hoverStyle),
                mouseout: (e) => e.target.setStyle(baseStyle),
              }}
            >
            </Polygon>
          ))
        )}
      </MapContainer>
      )}
    </div>
  );
}
