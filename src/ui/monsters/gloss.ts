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

/**
 * Gradient fill of the current path, ALONG THE LIGHT rather than out from a centre: lit edge,
 * base, shadow, deep at the far edge. A radial ramp would reach its dark stop all the way around
 * the shape, which rings every part with its own outline once parts are unioned into one mass and
 * makes a single shape look like an inflated balloon. A directional ramp only darkens the side
 * facing away from the light, which is also what a lit surface actually does.
 * `spread` < 1 pulls the dark end in, for a harder, more sculpted fall-off.
 */
function fillForm(ctx: CanvasRenderingContext2D, B: Brush, hex: string, cx: number, cy: number, r: number, spread: number): void {
  const t = tones(B, hex);
  const lx = B.light.x, ly = B.light.y;
  const g = ctx.createLinearGradient(cx + lx * r, cy + ly * r, cx - lx * r * (0.4 + spread * 0.6), cy - ly * r * (0.4 + spread * 0.6));
  g.addColorStop(0, mix(t.hi, '#ffffff', 0.12));
  g.addColorStop(0.2, t.hi);
  g.addColorStop(0.5, t.base);
  g.addColorStop(0.84, t.sh);
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

/**
 * A soft white specular on the lit side, for wet, glossy or crystalline surfaces. The fall-off is a
 * gradient: filled as a flat ellipse it has a hard rim, and on anything but a small bright dot that
 * rim reads as a pale lens stuck to the surface rather than as light on it.
 */
function specular(ctx: CanvasRenderingContext2D, B: Brush, cx: number, cy: number, r: number, k: number): void {
  if (k <= 0 || r < 3) return;
  const lx = B.light.x, ly = B.light.y;
  const sx = cx + lx * r * 0.5, sy = cy + ly * r * 0.5, sr = r * 0.3;
  const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
  g.addColorStop(0, rgba('#ffffff', 0.2 + 0.55 * k));
  g.addColorStop(0.45, rgba('#ffffff', 0.12 + 0.3 * k));
  g.addColorStop(1, rgba('#ffffff', 0));
  ctx.save();
  ctx.translate(sx, sy); ctx.rotate(Math.atan2(ly, lx) + Math.PI / 2 + 0.3); ctx.scale(1, 0.55); ctx.translate(-sx, -sy);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // The hot pinpoint at the middle of the highlight, which is what makes a surface look wet.
  if (r >= 8) {
    const hr = r * 0.085, hx = cx + lx * r * 0.58, hy = cy + ly * r * 0.58;
    const g2 = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr * 2);
    g2.addColorStop(0, rgba('#ffffff', 0.3 + 0.55 * k));
    g2.addColorStop(1, rgba('#ffffff', 0));
    ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(hx, hy, hr * 2, 0, Math.PI * 2); ctx.fill();
  }
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
      // Short strokes lying down and out from the spine. They are a SURFACE, not a set of scratches:
      // short relative to the mass, dense, and only a step off the tone under them, or a 70 px
      // sprite ends up covered in hairs the length of its own leg.
      const n = Math.min(140, Math.round(amount * r * r / 5)), len = tex === 'bristle' ? r * 0.16 : r * 0.09;
      const soft = (hex2: string) => rgba(hex2, 0.5);
      for (let i = 0; i < n; i++) {
        const px = cx + (rnd(seed, i, 1) - 0.5) * 2.2 * r, py = cy + (rnd(seed, i, 2) - 0.5) * 2.2 * r;
        const ox = (px - cx) / r * 0.5, oy = tex === 'bristle' ? -0.9 : 0.85, l = len * (0.6 + rnd(seed, i, 3) * 0.7);
        ctx.strokeStyle = soft(lit(px, py) ? t.sh : t.hi);
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
      // Crystal: wedges from an off-centre point to the rim, alternately lit and shadowed. The
      // break between two wedges fades out along its length, because a full-strength highlight
      // hairline run all the way to the rim turns anything bigger than a single shard into a
      // starburst of light rays crossing whatever else the shape contains.
      const n = 5 + Math.round(amount * 2), ox = cx + lx * r * 0.2, oy = cy + ly * r * 0.2, a0 = rnd(seed, 0, 1) * Math.PI * 2;
      ctx.lineWidth = Math.max(1, r * 0.016); ctx.lineCap = 'butt';
      for (let i = 0; i < n; i++) {
        const a = a0 + (i / n) * Math.PI * 2, b = a0 + ((i + 1) / n) * Math.PI * 2, R = r * 1.6;
        const ex = ox + Math.cos(a) * R, ey = oy + Math.sin(a) * R;
        ctx.fillStyle = rgba(i % 2 ? t.deep : t.hi, 0.28);
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.lineTo(ox + Math.cos(b) * R, oy + Math.sin(b) * R); ctx.closePath(); ctx.fill();
        const g = ctx.createLinearGradient(ox, oy, ex, ey);
        g.addColorStop(0, rgba(t.hi, 0.55)); g.addColorStop(0.45, rgba(t.hi, 0.2)); g.addColorStop(1, rgba(t.hi, 0));
        ctx.strokeStyle = g;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
      }
      break;
    }
  }
}

