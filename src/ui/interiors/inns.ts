// The inns: the Hearthlight in Harrow, a timbered common room round a great fire, and the Green
// Man in Thornhold, grown rather than built, where the fire burns under a face of leaves.
import { shade, rgba } from '../../lib/art/palettes.ts';
import type { Scene, Stage } from './kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, floorboards, planks, windowIn, forestFill, line, smudge, fillPoly, ink, path, trunk, contact } from './kit.ts';
import { K, counter, logCounter, shelf, bottle, jar, jug, cup, tankard, plate, loaf, cheese, candle, lantern, kegEnd, ham, garlic, herbs, hearth, painting, stool, cloth } from './props.ts';
import { glossPoly, glossEllipse, glossBall, blob, softLine } from '../monsters/gloss.ts';

// ------------------------------------------------------------------ the Hearthlight ----

const OAK = '#6a4428', OAK_DARK = '#4a2e1c', PLASTER = '#e2d2b0', STONE = '#9a8a78', COPPER = '#c0703a';

/** The Hearth over the inland sea at dusk, as a painter in Harrow would have it: a column of light on the horizon. */
function hearthPicture(x: number, y: number, w: number, h: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    const g = ctx.createLinearGradient(0, y, 0, y + h * 0.6);
    g.addColorStop(0, '#2a2a5a'); g.addColorStop(1, '#e8905a');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h * 0.6);
    const sea = ctx.createLinearGradient(0, y + h * 0.6, 0, y + h);
    sea.addColorStop(0, '#3a5a8a'); sea.addColorStop(1, '#1a2a4a');
    ctx.fillStyle = sea; ctx.fillRect(x, y + h * 0.6, w, h * 0.4);
    const cx = x + w / 2;
    smudge(ctx, cx, y + h * 0.6, h * 0.5, '#ffe0a0', 0.6);
    ctx.fillStyle = '#fff0c8'; ctx.fillRect(Math.round(cx) - 1, y + 3, 2, h * 0.6 - 3);
    for (let i = 0; i < 6; i++) { const ww = 4 + i * 3; ctx.fillStyle = rgba('#ffe0a0', 0.6 - i * 0.08); ctx.fillRect(Math.round(cx - ww / 2), Math.round(y + h * 0.62 + i * 3), Math.round(ww), 1); }
    ctx.fillStyle = '#141a30'; ctx.fillRect(x, y + h * 0.58, w, 2);
    fillPoly(ctx, [x, y + h * 0.6, x + w * 0.25, y + h * 0.5, x + w * 0.4, y + h * 0.6], '#141a30');
  };
}

/** A pan hung by its handle from a hook at (x, y): the handle up, the round of the pan below it. */
function pan(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, metal: string): void {
  line(ctx, [x, y, x, y + r * 1.4], '#120c14', 3.5); line(ctx, [x, y, x, y + r * 1.4], shade(metal, 0.8), 2);
  glossBall(ctx, K, x, y + r * 2.3, r, metal, { gloss: 0.6, spread: 0.7 });
  ctx.strokeStyle = shade(metal, 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y + r * 2.3, r * 0.72, 0, Math.PI * 2); ctx.stroke();
}

/** The brass bell on the counter that fetches whoever is in the kitchen. */
function bell(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  glossEllipse(ctx, K, x, y - 1, r * 1.4, r * 0.35, '#6a4428', 0, {});
  glossPoly(ctx, K, [x - r, y - 2, x - r * 0.85, y - r * 0.9, x - r * 0.4, y - r * 1.35, x + r * 0.4, y - r * 1.35, x + r * 0.85, y - r * 0.9, x + r, y - 2], '#d8a840', { gloss: 0.8, spread: 0.7 });
  glossBall(ctx, K, x, y - r * 1.55, r * 0.28, '#d8a840', { gloss: 0.8 });
}

