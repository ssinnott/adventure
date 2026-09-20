// The ogre: a stooped, top-heavy brute. The hide is one painted mass -- barrel chest, heavy gut,
// short thick neck, a heavy-browed skull lifted clear of the shoulders, and the near leg -- with the
// far limbs behind it in a darker tone and the near arm crossing in front as its own mass, so the
// arms break the torso silhouette instead of drowning in it. A short ragged kilt on a rope belt
// leaves the bowed legs showing, and a knotted club is gripped in a visible fist, angled up across
// the near shoulder so it overlaps the body.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { shade } from '../../lib/art/palettes.ts';
import { blob, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['ogre'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  ogre(ctx, x, y, h, p);
};

/** Stable 0..1 noise; never seeded from the frame, or the contour would boil. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/** A ring of n points around (cx, cy); `fat` widens the lower half (a jaw), `top` pulls the crown up. */
function ring(cx: number, cy: number, r: number, n = 10, fat = 0, top = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, s = Math.sin(a);
    const rr = r * (1 + fat * Math.max(0, s) + top * Math.max(0, -s));
    o.push(cx + Math.cos(a) * r, cy + s * rr);
  }
  return o;
}

/**
 * A torn hem as a sharp-cornered polygon: a flat top edge, then a walk back along the bottom
 * alternating shallow notches and points of uneven length, so nothing reads as an even scallop.
 */
function tatters(x0: number, x1: number, ytop: number, ybase: number, n: number, seed: number, depth: number): number[] {
  const pts: number[] = [x0, ytop, x1, ytop];
  for (let i = n - 1; i >= 0; i--) {
    const xa = x0 + ((x1 - x0) * (i + 1)) / n, xb = x0 + ((x1 - x0) * i) / n;
    const xm = xa + (xb - xa) * (0.35 + nz(seed, i) * 0.3);
    pts.push(xa, ybase - depth * (0.1 + nz(seed, i + 64) * 0.4));
    pts.push(xm, ybase + depth * (0.2 + nz(seed, i + 128) * 1.0));
  }
  pts.push(x0, ybase - depth * 0.2);
  return pts;
}

