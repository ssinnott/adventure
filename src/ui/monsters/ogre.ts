// The ogre: a stooped, top-heavy brute leaning on a knotted club whose head is on the ground. The
// hide is one painted mass -- barrel chest, heavy gut, a short thick neck and a heavy skull, with
// the near leg -- and the far limbs behind it a step darker, the near arm in front as its own mass,
// so the arms break the torso silhouette instead of drowning in it. A short ragged kilt on a rope
// belt leaves the bowed legs showing.
//
// It used to be four and a bit heads tall with a ball for a skull and no mouth at all: two ivory
// triangles floated under a dark smear of nose, and the club was a straight board of one thickness
// crossing the whole body, three grey dots down it like rivets. A club is a tree limb -- a gnarled
// head several times the grip, knots where branches were cut, and a taper between them.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import { blob, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['ogre'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  ogre(ctx, x, y, h, p);
};

/** Stable 0..1 noise; never seeded from the frame, or the contour would boil. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/** A ring of n points around (cx, cy), optionally wider below (`fat`) or taller above (`top`). */
function ring(cx: number, cy: number, r: number, n = 10, fat = 0, top = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, s = Math.sin(a);
    const rr = r * (1 + fat * Math.max(0, s) + top * Math.max(0, -s));
    o.push(cx + Math.cos(a) * r, cy + s * rr);
  }
  return o;
}

/**
 * A torn hem as a sharp-cornered polygon: a flat top edge, then a walk back along the bottom
 * alternating shallow notches and points of uneven length, so nothing reads as an even scallop.
 */
function tatters(x0: number, x1: number, ytop: number, ybase: number, n: number, seed: number, depth: number): number[] {
  const pts: number[] = [x0, ytop, x1, ytop];
  for (let i = n - 1; i >= 0; i--) {
    const xa = x0 + ((x1 - x0) * (i + 1)) / n, xb = x0 + ((x1 - x0) * i) / n;
    const xm = xa + (xb - xa) * (0.35 + nz(seed, i) * 0.3);
    pts.push(xa, ybase - depth * (0.1 + nz(seed, i + 64) * 0.4));
    pts.push(xm, ybase + depth * (0.2 + nz(seed, i + 128) * 1.0));
  }
  pts.push(x0, ybase - depth * 0.2);
  return pts;
}

