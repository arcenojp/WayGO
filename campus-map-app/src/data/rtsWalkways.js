// Walkways on the RTS Campus map, used to draw directions from the entrance
// to a building. Points are [x, y] in the same pixel space as
// rtsBuildingShapes.js (0,0 = top-left of rts-campus-map.svg).
//
// The route enters at the gate and follows the Entrance lane up to the
// plaza. From there it branches: north along the west side of the football
// field (SGS, Gym, Physical Plant), along the field's south edge to Marine
// and up the east side to Senior High, west past New Building to the labs
// and, along the Machine Shop / Electronic Engineering Lab seam, to Civil
// Engineering and CompE, and south-west to the pool. Each building has a
// door point and the node it's reached from.

export const WALKWAY_NODES = {
  entrance: [1795, 2990],
  laneA: [1745, 2800],
  laneB: [1665, 2620],
  laneC: [1575, 2440],
  laneD: [1512, 2290],
  plaza: [1420, 2140],
  poolRoadMid: [1210, 2290],
  poolTop: [1030, 2420],
  fieldBottomA: [1560, 2100],
  marineWalk: [1765, 2062],
  fieldEastS: [1930, 1995],
  fieldEastN: [1927, 1600],
  plazaNorth: [1415, 1965],
  fieldWestJ: [1418, 1560],
  fieldWestMid: [1418, 1160],
  fieldWestN: [1418, 1010],
  gymBand: [1455, 845],
  northJunction: [1590, 690],
  plantRoadStart: [1545, 580],
  plantRoadMid: [1720, 440],
  labsNorth: [1225, 1445],
  westRoadS: [1080, 1355],
  westRoadMid: [1060, 1150],
  westRoadN: [1045, 935],
  labsLaneTop: [1185, 1520],
  meLane: [1120, 1650],
  newSouth: [1270, 1975],
  labsYardEast: [1120, 1945],
  labsYardMid: [900, 1945],
  labsYardWest: [812, 1940],
  seamWest: [634, 1991],
  ceStripMouth: [628, 2035],
  // The short walkway down to CompE's north-east corner, beside the EE Lab.
  cbCorner: [614, 2058],
  yardGap: [885, 2050],
};

export const WALKWAY_EDGES = [
  ["entrance", "laneA"],
  ["laneA", "laneB"],
  ["laneB", "laneC"],
  ["laneC", "laneD"],
  ["laneD", "plaza"],
  ["plaza", "poolRoadMid"],
  ["poolRoadMid", "poolTop"],
  ["plaza", "fieldBottomA"],
  ["fieldBottomA", "marineWalk"],
  ["marineWalk", "fieldEastS"],
  ["fieldEastS", "fieldEastN"],
  ["plaza", "plazaNorth"],
  ["plazaNorth", "fieldWestJ"],
  ["fieldWestJ", "fieldWestMid"],
  ["fieldWestMid", "fieldWestN"],
  ["fieldWestN", "gymBand"],
  ["gymBand", "northJunction"],
  ["northJunction", "plantRoadStart"],
  ["plantRoadStart", "plantRoadMid"],
  ["fieldWestJ", "labsNorth"],
  ["labsNorth", "westRoadS"],
  ["westRoadS", "westRoadMid"],
  ["westRoadMid", "westRoadN"],
  ["labsNorth", "labsLaneTop"],
  ["labsLaneTop", "meLane"],
  ["meLane", "labsYardEast"],
  ["plazaNorth", "newSouth"],
  ["newSouth", "labsYardEast"],
  ["labsYardEast", "labsYardMid"],
  ["labsYardMid", "labsYardWest"],
  ["labsYardWest", "seamWest"],
  ["seamWest", "ceStripMouth"],
  ["ceStripMouth", "cbCorner"],
  ["labsYardMid", "yardGap"],
];

export const BUILDING_DOORS = {
  marineEngineering: { from: "marineWalk", at: [1765, 2092] },
  canteen: { from: "laneC", at: [1522, 2432] },
  waitingShed: { from: "laneD", at: [1430, 2265] },
  seniorHigh: { from: "fieldEastN", at: [1950, 1600] },
  annexEast: { from: "fieldEastS", at: [1960, 1960] },
  newBuilding: { from: "newSouth", at: [1270, 1950] },
  smallGrandStand: { from: "fieldWestMid", at: [1385, 1160] },
  rotcOffice: { from: "westRoadN", at: [1085, 872] },
  gym: { from: "gymBand", at: [1432, 822] },
  annexNorth: { from: "plantRoadStart", at: [1600, 556] },
  physicalPlant: { from: "plantRoadMid", at: [1700, 385] },
  meLabs: { from: "meLane", at: [1098, 1660] },
  underConstruction: { from: "plaza", at: [1338, 2060] },
  eeLab: { from: "yardGap", at: [848, 2040] },
  auditorium: { from: "yardGap", at: [890, 2150] },
  machineShop: { from: "labsYardWest", at: [795, 1900] },
  swimmingPool: { from: "poolTop", at: [990, 2445] },
  // CE's entrance is at its south-east corner, by the walkway down to CompE.
  ceBuilding: { from: "seamWest", at: [624, 1992] },
  // CompE's entrance is at the end of that walkway, by its north-east corner.
  computerBuilding: { from: "cbCorner", at: [605, 2080] },
};

const distance = ([x1, y1], [x2, y2]) => Math.hypot(x2 - x1, y2 - y1);

const NEIGHBORS = {};
for (const [a, b] of WALKWAY_EDGES) {
  const d = distance(WALKWAY_NODES[a], WALKWAY_NODES[b]);
  (NEIGHBORS[a] ||= []).push([b, d]);
  (NEIGHBORS[b] ||= []).push([a, d]);
}

// Shortest walk between two nodes (Dijkstra). Returns node names, or null.
function shortestPath(start, goal) {
  const dist = { [start]: 0 };
  const prev = {};
  const open = new Set([start]);
  while (open.size > 0) {
    let current = null;
    for (const n of open) if (current === null || dist[n] < dist[current]) current = n;
    if (current === goal) break;
    open.delete(current);
    for (const [next, d] of NEIGHBORS[current] || []) {
      const alt = dist[current] + d;
      if (dist[next] === undefined || alt < dist[next]) {
        dist[next] = alt;
        prev[next] = current;
        open.add(next);
      }
    }
  }
  if (dist[goal] === undefined) return null;
  const path = [goal];
  while (path[0] !== start) path.unshift(prev[path[0]]);
  return path;
}

export function hasRoute(buildingId) {
  return Boolean(BUILDING_DOORS[buildingId]);
}

// Points from the entrance to the building's door, or null if unmapped.
export function routeToBuilding(buildingId) {
  const door = BUILDING_DOORS[buildingId];
  if (!door) return null;
  const nodes = shortestPath("entrance", door.from);
  if (!nodes) return null;
  return [...nodes.map((n) => WALKWAY_NODES[n]), door.at];
}

export const ENTRANCE = WALKWAY_NODES.entrance;
