// The trainers' yards, the two businesses under the open sky: the Wardens' Drillyard inside
// Harrow's wall, all packed sand and battered dummies, and the Elder's Yard in a clearing of
// Thornhold's forest, a ring of old stones where the elves teach the bow and the staff.
import { shade, rgba, mix } from '../../lib/art/palettes.ts';
import type { Scene, Stage } from './kit.ts';
import { STAGE_W, STAGE_H, rnd, stones, skyFill, line, fillPoly, ink, path, slab, contact, pool, trunk, beam, flame } from './kit.ts';
import { K, sword, spear, staff, bow, shield, barrel, lantern } from './props.ts';
import { glossPoly, glossEllipse, glossBall } from '../monsters/gloss.ts';

/** Clouds for the hour: pale by day, dark shapes lit from below at dusk, all but gone at night. */
function clouds(ctx: CanvasRenderingContext2D, daylight: number, y: number, seed: number): void {
  const lit = mix('#2a2a44', '#ffffff', daylight), under = mix('#20203a', '#b0c4dc', daylight);
  for (let i = 0; i < 5; i++) {
    const cx = rnd(seed, i) * STAGE_W, cy = y + rnd(seed, i, 1) * 36, w = 40 + rnd(seed, i, 2) * 50, h = 7 + rnd(seed, i, 3) * 6;
    for (let j = 0; j < 4; j++) {
      const bx = cx + (j - 1.5) * w * 0.22, by = cy + (j % 2) * h * 0.3, br = h * (0.7 + rnd(seed, i, j, 4) * 0.6);
      ctx.beginPath(); ctx.arc(bx, by + br * 0.3, br, 0, Math.PI * 2); ctx.fillStyle = rgba(under, 0.85); ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fillStyle = rgba(lit, 0.9); ctx.fill();
    }
  }
}

/** Ground seen from standing height, from y0 down: `base` darkening toward the viewer, with tufts, stones and scuffs. */
function ground(ctx: CanvasRenderingContext2D, y0: number, base: string, seed: number, grass = false): void {
  const g = ctx.createLinearGradient(0, y0, 0, STAGE_H);
  g.addColorStop(0, shade(base, 1.05)); g.addColorStop(1, shade(base, 0.8));
  ctx.fillStyle = g; ctx.fillRect(0, y0, STAGE_W, STAGE_H - y0);
  for (let i = 0; i < 90; i++) {
    const px = rnd(seed, i) * STAGE_W, t = rnd(seed, i, 1), py = y0 + t * t * (STAGE_H - y0), sc = 0.5 + t * 1.2;
    if (grass && i % 2) { line(ctx, [px, py, px - 1.5 * sc, py - 4 * sc], shade('#5a8a3a', 0.9 + rnd(seed, i, 2) * 0.3), 1); line(ctx, [px, py, px + 1.5 * sc, py - 3.5 * sc], '#6a9a44', 1); continue; }
    ctx.fillStyle = shade(base, rnd(seed, i, 3) > 0.5 ? 1.2 : 0.7); ctx.beginPath(); ctx.ellipse(px, py, 1.5 * sc, 0.8 * sc, 0, 0, Math.PI * 2); ctx.fill();
  }
}

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

/** An archery butt of straw on a tripod, centre (x, y), painted with rings, arrows in it. */
function target(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, seed: number): void {
  for (const [a, b] of [[-0.7, 1.4], [0.7, 1.4], [0, 1.6]] as [number, number][]) { line(ctx, [x, y - r * 0.2, x + a * r, y + b * r], '#120c14', 5); line(ctx, [x, y - r * 0.2, x + a * r, y + b * r], '#7a5a34', 3); }
  glossBall(ctx, K, x, y, r, '#d8c080', { h: 100, tex: 'fur', seed, amount: 0.5 });
  for (const [f, col] of [[0.8, '#e8e0d0'], [0.6, '#3a5ab0'], [0.4, '#c83a2a'], [0.2, '#e0c040']] as [number, string][]) { ctx.beginPath(); ctx.arc(x, y, r * f, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const ax = x + (rnd(seed, i) - 0.5) * r * 0.9, ay = y + (rnd(seed, i, 1) - 0.5) * r * 0.9;
    line(ctx, [ax, ay, ax + r * 0.5, ay + r * 0.15], '#6a4a2a', 1.5);
    fillPoly(ctx, [ax + r * 0.45, ay + r * 0.1, ax + r * 0.65, ay + r * 0.05, ax + r * 0.6, ay + r * 0.2], i % 2 ? '#e8e0d0' : '#c83a2a');
  }
}

/** An A-frame rack of practice arms, foot on y, `w` across. */
function armsRack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wood: string): void {
  for (const sx of [x, x + w]) { line(ctx, [sx - 6, y, sx, y - h, sx + 6, y], '#120c14', 5); line(ctx, [sx - 6, y, sx, y - h, sx + 6, y], wood, 3); }
  beam(ctx, x - 2, y - h * 0.62, w + 4, 4, wood);
  beam(ctx, x - 2, y - h * 0.2, w + 4, 4, wood);
}

