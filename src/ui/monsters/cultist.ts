// The Ashen cult: cultist, zealot, adept and the Hand of Ash. Painted as masses, not parts: every
// robe is ONE blob in the def's tint (gown, cowl and near sleeve together, with creases under the
// arm and at the belt and a folds texture), the far arm its own darker mass behind it, then the
// other materials (skin, bone mask, mantle, rope, leather, steel) each as their own blob, then the
// crisp details (ember eyes, sigils, runes, blades) on top. Ember orange is the cult's accent and
// is never toned: it is the light source, so every ember sits on a glow().
// Layout (units of h, y the ground line, x the centre): hem at the ground, shoulders at -0.72,
// the head at -0.86, the cowl's peak at -1.0; the figure stands three-quarter on, turned a little
// to the viewer's right, the right arm forward with the weapon.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glow, softLine, patch, glossBall, glossPoly, glossTaper, appendCurve, lumpy } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['cultist', 'zealot', 'adept', 'ashen_hand'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'zealot') zealot(ctx, x, y, h, p);
  else if (kind === 'adept') adept(ctx, x, y, h, p);
  else if (kind === 'ashen_hand') hand(ctx, x, y, h, p);
  else cultist(ctx, x, y, h, p);
};

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
  };
}

// ------------------------------------------------------------------ the rank and file ----
function cultist(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone), X = (u: number) => x + u * h, Y = (u: number) => y + u * h;
  const bob = p.breathe * h * 0.006, pulse = 0.5 + 0.5 * Math.sin(p.frame / 6), flick = Math.sin(p.frame / 3.7) * 0.5 + 0.5;
  const sy = Y(-0.72) + bob, hx = X(0.005), hy = Y(-0.855) + bob;
  groundShadow(ctx, X(0.02), y + 1, h * 0.72);

  // Where the two sleeves run: the far arm hangs, the near one is bent up across the body onto the
  // staff, so the staff is held rather than stood next to.
  const fsh = [X(-0.185), sy + h * 0.025] as const, fel = [X(-0.235), Y(-0.55)] as const, fcu = [X(-0.245), Y(-0.40)] as const;
  const nsh = [X(0.185), sy + h * 0.02] as const, nel = [X(0.272), Y(-0.45)] as const, ncu = [X(0.328), Y(-0.598)] as const;
  const gx = X(0.35), gy = Y(-0.615);

  // Bare feet under the hem, then the far (left) sleeve behind everything, its hand at the cuff.
  blob(ctx, B, m.skin, [
    { k: 'ell', x: X(-0.11), y: Y(-0.03), rx: h * 0.05, ry: h * 0.026, rot: 0.25 },
    { k: 'ell', x: X(0.1), y: Y(-0.028), rx: h * 0.052, ry: h * 0.027, rot: -0.35 },
  ], { h, formK: 0.4 });
  hands(ctx, h, m.skin, [fcu[0] - h * 0.008, fcu[1] + h * 0.038, h * 0.031]);
  blob(ctx, B, p.dark, [
    { k: 'cap', x0: fsh[0], y0: fsh[1], x1: fel[0], y1: fel[1], r0: h * 0.052, r1: h * 0.046 },
    { k: 'cap', x0: fel[0], y0: fel[1], x1: fcu[0], y1: fcu[1], r0: h * 0.046, r1: h * 0.042 },
  ], { h, formK: 0.6, creases: [
    { x0: X(-0.21), y0: Y(-0.57), x1: X(-0.245), y1: Y(-0.52), r: h * 0.016, a: 0.35 },
  ] });

  // The staff, planted and leaning in, drawn before the gripping hand so the fingers close over it.
  staff(ctx, X(0.40), Y(-0.03), X(0.305), Y(-1.0), h, m.wood);

  // The robe: gown, cowl and the near sleeve (upper arm and forearm), one mass.
  const robe: Part[] = [
    gown(x, y, h, sy, 0.185, 0.3, 1),
    cowl(hx, hy, h, 0.88, 2),
    { k: 'cap', x0: nsh[0], y0: nsh[1], x1: nel[0], y1: nel[1], r0: h * 0.056, r1: h * 0.045 },
    { k: 'cap', x0: nel[0], y0: nel[1], x1: ncu[0], y1: ncu[1], r0: h * 0.045, r1: h * 0.042 },
  ];
  blob(ctx, B, p.base, robe, { h, tex: 'folds', seed: 3, amount: 0.7, formK: 0.62, creases: robeCreases(x, y, h, sy, hx, hy, 0.185).concat([
    // The armholes: the notch where each sleeve leaves the body.
    { x0: X(0.15), y0: sy + h * 0.045, x1: X(0.14), y1: Y(-0.52), r: h * 0.024, a: 0.42 },
    { x0: X(-0.14), y0: sy + h * 0.04, x1: X(-0.13), y1: Y(-0.55), r: h * 0.022, a: 0.35 },
    { x0: X(0.248), y0: Y(-0.475), x1: X(0.29), y1: Y(-0.535), r: h * 0.026, a: 0.35 },
  ]) });
  // The robe darkens where it runs behind the raised forearm, and each sleeve keeps its own edges.
  shade2(ctx, p.base, [{ k: 'cap', x0: X(0.13), y0: sy + h * 0.06, x1: X(0.16), y1: Y(-0.47), r0: h * 0.042 }], 0.45);
  sleeveEdge(ctx, h, p.base, nsh[0], nsh[1], nel[0], nel[1], h * 0.05);
  sleeveEdge(ctx, h, p.base, nel[0], nel[1], ncu[0], ncu[1], h * 0.044);
  // Drape: folds falling from the shoulders and radiating from the belt.
  drape(ctx, h, p.base, X(-0.09), sy + h * 0.05, h * 0.07, h * 0.16, 3, 51, 0.5, 0.28);
  drape(ctx, h, p.base, X(0.0), Y(-0.47), h * 0.2, h * 0.4, 5, 52, 0.8, 0.28);

  // The face: a dark void under the cowl, a matched pair of embers set deep in it.
  faceVoid(ctx, hx, hy + h * 0.02, h * 0.07, h * 0.082, 4);
  emberEyes(ctx, hx - h * 0.036, hy + h * 0.008, hx + h * 0.036, hy + h * 0.008, h * 0.015, pulse, false, 2.1);

  // Rope belt with a knot and two hanging ends.
  blob(ctx, B, m.rope, [
    tube([X(-0.2), Y(-0.5), X(0), Y(-0.48), X(0.2), Y(-0.51)], h * 0.014, h * 0.014, 0.1, 5),
    { k: 'ball', x: X(0.03), y: Y(-0.485), r: h * 0.022 },
    tube([X(0.02), Y(-0.48), X(-0.005), Y(-0.37)], h * 0.011, h * 0.009, 0.1, 6),
    tube([X(0.05), Y(-0.48), X(0.075), Y(-0.39)], h * 0.011, h * 0.009, 0.1, 7),
  ], { h, formK: 0.5 });

  // The near hand closed round the shaft, then the ember at the staff's head.
  hands(ctx, h, m.skin, [gx - h * 0.006, gy, h * 0.037]);
  fingers(ctx, h, m.skin, gx, gy, h * 0.037, Math.atan2(Y(-1.0) - Y(-0.03), X(0.305) - X(0.40)));
  glow(ctx, B, X(0.31), Y(-1.0), h * (0.08 + 0.02 * flick), EMBER, 0.45 + 0.2 * pulse, HOT);
  glossBall(ctx, B, X(0.31), Y(-1.0), h * 0.028, EMBER, { gloss: 0.7 });
}

