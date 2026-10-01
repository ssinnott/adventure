// The Lantern hall in Lantern Watch: the round room in the tower's foot, the great lamp's winding
// gear rising through the vault, the stair up to it, a lantern on every lectern and the oldest
// scrolls the order keeps.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, block, beam, planks, flagstones, line, smudge, fillPoly, path, ink, inkRect, slab, pool, clipRect, skyFill } from '../kit.ts';
import { K, lantern, lanternRing } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { lectern } from '../guilds.ts';

const GREY = '#7e7a70', OAK = '#4e3a28', IRON = '#3e3c44', GOLD = '#c9a34a';
const FLOOR = 206;

/** The foot of the round wall at x: highest at the middle, where it is furthest, falling to the sides. */
const foot = (x: number): number => FLOOR + Math.pow((x - 200) / 200, 2) * 30;
/** The spring of the vault at x: lowest at the middle, rising to the sides. */
const spring = (x: number): number => 30 - Math.pow((x - 200) / 200, 2) * 30;

/**
 * The round wall: courses of old grey stone that curve with the room, each block narrower toward
 * the sides as the wall turns away, darker at both edges.
 */
function roundWall(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = shade(GREY, 0.45); ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  const rows = 11;
  for (let r = 0; r < rows; r++) {
    let j = 0, a = -1 + rnd(31, r) * 0.08;
    while (a < 1) {
      const da = 0.08 + rnd(32, r, j) * 0.08, a1 = Math.min(1, a + da);
      const x0 = 200 + Math.sin(a * 1.2) / Math.sin(1.2) * 200, x1 = 200 + Math.sin(a1 * 1.2) / Math.sin(1.2) * 200;
      const t0 = spring((x0 + x1) / 2), b0 = foot((x0 + x1) / 2), h = (b0 - t0) / rows;
      if (x1 - x0 > 3) block(ctx, x0 + 0.5, t0 + h * r + 0.5, x1 - x0 - 1, h - 1, shade(GREY, 0.82 + rnd(33, r, j) * 0.3), r * 31 + j);
      a = a1; j++;
    }
  }
  // The wall turning away into the dark at both sides.
  const g = ctx.createLinearGradient(0, 0, STAGE_W, 0);
  g.addColorStop(0, rgba('#0a0608', 0.7)); g.addColorStop(0.22, rgba('#0a0608', 0.1)); g.addColorStop(0.78, rgba('#0a0608', 0.1)); g.addColorStop(1, rgba('#0a0608', 0.7));
  ctx.fillStyle = g; ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  // Soot up under the vault from four hundred years of lamps.
  const soot = ctx.createLinearGradient(0, 0, 0, 90);
  soot.addColorStop(0, rgba('#120a06', 0.6)); soot.addColorStop(1, rgba('#120a06', 0));
  ctx.fillStyle = soot; ctx.fillRect(0, 0, STAGE_W, 90);
}

/** The vault's ribs springing from the wall and meeting at the ring the lamp's chains go up through. */
function vault(ctx: CanvasRenderingContext2D): void {
  const pts: number[] = [];
  for (let i = 0; i <= 40; i++) { const x = i * 10; pts.push(x, spring(x)); }
  fillPoly(ctx, [0, -2, ...pts, STAGE_W, -2], shade(GREY, 0.32));
  line(ctx, pts, '#120c14', 3); line(ctx, pts, shade(GREY, 0.9), 1.5);
  for (const x0 of [20, 110, 290, 380]) line(ctx, [x0, spring(x0), (x0 + 200) / 2, 6, 200, -2], shade(GREY, 0.55), 3);
}

