// Rime Lodge's inn, the hunters' and guides' common room: log walls, the great fire with a bear's
// skull over it and an ice bear's hide before it, the lodge's blankets drying on a rail for whoever
// comes up out of the loch, the long table and the yard's door, the ice through its glass and the
// snow coming in under it.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, INK, rnd, beam, planks, floorboards, line, fillPoly, path, ink, smudge, contact, slab, pool } from '../kit.ts';
import { K, hearth, cloth, tankard, cup, loaf, candle, lantern } from '../props.ts';
import { glossPoly, glossBall } from '../../monsters/gloss.ts';
import { LOG, SNOW, IRON, WOOL, STRIPE, WHITE_BEAR, logWall, pelt, frost, loch } from './lodge.ts';

const STONE = '#7a7670', BONE = '#e2d8c2', BOARD = '#7a6046', DARK = '#4a3a2c';
const FLOOR = 194;

/** Snow blown in under a door whose foot runs from x0 to x1 at y: a fan of it across the boards, `reach` deep, blue in its hollows. */
function drift(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, reach: number, seed: number): void {
  const w = x1 - x0, pts = [x0 + 2, y];
  for (let i = 0; i <= 10; i++) { const u = i / 10, a = Math.PI * u; pts.push(x0 + w / 2 - Math.cos(a) * (w * 0.62 + reach * 0.35), y + Math.sin(a) * reach * (0.8 + rnd(seed, i) * 0.3)); }
  pts.push(x1 - 2, y);
  const g = ctx.createLinearGradient(0, y, 0, y + reach);
  g.addColorStop(0, rgba(SNOW, 0.95)); g.addColorStop(0.45, rgba('#d8e4ee', 0.7)); g.addColorStop(1, rgba('#c0d0e0', 0.1));
  fillPoly(ctx, pts, g);
  ctx.save(); path(ctx, pts); ctx.clip();
  // Ripples the draught laid, and the hollows between them.
  for (let i = 0; i < 6; i++) {
    const r = reach * (0.2 + i * 0.14), arc: number[] = [];
    for (let k = 0; k <= 12; k++) { const a = Math.PI * (k / 12); arc.push(x0 + w / 2 - Math.cos(a) * (w * 0.5 + r * 0.3), y + Math.sin(a) * r); }
    line(ctx, arc, rgba('#8aa4c0', 0.35), 1);
  }
  ctx.restore();
  for (let i = 0; i < 10; i++) { ctx.fillStyle = rgba('#ffffff', 0.9); ctx.fillRect(Math.round(x0 + rnd(seed, i, 5) * w), Math.round(y + 1 + rnd(seed, i, 6) * reach * 0.6), 1, 1); }
}

/** A snowshoe hung by its toe from a peg at (x, y): a frame of bent ash `h` long, two bars across, laced with gut. */
function snowshoe(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, lean = 0): void {
  const w = h * 0.4;
  ctx.save(); ctx.translate(x, y); ctx.rotate(lean);
  const frame = (): void => { ctx.beginPath(); ctx.moveTo(0, h); ctx.bezierCurveTo(-w * 0.3, h * 0.7, -w * 0.56, h * 0.42, -w * 0.5, h * 0.2); ctx.bezierCurveTo(-w * 0.44, 0, w * 0.44, 0, w * 0.5, h * 0.2); ctx.bezierCurveTo(w * 0.56, h * 0.42, w * 0.3, h * 0.7, 0, h); ctx.closePath(); };
  frame(); ctx.save(); ctx.clip();
  for (let i = -6; i <= 6; i++) { line(ctx, [i * w * 0.16, 0, i * w * 0.16 + w * 0.6, h], rgba('#d8c8a0', 0.75), 1); line(ctx, [i * w * 0.16, 0, i * w * 0.16 - w * 0.6, h], rgba('#d8c8a0', 0.75), 1); }
  ctx.restore();
  frame(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.strokeStyle = '#a8865a'; ctx.lineWidth = 2.2; ctx.stroke();
  for (const f of [0.3, 0.56]) { const hw = w * (f < 0.4 ? 0.48 : 0.36); line(ctx, [-hw, h * f, hw, h * f], INK, 3); line(ctx, [-hw, h * f, hw, h * f], '#8a6a42', 1.6); }
  ctx.restore();
  ctx.fillStyle = INK; ctx.fillRect(Math.round(x) - 2, Math.round(y) - 3, 4, 4);
  ctx.fillStyle = '#5a4430'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 2, 2);
}