// ------------------------------------------------------------------ the fighter ----
function zealot(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone), X = (u: number) => x + u * h, Y = (u: number) => y + u * h;
  const bob = p.breathe * h * 0.007, pulse = 0.5 + 0.5 * Math.sin(p.frame / 6);
  const sway = Math.sin(p.frame / 20) * h * 0.008;
  const sy = Y(-0.71) + bob, hx = X(0.02) + sway * 0.5, hy = Y(-0.845) + bob;
  groundShadow(ctx, X(0.0), y + 1, h * 0.8);

  // Bare feet planted wide, and the near leg striding out of the robe's slit: thigh, knee, shin, foot.
  blob(ctx, B, m.skin, [
    { k: 'ell', x: X(-0.19), y: Y(-0.03), rx: h * 0.055, ry: h * 0.027, rot: 0.4 },
    tube([X(0.095), Y(-0.44), X(0.15), Y(-0.29), X(0.165), Y(-0.19), X(0.19), Y(-0.065)], h * 0.058, h * 0.036, 0.03, 10),
    { k: 'ell', x: X(0.215), y: Y(-0.028), rx: h * 0.058, ry: h * 0.028, rot: -0.3 },
  ], { h, formK: 0.55, creases: [
    { x0: X(0.115), y0: Y(-0.305), x1: X(0.175), y1: Y(-0.285), r: h * 0.016, a: 0.4 },
    { x0: X(0.145), y0: Y(-0.085), x1: X(0.185), y1: Y(-0.075), r: h * 0.014, a: 0.35 },
  ] });
  // The knee-cap and the shin's lit edge, so the leg is a leg and not a pale wedge.
  if (h >= 46) {
    softLine(ctx, B, [X(0.128), Y(-0.325), X(0.172), Y(-0.31)], m.skin, Math.max(1, h * 0.012), 0.45);
    softLine(ctx, B, [X(0.168), Y(-0.245), X(0.182), Y(-0.105)], mix(m.skin, '#ffffff', 0.5), Math.max(1, h * 0.011), 0.3);
  }
  const robe: Part[] = [
    { k: 'curve', pts: [
      // Narrow at the neck, out over the shoulders, in at the waist, then the skirt swings open.
      X(-0.075), sy - h * 0.04, X(0.085), sy - h * 0.04,
      X(0.16), sy + h * 0.005, X(0.185), sy + h * 0.075,
      X(0.16), Y(-0.56), X(0.135), Y(-0.48),
      X(0.245), Y(-0.29), X(0.345), Y(-0.08), X(0.285), Y(-0.07),
      // The slit the near leg strides through.
      X(0.2), Y(-0.24), X(0.105), Y(-0.37), X(0.05), Y(-0.16), X(0.0), Y(-0.07),
      X(-0.16), Y(-0.06), X(-0.345), Y(-0.07), X(-0.29), Y(-0.29), X(-0.145), Y(-0.48),
      X(-0.17), Y(-0.56), X(-0.195), sy + h * 0.075, X(-0.17), sy + h * 0.005,
    ], wobble: 0.03, spiky: 0.08, seed: 11, sub: 3 },
    { k: 'curve', pts: [hx - h * 0.17, hy + h * 0.15, hx - h * 0.16, hy + h * 0.02, hx - h * 0.06, hy - h * 0.02, hx + h * 0.05, hy - h * 0.03, hx + h * 0.16, hy + h * 0.02, hx + h * 0.18, hy + h * 0.15], wobble: 0.06, spiky: 0.05, seed: 12, sub: 3 },
  ];
  blob(ctx, B, p.base, robe, { h, tex: 'folds', seed: 13, amount: 0.8, formK: 0.5, creases: [
    { x0: X(-0.16), y0: Y(-0.49), x1: X(0.16), y1: Y(-0.49), r: h * 0.02, a: 0.3 },
    { x0: X(-0.14), y0: sy + h * 0.025, x1: X(0.14), y1: sy + h * 0.025, r: h * 0.022, a: 0.3 },
    // Deep shadow where the robe passes behind each shoulder and behind the near thigh.
    { x0: X(-0.15), y0: sy + h * 0.02, x1: X(-0.17), y1: Y(-0.55), r: h * 0.022, a: 0.35 },
    { x0: X(0.13), y0: sy + h * 0.02, x1: X(0.15), y1: Y(-0.55), r: h * 0.022, a: 0.35 },
    { x0: X(0.075), y0: Y(-0.42), x1: X(0.12), y1: Y(-0.2), r: h * 0.026, a: 0.35 },
  ] });
  // Drape: folds off each shoulder, and the skirt fanning from the belt.
  drape(ctx, h, p.base, X(-0.1), sy + h * 0.05, h * 0.07, h * 0.15, 2, 22, 0.5, 0.28);
  drape(ctx, h, p.base, X(0.09), sy + h * 0.05, h * 0.06, h * 0.14, 2, 23, 0.5, 0.28);
  drape(ctx, h, p.base, X(-0.03), Y(-0.47), h * 0.24, h * 0.36, 5, 24, 0.75, 0.3);
  // Leather belt.
  blob(ctx, B, m.leather, [
    tube([X(-0.15), Y(-0.5), X(0), Y(-0.477), X(0.145), Y(-0.5)], h * 0.018, h * 0.018, 0.05, 14),
    { k: 'ball', x: X(0.02), y: Y(-0.485), r: h * 0.024 },
    tube([X(0.04), Y(-0.475), X(0.075), Y(-0.36)], h * 0.012, h * 0.009, 0.08, 25),
  ], { h, formK: 0.5 });
  // The ash sigil on the chest: a circle with a cut through it.
  sigil(ctx, X(0.02), Y(-0.6), h * 0.05, m.ash, h);

  // Skin: shaved head, neck, both bare arms and the hands, one mass. Right arm raised with a knife,
  // the left low and out with the other.
  const rr = h * 0.105;
  const skin: Part[] = [
    { k: 'curve', pts: ring(hx, hy, rr, rr * 1.06, 10), wobble: 0.035, seed: 15, sub: 2 },
    { k: 'cap', x0: hx, y0: hy + rr * 0.5, x1: hx - h * 0.005, y1: sy + h * 0.02, r0: h * 0.042, r1: h * 0.05 },
    tube([X(0.15), sy + h * 0.05, X(0.29), Y(-0.7), X(0.3) + sway, Y(-0.9)], h * 0.05, h * 0.04, 0.04, 16),
    tube([X(-0.15), sy + h * 0.05, X(-0.29), Y(-0.58), X(-0.34) - sway, Y(-0.44)], h * 0.05, h * 0.04, 0.04, 17),
    { k: 'curve', pts: ring(X(0.3) + sway, Y(-0.93), h * 0.036, h * 0.034, 7), wobble: 0.06, seed: 18, sub: 2 },
    { k: 'curve', pts: ring(X(-0.35) - sway, Y(-0.43), h * 0.036, h * 0.033, 7), wobble: 0.06, seed: 19, sub: 2 },
  ];
  blob(ctx, B, m.skin, skin, { h, formK: 0.55, creases: [
    { x0: hx - rr * 0.35, y0: hy + rr * 0.85, x1: hx + rr * 0.35, y1: hy + rr * 0.85, r: h * 0.018, a: 0.4 },
    { x0: X(0.17), y0: sy + h * 0.08, x1: X(0.22), y1: sy + h * 0.02, r: h * 0.015, a: 0.3 },
    { x0: X(0.28), y0: Y(-0.72), x1: X(0.31), y1: Y(-0.68), r: h * 0.014, a: 0.3 },
    { x0: X(-0.29), y0: Y(-0.6), x1: X(-0.31), y1: Y(-0.56), r: h * 0.014, a: 0.3 },
  ] });
  // Bandaged forearms.
  blob(ctx, B, m.wrap, [
    tube([X(0.29), Y(-0.71), X(0.3) + sway, Y(-0.87)], h * 0.046, h * 0.043, 0.06, 20),
    tube([X(-0.3), Y(-0.59), X(-0.34) - sway, Y(-0.47)], h * 0.046, h * 0.043, 0.06, 21),
  ], { h, formK: 0.5 });
  if (h >= 50) {
    for (let i = 0; i < 3; i++) {
      const t = 0.2 + i * 0.3;
      softLine(ctx, B, [X(0.29 - 0.045) + sway * t, Y(-0.71 - 0.16 * t) + h * 0.008, X(0.29 + 0.045) + sway * t, Y(-0.71 - 0.16 * t) - h * 0.006], m.wrap, Math.max(1, h * 0.01), 0.5);
      softLine(ctx, B, [X(-0.3 - 0.048) - sway * t, Y(-0.59 + 0.12 * t) - h * 0.006, X(-0.3 + 0.04) - sway * t, Y(-0.59 + 0.12 * t) + h * 0.01], m.wrap, Math.max(1, h * 0.01), 0.5);
    }
  }
  // The skull painted on the shaved head in ash: sockets, nose, teeth; ember eyes in the sockets.
  skullPaint(ctx, hx, hy, rr, mix(m.ash, m.skin, 0.3), h, pulse);
  // Two curved sacrificial knives.
  knife(ctx, X(0.3) + sway, Y(-0.93), -0.35, h * 0.23, m.steel, m.leather, false);
  knife(ctx, X(-0.35) - sway, Y(-0.43), 2.6, h * 0.19, m.steel, m.leather, true);
}

