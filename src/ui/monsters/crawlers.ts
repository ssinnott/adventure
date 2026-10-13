// The crawlers: the long-legged things that walk the walls and ceilings below the world (MONSTERS §9),
// machines that come down from above. Not the heavy machines' plate riveted on drums (machines.ts), the
// knockers' shells on rods nor the keepers' frames, robed or bare (keepers.ts), and nothing that stands
// as a man does: a spine of plates, each a shield of blackened iron rimmed in worn steel, on a dark rod;
// from the plates long legs, a rod up to a brass knee held high and a thinner rod down to a hooked foot;
// and lamps of a dull red where the spine ends. The chisel's mark is cut small in one plate, as on every
// knocker, keeper and heavy machine (knockers.ts). Drawn front on, as on the wall they come down: the
// legs first, the spine's rod, the plates from the top down, then the head and what it holds with.
//
// The Deep Crawler, the Ways' last run and the Stair's: it comes down from above, on too many legs.
// Head-first down the wall, so its tail is up in the dark and its head is at your feet: seven plates,
// six pairs of legs splayed on the wall and the front pair on the floor, the hook it hangs by off the
// last plate, and a shovel of a head with six lamps across it over a pair of hooked clamps. Idle: a
// wave of steps runs down the legs, each foot lifted and set down, the spine sways after it and the
// clamps open and close.
//
// The Catcher, the Stair's foot: it caught the Hand on these stairs. A crawler built to hold what falls:
// three great plates under the hook it hangs by, coming down onto a hood with a band of five lamps; from
// the hood's rim a cage of seven hooked arms closed to the floor, one of the Hand slumped in it with his
// grey steel arm hung out through the bars. Two pairs of long legs stand it over the cage, the knees
// high. Idle: the arms ease open as if to let go and close again, the plates sway and the lamps
// breathe.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import { blob, glow, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { chiselMark } from './knockers.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['deep_crawler', 'catcher'];

/** A point, x to the company's right and q up from the ground line, in drawn heights. */
type Pt = readonly [number, number];

/** A crawler's colours: its plates, their worn rims, the rods of its legs and spine, the brass at its knees, its lamps and their hot cores. */
interface Iron { plate: string; rim: string; rod: string; brass: string; lamp: string; core: string }
const IRON: Iron = { plate: '#4a454d', rim: '#aea496', rod: '#2c292e', brass: '#a87c40', lamp: '#e2341e', core: '#ffd6bc' };
/** The Hand's grey steel and the champion's robe (cultist.ts), on the one the Catcher holds. */
const STEEL = '#9ea6b4', ROBE = '#4a2c2c';

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  // The Catcher is a tall boss: its crown stands under 0.82 of its height, where its markers go.
  if (kind === 'catcher') catcher(ctx, x, y, h * 0.8, p);
  else crawler(ctx, x, y, h * 0.97, p);
};

/** Where a drawing stands: its height in px, and heights mapped to the canvas. */
interface F { H: number; X: (v: number) => number; Y: (v: number) => number }
const at = (x: number, y: number, H: number): F => ({ H, X: (v) => x + H * v, Y: (v) => y - H * v });
const map = (f: F, a: readonly number[]): number[] => a.map((v, i) => (i % 2 ? f.Y(v) : f.X(v)));

/** The iron as it stands at this distance; the rims and the lamps keep some light. */
function iron(tone: number): Iron {
  const k = (hex: string): string => shade(hex, tone);
  return { plate: k(IRON.plate), rim: shade(IRON.rim, Math.max(0.7, tone)), rod: k(IRON.rod), brass: k(IRON.brass), lamp: shade(IRON.lamp, Math.max(0.75, tone)), core: shade(IRON.core, Math.max(0.8, tone)) };
}

