// The viewport's scenery, cel-shaded with the engine's helpers through a Brush: the trees dressed by
// the season, the dead trees, the props scattered on open ground (#1103), the crystals, the lighthouse,
// the monastery, the landmarks of #1096, the wilderness features (#1110), rocks, mountains, peaks,
// cliffs, the volcano, the creeper trees and the pillar. Every sprite draws front-facing, centred on
// (x, y) with y the ground line; `tone` darkens with distance. The monsters are ./sprites.ts's.
import type { TreeName, TreeWeights } from '../content/area.ts';
import type { Landmark } from '../game/mapdef.ts';
import { shade, mix, rgba } from '../lib/art/palettes.ts';
import { celBall, celCapsule, celPoly, celTaper, band } from '../lib/art/shading.ts';
import { B, stroke } from './monsters/common.ts';
import type { Prop } from './view/model.ts';

/**
 * How the time of year dresses a broadleaf tree: how much leaf is left (0 bare .. 1 full), how far it
 * has turned to autumn gold (`turn`) and on to brown (`brown`), spring's fresh green, blossom, the
 * berries on the rowan and the thorn (`berry`, #1104), and the snow lying on it (0 .. 1).
 */
export interface TreeSeason { leaf: number; turn: number; brown: number; fresh: number; blossom: number; berry: number; snow: number; }
export const HIGH_SUMMER: TreeSeason = { leaf: 1, turn: 0, brown: 0, fresh: 0, blossom: 0, berry: 0, snow: 0 };

const ramp = (v: number, a: number, b: number): number => Math.max(0, Math.min(1, (v - a) / (b - a)));
/**
 * The trees on a day of the year (see game/calendar.ts): buds in Thaw, blossom in Sowing, full leaf
 * through the summer, gold and orange in Leafturn, brown and falling through Mistfall, bare by Frost;
 * berries red from Harvest until the birds have had them by the end of Frost.
 */
