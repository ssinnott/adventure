// The wolf family: wolf, dire wolf and rift hound on one canine frame, standing alert in profile.
// The proportions are measured off a photograph of a grey wolf rather than invented: the legs are
// two fifths of the height, the body a little under a half, the withers are the highest point of
// the body, the back is level, the belly tucks up behind the ribs, and the head is carried so the
// eye sits just below the withers with the skull and the erect ears above them. An earlier frame
// had short legs, an arched back and the head hanging below the shoulder, which is most of why
// the animal read as a bean on stumps. Coat is counter-shaded the way a wolf's is: a dark mantle
// over the back and shoulders, near-cream legs, chest, belly, throat and muzzle.
// Painted as masses, not parts: the far legs and far ear as one dark blob, then ALL the fur (tail,
// body, hackles, neck, head, muzzle, jaw, near ear, near legs) as one blob with creases where the
// forms meet and a fur texture, then the pale patches with no line, then the mouth as its own
// material, then the crisp details (fangs, nose, eyes, brows, scars, ember seams) on top.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow, stroke } from './common.ts';
import { blob, glow, softLine, patch } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { celBall } from '../../lib/art/shading.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['wolf', 'dire_wolf', 'rift_hound'];

/** Proportions that tell the three kinds apart on the shared frame (1 = the lean grey wolf). */
interface Build { neck: number; head: number; jaw: number; ruff: number; leg: number; body: number; fang: number; tail: number }
const LEAN: Build = { neck: 1, head: 1, jaw: 1, ruff: 1, leg: 1, body: 1, fang: 1, tail: 1 };
const DIRE: Build = { neck: 1.3, head: 1.18, jaw: 1.2, ruff: 1.6, leg: 1.25, body: 1.12, fang: 1.7, tail: 1.2 };
const HOUND: Build = { neck: 1.1, head: 1.06, jaw: 1.1, ruff: 0.8, leg: 1.1, body: 1.02, fang: 1.35, tail: 0.78 };

type Variant = 'wolf' | 'dire' | 'rift';

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'dire_wolf') canine(ctx, x, y, h, p, DIRE, 'dire');
  else if (kind === 'rift_hound') canine(ctx, x, y, h, p, HOUND, 'rift');
  else canine(ctx, x, y, h, p, LEAN, 'wolf');
};

/** Emissive ember colours for the rift hound: never toned, they are the light source. */
const EMBER = '#ff7020', HOT = '#ffe0a0';


