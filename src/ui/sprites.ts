// Vector sprites for the viewport and the combat screen, cel-shaded with the engine's helpers
// through a Brush. The scenery lives here; the monsters live in ./monsters/, one module per family,
// and `drawMonsterSprite` dispatches to them by sprite kind. Every sprite draws front-facing,
// centred on (x, y) with y the ground line and `h` the intended height. `tone` darkens with
// distance; `flash` paints the hit frame white.
import type { MonsterSprite } from '../game/monsters.ts';
import { shade, mix } from '../lib/art/palettes.ts';
import { celBall, celCapsule, celPoly, celTaper, band } from '../lib/art/shading.ts';
import { B, paintFor, stroke } from './monsters/common.ts';
import type { MonsterDrawer } from './monsters/common.ts';
import * as rat from './monsters/rat.ts';
import * as slime from './monsters/slime.ts';
import * as wolf from './monsters/wolf.ts';
import * as boar from './monsters/boar.ts';
import * as spider from './monsters/spider.ts';
import * as bandit from './monsters/bandit.ts';
import * as cultist from './monsters/cultist.ts';
import * as skeleton from './monsters/skeleton.ts';
import * as riftling from './monsters/riftling.ts';
import * as ogre from './monsters/ogre.ts';
import * as wraith from './monsters/wraith.ts';
import * as birds from './monsters/birds.ts';
import * as oldwood from './monsters/oldwood.ts';
import * as longbodies from './monsters/longbodies.ts';
import * as toads from './monsters/toads.ts';
import * as devilfish from './monsters/devilfish.ts';
import * as bears from './monsters/bears.ts';
import * as moths from './monsters/moths.ts';
import * as knockers from './monsters/knockers.ts';
import * as salamanders from './monsters/salamanders.ts';
import * as lights from './monsters/lights.ts';
import * as keepers from './monsters/keepers.ts';
import * as cats from './monsters/cats.ts';
import * as giants from './monsters/giants.ts';

export { groundShadow } from './monsters/common.ts';

// ---------------------------------------------------------------- scenery ----

/**
 * How the time of year dresses a broadleaf tree: how much leaf is left (0 bare .. 1 full), how far it
 * has turned to autumn gold (`turn`) and on to brown (`brown`), spring's fresh green, blossom, and
 * the snow lying on it (0 .. 1).
 */
export interface TreeSeason { leaf: number; turn: number; brown: number; fresh: number; blossom: number; snow: number; }
export const HIGH_SUMMER: TreeSeason = { leaf: 1, turn: 0, brown: 0, fresh: 0, blossom: 0, snow: 0 };

const ramp = (v: number, a: number, b: number): number => Math.max(0, Math.min(1, (v - a) / (b - a)));
/**
 * The trees on a day of the year (see game/calendar.ts): buds in Thaw, blossom in Sowing, full leaf
 * through the summer, gold and orange in Leafturn, brown and falling through Mistfall, bare by Frost.
 */
export function treeSeason(day: number, snow: number): TreeSeason {
  return {
    leaf: ramp(day, 6, 20) * (1 - ramp(day, 80, 92)), turn: ramp(day, 58, 72), brown: ramp(day, 76, 88),
    fresh: ramp(day, 6, 12) * (1 - ramp(day, 22, 36)), blossom: ramp(day, 13, 19) * (1 - ramp(day, 24, 30)), snow,
  };
}

const LEAF = ['#3f7a3a', '#4a8a3a', '#7ab848', '#2f6a3a', '#3a7a4a'];
/** What each broadleaf variant turns to in the autumn: an orange, a gold, the birch's yellow. */
const AUTUMN = ['#c8662a', '#d8a030', '#e0c040'];
const SNOW_WHITE = '#eef2f7';

function leafColor(variant: number, s: TreeSeason): string {
  let c = mix(LEAF[variant], '#8ed058', s.fresh * 0.6);
  if (variant < 3) c = mix(mix(c, AUTUMN[variant], s.turn), '#7a5230', s.brown * 0.75);
  return c;
}

/** Bare limbs fanning up from the top of a trunk, each forking once, with snow along their tops. */
function bareCrown(ctx: CanvasRenderingContext2D, x: number, top: number, u: number, span: number, wood: string, snow: string | null, fine = false): void {
  const w = Math.max(1, u * (fine ? 0.045 : 0.07));
  for (const [dx, dy] of [[-0.62, 0.38], [-0.3, 0.7], [0.05, 0.85], [0.36, 0.66], [0.64, 0.34]]) {
    const ex = x + dx * span * u, ey = top - dy * span * u, mx = x + dx * span * u * 0.55, my = top - dy * span * u * 0.5;
    stroke(ctx, [x, top, mx, my, ex, ey], wood, w);
    stroke(ctx, [mx, my, mx + dx * u * 0.35 - u * 0.12, my - u * 0.32], wood, Math.max(1, w * 0.6));
    if (snow) stroke(ctx, [mx - 0.5, my - Math.max(1, w * 0.6), ex - 0.5, ey - Math.max(1, w * 0.6)], snow, Math.max(1, w * 0.55));
  }
}

