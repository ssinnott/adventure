// The cellar slime, painted: a wet mound that is NOT a symmetrical cowpat — it piles up high on its
// lit left shoulder, leans that way, and sags away to a low, thin right flank, with one long drip
// off the heavy side and another off the front. It sits in its own puddle, carries a darker core
// sunk in the goo, bubbles climbing through it, and a face that must read as a face: two small round
// eye pits lifted high on the mound with a wet catchlight each, and a separate curved maw lower
// down between a lit upper and lower lip. Gloss is the whole point of this one, so it gets a hard
// bright highlight on the lit shoulder, a soft reflection lower down, and a lit rim where the body
// meets the floor so the light seems to pass through it. Every green comes from the def's tint.
// Idle: a slow wobble (wider as it settles lower) and the bubbles climbing.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { blob, lumpy, appendCurve } from './gloss.ts';
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

/** A soft white reflection: a radial fall-off squashed into an ellipse. This is the wet look. */
function wet(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, rot: number, a: number): void {
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(Math.max(0.01, rx), Math.max(0.01, ry));
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(255,255,255,${a})`);
  g.addColorStop(0.5, `rgba(255,255,255,${a * 0.42})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/** A pale lit rim (a lip, a ridge): a stroke in the goo's own highlight, never ink. */
function paleLine(ctx: CanvasRenderingContext2D, pts: readonly number[], hex: string, w: number, a: number): void {
  ctx.strokeStyle = B.col(rgba(hex, a)); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
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
  // The puddle it sits in: a flat wet sheet, its own mass, pulled under the heavy side.
  blob(ctx, B, dark, [{ k: 'curve', pts: ring(x - w * 0.03, y - h * 0.015, w * 0.58, h * 0.075, 6, PUDDLE), wobble: 0.08, seed: 4, sub: 3, gloss: 0.3 }], { h, formK: 0.3, spread: 0.7 });

  // The mound. A slime that is the same on both sides is a cowpat, so this one has a direction: the
  // mass piles up over the LEFT (lit) flank and leans that way, the crown sits well left of centre,
  // and the right side falls away fast to a thin, low shoulder that sags out past the puddle.
  let k = 0;
  const M = (px: number, py: number) => { MOUND[k++] = px; MOUND[k++] = py; };
  M(x - w * 0.53, y - hh * 0.05); M(x - w * 0.61, y - hh * 0.44); M(x - w * 0.5, y - hh * 0.84); M(x - w * 0.2, y - hh * 1.05);
  M(x + w * 0.08, y - hh * 0.88); M(x + w * 0.3, y - hh * 0.58); M(x + w * 0.47, y - hh * 0.26); M(x + w * 0.44, y - hh * 0.02);
  const parts: Part[] = [
    { k: 'curve', pts: MOUND, wobble: 0.07, seed: 2, sub: 3, gloss: 0.45 },
    // The long drip off the heavy left flank, almost to the floor.
    { k: 'tube', pts: [x - w * 0.46, y - hh * 0.5, x - w * 0.56, y - hh * 0.3, x - w * 0.61, y - hh * 0.04 - wob * h * 0.02], r0: h * 0.065, r1: h * 0.038, wobble: 0.1, seed: 7, gloss: 0.4 },
    // A second long one off the front, and a short stub on the low right shoulder.
    { k: 'tube', pts: [x - w * 0.02, y - hh * 0.2, x + w * 0.03, y - hh * 0.1, x + w * 0.06, y - h * 0.005], r0: h * 0.045, r1: h * 0.032, wobble: 0.08, seed: 9, gloss: 0.3 },
    { k: 'tube', pts: [x + w * 0.4, y - hh * 0.3, x + w * 0.47, y - hh * 0.22, x + w * 0.51, y - hh * 0.13 + wob * h * 0.02], r0: h * 0.045, r1: h * 0.028, wobble: 0.1, seed: 8, gloss: 0.4 },
  ];
  blob(ctx, B, base, parts, { h, formK: 0.45, spread: 0.85, gloss: 0.55 });
  if (B.override) return;

  // Inside the goo: the core mass, bubbles and the face, clipped to the mound.
  ctx.save();
  ctx.beginPath(); appendCurve(ctx, lumpy(MOUND, 0.07, 2, 3)); ctx.clip();
  // Core: a darker lump sunk low in the thin right side, well clear of the face.
  blob(ctx, B, core, [{ k: 'curve', pts: ring(x + w * 0.26, y - hh * 0.44, w * 0.13, hh * 0.18, 7, CORE, 0.4), wobble: 0.09, seed: 5, sub: 2 }], { outline: false, formK: 0.9, spread: 0.55 });
  // The nucleus, kept close to the core's value and given the same lit rim the eye pits get; on its
  // own it was the darkest thing on the body and read as a puncture rather than something inside.
  const nx = x + w * 0.28, ny = y - hh * 0.41, nr = w * 0.06;
  ctx.fillStyle = B.col(rgba(lip, 0.28)); ctx.beginPath(); ctx.ellipse(nx, ny, nr * 1.25, hh * 0.095, -0.3, 0, Math.PI * 2); ctx.fill();
  blob(ctx, B, mix(core, dark, 0.55), [{ k: 'ell', x: nx, y: ny, rx: nr, ry: hh * 0.075, rot: -0.3 }], { outline: false, formK: 0.8, spread: 0.5 });
  // Bubbles rising through the goo and leaving through the top.
  ctx.lineWidth = Math.max(1, h * 0.015);
  for (let i = 0; i < 4; i++) {
    const t = ((p.frame * 0.3 + i * 37) % 120) / 120;
    const bx = x - w * 0.34 + i * w * 0.16 + Math.sin(t * 7 + i * 2) * w * 0.035, by = y - hh * (0.08 + t * 0.98);
    const r = h * (0.025 + (i % 3) * 0.012);
    ctx.strokeStyle = B.col(rgba(light, 0.7)); ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = B.col(rgba(lip, 0.8)); ctx.beginPath(); ctx.arc(bx - r * 0.35, by - r * 0.35, Math.max(0.6, r * 0.3), 0, Math.PI * 2); ctx.fill();
  }
  // THE FACE. It only reads if the eyes and the mouth are separate things: the eyes ride high on the
  // crown, small and round, each a lit rim, a socket and a hard white catchlight; the maw sits a
  // third of the body lower and is its own curved opening. Anything that closes the gap between them
  // turns the whole front into one dark smear.
  const fx = x - w * 0.01;
  for (const s of [-1, 1]) {
    const ex = fx + s * w * 0.115, ey = y - hh * 0.74 - s * hh * 0.025, rr = h * 0.056;
    ctx.fillStyle = B.col(rgba(lip, 0.5)); ctx.beginPath(); ctx.arc(ex, ey, rr * 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = B.col(pit); ctx.beginPath(); ctx.arc(ex, ey, rr, 0, Math.PI * 2); ctx.fill();
    // Light bouncing up off the floor of the socket, then the wet catchlight on the lit side.
    ctx.fillStyle = B.col(rgba(light, 0.45)); ctx.beginPath(); ctx.arc(ex, ey + rr * 0.34, rr * 0.66, 0.12, Math.PI - 0.12); ctx.fill();
    ctx.fillStyle = B.col('rgba(255,255,255,0.92)'); ctx.beginPath(); ctx.arc(ex - rr * 0.36, ey - rr * 0.38, Math.max(0.8, rr * 0.3), 0, Math.PI * 2); ctx.fill();
  }
  // The maw: a curved opening, corners up and the middle bowing down, thin enough that it can never
  // fuse with the eyes; a lit ridge on the upper lip and a brighter one on the lower.
  const gy = y - hh * 0.3 + wob * h * 0.01;
  blob(ctx, B, mix(pit, dark, 0.12), [{ k: 'curve', pts: [
    fx - w * 0.22, gy - h * 0.058, fx - w * 0.1, gy + h * 0.005, fx + w * 0.06, gy + h * 0.035, fx + w * 0.18, gy + h * 0.04,
    fx + w * 0.12, gy + h * 0.115, fx - w * 0.04, gy + h * 0.115, fx - w * 0.15, gy + h * 0.045,
  ], wobble: 0.04, seed: 6, sub: 2 }], { outline: false, formK: 1, spread: 0.4 });
  const lw = Math.max(1, h * 0.026);
  paleLine(ctx, [fx - w * 0.22, gy - h * 0.06, fx - w * 0.09, gy, fx + w * 0.06, gy + h * 0.028, fx + w * 0.18, gy + h * 0.035], lip, lw, 0.38);
  paleLine(ctx, [fx - w * 0.18, gy + h * 0.042, fx - w * 0.04, gy + h * 0.128, fx + w * 0.12, gy + h * 0.128, fx + w * 0.19, gy + h * 0.058], lip, lw * 1.15, 0.62);

  // WET. Light passing through the thin base and back out: a lit rim where the body meets the floor.
  const thru = ctx.createLinearGradient(x, y - hh * 0.36, x, y + h * 0.02);
  thru.addColorStop(0, rgba(light, 0));
  thru.addColorStop(0.55, rgba(mix(light, '#e8ffd0', 0.4), 0.22));
  thru.addColorStop(1, rgba(mix(light, '#eaffd4', 0.6), 0.62));
  ctx.fillStyle = thru; ctx.fillRect(x - w * 0.75, y - hh * 0.36, w * 1.5, hh * 0.45);
  // The specular: a broad sheen over the lit shoulder, a hard bright core inside it, and a soft
  // second reflection sitting low on the right where the floor bounces back up into the goo.
  wet(ctx, x - w * 0.35, y - hh * 0.74, w * 0.26, hh * 0.26, -0.62, 0.26);
  wet(ctx, x - w * 0.37, y - hh * 0.79, w * 0.12, hh * 0.09, -0.75, 0.8);
  ctx.fillStyle = B.col('rgba(255,255,255,0.95)');
  ctx.beginPath(); ctx.ellipse(x - w * 0.375, y - hh * 0.8, Math.max(1, w * 0.05), Math.max(0.8, hh * 0.03), -0.75, 0, Math.PI * 2); ctx.fill();
  wet(ctx, x + w * 0.16, y - hh * 0.16, w * 0.22, hh * 0.06, -0.1, 0.32);
  ctx.restore();
}
