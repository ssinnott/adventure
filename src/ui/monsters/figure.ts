// The humanoid frame: the measured body every human-shaped monster in this game is drawn on, and
// the machinery that hangs off it — bending tapered tubes, arms, hands, legs, boots, the outline of
// a torso and the sword in its fist. It was worked out on the bandit family and lives here so the
// cult, the skeletons, the ogre and the wraith can stand on the same bones; they turn up in the
// same fight, and a party that meets two different anatomies in one room notices.
//
// A family brings its own Stance per kind and its own material palette; everything else is the
// same body. Nothing in this file knows what a bandit is.
import type { Paint } from './common.ts';
import { B, stroke } from './common.ts';
import { blob, glossEllipse, glossPoly, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { mix, shade } from '../../lib/art/palettes.ts';

/** The materials a figure is painted in. A family passes its own; the outlaw palette is the default. */
export interface Mats {
  skin: string; skinFar: string; hair: string; leather: string; strap: string; boot: string;
  steel: string; dull: string; wood: string; bone: string; brass: string;
}

/** Road-outlaw colours: weathered skin, brown leather, dark boots, dull steel and brass. */
export const OUTLAW = (t: number): Mats => ({
  skin: shade('#c89a78', t), skinFar: shade('#8e6a50', t), hair: shade('#2e2018', t),
  leather: shade('#6a4226', t), strap: shade('#3a2416', t), boot: shade('#281d18', t),
  steel: shade('#a8aeb8', t), dull: shade(mix('#8a94a4', '#3c414c', 0.5), t),
  wood: shade('#6a4626', t), bone: shade('#e8dcc0', t), brass: shade('#c9a34a', t),
});

export interface Pt { x: number; y: number }
/** Shoulder, elbow, hand. */
export type Arm = [Pt, Pt, Pt];

/**
 * How a kind stands. The weight goes on one leg, which raises that hip and drops the other; the
 * shoulders tilt the opposite way and shift sideways so the figure is turned a few degrees off
 * square; and each foot is placed on its own. All offsets are in units of h.
 */
export interface Stance {
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
export interface Rig {
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
  /** The stance's own toe swing, carried through so a family cannot forget to read it. */
  toe: readonly [number, number];
  /** Fixed material colours, already toned. */
  skin: string; skinFar: string; hair: string; leather: string; strap: string; boot: string; steel: string; dull: string; wood: string; bone: string; brass: string;
}/**
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
 * The joints also sit a deltoid's radius BELOW the shoulder line, because that line is the acromion
 * — the top of the shoulder, not its pivot. Pinned level with it, the arm's own top edge and the
 * pauldron over it rode 0.07h higher than the trunk's shoulder, clear above the collar and almost
 * up to the chin: the cap read as an epaulette balanced on the man rather than as his shoulder.
 *
 * These were all about 1.7 times wider, which is why the four of them used to read as slabs with
 * pads for shoulders: the ratios between them were right, so nothing looked wrong in isolation,
 * but at that width a figure has no waist left to find. The head is still kept a shade large for a
 * game sprite, since at combat size it has to carry a face.
 */
export function makeRig(x: number, y: number, h: number, p: Paint, st: Stance, mats?: (t: number) => Mats): Rig {
  const lift = p.breathe * h * 0.007;
  const sy = y - h * 0.755 - lift;
  const t = p.tone, d = st.hipTilt * h;
  const back = st.lift ?? [0, 0];
  const L = (u: readonly [number, number, number], hipY: number, lf: number): [Pt, Pt, Pt] =>
    [{ x: x + u[0] * h, y: hipY }, { x: x + u[1] * h, y: y - h * (0.285 + lf * 0.45) }, { x: x + u[2] * h, y: y - h * (0.1 + lf) }];
  return {
    x, y, h, tone: t, sy, hipd: d,
    wSh: h * 0.128, wWa: h * 0.102, wHi: h * 0.12, waistY: sy + h * 0.162,
    sNear: { x: x + h * (0.164 + st.turn), y: sy + h * 0.034 + st.tilt * h },
    sFar: { x: x - h * (0.148 - st.turn), y: sy + h * 0.034 - st.tilt * h },
    hx: x + h * (0.012 + st.turn * 0.7), hy: sy - h * 0.175 - lift * 0.4, hr: h * 0.073,
    legR: L(st.near, y - h * 0.5 + d, back[0]), legL: L(st.far, y - h * 0.5 - d, back[1]),
    lift: [back[0] * h, back[1] * h], toe: st.toe,
    ...(mats ?? OUTLAW)(t),
  };
}/** Stable 0..1 noise for the tube wobble (the same mix as gloss.ts uses, kept local). */
export function rnd(a: number, b: number, c: number): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}/**
 * A bending tapered tube along a spine, as a smooth closed curve part. Local stand-in for the
 * toolkit's 'tube' (its end caps are swept from the wrong side, which leaves a half-disc notch at
 * each end under nonzero filling); this one walks left side, end cap, right side, start cap.
 */
export function tube(pts: readonly number[], r0: number, r1: number, wobble = 0, seed = 0): Part {
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
}/** A lumpy ring of n points: a fist, a pouch, a knot. */
export function ring(cx: number, cy: number, rx: number, ry: number, n = 8): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}/** A head: a ring that narrows toward the jaw, so it is an egg, not a ball. */
export function headRing(cx: number, cy: number, r: number): number[] {
  const o: number[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, s = Math.sin(a);
    const rx = r * (0.92 - 0.14 * Math.max(0, s)), ry = r * (1 + 0.04 * Math.max(0, s));
    o.push(cx + Math.cos(a) * rx, cy + s * ry);
  }
  return o;
}const legPts = (l: [Pt, Pt, Pt]): number[] => [l[0].x, l[0].y, l[1].x, l[1].y, l[2].x, l[2].y];
/**
 * An arm as two tubes in one mass: an upper arm from the shoulder to the elbow and a forearm that
 * tapers clearly from elbow to wrist. Together they span about 0.37h, so a hanging hand reaches
 * mid-thigh; `k` thickens a padded sleeve or thins a bare one. The wrist is barely half the
 * shoulder — run an arm at even thickness and it reads as a sleeve stuffed with straw.
 */
