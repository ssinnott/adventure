// The stores in Lantern Watch: oil jars in rows, most of them empty, the warding lamps on their
// shelf, the gear pilgrims left racked along the wall, and the quartermaster's desk under the one
// lamp that is lit.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, beam, planks, flagstones, windowIn, forestFill, line, fillPoly, smudge, contact, slab } from '../kit.ts';
import { K, shelf, lantern, sword, spear, mace, staff, bow, shield, mail, crate, sack, books } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';
import { armsRack } from '../yards.ts';
import { SPINES } from '../guilds.ts';

const GREY = '#77736a', OAK = '#56402c', CLAY = '#a07a52', GOLD = '#c9a34a';
const FLOOR = 196;

/**
 * An oil jar on y: a tall two-handled amphora. A full one is stoppered and sealed in wax, oil dark
 * at its lip; an empty one stands open, its mouth black, and rings the dust where it was lifted.
 */
function oilJar(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, full: boolean): void {
  const w = h * 0.5;
  contact(ctx, x, y, w * 1.1, 0.35);
  for (const sd of [-1, 1]) { ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x + sd * w * 0.36, y - h * 0.8, h * 0.1, sd < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, sd < 0 ? Math.PI * 1.5 : Math.PI * 0.5, sd < 0); ctx.stroke(); ctx.strokeStyle = shade(CLAY, 0.85); ctx.lineWidth = 2; ctx.stroke(); }
  glossPoly(ctx, K, [x - w * 0.18, y, x - w * 0.5, y - h * 0.4, x - w * 0.42, y - h * 0.72, x - w * 0.16, y - h * 0.86, x - w * 0.16, y - h, x + w * 0.16, y - h, x + w * 0.16, y - h * 0.86, x + w * 0.42, y - h * 0.72, x + w * 0.5, y - h * 0.4, x + w * 0.18, y], full ? CLAY : shade(CLAY, 1.1), { gloss: 0.35, spread: 0.75 });
  ctx.fillStyle = rgba('#2a1a10', 0.25); ctx.fillRect(Math.round(x - w * 0.46), Math.round(y - h * 0.55), Math.round(w * 0.92), 2);
  if (full) {
    glossEllipse(ctx, K, x, y - h - 1, w * 0.18, 2.5, '#8a2a2a', 0, { gloss: 0.5 });
    ctx.fillStyle = rgba('#3a2a10', 0.6); ctx.fillRect(Math.round(x - w * 0.14), Math.round(y - h * 0.94), Math.round(w * 0.28), Math.round(h * 0.18));
  } else {
    glossEllipse(ctx, K, x, y - h, w * 0.17, 2, '#140c08', 0, {});
  }
}

/**
 * A warding lamp on y: the Lanterns' little hooded lamp of brass and smoked glass that hangs at a
 * door against what comes out of the dark. These are cold.
 */
function wardingLamp(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.55;
  glossPoly(ctx, K, [x - w * 0.5, y, x - w * 0.36, y - h * 0.14, x + w * 0.36, y - h * 0.14, x + w * 0.5, y], shade(GOLD, 0.8), { gloss: 0.6 });
  glossPoly(ctx, K, [x - w * 0.34, y - h * 0.14, x - w * 0.4, y - h * 0.66, x + w * 0.4, y - h * 0.66, x + w * 0.34, y - h * 0.14], '#4a5250', { gloss: 0.8, spread: 0.6 });
  line(ctx, [x, y - h * 0.18, x, y - h * 0.62], shade(GOLD, 0.7), 1);
  glossPoly(ctx, K, [x - w * 0.46, y - h * 0.66, x, y - h * 0.94, x + w * 0.46, y - h * 0.66], GOLD, { gloss: 0.6 });
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - h, h * 0.08, 0, Math.PI * 2); ctx.stroke();
}