export function treeSeason(day: number, snow: number): TreeSeason {
  return {
    leaf: ramp(day, 6, 20) * (1 - ramp(day, 80, 92)), turn: ramp(day, 58, 72), brown: ramp(day, 76, 88),
    fresh: ramp(day, 6, 12) * (1 - ramp(day, 22, 36)), blossom: ramp(day, 13, 19) * (1 - ramp(day, 24, 30)),
    berry: ramp(day, 45, 52) * (1 - ramp(day, 94, 104)), snow,
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

/**
 * A living tree, `variant` of `TREES`: the broadleaf (0 and 1), the birch (2) and the conifer (3 and 4)
 * of old, as they always were; the regions' own from 5 on (#1104).
 */
export function drawTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, season: TreeSeason = HIGH_SUMMER): void {
  if (variant >= OLD_TREES) return REGIONAL[variant - OLD_TREES](ctx, x, y, u, tone, season);
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

// The regions' own trees (#1104), each dressed by the year as the five of old are and toned alike.
/** A leaf through the year: spring's fresh green over `base`, turning to `autumn` and `browns` of the way on to brown. */
function seasonLeaf(base: string, autumn: string, s: TreeSeason, browns = 0.75): string {
  return mix(mix(mix(base, '#8ed058', s.fresh * 0.6), autumn, s.turn), '#7a5230', s.brown * browns);
}
/** Dabs strewn through an ellipse over a crown (flowers, catkins, berries): the first `share` of `n`, `size` across. */
function dabs(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, n: number, share: number, size: number, colour: (i: number) => string): void {
  const sz = Math.max(1, Math.round(size));
  for (let i = 0; i < n && i / n < share; i++) {
    const a = i * 2.4, k = 0.3 + 0.6 * ((i * 37) % 10) / 10;
    ctx.fillStyle = colour(i);
    ctx.fillRect(Math.round(cx + Math.cos(a) * rx * k), Math.round(cy + Math.sin(a) * ry * k), sz, sz);
  }
}
const treeSnow = (s: TreeSeason, tone: number): string | null => (s.snow > 0.15 ? shade(SNOW_WHITE, tone) : null);

/** An oak (Thornmark's): low and broad, a short thick trunk with a knot, its limbs spread level under a broad crown; catkins in Sowing, russet in Leafturn. */
function oak(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const bark = shade('#5a4a38', tone), leaf = shade(seasonLeaf('#5e7428', '#a8662a', s), tone), snow = treeSnow(s, tone), top = y - u * 0.84;
  celTaper(ctx, B, x + u * 0.04, y, x - u * 0.06, top, u * 0.21, u * 0.15, bark, 0.2);
  ctx.fillStyle = shade('#2e2418', tone);
  ctx.fillRect(Math.round(x - u * 0.06), Math.round(y - u * 0.42), Math.max(1, Math.round(u * 0.07)), Math.max(1, Math.round(u * 0.09)));
  const limbs = [[x - u * 0.06, top, x - u * 0.45, top - u * 0.18, x - u * 0.86, top - u * 0.24], [x - u * 0.04, top + u * 0.04, x + u * 0.42, top - u * 0.22, x + u * 0.82, top - u * 0.3]];
  for (const l of limbs) stroke(ctx, l, bark, Math.max(1, u * 0.11));
  if (s.leaf < 0.6) {
    const bare = s.leaf < 0.15 ? snow : null;
    bareCrown(ctx, x - u * 0.04, top - u * 0.06, u, 0.95, bark, bare);
    if (bare) for (const l of limbs) stroke(ctx, l.map((v, i) => v - (i % 2 ? Math.max(1, u * 0.07) : 0)), bare, Math.max(1, u * 0.05));
  }
  if (s.leaf >= 0.15) {
    // A crown wider than it is tall, in lobes along its top, held up clear of the limbs.
    const k = 0.55 + 0.45 * s.leaf;
    for (const [dx, dy, r, t] of [[-0.72, 1.3, 0.34, 0.88], [0.74, 1.28, 0.32, 0.92], [-0.38, 1.56, 0.4, 1.02], [0.38, 1.58, 0.39, 0.98], [0, 1.78, 0.4, 1.08], [0.02, 1.3, 0.42, 0.8]]) {
      celBall(ctx, B, x + dx * u, y - dy * u, r * u * k, shade(leaf, t), t > 0.85);
    }
    if (u > 8 && s.blossom > 0.1) dabs(ctx, x, y - u * 1.4, u * 0.85, u * 0.26, 10, s.blossom, u * 0.07, () => shade('#d8d878', tone));
  }
}

/** A willow (the delta's): a short leaning trunk under a dome whose leaves hang in a curtain nearly to the ground; yellow catkins in Sowing, yellow in Leafturn, its bare twigs hanging gold. */
function willow(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const h = u * 2.3, bark = shade('#5e4a36', tone), leaf = shade(seasonLeaf('#7c9c3e', '#d8c448', s, 0.4), tone), snow = treeSnow(s, tone);
  const cx = x + u * 0.08, cy = y - h * 0.68, fork = y - h * 0.5;
  celTaper(ctx, B, x, y, cx, fork, u * 0.16, u * 0.11, bark, 0.2);
  if (s.leaf < 0.6) {
    const twig = shade('#b08a48', tone), bare = s.leaf < 0.15 ? snow : null;
    for (const [dx, dy] of [[-0.62, 0.3], [-0.3, 0.52], [0.05, 0.62], [0.36, 0.5], [0.64, 0.28]]) {
      const ex = cx + dx * u, ey = cy - dy * u;
      stroke(ctx, [cx, fork, ex, ey], bark, Math.max(1, u * 0.07));
      stroke(ctx, [ex, ey, ex + dx * u * 0.3, ey + u * 0.04, ex + dx * u * 0.42, y - h * 0.18], twig, Math.max(1, u * 0.04));
      stroke(ctx, [ex - dx * u * 0.12, ey + u * 0.06, ex + dx * u * 0.06, ey + u * 0.1, ex + dx * u * 0.1, y - h * 0.32], twig, Math.max(1, u * 0.04));
      if (bare) stroke(ctx, [(cx + ex) / 2, (fork + ey) / 2 - 1, ex, ey - 1], bare, Math.max(1, u * 0.04));
    }
  }
  if (s.leaf >= 0.15) {
    const k = 0.55 + 0.45 * s.leaf, half = u * 0.95 * k, fw = u * 0.17 * k;
    // The curtain: seven fronds hung from under the dome, longer and shorter by turns, the outer splayed a little.
    for (const i of [0, 6, 2, 4, 1, 5, 3]) {
      const t = i / 3 - 1, fx = cx + t * half * 0.86, top = cy - h * 0.02 + Math.abs(t) * h * 0.06;
      const foot = top + h * (0.34 + 0.06 * ((i * 3) % 4)) * (0.35 + 0.65 * s.leaf), sx = t * u * 0.08;
      celPoly(ctx, B, [fx - fw, top, fx + fw, top, fx + fw * 0.75 + sx, foot - h * 0.06, fx + sx * 1.3, foot, fx - fw * 0.75 + sx, foot - h * 0.06], shade(leaf, i % 2 ? 0.84 : 0.96), 0.4, 0.2);
    }
    celBall(ctx, B, cx - u * 0.42 * k, cy - h * 0.02, u * 0.44 * k, shade(leaf, 0.96));
    celBall(ctx, B, cx + u * 0.42 * k, cy, u * 0.44 * k, shade(leaf, 1.04));
    celBall(ctx, B, cx, cy - h * 0.1, u * 0.52 * k, leaf);
    if (u > 8 && s.blossom > 0.1) dabs(ctx, cx, cy + h * 0.1, half * 0.9, h * 0.22, 10, s.blossom, u * 0.07, () => shade('#e8d850', tone));
    if (snow) stroke(ctx, [cx - u * 0.8 * k, cy - h * 0.06, cx - u * 0.4 * k, cy - h * 0.2, cx, cy - h * 0.1 - u * 0.5 * k, cx + u * 0.4 * k, cy - h * 0.18, cx + u * 0.8 * k, cy - h * 0.04], snow, Math.max(1, u * 0.08 * s.snow));
  }
}

/** A poplar (the delta's): tall and narrow, its crown a column; red catkins in Sowing, bright yellow in Leafturn, bare its limbs swept up close about the trunk. */
function poplar(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const h = u * 3, bark = shade('#6a5a48', tone), leaf = shade(seasonLeaf('#4e8a3c', '#e8c838', s, 0.5), tone), snow = treeSnow(s, tone);
  celTaper(ctx, B, x, y, x, y - h * (s.leaf < 0.6 ? 0.94 : 0.3), u * 0.1, u * (s.leaf < 0.6 ? 0.025 : 0.08), bark, 0.2);
  if (s.leaf < 0.6) {
    const bare = s.leaf < 0.15 ? snow : null;
    for (let i = 0; i < 6; i++) {
      const side = i % 2 ? 1 : -1, by = y - h * (0.26 + i * 0.11), limb = [x, by, x + side * u * 0.2, by - h * 0.12, x + side * u * 0.24, by - h * 0.22];
      stroke(ctx, limb, bark, Math.max(1, u * 0.05));
      if (bare) stroke(ctx, [limb[2] - side, limb[3] - 1, limb[4] - side, limb[5] - 1], bare, Math.max(1, u * 0.04));
    }
  }
  if (s.leaf >= 0.15) {
    const w = u * 0.38 * (0.55 + 0.45 * s.leaf);
    celPoly(ctx, B, [x, y - h, x + w * 0.8, y - h * 0.76, x + w, y - h * 0.48, x + w * 0.62, y - h * 0.22, x - w * 0.62, y - h * 0.22, x - w, y - h * 0.48, x - w * 0.8, y - h * 0.76], leaf, 0.42, 0.25);
    for (let i = 0; i < 4; i++) stroke(ctx, [x - w * 0.5, y - h * (0.32 + 0.14 * i), x + w * 0.1, y - h * (0.36 + 0.14 * i)], shade(leaf, 0.78), Math.max(1, u * 0.05));
    if (u > 8 && s.blossom > 0.1) dabs(ctx, x, y - h * 0.6, w * 0.8, h * 0.3, 8, s.blossom, u * 0.07, () => shade('#b83a3a', tone));
    if (snow) stroke(ctx, [x - w, y - h * 0.5, x - w * 0.8, y - h * 0.76, x, y - h + 1, x + w * 0.8, y - h * 0.76, x + w, y - h * 0.5], snow, Math.max(1, u * 0.07 * s.snow));
  }
}

/** Red bunches of three, hung about a crown or its bare limbs: the rowan's berries. */
function bunches(ctx: CanvasRenderingContext2D, at: readonly (readonly number[])[], u: number, share: number, colour: string): void {
  const sz = Math.max(1, Math.round(u * 0.07));
  ctx.fillStyle = colour;
  for (let i = 0; i < at.length && i / at.length < share; i++) {
    const [bx, by] = at[i].map(Math.round);
    ctx.fillRect(bx, by, sz, sz); ctx.fillRect(bx + sz, by, sz, sz); ctx.fillRect(bx + Math.round(sz / 2), by + sz, sz, sz);
  }
}

/** A rowan (the moors'): slender and smooth-barked, its crown light and open; cream flowers in Sowing, berries red from Harvest that stay on the bare limbs into Frost, flame in Leafturn. */
function rowan(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const h = u * 2.1, bark = shade('#7a7266', tone), leaf = shade(seasonLeaf('#4e8040', '#d8502a', s, 0.6), tone), top = y - h * 0.5;
  celTaper(ctx, B, x, y, x, top, u * 0.1, u * 0.07, bark, 0.2);
  stroke(ctx, [x, top, x - u * 0.32, y - h * 0.72], bark, Math.max(1, u * 0.06));
  stroke(ctx, [x, top + u * 0.06, x + u * 0.3, y - h * 0.74], bark, Math.max(1, u * 0.06));
  if (s.leaf < 0.6) bareCrown(ctx, x, top, u, 0.72, bark, s.leaf < 0.15 ? treeSnow(s, tone) : null, true);
  const crown = [[-0.42, 0.68, 0.32, 0.9], [0.4, 0.7, 0.32, 1.02], [-0.16, 0.86, 0.36, 1.06], [0.2, 0.84, 0.34, 1], [0, 0.66, 0.28, 0.82]];
  if (s.leaf >= 0.15) for (const [dx, dy, r, t] of crown) celBall(ctx, B, x + dx * u, y - dy * h, r * u * (0.55 + 0.45 * s.leaf), shade(leaf, t), t > 0.85);
  if (u > 8 && s.leaf >= 0.15 && s.blossom > 0.1) dabs(ctx, x, y - h * 0.78, u * 0.55, u * 0.3, 8, s.blossom, u * 0.12, () => shade('#f4eedc', tone));
  if (u > 8 && s.berry > 0.1) bunches(ctx, crown.map(([dx, dy, r]) => [x + dx * u - u * 0.05, y - dy * h + r * u * 0.3]), u, s.berry, shade('#d0261e', tone));
}

/** A thorn of the moors and the gulf: low and wind-bent, its trunk leaning and its crown swept to the lee; may blossom white in Sowing, dark red haws from Harvest. */
function thorn(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const h = u * 2.2, bark = shade('#4e4034', tone), leaf = shade(seasonLeaf('#3e6a34', '#8a5a2a', s, 0.7), tone), snow = treeSnow(s, tone);
  const kx = x + u * 0.12, ky = y - h * 0.36, tx = x + u * 0.34, ty = y - h * 0.6;
  celTaper(ctx, B, x - u * 0.06, y, kx, ky, u * 0.15, u * 0.11, bark, 0.2);
  celTaper(ctx, B, kx, ky, tx, ty, u * 0.11, u * 0.07, bark, 0.2);
  stroke(ctx, [kx, ky - h * 0.05, x + u * 0.5, y - h * 0.56, x + u * 0.82, y - h * 0.6], bark, Math.max(1, u * 0.07));
  stroke(ctx, [kx, ky - h * 0.08, x - u * 0.12, y - h * 0.52, x - u * 0.3, y - h * 0.6], bark, Math.max(1, u * 0.06));
  if (s.leaf < 0.6) {
    const bare = s.leaf < 0.15 ? snow : null;
    for (const [dx, dy] of [[-0.24, 0.76], [0.1, 0.88], [0.48, 0.96], [0.84, 0.88], [1.0, 0.72]]) {
      const ex = x + dx * u, ey = y - dy * h, mx = (tx + ex) / 2 + u * 0.06, my = (ty + ey) / 2;
      stroke(ctx, [tx, ty, mx, my, ex, ey], bark, Math.max(1, u * 0.045));
      if (bare) stroke(ctx, [mx, my - 1, ex, ey - 1], bare, Math.max(1, u * 0.04));
    }
  }
  if (s.leaf >= 0.15) {
    const k = 0.55 + 0.45 * s.leaf;
    for (const [dx, dy, r, t] of [[-0.22, 0.7, 0.3, 0.9], [0.2, 0.8, 0.38, 1.04], [0.6, 0.78, 0.34, 1], [0.88, 0.66, 0.24, 0.92], [0.38, 0.66, 0.3, 0.82]]) celBall(ctx, B, x + dx * u, y - dy * h, r * u * k, shade(leaf, t), t > 0.85);
  }
  if (u > 8 && s.leaf >= 0.15 && s.blossom > 0.1) dabs(ctx, x + u * 0.36, y - h * 0.76, u * 0.6, u * 0.24, 12, s.blossom, u * 0.09, (i) => shade(i % 4 ? '#faf6f0' : '#f0d8dc', tone));
  if (u > 8 && s.berry > 0.1) dabs(ctx, x + u * 0.36, y - h * 0.72, u * 0.62, u * 0.26, 9, s.berry, u * 0.07, () => shade('#8a1a1e', tone));
}

/** A larch (the north's): a conifer that sheds, its tiers soft and drooping about a straight trunk; red cones in Sowing, gold in Leafturn, bare in Frost. */
function larch(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const h = u * 2.6, twig = shade('#7a5c46', tone), snow = treeSnow(s, tone), leaf = shade(mix(mix('#78a848', '#b8e868', s.fresh * 0.7), '#d8a028', s.turn), tone);
  celTaper(ctx, B, x, y, x, y - h * 0.96, u * 0.11, u * 0.025, shade('#6a4a36', tone), 0.2);
  for (let i = 0; i < 4; i++) {
    const ty = y - h * (0.24 + i * 0.19), tw = u * 1.1 * (1 - i * 0.2), th = h * 0.26;
    if (s.leaf < 0.6) for (const side of [-1, 1]) {
      const limb = [x, ty - th * 0.55, x + side * tw * 0.3, ty - th * 0.3, x + side * tw * 0.5, ty + th * 0.02];
      stroke(ctx, limb, twig, Math.max(1, u * 0.045));
      if (snow && s.leaf < 0.15) stroke(ctx, limb.slice(0, 4).map((v, j) => v - (j % 2 ? 1 : 0)), snow, Math.max(1, u * 0.04));
    }
    if (s.leaf >= 0.15) {
      const w2 = (tw * (0.55 + 0.45 * s.leaf)) / 2;
      celPoly(ctx, B, [x - w2, ty + th * 0.04, x, ty - th, x + w2, ty + th * 0.04, x, ty - th * 0.22], shade(leaf, 1 - i * 0.05), 0.4, 0.25);
      if (snow) stroke(ctx, [x - w2 * 0.5, ty - th * 0.5, x, ty - th, x + w2 * 0.5, ty - th * 0.5], snow, Math.max(1, u * 0.06 * s.snow));
    }
  }
  if (u > 8 && s.leaf >= 0.15 && s.blossom > 0.1) dabs(ctx, x, y - h * 0.55, u * 0.4, h * 0.25, 7, s.blossom, u * 0.07, () => shade('#d0607a', tone));
}

/** A Scots pine (the north's): a tall trunk bare of limbs, red toward the top, under a flat crown in pads; pale candles in Sowing, green the year round, snow on the pads. */
function scots(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const h = u * 2.8, snow = treeSnow(s, tone), needles = shade(mix('#2e5c44', '#6aa060', s.fresh * 0.4), tone), limb = shade('#a85a34', tone);
  celTaper(ctx, B, x, y, x + u * 0.06, y - h * 0.8, u * 0.12, u * 0.06, shade('#6a5040', tone), 0.2);
  celTaper(ctx, B, x + u * 0.03, y - h * 0.42, x + u * 0.06, y - h * 0.8, u * 0.085, u * 0.06, shade('#c0683a', tone), 0.3);
  stroke(ctx, [x + u * 0.04, y - h * 0.6, x - u * 0.36, y - h * 0.7], limb, Math.max(1, u * 0.06));
  stroke(ctx, [x + u * 0.05, y - h * 0.68, x + u * 0.42, y - h * 0.78], limb, Math.max(1, u * 0.06));
  // The pads: flat beneath, low domes above.
  for (const [px, py, w, t] of [[-0.36, 0.7, 0.3, 0.9], [0.42, 0.78, 0.3, 0.95], [0.04, 0.86, 0.56, 1.04]]) {
    const cx = x + px * u, cy = y - py * h, hw = w * u, hh = hw * 0.42;
    celPoly(ctx, B, [cx - hw, cy, cx - hw * 0.8, cy - hh * 0.7, cx - hw * 0.35, cy - hh, cx + hw * 0.35, cy - hh, cx + hw * 0.8, cy - hh * 0.7, cx + hw, cy], shade(needles, t), 0.4, 0.25);
    if (snow) stroke(ctx, [cx - hw * 0.85, cy - hh * 0.62, cx - hw * 0.35, cy - hh, cx + hw * 0.35, cy - hh, cx + hw * 0.85, cy - hh * 0.62], snow, Math.max(1, u * 0.1 * s.snow));
  }
  if (u > 8 && s.blossom > 0.1) dabs(ctx, x + u * 0.04, y - h * 0.9, u * 0.6, u * 0.08, 8, s.blossom, u * 0.07, () => shade('#e8dc9a', tone));
}

/** A flat-topped tree of the steppe (the Glasswold's): a slender trunk forking under a wide flat crown; yellow flowers in Sowing, dry gold in Leafturn, bare its twigs spread level; snow lies along its top. */
function flattop(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason): void {
  const h = u * 2.3, bark = shade('#5a4632', tone), leaf = shade(seasonLeaf('#6a7e3a', '#b8a048', s, 0.5), tone), snow = treeSnow(s, tone), fork = y - h * 0.36;
  celTaper(ctx, B, x, y, x, fork, u * 0.1, u * 0.075, bark, 0.2);
  for (const [dx, dy] of [[-0.56, 0.78], [0.06, 0.82], [0.6, 0.77]]) {
    const ex = x + dx * u, ey = y - dy * h;
    stroke(ctx, [x, fork, x + dx * u * 0.4, fork - (fork - ey) * 0.55, ex, ey], bark, Math.max(1, u * 0.065));
    if (s.leaf < 0.6) {
      stroke(ctx, [ex - u * 0.32, ey - u * 0.02, ex, ey, ex + u * 0.32, ey - u * 0.05], bark, Math.max(1, u * 0.04));
      if (snow && s.leaf < 0.15) stroke(ctx, [ex - u * 0.3, ey - u * 0.02 - 1, ex, ey - 1, ex + u * 0.3, ey - u * 0.05 - 1], snow, Math.max(1, u * 0.04));
    }
  }
  if (s.leaf >= 0.15) {
    const w = u * (0.6 + 0.4 * s.leaf);
    celPoly(ctx, B, [x - w * 0.85, y - h * 0.74, x - w * 0.7, y - h * 0.81, x + w * 0.65, y - h * 0.81, x + w * 0.9, y - h * 0.75, x + w * 0.5, y - h * 0.71, x - w * 0.5, y - h * 0.71], shade(leaf, 0.86), 0.4, 0.2);
    celPoly(ctx, B, [x - w, y - h * 0.84, x - w * 0.8, y - h * 0.92, x - w * 0.2, y - h * 0.95, x + w * 0.45, y - h * 0.94, x + w, y - h * 0.86, x + w * 0.75, y - h * 0.8, x - w * 0.75, y - h * 0.8], leaf, 0.4, 0.25);
    if (u > 8 && s.blossom > 0.1) dabs(ctx, x, y - h * 0.89, w * 0.9, h * 0.04, 10, s.blossom, u * 0.08, () => shade('#f0d040', tone));
    if (snow) stroke(ctx, [x - w * 0.9, y - h * 0.88, x - w * 0.2, y - h * 0.955, x + w * 0.45, y - h * 0.945, x + w * 0.95, y - h * 0.87], snow, Math.max(1, u * 0.1 * s.snow));
  }
}

/** The five trees of old, variants 0 to 4; the regions' own follow, in `TREES`' order. */
const OLD_TREES = 5;
const REGIONAL: readonly ((ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, s: TreeSeason) => void)[] = [oak, willow, poplar, rowan, thorn, larch, scots, flattop];
/** The variants of `drawTreeSprite` each tree is drawn in: the broadleaf and the conifer of old in two greens each, every other in one. */
export const TREES: Readonly<Record<TreeName, readonly number[]>> = {
  broadleaf: [0, 1], birch: [2], conifer: [3, 4], oak: [5], willow: [6], poplar: [7], rowan: [8], thorn: [9], larch: [10], scots: [11], flattop: [12],
};
/** The trees that may stand in the pinewoods. */
export const CONIFERS: readonly TreeName[] = ['conifer', 'larch', 'scots'];
const NAMES = Object.keys(TREES) as TreeName[];

/**
 * The variant of `drawTreeSprite` a square's hash `h` (0 .. 1) picks from its region's trees by weight, in `TREES`'
 * order, a tree of two greens taking either by where `h` falls in its share. With none named it is today's mix: any
 * of the five of old in a forest or the woods, either conifer in the pinewoods (`pine`).
 */
export function treeOf(weights: TreeWeights | undefined, h: number, pine = false): number {
  if (!weights) return pine ? 3 + Math.floor(h * 2) : Math.floor(h * 5);
  let total = 0, last = 0;
  for (const n of NAMES) total += Math.max(0, weights[n] ?? 0);
  let at = h * total;
  for (const n of NAMES) {
    const w = weights[n] ?? 0, v = TREES[n];
    if (!(w > 0)) continue;
    if (at < w) return v[Math.min(v.length - 1, Math.floor((at * v.length) / w))];
    at -= w; last = v[v.length - 1];
  }
  return last;
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

// ---- What stands scattered on open ground (#1103) ---------------------------------------------------

/**
 * How a prop is coloured: `ink` takes a colour as the ground under it takes its own (darker by night,
 * into the haze with distance and murk, darker in the rain), `ground` is that ground's colour in the
 * season, `snow` how far snow lies on it (0 .. 1), `bloom` how far the flowers are out (0 .. 1) and
 * `pick` a hash for its shape.
 */
interface PropInk { ink: (c: string) => string; ground: string; snow: number; bloom: number; pick: number }
/** A colour whitened as far as the snow lies, as the top of a rock is. */
const snowed = (c: string, snow: number): string => (snow > 0.2 ? mix(c, SNOW_WHITE, Math.min(1, snow * 1.2)) : c);
/** A dot of colour, a pixel at the least. */
function dab(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string): void {
  ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

/**
 * The props, each drawn about its foot at (x, y), `u` the square's half width there. Each is small, under
 * half a wall's height, and ONE thing: a boulder or a stone is one rounded rock, never stacked
 * or ringed, a snag is no post and the peat a low turf mound, so that none is taken for a feature's
 * drawing (#1110). A deep snow buries the low ones.
 */
const PROPS: Record<Prop, (ctx: CanvasRenderingContext2D, x: number, y: number, u: number, k: PropInk) => void> = {
  bush(ctx, x, y, u, { ink, ground, snow, pick }) {
    const r = u * (0.12 + 0.03 * pick), leaf = ink(mix(ground, '#24401e', 0.5));
    celBall(ctx, B, x - r * 0.75, y - r * 0.7, r * 0.8, shade(leaf, 0.9));
    celBall(ctx, B, x + r * 0.8, y - r * 0.65, r * 0.75, leaf);
    celBall(ctx, B, x, y - r * 1.15, r, shade(leaf, 1.08));
    if (snow > 0.2) { ctx.fillStyle = ink(SNOW_WHITE); ctx.beginPath(); ctx.ellipse(x, y - r * 1.9, r * 0.85, r * 0.3 * Math.min(1, snow * 1.5), 0, 0, Math.PI * 2); ctx.fill(); }
  },
  boulder(ctx, x, y, u, { ink, ground, snow, pick }) {
    const w = u * (0.16 + 0.04 * pick), h = w * (0.72 + 0.14 * pick), c = mix('#7a756c', ground, 0.15);
    celPoly(ctx, B, [x - w, y, x - w * 0.92, y - h * 0.5, x - w * 0.6, y - h * 0.9, x - w * 0.1, y - h, x + w * 0.45, y - h * 0.88, x + w * 0.88, y - h * 0.5, x + w, y], ink(c), 0.4, 0.3);
    if (snow > 0.2) celPoly(ctx, B, [x - w * 0.78, y - h * 0.7, x - w * 0.55, y - h * 0.9, x - w * 0.1, y - h, x + w * 0.45, y - h * 0.88, x + w * 0.7, y - h * 0.66, x, y - h * 0.8], ink(snowed(c, snow)), 0.2, 0.2);
  },
  thistle(ctx, x, y, u, { ink, ground, snow, bloom, pick }) {
    if (snow > 0.55) return;
    const h = u * (0.22 + 0.06 * pick), stem = ink(mix('#56704a', ground, 0.3)), lw = Math.max(1, u * 0.022);
    stroke(ctx, [x, y, x + u * 0.01, y - h], stem, lw);
    for (const s of [-1, 1]) stroke(ctx, [x, y - h * 0.3, x + s * u * 0.05, y - h * 0.42, x + s * u * 0.09, y - h * 0.4], stem, lw);
    // Its head on a green bulb: purple in flower, brown gone to seed.
    celBall(ctx, B, x + u * 0.01, y - h, u * 0.035, stem, false);
    dab(ctx, x - u * 0.02, y - h - u * 0.075, u * 0.06, u * 0.04, ink(mix('#7a6448', '#9a4ca0', bloom)));
  },
  molehill(ctx, x, y, u, { ink, snow, pick }) {
    if (snow > 0.55) return;
    const w = u * (0.13 + 0.03 * pick), h = w * 0.75, earth = '#4a3626';
    ctx.fillStyle = ink(snowed(earth, snow)); ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, Math.PI, 0); ctx.fill();
    for (const [dx, dy] of [[-0.45, 0.45], [0.1, 0.8], [0.4, 0.35]]) dab(ctx, x + dx * w, y - dy * h, u * 0.02, u * 0.015, ink(shade(earth, 1.4)));
  },
  gorse(ctx, x, y, u, { ink, ground, snow, bloom, pick }) {
    // Spiny and ragged along its top, and in flower nearly all the year.
    const w = u * (0.15 + 0.04 * pick), h = w * 1.25, pts = [x - w, y];
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(x - w + 2 * w * t, y - h * Math.sin(Math.PI * (0.08 + 0.84 * t)) * (i % 2 ? 1 : 0.8)); }
    pts.push(x + w, y);
    celPoly(ctx, B, pts, ink(mix('#2e4a24', ground, 0.2)), 0.4, 0.25);
    if (snow > 0.2) { stroke(ctx, [x - w * 0.6, y - h * 0.85, x, y - h * 1.02, x + w * 0.6, y - h * 0.85], ink(SNOW_WHITE), Math.max(1, u * 0.04)); return; }
    for (let i = 0; i < 2 + Math.round(3 * bloom); i++) dab(ctx, x + w * 0.7 * Math.sin(i * 2.3 + pick * 6), y - h * (0.3 + 0.45 * ((i * 0.37 + pick) % 1)), u * 0.025, u * 0.025, ink('#e8c434'));
  },
  peat(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.55) return;
    // Cut turves left to dry: a low mound, dark brown under the moor's own top.
    const w = u * (0.15 + 0.03 * pick), h = w * 0.45;
    celPoly(ctx, B, [x - w, y, x - w * 0.86, y - h * 0.75, x - w * 0.55, y - h, x + w * 0.55, y - h, x + w * 0.86, y - h * 0.75, x + w, y], ink('#3a2a20'), 0.35, 0.2);
    dab(ctx, x - w * 0.6, y - h, w * 1.2, h * 0.28, ink(snowed(mix(ground, '#3a2a28', 0.35), snow)));
  },
  tussock(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.55) return;
    // A clump of the steppe's grass, dark at its heart and standing taller than its tufts, all leaning one way.
    const h = u * (0.2 + 0.06 * pick), lw = Math.max(1, u * 0.022), pale = ink(shade(ground, 1.25)), dun = ink(shade(ground, 0.8));
    celPoly(ctx, B, [x - u * 0.1, y, x - u * 0.07, y - h * 0.45, x, y - h * 0.6, x + u * 0.09, y - h * 0.5, x + u * 0.12, y], ink(shade(ground, 0.6)), 0.3, 0);
    for (let i = 0; i < 7; i++) {
      const t = i / 6 - 0.5, bx = x + t * u * 0.12, top = y - h * (1 - Math.abs(t) * 0.7), lean = u * (t * 0.22 + 0.04);
      stroke(ctx, [bx, y, bx + lean * 0.4, (y + top) / 2, bx + lean, top], i % 2 ? dun : pale, lw);
    }
  },
  skull(ctx, x, y, u, { ink, snow }) {
    if (snow > 0.55) return;
    // An ox's skull bleached on the ground, its horns curving up.
    const w = u * 0.07, bone = ink('#e2dac6'), lw = Math.max(1, u * 0.025);
    for (const s of [-1, 1]) stroke(ctx, [x + s * w * 0.8, y - w * 1.3, x + s * w * 2, y - w * 1.6, x + s * w * 2.3, y - w * 2.4], bone, lw);
    celPoly(ctx, B, [x - w, y - w * 1.5, x + w, y - w * 1.5, x + w * 0.8, y - w * 0.6, x + w * 0.4, y, x - w * 0.4, y, x - w * 0.8, y - w * 0.6], bone, 0.3, 0.2);
    for (const s of [-1, 1]) dab(ctx, x + s * w * 0.45 - w * 0.15, y - w * 1.15, w * 0.3, w * 0.3, ink('#3a3228'));
  },
  stone(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.7) return;
    const w = u * (0.08 + 0.03 * pick), h = w * 0.7, c = mix('#857d70', ground, 0.25);
    celPoly(ctx, B, [x - w, y, x - w * 0.8, y - h * 0.7, x - w * 0.2, y - h, x + w * 0.5, y - h * 0.85, x + w, y - h * 0.3, x + w * 0.9, y], ink(snowed(c, snow * 0.6)), 0.4, 0.3);
  },
  stump(ctx, x, y, u, { ink, snow, pick }) {
    // A charred stump, its top burnt ragged, the char cracked across.
    const w = u * 0.075, h = u * (0.2 + 0.06 * pick), c = ink('#2c2622');
    celPoly(ctx, B, [x - w * 1.5, y, x - w, y - h * 0.3, x - w, y - h * 0.92, x - w * 0.45, y - h, x - w * 0.05, y - h * 0.8, x + w * 0.35, y - h * 1.1, x + w, y - h * 0.86, x + w, y - h * 0.3, x + w * 1.6, y], c, 0.3, 0.2);
    for (let i = 0; i < 3; i++) dab(ctx, x - w * 0.6 + (i % 2) * w * 0.5, y - h * (0.25 + 0.22 * i), w * 0.7, u * 0.015, ink('#4e423a'));
    if (snow > 0.2) stroke(ctx, [x - w * 0.9, y - h * 0.95, x + w * 0.9, y - h * 0.9], ink(SNOW_WHITE), Math.max(1, u * 0.03));
  },
  steam(ctx, x, y, u, { ink, pick }) {
    // The crack it rises from and the wisp leaning off it, its puffs run together, drawn still as the volcano's smoke is.
    const lean = (pick < 0.5 ? -1 : 1) * u * (0.04 + 0.04 * Math.abs(2 * pick - 1));
    ctx.fillStyle = ink('#1a1616'); ctx.beginPath(); ctx.ellipse(x, y, u * 0.07, u * 0.02, 0, 0, Math.PI * 2); ctx.fill();
    for (let j = 0; j < 3; j++) {
      ctx.fillStyle = rgba(ink('#e8eaec'), 0.5 - j * 0.12);
      ctx.beginPath(); ctx.arc(x + lean * (j + 0.5), y - u * (0.07 + 0.085 * j), u * (0.045 + 0.025 * j), 0, Math.PI * 2); ctx.fill();
    }
  },
  cinder(ctx, x, y, u, { ink, snow, pick }) {
    // A lump of clinker, pitted where the gas came out of it.
    const w = u * (0.11 + 0.03 * pick), h = w * 0.8, c = '#5a4034';
    celPoly(ctx, B, [x - w, y, x - w * 0.95, y - h * 0.55, x - w * 0.5, y - h * 0.95, x + w * 0.15, y - h, x + w * 0.7, y - h * 0.7, x + w, y - h * 0.2, x + w * 0.9, y], ink(c), 0.4, 0.3);
    for (const [dx, dy] of [[-0.45, 0.5], [0.1, 0.72], [0.45, 0.35]]) dab(ctx, x + dx * w, y - dy * h, u * 0.025, u * 0.02, ink('#221c1a'));
    if (snow > 0.2) stroke(ctx, [x - w * 0.5, y - h * 0.92, x + w * 0.15, y - h, x + w * 0.65, y - h * 0.72], ink(SNOW_WHITE), Math.max(1, u * 0.03));
  },
  drift(ctx, x, y, u, { ink, pick }) {
    // A stone, and the snow the wind banked against its lee to its shoulder.
    const w = u * (0.09 + 0.03 * pick), h = w * 0.95, s = pick < 0.5 ? -1 : 1, white = ink(SNOW_WHITE);
    celPoly(ctx, B, [x - w, y, x - w * 0.85, y - h * 0.7, x - w * 0.3, y - h, x + w * 0.4, y - h * 0.9, x + w, y - h * 0.4, x + w * 0.95, y], ink('#605c58'), 0.4, 0.3);
    celPoly(ctx, B, [x + s * w * 0.2, y, x + s * w * 0.55, y - h * 0.75, x + s * w * 0.95, y - h * 0.6, x + s * w * 2.6, y], white, 0.25, 0.15);
    stroke(ctx, [x - w * 0.55, y - h * 0.86, x - w * 0.2, y - h, x + w * 0.3, y - h * 0.9], white, Math.max(1, u * 0.03));
  },
  reeds(ctx, x, y, u, { ink, ground, pick }) {
    // Pale against the swamp's green, two of them with a brown head.
    const h = u * (0.32 + 0.08 * pick), lw = Math.max(1, u * 0.03), blade = ink(mix('#b8c068', ground, 0.15)), dark = ink(mix('#4e5a2a', ground, 0.2)), head = ink('#5a3a22');
    for (let i = 0; i < 6; i++) {
      const t = i / 5 - 0.5, bx = x + t * u * 0.14, top = y - h * (0.62 + 0.38 * (((i * 7 + 3) % 5) / 4)), lean = u * t * 0.08;
      stroke(ctx, [bx, y, bx + lean, top], i % 2 ? dark : blade, lw);
      if (i === 1 || i === 4) celCapsule(ctx, B, bx + lean * 0.9, top + u * 0.03, bx + lean * 0.8, top + u * 0.09, u * 0.022, head, 0.3);
    }
  },
  snag(ctx, x, y, u, { ink, snow, pick }) {
    // A dead trunk standing in the wet, leaning, snapped off ragged, the stub of a limb on it.
    const h = u * (0.3 + 0.08 * pick), s = pick < 0.5 ? -1 : 1, lean = u * 0.05 * s, wood = ink('#8c867c');
    celTaper(ctx, B, x, y, x + lean, y - h, u * 0.045, u * 0.028, wood, 0.2);
    celPoly(ctx, B, [x + lean - u * 0.028, y - h, x + lean - u * 0.01, y - h - u * 0.06, x + lean + u * 0.008, y - h - u * 0.02, x + lean + u * 0.028, y - h - u * 0.08, x + lean + u * 0.028, y - h], wood, 0.3, 0.2);
    stroke(ctx, [x + lean * 0.5, y - h * 0.55, x + lean * 0.5 - s * u * 0.1, y - h * 0.78], wood, Math.max(1, u * 0.025));
    if (snow > 0.2) stroke(ctx, [x + lean - u * 0.025, y - h - u * 0.01, x + lean + u * 0.025, y - h - u * 0.01], ink(SNOW_WHITE), Math.max(1, u * 0.025));
  },
  driftwood(ctx, x, y, u, { ink, snow, pick }) {
    // A bleached log the water left, a broken limb up from it.
    const w = u * (0.16 + 0.04 * pick), r = u * 0.032, wood = ink(snowed('#c4baa6', snow * 0.5));
    celCapsule(ctx, B, x - w, y - r, x + w, y - r * 1.3, r, wood, 0.3);
    stroke(ctx, [x + w * 0.45, y - r * 1.8, x + w * 0.7, y - r * 4.2], wood, Math.max(1, r * 0.9));
  },
  shells(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.55) return;
    // A few shells the tide left, each with its shadow on the sand.
    const r = Math.max(1, u * 0.04), under = ink(shade(ground, 0.72));
    for (let j = 0; j < 4; j++) {
      const sx = x + u * (j * 0.08 - 0.12 + 0.03 * Math.sin(pick * 9 + j)), sy = y - u * 0.02 * (j % 2);
      ctx.fillStyle = under; ctx.beginPath(); ctx.ellipse(sx + r * 0.2, sy + r * 0.15, r, r * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink(['#f6efe2', '#d89a84', '#efe0c8', '#c8b8a8'][j]);
      ctx.beginPath(); ctx.ellipse(sx, sy, r, r * 0.75, 0, Math.PI, 0); ctx.fill();
    }
  },
};

