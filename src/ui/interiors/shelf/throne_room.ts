// The throne room behind the keep's great door, where the Regent-Warden holds court: grey stone,
// the empty throne on its dais under black cloth, the Wardens' banners either side of it and a
// tall window south over the sea to the Hearth.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, flagstones, windowIn, line, fillPoly, path, ink, smudge, contact, slab, flame, pool } from '../kit.ts';
import { K, pillar, banner } from '../props.ts';
import { glossPoly, glossBall } from '../../monsters/gloss.ts';
import { towerDevice } from './warden_drillyard.ts';

const OAK = '#4a2e1c', STONE = '#8e929a', FLAG = '#5a5c64', BLUE = '#1f3a7a', GOLD = '#d4a83a', GREY = '#6a6e76', BLACK = '#1a181e';

/** The sea at the window, and the Hearth on it: a column of light on the horizon, brighter as the day goes. */
function hearthView(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    const sky = ctx.createLinearGradient(0, y, 0, y + h * 0.62);
    sky.addColorStop(0, mix('#0a0c22', '#5a8ad0', daylight)); sky.addColorStop(1, mix('#2a2440', '#e8c8a0', daylight));
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h * 0.62);
    if (daylight < 0.4) for (let i = 0; i < 14; i++) { ctx.fillStyle = rgba('#ffffff', 0.6 * (1 - daylight / 0.4)); ctx.fillRect(Math.round(x + rnd(171, i) * w), Math.round(y + rnd(172, i) * h * 0.5), 1, 1); }
    const sea = ctx.createLinearGradient(0, y + h * 0.62, 0, y + h);
    sea.addColorStop(0, mix('#1a2a4a', '#4a6a9a', daylight)); sea.addColorStop(1, mix('#0a1020', '#2a3a5a', daylight));
    ctx.fillStyle = sea; ctx.fillRect(x, y + h * 0.62, w, h * 0.38);
    const cx = x + w * 0.55, glow = 0.5 + (1 - daylight) * 0.35;
    smudge(ctx, cx, y + h * 0.62, h * 0.45, '#ffe0a0', glow);
    ctx.fillStyle = '#fff0c8'; ctx.fillRect(Math.round(cx) - 1, y, 2, Math.round(h * 0.62));
    for (let i = 0; i < 5; i++) { const ww = 3 + i * 3; ctx.fillStyle = rgba('#ffe0a0', 0.55 - i * 0.09); ctx.fillRect(Math.round(cx - ww / 2), Math.round(y + h * 0.64 + i * 4), Math.round(ww), 1); }
  };
}

/**
 * The Queen's throne, empty, foot on y: a tall carved back in dark oak and gilt with her blue in its
 * panel, arms, a blue cushion on the seat, turned legs on the dais. A black cloth thrown over one
 * corner of the back falls down its side and across the arm: mourning, not a shroud.
 */
