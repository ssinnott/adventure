// The spider family: marsh spider and thorn spider, painted organically with blob(): a big lumpy
// glossy abdomen, a smaller cephalothorax in front and lower, eight bending tube legs (the rear
// pairs as their own darker mass behind the body), pedipalps, chelicerae with crisp pale fangs and
// an eye cluster. Facing the party in a slight three-quarter, the head turned a little to the
// right; idle is a leg twitch and an abdomen bob.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, softLine, glow } from './gloss.ts';
import type { Part, Crease } from './gloss.ts';
import { shade, mix } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['spider', 'thorn_spider'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'thorn_spider') thorn(ctx, x, y, h, p);
  else marsh(ctx, x, y, h, p);
};

/** A lumpy ring of n points around (cx, cy), the raw contour a 'curve' part lumps further. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number, seed: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, k = 1 + (((seed * 7 + i * 13) % 5) - 2) * 0.025;
    o.push(cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k);
  }
  return o;
}

/** One leg's spine: hip, a raised knee up and out, the shin coming down, then a foot on the ground. */
interface Leg { pts: number[]; s: number; i: number }

/** The body layout shared by both kinds: where the abdomen, cephalothorax and the eight legs sit. */
interface Rig { ax: number; ay: number; cx: number; cy: number; legs: Leg[] }

function rig(x: number, y: number, h: number, frame: number, breathe: number, spread: number): Rig {
  const bob = breathe * h * 0.012;
  const cx = x + h * 0.1, cy = y - h * 0.33 + bob * 0.4;
  const ax = x - h * 0.13, ay = y - h * 0.67 + bob;
  // Fanned: the front pair reaches forward (foot low and near), the rear pair back (foot higher, behind).
  const L = [
    { kx: 0.44, ky: 0.74, mx: 0.56, my: 0.42, fx: 0.5, fy: 0.02 },
    { kx: 0.6, ky: 0.82, mx: 0.8, my: 0.46, fx: 0.86, fy: 0.03 },
    { kx: 0.62, ky: 0.88, mx: 0.9, my: 0.52, fx: 0.98, fy: 0.08 },
    { kx: 0.5, ky: 0.9, mx: 0.78, my: 0.58, fx: 0.84, fy: 0.15 },
  ];
  const legs: Leg[] = [];
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const d = L[i];
    // The right-hand legs (the side turned toward us) stand a touch wider and higher; a slow twitch per leg.
    const wide = s > 0 ? 1.06 : 0.94, tw = Math.sin(frame / 8 + i * 1.9 + s * 0.7) * h * 0.012;
    const hx = cx + s * h * 0.12, hy = cy + (i - 1.5) * h * 0.025;
    const kx = x + s * h * d.kx * spread * wide, ky = y - h * d.ky + tw;
    const mx = x + s * h * d.mx * spread * wide, my = y - h * d.my + tw * 0.5;
    const fx = x + s * h * d.fx * spread * wide, fy = y - h * d.fy;
    // Points either side of the knee: the tube samples the bend densely, so the joint rounds like a
    // patella instead of coming out as a chamfered plate.
    legs.push({ s, i, pts: [hx, hy, kx + (hx - kx) * 0.22, ky + (hy - ky) * 0.22, kx, ky, kx + (mx - kx) * 0.2, ky + (my - ky) * 0.2, mx, my, fx, fy] });
  }
  return { ax, ay, cx, cy, legs };
}

function legPart(l: Leg, h: number, r0: number, r1: number, wobble: number): Part {
  return { k: 'tube', pts: l.pts, r0: h * r0, r1: h * r1, wobble, seed: 20 + l.i * 2 + (l.s > 0 ? 1 : 0) };
}