/** The quartermaster's desk, its top's front edge at y: a sloped writing board on a cupboard, a stool. */
function desk(ctx: CanvasRenderingContext2D, s: Stage, x0: number, x1: number, y: number): void {
  slab(ctx, x0 + 4, y, x1 - x0 - 8, STAGE_H - y, shade(OAK, 0.8), { lit: 2 });
  planks(ctx, x0 + 10, y + 10, (x1 - x0) / 2 - 14, STAGE_H - y - 14, shade(OAK, 0.9), 2, true, 91);
  planks(ctx, (x0 + x1) / 2 + 4, y + 10, (x1 - x0) / 2 - 14, STAGE_H - y - 14, shade(OAK, 0.9), 2, true, 92);
  glossPoly(ctx, K, [x0, y, x0 + 6, y - 18, x1 - 6, y - 18, x1, y], shade(OAK, 1.2), { gloss: 0.2, spread: 0.8 });
  // The day book open on it, the tally in two hands, the inkpot, the seal of the stores.
  glossPoly(ctx, K, [x0 + 22, y - 3, x0 + 26, y - 16, x0 + 60, y - 16, x0 + 62, y - 3], '#ece2c8', {});
  glossPoly(ctx, K, [x0 + 62, y - 3, x0 + 60, y - 16, x0 + 94, y - 16, x0 + 98, y - 3], '#e4dac0', {});
  for (let i = 0; i < 4; i++) { line(ctx, [x0 + 30, y - 14 + i * 3, x0 + 56, y - 14 + i * 3], rgba('#3a2a30', 0.5), 1); line(ctx, [x0 + 66, y - 14 + i * 3, x0 + 80 + (i % 2) * 8, y - 14 + i * 3], rgba(i > 1 ? '#6a2a2a' : '#3a2a30', 0.55), 1); }
  glossPoly(ctx, K, [x1 - 34, y - 4, x1 - 35, y - 11, x1 - 25, y - 11, x1 - 26, y - 4], '#2a2a3a', { gloss: 0.6 });
  line(ctx, [x1 - 30, y - 11, x1 - 22, y - 26], '#e8e0d0', 2);
  books(ctx, x1 - 20, y - 3, 16, 10, 93, SPINES);
}

export const STORES: Scene = {
  ambient: ['#1e1c22', '#78787a'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    stones(ctx, 0, 0, STAGE_W, FLOOR, GREY, 12, 94);
    const soot = ctx.createLinearGradient(0, 0, 0, 60);
    soot.addColorStop(0, rgba('#0a0606', 0.6)); soot.addColorStop(1, rgba('#0a0606', 0));
    ctx.fillStyle = soot; ctx.fillRect(0, 0, STAGE_W, 60);
    flagstones(ctx, FLOOR, 200, 92, '#686458', 7, 95);
    planks(ctx, 0, 0, STAGE_W, 12, shade(OAK, 0.7), 1, false, 96);
    beam(ctx, 0, 12, STAGE_W, 9, OAK, 97);
    // The high window, a slot of the wood and the sky, the one daylight there is.
    windowIn(ctx, s, 170, 30, 60, 22, shade(OAK, 0.9), { panes: [3, 1], view: (c) => forestFill(c, 170, 30, 60, 22, s.daylight, 98) });
    // The warding lamps in a row on their shelf, cold, a gap where one has gone.
    shelf(ctx, 140, 84, 120, OAK, 4);
    for (let i = 0; i < 6; i++) if (i !== 4) wardingLamp(ctx, 154 + i * 19, 84, 22);
    ctx.fillStyle = rgba('#0a0606', 0.18); ctx.beginPath(); ctx.ellipse(230, 83, 6, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    // The oil jars on stepped shelves along the left wall: three rows, most of them empty.
    for (let r = 0; r < 3; r++) {
      const sy = 92 + r * 50;
      if (r < 2) shelf(ctx, 0, sy, 128, OAK, 5);
      for (let i = 0; i < 6; i++) { const full = rnd(99, r, i) < 0.2; oilJar(ctx, 12 + i * 20, r < 2 ? sy : FLOOR + 8, 32, full); }
    }
    // The racked gear pilgrims left: a stand of arms, a shield on the wall, a mail coat on its pole.
    armsRack(ctx, 290, FLOOR + 4, 86, 84, OAK);
    sword(ctx, 302, FLOOR, 72); spear(ctx, 318, FLOOR, 96); mace(ctx, 334, FLOOR, 56); staff(ctx, 350, FLOOR, 88, '#7a5a34'); bow(ctx, 366, FLOOR, 76);
    shield(ctx, 296, 66, 15, '#5a4a6a', 'kite', GOLD);
    shield(ctx, 350, 60, 14, '#6a3a2a', 'round');
    mail(ctx, 382, 140, 46);
    // Crates and a sack of wicks by the door.
    crate(ctx, 262, FLOOR + 30, 40, 34, '#8a6a44', 4);
    sack(ctx, 238, FLOOR + 40, 28, 34, '#b8a078', { seed: 3, open: '#e8e0c8' });
    // The one lamp that is lit, hung over the desk.
    lantern(ctx, s, 134, 132, 11, '#6a5a3a', 20, s.daylight > 0.5 ? 120 : 210);
    smudge(ctx, 134, 180, 60, '#ffb060', 0.12);
    desk(ctx, s, 46, 210, 224);
    // Oil on the flags under the jars, and dust.
    for (let i = 0; i < 5; i++) { ctx.fillStyle = rgba('#2a1a0a', 0.25); ctx.beginPath(); ctx.ellipse(20 + rnd(100, i) * 100, FLOOR + 14 + rnd(101, i) * 10, 6 + rnd(102, i) * 8, 2, 0, 0, Math.PI * 2); ctx.fill(); }
  },
};