/** Paint the current (already traced) path: outline, rendered fill, texture and specular clipped inside. */
export function glossPath(ctx: CanvasRenderingContext2D, B: Brush, hex: string, cx: number, cy: number, r: number, o: GlossOpts = {}): void {
  outlinePath(ctx, B);
  if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }
  fillForm(ctx, B, hex, cx, cy, r, o.spread ?? 1);
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

// ------------------------------------------------------------------ organic ----
// A creature is not a pile of outlined primitives. `blob` takes parts that belong to ONE surface (a
// wolf's fur, a robe, a hide) and paints them as a single mass: the outline is stroked once around
// the union, the fill is one rendered gradient across the whole, then, clipped inside, each part
// gets a soft translucent volume so limbs and heads still read as round, plus creases where forms
// meet, a texture and a specular. Contours can be lumpy (wobble) or fur-edged (spiky) so nothing is
// a clean ellipse unless it should be. Draw back to front.
//
// One blob per material is the starting point, NOT the rule. A contour is what says "this is a
// separate thing", so anything the eye must read as its own body section needs one, even when it
// is the same material as its neighbour: a spider's abdomen and carapace are both chitin, and
// unioned into one mass they are a blob with legs. The test is whether a viewer has to be able to
// name the part. Sections that must read separately get their own blob and overlap a little; a
// surface that is continuous (a torso and the shoulder on it) stays in one.

// A marking is the opposite case, and takes `patch` rather than a blob of its own.


export type Part =
  | { k: 'ball'; x: number; y: number; r: number; gloss?: number }
  | { k: 'ell'; x: number; y: number; rx: number; ry: number; rot?: number; gloss?: number }
  | { k: 'cap'; x0: number; y0: number; x1: number; y1: number; r0: number; r1?: number; gloss?: number }
  | { k: 'poly'; pts: number[] }
  | { k: 'curve'; pts: number[]; wobble?: number; spiky?: number; seed?: number; sub?: number; gloss?: number }
  /** A bending tube along a spine polyline (a tentacle, a tail, a neck, a trunk), r0 at the start tapering to r1. */
  | { k: 'tube'; pts: number[]; r0: number; r1: number; wobble?: number; seed?: number; gloss?: number };

/** A soft dark capsule where one form meets another (neck, armpit, hip), drawn inside the mass. */
export interface Crease { x0: number; y0: number; x1: number; y1: number; r: number; a?: number }

export interface BlobOpts extends GlossOpts {
  /** Per-part soft volume shading (default on). */
  form?: boolean;
  /** Strength of the per-part volume, 0..1 (default 0.35). Raise it only on a part that must read
   * as a distinct rounded form (a shoulder, a gut); the union's own gradient does most of the work. */
  formK?: number;
  creases?: Crease[];
  /** Stroke the union's outline (default on; off for a mass that sits inside another). */
  outline?: boolean;
}

function signedArea(pts: readonly number[]): number {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i += 2) { const j = (i + 2) % n; a += pts[i] * pts[j + 1] - pts[j] * pts[i + 1]; }
  return a;
}
/** Clockwise on screen (positive area), the orientation the arc-based parts use, so nonzero filling unions them. */
function clockwise(pts: readonly number[]): number[] {
  if (signedArea(pts) >= 0) return pts.slice();
  const out: number[] = [];
  for (let i = pts.length - 2; i >= 0; i -= 2) out.push(pts[i], pts[i + 1]);
  return out;
}

/**
 * Densify a closed polygon and push every point along its outward normal by stable noise, so the
 * contour lumps; with `spiky`, every other new point becomes a tuft tip (fur, torn cloth, drips).
 */
