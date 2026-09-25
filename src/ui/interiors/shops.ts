// The shops: the Harrow Provisioner, where a party buys its first clubs and rations and torches,
// and the Thornhold Armoury, where the forge is always lit and the steel is Thornmark's own.
import { shade, rgba } from '../../lib/art/palettes.ts';
import type { Scene, Stage } from './kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, planks, floorboards, flagstones, stones, windowIn, line, smudge, fillPoly, ink, inkRect, path, slab, pool, trunk, clipRect } from './kit.ts';
import { K, counter, bottle, jar, sack, crate, barrel, candle, lantern, herbs, sword, axe, warhammer, spear, mace, club, staff, bow, crossbow, shield, armourStand, mail, anvil, cloth } from './props.ts';
import { glossPoly, glossEllipse, glossBall } from '../monsters/gloss.ts';
import { drawText } from '../../lib/engine/text.ts';

const BRASS = '#c9a34a';

/** A round-bellied flask with a long neck, stoppered, its foot on y: the apothecary's shape. */
function flask(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, liquid: string): void {
  glossPoly(ctx, K, [x - r * 0.28, y - r * 1.6, x - r * 0.28, y - r * 2.6, x + r * 0.28, y - r * 2.6, x + r * 0.28, y - r * 1.6], '#c8d8e0', { gloss: 0.8 });
  glossBall(ctx, K, x, y - r, r, liquid, { gloss: 0.9, spread: 0.7 });
  ctx.fillStyle = rgba('#ffffff', 0.35); ctx.fillRect(Math.round(x - r * 0.5), Math.round(y - r * 1.5), 2, Math.max(1, Math.round(r * 0.5)));
  ctx.fillStyle = '#a07850'; ctx.fillRect(Math.round(x - r * 0.3), Math.round(y - r * 2.9), Math.round(r * 0.6), Math.max(2, Math.round(r * 0.35)));
}

/** A little stack of coins on y. */
function coins(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, metal = '#e0b840'): void {
  for (let i = 0; i < n; i++) glossEllipse(ctx, K, x + (rnd(3, i) - 0.5) * 2, y - 1 - i * 2, 4.5, 1.8, metal, 0, { gloss: 0.7 });
}

// ------------------------------------------------------------------ the Harrow Provisioner ----

const PINE = '#8a6038', PINE_DARK = '#5a3a22', WALL = '#e6d8b8';

/** The shop's brass scale on the counter, foot on y: a post, a beam, two pans on chains, a weight in one. */
function scale(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  glossPoly(ctx, K, [x - h * 0.22, y, x - h * 0.16, y - h * 0.08, x + h * 0.16, y - h * 0.08, x + h * 0.22, y], PINE_DARK, {});
  glossPoly(ctx, K, [x - 1.5, y - h * 0.08, x - 1.5, y - h, x + 1.5, y - h, x + 1.5, y - h * 0.08], BRASS, { gloss: 0.6 });
  const tilt = h * 0.04, bx0 = x - h * 0.45, bx1 = x + h * 0.45, by0 = y - h * 0.92 + tilt, by1 = y - h * 0.92 - tilt;
  line(ctx, [bx0, by0, bx1, by1], '#120c14', 4); line(ctx, [bx0, by0, bx1, by1], BRASS, 2);
  glossBall(ctx, K, x, y - h * 0.94, h * 0.05, BRASS, { gloss: 0.7 });
  for (const [px, py] of [[bx0, by0], [bx1, by1]] as [number, number][]) {
    const pan = py + h * 0.42;
    line(ctx, [px, py, px - h * 0.12, pan], '#8a7a4a', 1); line(ctx, [px, py, px + h * 0.12, pan], '#8a7a4a', 1);
    glossPoly(ctx, K, [px - h * 0.16, pan, px + h * 0.16, pan, px + h * 0.1, pan + h * 0.07, px - h * 0.1, pan + h * 0.07], BRASS, { gloss: 0.7 });
  }
  glossPoly(ctx, K, [bx0 - 3, by0 + h * 0.42, bx0 - 2, by0 + h * 0.34, bx0 + 2, by0 + h * 0.34, bx0 + 3, by0 + h * 0.42], '#5a5460', { gloss: 0.4 });
}

