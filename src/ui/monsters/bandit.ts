// The bandit family: bandit, bandit archer, brigand and brigand archer, four human outlaws on one
// painted humanoid frame. Layout (units of h, y the ground line, x the centre): each kind gets its
// own Stance — the weight on one leg so the hips tilt, the shoulder girdle turned and tilted a few
// degrees the other way, and its own pair of foot placings — so no two of them stand alike. The
// arms are full length: an upper arm and a tapering forearm as two tubes in one mass, ending in a
// hand big enough to read, whose fingers lie ACROSS whatever it grips. Painted as materials, not
// parts: the far arm as its own dark mass behind, the trousers (a clear step darker and cooler than
// the tunic, with a gap of background between them) as two bending tubes, the boots, then the
// biggest garment in the def's tint as ONE blob (body and near sleeve, with a hood or a cloak where
// the kind has one) with folds, then the leather or steel over it as its own blob, the skin (head
// and neck) as one blob, hair and beard as spiky curves, and the crisp gear (sword, buckler, bow,
// shield, helm, crossbow) on top with the gloss helpers where it is metal.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow, stroke } from './common.ts';
import { blob, glossBall, glossEllipse, glossPoly, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { mix, shade } from '../../lib/art/palettes.ts';
import { band } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bandit', 'archer', 'brigand', 'brigand_archer'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'archer') archer(ctx, x, y, h, p);
  else if (kind === 'brigand') brigand(ctx, x, y, h, p);
  else if (kind === 'brigand_archer') brigandArcher(ctx, x, y, h, p);
  else bandit(ctx, x, y, h, p);
};

// ------------------------------------------------------------------ the frame ----

interface Pt { x: number; y: number }
/** Shoulder, elbow, hand. */
type Arm = [Pt, Pt, Pt];

/**
 * How a kind stands. The weight goes on one leg, which raises that hip and drops the other; the
 * shoulders tilt the opposite way and shift sideways so the figure is turned a few degrees off
 * square; and each foot is placed on its own. All offsets are in units of h.
 */
interface Stance {
  /** Near-shoulder y offset (+ = lower); the far shoulder takes the opposite. */
  tilt: number;
  /** Near-hip y offset (+ = lower, i.e. the weight is on the far leg). */
  hipTilt: number;
  /** Sideways shift of the shoulder girdle and head: the turn. */
  turn: number;
  /** Near leg: hip, knee and ankle x. */
  near: readonly [number, number, number];
  /** Far leg: hip, knee and ankle x. */
  far: readonly [number, number, number];
  /** Which way each boot's toe swings (+1 out to the near side, -1 out to the far side). */
  toe: readonly [number, number];
  /** How far each foot is set BACK, drawn as a lift off the ground line, in h. */
  lift?: readonly [number, number];
}

/** The key points of the standing figure, computed once per draw. */
interface Rig {
  x: number; y: number; h: number; tone: number;
  /** Mean shoulder line (rises with the breath). */
  sy: number;
  /** The two shoulder joints, tilted and turned by the stance. */
  sNear: Pt; sFar: Pt;
  /** Near-hip y offset in px (+ = lower), so hems and torsos can tilt with the pelvis. */
  hipd: number;
  /** Trunk half-widths in px at the shoulder, the natural waist and the hip; and the waist's y. */
  wSh: number; wWa: number; wHi: number; waistY: number;
  /** Head centre and radius. */
  hx: number; hy: number; hr: number;
  /** Hip, knee, ankle of each leg. */
  legL: [Pt, Pt, Pt]; legR: [Pt, Pt, Pt];
  /** How far each sole is lifted off the ground line, in px: near, far. */
  lift: [number, number];
  /** Fixed material colours, already toned. */
  skin: string; skinFar: string; hair: string; leather: string; strap: string; boot: string; steel: string; dull: string; wood: string; bone: string; brass: string;
}

/**
 * The frame, measured off a standing man and written in fractions of the sprite height with the
 * ground at 0. Heights: crown 1.0, chin 0.853, shoulder 0.755, natural waist 0.61, hip 0.555,
 * crotch 0.50, knee 0.285, ankle 0.10. Half-widths: head 0.073, neck 0.032, shoulder joint 0.164,
 * trunk 0.128 at the chest, 0.102 at the waist, 0.12 at the hip. That is a head not quite seven
 * times into the height and a waist three quarters of the chest, so the trunk reads as a V and not
 * as a barrel.
 *
 * The trunk is deliberately NARROWER at the armpit than the shoulder joints are far apart: the
 * shoulder mass is the deltoid, which belongs to the arm. Carry the trunk all the way out to the
 * joint and the silhouette notches in at the armpit and bulges again at the ribs, which is what
 * gave these four their square shoulders.
 *
 * These were all about 1.7 times wider, which is why the four of them used to read as slabs with
 * pads for shoulders: the ratios between them were right, so nothing looked wrong in isolation,
 * but at that width a figure has no waist left to find. The head is still kept a shade large for a
 * game sprite, since at combat size it has to carry a face.
 */
function makeRig(x: number, y: number, h: number, p: Paint, st: Stance): Rig {
  const lift = p.breathe * h * 0.007;
  const sy = y - h * 0.755 - lift;
  const t = p.tone, d = st.hipTilt * h;
  const back = st.lift ?? [0, 0];
  const L = (u: readonly [number, number, number], hipY: number, lf: number): [Pt, Pt, Pt] =>
    [{ x: x + u[0] * h, y: hipY }, { x: x + u[1] * h, y: y - h * (0.285 + lf * 0.45) }, { x: x + u[2] * h, y: y - h * (0.1 + lf) }];
  return {
    x, y, h, tone: t, sy, hipd: d,
    wSh: h * 0.128, wWa: h * 0.102, wHi: h * 0.12, waistY: sy + h * 0.162,
    sNear: { x: x + h * (0.164 + st.turn), y: sy + st.tilt * h },
    sFar: { x: x - h * (0.148 - st.turn), y: sy - st.tilt * h },
    hx: x + h * (0.012 + st.turn * 0.7), hy: sy - h * 0.175 - lift * 0.4, hr: h * 0.073,
    legR: L(st.near, y - h * 0.5 + d, back[0]), legL: L(st.far, y - h * 0.5 - d, back[1]),
    lift: [back[0] * h, back[1] * h],
    skin: shade('#c89a78', t), skinFar: shade('#8e6a50', t), hair: shade('#2e2018', t),
    leather: shade('#6a4226', t), strap: shade('#3a2416', t), boot: shade('#281d18', t),
    steel: shade('#a8aeb8', t), dull: shade(mix('#8a94a4', '#3c414c', 0.5), t),
    wood: shade('#6a4626', t), bone: shade('#e8dcc0', t), brass: shade('#c9a34a', t),
  };
}

/** Stable 0..1 noise for the tube wobble (the same mix as gloss.ts uses, kept local). */
function rnd(a: number, b: number, c: number): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/**
 * A bending tapered tube along a spine, as a smooth closed curve part. Local stand-in for the
 * toolkit's 'tube' (its end caps are swept from the wrong side, which leaves a half-disc notch at
 * each end under nonzero filling); this one walks left side, end cap, right side, start cap.
 */
function tube(pts: readonly number[], r0: number, r1: number, wobble = 0, seed = 0): Part {
  const n = pts.length / 2;
  const P = (i: number, c: 0 | 1) => pts[Math.max(0, Math.min(n - 1, i)) * 2 + c];
  const spine: number[] = [];
  const S = 4;
  for (let i = 0; i < n - 1; i++) for (let s = 0; s < S; s++) {
    const t = s / S, t2 = t * t, t3 = t2 * t;
    for (const c of [0, 1] as const) {
      const p0 = P(i - 1, c), p1 = P(i, c), p2 = P(i + 1, c), p3 = P(i + 2, c);
      spine.push(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3));
    }
  }
  spine.push(P(n - 1, 0), P(n - 1, 1));
  const m = spine.length / 2, left: number[] = [], right: number[] = [];
  for (let i = 0; i < m; i++) {
    const ax = spine[Math.max(0, i - 1) * 2], ay = spine[Math.max(0, i - 1) * 2 + 1], bx = spine[Math.min(m - 1, i + 1) * 2], by = spine[Math.min(m - 1, i + 1) * 2 + 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const r = (r0 + (r1 - r0) * (i / (m - 1))) * (1 + (wobble ? (rnd(seed, i, 1) - 0.5) * 2 * wobble : 0));
    left.push(spine[i * 2] + nx * r, spine[i * 2 + 1] + ny * r);
    right.push(spine[i * 2] - nx * r, spine[i * 2 + 1] - ny * r);
  }
  const out: number[] = [...left];
  const ex = spine[(m - 1) * 2], ey = spine[(m - 1) * 2 + 1], ea = Math.atan2(ey - spine[(m - 2) * 2 + 1], ex - spine[(m - 2) * 2]);
  for (let k = 1; k < 5; k++) { const a = ea + Math.PI / 2 - (k / 5) * Math.PI; out.push(ex + Math.cos(a) * r1, ey + Math.sin(a) * r1); }
  for (let i = m - 1; i >= 0; i--) out.push(right[i * 2], right[i * 2 + 1]);
  const sx = spine[0], sy = spine[1], sa = Math.atan2(spine[3] - sy, spine[2] - sx);
  for (let k = 1; k < 5; k++) { const a = sa - Math.PI / 2 - (k / 5) * Math.PI; out.push(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0); }
  return { k: 'curve', pts: out, wobble: 0, sub: 1 };
}

