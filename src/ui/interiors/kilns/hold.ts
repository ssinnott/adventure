// What Anvilhall's rooms share: the rock the dwarves cut their hold from, dressed into blocks or
// left with the pick's marks on it; the old script cut over their doors; their verse painted red;
// the frog lamps the miners hang on a nail; the hammer and pick; and the heart seen from the
// terraces through a window cut in the rock. The scenes are beside it, one to a business.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Stage } from '../kit.ts';
import { rnd, line, smudge, fillPoly, path, ink, pool, skyFill, clipRect, stones, DAY_POOL } from '../kit.ts';
import { K } from '../props.ts';
import { glossPoly, glossBall } from '../../monsters/gloss.ts';
import { drawText } from '../../../lib/engine/text.ts';

/** The hold's rock, its iron, its lamps' brass, the verse's red and the miners' black. */
export const ROCK = '#6c625a', IRON = '#3c3a42', BRASS = '#b8883a', RED = '#c0301e', BLACK = '#1e1c22';

/** Dressed stone as the dwarves lay it: long blocks, close joints, a warm dark grey with iron in it. */
export function ashlar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rows: number, seed: number, base = ROCK): void {
  stones(ctx, x, y, w, h, base, rows, seed, { long: 2.4, mortar: shade(base, 0.42), mottle: '#7a4a32' });
}

/**
 * Rock cut back to a face and left as the pick left it: strata lying in faint bands, an ore vein
 * glinting through and the pick's strokes in courses, each course leaning the other way.
 */
export function hewn(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number, base = ROCK): void {
  ctx.save(); clipRect(ctx, x, y, w, h);
  ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
  for (let i = 0; i < 6; i++) {
    const by = y + rnd(seed, i, 1) * h, bh = 8 + rnd(seed, i, 2) * 24, tone = rnd(seed, i, 3) > 0.5 ? shade(base, 1.1) : shade(base, 0.86), pts: number[] = [];
    for (let k = 0; k <= 16; k++) pts.push(x + (w * k) / 16, by + Math.sin(k * 0.7 + i * 1.7 + seed) * 5);
    for (let k = 16; k >= 0; k--) pts.push(x + (w * k) / 16, by + bh + Math.sin(k * 0.6 + i * 2.3 + seed) * 5);
    fillPoly(ctx, pts, rgba(tone, 0.6));
  }
  for (let i = 0; i < (w * h) / 1400; i++) smudge(ctx, x + rnd(seed, i, 4) * w, y + rnd(seed, i, 5) * h, 6 + rnd(seed, i, 6) * 16, rnd(seed, i, 7) > 0.5 ? shade(base, 1.15) : shade(base, 0.75), 0.4);
  // The pick's strokes, a course at a time.
  const ch = 10, dark = rgba(shade(base, 0.5), 0.45), lit = rgba(shade(base, 1.35), 0.25);
  for (let r = 0; r * ch < h + ch; r++) {
    const dir = r % 2 ? 1 : -1, cy = y + r * ch - 2;
    for (let cx = x - 8 + rnd(seed, r, 8) * 5, j = 0; cx < x + w + 8; cx += 5 + rnd(seed, r, j, 9) * 3, j++) {
      line(ctx, [cx, cy, cx + dir * 4, cy + ch - 3], dark, 1);
      line(ctx, [cx + 1, cy + 1, cx + 1 + dir * 4, cy + ch - 2], lit, 1);
    }
  }
  // An ore vein, rusty, in broken lengths, catching the light in flecks.
  const vy = y + h * (0.3 + rnd(seed, 11) * 0.4), vein: number[] = [];
  for (let k = 0; k <= 12; k++) vein.push(x + (w * k) / 12, vy + Math.sin(k * 1.1 + seed) * h * 0.06 + (rnd(seed, k, 12) - 0.5) * 6);
  for (let k = 0; k < 12; k++) if (rnd(seed, k, 14) < 0.45) line(ctx, vein.slice(k * 2, k * 2 + 4), rgba(mix(base, '#8a4a2a', 0.6), 0.5), 1.5);
  for (let k = 0; k < 8; k++) { const u = rnd(seed, k, 13) * 12, i0 = Math.floor(u); ctx.fillStyle = rgba('#e8c890', 0.55); ctx.fillRect(Math.round(vein[i0 * 2] + (u - i0) * (w / 12)), Math.round(vein[i0 * 2 + 1]), 1, 1); }
  ctx.restore();
}

