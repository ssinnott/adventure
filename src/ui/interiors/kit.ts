// The kit the town's business interiors are painted with; ../interior.ts shows them. A scene is
// laid out on a 400x268 stage, the viewport's own size, in the game's look: walls textured flat
// like the viewport's, props with a 1 px ink outline, a lit top-left edge and a shadow side. The
// light is done as light. While a scene paints, every lamp, fire and window it puts down also
// drops a pool into the room's light map; the finished painting is multiplied by that map (the
// ambient for the hour, warmed and brightened round each pool), so a corner far from the fire
// falls into shadow on its own. The flames themselves are Lights, redrawn every frame over the
// cached painting, as the viewport does with its torches.
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { makeTones, pathRR } from '../../lib/art/shading.ts';
import type { Tones } from '../../lib/art/shading.ts';

export const STAGE_W = 400, STAGE_H = 268;
export const INK = '#120c14';

/** Something redrawn every frame over the cached painting. */
export type Light =
  /** A small flame: a candle, a lamp, a torch. `s` is its width. */
  | { k: 'flame'; x: number; y: number; s: number }
  /** A fire on a hearth's bed, `w` wide, its tallest tongue `h`. */
  | { k: 'fire'; x: number; y: number; w: number; h: number }
  /** A glow that breathes: coals, a crystal, a lamp's globe. */
  | { k: 'glow'; x: number; y: number; r: number; color: string; a: number }
  /** Specks drifting in a box: dust in a sunbeam, sparks off a forge, a guild's wisps. `rise` px a frame. */
  | { k: 'motes'; x: number; y: number; w: number; h: number; color: string; n: number; rise: number };

/** A pool of light in the room's light map: `color` out to radius `r`, `a` strong at the centre. */
export interface Pool { x: number; y: number; r: number; color: string; a: number }

/** What a scene is painted into. */
export interface Stage {
  /** 0 at midnight .. 1 at noon. */
  readonly daylight: number;
  /** The animated lights, drawn over the painting every frame. */
  readonly lights: Light[];
  /** The pools the room's light map is made from. */
  readonly pools: Pool[];
}

/** A business's interior: one painting, lit by what burns and shines in it. */
export interface Scene {
  /** The light the room sits in away from every lamp: at midnight, and at noon. */
  readonly ambient: readonly [string, string];
  paint(ctx: CanvasRenderingContext2D, s: Stage): void;
}

// ------------------------------------------------------------------ basics ----

/** Stable 0..1 noise: the same arguments always give the same answer, and neighbours do not correlate. */
export function rnd(a: number, b = 0, c = 0, d = 0): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177) + Math.imul(d | 0, 1103515245)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/** A colour's tone ramp (lit, base, shadow, deep), uncached: the walls throw away a colour per block. */
export function ramp(hex: string): Tones { return makeTones(hex); }

