// Every terrain's look in the view (#1030): `GROUND`, a record over the terrains made of their modules
// here, so that a terrain with no module of its own fails the typecheck; what the painters ask through it,
// the ground a square is drawn as (`asDrawn`), its variant at a cell (`variantAt`, #1101) and its colour
// now at its cell (`groundColor`), tinted by its region (#1099) and drifting across the land by the cell's noise
// (`cellNoise`, #1098); and
// `SNOW_HOLD`, read off the looks for the suites. A new ground is a module beside these, its look, and its
// line below.

import type { Terrain } from '../../../game/mapdef.ts';
import type { GameMap } from '../../../game/map.ts';
import type { RegionId } from '../../../game/weather.ts';
import { fbm } from '../../../game/atlas/painter.ts';
import { regionAt } from '../../../game/world.ts';
import { shade, mix, hexToRgb, rgbToHex } from '../../../lib/art/palettes.ts';
import { SNOW } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Variant } from './look.ts';
import { floor } from './floor.ts';
import { grass } from './grass.ts';
import { dirt } from './dirt.ts';
import { road } from './road.ts';
import { sand } from './sand.ts';
import { water } from './water.ts';
import { deep } from './deep.ts';
import { swamp } from './swamp.ts';
import { lava } from './lava.ts';
import { stone } from './stone.ts';
import { snow } from './snow.ts';
import { hills } from './hills.ts';
import { farm } from './farm.ts';
import { woods } from './woods.ts';
import { deadwood } from './deadwood.ts';
import { crystal } from './crystal.ts';
import { chasm } from './chasm.ts';
import { salt } from './salt.ts';
import { heather } from './heather.ts';
import { tidal } from './tidal.ts';
import { ash } from './ash.ts';
import { pine } from './pine.ts';
import { ice } from './ice.ts';
import { peak } from './peak.ts';
import { cliff } from './cliff.ts';
import { steppe } from './steppe.ts';
import { dunes } from './dunes.ts';
import { vines } from './vines.ts';
import { volcano } from './volcano.ts';
import { vent } from './vent.ts';

/** Each terrain's look; a terrain left out fails the typecheck. */
export const GROUND: Record<Terrain, GroundLook> = {
  floor, grass, dirt, road, sand, water, deep, swamp, lava, stone, snow,
  hills, farm, woods, deadwood, crystal, chasm, salt, heather, tidal,
  ash, pine, ice,
  peak, cliff,
  steppe, dunes, vines, volcano, vent,
};

/** How white each terrain goes under lying snow: its look's `snow`, as the suites read it. */
export const SNOW_HOLD = Object.fromEntries(Object.entries(GROUND).map(([t, g]) => [t, g.snow])) as Record<Terrain, number>;

/** A square's ground as it is drawn: its look's `drawnAs` where it has one (the tidal ground at high water). */
export const asDrawn = (p: Paint, t: Terrain): Terrain => GROUND[t].drawnAs?.(p.env) ?? t;

/** How many squares across the land's swathes run, and how far the noise is stretched to reach a look's bounds. */
const SWATHE = 14, STRETCH = 4.5;
/** The day of the year a look's drift is reckoned from: the first of Harvest, the day of #1094's twelve views. */
export const DRIFT_DAY = 45;

/**
 * The land's noise at a cell, 0 to 1 (#1098): the atlas's `fbm`, smooth over some `scale` squares, its
 * `salt` (the map's id, so no two maps lie alike) parting one land from another; at the default scale,
 * the swathes a ground's colour drifts by. A function of the cell alone, of any map or of the atlas, so
 * a square looks the same from wherever it is seen.
 */
export function cellNoise(x: number, y: number, salt: string, scale = SWATHE): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < salt.length; i++) h = Math.imul(h ^ salt.charCodeAt(i), 0x01000193);
  return fbm(x / scale, y / scale, h, 2);
}

/**
 * A look's colour drifted by the land at a cell: moved as far as its colour on `DRIFT_DAY` goes toward one
 * of its two colours, as far as the swathe lies from the middle, eased so that most land lies well toward
 * one or the other and none past its look's `by`. It moves the colour it is handed by that much, so the
 * year's colours and what is mixed in before it pass through whole.
 */
