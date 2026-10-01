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
import { blob, glossBall, glossEllipse, glossPoly, glow, patch, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import type { Arm, Pt, Rig } from './figure.ts';
import { armParts, beltPart, blade, elbowCrease, FAR, hand, headNeck, headRing, legs, makeRig, ring, torsoCreases, torsoPts, trunkW, tube } from './figure.ts';
import { band } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bandit', 'archer', 'brigand', 'brigand_archer', 'smuggler', 'smuggler_bow', 'smuggler_captain', 'wrecker', 'lampman', 'footpad', 'poacher', 'billman', 'slinger', 'cutthroat', 'bargeman', 'barge_master', 'wrack_smuggler'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'archer') archer(ctx, x, y, h, p);
  else if (kind === 'footpad') footpad(ctx, x, y, h, p);
  else if (kind === 'poacher') poacher(ctx, x, y, h, p);
  else if (kind === 'billman') billman(ctx, x, y, h, p);
  else if (kind === 'slinger') slinger(ctx, x, y, h, p);
  else if (kind === 'cutthroat') cutthroat(ctx, x, y, h, p);
  else if (kind === 'bargeman') bargeman(ctx, x, y, h, p);
  else if (kind === 'barge_master') bargeMaster(ctx, x, y, h, p);
  else if (kind === 'wrack_smuggler') wrackSmuggler(ctx, x, y, h, p);
  else if (kind === 'brigand') brigand(ctx, x, y, h, p);
  else if (kind === 'brigand_archer') brigandArcher(ctx, x, y, h, p);
  else if (kind === 'smuggler') smuggler(ctx, x, y, h, p);
  else if (kind === 'smuggler_bow') smugglerBow(ctx, x, y, h, p);
  else if (kind === 'smuggler_captain') smugglerCaptain(ctx, x, y, h, p);
  else if (kind === 'wrecker') wrecker(ctx, x, y, h, p);
  else if (kind === 'lampman') lampman(ctx, x, y, h, p);
  else bandit(ctx, x, y, h, p);
};

// ------------------------------------------------------------------ the frame ----

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
 * A pauldron capping a shoulder, as two overlapping lames so it reads as strapped armour and not
 * as a lump of the body: the upper cap over the joint and a narrower lame hanging below it.
 */
function pauldronParts(R: Rig, at: Pt, s: number): Part[] {
  const { h } = R, d = (s > 0 ? 1 : 0);
  return [
    { k: 'curve', pts: [
      at.x - s * h * 0.05, at.y - h * 0.016,
      at.x - s * h * 0.018, at.y - h * 0.048,
      at.x + s * h * 0.04, at.y - h * 0.042,
      at.x + s * h * 0.062, at.y - h * 0.004,
      at.x + s * h * 0.05, at.y + h * 0.022,
      at.x - s * h * 0.036, at.y + h * 0.014,
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

/**
 * A bow's points, shared by its drawer and the check that holds it (tools/tests/art.ts): the two
 * nocks, the riser under the bow hand, and `back`, a point on the archer's side of the string. A
 * bow bends away from the man who holds it, so the riser and `back` lie either side of the string.
 */
export interface BowPts { top: Pt; bot: Pt; riser: Pt; back: Pt }

/** The archer's shortbow, braced and gripped at `at` by a man standing at `x`. */
export function heldBow(at: Pt, h: number, x: number): BowPts {
  return { top: { x: at.x + h * 0.074, y: at.y - h * 0.325 }, bot: { x: at.x + h * 0.06, y: at.y + h * 0.3 }, riser: { x: at.x - h * 0.006, y: at.y }, back: { x, y: at.y } };
}

/** The smuggler's shortbow at full draw, gripped at `at` and the string drawn to `anchor`. */
export function drawnBow(at: Pt, h: number, anchor: Pt): BowPts {
  return { top: { x: at.x - h * 0.096, y: at.y - h * 0.3 }, bot: { x: at.x - h * 0.084, y: at.y + h * 0.28 }, riser: { x: at.x + h * 0.008, y: at.y - h * 0.028 }, back: anchor };
}

/** The poacher's longbow, grounded at `y` and gripped at `at` by a man standing at `x`. */
export function longbow(at: Pt, y: number, h: number, x: number, sway = 0): BowPts {
  const bx = at.x - h * 0.012;
  return { top: { x: bx + h * 0.02 + sway, y: y - h * 1.2 }, bot: { x: bx - h * 0.005, y: y - h * 0.01 }, riser: { x: bx - h * 0.028, y: at.y }, back: { x, y: at.y } };
}

/**
 * A shortbow gripped at `at`. Drawn as a bow rather than an arc: the two limbs are tapered tubes in
 * ONE wooden mass, thick at the riser under the hand and fining to the nocks, bowed away from the
 * archer so the string stands off the grip by a brace height. The arrow is NOCKED — its shaft
 * starts on the string, crosses the riser at the arrow pass and carries its head out past the bow —
 * instead of floating across in front of it. Returns the bow's axis for the hand that holds it.
 */
function bow(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, sway: number): number {
  const { h } = R;
  const { top, bot, riser: grip } = heldBow(at, h, R.x);
  const px = Math.min(1, h * 0.026), tipR = Math.max(h * 0.0075, px * 0.6), midR = Math.max(h * 0.017, px * 1.25);
  blob(ctx, B, R.wood, [
    tube([top.x, top.y, at.x - h * 0.016, at.y - h * 0.165, grip.x, grip.y - h * 0.03], tipR, midR, 0, 61),
    tube([grip.x, grip.y - h * 0.03, at.x - h * 0.014, at.y + h * 0.15, bot.x, bot.y], midR, tipR, 0, 62),
  ], { h, formK: 0.5, spread: 0.65, tex: 'cracks', seed: 61, amount: 0.35 });
  // The grip leather, and the string from nock to nock: it stands clear of the riser, which is what
  // tells the eye the stave is bent rather than merely curved.
  softLine(ctx, B, [grip.x - h * 0.004, grip.y - h * 0.05, grip.x - h * 0.004, grip.y + h * 0.05], R.wood, Math.max(1, h * 0.026), 0.55);
  stroke(ctx, [top.x, top.y, bot.x, bot.y], R.bone, 1);
  // The arrow, nocked on the string level with the grip and lying across the arrow pass.
  const t = (grip.y - top.y) / (bot.y - top.y);
  const nx = top.x + (bot.x - top.x) * t + sway * 0.4, ny = grip.y + sway;
  const ax = nx - h * 0.235, ay = ny - h * 0.018;
  stroke(ctx, [nx + h * 0.012, ny + h * 0.001, ax, ay], R.wood, Math.max(1, h * 0.013));
  const ux = (ax - nx) / Math.hypot(ax - nx, ay - ny), uy = (ay - ny) / Math.hypot(ax - nx, ay - ny);
  ctx.fillStyle = B.col(R.steel);
  ctx.beginPath();
  ctx.moveTo(ax + ux * h * 0.03, ay + uy * h * 0.03);
  ctx.lineTo(ax - uy * h * 0.016, ay + ux * h * 0.016);
  ctx.lineTo(ax + uy * h * 0.016, ay - ux * h * 0.016);
  ctx.closePath(); ctx.fill();
  // Fletching, behind the nock on the far side of the string, so the arrow reads as seated on it.
  if (h >= 46) for (let i = -1; i <= 1; i++) {
    const fx = nx + h * 0.014 - i * h * 0.002, fy = ny + h * 0.001 + i * h * 0.0015;
    ctx.fillStyle = B.col(shade(i === 0 ? '#c8c0a0' : '#8a3a30', R.tone));
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + h * 0.042, fy - h * 0.004 + i * h * 0.021);
    ctx.lineTo(fx + h * 0.05, fy + h * 0.004 + i * h * 0.021);
    ctx.lineTo(fx + h * 0.012, fy + h * 0.006);
    ctx.closePath(); ctx.fill();
  }
  return Math.atan2(bot.y - top.y, bot.x - top.x);
}

// ------------------------------------------------------------------ the kinds ----

/**
 * The road thug: weight on the far leg, the near leg relaxed and turned out, shoulders counter-
 * tilted. Tunic in the tint, leather vest, pauldrons, rag bandana, scarf mask, short sword held
 * out in a full-length arm and a buckler on a bent, visible far forearm.
 */
function bandit(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.018, hipTilt: 0.03, turn: 0.026, near: [0.072, 0.175, 0.225], far: [-0.07, -0.07, -0.06], toe: [1, -0.5], lift: [0, 0.05] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 19) * h * 0.012;
  // Near arm, measured off a photograph of a man standing with a sword. What a hand holding a sword
  // at rest actually does is nothing: the upper arm hangs vertical and close in, the elbow is only
  // just bent (162 deg), the hand is down at the hip, and the BLADE carries on down and forward from
  // the forearm. The earlier fix for the reversed wrist swung the whole arm out into a guard and
  // left the figure standing in a stiff symmetric A — the right answer was to drop the point, not
  // to raise the arm.
  const near: Arm = [R.sNear, { x: x + h * 0.24, y: sy + h * 0.194 }, { x: x + h * 0.214, y: sy + h * 0.352 }];
  // Far arm: the upper arm swings clear of the ribs to a low elbow, then the forearm comes up in
  // front to carry the buckler, so the shield sits on an arm instead of floating.
  const far: Arm = [R.sFar, { x: x - h * 0.218, y: sy + h * 0.21 }, { x: x - h * 0.318, y: sy + h * 0.085 }];
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
  const ga = blade(ctx, R, near[2], x + h * 0.394, y - h * 0.091, h * 0.019, h * 0.072);
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
  const bx = x - h * 0.301, by = sy + h * 0.109;
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
  const R = makeRig(x, y, h, p, { tilt: 0.017, hipTilt: -0.028, turn: -0.032, near: [0.068, 0.085, 0.045], far: [-0.066, -0.175, -0.255], toe: [0.3, -1], lift: [0.085, 0] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 23) * h * 0.006;
  const near: Arm = [R.sNear, { x: x + h * 0.245, y: sy + h * 0.197 }, { x: x + h * 0.164, y: sy + h * 0.335 }];
  const far: Arm = [R.sFar, { x: x - h * 0.222, y: sy + h * 0.197 }, { x: x - h * 0.352, y: sy + h * 0.104 }];
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
  // The hooded tunic: hood, cowl, body and near sleeve, one mass in the tint. The hood is cut round
  // the head, so it ends under the chin, a neck's length above the collar, and he is the one man in
  // this family with no bare neck to fill that; the cowl carries the cloth on down, in round the
  // neck and out over the trapezius onto both shoulders. Its top is measured off the head and its
  // hem off the shoulder line, so the breath, which lifts the head further than the shoulders,
  // cannot open the gap again.
  const hood: Part = { k: 'curve', pts: [hx - hr * 1.26, hy + hr * 1.12, hx - hr * 1.32, hy - hr * 0.1, hx - hr * 1.0, hy - hr * 1.16, hx - hr * 0.2, hy - hr * 1.52, hx + hr * 0.7, hy - hr * 1.32, hx + hr * 1.24, hy - hr * 0.5, hx + hr * 1.28, hy + hr * 1.12], wobble: 0.035, seed: 23, sub: 3 };
  const cowl: Part = { k: 'curve', pts: [
    hx - hr * 1.2, hy + hr * 0.4, hx + hr * 1.18, hy + hr * 0.4,
    hx + hr * 1.02, hy + hr * 1.42, x + h * 0.1, sy - h * 0.028, R.sNear.x + h * 0.006, sy + h * 0.012,
    x + h * 0.12, sy + h * 0.06, x + h * 0.01, sy + h * 0.085, x - h * 0.13, sy + h * 0.055,
    R.sFar.x + h * 0.004, sy - h * 0.02, x - h * 0.128, sy - h * 0.036, hx - hr * 1.04, hy + hr * 1.42,
  ], wobble: 0.03, seed: 20, sub: 3 };
  blob(ctx, B, p.base, [hood, cowl, { k: 'curve', pts: torsoPts(R, hemY, 0.0), wobble: 0.03, seed: 24, sub: 3 }, ...armParts(R, near, 25)],
    { h, formK: 0.5, tex: 'folds', seed: 24, amount: 0.8, creases: [...torsoCreases(R, hemY), elbowCrease(R, near),
      { x0: hx - hr * 1.15, y0: hy + hr * 0.9, x1: hx + hr * 1.15, y1: hy + hr * 0.95, r: hr * 0.2, a: 0.3 }] });
  // The cowl's hem across the chest, as one soft line (three creases darken where they overlap):
  // without it the cowl reads as a neck as thick as the hood, growing out of the tunic.
  softLine(ctx, B, [x - h * 0.1, sy + h * 0.05, x - h * 0.045, sy + h * 0.074, x + h * 0.05, sy + h * 0.076, x + h * 0.1, sy + h * 0.052], p.base, Math.max(1, h * 0.022), 0.28);
  // Inside the hood: shadow, then the face.
  blob(ctx, B, shade(p.dark, 0.55), [{ k: 'curve', pts: [hx - hr * 0.95, hy - hr * 0.85, hx + hr * 0.95, hy - hr * 0.8, hx + hr * 1.0, hy + hr * 0.3, hx + hr * 0.5, hy + hr * 1.05, hx - hr * 0.5, hy + hr * 1.05, hx - hr * 1.0, hy + hr * 0.3], wobble: 0.04, seed: 26, sub: 2 }], { h, form: false, outline: false });
  // Belt over the tunic.
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.062, h * 0.042, 27)], { h, form: false });
  band(ctx, B, x - h * 0.018, hemY - h * 0.066, h * 0.038, h * 0.042, R.brass);
  // The face inside the hood is smaller than a bare head: only the front of it shows.
  blob(ctx, B, R.skin, [{ k: 'curve', pts: [hx - hr * 0.72, hy - hr * 0.62, hx + hr * 0.72, hy - hr * 0.6, hx + hr * 0.86, hy + hr * 0.2, hx + hr * 0.45, hy + hr * 0.95, hx - hr * 0.4, hy + hr * 0.95, hx - hr * 0.82, hy + hr * 0.2], wobble: 0.03, seed: 28, sub: 2 }], { h, formK: 0.55, spread: 0.7 });
  // Dagger at the near hip, hilt up, the near hand closed on it at mid-thigh.
  const da = blade(ctx, R, near[2], x + h * 0.188, y - h * 0.22, h * 0.012, h * 0.036);
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
 * The poacher: a Downs countryman who takes the Queen's game on her own land. He stands easy at the
 * field edge with a yew longbow taller than he is grounded beside him in the far fist, a sheaf of
 * arrows loose in the near hand, a broad-brimmed hat pulled low, a jerkin in the tint patched with
 * whatever cloth came to hand over a russet shirt, and a hare hung by its hind legs from his belt.
 */
function poacher(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.012, hipTilt: 0.024, turn: -0.012, near: [0.07, 0.12, 0.14], far: [-0.068, -0.1, -0.12], toe: [0.8, -0.7], lift: [0, 0.02] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 23) * h * 0.005;
  const shirt = shade('#8a4a2e', p.tone), hose = shade('#5a4632', p.tone), felt = shade('#3e3226', p.tone);
  const yew = shade('#8a5a2a', p.tone), fur = shade('#6a5440', p.tone), furPale = shade('#c8b490', p.tone);
  const near: Arm = [R.sNear, { x: x + h * 0.2, y: sy + h * 0.2 }, { x: x + h * 0.21, y: sy + h * 0.35 }];
  const far: Arm = [R.sFar, { x: x - h * 0.2, y: sy + h * 0.19 }, { x: x - h * 0.255, y: sy + h * 0.31 }];
  const hemY = y - h * 0.4;
  groundShadow(ctx, x - h * 0.04, y + 1, h * 0.8);
  // The longbow, grounded by the far foot and standing a head above his hat: a D of yew, thick at
  // the grip and fining to the horn nocks, belly to the man, the string a finger's breadth off it.
  const bx = far[2].x - h * 0.012, { top, bot, riser: grip } = longbow(far[2], y, h, x, sway);
  const mid = Math.max(h * 0.016, 1.3), tip = Math.max(h * 0.007, 0.8);
  blob(ctx, B, yew, [
    tube([top.x, top.y, bx - h * 0.02, (top.y + grip.y) / 2, grip.x, grip.y], tip, mid, 0, 201),
    tube([grip.x, grip.y, bx - h * 0.018, (grip.y + bot.y) / 2, bot.x, bot.y], mid, tip, 0, 202),
  ], { h, formK: 0.5, spread: 0.65, tex: 'cracks', seed: 201, amount: 0.3 });
  stroke(ctx, [top.x + h * 0.004, top.y + h * 0.01, bot.x + h * 0.012, bot.y - h * 0.01], R.bone, 1);
  // The far arm down to the grip, behind the body.
  blob(ctx, B, shade(shirt, 0.72), armParts(R, far, 203, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  hand(ctx, R, far[2], Math.atan2(top.y - bot.y, top.x - bot.x), 204, { far: true, flip: 1, k: 0.95 });
  legs(ctx, R, hose, 205, [0.8, -0.7]);
  blob(ctx, B, R.boot, [
    { k: 'cap', x0: x + h * 0.14, y0: y - h * 0.17, x1: x + h * 0.145, y1: y - h * 0.055, r0: h * 0.043, r1: h * 0.041 },
    { k: 'cap', x0: x - h * 0.118, y0: y - h * 0.16, x1: x - h * 0.12, y1: y - h * 0.06, r0: h * 0.041, r1: h * 0.039 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The russet shirt's near sleeve, then the jerkin over the body, sleeveless.
  blob(ctx, B, shirt, armParts(R, near, 206), { h, formK: 0.5, tex: 'folds', seed: 206, amount: 0.5, creases: [elbowCrease(R, near)] });
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.04, seed: 207, sub: 3 }],
    { h, formK: 0.5, tex: 'folds', seed: 207, amount: 0.7, creases: torsoCreases(R, hemY) });
  // Patches of other cloth, sewn on where the jerkin wore through.
  for (const [px, py, pw, ph, hex, seed] of [
    [x - h * 0.08, sy + h * 0.12, h * 0.07, h * 0.06, '#7a5a3a', 208], [x + h * 0.06, sy + h * 0.2, h * 0.06, h * 0.07, '#6e3a2a', 209],
  ] as const) {
    blob(ctx, B, shade(hex, p.tone), [{ k: 'poly', pts: [px, py, px + pw, py + h * 0.004, px + pw - h * 0.003, py + ph, px + h * 0.002, py + ph - h * 0.004] }], { h, formK: 0.4, spread: 0.6, tex: 'stipple', seed, amount: 0.3 });
  }
  // Belt, and the hare hung from it at the far hip by its hind legs, head down against his thigh.
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.05, h * 0.04, 210)], { h, form: false });
  hare(ctx, R, x - h * 0.1, hemY - h * 0.04, h, fur, furPale, sway);
  // A stubbled face under the brim, then the hat: a low crown and a brim wide enough to shade him.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.84, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.58, hx + hr * 0.3, hy + hr * 0.58, hx + hr * 0.86, hy + hr * 0.3, hx + hr * 0.6, hy + hr * 0.9, hx, hy + hr * 1.02, hx - hr * 0.6, hy + hr * 0.9], wobble: 0.06, spiky: 0.06, seed: 211, sub: 2 }], { h, form: false, outline: false });
  face(ctx, R, false);
  softLine(ctx, B, [hx - hr * 0.95, hy - hr * 0.3, hx + hr * 0.95, hy - hr * 0.3], shade('#1a1410', p.tone), Math.max(1, hr * 0.3), 0.45);
  blob(ctx, B, felt, [
    { k: 'curve', pts: [hx - hr * 0.8, hy - hr * 0.55, hx - hr * 0.75, hy - hr * 1.2, hx - hr * 0.2, hy - hr * 1.45, hx + hr * 0.45, hy - hr * 1.38, hx + hr * 0.82, hy - hr * 1.05, hx + hr * 0.85, hy - hr * 0.55], wobble: 0.05, seed: 212, sub: 3 },
    { k: 'curve', pts: [hx - hr * 2.0, hy - hr * 0.5, hx - hr * 1.2, hy - hr * 0.78, hx, hy - hr * 0.84, hx + hr * 1.2, hy - hr * 0.8, hx + hr * 2.0, hy - hr * 0.42, hx + hr * 1.1, hy - hr * 0.4, hx, hy - hr * 0.5, hx - hr * 1.1, hy - hr * 0.42], wobble: 0.05, seed: 213, sub: 3 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 212, amount: 0.4 });
  softLine(ctx, B, [hx - hr * 0.78, hy - hr * 0.7, hx + hr * 0.82, hy - hr * 0.68], shade('#6e3a2a', p.tone), Math.max(1, hr * 0.14), 0.8);
  // Three arrows loose in the near hand, points down, the fletchings standing above the fist.
  const w = near[2];
  for (let i = 0; i < 3; i++) {
    const dx = (i - 1) * h * 0.012;
    stroke(ctx, [w.x + dx - h * 0.01, w.y - h * 0.09, w.x + dx + h * 0.04, w.y + h * 0.17], R.wood, Math.max(1, h * 0.008));
    if (!B.override) {
      ctx.fillStyle = B.col(shade(i === 1 ? '#d8d0b0' : '#8a3a30', p.tone));
      ctx.beginPath(); ctx.moveTo(w.x + dx - h * 0.01, w.y - h * 0.09); ctx.lineTo(w.x + dx - h * 0.018, w.y - h * 0.05); ctx.lineTo(w.x + dx - h * 0.004, w.y - h * 0.05); ctx.closePath(); ctx.fill();
    }
  }
  hand(ctx, R, w, Math.PI * 0.42, 214, { flip: 1 });
  void p.light;
}

