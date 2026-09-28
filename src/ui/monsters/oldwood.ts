// The old wood: the Deepthorn's trees, woken when the Grove Stone was cut. One kit the kinds
// reshape: bark as tubes with a cracked surface (a trunk, a limb, a root is a bending tube tapering
// toward its tip), a crown of an oak that keeps its dead leaves through the winter with moss in
// its lee, so the wood reads the same in any season the Deepthorn has, and a face that is only
// the bark's own: two knotholes lit from inside with a pale sap-light and a split below them.
// Everything is laid out in hundredths of the sprite's height up from the ground line, so a kind
// is a set of placements rather than a new drawing. The far roots and limbs go down first a step
// darker, the trunk over them, then the near ones, the crown and the face.
//
// Measured against the combat view, which nothing clips: a heartwood drawn inside 0.9 of its
// height sits under the frame alone and over three brambles, and roots stop at the ground line so
// nothing runs under the silhouette canvas.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glow, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bramble', 'rootwalker', 'heartwood', 'eldest'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'bramble') bramble(ctx, x, y, h, p);
  else if (kind === 'rootwalker') rootwalker(ctx, x, y, h, p);
  else if (kind === 'heartwood') heartwood(ctx, x, y, h * 0.9, p);
  else eldest(ctx, x, y, h * 0.84, p);
};

/** Stable 0..1 noise; never seeded from the frame, or the contour would boil. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/** The wood's colours: bark from the def's tint, the leaves and the moss fixed, the sap-light pale. */
interface Wood { bark: string; barkD: string; barkL: string; leaf: string; leafD: string; moss: string; hole: string; sap: string }
function wood(p: Paint): Wood {
  const bark = p.base;
  return {
    bark, barkD: shade(p.dark, 0.8), barkL: mix(bark, '#d8ccb0', 0.25),
    leaf: shade('#7e5430', p.tone), leafD: shade('#4c3220', p.tone), moss: shade('#6a7a3a', p.tone),
    hole: shade('#140e0a', p.tone), sap: '#d8f08a',
  };
}

/** A frame: x and y map hundredths of the height (x right, y up from the ground) to the canvas. */
interface F { u: number; X: (v: number) => number; Y: (v: number) => number; h: number }
function frame(x: number, y: number, h: number): F {
  const u = h / 100;
  return { u, h, X: (v) => x + v * u, Y: (v) => y - v * u };
}
/** A polyline given in frame units, as canvas points. */
function at(f: F, pts: readonly number[]): number[] {
  const o: number[] = [];
  for (let i = 0; i < pts.length; i += 2) o.push(f.X(pts[i]), f.Y(pts[i + 1]));
  return o;
}

/** Bark: tubes (trunk, limbs, roots) unioned as one mass with a cracked surface. */
function bark(ctx: CanvasRenderingContext2D, f: F, hex: string, tubes: readonly (readonly [readonly number[], number, number])[], seed: number, amount = 0.8): void {
  const parts: Part[] = tubes.map(([pts, r0, r1], i) => ({ k: 'tube', pts: at(f, pts), r0: r0 * f.u, r1: r1 * f.u, wobble: 0.05, seed: seed + i }));
  blob(ctx, B, hex, parts, { h: f.h, tex: 'cracks', seed, amount, formK: 0.45, spread: 0.75 });
}

/** A crown: clumps of dead oak leaves round (cx, cy), `rx` by `ry`, with moss in the lee below. */
function crown(ctx: CanvasRenderingContext2D, f: F, w: Wood, cx: number, cy: number, rx: number, ry: number, n: number, seed: number, sway: number): void {
  const back: Part[] = [], front: Part[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + nz(seed, i) * 0.6, k = 0.55 + nz(seed, i + 40) * 0.4;
    const px = cx + Math.cos(a) * rx * k + sway * (0.5 + Math.max(0, Math.sin(a)) * 0.5), py = cy + Math.sin(a) * ry * k;
    const r = Math.min(rx, ry) * (0.42 + nz(seed, i + 80) * 0.2);
    (Math.sin(a) > 0.2 ? back : front).push({ k: 'curve', pts: ring(f.X(px), f.Y(py), r * f.u, r * f.u * 0.85, 9), wobble: 0.14, spiky: 0.05, seed: seed + i, sub: 2 });
  }
  front.push({ k: 'curve', pts: ring(f.X(cx + sway), f.Y(cy), rx * 0.62 * f.u, ry * 0.6 * f.u, 11), wobble: 0.12, seed: seed + 99, sub: 2 });
  blob(ctx, B, w.leafD, back, { h: f.h, tex: 'stipple', seed, amount: 0.8, formK: 0.4 });
  blob(ctx, B, w.leaf, front, { h: f.h, tex: 'stipple', seed: seed + 1, amount: 1, formK: 0.45, spread: 0.8 });
  // Bare twigs through the dead leaves, so it reads as an oak and not a cloud.
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI * (0.15 + i * 0.23), tx = cx + Math.cos(a) * rx * 0.95 + sway, ty = cy - Math.sin(a) * ry * 1.05;
    softLine(ctx, B, at(f, [cx + Math.cos(a) * rx * 0.6 + sway, cy - Math.sin(a) * ry * 0.6, tx, ty, tx + Math.cos(a) * 3, ty - Math.sin(a) * 3 + 2]), w.barkD, Math.max(1, 1.3 * f.u), 0.9);
  }
}

