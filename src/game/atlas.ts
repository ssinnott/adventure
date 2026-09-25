// The world map's model: Caldera as one continuous land, the way it will be walked once the
// outdoors is a single map. The atlas content draws the land the way a cartographer would, in
// strokes: the rim, the coasts, ranges of mountains, rivers running from the rim to the sea, woods,
// fens and fields, roads. worldGrid turns that into cells, one per square the party walks, and
// stamps every built outdoor map into it 1:1 where it sits, so the painted map shows the real Shelf
// and the real Thornmark.
//
// The land is divided two ways. Areas are the steps of the one road of levels (I, II, III...), each
// with its level band, and every area is made of zones, the named country inside it. Which zone a
// cell belongs to is found by walking out from the zones' seeds over the land, where climbing a
// range or crossing a river costs dearly, so borders fall along ridges, rivers and coasts instead of
// straight lines. Ways between areas come from the built maps' exits and the atlas's planned links;
// a planned way may open only after a later step, which is what sends the party back through
// country it has already cleared, or out across the inland sea. Pure: nothing here draws.
import type { MapDef, MapKind } from './map.ts';

/** A point in world cells: x east, y south. */
export type Pt = readonly [number, number];

/** What a site on the painted map is drawn as. `label` letters a name alone; `water` letters a water's name. */
export type SiteIcon =
  | 'city' | 'town' | 'village' | 'hold' | 'farm' | 'cave' | 'tower' | 'barrow' | 'grove' | 'stone'
  | 'port' | 'hearth' | 'monastery' | 'mine' | 'forge' | 'fortress' | 'volcano' | 'sunken' | 'gate'
  | 'wreck' | 'rift' | 'ring' | 'lodge' | 'obelisk' | 'lighthouse' | 'ruin' | 'camp' | 'falls'
  | 'springs' | 'label' | 'water';

/** How a way is travelled. */
export type LinkKind = 'road' | 'enter' | 'stairs' | 'sea' | 'deep';

/** A closed outline in world cells. `rough` is how far, in cells, the land's edge may wander from it. */
export interface Outline { pts: readonly Pt[]; rough?: number }

/** A line of high or broken ground: a range's crest line and how wide it stands. */
export interface Ridge {
  pts: readonly Pt[];
  /** Cells across the range itself. */
  width: number;
  /** Mountains unless it says: a line of low hills, a cliff (an escarpment), the rift's chasm, or a lava flow. */
  kind?: 'mountains' | 'hills' | 'cliff' | 'chasm' | 'lava';
  /** Snow on the crest. */
  snow?: boolean;
  /** Cells of rougher ground either side, and what it is (hills unless it says). */
  foot?: number;
  footT?: WorldTerrain;
}

/** A river from its source to its mouth, with its width in cells at each end. */
export interface River { name?: string; pts: readonly Pt[]; width?: readonly [number, number] }

/** Land of one kind inside an outline: a wood, a fen, fields. Later patches lie over earlier ones. */
export interface Patch { t: WorldTerrain; pts: readonly Pt[]; rough?: number }

/** A road across planned country. */
export interface Trail { pts: readonly Pt[] }

/** A step on the road of levels above ground: a named country made of zones. */
export interface AtlasArea {
  id: string;
  name: string;
  /** Its step on the one road of levels: 1 is the start. */
  order: number;
  /** Level band of the area's planned zones; built zones read their maps'. */
  band?: readonly [number, number];
  /** The area's Wardstone, if it has one. */
  stone?: string;
  /** Where the area's name is lettered, world cells (the centre of the text). */
  label: Pt;
  /** Grass colour inside the area, blended across its borders, so neighbouring country reads apart. */
  tint?: string;
  /** One line for the zone overlay: what the area is. */
  note?: string;
}

/** A zone: a named part of an area. A built zone is an outdoor map, placed with its top-left at `at`. */
export interface AtlasZone {
  id: string;
  name: string;
  area: string;
  /** Where the zone is: the walk that settles borders starts from these. A built zone uses its map's footprint. */
  seeds?: readonly Pt[];
  /** The outdoor map this zone is, once built, and where its top-left cell sits. */
  map?: string;
  at?: Pt;
  /** Planned zones only; the area's band when absent. */
  band?: readonly [number, number];
  /** Where the overlay letters the zone's name; its first seed when absent. */
  label?: Pt;
}

/** A town, dungeon or Underdeep segment: a map of its own, shown as a plate in the zone overlay. */
export interface AtlasPlace {
  /** The map's id once built; a planned place's own id otherwise. */
  id: string;
  /** Planned places only; a built place shows its map's name. */
  name?: string;
  kind: Exclude<MapKind, 'outdoor'> | 'deep';
  planned?: boolean;
  /** A step of its own on the road of levels (the Underdeep and the core are steps, not areas). */
  order?: number;
  band?: readonly [number, number];
  /** Centre of the plate, world cells. */
  at: Pt;
  note?: string;
}

