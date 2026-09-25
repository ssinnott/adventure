// Furniture and goods for the interiors: counters and shelves and what stands on them, barrels,
// kegs, sacks and crates, candles and lanterns, a hearth, hanging stores, books, banners. Each
// says where its anchor is (usually the foot: the surface it stands on), draws in the kit's look,
// and puts down its own lights.
import { shade, rgba } from '../../lib/art/palettes.ts';
import { makeBrush } from '../brush.ts';
import { glossPoly, glossEllipse, glossBall } from '../monsters/gloss.ts';
import type { Stage } from './kit.ts';
import { INK, ramp, rnd, path, reversed, fillPoly, ink, inkRect, line, clipRect, smudge, contact, slab, beam, block, flame, pool, FLAME_POOL } from './kit.ts';

/** The interiors' brush: the monsters' ink and light, its own tone cache. */
export const K = makeBrush(INK, 1);

// ------------------------------------------------------------------ joinery ----

/**
 * A counter across the room. Its top is seen from a little above: the surface runs from `top`
 * (the back edge) to `top + depth`, and ends in a lip that catches the light; below it the front
 * is framed in raised panels on a plinth.
 */
export function counter(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, depth: number, bottom: number, wood: string, seed = 0, o: { panels?: number; trim?: string } = {}): void {
  const w = x1 - x0, fy = top + depth, lip = Math.max(3, depth * 0.45), t = ramp(wood);
  const front = shade(wood, 0.82), ft = ramp(front);
  ctx.fillStyle = front; ctx.fillRect(x0, fy, w, bottom - fy);
  const n = o.panels ?? Math.max(2, Math.round(w / 72)), pw = w / n, fh = bottom - fy - lip;
  for (let i = 0; i < n; i++) {
    const px = x0 + i * pw + pw * 0.1, py = fy + lip + fh * 0.14, ww = pw * 0.8, hh = fh * 0.62;
    // The recess round the panel, then the panel raised out of it: lit top and left, shadowed right and foot.
    ctx.fillStyle = ft.deep; ctx.fillRect(px - 2, py - 2, ww + 4, hh + 4);
    ctx.fillStyle = ft.hi; ctx.fillRect(px - 2, py + hh, ww + 4, 2); ctx.fillRect(px + ww, py - 2, 2, hh + 4);
    const pc = shade(front, 0.95 + rnd(seed, i) * 0.1), pt = ramp(pc);
    ctx.fillStyle = pc; ctx.fillRect(px, py, ww, hh);
    ctx.fillStyle = pt.hi; ctx.fillRect(px, py, ww, 2); ctx.fillRect(px, py, 2, hh);
    ctx.fillStyle = pt.sh; ctx.fillRect(px, py + hh - 3, ww, 3); ctx.fillRect(px + ww - 3, py, 3, hh);
    // A fielded centre: a second, fainter bevel.
    ctx.strokeStyle = rgba(pt.deep, 0.5); ctx.lineWidth = 1; ctx.strokeRect(px + ww * 0.18 + 0.5, py + hh * 0.2 + 0.5, ww * 0.64, hh * 0.6);
    ctx.strokeStyle = rgba(pt.hi, 0.5); ctx.strokeRect(px + ww * 0.18 + 1.5, py + hh * 0.2 + 1.5, ww * 0.64, hh * 0.6);
    if (o.trim) { ctx.fillStyle = o.trim; ctx.fillRect(Math.round(px + ww / 2) - 2, Math.round(py + hh / 2) - 2, 4, 4); inkRect(ctx, px + ww / 2 - 2, py + hh / 2 - 2, 4, 4); }
  }
  // Plinth.
  slab(ctx, x0, bottom - fh * 0.14, w, fh * 0.14 + 1, shade(wood, 0.6), { outline: false });
  // The top: a surface lit toward its front edge, grained along its length, and the lip.
  const g = ctx.createLinearGradient(0, top, 0, fy);
  g.addColorStop(0, shade(wood, 0.72)); g.addColorStop(1, t.hi);
  ctx.fillStyle = g; ctx.fillRect(x0, top, w, depth);
  ctx.save(); clipRect(ctx, x0, top, w, depth);
  for (let i = 0; i < 4; i++) line(ctx, [x0, top + depth * (0.2 + i * 0.2), x1, top + depth * (0.22 + i * 0.2) + Math.sin(i + seed) * 0.6], rgba(t.deep, 0.18), 1);
  ctx.restore();
  ctx.fillStyle = wood; ctx.fillRect(x0, fy, w, lip);
  ctx.fillStyle = t.hi; ctx.fillRect(x0, fy, w, 1);
  ctx.fillStyle = t.sh; ctx.fillRect(x0, fy + lip - 1.5, w, 1.5);
  ctx.fillStyle = rgba('#0a0608', 0.4); ctx.fillRect(x0, fy + lip, w, 2);
  inkRect(ctx, x0, top, w, bottom - top);
  line(ctx, [x0, fy, x1, fy], INK, 1);
}

/**
 * A counter made from one great split log, as Thornhold makes them: the planed top shows its
 * rings and grain; the front is the tree's own bark, ridged, meeting the top in a wavering live edge.
 */
