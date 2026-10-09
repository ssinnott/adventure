// The cats: the Snow Lynx first, on one frame the Wold's lions follow (MONSTERS §11). A cat side on to
// the company, its head to the right, in hundredths of the sprite's height up from the ground line,
// posed by a table of where its body, head and legs stand, so a lion's stalk is a table beside the
// lynx's leap: the body a spring from the rump to the chest, deep in the chest, the legs in two
// joints each, thick above and thin below, on big round paws, and a round short-muzzled head with its
// ears up. Drawn as masses: the far legs and the far ear a step darker, the tail, the body and the
// near legs in one blob with the fur on it, the head as a form of its own over the neck, then the
// markings, the mouth, the eye and the claws.
//
// The Snow Lynx: grey, tufted, and it has already jumped. Caught at the top of its leap, the forepaws
// thrown out with the claws in them and the hind legs still stretched from the spring; long black
// tufts on its ears, a ruff of barred fur hanging from its cheeks to a point under the jaw, a bob of
// a tail with a black end, and paws like snowshoes. Idle: it hangs at the top of the leap, the
// forepaws reaching and drawing in, the tail flicking, the jaw opening on its teeth.
//
// The Wold Lion: tawny as the grass, and seen only when it moves. The frame grown long and heavy and
// put down on the ground in a stalk: the shoulders high, the head carried low and level in front of
// them, the belly near the grass, the ears small and round, the muzzle long, and a long tail falling
// from the rump and turned up at its end in a black tuft. No spots, no tufts, no ruff; a pale belly.
// Idle: the near forepaw lifts, reaches and is set down again, slowly, and the tuft swings.
//
// The Grey Lion: old, scarred, and king of all of this. The frame at its heaviest, standing square
// with its head up over a mane that hangs from behind its ears to its chest, dark and grizzled; the
// coat gone grey, three old rakes pale down across the eye and two on the flank. Idle: the tail
// swings, and the jaw opens slowly on its teeth.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['snow_lynx', 'wold_lion', 'grey_lion'];

/**
 * The frame's parts, as proportions of the lynx's where they are numbers (1 = the lynx, 0 = none),
 * so a lion to come is a Build, a colouring and a pose.
 */
interface Build {
  /** Where it stands: the lynx's leap. */
  pose: Pose;
  /** How far it is off the ground, 0 standing: in the air it hangs and drifts, its claws out, its shadow left behind it. */
  air: number;
  /** How deep the body is, and how thick the legs. */
  bulk: number;
  /** The head's size. */
  head: number;
  /** The black tufts on the ear tips, 0 none: the lynx's. */
  tufts: number;
  /** The barred ruff hanging from the cheeks, 0 none: the lynx's. */
  ruff: number;
  /** The tail's length: the lynx's bob is 1. */
  tail: number;
  /** The paws' size: the lynx's snowshoes. */
  paws: number;
  /** The dark spots on the coat, 0 none. */
  spots: number;
  /** The underside's colour, mixed into the tint on the belly, the throat and the inside of the legs. */
  belly: string;
  /** 1 or none the lynx's tall pointed ears; below 1 small round ones: the lions'. */
  ears?: number;
  /** The muzzle's length forward of the eye: the lynx's short one is 1, the lions' longer. */
  muzzle?: number;
  /** How far the jaw opens in the idle: the lynx's 1. */
  jaw?: number;
  /** 0 or none; 1 the near forepaw lifts, reaches and is set down again: the Wold lion's stalk. */
  creep?: number;
  /** A mane from behind the ears over the neck to the chest, 0 or none: the Grey Lion's. */
  mane?: number;
  /** The mane's colour, mixed into the coat. */
  maneHex?: string;
  /** Old scars, pale across the eye and the flank, 0 or none: the Grey Lion's. */
  scars?: number;
  /** The shadow's width: the lynx's in its leap is 1. */
  shadow?: number;
  /** How thick the legs are against the body: the lynx's 1, the lions' leaner. */
  limb?: number;
}
interface Pt { x: number; y: number }
const at = (x: number, y: number): Pt => ({ x, y });
const mixPt = (a: Pt, b: Pt, k: number): Pt => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
const plus = (a: Pt, b: Pt, k = 1): Pt => ({ x: a.x + b.x * k, y: a.y + b.y * k });

