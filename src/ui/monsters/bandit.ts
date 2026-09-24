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
import { shade } from '../../lib/art/palettes.ts';
import type { Arm, Pt, Rig } from './figure.ts';
import { armParts, beltPart, blade, elbowCrease, FAR, hand, headNeck, headRing, legs, makeRig, ring, torsoCreases, torsoPts, trunkW, tube } from './figure.ts';
import { band } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bandit', 'archer', 'brigand', 'brigand_archer', 'smuggler', 'smuggler_bow', 'smuggler_captain'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'archer') archer(ctx, x, y, h, p);
  else if (kind === 'brigand') brigand(ctx, x, y, h, p);
  else if (kind === 'brigand_archer') brigandArcher(ctx, x, y, h, p);
  else if (kind === 'smuggler') smuggler(ctx, x, y, h, p);
  else if (kind === 'smuggler_bow') smugglerBow(ctx, x, y, h, p);
  else if (kind === 'smuggler_captain') smugglerCaptain(ctx, x, y, h, p);
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
 * A shortbow gripped at `at`. Drawn as a bow rather than an arc: the two limbs are tapered tubes in
 * ONE wooden mass, thick at the riser under the hand and fining to the nocks, bowed away from the
 * archer so the string stands off the grip by a brace height. The arrow is NOCKED — its shaft
 * starts on the string, crosses the riser at the arrow pass and carries its head out past the bow —
 * instead of floating across in front of it. Returns the bow's axis for the hand that holds it.
 */
function bow(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, sway: number): number {
  const { h } = R;
  const top = { x: at.x + h * 0.074, y: at.y - h * 0.325 }, bot = { x: at.x + h * 0.06, y: at.y + h * 0.3 };
  const grip = { x: at.x - h * 0.006, y: at.y };
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
  // Limbs bent hard away from the archer: a drawn bow is a much deeper arc than a braced one.
  const top = { x: at.x + h * 0.096, y: at.y - h * 0.3 }, bot = { x: at.x + h * 0.084, y: at.y + h * 0.28 };
  const tipR = Math.max(h * 0.0075, Math.min(1, h * 0.026) * 0.6), midR = Math.max(h * 0.017, Math.min(1, h * 0.026) * 1.25);
  blob(ctx, B, R.wood, [
    tube([top.x, top.y, at.x + h * 0.004, at.y - h * 0.15, at.x - h * 0.008, at.y - h * 0.028], tipR, midR, 0, 91),
    tube([at.x - h * 0.008, at.y - h * 0.028, at.x + h * 0.006, at.y + h * 0.14, bot.x, bot.y], midR, tipR, 0, 92),
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