export function armParts(R: Rig, a: Arm, seed: number, k = 1): Part[] {
  const { h } = R;
  return [
    tube([a[0].x, a[0].y, a[1].x, a[1].y], h * 0.044 * k, h * 0.039 * k, 0.03, seed),
    tube([a[1].x, a[1].y, a[2].x, a[2].y], h * 0.039 * k, h * 0.026 * k, 0.03, seed + 1),
  ];
}/** The elbow crease of an arm, for the blob it belongs to. */
export function elbowCrease(R: Rig, a: Arm): Crease {
  const { h } = R;
  return { x0: a[1].x - h * 0.02, y0: a[1].y - h * 0.01, x1: a[1].x + h * 0.02, y1: a[1].y + h * 0.012, r: h * 0.016, a: 0.28 };
}interface HandOpt {
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
}/**
 * A hand, big enough to read at combat size. With a shaft angle `a`, the shaft passes BEHIND the
 * palm and three fingers lie across it in front as short tubes, so the weapon is gripped, not
 * floating; with `a === null` it hangs open, the fingers a lobed lower edge. One blob, so palm,
 * cuff and fingers are one mass with the knuckle gaps as creases inside it.
 */
export function hand(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, a: number | null, seed: number, o: HandOpt = {}): void {
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
    if (o.plate) parts.push({ k: 'ell', x: at.x - nx * h * 0.024 * k, y: at.y - ny * h * 0.024 * k, rx: h * 0.034 * k, ry: h * 0.02 * k, rot: a + Math.PI / 2, gloss: o.gloss ?? 0.5 });
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
}/**
 * A boot around an ankle, built as a foot rather than a wedge: a cuff at the top, the shaft pinched
 * in at the ankle, then a sole that runs forward to a toe and back to a short heel. `out` swings
 * the toe: its sign is which way the foot points, its size how far round it is turned. The shape is
 * laid out toe-forward and then mirrored, point order and all, so the winding survives the flip.
 */