/**
 * A hare hung head down by its hind legs from a belt at (bx, by): the hind legs up to the knot, a
 * long body against the thigh, the head and the long ears hanging at the bottom. One mass of fur,
 * so it is part of the man's silhouette and never a thing apart.
 */
function hare(ctx: CanvasRenderingContext2D, R: Rig, bx: number, by: number, h: number, fur: string, pale: string, sway: number): void {
  const s = sway * 0.6, body = { x: bx - h * 0.01 + s, y: by + h * 0.14 }, head = { x: bx - h * 0.014 + s * 1.4, y: by + h * 0.27 };
  blob(ctx, B, fur, [
    tube([bx - h * 0.01, by, bx - h * 0.004, by + h * 0.05, body.x - h * 0.012, body.y - h * 0.04], h * 0.011, h * 0.016, 0.05, 221),
    tube([bx + h * 0.012, by, bx + h * 0.02, by + h * 0.05, body.x + h * 0.014, body.y - h * 0.04], h * 0.011, h * 0.016, 0.05, 222),
    { k: 'ell', x: body.x, y: body.y, rx: h * 0.044, ry: h * 0.085 },
    { k: 'ell', x: head.x, y: head.y, rx: h * 0.03, ry: h * 0.036, rot: 0.1 },
    tube([head.x - h * 0.008, head.y + h * 0.02, head.x - h * 0.024 + s, head.y + h * 0.12], h * 0.011, h * 0.007, 0.05, 223),
    tube([head.x + h * 0.008, head.y + h * 0.02, head.x + h * 0.014 + s, head.y + h * 0.12], h * 0.011, h * 0.007, 0.05, 224),
  ], { h, formK: 0.5, spread: 0.75, tex: 'fur', seed: 221, amount: 0.5 });
  patch(ctx, B, pale, [{ k: 'ell', x: body.x + h * 0.01, y: body.y + h * 0.01, rx: h * 0.018, ry: h * 0.05 }], { alpha: 0.6, feather: 0.6 });
  if (!B.override && h >= 60) { ctx.fillStyle = '#1a1210'; ctx.fillRect(Math.round(head.x + h * 0.006), Math.round(head.y), 1, 1); }
  stroke(ctx, [bx - h * 0.02, by + h * 0.004, bx + h * 0.024, by + h * 0.004], R.strap, Math.max(1, h * 0.01));
}

/**
 * The billman: the Salt Road's harder man, a deserter who kept his bill. Planted wide with the bill
 * held across him in both fists, the head high and forward: a hooked blade with a spike at its top
 * and another at its back, on an ash pole longer than he is tall. A quilted jack in the tint, a
 * leather cap, a big beard and bare forearms.
 */
function billman(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.015, hipTilt: 0.02, turn: 0.02, near: [0.075, 0.17, 0.21], far: [-0.07, -0.12, -0.15], toe: [1, -0.7], lift: [0, 0.03] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 25) * h * 0.006;
  // The pole, low behind the far hip to high in front of the near shoulder.
  const lo = { x: x - h * 0.2, y: y - h * 0.22 }, hi = { x: x + h * 0.34 + sway, y: y - h * 1.14 };
  const at = (yy: number): Pt => { const t = (lo.y - yy) / (lo.y - hi.y); return { x: lo.x + (hi.x - lo.x) * t, y: yy }; };
  const gNear = at(sy + h * 0.06), gFar = at(sy + h * 0.34);
  const near: Arm = [R.sNear, { x: x + h * 0.25, y: sy + h * 0.17 }, gNear];
  const far: Arm = [R.sFar, { x: x - h * 0.19, y: sy + h * 0.24 }, gFar];
  const hemY = y - h * 0.4;
  const jack = p.base, cap = shade('#4a3424', p.tone);
  groundShadow(ctx, x, y + 1, h * 0.8);
  // The far arm, bare from the elbow as the near one is, the jack's sleeve over the upper arm.
  blob(ctx, B, shade(R.skin, 0.8), armParts(R, far, 231, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  blob(ctx, B, shade(p.base, 0.8), armParts(R, [far[0], far[1], { x: (far[1].x + far[2].x) / 2, y: (far[1].y + far[2].y) / 2 }], 244, 0.96), { h, formK: 0.45 });
  legs(ctx, R, shade('#3e3a34', p.tone), 232, [1, -0.7]);
  blob(ctx, B, R.boot, [
    { k: 'cap', x0: x + h * 0.2, y0: y - h * 0.18, x1: x + h * 0.21, y1: y - h * 0.055, r0: h * 0.045, r1: h * 0.043 },
    { k: 'cap', x0: x - h * 0.14, y0: y - h * 0.17, x1: x - h * 0.15, y1: y - h * 0.06, r0: h * 0.043, r1: h * 0.041 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The jack: quilted in rows, to the thigh, with the near arm bare from the elbow too.
  blob(ctx, B, jack, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 233, sub: 3 },
    { k: 'curve', pts: [x - h * 0.13, hemY - h * 0.1, x - h * 0.15, hemY + h * 0.04, x - h * 0.02, hemY + h * 0.07, x + h * 0.14, hemY + h * 0.04, x + h * 0.14, hemY - h * 0.1], wobble: 0.04, seed: 234, sub: 2 },
    ...armParts(R, [near[0], near[1], { x: (near[1].x + near[2].x) / 2, y: (near[1].y + near[2].y) / 2 }], 235),
  ], { h, formK: 0.55, tex: 'folds', seed: 233, amount: 0.5, creases: torsoCreases(R, hemY) });
  if (!B.override && h >= 50) for (let i = 1; i < 5; i++) {
    const ly = sy + h * (0.06 + i * 0.075);
    softLine(ctx, B, [x - trunkW(R, ly) * 0.8, ly, x + trunkW(R, ly) * 0.85, ly + h * 0.006], shade(jack, 0.7), Math.max(1, h * 0.008), 0.5);
  }
  blob(ctx, B, R.skin, armParts(R, [{ x: (near[1].x + near[2].x) / 2, y: (near[1].y + near[2].y) / 2 }, { x: (near[1].x * 0.3 + near[2].x * 0.7), y: (near[1].y * 0.3 + near[2].y * 0.7) }, near[2]], 236, 0.9), { h, formK: 0.5 });
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.05, h * 0.042, 237)], { h, form: false });
  band(ctx, B, x - h * 0.02, hemY - h * 0.054, h * 0.04, h * 0.042, R.dull);
  // A big beard, the face and a leather cap pulled down to the brows.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.9, hy + hr * 0.1, hx - hr * 0.4, hy + hr * 0.5, hx + hr * 0.4, hy + hr * 0.5, hx + hr * 0.92, hy + hr * 0.1, hx + hr * 0.8, hy + hr * 1.1, hx + hr * 0.2, hy + hr * 1.6, hx - hr * 0.4, hy + hr * 1.5, hx - hr * 0.85, hy + hr * 1.0], wobble: 0.08, spiky: 0.14, seed: 238, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, true, true);
  blob(ctx, B, cap, [{ k: 'curve', pts: [hx - hr * 1.02, hy - hr * 0.2, hx - hr * 0.95, hy - hr * 0.85, hx - hr * 0.3, hy - hr * 1.12, hx + hr * 0.4, hy - hr * 1.1, hx + hr * 0.98, hy - hr * 0.8, hx + hr * 1.04, hy - hr * 0.22, hx + hr * 0.6, hy - hr * 0.4, hx - hr * 0.6, hy - hr * 0.42], wobble: 0.04, seed: 239, sub: 2 }], { h, formK: 0.55, spread: 0.7, tex: 'stipple', seed: 239, amount: 0.3 });
  // The bill: the ash pole across him, then its head.
  blob(ctx, B, R.wood, [tube([lo.x, lo.y, hi.x, hi.y], Math.max(h * 0.014, 1.1), Math.max(h * 0.012, 1), 0, 240)], { h, formK: 0.5, spread: 0.6, tex: 'cracks', seed: 240, amount: 0.3 });
  const ux = (hi.x - lo.x) / Math.hypot(hi.x - lo.x, hi.y - lo.y), uy = (hi.y - lo.y) / Math.hypot(hi.x - lo.x, hi.y - lo.y), nx = -uy, ny = ux;
  const Q = (u: number, v: number): number[] => [hi.x + ux * h * u + nx * h * v, hi.y + uy * h * u + ny * h * v];
  // A broad blade forward, hooked at its top, with a spike up the pole's line and one behind.
  glossPoly(ctx, B, [
    ...Q(-0.14, 0.012), ...Q(-0.12, 0.06), ...Q(-0.04, 0.085), ...Q(0.02, 0.07), ...Q(0.04, 0.03),
    ...Q(0.14, 0.006), ...Q(0.14, -0.006), ...Q(0.03, -0.012), ...Q(0.0, -0.06), ...Q(-0.03, -0.012), ...Q(-0.14, -0.012),
  ], R.steel, { gloss: 0.4, spread: 0.6 });
  blob(ctx, B, R.dull, [tube([...Q(-0.16, 0), ...Q(-0.12, 0)], Math.max(h * 0.02, 1.4), Math.max(h * 0.018, 1.3), 0, 241)], { h, formK: 0.5 });
  hand(ctx, R, gFar, Math.atan2(hi.y - lo.y, hi.x - lo.x), 242, { far: true, flip: 1, k: 0.95 });
  hand(ctx, R, gNear, Math.atan2(hi.y - lo.y, hi.x - lo.x), 243, { flip: 1 });
  void p.light;
}

/**
 * The slinger: the road's harder shot, a shepherd gone bad. A fleece jerkin in the tint over a
 * rough shirt, a woollen cap, a bag of flints at the hip and one more in the far fist and the
 * sling whirling over his head in the near: two cords from the fist to the pouch, going round.
 */