function canine(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build, v: Variant): void {
  const br = p.breathe, f = p.frame, rift = v === 'rift';
  const base = p.base, dark = p.dark, light = p.light;
  const pale = v === 'wolf' ? mix(light, shade('#efe8dc', p.tone), 0.6) : mix(light, shade('#a8a4b0', p.tone), 0.4);
  const ivory = shade('#f0ead8', p.tone);
  const mouth = shade('#4a1a26', p.tone);
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  const sway = Math.sin(f / 22) * h * 0.02;
  const bob = br * h * 0.006;
  const belly = br * h * 0.005;
  /** x in units of h from the sprite's centre. */
  const X = (u: number) => x + u * h;
  /** HEIGHT ABOVE THE GROUND LINE, in units of h: the way the reference was measured. */
  const U = (u: number) => y - u * h * b.body;

  groundShadow(ctx, x + h * 0.02, y + 1, h * 1.05);
  if (rift) glow(ctx, B, X(-0.02), U(0.22), h * 0.36, EMBER, 0.22 + 0.12 * pulse, '#ffb060');

  // The head rides high: on a standing wolf the eye sits just below the withers and the skull and
  // ears rise above them. It used to hang below the shoulder in a stalk, which along with short
  // legs and an arched back is what made the animal read as a bean on stumps.
  const rH = h * 0.147 * b.head;
  const hx = X(0.45), hy = U(0.80) + bob;

  // ---- far side, in shadow: the two off legs and the far ear, one mass behind everything.
  const far: Part[] = [];
  legParts(far, [X(0.10), U(0.68), X(0.125), U(0.46), X(0.14), U(0.24), X(0.15), U(0.03)], h, b.leg * 0.92, 13);
  legParts(far, [X(-0.36), U(0.64), X(-0.26), U(0.45), X(-0.38), U(0.255), X(-0.33), U(0.03)], h, b.leg * 0.92, 14);
  earPart(far, hx - rH * 0.82, hy - rH * 0.72, rH * 0.92, false);
  blob(ctx, B, dark, far, { h, formK: 0.35 });

  // ---- the tail: its own mass behind the rump, a brush hanging low and coming to a point.
  {
    const k = b.tail;
    const t0x = X(-0.35), t0y = U(0.82);
    const t1x = X(-0.46) + sway * 0.3, t1y = U(0.56);
    const t2x = X(-0.50) + sway, t2y = U(0.20);
    // Two tapers rather than one plus a swell: a brush is thickest about a third of the way down
    // and stays thick nearly to the tip. A single ellipse near the root made a comma.
    blob(ctx, B, shade(base, 0.92), [
      { k: 'tube', pts: [t0x, t0y, t0x + (t1x - t0x) * 0.6, t0y + (t1y - t0y) * 0.6, t1x, t1y], r0: h * 0.05 * k, r1: h * 0.082 * k, wobble: 0.07, seed: 31 },
      { k: 'tube', pts: [t1x, t1y, t1x + (t2x - t1x) * 0.55, t1y + (t2y - t1y) * 0.55, t2x, t2y], r0: h * 0.082 * k, r1: h * 0.03 * k, wobble: 0.08, seed: 32 },
    ], { h, tex: 'fur', seed: 31, amount: 0.5, formK: 0.5, spread: 0.8 });
  }

  if (rift) spines(ctx, x, y, h, light, pulse);

  // ---- the coat: body, neck, ruff, head, jaw, near ear and the two near legs, ONE mass.
  // The outline carries the landmarks a wolf has: withers highest, a level back, a belly that
  // tucks up behind the ribs, and a deep but narrow chest.
  const fur: Part[] = [
    { k: 'curve', pts: [
      X(-0.33), U(0.855), X(-0.11), U(0.848), X(0.05), U(0.858), X(0.19), U(0.878),
      X(0.285), U(0.805), X(0.315), U(0.62), X(0.275), U(0.465),
      X(0.11), U(0.43) + belly, X(-0.05), U(0.425) + belly, X(-0.18), U(0.49) + belly,
      X(-0.31), U(0.56), X(-0.41), U(0.72),
    ], wobble: 0.03, spiky: 0.035, seed: 1, sub: 3 },
    // Shoulder and haunch under the coat.
    { k: 'ell', x: X(0.17), y: U(0.66), rx: h * 0.095, ry: h * 0.115, rot: 0.12 },
    { k: 'ell', x: X(-0.27), y: U(0.66), rx: h * 0.125, ry: h * 0.135, rot: -0.12 },
    // Neck: short and thick, sloping down and forward from the withers into the skull.
    { k: 'cap', x0: X(0.20), y0: U(0.835), x1: hx - rH * 0.55, y1: hy - rH * 0.1, r0: h * 0.118 * b.neck, r1: h * 0.10 * b.neck },
    // The ruff: the thick collar of fur behind the jaw.
    { k: 'curve', pts: ring(X(0.30), U(0.755), h * (0.10 + 0.035 * b.ruff), h * (0.12 + 0.04 * b.ruff), 10), wobble: 0.06, spiky: 0.13, seed: 3, sub: 2 },
    // The head in profile: back of skull, crown, brow, stop, bridge, nose, lip, jaw, throat.
    { k: 'curve', pts: [
      hx - rH * 0.98, hy - rH * 0.12, hx - rH * 0.55, hy - rH * 0.78, hx + rH * 0.1, hy - rH * 0.92,
      hx + rH * 0.52, hy - rH * 0.62, hx + rH * 1.15, hy - rH * 0.46, hx + rH * 1.75, hy - rH * 0.3,
      hx + rH * 1.92, hy - rH * 0.04, hx + rH * 1.76, hy + rH * 0.28, hx + rH * 1.2, hy + rH * 0.5,
      hx + rH * 0.35, hy + rH * 0.72, hx - rH * 0.35, hy + rH * 0.8, hx - rH * 0.92, hy + rH * 0.42,
    ], wobble: 0.025, spiky: 0.035, seed: 4, sub: 2 },
    { k: 'cap', x0: hx + rH * 0.45, y0: hy + rH * 0.56, x1: hx + rH * 1.45, y1: hy + rH * 0.6 * b.jaw, r0: rH * 0.26, r1: rH * 0.18 },
  ];
  // Erect ears: two upright triangles on the crown, which is most of a wolf's head silhouette.
  earPart(fur, hx - rH * 0.2, hy - rH * 0.82, rH, v === 'dire');
  // The near legs: long, with an elbow and a carpus in front, a stifle and a hock behind.
  legParts(fur, [X(0.21), U(0.70), X(0.235), U(0.455), X(0.25), U(0.24), X(0.26), U(0.02)], h, b.leg, 11);
  legParts(fur, [X(-0.25), U(0.66), X(-0.13), U(0.46), X(-0.25), U(0.255), X(-0.195), U(0.02)], h, b.leg, 12);
  const creases: Crease[] = [
    { x0: X(0.08), y0: U(0.84), x1: X(0.06), y1: U(0.50), r: h * 0.03, a: 0.3 },       // behind the shoulder
    { x0: X(-0.17), y0: U(0.80), x1: X(-0.15), y1: U(0.50), r: h * 0.028, a: 0.26 },   // in front of the haunch
    { x0: X(-0.10), y0: U(0.47), x1: X(0.10), y1: U(0.50), r: h * 0.026, a: 0.22 },    // the flank tuck
    { x0: X(0.24), y0: U(0.80), x1: X(0.28), y1: U(0.66), r: h * 0.026, a: 0.26 },     // shoulder into the ruff
    { x0: hx - rH * 0.9, y0: hy - rH * 0.5, x1: hx - rH * 0.8, y1: hy + rH * 0.4, r: rH * 0.16, a: 0.28 }, // cheek
    { x0: hx + rH * 0.55, y0: hy - rH * 0.4, x1: hx + rH * 0.62, y1: hy + rH * 0.35, r: rH * 0.12, a: 0.18 }, // the stop
  ];
  blob(ctx, B, base, fur, { h, tex: 'fur', seed: 1, amount: 0.55, formK: 0.5, creases });

  // ---- counter-shading, which is how a wolf is actually coloured: a dark mantle over the back and
  // shoulders, and pale legs, belly, chest, throat and muzzle. A single flat value ear to tail is
  // the other half of the blob read.
  patch(ctx, B, shade(base, 0.58), [{ k: 'curve', pts: [
    X(-0.36), U(0.80), X(-0.14), U(0.855), X(0.06), U(0.862), X(0.21), U(0.85),
    X(0.235), U(0.72), X(0.12), U(0.63), X(-0.10), U(0.62), X(-0.28), U(0.66),
  ], wobble: 0.08, spiky: 0.07, seed: 44, sub: 2 }], { alpha: 0.6, feather: 0.5 });
  if (v !== 'rift') {
    patch(ctx, B, mix(base, pale, 0.88), [
      // Legs, from the elbow and the stifle down.
      { k: 'tube', pts: [X(0.235), U(0.44), X(0.25), U(0.24), X(0.26), U(0.03)], r0: h * 0.05 * b.leg, r1: h * 0.038 * b.leg },
      { k: 'tube', pts: [X(-0.14), U(0.44), X(-0.25), U(0.255), X(-0.195), U(0.03)], r0: h * 0.05 * b.leg, r1: h * 0.038 * b.leg },
      // Brisket, belly and throat.
      { k: 'curve', pts: [X(0.26), U(0.52), X(0.10), U(0.46), X(-0.10), U(0.44), X(-0.22), U(0.47), X(-0.16), U(0.40), X(0.10), U(0.40), X(0.27), U(0.44)], wobble: 0.07, spiky: 0.06, seed: 22, sub: 2 },
      { k: 'cap', x0: hx - rH * 0.3, y0: hy + rH * 0.66, x1: X(0.27), y1: U(0.62), r0: rH * 0.3, r1: h * 0.055 },
      // Muzzle sides and the cheek, which a wolf wears as a pale mask.
      { k: 'cap', x0: hx + rH * 0.62, y0: hy + rH * 0.24, x1: hx + rH * 1.6, y1: hy + rH * 0.18, r0: rH * 0.26, r1: rH * 0.2 },
      { k: 'ell', x: hx - rH * 0.05, y: hy + rH * 0.42, rx: rH * 0.42, ry: rH * 0.3, rot: 0.1 },
    ], { alpha: 0.78, feather: 0.5 });
  }

  // ---- the open mouth, fangs, nose and eye.
  const jx0 = hx + rH * 0.45, jy0 = hy + rH * 0.56, jx1 = hx + rH * 1.45, jy1 = hy + rH * 0.6 * b.jaw;
  blob(ctx, B, mouth, [{ k: 'poly', pts: [hx + rH * 0.66, hy + rH * 0.34, hx + rH * 1.52, hy + rH * 0.42, jx1 + rH * 0.04, jy1 - rH * 0.12, jx0 + rH * 0.1, jy0 - rH * 0.1] }], { outline: false, form: false });
  fangs(ctx, hx, hy - rH * 0.16, rH, b.fang, ivory);
  const mx = hx + rH * 1.66, my = hy - rH * 0.08;
  celBall(ctx, B, mx + rH * 0.12, my, rH * 0.2, shade('#221a20', p.tone), rH >= 8);
  if (rH >= 9) {
    softLine(ctx, B, [mx - rH * 0.45, my - rH * 0.2, mx - rH * 0.3, my + rH * 0.12], base, Math.max(1, rH * 0.08), 0.45);
  }
  // The inner ear, a dark hollow up the near ear.
  softLine(ctx, B, [hx - rH * 0.16, hy - rH * 0.98, hx - rH * 0.1, hy - rH * 1.55], base, Math.max(1, rH * 0.15), 0.45);
  // ONE eye: the head is a profile, so the far cheek is turned away and a second eye has nowhere to
  // be. If this head is ever turned toward the party it becomes a matched PAIR of the same size,
  // the far one only slightly narrowed by the turn; the rat and the boar are profiles with one eye.
  const eyeCol = v === 'wolf' ? p.amber : v === 'dire' ? shade('#e8f060', Math.max(0.6, p.tone)) : HOT;
  const ex = hx + rH * 0.42, ey = hy - rH * 0.4, er = rH * 0.15;
  if (rift) glow(ctx, B, ex, ey, er * 3, EMBER, 0.4 + 0.3 * pulse, HOT);
  // The dark surround a wolf carries around the eye, which is what makes it read from across a room.
  if (rH >= 9) softLine(ctx, B, [ex - er * 1.2, ey + er * 0.2, ex + er * 1.6, ey - er * 0.1], shade(base, 0.6), Math.max(1, er * 1.5), 0.5);
  eye(ctx, ex, ey, er, eyeCol, !rift);
  softLine(ctx, B, [ex + er * 1.5, ey - er * 1.5, ex - er * 1.3, ey - er * 0.8], base, Math.max(1, rH * 0.13), 0.8);

  if (v === 'dire') scars(ctx, x, y, h, mx, my, rH, shade('#c0b0a4', p.tone));
  if (rift) riftFx(ctx, x, y, h, hx, hy, rH, f, light, pulse);
}