function drifted(look: GroundLook, c: string, x: number, y: number, salt: string): string {
  if (!look.drift) return c;
  const s = Math.max(-1, Math.min(1, (cellNoise(x, y, salt) - 0.5) * STRETCH)), [low, high] = look.drift.toward;
  const ref = look.color(DRIFT_DAY, 0), from = hexToRgb(ref), to = hexToRgb(mix(ref, s < 0 ? low : high, Math.abs(s) * (2 - Math.abs(s)) * look.drift.by)), at = hexToRgb(c);
  return rgbToHex(at[0] + to[0] - from[0], at[1] + to[1] - from[1], at[2] + to[2] - from[2]);
}

/** How steeply the land's noise is ranked into a variant's band: it lies about its middle as a bell does. */
const RANK = 10;

/**
 * A ground's variant at a cell (#1101), or none where its look has none or the map is a dungeon: by its
 * look's `pick` where it has one, else by the land's noise there, its own for each ground and map at its
 * look's scale, ranked so that each variant takes about its share. A function of the map and the cell
 * alone, which the floors and the plain views read alike.
 */
export function variantAt(t: Terrain, x: number, y: number, map: GameMap): Variant | undefined {
  const vs = GROUND[t].variants;
  if (!vs || map.kind === 'dungeon') return undefined;
  if ('pick' in vs) return vs.looks[vs.pick(map, x, y)];
  const u = 1 / (1 + Math.exp((0.5 - cellNoise(x, y, `${map.id}/${t}`, vs.scale)) * RANK)), all = vs.looks.reduce((n, v) => n + (v.share ?? 0), 0);
  let top = 0;
  return vs.looks.find((v) => u * all < (top += v.share ?? 0)) ?? vs.looks[vs.looks.length - 1];
}

/** How many squares either side of a zone's border a region's tint fades over (#1099): a blend, not a line. */
const FADE = 2;

/**
 * A map's regions by square, for the tints, over the map and `FADE` squares round it, `span` squares a
 * row: `regions` each once, none (the country past the zones) among them; `at` each square's index into
 * it, the region `regionAt` finds; `blends` whether a square within `FADE` of it lies in another, so that
 * its tint is a blend.
 */
interface Regions { readonly regions: readonly (RegionId | undefined)[]; readonly at: Uint8Array; readonly blends: Uint8Array; readonly span: number }
const regionsByMap = new WeakMap<GameMap, Regions>();
/** The map last asked and its regions, so a scene's many asks of one map skip the lookup. */
let lastMap: GameMap | undefined, lastRegions: Regions | undefined;

/**
 * A map's regions by square, found once a map: its zones laid down last to first over the map's region,
 * so a square takes the first zone that holds it, as `zoneAt` finds it; then which squares blend, along
 * the rows and down the columns.
 */
function regionsOf(map: GameMap): Regions {
  if (map === lastMap && lastRegions) return lastRegions;
  let found = regionsByMap.get(map);
  if (!found) {
    const span = map.width + 2 * FADE, rows = map.height + 2 * FADE, regions: (RegionId | undefined)[] = [];
    const index = (r: RegionId | undefined): number => { const i = regions.indexOf(r); return i < 0 ? regions.push(r) - 1 : i; };
    const at = new Uint8Array(span * rows).fill(index(map.def.region)), along = new Uint8Array(span * rows), blends = new Uint8Array(span * rows);
    for (let k = map.zones.length - 1; k >= 0; k--) {
      const z = map.zones[k], i = index(z.region ?? map.def.region), x0 = Math.max(0, z.x + FADE), x1 = Math.min(span, z.x + z.w + FADE);
      if (x0 < x1) for (let y = Math.max(0, z.y + FADE); y < Math.min(rows, z.y + z.h + FADE); y++) at.fill(i, y * span + x0, y * span + x1);
    }
    // A square blends where one within FADE down its column lies in another region, or has one along its row that does.
    for (let y = 0; y < rows; y++) for (let x = FADE; x < span - FADE; x++) {
      const i = y * span + x;
      for (let d = -FADE; d <= FADE; d++) if (at[i + d] !== at[i]) { along[i] = 1; break; }
    }
    for (let y = FADE; y < rows - FADE; y++) for (let x = FADE; x < span - FADE; x++) {
      const i = y * span + x;
      for (let d = -FADE; d <= FADE; d++) if (at[i + d * span] !== at[i] || along[i + d * span]) { blends[i] = 1; break; }
    }
    regionsByMap.set(map, found = { regions, at, blends, span });
  }
  lastMap = map; lastRegions = found;
  return found;
}