export function drawTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, season: TreeSeason = HIGH_SUMMER): void {
  const conifer = variant >= 3;
  const trunk = shade('#5a3f2a', tone), leaf = shade(leafColor(variant, season), tone);
  const snow = season.snow > 0.15 ? shade(SNOW_WHITE, tone) : null;
  if (conifer) {
    const h = u * 2.6, w = u * 1.2;
    celCapsule(ctx, B, x, y, x, y - h * 0.3, u * 0.12, trunk, 0);
    for (let i = 0; i < 3; i++) {
      const ty = y - h * (0.25 + i * 0.25), tw = w * (1 - i * 0.22), th = h * 0.36;
      celPoly(ctx, B, [x - tw / 2, ty, x, ty - th, x + tw / 2, ty], shade(leaf, 1 - i * 0.06), 0.4, 0.25);
      // Snow on each tier: a cap at the point and a rim along the boughs.
      if (snow) {
        const k = 0.3 + 0.35 * season.snow;
        celPoly(ctx, B, [x - tw * k / 2, ty - th * (1 - k), x, ty - th, x + tw * k / 2, ty - th * (1 - k)], snow, 0.2, 0.2);
        stroke(ctx, [x - tw * 0.46, ty - th * 0.06, x - tw * 0.2, ty - th * 0.14, x + tw * 0.2, ty - th * 0.14, x + tw * 0.46, ty - th * 0.06], snow, Math.max(1, u * 0.05 * season.snow));
      }
    }
  } else if (variant === 2) {
    // A birch: pale trunk with dark marks, a taller, lighter crown.
    const h = u * 2.6, r = u * 0.6 * (0.55 + 0.45 * season.leaf), bark = shade('#e8e4d8', tone);
    celTaper(ctx, B, x, y, x, y - h * 0.62, u * 0.11, u * 0.07, bark, 0.2);
    ctx.fillStyle = shade('#3a3630', tone);
    for (let i = 0; i < 5; i++) ctx.fillRect(Math.round(x - u * 0.08 + (i % 2) * u * 0.06), Math.round(y - h * (0.1 + i * 0.11)), Math.max(1, Math.round(u * 0.09)), Math.max(1, Math.round(u * 0.03)));
    if (season.leaf < 0.6) bareCrown(ctx, x, y - h * 0.6, u, 0.75, shade('#4a4038', tone), season.leaf < 0.15 ? snow : null, true);
    if (season.leaf >= 0.15) {
      celBall(ctx, B, x - r * 0.5, y - h * 0.62, r * 0.55, shade(leaf, 0.9));
      celBall(ctx, B, x + r * 0.5, y - h * 0.66, r * 0.55, shade(leaf, 1.05));
      celBall(ctx, B, x, y - h * 0.82, r * 0.62, leaf);
    }
  } else {
    const h = u * 2.3, r = u * 0.8 * (0.5 + 0.5 * season.leaf);
    celTaper(ctx, B, x, y, x, y - h * 0.5, u * 0.16, u * 0.11, trunk, 0.2);
    // Branch hints; the whole crown of limbs once the leaves thin.
    stroke(ctx, [x, y - h * 0.4, x - u * 0.35, y - h * 0.55], trunk, Math.max(1, u * 0.08));
    stroke(ctx, [x, y - h * 0.45, x + u * 0.3, y - h * 0.6], trunk, Math.max(1, u * 0.08));
    if (season.leaf < 0.6) bareCrown(ctx, x, y - h * 0.48, u, 0.95, trunk, season.leaf < 0.15 ? snow : null);
    if (season.leaf >= 0.15) {
      celBall(ctx, B, x - r * 0.55, y - h * 0.55, r * 0.62, shade(leaf, 0.92));
      celBall(ctx, B, x + r * 0.55, y - h * 0.58, r * 0.62, shade(leaf, 1.05));
      celBall(ctx, B, x, y - h * 0.72, r * 0.75, leaf);
      celBall(ctx, B, x - r * 0.2, y - h * 0.5, r * 0.5, shade(leaf, 0.85), false);
      // Blossom on the first variant in Sowing: white and pink dabs over the crown.
      if (variant === 0 && season.blossom > 0.1 && u > 8) {
        for (let i = 0; i < 9; i++) {
          if (i / 9 > season.blossom) break;
          const a = i * 2.4, rr = r * (0.3 + 0.5 * ((i * 37) % 10) / 10);
          ctx.fillStyle = shade(i % 3 ? '#fff4f6' : '#f0a8c0', tone);
          ctx.fillRect(Math.round(x + Math.cos(a) * rr), Math.round(y - h * 0.66 + Math.sin(a) * rr * 0.7), Math.max(1, Math.round(u * 0.07)), Math.max(1, Math.round(u * 0.07)));
        }
      }
    }
  }
}

