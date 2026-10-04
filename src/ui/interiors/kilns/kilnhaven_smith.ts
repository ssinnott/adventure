// Kilnhaven's smith, the port's: rubble walls black with soot, a forge of brick under a brick
// hood, the stable door's upper leaf open on the ore quay, the band's steel on its rack at a
// quarter more than Anvilhall asks and a ship's anchor in on the floor for mending with its chain
// heaped beside it, the hoist's hook hanging over it.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, flagstones, stones, line, smudge, fillPoly, path, ink, inkRect, slab, pool, contact, DAY_POOL } from '../kit.ts';
import { K, anvil, sword, axe, lantern } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { TAR, IRON, oreDust, rubble, harbour } from './port.ts';

const FLOOR = 206, BRICK = '#8a4a36';
/** The forge: its middle, its half-width and the top of its bed. */
const FX = 318, FW = 52, BED = 154;
/** The stable door: its left, its width, its head and where the lower leaf's top is. */
const DX = 132, DW = 74, DY = 66, LEAF = 142;

/** The forge: a bed of brick, the coals on it, a hood of brick drawn in to the flue. The fire is the room's warm light. */
function forge(ctx: CanvasRenderingContext2D, s: Stage): void {
  const hb = 104, hood = [FX - FW - 8, hb, FX + FW + 8, hb, FX + 22, 14, FX - 22, 14];
  smudge(ctx, FX, 60, 90, '#0a0606', 0.55);
  ctx.save(); path(ctx, hood); ctx.clip();
  stones(ctx, FX - FW - 8, 14, FW * 2 + 16, hb - 14, BRICK, 11, 851, { long: 2.4, mortar: '#4a3a34' });
  const soot = ctx.createLinearGradient(0, 14, 0, hb); soot.addColorStop(0, rgba('#0a0606', 0.55)); soot.addColorStop(1, rgba('#0a0606', 0.15));
  ctx.fillStyle = soot; ctx.fillRect(FX - FW - 8, 14, FW * 2 + 16, hb - 14);
  ctx.restore();
  path(ctx, hood); ink(ctx);
  slab(ctx, FX - FW - 11, hb - 2, FW * 2 + 22, 7, shade(IRON, 1.1), { lit: 1 });
  fillPoly(ctx, [FX - FW, hb + 5, FX + FW, hb + 5, FX + FW, BED, FX - FW, BED], '#160c08');
  smudge(ctx, FX, BED - 6, FW, '#ff6a20', 0.45);
  stones(ctx, FX - FW - 6, BED, FW * 2 + 12, FLOOR - BED, BRICK, 5, 852, { long: 2.4, mortar: '#4a3a34' });
  inkRect(ctx, FX - FW - 6, BED, FW * 2 + 12, FLOOR - BED);
  slab(ctx, FX - FW - 8, BED - 4, FW * 2 + 16, 6, shade(BRICK, 1.1), { lit: 1 });
  const coal = ctx.createLinearGradient(0, BED - 10, 0, BED);
  coal.addColorStop(0, '#ffe08a'); coal.addColorStop(0.5, '#ff7a2a'); coal.addColorStop(1, '#8a2410');
  ctx.beginPath(); ctx.ellipse(FX, BED - 3, FW * 0.8, 8, 0, Math.PI, Math.PI * 2); ctx.fillStyle = coal; ctx.fill();
  s.lights.push({ k: 'fire', x: FX, y: BED - 5, w: FW * 1.2, h: 30 });
  s.lights.push({ k: 'motes', x: FX - FW * 0.6, y: hb + 8, w: FW * 1.2, h: BED - hb - 18, color: '#ffc060', n: 10, rise: 0.6 });
  pool(s, FX, BED - 16, 240, '#ff8a3a', 0.95);
  // Bellows hung on a peg beside it, their nozzle in its side.
  glossBall(ctx, K, FX - FW - 30, BED - 54, 1.8, IRON, {});
  line(ctx, [FX - FW - 30, BED - 54, FX - FW - 34, BED - 40], '#3a2a20', 1);
  glossPoly(ctx, K, [FX - FW - 34, BED - 40, FX - FW - 14, BED - 46, FX - FW - 4, BED - 30, FX - FW - 14, BED - 18, FX - FW - 34, BED - 24], '#6a4028', { gloss: 0.2 });
  for (let i = 0; i < 3; i++) line(ctx, [FX - FW - 30 + i * 6, BED - 40 + i, FX - FW - 30 + i * 6, BED - 24 - i], rgba('#2a1610', 0.6), 1);
  glossPoly(ctx, K, [FX - FW - 8, BED - 34, FX - FW + 4, BED - 32, FX - FW + 4, BED - 29, FX - FW - 8, BED - 28], IRON, { gloss: 0.5 });
}