function throne(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.5, seat = y - h * 0.4, arm = y - h * 0.56, top = y - h;
  contact(ctx, x, y, w * 1.5, 0.5);
  // The back: two posts with gilt finials, the panel between them and its carved, peaked crest.
  const back = [x - w * 0.36, seat, x - w * 0.36, top + h * 0.16, x - w * 0.18, top + h * 0.08, x, top, x + w * 0.18, top + h * 0.08, x + w * 0.36, top + h * 0.16, x + w * 0.36, seat];
  glossPoly(ctx, K, back, OAK, { gloss: 0.3, spread: 0.7 });
  const panel = [x - w * 0.24, seat - h * 0.04, x - w * 0.24, top + h * 0.2, x, top + h * 0.12, x + w * 0.24, top + h * 0.2, x + w * 0.24, seat - h * 0.04];
  glossPoly(ctx, K, panel, BLUE, { gloss: 0.2, spread: 0.8 });
  line(ctx, panel.concat(panel.slice(0, 2)), GOLD, 1.5);
  ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, top + h * 0.36, w * 0.1, 0, Math.PI * 2); ctx.stroke();
  for (const s of [-1, 1]) {
    glossPoly(ctx, K, [x + s * w * 0.44, seat, x + s * w * 0.44, top + h * 0.14, x + s * w * 0.34, top + h * 0.14, x + s * w * 0.34, seat], shade(OAK, 0.85), { gloss: 0.3 });
    glossBall(ctx, K, x + s * w * 0.39, top + h * 0.1, w * 0.08, GOLD, { gloss: 0.8 });
  }
  glossBall(ctx, K, x, top - h * 0.02, w * 0.07, GOLD, { gloss: 0.8 });
  // The seat, its blue cushion, and the rail under it.
  glossPoly(ctx, K, [x - w * 0.62, seat, x - w * 0.5, seat - h * 0.05, x + w * 0.5, seat - h * 0.05, x + w * 0.62, seat, x + w * 0.62, seat + h * 0.07, x - w * 0.62, seat + h * 0.07], OAK, { gloss: 0.3 });
  glossPoly(ctx, K, [x - w * 0.5, seat - h * 0.04, x - w * 0.42, seat - h * 0.1, x + w * 0.42, seat - h * 0.1, x + w * 0.5, seat - h * 0.04], BLUE, { gloss: 0.4, spread: 0.7 });
  line(ctx, [x - w * 0.6, seat + h * 0.07, x + w * 0.6, seat + h * 0.07], GOLD, 1.5);
  // Turned legs on the dais, gilt at the foot.
  for (const s of [-1, 1]) {
    glossPoly(ctx, K, [x + s * w * 0.6, seat + h * 0.07, x + s * w * 0.6, y - 3, x + s * w * 0.48, y - 3, x + s * w * 0.48, seat + h * 0.07], shade(OAK, 0.8), { gloss: 0.3 });
    glossBall(ctx, K, x + s * w * 0.54, seat + h * 0.2, w * 0.07, shade(OAK, 0.9), { gloss: 0.4 });
    glossBall(ctx, K, x + s * w * 0.54, y - 3, w * 0.08, GOLD, { gloss: 0.7 });
  }
  // The arms: a rail from each post out over the seat, on a turned upright, a gilt scroll at the end.
  for (const s of [-1, 1]) {
    glossPoly(ctx, K, [x + s * w * 0.62, seat - h * 0.04, x + s * w * 0.62, arm, x + s * w * 0.54, arm, x + s * w * 0.54, seat - h * 0.04], shade(OAK, 0.9), { gloss: 0.3 });
    glossPoly(ctx, K, [x + s * w * 0.4, arm - h * 0.03, x + s * w * 0.66, arm - h * 0.03, x + s * w * 0.66, arm + h * 0.02, x + s * w * 0.4, arm + h * 0.02], OAK, { gloss: 0.4 });
    glossBall(ctx, K, x + s * w * 0.68, arm - h * 0.005, w * 0.07, GOLD, { gloss: 0.8 });
  }
  // The black cloth, thrown over the left post, falling in folds past the arm to a ragged hem.
  const cloth = [x - w * 0.08, top + h * 0.12, x - w * 0.28, top + h * 0.02, x - w * 0.5, top + h * 0.08, x - w * 0.64, top + h * 0.36,
    x - w * 0.76, seat, x - w * 0.84, seat + h * 0.2, x - w * 0.7, seat + h * 0.16, x - w * 0.6, seat + h * 0.22, x - w * 0.48, seat + h * 0.14,
    x - w * 0.36, seat + h * 0.18, x - w * 0.3, seat - h * 0.08, x - w * 0.22, top + h * 0.42, x - w * 0.1, top + h * 0.26];
  glossPoly(ctx, K, cloth, BLACK, { gloss: 0.35, spread: 0.8 });
  for (const [a, b, c, d] of [[-0.42, 0.1, -0.56, 0.9], [-0.3, 0.12, -0.44, 0.7], [-0.2, 0.3, -0.34, 1.0], [-0.64, 0.5, -0.74, 1.1]]) {
    line(ctx, [x + w * a, top + h * b, x + w * c, top + h * d], rgba('#5a5668', 0.8), 1.2);
  }
}