/**
 * A ground's colour tinted by the region its cell lies in (#1099): `by` of the way toward its region's
 * tint of it, the region `regionAt` finds (its zone's outdoors, its map's in a town); none where the Paint
 * holds no looks, nor past the zones, where no region is. Within `FADE` of another region it is the mean
 * of what each square round the cell takes, each region by how many of them it holds, so the tint fades
 * over a zone's border and the zones' edge as a land changes, and is no line. A function of the cell.
 */
function tinted(p: Paint, t: Terrain, c: string, x: number, y: number): string {
  const looks = p.looks;
  if (!looks) return c;
  const map = p.map, g = regionsOf(map), w = map.width, h = map.height;
  if (x >= 0 && y >= 0 && x < w && y < h && !g.blends[(y + FADE) * g.span + x + FADE]) {
    const r = g.regions[g.at[(y + FADE) * g.span + x + FADE]], tint = r ? looks[r].tints?.[t] : undefined;
    return tint ? mix(c, tint.toward, tint.by) : c;
  }
  // Each region by how many of the squares round the cell it holds, then the mean of what each square takes, as `mix` rounds it.
  const counts = new Array<number>(g.regions.length).fill(0), from = hexToRgb(c), sum = [0, 0, 0], n = (2 * FADE + 1) ** 2;
  for (let sy = y - FADE; sy <= y + FADE; sy++) for (let sx = x - FADE; sx <= x + FADE; sx++) {
    const on = sx >= -FADE && sy >= -FADE && sx < w + FADE && sy < h + FADE;
    counts[on ? g.at[(sy + FADE) * g.span + sx + FADE] : g.regions.indexOf(regionAt(map, sx, sy))]++;
  }
  for (let k = 0; k < counts.length; k++) {
    if (!counts[k]) continue;
    const r = g.regions[k], tint = r ? looks[r].tints?.[t] : undefined, to = tint ? rgbOf(tint.toward) : from, by = tint ? tint.by : 0;
    for (let j = 0; j < 3; j++) sum[j] += counts[k] * Math.round(from[j] + (to[j] - from[j]) * by);
  }
  return rgbToHex(sum[0] / n, sum[1] / n, sum[2] / n);
}

/** A tint's colour as red, green and blue, read once. */
const rgbs = new Map<string, readonly number[]>();
function rgbOf(hex: string): readonly number[] {
  let v = rgbs.get(hex);
  if (!v) rgbs.set(hex, v = hexToRgb(hex));
  return v;
}

/**
 * The colour of a ground at a cell, as the floors draw it: its look's, or its variant's there where the
 * floors hand one (`variantAt`), tinted by its region (#1099), drifted by the land, darker when wet where
 * rain darkens it, whitened by lying snow. Underground it is the palette's floor.
 */
export function groundColor(p: Paint, t: Terrain, floorPal: string, x: number, y: number, crop = 0, v?: Variant): string {
  const { env } = p, kind = p.map.kind;
  if (kind === 'dungeon') return floorPal;
  const look = GROUND[asDrawn(p, t)];
  // In this order: the look's colour today, its variant's shift, its region's tint, the land's drift at the cell, then rain and snow over it.
  let c = look.color(env.day, crop);
  if (v?.shift) {
    const { toward, by } = v.shift;
    // A fixed colour moves it as the drift does; a colour of the day is mixed into the day's, as the bracken turns.
    if (typeof toward === 'string') {
      const ref = look.color(DRIFT_DAY, 0), from = hexToRgb(ref), to = hexToRgb(mix(ref, toward, by)), at = hexToRgb(c);
      c = rgbToHex(at[0] + to[0] - from[0], at[1] + to[1] - from[1], at[2] + to[2] - from[2]);
    } else c = mix(c, toward(env.day), by);
  }
  c = tinted(p, asDrawn(p, t), c, x, y);
  c = drifted(look, c, x, y, p.map.id);
  if (env.wet > 0 && look.wets) c = shade(c, 1 - 0.18 * env.wet);
  const s = env.cover * look.snow;
  return s > 0 ? mix(c, SNOW, s) : c;
}
