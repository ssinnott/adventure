// The Rift family: riftling, riftling elder, Rift Warden and Warden of the Cut. Things of crystal
// shard and ember: a molten core wrapped in faceted stone. Each body is one blob of overlapping
// angular shards (poly and low-wobble curve parts, a facets texture, a high gloss), so the silhouette
// is jagged and irregular but the mass is painted as a whole; the core is a dark gap in the stone
// with a glow behind it and a hot lump inside; seams between the shards are soft hot lines that
// pulse with the frame; eyes are hot points.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glow, glossPoly, softLine } from './gloss.ts';
import type { Part, Crease } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import { tones } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['riftling', 'riftling_elder', 'warden', 'cut_warden'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'warden' || kind === 'cut_warden') sentinel(ctx, x, y, h, p, kind === 'cut_warden');
  else creature(ctx, x, y, h, p, kind === 'riftling_elder');
};

/** The hot colours of one Rift thing: the emissive glow, the molten lump, its white heart. */
interface Heat { glow: string; ember: string; heart: string; seam: string }
function heatOf(p: Paint, cold: boolean): Heat {
  const t = Math.max(0.6, p.tone);
  if (cold) return { glow: '#8ec8ff', ember: shade(mix(p.light, '#cfe8ff', 0.75), t), heart: '#f4fbff', seam: '#dff2ff' };
  return { glow: '#ff8a30', ember: shade(mix(p.light, '#ffb040', 0.65), t), heart: '#fff4c8', seam: '#ffb050' };
}

/** A lumpy ring of n points around (cx, cy), radius r stretched by kx, ky; the angular variant for crystal. */
function ring(cx: number, cy: number, r: number, n: number, kx = 1, ky = 1, phase = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = phase + (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * r * kx, cy + Math.sin(a) * r * ky); }
  return o;
}

/**
 * A glowing seam between two shards: a wide faint halo under a thin hot line. Local helper: softLine
 * paints a shape's deep tone, and a seam has to be hotter than the stone around it. Nothing is drawn
 * while the brush flashes (the seam lies inside the body, which is already flat white).
 */
function seam(ctx: CanvasRenderingContext2D, pts: readonly number[], hot: string, w: number, a: number): void {
  if (B.override || a <= 0.02) return;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const trace = () => { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.stroke(); };
  ctx.strokeStyle = B.col(rgba(hot, a * 0.22)); ctx.lineWidth = w * 2.2; trace();
  ctx.strokeStyle = B.col(rgba(hot, a)); ctx.lineWidth = w; trace();
}

/**
 * A hard glint on one lit crystal face: a small white spot, sized by hand so it never grows with the
 * mass the way a blob's specular does. Skipped while the brush flashes (the face is already white).
 */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number, rot = -Math.PI / 4): void {
  if (B.override || r < 1.2) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba('#ffffff', a)); g.addColorStop(0.45, rgba('#ffffff', a * 0.55)); g.addColorStop(1, rgba('#ffffff', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.45, rot, 0, Math.PI * 2); ctx.fill();
}

/**
 * A shard: a tapered quad with real thickness, base at (x, y), pointing along `a` for `len`, half
 * width `w` at the base and a blunt tip. Crest spines and claws are shards, never hairlines.
 */
function shard(x: number, y: number, a: number, len: number, w: number, tipK = 0.3): number[] {
  const c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c, tx = x + c * len, ty = y + s * len;
  return [x + nx * w, y + ny * w, tx + nx * w * tipK, ty + ny * w * tipK, tx - nx * w * tipK, ty - ny * w * tipK, x - nx * w, y - ny * w];
}

/** A flat fill in a hand-picked tone, through B.col so the hit flash still paints white. */
function fillPoly(ctx: CanvasRenderingContext2D, pts: readonly number[], hex: string): void {
  ctx.fillStyle = B.col(hex);
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath(); ctx.fill();
}

/**
 * The shadow a plate casts on the mass under it: the plate's own outline pushed away from the light,
 * so once the plate is painted over it only a dark lip shows along the far edge. Skipped on the flash
 * frame, where the silhouette must stay a flat white.
 */
