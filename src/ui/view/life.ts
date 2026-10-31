// What moves over the view outdoors (#1109): birds wheeling by day over open ground, gulls where the sea
// or its shallows are near, ash drifting on the wind over the ash, heat shimmer over steppe, sand and
// dunes at a summer noon, fireflies in the woods on summer nights and mist lying over water and low
// ground at dawn. `lifeIn` says what moves in view, from the minute, the weather, the ground in view and
// where the company stands; `drawLife` draws it from that and the frame's number, never the game's
// generator, every frame over the kept scene and under the weather (compositor.ts, `drawViewport`).
// Nothing underground, in a fight, in fog or where the dark would hide it, and nothing over a wall or a
// tree that stands before it. Few and small: each part to its cap (`LIFE_CAPS`, held by
// tools/tests/life.ts). No setting turns it off.

import type { World } from '../../game/world.ts';
import { VIEW_DEPTH, VIEW_LATERAL, viewCell as cellAt, lineOfSight } from '../../game/world.ts';
import type { GameMap } from '../../game/map.ts';
import type { Cell, Solid, Terrain } from '../../game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import type { Facing } from '../../game/types.ts';
import { mixHash } from '../../game/weather.ts';
import { sunTimes } from '../../game/calendar.ts';
import { isWater } from '../../game/atlas.ts';
import { GRID } from '../../content/maps.ts';
import { mix, rgba } from '../../lib/art/palettes.ts';
import { unit } from './common.ts';
import type { ViewRect } from './common.ts';
import { murkOf, drawnAt } from './model.ts';

/** The most of each part in view at once: few and small, as the scene's restraint asks. */
export const LIFE_CAPS = { birds: 3, gulls: 3, ash: 48, shimmer: 6, fireflies: 6, mist: 3 } as const;

/** A bank of mist over a row of the view: its depth and the run of squares across it lies over, left to right. */
export interface Bank { d: number; l0: number; l1: number }

/**
 * What moves in view now: how many of each part, the mist as its banks and how thick it lies at this
 * hour (0 .. 1), the wind across the view toward the party's right hand (negative: the left), the
 * cloud, the light (the daylight greyed by cloud), the murk that fades it all, and the hour on the
 * world's clock, which picks where the birds wheel.
 */
export interface Life {
  birds: number; gulls: number; ash: number; shimmer: number; fireflies: number;
  mist: readonly Bank[]; dawn: number; across: number; cloud: number; light: number; murk: number; hour: number;
}

const NONE: Life = { birds: 0, gulls: 0, ash: 0, shimmer: 0, fireflies: 0, mist: [], dawn: 0, across: 0, cloud: 0, light: 0, murk: 0, hour: 0 };

/** Open ground, which birds wheel over by day. */
const OPEN: ReadonlySet<Terrain> = new Set<Terrain>(['grass', 'farm', 'steppe', 'heather', 'hills', 'dirt', 'road', 'sand', 'dunes', 'salt', 'snow', 'ice', 'tidal', 'vines']);
/** Ground the air shimmers over at a summer noon. */
const HOT: ReadonlySet<Terrain> = new Set<Terrain>(['steppe', 'sand', 'dunes']);
/** Ground the dawn mist lies over; it lies in the low ground below a hill as well. */
const WET: ReadonlySet<Terrain> = new Set<Terrain>(['water', 'deep', 'swamp', 'tidal']);
/** How far about the party, in squares each way, the world's grid is searched for the sea and its shallows: gulls fly within it. */
const COAST = 4;
/** How tall each solid stands over the horizon, in units of its depth: what a bird or the shimmer is hidden behind. */
const TALL: Readonly<Record<Solid, number>> = { none: 0, wall: 1.2, tree: 1.9, rock: 1, mountain: 4, pillar: 1.6, building: 2, void: 99 };

/** 0 before `a`, rising to 1 at `b`, 1 to `c` and falling to 0 at `d`. */
const ramp = (t: number, a: number, b: number, c: number, d: number): number => Math.max(0, Math.min(1, (t - a) / (b - a), (d - t) / (d - c)));

/**
 * What moves in view now (see Life), a pure function of the minute, the weather, the ground in view
 * and where the company stands: the squares ahead to the view's depth and beside it, and the world's
 * grid within `COAST` of its square. Nothing underground or in fog.
 */
