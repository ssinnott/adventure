// The weather drawn over the view every frame (#1028): rain, snow and their splashes, the murk, and a
// storm's lightning, whose strike and bolt the compositor draws between the sky and the scene.

import type { World } from '../../game/world.ts';
import { viewCell as cellAt, isSolidWall, lineOfSight } from '../../game/world.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import type { Facing } from '../../game/types.ts';
import { mix, rgba } from '../../lib/art/palettes.ts';
import { mixHash } from '../../game/weather.ts';
import { unit } from './common.ts';
import type { ViewRect } from './common.ts';
import { murkOf, washes } from './model.ts';
import { GROUND } from './ground/index.ts';

/**
 * The weather between the eye and the scene, every frame: fog drifting, rain streaking down with
 * splashes where it lands, snow blowing across, and the flash of a lightning strike. Nothing
 * underground. The explore view draws it over everything; a fight draws it over its monsters.
 */
export function drawWeather(ctx: CanvasRenderingContext2D, world: World, r: ViewRect, frame: number): void {
  if (!world.underSky) return;
  const wx = world.weather, rf = ((world.state.facing + 1) & 3) as Facing;
  // The wind across the view: how hard it blows toward the party's right hand (negative: the left).
  const across = (Math.cos(wx.windDir) * FACING_DX[rf] + Math.sin(wx.windDir) * FACING_DY[rf]) * wx.wind;
  const light = world.daylight * (1 - 0.35 * wx.cloud);
  const rain = wx.precip * (1 - wx.snow), snow = wx.precip * wx.snow, murk = murkOf(wx);
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  if (washes(wx)) drawMurk(ctx, r, Math.max(wx.fog, murk * 0.6), wx.fog, frame, light);
  if (rain > 0.02) { drawSplashes(ctx, world, r, rain, frame, light); drawRain(ctx, r, rain, across * 0.9, frame, light); }
  if (snow > 0.02) drawSnow(ctx, r, snow, across * (0.3 + 2.5 * wx.wind), frame, light);
  const flash = strike(wx.storm, frame);
  if (flash) { ctx.fillStyle = rgba('#e8ecff', 0.2 * flash.glow); ctx.fillRect(r.x, r.y, r.w, r.h); }
  ctx.restore();
}

/** The two flickers of a lightning strike, frame by frame. */
const FLASH = [1, 0.75, 0.2, 0.05, 0.85, 0.55, 0.3, 0.15, 0.06];

/**
 * Lightning in a storm: in each spell of 140 frames (a little over two seconds) a strike may come at
 * a random moment, more often the fiercer the storm. Which strike (it shapes the bolt) and how
 * bright it is this frame; null between strikes.
 */
export function strike(storm: number, frame: number): { n: number; glow: number } | null {
  if (storm < 0.05) return null;
  const n = Math.floor(frame / 140), t = frame - n * 140 - Math.floor(mixHash(n, 71) * 120);
  if (t < 0 || t >= FLASH.length || mixHash(n, 72) > 0.15 + 0.55 * storm) return null;
  return { n, glow: FLASH[t] };
}

