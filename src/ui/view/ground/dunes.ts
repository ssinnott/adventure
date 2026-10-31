// The dunes' look (#1030): sand in ridges, a crest across each square and the wind's ripples; and its
// variants across the land (#1101): ripple-marked and wind-scoured.

import { shade } from '../../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, floorPt, quad } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Mark, Square } from './look.ts';
import { ripples, stones } from './near.ts';
import type { Pixels } from './near.ts';

/** The crest, then ripples. */
function mark(p: Paint, m: Mark): void {
  const { ctx, cx, horizon, h, env } = p, { i, x, y, sc, base, seed, d, l } = m;
  // Sand in ridges: a dune's crest across the square, lit along its top with its lee in shadow,
  // and the wind's ripples over the rest. A deep snow hides them.
  if (env.cover > 0.55) return;
  if (i === 0) {
    // The crest, kept inside its square, so it never reaches the foot of a wall beyond.
    if (d > 3) return;
    const ds = 0.4 + 0.25 * hash(seed, 52), tilt = 0.12 * (hash(seed, 53) - 0.5);
    const a = floorPt(cx, horizon, h, d, l, ds - tilt, 0.04), b = floorPt(cx, horizon, h, d, l, ds + tilt, 0.96), mid = floorPt(cx, horizon, h, d, l, ds + 0.1, 0.5);
    quad(ctx, a, b, floorPt(cx, horizon, h, d, l, ds + tilt - 0.16, 0.96), floorPt(cx, horizon, h, d, l, ds - tilt - 0.16, 0.04), fog(p, shade(base, 0.8), d));
    ctx.strokeStyle = fog(p, shade(base, 1.2), d); ctx.lineWidth = Math.max(1, sc * 1.4);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(mid[0], mid[1], b[0], b[1]); ctx.stroke();
  } else {
    ctx.strokeStyle = fog(p, shade(base, i % 2 ? 1.14 : 0.86), d); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x - 4 * sc, y); ctx.quadraticCurveTo(x, y - 1.2 * sc, x + 4 * sc, y); ctx.stroke();
  }
}

/** The scoured sand's: long streaks the wind has combed, a pebble left lying on the hard floor between. */
function scoured(p: Paint, m: Mark): void {
  const { ctx, env } = p, { i, x, y, sc, base, d } = m;
  if (env.cover > 0.55) return;
  if (i % 3 === 2) { ctx.fillStyle = fog(p, shade(base, 0.55), d); ctx.fillRect(Math.round(x), Math.round(y - sc), Math.max(1, Math.round(1.5 * sc)), Math.max(1, Math.round(sc))); return; }
  ctx.strokeStyle = fog(p, shade(base, i % 2 ? 1.12 : 0.9), d); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 8 * sc, y); ctx.lineTo(x + 8 * sc, y); ctx.stroke();
}

// Near to (#1102, near.ts): the ripple marks close set, lit along their crests; on the scoured sand long streaks and
// pebbles the wind has left lying.

/** The ripple-marked sand's near to. */
function rippled(p: Paint, base: string, sq: Square): Pixels { return ripples(p, base, sq, { rows: 10, cols: 2, half: 15, lit: 1.16, shadow: 0.8 }); }

/** The scoured sand's: long low streaks, and pebbles lit on their tops. */
function streaked(p: Paint, base: string, sq: Square): Pixels {
  const px = ripples(p, base, sq, { rows: 6, cols: 2, half: 16, lit: 1.1, shadow: 0.9, salt: 133 });
  return stones(p, base, sq, { rows: 5, cols: 7, size: [2, 3], bare: 0.6, body: 0.6, lit: 0.95, shadow: 0.45 }, px);
}

export const dunes: GroundLook = { color: () => TERRAIN_COLORS.dunes, drift: { toward: ['#b87a3e', '#f0cc94'], by: 0.6 }, snow: 0.6, wets: true, splashes: true, ripples: false, vary: 0.08, lies: { marks: 5, mark }, near: rippled,
  // Ridges marked by the wind's ripples, and sand scoured flat and pale between them.
  variants: { scale: 4.5, looks: [
    { name: 'ripple-marked', share: 0.6 },
    { name: 'wind-scoured', share: 0.4, shift: { toward: '#f4e0b8', by: 0.4 }, lies: { marks: 6, mark: scoured }, near: streaked },
  ] } };
