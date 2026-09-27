// The Lantern Hall in Thornhold: a hall of living wood round a copy of the Grove Stone whose runes
// still burn.
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, flagstones, windowIn, forestFill, line, smudge, pool, trunk } from '../kit.ts';
import { K, books, candle, counter, jar } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { SPINES, bookcase, lectern } from '../guilds.ts';

const BARK = '#5e4a36', RUNE = '#6affc8';

/**
 * A copy of the Grove Stone the Lanterns keep to study: a tall standing stone on a round dais, cut
 * with the Underdeep's runes, which glow. Foot on y.
 */
function wardstone(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  glossEllipse(ctx, K, x, y, h * 0.55, h * 0.1, '#6a6a60', 0, {});
  glossEllipse(ctx, K, x, y - h * 0.05, h * 0.42, h * 0.08, '#7a7a70', 0, {});
  const w = h * 0.28, pts = [x - w * 0.5, y - h * 0.06, x - w * 0.6, y - h * 0.6, x - w * 0.4, y - h * 0.95, x - w * 0.05, y - h, x + w * 0.35, y - h * 0.94, x + w * 0.55, y - h * 0.62, x + w * 0.5, y - h * 0.06];
  glossPoly(ctx, K, pts, '#8a8a80', { spread: 0.7, h: 120, tex: 'cracks', seed: 5, amount: 0.5 });
  // Runes in two columns down its face, each on its own glow.
  for (let i = 0; i < 7; i++) for (const c of [-1, 1]) {
    const rx = x + c * w * 0.2, ry = y - h * (0.2 + i * 0.1), g = w * 0.1;
    line(ctx, i % 2 ? [rx - g, ry + g, rx, ry - g, rx + g, ry + g] : [rx - g, ry - g, rx + g, ry - g, rx, ry + g, rx - g, ry - g], RUNE, 1.2);
  }
  s.lights.push({ k: 'glow', x, y: y - h * 0.5, r: h * 0.55, color: '#40e0a0', a: 0.35 });
  pool(s, x, y - h * 0.5, h * 1.8, '#80ffc8', 0.55);
}

export const LANTERN_HALL: Scene = {
  ambient: ['#243034', '#84988e'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 214;
    ctx.fillStyle = '#1e1a16'; ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    // Tall pointed windows onto the forest between the trunks.
    for (const wx of [40, 150, 250, 360]) {
      const w = 52, top = 34, bottom = 170;
      windowIn(ctx, s, wx - w / 2, top, w, bottom - top, '#6a5a3e', { arched: true, panes: [2, 4], view: (c) => forestFill(c, wx - w / 2, top, w, bottom - top, s.daylight, wx) });
    }
    flagstones(ctx, FLOOR, 200, 110, '#7a786a', 7, 111);
    // Bookshelves grown into the lower walls.
    for (const [bx, bw] of [[0, 70], [330, 70]] as [number, number][]) { bookcase(ctx, bx, 176, bw, FLOOR, '#6a5238', bx + 3, 1); }
    // The trunks: pillars that rise and meet overhead in pointed arches.
    for (const [x0, lean] of [[96, 1], [304, -1], [0, 1], [400, -1]] as [number, number][]) {
      trunk(ctx, [x0, FLOOR + 4, x0 + lean * 2, 140, x0 + lean * 8, 70, x0 + lean * 40, 20, x0 + lean * 90, -10], x0 === 0 || x0 === 400 ? 24 : 14, 7, BARK, x0 + 7);
    }
    // The great lantern: an orb of light caged in branches, hung over the stone.
    for (let i = 0; i < 3; i++) line(ctx, [200 + (i - 1) * 16, 0, 200, 42], '#3a2e22', 2);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, 200, 60, 40, '#ffe0a0', 0.6); ctx.restore();
    glossBall(ctx, K, 200, 60, 13, '#fff0c8', { gloss: 0.9 });
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI; ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(200, 60, 17 * Math.abs(Math.cos(a)) + 0.5, 17, 0, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 2; ctx.stroke(); }
    s.lights.push({ k: 'glow', x: 200, y: 60, r: 36, color: '#ffd080', a: 0.45 });
    pool(s, 200, 70, 230, '#ffd890', 0.85);
    // The stone on its dais, and its runes' light.
    wardstone(ctx, s, 200, FLOOR - 2, 116);
    s.lights.push({ k: 'motes', x: 120, y: 60, w: 160, h: 140, color: '#b8ffd8', n: 22, rise: 0.15 });
    // The reading desk across the front: a curved board of living wood, a book whose script burns.
    counter(ctx, 60, 340, 214, 10, STAGE_H, '#7a5a3a', 112, { panels: 4, trim: '#5ad0a0' });
    lectern(ctx, s, 118, 224, 26, '#6a4a30', RUNE);
    candle(ctx, s, 290, 224, 12, '#efe4c8', 90);
    books(ctx, 250, 223, 26, 9, 12, SPINES);
    jar(ctx, 320, 224, 10, 12, '#5a7a8a', '#3a4a5a');
  },
};