export function logCounter(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, depth: number, bottom: number, wood: string, bark: string, seed = 0): void {
  const w = x1 - x0, fy = top + depth, t = ramp(wood), bt = ramp(bark);
  // The bark front: ridges running along the log, a little wavy, lit along their tops.
  const edge: number[] = [];
  for (let i = 0; i <= 24; i++) edge.push(x0 + (w * i) / 24, fy + Math.sin(i * 1.3 + seed) * 1.5 + (rnd(seed, i) - 0.5) * 2);
  const front = [...edge, x1, bottom, x0, bottom];
  const g = ctx.createLinearGradient(0, fy, 0, bottom);
  g.addColorStop(0, bt.hi); g.addColorStop(0.15, bark); g.addColorStop(0.7, bt.sh); g.addColorStop(1, bt.deep);
  fillPoly(ctx, front, g);
  ctx.save(); path(ctx, front); ctx.clip();
  for (let r = 0; r < 12; r++) {
    const yy = fy + 6 + r * ((bottom - fy) / 12), pts: number[] = [];
    for (let i = 0; i <= 30; i++) pts.push(x0 + (w * i) / 30, yy + Math.sin(i * 0.9 + r * 1.7 + seed) * 2.2 + (rnd(seed, r, i) - 0.5) * 1.5);
    line(ctx, pts, rgba(bt.deep, 0.7), 2);
    line(ctx, pts.map((v, i) => i % 2 ? v - 2 : v), rgba(bt.hi, 0.35), 1);
  }
  // Knots where branches were.
  for (let i = 0; i < 4; i++) {
    const kx = x0 + w * (0.12 + rnd(seed, 40, i) * 0.76), ky = fy + (bottom - fy) * (0.3 + rnd(seed, 41, i) * 0.4);
    ctx.beginPath(); ctx.ellipse(kx, ky, 7, 4, 0, 0, Math.PI * 2); ctx.fillStyle = bt.deep; ctx.fill();
    ctx.beginPath(); ctx.ellipse(kx, ky, 4, 2, 0, 0, Math.PI * 2); ctx.fillStyle = bt.sh; ctx.fill();
  }
  ctx.restore();
  // The planed top.
  const tg = ctx.createLinearGradient(0, top, 0, fy);
  tg.addColorStop(0, shade(wood, 0.75)); tg.addColorStop(1, t.hi);
  fillPoly(ctx, [x0, top, x1, top, ...reversed(edge)], tg);
  ctx.save(); clipRect(ctx, x0, top, w, depth + 2);
  for (let i = 0; i < 5; i++) { const cx = x0 + w * (0.1 + i * 0.2); ctx.strokeStyle = rgba(t.deep, 0.25); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, fy, 40 + i * 6, depth * 0.8, 0, Math.PI, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
  line(ctx, edge, rgba(t.hi, 0.9), 1.5);
  path(ctx, [x0, top, x1, top, x1, bottom, x0, bottom]); ink(ctx);
  line(ctx, edge, INK, 1);
}

/** A shelf board on two brackets, its top at y, casting a soft shadow on the wall under it. */
export function shelf(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, wood: string, th = 4): void {
  const g = ctx.createLinearGradient(0, y + th, 0, y + th + 10);
  g.addColorStop(0, rgba('#0a0608', 0.35)); g.addColorStop(1, rgba('#0a0608', 0));
  ctx.fillStyle = g; ctx.fillRect(x + 2, y + th, w - 2, 10);
  for (const bx of [x + w * 0.12, x + w * 0.88 - 3]) fillPoly(ctx, [bx, y + th, bx + 3, y + th, bx + 3, y + th + 7, bx, y + th + 3], shade(wood, 0.7));
  beam(ctx, x, y, w, th, wood);
}

/** A stool, its feet on y: a round seat on three splayed legs. */
export function stool(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, wood: string): void {
  const r = h * 0.42;
  contact(ctx, x, y, r * 2.2);
  for (const [a, b] of [[-0.8, -1.05], [0.8, 1.05], [0, 0.1]] as [number, number][]) {
    line(ctx, [x + r * a * 0.6, y - h + 3, x + r * b, y], INK, 3.4);
    line(ctx, [x + r * a * 0.6, y - h + 3, x + r * b, y], shade(wood, a === 0 ? 0.7 : 0.9), 2);
  }
  line(ctx, [x - r * 0.8, y - h * 0.4, x + r * 0.8, y - h * 0.4], shade(wood, 0.75), 1.5);
  glossEllipse(ctx, K, x, y - h, r, r * 0.32, wood, 0, { gloss: 0.15, spread: 0.7 });
  ctx.fillStyle = shade(wood, 0.7); ctx.fillRect(x - r, y - h, r * 2, 2.5);
  inkRect(ctx, x - r, y - h, r * 2, 3);
}

// ------------------------------------------------------------------ goods ----

/** A bottle standing on y: body, sloping shoulder, neck and a cork, the glass catching a streak. */
export function bottle(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, glass: string, o: { wide?: number; cork?: string; label?: string; squat?: boolean } = {}): void {
  const bw = h * (o.wide ?? (o.squat ? 0.5 : 0.3)), nw = Math.max(1.5, bw * 0.3), shY = y - h * (o.squat ? 0.5 : 0.62), nY = y - h * 0.86;
  glossPoly(ctx, K, [x - bw / 2, y, x - bw / 2, shY + bw * 0.25, x - nw / 2, nY, x - nw / 2, y - h, x + nw / 2, y - h, x + nw / 2, nY, x + bw / 2, shY + bw * 0.25, x + bw / 2, y], glass, { gloss: 0.8, spread: 0.7 });
  if (o.label && h > 12) { const ly = y - h * 0.45, lh = h * 0.2; ctx.fillStyle = o.label; ctx.fillRect(x - bw / 2 + 1, ly, bw - 2, lh); ctx.fillStyle = rgba('#0a0608', 0.25); ctx.fillRect(x - bw / 2 + 1, ly + lh - 1, bw - 2, 1); }
  if (h > 10) { ctx.fillStyle = rgba('#ffffff', 0.55); ctx.fillRect(Math.round(x - bw * 0.28), Math.round(shY + bw * 0.4), 1, Math.max(1, Math.round((y - shY) * 0.5))); }
  const c = o.cork ?? '#a07850';
  ctx.fillStyle = c; ctx.fillRect(Math.round(x - nw / 2), Math.round(y - h - Math.max(2, h * 0.08)), Math.max(2, Math.round(nw)), Math.max(2, Math.round(h * 0.08)));
}

/** A stoneware jar standing on y, with a lid or a cloth tied over its mouth. */
export function jar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, clay: string, lid?: string): void {
  glossPoly(ctx, K, [x - w * 0.36, y, x - w * 0.5, y - h * 0.45, x - w * 0.42, y - h * 0.8, x - w * 0.3, y - h * 0.88, x + w * 0.3, y - h * 0.88, x + w * 0.42, y - h * 0.8, x + w * 0.5, y - h * 0.45, x + w * 0.36, y], clay, { gloss: 0.35, spread: 0.75 });
  if (lid) { glossEllipse(ctx, K, x, y - h * 0.9, w * 0.34, Math.max(1.5, h * 0.09), lid, 0, { gloss: 0.2 }); }
  ctx.fillStyle = rgba('#0a0608', 0.2); ctx.fillRect(x - w * 0.46, y - h * 0.52, w * 0.92, 1);
}

/** A tankard standing on y, in pewter or wood, with its handle on the right and two bands. */
export function tankard(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, body: string, o: { band?: string; foam?: boolean; handleLeft?: boolean } = {}): void {
  const w = h * 0.72, s = o.handleLeft ? -1 : 1;
  ctx.strokeStyle = INK; ctx.lineWidth = Math.max(3, h * 0.26);
  ctx.beginPath(); ctx.arc(x + s * w * 0.5, y - h * 0.52, h * 0.24, -Math.PI / 2, Math.PI / 2, s < 0); ctx.stroke();
  ctx.strokeStyle = shade(body, 0.8); ctx.lineWidth = Math.max(1.5, h * 0.14);
  ctx.beginPath(); ctx.arc(x + s * w * 0.5, y - h * 0.52, h * 0.24, -Math.PI / 2, Math.PI / 2, s < 0); ctx.stroke();
  glossPoly(ctx, K, [x - w * 0.5, y, x - w * 0.46, y - h, x + w * 0.46, y - h, x + w * 0.5, y], body, { gloss: 0.5, spread: 0.7 });
  const band = o.band ?? shade(body, 0.7);
  for (const f of [0.18, 0.78]) { ctx.fillStyle = band; ctx.fillRect(Math.round(x - w * 0.49), Math.round(y - h * f - 1), Math.round(w * 0.98), 2); }
  if (o.foam) glossEllipse(ctx, K, x, y - h, w * 0.5, h * 0.12, '#f4ecd8', 0, { gloss: 0.1 });
}

/** A jug standing on y: a bellied body, a pinched spout on the left, a strap handle on the right. */
export function jug(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, glaze: string, band?: string): void {
  const w = h * 0.7;
  ctx.strokeStyle = INK; ctx.lineWidth = Math.max(3, h * 0.2);
  ctx.beginPath(); ctx.moveTo(x + w * 0.3, y - h * 0.82); ctx.quadraticCurveTo(x + w * 0.85, y - h * 0.8, x + w * 0.42, y - h * 0.35); ctx.stroke();
  ctx.strokeStyle = shade(glaze, 0.85); ctx.lineWidth = Math.max(1.5, h * 0.1);
  ctx.beginPath(); ctx.moveTo(x + w * 0.3, y - h * 0.82); ctx.quadraticCurveTo(x + w * 0.85, y - h * 0.8, x + w * 0.42, y - h * 0.35); ctx.stroke();
  glossPoly(ctx, K, [x - w * 0.32, y, x - w * 0.5, y - h * 0.4, x - w * 0.36, y - h * 0.72, x - w * 0.3, y - h * 0.86, x - w * 0.48, y - h, x + w * 0.3, y - h, x + w * 0.26, y - h * 0.8, x + w * 0.46, y - h * 0.5, x + w * 0.4, y - h * 0.15, x + w * 0.3, y], glaze, { gloss: 0.5, spread: 0.75 });
  if (band) { ctx.fillStyle = band; ctx.fillRect(Math.round(x - w * 0.46), Math.round(y - h * 0.5), Math.round(w * 0.9), Math.max(2, Math.round(h * 0.07))); }
}

/** A wooden cup or bowl standing on y. */
export function cup(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, wood: string, bowl = false): void {
  const h = bowl ? w * 0.45 : w * 0.8;
  glossPoly(ctx, K, [x - w * 0.35, y, x - w * 0.5, y - h, x + w * 0.5, y - h, x + w * 0.35, y], wood, { gloss: 0.25, spread: 0.8 });
  glossEllipse(ctx, K, x, y - h, w * 0.5, Math.max(1.5, w * 0.12), shade(wood, 0.55), 0, {});
}

