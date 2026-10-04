// Anvilhall's inn, the miners' lodging: a barrel vault of dressed stone, bunks cut in two tiers
// into the rock with their curtains and the miners' caps on the pegs, the hearth with an iron arch
// of candles on its mantel as the mining country keeps them, stone steins on the long table, and
// a window cut out to the terraces.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, flagstones, line, fillPoly, path, slab, contact, flame } from '../kit.ts';
import { K, hearth, barrel, loaf, cheese, stool, cloth, candle } from '../props.ts';
import { glossPoly, glossBall } from '../../monsters/gloss.ts';
import { ROCK, IRON, ashlar, recess, oldScript, frogLamp, rockWindow, terraceView, hammerPick } from './hold.ts';

const FLOOR = 202, STONE = '#6a6058', OAK = '#5a3e28', WOOL = ['#7a2e24', '#4a4a52', '#6a5a3a', '#3a4a3a'];
/** The vault's spring at the side walls, and its crown. */
const SPRING = 66, CROWN = 10;

/** The vault's edge against the end wall at x: a half-ellipse from the spring at both sides to the crown. */
const arch = (x: number): number => SPRING - (SPRING - CROWN) * Math.sqrt(Math.max(0, 1 - Math.pow((x - 200) / 200, 2)));

/** The barrel vault overhead, its courses of stone curving away, darker the deeper they go. */
function vault(ctx: CanvasRenderingContext2D): void {
  const edge: number[] = []; for (let i = 0; i <= 40; i++) edge.push(i * 10, arch(i * 10));
  ctx.save(); path(ctx, [0, -2, ...edge, STAGE_W, -2]); ctx.clip();
  ctx.fillStyle = shade(STONE, 0.5); ctx.fillRect(0, 0, STAGE_W, SPRING);
  for (let r = 0; r < 5; r++) {
    const pts: number[] = []; for (let i = 0; i <= 40; i++) pts.push(i * 10, arch(i * 10) - r * 9 - 4);
    line(ctx, pts, rgba('#0a0608', 0.45), 1);
    for (let j = 0; j < 9; j++) { const x = (j + (r % 2) * 0.5) * 48 + rnd(671, r, j) * 6, y = arch(x) - r * 9 - 4; line(ctx, [x, y, x, y - 9], rgba('#0a0608', 0.4), 1); }
  }
  const g = ctx.createLinearGradient(0, 0, 0, SPRING); g.addColorStop(0, rgba('#0a0608', 0.7)); g.addColorStop(1, rgba('#0a0608', 0.1));
  ctx.fillStyle = g; ctx.fillRect(0, 0, STAGE_W, SPRING);
  ctx.restore();
  line(ctx, edge, '#120c14', 2); line(ctx, edge.map((v, i) => i % 2 ? v + 2 : v), rgba(shade(STONE, 1.4), 0.5), 1);
}

/**
 * A bunk cut into the rock: a straw pallet, a wool blanket, the curtain on its rod drawn part way,
 * the miner's cap on a peg and a lamp's hook. The recess at (x, y), `w` by `h`.
 */
function bunk(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number, drawn: number): void {
  recess(ctx, x, y, w, h, ROCK, 5);
  const bed = y + h - 12;
  glossPoly(ctx, K, [x + 5, y + h - 5, x + 5, bed + 2, x + 9, bed - 2, x + w - 9, bed - 2, x + w - 5, bed + 2, x + w - 5, y + h - 5], '#c8a860', { gloss: 0.1, h: 60, tex: 'bristle', seed, amount: 0.4 });
  const wool = WOOL[seed % WOOL.length];
  glossPoly(ctx, K, [x + w * 0.3, y + h - 5, x + w * 0.32, bed - 3, x + w * 0.5, bed - 6, x + w - 8, bed - 4, x + w - 5, y + h - 5], wool, { gloss: 0.1, spread: 0.8 });
  line(ctx, [x + w * 0.4, bed - 4, x + w * 0.44, y + h - 6], rgba(shade(wool, 0.6), 0.8), 1);
  // The cap on its peg, and the curtain.
  glossBall(ctx, K, x + 10, y + 12, 1.5, OAK, {});
  glossPoly(ctx, K, [x + 4, y + 22, x + 5, y + 15, x + 10, y + 12, x + 15, y + 15, x + 16, y + 22], '#3a2a20', { gloss: 0.25 });
  line(ctx, [x - 2, y + 2, x + w + 2, y + 2], '#120c14', 2.5); line(ctx, [x - 2, y + 2, x + w + 2, y + 2], shade(IRON, 1.4), 1);
  if (drawn > 0) cloth(ctx, x + w - w * drawn, x + w + 2, y + 3, h - 6, '#8a6a42', seed);
}

/**
 * The candle arch on the mantel, foot on y: an arch of black iron like the mine's mouth, a candle
 * on every step of it and the hammer and pick cut out in its middle. The mining country lights
 * one in the window at the year's end; here it stands lit all year.
 */
function candleArch(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  const r = w / 2, h = w * 0.62;
  const curve = (g: number): number[] => { const p: number[] = []; for (let i = 0; i <= 18; i++) { const a = Math.PI + (i / 18) * Math.PI; p.push(x + Math.cos(a) * (r + g), y - 3 + Math.sin(a) * (h + g)); } return p; };
  line(ctx, curve(0), '#120c14', 5); line(ctx, curve(0), '#2a2828', 3);
  line(ctx, curve(-6), '#120c14', 3); line(ctx, curve(-6), '#2a2828', 1.5);
  line(ctx, [x - r - 2, y, x + r + 2, y], '#120c14', 4); line(ctx, [x - r - 2, y, x + r + 2, y], '#2a2828', 2);
  hammerPick(ctx, x, y - h * 0.42, r * 0.55, '#2a2828');
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + ((i + 0.5) / 7) * Math.PI, cx = x + Math.cos(a) * r, cy = y - 3 + Math.sin(a) * h;
    glossPoly(ctx, K, [cx - 1.3, cy, cx - 1.3, cy - 6, cx + 1.3, cy - 6, cx + 1.3, cy], '#efe4c8', {});
    flame(s, cx, cy - 7, 1.6, 40, 0.35);
  }
}