/** A recess cut into the rock: its top and left walls in shadow, its foot and right wall lit, the back a shade darker. */
export function recess(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, base = ROCK, d = 4): void {
  fillPoly(ctx, [x, y, x + w, y, x + w - d, y + d, x + d, y + d], shade(base, 0.45));
  fillPoly(ctx, [x, y, x + d, y + d, x + d, y + h - d, x, y + h], shade(base, 0.6));
  fillPoly(ctx, [x + w, y, x + w, y + h, x + w - d, y + h - d, x + w - d, y + d], shade(base, 1.15));
  fillPoly(ctx, [x, y + h, x + d, y + h - d, x + w - d, y + h - d, x + w, y + h], shade(base, 1.25));
  ctx.fillStyle = shade(base, 0.7); ctx.fillRect(x + d, y + d, w - d * 2, h - d * 2);
  path(ctx, [x, y, x + w, y, x + w, y + h, x, y + h]); ink(ctx);
}

/**
 * A line of the old script cut over a door: angular marks, triangles and bars and hooks, each
 * cut in, with a shadow along its upper edge and the light caught along its lower. `w` across,
 * marks `g` high, centred on (cx, y). The dwarves read it as scripture; it is never lettered.
 */
export function oldScript(ctx: CanvasRenderingContext2D, cx: number, y: number, w: number, seed: number, g = 5, base = ROCK): void {
  const n = Math.floor(w / (g * 1.7)), x0 = cx - (n * g * 1.7) / 2, cut = shade(base, 0.35), lip = rgba(shade(base, 1.5), 0.7);
  for (let i = 0; i < n; i++) {
    const x = x0 + i * g * 1.7 + g * 0.35, k = Math.floor(rnd(seed, i) * 6);
    if (rnd(seed, i, 1) < 0.12) continue; // a gap between words
    const shapes: number[][] = [
      [x, y + g, x + g / 2, y, x + g, y + g, x, y + g],
      [x, y, x + g, y, x + g / 2, y + g, x, y],
      [x, y, x + g / 2, y + g / 2, x, y + g],
      [x + g / 2, y, x + g / 2, y + g, x + g / 2, y + g / 2, x + g, y + g / 2],
      [x, y, x + g, y, x + g, y + g],
      [x, y + g / 2, x + g, y + g / 2, x + g / 2, y, x + g / 2, y + g],
    ];
    const pts = shapes[k];
    line(ctx, pts.map((v, j) => j % 2 ? v + 1 : v + 0.5), lip, 1);
    line(ctx, pts, cut, 1.3);
  }
}

/**
 * The verse, cut in the rock and painted red: each letter's cut shows as a dark edge over the
 * paint and a lit one under it. Lines centred on cx, the first at y.
 */
export function verse(ctx: CanvasRenderingContext2D, lines: readonly string[], cx: number, y: number, size: number, base = ROCK, red = RED): void {
  const lh = 9 * size + size;
  lines.forEach((t, i) => {
    const ly = y + i * lh;
    drawText(ctx, t, cx + 1, ly + 1, { size, color: rgba(shade(base, 1.4), 0.5), align: 'center', shadow: false });
    drawText(ctx, t, cx - 1, ly - 1, { size, color: shade(base, 0.3), align: 'center', shadow: false });
    drawText(ctx, t, cx, ly, { size, color: red, align: 'center', shadow: false });
  });
}

