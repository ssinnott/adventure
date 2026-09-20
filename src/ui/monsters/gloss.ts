// Rendered shading for the monsters, after the Xeen look: the same 1 px ink outline and the same
// tone ramp as the cel helpers, but the fill is a gradient built from the ramp (highlight toward
// the light, shadow away from it, a deep band at the far edge), with an optional specular for
// glossy materials and a surface texture drawn as flat marks inside the shape. Every helper
// honours the brush's flash override (a flat white silhouette) and only textures shapes that are
// big enough on screen for the marks to read as surface rather than noise.
import type { Brush } from '../brush.ts';
import { mix, rgba } from '../../lib/art/palettes.ts';
import { tones, outlinePath, pathCap } from '../../lib/art/shading.ts';
import { pathEllipse, pathTaperedCapsule } from '../../lib/art/shapes.ts';

/** Surface textures: flat marks in the ramp's tones, clipped to the shape. */
export type Texture = 'fur' | 'stipple' | 'scales' | 'mail' | 'cracks' | 'folds' | 'facets' | 'bristle';

export interface GlossOpts {
  /** Specular strength 0..1 (0 = matte fur or cloth, 0.6 = wet or glossy, 1 = crystal). */
  gloss?: number;
  /** A texture to draw inside the shape. */
  tex?: Texture;
  /** Seed for the texture's placement, so the marks are stable frame to frame. */
  seed?: number;
  /** The sprite's height on screen; textures are skipped under TEX_MIN_H. */
  h?: number;
  /** Texture density multiplier (1 = default). */
  amount?: number;
  /** How far the light reaches: 1 = a rounded, evenly lit form; 0.6 = a harder, more sculpted fall-off. */
  spread?: number;
}

/** Below this sprite height (px) textures are not drawn: the marks would be 1 px noise. */
export const TEX_MIN_H = 56;

/** Stable 0..1 noise for mark placement. Mixed harder than brush.ts's hash, whose outputs for arguments a bit apart correlate. */
function rnd(a: number, b: number, c: number): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/** Gradient fill of the current path: highlight offset toward the light, deep shadow at the far edge. */
function fillRadial(ctx: CanvasRenderingContext2D, B: Brush, hex: string, cx: number, cy: number, r: number, spread: number): void {
  const t = tones(B, hex);
  const lx = B.light.x, ly = B.light.y;
  const g = ctx.createRadialGradient(cx + lx * r * 0.42, cy + ly * r * 0.42, Math.max(0.5, r * 0.04), cx, cy, r * (0.95 + spread * 0.35));
  g.addColorStop(0, mix(t.hi, '#ffffff', 0.22));
  g.addColorStop(0.12, t.hi);
  g.addColorStop(0.36, t.base);
  g.addColorStop(0.74, t.sh);
  g.addColorStop(1, t.deep);
  ctx.fillStyle = g; ctx.fill();
}

/** Gradient fill of a limb-like path: across the axis, lit edge to far edge. */
function fillAcross(ctx: CanvasRenderingContext2D, B: Brush, hex: string, x0: number, y0: number, x1: number, y1: number, r: number): void {
  const t = tones(B, hex);
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len, ny = dx / len;
  if (nx * B.light.x + ny * B.light.y < 0) { nx = -nx; ny = -ny; }
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const g = ctx.createLinearGradient(mx + nx * r, my + ny * r, mx - nx * r, my - ny * r);
  g.addColorStop(0, t.hi);
  g.addColorStop(0.38, t.base);
  g.addColorStop(0.78, t.sh);
  g.addColorStop(1, t.deep);
  ctx.fillStyle = g; ctx.fill();
}

/** A soft white specular on the lit side, for wet, glossy or crystalline surfaces. */
function specular(ctx: CanvasRenderingContext2D, B: Brush, cx: number, cy: number, r: number, k: number): void {
  if (k <= 0 || r < 3) return;
  const lx = B.light.x, ly = B.light.y;
  ctx.fillStyle = rgba('#ffffff', 0.18 + 0.5 * k);
  pathEllipse(ctx, cx + lx * r * 0.5, cy + ly * r * 0.5, r * 0.28, r * 0.15, Math.atan2(ly, lx) + Math.PI / 2 + 0.3);
  ctx.fill();
  if (r >= 8) { ctx.fillStyle = rgba('#ffffff', 0.25 + 0.4 * k); pathEllipse(ctx, cx + lx * r * 0.6, cy + ly * r * 0.6, r * 0.1, r * 0.06); ctx.fill(); }
}

