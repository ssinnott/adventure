// What every part of the view takes and none is above (#1028): the frame's state, the distance fog, the
// projection (`unit`, `unitIn`, `floorPt`), the polygon helpers, `ViewRect` and the colours of the
// ground the parts share. The state (`env`, `present` and `flames`) is held here and set at each paint
// through `setEnv`, `setPresent` and `setFlames`, never copied: a module's binding cannot be assigned
// from another, and a copy goes stale between frames.
//
// Geometry. The eye sits at the centre of the party's cell. A plane k cells ahead of the eye
// projects with a half-size unit u(k) = (H/2) * NEAR / (k + 0.5): the near face of the cell
// directly ahead (k = 0.5) fills 90% of the viewport height, and each deeper face shrinks in
// proportion. A cell at depth d (0 = the party's own cell) spans planes d-0.5 .. d+0.5; a cell at
// lateral offset l spans x = cx + (l-0.5)*2u .. cx + (l+0.5)*2u on each plane. Everything is
// painted back to front, outer lateral columns before the centre, so nearer geometry overdraws.

import type { Terrain, Feature } from '../../game/mapdef.ts';
import { shade, mix } from '../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../palette.ts';
import { HIGH_SUMMER } from '../scenery.ts';
import type { TreeSeason } from '../scenery.ts';
import type { Tide } from '../../game/calendar.ts';
import { SNOW_HOLD, rampColor, heatherBloom, iceColor, cropColor } from './model.ts';
import type { Ramp } from './model.ts';

export const VIEW_W = 400, VIEW_H = 268;
const NEAR = 0.9;

export interface ViewRect { x: number; y: number; w: number; h: number; }

export function unit(k: number, h: number): number { return (h / 2) * NEAR / (k + 0.5); }

/**
 * The weather and the season as the scene painter sees them, set at the top of each paint like
 * `flames`: murk is fog or driving rain or snow closing in (0 .. 1), cover the snow lying, wet the
 * rain standing, `day` the day of the year for the grass, `trees` how the year dresses them.
 */
interface Env { murk: number; cover: number; wet: number; day: number; trees: TreeSeason; tide: Tide; }
export const CLEAR: Env = { murk: 0, cover: 0, wet: 0, day: 45, trees: HIGH_SUMMER, tide: 'low' };
/** Tidal ground as it is drawn: the sea over it at high water, wet sand at low. */
export const asDrawn = (t: Terrain): Terrain => (t === 'tidal' && env.tide === 'high' ? 'water' : t);
export let env: Env = CLEAR;
/** Set at the top of each paint (paintScene): the weather and the season as the parts read them. */
export function setEnv(e: Env): void { env = e; }
/** Whether a feature is there now, as the world being painted says: a shut business hangs no sign. */
export let present: (f: Feature) => boolean = () => true;
/** Set at the top of each paint (paintScene): whether a feature is there now, as the world being painted says. */
export function setPresent(p: (f: Feature) => boolean): void { present = p; }

/** Distance fog: nearer is truer. `haze` is the colour far things fade toward. */
export function fog(color: string, d: number, dark: boolean, haze: string | null = null): string {
  // Outdoors (haze given) keeps its colour with distance, as Xeen does; dungeons fall off into dark.
  const f = dark ? Math.max(0.12, 1 - d * 0.3) : haze ? Math.max(0.7, 1 - d * 0.07) : Math.max(0.5, 1 - d * 0.12);
  const c = shade(color, f);
  if (!haze) return c;
  // Murk swallows far faces into the haze by night as by day; clear air only tints them by day.
  if (env.murk > 0) return mix(c, haze, Math.min(0.3 + env.murk * 0.6, d * (0.06 + env.murk * 0.24)));
  return dark ? c : mix(c, haze, Math.min(0.3, d * 0.06));
}

export const SNOW = '#eef2f7';
/** The grass through the year: dull after winter, fresh in Sowing, deep in summer, tawny by Mistfall. */
const GRASS: Ramp = [[0, '#6a7650'], [10, '#6a8a4a'], [22, '#58ae40'], [40, '#4c9a3a'], [62, '#5a9a3a'], [80, '#7a8a44'], [94, '#6e7650'], [120, '#6a7650']];
export function grassColor(day: number): string { return rampColor(GRASS, day); }
/** Hill grass: the grass of the year, thinner and drier on the rise. */
export function hillColor(day: number): string { return mix(grassColor(day), '#8a8450', 0.3); }
/** The moor: a purple-brown through the year, purple while the heather flowers. */
function heatherColor(day: number): string { return mix('#644a48', '#7a4a6c', heatherBloom(day)); }
/** The floor of the woods: the grass of the year in the trees' shade, over moss and leaf litter. */
function woodsColor(day: number): string { return mix(grassColor(day), '#3e5028', 0.45); }
/** The pinewoods' floor: needles and moss, brown through the year and a little greener in the spring. */
function pineColor(day: number): string { return mix(TERRAIN_COLORS.pine, grassColor(day), 0.18); }
/**
 * The steppe through the year: dun after the winter, green-gold in Sowing, gold by Longlight and
 * tawny at Harvest, the lions' colour, then straw and dun again.
 */