/** A torch on a post, foot on y; it burns after dusk. */
function torchPost(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number): void {
  line(ctx, [x, y, x, y - h], '#120c14', 6); line(ctx, [x, y, x, y - h], '#6a4a2a', 4);
  glossPoly(ctx, K, [x - 5, y - h - 8, x + 5, y - h - 8, x + 3, y - h, x - 3, y - h], '#3a3440', { gloss: 0.4 });
  if (s.daylight < 0.45) { flame(s, x, y - h - 8, 4, 120, 0.9); }
  else { glossEllipse(ctx, K, x, y - h - 9, 4, 2, '#2a2020', 0, {}); }
}

// ------------------------------------------------------------------ the Warden Drillyard ----

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
    // Harrow's roofs over the wall, and a watchtower with the Wardens' flag.
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

// ------------------------------------------------------------------ the Elder's Yard ----

const BARK = '#5a4632', MOSS = '#5a7a3a', TURF = '#4c7a36';

/** A standing stone with a rune cut in it, foot on y: one of the ring the Elder teaches in. */
function ringStone(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number, seed: number): void {
  contact(ctx, x, y, h * 0.7);
  const w = h * 0.45, lean = (rnd(seed) - 0.5) * h * 0.1;
  glossPoly(ctx, K, [x - w * 0.5, y, x - w * 0.55 + lean, y - h * 0.7, x - w * 0.3 + lean, y - h, x + w * 0.3 + lean, y - h * 0.96, x + w * 0.5 + lean, y - h * 0.6, x + w * 0.5, y], '#8a8878', { spread: 0.7, h: 100, tex: 'cracks', seed, amount: 0.4 });
  for (let i = 0; i < 5; i++) { ctx.fillStyle = rgba(i % 2 ? MOSS : '#7a9a4a', 0.9); ctx.beginPath(); ctx.ellipse(x + (rnd(seed, i) - 0.5) * w * 0.8, y - rnd(seed, i, 1) * h * 0.3, 3 + rnd(seed, i, 2) * 4, 2, 0, 0, Math.PI * 2); ctx.fill(); }
  const rx = x + lean * 0.6, ry = y - h * 0.6;
  line(ctx, [rx - w * 0.15, ry + h * 0.1, rx, ry - h * 0.12, rx + w * 0.15, ry + h * 0.1], '#9affd8', 1.5);
  s.lights.push({ k: 'glow', x: rx, y: ry, r: h * 0.35, color: '#40e0a0', a: 0.25 });
}

/** A log hung on two ropes from a bough, to be dodged: the Elder's oldest drill. Its middle at (x, y). */
function swingingLog(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, top: number): void {
  for (const sd of [-1, 1]) line(ctx, [x + sd * len * 0.35, top, x + sd * len * 0.3, y], '#c8b890', 1.5);
  trunk(ctx, [x - len / 2, y + 1, x, y, x + len / 2, y - 1], 7, 6, BARK, 7);
  glossEllipse(ctx, K, x + len / 2, y - 1, 3.5, 6.5, '#c89a60', 0, {});
}

