// The Lanterns' guilds, where casters buy their spells: the Guildhall in Harrow, a scholars' room
// of books, instruments and the great map of Caldera, and the Lantern Hall in Thornhold, a hall of
// living wood round a copy of the Grove Stone whose runes still burn.
import { shade, rgba } from '../../lib/art/palettes.ts';
import type { Scene, Stage } from './kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, planks, flagstones, windowIn, forestFill, line, smudge, fillPoly, path, slab, contact, pool, trunk } from './kit.ts';
import { K, books, candle, lantern, lanternRing, painting, counter, jar, staff, cloth } from './props.ts';
import { glossPoly, glossEllipse, glossBall } from '../monsters/gloss.ts';
import { drawText } from '../../lib/engine/text.ts';

const GOLD = '#d8b050';
const SPINES = ['#6a2a2a', '#2a3a6a', '#2a5a3a', '#6a5a2a', '#4a2a5a', '#8a6a3a', '#3a3a3a', '#7a3a1a'];

/** A bookcase from the floor at y up to `top`: shelves packed with books, a cornice on top. */
function bookcase(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, y: number, wood: string, seed: number, shelves = 5): void {
  slab(ctx, x, top, w, y - top, shade(wood, 0.6), { lit: 2, dark: 0.08 });
  const inner = x + 4, iw = w - 8, sh = (y - top - 14) / shelves;
  for (let i = 0; i < shelves; i++) {
    const sy = top + 10 + (i + 1) * sh;
    ctx.fillStyle = '#1a1210'; ctx.fillRect(inner, sy - sh + 3, iw, sh - 3);
    books(ctx, inner + 1, sy, iw - 2, sh - 5, seed * 13 + i, SPINES);
    beam(ctx, x + 2, sy, w - 4, 4, wood, seed + i);
  }
  beam(ctx, x - 3, top, w + 6, 8, wood, seed + 9);
  slab(ctx, x - 2, y - 6, w + 4, 6, shade(wood, 0.9));
}

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

/** A lectern, foot on y, an open book on its slope; `glow` makes the book's runes shine. */
function lectern(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number, wood: string, glow?: string): void {
  contact(ctx, x, y, h * 0.6);
  glossPoly(ctx, K, [x - h * 0.3, y, x - h * 0.14, y - h * 0.1, x + h * 0.14, y - h * 0.1, x + h * 0.3, y], wood, {});
  glossPoly(ctx, K, [x - h * 0.08, y - h * 0.1, x - h * 0.06, y - h * 0.78, x + h * 0.06, y - h * 0.78, x + h * 0.08, y - h * 0.1], wood, { spread: 0.7 });
  glossPoly(ctx, K, [x - h * 0.42, y - h * 0.74, x + h * 0.42, y - h * 0.74, x + h * 0.34, y - h * 0.98, x - h * 0.34, y - h * 0.98], shade(wood, 1.1), {});
  // The book, open.
  glossPoly(ctx, K, [x - h * 0.4, y - h * 0.78, x - h * 0.02, y - h * 0.8, x - h * 0.02, y - h * 1.02, x - h * 0.34, y - h * 1.0], '#f0e8d4', {});
  glossPoly(ctx, K, [x + h * 0.02, y - h * 0.8, x + h * 0.4, y - h * 0.78, x + h * 0.34, y - h * 1.0, x + h * 0.02, y - h * 1.02], '#e8e0c8', {});
  for (let i = 0; i < 4; i++) {
    const ly = y - h * (0.86 + i * 0.035);
    line(ctx, [x - h * 0.32, ly, x - h * 0.08, ly - 1], glow ?? rgba('#3a2a30', 0.55), 1);
    line(ctx, [x + h * 0.08, ly - 1, x + h * 0.32, ly], glow ?? rgba('#3a2a30', 0.55), 1);
  }
  if (glow) s.lights.push({ k: 'glow', x, y: y - h * 0.9, r: h * 0.45, color: glow, a: 0.4 });
}

// ------------------------------------------------------------------ the Lantern Guildhall ----

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

// ------------------------------------------------------------------ the Thornhold Lantern Hall ----

const BARK = '#5e4a36', RUNE = '#6affc8';

/**
 * A copy of the Grove Stone the Lanterns keep to study: a tall standing stone on a round dais, cut
 * with the Underdeep's runes, which glow. Foot on y.
 */