export function lumpy(pts: readonly number[], wobble = 0.08, seed = 0, sub = 3, spiky = 0): number[] {
  const p = clockwise(pts), n = p.length / 2, out: number[] = [];
  let ext = 0; for (let i = 0; i < n; i++) ext = Math.max(ext, Math.hypot(p[i * 2] - p[0], p[i * 2 + 1] - p[1]));
  const scale = ext * 0.5;
  for (let i = 0; i < n; i++) {
    const ax = p[i * 2], ay = p[i * 2 + 1], bx = p[((i + 1) % n) * 2], by = p[((i + 1) % n) * 2 + 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = dy / len, ny = -dx / len;
    for (let s = 0; s < sub; s++) {
      const t = s / sub, idx = i * sub + s;
      let d = (rnd(seed, idx, 1) - 0.5) * 2 * wobble * scale;
      if (spiky && idx % 2 === 1) d += spiky * scale * (0.6 + rnd(seed, idx, 2) * 0.8);
      out.push(ax + dx * t + nx * d, ay + dy * t + ny * d);
    }
  }
  return out;
}

/** Append a closed Catmull-Rom spline through pts to the current path (no beginPath). */
export function appendCurve(ctx: CanvasRenderingContext2D, pts: readonly number[], tension = 1): void {
  const n = pts.length / 2;
  if (n < 3) return;
  const P = (i: number, c: 0 | 1) => pts[((i + n) % n) * 2 + c];
  ctx.moveTo(P(0, 0), P(0, 1));
  for (let i = 0; i < n; i++) {
    const c1x = P(i, 0) + (P(i + 1, 0) - P(i - 1, 0)) / 6 * tension, c1y = P(i, 1) + (P(i + 1, 1) - P(i - 1, 1)) / 6 * tension;
    const c2x = P(i + 1, 0) - (P(i + 2, 0) - P(i, 0)) / 6 * tension, c2y = P(i + 1, 1) - (P(i + 2, 1) - P(i, 1)) / 6 * tension;
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, P(i + 1, 0), P(i + 1, 1));
  }
  ctx.closePath();
}

/** The closed outline of a tube: a smooth spine through pts, offset both ways by a tapering radius, round ends. */
export function tubeOutline(pts: readonly number[], r0: number, r1: number, wobble = 0, seed = 0): number[] {
  const n = pts.length / 2;
  if (n < 2) return [];
  const P = (i: number, c: 0 | 1) => pts[Math.max(0, Math.min(n - 1, i)) * 2 + c];
  const spine: number[] = [];
  const S = 5;
  for (let i = 0; i < n - 1; i++) for (let s = 0; s < S; s++) {
    const t = s / S, t2 = t * t, t3 = t2 * t;
    for (const c of [0, 1] as const) {
      const p0 = P(i - 1, c), p1 = P(i, c), p2 = P(i + 1, c), p3 = P(i + 2, c);
      spine.push(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3));
    }
  }
  spine.push(P(n - 1, 0), P(n - 1, 1));
  const m = spine.length / 2, left: number[] = [], right: number[] = [];
  for (let i = 0; i < m; i++) {
    const ax = spine[Math.max(0, i - 1) * 2], ay = spine[Math.max(0, i - 1) * 2 + 1], bx = spine[Math.min(m - 1, i + 1) * 2], by = spine[Math.min(m - 1, i + 1) * 2 + 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const u = i / (m - 1), r = (r0 + (r1 - r0) * u) * (1 + (wobble ? (rnd(seed, i, 1) - 0.5) * 2 * wobble : 0));
    left.push(spine[i * 2] + nx * r, spine[i * 2 + 1] + ny * r);
    right.push(spine[i * 2] - nx * r, spine[i * 2 + 1] - ny * r);
  }
  // The contour walks: left side start-to-end, end cap, right side end-to-start, start cap. Each cap
  // must therefore run FROM the side that just ended TO the side that starts next, sweeping around
  // the outside: from +normal to -normal at the end, from -normal to +normal at the start. Both are a
  // decreasing sweep from the arriving edge's angle; reversing either one folds the outline into a
  // bow-tie, and the nonzero fill then punches a half-disc hole out of the cap.
  const cap = (cx: number, cy: number, r: number, from: number, out: number[]) => { for (let k = 1; k < 6; k++) { const a = from - (k / 6) * Math.PI; out.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } };
  const out: number[] = [...left];
  { const ex = spine[(m - 1) * 2], ey = spine[(m - 1) * 2 + 1], tx = ex - spine[(m - 2) * 2], ty = ey - spine[(m - 2) * 2 + 1]; cap(ex, ey, r1, Math.atan2(ty, tx) + Math.PI / 2, out); }
  for (let i = m - 1; i >= 0; i--) out.push(right[i * 2], right[i * 2 + 1]);
  { const sx = spine[0], sy = spine[1], tx = spine[2] - sx, ty = spine[3] - sy; cap(sx, sy, r0, Math.atan2(ty, tx) - Math.PI / 2, out); }
  return out;
}