/** A flat point list walked the other way round. */
export function reversed(pts: readonly number[]): number[] {
  const out: number[] = [];
  for (let i = pts.length - 2; i >= 0; i -= 2) out.push(pts[i], pts[i + 1]);
  return out;
}
export function path(ctx: CanvasRenderingContext2D, pts: readonly number[]): void {
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath();
}
export function fillPoly(ctx: CanvasRenderingContext2D, pts: readonly number[], fill: string | CanvasGradient): void {
  path(ctx, pts); ctx.fillStyle = fill; ctx.fill();
}
/** The ink line round the current path. */
export function ink(ctx: CanvasRenderingContext2D, w = 1): void {
  ctx.strokeStyle = INK; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
}
export function inkRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
}
export function line(ctx: CanvasRenderingContext2D, pts: readonly number[], color: string, w = 1): void {
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}
export function clipRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
}
/** A soft round of colour fading to nothing: a stain, a patch of light, a shadow on a wall. */
export function smudge(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, a: number): void {
  if (r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
/** The contact shadow under something standing on a floor, a shelf or a counter. */
export function contact(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, a = 0.4): void {
  ctx.beginPath(); ctx.ellipse(x, y, w / 2, Math.max(1.2, w * 0.1), 0, 0, Math.PI * 2);
  ctx.fillStyle = rgba('#0a0608', a); ctx.fill();
}

/** A cel-shaded box face: base, a lit strip along the top and left, a shadow band along the bottom and right, ink round it. */
export function slab(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, hex: string, o: { lit?: number; dark?: number; outline?: boolean } = {}): void {
  const t = ramp(hex);
  ctx.fillStyle = hex; ctx.fillRect(x, y, w, h);
  const lit = o.lit ?? Math.max(1, Math.min(3, Math.min(w, h) * 0.15)), dark = o.dark ?? 0.3;
  ctx.fillStyle = t.sh; ctx.fillRect(x, y + h * (1 - dark), w, h * dark);
  ctx.fillRect(x + w - Math.max(1, w * dark * 0.25), y, Math.max(1, w * dark * 0.25), h);
  ctx.fillStyle = t.hi; ctx.fillRect(x, y, w, lit); ctx.fillRect(x, y, Math.max(1, lit * 0.6), h * (1 - dark));
  if (o.outline !== false) inkRect(ctx, x, y, w, h);
}

// ------------------------------------------------------------------ walls ----

/** Lime plaster: a warm field, mottled where it was patched, faintly stained toward floor and ceiling. */
export function plaster(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, base: string, seed = 0): void {
  ctx.save(); clipRect(ctx, x, y, w, h);
  ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
  const n = Math.round((w * h) / 700);
  for (let i = 0; i < n; i++) {
    const px = x + rnd(seed, i, 1) * w, py = y + rnd(seed, i, 2) * h, pr = 5 + rnd(seed, i, 3) * 20;
    smudge(ctx, px, py, pr, rnd(seed, i, 4) > 0.45 ? shade(base, 1.1) : shade(base, 0.84), 0.45);
  }
  // Soot drawn up toward the ceiling, damp at the skirting.
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, rgba('#2a1a10', 0.28)); g.addColorStop(0.22, rgba('#2a1a10', 0)); g.addColorStop(0.85, rgba('#2a1a10', 0)); g.addColorStop(1, rgba('#2a1a10', 0.22));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  // A few hairline cracks.
  for (let i = 0; i < Math.round(w / 90); i++) {
    const cx = x + rnd(seed, 50, i) * w, cy = y + rnd(seed, 51, i) * h, pts = [cx, cy];
    for (let k = 1; k < 5; k++) pts.push(cx + (rnd(seed, 52, i, k) - 0.5) * 14, cy + k * (3 + rnd(seed, 53, i, k) * 4));
    line(ctx, pts, rgba(shade(base, 0.6), 0.6), 1);
  }
  ctx.restore();
}

/** A squared timber, lying or upright: lit along its top or left edge, shadowed along the other, grained, inked. */
export function beam(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wood: string, seed = 0): void {
  const t = ramp(wood), along = w >= h, th = along ? h : w, len = along ? w : h;
  ctx.fillStyle = wood; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = t.sh;
  if (along) ctx.fillRect(x, y + h * 0.6, w, h * 0.4); else ctx.fillRect(x + w * 0.6, y, w * 0.4, h);
  ctx.fillStyle = t.hi;
  if (along) ctx.fillRect(x, y, w, Math.max(1, h * 0.14)); else ctx.fillRect(x, y, Math.max(1, w * 0.14), h);
  ctx.save(); clipRect(ctx, x, y, w, h);
  const n = Math.max(2, Math.floor(th / 3.5));
  for (let i = 0; i < n; i++) {
    const off = (i + 0.5) / n * th, pts: number[] = [];
    for (let k = 0; k <= 8; k++) {
      const u = (k / 8) * len, v = off + Math.sin(k * 0.9 + i * 2.1 + seed) * th * 0.06;
      if (along) pts.push(x + u, y + v); else pts.push(x + v, y + u);
    }
    line(ctx, pts, rgba(t.deep, 0.35), 1);
  }
  // A knot or two.
  for (let i = 0; i < Math.floor(len / 70) + 1; i++) {
    if (rnd(seed, 9, i) > 0.6) continue;
    const u = rnd(seed, 10, i) * len, v = th * (0.3 + rnd(seed, 11, i) * 0.4);
    ctx.beginPath(); ctx.ellipse(along ? x + u : x + v, along ? y + v : y + u, along ? th * 0.22 : th * 0.12, along ? th * 0.12 : th * 0.22, 0, 0, Math.PI * 2);
    ctx.fillStyle = rgba(t.deep, 0.6); ctx.fill();
  }
  ctx.restore();
  inkRect(ctx, x, y, w, h);
}

/**
 * Coursed stone: rows of blocks of uneven length in mortar, each lit along its top edge and
 * shadowed along its foot and right side, so the wall has relief in the room's light.
 */
export function stones(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, base: string, rows: number, seed = 0, o: { long?: number; mortar?: string; mottle?: string } = {}): void {
  ctx.save(); clipRect(ctx, x, y, w, h);
  ctx.fillStyle = o.mortar ?? shade(base, 0.52); ctx.fillRect(x, y, w, h);
  const rh = h / rows, long = o.long ?? 1.6;
  for (let i = 0; i < rows; i++) {
    let bx = x - rnd(seed, i, 7) * rh * long, j = 0;
    while (bx < x + w) {
      const bw = rh * long * (0.7 + rnd(seed, i, j, 1) * 0.8);
      let col = shade(base, 0.84 + rnd(seed, i, j, 2) * 0.3);
      if (o.mottle && rnd(seed, i, j, 5) > 0.78) col = mix(col, o.mottle, 0.35);
      block(ctx, bx + 1, y + i * rh + 1, bw - 1, rh - 1, col, seed * 31 + i * 7 + j);
      bx += bw; j++;
    }
  }
  ctx.restore();
}

/** One dressed stone: slightly rounded, lit on top and left, shadowed underneath and to the right, a chip or two. */
export function block(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, col: string, seed = 0): void {
  const t = ramp(col);
  const r = Math.min(3, h * 0.2, w * 0.2);
  pathRR(ctx, x, y, w, h, r); ctx.fillStyle = col; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = t.sh; ctx.fillRect(x, y + h * 0.72, w, h); ctx.fillRect(x + w - Math.max(1.5, w * 0.07), y, w, h);
  ctx.fillStyle = t.hi; ctx.fillRect(x, y, w, Math.max(1, h * 0.13)); ctx.fillRect(x, y, Math.max(1, w * 0.04), h * 0.7);
  if (w > 10 && h > 6) for (let i = 0; i < 2; i++) {
    if (rnd(seed, i, 3) > 0.55) continue;
    const cx = x + w * (0.2 + rnd(seed, i, 4) * 0.6), cy = y + h * (0.3 + rnd(seed, i, 5) * 0.4);
    ctx.fillStyle = rgba(t.deep, 0.5); ctx.fillRect(Math.round(cx), Math.round(cy), 2, 1);
    ctx.fillStyle = rgba(t.hi, 0.7); ctx.fillRect(Math.round(cx), Math.round(cy) - 1, 2, 1);
  }
  ctx.restore();
}

/** Boards side by side, upright or lying, with a dark gap between, grain, the odd knot and a nail at each end. */
export function planks(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wood: string, count: number, upright: boolean, seed = 0): void {
  ctx.save(); clipRect(ctx, x, y, w, h);
  ctx.fillStyle = shade(wood, 0.42); ctx.fillRect(x, y, w, h);
  const span = (upright ? w : h) / count, len = upright ? h : w;
  for (let i = 0; i < count; i++) {
    const col = shade(wood, 0.86 + rnd(seed, i) * 0.24), t = ramp(col);
    const a = (upright ? x : y) + i * span;
    const px = upright ? a + 0.5 : x, py = upright ? y : a + 0.5, pw = upright ? span - 1 : w, ph = upright ? h : span - 1;
    ctx.fillStyle = col; ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = t.hi; if (upright) ctx.fillRect(px, py, 1, ph); else ctx.fillRect(px, py, pw, 1);
    ctx.fillStyle = rgba(t.sh, 0.8); if (upright) ctx.fillRect(px + pw - 1.5, py, 1.5, ph); else ctx.fillRect(px, py + ph - 1.5, pw, 1.5);
    const lines = Math.max(1, Math.floor(span / 5));
    for (let k = 0; k < lines; k++) {
      const off = (k + 0.5) / lines * (span - 1), pts: number[] = [];
      for (let q = 0; q <= 10; q++) {
        const u = (q / 10) * len, v = off + Math.sin(q * 0.8 + k * 1.9 + i * 3.1 + seed) * span * 0.08;
        if (upright) pts.push(px + v, py + u); else pts.push(px + u, py + v);
      }
      line(ctx, pts, rgba(t.deep, 0.3), 1);
    }
    if (rnd(seed, i, 2) < 0.5) {
      const u = rnd(seed, i, 3) * len, v = span * 0.5;
      ctx.beginPath(); ctx.ellipse(upright ? a + v : x + u, upright ? y + u : a + v, span * 0.16, span * 0.1, upright ? Math.PI / 2 : 0, 0, Math.PI * 2);
      ctx.fillStyle = rgba(t.deep, 0.55); ctx.fill();
    }
    ctx.fillStyle = '#2a2020';
    for (const u of [len * 0.04, len * 0.96]) ctx.fillRect(Math.round(upright ? a + span / 2 : x + u), Math.round(upright ? y + u : a + span / 2), 1, 1);
  }
  ctx.restore();
}

/**
 * Living wood, as Thornhold builds with it: trunks that rise and lean together, their bark in
 * long ridges, lit down the left of each and falling to shadow on the right.
 */
export function trunk(ctx: CanvasRenderingContext2D, pts: readonly number[], r0: number, r1: number, bark: string, seed = 0): void {
  // pts: a spine of points from the foot upward; r0 at the foot, r1 at the top.
  const n = pts.length / 2, left: number[] = [], right: number[] = [];
  for (let i = 0; i < n; i++) {
    const ax = pts[Math.max(0, i - 1) * 2], ay = pts[Math.max(0, i - 1) * 2 + 1], bx = pts[Math.min(n - 1, i + 1) * 2], by = pts[Math.min(n - 1, i + 1) * 2 + 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const r = r0 + (r1 - r0) * (i / (n - 1));
    left.push(pts[i * 2] - nx * r, pts[i * 2 + 1] - ny * r); right.push(pts[i * 2] + nx * r, pts[i * 2 + 1] + ny * r);
  }
  const outline: number[] = [...left];
  for (let i = n - 1; i >= 0; i--) outline.push(right[i * 2], right[i * 2 + 1]);
  const t = ramp(bark);
  const x0 = Math.min(...outline.filter((_, i) => i % 2 === 0)), x1 = Math.max(...outline.filter((_, i) => i % 2 === 0));
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, t.hi); g.addColorStop(0.35, bark); g.addColorStop(0.8, t.sh); g.addColorStop(1, t.deep);
  path(ctx, outline); ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip();
  // Ridges of bark following the spine.
  const ridges = Math.max(3, Math.round((r0 + r1) / 3));
  for (let k = 0; k < ridges; k++) {
    const f = (k + 0.5) / ridges * 2 - 1, p: number[] = [];
    for (let i = 0; i < n; i++) {
      const lx = left[i * 2], ly = left[i * 2 + 1], rx = right[i * 2], ry = right[i * 2 + 1];
      const u = (f + 1) / 2 + Math.sin(i * 1.3 + k * 2.2 + seed) * 0.03;
      p.push(lx + (rx - lx) * u, ly + (ry - ly) * u);
    }
    line(ctx, p, rgba(t.deep, 0.45), 1);
    if (k % 2 === 0) { const q = p.map((v, i) => i % 2 === 0 ? v - 1 : v); line(ctx, q, rgba(t.hi, 0.25), 1); }
  }
  ctx.restore();
  path(ctx, outline); ink(ctx);
}

// ------------------------------------------------------------------ floors ----

/**
 * Floorboards seen from standing height: from the foot of the back wall at y0 to the bottom of
 * the stage, running away toward the vanishing point (vx, vy), with the butt joints staggered.
 */
export function floorboards(ctx: CanvasRenderingContext2D, y0: number, vx: number, vy: number, wood: string, boards: number, seed = 0): void {
  const W = STAGE_W, H = STAGE_H, k = (H - vy) / (y0 - vy);
  ctx.save(); clipRect(ctx, 0, y0, W, H - y0);
  ctx.fillStyle = shade(wood, 0.4); ctx.fillRect(0, y0, W, H - y0);
  const bw = W / boards, far = Math.ceil((vx - (vx - W) * k) / bw);
  for (let i = -far; i < boards + far; i++) {
    const xa = i * bw, xb = (i + 1) * bw;
    const col = shade(wood, 0.84 + rnd(seed, i, 1) * 0.26), t = ramp(col);
    const q = (x: number, y: number): [number, number] => [vx + (x - vx) * ((y - vy) / (y0 - vy)), y];
    const [ax0] = q(xa + 0.5, y0), [ax1] = q(xa + 0.5, H), [bx0] = q(xb - 0.5, y0), [bx1] = q(xb - 0.5, H);
    fillPoly(ctx, [ax0, y0, bx0, y0, bx1, H, ax1, H], col);
    // The lit edge of each board, and its grain.
    line(ctx, [ax0, y0, ax1, H], rgba(t.hi, 0.6), 1);
    for (let g = 1; g < 3; g++) {
      const u = g / 3, [gx0] = q(xa + bw * u, y0), [gx1] = q(xa + bw * u, H);
      line(ctx, [gx0, y0, gx1, H], rgba(t.deep, 0.18), 1);
    }
    // Butt joints at staggered depths: a board is so long in the world, whatever it measures on screen.
    for (let j = 0; j < 6; j++) {
      const z = 1 - (j + rnd(seed, i, 2)) * 0.22;
      if (z <= 0.05) break;
      const y = vy + (y0 - vy) / z;
      if (y > H) break;
      const [jx0] = q(xa + 0.5, y), [jx1] = q(xb - 0.5, y);
      line(ctx, [jx0, y, jx1, y], rgba('#0a0608', 0.55), 1);
    }
  }
  // Darker toward the wall, where the room's light does not reach under the furniture.
  const g = ctx.createLinearGradient(0, y0, 0, y0 + 26);
  g.addColorStop(0, rgba('#0a0608', 0.45)); g.addColorStop(1, rgba('#0a0608', 0));
  ctx.fillStyle = g; ctx.fillRect(0, y0, W, 26);
  ctx.restore();
}

/** Flagstones in perspective: rows at true depths, joints running to the vanishing point, each stone its own tone. */
export function flagstones(ctx: CanvasRenderingContext2D, y0: number, vx: number, vy: number, stone: string, cols: number, seed = 0): void {
  const W = STAGE_W, H = STAGE_H;
  ctx.save(); clipRect(ctx, 0, y0, W, H - y0);
  ctx.fillStyle = shade(stone, 0.45); ctx.fillRect(0, y0, W, H - y0);
  const cw = W / cols, k = (H - vy) / (y0 - vy), far = Math.ceil((vx + (W - vx) * k) / cw);
  const q = (x: number, y: number): number => vx + (x - vx) * ((y - vy) / (y0 - vy));
  const rowsY: number[] = [y0];
  for (let j = 1; j < 30; j++) { const y = vy + (y0 - vy) / (1 - j * 0.16); if (y > H || y < y0) { rowsY.push(H + 1); break; } rowsY.push(y); }
  for (let r = 0; r < rowsY.length - 1; r++) {
    const ya = rowsY[r], yb = rowsY[r + 1], off = (r % 2) * 0.5;
    for (let i = -far; i < cols + far; i++) {
      const xa = (i + off) * cw, xb = (i + 1 + off) * cw;
      const col = shade(stone, 0.82 + rnd(seed, r, i) * 0.3), t = ramp(col);
      const pts = [q(xa, ya) + 1, ya + 0.8, q(xb, ya) - 1, ya + 0.8, q(xb, yb) - 1, yb - 0.8, q(xa, yb) + 1, yb - 0.8];
      fillPoly(ctx, pts, col);
      line(ctx, [pts[0], pts[1], pts[2], pts[3]], rgba(t.hi, 0.7), 1);
    }
  }
  const g = ctx.createLinearGradient(0, y0, 0, y0 + 24);
  g.addColorStop(0, rgba('#0a0608', 0.4)); g.addColorStop(1, rgba('#0a0608', 0));
  ctx.fillStyle = g; ctx.fillRect(0, y0, W, 24);
  ctx.restore();
}

// ------------------------------------------------------------------ light ----

/** Light the room from here: a pool in the light map. */
export function pool(s: Stage, x: number, y: number, r: number, color: string, a = 1): void { s.pools.push({ x, y, r, color, a }); }

/**
 * The light map for a scene: the ambient for the hour, darker toward the corners, with every pool
 * added into it. Multiplying the painting by it lights the room; it never brightens past the paint.
 */
export function lightMap(g: CanvasRenderingContext2D, ambient: string, pools: readonly Pool[]): void {
  const W = STAGE_W, H = STAGE_H;
  g.fillStyle = ambient; g.fillRect(0, 0, W, H);
  const v = g.createRadialGradient(W / 2, H * 0.45, H * 0.35, W / 2, H * 0.45, W * 0.72);
  v.addColorStop(0, rgba('#000000', 0)); v.addColorStop(1, rgba('#000000', 0.35));
  g.fillStyle = v; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'lighter';
  for (const p of pools) {
    const r = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    r.addColorStop(0, rgba(p.color, p.a)); r.addColorStop(0.45, rgba(p.color, p.a * 0.45)); r.addColorStop(1, rgba(p.color, 0));
    g.fillStyle = r; g.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
  }
  g.globalCompositeOperation = 'source-over';
}

export const FLAME_POOL = '#ffb060', DAY_POOL = '#b8d0f0';

/** A candle's or lamp's flame, and the warm pool round it. */
export function flame(s: Stage, x: number, y: number, size: number, reach = size * 16, a = 0.8): void {
  s.lights.push({ k: 'flame', x, y, s: size });
  pool(s, x, y - size, reach, FLAME_POOL, a);
}

/** Draw every animated light in `lights` for this frame. */
export function drawLights(ctx: CanvasRenderingContext2D, lights: readonly Light[], frame: number): void {
  for (const l of lights) {
    if (l.k === 'flame') drawFlame(ctx, l.x, l.y, l.s, frame + Math.round(l.x * 7 + l.y));
    else if (l.k === 'fire') drawFire(ctx, l.x, l.y, l.w, l.h, frame);
    else if (l.k === 'glow') {
      const b = 0.85 + 0.15 * Math.sin(frame / 17 + l.x) * Math.sin(frame / 7.3 + l.y);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      smudge(ctx, l.x, l.y, l.r * (0.95 + 0.05 * b), l.color, l.a * b);
      ctx.restore();
    } else drawMotes(ctx, l, frame);
  }
}

/** A small flame: glow, outer tongue, hot core, leaning and stretching with the frame. */
export function drawFlame(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number): void {
  const f1 = Math.sin(frame / 3.1), f2 = Math.sin(frame / 5.3 + 1), f3 = Math.sin(frame / 1.7 + 2);
  const hgt = s * (2.3 + 0.35 * f1 + 0.1 * f3), lean = s * 0.22 * f2;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  smudge(ctx, x, y - s * 0.8, s * 5.5, '#ff9a40', 0.22 + 0.04 * f1);
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(x - s * 0.5, y); ctx.quadraticCurveTo(x - s * 0.7, y - hgt * 0.45, x + lean, y - hgt); ctx.quadraticCurveTo(x + s * 0.7, y - hgt * 0.45, x + s * 0.5, y); ctx.closePath();
  ctx.fillStyle = '#ff8a30'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - s * 0.28, y); ctx.quadraticCurveTo(x - s * 0.36, y - hgt * 0.32, x + lean * 0.6, y - hgt * 0.62); ctx.quadraticCurveTo(x + s * 0.36, y - hgt * 0.32, x + s * 0.28, y); ctx.closePath();
  ctx.fillStyle = '#ffe49a'; ctx.fill();
  if (s >= 3) { ctx.beginPath(); ctx.ellipse(x, y - s * 0.35, s * 0.16, s * 0.3, 0, 0, Math.PI * 2); ctx.fillStyle = '#fffbe8'; ctx.fill(); }
}

