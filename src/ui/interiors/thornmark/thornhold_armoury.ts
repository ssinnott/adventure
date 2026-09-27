// The Thornhold Armoury, where the forge is always lit and the steel is Thornmark's own.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, flagstones, stones, line, smudge, fillPoly, ink, inkRect, path, slab, pool, trunk, clipRect } from '../kit.ts';
import { K, bottle, candle, lantern, sword, axe, warhammer, staff, bow, crossbow, shield, armourStand, mail, anvil, cloth } from '../props.ts';
import { glossPoly } from '../../monsters/gloss.ts';
import { flask } from '../shops.ts';

const GREYSTONE = '#8a8878', OAKWOOD = '#6a4a2e', EMBER = '#ff8a3a';

/** The forge: a stone hearth under a hood, coals banked high and glowing, the bellows beside it. Returns the hearth's mouth. */
function forge(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): { cx: number; cy: number } {
  // The hood, narrowing up to the flue.
  const hoodTop = 20, hoodY = y - w * 0.95;
  fillPoly(ctx, [x + w * 0.3, hoodTop, x + w * 0.7, hoodTop, x + w * 0.98, hoodY, x + w * 0.02, hoodY], shade(GREYSTONE, 0.7));
  ctx.save(); path(ctx, [x + w * 0.3, hoodTop, x + w * 0.7, hoodTop, x + w * 0.98, hoodY, x + w * 0.02, hoodY]); ctx.clip();
  stones(ctx, x, hoodTop, w, hoodY - hoodTop, shade(GREYSTONE, 0.8), 6, 81);
  const soot = ctx.createLinearGradient(0, hoodTop, 0, hoodY); soot.addColorStop(0, rgba('#0a0608', 0.5)); soot.addColorStop(1, rgba('#0a0608', 0.1));
  ctx.fillStyle = soot; ctx.fillRect(x, hoodTop, w, hoodY - hoodTop);
  ctx.restore();
  path(ctx, [x + w * 0.3, hoodTop, x + w * 0.7, hoodTop, x + w * 0.98, hoodY, x + w * 0.02, hoodY]); ink(ctx);
  beam(ctx, x - 4, hoodY, w + 8, 7, OAKWOOD, 82);
  // The hearth: a waist-high stone bed, its coals banked in a trough.
  const bedTop = y - w * 0.5;
  ctx.fillStyle = '#1a1210'; ctx.fillRect(x + 4, hoodY + 7, w - 8, bedTop - hoodY - 7);
  smudge(ctx, x + w / 2, bedTop - 4, w * 0.5, EMBER, 0.5);
  stones(ctx, x, bedTop, w, y - bedTop, GREYSTONE, 3, 83, { long: 1.3 });
  inkRect(ctx, x, bedTop, w, y - bedTop);
  const coal = ctx.createLinearGradient(0, bedTop - 8, 0, bedTop);
  coal.addColorStop(0, '#ffd070'); coal.addColorStop(0.5, '#ff7a2a'); coal.addColorStop(1, '#8a2410');
  ctx.beginPath(); ctx.ellipse(x + w / 2, bedTop - 2, w * 0.36, 7, 0, Math.PI, Math.PI * 2); ctx.fillStyle = coal; ctx.fill();
  for (let i = 0; i < 14; i++) { ctx.fillStyle = i % 3 ? '#3a1a10' : '#ffb050'; ctx.fillRect(Math.round(x + w * 0.2 + rnd(84, i) * w * 0.6), Math.round(bedTop - 2 - rnd(85, i) * 6), 2, 2); }
  // Tongs and a poker hung on the hood's edge.
  line(ctx, [x + w * 0.9, hoodY + 8, x + w * 0.86, bedTop - 12], '#3a3840', 2); line(ctx, [x + w * 0.94, hoodY + 8, x + w * 0.9, bedTop - 14], '#3a3840', 2);
  s.lights.push({ k: 'fire', x: x + w / 2, y: bedTop - 4, w: w * 0.5, h: w * 0.28 });
  s.lights.push({ k: 'glow', x: x + w / 2, y: bedTop - 4, r: w * 0.7, color: '#ff8a3a', a: 0.35 });
  s.lights.push({ k: 'motes', x: x + w * 0.25, y: hoodY + 10, w: w * 0.5, h: bedTop - hoodY - 16, color: '#ffc060', n: 10, rise: 0.6 });
  pool(s, x + w / 2, bedTop - 10, 230, '#ff8a3a', 0.95);
  return { cx: x + w / 2, cy: bedTop };
}

