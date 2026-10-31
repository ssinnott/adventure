// What every part of the view takes and none is above (#1028): the frame's `Paint` and its maker, the
// distance fog, the projection (`unit`, `unitIn`, `floorPt`), the polygon helpers, `ViewRect`, the grass
// of the year and the white of lying snow, which the sky and the grounds' looks share (view/ground/,
// #1030). The frame's state (the canvas and the eye's place on it, the
// light, the map, `env`, `present` and the flames being gathered) is one `Paint`, made once at the top
// of `paintScene` and given to each painter first (#1029); nothing of it is held between frames.
//
// Geometry. The eye sits at the centre of the party's cell. A plane k cells ahead of the eye
// projects with a half-size unit u(k) = (H/2) * NEAR / (k + 0.5): the near face of the cell
// directly ahead (k = 0.5) fills 90% of the viewport height, and each deeper face shrinks in
// proportion. A cell at depth d (0 = the party's own cell) spans planes d-0.5 .. d+0.5; a cell at
// lateral offset l spans x = cx + (l-0.5)*2u .. cx + (l+0.5)*2u on each plane. Everything is
// painted back to front, outer lateral columns before the centre, so nearer geometry overdraws.

import type { Feature } from '../../game/mapdef.ts';
import type { GameMap } from '../../game/map.ts';
import { shade, mix } from '../../lib/art/palettes.ts';
import { HIGH_SUMMER } from '../scenery.ts';
import type { TreeSeason } from '../scenery.ts';
import type { Tide } from '../../game/calendar.ts';
import { rampColor } from './model.ts';
import type { Ramp } from './model.ts';

const NEAR = 0.9;

export interface ViewRect { x: number; y: number; w: number; h: number; }

export function unit(k: number, h: number): number { return (h / 2) * NEAR / (k + 0.5); }

/**
 * The weather and the season as the scene painter sees them, worked out at the top of each paint:
 * murk is fog or driving rain or snow closing in (0 .. 1), cover the snow lying, wet the
 * rain standing, `day` the day of the year for the grass, `trees` how the year dresses them.
 */
export interface Env { murk: number; cover: number; wet: number; day: number; trees: TreeSeason; tide: Tide; }
export const CLEAR: Env = { murk: 0, cover: 0, wet: 0, day: 45, trees: HIGH_SUMMER, tide: 'low' };

/**
 * What one frame's painters share (#1029), made once at the top of `paintScene` and given to each
 * painter first: the canvas, the eye's column `cx`, the `horizon` and the view's height `h`; whether the
 * night is dark, the `haze` far things fade toward, the daylight and the `gloom` a grey day lights the
 * lamps by; the map, the weather and the season (`env`), whether a feature is there now (`present`: a
 * shut business hangs no sign) and the flames the scene lights as it is painted, read once it is done.
 */
export interface Paint {
  ctx: CanvasRenderingContext2D; cx: number; horizon: number; h: number;
  dark: boolean; haze: string | null; daylight: number; gloom: number;
  map: GameMap; env: Env; present: (f: Feature) => boolean; flames: Flame[];
}
/** Where a frame is drawn: the part of a Paint the figures over a finished scene take (`drawViewport`). */
export type View = Pick<Paint, 'ctx' | 'cx' | 'horizon' | 'h'>;
/** The light a frame is painted in and what the world says is there, as `paintOn` takes them. */
type Light = Pick<Paint, 'dark' | 'haze' | 'daylight' | 'gloom' | 'env' | 'present'>;
/** A clear day: not dark, no haze, full daylight, the clear `env` and every feature there. */
const DAY: Light = { dark: false, haze: null, daylight: 1, gloom: 1, env: CLEAR, present: () => true };
/**
 * A frame's Paint on `ctx` over `r`: the eye's column and the horizon in the middle of the rect, in the
 * light given, or a clear day's (the smoke's hill painted alone); no flames gathered yet.
 */
export function paintOn(ctx: CanvasRenderingContext2D, r: ViewRect, map: GameMap, light: Light = DAY): Paint {
  return { ...light, ctx, cx: r.x + r.w / 2, horizon: r.y + r.h / 2, h: r.h, map, flames: [] };
}

/** What the fog reads of a frame: whether it is dark, its haze and the murk in its `env`. */
type Air = Pick<Paint, 'dark' | 'haze' | 'env'>;
/** The frame's air without its haze: a door, its seam and a sconce's iron darken with the night and never fade into the haze. */
export const unhazed = (a: Air): Air => ({ dark: a.dark, haze: null, env: a.env });
/** Neither darkened nor hazed: a window lit at night, and a dungeon's ceiling. */
export const LIT: Air = { dark: false, haze: null, env: CLEAR };

/** Distance fog: nearer is truer. The air's `haze` is the colour far things fade toward. */
export function fog(a: Air, color: string, d: number): string {
  const { dark, haze, env } = a;
  // Outdoors (haze given) keeps its colour with distance, as Xeen does; dungeons fall off into dark.
  const f = dark ? Math.max(0.12, 1 - d * 0.3) : haze ? Math.max(0.7, 1 - d * 0.07) : Math.max(0.5, 1 - d * 0.12);
  const c = shade(color, f);
  if (!haze) return c;
  // Murk swallows far faces into the haze by night as by day; clear air only tints them by day.
  if (env.murk > 0) return mix(c, haze, Math.min(0.3 + env.murk * 0.6, d * (0.06 + env.murk * 0.24)));
  return dark ? c : mix(c, haze, Math.min(0.3, d * 0.06));
}

/** The tone a thing standing on open ground d squares off takes, a tree's, a rock's or a feature's: darker by night, with distance and in murk. */
export const boardTone = (a: Pick<Air, 'dark' | 'env'>, d: number): number => (a.dark ? 0.3 : Math.max(0.5, 1 - d * 0.12)) * (1 - a.env.murk * 0.1 * d);

export const SNOW = '#eef2f7';
/** The grass through the year: dull after winter, fresh in Sowing, deep in summer, tawny by Mistfall. */
const GRASS: Ramp = [[0, '#6a7650'], [10, '#6a8a4a'], [22, '#58ae40'], [40, '#4c9a3a'], [62, '#5a9a3a'], [80, '#7a8a44'], [94, '#6e7650'], [120, '#6a7650']];
export function grassColor(day: number): string { return rampColor(GRASS, day); }

/** A torch or lantern's flame, and the pixel it was painted over, read once its wall is done. */
export interface Flame {
  x: number; y: number; s: number; under?: number; lamp?: boolean;
  /** A lamp's light: the strip its glow and beam can reach, as painted when the lamp was, then where nothing nearer painted over it. */
  reach?: { x: number; y: number; w: number; h: number; before?: ImageData; mask?: HTMLCanvasElement };
}

/** The unit at depth fraction s (0 near .. 1 far) through cell d; the party's own cell is clipped at k = 0, as its walls are. */
export function unitIn(d: number, s: number, h: number): number { return unit(Math.max(0, d - 0.5 + s), h); }

/** Corner of the floor sub-grid: depth fraction s (0 near .. 1 far) and lateral fraction t (0 left .. 1 right). */
export function floorPt(cx: number, horizon: number, h: number, d: number, l: number, s: number, t: number): [number, number] {
  const u = unitIn(d, s, h);
  return [cx + (l - 0.5 + t) * 2 * u, horizon + u];
}

/**
 * A wall's front face on the screen (#1029): from x0 across to x1 and from its top down to its foot
 * (`bottom`), and whether it runs on into the next face on the left and on the right.
 */
export interface Front { x0: number; x1: number; top: number; bottom: number; joinL: boolean; joinR: boolean }

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