/**
 * A frog lamp, the miner's own, hung by its hook from a nail at (x, y): the iron hanger, the
 * squat lidded body and the spout its flame burns at. Lights a small warm pool, unless `lit` is
 * false, as one for sale is.
 */
export function frogLamp(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, size: number, reach = size * 12, metal = BRASS, lit = true): void {
  const by = y + size * 0.95;
  ctx.fillStyle = '#2a2428'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 3, 3);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - size * 0.35, y + size * 0.4, x - size * 0.2, by); ctx.stroke();
  ctx.strokeStyle = shade(IRON, 1.5); ctx.lineWidth = 1.2; ctx.stroke();
  glossPoly(ctx, K, [x - size * 0.42, by, x - size * 0.36, by - size * 0.26, x + size * 0.1, by - size * 0.3, x + size * 0.5, by - size * 0.12, x + size * 0.62, by - size * 0.04, x + size * 0.5, by + size * 0.06, x - size * 0.3, by + size * 0.14], metal, { gloss: 0.6, spread: 0.7 });
  line(ctx, [x - size * 0.34, by - size * 0.22, x + size * 0.12, by - size * 0.26], rgba('#120c14', 0.6), 1);
  glossBall(ctx, K, x - size * 0.1, by - size * 0.3, size * 0.07, shade(metal, 0.8), {});
  if (!lit) return;
  const fx = x + size * 0.6, fy = by - size * 0.08;
  s.lights.push({ k: 'flame', x: fx, y: fy, s: Math.max(1.6, size * 0.2) });
  pool(s, fx, fy - size * 0.3, reach, '#ffb060', 0.7);
}

/** The miners' hammer and pick crossed, heads up, centred on (cx, cy) and `r` across; inlaid in `metal`. */
export function hammerPick(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, metal = BRASS): void {
  const haft = (sd: number): void => {
    const x0 = cx - sd * r * 0.62, y0 = cy + r * 0.62, x1 = cx + sd * r * 0.5, y1 = cy - r * 0.5;
    line(ctx, [x0, y0, x1, y1], '#120c14', Math.max(2.5, r * 0.2)); line(ctx, [x0, y0, x1, y1], metal, Math.max(1.2, r * 0.11));
  };
  haft(1); haft(-1);
  // The hammer's head, a block across its haft at the top right.
  const hx = cx + r * 0.5, hy = cy - r * 0.5, a = r * 0.3, b = r * 0.14;
  glossPoly(ctx, K, [hx - a * 0.7 - b, hy - a * 0.7 + b, hx - a * 0.7 + b * 0.2, hy - a * 0.7 - b * 0.9, hx + a * 0.7 + b * 0.9, hy + a * 0.7 - b * 0.2, hx + a * 0.7 - b * 0.2, hy + a * 0.7 + b * 0.9], metal, { gloss: 0.6 });
  // The pick's iron, a long point across its haft at the top left.
  const px = cx - r * 0.5, py = cy - r * 0.5, c = r * 0.42;
  glossPoly(ctx, K, [px + c * 0.7, py - c * 0.5, px + c * 0.3, py - c * 0.25, px - c * 0.62, py + c * 0.58, px - c * 0.1, py + c * 0.1], metal, { gloss: 0.6 });
}

/**
 * The heart from Anvilhall's terraces: hills folding away south under the sky, Gluthutte's smoke
 * standing up out of the far woods, ash darkening the south-east; by night the hills black and a
 * red glow low on the sky where the fires are.
 */