/** A prop scattered on open ground (#1103), its foot at (x, y), `u` the square's half width there. */
export function drawPropSprite(ctx: CanvasRenderingContext2D, prop: Prop, x: number, y: number, u: number, k: PropInk): void { PROPS[prop](ctx, x, y, u, k); }

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

/**
 * A monastery standing on its square, its foot at y: a long wall of grey stone with its gate's arch
 * and a row of slits, the chapel's roof over it, and two bell towers standing up over it all, each
 * with its bell in an open belfry under a steep slate cap. No lamp: by night it is as dark as the
 * hills. Snow lies along the wall's top and on the caps when `snow` lies. Wider than its square, as
 * it is seen from far off; near to, the block of building squares it stands in hides its foot.
 */
function drawMonasterySprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, snow = 0): void {
  const stone = shade('#a8a090', tone), shadow = shade('#7e776a', tone), coping = shade('#5e584e', tone);
  const slate = shade('#555660', tone), slateShadow = shade('#393a42', tone), dark = shade('#221e1a', tone);
  const bronze = shade('#b08a42', tone), white = shade('#eef2f7', tone), snowy = snow > 0.2;
  const R = Math.round, px = (v: number): number => Math.max(1, Math.round(v));
  const tri = (a: number, b: number, c: number, d: number, e: number, f: number, fill: string): void => {
    ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.lineTo(e, f); ctx.closePath(); ctx.fill();
  };
  // The wall, lit from the left and its right-hand end in shade, its coping, and snow along the top.
  const ww = u * 1.7, top = y - u * 1.25;
  ctx.fillStyle = stone; ctx.fillRect(R(x - ww), R(top), R(ww * 2), R(y - top));
  ctx.fillStyle = shadow; ctx.fillRect(R(x + ww * 0.7), R(top), R(ww * 0.3), R(y - top));
  ctx.fillStyle = coping; ctx.fillRect(R(x - ww), R(top), R(ww * 2), px(u * 0.08));
  if (snowy) { ctx.fillStyle = white; ctx.fillRect(R(x - ww), R(top - u * 0.05), R(ww * 2), px(u * 0.06)); }
  // The gate's arch in the middle of the wall's foot, and a row of slits.
  const gw = u * 0.22, gh = u * 0.62;
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(x - gw, y); ctx.lineTo(x - gw, y - gh + gw); ctx.arc(x, y - gh + gw, gw, Math.PI, 0); ctx.lineTo(x + gw, y); ctx.closePath(); ctx.fill();
  for (const f of [-0.82, -0.5, 0.5, 0.82]) ctx.fillRect(R(x + f * ww - u * 0.03), R(top + u * 0.3), px(u * 0.06), px(u * 0.26));
  // The chapel's roof over the wall between the towers, a ridge of slate.
  tri(x - u * 0.62, top, x, top - u * 0.62, x, top, slate);
  tri(x, top, x, top - u * 0.62, x + u * 0.62, top, slateShadow);
  // The towers: each lit on its left, its belfry open with the bell hung in it, its cap steep slate
  // with a finial, and snow along the cap's foot.
  const tw = u * 0.3, tt = y - u * 3.55, cap = u * 1.05;
  for (const tx of [x - u * 0.9, x + u * 0.9]) {
    ctx.fillStyle = stone; ctx.fillRect(R(tx - tw), R(tt), R(tw), R(y - tt));
    ctx.fillStyle = shadow; ctx.fillRect(R(tx), R(tt), R(tw), R(y - tt));
    ctx.fillStyle = coping; ctx.fillRect(R(tx - tw * 1.15), R(tt + u * 0.82), R(tw * 2.3), px(u * 0.07));
    const bw = tw * 0.62, b0 = tt + u * 0.16, b1 = tt + u * 0.74;
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(tx - bw, b1); ctx.lineTo(tx - bw, b0 + bw); ctx.arc(tx, b0 + bw, bw, Math.PI, 0); ctx.lineTo(tx + bw, b1); ctx.closePath(); ctx.fill();
    const bh = u * 0.24, bt = b0 + bw * 0.9;
    ctx.fillStyle = bronze; ctx.beginPath(); ctx.moveTo(tx - bw * 0.3, bt); ctx.lineTo(tx + bw * 0.3, bt); ctx.lineTo(tx + bw * 0.62, bt + bh); ctx.lineTo(tx - bw * 0.62, bt + bh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark; ctx.fillRect(R(tx - tw * 0.04), R(tt + u * 1.3), px(u * 0.05), px(u * 0.22));
    tri(tx - tw * 1.25, tt, tx, tt - cap, tx, tt, slate);
    tri(tx, tt, tx, tt - cap, tx + tw * 1.25, tt, slateShadow);
    if (snowy) { ctx.fillStyle = white; ctx.fillRect(R(tx - tw * 1.25), R(tt - u * 0.05), R(tw * 2.5), px(u * 0.06)); }
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, u * 0.03); ctx.beginPath(); ctx.moveTo(tx, tt - cap); ctx.lineTo(tx, tt - cap - u * 0.3); ctx.stroke();
  }
}

