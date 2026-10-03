import { useState, useRef, useEffect } from "react";
import { MapContainer, ImageOverlay, Polygon, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers } from "lucide-react";
import { C } from "../theme";
import { useFillViewport, SyncMapSize } from "./useFillViewport";

/**
 * Interactive floor plan for one building, rendered with Leaflet CRS.Simple:
 * the floor artwork is an image overlay in its own pixel space, and rooms
 * and stairs are clickable polygons on top of it. The map stays mounted
 * across floor changes so switching floors doesn't flash.
 *
 * Props:
 *   buildingName      shown in the room card
 *   floors            [{ id, label, artworkFile, artworkSize?, rooms, stairs }]
 *   artworkUrls       { [artworkFile]: url } (imported by the page so Vite
 *                     can bundle them)
 *   artworkSize       { width, height } default for all floors; a floor's
 *                     own artworkSize overrides it
 *   onRoomSelect      called with the clicked room
 *   initialFloorId    floor to open on
 *   highlightRoomName room to find (from search)
 *   highlightKey      changes on every search, so repeating the same
 *                     search replays the animation
 *
 * A searched room gets a bouncing arrow and a pulsing glow until the user
 * changes floor or clicks another room.
 */
const TARGET_CSS = `
  @keyframes fpv-heartbeat {
    0%, 40%, 100% { fill-opacity: 0.25; stroke-width: 3px; filter: drop-shadow(0 0 2px ${C.brand}); }
    14%           { fill-opacity: 0.6;  stroke-width: 6px; filter: drop-shadow(0 0 14px ${C.brand}); }
    28%           { fill-opacity: 0.35; stroke-width: 4px; filter: drop-shadow(0 0 5px ${C.brand}); }
    42%           { fill-opacity: 0.55; stroke-width: 6px; filter: drop-shadow(0 0 12px ${C.brand}); }
  }
  .fpv-heartbeat { animation: fpv-heartbeat 2.4s ease-in-out infinite; }

  @keyframes fpv-arrow-bounce {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(10px); }
  }
  .fpv-arrow { background: none; border: none; }
  .fpv-arrow > div { animation: fpv-arrow-bounce 0.9s ease-in-out infinite; }
  .fpv-arrow.fpv-arrow-up > div { rotate: 180deg; }

  @media (prefers-reduced-motion: reduce) {
    .fpv-heartbeat, .fpv-arrow > div { animation: none; }
  }
`;

const targetStyle = {
  color: C.brand,
  weight: 3,
  fillColor: C.brand,
  fillOpacity: 0.35,
  className: "fpv-heartbeat",
};

const ARROW_SIZE = 44;

// A downward arrow; the "up" variant is the same arrow rotated via CSS.
function arrowIcon(pointsUp) {
  return L.divIcon({
    className: `fpv-arrow${pointsUp ? " fpv-arrow-up" : ""}`,
    iconSize: [ARROW_SIZE, ARROW_SIZE],
    iconAnchor: [ARROW_SIZE / 2, pointsUp ? 0 : ARROW_SIZE],
    html: `<div><svg width="${ARROW_SIZE}" height="${ARROW_SIZE}" viewBox="0 0 24 24" fill="${C.brand}" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"><path d="M9 2h6v10h5l-8 10-8-10h5z"/></svg></div>`,
  });
}

const ARROW_ICONS = { down: arrowIcon(false), up: arrowIcon(true) };