/** Thorn spines along a leg's shin, as polys that union into the leg's mass. */
function legThorns(l: Leg, h: number, n: number): Part[] {
  const out: Part[] = [];
  const p = l.pts, x0 = p[6], y0 = p[7], x1 = p[8], y1 = p[9], x2 = p[10], y2 = p[11];
  for (let k = 0; k < n; k++) {
    const t = 0.25 + k * 0.3;
    // Along the knee-to-mid and mid-to-foot run; spines point up and outward.
    const on = t < 0.6, u = on ? t / 0.6 : (t - 0.6) / 0.4;
    const px = on ? x0 + (x1 - x0) * u : x1 + (x2 - x1) * u, py = on ? y0 + (y1 - y0) * u : y1 + (y2 - y1) * u;
    const len = h * (0.085 - k * 0.014), w = h * 0.03;
    out.push({ k: 'poly', pts: [px - w, py + w * 0.3, px + w, py - w * 0.3, px + l.s * len * 0.8, py - len] });
  }
  return out;
}

function eyes(ctx: CanvasRenderingContext2D, cx: number, cy: number, h: number, col: string): void {
  // A big front pair, a medium pair above, and small ones out at the sides.
  eye(ctx, cx - h * 0.055, cy - h * 0.03, h * 0.036, col, false); eye(ctx, cx + h * 0.06, cy - h * 0.03, h * 0.038, col, false);
  eye(ctx, cx - h * 0.028, cy - h * 0.1, h * 0.022, col, false); eye(ctx, cx + h * 0.032, cy - h * 0.1, h * 0.022, col, false);
  eye(ctx, cx - h * 0.12, cy - h * 0.06, h * 0.016, col, false); eye(ctx, cx + h * 0.125, cy - h * 0.05, h * 0.016, col, false);
  eye(ctx, cx - h * 0.1, cy - h * 0.125, h * 0.013, col, false); eye(ctx, cx + h * 0.105, cy - h * 0.12, h * 0.013, col, false);
  // A glint on the big pair.
  if (h >= 40 && !B.override) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(Math.round(cx - h * 0.065), Math.round(cy - h * 0.04), 1, 1); ctx.fillRect(Math.round(cx + h * 0.05), Math.round(cy - h * 0.04), 1, 1);
  }
}

/** Two pale crisp fangs curving down and inward from the chelicerae. */
function fangs(ctx: CanvasRenderingContext2D, cx: number, cy: number, h: number, w: number, len: number, col: string): void {
  ctx.fillStyle = B.col(col);
  for (const s of [-1, 1]) {
    const bx = cx + s * h * 0.065, by = cy + h * 0.2;
    ctx.beginPath();
    ctx.moveTo(bx - s * w, by);
    ctx.quadraticCurveTo(bx - s * w * 0.2, by + len * 0.7, bx - s * w * 0.9, by + len);
    ctx.quadraticCurveTo(bx + s * w * 0.6, by + len * 0.55, bx + s * w, by);
    ctx.closePath(); ctx.fill();
  }
}

