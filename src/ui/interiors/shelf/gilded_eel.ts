// The Gilded Eel on Helmstow's waterfront, where the rumours are: tarred planks and nets, the gilt
// eel over the bar, the harbour and the Hearth out of its window.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, planks, beam, floorboards, windowIn, skyFill, line, smudge, fillPoly, slab, trunk, pool } from '../kit.ts';
import { K, counter, shelf, bottle, tankard, lantern, kegEnd, barrel, stool } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { table, bottleCandle } from '../taverns.ts';

const TAR = '#3e3028', TIMBER = '#5a4230', GILT = '#e0b440';

/** The harbour at the hour through a round window: the sea, the boats' masts, and on the horizon the Hearth. */
function harbour(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    skyFill(ctx, x, y, w, h * 0.62, daylight, 151);
    const sea = ctx.createLinearGradient(0, y + h * 0.6, 0, y + h);
    sea.addColorStop(0, mix('#1a2a4a', '#4a80b8', daylight)); sea.addColorStop(1, mix('#0e1628', '#2a5a8a', daylight));
    ctx.fillStyle = sea; ctx.fillRect(x, y + h * 0.6, w, h * 0.4);
    // The Hearth: a column of light on the horizon, far across the water, and its path on the sea.
    const hx = x + w * 0.62, hy = y + h * 0.6;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, hx, hy, h * 0.4, '#ffd8a0', 0.45 + 0.35 * (1 - daylight)); ctx.restore();
    ctx.fillStyle = rgba('#fff0c8', 0.9); ctx.fillRect(Math.round(hx), y + 2, 1, h * 0.6 - 2);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = rgba('#ffe0a0', 0.5 - i * 0.07); ctx.fillRect(Math.round(hx - 2 - i), Math.round(hy + 2 + i * 3), 5 + i * 2, 1); }
    // Masts and a hull at the quay.
    ctx.fillStyle = mix('#0a0c14', '#3a3a44', daylight);
    fillPoly(ctx, [x + w * 0.08, y + h * 0.74, x + w * 0.44, y + h * 0.74, x + w * 0.38, y + h * 0.84, x + w * 0.12, y + h * 0.84], ctx.fillStyle as string);
    ctx.fillRect(Math.round(x + w * 0.24), Math.round(y + h * 0.2), 1.5, Math.round(h * 0.55));
    line(ctx, [x + w * 0.24, y + h * 0.22, x + w * 0.1, y + h * 0.72], rgba('#0a0c14', 0.8), 1);
    line(ctx, [x + w * 0.24, y + h * 0.22, x + w * 0.4, y + h * 0.72], rgba('#0a0c14', 0.8), 1);
    for (let i = 0; i < 5; i++) line(ctx, [x + w * (0.5 + i * 0.1), y + h * (0.66 + (i % 2) * 0.1), x + w * (0.56 + i * 0.1), y + h * (0.66 + (i % 2) * 0.1)], rgba('#ffffff', 0.35), 1);
  };
}

/** A fishing net hung in swags from pegs along `y`, from x0 to x1, with cork floats on its lines. */
function net(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, drop: number, seed: number): void {
  const n = 3, span = (x1 - x0) / n;
  for (let k = 0; k < n; k++) {
    const a = x0 + k * span, b = a + span;
    const sag = (u: number): number => y + Math.sin(u * Math.PI) * drop;
    // The mesh: diagonals between the pegs and the sagging lower edge.
    for (let i = 0; i <= 8; i++) {
      const u = i / 8, px = a + span * u;
      line(ctx, [px, y, a + span * Math.min(1, u + 0.3), sag(Math.min(1, u + 0.3))], rgba('#c8b890', 0.6), 1);
      line(ctx, [px, y, a + span * Math.max(0, u - 0.3), sag(Math.max(0, u - 0.3))], rgba('#c8b890', 0.6), 1);
    }
    const edge: number[] = []; for (let i = 0; i <= 12; i++) edge.push(a + span * (i / 12), sag(i / 12));
    line(ctx, edge, '#d8c8a0', 1.5);
    for (let i = 1; i < 4; i++) glossEllipse(ctx, K, a + span * (i / 4), sag(i / 4) + 2, 3.5, 2.5, i % 2 ? '#e87a3a' : '#e8dcc0', 0, { gloss: 0.4 });
    glossBall(ctx, K, a, y, 2.5, '#6a4a30', {});
  }
  glossBall(ctx, K, x1, y, 2.5, '#6a4a30', {});
  void seed;
}

