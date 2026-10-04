// Anvilhall's great hall, the thane's: a nave cut into the hill between square pillars hung with
// the hammer and pick, the thane's seat of stone on its dais and behind it the forge the dwarves
// make their kings' crowns at, its coals heaped high and the verse cut red over it. By day a shaft
// cut down through the hill lets the sky in.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, rnd, block, flagstones, line, smudge, fillPoly, path, ink, slab, pool, contact, clipRect } from '../kit.ts';
import { K, banner } from '../props.ts';
import { glossPoly, glossBall } from '../../monsters/gloss.ts';
import { IRON, RED, BLACK, ashlar, verse, hammerPick } from './hold.ts';

const STONE = '#5e5650', FLAG = '#5a524c';
/** The vanishing point, the foot of the end wall and the end wall's sides. */
const VX = 200, VY = 112, BACK = 172, BX0 = 92, BX1 = 308;
/** The forge's arch in the end wall: centre, radius, where it springs and the hearth it stands on. */
const FX = 200, FR = 58, SPRING = 112, HEARTH = 160;

/** Where a point on the near plane runs to at a depth that shrinks it by `s` toward the vanishing point. */
const toward = (x: number, y: number, s: number): [number, number] => [VX + (x - VX) * s, VY + (y - VY) * s];

/** The hall's side walls, dark rock running back to the end wall, their courses drawn toward the vanishing point. */
function sideWalls(ctx: CanvasRenderingContext2D): void {
  for (const sd of [-1, 1]) {
    const ex = sd < 0 ? BX0 : BX1, nx = sd < 0 ? -40 : STAGE_W + 40, ny = VY + (BACK - VY) * ((nx - VX) / (ex - VX));
    const wall = [ex, -10, ex, BACK, nx, ny, nx, -10];
    ctx.save(); path(ctx, wall); ctx.clip();
    ctx.fillStyle = shade(STONE, 0.5); ctx.fillRect(Math.min(ex, nx), -10, Math.abs(nx - ex), 300);
    for (let i = 0; i < 9; i++) { const y = BACK - i * 22; line(ctx, [ex, y, nx, VY + (y - VY) * ((nx - VX) / (ex - VX))], rgba('#0a0608', 0.45), 1); }
    for (let i = 0; i < 6; i++) { const u = 0.1 + i * 0.17, x = ex + (nx - ex) * u, k = (x - VX) / (ex - VX); line(ctx, [x, -10, x, VY + (BACK - VY) * k], rgba('#0a0608', 0.3), 1); }
    const g = ctx.createLinearGradient(ex, 0, nx, 0); g.addColorStop(0, rgba('#0a0608', 0.15)); g.addColorStop(1, rgba('#0a0608', 0.7));
    ctx.fillStyle = g; ctx.fillRect(Math.min(ex, nx), -10, Math.abs(nx - ex), 300);
    ctx.restore();
  }
}

/**
 * A square pillar standing on the floor at (x, y), `w` across its face: the face dressed in
 * courses, the side toward the hall's middle running back toward the vanishing point and lit by
 * the forge, a base and a band of iron. It rises out of sight into the dark under the hill.
 */
