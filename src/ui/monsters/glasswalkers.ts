// The glass walkers: the machines that came down with the lander, fused with the glass it made when
// it fell (MONSTERS §8.3), and older than any of the vessel's hands. Not the heavy machines' plate
// riveted on drums (machines.ts), the knockers' shells on rods nor the keepers' frames under a robe:
// a tall, spare frame of old bronze gone green in its seams, a man's shape and more than a man's
// height, a shell of a chest with a door in it (a cache is found in one, docs/areas/glasswold.md
// §4.8), a waist and hips of balls and rods, long legs and a smooth head with one lamp in it. Small
// enough to sit a horse (that doc's §6). The Glass has it now: it walked out of the melt and the
// melt set on it as it went, to the knees on both legs, and over its left shoulder and down
// that arm, the arm and the hand gone into a club of the Wold's green glass that drags on the ground
// beside it with the bronze seen dark through it, shards of it standing up off the shoulder and runs
// of it down the chest. The rest of it is bare. The lamp is still lit, a cold green-white, the
// basilisk's light. Drawn front on, as masses: the legs and the glass they waded in, the body, the
// free arm and the head, then the glass over the shoulder and the arm, and what shows through it.
//
// The Glass Walker, the Wold's: something walking out of the Glass, and it has walked a long way.
// Idle: it walks in place, each foot lifted and set down in turn and the body leaning off it onto the
// other, the club dragging; the lamp breathes and a light runs down the glass. The Buried Tower's
// walkers (MONSTERS §10.1) are to be this frame at their worst, a Build and a colouring.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { rgba, shade } from '../../lib/art/palettes.ts';
import { blob, glow, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['glass_walker'];

/** A shard standing off the glass: its root, x and y; its lean from upright in radians, to the company's right; its length and its half-breadth at the root; in heights. */
type Shard = readonly [number, number, number, number, number];

/**
 * What a glass walker is made of, as the Wold's walker's numbers, so another is a Build and a
 * colouring (MONSTERS §11: the Buried Tower's): its height and breadth, its colours, the glass on it
 * and its stride.
 */
interface Build {
  /** Drawn height, of the frame's: the head and the tallest shard stand at about this share of it. */
  reach: number;
  /** Breadth of the frame (1 = the Wold's walker). */
  wide: number;
  /** The glass, its depth and the light in its edges. */
  glass: string; deep: string; edge: string;
  /** The frame's old bronze, the green in its seams and the lamp's light. */
  metal: string; verdigris: string; lamp: string;
  /** The shards standing off the glass, up off the shoulder and out along the club. */
  shards: readonly Shard[];
  /** How high the glass stands on its legs, in heights (the Wold's walker's to under the knee). */
  wade: number;
  /** Frames to a stride, in which each foot lifts once. */
  stride: number;
}
const WOLD: Build = {
  reach: 0.97, wide: 1,
  glass: '#6a9c7c', deep: '#244030', edge: '#e8fff0', metal: '#6e5c46', verdigris: '#6f9a86', lamp: '#e6fff0',
  shards: [[-0.13, 0.775, -0.5, 0.21, 0.036], [-0.09, 0.785, -0.14, 0.19, 0.032], [-0.18, 0.69, -1, 0.14, 0.03], [-0.225, 0.47, -1.35, 0.12, 0.028], [-0.26, 0.33, -1.65, 0.11, 0.026]],
  wade: 0.22, stride: 140,
};
const BUILDS: Partial<Record<MonsterSprite, Build>> = { glass_walker: WOLD };

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  const d = BUILDS[kind] ?? WOLD;
  walker(ctx, x, y, h * d.reach, p, d);
};

const LAMP_GLOW = '#86ffc2';