function wardstone(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  glossEllipse(ctx, K, x, y, h * 0.55, h * 0.1, '#6a6a60', 0, {});
  glossEllipse(ctx, K, x, y - h * 0.05, h * 0.42, h * 0.08, '#7a7a70', 0, {});
  const w = h * 0.28, pts = [x - w * 0.5, y - h * 0.06, x - w * 0.6, y - h * 0.6, x - w * 0.4, y - h * 0.95, x - w * 0.05, y - h, x + w * 0.35, y - h * 0.94, x + w * 0.55, y - h * 0.62, x + w * 0.5, y - h * 0.06];
  glossPoly(ctx, K, pts, '#8a8a80', { spread: 0.7, h: 120, tex: 'cracks', seed: 5, amount: 0.5 });
  // Runes in two columns down its face, each on its own glow.
  for (let i = 0; i < 7; i++) for (const c of [-1, 1]) {
    const rx = x + c * w * 0.2, ry = y - h * (0.2 + i * 0.1), g = w * 0.1;
    line(ctx, i % 2 ? [rx - g, ry + g, rx, ry - g, rx + g, ry + g] : [rx - g, ry - g, rx + g, ry - g, rx, ry + g, rx - g, ry - g], RUNE, 1.2);
  }
  s.lights.push({ k: 'glow', x, y: y - h * 0.5, r: h * 0.55, color: '#40e0a0', a: 0.35 });
  pool(s, x, y - h * 0.5, h * 1.8, '#80ffc8', 0.55);
}

export const LANTERN_HALL: Scene = {
  ambient: ['#243034', '#84988e'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 214;
    ctx.fillStyle = '#1e1a16'; ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    // Tall pointed windows onto the forest between the trunks.
    for (const wx of [40, 150, 250, 360]) {
      const w = 52, top = 34, bottom = 170;
      windowIn(ctx, s, wx - w / 2, top, w, bottom - top, '#6a5a3e', { arched: true, panes: [2, 4], view: (c) => forestFill(c, wx - w / 2, top, w, bottom - top, s.daylight, wx) });
    }
    flagstones(ctx, FLOOR, 200, 110, '#7a786a', 7, 111);
    // Bookshelves grown into the lower walls.
    for (const [bx, bw] of [[0, 70], [330, 70]] as [number, number][]) { bookcase(ctx, bx, 176, bw, FLOOR, '#6a5238', bx + 3, 1); }
    // The trunks: pillars that rise and meet overhead in pointed arches.
    for (const [x0, lean] of [[96, 1], [304, -1], [0, 1], [400, -1]] as [number, number][]) {
      trunk(ctx, [x0, FLOOR + 4, x0 + lean * 2, 140, x0 + lean * 8, 70, x0 + lean * 40, 20, x0 + lean * 90, -10], x0 === 0 || x0 === 400 ? 24 : 14, 7, BARK, x0 + 7);
    }
    // The great lantern: an orb of light caged in branches, hung over the stone.
    for (let i = 0; i < 3; i++) line(ctx, [200 + (i - 1) * 16, 0, 200, 42], '#3a2e22', 2);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, 200, 60, 40, '#ffe0a0', 0.6); ctx.restore();
    glossBall(ctx, K, 200, 60, 13, '#fff0c8', { gloss: 0.9 });
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI; ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(200, 60, 17 * Math.abs(Math.cos(a)) + 0.5, 17, 0, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 2; ctx.stroke(); }
    s.lights.push({ k: 'glow', x: 200, y: 60, r: 36, color: '#ffd080', a: 0.45 });
    pool(s, 200, 70, 230, '#ffd890', 0.85);
    // The stone on its dais, and its runes' light.
    wardstone(ctx, s, 200, FLOOR - 2, 116);
    s.lights.push({ k: 'motes', x: 120, y: 60, w: 160, h: 140, color: '#b8ffd8', n: 22, rise: 0.15 });
    // The reading desk across the front: a curved board of living wood, a book whose script burns.
    counter(ctx, 60, 340, 214, 10, STAGE_H, '#7a5a3a', 112, { panels: 4, trim: '#5ad0a0' });
    lectern(ctx, s, 118, 224, 26, '#6a4a30', RUNE);
    candle(ctx, s, 290, 224, 12, '#efe4c8', 90);
    books(ctx, 250, 223, 26, 9, 12, SPINES);
    jar(ctx, 320, 224, 10, 12, '#5a7a8a', '#3a4a5a');
  },
};