function slinger(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.02, hipTilt: -0.02, turn: -0.015, near: [0.07, 0.13, 0.16], far: [-0.07, -0.13, -0.17], toe: [0.8, -0.9], lift: [0.02, 0] });
  const { sy, hx, hy, hr } = R;
  const shirt = shade('#6a5a48', p.tone), capHex = shade('#7a2e26', p.tone), flint = shade('#a8a4a0', p.tone);
  const near: Arm = [R.sNear, { x: x + h * 0.22, y: sy - h * 0.1 }, { x: x + h * 0.14, y: sy - h * 0.3 }];
  const far: Arm = [R.sFar, { x: x - h * 0.2, y: sy + h * 0.19 }, { x: x - h * 0.23, y: sy + h * 0.34 }];
  const hemY = y - h * 0.4;
  groundShadow(ctx, x, y + 1, h * 0.78);
  blob(ctx, B, shade(shirt, 0.8), armParts(R, far, 251, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  // The flint in the far fist.
  blob(ctx, B, flint, [{ k: 'curve', pts: ring(far[2].x - h * 0.01, far[2].y + h * 0.03, h * 0.028, h * 0.022), wobble: 0.15, seed: 252, sub: 2 }], { h, formK: 0.5, tex: 'facets', seed: 252, amount: 0.5 });
  hand(ctx, R, far[2], Math.PI / 2, 253, { far: true, flip: 1, k: 0.95 });
  legs(ctx, R, shade('#4a3e30', p.tone), 254, [0.8, -0.9]);
  blob(ctx, B, R.boot, [
    { k: 'cap', x0: x + h * 0.16, y0: y - h * 0.17, x1: x + h * 0.165, y1: y - h * 0.055, r0: h * 0.043, r1: h * 0.041 },
    { k: 'cap', x0: x - h * 0.17, y0: y - h * 0.16, x1: x - h * 0.175, y1: y - h * 0.06, r0: h * 0.041, r1: h * 0.039 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The near sleeve raised, then the fleece over the body, its edge ragged with the wool.
  blob(ctx, B, shirt, armParts(R, near, 255), { h, formK: 0.5, tex: 'folds', seed: 255, amount: 0.5, creases: [elbowCrease(R, near)] });
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.08, spiky: 0.12, seed: 256, sub: 3 }], { h, formK: 0.5, tex: 'fur', seed: 256, amount: 0.6, creases: torsoCreases(R, hemY) });
  // The bag of flints at the near hip, heavy, on a strap from the far shoulder.
  stroke(ctx, [R.sFar.x + h * 0.02, sy + h * 0.02, x + h * 0.12, hemY - h * 0.02], R.strap, Math.max(1, h * 0.014));
  blob(ctx, B, R.leather, [{ k: 'curve', pts: ring(x + h * 0.13, hemY + h * 0.02, h * 0.05, h * 0.06), wobble: 0.1, seed: 257, sub: 2 }], { h, formK: 0.5, spread: 0.7, tex: 'stipple', seed: 257, amount: 0.3 });
  // A short beard, the face and a woollen cap with its end flopped over.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.8, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.6, hx + hr * 0.3, hy + hr * 0.6, hx + hr * 0.84, hy + hr * 0.3, hx + hr * 0.55, hy + hr * 1.0, hx, hy + hr * 1.12, hx - hr * 0.55, hy + hr * 1.0], wobble: 0.06, spiky: 0.1, seed: 258, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, false);
  blob(ctx, B, capHex, [
    { k: 'curve', pts: [hx - hr * 1.02, hy - hr * 0.3, hx - hr * 0.9, hy - hr * 1.0, hx - hr * 0.2, hy - hr * 1.3, hx + hr * 0.6, hy - hr * 1.2, hx + hr * 1.02, hy - hr * 0.7, hx + hr * 1.02, hy - hr * 0.3], wobble: 0.05, seed: 259, sub: 3 },
    { k: 'curve', pts: [hx - hr * 0.3, hy - hr * 1.25, hx - hr * 0.9, hy - hr * 1.5, hx - hr * 1.45, hy - hr * 1.2, hx - hr * 1.4, hy - hr * 0.85, hx - hr * 0.8, hy - hr * 0.9], wobble: 0.06, seed: 260, sub: 2 },
  ], { h, formK: 0.55, spread: 0.7, tex: 'stipple', seed: 259, amount: 0.3 });
  // The sling going round over his head: the blur of its path, then the two cords and the pouch.
  const w = near[2], a = p.frame / 5, rr = h * 0.2;
  const px = w.x + Math.cos(a) * rr, py = w.y - h * 0.02 + Math.sin(a) * rr * 0.3;
  if (!B.override) {
    ctx.strokeStyle = rgba(shade('#e8e0d0', p.tone), 0.3); ctx.lineWidth = Math.max(1, h * 0.01);
    ctx.beginPath(); ctx.ellipse(w.x, w.y - h * 0.02, rr, rr * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
  }
  stroke(ctx, [w.x, w.y - h * 0.01, (w.x + px) / 2, (w.y + py) / 2 - h * 0.012, px, py], R.leather, Math.max(1, h * 0.009));
  stroke(ctx, [w.x, w.y - h * 0.01, (w.x + px) / 2, (w.y + py) / 2 + h * 0.008, px, py], R.leather, Math.max(1, h * 0.009));
  blob(ctx, B, R.leather, [{ k: 'ell', x: px, y: py, rx: h * 0.028, ry: h * 0.02, rot: a }], { h, formK: 0.5, spread: 0.7 });
  hand(ctx, R, w, -Math.PI / 2, 261, { flip: 1 });
  void p.light;
}

/**
 * The cutthroat: the bandit camp's own, who keeps it and never leaves it. Lean and crouched, weight
 * forward, a knife low in each fist, the far one held reversed along the forearm. A thief's long
 * coat in the tint, a captain's sash taken off a better man, yellowed, over it from the near
 * shoulder to the far hip, and a belt of knife hilts. Cropped hair, stubble and a scar.
 */
function cutthroat(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.04, hipTilt: 0.02, turn: 0.03, near: [0.08, 0.18, 0.22], far: [-0.075, -0.12, -0.16], toe: [1, -0.8], lift: [0, 0.03] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 19) * h * 0.006;
  const near: Arm = [R.sNear, { x: x + h * 0.26, y: sy + h * 0.2 }, { x: x + h * 0.32 + sway, y: sy + h * 0.31 }];
  const far: Arm = [R.sFar, { x: x - h * 0.21, y: sy + h * 0.17 }, { x: x - h * 0.17, y: sy + h * 0.3 }];
  const hemY = y - h * 0.42, skirtY = y - h * 0.24;
  const coat = p.base, sash = shade('#b89a4a', p.tone);
  groundShadow(ctx, x, y + 1, h * 0.8);
  blob(ctx, B, shade(p.dark, 0.86), armParts(R, far, 331, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  // The far knife, reversed along the forearm.
  const fa = blade(ctx, R, far[2], far[2].x - h * 0.02, far[2].y - h * 0.13, h * 0.012, h * 0.026);
  hand(ctx, R, far[2], fa, 332, { far: true, flip: 1, k: 0.92 });
  legs(ctx, R, shade('#2e2a26', p.tone), 333, [1, -0.8]);
  blob(ctx, B, R.boot, [
    { k: 'cap', x0: x + h * 0.2, y0: y - h * 0.18, x1: x + h * 0.21, y1: y - h * 0.055, r0: h * 0.044, r1: h * 0.042 },
    { k: 'cap', x0: x - h * 0.15, y0: y - h * 0.17, x1: x - h * 0.16, y1: y - h * 0.06, r0: h * 0.041, r1: h * 0.039 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The coat: body, near sleeve and skirts to the knee, split at the front.
  blob(ctx, B, coat, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 334, sub: 3 },
    { k: 'curve', pts: [
      x - h * 0.13, hemY - h * 0.1, x - h * 0.17, hemY - h * 0.02, x - h * 0.19, skirtY,
      x - h * 0.05, skirtY + h * 0.02, x + h * 0.03, skirtY - h * 0.03, x + h * 0.09, skirtY + h * 0.01, x + h * 0.2, skirtY - h * 0.01,
      x + h * 0.17, hemY - h * 0.02, x + h * 0.14, hemY - h * 0.1,
    ], wobble: 0.05, seed: 335, sub: 3 },
    ...armParts(R, near, 336),
  ], { h, formK: 0.5, tex: 'folds', seed: 334, amount: 0.7, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The sash, from the near shoulder across to the far hip, knotted there with its ends hanging.
  const s0 = { x: R.sNear.x - h * 0.02, y: sy + h * 0.01 }, s1 = { x: x - h * 0.12, y: hemY - h * 0.03 };
  blob(ctx, B, sash, [
    tube([s0.x, s0.y, s1.x, s1.y], h * 0.034, h * 0.03, 0, 337),
    { k: 'curve', pts: [s1.x - h * 0.02, s1.y, s1.x + h * 0.02, s1.y + h * 0.01, s1.x + h * 0.01, s1.y + h * 0.11, s1.x - h * 0.03, s1.y + h * 0.1], wobble: 0.06, seed: 338, sub: 2 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 337, amount: 0.4 });
  // The belt, and three knife hilts along it.
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.05, h * 0.04, 339)], { h, form: false });
  for (let i = 0; i < 3; i++) {
    const kx = x + h * (0.02 + i * 0.045), ky = hemY - h * 0.05;
    blob(ctx, B, R.wood, [tube([kx, ky - h * 0.05, kx + h * 0.005, ky + h * 0.01], Math.max(h * 0.011, 1), Math.max(h * 0.01, 1), 0, 340 + i)], { h, formK: 0.5, spread: 0.6 });
    band(ctx, B, kx - h * 0.012, ky - h * 0.006, h * 0.024, h * 0.012, R.dull);
  }
  // Stubble, the face with its scar, and hair cropped to the skull.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.84, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.58, hx + hr * 0.3, hy + hr * 0.58, hx + hr * 0.86, hy + hr * 0.3, hx + hr * 0.6, hy + hr * 0.9, hx, hy + hr * 1.02, hx - hr * 0.6, hy + hr * 0.9], wobble: 0.06, spiky: 0.06, seed: 344, sub: 2 }], { h, form: false, outline: false });
  face(ctx, R, false, true);
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 1.0, hy - hr * 0.3, hx - hr * 0.9, hy - hr * 0.9, hx - hr * 0.3, hy - hr * 1.12, hx + hr * 0.4, hy - hr * 1.1, hx + hr * 0.96, hy - hr * 0.82, hx + hr * 1.02, hy - hr * 0.3, hx + hr * 0.6, hy - hr * 0.62, hx - hr * 0.6, hy - hr * 0.64], wobble: 0.05, spiky: 0.1, seed: 345, sub: 2 }], { h, formK: 0.45, tex: 'stipple', seed: 345, amount: 0.3 });
  // The near knife, low and forward, point up: the one he means to use.
  const ka = blade(ctx, R, near[2], near[2].x + h * 0.14, near[2].y - h * 0.06, h * 0.014, h * 0.03);
  hand(ctx, R, near[2], ka, 346, { flip: -1 });
  void p.light;
}

/**
 * The footpad: a road thief who has robbed his coat off a gentleman. The coat is the tint, cut for a
 * bigger man, to below the knee, with turned-back cuffs in a claret facing, brass buttons and braid
 * down the front and a lace stock gone grey at the throat, all over his own rough clothes; a
 * battered cocked hat, no mask and a short knife held low and forward in the near fist.
 */