/** A ring of n points round (cx, cy). */
function ring(cx: number, cy: number, rx: number, ry: number, n: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/**
 * The face: two knotholes under a heavy ridge of bark that runs down toward the middle, lit from
 * inside, and a ragged split below them for a mouth (`mouth` its depth, 0 for none).
 */
function face(ctx: CanvasRenderingContext2D, f: F, w: Wood, ex: number, ey: number, gap: number, r: number, p: Paint, mouth: number): void {
  const pulse = 0.5 + 0.5 * Math.sin(p.frame / 23);
  ctx.fillStyle = B.col(w.hole);
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.ellipse(f.X(ex + s * gap), f.Y(ey), r * f.u, r * 0.8 * f.u, s * 0.3, 0, Math.PI * 2); ctx.fill();
  }
  if (mouth > 0) {
    const w0 = gap * 1.1, my = ey - r * 2.6, top: number[] = [], bot: number[] = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6, mx = ex - w0 + t * 2 * w0, sag = Math.sin(t * Math.PI);
      top.push(mx, my + sag * mouth * 0.15 + (i % 2 ? -0.5 : 0.4) * r * 0.4);
      bot.unshift(mx, my - sag * mouth + (i % 2 ? 0.5 : -0.3) * r * 0.5);
    }
    ctx.beginPath(); const pts = at(f, [...top, ...bot]);
    ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.closePath(); ctx.fill();
  }
  for (const s of [-1, 1]) {
    glow(ctx, B, f.X(ex + s * gap), f.Y(ey), r * 2.4 * f.u, w.sap, 0.25 + 0.2 * pulse, '#f4ffd0');
    eye(ctx, f.X(ex + s * gap), f.Y(ey - r * 0.1), Math.max(0.8, r * 0.36 * f.u), mix(w.sap, '#ffffff', 0.3 + 0.3 * pulse), false);
  }
  // The brow: a ridge of bark over each eye, lowest at the middle, so the wood scowls.
  blob(ctx, B, w.bark, [-1, 1].map((s) => ({ k: 'poly', pts: at(f, [
    ex + s * (gap + r * 1.6), ey + r * 1.5, ex + s * r * 0.2, ey + r * 0.2, ex + s * r * 0.3, ey + r * 1.2, ex + s * (gap + r * 1.4), ey + r * 2.5,
  ]) }) as Part), { h: f.h, formK: 0.4, spread: 0.7 });
}

// ------------------------------------------------------------------ the bramble ----
/**
 * The bramble: a thicket that closes behind you. A low mound of canes arching over a dark heart,
 * thorned along every cane, with the two points of light down in the tangle. The canes stir as a
 * thing breathing would, and nothing of it is taller than a man's waist.
 */
