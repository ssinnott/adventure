// The wraith: a hooded shroud hanging in the air. The cloth is one lumpy mass -- drooping hood,
// sloped shoulders, sleeves reaching forward and down -- shaded deep along the far side and worked
// with curving vertical folds, over a darker inner layer that shows at the torn hem and inside the
// cuffs. Below the waist the shroud frays into layered tatters painted at falling alpha so the
// bottom third dissolves into a cold glow instead of standing on the floor. A void in the hood with
// two flaring eyes, long curling claws out of the sleeves, a broken rusted circlet worn askew, and
// motes drifting up through the light.
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

/** Stable 0..1 noise; never seeded from the frame, or the contour would boil. */
function rnd(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/**
 * A torn hem as a sharp-cornered polygon: a flat top edge, then a walk back along the bottom
 * alternating shallow notches with points of very uneven length, so nothing reads as a scallop.
 */
function tatters(x0: number, x1: number, ytop: number, ybase: number, n: number, seed: number, depth: number): number[] {
  const pts: number[] = [x0, ytop, x1, ytop];
  for (let i = n - 1; i >= 0; i--) {
    const xa = x0 + ((x1 - x0) * (i + 1)) / n, xb = x0 + ((x1 - x0) * i) / n;
    const xm = xa + (xb - xa) * (0.3 + rnd(seed, i) * 0.4), tw = (xa - xb) * 0.22;
    const tip = ybase + depth * (0.2 + rnd(seed, i + 128) * 1.2);
    pts.push(xa, ybase - depth * (0.1 + rnd(seed, i + 64) * 0.5));
    pts.push(xm + tw, tip, xm - tw, tip);
  }
  pts.push(x0, ybase - depth * 0.2);
  return pts;
}

function wraith(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const drift = Math.sin(p.frame / 34) * h * 0.022, pulse = 0.5 + 0.5 * Math.sin(p.frame / 9);
  const flare = 0.5 + 0.5 * Math.sin(p.frame / 23);
  const X = (k: number) => x + h * k, Y = (k: number) => y - h * k + drift;
  const tone = p.tone;
  const cold = mix(p.light, '#b0e8ff', 0.45), bone = shade(mix(p.light, '#ece6d6', 0.6), tone);
  const inner = shade(p.dark, 0.78);
  const iron = shade(mix('#8a5840', '#4e4c4a', 0.66), Math.min(1, tone * 0.95));
  const voidHex = shade('#100c18', Math.max(0.5, tone));
  const Ys = Y(0.705), hy = Y(0.825);                // the shoulder line and the hood centre
  /** Alpha for the dissolving hem; a hit flash must still paint one flat white silhouette. */
  const fade = (a: number) => { ctx.globalAlpha = B.override ? 1 : a; };

  groundShadow(ctx, x, y + 1, h * 0.3);

  // Cold light behind the whole figure, pulsing slowly, and a pool of it where the hem dissolves.
  glow(ctx, B, X(0.02), Y(0.52), h * 0.44, p.base, 0.16 + 0.1 * pulse, cold);
  glow(ctx, B, X(0.0), Y(0.15), h * 0.3, p.base, 0.22 + 0.08 * pulse, cold);

  // 1. The inner layer: a darker shroud of long tatters behind and below the outer hem, painted at
  //    half alpha so the bottom of the wraith thins into the glow instead of ending on the floor.
  fade(0.6);
  blob(ctx, B, inner, [
    { k: 'poly', pts: tatters(X(-0.205), X(0.205), Y(0.43), Y(0.335), 7, 11, h * 0.145) },
  ], { h, formK: 0.35, spread: 0.7 });
  fade(1);

  // 3. The shroud itself: drooping hood, sloped shoulders, a body tapering to the fray, and two
  //    sleeves growing out of it toward the viewer -- one mass, deep-shaded down the far side.
  const cloth: Part[] = [
    { k: 'curve', pts: [X(-0.072), hy + h * 0.10, X(-0.105), hy + h * 0.02, X(-0.114), hy - h * 0.065, X(-0.072), hy - h * 0.142, X(0.005), hy - h * 0.172, X(0.086), hy - h * 0.14, X(0.122), hy - h * 0.06, X(0.128), hy + h * 0.02, X(0.09), hy + h * 0.10], wobble: 0.045, seed: 1, sub: 3 },
    { k: 'curve', pts: [X(-0.176), Ys + h * 0.01, X(-0.142), Ys - h * 0.035, X(-0.068), Ys - h * 0.06, X(0.0), Ys - h * 0.068, X(0.062), Ys - h * 0.06, X(0.136), Ys - h * 0.035, X(0.172), Ys + h * 0.01, X(0.142), Y(0.545), X(0.168), Y(0.455), X(0.198), Y(0.40), X(0.07), Y(0.382), X(-0.06), Y(0.382), X(-0.193), Y(0.40), X(-0.163), Y(0.455), X(-0.138), Y(0.545)], wobble: 0.035, seed: 2, sub: 2 },
    { k: 'poly', pts: tatters(X(-0.215), X(0.215), Y(0.46), Y(0.40), 8, 3, h * 0.078) },
    { k: 'tube', pts: [X(0.115), Ys - h * 0.02, X(0.234), Y(0.495), X(0.19), Y(0.332)], r0: h * 0.058, r1: h * 0.033, wobble: 0.07, seed: 4 },
    { k: 'tube', pts: [X(-0.115), Ys - h * 0.01, X(-0.224), Y(0.487), X(-0.18), Y(0.322)], r0: h * 0.055, r1: h * 0.031, wobble: 0.07, seed: 5 },
  ];
  blob(ctx, B, p.base, cloth, { h, tex: 'folds', seed: 6, amount: 0.8, formK: 0.45, spread: 0.5, creases: [
    { x0: X(-0.165), y0: Ys - h * 0.01, x1: X(-0.172), y1: Y(0.42), r: h * 0.042, a: 0.45 },         // deeper still at the very edge
    { x0: X(-0.085), y0: hy - h * 0.03, x1: X(-0.128), y1: Y(0.42), r: h * 0.06, a: 0.45 },           // the far side in deep shadow
    { x0: X(-0.072), y0: hy - h * 0.095, x1: X(-0.098), y1: hy + h * 0.065, r: h * 0.024, a: 0.45 }, // the hood's far cheek
    { x0: X(-0.078), y0: hy + h * 0.108, x1: X(0.088), y1: hy + h * 0.108, r: h * 0.034, a: 0.7 },  // under the hood
    { x0: X(0.118), y0: Ys - h * 0.025, x1: X(0.178), y1: Y(0.545), r: h * 0.022, a: 0.55 },         // where the near sleeve leaves the body
    { x0: X(-0.116), y0: Ys - h * 0.018, x1: X(-0.173), y1: Y(0.54), r: h * 0.022, a: 0.55 },        // and the far sleeve
    { x0: X(0.189), y0: Y(0.35), x1: X(0.191), y1: Y(0.326), r: h * 0.027, a: 0.75 },                // the dark inside the near cuff
    { x0: X(-0.179), y0: Y(0.34), x1: X(-0.181), y1: Y(0.316), r: h * 0.025, a: 0.75 },              // and the far cuff
  ] });

  // 4. Folds down the drape: soft curving lines, never straight, each with a lit ridge beside it.
  const fold = (x0: number, y0: number, x1: number, y1: number, bow: number, w: number, a: number): void => {
    const pts: number[] = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(x0 + (x1 - x0) * t + Math.sin(t * Math.PI) * bow, y0 + (y1 - y0) * t); }
    softLine(ctx, B, pts, p.base, w, a);
    ctx.strokeStyle = B.col(rgba(mix(p.light, '#ffffff', 0.3), a * 0.45));
    ctx.lineWidth = Math.max(1, w * 0.5); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0] - w, pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i] - w, pts[i + 1]);
    ctx.stroke();
  };
  fold(X(-0.072), Ys - h * 0.03, X(-0.112), Y(0.41), h * 0.03, h * 0.028, 0.75);
  fold(X(-0.012), Ys - h * 0.045, X(-0.028), Y(0.395), -h * 0.034, h * 0.026, 0.68);
  fold(X(0.062), Ys - h * 0.04, X(0.10), Y(0.41), h * 0.028, h * 0.026, 0.68);
  softLine(ctx, B, [X(-0.112), hy - h * 0.02, X(-0.098), hy + h * 0.045, X(-0.085), hy + h * 0.095], p.base, h * 0.015, 0.5);

  ctx.strokeStyle = B.col(rgba(mix(p.light, '#ffffff', 0.4), 0.4));
  ctx.lineWidth = Math.max(1, h * 0.012); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(X(0.145), Ys + h * 0.005); ctx.quadraticCurveTo(X(0.126), Y(0.56), X(0.15), Y(0.44)); ctx.stroke();

  // 5. Claw hands out of the cuffs: only the pale bone shows, fingers long, curling and tapering.
  const claws: Part[] = [];
  const hand = (hx: number, hyy: number, s: number, seed: number): void => {
    claws.push({ k: 'ell', x: hx, y: hyy + h * 0.012, rx: h * 0.024, ry: h * 0.019, rot: 0.25 * s });
    for (let k = 0; k < 4; k++) {
      const thumb = k === 3, sp = thumb ? -0.85 * s : ((k - 1) * 0.42 + 0.12) * s;
      const len = h * (thumb ? 0.075 : 0.145 + (k === 1 ? 0.028 : 0));
      claws.push({ k: 'tube', pts: [
        hx + sp * h * 0.02, hyy + h * 0.01,
        hx + sp * len * 0.62 + s * len * 0.06, hyy + len * (thumb ? 0.45 : 0.52),
        hx + sp * len * 0.62 - s * len * (thumb ? 0.05 : 0.2), hyy + len * (thumb ? 0.85 : 0.96),
      ], r0: h * (thumb ? 0.011 : 0.0125), r1: h * 0.0035, wobble: 0.05, seed: seed + k });
    }
  };
  hand(X(0.191), Y(0.326), 1, 30);
  hand(X(-0.181), Y(0.316), -1, 40);
  fade(0.9);
  blob(ctx, B, bone, claws, { formK: 0.45, spread: 0.7 });
  fade(1);

  // 6. The hood's void, then the eyes: a cold glow that flares, and a hard pale point.
  blob(ctx, B, voidHex, [
    { k: 'curve', pts: [X(-0.07), hy - h * 0.04, X(0.022), hy - h * 0.078, X(0.088), hy - h * 0.014, X(0.078), hy + h * 0.078, X(-0.056), hy + h * 0.084], wobble: 0.05, seed: 8, sub: 2 },
  ], { outline: false, form: false, spread: 0.4 });
  for (const ex of [X(-0.03), X(0.055)]) {
    glow(ctx, B, ex, hy + h * 0.008, h * 0.05 + h * 0.028 * flare, cold, 0.45 + 0.45 * flare, '#ffffff');
    eye(ctx, ex, hy + h * 0.008, h * 0.016, mix(cold, '#ffffff', 0.4 + 0.5 * flare), false);
  }

  // 7. A broken circlet of rusted iron, worn askew: a thin band with uneven points and a gap where
  //    one has snapped off, so the hood reads right through and behind it.
  const cw = h * 0.10, cb = hy - h * 0.048, cth = h * 0.012, tilt = 0.17;
  const spikes = [0.05, 0.022, 0.0, 0.042, 0.018, 0.056, 0.026];
  const band: number[] = [-cw, cb, cw, cb];
  for (let i = spikes.length - 1; i >= 0; i--) {
    const x1 = -cw + ((i + 1) / spikes.length) * 2 * cw, x0 = -cw + (i / spikes.length) * 2 * cw;
    band.push(x1, cb - cth, (x0 + x1) / 2, cb - cth - spikes[i] * h, x0, cb - cth);
  }
  const ca = Math.cos(tilt), sa = Math.sin(tilt), crown: number[] = [];
  for (let i = 0; i < band.length; i += 2) {
    const dx = band[i], dy = band[i + 1] - cb;
    crown.push(X(0) + dx * ca - dy * sa, cb + dx * sa + dy * ca);
  }
  blob(ctx, B, iron, [{ k: 'poly', pts: crown }], { h, tex: 'cracks', seed: 9, amount: 0.8, formK: 0.7, gloss: 0.3, spread: 0.6 });

  // 8. Motes drifting up through the glow (emissive: not part of the flash silhouette).
  if (!B.override) {
    for (let i = 0; i < 5; i++) {
      const speed = 0.0035 + rnd(i, 1) * 0.002, span = h * 0.85;
      const t = ((p.frame * speed * h + rnd(i, 2) * span) % span) / span;
      const side = rnd(i, 3) < 0.5 ? -1 : 1, mx = x + side * h * (0.2 + rnd(i, 5) * 0.18) + Math.sin(p.frame / 20 + i) * h * 0.02, my = Y(0.02) - t * span;
      const a = Math.sin(t * Math.PI) * (0.5 + 0.5 * rnd(i, 4));
      glow(ctx, B, mx, my, h * 0.025, cold, a * 0.6, '#ffffff');
      ctx.fillStyle = rgba('#ffffff', a * 0.8); ctx.fillRect(Math.round(mx), Math.round(my), 1, 1);
    }
  }
}