/** Something painted on the map: a town, a cave mouth, a Wardstone, a name. */
export interface AtlasSite {
  name: string;
  icon: SiteIcon;
  /** A built map the position is relative to; world cells otherwise. */
  map?: string;
  at: Pt;
  /** Where the name goes; 'none' leaves it unlettered. */
  label?: 'above' | 'below' | 'left' | 'right' | 'none';
  /** Not in the game yet. Planned sites are still painted; the overlay treats them as such. */
  planned?: boolean;
  /** Lettering size for a name alone (`label`, `water`); 1 unless it says. */
  size?: number;
}

/**
 * A way no map's exits make yet. Ends name an area, a zone, a place or a built map. Built ways come
 * from `MapDef.exits`.
 */
export interface AtlasLink {
  from: string;
  to: string;
  kind: LinkKind;
  /** The way opens once this step is done (a road cleared, a ship found); absent means open. */
  opens?: number;
  /** World cells where the arrow leaves `from` and meets `to`; a place's plate or a zone's label when absent. */
  a?: Pt;
  b?: Pt;
  /** Points a sea route passes on its way, so it rounds islands and headlands. */
  via?: readonly Pt[];
  note?: string;
  /** Where the note and the step it opens after are lettered, world cells; beside the arrow when absent. */
  noteAt?: Pt;
}

export interface Atlas {
  /** World size in cells. */
  width: number;
  height: number;
  /** Cells per lettered square of the border, the way the old maps were cut into A1, B2... */
  square: number;
  seed: number;
  /** The world's edge; beyond it is nothing. `width` is the band of mountains inside it. */
  rim: Outline & { width: number };
  seas: readonly Outline[];
  /** Land raised back out of the seas. */
  isles: readonly Outline[];
  lakes: readonly Outline[];
  ridges: readonly Ridge[];
  rivers: readonly River[];
  patches: readonly Patch[];
  trails: readonly Trail[];
  areas: readonly AtlasArea[];
  zones: readonly AtlasZone[];
  places: readonly AtlasPlace[];
  sites: readonly AtlasSite[];
  links: readonly AtlasLink[];
}

// ---------------------------------------------------------------- terrain

/** Every terrain a world cell can be. The order is fixed: cells store an index into it. */
export const TERRAINS = [
  'void', 'sea', 'shallow', 'grass', 'farm', 'steppe', 'forest', 'woods', 'pine', 'deadwood', 'crystal', 'hills',
  'heather', 'marsh', 'sand', 'dunes', 'salt', 'glass', 'vines', 'ash', 'lava', 'snow', 'ice', 'rock',
  'dirt', 'mountain', 'peak', 'cliff', 'chasm', 'volcano', 'road', 'building',
] as const;
export type WorldTerrain = (typeof TERRAINS)[number];
/** Index of each terrain in TERRAINS. */
export const TI = Object.fromEntries(TERRAINS.map((t, i) => [t, i])) as Record<WorldTerrain, number>;

/** What a built map's legend characters are on the world map. */
const MAP_TERRAIN: Record<string, WorldTerrain> = {
  ',': 'grass', ':': 'dirt', '=': 'road', '_': 'sand', '~': 'shallow', 'W': 'sea', 'w': 'marsh', '!': 'lava',
  '*': 'snow', 'T': 'forest', 'r': 'rock', 'M': 'mountain', '"': 'rock', 'B': 'building', 'D': 'building',
  'L': 'building', 'S': 'building', '#': 'building', 'o': 'building', '.': 'dirt',
};

/** Water: deep water needs a boat, shallows can be waded. */
export const isWater = (t: number): boolean => t === TI.sea || t === TI.shallow;

// ---------------------------------------------------------------- noise

/** A stable hash of an integer lattice point, 0..1. */
export function lattice(x: number, y: number, seed: number): number {
  let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x3c6ef372);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Smooth value noise, 0..1. */