function bramble(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const f = frame(x, y, h), w = wood(p), s = p.breathe * 1.2;
  groundShadow(ctx, x, y + 1, h * 0.55);
  const cane = mix(w.bark, '#2a3a1c', 0.35), caneD = shade(cane, 0.72);

  // The heart of the thicket: a dark mass the canes arch over, so the tangle has a body.
  blob(ctx, B, mix(w.hole, cane, 0.35), [{ k: 'curve', pts: at(f, [-36, 0, -32, 20, -20, 40, 0, 48, 18, 40, 32, 24, 38, 0]), wobble: 0.12, spiky: 0.06, seed: 3, sub: 3 }], { h, formK: 0.2 });

  // Canes, far and then near: each rises from the ground, arches and comes down again.
  const arch = (x0: number, x1: number, top: number, lean: number): number[] => {
    const m = (x0 + x1) / 2;
    return [x0, 0, x0 + (m - x0) * 0.3 + lean * 0.3, top * 0.7, m + lean, top, x1 - (x1 - m) * 0.3 + lean * 0.6, top * 0.72, x1, top * 0.12];
  };
  const far: Part[] = [], near: Part[] = [];
  const CANES: [number, number, number, number, 0 | 1][] = [
    [-36, 10, 46, -8, 0], [-8, 36, 50, 6, 0], [-26, 30, 56, 2, 0], [-38, -4, 34, -4, 0], [6, 38, 38, 5, 0], [-18, 20, 60, -6, 0],
    [-32, 22, 44, 7, 1], [-14, 38, 42, -9, 1], [-40, 4, 28, 6, 1], [4, 40, 30, -5, 1], [-22, 16, 52, s * 2 + 8, 1], [-4, 28, 48, -12, 1],
  ];
  for (const [i, [x0, x1, top, lean, n]] of CANES.entries()) {
    const pts = at(f, arch(x0, x1, top + (n ? s : s * 0.5), lean));
    (n ? near : far).push({ k: 'tube', pts, r0: 2 * f.u, r1: 1.1 * f.u, wobble: 0.1, seed: 20 + i });
  }
  blob(ctx, B, caneD, far, { h, formK: 0.3 });

  // Runners sprawling out along the ground from the mound, rooting where they touch.
  for (const [i, [x0, x1, top]] of ([[-20, -46, 16], [18, 46, 14], [-8, -40, 24], [10, 44, 22]] as const).entries()) {
    near.push({ k: 'tube', pts: at(f, [x0, top + 8, (x0 + x1) / 2, top + 6 + s, x1 * 0.92, top * 0.4, x1, 0]), r0: 2 * f.u, r1: 0.9 * f.u, wobble: 0.1, seed: 60 + i });
  }
  blob(ctx, B, cane, near, { h, formK: 0.35, gloss: 0.1 });
  // The two lights down in the tangle, seen between the canes.
  face(ctx, f, w, 2, 22, 6, 2.6, p, 0);
  // Thorns: hooked spurs along the near canes, touching them so the silhouette stays one piece.
  ctx.fillStyle = B.col(mix(cane, '#d8c8a0', 0.3));
  for (const [i, [x0, x1, top, lean, n]] of CANES.entries()) {
    if (!n) continue;
    const pts = arch(x0, x1, top + s, lean);
    for (let k = 0; k < 4; k++) {
      const j = (k % 4) * 2, a = pts[j], b = pts[j + 1], c = pts[j + 2], d = pts[j + 3], t = 0.3 + nz(i, k) * 0.4;
      const tx = a + (c - a) * t, ty = b + (d - b) * t, side = nz(i, k + 9) > 0.5 ? 1 : -1;
      const L = Math.hypot(c - a, d - b) || 1, nx = -(d - b) / L * side, ny = (c - a) / L * side;
      ctx.beginPath();
      ctx.moveTo(f.X(tx - (c - a) / L * 1.4), f.Y(ty - (d - b) / L * 1.4));
      ctx.lineTo(f.X(tx + nx * 4.2 + (c - a) / L * 1.2), f.Y(ty + ny * 4.2 + (d - b) / L * 1.2));
      ctx.lineTo(f.X(tx + (c - a) / L * 1.4), f.Y(ty + (d - b) / L * 1.4));
      ctx.closePath(); ctx.fill();
    }
  }
  // A few leaves the winter left on it, dark and leathery.
  const leaves: Part[] = [];
  for (const [lx, ly, r] of [[-20, 44, 2.8], [14, 36, 2.6], [28, 24, 2.4], [-30, 26, 2.4], [-6, 50, 2.6], [22, 40, 2.2], [-34, 12, 2.2]] as const) leaves.push({ k: 'ell', x: f.X(lx), y: f.Y(ly + s * 0.6), rx: r * f.u, ry: r * 0.55 * f.u, rot: nz(lx, ly) - 0.5 });
  blob(ctx, B, shade(mix(w.moss, w.leafD, 0.5), 0.8), leaves, { h, formK: 0.3, outline: false });
}