/**
 * A dead tree: a grey trunk, bleached and bare in every season, its limbs fanned or its top snapped
 * off short (`variant` 0 to 2). Snow lies along its limbs.
 */
export function drawDeadTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, snow = 0): void {
  const bark = shade(['#aaa498', '#bab4a8', '#948e84'][variant % 3], tone), dark = shade('#4a4640', tone);
  const white = snow > 0.15 ? shade(SNOW_WHITE, tone) : null;
  if (variant === 1) {
    // Snapped: a short stump of a trunk, its broken top jagged, one limb left.
    const h = u * 1.3;
    celTaper(ctx, B, x, y, x, y - h, u * 0.17, u * 0.13, bark, 0.2);
    celPoly(ctx, B, [x - u * 0.13, y - h, x - u * 0.05, y - h - u * 0.22, x + u * 0.02, y - h - u * 0.08, x + u * 0.13, y - h - u * 0.3, x + u * 0.13, y - h], bark, 0.3, 0.2);
    stroke(ctx, [x, y - h * 0.62, x - u * 0.42, y - h * 0.95], bark, Math.max(1, u * 0.07));
    if (white) stroke(ctx, [x - u * 0.13, y - h - 0.5, x + u * 0.13, y - h - 0.5], white, Math.max(1, u * 0.05));
  } else {
    const h = u * (variant === 2 ? 2.5 : 2.1);
    celTaper(ctx, B, x, y, x, y - h * 0.55, u * 0.15, u * 0.09, bark, 0.2);
    bareCrown(ctx, x, y - h * 0.52, u, variant === 2 ? 0.8 : 1, bark, white, variant === 2);
  }
  // Splits in the bark.
  ctx.fillStyle = dark;
  for (let i = 0; i < 3; i++) ctx.fillRect(Math.round(x - u * 0.04 + (i % 2) * u * 0.05), Math.round(y - u * (0.25 + i * 0.28)), Math.max(1, Math.round(u * 0.03)), Math.max(1, Math.round(u * 0.14)));
}

/**
 * A glass tree of the Sunder's lip: shards of crystal standing up from one root, the tallest in the
 * middle (`variant` 0 to 2 its tint and lean). By day (`glint` 0 .. 1) a point of light catches it.
 */