/** A lumpy ring of n points: a fist, a pouch, a knot. */
function ring(cx: number, cy: number, rx: number, ry: number, n = 8): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/** A head: a ring that narrows toward the jaw, so it is an egg, not a ball. */
function headRing(cx: number, cy: number, r: number): number[] {
  const o: number[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, s = Math.sin(a);
    const rx = r * (0.92 - 0.14 * Math.max(0, s)), ry = r * (1 + 0.04 * Math.max(0, s));
    o.push(cx + Math.cos(a) * rx, cy + s * ry);
  }
  return o;
}

const legPts = (l: [Pt, Pt, Pt]): number[] => [l[0].x, l[0].y, l[1].x, l[1].y, l[2].x, l[2].y];

/**
 * An arm as two tubes in one mass: an upper arm from the shoulder to the elbow and a forearm that
 * tapers clearly from elbow to wrist. Together they span about 0.37h, so a hanging hand reaches
 * mid-thigh; `k` thickens a padded sleeve or thins a bare one. The wrist is barely half the
 * shoulder — run an arm at even thickness and it reads as a sleeve stuffed with straw.
 */
function armParts(R: Rig, a: Arm, seed: number, k = 1): Part[] {
  const { h } = R;
  return [
    tube([a[0].x, a[0].y, a[1].x, a[1].y], h * 0.048 * k, h * 0.039 * k, 0.03, seed),
    tube([a[1].x, a[1].y, a[2].x, a[2].y], h * 0.039 * k, h * 0.026 * k, 0.03, seed + 1),
  ];
}

/** The elbow crease of an arm, for the blob it belongs to. */
function elbowCrease(R: Rig, a: Arm): Crease {
  const { h } = R;
  return { x0: a[1].x - h * 0.02, y0: a[1].y - h * 0.01, x1: a[1].x + h * 0.02, y1: a[1].y + h * 0.012, r: h * 0.016, a: 0.28 };
}

interface HandOpt {
  /** Paint it in the far, duller skin. */
  far?: boolean;
  /** Override the material (a gauntlet). */
  hex?: string;
  /** Size multiplier. */
  k?: number;
  /** Which side of the shaft the fingers wrap onto. */
  flip?: number;
  gloss?: number;
  /** A cuff running from this point into the wrist (a gauntlet or a glove). */
  cuff?: Pt;
  /** A plate over the back of the hand, catching the light. */
  plate?: boolean;
  tex?: 'mail' | 'stipple';
}

/**
 * A hand, big enough to read at combat size. With a shaft angle `a`, the shaft passes BEHIND the
 * palm and three fingers lie across it in front as short tubes, so the weapon is gripped, not
 * floating; with `a === null` it hangs open, the fingers a lobed lower edge. One blob, so palm,
 * cuff and fingers are one mass with the knuckle gaps as creases inside it.
 */
function hand(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, a: number | null, seed: number, o: HandOpt = {}): void {
  const { h } = R, k = o.k ?? 1, flip = o.flip ?? 1;
  const hex = o.hex ?? (o.far ? R.skinFar : R.skin);
  const parts: Part[] = [];
  const creases: Crease[] = [];
  if (o.cuff) parts.push(tube([o.cuff.x, o.cuff.y, at.x, at.y], h * 0.028 * k, h * 0.046 * k, 0.02, seed + 9));
  if (a === null) {
    parts.push({ k: 'curve', pts: ring(at.x, at.y, h * 0.036 * k, h * 0.05 * k, 9), wobble: 0.1, seed, sub: 2 });
    creases.push(
      { x0: at.x - h * 0.013 * k, y0: at.y + h * 0.002 * k, x1: at.x - h * 0.014 * k, y1: at.y + h * 0.044 * k, r: h * 0.006 * k, a: 0.55 },
      { x0: at.x + h * 0.012 * k, y0: at.y + h * 0.002 * k, x1: at.x + h * 0.013 * k, y1: at.y + h * 0.044 * k, r: h * 0.006 * k, a: 0.55 },
    );
  } else {
    const ux = Math.cos(a), uy = Math.sin(a), nx = -uy * flip, ny = ux * flip;
    // The palm, set back from the shaft on the knuckle side.
    parts.push({ k: 'curve', pts: ring(at.x - nx * h * 0.008 * k, at.y - ny * h * 0.008 * k, h * 0.042 * k, h * 0.038 * k, 9), wobble: 0.06, seed, sub: 2 });
    if (o.plate) parts.push({ k: 'ell', x: at.x - nx * h * 0.016 * k, y: at.y - ny * h * 0.016 * k, rx: h * 0.038 * k, ry: h * 0.026 * k, rot: a + Math.PI / 2, gloss: o.gloss ?? 0.5 });
    // Three fingers lying ACROSS the shaft, in front of it, the outer two a touch shorter.
    for (let i = -1; i <= 1; i++) {
      const cx = at.x + ux * i * h * 0.028 * k, cy = at.y + uy * i * h * 0.028 * k, s = 1 - Math.abs(i) * 0.14;
      parts.push(tube([cx - nx * h * 0.038 * k, cy - ny * h * 0.038 * k, cx + nx * h * 0.03 * k * s, cy + ny * h * 0.03 * k * s], h * 0.0155 * k * s, h * 0.0125 * k * s, 0, seed + 3 + i));
      if (i < 1) {
        const mx = cx + ux * h * 0.014 * k, my = cy + uy * h * 0.014 * k;
        creases.push({ x0: mx - nx * h * 0.034 * k, y0: my - ny * h * 0.034 * k, x1: mx + nx * h * 0.028 * k, y1: my + ny * h * 0.028 * k, r: h * 0.0055 * k, a: 0.62 });
      }
    }
    // The thumb, crossing the shaft from the far side and lying up along it: a hand without one
    // reads as a mitten however carefully the fingers are drawn.
    const tx = at.x - ux * h * 0.03 * k, ty = at.y - uy * h * 0.03 * k;
    parts.push(tube([tx + nx * h * 0.03 * k, ty + ny * h * 0.03 * k, tx - nx * h * 0.006 * k + ux * h * 0.016 * k, ty - ny * h * 0.006 * k + uy * h * 0.016 * k], h * 0.017 * k, h * 0.014 * k, 0, seed + 7));
    creases.push({ x0: tx + nx * h * 0.032 * k + ux * h * 0.018 * k, y0: ty + ny * h * 0.032 * k + uy * h * 0.018 * k, x1: tx - nx * h * 0.018 * k + ux * h * 0.024 * k, y1: ty - ny * h * 0.018 * k + uy * h * 0.024 * k, r: h * 0.006 * k, a: 0.55 });
  }
  blob(ctx, B, hex, parts, { h, formK: 0.6, spread: 0.7, creases, tex: o.tex, seed, amount: 0.6 });
}

/**
 * A boot around an ankle, built as a foot rather than a wedge: a cuff at the top, the shaft pinched
 * in at the ankle, then a sole that runs forward to a toe and back to a short heel. `out` swings
 * the toe: its sign is which way the foot points, its size how far round it is turned. The shape is
 * laid out toe-forward and then mirrored, point order and all, so the winding survives the flip.
 */