export function noise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = lattice(xi, yi, seed), b = lattice(xi + 1, yi, seed), c = lattice(xi, yi + 1, seed), d = lattice(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** A few octaves of `noise`, 0..1. */
export function fbm(x: number, y: number, seed: number, octaves = 3): number {
  let t = 0, amp = 1, norm = 0, f = 1;
  for (let i = 0; i < octaves; i++) { t += noise(x * f, y * f, seed + i * 31) * amp; norm += amp; amp *= 0.5; f *= 2.03; }
  return t / norm;
}

// ---------------------------------------------------------------- lines and outlines

/** A Catmull-Rom curve through the points, `n` pieces per span; a closed ring wraps round. */
export function spline(pts: readonly Pt[], closed: boolean, n = 6): Pt[] {
  const m = pts.length;
  if (m < 3) return pts.slice();
  const at = (i: number): Pt => (closed ? pts[((i % m) + m) % m] : pts[Math.max(0, Math.min(m - 1, i))]);
  const out: Pt[] = [];
  const spans = closed ? m : m - 1;
  for (let i = 0; i < spans; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const c = (a: number, b: number, c2: number, d: number): number =>
        0.5 * (2 * b + (c2 - a) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (3 * b - a - 3 * c2 + d) * t3);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  if (!closed) out.push(pts[m - 1]);
  return out;
}

interface Sample { x: number; y: number; s: number; dx: number; dy: number }

/** Points along a polyline every `step` cells, with the distance along it and its heading at each. */
function resample(line: readonly Pt[], step: number): Sample[] {
  const out: Sample[] = [];
  let s = 0, carry = 0;
  for (let i = 1; i < line.length; i++) {
    const [x0, y0] = line[i - 1], [x1, y1] = line[i];
    const len = Math.hypot(x1 - x0, y1 - y0);
    if (!len) continue;
    const dx = (x1 - x0) / len, dy = (y1 - y0) / len;
    let t = carry;
    while (t <= len) { out.push({ x: x0 + dx * t, y: y0 + dy * t, s: s + t, dx, dy }); t += step; }
    carry = t - len;
    s += len;
  }
  const last = line[line.length - 1];
  if (out.length) { const p = out[out.length - 1]; out.push({ x: last[0], y: last[1], s, dx: p.dx, dy: p.dy }); }
  return out;
}

/** A river's course as the grid and the painter both draw it: the curve through its points, meandering. */
export interface Course { pts: Pt[]; width: number[] }
export function riverCourse(r: River, seed: number): Course {
  const [w0, w1] = r.width ?? [1, 2];
  const line = resample(spline(r.pts, false, 8), 0.5);
  const total = line.length ? line[line.length - 1].s : 0;
  const pts: Pt[] = [], width: number[] = [];
  for (const p of line) {
    const t = total ? p.s / total : 0;
    // Wander side to side, less near the source and not at all at the mouth.
    const taper = Math.min(1, t * 6) * Math.min(1, (1 - t) * 10);
    const off = (noise(p.s / 9, 0.5, seed) - 0.5) * 3.2 * taper;
    pts.push([p.x - p.dy * off, p.y + p.dx * off]);
    width.push(w0 + (w1 - w0) * t);
  }
  return { pts, width };
}

/** A trail's line as drawn: the curve through its points. */
export const trailLine = (t: Trail): Pt[] => spline(t.pts, false, 6);

/** Cells inside a closed ring, even-odd, over the ring's box. */
interface Mask { x0: number; y0: number; w: number; h: number; d: Uint8Array }
function fillRing(ring: readonly Pt[], W: number, H: number): Mask {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ring) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  const x0 = Math.max(0, Math.floor(minX)), y0 = Math.max(0, Math.floor(minY));
  const x1 = Math.min(W, Math.ceil(maxX + 1)), y1 = Math.min(H, Math.ceil(maxY + 1));
  const w = Math.max(0, x1 - x0), h = Math.max(0, y1 - y0);
  const d = new Uint8Array(w * h);
  const xs: number[] = [];
  for (let j = 0; j < h; j++) {
    const cy = y0 + j + 0.5;
    xs.length = 0;
    for (let i = 0, k = ring.length - 1; i < ring.length; k = i++) {
      const [ax, ay] = ring[k], [bx, by] = ring[i];
      if ((ay <= cy && by > cy) || (by <= cy && ay > cy)) xs.push(ax + ((cy - ay) / (by - ay)) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k] - 0.5 - x0)), b = Math.min(w - 1, Math.floor(xs[k + 1] - 0.5 - x0));
      for (let i = a; i <= b; i++) d[j * w + i] = 1;
    }
  }
  return { x0, y0, w, h, d };
}
const inMask = (m: Mask, x: number, y: number): boolean => {
  const i = Math.floor(x) - m.x0, j = Math.floor(y) - m.y0;
  return i >= 0 && j >= 0 && i < m.w && j < m.h && m.d[j * m.w + i] === 1;
};

// ---------------------------------------------------------------- the grid

export interface WorldGrid {
  width: number;
  height: number;
  /** One index into TERRAINS per cell, row-major. */
  terrain: Uint8Array;
  /** 1 where the cell is a built map's own cell. */
  built: Uint8Array;
  /** 1 on an atlas river (the painter draws those as strokes, not as a wash). */
  river: Uint8Array;
  /** 1 on a planned road; the cell keeps its terrain (a road through a wood, over a pass, across a ford). */
  road: Uint8Array;
  /** Index into the atlas's zones, -1 for void and deep water. */
  zone: Int16Array;
  /** The rivers' courses and the trails' lines, as the grid laid them. */
  courses: Course[];
  trails: Pt[][];
  at(x: number, y: number): WorldTerrain;
  /** Terrain index at a cell, void off the grid. */
  t(x: number, y: number): number;
}

/** How dear a cell is to cross when zones settle their borders; void and deep water are never crossed. */
const CROSS: Partial<Record<WorldTerrain, number>> = {
  grass: 2, farm: 2, road: 2, steppe: 2, sand: 2, dirt: 2, building: 2, woods: 2, forest: 3, pine: 3, heather: 3,
  vines: 3, salt: 3, marsh: 4, deadwood: 4, dunes: 4, ash: 4, glass: 4, hills: 5, rock: 5, snow: 6, ice: 6,
  crystal: 8, shallow: 16, lava: 20, mountain: 16, volcano: 30, peak: 30, cliff: 40, chasm: 60,
};
/** Terrain that foothills and beaches may be laid over. */
const SOFT = new Set<number>([TI.grass, TI.farm, TI.steppe, TI.heather, TI.dirt, TI.woods]);