/** A fire on a bed of coals: a row of tongues, each on its own beat, over a glow that breathes. */
function drawFire(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frame: number): void {
  const breath = 0.8 + 0.2 * Math.sin(frame / 4.3) * Math.sin(frame / 2.9 + 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  smudge(ctx, x, y - h * 0.35, w * 1.25, '#ff8a30', 0.3 * breath);
  smudge(ctx, x, y - h * 0.2, w * 0.6, '#ffc060', 0.25 * breath);
  ctx.restore();
  const n = Math.max(4, Math.round(w / 7));
  for (const [col, k, wk] of [['#e0501c', 1, 1], ['#ff9a30', 0.72, 0.75], ['#ffe08a', 0.42, 0.5]] as [string, number, number][]) {
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, tx = x - w / 2 + u * w + Math.sin(frame / 6 + i * 2.3) * w * 0.02;
      const beat = 0.72 + 0.28 * Math.sin(frame / (2.6 + (i % 3) * 0.7) + i * 1.9);
      const th = h * k * (0.45 + 0.55 * Math.sin(u * Math.PI)) * beat, tw = (w / n) * 1.5 * wk;
      const lean = Math.sin(frame / 4.7 + i) * tw * 0.3;
      ctx.beginPath(); ctx.moveTo(tx - tw / 2, y); ctx.quadraticCurveTo(tx - tw * 0.55, y - th * 0.5, tx + lean, y - th); ctx.quadraticCurveTo(tx + tw * 0.55, y - th * 0.5, tx + tw / 2, y); ctx.closePath();
      ctx.fillStyle = col; ctx.fill();
    }
  }
  // Sparks lifting off it.
  for (let i = 0; i < 5; i++) {
    const life = ((frame * 0.9 + i * 37) % 60) / 60, sx = x + (rnd(i, 1) - 0.5) * w * 0.7 + Math.sin(frame / 9 + i) * 4;
    const sy = y - h * 0.4 - life * h * 1.4;
    ctx.fillStyle = rgba('#ffd070', 1 - life); ctx.fillRect(Math.round(sx), Math.round(sy), 1, 1);
  }
}

