// The wraith: a hooded shroud that hangs in the air, one lumpy mass of cloth frayed to tatters
// below the waist over a darker inner layer, a void in the hood with two cold flaring eyes, long
// clawed hands reaching, a rusted crown, and a cold glow with motes drifting up through it.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { blob, glow, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['wraith'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  wraith(ctx, x, y, h, p);
};

/** Stable 0..1 noise for the motes. */
function rnd(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

function wraith(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const drift = Math.sin(p.frame / 34) * h * 0.025, pulse = 0.5 + 0.5 * Math.sin(p.frame / 9);
  const flare = 0.5 + 0.5 * Math.sin(p.frame / 23);
  const yy = y - h * 0.07 + drift;                   // where the outer hem hangs
  const X = (k: number) => x + h * k, Y = (k: number) => yy - h * k;
  const tone = p.tone;
  const cold = mix(p.light, '#b0e8ff', 0.45), bone = shade(mix(p.light, '#ece6d6', 0.6), tone);
  const rust = shade('#74422a', tone), voidHex = shade('#100c18', Math.max(0.5, tone));
  const Ys = Y(0.62), hy = Y(0.8);                   // the shoulder line and the head centre

  groundShadow(ctx, x, y + 1, h * 0.4);

  // Cold light behind the whole figure, pulsing slowly.
  glow(ctx, B, X(0.02), Y(0.5), h * 0.5, p.base, 0.16 + 0.1 * pulse, cold);

  // 1. The inner shroud: a darker layer of long tatters hanging below the outer hem.
  blob(ctx, B, p.dark, [
    { k: 'curve', pts: [X(-0.15), Y(0.36), X(0.16), Y(0.36), X(0.18), Y(0.11), X(0.02), Y(0.05), X(-0.15), Y(0.1)], wobble: 0.08, spiky: 0.24, seed: 7, sub: 4 },
  ], { h, formK: 0.3, spread: 0.7 });

  // 2. The outer shroud: a tall drooping hood, sloped shoulders, a body that tapers into a frayed hem, sleeves.
  const cloth: Part[] = [
    { k: 'curve', pts: [X(-0.15), hy + h * 0.03, X(-0.14), hy - h * 0.12, X(-0.04), hy - h * 0.22, X(0.08), hy - h * 0.25, X(0.16), hy - h * 0.2, X(0.14), hy - h * 0.12, X(0.17), hy + h * 0.02, X(0.14), hy + h * 0.17, X(-0.12), hy + h * 0.17], wobble: 0.05, seed: 1, sub: 3 },
    { k: 'curve', pts: [X(-0.2), Ys, X(-0.08), Ys - h * 0.07, X(0.1), Ys - h * 0.07, X(0.23), Ys + h * 0.03, X(0.21), Y(0.4), X(0.18), Y(0.26), X(-0.16), Y(0.27), X(-0.19), Y(0.42)], wobble: 0.05, seed: 2, sub: 3 },
    { k: 'curve', pts: [X(-0.18), Y(0.32), X(0.19), Y(0.32), X(0.23), Y(0.18), X(0.0), Y(0.15), X(-0.23), Y(0.19)], wobble: 0.08, spiky: 0.2, seed: 3, sub: 4 },
    { k: 'tube', pts: [X(0.17), Ys + h * 0.04, X(0.3), Ys + h * 0.1, X(0.34), Ys + h * 0.26], r0: h * 0.058, r1: h * 0.04, wobble: 0.08, seed: 4 },
    { k: 'tube', pts: [X(-0.17), Ys + h * 0.05, X(-0.27), Ys + h * 0.2, X(-0.24), Ys + h * 0.36], r0: h * 0.055, r1: h * 0.038, wobble: 0.08, seed: 5 },
  ];
  blob(ctx, B, p.base, cloth, { h, tex: 'folds', seed: 6, amount: 1.3, formK: 0.35, creases: [
    { x0: X(-0.08), y0: hy + h * 0.15, x1: X(0.09), y1: hy + h * 0.15, r: h * 0.035, a: 0.5 },     // under the hood
    { x0: X(0.16), y0: Ys + h * 0.07, x1: X(0.18), y1: Ys + h * 0.16, r: h * 0.018, a: 0.3 },     // near sleeve
    { x0: X(-0.15), y0: Ys + h * 0.08, x1: X(-0.16), y1: Ys + h * 0.18, r: h * 0.018, a: 0.3 },   // far sleeve
    { x0: X(0.0), y0: Y(0.5), x1: X(0.02), y1: Y(0.3), r: h * 0.02, a: 0.25 },                    // a long fold
  ] });
  softLine(ctx, B, [X(-0.14), hy - h * 0.02, X(-0.12), hy + h * 0.12], p.base, h * 0.02, 0.4);   // the hood's edge fold

  // 3. Clawed hands: long thin bony fingers curling out of each sleeve.
  const claws: Part[] = [];
  const hand = (hx: number, hyy: number, s: number, a0: number, seed: number) => {
    for (let k = 0; k < 3; k++) {
      const a = a0 + k * 0.5, len = h * (0.13 + (k === 1 ? 0.035 : 0)), cx = Math.cos(a) * s, cy = Math.sin(a);
      claws.push({ k: 'tube', pts: [hx, hyy, hx + cx * len * 0.5, hyy + cy * len * 0.5, hx + cx * len * 0.8 + cy * s * len * 0.15, hyy + cy * len * 0.95 + cx * s * len * 0.1], r0: h * 0.013, r1: h * 0.005, wobble: 0.1, seed: seed + k });
    }
  };
  hand(X(0.34), Ys + h * 0.26, 1, 0.2, 30);
  hand(X(-0.24), Ys + h * 0.36, -1, 0.7, 40);
  blob(ctx, B, bone, claws, { formK: 0.4 });

  // 4. The hood's void, then the eyes: a cold glow that flares, and a hard pale point.
  blob(ctx, B, voidHex, [
    { k: 'curve', pts: [X(-0.08), hy - h * 0.04, X(0.03), hy - h * 0.1, X(0.11), hy - h * 0.02, X(0.1), hy + h * 0.12, X(-0.06), hy + h * 0.13], wobble: 0.05, seed: 8, sub: 2 },
  ], { outline: false, form: false, spread: 0.4 });
  for (const ex of [X(-0.035), X(0.065)]) {
    glow(ctx, B, ex, hy + h * 0.01, h * 0.06 + h * 0.03 * flare, cold, 0.45 + 0.45 * flare, '#ffffff');
    eye(ctx, ex, hy + h * 0.01, h * 0.018, mix(cold, '#ffffff', 0.4 + 0.5 * flare), false);
  }

  // 5. A rusted crown, sitting crooked on the hood.
  const cyb = hy - h * 0.1;
  blob(ctx, B, rust, [{ k: 'poly', pts: [
    X(-0.12), cyb + h * 0.02, X(-0.11), cyb - h * 0.08, X(-0.07), cyb - h * 0.03, X(-0.03), cyb - h * 0.1, X(0.02), cyb - h * 0.04, X(0.06), cyb - h * 0.12, X(0.09), cyb - h * 0.05, X(0.13), cyb - h * 0.09, X(0.14), cyb + h * 0.0, X(0.0), cyb + h * 0.04,
  ] }], { h, tex: 'cracks', seed: 9, amount: 1, formK: 0.6, spread: 0.6 });

  // 6. Motes drifting up through the glow (emissive: not part of the flash silhouette).
  if (!B.override) {
    for (let i = 0; i < 5; i++) {
      const speed = 0.0035 + rnd(i, 1) * 0.002, span = h * 0.85;
      const t = ((p.frame * speed * h + rnd(i, 2) * span) % span) / span;
      const side = rnd(i, 3) < 0.5 ? -1 : 1, mx = x + side * h * (0.2 + rnd(i, 5) * 0.18) + Math.sin(p.frame / 20 + i) * h * 0.02, my = yy + h * 0.02 - t * span;
      const a = Math.sin(t * Math.PI) * (0.5 + 0.5 * rnd(i, 4));
      glow(ctx, B, mx, my, h * 0.025, cold, a * 0.6, '#ffffff');
      ctx.fillStyle = rgba('#ffffff', a * 0.8); ctx.fillRect(Math.round(mx), Math.round(my), 1, 1);
    }
  }
}