function underShadow(ctx: CanvasRenderingContext2D, pts: readonly number[], hex: string, d: number, a = 0.45): void {
  if (B.override) return;
  const o: number[] = [];
  for (let i = 0; i < pts.length; i += 2) o.push(pts[i] + d, pts[i + 1] + d);
  fillPoly(ctx, o, rgba(tones(B, hex).deep, a));
}

/** The molten core: a dark ragged gap in the stone, a glow behind it, a hot lump inside with a white heart. */
function core(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, dark: string, heat: Heat, pulse: number, seed: number, h: number): void {
  blob(ctx, B, dark, [{ k: 'curve', pts: ring(cx, cy, r * 1.35, 7, 1, 1.1, 0.4), wobble: 0.12, seed, sub: 2 }], { h, outline: false, formK: 0.2, spread: 0.5 });
  glow(ctx, B, cx, cy, r * (2.6 + pulse * 0.6), heat.glow, 0.5 + pulse * 0.3, heat.heart);
  blob(ctx, B, heat.ember, [{ k: 'curve', pts: ring(cx, cy, r, 6, 1, 1.15, 0.9), wobble: 0.1, seed: seed + 1, sub: 2, gloss: 1 }], { h, outline: false, formK: 0.4, gloss: 0.6 });
  if (!B.override) { ctx.fillStyle = rgba(heat.heart, 0.55 + pulse * 0.4); ctx.beginPath(); ctx.arc(cx - r * 0.1, cy - r * 0.1, r * 0.45, 0, Math.PI * 2); ctx.fill(); }
}

/** A hot eye: a glow and a point. */
function hotEye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, heat: Heat, pulse: number): void {
  glow(ctx, B, x, y, r * 3, heat.glow, 0.35 + pulse * 0.25, heat.heart);
  eye(ctx, x, y, r, heat.heart, false);
}

/** A shard fragment: a small glossy sliver of stone. */
function fragment(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, a: number, hex: string, heat: Heat, h: number): void {
  const c = Math.cos(a), sn = Math.sin(a);
  const P = (u: number, v: number) => [x + u * c - v * sn, y + u * sn + v * c];
  glow(ctx, B, x, y, s * 2.2, heat.glow, 0.25, heat.heart);
  glossPoly(ctx, B, [...P(-s, 0), ...P(-s * 0.2, -s * 0.45), ...P(s * 1.1, -s * 0.1), ...P(s * 0.2, s * 0.5)], hex, { gloss: 0.9, h });
}

// ------------------------------------------------------------------ riftling ----
/**
 * The riftling and its elder: a hunched thing of shards, three-quarter to the right, arms held
 * forward and ready. The head is a blunt crystal skull -- taller than it is long, a heavy brow
 * shelf over two hot eyes, a short square jaw hanging open on shard teeth, thick shards swept up
 * and back off the crown. No forward point anywhere: a beak would make it a bird.
 */