export const HEARTHLIGHT: Scene = {
  ambient: ['#4a3844', '#a89684'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 204;
    // The back wall: plaster between oak posts and a rail.
    plaster(ctx, 0, 0, STAGE_W, FLOOR, PLASTER, 3);
    floorboards(ctx, FLOOR, 214, 96, '#7a5236', 9, 4);
    // Ceiling: boards overhead and the summer beam across the room, the joists running back.
    planks(ctx, 0, 0, STAGE_W, 22, OAK_DARK, 1, false, 5);
    for (let i = 0; i < 9; i++) { const jx = 12 + i * 48; fillPoly(ctx, [jx, 0, jx + 12, 0, jx + 10, 18, jx + 2, 18], shade(OAK_DARK, 0.85)); }
    beam(ctx, 0, 18, STAGE_W, 13, OAK, 7);
    beam(ctx, 146, 31, 11, FLOOR - 31, OAK, 8);
    beam(ctx, 262, 31, 11, FLOOR - 31, OAK, 9);
    beam(ctx, 157, 116, 105, 8, OAK, 10);
    beam(ctx, 273, 124, 127, 8, OAK, 11);
    // Through the doorway behind the counter, the kitchen: pans on a rail, a shelf of crocks, and the glow of its fire.
    const dx = 174, dw = 70, dt = 58, door = [dx, FLOOR, dx, dt + 12, dx + dw / 2, dt, dx + dw, dt + 12, dx + dw, FLOOR];
    fillPoly(ctx, door, '#24180f');
    ctx.save(); path(ctx, door); ctx.clip();
    planks(ctx, dx, dt, dw, FLOOR - dt, '#3e2a1a', 6, true, 12);
    smudge(ctx, dx + dw * 0.85, 150, 60, '#ff9a48', 0.45);
    line(ctx, [dx, 84, dx + dw, 84], '#120c14', 3); line(ctx, [dx, 84, dx + dw, 84], '#5a5460', 1.5);
    pan(ctx, dx + 20, 84, 8, COPPER); pan(ctx, dx + 40, 84, 6, '#8a8e96'); pan(ctx, dx + 56, 84, 7, COPPER);
    shelf(ctx, dx, 140, dw, OAK_DARK, 3);
    jar(ctx, dx + 14, 140, 12, 16, '#a86a3a', '#6a4428'); jar(ctx, dx + 32, 140, 10, 13, '#d8c8a0'); jug(ctx, dx + 52, 140, 16, '#5a7aa8', '#e8e0d0');
    ctx.fillStyle = rgba('#0a0608', 0.35); ctx.fillRect(dx, dt, dw, FLOOR - dt);
    ctx.restore();
    path(ctx, door); ink(ctx);
    // The curtain, drawn back to either side.
    for (const [cx0, cx1] of [[dx - 2, dx + 20], [dx + dw - 14, dx + dw + 2]]) {
      const cg = ctx.createLinearGradient(cx0, 0, cx1, 0); cg.addColorStop(0, '#8a3a2a'); cg.addColorStop(0.5, '#b04a36'); cg.addColorStop(1, '#6a2a1e');
      fillPoly(ctx, [cx0, dt + 8, cx1, dt + 10, cx1 - 3, FLOOR, cx0, FLOOR], cg);
      for (let i = 1; i < 4; i++) line(ctx, [cx0 + (cx1 - cx0) * i / 4, dt + 10, cx0 + (cx1 - cx0) * i / 4 - 1, FLOOR], rgba('#3a1410', 0.5), 1);
      path(ctx, [cx0, dt + 8, cx1, dt + 10, cx1 - 3, FLOOR, cx0, FLOOR]); ink(ctx);
    }
    beam(ctx, dx - 6, dt + 4, dw + 12, 6, OAK, 13);
    // The hearth, left, with the Hearth painted over it.
    const fb = hearth(ctx, s, 14, 31, 128, FLOOR + 6, STONE, 21, { mantel: OAK, reach: 260 });
    painting(ctx, 44, 44, 68, 44, hearthPicture(44, 44, 68, 44));
    const mantelY = fb.y - fb.w * 0.36;
    tankard(ctx, 26, mantelY, 12, '#9aa0a8', { band: '#6a6e78' });
    plate(ctx, 42, mantelY, 7, '#e8e0d0', '#5a7aa8');
    candle(ctx, s, 128, mantelY, 12, '#efe4c8', 90);
    jar(ctx, 112, mantelY, 9, 12, '#a86a3a', '#6a4428');
    // A pot on its hook over the fire.
    line(ctx, [fb.x + fb.w * 0.5, fb.y + 4, fb.x + fb.w * 0.5, fb.y + 18], '#2a2226', 2);
    glossEllipse(ctx, K, fb.x + fb.w * 0.5, fb.y + 26, 13, 10, '#2e2a30', 0, { gloss: 0.4, spread: 0.7 });
    // Right: the window, and shelves of bottles and plates over a rack of kegs.
    windowIn(ctx, s, 312, 42, 50, 58, OAK_DARK, { panes: [2, 3] });
    shelf(ctx, 282, 106, 110, OAK);
    for (let i = 0; i < 7; i++) bottle(ctx, 290 + i * 14, 106, 16 + rnd(1, i) * 8, ['#3a6a3a', '#6a3a2a', '#2a4a6a', '#7a6a2a'][i % 4], { label: i % 2 ? '#e8dcc0' : undefined });
    shelf(ctx, 282, 150, 110, OAK);
    for (let i = 0; i < 5; i++) plate(ctx, 294 + i * 21, 150, 8.5, '#ece4d4', i % 2 ? '#5a7aa8' : '#a84a3a');
    beam(ctx, 280, 186, 116, 6, OAK_DARK, 14);
    for (let i = 0; i < 3; i++) kegEnd(ctx, 300 + i * 38, 170, 16, '#8a5a36');
    // Stores hung from the beam, and a lantern.
    ham(ctx, 172, 44, 16, 31); garlic(ctx, 212, 40, 9, 31, 5); ham(ctx, 238, 46, 13, 31); garlic(ctx, 290, 40, 9, 31, 5); herbs(ctx, 344, 42, 16, 31, '#6a8a3a', 2); ham(ctx, 382, 44, 13, 31);
    lantern(ctx, s, 256, 60, 14, '#3a3440', 31, 170);
    // The hearthstone's warmth on the floor, and a stool drawn up to it.
    smudge(ctx, 80, FLOOR + 20, 70, '#ff9a48', 0.2);
    contact(ctx, 60, 260, 40);
    stool(ctx, 40, 262, 30, '#7a5236');
    // The bar, and what stands on it.
    counter(ctx, 150, STAGE_W, 188, 12, STAGE_H, OAK, 30, { panels: 4 });
    cloth(ctx, 206, 226, 196, 14, '#e8e0cc', 3);
    bell(ctx, 186, 199, 5);
    tankard(ctx, 246, 199, 16, '#a0a6ae', { band: '#6a6e78', foam: true });
    tankard(ctx, 300, 199, 17, '#a0a6ae', { band: '#6a6e78', foam: true });
    tankard(ctx, 322, 199, 15, '#8a5a36', { band: '#3a2618', handleLeft: true });
    loaf(ctx, 166, 198, 20);
    cheese(ctx, 380, 198, 20);
    candle(ctx, s, 356, 198, 14, '#efe4c8', 110);
  },
};