/**
 * The world as cells. In order: the rim (nothing beyond it, a band of mountains inside it), the seas
 * and the isles raised from them, the patches of country, the lakes, the ranges with their
 * foothills, shallows along every shore, the rivers, beaches, and last the built maps, whose ring of
 * edge mountains is only their closed border, so edge cells that are mountain keep the atlas's
 * terrain (the sea south of the Shelf, the ridge between the Shelf and Thornmark) and any other edge
 * cell, like the road through the pass, is the map's. Then every land cell is given to a zone, and
 * the planned roads are marked over it all.
 */
export function worldGrid(atlas: Atlas, defs: readonly MapDef[]): WorldGrid {
  const W = atlas.width, H = atlas.height, N = W * H, seed = atlas.seed;
  const terrain = new Uint8Array(N), built = new Uint8Array(N), river = new Uint8Array(N);
  // One smooth displacement per cell; every outline reads its mask through it, scaled by its roughness.
  const wx = new Float32Array(N), wy = new Float32Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    wx[i] = (fbm(x / 15, y / 15, seed + 1) - 0.5) * 2.6;
    wy[i] = (fbm(x / 15 + 7.3, y / 15 + 2.1, seed + 2) - 0.5) * 2.6;
  }
  const inside = (m: Mask, i: number, rough: number): boolean => {
    const x = i % W, y = (i - x) / W;
    return inMask(m, x + 0.5 + wx[i] * rough, y + 0.5 + wy[i] * rough);
  };
  const each = (ring: readonly Pt[], rough: number, fn: (i: number) => void): void => {
    const m = fillRing(spline(ring, true), W, H);
    const pad = Math.ceil(rough * 1.4) + 1;
    const xa = Math.max(0, m.x0 - pad), ya = Math.max(0, m.y0 - pad), xb = Math.min(W, m.x0 + m.w + pad), yb = Math.min(H, m.y0 + m.h + pad);
    for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) { const i = y * W + x; if (inside(m, i, rough)) fn(i); }
  };

  // The rim, and the band of mountains inside it.
  each(atlas.rim.pts, atlas.rim.rough ?? 4, (i) => { terrain[i] = TI.grass; });
  // The world is one piece: a crumb of rim the wandering edge cut off from the rest is nothing.
  {
    const comp = new Int32Array(N).fill(-1), stack = new Int32Array(N);
    let best = -1, most = 0, id = 0;
    for (let i = 0; i < N; i++) {
      if (terrain[i] === TI.void || comp[i] >= 0) continue;
      let sp = 0, n = 0;
      stack[sp++] = i; comp[i] = id;
      while (sp) {
        const j = stack[--sp], x = j % W, y = (j - x) / W;
        n++;
        if (x > 0 && terrain[j - 1] !== TI.void && comp[j - 1] < 0) { comp[j - 1] = id; stack[sp++] = j - 1; }
        if (x < W - 1 && terrain[j + 1] !== TI.void && comp[j + 1] < 0) { comp[j + 1] = id; stack[sp++] = j + 1; }
        if (y > 0 && terrain[j - W] !== TI.void && comp[j - W] < 0) { comp[j - W] = id; stack[sp++] = j - W; }
        if (y < H - 1 && terrain[j + W] !== TI.void && comp[j + W] < 0) { comp[j + W] = id; stack[sp++] = j + W; }
      }
      if (n > most) { most = n; best = id; }
      id++;
    }
    for (let i = 0; i < N; i++) if (terrain[i] !== TI.void && comp[i] !== best) terrain[i] = TI.void;
  }
  const fromVoid = chamfer(W, H, (i) => terrain[i] === TI.void, true);
  // Water, and the isles raised back out of it; then the country, then the lakes.
  const water = new Uint8Array(N);
  for (const s of atlas.seas) each(s.pts, s.rough ?? 4, (i) => { water[i] = 1; });
  for (const s of atlas.isles) each(s.pts, s.rough ?? 2, (i) => { water[i] = 0; });
  for (const p of atlas.patches) {
    const t = TI[p.t];
    each(p.pts, p.rough ?? 3, (i) => { if (terrain[i] !== TI.void && !water[i]) terrain[i] = t; });
  }
  for (const s of atlas.lakes) each(s.pts, s.rough ?? 1.5, (i) => { water[i] = 1; });
  // Open country rolls: hills gather here and there, and the rim throws foothills inward.
  for (let i = 0; i < N; i++) {
    if (terrain[i] === TI.void) continue;
    if (water[i]) { terrain[i] = TI.sea; continue; }
    const x = i % W, y = (i - x) / W;
    const band = atlas.rim.width + (noise(x / 7, y / 7, seed + 3) - 0.5) * 5;
    const foot = 2 + fbm(x / 9, y / 9, seed + 4) * 8;
    if (fromVoid[i] < band) terrain[i] = TI.mountain;
    else if (fromVoid[i] < band + foot && SOFT.has(terrain[i])) terrain[i] = TI.hills;
    else if ((terrain[i] === TI.grass || terrain[i] === TI.steppe) && fbm(x / 10, y / 10, seed + 7) > 0.66) terrain[i] = TI.hills;
  }
  // The ranges: the crest, the range either side of it, then its foothills.
  for (const rg of atlas.ridges) {
    const kind = rg.kind ?? 'mountains';
    const core = kind === 'hills' ? TI.hills : kind === 'cliff' ? TI.cliff : kind === 'chasm' ? TI.chasm : kind === 'lava' ? TI.lava : TI.mountain;
    const foot = rg.foot ?? (kind === 'mountains' ? 3 : 0), footT = TI[rg.footT ?? 'hills'];
    const half = rg.width / 2, reach = half * 1.3 + foot + 4;
    // Wide ranges wander more at their edges; lines of cliff, chasm and lava keep to their course.
    const jitter = kind === 'cliff' || kind === 'chasm' ? 0 : kind === 'lava' ? 0.5 : 1.6 + half * 0.14;
    const st = stamp(W, H, resample(spline(rg.pts, false, 8), 0.5), () => reach);
    for (let j = 0; j < st.cells.length; j++) {
      const i = st.cells[j], d0 = st.d[j];
      if (terrain[i] === TI.void || water[i]) continue;
      const x = i % W, y = (i - x) / W;
      const d = d0 + wx[i] * jitter;
      // Snow lies on the high crest, in fields rather than one unbroken white line.
      if (d <= half) terrain[i] = rg.snow && d <= half * 0.55 && noise(x / 6, y / 6, seed + 9) > 0.46 ? TI.peak : core;
      else if (d <= half + foot && (SOFT.has(terrain[i]) || (footT !== TI.hills && terrain[i] !== core && terrain[i] !== TI.peak))) terrain[i] = footT;
    }
  }
  // Shallows along every shore, deep water further out.
  const fromLand = chamfer(W, H, (i) => terrain[i] !== TI.sea && terrain[i] !== TI.void, false);
  for (let i = 0; i < N; i++) if (terrain[i] === TI.sea && fromLand[i] <= 2) terrain[i] = TI.shallow;
  // Rivers run over whatever land they cross, cutting gorges through ranges.
  const courses = atlas.rivers.map((r, k) => riverCourse(r, seed + 40 + k));
  for (const c of courses) {
    const line = c.pts.map((p) => ({ x: p[0], y: p[1] }));
    const st = stamp(W, H, line, (j) => c.width[j] / 2 + 1);
    for (let j = 0; j < st.cells.length; j++) {
      const i = st.cells[j];
      if (terrain[i] === TI.void || isWater(terrain[i])) continue;
      if (st.d[j] <= Math.max(0.55, c.width[st.k[j]] / 2)) { terrain[i] = TI.shallow; river[i] = 1; }
    }
  }
  // Beaches where soft country meets open water, in runs rather than cell by cell.
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    if (!SOFT.has(terrain[i])) continue;
    const shore = [i - 1, i + 1, i - W, i + W].some((q) => isWater(terrain[q]) && !river[q]);
    if (shore && noise(x / 11, y / 11, seed + 5) > 0.36) terrain[i] = TI.sand;
  }
  // The built maps, stamped 1:1.
  for (const z of atlas.zones) {
    const def = z.map ? defs.find((d) => d.id === z.map) : undefined;
    if (!def || !z.at) continue;
    const [ax, ay] = z.at;
    const mh = def.rows.length, mw = Math.max(...def.rows.map((s) => s.length));
    for (let my = 0; my < mh; my++) for (let mx = 0; mx < mw; mx++) {
      const ch = def.rows[my][mx] ?? 'M';
      const edge = mx === 0 || my === 0 || mx === mw - 1 || my === mh - 1;
      if (edge && ch === 'M') continue;
      const x = ax + mx, y = ay + my;
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = y * W + x;
      terrain[i] = TI[MAP_TERRAIN[ch] ?? 'grass'];
      built[i] = 1; river[i] = 0;
    }
  }
  const zone = settleZones(atlas, defs, terrain, W, H);
  // Planned roads, marked over everything but the built maps and open water: over a river they are
  // a bridge or a ford, over a range a pass.
  const road = new Uint8Array(N);
  const trails = atlas.trails.map(trailLine);
  for (const line of trails) {
    for (const p of resample(line, 0.35)) {
      const x = Math.floor(p.x), y = Math.floor(p.y);
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = y * W + x;
      if (built[i] || terrain[i] === TI.void || terrain[i] === TI.sea) continue;
      road[i] = 1;
    }
  }
  const t = (x: number, y: number): number => (x < 0 || y < 0 || x >= W || y >= H ? TI.void : terrain[y * W + x]);
  return { width: W, height: H, terrain, built, river, road, zone, courses, trails, t, at: (x, y) => TERRAINS[t(x, y)] };
}