function drawMotes(ctx: CanvasRenderingContext2D, l: Extract<Light, { k: 'motes' }>, frame: number): void {
  ctx.save(); ctx.beginPath(); ctx.rect(l.x, l.y, l.w, l.h); ctx.clip();
  for (let i = 0; i < l.n; i++) {
    const px = l.x + ((rnd(i, 3, l.x | 0) * l.w + Math.sin(frame / 40 + i * 1.7) * 6) % l.w + l.w) % l.w;
    const py = l.y + ((rnd(i, 4, l.y | 0) * l.h - frame * l.rise) % l.h + l.h) % l.h;
    const tw = 0.5 + 0.5 * Math.sin(frame / 9 + i * 2.1);
    ctx.fillStyle = rgba(l.color, 0.35 + 0.5 * tw);
    ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
  }
  ctx.restore();
}

// ------------------------------------------------------------------ windows ----

/** The sky for the hour through a window: night blue with stars, dawn warm at the foot, noon pale. */
export function skyFill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, daylight: number, seed = 0): void {
  const top = mix('#0a0c22', '#5a9ae0', daylight), bottom = mix('#1c1a36', '#cfe4f4', daylight);
  const dusk = daylight > 0.05 && daylight < 0.6 ? 1 - Math.abs(daylight - 0.3) / 0.3 : 0;
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top); g.addColorStop(1, mix(bottom, '#f0a070', dusk * 0.6));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  if (daylight < 0.4) for (let i = 0; i < Math.round(w * h / 60); i++) {
    ctx.fillStyle = rgba('#ffffff', (0.4 + rnd(seed, i, 3) * 0.6) * (1 - daylight / 0.4));
    ctx.fillRect(Math.round(x + rnd(seed, i, 1) * w), Math.round(y + rnd(seed, i, 2) * h * 0.8), 1, 1);
  }
}