// ---------------------------------------------------------------- the rootwalker ----
/**
 * The rootwalker: a stump walking on its roots, its bark like plate. A barrel of trunk cut off
 * short, its broken top ragged and hollow, carried on four roots bent at the knee like a spider's
 * legs, with two stubs of branch for arms; the bark lies in heavy plates with dark seams between.
 * It walks with a slow rock from root to root.
 */
function rootwalker(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const f = frame(x, y, h), w = wood(p);
  const rock = Math.sin(p.frame / 17) * 1.2, lift = Math.max(0, Math.sin(p.frame / 17)) * 2;
  const b = 20 + p.breathe * 0.6;                                      // the underside of the trunk
  groundShadow(ctx, x, y + 1, h * 0.55);

  // The far roots, then the far arm, a step darker: each root goes out, bends and comes down.
  bark(ctx, f, w.barkD, [
    [[-8, b + 4, -22, b + 16, -34, 14, -36, 0], 3.6, 1.2],
    [[8, b + 4, 22, b + 18 + lift, 34, 16 + lift, 38, 0 + lift], 3.4, 1.2],
    [[-15, 50, -25, 46, -31 + rock * 0.3, 36], 3.4, 1.6],
  ], 31, 0.6);
  // The trunk: a barrel wider at the foot, the top broken off in a ragged rim.
  const top = 66 + p.breathe * 0.5;
  blob(ctx, B, w.bark, [{ k: 'curve', pts: at(f, [
    -18, b - 1, -19, 34, -17, 52, -16, top - 4, -12, top + 2, -7, top - 3, -2, top + 5, 3, top - 1, 8, top + 3, 12, top - 3, 16, top - 1,
    17, 52, 19, 34, 18, b - 1, 8, b - 3, -6, b - 3,
  ].map((v, i) => i % 2 === 0 ? v + rock * 0.2 : v)), wobble: 0.03, seed: 41, sub: 2 }], { h, tex: 'cracks', seed: 41, amount: 1.1, formK: 0.5, spread: 0.7 });
  // The plates: dark seams that break the bark into heavy scales, lit on their upper edges.
  const seams: number[][] = [[-17, 31, -9, 35, -2, 32], [2, 30, 10, 34, 18, 31], [-16, 47, -8, 50, 1, 47], [5, 49, 12, 46, 17, 49], [-11, 22, -13, 33], [-1, 21, 0, 31], [8, 34, 9, 46], [-9, 35, -7, 49], [-4, 51, -6, 61], [6, 50, 8, 60]];
  for (const sm of seams) softLine(ctx, B, at(f, sm.map((v, i) => i % 2 === 0 ? v + rock * 0.2 : v)), w.barkD, Math.max(1, 1.6 * f.u), 0.75);
  // The hollow of the broken top, and a green shoot the stump has kept.
  ctx.fillStyle = B.col(w.hole);
  ctx.beginPath(); ctx.ellipse(f.X(0 + rock * 0.2), f.Y(top - 2), 10 * f.u, 2.6 * f.u, 0, 0, Math.PI * 2); ctx.fill();
  bark(ctx, f, w.moss, [[[9 + rock * 0.2, top, 13, top + 8, 18, top + 11], 1.4, 0.8]], 43, 0);
  patch(ctx, B, w.moss, [{ k: 'ell', x: f.X(-10 + rock * 0.2), y: f.Y(top - 8), rx: 6 * f.u, ry: 3 * f.u }], { alpha: 0.6 });

  face(ctx, f, w, 1 + rock * 0.2, 44, 6, 2.8, p, 3);

  // The near roots and the near arm, over the trunk's foot.
  bark(ctx, f, w.bark, [
    [[-12, b + 2, -20, b + 14 + lift, -24, 12 + lift, -22, 0 + lift], 4.2, 1.4],
    [[12, b + 2, 22, b + 14, 26, 12, 24, 0], 4.2, 1.4],
    [[16, 50, 27, 45, 32 - rock * 0.3, 36], 3.8, 1.8],
  ], 51, 0.7);
  // Twig claws at the end of the near arm.
  for (const [dx, dy] of [[5, -4], [2, -7], [-1, -6]] as const) softLine(ctx, B, at(f, [32 - rock * 0.3, 36, 32 - rock * 0.3 + dx, 36 + dy]), w.barkD, Math.max(1, 1.5 * f.u), 0.9);
}

