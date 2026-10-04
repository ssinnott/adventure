// The wraith: a shroud hanging in the air. It has no neck and no shoulders to speak of -- the cowl
// and the body are one bell of cloth, because a hood that sits ON a pair of shoulders is a hooded
// coat and a hole in the front of a bell is a wraith. There is no hem either: below the mantle the
// cloth falls as overlapping tongues, each fading in out of the mass above and out again at its own
// tip, so the body thins into the glow instead of ending on a line. Nothing is mirrored: one claw
// reaches low and one hangs high, the cowl leans, and every tongue is a different length.
//
// The Cairn Wight is the wraith's frame with a body in it, standing: a shroud with grave-gold at
// its throat. Grave linen, pale and earth-stained, drawn over the head as a hood and wound about
// with bands, falls to the ground and drags there, its hem torn and dark with the cairn's soil;
// the hood leans forward over a dark face with two cold points in it; a torc of the hill folk's
// gold is round its throat, the terminals at the front; and two claws of old bone reach out of the
// shroud, low. Idle: it sways where it stands, the claws flex, the eyes flare and the gold glints.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { appendCurve, blob, glossTaper, glow, lumpy, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['wraith', 'cairn_wight'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'cairn_wight') wight(ctx, x, y, h, p);
  else wraith(ctx, x, y, h, p);
};

/** Units of the height, across from the sprite's x and up from its ground line, to the canvas. */
type K = (k: number) => number;

/**
 * A claw out of the cloth. Every bone is drawn on its own, in two segments with a joint between
 * them, and lit ACROSS its axis rather than along it: a finger is nearly parallel to the light,
 * so the one ramp meant to model a mass runs its whole length and turns it into wet plastic.
 * Bones inside one outline weld into a web at the knuckles, which is what a glove looks like.
 */
function claw(ctx: CanvasRenderingContext2D, X: K, Y: K, h: number, kx: number, ky: number, s: number, curl: number, hex: string): void {
  blob(ctx, B, shade(hex, 0.66), [{ k: 'ell', x: X(kx), y: Y(ky + 0.006), rx: h * 0.016, ry: h * 0.013, rot: -0.3 * s }],
    { h, formK: 0.2, spread: 1.4 });
  //        out   length  bend   the middle finger longest, each one hooking by its own amount
  const fing: readonly (readonly [number, number, number])[] =
    [[-0.66, 0.118, 0.82], [-0.18, 0.152, 0.54], [0.44, 0.130, 0.94], [-1.16, 0.064, 0.46]];
  for (let i = 0; i < fing.length; i++) {
    const [out, len, bend] = fing[i], thumb = i === 3, l = h * len;
    const bh = shade(hex, thumb ? 0.84 : i === 0 ? 0.9 : 1);
    const rr = [h * (thumb ? 0.0086 : 0.0096), h * 0.0058, h * 0.0010];
    let ax = Math.PI / 2 - s * out * 0.72;
    let px = X(kx + out * s * 0.028), py = Y(ky - (thumb ? 0.006 : 0.002) + Math.abs(out) * 0.006);
    for (let j = 0; j < 2; j++) {                       // two phalanges, the joint between them inked
      const nx = px + Math.cos(ax) * l * (j ? 0.44 : 0.56), ny = py + Math.sin(ax) * l * (j ? 0.44 : 0.56);
      glossTaper(ctx, B, px, py, nx, ny, rr[j], rr[j + 1], bh, { h });
      px = nx; py = ny; ax += s * curl * bend * 0.55;
    }
  }
}

