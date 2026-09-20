// The skeleton family: a skeleton and a bone knight, painted after the Xeen look. Bone is the one
// material whose parts are honestly separate objects, so each bone is its own small rendered mass
// (a rounded gradient, no flat tones), the joints are creases rather than lines, the skull is a
// lumpy cracked cranium with a hanging jaw, and the ribs are few and thick so they read at 48 px.
// The knight is the same bones inside dented plate: one glossy breastplate mass with pauldrons,
// a helm with a broken plume, a battered shield, a warhammer, and a cold blue light in the visor.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow, eye } from './common.ts';
import { blob, glow, softLine, glossPoly, glossTaper } from './gloss.ts';
import type { Part, Crease } from './gloss.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { pathEllipse } from '../../lib/art/shapes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['skeleton', 'bone_knight'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'bone_knight') knight(ctx, x, y, h, p);
  else skeleton(ctx, x, y, h, p);
};

/** A ring of n points, optionally pinched narrower toward the bottom (a cranium's temples). */
function ring(cx: number, cy: number, rx: number, ry: number, n: number, pinch = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, s = Math.sin(a), k = 1 - pinch * Math.max(0, s);
    o.push(cx + Math.cos(a) * rx * k, cy + s * ry);
  }
  return o;
}

/** A long bone: a waisted shaft with flared, rounded ends, as one smooth lumpy contour. */
function bone(x0: number, y0: number, x1: number, y1: number, r: number, seed: number): Part {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, ex = dx / L, ey = dy / L, nx = -ey, ny = ex;
  const P = (t: number, s: number) => [x0 + ex * L * t + nx * s, y0 + ey * L * t + ny * s];
  const e = r * 0.6 / L;
  return { k: 'curve', pts: [
    ...P(-e, 0), ...P(0.03, -1.1 * r), ...P(0.22, -0.8 * r), ...P(0.5, -0.72 * r), ...P(0.78, -0.8 * r), ...P(0.97, -1.06 * r),
    ...P(1 + e, 0), ...P(0.97, 1.06 * r), ...P(0.78, 0.8 * r), ...P(0.5, 0.72 * r), ...P(0.22, 0.8 * r), ...P(0.03, 1.1 * r),
  ], wobble: 0.02, seed, sub: 2 };
}

/** Two bones meeting at a joint (thigh-knee-shin, upper arm-elbow-forearm). */
function limb(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, r0: number, r1: number, seed: number): Part[] {
  return [bone(x0, y0, x1, y1, r0, seed), bone(x1, y1, x2, y2, r1, seed + 1)];
}

/** The crease where two bones meet: a soft dark band across the joint. */
function joint(x: number, y: number, r: number, a = 0.4): Crease {
  return { x0: x - r * 0.9, y0: y + r * 0.35, x1: x + r * 0.9, y1: y + r * 0.35, r: r * 0.3, a };
}

const INK = '#16121a';

