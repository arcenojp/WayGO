// Walkways on the RTS Campus map, used to draw directions from the entrance
// to a building. Points are [x, y] in the same pixel space as
// rtsBuildingShapes.js (0,0 = top-left of rts-campus-map.svg).
//
// Nodes sit on the paved roads; edges join nodes you can walk between in a
// straight line. Each building has a door point and the node it's reached from.

export const WALKWAY_NODES = {
  entrance: [1730, 2420],
  entranceRoad: [1600, 2260],
  marineCorner: [1480, 2120],
  plaza: [1380, 2020],
  plazaEast: [1600, 1950],
  seniorHighSouth: [1730, 1810],
  trackWestSouth: [1300, 1920],
  trackWestMid: [1280, 1760],
  trackWestNorth: [1210, 1540],
  grandStandSouth: [1060, 1450],
  westRoadSouth: [880, 1400],
  westRoadMid: [820, 1220],
  westRoadNorth: [840, 1095],
  gymSouth: [1010, 1090],
  gymEast: [1105, 945],
  northJunction: [1200, 780],
  annexNorthSouth: [1180, 730],
  plantStrip: [1100, 640],
  labsStripNorth: [1000, 1590],
  labsStripMid: [1005, 1745],
  labsStripSouth: [1015, 1900],
  labsYard: [950, 2080],
  poolRoadNorth: [1320, 2120],
  poolRoadMid: [1080, 2410],
  poolYard: [900, 2430],
  eeLabSouth: [790, 2395],
  ceStripMouth: [757, 2335],
  ceStripEast: [672, 2205],
  ceStrip: [560, 2257],
};

export const WALKWAY_EDGES = [
  ["entrance", "entranceRoad"],
  ["entranceRoad", "marineCorner"],
  ["marineCorner", "plaza"],
  ["plaza", "plazaEast"],
  ["plazaEast", "seniorHighSouth"],
  ["plaza", "trackWestSouth"],
  ["trackWestSouth", "trackWestMid"],
  ["trackWestMid", "trackWestNorth"],
  ["trackWestNorth", "grandStandSouth"],
  ["grandStandSouth", "westRoadSouth"],
  ["westRoadSouth", "westRoadMid"],
  ["westRoadMid", "westRoadNorth"],
  ["westRoadNorth", "gymSouth"],
  ["gymSouth", "gymEast"],
  ["gymEast", "northJunction"],
  ["northJunction", "annexNorthSouth"],
  ["northJunction", "plantStrip"],
  ["grandStandSouth", "labsStripNorth"],
  ["labsStripNorth", "labsStripMid"],
  ["labsStripMid", "labsStripSouth"],
  ["labsStripSouth", "labsYard"],
  ["plaza", "poolRoadNorth"],
  ["poolRoadNorth", "poolRoadMid"],
  ["poolRoadMid", "poolYard"],
  ["poolYard", "eeLabSouth"],
  ["eeLabSouth", "ceStripMouth"],
  ["ceStripMouth", "ceStripEast"],
  ["ceStripEast", "ceStrip"],
];

export const BUILDING_DOORS = {
  marineEngineering: { from: "marineCorner", at: [1530, 2155] },
  canteen: { from: "entranceRoad", at: [1475, 2190] },
  seniorHigh: { from: "seniorHighSouth", at: [1745, 1735] },
  annexEast: { from: "seniorHighSouth", at: [1770, 1790] },
  newBuilding: { from: "trackWestSouth", at: [1240, 1960] },
  smallGrandStand: { from: "grandStandSouth", at: [1030, 1415] },
  rotcOffice: { from: "westRoadNorth", at: [770, 1090] },
  gym: { from: "gymEast", at: [1080, 915] },
  annexNorth: { from: "annexNorthSouth", at: [1170, 690] },
  physicalPlant: { from: "plantStrip", at: [1140, 575] },
  meLabs: { from: "labsStripMid", at: [995, 1745] },
  underConstruction: { from: "labsYard", at: [1020, 2105] },
  eeLab: { from: "labsYard", at: [895, 2140] },
  machineShop: { from: "labsYard", at: [810, 2045] },
  swimmingPool: { from: "poolRoadMid", at: [1000, 2520] },
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
