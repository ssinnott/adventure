// The Ashen cult: cultist, zealot, adept and the Hand of Ash. Painted as masses, not parts: every
// robe is ONE blob in the def's tint (gown, cowl and near sleeve together, with creases under the
// arm and at the belt and a folds texture), the far arm its own darker mass behind it, then the
// other materials (skin, bone mask, mantle, rope, leather, steel) each as their own blob, then the
// crisp details (ember eyes, sigils, runes, blades) on top. Ember orange is the cult's accent and
// is never toned: it is the light source, so every ember sits on a glow().
// The bodies under the robes come from figure.ts, the same measured frame the bandits stand on:
// shoulders at -0.755, the joints a deltoid's radius under that line, a trunk that narrows to a
// waist, arms that taper to a wrist half a shoulder wide, and joint angles a person could hold.
// A robe is cloth hanging on that body, not a shape drawn where a body would be.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glow, softLine, patch, glossBall, glossPoly, glossTaper, appendCurve, lumpy } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import type { Arm, Mats, Pt, Rig } from './figure.ts';
import { armParts, elbowCrease, hand as fist, makeRig, trunkW, FAR } from './figure.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['cultist', 'zealot', 'adept', 'ashen_hand'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'zealot') zealot(ctx, x, y, h, p);
  else if (kind === 'adept') adept(ctx, x, y, h, p);
  else if (kind === 'ashen_hand') hand(ctx, x, y, h, p);
  else cultist(ctx, x, y, h, p);
};

/** The cult's palette, in the shape figure.ts wants: ashen skin, bone, charred leather, cold steel. */
const CULT = (t: number): Mats => ({
  skin: shade('#c4a48c', t), skinFar: shade('#8e7460', t), hair: shade('#2a2420', t),
  leather: shade('#3c2a22', t), strap: shade('#2a1c16', t), boot: shade('#241c1a', t),
  steel: shade('#b4b8c4', t), dull: shade('#6e7280', t),
  wood: shade('#4a3424', t), bone: shade('#e2d8c4', t), brass: shade('#a8905c', t),
});

/** Emissive ember colours: never toned, they are the light. */
const EMBER = '#ff9a40', HOT = '#fff0c0', VOID = '#120c16';

/** The cult's fixed materials, toned by distance. */
function mats(tone: number) {
  return {
    skin: shade('#c4a48c', tone),
    bone: shade('#e2d8c4', tone),
    ash: shade('#a8a09c', tone),
    rope: shade('#a8905c', tone),
    leather: shade('#3c2a22', tone),
    wood: shade('#4a3424', tone),
    steel: shade('#b4b8c4', tone),
    wrap: shade('#9e9078', tone),
    skinFar: shade('#8e7460', tone),
  };
}

// ------------------------------------------------------------------ the rank and file ----
function cultist(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone);
  const R = makeRig(x, y, h, p, { tilt: -0.014, hipTilt: 0.016, turn: 0.02, near: [0.055, 0.07, 0.082], far: [-0.054, -0.066, -0.078], toe: [0.6, -0.6] }, CULT);
  const { sy, hx, hy, hr } = R;
  const pulse = 0.5 + 0.5 * Math.sin(p.frame / 6), flick = Math.sin(p.frame / 3.7) * 0.5 + 0.5;
  const beltY = sy + h * 0.18, hemY = sy + h * 0.7;
  // Far arm hangs almost straight (171 deg); the near one is bent to a hand at the hip that holds
  // the staff, so the staff is gripped rather than stood beside.
  const far: Arm = [R.sFar, { x: x - h * 0.175, y: sy + h * 0.225 }, { x: x - h * 0.185, y: sy + h * 0.38 }];
  const near: Arm = [R.sNear, { x: x + h * 0.28, y: sy + h * 0.178 }, { x: x + h * 0.23, y: sy + h * 0.33 }];
  const sTop = { x: x + h * 0.175, y: y - h * 1.075 }, sBot = { x: x + h * 0.3, y: y - h * 0.01 };
  groundShadow(ctx, x + h * 0.02, y + 1, h * 0.68);

  // Bare feet under the hem, then the far sleeve behind everything with its hand at the cuff.
  blob(ctx, B, m.skin, [
    footPart(R, R.legL[2], -0.6, 61), footPart(R, R.legR[2], 0.6, 62),
  ], { h, formK: 0.45, spread: 0.7 });
  footMarks(ctx, R, R.legL[2], -0.6, m.skin); footMarks(ctx, R, R.legR[2], 0.6, m.skin);
  blob(ctx, B, p.dark, armParts(R, far, 31, 1.15), { h, formK: 0.55, creases: [elbowCrease(R, far)] });
  fist(ctx, R, far[2], null, 34, { far: true, k: 0.92 });

  // The staff, planted and leaning in, drawn before the gripping hand so the fingers close on it.
  staff(ctx, sBot.x, sBot.y, sTop.x, sTop.y, h, m.wood);

  // The robe: gown, cowl and the near sleeve, one mass in the tint.
  blob(ctx, B, p.base, [
    robePart(R, beltY, hemY, 0.19, 3, 0.022),
    cowlPart(R, 1.48, 2),
    ...armParts(R, near, 12, 1.2),
  ], { h, tex: 'folds', seed: 3, amount: 0.7, formK: 0.6, creases: [
    { x0: x + trunkW(R, sy + h * 0.06) - h * 0.01, y0: sy + h * 0.07, x1: x + trunkW(R, beltY), y1: beltY - h * 0.01, r: h * 0.022, a: 0.35 },
    { x0: x - trunkW(R, sy + h * 0.06) * FAR + h * 0.01, y0: sy + h * 0.065, x1: x - trunkW(R, beltY) * FAR, y1: beltY - h * 0.01, r: h * 0.02, a: 0.3 },
    { x0: hx - hr * 1.1, y0: hy + hr * 1.25, x1: hx + hr * 1.1, y1: hy + hr * 1.3, r: h * 0.02, a: 0.35 },
    elbowCrease(R, near),
  ] });
  sleeveEdge(ctx, h, p.base, near[0].x, near[0].y, near[1].x, near[1].y, h * 0.048);
  sleeveEdge(ctx, h, p.base, near[1].x, near[1].y, near[2].x, near[2].y, h * 0.042);
  // Folds: from the shoulders, and radiating out of the belt where the cord gathers the cloth.
  drape(ctx, h, p.base, x - h * 0.08, sy + h * 0.07, h * 0.07, h * 0.18, 3, 51, 0.5, 0.28);
  drape(ctx, h, p.base, x, beltY + h * 0.01, h * 0.2, hemY - beltY - h * 0.03, 6, 52, 0.8, 0.28);

  // The face: a dark void under the cowl, a matched pair of embers set deep in it.
  faceVoid(ctx, hx, hy + h * 0.016, hr * 0.92, hr * 1.08, 4);
  emberEyes(ctx, hx - hr * 0.46, hy, hx + hr * 0.46, hy, h * 0.014, pulse, false, 2.1);

  // Rope belt at the waist, with a knot and two hanging ends.
  const bw = trunkW(R, beltY) + h * 0.012;
  blob(ctx, B, m.rope, [
    tube([x - bw, beltY + h * 0.012, x, beltY - h * 0.004, x + bw, beltY + h * 0.008], h * 0.013, h * 0.013, 0.1, 5),
    { k: 'ball', x: x + h * 0.03, y: beltY + h * 0.006, r: h * 0.021 },
    tube([x + h * 0.02, beltY + h * 0.012, x - h * 0.005, beltY + h * 0.12], h * 0.01, h * 0.008, 0.1, 6),
    tube([x + h * 0.05, beltY + h * 0.012, x + h * 0.075, beltY + h * 0.105], h * 0.01, h * 0.008, 0.1, 7),
  ], { h, formK: 0.5 });

  // The near hand closed round the shaft, then the ember set in the staff's head.
  const ga = Math.atan2(sTop.y - sBot.y, sTop.x - sBot.x);
  fist(ctx, R, near[2], ga, 42, { flip: -1 });
  glow(ctx, B, sTop.x, sTop.y, h * (0.075 + 0.02 * flick), EMBER, 0.45 + 0.2 * pulse, HOT);
  glossBall(ctx, B, sTop.x, sTop.y, h * 0.026, EMBER, { gloss: 0.7 });
  void p.light;
}