/** A bear's skull on a plaque, side on and facing left, centred on (x, y): the short deep muzzle, the crest along the crown, the great eye-tooth. */
function bearSkull(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
  const P = (pts: number[]): number[] => pts.map((v, i) => i % 2 ? y + v * s : x + v * s);
  const plaque = P([-0.9, -0.5, -0.7, -0.66, 0.7, -0.66, 0.95, -0.5, 0.95, 0.5, 0.7, 0.62, -0.7, 0.62, -0.9, 0.5]);
  glossPoly(ctx, K, plaque, DARK, { gloss: 0.15, spread: 0.7 });
  // The jaw first, under the skull: deep, its eye-tooth rising in front.
  glossPoly(ctx, K, P([-0.62, 0.16, 0.1, 0.2, 0.36, 0.14, 0.48, 0.28, 0.32, 0.42, -0.2, 0.42, -0.56, 0.32]), shade(BONE, 0.88), { gloss: 0.2 });
  glossPoly(ctx, K, P([-0.56, 0.24, -0.5, 0.0, -0.44, 0.22]), '#f4ecd8', { gloss: 0.4 });
  // The skull: a short deep muzzle, the brow, the dome and the crest along the crown, falling at the back.
  glossPoly(ctx, K, P([-0.68, 0.06, -0.68, -0.08, -0.36, -0.18, -0.08, -0.34, 0.24, -0.46, 0.56, -0.44, 0.76, -0.3, 0.8, -0.04, 0.7, 0.14, 0.36, 0.16, 0.14, 0.2, -0.3, 0.16, -0.6, 0.14]), BONE, { gloss: 0.25, spread: 0.7 });
  // The eye open behind into the hollow of the temple, the cheekbone's arch under both, the nose.
  fillPoly(ctx, P([-0.22, -0.06, -0.14, -0.2, 0.0, -0.22, 0.38, -0.27, 0.5, -0.12, 0.48, 0.0, -0.16, 0.03]), '#2a1e18');
  ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.ellipse(x - s * 0.1, y - s * 0.09, s * 0.12, s * 0.11, 0, 0, Math.PI * 2); ctx.fill();
  glossPoly(ctx, K, P([-0.2, 0.0, 0.5, -0.04, 0.52, 0.05, -0.16, 0.09]), shade(BONE, 0.95), { gloss: 0.2 });
  ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.ellipse(x - s * 0.64, y - s * 0.02, s * 0.035, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  line(ctx, P([-0.04, -0.36, 0.26, -0.47, 0.56, -0.45]), rgba('#ffffff', 0.55), 1);
  // The cheek teeth, and the great eye-tooth coming down over the jaw's.
  for (let i = 0; i < 4; i++) fillPoly(ctx, P([-0.24 + i * 0.13, 0.15, -0.2 + i * 0.13, 0.21, -0.14 + i * 0.13, 0.15]), '#f4ecd8');
  glossPoly(ctx, K, P([-0.5, 0.1, -0.44, 0.38, -0.38, 0.12]), '#f8f0dc', { gloss: 0.5 });
}

/** The lodge's blankets over a rail hung from the beam, drying by the fire: grey wool, a red stripe at each end. From x0 to x1 at y. */
function blanketRail(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, top: number): void {
  for (const px of [x0 + 4, x1 - 4]) line(ctx, [px, top, px, y], '#c8b890', 1);
  const w = (x1 - x0 - 10) / 2;
  for (let i = 0; i < 2; i++) {
    const bx = x0 + 4 + i * (w + 2), h = 54 + i * 8, col = shade(WOOL, 0.92 + i * 0.12);
    cloth(ctx, bx, bx + w, y, h, col, 7 + i);
    for (const f of [0.14, 0.8]) { ctx.fillStyle = STRIPE; ctx.fillRect(Math.round(bx + 2), Math.round(y + h * f), Math.round(w - 4), 3); }
    line(ctx, [bx + 3, y + h * 0.14 + 4, bx + w - 3, y + h * 0.14 + 4], rgba(shade(STRIPE, 0.7), 0.8), 1);
  }
  line(ctx, [x0 - 2, y, x1 + 2, y], '#120c14', 5); line(ctx, [x0 - 2, y, x1 + 2, y], '#8a6a42', 3);
}

/** The yard's door, foot on the floor: boards and strap hinges in a frame of squared logs, its glass on the ice, frost round the glass and snow under the foot. */
function yardDoor(ctx: CanvasRenderingContext2D, s: Stage, x: number, top: number, w: number): void {
  const h = FLOOR - top;
  ctx.fillStyle = '#120c14'; ctx.fillRect(x - 2, top - 2, w + 4, h + 2);
  planks(ctx, x, top, w, h, '#6a5238', 4, true, 431);
  const dk = ctx.createLinearGradient(0, top, 0, FLOOR); dk.addColorStop(0, rgba('#0a0608', 0.4)); dk.addColorStop(1, rgba('#0a0608', 0.05));
  ctx.fillStyle = dk; ctx.fillRect(x, top, w, h);
  for (const hy of [top + h * 0.2, top + h * 0.78]) { ctx.fillStyle = IRON; ctx.fillRect(x, Math.round(hy), Math.round(w * 0.8), 4); for (let i = 0; i < 4; i++) glossBall(ctx, K, x + 4 + i * w * 0.2, hy + 2, 1.3, '#6a6872', {}); }
  // The glass at eye height, the loch through it, the frost grown over its edges.
  const gx = x + w * 0.22, gy = top + h * 0.26, gw = w * 0.56, gh = h * 0.22;
  ctx.save(); ctx.beginPath(); ctx.rect(gx, gy, gw, gh); ctx.clip();
  loch(gx, gy, gw, gh, s, { at: 0.62, shore: 0.36, seed: 432, near: 0.5 })(ctx);
  frost(ctx, gx, gy, gw, gh, 433, 0.9);
  ctx.restore();
  ctx.fillStyle = '#2a2226'; ctx.fillRect(Math.round(gx + gw / 2) - 1, gy, 2, gh); ctx.fillRect(gx, Math.round(gy + gh / 2) - 1, gw, 2);
  path(ctx, [gx, gy, gx + gw, gy, gx + gw, gy + gh, gx, gy + gh]); ink(ctx);
  if (s.daylight > 0.15) pool(s, gx + gw / 2, gy + gh, 120, '#c8d8ec', 0.5 * s.daylight);
  // The latch, and the frame: squared logs, the lintel deep.
  glossPoly(ctx, K, [x + w * 0.82, top + h * 0.52, x + w * 0.96, top + h * 0.52, x + w * 0.96, top + h * 0.56, x + w * 0.82, top + h * 0.56], IRON, { gloss: 0.5 });
  for (const px of [x - 9, x + w]) beam(ctx, px, top, 9, h, shade(LOG, 0.9), px);
  beam(ctx, x - 12, top - 11, w + 24, 11, shade(LOG, 0.85), 434);
  // A light line of daylight or dark along the foot, where it does not meet the sill, and the drift.
  ctx.fillStyle = s.daylight > 0.3 ? rgba('#e8f0ff', 0.8) : rgba('#2a3448', 0.9); ctx.fillRect(x + 1, FLOOR - 2, w - 2, 2);
  drift(ctx, x, x + w, FLOOR, 22, 435);
}

/** The long table across the front, its near edge at y: one board deep and scarred, trestles going down past the stage's foot. */
function longTable(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, d: number): void {
  contact(ctx, (x0 + x1) / 2, y + 30, x1 - x0, 0.3);
  for (const lx of [x0 + 26, x1 - 34]) slab(ctx, lx, y + 6, 9, STAGE_H - y, shade(DARK, 0.9), { lit: 1, dark: 0.3 });
  slab(ctx, x0, y, x1 - x0, 7, shade(BOARD, 0.72), { lit: 1, dark: 0.35 });
  const top = [x0, y, x0 + d, y - d, x1 - d, y - d, x1, y];
  fillPoly(ctx, top, shade(BOARD, 1.12));
  ctx.save(); path(ctx, top); ctx.clip();
  line(ctx, [x0 + d * 0.5, y - d * 0.5, x1 - d * 0.5, y - d * 0.5], rgba(shade(BOARD, 0.6), 0.7), 1);
  for (let i = 0; i < 14; i++) { const sx = x0 + 18 + rnd(441, i) * (x1 - x0 - 36), sy = y - 2 - rnd(442, i) * (d - 3); line(ctx, [sx, sy, sx + 3 + rnd(443, i) * 7, sy - 1], rgba('#2a1a10', 0.4), 1); }
  ctx.restore();
  path(ctx, top); ink(ctx);
}

export const RIME_INN: Scene = {
  ambient: ['#262634', '#8c9098'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    logWall(ctx, 0, 22, STAGE_W, FLOOR - 22, 12, 421);
    floorboards(ctx, FLOOR, 200, 108, BOARD, 8, 422);
    planks(ctx, 0, 0, STAGE_W, 12, shade(DARK, 0.8), 1, false, 423);
    beam(ctx, 0, 10, STAGE_W, 13, DARK, 424);
    // The great fire on the left, the skull over its mantel; the blankets drying beside it.
    const fb = hearth(ctx, s, 20, 36, 160, FLOOR + 4, STONE, 425, { mantel: DARK, reach: 320 });
    bearSkull(ctx, 100, fb.y - fb.w * 0.36 - 30, 34);
    blanketRail(ctx, 192, 268, 92, 23);
    smudge(ctx, 100, FLOOR + 30, 120, '#ff9a48', 0.18);
    // The yard's door on the right, the keepers' lantern on its peg, the snowshoes beyond.
    yardDoor(ctx, s, 300, 66, 52);
    lantern(ctx, s, 282, 94, 9, '#3a3440', 84, 120);
    snowshoe(ctx, 370, 62, 58, 0.08);
    snowshoe(ctx, 388, 70, 52, -0.06);
    // An ice bear's hide on the boards before the fire, its head to the hearth.
    pelt(ctx, 100, 203, 124, 100, shade(WHITE_BEAR, 0.9), 444, { tail: 0.06, flat: 0.3 });
    // The long table, the day's bread and the bowls on it.
    longTable(ctx, 22, 378, 244, 14);
    loaf(ctx, 70, 238, 24);
    for (let i = 0; i < 5; i++) cup(ctx, 118 + i * 34, 240 - (i % 2) * 4, 13, '#7a5a34', true);
    tankard(ctx, 292, 240, 15, '#6a4a30', { band: '#2a1e18', foam: true });
    tankard(ctx, 330, 236, 14, '#8a8e96', { band: '#5a5e68' });
    candle(ctx, s, 250, 236, 11, '#efe4c8', s.daylight > 0.5 ? 90 : 150);
  },
};