/** A leg's four points: the shoulder or hip, the elbow or stifle, the wrist or hock, and the paw. */
type Leg = readonly [Pt, Pt, Pt, Pt];
/**
 * Where everything stands in a pose: the tail as the way it points from the rump, and a long tail's
 * `hang`, the way its end turns to past its middle.
 */
interface Pose { rump: Pt; chest: Pt; head: Pt; fore: Leg; farFore: Leg; hind: Leg; farHind: Leg; tail: Pt; hang?: Pt }
/** At the top of the leap: the body rising to the chest, the forelegs thrown out ahead, the hind legs stretched behind. */
const LEAP: Pose = {
  rump: at(-14, 50), chest: at(10, 60), head: at(22, 76),
  fore: [at(11.5, 57), at(20, 52.5), at(30, 59), at(35.5, 61.5)], farFore: [at(8.5, 55.5), at(16, 46.5), at(25.5, 47.5), at(31, 47)],
  hind: [at(-15, 48.5), at(-23, 38.5), at(-33, 31.5), at(-41, 28)], farHind: [at(-12.5, 50.5), at(-20, 42), at(-29.5, 37), at(-37.5, 34)],
  tail: at(-0.85, 0.5),
};
const LYNX: Build = { pose: LEAP, air: 1, bulk: 1, head: 1, tufts: 1, ruff: 1, tail: 1, paws: 1, spots: 1, belly: '#ece6da' };
/** The stalk, all four on the ground: the shoulders high, the head low and level in front of them, the belly near the grass. */
const STALK: Pose = {
  rump: at(-30, 51), chest: at(17.5, 55), head: at(44.5, 52.5),
  fore: [at(17.5, 50), at(23, 30), at(25.5, 12), at(31, 5.5)], farFore: [at(12, 50), at(8, 30), at(12, 12), at(16, 5.5)],
  hind: [at(-31, 48.5), at(-19, 32.5), at(-35, 15), at(-30, 5.5)], farHind: [at(-27, 50), at(-15, 34), at(-28, 15), at(-23, 5.5)],
  tail: at(-0.7, -0.7), hang: at(-0.8, 0.6),
};
/** Standing square, the head up and the tail hanging from the rump. */
const STAND: Pose = {
  rump: at(-32, 52), chest: at(16, 55), head: at(40, 74),
  fore: [at(16, 52), at(20, 32), at(21, 13), at(25, 6.2)], farFore: [at(10, 52), at(7, 32), at(7, 13), at(11, 6.2)],
  hind: [at(-33, 50), at(-22, 34), at(-36, 15), at(-32, 6.2)], farHind: [at(-28, 51), at(-16, 35), at(-27, 15), at(-23, 6.2)],
  tail: at(-0.55, -0.83), hang: at(-0.85, 0.3),
};
const LION: Build = { pose: STALK, air: 0, bulk: 1.45, head: 1.85, tufts: 0, ruff: 0, tail: 4.9, paws: 1.4, spots: 0, belly: '#ece0c4', ears: 0, muzzle: 1.15, jaw: 0.3, creep: 1, shadow: 1.6, limb: 0.82 };
const GREY: Build = { pose: STAND, air: 0, bulk: 1.62, head: 1.75, tufts: 0, ruff: 0, tail: 4.2, paws: 1.6, spots: 0, belly: '#d6d0c4', ears: 0, muzzle: 1.15, jaw: 0.55, mane: 1.05, maneHex: '#3a3028', scars: 1, shadow: 1.7, limb: 0.85 };

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  cat(ctx, x, y, h, p, kind === 'wold_lion' ? LION : kind === 'grey_lion' ? GREY : LYNX);
};

/** Straight between the points of a table of [s, value]. */
function lerpTable(t: readonly (readonly [number, number])[], s: number): number {
  if (s <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) if (s <= t[i][0]) { const [s0, v0] = t[i - 1], [s1, v1] = t[i]; return v0 + ((v1 - v0) * (s - s0)) / (s1 - s0); }
  return t[t.length - 1][1];
}
/** How high the back stands over the spine, and how deep the belly hangs under it, from the rump (0) to the chest (1). */
const BACK: readonly (readonly [number, number])[] = [[-0.18, 3], [0, 8.8], [0.3, 8], [0.55, 7.4], [0.85, 9.4], [1, 9], [1.14, 4]];
const BELLY: readonly (readonly [number, number])[] = [[-0.18, 3], [0, 8], [0.3, 6.2], [0.55, 6], [0.85, 10.2], [1, 11], [1.14, 5]];