/** The bellows on their frame beside the forge, foot on y. */
function bellows(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  line(ctx, [x - w * 0.4, y, x - w * 0.3, y - w * 0.5], '#120c14', 4); line(ctx, [x + w * 0.4, y, x + w * 0.3, y - w * 0.5], '#120c14', 4);
  line(ctx, [x - w * 0.4, y, x - w * 0.3, y - w * 0.5], OAKWOOD, 2.5); line(ctx, [x + w * 0.4, y, x + w * 0.3, y - w * 0.5], OAKWOOD, 2.5);
  glossPoly(ctx, K, [x - w * 0.5, y - w * 0.5, x + w * 0.35, y - w * 0.62, x + w * 0.5, y - w * 0.56, x - w * 0.45, y - w * 0.42], '#6a4a30', {});
  glossPoly(ctx, K, [x - w * 0.46, y - w * 0.62, x + w * 0.3, y - w * 0.78, x + w * 0.46, y - w * 0.66, x - w * 0.42, y - w * 0.56], '#8a5a34', { gloss: 0.3 });
}

/** A heavy workbench across the front, its top's back edge at `top`: thick planks on trestles. */
function workbench(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, bottom: number): void {
  for (const lx of [x0 + 20, x1 - 30]) { slab(ctx, lx, top + 14, 10, bottom - top, shade(OAKWOOD, 0.75), { lit: 1 }); line(ctx, [lx - 6, bottom - 18, lx + 16, bottom - 18], '#120c14', 3); }
  planks(ctx, x0, top + 12, x1 - x0, 10, OAKWOOD, 2, false, 86);
  inkRect(ctx, x0, top + 12, x1 - x0, 10);
  const g = ctx.createLinearGradient(0, top, 0, top + 12);
  g.addColorStop(0, shade(OAKWOOD, 0.75)); g.addColorStop(1, shade(OAKWOOD, 1.2));
  ctx.fillStyle = g; ctx.fillRect(x0, top, x1 - x0, 12);
  ctx.save(); clipRect(ctx, x0, top, x1 - x0, 12);
  for (let i = 0; i < 6; i++) { ctx.fillStyle = rgba('#1a1008', 0.35); ctx.beginPath(); ctx.ellipse(x0 + 20 + rnd(87, i) * (x1 - x0 - 40), top + 3 + rnd(88, i) * 7, 3 + rnd(89, i) * 5, 1.2, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
  inkRect(ctx, x0, top, x1 - x0, 22);
}

/** A rune-cut robe on a hanger, its top at y: deep blue with sigils along the hem that glow. */
function runedRobe(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  const w = h * 0.62;
  line(ctx, [x - w * 0.45, y, x + w * 0.45, y], '#120c14', 4); line(ctx, [x - w * 0.45, y, x + w * 0.45, y], '#8a6a42', 2);
  glossPoly(ctx, K, [x - w * 0.2, y, x + w * 0.2, y, x + w * 0.46, y + h * 0.08, x + w * 0.5, y + h * 0.35, x + w * 0.4, y + h * 0.36, x + w * 0.5, y + h, x - w * 0.5, y + h, x - w * 0.4, y + h * 0.36, x - w * 0.5, y + h * 0.35, x - w * 0.46, y + h * 0.08], '#2e3a6a', { gloss: 0.2, spread: 0.7, h: 100, tex: 'folds', seed: 3, amount: 0.6 });
  for (let i = 0; i < 5; i++) {
    const rx = x - w * 0.36 + i * w * 0.18, ry = y + h * 0.9;
    line(ctx, [rx - 2, ry + 2, rx, ry - 3, rx + 2, ry + 2], '#9ad0ff', 1);
    s.lights.push({ k: 'glow', x: rx, y: ry, r: 6, color: '#6ab0ff', a: 0.4 });
  }
}

export const ARMOURY: Scene = {
  ambient: ['#343036', '#8e8a82'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 208;
    stones(ctx, 0, 0, STAGE_W, FLOOR, GREYSTONE, 11, 90, { mottle: '#5a6a4a' });
    flagstones(ctx, FLOOR, 200, 100, '#7a7466', 7, 91);
    // Living-wood beams overhead: two great boughs, trained across the ceiling.
    trunk(ctx, [0, 14, 100, 8, 200, 14, 300, 8, 400, 14], 9, 9, '#5a4632', 92);
    // Left: the forge and its bellows, the anvil before it.
    forge(ctx, s, 16, FLOOR, 104);
    bellows(ctx, 136, FLOOR, 30);
    // The weapon wall behind the bench: two racks of Thornmark steel, the bow and the crossbow between.
    beam(ctx, 150, 48, 110, 6, OAKWOOD, 93);
    beam(ctx, 150, 170, 110, 6, OAKWOOD, 94);
    sword(ctx, 162, 170, 116, { w: 3.4, guard: 11 });
    axe(ctx, 184, 176, 118, true);
    warhammer(ctx, 206, 176, 112);
    sword(ctx, 226, 170, 92, { w: 2.8 });
    sword(ctx, 244, 170, 88, { w: 2.8, hilt: '#8a8e96' });
    staff(ctx, 258, 180, 128, '#6a5a3a', '#5ad0a0');
    bow(ctx, 282, 160, 104, '#a86a3a', true);
    crossbow(ctx, 172, 22, 30);
    // Right: plate on its stand, the tower shield leaning, mail on a peg, the runed robe.
    mail(ctx, 312, 40, 52);
    runedRobe(ctx, s, 364, 38, 66);
    armourStand(ctx, 330, FLOOR - 2, 124);
    shield(ctx, 380, 170, 20, '#3a5a3a', 'tower', '#c9a34a');
    shield(ctx, 297, 124, 12, '#6a3a2a', 'kite', '#d8c8a0');
    lantern(ctx, s, 138, 44, 9, '#3a3440', 14, 130);
    // The bench across the front: a rune dagger on its cloth, vials, a whetstone, a flask of lantern oil.
    anvil(ctx, 70, 250, 60);
    line(ctx, [60, 208, 86, 200], '#120c14', 4); line(ctx, [60, 208, 86, 200], OAKWOOD, 2.5);
    glossPoly(ctx, K, [82, 196, 94, 194, 95, 202, 83, 204], '#4a4852', { gloss: 0.5 });
    workbench(ctx, 150, 392, 200, STAGE_H);
    cloth(ctx, 200, 256, 205, 8, '#6a2a2a', 4);
    sword(ctx, 250, 208, 48, { w: 2.4, hilt: '#5ad0a0', blade: '#b8c8e8' });
    flask(ctx, 290, 210, 5, '#c83a3a'); flask(ctx, 304, 210, 5, '#3a5ad8'); flask(ctx, 318, 210, 4, '#3a5ad8');
    bottle(ctx, 346, 210, 20, '#b8862a', { squat: true, label: '#e8dcc0' });
    glossPoly(ctx, K, [166, 208, 190, 206, 192, 211, 168, 212], '#7a7a86', {});
    candle(ctx, s, 374, 210, 12, '#efe4c8', 100);
  },
};