/** A slit window deep in the wall: a narrow lancet with the wood beyond, splayed reveal round it. */
function slit(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  const w = 7, sw = 22;
  fillPoly(ctx, [x - sw / 2, y + h + 6, x - sw / 2, y + 6, x, y - 10, x + sw / 2, y + 6, x + sw / 2, y + h + 6], shade(GREY, 0.6));
  path(ctx, [x - sw / 2, y + h + 6, x - sw / 2, y + 6, x, y - 10, x + sw / 2, y + 6, x + sw / 2, y + h + 6]); ink(ctx);
  ctx.save(); ctx.beginPath(); ctx.moveTo(x - w / 2, y + h); ctx.lineTo(x - w / 2, y + 4); ctx.lineTo(x, y - 2); ctx.lineTo(x + w / 2, y + 4); ctx.lineTo(x + w / 2, y + h); ctx.closePath(); ctx.clip();
  skyFill(ctx, x - w / 2, y - 2, w, h + 2, s.daylight, Math.round(x));
  const pine = s.daylight > 0.3 ? '#2a4a2a' : '#0a120e';
  for (let i = 0; i < 3; i++) fillPoly(ctx, [x - 6 + i * 5, y + h, x - 3 + i * 5, y + h * 0.35 + rnd(34, x, i) * 10, x + i * 5, y + h], pine);
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(x - w / 2, y + h); ctx.lineTo(x - w / 2, y + 4); ctx.lineTo(x, y - 2); ctx.lineTo(x + w / 2, y + 4); ctx.lineTo(x + w / 2, y + h); ctx.closePath(); ink(ctx);
  slab(ctx, x - sw / 2 - 2, y + h + 6, sw + 4, 4, shade(GREY, 1.05));
  if (s.daylight > 0.15) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y, 0, FLOOR + 40); g.addColorStop(0, rgba('#e8f0ff', 0.16 * s.daylight)); g.addColorStop(1, rgba('#e8f0ff', 0));
    fillPoly(ctx, [x - 3, y + h * 0.4, x + 3, y + h * 0.4, x + 34, FLOOR + 40, x + 14, FLOOR + 40], g);
    ctx.restore();
    pool(s, x + 16, y + h, 90, '#c8d8f0', 0.55 * s.daylight);
  }
}

/** A door in the round wall: oak boards under a pointed arch, strap hinges, a ring, a step. Foot on y. */
function door(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number): void {
  const arch = (g: number): void => { ctx.beginPath(); ctx.moveTo(x - g, y); ctx.lineTo(x - g, y - h + w * 0.5); ctx.quadraticCurveTo(x - g, y - h - g, x + w / 2, y - h - w * 0.15 - g); ctx.quadraticCurveTo(x + w + g, y - h - g, x + w + g, y - h + w * 0.5); ctx.lineTo(x + w + g, y); ctx.closePath(); };
  arch(6); ctx.fillStyle = shade(GREY, 0.95); ctx.fill(); ink(ctx);
  for (let i = 0; i < 7; i++) { const u = i / 6, a = Math.PI + u * Math.PI; line(ctx, [x + w / 2 + Math.cos(a) * (w / 2 + 1), y - h + w * 0.4 + Math.sin(a) * w * 0.55, x + w / 2 + Math.cos(a) * (w / 2 + 6), y - h + w * 0.4 + Math.sin(a) * w * 0.62], rgba('#120c14', 0.6), 1); }
  arch(0); ctx.save(); ctx.clip();
  planks(ctx, x, y - h - w, w, h + w, OAK, 4, true, seed);
  const dk = ctx.createLinearGradient(0, y - h, 0, y); dk.addColorStop(0, rgba('#0a0608', 0.45)); dk.addColorStop(1, rgba('#0a0608', 0.1));
  ctx.fillStyle = dk; ctx.fillRect(x, y - h - w, w, h + w);
  for (const hy of [y - h * 0.75, y - h * 0.25]) { ctx.fillStyle = IRON; ctx.fillRect(x, Math.round(hy), Math.round(w * 0.7), 3); for (let i = 0; i < 4; i++) glossBall(ctx, K, x + 3 + i * w * 0.18, hy + 1.5, 1.2, '#6a6872', {}); }
  ctx.restore();
  arch(0); ink(ctx);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x + w * 0.78, y - h * 0.48, 3.5, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 1.2; ctx.stroke();
  slab(ctx, x - 8, y - 2, w + 16, 5, shade(GREY, 0.9));
}

/**
 * The wall of scrolls: pigeonholes in a deep oak frame, each with its rolls end-on, the oldest
 * gone brown, the odd one tagged with a seal on a cord. From the floor at y up to `top`.
 */