// ------------------------------------------------------------------ the fighter ----
function zealot(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone);
  const R = makeRig(x, y, h, p, { tilt: -0.02, hipTilt: 0.03, turn: 0.03, near: [0.075, 0.155, 0.205], far: [-0.072, -0.115, -0.175], toe: [1, -0.9], lift: [0, 0.04] }, CULT);
  const { sy, hx, hy, hr } = R;
  const pulse = 0.5 + 0.5 * Math.sin(p.frame / 6), sway = Math.sin(p.frame / 20) * h * 0.008;
  const beltY = sy + h * 0.175, hemY = sy + h * 0.58;
  // Near arm raised to strike: the upper arm goes UP from the shoulder to an elbow above it, the
  // forearm out, the knife carrying on up and out. 69 deg at the elbow, 45 at the wrist — a real
  // overhead guard, where the old pose had the whole arm stretched out past the frame.
  const near: Arm = [R.sNear, { x: x + h * 0.141, y: sy - h * 0.163 }, { x: x + h * 0.3 + sway, y: sy - h * 0.15 }];
  const far: Arm = [R.sFar, { x: x - h * 0.15, y: sy + h * 0.236 }, { x: x - h * 0.3 - sway, y: sy + h * 0.18 }];
  groundShadow(ctx, x, y + 1, h * 0.78);

  // The far leg and foot under the robe; the near one strides bare and is drawn over the skirt.
  blob(ctx, B, m.skin, [
    tube([R.legL[0].x, R.legL[0].y, R.legL[1].x, R.legL[1].y, R.legL[2].x, R.legL[2].y], h * 0.055, h * 0.03, 0.03, 9),
    footPart(R, R.legL[2], -0.9, 73),
  ], { h, formK: 0.55, spread: 0.7 });
  blob(ctx, B, m.skinFar, [...armParts(R, far, 17)], { h, formK: 0.55, creases: [elbowCrease(R, far)] });
  fist(ctx, R, far[2], null, 19, { far: true, k: 0.95 });
  // Head and neck BEFORE the robe, so the collar covers the throat. Drawn after it, the neck runs
  // from the jaw to the chest as a bare column and the head appears to be on a stalk.
  blob(ctx, B, m.skin, [
    { k: 'curve', pts: ring(hx, hy, hr * 0.98, hr * 1.04, 10), wobble: 0.035, seed: 15, sub: 2 },
    { k: 'cap', x0: hx, y0: hy + hr * 0.72, x1: hx - h * 0.005, y1: sy + h * 0.015, r0: hr * 0.44, r1: hr * 0.54 },
  ], { h, formK: 0.55, creases: [
    { x0: hx - hr * 0.35, y0: hy + hr * 0.9, x1: hx + hr * 0.35, y1: hy + hr * 0.9, r: h * 0.016, a: 0.4 },
  ] });

  // The robe: gathered at the belt, short enough to stride out of, torn at the hem.
  blob(ctx, B, p.base, [robePart(R, beltY, hemY, 0.26, 11, 0.035)], { h, tex: 'folds', seed: 13, amount: 0.8, formK: 0.5, creases: [
    { x0: x - trunkW(R, beltY) * FAR, y0: beltY - h * 0.012, x1: x + trunkW(R, beltY), y1: beltY - h * 0.012, r: h * 0.02, a: 0.3 },
    { x0: x + trunkW(R, sy + h * 0.06) - h * 0.01, y0: sy + h * 0.07, x1: x + trunkW(R, beltY), y1: beltY - h * 0.02, r: h * 0.022, a: 0.35 },
    { x0: x + h * 0.06, y0: beltY + h * 0.05, x1: x + h * 0.1, y1: hemY - h * 0.03, r: h * 0.026, a: 0.35 },
  ] });
  drape(ctx, h, p.base, x - h * 0.02, beltY + h * 0.01, h * 0.2, hemY - beltY - h * 0.03, 5, 24, 0.75, 0.3);
  // Leather belt, knotted, with one end hanging.
  const bw = trunkW(R, beltY) + h * 0.014;
  blob(ctx, B, m.leather, [
    tube([x - bw, beltY + h * 0.012, x, beltY - h * 0.006, x + bw, beltY + h * 0.01], h * 0.017, h * 0.017, 0.05, 14),
    { k: 'ball', x: x + h * 0.02, y: beltY + h * 0.002, r: h * 0.023 },
    tube([x + h * 0.042, beltY + h * 0.012, x + h * 0.06, beltY + h * 0.1], h * 0.009, h * 0.006, 0.08, 25),
  ], { h, formK: 0.5 });
  sigil(ctx, x + h * 0.02, sy + h * 0.075, h * 0.05, m.ash, h);

  // The near leg, bare, striding through the slit: drawn after the skirt so it reads as coming
  // through it rather than as painted on it.
  blob(ctx, B, m.skin, [
    tube([R.legR[0].x, R.legR[0].y, R.legR[1].x, R.legR[1].y, R.legR[2].x, R.legR[2].y], h * 0.058, h * 0.031, 0.03, 10),
    footPart(R, R.legR[2], 1, 74),
  ], { h, formK: 0.55, spread: 0.7, creases: [
    { x0: R.legR[1].x - h * 0.022, y0: R.legR[1].y - h * 0.012, x1: R.legR[1].x + h * 0.02, y1: R.legR[1].y + h * 0.012, r: h * 0.016, a: 0.4 },
  ] });
  if (h >= 46) softLine(ctx, B, [R.legR[1].x + h * 0.03, R.legR[1].y + h * 0.03, R.legR[2].x + h * 0.024, R.legR[2].y - h * 0.03], mix(m.skin, '#ffffff', 0.5), Math.max(1, h * 0.011), 0.3);

  // The near arm, bare, over the robe so it comes out of its shoulder.
  blob(ctx, B, m.skin, [...armParts(R, near, 16)], { h, formK: 0.55, creases: [elbowCrease(R, near)] });
  fist(ctx, R, near[2], null, 18, { k: 0.95 });
  // Bandaged forearms over the bare skin.
  blob(ctx, B, m.wrap, [
    tube([near[1].x + (near[2].x - near[1].x) * 0.32, near[1].y + (near[2].y - near[1].y) * 0.32, near[2].x, near[2].y], h * 0.036, h * 0.03, 0.06, 20),
  ], { h, formK: 0.5 });
  blob(ctx, B, m.wrap, [
    tube([far[1].x + (far[2].x - far[1].x) * 0.32, far[1].y + (far[2].y - far[1].y) * 0.32, far[2].x, far[2].y], h * 0.034, h * 0.029, 0.06, 21),
  ], { h, formK: 0.5 });
  // The skull painted on the shaved head in ash, ember eyes in the sockets.
  skullPaint(ctx, hx, hy, hr, mix(m.ash, m.skin, 0.3), h, pulse);
  // Two curved sacrificial knives, each carrying on from its own forearm.
  knife(ctx, near[2].x, near[2].y, -0.7, h * 0.2, m.steel, m.leather, false);
  knife(ctx, far[2].x, far[2].y, 2.72, h * 0.17, m.steel, m.leather, true);
  void p.light;
}

