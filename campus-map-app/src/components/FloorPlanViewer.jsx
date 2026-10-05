import { useState, useRef, useEffect } from "react";
import { MapContainer, ImageOverlay, Polygon, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers } from "lucide-react";
import { C } from "../theme";
import { useFillViewport, SyncMapSize } from "./useFillViewport";
import { targetStyle, addClass, arrowFor, polygonBounds } from "./wayfinding";
import RouteBanner from "./RouteBanner";

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
 *   guideFromEntrance start on the first floor and point to the stairs
 *                     (the user is just entering the building)
 *
 * A searched room gets a bouncing arrow and a pulsing glow. On any other
 * floor, the stairs leading toward it are highlighted instead, until the
 * user taps the room, another room, or closes the directions.
 */

// The next floor on the way from one floor to another, following the stairs
// (breadth-first, so it takes the fewest flights). Null if unreachable.
function nextFloorToward(floors, fromId, toId) {
  const prev = { [fromId]: null };
  const queue = [fromId];
  while (queue.length > 0) {
    const id = queue.shift();
    if (id === toId) break;
    for (const stair of floors.find((f) => f.id === id)?.stairs || []) {
      if (!(stair.toFloorId in prev)) {
        prev[stair.toFloorId] = id;
        queue.push(stair.toFloorId);
      }
    }
  }
  if (!(toId in prev)) return null;
  let step = toId;
  while (prev[step] !== fromId) step = prev[step];
  return step;
}

// Every staircase on this floor that leads to the next floor on the way to
// the target. Staff-only stairs are left out unless there's no other way.
function stairsTowards(floors, floor, target) {
  const nextId = nextFloorToward(floors, floor.id, target.floorId);
  const options = floor.stairs.filter((st) => st.toFloorId === nextId);
  const open = options.filter((st) => !st.staffOnly);
  return open.length > 0 ? open : options;
}

