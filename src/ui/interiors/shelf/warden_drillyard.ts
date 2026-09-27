// The Wardens' Drillyard inside Helmstow's wall: packed sand and battered dummies under the open
// sky.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Stage, Scene } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, line, fillPoly, contact, flame, stones, skyFill, ink, path, slab, pool } from '../kit.ts';
import { K, sword, spear, shield, barrel } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { clouds, ground, target, armsRack } from '../yards.ts';

/** A training dummy on a post, foot on y: a stuffed sack of a body on a crossbar, a dented helm, straw at the seams. */
function dummy(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, lean = 0): void {
  contact(ctx, x, y, h * 0.5);
  line(ctx, [x, y, x + lean, y - h * 0.62], '#120c14', 6); line(ctx, [x, y, x + lean, y - h * 0.62], '#7a5a34', 4);
  const cx = x + lean, top = y - h;
  line(ctx, [cx - h * 0.36, top + h * 0.34, cx + h * 0.36, top + h * 0.3], '#120c14', 6); line(ctx, [cx - h * 0.36, top + h * 0.34, cx + h * 0.36, top + h * 0.3], '#8a6a42', 4);
  glossPoly(ctx, K, [cx - h * 0.2, top + h * 0.3, cx + h * 0.2, top + h * 0.28, cx + h * 0.24, top + h * 0.5, cx + h * 0.16, top + h * 0.66, cx - h * 0.16, top + h * 0.66, cx - h * 0.22, top + h * 0.5], '#c8a870', { spread: 0.8, h: 80, tex: 'folds', seed: Math.round(x), amount: 0.6 });
  line(ctx, [cx - h * 0.1, top + h * 0.34, cx + h * 0.02, top + h * 0.62], rgba('#6a4a2a', 0.8), 1);
  for (let i = 0; i < 5; i++) line(ctx, [cx + h * 0.16, top + h * 0.5 + i * 2, cx + h * 0.24 + rnd(x, i) * 4, top + h * 0.47 + i * 3], '#e0c060', 1);
  glossBall(ctx, K, cx, top + h * 0.2, h * 0.12, '#c8a870', { h: 80, tex: 'folds', seed: 3 });
  glossPoly(ctx, K, [cx - h * 0.14, top + h * 0.2, cx - h * 0.13, top + h * 0.06, cx - h * 0.06, top, cx + h * 0.06, top, cx + h * 0.13, top + h * 0.06, cx + h * 0.14, top + h * 0.2], '#8a909a', { gloss: 0.6, spread: 0.6 });
  glossBall(ctx, K, cx + h * 0.05, top + h * 0.09, h * 0.025, shade('#8a909a', 0.7), {});
}

/** A torch on a post, foot on y; it burns after dusk. */
function torchPost(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  line(ctx, [x, y, x, y - h], '#120c14', 6); line(ctx, [x, y, x, y - h], '#6a4a2a', 4);
  glossPoly(ctx, K, [x - 5, y - h - 8, x + 5, y - h - 8, x + 3, y - h, x - 3, y - h], '#3a3440', { gloss: 0.4 });
  if (s.daylight < 0.45) { flame(s, x, y - h - 8, 4, 120, 0.9); }
  else { glossEllipse(ctx, K, x, y - h - 9, 4, 2, '#2a2020', 0, {}); }
}

const WALL = '#b8ac94', SAND = '#c8a878', GREY = '#6a6e76';

/** The Wardens' banner: grey, with the black tower of the road watch on it. */
function towerDevice(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  const pts = [cx - r * 0.5, cy + r, cx - r * 0.4, cy - r * 0.5, cx - r * 0.6, cy - r * 0.5, cx - r * 0.6, cy - r, cx - r * 0.3, cy - r, cx - r * 0.3, cy - r * 0.8, cx - r * 0.1, cy - r * 0.8, cx - r * 0.1, cy - r, cx + r * 0.1, cy - r, cx + r * 0.1, cy - r * 0.8, cx + r * 0.3, cy - r * 0.8, cx + r * 0.3, cy - r, cx + r * 0.6, cy - r, cx + r * 0.6, cy - r * 0.5, cx + r * 0.4, cy - r * 0.5, cx + r * 0.5, cy + r];
  fillPoly(ctx, pts, '#1a1a20');
  ctx.fillStyle = '#e8d890'; ctx.fillRect(Math.round(cx) - 1, Math.round(cy - r * 0.2), 2, 3);
}