// ------------------------------------------------------------------ the Green Man ----

const BARK = '#5a4632', GOLDWOOD = '#a8844e', DAUB = '#b8ae84', LEAF = '#4a7a3a';

/** A leaf, pointed at both ends, from its stalk at (x, y) out along angle a. */
function leaf(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, a: number, col: string): void {
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, w = len * 0.32;
  glossPoly(ctx, K, [x, y, x + ux * len * 0.35 + nx * w, y + uy * len * 0.35 + ny * w, x + ux * len, y + uy * len, x + ux * len * 0.35 - nx * w, y + uy * len * 0.35 - ny * w], col, { gloss: 0.15, spread: 0.7 });
  line(ctx, [x + ux * len * 0.1, y + uy * len * 0.1, x + ux * len * 0.85, y + uy * len * 0.85], rgba('#1a1208', 0.35), 1);
}

/**
 * The Green Man himself, carved in oak over the fire: a broad face whose hair and beard are
 * leaves, with more leaves growing from the corners of his mouth.
 */
function greenManFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  const oak = '#9a7a44';
  for (let i = 0; i < 13; i++) {
    const a = Math.PI + (i / 12) * Math.PI;
    leaf(ctx, cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.6, r * 0.85, a, i % 2 ? '#7a8a3a' : '#5a7a34');
  }
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) leaf(ctx, cx + sd * r * 0.3, cy + r * 0.6, r * (0.7 - i * 0.1), Math.PI / 2 + sd * (0.35 + i * 0.4), i % 2 ? '#6a8a3a' : '#4a6a2e');
  blob(ctx, K, oak, [{ k: 'curve', pts: [cx - r * 0.72, cy - r * 0.5, cx, cy - r * 0.78, cx + r * 0.72, cy - r * 0.5, cx + r * 0.66, cy + r * 0.35, cx + r * 0.3, cy + r * 0.78, cx - r * 0.3, cy + r * 0.78, cx - r * 0.66, cy + r * 0.35], wobble: 0.03, seed: 8, sub: 2 }], { h: r * 4, formK: 0.6, spread: 0.7, tex: 'cracks', seed: 8, amount: 0.3 });
  // A heavy brow over deep eyes, a broad nose, and a mouth open on a leaf.
  for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.ellipse(cx + sd * r * 0.3, cy - r * 0.1, r * 0.16, r * 0.1, 0, 0, Math.PI * 2); ctx.fillStyle = '#1a1208'; ctx.fill();
    ctx.fillStyle = '#c8ffb0'; ctx.fillRect(Math.round(cx + sd * r * 0.3) - 1, Math.round(cy - r * 0.12), 2, 1);
    softLine(ctx, K, [cx + sd * r * 0.55, cy - r * 0.18, cx + sd * r * 0.12, cy - r * 0.32], oak, Math.max(2, r * 0.12), 0.8);
  }
  glossPoly(ctx, K, [cx - r * 0.1, cy - r * 0.2, cx + r * 0.1, cy - r * 0.2, cx + r * 0.18, cy + r * 0.22, cx - r * 0.18, cy + r * 0.22], shade(oak, 1.08), { spread: 0.7 });
  ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.45, r * 0.22, r * 0.1, 0, 0, Math.PI * 2); ctx.fillStyle = '#1a1208'; ctx.fill();
  leaf(ctx, cx, cy + r * 0.45, r * 0.5, Math.PI / 2, '#6a9a3a');
}

