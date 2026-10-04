// The salamanders: the Salamander first, on one frame the Great Salamander crusts, horns and opens,
// Ashfall's ember salamander burns brighter and the Wold's basilisk cools and crowns. A lizard coming
// at the company three-quarter on, built in model units and seen from a little above: the body runs
// back from the shoulders to the hips toward the company's left, low between legs that sprawl to
// either side, elbows and knees out, the hands and feet flat on the ground with their fingers fanned;
// the tail lies along the ground behind and curls round at its tip. The head is turned on round
// toward the company's right, so the snout's length shows: broad and flat, the snout blunt, the
// mouth round the front of it and down to the hinges as a lizard's runs, and the eyes bulging up out
// of the skull at its corners under a heavy brow, a slit of a pupil in each. Under the skin is fire:
// where the skin is thin it shows through, in blotches down the back, behind the eyes and along the
// tail the way a fire salamander wears its yellow, brightest at their hearts, and it flickers. Embers
// come off the back and rise: those are the parts apart, declared in tools/smoke.ts. Drawn as masses:
// the far legs a step darker, the skin in one blob (the tail, the body and the near legs), the fire on
// it, then the head, nearest of all, from the bottom up (the jaw, the floor of the mouth, the skull),
// then the embers. Every kind is fitted to the same crown, on its pose at rest, so a bigger head makes
// a smaller body behind it.
//
// The Salamander: a lizard with the fire showing through its skin. Charcoal, the fire gold and
// orange. Idle: the throat pumps, the fire breathes and flickers, the tail's tip curls, and now and
// then it bobs its head as a lizard does and the mouth parts on the fire inside.
//
// The Great Salamander: the fire in the rock, with a head. Its kin grown old in the deepest chamber,
// heavy, the skin gone to a crust of rock over the fire, split in plates with the fire in every seam,
// a ridge of rock plates down its spine and claws on its fingers. The head is the most of it, half as
// big again against its body, horned with rock at the back of the skull, knobbed over the brows and
// the cheeks, and thrown back on a jaw hanging open on a mouth full of fire. Idle: the fire in the
// seams swells and sinks as it breathes, the jaw works, the embers rise, and now and then it heaves.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B } from './common.ts';
import { blob, glow, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['salamander', 'great_salamander'];

/**
 * The frame's parts, as proportions of the salamander's (1 = the salamander, 0 = none), each named
 * for the kind that pushes it furthest, so the great salamander, the ember salamander and the
 * basilisk are a Build and a colouring.
 */
interface Build {
  /** Length of the body from the shoulders to the hips: the ember salamander's is lither. */
  length: number;
  /** Girth of the body and of the limbs: the great salamander is heavy. */
  bulk: number;
  /** Size of the head against the body: the great salamander's is half as big again. */
  head: number;
  /** Length of the snout: the basilisk's is pointed, a salamander's blunt. */
  snout: number;
  /** How far the jaw hangs open, 0 shut: the great salamander's mouth full of fire. */
  gape: number;
  /** How high the head is carried. */
  rear: number;
  /** How hard it bobs its head now and then, as a lizard does: the great salamander only heaves. */
  bob: number;
  /** Length of the tail. */
  tail: number;
  /** The blotches the fire shows through, 0 none: the salamander's, as a fire salamander's yellow. */
  blotches: number;
  /** A crust of rock over the fire, split in seams it shows through, 0 a skin: the great salamander's. */
  crust: number;
  /** A ridge down the spine, 0 none: the great salamander's rock; the basilisk's crest. */
  ridge: number;
  /** Horns at the back of the skull, 0 none: the great salamander's rock; the basilisk's crown. */
  horns: number;
  /** Size of the eyes: the basilisk's stare. */
  eye: number;
  /** How strongly the fire shows, 0 none: the ember salamander's brightest, the basilisk's cold. */
  fire: number;
  /** Embers off the back, 0 none. */
  embers: number;
  /** Claws past the fingers, 0 none: the great salamander's. */
  claws: number;
  /** The fire's colours, from its dull edge to its heart: Ashfall's whiter, hotter. */
  deep: string; glow: string; hot: string; core: string;
  /** The eyes' colour. */
  eyeHex: string;
}
const SALAMANDER: Build = {
  length: 1, bulk: 1, head: 1, snout: 1, gape: 0, rear: 1, bob: 1, tail: 1, blotches: 1, crust: 0, ridge: 0, horns: 0, eye: 1, fire: 1, embers: 1, claws: 0,
  deep: '#b8300c', glow: '#ff7a1a', hot: '#ffc23c', core: '#fff2c0', eyeHex: '#ffc23c',
};
/**
 * The Great Salamander: heavy for its length, the crust of rock split into plates with the fire in
 * every seam, a ridge of rock down the spine, horns of rock on the skull, and the head half as big
 * again on the body, the jaw open on the fire.
 */
const GREAT: Build = {
  length: 1.05, bulk: 1.4, head: 1.5, snout: 0.95, gape: 1, rear: 0.8, bob: 0.35, tail: 0.9, blotches: 0, crust: 1, ridge: 1, horns: 1, eye: 0.82, fire: 1.2, embers: 1.4, claws: 1,
  deep: '#c0300a', glow: '#ff6a12', hot: '#ffb22c', core: '#fff0b0', eyeHex: '#ffe680',
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  salamander(ctx, x, y, h, p, kind === 'great_salamander' ? GREAT : SALAMANDER);
};

/** A point of the model: x across to the salamander's right, y up, z back from its head. */
type V3 = readonly [number, number, number];
/** A point on the canvas, and how many canvas pixels a model unit is there. */
type V2 = readonly [number, number, number];

/** How it is seen: turned so its tail runs back to the company's left, from a little above, near. */
const YAW = -0.42, LIFT = 0.48, DEPTH = 260;
const COS = Math.cos(YAW), SIN = Math.sin(YAW);
/** How far the head is turned from the body: on round toward the company's right, so the snout's length shows. */
const HEAD_TURN = -0.2;
/** How high the crown stands, in hundredths of the height: every kind is fitted to it. */
const CROWN = 78;

/** A model point as seen at unit scale: across, up the canvas, and the perspective's scale there. */
function seen(p: V3): V2 {
  const [x, y, z] = p, xr = x * COS + z * SIN, zr = -x * SIN + z * COS, s = DEPTH / (DEPTH + zr);
  return [xr * s, (y + zr * LIFT) * s, s];
}
const mid = (a: number, b: number, k: number): number => a + (b - a) * k;
const lerp3 = (a: V3, b: V3, k: number): V3 => [mid(a[0], b[0], k), mid(a[1], b[1], k), mid(a[2], b[2], k)];

/** Stable 0..1 noise; never seeded from the frame, or the marks would crawl. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/** A rough ring of n points round (cx, cy), `rx` by `ry`, turned by `rot`. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number, seed: number, rot = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, k = 0.8 + nz(seed, i) * 0.4, c = Math.cos(a) * rx * k, s = Math.sin(a) * ry * k;
    o.push(cx + c * Math.cos(rot) - s * Math.sin(rot), cy + c * Math.sin(rot) + s * Math.cos(rot));
  }
  return o;
}

/**
 * The outline of a body through canvas points with a radius at each, round at both ends: a tube
 * that swells and thins along its length, as a lizard's body does from the neck to the tail.
 */
function swell(pts: readonly V2[]): Part {
  const n = pts.length, left: number[] = [], right: number[] = [];
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pts[Math.max(0, i - 1)], [bx, by] = pts[Math.min(n - 1, i + 1)];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, r = pts[i][2];
    left.push(pts[i][0] - (dy / len) * r, pts[i][1] + (dx / len) * r);
    right.push(pts[i][0] + (dy / len) * r, pts[i][1] - (dx / len) * r);
  }
  const out: number[] = [...left];
  // Each cap runs from the side that just ended round the outside to the side that starts next.
  const cap = (i: number, from: number): void => { const [cx, cy, r] = pts[i]; for (let k = 1; k < 8; k++) { const a = from - (k / 8) * Math.PI; out.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } };
  cap(n - 1, Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0]) + Math.PI / 2);
  for (let i = n - 1; i >= 0; i--) out.push(right[i * 2], right[i * 2 + 1]);
  cap(0, Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]) - Math.PI / 2);
  return { k: 'curve', pts: out, wobble: 0, sub: 1 };
}