// ------------------------------------------------------------------ the caster ----
function adept(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone), Y = (u: number) => y + u * h;
  const R = makeRig(x, y, h, p, { tilt: 0.016, hipTilt: -0.016, turn: -0.012, near: [0.055, 0.068, 0.08], far: [-0.055, -0.07, -0.085], toe: [0.5, -0.7] }, CULT);
  const { sy, hx, hy, hr } = R;
  const pulse = 0.5 + 0.5 * Math.sin(p.frame / 6), flick = Math.sin(p.frame / 2.9) * 0.5 + 0.5;
  const hover = Math.sin(p.frame / 16) * h * 0.012;
  const beltY = sy + h * 0.175, hemY = sy + h * 0.7;
  // Far arm: elbow low and out at the ribs, forearm rising to a palm held up at shoulder height
  // with the flame standing on it. Near arm bent to a hand on the planted staff.
  const far: Arm = [R.sFar, { x: x - h * 0.295, y: sy + h * 0.171 }, { x: x - h * 0.355, y: sy + h * 0.04 }];
  const near: Arm = [R.sNear, { x: x + h * 0.304, y: sy + h * 0.156 }, { x: x + h * 0.235, y: sy + h * 0.3 }];
  const sBot = { x: x + h * 0.31, y: Y(-0.01) }, sTop = { x: x + h * 0.322, y: sy - h * 0.255 };
  groundShadow(ctx, x + h * 0.02, y + 1, h * 0.64);

  blob(ctx, B, m.skin, [footPart(R, R.legL[2], -0.7, 71), footPart(R, R.legR[2], 0.5, 72)], { h, formK: 0.45, spread: 0.7 });
  footMarks(ctx, R, R.legL[2], -0.7, m.skin); footMarks(ctx, R, R.legR[2], 0.5, m.skin);
  blob(ctx, B, p.dark, armParts(R, far, 41, 1.15), { h, formK: 0.6, creases: [elbowCrease(R, far)] });
  blob(ctx, B, p.base, [
    robePart(R, beltY, hemY, 0.17, 42, 0.03),
    ...armParts(R, near, 43, 1.2),
  ], { h, tex: 'folds', seed: 44, amount: 0.9, formK: 0.6, creases: [
    { x0: x + trunkW(R, sy + h * 0.06) - h * 0.01, y0: sy + h * 0.075, x1: x + trunkW(R, beltY), y1: beltY - h * 0.012, r: h * 0.02, a: 0.3 },
    { x0: x - trunkW(R, beltY) * FAR, y0: beltY - h * 0.012, x1: x + trunkW(R, beltY), y1: beltY - h * 0.012, r: h * 0.02, a: 0.3 },
    { x0: x - h * 0.05, y0: beltY + h * 0.05, x1: x - h * 0.09, y1: hemY - h * 0.04, r: h * 0.018, a: 0.2 },
    elbowCrease(R, near),
  ] });
  sleeveEdge(ctx, h, p.base, near[0].x, near[0].y, near[1].x, near[1].y, h * 0.05);
  drape(ctx, h, p.base, x - h * 0.01, beltY + h * 0.01, h * 0.16, hemY - beltY - h * 0.04, 5, 54, 0.75, 0.3);
  // The mantle over the shoulders: a darker material, scalloped, narrow at the neck and sloping
  // out over each shoulder — it has to sit on the deltoids, not float above them.
  const mw = trunkW(R, sy + h * 0.06) + h * 0.06;
  blob(ctx, B, mix(p.dark, m.ash, 0.3), [{ k: 'curve', pts: [
    x - h * 0.084, sy - h * 0.05, x + h * 0.084, sy - h * 0.05,
    R.sNear.x + h * 0.03, R.sNear.y - h * 0.046, x + mw, sy + h * 0.07,
    x + mw * 0.9, sy + h * 0.155, x + h * 0.12, sy + h * 0.225, x + h * 0.01, sy + h * 0.275,
    x - h * 0.13, sy + h * 0.225, x - mw * 0.9, sy + h * 0.155,
    x - mw, sy + h * 0.07, R.sFar.x - h * 0.03, R.sFar.y - h * 0.042,
  ], wobble: 0.035, spiky: 0.07, seed: 45, sub: 2 }], { h, tex: 'folds', seed: 46, amount: 0.8, formK: 0.45, creases: [
    { x0: x - h * 0.1, y0: sy + h * 0.01, x1: x + h * 0.1, y1: sy + h * 0.01, r: h * 0.028, a: 0.26 },
  ] });
  blob(ctx, B, p.base, [cowlPart(R, 1.3, 47)], { h, formK: 0.5, creases: [
    { x0: hx - hr * 0.9, y0: hy + hr * 1.2, x1: hx + hr * 0.9, y1: hy + hr * 1.2, r: h * 0.03, a: 0.22 },
  ] });
  // Face: void, then a shaped mask over it — brow, eye slits with ember behind, a chin.
  faceVoid(ctx, hx, hy + h * 0.024, hr * 0.9, hr * 1.16, 48);
  halfMask(ctx, hx, hy + h * 0.01, hr * 0.96, mix(m.bone, m.ash, 0.5), h, pulse);
  // Rune bands glowing on both cuffs and along the mantle's edge.
  runeBand(ctx, near[2].x + h * 0.02, near[2].y - h * 0.03, h * 0.05, h * 0.018, 0.3, h, pulse);
  runeBand(ctx, far[2].x - h * 0.01, far[2].y + h * 0.035, h * 0.05, h * 0.018, -0.4, h, pulse);
  runeRow(ctx, [x - mw * 0.85, sy + h * 0.15, x - h * 0.1, sy + h * 0.205, x + h * 0.01, sy + h * 0.25, x + h * 0.12, sy + h * 0.205, x + mw * 0.85, sy + h * 0.15], h, pulse);
  // The tall staff, crowned with iron prongs, and the ember orb floating above them.
  staff(ctx, sBot.x, sBot.y, sTop.x, sTop.y, h, m.wood);
  const cx0 = sTop.x, cy0 = sTop.y;
  glossPoly(ctx, B, [cx0 - h * 0.03, cy0 + h * 0.01, cx0 - h * 0.045, cy0 - h * 0.06, cx0 - h * 0.015, cy0 - h * 0.025, cx0, cy0 - h * 0.065, cx0 + h * 0.015, cy0 - h * 0.025, cx0 + h * 0.045, cy0 - h * 0.06, cx0 + h * 0.03, cy0 + h * 0.01], m.leather, { spread: 0.6 });
  const ox = cx0, oy = cy0 - h * 0.075 + hover;
  glow(ctx, B, ox, oy, h * (0.13 + 0.02 * flick), EMBER, 0.5 + 0.2 * pulse, HOT);
  glossBall(ctx, B, ox, oy, h * 0.036, EMBER, { gloss: 0.9 });
  if (!B.override) { ctx.fillStyle = HOT; ctx.beginPath(); ctx.arc(ox - h * 0.008, oy - h * 0.008, Math.max(1, h * 0.012), 0, Math.PI * 2); ctx.fill(); }
  // Hands: near closed on the staff, far open with a small flame standing on the palm.
  const ga = Math.atan2(sTop.y - sBot.y, sTop.x - sBot.x);
  fist(ctx, R, near[2], ga, 49, { flip: -1 });
  fist(ctx, R, far[2], null, 50, { far: true, k: 0.95 });
  flame(ctx, far[2].x, far[2].y - h * 0.06, h * (0.09 + 0.03 * flick), h, p.frame);
  void p.light;
}