/** A plate stood on its edge against a shelf's rail, its foot on y. */
export function plate(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, glaze: string, rim?: string): void {
  glossBall(ctx, K, x, y - r, r, glaze, { gloss: 0.5, spread: 0.8 });
  ctx.strokeStyle = rim ?? shade(glaze, 0.7); ctx.lineWidth = Math.max(1, r * 0.12);
  ctx.beginPath(); ctx.arc(x, y - r, r * 0.68, 0, Math.PI * 2); ctx.stroke();
}

/** A loaf on y: a domed crust with slashes. */
export function loaf(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  glossPoly(ctx, K, [x - w / 2, y, x - w * 0.46, y - w * 0.22, x - w * 0.25, y - w * 0.36, x + w * 0.25, y - w * 0.36, x + w * 0.46, y - w * 0.22, x + w / 2, y], '#c8843c', { gloss: 0.25 });
  for (let i = -1; i <= 1; i++) line(ctx, [x + i * w * 0.2 - w * 0.05, y - w * 0.3, x + i * w * 0.2 + w * 0.05, y - w * 0.18], '#8a5220', 1);
}

/** A round of cheese on y, a wedge cut from it. */
export function cheese(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  glossPoly(ctx, K, [x - w / 2, y, x - w / 2, y - w * 0.3, x + w * 0.1, y - w * 0.36, x + w * 0.1, y - w * 0.12, x + w / 2, y - w * 0.3, x + w / 2, y], '#e8c050', { gloss: 0.2 });
  ctx.fillStyle = '#c89830'; ctx.fillRect(Math.round(x - w / 2), Math.round(y - w * 0.3), Math.round(w * 0.6), 2);
}

/** Candles on a dish, their feet on y; each gets its flame. */
export function candle(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, h: number, wax = '#efe4c8', reach = 70): void {
  const w = Math.max(3, h * 0.22);
  glossEllipse(ctx, K, x, y, w * 1.6, w * 0.5, '#b08a3a', 0, { gloss: 0.6 });
  glossPoly(ctx, K, [x - w / 2, y - 1, x - w / 2, y - h, x + w / 2, y - h, x + w / 2, y - 1], wax, { gloss: 0.3, spread: 0.7 });
  // A drip down the side.
  ctx.fillStyle = shade(wax, 1.05); ctx.fillRect(Math.round(x + w * 0.1), Math.round(y - h), Math.max(1, Math.round(w * 0.3)), Math.round(h * 0.35));
  line(ctx, [x, y - h, x, y - h - 2], '#2a2020', 1);
  flame(s, x, y - h - 1, Math.max(2, w * 0.7), reach, 0.7);
}

/**
 * A lantern hung from `top` on a chain to a ring at (x, y): a pierced cap, four bars round the
 * glass with the flame inside, a dish under it. Lights a warm pool as far as `reach`.
 */
export function lantern(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, size: number, metal: string, top: number | null = null, reach = size * 9, glass = '#ffd890'): void {
  if (top !== null) { line(ctx, [x, top, x, y], INK, 2); for (let cy = top + 2; cy < y; cy += 4) { ctx.fillStyle = shade(metal, 0.9); ctx.fillRect(Math.round(x) - 1, Math.round(cy), 2, 2); } }
  const w = size, h = size * 1.4, gy = y + size * 0.55;
  ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y + 1, size * 0.18, 0, Math.PI * 2); ctx.stroke();
  glossPoly(ctx, K, [x - w * 0.62, gy, x - w * 0.25, y + size * 0.15, x + w * 0.25, y + size * 0.15, x + w * 0.62, gy], metal, { gloss: 0.5, spread: 0.7 });
  // The glass, lit from inside.
  const gx0 = x - w * 0.46, gx1 = x + w * 0.46, gy1 = gy + h * 0.72;
  const g = ctx.createRadialGradient(x, gy + h * 0.45, 0, x, gy + h * 0.45, w);
  g.addColorStop(0, '#fff6d0'); g.addColorStop(0.6, glass); g.addColorStop(1, shade(glass, 0.7));
  ctx.fillStyle = g; ctx.fillRect(gx0, gy, gx1 - gx0, gy1 - gy);
  ctx.fillStyle = shade(metal, 0.8);
  for (const bx of [gx0, x - 0.5, gx1 - 1]) ctx.fillRect(Math.round(bx), Math.round(gy), bx === x - 0.5 ? 1 : 2, Math.round(gy1 - gy));
  inkRect(ctx, gx0, gy, gx1 - gx0, gy1 - gy);
  glossPoly(ctx, K, [x - w * 0.62, gy1, x + w * 0.62, gy1, x + w * 0.4, gy1 + size * 0.28, x - w * 0.4, gy1 + size * 0.28], metal, { gloss: 0.5, spread: 0.7 });
  s.lights.push({ k: 'flame', x, y: gy + h * 0.55, s: Math.max(2, size * 0.28) });
  s.lights.push({ k: 'glow', x, y: gy + h * 0.4, r: size * 2.2, color: '#ffc070', a: 0.3 });
  pool(s, x, gy + h * 0.4, reach, FLAME_POOL, 0.75);
}

/** A standing barrel, its foot on y: bellied staves, iron hoops, the top's rim. */
export function barrel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wood: string, hoop = '#4a4450', seed = 0): void {
  contact(ctx, x, y, w * 1.1);
  const belly = w * 0.08, pts: number[] = [];
  for (let i = 0; i <= 10; i++) { const u = i / 10, bulge = Math.sin(u * Math.PI) * belly; pts.push(x - w / 2 - bulge, y - h * u); }
  for (let i = 10; i >= 0; i--) { const u = i / 10, bulge = Math.sin(u * Math.PI) * belly; pts.push(x + w / 2 + bulge, y - h * u); }
  glossPoly(ctx, K, pts, wood, { gloss: 0.12, spread: 0.8 });
  ctx.save(); path(ctx, pts); ctx.clip();
  const t = ramp(wood);
  for (let i = 1; i < 6; i++) { const u = i / 6 - 0.5; line(ctx, [x + u * w * 1.05, y, x + u * w * 1.18, y - h * 0.5, x + u * w * 1.05, y - h], rgba(t.deep, 0.45), 1); }
  for (const f of [0.1, 0.3, 0.7, 0.9]) {
    const yy = y - h * f, bulge = Math.sin(f * Math.PI) * belly;
    ctx.fillStyle = hoop; ctx.fillRect(x - w / 2 - bulge - 1, yy - 1.5, w + bulge * 2 + 2, 3);
    ctx.fillStyle = rgba('#ffffff', 0.25); ctx.fillRect(x - w / 2 - bulge, yy - 1.5, w * 0.4, 1);
  }
  ctx.restore();
  glossEllipse(ctx, K, x, y - h, w / 2, Math.max(2, w * 0.12), shade(wood, 0.85), 0, { gloss: 0.05 });
  void seed;
}

/**
 * A keg lying in a rack, seen end-on: the head (boards across it, a rim of hoop), and a brass tap
 * low on it. Centre (x, y), radius r.
 */
export function kegEnd(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, wood: string, hoop = '#4a4450', tap = '#c9a34a'): void {
  glossBall(ctx, K, x, y, r, hoop, { gloss: 0.3, spread: 0.8 });
  glossBall(ctx, K, x, y, r * 0.84, wood, { gloss: 0.1, spread: 0.8 });
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * 0.84, 0, Math.PI * 2); ctx.clip();
  const t = ramp(wood);
  for (let i = -3; i <= 3; i++) line(ctx, [x - r, y + i * r * 0.26, x + r, y + i * r * 0.26], rgba(t.deep, 0.5), 1);
  ctx.restore();
  // The tap: a spout and a key.
  const ty = y + r * 0.5;
  glossPoly(ctx, K, [x - r * 0.1, ty - r * 0.1, x + r * 0.1, ty - r * 0.1, x + r * 0.08, ty + r * 0.35, x - r * 0.08, ty + r * 0.35], tap, { gloss: 0.7 });
  glossPoly(ctx, K, [x - r * 0.22, ty - r * 0.2, x + r * 0.22, ty - r * 0.2, x + r * 0.22, ty - r * 0.08, x - r * 0.22, ty - r * 0.08], tap, { gloss: 0.7 });
}

