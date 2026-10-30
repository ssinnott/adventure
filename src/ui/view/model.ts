// What the view decides and does not draw (#1028), which the Node suites and the sweep's plan take: what
// stands on a square ahead (`standsAt`) and a cell as the scene draws it (`drawnAt`), a town's gates
// (`isGateway`), the houses, how they look, their buildings and the tents (`isHouse`, `looksHouse`,
// `building`, `isTent`, `tentOf`), a wall's dressing and its rates (`wallDressing`, `DRESSING_RATES`, held by
// tools/tests/art.ts), the fields and the colours of the ground through the year (`fieldAt`, `cropColor`,
// `hedgeColor`, `heatherBloom`, `iceColor`), how cold the year is on the heights (`cold`) and how far the
// weather closes the view (`murkOf`, `washes`). It takes src/game and nothing of the painters: no canvas.
// The grounds' looks read it (view/ground/, #1030), so it reads none of them: `SNOW_HOLD` is theirs.

import { viewCell as cellAt, isSolidWall, hillOver } from '../../game/world.ts';
import { drawnCell } from '../../game/ink.ts';
import type { GameMap } from '../../game/map.ts';
import type { Cell } from '../../game/mapdef.ts';
import type { Facing } from '../../game/types.ts';
import { mix } from '../../lib/art/palettes.ts';
import type { Weather } from '../../game/weather.ts';
import { DAYS_PER_YEAR } from '../../game/calendar.ts';
import { hash } from '../paint/brush.ts';

/** How much the weather closes the view: fog, or rain and (more so) snow coming down hard. */
export function murkOf(w: Weather): number { return Math.min(1, Math.max(w.fog, w.precip * (0.45 + 0.45 * w.snow) - 0.1)); }
/** Whether the view draws a murk wash over everything, the void included. The smoke test asks for none. */
export function washes(w: Weather): boolean { return w.fog > 0.05 || murkOf(w) > 0.05; }
/** How cold the year is on the heights: 1 in deep Frost, about 0 at Harvest. */
export function cold(day: number): number { return (1 + Math.cos((2 * Math.PI * (day - 100)) / DAYS_PER_YEAR)) / 2; }
export type Ramp = readonly [number, string][];
/** A colour through the year: the ramp's stops by day of the year, mixed between. */
export function rampColor(ramp: Ramp, day: number): string {
  let i = 0;
  while (i < ramp.length - 2 && day >= ramp[i + 1][0]) i++;
  const [d0, c0] = ramp[i], [d1, c1] = ramp[i + 1];
  return mix(c0, c1, Math.max(0, Math.min(1, (day - d0) / (d1 - d0))));
}
/** How far the heather is in flower: from late Longlight through Harvest, and over by Leafturn. */
export function heatherBloom(day: number): number { return Math.max(0, Math.min(1, (day - 38) / 6, (66 - day) / 6)); }
/**
 * A frozen lake through the year: white-grey deep in the winter and bluer and darker with meltwater
 * in the summer, but never open (the lakes under the glacier keep their ice).
 */
const ICE: Ramp = [[0, '#c0d0dc'], [24, '#a8bccc'], [46, '#98b0c2'], [66, '#a8bcca'], [88, '#c4d4e0'], [104, '#d2dee8'], [120, '#c0d0dc']];
export function iceColor(day: number): string { return rampColor(ICE, day); }

/**
 * The crops of the fields through the year (Thaw is day 0, Harvest 45, Mistfall 75): wheat and
 * barley green in Sowing, gold by Harvest and stubble after; pasture cut for hay in Harvest; roots
 * dark and leafy through the summer. Out of season the fields lie ploughed.
 */
export const CROPS: readonly Ramp[] = [
  [[0, '#6e5638'], [18, '#6a6a3a'], [30, '#6e9a3a'], [44, '#a8a848'], [52, '#d4b454'], [60, '#c8b078'], [78, '#7a5e3e'], [120, '#6e5638']],
  [[0, '#6e5638'], [20, '#6a7a3a'], [32, '#7aa044'], [46, '#c8c070'], [56, '#d8c890'], [62, '#b8a880'], [80, '#7a5e3e'], [120, '#6e5638']],
  [[0, '#6a7650'], [16, '#6a9a44'], [30, '#5aa840'], [48, '#6aa044'], [54, '#b0a860'], [64, '#7a9a48'], [94, '#6e7a50'], [120, '#6a7650']],
  [[0, '#6a5236'], [22, '#6a5a38'], [34, '#4e8a3a'], [58, '#4a7e34'], [70, '#7a6a3e'], [84, '#6a5236'], [120, '#6a5236']],
];
/** A crop's colour on a day of the year. */
export function cropColor(crop: number, day: number): string { return rampColor(CROPS[crop % CROPS.length], day); }

