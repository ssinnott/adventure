// The steppe's look (#1030): the Wold's dry grass through the year, tall tufts leaning one way on it; and
// its variants across the land (#1101): short grass, the feather-grass and gravel.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { hash } from '../../paint/brush.ts';
import { fog } from '../common.ts';
import { rampColor } from '../model.ts';
import type { Paint } from '../common.ts';
import type { Ramp } from '../model.ts';
import type { GroundLook, Mark } from './look.ts';

/**
 * The steppe through the year: dun after the winter, green-gold in Sowing, gold by Longlight and
 * tawny at Harvest, the lions' colour, then straw and dun again.
 */
const STEPPE: Ramp = [[0, '#8a8458'], [14, '#8a9a50'], [28, '#9aa24a'], [42, '#b4a44c'], [56, '#bca252'], [72, '#a8985e'], [94, '#948a62'], [120, '#8a8458']];
function steppeColor(day: number): string { return rampColor(STEPPE, day); }

/** A tuft, a seed head on two. */
function mark(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, d } = m;
  // Tall dry grass in tufts, all leaning one way, pale and dark by turns, a seed head on some. A
  // light snow leaves their tops showing; a deep one flattens them.
  if (env.cover > 0.55) return;
  ctx.strokeStyle = fog(p, env.cover > 0.05 ? shade(steppeColor(env.day), 0.8) : shade(base, i % 2 ? 1.3 : 0.8), d); ctx.lineWidth = Math.max(1, sc * 0.8);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - 3 * sc, x + 2 * sc, y - 5.5 * sc); ctx.moveTo(x + sc, y); ctx.quadraticCurveTo(x + 1.5 * sc, y - 2.5 * sc, x + 3.5 * sc, y - 4 * sc); ctx.moveTo(x - sc, y); ctx.lineTo(x - 0.5 * sc, y - 4.5 * sc); ctx.stroke();
  if (i < 2 && env.cover <= 0.05) { ctx.fillStyle = fog(p, shade(base, 1.45), d); ctx.fillRect(Math.round(x + sc), Math.round(y - 6.5 * sc), Math.max(1, Math.round(1.5 * sc)), Math.max(1, Math.round(2 * sc))); }
}

/** The short grass's: a low tuft, three blades. */
function short(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, d } = m;
  if (env.cover > 0.3) return;
  ctx.strokeStyle = fog(p, shade(base, i % 2 ? 1.25 : 0.78), d); ctx.lineWidth = Math.max(1, sc * 0.8);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - sc, y - 2.5 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 0.5 * sc, y - 3 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1.8 * sc, y - 2 * sc); ctx.stroke();
}

/** The gravel's: four stones, each lit on its top, then a tuft or two. */
function stones(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, seed, d } = m;
  if (i >= 4) { mark(p, m); return; }
  if (env.cover > 0.55) return;
  const r = (1.2 + 1.4 * hash(seed, 71, i)) * sc + 0.4;
  ctx.fillStyle = fog(p, mix(base, '#6a6660', 0.5), d);
  ctx.beginPath(); ctx.ellipse(x, y - r * 0.4, r, r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = fog(p, mix(base, '#c8c4b8', 0.55), d);
  ctx.beginPath(); ctx.ellipse(x, y - r * 0.6, r * 0.6, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
}

export const steppe: GroundLook = { color: steppeColor, drift: { toward: ['#6e9640', '#d4c070'], by: 0.6 }, snow: 0.9, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 7, mark },
  // Short grass greener and grazed, the feather-grass tall, gravel grey between the tufts.
  variants: { scale: 4.5, looks: [
    { name: 'short grass', share: 0.3, shift: { toward: '#6e9a44', by: 0.45 }, lies: { marks: 9, mark: short } },
    { name: 'feather-grass', share: 0.45 },
    { name: 'gravel', share: 0.25, shift: { toward: '#8a8476', by: 0.6 }, lies: { marks: 6, mark: stones } },
  ] } };
