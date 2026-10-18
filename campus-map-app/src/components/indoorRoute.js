import { fetchSvg } from "./svgCache";

/**
 * Walking routes inside a floor plan, found from the drawing itself: the
 * floor's SVG is drawn small onto a canvas, and every cell whose colour is
 * a corridor colour is walkable. Rooms and stairs are never walkable. The
 * route keeps to the middle of corridors rather than hugging walls.
 *
 * All points are [x, y] in the artwork's pixel space.
 */

// One grid cell covers CELL x CELL artwork pixels.
const CELL = 8;
// Colour samples per cell side when deciding whether a cell is walkable.
const SUB = 4;

// Corridor colours used in the floor plans, with how far a pixel may differ
// and still count: the khaki of the older plans, and the grey-blue and
// lavender of the newer ones (looser, since their drop shadows darken the
// edges of narrow hallways).
const WALK_COLORS = [
  [0xa1, 0x98, 0x7e, 24],
  [0xd7, 0xdb, 0xe3, 40],
  [0xef, 0xed, 0xfb, 40],
];

const gridCache = new Map(); // url -> Promise<{ w, h, walk }>

// Is this pixel a corridor colour? The light corridors are bluish; the pale
// green glow around the newer drawings is not, so it stays off-limits. Khaki
// is reddish; room shadows over that green glow come close to it but are
// greenish, so they stay off-limits too.
function isCorridor(r, g, b) {
  for (let c = 0; c < WALK_COLORS.length; c++) {
    const wc = WALK_COLORS[c];
    if (Math.abs(r - wc[0]) > wc[3] || Math.abs(g - wc[1]) > wc[3] || Math.abs(b - wc[2]) > wc[3]) continue;
    if (c === 0 ? r > g : b >= g + 2) return true;
  }
  return false;
}

function loadGrid(url, width, height) {
  if (!gridCache.has(url)) {
    gridCache.set(
      url,
      fetchSvg(url).then(
        (text) =>
          new Promise((resolve, reject) => {
            const w = Math.ceil(width / CELL);
            const h = Math.ceil(height / CELL);
            const img = new Image();
            // Blurs and shadows are slow to draw and only darken corridor
            // edges, so they're left out (routes keep off the walls through
            // WALL_GAP instead).
            const plain = text.replace(/\sfilter="url\([^)]*\)"/g, "");
            const blobUrl = URL.createObjectURL(new Blob([plain], { type: "image/svg+xml" }));
            img.onload = () => {
              // Drawn at SUB x SUB samples per cell; a cell is walkable when
              // most of its samples are corridor coloured. (One averaged
              // sample per cell let edges blended with the background pass
              // as corridor.)
              const canvas = document.createElement("canvas");
              canvas.width = w * SUB;
              canvas.height = h * SUB;
              const ctx = canvas.getContext("2d", { willReadFrequently: true });
              ctx.drawImage(img, 0, 0, w * SUB, h * SUB);
              URL.revokeObjectURL(blobUrl);
              const px = ctx.getImageData(0, 0, w * SUB, h * SUB).data;
              const count = new Uint8Array(w * h);
              for (let sy = 0; sy < h * SUB; sy++) {
                const row = ((sy / SUB) | 0) * w;
                for (let sx = 0, k = sy * w * SUB * 4; sx < w * SUB; sx++, k += 4)
                  if (px[k + 3] >= 200 && isCorridor(px[k], px[k + 1], px[k + 2])) count[row + ((sx / SUB) | 0)]++;
              }
              const walk = new Uint8Array(w * h);
              for (let i = 0; i < w * h; i++) walk[i] = count[i] * 2 > SUB * SUB ? 1 : 0;
              resolve({ w, h, walk });
            };
            img.onerror = reject;
            img.src = blobUrl;
          })
      )
    );
  }
  return gridCache.get(url);
}

function inside([x, y], poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function distToPoly(p, poly) {
  if (inside(p, poly)) return 0;
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j];
    const [bx, by] = poly[i];
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(p[0] - (ax + t * dx), p[1] - (ay + t * dy)));
  }
  return best;
}

// How close (artwork px) a route may come to a room or stairwell.
const WALL_GAP = 10;

// Cells a polygon covers or whose centre is within WALL_GAP of its edge, as
// indices. Edge cells count because a room's border blended with the
// background can come out corridor-coloured, and routes look better a
// little away from the walls.
function cellsIn(poly, w, h) {
  const pad = WALL_GAP;
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const out = [];
  for (let gy = Math.max(0, Math.floor((Math.min(...ys) - pad) / CELL)); gy <= Math.min(h - 1, Math.floor((Math.max(...ys) + pad) / CELL)); gy++)
    for (let gx = Math.max(0, Math.floor((Math.min(...xs) - pad) / CELL)); gx <= Math.min(w - 1, Math.floor((Math.max(...xs) + pad) / CELL)); gx++)
      if (distToPoly([(gx + 0.5) * CELL, (gy + 0.5) * CELL], poly) <= pad) out.push(gy * w + gx);
  return out;
}

// Small binary heap of [cost, index].
class Heap {
  constructor() {
    this.a = [];
  }
  push(item) {
    const a = this.a;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
  get size() {
    return this.a.length;
  }
}

function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let idx = -1;
  let max = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / (Math.hypot(dx, dy) || 1);
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max <= eps) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), eps).slice(0, -1), ...simplify(pts.slice(idx), eps)];
}

const floorCache = new Map(); // url -> { shapes, grid: Promise<{ w, h, walk, clear }> }