function footpad(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.02, hipTilt: 0.026, turn: 0.028, near: [0.07, 0.16, 0.2], far: [-0.068, -0.085, -0.09], toe: [1, -0.6], lift: [0, 0.04] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.008;
  const near: Arm = [R.sNear, { x: x + h * 0.27, y: sy + h * 0.19 }, { x: x + h * 0.3, y: sy + h * 0.34 }];
  const far: Arm = [R.sFar, { x: x - h * 0.2, y: sy + h * 0.19 }, { x: x - h * 0.205, y: sy + h * 0.35 }];
  const hemY = y - h * 0.42, skirtY = y - h * 0.22;
  const coat = p.base, facing = shade('#7a3432', p.tone), lace = shade('#e4e0d4', p.tone);
  groundShadow(ctx, x, y + 1, h * 0.76);
  blob(ctx, B, shade(p.dark, 0.86), armParts(R, far, 171, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  hand(ctx, R, far[2], null, 172, { far: true, k: 0.92 });
  legs(ctx, R, shade('#3a3630', p.tone), 173, [1, -0.6]);
  blob(ctx, B, R.boot, [
    { k: 'cap', x0: x + h * 0.196, y0: y - h * 0.18, x1: x + h * 0.2, y1: y - h * 0.055, r0: h * 0.044, r1: h * 0.042 },
    { k: 'cap', x0: x - h * 0.088, y0: y - h * 0.17, x1: x - h * 0.09, y1: y - h * 0.065, r0: h * 0.041, r1: h * 0.039 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The coat: body, near sleeve and long skirts, too big for him, open at the front.
  blob(ctx, B, coat, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 174, sub: 3 },
    { k: 'curve', pts: [
      x - h * 0.13, hemY - h * 0.1, x - h * 0.17, hemY - h * 0.02, x - h * 0.2, skirtY,
      x - h * 0.06, skirtY + h * 0.02, x + h * 0.02, skirtY - h * 0.02, x + h * 0.08, skirtY + h * 0.012, x + h * 0.21, skirtY - h * 0.01,
      x + h * 0.17, hemY - h * 0.02, x + h * 0.14, hemY - h * 0.1,
    ], wobble: 0.05, seed: 175, sub: 3 },
    ...armParts(R, near, 176),
  ], { h, formK: 0.5, tex: 'folds', seed: 174, amount: 0.8, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The front edge in braid, and a row of brass buttons: the one thing on him worth money.
  softLine(ctx, B, [x + h * 0.014, sy + h * 0.05, x + h * 0.02, hemY, x + h * 0.03, skirtY], R.brass, Math.max(1, h * 0.012), 0.8);
  for (let i = 0; i < 4; i++) glossBall(ctx, B, x + h * 0.04, sy + h * (0.08 + i * 0.07), Math.max(1, h * 0.012), R.brass, { gloss: 0.6 });
  // The deep cuff turned back on the near sleeve, in the claret facing.
  const e = near[1], w = near[2], cu = (t: number): number[] => [e.x + (w.x - e.x) * t, e.y + (w.y - e.y) * t];
  blob(ctx, B, facing, [tube([...cu(0.6), ...cu(0.88)], h * 0.036, h * 0.044, 0, 177)], { h, formK: 0.5, spread: 0.7 });
  // The lace stock at the throat, rumpled and grey with the road.
  blob(ctx, B, lace, [{ k: 'curve', pts: [hx - hr * 0.5, hy + hr * 1.55, hx + hr * 0.55, hy + hr * 1.5, hx + hr * 0.45, hy + hr * 2.2, hx + hr * 0.05, hy + hr * 2.6, hx - hr * 0.3, hy + hr * 2.2], wobble: 0.08, spiky: 0.14, seed: 178, sub: 2 }],
    { h, formK: 0.4, spread: 0.7, tex: 'folds', seed: 178, amount: 0.4 });
  // Stubble, the face and a cocked hat gone shapeless in the rain.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.84, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.58, hx + hr * 0.3, hy + hr * 0.58, hx + hr * 0.86, hy + hr * 0.3, hx + hr * 0.6, hy + hr * 0.9, hx, hy + hr * 1.02, hx - hr * 0.6, hy + hr * 0.9], wobble: 0.06, spiky: 0.06, seed: 179, sub: 2 }], { h, form: false, outline: false });
  face(ctx, R, false, true);
  blob(ctx, B, shade('#2a2622', p.tone), [
    { k: 'curve', pts: [hx - hr * 0.9, hy - hr * 0.6, hx - hr * 0.7, hy - hr * 1.35, hx, hy - hr * 1.6, hx + hr * 0.75, hy - hr * 1.35, hx + hr * 0.95, hy - hr * 0.6], wobble: 0.04, seed: 180, sub: 3 },
    { k: 'curve', pts: [
      hx - hr * 1.65, hy - hr * 0.45 + sway, hx - hr * 1.1, hy - hr * 1.15, hx - hr * 0.3, hy - hr * 0.9, hx + hr * 0.5, hy - hr * 1.2,
      hx + hr * 1.6, hy - hr * 0.7, hx + hr * 1.0, hy - hr * 0.5, hx + hr * 0.2, hy - hr * 0.38, hx - hr * 0.8, hy - hr * 0.5,
    ], wobble: 0.05, seed: 181, sub: 3 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 180, amount: 0.4 });
  // The short blade, held low and forward, point up a little: a knife for close work.
  const ka = blade(ctx, R, near[2], near[2].x + h * 0.15, near[2].y - h * 0.03, h * 0.014, h * 0.03);
  hand(ctx, R, near[2], ka, 182, { flip: -1 });
  void p.light;
}

/**
 * The veteran: planted wide with the near foot forward and the sword shoulder raised. Cloak and
 * tabard in the tint over a mail shirt, a kettle helm with a flared brim in dull steel, a heater
 * shield on the far arm, a longsword up in a gauntleted fist, greaves.
 */
function brigand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.025, hipTilt: -0.03, turn: 0.014, near: [0.08, 0.185, 0.245], far: [-0.072, -0.125, -0.145], toe: [1, -0.8], lift: [0, 0.062] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.008;
  // Near arm: the same relaxed drop as the bandit's (162 deg at the elbow) but with a longer blade,
  // so the veteran stands with his point almost in the turf and the thug's is up at knee height.
  // Raised, this arm could only be unfolded by winging the elbow out past the ribs, because the
  // frame is 0.92h wide and the arm alone is 0.345h: there is no room to hold a sword up.
  const near: Arm = [R.sNear, { x: x + h * 0.245, y: sy + h * 0.181 }, { x: x + h * 0.225, y: sy + h * 0.34 }];
  // Far arm: elbow at the waist, forearm out and slightly up so the hand sits behind the shield's
  // centre — the shield is strapped to that forearm and has to be ON it. Held at chest height it
  // also keeps one arm up now that the sword arm is down, so the two sides still read differently.
  const far: Arm = [R.sFar, { x: x - h * 0.17, y: sy + h * 0.251 }, { x: x - h * 0.33, y: sy + h * 0.245 }];
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
  const ga = blade(ctx, R, near[2], x + h * 0.449, y - h * 0.096, h * 0.024, h * 0.085);
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
  const cx = x - h * 0.306, cy = y - h * 0.509, sw = h * 0.118, sh = h * 0.182;
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
  const R = makeRig(x, y, h, p, { tilt: 0.022, hipTilt: 0.028, turn: -0.024, near: [0.07, 0.105, 0.03], far: [-0.068, -0.165, -0.245], toe: [-0.3, -1], lift: [0.088, 0] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.007;
  // Both elbows re-placed on the real segment lengths. The far elbow used to measure 6 deg — the
  // forearm folded flat back along the upper arm — because the fore-end hand sat 0.07h from its own
  // shoulder. The fix is not to fling that hand out into empty air: it is to bring the fore-end IN
  // so the weapon crosses the chest, which is what port arms means, and let the ELBOW be the thing
  // that stands out. The fists end up 0.28h apart, about the 49 cm a crossbow actually asks for.
  const near: Arm = [R.sNear, { x: x + h * 0.247, y: sy + h * 0.207 }, { x: x + h * 0.09, y: sy + h * 0.24 }];
  const far: Arm = [R.sFar, { x: x - h * 0.326, y: sy + h * 0.115 }, { x: x - h * 0.215, y: sy + h * 0.23 }];
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
  // The crossbow at port arms, spanned and loaded. Laid out in stock coordinates — u from the grip
  // hand out to the fore-end hand, n across it — so the whole weapon is one straight description:
  // a stock with a butt and a comb, a steel prod whose limbs TAPER to their tips, the string drawn
  // back to the nut just ahead of the trigger, and a bolt in the groove with its head out past the
  // prod. It was a uniform stroked arc with no string at all, which reads as a scythe, not a bow.
  const gx = near[2].x, gy = near[2].y, fx = far[2].x, fy = far[2].y;
  const dx = fx - gx, dy = fy - gy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const pw = h * 0.16, sw = h * 0.016;
  const mz = len + h * 0.075;   // the muzzle: the prod stands forward of the supporting hand
  const Q = (u: number, n: number): Pt => ({ x: gx + ux * u + nx * n, y: gy + uy * u + ny * n });
  const QA = (u: number, n: number, out: number[]): number[] => { const q = Q(u, n); out.push(q.x, q.y); return out; };
  // Stock: fore-end, underside past the grip swell, round the butt and back along the comb.
  const st: number[] = [];
  QA(mz + h * 0.05, sw * 0.85, st); QA(mz + h * 0.057, -sw * 0.85, st); QA(h * 0.03, -sw * 1.25, st);
  QA(-h * 0.022, -sw * 3.3, st); QA(-h * 0.082, -sw * 2.9, st); QA(-h * 0.1, -sw * 0.1, st);
  QA(-h * 0.07, sw * 1.7, st); QA(h * 0.05, sw * 1.35, st); QA(mz * 0.62, sw * 1.05, st);
  blob(ctx, B, R.wood, [{ k: 'curve', pts: st, wobble: 0.02, seed: 81, sub: 2 }], { h, formK: 0.5, spread: 0.6, tex: 'cracks', seed: 81, amount: 0.45 });
  // The prod: two tapered limbs in one steel mass, thick at the fore-end and fine at the nocks.
  const lim = (sgn: number): Part => tube([
    Q(mz - h * 0.03, sgn * pw).x, Q(mz - h * 0.03, sgn * pw).y,
    Q(mz + h * 0.012, sgn * pw * 0.55).x, Q(mz + h * 0.012, sgn * pw * 0.55).y,
    Q(mz + h * 0.016, 0).x, Q(mz + h * 0.016, 0).y,
  ], Math.max(h * 0.0105, Math.min(1, h * 0.026) * 0.75), Math.max(h * 0.024, Math.min(1, h * 0.026) * 1.5), 0, 82 + sgn);
  blob(ctx, B, R.steel, [lim(1), lim(-1)], { h, formK: 0.55, gloss: 0.4, spread: 0.6 });
  // Stirrup at the nose, and the string drawn back to the nut: a loaded weapon, not a bent stick.
  const s0 = Q(mz - h * 0.03, pw), s1 = Q(mz - h * 0.03, -pw), nut = Q(mz * 0.5, sw * 0.15);
  stroke(ctx, [s0.x, s0.y, nut.x, nut.y, s1.x, s1.y], R.bone, Math.max(1, h * 0.011));
  const k0 = Q(mz + h * 0.045, sw * 0.8), k1 = Q(mz + h * 0.082, 0), k2 = Q(mz + h * 0.045, -sw * 2.2);
  stroke(ctx, [k0.x, k0.y, k1.x, k1.y, k2.x, k2.y], R.dull, Math.max(1, h * 0.013));
  // The bolt in the groove, head out past the prod; then the nut and the trigger lever.
  const b0 = Q(mz * 0.5, sw * 0.5), b1 = Q(mz + h * 0.03, sw * 0.5);
  stroke(ctx, [b0.x, b0.y, b1.x, b1.y], shade('#d8d0b0', p.tone), Math.max(1.5, h * 0.016));
  const t0 = Q(mz + h * 0.068, sw * 0.3), t1 = Q(mz + h * 0.028, sw * 1.5), t2 = Q(mz + h * 0.028, -sw * 0.9);
  ctx.fillStyle = B.col(R.steel);
  ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.lineTo(t2.x, t2.y); ctx.closePath(); ctx.fill();
  glossBall(ctx, B, nut.x, nut.y, Math.max(1.5, h * 0.018), R.dull, { gloss: 0.5, spread: 0.6 });
  const v0 = Q(mz * 0.46, -sw * 1.2), v1 = Q(mz * 0.37, -sw * 3.2);
  stroke(ctx, [v0.x, v0.y, v1.x, v1.y], R.steel, Math.max(1, h * 0.013));
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

// ------------------------------------------------------------------ the smugglers ----
/**
 * A gaff: a boat hook. A pole with an iron head at the top -- a spike forward and a hook back --
 * held in both hands across the body. It is the one long two-handed thing in this family, which is
 * most of what separates the smuggler from the road thug at a glance.
 */
function gaff(ctx: CanvasRenderingContext2D, R: Rig, lo: Pt, hi: Pt): void {
  const { h } = R;
  const dx = hi.x - lo.x, dy = hi.y - lo.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const nx = -uy, ny = ux;
  blob(ctx, B, R.wood, [{ k: 'cap', x0: lo.x, y0: lo.y, x1: hi.x, y1: hi.y, r0: h * 0.016, r1: h * 0.013 }],
    { h, formK: 0.5, spread: 0.6, tex: 'cracks', seed: 71, amount: 0.4 });
  // The head: a ferrule, a spike carrying on up the shaft, and a hook curling back off it.
  blob(ctx, B, R.steel, [
    { k: 'cap', x0: hi.x - ux * h * 0.022, y0: hi.y - uy * h * 0.022, x1: hi.x + ux * h * 0.012, y1: hi.y + uy * h * 0.012, r0: h * 0.019, r1: h * 0.016 },
    { k: 'poly', pts: [
      hi.x + ux * h * 0.01 + nx * h * 0.016, hi.y + uy * h * 0.01 + ny * h * 0.016,
      hi.x + ux * h * 0.105, hi.y + uy * h * 0.105,
      hi.x + ux * h * 0.01 - nx * h * 0.016, hi.y + uy * h * 0.01 - ny * h * 0.016,
    ] },
    tube([
      hi.x - nx * h * 0.014, hi.y - ny * h * 0.014,
      hi.x + ux * h * 0.044 - nx * h * 0.07, hi.y + uy * h * 0.044 - ny * h * 0.07,
      hi.x - ux * h * 0.03 - nx * h * 0.098, hi.y - uy * h * 0.03 - ny * h * 0.098,
    ], h * 0.017, h * 0.008, 0, 72),
  ], { h, formK: 0.6, spread: 0.6, gloss: 0.35 });
}

/**
 * The smuggler: a boatman, not a road thug. Stands square and heavy on both feet with the weight
 * back, the way a man holding a long pole does, and works the gaff in BOTH hands across the body --
 * the only two-handed grip in the family. Oilskin cape off one shoulder, a knitted cap instead of
 * a bandana, and no mask: he has no reason to hide his face down here.
 */
function smuggler(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.01, hipTilt: -0.014, turn: 0.014, near: [0.082, 0.15, 0.168], far: [-0.086, -0.115, -0.138], toe: [0.7, -0.7], lift: [0, 0] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.007;
  // The gaff first, then the hands: both wrists are taken off the shaft's own line at a fraction of
  // its length, so neither can end up gripping the air beside it.
  const lo = { x: x + h * 0.15, y: y - h * 0.06 }, hi = { x: x - h * 0.05 + sway, y: sy - h * 0.09 };
  const on = (t: number): Pt => ({ x: lo.x + (hi.x - lo.x) * t, y: lo.y + (hi.y - lo.y) * t });
  const gripHi = on(0.72), gripLo = on(0.34);
  const far: Arm = [R.sFar, { x: x - h * 0.198, y: sy + h * 0.135 }, gripHi];
  const near: Arm = [R.sNear, { x: x + h * 0.216, y: sy + h * 0.17 }, gripLo];
  const hemY = y - h * 0.4;
  groundShadow(ctx, x, y + 1, h * 0.76);
  blob(ctx, B, shade(p.dark, 0.82), armParts(R, far, 73, 0.92), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  legs(ctx, R, shade('#2e3640', p.tone), 74, [0.8, -0.8]);
  // Sea boots: tall enough to read as a different man's footwear.
  blob(ctx, B, shade('#2a2420', p.tone), [
    { k: 'cap', x0: x + h * 0.15, y0: y - h * 0.185, x1: x + h * 0.162, y1: y - h * 0.055, r0: h * 0.044, r1: h * 0.042 },
    { k: 'cap', x0: x - h * 0.118, y0: y - h * 0.175, x1: x - h * 0.126, y1: y - h * 0.055, r0: h * 0.041, r1: h * 0.039 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 75, sub: 3 }, ...armParts(R, near, 76)],
    { h, formK: 0.5, tex: 'folds', seed: 75, amount: 0.7, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The oilskin: one cape off the far shoulder, hanging to the hip, with a heavy collar.
  blob(ctx, B, shade('#3a4a42', p.tone), [
    { k: 'curve', pts: [
      x - h * 0.2, sy - h * 0.01, x - h * 0.242, sy + h * 0.12, x - h * 0.216, sy + h * 0.29,
      x - h * 0.13, sy + h * 0.33, x - h * 0.03, sy + h * 0.26, x - h * 0.02, sy + h * 0.02,
      x - h * 0.09, sy - h * 0.05,
    ], wobble: 0.04, seed: 77, sub: 3 },
    { k: 'curve', pts: [hx - hr * 1.3, hy + hr * 1.5, hx - hr * 0.5, hy + hr * 1.1, hx + hr * 0.6, hy + hr * 1.15, hx + hr * 1.2, hy + hr * 1.6, hx + hr * 0.3, hy + hr * 1.9, hx - hr * 0.8, hy + hr * 1.85], wobble: 0.05, seed: 78, sub: 2 },
  ], { h, formK: 0.55, spread: 0.7, tex: 'folds', seed: 77, amount: 0.5 });
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.05, h * 0.044, 79)], { h, form: false });
  band(ctx, B, x - h * 0.02, hemY - h * 0.054, h * 0.04, h * 0.042, R.brass);
  // A knitted cap pulled down to the brow, and a fringe of hair under it.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.98, hy - hr * 0.5, hx - hr * 0.45, hy - hr * 0.34, hx + hr * 0.55, hy - hr * 0.36, hx + hr * 1.0, hy - hr * 0.52, hx + hr * 0.84, hy - hr * 0.1, hx, hy - hr * 0.2, hx - hr * 0.88, hy - hr * 0.08], wobble: 0.07, spiky: 0.1, seed: 80, sub: 2 }], { h, form: false });
  const wool = shade('#7a5a3a', p.tone);
  blob(ctx, B, wool, [
    { k: 'curve', pts: [hx - hr * 1.1, hy - hr * 0.52, hx - hr * 1.04, hy - hr * 1.0, hx - hr * 0.3, hy - hr * 1.34, hx + hr * 0.5, hy - hr * 1.3, hx + hr * 1.06, hy - hr * 0.96, hx + hr * 1.12, hy - hr * 0.5], wobble: 0.05, seed: 81, sub: 3 },
    { k: 'curve', pts: ring(hx + hr * 0.14, hy - hr * 1.34, hr * 0.22, hr * 0.19), wobble: 0.1, seed: 82, sub: 2 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 81, amount: 0.45 });
  // The rolled brim: its own band, a step darker, so the cap reads as knitted and turned up.
  blob(ctx, B, shade(wool, 0.78), [{ k: 'cap', x0: hx - hr * 1.06, y0: hy - hr * 0.56, x1: hx + hr * 1.08, y1: hy - hr * 0.52, r0: hr * 0.19, r1: hr * 0.18 }], { h, formK: 0.6, spread: 0.6 });
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.88, hy + hr * 0.36, hx - hr * 0.6, hy + hr * 0.82, hx, hy + hr * 1.02, hx + hr * 0.62, hy + hr * 0.8, hx + hr * 0.9, hy + hr * 0.34, hx + hr * 0.72, hy + hr * 0.98, hx, hy + hr * 1.2, hx - hr * 0.7, hy + hr * 0.96], wobble: 0.08, spiky: 0.1, seed: 85, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, false);
  // The gaff, and the two hands closed on it.
  gaff(ctx, R, lo, hi);
  const ga = Math.atan2(hi.y - lo.y, hi.x - lo.x);
  hand(ctx, R, near[2], ga, 83, { flip: 1 });
  hand(ctx, R, far[2], ga, 84, { flip: -1, k: 0.92 });
  void p.light;
}

/**
 * A shortbow at full draw. The two existing archers in this family HOLD a bow; this one is pulling
 * it, which is a different arm configuration entirely -- the bow arm locked out forward, the string
 * hand back at the jaw -- and reads as a bowman at any size without needing the bow itself to be
 * legible. The string is a V through the anchor rather than a straight line nock to nock, because a
 * drawn string is the whole tell.
 */
function bowDrawn(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, anchor: Pt): number {
  const { h } = R;
  // Limbs bent hard away from the archer: a drawn bow is a much deeper arc than a braced one. The
  // riser leads and the tips trail back toward the string hand; they stood out past the grip (#57).
  const { top, bot, riser } = drawnBow(at, h, anchor);
  const tipR = Math.max(h * 0.0075, Math.min(1, h * 0.026) * 0.6), midR = Math.max(h * 0.017, Math.min(1, h * 0.026) * 1.25);
  blob(ctx, B, R.wood, [
    tube([top.x, top.y, at.x - h * 0.004, at.y - h * 0.15, riser.x, riser.y], tipR, midR, 0, 91),
    tube([riser.x, riser.y, at.x - h * 0.006, at.y + h * 0.14, bot.x, bot.y], midR, tipR, 0, 92),
  ], { h, formK: 0.5, spread: 0.65, tex: 'cracks', seed: 91, amount: 0.35 });
  stroke(ctx, [top.x, top.y, anchor.x, anchor.y, bot.x, bot.y], R.bone, 1);
  // The arrow lies along the draw, from the anchor out past the riser.
  const dx = at.x - anchor.x, dy = at.y - anchor.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const tip = { x: at.x + ux * h * 0.09, y: at.y + uy * h * 0.09 };
  stroke(ctx, [anchor.x, anchor.y, tip.x, tip.y], R.wood, Math.max(1, h * 0.013));
  ctx.fillStyle = B.col(R.steel);
  ctx.beginPath();
  ctx.moveTo(tip.x + ux * h * 0.03, tip.y + uy * h * 0.03);
  ctx.lineTo(tip.x - uy * h * 0.016, tip.y + ux * h * 0.016);
  ctx.lineTo(tip.x + uy * h * 0.016, tip.y - ux * h * 0.016);
  ctx.closePath(); ctx.fill();
  if (h >= 46) for (let i = -1; i <= 1; i++) {
    const fx = anchor.x + ux * h * 0.016, fy = anchor.y + uy * h * 0.016;
    ctx.fillStyle = B.col(shade(i === 0 ? '#c8c0a0' : '#8a3a30', R.tone));
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx - ux * h * 0.044 - uy * i * h * 0.021, fy - uy * h * 0.044 + ux * i * h * 0.021);
    ctx.lineTo(fx - ux * h * 0.052 - uy * i * h * 0.021, fy - uy * h * 0.052 + ux * i * h * 0.021);
    ctx.lineTo(fx - ux * h * 0.012, fy - uy * h * 0.012);
    ctx.closePath(); ctx.fill();
  }
  return Math.atan2(bot.y - top.y, bot.x - top.x);
}

/**
 * The smuggler bowman: at full draw, side-on with the NEAR foot forward -- the mirror of the two
 * archers already in this family, who both lead with the far foot and merely hold their bows. Same
 * oilskin and knitted cap as the rest of the gang, and the quiver rides on the hip rather than over
 * the shoulder, because a man crouching in a boat cannot reach behind his own head.
 */
function smugglerBow(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.02, hipTilt: 0.024, turn: 0.03, near: [0.076, 0.17, 0.236], far: [-0.078, -0.118, -0.162], toe: [1, -0.35], lift: [0, 0.05] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 17) * h * 0.005;
  // The bow arm locked out forward and slightly down; the string hand back level with the jaw.
  const grip = { x: x + h * 0.296, y: sy + h * 0.056 + sway };
  const anchor = { x: x + h * 0.064, y: sy + h * 0.006 + sway };
  const near: Arm = [R.sNear, { x: x + h * 0.236, y: sy + h * 0.074 }, grip];
  const far: Arm = [R.sFar, { x: x - h * 0.086, y: sy + h * 0.116 }, anchor];
  const hemY = y - h * 0.41;
  groundShadow(ctx, x, y + 1, h * 0.72);
  legs(ctx, R, shade('#2e3640', p.tone), 94, [1, -0.35]);
  blob(ctx, B, shade('#2a2420', p.tone), [
    { k: 'cap', x0: x + h * 0.228, y0: y - h * 0.17, x1: x + h * 0.238, y1: y - h * 0.05, r0: h * 0.042, r1: h * 0.04 },
    { k: 'cap', x0: x - h * 0.156, y0: y - h * 0.16, x1: x - h * 0.164, y1: y - h * 0.05, r0: h * 0.039, r1: h * 0.037 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 95, sub: 3 }, ...armParts(R, near, 96)],
    { h, formK: 0.5, tex: 'folds', seed: 95, amount: 0.7, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The draw arm goes OVER the tunic: at full draw its forearm crosses in front of the chest, and
  // painted behind the body like every other far arm it left the string hand on his chest with no
  // arm at all. The oilskin still covers the shoulder and upper arm, so the forearm comes out from
  // under its edge.
  blob(ctx, B, shade(p.dark, 0.8), armParts(R, far, 93, 0.92), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  // The gang's oilskin, shorter on him, and a quiver on the far hip.
  blob(ctx, B, shade('#3a4a42', p.tone), [
    { k: 'curve', pts: [x - h * 0.172, sy - h * 0.012, x - h * 0.206, sy + h * 0.1, x - h * 0.178, sy + h * 0.2, x - h * 0.06, sy + h * 0.2, x - h * 0.03, sy + h * 0.02, x - h * 0.09, sy - h * 0.05], wobble: 0.04, seed: 97, sub: 3 },
    { k: 'curve', pts: [hx - hr * 1.2, hy + hr * 1.5, hx - hr * 0.4, hy + hr * 1.16, hx + hr * 0.7, hy + hr * 1.2, hx + hr * 1.1, hy + hr * 1.62, hx + hr * 0.2, hy + hr * 1.88, hx - hr * 0.8, hy + hr * 1.82], wobble: 0.05, seed: 98, sub: 2 },
  ], { h, formK: 0.55, spread: 0.7, tex: 'folds', seed: 97, amount: 0.5 });
  blob(ctx, B, R.leather, [{ k: 'cap', x0: x - h * 0.2, y0: sy + h * 0.2, x1: x - h * 0.168, y1: sy + h * 0.33, r0: h * 0.026, r1: h * 0.023 }], { h, formK: 0.5, spread: 0.7 });
  for (let i = 0; i < 3; i++) {
    const qx = x - h * (0.208 - i * 0.016), qy = sy + h * (0.182 - i * 0.008);
    stroke(ctx, [qx, qy, qx - h * 0.014, qy - h * 0.062], R.wood, 1);
    ctx.fillStyle = B.col(shade(i === 1 ? '#c8c0a0' : '#8a3a30', p.tone));
    ctx.beginPath(); ctx.moveTo(qx - h * 0.014, qy - h * 0.062); ctx.lineTo(qx - h * 0.034, qy - h * 0.07); ctx.lineTo(qx - h * 0.006, qy - h * 0.088); ctx.lineTo(qx + h * 0.002, qy - h * 0.058); ctx.closePath(); ctx.fill();
  }
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.056, h * 0.04, 99)], { h, form: false });
  band(ctx, B, x - h * 0.016, hemY - h * 0.06, h * 0.036, h * 0.04, R.brass);
  // The gang's cap, and a fringe under it.
  const wool2 = shade('#7a5a3a', p.tone);
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.96, hy - hr * 0.5, hx - hr * 0.4, hy - hr * 0.34, hx + hr * 0.58, hy - hr * 0.36, hx + hr * 0.98, hy - hr * 0.52, hx + hr * 0.82, hy - hr * 0.08, hx, hy - hr * 0.2, hx - hr * 0.86, hy - hr * 0.06], wobble: 0.07, spiky: 0.1, seed: 100, sub: 2 }], { h, form: false });
  blob(ctx, B, wool2, [{ k: 'curve', pts: [hx - hr * 1.08, hy - hr * 0.52, hx - hr * 1.02, hy - hr * 1.0, hx - hr * 0.28, hy - hr * 1.32, hx + hr * 0.52, hy - hr * 1.28, hx + hr * 1.04, hy - hr * 0.94, hx + hr * 1.1, hy - hr * 0.5], wobble: 0.05, seed: 101, sub: 3 }], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 101, amount: 0.45 });
  blob(ctx, B, shade(wool2, 0.78), [{ k: 'cap', x0: hx - hr * 1.04, y0: hy - hr * 0.56, x1: hx + hr * 1.06, y1: hy - hr * 0.52, r0: hr * 0.18, r1: hr * 0.17 }], { h, formK: 0.6, spread: 0.6 });
  face(ctx, R, true);
  // The bow, then the two hands: the string hand closed at the jaw, the bow hand out on the riser.
  const ba = bowDrawn(ctx, R, grip, anchor);
  hand(ctx, R, anchor, Math.atan2(grip.y - anchor.y, grip.x - anchor.x), 102, { flip: 1, k: 0.9 });
  hand(ctx, R, grip, ba, 103, { flip: -1 });
  void p.light;
}
/**
 * A boarding axe: a short haft with a bearded head on one side and a spike on the other. Its bit
 * hangs BELOW the haft line rather than sitting on it, which is what separates an axe from a
 * hammer at two pixels. Returns the haft's axis for the fist that holds it.
 */