function pillar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, seed: number): void {
  const inner = x < VX ? x + w / 2 : x - w / 2, s = 1 - w / 260;
  const [fx, fy] = toward(inner, y, s), [tx, ty] = toward(inner, -60, s);
  const side = [inner, -60, tx, ty, fx, fy, inner, y];
  fillPoly(ctx, side, shade(STONE, 0.95));
  ctx.save(); path(ctx, side); ctx.clip();
  for (let i = 0; i < 14; i++) { const yy = y - i * w * 0.9, [, y2] = toward(inner, yy, s); line(ctx, [inner, yy, fx, y2], rgba('#0a0608', 0.4), 1); }
  const g = ctx.createLinearGradient(0, 0, 0, y); g.addColorStop(0, rgba('#0a0608', 0.6)); g.addColorStop(1, rgba('#ff8a3a', 0.12));
  ctx.fillStyle = g; ctx.fillRect(Math.min(inner, fx) - 1, -60, Math.abs(fx - inner) + 2, y + 60);
  ctx.restore();
  path(ctx, side); ink(ctx);
  ashlar(ctx, x - w / 2, -4, w, y + 4, Math.round((y + 4) / (w * 0.9)), seed, STONE);
  ctx.fillStyle = rgba('#0a0608', 0.18); ctx.fillRect(x - w / 2, -4, w, y + 4);
  const top = ctx.createLinearGradient(0, 0, 0, y * 0.6); top.addColorStop(0, rgba('#0a0608', 0.65)); top.addColorStop(1, rgba('#0a0608', 0));
  ctx.fillStyle = top; ctx.fillRect(x - w / 2, -4, w, y * 0.6);
  // The base, and a band of iron riveted round the shaft above it.
  slab(ctx, x - w / 2 - w * 0.08, y - w * 0.32, w * 1.16, w * 0.32, shade(STONE, 1.08), { lit: 1 });
  const by = y - w * 2.1;
  slab(ctx, x - w / 2 - 1, by, w + 2, Math.max(3, w * 0.14), IRON, { lit: 1 });
  for (let i = 0; i < 4; i++) glossBall(ctx, K, x - w / 2 + w * (0.15 + i * 0.233), by + Math.max(1.5, w * 0.07), Math.max(1, w * 0.04), shade(IRON, 1.6), { gloss: 0.6 });
}

/**
 * The kings' forge in the end wall: an arch of dressed voussoirs, soot up the flue and on the
 * hearth's bed the coals heaped high and white at the heart, breathing. It is the hall's light.
 */
function forge(ctx: CanvasRenderingContext2D, s: Stage): void {
  const mouth = (g: number): void => { ctx.beginPath(); ctx.moveTo(FX - FR - g, HEARTH); ctx.lineTo(FX - FR - g, SPRING); ctx.arc(FX, SPRING, FR + g, Math.PI, 0); ctx.lineTo(FX + FR + g, HEARTH); ctx.closePath(); };
  mouth(13); ctx.fillStyle = shade(STONE, 0.8); ctx.fill(); ink(ctx);
  for (let i = 0; i < 13; i++) {
    const a0 = Math.PI + (i / 13) * Math.PI, a1 = Math.PI + ((i + 1) / 13) * Math.PI, R0 = FR, R1 = FR + 13;
    const pts = [FX + Math.cos(a0) * R0, SPRING + Math.sin(a0) * R0, FX + Math.cos(a0) * R1, SPRING + Math.sin(a0) * R1, FX + Math.cos(a1) * R1, SPRING + Math.sin(a1) * R1, FX + Math.cos(a1) * R0, SPRING + Math.sin(a1) * R0];
    fillPoly(ctx, pts, shade(STONE, i === 6 ? 1.25 : 0.95 + rnd(601, i) * 0.16)); path(ctx, pts); ink(ctx);
  }
  for (const sx of [FX - FR - 13, FX + FR]) slab(ctx, sx, SPRING, 13, HEARTH - SPRING, shade(STONE, 0.95), { lit: 2 });
  mouth(0); ctx.save(); ctx.clip();
  const soot = ctx.createLinearGradient(0, SPRING - FR, 0, HEARTH);
  soot.addColorStop(0, '#050303'); soot.addColorStop(0.5, '#1a0c08'); soot.addColorStop(1, '#5a2a10');
  ctx.fillStyle = soot; ctx.fillRect(FX - FR, SPRING - FR, FR * 2, HEARTH - SPRING + FR);
  // The coals, a heap across the hearth, red at the edges and near white where the heat is.
  const heap = [FX - FR, HEARTH, FX - FR, HEARTH - 18, FX - FR * 0.6, HEARTH - 30, FX - FR * 0.2, HEARTH - 38, FX + FR * 0.2, HEARTH - 38, FX + FR * 0.6, HEARTH - 30, FX + FR, HEARTH - 18, FX + FR, HEARTH];
  const g = ctx.createRadialGradient(FX, HEARTH - 14, 4, FX, HEARTH - 14, FR);
  g.addColorStop(0, '#fff2c0'); g.addColorStop(0.3, '#ffc050'); g.addColorStop(0.65, '#ff6a20'); g.addColorStop(1, '#8a1e0c');
  fillPoly(ctx, heap, g);
  // Lumps of coal, dark where they have crusted, along the heap's edges.
  for (let i = 0; i < 26; i++) {
    const u = rnd(603, i), cx = FX - FR + u * FR * 2, top = HEARTH - 18 - Math.sin(u * Math.PI) * 20, edge = Math.abs(u - 0.5) * 2;
    ctx.fillStyle = rgba('#3a120a', 0.3 + edge * 0.5);
    ctx.beginPath(); ctx.ellipse(cx, top + 3 + rnd(604, i) * (HEARTH - top - 4), 2.5, 1.6, 0, 0, Math.PI * 2); ctx.fill();
  }
  smudge(ctx, FX, HEARTH - 30, FR * 1.2, '#ff7a2a', 0.45);
  ctx.restore();
  mouth(0); ink(ctx);
  s.lights.push({ k: 'glow', x: FX, y: HEARTH - 24, r: FR * 1.5, color: '#ff8a3a', a: 0.45 });
  s.lights.push({ k: 'motes', x: FX - FR * 0.8, y: SPRING - FR + 6, w: FR * 1.6, h: 40, color: '#ffc060', n: 14, rise: 0.45 });
  pool(s, FX, HEARTH - 20, 270, '#ff8a3a', 1);
  pool(s, FX, HEARTH - 16, 120, '#ffc070', 0.8);
}

