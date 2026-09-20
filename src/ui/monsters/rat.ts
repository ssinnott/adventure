// The giant rat, on a brown rat's build: a chunky body with the back arched highest over the loins,
// a blunt wedge head carried low and forward, small rounded ears set well back on the skull, small
// beady eyes, and a thick tapering scaly tail a little shorter than the head and body. It stands on
// four legs with daylight under the belly; the hind legs are much the heavier and the hind feet lie
// flat along the ground, the front paws small and hand-like. Coarse grey-brown above, pale grey
// below, with bare pink extremities. Idle: the nose and whiskers twitch, the tail sways.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glossBall, softLine, patch } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['rat'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  rat(ctx, x, y, h, p);
};

/** A lumpy ring of n points around (cx, cy), for skulls and ears. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number, out: number[]): number[] {
  out.length = 0;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; out.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return out;
}
const R1: number[] = [], R2: number[] = [], R3: number[] = [];

function rat(ctx: CanvasRenderingContext2D, x0: number, y: number, h: number, p: Paint): void {
  const br = p.breathe, tone = p.tone;
  const base = p.base, dark = p.dark, light = p.light;
  const fur = mix(base, light, 0.3);
  const bellyHex = mix(fur, shade('#d8d2c4', tone), 0.6);
  const skin = shade('#c98c86', tone), skinDim = shade('#9a6a68', tone);
  const ivory = shade('#e6dcae', tone);
  const x = x0 - h * 0.05;
  /** x in units of h from the mass centre. */
  const X = (u: number) => x + u * h;
  /** HEIGHT ABOVE THE GROUND LINE, in units of h. */
  const U = (u: number) => y - u * h;
  const b = br * h * 0.008;
  // The nose and whiskers twitch in bursts rather than continuously.
  const tf = p.frame % 96, twitch = tf < 12 ? Math.sin(tf / 12 * Math.PI) : 0;
  const sway = Math.sin(p.frame / 26) * h * 0.03;

  groundShadow(ctx, X(-0.06), y + 1, h * 1.5);

  // The tail: thick at the root and tapering hard, a little shorter than the head and body, lying
  // out behind with an S in it. Bare skin, so it is its own mass and its own colour.
  blob(ctx, B, skinDim, [
    { k: 'tube', pts: [X(-0.37), U(0.62), X(-0.63), U(0.555), X(-0.88), U(0.40) + sway * 0.4, X(-1.08), U(0.20) + sway], r0: h * 0.05, r1: h * 0.011, wobble: 0.03, seed: 21 },
  ], { h, formK: 0.55, spread: 0.8 });
  patch(ctx, B, shade(skinDim, 0.7), [
    { k: 'tube', pts: [X(-0.39), U(0.645), X(-0.63), U(0.585) + sway * 0.2, X(-0.88), U(0.435) + sway * 0.5], r0: h * 0.022, r1: h * 0.008 },
  ], { alpha: 0.55, feather: 0.5 });
  if (h >= 40 && !B.override) {
    // Scale rings, which is what says "rat tail" rather than "rope".
    ctx.strokeStyle = rgba(shade(skinDim, 0.72), 0.5); ctx.lineWidth = Math.max(1, h * 0.006);
    for (let i = 1; i < 9; i++) {
      const t = i / 9, tx = X(-0.37 - t * 0.71), ty = U(0.62 - t * t * 0.42 - t * 0.02) + sway * t * 0.8, r = h * (0.05 - t * 0.038);
      ctx.beginPath(); ctx.moveTo(tx, ty - r); ctx.lineTo(tx + h * 0.012, ty + r); ctx.stroke();
    }
  }

  // Far legs behind: a small front paw and the bigger hind, both a step darker.
  blob(ctx, B, dark, [
    { k: 'tube', pts: [X(0.125), U(0.28), X(0.155), U(0.15), X(0.165), U(0.03)], r0: h * 0.044, r1: h * 0.028 },
    { k: 'tube', pts: [X(-0.29), U(0.38), X(-0.20), U(0.20), X(-0.29), U(0.085)], r0: h * 0.058, r1: h * 0.033 },
    { k: 'ell', x: X(-0.24), y: U(0.03), rx: h * 0.075, ry: h * 0.026, rot: 0.05 },
  ], { h, formK: 0.4 });

  // The body: one fur mass. The back arches highest over the LOINS, not the shoulder, which is the
  // line that says rodent; the shoulders are narrower than the haunches and the head is carried low
  // and forward on a neck you can barely see.
  const body: Part[] = [
    { k: 'curve', pts: [
      X(-0.40), U(0.60), X(-0.32), U(0.825) + b, X(-0.13), U(0.87) + b, X(0.08), U(0.80) + b,
      X(0.27), U(0.68), X(0.42), U(0.56), X(0.42), U(0.40),
      X(0.22), U(0.26), X(-0.04), U(0.235), X(-0.26), U(0.28), X(-0.40), U(0.40),
    ], wobble: 0.035, spiky: 0.05, seed: 1, sub: 3 },
    // The haunch: a rat's back end is its heaviest part.
    { k: 'ell', x: X(-0.24), y: U(0.52), rx: h * 0.185, ry: h * 0.20, rot: -0.1 },
    { k: 'ell', x: X(0.12), y: U(0.52), rx: h * 0.14, ry: h * 0.15 },
  ];
  // Near legs: a small front paw tucked under the chest, a big angled hind leg with a flat foot.
  body.push({ k: 'tube', pts: [X(0.235), U(0.30), X(0.265), U(0.16), X(0.275), U(0.03)], r0: h * 0.05, r1: h * 0.03 });
  body.push({ k: 'tube', pts: [X(-0.20), U(0.40), X(-0.095), U(0.21), X(-0.185), U(0.075)], r0: h * 0.065, r1: h * 0.036 });
  blob(ctx, B, fur, body, { h, tex: 'fur', seed: 3, amount: 0.55, formK: 0.5, spread: 0.85, creases: [
    { x0: X(0.16), y0: U(0.74), x1: X(0.15), y1: U(0.36), r: h * 0.028, a: 0.26 },   // behind the shoulder
    { x0: X(-0.14), y0: U(0.72), x1: X(-0.12), y1: U(0.36), r: h * 0.026, a: 0.24 }, // in front of the haunch
    { x0: X(-0.135), y0: U(0.23), x1: X(-0.20), y1: U(0.14), r: h * 0.022, a: 0.3 },  // the hock
  ] });

  // The head: its own wedge over the shoulder, blunt at the nose the way a brown rat's is rather
  // than drawn out to a point like a shrew's.
  const hx = X(0.375), hy = U(0.515);
  const rH = h * 0.175;
  blob(ctx, B, shade(fur, 0.97), [
    { k: 'curve', pts: [
      hx - rH * 1.1, hy - rH * 0.5, hx - rH * 0.2, hy - rH * 0.86, hx + rH * 0.55, hy - rH * 0.7,
      hx + rH * 1.15, hy - rH * 0.3, hx + rH * 1.32, hy + rH * 0.12,
      hx + rH * 1.12, hy + rH * 0.5, hx + rH * 0.3, hy + rH * 0.72, hx - rH * 0.7, hy + rH * 0.6,
    ], wobble: 0.035, spiky: 0.04, seed: 11, sub: 3 },
  ], { h, tex: 'fur', seed: 12, amount: 0.45, formK: 0.5, spread: 0.85, creases: [
    { x0: hx - rH * 0.9, y0: hy - rH * 0.4, x1: hx - rH * 0.8, y1: hy + rH * 0.45, r: rH * 0.16, a: 0.24 },
  ] });

  // Ears: small, round and set well back, with a bare pink bowl inside. A brown rat's ear does not
  // reach its eye if folded forward, which is what tells it from a black rat.
  blob(ctx, B, shade(fur, 0.9), [
    { k: 'curve', pts: ring(hx - rH * 0.62, hy - rH * 1.02, rH * 0.42, rH * 0.44, 9, R1), wobble: 0.06, seed: 13, sub: 2 },
  ], { h, formK: 0.55 });
  blob(ctx, B, shade(fur, 0.99), [
    { k: 'curve', pts: ring(hx + rH * 0.06, hy - rH * 1.04, rH * 0.46, rH * 0.48, 9, R2), wobble: 0.06, seed: 14, sub: 2 },
  ], { h, formK: 0.6 });
  if (h >= 26) {
    patch(ctx, B, skin, [{ k: 'ell', x: hx + rH * 0.09, y: hy - rH * 0.99, rx: rH * 0.28, ry: rH * 0.3 }], { alpha: 0.8, feather: 0.35 });
  }

  // Pale underside, from the chin along the belly: the counter-shading every rodent carries.
  patch(ctx, B, bellyHex, [
    { k: 'curve', pts: [X(0.28), U(0.40), X(0.08), U(0.335), X(-0.12), U(0.315), X(-0.26), U(0.35), X(-0.22), U(0.275), X(0.04), U(0.25), X(0.26), U(0.30)], wobble: 0.08, spiky: 0.06, seed: 22, sub: 2 },
    { k: 'cap', x0: hx - rH * 0.5, y0: hy + rH * 0.6, x1: hx + rH * 1.0, y1: hy + rH * 0.42, r0: rH * 0.26, r1: rH * 0.2 },
  ], { alpha: 0.38, feather: 0.75 });

  // Nose, whiskers, incisors and the beady eye.
  const nx = hx + rH * 1.3 + twitch * h * 0.012, ny = hy + rH * 0.14;
  glossBall(ctx, B, nx, ny, rH * 0.2, skin, { gloss: 0.5 });
  if (!B.override && h >= 24) {
    ctx.strokeStyle = rgba(shade('#f4eee0', tone), 0.55); ctx.lineWidth = Math.max(1, h * 0.006); ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      const a = -0.35 + i * 0.3 + twitch * 0.12;
      ctx.beginPath(); ctx.moveTo(nx - rH * 0.1, ny + rH * 0.08);
      ctx.quadraticCurveTo(nx + rH * 0.6, ny + rH * 0.08 + a * rH * 1.0, nx + rH * 1.25, ny + rH * 0.16 + a * rH * 2.2);
      ctx.stroke();
    }
  }
  // Two chisel incisors under the nose, angled back into the mouth.
  if (h >= 22 && !B.override) {
    ctx.fillStyle = B.col(ivory);
    for (const d of [0, 1]) {
      const ix = nx - rH * 0.22 + d * rH * 0.13, iy = ny + rH * 0.2;
      ctx.beginPath(); ctx.moveTo(ix - rH * 0.05, iy); ctx.lineTo(ix + rH * 0.05, iy); ctx.lineTo(ix + rH * 0.02, iy + rH * 0.34); ctx.closePath(); ctx.fill();
    }
  }
  softLine(ctx, B, [hx + rH * 0.5, hy + rH * 0.48, hx + rH * 1.12, hy + rH * 0.34], fur, Math.max(1, rH * 0.12), 0.45);
  // The eye: small, dark and beady, set midway between ear and nose.
  const ex = hx + rH * 0.28, ey = hy - rH * 0.22;
  eye(ctx, ex, ey, rH * 0.17, shade('#1c1216', Math.max(0.7, tone)), false);
  if (h >= 34 && !B.override) { ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.arc(ex - rH * 0.06, ey - rH * 0.06, Math.max(0.6, rH * 0.05), 0, Math.PI * 2); ctx.fill(); }
  // Toes on the near feet, so they read as feet rather than stumps.
  if (h >= 38 && !B.override) {
    ctx.strokeStyle = rgba(shade(skinDim, 0.8), 0.7); ctx.lineWidth = Math.max(1, h * 0.006);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.moveTo(X(-0.185) + i * h * 0.02, U(0.055)); ctx.lineTo(X(-0.16) + i * h * 0.028, y - h * 0.004); ctx.stroke();
    }
  }
  void R3;
}