/**
 * One leg from a four-point spine (shoulder or hip, elbow or stifle, carpus or hock, foot), with a
 * paw at the end. Long: on the reference the legs are two fifths of the whole height.
 */
function legParts(out: Part[], pts: readonly number[], h: number, k: number, seed: number): void {
  out.push(tube(pts, h * 0.072 * k, h * 0.034 * k, 0.05, seed));
  out.push({ k: 'ell', x: pts[6] + h * 0.02, y: pts[7] + h * 0.008, rx: h * 0.052 * Math.sqrt(k), ry: h * 0.026 * Math.sqrt(k) });
}

/** One erect ear: a rounded triangle standing on the crown. `torn` bites a notch out of one edge. */
function earPart(out: Part[], bx: number, by: number, r: number, torn: boolean): void {
  const w = r * 0.34, tipX = bx + r * 0.1, tipY = by - r * 0.95;
  const pts = [bx - w, by + r * 0.16, bx - w * 0.75, by - r * 0.45, tipX - w * 0.15, tipY];
  if (torn) pts.push(tipX + w * 0.1, tipY + r * 0.16, tipX - w * 0.05, tipY + r * 0.3, tipX + w * 0.45, tipY + r * 0.34);
  pts.push(bx + w * 1.05, by - r * 0.3, bx + w, by + r * 0.2);
  out.push({ k: 'poly', pts });
}