function hand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone), Y = (u: number) => y + u * h, X = (u: number) => x + u * h;
  const R = makeRig(x, y, h, p, { tilt: -0.012, hipTilt: 0.014, turn: 0.014, near: [0.062, 0.08, 0.098], far: [-0.06, -0.078, -0.095], toe: [0.6, -0.6] }, CULT);
  const { sy, hx, hy, hr } = R;
  const pulse = 0.5 + 0.5 * Math.sin(p.frame / 6), flick = Math.sin(p.frame / 3.3) * 0.5 + 0.5;
  const beltY = sy + h * 0.185, hemY = sy + h * 0.73;
  // Near arm hangs to a fist at the hip with the chisel-blade carrying on down and out from the
  // forearm; the far one hangs open. Both at about 160 deg — the Hand does not posture.
  const near: Arm = [R.sNear, { x: X(0.255), y: sy + h * 0.185 }, { x: X(0.245), y: sy + h * 0.345 }];
  const far: Arm = [R.sFar, { x: X(-0.235), y: sy + h * 0.2 }, { x: X(-0.255), y: sy + h * 0.358 }];
  groundShadow(ctx, X(0.02), y + 1, h * 0.86);

  // The burning halo behind the shoulders, and ash pooling at the hem.
  glow(ctx, B, x, sy + h * 0.02, h * 0.5, EMBER, 0.32 + 0.1 * pulse, '#ffc070');
  glow(ctx, B, x, sy + h * 0.02, h * 0.3, '#ff6020', 0.18 + 0.1 * flick, EMBER);
  blob(ctx, B, mix(m.ash, p.base, 0.2), [{ k: 'curve', pts: [X(-0.46), Y(-0.03), X(-0.34), Y(-0.1), X(-0.1), Y(-0.08), X(0.12), Y(-0.1), X(0.34), Y(-0.09), X(0.47), Y(-0.03), X(0.2), Y(-0.02), X(-0.2), Y(-0.02)], wobble: 0.05, spiky: 0.04, seed: 61, sub: 3 }], { h, outline: false, formK: 0.3 });

  blob(ctx, B, mix(m.skin, m.ash, 0.45), [footPart(R, R.legL[2], -0.6, 75), footPart(R, R.legR[2], 0.6, 76)], { h, formK: 0.45, spread: 0.7 });
  blob(ctx, B, p.dark, armParts(R, far, 62, 1.45), { h, formK: 0.6, creases: [elbowCrease(R, far)] });

  // The robe: a broad gown gathered low, with the near sleeve in the same mass.
  blob(ctx, B, p.base, [
    robePart(R, beltY, hemY, 0.3, 63, 0.075),
    ...armParts(R, near, 64, 1.5),
  ], { h, tex: 'folds', seed: 65, amount: 1.0, formK: 0.6, creases: [
    { x0: x - trunkW(R, beltY) * FAR, y0: beltY - h * 0.014, x1: x + trunkW(R, beltY), y1: beltY - h * 0.014, r: h * 0.022, a: 0.3 },
    { x0: X(-0.06), y0: beltY + h * 0.04, x1: X(-0.1), y1: hemY - h * 0.06, r: h * 0.02, a: 0.2 },
    { x0: X(0.1), y0: beltY + h * 0.04, x1: X(0.14), y1: hemY - h * 0.08, r: h * 0.02, a: 0.18 },
    elbowCrease(R, near),
  ] });
  drape(ctx, h, p.base, x, beltY + h * 0.01, h * 0.26, hemY - beltY - h * 0.04, 5, 74, 0.8, 0.3);
  // The wide mantle, shouldered, kept close to the robe in value so the embers and the mask carry
  // the contrast rather than a pale slab across the chest.
  const mw = trunkW(R, sy + h * 0.06) + h * 0.16;
  blob(ctx, B, mix(p.dark, m.ash, 0.16), [{ k: 'curve', pts: [
    X(-0.1), sy - h * 0.058, X(0.1), sy - h * 0.058,
    R.sNear.x + h * 0.04, R.sNear.y - h * 0.05, x + mw, sy + h * 0.075,
    x + mw * 0.86, sy + h * 0.185, X(0.16), sy + h * 0.255, X(0.02), sy + h * 0.315,
    X(-0.17), sy + h * 0.255, x - mw * 0.86, sy + h * 0.185,
    x - mw, sy + h * 0.075, R.sFar.x - h * 0.04, R.sFar.y - h * 0.046,
  ], wobble: 0.035, spiky: 0.07, seed: 66, sub: 2 }], { h, tex: 'folds', seed: 67, amount: 0.9, formK: 0.45, creases: [
    { x0: X(-0.16), y0: sy - h * 0.012, x1: X(0.16), y1: sy - h * 0.012, r: h * 0.03, a: 0.3 },
  ] });
  runeRow(ctx, [x - mw * 0.82, sy + h * 0.17, X(-0.14), sy + h * 0.235, X(0.02), sy + h * 0.285, X(0.18), sy + h * 0.235, x + mw * 0.82, sy + h * 0.17], h, pulse);
  blob(ctx, B, p.base, [cowlPart(R, 1.62, 68)], { h, formK: 0.5, creases: [
    { x0: hx - hr * 1.1, y0: hy + hr * 1.35, x1: hx + hr * 1.1, y1: hy + hr * 1.35, r: h * 0.024, a: 0.35 },
  ] });

  // The horned ash-mask: bone, skull-like, cracked with ember light.
  faceVoid(ctx, hx, hy + h * 0.024, hr * 1.1, hr * 1.3, 69);
  const r = hr * 1.28;
  blob(ctx, B, m.bone, [
    { k: 'curve', pts: [hx - r, hy - r * 0.3, hx - r * 0.85, hy - r * 0.9, hx, hy - r * 1.1, hx + r * 0.85, hy - r * 0.9, hx + r, hy - r * 0.3, hx + r * 0.75, hy + r * 0.5, hx + r * 0.4, hy + r * 1.05, hx - r * 0.4, hy + r * 1.05, hx - r * 0.75, hy + r * 0.5], wobble: 0.03, seed: 70, sub: 2 },
    { k: 'poly', pts: [hx - r * 0.95, hy - r * 0.5, hx - r * 1.3, hy - r * 1.15, hx - r * 1.44, hy - r * 1.9, hx - r * 0.98, hy - r * 1.35, hx - r * 0.55, hy - r * 0.95] },
    { k: 'poly', pts: [hx + r * 0.6, hy - r * 0.95, hx + r * 1.06, hy - r * 1.44, hx + r * 1.52, hy - r * 2.0, hx + r * 1.4, hy - r * 1.15, hx + r * 1.0, hy - r * 0.5] },
  ], { h, tex: 'cracks', seed: 71, amount: 0.8, formK: 0.55, gloss: 0.2, creases: [
    { x0: hx - r * 0.7, y0: hy - r * 0.55, x1: hx - r * 0.85, y1: hy - r * 0.35, r: r * 0.12, a: 0.3 },
    { x0: hx + r * 0.65, y0: hy - r * 0.6, x1: hx + r * 0.85, y1: hy - r * 0.3, r: r * 0.12, a: 0.3 },
  ] });
  ctx.fillStyle = B.col(VOID);
  ctx.beginPath(); ctx.ellipse(hx - r * 0.42, hy - r * 0.1, r * 0.3, r * 0.24, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + r * 0.42, hy - r * 0.08, r * 0.32, r * 0.25, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx - r * 0.12, hy + r * 0.55); ctx.lineTo(hx + r * 0.02, hy + r * 0.25); ctx.lineTo(hx + r * 0.14, hy + r * 0.55); ctx.closePath(); ctx.fill();
  emberEyes(ctx, hx - r * 0.42, hy - r * 0.1, hx + r * 0.42, hy - r * 0.08, r * 0.13, pulse);
  if (!B.override) {
    glow(ctx, B, hx + r * 0.5, hy + r * 0.4, r * 0.7, EMBER, 0.3 + 0.2 * pulse, HOT);
    ctx.strokeStyle = rgba(EMBER, 0.8 + 0.2 * pulse); ctx.lineWidth = Math.max(1, r * 0.09); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(hx + r * 0.9, hy - r * 0.35); ctx.lineTo(hx + r * 0.7, hy); ctx.lineTo(hx + r * 0.8, hy + r * 0.3); ctx.lineTo(hx + r * 0.55, hy + r * 0.62); ctx.lineTo(hx + r * 0.6, hy + r * 0.95); ctx.stroke();
    // Backlight from the halo: a warm rim along the cowl and each shoulder.
    ctx.strokeStyle = rgba(EMBER, 0.28 + 0.12 * pulse); ctx.lineWidth = Math.max(1, h * 0.012);
    ctx.beginPath(); ctx.moveTo(hx + hr * 1.5, hy - hr * 1.1); ctx.quadraticCurveTo(hx + hr * 2.3, hy + hr * 0.3, hx + hr * 2.0, hy + hr * 2.0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.7, hy - hr * 0.9); ctx.quadraticCurveTo(hx - hr * 2.3, hy + hr * 0.4, hx - hr * 2.1, hy + hr * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0.2), sy - h * 0.042); ctx.quadraticCurveTo(x + mw * 0.9, sy + h * 0.01, x + mw, sy + h * 0.09); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(-0.2), sy - h * 0.042); ctx.quadraticCurveTo(x - mw * 0.9, sy + h * 0.01, x - mw, sy + h * 0.09); ctx.stroke();
  }
  if (h >= 50) softLine(ctx, B, [hx - r * 0.35, hy + r * 0.8, hx + r * 0.35, hy + r * 0.8], m.bone, Math.max(1, r * 0.08), 0.5);

  // The long ritual chisel-blade, carrying on down and out from the near forearm.
  const ct = { x: X(0.365), y: sy + h * 0.68 };
  chisel(ctx, near[2].x, near[2].y, ct.x, ct.y, h, m.steel, m.leather, pulse);
  // Ash-greyed hands: a bright skin blob out on the sleeve would fight the mask and the embers.
  const hs = mix(m.skin, m.ash, 0.45);
  const ca = Math.atan2(ct.y - near[2].y, ct.x - near[2].x);
  fist(ctx, R, near[2], ca, 77, { hex: hs, flip: -1, k: 1.1 });
  fist(ctx, R, far[2], null, 78, { hex: mix(hs, m.ash, 0.3), k: 1.05 });
  embers(ctx, x, y, h, p.frame, 6, 2);
  void p.light;
}

