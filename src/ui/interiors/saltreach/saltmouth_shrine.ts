// The drowned god's town shrine in Saltmouth, where the town is cured: green-grey stone with the
// tide's marks up it, nets for a canopy, the tide itself in a pool in the floor, and an altar lit
// by shells. The god only counts now; the walls are scored with it and the shells are laid in rows.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, flagstones, line, smudge, fillPoly, slab, pool, contact } from '../kit.ts';
import { K, shelf, jar, bottle, herbs } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const SEASTONE = '#6e7c76', WEED = '#3a4a2e', NET = '#a8a088', SHELL = '#ece0cc';

/** The tide's marks up the wall: a band of weed and a line of salt for each height the water has stood at. */
function tideMarks(ctx: CanvasRenderingContext2D, y0: number, y1: number): void {
  for (let i = 0; i < 4; i++) {
    const y = y1 - (i + 1) * (y1 - y0) / 4.6, pts: number[] = [];
    for (let k = 0; k <= 40; k++) pts.push(k * 10, y + Math.sin(k * 0.7 + i) * 1.5 + rnd(331, i, k) * 2);
    line(ctx, pts, rgba(WEED, 0.5 - i * 0.08), 4 - i * 0.6);
    line(ctx, pts.map((v, j) => j % 2 ? v - 3 : v), rgba('#e8ece4', 0.4 - i * 0.06), 1);
  }
  const g = ctx.createLinearGradient(0, y1 - 40, 0, y1);
  g.addColorStop(0, rgba(WEED, 0)); g.addColorStop(1, rgba(WEED, 0.5));
  ctx.fillStyle = g; ctx.fillRect(0, y1 - 40, STAGE_W, 40);
}

/** Tallies scored in the stone: groups of four strokes and a fifth across, row on row, with no number anywhere. */
function tallies(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, rows: number, seed: number): void {
  for (let r = 0; r < rows; r++) {
    const n = Math.floor((w / 16) * (0.6 + rnd(seed, r) * 0.4));
    for (let i = 0; i < n; i++) {
      const gx = x + i * 16 + (r % 2) * 3, gy = y + r * 13;
      for (let k = 0; k < 4; k++) { line(ctx, [gx + k * 3, gy, gx + k * 3 + 0.5, gy + 9], rgba('#1a2220', 0.6), 1); line(ctx, [gx + k * 3 + 1, gy, gx + k * 3 + 1.5, gy + 9], rgba('#c8d0c8', 0.25), 1); }
      if (r < rows - 1 || i < n - 1) line(ctx, [gx - 2, gy + 7, gx + 11, gy + 2], rgba('#1a2220', 0.6), 1);
    }
  }
}

/** A shell, a cockle's fan: ribs out from its hinge at (x, y), `r` across. */
function shell(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, col = SHELL): void {
  glossPoly(ctx, K, [x, y, x - r, y - r * 0.4, x - r * 0.8, y - r * 0.9, x, y - r * 1.1, x + r * 0.8, y - r * 0.9, x + r, y - r * 0.4], col, { gloss: 0.5, spread: 0.7 });
  for (let i = -2; i <= 2; i++) line(ctx, [x, y - 1, x + i * r * 0.36, y - r * 0.95], rgba(shade(col, 0.7), 0.7), 1);
}

/** A net hung from the roof in swags across the shrine, cork floats on its edge. */
function netCanopy(ctx: CanvasRenderingContext2D, y: number, drop: number): void {
  const n = 4, span = STAGE_W / n;
  for (let k = 0; k < n; k++) {
    const a = k * span, sag = (u: number): number => y + Math.sin(u * Math.PI) * drop;
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      line(ctx, [a + span * u, y - 8, a + span * Math.min(1, u + 0.25), sag(Math.min(1, u + 0.25))], rgba(NET, 0.5), 1);
      line(ctx, [a + span * u, y - 8, a + span * Math.max(0, u - 0.25), sag(Math.max(0, u - 0.25))], rgba(NET, 0.5), 1);
    }
    const edge: number[] = []; for (let i = 0; i <= 14; i++) edge.push(a + span * (i / 14), sag(i / 14));
    line(ctx, edge, shade(NET, 1.1), 1.5);
    for (let i = 1; i < 4; i++) glossEllipse(ctx, K, a + span * (i / 4), sag(i / 4) + 2, 3, 2.2, '#b8905a', 0, { gloss: 0.3 });
    line(ctx, [a, y - 10, a, y + 2], '#2a2a2a', 2);
  }
  line(ctx, [0, y - 9, STAGE_W, y - 9], shade(NET, 0.8), 2);
}

