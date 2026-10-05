import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CAMPUS_GEOJSON } from "../data/campusGeo";
import { C } from "../theme";
import { useFillViewport, SyncMapSize } from "./useFillViewport";

// Initial view fits all campuses.
const CAMPUS_BOUNDS = L.geoJSON(CAMPUS_GEOJSON).getBounds();

const baseStyle = {
  color: C.brandDark,
  weight: 1.6,
  fillColor: C.brand,
  fillOpacity: 0.35,
};

const hoverStyle = {
  color: C.brandDark,
  weight: 2.5,
  fillColor: C.brand,
  fillOpacity: 0.6,
};

export default function HomeMap({ onSelect, minHeight = 360 }) {
  const [frameRef, frameHeight] = useFillViewport(minHeight);
  return (
    <div
      ref={frameRef}
      className="rounded-sm overflow-hidden"
      style={{ border: `1px solid ${C.line}`, height: frameHeight ?? minHeight }}
    >
      <style>{`
        .campus-label {
          background: ${C.brand};
          border: 1px solid ${C.brandDark};
          color: #FFFFFF;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 2px;
          box-shadow: none;
        }
        .campus-label::before { display: none; }
        .leaflet-container { font-family: 'IBM Plex Sans', sans-serif; }
      `}</style>

      {frameHeight !== null && (
      <MapContainer
        bounds={CAMPUS_BOUNDS}
        boundsOptions={{ padding: [40, 40], maxZoom: 18 }}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <SyncMapSize height={frameHeight} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          data={CAMPUS_GEOJSON}
          style={() => baseStyle}
          onEachFeature={(feature, layer) => {
            const { name, slug } = feature.properties;
            layer.bindTooltip(name, { permanent: true, direction: "center", className: "campus-label" });
            layer.on({
              click: () => onSelect(slug),
              mouseover: () => layer.setStyle(hoverStyle),
              mouseout: () => layer.setStyle(baseStyle),
            });
          }}
        />
      </MapContainer>
      )}
    </div>
  );
}
