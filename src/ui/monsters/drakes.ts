// The drakes of Fire Mountain: the Cinder Drake first, and on its frame the Old Drake, the eldest of
// the line. The mountain has children, and they are nothing of the picture book's dragon: things
// grown in the vents, a heavy body crusted ash-grey as a flow crusts when it cools, and under the
// crust the fire, showing at the belly in bands between dark plates. The wings are small for it, a
// bat's, the web sooty and veined red; two thick hind legs; a short tail ending in a knob of clinker;
// and a head too big for it, blunt as a lump of basalt and turned to the company, the brow heavy over
// small bright eyes, two stubs of horn, the jaw hung open on the glow in its throat. The breath is a
// plume of embers going up out of the jaw, the one part drawn apart from it (tools/smoke.ts). The
// Cinder Drake hangs on its wings a little off the ground, the wings beating and the feet hanging.
// Drawn as masses: the far wing, the tail and the far leg a step darker, the body in one mass with the
// belly let into it, the near leg and the near wing, then the head over the chest.
//
// The Old Drake: the mountain's eldest, asleep on what is left of the town. The frame larger and
// broader and the head heavier still, settled on its haunches, its wings half folded with the wrists
// high at its shoulders; in the colours of its crater, the crust nearly basalt and crusted with
// sulphur, the fire a deeper red. It is scarred: pale weals across the flank, a notch torn in a wing,
// a horn broken short and a blind eye under an old cut. A boss, drawn inside the tall boss's crown
// (TALL_REACH, src/ui/grouplabels.ts). Idle: it breathes, the belly brightening, and the plume goes up.
//
// Meridian Camp's two (MONSTERS §8.4). The Drakeling: the mountain's youngest, out of the egg in the
// nest off the iron corridors, and its crust has not set: the frame small and round, the head bigger
// for it still, the hide a soft ember-pink with the fire showing through it all over and the belly
// unplated; the horns two nubs, the eyes large, the tail short, and the wings stubs that beat fast to
// keep it up. Too young to breathe: no plume. Idle: it hangs on its whirring wings, bobbing.
//
// The Brood Drake: the nest's mother, the Barbarian's quarry. The frame broad and rust-dark as the
// corridors' iron, settled on its haunches over its clutch, three eggs of clinker cracked with the
// fire inside, between its feet; its wings raised at the wrists and spread down and out round them as
// a hawk mantles, the long horns swept back, the jaw open. A boss, drawn inside the tall boss's crown.
// Idle: it breathes, the wings shiver over the eggs, the eggs' cracks glow and the plume goes up.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import { blob, glow, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['cinder_drake', 'old_drake', 'drakeling', 'brood_drake'];

/**
 * What a drake is made of, as the Cinder Drake's numbers, so another drake is a Build and a colouring
 * (MONSTERS §11: the drakeling and the Brood Drake are Meridian Camp's): its height in the frame, its
 * breadth and its head, how it holds itself and its wings, and its scars.
 */