/** The skull shared by both kinds: cranium with cheekbones and cracks, black sockets, nasal hole, a jaw with teeth. */
function skull(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, bone: string, old: string, h: number, jt: number): void {
  // The jaw first, hanging below; the cranium overlaps its top.
  blob(ctx, B, old, [
    { k: 'curve', pts: [cx - r * 0.66, cy + r * 0.62, cx + r * 0.74, cy + r * 0.58, cx + r * 0.64, cy + r * 1.18 + jt, cx + r * 0.12, cy + r * 1.38 + jt, cx - r * 0.42, cy + r * 1.2 + jt], wobble: 0.04, seed: 21, sub: 2 },
  ], { h, formK: 0.6, spread: 0.7 });
  blob(ctx, B, bone, [
    { k: 'curve', pts: ring(cx, cy - r * 0.05, r, r * 0.96, 11, 0.16), wobble: 0.03, seed: 17, sub: 2 },
    { k: 'ell', x: cx - r * 0.62, y: cy + r * 0.62, rx: r * 0.3, ry: r * 0.22 },
    { k: 'ell', x: cx + r * 0.68, y: cy + r * 0.6, rx: r * 0.34, ry: r * 0.24 },
  ], { h, tex: 'cracks', seed: 4, amount: 0.8, formK: 0.45, gloss: 0.1, creases: [
    { x0: cx - r * 0.6, y0: cy + r * 0.45, x1: cx + r * 0.7, y1: cy + r * 0.42, r: r * 0.12, a: 0.3 },
  ] });
  // The mouth gap, then the teeth across it.
  softLine(ctx, B, [cx - r * 0.5, cy + r * 0.92 + jt * 0.5, cx + r * 0.62, cy + r * 0.9 + jt * 0.5], old, Math.max(1, r * 0.16 + jt), 0.75);
  ctx.fillStyle = B.col(mix(bone, '#ffffff', 0.25));
  const tw = Math.max(1, Math.round(r * 0.12)), th = Math.max(1, Math.round(r * 0.18));
  for (let i = -2; i <= 2; i++) ctx.fillRect(Math.round(cx + r * 0.06 + i * r * 0.24 - tw / 2), Math.round(cy + r * 0.82), tw, th);
  // Sockets, the near one a touch larger for the turn of the head, and the nasal hole.
  ctx.fillStyle = B.col(INK);
  pathEllipse(ctx, cx - r * 0.38, cy - r * 0.06, r * 0.3, r * 0.34, 0.1); ctx.fill();
  pathEllipse(ctx, cx + r * 0.37, cy - r * 0.08, r * 0.33, r * 0.36, -0.1); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + r * 0.02, cy + r * 0.3); ctx.lineTo(cx - r * 0.14, cy + r * 0.6); ctx.lineTo(cx + r * 0.18, cy + r * 0.6); ctx.closePath(); ctx.fill();
  // Brow ridge: a soft shadow over the sockets.
  softLine(ctx, B, [cx - r * 0.66, cy - r * 0.34, cx - r * 0.1, cy - r * 0.44, cx + r * 0.68, cy - r * 0.36], bone, r * 0.12, 0.35);
}