function creature(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, elder: boolean): void {
  const heat = heatOf(p, false), pulse = 0.5 + 0.5 * Math.sin(p.frame / 6);
  const b = p.breathe * h * 0.008, sway = Math.sin(p.frame / 20) * h * 0.006;
  // W widens the frame, T thickens the limbs: the elder is the same creature grown heavy.
  const W = elder ? 1.16 : 0.94, T = elder ? 1.24 : 1;
  groundShadow(ctx, x + h * 0.02, y + 1, h * 0.76 * W);

  // Head frame: locals in head units so the whole skull scales as one.
  const hs = h * (elder ? 0.99 : 0.87);
  const hx = x + h * 0.12 + sway, hy = y - h * (elder ? 0.785 : 0.79) + b;
  const HD = (u: number, v: number): number[] => [hx + u * hs, hy + v * hs];

  // ---- the far side: leg and arm, their own darker mass, behind everything.
  const fex = x - h * 0.20 * W, fey = y - h * 0.575 + sway, fwx = x - h * 0.13 * W, fwy = y - h * 0.425 + sway;
  blob(ctx, B, p.dark, [
    { k: 'tube', pts: [x - h * 0.1, y - h * 0.44, x - h * 0.02, y - h * 0.31, x - h * 0.15, y - h * 0.16, x - h * 0.06, y - h * 0.03], r0: h * 0.062 * W, r1: h * 0.036, wobble: 0.1, seed: 11 },
    { k: 'poly', pts: [x - h * 0.19, y - h * 0.015, x - h * 0.06, y - h * 0.07, x + h * 0.04, y - h * 0.01, x - h * 0.14, y + h * 0.01] },
    { k: 'cap', x0: x - h * 0.02, y0: y - h * 0.715 + b, x1: fex, y1: fey, r0: h * 0.056 * T, r1: h * 0.046 * T },
    { k: 'cap', x0: fex, y0: fey, x1: fwx, y1: fwy, r0: h * 0.046 * T, r1: h * 0.036 * T },
    { k: 'poly', pts: shard(fwx - h * 0.01, fwy, 1.15, h * 0.09 * T, h * 0.028 * T) },
  ], { h, formK: 0.45, tex: 'facets', seed: 21, amount: 0.5 });

  // ---- the near arm: a real upper arm and forearm, an elbow shard, a hand of thick shard claws.
  const ax = x + h * 0.175 * W, ay = y - h * 0.695 + b;
  const ex = x + h * 0.315 * W, ey = y - h * 0.545 - sway;
  const wx = x + h * 0.405 * W, wy = y - h * 0.63 - sway;
  const fwd = Math.atan2(wy - ey, wx - ex);

  // ---- the stone: pelvis, torso, neck, skull, jaw, crown shards, near leg and near arm, one mass.
  const stone: Part[] = [
    { k: 'curve', pts: ring(x + h * 0.01, y - h * 0.45, h * 0.135 * W, 8, 1.1, 0.92, 0.3), wobble: 0.07, seed: 2, sub: 2 },
    { k: 'poly', pts: [x - h * 0.185 * W, y - h * 0.49, x - h * 0.225 * W, y - h * 0.665 + b, x - h * 0.115 * W, y - h * 0.775 + b, x + h * 0.06, y - h * 0.79 + b, x + h * 0.205 * W, y - h * 0.735 + b, x + h * 0.245 * W, y - h * 0.565, x + h * 0.1, y - h * 0.455, x - h * 0.06, y - h * 0.45] },
    { k: 'cap', x0: x + h * 0.07, y0: y - h * 0.735 + b, x1: hx - hs * 0.03, y1: hy + hs * 0.07, r0: h * 0.055 * T, r1: h * 0.05 * T },
    // The skull: blunt, angular, taller than it is long, the brow and cheek stepping back to the jaw.
    { k: 'poly', pts: [...HD(-0.075, -0.115), ...HD(-0.010, -0.152), ...HD(0.060, -0.116), ...HD(0.084, -0.056), ...HD(0.064, -0.020), ...HD(0.080, 0.026), ...HD(0.034, 0.048), ...HD(-0.052, 0.044), ...HD(-0.086, -0.016)] },
    // The jaw: short and square, hinged at the back, hanging open at the front.
    { k: 'poly', pts: [...HD(-0.048, 0.032), ...HD(0.070, 0.058), ...HD(0.074, 0.112), ...HD(-0.008, 0.116), ...HD(-0.050, 0.078)] },
    { k: 'tube', pts: [x + h * 0.11, y - h * 0.45, x + h * 0.215, y - h * 0.3, x + h * 0.075, y - h * 0.15, x + h * 0.195, y - h * 0.03], r0: h * 0.07 * W, r1: h * 0.04 * T, wobble: 0.1, seed: 13 },
    { k: 'poly', pts: [x + h * 0.06, y - h * 0.015, x + h * 0.18, y - h * 0.075, x + h * 0.3, y - h * 0.01, x + h * 0.1, y + h * 0.01] },
    { k: 'cap', x0: ax, y0: ay, x1: ex, y1: ey, r0: h * 0.064 * T, r1: h * 0.05 * T },
    { k: 'cap', x0: ex, y0: ey, x1: wx, y1: wy, r0: h * 0.052 * T, r1: h * 0.041 * T },
    { k: 'poly', pts: shard(ex + h * 0.012, ey + h * 0.012, 1.0, h * 0.095 * T, h * 0.032 * T) },
  ];
  // Crown shards: short, thick, swept up and back; the elder wears one more and they are longer.
  const crown: [number, number, number, number][] = elder
    ? [[0.062, -0.082, -1.62, 0.105], [0.026, -0.124, -1.92, 0.128], [-0.024, -0.152, -2.22, 0.112], [-0.070, -0.110, -2.52, 0.086]]
    : [[0.030, -0.120, -1.80, 0.082], [-0.020, -0.150, -2.10, 0.100], [-0.068, -0.108, -2.45, 0.078]];
  for (const [u, v, a, len] of crown) {
    const base = HD(u, v);
    stone.push({ k: 'poly', pts: shard(base[0], base[1], a, hs * len, hs * 0.030) });
  }
  // The hand: three thick shard claws off the wrist, spread and reaching forward.
  for (const [da, len] of [[-0.62, 0.098], [-0.16, 0.115], [0.34, 0.09]] as const) {
    stone.push({ k: 'poly', pts: shard(wx - Math.cos(fwd) * h * 0.012, wy - Math.sin(fwd) * h * 0.012, fwd + da, h * len * T, h * 0.027 * T) });
  }
  const creases: Crease[] = [
    { x0: x + h * 0.05, y0: y - h * 0.755 + b, x1: hx - hs * 0.05, y1: hy + hs * 0.09, r: h * 0.026, a: 0.4 },
    { x0: x - h * 0.1, y0: y - h * 0.475, x1: x + h * 0.15, y1: y - h * 0.47, r: h * 0.03, a: 0.3 },
    { x0: ax + h * 0.01, y0: ay + h * 0.02, x1: ex, y1: ey, r: h * 0.022, a: 0.28 },
    { x0: ex, y0: ey, x1: wx, y1: wy, r: h * 0.018, a: 0.24 },
  ];
  blob(ctx, B, p.base, stone, { h, tex: 'facets', seed: 4, amount: 0.9, formK: 0.55, spread: 0.8, creases });

  // ---- the core, burning in the gap between the torso and the chest plate that goes on next.
  const cr = h * (elder ? 0.082 : 0.063), ccx = x + h * 0.015, ccy = y - h * 0.685 + b * 0.5;
  core(ctx, ccx, ccy, cr, p.dark, heat, pulse, 30, h);

  // ---- the plates: angular shards of a paler stone lying ON the mass, each with its own edge and
  // a shadow cast under it, so the torso is a stack of overlapping slabs and not a painted card.
  const plate = mix(p.base, p.light, elder ? 0.55 : 0.42);
  const chest = [x - h * 0.115 * W, y - h * 0.475, x - h * 0.145 * W, y - h * 0.6, x - h * 0.03, y - h * 0.655 + b, x + h * 0.15 * W, y - h * 0.615 + b, x + h * 0.185 * W, y - h * 0.5, x + h * 0.045, y - h * 0.44];
  const pauldron = [x + h * 0.07, y - h * 0.765 + b, x + h * 0.235 * W, y - h * 0.725 + b, x + h * 0.27 * W, y - h * 0.6 + b, x + h * 0.135, y - h * 0.635 + b];
  const brow = [...HD(-0.090, -0.064), ...HD(0.092, -0.052), ...HD(0.080, 0.000), ...HD(-0.074, -0.014)];
  const slabs: Part[] = [{ k: 'poly', pts: chest }, { k: 'poly', pts: pauldron }, { k: 'poly', pts: brow }];
  if (elder) slabs.push(
    { k: 'poly', pts: [x - h * 0.235 * W, y - h * 0.66 + b, x - h * 0.185, y - h * 0.775 + b, x - h * 0.05, y - h * 0.79 + b, x - h * 0.075, y - h * 0.67 + b] },
    { k: 'poly', pts: [x + h * 0.245 * W, y - h * 0.575, x + h * 0.295 * W, y - h * 0.47, x + h * 0.19, y - h * 0.44, x + h * 0.175, y - h * 0.53] },
  );
  for (const q of slabs) underShadow(ctx, (q as { pts: number[] }).pts, p.dark, h * 0.014);
  blob(ctx, B, plate, slabs, { h, tex: 'facets', seed: 17, amount: 0.7, formK: 0.5, spread: 0.7 });

  // The core's light spilling out over the lip of the chest plate and the gaps beside it.
  glow(ctx, B, ccx - h * 0.02, ccy + cr * 0.9, cr * 1.9, heat.glow, 0.35 + pulse * 0.25, heat.heart);
  glow(ctx, B, ccx + h * 0.115 * W, ccy + h * 0.05, cr * 1.2, heat.glow, 0.22 + pulse * 0.15, heat.heart);

  glint(ctx, x - h * 0.13 * W, y - h * 0.69 + b, h * 0.05, 0.55, -0.9);
  glint(ctx, x - h * 0.05, y - h * 0.6, h * 0.04, 0.45, -0.5);
  glint(ctx, ...(HD(-0.045, -0.052) as [number, number]), h * 0.035, 0.5, -0.6);
  glint(ctx, x + h * 0.14, y - h * 0.3, h * 0.03, 0.4, 1.1);

  // ---- seams: hot lines along the plate lips and the shard joins, pulsing with the core.
  const sa = (elder ? 0.6 : 0.45) + pulse * 0.35, sw = Math.max(1, h * (elder ? 0.019 : 0.014));
  seam(ctx, [x - h * 0.14 * W, y - h * 0.595, x - h * 0.03, y - h * 0.652 + b, x + h * 0.15 * W, y - h * 0.612 + b], heat.seam, sw, sa);
  seam(ctx, [x - h * 0.185 * W, y - h * 0.5, x - h * 0.115, y - h * 0.635 + b, x - h * 0.03, y - h * 0.72 + b], heat.seam, sw, sa * 0.7);
  seam(ctx, [x + h * 0.09, y - h * 0.755 + b, x + h * 0.23 * W, y - h * 0.72 + b], heat.seam, sw, sa * 0.6);
  seam(ctx, [ax + h * 0.02, ay + h * 0.03, ex - h * 0.01, ey - h * 0.01], heat.seam, sw * 0.8, sa * 0.5);

  // ---- the face: the mouth gaping under the brow, shard teeth, then the two hot eyes.
  const gum = tones(B, p.dark).deep;
  fillPoly(ctx, [...HD(-0.020, 0.044), ...HD(0.078, 0.024), ...HD(0.074, 0.062), ...HD(-0.014, 0.064)], gum);
  ctx.fillStyle = B.col(mix(heat.heart, '#ffffff', 0.4));
  for (const [u, d] of [[0.060, 1], [0.028, 1], [-0.002, 1], [0.048, -1], [0.014, -1]] as const) {
    const t0 = HD(u, d > 0 ? 0.034 : 0.062), t1 = HD(u + d * 0.012, d > 0 ? 0.062 : 0.034), t2 = HD(u + d * 0.024, d > 0 ? 0.036 : 0.06);
    ctx.beginPath(); ctx.moveTo(t0[0], t0[1]); ctx.lineTo(t1[0], t1[1]); ctx.lineTo(t2[0], t2[1]); ctx.closePath(); ctx.fill();
  }
  const er = hs * (elder ? 0.026 : 0.024);
  hotEye(ctx, ...(HD(0.014, 0.008) as [number, number]), er * 0.85, heat, pulse);
  hotEye(ctx, ...(HD(0.058, 0.012) as [number, number]), er, heat, pulse);
  softLine(ctx, B, [...HD(-0.070, -0.010), ...HD(0.078, 0.002)], p.base, hs * 0.018, 0.5);
}