/** The lizard's head bob, 0..1: twice in quick succession, then still for a long while. */
function bobAt(frame: number): number {
  const t = frame % 150;
  if (t >= 36) return 0;
  const k = Math.sin((t / 36) * Math.PI * 2);
  return k > 0 ? k : 0;
}

/** A leg in model units: the shoulder or the hip, the elbow or the knee, the wrist or the ankle; `side` -1 the near (left), 1 the far. */
interface Limb { s: V3; e: V3; w: V3; side: number }

/** A body's girth along a run of model points: x, y, z and the half-girth there. */
type Run = readonly (readonly [number, number, number, number])[];

/** The salamander in model units, at a moment of its idle: where the spine, the tail, the legs and the head are. */
interface Pose {
  SPINE: Run; TAIL: Run;
  nearFore: Limb; farFore: Limb; nearHind: Limb; farHind: Limb;
  /** A point of the head, in head units, as a point of the model. */
  toBody: (q: V3) => V3;
  /** The ridge's plates. */
  plates: readonly Plate[];
}

/** A point on a body's surface at run point i (between them by fraction), `a` round from the top toward the near side, `out` of the girth. */
function onBody(pts: Run, i: number, a: number, out = 0.9): V3 {
  const j = Math.max(0, Math.min(pts.length - 1.001, i)), i0 = Math.floor(j), q = j - i0;
  const [ax, ay, az, ar] = pts[i0], [bx, by, bz, br] = pts[Math.min(pts.length - 1, i0 + 1)], r = mid(ar, br, q) * out;
  return [mid(ax, bx, q) - Math.sin(a) * r, mid(ay, by, q) + Math.cos(a) * r, mid(az, bz, q)];
}