// ---- The landmarks of #1096 ------------------------------------------------------------------------
// The tall sites the world map charts, each kind a drawing drawn as the lighthouse and the monastery are:
// front-facing on its foot at y, in squares' half widths u, flat colour lit from the left, `tone`
// darkening it by night and in murk as theirs, snow white along its tops once it lies, and wider than
// its square, as it is seen from far off (view/landmarks.ts says how far, and what nearer land hides).
// Nothing in them moves: smoke leans with the wind the scene is painted in, and a fire shows by the
// night's glow.

/**
 * How a landmark of #1096 is drawn: its tone; the snow lying (0 .. 1); the wind across the view, toward
 * the right hand (-1 .. 1), which its smoke leans with; the night's glow on its fires and from under its
 * smoke (0 by day .. 1 by night); and, for a volcano seen on the skyline, the colour the horizon paints its
 * rock there, so the cone and its range read as one (its own when absent).
 */
interface LandmarkLook { tone: number; snow: number; wind: number; glow: number; rock?: string }

/** A polygon of points [x, y, x, y, …], filled flat. */
function fillPts(ctx: CanvasRenderingContext2D, pts: readonly number[], c: string): void {
  ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath(); ctx.fill();
}

/** A block from (x0, y0) to (x1, y1) on whole pixels, never less than one across. */
function slab(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, c: string): void {
  const a = Math.round(x0), b = Math.round(y0);
  ctx.fillStyle = c; ctx.fillRect(a, b, Math.max(1, Math.round(x1) - a), Math.max(1, Math.round(y1) - b));
}

/** A block `w` either side of x from y0 down to y1, lit on its left and in shade on its right. */
function litSlab(ctx: CanvasRenderingContext2D, x: number, w: number, y0: number, y1: number, lit: string, dim: string): void {
  slab(ctx, x - w, y0, x, y1, lit); slab(ctx, x, y0, x + w, y1, dim);
}

/** `n` merlons along a wall's top from x0 to x1, standing `h` on y, and snow `s` deep on each where it lies. */
function merlons(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, h: number, n: number, c: string, snow: string | null, s: number): void {
  const step = (x1 - x0) / (2 * n - 1);
  for (let i = 0; i < n; i++) {
    slab(ctx, x0 + 2 * i * step, y - h, x0 + (2 * i + 1) * step, y, c);
    if (snow) slab(ctx, x0 + 2 * i * step, y - h - s, x0 + (2 * i + 1) * step, y - h, snow);
  }
}

/**
 * Smoke going up from (x, y): `n` puffs over `rise`, each wider than the one under it and thinner at the
 * top, leaning off with the wind and lit `fire`'s red from under by the night's glow. A quiet plume:
 * painted with the scene, so it stands still.
 */