/** The pool in the floor with the tide in it: dark water, the light moving on it, the stone lip round it. */
function tidePool(ctx: CanvasRenderingContext2D, s: Stage, cx: number, cy: number, rx: number, ry: number): void {
  glossEllipse(ctx, K, cx, cy, rx + 8, ry + 4, shade(SEASTONE, 0.95), 0, { gloss: 0.2 });
  const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx);
  g.addColorStop(0, mix('#1a3a3a', '#4a948e', s.daylight)); g.addColorStop(1, mix('#081414', '#1a4a4a', s.daylight));
  ctx.beginPath(); ctx.ellipse(cx, cy + 1, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy + 1, rx, ry, 0, 0, Math.PI * 2); ctx.clip();
  for (let i = 0; i < 14; i++) { const wx = cx + (rnd(332, i) - 0.5) * rx * 1.6, wy = cy + (rnd(333, i) - 0.5) * ry * 1.4; line(ctx, [wx - 6, wy, wx, wy - 1, wx + 6, wy], rgba('#c8f0e8', 0.25 + 0.3 * s.daylight), 1); }
  // Steps going down into it, under the water.
  for (let i = 0; i < 3; i++) fillPoly(ctx, [cx - rx * 0.3 + i * 4, cy - ry + 2 + i * 5, cx + rx * 0.3 - i * 4, cy - ry + 2 + i * 5, cx + rx * 0.3 - i * 4 - 2, cy - ry + 6 + i * 5, cx - rx * 0.3 + i * 4 + 2, cy - ry + 6 + i * 5], rgba('#0a1a1a', 0.35));
  ctx.restore();
  // The light comes up off the water by day, sea-green; by night it is only dark.
  s.lights.push({ k: 'glow', x: cx, y: cy, r: rx * 0.8, color: '#7adcd0', a: 0.12 + 0.2 * s.daylight });
  if (s.daylight > 0.1) { pool(s, cx, cy - 30, 260, '#a8e0d8', 0.8 * s.daylight); pool(s, cx, 90, 220, '#b8d8d8', 0.4 * s.daylight); }
}