function appendPart(ctx: CanvasRenderingContext2D, q: Part): void {
  switch (q.k) {
    case 'ball': ctx.moveTo(q.x + q.r, q.y); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); break;
    case 'ell': { const rot = q.rot ?? 0; ctx.moveTo(q.x + Math.cos(rot) * q.rx, q.y + Math.sin(rot) * q.rx); ctx.ellipse(q.x, q.y, Math.max(0.01, q.rx), Math.max(0.01, q.ry), rot, 0, Math.PI * 2); break; }
    case 'cap': pathTaperedCapsule(ctx, q.x0, q.y0, q.x1, q.y1, q.r0, q.r1 ?? q.r0, true); break;
    case 'poly': { const p = clockwise(q.pts); ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.closePath(); break; }
    case 'curve': appendCurve(ctx, lumpy(q.pts, q.wobble ?? 0.08, q.seed ?? 0, q.sub ?? 3, q.spiky ?? 0)); break;
    case 'tube': { const p = clockwise(tubeOutline(q.pts, q.r0, q.r1, q.wobble ?? 0, q.seed ?? 0)); if (!p.length) return; ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.closePath(); break; }
  }
}

function bounds(parts: readonly Part[]): { cx: number; cy: number; r: number } {
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
  const add = (x: number, y: number, r: number) => { minx = Math.min(minx, x - r); maxx = Math.max(maxx, x + r); miny = Math.min(miny, y - r); maxy = Math.max(maxy, y + r); };
  for (const q of parts) {
    if (q.k === 'ball') add(q.x, q.y, q.r);
    else if (q.k === 'ell') add(q.x, q.y, Math.max(q.rx, q.ry));
    else if (q.k === 'cap') { add(q.x0, q.y0, q.r0); add(q.x1, q.y1, q.r1 ?? q.r0); }
    else if (q.k === 'tube') { const r = Math.max(q.r0, q.r1); for (let i = 0; i < q.pts.length; i += 2) add(q.pts[i], q.pts[i + 1], r); }
    else for (let i = 0; i < q.pts.length; i += 2) add(q.pts[i], q.pts[i + 1], 0);
  }
  return { cx: (minx + maxx) / 2, cy: (miny + maxy) / 2, r: Math.hypot(maxx - minx, maxy - miny) / 2 };
}

/** Soft translucent volume on one part: lit side pale, far side deep, transparent between. */
function formPart(ctx: CanvasRenderingContext2D, B: Brush, hex: string, q: Part, k: number): void {
  const t = tones(B, hex);
  const lx = B.light.x, ly = B.light.y;
  let g: CanvasGradient;
  if (q.k === 'cap' || q.k === 'tube') {
    // A limb is a cylinder: the ramp runs ACROSS it, from the lit side to the far side.
    const x0 = q.k === 'cap' ? q.x0 : q.pts[0], y0 = q.k === 'cap' ? q.y0 : q.pts[1];
    const x1 = q.k === 'cap' ? q.x1 : q.pts[q.pts.length - 2], y1 = q.k === 'cap' ? q.y1 : q.pts[q.pts.length - 1];
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, r = q.k === 'cap' ? Math.max(q.r0, q.r1 ?? q.r0) : Math.max(q.r0, q.r1);
    let nx = -dy / len, ny = dx / len;
    if (nx * lx + ny * ly < 0) { nx = -nx; ny = -ny; }
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    g = ctx.createLinearGradient(mx + nx * r, my + ny * r, mx - nx * r, my - ny * r);
  } else {
    // Everything else: along the light, for the same reason fillForm is. A radial ramp here put a
    // dark ring right around each part, so a body read as a bag of separate spheres.
    const b = q.k === 'ball' ? { cx: q.x, cy: q.y, r: q.r } : q.k === 'ell' ? { cx: q.x, cy: q.y, r: Math.max(q.rx, q.ry) } : bounds([q]);
    g = ctx.createLinearGradient(b.cx + lx * b.r, b.cy + ly * b.r, b.cx - lx * b.r, b.cy - ly * b.r);
  }
  // Gentle, and stopping at the shadow tone rather than the deep one: the far edge of a part is
  // usually INTERIOR to the mass, so anything strong here reads as that part's outline.
  g.addColorStop(0, rgba(t.hi, 0.34 * k));
  g.addColorStop(0.46, rgba(t.base, 0));
  g.addColorStop(1, rgba(t.sh, 0.34 * k));
  ctx.beginPath(); appendPart(ctx, q);
  ctx.fillStyle = g; ctx.fill();
}