function polygonBounds(polygon) {
  const xs = polygon.map(([x]) => x);
  const ys = polygon.map(([, y]) => y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

// Zooms to the searched room. Must render after ResetViewOnFloorChange so it
// runs after the floor's fit-to-bounds.
function FlyToTarget({ target, toLatLng }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    const { minX, maxX, minY, maxY } = polygonBounds(target.room.polygon);
    const t = setTimeout(() => {
      const isPhone = window.innerWidth < 768;
      map.flyToBounds([toLatLng([minX, maxY]), toLatLng([maxX, minY])], {
        padding: [40, 40],
        maxZoom: isPhone ? -1 : -0.25,
        duration: 0.8,
      });
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return null;
}

const roomStyle = {
  color: "transparent",
  weight: 0,
  fillColor: C.brand,
  fillOpacity: 0,
};

const roomHoverStyle = {
  color: C.brand,
  weight: 2,
  fillColor: C.brand,
  fillOpacity: 0.22,
};

const stairStyle = {
  color: C.amber,
  weight: 1,
  fillColor: C.amber,
  fillOpacity: 0.12,
};

const stairHoverStyle = {
  color: C.amber,
  weight: 2,
  fillColor: C.amber,
  fillOpacity: 0.45,
};

const stairPulseStyle = {
  color: C.amber,
  weight: 2,
  fillColor: C.amber,
  fillOpacity: 0.7,
};

// Fits the view and pan limits to the current floor whenever it changes.
function ResetViewOnFloorChange({ floorId, bounds }) {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorId]);
  return null;
}

export default function FloorPlanViewer({
  buildingName,
  floors,
  artworkUrls,
  artworkSize,
  onRoomSelect,
  initialFloorId,
  highlightRoomName,
  highlightKey,
}) {
  const [floorId, setFloorId] = useState(initialFloorId || floors[0].id);
  const [arrivedGroup, setArrivedGroup] = useState(null); // stair group to highlight after taking stairs
  const [target, setTarget] = useState(null); // { floorId, room } from search
  const [frameRef, frameHeight] = useFillViewport(360, 40); // 40px leaves room for the hint below
  const pulseTimeout = useRef(null);

  const floor = floors.find((f) => f.id === floorId) || floors[0];

  const { width, height } = floor.artworkSize || artworkSize;
  const bounds = [
    [-height, 0],
    [0, width],
  ];

  // Image [x, y] -> Leaflet [lat, lng]. y is negated because image y grows
  // downward while CRS.Simple lat grows upward.
  const toLatLng = ([x, y]) => [-y, x];

  // Apply each search navigation once (highlightKey changes every time).
  // Room names repeat across floors (e.g. "CR MALE"), so prefer the floor
  // the search result came from. The room card isn't opened since it would
  // cover the room; clicking the highlighted room opens it.
  const [handledKey, setHandledKey] = useState(null);
  if (highlightKey !== handledKey) {
    setHandledKey(highlightKey);
    const hasRoom = (f) => f.rooms.some((r) => r.name === highlightRoomName);
    const targetFloor =
      highlightRoomName &&
      (floors.find((f) => f.id === initialFloorId && hasRoom(f)) || floors.find(hasRoom));
    const room = targetFloor?.rooms.find((r) => r.name === highlightRoomName);
    if (room) {
      setFloorId(targetFloor.id);
      setTarget({ floorId: targetFloor.id, room });
    } else if (initialFloorId) {
      setFloorId(initialFloorId);
    }
  }

  const changeFloor = (id) => {
    setFloorId(id);
    setTarget(null);
  };

  const activeTarget = target && target.floorId === floor.id ? target : null;
  let arrow = null;
  if (activeTarget) {
    const { minX, maxX, minY, maxY } = polygonBounds(activeTarget.room.polygon);
    // Arrow above the room pointing down, or below pointing up if the room
    // is at the top edge.
    const pointsUp = minY < ARROW_SIZE * 2;
    arrow = {
      position: toLatLng([(minX + maxX) / 2, pointsUp ? maxY + 8 : minY - 8]),
      icon: pointsUp ? ARROW_ICONS.up : ARROW_ICONS.down,
    };
  }

  useEffect(() => () => clearTimeout(pulseTimeout.current), []);

  const takeStairs = (stair) => {
    changeFloor(stair.toFloorId);
    setArrivedGroup(stair.group);
    clearTimeout(pulseTimeout.current);
    pulseTimeout.current = setTimeout(() => setArrivedGroup(null), 1600);
  };

  return (
    <div>
      <style>{TARGET_CSS}</style>
      <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
        <Layers size={28} className="hidden sm:block shrink-0" style={{ color: C.inkSoft }} />
        <div className="flex w-full sm:w-auto gap-1.5 sm:gap-2 md:gap-3 sm:flex-wrap justify-center">
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => changeFloor(f.id)}
              className="flex-1 sm:flex-none px-1 py-2.5 text-[15px] sm:min-w-[7rem] sm:px-6 sm:py-3 sm:text-lg md:min-w-[8.5rem] md:px-8 md:py-4 md:text-xl rounded-md border-2 transition-colors whitespace-nowrap waygo-hover-tint"
              style={{
                borderColor: C.brand,
                background: f.id === floorId ? C.brand : undefined,
                color: f.id === floorId ? "#FFFFFF" : C.brandDark,
                fontWeight: f.id === floorId ? 600 : 500,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={frameRef} className="w-full rounded-sm overflow-hidden" style={{ height: frameHeight ?? 360, border: `1px solid ${C.line}` }}>
        {frameHeight !== null && (
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          maxBounds={bounds}
          maxBoundsViscosity={1}
          minZoom={-4}
          zoomSnap={0.25}
          maxZoom={3}
          style={{ height: "100%", width: "100%", background: C.paperDark }}
        >
          <SyncMapSize height={frameHeight} />
          <ResetViewOnFloorChange floorId={floorId} bounds={bounds} />
          <ImageOverlay url={artworkUrls[floor.artworkFile]} bounds={bounds} />

          <FlyToTarget target={activeTarget} toLatLng={toLatLng} />

          {floor.rooms.map((room) => {
            const isTarget = activeTarget?.room.id === room.id;
            // Leaflet only applies className on creation, so the target gets a
            // separate key to remount with the heartbeat class.
            return (
              <Polygon
                key={isTarget ? `${room.id}-target` : room.id}
                positions={room.polygon.map(toLatLng)}
                pathOptions={isTarget ? targetStyle : roomStyle}
                eventHandlers={{
                  click: () => {
                    if (!isTarget) setTarget(null);
                    onRoomSelect({ ...room, floorLabel: floor.label, buildingName });
                  },
                  mouseover: (e) => !isTarget && e.target.setStyle(roomHoverStyle),
                  mouseout: (e) => !isTarget && e.target.setStyle(roomStyle),
                }}
              />
            );
          })}

          {arrow && (
            <Marker
              key={`${activeTarget.room.id}-arrow`}
              position={arrow.position}
              icon={arrow.icon}
              interactive={false}
            />
          )}

          {floor.stairs.map((stair) => {
            const isPulsing = arrivedGroup === stair.group;
            return (
              <Polygon
                key={stair.id}
                positions={stair.polygon.map(toLatLng)}
                pathOptions={isPulsing ? stairPulseStyle : stairStyle}
                eventHandlers={{
                  click: () => takeStairs(stair),
                  mouseover: (e) => e.target.setStyle(stairHoverStyle),
                  mouseout: (e) => e.target.setStyle(isPulsing ? stairPulseStyle : stairStyle),
                }}
              />
            );
          })}
        </MapContainer>
        )}
      </div>
      {floors.some((f) => f.stairs.length > 0) && (
        <p className="text-xs mt-2" style={{ color: C.inkSoft }}>
          Amber areas are stairwells — click one to go to the floor it connects to.
        </p>
      )}
    </div>
  );
}