export function drawCrystalSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, glint = 0): void {
  const glass = ['#b8d8f0', '#c8bef0', '#a8e4e0'][variant % 3], lean = [0, 0.12, -0.1][variant % 3];
  const lit = shade(mix(glass, '#ffffff', 0.35), tone), body = shade(glass, tone), deep = shade(mix(glass, '#2a3458', 0.5), tone);
  // Base offset, height, width at the foot and lean, each in squares.
  const shards: [number, number, number, number][] = [[-0.34, 1.4, 0.26, -0.28], [0.36, 1.7, 0.28, 0.22], [-0.1, 0.9, 0.22, -0.12], [0.02, 2.5, 0.36, lean], [0.22, 1.0, 0.2, 0.3]];
  ctx.save(); ctx.globalAlpha = 0.88;
  let tip: [number, number] = [x, y];
  for (const [dx, h, w, l] of shards) {
    const bx = x + dx * u, tx = bx + l * u, ty = y - h * u, hw = (w * u) / 2;
    ctx.fillStyle = deep; ctx.beginPath(); ctx.moveTo(bx - hw, y); ctx.lineTo(tx, ty); ctx.lineTo(bx, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(tx, ty); ctx.lineTo(bx + hw, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = lit; ctx.lineWidth = Math.max(1, u * 0.03); ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(tx, ty); ctx.stroke();
    if (ty < tip[1]) tip = [tx, ty];
  }
  ctx.restore();
  ctx.strokeStyle = shade('#1a1e2e', tone); ctx.lineWidth = 1;
  for (const [dx, h, w, l] of shards) { const bx = x + dx * u, hw = (w * u) / 2; ctx.beginPath(); ctx.moveTo(bx - hw, y); ctx.lineTo(bx + l * u, y - h * u); ctx.lineTo(bx + hw, y); ctx.stroke(); }
  // The light it catches: a four-pointed star a little under the tallest tip.
  if (glint > 0.2) {
    const [gx, gy] = [tip[0] - u * 0.02, tip[1] + u * 0.35], s = Math.max(2, Math.min(8, u * 0.18) * glint);
    ctx.save(); ctx.globalAlpha = Math.min(1, glint); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(1, u * 0.04);
    ctx.beginPath(); ctx.moveTo(gx - s, gy); ctx.lineTo(gx + s, gy); ctx.moveTo(gx, gy - s); ctx.lineTo(gx, gy + s); ctx.stroke();
    ctx.restore();
  }
}

/**
 * A lighthouse standing on its square, its foot at y: a stone plinth, a white tower tapering up with
 * two red bands, the gallery's rail, the glazed lamp room and a red cap. The lamp room is dark glass,
 * or glowing when `lamp` is 1 (lit by night). Gives where the lamp is, for its light and its beam.
 */
/** A lighthouse's height over its foot, in squares' half widths, and its bands from the foot up (red or white). */
export const LIGHTHOUSE_HEIGHT = 5.2;
export const LIGHTHOUSE_BANDS: readonly [number, number, boolean][] = [[0, 0.33, false], [0.33, 0.47, true], [0.47, 0.73, false], [0.73, 0.86, true], [0.86, 1, false]];

export function drawLighthouseSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, lamp = 0, snow = 0): { x: number; y: number; r: number } {
  const H = u * LIGHTHOUSE_HEIGHT, wb = u * 0.42, wt = u * 0.26, plinth = u * 0.55;
  const white = shade('#ece6da', tone), shadow = shade('#bdb6a8', tone), red = shade('#b23a2c', tone), redShadow = shade('#86281e', tone);
  const stone = shade('#6e6a64', tone), dark = shade('#2a2622', tone);
  const halfAt = (h: number): number => wb + (wt - wb) * (h / H);
  // The plinth, snow along its top.
  ctx.fillStyle = stone; ctx.fillRect(Math.round(x - u * 0.55), Math.round(y - plinth), Math.round(u * 1.1), Math.round(plinth));
  ctx.fillStyle = shade('#56524c', tone); ctx.fillRect(Math.round(x + u * 0.1), Math.round(y - plinth), Math.round(u * 0.45), Math.round(plinth));
  if (snow > 0.2) { ctx.fillStyle = shade('#eef2f7', tone); ctx.fillRect(Math.round(x - u * 0.55), Math.round(y - plinth), Math.round(u * 1.1), Math.max(1, Math.round(u * 0.06))); }
  // The tower: a band at a time from the plinth up, lit on the left and shaded on the right.
  const top = y - H, base = y - plinth;
  for (const [a, b, isRed] of LIGHTHOUSE_BANDS) {
    const ya = base - (base - top) * a, yb = base - (base - top) * b, ha = halfAt(y - ya), hb = halfAt(y - yb);
    ctx.fillStyle = isRed ? red : white; ctx.beginPath(); ctx.moveTo(x - ha, ya); ctx.lineTo(x - hb, yb); ctx.lineTo(x, yb); ctx.lineTo(x, ya); ctx.closePath(); ctx.fill();
    ctx.fillStyle = isRed ? redShadow : shadow; ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, yb); ctx.lineTo(x + hb, yb); ctx.lineTo(x + ha, ya); ctx.closePath(); ctx.fill();
  }
  // A door and two windows up the tower.
  ctx.fillStyle = dark;
  ctx.fillRect(Math.round(x - u * 0.09), Math.round(base - u * 0.4), Math.max(1, Math.round(u * 0.18)), Math.max(1, Math.round(u * 0.4)));
  for (const f of [0.4, 0.62]) ctx.fillRect(Math.round(x - u * 0.04), Math.round(base - (base - top) * f), Math.max(1, Math.round(u * 0.08)), Math.max(1, Math.round(u * 0.14)));
  // The gallery: a rail wider than the tower's head.
  const gw = wt + u * 0.12, gh = Math.max(1, u * 0.08);
  ctx.fillStyle = dark; ctx.fillRect(Math.round(x - gw), Math.round(top - gh), Math.round(gw * 2), Math.round(gh));
  // The lamp room: glass between iron frames, dark or lit.
  const lw = wt * 0.8, lh = u * 0.5, ly = top - gh - lh;
  ctx.fillStyle = lamp > 0 ? mix(shade('#3a4450', tone), '#ffe7a0', lamp) : shade('#3a4450', tone);
  ctx.fillRect(Math.round(x - lw), Math.round(ly), Math.round(lw * 2), Math.round(lh));
  ctx.fillStyle = dark;
  for (const f of [-1, 0, 1]) ctx.fillRect(Math.round(x + f * lw * 0.95 - Math.max(1, u * 0.02)), Math.round(ly), Math.max(1, Math.round(u * 0.04)), Math.round(lh));
  // The cap: a red cone and a finial.
  const ch = u * 0.4;
  ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(x - lw * 1.2, ly); ctx.lineTo(x, ly - ch); ctx.lineTo(x + lw * 1.2, ly); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, u * 0.03); ctx.beginPath(); ctx.moveTo(x, ly - ch); ctx.lineTo(x, ly - ch - u * 0.18); ctx.stroke();
  return { x, y: ly + lh / 2, r: Math.max(2, lw * 1.2) };
}