/** A strike seen between the sky and the scene: the whole sky lit behind every roof and tree, and the bolt while it is brightest. */
export function drawBolt(ctx: CanvasRenderingContext2D, r: ViewRect, s: { n: number; glow: number }): void {
  ctx.fillStyle = rgba('#dfe6ff', 0.55 * s.glow); ctx.fillRect(r.x, r.y, r.w, r.h / 2);
  if (s.glow < 0.5) return;
  const y0 = r.y + 4, y1 = r.y + r.h / 2 - 12, step = (y1 - y0) / 9;
  let x = r.x + r.w * (0.1 + 0.8 * mixHash(s.n, 73));
  const bolt: number[] = [];
  for (let i = 0; i <= 9; i++) { bolt.push(x, y0 + step * i); x += (mixHash(s.n, 74, i) - 0.5) * r.w * 0.07; }
  // A fork off the middle.
  const k = 2 * (3 + Math.floor(mixHash(s.n, 75) * 3)), fork = [bolt[k], bolt[k + 1]];
  for (let i = 1; i <= 3; i++) fork.push(fork[fork.length - 2] + (mixHash(s.n, 76, i) - 0.3) * r.w * 0.05, fork[fork.length - 1] + step);
  for (const [w, col] of [[5, rgba('#a8b8ff', 0.35 * s.glow)], [2, rgba('#ffffff', s.glow)]] as [number, string][]) {
    ctx.strokeStyle = col; ctx.lineJoin = 'round';
    for (const pts of [bolt, fork]) {
      ctx.lineWidth = pts === fork ? Math.max(1, w * 0.6) : w;
      ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.stroke();
    }
  }
}

/** Murk over the distance, thickest at the horizon where the far cells are; in fog, banks of it drift past low down. */
function drawMurk(ctx: CanvasRenderingContext2D, r: ViewRect, amount: number, fogAmount: number, frame: number, light: number): void {
  const col = mix('#2a2e36', '#d4d8de', light), cx = r.x + r.w / 2, horizon = r.y + r.h / 2;
  const g = ctx.createRadialGradient(cx, horizon, r.h * 0.04, cx, horizon, r.h * 0.8);
  g.addColorStop(0, rgba(col, 0.7 * amount)); g.addColorStop(0.5, rgba(col, 0.35 * amount)); g.addColorStop(1, rgba(col, 0.08 * amount));
  ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
  if (fogAmount < 0.1) return;
  for (let i = 0; i < 4; i++) {
    const w = r.w * (0.7 + 0.4 * mixHash(i, 81)), h = r.h * (0.1 + 0.08 * mixHash(i, 82));
    const x = r.x - w / 2 + (mixHash(i, 83) * (r.w + w) + frame * (0.1 + 0.12 * mixHash(i, 84))) % (r.w + w);
    const y = horizon + r.h * (0.02 + 0.3 * mixHash(i, 85));
    ctx.save(); ctx.translate(x, y); ctx.scale(1, h / w);
    const bank = ctx.createRadialGradient(0, 0, 0, 0, 0, w / 2);
    bank.addColorStop(0, rgba(col, 0.45 * fogAmount)); bank.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = bank; ctx.fillRect(-w / 2, -w / 2, w, w); ctx.restore();
  }
}

/** Rain in three depths: share of the drops, alpha, speed (px a frame), streak length, line width. Far drops faint, short and slow. */
const RAIN_LAYERS: readonly [number, number, number, number, number][] = [[0.55, 0.18, 6, 6, 1], [0.3, 0.3, 9, 10, 1], [0.15, 0.45, 13, 16, 1.5]];

/** Rain as streaks, more and longer the harder it falls, slanting with the wind across the view. */
function drawRain(ctx: CanvasRenderingContext2D, r: ViewRect, amount: number, slant: number, frame: number, light: number): void {
  const n = Math.round(24 + 340 * amount), col = mix('#56607a', '#d4deec', light), wrap = r.w + 80;
  let i0 = 0;
  for (const [share, alpha, speed, len0, lw] of RAIN_LAYERS) {
    const k = Math.round(n * share), len = len0 * (0.6 + 0.6 * amount), fall = r.h + len;
    ctx.strokeStyle = rgba(col, alpha * (0.55 + 0.45 * amount)); ctx.lineWidth = lw;
    ctx.beginPath();
    for (let i = i0; i < i0 + k; i++) {
      const y = (mixHash(i, 1) * fall + frame * speed * (0.85 + 0.3 * mixHash(i, 2))) % fall - len;
      const x = ((mixHash(i, 3) * wrap + slant * y) % wrap + wrap) % wrap - 40;
      ctx.moveTo(r.x + x, r.y + y); ctx.lineTo(r.x + x + slant * len, r.y + y + len);
    }
    ctx.stroke();
    i0 += k;
  }
}