// ------------------------------------------------------------------ the caster ----
function adept(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone), X = (u: number) => x + u * h, Y = (u: number) => y + u * h;
  const bob = p.breathe * h * 0.006, pulse = 0.5 + 0.5 * Math.sin(p.frame / 6), flick = Math.sin(p.frame / 2.9) * 0.5 + 0.5;
  const hover = Math.sin(p.frame / 16) * h * 0.012;
  const sy = Y(-0.75) + bob, hx = X(0.0), hy = Y(-0.875) + bob;
  groundShadow(ctx, X(0.02), y + 1, h * 0.62);

  // Far (left) arm raised, palm up, behind the mantle; then the robe (gown and near sleeve).
  blob(ctx, B, p.dark, [
    { k: 'cap', x0: X(-0.17), y0: sy + h * 0.035, x1: X(-0.255), y1: Y(-0.645), r0: h * 0.052, r1: h * 0.046 },
    { k: 'cap', x0: X(-0.255), y0: Y(-0.645), x1: X(-0.298), y1: Y(-0.755), r0: h * 0.046, r1: h * 0.05 },
  ], { h, formK: 0.6, creases: [
    { x0: X(-0.232), y0: Y(-0.675), x1: X(-0.262), y1: Y(-0.62), r: h * 0.016, a: 0.35 },
  ] });
  blob(ctx, B, p.base, [
    gown(x, y, h, sy, 0.185, 0.24, 42, 0.03),
    { k: 'cap', x0: X(0.175), y0: sy + h * 0.035, x1: X(0.245), y1: Y(-0.645), r0: h * 0.052, r1: h * 0.046 },
    { k: 'cap', x0: X(0.245), y0: Y(-0.645), x1: X(0.278), y1: Y(-0.595), r0: h * 0.046, r1: h * 0.048 },
  ], { h, tex: 'folds', seed: 44, amount: 0.9, formK: 0.6, creases: [
    { x0: X(0.13), y0: sy + h * 0.08, x1: X(0.16), y1: Y(-0.5), r: h * 0.02, a: 0.3 },
    { x0: X(-0.16), y0: Y(-0.48), x1: X(0.17), y1: Y(-0.48), r: h * 0.02, a: 0.3 },
    { x0: X(-0.05), y0: Y(-0.44), x1: X(-0.09), y1: Y(-0.1), r: h * 0.018, a: 0.2 },
    // The robe passing behind the near sleeve and behind the mantle's hem.
    { x0: X(0.125), y0: sy + h * 0.045, x1: X(0.115), y1: Y(-0.58), r: h * 0.02, a: 0.34 },
    { x0: X(-0.2), y0: sy + h * 0.15, x1: X(0.2), y1: sy + h * 0.15, r: h * 0.03, a: 0.3 },
  ] });
  sleeveEdge(ctx, h, p.base, X(0.17), sy + h * 0.03, X(0.245), Y(-0.645), h * 0.048);
  // Drape: the skirt fanning from the waist, folds off the near shoulder.
  drape(ctx, h, p.base, X(-0.01), Y(-0.47), h * 0.18, h * 0.36, 5, 54, 0.75, 0.3);
  drape(ctx, h, p.base, X(0.12), Y(-0.6), h * 0.05, h * 0.11, 2, 55, 0.4, 0.26);
  // The mantle over the shoulders: a darker material, scalloped, narrow at the neck and
  // sloping out over each shoulder so the garment has a body under it.
  blob(ctx, B, mix(p.dark, m.ash, 0.3), [{ k: 'curve', pts: [
    X(-0.1), sy - h * 0.045, X(0.1), sy - h * 0.045,
    X(0.23), sy + h * 0.005, X(0.31), sy + h * 0.05,
    X(0.26), sy + h * 0.14, X(0.14), sy + h * 0.21, X(0.02), sy + h * 0.27, X(-0.12), sy + h * 0.21, X(-0.25), sy + h * 0.14,
    X(-0.31), sy + h * 0.05, X(-0.23), sy + h * 0.005,
  ], wobble: 0.035, spiky: 0.07, seed: 45, sub: 2 }], { h, tex: 'folds', seed: 46, amount: 0.8, formK: 0.45, creases: [
    { x0: X(-0.13), y0: sy - h * 0.005, x1: X(0.13), y1: sy - h * 0.005, r: h * 0.026, a: 0.3 },
  ] });
  blob(ctx, B, p.base, [cowl(hx, hy, h, 1.12, 47)], { h, formK: 0.5, creases: [{ x0: hx - h * 0.08, y0: hy + h * 0.13, x1: hx + h * 0.08, y1: hy + h * 0.13, r: h * 0.02, a: 0.35 }] });
  // Face: void, then a shaped mask over it — brow, eye slits with ember behind, a chin.
  faceVoid(ctx, hx, hy + h * 0.03, h * 0.068, h * 0.092, 48);
  halfMask(ctx, hx, hy + h * 0.012, h * 0.072, mix(m.bone, m.ash, 0.38), h, pulse);
  // Rune bands glowing on both cuffs and along the mantle's edge.
  runeBand(ctx, X(0.265), Y(-0.6), h * 0.055, h * 0.02, 0.3, h, pulse);
  runeBand(ctx, X(-0.295), Y(-0.73), h * 0.055, h * 0.02, -0.4, h, pulse);
  runeRow(ctx, [X(-0.22), sy + h * 0.13, X(-0.1), sy + h * 0.19, X(0.02), sy + h * 0.24, X(0.14), sy + h * 0.19, X(0.24), sy + h * 0.13], h, pulse);
  // The tall staff, crowned with iron prongs, and the ember orb floating above them; the near hand grips it.
  staff(ctx, X(0.3), Y(-0.02), X(0.315), Y(-0.94), h, m.wood);
  glossPoly(ctx, B, [X(0.285), Y(-0.93), X(0.27), Y(-1.0), X(0.3), Y(-0.965), X(0.315), Y(-0.925), X(0.33), Y(-0.965), X(0.36), Y(-1.0), X(0.345), Y(-0.93)], m.leather, { spread: 0.6 });
  const ox = X(0.315), oy = Y(-1.01) + hover;
  glow(ctx, B, ox, oy, h * (0.13 + 0.02 * flick), EMBER, 0.5 + 0.2 * pulse, HOT);
  glossBall(ctx, B, ox, oy, h * 0.038, EMBER, { gloss: 0.9 });
  if (!B.override) { ctx.fillStyle = HOT; ctx.beginPath(); ctx.arc(ox - h * 0.008, oy - h * 0.008, Math.max(1, h * 0.012), 0, Math.PI * 2); ctx.fill(); }
  // Hands: near on the staff, far open with a small flame standing on the palm.
  hands(ctx, h, m.skin, [X(0.3), Y(-0.6), h * 0.032], [X(-0.31), Y(-0.765), h * 0.031]);
  flame(ctx, X(-0.31), Y(-0.79), h * (0.09 + 0.03 * flick), h, p.frame);
}