/** The cells within reach of a line's points, with each one's distance to the nearest point and which point that is. */
interface Stamp { cells: Int32Array; d: Float32Array; k: Int32Array }
function stamp(W: number, H: number, pts: readonly { x: number; y: number }[], reach: (k: number) => number): Stamp {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  pts.forEach((p, k) => { const r = reach(k); minX = Math.min(minX, p.x - r); minY = Math.min(minY, p.y - r); maxX = Math.max(maxX, p.x + r); maxY = Math.max(maxY, p.y + r); });
  const bx = Math.max(0, Math.floor(minX)), by = Math.max(0, Math.floor(minY));
  const bw = Math.max(0, Math.min(W, Math.ceil(maxX) + 1) - bx), bh = Math.max(0, Math.min(H, Math.ceil(maxY) + 1) - by);
  const dist = new Float32Array(bw * bh).fill(Infinity), near = new Int32Array(bw * bh).fill(-1);
  pts.forEach((p, k) => {
    const r = reach(k);
    for (let y = Math.max(by, Math.floor(p.y - r)); y <= Math.min(by + bh - 1, Math.ceil(p.y + r)); y++) {
      for (let x = Math.max(bx, Math.floor(p.x - r)); x <= Math.min(bx + bw - 1, Math.ceil(p.x + r)); x++) {
        const dd = Math.hypot(x + 0.5 - p.x, y + 0.5 - p.y), q = (y - by) * bw + (x - bx);
        if (dd <= r && dd < dist[q]) { dist[q] = dd; near[q] = k; }
      }
    }
  });
  let n = 0;
  for (let q = 0; q < near.length; q++) if (near[q] >= 0) n++;
  const cells = new Int32Array(n), d = new Float32Array(n), k = new Int32Array(n);
  for (let q = 0, j = 0; q < near.length; q++) {
    if (near[q] < 0) continue;
    cells[j] = (by + Math.floor(q / bw)) * W + bx + (q % bw); d[j] = dist[q]; k[j] = near[q]; j++;
  }
  return { cells, d, k };
}