// ------------------------------------------------------------------ marsh spider ----
function marsh(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = rig(x, y, h, p.frame, p.breathe, 1);
  const { ax, ay, cx, cy } = R;
  // Slick near-black chitin with a bluish cast on the abdomen; the legs a hair darker.
  const hide = mix(p.base, '#141a30', 0.35);
  groundShadow(ctx, x + h * 0.02, y + 1, h * 1.9);
  // Rear pairs first: their own darker mass behind the body.
  blob(ctx, B, shade(hide, 0.72), R.legs.filter((l) => l.i >= 2).map((l) => legPart(l, h, 0.05, 0.016, 0.05)), { h, formK: 0.4, spread: 0.8 });
  // The body and the near legs: one mass. Abdomen a big lumpy glossy blob, cephalothorax lower in front,
  // pedipalps and chelicerae hanging off its front.
  const parts: Part[] = [
    { k: 'curve', pts: ring(ax, ay, h * 0.35, h * 0.28, 11, 1), wobble: 0.05, seed: 3, sub: 3, gloss: 0.6 },
    { k: 'curve', pts: ring(cx, cy, h * 0.19, h * 0.155, 9, 2), wobble: 0.04, seed: 5, sub: 3, gloss: 0.3 },
    { k: 'tube', pts: [cx - h * 0.1, cy + h * 0.05, cx - h * 0.2, cy + h * 0.16, cx - h * 0.17, cy + h * 0.28], r0: h * 0.035, r1: h * 0.02, wobble: 0.05, seed: 11 },
    { k: 'tube', pts: [cx + h * 0.11, cy + h * 0.05, cx + h * 0.22, cy + h * 0.15, cx + h * 0.2, cy + h * 0.28], r0: h * 0.035, r1: h * 0.02, wobble: 0.05, seed: 12 },
    { k: 'tube', pts: [cx - h * 0.06, cy + h * 0.1, cx - h * 0.07, cy + h * 0.22], r0: h * 0.048, r1: h * 0.04, seed: 13 },
    { k: 'tube', pts: [cx + h * 0.07, cy + h * 0.1, cx + h * 0.075, cy + h * 0.22], r0: h * 0.048, r1: h * 0.04, seed: 14 },
  ];
  for (const l of R.legs) if (l.i < 2) parts.push(legPart(l, h, 0.055, 0.017, 0.05));
  const creases: Crease[] = [
    { x0: cx - h * 0.14, y0: cy - h * 0.1, x1: cx + h * 0.1, y1: cy - h * 0.15, r: h * 0.035, a: 0.5 },
    { x0: cx - h * 0.02, y0: cy + h * 0.1, x1: cx + h * 0.03, y1: cy + h * 0.1, r: h * 0.02, a: 0.35 },
  ];
  blob(ctx, B, hide, parts, { h, formK: 0.65, gloss: 0.1, spread: 0.7, creases });
  // The pale hourglass on the abdomen: a mass inside, no line.
  const pale = shade(mix(p.light, '#d8d2c0', 0.75), p.tone);
  const hx = ax + h * 0.07, hy = ay + h * 0.03;
  blob(ctx, B, pale, [
    { k: 'curve', pts: [hx - h * 0.09, hy - h * 0.19, hx + h * 0.08, hy - h * 0.18, hx + h * 0.02, hy - h * 0.01, hx + h * 0.08, hy + h * 0.15, hx - h * 0.07, hy + h * 0.16, hx - h * 0.02, hy], wobble: 0.04, seed: 8, sub: 2 },
  ], { outline: false, formK: 0.35 });
  // The waist between the two body masses, and a fold over the eye cluster.
  softLine(ctx, B, [cx - h * 0.17, cy - h * 0.06, cx - h * 0.1, cy - h * 0.13, cx, cy - h * 0.16, cx + h * 0.1, cy - h * 0.14, cx + h * 0.17, cy - h * 0.07], hide, h * 0.028, 0.6);
  // Red eyes, lit from within.
  glow(ctx, B, cx, cy - h * 0.05, h * 0.14, '#ff3020', 0.25, '#ff8060');
  eyes(ctx, cx, cy, h, shade('#ff4a30', Math.max(0.6, p.tone)));
  // Wet fangs and a venom drip from the right one.
  const ivory = shade('#ece6d4', p.tone);
  fangs(ctx, cx, cy, h, h * 0.03, h * 0.14, ivory);
  const drip = (Math.sin(p.frame / 23) + 1) * 0.5;
  const dx = cx + h * 0.02, dy = cy + h * 0.33;
  blob(ctx, B, shade('#b8e070', p.tone), [
    { k: 'tube', pts: [dx, dy, dx + h * 0.003, dy + h * (0.03 + drip * 0.05)], r0: h * 0.008, r1: h * 0.016, gloss: 0.8 },
  ], { outline: false, formK: 0.7 });
}

