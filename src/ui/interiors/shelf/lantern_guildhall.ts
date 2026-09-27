// The Lantern Guildhall in Harrow: a scholars' room of books, instruments and the great map of
// Caldera.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Stage, Scene } from '../kit.ts';
import { rnd, beam, line, smudge, fillPoly, path, slab, pool, STAGE_W, STAGE_H, plaster, planks, flagstones } from '../kit.ts';
import { K, books, staff, candle, lantern, lanternRing, painting, counter, cloth } from '../props.ts';
import { glossPoly, glossBall, glossEllipse } from '../../monsters/gloss.ts';
import { drawText } from '../../../lib/engine/text.ts';
import { SPINES, bookcase, lectern } from '../guilds.ts';

const GOLD = '#d8b050';

/**
 * The great map of Caldera: a ring of land round the inland sea, the Hearth burning at the heart
 * of it, the Shelf and Thornmark marked, a compass rose in the corner. Painted into (x, y, w, h).
 */
function calderaMap(x: number, y: number, w: number, h: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 4, x + w / 2, y + h / 2, w * 0.7);
    g.addColorStop(0, '#efe2c0'); g.addColorStop(1, '#c8b088');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const cx = x + w / 2, cy = y + h / 2, R = Math.min(w, h) * 0.42;
    // The land: a lumpy ring, green on the Shelf, dark forest in Thornmark, grey in the north.
    const ring: number[] = [];
    for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2, r = R * (1 + (rnd(7, i) - 0.5) * 0.14); ring.push(cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r); }
    fillPoly(ctx, ring, '#9ab070');
    ctx.save(); path(ctx, ring); ctx.clip();
    fillPoly(ctx, [cx, cy, x + w, y, x + w, y + h], '#5a7a44');
    fillPoly(ctx, [cx, cy, x, y, x + w, y], '#a8a08a');
    ctx.restore();
    path(ctx, ring); ctx.strokeStyle = '#5a4a30'; ctx.lineWidth = 1; ctx.stroke();
    // The sea inside the ring, and the Hearth on its island.
    const sea: number[] = [];
    for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2, r = R * 0.55 * (1 + (rnd(8, i) - 0.5) * 0.18); sea.push(cx + Math.cos(a) * r * 1.25, cy + Math.sin(a) * r); }
    fillPoly(ctx, sea, '#6a9ac0'); path(ctx, sea); ctx.strokeStyle = '#3a5a7a'; ctx.stroke();
    for (let i = 0; i < 6; i++) line(ctx, [cx - R * 0.4 + i * 6, cy + R * 0.1 + (i % 2) * 4, cx - R * 0.36 + i * 6, cy + R * 0.1 + (i % 2) * 4], rgba('#ffffff', 0.5), 1);
    glossBall(ctx, K, cx, cy, 3, '#c8b070', {});
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, cx, cy, 12, '#ffd070', 0.8); ctx.restore();
    // Stones marked round the ring, and the rose.
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i / 5) * Math.PI * 2; ctx.fillStyle = '#8a2a2a'; ctx.fillRect(Math.round(cx + Math.cos(a) * R * 0.82 * 1.25) - 1, Math.round(cy + Math.sin(a) * R * 0.82) - 1, 3, 3); }
    const rx = x + w - 12, ry = y + 12;
    fillPoly(ctx, [rx, ry - 8, rx + 2, ry, rx, ry + 8, rx - 2, ry], '#4a3a2a'); fillPoly(ctx, [rx - 8, ry, rx, ry - 2, rx + 8, ry, rx, ry + 2], '#4a3a2a');
    drawText(ctx, 'CALDERA', x + 6, y + h - 12, { size: 1, color: '#5a4a30', shadow: false });
  };
}

/**
 * An armillary on its stand, foot on y: brass rings round a glowing core, the Hearth as the
 * Lanterns model it. The core is a Light, so it breathes.
 */