// ------------------------------------------------------------------ warden ----
/** The Rift Warden and the Warden of the Cut: a standing stone split open to a furnace, with orbiting shards. */
function sentinel(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, cut: boolean): void {
  const heat = heatOf(p, cut), pulse = 0.5 + 0.5 * Math.sin(p.frame / 7);
  const b = p.breathe * h * 0.006;
  const cx = x, cy = y - h * 0.55 + b;
  groundShadow(ctx, x, y + 1, h * 0.8);
  // The halo behind, and the fragments on their far pass.
  glow(ctx, B, cx, cy, h * 0.64, heat.glow, 0.2 + pulse * 0.08, heat.glow);
  const nFrag = cut ? 5 : 3;
  const frag = (i: number) => {
    const a = p.frame / 45 + (i / nFrag) * Math.PI * 2 + i * 0.7;
    const fx = cx + Math.cos(a) * h * (0.5 + (i % 2) * 0.1), fy = cy + Math.sin(a) * h * 0.2 - h * (0.1 - (i % 3) * 0.08), front = Math.sin(a) > 0;
    return { fx, fy, front, s: h * (0.03 + (i % 2) * 0.012), rot: a * 1.5 };
  };
  const frags = Array.from({ length: nFrag }, (_, i) => frag(i));
  for (const f of frags) if (!f.front) fragment(ctx, f.fx, f.fy, f.s, f.rot, p.light, heat, h);

  // Stubby legs: darker stone behind the body.
  blob(ctx, B, p.dark, [
    { k: 'curve', pts: [x - h * 0.32, y - h * 0.01, x - h * 0.36, y - h * 0.16, x - h * 0.3, y - h * 0.28, x - h * 0.12, y - h * 0.24, x - h * 0.08, y - h * 0.1, x - h * 0.13, y - h * 0.01], wobble: 0.09, seed: 42, sub: 2 },
    { k: 'curve', pts: [x + h * 0.1, y - h * 0.01, x + h * 0.08, y - h * 0.14, x + h * 0.14, y - h * 0.26, x + h * 0.32, y - h * 0.27, x + h * 0.34, y - h * 0.12, x + h * 0.3, y - h * 0.01], wobble: 0.09, seed: 43, sub: 2 },
    { k: 'poly', pts: [x - h * 0.4, y - h * 0.01, x - h * 0.3, y - h * 0.09, x - h * 0.06, y - h * 0.02, x - h * 0.3, y + h * 0.01] },
    { k: 'poly', pts: [x + h * 0.06, y - h * 0.02, x + h * 0.3, y - h * 0.09, x + h * 0.4, y - h * 0.01, x + h * 0.14, y + h * 0.01] },
  ], { h, formK: 0.4, tex: 'facets', seed: 41, amount: 0.5 });

  // The body: a great faceted stone, jagged with protruding shards, a crown, thick shard arms.
  const stone: Part[] = [
    { k: 'curve', pts: ring(cx, cy, h * 0.3, 8, 1, 1.25, 0.15), wobble: 0.05, seed: 5, sub: 2 },
    { k: 'poly', pts: [x - h * 0.22, y - h * 0.62, x - h * 0.44, y - h * 0.86, x - h * 0.12, y - h * 0.9] },
    { k: 'poly', pts: [x + h * 0.12, y - h * 0.88, x + h * 0.42, y - h * 0.8, x + h * 0.24, y - h * 0.6] },
    { k: 'poly', pts: [x - h * 0.2, y - h * 0.4, x - h * 0.42, y - h * 0.32, x - h * 0.24, y - h * 0.24] },
    { k: 'poly', pts: [x + h * 0.18, y - h * 0.3, x + h * 0.4, y - h * 0.24, x + h * 0.3, y - h * 0.44] },
    { k: 'tube', pts: [x - h * 0.3, y - h * 0.74 + b, x - h * 0.52, y - h * 0.5 + b, x - h * 0.48, y - h * 0.3], r0: h * 0.095, r1: h * 0.07, wobble: 0.1, seed: 15 },
    { k: 'tube', pts: [x + h * 0.3, y - h * 0.72 + b, x + h * 0.54, y - h * 0.56 + b, x + h * 0.52, y - h * 0.34], r0: h * 0.095, r1: h * 0.07, wobble: 0.1, seed: 16 },
  ];
  // Fists: blunt shard knuckles; the Warden of the Cut has lost its left hand at the wrist.
  stone.push({ k: 'poly', pts: [x + h * 0.44, y - h * 0.36, x + h * 0.6, y - h * 0.38, x + h * 0.62, y - h * 0.22, x + h * 0.5, y - h * 0.17, x + h * 0.42, y - h * 0.26] });
  if (!cut) stone.push({ k: 'poly', pts: [x - h * 0.56, y - h * 0.34, x - h * 0.4, y - h * 0.34, x - h * 0.37, y - h * 0.2, x - h * 0.5, y - h * 0.15, x - h * 0.58, y - h * 0.24] });
  // The crown: five or seven spikes of uneven length, the tallest just right of centre.
  const spikes = cut ? 7 : 5, tall = cut ? 0.36 : 0.26;
  for (let i = 0; i < spikes; i++) {
    const u = (i - (spikes - 1) / 2) / spikes, bx = cx + u * h * 0.62, len = h * tall * (1 - Math.abs(u - 0.06) * 1.6) + h * 0.08;
    const top = y - h * 0.86 + Math.abs(u) * h * 0.1;
    stone.push({ k: 'poly', pts: [bx - h * 0.045, top + h * 0.06, bx + u * h * 0.14, top - len, bx + h * 0.04, top + h * 0.05] });
  }
  const creases: Crease[] = [
    { x0: x - h * 0.3, y0: y - h * 0.72 + b, x1: x - h * 0.22, y1: y - h * 0.62 + b, r: h * 0.03, a: 0.35 },
    { x0: x + h * 0.24, y0: y - h * 0.7 + b, x1: x + h * 0.32, y1: y - h * 0.62 + b, r: h * 0.03, a: 0.35 },
    { x0: x - h * 0.24, y0: y - h * 0.26, x1: x + h * 0.24, y1: y - h * 0.26, r: h * 0.035, a: 0.3 },
  ];
  blob(ctx, B, p.base, stone, { h, tex: 'facets', seed: 6, amount: 1.2, formK: 0.45, spread: 0.7, creases });
  glint(ctx, x - h * 0.3, y - h * 0.8 + b, h * 0.07, 0.55, -0.7);
  glint(ctx, x - h * 0.02, y - h * 0.86 + b, h * 0.05, 0.45, -0.2);
  glint(ctx, x + h * 0.36, y - h * 0.66 + b, h * 0.04, 0.4, -0.9);
  glint(ctx, x - h * 0.34, y - h * 0.34, h * 0.04, 0.4, -0.4);
  glint(ctx, x + h * 0.48, y - h * 0.34, h * 0.035, 0.45, -0.6);

  if (cut) {
    // The Cut: a great crack from the left shoulder to the right hip, glowing white-blue, the core where it gapes.
    const path = [x - h * 0.32, y - h * 0.82, x - h * 0.24, y - h * 0.7, x - h * 0.16, y - h * 0.68, x - h * 0.06, y - h * 0.6, x + h * 0.04, y - h * 0.5, x + h * 0.06, y - h * 0.42, x + h * 0.13, y - h * 0.36, x + h * 0.16, y - h * 0.28, x + h * 0.26, y - h * 0.22];
    // A shadow edge below and right of the light, so the crack has depth; two hot spots where it gapes.
    softLine(ctx, B, path.map((v, i) => v + (i % 2 ? h * 0.014 : h * 0.01)), p.base, h * 0.03, 0.9);
    glow(ctx, B, x - h * 0.2, y - h * 0.69, h * 0.09, heat.glow, 0.4 + pulse * 0.2, heat.heart);
    glow(ctx, B, x + h * 0.14, y - h * 0.34, h * 0.08, heat.glow, 0.35 + pulse * 0.2, heat.heart);
    seam(ctx, path, heat.seam, Math.max(1, h * 0.016), 0.8 + pulse * 0.2);
    core(ctx, x - h * 0.01, y - h * 0.55 + b, h * 0.085, p.dark, heat, pulse, 31, h);
    // Lesser cracks branching off, and the stump of the lost hand, hot at the break.
    seam(ctx, [x - h * 0.14, y - h * 0.64, x - h * 0.22, y - h * 0.5, x - h * 0.28, y - h * 0.46], heat.seam, Math.max(1, h * 0.012), 0.5 + pulse * 0.2);
    seam(ctx, [x + h * 0.07, y - h * 0.5, x + h * 0.2, y - h * 0.58, x + h * 0.28, y - h * 0.62], heat.seam, Math.max(1, h * 0.012), 0.45 + pulse * 0.2);
    seam(ctx, [x + h * 0.02, y - h * 0.72, x + h * 0.05, y - h * 0.82], heat.seam, Math.max(1, h * 0.012), 0.4 + pulse * 0.2);
    // A chunk gone from the right shoulder: the fresh fracture face is darker stone, hot along its lip.
    blob(ctx, B, p.dark, [{ k: 'curve', pts: [x + h * 0.16, y - h * 0.74 + b, x + h * 0.24, y - h * 0.84 + b, x + h * 0.36, y - h * 0.8 + b, x + h * 0.34, y - h * 0.68 + b, x + h * 0.22, y - h * 0.66 + b], wobble: 0.1, seed: 34, sub: 2 }], { h, outline: false, formK: 0.3, spread: 0.5 });
    seam(ctx, [x + h * 0.17, y - h * 0.74 + b, x + h * 0.25, y - h * 0.83 + b, x + h * 0.35, y - h * 0.8 + b], heat.seam, Math.max(1, h * 0.012), 0.5 + pulse * 0.2);
    glow(ctx, B, x - h * 0.48, y - h * 0.3, h * 0.13, heat.glow, 0.5 + pulse * 0.3, heat.heart);
    blob(ctx, B, heat.ember, [{ k: 'curve', pts: ring(x - h * 0.48, y - h * 0.3, h * 0.05, 6, 1.3, 0.8, 0.5), wobble: 0.12, seed: 33, sub: 2 }], { h, outline: false, formK: 0.4, gloss: 0.6 });
  } else {
    // Split open down the middle: a furnace core, seams running out from it across the stone.
    core(ctx, x + h * 0.01, y - h * 0.56 + b, h * 0.11, p.dark, heat, pulse, 32, h);
    const sw = Math.max(1, h * 0.016), sa = 0.55 + pulse * 0.35;
    seam(ctx, [x - h * 0.06, y - h * 0.7, x - h * 0.12, y - h * 0.8, x - h * 0.08, y - h * 0.9], heat.seam, sw, sa);
    seam(ctx, [x + h * 0.08, y - h * 0.68, x + h * 0.2, y - h * 0.74, x + h * 0.3, y - h * 0.7], heat.seam, sw, sa * 0.8);
    seam(ctx, [x - h * 0.1, y - h * 0.58, x - h * 0.24, y - h * 0.62, x - h * 0.34, y - h * 0.56], heat.seam, sw, sa * 0.7);
    seam(ctx, [x + h * 0.08, y - h * 0.44, x + h * 0.14, y - h * 0.32, x + h * 0.24, y - h * 0.26], heat.seam, sw, sa * 0.7);
    seam(ctx, [x - h * 0.06, y - h * 0.42, x - h * 0.16, y - h * 0.34], heat.seam, sw, sa * 0.5);
  }
  // Eyes, high in the stone above the core, and the fragments on their near pass.
  hotEye(ctx, x - h * 0.1, y - h * 0.8 + b, h * 0.028, heat, pulse);
  hotEye(ctx, x + h * 0.11, y - h * 0.79 + b, h * 0.028, heat, pulse);
  for (const f of frags) if (f.front) fragment(ctx, f.fx, f.fy, f.s, f.rot, p.light, heat, h);
}
