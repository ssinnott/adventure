// The wolf family: wolf, dire wolf and rift hound on one stalking canine frame, seen three-quarter
// on with the head nearest the viewer: head low and forward, ears pinned, hackles up, lip curled.
// Layout (in units of h, y is the ground line, x the centre): tail at the left, hindquarters and
// barrel behind, chest deeper than the belly, the neck arching down into the big head at the right.
// Painted as masses, not parts: the far legs and far ear as one dark blob, then ALL the fur (tail,
// body, hackles, neck, head, muzzle, jaw, near ear, near legs) as one blob with creases where the
// forms meet and a fur texture, then the pale patches with no line, then the mouth as its own
// material, then the crisp details (fangs, nose, eyes, brows, scars, ember seams) on top.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow, stroke } from './common.ts';
import { blob, glow, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { celBall } from '../../lib/art/shading.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['wolf', 'dire_wolf', 'rift_hound'];

/** Proportions that tell the three kinds apart on the shared frame (1 = the lean grey wolf). */
interface Build { neck: number; head: number; jaw: number; ruff: number; leg: number; body: number; fang: number }
const LEAN: Build = { neck: 1, head: 1, jaw: 1, ruff: 1, leg: 1, body: 1, fang: 1 };
const DIRE: Build = { neck: 1.3, head: 1.18, jaw: 1.2, ruff: 1.6, leg: 1.25, body: 1.12, fang: 1.7 };
const HOUND: Build = { neck: 1.1, head: 1.06, jaw: 1.1, ruff: 0.8, leg: 1.1, body: 1.02, fang: 1.35 };

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
  const pale = v === 'wolf' ? mix(light, shade('#e8e2d8', p.tone), 0.45) : mix(light, shade('#a8a4b0', p.tone), 0.4);
  const ivory = shade('#f0ead8', p.tone);
  const mouth = shade('#4a1a26', p.tone);
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  const sway = Math.sin(f / 22) * h * 0.02;
  const bob = br * h * 0.008;
  const belly = br * h * 0.006;
  const X = (u: number) => x + u * h, Y = (u: number) => y + u * h;

  groundShadow(ctx, x + h * 0.02, y + 1, h * 1.15);
  if (rift) glow(ctx, B, X(-0.06), Y(-0.12), h * 0.36, EMBER, 0.22 + 0.12 * pulse, '#ffb060');

  // Head centre and radius: the biggest single form after the body, low and forward.
  const rH = h * 0.2 * b.head;
  const hx = X(0.33), hy = Y(-0.5) + bob;

  // Far side, in the shadow tone: the hind and fore legs as one mass behind.
  const far: Part[] = [];
  leg(far, X(-0.4), Y(-0.5), h, b.leg * 0.9, true);
  leg(far, X(-0.03), Y(-0.5), h, b.leg * 0.9, false);
  blob(ctx, B, dark, far, { h, formK: 0.35 });

  // Rift hound: crystal spines erupt from the back, hot at the root; drawn before the fur so the
  // body covers their bases.
  if (rift) spines(ctx, x, y, h, light, pulse);

  // The fur: tail, body, hackles, neck, head, muzzle, jaw, near ear, near legs, all ONE mass.
  const by = (u: number) => Y(-0.52 + (u + 0.52) * b.body);
  const fur: Part[] = [
    tube([X(-0.44), Y(-0.6), X(-0.55) + sway * 0.4, Y(-0.5), X(-0.63) + sway, Y(-0.3)], h * 0.045, h * 0.065, 0.22, 7),
    { k: 'curve', pts: [X(-0.44), by(-0.6), X(-0.26), by(-0.7), X(-0.02), by(-0.73), X(0.16), by(-0.66), X(0.25), by(-0.5), X(0.19), by(-0.35), X(-0.02), by(-0.29) + belly, X(-0.24), by(-0.32) + belly, X(-0.42), by(-0.4), X(-0.52), by(-0.5)], wobble: 0.035, spiky: 0.03, seed: 1, sub: 3 },
    { k: 'curve', pts: ring(X(-0.05), by(-0.67), h * (0.11 + 0.045 * b.ruff), h * (0.08 + 0.035 * b.ruff), 10), wobble: 0.05, spiky: 0.12, seed: 3, sub: 2 },
    { k: 'cap', x0: X(0.04), y0: by(-0.68), x1: hx - rH * 0.3, y1: hy - rH * 0.05, r0: h * 0.125 * b.neck, r1: h * 0.115 * b.neck },
    // The head as one profile: skull, brow, stop, bridge of the nose, nose, curled lip, cheek, jowl.
    { k: 'curve', pts: [hx - rH, hy - rH * 0.15, hx - rH * 0.7, hy - rH * 0.7, hx - rH * 0.2, hy - rH * 0.95, hx + rH * 0.35, hy - rH * 0.85, hx + rH * 0.75, hy - rH * 0.5, hx + rH * 1.15, hy - rH * 0.15, hx + rH * 1.5, hy + rH * 0.05, hx + rH * 1.58, hy + rH * 0.35, hx + rH * 1.35, hy + rH * 0.6, hx + rH * 0.8, hy + rH * 0.66, hx + rH * 0.2, hy + rH * 0.72, hx - rH * 0.4, hy + rH * 0.8, hx - rH * 0.9, hy + rH * 0.45], wobble: 0.03, spiky: 0.03, seed: 4, sub: 2 },
    { k: 'cap', x0: hx + rH * 0.35, y0: hy + rH * 0.72, x1: hx + rH * 1.25, y1: hy + rH * 1.05 * b.jaw, r0: rH * 0.27, r1: rH * 0.2 },
  ];
  ear(fur, hx - rH * 0.45, hy - rH * 0.85, rH, 1.0, false);
  ear(fur, hx - rH * 0.02, hy - rH * 0.75, rH, 1.2, v === 'dire');
  leg(fur, X(-0.26), Y(-0.5), h, b.leg, true);
  leg(fur, X(0.1), Y(-0.5), h, b.leg, false);
  const jx0 = hx + rH * 0.35, jy0 = hy + rH * 0.72, jx1 = hx + rH * 1.25, jy1 = hy + rH * 1.05 * b.jaw;
  const creases: Crease[] = [
    { x0: X(0.13), y0: by(-0.74), x1: X(0.21), y1: by(-0.5), r: h * 0.03, a: 0.3 },
    { x0: hx - rH * 0.8, y0: hy - rH * 0.55, x1: hx - rH * 0.72, y1: hy + rH * 0.45, r: h * 0.03, a: 0.3 },
    { x0: X(-0.17), y0: by(-0.56), x1: X(-0.13), y1: by(-0.37), r: h * 0.028, a: 0.28 },
    { x0: X(-0.38), y0: by(-0.4), x1: X(0.08), y1: by(-0.33), r: h * 0.03, a: 0.22 },
    { x0: X(-0.2), y0: by(-0.4), x1: X(-0.24), y1: by(-0.3), r: h * 0.025, a: 0.25 },
    { x0: hx + rH * 0.6, y0: hy - rH * 0.2, x1: hx + rH * 0.7, y1: hy + rH * 0.55, r: rH * 0.12, a: 0.18 },
  ];
  blob(ctx, B, base, fur, { h, tex: 'fur', seed: 1, amount: 0.55, formK: 0.55, creases });

  // Pale muzzle, throat, chest and belly, inside the fur, no line; fur-edged so they read as coat, not paint.
  if (v !== 'rift') {
    const patches: Part[] = [
      { k: 'cap', x0: hx + rH * 0.7, y0: hy + rH * 0.4, x1: hx + rH * 1.35, y1: hy + rH * 0.48, r0: rH * 0.22, r1: rH * 0.2 },
      tube([hx - rH * 0.3, hy + rH * 0.5, X(0.2), by(-0.52), X(0.16), by(-0.36)], rH * 0.26, h * 0.075, 0.18, 23),
    ];
    if (v === 'wolf') patches.push({ k: 'curve', pts: [X(-0.36), by(-0.4), X(-0.12), by(-0.38), X(0.1), by(-0.37), X(0.08), by(-0.3), X(-0.16), by(-0.29), X(-0.4), by(-0.34)], wobble: 0.06, spiky: 0.06, seed: 22, sub: 2 });
    blob(ctx, B, mix(base, pale, v === 'wolf' ? 0.8 : 0.55), patches, { outline: false, form: false });
  }
  // The open mouth: its own material, between the muzzle and the jaw; fangs on top.
  blob(ctx, B, mouth, [{ k: 'poly', pts: [hx + rH * 0.5, hy + rH * 0.52, hx + rH * 1.32, hy + rH * 0.66, jx1 + rH * 0.05, jy1 - rH * 0.14, jx0, jy0 - rH * 0.12] }], { outline: false, form: false });
  fangs(ctx, hx, hy, rH, b.fang, ivory);
  // Nose, and the wrinkles of the curled lip where they survive.
  const mx = hx + rH * 1.42, my = hy + rH * 0.28;
  celBall(ctx, B, mx + rH * 0.08, my - rH * 0.06, rH * 0.19, shade('#221a20', p.tone), rH >= 8);
  if (rH >= 9) {
    softLine(ctx, B, [mx - rH * 0.4, my - rH * 0.45, mx - rH * 0.26, my - rH * 0.1], base, Math.max(1, rH * 0.08), 0.5);
    softLine(ctx, B, [mx - rH * 0.65, my - rH * 0.42, mx - rH * 0.5, my - rH * 0.05], base, Math.max(1, rH * 0.08), 0.5);
  }
  // Inner ear: a soft dark hollow along the pinned-back near ear.
  softLine(ctx, B, [hx - rH * 0.25, hy - rH * 0.85, hx - rH * 0.95, hy - rH * 1.4], base, Math.max(1, rH * 0.13), 0.45);
  // Eyes and angry brows: near eye large, far eye small.
  const eyeCol = v === 'wolf' ? p.amber : v === 'dire' ? shade('#e8f060', Math.max(0.6, p.tone)) : HOT;
  const ex = hx + rH * 0.45, ey = hy - rH * 0.3, er = rH * 0.15, fx = hx - rH * 0.28, fy = hy - rH * 0.38, fr = rH * 0.11;
  if (rift) { glow(ctx, B, ex, ey, er * 3, EMBER, 0.4 + 0.3 * pulse, HOT); glow(ctx, B, fx, fy, fr * 2.6, EMBER, 0.35 + 0.25 * pulse, HOT); }
  eye(ctx, ex, ey, er, eyeCol, !rift);
  eye(ctx, fx, fy, fr, eyeCol, !rift);
  const bw = Math.max(1, rH * 0.14);
  softLine(ctx, B, [ex + er * 1.5, ey - er * 1.8, ex - er * 1.2, ey - er * 0.9], base, bw, 0.85);
  softLine(ctx, B, [fx - fr * 1.4, fy - fr * 1.7, fx + fr * 1.2, fy - fr * 0.8], base, bw, 0.85);

  if (v === 'dire') scars(ctx, x, y, h, mx, my, rH, shade('#c0b0a4', p.tone));
  if (rift) riftFx(ctx, x, y, h, hx, hy, rH, f, light, pulse);
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

/**
 * One leg as a bending tube from the hip (or shoulder) to the pastern, plus a paw: the hind leg
 * has the stifle forward and the hock back, the front leg a straight forearm over a slight elbow.
 */
function leg(out: Part[], x0: number, y0: number, h: number, k: number, hind: boolean): void {
  const pts = hind
    ? [x0, y0, x0 + h * 0.1, y0 + h * 0.2, x0 - h * 0.03, y0 + h * 0.36, x0 + h * 0.05, y0 + h * 0.46]
    : [x0, y0, x0 + h * 0.03, y0 + h * 0.19, x0 + h * 0.035, y0 + h * 0.36, x0 + h * 0.07, y0 + h * 0.46];
  out.push(tube(pts, h * 0.085 * k, h * 0.042 * k, 0.06, hind ? 11 : 12));
  const px = pts[6] + h * 0.03, py = pts[7] + h * 0.012;
  out.push({ k: 'ell', x: px, y: py, rx: h * 0.07 * Math.sqrt(k), ry: h * 0.032 * Math.sqrt(k) });
}

/** One pinned-back ear, lying along the neck. `torn` bites a notch out of its top edge. */
function ear(out: Part[], bx: number, by: number, r: number, len: number, torn: boolean): void {
  const pts = [bx + r * 0.4, by + r * 0.05, bx - r * 0.35, by + r * 0.4, bx - r * len, by - r * 0.8];
  if (torn) pts.push(bx - r * (len * 0.84), by - r * 0.72, bx - r * (len * 0.6), by - r * 0.18, bx - r * (len * 0.42), by - r * 0.62);
  pts.push(bx - r * 0.05, by - r * 0.55);
  out.push({ k: 'poly', pts });
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
function scars(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, mx: number, my: number, rH: number, col: string): void {
  const w = Math.max(1, h * 0.02);
  ctx.strokeStyle = B.col(rgba(col, 0.75)); ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(mx - rH * 0.9, my - rH * 0.7); ctx.lineTo(mx - rH * 0.5, my + rH * 0.25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - h * 0.24, y - h * 0.66); ctx.lineTo(x - h * 0.13, y - h * 0.46); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - h * 0.17, y - h * 0.68); ctx.lineTo(x - h * 0.07, y - h * 0.47); ctx.stroke();
}

/** Rift hound: a row of crystal shards along the back, leaning back, one faceted glossy mass, hot at the root. */
function spines(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, light: string, pulse: number): void {
  const yb = y - h * 0.64, pts: number[] = [x - h * 0.5, yb + h * 0.06];
  for (let i = 0; i < 4; i++) {
    const t = i / 3, bx = x - h * 0.44 + t * h * 0.36, sh = h * (i === 1 ? 0.24 : i === 2 ? 0.28 : 0.18), sw = h * 0.045;
    glow(ctx, B, bx, yb - sh * 0.15, sh * 0.6, EMBER, 0.25 + 0.25 * pulse, '#ffb060');
    pts.push(bx - sw * 0.6, yb, bx - sw * 0.9, yb - sh, bx + sw * 0.5, yb - sh * 0.5, bx + sw, yb);
  }
  pts.push(x - h * 0.02, yb + h * 0.06);
  blob(ctx, B, mix(light, HOT, 0.35), [{ k: 'poly', pts }], { h, tex: 'facets', seed: 5, gloss: 0.8, form: false, spread: 0.6 });
}

/** Rift hound: ember seams splitting the hide, glowing eyes and embers drifting up off the back. */
function riftFx(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, hx: number, hy: number, rH: number, f: number, light: string, pulse: number): void {
  const gw = Math.max(2, h * 0.05), sw = Math.max(1, h * 0.016);
  seam(ctx, [x - h * 0.3, y - h * 0.6, x - h * 0.2, y - h * 0.5, x - h * 0.05, y - h * 0.54, x + h * 0.1, y - h * 0.42], light, gw, sw, pulse);
  seam(ctx, [x - h * 0.42, y - h * 0.48, x - h * 0.34, y - h * 0.38, x - h * 0.3, y - h * 0.26], light, gw, sw, pulse);
  seam(ctx, [x + h * 0.08, y - h * 0.72, x + h * 0.18, y - h * 0.6, hx - rH * 0.35, hy - rH * 0.35], light, gw, sw, pulse);
  seam(ctx, [hx - rH * 0.15, hy + rH * 0.1, hx + rH * 0.2, hy + rH * 0.32, hx + rH * 0.7, hy + rH * 0.28], light, gw * 0.7, sw, pulse);
  if (B.override) return;
  // Embers rising off the back, four on a loop.
  for (let i = 0; i < 4; i++) {
    const t = ((f / 90) + i / 4) % 1;
    const ex = x - h * 0.36 + i * h * 0.18 + Math.sin(f / 9 + i * 2) * h * 0.03, ey = y - h * 0.74 - t * h * 0.4;
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