export function drawRockSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, snow = 0): void {
  const w = u * 1.3, h = u * 0.8;
  const c = shade('#7a7468', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w / 2, y - h * 0.4, x + w * 0.42, y], c, 0.4, 0.3);
  // The top face, white once snow lies.
  const top = shade(c, 1.15);
  celPoly(ctx, B, [x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w * 0.02, y - h * 0.62], snow > 0.2 ? mix(top, shade(SNOW_WHITE, tone), Math.min(1, snow * 1.2)) : top, 0.2, 0.2);
  celBall(ctx, B, x + w * 0.42, y - u * 0.12, u * 0.18, shade(c, 0.9), false);
}

export function drawMountainSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const w = u * 2.6, h = u * (1.7 + variant * 0.25);
  const c = shade('#6a6670', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.22, y - h * 0.6, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.3, y - h * 0.55, x + w / 2, y], c, 0.45, 0.25);
  // Snow cap and a ridge line.
  celPoly(ctx, B, [x - w * 0.15, y - h * 0.78, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.05, y - h * 0.7, x - w * 0.02, y - h * 0.76], shade('#e8ecf0', tone), 0.3, 0.2);
  stroke(ctx, [x - w * 0.08, y - h, x - w * 0.02, y - h * 0.6, x + w * 0.06, y - h * 0.3], shade(c, 0.7), 1);
}

/**
 * A peak: a summit standing over the mountains, taller and steeper than any of them, white from its
 * top down to the snow line, `snow` of its height, and below the line in tongues down its gullies.
 */
export function drawPeakSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, snow: number): void {
  const w = u * 2.4, h = u * (2.6 + variant * 0.25);
  // Its flanks as [height, offset], from the foot (0) to the top (1), the offset a share of its width.
  const left: [number, number][] = [[0, -0.5], [0.42, -0.3], [0.76, -0.13], [1, 0.02]];
  const right: [number, number][] = [[1, 0.02], [0.84, 0.13], [0.55, 0.3], [0, 0.5]];
  const across = (side: [number, number][], t: number): number => {
    for (let i = 0; i < side.length - 1; i++) {
      const [t0, f0] = side[i], [t1, f1] = side[i + 1];
      if ((t - t0) * (t - t1) <= 0) return f0 + ((f1 - f0) * (t - t0)) / (t1 - t0);
    }
    return 0;
  };
  const pt = (t: number, f: number): number[] => [x + f * w, y - t * h];
  const c = shade('#7c7e8a', tone);
  celPoly(ctx, B, [...left, ...right.slice(1)].flatMap(([t, f]) => pt(t, f)), c, 0.45, 0.25);
  // The snow: up the left flank from the line, over the top and down the right, then back along the
  // line in tongues, each inside the flanks, which only widen below it.
  const line = 1 - Math.min(0.88, Math.max(0.2, snow)), fl = across(left, line), fr = across(right, line);
  const cap = [...pt(line, fl), ...left.filter(([t]) => t > line).flatMap(([t, f]) => pt(t, f)), ...right.slice(1).filter(([t]) => t > line).flatMap(([t, f]) => pt(t, f)), ...pt(line, fr)];
  for (let k = 1; k < 8; k++) cap.push(...pt(k % 2 ? Math.max(0.03, line - 0.05 - 0.04 * ((k * 7 + variant * 3) % 3)) : line + 0.02, fr + ((fl - fr) * k) / 8));
  celPoly(ctx, B, cap, shade(SNOW_WHITE, tone), 0.22, 0.15);
  stroke(ctx, [...pt(1, 0.02), ...pt(0.72, 0.07), ...pt(0.45, 0.15)], shade(c, 0.75), 1);
}