/** Thornmark's forest seen through an opening: sky between the crowns, trunks going back into green haze. */
export function forestFill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, daylight: number, seed = 0): void {
  skyFill(ctx, x, y, w, h, daylight, seed);
  const haze = mix('#0e1a18', '#9ac0a0', daylight), deep = mix('#08100e', '#3a6a3a', daylight), near = mix('#060a08', '#2a4a24', daylight);
  for (const [col, k, n] of [[haze, 0.5, 6], [deep, 0.75, 5], [near, 1, 3]] as [string, number, number][]) {
    for (let i = 0; i < n; i++) {
      const tx = x + rnd(seed, i, n) * w, tw = w * (0.03 + k * 0.05);
      ctx.fillStyle = col; ctx.fillRect(Math.round(tx - tw / 2), Math.round(y + h * (0.1 + (1 - k) * 0.3)), Math.round(tw), Math.round(h));
      for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(tx + (rnd(seed, i, j, 1) - 0.5) * w * 0.4 * k, y + h * (0.05 + (1 - k) * 0.25) + rnd(seed, i, j, 2) * h * 0.2, w * (0.1 + k * 0.1), 0, Math.PI * 2); ctx.fill(); }
    }
  }
  if (daylight > 0.3) for (let i = 0; i < 3; i++) { const bx = x + w * (0.2 + i * 0.3); fillPoly(ctx, [bx, y, bx + w * 0.06, y, bx + w * 0.2, y + h, bx + w * 0.1, y + h], rgba('#fff4c0', 0.12 * daylight)); }
}