function cat(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const t = p.frame, u = h / 100, L = b.air, K = b.bulk, P = b.pose;
  // In the air it hangs and drifts, and the forepaws reach and draw in while the hind ones trail.
  const lift = L * Math.sin(t / 17) * 1.2, reach = L * Math.sin(t / 17 + 0.6);
  const X = (v: number): number => x + v * u, Y = (v: number): number => y - (v + lift) * u;
  const C = (q: Pt): [number, number] => [X(q.x), Y(q.y)];
  const rump = P.rump, chest = P.chest;
  const out = (leg: Leg, k: number): Leg => [leg[0], plus(leg[1], at(k * 0.5, 0)), plus(leg[2], at(k * 1.2, k * 0.4)), plus(leg[3], at(k * 1.6, k * 0.6))];
  // Creeping, the near forepaw lifts, reaches and is set down again, slowly.
  const step = b.creep ? b.creep * Math.max(0, Math.sin(t / 16)) : 0, fore0 = out(P.fore, reach);
  const fore: Leg = step ? [fore0[0], plus(fore0[1], at(step * 1.6, step * 2)), plus(fore0[2], at(step * 4, step * 6)), plus(fore0[3], at(step * 5.4, step * 6.8))] : fore0;
  const farFore = out(P.farFore, -reach * 0.8), hind = P.hind, farHind = P.farHind;
  const coat = p.base, far = shade(p.dark, 0.95), pale = mix(coat, shade(b.belly, p.tone), 0.8), ink = shade('#16120e', Math.max(0.6, p.tone));
  const len = Math.hypot(chest.x - rump.x, chest.y - rump.y), d = at((chest.x - rump.x) / len, (chest.y - rump.y) / len), n = at(-d.y, d.x);
  const spine = (s: number, off: number): Pt => plus(plus(rump, d, s * len), n, off);
  const r = (q: number): number => q * K * u, lk = b.limb ?? 1, rl = (q: number): number => r(q) * lk;
  const hc = P.head, hr = 8.4 * b.head, mz = b.muzzle ?? 1, round = (b.ears ?? 1) < 1;
  // A longer muzzle draws the head out forward of its middle: the lions'.
  const H = (dx: number, dy: number): Pt => at(hc.x + (mz !== 1 && dx > 0.2 ? 0.2 + (dx - 0.2) * mz : dx) * hr, hc.y + dy * hr);

  // Its shadow on the snow, left behind it a little by the leap.
  groundShadow(ctx, X(-2 - 4 * L), y + 1, (44 - 6 * L) * u * (b.shadow ?? 1));

  // --- the far legs and the far ear, a step darker, behind everything -----------------------------
  blob(ctx, B, far, [
    ...tube(C, farFore, rl(4.6), rl(2.6)), ...tube(C, farHind, rl(6), rl(2.4)),
    paw(C, farFore, 4.2 * b.paws * u, 3 * b.paws * u), paw(C, farHind, 4 * b.paws * u, 2.7 * b.paws * u),
    round
      ? { k: 'ell', x: C(H(-0.8, 0.74))[0], y: C(H(-0.8, 0.74))[1], rx: hr * 0.2 * u, ry: hr * 0.19 * u }
      : { k: 'poly', pts: [...C(H(-0.95, 0.42)), ...C(H(-0.38, 0.7)), ...C(H(-0.9, 1.72))] },
  ], { h, formK: 0.35, tex: 'fur', seed: 51, amount: 0.35 });

  if (P.hang) {
    // --- a lion's tail: long, falling from the rump and turned up at its end in a black tuft that swings
    const sw = Math.sin(t / 13) * 0.22, hang = at(P.hang.x - sw * P.hang.y, P.hang.y + sw * P.hang.x), tl = 9 * b.tail;
    const t0 = spine(-0.08, 5.5), t1 = plus(t0, P.tail, tl * 0.4), t2 = plus(t1, mixPt(P.tail, hang, 0.5), tl * 0.32), t3 = plus(t2, hang, tl * 0.28);
    blob(ctx, B, shade(coat, 0.95), [{ k: 'tube', pts: [...C(t0), ...C(t1), ...C(t2), ...C(t3)], r0: r(2.6), r1: r(1.5) }], { h, formK: 0.4, tex: 'fur', seed: 52, amount: 0.4 });
    const tuft = C(plus(t3, hang, 1.4));
    blob(ctx, B, ink, [{ k: 'ell', x: tuft[0], y: tuft[1], rx: r(2.6), ry: r(1.8), rot: -Math.atan2(hang.y, hang.x) }], { h, formK: 0.3, tex: 'fur', seed: 53, amount: 0.5 });
  } else {
    // --- the tail: a bob off the rump, its end black --------------------------------------------------
    const tailDir = P.tail, flick = Math.sin(t / 11) * 0.14;
    const t0 = spine(-0.08, 5.5), td = at(tailDir.x - flick * tailDir.y, tailDir.y + flick * tailDir.x), tl = 9 * b.tail;
    const t1 = plus(t0, td, tl * 0.55), t2 = plus(t0, td, tl);
    blob(ctx, B, shade(coat, 0.95), [{ k: 'tube', pts: [...C(t0), ...C(t1), ...C(t2)], r0: r(3), r1: r(2.4) }], { h, formK: 0.4, tex: 'fur', seed: 52, amount: 0.4 });
    patch(ctx, B, ink, [{ k: 'ell', x: C(plus(t2, td, -0.6))[0], y: C(plus(t2, td, -0.6))[1], rx: r(2.4), ry: r(2.2) }], { alpha: 0.85, feather: 0.3 });
  }

  // --- the coat: body, haunch, shoulder, neck and near legs, one mass ------------------------------
  const outline: Pt[] = [];
  for (const s of [-0.18, 0, 0.2, 0.4, 0.6, 0.8, 1, 1.14]) outline.push(spine(s, lerpTable(BACK, s) * K));
  for (const s of [1.14, 1, 0.8, 0.6, 0.4, 0.2, 0, -0.18]) outline.push(spine(s, -lerpTable(BELLY, s) * K));
  const rot = -Math.atan2(d.y, d.x);
  blob(ctx, B, coat, [
    { k: 'curve', pts: outline.flatMap(C), wobble: 0.02, spiky: 0.03, seed: 1, sub: 3 },
    { k: 'ell', x: C(spine(0.04, 1))[0], y: C(spine(0.04, 1))[1], rx: r(10), ry: r(10.6), rot },
    { k: 'ell', x: C(spine(0.92, -0.5))[0], y: C(spine(0.92, -0.5))[1], rx: r(7.6), ry: r(10), rot },
    { k: 'cap', x0: C(spine(0.98, 4))[0], y0: C(spine(0.98, 4))[1], x1: X(hc.x - hr * 0.45), y1: Y(hc.y - hr * 0.2), r0: r(8.4), r1: hr * 0.72 * u },
    ...tube(C, hind, rl(7), rl(2.8)), ...tube(C, fore, rl(5.6), rl(3)),
    paw(C, hind, 4.6 * b.paws * u, 3.1 * b.paws * u), paw(C, fore, 5.2 * b.paws * u, 3.6 * b.paws * u),
  ], { h, tex: 'fur', seed: 5, amount: 0.5, formK: 0.4, spread: 0.85, creases: [
    { x0: C(spine(0.76, 7.5 * K))[0], y0: C(spine(0.76, 7.5 * K))[1], x1: C(spine(0.76, -6 * K))[0], y1: C(spine(0.76, -6 * K))[1], r: r(1.6), a: 0.2 },
    { x0: C(spine(0.2, 7.5 * K))[0], y0: C(spine(0.2, 7.5 * K))[1], x1: C(spine(0.2, -5 * K))[0], y1: C(spine(0.2, -5 * K))[1], r: r(1.6), a: 0.18 },
  ] });
  patch(ctx, B, pale, [
    { k: 'curve', pts: [spine(0.05, -5 * K), spine(0.4, -3.6 * K), spine(0.8, -6.5 * K), spine(1.05, -8.5 * K), spine(0.8, -10 * K), spine(0.4, -6.4 * K), spine(0.05, -7.8 * K)].flatMap(C), wobble: 0.06, spiky: 0.05, seed: 21, sub: 2 },
  ], { alpha: 0.72, feather: 0.5 });

  // --- a lion's mane, from behind the ears over the neck to the chest, dark and grizzled -----------
  if (b.mane) {
    const mk = b.mane, maneHex = mix(coat, shade(b.maneHex ?? '#4a4038', p.tone), 0.85), mc = at(hc.x - hr * 0.5, hc.y - hr * 0.25), chestQ = C(spine(0.98, -2));
    blob(ctx, B, maneHex, [
      { k: 'curve', pts: ring(X(mc.x), Y(mc.y), hr * 1.4 * mk * u, hr * 1.45 * mk * u, 20), wobble: 0.1, spiky: 0.14, seed: 61, sub: 3 },
      { k: 'cap', x0: X(hc.x - hr * 0.6), y0: Y(hc.y - hr * 0.7), x1: chestQ[0], y1: chestQ[1], r0: hr * 1.15 * mk * u, r1: r(8.5) },
    ], { h, tex: 'fur', seed: 62, amount: 0.7, formK: 0.4, spread: 0.85 });
    if (!B.override) for (let i = 0; i < 8; i++) {
      // Grizzled: grey hairs combed back and down through it.
      const a = 1.1 + i * 0.5, q0 = at(mc.x + Math.cos(a) * hr * 0.95 * mk, mc.y + Math.sin(a) * hr * 1.0 * mk), q1 = at(q0.x - hr * 0.42 * mk, q0.y - hr * 0.22 * mk);
      softLine(ctx, B, [X(q0.x), Y(q0.y), X(q1.x), Y(q1.y)], mix(maneHex, shade('#d8d4cc', p.tone), 0.5), Math.max(1, 0.6 * u), 0.6);
    }
  }

  // --- the head, a form of its own over the neck: round skull, the ruff, short muzzle, jaw, ear -----
  const gape = (0.5 + 0.5 * Math.sin(t / 13)) * (b.jaw ?? 1);
  const jawTip = H(0.84, -0.6 - 0.22 * gape);
  const head: Part[] = [
    { k: 'curve', pts: ring(X(hc.x), Y(hc.y), hr * u, hr * 0.92 * u, 12), wobble: 0.03, spiky: 0.04, seed: 3, sub: 2 },
    // The muzzle, short and broad, and the lower jaw hanging open under it.
    { k: 'cap', x0: X(H(0.3, -0.16).x), y0: Y(H(0.3, -0.16).y), x1: X(H(0.86, -0.26).x), y1: Y(H(0.86, -0.26).y), r0: hr * 0.5 * u, r1: hr * 0.38 * u },
    { k: 'cap', x0: X(H(0.2, -0.54).x), y0: Y(H(0.2, -0.54).y), x1: X(jawTip.x), y1: Y(jawTip.y), r0: hr * 0.3 * u, r1: hr * 0.2 * u },
    // The near ear, tall and pointed; a lion's small and round.
    round
      ? { k: 'ell', x: C(H(-0.46, 0.84))[0], y: C(H(-0.46, 0.84))[1], rx: hr * 0.22 * u, ry: hr * 0.2 * u }
      : { k: 'poly', pts: [...C(H(-0.62, 0.56)), ...C(H(0.05, 0.8)), ...C(H(-0.36, 1.78))] },
  ];
  // The ruff: barred fur from under the ear round the cheek, hanging to a point under the jaw.
  if (b.ruff > 0) {
    const k = b.ruff;
    head.push({ k: 'curve', pts: [H(-0.98, 0.22), H(-0.8, -0.5), H(-0.42, -0.98 - 0.3 * k), H(-0.1, -1.3 - 0.38 * k), H(0.2, -0.95), H(0.25, -0.4), H(-0.4, 0.1)].flatMap(C), wobble: 0.06, spiky: 0.3 * k, seed: 7, sub: 3 });
  }
  blob(ctx, B, coat, head, { h, tex: 'fur', seed: 9, amount: 0.4, formK: 0.45, spread: 0.85 });
  patch(ctx, B, pale, [
    { k: 'curve', pts: [H(-0.7, -0.45), H(-0.4, -0.95 - 0.28 * b.ruff), H(-0.1, -1.2 - 0.34 * b.ruff), H(0.18, -0.85), H(0.2, -0.45), H(-0.1, -0.35)].flatMap(C), wobble: 0.05, spiky: 0.15, seed: 23, sub: 2 },
    { k: 'ell', x: X(H(0.62, -0.32).x), y: Y(H(0.62, -0.32).y), rx: hr * 0.34 * u, ry: hr * 0.24 * u },
  ], { alpha: 0.6, feather: 0.5 });

  // --- the markings: the spots, the ruff's bars, the ear's black back and its tuft -----------------
  if (b.spots > 0 && !B.override) {
    const spotHex = shade(coat, 0.55);
    for (let i = 0; i < 14; i++) {
      const s = 0.05 + 0.85 * nz(i, 1), off = (nz(i, 2) - 0.3) * 10 * K, q = C(spine(s, off)), rr = (0.7 + 0.6 * nz(i, 3)) * b.spots * u;
      patch(ctx, B, spotHex, [{ k: 'ell', x: q[0], y: q[1], rx: rr * 1.3, ry: rr }], { alpha: 0.55, feather: 0.4 });
    }
    for (const leg of [hind, fore]) for (let i = 0; i < 3; i++) {
      const q = C(mixPt(leg[0], leg[2], 0.3 + i * 0.22)), rr = 0.8 * b.spots * u;
      patch(ctx, B, spotHex, [{ k: 'ell', x: q[0], y: q[1], rx: rr * 1.2, ry: rr }], { alpha: 0.5, feather: 0.4 });
    }
  }
  if (b.ruff > 0 && !B.override) {
    // The ruff's bars: short dark strokes across the hang of it.
    for (let i = 0; i < 4; i++) {
      const a = H(-0.86 + i * 0.2, -0.2 - i * 0.26), z = H(-0.62 + i * 0.2, -0.36 - i * 0.28);
      softLine(ctx, B, [X(a.x), Y(a.y), X(z.x), Y(z.y)], coat, Math.max(1, 0.75 * u), 0.75);
    }
  }
  // The near ear's back, dark, and its tuft standing up off the tip, blown back by the leap.
  if (round) patch(ctx, B, ink, [{ k: 'ell', x: C(H(-0.5, 0.9))[0], y: C(H(-0.5, 0.9))[1], rx: hr * 0.12 * u, ry: hr * 0.1 * u }], { alpha: 0.7, feather: 0.3 });
  else patch(ctx, B, ink, [{ k: 'poly', pts: [...C(H(-0.55, 1.12)), ...C(H(-0.15, 1.15)), ...C(H(-0.36, 1.78))] }], { alpha: 0.8, feather: 0.2 });
  if (b.tufts > 0) {
    const tip = H(-0.36, 1.74), quiver = Math.sin(t / 5) * 0.3, back = (1.2 + 1.6 * L + quiver) * b.tufts;
    const mid = at(tip.x - back * 0.35, tip.y + 3.6 * b.tufts), end = at(tip.x - back, tip.y + 6.6 * b.tufts);
    blob(ctx, B, ink, [{ k: 'tube', pts: [...C(at(tip.x, tip.y - 0.8)), ...C(mid), ...C(end)], r0: Math.max(0.85, 0.85 * u), r1: Math.max(0.5, 0.25 * u) }], { h, form: false });
  }

  // --- the mouth, the nose, the eye and the claws ----------------------------------------------------
  if (!B.override) {
    const m = [H(0.28, -0.44), H(0.88, -0.48), at(jawTip.x - hr * 0.06, jawTip.y + hr * 0.12), H(0.22, -0.58)];
    ctx.fillStyle = shade('#4a1822', Math.max(0.5, p.tone));
    ctx.beginPath(); m.forEach((q, i) => (i ? ctx.lineTo(X(q.x), Y(q.y)) : ctx.moveTo(X(q.x), Y(q.y)))); ctx.closePath(); ctx.fill();
    // Two fangs down from the lip and one up from the jaw.
    ctx.fillStyle = shade('#f0ead8', Math.max(0.6, p.tone));
    for (const [q, dir, l] of [[H(0.76, -0.46), -1, 0.3], [H(0.52, -0.44), -1, 0.2], [at(jawTip.x - hr * 0.16, jawTip.y + hr * 0.14), 1, 0.18]] as const) {
      ctx.beginPath(); ctx.moveTo(X(q.x - hr * 0.07), Y(q.y)); ctx.lineTo(X(q.x + hr * 0.07), Y(q.y)); ctx.lineTo(X(q.x), Y(q.y + dir * hr * l)); ctx.closePath(); ctx.fill();
    }
  }
  const nose = H(1.12, -0.1);
  blob(ctx, B, ink, [{ k: 'ell', x: X(nose.x), y: Y(nose.y), rx: hr * 0.2 * u, ry: hr * 0.15 * u }], { h, form: false, gloss: 0.5 });
  // The eye, amber and wide, with the dark line a lynx carries from its corner down the cheek.
  const e = H(0.42, 0.2), ex = X(e.x), ey = Y(e.y), er = Math.max(1, hr * 0.16 * u);
  softLine(ctx, B, [ex - er * 0.8, ey + er * 0.4, ex - er * 3.4, ey + er * 2.2], coat, Math.max(1, er * 0.6), 0.75);
  eye(ctx, ex, ey, er, p.amber);
  softLine(ctx, B, [ex - er * 1.4, ey - er * 1.3, ex + er * 1.5, ey - er * 1.1], coat, Math.max(1, er * 0.7), 0.7);
  if (b.scars && !B.override) {
    // Old wounds, pale through the coat: three rakes down across the eye and the muzzle, two on the flank.
    const scar = mix(coat, shade('#efe6d6', p.tone), 0.6), w = Math.max(1, 0.55 * u);
    for (let i = 0; i < 3; i++) {
      const a = H(0.12 + i * 0.2, 0.78 - i * 0.06), z = H(0.4 + i * 0.2, -0.28 - i * 0.06);
      softLine(ctx, B, [X(a.x), Y(a.y), X(z.x), Y(z.y)], scar, w, 0.8 * b.scars);
    }
    for (let i = 0; i < 2; i++) {
      const a = C(spine(0.5 + i * 0.12, 6)), z = C(spine(0.38 + i * 0.12, -3));
      softLine(ctx, B, [a[0], a[1], z[0], z[1]], scar, w, 0.7 * b.scars);
    }
  }
  if (L > 0.3) claws(ctx, C, fore, b, u, p.tone);
}