/** A line of light on the iron, a lit rim or a worn edge. Not drawn in the hit flash. */
function light(ctx: CanvasRenderingContext2D, pts: readonly number[], hex: string, wd: number, a: number): void {
  if (B.override) return;
  ctx.strokeStyle = rgba(hex, a); ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

/** A leg as parts of one mass: a rod from its root up to the knee, a thinner one down to the foot, and the foot's hook. */
function leg(f: F, root: Pt, knee: Pt, foot: Pt, hook: Pt, w = 1): Part[] {
  const { H, X, Y } = f;
  return [
    { k: 'cap', x0: X(root[0]), y0: Y(root[1]), x1: X(knee[0]), y1: Y(knee[1]), r0: H * 0.017 * w, r1: H * 0.013 * w },
    { k: 'cap', x0: X(knee[0]), y0: Y(knee[1]), x1: X(foot[0]), y1: Y(foot[1]), r0: H * 0.012 * w, r1: H * 0.009 * w },
    { k: 'cap', x0: X(foot[0]), y0: Y(foot[1]), x1: X(foot[0] + hook[0]), y1: Y(foot[1] + hook[1]), r0: H * 0.009 * w, r1: H * 0.005 * w },
  ];
}

/** A plate of the spine at (cx, cq), `w` half wide and `d` half deep: a shield of iron broad at its top and rounded below, its keel and its lit rim. */
function plate(ctx: CanvasRenderingContext2D, f: F, c: Iron, cx: number, cq: number, w: number, d: number, seed: number): void {
  const M = (a: readonly number[]): number[] => map(f, a.map((v, i) => (i % 2 ? cq + v * d : cx + v * w)));
  blob(ctx, B, c.plate, [{ k: 'curve', pts: M([-1, 0.5, -0.84, -0.42, -0.45, -0.92, 0, -1.02, 0.45, -0.92, 0.84, -0.42, 1, 0.5, 0.8, 0.95, 0, 1.06, -0.8, 0.95]), wobble: 0.015, seed, sub: 2 }],
    { h: f.H, formK: 0.45, gloss: 0.5, spread: 0.7, tex: 'stipple', seed, amount: 0.25 });
  light(ctx, M([-0.86, 0.62, -0.42, 0.97, 0, 1.03, 0.42, 0.97, 0.86, 0.62]), c.rim, Math.max(1, f.H * 0.008), 0.55);
  softLine(ctx, B, M([0, 0.8, 0, -0.75]), c.plate, Math.max(1, f.H * 0.007), 0.45);
}

/** A lamp at (cx, cq), `r` across: a dull red glass with a hot core, and its light on what is near. */
function lamp(ctx: CanvasRenderingContext2D, f: F, c: Iron, cx: number, cq: number, r: number, a: number): void {
  const x = f.X(cx), y = f.Y(cq), R = f.H * r;
  glow(ctx, B, x, y, R * 3.4, c.lamp, a, c.core);
  blob(ctx, B, c.lamp, [{ k: 'ball', x, y, r: R }], { h: f.H, outline: false, form: false, gloss: 1 });
  blob(ctx, B, c.core, [{ k: 'ball', x: x - R * 0.2, y: y - R * 0.2, r: R * 0.42 }], { h: f.H, outline: false, form: false });
}

/** The tail off the last plate, from (x0, q0): a hook it hangs by, curled over to the company's right, its crown at 0.985. */
function tail(f: F, x0: number, q0: number, x1: number): Part {
  return { k: 'tube', pts: map(f, [x0, q0, x1, 0.95, x1 + 0.012, 0.975, x1 + 0.04, 0.979, x1 + 0.062, 0.962, x1 + 0.058, 0.944]), r0: f.H * 0.017, r1: f.H * 0.007 };
}

/** The chisel's mark at (cx, cq), `s` high, cut into a plate (knockers.ts). */
function mark(ctx: CanvasRenderingContext2D, f: F, cx: number, cq: number, s: number, plateHex: string): void {
  chiselMark(ctx, { u: f.H / 100, X: (v) => f.X(v / 100), Y: (v) => f.Y(v / 100) }, { x: cx * 100, y: cq * 100 }, s * 100, 0, plateHex);
}

/**
 * The Deep Crawler, in drawn heights up from the ground line: the head at 0.06 to 0.23, the plates'
 * middles from 0.255 up by tenths and the tail's spines to 0.97. x runs to the company's right.
 */
function crawler(ctx: CanvasRenderingContext2D, x: number, y: number, H: number, p: Paint): void {
  const f = at(x, y, H), c = iron(p.tone), t = p.frame, M = (a: readonly number[]): number[] => map(f, a);
  const pulse = 0.5 + 0.5 * p.breathe;
  /** The spine's sway at height q: none at the head, the most at the tail, a wave running up it. */
  const sway = (q: number): number => 0.03 * Math.max(0, Math.min(1, (q - 0.2) / 0.7)) * Math.sin(q * 5.2 - t / 21);
  /** A foot's lift, 0..1: the steps run down the legs from the tail, the two sides half a beat apart. */
  const lift = (j: number, s: number): number => { const u = (((t / 90 - (5 - j) * 0.12 + (s > 0 ? 0.5 : 0)) % 1) + 1) % 1; return u < 0.24 ? Math.sin((u / 0.24) * Math.PI) : 0; };
  const cq = (i: number): number => 0.255 + 0.1 * i, W = [0.092, 0.09, 0.086, 0.08, 0.072, 0.062, 0.05];
  // Each pair's knee, foot and hook on the company's right, the left mirrored: the front pair on the
  // floor, the rest splayed on the wall and reaching higher as they go up.
  const LEGS: readonly (readonly [Pt, Pt, Pt])[] = [
    [[0.2, 0.31], [0.3, 0.012], [-0.04, -0.006]],
    [[0.245, 0.44], [0.37, 0.19], [-0.025, -0.03]],
    [[0.265, 0.56], [0.405, 0.38], [-0.015, -0.035]],
    [[0.255, 0.67], [0.405, 0.575], [-0.005, -0.038]],
    [[0.225, 0.78], [0.365, 0.755], [0.006, -0.038]],
    [[0.185, 0.88], [0.3, 0.9], [0.014, -0.034]],
  ];

  groundShadow(ctx, x, y + 1, H * 0.7);

  // 1. The legs, a pair to every plate but the last, and the last plate's two long spines; brass knees.
  const legs: Part[] = [], knees: Part[] = [];
  LEGS.forEach(([knee, foot, hook], j) => {
    for (const s of [-1, 1]) {
      const l = lift(j, s), q = cq(j), sw = sway(q);
      const k: Pt = [s * (knee[0] + 0.008 * l) + sw * 0.5, knee[1] + 0.02 * l];
      legs.push(...leg(f, [sw + s * W[j] * 0.75, q - 0.01], k, [s * (foot[0] - 0.014 * l), foot[1] + 0.03 * l], [s * hook[0], hook[1]]));
      knees.push({ k: 'ball', x: f.X(k[0]), y: f.Y(k[1]), r: H * 0.019 });
    }
  });
  const top = cq(6);
  legs.push(tail(f, sway(top), top + 0.03, sway(0.95)));
  blob(ctx, B, c.rod, legs, { h: H, formK: 0.35, gloss: 0.4 });
  blob(ctx, B, c.brass, knees, { h: H, formK: 0.5, gloss: 0.6 });

  // 2. The spine's rod, and on it the plates from the tail down, each over the one above it.
  const spine: number[] = [];
  for (let q = 0.17; q <= top + 0.045; q += 0.05) spine.push(sway(q), q);
  blob(ctx, B, c.rod, [{ k: 'tube', pts: M(spine), r0: H * 0.034, r1: H * 0.022 }], { h: H, formK: 0.3 });
  for (let i = 6; i >= 0; i--) plate(ctx, f, c, sway(cq(i)), cq(i), W[i], 0.058, 70 + i);
  mark(ctx, f, sway(cq(1)) + 0.045, cq(1) + 0.005, 0.011, c.plate);

  // 3. The clamps, hooked and worn bright inside, opening and closing; over them the head, a shovel of
  //    iron with six lamps across it in a dark band.
  const open = 0.5 + 0.5 * Math.sin(t / 17), clamps: Part[] = [];
  for (const s of [-1, 1]) clamps.push({ k: 'tube', pts: M([s * 0.05, 0.1, s * 0.075, 0.06, s * (0.05 + 0.012 * open), 0.026, s * (0.014 + 0.02 * open), 0.014]), r0: H * 0.018, r1: H * 0.006 });
  blob(ctx, B, mix(c.plate, c.rim, 0.3), clamps, { h: H, formK: 0.45, gloss: 0.7 });
  for (const s of [-1, 1]) light(ctx, M([s * 0.058, 0.068, s * (0.044 + 0.012 * open), 0.032, s * (0.02 + 0.02 * open), 0.022]), c.rim, Math.max(1, H * 0.006), 0.5);
  blob(ctx, B, c.plate, [{ k: 'curve', pts: M([-0.08, 0.212, -0.094, 0.17, -0.082, 0.115, -0.048, 0.076, 0, 0.064, 0.048, 0.076, 0.082, 0.115, 0.094, 0.17, 0.08, 0.212, 0.04, 0.228, 0, 0.232, -0.04, 0.228]), wobble: 0.015, seed: 81, sub: 2 }],
    { h: H, formK: 0.5, gloss: 0.55, spread: 0.7, tex: 'stipple', seed: 82, amount: 0.3 });
  light(ctx, M([-0.078, 0.2, -0.04, 0.222, 0, 0.226, 0.04, 0.222, 0.078, 0.2]), c.rim, Math.max(1, H * 0.009), 0.6);
  softLine(ctx, B, M([0, 0.2, 0, 0.17]), c.plate, Math.max(1, H * 0.007), 0.45);
  patch(ctx, B, '#0c0a0e', [{ k: 'ell', x: f.X(0), y: f.Y(0.152), rx: H * 0.086, ry: H * 0.026 }], { alpha: 0.75, feather: 0.4 });
  for (const [lx, lq, r] of [[0.024, 0.152, 0.014], [0.05, 0.16, 0.011], [0.072, 0.146, 0.008]] as const) for (const s of [-1, 1]) lamp(ctx, f, c, s * lx, lq, r, 0.32 + 0.16 * pulse);
}

/**
 * The Catcher, in drawn heights up from the ground line: the cage from the floor to its rim at 0.47,
 * the hood to 0.67, the plates' middles at 0.71, 0.81 and 0.905 and the spines to 0.98; the feet
 * stand out to 0.55 either side. x runs to the company's right.
 */
function catcher(ctx: CanvasRenderingContext2D, x: number, y: number, H: number, p: Paint): void {
  const f = at(x, y, H), c = iron(p.tone), t = p.frame, M = (a: readonly number[]): number[] => map(f, a);
  const pulse = 0.5 + 0.5 * p.breathe, k = (hex: string): string => shade(hex, p.tone);
  /** The sway of the plates at height q: the hood and the cage hang still, the plates above move. */
  const sway = (q: number): number => 0.016 * Math.max(0, Math.min(1, (q - 0.6) / 0.35)) * Math.sin(t / 27 + q * 4);
  /** How far the cage's arms stand open, 0..1: they ease out as if to let go, and close again. */
  const flex = 0.5 + 0.5 * Math.sin(t / 23);
  /** An arm of the cage at its angle round the cage (0 the near middle), as a spine from the rim to the hook. */
  const arm = (a: number): number[] => {
    const sx = Math.sin(a);
    return M([0.19 * sx, 0.475, 0.268 * sx, 0.36, (0.29 + 0.02 * flex) * sx, 0.235, (0.235 + 0.03 * flex) * sx, 0.1, (0.1 + 0.06 * flex) * sx, 0.016, (0.04 + 0.05 * flex) * sx, 0.055]);
  };
  const ARMS = [0, 1, 2, 3, 4, 5, 6].map((i) => (i * 2 * Math.PI) / 7 - (i > 3 ? 2 * Math.PI : 0));
  const near = ARMS.filter((a) => Math.cos(a) > 0), far = ARMS.filter((a) => Math.cos(a) <= 0);
  const PLATES: readonly (readonly [number, number, number])[] = [[0.905, 0.08, 0.05], [0.81, 0.11, 0.056], [0.71, 0.14, 0.064]];
  /** A long leg on side s: its root, knee, foot and hook; the knees shift as it takes its weight. */
  const stand = (s: number, root: Pt, knee: Pt, foot: Pt, w: number): Part[] => {
    const l = 0.012 * Math.sin(t / 31 + s + knee[1] * 6);
    return leg(f, [s * root[0] + sway(root[1]), root[1]], [s * knee[0], knee[1] + l], [s * foot[0], foot[1]], [-s * 0.028, -0.024], w);
  };

  groundShadow(ctx, x, y + 1, H * 1.06);

  // 1. The far legs, a step darker, behind everything.
  const farLegs = [-1, 1].flatMap((s) => stand(s, [0.1, 0.72], [0.28, 0.935], [0.415, 0.026], 0.95));
  blob(ctx, B, shade(c.rod, 0.8), farLegs, { h: H, formK: 0.3, gloss: 0.3 });
  blob(ctx, B, shade(c.brass, 0.7), [-1, 1].map((s): Part => ({ k: 'ball', x: f.X(s * 0.28), y: f.Y(0.935 + 0.012 * Math.sin(t / 31 + s + 0.935 * 6)), r: H * 0.022 })), { h: H, formK: 0.5, gloss: 0.4 });

  // 2. The cage's far arms; its shadowed inside, and the one of the Hand it holds, slumped against the
  //    far bars: the champion's robe, his breastplate and his helm fallen to one side.
  blob(ctx, B, shade(c.rod, 0.85), far.map((a): Part => ({ k: 'tube', pts: arm(a), r0: H * 0.022, r1: H * 0.01 })), { h: H, formK: 0.3, gloss: 0.4 });
  patch(ctx, B, '#0a080c', [{ k: 'curve', pts: M([-0.19, 0.47, -0.268, 0.36, -0.29, 0.235, -0.235, 0.1, -0.1, 0.02, 0, 0.014, 0.1, 0.02, 0.235, 0.1, 0.29, 0.235, 0.268, 0.36, 0.19, 0.47, 0, 0.46]) }], { alpha: 0.62, feather: 0.3 });
  const steel = shade(STEEL, p.tone * 0.72);
  blob(ctx, B, k(ROBE), [{ k: 'curve', pts: M([-0.16, 0.026, -0.175, 0.11, -0.12, 0.19, -0.02, 0.215, 0.08, 0.18, 0.14, 0.09, 0.13, 0.022, 0, 0.016]), wobble: 0.05, seed: 91, sub: 2 }], { h: H, formK: 0.35, tex: 'folds', seed: 92, amount: 0.5 });
  blob(ctx, B, steel, [{ k: 'ell', x: f.X(-0.03), y: f.Y(0.175), rx: H * 0.075, ry: H * 0.044, rot: 0.2 }], { h: H, formK: 0.5, gloss: 0.35 });
  // the helm, closed, fallen to his left: a dome over a long cheek, the slit dark where the embers were
  blob(ctx, B, steel, [{ k: 'curve', pts: M([-0.128, 0.262, -0.112, 0.292, -0.078, 0.302, -0.05, 0.288, -0.04, 0.25, -0.052, 0.205, -0.082, 0.196, -0.11, 0.212]), wobble: 0.02, seed: 93, sub: 2 }], { h: H, formK: 0.55, gloss: 0.35 });
  softLine(ctx, B, M([-0.122, 0.258, -0.05, 0.244]), steel, Math.max(1, H * 0.009), 0.85);

  // 3. The cage's near arms over him, worn bright on their curve, and his arm hung out through the bars
  //    to the floor, the gauntlet's fingers open on it.
  blob(ctx, B, c.rod, near.map((a): Part => ({ k: 'tube', pts: arm(a), r0: H * 0.026, r1: H * 0.012 })), { h: H, formK: 0.4, gloss: 0.55 });
  for (const a of near) { const s = arm(a); light(ctx, s.slice(4, 10).map((v, i) => (i % 2 ? v : v - H * 0.008)), c.rim, Math.max(1, H * 0.006), 0.4); }
  blob(ctx, B, shade(steel, 0.85), [
    { k: 'tube', pts: M([0.03, 0.186, 0.105, 0.15, 0.118, 0.09, 0.122, 0.042]), r0: H * 0.02, r1: H * 0.016 },
    { k: 'ell', x: f.X(0.125), y: f.Y(0.03), rx: H * 0.022, ry: H * 0.017 },
    ...[[-0.02, 0.014], [0.002, 0.008], [0.022, 0.012]].map(([dx, q]): Part => ({ k: 'cap', x0: f.X(0.125), y0: f.Y(0.026), x1: f.X(0.125 + dx), y1: f.Y(q), r0: H * 0.007, r1: H * 0.005 })),
  ], { h: H, formK: 0.45, gloss: 0.35 });

  // 4. The spine's rod and its plates from the top down, coming down onto the hood, and the hook it
  //    hangs by off the last plate, as the crawler's.
  blob(ctx, B, c.rod, [
    { k: 'tube', pts: M([sway(0.56), 0.56, sway(0.7), 0.7, sway(0.84), 0.84, sway(0.93), 0.93]), r0: H * 0.045, r1: H * 0.03 },
    tail(f, sway(0.92), 0.92, sway(0.95)),
  ], { h: H, formK: 0.3, gloss: 0.4 });
  PLATES.forEach(([q, w, d], i) => plate(ctx, f, c, sway(q), q, w, d, 60 + i));
  mark(ctx, f, sway(0.71) + 0.07, 0.705, 0.012, c.plate);

  // 5. The near legs, standing it over the cage from the hood's shoulders; then the hood, and its band
  //    of lamps over the cage.
  const nearLegs = [-1, 1].flatMap((s) => stand(s, [0.19, 0.56], [0.38, 0.83], [0.53, 0.026], 1.3));
  blob(ctx, B, c.rod, nearLegs, { h: H, formK: 0.35, gloss: 0.45 });
  blob(ctx, B, c.brass, [-1, 1].map((s): Part => ({ k: 'ball', x: f.X(s * 0.38), y: f.Y(0.83 + 0.012 * Math.sin(t / 31 + s + 0.83 * 6)), r: H * 0.025 })), { h: H, formK: 0.5, gloss: 0.6 });
  blob(ctx, B, c.plate, [{ k: 'curve', pts: M([-0.215, 0.5, -0.2, 0.56, -0.14, 0.62, -0.07, 0.655, 0, 0.665, 0.07, 0.655, 0.14, 0.62, 0.2, 0.56, 0.215, 0.5, 0.15, 0.468, 0.075, 0.456, 0, 0.452, -0.075, 0.456, -0.15, 0.468]), wobble: 0.015, seed: 71, sub: 2 }],
    { h: H, formK: 0.5, gloss: 0.55, spread: 0.7, tex: 'stipple', seed: 72, amount: 0.3 });
  light(ctx, M([-0.19, 0.57, -0.13, 0.63, -0.065, 0.66, 0, 0.67, 0.065, 0.66, 0.13, 0.63, 0.19, 0.57]), c.rim, Math.max(1, H * 0.009), 0.6);
  softLine(ctx, B, M([-0.205, 0.49, -0.14, 0.472, -0.07, 0.462, 0, 0.459, 0.07, 0.462, 0.14, 0.472, 0.205, 0.49]), c.plate, Math.max(1.5, H * 0.012), 0.55);
  patch(ctx, B, '#0c0a0e', [{ k: 'ell', x: f.X(0), y: f.Y(0.54), rx: H * 0.16, ry: H * 0.032 }], { alpha: 0.75, feather: 0.4 });
  for (const [lx, r] of [[0, 0.019], [0.062, 0.016], [-0.062, 0.016], [0.12, 0.012], [-0.12, 0.012]] as const) lamp(ctx, f, c, lx, 0.535 + 0.012 * (1 - (lx / 0.12) ** 2), r, 0.34 + 0.2 * pulse);
}