/** A sack standing on y, full and slumped, tied at the neck; `open` rolls the mouth down to show the grain. */
export function sack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, cloth: string, o: { open?: string; seed?: number } = {}): void {
  const s = o.seed ?? 0;
  contact(ctx, x, y, w * 1.1);
  const pts = [x - w * 0.5, y, x - w * 0.56, y - h * 0.35, x - w * 0.42, y - h * 0.75, x - w * 0.2, y - h * 0.9, x + w * 0.22, y - h * 0.92, x + w * 0.44, y - h * 0.74, x + w * 0.58, y - h * 0.32, x + w * 0.5, y];
  for (let i = 0; i < pts.length; i += 2) pts[i] += (rnd(s, i) - 0.5) * w * 0.05;
  glossPoly(ctx, K, pts, cloth, { gloss: 0, spread: 0.8 });
  const t = ramp(cloth);
  line(ctx, [x - w * 0.2, y - h * 0.8, x - w * 0.1, y - h * 0.3], rgba(t.deep, 0.5), 1);
  line(ctx, [x + w * 0.25, y - h * 0.75, x + w * 0.3, y - h * 0.2], rgba(t.deep, 0.4), 1);
  if (o.open) {
    glossEllipse(ctx, K, x, y - h * 0.9, w * 0.34, h * 0.1, shade(cloth, 0.85), 0, {});
    glossEllipse(ctx, K, x, y - h * 0.93, w * 0.26, h * 0.07, o.open, 0, { gloss: 0.1 });
    for (let i = 0; i < 6; i++) { ctx.fillStyle = shade(o.open, 0.75); ctx.fillRect(Math.round(x - w * 0.2 + rnd(s, i, 1) * w * 0.4), Math.round(y - h * 0.95 + rnd(s, i, 2) * h * 0.06), 1, 1); }
  } else {
    glossPoly(ctx, K, [x - w * 0.14, y - h * 0.9, x - w * 0.2, y - h * 1.08, x + w * 0.2, y - h * 1.08, x + w * 0.14, y - h * 0.9], cloth, {});
    line(ctx, [x - w * 0.16, y - h * 0.93, x + w * 0.16, y - h * 0.93], '#6a4a2a', 2);
  }
}

/** A crate on y: slats, a corner post each side, a stencilled mark. */
export function crate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, wood: string, seed = 0): void {
  contact(ctx, x + w / 2, y, w * 1.05);
  const top = y - h;
  slab(ctx, x, top, w, h, wood, { lit: 2, dark: 0.18 });
  const n = Math.max(2, Math.round(h / 9));
  for (let i = 1; i < n; i++) line(ctx, [x + 1, top + (h / n) * i, x + w - 1, top + (h / n) * i], rgba(ramp(wood).deep, 0.7), 1);
  for (const px of [x, x + w - Math.max(3, w * 0.1)]) slab(ctx, px, top, Math.max(3, w * 0.1), h, shade(wood, 0.85), { lit: 1, dark: 0.2 });
  line(ctx, [x + w * 0.1, top + 2, x + w * 0.9, y - 2], rgba(ramp(wood).sh, 0.8), 2);
  void seed;
}

// ------------------------------------------------------------------ hanging stores ----

/** A cured ham hung by its shank from a string down from `top`, the ham's top at y. */
export function ham(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, top: number): void {
  line(ctx, [x, top, x, y], '#c8b890', 1);
  glossPoly(ctx, K, [x - s * 0.12, y, x + s * 0.12, y, x + s * 0.3, y + s * 0.5, x + s * 0.42, y + s * 1.1, x + s * 0.22, y + s * 1.42, x - s * 0.22, y + s * 1.42, x - s * 0.42, y + s * 1.1, x - s * 0.3, y + s * 0.5], '#9a4a30', { gloss: 0.45, spread: 0.8 });
  glossEllipse(ctx, K, x, y + s * 0.05, s * 0.14, s * 0.1, '#e8d8b8', 0, {});
  line(ctx, [x - s * 0.2, y + s * 0.9, x + s * 0.2, y + s * 0.8], '#c8b890', 1);
}

/** A string of garlic hung from `top`: plump white bulbs down a plait, the top bulb at y. */
export function garlic(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, top: number, n = 5): void {
  line(ctx, [x, top, x, y + n * s * 0.55], '#b8a070', 1.5);
  for (let i = 0; i < n; i++) {
    const bx = x + (i % 2 ? s * 0.26 : -s * 0.26), by = y + i * s * 0.55;
    glossBall(ctx, K, bx, by, s * 0.32, '#efe6d6', { gloss: 0.3 });
    line(ctx, [bx, by - s * 0.3, bx, by - s * 0.42], '#c8b890', 1);
    line(ctx, [bx - s * 0.05, by - s * 0.1, bx - s * 0.02, by + s * 0.2], '#c8b0a0', 1);
  }
}