/** The stable door, its lower leaf shut and its upper leaf swung back against the wall, the quay through the top. */
function stableDoor(ctx: CanvasRenderingContext2D, s: Stage): void {
  ctx.fillStyle = '#120c14'; ctx.fillRect(DX - 3, DY - 3, DW + 6, FLOOR - DY + 3);
  ctx.save(); ctx.beginPath(); ctx.rect(DX, DY, DW, LEAF - DY); ctx.clip();
  harbour(DX - 40, DY - 10, DW + 80, (LEAF - DY) * 2, s.daylight, 5, { ship: true, hearth: false })(ctx);
  ctx.restore();
  // The frame, the lower leaf shut, the upper leaf open flat against the wall.
  for (const px of [DX - 9, DX + DW]) beam(ctx, px, DY - 9, 9, FLOOR - DY + 9, TAR, px);
  beam(ctx, DX - 9, DY - 12, DW + 18, 9, TAR, 853);
  planks(ctx, DX, LEAF, DW, FLOOR - LEAF, shade(TAR, 1.5), 5, true, 854);
  inkRect(ctx, DX, LEAF, DW, FLOOR - LEAF);
  slab(ctx, DX - 2, LEAF - 3, DW + 4, 5, shade(TAR, 1.7), { lit: 1 });
  for (const hy of [LEAF + 12, FLOOR - 14]) slab(ctx, DX + 4, hy, DW * 0.6, 3, IRON, { lit: 1 });
  planks(ctx, DX - 34, DY + 4, 22, LEAF - DY - 6, shade(TAR, 1.4), 2, true, 855);
  inkRect(ctx, DX - 34, DY + 4, 22, LEAF - DY - 6);
  if (s.daylight > 0.15) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, LEAF, 0, STAGE_H); g.addColorStop(0, rgba('#e8f0ff', 0.2 * s.daylight)); g.addColorStop(1, rgba('#e8f0ff', 0));
    fillPoly(ctx, [DX, LEAF + 4, DX + DW, LEAF + 4, DX + DW + 30, STAGE_H, DX - 50, STAGE_H], g);
    ctx.restore();
    pool(s, DX + DW / 2, (DY + LEAF) / 2, 200, DAY_POOL, 0.85 * s.daylight);
  }
}

/**
 * A ship's anchor lying in for mending: the shank across the floor, the crown and its two flukes
 * at the right, the ring and the stock at the left.
 */
function anchor(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  const metal = '#4a4a52';
  contact(ctx, (x0 + x1) / 2, Math.max(y0, y1) + 8, x1 - x0 + 40, 0.5);
  // The arms curving up and down from the crown, a fluke on each.
  for (const sd of [-1, 1]) {
    const tx = x1 - 26, ty = y1 + sd * 36;
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(x1 - 4, y1 + sd * 28, tx, ty); ctx.stroke();
    ctx.strokeStyle = metal; ctx.lineWidth = 6.5; ctx.stroke();
    glossPoly(ctx, K, [tx - 9, ty - sd * 2, tx + 2, ty + sd * 10, tx + 8, ty - sd * 4, tx + 2, ty - sd * 6], shade(metal, 1.1), { gloss: 0.4 });
  }
  glossBall(ctx, K, x1, y1, 6, shade(metal, 1.1), { gloss: 0.4 });
  // The shank.
  line(ctx, [x0 + 10, y0, x1, y1], '#120c14', 10); line(ctx, [x0 + 10, y0, x1, y1], metal, 7);
  line(ctx, [x0 + 12, y0 - 2, x1 - 6, y1 - 2], rgba('#ffffff', 0.18), 1);
  // Rust where the sea has had it.
  for (let i = 0; i < 12; i++) { const u = rnd(856, i); smudge(ctx, x0 + 12 + (x1 - x0 - 12) * u, y0 + (y1 - y0) * u + (rnd(857, i) - 0.5) * 4, 2 + rnd(858, i) * 3, '#8a4a2a', 0.8); }
  // The stock across the shank by the ring, oak bound with iron; then the ring.
  glossPoly(ctx, K, [x0 + 22, y0 - 28, x0 + 30, y0 - 30, x0 + 24, y0 + 30, x0 + 16, y0 + 28], '#6a4a2e', { gloss: 0.15 });
  for (const f of [0.25, 0.75]) { const sy = y0 - 29 + 58 * f, sx = x0 + 26 - 8 * f; line(ctx, [sx - 6, sy, sx + 6, sy - 1], IRON, 2); }
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x0 + 4, y0, 9, 11, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = metal; ctx.lineWidth = 3.5; ctx.stroke();
}