/** A leg: the thigh or upper arm thick from its root to the stifle or elbow, then the lower leg thin to the paw. */
function tube(C: (q: Pt) => [number, number], leg: Leg, r0: number, r1: number): Part[] {
  const rm = r1 + (r0 - r1) * 0.4;
  return [{ k: 'tube', pts: [...C(leg[0]), ...C(leg[1])], r0, r1: rm }, { k: 'tube', pts: [...C(leg[1]), ...C(leg[2]), ...C(leg[3])], r0: rm, r1 }];
}

/** A paw: a round pad at the leg's end, turned along the last joint. */
function paw(C: (q: Pt) => [number, number], leg: Leg, rx: number, ry: number): Part {
  const [x0, y0] = C(leg[2]), [x1, y1] = C(leg[3]);
  return { k: 'ell', x: x1, y: y1, rx, ry, rot: Math.atan2(y1 - y0, x1 - x0) };
}

/** The forepaw's claws, out: four short dark hooks off its leading edge. */
function claws(ctx: CanvasRenderingContext2D, C: (q: Pt) => [number, number], fore: Leg, b: Build, u: number, tone: number): void {
  const [x0, y0] = C(fore[2]), [x1, y1] = C(fore[3]), a = Math.atan2(y1 - y0, x1 - x0), parts: Part[] = [];
  for (let i = 0; i < 4; i++) {
    const s = (i - 1.5) * 1.7 * b.paws * u, reachOut = 4.6 * b.paws * u, bx = x1 + Math.cos(a) * reachOut - Math.sin(a) * s, by = y1 + Math.sin(a) * reachOut + Math.cos(a) * s;
    const ex = bx + Math.cos(a) * 1.4 * u, ey = by + Math.sin(a) * 1.4 * u;
    parts.push({ k: 'tube', pts: [bx, by, ex, ey, ex + Math.cos(a + 1.6) * 1.1 * u, ey + Math.sin(a + 1.6) * 1.1 * u], r0: Math.max(0.7, 0.45 * u), r1: 0.4 });
  }
  blob(ctx, B, shade('#4a443e', Math.max(0.6, tone)), parts, { form: false });
}

/** A ring of n points round (cx, cy), the raw contour a 'curve' part lumps further. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/** Stable 0..1 noise; never from the frame, or the spots would crawl. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}