/** A bundle of herbs hung head down from `top`: a tied stem and a spray of leaves below y. */
export function herbs(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, top: number, leaf: string, seed = 0): void {
  line(ctx, [x, top, x, y], '#b8a070', 1);
  const t = ramp(leaf);
  for (let i = 0; i < 9; i++) {
    const a = Math.PI / 2 + (rnd(seed, i) - 0.5) * 1.1, len = s * (0.7 + rnd(seed, i, 2) * 0.5);
    const ex = x + Math.cos(a) * len * 0.5, ey = y + Math.sin(a) * len;
    line(ctx, [x, y, ex, ey], i % 3 ? leaf : t.sh, 1);
    ctx.fillStyle = i % 2 ? t.hi : leaf; ctx.beginPath(); ctx.ellipse(ex, ey, 1.6, 2.6, a - Math.PI / 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#8a3a2a'; ctx.fillRect(Math.round(x) - 2, Math.round(y) - 1, 4, 2);
}

// ------------------------------------------------------------------ the hearth ----

/**
 * A stone fireplace: a chimney breast of dressed stone from `top` to the floor at y, an arched
 * firebox blackened with soot, firedogs and logs on a bed of coals, and the fire itself as a Light.
 * It lights the room warm, far into the room. Returns the firebox's rectangle.
 */
export function hearth(ctx: CanvasRenderingContext2D, s: Stage, x: number, top: number, w: number, y: number, stone: string, seed = 0, o: { mantel?: string; reach?: number } = {}): { x: number; y: number; w: number; h: number } {
  const h = y - top;
  // The breast, stone by stone, lit from the fire below as much as from the room.
  ctx.save(); clipRect(ctx, x, top, w, h);
  ctx.fillStyle = shade(stone, 0.5); ctx.fillRect(x, top, w, h);
  const rows = Math.max(4, Math.round(h / 16));
  for (let i = 0; i < rows; i++) {
    let bx = x - rnd(seed, i) * 14, j = 0;
    while (bx < x + w) { const bw = 14 + rnd(seed, i, j) * 18; block(ctx, bx + 1, top + (h / rows) * i + 1, bw - 1, h / rows - 1, shade(stone, 0.8 + rnd(seed, i, j, 1) * 0.35), seed + i * 13 + j); bx += bw; j++; }
  }
  ctx.restore();
  inkRect(ctx, x, top, w, h);
  // The firebox: an arch cut into the breast, soot inside it, darker toward the back.
  const fw = w * 0.62, fh = h * 0.46, fx = x + (w - fw) / 2, fy = y - fh;
  const arch = (grow: number): void => { ctx.beginPath(); ctx.moveTo(fx - grow, y); ctx.lineTo(fx - grow, fy + fw * 0.22); ctx.quadraticCurveTo(fx + fw / 2, fy - fw * 0.2 - grow * 2, fx + fw + grow, fy + fw * 0.22); ctx.lineTo(fx + fw + grow, y); ctx.closePath(); };
  arch(5); ctx.fillStyle = shade(stone, 0.68); ctx.fill(); ink(ctx);
  // Voussoirs round the arch.
  for (let i = 0; i < 9; i++) { const u = i / 8, ax = fx - 3 + (fw + 6) * u, ay = fy + fw * 0.22 - Math.sin(u * Math.PI) * fw * 0.3 - 3; line(ctx, [ax, ay, ax + (u - 0.5) * 4, ay - 6], rgba(INK, 0.6), 1); }
  arch(0);
  const soot = ctx.createLinearGradient(0, fy, 0, y);
  soot.addColorStop(0, '#0c0808'); soot.addColorStop(0.7, '#22140e'); soot.addColorStop(1, '#3a2012');
  ctx.fillStyle = soot; ctx.fill(); ink(ctx);
  // Firedogs, logs and embers.
  const by = y - 3;
  for (const dx of [fx + fw * 0.2, fx + fw * 0.8]) { line(ctx, [dx, by, dx, by - fh * 0.3], INK, 3); ctx.fillStyle = '#3a3440'; ctx.fillRect(dx - 1, by - fh * 0.3, 2, fh * 0.3); }
  for (const [lx0, ly0, lx1, ly1, r] of [[fx + fw * 0.12, by - 5, fx + fw * 0.88, by - 7, 5], [fx + fw * 0.25, by - 12, fx + fw * 0.75, by - 11, 4.5]] as [number, number, number, number, number][]) {
    ctx.strokeStyle = INK; ctx.lineWidth = r * 2 + 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx0, ly0); ctx.lineTo(lx1, ly1); ctx.stroke();
    ctx.strokeStyle = '#4a2a18'; ctx.lineWidth = r * 2; ctx.beginPath(); ctx.moveTo(lx0, ly0); ctx.lineTo(lx1, ly1); ctx.stroke();
    ctx.strokeStyle = '#a04a1a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx0 + 2, ly0 + r * 0.6); ctx.lineTo(lx1 - 2, ly1 + r * 0.6); ctx.stroke();
    glossBall(ctx, K, lx1, ly1, r, '#c89060', {});
    ctx.strokeStyle = '#8a5a30'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(lx1, ly1, r * 0.55, 0, Math.PI * 2); ctx.stroke();
  }
  const coals = ctx.createLinearGradient(0, by - 4, 0, y);
  coals.addColorStop(0, '#ff9a3a'); coals.addColorStop(1, '#8a2a10');
  ctx.fillStyle = coals; ctx.fillRect(fx + 3, by - 2, fw - 6, 4);
  // The hearthstone in front.
  slab(ctx, x - 6, y - 4, w + 12, 7, shade(stone, 0.9));
  // The mantel shelf over the firebox.
  if (o.mantel) beam(ctx, x - 8, fy - fw * 0.36, w + 16, 7, o.mantel, seed);
  s.lights.push({ k: 'fire', x: fx + fw / 2, y: by - 4, w: fw * 0.7, h: fh * 0.62 });
  pool(s, fx + fw / 2, fy + fh * 0.5, o.reach ?? 230, '#ff9a48', 0.95);
  pool(s, fx + fw / 2, fy + fh * 0.7, fw * 1.2, '#ffd080', 0.8);
  return { x: fx, y: fy, w: fw, h: fh };
}

// ------------------------------------------------------------------ arms and armour ----
// Weapons stand upright as they would in a rack: (x, y) is the foot (the pommel, the butt of the
// haft), `len` the whole length up to the point.

const STEEL = '#c0c6d0', IRON = '#8a909a', HILT = '#b08a3a', GRIP = '#3a2416', HAFT = '#6a4626';

/** A sword, point up: pommel, wrapped grip, crossguard, then a blade that tapers to its point. */
export function sword(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, o: { blade?: string; hilt?: string; w?: number; guard?: number } = {}): void {
  const w = o.w ?? Math.max(2.2, len * 0.045), grip = len * 0.2, g = y - grip, guard = o.guard ?? w * 2.8, blade = o.blade ?? STEEL;
  glossPoly(ctx, K, [x - w, g - 2, x - w, y - len * 0.22 - len * 0.55, x, y - len, x + w, y - len * 0.77, x + w, g - 2], blade, { gloss: 0.5, spread: 0.6 });
  line(ctx, [x, g - 4, x, y - len * 0.72], rgba(ramp(blade).sh, 0.8), 1);
  glossPoly(ctx, K, [x - w * 0.7, y, x - w * 0.7, g, x + w * 0.7, g, x + w * 0.7, y], GRIP, { spread: 0.7 });
  for (let i = 1; i < 4; i++) line(ctx, [x - w * 0.7, y - (grip * i) / 4, x + w * 0.7, y - (grip * i) / 4 - 1], '#6a4a2a', 1);
  glossPoly(ctx, K, [x - guard, g + 1, x - guard, g - 2.5, x + guard, g - 2.5, x + guard, g + 1], o.hilt ?? HILT, { gloss: 0.5 });
  glossBall(ctx, K, x, y + 1, w * 1.1, o.hilt ?? HILT, { gloss: 0.6 });
}

/** An axe on its haft: a bearded head, or a double bit for a battle axe. */
export function axe(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, double = false, head = IRON): void {
  const hw = Math.max(2, len * 0.03), top = y - len;
  glossPoly(ctx, K, [x - hw, y, x - hw, top, x + hw, top, x + hw, y], HAFT, { spread: 0.7 });
  const bit = (sd: number): number[] => [x, top + len * 0.05, x + sd * len * 0.22, top - len * 0.02, x + sd * len * 0.26, top + len * 0.12, x + sd * len * 0.2, top + len * 0.26, x, top + len * 0.18];
  glossPoly(ctx, K, bit(1), head, { gloss: 0.5, spread: 0.6 });
  if (double) glossPoly(ctx, K, bit(-1), head, { gloss: 0.5, spread: 0.6 });
  line(ctx, [x + len * 0.24, top, x + len * 0.25, top + len * 0.18], rgba('#ffffff', 0.6), 1);
}

/** A war hammer: a square head with a spike behind it, on a long haft. */
export function warhammer(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  const hw = Math.max(2, len * 0.028), top = y - len;
  glossPoly(ctx, K, [x - hw, y, x - hw, top, x + hw, top, x + hw, y], HAFT, { spread: 0.7 });
  glossPoly(ctx, K, [x - len * 0.06, top - len * 0.02, x + len * 0.09, top - len * 0.02, x + len * 0.09, top + len * 0.1, x - len * 0.06, top + len * 0.1], IRON, { gloss: 0.5 });
  glossPoly(ctx, K, [x - len * 0.06, top + len * 0.01, x - len * 0.2, top + len * 0.04, x - len * 0.06, top + len * 0.07], IRON, { gloss: 0.5 });
  glossPoly(ctx, K, [x - hw, top - len * 0.02, x, top - len * 0.1, x + hw, top - len * 0.02], IRON, { gloss: 0.5 });
}

/** A spear: a long shaft and a leaf-shaped head on a socket. */
export function spear(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  const hw = Math.max(1.5, len * 0.014), top = y - len;
  glossPoly(ctx, K, [x - hw, y, x - hw, top + len * 0.14, x + hw, top + len * 0.14, x + hw, y], HAFT, { spread: 0.7 });
  glossPoly(ctx, K, [x, top, x + len * 0.035, top + len * 0.08, x + hw, top + len * 0.15, x - hw, top + len * 0.15, x - len * 0.035, top + len * 0.08], STEEL, { gloss: 0.6 });
}

/** A mace: a short haft and a flanged head. */
export function mace(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  const hw = Math.max(2, len * 0.04), top = y - len;
  glossPoly(ctx, K, [x - hw, y, x - hw, top + len * 0.25, x + hw, top + len * 0.25, x + hw, y], HAFT, { spread: 0.7 });
  for (let i = -2; i <= 2; i++) glossPoly(ctx, K, [x + i * len * 0.045, top + len * 0.02, x + i * len * 0.06 + (i < 0 ? -len * 0.04 : i > 0 ? len * 0.04 : 0), top + len * 0.14, x + i * len * 0.045, top + len * 0.28], IRON, { gloss: 0.5 });
  glossBall(ctx, K, x, top + len * 0.15, len * 0.09, IRON, { gloss: 0.5 });
}

/** A club: a length of hardwood swelling toward the striking end. */
export function club(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  glossPoly(ctx, K, [x - len * 0.035, y, x - len * 0.09, y - len * 0.8, x - len * 0.05, y - len, x + len * 0.06, y - len, x + len * 0.09, y - len * 0.8, x + len * 0.035, y], '#8a6a42', { spread: 0.7, h: 80, tex: 'cracks', seed: Math.round(x), amount: 0.4 });
}

/** A quarterstaff or a mage's staff, iron-shod, with an optional knot or crystal at its head. */
export function staff(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, wood = '#7a5a34', head?: string): void {
  const hw = Math.max(1.8, len * 0.016);
  glossPoly(ctx, K, [x - hw, y, x - hw, y - len, x + hw, y - len, x + hw, y], wood, { spread: 0.7 });
  for (const f of [0.03, 0.97]) { ctx.fillStyle = '#5a5460'; ctx.fillRect(Math.round(x - hw - 0.5), Math.round(y - len * f - 2), Math.round(hw * 2 + 1), 4); }
  if (head) glossPoly(ctx, K, [x, y - len - len * 0.09, x + len * 0.03, y - len - len * 0.03, x, y - len + len * 0.02, x - len * 0.03, y - len - len * 0.03], head, { gloss: 0.9 });
}

/** A strung bow hung upright: two limbs curving back from the grip, the string straight between the nocks. */
export function bow(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, wood = '#8a5a2a', recurve = false): void {
  const top = y - len, mid = y - len / 2, bend = len * 0.16;
  ctx.strokeStyle = '#d8d0c0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, y); ctx.stroke();
  const limb = (): void => {
    ctx.beginPath(); ctx.moveTo(x, top);
    if (recurve) { ctx.quadraticCurveTo(x - bend * 0.2, top + len * 0.1, x - bend, top + len * 0.3); ctx.quadraticCurveTo(x - bend * 1.2, mid, x - bend, y - len * 0.3); ctx.quadraticCurveTo(x - bend * 0.2, y - len * 0.1, x, y); }
    else { ctx.quadraticCurveTo(x - bend * 1.9, mid, x, y); }
  };
  limb(); ctx.strokeStyle = '#120c14'; ctx.lineWidth = Math.max(4, len * 0.045); ctx.stroke();
  limb(); ctx.strokeStyle = wood; ctx.lineWidth = Math.max(2, len * 0.028); ctx.stroke();
  glossPoly(ctx, K, [x - bend * (recurve ? 1.2 : 0.95) - 3, mid - len * 0.06, x - bend * (recurve ? 1.2 : 0.95) + 3, mid - len * 0.06, x - bend * (recurve ? 1.2 : 0.95) + 3, mid + len * 0.06, x - bend * (recurve ? 1.2 : 0.95) - 3, mid + len * 0.06], '#3a2416', {});
}

/** A crossbow hung by its stirrup, bow across the top. Centre-top (x, y), `w` across the bow. */
export function crossbow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const len = w * 1.2;
  glossPoly(ctx, K, [x - w * 0.07, y, x + w * 0.07, y, x + w * 0.06, y + len, x - w * 0.06, y + len], '#6a4626', { spread: 0.7 });
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - w / 2, y + w * 0.2); ctx.quadraticCurveTo(x, y - w * 0.08, x + w / 2, y + w * 0.2); ctx.stroke();
  ctx.strokeStyle = IRON; ctx.lineWidth = 3; ctx.stroke();
  line(ctx, [x - w / 2, y + w * 0.2, x, y + w * 0.34, x + w / 2, y + w * 0.2], '#d8d0c0', 1);
  ctx.strokeStyle = '#5a5460'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - w * 0.05, w * 0.08, Math.PI, 0); ctx.stroke();
}