function ogre(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const X = (k: number) => x + h * k, Y = (k: number) => y - h * k;
  const b = p.breathe * h * 0.011;                   // a heavy breath: the shoulders and head rise
  const sw = Math.sin(p.frame / 45) * h * 0.013;     // a slow sway of the club
  const tone = p.tone;
  const leather = shade('#6e4a2a', tone), wrap = shade('#40301f', tone), wood = shade('#5e3e22', tone);
  const rope = shade('#a08c58', tone), ivory = shade('#efe6cf', tone), farHex = shade(p.dark, 0.82);
  const Ys = Y(0.685) - b;                           // the shoulder line
  const hy = Y(0.885) - b, hr = h * 0.106;           // the head centre and radius

  groundShadow(ctx, X(0.0), y + 1, h * 0.66);

  // 1. Far arm and far leg: their own darker mass, behind the hide. The arm hangs outside the ribs,
  //    so the torso's own outline runs between them as a deep seam.
  blob(ctx, B, farHex, [
    { k: 'tube', pts: [X(-0.19), Ys + h * 0.01, X(-0.315), Y(0.59), X(-0.365), Y(0.47)], r0: h * 0.064, r1: h * 0.046, wobble: 0.06, seed: 21 },
    { k: 'tube', pts: [X(-0.365), Y(0.475), X(-0.34), Y(0.385), X(-0.30), Y(0.30)], r0: h * 0.044, r1: h * 0.034, wobble: 0.06, seed: 22 },
    { k: 'curve', pts: ring(X(-0.292), Y(0.258), h * 0.052, 8), wobble: 0.11, seed: 29, sub: 2 },
    { k: 'tube', pts: [X(-0.085), Y(0.38), X(-0.19), Y(0.20), X(-0.165), Y(0.055)], r0: h * 0.08, r1: h * 0.048, wobble: 0.05, seed: 23 },
    { k: 'ell', x: X(-0.188), y: Y(0.195), rx: h * 0.058, ry: h * 0.05, rot: -0.2 },
    { k: 'curve', pts: [X(-0.275), Y(0.012), X(-0.285), Y(0.05), X(-0.215), Y(0.078), X(-0.12), Y(0.07), X(-0.09), Y(0.038), X(-0.13), Y(0.01)], wobble: 0.05, seed: 24, sub: 2 },
  ], { h, formK: 0.5, creases: [
    { x0: X(-0.325), y0: Y(0.515), x1: X(-0.30), y1: Y(0.44), r: h * 0.018, a: 0.45 },   // inside the far elbow
    { x0: X(-0.145), y0: Y(0.225), x1: X(-0.16), y1: Y(0.17), r: h * 0.018, a: 0.4 },    // far knee
  ] });

  // 2. The hide: torso, gut, neck, skull, ears, near leg and foot -- one mass.
  const hide: Part[] = [
    { k: 'curve', pts: [X(-0.235), Ys + h * 0.012, X(-0.125), Ys - h * 0.022, X(0.125), Ys - h * 0.022, X(0.245), Ys + h * 0.012, X(0.255), Y(0.545), X(0.225), Y(0.40), X(-0.215), Y(0.40), X(-0.245), Y(0.545)], wobble: 0.035, seed: 1, sub: 3 },
    { k: 'ell', x: X(0.0), y: Y(0.49) + b * 0.4, rx: h * 0.215, ry: h * 0.115 },
    { k: 'cap', x0: X(-0.008), y0: Y(0.665), x1: X(0.008), y1: Y(0.785) - b * 0.6, r0: h * 0.075, r1: h * 0.064 },
    { k: 'curve', pts: ring(X(0.0), hy, hr, 12, 0.14, 0.08), wobble: 0.04, seed: 5, sub: 2 },
    { k: 'ell', x: X(0.0), y: hy - h * 0.014, rx: h * 0.118, ry: h * 0.036 },
    { k: 'ell', x: X(0.006), y: hy + h * 0.066, rx: h * 0.096, ry: h * 0.05 },
    { k: 'ell', x: X(0.122), y: hy + h * 0.036, rx: h * 0.024, ry: h * 0.042, rot: 0.35 },
    { k: 'ell', x: X(-0.119), y: hy + h * 0.036, rx: h * 0.022, ry: h * 0.04, rot: -0.35 },
    { k: 'tube', pts: [X(0.09), Y(0.38), X(0.195), Y(0.20), X(0.17), Y(0.05)], r0: h * 0.086, r1: h * 0.05, wobble: 0.05, seed: 8 },
    { k: 'ell', x: X(0.193), y: Y(0.195), rx: h * 0.062, ry: h * 0.052, rot: 0.2 },
    { k: 'curve', pts: [X(0.075), Y(0.01), X(0.065), Y(0.05), X(0.14), Y(0.08), X(0.255), Y(0.072), X(0.285), Y(0.036), X(0.235), Y(0.008)], wobble: 0.05, seed: 9, sub: 2 },
  ];
  blob(ctx, B, p.base, hide, { h, tex: 'stipple', seed: 11, amount: 0.5, formK: 0.55, creases: [
    { x0: X(-0.075), y0: Y(0.775) - b, x1: X(-0.13), y1: Y(0.685) - b, r: h * 0.022, a: 0.5 },  // far side of the neck
    { x0: X(0.075), y0: Y(0.775) - b, x1: X(0.13), y1: Y(0.685) - b, r: h * 0.022, a: 0.5 },    // near side
    { x0: X(-0.095), y0: hy + h * 0.008, x1: X(0.095), y1: hy + h * 0.008, r: h * 0.018, a: 0.42 }, // under the brow
    { x0: X(-0.185), y0: Ys - h * 0.025, x1: X(-0.23), y1: Y(0.575), r: h * 0.022, a: 0.32 },   // far trapezius
    { x0: X(0.19), y0: Ys - h * 0.025, x1: X(0.235), y1: Y(0.575), r: h * 0.022, a: 0.32 },     // near trapezius
    { x0: X(-0.155), y0: Y(0.555), x1: X(0.175), y1: Y(0.545), r: h * 0.023, a: 0.3 },          // the gut fold
    { x0: X(0.125), y0: Y(0.225), x1: X(0.145), y1: Y(0.165), r: h * 0.019, a: 0.5 },           // behind the near knee
    { x0: X(0.18), y0: Y(0.05), x1: X(0.19), y1: Y(0.016), r: h * 0.008, a: 0.4 },              // toes
    { x0: X(0.225), y0: Y(0.05), x1: X(0.232), y1: Y(0.016), r: h * 0.008, a: 0.4 },
  ] });

  // 3. Paler belly, chest and jaw, inside the hide with no line.
  blob(ctx, B, p.light, [
    { k: 'ell', x: X(0.0), y: Y(0.475) + b * 0.4, rx: h * 0.15, ry: h * 0.085 },
    { k: 'ell', x: X(0.0), y: Y(0.615), rx: h * 0.155, ry: h * 0.048 },
    { k: 'cap', x0: X(-0.06), y0: hy + h * 0.085, x1: X(0.068), y1: hy + h * 0.085, r0: h * 0.036 },
  ], { outline: false, formK: 0.3 });

  // 4. The kilt: half the old height, a rope belt rolled at the top and a genuinely torn hem, so
  //    the bowed legs read as legs rather than as notches cut from a barrel.
  blob(ctx, B, leather, [
    { k: 'curve', pts: [X(-0.25), Y(0.455), X(0.25), Y(0.455), X(0.275), Y(0.385), X(0.0), Y(0.37), X(-0.275), Y(0.385)], wobble: 0.04, seed: 12, sub: 3 },
    { k: 'poly', pts: tatters(X(-0.275), X(0.275), Y(0.42), Y(0.37), 9, 5, h * 0.052) },
  ], { h, tex: 'folds', seed: 14, amount: 0.9, formK: 0.45, creases: [
    { x0: X(-0.05), y0: Y(0.445), x1: X(-0.03), y1: Y(0.36), r: h * 0.015, a: 0.3 },
    { x0: X(0.14), y0: Y(0.445), x1: X(0.16), y1: Y(0.36), r: h * 0.015, a: 0.3 },
  ] });
  blob(ctx, B, rope, [
    { k: 'tube', pts: [X(-0.25), Y(0.462), X(0.0), Y(0.449), X(0.25), Y(0.462)], r0: h * 0.018, r1: h * 0.018, wobble: 0.22, seed: 15 },
  ], { formK: 0.6 });
  // Shin wraps: dark bands, no ink.
  for (let i = 0; i < 3; i++) {
    const yy = Y(0.135 - i * 0.04);
    softLine(ctx, B, [X(0.115), yy + h * 0.006, X(0.232), yy - h * 0.004], wrap, h * 0.012, 0.55);
    softLine(ctx, B, [X(-0.225), yy + h * 0.008, X(-0.11), yy], wrap, h * 0.012, 0.5);
  }

  // 5. The near arm, its own mass crossing in front of the torso: a contact shadow under it first,
  //    then the upper arm swung out past the ribs, a bent elbow and a forearm angling back in.
  softLine(ctx, B, [X(0.30), Y(0.455), X(0.11), Y(0.49), X(-0.02), Y(0.495)], p.base, h * 0.05, 0.42);
  const fx = X(0.055), fy = Y(0.545), ux = 0.707, uy = -0.707, px2 = 0.707, py2 = 0.707;
  blob(ctx, B, p.base, [
    { k: 'tube', pts: [X(0.185), Ys - h * 0.005, X(0.305), Y(0.60), X(0.345), Y(0.495)], r0: h * 0.064, r1: h * 0.05, wobble: 0.06, seed: 30 },
    { k: 'tube', pts: [X(0.345), Y(0.495), X(0.21), Y(0.518), X(0.105), Y(0.542)], r0: h * 0.05, r1: h * 0.042, wobble: 0.06, seed: 31 },
    { k: 'curve', pts: ring(fx, fy, h * 0.053, 9), wobble: 0.08, seed: 32, sub: 2 },
  ], { h, tex: 'stipple', seed: 36, amount: 0.35, formK: 0.6, creases: [
    { x0: X(0.245), y0: Y(0.565), x1: X(0.325), y1: Y(0.525), r: h * 0.02, a: 0.5 },   // the inside of the elbow
    { x0: X(0.115), y0: Y(0.575), x1: X(0.115), y1: Y(0.515), r: h * 0.012, a: 0.4 },  // the wrist
  ] });

  // 6. The club, held low and swung up across the body on a long diagonal: it lies in front of the
  //    arm, its butt over the far hip and its knotted head above the near shoulder, so the shaft
  //    crosses the torso and cannot read as a prop standing beside it.
  const bx = X(-0.20), by = Y(0.305), kx = X(0.355) + sw, ky = Y(0.865);
  blob(ctx, B, wood, [
    { k: 'tube', pts: [bx, by, X(0.05) + sw * 0.35, Y(0.555), X(0.315) + sw * 0.85, Y(0.815)], r0: h * 0.025, r1: h * 0.042, wobble: 0.1, seed: 17 },
    { k: 'curve', pts: ring(kx, ky, h * 0.065, 9), wobble: 0.13, seed: 18, sub: 2 },
  ], { h, tex: 'cracks', seed: 19, amount: 1.3, formK: 0.6 });
  ctx.fillStyle = B.col(shade('#b8bcc4', tone));
  for (let i = 0; i < 3; i++) {
    const t = 0.22 + i * 0.22;
    ctx.beginPath(); ctx.arc(kx + (bx - kx) * t * 0.42 - h * 0.012, ky + (by - ky) * t * 0.42, Math.max(1, h * 0.01), 0, Math.PI * 2); ctx.fill();
  }

  // 6b. The grip: fingers closed over the shaft with the thumb laid across them.
  const grip: Part[] = [{ k: 'tube', pts: [fx + px2 * h * 0.01 - ux * h * 0.044, fy + py2 * h * 0.01 - uy * h * 0.044, fx - px2 * h * 0.046 + ux * h * 0.024, fy - py2 * h * 0.046 + uy * h * 0.024], r0: h * 0.022, r1: h * 0.015, wobble: 0.05, seed: 33 }];
  const creases: Crease[] = [];
  for (let i = 0; i < 3; i++) {
    const d = (i - 1) * h * 0.036;
    grip.push({ k: 'tube', pts: [fx + ux * d - px2 * h * 0.048, fy + uy * d - py2 * h * 0.048, fx + ux * d + px2 * h * 0.03, fy + uy * d + py2 * h * 0.03], r0: h * 0.018, r1: h * 0.015, wobble: 0.05, seed: 34 + i });
    const e = d + h * 0.018;
    creases.push({ x0: fx + ux * e - px2 * h * 0.04, y0: fy + uy * e - py2 * h * 0.04, x1: fx + ux * e + px2 * h * 0.026, y1: fy + uy * e + py2 * h * 0.026, r: h * 0.005, a: 0.6 });
  }
  blob(ctx, B, p.base, grip, { h, formK: 0.65, creases });

  // 7. The face, on the lifted skull: brow ridge, deep-set eyes, a broad flat nose, a wide mouth
  //    with two up-tusks from the jutting jaw, and an ear crease each side.
  for (const sx of [X(-0.052), X(0.058)]) softLine(ctx, B, [sx - h * 0.022, hy + h * 0.008, sx + h * 0.022, hy + h * 0.008], p.base, h * 0.038, 0.6);
  softLine(ctx, B, [X(-0.104), hy - h * 0.012, X(-0.04), hy - h * 0.032, X(0.046), hy - h * 0.032, X(0.108), hy - h * 0.008], p.base, h * 0.024, 0.7);
  eye(ctx, X(-0.052), hy + h * 0.01, h * 0.018, p.amber, false);
  eye(ctx, X(0.058), hy + h * 0.01, h * 0.018, p.amber, false);
  softLine(ctx, B, [X(0.002), hy + h * 0.014, X(0.004), hy + h * 0.05], p.base, h * 0.032, 0.35);   // the nose bridge
  softLine(ctx, B, [X(-0.034), hy + h * 0.056, X(0.044), hy + h * 0.056], p.base, h * 0.024, 0.8);  // its broad flat base
  softLine(ctx, B, [X(-0.08), hy + h * 0.092, X(0.004), hy + h * 0.11, X(0.085), hy + h * 0.088], p.base, h * 0.024, 0.85);
  ctx.fillStyle = B.col(ivory); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = 1; ctx.lineJoin = 'round';
  for (const tx of [X(-0.064), X(0.07)]) {
    ctx.beginPath(); ctx.moveTo(tx - h * 0.023, hy + h * 0.108); ctx.lineTo(tx + h * 0.004, hy + h * 0.016); ctx.lineTo(tx + h * 0.023, hy + h * 0.104); ctx.closePath();
    ctx.stroke(); ctx.fill();
  }
  softLine(ctx, B, [X(0.128), hy + h * 0.016, X(0.136), hy + h * 0.05], p.base, h * 0.014, 0.5);
  softLine(ctx, B, [X(-0.125), hy + h * 0.016, X(-0.133), hy + h * 0.05], p.base, h * 0.014, 0.5);
}
