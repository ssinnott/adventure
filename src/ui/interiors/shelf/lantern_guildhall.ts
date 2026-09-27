// The Lantern Guildhall in Harrow: a scholars' room of books, instruments and the great map of
// Caldera.
import { shade } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, plaster, beam, planks, flagstones, line } from '../kit.ts';
import { K, books, candle, lantern, lanternRing, painting, counter, cloth } from '../props.ts';
import { glossEllipse } from '../../monsters/gloss.ts';
import { GOLD, SPINES, bookcase, calderaMap, armillary, wandRack, lectern } from '../guilds.ts';

const WALNUT = '#5a3a26', INDIGO = '#3a4070';

export const GUILDHALL: Scene = {
  ambient: ['#2e2c44', '#8a8898'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 210;
    plaster(ctx, 0, 0, STAGE_W, FLOOR, INDIGO, 101);
    // A painted frieze of the order's rings along the top of the wall.
    ctx.fillStyle = shade(INDIGO, 0.75); ctx.fillRect(0, 22, STAGE_W, 14);
    for (let i = 0; i < 13; i++) lanternRing(ctx, 16 + i * 31, 29, 4, GOLD);
    beam(ctx, 0, 36, STAGE_W, 4, WALNUT, 102);
    planks(ctx, 0, 0, STAGE_W, 22, shade(WALNUT, 0.8), 1, false, 103);
    // Oak panelling to the dado, the floor in checked stone.
    planks(ctx, 0, 150, STAGE_W, FLOOR - 150, WALNUT, 14, true, 104);
    beam(ctx, 0, 146, STAGE_W, 6, WALNUT, 105);
    flagstones(ctx, FLOOR, 200, 104, '#8a8278', 6, 106);
    // Bookcases up both walls.
    bookcase(ctx, 6, 40, 92, FLOOR, WALNUT, 1, 5);
    bookcase(ctx, 302, 40, 92, FLOOR, WALNUT, 2, 5);
    // A library ladder against the left one.
    line(ctx, [72, FLOOR, 90, 48], '#120c14', 5); line(ctx, [96, FLOOR, 112, 48], '#120c14', 5);
    line(ctx, [72, FLOOR, 90, 48], '#8a6a42', 3); line(ctx, [96, FLOOR, 112, 48], '#8a6a42', 3);
    for (let i = 1; i < 8; i++) { const t = i / 8; line(ctx, [72 + 18 * t, FLOOR - (FLOOR - 48) * t, 96 + 16 * t, FLOOR - (FLOOR - 48) * t], '#8a6a42', 2); }
    // The great map of Caldera between them, over the table.
    painting(ctx, 128, 50, 144, 86, calderaMap(128, 50, 144, 86), '#b8902e');
    // The model of the Hearth on its stand, and the survey wands in theirs.
    armillary(ctx, s, 122, FLOOR, 22);
    wandRack(ctx, s, 286, FLOOR, 4);
    lantern(ctx, s, 200, 18, 11, GOLD, 0, 170);
    // Wisps: loose light drifting under the ceiling.
    s.lights.push({ k: 'motes', x: 110, y: 40, w: 180, h: 110, color: '#c8e8ff', n: 18, rise: 0.12 });
    // The reading table across the front: open books, scrolls, the inkpot.
    counter(ctx, 104, 296, 196, 10, STAGE_H, WALNUT, 107, { panels: 3, trim: GOLD });
    cloth(ctx, 150, 250, 200, 16, '#6a2a3a', 5);
    lectern(ctx, s, 200, 206, 22, WALNUT);
    for (const [sx, sw] of [[128, 20], [262, 16]] as [number, number][]) { glossEllipse(ctx, K, sx, 202, sw / 2, 3, '#e8dcc0', 0, {}); ctx.fillStyle = '#c8b890'; ctx.fillRect(sx - sw / 2, 199, 2, 6); ctx.fillRect(sx + sw / 2 - 2, 199, 2, 6); }
    books(ctx, 232, 205, 20, 9, 11, SPINES);
    candle(ctx, s, 150, 206, 13, '#f0e8d0', 110);
    candle(ctx, s, 276, 206, 11, '#f0e8d0', 90);
  },
};
