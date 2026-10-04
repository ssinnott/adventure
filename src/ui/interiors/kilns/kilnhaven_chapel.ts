// Kilnhaven's chapel, the Lanterns', where the port's sailors come: walls limewashed with the
// kilns' own lime, a roof of tarred timber with a ship hung from its tie beam as the coast hangs
// them, the altar under a window of clear glass on the open sea with the Hearth standing on it,
// the boards of the drowned on the walls, pews, a stand of votive candles and the bell's rope.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, planks, flagstones, windowIn, line, fillPoly, path, slab, pool, contact } from '../kit.ts';
import { K, altar, pew, candle, lantern, lanternRing } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { TAR, IRON, HEMP, SEA_POOL, oreDust, harbour } from './port.ts';

const FLOOR = 210, LIME = '#e0dbd0', GOLD = '#c8a048', SEA_CLOTH = '#3a5262';
/** The gable: where the roof meets the side walls, and its ridge. */
const EAVE = 62, RIDGE = 4;

/** The back wall's top at x, under the roof's pitch. */
const pitch = (x: number): number => EAVE - (EAVE - RIDGE) * (1 - Math.abs(x - 200) / 200);

/** The roof over the gable: tarred boards under the rafters, the tie beam across and the king post up from it. */
function roof(ctx: CanvasRenderingContext2D): void {
  ctx.save(); path(ctx, [0, -2, 0, EAVE, 200, RIDGE, STAGE_W, EAVE, STAGE_W, -2]); ctx.clip();
  planks(ctx, 0, 0, STAGE_W, EAVE, shade(TAR, 1.2), 12, false, 891);
  ctx.fillStyle = rgba('#0a0608', 0.45); ctx.fillRect(0, 0, STAGE_W, EAVE);
  ctx.restore();
  for (const sd of [-1, 1]) { const pts = [200, RIDGE - 2, 200 + sd * 210, EAVE + 4]; line(ctx, pts, '#120c14', 9); line(ctx, pts, shade(TAR, 1.5), 6); }
  beam(ctx, -4, 40, STAGE_W + 8, 11, shade(TAR, 1.4), 892);
  beam(ctx, 195, RIDGE + 4, 10, 36, shade(TAR, 1.4), 893);
  for (const sd of [-1, 1]) { const pts = [200, 32, 200 + sd * 60, 42]; line(ctx, pts, '#120c14', 6); line(ctx, pts, shade(TAR, 1.4), 4); }
}

/**
 * The votive ship, a model of a three-master hung from the tie beam on two cords: black hull with
 * a white strake, gilt at the stern, her square sails set and bellied, a pennant at the main. Her
 * keel's middle at (x, y), `w` long from stern to stem; the cords from `top`.
 */
function votiveShip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, top: number): void {
  const masts: [number, number][] = [[-0.26, 0.66], [0.02, 0.84], [0.28, 0.64]];
  for (const [mx, mh] of [masts[0], masts[2]]) line(ctx, [x + w * mx, top, x + w * mx, y - w * 0.12 - w * mh], rgba('#2a2420', 0.8), 1);
  const hull = [x - w * 0.5, y - w * 0.2, x - w * 0.44, y - w * 0.02, x - w * 0.2, y + w * 0.04, x + w * 0.3, y + w * 0.02, x + w * 0.5, y - w * 0.18, x + w * 0.34, y - w * 0.12, x - w * 0.42, y - w * 0.12];
  // The stays and the bowsprit behind the sails.
  line(ctx, [x + w * 0.44, y - w * 0.16, x + w * 0.74, y - w * 0.3], '#2a2420', 1.5);
  line(ctx, [x + w * 0.74, y - w * 0.3, x + w * 0.28, y - w * 0.76, x + w * 0.02, y - w * 0.96, x - w * 0.26, y - w * 0.78, x - w * 0.5, y - w * 0.3], rgba('#2a2420', 0.55), 1);
  for (const [mx, mh] of masts) {
    const px = x + w * mx, mtop = y - w * 0.12 - w * mh;
    line(ctx, [px, y - w * 0.12, px, mtop], '#2a2420', 1.5);
    // Three square sails down the mast, each narrower toward the top and bellied forward.
    for (let k = 0; k < 3; k++) {
      const f0 = 0.08 + k * 0.3, f1 = f0 + 0.26, y0 = mtop + w * mh * f0, y1 = mtop + w * mh * f1, h0 = w * (0.07 + k * 0.025), h1 = w * (0.08 + k * 0.025);
      const sail = [px - h0, y0, px + h0, y0, px + h1 + w * 0.02, y1, px - h1 + w * 0.02, y1];
      glossPoly(ctx, K, sail, '#ece4d0', { gloss: 0.15, spread: 0.8 });
      line(ctx, [px - h0 - 1, y0, px + h0 + 1, y0], '#2a2420', 1.2);
    }
  }
  glossPoly(ctx, K, hull, '#1e1c20', { gloss: 0.4, spread: 0.7 });
  line(ctx, [x - w * 0.44, y - w * 0.09, x + w * 0.36, y - w * 0.09], '#e8e0d0', 1.5);
  line(ctx, [x - w * 0.42, y - w * 0.05, x + w * 0.32, y - w * 0.05], '#a83a2a', 1);
  glossPoly(ctx, K, [x - w * 0.5, y - w * 0.2, x - w * 0.5, y - w * 0.3, x - w * 0.38, y - w * 0.28, x - w * 0.38, y - w * 0.14], GOLD, { gloss: 0.6 });
  const main = x + w * 0.02, mtop = y - w * 0.96;
  fillPoly(ctx, [main, mtop, main + w * 0.16, mtop + 2, main, mtop + 4], '#a83a2a');
}