interface Build {
  /** Drawn height, of the frame's: the wings' tips, or their wrists when folded, stand at about this share of it. */
  reach: number;
  /** Breadth of the body and the span of the wings (1 = the Cinder Drake). */
  wide: number;
  /** The head's size, 1.1 the Cinder Drake's (already too big for it). */
  head: number;
  /** How far it hangs off the ground on its wings, in heights; 0 settled on its haunches. */
  hover: number;
  /** How far its wings are opened: 1 spread and raised, 0 folded with the wrists at the shoulders. */
  spread: number;
  /** How much of `spread` each wingbeat takes back; 0 holds the wings still. */
  beat: number;
  hide: string; crust: string; web: string; vein: string; fire: string; hot: string; horn: string; claw: string; eye: string;
  /** Sulphur crusted on the shoulders and the crown, its crater's colour, or none. */
  sulphur: string | null;
  /** The elder's scars: pale weals, a notch torn in the near wing, a horn broken short and a blind eye. */
  scarred: boolean;
  /** The embers in the plume; 0, no plume. */
  embers: number;
  /** The wings' size against the Cinder Drake's (1), and the frames to a radian of their beat (its 6). */
  wing: number; rate: number;
  /** The horns' length, the eyes' size and the tail's length, against the Cinder Drake's (1). */
  horns: number; eyes: number; tail: number;
  /** How far the crust has set: 1 a grown drake's; less, its cracks fainter, and under a half the belly unplated. */
  crusted: number;
  /** How far the spread wings come down and out round it, as a hawk mantles: 0 not at all, 1 the Brood Drake's. */
  mantle: number;
  /** The eggs between its feet, 0 none. */
  clutch: number;
}
const CINDER: Build = {
  reach: 0.97, wide: 1, head: 1.1, hover: 0.05, spread: 1, beat: 0.22,
  hide: '#7a736b', crust: '#4a4441', web: '#3e3532', vein: '#c8502a', fire: '#ee7a2e', hot: '#ffd47e', horn: '#5a4e46', claw: '#2a2321', eye: '#ffc43c',
  sulphur: null, scarred: false, embers: 5, wing: 1, rate: 6, horns: 1, eyes: 1, tail: 1, crusted: 1, mantle: 0, clutch: 0,
};
const OLD: Build = {
  reach: 0.9, wide: 1.15, head: 1.22, hover: 0, spread: 0.28, beat: 0,
  hide: '#58524c', crust: '#34302e', web: '#2c2523', vein: '#b03a1e', fire: '#d8481e', hot: '#ffb24e', horn: '#4a3e36', claw: '#201a18', eye: '#ff9a2a',
  sulphur: '#cdb64c', scarred: true, embers: 5, wing: 1, rate: 6, horns: 1, eyes: 1, tail: 1, crusted: 1, mantle: 0, clutch: 0,
};
const YOUNG: Build = {
  reach: 0.86, wide: 0.92, head: 1.45, hover: 0.12, spread: 1, beat: 0.32,
  hide: '#b4735a', crust: '#7a4430', web: '#8e4a34', vein: '#ff8c4a', fire: '#ffa04a', hot: '#ffe6a2', horn: '#8a604c', claw: '#4a2e26', eye: '#ffe27a',
  sulphur: null, scarred: false, embers: 0, wing: 0.72, rate: 3, horns: 0.32, eyes: 2, tail: 0.68, crusted: 0.3, mantle: 0, clutch: 0,
};
const BROOD: Build = {
  reach: 0.92, wide: 1.12, head: 1.2, hover: 0, spread: 1, beat: 0.1,
  hide: '#764636', crust: '#3a201a', web: '#40201a', vein: '#e85a2a', fire: '#ff7426', hot: '#ffd070', horn: '#2a1c18', claw: '#1c1310', eye: '#ffd23c',
  sulphur: null, scarred: false, embers: 5, wing: 1, rate: 9, horns: 1.25, eyes: 1, tail: 1, crusted: 1, mantle: 1, clutch: 3,
};
const BUILDS: Partial<Record<MonsterSprite, Build>> = { cinder_drake: CINDER, old_drake: OLD, drakeling: YOUNG, brood_drake: BROOD };

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  const d = BUILDS[kind] ?? CINDER;
  drake(ctx, x, y, h * d.reach, p, d);
};

type Pt = readonly [number, number];
const mid = (a: number, b: number, k: number): number => a + (b - a) * k;
const BONE = '#dccfb2', BLIND = '#cfc8bc', INK = '#120c14';

