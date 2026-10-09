// Cinderport's armourer, the smith's: a cinder drake's hide laced out on its frame to cure, and the
// Drakeskin Coat made of the last one on its stand; the Basalt Shield on the wall; the Flamberge with
// its waved blade, the Slag Mace, a Battle Staff and the Ashwood Bow in the rack; the forge in the
// back wall under its hood, the anvil before it, its coals the room's light by night.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, beam, flagstones, line, fillPoly, contact, slab, path, reversed, pool, stones } from '../kit.ts';
import { K, shield, staff, bow, anvil } from '../props.ts';
import { armsRack } from '../yards.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { TIMBER, IRON, basaltWall, ashDust } from './basalt.ts';

const FLOOR = 200, DRAKE = '#6a2c22', STEEL = '#c4c8d0', HILT = '#8a6a3a', HEMP = '#c8b080';

/** Scales over what is clipped: rows of small arcs, each shadowed under its rim and lit along it. From (x, y), w by h, `sz` across. */
function scales(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, sz: number, col: string): void {
  for (let r = 0; r * sz * 0.6 < h + sz; r++) for (let c = -1; c * sz < w + sz; c++) {
    const cx = x + c * sz + (r % 2) * sz / 2, cy = y + r * sz * 0.6;
    ctx.beginPath(); ctx.arc(cx, cy, sz / 2, 0.15 * Math.PI, 0.85 * Math.PI); ctx.strokeStyle = rgba(shade(col, 0.45), 0.85); ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy - 1, sz / 2, 0.3 * Math.PI, 0.7 * Math.PI); ctx.strokeStyle = rgba(shade(col, 1.6), 0.45); ctx.stroke();
  }
}

/** A cinder drake's hide laced out on a square frame of poles to cure, the frame hung by a cord from a peg: (x, y) the frame's top left, w its side. */
function hideFrame(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const cx = x + w / 2, cy = y + w / 2, at = (u: number, v: number): [number, number] => [cx + u * w * 0.5, cy + v * w * 0.5];
  line(ctx, [x + 6, y + 2, cx, y - 16, x + w - 6, y + 2], HEMP, 1.2);
  glossBall(ctx, K, cx, y - 17, 3, TIMBER, {});
  for (const [a, b] of [[[x - 4, y + 2], [x + w + 4, y + 2]], [[x - 4, y + w - 2], [x + w + 4, y + w - 2]], [[x + 2, y - 4], [x + 2, y + w + 4]], [[x + w - 2, y - 4], [x + w - 2, y + w + 4]]] as [number, number][][]) {
    line(ctx, [...a, ...b], '#120c14', 5); line(ctx, [...a, ...b], shade(TIMBER, 1.2), 3);
  }
  const half: [number, number][] = [[0, -0.9], [0.1, -0.84], [0.12, -0.58], [0.3, -0.5], [0.8, -0.8], [0.84, -0.72], [0.42, -0.3], [0.36, 0.26], [0.8, 0.74], [0.74, 0.82], [0.3, 0.52], [0.1, 0.62], [0.05, 0.94], [0, 0.98]];
  const pts: number[] = [];
  for (const [u, v] of half) pts.push(...at(u, v));
  for (let i = half.length - 2; i > 0; i--) pts.push(...at(-half[i][0], half[i][1]));
  // The lacing, from the hide's edge out to the poles.
  for (const [u, v, pu, pv] of [[0.8, -0.8, 0.96, -0.96], [0.42, -0.3, 0.96, -0.3], [0.36, 0.26, 0.96, 0.26], [0.8, 0.74, 0.96, 0.96], [0.1, -0.84, 0.1, -0.96], [0.05, 0.94, 0.05, 0.96]]) for (const sd of [-1, 1]) line(ctx, [...at(sd * u, v), ...at(sd * pu, pv)], HEMP, 1);
  glossPoly(ctx, K, pts, DRAKE, { gloss: 0.15, spread: 0.8 });
  ctx.save(); path(ctx, pts); ctx.clip(); scales(ctx, x, y, w, w, 6, DRAKE); ctx.restore();
  line(ctx, [...at(0, -0.8), ...at(0, 0.9)], rgba('#2a0e0a', 0.6), 3);
}

