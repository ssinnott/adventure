// The giant rat, painted: a hunched arched back with the rump highest, a wedge head held low at the
// front, a long naked tail curling behind, big round pink ears, a wet pink nose, a beady amber eye,
// whiskers and two yellowed incisors. Body, haunch, head and near legs are ONE fur mass (blob) with
// a lumpy, slightly spiky contour; the tail is a bending tube of naked skin; the ears a pale lumpy
// blob; the belly a pale patch with no line. Three-quarter view so the head is nearest and largest.
// Idle: the nose and whiskers twitch now and then, the tail sways slowly.
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
  const w = h * 1.6, br = p.breathe, tone = p.tone;
  // The drawing's mass sits left of the head; shift so the whole rat is centred on x0.
  const x = x0 - w * 0.1;
  const base = p.base, dark = p.dark, light = p.light;
  const pink = shade('#d8908c', tone), belly = mix(base, mix(light, shade('#c8b8a0', tone), 0.5), 0.55);
  const tail = mix(base, shade('#c89a90', tone), 0.45), ivory = shade('#e8d890', tone), whisker = shade('#e8e0d0', tone);
  const b = br * h * 0.008;
  // A quick nose twitch every couple of seconds; a slow tail sway.
  const tf = p.frame % 110, tw = tf < 10 ? Math.sin(tf / 10 * Math.PI) : 0;
  const sway = br * h * 0.06;

  groundShadow(ctx, x, y + 1, w * 1.05);
  // Tail first, behind everything: naked skin, its own material, out from the rump and curling forward.
  blob(ctx, B, tail, [
    { k: 'tube', pts: [x - w * 0.38, y - h * 0.3, x - w * 0.62, y - h * 0.52 + sway, x - w * 0.8, y - h * 0.24 + sway * 0.6, x - w * 0.84, y - h * 0.05, x - w * 0.6, y - h * 0.03], r0: h * 0.065, r1: h * 0.02, wobble: 0.06, seed: 11, gloss: 0.15 },
  ], { h, formK: 0.6 });
  // Far legs: a darker mass behind the body.
  blob(ctx, B, dark, [
    { k: 'cap', x0: x - w * 0.26, y0: y - h * 0.26, x1: x - w * 0.22, y1: y - h * 0.06, r0: h * 0.065, r1: h * 0.05 },
    { k: 'ell', x: x - w * 0.17, y: y - h * 0.045, rx: h * 0.085, ry: h * 0.04 },
    { k: 'cap', x0: x + w * 0.1, y0: y - h * 0.26, x1: x + w * 0.1, y1: y - h * 0.06, r0: h * 0.06, r1: h * 0.05 },
    { k: 'ell', x: x + w * 0.15, y: y - h * 0.045, rx: h * 0.08, ry: h * 0.04 },
  ], { h, formK: 0.4 });
  // Far ear, behind the skull.
  blob(ctx, B, shade(light, 0.85), [{ k: 'curve', pts: ring(x + w * 0.2, y - h * 0.75 + b, h * 0.12, h * 0.125, 8, R1), wobble: 0.06, seed: 5, sub: 2 }], { h, formK: 0.5 });

  // The fur: body, haunch, head, skull, near legs and feet as one mass.
  const nx = x + w * 0.61, ny = y - h * 0.31;
  const fur: Part[] = [
    { k: 'curve', pts: [
      x - w * 0.44, y - h * 0.3, x - w * 0.48, y - h * 0.6, x - w * 0.3, y - h * 0.9 + b, x - w * 0.08, y - h * 0.97 + b,
      x + w * 0.14, y - h * 0.84 + b, x + w * 0.3, y - h * 0.58, x + w * 0.32, y - h * 0.32, x + w * 0.16, y - h * 0.1,
      x - w * 0.1, y - h * 0.05, x - w * 0.36, y - h * 0.08,
    ], wobble: 0.04, spiky: 0.05, seed: 1, sub: 3 },
    { k: 'ball', x: x - w * 0.25, y: y - h * 0.5, r: h * 0.33 },
    { k: 'curve', pts: ring(x + w * 0.34, y - h * 0.52 + b * 0.5, h * 0.22, h * 0.2, 10, R2), wobble: 0.05, spiky: 0.03, seed: 3, sub: 2 },
    { k: 'cap', x0: x + w * 0.3, y0: y - h * 0.5 + b * 0.5, x1: nx, y1: ny, r0: h * 0.25, r1: h * 0.07 },
    { k: 'cap', x0: x - w * 0.16, y0: y - h * 0.24, x1: x - w * 0.1, y1: y - h * 0.07, r0: h * 0.08, r1: h * 0.06 },
    { k: 'ell', x: x - w * 0.04, y: y - h * 0.045, rx: h * 0.095, ry: h * 0.045 },
    { k: 'cap', x0: x + w * 0.2, y0: y - h * 0.26, x1: x + w * 0.22, y1: y - h * 0.07, r0: h * 0.07, r1: h * 0.055 },
    { k: 'ell', x: x + w * 0.28, y: y - h * 0.045, rx: h * 0.09, ry: h * 0.045 },
  ];
  blob(ctx, B, base, fur, { h, tex: 'fur', seed: 1, amount: 0.7, formK: 0.55, creases: [
    { x0: x + w * 0.24, y0: y - h * 0.76 + b, x1: x + w * 0.16, y1: y - h * 0.4, r: h * 0.035, a: 0.4 },
    { x0: x - w * 0.24, y0: y - h * 0.3, x1: x - w * 0.12, y1: y - h * 0.22, r: h * 0.03, a: 0.3 },
    { x0: x + w * 0.14, y0: y - h * 0.3, x1: x + w * 0.2, y1: y - h * 0.24, r: h * 0.025, a: 0.25 },
    { x0: x + w * 0.4, y0: y - h * 0.33, x1: x + w * 0.56, y1: y - h * 0.26, r: h * 0.02, a: 0.2 },
  ] });
  // Pale belly and throat, inside the fur, no line.
  patch(ctx, B, belly, [
    { k: 'ell', x: x - w * 0.06, y: y - h * 0.12, rx: w * 0.25, ry: h * 0.1, rot: 0.06 },
    { k: 'cap', x0: x + w * 0.3, y0: y - h * 0.3, x1: x + w * 0.52, y1: y - h * 0.24, r0: h * 0.08, r1: h * 0.05 },
  ], { alpha: 0.68, feather: 0.55 });
  // Near ear: a pale lumpy round with its pink inside.
  blob(ctx, B, light, [{ k: 'curve', pts: ring(x + w * 0.35, y - h * 0.74 + b, h * 0.14, h * 0.145, 9, R3), wobble: 0.06, seed: 6, sub: 2 }], { h, formK: 0.55 });
  if (h > 24) blob(ctx, B, pink, [{ k: 'ell', x: x + w * 0.355, y: y - h * 0.725 + b, rx: h * 0.08, ry: h * 0.085 }], { outline: false, formK: 0.7, spread: 0.6 });
  // Claws on the near feet.
  if (h > 30) {
    const cw = Math.max(1, h * 0.03);
    ctx.fillStyle = B.col(whisker);
    for (const fx of [x + w * 0.02, x + w * 0.34]) { ctx.fillRect(Math.round(fx + h * 0.02), Math.round(y - h * 0.06), cw, cw); ctx.fillRect(Math.round(fx + h * 0.04), Math.round(y - h * 0.025), cw, cw); }
  }
  // Beady eye under a brow, a wet pink nose, whiskers and the incisors.
  softLine(ctx, B, [x + w * 0.36, y - h * 0.58 + b * 0.5, x + w * 0.46, y - h * 0.55 + b * 0.5], base, h * 0.03, 0.45);
  eye(ctx, x + w * 0.42, y - h * 0.5 + b * 0.5, h * 0.06, p.amber);
  softLine(ctx, B, [x + w * 0.46, y - h * 0.36, x + w * 0.58, y - h * 0.3], base, h * 0.025, 0.5);
  glossBall(ctx, B, nx + h * 0.03, ny - tw * 0.8, h * 0.06, pink, { gloss: 0.6 });
  ctx.strokeStyle = B.col(rgba(whisker, 0.75)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = -1; i <= 1; i++) {
    const a = i * 0.3 - 0.12 - tw * 0.25;
    ctx.moveTo(nx - h * 0.04, ny - h * 0.01); ctx.lineTo(nx - h * 0.04 + Math.cos(a) * h * 0.26, ny - h * 0.01 + Math.sin(a) * h * 0.26);
  }
  ctx.stroke();
  ctx.fillStyle = B.col(ivory);
  const iw = Math.max(1, Math.round(h * 0.03)), ih = Math.max(2, Math.round(h * 0.09));
  ctx.fillRect(Math.round(nx - h * 0.05), Math.round(ny + h * 0.04), iw, ih);
  ctx.fillRect(Math.round(nx - h * 0.05) + iw + 1, Math.round(ny + h * 0.04), iw, ih);
}
