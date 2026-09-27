// The Elder's Yard in a clearing of Thornhold's forest: a ring of old stones where the elves teach
// the bow and the staff.
import { rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, skyFill, line, contact, pool, trunk } from '../kit.ts';
import { K, staff, bow, lantern } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { clouds, ground, target, armsRack } from '../yards.ts';

const BARK = '#5a4632', MOSS = '#5a7a3a', TURF = '#4c7a36';

/** A standing stone with a rune cut in it, foot on y: one of the ring the Elder teaches in. */
function ringStone(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number, seed: number): void {
  contact(ctx, x, y, h * 0.7);
  const w = h * 0.45, lean = (rnd(seed) - 0.5) * h * 0.1;
  glossPoly(ctx, K, [x - w * 0.5, y, x - w * 0.55 + lean, y - h * 0.7, x - w * 0.3 + lean, y - h, x + w * 0.3 + lean, y - h * 0.96, x + w * 0.5 + lean, y - h * 0.6, x + w * 0.5, y], '#8a8878', { spread: 0.7, h: 100, tex: 'cracks', seed, amount: 0.4 });
  for (let i = 0; i < 5; i++) { ctx.fillStyle = rgba(i % 2 ? MOSS : '#7a9a4a', 0.9); ctx.beginPath(); ctx.ellipse(x + (rnd(seed, i) - 0.5) * w * 0.8, y - rnd(seed, i, 1) * h * 0.3, 3 + rnd(seed, i, 2) * 4, 2, 0, 0, Math.PI * 2); ctx.fill(); }
  const rx = x + lean * 0.6, ry = y - h * 0.6;
  line(ctx, [rx - w * 0.15, ry + h * 0.1, rx, ry - h * 0.12, rx + w * 0.15, ry + h * 0.1], '#9affd8', 1.5);
  s.lights.push({ k: 'glow', x: rx, y: ry, r: h * 0.35, color: '#40e0a0', a: 0.25 });
}

/** A log hung on two ropes from a bough, to be dodged: the Elder's oldest drill. Its middle at (x, y). */
function swingingLog(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, top: number): void {
  for (const sd of [-1, 1]) line(ctx, [x + sd * len * 0.35, top, x + sd * len * 0.3, y], '#c8b890', 1.5);
  trunk(ctx, [x - len / 2, y + 1, x, y, x + len / 2, y - 1], 7, 6, BARK, 7);
  glossEllipse(ctx, K, x + len / 2, y - 1, 3.5, 6.5, '#c89a60', 0, {});
}