/** A tall iron candle stand, foot on y; its candles burn day and night. */
function candleStand(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  contact(ctx, x, y, 22);
  line(ctx, [x - 9, y, x, y - 8, x + 9, y], '#120c14', 4); line(ctx, [x - 9, y, x, y - 8, x + 9, y], '#3a3440', 2);
  line(ctx, [x, y - 6, x, y - h], '#120c14', 4); line(ctx, [x, y - 6, x, y - h], '#4a4450', 2);
  line(ctx, [x - 10, y - h, x + 10, y - h], '#120c14', 4); line(ctx, [x - 10, y - h, x + 10, y - h], '#4a4450', 2);
  for (const dx of [-9, 0, 9]) {
    glossPoly(ctx, K, [dx + x - 2, y - h - 1, dx + x - 2, y - h - 10, dx + x + 2, y - h - 10, dx + x + 2, y - h - 1], '#efe4c8', { gloss: 0.3 });
    flame(s, x + dx, y - h - 11, 2.5, 110, 0.7);
  }
}

export const THRONE_ROOM: Scene = {
  ambient: ['#34323e', '#9a9aa0'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 204;
    stones(ctx, 0, 0, STAGE_W, FLOOR, STONE, 12, 171, { long: 2 });
    flagstones(ctx, FLOOR, 200, 110, FLAG, 6, 172);
    // The window south, over the sea to the Hearth.
    windowIn(ctx, s, 306, 34, 48, 110, shade(STONE, 0.7), { arched: true, panes: [2, 4], view: hearthView(306, 34, 48, 110, s.daylight) });
    // By night the Hearth's light still comes in, faint and gold.
    if (s.daylight < 0.5) pool(s, 330, 110, 120, '#ffe0a0', 0.35 * (1 - s.daylight * 2));
    // Pillars down either side.
    pillar(ctx, 22, 0, FLOOR + 6, 30, shade(STONE, 1.05));
    pillar(ctx, 270, 0, FLOOR + 6, 26, shade(STONE, 1.05));
    pillar(ctx, 384, 0, FLOOR + 6, 30, shade(STONE, 1.05));
    // The Wardens' banners either side of the dais: grey, the black tower, a red stripe.
    for (const bx of [70, 208]) {
      banner(ctx, bx, 36, 36, 104, GREY, { tail: 'swallow', emblem: (cx, cy, r) => towerDevice(ctx, cx, cy + r * 0.4, r * 1.1) });
      ctx.fillStyle = '#8a3a2a'; ctx.fillRect(bx + 2, 44, 32, 3);
    }
    // The dais, two steps of the same stone, and the Queen's blue carpet down it.
    slab(ctx, 96, 176, 150, 12, shade(STONE, 0.95), { lit: 2, dark: 0.35 });
    slab(ctx, 84, 188, 174, 16, shade(STONE, 0.88), { lit: 2, dark: 0.35 });
    const carpet = [150, 176, 192, 176, 222, STAGE_H, 120, STAGE_H];
    fillPoly(ctx, carpet, BLUE);
    line(ctx, [153, 176, 126, STAGE_H], GOLD, 2); line(ctx, [189, 176, 216, STAGE_H], GOLD, 2);
    path(ctx, carpet); ink(ctx);
    throne(ctx, 171, 176, 96);
    // Candles either side of the throne, lit for the dead: by night, most of the room's light.
    candleStand(ctx, s, 110, 176, 58);
    candleStand(ctx, s, 232, 176, 58);
    smudge(ctx, 171, 150, 90, '#ffb060', 0.12);
  },
};