// ------------------------------------------------------------------ shared shapes ----

/**
 * The gown: shoulders, a waist, a hem that swings to the viewer's left with the weight on that leg.
 * shW and hemW are half-widths in units of h; `tatter` is the spikiness of the whole contour.
 */
function gown(x: number, y: number, h: number, sy: number, shW: number, hemW: number, seed: number, tatter = 0.045): Part {
  const X = (u: number) => x + u * h, Y = (u: number) => y + u * h;
  return { k: 'curve', pts: [
    // The neck: the cloth is narrowest here, so the cowl sits on a throat and not on a sack.
    X(-shW * 0.34), sy - h * 0.045, X(shW * 0.36), sy - h * 0.045,
    // Out and down over the shoulder, the widest point of the upper body.
    X(shW * 0.88), sy - h * 0.005, X(shW * 1.04), sy + h * 0.055,
    // In again through the ribs to the waist, where the belt gathers it.
    X(shW * 0.9), Y(-0.58), X(shW * 0.72), Y(-0.48),
    // Then the skirt falls open to the hem.
    X(hemW * 0.72), Y(-0.29), X(hemW * 0.98), Y(-0.07),
    X(hemW * 0.45), Y(-0.06), X(-hemW * 0.1), Y(-0.07), X(-hemW * 0.6), Y(-0.06), X(-hemW * 1.0), Y(-0.07),
    X(-hemW * 0.7), Y(-0.29), X(-shW * 0.7), Y(-0.48),
    X(-shW * 0.88), Y(-0.58), X(-shW * 1.02), sy + h * 0.055,
    X(-shW * 0.86), sy - h * 0.005,
  ], wobble: 0.026, spiky: tatter, seed, sub: 3 };
}

/** The cowl: a lumpy hood around the head centre, its peak drooping to one side; `k` scales it. */
function cowl(hx: number, hy: number, h: number, k: number, seed: number): Part {
  const r = h * 0.1 * k;
  return { k: 'curve', pts: [
    hx - r * 1.3, hy + r * 1.35, hx - r * 1.5, hy + r * 0.1, hx - r * 1.1, hy - r * 0.95, hx - r * 0.45, hy - r * 1.4, hx + r * 0.1, hy - r * 1.85,
    hx + r * 0.75, hy - r * 1.2, hx + r * 1.35, hy - r * 0.45, hx + r * 1.45, hy + r * 0.6, hx + r * 1.2, hy + r * 1.4, hx, hy + r * 1.5,
  ], wobble: 0.045, spiky: 0.02, seed, sub: 3 };
}

function robeCreases(x: number, y: number, h: number, sy: number, hx: number, hy: number, shW: number): Crease[] {
  const X = (u: number) => x + u * h, Y = (u: number) => y + u * h;
  return [
    { x0: X(shW * 0.85), y0: sy + h * 0.09, x1: X(shW * 1.05), y1: Y(-0.5), r: h * 0.02, a: 0.3 },
    { x0: X(-shW * 0.95), y0: Y(-0.47), x1: X(shW * 1.05), y1: Y(-0.47), r: h * 0.02, a: 0.3 },
    { x0: hx - h * 0.09, y0: hy + h * 0.13, x1: hx + h * 0.09, y1: hy + h * 0.13, r: h * 0.02, a: 0.35 },
    { x0: X(-0.04), y0: Y(-0.44), x1: X(-0.08), y1: Y(-0.1), r: h * 0.018, a: 0.2 },
  ];
}

/** The dark hollow under a cowl: a lumpy void with no line, a shade paler toward its rim. */
function faceVoid(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, seed: number): void {
  ctx.beginPath(); appendCurve(ctx, lumpy(ring(cx, cy, rx, ry, 9), 0.06, seed, 2));
  if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }
  const g = ctx.createRadialGradient(cx, cy + ry * 0.2, 0, cx, cy, Math.max(rx, ry) * 1.1);
  g.addColorStop(0, VOID); g.addColorStop(0.7, VOID); g.addColorStop(1, mix(VOID, '#3a2c3a', 0.4));
  ctx.fillStyle = g; ctx.fill();
}

/**
 * Two ember eyes, each on a glow; `slit` makes them the narrow slits of a mask. They must read as a
 * PAIR: `glowK` keeps each halo small enough that the two do not merge into one smear, which is
 * what made the hooded cultist look as though it had a single eye.
 */
function emberEyes(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, r: number, pulse: number, slit = false, glowK = 3.2): void {
  glow(ctx, B, x0, y0, r * glowK, EMBER, 0.45 + 0.3 * pulse, HOT);
  glow(ctx, B, x1, y1, r * glowK, EMBER, 0.45 + 0.3 * pulse, HOT);
  if (slit) {
    ctx.fillStyle = B.col(EMBER);
    ctx.beginPath(); ctx.ellipse(x0, y0, r * 1.6, Math.max(0.8, r * 0.7), 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x1, y1, r * 1.6, Math.max(0.8, r * 0.7), -0.15, 0, Math.PI * 2); ctx.fill();
  } else { eye(ctx, x0, y0, r, EMBER, false); eye(ctx, x1, y1, r, EMBER, false); }
  if (!B.override && r >= 1.6) { ctx.fillStyle = HOT; ctx.fillRect(Math.round(x0 - r * 0.3), Math.round(y0 - r * 0.3), 1, 1); ctx.fillRect(Math.round(x1 - r * 0.3), Math.round(y1 - r * 0.3), 1, 1); }
}

/**
 * The adept's half-mask: a smooth brow over two slits with ember light behind them, cheeks falling
 * to a defined chin. Shaped rather than a pale patch, so the hood reads as holding a face.
 */
