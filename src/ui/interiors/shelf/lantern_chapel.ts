// The Chapel of the Lanterns in Helmstow: a stone apse lit through stained glass and by the
// lanterns the order is named for.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, rnd, stones, flagstones, windowIn, fillPoly, ink, path, pool } from '../kit.ts';
import { K, pillar, stainedGlass, altar, pew, candle, lantern, banner, lanternRing } from '../props.ts';
import { glossPoly } from '../../monsters/gloss.ts';

const LIME = '#cfc4ac', RED = '#a83a2a', GOLD = '#d8b050';
const GLASS = ['#b83a3a', '#3a5ab0', '#d8a83a', '#3a8a5a', '#8a4ab0', '#c86a2a'];

/** An iron hook driven into the wall, for a lamp's chain. */
function hook(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#2a2428'; ctx.fillRect(x - 3, y - 3, 6, 4);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 4); ctx.arc(x + 2, y + 4, 2, Math.PI, 0, true); ctx.stroke();
  ctx.strokeStyle = '#5a5460'; ctx.lineWidth = 1.5; ctx.stroke();
}

/**
 * The chapel's own lantern, the one the order keeps lit day and night: a great lamp of brass and
 * glass standing on the altar, its foot on y.
 */
function greatLantern(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, size: number): void {
  // Its stand: a stepped brass foot and a short column.
  glossPoly(ctx, K, [x - size * 0.8, y, x - size * 0.6, y - size * 0.25, x + size * 0.6, y - size * 0.25, x + size * 0.8, y], GOLD, { gloss: 0.6, spread: 0.7 });
  glossPoly(ctx, K, [x - size * 0.2, y - size * 0.25, x - size * 0.16, y - size * 0.7, x + size * 0.16, y - size * 0.7, x + size * 0.2, y - size * 0.25], GOLD, { gloss: 0.6, spread: 0.7 });
  lantern(ctx, s, x, y - size * 2.54, size, GOLD, null, 200, '#ffe8b0');
  // The ring of the order round its crown.
  lanternRing(ctx, x, y - size * 3.2, size * 0.42, GOLD);
}

export const LANTERN_CHAPEL: Scene = {
  ambient: ['#3c3848', '#a49e98'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 212, ax0 = 128, ax1 = 272, spring = 92;
    stones(ctx, 0, 0, STAGE_W, FLOOR, LIME, 13, 41);
    flagstones(ctx, FLOOR, 200, 104, '#a09684', 6, 42);
    // The apse: a deep arched recess, its stone a shade darker for being out of the room's light.
    const apse = (grow: number): number[] => {
      const pts = [ax0 - grow, FLOOR, ax0 - grow, spring];
      for (let i = 0; i <= 16; i++) { const a = Math.PI + (i / 16) * Math.PI; pts.push(200 + Math.cos(a) * ((ax1 - ax0) / 2 + grow), spring + Math.sin(a) * (76 + grow)); }
      pts.push(ax1 + grow, FLOOR);
      return pts;
    };
    ctx.save(); path(ctx, apse(0)); ctx.clip();
    stones(ctx, ax0, 0, ax1 - ax0, FLOOR, shade(LIME, 0.78), 13, 43);
    const deep = ctx.createLinearGradient(ax0, 0, ax1, 0);
    deep.addColorStop(0, rgba('#1a1420', 0.45)); deep.addColorStop(0.5, rgba('#1a1420', 0.1)); deep.addColorStop(1, rgba('#1a1420', 0.5));
    ctx.fillStyle = deep; ctx.fillRect(ax0, 0, ax1 - ax0, FLOOR);
    ctx.restore();
    // Voussoirs round the arch.
    for (let i = 0; i < 15; i++) {
      const a0 = Math.PI + (i / 15) * Math.PI, a1 = Math.PI + ((i + 1) / 15) * Math.PI, R0 = 72, R1 = 86;
      const pts = [200 + Math.cos(a0) * R0, spring + Math.sin(a0) * (R0 + 4), 200 + Math.cos(a0) * R1, spring + Math.sin(a0) * (R1 + 4), 200 + Math.cos(a1) * R1, spring + Math.sin(a1) * (R1 + 4), 200 + Math.cos(a1) * R0, spring + Math.sin(a1) * (R0 + 4)];
      fillPoly(ctx, pts, shade(LIME, i === 7 ? 1.12 : 0.95 + rnd(44, i) * 0.12)); path(ctx, pts); ink(ctx);
    }
    // The window: the ring and the flame in glass, over the altar.
    windowIn(ctx, s, 172, 40, 56, 112, shade(LIME, 0.9), { arched: true, view: (c) => stainedGlass(c, 172, 40, 56, 112, s.daylight, GLASS, 5), panes: [1, 1], lead: 'rgba(0,0,0,0)' });
    if (s.daylight > 0.2) {
      // The glass's light falling across the apse, and dust turning in it.
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const beam = ctx.createLinearGradient(0, 60, 0, FLOOR);
      beam.addColorStop(0, rgba('#ffe0b0', 0.16 * s.daylight)); beam.addColorStop(1, rgba('#ffe0b0', 0));
      fillPoly(ctx, [174, 70, 226, 70, 262, FLOOR, 150, FLOOR], beam);
      ctx.restore();
      s.lights.push({ k: 'motes', x: 160, y: 70, w: 90, h: 120, color: '#fff0c8', n: 26, rise: 0.05 });
      pool(s, 200, 120, 150, '#ffe8c0', 0.7 * s.daylight);
    }
    // The nave's pillars, with the order's banners hung from them, and lanterns on chains.
    pillar(ctx, 104, 8, FLOOR, 30, LIME);
    pillar(ctx, 296, 8, FLOOR, 30, LIME);
    const ring = (cx: number, cy: number, r: number): void => lanternRing(ctx, cx, cy, r, GOLD);
    banner(ctx, 28, 30, 40, 100, RED, { trim: GOLD, tail: 'swallow', emblem: ring });
    banner(ctx, 332, 30, 40, 100, RED, { trim: GOLD, tail: 'swallow', emblem: ring });
    for (const lx of [48, 352]) { hook(ctx, lx, 140); lantern(ctx, s, lx, 152, 12, '#3a3440', 146, 150); }
    // The altar, and on it the great lantern, two candles and the book of hours.
    altar(ctx, 124, 276, 192, 9, 252, LIME, RED, GOLD, (cx, cy, r) => lanternRing(ctx, cx, cy, r, GOLD));
    candle(ctx, s, 136, 200, 16, '#f0e8d0', 90);
    candle(ctx, s, 264, 200, 16, '#f0e8d0', 90);
    greatLantern(ctx, s, 200, 199, 16);
    // An open book of the order's hours.
    glossPoly(ctx, K, [228, 199, 248, 195, 252, 199, 232, 203], '#6a2a20', {});
    glossPoly(ctx, K, [229, 197, 240, 193, 240, 198, 230, 201], '#f0e8d8', {});
    glossPoly(ctx, K, [240, 193, 250, 195, 250, 199, 240, 198], '#e8e0d0', {});
    pew(ctx, -10, 100, 230, 40, '#6a4428', false);
    pew(ctx, 300, 410, 230, 40, '#6a4428', true);
  },
};