/**
 * A cliff: an escarpment's sheer face, as tall as a mountain but upright at its sides and broken only
 * a little along its top, so a line of them stands as one face. Its beds run across it in ledges, lit
 * along their lips; snow lies along its top, `snow` of the way to its deepest (0 to 1), and once deep
 * on the ledges too.
 */
export function drawCliffSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, snow: number): void {
  const w = u * 2.1, h = u * (1.9 + variant * 0.2), c = shade('#585c6a', tone);
  const pt = (t: number, f: number): number[] => [x + f * w, y - t * h];
  const top: [number, number][] = [[0.95, -0.49], [1, -0.32], [0.96, -0.1], [0.93 + 0.03 * variant, 0.16], [0.98, 0.34], [0.95, 0.49]];
  celPoly(ctx, B, [...pt(0, -0.5), ...top.flatMap(([t, f]) => pt(t, f)), ...pt(0, 0.5)], c, 0.3, 0.2);
  // The beds, each a ledge dark under its lip and lit along it, and the joints down the face.
  const lw = Math.max(1, u * 0.05), beds = [0.22, 0.47, 0.7];
  for (const t of beds) {
    stroke(ctx, [...pt(t, -0.47), ...pt(t + 0.02, 0.47)], shade(c, 0.66), lw);
    stroke(ctx, [...pt(t + 0.035, -0.46), ...pt(t + 0.055, 0.46)], shade(c, 1.18), Math.max(1, lw * 0.6));
  }
  for (const [f, t0, t1] of [[-0.3 + 0.08 * variant, 0.9, 0.5], [0.12, 0.45, 0.06], [0.33 - 0.06 * variant, 0.86, 0.24]]) stroke(ctx, [...pt(t0, f), ...pt(t1, f + 0.02)], shade(c, 0.6), 1);
  if (snow <= 0.05) return;
  const deep = 0.03 + 0.07 * Math.min(1, snow), white = shade(SNOW_WHITE, tone);
  celPoly(ctx, B, [...top.flatMap(([t, f]) => pt(t, f)), ...[...top].reverse().flatMap(([t, f]) => pt(t - deep, f * 0.98))], white, 0.2, 0.1);
  if (snow > 0.5) for (const t of beds) stroke(ctx, [...pt(t + 0.03, -0.45), ...pt(t + 0.05, 0.45)], white, lw);
}

export function drawPillarSprite(ctx: CanvasRenderingContext2D, x: number, horizon: number, u: number, tone: number): void {
  const w = u * 0.5, c = shade('#8a8690', tone);
  celPoly(ctx, B, [x - w / 2, horizon + u, x - w * 0.4, horizon - u * 0.9, x + w * 0.4, horizon - u * 0.9, x + w / 2, horizon + u], c, 0.4, 0.3);
  band(ctx, B, x - w * 0.6, horizon - u, w * 1.2, u * 0.14, shade(c, 1.1));
  band(ctx, B, x - w * 0.6, horizon + u - u * 0.12, w * 1.2, u * 0.12, shade(c, 0.9));
}

// ---------------------------------------------------------------- monsters ----

/**
 * Which family module draws each sprite kind. A module lists the same kinds in its `KINDS`, which
 * the gallery and `tools/changed.ts` read; tools/tests/art.ts holds the two to each other.
 */