/** The model at a head bob, a breath and a curl of the tail, all 0 at rest. */
function pose(b: Build, bob: number, breath: number, curl: number): Pose {
  const L = b.length, K = b.bulk, H = b.head, R = b.rear, T = b.tail;
  // The spine from the neck to the tail's root, with the body's half-girth at each point: the belly
  // a hand off the ground, the shoulders a little over the hips.
  const g = 1 + breath * 0.025;
  const SPINE: Run = [
    [0, 17.5 + 3 * R + bob * 1.5, 2, 7.8 * K],
    [0, 15.5 + 2 * R + bob, 13 * L, 10.4 * K * g],
    [0, 14, 27 * L, 11.2 * K * g],
    [0, 13.2, 40 * L, 10.6 * K * g],
    [0, 11.4, 50 * L, 8.2 * K],
  ];
  // The tail on from the root along the ground, curling round at its tip toward the company's side.
  const z0 = 50 * L;
  const TAIL: Run = [
    [0, 12, z0, 9 * K],
    [-3, 8.5 * K, z0 + 11 * T, 7.4 * K],
    [-10, 6 * K, z0 + 21 * T, 5.6 * K],
    [-20, 4.4 * K, z0 + 27 * T, 4.2 * K],
    [-29 + curl * 0.3, 3.4 * K, z0 + 26 * T, 3.1 * K],
    [-34 + curl * 0.6, 2.8 * K, z0 + 19 * T, 2.2 * K],
    [-33 + curl, 2.4 * K, z0 + 12 * T + curl * 0.4, 1.2],
  ];
  // The legs sprawl: the elbow out and back of the shoulder, the forearm down and forward to the
  // hand; the knee out and forward of the hip, the shin down and back to the foot.
  const sh = SPINE[1], hp = SPINE[3];
  const fore = (side: number): Limb => ({ s: [side * 9 * K, sh[1] - 1, sh[2] + 1], e: [side * (9 * K + 11), 10.5 * Math.sqrt(K), sh[2] + 5], w: [side * (9 * K + 10.5), 2.2, sh[2] - 4], side });
  const hind = (side: number): Limb => ({ s: [side * 8.5 * K, hp[1] - 1, hp[2]], e: [side * (8.5 * K + 12.5), 10.5 * Math.sqrt(K), hp[2] - 6], w: [side * (8.5 * K + 12.5), 2.2, hp[2] + 6], side });
  // The head: its centre in front of the neck, raised, turned on round from the body toward the
  // company's right, and thrown back the further the wider its jaw hangs, so the mouth opens to them.
  const HC: V3 = [0, 20 + 5 * R + bob * 2.5, -7];
  const dc = Math.cos(HEAD_TURN), ds = Math.sin(HEAD_TURN), pc = Math.cos(b.gape * 0.3), ps = Math.sin(b.gape * 0.3);
  const toBody = (q: V3): V3 => {
    const [x, y1, z1] = q, z = z1 < -4 ? -4 + (z1 + 4) * b.snout : z1, y2 = (y1 * pc - z * ps) * H, zz = (y1 * ps + z * pc) * H;
    return [HC[0] + x * H * dc + zz * ds, HC[1] + y2, HC[2] - x * H * ds + zz * dc];
  };
  // The ridge's plates, rooted in the spine and the tail, the tallest over the shoulders.
  const plates: Plate[] = b.ridge > 0 ? [
    ...[0.3, 0.9, 1.5, 2.1, 2.7, 3.3, 3.9].map((i): Plate => [onBody(SPINE, i, 0, 0.9), (3.6 + 3.4 * Math.sin(Math.PI * Math.min(1, (i + 0.4) / 4.6))) * b.ridge]),
    ...[0.6, 1.6, 2.6].map((i, n): Plate => [onBody(TAIL, i, 0, 0.88), (3 - n * 0.7) * b.ridge]),
  ] : [];
  return { SPINE, TAIL, nearFore: fore(-1), farFore: fore(1), nearHind: hind(-1), farHind: hind(1), toBody, plates };
}

function salamander(ctx: CanvasRenderingContext2D, x0: number, y: number, h: number, p: Paint, b: Build): void {
  const t = p.frame, tone = p.tone, K = b.bulk, H = b.head;
  const breath = p.breathe, pump = 0.5 + 0.5 * Math.sin(t / 6), bob = bobAt(t) * b.bob;
  // The fire breathes with the body and dims a little with distance; it is its own light, never toned.
  const fire = b.fire * (0.8 + 0.2 * tone) * (0.88 + 0.12 * breath);

  // --- the fit, on the pose at rest: the crown at CROWN, the whole centred on x0 ------------------
  const rest = pose(b, 0, 0, 0);
  const tops: V3[] = [...SKULL, ...SOCKET.map(([[sx, sy, sz], r]) => [sx, sy + r * b.eye, sz] as V3), ...(b.horns > 0 ? HORNS.map(([, tip]) => tip) : [])];
  const hips = rest.SPINE[3];
  const crownRaw = Math.max(seen([0, hips[1] + hips[3], hips[2]])[1], ...tops.map((q) => seen(rest.toBody(q))[1]), ...rest.plates.map(([q, tall]) => { const [, c, s2] = seen(q); return c + tall * s2; }));
  const k = (h * CROWN / 100) / crownRaw;
  let lo = Infinity, hi = -Infinity;
  const tl = rest.TAIL;
  for (const q of [rest.nearFore.w, rest.farFore.w, rest.nearHind.w, rest.farHind.w, [tl[4][0] - 3, tl[4][1], tl[4][2]] as V3, [tl[5][0] - 3, tl[5][1], tl[5][2]] as V3, ...SKULL.map(rest.toBody)]) {
    const [sx] = seen(q); lo = Math.min(lo, sx); hi = Math.max(hi, sx);
  }
  const cx = (lo + hi) / 2;
  /** A model point on the canvas, and the pixels a model unit takes there. */
  const S = (q: V3): V2 => { const [a, c, s] = seen(q); return [x0 + (a - cx) * k, y - c * k, s * k]; };

  // --- the pose now ---------------------------------------------------------------------------------
  const { SPINE, TAIL, nearFore, farFore, nearHind, farHind, toBody, plates } = pose(b, bob, breath, Math.sin(t / 17) * 2.2);
  const sh = SPINE[1], hp = SPINE[3];
  const skin = p.base, far = shade(p.dark, 0.82);

  // The shadow on the ground under it, between where the hands and the feet stand.
  if (!B.override) {
    const feet = [nearFore.w, farFore.w, nearHind.w, farHind.w, [0, 0, hp[2]] as V3, [0, 0, sh[2]] as V3].map((q) => S([q[0], 0, q[2]]));
    const xs = feet.map((q) => q[0]), ys = feet.map((q) => q[1]);
    const fx = (Math.min(...xs) + Math.max(...xs)) / 2, fy = (Math.min(...ys) + Math.max(...ys)) / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.33)';
    ctx.beginPath(); ctx.ellipse(fx, fy + 1, (Math.max(...xs) - Math.min(...xs)) * 0.56, Math.max(2, (Math.max(...ys) - Math.min(...ys)) * 0.62), 0, 0, Math.PI * 2); ctx.fill();
  }

  // --- the far legs, a step darker, behind everything ---------------------------------------------
  blob(ctx, B, far, [...limb(S, farFore, 4.6 * K, 3.6 * K, 2.7 * K), ...limb(S, farHind, 5.8 * K, 3.9 * K, 2.7 * K)], { h, formK: 0.35 });
  hand(ctx, S, farFore, 0.9 * Math.sqrt(K), far, b, false, h);
  hand(ctx, S, farHind, 0.95 * Math.sqrt(K), far, b, true, h);

  // --- the skin: the tail, the body and the near legs, one mass -------------------------------------
  const tail = TAIL.map(([tx, ty, tz, r]) => { const [a, c, s] = S([tx, ty, tz]); return [a, c, r * s] as V2; });
  const torso = SPINE.map(([sx, sy, sz, r]) => { const [a, c, s] = S([sx, sy, sz]); return [a, c, r * s] as V2; });
  const body: Part[] = [swell(tail), swell(torso), ...limb(S, nearFore, 5.2 * K, 4 * K, 3 * K), ...limb(S, nearHind, 6.6 * K, 4.3 * K, 3 * K)];
  blob(ctx, B, skin, body, { h, tex: b.crust > 0 ? 'cracks' : undefined, seed: 5, amount: 1.4, formK: 0.4, spread: 0.9 });
  hand(ctx, S, nearFore, 1, skin, b, false, h);
  hand(ctx, S, nearHind, 1.05, skin, b, true, h);

  // --- the ridge of rock down the spine ------------------------------------------------------------
  if (plates.length) ridge(ctx, S, h, plates, b, skin);

  // --- the fire: blotches where the skin is thin, seams where it is rock ---------------------------
  const spots: V2[] = [];
  if (fire > 0) {
    // Two rows down the back from the neck to the hips, a few on the near flank, and along the tail.
    const BL: [V3, number, number][] = [
      [onBody(SPINE, 0.55, 0.45), 3.6, 0], [onBody(SPINE, 0.65, -0.5), 3.4, 1],
      [onBody(SPINE, 1.25, 0.42), 4.4, 2], [onBody(SPINE, 1.45, -0.45), 4, 3],
      [onBody(SPINE, 2.05, 0.4), 4.6, 4], [onBody(SPINE, 2.2, -0.42), 4, 5],
      [onBody(SPINE, 2.85, 0.45), 4.2, 6], [onBody(SPINE, 3.05, -0.4), 3.6, 7],
      [onBody(SPINE, 1.7, 1.2), 3.2, 8], [onBody(SPINE, 2.9, 1.15), 3, 9],
      [onBody(TAIL, 0.8, 0.3), 3.4, 10], [onBody(TAIL, 1.7, 0.25), 2.8, 11], [onBody(TAIL, 2.6, 0.2), 2.2, 12], [onBody(TAIL, 3.6, 0.2), 1.7, 13],
    ];
    for (const [q, r, i] of BL) {
      const at = S(q), kk = b.blotches * (0.75 + 0.25 * Math.sin(t / 5 + i * 1.7));
      spots.push(at);
      if (b.blotches > 0) blotch(ctx, at[0], at[1], r * at[2] * Math.sqrt(K), r * at[2] * 0.72 * Math.sqrt(K), 0.15 + nz(i, 9) * 0.5, i, fire * kk, b, h);
    }
    // And on the near thigh and the near upper arm.
    for (const [l, i] of [[nearHind, 14], [nearFore, 15]] as const) {
      const at = S(lerp3(l.s, l.e, 0.45));
      blotch(ctx, at[0], at[1] - at[2] * 0.6, 2.8 * at[2], 2 * at[2], 0.8, i, fire * b.blotches, b, h);
    }
    if (b.crust > 0) seams(ctx, S, h, SPINE, TAIL, [nearFore, nearHind], fire, b, t);
  }

  // --- the head, nearest of all ---------------------------------------------------------------------
  const gape = Math.min(1, b.gape + (b.gape >= 1 ? 0.1 * Math.sin(t / 19) : 0.32 * bobAt(t + 75)));
  head(ctx, (q) => { const [a, c, s] = S(toBody(q)); return [a, c, s * H]; }, h, b, skin, fire, gape, pump, tone, t);

  // --- the embers, rising off the back, never over the crown ----------------------------------------
  if (!B.override && b.embers > 0 && fire > 0) embers(ctx, spots, b, t, y - h * (CROWN - 3) / 100);
}