/** A wing's joints out from its shoulder, in heights, x away from the body and y up: the elbow, the wrist, the three fingers' tips and where the web meets the flank. */
interface Joints { elbow: Pt; wrist: Pt; tips: readonly Pt[]; root: Pt }
/** Spread and raised, as the Cinder Drake holds them: small for the body they carry. */
const SPREAD: Joints = { elbow: [0.12, 0.11], wrist: [0.2, 0.29], tips: [[0.36, 0.34], [0.42, 0.16], [0.34, 0.01]], root: [0.07, -0.17] };
/** Folded as a bat folds them: the wrist up by the shoulder and the fingers down along the flank. */
const FOLDED: Joints = { elbow: [0.1, -0.02], wrist: [0.14, 0.2], tips: [[0.16, 0.06], [0.14, -0.09], [0.09, -0.15]], root: [0.06, -0.17] };
/** Spread down and out round it, as a hawk mantles over what it holds: the wrist up and the fingers down to the ground beside it. */
const MANTLED: Joints = { elbow: [0.15, 0.1], wrist: [0.27, 0.13], tips: [[0.43, -0.07], [0.42, -0.28], [0.3, -0.46]], root: [0.08, -0.29] };

/** The colours of one drake at its distance. */
interface Inks { hide: string; crust: string; web: string; vein: string; fire: string; hot: string; horn: string; claw: string; eye: string; bone: string; scar: string; blind: string; sulphur: string }

/** A closed ring of n points round (cx, cy), for a part `blob` lumps. */
function ring(cx: number, cy: number, rx: number, ry: number, n = 8): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/**
 * A drake, in units of `H` (its drawn height) up from the ground line: the shoulders at 0.6, the
 * belly's middle at 0.34 and the haunches at 0.2, all lifted by `hover` while it hangs on its wings,
 * and the head's middle at 0.57, hung in front of the chest under the shoulders' line. x runs to the company's right, the far side, and
 * is broadened by the Build's `wide`.
 */