/** Stable 0..1 noise; never seeded from the frame, or the contour would boil. */
function rnd(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/**
 * One tongue of the falling cloth. `kx` is where it hangs from and `kw` its half-width there; it
 * fades IN over the first sixth of its length, which is what hides the edge of the mass it hangs
 * from, and out again at the tip. All in units of h, ky measured up from the ground line.
 */
interface Tongue { kx: number; top: number; tip: number; kw: number; lean: number; a: number; tint: 0 | 1 | 2 }

function wraith(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const drift = Math.sin(p.frame / 34) * h * 0.013;             // the whole shroud rising and falling
  const sway = Math.sin(p.frame / 41) * 0.008;                  // the cloth trailing, in units of h
  const pulse = 0.5 + 0.5 * Math.sin(p.frame / 9);
  const flare = 0.5 + 0.5 * Math.sin(p.frame / 23);
  const X = (k: number) => x + h * k, Y = (k: number) => y - h * k + drift;
  const tone = p.tone;
  // A ladder wide enough to model cloth: the void is the floor and the eyes the ceiling, with three
  // clear steps of shroud between. The old drawing put 84% of the cloth inside one 60-wide band of
  // luminance, which is why it read as one moulded shell rather than as folds.
  const shroudHex = mix(p.base, '#39465c', 0.5);       // the tint, taken well down: a shroud is dark
  const cloth = shade(shroudHex, tone);
  const deep = shade(mix(p.dark, '#0e1420', 0.55), tone);
  const lit = shade(mix(p.light, '#eef4fb', 0.5), tone);
  const cold = mix(p.light, '#b0e8ff', 0.45);
  const bone = shade(mix(shroudHex, '#d2dae6', 0.46), tone);
  const voidHex = shade('#0b0810', Math.max(0.55, tone));
  const TINT = [cloth, deep, lit];

  groundShadow(ctx, x, y + 1, h * 0.18);
  glow(ctx, B, X(0.01), Y(0.64), h * 0.38, p.base, 0.14 + 0.1 * pulse, cold);
  glow(ctx, B, X(0.0), Y(0.22), h * 0.3, p.base, 0.2 + 0.08 * pulse, cold);

  /**
   * A tongue of cloth: a ragged ribbon that narrows as it falls, with no ink on it at all. Ink
   * along the bottom is exactly what made the old shroud read as a garment that stopped there.
   */
  const tongue = (s: Tongue, seed: number): void => {
    const n = 8, yt = Y(s.top), yb = Y(s.tip), L: number[] = [], R: number[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const cx = X(s.kx + s.lean * t * t + sway * t * t * 2.4 + (rnd(seed, i) - 0.5) * 0.014);
      const cy = yt + (yb - yt) * t;
      const w = h * s.kw * (1 - t * 0.66) * (0.72 + rnd(seed, i + 40) * 0.56);
      L.push(cx - w, cy); R.unshift(cx + w, cy);
    }
    ctx.beginPath(); ctx.moveTo(L[0], L[1]);
    for (let i = 2; i < L.length; i += 2) ctx.lineTo(L[i], L[i + 1]);
    for (let i = 0; i < R.length; i += 2) ctx.lineTo(R[i], R[i + 1]);
    ctx.closePath();
    if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }   // the flash is one silhouette
    const g = ctx.createLinearGradient(0, yt, 0, yb), hex = TINT[s.tint];
    g.addColorStop(0, rgba(hex, 0));
    g.addColorStop(0.16, rgba(hex, s.a));
    g.addColorStop(0.46, rgba(hex, s.a * 0.74));
    g.addColorStop(0.78, rgba(hex, s.a * 0.26));
    g.addColorStop(1, rgba(hex, 0));
    ctx.fillStyle = g; ctx.fill();
  };

  // 1. The far claw: higher than the near one, smaller, darker, and half swallowed by the cloth
  //    that goes over it. A pair of hands at the same height on the same arms is a coat on a peg.
  claw(ctx, X, Y, h, -0.138, 0.582, -1, 0.86, shade(bone, 0.88));

  // 2. The bell: cowl and body in one unbroken line from the peak of the hood to below the mantle,
  //    with no neck anywhere on it, and one arm reaching out of the near side under a sleeve that
  //    sags into a dag of cloth behind it.
  const shroud: Part[] = [
    { k: 'curve', pts: [
      X(0.020), Y(0.960), X(0.060), Y(0.914), X(0.084), Y(0.842), X(0.098), Y(0.768), X(0.116), Y(0.696),
      X(0.119), Y(0.622), X(0.122), Y(0.548),
      X(0.062), Y(0.566), X(-0.004), Y(0.544), X(-0.068), Y(0.568), X(-0.118), Y(0.550),
      X(-0.120), Y(0.622), X(-0.114), Y(0.696), X(-0.094), Y(0.768), X(-0.080), Y(0.842),
      X(-0.056), Y(0.914), X(-0.020), Y(0.960), X(-0.004), Y(0.982),
    ], wobble: 0.007, seed: 1, sub: 3 },
    { k: 'curve', pts: [
      X(0.092), Y(0.744), X(0.148), Y(0.704), X(0.186), Y(0.642), X(0.204), Y(0.572), X(0.200), Y(0.518),
      X(0.158), Y(0.510), X(0.148), Y(0.556), X(0.126), Y(0.508), X(0.114), Y(0.590), X(0.100), Y(0.672),
    ], wobble: 0.028, seed: 3, sub: 3 },
  ];
  blob(ctx, B, cloth, shroud, { h, formK: 0.26, spread: 0.5, creases: [
    { x0: X(0.094), y0: Y(0.794), x1: X(0.106), y1: Y(0.566), r: h * 0.026, a: 0.5 },   // the near side falls away from the light
    { x0: X(0.050), y0: Y(0.810), x1: X(0.064), y1: Y(0.570), r: h * 0.028, a: 0.26 },
    { x0: X(-0.080), y0: Y(0.858), x1: X(-0.102), y1: Y(0.776), r: h * 0.020, a: 0.32 }, // the fold beside the cowl
    { x0: X(0.090), y0: Y(0.852), x1: X(0.110), y1: Y(0.778), r: h * 0.018, a: 0.36 },
    { x0: X(0.108), y0: Y(0.742), x1: X(0.118), y1: Y(0.556), r: h * 0.020, a: 0.54 },   // under the reaching arm
    { x0: X(0.200), y0: Y(0.542), x1: X(0.172), y1: Y(0.526), r: h * 0.017, a: 0.72 },   // the dark inside the cuff
    { x0: X(0.140), y0: Y(0.550), x1: X(0.130), y1: Y(0.516), r: h * 0.014, a: 0.5 },    // the dag of cloth hanging
  ] });

  // 3. Light on what faces the top-left, laid on as soft patches. The woven fold texture is gone:
  //    blob only draws a texture above h=56, so it was decorating the review size and absent at the
  //    size the game plays at -- and at review size it drew pale lines straight down the chest that
  //    read as the zip of a sweatshirt.
  patch(ctx, B, lit, [{ k: 'ell', x: X(-0.044), y: Y(0.908), rx: h * 0.028, ry: h * 0.044, rot: 0.26 }], { alpha: 0.42, feather: 0.85 });
  patch(ctx, B, lit, [{ k: 'ell', x: X(-0.074), y: Y(0.772), rx: h * 0.030, ry: h * 0.060, rot: 0.1 }], { alpha: 0.3, feather: 1 });
  patch(ctx, B, lit, [{ k: 'ell', x: X(-0.076), y: Y(0.624), rx: h * 0.028, ry: h * 0.072, rot: -0.06 }], { alpha: 0.24, feather: 0.95 });
  patch(ctx, B, lit, [{ k: 'ell', x: X(0.168), y: Y(0.656), rx: h * 0.013, ry: h * 0.040, rot: -0.14 }], { alpha: 0.26, feather: 0.9 });
  patch(ctx, B, deep, [{ k: 'ell', x: X(0.092), y: Y(0.648), rx: h * 0.030, ry: h * 0.130, rot: -0.03 }], { alpha: 0.34, feather: 1 });
  patch(ctx, B, deep, [{ k: 'ell', x: X(0.028), y: Y(0.570), rx: h * 0.100, ry: h * 0.052, rot: 0.04 }], { alpha: 0.26, feather: 1 });
  if (!B.override) {
    softLine(ctx, B, [X(-0.026), Y(0.756), X(-0.040), Y(0.676), X(-0.028), Y(0.600)], cloth, h * 0.015, 0.3);
    softLine(ctx, B, [X(0.036), Y(0.742), X(0.048), Y(0.664)], cloth, h * 0.013, 0.26);
    // A cold rim down the side the light comes from: it is what lifts the shroud off the background
    // at any size, and it costs one stroke.
    ctx.strokeStyle = rgba(mix(lit, '#ffffff', 0.34), 0.38); ctx.lineWidth = Math.max(1, h * 0.008);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(X(-0.010), Y(0.968));
    for (const [kx, ky] of [[-0.036, 0.948], [-0.060, 0.918], [-0.074, 0.884], [-0.082, 0.842], [-0.086, 0.800], [-0.100, 0.756], [-0.114, 0.706], [-0.116, 0.648]] as const) ctx.lineTo(X(kx), Y(ky));
    ctx.stroke();
  }

  // 4. The fall: tongues of cloth of clearly different length that lean inward as they go, so the
  //    bell keeps narrowing. Parallel tongues of alternating tone read as a pair of legs.
  const fall: Tongue[] = [
    { kx: -0.002, top: 0.658, tip: 0.062, kw: 0.098, lean: 0.004, a: 0.68, tint: 1 },   // the veil behind
    { kx: -0.110, top: 0.656, tip: 0.236, kw: 0.028, lean: 0.030, a: 1, tint: 1 },
    { kx: -0.074, top: 0.644, tip: 0.088, kw: 0.026, lean: 0.036, a: 1, tint: 0 },
    { kx: -0.036, top: 0.660, tip: 0.312, kw: 0.024, lean: 0.018, a: 1, tint: 0 },
    { kx: 0.002, top: 0.648, tip: 0.044, kw: 0.026, lean: 0.004, a: 1, tint: 0 },
    { kx: 0.040, top: 0.658, tip: 0.264, kw: 0.024, lean: -0.014, a: 1, tint: 0 },
    { kx: 0.078, top: 0.646, tip: 0.128, kw: 0.026, lean: -0.030, a: 1, tint: 1 },
    { kx: 0.112, top: 0.654, tip: 0.192, kw: 0.028, lean: -0.036, a: 1, tint: 0 },
  ];
  for (let i = 0; i < fall.length; i++) tongue(fall[i], 60 + i * 7);
  // and a few threads trailing out of the bottom of that, too faint to have a shape of their own
  const threads: Tongue[] = [
    { kx: -0.060, top: 0.300, tip: 0.034, kw: 0.013, lean: 0.016, a: 0.5, tint: 1 },
    { kx: 0.016, top: 0.258, tip: 0.018, kw: 0.011, lean: 0.012, a: 0.44, tint: 0 },
    { kx: 0.082, top: 0.310, tip: 0.072, kw: 0.012, lean: -0.020, a: 0.46, tint: 1 },
  ];
  for (let i = 0; i < threads.length; i++) tongue(threads[i], 130 + i * 9);

  // 5. The cowl's opening: a hole cut in the front of the bell, thick with cloth on the far side and
  //    thin on the near, with the hood's own overhang darkening the top of it.
  blob(ctx, B, voidHex, [
    { k: 'curve', pts: [
      X(0.048), Y(0.816), X(0.056), Y(0.856), X(0.048), Y(0.900), X(0.018), Y(0.930),
      X(-0.018), Y(0.932), X(-0.042), Y(0.900), X(-0.048), Y(0.856), X(-0.038), Y(0.820),
      X(-0.014), Y(0.800), X(0.016), Y(0.802),
    ], wobble: 0.05, seed: 8, sub: 2 },
  ], { outline: false, form: false, spread: 0.35 });
  if (!B.override) {
    ctx.save();
    ctx.beginPath(); ctx.ellipse(X(0.004), Y(0.858), h * 0.056, h * 0.076, 0.04, 0, Math.PI * 2); ctx.clip();
    const g = ctx.createLinearGradient(0, Y(0.94), 0, Y(0.84));
    g.addColorStop(0, rgba('#000000', 0.82)); g.addColorStop(1, rgba('#000000', 0));
    ctx.fillStyle = g; ctx.fillRect(X(-0.08), Y(0.95), h * 0.17, h * 0.14);
    const g2 = ctx.createLinearGradient(0, Y(0.792), 0, Y(0.846));
    g2.addColorStop(0, rgba('#000000', 0.6)); g2.addColorStop(1, rgba('#000000', 0));
    ctx.fillStyle = g2; ctx.fillRect(X(-0.08), Y(0.846), h * 0.17, h * 0.07);
    ctx.restore();
    // The near edge of the cloth crossing under the hole: a shadow, not a pale band. A bright
    // crescent there reads as a chin, or as a mask tied over the face.
    softLine(ctx, B, [X(-0.048), Y(0.816), X(0.002), Y(0.798), X(0.056), Y(0.812)], cloth, h * 0.018, 0.5);
  }

  // 6. The eyes: two cold slits, not a matched pair of headlights -- the near one larger, lower and
  //    tilted in, the far one small, higher and set back against the cloth.
  const gaze = (kx: number, ky: number, rx: number, ry: number, rot: number, bloom: number): void => {
    glow(ctx, B, X(kx), Y(ky), h * (0.024 + 0.021 * flare) * bloom, cold, 0.32 + 0.42 * flare, '#ffffff');
    ctx.beginPath(); ctx.ellipse(X(kx), Y(ky), h * rx, h * ry, rot, 0, Math.PI * 2);
    ctx.fillStyle = B.col(mix(cold, '#ffffff', 0.3 + 0.5 * flare)); ctx.fill();
  };
  gaze(0.018, 0.864, 0.0150, 0.0082, -0.44, 0.92);
  gaze(-0.023, 0.878, 0.0102, 0.0062, 0.36, 0.7);

  // 7. The near claw, in front of everything it hangs over.
  claw(ctx, X, Y, h, 0.180, 0.512, 1, 0.62, bone);

  // 8. Motes drifting up through the glow (emissive: not part of the flash silhouette).
  if (!B.override) {
    for (let i = 0; i < 5; i++) {
      const speed = 0.0035 + rnd(i, 1) * 0.002, span = h * 0.85;
      const t = ((p.frame * speed * h + rnd(i, 2) * span) % span) / span;
      const side = rnd(i, 3) < 0.5 ? -1 : 1;
      const mx = x + side * h * (0.2 + rnd(i, 5) * 0.16) + Math.sin(p.frame / 20 + i) * h * 0.02, my = Y(0.02) - t * span;
      const a = Math.sin(t * Math.PI) * (0.5 + 0.5 * rnd(i, 4));
      glow(ctx, B, mx, my, h * 0.025, cold, a * 0.6, '#ffffff');
      ctx.fillStyle = rgba('#ffffff', a * 0.8); ctx.fillRect(Math.round(mx), Math.round(my), 1, 1);
    }
  }
}