function axe(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, aim: number): number {
  const { h } = R;
  const ux = Math.cos(aim), uy = Math.sin(aim), nx = -uy, ny = ux;
  const butt = { x: at.x - ux * h * 0.072, y: at.y - uy * h * 0.072 };
  const head = { x: at.x + ux * h * 0.2, y: at.y + uy * h * 0.2 };
  blob(ctx, B, R.wood, [{ k: 'cap', x0: butt.x, y0: butt.y, x1: head.x, y1: head.y, r0: h * 0.016, r1: h * 0.013 }],
    { h, formK: 0.5, spread: 0.6, tex: 'cracks', seed: 111, amount: 0.4 });
  const P = (u: number, v: number): number[] => [head.x + ux * h * u + nx * h * v, head.y + uy * h * u + ny * h * v];
  glossPoly(ctx, B, [
    ...P(-0.034, -0.026), ...P(0.03, -0.038), ...P(0.078, -0.062), ...P(0.05, -0.006),
    ...P(0.042, 0.03), ...P(0.062, 0.098), ...P(0.01, 0.15), ...P(-0.062, 0.128), ...P(-0.05, 0.03),
  ], R.steel, { gloss: 0.55, h, spread: 0.7 });
  // The langets that strap the head to the haft.
  stroke(ctx, [...P(-0.052, 0.01), ...P(-0.092, 0.006)], R.brass, Math.max(1, h * 0.009));
  return aim;
}

/**
 * The smuggler captain: the only man in this family under a wide brim, which is the whole of how he
 * reads as the one in charge at the size a fight draws him. Planted square with the shoulders level
 * and high, a long coat with a standing collar over the gang's oilskin green, and the boarding axe
 * he drops held across the body in a full-length arm.
 */