function drake(ctx: CanvasRenderingContext2D, x: number, y: number, H: number, p: Paint, d: Build): void {
  const w = d.wide, t = p.frame, k = (hex: string): string => shade(hex, p.tone);
  const c: Inks = {
    hide: k(d.hide), crust: k(d.crust), web: k(d.web), vein: k(d.vein), fire: k(d.fire), hot: k(d.hot), horn: k(d.horn), claw: k(d.claw), eye: k(d.eye),
    bone: k(BONE), scar: k(mix(d.hide, '#ece4d6', 0.5)), blind: k(BLIND), sulphur: k(d.sulphur ?? d.crust),
  };
  const far = (hex: string): string => shade(hex, 0.8);
  // On the wing it rises as the wings come down; settled, it breathes, the head and the wings lifting with it.
  const flap = d.beat ? 0.5 + 0.5 * Math.sin(t / d.rate) : 0;
  const s = d.spread * (1 - d.beat * flap);
  const lift = d.hover ? d.hover + 0.014 * flap : 0, rise = d.hover ? 0 : H * 0.005 * p.breathe;
  const pulse = 0.5 + 0.5 * p.breathe;
  const X = (q: number): number => x + H * q * w, Y = (q: number): number => y - H * (q + lift);
  const M = (a: readonly number[]): number[] => { const o: number[] = []; for (let i = 0; i < a.length; i += 2) o.push(X(a[i]), Y(a[i + 1])); return o; };

  groundShadow(ctx, x + H * 0.04, y + 1, H * (d.hover ? 0.36 : 0.5) * w);

  // 1. The far wing, behind it and a step darker.
  wing(ctx, X(0.13), Y(0.6) - rise, 1, H, s, d, far(c.web), far(c.hide), far(c.claw), c.vein, false);

  // 2. The tail: thick, hung under it on the wing and laid along the ground when it sits, its end
  //    turned up in a knob of clinker.
  const run = d.hover ? [0.08, 0.22, 0.22, 0.15, 0.33, 0.07, 0.41, 0.03, 0.47, 0.07] : [0.08, 0.18, 0.26, 0.08, 0.41, 0.035, 0.51, 0.04, 0.56, 0.08];
  const tail = M(d.tail === 1 ? run : run.map((v, i) => mid(run[i % 2], v, d.tail)));
  blob(ctx, B, far(c.hide), [{ k: 'tube', pts: tail, r0: H * 0.08 * w, r1: H * 0.026 * w, wobble: 0.04, seed: 21 }], { h: H, tex: 'cracks', seed: 22, amount: 0.5 * d.crusted, formK: 0.4 });
  const [tx, ty] = tail.slice(-2);
  blob(ctx, B, far(c.crust), [{ k: 'curve', pts: ring(tx, ty, H * 0.036 * w, H * 0.032), wobble: 0.16, seed: 23, sub: 2 }], { h: H, tex: 'cracks', seed: 24, formK: 0.5 });

  // 3. The far leg.
  leg(ctx, X, Y, y, 1, H, d, far(c.hide), far(c.claw));

  // 4. The body, one mass: hunched, the shoulders high and narrow over a barrel of a belly and broad
  //    haunches; a knob of crust on each shoulder.
  blob(ctx, B, c.hide, [{ k: 'curve', pts: M([-0.14, 0.62, -0.09, 0.7, 0, 0.72, 0.1, 0.7, 0.15, 0.62, 0.19, 0.5, 0.21, 0.36, 0.19, 0.22, 0.1, 0.15, -0.04, 0.14, -0.16, 0.19, -0.21, 0.32, -0.2, 0.48]), wobble: 0.04, seed: 41, sub: 2 }],
    { h: H, tex: 'cracks', seed: 42, amount: 0.75 * d.crusted, formK: 0.3 });
  const knob = d.scarred ? 0.034 : 0.03;
  blob(ctx, B, c.crust, [[-0.125, 0.668], [0.125, 0.672]].map(([qx, qy]): Part => ({ k: 'curve', pts: ring(X(qx), Y(qy), H * knob * w, H * knob * 0.85), wobble: 0.14, seed: Math.round(qx * 100) + 50, sub: 1 })),
    { h: H, tex: 'cracks', seed: 43, amount: 0.5, formK: 0.5 });

  // 5. The belly: crusted over in plates, and the fire under the crust glowing in the seams between them.
  blob(ctx, B, c.fire, [{ k: 'ell', x: X(-0.005), y: Y(0.34), rx: H * 0.125 * w, ry: H * 0.145 }], { h: H, outline: false, formK: 0.2 });
  glow(ctx, B, X(-0.005), Y(0.33), H * 0.19 * w, c.fire, 0.3 + 0.2 * pulse, c.hot);
  if (d.crusted >= 0.5) blob(ctx, B, shade(c.crust, 1.12), [0.235, 0.3, 0.365, 0.43].flatMap((q, i): Part[] => {
    const half = 0.112 * Math.sqrt(Math.max(0, 1 - ((q - 0.34) / 0.15) ** 2)), o = (i % 2 ? 0.022 : -0.018), gap = 0.012;
    return [{ k: 'tube', pts: [X(-half), Y(q + 0.01), X(o - gap), Y(q - 0.004)], r0: H * 0.024, r1: H * 0.026 }, { k: 'tube', pts: [X(o + gap), Y(q - 0.004), X(half), Y(q + 0.01)], r0: H * 0.026, r1: H * 0.024 }];
  }), { h: H, outline: false, formK: 0.45 });

  // 6. The elder's scars and its crater's sulphur: weals raked across the far flank, and the yellow
  //    crusted on the shoulders' knobs.
  if (d.scarred && !B.override) for (const [x0, y0, x1, y1] of [[0.12, 0.56, 0.19, 0.44], [0.12, 0.49, 0.2, 0.36], [0.12, 0.42, 0.19, 0.29]]) {
    softLine(ctx, B, [X(x0), Y(y0), X(mid(x0, x1, 0.5) + 0.008), Y(mid(y0, y1, 0.5)), X(x1), Y(y1)], c.scar, Math.max(1, H * 0.009), 0.8);
  }
  if (d.sulphur) patch(ctx, B, c.sulphur, [{ k: 'ell', x: X(0.09), y: Y(0.695), rx: H * 0.06 * w, ry: H * 0.028 }, { k: 'ell', x: X(-0.12), y: Y(0.675), rx: H * 0.04 * w, ry: H * 0.022 }], { alpha: 0.7 });

  // 7. The mother's clutch between its feet; the near leg, and the near wing over its shoulder.
  if (d.clutch) clutch(ctx, X, y, H, d, c, pulse);
  leg(ctx, X, Y, y, -1, H, d, c.hide, c.claw);
  wing(ctx, X(-0.13), Y(0.6) - rise, -1, H, s, d, c.web, c.hide, c.claw, c.vein, d.scarred);

  // 8. The head, over the chest, and the plume going up out of its jaw.
  const hr = H * 0.105 * d.head * Math.sqrt(w);
  const mouth = head(ctx, X(-0.04), Y(0.57) - rise, hr, H, d, c, pulse);
  if (!B.override && d.embers) plume(ctx, mouth[0], mouth[1], H, d, c, t, y - H * (d.hover ? 0.99 : 0.86));
}