/** The Drakeskin Coat on its stand, the floor at y: a post on a cross foot, the coat hung from the yoke at its shoulders to the knee, scaled, a high collar. */
function coatStand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  contact(ctx, x, y, h * 0.4, 0.5);
  for (const sd of [-1, 1]) { line(ctx, [x - sd * h * 0.16, y, x + sd * h * 0.16, y - 4], '#120c14', 5); line(ctx, [x - sd * h * 0.16, y, x + sd * h * 0.16, y - 4], TIMBER, 3); }
  line(ctx, [x, y - 2, x, y - h], '#120c14', 5); line(ctx, [x, y - 2, x, y - h], TIMBER, 3);
  const top = y - h + 10, hem = y - h * 0.2;
  for (const sd of [-1, 1]) glossPoly(ctx, K, [x + sd * h * 0.17, top + 4, x + sd * h * 0.25, top + 14, x + sd * h * 0.27, top + h * 0.42, x + sd * h * 0.19, top + h * 0.42, x + sd * h * 0.15, top + 18], shade(DRAKE, 0.85), { gloss: 0.2 });
  const coat = [x - h * 0.17, top + 2, x - h * 0.06, top - 2, x + h * 0.06, top - 2, x + h * 0.17, top + 2, x + h * 0.16, top + h * 0.3, x + h * 0.22, hem, x - h * 0.22, hem, x - h * 0.16, top + h * 0.3];
  glossPoly(ctx, K, coat, DRAKE, { gloss: 0.25, spread: 0.7 });
  ctx.save(); path(ctx, coat); ctx.clip(); scales(ctx, x - h * 0.25, top, h * 0.5, hem - top, 5, DRAKE); ctx.restore();
  line(ctx, [x, top + 2, x + 1, hem], '#2a0e0a', 1.5);
  glossPoly(ctx, K, [x - h * 0.08, top - 2, x - h * 0.1, top - 10, x, top - 4, x + h * 0.1, top - 10, x + h * 0.08, top - 2], shade(DRAKE, 0.7), { gloss: 0.2 });
  line(ctx, [x - h * 0.16, top + h * 0.34, x + h * 0.16, top + h * 0.34], '#2a1a14', 3);
  glossBall(ctx, K, x, top + h * 0.34, 2.5, '#b08a40', { gloss: 0.7 });
}

/** The Flamberge, point up, its pommel at (x, y): a long grip, a broad guard and the blade's edges waved the length of it. */
function flamberge(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  const grip = len * 0.24, g = y - grip, w = Math.max(2.4, len * 0.034), left: number[] = [], right: number[] = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14, by = g - 3 - t * (len - grip - 6), ww = w * (1 - t * 0.5) + Math.sin(t * Math.PI * 7) * w * 0.4 * (1 - t * 0.7); left.push(x - ww, by); right.push(x + ww, by); }
  glossPoly(ctx, K, [...left, x, y - len, ...reversed(right)], STEEL, { gloss: 0.6, spread: 0.6 });
  line(ctx, [x, g - 6, x, y - len * 0.6], rgba('#6a6e78', 0.8), 1);
  glossPoly(ctx, K, [x - w * 0.7, y, x - w * 0.7, g, x + w * 0.7, g, x + w * 0.7, y], '#3a2a20', { spread: 0.7 });
  glossPoly(ctx, K, [x - w * 4, g + 2, x - w * 4.2, g - 3, x + w * 4.2, g - 3, x + w * 4, g + 2], HILT, { gloss: 0.5 });
  glossBall(ctx, K, x, y + 1, w * 1.2, HILT, { gloss: 0.6 });
}

/** The Slag Mace, its haft's foot at (x, y): an ash haft bound in iron, the head a lump of the forge's slag, glassy black-green and pitted. */
function slagMace(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  line(ctx, [x, y, x, y - len * 0.8], '#120c14', 5); line(ctx, [x, y, x, y - len * 0.8], '#b8a07a', 3);
  for (const f of [0.05, 0.35]) line(ctx, [x - 2.5, y - len * f, x + 2.5, y - len * f], IRON, 2);
  const cy = y - len * 0.86, r = len * 0.13;
  glossPoly(ctx, K, [x - r, cy + r * 0.3, x - r * 0.9, cy - r * 0.6, x - r * 0.2, cy - r * 1.1, x + r * 0.7, cy - r * 0.8, x + r * 1.05, cy, x + r * 0.6, cy + r * 0.9, x - r * 0.4, cy + r * 0.95], '#2e3a36', { gloss: 0.8, spread: 0.5, tex: 'stipple', seed: 571, amount: 0.5 });
  for (const [u, v] of [[-0.4, -0.4], [0.3, 0.1], [-0.1, 0.5]]) { ctx.fillStyle = rgba('#a8d0c0', 0.7); ctx.fillRect(Math.round(x + u * r), Math.round(cy + v * r), 1, 1); }
}