export function lifeIn(world: World): Life {
  if (!world.underSky) return NONE;
  const wx = world.weather, murk = murkOf(wx);
  if (murk >= 0.35) return NONE;
  const map = world.map, { x: px, y: py, facing: f, minutes } = world.state, eye = { x: px, y: py };
  const daylight = world.daylight, light = daylight * (1 - 0.35 * wx.cloud), { dayOfYear, season } = world.date;
  const hour = (minutes % 1440) / 60, summer = season === 'summer';
  // The ground in view: the squares ahead and those beside the company.
  let n = 0, open = 0, hot = 0, ash = 0, woods = 0;
  for (let d = 0; d <= VIEW_DEPTH; d++) for (let l = -VIEW_LATERAL; l <= VIEW_LATERAL; l++) {
    const { x, y } = cellAt(px, py, f, d, l), c = drawnAt(map, x, y, eye);
    n++;
    if (c.terrain === 'woods' || (c.solid === 'tree' && c.terrain === 'grass')) woods++;
    if (c.solid !== 'none') continue;
    if (OPEN.has(c.terrain)) open++;
    if (HOT.has(c.terrain)) hot++;
    if (c.terrain === 'ash') ash++;
  }
  // The sea or its shallows near, in the world's grid about the company's square (a town's, where its way
  // out lands): a stretch of it, not a river's course.
  let sea = 0;
  const at = world.worldCell;
  if (at) for (let y = at.y - COAST; y <= at.y + COAST; y++) for (let x = at.x - COAST; x <= at.x + COAST; x++) if (isWater(GRID.t(x, y)) && !GRID.river[y * GRID.width + x]) sea++;
  const coast = sea >= 6, rf = ((f + 1) & 3) as Facing, h = Math.floor(minutes / 60);
  const across = (Math.cos(wx.windDir) * FACING_DX[rf] + Math.sin(wx.windDir) * FACING_DY[rf]) * wx.wind;
  const fair = wx.precip < 0.1 && wx.storm < 0.05 && wx.wind < 0.75;
  // Birds each hour and each way, the more the more open the land; gulls the same, but none in a quarter of them.
  const birds = !coast && fair && daylight >= 0.5 && open / n >= 0.4 && ash / n < 0.2 ? Math.min(LIFE_CAPS.birds, 1 + Math.floor(mixHash(h, f, 41) * 3 * open / n)) : 0;
  const gulls = coast && wx.precip < 0.3 && wx.storm < 0.3 && daylight >= 0.3 ? Math.floor(mixHash(h, f, 42) * (LIFE_CAPS.gulls + 1)) : 0;
  // Ash lifted off the ash by the wind, and laid by rain; grey in the dark, it is lost there.
  const ashN = ash / n >= 0.2 && daylight >= 0.2 && wx.precip < 0.3 ? Math.round(LIFE_CAPS.ash * Math.min(1, 1.25 * ash / n) * (0.7 + 0.3 * wx.wind) * (1 - murk)) : 0;
  // Heat over the hot ground through the middle of a hot summer's day.
  const heat = summer && wx.cloud < 0.5 && wx.precip < 0.02 ? ramp(hour, 10, 11, 15, 16) * Math.min(1, Math.max(0, (wx.temp - 18) / 10)) : 0;
  const shimmer = heat > 0 && hot / n >= 0.3 ? Math.max(1, Math.round(LIFE_CAPS.shimmer * heat * Math.min(1, 1.5 * hot / n))) : 0;
  const fireflies = summer && daylight < 0.15 && wx.precip < 0.05 && wx.wind < 0.5 && woods / n >= 0.15 ? Math.max(2, Math.round(LIFE_CAPS.fireflies * Math.min(1, 2 * woods / n))) : 0;
  // Mist at dawn on a still, dry morning, each bank over the longest run of misty squares seen in a row, the farthest first.
  const { dawn } = sunTimes(dayOfYear), thick = wx.wind < 0.4 && wx.precip < 0.05 ? ramp(hour, dawn - 1, dawn - 0.25, dawn + 0.75, dawn + 2) : 0;
  const mist: Bank[] = [];
  if (thick > 0) {
    const high = drawnAt(map, px, py, eye).terrain === 'hills';
    const misty = (c: Cell): boolean => c.solid === 'none' && (WET.has(c.terrain) || (high && c.terrain !== 'hills' && OPEN.has(c.terrain)));
    for (let d = Math.min(VIEW_DEPTH, world.sight); d >= 1 && mist.length < LIFE_CAPS.mist; d--) {
      let best: Bank | null = null, from = -VIEW_LATERAL;
      for (let l = -VIEW_LATERAL; l <= VIEW_LATERAL + 1; l++) {
        const { x, y } = cellAt(px, py, f, d, l);
        const on = l <= VIEW_LATERAL && misty(drawnAt(map, x, y, eye)) && lineOfSight(map, px, py, f, d, l);
        if (on) continue;
        if (l > from && (!best || l - 1 - from > best.l1 - best.l0)) best = { d, l0: from, l1: l - 1 };
        from = l + 1;
      }
      if (best) mist.push(best);
    }
  }
  return { birds, gulls, ash: ashN, shimmer, fireflies, mist, dawn: thick, across, cloud: wx.cloud, light, murk, hour: h };
}