function bootSeams(ctx: CanvasRenderingContext2D, R: Rig, ankle: Pt, out: number, lift: number): void {
  const { h } = R, y = R.y - lift, s = out >= 0 ? 1 : -1;
  const toe = h * (0.064 + 0.044 * Math.abs(out));
  // The sole, and the cuff turned over at the top: two lines that say boot faster than any shading.
  softLine(ctx, B, [ankle.x - s * h * 0.044, y - h * 0.016, ankle.x + s * toe * 0.82, y - h * 0.026], R.boot, Math.max(1, h * 0.022), 0.85);
  softLine(ctx, B, [ankle.x - s * h * 0.042, y - h * 0.166, ankle.x + s * h * 0.044, y - h * 0.17], R.boot, Math.max(1, h * 0.016), 0.6);
}

function bootPart(R: Rig, ankle: Pt, out: number, seed: number, lift: number): Part {
  const { h } = R, y = R.y - lift;
  const s = out >= 0 ? 1 : -1, t = Math.abs(out);
  const toe = h * (0.064 + 0.044 * t);
  const pts = [
    -h * 0.044, y - h * 0.188,
    h * 0.046, y - h * 0.188,
    h * 0.032, y - h * 0.112,   // the ankle, pinched on BOTH sides: without this the boot is a bell
    toe * 0.6, y - h * 0.05,
    toe, y - h * 0.018,
    toe * 0.9, y,
    -h * 0.046, y,
    -h * 0.052, y - h * 0.028,
    -h * 0.03, y - h * 0.106,
  ];
  const o: number[] = [];
  if (s > 0) for (let i = 0; i < pts.length; i += 2) o.push(ankle.x + pts[i], pts[i + 1]);
  else for (let i = pts.length - 2; i >= 0; i -= 2) o.push(ankle.x - pts[i], pts[i + 1]);
  return { k: 'curve', pts: o, wobble: 0.03, seed, sub: 2 };
}

/**
 * Trousers as two bending tubes, one mass, then the boots as their own material. The two tubes are
 * pinched at the crotch and spread below it, so a gap of background runs down between the legs and
 * both of them read; the colour is a clear step darker and cooler than any tunic, so the hip line
 * falls where the hem ends.
 */
function legs(ctx: CanvasRenderingContext2D, R: Rig, trouser: string, seed: number, toe: readonly [number, number], greave?: string): void {
  const { h } = R;
  const creases: Crease[] = [
    { x0: R.legR[1].x - h * 0.02, y0: R.legR[1].y - h * 0.012, x1: R.legR[1].x + h * 0.024, y1: R.legR[1].y + h * 0.012, r: h * 0.018, a: 0.25 },
    { x0: R.legL[1].x - h * 0.022, y0: R.legL[1].y - h * 0.012, x1: R.legL[1].x + h * 0.02, y1: R.legL[1].y + h * 0.012, r: h * 0.018, a: 0.25 },
  ];
  // Thigh and shank as separate tubes in the one mass, so the leg pinches at the knee and tapers
  // on down to an ankle half the thigh's width, instead of running to the ground as a post.
  const limb = (l: [Pt, Pt, Pt], sd: number): Part[] => [
    tube([l[0].x, l[0].y, l[1].x, l[1].y], h * 0.057, h * 0.043, 0.035, sd),
    tube([l[1].x, l[1].y, l[2].x, l[2].y], h * 0.045, h * 0.029, 0.035, sd + 5),
  ];
  blob(ctx, B, trouser, [...limb(R.legL, seed), ...limb(R.legR, seed + 1)],
    { h, formK: 0.55, tex: 'folds', seed, amount: 0.5, creases });
  // Greaves: steel plates strapped over the shins, under the boot tops.
  if (greave) {
    const plate = (l: [Pt, Pt, Pt], lf: number): Part[] => [
      { k: 'ell', x: l[1].x, y: l[1].y - h * 0.004, rx: h * 0.05, ry: h * 0.038, rot: 0, gloss: 0.35 },
      { k: 'cap', x0: l[1].x, y0: l[1].y + h * 0.012, x1: l[2].x, y1: R.y - lf - h * 0.19, r0: h * 0.046, r1: h * 0.038 },
    ];
    blob(ctx, B, greave, [...plate(R.legL, R.lift[1]), ...plate(R.legR, R.lift[0])], { h, formK: 0.6, gloss: 0.3, spread: 0.6 });
    // The rivet line down each shin, which is what reads as a plate rather than a pale patch.
    for (const [l, lf] of [[R.legL, R.lift[1]], [R.legR, R.lift[0]]] as const)
      softLine(ctx, B, [l[1].x, l[1].y + h * 0.02, (l[1].x + l[2].x) / 2, R.y - lf - h * 0.19], greave, Math.max(1, h * 0.012), 0.5);
  }
  blob(ctx, B, R.boot, [bootPart(R, R.legL[2], toe[1], seed + 2, R.lift[1]), bootPart(R, R.legR[2], toe[0], seed + 3, R.lift[0])], { h, formK: 0.5, spread: 0.7 });
  bootSeams(ctx, R, R.legL[2], toe[1], R.lift[1]); bootSeams(ctx, R, R.legR[2], toe[0], R.lift[0]);
}

/**
 * Half-width of the trunk at an absolute y: shoulder down to the waist, out again to the hip, then
 * a slight flare into a hanging hem. Everything worn on the body measures itself against this, so
 * a vest or a belt cannot quietly put back the barrel the tunic under it has just taken away —
 * which is exactly what they were doing.
 */
function trunkW(R: Rig, yy: number): number {
  const { sy, h, wSh, wWa, wHi, waistY: w } = R;
  const a = sy + h * 0.055, hp = sy + h * 0.2;
  if (yy <= a) return R.wSh;
  if (yy <= w) return wSh + (wWa - wSh) * ((yy - a) / (w - a));
  if (yy <= hp) return wWa + (wHi - wWa) * ((yy - w) / (hp - w));
  return wHi + (yy - hp) * 0.06;
}

/** How much narrower the far side of the trunk is, the figure being turned a few degrees off square. */
const FAR = 0.92;

/**
 * The outline of a tunic or shirt: a trapezius sloping up from each shoulder to the neck, then a
 * chest that draws IN to the waist and out again at the hip. Run straight from shoulder to hem and
 * it reads as a barrel with a head on it, which is what these four were wearing.
 */
function torsoPts(R: Rig, hemY: number, collar = 0.03): number[] {
  const { x, sy, h, hipd: d } = R, n = R.sNear, f = R.sFar;
  const a = sy + h * 0.055, w = R.waistY, hp = sy + h * 0.2;
  const W = (yy: number) => trunkW(R, yy);
  return [
    f.x - h * 0.012, f.y + h * 0.014,
    x - h * 0.098, sy - h * (collar * 0.5),
    x - h * 0.047, sy - h * (collar + 0.022),
    x + h * 0.055, sy - h * (collar + 0.022),
    x + h * 0.106, sy - h * (collar * 0.5),
    n.x + h * 0.014, n.y + h * 0.014,
    x + W(a), a + d * 0.3,
    x + W(w), w + d * 0.6,
    x + W(hp), hp + d * 0.8,
    x + W(hemY), hemY + d,
    x - W(hemY) * FAR, hemY - d,
    x - W(hp) * FAR, hp - d * 0.8,
    x - W(w) * FAR, w - d * 0.6,
    x - W(a) * FAR, a - d * 0.3,
  ];
}

/** Armpit and waist creases of a tunic, plus a shadow along the hem so the garment ends on a line. */
function torsoCreases(R: Rig, hemY: number): Crease[] {
  const { x, sy, h, hipd: d, wSh, wWa } = R;
  return [
    { x0: x + wSh - h * 0.012, y0: sy + h * 0.055, x1: x + wWa + h * 0.008, y1: R.waistY, r: h * 0.022, a: 0.3 },
    { x0: x - wSh * FAR + h * 0.012, y0: sy + h * 0.05, x1: x - wWa * FAR - h * 0.006, y1: R.waistY - h * 0.012, r: h * 0.02, a: 0.25 },
    { x0: x - trunkW(R, hemY) * FAR + h * 0.01, y0: hemY - d - h * 0.012, x1: x + trunkW(R, hemY) - h * 0.008, y1: hemY + d - h * 0.012, r: h * 0.018, a: 0.45 },
  ];
}

/**
 * One panel of an open vest or jerkin: it hugs the trunk, so it follows the waist in with it. `g`
 * is how far the panel's inner edge sits from the centreline, i.e. how far the garment is open.
 */