/**
 * The thane's seat on the dais, foot on y: a block of the hill's stone with a high back peaked
 * like a gable and horned with iron, its arms capped in iron, the hammer and pick inlaid in brass,
 * a red cushion. The forge behind it rims it in fire.
 */
function seat(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  const w = h * 0.6, top = y - h, foot = y - h * 0.08, sy = y - h * 0.42, ay = y - h * 0.56, rim = '#ffa050', dark = shade(STONE, 0.5);
  contact(ctx, x, y, w * 1.7, 0.6);
  slab(ctx, x - w * 0.72, foot, w * 1.44, y - foot, shade(STONE, 0.7), { lit: 1, dark: 0.4 });
  // The back, peaked like a gable, an iron horn at each shoulder.
  const back = [x - w * 0.34, sy, x - w * 0.34, top + h * 0.2, x - w * 0.2, top + h * 0.1, x, top, x + w * 0.2, top + h * 0.1, x + w * 0.34, top + h * 0.2, x + w * 0.34, sy];
  glossPoly(ctx, K, back, dark, { gloss: 0.1, spread: 0.7, h: 80, tex: 'cracks', seed: 611, amount: 0.2 });
  line(ctx, back.slice(2, back.length - 2), rim, 1);
  for (const sd of [-1, 1]) {
    glossPoly(ctx, K, [x + sd * w * 0.3, top + h * 0.22, x + sd * w * 0.38, top + h * 0.2, x + sd * w * 0.5, top + h * 0.02, x + sd * w * 0.36, top + h * 0.12], IRON, { gloss: 0.5 });
  }
  // A panel sunk in the back, the hammer and pick in brass on it, a border cut round it.
  const px = x - w * 0.22, pw = w * 0.44, py = top + h * 0.22, ph = h * 0.28;
  ctx.fillStyle = shade(STONE, 0.36); ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = rgba(shade(STONE, 1.2), 0.5); ctx.fillRect(px, py + ph - 1, pw, 1); ctx.fillRect(px + pw - 1, py, 1, ph);
  hammerPick(ctx, x, py + ph * 0.52, pw * 0.64);
  // The seat block, a cushion on it; the arms, each a block capped in iron with a knob at its end.
  glossPoly(ctx, K, [x - w * 0.34, foot, x - w * 0.34, sy, x + w * 0.34, sy, x + w * 0.34, foot], shade(STONE, 0.56), { gloss: 0.1 });
  ctx.strokeStyle = rgba('#120c14', 0.6); ctx.lineWidth = 1; ctx.strokeRect(Math.round(x - w * 0.24) + 0.5, Math.round(sy + 6) + 0.5, Math.round(w * 0.48), Math.round(foot - sy - 12));
  glossPoly(ctx, K, [x - w * 0.34, sy + 1, x - w * 0.3, sy - 5, x + w * 0.3, sy - 5, x + w * 0.34, sy + 1], '#7a221c', { gloss: 0.25, spread: 0.8 });
  for (const sd of [-1, 1]) {
    glossPoly(ctx, K, [x + sd * w * 0.34, foot, x + sd * w * 0.34, ay, x + sd * w * 0.6, ay, x + sd * w * 0.6, foot], shade(STONE, 0.48), { gloss: 0.1 });
    slab(ctx, sd < 0 ? x - w * 0.64 : x + w * 0.3, ay - 4, w * 0.34, 5, IRON, { lit: 1 });
    glossBall(ctx, K, x + sd * w * 0.62, ay - 2, 3, shade(IRON, 1.3), { gloss: 0.6 });
    line(ctx, [x + sd * w * 0.61, ay + 2, x + sd * w * 0.61, foot - 1], rim, 1);
  }
}