function scrollWall(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, y: number): void {
  slab(ctx, x, top, w, y - top, shade(OAK, 0.7), { lit: 2, dark: 0.08 });
  const cols = 5, rows = 7, cw = (w - 6) / cols, rh = (y - top - 14) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = x + 3 + c * cw, cy = top + 8 + r * rh;
    ctx.fillStyle = '#140e0a'; ctx.fillRect(Math.round(cx + 1), Math.round(cy + 1), Math.round(cw - 2), Math.round(rh - 2));
    const n = 2 + Math.floor(rnd(35, r, c) * 4);
    for (let i = 0; i < n; i++) {
      const sr = 2.6 + rnd(36, r, c, i) * 1.2, sx = cx + 4 + (i % 3) * (cw - 8) / 2.2 + rnd(37, r, c, i) * 2, sy = cy + rh - sr - 2 - Math.floor(i / 3) * sr * 1.8;
      const paper = rnd(38, r, c, i) < 0.4 ? '#b89a6a' : rnd(38, r, c, i) < 0.75 ? '#d8c8a0' : '#e8dcc0';
      glossBall(ctx, K, sx, sy, sr, paper, { gloss: 0.1 });
      ctx.strokeStyle = rgba(shade(paper, 0.6), 0.9); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(sx, sy, sr * 0.45, 0, Math.PI * 1.5); ctx.stroke();
      if (rnd(39, r, c, i) < 0.12) { line(ctx, [sx, sy + sr, sx + 1, sy + sr + 4], '#6a2a2a', 1); glossBall(ctx, K, sx + 1, sy + sr + 5, 1.6, '#9a2a2a', {}); }
    }
    beam(ctx, cx - 1, cy + rh - 2, cw + 2, 3, OAK, r * 7 + c);
  }
  beam(ctx, x - 3, top - 4, w + 6, 8, OAK, 41);
}

/**
 * The great lamp's winding gear: a drum on an oak frame with its crank, the chains wound on it
 * running up through the ring in the vault to the lamp above, a counterweight on the slack side.
 * Foot on the floor at y.
 */
function windlass(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number): void {
  // The ring in the vault, the lamp's glow coming down through it.
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, x, 6, 50, '#ffc870', 0.3); ctx.restore();
  glossEllipse(ctx, K, x, 6, 30, 8, '#2a1a10', 0, {});
  ctx.beginPath(); ctx.ellipse(x, 6, 24, 5, 0, 0, Math.PI * 2); ctx.fillStyle = '#c89a58'; ctx.fill();
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, 6, 30, 8, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = shade(IRON, 1.4); ctx.lineWidth = 1.5; ctx.stroke();
  s.lights.push({ k: 'glow', x, y: 6, r: 26, color: '#ffc860', a: 0.3 });
  pool(s, x, 30, 140, '#ffc878', 0.45);
  // The frame: two posts and a crosstree, pegged.
  const top = y - 92, dy = y - 70;
  for (const px of [x - 30, x + 26]) { beam(ctx, px, top, 8, y - top, OAK, px); }
  beam(ctx, x - 38, top - 6, 84, 8, OAK, 43);
  for (const [px, d] of [[x - 22, 1], [x + 26, -1]] as [number, number][]) { fillPoly(ctx, [px, top + 2, px + d * 12, top + 2, px, top + 14], shade(OAK, 0.8)); path(ctx, [px, top + 2, px + d * 12, top + 2, px, top + 14]); ink(ctx); }
  lanternRing(ctx, x, top - 2, 4, GOLD);
  // Chains from the crosstree up to the ring, and from the drum up to the crosstree's sheaves.
  for (const cx of [x - 8, x + 8]) {
    line(ctx, [cx, top - 6, cx, 12], '#120c14', 3);
    for (let cy = 14; cy < top - 6; cy += 5) { ctx.fillStyle = (cy / 5) % 2 ? shade(IRON, 1.5) : shade(IRON, 1.1); ctx.fillRect(Math.round(cx) - 1, Math.round(cy), 3, 3); }
    glossBall(ctx, K, cx, top - 2, 5, shade(IRON, 1.2), { gloss: 0.6 });
    line(ctx, [cx, top + 2, cx, dy - 9], '#120c14', 2.5);
    for (let cy = top + 4; cy < dy - 10; cy += 4) { ctx.fillStyle = shade(IRON, 1.4); ctx.fillRect(Math.round(cx) - 1, Math.round(cy), 2, 2); }
  }
  // The drum, wound with chain, and its crank.
  glossPoly(ctx, K, [x - 22, dy - 10, x + 22, dy - 10, x + 22, dy + 10, x - 22, dy + 10], OAK, { spread: 0.6 });
  for (let i = 0; i < 9; i++) line(ctx, [x - 20 + i * 5, dy - 10, x - 18 + i * 5, dy + 10], shade(IRON, 1.3), 2);
  for (const ex of [x - 22, x + 22]) { glossEllipse(ctx, K, ex, dy, 4, 13, shade(OAK, 1.1), 0, {}); }
  line(ctx, [x + 30, dy, x + 44, dy + 12], '#120c14', 4); line(ctx, [x + 30, dy, x + 44, dy + 12], IRON, 2.5);
  line(ctx, [x + 44, dy + 12, x + 52, dy + 12], '#120c14', 5); line(ctx, [x + 44, dy + 12, x + 52, dy + 12], '#8a6a42', 3);
  // The pawl, and the counterweight on its own chain.
  glossPoly(ctx, K, [x - 34, dy - 16, x - 24, dy - 12, x - 26, dy - 8], IRON, {});
  line(ctx, [x - 46, top - 6, x - 46, y - 46], '#120c14', 2.5);
  for (let cy = top - 4; cy < y - 46; cy += 4) { ctx.fillStyle = shade(IRON, 1.3); ctx.fillRect(x - 47, Math.round(cy), 2, 2); }
  glossPoly(ctx, K, [x - 54, y - 46, x - 38, y - 46, x - 36, y - 22, x - 56, y - 22], shade(GREY, 0.8), { tex: 'cracks', seed: 44, amount: 0.4 });
  glossBall(ctx, K, x - 46, y - 47, 2.5, IRON, {});
  // A step for the winder, worn hollow.
  slab(ctx, x - 40, y - 6, 90, 8, shade(GREY, 0.95));
  ctx.fillStyle = rgba('#0a0608', 0.25); ctx.beginPath(); ctx.ellipse(x + 40, y - 3, 10, 2, 0, 0, Math.PI * 2); ctx.fill();
}