export const FAMILY: Readonly<Record<MonsterSprite, MonsterDrawer>> = {
  rat: rat.draw, barn_rat: rat.draw, bilge_rat: rat.draw,
  slime: slime.draw,
  wolf: wolf.draw, dire_wolf: wolf.draw, rift_hound: wolf.draw, black_dog: wolf.draw, chalk_wolf: wolf.draw, barrow_wolf: wolf.draw, sunder_hound: wolf.draw, moor_hound: wolf.draw,
  boar: boar.draw, tusker: boar.draw,
  spider: spider.draw, thorn_spider: spider.draw, crab: spider.draw, rift_crawler: spider.draw, barnacle_crab: spider.draw, salt_crab: spider.draw, glass_spider: spider.draw, fire_beetle: spider.draw,
  bandit: bandit.draw, archer: bandit.draw, brigand: bandit.draw, brigand_archer: bandit.draw,
  smuggler: bandit.draw, smuggler_bow: bandit.draw, smuggler_captain: bandit.draw,
  wrecker: bandit.draw, lampman: bandit.draw, footpad: bandit.draw, poacher: bandit.draw, billman: bandit.draw, slinger: bandit.draw, cutthroat: bandit.draw,
  bargeman: bandit.draw, barge_master: bandit.draw, wrack_smuggler: bandit.draw, wrack_bowman: bandit.draw, anvil_guard: bandit.draw,
  cultist: cultist.draw, zealot: cultist.draw, adept: cultist.draw, ashen_hand: cultist.draw,
  acolyte: cultist.draw, deacon: cultist.draw, overseer: cultist.draw, gleaner: cultist.draw, mason: cultist.draw,
  skeleton: skeleton.draw, bone_knight: skeleton.draw, ghoul: skeleton.draw, drowned: skeleton.draw,
  barrow_guard: skeleton.draw, barrow_captain: skeleton.draw, temple_drowned: skeleton.draw, drowned_chanter: skeleton.draw, choirmaster: skeleton.draw,
  bog_body: skeleton.draw, cairn_king: skeleton.draw,
  riftling: riftling.draw, riftling_elder: riftling.draw, warden: riftling.draw, cut_warden: riftling.draw, brineling: riftling.draw, tide_elder: riftling.draw, tide_warden: riftling.draw, sunderling: riftling.draw, sunder_warden: riftling.draw, slagling: riftling.draw, slag_elder: riftling.draw, anvil_warden: riftling.draw,
  ogre: ogre.draw, tor_troll: ogre.draw, snow_troll: ogre.draw,
  bramble: oldwood.draw, rootwalker: oldwood.draw, heartwood: oldwood.draw, eldest: oldwood.draw,
  wraith: wraith.draw, cairn_wight: wraith.draw,
  crow: birds.draw, owl: birds.draw, old_rook: birds.draw, grey_heron: birds.draw, wrack_gull: birds.draw, raven: birds.draw, spine_eagle: birds.draw,
  fen_eel: longbodies.draw, leech: longbodies.draw, rock_worm: longbodies.draw, ice_pike: longbodies.draw,
  fen_toad: toads.draw, bull_toad: toads.draw,
  devilfish: devilfish.draw, great_devilfish: devilfish.draw,
  pine_bear: bears.draw, glass_bear: bears.draw, ice_bear: bears.draw,
  lantern_moth: moths.draw, deathshead: moths.draw,
  knocker: knockers.draw, mender: knockers.draw, foreman: knockers.draw, tallyman: knockers.draw,
  salamander: salamanders.draw, great_salamander: salamanders.draw,
  bog_light: lights.draw,
  bay_keeper: keepers.draw, matron: keepers.draw, brother: keepers.draw, bell_ringer: keepers.draw, abbot: keepers.draw,
  snow_lynx: cats.draw,
  stair_giant: giants.draw, stair_king: giants.draw,
};

/**
 * How far each kind's drawing reaches left and right of its centre, as shares of the height it is
 * drawn at: the most over its idle at combat size. The fight spaces its row by them (ui/row.ts). The
 * smoke test holds every drawing to its span, give or take SPAN_SLACK pixels at any size, and the span
 * to no more than a twentieth of a height wider than the drawing; a kind drawn new or redrawn takes the
 * numbers the test prints.
 */