/** Draw `tex` inside the current clip, around (cx, cy) with extent r. */
function texture(ctx: CanvasRenderingContext2D, B: Brush, hex: string, tex: Texture, cx: number, cy: number, r: number, seed: number, amount: number): void {
  const t = tones(B, hex);
  const lx = B.light.x, ly = B.light.y;
  const lit = (px: number, py: number) => (px - cx) * lx + (py - cy) * ly > -r * 0.1;
  /** A mark's colour: dark where the gradient is lit, pale where it is in shadow, so it shows either way. */
  const ink = (px: number, py: number) => lit(px, py) ? t.deep : t.hi;
  ctx.lineCap = 'round'; ctx.lineWidth = 1;
  switch (tex) {
    case 'fur': case 'bristle': {
      // Short strokes lying down and outward from the spine, shadow-toned; the lit crown gets pale tips.
      const n = Math.min(90, Math.round(amount * r * r / 9)), len = tex === 'bristle' ? r * 0.3 : r * 0.18;
      for (let i = 0; i < n; i++) {
        const px = cx + (rnd(seed, i, 1) - 0.5) * 2.2 * r, py = cy + (rnd(seed, i, 2) - 0.5) * 2.2 * r;
        const ox = (px - cx) / r * 0.5, oy = tex === 'bristle' ? -0.9 : 0.85, l = len * (0.6 + rnd(seed, i, 3) * 0.7);
        ctx.strokeStyle = ink(px, py);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + ox * l, py + oy * l); ctx.stroke();
      }
      break;
    }
    case 'stipple': {
      // Warts and pores: small dark rounds, each with a lit pixel.
      const n = Math.min(40, Math.round(amount * r * r / 30));
      for (let i = 0; i < n; i++) {
        const px = cx + (rnd(seed, i, 1) - 0.5) * 1.9 * r, py = cy + (rnd(seed, i, 2) - 0.5) * 1.9 * r, rr = 1 + rnd(seed, i, 3) * Math.min(2.5, r * 0.08);
        ctx.fillStyle = lit(px, py) ? t.sh : t.deep; ctx.beginPath(); ctx.arc(px, py, rr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = lit(px, py) ? mix(t.hi, '#ffffff', 0.3) : t.base; ctx.fillRect(Math.round(px + lx * rr * 0.5), Math.round(py + ly * rr * 0.5), 1, 1);
      }
      break;
    }
    case 'scales': {
      // Overlapping rows of arcs, shadow-toned, paler on the lit side.
      const step = Math.max(3, r * 0.22);
      let row = 0;
      for (let y = cy - r; y <= cy + r; y += step * 0.75, row++) {
        for (let x = cx - r - (row % 2) * step / 2; x <= cx + r; x += step) {
          ctx.strokeStyle = ink(x, y);
          ctx.beginPath(); ctx.arc(x, y, step * 0.5, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
        }
      }
      break;
    }
    case 'mail': {
      // A lattice of tiny rings: dark rings, lit rings toward the light.
      const step = Math.max(2.5, Math.min(4, r * 0.12));
      let row = 0;
      for (let y = cy - r; y <= cy + r; y += step, row++) {
        for (let x = cx - r - (row % 2) * step / 2; x <= cx + r; x += step) {
          ctx.strokeStyle = lit(x, y) ? mix(t.hi, '#ffffff', 0.3) : t.deep;
          ctx.beginPath(); ctx.arc(x, y, step * 0.36, 0, Math.PI * 2); ctx.stroke();
        }
      }
      break;
    }
    case 'cracks': {
      // Two or three dark hairlines wandering from a point, with a pale edge on the lit side.
      const n = Math.max(1, Math.round(amount * 2.5));
      for (let i = 0; i < n; i++) {
        let px = cx + (rnd(seed, i, 1) - 0.5) * 1.4 * r, py = cy + (rnd(seed, i, 2) - 0.5) * 1.4 * r;
        ctx.strokeStyle = t.deep; ctx.beginPath(); ctx.moveTo(px, py);
        for (let k = 0; k < 4; k++) { px += (rnd(seed, i, k + 3) - 0.5) * r * 0.5; py += (rnd(seed, i, k + 9) - 0.3) * r * 0.45; ctx.lineTo(px, py); }
        ctx.stroke();
      }
      break;
    }
    case 'folds': {
      // Cloth: a few long shadow lines bowing down from the top edge, one lit ridge beside each.
      const n = Math.max(2, Math.round(amount * 3));
      for (let i = 0; i < n; i++) {
        const fx = cx + ((i + 0.5) / n - 0.5) * 1.5 * r + (rnd(seed, i, 1) - 0.5) * r * 0.3;
        const bow = (rnd(seed, i, 2) - 0.5) * r * 0.5;
        ctx.strokeStyle = t.sh; ctx.lineWidth = Math.max(1, r * 0.05);
        ctx.beginPath(); ctx.moveTo(fx, cy - r); ctx.quadraticCurveTo(fx + bow, cy, fx + bow * 0.4, cy + r); ctx.stroke();
        ctx.strokeStyle = t.hi; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(fx - 1.5, cy - r * 0.7); ctx.quadraticCurveTo(fx + bow - 1.5, cy, fx + bow * 0.4 - 1.5, cy + r); ctx.stroke();
      }
      break;
    }
    case 'facets': {
      // Crystal: wedges from an off-centre point to the rim, alternately lit and shadowed.
      const n = 5 + Math.round(amount * 2), ox = cx + lx * r * 0.2, oy = cy + ly * r * 0.2, a0 = rnd(seed, 0, 1) * Math.PI * 2;
      for (let i = 0; i < n; i++) {
        const a = a0 + (i / n) * Math.PI * 2, b = a0 + ((i + 1) / n) * Math.PI * 2, R = r * 1.6;
        ctx.fillStyle = rgba(i % 2 ? t.deep : t.hi, 0.28);
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + Math.cos(a) * R, oy + Math.sin(a) * R); ctx.lineTo(ox + Math.cos(b) * R, oy + Math.sin(b) * R); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = t.hi; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + Math.cos(a) * R, oy + Math.sin(a) * R); ctx.stroke();
      }
      break;
    }
  }
}

