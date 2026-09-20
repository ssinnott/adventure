// The cellar slime, painted: a wet mound whose rim sags and bulges, sitting in its own puddle, with
// drips hanging off the rim, a darker core mass sunk off-centre inside, bubbles rising through the
// goo, a high gloss specular on the lit shoulder, two dark eye pits and a wide toothless gape.
// Every green comes from the def's tint. Idle: a slow wobble (wider as it settles lower) and the
// bubbles climbing.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { blob, lumpy, appendCurve, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['slime'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  slime(ctx, x, y, h, p);
};

/** Scratch for the mound's contour (16 numbers), filled in place each frame. */
const MOUND: number[] = new Array<number>(16).fill(0);
const CORE: number[] = new Array<number>(14).fill(0);
const PUDDLE: number[] = new Array<number>(12).fill(0);

/** A ring of n points around (cx, cy) written into out. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number, out: number[], rot = 0): number[] {
  for (let i = 0; i < n; i++) { const a = rot + i / n * Math.PI * 2; out[i * 2] = cx + Math.cos(a) * rx; out[i * 2 + 1] = cy + Math.sin(a) * ry; }
  return out;
}

function slime(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const wob = p.breathe;
  const w = h * 1.5 * (1 + wob * 0.035), hh = h * 0.86 * (1 - wob * 0.04);
  const base = p.base, dark = p.dark, light = p.light, tone = p.tone;
  // Nothing inside a slime is BLACK: a near-black core or eye socket stops reading as something
  // suspended in goo and reads as a hole punched clean through the body. Everything internal stays
  // on the creature's own green, only denser, and the cavities carry a lit rim so they read as
  // recessed rather than missing.
  const core = mix(dark, base, 0.3), pit = mix(shade(dark, 0.52), '#123018', 0.35);
  const lip = mix(light, shade('#ffffff', tone), 0.3);

  groundShadow(ctx, x, y + 1, w * 0.7);
  // The puddle it sits in: a flat wet sheet, its own mass.
  blob(ctx, B, dark, [{ k: 'curve', pts: ring(x + w * 0.02, y - h * 0.015, w * 0.58, h * 0.075, 6, PUDDLE), wobble: 0.08, seed: 4, sub: 3, gloss: 0.3 }], { h, formK: 0.3, spread: 0.7 });

  // The mound: one sagging contour, higher on the left, with drips hanging off the rim.
  let k = 0;
  const M = (px: number, py: number) => { MOUND[k++] = px; MOUND[k++] = py; };
  M(x - w * 0.5, y - hh * 0.04); M(x - w * 0.57, y - hh * 0.42); M(x - w * 0.42, y - hh * 0.8); M(x - w * 0.12, y - hh * 1.0);
  M(x + w * 0.16, y - hh * 0.93); M(x + w * 0.4, y - hh * 0.68); M(x + w * 0.53, y - hh * 0.3); M(x + w * 0.48, y - hh * 0.03);
  const parts: Part[] = [
    { k: 'curve', pts: MOUND, wobble: 0.07, seed: 2, sub: 3, gloss: 0.45 },
    { k: 'tube', pts: [x - w * 0.44, y - hh * 0.46, x - w * 0.52, y - hh * 0.3, x - w * 0.57, y - hh * 0.1 - wob * h * 0.02], r0: h * 0.055, r1: h * 0.035, wobble: 0.1, seed: 7, gloss: 0.4 },
    { k: 'tube', pts: [x + w * 0.42, y - hh * 0.38, x + w * 0.5, y - hh * 0.22, x + w * 0.56, y - hh * 0.06 + wob * h * 0.02], r0: h * 0.05, r1: h * 0.03, wobble: 0.1, seed: 8, gloss: 0.4 },
    { k: 'tube', pts: [x + w * 0.08, y - hh * 0.18, x + w * 0.12, y - hh * 0.08, x + w * 0.15, y - h * 0.005], r0: h * 0.04, r1: h * 0.03, wobble: 0.08, seed: 9, gloss: 0.3 },
  ];
  blob(ctx, B, base, parts, { h, formK: 0.45, spread: 0.85, gloss: 0.55 });
  if (B.override) return;

  // Inside the goo: the core mass, bubbles and the face, clipped to the mound.
  ctx.save();
  ctx.beginPath(); appendCurve(ctx, lumpy(MOUND, 0.07, 2, 3)); ctx.clip();
  // Core: a darker lump sunk low and off-centre, with a deeper nucleus, no line.
  blob(ctx, B, core, [{ k: 'curve', pts: ring(x + w * 0.28, y - hh * 0.5, w * 0.15, hh * 0.21, 7, CORE, 0.4), wobble: 0.09, seed: 5, sub: 2 }], { outline: false, formK: 0.9, spread: 0.55 });
  // The nucleus, kept close to the core's value and given the same lit rim the eye pits get; on its
  // own it was the darkest thing on the body and read as a puncture rather than something inside.
  const nx = x + w * 0.3, ny = y - hh * 0.46, nr = w * 0.07;
  ctx.fillStyle = rgba(lip, 0.28); ctx.beginPath(); ctx.ellipse(nx, ny, nr * 1.25, hh * 0.11, -0.3, 0, Math.PI * 2); ctx.fill();
  blob(ctx, B, mix(core, dark, 0.55), [{ k: 'ell', x: nx, y: ny, rx: nr, ry: hh * 0.088, rot: -0.3 }], { outline: false, formK: 0.8, spread: 0.5 });
  // Bubbles rising through the goo and leaving through the top.
  ctx.lineWidth = Math.max(1, h * 0.015);
  for (let i = 0; i < 4; i++) {
    const t = ((p.frame * 0.3 + i * 37) % 120) / 120;
    const bx = x - w * 0.28 + i * w * 0.17 + Math.sin(t * 7 + i * 2) * w * 0.035, by = y - hh * (0.08 + t * 0.98);
    const r = h * (0.025 + (i % 3) * 0.012);
    ctx.strokeStyle = rgba(light, 0.7); ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = rgba(lip, 0.8); ctx.beginPath(); ctx.arc(bx - r * 0.35, by - r * 0.35, Math.max(0.6, r * 0.3), 0, Math.PI * 2); ctx.fill();
  }
  // Two eye pits sunk into the front, a pale lip of goo under each; then the wide toothless gape.
  for (const s of [-1, 1]) {
    const ex = x + s * w * 0.16 - w * 0.06, ey = y - hh * 0.66, rr = h * 0.068;
    // A lit rim of goo all round, the socket, then a wet catchlight: the rim is what makes it a pit.
    ctx.fillStyle = rgba(lip, 0.5); ctx.beginPath(); ctx.arc(ex, ey, rr * 1.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pit; ctx.beginPath(); ctx.arc(ex, ey, rr, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(light, 0.5); ctx.beginPath(); ctx.arc(ex, ey + rr * 0.3, rr * 0.7, 0.1, Math.PI - 0.1); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(ex - rr * 0.34, ey - rr * 0.38, Math.max(0.7, rr * 0.28), 0, Math.PI * 2); ctx.fill();
  }
  // The gape: a wide toothless maw across the front, its far corner drooping, wet lips above and below.
  const gy = y - hh * 0.3 + wob * h * 0.01;
  blob(ctx, B, mix(pit, dark, 0.3), [{ k: 'curve', pts: [x - w * 0.26, gy - h * 0.01, x - w * 0.14, gy - h * 0.075, x + w * 0.02, gy - h * 0.08, x + w * 0.16, gy - h * 0.03, x + w * 0.1, gy + h * 0.07, x - w * 0.08, gy + h * 0.09, x - w * 0.2, gy + h * 0.05], wobble: 0.05, seed: 6, sub: 2 }], { outline: false, formK: 1, spread: 0.4 });
  softLine(ctx, B, [x - w * 0.24, gy - h * 0.02, x - w * 0.12, gy - h * 0.095, x + w * 0.02, gy - h * 0.1, x + w * 0.15, gy - h * 0.05], lip, Math.max(1, h * 0.028), 0.55);
  softLine(ctx, B, [x - w * 0.22, gy + h * 0.045, x - w * 0.06, gy + h * 0.115, x + w * 0.1, gy + h * 0.09, x + w * 0.17, gy + h * 0.02], lip, Math.max(1, h * 0.028), 0.45);
  // Light coming through the thin base of the body: the single cheapest cue for translucency.
  const thru = ctx.createLinearGradient(x, y - hh * 0.42, x, y + h * 0.02);
  thru.addColorStop(0, rgba(light, 0)); thru.addColorStop(1, rgba(mix(light, '#e8ffd0', 0.5), 0.5));
  ctx.fillStyle = thru; ctx.fillRect(x - w * 0.7, y - hh * 0.42, w * 1.4, hh * 0.5);
  // A broad wet sheen over the lit shoulder, on top of everything inside.
  const gx = x - w * 0.22, gyy = y - hh * 0.72;
  const sheen = ctx.createRadialGradient(gx, gyy, 0, gx, gyy, w * 0.34);
  sheen.addColorStop(0, 'rgba(255,255,255,0.32)'); sheen.addColorStop(0.5, 'rgba(255,255,255,0.1)'); sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen; ctx.fillRect(x - w * 0.6, y - hh * 1.1, w * 0.7, hh * 0.9);
  ctx.restore();
}