function armillary(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, r: number): void {
  glossPoly(ctx, K, [x - r * 0.7, y, x - r * 0.4, y - r * 0.3, x + r * 0.4, y - r * 0.3, x + r * 0.7, y], shade(GOLD, 0.8), { gloss: 0.5 });
  glossPoly(ctx, K, [x - r * 0.1, y - r * 0.3, x - r * 0.08, y - r * 1.2, x + r * 0.08, y - r * 1.2, x + r * 0.1, y - r * 0.3], GOLD, { gloss: 0.5 });
  const cy = y - r * 2.1;
  glossBall(ctx, K, cx(), cy, r * 0.22, '#fff0c0', { gloss: 0.8 });
  for (const [rx, ry, rot] of [[r, r, 0], [r, r * 0.35, 0.2], [r * 0.35, r, -0.1], [r * 0.95, r * 0.5, -0.9]] as [number, number, number][]) {
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(x, cy, rx, ry, rot, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.8; ctx.stroke();
  }
  s.lights.push({ k: 'glow', x, y: cy, r: r * 1.3, color: '#ffc860', a: 0.5 });
  pool(s, x, cy, r * 6, '#ffd890', 0.7);
  function cx(): number { return x; }
}

/** A stand of survey wands, the Lanterns' instruments: rods with crystal heads that glow faintly. Foot on y. */
function wandRack(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, n: number): void {
  slab(ctx, x - n * 6 - 4, y - 10, n * 12 + 8, 10, '#5a3a24', { lit: 1 });
  for (let i = 0; i < n; i++) {
    const wx = x - n * 6 + 6 + i * 12, len = 50 + rnd(9, i) * 14;
    staff(ctx, wx, y - 6, len, i % 2 ? '#e8e0d0' : '#8a6a42', '#9ae0ff');
    s.lights.push({ k: 'glow', x: wx, y: y - 6 - len - 4, r: 8, color: '#8ad8ff', a: 0.45 });
  }
}

const WALNUT = '#5a3a26', INDIGO = '#3a4070';

export const GUILDHALL: Scene = {
  ambient: ['#2e2c44', '#8a8898'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 210;
    plaster(ctx, 0, 0, STAGE_W, FLOOR, INDIGO, 101);
    // A painted frieze of the order's rings along the top of the wall.
    ctx.fillStyle = shade(INDIGO, 0.75); ctx.fillRect(0, 22, STAGE_W, 14);
    for (let i = 0; i < 13; i++) lanternRing(ctx, 16 + i * 31, 29, 4, GOLD);
    beam(ctx, 0, 36, STAGE_W, 4, WALNUT, 102);
    planks(ctx, 0, 0, STAGE_W, 22, shade(WALNUT, 0.8), 1, false, 103);
    // Oak panelling to the dado, the floor in checked stone.
    planks(ctx, 0, 150, STAGE_W, FLOOR - 150, WALNUT, 14, true, 104);
    beam(ctx, 0, 146, STAGE_W, 6, WALNUT, 105);
    flagstones(ctx, FLOOR, 200, 104, '#8a8278', 6, 106);
    // Bookcases up both walls.
    bookcase(ctx, 6, 40, 92, FLOOR, WALNUT, 1, 5);
    bookcase(ctx, 302, 40, 92, FLOOR, WALNUT, 2, 5);
    // A library ladder against the left one.
    line(ctx, [72, FLOOR, 90, 48], '#120c14', 5); line(ctx, [96, FLOOR, 112, 48], '#120c14', 5);
    line(ctx, [72, FLOOR, 90, 48], '#8a6a42', 3); line(ctx, [96, FLOOR, 112, 48], '#8a6a42', 3);
    for (let i = 1; i < 8; i++) { const t = i / 8; line(ctx, [72 + 18 * t, FLOOR - (FLOOR - 48) * t, 96 + 16 * t, FLOOR - (FLOOR - 48) * t], '#8a6a42', 2); }
    // The great map of Caldera between them, over the table.
    painting(ctx, 128, 50, 144, 86, calderaMap(128, 50, 144, 86), '#b8902e');
    // The model of the Hearth on its stand, and the survey wands in theirs.
    armillary(ctx, s, 122, FLOOR, 22);
    wandRack(ctx, s, 286, FLOOR, 4);
    lantern(ctx, s, 200, 18, 11, GOLD, 0, 170);
    // Wisps: loose light drifting under the ceiling.
    s.lights.push({ k: 'motes', x: 110, y: 40, w: 180, h: 110, color: '#c8e8ff', n: 18, rise: 0.12 });
    // The reading table across the front: open books, scrolls, the inkpot.
    counter(ctx, 104, 296, 196, 10, STAGE_H, WALNUT, 107, { panels: 3, trim: GOLD });
    cloth(ctx, 150, 250, 200, 16, '#6a2a3a', 5);
    lectern(ctx, s, 200, 206, 22, WALNUT);
    for (const [sx, sw] of [[128, 20], [262, 16]] as [number, number][]) { glossEllipse(ctx, K, sx, 202, sw / 2, 3, '#e8dcc0', 0, {}); ctx.fillStyle = '#c8b890'; ctx.fillRect(sx - sw / 2, 199, 2, 6); ctx.fillRect(sx + sw / 2 - 2, 199, 2, 6); }
    books(ctx, 232, 205, 20, 9, 11, SPINES);
    candle(ctx, s, 150, 206, 13, '#f0e8d0', 110);
    candle(ctx, s, 276, 206, 11, '#f0e8d0', 90);
  },
};