// Zooms to the highlighted room or stairwells. Must render after
// ResetViewOnFloorChange so it runs after the floor's fit-to-bounds.
function FlyToShapes({ polygons, focusKey, toLatLng }) {
  const map = useMap();
  useEffect(() => {
    if (polygons.length === 0) return;
    const { minX, maxX, minY, maxY } = polygonBounds(polygons.flat());
    const t = setTimeout(() => {
      const isPhone = window.innerWidth < 768;
      map.flyToBounds([toLatLng([minX, maxY]), toLatLng([maxX, minY])], {
        paddingTopLeft: [40, 120], // room for the directions banner and arrows
        paddingBottomRight: [40, 40],
        maxZoom: isPhone ? -1 : -0.25,
        duration: 0.8,
      });
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);
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
function ResetViewOnFloorChange({ floorId, bounds, panBounds }) {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(panBounds);
    // Not animated: a zoom animation still running would undo FlyToShapes.
    map.fitBounds(bounds, { animate: false });
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
  guideFromEntrance,
}) {
  const [floorId, setFloorId] = useState(initialFloorId || floors[0].id);
  const [arrivedGroup, setArrivedGroup] = useState(null); // stair group to highlight after taking stairs
  const [target, setTarget] = useState(null); // { floorId, room } from search
  const [frameRef, frameHeight] = useFillViewport(360, 40); // 40px leaves room for the hint below
  const pulseTimeout = useRef(null);

  const floor = floors.find((f) => f.id === floorId) || floors[0];

  // The browser keeps showing the previous image until the next one has
  // downloaded, which would put this floor's rooms over the last floor's
  // drawing. So the artwork stays hidden until its own image has loaded.
  const artworkUrl = artworkUrls[floor.artworkFile];
  const [loadedUrl, setLoadedUrl] = useState(null);
  const artworkLoading = loadedUrl !== artworkUrl;
  const preloaded = useRef(false);
  const onArtworkLoad = (e) => {
    setLoadedUrl(e.target.getElement().getAttribute("src"));
    // Once the first floor is showing, fetch the others in the background so
    // switching floors doesn't wait for a download.
    if (!preloaded.current) {
      preloaded.current = true;
      Object.values(artworkUrls).forEach((url) => {
        new Image().src = url;
      });
    }
  };

  const { width, height } = floor.artworkSize || artworkSize;
  const bounds = [
    [-height, 0],
    [0, width],
  ];
  // Panning may go a little above the artwork, so the directions banner
  // never hides stairs or rooms along its top edge.
  const panBounds = [
    [-height, 0],
    [height * 0.15, width],
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
      setFloorId(guideFromEntrance ? floors[0].id : targetFloor.id);
      setTarget({ floorId: targetFloor.id, room });
    } else if (initialFloorId) {
      setFloorId(initialFloorId);
    }
  }

  // The target stays set across floor changes: on its floor the room pulses,
  // on other floors the stairs toward it do.
  const activeTarget = target && target.floorId === floor.id ? target : null;
  const targetFloor = target && floors.find((f) => f.id === target.floorId);
  const guideStairs = target && !activeTarget ? stairsTowards(floors, floor, target) : [];
  const goingUp = targetFloor && floors.indexOf(targetFloor) > floors.indexOf(floor);

  const focus = activeTarget ? [activeTarget.room] : guideStairs;
  const focusKey = `${floor.id}:${focus.map((f) => f.id).join(",")}:${handledKey}`;

  useEffect(() => () => clearTimeout(pulseTimeout.current), []);

  const takeStairs = (stair) => {
    setFloorId(stair.toFloorId);
    setArrivedGroup(stair.group);
    clearTimeout(pulseTimeout.current);
    pulseTimeout.current = setTimeout(() => setArrivedGroup(null), 1600);
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
        <Layers size={28} className="hidden sm:block shrink-0" style={{ color: C.inkSoft }} />
        <div className="flex w-full sm:w-auto gap-1.5 sm:gap-2 md:gap-3 sm:flex-wrap justify-center">
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setFloorId(f.id)}
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

      <div ref={frameRef} className="relative w-full rounded-sm overflow-hidden" style={{ height: frameHeight ?? 360, border: `1px solid ${C.line}` }}>
        {artworkLoading && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none text-sm" style={{ color: C.inkSoft }}>
            Loading {floor.label}…
          </div>
        )}
        {target && (
          <RouteBanner onClose={() => setTarget(null)}>
            {activeTarget ? (
              <><strong>{target.room.name}</strong> is here on the {floor.label}.</>
            ) : guideStairs.length > 0 ? (
              <>
                <strong>{target.room.name}</strong> is on the {targetFloor.label}. Take {guideStairs.length > 1 ? "any of the" : "the"} highlighted
                stairs {goingUp ? "up" : "down"}.
              </>
            ) : (
              <><strong>{target.room.name}</strong> is on the {targetFloor.label}. Use the floor buttons above.</>
            )}
          </RouteBanner>
        )}
        {frameHeight !== null && (
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          maxBounds={panBounds}
          maxBoundsViscosity={1}
          minZoom={-4}
          zoomSnap={0.25}
          maxZoom={3}
          style={{ height: "100%", width: "100%", background: C.paperDark }}
        >
          <SyncMapSize height={frameHeight} />
          <ResetViewOnFloorChange floorId={floorId} bounds={bounds} panBounds={panBounds} />
          <ImageOverlay url={artworkUrl} bounds={bounds} opacity={artworkLoading ? 0 : 1} eventHandlers={{ load: onArtworkLoad }} />

          <FlyToShapes polygons={focus.map((f) => f.polygon)} focusKey={focusKey} toLatLng={toLatLng} />

          {floor.rooms.map((room) => {
            const isTarget = activeTarget?.room.id === room.id;
            // The target gets its own key so it remounts, and the heartbeat
            // class is added once the shape is on the map (Leaflet ignores
            // className changes after a shape is drawn).
            return (
              <Polygon
                key={isTarget ? `${room.id}-target` : room.id}
                positions={room.polygon.map(toLatLng)}
                pathOptions={isTarget ? targetStyle : roomStyle}
                eventHandlers={{
                  add: isTarget ? addClass("waygo-heartbeat") : undefined,
                  click: () => {
                    // Tapping the destination (or any other room) ends the directions.
                    setTarget(null);
                    onRoomSelect({ ...room, floorLabel: floor.label, buildingName });
                  },
                  mouseover: (e) => !isTarget && e.target.setStyle(roomHoverStyle),
                  mouseout: (e) => !isTarget && e.target.setStyle(roomStyle),
                }}
              />
            );
          })}

          {focus.map((shape) => {
            const arrow = arrowFor(shape.polygon, toLatLng);
            return <Marker key={`${shape.id}-arrow`} position={arrow.position} icon={arrow.icon} interactive={false} />;
          })}

          {floor.stairs.map((stair) => {
            const isPulsing = arrivedGroup === stair.group;
            const isGuide = guideStairs.includes(stair);
            const style = isGuide ? targetStyle : isPulsing ? stairPulseStyle : stairStyle;
            return (
              <Polygon
                key={isGuide ? `${stair.id}-guide` : stair.id}
                positions={stair.polygon.map(toLatLng)}
                pathOptions={style}
                eventHandlers={{
                  add: isGuide ? addClass("waygo-heartbeat") : undefined,
                  click: () => takeStairs(stair),
                  mouseover: (e) => !isGuide && e.target.setStyle(stairHoverStyle),
                  mouseout: (e) => !isGuide && e.target.setStyle(style),
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