/** A field of the farmland: which one it is, its crop, and whether its rows run east and west. */
export interface Field { id: number; crop: number; rowsEW: boolean; }
/**
 * The field a farm square lies in. Fields are three squares long in bands two deep, staggered band
 * to band, so the patchwork spans squares as the world map's does and no two maps differ.
 */
export function fieldAt(x: number, y: number): Field {
  const band = Math.floor(y / 2), fx = Math.floor((x + Math.floor(hash(band, 71) * 3)) / 3);
  return { id: band * 4099 + fx, crop: Math.floor(hash(fx, band, 73) * CROPS.length), rowsEW: hash(fx, band, 79) < 0.5 };
}

export function toPair(p: { x: number; y: number }): [number, number] { return [p.x, p.y]; }

/**
 * A cell as the scene draws it: a door outdoors among mountain, rock or trees as they are, the void as
 * its look (#829), and a town's gate as a face of the wall it is set in, which carries the gate (#1071).
 */
export function drawnAt(map: GameMap, x: number, y: number): Cell {
  const c = drawnCell(map, x, y);
  return isGateway(map, x, y) ? { ...c, solid: 'wall' } : c.look ?? c;
}

const gateways = new WeakMap<GameMap, ReadonlySet<number>>();

/**
 * A town's gate (#1071): a way through a wall, on a town's map or the outdoors (a dungeon's ways are
 * its own), drawn as the wall with a gate in it. Its square is an exit and no door. Along its wall the
 * squares beside it are wall, building or the map's edge, or more of the gate's squares and then one
 * of those, so a gate is never at a wall's end or corner; across the wall it has open ground before it
 * and the wall's mass behind. Found once a map, from its exits.
 */
export function isGateway(map: GameMap, x: number, y: number): boolean {
  let found = gateways.get(map);
  if (!found) {
    const set = new Set<number>();
    if (map.kind !== 'dungeon') {
      const open = (cx: number, cy: number): boolean => { const n = map.at(cx, cy); return n.solid === 'none' && n.door === 'none'; };
      const hard = (cx: number, cy: number): boolean => { const n = map.at(cx, cy); return n.solid === 'wall' || n.solid === 'building'; };
      const way = (cx: number, cy: number): boolean => map.inBounds(cx, cy) && open(cx, cy) && map.exits.some((e) => e.x === cx && e.y === cy);
      // From a square of the gate along its wall: past its own squares, the next must be wall.
      const ends = (cx: number, cy: number, dx: number, dy: number): boolean => {
        let k = 1;
        while (k < 4 && way(cx + dx * k, cy + dy * k)) k++;
        return hard(cx + dx * k, cy + dy * k);
      };
      for (const e of map.exits) {
        if (!way(e.x, e.y)) continue;
        // Set in a wall that runs (dx, dy): walled at both ends, open ground on one side and the wall's mass on the other.
        const setIn = ([dx, dy]: [number, number]): boolean => ends(e.x, e.y, dx, dy) && ends(e.x, e.y, -dx, -dy)
          && ((open(e.x + dy, e.y + dx) && hard(e.x - dy, e.y - dx)) || (open(e.x - dy, e.y - dx) && hard(e.x + dy, e.y + dx)));
        if (setIn([1, 0]) || setIn([0, 1])) set.add(e.y * map.width + e.x);
      }
    }
    gateways.set(map, found = set);
  }
  return map.inBounds(x, y) && found.has(y * map.width + x);
}

