// The Lantern Chapterhouse in Thornhold: a nave of living trees, the chapter's lamp burning in the
// hollow of the oldest of them.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, block, forestFill, line, smudge, fillPoly, ink, path, trunk, pool } from '../kit.ts';
import { K, altar, candle, lantern, lanternRing, books } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';

const BARK = '#5e4a36', MOSS = '#5a7a3a';

/** A root running along the ground from (x0, y0) toward (x1, y1), thinning, humped where it arches over the soil. */
function root(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, r: number, seed: number): void {
  const pts: number[] = [];
  for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push(x0 + (x1 - x0) * u + (rnd(seed, i) - 0.5) * 10, y0 + (y1 - y0) * u - Math.sin(u * Math.PI * 1.5) * r * 0.6); }
  trunk(ctx, pts, r, Math.max(1.5, r * 0.25), BARK, seed);
}

/**
 * A lantern-staff of grown wood planted in the moss: gnarled and bent into a crook at the head,
 * the lantern hanging from it. Its foot at (x, y), its crown at `top`.
 */
function lanternStaff(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, top: number): void {
  const hook = x + 18;
  const shaft = [x, y, x - 1, (y + top) / 2 + 20, x + 1, (y + top) / 2 - 10, x - 1, top + 12, x + 6, top, hook - 4, top - 2, hook, top + 6];
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(shaft[0], shaft[1]); for (let i = 2; i < shaft.length; i += 2) ctx.lineTo(shaft[i], shaft[i + 1]); ctx.stroke();
  ctx.strokeStyle = '#7a5a34'; ctx.lineWidth = 5; ctx.stroke();
  ctx.strokeStyle = '#a07a4a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(shaft[0] - 1.5, shaft[1]); for (let i = 2; i < 8; i += 2) ctx.lineTo(shaft[i] - 1.5, shaft[i + 1]); ctx.stroke();
  lantern(ctx, s, hook, top + 16, 10, '#b08a3a', top + 6, 150, '#ffe8a8');
}