/** A lantern of green glass hung from a bough. */
function greenLantern(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, size: number, top: number): void {
  lantern(ctx, s, x, y, size, '#4a3a2a', top, size * 10, '#d8f0a0');
}

/** The house cask, lying on its cradle: seen end-on, its tap over a drip-cup. Centre (x, y). */
function cask(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  for (const sd of [-1, 1]) fillPoly(ctx, [x + sd * r * 0.9, y + r * 0.5, x + sd * r * 0.7, y + r * 1.25, x + sd * r * 0.5, y + r * 1.25, x + sd * r * 0.55, y + r * 0.7], shade(BARK, 1.2));
  kegEnd(ctx, x, y, r, '#9a6a3a', '#3a3440', '#c9a34a');
  cup(ctx, x, y + r * 1.25, r * 0.5, GOLDWOOD);
}

export const GREEN_MAN: Scene = {
  ambient: ['#3a3a40', '#9aa088'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 206;
    ctx.fillStyle = '#2a2016'; ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    plaster(ctx, 0, 20, STAGE_W, FLOOR - 20, DAUB, 31);
    floorboards(ctx, FLOOR, 210, 96, '#8a6a42', 8, 33);
    // The hearth in the left bay, built into the roots, and the Green Man over it.
    const fb = hearth(ctx, s, 40, 44, 104, FLOOR + 6, '#8a8672', 34, { mantel: GOLDWOOD, reach: 250 });
    greenManFace(ctx, 92, 86, 22);
    const mantelY = fb.y - fb.w * 0.36;
    cup(ctx, 52, mantelY, 9, GOLDWOOD); cup(ctx, 64, mantelY, 9, '#8a6a3a', true); candle(ctx, s, 132, mantelY, 11, '#e8e0c0', 80);
    // The middle bay, behind the counter: the house cask on its cradle under a shelf of bottles.
    shelf(ctx, 176, 96, 80, GOLDWOOD);
    for (let i = 0; i < 5; i++) bottle(ctx, 186 + i * 15, 96, 15 + rnd(12, i) * 7, ['#4a7a4a', '#8a6a2a', '#6a3a5a'][i % 3], { squat: i % 2 === 1 });
    cask(ctx, 216, 150, 24);
    // Shelves of cups and jars in the right bay, under a round window onto the forest.
    windowIn(ctx, s, 304, 40, 58, 58, GOLDWOOD, { round: true, panes: [2, 2], view: (c) => forestFill(c, 304, 40, 58, 58, s.daylight, 9) });
    shelf(ctx, 290, 116, 84, GOLDWOOD);
    for (let i = 0; i < 5; i++) cup(ctx, 300 + i * 16, 116, 10, i % 2 ? GOLDWOOD : '#7a5a34', i === 2);
    shelf(ctx, 290, 152, 84, GOLDWOOD);
    jar(ctx, 304, 152, 14, 18, '#6a8a6a', '#a8844e'); jar(ctx, 326, 152, 12, 16, '#c8a060'); jar(ctx, 346, 152, 14, 20, '#7a5a8a', '#6a4428'); jar(ctx, 364, 152, 10, 13, '#a86a3a');
    // Great trunks rising out of the floor and leaning together overhead: the room's frame.
    trunk(ctx, [4, 268, 16, 170, 22, 90, 50, 30, 100, -10], 26, 12, BARK, 1);
    trunk(ctx, [396, 268, 386, 170, 378, 90, 350, 30, 300, -10], 26, 12, BARK, 2);
    trunk(ctx, [156, 210, 158, 150, 162, 90, 180, 40, 204, 0], 11, 7, shade(BARK, 1.1), 3);
    trunk(ctx, [276, 210, 274, 150, 270, 90, 252, 40, 226, 0], 11, 7, shade(BARK, 1.1), 4);
    // The canopy: boughs across the top, thick with leaves.
    for (let i = 0; i < 70; i++) {
      const lx = rnd(6, i) * STAGE_W, ly = rnd(7, i) * 30 - 6;
      leaf(ctx, lx, ly, 10 + rnd(8, i) * 8, rnd(9, i) * Math.PI * 2, i % 3 ? LEAF : '#5a8a3a');
    }
    trunk(ctx, [0, 18, 120, 8, 220, 16, 320, 8, 400, 16], 6, 6, BARK, 5);
    // Garlands of dried flowers and herbs along the bough, and lanterns of green glass.
    for (let i = 0; i < 6; i++) herbs(ctx, 20 + i * 64 + (i > 2 ? 10 : 0), 30, 12, 18, ['#8a9a4a', '#a0708a', '#c8a050'][i % 3], i + 40);
    greenLantern(ctx, s, 214, 40, 11, 16);
    greenLantern(ctx, s, 290, 64, 9, 16);
    // The counter: one split log, and the evening's cups and apples on it.
    logCounter(ctx, 140, STAGE_W, 190, 12, STAGE_H, GOLDWOOD, BARK, 7);
    cup(ctx, 236, 200, 12, GOLDWOOD); jug(ctx, 262, 200, 20, '#c86a3a', '#e8d8b0');
    cup(ctx, 300, 200, 12, GOLDWOOD); cup(ctx, 318, 200, 12, '#7a5a34');
    cup(ctx, 172, 202, 26, '#7a5a34', true);
    for (let i = 0; i < 5; i++) glossBall(ctx, K, 164 + (i % 3) * 7 + (i > 2 ? 3 : 0), 196 - (i > 2 ? 6 : 0), 4, i % 2 ? '#c83a2a' : '#8ab83a', { gloss: 0.5 });
    candle(ctx, s, 370, 200, 13, '#e8e0c0', 110);
  },
};