/** A shield hung on the wall, centre (x, y): round (buckler), kite, or a tall tower shield; a boss and a device. */
export function shield(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, face: string, kind: 'round' | 'kite' | 'tower', device?: string): void {
  const rim = '#6a6e78';
  if (kind === 'round') {
    glossBall(ctx, K, x, y, r, rim, { gloss: 0.4 });
    glossBall(ctx, K, x, y, r * 0.86, face, { h: 80, tex: 'cracks', seed: Math.round(x), amount: 0.4 });
    if (device) { ctx.fillStyle = device; for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI * 2 + Math.PI / 4; fillPoly(ctx, [x, y, x + Math.cos(a - 0.3) * r * 0.8, y + Math.sin(a - 0.3) * r * 0.8, x + Math.cos(a + 0.3) * r * 0.8, y + Math.sin(a + 0.3) * r * 0.8], device); } }
    glossBall(ctx, K, x, y, r * 0.24, IRON, { gloss: 0.7 });
    return;
  }
  const w = kind === 'tower' ? r * 1.2 : r * 1.3, h = kind === 'tower' ? r * 2.6 : r * 2.1;
  const pts = kind === 'tower' ? [x - w / 2, y - h / 2, x + w / 2, y - h / 2, x + w / 2, y + h * 0.42, x, y + h / 2, x - w / 2, y + h * 0.42]
    : [x - w / 2, y - h * 0.4, x, y - h / 2, x + w / 2, y - h * 0.4, x + w * 0.4, y + h * 0.05, x, y + h / 2, x - w * 0.4, y + h * 0.05];
  glossPoly(ctx, K, pts, face, { gloss: 0.2, spread: 0.7 });
  ctx.save(); path(ctx, pts); ctx.clip();
  ctx.strokeStyle = rim; ctx.lineWidth = Math.max(3, r * 0.18); path(ctx, pts); ctx.stroke();
  if (device) { ctx.fillStyle = device; ctx.fillRect(x - w * 0.08, y - h / 2, w * 0.16, h); ctx.fillRect(x - w / 2, y - h * 0.12, w, h * 0.14); }
  ctx.restore();
  path(ctx, pts); ink(ctx);
  glossBall(ctx, K, x, y - h * 0.05, r * 0.2, IRON, { gloss: 0.7 });
}

/**
 * A suit of plate on its stand, foot on y: helm with a visor slit, pauldrons, a breastplate with a
 * ridge down it, tassets over the hips, and the stand's post and cross-foot showing below.
 */