/** A stone stein with a pewter lid, foot on y. */
function stein(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, glaze: string): void {
  const w = h * 0.6;
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + w * 0.5, y - h * 0.5, h * 0.24, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.strokeStyle = shade(glaze, 0.8); ctx.lineWidth = 1.5; ctx.stroke();
  glossPoly(ctx, K, [x - w * 0.5, y, x - w * 0.44, y - h, x + w * 0.44, y - h, x + w * 0.5, y], glaze, { gloss: 0.4, spread: 0.7 });
  for (const f of [0.2, 0.8]) line(ctx, [x - w * 0.48, y - h * f, x + w * 0.48, y - h * f], rgba('#2a2a3a', 0.7), 1);
  glossPoly(ctx, K, [x - w * 0.5, y - h, x - w * 0.36, y - h - 3, x + w * 0.4, y - h - 3, x + w * 0.52, y - h], '#9a9aa4', { gloss: 0.7 });
  glossBall(ctx, K, x + w * 0.46, y - h - 3, 1.5, '#9a9aa4', { gloss: 0.7 });
}

/** A miner's boots set to dry before the hearth, soles toward the fire, foot on y. */
function boots(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
  for (const dx of [0, h * 0.5]) glossPoly(ctx, K, [x + dx, y, x + dx, y - h, x + dx + h * 0.32, y - h, x + dx + h * 0.32, y - h * 0.3, x + dx + h * 0.55, y - h * 0.2, x + dx + h * 0.55, y], '#3a2a20', { gloss: 0.3, spread: 0.7 });
}

export const ANVILHALL_INN: Scene = {
  ambient: ['#221c20', '#56504e'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    ashlar(ctx, 0, 0, STAGE_W, FLOOR, 8, 672, STONE);
    flagstones(ctx, FLOOR, 200, 110, '#5e5650', 6, 673);
    vault(ctx);
    // The bunks, cut into the wall in two tiers on the left, a ladder to the upper, the script over them.
    oldScript(ctx, 97, 72, 150, 675, 5, STONE);
    for (let i = 0; i < 3; i++) { bunk(ctx, 16 + i * 56, 84, 50, 46, 676 + i, [0.5, 0, 0.8][i]); bunk(ctx, 16 + i * 56, 140, 50, 50, 680 + i, [0, 0.6, 0.3][i]); }
    for (const lx of [64, 76]) { line(ctx, [lx, 82, lx, FLOOR + 2], '#120c14', 4); line(ctx, [lx, 82, lx, FLOOR + 2], OAK, 2.5); }
    for (let r = 0; r < 6; r++) { line(ctx, [64, 92 + r * 19, 76, 92 + r * 19], '#120c14', 3); line(ctx, [64, 92 + r * 19, 76, 92 + r * 19], shade(OAK, 1.2), 1.5); }
    frogLamp(ctx, s, 44, 88, 8, 70); frogLamp(ctx, s, 156, 144, 8, 70);
    // The window out to the terraces.
    rockWindow(ctx, s, 196, 82, 36, 54, terraceView(196, 82, 36, 54, s.daylight, 3), { arched: true, bars: 1, splay: 8, base: STONE });
    // The hearth, the candle arch on its mantel, a miner's boots drying before it.
    const box = hearth(ctx, s, 250, 70, 108, FLOOR, '#7a6e64', 677, { mantel: OAK, reach: 250 });
    candleArch(ctx, s, 304, box.y - 26, 46);
    boots(ctx, 236, FLOOR + 10, 14);
    // The cask on its cradle in the corner.
    for (const lx of [368, 392]) { line(ctx, [lx - 6, FLOOR + 6, lx, FLOOR - 26, lx + 6, FLOOR + 6], '#120c14', 4); line(ctx, [lx - 6, FLOOR + 6, lx, FLOOR - 26, lx + 6, FLOOR + 6], OAK, 2.5); }
    barrel(ctx, 380, FLOOR - 16, 34, 40, '#7a5434', IRON, 678);
    // The long table in front, its benches, the steins and the bread.
    contact(ctx, 200, STAGE_H - 2, 260, 0.35);
    slab(ctx, 70, 236, 260, 9, '#5a3e28', { lit: 2, dark: 0.35 });
    fillPoly(ctx, [70, 236, 84, 224, 316, 224, 330, 236], shade('#6a4a30', 1.15));
    for (let i = 1; i < 3; i++) line(ctx, [70 + i * 4.6, 236 - i * 4, 330 - i * 4.6, 236 - i * 4], rgba('#2a1a10', 0.35), 1);
    for (const lx of [90, 300]) slab(ctx, lx, 245, 10, STAGE_H - 245, '#4a3220', { lit: 1 });
    stein(ctx, 120, 232, 15, '#8a7a6a'); stein(ctx, 160, 230, 14, '#6a6a7a'); stein(ctx, 262, 230, 14, '#8a7a6a'); stein(ctx, 296, 233, 15, '#7a6a5a');
    loaf(ctx, 206, 230, 22); cheese(ctx, 234, 232, 16);
    candle(ctx, s, 186, 230, 10, '#efe4c8', 110);
    stool(ctx, 40, STAGE_H + 4, 30, '#5a4030');
  },
};