export function bootSeams(ctx: CanvasRenderingContext2D, R: Rig, ankle: Pt, out: number, lift: number): void {
  const { h } = R, y = R.y - lift, s = out >= 0 ? 1 : -1;
  const toe = h * (0.064 + 0.044 * Math.abs(out));
  // The sole, and the cuff turned over at the top: two lines that say boot faster than any shading.
  softLine(ctx, B, [ankle.x - s * h * 0.044, y - h * 0.016, ankle.x + s * toe * 0.82, y - h * 0.026], R.boot, Math.max(1, h * 0.022), 0.85);
  softLine(ctx, B, [ankle.x - s * h * 0.042, y - h * 0.166, ankle.x + s * h * 0.044, y - h * 0.17], R.boot, Math.max(1, h * 0.016), 0.6);
}function bootPart(R: Rig, ankle: Pt, out: number, seed: number, lift: number): Part {
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
}/**
 * Trousers as two bending tubes, one mass, then the boots as their own material. The two tubes are
 * pinched at the crotch and spread below it, so a gap of background runs down between the legs and
 * both of them read; the colour is a clear step darker and cooler than any tunic, so the hip line
 * falls where the hem ends.
 */
export function legs(ctx: CanvasRenderingContext2D, R: Rig, trouser: string, seed: number, toe: readonly [number, number], greave?: string): void {
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
}/**
 * Half-width of the trunk at an absolute y: shoulder down to the waist, out again to the hip, then
 * a slight flare into a hanging hem. Everything worn on the body measures itself against this, so
 * a vest or a belt cannot quietly put back the barrel the tunic under it has just taken away —
 * which is exactly what they were doing.
 */
export function trunkW(R: Rig, yy: number): number {
  const { sy, h, wSh, wWa, wHi, waistY: w } = R;
  const a = sy + h * 0.055, hp = sy + h * 0.2;
  if (yy <= a) return R.wSh;
  if (yy <= w) return wSh + (wWa - wSh) * ((yy - a) / (w - a));
  if (yy <= hp) return wWa + (wHi - wWa) * ((yy - w) / (hp - w));
  return wHi + (yy - hp) * 0.06;
}/** How much narrower the far side of the trunk is, the figure being turned a few degrees off square. */
export const FAR = 0.92;
/**
 * The outline of a tunic or shirt: a trapezius sloping up from each shoulder to the neck, then a
 * chest that draws IN to the waist and out again at the hip. Run straight from shoulder to hem and
 * it reads as a barrel with a head on it, which is what these four were wearing.
 */