/** Cells to the nearest cell that is `from`, chamfer 3-4, in cells; off the grid counts as `from` when `edge`. */
function chamfer(W: number, H: number, from: (i: number) => boolean, edge: boolean): Float32Array {
  const BIG = 1e6, d = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) d[i] = from(i) ? 0 : BIG;
  const off = edge ? 0 : BIG;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    if (!d[i]) continue;
    let v = d[i];
    v = Math.min(v, (x > 0 ? d[i - 1] : off) + 3, (y > 0 ? d[i - W] : off) + 3);
    v = Math.min(v, (x > 0 && y > 0 ? d[i - W - 1] : off) + 4, (x < W - 1 && y > 0 ? d[i - W + 1] : off) + 4);
    d[i] = v;
  }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
    const i = y * W + x;
    if (!d[i]) continue;
    let v = d[i];
    v = Math.min(v, (x < W - 1 ? d[i + 1] : off) + 3, (y < H - 1 ? d[i + W] : off) + 3);
    v = Math.min(v, (x < W - 1 && y < H - 1 ? d[i + W + 1] : off) + 4, (x > 0 && y < H - 1 ? d[i + W - 1] : off) + 4);
    d[i] = v;
  }
  for (let i = 0; i < W * H; i++) d[i] /= 3;
  return d;
}

/**
 * Which zone every land cell is in: the cheapest walk to it from any zone's seeds, where a range, a
 * river or a cliff costs far more to cross than open country, so two zones meet along the ridge or
 * the river between them. A built zone starts from its whole map.
 */
function settleZones(atlas: Atlas, defs: readonly MapDef[], terrain: Uint8Array, W: number, H: number): Int16Array {
  const N = W * H;
  const cost = new Float32Array(TERRAINS.length);
  TERRAINS.forEach((t, k) => { cost[k] = CROSS[t] ?? Infinity; });
  const zone = new Int16Array(N).fill(-1);
  const dist = new Float32Array(N).fill(Infinity);
  const heap = new Heap(N);
  const seedAt = (i: number, z: number): void => {
    if (!Number.isFinite(cost[terrain[i]]) || dist[i] === 0) return;
    dist[i] = 0; zone[i] = z; heap.push(i, 0);
  };
  atlas.zones.forEach((z, k) => {
    const def = z.map ? defs.find((d) => d.id === z.map) : undefined;
    if (def && z.at) {
      for (let my = 0; my < def.rows.length; my++) for (let mx = 0; mx < def.rows[my].length; mx++) {
        const x = z.at[0] + mx, y = z.at[1] + my;
        if (x >= 0 && y >= 0 && x < W && y < H) seedAt(y * W + x, k);
      }
    }
    for (const [sx, sy] of z.seeds ?? []) {
      const i = landNear(terrain, cost, W, H, Math.floor(sx), Math.floor(sy));
      if (i >= 0) seedAt(i, k);
    }
  });
  while (heap.size) {
    const i = heap.pop();
    const x = i % W, y = (i - x) / W, di = dist[i];
    for (let n = 0; n < 4; n++) {
      const nx = n === 0 ? x - 1 : n === 1 ? x + 1 : x, ny = n === 2 ? y - 1 : n === 3 ? y + 1 : y;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx, c = cost[terrain[q]];
      if (!Number.isFinite(c)) continue;
      const nd = di + (c + cost[terrain[i]]) / 2;
      if (nd < dist[q]) { dist[q] = nd; zone[q] = zone[i]; heap.push(q, nd); }
    }
  }
  // Land no walk reaches, an islet off the coast, goes with the nearest zone across the water.
  const near = Int16Array.from(zone), queue = new Int32Array(N);
  let head = 0, tail = 0;
  for (let i = 0; i < N; i++) if (zone[i] >= 0) queue[tail++] = i;
  while (head < tail) {
    const i = queue[head++], x = i % W, y = (i - x) / W;
    for (let n = 0; n < 4; n++) {
      const nx = n === 0 ? x - 1 : n === 1 ? x + 1 : x, ny = n === 2 ? y - 1 : n === 3 ? y + 1 : y;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx;
      if (near[q] >= 0 || terrain[q] === TI.void) continue;
      near[q] = near[i]; queue[tail++] = q;
      if (Number.isFinite(cost[terrain[q]])) zone[q] = near[i];
    }
  }
  return zone;
}