function smoke(ctx: CanvasRenderingContext2D, x: number, y: number, r0: number, rise: number, n: number, o: LandmarkLook, fire: string): void {
  const grey = shade('#8e8882', Math.max(o.tone, 0.4)), pale = shade('#bdb7ae', Math.max(o.tone, 0.4));
  for (let k = n - 1; k >= 0; k--) {
    const t = k / (n - 1), r = r0 * (1 + 0.9 * t), px = x + o.wind * rise * 0.9 * t * t, py = y - rise * t;
    ctx.globalAlpha = 1 - 0.5 * t * t;
    ctx.fillStyle = mix(grey, fire, o.glow * 0.7 * (1 - t)); ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = mix(pale, fire, o.glow * 0.5 * (1 - t)); ctx.beginPath(); ctx.arc(px - r * 0.25, py - r * 0.3, r * 0.55, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** A volcano's cone over its foot, in squares' half widths: its lip, where its plume goes up off its mouth. */
export const VOLCANO_LIP = 2;

/**
 * A volcano standing over the land: its cone, broad at the foot and cut off at its lip, the lip notched
 * where its mouth is, ash run pale down from it and thin snow under it once snow lies; the fire in the
 * mouth dull by day and bright by night, and the plume going up off it, leaning with the wind and lit red
 * from under by night.
 */
function drawGreatVolcanoSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const rock = o.rock ?? shade('#48302c', o.tone), dim = shade(rock, 0.8), ash = mix(rock, shade('#a49a90', o.tone), 0.3);
  const P = (f: number, t: number): number[] => [x + f * u, y - t * u], L = VOLCANO_LIP;
  fillPts(ctx, [...P(-2.4, 0), ...P(-1.35, L * 0.48), ...P(-0.8, L * 0.8), ...P(-0.52, L), ...P(-0.24, L * 0.985), ...P(-0.12, L * 0.94), ...P(0, L * 0.94), ...P(0, 0)], rock);
  fillPts(ctx, [...P(0, 0), ...P(0, L * 0.94), ...P(0.13, L * 0.94), ...P(0.25, L * 0.99), ...P(0.52, L), ...P(0.8, L * 0.8), ...P(1.35, L * 0.48), ...P(2.4, 0)], dim);
  // The ash run down each flank from the lip, paler on the lit one.
  for (const [f0, f1, t1] of [[-0.38, -1.05, 0.42], [-0.12, -0.32, 0.55], [0.3, 0.92, 0.4]]) fillPts(ctx, [...P(f0 - 0.05, L * 0.97), ...P(f0 + 0.05, L * 0.97), ...P(f1 + 0.04, L * t1), ...P(f1 - 0.04, L * t1)], f0 < 0 ? ash : shade(ash, 0.82));
  // Snow under the lip on either side of the mouth, deeper as it lies deeper; never in the mouth.
  if (o.snow > 0.05) {
    const d = L * (0.07 + 0.1 * Math.min(1, o.snow)), white = shade(SNOW_WHITE, o.tone);
    fillPts(ctx, [...P(-0.52, L), ...P(-0.24, L * 0.985), ...P(-0.2, L - d), ...P(-0.42, L - d * 1.4), ...P(-0.62, L - d * 0.8)], white);
    fillPts(ctx, [...P(0.52, L), ...P(0.25, L * 0.99), ...P(0.21, L - d * 1.2), ...P(0.44, L - d), ...P(0.63, L - d * 1.3)], white);
  }
  // The fire in the mouth, then the plume off it.
  slab(ctx, x - 0.12 * u, y - L * 0.985 * u, x + 0.13 * u, y - L * 0.94 * u, mix('#7a2a14', '#ffb040', o.glow));
  smoke(ctx, x, y - L * 0.97 * u, u * 0.24, u * 2.2, 6, o, '#c0583a');
}

/**
 * A walled city: its curtain wall with a gate under the gatehouse and merlons along the top, a round
 * tower at each end under a slate cone, the roofs of its houses over the wall, a church's spire and its
 * keep standing over it all, a turret at each corner. Snow lies along the tops.
 */
function drawCitySprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const stone = shade('#b4ab9a', o.tone), dim = shade('#878071', o.tone), coping = shade('#625c52', o.tone), dark = shade('#221e1a', o.tone);
  const slate = shade('#555660', o.tone), slateDim = shade('#393a42', o.tone), tile = shade('#94503a', o.tone), tileDim = shade('#6a3828', o.tone);
  const white = o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : null, s = Math.max(1, u * 0.06);
  const cap = (cx: number, foot: number, w: number, h: number): void => { fillPts(ctx, [cx - w, foot, cx, foot - h, cx, foot], slate); fillPts(ctx, [cx, foot, cx, foot - h, cx + w, foot], slateDim); };
  // The church's spire behind on the left, and the keep in the middle: its windows, battlements and turrets.
  litSlab(ctx, x - 1.15 * u, 0.13 * u, y - 2.5 * u, y, stone, dim); cap(x - 1.15 * u, y - 2.5 * u, 0.18 * u, 0.9 * u);
  const kw = 0.68 * u, kt = y - 3.3 * u;
  litSlab(ctx, x, kw, kt, y, stone, dim);
  slab(ctx, x - kw, kt, x + kw, kt + s, coping);
  for (const [f, t] of [[-0.3, 2.6], [0.3, 2.6], [-0.3, 1.9]]) slab(ctx, x + f * u - 0.04 * u, y - t * u, x + f * u + 0.04 * u, y - (t - 0.24) * u, dark);
  merlons(ctx, x - kw, x + kw, kt, 0.2 * u, 4, stone, white, s);
  for (const tx of [x - kw, x + kw]) { litSlab(ctx, tx, 0.15 * u, kt - 0.45 * u, kt + 0.3 * u, stone, dim); cap(tx, kt - 0.45 * u, 0.2 * u, 0.4 * u); }
  // The houses' roofs over the wall between the keep and the towers.
  for (const [f, h, w] of [[-1.75, 1.75, 0.32], [-0.95, 1.95, 0.36], [0.95, 1.85, 0.34], [1.65, 1.7, 0.3]]) {
    fillPts(ctx, [x + (f - w) * u, y - 1.2 * u, x + f * u, y - h * u, x + f * u, y - 1.2 * u], tile);
    fillPts(ctx, [x + f * u, y - 1.2 * u, x + f * u, y - h * u, x + (f + w) * u, y - 1.2 * u], tileDim);
  }
  // The curtain wall, its right-hand end in shade, its merlons and snow, the gatehouse over the gate.
  const ww = 2.3 * u, wt = y - 1.2 * u;
  slab(ctx, x - ww, wt, x + ww, y, stone); slab(ctx, x + ww * 0.72, wt, x + ww, y, dim);
  merlons(ctx, x - ww, x + ww, wt, 0.16 * u, 9, stone, white, s);
  slab(ctx, x - ww, wt, x + ww, wt + s, coping);
  litSlab(ctx, x, 0.36 * u, y - 1.6 * u, y, stone, dim);
  merlons(ctx, x - 0.36 * u, x + 0.36 * u, y - 1.6 * u, 0.16 * u, 3, stone, white, s);
  fillPts(ctx, [x - 0.17 * u, y, x - 0.17 * u, y - 0.45 * u, x, y - 0.62 * u, x + 0.17 * u, y - 0.45 * u, x + 0.17 * u, y], dark);
  for (const tx of [x - ww, x + ww]) { litSlab(ctx, tx, 0.3 * u, y - 1.75 * u, y, stone, dim); cap(tx, y - 1.75 * u, 0.38 * u, 0.6 * u); if (white) slab(ctx, tx - 0.38 * u, y - 1.75 * u - s, tx + 0.38 * u, y - 1.75 * u, white); }
}

/**
 * A ring of standing stones: the far side's smaller, higher on the ground and in shade, two of them under
 * a lintel; the near side's taller, each leaning a little and lit on its left. Snow caps their tops.
 */
function drawRingSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const stone = shade('#908e84', o.tone), dim = shade('#66645c', o.tone), far = shade('#727068', o.tone), farDim = shade('#52504a', o.tone);
  const white = o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : null, s = Math.max(1, u * 0.06);
  const stoneAt = (sx: number, foot: number, h: number, w: number, lean: number, c: string, d: string): void => {
    const top = foot - h;
    fillPts(ctx, [sx - w, foot, sx - w * 0.8 + lean, top, sx + lean, top - h * 0.04, sx, foot], c);
    fillPts(ctx, [sx, foot, sx + lean, top - h * 0.04, sx + w * 0.8 + lean, top, sx + w, foot], d);
    if (white) slab(ctx, sx - w * 0.8 + lean, top - s, sx + w * 0.8 + lean, top + s, white);
  };
  const back = y - 0.25 * u;
  for (const [f, h, l] of [[-1.3, 1.25, 0.03], [-0.5, 1.45, 0], [0.45, 1.45, 0], [1.25, 1.2, -0.04]]) stoneAt(x + f * u, back, h * u, 0.15 * u, l * u, far, farDim);
  slab(ctx, x - 0.66 * u, back - 1.6 * u, x + 0.62 * u, back - 1.43 * u, far);
  if (white) slab(ctx, x - 0.66 * u, back - 1.6 * u - s, x + 0.62 * u, back - 1.6 * u, white);
  for (const [f, h, l] of [[-1.75, 1.35, -0.04], [-0.95, 1.8, 0.02], [-0.05, 1.55, 0], [0.85, 1.75, -0.03], [1.65, 1.3, 0.05]]) stoneAt(x + f * u, y, h * u, 0.19 * u, l * u, stone, dim);
}

/**
 * A tower: a square shaft of stone narrowing a little as it goes up, a door at its foot, slits up it and
 * string courses round it, its parapet corbelled out over the top under three merlons. Snow lies on them.
 */
function drawTowerSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const stone = shade('#8e877a', o.tone), dim = shade('#686256', o.tone), coping = shade('#55504a', o.tone), dark = shade('#221e1a', o.tone);
  const white = o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : null, s = Math.max(1, u * 0.06);
  const wb = 0.5 * u, wt = 0.42 * u, top = y - 4.3 * u, half = (t: number): number => wb + (wt - wb) * t;
  fillPts(ctx, [x - wb, y, x - wt, top, x, top, x, y], stone);
  fillPts(ctx, [x, y, x, top, x + wt, top, x + wb, y], dim);
  for (const t of [0.36, 0.68]) slab(ctx, x - half(t), y - (y - top) * t, x + half(t), y - (y - top) * t + s, coping);
  fillPts(ctx, [x - 0.12 * u, y, x - 0.12 * u, y - 0.42 * u, x, y - 0.55 * u, x + 0.12 * u, y - 0.42 * u, x + 0.12 * u, y], dark);
  for (const [f, t] of [[-0.18, 0.47], [0.14, 0.58], [-0.12, 0.82]]) slab(ctx, x + f * u - 0.035 * u, y - (y - top) * t, x + f * u + 0.035 * u, y - (y - top) * t + 0.24 * u, dark);
  const pw = wt + 0.08 * u, ph = 0.32 * u;
  litSlab(ctx, x, pw, top - ph, top, stone, dim);
  slab(ctx, x - pw, top - s, x + pw, top + s, coping);
  merlons(ctx, x - pw, x + pw, top - ph, 0.22 * u, 3, stone, white, s);
}

/**
 * A great tree: a broad trunk flared at its roots, two limbs going up into a crown far wider than any
 * tree's, dark and evergreen the year round, lit on its upper left and deep in shade under its right.
 * Snow lies on the crown's top.
 */
function drawGreatTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const bark = shade('#4c3e30', o.tone), barkDim = shade('#33291f', o.tone), leaf = shade('#2e5a34', o.tone), lit = shade('#3f7240', o.tone), deep = shade('#21422a', o.tone);
  const white = o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : null;
  fillPts(ctx, [x - 0.62 * u, y, x - 0.36 * u, y - 0.35 * u, x - 0.3 * u, y - 2.7 * u, x, y - 2.7 * u, x, y], bark);
  fillPts(ctx, [x, y, x, y - 2.7 * u, x + 0.28 * u, y - 2.7 * u, x + 0.34 * u, y - 0.35 * u, x + 0.6 * u, y], barkDim);
  fillPts(ctx, [x - 0.28 * u, y - 2.1 * u, x - 1.3 * u, y - 3.2 * u, x - 1.2 * u, y - 3.4 * u, x - 0.15 * u, y - 2.5 * u], bark);
  fillPts(ctx, [x + 0.22 * u, y - 2.3 * u, x + 1.25 * u, y - 3.4 * u, x + 1.15 * u, y - 3.6 * u, x + 0.1 * u, y - 2.7 * u], barkDim);
  for (const [f, t, r, c] of [[-1.45, 3.4, 0.85, deep], [1.45, 3.5, 0.85, deep], [0, 3.3, 1, deep], [-0.95, 4.3, 0.95, leaf], [0.95, 4.35, 0.95, leaf], [0, 4.9, 1.05, leaf], [-1.35, 4.2, 0.5, lit], [-0.55, 5.2, 0.62, lit], [0.35, 5.45, 0.45, lit]] as const) {
    const bx = x + f * u, by = y - t * u, br = r * u;
    if (white && t > 4) { ctx.fillStyle = white; ctx.beginPath(); ctx.arc(bx, by - br * 0.2, br, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
  }
}

/**
 * Chimney stacks over the works they draw for: three of brick, each taller than the last is short, under
 * a dark cap and its smoke leaning with the wind; the long low works under its roof, its furnaces' mouths
 * dull red by day and bright by night, which light the smoke from under. Snow lies along the roof.
 */
function drawStacksSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const brick = shade('#7e4838', o.tone), brickDim = shade('#5a3124', o.tone), wall = shade('#5e4c42', o.tone), wallDim = shade('#44362e', o.tone);
  const roof = shade('#3c3a3c', o.tone), dark = shade('#1e1a18', o.tone), white = o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : null;
  const stacks = [[-1.0, 4.2, 0.17], [0.2, 5.0, 0.2], [1.1, 3.6, 0.15]];
  for (const [f, h, w] of stacks) {
    const sx = x + f * u, top = y - h * u;
    fillPts(ctx, [sx - w * u, y - u, sx - w * 0.8 * u, top, sx, top, sx, y - u], brick);
    fillPts(ctx, [sx, y - u, sx, top, sx + w * 0.8 * u, top, sx + w * u, y - u], brickDim);
    slab(ctx, sx - w * u, top, sx + w * u, top + 0.14 * u, dark);
  }
  slab(ctx, x - 1.7 * u, y - u, x + 1.7 * u, y, wall); slab(ctx, x + 1.2 * u, y - u, x + 1.7 * u, y, wallDim);
  fillPts(ctx, [x - 1.8 * u, y - u, x - 1.45 * u, y - 1.4 * u, x + 1.45 * u, y - 1.4 * u, x + 1.8 * u, y - u], roof);
  if (white) slab(ctx, x - 1.45 * u, y - 1.4 * u - Math.max(1, u * 0.06), x + 1.45 * u, y - 1.4 * u, white);
  for (const f of [-1.2, -0.4, 0.4, 1.2]) slab(ctx, x + (f - 0.14) * u, y - 0.42 * u, x + (f + 0.14) * u, y, mix('#4a1e12', '#e07a32', o.glow));
  for (const [f, h, w] of stacks) smoke(ctx, x + f * u, y - (h + 0.12) * u, w * 1.1 * u, 1.3 * u, 4, o, '#d0683a');
}

/**
 * A fortress: a battered wall broad at its foot under heavy merlons, two square towers flanking its gate,
 * the great hall standing behind; the gate a deep square mouth under its lintel, its portcullis down,
 * dark by day and lit dim from within by night. Snow lies along the tops.
 */
function drawFortressSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const stone = shade('#776f64', o.tone), dim = shade('#575047', o.tone), coping = shade('#433d36', o.tone), dark = shade('#1c1916', o.tone);
  const white = o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : null, s = Math.max(1, u * 0.06);
  litSlab(ctx, x, 1.35 * u, y - 2.35 * u, y, stone, dim);
  merlons(ctx, x - 1.35 * u, x + 1.35 * u, y - 2.35 * u, 0.24 * u, 5, stone, white, s);
  fillPts(ctx, [x - 2.15 * u, y, x - 1.95 * u, y - 1.45 * u, x, y - 1.45 * u, x, y], stone);
  fillPts(ctx, [x, y, x, y - 1.45 * u, x + 1.95 * u, y - 1.45 * u, x + 2.15 * u, y], dim);
  merlons(ctx, x - 1.95 * u, x + 1.95 * u, y - 1.45 * u, 0.2 * u, 7, stone, white, s);
  for (const side of [-1, 1]) {
    const tx = x + side * 0.78 * u;
    fillPts(ctx, [tx - 0.46 * u, y, tx - 0.4 * u, y - 2.85 * u, tx, y - 2.85 * u, tx, y], stone);
    fillPts(ctx, [tx, y, tx, y - 2.85 * u, tx + 0.4 * u, y - 2.85 * u, tx + 0.46 * u, y], dim);
    merlons(ctx, tx - 0.4 * u, tx + 0.4 * u, y - 2.85 * u, 0.26 * u, 2, side < 0 ? stone : dim, white, s);
    slab(ctx, tx - 0.035 * u, y - 2.2 * u, tx + 0.035 * u, y - 1.9 * u, dark);
  }
  slab(ctx, x - 0.3 * u, y - 0.95 * u, x + 0.3 * u, y, mix(dark, '#a04a22', 0.5 * o.glow));
  for (const f of [-0.15, 0, 0.15]) slab(ctx, x + (f - 0.025) * u, y - 0.95 * u, x + (f + 0.025) * u, y, coping);
  slab(ctx, x - 0.3 * u, y - 0.6 * u, x + 0.3 * u, y - 0.56 * u, coping);
  slab(ctx, x - 0.38 * u, y - 1.08 * u, x + 0.38 * u, y - 0.95 * u, coping);
}

/**
 * Falls: a drop of dark rock, ragged along its top, ledged across, the water pouring over its lip in the
 * middle and falling the height of it, streaked; at its foot the spray, a cloud wider than the fall, and
 * mist hung over the drop. Snow lies along the rock's top; the water never takes it.
 */
function drawFallsSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const rock = shade('#5a5c52', o.tone), rockDim = shade('#43453d', o.tone), ledge = shade('#33352f', o.tone);
  const water = shade('#d2e0e6', o.tone), streak = shade('#9cb2be', o.tone), spray = shade('#e6eef0', o.tone), mist = shade('#c4d2d8', o.tone);
  const P = (f: number, t: number): number[] => [x + f * u, y - t * u];
  const left: [number, number][] = [[-1.55, 0], [-1.5, 2.7], [-1.1, 3.0], [-0.6, 2.85], [-0.35, 3.05], [0, 3.05]], right: [number, number][] = [[0, 3.05], [0.35, 3.05], [0.7, 2.9], [1.15, 3.1], [1.5, 2.75], [1.55, 0]];
  fillPts(ctx, [...left.flatMap(([f, t]) => P(f, t)), ...P(0, 0)], rock);
  fillPts(ctx, [...P(0, 0), ...right.flatMap(([f, t]) => P(f, t))], rockDim);
  if (o.snow > 0.2) { const d = 0.08 + 0.1 * Math.min(1, o.snow); fillPts(ctx, [...[...left, ...right.slice(1)].slice(1, -1).flatMap(([f, t]) => P(f, t)), ...[...left, ...right.slice(1)].slice(1, -1).reverse().flatMap(([f, t]) => P(f * 0.98, t - d))], shade(SNOW_WHITE, o.tone)); }
  for (const [f0, f1, t] of [[-1.4, -0.45, 2.0], [0.45, 1.35, 1.3], [-1.3, -0.5, 0.9]]) slab(ctx, x + f0 * u, y - t * u, x + f1 * u, y - (t - 0.07) * u, ledge);
  fillPts(ctx, [...P(-0.3, 3.05), ...P(0.3, 3.05), ...P(0.42, 0.4), ...P(-0.42, 0.4)], water);
  for (const f of [-0.18, 0.05, 0.22]) slab(ctx, x + (f - 0.025) * u, y - 2.9 * u, x + (f + 0.025) * u, y - 0.6 * u, streak);
  for (const [f, t, r] of [[-0.75, 0.35, 0.42], [0.75, 0.38, 0.4], [-0.35, 0.55, 0.5], [0.35, 0.6, 0.5], [0, 0.45, 0.55]]) { ctx.fillStyle = spray; ctx.beginPath(); ctx.arc(x + f * u, y - t * u, r * u, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 0.7;
  for (const [f, t, r] of [[-0.55, 1.5, 0.35], [0.5, 1.9, 0.3]]) { ctx.fillStyle = mist; ctx.beginPath(); ctx.arc(x + f * u, y - t * u, r * u, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
}

/**
 * A wreck: a ship aground and listing, her bow raised to the left, a strake along her and a gash in her
 * side; her masts leaning with her, the main standing whole with a yard across it and another hanging,
 * a rag of sail on it, the fore broken off and the mizzen short, her rigging run down to bow and stern.
 * Snow lies along her rail.
 */
function drawWreckSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook): void {
  const timber = shade('#4c3c2e', o.tone), timberDim = shade('#382c22', o.tone), spar = shade('#3a2e24', o.tone), rail = shade('#6a5644', o.tone), dark = shade('#1a1612', o.tone), sail = shade('#b4aa92', o.tone);
  const P = (f: number, t: number): number[] => [x + f * u, y - t * u];
  fillPts(ctx, [...P(-2.05, 1.15), ...P(1.75, 0.85), ...P(1.55, 0), ...P(-1.35, 0)], timber);
  fillPts(ctx, [...P(-1.72, 0.45), ...P(1.63, 0.4), ...P(1.55, 0), ...P(-1.35, 0)], timberDim);
  fillPts(ctx, [...P(-2.05, 1.15), ...P(1.75, 0.85), ...P(1.74, 0.77), ...P(-2.0, 1.07)], o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : rail);
  fillPts(ctx, [...P(0.3, 0.75), ...P(0.75, 0.6), ...P(0.6, 0.25), ...P(0.25, 0.4)], dark);
  const mast = (f: number, t: number, len: number, w: number): [number, number] => {
    const lean = 0.12 * len;
    fillPts(ctx, [...P(f - w, t), ...P(f + lean - w * 0.7, t + len), ...P(f + lean + w * 0.7, t + len), ...P(f + w, t)], spar);
    return [f + lean, t + len];
  };
  const [mx, mt] = mast(0.1, 1.0, 3.3, 0.09), [fx, ft] = mast(-1.15, 1.08, 1.7, 0.08), [zx, zt] = mast(1.15, 0.92, 2.0, 0.07);
  fillPts(ctx, [...P(fx - 0.1, ft), ...P(fx + 0.02, ft + 0.22), ...P(fx + 0.1, ft)], spar);
  fillPts(ctx, [...P(mx - 0.8, mt - 0.95), ...P(mx + 0.62, mt - 0.82), ...P(mx + 0.62, mt - 0.9), ...P(mx - 0.8, mt - 1.03)], spar);
  fillPts(ctx, [...P(mx - 0.4, mt - 1.55), ...P(mx + 0.55, mt - 2.05), ...P(mx + 0.58, mt - 1.98), ...P(mx - 0.37, mt - 1.48)], spar);
  fillPts(ctx, [...P(mx - 0.72, mt - 0.99), ...P(mx - 0.2, mt - 0.95), ...P(mx - 0.3, mt - 1.65), ...P(mx - 0.66, mt - 1.5)], sail);
  ctx.save();
  ctx.strokeStyle = spar; ctx.lineWidth = Math.max(1, u * 0.03);
  for (const [a, b] of [[P(mx, mt), P(-2.05, 1.15)], [P(mx, mt), P(1.75, 0.85)], [P(zx, zt), P(1.75, 0.85)]]) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  ctx.restore();
}

/** Each landmark's drawing, by its kind: the lighthouse's lamp is the compositor's to light. */
export const LANDMARK_SPRITES: Readonly<Record<Landmark['kind'], (ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: LandmarkLook) => void>> = {
  lighthouse: (ctx, x, y, u, o) => { drawLighthouseSprite(ctx, x, y, u, o.tone, 0, o.snow); },
  monastery: (ctx, x, y, u, o) => drawMonasterySprite(ctx, x, y, u, o.tone, o.snow),
  volcano: drawGreatVolcanoSprite, city: drawCitySprite, ring: drawRingSprite, tower: drawTowerSprite, tree: drawGreatTreeSprite,
  stacks: drawStacksSprite, fortress: drawFortressSprite, falls: drawFallsSprite, wreck: drawWreckSprite,
};

/**
 * How tall each landmark's drawing stands over its foot, in squares' half widths, to its topmost pixel but
 * a smoke's: what its reach is reckoned from (view/landmarks.ts). The lighthouse's to its finial.
 */
export const LANDMARK_HEIGHT: Readonly<Record<Landmark['kind'], number>> = {
  lighthouse: LIGHTHOUSE_HEIGHT + 1.16, monastery: 4.9, volcano: VOLCANO_LIP, city: 4.15, ring: 1.87, tower: 4.84, tree: 5.95,
  stacks: 5, fortress: 3.11, falls: 3.1, wreck: 4.3,
};

// ---- The wilderness features (#1110) --------------------------------------------------------------
// What the view draws for a feature on its square (view/features.ts says which, and where): each kind
// its own small drawing, of a shape no scattered prop is (a single rounded rock, a bush, a tussock,
// bones, driftwood), and lower than a man but a statue and a rift. Front-facing on (x, y) with y the
// ground line, as the sprites here; `tone` darkens with distance and the night as a rock's does, snow
// whitens what lies open to the sky and a light of its own (`light`) the night does not dim.

/** The kinds of feature the view draws; a person, a business (its sign hangs over its door) and an event are none of them. */
export const FEATURE_KINDS = ['cairn', 'chest', 'camp', 'shrine', 'well', 'statue', 'fountain', 'den', 'sign', 'rift'] as const;
export type FeatureKind = (typeof FEATURE_KINDS)[number];
/**
 * How a feature is drawn: its tone; the tone of a light of its own (a rift's, a fire's embers), which
 * murk fades and the night does not; the snow lying (0 .. 1); whether a camp's fire is lit and a den
 * burnt to its ruin; and its square's variant (0 .. 1).
 */
interface FeatureLook { tone: number; light: number; snow: number; lit: boolean; ruin: boolean; vary: number }
/** Where a camp's lit fire burns: its flame is drawn every frame over the scene, as a torch's. */
interface Fire { x: number; y: number; s: number }

/** An outlined, cel-shaded box from its top left. */
const box = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string, sh = 0.3, hi = 0.22): void => celPoly(ctx, B, [x, y + h, x, y, x + w, y, x + w, y + h], c, sh, hi);
/** The points of an ellipse about (x, y), for an outlined oval. */
const oval = (x: number, y: number, rx: number, ry: number, n = 16): number[] => Array.from({ length: n }, (_, k) => [x + Math.cos((k / n) * Math.PI * 2) * rx, y + Math.sin((k / n) * Math.PI * 2) * ry]).flat();
/** A flat mark in whole pixels, at least one each way: a band, a hasp, a line of writing, a cap of snow. */
const mark = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string): void => {
  ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
};
/** A flat ellipse with no outline: the ash under a fire, its light on the ground, the dark of a shaft. */
const pool = (ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, c: string): void => {
  ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
};
const snowOn = (o: FeatureLook): string | null => (o.snow > 0.2 ? shade(SNOW_WHITE, o.tone) : null);