function vestPanel(R: Rig, s: 1 | -1, hemY: number, g: number, seed: number): Part {
  const { x, sy, h } = R;
  const k = s > 0 ? 1 : FAR, a = sy + h * 0.048, hp = sy + h * 0.2, w = R.waistY;
  const W = (yy: number, inset: number) => x + s * (trunkW(R, yy) * k - h * inset);
  const pts = [
    x + s * g, a,
    W(a, 0.006), sy + h * 0.036,
    W(w, 0.004), w,
    W(hp, 0.004), hp,
    W(hemY - h * 0.05, 0.012), hemY - h * 0.05,
    x + s * (g + h * 0.016), hemY - h * 0.062,
    x + s * (g - h * 0.004), w,
  ];
  if (s > 0) return { k: 'curve', pts, wobble: 0.03, seed, sub: 2 };
  const m: number[] = [];
  for (let i = pts.length - 2; i >= 0; i -= 2) m.push(pts[i], pts[i + 1]);
  return { k: 'curve', pts: m, wobble: 0.03, seed, sub: 2 };
}

/** A belt lying across the trunk at `yy`, as thick as `t`, cut to the body's width there. */
function beltPart(R: Rig, yy: number, t: number, seed: number): Part {
  const { x, h, hipd: d } = R;
  const wa = trunkW(R, yy) + h * 0.006, wb = trunkW(R, yy + t) + h * 0.006;
  return { k: 'curve', pts: [
    x - wa * FAR, yy - d, x + wa, yy + d,
    x + wb, yy + t + d, x - wb * FAR, yy + t - d,
  ], wobble: 0.01, seed, sub: 2 };
}

/** Skin: the head and neck as one mass, painted before the garments so the collar covers the neck base. */
function headNeck(ctx: CanvasRenderingContext2D, R: Rig): void {
  const { hx, hy, hr, h } = R;
  blob(ctx, B, R.skin, [
    { k: 'curve', pts: headRing(hx, hy, hr), wobble: 0.035, seed: 41, sub: 2 },
    { k: 'cap', x0: hx - h * 0.003, y0: hy + hr * 0.62, x1: hx - h * 0.006, y1: R.sy + h * 0.035, r0: hr * 0.44, r1: hr * 0.5 },
  ], { h, formK: 0.55, spread: 0.8, creases: [
    { x0: hx - hr * 0.5, y0: hy + hr * 0.9, x1: hx + hr * 0.45, y1: hy + hr * 0.92, r: hr * 0.14, a: 0.35 },
  ] });
}

/** Eyes under a scowl, a nose and (unless masked) a hard mouth. */
function face(ctx: CanvasRenderingContext2D, R: Rig, masked: boolean, scar = false): void {
  const { hx, hy, hr } = R;
  const er = hr * 0.19;
  const ex0 = hx - hr * 0.36, ex1 = hx + hr * 0.42, ey = hy - hr * 0.08;
  eye(ctx, ex0, ey, er, R.bone); eye(ctx, ex1, ey, er, R.bone);
  const bw = Math.max(1, hr * 0.17);
  softLine(ctx, B, [ex0 - er * 1.6, ey - er * 2.1, ex0 + er * 1.2, ey - er * 1.1], R.hair, bw, 0.85);
  softLine(ctx, B, [ex1 + er * 1.6, ey - er * 2.1, ex1 - er * 1.2, ey - er * 1.1], R.hair, bw, 0.85);
  softLine(ctx, B, [hx + hr * 0.06, hy - hr * 0.05, hx + hr * 0.14, hy + hr * 0.3], R.skin, Math.max(1, hr * 0.1), 0.4);
  if (!masked) softLine(ctx, B, [hx - hr * 0.32, hy + hr * 0.56, hx + hr * 0.02, hy + hr * 0.5, hx + hr * 0.36, hy + hr * 0.58], R.skin, Math.max(1, hr * 0.12), 0.75);
  if (scar && hr >= 6) stroke(ctx, [hx + hr * 0.75, hy - hr * 0.55, hx + hr * 0.45, hy + hr * 0.5], shade('#a05a50', R.tone), 1);
}

/**
 * A blade gripped at `at`: the grip runs THROUGH the hand — a pommel behind it, the crossguard just
 * clear of the knuckles — and the blade starts above the guard, so drawing the hand afterwards
 * closes it over the shaft. Returns the shaft angle for that hand.
 */
function blade(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, tx: number, ty: number, w: number, guard: number): number {
  const { h } = R;
  const dx = tx - at.x, dy = ty - at.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const px = at.x - ux * h * 0.072, py = at.y - uy * h * 0.072;
  const qx = at.x + ux * h * 0.056, qy = at.y + uy * h * 0.056;
  // Wrapped grip from the pommel to the guard, with the pommel on top of it.
  blob(ctx, B, R.strap, [{ k: 'cap', x0: px, y0: py, x1: qx, y1: qy, r0: w * 0.9, r1: w * 0.82 }], { h, formK: 0.5, spread: 0.6 });
  glossBall(ctx, B, px, py, w * 1.15, R.brass, { gloss: 0.4, spread: 0.6 });
  // Crossguard, then the blade above it.
  glossPoly(ctx, B, [qx + nx * guard, qy + ny * guard, qx + nx * guard + ux * w * 1.1, qy + ny * guard + uy * w * 1.1, qx - nx * guard + ux * w * 1.1, qy - ny * guard + uy * w * 1.1, qx - nx * guard, qy - ny * guard], R.brass, { spread: 0.6 });
  const bx = qx + ux * w * 1.1, by = qy + uy * w * 1.1;
  glossPoly(ctx, B, [bx + nx * w, by + ny * w, tx - ux * w * 0.5 + nx * w * 0.9, ty - uy * w * 0.5 + ny * w * 0.9, tx, ty, tx - ux * w * 0.5 - nx * w * 0.9, ty - uy * w * 0.5 - ny * w * 0.9, bx - nx * w, by - ny * w], R.steel, { gloss: 0.55, spread: 0.6 });
  if (len > 20) softLine(ctx, B, [bx + ux * w * 2, by + uy * w * 2, tx - ux * len * 0.25, ty - uy * len * 0.25], R.steel, 1, 0.35);
  return Math.atan2(uy, ux);
}

/**
 * A pauldron capping a shoulder, as two overlapping lames so it reads as strapped armour and not
 * as a lump of the body: the upper cap over the joint and a narrower lame hanging below it.
 */
function pauldronParts(R: Rig, at: Pt, s: number): Part[] {
  const { h } = R, d = (s > 0 ? 1 : 0);
  return [
    { k: 'curve', pts: [
      at.x - s * h * 0.05, at.y - h * 0.022,
      at.x - s * h * 0.018, at.y - h * 0.056,
      at.x + s * h * 0.04, at.y - h * 0.05,
      at.x + s * h * 0.062, at.y - h * 0.01,
      at.x + s * h * 0.05, at.y + h * 0.016,
      at.x - s * h * 0.036, at.y + h * 0.008,
    ], wobble: 0.025, seed: 51 + d, sub: 2 },
    { k: 'curve', pts: [
      at.x - s * h * 0.03, at.y + h * 0.012,
      at.x + s * h * 0.05, at.y + h * 0.018,
      at.x + s * h * 0.054, at.y + h * 0.048,
      at.x + s * h * 0.02, at.y + h * 0.056,
      at.x - s * h * 0.02, at.y + h * 0.04,
    ], wobble: 0.025, seed: 53 + d, sub: 2 },
  ];
}

/** The seam between a pauldron's two lames, plus the strap that holds it on. */
function pauldronTrim(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, s: number): void {
  const { h } = R;
  softLine(ctx, B, [at.x - s * h * 0.028, at.y + h * 0.012, at.x + s * h * 0.052, at.y + h * 0.02], R.leather, Math.max(1, h * 0.012), 0.7);
  stroke(ctx, [at.x - s * h * 0.038, at.y - h * 0.028, at.x + s * h * 0.02, at.y + h * 0.052], R.strap, Math.max(1, h * 0.014));
}