/** The nearest cell to (x, y) a zone can stand on, searching outwards a little. */
function landNear(terrain: Uint8Array, cost: Float32Array, W: number, H: number, x: number, y: number): number {
  for (let r = 0; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
    const xx = x + dx, yy = y + dy;
    if (xx >= 0 && yy >= 0 && xx < W && yy < H && Number.isFinite(cost[terrain[yy * W + xx]])) return yy * W + xx;
  }
  return -1;
}

/** A binary min-heap of cell indices keyed by distance. Stale entries are left in and skipped by the caller. */
class Heap {
  private ids: Int32Array; private keys: Float32Array; size = 0;
  constructor(cap: number) { this.ids = new Int32Array(cap); this.keys = new Float32Array(cap); }
  push(id: number, key: number): void {
    if (this.size >= this.ids.length) {
      const ids = new Int32Array(this.ids.length * 2), keys = new Float32Array(this.keys.length * 2);
      ids.set(this.ids); keys.set(this.keys); this.ids = ids; this.keys = keys;
    }
    let i = this.size++;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= key) break;
      this.ids[i] = this.ids[p]; this.keys[i] = this.keys[p]; i = p;
    }
    this.ids[i] = id; this.keys[i] = key;
  }
  pop(): number {
    const top = this.ids[0];
    const id = this.ids[--this.size], key = this.keys[this.size];
    let i = 0;
    for (;;) {
      let c = i * 2 + 1;
      if (c >= this.size) break;
      if (c + 1 < this.size && this.keys[c + 1] < this.keys[c]) c++;
      if (this.keys[c] >= key) break;
      this.ids[i] = this.ids[c]; this.keys[i] = this.keys[c]; i = c;
    }
    this.ids[i] = id; this.keys[i] = key;
    return top;
  }
}

// ---------------------------------------------------------------- lookups

/** The zone a built outdoor map is, if the atlas places it. */
export function zoneOfMap(atlas: Atlas, mapId: string): AtlasZone | undefined {
  return atlas.zones.find((z) => z.map === mapId && z.at);
}

/** The area an id belongs to: an area itself, a zone's area, or a built map's zone's area. */
export function areaOf(atlas: Atlas, id: string): AtlasArea | undefined {
  const direct = atlas.areas.find((a) => a.id === id);
  if (direct) return direct;
  const z = atlas.zones.find((q) => q.id === id || q.map === id);
  return z ? atlas.areas.find((a) => a.id === z.area) : undefined;
}

/** A map cell's centre on the world grid, for maps the atlas places. */
export function worldPoint(atlas: Atlas, mapId: string, x: number, y: number): [number, number] | null {
  const z = zoneOfMap(atlas, mapId);
  return z?.at ? [z.at[0] + x + 0.5, z.at[1] + y + 0.5] : null;
}

/** An area's level band: its built maps' bands and its planned zones', together. */
export function areaBand(atlas: Atlas, defs: readonly MapDef[], areaId: string): [number, number] | undefined {
  const area = atlas.areas.find((a) => a.id === areaId);
  let lo = Infinity, hi = -Infinity;
  for (const z of atlas.zones) {
    if (z.area !== areaId) continue;
    const b = (z.map ? defs.find((d) => d.id === z.map)?.band : undefined) ?? z.band ?? area?.band;
    if (b) { lo = Math.min(lo, b[0]); hi = Math.max(hi, b[1]); }
  }
  if (Number.isFinite(lo)) return [lo, hi];
  return area?.band ? [area.band[0], area.band[1]] : undefined;
}

/** One arrow of the zone overlay. */
export interface ZoneEdge {
  from: string;
  to: string;
  kind: LinkKind;
  planned: boolean;
  /** Travelled both ways (the maps have an exit each way, or it is a planned road, door or crossing). */
  both: boolean;
  /** Party flags the way waits on, from the exit's `needFlag`. */
  gate: string[];
  /** The step after which a planned way opens. */
  opens?: number;
  /** Ends on the world grid; absent means the place's plate or the zone's label. */
  a?: Pt;
  b?: Pt;
  via?: readonly Pt[];
  note?: string;
  noteAt?: Pt;
}