// The head, in head units from its centre: x across to its right, y up, z back. A salamander's is
// broad and flat, the snout blunt and rounded, the eyes up at the corners of the skull behind it.
/** The skull: points its outline wraps. */
const SKULL: readonly V3[] = [
  [-3.8, 1.8, -17], [0, 2.1, -18], [3.8, 1.8, -17],                          // the snout's top, at the front
  [-4.6, -2.4, -16.6], [0, -2.6, -17.8], [4.6, -2.4, -16.6],                 // the upper lip round the front
  [-7.6, 3.2, -8], [7.6, 3.2, -8], [-8.2, -3.6, -8], [8.2, -3.6, -8],        // the snout's sides
  [-9.6, 4.4, 0.5], [9.6, 4.4, 0.5], [-10, -5, 1.5], [10, -5, 1.5],          // the cheeks, down to the hinges
  [-8.2, 5.2, 6.5], [0, 5.8, 7.5], [8.2, 5.2, 6.5], [-7.2, -2.4, 8], [7.2, -2.4, 8], // the back of the skull
];
/** The sockets of the eyes, bulging up at the skull's corners: centre and radius. */
const SOCKET: readonly [V3, number][] = [[[-6.9, 4.8, -3.6], 3.2], [[6.9, 4.8, -3.6], 3.2]];
/** The lower jaw, hung from its hinges under the cheeks: points its outline wraps, and its top edge, hinge to hinge. */
const JAW: readonly V3[] = [
  [-4.6, -2.4, -16.2], [0, -2.6, -17.4], [4.6, -2.4, -16.2], [-4.2, -4.8, -15], [0, -5.4, -16.2], [4.2, -4.8, -15],
  [-8.2, -3.6, -7], [8.2, -3.6, -7], [-8, -6.2, -6], [8, -6.2, -6], [-10, -5, 2], [10, -5, 2], [-8.4, -7.4, 1.5], [8.4, -7.4, 1.5],
];
const JAW_EDGE: readonly V3[] = [[10, -5, 2], [8.2, -3.6, -7], [4.6, -2.4, -16.2], [0, -2.6, -17.4], [-4.6, -2.4, -16.2], [-8.2, -3.6, -7], [-10, -5, 2]];
const HINGE = { y: -5, z: 2 };
/** The line of the mouth, round the front of the snout and down to the hinges, a lizard's. */
const LIP: readonly V3[] = [[-10, -5, 1.5], [-8.3, -3.7, -7.5], [-5.2, -2.7, -15.2], [0, -2.7, -17.7], [5.2, -2.7, -15.2], [8.3, -3.7, -7.5], [10, -5, 1.5]];
/** Horns, root and tip: swept back off the back of the skull, knobs over the brows and the cheeks; and the width at the root. */
const HORNS: readonly [V3, V3, number][] = [
  [[-7.6, 5.2, 4], [-10.8, 9.4, 11.5], 2.3], [[7.6, 5.2, 4], [10.8, 9.4, 11.5], 2.3],
  [[-4.2, 7, -4.2], [-5, 9.6, -2.2], 1.2], [[4.2, 7, -4.2], [5, 9.6, -2.2], 1.2],
  [[-9.6, 0.4, 1], [-11.4, 1.6, 3.6], 1.4], [[9.6, 0.4, 1], [11.4, 1.6, 3.6], 1.4],
];