/** Stable 0..1 noise for the tube wobble (the same mix as gloss.ts uses, kept local). */
function rnd(a: number, b: number, c: number): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/**
 * A bending tapered tube along a spine, as a smooth closed curve part. Local stand-in for the
 * toolkit's 'tube': gloss.ts's tubeOutline sweeps both end caps from the wrong side, so its outline
 * is a bow-tie at each end and nonzero filling leaves a half-disc hole at every cap (a wedge-shaped
 * gap at the hip of every leg). This one walks left side, end cap, right side, start cap in order.
 */
function tube(pts: readonly number[], r0: number, r1: number, wobble = 0, seed = 0): Part {
  const n = pts.length / 2;
  const P = (i: number, c: 0 | 1) => pts[Math.max(0, Math.min(n - 1, i)) * 2 + c];
  const spine: number[] = [];
  const S = 4;
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
    const r = (r0 + (r1 - r0) * (i / (m - 1))) * (1 + (wobble ? (rnd(seed, i, 1) - 0.5) * 2 * wobble : 0));
    left.push(spine[i * 2] + nx * r, spine[i * 2 + 1] + ny * r);
    right.push(spine[i * 2] - nx * r, spine[i * 2 + 1] - ny * r);
  }
  const out: number[] = [...left];
  // End cap: from the left edge, sweeping through the forward direction, to the right edge.
  const ex = spine[(m - 1) * 2], ey = spine[(m - 1) * 2 + 1], ea = Math.atan2(ey - spine[(m - 2) * 2 + 1], ex - spine[(m - 2) * 2]);
  for (let k = 1; k < 5; k++) { const a = ea + Math.PI / 2 - (k / 5) * Math.PI; out.push(ex + Math.cos(a) * r1, ey + Math.sin(a) * r1); }
  for (let i = m - 1; i >= 0; i--) out.push(right[i * 2], right[i * 2 + 1]);
  // Start cap: from the right edge, sweeping through the backward direction, to the left edge.
  const sx = spine[0], sy = spine[1], sa = Math.atan2(spine[3] - sy, spine[2] - sx);
  for (let k = 1; k < 5; k++) { const a = sa - Math.PI / 2 - (k / 5) * Math.PI; out.push(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0); }
  return { k: 'curve', pts: out, wobble: 0, sub: 1 };
}