/**
 * What the scene takes to stand on the cell at (d, l) from the eye: a wall (as `drawnAt` has it), a
 * house, a tent. Seen from below a hill, what lies
 * behind it is not drawn (#53): the hill's own ground runs on in its place with nothing standing on
 * it, so nothing beside it takes it for a wall, a house or a tent; `behind` gives the hill. A tent
 * stands lower than a wall, so it hides no face of a wall or of another tent. Over the smoke test's
 * backdrop it is the wall it stands in for, as a landmark is: the crack sweep looks at walls.
 */
export function standsAt(map: GameMap, px: number, py: number, f: Facing, backdrop?: string): {
  behind: (d: number, l: number) => { x: number; y: number } | undefined; solidAt: (d: number, l: number) => boolean;
  houseAt: (d: number, l: number) => boolean; tentAt: (d: number, l: number) => boolean;
} {
  const sq = (d: number, l: number): [number, number] => toPair(cellAt(px, py, f, d, l));
  const behind = (d: number, l: number): { x: number; y: number } | undefined => hillOver(map, px, py, f, d, l);
  return {
    behind,
    solidAt: (d, l) => !behind(d, l) && isSolidWall(drawnAt(map, ...sq(d, l))),
    houseAt: (d, l) => !behind(d, l) && isHouse(map, ...sq(d, l)),
    tentAt: (d, l) => !backdrop && !behind(d, l) && isTent(map, ...sq(d, l)),
  };
}

/** The hedges through the year: in leaf from Sowing to Mistfall, bare twigs through the winter. */
export function hedgeColor(day: number): string { return mix('#3e5e2a', '#5a4a38', Math.max(0, Math.min(1, Math.max((day - 76) / 12, (16 - day) / 12)))); }

/**
 * A house's cell: a building, or a door with a building beside it. A door set in stone (a keep's, a
 * gatehouse's) is the stone's, drawn as an arched doorway in the wall with no plaster, roof, lantern
 * or sign.
 */
export function isHouse(map: GameMap, x: number, y: number): boolean {
  const c = map.at(x, y);
  if (c.solid === 'building') return true;
  if (c.door !== 'door' && c.door !== 'locked') return false;
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([nx, ny]) => map.inBounds(nx, ny) && map.at(nx, ny).solid === 'building');
}

/**
 * Whether a house's cell is drawn as a house, in plaster and timber under its building's roof: in a
 * town every one, and outdoors one of a building its map marks a house (`MapDef.houses`, #1072). Any
 * other building outdoors is the stone, or the felt, of its palette.
 */
export function looksHouse(map: GameMap, x: number, y: number): boolean {
  return isHouse(map, x, y) && (map.kind === 'town' || building(map, x, y).marked);
}

/**
 * Whether a wall carries any dressing. Its hash has to beat those of the four cells around it, so
 * about one wall in five is dressed and two side by side never both are. Nothing past the edge of
 * the map is: outdoors that is the backdrop behind the ring of mountains.
 */
function isDressed(map: GameMap, x: number, y: number): boolean {
  if (!map.inBounds(x, y)) return false;
  const k = map.id.length, v = hash(x, y, k, 78);
  return v > hash(x - 1, y, k, 78) && v > hash(x + 1, y, k, 78) && v > hash(x, y - 1, k, 78) && v > hash(x, y + 1, k, 78);
}

/** What a house front carries, and what a stone wall does, in the order a wall's roll picks them.
 */
export const DRESSINGS = {
  house: ['flowers', 'ivy'],
  stone: ['sconce', 'banner', 'cobweb', 'crack', 'damp', 'ring', 'grate', 'carving'],
} as const;
/**
 * What hangs on, grows on, or is scratched into a wall. A door's lantern and sign are its
 * furniture, not dressing.
 */
export type Dressing = (typeof DRESSINGS)[keyof typeof DRESSINGS][number];
/**
 * The share of a dressed wall each kind takes, among the kinds of its wall; each wall's add up to 1
 * at most, and what is left is bare. Nearly half of a dressed stone wall is a sconce, so dungeons
 * stay lit. A new kind is written here or it does not typecheck.
 */
export const DRESSING_RATES: Record<Dressing, number> = {
  flowers: 0.64, ivy: 0.36,
  sconce: 0.45, banner: 0.08, cobweb: 0.08, crack: 0.08, damp: 0.07, ring: 0.08, grate: 0.08, carving: 0.08,
};