// ------------------------------------------------------------------ the Hand of Ash ----
function hand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const m = mats(p.tone), X = (u: number) => x + u * h, Y = (u: number) => y + u * h;
  const bob = p.breathe * h * 0.005, pulse = 0.5 + 0.5 * Math.sin(p.frame / 6), flick = Math.sin(p.frame / 3.3) * 0.5 + 0.5;
  const sy = Y(-0.72) + bob, hx = X(0.01), hy = Y(-0.86) + bob;
  groundShadow(ctx, X(0.02), y + 1, h * 0.9);

  // The burning halo behind the shoulders, and ash pooling at the hem.
  glow(ctx, B, X(0.0), Y(-0.74), h * 0.5, EMBER, 0.32 + 0.1 * pulse, '#ffc070');
  glow(ctx, B, X(0.0), Y(-0.74), h * 0.3, '#ff6020', 0.18 + 0.1 * flick, EMBER);
  blob(ctx, B, mix(m.ash, p.base, 0.2), [{ k: 'curve', pts: [X(-0.46), Y(-0.03), X(-0.34), Y(-0.1), X(-0.1), Y(-0.08), X(0.12), Y(-0.1), X(0.34), Y(-0.09), X(0.47), Y(-0.03), X(0.2), Y(-0.02), X(-0.2), Y(-0.02)], wobble: 0.05, spiky: 0.04, seed: 61, sub: 3 }], { h, outline: false, formK: 0.3 });

  // Far (left) arm, open-handed, then the robe: a broad gown with a trailing tattered hem and the near sleeve.
  blob(ctx, B, p.dark, [
    { k: 'cap', x0: X(-0.21), y0: sy + h * 0.05, x1: X(-0.33), y1: Y(-0.595), r0: h * 0.07, r1: h * 0.062 },
    { k: 'cap', x0: X(-0.33), y0: Y(-0.595), x1: X(-0.37), y1: Y(-0.485), r0: h * 0.062, r1: h * 0.07 },
  ], { h, formK: 0.6, creases: [{ x0: X(-0.305), y0: Y(-0.625), x1: X(-0.345), y1: Y(-0.57), r: h * 0.02, a: 0.35 }] });
  blob(ctx, B, p.base, [
    gown(x, y, h, sy, 0.25, 0.38, 63, 0.09),
    { k: 'cap', x0: X(0.21), y0: sy + h * 0.05, x1: X(0.335), y1: Y(-0.615), r0: h * 0.07, r1: h * 0.062 },
    { k: 'cap', x0: X(0.335), y0: Y(-0.615), x1: X(0.375), y1: Y(-0.515), r0: h * 0.062, r1: h * 0.068 },
  ], { h, tex: 'folds', seed: 65, amount: 1.0, formK: 0.6, creases: [
    { x0: X(0.2), y0: sy + h * 0.09, x1: X(0.24), y1: Y(-0.48), r: h * 0.024, a: 0.3 },
    { x0: X(-0.24), y0: Y(-0.46), x1: X(0.25), y1: Y(-0.46), r: h * 0.022, a: 0.3 },
    { x0: X(-0.06), y0: Y(-0.42), x1: X(-0.1), y1: Y(-0.1), r: h * 0.02, a: 0.2 },
    { x0: X(0.1), y0: Y(-0.42), x1: X(0.14), y1: Y(-0.12), r: h * 0.02, a: 0.18 },
    // Deep shade where the robe runs behind the mantle and behind the near sleeve.
    { x0: X(-0.3), y0: sy + h * 0.2, x1: X(0.3), y1: sy + h * 0.2, r: h * 0.04, a: 0.35 },
    { x0: X(0.15), y0: sy + h * 0.05, x1: X(0.14), y1: Y(-0.55), r: h * 0.026, a: 0.3 },
  ] });
  // Drape: the great skirt fanning from the waist, folds falling from under the mantle.
  drape(ctx, h, p.base, X(0.0), Y(-0.46), h * 0.3, h * 0.38, 5, 74, 0.8, 0.3);
  drape(ctx, h, p.base, X(0.02), sy + h * 0.22, h * 0.24, h * 0.22, 4, 75, 0.85, 0.26);
  // The wide mantle: shouldered, and kept close to the robe in value so the embers and the mask
  // carry the contrast rather than a pale grey slab across the chest.
  blob(ctx, B, mix(p.dark, m.ash, 0.34), [{ k: 'curve', pts: [
    X(-0.12), sy - h * 0.055, X(0.12), sy - h * 0.055,
    X(0.3), sy + h * 0.005, X(0.4), sy + h * 0.06,
    X(0.34), sy + h * 0.17, X(0.18), sy + h * 0.24, X(0.02), sy + h * 0.3, X(-0.16), sy + h * 0.24, X(-0.33), sy + h * 0.17,
    X(-0.4), sy + h * 0.06, X(-0.3), sy + h * 0.005,
  ], wobble: 0.035, spiky: 0.07, seed: 66, sub: 2 }], { h, tex: 'folds', seed: 67, amount: 0.9, formK: 0.45, creases: [
    { x0: X(-0.16), y0: sy - h * 0.01, x1: X(0.16), y1: sy - h * 0.01, r: h * 0.03, a: 0.3 },
  ] });
  runeRow(ctx, [X(-0.3), sy + h * 0.15, X(-0.15), sy + h * 0.22, X(0.02), sy + h * 0.27, X(0.18), sy + h * 0.22, X(0.32), sy + h * 0.15], h, pulse);
  blob(ctx, B, p.base, [cowl(hx, hy, h, 1.3, 68)], { h, formK: 0.5, creases: [{ x0: hx - h * 0.1, y0: hy + h * 0.15, x1: hx + h * 0.1, y1: hy + h * 0.15, r: h * 0.024, a: 0.35 }] });

  // The horned ash-mask: bone, skull-like, cracked with ember light.
  faceVoid(ctx, hx, hy + h * 0.03, h * 0.085, h * 0.1, 69);
  const r = h * 0.1;
  blob(ctx, B, m.bone, [
    { k: 'curve', pts: [hx - r, hy - r * 0.3, hx - r * 0.85, hy - r * 0.9, hx, hy - r * 1.1, hx + r * 0.85, hy - r * 0.9, hx + r, hy - r * 0.3, hx + r * 0.75, hy + r * 0.5, hx + r * 0.4, hy + r * 1.05, hx - r * 0.4, hy + r * 1.05, hx - r * 0.75, hy + r * 0.5], wobble: 0.03, seed: 70, sub: 2 },
    { k: 'poly', pts: [hx - r * 0.95, hy - r * 0.5, hx - r * 1.35, hy - r * 1.2, hx - r * 1.5, hy - r * 2.0, hx - r * 1.0, hy - r * 1.4, hx - r * 0.55, hy - r * 0.95] },
    { k: 'poly', pts: [hx + r * 0.6, hy - r * 0.95, hx + r * 1.1, hy - r * 1.5, hx + r * 1.6, hy - r * 2.1, hx + r * 1.45, hy - r * 1.2, hx + r * 1.0, hy - r * 0.5] },
  ], { h, tex: 'cracks', seed: 71, amount: 0.8, formK: 0.55, gloss: 0.2, creases: [
    { x0: hx - r * 0.7, y0: hy - r * 0.55, x1: hx - r * 0.85, y1: hy - r * 0.35, r: r * 0.12, a: 0.3 },
    { x0: hx + r * 0.65, y0: hy - r * 0.6, x1: hx + r * 0.85, y1: hy - r * 0.3, r: r * 0.12, a: 0.3 },
  ] });
  // Eye holes and the nose hole, black, then the embers, then the crack of ember light.
  ctx.fillStyle = B.col(VOID);
  ctx.beginPath(); ctx.ellipse(hx - r * 0.42, hy - r * 0.1, r * 0.3, r * 0.24, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + r * 0.42, hy - r * 0.08, r * 0.32, r * 0.25, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx - r * 0.12, hy + r * 0.55); ctx.lineTo(hx + r * 0.02, hy + r * 0.25); ctx.lineTo(hx + r * 0.14, hy + r * 0.55); ctx.closePath(); ctx.fill();
  emberEyes(ctx, hx - r * 0.42, hy - r * 0.1, hx + r * 0.42, hy - r * 0.08, r * 0.13, pulse);
  if (!B.override) {
    glow(ctx, B, hx + r * 0.5, hy + r * 0.4, r * 0.7, EMBER, 0.3 + 0.2 * pulse, HOT);
    ctx.strokeStyle = rgba(EMBER, 0.8 + 0.2 * pulse); ctx.lineWidth = Math.max(1, r * 0.09); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(hx + r * 0.9, hy - r * 0.35); ctx.lineTo(hx + r * 0.7, hy); ctx.lineTo(hx + r * 0.8, hy + r * 0.3); ctx.lineTo(hx + r * 0.55, hy + r * 0.62); ctx.lineTo(hx + r * 0.6, hy + r * 0.95); ctx.stroke();
  }
  if (h >= 50) softLine(ctx, B, [hx - r * 0.35, hy + r * 0.8, hx + r * 0.35, hy + r * 0.8], m.bone, Math.max(1, r * 0.08), 0.5);

  // Backlight from the halo: a warm rim along the cowl and the shoulders.
  if (!B.override) {
    ctx.strokeStyle = rgba(EMBER, 0.28 + 0.12 * pulse); ctx.lineWidth = Math.max(1, h * 0.012); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx + h * 0.12, hy - h * 0.1); ctx.quadraticCurveTo(hx + h * 0.19, hy + h * 0.02, hx + h * 0.16, hy + h * 0.16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx - h * 0.14, hy - h * 0.08); ctx.quadraticCurveTo(hx - h * 0.19, hy + h * 0.03, hx - h * 0.17, hy + h * 0.15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0.2), sy - h * 0.04); ctx.quadraticCurveTo(X(0.36), sy, X(0.42), sy + h * 0.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(-0.2), sy - h * 0.04); ctx.quadraticCurveTo(X(-0.36), sy, X(-0.42), sy + h * 0.08); ctx.stroke();
  }
  // The long ritual chisel-blade in the near hand, pointing down and out; embers off its edge.
  chisel(ctx, X(0.38), Y(-0.55), X(0.5), Y(-0.07), h, m.steel, m.leather, pulse);
  hands(ctx, h, m.skin, [X(0.38), Y(-0.52), h * 0.038], [X(-0.385), Y(-0.435), h * 0.034]);
  // Embers drifting up around the figure, ash drifting from the hem.
  embers(ctx, x, y, h, p.frame, 6, 2);
}