function halfMask(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, bone: string, h: number, pulse: number): void {
  blob(ctx, B, bone, [{ k: 'curve', pts: [
    cx - r * 0.94, cy - r * 0.22, cx - r * 0.78, cy - r * 0.86, cx, cy - r * 1.04, cx + r * 0.8, cy - r * 0.84, cx + r * 0.96, cy - r * 0.2,
    cx + r * 0.88, cy + r * 0.4, cx + r * 0.5, cy + r * 1.0, cx + r * 0.06, cy + r * 1.3, cx - r * 0.46, cy + r * 0.98, cx - r * 0.86, cy + r * 0.38,
  ], wobble: 0.02, seed: 49, sub: 2 }], { h, formK: 0.7, gloss: 0.3, spread: 0.5 });
  // Planes, not a patch of paint: a lit brow ridge, the shadow it throws, hollow cheeks, a lit chin.
  lit2(ctx, bone, [{ k: 'cap', x0: cx - r * 0.56, y0: cy - r * 0.62, x1: cx + r * 0.52, y1: cy - r * 0.6, r0: r * 0.2 }], 0.38);
  shade2(ctx, bone, [{ k: 'cap', x0: cx - r * 0.74, y0: cy - r * 0.08, x1: cx + r * 0.76, y1: cy - r * 0.06, r0: r * 0.26 }], 0.52);
  shade2(ctx, bone, [{ k: 'cap', x0: cx - r * 0.8, y0: cy + r * 0.12, x1: cx - r * 0.5, y1: cy + r * 0.78, r0: r * 0.2 }], 0.34);
  shade2(ctx, bone, [{ k: 'cap', x0: cx + r * 0.82, y0: cy + r * 0.14, x1: cx + r * 0.54, y1: cy + r * 0.78, r0: r * 0.2 }], 0.34);
  // The nose ridge: a lit edge with its shadow beside it.
  lit2(ctx, bone, [{ k: 'cap', x0: cx - r * 0.06, y0: cy + r * 0.04, x1: cx - r * 0.04, y1: cy + r * 0.38, r0: r * 0.09 }], 0.5);
  shade2(ctx, bone, [{ k: 'cap', x0: cx + r * 0.12, y0: cy + r * 0.04, x1: cx + r * 0.09, y1: cy + r * 0.4, r0: r * 0.1 }], 0.42);
  // The chin: a shadow above it, the light on it.
  shade2(ctx, bone, [{ k: 'cap', x0: cx - r * 0.3, y0: cy + r * 0.66, x1: cx + r * 0.32, y1: cy + r * 0.64, r0: r * 0.14 }], 0.42);
  lit2(ctx, bone, [{ k: 'ell', x: cx - r * 0.04, y: cy + r * 0.92, rx: r * 0.3, ry: r * 0.2 }], 0.45);
  // The slits, cut black through the mask, with the embers burning behind them.
  ctx.fillStyle = B.col(VOID);
  ctx.beginPath(); ctx.ellipse(cx - r * 0.46, cy - r * 0.26, r * 0.36, r * 0.19, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + r * 0.48, cy - r * 0.24, r * 0.36, r * 0.19, 0.2, 0, Math.PI * 2); ctx.fill();
  emberEyes(ctx, cx - r * 0.46, cy - r * 0.26, cx + r * 0.48, cy - r * 0.24, r * 0.14, pulse, true, 2.2);
  if (h >= 46) softLine(ctx, B, [cx - r * 0.3, cy + r * 0.56, cx + r * 0.32, cy + r * 0.54], bone, Math.max(1, r * 0.14), 0.55);
}

/** Hands as small lumpy skin masses (near, far); each entry is [x, y, r]. */
function hands(ctx: CanvasRenderingContext2D, h: number, skin: string, ...hs: [number, number, number][]): void {
  // One blob PER hand. In a single blob the gradient runs across the union of both, so a hand out
  // on the far side of the figure sits at the shadow end of the ramp and renders as a grey lump
  // while its pair, a body's width away, renders as skin.
  hs.forEach(([x, y, r], i) => {
    blob(ctx, B, skin, [{ k: 'curve', pts: ring(x, y, r, r * 0.9, 7), wobble: 0.07, seed: 80 + i, sub: 2 }], { h, formK: 0.5 });
  });
}

/**
 * Fingers closed round a shaft: bands across the hand, perpendicular to the shaft's axis `a`, so
 * the hand reads as gripping the thing under it rather than resting beside it.
 */
function fingers(ctx: CanvasRenderingContext2D, h: number, skin: string, cx: number, cy: number, r: number, a: number): void {
  if (h < 30) return;
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, w = Math.max(1, h * 0.009);
  for (let i = -1; i <= 1; i++) {
    const px = cx + ux * r * i * 0.6, py = cy + uy * r * i * 0.6;
    softLine(ctx, B, [px - nx * r * 0.95, py - ny * r * 0.95, px + nx * r * 0.95, py + ny * r * 0.95], skin, w, 0.5);
  }
}

/** Where the thumb sits for a hand of radius r closed on a shaft at angle `a`: [x, y, r] for hands(). */
function thumb(cx: number, cy: number, r: number, a: number): [number, number, number] {
  return [cx + Math.cos(a) * r * 0.5 + Math.sin(a) * r * 0.42, cy + Math.sin(a) * r * 0.5 - Math.cos(a) * r * 0.42, r * 0.44];
}

/** The soft dark a limb or a mantle throws on the cloth behind it, laid inside the mass, no line. */
function shade2(ctx: CanvasRenderingContext2D, hex: string, parts: readonly Part[], a = 0.4): void {
  patch(ctx, B, mix(hex, '#000000', 0.66), parts, { alpha: a, feather: 0.75 });
}

/** The matching light: a soft pale plane inside a mass, for a brow, a cheek, a chin, a lit sleeve. */
function lit2(ctx: CanvasRenderingContext2D, hex: string, parts: readonly Part[], a = 0.4): void {
  patch(ctx, B, mix(hex, '#ffffff', 0.32), parts, { alpha: a * 0.72, feather: 0.9 });
}

/**
 * A limb that shares its mass with the cloth around it: a deep line down its shaded side and a pale
 * ridge along its lit side. Without these a sleeve unioned into the robe has no edge at all and the
 * figure reads as a bell with a hand floating beside it.
 */
function sleeveEdge(ctx: CanvasRenderingContext2D, h: number, hex: string, x0: number, y0: number, x1: number, y1: number, r: number, k = 1): void {
  if (B.override || h < 26) return;
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len, ny = dx / len;
  if (nx * B.light.x + ny * B.light.y < 0) { nx = -nx; ny = -ny; }
  patch(ctx, B, mix(hex, '#000000', 0.62), [{ k: 'cap', x0: x0 - nx * r * 0.58, y0: y0 - ny * r * 0.58, x1: x1 - nx * r * 0.52, y1: y1 - ny * r * 0.52, r0: r * 0.46, r1: r * 0.4 }], { alpha: 0.52 * k, feather: 0.85 });
  patch(ctx, B, mix(hex, '#ffffff', 0.3), [{ k: 'cap', x0: x0 + nx * r * 0.46, y0: y0 + ny * r * 0.46, x1: x1 + nx * r * 0.42, y1: y1 + ny * r * 0.42, r0: r * 0.36, r1: r * 0.3 }], { alpha: 0.3 * k, feather: 0.92 });
}

/**
 * Drape: folds fanning out and down from the point where the cloth is gathered (a belt, a shoulder,
 * a grip). Each fold is a soft shadow line with a paler ridge beside it, which is what makes a robe
 * read as hanging cloth instead of a painted cone. Seeds are fixed, never from the frame.
 */
function drape(ctx: CanvasRenderingContext2D, h: number, hex: string, ox: number, oy: number, halfW: number, len: number, n: number, seed: number, curve = 0.7, a = 0.3): void {
  if (h < 34 || B.override) return;
  const w = Math.max(1, h * 0.013), pale = mix(hex, '#ffffff', 0.26);
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : (i / (n - 1) - 0.5) * 2, j = (rnd(seed, i, 1) - 0.5) * 0.3;
    const ex = ox + (t + j) * halfW, ey = oy + len * (0.8 + rnd(seed, i, 2) * 0.4);
    const mx = ox + (t + j) * halfW * curve, my = oy + len * 0.45;
    const pts = [ox + t * halfW * 0.1, oy, mx, my, ex, ey];
    softLine(ctx, B, pts, hex, w, a);
    softLine(ctx, B, pts.map((v, k) => k % 2 ? v : v - w * 1.1), pale, w * 0.6, a * 0.38);
  }
}

/** A wooden staff, slightly knotted, lit across. */
function staff(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, h: number, wood: string): void {
  glossTaper(ctx, B, x0, y0, x1, y1, h * 0.018, h * 0.014, wood);
  if (h >= 50) softLine(ctx, B, [x0 + (x1 - x0) * 0.3 - h * 0.012, y0 + (y1 - y0) * 0.3, x0 + (x1 - x0) * 0.3 + h * 0.012, y0 + (y1 - y0) * 0.32], wood, 1, 0.5);
}