// The floor's walkable grid with its rooms and stairs blocked, and each
// walkable cell's distance (in cells) to the nearest wall, so routes prefer
// the middle of corridors. Worked out once per floor.
function floorGrid(url, width, height, rooms, stairs) {
  const cached = floorCache.get(url);
  if (cached && cached.rooms === rooms && cached.stairs === stairs) return cached.grid;
  const grid = loadGrid(url, width, height).then(({ w, h, walk: base }) => {
    const walk = base.slice();
    for (const shape of [...rooms, ...stairs]) for (const i of cellsIn(shape.polygon, w, h)) walk[i] = 0;
    const clear = new Int32Array(w * h).fill(-1);
    const queue = [];
    for (let i = 0; i < w * h; i++) if (!walk[i]) {
      clear[i] = 0;
      queue.push(i);
    }
    for (let q = 0; q < queue.length; q++) {
      const i = queue[q];
      const x = i % w;
      const y = (i / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (clear[n] === -1) {
          clear[n] = clear[i] + 1;
          queue.push(n);
        }
      }
    }
    return { w, h, walk, clear };
  });
  floorCache.set(url, { rooms, stairs, grid });
  return grid;
}

/**
 * Gets a floor ready for routes ahead of time (e.g. while the user is still
 * looking at the map), so the first route on it doesn't stall an animation.
 * Resolves once it's ready (or couldn't be).
 */
export function prepareFloor({ url, width, height, rooms, stairs }) {
  return floorGrid(url, width, height, rooms, stairs).then(
    () => {},
    () => {}
  );
}

/**
 * Route from `start` to the nearest of `goals` (polygons), avoiding the
 * floor's rooms and stairs. Resolves to points, or null when there's no way.
 */
export async function indoorRoute({ url, width, height, rooms, stairs, start, goals }) {
  const { w, h, walk, clear } = await floorGrid(url, width, height, rooms, stairs);

  // Goal cells: walkable cells next to a goal polygon, plus every cell
  // connected to them (`linked`). Small walkable patches (e.g. between the
  // strokes of an entrance arrow) lead nowhere, so the start skips them.
  // Some drawings leave a border and shadow between a room and its
  // corridor, so the search reaches further out until it finds a corridor.
  let isGoal;
  let linked;
  for (const cells of [3, 6, 10]) {
    const reach = cells * CELL;
    isGoal = new Uint8Array(w * h);
    for (const poly of goals) {
      const xs = poly.map((p) => p[0]);
      const ys = poly.map((p) => p[1]);
      for (let gy = Math.max(0, Math.floor((Math.min(...ys) - reach) / CELL)); gy <= Math.min(h - 1, Math.floor((Math.max(...ys) + reach) / CELL)); gy++)
        for (let gx = Math.max(0, Math.floor((Math.min(...xs) - reach) / CELL)); gx <= Math.min(w - 1, Math.floor((Math.max(...xs) + reach) / CELL)); gx++) {
          const i = gy * w + gx;
          if (walk[i] && distToPoly([(gx + 0.5) * CELL, (gy + 0.5) * CELL], poly) <= reach) isGoal[i] = 1;
        }
    }
    linked = new Uint8Array(w * h);
    const spread = [];
    for (let i = 0; i < w * h; i++) if (isGoal[i]) {
      linked[i] = 1;
      spread.push(i);
    }
    for (let q = 0; q < spread.length; q++) {
      const i = spread[q];
      const x = i % w;
      const y = (i / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (walk[n] && !linked[n]) {
          linked[n] = 1;
          spread.push(n);
        }
      }
    }
    // A real corridor connects to many cells; a stray patch doesn't.
    if (spread.length > 150) break;
  }

  // Start at the linked cell nearest the start point.
  const sx = Math.min(w - 1, Math.max(0, Math.floor(start[0] / CELL)));
  const sy = Math.min(h - 1, Math.max(0, Math.floor(start[1] / CELL)));
  let startCell = -1;
  for (let r = 0; r < 40 && startCell < 0; r++) {
    let best = Infinity;
    for (let y = sy - r; y <= sy + r; y++)
      for (let x = sx - r; x <= sx + r; x++) {
        if (x < 0 || y < 0 || x >= w || y >= h || !linked[y * w + x]) continue;
        const d = Math.hypot(x - sx, y - sy);
        if (d < best) {
          best = d;
          startCell = y * w + x;
        }
      }
  }
  if (startCell < 0) return null;

  // Dijkstra over the grid (8 directions), cheaper near corridor centres.
  const cost = new Float64Array(w * h).fill(Infinity);
  const prev = new Int32Array(w * h).fill(-1);
  const heap = new Heap();
  cost[startCell] = 0;
  heap.push([0, startCell]);
  let end = -1;
  const steps = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];
  while (heap.size) {
    const [c, i] = heap.pop();
    if (c > cost[i]) continue;
    if (isGoal[i]) {
      end = i;
      break;
    }
    const x = i % w;
    const y = (i / w) | 0;
    for (const [dx, dy, len] of steps) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (!walk[n]) continue;
      if (dx && dy && (!walk[y * w + nx] || !walk[ny * w + x])) continue; // no corner cutting
      const nc = c + len * (1 + 4 / (1 + clear[n]));
      if (nc < cost[n]) {
        cost[n] = nc;
        prev[n] = i;
        heap.push([nc, n]);
      }
    }
  }
  if (end < 0) return null;

  const cells = [];
  for (let i = end; i !== -1; i = prev[i]) cells.push([((i % w) + 0.5) * CELL, (((i / w) | 0) + 0.5) * CELL]);
  cells.reverse();
  return simplify(cells, CELL * 1.2);
}
