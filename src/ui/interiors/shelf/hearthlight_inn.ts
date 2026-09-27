// The Hearthlight, Harrow's inn: a timbered common room round a great fire.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, floorboards, planks, windowIn, line, smudge, fillPoly, ink, path, contact } from '../kit.ts';
import { K, counter, shelf, bottle, jar, jug, tankard, plate, loaf, cheese, candle, lantern, kegEnd, ham, garlic, herbs, hearth, painting, stool, cloth } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

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