const STEPPE: Ramp = [[0, '#8a8458'], [14, '#8a9a50'], [28, '#9aa24a'], [42, '#b4a44c'], [56, '#bca252'], [72, '#a8985e'], [94, '#948a62'], [120, '#8a8458']];
export function steppeColor(day: number): string { return rampColor(STEPPE, day); }
/** The ground under the shore's creepers: dark loam and moss, greener in the summer. */
function vinesColor(day: number): string { return mix(TERRAIN_COLORS.vines, grassColor(day), 0.3); }
/**
 * The colour of the ground: the terrain's, the grass, the hills and the crop by season, darker when
 * wet, whitened by snow.
 */
export function groundColor(t: Terrain, kind: string, floorPal: string, crop = 0): string {
  if (kind === 'dungeon') return floorPal;
  const terrain = asDrawn(t);
  let c = terrain === 'grass' ? grassColor(env.day) : terrain === 'hills' ? hillColor(env.day) : terrain === 'woods' ? woodsColor(env.day) : terrain === 'farm' ? cropColor(crop, env.day) : terrain === 'heather' ? heatherColor(env.day)
    : terrain === 'steppe' ? steppeColor(env.day) : terrain === 'vines' ? vinesColor(env.day)
    : terrain === 'pine' ? pineColor(env.day) : terrain === 'ice' ? iceColor(env.day) : (TERRAIN_COLORS[terrain] ?? floorPal);
  if (env.wet > 0 && terrain !== 'water' && terrain !== 'deep' && terrain !== 'lava' && terrain !== 'chasm') c = shade(c, 1 - 0.18 * env.wet);
  const s = env.cover * SNOW_HOLD[terrain];
  return s > 0 ? mix(c, SNOW, s) : c;
}

/** A torch or lantern's flame, and the pixel it was painted over, read once its wall is done. */
export interface Flame {
  x: number; y: number; s: number; under?: number; lamp?: boolean;
  /** A lamp's light: the strip its glow and beam can reach, as painted when the lamp was, then where nothing nearer painted over it. */
  reach?: { x: number; y: number; w: number; h: number; before?: ImageData; mask?: HTMLCanvasElement };
}
/** Filled while a scene is painted: where the torches and lanterns are, for the per-frame flames. */
export let flames: Flame[] = [];
/** Set while a scene is painted (paintScene, and a face of the void that hides a torch): the array itself, never a copy. */
export function setFlames(f: Flame[]): void { flames = f; }

/** The unit at depth fraction s (0 near .. 1 far) through cell d; the party's own cell is clipped at k = 0, as its walls are. */
export function unitIn(d: number, s: number, h: number): number { return unit(Math.max(0, d - 0.5 + s), h); }

/** Corner of the floor sub-grid: depth fraction s (0 near .. 1 far) and lateral fraction t (0 left .. 1 right). */
export function floorPt(cx: number, horizon: number, h: number, d: number, l: number, s: number, t: number): [number, number] {
  const u = unitIn(d, s, h);
  return [cx + (l - 0.5 + t) * 2 * u, horizon + u];
}

/** The colour at a point, as one number. */
export function pixel(ctx: CanvasRenderingContext2D, x: number, y: number): number {
  const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
}

/** A face's 1px outline inside its pixel rect, leaving open the sides where the wall runs on. */
export function outlineRect(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, left: boolean, right: boolean): void {
  ctx.lineCap = 'butt'; ctx.beginPath();
  ctx.moveTo(x0, y0 + 0.5); ctx.lineTo(x1, y0 + 0.5); ctx.moveTo(x0, y1 - 0.5); ctx.lineTo(x1, y1 - 0.5);
  if (left) { ctx.moveTo(x0 + 0.5, y0); ctx.lineTo(x0 + 0.5, y1); }
  if (right) { ctx.moveTo(x1 - 0.5, y0); ctx.lineTo(x1 - 0.5, y1); }
  ctx.stroke();
}

export function quad(ctx: CanvasRenderingContext2D, a: [number, number], b: [number, number], c: [number, number], e: [number, number], fill: string): void {
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(e[0], e[1]); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
}
export function line(ctx: CanvasRenderingContext2D, a: [number, number], b: [number, number]): void { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
/** Add a polygon to the current path, always wound the same way, so polygons filled together union. */
export function addPoly(ctx: CanvasPath, pts: [number, number][]): void {
  let area = 0;
  for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; area += p[0] * q[1] - q[0] * p[1]; }
  const o = area < 0 ? [...pts].reverse() : pts;
  ctx.moveTo(o[0][0], o[0][1]); for (let i = 1; i < o.length; i++) ctx.lineTo(o[i][0], o[i][1]); ctx.closePath();
}