export function armourStand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, metal = '#aab2be'): void {
  const u = h / 100;
  line(ctx, [x, y, x, y - 40 * u], '#120c14', 5); line(ctx, [x, y, x, y - 40 * u], '#6a4626', 3);
  line(ctx, [x - 14 * u, y, x + 14 * u, y], '#120c14', 5); line(ctx, [x - 14 * u, y, x + 14 * u, y], '#6a4626', 3);
  // Tassets and cuirass.
  glossPoly(ctx, K, [x - 17 * u, y - 44 * u, x + 17 * u, y - 44 * u, x + 19 * u, y - 32 * u, x + 4 * u, y - 30 * u, x, y - 34 * u, x - 4 * u, y - 30 * u, x - 19 * u, y - 32 * u], shade(metal, 0.9), { gloss: 0.5, spread: 0.6 });
  glossPoly(ctx, K, [x - 20 * u, y - 80 * u, x + 20 * u, y - 80 * u, x + 17 * u, y - 58 * u, x + 13 * u, y - 44 * u, x - 13 * u, y - 44 * u, x - 17 * u, y - 58 * u], metal, { gloss: 0.7, spread: 0.6 });
  line(ctx, [x, y - 79 * u, x, y - 46 * u], rgba('#ffffff', 0.55), 1.5);
  line(ctx, [x - 13 * u, y - 50 * u, x + 13 * u, y - 50 * u], rgba('#1a1418', 0.5), 1);
  // Pauldrons.
  for (const sd of [-1, 1]) glossEllipse(ctx, K, x + sd * 22 * u, y - 78 * u, 9 * u, 7 * u, metal, sd * 0.3, { gloss: 0.7 });
  // The gorget and helm.
  glossPoly(ctx, K, [x - 8 * u, y - 80 * u, x + 8 * u, y - 80 * u, x + 7 * u, y - 86 * u, x - 7 * u, y - 86 * u], shade(metal, 0.85), { gloss: 0.5 });
  glossPoly(ctx, K, [x - 9 * u, y - 86 * u, x - 10 * u, y - 97 * u, x - 5 * u, y - 104 * u, x + 5 * u, y - 104 * u, x + 10 * u, y - 97 * u, x + 9 * u, y - 86 * u], metal, { gloss: 0.8, spread: 0.6 });
  ctx.fillStyle = '#120c14'; ctx.fillRect(Math.round(x - 7 * u), Math.round(y - 96 * u), Math.round(14 * u), Math.max(1, Math.round(1.6 * u)));
  line(ctx, [x, y - 104 * u, x, y - 88 * u], rgba('#ffffff', 0.5), 1);
  glossPoly(ctx, K, [x - 2 * u, y - 104 * u, x, y - 110 * u, x + 2 * u, y - 104 * u], '#a83a2a', {});
}

/** Chain mail hung on a peg, its top at y: a shirt of rings with short sleeves. */
export function mail(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, metal = '#9aa2ae'): void {
  const w = h * 0.8;
  glossPoly(ctx, K, [x - w * 0.2, y, x + w * 0.2, y, x + w * 0.5, y + h * 0.08, x + w * 0.52, y + h * 0.3, x + w * 0.36, y + h * 0.3, x + w * 0.38, y + h, x - w * 0.38, y + h, x - w * 0.36, y + h * 0.3, x - w * 0.52, y + h * 0.3, x - w * 0.5, y + h * 0.08], metal, { gloss: 0.3, spread: 0.7, h: 100, tex: 'mail', seed: Math.round(x), amount: 1 });
  glossBall(ctx, K, x, y - 2, 2.5, '#6a4626', {});
}

/** An anvil on its block, foot on y: the horn to the left, the face, the heel. */
export function anvil(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  slab(ctx, x - w * 0.28, y - w * 0.36, w * 0.56, w * 0.36, '#6a4a2e');
  glossPoly(ctx, K, [x - w * 0.18, y - w * 0.36, x - w * 0.12, y - w * 0.5, x + w * 0.12, y - w * 0.5, x + w * 0.18, y - w * 0.36], '#3e3c44', { gloss: 0.4 });
  glossPoly(ctx, K, [x - w * 0.5, y - w * 0.62, x - w * 0.22, y - w * 0.66, x + w * 0.4, y - w * 0.66, x + w * 0.4, y - w * 0.52, x - w * 0.22, y - w * 0.52], '#4a4852', { gloss: 0.6, spread: 0.6 });
  line(ctx, [x - w * 0.2, y - w * 0.655, x + w * 0.38, y - w * 0.655], rgba('#ffffff', 0.5), 1);
}

// ------------------------------------------------------------------ holy things ----

/** A round stone column from `top` to the floor at y: a moulded capital and base, the shaft lit down its left and fluted. */
export function pillar(ctx: CanvasRenderingContext2D, x: number, top: number, y: number, w: number, stone: string): void {
  const t = ramp(stone), st = top + w * 0.55, sb = y - w * 0.45;
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  g.addColorStop(0, t.hi); g.addColorStop(0.35, stone); g.addColorStop(0.78, t.sh); g.addColorStop(1, t.deep);
  ctx.fillStyle = g; ctx.fillRect(x - w * 0.42, st, w * 0.84, sb - st);
  for (let i = 1; i < 5; i++) { const fx = x - w * 0.42 + (w * 0.84 * i) / 5; line(ctx, [fx, st + 2, fx, sb - 2], rgba(t.deep, 0.3 + (i > 2 ? 0.15 : 0)), 1); }
  inkRect(ctx, x - w * 0.42, st, w * 0.84, sb - st);
  glossPoly(ctx, K, [x - w * 0.62, top + w * 0.2, x + w * 0.62, top + w * 0.2, x + w * 0.44, st, x - w * 0.44, st], stone, { spread: 0.7 });
  slab(ctx, x - w * 0.72, top, w * 1.44, w * 0.2, stone);
  glossPoly(ctx, K, [x - w * 0.44, sb, x + w * 0.44, sb, x + w * 0.6, y - w * 0.2, x - w * 0.6, y - w * 0.2], stone, { spread: 0.7 });
  slab(ctx, x - w * 0.68, y - w * 0.2, w * 1.36, w * 0.2, shade(stone, 0.95));
}

/**
 * Stained glass: panes of colour in lead round the Lanterns' ring and flame. It glows with the
 * day behind it, and keeps a little colour at night from the lamps inside.
 */
export function stainedGlass(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, daylight: number, colors: readonly string[], seed = 0): void {
  const lit = 0.3 + 0.7 * daylight;
  const cols = 4, rows = Math.max(4, Math.round(h / (w / cols)));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const col = colors[Math.floor(rnd(seed, r, c) * colors.length)];
    ctx.fillStyle = shade(col, lit * (0.85 + rnd(seed, r, c, 1) * 0.3));
    const px = x + (w / cols) * c, py = y + (h / rows) * r, jx = (rnd(seed, r, c, 2) - 0.5) * 4;
    fillPoly(ctx, [px + jx, py, px + w / cols + jx, py, px + w / cols, py + h / rows, px, py + h / rows], ctx.fillStyle as string);
  }
  const cx = x + w / 2, cy = y + h * 0.42, r = w * 0.3;
  ctx.fillStyle = shade('#f0d890', lit); ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2); ctx.fill();
  lanternRing(ctx, cx, cy, r, shade('#e8c050', lit), shade('#fff0c0', lit));
  // The leading: every pane edge, and rays from the ring.
  ctx.strokeStyle = '#1a1418'; ctx.lineWidth = 1.5;
  for (let c = 1; c < cols; c++) { ctx.beginPath(); ctx.moveTo(x + (w / cols) * c, y); ctx.lineTo(x + (w / cols) * c, y + h); ctx.stroke(); }
  for (let r2 = 1; r2 < rows; r2++) { ctx.beginPath(); ctx.moveTo(x, y + (h / rows) * r2); ctx.lineTo(x + w, y + (h / rows) * r2); ctx.stroke(); }
  if (daylight > 0.2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, cx, cy, r * 1.8, '#ffe0a0', 0.25 * daylight); ctx.restore(); }
}

/** An altar: a stone table, its top seen from a little above, a cloth hung down its front with an emblem and a fringe. */
export function altar(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, depth: number, bottom: number, stone: string, drape: string, trim: string, emblem?: (cx: number, cy: number, r: number) => void): void {
  const w = x1 - x0, fy = top + depth, t = ramp(stone);
  ctx.fillStyle = shade(stone, 0.85); ctx.fillRect(x0 + 6, fy, w - 12, bottom - fy);
  for (let i = 0; i < 3; i++) block(ctx, x0 + 6, fy + 6 + i * ((bottom - fy - 6) / 3), w - 12, (bottom - fy - 6) / 3 - 1, shade(stone, 0.8 + i * 0.05), i);
  inkRect(ctx, x0 + 6, fy, w - 12, bottom - fy);
  const g = ctx.createLinearGradient(0, top, 0, fy);
  g.addColorStop(0, shade(stone, 0.8)); g.addColorStop(1, t.hi);
  ctx.fillStyle = g; ctx.fillRect(x0, top, w, depth);
  slab(ctx, x0, fy, w, 6, stone);
  inkRect(ctx, x0, top, w, depth + 6);
  // The cloth down the middle of the front.
  const cw = w * 0.5, cx0 = x0 + (w - cw) / 2, ch = (bottom - fy) * 0.78;
  cloth(ctx, cx0, cx0 + cw, fy + 1, ch, drape);
  ctx.fillStyle = trim; ctx.fillRect(Math.round(cx0 + 2), Math.round(fy + 3), Math.round(cw - 4), 2);
  for (let i = 0; i < 12; i++) line(ctx, [cx0 + 3 + ((cw - 6) * i) / 11, fy + ch - 1, cx0 + 3 + ((cw - 6) * i) / 11, fy + ch + 3], trim, 1);
  if (emblem) emblem(cx0 + cw / 2, fy + ch * 0.48, cw * 0.18);
}