export const SHRINE: Scene = {
  ambient: ['#262c34', '#7a8a88'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 186;
    // Sea-stone, coursed and wet, the tide's marks up it and tallies scored above the reach of the water.
    stones(ctx, 0, 0, STAGE_W, FLOOR, SEASTONE, 12, 331, { mottle: '#4a6a4a' });
    tideMarks(ctx, 90, FLOOR);
    flagstones(ctx, FLOOR, 200, 100, shade(SEASTONE, 0.9), 7, 331);
    tallies(ctx, 14, 30, 110, 4, 334);
    tallies(ctx, 276, 30, 112, 4, 335);
    // The altar under its arch: a slab of stone, and the shells laid on it that light it.
    const arch = (x0: number, x1: number, spring: number): void => { ctx.beginPath(); ctx.moveTo(x0, FLOOR); ctx.lineTo(x0, spring); ctx.ellipse((x0 + x1) / 2, spring, (x1 - x0) / 2, 40, 0, Math.PI, 0); ctx.lineTo(x1, FLOOR); ctx.closePath(); };
    arch(140, 260, 76); ctx.fillStyle = '#1a2220'; ctx.fill();
    arch(146, 254, 78); ctx.fillStyle = mix('#1e2a2a', '#3a4a48', s.daylight * 0.5); ctx.fill();
    for (let i = 0; i < 11; i++) { const a = Math.PI + (i / 10) * Math.PI; glossBall(ctx, K, 200 + Math.cos(a) * 60, 76 + Math.sin(a) * 40, 3, shade(SEASTONE, 1.1), { gloss: 0.2 }); }
    // Rows of shells laid on ledges in the niche, counted out and never added up.
    for (let r = 0; r < 4; r++) {
      slab(ctx, 160, 82 + r * 20, 80, 3, shade(SEASTONE, 0.9), { lit: 1, outline: false });
      const n = 4 + r * 2;
      for (let i = 0; i < n; i++) shell(ctx, 168 + i * (64 / Math.max(1, n - 1)), 82 + r * 20, 3.2, i % 3 ? SHELL : '#e8c8b0');
    }
    slab(ctx, 150, 158, 100, 28, shade(SEASTONE, 1.05), { lit: 2, dark: 0.3 });
    slab(ctx, 144, 152, 112, 8, shade(SEASTONE, 1.2), { lit: 2 });
    // The lit shells on the altar: a lamp of oil in each great shell.
    for (const [sx, sr] of [[170, 9], [200, 12], [230, 9]] as [number, number][]) {
      shell(ctx, sx, 152, sr, '#f0e4d0');
      const gy = 152 - sr * 0.5;
      s.lights.push({ k: 'flame', x: sx, y: gy, s: 1.8 });
      s.lights.push({ k: 'glow', x: sx, y: gy - 2, r: sr * 1.6, color: '#ffe8c8', a: 0.3 });
      pool(s, sx, gy - 4, 190, '#ffd8a8', 0.4 + 0.5 * (1 - s.daylight));
    }
    // The nets hung as a canopy from the roof.
    netCanopy(ctx, 14, 18);
    // Left: the priest's bench, a stool of driftwood, a bowl of sea water for the cures.
    slab(ctx, 22, 176, 92, 7, '#7a7464', { lit: 2, dark: 0.3 });
    for (const lx of [28, 102]) slab(ctx, lx, 183, 6, 22, '#5a5448', { lit: 1 });
    contact(ctx, 68, 206, 100, 0.35);
    glossPoly(ctx, K, [40, 176, 42, 170, 78, 170, 82, 176], '#3a4a5a', { gloss: 0.1 });
    line(ctx, [46, 173, 76, 173], rgba('#1a2a3a', 0.6), 1);
    glossEllipse(ctx, K, 98, 174, 9, 3, '#8a7a5a', 0, {}); glossEllipse(ctx, K, 98, 173, 6, 1.6, '#3a6a6a', 0, { gloss: 0.8 });
    // Right: the shelf of the cures, brine in jars and kelp drying.
    shelf(ctx, 282, 110, 104, '#6a6050');
    jar(ctx, 296, 110, 12, 16, '#5a7a74', '#3a3a30'); bottle(ctx, 316, 110, 18, '#3a6a5a', { squat: true }); jar(ctx, 338, 110, 14, 14, '#8a8470'); bottle(ctx, 360, 110, 16, '#2a4a4a'); jar(ctx, 378, 110, 10, 12, '#5a7a74');
    for (let i = 0; i < 4; i++) herbs(ctx, 292 + i * 28, 132, 14, 116, i % 2 ? '#3a5a2e' : '#4a5a24', 336 + i);
    // The tide in its pool, in the floor before the altar.
    tidePool(ctx, s, 200, 230, 118, 22);
    // Shells set round the pool's lip, a ring of them, counted.
    for (let i = 0; i < 18; i++) { const a = Math.PI * 0.08 + (i / 17) * Math.PI * 0.84; shell(ctx, 200 - Math.cos(a) * 128, 230 - Math.sin(a) * 27, 3, i % 4 ? SHELL : '#e0b8a0'); }
    smudge(ctx, 200, 140, 60, '#ffe8c8', 0.06);
  },
};