/**
 * The gilt eel over the bar, the house's name carved and gilded: a long sinuous body in a wave
 * along a board, head raised with an open jaw, fins along its back. Centre (x, y), `len` long.
 */
function gildedEel(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, len: number): void {
  slab(ctx, x - len * 0.56, y - 14, len * 1.12, 28, '#3a2a1e', { lit: 2, dark: 0.3 });
  const spine: number[] = [];
  for (let i = 0; i <= 14; i++) { const u = i / 14; spine.push(x - len / 2 + len * u, y + Math.sin(u * Math.PI * 2.2) * 6 * (1 - u * 0.4)); }
  trunk(ctx, spine, 1.5, 5, GILT, 3);
  const hx = spine[spine.length - 2], hy = spine[spine.length - 1];
  glossPoly(ctx, K, [hx - 2, hy - 5, hx + 8, hy - 7, hx + 13, hy - 3, hx + 8, hy - 1, hx + 13, hy + 2, hx + 6, hy + 4, hx - 2, hy + 5], GILT, { gloss: 0.9, spread: 0.6 });
  ctx.fillStyle = '#120c14'; ctx.fillRect(Math.round(hx + 5), Math.round(hy - 4), 2, 2);
  for (let i = 2; i < 12; i += 2) { const fx = spine[i * 2], fy = spine[i * 2 + 1]; fillPoly(ctx, [fx - 2, fy - 3, fx + 1, fy - 8, fx + 3, fy - 3], shade(GILT, 0.85)); }
  // Glints that catch the lamplight.
  for (let i = 0; i < 3; i++) s.lights.push({ k: 'glow', x: spine[4 + i * 8], y: spine[5 + i * 8] - 2, r: 6, color: '#ffe8a0', a: 0.35 });
}

/** Two oars crossed on the wall, centre (x, y). */
function oars(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  for (const sd of [-1, 1]) {
    const x0 = x - sd * len * 0.35, y0 = y + len * 0.35, x1 = x + sd * len * 0.35, y1 = y - len * 0.35;
    line(ctx, [x0, y0, x1, y1], '#120c14', 5); line(ctx, [x0, y0, x1, y1], '#9a7a4a', 3);
    const bx = x1 + sd * len * 0.1, by = y1 - len * 0.1;
    glossPoly(ctx, K, [x1 - 3, y1 + 3, bx - 5 * sd, by - 2, bx + 2 * sd, by - 7, x1 + 3, y1 - 3], '#b0905a', {});
  }
}