function ogre(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const X = (k: number) => x + h * k, Y = (k: number) => y - h * k;
  const b = p.breathe * h * 0.011;                   // a heavy breath: the shoulders and head rise
  const sw = Math.sin(p.frame / 45) * h * 0.006;     // a slow lean on the club
  const tone = p.tone;
  const leather = shade('#5a3c22', tone), wrap = shade('#3a2c1c', tone), wood = shade('#4e3a22', tone);
  const rope = shade('#8e7a4c', tone), ivory = shade('#efe6cf', tone), farHex = shade(p.dark, 0.74);
  const iron = shade('#7d838c', tone), gum = shade('#2a1a1e', tone);
  const Ys = Y(0.775) - b;                           // the shoulder line: high, and hunched
  const hy = Y(0.868) - b, hr = h * 0.105;           // the head centre and radius
  // Everything on the skull is laid out in head-radius units around (hx, hy) so the face cannot
  // drift off it: P maps (right, down) in those units to the canvas.
  const hx = X(0.022);
  const P = (px: number, py: number): [number, number] => [hx + px * hr, hy + py * hr];
  const M = (a: readonly number[]): number[] => { const o: number[] = []; for (let i = 0; i < a.length; i += 2) o.push(...P(a[i], a[i + 1])); return o; };

  groundShadow(ctx, X(0.03), y + 1, h * 0.7);

  // 1. The far limbs, behind the hide. An arm and a leg are two things, so they are two masses: in
  //    one blob they unioned from shoulder to floor into a single dark slab that read as a cloak
  //    and swallowed the hand. The leg goes down first, then the arm hangs over it, a step lighter.
  blob(ctx, B, farHex, [
    { k: 'tube', pts: [X(-0.08), Y(0.425), X(-0.206), Y(0.222), X(-0.158), Y(0.055)], r0: h * 0.086, r1: h * 0.048, wobble: 0.05, seed: 23 },
    { k: 'ell', x: X(-0.204), y: Y(0.218), rx: h * 0.064, ry: h * 0.052, rot: -0.2 },
    { k: 'curve', pts: [X(-0.272), Y(0.012), X(-0.282), Y(0.052), X(-0.218), Y(0.082), X(-0.122), Y(0.074), X(-0.092), Y(0.04), X(-0.132), Y(0.01)], wobble: 0.05, seed: 24, sub: 2 },
  ], { h, formK: 0.5, creases: [
    { x0: X(-0.152), y0: Y(0.232), x1: X(-0.168), y1: Y(0.172), r: h * 0.019, a: 0.42 },    // far knee
  ] });
  softLine(ctx, B, [X(-0.262), Y(0.722), X(-0.246), Y(0.6), X(-0.25), Y(0.5)], shade(p.dark, 0.85), h * 0.038, 0.4);
  blob(ctx, B, shade(farHex, 1.07), [
    { k: 'tube', pts: [X(-0.22), Y(0.77) - b, X(-0.326), Y(0.642), X(-0.346), Y(0.536)], r0: h * 0.064, r1: h * 0.044, wobble: 0.06, seed: 21 },
    { k: 'tube', pts: [X(-0.346), Y(0.54), X(-0.322), Y(0.435), X(-0.294), Y(0.332)], r0: h * 0.044, r1: h * 0.038, wobble: 0.06, seed: 22 },
    { k: 'curve', pts: ring(X(-0.286), Y(0.278), h * 0.055, 9, 0.12), wobble: 0.1, seed: 29, sub: 2 },
  ], { h, formK: 0.55, creases: [
    { x0: X(-0.302), y0: Y(0.585), x1: X(-0.332), y1: Y(0.505), r: h * 0.019, a: 0.45 },    // inside the far elbow
    { x0: X(-0.312), y0: Y(0.325), x1: X(-0.26), y1: Y(0.307), r: h * 0.012, a: 0.4 },      // the knuckles
  ] });

  // 2. The hide: torso, gut, neck, skull, ears, near leg and foot -- one mass. The skull is cut by
  //    hand rather than taken off a ring: a low crown, a brow shelf standing out over the eyes, the
  //    cheekbones flaring under it and a jaw that juts. A ball with a fat lower half is a baby.
  const hide: Part[] = [
    { k: 'curve', pts: [
      X(-0.156), Y(0.80) - b, X(-0.224), Y(0.778) - b, X(-0.258), Y(0.71), X(-0.254), Y(0.615),
      X(-0.244), Y(0.505), X(-0.198), Y(0.425), X(0.212), Y(0.425), X(0.256), Y(0.505),
      X(0.268), Y(0.615), X(0.27), Y(0.71), X(0.242), Y(0.778) - b, X(0.18), Y(0.80) - b, X(0.02), Y(0.782) - b,
    ], wobble: 0.035, seed: 1, sub: 3 },
    { k: 'ell', x: X(0.012), y: Y(0.515) + b * 0.4, rx: h * 0.238, ry: h * 0.122 },
    { k: 'cap', x0: X(0.008), y0: Y(0.745), x1: X(0.026), y1: Y(0.835) - b * 0.6, r0: h * 0.074, r1: h * 0.066 },
    { k: 'curve', pts: M([
      -0.08, -1.20, 0.40, -1.08, 0.78, -0.72, 0.98, -0.20, 0.88, 0.14, 1.04, 0.46, 0.94, 0.92,
      0.60, 1.22, 0.08, 1.32, -0.46, 1.20, -0.82, 0.88, -0.96, 0.44, -0.84, 0.14, -0.94, -0.20,
      -0.84, -0.70, -0.52, -1.06,
    ]), wobble: 0.055, seed: 5, sub: 2 },
    { k: 'ell', x: P(1.1, 0.3)[0], y: P(1.1, 0.3)[1], rx: hr * 0.27, ry: hr * 0.44, rot: 0.4 },
    { k: 'ell', x: P(-1.06, 0.3)[0], y: P(-1.06, 0.3)[1], rx: hr * 0.25, ry: hr * 0.42, rot: -0.4 },
    { k: 'tube', pts: [X(0.098), Y(0.425), X(0.216), Y(0.222), X(0.166), Y(0.055)], r0: h * 0.092, r1: h * 0.05, wobble: 0.05, seed: 8 },
    { k: 'ell', x: X(0.214), y: Y(0.218), rx: h * 0.068, ry: h * 0.054, rot: 0.2 },
    { k: 'curve', pts: [X(0.078), Y(0.01), X(0.068), Y(0.052), X(0.142), Y(0.084), X(0.252), Y(0.076), X(0.28), Y(0.038), X(0.232), Y(0.008)], wobble: 0.05, seed: 9, sub: 2 },
  ];
  blob(ctx, B, p.base, hide, { h, tex: 'stipple', seed: 11, amount: 0.28, formK: 0.55, creases: [
    { x0: X(-0.056), y0: Y(0.802) - b, x1: X(-0.126), y1: Y(0.756) - b, r: h * 0.024, a: 0.55 },  // far side of the neck
    { x0: X(0.094), y0: Y(0.806) - b, x1: X(0.154), y1: Y(0.762) - b, r: h * 0.024, a: 0.5 },      // near side
    { x0: X(-0.198), y0: Y(0.778) - b, x1: X(-0.246), y1: Y(0.66), r: h * 0.026, a: 0.36 },    // far trapezius
    { x0: X(0.216), y0: Y(0.784) - b, x1: X(0.258), y1: Y(0.665), r: h * 0.026, a: 0.36 },     // near trapezius
    { x0: X(-0.15), y0: Y(0.58), x1: X(0.176), y1: Y(0.565), r: h * 0.024, a: 0.22 },          // the gut fold
    { x0: X(0.136), y0: Y(0.24), x1: X(0.156), y1: Y(0.175), r: h * 0.02, a: 0.5 },            // behind the near knee
    { x0: X(0.186), y0: Y(0.052), x1: X(0.196), y1: Y(0.016), r: h * 0.008, a: 0.4 },          // toes
    { x0: X(0.228), y0: Y(0.052), x1: X(0.236), y1: Y(0.016), r: h * 0.008, a: 0.4 },
  ] });

  // 3. Paler belly, chest and jaw, inside the hide with no line.
  blob(ctx, B, p.light, [
    { k: 'ell', x: X(0.012), y: Y(0.495) + b * 0.4, rx: h * 0.148, ry: h * 0.078 },
    { k: 'ell', x: X(-0.086), y: Y(0.688), rx: h * 0.092, ry: h * 0.05, rot: 0.14 },
    { k: 'ell', x: X(0.112), y: Y(0.692), rx: h * 0.094, ry: h * 0.052, rot: -0.14 },
    { k: 'curve', pts: M([-0.64, 0.66, 0.0, 0.52, 0.7, 0.64, 0.62, 1.04, 0.04, 1.2, -0.52, 1.02]), wobble: 0.04, seed: 6, sub: 2 },
  ], { outline: false, formK: 0.3 });
  // The shadow under the pectorals, and the cleft between them: without these the chest and the gut
  // are one pale mass however carefully they are shaped.
  softLine(ctx, B, [X(-0.176), Y(0.672), X(-0.09), Y(0.632), X(0.012), Y(0.626), X(0.116), Y(0.634), X(0.206), Y(0.678)], p.dark, h * 0.02, 0.38);
  softLine(ctx, B, [X(0.014), Y(0.722), X(0.016), Y(0.648)], p.dark, h * 0.016, 0.4);

  // 4. The kilt: a rope belt knotted at the near hip and a genuinely torn hem. Its top edge used to
  //    be a level band with the rope a straight lit stripe along it, which read as a barrel hoop.
  blob(ctx, B, leather, [
    { k: 'curve', pts: [X(-0.212), Y(0.452), X(-0.09), Y(0.418), X(0.05), Y(0.412), X(0.17), Y(0.432), X(0.246), Y(0.466), X(0.262), Y(0.4), X(0.0), Y(0.372), X(-0.232), Y(0.386)], wobble: 0.05, seed: 12, sub: 3 },
    { k: 'poly', pts: tatters(X(-0.236), X(0.256), Y(0.42), Y(0.368), 7, 5, h * 0.072) },
    { k: 'poly', pts: [X(-0.236), Y(0.40), X(-0.15), Y(0.396), X(-0.138), Y(0.286), X(-0.186), Y(0.316), X(-0.204), Y(0.258)] },
  ], { h, tex: 'folds', seed: 14, amount: 0.55, formK: 0.3, spread: 0.85, creases: [
    { x0: X(-0.148), y0: Y(0.43), x1: X(-0.168), y1: Y(0.29), r: h * 0.016, a: 0.5 },   // the lapped edge
    { x0: X(-0.062), y0: Y(0.418), x1: X(-0.042), y1: Y(0.35), r: h * 0.014, a: 0.3 },
    { x0: X(0.058), y0: Y(0.416), x1: X(0.042), y1: Y(0.352), r: h * 0.013, a: 0.28 },
    { x0: X(0.184), y0: Y(0.446), x1: X(0.2), y1: Y(0.372), r: h * 0.014, a: 0.32 },
  ] });
  // The rope, sagging between the hips and knotted on the near one, with two ends hanging off it.
  ctx.strokeStyle = B.col(rope); ctx.lineWidth = Math.max(1, h * 0.026); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X(-0.212), Y(0.454)); ctx.quadraticCurveTo(X(-0.01), Y(0.404), X(0.246), Y(0.468)); ctx.stroke();
  ctx.strokeStyle = B.col(rgba(shade(rope, 1.3), 0.45)); ctx.lineWidth = Math.max(1, h * 0.007);
  ctx.beginPath(); ctx.moveTo(X(-0.202), Y(0.46)); ctx.quadraticCurveTo(X(-0.01), Y(0.41), X(0.236), Y(0.474)); ctx.stroke();
  blob(ctx, B, rope, [
    { k: 'ell', x: X(0.15), y: Y(0.446), rx: h * 0.026, ry: h * 0.02, rot: 0.3 },
    { k: 'tube', pts: [X(0.152), Y(0.444), X(0.178), Y(0.404), X(0.168), Y(0.362)], r0: h * 0.011, r1: h * 0.007, wobble: 0.08, seed: 41 },
    { k: 'tube', pts: [X(0.142), Y(0.444), X(0.124), Y(0.402), X(0.134), Y(0.366)], r0: h * 0.01, r1: h * 0.007, wobble: 0.08, seed: 42 },
  ], { h, formK: 0.55 });
  // The gut's overhang onto the kilt, and the kilt's onto the thighs.
  softLine(ctx, B, [X(-0.19), Y(0.436), X(-0.02), Y(0.408), X(0.176), Y(0.428)], shade(leather, 0.7), h * 0.016, 0.5);
  softLine(ctx, B, [X(-0.115), Y(0.352), X(-0.085), Y(0.3)], p.dark, h * 0.03, 0.35);
  softLine(ctx, B, [X(0.092), Y(0.352), X(0.116), Y(0.3)], p.dark, h * 0.03, 0.35);
  // Shin wraps: dark bands, no ink.
  for (let i = 0; i < 3; i++) {
    const t = 0.14 - i * 0.042, sxN = 0.166 + (t - 0.055) * 0.32, sxF = -0.158 - (t - 0.055) * 0.32;
    softLine(ctx, B, [X(sxN - 0.058), Y(t) + h * 0.008, X(sxN + 0.058), Y(t) - h * 0.004], wrap, h * 0.013, 0.55);
    softLine(ctx, B, [X(sxF - 0.056), Y(t) - h * 0.004, X(sxF + 0.056), Y(t) + h * 0.008], wrap, h * 0.013, 0.5);
  }

  // 5. The near arm, its own mass in front of the torso: a contact shadow under the shoulder first,
  //    then the upper arm swung out past the ribs and the forearm hanging down to the club.
  softLine(ctx, B, [X(0.272), Y(0.726), X(0.254), Y(0.6), X(0.258), Y(0.5)], p.dark, h * 0.042, 0.4);
  const fx = X(0.294 + sw * 0.1), fy = Y(0.33);
  blob(ctx, B, p.base, [
    { k: 'tube', pts: [X(0.23), Y(0.776) - b, X(0.334), Y(0.648), X(0.352), Y(0.542)], r0: h * 0.066, r1: h * 0.044, wobble: 0.06, seed: 30 },
    { k: 'tube', pts: [X(0.352), Y(0.546), X(0.328), Y(0.44), X(0.3), Y(0.34)], r0: h * 0.044, r1: h * 0.038, wobble: 0.06, seed: 31 },
  ], { h, tex: 'stipple', seed: 36, amount: 0.22, formK: 0.6, creases: [
    { x0: X(0.3), y0: Y(0.585), x1: X(0.348), y1: Y(0.522), r: h * 0.021, a: 0.5 },    // the inside of the elbow
    { x0: X(0.268), y0: Y(0.36), x1: X(0.322), y1: Y(0.36), r: h * 0.012, a: 0.4 },    // the wrist
  ] });

  // 6. The club: a tree limb with its head on the ground and the ogre leaning on it. The head is
  //    two and a half times the grip and lumpy with it, there are knots where branches were cut,
  //    and iron is driven into the head -- spikes standing out of its edge, not studs on the shaft.
  const bux = X(0.204 + sw), buy = Y(0.522), cxh = X(0.37 + sw * 0.25), cyh = Y(0.082);
  const kn = (t: number, s: number): [number, number] => [bux + (cxh - bux) * t + (cyh - buy) * -s, buy + (cyh - buy) * t + (cxh - bux) * s];
  blob(ctx, B, wood, [
    { k: 'tube', pts: [bux, buy, X(0.296 + sw * 0.6), Y(0.30), X(0.358 + sw * 0.3), Y(0.14)], r0: h * 0.034, r1: h * 0.058, wobble: 0.12, seed: 17 },
    { k: 'ell', x: kn(0.3, 0.052)[0], y: kn(0.3, 0.052)[1], rx: h * 0.022, ry: h * 0.016, rot: 0.5 },
    { k: 'ell', x: kn(0.58, -0.05)[0], y: kn(0.58, -0.05)[1], rx: h * 0.02, ry: h * 0.015, rot: -0.4 },
    { k: 'curve', pts: ring(cxh, cyh, h * 0.084, 10, -0.12, 0.08), wobble: 0.16, spiky: 0.1, seed: 18, sub: 2 },
  ], { h, tex: 'cracks', seed: 19, amount: 0.7, formK: 0.6, creases: [
    { x0: kn(0.28, 0.03)[0], y0: kn(0.28, 0.03)[1], x1: kn(0.33, 0.055)[0], y1: kn(0.33, 0.055)[1], r: h * 0.012, a: 0.55 },
    { x0: kn(0.56, -0.03)[0], y0: kn(0.56, -0.03)[1], x1: kn(0.61, -0.052)[0], y1: kn(0.61, -0.052)[1], r: h * 0.011, a: 0.5 },
    { x0: X(0.325 + sw * 0.3), y0: Y(0.135), x1: X(0.402 + sw * 0.3), y1: Y(0.122), r: h * 0.014, a: 0.45 },
    { x0: kn(0.18, -0.038)[0], y0: kn(0.18, -0.038)[1], x1: kn(0.185, 0.038)[0], y1: kn(0.185, 0.038)[1], r: h * 0.008, a: 0.45 },
    { x0: kn(0.44, -0.044)[0], y0: kn(0.44, -0.044)[1], x1: kn(0.445, 0.044)[0], y1: kn(0.445, 0.044)[1], r: h * 0.008, a: 0.4 },
  ] });
  // Iron driven into the head, each spike a wedge standing out of its edge.
  ctx.fillStyle = B.col(iron); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = 1; ctx.lineJoin = 'round';
  for (const [ang, len] of [[-2.5, 0.05], [-1.9, 0.042], [-3.05, 0.046]] as const) {
    const dx = Math.cos(ang), dy = Math.sin(ang);
    const ox = cxh + dx * h * 0.07, oy = cyh + dy * h * 0.07;
    ctx.beginPath();
    ctx.moveTo(ox + dy * h * 0.016, oy - dx * h * 0.016);
    ctx.lineTo(ox + dx * h * len, oy + dy * h * len);
    ctx.lineTo(ox - dy * h * 0.016, oy + dx * h * 0.016);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // 6b. The fist closed over the shaft: three fingers across it and the thumb laid back over them.
  const grip: Part[] = [];
  const creases: Crease[] = [];
  for (let i = 0; i < 3; i++) {
    const d = (i - 1) * h * 0.036;
    grip.push({ k: 'tube', pts: [fx - h * 0.05, fy + d, fx + h * 0.032, fy + d + h * 0.004], r0: h * 0.019, r1: h * 0.016, wobble: 0.05, seed: 34 + i });
    creases.push({ x0: fx - h * 0.042, y0: fy + d + h * 0.018, x1: fx + h * 0.028, y1: fy + d + h * 0.02, r: h * 0.005, a: 0.6 });
  }
  grip.push({ k: 'tube', pts: [fx - h * 0.022, fy + h * 0.056, fx - h * 0.03, fy - h * 0.012], r0: h * 0.021, r1: h * 0.016, wobble: 0.05, seed: 33 });
  blob(ctx, B, p.base, grip, { h, formK: 0.65, creases });

  // 7. The face, cut as crisp shapes rather than built out of soft washes: translucent strokes on
  //    a flat hide stack into a pale headband and a pair of grey goggles, which is what the brow
  //    and the sockets had become. A brow SHELF lit along its top with the eyes in pits under it,
  //    a muzzle with a lit top plane and a dark underside, and a mouth that is a hole.
  const fill = (a: readonly number[], hex: string): void => {
    ctx.beginPath(); ctx.moveTo(...P(a[0], a[1]));
    for (let k = 2; k < a.length; k += 2) ctx.lineTo(...P(a[k], a[k + 1]));
    ctx.closePath(); ctx.fillStyle = B.col(hex); ctx.fill();
  };
  fill([-0.88, -0.10, -0.44, -0.30, 0.02, -0.34, 0.52, -0.27, 0.92, -0.07,
        0.86, 0.04, 0.46, -0.13, 0.00, -0.18, -0.44, -0.15, -0.82, 0.02], mix(p.light, '#ffffff', 0.15));
  softLine(ctx, B, M([-0.84, 0.04, -0.3, -0.08, 0.32, -0.08, 0.88, 0.06]), mix(p.dark, '#120c10', 0.35), hr * 0.14, 0.6);
  ctx.fillStyle = B.col(mix(p.dark, '#120c10', 0.45));
  for (const [sx, rt] of [[-0.46, 0.16], [0.5, -0.16]] as const) {
    const [ax, ay] = P(sx, 0.22); ctx.beginPath(); ctx.ellipse(ax, ay, hr * 0.33, hr * 0.27, rt, 0, Math.PI * 2); ctx.fill();
  }
  eye(ctx, ...P(-0.46, 0.22), hr * 0.17, p.amber, false);
  eye(ctx, ...P(0.5, 0.22), hr * 0.18, p.amber, false);
  // The muzzle: a lit top plane running off the brow, and the flat shaded underside it ends in.
  fill([-0.10, 0.10, 0.18, 0.10, 0.31, 0.60, -0.25, 0.60], mix(p.light, '#ffffff', 0.08));
  fill([-0.29, 0.56, 0.35, 0.56, 0.31, 0.74, -0.25, 0.74], mix(p.dark, p.base, 0.45));
  ctx.fillStyle = B.col(shade('#20161a', tone));
  for (const nx of [-0.15, 0.22]) { const [ax, ay] = P(nx, 0.665); ctx.beginPath(); ctx.ellipse(ax, ay, hr * 0.12, hr * 0.075, nx * 0.8, 0, Math.PI * 2); ctx.fill(); }
  // The mouth: a cavity, with the jaw's own shadow under it.
  ctx.fillStyle = B.col(gum);
  ctx.beginPath(); ctx.moveTo(...P(-0.8, 0.84));
  for (const [ax, ay] of [[-0.34, 0.96], [0.08, 1.0], [0.5, 0.95], [0.84, 0.82], [0.54, 1.12], [0.06, 1.18], [-0.4, 1.12]] as const) ctx.lineTo(...P(ax, ay));
  ctx.closePath(); ctx.fill();
  softLine(ctx, B, M([-0.6, 1.2, 0.04, 1.28, 0.66, 1.16]), p.dark, hr * 0.14, 0.4);
  // Two tusks from the lower jaw, standing up through the mouth line past the lip.
  ctx.fillStyle = B.col(ivory); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = 1; ctx.lineJoin = 'round';
  for (const [tx, tp] of [[-0.52, 0.58], [0.58, 0.52]] as const) {
    ctx.beginPath(); ctx.moveTo(...P(tx - 0.13, 1.12)); ctx.lineTo(...P(tx + 0.03, tp)); ctx.lineTo(...P(tx + 0.14, 1.1)); ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
  // Two smaller top teeth from the upper jaw, and a fold in each ear.
  ctx.fillStyle = B.col(mix(ivory, '#8a7f6a', 0.3));
  for (const tx of [-0.1, 0.2]) { ctx.beginPath(); ctx.moveTo(...P(tx - 0.09, 0.88)); ctx.lineTo(...P(tx + 0.09, 0.88)); ctx.lineTo(...P(tx + 0.06, 1.0)); ctx.lineTo(...P(tx - 0.06, 1.0)); ctx.closePath(); ctx.fill(); }
  softLine(ctx, B, M([1.08, 0.12, 1.16, 0.48]), p.dark, hr * 0.13, 0.45);
  softLine(ctx, B, M([-1.04, 0.12, -1.12, 0.48]), p.dark, hr * 0.13, 0.45);
}
