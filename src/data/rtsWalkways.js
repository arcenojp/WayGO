// Walkways on the RTS Campus map, used to draw directions from the entrance
// to a building. Points are [x, y] in the same pixel space as
// rtsBuildingShapes.js (0,0 = top-left of rts-campus-map.svg).
//
// The main routes follow the paths marked on the campus map: entrance to the
// plaza, then on to Senior High, the west road (ROTC), the pool, and CE /
// Computer through the gap north of the building under construction. Short
// side branches reach the other buildings. Each building has a door point and
// the node it's reached from.

export const WALKWAY_NODES = {
  entrance: [1775, 2428],
  entranceRoad: [1600, 2235],
  marineCorner: [1500, 2121],
  seniorHighFork: [1432, 2040],
  plaza: [1372, 1976],
  seniorHighRoad: [1630, 1939],
  annexEastWest: [1735, 1792],
  trackWest: [1191, 1564],
  grandStandSouth: [1060, 1500],
  westRoad: [935, 1439],
  westRoadNorth: [865, 1085],
  gymSouth: [1010, 1090],
  gymEast: [1105, 945],
  northJunction: [1200, 780],
  annexNorthSouth: [1180, 730],
  plantStrip: [1100, 640],
  labsStripNorth: [1000, 1590],
  labsStripMid: [1005, 1745],
  newBuildingSouth: [1250, 1984],
  labsYard: [1046, 1998],
  labsYardWest: [805, 2045],
  ceStripEast: [655, 2150],
  ceStripMouth: [668, 2196],
  ceStrip: [560, 2257],
  poolRoadNorth: [1286, 2110],
};

export const WALKWAY_EDGES = [
  ["entrance", "entranceRoad"],
  ["entranceRoad", "marineCorner"],
  ["marineCorner", "seniorHighFork"],
  ["seniorHighFork", "plaza"],
  ["seniorHighFork", "seniorHighRoad"],
  ["seniorHighRoad", "annexEastWest"],
  ["plaza", "trackWest"],
  ["trackWest", "grandStandSouth"],
  ["grandStandSouth", "westRoad"],
  ["westRoad", "westRoadNorth"],
  ["westRoadNorth", "gymSouth"],
  ["gymSouth", "gymEast"],
  ["gymEast", "northJunction"],
  ["northJunction", "annexNorthSouth"],
  ["northJunction", "plantStrip"],
  ["grandStandSouth", "labsStripNorth"],
  ["labsStripNorth", "labsStripMid"],
  ["plaza", "newBuildingSouth"],
  ["newBuildingSouth", "labsYard"],
  ["labsYard", "labsYardWest"],
  ["labsYardWest", "ceStripEast"],
  ["ceStripEast", "ceStripMouth"],
  ["ceStripMouth", "ceStrip"],
  ["plaza", "poolRoadNorth"],
];

export const BUILDING_DOORS = {
  marineEngineering: { from: "marineCorner", at: [1530, 2155] },
  canteen: { from: "entranceRoad", at: [1475, 2190] },
  seniorHigh: { from: "annexEastWest", at: [1789, 1716] },
  annexEast: { from: "annexEastWest", at: [1775, 1790] },
  newBuilding: { from: "newBuildingSouth", at: [1235, 1950] },
  smallGrandStand: { from: "grandStandSouth", at: [1030, 1415] },
  rotcOffice: { from: "westRoadNorth", at: [852, 1030] },
  gym: { from: "gymEast", at: [1080, 915] },
  annexNorth: { from: "annexNorthSouth", at: [1170, 690] },
  physicalPlant: { from: "plantStrip", at: [1140, 575] },
  meLabs: { from: "labsStripMid", at: [995, 1745] },
  underConstruction: { from: "poolRoadNorth", at: [1225, 2100] },
  eeLab: { from: "labsYard", at: [895, 2140] },
  machineShop: { from: "labsYardWest", at: [790, 2035] },
  swimmingPool: { from: "poolRoadNorth", at: [1034, 2487] },
  ceBuilding: { from: "ceStrip", at: [520, 2266] },
  computerBuilding: { from: "ceStrip", at: [540, 2290] },
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