/** The ash sigil: a circle with a cut through it, stroked in ash. */
function sigil(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, ash: string, h: number): void {
  ctx.strokeStyle = B.col(ash); ctx.lineWidth = Math.max(1, h * 0.012); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI * 0.35, Math.PI * 1.45); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + r * 0.9, cy - r * 1.05); ctx.lineTo(cx - r * 0.5, cy + r * 0.55); ctx.stroke();
}

/** The skull painted in ash on a shaved head: a pale mask of paint, dark sockets, a nose hole, a row of teeth. */
function skullPaint(ctx: CanvasRenderingContext2D, hx: number, hy: number, r: number, ash: string, h: number, pulse: number): void {
  blob(ctx, B, ash, [{ k: 'curve', pts: [hx - r * 0.72, hy - r * 0.42, hx - r * 0.3, hy - r * 0.62, hx + r * 0.3, hy - r * 0.6, hx + r * 0.74, hy - r * 0.38, hx + r * 0.66, hy + r * 0.45, hx + r * 0.3, hy + r * 0.92, hx - r * 0.3, hy + r * 0.92, hx - r * 0.66, hy + r * 0.45], wobble: 0.06, seed: 90, sub: 2 }], { h, outline: false, formK: 0.25 });
  ctx.fillStyle = B.col(VOID);
  ctx.beginPath(); ctx.ellipse(hx - r * 0.36, hy - r * 0.12, r * 0.3, r * 0.27, -0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + r * 0.38, hy - r * 0.1, r * 0.31, r * 0.28, 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx - r * 0.12, hy + r * 0.45); ctx.lineTo(hx + r * 0.03, hy + r * 0.2); ctx.lineTo(hx + r * 0.15, hy + r * 0.45); ctx.closePath(); ctx.fill();
  emberEyes(ctx, hx - r * 0.36, hy - r * 0.1, hx + r * 0.38, hy - r * 0.08, r * 0.12, pulse);
  if (r >= 8) {
    softLine(ctx, B, [hx - r * 0.45, hy + r * 0.68, hx + r * 0.45, hy + r * 0.66], ash, Math.max(1, r * 0.08), 0.7);
    for (let i = -2; i <= 2; i++) softLine(ctx, B, [hx + i * r * 0.18, hy + r * 0.56, hx + i * r * 0.18, hy + r * 0.8], ash, 1, 0.6);
  }
}

/** A curved sacrificial knife from the hand at (x, y), blade sweeping at angle `a`; `flip` mirrors the curve. */
function knife(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, len: number, steel: string, grip: string, flip: boolean): void {
  const c = Math.cos(a), s = Math.sin(a), f = flip ? -1 : 1;
  const P = (u: number, v: number) => [x + (u * c - v * s) * len, y + (u * s + v * c) * len];
  const pts = [...P(0, -0.05 * f), ...P(0.35, -0.02 * f), ...P(0.75, 0.15 * f), ...P(1.0, 0.45 * f), ...P(0.85, 0.2 * f), ...P(0.55, 0.08 * f), ...P(0.3, 0.1 * f), ...P(0, 0.09 * f)];
  glossPoly(ctx, B, pts, steel, { gloss: 0.7, spread: 0.6 });
  // A honed edge: the brightest value on the sprite, so the weapon and not the bandage wins the eye.
  ctx.strokeStyle = B.col(mix(steel, '#ffffff', 0.82)); ctx.lineWidth = Math.max(1, len * 0.035); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(...(P(0.06, -0.042 * f) as [number, number]));
  ctx.quadraticCurveTo(...(P(0.42, -0.015 * f) as [number, number]), ...(P(0.74, 0.14 * f) as [number, number]));
  ctx.lineTo(...(P(0.96, 0.41 * f) as [number, number])); ctx.stroke();
  glossTaper(ctx, B, x, y, x - c * len * 0.3, y - s * len * 0.3, len * 0.07, len * 0.06, grip);
}

/** A glowing rune band around a cuff: an ember arc across the sleeve with a glow under it. */
function runeBand(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rot: number, h: number, pulse: number): void {
  glow(ctx, B, cx, cy, rx * 1.6, EMBER, 0.25 + 0.15 * pulse, EMBER);
  if (B.override) return;
  ctx.strokeStyle = rgba(EMBER, 0.75 + 0.25 * pulse); ctx.lineWidth = Math.max(1, h * 0.012); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
  if (h >= 60) for (let i = -1; i <= 1; i++) { const px = cx + i * rx * 0.45, py = cy + ry * 0.7; ctx.beginPath(); ctx.moveTo(px, py - h * 0.012); ctx.lineTo(px + h * 0.004, py + h * 0.006); ctx.stroke(); }
}

/** A row of small ember runes along a polyline (a mantle's edge), each on a faint glow. */
function runeRow(ctx: CanvasRenderingContext2D, pts: number[], h: number, pulse: number): void {
  if (B.override) return;
  const n = pts.length / 2, k = Math.max(1, h * 0.012);
  ctx.strokeStyle = rgba(EMBER, 0.7 + 0.3 * pulse); ctx.lineWidth = Math.max(1, h * 0.01); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const px = pts[i * 2], py = pts[i * 2 + 1];
    if (h < 60) { ctx.fillStyle = rgba(EMBER, 0.9); ctx.fillRect(Math.round(px) - 1, Math.round(py) - 1, 2, 2); continue; }
    glow(ctx, B, px, py, k * 3, EMBER, 0.2 + 0.15 * pulse, EMBER);
    ctx.beginPath();
    if (i % 3 === 0) { ctx.moveTo(px - k, py - k); ctx.lineTo(px + k, py + k); ctx.moveTo(px + k, py - k); ctx.lineTo(px - k, py + k); }
    else if (i % 3 === 1) { ctx.moveTo(px, py - k * 1.3); ctx.lineTo(px, py + k * 1.3); ctx.moveTo(px - k, py); ctx.lineTo(px + k, py - k * 0.6); }
    else { ctx.moveTo(px - k, py + k); ctx.lineTo(px, py - k * 1.2); ctx.lineTo(px + k, py + k); }
    ctx.stroke();
  }
}

/** A small flame standing on a palm: a glow, a spiky ember tongue, a hot core; it flickers with the frame. */
function flame(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, h: number, frame: number): void {
  glow(ctx, B, cx, cy - size * 0.35, size * 1.3, EMBER, 0.5, HOT);
  if (B.override) return;
  const lean = Math.sin(frame / 5) * size * 0.12;
  const tongue = (sz: number, col: string, a: number) => {
    ctx.fillStyle = rgba(col, a);
    ctx.beginPath();
    ctx.moveTo(cx - sz * 0.3, cy);
    ctx.quadraticCurveTo(cx - sz * 0.42, cy - sz * 0.5, cx - sz * 0.08 + lean * 0.5, cy - sz * 0.7);
    ctx.quadraticCurveTo(cx + sz * 0.02 + lean, cy - sz * 0.9, cx + sz * 0.06 + lean * 1.3, cy - sz * 1.15);
    ctx.quadraticCurveTo(cx + sz * 0.2 + lean * 0.6, cy - sz * 0.75, cx + sz * 0.36, cy - sz * 0.5);
    ctx.quadraticCurveTo(cx + sz * 0.42, cy - sz * 0.2, cx + sz * 0.3, cy);
    ctx.closePath(); ctx.fill();
  };
  tongue(size, EMBER, 0.95);
  tongue(size * 0.55, HOT, 0.9);
  void h;
}