/** How many frames a splash lasts. */
const SPLASH_LIFE = 8;

/** Where the rain lands: little crowns thrown up from the ground, only on floor the party can see and that its look splashes. */
function drawSplashes(ctx: CanvasRenderingContext2D, world: World, r: ViewRect, amount: number, frame: number, light: number): void {
  const map = world.map, { x: px, y: py, facing: f } = world.state;
  const cx = r.x + r.w / 2, horizon = r.y + r.h / 2;
  ctx.strokeStyle = rgba(mix('#6a7488', '#e0e8f4', light), 0.6); ctx.lineWidth = 1;
  ctx.beginPath();
  for (let j = 0; j < Math.round(amount * 30); j++) {
    const tick = frame + j * 5, cycle = Math.floor(tick / SPLASH_LIFE), age = tick % SPLASH_LIFE;
    // A spot on the ground: how far ahead (in cells, from the eye) and how far to the side.
    const k = 0.6 + mixHash(j, cycle, 1) * 2.6, lat = (mixHash(j, cycle, 2) - 0.5) * 5;
    const d = Math.round(k), l = Math.round(lat);
    if (d > world.sight) continue;
    const c = cellAt(px, py, f, d, l), cell = map.at(c.x, c.y);
    if (isSolidWall(cell) || cell.solid !== 'none' || !GROUND[cell.terrain].splashes || !lineOfSight(map, px, py, f, d, l)) continue;
    const u = unit(k, r.h), x = cx + lat * 2 * u, y = horizon + u, s = Math.max(1, u * 0.045) * (0.6 + age / SPLASH_LIFE);
    ctx.moveTo(x - s * 1.6, y); ctx.quadraticCurveTo(x - s * 1.2, y - s * 1.6, x - s * 0.3, y - s * 0.4);
    ctx.moveTo(x + s * 1.6, y); ctx.quadraticCurveTo(x + s * 1.2, y - s * 1.6, x + s * 0.3, y - s * 0.4);
  }
  ctx.stroke();
}

/** Snow in three depths: share of the flakes, size, speed (px a frame), sway (px), alpha. */
const SNOW_LAYERS: readonly [number, number, number, number, number][] = [[0.5, 1, 0.45, 2, 0.6], [0.35, 2, 0.8, 4, 0.8], [0.15, 3, 1.3, 7, 0.95]];

/** Snow as flakes, swaying as they fall and blown across the view by the wind: a blizzard drives them nearly flat. */
function drawSnow(ctx: CanvasRenderingContext2D, r: ViewRect, amount: number, across: number, frame: number, light: number): void {
  const n = Math.round(20 + 300 * amount), col = mix('#7a8498', '#ffffff', light), wrap = r.w + 40;
  let i0 = 0;
  for (const [share, size, speed, sway, alpha] of SNOW_LAYERS) {
    const k = Math.round(n * share);
    // One path a layer: the flakes are all one colour, so a single fill paints them all.
    ctx.fillStyle = rgba(col, alpha); ctx.beginPath();
    for (let i = i0; i < i0 + k; i++) {
      const t = frame * speed * (0.8 + 0.4 * mixHash(i, 2)) * (1 + amount * 0.5);
      const y = r.y + Math.round((mixHash(i, 1) * r.h + t) % r.h);
      const x = r.x + Math.round(((mixHash(i, 3) * wrap + t * across + Math.sin(frame / 40 + mixHash(i, 4) * 6.3) * sway) % wrap + wrap) % wrap) - 20;
      if (size < 3) ctx.rect(x, y, size, size);
      else { ctx.rect(x - 1, y, 3, 1); ctx.rect(x, y - 1, 1, 1); ctx.rect(x, y + 1, 1, 1); }
    }
    ctx.fill();
    i0 += k;
  }
}
