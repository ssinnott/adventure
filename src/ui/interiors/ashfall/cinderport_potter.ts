// Cinderport's potter's: cups in the old Cinder style on the shelves, beakers flared on a short foot
// as Old Cinder's dead still hold them, some under the ash glaze and some in the bare clay with its
// band of slip; a board of new ones drying on trestles, a candle at its end; the kiln built into the back wall, a beehive
// of brick, its fire in the mouth; the kick wheel with a cup thrown on it, and a tub of the red clay
// out of the pit in the vines.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, beam, flagstones, line, contact, slab, stones, path, smudge, pool } from '../kit.ts';
import { K, shelf, barrel, jar, candle } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { TIMBER, IRON, CLAY, basaltWall, ashDust, cinderCup } from './basalt.ts';

const FLOOR = 196, BRICK = '#7a4a34', WET = '#8a5a42';

/** The kiln, a beehive of fire-brick against the back wall, the floor at y, from x across w: the dome, the chimney up out of it, the arched mouth and the fire in it. */
function kiln(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  const cx = x + w / 2, body = y - 58, r = w / 2;
  slab(ctx, cx - 12, 13, 24, body - r * 0.8 - 13, shade(BRICK, 0.8), { lit: 1, dark: 0.3 });
  const dome: number[] = [x, y];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + (i / 16) * Math.PI; dome.push(cx + Math.cos(a) * r, body + Math.sin(a) * r * 0.9); }
  dome.push(x + w, y);
  ctx.save(); path(ctx, dome); ctx.clip();
  stones(ctx, x, body - r, w, y - body + r, BRICK, 9, 631, { long: 0.9, mortar: '#5a4038' });
  ctx.restore();
  line(ctx, [...dome, x, y], '#120c14', 1.5);
  // The mouth: an arch of brick on edge, black inside but for the fire.
  const mw = w * 0.3, mt = y - 40;
  const mouth = [cx - mw / 2, y, cx - mw / 2, mt + mw / 2];
  for (let i = 0; i <= 8; i++) { const a = Math.PI + (i / 8) * Math.PI; mouth.push(cx + Math.cos(a) * mw / 2, mt + mw / 2 + Math.sin(a) * mw / 2); }
  mouth.push(cx + mw / 2, y);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 6; path(ctx, mouth); ctx.stroke();
  ctx.strokeStyle = shade(BRICK, 1.2); ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#140a08'; ctx.fill();
  glossEllipse(ctx, K, cx, y - 4, mw * 0.4, 3, '#5a2010', 0, { tex: 'stipple', seed: 632, amount: 0.6 });
  s.lights.push({ k: 'fire', x: cx, y: y - 4, w: mw * 0.7, h: 20 });
  pool(s, cx, y - 20, 250, '#ff9048', 0.85);
  smudge(ctx, cx, mt - 6, 16, '#1a1010', 0.35);
}

/** The kick wheel, the floor at y: the flywheel at the foot, the shaft, the head at waist height and a cup thrown on it, wet. */
function wheel(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  contact(ctx, x, y, 90, 0.5);
  glossEllipse(ctx, K, x, y - 8, 40, 9, shade(TIMBER, 0.9), 0, { gloss: 0.2 });
  glossEllipse(ctx, K, x, y - 11, 36, 7, TIMBER, 0, { gloss: 0.3 });
  line(ctx, [x, y - 14, x, y - 44], '#120c14', 5); line(ctx, [x, y - 14, x, y - 44], IRON, 3);
  slab(ctx, x + 30, y - 46, 46, 6, shade(TIMBER, 1.05), { lit: 1 });
  for (const lx of [x + 34, x + 70]) slab(ctx, lx, y - 40, 4, 34, shade(TIMBER, 0.75));
  glossEllipse(ctx, K, x, y - 46, 20, 5, shade(TIMBER, 1.1), 0, { gloss: 0.3 });
  glossEllipse(ctx, K, x, y - 47, 9, 2.5, WET, 0, { gloss: 0.8 });
  glossPoly(ctx, K, [x - 7, y - 47, x - 5, y - 52, x - 7, y - 64, x + 7, y - 64, x + 5, y - 52, x + 7, y - 47], WET, { gloss: 0.8, spread: 0.6 });
  glossEllipse(ctx, K, x, y - 64, 7, 1.8, WET, 0, { gloss: 0.6 });
  for (let i = 0; i < 3; i++) line(ctx, [x - 6, y - 51 - i * 4, x + 6, y - 51 - i * 4], rgba('#3a2018', 0.4), 1);
  glossEllipse(ctx, K, x + 54, y - 49, 9, 3, '#5a5a62', 0, { gloss: 0.5 });
}

export const CINDERPORT_POTTER: Scene = {
  ambient: ['#262228', '#8a8480'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    basaltWall(ctx, 0, 12, STAGE_W, FLOOR - 12, 9, 633);
    ashDust(ctx, 0, FLOOR - 22, STAGE_W, 22, 634, 0.3);
    flagstones(ctx, FLOOR, 200, 100, '#5a5658', 6, 635);
    for (let i = 0; i < 9; i++) smudge(ctx, 60 + i * 34 + (i % 3) * 7, FLOOR + 14 + (i % 4) * 12, 6 + (i % 3) * 3, CLAY, 0.35);
    beam(ctx, 0, 0, STAGE_W, 13, shade(TIMBER, 0.85), 636);
    // The kiln in the back wall.
    kiln(ctx, s, 16, FLOOR, 128);
    // The shelves of finished cups, glazed and bare.
    shelf(ctx, 236, 84, 156, TIMBER);
    shelf(ctx, 236, 126, 156, TIMBER);
    for (let i = 0; i < 8; i++) cinderCup(ctx, 248 + i * 19, 84, 15, { glaze: i % 2 === 0 });
    for (let i = 0; i < 8; i++) cinderCup(ctx, 248 + i * 19, 126, 15, { glaze: i % 3 === 0 });
    // The board of new cups drying on its trestles.
    for (const tx of [170, 270]) { line(ctx, [tx - 8, FLOOR + 8, tx, 166, tx + 8, FLOOR + 8], '#120c14', 5); line(ctx, [tx - 8, FLOOR + 8, tx, 166, tx + 8, FLOOR + 8], TIMBER, 3); }
    slab(ctx, 154, 162, 132, 6, shade(TIMBER, 1.1), { lit: 1, dark: 0.3 });
    for (let i = 0; i < 7; i++) cinderCup(ctx, 166 + i * 18, 162, 13, { raw: true });
    candle(ctx, s, 284, 162, 8, '#efe4c8', s.daylight > 0.5 ? 70 : 150);
    // The wheel, the tub of clay from the pit, the crock of glaze and its ladle.
    wheel(ctx, 96, 256);
    barrel(ctx, 330, 262, 60, 34, '#6a4a30', IRON, 637);
    glossEllipse(ctx, K, 330, 230, 26, 6, '#8a4a36', 0, { tex: 'stipple', seed: 638, amount: 0.5 });
    jar(ctx, 270, 254, 26, 30, '#6a5a4a');
    line(ctx, [276, 226, 288, 206], '#120c14', 3.5); line(ctx, [276, 226, 288, 206], TIMBER, 2);
  },
};