function smugglerCaptain(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.006, hipTilt: 0.018, turn: 0.008, near: [0.1, 0.18, 0.228], far: [-0.098, -0.168, -0.212], toe: [0.9, -0.9], lift: [0, 0] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 25) * h * 0.006;
  const near: Arm = [R.sNear, { x: x + h * 0.244, y: sy + h * 0.176 }, { x: x + h * 0.15, y: sy + h * 0.29 }];
  const far: Arm = [R.sFar, { x: x - h * 0.256, y: sy + h * 0.18 }, { x: x - h * 0.262, y: sy + h * 0.34 }];
  const hemY = y - h * 0.42, skirtY = y - h * 0.235;         // tunic hem, then the coat skirt below it
  groundShadow(ctx, x, y + 1, h * 0.8);
  blob(ctx, B, shade(p.dark, 0.8), armParts(R, far, 112, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  // No hand at the end of the far arm: a leather cuff and an iron hook, curled in toward the body.
  const cw = far[2];
  blob(ctx, B, R.leather, [{ k: 'cap', x0: cw.x, y0: cw.y - h * 0.012, x1: cw.x + h * 0.002, y1: cw.y + h * 0.034, r0: h * 0.027, r1: h * 0.022 }], { h, formK: 0.45, spread: 0.7 });
  band(ctx, B, cw.x - h * 0.024, cw.y + h * 0.026, h * 0.048, h * 0.012, R.brass);
  blob(ctx, B, R.steel, [{ k: 'tube', pts: [cw.x + h * 0.002, cw.y + h * 0.036, cw.x + h * 0.002, cw.y + h * 0.086, cw.x + h * 0.012, cw.y + h * 0.112, cw.x + h * 0.036, cw.y + h * 0.114, cw.x + h * 0.046, cw.y + h * 0.092], r0: h * 0.011, r1: h * 0.005, gloss: 0.6 }], { h, formK: 0.5, spread: 0.7 });
  legs(ctx, R, shade('#242a34', p.tone), 113, [0.9, -0.9]);
  blob(ctx, B, shade('#22201c', p.tone), [
    { k: 'cap', x0: x + h * 0.216, y0: y - h * 0.215, x1: x + h * 0.23, y1: y - h * 0.055, r0: h * 0.05, r1: h * 0.048 },
    { k: 'cap', x0: x - h * 0.202, y0: y - h * 0.205, x1: x - h * 0.212, y1: y - h * 0.055, r0: h * 0.047, r1: h * 0.045 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The coat: body, near sleeve and a skirt that flares below the belt.
  blob(ctx, B, p.base, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 114, sub: 3 },
    { k: 'curve', pts: [
      x - h * 0.126, hemY - h * 0.1, x - h * 0.156, hemY - h * 0.02, x - h * 0.166, skirtY,
      x - h * 0.05, skirtY + h * 0.014, x + h * 0.08, skirtY - h * 0.008, x + h * 0.172, skirtY,
      x + h * 0.162, hemY - h * 0.02, x + h * 0.134, hemY - h * 0.1,
    ], wobble: 0.04, seed: 115, sub: 3 },
    ...armParts(R, near, 116),
  ], { h, formK: 0.5, tex: 'folds', seed: 114, amount: 0.75, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The standing collar, in the gang's oilskin green so he belongs to them.
  blob(ctx, B, shade('#3a4a42', p.tone), [{ k: 'curve', pts: [hx - hr * 1.72, hy + hr * 2.24, hx - hr * 1.5, hy + hr * 1.14, hx - hr * 0.56, hy + hr * 1.32, hx + hr * 0.7, hy + hr * 1.28, hx + hr * 1.56, hy + hr * 1.08, hx + hr * 1.78, hy + hr * 2.24, hx + hr * 0.9, hy + hr * 2.0, hx - hr * 0.8, hy + hr * 2.04], wobble: 0.04, seed: 117, sub: 3 }],
    { h, formK: 0.55, spread: 0.7, tex: 'folds', seed: 117, amount: 0.5 });
  // A wide belt and a baldric across the chest: the only man here wearing both.
  blob(ctx, B, R.strap, [beltPart(R, sy + h * 0.2, h * 0.056, 118)], { h, formK: 0.4 });
  band(ctx, B, x - h * 0.026, sy + h * 0.196, h * 0.05, h * 0.05, R.brass);
  stroke(ctx, [x - h * 0.15, sy - h * 0.01, x + h * 0.11, sy + h * 0.23], R.strap, Math.max(1, h * 0.022));
  // The hat: a deep crown and a brim wider than his own shoulders are tall.
  blob(ctx, B, shade('#2c2620', p.tone), [
    { k: 'curve', pts: [hx - hr * 1.0, hy - hr * 0.72, hx - hr * 0.9, hy - hr * 1.7, hx - hr * 0.2, hy - hr * 2.12, hx + hr * 0.56, hy - hr * 2.04, hx + hr * 1.04, hy - hr * 1.5, hx + hr * 1.08, hy - hr * 0.7], wobble: 0.04, seed: 119, sub: 3 },
    { k: 'curve', pts: ring(hx + hr * 0.06, hy - hr * 0.72, hr * 1.92, hr * 0.42), wobble: 0.035, seed: 120, sub: 3 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 119, amount: 0.4 });
  stroke(ctx, [hx - hr * 0.94, hy - hr * 1.12, hx + hr * 1.0, hy - hr * 1.1], R.brass, Math.max(1, hr * 0.18));
  // A heavy beard under the brim's shadow.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.9, hy + hr * 0.24, hx - hr * 0.62, hy + hr * 0.84, hx, hy + hr * 1.1, hx + hr * 0.64, hy + hr * 0.82, hx + hr * 0.92, hy + hr * 0.22, hx + hr * 0.78, hy + hr * 1.12, hx, hy + hr * 1.36, hx - hr * 0.76, hy + hr * 1.1], wobble: 0.08, spiky: 0.12, seed: 121, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, false, true);
  // The axe, carried across the body with the head out and low.
  const wrist = near[2];
  const aa = axe(ctx, R, wrist, -0.72 + sway * 0.6);
  hand(ctx, R, wrist, aa, 122, { flip: -1 });
  void p.light;
}

// ------------------------------------------------------------------ the wreckers ----
/**
 * The wrecker: a man of the Downs' coast in a hooded oilskin coat to the knee, yellow gone dirty
 * with tar and salt, standing by the boathook he has planted upright in the shingle. The smuggler
 * works his gaff across the body in both hands; the wrecker leans on his like a staff, one fist high
 * on the shaft and the hook and spike standing over his head, which is what tells them apart.
 */
function wrecker(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.02, hipTilt: 0.022, turn: 0.02, near: [0.074, 0.14, 0.16], far: [-0.072, -0.1, -0.12], toe: [0.8, -0.6], lift: [0, 0.03] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 23) * h * 0.006;
  // The boathook planted beside the near boot, and the near fist high on it: the wrist sits on the
  // shaft's own line, so the hand grips it and not the air beside it.
  const lo = { x: x + h * 0.31, y: y - h * 0.004 }, hi = { x: x + h * 0.286 + sway, y: y - h * 1.07 };
  const on = (t: number): Pt => ({ x: lo.x + (hi.x - lo.x) * t, y: lo.y + (hi.y - lo.y) * t });
  const grip = on((y - (sy + h * 0.03)) / (y - hi.y));
  const near: Arm = [R.sNear, { x: x + h * 0.258, y: sy + h * 0.17 }, grip];
  const far: Arm = [R.sFar, { x: x - h * 0.2, y: sy + h * 0.19 }, { x: x - h * 0.198, y: sy + h * 0.35 }];
  const hemY = y - h * 0.42, skirtY = y - h * 0.26;
  const coat = p.base;
  groundShadow(ctx, x, y + 1, h * 0.8);
  gaff(ctx, R, lo, hi);
  blob(ctx, B, shade(p.dark, 0.86), armParts(R, far, 131, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  hand(ctx, R, far[2], null, 132, { far: true, k: 0.92 });
  legs(ctx, R, shade('#2e2a26', p.tone), 133, [0.8, -0.6]);
  blob(ctx, B, shade('#221e1a', p.tone), [
    { k: 'cap', x0: x + h * 0.154, y0: y - h * 0.2, x1: x + h * 0.16, y1: y - h * 0.055, r0: h * 0.046, r1: h * 0.043 },
    { k: 'cap', x0: x - h * 0.116, y0: y - h * 0.19, x1: x - h * 0.12, y1: y - h * 0.06, r0: h * 0.043, r1: h * 0.04 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The coat: body, near sleeve and a skirt to the knee, wet enough to shine.
  blob(ctx, B, coat, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 134, sub: 3 },
    { k: 'curve', pts: [
      x - h * 0.128, hemY - h * 0.1, x - h * 0.16, hemY - h * 0.02, x - h * 0.184, skirtY,
      x - h * 0.06, skirtY + h * 0.018, x + h * 0.07, skirtY + h * 0.006, x + h * 0.19, skirtY - h * 0.012,
      x + h * 0.166, hemY - h * 0.02, x + h * 0.136, hemY - h * 0.1,
    ], wobble: 0.05, seed: 135, sub: 3 },
    ...armParts(R, near, 136),
  ], { h, formK: 0.55, tex: 'folds', seed: 134, amount: 0.8, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The front edge and its toggles, and a rope belt knotted at the hip.
  softLine(ctx, B, [x + h * 0.012, sy + h * 0.05, x + h * 0.02, hemY, x + h * 0.03, skirtY + h * 0.01], shade(coat, 0.6), Math.max(1, h * 0.012), 0.7);
  for (let i = 0; i < 3; i++) band(ctx, B, x + h * 0.022, sy + h * (0.07 + i * 0.07), h * 0.026, h * 0.014, R.wood);
  const rope = shade('#8a7a5a', p.tone);
  blob(ctx, B, rope, [
    beltPart(R, hemY - h * 0.05, h * 0.03, 137),
    { k: 'cap', x0: x - h * 0.07, y0: hemY - h * 0.036, x1: x - h * 0.086, y1: hemY + h * 0.05, r0: h * 0.013, r1: h * 0.011 },
  ], { h, formK: 0.4, tex: 'cracks', seed: 137, amount: 0.3 });
  // A stubbled jaw, the face, then the hood round it, peaked at the back.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.8, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.58, hx + hr * 0.3, hy + hr * 0.58, hx + hr * 0.84, hy + hr * 0.3, hx + hr * 0.6, hy + hr * 0.92, hx, hy + hr * 1.06, hx - hr * 0.6, hy + hr * 0.92], wobble: 0.06, spiky: 0.06, seed: 138, sub: 2 }], { h, form: false, outline: false });
  face(ctx, R, false);
  blob(ctx, B, coat, [{ k: 'curve', pts: [
    hx - hr * 1.3, hy + hr * 1.3, hx - hr * 1.42, hy - hr * 0.2, hx - hr * 1.3, hy - hr * 1.12, hx - hr * 0.5, hy - hr * 1.62,
    hx + hr * 0.4, hy - hr * 1.5, hx + hr * 1.12, hy - hr * 1.08, hx + hr * 1.38, hy - hr * 0.2, hx + hr * 1.3, hy + hr * 1.3,
    hx + hr * 0.84, hy + hr * 0.8, hx + hr * 0.9, hy - hr * 0.16, hx + hr * 0.56, hy - hr * 0.56, hx, hy - hr * 0.64,
    hx - hr * 0.56, hy - hr * 0.56, hx - hr * 0.88, hy - hr * 0.16, hx - hr * 0.82, hy + hr * 0.8,
  ], wobble: 0.04, seed: 139, sub: 3 }], { h, formK: 0.55, spread: 0.7, gloss: 0.3, tex: 'folds', seed: 139, amount: 0.5 });
  // The shadow the hood throws on the face inside it.
  softLine(ctx, B, [hx - hr * 0.74, hy + hr * 0.7, hx - hr * 0.78, hy - hr * 0.14, hx - hr * 0.46, hy - hr * 0.46, hx + hr * 0.02, hy - hr * 0.52, hx + hr * 0.48, hy - hr * 0.46, hx + hr * 0.8, hy - hr * 0.14, hx + hr * 0.76, hy + hr * 0.7], shade('#1a1410', p.tone), Math.max(1, hr * 0.26), 0.6);
  hand(ctx, R, grip, Math.atan2(hi.y - lo.y, hi.x - lo.x), 140, { flip: 1 });
  void p.light;
}

/** The lamp's colours: never toned, it is the light the wreckers show. */
const LAMP = '#ff9a30', FLAME = '#ffd878', WHITE = '#fff4d0';

/**
 * A lantern hanging on links from the crook at `top`: an iron cap and base with a glass between
 * them, lit from inside. The links are dots, as the censer's chain is, so the lamp swings free of
 * the pole it hangs from.
 */
function lantern(ctx: CanvasRenderingContext2D, R: Rig, top: Pt, lx: number, ly: number, pulse: number): void {
  const h = R.h * 1.5;
  const iron = shade('#3a3632', R.tone);
  if (!B.override) {
    const n = 4;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      ctx.fillStyle = B.col(shade(iron, 0.9 + (i % 2) * 0.3));
      ctx.beginPath(); ctx.arc(top.x + (lx - top.x) * t, top.y + (ly - h * 0.07 - top.y) * t, Math.max(0.8, h * 0.006), 0, Math.PI * 2); ctx.fill();
    }
  }
  glow(ctx, B, lx, ly, h * 0.12 * (1 + pulse * 0.12), LAMP, 0.5 + pulse * 0.16, WHITE);
  // The glass, then the iron over it: a peaked cap with its ring, the base, and two bars.
  blob(ctx, B, FLAME, [{ k: 'curve', pts: [lx - h * 0.028, ly - h * 0.042, lx + h * 0.028, ly - h * 0.042, lx + h * 0.032, ly + h * 0.036, lx - h * 0.032, ly + h * 0.036], wobble: 0.02, seed: 151, sub: 2 }],
    { h, form: false, outline: false });
  blob(ctx, B, iron, [
    { k: 'poly', pts: [lx - h * 0.036, ly - h * 0.04, lx + h * 0.036, ly - h * 0.04, lx + h * 0.012, ly - h * 0.062, lx - h * 0.012, ly - h * 0.062] },
    { k: 'ball', x: lx, y: ly - h * 0.064, r: h * 0.009 },
    { k: 'cap', x0: lx - h * 0.034, y0: ly + h * 0.04, x1: lx + h * 0.034, y1: ly + h * 0.04, r0: h * 0.008 },
  ], { h, formK: 0.5, spread: 0.7, gloss: 0.3 });
  stroke(ctx, [lx - h * 0.012, ly - h * 0.04, lx - h * 0.012, ly + h * 0.036], iron, Math.max(1, h * 0.007));
  stroke(ctx, [lx + h * 0.012, ly - h * 0.04, lx + h * 0.012, ly + h * 0.036], iron, Math.max(1, h * 0.007));
  glow(ctx, B, lx, ly + h * 0.004, h * 0.03, FLAME, 0.8, WHITE);
}

/**
 * The lampman: the one the wreckers follow, a smaller man in a long dark coat and a sou'wester in
 * their yellow, holding a pole up in the near fist with a lantern swinging from its crook over his
 * head. His other hand hangs with a sling in it. He is drawn a tenth under the def's height, so the
 * pole and the light stand clear above him inside the frame.
 */
function lampman(ctx: CanvasRenderingContext2D, x: number, y: number, h0: number, p: Paint): void {
  const h = h0 * 0.9;
  const R = makeRig(x, y, h, p, { tilt: -0.024, hipTilt: -0.02, turn: 0.03, near: [0.078, 0.16, 0.2], far: [-0.07, -0.09, -0.1], toe: [1, -0.4], lift: [0, 0.04] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 29) * h0 * 0.008, pulse = 0.5 + 0.5 * Math.sin(p.frame / 6);
  // The pole: from below the hip, up through the near fist raised to the shoulder, to a crook that
  // holds the lamp out in front of him at the height of the rest of the pole.
  const lo = { x: x + h * 0.2, y: y - h * 0.36 }, hi = { x: x + h * 0.33 + sway, y: y - h0 * 1.2 };
  const crook = { x: hi.x + h0 * 0.11, y: hi.y + h0 * 0.02 };
  const on = (t: number): Pt => ({ x: lo.x + (hi.x - lo.x) * t, y: lo.y + (hi.y - lo.y) * t });
  const grip = on((lo.y - (sy - h * 0.06)) / (lo.y - hi.y));
  const near: Arm = [R.sNear, { x: x + h * 0.27, y: sy + h * 0.1 }, grip];
  const far: Arm = [R.sFar, { x: x - h * 0.206, y: sy + h * 0.18 }, { x: x - h * 0.22, y: sy + h * 0.34 }];
  const hemY = y - h * 0.42, skirtY = y - h * 0.3;
  groundShadow(ctx, x, y + 1, h * 0.76);
  // The pole and its crook, one length of wood with an iron hook at the end.
  blob(ctx, B, R.wood, [
    { k: 'cap', x0: lo.x, y0: lo.y, x1: hi.x, y1: hi.y, r0: h0 * 0.014, r1: h0 * 0.012 },
    { k: 'cap', x0: hi.x, y0: hi.y, x1: crook.x - h0 * 0.01, y1: crook.y - h0 * 0.004, r0: h0 * 0.012, r1: h0 * 0.01 },
  ], { h, formK: 0.5, spread: 0.6, tex: 'cracks', seed: 152, amount: 0.4 });
  stroke(ctx, [crook.x - h0 * 0.014, crook.y - h0 * 0.004, crook.x, crook.y + h0 * 0.002, crook.x + h0 * 0.004, crook.y + h0 * 0.016], R.dull, Math.max(1, h0 * 0.01));
  // The sling hand behind: the cords hang from the fist to the pouch.
  blob(ctx, B, shade(p.dark, 0.86), armParts(R, far, 153, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  const fw = far[2], pouch = { x: fw.x + h * 0.012, y: fw.y + h * 0.12 };
  stroke(ctx, [fw.x - h * 0.008, fw.y, pouch.x - h * 0.012, pouch.y], R.leather, Math.max(1, h * 0.012));
  stroke(ctx, [fw.x + h * 0.01, fw.y, pouch.x + h * 0.012, pouch.y], R.leather, Math.max(1, h * 0.012));
  blob(ctx, B, R.leather, [{ k: 'curve', pts: ring(pouch.x, pouch.y + h * 0.008, h * 0.026, h * 0.02), wobble: 0.08, seed: 154, sub: 2 }], { h, formK: 0.5, spread: 0.7 });
  hand(ctx, R, fw, Math.PI / 2, 155, { far: true, flip: 1, k: 0.9 });
  legs(ctx, R, shade('#34302a', p.tone), 156, [1, -0.4]);
  blob(ctx, B, shade('#221e1a', p.tone), [
    { k: 'cap', x0: x + h * 0.196, y0: y - h * 0.19, x1: x + h * 0.2, y1: y - h * 0.055, r0: h * 0.044, r1: h * 0.042 },
    { k: 'cap', x0: x - h * 0.098, y0: y - h * 0.18, x1: x - h * 0.1, y1: y - h * 0.07, r0: h * 0.041, r1: h * 0.039 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The long coat, to below the knee, and its near sleeve raised with the pole.
  blob(ctx, B, p.base, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 157, sub: 3 },
    { k: 'curve', pts: [
      x - h * 0.124, hemY - h * 0.1, x - h * 0.15, hemY - h * 0.02, x - h * 0.17, skirtY,
      x - h * 0.05, skirtY + h * 0.016, x + h * 0.08, skirtY + h * 0.004, x + h * 0.176, skirtY - h * 0.014,
      x + h * 0.16, hemY - h * 0.02, x + h * 0.132, hemY - h * 0.1,
    ], wobble: 0.05, seed: 158, sub: 3 },
    ...armParts(R, near, 159),
  ], { h, formK: 0.5, tex: 'folds', seed: 157, amount: 0.75, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.05, h * 0.042, 160)], { h, form: false });
  band(ctx, B, x - h * 0.02, hemY - h * 0.054, h * 0.04, h * 0.04, R.dull);
  // A muffler wound at the throat, a thin beard, and the sou'wester: short at the brow, long behind.
  blob(ctx, B, shade('#6a3a30', p.tone), [{ k: 'curve', pts: [hx - hr * 1.2, hy + hr * 1.3, hx - hr * 0.4, hy + hr * 1.0, hx + hr * 0.6, hy + hr * 1.06, hx + hr * 1.2, hy + hr * 1.4, hx + hr * 0.4, hy + hr * 1.8, hx - hr * 0.8, hy + hr * 1.72], wobble: 0.06, seed: 161, sub: 2 }],
    { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 161, amount: 0.5 });
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.84, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.6, hx + hr * 0.3, hy + hr * 0.6, hx + hr * 0.86, hy + hr * 0.3, hx + hr * 0.5, hy + hr * 1.0, hx, hy + hr * 1.14, hx - hr * 0.5, hy + hr * 1.0], wobble: 0.08, spiky: 0.12, seed: 162, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, false);
  const oil = shade('#8c7a36', p.tone);
  blob(ctx, B, oil, [
    { k: 'curve', pts: [hx - hr * 0.98, hy - hr * 0.5, hx - hr * 0.86, hy - hr * 1.2, hx - hr * 0.2, hy - hr * 1.5, hx + hr * 0.5, hy - hr * 1.42, hx + hr * 0.98, hy - hr * 1.06, hx + hr * 1.04, hy - hr * 0.5], wobble: 0.04, seed: 163, sub: 3 },
    { k: 'curve', pts: [hx - hr * 1.66, hy + hr * 0.16, hx - hr * 1.3, hy - hr * 0.6, hx, hy - hr * 0.72, hx + hr * 1.3, hy - hr * 0.62, hx + hr * 1.5, hy - hr * 0.3, hx + hr * 0.8, hy - hr * 0.38, hx - hr * 0.6, hy - hr * 0.32, hx - hr * 1.2, hy + hr * 0.02], wobble: 0.04, seed: 164, sub: 3 },
  ], { h, formK: 0.55, spread: 0.7, gloss: 0.3, tex: 'folds', seed: 163, amount: 0.4 });
  hand(ctx, R, grip, Math.atan2(hi.y - lo.y, hi.x - lo.x), 165, { flip: 1 });
  // The lamp swings a little on its links, against the pole's own sway.
  lantern(ctx, R, { x: crook.x + h0 * 0.004, y: crook.y + h0 * 0.034 }, crook.x - sway * 0.6, crook.y + h0 * 0.17, pulse);
  void p.light;
}

// ------------------------------------------------------------------ the bargemen ----
/**
 * The bargeman: a Compact barge hand off the Long Water, planted wide as on a deck. A canvas smock
 * in the tint to mid-thigh, gathered across the chest, the sleeves rolled to the elbow; a cloth cap
 * pulled low and a kerchief at the throat. His barge pole is levelled across him in both fists, long
 * enough to reach past him either side: the forked iron foot out in front, the button end behind. A
 * long knife rides in its sheath at the front of his belt. The wrecker and the lampman stand by
 * their poles; this one holds his like a weapon.
 */
function bargeman(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.012, hipTilt: 0.022, turn: 0.022, near: [0.085, 0.2, 0.25], far: [-0.08, -0.15, -0.19], toe: [1, -0.8], lift: [0, 0.02] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 23) * h * 0.007;
  // The pole, nearly level at the ribs, rising a little to the front: back end, then the foot.
  const lo = { x: x - h * 0.6, y: sy + h * 0.25 + sway * 0.5 }, hi = { x: x + h * 0.78, y: sy + h * 0.13 - sway };
  const len = Math.hypot(hi.x - lo.x, hi.y - lo.y), ux = (hi.x - lo.x) / len, uy = (hi.y - lo.y) / len;
  const on = (t: number): Pt => ({ x: lo.x + (hi.x - lo.x) * t, y: lo.y + (hi.y - lo.y) * t });
  const gFar = on(0.3), gNear = on(0.62);
  const near: Arm = [R.sNear, { x: x + h * 0.21, y: sy + h * 0.22 }, gNear];
  const far: Arm = [R.sFar, { x: x - h * 0.2, y: sy + h * 0.24 }, gFar];
  const hemY = y - h * 0.4, smockY = y - h * 0.33;
  const smock = p.base, cap = shade('#3a3a40', p.tone), kerchief = shade('#9a3a2c', p.tone);
  groundShadow(ctx, x, y + 1, h * 0.82);
  // The far arm: the smock's sleeve to the elbow, then bare.
  const fMid = { x: (far[1].x + far[2].x) / 2, y: (far[1].y + far[2].y) / 2 };
  blob(ctx, B, R.skinFar, armParts(R, far, 401, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  blob(ctx, B, shade(p.base, 0.78), armParts(R, [far[0], far[1], { x: far[1].x + (fMid.x - far[1].x) * 0.4, y: far[1].y + (fMid.y - far[1].y) * 0.4 }], 402, 0.98), { h, formK: 0.45 });
  legs(ctx, R, shade('#34383e', p.tone), 403, [1, -0.8]);
  headNeck(ctx, R);
  // The smock: body, its skirt past the hips, and the near sleeve rolled to the elbow, one mass.
  blob(ctx, B, smock, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 404, sub: 3 },
    { k: 'curve', pts: [
      x - h * 0.13, hemY - h * 0.1, x - h * 0.165, hemY - h * 0.02, x - h * 0.18, smockY,
      x - h * 0.06, smockY + h * 0.016, x + h * 0.06, smockY - h * 0.01, x + h * 0.19, smockY + h * 0.006,
      x + h * 0.17, hemY - h * 0.02, x + h * 0.14, hemY - h * 0.1,
    ], wobble: 0.05, seed: 405, sub: 3 },
    ...armParts(R, [near[0], near[1], { x: near[1].x + (near[2].x - near[1].x) * 0.2, y: near[1].y + (near[2].y - near[1].y) * 0.2 }], 406),
  ], { h, formK: 0.5, tex: 'folds', seed: 404, amount: 0.8, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The smocking: rows of gathers across the chest, and the rolled cuff round the near arm.
  if (!B.override && h >= 50) for (let i = 0; i < 3; i++) {
    const ly = sy + h * (0.07 + i * 0.03), pts: number[] = [];
    for (let k = 0; k <= 6; k++) pts.push(x - h * 0.07 + k * h * 0.024, ly + (k % 2 ? h * 0.008 : 0));
    softLine(ctx, B, pts, shade(smock, 0.68), Math.max(1, h * 0.006), 0.6);
  }
  const rc = { x: near[1].x + (near[2].x - near[1].x) * 0.2, y: near[1].y + (near[2].y - near[1].y) * 0.2 };
  blob(ctx, B, R.skin, armParts(R, [rc, { x: (rc.x + near[2].x) / 2, y: (rc.y + near[2].y) / 2 + h * 0.004 }, near[2]], 407, 0.9), { h, formK: 0.5 });
  blob(ctx, B, shade(smock, 1.08), [tube([near[1].x, near[1].y, rc.x, rc.y], h * 0.04, h * 0.042, 0, 408)], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 408, amount: 0.4 });
  // The belt, and the long knife in its sheath at the front, its hilt canted up to the near hand.
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.05, h * 0.04, 409)], { h, form: false });
  band(ctx, B, x - h * 0.022, hemY - h * 0.054, h * 0.04, h * 0.04, R.dull);
  const sh0 = { x: x + h * 0.07, y: hemY - h * 0.05 }, sh1 = { x: x + h * 0.03, y: hemY + h * 0.11 };
  blob(ctx, B, R.leather, [tube([sh0.x, sh0.y, sh1.x, sh1.y], h * 0.022, h * 0.012, 0, 410)], { h, formK: 0.5, spread: 0.6 });
  blob(ctx, B, R.wood, [tube([sh0.x, sh0.y, sh0.x + h * 0.022, sh0.y - h * 0.075], Math.max(h * 0.012, 1), Math.max(h * 0.011, 1), 0, 411)], { h, formK: 0.5, spread: 0.6 });
  band(ctx, B, sh0.x - h * 0.016, sh0.y - h * 0.012, h * 0.034, h * 0.012, R.dull);
  // The kerchief knotted at the throat, its ends out to the near side.
  blob(ctx, B, kerchief, [
    { k: 'curve', pts: [hx - hr * 0.8, hy + hr * 1.5, hx + hr * 0.8, hy + hr * 1.45, hx + hr * 0.5, hy + hr * 2.15, hx - hr * 0.1, hy + hr * 2.3, hx - hr * 0.6, hy + hr * 2.05], wobble: 0.06, seed: 412, sub: 2 },
    { k: 'curve', pts: [hx + hr * 0.3, hy + hr * 1.9, hx + hr * 0.75, hy + hr * 2.1, hx + hr * 0.95 + sway, hy + hr * 2.7, hx + hr * 0.6, hy + hr * 2.6], wobble: 0.06, seed: 413, sub: 2 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 412, amount: 0.4 });
  // Stubble, a face that asks nothing, and the cap pulled down to the brows with a short peak.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.84, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.58, hx + hr * 0.3, hy + hr * 0.58, hx + hr * 0.86, hy + hr * 0.3, hx + hr * 0.6, hy + hr * 0.9, hx, hy + hr * 1.02, hx - hr * 0.6, hy + hr * 0.9], wobble: 0.06, spiky: 0.06, seed: 414, sub: 2 }], { h, form: false, outline: false });
  face(ctx, R, false);
  blob(ctx, B, cap, [
    { k: 'curve', pts: [hx - hr * 1.08, hy - hr * 0.22, hx - hr * 1.06, hy - hr * 0.86, hx - hr * 0.4, hy - hr * 1.2, hx + hr * 0.5, hy - hr * 1.16, hx + hr * 1.08, hy - hr * 0.8, hx + hr * 1.06, hy - hr * 0.3, hx + hr * 0.4, hy - hr * 0.44, hx - hr * 0.6, hy - hr * 0.42], wobble: 0.04, seed: 415, sub: 2 },
    { k: 'curve', pts: [hx + hr * 0.2, hy - hr * 0.5, hx + hr * 1.1, hy - hr * 0.58, hx + hr * 1.62, hy - hr * 0.36, hx + hr * 1.1, hy - hr * 0.22, hx + hr * 0.3, hy - hr * 0.3], wobble: 0.03, seed: 416, sub: 2 },
  ], { h, formK: 0.55, spread: 0.7, tex: 'stipple', seed: 415, amount: 0.3 });
  // The pole: ash, worn pale where the hands go, a button at the back and a forked iron foot.
  blob(ctx, B, R.wood, [tube([lo.x, lo.y, hi.x, hi.y], Math.max(h * 0.016, 1.2), Math.max(h * 0.014, 1.1), 0, 417)], { h, formK: 0.5, spread: 0.6, tex: 'cracks', seed: 417, amount: 0.3 });
  glossBall(ctx, B, lo.x, lo.y, Math.max(h * 0.022, 1.4), R.wood, { gloss: 0.3, spread: 0.6 });
  const nx = -uy, ny = ux;
  const Q = (u: number, v: number): number[] => [hi.x + ux * h * u + nx * h * v, hi.y + uy * h * u + ny * h * v];
  glossPoly(ctx, B, [
    ...Q(-0.07, 0.018), ...Q(0.0, 0.02), ...Q(0.07, 0.034), ...Q(0.075, 0.022), ...Q(0.02, 0.006),
    ...Q(0.02, -0.006), ...Q(0.075, -0.022), ...Q(0.07, -0.034), ...Q(0.0, -0.02), ...Q(-0.07, -0.018),
  ], R.dull, { gloss: 0.4, spread: 0.6 });
  const a = Math.atan2(uy, ux);
  hand(ctx, R, gFar, a, 418, { far: true, flip: 1, k: 0.95 });
  hand(ctx, R, gNear, a, 419, { flip: 1 });
  void p.light;
}

/**
 * The barge master: the one man aboard who answers to the Compact, and better fed and better
 * dressed for it. A long coat in the tint over a mustard waistcoat with brass buttons, wide cuffs,
 * a round hat with a rolled brim, side whiskers. The ledger is open in his far hand, held up and out
 * as if he were reading you off it; the cudgel rests on his near shoulder. Square on and heavy, so
 * the company can see at once who to reach.
 */
function bargeMaster(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.01, hipTilt: 0.016, turn: 0.012, near: [0.09, 0.16, 0.2], far: [-0.088, -0.15, -0.19], toe: [0.9, -0.9], lift: [0, 0] });
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 27) * h * 0.006;
  // The far hand up and out with the ledger; the near fist at the chest, the cudgel on the shoulder.
  const book = { x: x - h * 0.3, y: sy + h * 0.1 + sway * 0.4 };
  const near: Arm = [R.sNear, { x: x + h * 0.26, y: sy + h * 0.21 }, { x: x + h * 0.2, y: sy + h * 0.27 }];
  const far: Arm = [R.sFar, { x: x - h * 0.25, y: sy + h * 0.2 }, { x: book.x + h * 0.03, y: book.y + h * 0.05 }];
  const hemY = y - h * 0.42, skirtY = y - h * 0.24;
  const coat = p.base, vest = shade('#a07a30', p.tone), cuff = shade(mix(p.base, '#000000', 0.25), 1);
  groundShadow(ctx, x, y + 1, h * 0.84);
  // The far arm in its sleeve, up to the book.
  blob(ctx, B, shade(p.dark, 0.86), armParts(R, far, 431, 0.96), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  legs(ctx, R, shade('#2c2a2e', p.tone), 432, [0.9, -0.9]);
  blob(ctx, B, shade('#1e1a18', p.tone), [
    { k: 'cap', x0: x + h * 0.195, y0: y - h * 0.2, x1: x + h * 0.2, y1: y - h * 0.055, r0: h * 0.047, r1: h * 0.045 },
    { k: 'cap', x0: x - h * 0.185, y0: y - h * 0.19, x1: x - h * 0.19, y1: y - h * 0.055, r0: h * 0.045, r1: h * 0.043 },
  ], { h, formK: 0.5, spread: 0.7 });
  headNeck(ctx, R);
  // The waistcoat first, over a paunch that pushes past the trunk's own line.
  blob(ctx, B, vest, [
    { k: 'curve', pts: [x - h * 0.07, sy + h * 0.03, x + h * 0.075, sy + h * 0.03, x + h * 0.14, sy + h * 0.16, x + h * 0.165, sy + h * 0.25, x + h * 0.13, hemY + h * 0.02, x, hemY + h * 0.06, x - h * 0.12, hemY + h * 0.02, x - h * 0.13, sy + h * 0.22], wobble: 0.04, seed: 433, sub: 3 },
  ], { h, formK: 0.55, spread: 0.7, tex: 'folds', seed: 433, amount: 0.4 });
  // The coat: the body open over the waistcoat, the near sleeve, and the skirts to the knee.
  blob(ctx, B, coat, [
    vestPanel(R, -1, hemY + h * 0.04, h * 0.07, 434), vestPanel(R, 1, hemY + h * 0.04, h * 0.08, 435),
    { k: 'curve', pts: [
      x - h * 0.14, hemY - h * 0.08, x - h * 0.18, hemY + h * 0.0, x - h * 0.21, skirtY,
      x - h * 0.06, skirtY + h * 0.02, x + h * 0.01, skirtY - h * 0.02, x + h * 0.08, skirtY + h * 0.014, x + h * 0.22, skirtY - h * 0.01,
      x + h * 0.19, hemY + h * 0.0, x + h * 0.15, hemY - h * 0.08, x, hemY + h * 0.05,
    ], wobble: 0.04, seed: 436, sub: 3 },
    { k: 'curve', pts: [R.sFar.x + h * 0.01, sy + h * 0.0, R.sNear.x - h * 0.01, sy + h * 0.0, R.sNear.x, sy + h * 0.07, R.sFar.x, sy + h * 0.07], wobble: 0.03, seed: 438, sub: 2 },
    ...armParts(R, near, 439),
  ], { h, formK: 0.5, tex: 'folds', seed: 434, amount: 0.7, creases: [elbowCrease(R, near)] });
  for (let i = 0; i < 4; i++) glossBall(ctx, B, x + h * 0.012, sy + h * (0.09 + i * 0.06), Math.max(1, h * 0.011), R.brass, { gloss: 0.6 });
  // A standing collar in the coat's cloth and a white stock tied at the throat.
  blob(ctx, B, coat, [{ k: 'curve', pts: [hx - hr * 1.5, hy + hr * 2.3, hx - hr * 1.3, hy + hr * 1.2, hx - hr * 0.5, hy + hr * 1.36, hx + hr * 0.6, hy + hr * 1.34, hx + hr * 1.36, hy + hr * 1.16, hx + hr * 1.56, hy + hr * 2.3, hx + hr * 0.8, hy + hr * 2.05, hx - hr * 0.7, hy + hr * 2.08], wobble: 0.04, seed: 450, sub: 3 }],
    { h, formK: 0.55, spread: 0.7, tex: 'folds', seed: 450, amount: 0.4 });
  blob(ctx, B, shade('#e8e2d2', p.tone), [{ k: 'curve', pts: [hx - hr * 0.6, hy + hr * 1.3, hx + hr * 0.62, hy + hr * 1.28, hx + hr * 0.42, hy + hr * 2.0, hx + hr * 0.04, hy + hr * 2.5, hx - hr * 0.36, hy + hr * 2.0], wobble: 0.06, spiky: 0.06, seed: 451, sub: 2 }],
    { h, formK: 0.4, spread: 0.7, tex: 'folds', seed: 451, amount: 0.3 });
  // A watch chain across the paunch, in brass.
  softLine(ctx, B, [x - h * 0.08, sy + h * 0.2, x - h * 0.03, sy + h * 0.235, x + h * 0.04, sy + h * 0.2], R.brass, Math.max(1, h * 0.008), 0.85);
  // The wide cuff on the near sleeve, darker than the coat.
  const e = near[1], w = near[2], cu = (t: number): number[] => [e.x + (w.x - e.x) * t, e.y + (w.y - e.y) * t];
  blob(ctx, B, cuff, [tube([...cu(0.62), ...cu(0.9)], h * 0.04, h * 0.048, 0, 440)], { h, formK: 0.5, spread: 0.7 });
  // Side whiskers, a heavy jaw, and the round hat with its rolled brim.
  blob(ctx, B, R.hair, [
    { k: 'curve', pts: [hx - hr * 1.0, hy + hr * 0.0, hx - hr * 0.72, hy + hr * 0.1, hx - hr * 0.5, hy + hr * 0.62, hx - hr * 0.78, hy + hr * 0.8, hx - hr * 1.0, hy + hr * 0.5], wobble: 0.06, spiky: 0.12, seed: 441, sub: 2 },
    { k: 'curve', pts: [hx + hr * 1.02, hy + hr * 0.0, hx + hr * 0.74, hy + hr * 0.1, hx + hr * 0.52, hy + hr * 0.62, hx + hr * 0.8, hy + hr * 0.8, hx + hr * 1.02, hy + hr * 0.5], wobble: 0.06, spiky: 0.12, seed: 442, sub: 2 },
  ], { h, formK: 0.4 });
  face(ctx, R, false);
  // The moustache, clipped, over a mouth used to being obeyed.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.42, hy + hr * 0.5, hx + hr * 0.02, hy + hr * 0.36, hx + hr * 0.46, hy + hr * 0.5, hx + hr * 0.3, hy + hr * 0.6, hx, hy + hr * 0.52, hx - hr * 0.3, hy + hr * 0.6], wobble: 0.05, seed: 449, sub: 2 }], { h, form: false });
  blob(ctx, B, shade('#26221e', p.tone), [
    { k: 'curve', pts: [hx - hr * 0.92, hy - hr * 0.62, hx - hr * 0.95, hy - hr * 1.3, hx - hr * 0.5, hy - hr * 1.78, hx + hr * 0.5, hy - hr * 1.8, hx + hr * 0.98, hy - hr * 1.32, hx + hr * 0.96, hy - hr * 0.62], wobble: 0.03, seed: 443, sub: 3 },
    { k: 'curve', pts: ring(hx + hr * 0.02, hy - hr * 0.62, hr * 1.38, hr * 0.26), wobble: 0.03, seed: 444, sub: 3 },
  ], { h, formK: 0.55, spread: 0.7, tex: 'folds', seed: 443, amount: 0.3 });
  stroke(ctx, [hx - hr * 0.92, hy - hr * 0.86, hx + hr * 0.95, hy - hr * 0.86], shade('#4a3c2c', p.tone), Math.max(1, hr * 0.2));
  // The cudgel: a blackthorn club up from the fist and over the shoulder, its knob behind the head.
  const c0 = { x: w.x - h * 0.035, y: w.y + h * 0.07 }, c1 = { x: R.sNear.x + h * 0.11, y: sy - h * 0.13 };
  blob(ctx, B, shade('#3a2a20', p.tone), [
    tube([c0.x, c0.y, (c0.x + c1.x) / 2 + h * 0.008, (c0.y + c1.y) / 2, c1.x, c1.y], Math.max(h * 0.014, 1.1), Math.max(h * 0.02, 1.3), 0.04, 445),
    { k: 'curve', pts: ring(c1.x, c1.y, h * 0.032, h * 0.03), wobble: 0.12, seed: 446, sub: 2 },
  ], { h, formK: 0.5, spread: 0.6, tex: 'cracks', seed: 445, amount: 0.4 });
  hand(ctx, R, w, Math.atan2(c1.y - c0.y, c1.x - c0.x), 447, { flip: 1 });
  // The ledger, open: two pages over a leather board, the far hand under its spine.
  const bw = h * 0.085, bh = h * 0.1, bt = -0.18;
  const P = (u: number, v: number): number[] => [book.x + u * Math.cos(bt) - v * Math.sin(bt), book.y + u * Math.sin(bt) + v * Math.cos(bt)];
  glossPoly(ctx, B, [...P(-bw - h * 0.008, -bh / 2 - h * 0.006), ...P(bw + h * 0.008, -bh / 2 - h * 0.006), ...P(bw + h * 0.008, bh / 2 + h * 0.008), ...P(-bw - h * 0.008, bh / 2 + h * 0.008)], shade('#5a2a1c', p.tone), { gloss: 0.2, spread: 0.6 });
  const paper = shade('#e6dcc0', p.tone);
  glossPoly(ctx, B, [...P(-bw, -bh / 2), ...P(-h * 0.004, -bh / 2 + h * 0.008), ...P(-h * 0.004, bh / 2 + h * 0.004), ...P(-bw, bh / 2)], paper, { gloss: 0.1, spread: 0.5 });
  glossPoly(ctx, B, [...P(h * 0.004, -bh / 2 + h * 0.008), ...P(bw, -bh / 2), ...P(bw, bh / 2), ...P(h * 0.004, bh / 2 + h * 0.004)], paper, { gloss: 0.1, spread: 0.5 });
  if (!B.override && h >= 60) for (let i = 0; i < 4; i++) for (const s of [-1, 1]) {
    const v = -bh / 2 + h * 0.022 + i * h * 0.02;
    const a = P(s * h * 0.016, v), b = P(s * (bw - h * 0.012), v);
    stroke(ctx, [a[0], a[1], b[0], b[1]], shade('#7a6a58', p.tone), 1);
  }
  hand(ctx, R, far[2], null, 448, { far: true, k: 0.94 });
  void p.light;
}

// ------------------------------------------------------------------ the Wrack crews ----
/**
 * The Helmstow coat: a short reefer to the hip off a capital tailor, double-breasted and fitted at
 * the waist, madder red with gold piping at the collar and the cuffs and two rows of pewter
 * buttons. Every Wrack crewman wears one, and nobody else in this family wears red. Body and near
 * sleeve are one mass; the standing collar and the piping go over it.
 */
function helmstowCoat(ctx: CanvasRenderingContext2D, R: Rig, p: Paint, near: Arm, hemY: number, seed: number): void {
  const { x, sy, h, hx, hy, hr } = R;
  const coat = p.base, gold = shade('#c8a040', p.tone), pewter = shade('#a8acb0', p.tone);
  blob(ctx, B, coat, [
    { k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed, sub: 3 },
    ...armParts(R, near, seed + 1),
  ], { h, formK: 0.5, tex: 'folds', seed, amount: 0.6, creases: [...torsoCreases(R, hemY), elbowCrease(R, near)] });
  // The double breast: the overlap's edge down the near side, and the two rows of buttons.
  softLine(ctx, B, [x + h * 0.05, sy + h * 0.05, x + h * 0.046, hemY], shade(coat, 0.6), Math.max(1, h * 0.008), 0.7);
  for (let i = 0; i < 3; i++) for (const bx of [-0.03, 0.09]) glossBall(ctx, B, x + h * bx, sy + h * (0.08 + i * 0.065), Math.max(1, h * 0.011), pewter, { gloss: 0.6 });
  // The standing collar, piped in gold.
  blob(ctx, B, coat, [{ k: 'curve', pts: [hx - hr * 1.5, hy + hr * 2.3, hx - hr * 1.3, hy + hr * 1.55, hx - hr * 0.5, hy + hr * 1.68, hx + hr * 0.6, hy + hr * 1.66, hx + hr * 1.36, hy + hr * 1.5, hx + hr * 1.56, hy + hr * 2.3, hx + hr * 0.8, hy + hr * 2.1, hx - hr * 0.7, hy + hr * 2.12], wobble: 0.04, seed: seed + 2, sub: 3 }],
    { h, formK: 0.55, spread: 0.7, tex: 'folds', seed: seed + 2, amount: 0.3 });
  softLine(ctx, B, [hx - hr * 1.3, hy + hr * 1.6, hx - hr * 0.5, hy + hr * 1.73, hx + hr * 0.6, hy + hr * 1.71, hx + hr * 1.36, hy + hr * 1.55], gold, Math.max(1, h * 0.009), 0.95);
  // The cuff on the near sleeve, piped.
  const e = near[1], w = near[2], cu = (t: number): Pt => ({ x: e.x + (w.x - e.x) * t, y: e.y + (w.y - e.y) * t });
  const c0 = cu(0.68), c1 = cu(0.9);
  blob(ctx, B, shade(coat, 0.8), [tube([c0.x, c0.y, c1.x, c1.y], h * 0.04, h * 0.044, 0, seed + 3)], { h, formK: 0.5, spread: 0.7 });
  const dx = c1.x - c0.x, dy = c1.y - c0.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L * h * 0.042, ny = dx / L * h * 0.042;
  softLine(ctx, B, [c0.x + nx, c0.y + ny, c0.x - nx, c0.y - ny], gold, Math.max(1, h * 0.008), 0.95);
}

/**
 * A Wrack crewman's head: bare, the hair tarred back into a sailor's queue that stands out behind
 * him, a gold ring in the near ear, clean-shaven. The queue is what sets the crews apart from the
 * capped and hatted men of the Foreland's smuggling gang at a glance.
 */
function wrackHead(ctx: CanvasRenderingContext2D, R: Rig, p: Paint, sway: number, seed: number): void {
  const { h, hx, hy, hr } = R;
  // The queue: out from the back of the head toward the far side, bound with cord, a tuft at the end.
  const q0 = { x: hx - hr * 0.7, y: hy - hr * 0.3 }, q1 = { x: hx - hr * 1.9 + sway, y: hy + hr * 0.5 };
  blob(ctx, B, R.hair, [
    tube([q0.x, q0.y, (q0.x + q1.x) / 2, (q0.y + q1.y) / 2 - hr * 0.1, q1.x, q1.y], hr * 0.26, hr * 0.16, 0.04, seed),
    { k: 'curve', pts: [q1.x + hr * 0.1, q1.y - hr * 0.1, q1.x - hr * 0.3, q1.y + hr * 0.1, q1.x - hr * 0.2, q1.y + hr * 0.5, q1.x + hr * 0.15, q1.y + hr * 0.3], wobble: 0.1, spiky: 0.2, seed: seed + 1, sub: 2 },
  ], { h, formK: 0.4, spread: 0.7 });
  const qb = { x: q0.x + (q1.x - q0.x) * 0.6, y: q0.y + (q1.y - q0.y) * 0.6 };
  stroke(ctx, [qb.x - hr * 0.05, qb.y - hr * 0.2, qb.x + hr * 0.08, qb.y + hr * 0.2], shade('#c8b890', p.tone), Math.max(1, hr * 0.16));
  face(ctx, R, false);
  // The hair, combed back flat and tarred: a cap of it to the brow, close to the skull.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 1.02, hy - hr * 0.2, hx - hr * 0.96, hy - hr * 0.86, hx - hr * 0.3, hy - hr * 1.1, hx + hr * 0.4, hy - hr * 1.08, hx + hr * 0.94, hy - hr * 0.8, hx + hr * 1.0, hy - hr * 0.36, hx + hr * 0.5, hy - hr * 0.6, hx - hr * 0.5, hy - hr * 0.62], wobble: 0.04, seed: seed + 2, sub: 2 }], { h, formK: 0.45, gloss: 0.3 });
  // The gold ring in the near ear.
  if (!B.override) {
    ctx.strokeStyle = shade('#e0b040', Math.max(0.6, p.tone)); ctx.lineWidth = Math.max(1, hr * 0.12);
    ctx.beginPath(); ctx.arc(hx + hr * 0.98, hy + hr * 0.38, Math.max(1, hr * 0.17), 0, Math.PI * 2); ctx.stroke();
  }
}

/**
 * The Wrack smuggler: a Compact hand gone over to the Hand's coin, and dressed on it, in a Helmstow
 * coat. He leans in with the near foot leading and the Compact's knife raised by his ear in a
 * reverse grip, point down and out, ready to cut; the far fist is on his hip. The knife is a long
 * single-edged blade with its grip bound in tarred cord and a pale rope knot at the pommel: the
 * Compact's mark, on a man who has left it.
 */
function wrackSmuggler(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.024, hipTilt: 0.02, turn: 0.026, near: [0.082, 0.19, 0.236], far: [-0.078, -0.12, -0.162], toe: [1, -0.8], lift: [0, 0.03] });
  const { sy } = R;
  const sway = Math.sin(p.frame / 20) * h * 0.006;
  // The near fist up by the ear; the far one on the hip, elbow out.
  const fist = { x: x + h * 0.25, y: sy - h * 0.08 + sway };
  const near: Arm = [R.sNear, { x: x + h * 0.3, y: sy + h * 0.08 }, fist];
  const far: Arm = [R.sFar, { x: x - h * 0.26, y: sy + h * 0.16 }, { x: x - h * 0.13, y: sy + h * 0.25 }];
  const hemY = y - h * 0.45;
  groundShadow(ctx, x, y + 1, h * 0.78);
  blob(ctx, B, shade(p.dark, 0.84), armParts(R, far, 501, 0.94), { h, formK: 0.45, creases: [elbowCrease(R, far)] });
  hand(ctx, R, far[2], null, 502, { far: true, k: 0.92 });
  legs(ctx, R, shade('#4a5260', p.tone), 503, [1, -0.8]);
  headNeck(ctx, R);
  helmstowCoat(ctx, R, p, near, hemY, 504);
  blob(ctx, B, R.strap, [beltPart(R, hemY - h * 0.06, h * 0.036, 509)], { h, form: false });
  band(ctx, B, x - h * 0.02, hemY - h * 0.062, h * 0.036, h * 0.036, R.dull);
  wrackHead(ctx, R, p, sway, 510);
  // The knife, point down and out from the fist, and the Compact's knot at its pommel.
  const tip = { x: fist.x + h * 0.15, y: fist.y + h * 0.13 };
  const ka = blade(ctx, R, fist, tip.x, tip.y, h * 0.014, h * 0.028);
  const ux = Math.cos(ka), uy = Math.sin(ka);
  glossBall(ctx, B, fist.x - ux * h * 0.06, fist.y - uy * h * 0.06, Math.max(1.2, h * 0.016), shade('#d8c8a0', p.tone), { gloss: 0.2, spread: 0.6 });
  hand(ctx, R, fist, ka, 515, { flip: -1 });
  void p.light;
}
