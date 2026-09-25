// The taverns, where the rumours are: the Gilded Eel on Harrow's waterfront, tarred planks and
// nets and the gilt eel over the bar, the harbour and the Hearth out of its window; and the Split
// Oak in Thornhold, built round a living oak whose trunk parts over the bar.
import { shade, rgba, mix } from '../../lib/art/palettes.ts';
import type { Scene, Stage } from './kit.ts';
import { STAGE_W, STAGE_H, rnd, planks, beam, floorboards, plaster, windowIn, forestFill, skyFill, line, smudge, fillPoly, path, slab, trunk, flame, pool } from './kit.ts';
import { K, counter, logCounter, shelf, bottle, jar, tankard, cup, candle, lantern, kegEnd, barrel, herbs, stool } from './props.ts';
import { glossPoly, glossEllipse, glossBall } from '../monsters/gloss.ts';

/**
 * A round table in the foreground seen from above, centre of its top at (x, y), `w` across: an
 * elliptical top on a pedestal.
 */
function table(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, wood: string): void {
  line(ctx, [x, y + w * 0.1, x, STAGE_H + 4], '#120c14', w * 0.14 + 2); line(ctx, [x, y + w * 0.1, x, STAGE_H + 4], shade(wood, 0.7), w * 0.14);
  glossEllipse(ctx, K, x, y + 3, w / 2, w * 0.2, shade(wood, 0.7), 0, {});
  glossEllipse(ctx, K, x, y, w / 2, w * 0.2, wood, 0, { gloss: 0.2, spread: 0.8 });
  ctx.strokeStyle = rgba(shade(wood, 0.6), 0.6); ctx.lineWidth = 1;
  for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x, y, (w / 2) * (i / 3), w * 0.2 * (i / 3), 0, 0, Math.PI * 2); ctx.stroke(); }
}

/** A candle stuck in the neck of a bottle, wax run down its sides. Foot on y. */
function bottleCandle(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  bottle(ctx, x, y, h, '#2a4a3a');
  for (let i = 0; i < 4; i++) { ctx.fillStyle = '#efe4c8'; ctx.fillRect(Math.round(x - 2 + i * 1.5), Math.round(y - h), 1.5, Math.round(3 + rnd(x, i) * h * 0.4)); }
  glossPoly(ctx, K, [x - 2, y - h - 1, x - 2, y - h - 8, x + 2, y - h - 8, x + 2, y - h - 1], '#efe4c8', {});
  flame(s, x, y - h - 9, 2.4, 90, 0.75);
}

// ------------------------------------------------------------------ the Gilded Eel ----

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

// ------------------------------------------------------------------ the Split Oak ----

const OAK = '#5a4834', DAUB = '#8a8468', GOLDWOOD = '#9a7a4a';

/** A coin that is not from Caldera: square-holed, silver, lying on the table where someone paid with it. */
function strangeCoin(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number): void {
  glossEllipse(ctx, K, x, y, 5, 2.2, '#c8ccd8', 0, { gloss: 0.9 });
  ctx.fillStyle = '#2a2a34'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 1);
  s.lights.push({ k: 'glow', x, y: y - 1, r: 5, color: '#e0e8ff', a: 0.4 });
}

export const SPLIT_OAK: Scene = {
  ambient: ['#2c2c36', '#7e8278'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 204;
    plaster(ctx, 0, 0, STAGE_W, FLOOR, DAUB, 161);
    floorboards(ctx, FLOOR, 200, 100, '#6a5236', 8, 162);
    // Round windows onto the forest either side.
    windowIn(ctx, s, 22, 50, 52, 52, GOLDWOOD, { round: true, panes: [2, 2], view: (c) => forestFill(c, 22, 50, 52, 52, s.daylight, 3) });
    windowIn(ctx, s, 326, 50, 52, 52, GOLDWOOD, { round: true, panes: [2, 2], view: (c) => forestFill(c, 326, 50, 52, 52, s.daylight, 4) });
    shelf(ctx, 14, 128, 70, GOLDWOOD);
    for (let i = 0; i < 4; i++) cup(ctx, 24 + i * 16, 128, 10, i % 2 ? GOLDWOOD : '#6a5030');
    shelf(ctx, 318, 128, 70, GOLDWOOD);
    for (let i = 0; i < 4; i++) jar(ctx, 328 + i * 16, 128, 11, 14, ['#6a8a6a', '#a86a3a', '#7a5a8a', '#c8a060'][i]);
    // The oak: one trunk out of the floor, parting into two great limbs that hold the roof up.
    trunk(ctx, [200, FLOOR + 30, 198, 150, 196, 116, 170, 70, 110, 20, 40, -10], 44, 16, OAK, 1);
    trunk(ctx, [200, FLOOR + 30, 202, 150, 204, 116, 230, 70, 290, 20, 360, -10], 44, 16, OAK, 2);
    // The cleft where it parts: dark, and in it the house's best bottles on a grown shelf.
    fillPoly(ctx, [184, 118, 200, 96, 216, 118, 208, 150, 192, 150], '#140e0a');
    for (let i = 0; i < 3; i++) bottle(ctx, 193 + i * 7, 146, 14, ['#5a7a4a', '#7a3a2a', '#3a4a7a'][i]);
    smudge(ctx, 200, 130, 22, '#ffb060', 0.25);
    // Shelves cut into the trunk, lanterns hung from the limbs, herbs from the lintels.
    shelf(ctx, 150, 168, 100, GOLDWOOD);
    for (let i = 0; i < 6; i++) bottle(ctx, 158 + i * 16, 168, 14 + rnd(163, i) * 7, ['#4a6a3a', '#8a5a2a', '#5a3a5a'][i % 3], { squat: i % 2 === 0 });
    lantern(ctx, s, 120, 58, 11, '#4a3a2a', 34, 150, '#ffe0a0');
    lantern(ctx, s, 280, 58, 11, '#4a3a2a', 34, 150, '#ffe0a0');
    for (let i = 0; i < 5; i++) herbs(ctx, 90 + i * 55, 10, 12, 0, ['#8a9a4a', '#a0708a', '#c8a050'][i % 3], i + 60);
    barrel(ctx, 104, FLOOR + 2, 34, 42, '#6a4a2e');
    barrel(ctx, 296, FLOOR + 2, 34, 42, '#6a4a2e');
    // The bar: a ring of split log round the oak's foot, cups and a jug on it.
    logCounter(ctx, 110, 290, 190, 12, 246, GOLDWOOD, OAK, 11);
    cup(ctx, 150, 200, 11, GOLDWOOD); cup(ctx, 166, 200, 11, '#6a5030'); cup(ctx, 240, 200, 11, GOLDWOOD);
    candle(ctx, s, 268, 200, 12, '#e8e0c0', 110);
    // Foreground: a table where someone has just gone, a cup still half full, and a coin that is not from Caldera.
    table(ctx, 330, 242, 96, '#6a5236');
    cup(ctx, 316, 244, 12, GOLDWOOD);
    strangeCoin(ctx, s, 342, 240);
    bottleCandle(ctx, s, 360, 238, 12);
    table(ctx, 52, 250, 84, '#6a5236');
    cup(ctx, 40, 252, 11, '#6a5030'); cup(ctx, 64, 256, 11, GOLDWOOD);
    stool(ctx, 150, 272, 26, '#6a5236');
  },
};