/**
 * The Cairn Wight, in units of the height up from the ground line: the hood's peak at 0.92, sunk
 * forward between hunched shoulders at 0.75, the face at 0.8, and the shroud from the shoulders to
 * the ground, wider at the hem. It sways about its hem where it stands, the hood most.
 */
function wight(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const t = p.frame, tone = p.tone;
  const sway = Math.sin(t / 37) * 0.012, stir = Math.sin(t / 23) * 0.006;
  const flare = 0.5 + 0.5 * Math.sin(t / 19), curl = 0.6 + 0.14 * Math.sin(t / 21);
  const X = (k: number) => x + h * k, Y = (k: number) => y - h * k;
  /** How far a point at height ky sways over, and points in units, swaying so, to the canvas. */
  const lean = (ky: number): number => sway * Math.max(0, ky - 0.1);
  const S = (pts: readonly number[]): number[] => pts.map((v, i) => (i % 2 ? Y(v) : X(v + lean(pts[i + 1]))));
  const at = (ky: number): K => (k: number) => x + h * (k + lean(ky));
  const linen = p.base, deep = shade(mix(p.dark, '#241c14', 0.45), 1), lit = mix(p.light, '#f2eee2', 0.3);
  const soil = shade('#3a2e20', tone), stain = shade('#6a5a40', tone), band = mix(p.dark, '#3e3428', 0.5);
  const bone = shade(mix('#cfc2a2', '#8a7c62', 0.25), tone);
  const gold = shade('#e0b44a', Math.max(0.6, tone)), goldD = shade('#7a5618', Math.max(0.6, tone));
  const voidHex = shade('#0b0810', Math.max(0.55, tone)), cold = '#d4f2c8';
  groundShadow(ctx, X(0), y + 1, h * 0.46);

  // 1. The far claw, out of the shroud's far side, a step darker; the shroud's edge goes over its root.
  claw(ctx, at(0.53), Y, h, -0.214, 0.53, -1, curl + 0.18, shade(bone, 0.84));

  // 2. The shroud: hood, hunched shoulders and the fall to the ground in one, the near arm reaching
  //    out of it in a fold of its own, and a fold over the far arm. The hem is torn into strips that
  //    drag, and stir a little.
  const body = [
    0.02, 0.915, 0.07, 0.9, 0.105, 0.86, 0.12, 0.8, 0.112, 0.752,
    0.15, 0.756, 0.186, 0.722, 0.198, 0.66, 0.19, 0.55, 0.18, 0.42, 0.185, 0.28, 0.2, 0.14,
    0.216 + stir, 0.04, 0.2, -0.004, 0.178, 0.07, 0.15 + stir, -0.004, 0.122, 0.052, 0.098 + stir, -0.006, 0.07, 0.078,
    0.04 + stir, -0.004, 0.01, 0.046, -0.024 + stir, -0.006, -0.055, 0.082, -0.09 + stir, -0.004, -0.12, 0.05,
    -0.15 + stir, -0.006, -0.174, 0.062, -0.198, 0.004,
    -0.19, 0.14, -0.178, 0.32, -0.18, 0.5, -0.194, 0.62, -0.19, 0.69,
    -0.164, 0.742, -0.122, 0.768, -0.09, 0.8, -0.088, 0.85, -0.06, 0.895,
  ];
  const shroud: Part[] = [
    { k: 'curve', pts: S(body), wobble: 0.006, seed: 201, sub: 2 },
    { k: 'curve', pts: S([0.15, 0.74, 0.196, 0.712, 0.232, 0.64, 0.254, 0.545, 0.252, 0.476, 0.216, 0.468, 0.208, 0.522, 0.176, 0.5, 0.166, 0.6]), wobble: 0.02, seed: 203, sub: 2 },
    { k: 'curve', pts: S([-0.16, 0.738, -0.208, 0.68, -0.232, 0.59, -0.228, 0.54, -0.194, 0.534, -0.18, 0.6]), wobble: 0.02, seed: 205, sub: 2 },
  ];
  blob(ctx, B, linen, shroud, { h, tex: 'folds', seed: 207, amount: 0.7, formK: 0.3, spread: 0.7, creases: [
    { x0: X(0.1 + lean(0.6)), y0: Y(0.6), x1: X(0.12), y1: Y(0.09), r: h * 0.02, a: 0.38 },     // the folds of the fall
    { x0: X(-0.02 + lean(0.56)), y0: Y(0.56), x1: X(-0.03), y1: Y(0.07), r: h * 0.018, a: 0.3 },
    { x0: X(-0.12 + lean(0.62)), y0: Y(0.62), x1: X(-0.13), y1: Y(0.1), r: h * 0.02, a: 0.34 },
    { x0: X(0.16 + lean(0.7)), y0: Y(0.7), x1: X(0.17 + lean(0.5)), y1: Y(0.5), r: h * 0.02, a: 0.45 },  // under the reaching arm
    { x0: X(0.218 + lean(0.49)), y0: Y(0.49), x1: X(0.248 + lean(0.49)), y1: Y(0.488), r: h * 0.012, a: 0.7 }, // the dark inside the cuff
    { x0: X(-0.12 + lean(0.77)), y0: Y(0.77), x1: X(0.13 + lean(0.77)), y1: Y(0.765), r: h * 0.022, a: 0.3 },  // the hood sunk in the shoulders
  ] });
  if (!B.override) {
    // The cairn's soil, dark along the dragging hem, and the grave's stains on the linen.
    ctx.save(); ctx.beginPath(); appendCurve(ctx, lumpy(S(body), 0.006, 201, 2)); ctx.clip();
    const g = ctx.createLinearGradient(0, Y(0), 0, Y(0.26));
    g.addColorStop(0, rgba(soil, 0.78)); g.addColorStop(1, rgba(soil, 0));
    ctx.fillStyle = g; ctx.fillRect(X(-0.3), Y(0.28), h * 0.6, h * 0.3);
    ctx.restore();
    patch(ctx, B, stain, [{ k: 'ell', x: X(0.07 + lean(0.36)), y: Y(0.36), rx: h * 0.045, ry: h * 0.06, rot: 0.4 }], { alpha: 0.32, feather: 0.8 });
    patch(ctx, B, stain, [{ k: 'ell', x: X(-0.06 + lean(0.66)), y: Y(0.66), rx: h * 0.035, ry: h * 0.03 }], { alpha: 0.26, feather: 0.8 });
    // Light on the hood and the shoulder the light falls on, and a shadow down the far side.
    patch(ctx, B, lit, [{ k: 'ell', x: X(-0.03 + lean(0.87)), y: Y(0.87), rx: h * 0.04, ry: h * 0.045, rot: 0.3 }], { alpha: 0.4, feather: 0.85 });
    patch(ctx, B, lit, [{ k: 'ell', x: X(-0.13 + lean(0.71)), y: Y(0.71), rx: h * 0.035, ry: h * 0.045 }], { alpha: 0.28, feather: 0.9 });
    patch(ctx, B, deep, [{ k: 'ell', x: X(0.13 + lean(0.52)), y: Y(0.52), rx: h * 0.04, ry: h * 0.16 }], { alpha: 0.3, feather: 1 });
  }

  // 3. The bands it is wound in, round and round from the shoulder down, the last end hanging loose.
  const bands: Part[] = [];
  for (const [yl, yr] of [[0.66, 0.6], [0.45, 0.39], [0.26, 0.2]] as const) {
    bands.push({ k: 'tube', pts: S([-0.19, yl, -0.06, (yl * 2 + yr) / 3 - 0.012, 0.06, (yl + yr * 2) / 3 - 0.012, 0.188, yr]), r0: h * 0.011, r1: h * 0.011 });
  }
  bands.push({ k: 'tube', pts: S([0.186, 0.2, 0.206 + stir, 0.14, 0.198 + stir * 1.5, 0.07]), r0: h * 0.009, r1: h * 0.006, wobble: 0.1, seed: 209 });
  blob(ctx, B, band, bands, { h, formK: 0.4, spread: 0.7 });

  // 4. The face: a hole in the front of the hood, its top darkened by the hood's overhang.
  const fx = 0.016 + lean(0.8), fy = 0.8;
  blob(ctx, B, voidHex, [{ k: 'curve', pts: [
    X(fx + 0.05), Y(fy - 0.02), X(fx + 0.054), Y(fy + 0.024), X(fx + 0.036), Y(fy + 0.062), X(fx - 0.004), Y(fy + 0.08),
    X(fx - 0.042), Y(fy + 0.058), X(fx - 0.054), Y(fy + 0.02), X(fx - 0.044), Y(fy - 0.024), X(fx - 0.004), Y(fy - 0.042),
  ], wobble: 0.04, seed: 211, sub: 2 }], { outline: false, form: false, spread: 0.35 });
  if (!B.override) {
    softLine(ctx, B, [X(fx - 0.058), Y(fy + 0.01), X(fx - 0.046), Y(fy + 0.064), X(fx - 0.004), Y(fy + 0.09), X(fx + 0.04), Y(fy + 0.072)], lit, h * 0.012, 0.5);
    softLine(ctx, B, [X(fx - 0.05), Y(fy - 0.03), X(fx), Y(fy - 0.05), X(fx + 0.05), Y(fy - 0.03)], linen, h * 0.016, 0.5);
  }
  // Two cold points far back in it, the near one larger and lower.
  for (const [ex, ey, r, bloom] of [[fx + 0.022, fy + 0.008, 0.0095, 1], [fx - 0.018, fy + 0.018, 0.007, 0.7]] as const) {
    glow(ctx, B, X(ex), Y(ey), h * (0.02 + 0.018 * flare) * bloom, cold, 0.3 + 0.4 * flare, '#ffffff');
    ctx.beginPath(); ctx.ellipse(X(ex), Y(ey), h * r, h * r * 0.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = B.col(mix(cold, '#ffffff', 0.3 + 0.5 * flare)); ctx.fill();
  }

  // 5. The torc: the hill folk's gold round its throat, twisted like a rope, the two knobbed ends
  //    meeting at the front with a gap between.
  const tx = 0.016 + lean(0.73), ty = 0.718;
  const halves = [[tx - 0.09, ty + 0.042, tx - 0.074, ty + 0.018, tx - 0.044, ty + 0.004, tx - 0.018, ty], [tx + 0.018, ty, tx + 0.044, ty + 0.004, tx + 0.076, ty + 0.018, tx + 0.094, ty + 0.042]];
  const torc: Part[] = halves.map((pts) => ({ k: 'tube', pts: pts.map((v, i) => (i % 2 ? Y(v) : X(v))), r0: h * 0.013, r1: h * 0.013 }));
  torc.push({ k: 'ball', x: X(tx - 0.016), y: Y(ty), r: h * 0.019 }, { k: 'ball', x: X(tx + 0.016), y: Y(ty), r: h * 0.019 });
  blob(ctx, B, gold, torc, { h, formK: 0.45, spread: 0.6, gloss: 0.6 });
  if (!B.override && h >= 40) {
    // The twist, as dark ticks across the gold, and a glint that runs round it now and then.
    for (const pts of halves) for (let i = 0; i < 3; i++) {
      const a = i / 3 + 0.12, k = Math.floor(a * 3), f = a * 3 - k, x0 = pts[k * 2] + (pts[k * 2 + 2] - pts[k * 2]) * f, y0 = pts[k * 2 + 1] + (pts[k * 2 + 3] - pts[k * 2 + 1]) * f;
      softLine(ctx, B, [X(x0 - 0.006), Y(y0 + 0.009), X(x0 + 0.006), Y(y0 - 0.009)], goldD, Math.max(1, h * 0.006), 0.7);
    }
    const gt = (t % 90) / 90;
    if (gt < 0.3) glow(ctx, B, X(tx - 0.08 + gt / 0.3 * 0.16), Y(ty + 0.01 + Math.abs(gt / 0.3 - 0.5) * 0.04), h * 0.022, '#fff4c0', 0.8 * Math.sin(gt / 0.3 * Math.PI), '#ffffff');
  }

  // 6. The near claw, out of the reaching fold, in front of everything.
  claw(ctx, at(0.47), Y, h, 0.236, 0.47, 1, curl, bone);
}