/**
 * What moves over the view, every frame, over the scene and under the weather: `lifeIn`'s parts drawn
 * at the frame's number. The explore view draws it; a fight draws none.
 */
export function drawLife(ctx: CanvasRenderingContext2D, world: World, r: ViewRect, frame: number): void {
  const life = lifeIn(world);
  if (!life.birds && !life.gulls && !life.ash && !life.shimmer && !life.fireflies && !life.mist.length) return;
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  const { x, y, facing: f } = world.state;
  const v: Frame = { ctx, r, map: world.map, x, y, f, eye: { x, y }, life, frame };
  if (life.mist.length) drawMist(v);
  if (life.shimmer) drawShimmer(v);
  if (life.fireflies) drawFireflies(v);
  if (life.birds) drawBirds(v);
  if (life.gulls) drawGulls(v);
  if (life.ash) drawAsh(v);
  ctx.restore();
}

/** What each part's drawer is given: the canvas and the view's rect, where the company stands, what moves and the frame. */
interface Frame { ctx: CanvasRenderingContext2D; r: ViewRect; map: GameMap; x: number; y: number; f: Facing; eye: { x: number; y: number }; life: Life; frame: number }

/**
 * Whether a point `dx` across from the eye's column and `rise` over the horizon lies behind something
 * standing in view: a solid square or a hill on the line to it, as tall as `TALL` says.
 */
function hidden(v: Frame, dx: number, rise: number): boolean {
  for (let d = 0; d <= VIEW_DEPTH; d++) for (let k = d ? -1 : 1; k <= 1; k += 2) {
    // The line's way across the square's near side and its far one.
    const u = unit(d + 0.45 * k, v.r.h), l = Math.round(dx / (2 * u));
    if (Math.abs(l) > VIEW_LATERAL) continue;
    const { x, y } = cellAt(v.x, v.y, v.f, d, l), c = drawnAt(v.map, x, y, v.eye);
    const tall = TALL[c.solid] || (c.terrain === 'hills' ? 0.5 : 0);
    if (tall && rise < tall * u) return true;
  }
  return false;
}

/** A shape's pixels about its middle, added to the path. */
function put(ctx: CanvasRenderingContext2D, x: number, y: number, px: readonly (readonly [number, number])[]): void {
  for (const [dx, dy] of px) ctx.rect(x + dx, y + dy, 1, 1);
}

/** A far bird: its wings raised in a v as it glides, and beating down. */
const BIRD: readonly (readonly [number, number][])[] = [
  [[-2, -2], [-1, -1], [0, 0], [1, -1], [2, -2]],
  [[-2, 0], [-1, -1], [0, 0], [1, -1], [2, 0]],
];
/** A gull: its long wings bent at the wrist as it glides, and beating down; the tips apart, as they are dark. */
const GULL: readonly (readonly [number, number][])[] = [
  [[-2, -1], [-1, -1], [0, 0], [1, -1], [2, -1]],
  [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]],
];
const GULL_TIPS: readonly (readonly [number, number][])[] = [[[-3, 0], [3, 0]], [[-3, 1], [3, 1]]];