/**
 * The ways: every pair of built maps an exit joins, merged with its return exit, then the atlas's
 * planned links. Outdoor-to-outdoor exits run from the exit cell to the arrival cell; an exit into a
 * town or dungeon runs from its cell to that place's plate; stairs join plates.
 */
export function zoneEdges(atlas: Atlas, defs: readonly MapDef[]): ZoneEdge[] {
  const kindOf = new Map(defs.map((d) => [d.id, d.kind]));
  const edges: ZoneEdge[] = [];
  for (const d of defs) for (const e of d.exits ?? []) {
    const gate = [e.needFlag ?? []].flat();
    const back = edges.find((x) => x.from === e.to && x.to === d.id && !x.planned);
    if (back) { back.both = true; back.gate = [...new Set([...back.gate, ...gate])]; continue; }
    if (edges.some((x) => x.from === d.id && x.to === e.to && !x.planned)) continue;
    const fromOut = kindOf.get(d.id) === 'outdoor', toOut = kindOf.get(e.to) === 'outdoor';
    const kind: LinkKind = fromOut && toOut ? 'road' : fromOut || toOut ? 'enter' : 'stairs';
    const edge: ZoneEdge = { from: d.id, to: e.to, kind, planned: false, both: false, gate };
    if (fromOut) edge.a = worldPoint(atlas, d.id, e.x, e.y) ?? undefined;
    if (toOut) edge.b = worldPoint(atlas, e.to, e.tx, e.ty) ?? undefined;
    edges.push(edge);
  }
  // An exit out of a town or dungeon that is listed first leaves its outdoor end at the arrival
  // cell; the arrow belongs on the entrance, so take it from the matching exit the other way.
  for (const edge of edges) {
    if (kindOf.get(edge.to) === 'outdoor' && kindOf.get(edge.from) !== 'outdoor' && edge.both) {
      const out = defs.find((d) => d.id === edge.to)?.exits?.find((x) => x.to === edge.from);
      if (out) { const p = worldPoint(atlas, edge.to, out.x, out.y); if (p) edge.b = p; }
    }
  }
  for (const l of atlas.links) {
    edges.push({
      from: l.from, to: l.to, kind: l.kind, planned: true, both: l.kind === 'road' || l.kind === 'enter' || l.kind === 'sea',
      gate: [], opens: l.opens, a: l.a, b: l.b, via: l.via, note: l.note, noteAt: l.noteAt,
    });
  }
  return edges;
}

/** One step on the road of levels. */
export interface Step { order: number; id: string; name: string; band?: readonly [number, number]; built: boolean }

/** The progression, first step first: every area, and every place that is a step of its own. */
export function progression(atlas: Atlas, defs: readonly MapDef[]): Step[] {
  const steps: Step[] = [];
  for (const a of atlas.areas) {
    const built = atlas.zones.some((z) => z.area === a.id && !!z.map && defs.some((d) => d.id === z.map));
    steps.push({ order: a.order, id: a.id, name: a.name, band: areaBand(atlas, defs, a.id), built });
  }
  for (const p of atlas.places) if (p.order != null) steps.push({ order: p.order, id: p.id, name: p.name ?? p.id, band: p.band, built: !p.planned });
  return steps.sort((a, b) => a.order - b.order);
}

/**
 * Which areas and places the party can reach once `done` steps are finished: a walk over every
 * built exit and every planned way already open, from the first area. Built maps and zones stand
 * for the areas that hold them.
 */
export function reachable(atlas: Atlas, defs: readonly MapDef[], done: number): Set<string> {
  const edges = zoneEdges(atlas, defs);
  const alias = (id: string): string => areaOf(atlas, id)?.id ?? id;
  const start = atlas.areas.reduce((a, b) => (a.order <= b.order ? a : b));
  const seen = new Set([start.id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const e of edges) {
      if (e.opens != null && e.opens > done) continue;
      const f = alias(e.from), t = alias(e.to);
      if (seen.has(f) && !seen.has(t)) { seen.add(t); grew = true; }
      if (e.both && seen.has(t) && !seen.has(f)) { seen.add(f); grew = true; }
    }
  }
  return seen;
}

/** The outdoor map a town or dungeon opens onto, following exits up through its levels. */
export function homeMap(defs: readonly MapDef[], mapId: string): MapDef | undefined {
  const byId = new Map(defs.map((d) => [d.id, d]));
  const seen = new Set([mapId]);
  let frontier = [mapId];
  while (frontier.length) {
    const next: string[] = [];
    for (const id of frontier) for (const e of byId.get(id)?.exits ?? []) {
      if (seen.has(e.to)) continue;
      seen.add(e.to);
      const d = byId.get(e.to);
      if (d?.kind === 'outdoor') return d;
      next.push(e.to);
    }
    frontier = next;
  }
  return undefined;
}