/** The back of a pew, seen from behind: a top rail at y, the back board below it, an end post. From x0 to x1. */
export function pew(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, h: number, wood: string, endLeft = true): void {
  slab(ctx, x0, y + 5, x1 - x0, h - 5, shade(wood, 0.72), { lit: 1, dark: 0.2 });
  for (let i = 1; i < 6; i++) line(ctx, [x0 + ((x1 - x0) * i) / 6, y + 7, x0 + ((x1 - x0) * i) / 6, y + h], rgba(ramp(wood).deep, 0.5), 1);
  beam(ctx, x0 - 2, y, x1 - x0 + 4, 6, wood);
  const px = endLeft ? x0 - 4 : x1 - 6;
  slab(ctx, px, y - 8, 10, h + 8, shade(wood, 0.9));
  glossBall(ctx, K, px + 5, y - 9, 4, shade(wood, 1.05), { gloss: 0.3 });
}

// ------------------------------------------------------------------ cloth and paper ----

/** A row of books on a shelf whose top is y, from x across w: spines of mixed height, colour and lean. */
export function books(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number, colors: readonly string[]): void {
  let bx = x, i = 0;
  while (bx < x + w - 3) {
    const bw = Math.min(x + w - bx, 3 + rnd(seed, i) * 5), bh = h * (0.7 + rnd(seed, i, 1) * 0.3);
    if (rnd(seed, i, 5) < 0.08 && bx + bh < x + w) {
      // One lying on its side.
      slab(ctx, bx, y - bw, bh, bw, colors[Math.floor(rnd(seed, i, 2) * colors.length)], { lit: 1, dark: 0.3 });
      bx += bh + 1; i++; continue;
    }
    const col = colors[Math.floor(rnd(seed, i, 2) * colors.length)], t = ramp(col);
    slab(ctx, bx, y - bh, bw, bh, col, { lit: 1, dark: 0.12 });
    ctx.fillStyle = '#c9a34a';
    if (bh > 10) { ctx.fillRect(Math.round(bx + 1), Math.round(y - bh + 2), Math.max(1, Math.round(bw - 2)), 1); ctx.fillRect(Math.round(bx + 1), Math.round(y - 4), Math.max(1, Math.round(bw - 2)), 1); }
    if (bw > 4 && bh > 14) { ctx.fillStyle = rgba(t.hi, 0.8); ctx.fillRect(Math.round(bx + bw / 2 - 1), Math.round(y - bh * 0.62), 2, Math.round(bh * 0.22)); }
    bx += bw; i++;
  }
}

/**
 * A banner hung from a rod at y: cloth from x across w, `h` long to a swallowtail or a point, a
 * border, and an emblem painted by `emblem` at its centre.
 */
export function banner(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, cloth: string, o: { trim?: string; tail?: 'point' | 'swallow' | 'straight'; emblem?: (cx: number, cy: number, r: number) => void; rod?: string } = {}): void {
  const tail = o.tail ?? 'point';
  const pts = tail === 'swallow' ? [x, y, x + w, y, x + w, y + h, x + w / 2, y + h * 0.82, x, y + h]
    : tail === 'point' ? [x, y, x + w, y, x + w, y + h * 0.84, x + w / 2, y + h, x, y + h * 0.84] : [x, y, x + w, y, x + w, y + h, x, y + h];
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  const t = ramp(cloth);
  g.addColorStop(0, t.hi); g.addColorStop(0.3, cloth); g.addColorStop(0.75, cloth); g.addColorStop(1, t.sh);
  fillPoly(ctx, pts, g);
  // Folds hanging straight down.
  ctx.save(); path(ctx, pts); ctx.clip();
  for (let i = 1; i < 4; i++) { const fx = x + (w / 4) * i; const fg = ctx.createLinearGradient(fx - 3, 0, fx + 3, 0); fg.addColorStop(0, rgba(t.deep, 0)); fg.addColorStop(0.5, rgba(t.deep, 0.35)); fg.addColorStop(1, rgba(t.deep, 0)); ctx.fillStyle = fg; ctx.fillRect(fx - 3, y, 6, h); }
  if (o.trim) { ctx.strokeStyle = o.trim; ctx.lineWidth = 2; path(ctx, pts.map((v, i) => i % 2 === 0 ? x + w / 2 + (v - x - w / 2) * 0.86 : y + (v - y) * 0.94 + h * 0.03)); ctx.stroke(); }
  ctx.restore();
  path(ctx, pts); ink(ctx);
  if (o.emblem) o.emblem(x + w / 2, y + h * 0.42, w * 0.3);
  const rod = o.rod ?? '#3a3440';
  line(ctx, [x - 4, y, x + w + 4, y], INK, 4); line(ctx, [x - 4, y, x + w + 4, y], rod, 2);
  glossBall(ctx, K, x - 5, y, 2.5, '#c9a34a', { gloss: 0.6 }); glossBall(ctx, K, x + w + 5, y, 2.5, '#c9a34a', { gloss: 0.6 });
}

/** The Lanterns' emblem: a ring round a flame. */
export function lanternRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, flameCol = '#ffd070'): void {
  ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, r * 0.34); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, r * 0.2); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.6); ctx.quadraticCurveTo(cx + r * 0.4, cy, cx, cy + r * 0.45); ctx.quadraticCurveTo(cx - r * 0.4, cy, cx, cy - r * 0.6); ctx.closePath();
  ctx.fillStyle = flameCol; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.stroke();
}

/** A painting in a gilt frame: `paint` draws the picture into (x, y, w, h). */
export function painting(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void, gilt = '#b8902e'): void {
  const f = Math.max(3, Math.min(w, h) * 0.08);
  ctx.fillStyle = rgba('#0a0608', 0.35); ctx.fillRect(x - f + 3, y - f + 3, w + f * 2, h + f * 2);
  slab(ctx, x - f, y - f, w + f * 2, h + f * 2, gilt, { lit: 2, dark: 0.25 });
  ctx.save(); clipRect(ctx, x, y, w, h); paint(ctx); ctx.restore();
  ctx.fillStyle = rgba('#0a0608', 0.4); ctx.fillRect(x, y, w, 2); ctx.fillRect(x, y, 2, h);
  inkRect(ctx, x, y, w, h);
}

/** A cloth hung over a rail or a string: a sagging drape with folds. From (x0, y) to (x1, y), hanging `h`. */
export function cloth(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, h: number, col: string, seed = 0): void {
  const pts = [x0, y, x1, y, x1 - 2, y + h];
  const n = 6;
  for (let i = n - 1; i >= 1; i--) pts.push(x0 + (x1 - x0) * (i / n), y + h * (0.85 + rnd(seed, i) * 0.2));
  pts.push(x0 + 2, y + h);
  const t = ramp(col);
  fillPoly(ctx, pts, col);
  ctx.save(); path(ctx, pts); ctx.clip();
  for (let i = 1; i < n; i++) line(ctx, [x0 + (x1 - x0) * (i / n), y, x0 + (x1 - x0) * (i / n) + (rnd(seed, i, 3) - 0.5) * 3, y + h], rgba(t.sh, 0.6), 1.5);
  ctx.fillStyle = rgba(t.hi, 0.6); ctx.fillRect(x0, y, x1 - x0, 1.5);
  ctx.restore();
  path(ctx, pts); ink(ctx);
}