/** The ledger, open on the counter, with its quill in the inkpot beside it. Foot on y. */
function ledger(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  glossPoly(ctx, K, [x - w / 2, y, x - w * 0.45, y - w * 0.22, x + w * 0.45, y - w * 0.22, x + w / 2, y], '#6a2a20', {});
  glossPoly(ctx, K, [x - w * 0.46, y - 2, x - w * 0.42, y - w * 0.2, x - 1, y - w * 0.16, x - 1, y - 1], '#f0e8d0', {});
  glossPoly(ctx, K, [x + 1, y - 1, x + 1, y - w * 0.16, x + w * 0.42, y - w * 0.2, x + w * 0.46, y - 2], '#e8e0c8', {});
  for (let i = 0; i < 4; i++) { line(ctx, [x - w * 0.38, y - w * 0.16 + i * 3, x - w * 0.08, y - w * 0.15 + i * 3], rgba('#3a2a30', 0.5), 1); line(ctx, [x + w * 0.08, y - w * 0.15 + i * 3, x + w * 0.38, y - w * 0.16 + i * 3], rgba('#3a2a30', 0.5), 1); }
  const ix = x + w * 0.72;
  glossPoly(ctx, K, [ix - 4, y, ix - 5, y - 6, ix + 5, y - 6, ix + 4, y], '#2a2a3a', { gloss: 0.6 });
  line(ctx, [ix, y - 6, ix + 8, y - 22], '#e8e0d0', 2);
  fillPoly(ctx, [ix + 4, y - 14, ix + 12, y - 26, ix + 9, y - 16], '#f4f0e8');
}

/** A bundle of torches: pitch-headed sticks tied together, leaning, foot on y. */
function torches(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, n = 5): void {
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 3.5, lean = dx * 0.35;
    line(ctx, [x + dx, y, x + dx + lean, y - h], '#120c14', 4); line(ctx, [x + dx, y, x + dx + lean, y - h], '#8a6a42', 2.5);
    glossEllipse(ctx, K, x + dx + lean, y - h, 2.8, 4.5, '#3a2a1e', 0, { gloss: 0.3 });
  }
  line(ctx, [x - n * 2, y - h * 0.35, x + n * 2, y - h * 0.35], '#c8b890', 2);
}

/** A coil of rope hung from a peg, centre (x, y). */
function rope(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y + i * 1.5, r - i * 0.8, r * 0.9 - i * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = i % 2 ? '#c8a870' : '#b89860'; ctx.lineWidth = 2.5; ctx.stroke();
  }
  line(ctx, [x, y - r, x, y - r - 4], '#6a4626', 3);
}

/** A leather jerkin on a hook, its top at y. */
function jerkin(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.78;
  glossPoly(ctx, K, [x - w * 0.18, y, x + w * 0.18, y, x + w * 0.46, y + h * 0.1, x + w * 0.4, y + h * 0.36, x + w * 0.36, y + h, x - w * 0.36, y + h, x - w * 0.4, y + h * 0.36, x - w * 0.46, y + h * 0.1], '#8a5a32', { gloss: 0.2, spread: 0.7, h: 100, tex: 'stipple', seed: 4, amount: 0.3 });
  line(ctx, [x, y + h * 0.06, x, y + h], '#4a2e1a', 1.5);
  for (let i = 0; i < 4; i++) glossBall(ctx, K, x + 2.5, y + h * (0.2 + i * 0.18), 1.4, BRASS, { gloss: 0.6 });
  line(ctx, [x - w * 0.36, y + h * 0.7, x + w * 0.36, y + h * 0.7], '#4a2e1a', 2);
}

