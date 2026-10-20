import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { MapContainer, Polygon, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers } from "lucide-react";
import { C, RAW } from "../theme";
import { useFillViewport, SyncMapSize, KeepShapesAligned } from "./useFillViewport";
import { useExpandable, EXPANDED_CLASS } from "./useExpandable";
import { useSidebarSlot } from "./sidebarSlot";
import { useTrip } from "./tripContext";
import { targetStyle, addClass, arrowFor, polygonBounds, fitSmoothly } from "./wayfinding";
import RouteBanner from "./RouteBanner";
import ExpandMapButton from "./ExpandMapButton";
import VectorOverlay from "./VectorOverlay";
import { fetchSvg } from "./svgCache";
import { indoorRoute, prepareFloor } from "./indoorRoute";
import TravelingArrow from "./TravelingArrow";

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
      fitSmoothly(map, [toLatLng([minX, maxY]), toLatLng([maxX, minY])], {
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

// Centre of a polygon (average of its corners) and distance between points.
const centerOf = (poly) => [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

const routeGlowStyle = { color: C.brand, weight: 12, opacity: 0.3, lineCap: "round", lineJoin: "round", interactive: false };
const routeLineStyle = { color: C.brand, weight: 5, opacity: 0.95, dashArray: "4 14", lineCap: "round", lineJoin: "round", interactive: false };

// Once the walking route is known, shows all of it: where the user is and
// where they're going.
function FitRoute({ latlngs }) {
  const map = useMap();
  useEffect(() => {
    if (!latlngs) return;
    const t = setTimeout(() => {
      const isPhone = window.innerWidth < 768;
      fitSmoothly(map, L.latLngBounds(latlngs), {
        paddingTopLeft: [50, 120], // room for the directions banner
        paddingBottomRight: [50, 50],
        maxZoom: isPhone ? -1 : -0.25,
        duration: 0.9,
      });
    }, 250);
    return () => clearTimeout(t);
  }, [map, latlngs]);
  return null;
}

// Fits the view and pan limits to the current floor whenever it changes, so
// the whole floor shows. Entering or leaving full screen fits it again once
// the frame has its new size, unless directions are showing (keepView).
function ResetViewOnFloorChange({ floorId, bounds, panBounds, expanded, keepView }) {
  const map = useMap();
  const firstExpand = useRef(true);
  // Not animated: a zoom animation still running would undo FlyToShapes.
  const fit = () => map.fitBounds(bounds, { animate: false, padding: [16, 16] });
  useEffect(() => {
    map.setMaxBounds(panBounds);
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floorId]);
  useEffect(() => {
    if (firstExpand.current) {
      firstExpand.current = false;
      return;
    }
    if (keepView) return;
    const t = setTimeout(() => {
      map.invalidateSize();
      fit();
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);
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
  const [entryGroup, setEntryGroup] = useState(null); // { group, from }: the stairs the user came by, and the floor they left
  const [target, setTarget] = useState(null); // { floorId, room } from search
  const [expanded, toggleExpanded] = useExpandable();
  // On wide screens the floor buttons and hints go in the page's sidebar.
  const sidebarSlot = useSidebarSlot();
  const inSidebar = Boolean(sidebarSlot) && !expanded;
  // Below the map: 40px leaves room for the hint, unless it's in the sidebar.
  const [frameRef, frameHeight] = useFillViewport(360, expanded ? 12 : inSidebar ? 16 : 40, `${expanded}-${inSidebar}`);
  const pulseTimeout = useRef(null);

  const floor = floors.find((f) => f.id === floorId) || floors[0];

  // A "Loading" note shows until this floor's drawing is on the map.
  const artworkUrl = artworkUrls[floor.artworkFile];
  const [loadedUrl, setLoadedUrl] = useState(null);
  const artworkLoading = loadedUrl !== artworkUrl;
  const preloaded = useRef(false);
  const onArtworkLoad = (url) => {
    setLoadedUrl(url);
    // Once the first floor is showing, fetch the others in the background so
    // switching floors doesn't wait for a download.
    if (!preloaded.current) {
      preloaded.current = true;
      Object.values(artworkUrls).forEach((u) => fetchSvg(u).catch(() => {}));
      // And get every floor ready for walking routes while the browser is
      // idle, this floor first, one at a time, so starting directions
      // doesn't stall the map's animation.
      const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
      const queue = [floor, ...floors.filter((f) => f !== floor)];
      const next = () => {
        const f = queue.shift();
        if (!f) return;
        const size = f.artworkSize || artworkSize;
        prepareFloor({ url: artworkUrls[f.artworkFile], ...size, rooms: f.rooms, stairs: f.stairs }).then(() => idle(next));
      };
      idle(next);
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
    setEntryGroup(null);
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

  // Walking route on this floor while there are directions: from where the
  // user is (the stairs they came by, or the entrance) to the room, or to
  // the nearest stairs toward it.
  const routeStart = (() => {
    if (!target) return null;
    // The landing they arrived on: same staircase, leading back to the floor they left.
    const came =
      entryGroup &&
      (floor.stairs.find((st) => st.group === entryGroup.group && st.toFloorId === entryGroup.from) ||
        floor.stairs.find((st) => st.group === entryGroup.group));
    if (came) return centerOf(came.polygon);
    if (floor.entrance) return floor.entrance;
    // Arrived by the floor buttons: start from the stairs nearest the goal.
    const goal = focus[0] && centerOf(focus[0].polygon);
    const nearest = goal && [...floor.stairs].sort((a, b) => dist(centerOf(a.polygon), goal) - dist(centerOf(b.polygon), goal))[0];
    return nearest ? centerOf(nearest.polygon) : null;
  })();
  const routeKey = routeStart && focus.length > 0 ? `${focusKey}|${routeStart.join(",")}` : null;
  const [indoor, setIndoor] = useState(null); // { key, points }
  useEffect(() => {
    if (!routeKey) return;
    let cancelled = false;
    indoorRoute({
      url: artworkUrl,
      width,
      height,
      rooms: floor.rooms,
      stairs: floor.stairs,
      start: routeStart,
      // A room that doesn't touch a corridor names the area it's entered from.
      goals: focus.map((f) => f.approach || f.polygon),
    })
      .then((found) => {
        if (cancelled) return;
        const points = found && [routeStart, ...found];
        // Right next to the stairs or room already: the highlight is enough.
        const length = points ? points.slice(1).reduce((sum, p, i) => sum + dist(points[i], p), 0) : 0;
        setIndoor({ key: routeKey, points: length >= 60 ? points : null });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);
  const routePoints = indoor && indoor.key === routeKey ? indoor.points : null;
  const routeLatLngs = useMemo(() => routePoints && routePoints.map(([x, y]) => [-y, x]), [routePoints]);
  // What to show once the route is known: the whole route and where it ends.
  const routeView = useMemo(
    () => routeLatLngs && [...routeLatLngs, ...focus.flatMap((f) => f.polygon.map(([x, y]) => [-y, x]))],
    // focus belongs to the same route, so it only changes along with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [routeLatLngs]
  );

  useEffect(() => () => clearTimeout(pulseTimeout.current), []);

  // Tell the directions in the sidebar which floor is showing.
  const trip = useTrip();
  const reportFloor = trip?.reportFloor;
  useEffect(() => {
    reportFloor?.(floor.id);
  }, [reportFloor, floor.id]);

  const takeStairs = (stair) => {
    setFloorId(stair.toFloorId);
    setArrivedGroup(stair.group);
    setEntryGroup({ group: stair.group, from: floor.id });
    clearTimeout(pulseTimeout.current);
    pulseTimeout.current = setTimeout(() => setArrivedGroup(null), 1600);
  };

  const floorButtonStyle = (f) => ({
    borderColor: C.brand,
    background: f.id === floorId ? C.brand : undefined,
    color: f.id === floorId ? "#FFFFFF" : C.brandDark,
    fontWeight: f.id === floorId ? 600 : 500,
  });
  const hasStairs = floors.some((f) => f.stairs.length > 0);
  const hint = hasStairs && "Amber areas are stairwells — click one to go to the floor it connects to.";

  return (
    <div className={expanded ? EXPANDED_CLASS : undefined} style={expanded ? { background: C.paper } : undefined} data-map-expanded={expanded || undefined}>
      {inSidebar ? (
        createPortal(
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C.inkSoft }}>
                <Layers size={16} />
                {floors.length > 1 ? "Floors" : "Floor"}
              </div>
              <div className="flex flex-col gap-2">
                {floors.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFloorId(f.id);
                      setEntryGroup(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-base rounded-md border-2 transition-colors waygo-hover-tint"
                    style={floorButtonStyle(f)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {hint && (
              <p className="text-xs leading-relaxed" style={{ color: C.inkSoft }}>
                {hint}
              </p>
            )}
          </div>,
          sidebarSlot
        )
      ) : (
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-3">
          {expanded && (
            <span className="hidden md:block mr-2 font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {buildingName}
            </span>
          )}
          <Layers size={24} className="hidden sm:block shrink-0" style={{ color: C.inkSoft }} />
          <div className="flex w-full sm:w-auto gap-1.5 sm:gap-2 sm:flex-wrap justify-center">
            {floors.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                      setFloorId(f.id);
                      setEntryGroup(null);
                    }}
                className="flex-1 sm:flex-none px-1 py-2 text-[15px] sm:min-w-[6.5rem] sm:px-5 sm:py-2 sm:text-base md:min-w-[7.5rem] md:px-6 md:py-2.5 md:text-lg rounded-md border-2 transition-colors whitespace-nowrap waygo-hover-tint"
                style={floorButtonStyle(f)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={frameRef} className="relative w-full rounded-sm overflow-hidden" style={{ height: frameHeight ?? 360, border: `1px solid ${C.line}` }}>
        <ExpandMapButton expanded={expanded} onToggle={toggleExpanded} />
        {artworkLoading && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none text-sm" style={{ color: C.inkSoft }}>
            Loading {floor.label}…
          </div>
        )}
        {target && (
          <RouteBanner
            onClose={() => {
              setTarget(null);
              trip?.end();
            }}
          >
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
          // Any zoom level, so a floor plan fills the frame instead of
          // rounding down to the next step; the +/- buttons still step by 1.
          zoomSnap={0}
          // Up to 2x the drawing's own size; closer shows no more detail.
          maxZoom={1}
          style={{ height: "100%", width: "100%", background: RAW.paperDark }}
        >
          <SyncMapSize height={frameHeight} />
          <KeepShapesAligned />
          <ResetViewOnFloorChange floorId={floorId} bounds={bounds} panBounds={panBounds} expanded={expanded} keepView={focus.length > 0} />
          <VectorOverlay url={artworkUrl} bounds={bounds} opacity={artworkLoading ? 0 : 1} onLoad={onArtworkLoad} softEdges />

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
                    if (isTarget) trip?.arrive();
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

          {routeLatLngs && (
            <>
              <FitRoute latlngs={routeView} />
              <Polyline key={`${routeKey}-glow`} positions={routeLatLngs} pathOptions={routeGlowStyle} eventHandlers={{ add: addClass("waygo-route-glow") }} />
              <Polyline key={`${routeKey}-line`} positions={routeLatLngs} pathOptions={routeLineStyle} eventHandlers={{ add: addClass("waygo-route-flow") }} />
              <TravelingArrow positions={routeLatLngs} />
            </>
          )}
        </MapContainer>
        )}
      </div>
      {!expanded && !inSidebar && hint && (
        <p className="text-xs mt-2" style={{ color: C.inkSoft }}>
          {hint}
        </p>
      )}
    </div>
  );
}
