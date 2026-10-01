// The Cartographers' map room in Saltmouth, the Guild's hall: pale plaster under north light, the
// great chart of Caldera ruled box by box on the wall, the plotting table under its lamp, charts
// rolled in their racks, a globe, and the Meridian journal under glass.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, floorboards, windowIn, skyFill, line, smudge, fillPoly, slab, pool, contact, path, clipRect } from '../kit.ts';
import { K, lantern, candle } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const PLASTER = '#dcd8cc', PINE = '#7a6448', INK = '#3a3040', PARCH = '#e8dcbc', RED = '#8a2c1a';

/** A closed outline of `n` points round (cx, cy), wobbled by seed: a coast as a hand draws it. */
function coast(cx: number, cy: number, rx: number, ry: number, n: number, seed: number, wobble: number): number[] {
  const pts: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, r = 1 + (rnd(seed, i) - 0.5) * wobble + Math.sin(a * 3 + seed) * wobble * 0.3;
    pts.push(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r);
  }
  return pts;
}

/**
 * The great chart: the land round the inland sea and the Hearth, inked and washed, ruled in the
 * survey's boxes. The boxes walked are drawn in; past them the reach is left blank, its edge dashed.
 */
function chart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 6, x + w / 2, y + h / 2, w * 0.7);
  g.addColorStop(0, PARCH); g.addColorStop(1, shade(PARCH, 0.82));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.save(); clipRect(ctx, x, y, w, h);
  const cx = x + w * 0.5, cy = y + h * 0.52;
  // The land, washed pale green, and the sea in it.
  const land = coast(cx, cy, w * 0.44, h * 0.42, 48, 371, 0.16);
  fillPoly(ctx, land, '#c8cca0'); path(ctx, land); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
  const sea = coast(cx, cy, w * 0.2, h * 0.18, 30, 372, 0.22);
  fillPoly(ctx, sea, '#a8c0c4'); path(ctx, sea); ctx.stroke();
  for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let k = 0; k < sea.length; k += 2) { const px = cx + (sea[k] - cx) * (1 + (i + 1) * 0.08), py = cy + (sea[k + 1] - cy) * (1 + (i + 1) * 0.08); if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.closePath(); ctx.strokeStyle = rgba(INK, 0.25 - i * 0.06); ctx.stroke(); }
  // The Hearth on the sea: a point of light, inked round.
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, cx, cy, 8, '#ffd070', 0.6); ctx.restore();
  ctx.fillStyle = INK; ctx.fillRect(Math.round(cx) - 1, Math.round(cy) - 1, 3, 3);
  // Hills hachured, woods dotted, a river down to the sea.
  for (let i = 0; i < 26; i++) {
    const a = rnd(373, i) * Math.PI * 2, r = 0.5 + rnd(374, i) * 0.38, hx = cx + Math.cos(a) * w * 0.44 * r, hy = cy + Math.sin(a) * h * 0.42 * r;
    if (i % 2) line(ctx, [hx - 3, hy + 1, hx, hy - 3, hx + 3, hy + 1], rgba(INK, 0.7), 1);
    else for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba('#3a5a30', 0.7); ctx.fillRect(Math.round(hx + k * 2.5), Math.round(hy + (k % 2)), 1.5, 1.5); }
  }
  line(ctx, [cx - w * 0.36, cy - h * 0.2, cx - w * 0.28, cy - h * 0.1, cx - w * 0.24, cy, cx - w * 0.2, cy + h * 0.02], '#5a7a9a', 1.2);
  // The survey's boxes, ruled over the land.
  const bw = w / 9, bh = h / 6;
  for (let i = 1; i < 9; i++) line(ctx, [x + i * bw, y, x + i * bw, y + h], rgba(INK, 0.18), 1);
  for (let j = 1; j < 6; j++) line(ctx, [x, y + j * bh, x + w, y + j * bh], rgba(INK, 0.18), 1);
  // The reach: what nobody has walked, left bare where the boxes stop, the edge dashed.
  const reach = [x + w * 0.64, y, x + w, y, x + w, y + h * 0.5, x + w * 0.82, y + h * 0.42, x + w * 0.7, y + h * 0.22];
  fillPoly(ctx, reach, shade(PARCH, 0.97));
  ctx.setLineDash([3, 3]); path(ctx, reach); ctx.strokeStyle = rgba(INK, 0.6); ctx.stroke(); ctx.setLineDash([]);
  // The places: red ink, a dot each, and the roads between the ones walked.
  const sites: [number, number][] = [];
  for (let i = 0; i < 16; i++) { const a = rnd(375, i) * Math.PI * 2, r = 0.6 + rnd(376, i) * 0.3; sites.push([cx + Math.cos(a) * w * 0.44 * r, cy + Math.sin(a) * h * 0.42 * r]); }
  const walked = sites.filter(([sx, sy]) => !(sx > x + w * 0.66 && sy < y + h * 0.45));
  for (let i = 1; i < 6; i++) line(ctx, [walked[i - 1][0], walked[i - 1][1], walked[i][0], walked[i][1]], rgba('#6a4a2a', 0.5), 1);
  for (const [sx, sy] of walked) { ctx.fillStyle = RED; ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 3, 3); }
  // The rose, and a cartouche whose title is only strokes of ink at this distance.
  const rx = x + 16, ry = y + h - 16;
  fillPoly(ctx, [rx, ry - 10, rx + 2, ry, rx, ry + 10, rx - 2, ry], INK); fillPoly(ctx, [rx - 10, ry, rx, ry - 2, rx + 10, ry, rx, ry + 2], INK);
  ctx.strokeStyle = rgba(INK, 0.6); ctx.beginPath(); ctx.arc(rx, ry, 6, 0, Math.PI * 2); ctx.stroke();
  slab(ctx, x + w - 52, y + h - 18, 44, 12, shade(PARCH, 1.04), { lit: 1, dark: 0.1 });
  for (let i = 0; i < 2; i++) line(ctx, [x + w - 46, y + h - 14 + i * 4, x + w - 14 - i * 8, y + h - 14 + i * 4], rgba(INK, 0.7), 1);
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