export function torsoPts(R: Rig, hemY: number, collar = 0.03): number[] {
  const { x, sy, h, hipd: d } = R, n = R.sNear, f = R.sFar;
  const a = sy + h * 0.055, w = R.waistY, hp = sy + h * 0.2;
  const W = (yy: number) => trunkW(R, yy);
  return [
    f.x - h * 0.012, f.y - h * 0.04,
    x - h * 0.098, sy - h * (collar * 0.5),
    x - h * 0.047, sy - h * (collar + 0.022),
    x + h * 0.055, sy - h * (collar + 0.022),
    x + h * 0.106, sy - h * (collar * 0.5),
    n.x + h * 0.014, n.y - h * 0.044,
    x + W(a), a + d * 0.3,
    x + W(w), w + d * 0.6,
    x + W(hp), hp + d * 0.8,
    x + W(hemY), hemY + d,
    x - W(hemY) * FAR, hemY - d,
    x - W(hp) * FAR, hp - d * 0.8,
    x - W(w) * FAR, w - d * 0.6,
    x - W(a) * FAR, a - d * 0.3,
  ];
}/** Armpit and waist creases of a tunic, plus a shadow along the hem so the garment ends on a line. */
export function torsoCreases(R: Rig, hemY: number): Crease[] {
  const { x, sy, h, hipd: d, wSh, wWa } = R;
  return [
    { x0: x + wSh - h * 0.012, y0: sy + h * 0.055, x1: x + wWa + h * 0.008, y1: R.waistY, r: h * 0.022, a: 0.3 },
    { x0: x - wSh * FAR + h * 0.012, y0: sy + h * 0.05, x1: x - wWa * FAR - h * 0.006, y1: R.waistY - h * 0.012, r: h * 0.02, a: 0.25 },
    { x0: x - trunkW(R, hemY) * FAR + h * 0.01, y0: hemY - d - h * 0.012, x1: x + trunkW(R, hemY) - h * 0.008, y1: hemY + d - h * 0.012, r: h * 0.018, a: 0.45 },
  ];
}/** A belt lying across the trunk at `yy`, as thick as `t`, cut to the body's width there. */
export function beltPart(R: Rig, yy: number, t: number, seed: number): Part {
  const { x, h, hipd: d } = R;
  const wa = trunkW(R, yy) + h * 0.006, wb = trunkW(R, yy + t) + h * 0.006;
  return { k: 'curve', pts: [
    x - wa * FAR, yy - d, x + wa, yy + d,
    x + wb, yy + t + d, x - wb * FAR, yy + t - d,
  ], wobble: 0.01, seed, sub: 2 };
}/** Skin: the head and neck as one mass, painted before the garments so the collar covers the neck base. */
export function headNeck(ctx: CanvasRenderingContext2D, R: Rig): void {
  const { hx, hy, hr, h } = R;
  blob(ctx, B, R.skin, [
    { k: 'curve', pts: headRing(hx, hy, hr), wobble: 0.035, seed: 41, sub: 2 },
    { k: 'cap', x0: hx - h * 0.003, y0: hy + hr * 0.62, x1: hx - h * 0.006, y1: R.sy + h * 0.035, r0: hr * 0.44, r1: hr * 0.5 },
  ], { h, formK: 0.55, spread: 0.8, creases: [
    { x0: hx - hr * 0.5, y0: hy + hr * 0.9, x1: hx + hr * 0.45, y1: hy + hr * 0.92, r: hr * 0.14, a: 0.35 },
  ] });
}/**
 * A blade gripped at `at`: the grip runs THROUGH the hand — a pommel behind it, the crossguard just
 * clear of the knuckles — and the blade starts above the guard, so drawing the hand afterwards
 * closes it over the shaft. Returns the shaft angle for that hand.
 *
 * The blade is a TAPER, not a bar: full width at the ricasso, drawing in to about three fifths of
 * it at the shoulder of the point, then two straight edges converging on the point itself. A fuller
 * down the middle and a light line along whichever edge faces the light give it the two tone steps
 * that read as steel at sprite size. A parallel-sided rectangle with a chamfered corner reads as a
 * plank however carefully it is shaded, which is what all four of these were swinging.
 *
 * Everything is laid out in blade coordinates: u runs from the grip toward the point, n across it,
 * so the same construction serves a dagger and a longsword by its w and `guard` alone.
 */