function skeleton(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  const bone = p.base, old = p.dark;
  const cloth = shade('#6e5e78', p.tone), rust = shade('#70503c', p.tone), leather = shade('#4a3424', p.tone);
  const sw = p.breathe * 1.4; // the whole upper body sways a little on the spine
  const jt = Math.pow(Math.max(0, Math.sin(p.frame / 19)), 14) * 2.4 * u; // the jaw drops now and then
  groundShadow(ctx, x, y + 1, h * 0.5);

  // Far leg and far arm: older, darker bone behind everything.
  blob(ctx, B, old, [
    ...limb(X(-6), Y(-45), X(-9.5), Y(-25), X(-8.5), Y(-5), 2.7 * u, 2.2 * u, 31),
    { k: 'cap', x0: X(-8.5), y0: Y(-3.6), x1: X(-14.5), y1: Y(-2.6), r0: 2 * u, r1: 1.5 * u },
    ...limb(X(-13.5 + sw), Y(-67), X(-19.5 + sw * 0.8), Y(-55), X(-13 + sw * 0.6), Y(-42.5), 2.4 * u, 2 * u, 33),
    { k: 'ball', x: X(-12 + sw * 0.6), y: Y(-41.5), r: 2.7 * u },
  ], { h, formK: 0.45, creases: [joint(X(-9.5), Y(-25), 3 * u, 0.35), joint(X(-19.5 + sw * 0.8), Y(-55), 2.6 * u, 0.35)] });

  // Near leg, spine, clavicles, ribs and the near arm: one bone mass, joints as creases.
  const sx = X(1 + sw * 0.5), sy = Y(-58), tx = X(2 + sw), ty = Y(-71);
  const bones: Part[] = [
    ...limb(X(6), Y(-45), X(8.5), Y(-25), X(9.5), Y(-5), 2.9 * u, 2.4 * u, 35),
    { k: 'cap', x0: X(9.5), y0: Y(-3.6), x1: X(16), y1: Y(-2.6), r0: 2.1 * u, r1: 1.6 * u },
    { k: 'tube', pts: [X(0), Y(-44), sx, sy, tx, ty, X(2.5 + sw), Y(-76)], r0: 2.2 * u, r1: 2.4 * u },
    { k: 'cap', x0: tx, y0: ty, x1: X(-12.5 + sw), y1: Y(-67.5), r0: 1.7 * u, r1: 2.6 * u },
    { k: 'cap', x0: tx, y0: ty, x1: X(14 + sw), y1: Y(-68.5), r0: 1.7 * u, r1: 2.8 * u },
    ...limb(X(14 + sw), Y(-68), X(22.5 + sw * 0.8), Y(-59), X(26 + sw * 0.6), Y(-47), 2.5 * u, 2.1 * u, 37),
  ];
  for (let i = 0; i < 3; i++) {
    const ry = -66.5 + i * 6.2, lift = 1.2 * (i === 1 ? 1 : 0.6) * u;
    for (const s of [-1, 1] as const) {
      const len = s > 0 ? 13 - i * 0.6 : 10.5 - i * 0.6, x0 = X(1.5 + sw * 0.75 + s * 0.5);
      bones.push({ k: 'tube', pts: [x0, Y(ry) - lift * 0.3, x0 + s * len * 0.5 * u, Y(ry + 1.4), x0 + s * len * u, Y(ry + 4.8)], r0: 2.4 * u, r1: 1.7 * u });
    }
  }
  blob(ctx, B, bone, bones, { h, formK: 0.5, creases: [
    joint(X(8.5), Y(-25), 3.2 * u, 0.35), joint(X(22.5 + sw * 0.8), Y(-59), 2.9 * u, 0.35),
    { x0: X(-2 + sw), y0: Y(-71.5), x1: X(6 + sw), y1: Y(-71.5), r: 1.2 * u, a: 0.3 },
    { x0: X(6), y0: Y(-43), x1: X(6), y1: Y(-46), r: 2 * u, a: 0.3 },
  ] });

  // Pelvis: older bone, cracked, over the hips and the base of the spine.
  blob(ctx, B, old, [
    { k: 'curve', pts: [X(-9.5), Y(-49.5), X(-2), Y(-51), X(2), Y(-51), X(9.5), Y(-49.5), X(10.5), Y(-45), X(6.5), Y(-40.5), X(2), Y(-42.5), X(-2), Y(-42.5), X(-6.5), Y(-40.5), X(-10.5), Y(-45)], wobble: 0.05, seed: 3, sub: 2 },
  ], { h, tex: 'cracks', seed: 8, amount: 0.6, formK: 0.6 });
  ctx.fillStyle = B.col(mix(old, INK, 0.7));
  pathEllipse(ctx, X(0), Y(-46), 1.6 * u, 2.4 * u); ctx.fill();

  // A torn strip of old cloth tucked under the pelvis, hanging over the far hip in three tatters; a leather strap across the chest.
  blob(ctx, B, cloth, [
    { k: 'curve', pts: [X(-9.5), Y(-46), X(-3), Y(-44.5), X(-2.5), Y(-37), X(-4), Y(-29), X(-2.5), Y(-22.5), X(-6), Y(-26.5), X(-8), Y(-19.5), X(-10.5), Y(-27.5), X(-14), Y(-23), X(-12.5), Y(-32), X(-12), Y(-41)], wobble: 0.05, seed: 5, sub: 2 },
  ], { h, tex: 'folds', seed: 5, amount: 0.5, formK: 0.35, spread: 0.7 });
  ctx.strokeStyle = B.col(leather); ctx.lineWidth = Math.max(1, 1.8 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X(12 + sw), Y(-69)); ctx.quadraticCurveTo(X(2 + sw * 0.6), Y(-58), X(-7), Y(-47.5)); ctx.stroke();

  // A rusty, notched blade rising from the near hand; the fingers close over the grip.
  const hx = X(26 + sw * 0.6), hy = Y(-47), bx = X(34.5 + sw * 0.3), by = Y(-86);
  const dx = bx - hx, dy = by - hy, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, ex = dx / L, ey = dy / L;
  const pt = (t: number, s: number): [number, number] => [hx + ex * L * t + nx * s * u, hy + ey * L * t + ny * s * u];
  glossTaper(ctx, B, hx - ex * 6 * u, hy - ey * 6 * u, hx + ex * 2 * u, hy + ey * 2 * u, 1.4 * u, 1.4 * u, leather, { h });
  glossPoly(ctx, B, [...pt(0.09, -4.5), ...pt(0.09, 4.5), ...pt(0.135, 4.5), ...pt(0.135, -4.5)], mix(leather, INK, 0.3), { h });
  glossPoly(ctx, B, [
    ...pt(0.13, 2.1), ...pt(0.4, 2.2), ...pt(0.45, 1), ...pt(0.5, 2.2), ...pt(0.78, 1.8), ...pt(1, -0.4),
    ...pt(0.72, -2.4), ...pt(0.64, -1.2), ...pt(0.58, -2.6), ...pt(0.3, -2.7), ...pt(0.13, -2.1),
  ], rust, { h, gloss: 0.15, spread: 0.6 });
  ctx.strokeStyle = B.col(mix(rust, '#e8d8b0', 0.55)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...pt(0.16, -2)); ctx.lineTo(...pt(0.56, -2.4)); ctx.moveTo(...pt(0.66, -1.2)); ctx.lineTo(...pt(0.98, -0.5)); ctx.stroke();
  blob(ctx, B, bone, [
    { k: 'ball', x: hx, y: hy, r: 2.6 * u },
    { k: 'cap', x0: hx - 1.5 * u, y0: hy + 1.5 * u, x1: hx + 1.8 * u, y1: hy + 2.6 * u, r0: 1 * u, r1: 1 * u },
  ], { h, formK: 0.5 });

  // The skull, turned a little toward the blade and hung forward on the neck.
  const r = 9.6 * u;
  skull(ctx, X(4.4 + sw * 1.2), Y(-85.5), r, bone, old, h, jt);
}