/** A globe on its stand, foot on y: the ball with its meridians, the land on it, and the brass ring round it. */
function globe(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  contact(ctx, x, y, r * 1.6, 0.45);
  for (const sd of [-1, 0, 1]) { line(ctx, [x, y - r * 0.9, x + sd * r * 0.7, y], '#120c14', 4); line(ctx, [x, y - r * 0.9, x + sd * r * 0.7, y], PINE, 2.4); }
  const gy = y - r * 2;
  glossBall(ctx, K, x, gy, r, '#7aa0b0', { gloss: 0.5, spread: 0.7 });
  ctx.save(); ctx.beginPath(); ctx.arc(x, gy, r - 1, 0, Math.PI * 2); ctx.clip();
  // Its land: a round of it all the way about, as if the world went round.
  for (const [lx, ly, lr] of [[-0.3, -0.2, 0.45], [0.4, 0.3, 0.35], [0.1, 0.55, 0.25]] as [number, number, number][]) fillPoly(ctx, coast(x + lx * r, gy + ly * r, lr * r, lr * r * 0.8, 14, Math.round(lx * 100 + 400), 0.4), '#b8b07a');
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(x, gy, Math.abs(i) * r * 0.3 + 0.5, r, 0, 0, Math.PI * 2); ctx.strokeStyle = rgba(INK, 0.35); ctx.lineWidth = 1; ctx.stroke(); }
  for (const f of [-0.5, 0, 0.5]) line(ctx, [x - r, gy + f * r, x + r, gy + f * r], rgba(INK, 0.3), 1);
  ctx.restore();
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, gy, r + 4, r + 4, 0.35, Math.PI * 0.85, Math.PI * 2.15); ctx.stroke();
  ctx.strokeStyle = '#c8a048'; ctx.lineWidth = 2; ctx.stroke();
}