/** One material, many parts, one mass. See the note above. */
export function blob(ctx: CanvasRenderingContext2D, B: Brush, hex: string, parts: readonly Part[], o: BlobOpts = {}): void {
  if (!parts.length) return;
  ctx.beginPath();
  for (const q of parts) appendPart(ctx, q);
  if (o.outline !== false) outlinePath(ctx, B);
  if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }
  const b = bounds(parts);
  fillForm(ctx, B, hex, b.cx, b.cy, b.r, o.spread ?? 1);
  ctx.save(); ctx.clip();
  if (o.form !== false) for (const q of parts) formPart(ctx, B, hex, q, o.formK ?? 0.35);
  const t = tones(B, hex);
  if (o.creases) for (const c of o.creases) { pathCap(ctx, c.x0, c.y0, c.x1, c.y1, c.r); ctx.fillStyle = rgba(t.deep, c.a ?? 0.35); ctx.fill(); }
  if (o.tex && (o.h ?? 0) >= TEX_MIN_H && b.r >= 5) texture(ctx, B, hex, o.tex, b.cx, b.cy, b.r, o.seed ?? 0, o.amount ?? 1);
  for (const q of parts) {
    if (q.k === 'poly' || !q.gloss) continue;
    const c = q.k === 'ball' ? { x: q.x, y: q.y, r: q.r } : q.k === 'ell' ? { x: q.x, y: q.y, r: Math.min(q.rx, q.ry) } : q.k === 'cap' ? { x: (q.x0 + q.x1) / 2, y: (q.y0 + q.y1) / 2, r: Math.max(q.r0, q.r1 ?? q.r0) } : q.k === 'tube' ? { x: q.pts[q.pts.length - 2], y: q.pts[q.pts.length - 1], r: q.r1 * 1.5 } : (() => { const bb = bounds([q]); return { x: bb.cx, y: bb.cy, r: bb.r * 0.7 }; })();
    specular(ctx, B, c.x, c.y, c.r, q.gloss);
  }
  if (o.gloss) specular(ctx, B, b.cx, b.cy, b.r * 0.8, o.gloss);
  ctx.restore();
}

/** Options for `patch`. */
export interface PatchOpts {
  /** Peak opacity, 0..1 (default 0.72): under 1 the form beneath still reads through the marking. */
  alpha?: number;
  /** How much of the radius the edge fades over, 0..1 (default 0.45). 0 gives a hard-edged marking. */
  feather?: number;
}

/**
 * A MARKING on a surface: a pale muzzle, a belly, a blaze, a saddle, a war-paint stripe. Filled
 * with a soft fall-off at its edge and a little of the form showing through, because a marking is
 * a change of colour in one surface, not a separate object: give it a hard edge and full opacity
 * and it reads as a sticker laid on the creature. Only a different MATERIAL gets an outline and a
 * blob of its own. Skipped during the hit flash, which is already a flat silhouette.
 */
export function patch(ctx: CanvasRenderingContext2D, B: Brush, hex: string, parts: readonly Part[], o: PatchOpts = {}): void {
  if (!parts.length || B.override) return;
  const b = bounds(parts), a = o.alpha ?? 0.72, feather = Math.max(0, Math.min(1, o.feather ?? 0.45));
  ctx.beginPath();
  for (const q of parts) appendPart(ctx, q);
  if (feather <= 0.01) { ctx.fillStyle = rgba(hex, a); ctx.fill(); return; }
  const g = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, Math.max(0.5, b.r));
  g.addColorStop(0, rgba(hex, a));
  g.addColorStop(Math.max(0.02, 1 - feather), rgba(hex, a));
  g.addColorStop(1, rgba(hex, 0));
  ctx.fillStyle = g; ctx.fill();
}

/** A soft interior line (a mouth, a brow, a fold): translucent deep tone, round caps, no ink. */
export function softLine(ctx: CanvasRenderingContext2D, B: Brush, pts: readonly number[], hex: string, w = 1.5, a = 0.6): void {
  ctx.strokeStyle = B.override ?? rgba(tones(B, hex).deep, a); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}