/**
 * The dressing on the wall at x,y, chosen by hash, so it is stable; null where it is bare. A door
 * is dressing enough, and only a plain wall is carved (a secret door is a wall that is not). A stone
 * wall the map places a banner on (`MapDef.banners`) always hangs one. A bare map (`MapDef.bare`, a
 * Rift) has none.
 */
export function wallDressing(map: GameMap, x: number, y: number): Dressing | null {
  const cell = map.at(x, y);
  if (map.def.bare || !isSolidWall(cell) || cell.solid === 'void' || cell.door === 'door' || cell.door === 'locked') return null;
  const house = looksHouse(map, x, y);
  if (!house && map.bannerAt(x, y)) return 'banner';
  if (!isDressed(map, x, y)) return null;
  // Felt carries nothing: no sconce, crack or carving on a tent.
  if (!house && map.paletteAt(x, y).wallStyle === 'tent') return null;
  const roll = hash(x * 131 + y * 17 + map.id.length * 7, 77);
  let top = 0;
  for (const kind of DRESSINGS[house ? 'house' : 'stone']) {
    top += DRESSING_RATES[kind];
    if (roll < top) return kind === 'carving' && cell.door !== 'none' ? null : kind;
  }
  return null;
}

/**
 * One building: the seed its plaster, roof and windows take their colours from, its chimney's cell, and
 * whether its map marks it a house (`MapDef.houses`).
 */
interface Building { seed: number; chimney: number; marked: boolean }
const buildings = new WeakMap<GameMap, Map<number, Building>>();

/**
 * The building a house cell belongs to, flooded out through the house cells it touches, so every
 * cell of an L or a 4x3 block agrees on one seed and on the one cell (map index) its chimney is on.
 */
export function building(map: GameMap, mx: number, my: number): Building {
  let known = buildings.get(map);
  if (!known) buildings.set(map, known = new Map());
  const found = known.get(my * map.width + mx);
  if (found) return found;
  const cells = new Set([my * map.width + mx]);
  for (const c of cells) {
    const x = c % map.width, y = Math.floor(c / map.width);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (map.inBounds(nx, ny) && isHouse(map, nx, ny)) cells.add(ny * map.width + nx);
    }
  }
  const all = [...cells].sort((a, b) => a - b);
  // Seeded by the top-left corner of its bounds, as a rectangular block always was.
  const seed = Math.min(...all.map((c) => c % map.width)) * 977 + Math.floor(all[0] / map.width) * 31 + map.id.length;
  const marked = all.some((c) => map.markedHouse(c % map.width, Math.floor(c / map.width)));
  const b: Building = { seed, chimney: all[Math.floor(hash(seed, 5) * all.length)], marked };
  for (const c of all) known.set(c, b);
  return b;
}

/** A tent's squares, a filled rectangle of them: its bounds, inclusive. */
export interface Tent { x0: number; y0: number; x1: number; y1: number }

/**
 * A tent's square: a building's square, or a door beside one, under a felt palette ('tent'), outside a
 * town, where a house is a house whatever the palette, as is a building its map marks a house.
 */
export function isTent(map: GameMap, x: number, y: number): boolean {
  return isHouse(map, x, y) && !looksHouse(map, x, y) && map.paletteAt(x, y).wallStyle === 'tent';
}

/**
 * The tent a square is part of: the tent squares it touches, flooded out, where they fill the
 * rectangle they span (sixteen squares at most); otherwise the square is a tent alone.
 */
export function tentOf(map: GameMap, mx: number, my: number): Tent {
  const alone = { x0: mx, y0: my, x1: mx, y1: my }, cells = new Set([my * map.width + mx]);
  for (const c of cells) {
    if (cells.size > 16) return alone;
    const x = c % map.width, y = Math.floor(c / map.width);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) if (map.inBounds(nx, ny) && isTent(map, nx, ny)) cells.add(ny * map.width + nx);
  }
  const t = { ...alone };
  for (const c of cells) { const x = c % map.width, y = Math.floor(c / map.width); t.x0 = Math.min(t.x0, x); t.x1 = Math.max(t.x1, x); t.y0 = Math.min(t.y0, y); t.y1 = Math.max(t.y1, y); }
  return cells.size === (t.x1 - t.x0 + 1) * (t.y1 - t.y0 + 1) ? t : alone;
}