/** A board for the drowned: black, gilt round its edge, their names lettered too small to read from the door. */
function memorial(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number): void {
  ctx.fillStyle = rgba('#0a0608', 0.25); ctx.fillRect(x + 3, y + 3, w, h);
  slab(ctx, x, y, w, h, '#1e1c22', { lit: 1, dark: 0.1 });
  ctx.strokeStyle = GOLD; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x) + 2.5, Math.round(y) + 2.5, Math.round(w) - 5, Math.round(h) - 5);
  fillPoly(ctx, [x + w / 2 - 6, y + 7, x + w / 2 + 6, y + 7, x + w / 2, y + 11], GOLD);
  for (let i = 0; i < Math.floor((h - 18) / 5); i++) { const lw = (w - 14) * (0.5 + rnd(seed, i) * 0.5); line(ctx, [x + w / 2 - lw / 2, y + 15 + i * 5, x + w / 2 + lw / 2, y + 15 + i * 5], rgba(GOLD, 0.75), 1); }
}

/** An iron stand of votive candles, foot on y: a tray on a stem, its candles of all heights, some burned down. */
function votiveStand(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  contact(ctx, x, y, 34, 0.45);
  line(ctx, [x - 10, y, x, y - 6, x + 10, y], '#120c14', 4); line(ctx, [x - 10, y, x, y - 6, x + 10, y], IRON, 2.2);
  line(ctx, [x, y - 4, x, y - h], '#120c14', 4); line(ctx, [x, y - 4, x, y - h], shade(IRON, 1.2), 2.2);
  slab(ctx, x - 22, y - h - 3, 44, 4, shade(IRON, 1.2), { lit: 1 });
  for (let i = 0; i < 6; i++) {
    const cx = x - 18 + i * 7.2, ch = 4 + rnd(894, i) * 9;
    glossPoly(ctx, K, [cx - 1.6, y - h - 3, cx - 1.6, y - h - 3 - ch, cx + 1.6, y - h - 3 - ch, cx + 1.6, y - h - 3], '#efe4c8', {});
    if (i !== 2) { s.lights.push({ k: 'flame', x: cx, y: y - h - 4 - ch, s: 1.6 }); pool(s, cx, y - h - 6 - ch, 34, '#ffb060', 0.3); }
  }
}

export const CHAPEL: Scene = {
  ambient: ['#2a2a34', '#9a9c9e'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    plaster(ctx, 0, 0, STAGE_W, FLOOR, LIME, 895);
    flagstones(ctx, FLOOR, 200, 112, '#7a7672', 6, 896);
    oreDust(ctx, 0, STAGE_H - 30, STAGE_W, 30, 897, 0.25);
    roof(ctx);
    // The window behind the altar: clear glass in small panes on the open sea, the Hearth on its rim.
    windowIn(ctx, s, 172, 70, 56, 92, shade(LIME, 0.82), { arched: true, panes: [3, 4], view: harbour(172, 70, 56, 92, s.daylight, 9, { quay: false, ship: false }) });
    if (s.daylight > 0.15) pool(s, 200, 130, 200, SEA_POOL, 0.8 * s.daylight);
    if (s.daylight < 0.5) pool(s, 200, 110, 90, '#ffe0a0', 0.3 * (1 - s.daylight * 2));
    // The boards of the drowned either side, and the bell's rope down the left wall.
    memorial(ctx, 270, 80, 46, 66, 899); memorial(ctx, 330, 92, 40, 54, 901);
    line(ctx, [24, 51, 24, 176], '#120c14', 3); line(ctx, [24, 51, 24, 176], HEMP, 1.6);
    glossEllipse(ctx, K, 24, 182, 3, 7, '#a83a2a', 0, { gloss: 0.2 });
    for (const lx of [152, 248]) lantern(ctx, s, lx, 64, 9, IRON, 51, 140);
    // The ship hung from the tie beam over the nave.
    votiveShip(ctx, 86, 150, 88, 51);
    // The altar, the sea's blue on it with the Lanterns' ring, a lamp and two candles.
    altar(ctx, 140, 260, 184, 8, 236, '#b8b4aa', SEA_CLOTH, GOLD, (cx, cy, r) => lanternRing(ctx, cx, cy, r, GOLD));
    lantern(ctx, s, 200, 169, 10, GOLD, null, 160);
    candle(ctx, s, 152, 192, 14, '#f0e8d0', 90); candle(ctx, s, 248, 192, 14, '#f0e8d0', 90);
    votiveStand(ctx, s, 330, 214, 34);
    pew(ctx, -10, 112, 230, 38, '#5a4434', false);
    pew(ctx, 288, 410, 236, 32, '#5a4434', true);
  },
};