function knight(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  const steel = p.base, steelD = p.dark, steelL = p.light;
  const bone = shade('#cfc4b0', p.tone), old = shade('#a89c88', p.tone);
  const cloth = shade('#48283a', p.tone), plume = shade('#7a2a34', p.tone), leather = shade('#4a3424', p.tone);
  const blue = '#8ad0ff', pulse = 0.5 + 0.5 * Math.sin(p.frame / 8);
  const sw = p.breathe * 0.7, br = p.breathe * 0.5; // a slow heavy sway and a slight rise of the chest
  groundShadow(ctx, x, y + 1, h * 0.62);

  // The bones under the plate: neck, knees, elbows and the hands, seen where the armour leaves gaps.
  const nkx = X(23 + sw * 0.5), nky = Y(-44); // the near hand on the hammer
  blob(ctx, B, old, [
    { k: 'tube', pts: [X(2 + sw), Y(-73), X(3 + sw), Y(-81)], r0: 3 * u, r1: 2.8 * u },
    { k: 'ball', x: X(-11), y: Y(-25), r: 3.2 * u }, { k: 'ball', x: X(10), y: Y(-25), r: 3.4 * u },
    { k: 'ball', x: X(-22 + sw * 0.8), y: Y(-56), r: 3 * u }, { k: 'ball', x: X(25 + sw * 0.8), y: Y(-56), r: 3.1 * u },
  ], { h, formK: 0.5 });

  // The far side plate: darker, behind. Cuisse, greave and sabaton; upper arm and vambrace.
  blob(ctx, B, steelD, [
    { k: 'cap', x0: X(-8), y0: Y(-47), x1: X(-10.5), y1: Y(-30), r0: 4.4 * u, r1: 3.6 * u },
    { k: 'cap', x0: X(-11.5), y0: Y(-20), x1: X(-12.5), y1: Y(-6.5), r0: 3.6 * u, r1: 3.2 * u },
    { k: 'curve', pts: [X(-18), Y(-6), X(-11), Y(-7.5), X(-7.5), Y(-4.5), X(-9), Y(-2.2), X(-19.5), Y(-2.5)], wobble: 0.04, seed: 12, sub: 2 },
    { k: 'cap', x0: X(-16 + sw), y0: Y(-68), x1: X(-21.5 + sw * 0.8), y1: Y(-60), r0: 3.8 * u, r1: 3.2 * u },
    { k: 'cap', x0: X(-22 + sw * 0.8), y0: Y(-51.5), x1: X(-18 + sw * 0.6), y1: Y(-43), r0: 3.2 * u, r1: 3 * u },
  ], { h, formK: 0.45, gloss: 0 });

  // The shield on the far forearm: battered plate with a faded device.
  const shx = X(-22 + sw * 0.6), shy = Y(-50);
  blob(ctx, B, steelD, [
    { k: 'curve', pts: [shx - 10 * u, shy - 15 * u, shx + 1 * u, shy - 16 * u, shx + 10.5 * u, shy - 13 * u, shx + 9 * u, shy - 1 * u, shx + 3 * u, shy + 12 * u, shx - 2 * u, shy + 16 * u, shx - 8 * u, shy + 9 * u, shx - 12 * u, shy - 3 * u], wobble: 0.02, seed: 13, sub: 2 },
  ], { h, formK: 0.5, gloss: 0.25, tex: 'cracks', seed: 14, amount: 0.5, spread: 0.8 });
  ctx.fillStyle = B.col(rgba(mix(steelL, '#e8d8a0', 0.5), 0.35));
  ctx.beginPath(); ctx.moveTo(shx - 7 * u, shy - 9 * u); ctx.lineTo(shx, shy - 3 * u); ctx.lineTo(shx + 7 * u, shy - 9 * u); ctx.lineTo(shx + 7 * u, shy - 4 * u); ctx.lineTo(shx, shy + 3 * u); ctx.lineTo(shx - 7 * u, shy - 4 * u); ctx.closePath(); ctx.fill();
  softLine(ctx, B, [shx - 8 * u, shy - 12 * u, shx + 8 * u, shy - 10.5 * u], steelD, Math.max(1, u), 0.3);

  // The broken plume, its stump under the helm.
  blob(ctx, B, plume, [
    { k: 'curve', pts: [X(0.5 + sw), Y(-95), X(2.5 + sw), Y(-102.5), X(7 + sw), Y(-101), X(11 + sw), Y(-97.5), X(13.5 + sw), Y(-92), X(10 + sw), Y(-94), X(6 + sw), Y(-94.5)], wobble: 0.06, spiky: 0.14, seed: 9, sub: 2 },
  ], { h, formK: 0.4, spread: 0.7 });

  // The near plate: greave and cuisse, fauld, breastplate, both pauldrons, near arm and gauntlet cuffs. One glossy dented mass.
  const cy = Y(-60 - br), cx = X(1 + sw);
  const plate: Part[] = [
    { k: 'cap', x0: X(8), y0: Y(-47), x1: X(9.5), y1: Y(-30), r0: 4.6 * u, r1: 3.8 * u },
    { k: 'cap', x0: X(10.5), y0: Y(-20), x1: X(11.5), y1: Y(-6.5), r0: 3.8 * u, r1: 3.3 * u },
    { k: 'curve', pts: [X(6.5), Y(-6), X(13), Y(-7.5), X(19), Y(-4.5), X(18), Y(-2.2), X(8), Y(-2.5)], wobble: 0.04, seed: 15, sub: 2 },
    { k: 'poly', pts: [X(-14 + sw * 0.5), Y(-52), X(15 + sw * 0.5), Y(-52), X(17), Y(-41), X(9), Y(-38.5), X(-9), Y(-38.5), X(-16), Y(-41)] },
    { k: 'curve', pts: [cx - 15.5 * u, cy - 13 * u, cx - 5 * u, cy - 15.5 * u, cx + 5 * u, cy - 15.5 * u, cx + 15.5 * u, cy - 13 * u, cx + 17.5 * u, cy - 2 * u, cx + 13 * u, cy + 11 * u, cx + 1 * u, cy + 14 * u, cx - 12 * u, cy + 11 * u, cx - 17 * u, cy - 2 * u], wobble: 0.025, seed: 11, sub: 2, gloss: 0.3 },
    { k: 'cap', x0: X(18 + sw), y0: Y(-67), x1: X(24.5 + sw * 0.8), y1: Y(-60), r0: 4 * u, r1: 3.4 * u },
    { k: 'cap', x0: X(25 + sw * 0.8), y0: Y(-51.5), x1: nkx, y1: nky + 3 * u, r0: 3.4 * u, r1: 3.6 * u },
    { k: 'cap', x0: X(-19 + sw * 0.6), y0: Y(-43), x1: X(-17.5 + sw * 0.6), y1: Y(-39.5), r0: 3.2 * u, r1: 3.5 * u },
  ];
  blob(ctx, B, steel, plate, { h, tex: 'stipple', seed: 20, amount: 0.16, formK: 0.55, gloss: 0.1, creases: [
    { x0: cx - 14 * u, y0: cy - 5 * u, x1: cx - 8 * u, y1: cy - 12 * u, r: 1.6 * u, a: 0.3 },
    { x0: cx + 15 * u, y0: cy - 5 * u, x1: cx + 9 * u, y1: cy - 12 * u, r: 1.6 * u, a: 0.3 },
    { x0: cx - 12 * u, y0: cy + 9 * u, x1: cx + 13 * u, y1: cy + 9 * u, r: 1.4 * u, a: 0.35 },
    { x0: cx - 1 * u, y0: cy - 12 * u, x1: cx - 2 * u, y1: cy + 8 * u, r: 1.2 * u, a: 0.2 },
  ] });
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.4), 0.55)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 0.5 * u, cy - 12 * u); ctx.quadraticCurveTo(cx - 3 * u, cy - 2 * u, cx - 1.5 * u, cy + 9 * u); ctx.stroke();
  // The pauldrons: their own plates over the shoulders.
  blob(ctx, B, steel, [
    { k: 'curve', pts: ring(cx - 18 * u, cy - 10.5 * u, 7 * u, 6.2 * u, 9), wobble: 0.05, seed: 18, sub: 2, gloss: 0.2 },
    { k: 'curve', pts: ring(cx + 19 * u, cy - 10.5 * u, 7.6 * u, 6.8 * u, 9), wobble: 0.05, seed: 19, sub: 2, gloss: 0.25 },
  ], { h, formK: 0.6, creases: [
    { x0: cx - 22 * u, y0: cy - 7 * u, x1: cx - 13 * u, y1: cy - 6 * u, r: 1.2 * u, a: 0.3 },
    { x0: cx + 14 * u, y0: cy - 6 * u, x1: cx + 24 * u, y1: cy - 7 * u, r: 1.2 * u, a: 0.3 },
  ] });
  // The belt and the tabard scrap hanging from it, over the fauld.
  ctx.strokeStyle = B.col(leather); ctx.lineWidth = Math.max(1, 2.4 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X(-15 + sw * 0.5), Y(-50)); ctx.quadraticCurveTo(X(1 + sw * 0.5), Y(-47.5), X(16 + sw * 0.5), Y(-50)); ctx.stroke();
  blob(ctx, B, cloth, [
    { k: 'curve', pts: [X(-8 + sw * 0.5), Y(-49), X(8 + sw * 0.5), Y(-49), X(9), Y(-38), X(6), Y(-27), X(0), Y(-30), X(-5), Y(-25), X(-9.5), Y(-38)], wobble: 0.05, spiky: 0.1, seed: 22, sub: 2 },
  ], { h, tex: 'folds', seed: 22, amount: 0.7, formK: 0.4, spread: 0.7 });

  // The helm: a lumpy dome with a flared neck guard and a dark visor slit, lit from inside by the sockets.
  const hx = X(3 + sw), hy = Y(-87);
  blob(ctx, B, steel, [
    { k: 'curve', pts: ring(hx, hy - 0.5 * u, 9.8 * u, 10 * u, 11, 0.1), wobble: 0.03, seed: 23, sub: 2, gloss: 0.35 },
    { k: 'ell', x: hx + 0.5 * u, y: hy + 8.5 * u, rx: 9 * u, ry: 3.2 * u },
  ], { h, formK: 0.5, creases: [{ x0: hx - 8 * u, y0: hy + 6 * u, x1: hx + 8.5 * u, y1: hy + 6 * u, r: 1.2 * u, a: 0.35 }] });
  ctx.fillStyle = B.col(INK);
  ctx.beginPath(); ctx.moveTo(hx - 7 * u, hy - 1.6 * u); ctx.lineTo(hx + 8.5 * u, hy - 2 * u); ctx.lineTo(hx + 8 * u, hy + 1.6 * u); ctx.lineTo(hx - 6.5 * u, hy + 1.8 * u); ctx.closePath(); ctx.fill();
  ctx.fillRect(Math.round(hx - 0.7 * u), Math.round(hy + 1.6 * u), Math.max(1, Math.round(1.4 * u)), Math.round(4.5 * u));
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.4), 0.5)); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(hx - 0.5 * u, hy - 10 * u); ctx.quadraticCurveTo(hx - 2 * u, hy - 6 * u, hx - 1 * u, hy - 2.5 * u); ctx.stroke();
  glow(ctx, B, hx - 3.6 * u, hy, 5.5 * u, blue, 0.35 + 0.3 * pulse, '#d8f0ff');
  glow(ctx, B, hx + 3.8 * u, hy - 0.2 * u, 6 * u, blue, 0.4 + 0.3 * pulse, '#d8f0ff');
  eye(ctx, hx - 3.6 * u, hy, 1.2 * u, mix(blue, '#ffffff', 0.4 + 0.3 * pulse), false);
  eye(ctx, hx + 3.8 * u, hy - 0.2 * u, 1.35 * u, mix(blue, '#ffffff', 0.4 + 0.3 * pulse), false);

  // The warhammer: a leather-wrapped haft and a heavy steel head with a spike, the bone fingers closed over it.
  const h0x = X(20 + sw * 0.4), h0y = Y(-12), h1x = X(29 + sw * 0.6), h1y = Y(-94);
  const dx = h1x - h0x, dy = h1y - h0y, L = Math.hypot(dx, dy), ex = dx / L, ey = dy / L, nx = -ey, ny = ex;
  const pt = (t: number, s: number): [number, number] => [h0x + ex * L * t + nx * s * u, h0y + ey * L * t + ny * s * u];
  glossTaper(ctx, B, h0x, h0y, h1x, h1y, 1.5 * u, 1.3 * u, leather, { h });
  glossPoly(ctx, B, [...pt(0.85, -2.5), ...pt(0.85, 8.5), ...pt(0.96, 8.5), ...pt(0.96, -2.5), ...pt(0.93, -3.5), ...pt(0.905, -11.5), ...pt(0.88, -3.5)], steelL, { h, gloss: 0.35, spread: 0.6 });
  softLine(ctx, B, [...pt(0.87, -2), ...pt(0.87, 8)], steelL, Math.max(1, u), 0.4);
  softLine(ctx, B, [...pt(0.905, 2), ...pt(0.905, 8)], steelL, Math.max(1, u * 0.8), 0.25);
  blob(ctx, B, bone, [
    { k: 'ball', x: nkx, y: nky, r: 3 * u },
    { k: 'cap', x0: nkx - 2 * u, y0: nky + 1.5 * u, x1: nkx + 2.5 * u, y1: nky + 2.5 * u, r0: 1.1 * u, r1: 1.1 * u },
    { k: 'cap', x0: nkx - 2 * u, y0: nky - 1 * u, x1: nkx + 2.6 * u, y1: nky - 0.5 * u, r0: 1.1 * u, r1: 1.1 * u },
  ], { h, formK: 0.5 });
}