/**
 * The stair up the tower, climbing round the wall from the floor beside the gear to a dark mouth
 * in the vault. The great lamp's glow comes down it, strongest by night. From (x0, y0) on the floor
 * to (x1, y1) under the vault.
 */
function stair(ctx: CanvasRenderingContext2D, s: Stage, x0: number, y0: number, x1: number, y1: number, n: number): void {
  const dx = (x1 - x0) / n, dy = (y0 - y1) / n;
  // The mouth in the vault, and the lamp's light inside it.
  const mx = x1 + dx * 0.5, my = y1 - 6;
  const mouth = (g: number): void => { ctx.beginPath(); ctx.moveTo(mx - 20 - g, my + 30); ctx.lineTo(mx - 20 - g, my); ctx.quadraticCurveTo(mx, my - 26 - g, mx + 20 + g, my); ctx.lineTo(mx + 20 + g, my + 30); ctx.closePath(); };
  mouth(5); ctx.fillStyle = shade(GREY, 0.7); ctx.fill(); ink(ctx);
  mouth(0); ctx.fillStyle = '#140c08'; ctx.fill();
  ctx.save(); ctx.clip(); smudge(ctx, mx - 6, my - 6, 40, '#ffc060', s.daylight > 0.5 ? 0.45 : 0.85); ctx.restore();
  mouth(0); ink(ctx);
  // The mass under the steps, against the wall.
  const under = [x0, y0, x1 + dx, y1, x1 + dx, y0];
  fillPoly(ctx, under, shade(GREY, 0.62));
  ctx.save(); path(ctx, under); ctx.clip();
  for (let i = 0; i < 14; i++) for (let j = 0; j < 8; j++) { const bx = x0 + j * 14 + (i % 2) * 7, by = y1 + i * 14; ctx.strokeStyle = rgba('#120c14', 0.35); ctx.lineWidth = 1; ctx.strokeRect(Math.round(bx) + 0.5, Math.round(by) + 0.5, 14, 14); }
  const sh = ctx.createLinearGradient(x0, 0, x1, 0); sh.addColorStop(0, rgba('#0a0608', 0.1)); sh.addColorStop(1, rgba('#0a0608', 0.45));
  ctx.fillStyle = sh; ctx.fillRect(x0, y1, x1 - x0 + dx, y0 - y1);
  ctx.restore();
  // The steps, each tread worn hollow in the middle and lit from above.
  for (let i = n - 1; i >= 0; i--) {
    const sx = x0 + i * dx, sy = y0 - (i + 1) * dy;
    block(ctx, sx - 10, sy, dx + 22, dy, shade(GREY, 0.9 + (i / n) * 0.25), 60 + i);
    ctx.fillStyle = rgba('#0a0608', 0.2); ctx.beginPath(); ctx.ellipse(sx + dx * 0.4, sy + 2, dx * 0.9, 1.2, 0, 0, Math.PI * 2); ctx.fill();
  }
  // The rope rail pinned to the wall above the steps.
  const rail: number[] = []; for (let i = 0; i <= n; i++) rail.push(x0 + i * dx + 6, y0 - i * dy - 30);
  line(ctx, rail, '#120c14', 3); line(ctx, rail, '#a08058', 1.5);
  for (let i = 1; i < n; i += 3) glossBall(ctx, K, rail[i * 2], rail[i * 2 + 1], 1.8, IRON, {});
  // The glow coming down: the room's main light by night, a warmth by day.
  const night = s.daylight < 0.5;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(x1, y1, x0, y0); g.addColorStop(0, rgba('#ffc070', night ? 0.4 : 0.15)); g.addColorStop(1, rgba('#ffc070', 0));
  fillPoly(ctx, [x1 + dx * 1.5, y1 - 10, x1 - 10, y1 - 10, x0 - 20, y0, x0 + 30, y0 + 20], g);
  ctx.restore();
  s.lights.push({ k: 'glow', x: mx, y: my, r: 26, color: '#ffc060', a: 0.5 });
  pool(s, mx - 20, my + 30, night ? 260 : 150, '#ffb868', night ? 0.95 : 0.5);
  pool(s, (x0 + x1) / 2, (y0 + y1) / 2, 120, '#ffb868', night ? 0.6 : 0.25);
}