/** The convex outline round a set of canvas points, as a flat list. */
function hull(pts: readonly (readonly [number, number])[]): number[] {
  const q = [...pts].sort((a, c) => a[0] - c[0] || a[1] - c[1]);
  const cross = (o: readonly [number, number], a: readonly [number, number], c: readonly [number, number]): number => (a[0] - o[0]) * (c[1] - o[1]) - (a[1] - o[1]) * (c[0] - o[0]);
  const lower: (readonly [number, number])[] = [], upper: (readonly [number, number])[] = [];
  for (const v of q) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], v) <= 0) lower.pop(); lower.push(v); }
  for (const v of q.reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], v) <= 0) upper.pop(); upper.push(v); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)].flat();
}

/**
 * A leg as parts: the upper limb from the shoulder or the hip to the elbow or the knee, thick, and
 * the lower from there to the wrist or the ankle, with the joint's knob between, so the bend shows.
 */
function limb(S: (q: V3) => V2, l: Limb, r0: number, r1: number, r2: number): Part[] {
  const a = S(l.s), e = S(l.e), w = S(l.w), m1 = S(lerp3(l.s, l.e, 0.55)), m2 = S(lerp3(l.e, l.w, 0.5));
  return [
    { k: 'tube', pts: [a[0], a[1], m1[0], m1[1], e[0], e[1]], r0: r0 * a[2], r1: r1 * e[2] },
    { k: 'ball', x: e[0], y: e[1], r: r1 * 1.02 * e[2] },
    { k: 'tube', pts: [e[0], e[1], m2[0], m2[1], w[0], w[1]], r0: r1 * 0.95 * e[2], r1: r2 * w[2] },
  ];
}

/**
 * A hand or a foot flat on the ground at the wrist: the fingers fanned from in and forward to out
 * and back, each with a round pad at its tip, and claws past the pads on a clawed kind. A hind foot
 * has five toes, the fourth longest; a hand four.
 */
function hand(ctx: CanvasRenderingContext2D, S: (q: V3) => V2, l: Limb, kk: number, hex: string, b: Build, hind: boolean, h: number): void {
  const A = hind ? [-0.15, 0.3, 0.75, 1.2, 2.1] : [-0.2, 0.35, 0.9, 1.45], LEN = hind ? [5.6, 7.4, 8.8, 9.6, 6] : [5.6, 7, 7, 5.8];
  const [wx, , wz] = l.w, w = S([wx, 1.4, wz]), parts: Part[] = [], tips: [V2, V2][] = [];
  for (let i = 0; i < A.length; i++) {
    // Each finger in the ground plane: 0 is forward, a quarter turn is straight out to its side.
    const a = A[i], len = LEN[i] * kk, dx = l.side * Math.sin(a), dz = -Math.cos(a);
    const tip = S([wx + dx * len, 0.9, wz + dz * len]), past = S([wx + dx * (len + 2.4 * b.claws), 0.5, wz + dz * (len + 2.4 * b.claws)]);
    parts.push({ k: 'cap', x0: w[0], y0: w[1], x1: tip[0], y1: tip[1], r0: 1.3 * kk * w[2], r1: 0.8 * kk * tip[2] });
    parts.push({ k: 'ball', x: tip[0], y: tip[1], r: 1.05 * kk * tip[2] });
    tips.push([tip, past]);
  }
  parts.push({ k: 'ell', x: w[0], y: w[1], rx: 3 * kk * w[2], ry: 1.9 * kk * w[2] });
  blob(ctx, B, hex, parts, { h, formK: 0.3, spread: 0.8 });
  if (b.claws > 0) {
    const cl: Part[] = tips.map(([q, r]) => ({ k: 'tube', pts: [q[0], q[1], r[0], r[1]], r0: 0.8 * q[2], r1: 0.3 * r[2] }));
    blob(ctx, B, shade('#1a1412', 1), cl, { h, form: false });
  }
}

/**
 * One blotch of the fire under the skin: a dull red where it starts to show, then orange, then the
 * gold at its heart, each softer-edged than the last, and the light spilling a little past it.
 * `kk` is how strongly it shows this frame. Skipped in the hit flash, which is a flat silhouette.
 */
function blotch(ctx: CanvasRenderingContext2D, bx: number, by: number, rx: number, ry: number, rot: number, i: number, kk: number, b: Build, h: number): void {
  if (B.override || kk <= 0) return;
  const shape = (sx: number, sy: number, seed: number): Part => ({ k: 'curve', pts: ring(bx, by, rx * sx, ry * sy, 8, seed, rot), wobble: 0.12, seed, sub: 2 });
  patch(ctx, B, b.deep, [shape(1.3, 1.35, 40 + i)], { alpha: Math.min(1, 0.75 * kk), feather: 0.6 });
  patch(ctx, B, b.glow, [shape(1, 1, 60 + i)], { alpha: Math.min(1, 0.92 * kk), feather: 0.5 });
  patch(ctx, B, b.hot, [shape(0.6, 0.55, 80 + i)], { alpha: Math.min(1, 0.95 * kk), feather: 0.55 });
  if (rx > 3) patch(ctx, B, b.core, [shape(0.28, 0.26, 100 + i)], { alpha: Math.min(1, 0.7 * kk), feather: 0.7 });
  if (h >= 56) glow(ctx, B, bx, by, Math.max(rx, ry) * 2.2, b.glow, 0.16 * Math.min(1, kk), b.hot);
}

