// The Rift family: riftling, riftling elder, Rift Warden and Warden of the Cut. Things of crystal
// shard and ember: a molten core wrapped in faceted stone. A body is built in depth layers rather
// than as one flat card -- the dark far limbs, then the body mass, then one or two layers of paler
// plates lying on it, each layer a blob of its own so it keeps an ink edge, and each plate given a
// shadow cast under its far lip. The core is a dark gap in the stone with a glow behind it and a
// hot lump inside, and it burns in the space the plates leave BETWEEN them, so its light leaks out
// round their lips instead of sitting on a surface. Seams are soft hot lines that pulse with the
// frame; eyes are hot points; wobble seeds are constants, never the frame, so no contour boils.
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

/**
 * A limb of crystal: flat-sided segments along a spine, the width stepping at every joint and the
 * two sides never stepping by the same amount, so the joint breaks off-square. Both ends are cut
 * flat. A tapered capsule is a tube, and a tube on a creature made of shards is the one shape that
 * says it is not stone -- the riftling's arms and legs were capsules, and measured it: only 39% of
 * the turning along its edge fell in the sharpest tenth of it, against 49% on the Rift Warden.
 */
function facetLimb(pts: readonly number[], rs: readonly number[], skew = 0.22): number[] {
  const n = pts.length / 2, left: number[] = [], right: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1), c = Math.min(n - 1, i + 1);
    const dx = pts[c * 2] - pts[a * 2], dy = pts[c * 2 + 1] - pts[a * 2 + 1], len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len, k = i % 2 ? 1 : -1;
    const wl = rs[i] * (1 + skew * k), wr = rs[i] * (1 - skew * k);
    left.push(pts[i * 2] + nx * wl, pts[i * 2 + 1] + ny * wl);
    right.push(pts[i * 2] - nx * wr, pts[i * 2 + 1] - ny * wr);
  }
  const out = [...left];
  for (let i = n - 1; i >= 0; i--) out.push(right[i * 2], right[i * 2 + 1]);
  return out;
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

/**
 * One lip of a break: the spine pushed to one side by a sawtooth width that tapers to nothing at
 * both tips, then slid along the break by `shift`. The two lips take opposite `odd`, so their teeth
 * never mate and the halves read as having ground past one another.
 */
function lip(spine: readonly number[], w: number, side: 1 | -1, shift: number, odd: boolean): number[] {
  const n = spine.length / 2, out: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1) * 2, c = Math.min(n - 1, i + 1) * 2;
    const dx = spine[c] - spine[a], dy = spine[c + 1] - spine[a + 1], len = Math.hypot(dx, dy) || 1;
    const tx = dx / len, ty = dy / len;
    const taper = Math.sin(Math.PI * (i / (n - 1))) ** 0.45;
    const k = ((i % 2 === 1) === odd ? 1 : 0.3) * taper;
    out.push(spine[i * 2] - ty * w * k * side + tx * shift * taper, spine[i * 2 + 1] + tx * w * k * side + ty * shift * taper);
  }
  return out;
}

/** The molten core: a dark ragged gap in the stone, a glow behind it, a hot lump inside with a white heart. */
function core(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, dark: string, heat: Heat, pulse: number, seed: number, h: number): void {
  blob(ctx, B, dark, [{ k: 'curve', pts: ring(cx, cy, r * 1.35, 7, 1, 1.1, 0.4), wobble: 0.12, seed, sub: 2 }], { h, outline: false, formK: 0.2, spread: 0.5 });
  glow(ctx, B, cx, cy, r * (2.6 + pulse * 0.6), heat.glow, 0.5 + pulse * 0.3, heat.heart);
  blob(ctx, B, heat.ember, [{ k: 'curve', pts: ring(cx, cy, r, 6, 1, 1.15, 0.9), wobble: 0.1, seed: seed + 1, sub: 2, gloss: 1 }], { h, outline: false, formK: 0.4, gloss: 0.6 });
  if (!B.override) { ctx.fillStyle = rgba(heat.heart, 0.55 + pulse * 0.4); ctx.beginPath(); ctx.arc(cx - r * 0.1, cy - r * 0.1, r * 0.45, 0, Math.PI * 2); ctx.fill(); }
}