/** A reading stand for the floor: a lectern with a lantern on its ledge. */
function lampLectern(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  lectern(ctx, s, x, y, h, '#5a4230');
  lantern(ctx, s, x + h * 0.36, y - h * 1.22, h * 0.24, '#8a7040', null, 120);
}

export const WATCH_HALL: Scene = {
  ambient: ['#262430', '#7e8088'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    flagstones(ctx, FLOOR, 200, 110, '#6e6a60', 7, 53);
    // The round wall above the floor, its foot curving round toward the sides.
    const edge: number[] = [];
    for (let i = 0; i <= 40; i++) edge.push(i * 10, foot(i * 10));
    ctx.save(); path(ctx, [0, 0, ...edge, STAGE_W, 0]); ctx.clip();
    roundWall(ctx);
    ctx.restore();
    line(ctx, edge, '#120c14', 1.5);
    vault(ctx);
    // The slit windows high in the wall, east and west.
    slit(ctx, s, 112, 52, 46);
    slit(ctx, s, 300, 52, 46);
    // The prior's door on the left, the sister's on the right.
    door(ctx, 18, foot(30) - 2, 34, 88, 51);
    door(ctx, 348, foot(366) - 2, 34, 88, 52);
    lantern(ctx, s, 35, foot(30) - 108, 8, '#6a5a3a', null, 90);
    lantern(ctx, s, 365, foot(366) - 108, 8, '#6a5a3a', null, 90);
    // The scrolls, older than the tower above them, and the stair up to the lamp.
    scrollWall(ctx, 70, 108, 76, foot(108) + 2);
    stair(ctx, s, 262, foot(262) + 2, 330, 40, 11);
    windlass(ctx, s, 200, FLOOR + 6);
    // Moth dust in the lamp's light under the vault.
    s.lights.push({ k: 'motes', x: 150, y: 14, w: 100, h: 120, color: '#ffe8c0', n: 16, rise: -0.1 });
    // The lecterns across the front, a lantern on every one.
    lampLectern(ctx, s, 66, 250, 40);
    lampLectern(ctx, s, 140, 262, 44);
    lampLectern(ctx, s, 260, 262, 44);
    lampLectern(ctx, s, 334, 250, 40);
  },
};