/** The forge, the floor at y, from x across w: a hearth of basalt to the waist, its coals in the pot, the iron hood over it going up into the flue, the bellows at its side. */
function forge(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  const top = y - 48, hood = top - 40;
  slab(ctx, x + w * 0.34, 13, w * 0.32, hood - 54, shade(IRON, 1.1), { lit: 1, dark: 0.3 });
  glossPoly(ctx, K, [x - 4, hood, x + w + 4, hood, x + w * 0.66, hood - 56, x + w * 0.34, hood - 56], IRON, { gloss: 0.3, spread: 0.8 });
  line(ctx, [x - 4, hood - 1, x + w + 4, hood - 1], rgba('#8a8a94', 0.6), 1);
  stones(ctx, x, top, w, y - top, '#55535a', 3, 572);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1.5; ctx.strokeRect(x, top, w, y - top);
  slab(ctx, x - 3, top - 4, w + 6, 6, '#5e5c62', { lit: 1 });
  glossEllipse(ctx, K, x + w * 0.45, top - 3, w * 0.26, 5, '#3a1a10', 0, { tex: 'stipple', seed: 573, amount: 0.6 });
  s.lights.push({ k: 'fire', x: x + w * 0.45, y: top - 3, w: w * 0.36, h: 16 });
  s.lights.push({ k: 'motes', x: x + w * 0.3, y: hood + 4, w: w * 0.3, h: top - hood - 8, color: '#ffb050', n: 6, rise: 0.6 });
  pool(s, x + w * 0.45, top - 10, 330, '#ff9048', 0.9);
  // The bellows on its frame at the side, its nose into the hearth.
  const bx = x + w - 2, by = top - 6;
  glossPoly(ctx, K, [bx - 22, by - 8, bx - 2, by - 14, bx + 2, by - 2, bx - 22, by + 2], '#5a3a26', { gloss: 0.2 });
  line(ctx, [bx - 22, by - 3, bx - 30, by - 2], IRON, 2);
  line(ctx, [bx, by - 14, bx + 8, by - 22], '#120c14', 3); line(ctx, [bx, by - 14, bx + 8, by - 22], TIMBER, 1.5);
}

export const CINDERPORT_ARMOURER: Scene = {
  ambient: ['#221e22', '#6e6a6c'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    basaltWall(ctx, 0, 12, STAGE_W, FLOOR - 12, 9, 574);
    ashDust(ctx, 0, FLOOR - 24, STAGE_W, 24, 575, 0.3);
    flagstones(ctx, FLOOR, 200, 100, '#4e4c52', 6, 576);
    beam(ctx, 0, 0, STAGE_W, 13, shade(TIMBER, 0.8), 577);
    // The hide on its frame, curing; the Basalt Shield on the wall.
    hideFrame(ctx, 20, 44, 96);
    shield(ctx, 186, 62, 22, '#3c3a42', 'round');
    // The rack: the Flamberge, the Slag Mace, a Battle Staff and the Ashwood Bow.
    armsRack(ctx, 146, FLOOR + 8, 82, 62, TIMBER);
    flamberge(ctx, 158, FLOOR + 6, 104);
    slagMace(ctx, 180, FLOOR + 6, 66);
    staff(ctx, 200, FLOOR + 6, 112, '#5a4a3a');
    bow(ctx, 224, FLOOR + 6, 96, '#d0bc94');
    // The forge at the back, the anvil before it; the coat on its stand.
    forge(ctx, s, 300, FLOOR, 92);
    coatStand(ctx, 262, FLOOR + 36, 124);
    anvil(ctx, 336, FLOOR + 46, 48);
    fillPoly(ctx, [300, FLOOR + 52, 312, FLOOR + 50, 314, FLOOR + 53, 302, FLOOR + 55], IRON);
  },
};