/** A cairn: three to five flat stones stacked, each narrower than the one under it, a darker cap on top; snow on their shoulders. */
function drawCairn(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const n = 3 + Math.floor(o.vary * 2.99), white = snowOn(o);
  let base = y, w = u * 0.66;
  for (let i = 0; i < n; i++) {
    const h = u * (0.2 - 0.015 * i), top = base - h, sx = x + u * 0.045 * (((i + Math.floor(o.vary * 5)) % 3) - 1);
    const c = shade(i === n - 1 ? '#5e5a52' : ['#9c968a', '#8a857a', '#a6a094'][i % 3], o.tone);
    celPoly(ctx, B, [sx - w / 2, base, sx - w * 0.46, top + h * 0.35, sx - w * 0.3, top, sx + w * 0.32, top, sx + w * 0.47, top + h * 0.3, sx + w / 2, base], c, 0.35, 0.25);
    if (white) celPoly(ctx, B, [sx - w * 0.44, top + h * 0.3, sx - w * 0.3, top, sx + w * 0.32, top, sx + w * 0.45, top + h * 0.28], white, 0.15, 0.15);
    base = top + h * 0.15; w *= 0.76;
  }
}

/** A chest: a box of planks under a rounded lid, iron bands over both at either end and a brass hasp; snow on the lid. */
function drawChest(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const w = u * 0.62, hb = u * 0.27, hl = u * 0.15, lw = w + u * 0.05, top = y - hb - hl, white = snowOn(o);
  box(ctx, x - w / 2, y - hb, w, hb, shade('#86562a', o.tone));
  celPoly(ctx, B, [x - lw / 2, y - hb, x - lw / 2, top + hl * 0.45, x - lw * 0.36, top, x + lw * 0.36, top, x + lw / 2, top + hl * 0.45, x + lw / 2, y - hb], shade('#a06a34', o.tone), 0.3, 0.25);
  for (const f of [-0.3, 0.3]) mark(ctx, x + f * w - u * 0.03, top + u * 0.02, u * 0.06, hb + hl - u * 0.02, shade('#36322f', o.tone));
  mark(ctx, x - u * 0.045, y - hb - u * 0.05, u * 0.09, u * 0.12, shade('#e4b44c', o.tone));
  if (white) mark(ctx, x - lw * 0.36, top, lw * 0.72, u * 0.045, white);
}

/**
 * A camp: a ring of stones round a fire laid on its ash, its sticks stood together in a cone, charred at
 * their tops. Lit, its embers glow, a pool of its light lies on the ground about it and it gives where
 * the fire burns, for its flame.
 */
function drawCamp(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): Fire | null {
  const rx = u * 0.42, ry = u * 0.12, cy = y - ry * 0.3, white = snowOn(o), N = 9;
  if (o.lit) { pool(ctx, x, cy, u * 0.95, u * 0.26, rgba('#ffb45a', 0.14 * o.light)); pool(ctx, x, cy, u * 0.6, u * 0.17, rgba('#ffc070', 0.18 * o.light)); }
  const at = (k: number): number => (k / N) * Math.PI * 2 + 0.35;
  const stone = (k: number): void => {
    const sx = x + Math.cos(at(k)) * rx, sy = cy + Math.sin(at(k)) * ry, sw = u * 0.15, sh = u * 0.09;
    celPoly(ctx, B, [sx - sw / 2, sy, sx - sw * 0.4, sy - sh, sx + sw * 0.4, sy - sh, sx + sw / 2, sy], shade(k % 2 ? '#8e897e' : '#77736a', o.tone), 0.3, 0.3);
    if (white) mark(ctx, sx - sw * 0.38, sy - sh, sw * 0.76, u * 0.03, white);
  };
  // The far side of the ring, the ash and the sticks on it, then the near side over them.
  for (let k = 0; k < N; k++) if (Math.sin(at(k)) < 0) stone(k);
  pool(ctx, x, cy, rx * 0.66, ry * 0.7, o.lit ? shade('#a8441c', o.light) : shade('#5e5a56', o.tone));
  const wood = shade('#5a3c26', o.tone), char = shade('#221c1a', o.tone), lw = Math.max(1, u * 0.06), apex = cy - u * 0.3;
  for (const [f, g] of [[-0.6, -0.08], [0.6, 0.08], [-0.12, 0.02]]) {
    const fx = x + f * rx, fy = cy + (f === -0.12 ? ry * 0.4 : 0), tx = x + g * u, mx = fx + (tx - fx) * 0.6, my = fy + (apex - fy) * 0.6;
    stroke(ctx, [fx, fy, mx, my], wood, lw);
    stroke(ctx, [mx, my, tx, apex], char, lw);
  }
  if (o.lit) for (const f of [-0.3, 0.05, 0.32]) mark(ctx, x + f * rx, cy - ry * (0.2 + 0.3 * Math.abs(f)), u * 0.05, u * 0.03, shade('#ffc050', o.light));
  for (let k = 0; k < N; k++) if (Math.sin(at(k)) >= 0) stone(k);
  return o.lit ? { x, y: cy - ry * 0.2, s: Math.max(2, u * 0.1) } : null;
}

/** A shrine: a small stone on a step under a gable of slate, an offering's glint in the dark of its niche; snow on its roof and step. */
function drawShrine(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const w = u * 0.38, h = u * 0.56, st = u * 0.08, foot = y - st, top = foot - h, white = snowOn(o);
  box(ctx, x - w * 0.7, foot, w * 1.4, st, shade('#8a8478', o.tone));
  box(ctx, x - w / 2, top, w, h, shade('#b4ac9c', o.tone), 0.32, 0.25);
  const nr = w * 0.24, nb = foot - h * 0.18, nt = top + h * 0.22;
  ctx.fillStyle = shade('#1e181c', o.tone);
  ctx.beginPath(); ctx.moveTo(x - nr, nb); ctx.lineTo(x - nr, nt + nr); ctx.arc(x, nt + nr, nr, Math.PI, 0); ctx.lineTo(x + nr, nb); ctx.closePath(); ctx.fill();
  mark(ctx, x - u * 0.03, nb - u * 0.07, u * 0.06, u * 0.06, shade('#e8c860', o.tone));
  const rw = w * 0.82, eave = top + u * 0.03, rt = top - u * 0.2;
  celPoly(ctx, B, [x - rw, eave, x, rt, x + rw, eave], shade('#5a5866', o.tone), 0.4, 0.25);
  if (white) {
    celPoly(ctx, B, [x - rw * 0.6, rt + (eave - rt) * 0.6, x, rt, x + rw * 0.6, rt + (eave - rt) * 0.6], white, 0.15, 0.15);
    mark(ctx, x - w * 0.7, foot, w * 1.4, u * 0.03, white);
  }
}

/** A well: a round wall of coursed stone about the shaft's dark, two posts on it and the winch across them, its crank, rope and bucket; snow on the lip and the beam. */
function drawWell(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const w = u * 0.78, h = u * 0.28, lip = u * 0.13, wt = y - h, px = w * 0.42, top = wt - u * 0.6, white = snowOn(o);
  for (const s of [-1, 1]) box(ctx, x + s * px - u * 0.035, top, u * 0.07, wt - top + lip * 0.3, shade('#6a4a2c', o.tone));
  box(ctx, x - w / 2, wt, w, h, shade('#8c877c', o.tone));
  const joint = shade('#625e56', o.tone);
  mark(ctx, x - w / 2 + 1, wt + h * 0.5, w - 2, 1, joint);
  for (const f of [-0.25, 0.15, 0.38]) mark(ctx, x + f * w, wt + (f > 0 ? 1 : h * 0.5), 1, h * 0.5 - 1, joint);
  celPoly(ctx, B, oval(x, wt, w / 2, lip / 2), white ?? shade('#a8a294', o.tone), 0.2, 0.2);
  pool(ctx, x, wt, w * 0.38, lip * 0.28, shade('#121418', o.tone));
  const by = top + u * 0.07;
  box(ctx, x - px - u * 0.05, by - u * 0.035, px * 2 + u * 0.1, u * 0.07, shade('#7a5634', o.tone));
  if (white) mark(ctx, x - px - u * 0.05, by - u * 0.035, px * 2 + u * 0.1, u * 0.025, white);
  stroke(ctx, [x + px + u * 0.05, by, x + px + u * 0.13, by, x + px + u * 0.13, by + u * 0.1], shade('#3a3632', o.tone), Math.max(1, u * 0.03));
  mark(ctx, x - u * 0.01, by + u * 0.035, u * 0.02, u * 0.2, shade('#c8b080', o.tone));
  box(ctx, x - u * 0.07, by + u * 0.235, u * 0.14, u * 0.11, shade('#5a4030', o.tone));
}

/** A statue on its plinth: a robed figure of pale stone, one arm raised (a variant's held across it), over a darker plinth and its cornice; snow on the cornice, shoulders and head. */
function drawStatue(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const pw = u * 0.5, ph = u * 0.28, ch = u * 0.06, fb = y - ph - ch, sh = fb - u * 0.53, white = snowOn(o), stone = shade('#bcb6a8', o.tone);
  box(ctx, x - pw / 2, y - ph, pw, ph, shade('#858074', o.tone));
  box(ctx, x - pw * 0.58, fb, pw * 1.16, ch, shade('#a19b8e', o.tone));
  const raised = o.vary > 0.5;
  if (raised) celCapsule(ctx, B, x + u * 0.1, sh + u * 0.04, x + u * 0.2, sh - u * 0.2, u * 0.035, stone, 0.2);
  celPoly(ctx, B, [x - u * 0.15, fb, x - u * 0.1, sh, x + u * 0.1, sh, x + u * 0.15, fb], stone, 0.35, 0.25);
  if (!raised) celCapsule(ctx, B, x + u * 0.09, sh + u * 0.05, x - u * 0.04, sh + u * 0.2, u * 0.035, shade(stone, 0.92), 0.2);
  celBall(ctx, B, x, sh - u * 0.085, u * 0.08, stone);
  if (white) {
    mark(ctx, x - pw * 0.58, fb, pw * 1.16, u * 0.03, white);
    mark(ctx, x - u * 0.1, sh, u * 0.2, u * 0.025, white);
    mark(ctx, x - u * 0.05, sh - u * 0.165, u * 0.1, u * 0.03, white);
  }
}

/** A fountain: a low basin of dressed stone full to its lip, a spout behind it with water falling from it; frozen and its lip white under snow. */
function drawFountain(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const w = u * 0.9, h = u * 0.2, lip = u * 0.15, bt = y - h, white = snowOn(o), frozen = o.snow > 0.5, stone = shade('#a39b8b', o.tone);
  box(ctx, x - u * 0.06, bt - u * 0.36, u * 0.12, u * 0.36, stone);
  box(ctx, x - w / 2, bt, w, h, stone);
  celPoly(ctx, B, oval(x, bt, w / 2, lip / 2), white ?? shade('#bab2a2', o.tone), 0.2, 0.2);
  pool(ctx, x, bt, w * 0.41, lip * 0.3, shade(frozen ? '#c4d4e0' : '#4a80b4', o.tone));
  if (!frozen) stroke(ctx, [x + u * 0.04, bt - u * 0.3, x + u * 0.13, bt - u * 0.25, x + u * 0.16, bt - u * 0.02], shade('#a8d2f0', o.tone), Math.max(1, u * 0.04));
}