export const PROVISIONER: Scene = {
  ambient: ['#463a44', '#b0a290'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 206;
    plaster(ctx, 0, 0, STAGE_W, FLOOR, WALL, 51);
    floorboards(ctx, FLOOR, 200, 100, '#86603c', 9, 52);
    planks(ctx, 0, 0, STAGE_W, 20, PINE_DARK, 1, false, 53);
    beam(ctx, 0, 16, STAGE_W, 12, PINE, 54);
    beam(ctx, 126, 28, 10, FLOOR - 28, PINE, 55);
    beam(ctx, 270, 28, 10, FLOOR - 28, PINE, 56);
    // Left: the weapon wall. A rack of pegs, the shop's arms on it, a buckler and a jerkin above.
    shield(ctx, 32, 62, 15, '#8a6a42', 'round', '#6a3a2a');
    jerkin(ctx, 78, 36, 52);
    beam(ctx, 8, 104, 96, 6, PINE_DARK, 57);
    beam(ctx, 8, 176, 96, 6, PINE_DARK, 58);
    club(ctx, 18, 176, 58); mace(ctx, 34, 176, 56); sword(ctx, 52, 176, 66); sword(ctx, 68, 176, 40, { w: 2.2 }); bow(ctx, 96, 180, 70);
    // A spear and a quarterstaff stood in the corner against the post.
    spear(ctx, 110, FLOOR, 162); staff(ctx, 118, FLOOR, 150);
    // A sling hung from the lower rail.
    line(ctx, [30, 182, 26, 200, 34, 200, 30, 182], '#6a4a2a', 1.5);
    // Middle: pigeonholes behind the counter, potions and simples in them, and the shop's board over them.
    const px = 142, pw = 118, pt = 44;
    slab(ctx, px, pt, pw, 150, PINE_DARK, { lit: 2, dark: 0.1 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const cx = px + 6 + c * 28, cy = pt + 6 + r * 36;
      ctx.fillStyle = '#2a1a10'; ctx.fillRect(cx, cy, 24, 32);
      ctx.fillStyle = rgba('#000000', 0.35); ctx.fillRect(cx, cy, 24, 4);
      const k = (r * 4 + c) % 8, foot = cy + 32;
      if (k === 0 || k === 5) for (let i = 0; i < 3; i++) flask(ctx, cx + 5 + i * 7, foot, 3.6, '#c83a3a');
      else if (k === 1 || k === 6) for (let i = 0; i < 3; i++) bottle(ctx, cx + 5 + i * 7, foot, 16, '#4a8a4a', { squat: true, cork: '#a07850' });
      else if (k === 2) torches(ctx, cx + 12, foot, 26);
      else if (k === 3) for (let i = 0; i < 3; i++) slab(ctx, cx + 1, foot - 7 - i * 7, 22, 7, ['#8a4a8a', '#4a5a8a', '#8a7a5a'][i], { lit: 1, dark: 0.3 });
      else if (k === 4) jar(ctx, cx + 12, foot, 18, 24, '#b88a4a', '#6a4428');
      else if (k === 7) for (let i = 0; i < 2; i++) glossBall(ctx, K, cx + 7 + i * 10, foot - 6, 5.5, '#d8c8a0', { h: 60, tex: 'stipple', seed: i });
    }
    inkRect(ctx, px, pt, pw, 150);
    slab(ctx, 150, 20, 102, 20, '#3a5a3a', { lit: 2, dark: 0.3 });
    drawText(ctx, 'PROVISIONS', 201, 27, { size: 1, color: '#e8d080', align: 'center', shadowColor: '#120c14' });
    // Right: the window, and the stores under it.
    windowIn(ctx, s, 300, 42, 64, 58, PINE_DARK, { panes: [3, 2] });
    rope(ctx, 290, 124, 11);
    herbs(ctx, 380, 36, 14, 28, '#7a8a3a', 7);
    barrel(ctx, 312, FLOOR + 4, 36, 46, '#8a5a32');
    for (let i = 0; i < 7; i++) glossBall(ctx, K, 300 + (i % 4) * 8 + (i > 3 ? 4 : 0), FLOOR - 44 - (i > 3 ? 5 : 0), 4, i % 3 ? '#c83a2a' : '#9ac83a', { gloss: 0.6 });
    sack(ctx, 356, FLOOR + 6, 34, 44, '#c8b088', { open: '#e0c070', seed: 3 });
    crate(ctx, 364, FLOOR - 36, 32, 24, '#a07848');
    lantern(ctx, s, 330, 128, 11, '#3a3440', 28, 160);
    // The counter, with the scale, the ledger and a few coins on it.
    counter(ctx, 126, 290, 194, 11, STAGE_H, PINE, 60, { panels: 2, trim: BRASS });
    scale(ctx, 160, 204, 34);
    ledger(ctx, 226, 204, 40);
    coins(ctx, 196, 204, 4); coins(ctx, 205, 204, 2);
    flask(ctx, 276, 204, 5, '#c83a3a');
    // Stock stood on the floor in front: sacks of meal, and a basket of torches.
    sack(ctx, 40, 256, 44, 56, '#c0a47a', { seed: 1 });
    sack(ctx, 84, 262, 40, 50, '#b0946a', { open: '#e8d8a8', seed: 2 });
    crate(ctx, 318, 266, 56, 44, '#9a7040');
    torches(ctx, 346, 222, 36, 6);
    candle(ctx, s, 250, 204, 12, '#efe4c8', 100);
  },
};

// ------------------------------------------------------------------ the Thornhold Armoury ----

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