export function blade(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, tx: number, ty: number, w0: number, guard0: number): number {
  const { h } = R;
  const dx = tx - at.x, dy = ty - at.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const P = (u: number, n: number, out: number[]): number[] => { out.push(at.x + ux * u + nx * n, at.y + uy * u + ny * n); return out; };
  const at2 = (u: number, n: number): Pt => ({ x: at.x + ux * u + nx * n, y: at.y + uy * u + ny * n });
  // Below about h = 60 a blade drawn at its true width is thinner than the ink around it: at combat
  // size the bandit's sword is 1.5 px of steel between two 1 px outlines, so it reads as a black
  // stick with a gold bar on it. Floor the half-width, and the quillons with it — a guard that does
  // not clearly overhang the blade is not a guard — so there is always steel left to shade. The
  // floor only bites under h ≈ 60 and fades out again below h ≈ 38, so a distant figure is not all
  // hilt. The idea and the numbers are from an independent read of this function's output.
  const px = Math.min(1, h * 0.026);
  const w = Math.max(w0, px * 1.15), guard = Math.max(guard0, w * 2.6);
  const u0 = -(h * 0.03 + w * 1.5), u1 = h * 0.02 + w * 1.3;     // pommel, and the guard's near face
  const gt = w * 1.25, u2 = u1 + gt;                              // the guard's far face
  const pom = at2(u0, 0), top = at2(u1, 0);
  // Wrapped grip from the pommel to the guard. The wraps are creases, not soft lines: blob draws
  // creases inside its own clip, and a round-capped line across a 0.9w cylinder overhangs it.
  const wraps: Crease[] = [];
  if (w >= 2.4) for (let i = 0; i < 3; i++) {
    const a = at2(u0 + (u1 - u0) * (0.3 + i * 0.22), -w * 0.8), b = at2(u0 + (u1 - u0) * (0.36 + i * 0.22), w * 0.8);
    wraps.push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, r: Math.max(1, w * 0.34), a: 0.5 });
  }
  blob(ctx, B, R.strap, [{ k: 'cap', x0: pom.x, y0: pom.y, x1: top.x, y1: top.y, r0: w * 0.95, r1: w * 0.82 }], { h, formK: 0.5, spread: 0.6, creases: wraps });
  glossEllipse(ctx, B, pom.x, pom.y, w * 1.25, w * 1.0, R.brass, Math.atan2(uy, ux), { gloss: 0.45, spread: 0.6 });
  // The blade: a slow taper to the shoulder of the point, then two edges converging on the point.
  // Drawn BEFORE the guard, because that is the order a hilt assembles: draw the guard first and
  // the blade's own ink is stroked across its face, leaving a seam through the middle of the hilt.
  const b0 = u2 + gt * 0.2, L = len - b0;
  const bl: number[] = [];
  P(b0, w, bl); P(b0 + L * 0.1, w, bl); P(b0 + L * 0.6, w * 0.86, bl); P(b0 + L * 0.87, w * 0.58, bl);
  P(b0 + L, 0, bl);
  P(b0 + L * 0.87, -w * 0.58, bl); P(b0 + L * 0.6, -w * 0.86, bl); P(b0 + L * 0.1, -w, bl); P(b0, -w, bl);
  glossPoly(ctx, B, bl, R.steel, { gloss: 0.35, spread: 0.6 });
  // The fuller and a light line down whichever edge faces the light. Gated on the blade's width in
  // PIXELS, not on its length against h: the old test was true at every size, so two 1 px marks
  // 0.7 px apart were always laid on a 1.5 px blade, where they cancel into mud.
  if (w >= 2.2 && L > h * 0.12) {
    const f0 = at2(b0 + L * 0.07, 0), f1 = at2(b0 + L * 0.62, 0);
    softLine(ctx, B, [f0.x, f0.y, f1.x, f1.y], R.steel, Math.max(1, w * 0.7), 0.4);
    const lit = nx * B.light.x + ny * B.light.y >= 0 ? 1 : -1;
    const e0 = at2(b0 + L * 0.1, lit * w * 0.88), e1 = at2(b0 + L * 0.85, lit * w * 0.52);
    stroke(ctx, [e0.x, e0.y, e1.x, e1.y], shade(R.steel, 1.4), 1);
  }
  // Crossguard: a bar that swells over the grip and tapers out to quillons canted at the blade.
  const g: number[] = [];
  P(u2 + gt * 0.3, guard, g); P(u2 + gt * 0.02, w * 1.9, g); P(u2 + gt * 0.22, 0, g); P(u2 + gt * 0.02, -w * 1.9, g);
  P(u2 + gt * 0.3, -guard, g); P(u1 + gt * 0.45, -guard * 0.97, g); P(u1 + gt * 0.05, -w * 2.0, g);
  P(u1 - gt * 0.3, 0, g); P(u1 + gt * 0.05, w * 2.0, g); P(u1 + gt * 0.45, guard * 0.97, g);
  glossPoly(ctx, B, g, R.brass, { spread: 0.6, gloss: 0.35 });
  return Math.atan2(uy, ux);
}