export function terraceView(x: number, y: number, w: number, h: number, daylight: number, seed = 0) {
  return (ctx: CanvasRenderingContext2D): void => {
    const d = daylight;
    skyFill(ctx, x, y, w, h, d, seed + 401);
    const hz = y + h * 0.55;
    if (d < 0.5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, x + w * 0.7, hz, w * 0.5, '#ff5a2a', 0.35 * (1 - d * 2)); ctx.restore(); }
    // The smoke, standing up out of the woods and leaning off as it rises.
    for (let i = 0; i < 9; i++) { const u = i / 8; smudge(ctx, x + w * (0.3 + u * u * 0.2), hz - u * h * 0.45, w * (0.04 + u * 0.06), mix('#2a2024', '#a8a098', d), 0.5 - u * 0.3); }
    const bands: [string, string, number, number][] = [['#1a1820', '#8a9a8c', 0.5, 0.03], ['#141218', '#6a7a5a', 0.62, 0.05], ['#0e0c10', '#5a5a3a', 0.78, 0.07]];
    bands.forEach(([night, day, at, amp], b) => {
      const pts = [x, y + h];
      for (let k = 0; k <= 10; k++) pts.push(x + (w * k) / 10, y + h * at + Math.sin(k * 1.3 + b * 2 + seed) * h * amp + rnd(seed, b, k) * h * 0.02);
      pts.push(x + w, y + h);
      fillPoly(ctx, pts, mix(night, day, d));
      // The ash, a dark stain over the farthest hills to the south-east.
      if (b === 0) { ctx.save(); path(ctx, pts); ctx.clip(); ctx.fillStyle = rgba(mix('#0a0808', '#3a3434', d), 0.7); ctx.fillRect(x + w * 0.66, y, w * 0.34, h); ctx.restore(); }
    });
  };
}

/**
 * A window cut through the rock: a deep splayed reveal round the opening, its sill lit, an iron
 * bar or two across it and what is outside painted by `view`. Lights the room cool by day.
 */
export function rockWindow(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number, h: number, view: (ctx: CanvasRenderingContext2D) => void, o: { splay?: number; bars?: number; base?: string; arched?: boolean } = {}): void {
  const d = o.splay ?? Math.max(6, w * 0.22), base = o.base ?? ROCK, bars = o.bars ?? 0;
  const top = o.arched ? y + w / 2 : y;
  const outer = (g: number): void => {
    ctx.beginPath(); ctx.moveTo(x - g, y + h + g);
    if (o.arched) { ctx.lineTo(x - g, top); ctx.arc(x + w / 2, top, w / 2 + g, Math.PI, 0); } else { ctx.lineTo(x - g, y - g); ctx.lineTo(x + w + g, y - g); }
    ctx.lineTo(x + w + g, y + h + g); ctx.closePath();
  };
  // The reveal: lit along the sill and the far side, in shadow along the head and the near side.
  outer(d); ctx.fillStyle = shade(base, 0.7); ctx.fill();
  ctx.save(); outer(d); ctx.clip();
  const g = ctx.createLinearGradient(x - d, 0, x + w + d, 0);
  g.addColorStop(0, rgba('#0a0608', 0.35)); g.addColorStop(0.5, rgba('#0a0608', 0)); g.addColorStop(1, rgba(shade(base, 1.5), 0.25));
  ctx.fillStyle = g; ctx.fillRect(x - d, y - d, w + d * 2, h + d * 2);
  fillPoly(ctx, [x - d, y + h + d, x, y + h, x + w, y + h, x + w + d, y + h + d], shade(base, 1.2));
  ctx.restore();
  outer(d); ink(ctx);
  outer(0); ctx.save(); ctx.clip(); view(ctx);
  ctx.fillStyle = rgba('#0a0608', 0.3); ctx.fillRect(x, y - 2, w, Math.max(2, h * 0.05));
  ctx.restore();
  outer(0); ink(ctx);
  for (let i = 1; i <= bars; i++) { const bx = x + (w * i) / (bars + 1); line(ctx, [bx, y + (o.arched ? 2 : 0), bx, y + h], '#120c14', 3); line(ctx, [bx, y, bx, y + h], shade(IRON, 1.4), 1.4); }
  if (s.daylight > 0.15) pool(s, x + w / 2, y + h * 0.7, Math.max(w, h) * 2.4, DAY_POOL, 0.6 * s.daylight);
}