// ------------------------------------------------------------------ thorn spider ----
function thorn(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = rig(x, y, h, p.frame, p.breathe, 1.02);
  const { ax, ay, cx, cy } = R;
  // Green-brown hide: the abdomen browner and matte, the legs the green of the thicket.
  const hide = mix(p.base, '#6a4a1c', 0.28);
  groundShadow(ctx, x + h * 0.02, y + 1, h * 1.95);
  const rear = R.legs.filter((l) => l.i >= 2);
  const rearParts: Part[] = rear.map((l) => legPart(l, h, 0.06, 0.02, 0.09));
  for (const l of rear) rearParts.push(...legThorns(l, h, 1));
  blob(ctx, B, shade(hide, 0.72), rearParts, { h, formK: 0.4, spread: 0.8 });
  // The abdomen with a ring of spikes, a knobbly cephalothorax, pedipalps, heavy chelicerae, the near legs with thorns.
  const parts: Part[] = [
    { k: 'curve', pts: ring(ax, ay, h * 0.35, h * 0.27, 10, 4), wobble: 0.06, spiky: 0.16, seed: 6, sub: 2, gloss: 0.15 },
    { k: 'curve', pts: ring(cx, cy, h * 0.21, h * 0.165, 9, 7), wobble: 0.06, spiky: 0.04, seed: 9, sub: 2 },
    { k: 'tube', pts: [cx - h * 0.11, cy + h * 0.05, cx - h * 0.23, cy + h * 0.15, cx - h * 0.2, cy + h * 0.3], r0: h * 0.04, r1: h * 0.022, wobble: 0.08, seed: 15 },
    { k: 'tube', pts: [cx + h * 0.12, cy + h * 0.05, cx + h * 0.25, cy + h * 0.14, cx + h * 0.23, cy + h * 0.3], r0: h * 0.04, r1: h * 0.022, wobble: 0.08, seed: 16 },
    { k: 'tube', pts: [cx - h * 0.065, cy + h * 0.1, cx - h * 0.075, cy + h * 0.23], r0: h * 0.058, r1: h * 0.05, wobble: 0.05, seed: 17 },
    { k: 'tube', pts: [cx + h * 0.075, cy + h * 0.1, cx + h * 0.085, cy + h * 0.23], r0: h * 0.058, r1: h * 0.05, wobble: 0.05, seed: 18 },
  ];
  // Big thorns crowning the abdomen.
  for (let i = 0; i < 4; i++) {
    const a = -2.7 + i * 0.62, bx = ax + Math.cos(a) * h * 0.3, by = ay + Math.sin(a) * h * 0.25, len = h * (0.11 + (i % 2) * 0.04);
    parts.push({ k: 'poly', pts: [bx - h * 0.04, by + h * 0.02, bx + h * 0.04, by, bx + Math.cos(a) * len, by + Math.sin(a) * len] });
  }
  for (const l of R.legs) if (l.i < 2) { parts.push(legPart(l, h, 0.065, 0.02, 0.09)); parts.push(...legThorns(l, h, 2)); }
  const creases: Crease[] = [
    { x0: cx - h * 0.15, y0: cy - h * 0.11, x1: cx + h * 0.11, y1: cy - h * 0.16, r: h * 0.04, a: 0.5 },
    { x0: cx - h * 0.02, y0: cy + h * 0.1, x1: cx + h * 0.03, y1: cy + h * 0.1, r: h * 0.022, a: 0.35 },
  ];
  blob(ctx, B, hide, parts, { h, formK: 0.6, tex: 'stipple', seed: 21, amount: 0.7, creases });
  // Two pale streaks down the back of the abdomen, inside the mass, no line.
  blob(ctx, B, shade(mix(p.light, '#b0b068', 0.45), p.tone), [
    { k: 'curve', pts: [ax - h * 0.16, ay - h * 0.22, ax - h * 0.08, ay - h * 0.24, ax - h * 0.03, ay + h * 0.02, ax - h * 0.09, ay + h * 0.05], wobble: 0.06, seed: 19, sub: 2 },
    { k: 'curve', pts: [ax + h * 0.05, ay - h * 0.24, ax + h * 0.13, ay - h * 0.2, ax + h * 0.1, ay + h * 0.03, ax + h * 0.03, ay + h * 0.02], wobble: 0.06, seed: 23, sub: 2 },
  ], { outline: false, formK: 0.3 });
  softLine(ctx, B, [cx - h * 0.19, cy - h * 0.06, cx - h * 0.11, cy - h * 0.14, cx, cy - h * 0.175, cx + h * 0.11, cy - h * 0.15, cx + h * 0.19, cy - h * 0.07], hide, h * 0.03, 0.6);
  // Amber-green eyes and heavy fangs.
  glow(ctx, B, cx, cy - h * 0.05, h * 0.13, '#c0d040', 0.18, '#f0f090');
  eyes(ctx, cx, cy, h, shade('#d8e048', Math.max(0.6, p.tone)));
  fangs(ctx, cx, cy, h, h * 0.04, h * 0.17, shade('#e4dcc4', p.tone));
}