/** A lumpy ring of n points around (cx, cy), for a head or a hackle ruff. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}



/** Upper fangs hanging from the muzzle and small lower teeth on the jaw, flat ivory, no ink. */
function fangs(ctx: CanvasRenderingContext2D, hx: number, hy: number, rH: number, k: number, ivory: string): void {
  const tall = rH * 0.36 * k, small = rH * 0.18, w = Math.max(1, rH * 0.15);
  ctx.fillStyle = B.col(ivory);
  for (let i = 0; i < 2; i++) {
    const t = 0.5 + i * 0.32;
    const bx = hx + rH * 0.5 + rH * 0.75 * t, by = hy + rH * 0.5 + rH * 0.22 * t, fh = i === 0 ? tall : tall * 0.72;
    ctx.beginPath(); ctx.moveTo(bx - w, by - 1); ctx.lineTo(bx + w, by - 1); ctx.lineTo(bx + w * 0.2, by + fh); ctx.closePath(); ctx.fill();
  }
  for (let i = 0; i < 2; i++) {
    const t = 0.35 + i * 0.35;
    const bx = hx + rH * 0.45 + rH * 0.7 * t, by = hy + rH * 0.62 + rH * 0.3 * t;
    ctx.beginPath(); ctx.moveTo(bx - w * 0.7, by + 1); ctx.lineTo(bx + w * 0.7, by + 1); ctx.lineTo(bx, by - small); ctx.closePath(); ctx.fill();
  }
}

/** Dire wolf: pale old claw scars across the muzzle and the flank, soft lines with no ink. */
/**
 * Old claw marks. A scar is a healed seam in the coat, so it is thin, a little crooked, and only a
 * step off the fur around it: drawn long, straight, thick and near-white it reads as a rod laid
 * across the animal, which is what the muzzle one did, apparently skewering the head.
 */