/** A closed ring of n points round (cx, cy), for a part `blob` lumps. */
function ring(cx: number, cy: number, rx: number, ry: number, n = 8): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/** A line of light on the glass, its lit edge or a glint. Not drawn in the hit flash. */
function light(ctx: CanvasRenderingContext2D, pts: readonly number[], hex: string, wd: number, a: number): void {
  if (B.override) return;
  ctx.strokeStyle = rgba(hex, a); ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

/**
 * A glass walker, in units of `H` (its drawn height) up from the ground line: the shoulders at 0.73,
 * the waist at 0.5, the hips at 0.45, the knees at 0.26 and the head's middle at 0.86. x runs to the
 * company's right and is broadened by the Build's `wide`; the glass arm is on the company's left.
 */
function walker(ctx: CanvasRenderingContext2D, x: number, y: number, H: number, p: Paint, d: Build): void {
  const w = d.wide, t = p.frame, k = (hex: string): string => shade(hex, p.tone);
  const glass = k(d.glass), deep = k(d.deep), metal = k(d.metal), dark = shade(metal, 0.6), green = k(d.verdigris);
  const edge = shade(d.edge, Math.max(0.7, p.tone)), lamp = shade(d.lamp, Math.max(0.75, p.tone));
  // The stride: each foot lifts in turn and is set down, and the body leans off it onto the other.
  const lift = (s: number): number => { const q = (((t / d.stride + (s > 0 ? 0.5 : 0)) % 1) + 1) % 1; return q < 0.3 ? Math.sin((q / 0.3) * Math.PI) : 0; };
  const lean = H * 0.012 * (lift(-1) - lift(1)), bob = H * 0.004 * p.breathe, pulse = 0.5 + 0.5 * p.breathe;
  const X = (q: number): number => x + H * q * w + lean, Y = (q: number): number => y - H * q - bob;
  const G = (q: number): number => x + H * q * w;
  const M = (a: readonly number[]): number[] => a.map((v, i) => (i % 2 ? Y(v) : X(v)));

  /** A leg's hip, knee and ankle: `s` -1 the leg on the company's left, 1 on its right. */
  const joints = (s: number): [number, number, number, number, number, number] => {
    const up = lift(s);
    return [X(s * 0.045), Y(0.45), G(s * 0.068) + lean * 0.6, y - H * (0.26 + 0.045 * up), G(s * 0.075), y - H * (0.05 + 0.055 * up)];
  };
  const leg = (s: number): Part[] => {
    const [hx, hy, kx, ky, ax, ay] = joints(s);
    return [
      { k: 'cap', x0: hx, y0: hy, x1: kx, y1: ky, r0: H * 0.027 * w, r1: H * 0.022 * w },
      { k: 'ball', x: kx, y: ky, r: H * 0.029 * w },
      { k: 'cap', x0: kx, y0: ky, x1: ax, y1: ay, r0: H * 0.022 * w, r1: H * 0.018 * w },
    ];
  };
  /** The glass a leg waded out in, set round it from the foot to under the knee, pooled at the foot. */
  const boot = (s: number): Part[] => {
    const [, , kx, ky, ax, ay] = joints(s), top = Math.min(1, (d.wade - 0.05) / 0.21);
    const at = (u: number): number[] => [ax + (kx - ax) * u, ay + (ky - ay) * u];
    return [
      { k: 'tube', pts: [ax, ay + H * 0.025, ...at(top * 0.5), ...at(top)], r0: H * 0.05 * w, r1: H * 0.03 * w, wobble: 0.14, seed: 50 + s },
      { k: 'curve', pts: ring(ax + s * H * 0.006, ay + H * 0.02, H * 0.056 * w, H * 0.03, 9), wobble: 0.18, seed: 52 + s, sub: 2 },
    ];
  };
  /** A shard's outline, from its root in the glass to a bevelled point; `lit`, only its face to the light. */
  const shard = ([sx, sy, a, len, half]: Shard, lit = false): number[] => {
    const ux = Math.sin(a), uy = Math.cos(a), side = uy + ux > 0 ? -1 : 1;
    const pt = (u: number, v: number): number[] => [X(sx + ux * u + uy * v), Y(sy + uy * u - ux * v)];
    return lit ? [...pt(0, side * half * 0.85), ...pt(len * 0.75, side * half * 0.72), ...pt(len * 0.97, half * 0.12), ...pt(0, 0)]
      : [...pt(-0.03, -half), ...pt(len * 0.72, -half * 0.75), ...pt(len, half * 0.15), ...pt(len * 0.8, half * 0.8), ...pt(-0.03, half)];
  };

  groundShadow(ctx, x - H * 0.06 * w, y + 1, H * 0.36 * w);

  // 1. The legs and the hips, old bronze and pitted; the glass they waded out in, to under the knees.
  blob(ctx, B, metal, [...leg(-1), ...leg(1), { k: 'ell', x: X(0), y: Y(0.45), rx: H * 0.075 * w, ry: H * 0.04 }], { h: H, formK: 0.45, tex: 'stipple', seed: 11, amount: 0.35 });
  blob(ctx, B, glass, [...boot(-1), ...boot(1)], { h: H, formK: 0.45, gloss: 0.85, spread: 0.65, tex: 'facets', seed: 12, amount: 0.5 });

  // 2. The body: a waist of rod, and a shell of a chest on it with its door shut; green in the seams.
  blob(ctx, B, metal, [{ k: 'cap', x0: X(0), y0: Y(0.55), x1: X(0), y1: Y(0.46), r0: H * 0.03 * w, r1: H * 0.034 * w }], { h: H, formK: 0.4 });
  blob(ctx, B, metal, [{ k: 'curve', pts: M([-0.12, 0.73, -0.09, 0.775, 0, 0.79, 0.09, 0.775, 0.125, 0.73, 0.115, 0.65, 0.075, 0.565, 0.045, 0.53, -0.045, 0.53, -0.075, 0.565, -0.115, 0.65]), wobble: 0.02, seed: 21, sub: 2 }],
    { h: H, formK: 0.4, gloss: 0.3, tex: 'stipple', seed: 22, amount: 0.4 });
  softLine(ctx, B, M([-0.045, 0.735, 0.06, 0.735, 0.055, 0.6, -0.04, 0.6, -0.045, 0.735]), metal, Math.max(1, H * 0.008), 0.6);
  patch(ctx, B, green, [{ k: 'ell', x: X(0.075), y: Y(0.7), rx: H * 0.04 * w, ry: H * 0.05 }, { k: 'ell', x: X(0.01), y: Y(0.575), rx: H * 0.035 * w, ry: H * 0.02 }], { alpha: 0.4 });

  // 3. The free arm, hanging, swinging against the stride, its three long fingers open.
  const sw = H * 0.01 * (lift(1) - lift(-1));
  const sh: [number, number] = [X(0.125), Y(0.725)], el: [number, number] = [X(0.165) + sw * 0.5, Y(0.575)], wr: [number, number] = [X(0.172) + sw, Y(0.42)];
  blob(ctx, B, metal, [
    { k: 'ball', x: sh[0], y: sh[1], r: H * 0.036 * w },
    { k: 'cap', x0: sh[0], y0: sh[1], x1: el[0], y1: el[1], r0: H * 0.023 * w, r1: H * 0.021 * w },
    { k: 'ball', x: el[0], y: el[1], r: H * 0.026 * w },
    { k: 'cap', x0: el[0], y0: el[1], x1: wr[0], y1: wr[1], r0: H * 0.02 * w, r1: H * 0.017 * w },
    ...[[-0.022, 0.075], [0.004, 0.085], [0.028, 0.07]].map(([fx, fy]): Part => ({ k: 'cap', x0: wr[0], y0: wr[1], x1: wr[0] + H * fx * w, y1: wr[1] + H * fy, r0: H * 0.011, r1: H * 0.008 })),
  ], { h: H, formK: 0.45, tex: 'stipple', seed: 31, amount: 0.3 });

  // 4. The head on its neck, smooth and green on its crown, and the lamp in it, still lit.
  const hx = X(0.02), hy = Y(0.862), lx = hx + H * 0.004, ly = hy + H * 0.008;
  blob(ctx, B, metal, [{ k: 'cap', x0: X(0.012), y0: Y(0.77), x1: X(0.016), y1: Y(0.81), r0: H * 0.022, r1: H * 0.02 }, { k: 'ell', x: hx, y: hy, rx: H * 0.062 * w, ry: H * 0.072 }],
    { h: H, formK: 0.5, gloss: 0.35, tex: 'stipple', seed: 41, amount: 0.3 });
  patch(ctx, B, green, [{ k: 'ell', x: hx - H * 0.012, y: hy - H * 0.042, rx: H * 0.04 * w, ry: H * 0.022 }], { alpha: 0.4 });
  blob(ctx, B, dark, [{ k: 'ball', x: lx, y: ly, r: H * 0.032 }], { h: H, outline: false, form: false });
  glow(ctx, B, lx, ly, H * 0.085, k(LAMP_GLOW), 0.3 + 0.18 * pulse, lamp);
  blob(ctx, B, lamp, [{ k: 'ball', x: lx, y: ly, r: H * 0.019 }], { h: H, outline: false, form: false, gloss: 1 });

  // 5. The glass over the left shoulder and down that arm, one mass: the arm gone into a club of it
  //    that drags beside it, the shards standing off it and two runs of it down the chest.
  const end: [number, number] = [G(-0.245) + lean * 0.3, y - H * 0.085];
  const elbow = (X(-0.235) + end[0]) / 2;
  blob(ctx, B, glass, [
    { k: 'ball', x: X(-0.115), y: Y(0.735), r: H * 0.062 * w },
    { k: 'tube', pts: [X(-0.12), Y(0.72), X(-0.175), Y(0.58), X(-0.215), Y(0.42), elbow, Y(0.26)], r0: H * 0.054 * w, r1: H * 0.068 * w, wobble: 0.07, seed: 61 },
    { k: 'curve', pts: ring(end[0], end[1], H * 0.092 * w, H * 0.085, 10), wobble: 0.14, seed: 62, sub: 2 },
    ...d.shards.map((s): Part => ({ k: 'poly', pts: shard(s) })),
    { k: 'tube', pts: M([-0.07, 0.72, -0.068, 0.67, -0.072, 0.62]), r0: H * 0.026, r1: H * 0.007 },
    { k: 'tube', pts: M([-0.035, 0.75, -0.03, 0.71, -0.033, 0.675]), r0: H * 0.02, r1: H * 0.006 },
  ], { h: H, formK: 0.4, gloss: 0.9, spread: 0.65, tex: 'facets', seed: 63, amount: 0.6 });

  // 6. Through the glass the arm's bronze, dark, the hand open at the club's end and a light held in
  //    the glass by the elbow, as the Tower's glass holds one (docs/areas/glasswold.md §4.8); the light
  //    in the glass's edge and on the shards' faces, a crack it has carried a long way and a glint.
  patch(ctx, B, dark, [
    { k: 'tube', pts: [X(-0.12), Y(0.72), X(-0.17), Y(0.58), X(-0.205), Y(0.43), elbow, Y(0.27), end[0], end[1] - H * 0.02], r0: H * 0.022, r1: H * 0.016 },
    { k: 'ball', x: end[0], y: end[1] - H * 0.01, r: H * 0.034 },
  ], { alpha: 0.62, feather: 0.35 });
  glow(ctx, B, X(-0.2), Y(0.47), H * 0.1, k(LAMP_GLOW), 0.16 + 0.1 * pulse, edge);
  for (const s of d.shards) patch(ctx, B, edge, [{ k: 'poly', pts: shard(s, true) }], { alpha: 0.45, feather: 0 });
  light(ctx, M([-0.162, 0.755, -0.2, 0.6, -0.245, 0.43, -0.272, 0.28]), edge, Math.max(1, H * 0.013), 0.7);
  softLine(ctx, B, M([-0.2, 0.52, -0.165, 0.47, -0.19, 0.4]), deep, Math.max(1, H * 0.007), 0.55);
  const g = (((t % 130) + 130) % 130) / 130;
  if (g < 0.3) {
    const u = g / 0.3, s = H * 0.026 * Math.sin(u * Math.PI), gx = X(-0.15 - 0.08 * u), gy = Y(0.66 - 0.36 * u), wd = Math.max(1, s * 0.2);
    light(ctx, [gx - s, gy, gx + s, gy], edge, wd, 0.9);
    light(ctx, [gx, gy - s, gx, gy + s], edge, wd, 0.9);
  }
}