/** Birds wheeling together high over open ground, this hour's and this way's, a beat of the wings now and then. */
function drawBirds(v: Frame): void {
  const { ctx, r, life, frame } = v, s = life.hour * 4 + v.f, n = life.birds, cx = r.w / 2, horizon = r.h / 2;
  const fx = r.w * (0.25 + 0.5 * mixHash(s, 61)), rise0 = r.h * (0.3 + 0.1 * mixHash(s, 62)), turn = mixHash(s, 63) < 0.5 ? 1 : -1;
  ctx.fillStyle = rgba(mix('#24222a', '#44444c', life.cloud), 1 - 2 * life.murk);
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const per = 700 + 500 * mixHash(s, i, 64), rad = r.w * (0.04 + 0.05 * mixHash(s, i, 65));
    const a = (i / n) * 2 * Math.PI + turn * 2 * Math.PI * frame / per;
    const dx = fx - cx + Math.cos(a) * rad + Math.sin(frame / 1700 + i) * 14, rise = rise0 + Math.sin(a) * rad * 0.35;
    if (hidden(v, dx, rise)) continue;
    const beat = (frame + Math.floor(mixHash(s, i, 66) * 150)) % 150;
    put(ctx, r.x + Math.round(cx + dx), r.y + Math.round(horizon - rise), BIRD[beat < 24 && (beat >> 3) % 2 ? 1 : 0]);
  }
  ctx.fill();
}

/** Gulls gliding low over the coast, carried along by the wind across the view, beating their wings more often than the land's birds. */
function drawGulls(v: Frame): void {
  const { ctx, r, life, frame } = v, s = life.hour * 4 + v.f + 7, n = life.gulls, cx = r.w / 2, horizon = r.h / 2, wrap = r.w + 24;
  const dir = life.across > 0.03 ? 1 : life.across < -0.03 ? -1 : mixHash(s, 71) < 0.5 ? 1 : -1, speed = 0.1 + 0.3 * Math.min(1, Math.abs(life.across));
  const seen: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = ((mixHash(s, i, 72) * wrap + dir * frame * speed * (0.75 + 0.5 * mixHash(s, i, 73))) % wrap + wrap) % wrap - 12;
    const rise = r.h * (0.1 + 0.16 * mixHash(s, i, 74)) + 4 * Math.sin(frame / (50 + 40 * mixHash(s, i, 75)) + i * 2);
    if (hidden(v, x - cx, rise)) continue;
    const beat = (frame + Math.floor(mixHash(s, i, 76) * 110)) % 110;
    seen.push([r.x + Math.round(x), r.y + Math.round(horizon - rise), beat < 30 && (beat >> 3) % 2 ? 1 : 0]);
  }
  const alpha = 1 - 2 * life.murk;
  for (const [col, shapes] of [[mix('#646a78', '#f4f2ec', life.light), GULL], [mix('#1e1e24', '#3a3a42', life.light), GULL_TIPS]] as const) {
    ctx.fillStyle = rgba(col, alpha); ctx.beginPath();
    for (const [x, y, k] of seen) put(ctx, x, y, shapes[k]);
    ctx.fill();
  }
}

/** Ash on the wind: grey flakes, pale and dark, falling slowly and carried across the view as the wind blows. */
function drawAsh(v: Frame): void {
  const { ctx, r, life, frame } = v, n = life.ash, wrap = r.w + 20, drift = life.across * 1.2;
  for (const [k, col] of [[0, mix('#4a4846', '#d4cec6', life.light)], [1, mix('#1c1a1a', '#4c4844', life.light)]] as const) {
    ctx.fillStyle = rgba(col, 0.9 * (1 - life.murk)); ctx.beginPath();
    for (let i: number = k; i < n; i += 2) {
      // A third of the flakes near: a fleck, falling and carried faster; the rest far specks.
      const near = mixHash(i, 86) < 0.35, pace = near ? 1.8 : 1;
      const y = Math.floor((mixHash(i, 82) * r.h + frame * pace * (0.1 + 0.2 * mixHash(i, 81))) % r.h);
      const x = Math.floor(((mixHash(i, 83) * wrap + frame * pace * drift * (0.7 + 0.6 * mixHash(i, 84)) + Math.sin(frame / 50 + mixHash(i, 85) * 6.3) * 3) % wrap + wrap) % wrap) - 10;
      ctx.rect(r.x + x, r.y + y, 2, near ? 2 : 1);
    }
    ctx.fill();
  }
}

/**
 * Heat shimmer: the sky's pale blue lying in the rows under the horizon in long thin streaks, each over a
 * shorter one that wavers against it, breathing and coming and going, never over what stands before them.
 */