export const ELDERS_YARD: Scene = {
  ambient: ['#28343a', '#dcead8'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FOOT = 170;
    skyFill(ctx, 0, 0, STAGE_W, 140, s.daylight, 131);
    clouds(ctx, s.daylight, 20, 132);
    // The far side of the clearing: a wall of forest going back into haze.
    const haze = mix('#101a18', '#8ab090', s.daylight), deep = mix('#0a1210', '#3a6a3a', s.daylight);
    for (const [col, base, n] of [[haze, 80, 9], [deep, 110, 8]] as [string, number, number][]) {
      ctx.fillStyle = col; ctx.fillRect(0, base + 20, STAGE_W, FOOT - base);
      for (let i = 0; i < n; i++) { const cx = (i + rnd(133, base, i) * 0.8) * (STAGE_W / (n - 1)), r = 26 + rnd(134, base, i) * 18; ctx.beginPath(); ctx.arc(cx, base + 24 - rnd(135, base, i) * 20, r, 0, Math.PI * 2); ctx.fill(); }
    }
    ground(ctx, FOOT, TURF, 136, true);
    // The ring: a trodden circle of earth, and the old stones round it.
    ctx.fillStyle = rgba('#8a6a42', 0.55); ctx.beginPath(); ctx.ellipse(200, 204, 120, 26, 0, 0, Math.PI * 2); ctx.fill();
    for (const [sx, sy, sh, seed] of [[92, 186, 30, 1], [166, 180, 24, 2], [236, 180, 24, 3], [308, 186, 30, 4]] as [number, number, number, number][]) ringStone(ctx, s, sx, sy, sh, seed);
    // Straw butts at the clearing's edge, and a rack of staves and bows between the trees.
    target(ctx, 58, 168, 16, 7);
    target(ctx, 346, 164, 14, 8);
    armsRack(ctx, 176, FOOT + 2, 48, 52, '#6a5a3a');
    staff(ctx, 184, FOOT, 70, '#7a6a44'); staff(ctx, 194, FOOT, 66, '#6a5a3a', '#5ad0a0');
    bow(ctx, 210, FOOT - 6, 56, '#a86a3a', true); bow(ctx, 222, FOOT - 6, 52, '#8a5a2a', true);
    // The great trees that make the clearing's walls, their boughs meeting over it.
    trunk(ctx, [-6, STAGE_H + 10, 14, 180, 26, 100, 60, 30, 130, -10], 34, 12, BARK, 9);
    trunk(ctx, [406, STAGE_H + 10, 386, 180, 374, 100, 340, 30, 270, -10], 34, 12, BARK, 10);
    trunk(ctx, [60, 10, 150, 22, 200, 18, 250, 22, 340, 10], 7, 7, BARK, 11);
    for (let i = 0; i < 80; i++) {
      const a = rnd(137, i) * Math.PI * 2, len = 9 + rnd(138, i) * 8, lx = rnd(139, i) * STAGE_W, ly = rnd(140, i) * 34 - 8 + (Math.abs(lx - 200) < 90 ? 0 : 10);
      const ux = Math.cos(a), uy = Math.sin(a), w = len * 0.32, col = i % 3 ? '#4a7a3a' : '#6a9a44';
      glossPoly(ctx, K, [lx, ly, lx + ux * len * 0.35 - uy * w, ly + uy * len * 0.35 + ux * w, lx + ux * len, ly + uy * len, lx + ux * len * 0.35 + uy * w, ly + uy * len * 0.35 - ux * w], col, { gloss: 0.1 });
    }
    swingingLog(ctx, 272, 120, 56, 20);
    lantern(ctx, s, 110, 60, 10, '#4a3a2a', 24, 140, '#e8f0a0');
    lantern(ctx, s, 296, 64, 10, '#4a3a2a', 22, 140, '#e8f0a0');
    if (s.daylight < 0.3) s.lights.push({ k: 'motes', x: 30, y: 90, w: 340, h: 110, color: '#d8ff80', n: 26, rise: 0.06 });
    else pool(s, 200, 110, 300, '#fff8e0', 0.6 * s.daylight);
    // The foreground: roots and ferns, and a mossy wall of fieldstone the party stands behind.
    for (let i = 0; i < 9; i++) {
      const fx = rnd(141, i) * STAGE_W, fy = 232 + rnd(142, i) * 10;
      for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.35; line(ctx, [fx, fy, fx + Math.cos(a) * 18, fy + Math.sin(a) * 16], k % 2 ? '#4a7a36' : '#5a8a3e', 2); }
    }
    for (let i = 0; i < 9; i++) { const bx = i * 46 - 6 + rnd(143, i) * 8, bw = 44 + rnd(144, i) * 10; glossEllipse(ctx, K, bx + bw / 2, 252 + rnd(145, i) * 4, bw / 2, 16, '#7a786a', 0, { h: 100, tex: 'stipple', seed: i, amount: 0.3 }); }
    for (let i = 0; i < 20; i++) { ctx.fillStyle = i % 2 ? MOSS : '#6a8a40'; ctx.beginPath(); ctx.ellipse(rnd(146, i) * STAGE_W, 240 + rnd(147, i) * 8, 6 + rnd(148, i) * 8, 3, 0, 0, Math.PI * 2); ctx.fill(); }
  },
};