/** A seam of the fire: a soft glow along it, the fire in it, and its hot heart. */
function seam(ctx: CanvasRenderingContext2D, pts: readonly number[], w: number, kk: number, b: Build): void {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const line = (hex: string, a: number, lw: number): void => {
    ctx.strokeStyle = rgba(hex, Math.min(1, a)); ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.stroke();
  };
  line(b.deep, 0.35 * kk, w * 3.2);
  line(b.glow, 0.85 * kk, w * 1.6);
  line(b.hot, 0.95 * kk, Math.max(1, w * 0.8));
}

/**
 * The great salamander's crust: plates of rock over the fire, and the fire in every seam between
 * them. The seams are a net laid over the body and the tail, its corners at steps along them and
 * round them, each pushed a little off its place so that no two plates are alike, the fire brightest
 * where the plates meet; and a seam round each near upper limb. Laid inside the outline, so it adds
 * no ink apart.
 */
function seams(ctx: CanvasRenderingContext2D, S: (q: V3) => V2, h: number, SPINE: Run, TAIL: Run, limbs: readonly Limb[], fire: number, b: Build, t: number): void {
  if (B.override || h < 30) return;
  const pulse = 0.8 + 0.2 * Math.sin(t / 9);
  /** A seam from corner to corner, crooked at its middle as a crack in rock runs. */
  const run = (p0: V3, p1: V3, seed: number, wk: number): void => {
    const [a, c, s0] = S(p0), [d, e, s1] = S(p1), nx = -(e - c), ny = d - a, len = Math.hypot(nx, ny) || 1, j = (nz(seed, 1) - 0.5) * 2 * (s0 + s1) * 0.6;
    seam(ctx, [a, c, mid(a, d, 0.5) + (nx / len) * j, mid(c, e, 0.5) + (ny / len) * j, d, e], Math.max(1, (s0 + s1) * 0.5 * 0.75 * wk), 0.8 * fire * pulse * (0.65 + 0.35 * Math.sin(t / 6 + seed)), b);
  };
  const net = (pts: Run, i0: number, i1: number, di: number, a0: number, a1: number, da: number, seed: number, wk: number): void => {
    const I = Math.round((i1 - i0) / di), A = Math.round((a1 - a0) / da);
    const corner = (m: number, n: number): V3 => {
      const jm = m > 0 && m < I ? (nz(seed + m, n) - 0.5) * 0.55 : 0, jn = n > 0 && n < A ? (nz(seed + 50 + n, m) - 0.5) * 0.5 : 0;
      return onBody(pts, i0 + (m + jm) * di, a0 + (n + jn) * da, 0.98);
    };
    for (let m = 0; m <= I; m++) for (let n = 0; n <= A; n++) {
      if (n < A && m > 0 && m < I) run(corner(m, n), corner(m, n + 1), seed + m * 7 + n, wk);
      if (m < I && n > 0 && n < A) run(corner(m, n), corner(m + 1, n), seed + m * 11 + n * 3 + 100, wk);
      if (m > 0 && m < I && n > 0 && n < A) { const [gx, gy, gs] = S(corner(m, n)); glow(ctx, B, gx, gy, 2.6 * gs, b.glow, 0.3 * fire * pulse, b.hot); }
    }
  };
  net(SPINE, 0, 4, 0.62, -1.3, 2.2, 0.7, 10, 1);
  net(TAIL, 0, 5, 0.85, -0.9, 2, 0.95, 60, 0.8);
  // Round the near upper limbs.
  for (const [n, l] of limbs.entries()) {
    const m = lerp3(l.s, l.e, 0.5);
    run([m[0] + 1.5, m[1] + 4, m[2] - 1], [m[0] + 1.5, m[1] - 4, m[2] + 1], 40 + n, 0.8);
  }
}

/** A plate of the ridge: where it is rooted in the back, and how tall it stands, in model units. */
type Plate = readonly [V3, number];

/**
 * The great salamander's ridge: blunt plates of rock standing up along the spine from the neck to
 * the tail, the tallest over the shoulders and leaning back, each rooted in the back so it stays one
 * piece with it, the fire showing at their roots.
 */
function ridge(ctx: CanvasRenderingContext2D, S: (q: V3) => V2, h: number, plates: readonly Plate[], b: Build, skin: string): void {
  const parts: Part[] = [], roots: V2[] = [];
  for (const [q, tall] of plates) {
    const [x, y, s] = S(q), hgt = tall * s, w = (2.4 + tall * 0.32) * s, lean = -0.35;
    parts.push({ k: 'poly', pts: [x - w, y + s * 1.5, x - w * 0.7 + lean * hgt * 0.3, y - hgt * 0.7, x - w * 0.1 + lean * hgt * 0.5, y - hgt, x + w * 0.55 + lean * hgt * 0.35, y - hgt * 0.78, x + w, y + s * 1.5] });
    roots.push([x, y, s]);
  }
  blob(ctx, B, shade(skin, 0.9), parts, { h, tex: 'cracks', seed: 51, amount: 0.8, form: false, spread: 0.7 });
  if (B.override) return;
  for (const [i, [rx, ry, s]] of roots.entries()) glow(ctx, B, rx, ry, 3.4 * s, b.glow, 0.34 + 0.1 * Math.sin(i * 2.3), b.hot);
}