/** A den: a mound of earth with a dark mouth at its foot and sticks over it; burnt, a charred mound, its mouth fallen in and its stakes black. Snow on its crown. */
function drawDen(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const w = u * 1.05, h = u * 0.5, white = snowOn(o), black = shade('#0e0a08', o.tone), mr = u * 0.19;
  const pt = (f: number, t: number): number[] => [x + f * w, y - t * h];
  celPoly(ctx, B, [...pt(-0.5, 0), ...pt(-0.42, 0.55), ...pt(-0.24, 0.92), ...pt(0.02, 1), ...pt(0.24, 0.9), ...pt(0.41, 0.58), ...pt(0.5, 0)], shade(o.ruin ? '#3e3a36' : '#70522e', o.tone), 0.35, 0.22);
  if (white) celPoly(ctx, B, [...pt(-0.3, 0.8), ...pt(-0.24, 0.92), ...pt(0.02, 1), ...pt(0.24, 0.9), ...pt(0.3, 0.78)], white, 0.15, 0.15);
  if (o.ruin) {
    mark(ctx, x - mr, y - u * 0.06, mr * 2, u * 0.06, black);
    for (const [f, t] of [[-0.28, 0.6], [0.06, 0.95], [0.3, 0.55]]) stroke(ctx, [...pt(f, t * 0.8), ...pt(f + 0.06, t + 0.35)], black, Math.max(1, u * 0.04));
    return;
  }
  ctx.fillStyle = black;
  ctx.beginPath(); ctx.moveTo(x - mr, y); ctx.lineTo(x - mr, y - u * 0.13); ctx.arc(x, y - u * 0.13, mr, Math.PI, 0); ctx.lineTo(x + mr, y); ctx.closePath(); ctx.fill();
  for (const [f, t] of [[-0.3, 0.6], [0.1, 0.92], [0.32, 0.5]]) stroke(ctx, [...pt(f, t * 0.85), ...pt(f + 0.08, t + 0.3)], shade('#3a2a1c', o.tone), Math.max(1, u * 0.035));
}

/** A sign: a post with a board across its top lettered in two lines, a variant's pointed as a finger-post's; snow along the board. */
function drawSign(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const bw = u * 0.54, bh = u * 0.2, bt = y - u * 0.8, x0 = x - bw / 2, x1 = x + bw / 2, white = snowOn(o);
  box(ctx, x - u * 0.035, bt, u * 0.07, y - bt, shade('#664628', o.tone));
  celPoly(ctx, B, o.vary > 0.5 ? [x0, bt + bh, x0, bt, x1 - bh * 0.5, bt, x1, bt + bh / 2, x1 - bh * 0.5, bt + bh] : [x0, bt + bh, x0, bt, x1, bt, x1, bt + bh], shade('#a47c4a', o.tone), 0.3, 0.25);
  for (const [f, t] of [[0.62, 0.3], [0.46, 0.62]]) mark(ctx, x0 + bw * 0.12, bt + bh * t, bw * f, u * 0.025, shade('#3a2a1a', o.tone));
  if (white) mark(ctx, x0, bt, bw * 0.85, u * 0.03, white);
}

/** A rift: a tear in the air standing a little off the ground, its jagged lips a cold green light and its heart white; a light of its own. */
function drawRift(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook): void {
  const top = y - u * 1.3, H = u * 1.18, zig = [0, 0.14, 0.3, 0.48, 0.64, 0.82, 1], lean = [0, 0.05, -0.04, 0.06, -0.05, 0.03, 0];
  const lips = (k: number): number[] => {
    const left: number[] = [], right: number[] = [];
    zig.forEach((f, i) => {
      const half = Math.sin(Math.PI * f) * u * 0.17 * k * (i % 2 ? 1.2 : 0.8), cx = x + lean[i] * u, cy = top + f * H;
      left.push(cx - half, cy); right.unshift(cx + half * 0.9, cy);
    });
    return [...left, ...right];
  };
  celPoly(ctx, B, lips(1), shade('#3cc08c', o.light), 0.15, 0.3);
  ctx.fillStyle = shade('#eafff4', o.light); ctx.beginPath();
  const inner = lips(0.42);
  ctx.moveTo(inner[0], inner[1]);
  for (let i = 2; i < inner.length; i += 2) ctx.lineTo(inner[i], inner[i + 1]);
  ctx.closePath(); ctx.fill();
  for (const [dx, dy] of [[-0.3, 0.3], [0.28, 0.55], [-0.22, 0.8]]) mark(ctx, x + dx * u, top + dy * H, u * 0.04, u * 0.04, shade('#9cf0d0', o.light));
}

const FEATURE_DRAWINGS: Record<FeatureKind, (ctx: CanvasRenderingContext2D, x: number, y: number, u: number, o: FeatureLook) => Fire | null | void> = {
  cairn: drawCairn, chest: drawChest, camp: drawCamp, shrine: drawShrine, well: drawWell, statue: drawStatue, fountain: drawFountain, den: drawDen, sign: drawSign, rift: drawRift,
};

/** A feature of a kind the view draws, front-facing on (x, y) with y the ground line; a lit camp gives where its fire burns. */
export function drawFeatureSprite(ctx: CanvasRenderingContext2D, kind: FeatureKind, x: number, y: number, u: number, o: FeatureLook): Fire | null {
  return FEATURE_DRAWINGS[kind](ctx, x, y, u, o) ?? null;
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

/**
 * The volcano: a cone of black rock, broader than a mountain and cut off flat at its lip, with ash
 * run grey down its flanks. A vent (`vent`) is a mouth in it: its fire showing in the lip, `glow` of
 * the way to its brightest (by night), and its smoke going up. Snow lies thin under the lip, `snow`
 * of the way to its deepest, and never in the mouth.
 */
export function drawVolcanoSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, vent: boolean, glow: number, snow: number): void {
  const w = u * 2.8, h = u * (1.75 + variant * 0.15), c = shade('#48302c', tone);
  const pt = (t: number, f: number): number[] => [x + f * w, y - t * h];
  const left: [number, number][] = [[0, -0.5], [0.18, -0.36], [0.45, -0.24], [0.75, -0.155], [1, -0.11]];
  const right: [number, number][] = [[1, 0.1], [0.72, 0.15], [0.42, 0.23], [0.16, 0.35], [0, 0.5]];
  celPoly(ctx, B, [...left.flatMap(([t, f]) => pt(t, f)), ...pt(0.97, -0.04), ...pt(0.99, 0.03), ...right.flatMap(([t, f]) => pt(t, f))], c, 0.45, 0.25);
  // The ash run down the flanks from the lip, each streak inside the cone.
  const ash = shade('#746a64', tone), lw = Math.max(1, u * 0.06);
  for (const [f0, f1, t1] of [[-0.08, -0.2, 0.3], [0.02 + 0.02 * variant, 0.05, 0.12], [0.07, 0.22, 0.25]]) stroke(ctx, [...pt(0.96, f0), ...pt(0.6, (f0 * 2 + f1) / 3), ...pt(t1, f1)], ash, lw);
  if (snow > 0.05) {
    const line = 1 - 0.3 * Math.min(1, snow), at = (side: [number, number][], t: number): number => {
      for (let i = 0; i < side.length - 1; i++) { const [t0, g0] = side[i], [t1, g1] = side[i + 1]; if ((t - t0) * (t - t1) <= 0) return g0 + ((g1 - g0) * (t - t0)) / (t1 - t0); }
      return 0;
    };
    const fl = at(left, line), fr = at(right, line), cap = [...pt(line, fl), ...pt(1, -0.11), ...pt(0.97, -0.04), ...pt(0.99, 0.03), ...pt(1, 0.1), ...pt(line, fr)];
    for (let k = 1; k < 6; k++) cap.push(...pt(k % 2 ? line + 0.06 : line - 0.04 * (1 + ((k + variant) % 2)), fr + ((fl - fr) * k) / 6));
    celPoly(ctx, B, cap, shade(SNOW_WHITE, tone), 0.22, 0.15);
  }
  if (!vent) return;
  // The mouth: dark rock about a fire that is dull by day and bright by night, whatever the light.
  const [mx, my] = pt(0.99, 0), mw = w * 0.16, mh = Math.max(1.5, h * 0.05);
  ctx.fillStyle = shade('#2a1e1e', tone); ctx.beginPath(); ctx.ellipse(mx, my, mw, mh, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mix('#7a2a14', '#ffb040', glow); ctx.beginPath(); ctx.ellipse(mx, my + mh * 0.15, mw * 0.7, mh * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  // The smoke, rising and leaning off with the wind, lit red from under by night.
  for (let k = 0; k < 3; k++) {
    const r = u * (0.14 + 0.06 * k), sx = mx + u * (0.05 + 0.1 * k) * (variant === 1 ? -1 : 1), sy = my - u * (0.16 + 0.27 * k);
    ctx.fillStyle = rgba(mix(shade('#9a948e', Math.max(tone, 0.4)), '#c0583a', glow * (0.5 - k * 0.12)), 0.6 - k * 0.14);
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
  }
}

/**
 * A tree of the shore hung with creepers: a leaning trunk, a broad crown and the creepers' curtains
 * hanging from it most of the way to the ground, leaves along each strand. They keep their green on
 * the warm shore, duller as the trees' leaves go; snow lies along the crown.
 */
export function drawVineSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, season: TreeSeason = HIGH_SUMMER): void {
  const h = u * 2.5, dull = (1 - season.leaf) * 0.6, lean = u * 0.1 * (variant - 1);
  const trunk = shade('#4a3a2c', tone), leaf = shade(mix('#2a6a2e', '#5a6a34', dull), tone), strand = shade(mix('#3a7a30', '#6a6a38', dull), tone);
  const cx = x + lean, cy = y - h * 0.74, r = u * 0.7;
  celTaper(ctx, B, x, y, cx, y - h * 0.66, u * 0.15, u * 0.09, trunk, 0.2);
  celBall(ctx, B, cx - r * 0.62, cy + r * 0.12, r * 0.66, shade(leaf, 0.9));
  celBall(ctx, B, cx + r * 0.62, cy + r * 0.08, r * 0.66, shade(leaf, 1.05));
  celBall(ctx, B, cx, cy - r * 0.18, r * 0.78, leaf);
  // The curtains: strands from under the crown, longer and shorter by turns, each a little waved.
  const sw = Math.max(1, u * 0.045);
  for (let k = 0; k < 6; k++) {
    const sx = cx + (-0.8 + 0.32 * k) * r, top = cy + r * (0.3 + 0.25 * (1 - Math.abs(-0.8 + 0.32 * k))), len = h * (0.28 + 0.06 * ((k * 3 + variant * 2) % 5));
    const sway = u * 0.05 * (k % 2 ? 1 : -1);
    stroke(ctx, [sx, top, sx + sway, top + len * 0.5, sx, top + len], strand, sw);
    ctx.fillStyle = shade(leaf, 1.12);
    for (let j = 1; j < 4; j++) { const ly = top + (len * j) / 4, lx = sx + (j % 2 ? sway : -sway * 0.5); ctx.beginPath(); ctx.ellipse(lx + (j % 2 ? sw : -sw), ly, sw * 1.6, sw, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  if (season.snow > 0.15) {
    const white = shade(SNOW_WHITE, tone), sl = Math.max(1, u * 0.08 * season.snow);
    stroke(ctx, [cx - r * 1.1, cy + r * 0.02, cx - r * 0.6, cy - r * 0.5, cx, cy - r * 0.92, cx + r * 0.6, cy - r * 0.52, cx + r * 1.1, cy - r * 0.02], white, sl);
  }
}

export function drawPillarSprite(ctx: CanvasRenderingContext2D, x: number, horizon: number, u: number, tone: number): void {
  const w = u * 0.5, c = shade('#8a8690', tone);
  celPoly(ctx, B, [x - w / 2, horizon + u, x - w * 0.4, horizon - u * 0.9, x + w * 0.4, horizon - u * 0.9, x + w / 2, horizon + u], c, 0.4, 0.3);
  band(ctx, B, x - w * 0.6, horizon - u, w * 1.2, u * 0.14, shade(c, 1.1));
  band(ctx, B, x - w * 0.6, horizon + u - u * 0.12, w * 1.2, u * 0.12, shade(c, 0.9));
}