/** The long ritual chisel-blade: a straight steel blade with a bevelled flat tip, a dark grip, an ember rune down the fuller. */
function chisel(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, h: number, steel: string, grip: string, pulse: number): void {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux, w = h * 0.026;
  const P = (t: number, s: number) => [x0 + ux * len * t + nx * w * s, y0 + uy * len * t + ny * w * s];
  glossPoly(ctx, B, [...P(0, 1), ...P(0.92, 1.05), ...P(1.0, -0.2), ...P(0.9, -0.9), ...P(0, -0.85)], steel, { gloss: 0.6, spread: 0.6 });
  glossTaper(ctx, B, x0, y0, x0 - ux * h * 0.13, y0 - uy * h * 0.13, w * 0.75, w * 0.6, grip);
  glossBall(ctx, B, x0 - ux * h * 0.14, y0 - uy * h * 0.14, w * 0.9, grip, { gloss: 0.3 });
  if (B.override) return;
  glow(ctx, B, x0 + ux * len * 0.45, y0 + uy * len * 0.45, len * 0.2, EMBER, 0.2 + 0.15 * pulse, EMBER);
  ctx.strokeStyle = rgba(EMBER, 0.7 + 0.3 * pulse); ctx.lineWidth = Math.max(1, w * 0.3); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...(P(0.12, 0.1) as [number, number])); ctx.lineTo(...(P(0.8, 0.1) as [number, number])); ctx.stroke();
}

/** Embers rising round the figure and ash flecks lifting off the hem; fixed lanes, phase from the frame. */
function embers(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, frame: number, n: number, ash: number): void {
  if (B.override) return;
  for (let i = 0; i < n + ash; i++) {
    const isAsh = i >= n, lane = rnd(i, 1, 1), speed = 0.45 + rnd(i, 2, 1) * 0.5;
    const t = ((frame / 60) * speed * 0.35 + rnd(i, 3, 1)) % 1;
    const px = x + (lane - 0.5) * h * (isAsh ? 0.8 : 0.9) + Math.sin(frame / 11 + i) * h * 0.02;
    const py = y - h * (isAsh ? 0.03 + t * 0.35 : 0.1 + t * 0.85);
    const a = isAsh ? 0.5 * (1 - t) : Math.sin(t * Math.PI);
    const r = Math.max(0.8, h * (isAsh ? 0.01 : 0.011) * (0.6 + rnd(i, 4, 1) * 0.8));
    if (!isAsh && h >= 60) glow(ctx, B, px, py, r * 3.5, EMBER, 0.35 * a, EMBER);
    ctx.fillStyle = isAsh ? rgba('#a8a09c', a) : rgba(t < 0.5 ? HOT : EMBER, 0.6 + 0.4 * a);
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
  }
}

// ------------------------------------------------------------------ local geometry ----

/** Stable 0..1 noise (the same mix as gloss.ts uses, kept local). */
function rnd(a: number, b: number, c: number): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/** A lumpy ring of n points around (cx, cy). */
function ring(cx: number, cy: number, rx: number, ry: number, n: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/**
 * A bending tapered tube along a spine, as a smooth closed curve part. Local stand-in for the
 * toolkit's 'tube' (the same one wolf.ts carries): gloss.ts's tubeOutline sweeps both end caps
 * from the wrong side, so nonzero filling leaves a half-disc notch at every cap. This one walks
 * left side, end cap, right side, start cap in order.
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

// ------------------------------------------------------------------ the robe on a body ----

/**
 * A robe, hung on the frame rather than drawn where a body would be. It takes its shoulders from
 * the TOP of the deltoid (put them on the joint and the cloth dips to meet it and rises again
 * outboard: a shelf with a lump on it), follows the trunk in to the belt, and only then falls free
 * and flares. Run straight from the shoulders to the floor and it is a cone — and a cone has no
 * waist, no hip and no shoulder, so the arms appear to come out of the sides of a traffic cone,
 * which is what all four of these were wearing.
 *
 * `beltY` is where the cord gathers it, `hemY` where it ends, `flare` how fast the skirt opens
 * below the belt (per unit of h fallen). The hem is walked in five points with a little rise and
 * fall between them, because cloth breaks over feet instead of ending on an arc.
 */
function robePart(R: Rig, beltY: number, hemY: number, flare: number, seed: number, tatter = 0.03): Part {
  const { x, sy, h } = R, n = R.sNear, f = R.sFar;
  const a = sy + h * 0.055, drop = hemY - beltY;
  const W = (yy: number) => trunkW(R, yy) + h * 0.008;
  const hemW = W(beltY) + drop * flare;
  const pts: number[] = [
    f.x - h * 0.014, f.y - h * 0.04,
    x - h * 0.1, sy - h * 0.016,
    x - h * 0.046, sy - h * 0.056,
    x + h * 0.054, sy - h * 0.056,
    x + h * 0.108, sy - h * 0.016,
    n.x + h * 0.016, n.y - h * 0.044,
    x + W(a), a,
    x + W(R.waistY), R.waistY,
    x + W(beltY) + h * 0.004, beltY,
    x + hemW * 0.62, beltY + drop * 0.55,
    x + hemW, hemY - h * 0.012,
  ];
  // The hem, walked from the near side back to the far one, breaking as it goes.
  for (let i = 1; i <= 4; i++) {
    const t = i / 5, wob = (i % 2 ? -1 : 1) * h * 0.014;
    pts.push(x + hemW * (1 - 2 * t) * FAR, hemY + wob);
  }
  pts.push(
    x - hemW * FAR, hemY - h * 0.01,
    x - hemW * 0.6 * FAR, beltY + drop * 0.55,
    x - (W(beltY) + h * 0.004) * FAR, beltY,
    x - W(R.waistY) * FAR, R.waistY,
    x - W(a) * FAR, a,
  );
  return { k: 'curve', pts, wobble: 0.024, spiky: tatter, seed, sub: 3 };
}

/** The cowl: a hood around the head, peaked at the back and open at the face. */
function cowlPart(R: Rig, k: number, seed: number): Part {
  const { hx, hy, hr } = R, r = hr * k;
  return { k: 'curve', pts: [
    hx - r * 1.34, hy + r * 1.5,
    hx - r * 1.46, hy + r * 0.12,
    hx - r * 1.14, hy - r * 1.02,
    hx - r * 0.42, hy - r * 1.52,
    hx + r * 0.2, hy - r * 1.72,
    hx + r * 0.86, hy - r * 1.24,
    hx + r * 1.3, hy - r * 0.5,
    hx + r * 1.44, hy + r * 0.34,
    hx + r * 1.34, hy + r * 1.5,
  ], wobble: 0.04, spiky: 0.02, seed, sub: 3 };
}

/**
 * A bare foot under a hem: a heel, an arch pinched above it and a sole running out to the toes.
 * Half of it is under the cloth, so only the front two thirds have to carry the read — but drawn
 * as a plain ellipse, which is what these four had, it reads as a pebble.
 */
function footPart(R: Rig, ankle: Pt, out: number, seed: number): Part {
  const { h } = R, y = R.y, s = out >= 0 ? 1 : -1;
  const toe = h * (0.072 + 0.03 * Math.abs(out));
  const pts = [
    -h * 0.03, y - h * 0.072,
    h * 0.026, y - h * 0.066,
    h * 0.042, y - h * 0.034,   // the instep, falling away to the toes
    toe * 0.78, y - h * 0.016,
    toe, y - h * 0.007,
    toe * 0.9, y,
    -h * 0.034, y,
    -h * 0.044, y - h * 0.018,
  ];
  const o: number[] = [];
  if (s > 0) for (let i = 0; i < pts.length; i += 2) o.push(ankle.x + pts[i], pts[i + 1]);
  else for (let i = pts.length - 2; i >= 0; i -= 2) o.push(ankle.x - pts[i], pts[i + 1]);
  return { k: 'curve', pts: o, wobble: 0.025, seed, sub: 2 };
}

/** The cleft between the big toe and the rest, and the shadow the hem casts across the instep. */
function footMarks(ctx: CanvasRenderingContext2D, R: Rig, ankle: Pt, out: number, skin: string): void {
  const { h } = R, y = R.y, s = out >= 0 ? 1 : -1, toe = h * (0.072 + 0.03 * Math.abs(out));
  if (h < 42) return;
  softLine(ctx, B, [ankle.x + s * toe * 0.62, y - h * 0.018, ankle.x + s * toe * 0.72, y - h * 0.001], skin, Math.max(1, h * 0.008), 0.5);
  softLine(ctx, B, [ankle.x - s * h * 0.026, y - h * 0.056, ankle.x + s * h * 0.03, y - h * 0.05], skin, Math.max(1, h * 0.012), 0.45);
}