/**
 * The head, nearest of all and turned part of the way to the company: broad and flat, the snout
 * blunt, the mouth round the front of it and the jaw under, open by `gape` on the fire inside; the
 * eyes up at the corners of the skull in their sockets under a heavy brow; horns of rock on a horned
 * kind. Drawn from the bottom up: the jaw, the floor of the mouth on it with the fire welling up
 * from the throat, then the skull over both. `HS` takes a head point to the canvas, with the pixels
 * a head unit takes there.
 */
function head(ctx: CanvasRenderingContext2D, HS: (q: V3) => V2, h: number, b: Build, skin: string, fire: number, gape: number, pump: number, tone: number, t: number): void {
  const at = (pts: readonly V3[]): number[] => pts.flatMap((q) => { const [x, y2] = HS(q); return [x, y2]; });
  const flat = (pts: readonly V3[]): (readonly [number, number])[] => pts.map((q) => { const [x, y2] = HS(q); return [x, y2] as const; });
  // The jaw swings down about its hinges under the cheeks.
  const a = gape * 0.55, ca = Math.cos(a), sa = Math.sin(a);
  const J = (q: V3): V3 => { const dy = q[1] - HINGE.y, dz = q[2] - HINGE.z; return [q[0], HINGE.y + dy * ca + dz * sa, HINGE.z - dy * sa + dz * ca]; };
  const u = HS([0, 0, -6])[2], open = gape > 0.05;
  const peg = (root: V3, down: number, w: number): void => {
    const [tx, ty] = HS(root), [bx, by] = HS([root[0], root[1] + down, root[2]]);
    ctx.beginPath(); ctx.moveTo(tx - w, ty); ctx.lineTo(tx + w, ty); ctx.lineTo(bx, by); ctx.closePath(); ctx.fill();
  };

  // The jaw, and the throat's pouch under it, swelling as it pumps.
  const [px, py, ps] = HS(J([0, -7.4, -5]));
  blob(ctx, B, skin, [
    { k: 'curve', pts: hull(flat(JAW.map(J))), wobble: 0.01, seed: 22, sub: 2 },
    { k: 'ell', x: px, y: py, rx: 6.5 * ps, ry: (1.8 + pump * 1.3 * (b.gape >= 1 ? 0.4 : 1)) * ps },
  ], { h, tex: b.crust > 0 ? 'cracks' : undefined, seed: 24, amount: 1, formK: 0.45, spread: 0.85, gloss: b.crust > 0 ? 0 : 0.2 });

  // The floor of the mouth, inside the jaw's rim: dark at its edges, and the fire welling up from the throat.
  if (open) {
    blob(ctx, B, shade('#3a0e06', Math.max(0.6, tone)), [{ k: 'poly', pts: at(JAW_EDGE.map(J)) }], { h, form: false });
    if (!B.override && fire > 0) {
      const [gx, gy] = HS(J([0, -4.6, -5])), r = (2 + gape * 7) * u;
      glow(ctx, B, gx, gy, r * 1.4, b.glow, Math.min(0.95, 0.8 * fire), b.core);
      patch(ctx, B, b.hot, [{ k: 'ell', x: gx, y: gy, rx: r * 0.62, ry: r * 0.42 }], { alpha: Math.min(1, 0.5 + 0.45 * fire), feather: 0.75 });
      patch(ctx, B, b.core, [{ k: 'ell', x: gx, y: gy, rx: r * 0.3, ry: r * 0.2 }], { alpha: 0.9, feather: 0.6 });
      // Teeth along the jaw's rim, short dark pegs against the fire.
      if (gape > 0.4 && u > 0.6) {
        ctx.fillStyle = rgba(shade('#2a1810', Math.max(0.7, tone)), 0.92);
        for (const f of [0.22, 0.34, 0.46, 0.54, 0.66, 0.78]) {
          const i = f * (JAW_EDGE.length - 1), i0 = Math.floor(i), q = JAW_EDGE[i0], r1 = JAW_EDGE[i0 + 1];
          peg(J([mid(q[0], r1[0], i - i0), mid(q[1], r1[1], i - i0), mid(q[2], r1[2], i - i0)]), 1.5, 0.55 * u);
        }
      }
    }
  }

  // The skull, the sockets bulging at its corners.
  blob(ctx, B, skin, [
    { k: 'curve', pts: hull(flat(SKULL)), wobble: 0.012, seed: 21, sub: 2 },
    ...SOCKET.map(([c, r]): Part => { const [x, y2, s] = HS(c); return { k: 'ball', x, y: y2, r: r * b.eye * s }; }),
  ], { h, tex: b.crust > 0 ? 'cracks' : undefined, seed: 23, amount: 1, formK: 0.45, spread: 0.85, gloss: b.crust > 0 ? 0 : 0.2 });
  // Teeth hanging from the upper lip.
  if (open && gape > 0.4 && u > 0.6 && !B.override) {
    ctx.fillStyle = rgba(shade('#2a1810', Math.max(0.7, tone)), 0.92);
    for (const f of [0.2, 0.32, 0.44, 0.56, 0.68, 0.8]) {
      const i = f * (LIP.length - 1), i0 = Math.floor(i), q = LIP[i0], r1 = LIP[i0 + 1];
      peg([mid(q[0], r1[0], i - i0), mid(q[1], r1[1], i - i0) + 0.2, mid(q[2], r1[2], i - i0)], -1.8, 0.6 * u);
    }
  }

  // Horns of rock: swept back off the back of the skull, and knobs over the brows and the cheeks.
  if (b.horns > 0) {
    const parts = HORNS.map(([root, tip0, w]): Part => {
      // Each a tapering horn, bowed out and up along its length as a horn grows.
      const tip = lerp3(root, tip0, b.horns), bend: V3 = [mid(root[0], tip[0], 0.5) + Math.sign(root[0]) * 0.8, mid(root[1], tip[1], 0.5) + 1, mid(root[2], tip[2], 0.5)];
      const [x0, y0, s0] = HS(root), [x1, y1] = HS(bend), [x2, y2, s2] = HS(tip);
      return { k: 'tube', pts: [x0, y0, x1, y1, x2, y2], r0: w * s0, r1: 0.4 * s2 };
    });
    blob(ctx, B, shade(skin, 0.92), parts, { h, tex: 'cracks', seed: 31, amount: 0.6, formK: 0.4, spread: 0.75 });
  }

  // The fire behind the eyes, as a fire salamander carries its yellow there, on the crown and on the snout.
  if (b.blotches > 0 && fire > 0) {
    const kk = fire * b.blotches * (0.8 + 0.2 * Math.sin(t / 4.5));
    for (const [q, rx, ry, i] of [[[-7.6, 5.4, 3.6], 3.2, 2.3, 90], [[7.6, 5.4, 3.6], 3, 2.1, 91], [[0, 6.1, 1], 2, 3, 92], [[0, 3.3, -11.5], 1.7, 2.6, 93]] as const) {
      const [x, y2, s] = HS(q);
      blotch(ctx, x, y2, rx * s, ry * s, 0, i, kk * (i > 91 ? 0.85 : 1), b, h);
    }
  }
  if (b.crust > 0 && fire > 0 && !B.override) {
    const w = Math.max(1, u * 0.85), kk = 0.85 * fire * (0.8 + 0.2 * Math.sin(t / 7));
    // Back over the crown between the horns.
    seam(ctx, at([[-2.4, 6, 6.5], [-0.6, 5.7, 2.5], [0.8, 5, -1.5]]), w * 0.8, kk, b);
  }

  if (!B.override) {
    // The mouth's line round the front of the snout and back to the hinges, or the fire between the lips as they part.
    if (!open) softLine(ctx, B, at(LIP.slice(0, 5)), skin, Math.max(1, 1.1 * u), 0.85);
    else if (gape < 0.6 && fire > 0) {
      ctx.strokeStyle = rgba(b.hot, Math.min(1, 0.5 + 0.5 * gape)); ctx.lineWidth = Math.max(1, (0.4 + gape * 1.2) * u); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const lip = at(LIP.slice(1, 5).map((q) => [q[0], q[1] - 0.5, q[2]] as V3));
      ctx.beginPath(); ctx.moveTo(lip[0], lip[1]); for (let i = 2; i < lip.length; i += 2) ctx.lineTo(lip[i], lip[i + 1]); ctx.stroke();
    }
    // The nostrils, two dark points at the front of the snout.
    ctx.fillStyle = rgba('#100a08', 0.8);
    for (const s of [-1, 1]) { const [nx, ny] = HS([s * 2.5, 1.9, -17.2]); ctx.beginPath(); ctx.ellipse(nx, ny, Math.max(0.7, 0.85 * u), Math.max(0.6, 0.55 * u), s * 0.4, 0, Math.PI * 2); ctx.fill(); }
  }

  // The eyes, coals in their sockets with a slit across each, the far one turned away and narrower.
  for (const [c, r] of SOCKET) {
    const s = c[0] < 0 ? -1 : 1, near = s < 0;
    const [ex, ey, es] = HS([c[0] + s * 1.1, c[1] + 0.4, c[2] - 0.9]), rr = r * b.eye * es * 0.8;
    const rx = rr * (near ? 0.95 : 0.62), ry = rr * 0.88;
    if (!B.override && fire > 0) glow(ctx, B, ex, ey, rr * 2.4, b.glow, 0.42 * Math.min(1, fire), b.hot);
    ctx.fillStyle = B.col(shade('#1a100c', Math.max(0.7, tone)));
    ctx.beginPath(); ctx.ellipse(ex, ey, rx * 1.14, ry * 1.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = B.col(b.eyeHex);
    ctx.beginPath(); ctx.ellipse(ex, ey, rx * 0.9, ry * 0.86, 0, 0, Math.PI * 2); ctx.fill();
    if (B.override) continue;
    ctx.fillStyle = '#120a08';
    ctx.beginPath(); ctx.ellipse(ex + s * rx * 0.06, ey, Math.max(0.6, rx * 0.22), ry * 0.78, 0, 0, Math.PI * 2); ctx.fill();
    if (near) { ctx.fillStyle = rgba(b.core, 0.9); ctx.beginPath(); ctx.arc(ex - rx * 0.36, ey - ry * 0.36, Math.max(0.6, rr * 0.18), 0, Math.PI * 2); ctx.fill(); }
    // The brow, heavy over the socket and lowest at its inner end: the look of it.
    softLine(ctx, B, at([[s * 3.8, 6.3, -6.8], [s * 6.8, 8.2, -4.6], [s * 10, 7.2, -1.2]]), skin, Math.max(1, 1.3 * u), 0.75);
  }
}

/**
 * The embers: sparks shaken off the fire, a few on a loop, each rising from one of the blotches on
 * the back and drifting as it cools; the faint ones are under the silhouette check's ink, and the
 * ones it counts are the pieces it is told of (tools/smoke.ts). Never over `ceil` on the canvas.
 */
function embers(ctx: CanvasRenderingContext2D, spots: readonly V2[], b: Build, t: number, ceil: number): void {
  const n = Math.round(3 * b.embers) + 1;
  for (let i = 0; i < n; i++) {
    const [sx, sy, s] = spots[(i * 3) % Math.min(spots.length, 8)];
    const cyc = 70 + nz(i, 3) * 30, ph = ((t + nz(i, 4) * cyc) % cyc) / cyc;
    const ex = sx + (Math.sin(t / 9 + i * 2.1) * 2.5 + ph * 5 * (nz(i, 5) - 0.5)) * s, ey = Math.max(ceil, sy - (2 + ph * 15) * s);
    const r = Math.max(2, s * 2.2 * (1 - ph * 0.5));
    ctx.fillStyle = rgba(i % 2 ? b.hot : b.glow, 0.95 - ph * 0.85);
    ctx.fillRect(Math.round(ex - r / 2), Math.round(ey - r / 2), Math.max(1, Math.round(r)), Math.max(1, Math.round(r)));
  }
}
