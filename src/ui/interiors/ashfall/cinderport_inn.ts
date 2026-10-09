// Cinderport's inn, where the Compact's crews and the Riders sleep between crossings: basalt to the
// sills and limewash over, the fire under a mantel of the potter's cups, the window on the Sound with
// the Compact's ship at the quay and the column of light beyond, the vines hung over the glass; the
// stair up to the rooms, a table by the fire, and the broom by the stair's foot with the ash it swept
// heaped there.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, beam, plaster, flagstones, windowIn, line, fillPoly, contact, slab, planks } from '../kit.ts';
import { K, hearth, lantern, jug } from '../props.ts';
import { table, bottleCandle } from '../taverns.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { WASH, TIMBER, IRON, ASH, basaltWall, ashDust, cinderCup, sound } from './basalt.ts';

const FLOOR = 196, DADO = 118;

/** The stair up to the rooms along the back wall, from the floor at (x0, y0) to the landing at (x1, y1) in n steps: its boarded side, the treads lit on their noses, the rail on its posts and the door at the top. */
function stair(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, n: number): void {
  const sw = (x1 - x0) / n, sh = (y0 - y1) / n, side: number[] = [x0, y0];
  for (let i = 0; i < n; i++) side.push(x0 + i * sw, y0 - (i + 1) * sh, x0 + (i + 1) * sw, y0 - (i + 1) * sh);
  side.push(STAGE_W, y1, STAGE_W, y0);
  // The landing's door on the wall above, planked, its latch and its frame.
  const dx = x1 + 3, dw = STAGE_W - x1 - 6, dt = y1 - 50;
  slab(ctx, dx - 3, dt - 3, dw + 6, y1 - dt + 3, shade(TIMBER, 0.8), { lit: 1 });
  planks(ctx, dx, dt, dw, y1 - dt, shade(TIMBER, 1.1), 3, true, 551);
  line(ctx, [dx + 4, dt + 24, dx + 10, dt + 24], IRON, 2);
  fillPoly(ctx, side, shade(TIMBER, 0.62));
  ctx.save(); ctx.beginPath(); for (let i = 0; i < side.length; i += 2) ctx.lineTo(side[i], side[i + 1]); ctx.closePath(); ctx.clip();
  for (let i = 0; i < 9; i++) line(ctx, [x0 + i * 16, y0, x0 + i * 16, y1], rgba('#120c14', 0.45), 1);
  ctx.restore();
  for (let i = 0; i < n; i++) { const tx = x0 + i * sw, ty = y0 - (i + 1) * sh; line(ctx, [tx - 1, ty, tx + sw + 1, ty], shade(TIMBER, 1.5), 2); line(ctx, [tx, ty, tx, ty + sh], '#120c14', 1); }
  slab(ctx, x1 - 2, y1 - 2, STAGE_W - x1 + 4, 5, shade(TIMBER, 1.1), { lit: 1 });
  // The rail: a post at each end, a baluster to each tread, the rail along their tops.
  const rh = 30, top = (i: number): [number, number] => [x0 + (i + 0.5) * sw, y0 - (i + 1) * sh - rh];
  for (let i = 0; i < n; i++) { const [bx, by] = top(i); line(ctx, [bx, by, bx, by + rh], '#120c14', 3); line(ctx, [bx, by, bx, by + rh], shade(TIMBER, 1.2), 1.5); }
  const [ax, ay] = top(0), [bx, by] = top(n - 1);
  line(ctx, [ax - 4, ay + 4, bx + 4, by - 4], '#120c14', 5); line(ctx, [ax - 4, ay + 4, bx + 4, by - 4], shade(TIMBER, 1.3), 3);
  slab(ctx, ax - 4, ay - 2, 7, rh + 2 + sh, shade(TIMBER, 0.95), { lit: 1 });
}

/** A broom of twigs bound to its handle, leant on the wall with its head on the floor at (x, y), its top at (tx, ty). */
function broom(ctx: CanvasRenderingContext2D, x: number, y: number, tx: number, ty: number): void {
  line(ctx, [x, y - 10, tx, ty], '#120c14', 4); line(ctx, [x, y - 10, tx, ty], '#8a6a44', 2);
  for (let i = 0; i < 9; i++) { const u = (i - 4) / 4; line(ctx, [x + u * 1.5, y - 14, x + u * 7, y], i % 2 ? '#6a5434' : '#8a7448', 1); }
  line(ctx, [x - 3, y - 12, x + 3, y - 12], '#3a2a20', 2);
}

export const CINDERPORT_INN: Scene = {
  ambient: ['#26242e', '#8e8a88'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    plaster(ctx, 0, 0, STAGE_W, DADO, WASH, 541);
    basaltWall(ctx, 0, DADO, STAGE_W, FLOOR - DADO, 4, 542);
    slab(ctx, 0, DADO - 3, STAGE_W, 5, shade(WASH, 0.7), { lit: 1, dark: 0.25 });
    ashDust(ctx, 0, FLOOR - 26, STAGE_W, 26, 543, 0.3);
    flagstones(ctx, FLOOR, 200, 110, '#58565c', 7, 544);
    beam(ctx, 0, 0, STAGE_W, 14, TIMBER, 545);
    // The window on the Sound: the Compact's ship at the quay, the column of light beyond, vines over the glass.
    const wx = 150, wy = 34, ww = 80, wh = 62;
    windowIn(ctx, s, wx, wy, ww, wh, shade(TIMBER, 0.9), { panes: [2, 2], view: sound(wx, wy, ww, wh, s, { ship: true, vines: true, light: 0.74, seed: 546 }) });
    // The fire, and the potter's cups along its mantel.
    const fb = hearth(ctx, s, 8, 44, 118, FLOOR, '#5e5c62', 547, { mantel: TIMBER });
    for (let i = 0; i < 6; i++) cinderCup(ctx, 10 + i * 20, fb.y - fb.w * 0.36, 13, { glaze: i % 3 === 1 });
    // The stair up to the rooms.
    stair(ctx, 262, FLOOR, 372, 66, 9);
    // The broom at the stair's foot, and what it swept.
    broom(ctx, 246, FLOOR + 4, 236, FLOOR - 74);
    contact(ctx, 226, FLOOR + 6, 24, 0.3);
    glossEllipse(ctx, K, 226, FLOOR + 4, 11, 4, ASH, 0, { tex: 'stipple', seed: 548, amount: 0.6 });
    // The table by the fire: a jug, the cups, a candle in a bottle.
    table(ctx, 176, 226, 104, '#6a4e36');
    jug(ctx, 156, 228, 20, '#8a5a3a', '#c8b080');
    cinderCup(ctx, 184, 232, 12); cinderCup(ctx, 206, 226, 12, { glaze: true });
    bottleCandle(ctx, s, 194, 222, 14);
    glossPoly(ctx, K, [134, 236, 150, 233, 152, 238, 136, 241], '#d8c8a0', {});
    // The lamp from the beam over the stair's foot.
    lantern(ctx, s, 290, 60, 9, IRON, 14, s.daylight > 0.5 ? 110 : 190);
  },
};