export const ELDERS_YARD: Scene = {
  ambient: ['#28343a', '#dcead8'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FOOT = 170;
    skyFill(ctx, 0, 0, STAGE_W, 140, s.daylight, 131);
    clouds(ctx, s.daylight, 20, 132);
    // The far side of the clearing: a wall of forest going back into haze.
    const haze = mix('#101a18', '#8ab090', s.daylight), deep = mix('#0a1210', '#3a6a3a', s.daylight);
    for (const [col, base, n] of [[haze, 80, 9], [deep, 110, 8]] as [string, number, number][]) {
      ctx.fillStyle = col; ctx.fillRect(0, base + 20, STAGE_W, FOOT - base);
      for (let i = 0; i < n; i++) { const cx = (i + rnd(133, base, i) * 0.8) * (STAGE_W / (n - 1)), r = 26 + rnd(134, base, i) * 18; ctx.beginPath(); ctx.arc(cx, base + 24 - rnd(135, base, i) * 20, r, 0, Math.PI * 2); ctx.fill(); }
    }
    ground(ctx, FOOT, TURF, 136, true);
    // The ring: a trodden circle of earth, and the old stones round it.
    ctx.fillStyle = rgba('#8a6a42', 0.55); ctx.beginPath(); ctx.ellipse(200, 204, 120, 26, 0, 0, Math.PI * 2); ctx.fill();
    for (const [sx, sy, sh, seed] of [[92, 186, 30, 1], [166, 180, 24, 2], [236, 180, 24, 3], [308, 186, 30, 4]] as [number, number, number, number][]) ringStone(ctx, s, sx, sy, sh, seed);
    // Straw butts at the clearing's edge, and a rack of staves and bows between the trees.
    target(ctx, 58, 168, 16, 7);
    target(ctx, 346, 164, 14, 8);
    armsRack(ctx, 176, FOOT + 2, 48, 52, '#6a5a3a');
    staff(ctx, 184, FOOT, 70, '#7a6a44'); staff(ctx, 194, FOOT, 66, '#6a5a3a', '#5ad0a0');
    bow(ctx, 210, FOOT - 6, 56, '#a86a3a', true); bow(ctx, 222, FOOT - 6, 52, '#8a5a2a', true);
    // The great trees that make the clearing's walls, their boughs meeting over it.
    trunk(ctx, [-6, STAGE_H + 10, 14, 180, 26, 100, 60, 30, 130, -10], 34, 12, BARK, 9);
    trunk(ctx, [406, STAGE_H + 10, 386, 180, 374, 100, 340, 30, 270, -10], 34, 12, BARK, 10);
    trunk(ctx, [60, 10, 150, 22, 200, 18, 250, 22, 340, 10], 7, 7, BARK, 11);
    for (let i = 0; i < 80; i++) {
      const a = rnd(137, i) * Math.PI * 2, len = 9 + rnd(138, i) * 8, lx = rnd(139, i) * STAGE_W, ly = rnd(140, i) * 34 - 8 + (Math.abs(lx - 200) < 90 ? 0 : 10);
      const ux = Math.cos(a), uy = Math.sin(a), w = len * 0.32, col = i % 3 ? '#4a7a3a' : '#6a9a44';
      glossPoly(ctx, K, [lx, ly, lx + ux * len * 0.35 - uy * w, ly + uy * len * 0.35 + ux * w, lx + ux * len, ly + uy * len, lx + ux * len * 0.35 + uy * w, ly + uy * len * 0.35 - ux * w], col, { gloss: 0.1 });
    }
    swingingLog(ctx, 272, 120, 56, 20);
    lantern(ctx, s, 110, 60, 10, '#4a3a2a', 24, 140, '#e8f0a0');
    lantern(ctx, s, 296, 64, 10, '#4a3a2a', 22, 140, '#e8f0a0');
    if (s.daylight < 0.3) s.lights.push({ k: 'motes', x: 30, y: 90, w: 340, h: 110, color: '#d8ff80', n: 26, rise: 0.06 });
    else pool(s, 200, 110, 300, '#fff8e0', 0.6 * s.daylight);
    // The foreground: roots and ferns, and a mossy wall of fieldstone the party stands behind.
    for (let i = 0; i < 9; i++) {
      const fx = rnd(141, i) * STAGE_W, fy = 232 + rnd(142, i) * 10;
      for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.35; line(ctx, [fx, fy, fx + Math.cos(a) * 18, fy + Math.sin(a) * 16], k % 2 ? '#4a7a36' : '#5a8a3e', 2); }
    }
    for (let i = 0; i < 9; i++) { const bx = i * 46 - 6 + rnd(143, i) * 8, bw = 44 + rnd(144, i) * 10; glossEllipse(ctx, K, bx + bw / 2, 252 + rnd(145, i) * 4, bw / 2, 16, '#7a786a', 0, { h: 100, tex: 'stipple', seed: i, amount: 0.3 }); }
    for (let i = 0; i < 20; i++) { ctx.fillStyle = i % 2 ? MOSS : '#6a8a40'; ctx.beginPath(); ctx.ellipse(rnd(146, i) * STAGE_W, 240 + rnd(147, i) * 8, 6 + rnd(148, i) * 8, 3, 0, 0, Math.PI * 2); ctx.fill(); }
  },
};