/** An iron brazier on a tall stand, foot on y: the fire in its bowl as a Light. */
function brazier(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number, w: number): void {
  contact(ctx, x, y, w * 1.6, 0.5);
  const bowl = y - h;
  line(ctx, [x - w * 0.6, y, x, y - w * 0.6, x + w * 0.6, y], '#120c14', 5); line(ctx, [x - w * 0.6, y, x, y - w * 0.6, x + w * 0.6, y], IRON, 3);
  line(ctx, [x, y - w * 0.5, x, bowl], '#120c14', 5); line(ctx, [x, y - w * 0.5, x, bowl], shade(IRON, 1.25), 3);
  glossPoly(ctx, K, [x - w * 0.8, bowl - w * 0.34, x + w * 0.8, bowl - w * 0.34, x + w * 0.5, bowl + w * 0.2, x - w * 0.5, bowl + w * 0.2], IRON, { gloss: 0.4, spread: 0.7 });
  ctx.beginPath(); ctx.ellipse(x, bowl - w * 0.34, w * 0.74, w * 0.16, 0, 0, Math.PI * 2); ctx.fillStyle = '#ff9a3a'; ctx.fill();
  s.lights.push({ k: 'fire', x, y: bowl - w * 0.34, w: w * 1.1, h: w });
  pool(s, x, bowl - w * 0.6, 150, '#ff8a3a', 0.8);
}

/**
 * The runner up the nave to the dais, from the step at y0 to the foot of the stage, `hw` either
 * side of the middle there: dark red wool with a black border and a line of brass thread inside
 * it, all running back toward the vanishing point.
 */
function runner(ctx: CanvasRenderingContext2D, y0: number, hw: number): void {
  const at = (u: number, y: number): number => VX + u * hw * ((y - VY) / (y0 - VY));
  const yb = 272, cloth = [at(-1, y0), y0, at(1, y0), y0, at(1, yb), yb, at(-1, yb), yb];
  fillPoly(ctx, cloth, '#581814');
  ctx.save(); path(ctx, cloth); ctx.clip();
  for (const sd of [-1, 1]) {
    fillPoly(ctx, [at(sd * 1, y0), y0, at(sd * 0.8, y0), y0, at(sd * 0.8, yb), yb, at(sd * 1, yb), yb], '#1a1418');
    line(ctx, [at(sd * 0.75, y0), y0, at(sd * 0.75, yb), yb], '#8a6a30', 1);
  }
  const g = ctx.createLinearGradient(0, y0, 0, yb); g.addColorStop(0, rgba('#0a0608', 0.25)); g.addColorStop(1, rgba('#0a0608', 0));
  ctx.fillStyle = g; ctx.fillRect(0, y0, STAGE_W, yb - y0);
  ctx.restore();
  path(ctx, cloth); ink(ctx);
}