/**
 * A hot eye: a glow and an angular slit of light. Never a round dot -- two dots of nearly the same
 * size side by side read as a pair of eyeballs stuck on a face, and these things have no eyes, only
 * light coming up out of a crack in them.
 */
function hotEye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, heat: Heat, pulse: number, rot = -0.42): void {
  glow(ctx, B, x, y, r * 3, heat.glow, 0.35 + pulse * 0.25, heat.heart);
  if (r < 1.1) { eye(ctx, x, y, r, heat.heart, false); return; }      // too small to have a shape
  const c = Math.cos(rot), sn = Math.sin(rot);
  const P = (u: number, v: number): number[] => [x + u * c - v * sn, y + u * sn + v * c];
  fillPoly(ctx, [...P(-r * 1.6, 0), ...P(-r * 0.3, -r * 0.66), ...P(r * 1.7, -r * 0.12), ...P(r * 0.1, r * 0.64)], heat.heart);
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
 *
 * The trunk is a stack of slabs, not a faceted card. Three tones, three depths: the dark body mass,
 * then the belly plate and shoulder guard lying on it, then the breastplate and brow lying on those.
 * Every plate carries its own ink edge and a shadow cast under its far lip, and the core burns in
 * the notch the breastplate lifts away from the belly, so the light leaks out from BETWEEN them.
 */
function creature(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, elder: boolean): void {
  const heat = heatOf(p, false), pulse = 0.5 + 0.5 * Math.sin(p.frame / 6);
  const b = p.breathe * h * 0.008, sway = Math.sin(p.frame / 20) * h * 0.006;
  // W widens the frame, T thickens the limbs: the elder is the same creature grown heavy.
  const W = elder ? 1.18 : 0.94, T = elder ? 1.3 : 1;
  groundShadow(ctx, x, y + 1, h * 0.78 * W);

  // The skull's own frame: locals in head units, so brow, jaw, teeth and crown scale as one piece.
  const hs = h * (elder ? 1.02 : 0.92);
  const hx = x + h * 0.175 + sway, hy = y - h * 0.815 + b;
  const HD = (u: number, v: number): number[] => [hx + u * hs, hy + v * hs];

  // ---- the far side: leg and arm, their own darker mass, the elbow swung clear of the body.
  const fex = x - h * 0.355 * W, fey = y - h * 0.575 + sway, fwx = x - h * 0.3 * W, fwy = y - h * 0.385 + sway;
  blob(ctx, B, p.dark, [
    { k: 'poly', pts: facetLimb(
      [x - h * 0.09, y - h * 0.43, x - h * 0.015, y - h * 0.3, x - h * 0.145, y - h * 0.16, x - h * 0.055, y - h * 0.03],
      [h * 0.062 * W, h * 0.05 * W, h * 0.042, h * 0.036]) },
    { k: 'poly', pts: [x - h * 0.185, y - h * 0.015, x - h * 0.055, y - h * 0.07, x + h * 0.04, y - h * 0.01, x - h * 0.135, y + h * 0.01] },
    { k: 'poly', pts: facetLimb(
      [x - h * 0.06, y - h * 0.695 + b, fex, fey, fwx, fwy],
      [h * 0.066 * T, h * 0.053 * T, h * 0.042 * T]) },
    { k: 'poly', pts: [
      fwx - h * 0.026 * T, fwy - h * 0.026 * T, fwx + h * 0.028 * T, fwy - h * 0.02 * T,
      fwx + h * 0.034 * T, fwy + h * 0.02 * T, fwx - h * 0.006 * T, fwy + h * 0.036 * T,
      fwx - h * 0.03 * T, fwy + h * 0.014 * T] },
    { k: 'poly', pts: shard(fwx + h * 0.012, fwy - h * 0.008, -0.12, h * 0.082 * T, h * 0.024 * T, 0.18) },
    { k: 'poly', pts: shard(fwx + h * 0.014, fwy + h * 0.014, 0.42, h * 0.09 * T, h * 0.025 * T, 0.18) },
    { k: 'poly', pts: shard(fwx + h * 0.002, fwy + h * 0.026, 1.0, h * 0.07 * T, h * 0.022 * T, 0.18) },
  ], { h, formK: 0.45 });

  // ---- the near arm: upper arm as thick as the thigh, a forearm, an elbow shard, shard claws.
  const ax = x + h * 0.195 * W, ay = y - h * 0.675 + b;
  const ex = x + h * 0.325 * W, ey = y - h * 0.525 - sway;
  const wx = x + h * 0.43 * W, wy = y - h * 0.595 - sway;

  // ---- the body mass: back and haunch, neck, skull, jaw, crown, near leg, near arm.
  const stone: Part[] = [
    { k: 'poly', pts: [x - h * 0.185 * W, y - h * 0.425, x - h * 0.225 * W, y - h * 0.595, x - h * 0.175 * W, y - h * 0.715 + b, x - h * 0.01, y - h * 0.76 + b, x + h * 0.195 * W, y - h * 0.71 + b, x + h * 0.23 * W, y - h * 0.555, x + h * 0.16, y - h * 0.44, x - h * 0.02, y - h * 0.415] },
    { k: 'poly', pts: [
      x - h * 0.142 * W, y - h * 0.458, x - h * 0.102 * W, y - h * 0.374, x - h * 0.012, y - h * 0.344,
      x + h * 0.098 * W, y - h * 0.372, x + h * 0.148 * W, y - h * 0.452, x + h * 0.112 * W, y - h * 0.522,
      x - h * 0.022, y - h * 0.548, x - h * 0.118 * W, y - h * 0.512] },
    { k: 'cap', x0: x + h * 0.08, y0: y - h * 0.735 + b, x1: hx - hs * 0.05, y1: hy + hs * 0.085, r0: h * 0.05 * T, r1: h * 0.046 * T },
    // The skull: blunt and angular, taller than it is long, brow and cheek stepping back to the jaw.
    { k: 'poly', pts: [...HD(-0.086, -0.128), ...HD(-0.014, -0.174), ...HD(0.056, -0.140), ...HD(0.090, -0.086), ...HD(0.108, -0.040), ...HD(0.066, -0.022), ...HD(0.082, 0.036), ...HD(0.040, 0.074), ...HD(-0.058, 0.068), ...HD(-0.098, -0.022)] },
    // The jaw: short and square, hinged at the back, hanging open at the front.
    { k: 'poly', pts: [...HD(-0.050, 0.056), ...HD(0.072, 0.084), ...HD(0.086, 0.132), ...HD(0.028, 0.152), ...HD(-0.028, 0.128), ...HD(-0.056, 0.100)] },
    { k: 'poly', pts: facetLimb(
      [x + h * 0.1, y - h * 0.43, x + h * 0.215, y - h * 0.29, x + h * 0.07, y - h * 0.15, x + h * 0.19, y - h * 0.03],
      [h * 0.072 * W, h * 0.058 * W, h * 0.048, h * 0.04 * T]) },
    { k: 'poly', pts: [x + h * 0.055, y - h * 0.015, x + h * 0.175, y - h * 0.075, x + h * 0.295, y - h * 0.01, x + h * 0.095, y + h * 0.01] },
    { k: 'poly', pts: facetLimb([ax, ay, ex, ey, wx, wy], [h * 0.072 * T, h * 0.054 * T, h * 0.042 * T]) },
    { k: 'poly', pts: shard(ex + h * 0.016, ey + h * 0.018, 1.05, h * 0.1 * T, h * 0.036 * T) },
  ];
  // Crown shards: short, thick, swept up and back; the elder wears four and they run longer.
  const crown: [number, number, number, number][] = elder
    ? [[0.050, -0.118, -1.42, 0.098], [0.008, -0.166, -1.80, 0.118], [-0.044, -0.158, -2.16, 0.104], [-0.086, -0.100, -2.58, 0.086]]
    : [[0.034, -0.146, -1.46, 0.086], [-0.020, -0.172, -1.92, 0.104], [-0.072, -0.118, -2.42, 0.082]];
  for (const [u, v, a, len] of crown) {
    const base = HD(u, v);
    stone.push({ k: 'poly', pts: shard(base[0], base[1], a, hs * len, hs * 0.031, 0.26) });
  }
  // The hand: a short angular palm with the claws breaking off its front edge at different points.
  // Shards all radiating from the one point at the wrist read as a mitten with fingers drawn on it.
  const pw = h * 0.052 * T, phx = wx - h * 0.008, phy = wy + h * 0.004;
  stone.push({ k: 'poly', pts: [
    phx - pw * 0.52, phy - pw * 0.6, phx + pw * 0.62, phy - pw * 0.44,
    phx + pw * 0.78, phy + pw * 0.32, phx + pw * 0.08, phy + pw * 0.72, phx - pw * 0.58, phy + pw * 0.28,
  ] });
  const claws: [number, number, number][] = elder
    ? [[-0.36, 0.100, -0.52], [0.00, 0.122, -0.16], [0.38, 0.108, 0.22], [0.78, 0.084, 0.6]]
    : [[-0.30, 0.092, -0.46], [0.06, 0.112, -0.02], [0.46, 0.090, 0.46]];
  for (const [a, len, off] of claws) {
    const bx = phx + Math.cos(a) * pw * 0.36 - Math.sin(a) * pw * off;
    const by = phy + Math.sin(a) * pw * 0.36 + Math.cos(a) * pw * off;
    stone.push({ k: 'poly', pts: shard(bx, by, a, h * len * T, h * 0.026 * T, 0.18) });
  }
  blob(ctx, B, p.base, stone, { h, tex: 'facets', seed: 4, amount: 0.3, formK: 0.55, spread: 0.8, creases: [
    { x0: x + h * 0.06, y0: y - h * 0.745 + b, x1: hx - hs * 0.07, y1: hy + hs * 0.1, r: h * 0.026, a: 0.4 },
    { x0: ax + h * 0.015, y0: ay + h * 0.025, x1: ex, y1: ey, r: h * 0.024, a: 0.28 },
    { x0: ex, y0: ey, x1: wx, y1: wy, r: h * 0.02, a: 0.24 },
  ] });

  // ---- first plate layer: the belly slab, the shoulder guard and the brow shelf, on the mass.
  const mid = shade(mix(p.base, '#ffd0a0', elder ? 0.25 : 0.21), Math.max(0.65, p.tone));
  const belly = [x - h * 0.116 * W, y - h * 0.418, x - h * 0.142 * W, y - h * 0.492, x - h * 0.05, y - h * 0.542,
    x + h * 0.06 * W, y - h * 0.528, x + h * 0.132 * W, y - h * 0.464, x + h * 0.096 * W, y - h * 0.414, x + h * 0.014, y - h * 0.396];
  const guard = [x + h * 0.09, y - h * 0.758 + b, x + h * 0.22 * W, y - h * 0.722 + b, x + h * 0.288 * W, y - h * 0.632, x + h * 0.244 * W, y - h * 0.57, x + h * 0.142, y - h * 0.614];
  const brow = [...HD(-0.080, -0.122), ...HD(-0.012, -0.166), ...HD(0.052, -0.134), ...HD(0.092, -0.084), ...HD(0.036, -0.072), ...HD(-0.042, -0.090)];
  const midSlabs: Part[] = [{ k: 'poly', pts: belly }, { k: 'poly', pts: guard }, { k: 'poly', pts: brow }];
  if (elder) midSlabs.push({ k: 'poly', pts: [x - h * 0.185 * W, y - h * 0.7 + b, x - h * 0.265 * W, y - h * 0.625 + b, x - h * 0.24 * W, y - h * 0.5, x - h * 0.135, y - h * 0.53] });
  for (const q of midSlabs) underShadow(ctx, (q as { pts: number[] }).pts, p.dark, h * 0.017, 0.5);
  blob(ctx, B, mid, midSlabs, { h, tex: 'facets', seed: 17, amount: 0.2, formK: 0.5, spread: 0.7 });

  // ---- the core, burning in the notch the breastplate lifts away from the belly slab.
  const cr = h * (elder ? 0.068 : 0.056), ccx = x + h * 0.002, ccy = y - h * 0.642 + b * 0.6;
  core(ctx, ccx, ccy, cr, p.dark, heat, pulse, 30, h);

  // ---- second plate layer: the breastplate, palest, lying on the belly slab and the mass.
  const top = shade(mix(p.base, '#ffe0b8', elder ? 0.43 : 0.37), Math.max(0.65, p.tone));
  const breast = [x - h * 0.104 * W, y - h * 0.606, x - h * 0.14 * W, y - h * 0.668 + b, x - h * 0.086 * W, y - h * 0.722 + b,
    x - h * 0.008, y - h * 0.742 + b, x + h * 0.106 * W, y - h * 0.706 + b, x + h * 0.122 * W, y - h * 0.642,
    x + h * 0.04, y - h * 0.652, x - h * 0.014, y - h * 0.698, x - h * 0.056, y - h * 0.644];
  const topSlabs: Part[] = [{ k: 'poly', pts: breast }];
  if (elder) topSlabs.push({ k: 'poly', pts: [x + h * 0.195 * W, y - h * 0.5, x + h * 0.26 * W, y - h * 0.455, x + h * 0.2, y - h * 0.385, x + h * 0.11, y - h * 0.395] });
  for (const q of topSlabs) underShadow(ctx, (q as { pts: number[] }).pts, p.dark, h * 0.019, 0.55);
  blob(ctx, B, top, topSlabs, { h, tex: 'facets', seed: 18, amount: 0.2, formK: 0.5, spread: 0.65 });

  // The core's light spilling out of the notch and round the lips of the plates that frame it.
  glow(ctx, B, ccx, ccy + cr * 0.15, cr * 2.3, heat.glow, 0.34 + pulse * 0.24, heat.heart);
  glow(ctx, B, ccx + h * 0.105 * W, ccy + h * 0.025, cr * 1.3, heat.glow, 0.2 + pulse * 0.14, heat.heart);
  glow(ctx, B, ccx - h * 0.115 * W, ccy + h * 0.045, cr * 1.2, heat.glow, 0.18 + pulse * 0.12, heat.heart);

  glint(ctx, x - h * 0.105 * W, y - h * 0.7 + b, h * 0.05, 0.55, -0.9);
  glint(ctx, x + h * 0.195 * W, y - h * 0.73 + b, h * 0.04, 0.45, -0.6);
  glint(ctx, ...(HD(-0.048, -0.062) as [number, number]), hs * 0.04, 0.5, -0.6);
  glint(ctx, x + h * 0.13, y - h * 0.29, h * 0.03, 0.4, 1.1);

  // ---- seams: short hot breaks along the lips of the plates, pulsing with the core.
  const sa = (elder ? 0.6 : 0.45) + pulse * 0.35, sw = Math.max(1, h * (elder ? 0.017 : 0.013));
  seam(ctx, [x + h * 0.007, y - h * 0.693, x + h * 0.068, y - h * 0.64, x + h * 0.125 * W, y - h * 0.653], heat.seam, sw, sa);
  seam(ctx, [x - h * 0.007, y - h * 0.693, x - h * 0.063, y - h * 0.643, x - h * 0.125 * W, y - h * 0.655], heat.seam, sw, sa * 0.9);
  seam(ctx, [x - h * 0.03, y - h * 0.583, x + h * 0.06, y - h * 0.572, x + h * 0.14 * W, y - h * 0.548], heat.seam, sw, sa * 0.7);
  seam(ctx, [x + h * 0.1, y - h * 0.752 + b, x + h * 0.18, y - h * 0.726 + b], heat.seam, sw, sa * 0.5);
  seam(ctx, [x - h * 0.168 * W, y - h * 0.612, x - h * 0.13 * W, y - h * 0.66], heat.seam, sw, sa * 0.5);

  // ---- the face: the mouth gaping under the brow, two fangs, then the two hot eyes. An even row
  //      of little triangles across a dark rectangle is a carved pumpkin, not a crystal skull.
  fillPoly(ctx, [...HD(-0.016, 0.066), ...HD(0.078, 0.048), ...HD(0.090, 0.084), ...HD(0.034, 0.100), ...HD(-0.010, 0.090)], tones(B, p.dark).deep);
  ctx.fillStyle = B.col(shade('#e8d8b8', Math.max(0.5, p.tone)));
  //                 base u,  base v,  tip u,   tip v,  half width: one long upper fang, one short,
  //                 and one out of the jaw that does not line up with either of them.
  for (const [u0, v0, u1, v1, w] of [[0.062, 0.052, 0.052, 0.092, 0.013], [0.022, 0.060, 0.018, 0.076, 0.008], [0.040, 0.100, 0.046, 0.070, 0.010]] as const) {
    const a = HD(u0 - w, v0), c = HD(u0 + w, v0), t = HD(u1, v1);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(t[0], t[1]); ctx.lineTo(c[0], c[1]); ctx.closePath(); ctx.fill();
  }
  // The socket the eyes burn in: a wedge in the shadow the brow ledge throws, cut to the shape of
  // the overhang rather than run as a band from one side of the head to the other.
  fillPoly(ctx, [...HD(-0.066, -0.026), ...HD(0.062, -0.012), ...HD(0.076, 0.030), ...HD(0.020, 0.046), ...HD(-0.052, 0.030)], rgba(tones(B, p.dark).deep, 0.94));
  const er = hs * (elder ? 0.030 : 0.028);
  hotEye(ctx, ...(HD(0.002, 0.000) as [number, number]), er * 0.58, heat, pulse * 0.8, 0.5);
  hotEye(ctx, ...(HD(0.058, 0.016) as [number, number]), er, heat, pulse, -0.34);

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
  ], { h, tex: 'facets', seed: 41, amount: 0.5, formK: 0.4 });

  // The body: a great faceted stone, jagged with protruding shards, a crown, thick shard arms.
  const stone: Part[] = [
    { k: 'curve', pts: ring(cx, cy, h * 0.3, 8, 1, 1.25, 0.15), wobble: 0.05, seed: 5, sub: 2 },
    { k: 'poly', pts: [x - h * 0.22, y - h * 0.62, x - h * 0.44, y - h * 0.86, x - h * 0.12, y - h * 0.9] },
    { k: 'poly', pts: [x + h * 0.12, y - h * 0.88, x + h * 0.42, y - h * 0.8, x + h * 0.24, y - h * 0.6] },
    { k: 'poly', pts: [x - h * 0.2, y - h * 0.4, x - h * 0.42, y - h * 0.32, x - h * 0.24, y - h * 0.24] },
    { k: 'poly', pts: [x + h * 0.18, y - h * 0.3, x + h * 0.4, y - h * 0.24, x + h * 0.3, y - h * 0.44] },
    { k: 'poly', pts: facetLimb([x - h * 0.3, y - h * 0.74 + b, x - h * 0.52, y - h * 0.5 + b, x - h * 0.48, y - h * 0.3], [h * 0.095, h * 0.082, h * 0.07], 0.18) },
    { k: 'poly', pts: facetLimb([x + h * 0.3, y - h * 0.72 + b, x + h * 0.54, y - h * 0.56 + b, x + h * 0.52, y - h * 0.34], [h * 0.095, h * 0.082, h * 0.07], 0.18) },
  ];
  // Fists: blunt shard knuckles; the Warden of the Cut has lost its left hand at the wrist.
  stone.push({ k: 'poly', pts: [x + h * 0.44, y - h * 0.36, x + h * 0.6, y - h * 0.38, x + h * 0.62, y - h * 0.22, x + h * 0.5, y - h * 0.17, x + h * 0.42, y - h * 0.26] });
  if (!cut) stone.push({ k: 'poly', pts: [x - h * 0.56, y - h * 0.34, x - h * 0.4, y - h * 0.34, x - h * 0.37, y - h * 0.2, x - h * 0.5, y - h * 0.15, x - h * 0.58, y - h * 0.24] });
  // The crown: five or seven spikes of uneven length, the tallest just right of centre.
  const spikes = cut ? 7 : 5, tall = cut ? 0.36 : 0.26;
  for (let i = 0; i < spikes; i++) {
    const u = (i - (spikes - 1) / 2) / spikes, bx = cx + u * h * 0.62;
    const jitter = 0.62 + ((i * 37) % 11) / 11 * 0.7;                  // stable per spike, never off the frame
    const len = (h * tall * (1 - Math.abs(u - 0.06) * 1.6) + h * 0.08) * jitter;
    const lean = u * h * 0.14 + (i % 2 ? 1 : -1) * h * 0.03 * jitter;
    const top = y - h * 0.86 + Math.abs(u) * h * 0.1 + ((i * 53) % 7) / 7 * h * 0.03;
    const w = h * (0.036 + ((i * 29) % 5) / 5 * 0.022);
    stone.push({ k: 'poly', pts: [bx - w, top + h * 0.06, bx + lean, top - len, bx + w * 0.9, top + h * 0.05] });
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
    // The Cut is not a line drawn on the stone: it is a gap broken clean through it. A jagged spine
    // runs shoulder to hip; each lip is offset off it by a sawtooth that tapers out at both tips, and
    // the lower lip is slid along the break so the teeth no longer mate. Between the lips is the dark
    // of the interior, lit from within; beyond each lip the stone falls away into shadow. The plates
    // the break crosses are carried down the slip with it, each with its own edge.
    const anchor = [x - h * 0.34, y - h * 0.84, x - h * 0.25, y - h * 0.72, x - h * 0.17, y - h * 0.685, x - h * 0.07, y - h * 0.6, x + h * 0.03, y - h * 0.515, x + h * 0.055, y - h * 0.425, x + h * 0.13, y - h * 0.365, x + h * 0.16, y - h * 0.275, x + h * 0.27, y - h * 0.21];
    const spine: number[] = [];
    for (let i = 0; i < anchor.length / 2 - 1; i++) for (let k = 0; k < 3; k++) {
      const ax = anchor[i * 2], ay = anchor[i * 2 + 1], dx = anchor[i * 2 + 2] - ax, dy = anchor[i * 2 + 3] - ay, L = Math.hypot(dx, dy) || 1, t = k / 3;
      const j = ((i * 3 + k) % 2 ? 1 : -1) * h * 0.016;
      spine.push(ax + dx * t - dy / L * j, ay + dy * t + dx / L * j);
    }
    spine.push(anchor[anchor.length - 2], anchor[anchor.length - 1]);
    const slip = h * 0.036, gw = h * 0.042;
    // The plates below the break, carried down the slip: their own outline, offset from their match.
    for (const q of [
      [x - h * 0.235, y - h * 0.6, x - h * 0.105, y - h * 0.645, x - h * 0.005, y - h * 0.5, x - h * 0.15, y - h * 0.44],
      [x + h * 0.02, y - h * 0.45, x + h * 0.125, y - h * 0.355, x + h * 0.08, y - h * 0.23, x - h * 0.035, y - h * 0.285],
    ]) glossPoly(ctx, B, q.map((v, i) => v + (i % 2 ? slip * 0.74 : slip * 0.7)), shade(p.base, 0.82), { gloss: 0.5, h, tex: 'facets', seed: 51, amount: 0.5 });
    const upper = lip(spine, gw, -1, 0, true), lower = lip(spine, gw, 1, slip, false);
    // The gap itself: the unlit interior of the stone, with the far wall darker still.
    const gap: number[] = [...upper];
    for (let i = lower.length - 2; i >= 0; i -= 2) gap.push(lower[i], lower[i + 1]);
    fillPoly(ctx, gap, rgba(tones(B, p.dark).deep, 0.96));
    // Stone falling away into shadow beyond each lip.
    softLine(ctx, B, upper.map((v, i) => v - (i % 2 ? h * 0.016 : h * 0.014)), p.base, h * 0.03, 0.7);
    softLine(ctx, B, lower.map((v, i) => v + (i % 2 ? h * 0.016 : h * 0.014)), p.base, h * 0.03, 0.7);
    // Light from inside: it pools in the gap and rims both lips.
    for (const [u, k] of [[0.1, 0.8], [0.3, 0.9], [0.5, 1], [0.7, 0.85], [0.9, 0.6]] as const) {
      const i = Math.round(u * (spine.length / 2 - 1)) * 2;
      glow(ctx, B, (upper[i] + lower[i]) / 2, (upper[i + 1] + lower[i + 1]) / 2, h * 0.06 * k, heat.glow, (0.3 + pulse * 0.18) * k, heat.heart);
    }
    const lw = Math.max(1, h * 0.009), n2 = upper.length;
    for (const [a0, a1, k] of [[0, 0.34, 0.45], [0.3, 0.72, 1], [0.68, 1, 0.55]] as const) {
      const i0 = Math.round(a0 * (n2 / 2 - 1)) * 2, i1 = Math.round(a1 * (n2 / 2 - 1)) * 2 + 2;
      seam(ctx, upper.slice(i0, i1), heat.seam, lw, (0.42 + pulse * 0.2) * k);
      seam(ctx, lower.slice(i0, i1), heat.seam, lw, (0.38 + pulse * 0.2) * k);
    }
    core(ctx, x - h * 0.025, y - h * 0.555 + b, h * 0.072, p.dark, heat, pulse, 31, h);
    // Lesser cracks branching off the break, and the stump of the lost hand, hot where it snapped.
    seam(ctx, [x - h * 0.15, y - h * 0.655, x - h * 0.23, y - h * 0.52, x - h * 0.29, y - h * 0.47], heat.seam, Math.max(1, h * 0.011), 0.45 + pulse * 0.2);
    seam(ctx, [x + h * 0.075, y - h * 0.49, x + h * 0.2, y - h * 0.575, x + h * 0.28, y - h * 0.61], heat.seam, Math.max(1, h * 0.011), 0.4 + pulse * 0.2);
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
  const socket = (ex: number, ey: number, r: number, rot: number): void => {
    const c = Math.cos(rot), sn = Math.sin(rot);
    const P = (u: number, v: number): number[] => [ex + u * c - v * sn, ey + u * sn + v * c];
    fillPoly(ctx, [...P(-r * 2.5, -r * 0.1), ...P(-r * 0.5, -r * 1.25), ...P(r * 2.6, -r * 0.55), ...P(r * 2.2, r * 0.95), ...P(-r * 0.7, r * 1.35)], rgba(tones(B, p.dark).deep, 0.9));
  };
  socket(x - h * 0.115, y - h * 0.815 + b, h * 0.021, 0.34);
  socket(x + h * 0.105, y - h * 0.775 + b, h * 0.03, -0.26);
  hotEye(ctx, x - h * 0.115, y - h * 0.815 + b, h * 0.021, heat, pulse * 0.85, 0.4);
  hotEye(ctx, x + h * 0.105, y - h * 0.775 + b, h * 0.03, heat, pulse, -0.3);
  for (const f of frags) if (f.front) fragment(ctx, f.fx, f.fy, f.s, f.rot, p.light, heat, h);
}