// ------------------------------------------------------------------ shared forms ----

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
  ], wobble: 0.03, spiky: tatter, seed, sub: 3 };
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
  lit2(ctx, bone, [{ k: 'cap', x0: cx - r * 0.62, y0: cy - r * 0.62, x1: cx + r * 0.58, y1: cy - r * 0.6, r0: r * 0.24 }], 0.5);
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
  blob(ctx, B, skin, hs.map(([x, y, r], i) => ({ k: 'curve', pts: ring(x, y, r, r * 0.9, 7), wobble: 0.07, seed: 80 + i, sub: 2 } as Part)), { h, formK: 0.5 });
}

/**
 * Fingers closed round a shaft: bands across the hand, perpendicular to the shaft's axis `a`, so
 * the hand reads as gripping the thing under it rather than resting beside it.
 */
function fingers(ctx: CanvasRenderingContext2D, h: number, skin: string, cx: number, cy: number, r: number, a: number): void {
  if (h < 30) return;
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, w = Math.max(1, h * 0.009);
  for (let i = -1; i <= 1; i++) {
    const px = cx + ux * r * i * 0.62, py = cy + uy * r * i * 0.62;
    softLine(ctx, B, [px - nx * r * 0.95, py - ny * r * 0.95, px + nx * r * 0.95, py + ny * r * 0.95], skin, w, 0.5);
  }
  // A thumb laid over the front of the shaft.
  blob(ctx, B, skin, [{ k: 'cap', x0: cx - nx * r * 0.3 + ux * r * 0.55, y0: cy - ny * r * 0.3 + uy * r * 0.55, x1: cx + nx * r * 0.55 + ux * r * 0.2, y1: cy + ny * r * 0.55 + uy * r * 0.2, r0: r * 0.34, r1: r * 0.28 }], { h, formK: 0.5 });
}