function drawShimmer(v: Frame): void {
  const { ctx, r, life, frame } = v, s = v.f, horizon = Math.round(r.h / 2), cx = r.w / 2;
  ctx.fillStyle = rgba(mix('#7c8ca0', '#c4d6ea', life.light), 0.5);
  ctx.beginPath();
  for (let i = 0; i < life.shimmer; i++) {
    if ((frame + Math.floor(mixHash(s, i, 96) * 240)) % 240 >= 200) continue;
    const row = 1 + Math.floor(mixHash(s, i, 91) * 4), x = r.w * (0.06 + 0.88 * mixHash(s, i, 92)), t = frame / (14 + 10 * mixHash(s, i, 94)) + i * 1.7;
    const len = Math.round((12 + 18 * mixHash(s, i, 93)) * (0.7 + 0.3 * Math.sin(frame / 23 + mixHash(s, i, 95) * 6.3)));
    if (hidden(v, x - len / 2 - cx, -row - 1) || hidden(v, x + len / 2 - cx, -row - 1)) continue;
    ctx.rect(r.x + Math.round(x - len / 2 + Math.sin(t) * 2), r.y + horizon + row, len, 1);
    ctx.rect(r.x + Math.round(x - len / 4 - Math.sin(t) * 3), r.y + horizon + row + 1, Math.round(len / 2), 1);
  }
  ctx.fill();
}

/** Fireflies low among the trees: each a point of light with a faint cross of glow, drifting, lit a while and then dark a while. */
function drawFireflies(v: Frame): void {
  const { ctx, r, life, frame } = v, s = (v.x * 31 + v.y) * 4 + v.f, horizon = r.h / 2;
  const lit: [number, number, number][] = [];
  for (let i = 0; i < life.fireflies; i++) {
    const cyc = 150 + Math.floor(150 * mixHash(s, i, 105)), t = (frame + Math.floor(mixHash(s, i, 106) * cyc)) % cyc;
    if (t >= 44) continue;
    const x = r.w * (0.06 + 0.88 * mixHash(s, i, 101)) + Math.sin(frame / (80 + 50 * mixHash(s, i, 103)) + i * 2.1) * 9;
    const y = horizon + r.h * (-0.06 + 0.3 * mixHash(s, i, 102)) + Math.sin(frame / (60 + 40 * mixHash(s, i, 104)) + i * 1.3) * 5;
    lit.push([r.x + Math.round(x), r.y + Math.round(y), t < 6 || t >= 38 ? 0.45 : 1]);
  }
  for (const [x, y, k] of lit) {
    ctx.fillStyle = rgba('#a8e040', 0.55 * k); ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 1); ctx.fillRect(x, y + 1, 1, 1);
    ctx.fillStyle = rgba('#f4ffb0', k); ctx.fillRect(x, y, 1, 1);
  }
}

/**
 * Mist lying low over its banks' squares at dawn: each bank two or three wisps a square or so long, each
 * a flat pale band stepped in at its top and its foot, a little over the ground and apart in height,
 * drifting slowly to and fro each at its own pace.
 */
function drawMist(v: Frame): void {
  const { ctx, r, life, frame } = v, cx = r.w / 2, horizon = r.h / 2, s = v.f;
  ctx.fillStyle = rgba(mix('#59606e', '#e2e6ec', life.light), 0.3 * life.dawn * (1 - life.murk));
  ctx.beginPath();
  for (const b of life.mist) {
    const u = unit(b.d, r.h), from = cx + (b.l0 - 0.5) * 2 * u, span = (b.l1 - b.l0 + 1) * 2 * u, th = Math.max(1, Math.round(u * 0.035));
    for (let i = 0, k = 2 + Math.floor(mixHash(s, b.d, 111) * 2); i < k; i++) {
      const len = Math.min(span, u * (0.9 + 1.3 * mixHash(s, b.d, i, 112))), drift = Math.sin(frame / (300 + 200 * mixHash(s, b.d, i, 113)) + i * 2.3) * u * 0.25;
      const x = r.x + Math.round(from + (span - len) * mixHash(s, b.d, i, 114) + drift), y = r.y + Math.round(horizon + u * (0.92 - 0.2 * mixHash(s, b.d, i, 115)) - 3 * th);
      const w = Math.round(len), top = Math.round(len * 0.55), foot = Math.round(len * 0.8);
      ctx.rect(x + Math.round((w - top) * 0.6), y, top, th); ctx.rect(x, y + th, w, th); ctx.rect(x + Math.round((w - foot) * 0.3), y + 2 * th, foot, th);
    }
  }
  ctx.fill();
}