/** A short bow held in the hand at `hand`, tilted, with its string and a nocked arrow pointing out. */
function bow(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, sway: number): number {
  const { h } = R;
  const top = { x: at.x + h * 0.095, y: at.y - h * 0.35 }, bot = { x: at.x - h * 0.05, y: at.y + h * 0.33 };
  const cx = at.x - h * 0.095, cy = at.y - h * 0.01;
  const lw = Math.max(1.5, h * 0.024);
  const limbs = () => { ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.quadraticCurveTo(cx, cy, bot.x, bot.y); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  limbs(); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = lw + 2; ctx.stroke();
  limbs(); ctx.strokeStyle = B.col(R.wood); ctx.lineWidth = lw; ctx.stroke();
  if (!B.override && lw >= 2.5) { limbs(); ctx.strokeStyle = B.col(shade(R.wood, 1.35)); ctx.lineWidth = 1; ctx.stroke(); }
  stroke(ctx, [top.x, top.y, bot.x, bot.y], R.bone, 1);
  const mx = (top.x + bot.x) / 2 + sway, my = (top.y + bot.y) / 2;
  const ax = mx - h * 0.2, ay = my - h * 0.03;
  stroke(ctx, [mx, my, ax, ay], R.wood, Math.max(1, h * 0.014));
  const fx = mx - h * 0.02, fy = my - h * 0.003;
  ctx.fillStyle = B.col(shade('#b04030', R.tone));
  ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx - h * 0.035, fy - h * 0.03); ctx.lineTo(fx - h * 0.05, fy - h * 0.005); ctx.lineTo(fx - h * 0.035, fy + h * 0.02); ctx.closePath(); ctx.fill();
  ctx.fillStyle = B.col(R.steel);
  ctx.beginPath(); ctx.moveTo(ax - h * 0.03, ay - h * 0.005); ctx.lineTo(ax + h * 0.01, ay - h * 0.015); ctx.lineTo(ax + h * 0.01, ay + h * 0.012); ctx.closePath(); ctx.fill();
  return Math.atan2(bot.y - top.y, bot.x - top.x);
}

// ------------------------------------------------------------------ the kinds ----

/**
 * The road thug: weight on the far leg, the near leg relaxed and turned out, shoulders counter-
 * tilted. Tunic in the tint, leather vest, pauldrons, rag bandana, scarf mask, short sword held
 * out in a full-length arm and a buckler on a bent, visible far forearm.
 */
