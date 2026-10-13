// The Pilgrims' Store in the Bowl (#762), a trader's tent: undyed canvas pitched to the ground on a
// ridge, its far door tied back on the Bowl and the column of light standing in it. On the trestle,
// what a pilgrim carries to the isle: a lamp, bread and cheese, and the six cures in their flasks;
// the meal in its sacks, a bundle of torches and the lamp oil in stoppered jars.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { line, fillPoly, path, ink, contact, slab, smudge, pool, DAY_POOL } from '../kit.ts';
import { K, sack, jar, loaf, cheese, lantern } from '../props.ts';
import { flask } from '../shops.ts';
import { ground } from '../yards.ts';
import { glossPoly, glossCapsule } from '../../monsters/gloss.ts';
import { canvasFace, seam, bowlView } from './camp.ts';

const FLOOR = 186, VX = 200, VY = 120, CANVAS = '#c8b48c', WOOD = '#8a6a44', ROPE = '#b8a074', BRASS = '#a07a34', TAR = '#3a2c22', CLAY = '#7a6448';
/** The door at the far end, tied back between its two poles. */
const DOOR = [200, 40, 242, FLOOR, 158, FLOOR];
/** The cures, left to right: the heal, the antidote, the elixir, the quickening, the draught for the spells and the great one. */
const CURES = ['#c03028', '#4a9a44', '#e0b038', '#e8823a', '#3a64c8', '#5a3aa8'];

/** One slope of the roof, from the ridge down to the ground on side `sd` (-1 left, 1 right), its seams running to the far end. */
function slope(ctx: CanvasRenderingContext2D, sd: number, base: string, seed: number): void {
  const pts = [VX + sd * 200, 0, VX, 0, VX, 26, VX + sd * 104, FLOOR, VX + sd * 200, 247];
  canvasFace(ctx, pts, base, seed);
  ctx.save(); path(ctx, pts); ctx.clip();
  for (const u of [0.18, 0.36, 0.54, 0.72, 0.9]) {
    const px = VX + sd * 104 * u, py = 26 + 160 * u;
    seam(ctx, px, py, px + (px - VX) * 3, py + (py - VY) * 3, base);
  }
  ctx.restore();
}

/** A torch, its foot on the ground at (x0, y0) and its head at (x1, y1): a stick and a head of tarred rag. */
function torch(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  line(ctx, [x0, y0, x1, y1], '#120c14', 4); line(ctx, [x0, y0, x1, y1], WOOD, 2.5);
  glossCapsule(ctx, K, x1, y1, x1 + (x1 - x0) * 0.06, y1 + 9, 3.5, TAR, { gloss: 0.5 });
}

export const BOWL_STORE: Scene = {
  ambient: ['#262220', '#b8ac98'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const d = s.daylight;
    // The Bowl's grass trodden to earth inside, and the path worn from the door.
    ground(ctx, FLOOR, '#7a7650', 751, true);
    fillPoly(ctx, [184, FLOOR, 216, FLOOR, 262, 268, 138, 268], rgba('#6a5a40', 0.55));
    // The far end, its door tied back on the Bowl and the column of light.
    canvasFace(ctx, [VX, 26, 304, FLOOR, 96, FLOOR], shade(CANVAS, 1.04), 752);
    ctx.save(); path(ctx, DOOR); ctx.clip();
    bowlView(ctx, s, 156, 38, 88, FLOOR - 38, VY, 753, 205);
    ctx.restore();
    path(ctx, DOOR); ink(ctx, 1.5);
    for (const sd of [-1, 1]) {
      glossPoly(ctx, K, [VX, 40, VX + sd * 42, FLOOR, VX + sd * 56, FLOOR, VX + sd * 30, 122], shade(CANVAS, 0.96), { gloss: 0.15, spread: 0.8 });
      line(ctx, [VX + sd * 22, 116, VX + sd * 34, 126], ROPE, 2.5);
      line(ctx, [VX, 28, VX + sd * 44, FLOOR + 4], '#120c14', 6); line(ctx, [VX, 28, VX + sd * 44, FLOOR + 4], WOOD, 4);
    }
    // The two slopes, the ridge and its lashing; the canvas lets the day through.
    slope(ctx, -1, shade(CANVAS, 0.9), 754);
    slope(ctx, 1, CANVAS, 755);
    line(ctx, [VX, 0, VX, 28], '#120c14', 8); line(ctx, [VX, 0, VX, 28], WOOD, 5);
    for (let i = 0; i < 3; i++) line(ctx, [VX - 4, 18 + i * 3, VX + 4, 20 + i * 3], ROPE, 1.5);
    pool(s, VX, 40, 300, DAY_POOL, 0.45 * d);
    // The trestle: a board on two trestles, the lamp at its end, the bread and cheese and the cures.
    contact(ctx, 258, 254, 236, 0.4);
    for (const tx of [176, 340]) {
      for (const sd of [-1, 1]) { line(ctx, [tx + sd * 14, 254, tx + sd * 4, 214], '#120c14', 5); line(ctx, [tx + sd * 14, 254, tx + sd * 4, 214], shade(WOOD, 0.85), 3); }
      line(ctx, [tx - 10, 238, tx + 10, 238], shade(WOOD, 0.85), 3);
    }
    fillPoly(ctx, [152, 204, 364, 204, 368, 211, 148, 211], shade(WOOD, 1.15));
    path(ctx, [152, 204, 364, 204, 368, 211, 148, 211]); ink(ctx, 1);
    slab(ctx, 148, 211, 220, 6, WOOD, { lit: 1 });
    lantern(ctx, s, 162, 191, 9, BRASS, null, 190);
    loaf(ctx, 184, 209, 20); loaf(ctx, 204, 208, 16); cheese(ctx, 224, 209, 15);
    CURES.forEach((c, i) => flask(ctx, 246 + i * 16 + (i === 5 ? 3 : 0), 209, i === 5 ? 7.5 : 6, c));
    // The meal in its sacks and the torches bundled against the trestle's end.
    sack(ctx, 50, 246, 42, 48, '#b49c6c', { seed: 756 });
    sack(ctx, 86, 252, 34, 36, '#a89060', { open: '#e0d0a0', seed: 757 });
    for (let i = 0; i < 5; i++) torch(ctx, 110 + i * 5, 254, 112 + i * 6, 194 + (i % 2) * 4);
    line(ctx, [110, 228, 138, 230], ROPE, 2);
    // The oil in its jars, a dark stain on the ground where it has been poured.
    smudge(ctx, 374, 258, 18, '#1a120c', 0.35);
    jar(ctx, 384, 252, 18, 28, CLAY, '#2a2018');
    line(ctx, [388, 228, 389, 242], rgba('#1a120c', 0.8), 2);
    jar(ctx, 360, 258, 14, 22, shade(CLAY, 1.1), '#2a2018');
  },
};