/** Paint the current (already traced) path: outline, rendered fill, texture and specular clipped inside. */
export function glossPath(ctx: CanvasRenderingContext2D, B: Brush, hex: string, cx: number, cy: number, r: number, o: GlossOpts = {}): void {
  outlinePath(ctx, B);
  if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }
  fillRadial(ctx, B, hex, cx, cy, r, o.spread ?? 1);
  finish(ctx, B, hex, cx, cy, r, o);
}

function finish(ctx: CanvasRenderingContext2D, B: Brush, hex: string, cx: number, cy: number, r: number, o: GlossOpts): void {
  const wantTex = o.tex && (o.h ?? 0) >= TEX_MIN_H && r >= 5;
  const wantSpec = (o.gloss ?? 0) > 0 && r >= 3;
  if (!wantTex && !wantSpec) return;
  ctx.save(); ctx.clip();
  if (wantTex) texture(ctx, B, hex, o.tex!, cx, cy, r, o.seed ?? 0, o.amount ?? 1);
  if (wantSpec) specular(ctx, B, cx, cy, r, o.gloss!);
  ctx.restore();
}

export function glossBall(ctx: CanvasRenderingContext2D, B: Brush, cx: number, cy: number, r: number, hex: string, o: GlossOpts = {}): void {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  glossPath(ctx, B, hex, cx, cy, r, o);
}

export function glossEllipse(ctx: CanvasRenderingContext2D, B: Brush, cx: number, cy: number, rx: number, ry: number, hex: string, rot = 0, o: GlossOpts = {}): void {
  pathEllipse(ctx, cx, cy, rx, ry, rot);
  glossPath(ctx, B, hex, cx, cy, Math.max(rx, ry), o);
}

/** Polygon from a flat [x0,y0,...] array; centre and extent from its bounds. */
export function glossPoly(ctx: CanvasRenderingContext2D, B: Brush, pts: readonly number[], hex: string, o: GlossOpts = {}): void {
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 0; i < pts.length; i += 2) {
    const x = pts[i], y = pts[i + 1];
    if (i) ctx.lineTo(x, y);
    if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
  }
  ctx.closePath();
  glossPath(ctx, B, hex, (minx + maxx) / 2, (miny + maxy) / 2, Math.hypot(maxx - minx, maxy - miny) / 2, o);
}

/** A limb: capsule with the light falling across it. */
export function glossCapsule(ctx: CanvasRenderingContext2D, B: Brush, x0: number, y0: number, x1: number, y1: number, r: number, hex: string, o: GlossOpts = {}): void {
  pathCap(ctx, x0, y0, x1, y1, r);
  outlinePath(ctx, B);
  if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }
  fillAcross(ctx, B, hex, x0, y0, x1, y1, r);
  finish(ctx, B, hex, (x0 + x1) / 2, (y0 + y1) / 2, Math.max(r, Math.hypot(x1 - x0, y1 - y0) / 2), { ...o, gloss: 0 });
}

/** A tapered limb (r0 at the start, r1 at the end), lit across. */
export function glossTaper(ctx: CanvasRenderingContext2D, B: Brush, x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, hex: string, o: GlossOpts = {}): void {
  pathTaperedCapsule(ctx, x0, y0, x1, y1, r0, r1);
  outlinePath(ctx, B);
  if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }
  fillAcross(ctx, B, hex, x0, y0, x1, y1, Math.max(r0, r1));
  finish(ctx, B, hex, (x0 + x1) / 2, (y0 + y1) / 2, Math.max(r0, r1, Math.hypot(x1 - x0, y1 - y0) / 2), { ...o, gloss: 0 });
}

/** An emissive glow: a real radial gradient from a hot core to nothing, additive-looking on dark ground. */
export function glow(ctx: CanvasRenderingContext2D, B: Brush, cx: number, cy: number, r: number, hex: string, alpha = 0.6, core = '#fff0c0'): void {
  if (B.override) return;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, rgba(core, alpha));
  g.addColorStop(0.35, rgba(hex, alpha * 0.7));
  g.addColorStop(1, rgba(hex, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
}