export const GILDED_EEL: Scene = {
  ambient: ['#3a3444', '#8c8a88'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 206;
    planks(ctx, 0, 0, STAGE_W, FLOOR, TAR, 16, false, 150);
    floorboards(ctx, FLOOR, 200, 100, '#6a5038', 8, 152);
    beam(ctx, 0, 0, STAGE_W, 12, TIMBER, 153);
    for (const bx of [98, 300]) beam(ctx, bx, 12, 12, FLOOR - 12, TIMBER, bx);
    // Left: the round window onto the harbour, nets and floats, oars crossed over it.
    windowIn(ctx, s, 26, 46, 58, 58, '#6a5a44', { round: true, panes: [2, 2], view: harbour(26, 46, 58, 58, s.daylight) });
    pool(s, 55, 80, 120, '#ffd8a0', 0.35 * (1 - s.daylight));
    net(ctx, 4, 94, 120, 26, 1);
    oars(ctx, 55, 160, 62);
    // The bar back: shelves of bottles, casks on their sides, the gilt eel over it all.
    gildedEel(ctx, s, 200, 34, 150);
    shelf(ctx, 118, 66, 164, TIMBER);
    for (let i = 0; i < 11; i++) bottle(ctx, 126 + i * 15, 66, 15 + rnd(154, i) * 9, ['#3a6a4a', '#6a2a2a', '#2a3a6a', '#8a6a2a', '#4a2a4a'][i % 5], { label: i % 3 === 0 ? '#e8dcc0' : undefined, squat: i % 4 === 1 });
    shelf(ctx, 118, 104, 164, TIMBER);
    for (let i = 0; i < 8; i++) tankard(ctx, 130 + i * 20, 104, 14, i % 2 ? '#a0a6ae' : '#8a5a36', { band: i % 2 ? '#6a6e78' : '#3a2618' });
    beam(ctx, 116, 168, 168, 6, TIMBER, 155);
    for (let i = 0; i < 4; i++) kegEnd(ctx, 140 + i * 40, 150, 17, '#7a5230');
    // Right: nets again, an anchor leant in the corner, a ship's lantern.
    net(ctx, 312, 396, 40, 30, 2);
    windowIn(ctx, s, 330, 96, 44, 40, '#6a5a44', { panes: [2, 2], view: harbour(330, 96, 44, 40, s.daylight) });
    // The anchor: a shank, a stock across the top, two flukes.
    const ax = 358, ay = FLOOR - 4;
    line(ctx, [ax, ay - 64, ax, ay - 8], '#120c14', 6); line(ctx, [ax, ay - 64, ax, ay - 8], '#4a4852', 4);
    line(ctx, [ax - 14, ay - 58, ax + 14, ay - 58], '#120c14', 6); line(ctx, [ax - 14, ay - 58, ax + 14, ay - 58], '#6a4a30', 4);
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(ax, ay - 22, 16, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.strokeStyle = '#4a4852'; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = '#2a2428'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ax, ay - 70, 5, 0, Math.PI * 2); ctx.stroke();
    lantern(ctx, s, 230, 150 - 104, 12, '#3a4a4a', 12, 170, '#ffe0a0');
    lantern(ctx, s, 318, 150, 10, '#3a4a4a', 136, 130, '#ffe0a0');
    // The bar: dark, brass-railed, wet rings on it, tankards and a candle stuck in a bottle.
    counter(ctx, 104, 300, 186, 11, 240, TIMBER, 156, { panels: 3, trim: '#c9a34a' });
    line(ctx, [104, 232, 300, 232], '#120c14', 4); line(ctx, [104, 232, 300, 232], '#c9a34a', 2);
    tankard(ctx, 138, 196, 15, '#a0a6ae', { band: '#6a6e78', foam: true });
    tankard(ctx, 262, 196, 14, '#8a5a36', { band: '#3a2618', foam: true, handleLeft: true });
    bottleCandle(ctx, s, 200, 196, 14);
    glossEllipse(ctx, K, 226, 194, 10, 3, '#d8d0c0', 0, {});
    for (let i = 0; i < 3; i++) glossPoly(ctx, K, [220 + i * 5, 193, 224 + i * 5, 190, 227 + i * 5, 193, 223 + i * 5, 195], '#c8903a', { gloss: 0.4 });
    // A table of the evening's drinking in the foreground, and a barrel for a seat.
    table(ctx, 62, 238, 90, '#6a4a30');
    tankard(ctx, 44, 240, 14, '#a0a6ae', { band: '#6a6e78' }); tankard(ctx, 70, 244, 13, '#8a5a36', { band: '#3a2618', handleLeft: true });
    bottleCandle(ctx, s, 88, 236, 12);
    for (let i = 0; i < 3; i++) glossEllipse(ctx, K, 54 + i * 4, 247 - i * 1.5, 3.5, 1.4, '#e0b840', 0, { gloss: 0.7 });
    barrel(ctx, 356, STAGE_H + 8, 48, 60, '#6a4a2e');
    stool(ctx, 150, 270, 26, '#6a4a30');
  },
};
