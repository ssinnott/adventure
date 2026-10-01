// Saltmouth's armourer, a port's: red brick under a row of high windows, the walls racked full of
// the band's steel and mail, a grindstone, a brazier, and the sea's rust brought in for mending.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, beam, planks, stones, flagstones, windowIn, skyFill, line, smudge, fillPoly, slab, pool, contact } from '../kit.ts';
import { K, sword, spear, axe, shield, armourStand, mail, barrel, cloth, bottle } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';

const BRICK = '#8a4a38', OAK = '#4a3428', STEEL = '#c8ced8', RUST = '#9a5a2e';

/** Fog through a high window: grey sky, a roof line across the street, by night nothing much. */
function fogSky(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    skyFill(ctx, x, y, w, h, daylight, Math.round(x));
    ctx.fillStyle = rgba(mix('#2a3038', '#d8dcd8', daylight), 0.55); ctx.fillRect(x, y, w, h);
    fillPoly(ctx, [x, y + h, x, y + h * 0.7, x + w * 0.3, y + h * 0.5, x + w * 0.6, y + h * 0.72, x + w, y + h * 0.62, x + w, y + h], rgba(mix('#0e0e14', '#7a7068', daylight), 0.8));
  };
}

/** The brazier: an iron bowl of coals on three legs, the fire in it as a Light. Foot on y. */
function brazier(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  contact(ctx, x, y, w * 1.3, 0.5);
  const bowl = y - w * 0.9;
  for (const [a, b] of [[-0.3, -0.55], [0.3, 0.55], [0, 0.05]] as [number, number][]) { line(ctx, [x + w * a, bowl, x + w * b, y], '#120c14', 4.5); line(ctx, [x + w * a, bowl, x + w * b, y], '#3a3a42', 2.5); }
  glossPoly(ctx, K, [x - w / 2, bowl - w * 0.2, x + w / 2, bowl - w * 0.2, x + w * 0.36, bowl + w * 0.08, x - w * 0.36, bowl + w * 0.08], '#3a3a42', { gloss: 0.4, spread: 0.7 });
  const coal = ctx.createLinearGradient(0, bowl - w * 0.3, 0, bowl - w * 0.18);
  coal.addColorStop(0, '#ffd070'); coal.addColorStop(1, '#a8301a');
  ctx.beginPath(); ctx.ellipse(x, bowl - w * 0.2, w * 0.46, w * 0.09, 0, 0, Math.PI * 2); ctx.fillStyle = coal; ctx.fill();
  for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 3 ? '#3a1a10' : '#ffb050'; ctx.fillRect(Math.round(x - w * 0.36 + rnd(271, i) * w * 0.72), Math.round(bowl - w * 0.24 + rnd(272, i) * 4), 2, 2); }
  s.lights.push({ k: 'fire', x, y: bowl - w * 0.22, w: w * 0.6, h: w * 0.42 });
  s.lights.push({ k: 'motes', x: x - w * 0.3, y: bowl - w * 1.6, w: w * 0.6, h: w * 1.3, color: '#ffc060', n: 8, rise: 0.5 });
  pool(s, x, bowl - w * 0.3, 210, '#ff8a3a', 0.9);
}

/** The grindstone on its frame, a treadle under it and a trough of water below the wheel. Foot on y. */
function grindstone(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  contact(ctx, x, y, r * 3.2, 0.45);
  for (const sd of [-1, 1]) { line(ctx, [x + sd * r * 1.3, y, x + sd * r * 0.7, y - r * 1.5], '#120c14', 5); line(ctx, [x + sd * r * 1.3, y, x + sd * r * 0.7, y - r * 1.5], OAK, 3); }
  slab(ctx, x - r * 1.1, y - r * 0.7, r * 2.2, r * 0.5, shade(OAK, 0.9), { lit: 1 });
  ctx.fillStyle = rgba('#5a7a8a', 0.8); ctx.fillRect(Math.round(x - r), Math.round(y - r * 0.62), Math.round(r * 2), 3);
  glossBall(ctx, K, x, y - r * 1.5, r, '#a8a090', { gloss: 0.2, spread: 0.8 });
  ctx.strokeStyle = rgba('#5a564e', 0.6); ctx.lineWidth = 1; for (const f of [0.55, 0.8]) { ctx.beginPath(); ctx.arc(x, y - r * 1.5, r * f, 0, Math.PI * 2); ctx.stroke(); }
  glossBall(ctx, K, x, y - r * 1.5, r * 0.18, '#3a3a42', {});
  line(ctx, [x, y - r * 1.5, x + r * 1.4, y - r * 1.2], '#120c14', 3); line(ctx, [x, y - r * 1.5, x + r * 1.4, y - r * 1.2], '#5a5a62', 1.5);
  line(ctx, [x - r * 1.2, y - 2, x + r * 0.9, y - 6], '#120c14', 4); line(ctx, [x - r * 1.2, y - 2, x + r * 0.9, y - 6], OAK, 2.4);
}

