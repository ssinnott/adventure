// The giant rat, measured off a photograph rather than invented. In units of the sprite height,
// with the height taken up from the ground line: the belly rides at 0.17 and the back tops out at
// 0.86, so only a sixth of the animal is leg and it is long and low; the head is two fifths of the
// body's length with the eye at 0.67 and the nose at 0.50; the ears are big, round and cupped,
// reaching the full height; and the tail leaves the rump at 0.63 and ARCS UP and back over the
// animal rather than trailing on the ground. Coarse agouti brown above, a sharply demarcated cream
// belly, bare pink extremities. Idle: the nose and whiskers twitch, the tail sways.
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
  const bellyHex = mix(light, shade('#efe9dc', tone), 0.7);
  const skin = shade('#d9a09a', tone), skinDim = shade('#a87a76', tone);
  const ivory = shade('#e6dcae', tone);
  // The body runs from the rump at -0.78 to the nose at +0.72; centre the whole animal on x0.
  const x = x0 + h * 0.03;
  const X = (u: number) => x + u * h;
  const U = (u: number) => y - u * h;
  const b = br * h * 0.006;
  const tf = p.frame % 96, twitch = tf < 12 ? Math.sin(tf / 12 * Math.PI) : 0;
  const sway = Math.sin(p.frame / 26) * h * 0.035;

  groundShadow(ctx, X(-0.16), y + 1, h * 1.5);

  // The tail: leaves the rump in line with the back and arcs UP and over, thick at the root and
  // tapering to a point. Bare skin, so its own mass and its own colour.
  blob(ctx, B, skinDim, [
    { k: 'tube', pts: [X(-0.72), U(0.60), X(-0.94), U(0.76), X(-1.02), U(0.95) + sway * 0.5, X(-0.92), U(1.13) + sway], r0: h * 0.048, r1: h * 0.010, wobble: 0.025, seed: 21 },
  ], { h, formK: 0.55, spread: 0.8 });
  if (h >= 40 && !B.override) {
    ctx.strokeStyle = rgba(shade(skinDim, 0.72), 0.45); ctx.lineWidth = Math.max(1, h * 0.006);
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      const tx = X(-0.72 - Math.sin(t * 1.25) * 0.31), ty = U(0.60 + t * 0.53) + sway * t * 0.9, r = h * (0.048 - t * 0.036);
      ctx.beginPath(); ctx.moveTo(tx - r * 0.7, ty - r * 0.5); ctx.lineTo(tx + r * 0.7, ty + r * 0.5); ctx.stroke();
    }
  }

  // Far legs: short, mostly hidden under the body, a step darker.
  blob(ctx, B, dark, [
    { k: 'tube', pts: [X(0.13), U(0.22), X(0.155), U(0.10), X(0.16), U(0.025)], r0: h * 0.04, r1: h * 0.026 },
    { k: 'tube', pts: [X(-0.60), U(0.26), X(-0.53), U(0.12), X(-0.60), U(0.04)], r0: h * 0.05, r1: h * 0.03 },
    { k: 'ell', x: X(-0.545), y: U(0.025), rx: h * 0.08, ry: h * 0.024, rot: 0.03 },
  ], { h, formK: 0.4 });

  // The body: one fur mass, long and low, the back one smooth curve topping out behind the middle
  // and the belly only a sixth of the height off the ground.
  const body: Part[] = [
    { k: 'curve', pts: [
      X(-0.78), U(0.50), X(-0.72), U(0.74) + b, X(-0.50), U(0.855) + b, X(-0.24), U(0.86) + b,
      X(0.02), U(0.80) + b, X(0.20), U(0.68), X(0.26), U(0.50),
      X(0.10), U(0.22), X(-0.20), U(0.175), X(-0.50), U(0.19), X(-0.72), U(0.28),
    ], wobble: 0.03, spiky: 0.05, seed: 1, sub: 3 },
    { k: 'ell', x: X(-0.50), y: U(0.50), rx: h * 0.26, ry: h * 0.30, rot: -0.06 },   // the heavy hindquarters
    { k: 'ell', x: X(-0.02), y: U(0.48), rx: h * 0.19, ry: h * 0.24 },               // the shoulder
  ];
  // Near legs: short, the front paw tucked under the chest and the hind foot flat on the ground.
  body.push({ k: 'tube', pts: [X(0.22), U(0.24), X(0.245), U(0.12), X(0.25), U(0.03)], r0: h * 0.046, r1: h * 0.028 });
  body.push({ k: 'tube', pts: [X(-0.50), U(0.28), X(-0.415), U(0.13), X(-0.49), U(0.05)], r0: h * 0.06, r1: h * 0.034 });
  blob(ctx, B, fur, body, { h, tex: 'fur', seed: 3, amount: 0.6, formK: 0.45, spread: 0.85, creases: [
    { x0: X(0.04), y0: U(0.74), x1: X(0.02), y1: U(0.28), r: h * 0.028, a: 0.24 },   // behind the shoulder
    { x0: X(-0.28), y0: U(0.78), x1: X(-0.26), y1: U(0.26), r: h * 0.026, a: 0.2 },  // in front of the haunch
    { x0: X(-0.44), y0: U(0.16), x1: X(-0.50), y1: U(0.10), r: h * 0.022, a: 0.3 },  // the hock
  ] });

  // The head: two fifths of the body's length, its own mass over the shoulder, blunt at the nose.
  const hx = X(0.36), hy = U(0.60);
  const rH = h * 0.22;
  blob(ctx, B, shade(fur, 0.98), [
    { k: 'curve', pts: [
      hx - rH * 1.15, hy - rH * 0.62, hx - rH * 0.4, hy - rH * 0.92, hx + rH * 0.35, hy - rH * 0.76,
      hx + rH * 1.0, hy - rH * 0.42, hx + rH * 1.42, hy - rH * 0.12,
      hx + rH * 1.5, hy + rH * 0.2, hx + rH * 1.0, hy + rH * 0.46, hx + rH * 0.2, hy + rH * 0.66,
      hx - rH * 0.7, hy + rH * 0.72,
    ], wobble: 0.03, spiky: 0.04, seed: 11, sub: 3 },
  ], { h, tex: 'fur', seed: 12, amount: 0.5, formK: 0.45, spread: 0.85, creases: [
    { x0: hx - rH * 0.95, y0: hy - rH * 0.5, x1: hx - rH * 0.85, y1: hy + rH * 0.55, r: rH * 0.16, a: 0.2 },
  ] });

  // Ears: BIG, round and cupped, reaching the top of the sprite. On the reference they are nearly a
  // third of the head's length and are the loudest shape on the animal after the body.
  blob(ctx, B, shade(fur, 0.9), [
    { k: 'curve', pts: ring(hx - rH * 1.08, hy - rH * 1.02, rH * 0.42, rH * 0.48, 9, R1), wobble: 0.05, seed: 13, sub: 2 },
  ], { h, formK: 0.55 });
  blob(ctx, B, shade(fur, 1.0), [
    { k: 'curve', pts: ring(hx - rH * 0.52, hy - rH * 1.18, rH * 0.5, rH * 0.56, 10, R2), wobble: 0.05, seed: 14, sub: 2 },
  ], { h, formK: 0.6 });
  if (h >= 22) {
    patch(ctx, B, skin, [{ k: 'ell', x: hx - rH * 0.48, y: hy - rH * 1.14, rx: rH * 0.32, ry: rH * 0.37 }], { alpha: 0.85, feather: 0.3 });
    softLine(ctx, B, [hx - rH * 0.72, hy - rH * 0.98, hx - rH * 0.34, hy - rH * 1.0], skinDim, Math.max(1, rH * 0.1), 0.4);
  }

  // The cream belly, which on the reference meets the brown along a fairly SHARP line down the
  // flank rather than fading into it.
  patch(ctx, B, bellyHex, [
    { k: 'curve', pts: [X(0.19), U(0.38), X(-0.02), U(0.315), X(-0.28), U(0.29), X(-0.52), U(0.31), X(-0.62), U(0.21), X(-0.26), U(0.155), X(0.12), U(0.21)], wobble: 0.035, spiky: 0.04, seed: 22, sub: 3 },
    { k: 'cap', x0: hx - rH * 0.6, y0: hy + rH * 0.6, x1: hx + rH * 1.1, y1: hy + rH * 0.3, r0: rH * 0.26, r1: rH * 0.18 },
  ], { alpha: 0.72, feather: 0.28 });

  // Nose, whiskers, incisors, the beady eye.
  const nx = hx + rH * 1.46 + twitch * h * 0.01, ny = hy + rH * 0.06;
  glossBall(ctx, B, nx, ny, rH * 0.17, skin, { gloss: 0.5 });
  if (!B.override && h >= 24) {
    ctx.strokeStyle = rgba(shade('#f6f1e4', tone), 0.5); ctx.lineWidth = Math.max(1, h * 0.005); ctx.lineCap = 'round';
    for (let i = -2; i <= 2; i++) {
      const a = i * 0.26 + twitch * 0.1;
      ctx.beginPath(); ctx.moveTo(nx - rH * 0.1, ny + rH * 0.02);
      ctx.quadraticCurveTo(nx + rH * 0.55, ny + a * rH * 0.9, nx + rH * 1.15, ny + a * rH * 2.1);
      ctx.stroke();
    }
  }
  if (h >= 22 && !B.override) {
    ctx.fillStyle = B.col(ivory);
    for (const d of [0, 1]) {
      const ix = nx - rH * 0.2 + d * rH * 0.11, iy = ny + rH * 0.15;
      ctx.beginPath(); ctx.moveTo(ix - rH * 0.045, iy); ctx.lineTo(ix + rH * 0.045, iy); ctx.lineTo(ix + rH * 0.015, iy + rH * 0.3); ctx.closePath(); ctx.fill();
    }
  }
  softLine(ctx, B, [hx + rH * 0.55, hy + rH * 0.44, hx + rH * 1.24, hy + rH * 0.26], fur, Math.max(1, rH * 0.1), 0.4);
  const ex = hx + rH * 0.34, ey = hy - rH * 0.28;
  eye(ctx, ex, ey, rH * 0.16, shade('#150f12', Math.max(0.7, tone)), false);
  if (h >= 30 && !B.override) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(ex - rH * 0.055, ey - rH * 0.055, Math.max(0.6, rH * 0.05), 0, Math.PI * 2); ctx.fill(); }

  // Bare pink feet with long toes, which the reference wears as its brightest small shapes.
  if (h >= 30 && !B.override) {
    ctx.strokeStyle = rgba(skin, 0.85); ctx.lineWidth = Math.max(1, h * 0.012); ctx.lineCap = 'round';
    for (const [fx, fy, dir] of [[X(0.25), U(0.03), 1], [X(-0.49), U(0.05), -1]] as [number, number, number][]) {
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.moveTo(fx, fy);
        ctx.lineTo(fx + dir * h * (0.05 + i * 0.012), fy + h * 0.018 + Math.abs(i) * h * 0.006);
        ctx.stroke();
      }
    }
  }
  void R3;
}