// ----------------------------------------------------------------- the heartwood ----
/**
 * The heartwood: an oak that has decided to move. A trunk as thick as a man is tall, spread at the
 * foot into roots it stands on, one great limb hanging to the ground like an arm and the other
 * raised, and a crown of dead leaves held all year above a face in the bark. It is drawn inside
 * 0.9 of its height so that alone it stays under the combat view's frame.
 */
function heartwood(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const f = frame(x, y, h), w = wood(p);
  const sway = p.breathe * 1.4, creak = Math.sin(p.frame / 31) * 1.2;
  groundShadow(ctx, x, y + 1, h * 0.8);

  // The far roots and the raised far limb, darker, behind the trunk.
  bark(ctx, f, w.barkD, [
    [[-8, 14, -22, 8, -34, 2, -40, 0], 5, 1.8],
    [[6, 12, 18, 7, 30, 1, 36, 0], 4.6, 1.8],
    [[-10, 58, -24, 66 + creak, -33, 76 + creak, -35, 83 + creak], 6, 2.4],
    [[-4, 64, -12, 74, -16, 80 + sway * 0.5], 4.6, 2.4],
  ], 61, 0.7);

  // The crown's back, then the trunk up into it, then its front: the crown sits on the limbs.
  crown(ctx, f, w, -2, 77, 42, 18, 14, 70, sway);
  bark(ctx, f, w.bark, [
    [[0, 0, 1, 22, -1, 44, 1 + sway * 0.2, 62, 3 + sway * 0.4, 74], 17, 9],
    [[4, 62, 14, 72, 22, 78 + sway * 0.5], 5, 2.6],
    [[-6, 18, -16, 8, -24, 2, -28, 0], 7, 2.4],
    [[6, 16, 16, 6, 24, 1, 28, 0], 7, 2.4],
    [[2, 12, 4, 4, 6, 0], 7, 3],
  ], 63, 1);
  patch(ctx, B, w.moss, [{ k: 'ell', x: f.X(-6), y: f.Y(4), rx: 12 * f.u, ry: 2.6 * f.u }], { alpha: 0.4 });

  // Furrows down the trunk, the bark's deep grain, bending round the face.
  for (const [x0, x1] of [[-12, -10], [-6, -8], [8, 10], [13, 11]] as const) softLine(ctx, B, at(f, [x0, 8, x0 + 1, 24, (x0 + x1) / 2, 34, x1, 60]), w.barkD, Math.max(1, 1.4 * f.u), 0.55);
  face(ctx, f, w, 1, 46, 6.4, 3, p, 5);

  // The near limb, hanging to the ground like an arm, its twigs spread like fingers.
  bark(ctx, f, w.bark, [[[10, 56, 22, 55, 30, 46 + creak * 0.5, 33, 30, 32, 12], 6.6, 2.2]], 67, 0.8);
  blob(ctx, B, w.bark, [{ k: 'ell', x: f.X(31.4), y: f.Y(40 + creak * 0.3), rx: 4.4 * f.u, ry: 3.6 * f.u }], { h, formK: 0.6 });
  ctx.fillStyle = B.col(w.hole); ctx.beginPath(); ctx.ellipse(f.X(31.6), f.Y(40 + creak * 0.3), 1.4 * f.u, 1 * f.u, 0, 0, Math.PI * 2); ctx.fill();
  for (const [dx, dy] of [[4, -6], [0, -9], [-4, -6]] as const) softLine(ctx, B, at(f, [32, 12, 32 + dx, 12 + dy]), w.barkD, Math.max(1, 1.8 * f.u), 0.9);
  crown(ctx, f, w, 4, 82, 30, 10, 8, 80, sway * 1.2);
}

// ------------------------------------------------------------------- the Eldest ----
/**
 * The Eldest: the oldest tree in Caldera, and it is awake. Bigger than the heartwood by breadth
 * and bulk rather than height, so it fits the combat view with no change to it: drawn inside 0.84
 * of its height, a trunk twice the heartwood's girth split down its middle and buttressed on roots
 * like walls, limbs thrown out to either side as far as the view is wide, and a crown on them
 * broader than it is tall, grey beard-moss hanging from every limb. The face is sunk deeper and
 * lit brighter, and the sap shows in the split. It heaves, slowly, as if breathing.
 */