/**
 * A window: what is outside (painted by `view` into the opening), leaded panes over it, a deep
 * reveal and a sill in `frame`. By day it lights the room with a cool pool; by night it is dark.
 */
export function windowIn(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number, h: number, frameCol: string, o: { arched?: boolean; panes?: [number, number]; view?: (ctx: CanvasRenderingContext2D) => void; lead?: string; round?: boolean } = {}): void {
  const opening = (): void => {
    ctx.beginPath();
    if (o.round) ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    else if (o.arched) { ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); }
    else ctx.rect(x, y, w, h);
  };
  // The frame and reveal.
  const fw = Math.max(3, w * 0.09);
  ctx.save();
  ctx.beginPath();
  if (o.round) ctx.ellipse(x + w / 2, y + h / 2, w / 2 + fw, h / 2 + fw, 0, 0, Math.PI * 2);
  else if (o.arched) { ctx.moveTo(x - fw, y + h + fw); ctx.lineTo(x - fw, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2 + fw, Math.PI, 0); ctx.lineTo(x + w + fw, y + h + fw); ctx.closePath(); }
  else ctx.rect(x - fw, y - fw, w + fw * 2, h + fw * 2);
  ctx.fillStyle = frameCol; ctx.fill(); ink(ctx);
  opening(); ctx.save(); ctx.clip();
  if (o.view) o.view(ctx); else skyFill(ctx, x, y, w, h, s.daylight, Math.round(x));
  // The reveal's shadow inside the top and left of the opening.
  ctx.fillStyle = rgba('#0a0608', 0.35); ctx.fillRect(x, y, w, Math.max(2, h * 0.06)); ctx.fillRect(x, y, Math.max(2, w * 0.06), h);
  // Leading: a lattice of diamonds, or a grid of panes.
  const lead = o.lead ?? '#2a2226';
  if (o.panes) {
    const [c, r] = o.panes;
    ctx.fillStyle = lead;
    for (let i = 1; i < c; i++) ctx.fillRect(Math.round(x + (w / c) * i) - 1, y, 2, h);
    for (let i = 1; i < r; i++) ctx.fillRect(x, Math.round(y + (h / r) * i) - 1, w, 2);
  } else {
    const d = Math.max(6, w / 5);
    for (let i = -h; i < w + h; i += d) { line(ctx, [x + i, y, x + i + h, y + h], rgba(lead, 0.85), 1); line(ctx, [x + i, y, x + i - h, y + h], rgba(lead, 0.85), 1); }
  }
  // The glass catching the light.
  const sheen = ctx.createLinearGradient(x, y, x + w, y + h);
  sheen.addColorStop(0, rgba('#ffffff', 0.16)); sheen.addColorStop(0.4, rgba('#ffffff', 0.02)); sheen.addColorStop(0.55, rgba('#ffffff', 0.1)); sheen.addColorStop(1, rgba('#ffffff', 0));
  ctx.fillStyle = sheen; ctx.fillRect(x, y, w, h);
  ctx.restore();
  opening(); ink(ctx);
  ctx.restore();
  if (!o.round) slab(ctx, x - fw * 1.5, y + h + fw * 0.3, w + fw * 3, Math.max(3, fw * 0.9), shade(frameCol, 1.05));
  if (s.daylight > 0.15) pool(s, x + w / 2, y + h * 0.6, Math.max(w, h) * 2.2, DAY_POOL, 0.55 * s.daylight);
}