/** The shaft cut down through the hill: by day its light comes down at a slant across the nave and lies on the floor. */
function lightShaft(ctx: CanvasRenderingContext2D, s: Stage, x0: number, x1: number, fx0: number, fx1: number, fy: number): void {
  if (s.daylight <= 0.15) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(0, 0, 0, fy);
  g.addColorStop(0, rgba('#dce8ff', 0.32 * s.daylight)); g.addColorStop(1, rgba('#dce8ff', 0.06 * s.daylight));
  fillPoly(ctx, [x0, -2, x1, -2, fx1, fy, fx0, fy], g);
  const f = ctx.createRadialGradient((fx0 + fx1) / 2, fy, 2, (fx0 + fx1) / 2, fy, (fx1 - fx0) * 0.7);
  f.addColorStop(0, rgba('#e8f0ff', 0.3 * s.daylight)); f.addColorStop(1, rgba('#e8f0ff', 0));
  ctx.fillStyle = f; ctx.beginPath(); ctx.ellipse((fx0 + fx1) / 2, fy, (fx1 - fx0) * 0.7, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  s.lights.push({ k: 'motes', x: Math.min(x0, fx0), y: 4, w: Math.max(x1, fx1) - Math.min(x0, fx0), h: fy - 8, color: '#f0f4ff', n: 20, rise: 0.04 });
  pool(s, (fx0 + fx1) / 2, fy - 10, 110, '#d8e4f8', 0.75 * s.daylight);
  pool(s, (x0 + x1) / 2, 30, 80, '#c8d8f0', 0.45 * s.daylight);
}

export const GREAT_HALL: Scene = {
  ambient: ['#201a1e', '#4a4446'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    flagstones(ctx, BACK, VX, VY, FLAG, 6, 606);
    sideWalls(ctx);
    // The end wall, dressed stone going up into the dark under the hill.
    ctx.save(); clipRect(ctx, BX0, 0, BX1 - BX0, BACK);
    ashlar(ctx, BX0, -4, BX1 - BX0, BACK + 4, 8, 607, STONE);
    const dark = ctx.createLinearGradient(0, 0, 0, 70); dark.addColorStop(0, rgba('#0a0608', 0.75)); dark.addColorStop(1, rgba('#0a0608', 0));
    ctx.fillStyle = dark; ctx.fillRect(BX0, 0, BX1 - BX0, 70);
    ctx.restore();
    // The frieze over the forge, and the verse cut in it.
    slab(ctx, BX0 + 2, 22, BX1 - BX0 - 4, 18, shade(STONE, 1.08), { lit: 2, dark: 0.2 });
    verse(ctx, ['THE FIRE IS KEPT BELOW AND NOT ABOVE'], 200, 28, 1, STONE);
    pool(s, 200, 34, 110, '#ff9a50', 0.55);
    forge(ctx, s);
    // The dais, three steps of the same stone, the seat on it against the forge's light.
    slab(ctx, 120, HEARTH, 160, 9, shade(STONE, 1.02), { lit: 2, dark: 0.35 });
    slab(ctx, 106, HEARTH + 9, 188, 10, shade(STONE, 0.95), { lit: 2, dark: 0.35 });
    slab(ctx, 92, HEARTH + 19, 216, 12, shade(STONE, 0.88), { lit: 2, dark: 0.35 });
    seat(ctx, FX, HEARTH + 1, 96);
    runner(ctx, HEARTH + 31, 30);
    brazier(ctx, s, 112, HEARTH + 44, 50, 16);
    brazier(ctx, s, 288, HEARTH + 44, 50, 16);
    // The nave's pillars, the far pair and the near, the thane's banners on the near.
    pillar(ctx, 62, 196, 22, 609);
    pillar(ctx, 338, 196, 22, 610);
    pillar(ctx, 18, 236, 36, 611);
    pillar(ctx, 382, 236, 36, 612);
    const device = (cx: number, cy: number, r: number): void => hammerPick(ctx, cx, cy + r * 0.3, r * 1.2);
    banner(ctx, 4, 70, 28, 84, BLACK, { trim: RED, tail: 'swallow', emblem: device, rod: IRON });
    banner(ctx, 368, 70, 28, 84, BLACK, { trim: RED, tail: 'swallow', emblem: device, rod: IRON });
    lightShaft(ctx, s, 62, 86, 112, 166, 216);
  },
};
