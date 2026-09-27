// The Split Oak in Thornhold, built round a living oak whose trunk parts over the bar.
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, rnd, floorboards, plaster, windowIn, forestFill, smudge, fillPoly, trunk } from '../kit.ts';
import { K, logCounter, shelf, bottle, jar, cup, candle, lantern, barrel, herbs, stool } from '../props.ts';
import { glossEllipse } from '../../monsters/gloss.ts';
import { table, bottleCandle } from '../taverns.ts';

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