function scars(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, mx: number, my: number, rH: number, col: string): void {
  ctx.strokeStyle = B.col(rgba(col, 0.42)); ctx.lineWidth = Math.max(1, h * 0.011); ctx.lineCap = 'round';
  // Across the bridge of the muzzle, short and clear of the eye.
  ctx.beginPath();
  ctx.moveTo(mx - rH * 0.72, my - rH * 0.34);
  ctx.quadraticCurveTo(mx - rH * 0.55, my - rH * 0.06, mx - rH * 0.46, my + rH * 0.16);
  ctx.stroke();
  // Two on the flank, of different lengths and angles, so they are not a tally.
  ctx.beginPath();
  ctx.moveTo(x - h * 0.235, y - h * 0.645);
  ctx.quadraticCurveTo(x - h * 0.19, y - h * 0.575, x - h * 0.155, y - h * 0.495);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - h * 0.16, y - h * 0.66);
  ctx.quadraticCurveTo(x - h * 0.128, y - h * 0.60, x - h * 0.108, y - h * 0.545);
  ctx.stroke();
}

/** Rift hound: a row of crystal shards along the back, leaning back, one faceted glossy mass, hot at the root. */
function spines(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, light: string, pulse: number): void {
  const yb = y - h * 0.845, pts: number[] = [x - h * 0.34, yb + h * 0.05];
  for (let i = 0; i < 4; i++) {
    const t = i / 3, bx = x - h * 0.28 + t * h * 0.38, sh = h * (i === 1 ? 0.18 : i === 2 ? 0.21 : 0.13), sw = h * 0.042;
    glow(ctx, B, bx, yb - sh * 0.15, sh * 0.6, EMBER, 0.25 + 0.25 * pulse, '#ffb060');
    pts.push(bx - sw * 0.6, yb, bx - sw * 0.9, yb - sh, bx + sw * 0.5, yb - sh * 0.5, bx + sw, yb);
  }
  pts.push(x + h * 0.14, yb + h * 0.05);
  blob(ctx, B, mix(light, HOT, 0.35), [{ k: 'poly', pts }], { h, tex: 'facets', seed: 5, gloss: 0.8, form: false, spread: 0.6 });
}

/** Rift hound: ember seams splitting the hide, glowing eyes and embers drifting up off the back. */
function riftFx(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, hx: number, hy: number, rH: number, f: number, light: string, pulse: number): void {
  const gw = Math.max(2, h * 0.05), sw = Math.max(1, h * 0.016);
  seam(ctx, [x - h * 0.26, y - h * 0.76, x - h * 0.16, y - h * 0.64, x - h * 0.02, y - h * 0.70, x + h * 0.12, y - h * 0.58], light, gw, sw, pulse);
  seam(ctx, [x - h * 0.30, y - h * 0.64, x - h * 0.24, y - h * 0.54, x - h * 0.22, y - h * 0.44], light, gw, sw, pulse);
  seam(ctx, [x + h * 0.10, y - h * 0.84, x + h * 0.20, y - h * 0.76, hx - rH * 0.5, hy - rH * 0.3], light, gw, sw, pulse);
  seam(ctx, [hx - rH * 0.15, hy + rH * 0.1, hx + rH * 0.2, hy + rH * 0.32, hx + rH * 0.7, hy + rH * 0.28], light, gw * 0.7, sw, pulse);
  if (B.override) return;
  // Embers rising off the back, four on a loop.
  for (let i = 0; i < 4; i++) {
    const t = ((f / 90) + i / 4) % 1;
    const ex = x - h * 0.28 + i * h * 0.16 + Math.sin(f / 9 + i * 2) * h * 0.03, ey = y - h * 0.94 - t * h * 0.3;
    const r = Math.max(2, h * 0.04 * (1 - t * 0.5));
    ctx.fillStyle = rgba(i === 1 ? HOT : EMBER, 0.9 - t * 0.8);
    ctx.fillRect(Math.round(ex - r / 2), Math.round(ey - r / 2), Math.max(1, Math.round(r)), Math.max(1, Math.round(r)));
  }
}

/** One ember seam: a soft glow along the line, then a light line with a hot core. Flat white while flashing. */
function seam(ctx: CanvasRenderingContext2D, pts: number[], light: string, gw: number, sw: number, pulse: number): void {
  if (!B.override) {
    for (let i = 2; i < pts.length; i += 2) glow(ctx, B, (pts[i - 2] + pts[i]) / 2, (pts[i - 1] + pts[i + 1]) / 2, gw * 1.8, EMBER, 0.2 + 0.2 * pulse, '#ffb060');
    stroke(ctx, pts, rgba(EMBER, 0.35 + 0.3 * pulse), gw);
  }
  stroke(ctx, pts, light, sw + 1);
  stroke(ctx, pts, mix(HOT, '#ffffff', 0.3 * pulse), sw);
}