export const CHAPTERHOUSE: Scene = {
  ambient: ['#2e3638', '#90a08c'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 214;
    // The grove behind: green haze and trunks going back.
    forestFill(ctx, 0, 0, STAGE_W, FLOOR + 10, s.daylight, 61);
    const earth = ctx.createLinearGradient(0, FLOOR - 10, 0, STAGE_H);
    earth.addColorStop(0, '#3a3424'); earth.addColorStop(1, '#4a4028');
    ctx.fillStyle = earth; ctx.fillRect(0, FLOOR - 10, STAGE_W, STAGE_H - FLOOR + 10);
    for (let i = 0; i < 40; i++) { ctx.fillStyle = rgba(i % 2 ? MOSS : '#6a8a44', 0.5); ctx.beginPath(); ctx.ellipse(rnd(62, i) * STAGE_W, FLOOR - 6 + rnd(63, i) * 60, 6 + rnd(64, i) * 14, 2 + rnd(65, i) * 3, 0, 0, Math.PI * 2); ctx.fill(); }
    // The oldest tree: a trunk as wide as a house, its hollow holding the chapter's lamp.
    trunk(ctx, [200, FLOOR + 6, 198, 150, 196, 90, 200, 30, 204, -10], 78, 64, BARK, 7);
    const hx = 200, hy = 58;
    ctx.beginPath(); ctx.ellipse(hx, hy, 26, 34, 0, 0, Math.PI * 2); ctx.fillStyle = '#140e0a'; ctx.fill();
    ctx.save(); ctx.clip();
    smudge(ctx, hx, hy + 6, 40, '#ffb050', 0.55);
    ctx.restore();
    ctx.lineWidth = 5; ctx.strokeStyle = shade(BARK, 1.25); ctx.beginPath(); ctx.ellipse(hx, hy, 27, 35, 0, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = '#120c14'; ctx.beginPath(); ctx.ellipse(hx, hy, 29, 37, 0, 0, Math.PI * 2); ctx.stroke();
    lantern(ctx, s, hx, hy - 20, 14, '#b08a3a', hy - 34, 210, '#ffe8a8');
    // Age on the old tree: knots where boughs fell, moss up from the roots, ivy climbing it.
    for (const [kx, ky, kr] of [[160, 150, 7], [238, 120, 6], [214, 176, 5], [168, 96, 5]] as [number, number, number][]) {
      ctx.beginPath(); ctx.ellipse(kx, ky, kr, kr * 1.4, 0, 0, Math.PI * 2); ctx.fillStyle = shade(BARK, 0.6); ctx.fill();
      ctx.beginPath(); ctx.ellipse(kx, ky, kr * 0.55, kr * 0.85, 0, 0, Math.PI * 2); ctx.fillStyle = shade(BARK, 0.4); ctx.fill();
      ctx.strokeStyle = shade(BARK, 1.25); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(kx, ky, kr + 1.5, kr * 1.4 + 2, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    }
    for (let i = 0; i < 26; i++) { const mx = 128 + rnd(73, i) * 144, my = FLOOR - rnd(74, i) * rnd(75, i) * 60; ctx.fillStyle = rgba(i % 3 ? MOSS : '#7a9a4a', 0.8); ctx.beginPath(); ctx.ellipse(mx, my, 4 + rnd(76, i) * 7, 2 + rnd(77, i) * 3, 0, 0, Math.PI * 2); ctx.fill(); }
    for (const [x0, sd] of [[146, 1], [252, -1]] as [number, number][]) {
      const vine: number[] = [];
      for (let i = 0; i <= 12; i++) vine.push(x0 + Math.sin(i * 0.9) * 6 + sd * i * 1.5, FLOOR - i * 13);
      line(ctx, vine, '#3a5a2a', 1.5);
      for (let i = 1; i < 12; i++) {
        const vx = vine[i * 2], vy = vine[i * 2 + 1];
        for (const side of [-1, 1]) {
          const a = side * 0.9 - Math.PI / 2 + (rnd(78, x0, i, side) - 0.5), len = 6 + rnd(79, x0, i, side) * 3, ux = Math.cos(a), uy = Math.sin(a);
          glossPoly(ctx, K, [vx, vy, vx + ux * len * 0.5 - uy * len * 0.4, vy + uy * len * 0.5 + ux * len * 0.4, vx + ux * len, vy + uy * len, vx + ux * len * 0.5 + uy * len * 0.4, vy + uy * len * 0.5 - ux * len * 0.4], i % 2 ? '#4a7a3a' : '#5a8a40', { gloss: 0.1 });
        }
      }
    }
    // The nave: trunks either side leaning in, their boughs meeting overhead in pointed arches.
    trunk(ctx, [30, FLOOR + 30, 36, 140, 48, 70, 90, 20, 150, -10], 24, 10, BARK, 8);
    trunk(ctx, [370, FLOOR + 30, 364, 140, 352, 70, 310, 20, 250, -10], 24, 10, BARK, 9);
    trunk(ctx, [100, FLOOR, 104, 150, 112, 80, 132, 30, 170, 0], 12, 7, shade(BARK, 1.1), 10);
    trunk(ctx, [300, FLOOR, 296, 150, 288, 80, 268, 30, 230, 0], 12, 7, shade(BARK, 1.1), 11);
    for (let i = 0; i < 60; i++) {
      const lx = rnd(66, i) * STAGE_W, ly = rnd(67, i) * 26 - 4, a = rnd(68, i) * Math.PI * 2, len = 9 + rnd(69, i) * 7, col = i % 3 ? '#4a7a3a' : '#6a9a44';
      const ux = Math.cos(a), uy = Math.sin(a), w = len * 0.32;
      glossPoly(ctx, K, [lx, ly, lx + ux * len * 0.35 - uy * w, ly + uy * len * 0.35 + ux * w, lx + ux * len, ly + uy * len, lx + ux * len * 0.35 + uy * w, ly + uy * len * 0.35 - ux * w], col, { gloss: 0.1 });
    }
    // Roots across the floor from the old tree's foot, and stones in the moss.
    root(ctx, 150, FLOOR + 4, 20, FLOOR + 30, 9, 1); root(ctx, 250, FLOOR + 4, 390, FLOOR + 26, 9, 2);
    root(ctx, 170, FLOOR + 8, 80, STAGE_H + 6, 7, 3); root(ctx, 234, FLOOR + 8, 330, STAGE_H + 6, 7, 4);
    for (const [bx, by, bw] of [[60, 240, 26], [352, 250, 30]] as [number, number, number][]) glossEllipse(ctx, K, bx, by, bw / 2, bw * 0.3, '#7a7866', 0, { h: 80, tex: 'stipple', seed: bx, amount: 0.4 });
    // Lanterns in the side boughs, and by day the sun in shafts through the leaves; by night, fireflies.
    lantern(ctx, s, 88, 96, 11, '#4a3a2a', 30, 140, '#e8f0a0');
    lantern(ctx, s, 312, 96, 11, '#4a3a2a', 30, 140, '#e8f0a0');
    if (s.daylight > 0.25) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const [x0, x1] of [[40, 70], [320, 350], [140, 160]] as [number, number][]) { const g = ctx.createLinearGradient(0, 0, 0, FLOOR); g.addColorStop(0, rgba('#fff4c0', 0.18 * s.daylight)); g.addColorStop(1, rgba('#fff4c0', 0)); fillPoly(ctx, [x0, 0, x1, 0, x1 + 40, FLOOR, x0 + 40, FLOOR], g); }
      ctx.restore();
      pool(s, 200, 200, 220, '#e0f0c0', 0.5 * s.daylight);
    } else s.lights.push({ k: 'motes', x: 20, y: 60, w: 360, h: 140, color: '#d8ff80', n: 22, rise: 0.08 });
    lanternStaff(ctx, s, 296, 226, 70);
    // The altar: one great rough-hewn block of grey stone, moss spilling over its lip, the order's ring cut in its face.
    const x0 = 126, x1 = 274, top = 198, bottom = 262, stone = '#8a887a';
    const face = [x0 + 2, top + 9, x1 - 2, top + 9, x1 + 5, bottom, x0 - 5, bottom];
    ctx.save(); path(ctx, face); ctx.clip();
    stones(ctx, x0 - 6, top + 9, x1 - x0 + 12, bottom - top - 9, stone, 3, 71, { long: 2.4, mottle: MOSS });
    const shadeUp = ctx.createLinearGradient(0, top, 0, bottom);
    shadeUp.addColorStop(0, rgba('#0a0608', 0)); shadeUp.addColorStop(1, rgba('#0a0608', 0.35));
    ctx.fillStyle = shadeUp; ctx.fillRect(x0 - 6, top, x1 - x0 + 12, bottom - top);
    ctx.restore();
    path(ctx, face); ink(ctx);
    block(ctx, x0 - 4, top, x1 - x0 + 8, 11, shade(stone, 1.08), 5);
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.strokeRect(x0 - 3.5, top + 0.5, x1 - x0 + 7, 10);
    for (let i = 0; i < 16; i++) {
      const mx = x0 + rnd(70, i) * (x1 - x0), drip = 3 + rnd(71, i) * 10;
      ctx.fillStyle = i % 2 ? MOSS : '#6a8a40';
      ctx.beginPath(); ctx.ellipse(mx, top + 10, 4 + rnd(72, i) * 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(Math.round(mx - 1), Math.round(top + 10), 2, Math.round(drip));
    }
    lanternRing(ctx, 200, 234, 12, '#c9a34a');
    candle(ctx, s, 136, top + 2, 14, '#ece4c8', 90);
    candle(ctx, s, 264, top + 2, 14, '#ece4c8', 90);
    books(ctx, 214, top + 1, 26, 7, 9, ['#4a6a3a', '#6a3a2a']);
  },
};