/** Chain heaped on the floor beside the anchor, link on link, centre of the heap's foot at (x, y). */
function chainHeap(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  contact(ctx, x, y, r * 2.4, 0.5);
  for (let i = 0; i < 40; i++) {
    const a = rnd(859, i) * Math.PI * 2, d = Math.sqrt(rnd(860, i)) * r, lx = x + Math.cos(a) * d, ly = y - r * 0.5 + Math.sin(a) * d * 0.4 - (r - d) * 0.5, rot = rnd(861, i) * Math.PI;
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(lx, ly, 4.5, 2.6, rot, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = i % 3 ? '#5a5a62' : '#6a4434'; ctx.lineWidth = 2; ctx.stroke();
  }
}

/** The hoist's hook hanging on its chain from a block on the beam, the hook's eye at y. */
function hook(ctx: CanvasRenderingContext2D, x: number, top: number, y: number): void {
  glossEllipse(ctx, K, x, top + 8, 6, 9, '#5a4430', 0, { gloss: 0.3 });
  line(ctx, [x, top + 16, x, y], '#120c14', 2.5);
  for (let cy = top + 18; cy < y; cy += 4) { ctx.fillStyle = (cy / 4) % 2 ? '#6a6a72' : '#4a4a52'; ctx.fillRect(Math.round(x) - 1, Math.round(cy), 3, 3); }
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 6); ctx.arc(x - 5, y + 9, 5, 0, Math.PI * 0.95); ctx.stroke();
  ctx.strokeStyle = '#6a6a72'; ctx.lineWidth = 2.5; ctx.stroke();
}

export const SMITH: Scene = {
  ambient: ['#2c2a30', '#7e7c7a'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    rubble(ctx, 0, 0, STAGE_W, FLOOR, 11, 862);
    const soot = ctx.createLinearGradient(0, 0, 0, FLOOR); soot.addColorStop(0, rgba('#0a0606', 0.6)); soot.addColorStop(0.5, rgba('#0a0606', 0.15)); soot.addColorStop(1, rgba('#0a0606', 0));
    ctx.fillStyle = soot; ctx.fillRect(0, 0, STAGE_W, FLOOR);
    oreDust(ctx, 0, FLOOR - 40, STAGE_W, 40, 863, 0.4);
    flagstones(ctx, FLOOR, 200, 110, '#6a665e', 7, 864);
    oreDust(ctx, 0, FLOOR, STAGE_W, STAGE_H - FLOOR, 865, 0.3);
    beam(ctx, 0, 0, STAGE_W, 14, TAR, 866);
    stableDoor(ctx, s);
    lantern(ctx, s, 222, 74, 10, IRON, 14, 190);
    forge(ctx, s);
    // The band's steel on its rack, left: axes and swords.
    beam(ctx, 14, 64, 92, 5, TAR, 867);
    beam(ctx, 14, 168, 92, 5, TAR, 868);
    axe(ctx, 26, 172, 92, true, '#8a929e');
    sword(ctx, 44, 168, 96, { w: 2.8 });
    axe(ctx, 62, 172, 84, false, '#9aa2ae');
    sword(ctx, 80, 168, 90, { w: 2.6, hilt: '#8a8e96' });
    // The anchor in for mending and its chain, the hoist's hook over them; the anvil by the forge.
    hook(ctx, 120, 14, 150);
    anchor(ctx, 30, 236, 190, 228);
    chainHeap(ctx, 222, 250, 24);
    anvil(ctx, 300, 254, 70);
    glossPoly(ctx, K, [324, 206, 338, 204, 340, 208, 326, 210], '#3a3a42', { gloss: 0.5 });
  },
};