/** A helm, open-faced with a nasal and a brim against the spray, sat on y; `rust` for one in for mending. */
function helm(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, metal: string, rust = false): void {
  glossPoly(ctx, K, [x - w * 0.62, y, x - w * 0.5, y - w * 0.08, x + w * 0.5, y - w * 0.08, x + w * 0.62, y], shade(metal, 0.85), { gloss: 0.5 });
  glossPoly(ctx, K, [x - w * 0.46, y - w * 0.08, x - w * 0.44, y - w * 0.5, x - w * 0.2, y - w * 0.74, x + w * 0.2, y - w * 0.74, x + w * 0.44, y - w * 0.5, x + w * 0.46, y - w * 0.08], metal, { gloss: rust ? 0.15 : 0.7, spread: 0.6 });
  line(ctx, [x, y - w * 0.72, x, y - w * 0.1], rgba('#ffffff', rust ? 0.15 : 0.5), 1);
  if (rust) for (let i = 0; i < 9; i++) smudge(ctx, x + (rnd(273, i) - 0.5) * w * 0.8, y - w * (0.1 + rnd(274, i) * 0.55), 2 + rnd(275, i) * 3, RUST, 0.8);
}

/** A shirt of scale: overlapping plates in rows, hung on a peg, its top at y. */
function scale(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, metal: string): void {
  const w = h * 0.8;
  mail(ctx, x, y, h, shade(metal, 0.7));
  ctx.save(); ctx.beginPath(); ctx.rect(x - w * 0.36, y + h * 0.12, w * 0.72, h * 0.86); ctx.clip();
  for (let r = 0; r < 9; r++) for (let i = 0; i < 7; i++) {
    const sx = x - w * 0.38 + (i + (r % 2) * 0.5) * w * 0.12, sy = y + h * 0.12 + r * h * 0.1;
    ctx.beginPath(); ctx.ellipse(sx, sy + 2, w * 0.065, h * 0.065, 0, 0, Math.PI); ctx.fillStyle = shade(metal, 0.9 + (r % 2) * 0.12); ctx.fill();
    ctx.strokeStyle = rgba('#120c14', 0.6); ctx.lineWidth = 1; ctx.stroke();
  }
  ctx.restore();
}

/** A cutlass, point up: a broad curved blade and a basket guard. Hilt at (x, y). */
function cutlass(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, blade = STEEL): void {
  const w = 3, g = y - len * 0.22;
  glossPoly(ctx, K, [x - w, g, x - w * 0.5, y - len * 0.72, x + w * 0.8, y - len, x + w * 1.8, y - len * 0.74, x + w, g], blade, { gloss: 0.6, spread: 0.6 });
  glossPoly(ctx, K, [x - w * 0.7, y, x - w * 0.7, g, x + w * 0.7, g, x + w * 0.7, y], '#2a1a12', {});
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x - w * 1.3, g + len * 0.1, len * 0.11, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
  ctx.strokeStyle = '#a8a8b0'; ctx.lineWidth = 2; ctx.stroke();
}

/** The bench across the front, heavy and scarred: a top seen from above, its front boarded. */
function bench(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, bottom: number): void {
  planks(ctx, x0, top + 9, x1 - x0, bottom - top - 9, shade(OAK, 0.9), 2, false, 276);
  fillPoly(ctx, [x0, top + 9, x0 + 8, top, x1, top, x1, top + 9], shade(OAK, 1.3));
  for (let i = 0; i < 8; i++) line(ctx, [x0 + 20 + rnd(277, i) * (x1 - x0 - 40), top + 2 + rnd(278, i) * 6, x0 + 30 + rnd(277, i) * (x1 - x0 - 40), top + 3 + rnd(279, i) * 6], rgba('#2a1a12', 0.5), 1);
  slab(ctx, x0, top + 7, x1 - x0, 4, OAK, { lit: 1 });
}