export const SPAN: Readonly<Record<MonsterSprite, readonly [number, number]>> = {
  rat: [1.05, 0.97], barn_rat: [1.06, 1.01], bilge_rat: [1.06, 0.92],
  slime: [1.11, 0.88],
  wolf: [0.58, 0.77], dire_wolf: [0.59, 0.82], rift_hound: [0.57, 0.78], black_dog: [0.58, 0.86], chalk_wolf: [0.58, 0.83], barrow_wolf: [0.57, 0.8], sunder_hound: [0.56, 0.79], moor_hound: [0.67, 0.76],
  boar: [0.74, 0.74], tusker: [0.74, 0.73],
  spider: [0.93, 1.03], thorn_spider: [0.94, 1.05], crab: [0.55, 0.55], rift_crawler: [0.9, 1.01], barnacle_crab: [0.56, 0.58], salt_crab: [0.55, 0.55], glass_spider: [1.42, 1.42], fire_beetle: [0.52, 0.52],
  bandit: [0.41, 0.41], archer: [0.56, 0.31], brigand: [0.45, 0.47], brigand_archer: [0.39, 0.31],
  smuggler: [0.26, 0.3], smuggler_bow: [0.26, 0.42], smuggler_captain: [0.33, 0.44],
  wrecker: [0.26, 0.37], lampman: [0.26, 0.49], footpad: [0.26, 0.47], poacher: [0.34, 0.28], billman: [0.27, 0.44], slinger: [0.3, 0.39], cutthroat: [0.28, 0.49],
  bargeman: [0.64, 0.88], barge_master: [0.42, 0.33], wrack_smuggler: [0.32, 0.42], wrack_bowman: [0.26, 0.47], anvil_guard: [0.44, 0.5],
  cultist: [0.25, 0.33], zealot: [0.47, 0.51], adept: [0.42, 0.39], ashen_hand: [0.47, 0.47],
  acolyte: [0.23, 0.43], deacon: [0.29, 0.29], overseer: [0.46, 0.5], gleaner: [0.43, 0.45], mason: [0.3, 0.58],
  skeleton: [0.22, 0.39], bone_knight: [0.36, 0.42], ghoul: [0.33, 0.38], drowned: [0.27, 0.3],
  barrow_guard: [0.2, 0.33], barrow_captain: [0.27, 0.29], temple_drowned: [0.34, 0.34], drowned_chanter: [0.27, 0.28], choirmaster: [0.32, 0.35],
  bog_body: [0.23, 0.25], cairn_king: [0.32, 0.35],
  riftling: [0.42, 0.55], riftling_elder: [0.51, 0.7], warden: [0.63, 0.66], cut_warden: [0.64, 0.66], brineling: [0.39, 0.54], tide_elder: [0.5, 0.7], tide_warden: [0.64, 0.66], sunderling: [0.42, 0.55], sunder_warden: [0.64, 0.66], slagling: [0.42, 0.57], slag_elder: [0.5, 0.69], anvil_warden: [0.68, 0.7],
  ogre: [0.41, 0.45], tor_troll: [0.4, 0.41], snow_troll: [0.42, 0.45],
  bramble: [0.49, 0.49], rootwalker: [0.39, 0.41], heartwood: [0.4, 0.36], eldest: [0.72, 0.72],
  wraith: [0.27, 0.27], cairn_wight: [0.28, 0.3],
  crow: [0.6, 0.6], owl: [0.86, 0.86], old_rook: [0.61, 0.63], grey_heron: [0.36, 0.55], wrack_gull: [0.73, 0.62], raven: [0.79, 0.72], spine_eagle: [0.38, 0.36],
  fen_eel: [0.6, 0.6], leech: [0.46, 0.46], rock_worm: [0.66, 0.53], ice_pike: [0.44, 0.65],
  fen_toad: [0.58, 0.58], bull_toad: [0.61, 0.61],
  devilfish: [0.51, 0.51], great_devilfish: [0.66, 0.7],
  pine_bear: [0.75, 0.66], glass_bear: [0.7, 0.65], ice_bear: [0.73, 0.73],
  lantern_moth: [0.71, 0.71], deathshead: [0.81, 0.81],
  knocker: [0.51, 0.68], mender: [0.46, 0.63], foreman: [0.45, 0.52], tallyman: [0.58, 0.55],
  salamander: [0.78, 0.84], great_salamander: [0.71, 0.72],
  bog_light: [0.15, 0.16],
  bay_keeper: [0.28, 0.28], matron: [0.32, 0.33], brother: [0.28, 0.28], bell_ringer: [0.28, 0.39], abbot: [0.23, 0.26],
  snow_lynx: [0.48, 0.47],
  stair_giant: [0.21, 0.39], stair_king: [0.26, 0.47],
};
/** How many pixels a drawing may reach past its span at any size, and so how far inside the view's edge a fight keeps the spans. */
export const SPAN_SLACK = 2;

/**
 * How tall a monster draws on the combat screen. Xeen fills most of the window with the thing you
 * are fighting, so a lone enemy is drawn a quarter taller than the old flat size and a pair nearly
 * so. Every extra monster is width the neighbours do not have, so the height comes back down as the
 * row fills, reaching the old size at five and going under it at six, where the old flat size used to
 * overlap badly. A row too wide for the view even so is drawn smaller as a whole (ui/row.ts).
 * @param size the def's size (1 = a full cell)
 * @param count how many monsters are in the row
 */
export function combatHeight(size: number, count: number): number {
  return (34 + size * 92) * Math.min(1, 1.25 - 0.09 * count);
}

/**
 * Draw a monster. `h` is the intended height in px; `frame` drives a small idle motion.
 */
export function drawMonsterSprite(ctx: CanvasRenderingContext2D, kind: MonsterSprite, x: number, y: number, h: number, tint: string, tone: number, frame: number, flash = false): void {
  B.flash(flash);
  FAMILY[kind](ctx, kind, x, y, h, paintFor(tint, tone, frame));
  B.flash(false);
}