/** The soft dark a limb or a mantle throws on the cloth behind it, laid inside the mass, no line. */
function shade2(ctx: CanvasRenderingContext2D, hex: string, parts: readonly Part[], a = 0.4): void {
  patch(ctx, B, mix(hex, '#000000', 0.66), parts, { alpha: a, feather: 0.75 });
}

/** The matching light: a soft pale plane inside a mass, for a brow, a cheek, a chin, a lit sleeve. */
function lit2(ctx: CanvasRenderingContext2D, hex: string, parts: readonly Part[], a = 0.4): void {
  patch(ctx, B, mix(hex, '#ffffff', 0.55), parts, { alpha: a, feather: 0.85 });
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
  patch(ctx, B, mix(hex, '#ffffff', 0.5), [{ k: 'cap', x0: x0 + nx * r * 0.46, y0: y0 + ny * r * 0.46, x1: x1 + nx * r * 0.42, y1: y1 + ny * r * 0.42, r0: r * 0.36, r1: r * 0.3 }], { alpha: 0.42 * k, feather: 0.9 });
}

/**
 * Drape: folds fanning out and down from the point where the cloth is gathered (a belt, a shoulder,
 * a grip). Each fold is a soft shadow line with a paler ridge beside it, which is what makes a robe
 * read as hanging cloth instead of a painted cone. Seeds are fixed, never from the frame.
 */
function drape(ctx: CanvasRenderingContext2D, h: number, hex: string, ox: number, oy: number, halfW: number, len: number, n: number, seed: number, curve = 0.7, a = 0.3): void {
  if (h < 34 || B.override) return;
  const w = Math.max(1, h * 0.013), pale = mix(hex, '#ffffff', 0.62);
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : (i / (n - 1) - 0.5) * 2, j = (rnd(seed, i, 1) - 0.5) * 0.3;
    const ex = ox + (t + j) * halfW, ey = oy + len * (0.8 + rnd(seed, i, 2) * 0.4);
    const mx = ox + (t + j) * halfW * curve, my = oy + len * 0.45;
    const pts = [ox + t * halfW * 0.1, oy, mx, my, ex, ey];
    softLine(ctx, B, pts, hex, w, a);
    softLine(ctx, B, pts.map((v, k) => k % 2 ? v : v - w * 1.1), pale, w * 0.6, a * 0.55);
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