function bandit(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.03, hipTilt: 0.03, turn: 0.026, near: [0.072, 0.175, 0.225], far: [-0.07, -0.07, -0.06], toe: [1, -0.5], lift: [0, 0.05] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 19) * h * 0.012;
  // Near arm: hangs long, the hand at mid-thigh with the sword up and out past the elbow.
  const near: Arm = [R.sNear, { x: x + h * 0.257, y: sy + h * 0.165 }, { x: x + h * 0.281, y: sy + h * 0.34 }];
  // Far arm: the upper arm swings clear of the ribs to a low elbow, then the forearm comes up in
  // front to carry the buckler, so the shield sits on an arm instead of floating.
  const far: Arm = [R.sFar, { x: x - h * 0.241, y: sy + h * 0.208 }, { x: x - h * 0.298, y: sy + h * 0.045 }];
  const hemY = y - h * 0.42;
  groundShadow(ctx, x, y + 1, h * 0.72);
  blob(ctx, B, p.dark, armParts(R, far, 31, 0.9), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  legs(ctx, R, shade('#3e3a48', p.tone), 11, [1, -0.5]);
  headNeck(ctx, R);
  // The tunic: body and near sleeve, one mass in the tint.
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 3, sub: 3 }, ...armParts(R, near, 12)],
    { h, formK: 0.5, tex: 'folds', seed: 3, amount: 0.7, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The leather vest: two panels open at the chest, low enough that the shoulders belong to the arms.
  blob(ctx, B, shade('#4e2e1a', p.tone), [vestPanel(R, -1, hemY, h * 0.046, 5), vestPanel(R, 1, hemY, h * 0.046, 6)],
    { h, formK: 0.6, spread: 0.7, tex: 'stipple', seed: 5, amount: 0.25 });
  for (let i = 0; i < 3; i++) {
    const ly = sy + h * (0.075 + i * 0.062);
    stroke(ctx, [x - h * 0.044, ly, x + h * 0.048, ly + h * 0.018], R.strap, Math.max(1, h * 0.01));
  }
  // Leather pauldrons: one mass, two lames each, capping the shoulders where the arms begin.
  blob(ctx, B, R.leather, [...pauldronParts(R, R.sNear, 1), ...pauldronParts(R, R.sFar, -1)],
    { h, formK: 0.6, spread: 0.6, tex: 'stipple', seed: 51, amount: 0.3 });
  pauldronTrim(ctx, R, R.sNear, 1); pauldronTrim(ctx, R, R.sFar, -1);
  // Belt with a buckle, and a pouch at the near hip: one strap mass.
  blob(ctx, B, R.strap, [
    beltPart(R, hemY - h * 0.055, h * 0.047, 7),
    { k: 'curve', pts: ring(x + trunkW(R, hemY) * 0.76, hemY + R.hipd + h * 0.016, h * 0.036, h * 0.044), wobble: 0.07, seed: 8, sub: 2 },
  ], { h, formK: 0.45, spread: 0.6 });
  band(ctx, B, x - h * 0.024, hemY - h * 0.056, h * 0.044, h * 0.044, R.brass);
  // Short sword: the grip runs through the fist, the blade starts above the guard.
  const ga = blade(ctx, R, near[2], x + h * 0.394, y - h * 0.87, h * 0.018, h * 0.055);
  hand(ctx, R, near[2], ga, 42, { flip: -1 });
  // Hair tufts at the far temple, the scarf over the lower face, the bandana over the crown.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 1.0, hy - hr * 0.3, hx - hr * 0.7, hy - hr * 0.2, hx - hr * 0.75, hy + hr * 0.5, hx - hr * 1.15, hy + hr * 0.3], wobble: 0.06, spiky: 0.15, seed: 9, sub: 2 }], { h, form: false });
  blob(ctx, B, shade('#4a4854', p.tone), [{ k: 'curve', pts: [hx - hr * 0.98, hy + hr * 0.12, hx + hr * 0.98, hy + hr * 0.12, hx + hr * 0.92, hy + hr * 0.75, hx + hr * 0.45, hy + hr * 1.2, hx - hr * 0.4, hy + hr * 1.22, hx - hr * 0.9, hy + hr * 0.75], wobble: 0.05, spiky: 0.02, seed: 13, sub: 2 }], { h, formK: 0.6, spread: 0.7, tex: 'folds', seed: 13, amount: 0.4 });
  blob(ctx, B, shade('#8c3628', p.tone), [
    { k: 'curve', pts: [hx - hr * 1.05, hy - hr * 0.15, hx - hr * 0.92, hy - hr * 0.7, hx - hr * 0.3, hy - hr * 1.07, hx + hr * 0.4, hy - hr * 1.06, hx + hr * 0.97, hy - hr * 0.68, hx + hr * 1.04, hy - hr * 0.18, hx + hr * 0.7, hy - hr * 0.42, hx, hy - hr * 0.5, hx - hr * 0.7, hy - hr * 0.42], wobble: 0.04, seed: 14, sub: 2 },
    { k: 'curve', pts: ring(hx - hr * 1.02, hy - hr * 0.25, hr * 0.22, hr * 0.2), wobble: 0.08, seed: 15, sub: 2 },
    { k: 'curve', pts: [hx - hr * 1.1, hy - hr * 0.35, hx - hr * 0.95, hy - hr * 0.1, hx - hr * 1.3 + sway, hy + hr * 0.3, hx - hr * 1.55 + sway * 2, hy + hr * 0.75, hx - hr * 1.7 + sway * 2, hy + hr * 0.6, hx - hr * 1.45 + sway, hy + hr * 0.1], wobble: 0.05, spiky: 0.06, seed: 16, sub: 2 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 14, amount: 0.4 });
  face(ctx, R, true);
  // The buckler, strapped across the far forearm: the arm runs out from under the body and the
  // shield's rim crosses it, so the join reads.
  stroke(ctx, [far[1].x - h * 0.012, far[1].y - h * 0.048, far[2].x - h * 0.01, far[2].y + h * 0.02], R.strap, Math.max(1, h * 0.012));
  const bx = x - h * 0.317, by = sy + h * 0.005;
  glossBall(ctx, B, bx, by, h * 0.092, R.wood, { gloss: 0.1, spread: 0.7, h, tex: 'cracks', seed: 17, amount: 0.6 });
  ctx.strokeStyle = B.col(R.steel); ctx.lineWidth = Math.max(1, h * 0.014); ctx.beginPath(); ctx.arc(bx, by, h * 0.077, 0, Math.PI * 2); ctx.stroke();
  glossBall(ctx, B, bx, by, h * 0.031, R.steel, { gloss: 0.6 });
  void p.light;
}

/**
 * The archer: braced side-on with the far foot forward and wide, shoulders turned away. Hooded
 * tunic in the tint with a feather, the bow arm raised out to the far side, the near hand down on
 * a dagger at mid-thigh.
 */
function archer(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.028, hipTilt: -0.028, turn: -0.032, near: [0.068, 0.085, 0.045], far: [-0.066, -0.175, -0.255], toe: [0.3, -1], lift: [0.085, 0] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 23) * h * 0.006;
  const near: Arm = [R.sNear, { x: x + h * 0.237, y: sy + h * 0.175 }, { x: x + h * 0.164, y: sy + h * 0.335 }];
  const far: Arm = [R.sFar, { x: x - h * 0.248, y: sy + h * 0.17 }, { x: x - h * 0.355, y: sy + h * 0.042 }];
  const hemY = y - h * 0.4;
  groundShadow(ctx, x, y + 1, h * 0.74);
  // Quiver over the near shoulder, behind the body: leather tube with fletched arrows above it.
  blob(ctx, B, R.leather, [{ k: 'cap', x0: x + h * 0.085, y0: sy + h * 0.12, x1: x + h * 0.208, y1: sy - h * 0.1, r0: h * 0.04, r1: h * 0.035 }], { h, formK: 0.5, spread: 0.7 });
  for (let i = 0; i < 3; i++) {
    const qx = x + h * (0.164 + i * 0.028), qy = sy - h * (0.09 + (i === 1 ? 0.03 : 0.01));
    stroke(ctx, [qx, qy, qx + h * 0.03, qy - h * 0.07], R.wood, 1);
    ctx.fillStyle = B.col(shade(i === 1 ? '#c8c0a0' : '#8a3a30', p.tone));
    ctx.beginPath(); ctx.moveTo(qx + h * 0.03, qy - h * 0.07); ctx.lineTo(qx + h * 0.01, qy - h * 0.08); ctx.lineTo(qx + h * 0.04, qy - h * 0.095); ctx.lineTo(qx + h * 0.045, qy - h * 0.065); ctx.closePath(); ctx.fill();
  }
  blob(ctx, B, shade(p.dark, 0.78), armParts(R, far, 21, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  legs(ctx, R, shade('#363a42', p.tone), 22, [0.4, -1]);
  // The hooded tunic: hood, body and near sleeve, one mass in the tint.
  const hood: Part = { k: 'curve', pts: [hx - hr * 1.26, hy + hr * 1.12, hx - hr * 1.32, hy - hr * 0.1, hx - hr * 1.0, hy - hr * 1.16, hx - hr * 0.2, hy - hr * 1.52, hx + hr * 0.7, hy - hr * 1.32, hx + hr * 1.24, hy - hr * 0.5, hx + hr * 1.28, hy + hr * 1.12], wobble: 0.035, seed: 23, sub: 3 };
  blob(ctx, B, p.base, [hood, { k: 'curve', pts: torsoPts(R, hemY, 0.0), wobble: 0.03, seed: 24, sub: 3 }, ...armParts(R, near, 25)],
    { h, formK: 0.5, tex: 'folds', seed: 24, amount: 0.8, creases: [...torsoCreases(R, hemY), elbowCrease(R, near),
      { x0: hx - hr * 1.15, y0: hy + hr * 0.9, x1: hx + hr * 1.15, y1: hy + hr * 0.95, r: hr * 0.2, a: 0.3 }] });
  // Inside the hood: shadow, then the face.
  blob(ctx, B, shade(p.dark, 0.55), [{ k: 'curve', pts: [hx - hr * 0.95, hy - hr * 0.85, hx + hr * 0.95, hy - hr * 0.8, hx + hr * 1.0, hy + hr * 0.3, hx + hr * 0.5, hy + hr * 1.05, hx - hr * 0.5, hy + hr * 1.05, hx - hr * 1.0, hy + hr * 0.3], wobble: 0.04, seed: 26, sub: 2 }], { h, form: false, outline: false });
  // Belt over the tunic.
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.062, h * 0.042, 27)], { h, form: false });
  band(ctx, B, x - h * 0.018, hemY - h * 0.066, h * 0.038, h * 0.042, R.brass);
  // The face inside the hood is smaller than a bare head: only the front of it shows.
  blob(ctx, B, R.skin, [{ k: 'curve', pts: [hx - hr * 0.72, hy - hr * 0.62, hx + hr * 0.72, hy - hr * 0.6, hx + hr * 0.86, hy + hr * 0.2, hx + hr * 0.45, hy + hr * 0.95, hx - hr * 0.4, hy + hr * 0.95, hx - hr * 0.82, hy + hr * 0.2], wobble: 0.03, seed: 28, sub: 2 }], { h, formK: 0.55, spread: 0.7 });
  // Dagger at the near hip, hilt up, the near hand closed on it at mid-thigh.
  const da = blade(ctx, R, near[2], x + h * 0.214, y - h * 0.16, h * 0.013, h * 0.032);
  hand(ctx, R, near[2], da, 29, { flip: 1 });
  // A short beard under the jaw.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.7, hy + hr * 0.45, hx - hr * 0.3, hy + hr * 0.62, hx + hr * 0.3, hy + hr * 0.62, hx + hr * 0.75, hy + hr * 0.42, hx + hr * 0.55, hy + hr * 1.05, hx, hy + hr * 1.2, hx - hr * 0.55, hy + hr * 1.05], wobble: 0.06, spiky: 0.1, seed: 30, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, true);
  // The feather in the hood, at the near side.
  const fx = hx + hr * 1.05, fy = hy - hr * 0.9;
  glossEllipse(ctx, B, fx + hr * 0.5, fy - hr * 0.55 + sway, hr * 0.75, hr * 0.2, shade('#d8d0a8', p.tone), -0.95, { spread: 0.6 });
  softLine(ctx, B, [fx, fy + hr * 0.05, fx + hr * 0.95, fy - hr * 1.1 + sway], R.wood, 1, 0.6);
  // The shortbow in the raised far hand, gripped across the riser.
  const ba = bow(ctx, R, far[2], sway);
  hand(ctx, R, far[2], ba, 33, { flip: -1 });
  void p.light;
}

/**
 * The veteran: planted wide with the near foot forward and the sword shoulder raised. Cloak and
 * tabard in the tint over a mail shirt, a kettle helm with a flared brim in dull steel, a heater
 * shield on the far arm, a longsword up in a gauntleted fist, greaves.
 */
