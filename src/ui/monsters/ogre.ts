// The ogre: a stooped, top-heavy brute painted as one mass of warty hide, a ragged hide kilt on a
// rope belt, wrapped shins, and a knotted club held up past the near shoulder. Three-quarter
// stance, weight on the near leg, head sunk low between the shoulders.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { shade, mix } from '../../lib/art/palettes.ts';
import { blob, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['ogre'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  ogre(ctx, x, y, h, p);
};

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

function ogre(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const X = (k: number) => x + h * k, Y = (k: number) => y - h * k;
  const b = p.breathe * h * 0.012;                    // a heavy breath: the shoulders and head rise
  const sw = Math.sin(p.frame / 45) * h * 0.018;      // a slow sway of the club
  const tone = p.tone;
  const leather = shade('#6e4a2a', tone), wrap = shade('#4a3826', tone), wood = shade('#5e3e22', tone);
  const rope = shade('#b09a62', tone), ivory = shade('#efe6cf', tone), hair = shade('#2a1e16', tone);
  const Ys = Y(0.72) - b;                              // the shoulder line

  groundShadow(ctx, X(0.02), y + 1, h * 0.72);

  // 1. The far arm, far leg and far foot: their own darker mass behind everything.
  blob(ctx, B, p.dark, [
    { k: 'tube', pts: [X(-0.3), Ys - h * 0.02, X(-0.44), Y(0.5), X(-0.42), Y(0.3)], r0: h * 0.08, r1: h * 0.06, wobble: 0.08, seed: 21 },
    { k: 'curve', pts: ring(X(-0.43), Y(0.26), h * 0.08, 8), wobble: 0.08, seed: 22, sub: 2 },
    { k: 'tube', pts: [X(-0.12), Y(0.38), X(-0.25), Y(0.21), X(-0.22), Y(0.06)], r0: h * 0.095, r1: h * 0.075, wobble: 0.05, seed: 23 },
    { k: 'curve', pts: [X(-0.36), Y(0.02), X(-0.34), Y(0.07), X(-0.24), Y(0.08), X(-0.13), Y(0.06), X(-0.11), Y(0.025), X(-0.16), Y(0.012), X(-0.32), Y(0.012)], wobble: 0.06, seed: 25, sub: 2 },
  ], { h, formK: 0.45, creases: [{ x0: X(-0.27), y0: Y(0.22), x1: X(-0.2), y1: Y(0.2), r: h * 0.025, a: 0.3 }] });

  // 2. The hide: torso, shoulders, gut, head, near arm and fist, near leg, near foot: one mass.
  const hide: Part[] = [
    { k: 'curve', pts: [X(-0.36), Ys - h * 0.02, X(-0.14), Ys - h * 0.07, X(0.12), Ys - h * 0.07, X(0.38), Ys - h * 0.01, X(0.35), Y(0.52), X(0.3), Y(0.36), X(-0.28), Y(0.36), X(-0.34), Y(0.52)], wobble: 0.04, seed: 1, sub: 3 },
    { k: 'curve', pts: ring(X(-0.32), Ys - h * 0.005, h * 0.13, 10), wobble: 0.05, seed: 2, sub: 2 },
    { k: 'curve', pts: ring(X(0.33), Ys - h * 0.015, h * 0.145, 10), wobble: 0.05, seed: 3, sub: 2 },
    { k: 'curve', pts: ring(X(0.03), Y(0.45) + b * 0.4, h * 0.21, 10), wobble: 0.04, seed: 4, sub: 2 },
    { k: 'curve', pts: ring(X(-0.02), Y(0.83) - b, h * 0.125, 12, 0.3, 0.06), wobble: 0.05, seed: 5, sub: 2 },
    { k: 'tube', pts: [X(0.33), Ys, X(0.5), Y(0.5), X(0.41), Y(0.6)], r0: h * 0.085, r1: h * 0.065, wobble: 0.07, seed: 6 },
    { k: 'tube', pts: [X(0.14), Y(0.38), X(0.23), Y(0.22), X(0.21), Y(0.06)], r0: h * 0.1, r1: h * 0.08, wobble: 0.05, seed: 8 },
    { k: 'curve', pts: [X(0.09), Y(0.02), X(0.11), Y(0.08), X(0.22), Y(0.09), X(0.35), Y(0.06), X(0.37), Y(0.025), X(0.33), Y(0.012), X(0.13), Y(0.012)], wobble: 0.06, seed: 26, sub: 2 },
  ];
  blob(ctx, B, p.base, hide, { h, tex: 'stipple', seed: 11, amount: 0.7, formK: 0.55, creases: [
    { x0: X(-0.14), y0: Y(0.7) - b, x1: X(0.1), y1: Y(0.7) - b, r: h * 0.035, a: 0.5 },    // under the jaw
    { x0: X(-0.16), y0: Y(0.88) - b, x1: X(-0.15), y1: Y(0.74) - b, r: h * 0.03, a: 0.4 }, // the head's far side sinks into the shoulder
    { x0: X(0.12), y0: Y(0.88) - b, x1: X(0.12), y1: Y(0.74) - b, r: h * 0.03, a: 0.4 },   // and the near side
    { x0: X(-0.2), y0: Ys - h * 0.09, x1: X(-0.24), y1: Y(0.6), r: h * 0.02, a: 0.28 },     // far shoulder seam
    { x0: X(0.22), y0: Ys - h * 0.1, x1: X(0.24), y1: Y(0.6), r: h * 0.02, a: 0.28 },       // near shoulder seam
    { x0: X(0.3), y0: Y(0.62), x1: X(0.36), y1: Y(0.56), r: h * 0.025, a: 0.35 },           // armpit
    { x0: X(-0.16), y0: Y(0.58) + b * 0.4, x1: X(0.2), y1: Y(0.57) + b * 0.4, r: h * 0.025, a: 0.3 }, // gut fold
    { x0: X(0.19), y0: Y(0.23), x1: X(0.27), y1: Y(0.21), r: h * 0.025, a: 0.3 },           // knee
    { x0: X(0.27), y0: Y(0.06), x1: X(0.28), y1: Y(0.01), r: h * 0.008, a: 0.35 },          // toes
    { x0: X(0.32), y0: Y(0.05), x1: X(0.33), y1: Y(0.01), r: h * 0.008, a: 0.35 },
  ] });

  // 3. Paler belly, chest and jaw, inside the hide with no line.
  blob(ctx, B, p.light, [
    { k: 'ell', x: X(0.03), y: Y(0.43) + b * 0.4, rx: h * 0.15, ry: h * 0.11 },
    { k: 'ell', x: X(0.02), y: Y(0.6), rx: h * 0.17, ry: h * 0.06 },
    { k: 'cap', x0: X(-0.1), y0: Y(0.76) - b, x1: X(0.06), y1: Y(0.76) - b, r0: h * 0.05 },
  ], { outline: false, formK: 0.3 });

  // 4. The hide kilt with a ragged hem, and the wrapped shins: one leather.
  blob(ctx, B, leather, [
    { k: 'curve', pts: [X(-0.31), Y(0.41), X(0.31), Y(0.41), X(0.34), Y(0.29), X(-0.33), Y(0.28)], wobble: 0.04, seed: 12, sub: 3 },
    { k: 'curve', pts: [X(-0.32), Y(0.31), X(0.33), Y(0.31), X(0.35), Y(0.2), X(0.02), Y(0.17), X(-0.35), Y(0.19)], wobble: 0.06, spiky: 0.09, seed: 13, sub: 3 },
    { k: 'cap', x0: X(0.23), y0: Y(0.2), x1: X(0.21), y1: Y(0.08), r0: h * 0.085, r1: h * 0.08 },
    { k: 'cap', x0: X(-0.25), y0: Y(0.19), x1: X(-0.22), y1: Y(0.08), r0: h * 0.08, r1: h * 0.075 },
  ], { h, tex: 'folds', seed: 14, amount: 1.2, formK: 0.45, creases: [
    { x0: X(-0.02), y0: Y(0.38), x1: X(0.0), y1: Y(0.22), r: h * 0.02, a: 0.3 },
  ] });
  // The wraps: dark bands around each shin, no ink.
  for (let i = 0; i < 3; i++) {
    const yy = Y(0.17 - i * 0.04);
    softLine(ctx, B, [X(0.14), yy + h * 0.005, X(0.31), yy - h * 0.005], wrap, h * 0.012, 0.6);
    softLine(ctx, B, [X(-0.33), yy + h * 0.008, X(-0.16), yy], wrap, h * 0.012, 0.6);
  }

  // 5. Rope belt with a knot, and bones tied to it.
  blob(ctx, B, rope, [
    { k: 'tube', pts: [X(-0.32), Y(0.42), X(0.0), Y(0.4), X(0.32), Y(0.42)], r0: h * 0.024, r1: h * 0.024, wobble: 0.3, seed: 15 },
    { k: 'ball', x: X(0.2), y: Y(0.4), r: h * 0.035 },
  ], { formK: 0.6 });
  blob(ctx, B, ivory, [
    { k: 'tube', pts: [X(-0.19), Y(0.4), X(-0.23), Y(0.28)], r0: h * 0.011, r1: h * 0.012 },
    { k: 'ball', x: X(-0.245), y: Y(0.275), r: h * 0.018 }, { k: 'ball', x: X(-0.215), y: Y(0.27), r: h * 0.016 },
    { k: 'cap', x0: X(-0.11), y0: Y(0.4), x1: X(-0.1), y1: Y(0.32), r0: h * 0.016, r1: h * 0.006 },
  ], { formK: 0.5 });

  // 6. The club, up past the near shoulder: a bending knotted trunk, cracks, a few iron studs.
  const cx0 = X(0.44), cy0 = Y(0.5), cx1 = X(0.5) + sw, cy1 = Y(0.99);
  blob(ctx, B, wood, [
    { k: 'tube', pts: [cx0, cy0, X(0.47) + sw * 0.4, Y(0.75), cx1, cy1 - h * 0.02], r0: h * 0.032, r1: h * 0.06, wobble: 0.12, seed: 17 },
    { k: 'curve', pts: ring(cx1, cy1 - h * 0.03, h * 0.068, 9), wobble: 0.12, seed: 18, sub: 2 },
    { k: 'ball', x: cx1 - h * 0.05, y: cy1 + h * 0.06, r: h * 0.032 },
  ], { h, tex: 'cracks', seed: 19, amount: 1.4, formK: 0.6 });
  ctx.fillStyle = B.col(shade('#b8bcc4', tone));
  for (let i = 0; i < 3; i++) {
    const t = 0.2 + i * 0.3, px = cx1 + (cx0 - cx1) * t * 0.35 - h * 0.02 + i * h * 0.01, py = cy1 + (cy0 - cy1) * t * 0.35 + h * 0.02;
    ctx.beginPath(); ctx.arc(px, py, Math.max(1, h * 0.012), 0, Math.PI * 2); ctx.fill();
  }
  // Fingers wrapped over the club: a little hide on top so the fist holds it.
  blob(ctx, B, p.base, [{ k: 'curve', pts: ring(X(0.42), Y(0.62), h * 0.075, 8), wobble: 0.1, seed: 24, sub: 2 }], { h, formK: 0.6, creases: [{ x0: X(0.38), y0: Y(0.6), x1: X(0.46), y1: Y(0.58), r: h * 0.012, a: 0.4 }] });
  softLine(ctx, B, [X(0.37), Y(0.64), X(0.47), Y(0.6)], p.base, h * 0.012, 0.35);

  // 7. The face: a heavy brow ridge with sunken sockets, small eyes, a wide mouth, two up-tusks, an ear, a topknot.
  const hy = Y(0.83) - b;
  for (const sx of [X(-0.065), X(0.04)]) softLine(ctx, B, [sx - h * 0.02, hy - h * 0.005, sx + h * 0.02, hy - h * 0.005], p.base, h * 0.05, 0.55);
  softLine(ctx, B, [X(-0.125), hy - h * 0.02, X(-0.04), hy - h * 0.045, X(0.02), hy - h * 0.045, X(0.095), hy - h * 0.015], p.base, h * 0.035, 0.8);
  eye(ctx, X(-0.065), hy, h * 0.016, p.amber, false); eye(ctx, X(0.04), hy, h * 0.016, p.amber, false);
  softLine(ctx, B, [X(-0.115), hy + h * 0.08, X(-0.02), hy + h * 0.095, X(0.08), hy + h * 0.075], p.base, h * 0.025, 0.85);
  ctx.fillStyle = B.col(ivory); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = 1; ctx.lineJoin = 'round';
  for (const tx of [X(-0.09), X(0.055)]) {
    ctx.beginPath(); ctx.moveTo(tx - h * 0.022, hy + h * 0.095); ctx.lineTo(tx + h * 0.002, hy + h * 0.01); ctx.lineTo(tx + h * 0.022, hy + h * 0.095); ctx.closePath();
    ctx.stroke(); ctx.fill();
  }
  softLine(ctx, B, [X(-0.145), hy - h * 0.01, X(-0.15), hy + h * 0.035], p.base, h * 0.02, 0.45);   // the ear crease
  blob(ctx, B, hair, [{ k: 'curve', pts: [X(-0.05), hy - h * 0.11, X(0.0), hy - h * 0.2, X(0.05), hy - h * 0.17, X(0.045), hy - h * 0.1], wobble: 0.08, spiky: 0.25, seed: 20, sub: 2 }], { h, formK: 0.5 });
  void mix;
}