export const ARMOURER: Scene = {
  ambient: ['#363038', '#9a948c'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 202;
    // Red brick, salt-whitened low down, under black beams, with a row of high windows on the fog.
    stones(ctx, 0, 0, STAGE_W, FLOOR, BRICK, 26, 271, { long: 2.6, mortar: '#5a4a44', mottle: '#3a2a24' });
    const salt = ctx.createLinearGradient(0, FLOOR - 44, 0, FLOOR);
    salt.addColorStop(0, rgba('#e8e4d8', 0)); salt.addColorStop(1, rgba('#e8e4d8', 0.3));
    ctx.fillStyle = salt; ctx.fillRect(0, FLOOR - 44, STAGE_W, 44);
    flagstones(ctx, FLOOR, 200, 100, '#6a6660', 7, 271);
    for (const [wx, ww] of [[30, 84], [158, 84], [286, 84]] as [number, number][]) windowIn(ctx, s, wx, 18, ww, 26, '#3a3030', { panes: [4, 1], view: fogSky(wx, 18, ww, 26, s.daylight) });
    beam(ctx, 0, 0, STAGE_W, 10, OAK, 280);
    // The long rack on the back wall: a rank of swords and cutlasses, spears and a pair of axes.
    beam(ctx, 118, 62, 172, 6, OAK, 281);
    beam(ctx, 118, 158, 172, 6, OAK, 282);
    for (let i = 0; i < 6; i++) sword(ctx, 128 + i * 11, 158, 86 - (i % 2) * 8, { w: 2.6, hilt: i % 3 ? '#b08a3a' : '#8a8e96' });
    for (let i = 0; i < 4; i++) cutlass(ctx, 200 + i * 13, 158, 74);
    axe(ctx, 258, 164, 92); axe(ctx, 272, 164, 96, true);
    spear(ctx, 284, 168, 130);
    // Helms on the shelf over the rack.
    for (let i = 0; i < 6; i++) helm(ctx, 132 + i * 28, 62, 20, i % 2 ? '#a8b0bc' : '#8a929e');
    // Right: mail and scale on their pegs, plate on its stand, shields hung and leant.
    beam(ctx, 300, 60, 100, 5, OAK, 283);
    mail(ctx, 316, 64, 54); scale(ctx, 352, 64, 56, '#9a8e70'); mail(ctx, 386, 64, 52, '#aab2be');
    armourStand(ctx, 336, FLOOR - 2, 116);
    shield(ctx, 382, 176, 18, '#2a4a5a', 'kite', '#d8d0b8');
    shield(ctx, 306, 150, 12, '#5a2a2a', 'round', '#c9a34a');
    // Left: the brazier, the grindstone, a barrel of sand the mail is rolled in against the rust.
    brazier(ctx, s, 66, FLOOR + 12, 36);
    grindstone(ctx, 114, FLOOR + 6, 14);
    for (let i = 0; i < 4; i++) shield(ctx, 18 + i * 22, 112, 10, ['#2a4a5a', '#6a5a3a', '#4a2a2a', '#3a4a3a'][i], 'round', '#b8b0a0');
    // The bench across the front, and what the sea has sent in for mending.
    bench(ctx, 150, STAGE_W, 216, STAGE_H);
    helm(ctx, 196, 226, 24, '#7a7a80', true);
    // A cutlass laid flat, pitted along the blade.
    glossPoly(ctx, K, [216, 232, 252, 226, 268, 224, 254, 230, 218, 236], '#8a7060', { gloss: 0.3 });
    glossPoly(ctx, K, [204, 236, 216, 232, 218, 236, 206, 239], '#2a1a12', {});
    ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(214, 238, 6, 3, -0.2, 0, Math.PI); ctx.stroke();
    ctx.strokeStyle = '#7a6a5a'; ctx.lineWidth = 1.5; ctx.stroke();
    for (let i = 0; i < 7; i++) smudge(ctx, 224 + rnd(284, i) * 36, 228 + rnd(285, i) * 5, 1.5 + rnd(286, i) * 2, RUST, 0.9);
    cloth(ctx, 262, 316, 224, 6, '#8a8070', 287);
    glossEllipse(ctx, K, 292, 222, 10, 3.5, '#5a4a3a', 0, {});
    glossPoly(ctx, K, [284, 222, 284, 212, 300, 212, 300, 222], '#4a4a52', { gloss: 0.5 });
    bottle(ctx, 336, 226, 18, '#8a6a2a', { squat: true, label: '#e8dcc0' });
    glossPoly(ctx, K, [356, 226, 384, 222, 386, 228, 358, 230], '#8a8a96', {});
    barrel(ctx, 40, STAGE_H + 6, 50, 58, '#6a4a30');
    glossEllipse(ctx, K, 40, STAGE_H - 52, 22, 5, '#d8c8a0', 0, { gloss: 0.1 });
    mail(ctx, 36, STAGE_H - 60, 22, '#8a929e');
    contact(ctx, 116, 266, 30);
  },
};