function brigand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.042, hipTilt: -0.03, turn: 0.014, near: [0.08, 0.185, 0.245], far: [-0.072, -0.125, -0.145], toe: [1, -0.8], lift: [0, 0.062] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.008;
  // Near arm: the sword arm raised, the hand above the shoulder.
  const near: Arm = [R.sNear, { x: x + h * 0.297, y: sy + h * 0.125 }, { x: x + h * 0.277, y: sy - h * 0.048 }];
  // Far arm: hangs to a low elbow, the forearm out and up behind the shield.
  const far: Arm = [R.sFar, { x: x - h * 0.195, y: sy + h * 0.235 }, { x: x - h * 0.281, y: sy + h * 0.165 }];
  const hemY = y - h * 0.4;
  const mail = shade('#767d8c', p.tone);
  groundShadow(ctx, x, y + 1, h * 0.8);
  // The cloak, behind everything, hanging from the shoulders to the knees.
  blob(ctx, B, p.dark, [{ k: 'curve', pts: [x - h * 0.162, sy - h * 0.005, x + h * 0.178, sy - h * 0.005, x + h * 0.258, sy + h * 0.2, x + h * 0.282 + sway, y - h * 0.22, x - h * 0.272 + sway, y - h * 0.2, x - h * 0.25, sy + h * 0.2], wobble: 0.035, spiky: 0.035, seed: 61, sub: 3 }], { h, formK: 0.4, tex: 'folds', seed: 61, amount: 1.2, creases: [
    { x0: x - h * 0.195, y0: sy + h * 0.15, x1: x - h * 0.215, y1: y - h * 0.3, r: h * 0.02, a: 0.3 },
    { x0: x + h * 0.212, y0: sy + h * 0.15, x1: x + h * 0.232, y1: y - h * 0.3, r: h * 0.02, a: 0.3 }] });
  blob(ctx, B, shade(mail, 0.92), armParts(R, far, 31), { h, formK: 0.5, tex: 'mail', seed: 31, amount: 0.7, creases: [elbowCrease(R, far)] });
  legs(ctx, R, shade('#33333e', p.tone), 32, [1, -0.8], shade(R.dull, 1.04));
  headNeck(ctx, R);
  // The mail shirt: body and near sleeve, ONE mass with one gradient and one ring texture across
  // it (a second pass over the sleeve alone would re-light it and break the arm off the body).
  blob(ctx, B, mail, [{ k: 'curve', pts: torsoPts(R, hemY + h * 0.02), wobble: 0.025, seed: 33, sub: 3 }, ...armParts(R, near, 34)],
    { h, formK: 0.55, gloss: 0.15, tex: 'mail', seed: 33, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The tabard in the tint over the chest, belted, hanging below the mail.
  const tw = (yy: number) => trunkW(R, yy) - h * 0.03;
  blob(ctx, B, p.base, [{ k: 'curve', pts: [
    x - tw(R.sy + h * 0.06) * FAR, sy + h * 0.005, x + tw(R.sy + h * 0.06), sy + h * 0.005,
    x + tw(R.waistY) + h * 0.006, R.waistY, x + tw(hemY) + h * 0.004, hemY - h * 0.02,
    x + h * 0.098, y - h * 0.3, x - h * 0.09, y - h * 0.3,
    x - (tw(hemY) + h * 0.004) * FAR, hemY - h * 0.02, x - (tw(R.waistY) + h * 0.006) * FAR, R.waistY,
  ], wobble: 0.03, seed: 35, sub: 3 }], { h, formK: 0.45, tex: 'folds', seed: 35, amount: 0.7 });
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.062, h * 0.046, 36)], { h, form: false });
  band(ctx, B, x - h * 0.018, hemY - h * 0.066, h * 0.042, h * 0.046, R.brass);
  // The longsword held up, the grip running through a steel gauntlet: cuff at the wrist, a plate
  // over the back of the hand catching the light, fingers closed across the hilt.
  const ga = blade(ctx, R, near[2], x + h * 0.329, y - h * 1.09, h * 0.022, h * 0.072);
  const fa = Math.atan2(near[1].y - near[2].y, near[1].x - near[2].x);
  const cuff: Pt = { x: near[2].x + Math.cos(fa) * h * 0.085, y: near[2].y + Math.sin(fa) * h * 0.085 };
  hand(ctx, R, near[2], ga, 42, { hex: R.dull, cuff, plate: true, gloss: 0.5, flip: -1 });
  // Beard under the helm.
  blob(ctx, B, shade('#4a3a2a', p.tone), [{ k: 'curve', pts: [hx - hr * 0.8, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.55, hx + hr * 0.3, hy + hr * 0.55, hx + hr * 0.85, hy + hr * 0.3, hx + hr * 0.65, hy + hr * 1.1, hx, hy + hr * 1.35, hx - hr * 0.6, hy + hr * 1.1], wobble: 0.06, spiky: 0.12, seed: 37, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, true);
  // Kettle helm: a crown that narrows to a finial and a brim that flares wide and droops at the
  // ends, in a dull steel well darker than the face, with the brow in its shadow.
  softLine(ctx, B, [hx - hr * 0.92, hy - hr * 0.36, hx + hr * 0.92, hy - hr * 0.4], R.skin, hr * 0.42, 0.6);
  blob(ctx, B, R.dull, [
    { k: 'curve', pts: [hx - hr * 0.98, hy - hr * 0.52, hx - hr * 0.94, hy - hr * 1.02, hx - hr * 0.48, hy - hr * 1.46, hx + hr * 0.28, hy - hr * 1.48, hx + hr * 0.92, hy - hr * 1.04, hx + hr * 1.0, hy - hr * 0.5], wobble: 0.02, seed: 38, sub: 3, gloss: 0.4 },
    { k: 'poly', pts: [
      hx - hr * 1.6, hy - hr * 0.3, hx - hr * 1.0, hy - hr * 0.58, hx, hy - hr * 0.66, hx + hr * 1.0, hy - hr * 0.58, hx + hr * 1.6, hy - hr * 0.28,
      hx + hr * 1.5, hy - hr * 0.1, hx + hr * 0.9, hy - hr * 0.34, hx, hy - hr * 0.42, hx - hr * 0.9, hy - hr * 0.34, hx - hr * 1.5, hy - hr * 0.12] },
  ], { h, formK: 0.55, spread: 0.55 });
  stroke(ctx, [hx - hr * 0.06, hy - hr * 1.44, hx + hr * 0.04, hy - hr * 0.62], shade(R.dull, 1.45), Math.max(1, hr * 0.13));
  softLine(ctx, B, [hx - hr * 1.42, hy - hr * 0.22, hx, hy - hr * 0.5, hx + hr * 1.42, hy - hr * 0.2], R.dull, Math.max(1, hr * 0.12), 0.5);
  glossBall(ctx, B, hx - hr * 0.08, hy - hr * 1.56, hr * 0.13, R.brass, { gloss: 0.5 });
  // The heater shield on the far arm: steel rim, painted field with a pale chevron.
  const cx = x - h * 0.315, cy = y - h * 0.44, sw = h * 0.118, sh = h * 0.182;
  const shieldPts = [cx - sw, cy - sh * 0.9, cx + sw, cy - sh * 0.9, cx + sw * 0.95, cy + sh * 0.15, cx + sw * 0.5, cy + sh * 0.75, cx, cy + sh, cx - sw * 0.5, cy + sh * 0.75, cx - sw * 0.95, cy + sh * 0.15];
  glossPoly(ctx, B, shieldPts, R.steel, { spread: 0.7 });
  const field = shade('#7a2c24', p.tone);
  ctx.save(); ctx.beginPath(); ctx.moveTo(shieldPts[0], shieldPts[1]); for (let i = 2; i < shieldPts.length; i += 2) ctx.lineTo(shieldPts[i], shieldPts[i + 1]); ctx.closePath(); ctx.clip();
  glossPoly(ctx, B, [cx - sw * 0.82, cy - sh * 0.72, cx + sw * 0.82, cy - sh * 0.72, cx + sw * 0.78, cy + sh * 0.1, cx, cy + sh * 0.8, cx - sw * 0.78, cy + sh * 0.1], field, { spread: 0.6, gloss: 0.12 });
  ctx.restore();
  ctx.fillStyle = B.col(R.bone);
  ctx.beginPath(); ctx.moveTo(cx - sw * 0.7, cy - sh * 0.5); ctx.lineTo(cx, cy + sh * 0.05); ctx.lineTo(cx + sw * 0.7, cy - sh * 0.5); ctx.lineTo(cx + sw * 0.7, cy - sh * 0.15); ctx.lineTo(cx, cy + sh * 0.4); ctx.lineTo(cx - sw * 0.7, cy - sh * 0.15); ctx.closePath(); ctx.fill();
  void p.light;
}

/**
 * The brigand archer: braced in a half-lunge with the far foot forward and the near shoulder
 * dropped into the stock. Tunic and short cloak in the tint, leather cap, one pauldron, bolts at
 * the hip, crossbow at port arms with both hands closed on it.
 */
function brigandArcher(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.036, hipTilt: 0.028, turn: -0.024, near: [0.07, 0.105, 0.03], far: [-0.068, -0.165, -0.245], toe: [-0.3, -1], lift: [0.088, 0] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.007;
  const near: Arm = [R.sNear, { x: x + h * 0.271, y: sy + h * 0.16 }, { x: x + h * 0.106, y: sy + h * 0.252 }];
  const far: Arm = [R.sFar, { x: x - h * 0.255, y: sy + h * 0.172 }, { x: x - h * 0.211, y: sy + h * 0.018 }];
  const hemY = y - h * 0.41;
  groundShadow(ctx, x, y + 1, h * 0.74);
  // The short cloak, behind, fastened at the near shoulder and thrown back over the far one.
  blob(ctx, B, p.dark, [{ k: 'curve', pts: [x - h * 0.17, sy - h * 0.01, x + h * 0.17, sy - h * 0.01, x + h * 0.24, sy + h * 0.12, x + h * 0.27 + sway, y - h * 0.36, x - h * 0.298 + sway, y - h * 0.34, x - h * 0.268, sy + h * 0.1], wobble: 0.04, spiky: 0.04, seed: 71, sub: 3 }], { h, formK: 0.4, tex: 'folds', seed: 71, amount: 1.0 });
  blob(ctx, B, p.dark, armParts(R, far, 72), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  legs(ctx, R, shade('#3a3744', p.tone), 41, [-0.3, -1]);
  headNeck(ctx, R);
  // The tunic: body and near sleeve, one mass in the tint.
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 73, sub: 3 }, ...armParts(R, near, 74)],
    { h, formK: 0.5, tex: 'folds', seed: 73, amount: 0.7, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // Studded leather jerkin over the chest.
  const jy = sy + h * 0.045;
  blob(ctx, B, R.leather, [{ k: 'curve', pts: [
    x - trunkW(R, jy) * FAR, jy, x - h * 0.04, sy + h * 0.05, x + h * 0.05, sy + h * 0.05, x + trunkW(R, jy), jy,
    x + trunkW(R, R.waistY) + h * 0.004, R.waistY, x + trunkW(R, hemY) - h * 0.006, hemY - h * 0.03,
    x - (trunkW(R, hemY) - h * 0.006) * FAR, hemY - h * 0.03, x - (trunkW(R, R.waistY) + h * 0.004) * FAR, R.waistY,
  ], wobble: 0.03, seed: 75, sub: 2 }], { h, formK: 0.55, spread: 0.7, tex: 'stipple', seed: 75, amount: 0.5 });
  // Belt, the quiver of bolts at the far hip, and a pouch.
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.055, h * 0.047, 76)], { h, form: false });
  band(ctx, B, x - h * 0.018, hemY - h * 0.056, h * 0.042, h * 0.046, R.brass);
  for (let i = 0; i < 4; i++) {
    const qx = x - h * (0.172 - i * 0.02), qy = hemY - h * 0.02;
    stroke(ctx, [qx, qy, qx - h * 0.02, qy - h * 0.09], R.wood, 1);
    ctx.fillStyle = B.col(shade(i % 2 ? '#c8c0a0' : '#8a3a30', p.tone)); ctx.beginPath(); ctx.arc(qx - h * 0.02, qy - h * 0.09, Math.max(1, h * 0.012), 0, Math.PI * 2); ctx.fill();
  }
  blob(ctx, B, R.leather, [{ k: 'curve', pts: [x - h * 0.198, hemY - h * 0.02, x - h * 0.086, hemY - h * 0.02, x - h * 0.078, hemY + h * 0.095, x - h * 0.19, hemY + h * 0.095], wobble: 0.04, seed: 77, sub: 2 }], { h, formK: 0.55, spread: 0.6 });
  // The single steel pauldron on the near shoulder, two lames, where the arm begins.
  blob(ctx, B, R.dull, pauldronParts(R, R.sNear, 1), { h, formK: 0.6, spread: 0.55, gloss: 0.4 });
  pauldronTrim(ctx, R, R.sNear, 1);
  // The crossbow at port arms: the stock from the near hand up across the chest to the far hand,
  // the steel prod bowed across its fore-end so the tips stand clear of the body.
  const gx = near[2].x, gy = near[2].y, fx = far[2].x - h * 0.022, fy = far[2].y - h * 0.012;
  const dx = fx - gx, dy = fy - gy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const pw = h * 0.185, sw = h * 0.017;
  const prod = () => { ctx.beginPath(); ctx.moveTo(fx + nx * pw - ux * h * 0.03, fy + ny * pw - uy * h * 0.03); ctx.quadraticCurveTo(fx + ux * h * 0.05, fy + uy * h * 0.05, fx - nx * pw - ux * h * 0.03, fy - ny * pw - uy * h * 0.03); };
  ctx.lineCap = 'round';
  prod(); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = Math.max(2, h * 0.03) + 2; ctx.stroke();
  prod(); ctx.strokeStyle = B.col(R.steel); ctx.lineWidth = Math.max(2, h * 0.03); ctx.stroke();
  if (!B.override && h >= 60) { prod(); ctx.strokeStyle = B.col(shade(R.steel, 1.3)); ctx.lineWidth = 1; ctx.stroke(); }
  stroke(ctx, [fx + nx * pw - ux * h * 0.03, fy + ny * pw - uy * h * 0.03, fx - nx * pw - ux * h * 0.03, fy - ny * pw - uy * h * 0.03], R.bone, 1);
  // Stock: wood, with a deeper butt, a bolt lying along its top and the trigger lever below.
  glossPoly(ctx, B, [fx + nx * sw + ux * h * 0.04, fy + ny * sw + uy * h * 0.04, gx + nx * sw * 1.5 - ux * h * 0.09, gy + ny * sw * 1.5 - uy * h * 0.09, gx - nx * sw * 2.6 - ux * h * 0.1, gy - ny * sw * 2.6 - uy * h * 0.1, gx - nx * sw * 1.4 + ux * h * 0.02, gy - ny * sw * 1.4 + uy * h * 0.02, fx - nx * sw + ux * h * 0.04, fy - ny * sw + uy * h * 0.04], R.wood, { spread: 0.6, h, tex: 'cracks', seed: 81, amount: 0.4 });
  stroke(ctx, [fx + nx * sw * 1.3 + ux * h * 0.08, fy + ny * sw * 1.3 + uy * h * 0.08, gx + nx * sw * 1.3 - ux * h * 0.02, gy + ny * sw * 1.3 - uy * h * 0.02], shade('#d8d0b0', p.tone), Math.max(1, h * 0.012));
  ctx.fillStyle = B.col(R.steel); ctx.beginPath(); ctx.moveTo(fx + nx * sw * 1.3 + ux * h * 0.11, fy + ny * sw * 1.3 + uy * h * 0.11); ctx.lineTo(fx + nx * sw * 2.2 + ux * h * 0.075, fy + ny * sw * 2.2 + uy * h * 0.075); ctx.lineTo(fx + nx * sw * 0.5 + ux * h * 0.075, fy + ny * sw * 0.5 + uy * h * 0.075); ctx.closePath(); ctx.fill();
  stroke(ctx, [gx - nx * sw * 1.5 - ux * h * 0.012, gy - ny * sw * 1.5 - uy * h * 0.012, gx - nx * sw * 3.2 - ux * h * 0.032, gy - ny * sw * 3.2 - uy * h * 0.032], R.steel, Math.max(1, h * 0.012));
  // Both hands closed on the stock: the far one at the fore-end, the near one at the grip.
  const sa = Math.atan2(uy, ux);
  hand(ctx, R, far[2], sa, 78, { far: true, flip: 1, k: 0.92 });
  hand(ctx, R, near[2], sa, 42, { flip: 1 });
  // Stubble, the scar, the leather cap.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.75, hy + hr * 0.4, hx - hr * 0.3, hy + hr * 0.6, hx + hr * 0.3, hy + hr * 0.6, hx + hr * 0.8, hy + hr * 0.38, hx + hr * 0.55, hy + hr * 0.95, hx, hy + hr * 1.08, hx - hr * 0.55, hy + hr * 0.95], wobble: 0.06, spiky: 0.06, seed: 79, sub: 2 }], { h, form: false, outline: false });
  face(ctx, R, false, true);
  blob(ctx, B, R.leather, [
    { k: 'curve', pts: [hx - hr * 1.02, hy - hr * 0.25, hx - hr * 0.9, hy - hr * 0.8, hx - hr * 0.3, hy - hr * 1.1, hx + hr * 0.4, hy - hr * 1.08, hx + hr * 0.95, hy - hr * 0.75, hx + hr * 1.02, hy - hr * 0.25, hx + hr * 1.08, hy + hr * 0.35, hx + hr * 0.85, hy + hr * 0.4, hx + hr * 0.75, hy - hr * 0.35, hx, hy - hr * 0.42, hx - hr * 0.75, hy - hr * 0.35, hx - hr * 0.85, hy + hr * 0.4, hx - hr * 1.08, hy + hr * 0.35], wobble: 0.03, seed: 80, sub: 2 },
  ], { h, formK: 0.55, spread: 0.6, tex: 'stipple', seed: 80, amount: 0.3 });
  void p.light;
}