function eldest(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const f = frame(x, y, h), w = wood(p);
  const heave = p.breathe * 1.2, sway = Math.sin(p.frame / 41) * 1.6;
  const beard = shade('#6c7660', p.tone), beardD = shade('#48503e', p.tone);
  groundShadow(ctx, x, y + 1, h * 1.3);

  // The far limbs and roots, darker, behind everything.
  bark(ctx, f, w.barkD, [
    [[-14, 22, -36, 12, -58, 4, -72, 0], 9, 2.4],
    [[12, 20, 34, 10, 56, 3, 70, 0], 8.6, 2.4],
    [[-12, 60, -36, 66 + heave, -56, 70 + sway, -72, 68 + sway], 8, 2.6],
    [[10, 62, 34, 70 + heave, 56, 74 - sway, 72, 72 - sway], 8, 2.6],
  ], 91, 0.7);
  crown(ctx, f, w, -40, 74 + heave, 46, 13, 13, 92, sway);
  crown(ctx, f, w, 40, 76 + heave, 46, 13, 13, 94, -sway);

  // The trunk: a vast bole split down its middle, flaring into buttress roots at the foot.
  bark(ctx, f, w.bark, [
    [[0, 0, -2, 24, 1, 48, -1 + heave * 0.2, 70], 28, 18],
    [[-10, 16, -28, 8, -42, 2, -48, 0], 11, 3],
    [[10, 16, 28, 7, 42, 2, 50, 0], 11, 3],
    [[-4, 10, -12, 3, -18, 0], 10, 4],
    [[4, 10, 12, 3, 18, 0], 10, 4],
    [[-8, 64, -26, 72 + heave, -46, 76 + sway], 9, 4],
    [[8, 64, 26, 74 + heave, 46, 78 - sway], 9, 4],
  ], 95, 1.2);
  // The split: a dark seam from the roots to the face, the sap-light showing in it.
  ctx.fillStyle = B.col(w.hole);
  ctx.beginPath();
  const split = at(f, [-2, 2, -4, 12, -1, 22, -3, 28, 0, 30, 2, 22, -1, 12, 1, 2]);
  ctx.moveTo(split[0], split[1]); for (let i = 2; i < split.length; i += 2) ctx.lineTo(split[i], split[i + 1]);
  ctx.closePath(); ctx.fill();
  glow(ctx, B, f.X(-1), f.Y(14), 6 * f.u, w.sap, 0.2 + 0.1 * Math.sin(p.frame / 23), '#f4ffd0');
  for (const [x0, x1] of [[-22, -18], [-14, -16], [14, 16], [21, 18]] as const) softLine(ctx, B, at(f, [x0, 6, x0 + 1, 22, (x0 + x1) / 2, 36, x1, 62]), w.barkD, Math.max(1, 1.6 * f.u), 0.55);
  patch(ctx, B, w.moss, [{ k: 'ell', x: f.X(-10), y: f.Y(3), rx: 16 * f.u, ry: 2.2 * f.u }], { alpha: 0.35 });

  face(ctx, f, w, 0, 48, 9, 3.8, p, 7);

  // The near crown over the limbs, the middle of it low on the bole, then the beard-moss.
  crown(ctx, f, w, 0, 80 + heave, 38, 10, 10, 96, sway * 0.5);
  const strands: Part[] = [];
  for (const [i, [sx, sy, len]] of ([[-60, 66, 12], [-50, 66, 17], [-40, 67, 10], [-26, 68, 14], [26, 69, 14], [40, 69, 11], [52, 68, 17], [62, 67, 10]] as const).entries()) {
    const d = (i % 2 ? sway : -sway) * 0.4 + heave * 0.2;
    strands.push({ k: 'curve', pts: at(f, [sx - 2.4, sy + 2 + heave, sx + 2.4, sy + 2 + heave, sx + 1.2 + d, sy - len * 0.6, sx + d * 1.6, sy - len, sx - 1.4 + d, sy - len * 0.55]), wobble: 0.18, spiky: 0.12, seed: 120 + i, sub: 3 });
  }
  blob(ctx, B, beard, strands, { h, formK: 0.3, spread: 0.7 });
  for (const [sx, sy] of [[-50, 66], [52, 68]] as const) softLine(ctx, B, at(f, [sx - 0.5, sy - 2 + heave, sx - 0.5, sy - 12]), beardD, Math.max(1, f.u), 0.5);
}