export const DRILLYARD: Scene = {
  ambient: ['#3a4058', '#f0ece4'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const WALL_TOP = 92, FOOT = 176;
    skyFill(ctx, 0, 0, STAGE_W, 130, s.daylight, 121);
    clouds(ctx, s.daylight, 10, 122);
    // Helmstow's roofs over the wall, and a watchtower with the Wardens' flag.
    for (let i = 0; i < 6; i++) {
      const rx = 10 + i * 70 + rnd(123, i) * 20, rw = 40 + rnd(124, i) * 30, rh = 16 + rnd(125, i) * 12, roof = rnd(126, i) < 0.6 ? '#a8503a' : '#5a6070';
      fillPoly(ctx, [rx, WALL_TOP + 2, rx + rw * 0.2, WALL_TOP - rh, rx + rw * 0.8, WALL_TOP - rh, rx + rw, WALL_TOP + 2], mix(roof, '#8a9ab8', 0.25));
    }
    slab(ctx, 318, 34, 40, 70, mix(WALL, '#8a9ab8', 0.15), { lit: 2, dark: 0.3 });
    for (let i = 0; i < 4; i++) slab(ctx, 316 + i * 12, 26, 8, 9, mix(WALL, '#8a9ab8', 0.15), { lit: 1 });
    line(ctx, [338, 26, 338, 2], '#3a3440', 1.5); fillPoly(ctx, [338, 2, 356, 6, 338, 11], GREY);
    // The wall: coursed stone, a wall-walk's merlons along the top, a drain arch at its foot.
    stones(ctx, 0, WALL_TOP, STAGE_W, FOOT - WALL_TOP, WALL, 7, 127);
    for (let i = 0; i < 14; i++) { const mx = i * 30; stones(ctx, mx, WALL_TOP - 12, 18, 13, WALL, 1, 128 + i); ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.strokeRect(mx + 0.5, WALL_TOP - 11.5, 17, 12); }
    const shadow = ctx.createLinearGradient(0, WALL_TOP, 0, FOOT);
    shadow.addColorStop(0, rgba('#0a0608', 0)); shadow.addColorStop(1, rgba('#0a0608', 0.3));
    ctx.fillStyle = shadow; ctx.fillRect(0, WALL_TOP, STAGE_W, FOOT - WALL_TOP);
    // The Wardens' banners hung from the wall-walk.
    for (const bx of [36, 212]) {
      const w = 34, h = 62, pts = [bx, WALL_TOP + 2, bx + w, WALL_TOP + 2, bx + w, WALL_TOP + h, bx + w / 2, WALL_TOP + h - 10, bx, WALL_TOP + h];
      fillPoly(ctx, pts, GREY); path(ctx, pts); ink(ctx);
      ctx.fillStyle = '#8a3a2a'; ctx.fillRect(bx + 2, WALL_TOP + 6, w - 4, 3);
      towerDevice(ctx, bx + w / 2, WALL_TOP + 28, 10);
    }
    ground(ctx, FOOT, SAND, 129);
    // Scuffed rings in the sand where the drills are run.
    for (const [cx, cy, rx] of [[120, 214, 70], [290, 206, 56]] as [number, number, number][]) { ctx.strokeStyle = rgba('#8a6a42', 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, rx, rx * 0.18, 0, 0, Math.PI * 2); ctx.stroke(); }
    // A rack of practice arms against the wall, the dummies out in the yard, the butt for the bows.
    armsRack(ctx, 148, FOOT + 4, 70, 60, '#7a5a34');
    for (let i = 0; i < 4; i++) sword(ctx, 156 + i * 9, FOOT, 50, { blade: '#a88a5a', hilt: '#6a4a2a', w: 2.2 });
    spear(ctx, 196, FOOT + 2, 76); spear(ctx, 204, FOOT + 2, 72);
    shield(ctx, 216, FOOT - 22, 11, '#6a4a2a', 'round', GREY);
    barrel(ctx, 126, FOOT + 8, 24, 32, '#7a5232');
    dummy(ctx, 84, 236, 92, -3);
    dummy(ctx, 250, 214, 70, 2);
    target(ctx, 346, 180, 22, 5);
    torchPost(ctx, s, 22, 250, 70);
    torchPost(ctx, s, 382, 256, 70);
    // A split-rail fence along the front, where the party stands to watch.
    for (const px of [8, 136, 264, 392]) { line(ctx, [px, STAGE_H, px, 224], '#120c14', 7); line(ctx, [px, STAGE_H, px, 224], '#7a5a34', 5); }
    for (const ry of [232, 250]) { line(ctx, [0, ry, STAGE_W, ry + 2], '#120c14', 6); line(ctx, [0, ry, STAGE_W, ry + 2], '#8a6a42', 4); line(ctx, [0, ry - 1, STAGE_W, ry + 1], rgba('#ffffff', 0.25), 1); }
    if (s.daylight > 0.3) pool(s, 200, 100, 320, '#fff4e0', 0.6 * s.daylight);
  },
};