/** A rack of pigeonholes with charts rolled in them, the ends showing. (x, top) to (x + w, y). */
function chartRack(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, y: number): void {
  slab(ctx, x, top, w, y - top, shade(PINE, 0.8), { lit: 2, dark: 0.1 });
  const cols = 4, rows = 3, cw = w / cols, ch = (y - top) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const px = x + c * cw + 2, py = top + r * ch + 2;
    ctx.fillStyle = '#1a1612'; ctx.fillRect(px, py, cw - 4, ch - 4);
    const n = 2 + Math.floor(rnd(377, r, c) * 3);
    for (let i = 0; i < n; i++) {
      const rr = 3 + rnd(378, r, c, i) * 1.5, ex = px + 4 + i * (cw - 10) / Math.max(1, n - 1) * 0.9, ey = py + ch - 6 - rnd(379, r, c, i) * (ch - 14);
      glossBall(ctx, K, ex, ey, rr, i % 2 ? PARCH : '#d8c8a0', { gloss: 0.2 });
      ctx.strokeStyle = rgba('#8a7a5a', 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(ex, ey, rr * 0.5, 0, Math.PI * 1.6); ctx.stroke();
    }
  }
}

/** The Meridian journal under glass: a case on legs, the book open inside on a cloth. Foot on y. */
function journalCase(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const top = y - 50;
  contact(ctx, x + w / 2, y, w * 1.1, 0.4);
  for (const lx of [x + 4, x + w - 8]) slab(ctx, lx, top + 14, 4, y - top - 14, PINE, { lit: 1 });
  slab(ctx, x, top + 8, w, 8, PINE, { lit: 2 });
  fillPoly(ctx, [x + 4, top + 8, x + 8, top, x + w - 8, top, x + w - 4, top + 8], '#5a2a2a');
  // The journal: worn calf, its pages tide-stained, a line of the old hand on each.
  glossPoly(ctx, K, [x + 12, top + 8, x + 14, top + 1, x + w / 2, top + 3, x + w - 14, top + 1, x + w - 12, top + 8], '#6a4a2e', {});
  glossPoly(ctx, K, [x + 15, top + 7, x + 16, top + 2, x + w / 2 - 1, top + 3, x + w / 2 - 1, top + 7], '#d8c8a0', {});
  glossPoly(ctx, K, [x + w / 2 + 1, top + 7, x + w / 2 + 1, top + 3, x + w - 16, top + 2, x + w - 15, top + 7], '#d0bc94', {});
  smudge(ctx, x + w * 0.65, top + 5, 4, '#8a6a3a', 0.4);
  // The glass over it, catching the light.
  fillPoly(ctx, [x + 2, top + 8, x + 2, top - 18, x + w - 2, top - 18, x + w - 2, top + 8], rgba('#c8e0e8', 0.14));
  line(ctx, [x + 2, top + 8, x + 2, top - 18, x + w - 2, top - 18, x + w - 2, top + 8], rgba(INK, 0.8), 1);
  line(ctx, [x + 8, top - 14, x + 18, top + 4], rgba('#ffffff', 0.5), 1);
}