/**
 * A wing from its shoulder (sx, sy), `side` -1 to the company's left and 1 to its right, opened `s`
 * (0 folded, 1 spread): the web from the arm out to the fingers' tips, scalloped between them and back
 * to the flank, its veins red with the fire; then the bones over it and the hooked thumb at the wrist.
 * `torn` cuts a notch in its edge.
 */
function wing(ctx: CanvasRenderingContext2D, sx: number, sy: number, side: number, H: number, s: number, d: Build, web: string, bone: string, claw: string, vein: string, torn: boolean): void {
  const r = H * d.wide * d.wing, v = H * d.wing;
  // Spread is the Cinder Drake's, or brought down toward the mantle's by `mantle`.
  const O = (a: Pt, m: Pt): Pt => (d.mantle ? [mid(a[0], m[0], d.mantle), mid(a[1], m[1], d.mantle)] : a);
  const J = (a: Pt, b: Pt): [number, number] => [sx + side * r * mid(b[0], a[0], s), sy - v * mid(b[1], a[1], s)];
  const E = J(O(SPREAD.elbow, MANTLED.elbow), FOLDED.elbow), W = J(O(SPREAD.wrist, MANTLED.wrist), FOLDED.wrist), R = J(O(SPREAD.root, MANTLED.root), FOLDED.root);
  const T = SPREAD.tips.map((q, i) => J(O(q, MANTLED.tips[i]), FOLDED.tips[i]));
  const edge = [...T, R];
  const pts: number[] = [sx, sy, ...E, ...W, ...T[0]], hollows: [number, number][] = [];
  for (let i = 0; i < 3; i++) {
    // Each run of the edge bows in toward the wrist (the last toward the shoulder), as a web pulls.
    const a = edge[i], b = edge[i + 1], to = i < 2 ? W : [sx, sy];
    const cx = mid((a[0] + b[0]) / 2, to[0], 0.55), cy = mid((a[1] + b[1]) / 2, to[1], 0.55);
    for (const u of [0.2, 0.4, 0.5, 0.6, 0.8]) {
      let px = (1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * cx + u * u * b[0], py = (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * cy + u * u * b[1];
      if (torn && i === 1 && u === 0.5) { px = mid(px, W[0], 0.3); py = mid(py, W[1], 0.3); }
      pts.push(px, py);
      if (u === 0.5) hollows.push([px, py]);
    }
    pts.push(...b);
  }
  blob(ctx, B, web, [{ k: 'poly', pts }], { h: H, formK: 0.25 });
  if (!B.override && H >= 40) {
    const [ax, ay] = [mid(sx, E[0], 0.6), mid(sy, E[1], 0.6)];
    for (const [hx, hy] of hollows) softLine(ctx, B, [ax, ay, mid(ax, hx, 0.55) + side * H * 0.01, mid(ay, hy, 0.5), mid(ax, hx, 0.92), mid(ay, hy, 0.92)], vein, Math.max(1, H * 0.006), 0.55);
  }
  blob(ctx, B, bone, [
    { k: 'tube', pts: [sx, sy, ...E, ...W], r0: r * 0.032, r1: r * 0.02 },
    ...T.map((q): Part => ({ k: 'tube', pts: [...W, ...q], r0: r * 0.014, r1: r * 0.006 })),
  ], { h: H, formK: 0.4 });
  blob(ctx, B, claw, [{ k: 'tube', pts: [W[0], W[1], W[0] - side * r * 0.012, W[1] - H * 0.034, W[0] - side * r * 0.03, W[1] - H * 0.044], r0: r * 0.013, r1: r * 0.004 }], { h: H });
}

/**
 * A hind leg on `side`: the haunch, the shin and the foot, three claws hooked down from it; tucked up
 * under a drake on the wing, the foot hanging, and set flat in front of one on its haunches.
 */
function leg(ctx: CanvasRenderingContext2D, X: (q: number) => number, Y: (q: number) => number, ground: number, side: number, H: number, d: Build, hex: string, claw: string): void {
  const w = d.wide;
  const j = d.hover ? [0.15, 0.22, 0.18, 0.15, 0.12, 0.085, 0.11, 0.03] : [0.15, 0.17, 0.19, 0.12, 0.13, 0.05, 0.12, 0.018];
  const P = (i: number): [number, number] => [X(side * j[i]), d.hover || i < 4 ? Y(j[i + 1]) : ground - H * j[i + 1]];
  const [hx, hy] = P(0), [kx, ky] = P(2), [ax, ay] = P(4), [fx, fy] = P(6);
  blob(ctx, B, hex, [
    { k: 'ell', x: hx, y: hy, rx: H * (d.hover ? 0.085 : 0.1) * w, ry: H * (d.hover ? 0.09 : 0.11), rot: side * 0.25 },
    { k: 'tube', pts: [hx, hy, kx, ky, ax, ay], r0: H * 0.06 * w, r1: H * 0.036 * w },
    { k: 'tube', pts: [ax, ay, fx, fy], r0: H * 0.036 * w, r1: H * 0.032 * w },
  ], { h: H, tex: 'cracks', seed: 31 + side, amount: 0.5 * d.crusted, formK: 0.45 });
  blob(ctx, B, claw, [-1, 0, 1].map((q): Part => {
    const bx = fx + q * H * 0.024 * w, by = fy + H * 0.012, ey = Math.min(ground, by + H * 0.03);
    return { k: 'tube', pts: [bx, by, bx + q * H * 0.01 * w, ey], r0: H * 0.012, r1: H * 0.004 };
  }), { h: H, formK: 0.3 });
}

/**
 * The head, in head units `hr` round (hx, hy), y down: broad and flat-crowned, the snout blunt to the
 * company, the jaw hung open under it on the fire in the throat. Returns where the plume leaves the jaw.
 */
function head(ctx: CanvasRenderingContext2D, hx: number, hy: number, hr: number, H: number, d: Build, c: Inks, pulse: number): [number, number] {
  const P = (px: number, py: number): [number, number] => [hx + px * hr, hy + py * hr];
  const M = (a: readonly number[]): number[] => { const o: number[] = []; for (let i = 0; i < a.length; i += 2) o.push(...P(a[i], a[i + 1])); return o; };
  // 1. The horns, two stubs swept out and back from the corners of the crown; the elder's near one
  //    broken short, the young's two nubs and the mother's long.
  const grown = (a: number[]): number[] => (d.horns === 1 ? a : a.map((q, i) => mid(a[i % 2], q, d.horns)));
  blob(ctx, B, c.horn, [
    { k: 'tube', pts: M(grown(d.scarred ? [-0.9, -0.68, -1.24, -0.92, -1.36, -0.96] : [-0.9, -0.68, -1.32, -0.98, -1.74, -1.06])), r0: hr * 0.27, r1: hr * (d.scarred ? 0.18 : 0.045) },
    { k: 'tube', pts: M(grown([0.9, -0.68, 1.32, -0.98, 1.74, -1.06])), r0: hr * 0.27, r1: hr * 0.045 },
  ], { h: H, formK: 0.4 });
  // 2. The jaw, hung open: a heavy U under the face, a step darker, and the fire in the throat.
  blob(ctx, B, shade(c.hide, 0.86), [{ k: 'curve', pts: M([-1.05, -0.05, -1.0, 0.72, -0.56, 1.2, 0, 1.33, 0.56, 1.2, 1.0, 0.72, 1.05, -0.05]), wobble: 0.03, seed: 51 }],
    { h: H, tex: 'cracks', seed: 52, amount: 0.5 * d.crusted, formK: 0.3 });
  const [qx, qy] = P(0, 0.66);
  blob(ctx, B, c.fire, [{ k: 'ell', x: qx, y: qy, rx: hr * 0.74, ry: hr * 0.42 }], { h: H, outline: false, formK: 0.2 });
  glow(ctx, B, qx, qy - hr * 0.08, hr * 0.68, c.hot, 0.45 + 0.3 * pulse, '#fff6d8');
  // 3. The teeth, short and blunt, a row up from the jaw and a row down from the lip, the corners' longest.
  const tooth = (bx: number, by: number, len: number): Part => ({ k: 'poly', pts: [...P(bx - 0.09, by), ...P(bx + 0.09, by), ...P(bx, by + len)] });
  blob(ctx, B, c.bone, [tooth(-0.52, 1.0, -0.22), tooth(-0.17, 1.06, -0.16), tooth(0.17, 1.06, -0.16), tooth(0.52, 1.0, -0.22)], { h: H, formK: 0.2 });
  // 4. The face: broad and flat as a lump of basalt, and its teeth down from the lip.
  blob(ctx, B, c.hide, [{ k: 'curve', pts: M([-1.25, 0.12, -1.33, -0.35, -1.06, -0.8, -0.5, -1.0, 0, -1.03, 0.5, -1.0, 1.06, -0.8, 1.33, -0.35, 1.25, 0.12, 0.85, 0.4, 0, 0.47, -0.85, 0.4]), wobble: 0.04, seed: 53, sub: 2 }],
    { h: H, tex: 'cracks', seed: 54, amount: 0.6 * d.crusted, formK: 0.35 });
  blob(ctx, B, c.bone, [tooth(-0.64, 0.34, 0.3), tooth(-0.26, 0.42, 0.18), tooth(0.26, 0.42, 0.18), tooth(0.64, 0.34, 0.3)], { h: H, formK: 0.2 });
  // 5. The eyes, small and bright, deep under the brow; the elder's far one blind under an old cut.
  for (const side of [-1, 1]) {
    const [ex, ey] = P(side * 0.6, -0.36), blind = d.scarred && side > 0;
    if (!blind) glow(ctx, B, ex, ey, hr * 0.44, c.fire, 0.4, c.hot);
    eye(ctx, ex, ey, hr * 0.17 * d.eyes, blind ? c.blind : c.eye, !blind);
  }
  // 6. The brow, two heavy ridges over the eyes, and a crest of knobs along the crown.
  blob(ctx, B, shade(c.hide, 1.06), [-1, 1].map((side): Part => ({ k: 'ell', x: P(side * 0.6, -0.6)[0], y: P(side * 0.6, -0.6)[1], rx: hr * 0.46, ry: hr * 0.18, rot: side * 0.28 })), { h: H, formK: 0.5 });
  blob(ctx, B, shade(c.hide, 0.94), [[-0.3, -0.97, 0.12], [0.06, -1.01, 0.13], [0.4, -0.96, 0.11]].map(([px, py, pr]): Part => ({ k: 'curve', pts: ring(...P(px, py), hr * pr, hr * pr * 0.85), wobble: 0.14, seed: Math.round(px * 100) + 70, sub: 1 })),
    { h: H, formK: 0.5 });
  if (d.sulphur) patch(ctx, B, c.sulphur, [{ k: 'ell', x: P(0.2, -0.92)[0], y: P(0.2, -0.92)[1], rx: hr * 0.4, ry: hr * 0.14 }], { alpha: 0.6 });
  // 7. The nostrils, and the elder's old cut down through its blind eye.
  if (!B.override) {
    for (const side of [-1, 1]) softLine(ctx, B, M([side * 0.36, 0.12, side * 0.26, 0.2]), INK, Math.max(1, hr * 0.11), 0.7);
    if (d.scarred) softLine(ctx, B, M([0.3, -0.98, 0.62, -0.5, 0.92, 0.02]), c.scar, Math.max(1, hr * 0.1), 0.85);
  }
  return P(-0.2, 0.62);
}

/**
 * The mother's clutch on the ground between its feet: eggs of clinker, crusted as the drakes are, each
 * cracked through with the fire inside, which brightens as it breathes. They touch its feet and each
 * other, so the clutch is of its silhouette.
 */
function clutch(ctx: CanvasRenderingContext2D, X: (q: number) => number, ground: number, H: number, d: Build, c: Inks, pulse: number): void {
  const eggs = [[-0.08, 0.05, 0.068, -0.3], [0.088, 0.047, 0.064, 0.32], [0.004, 0.056, 0.076, 0.04]].slice(0, d.clutch);
  const shell = mix(c.crust, c.hide, 0.35);
  for (const [qx, rx, ry, rot] of eggs) {
    const ex = X(qx), ey = ground - H * ry * 0.96;
    blob(ctx, B, shell, [{ k: 'ell', x: ex, y: ey, rx: H * rx * d.wide, ry: H * ry, rot }], { h: H, tex: 'cracks', seed: Math.round(qx * 100) + 90, amount: 0.5, formK: 0.45 });
    if (B.override || H < 40) continue;
    // The crack: a zigzag down from the crown, and the fire's light in it.
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const at = (u: number, w: number): [number, number] => [ex + H * (u * rx * d.wide * cr - w * ry * sr), ey + H * (u * rx * d.wide * sr + w * ry * cr)];
    const zig = [at(-0.1, -0.86), at(0.22, -0.42), at(-0.18, -0.02), at(0.2, 0.38), at(0.02, 0.7)].flat();
    glow(ctx, B, ex, ey, H * ry * 1.1, c.fire, 0.12 + 0.12 * pulse, c.hot);
    softLine(ctx, B, zig, c.fire, Math.max(1, H * 0.009), 0.9);
    softLine(ctx, B, zig, c.hot, Math.max(0.6, H * 0.0035), 0.5 + 0.4 * pulse);
  }
}

/**
 * The breath, smouldering while it waits: a haze over the jaw and embers going up out of it past the
 * crown, each cooling as it rises, never over `ceil` on the canvas. The faint ones are under the
 * silhouette check's ink, and the ones it counts are the pieces it is told of (tools/smoke.ts).
 */
function plume(ctx: CanvasRenderingContext2D, mx: number, my: number, H: number, d: Build, c: Inks, t: number, ceil: number): void {
  for (let i = 0; i < 4; i++) glow(ctx, B, mx + H * 0.012 * i, Math.max(ceil, my - H * (0.03 + i * 0.1)), H * (0.05 + i * 0.014), c.fire, 0.36 - i * 0.07, c.hot);
  for (let i = 0; i < d.embers; i++) {
    const cyc = 60 + 14 * (i % 3), ph = ((t + (i * cyc) / d.embers) % cyc) / cyc;
    const ex = mx + H * (0.03 * ph + Math.sin(t / 8 + i * 2.3) * 0.018), ey = Math.max(ceil, my - H * (0.03 + ph * 0.4));
    const r = Math.max(2, H * 0.025 * (1 - ph * 0.5));
    ctx.fillStyle = rgba(i % 2 ? c.hot : c.fire, 0.95 - ph * 0.8);
    ctx.fillRect(Math.round(ex - r / 2), Math.round(ey - r / 2), Math.max(1, Math.round(r)), Math.max(1, Math.round(r)));
  }
}