/** The plotting table: a broad top seen from above with charts held flat by stones, dividers, a rule and the chain. */
function plottingTable(ctx: CanvasRenderingContext2D, s: Stage, x0: number, x1: number, y: number): void {
  const d = 22;
  for (const lx of [x0 + 10, x1 - 18]) slab(ctx, lx, y + 6, 8, STAGE_H - y, shade(PINE, 0.7), { lit: 1 });
  slab(ctx, x0, y, x1 - x0, 8, shade(PINE, 0.85), { lit: 1, dark: 0.35 });
  fillPoly(ctx, [x0, y, x0 + d, y - d, x1 - d, y - d, x1, y], shade(PINE, 1.2));
  // A chart spread on it, its corners held by sea-stones.
  const c = [x0 + 30, y - 2, x0 + 44, y - 18, x0 + 150, y - 18, x0 + 146, y - 2];
  fillPoly(ctx, c, PARCH); path(ctx, c); ctx.strokeStyle = rgba(INK, 0.7); ctx.lineWidth = 1; ctx.stroke();
  line(ctx, [x0 + 52, y - 6, x0 + 70, y - 14, x0 + 96, y - 9, x0 + 122, y - 15, x0 + 138, y - 7], rgba(INK, 0.7), 1);
  for (let i = 0; i < 4; i++) { ctx.fillStyle = RED; ctx.fillRect(Math.round(x0 + 60 + i * 20), Math.round(y - 10 - (i % 2) * 3), 2, 2); }
  for (const [sx, sy] of [[x0 + 34, y - 3], [x0 + 144, y - 3], [x0 + 46, y - 17]] as [number, number][]) glossEllipse(ctx, K, sx, sy, 4.5, 3, '#6a6a64', 0, { gloss: 0.4 });
  // The dividers standing open, a rule, the surveyor's chain coiled.
  line(ctx, [x0 + 96, y - 22, x0 + 88, y - 6], '#120c14', 2.5); line(ctx, [x0 + 96, y - 22, x0 + 104, y - 6], '#120c14', 2.5);
  line(ctx, [x0 + 96, y - 22, x0 + 88, y - 6], '#c8a048', 1.2); line(ctx, [x0 + 96, y - 22, x0 + 104, y - 6], '#c8a048', 1.2);
  glossPoly(ctx, K, [x0 + 156, y - 6, x0 + 206, y - 14, x0 + 208, y - 11, x0 + 158, y - 3], '#b89a68', {});
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x1 - 50, y - 8, 12 - i * 2, 4 - i * 0.6, 0, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = '#8a8a90'; ctx.lineWidth = 1.5; ctx.stroke(); }
  candle(ctx, s, x0 + 120, y - 2, 9, '#efe4c8', 70);
}

export const MAP_ROOM: Scene = {
  ambient: ['#2e3040', '#a4a8aa'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 198;
    // Pale plaster, bare boards, a beam; tall windows each side on the fog and the north light.
    plaster(ctx, 0, 0, STAGE_W, FLOOR, PLASTER, 371);
    floorboards(ctx, FLOOR, 200, 96, '#a08a68', 9, 371);
    beam(ctx, 0, 0, STAGE_W, 12, shade(PINE, 0.7), 380);
    for (const wx of [14, 350]) windowIn(ctx, s, wx, 30, 36, 112, shade(PINE, 0.9), { arched: true, panes: [2, 5], view: (c) => { skyFill(c, wx, 30, 36, 112, s.daylight, wx); c.fillStyle = rgba('#d4d8d4', 0.35 * s.daylight); c.fillRect(wx, 30, 36, 112); } });
    // The great chart, hung on its battens across the wall.
    chart(ctx, 86, 26, 228, 124);
    beam(ctx, 80, 20, 240, 7, shade(PINE, 0.85), 381);
    beam(ctx, 80, 150, 240, 7, shade(PINE, 0.85), 382);
    for (const kx of [80, 313]) glossBall(ctx, K, kx + 3.5, 153.5, 4, '#c8a048', { gloss: 0.6 });
    // Charts rolled in their racks, right; the globe, left; the journal under glass by the window.
    chartRack(ctx, 324, 158, 72, FLOOR + 4);
    globe(ctx, 58, FLOOR + 6, 18);
    journalCase(ctx, 0, FLOOR + 32, 44);
    // The lamp hung low from the chart's batten over the plotting table, lighting it at night.
    lantern(ctx, s, 236, 176, 10, '#3a3a40', 157, 170, '#ffe0a0');
    plottingTable(ctx, s, 96, 340, 236);
    if (s.daylight > 0.15) for (const wx of [32, 368]) pool(s, wx, 100, 170, '#c8d4e0', 0.55 * s.daylight);
  },
};
