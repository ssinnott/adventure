// The spider family: marsh spider and thorn spider. An arachnid is two bulbs on a narrow waist,
// and both are the same chitin, so unioning them into one mass the way a single material usually
// wants leaves an undifferentiated blob with legs. Each body SECTION is therefore its own blob
// with its own contour: the abdomen, then the cephalothorax and its mouthparts over it, then the
// near legs over that; the rear legs are a darker mass behind everything. A leg reads as segmented
// because the knee carries a swelling and a crease, and the shin is visibly thinner than the
// thigh. Facing the party in a slight three-quarter; idle is a leg twitch and an abdomen bob.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, softLine, glow, patch } from './gloss.ts';
import type { Part, Crease } from './gloss.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';

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
  // Measured off a huntsman seen head on: the body is SMALL inside the leg span, and every knee
  // rises well above the carapace. The old rig had the knees below the abdomen, which is why the
  // animal read as a lump with bent wires attached rather than as a spider braced on eight legs.
  // The reference's span is some seven carapace-widths across; this is pulled in to a little under
  // two sprite heights so that a row of six still fits the combat line without burying each other.
  const cx = x + h * 0.14, cy = y - h * 0.30 + bob * 0.4;
  const ax = x - h * 0.15, ay = y - h * 0.56 + bob;
  // Fanned: the front pair reaches forward, the rear pair back. The shin bows OUTWARD between knee
  // and foot, which is what stops a leg reading as two straight rods hinged in the middle.
  const L = [
    { kx: 0.38, ky: 0.94, mx: 0.64, my: 0.40, fx: 0.55, fy: 0.02 },
    { kx: 0.52, ky: 1.04, mx: 0.86, my: 0.42, fx: 0.78, fy: 0.03 },
    { kx: 0.57, ky: 1.06, mx: 0.93, my: 0.46, fx: 0.86, fy: 0.07 },
    { kx: 0.48, ky: 1.00, mx: 0.82, my: 0.52, fx: 0.75, fy: 0.14 },
  ];
  const legs: Leg[] = [];
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const d = L[i];
    // The right-hand legs (the side turned toward us) stand a touch wider and higher; a slow twitch per leg.
    const wide = s > 0 ? 1.06 : 0.94, tw = Math.sin(frame / 8 + i * 1.9 + s * 0.7) * h * 0.012;
    const hx = cx + s * h * 0.225, hy = cy + h * 0.03 + (i - 1.5) * h * 0.036;
    const kx = x + s * h * d.kx * spread * wide, ky = y - h * d.ky + tw;
    const mx = x + s * h * d.mx * spread * wide, my = y - h * d.my + tw * 0.5;
    const fx = x + s * h * d.fx * spread * wide, fy = y - h * d.fy;
    // Points either side of the knee: the tube samples the bend densely, so the joint rounds like a
    // patella instead of coming out as a chamfered plate.
    legs.push({ s, i, pts: [hx, hy, kx + (hx - kx) * 0.22, ky + (hy - ky) * 0.22, kx, ky, kx + (mx - kx) * 0.2, ky + (my - ky) * 0.2, mx, my, fx, fy] });
  }
  return { ax, ay, cx, cy, legs };
}

/**
 * Dark bands at the joints and blotches along the segments, plus the fine hairs that break a
 * spider's leg silhouette. On the reference these are the loudest thing about the animal after the
 * span itself: a plain tapered tube reads as wire, a banded and bristled one reads as a leg.
 */
function legMarks(ctx: CanvasRenderingContext2D, legs: readonly Leg[], h: number, band: string): void {
  if (B.override || h < 26) return;
  for (const l of legs) {
    const p = l.pts;
    const seg: [number, number, number, number][] = [[p[0], p[1], p[4], p[5]], [p[4], p[5], p[8], p[9]], [p[8], p[9], p[10], p[11]]];
    seg.forEach(([x0, y0, x1, y1], k) => {
      const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      // Wide enough to cross the whole limb, or it reads as a scratch laid on one instead.
      const r = h * (0.062 - k * 0.017);
      for (const t of k === 2 ? [0.5] : [0.3, 0.68]) {
        const bx = x0 + dx * t, by = y0 + dy * t;
        softLine(ctx, B, [bx - nx * r, by - ny * r, bx + nx * r, by + ny * r], band, Math.max(1, h * (0.028 - k * 0.007)), 0.5);
      }
    });
  }
}

/**
 * One leg as three segments plus a knee: a thick femur up to the raised knee, a swelling at the
 * joint, then a clearly thinner shin and a thin foot. A single tapered tube from hip to toe reads
 * as wire; the step in thickness and the knuckle at the bend are what say "jointed limb". The
 * taper is steep, near three to one from femur to tarsus, which is what the reference shows.
 */
function legParts(l: Leg, h: number, r0: number, r1: number, wobble: number): Part[] {
  const p = l.pts, seed = 20 + l.i * 2 + (l.s > 0 ? 1 : 0);
  const knee = [p[4], p[5]], mid = [p[8], p[9]], foot = [p[10], p[11]];
  return [
    { k: 'tube', pts: [p[0], p[1], p[2], p[3], knee[0], knee[1]], r0: h * r0, r1: h * r0 * 0.62, wobble, seed },
    { k: 'ball', x: knee[0], y: knee[1], r: h * r0 * 0.72 },
    { k: 'tube', pts: [knee[0], knee[1], p[6], p[7], mid[0], mid[1]], r0: h * r0 * 0.56, r1: h * r0 * 0.3, wobble, seed: seed + 40 },
    { k: 'tube', pts: [mid[0], mid[1], foot[0], foot[1]], r0: h * r0 * 0.3, r1: h * r1, wobble, seed: seed + 80 },
  ];
}

/**
 * A crease ACROSS each knee, laid perpendicular to the shin so it reads as the fold of a joint.
 * Laid horizontally it becomes a dark bar lying over a diagonal leg.
 */
function legCreases(legs: readonly Leg[], h: number, r: number): Crease[] {
  return legs.map((l) => {
    const kx = l.pts[4], ky = l.pts[5], dx = l.pts[8] - kx, dy = l.pts[9] - ky, len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len * h * r, ny = dx / len * h * r;
    return { x0: kx - nx, y0: ky - ny, x1: kx + nx, y1: ky + ny, r: h * r * 0.32, a: 0.38 };
  });
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
  // Eight in two tight rows across the front of the carapace, the front row the larger: on the
  // reference they occupy a patch barely a third of the carapace's width, which is what makes them
  // read as a cluster of eyes rather than as scattered dots.
  const w = h * 0.052, r0 = h * 0.021, r1 = h * 0.014;
  for (let i = 0; i < 4; i++) {
    const t = (i - 1.5) / 1.5;
    eye(ctx, cx + t * w, cy - h * 0.012, i === 1 || i === 2 ? r0 : r0 * 0.82, col, false);
  }
  for (let i = 0; i < 4; i++) {
    const t = (i - 1.5) / 1.5;
    eye(ctx, cx + t * w * 1.12, cy - h * 0.055, i === 1 || i === 2 ? r1 : r1 * 0.85, col, false);
  }
  if (h >= 44 && !B.override) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (const [dx, dy] of [[-0.35, -0.012], [0.35, -0.012]]) {
      ctx.beginPath(); ctx.arc(cx + dx * w, cy - h * 0.012 + dy * h, Math.max(0.6, r0 * 0.3), 0, Math.PI * 2); ctx.fill();
    }
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
  const hide = mix(p.base, '#2a3050', 0.3);
  groundShadow(ctx, x + h * 0.02, y + 1, h * 1.9);
  const rear = R.legs.filter((l) => l.i >= 2), near = R.legs.filter((l) => l.i < 2);
  // Rear pairs first: their own darker mass behind everything.
  blob(ctx, B, shade(hide, 0.7), rear.flatMap((l) => legParts(l, h, 0.05, 0.014, 0.04)), { h, formK: 0.4, spread: 0.8, creases: legCreases(rear, h, 0.04) });
  legMarks(ctx, rear, h, shade(hide, 0.46));
  // The abdomen: the big rear bulb, its own contour so the waist reads.
  blob(ctx, B, hide, [{ k: 'curve', pts: ring(ax, ay, h * 0.32, h * 0.27, 11, 1), wobble: 0.05, seed: 3, sub: 3 }], { h, formK: 0.5, gloss: 0.5, spread: 0.7 });
  // The hourglass: a marking, but a crisp one. A spider's mark has an edge.
  const pale = shade(mix(p.light, '#d8d2c0', 0.75), p.tone);
  const hx = ax + h * 0.02, hy = ay - h * 0.04, hw = h * 0.075, hl = h * 0.13, waist = h * 0.017;
  patch(ctx, B, pale, [
    { k: 'poly', pts: [hx - hw, hy - hl, hx + hw, hy - hl, hx + waist, hy, hx + hw, hy + hl, hx - hw, hy + hl, hx - waist, hy] },
  ], { alpha: 0.7, feather: 0.2 });
  // The pedicel: the narrow stalk the two bulbs hang from, drawn under the front bulb.
  blob(ctx, B, shade(hide, 0.82), [{ k: 'tube', pts: [ax + h * 0.22, ay + h * 0.14, cx - h * 0.1, cy - h * 0.06], r0: h * 0.07, r1: h * 0.08 }], { h, form: false });
  blob(ctx, B, shade(hide, 0.94), near.flatMap((l) => legParts(l, h, 0.055, 0.015, 0.04)), { h, formK: 0.5, spread: 0.75, creases: legCreases(near, h, 0.045) });
  legMarks(ctx, near, h, shade(hide, 0.46));
  // The cephalothorax and its mouthparts, drawn AFTER the near legs so it covers their roots: on
  // the reference the legs disappear under the carapace's rim rather than crossing its face, which
  // is what stops eight limbs converging on the eyes and reading as legs out of a head.
  const front: Part[] = [
    { k: 'curve', pts: ring(cx, cy, h * 0.315, h * 0.255, 9, 2), wobble: 0.04, seed: 5, sub: 3, gloss: 0.12 },
    { k: 'tube', pts: [cx - h * 0.1, cy + h * 0.05, cx - h * 0.2, cy + h * 0.16, cx - h * 0.17, cy + h * 0.28], r0: h * 0.035, r1: h * 0.02, wobble: 0.05, seed: 11 },
    { k: 'tube', pts: [cx + h * 0.11, cy + h * 0.05, cx + h * 0.22, cy + h * 0.15, cx + h * 0.2, cy + h * 0.28], r0: h * 0.035, r1: h * 0.02, wobble: 0.05, seed: 12 },
    { k: 'tube', pts: [cx - h * 0.06, cy + h * 0.1, cx - h * 0.07, cy + h * 0.22], r0: h * 0.05, r1: h * 0.042, seed: 13 },
    { k: 'tube', pts: [cx + h * 0.07, cy + h * 0.1, cx + h * 0.075, cy + h * 0.22], r0: h * 0.05, r1: h * 0.042, seed: 14 },
  ];
  blob(ctx, B, shade(hide, 1.06), front, { h, formK: 0.38, gloss: 0.1, spread: 0.75, creases: [
    { x0: cx - h * 0.02, y0: cy + h * 0.1, x1: cx + h * 0.03, y1: cy + h * 0.1, r: h * 0.02, a: 0.35 },
  ] });
  // A fold over the eye cluster, then the near legs on top, each with its own contour against the body.
  softLine(ctx, B, [cx - h * 0.17, cy - h * 0.07, cx - h * 0.1, cy - h * 0.14, cx, cy - h * 0.17, cx + h * 0.1, cy - h * 0.15, cx + h * 0.17, cy - h * 0.08], hide, h * 0.028, 0.6);
  // Red eyes, lit from within.
  glow(ctx, B, cx, cy - h * 0.095, h * 0.15, '#ff3020', 0.25, '#ff8060');
  eyes(ctx, cx, cy - h * 0.095, h, shade('#ff4a30', Math.max(0.6, p.tone)));
  // Wet fangs and a venom drip from the right one.
  const ivory = shade('#ece6d4', p.tone);
  fangs(ctx, cx, cy + h * 0.035, h, h * 0.03, h * 0.14, ivory);
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
  const rear = R.legs.filter((l) => l.i >= 2), near = R.legs.filter((l) => l.i < 2);
  const rearParts: Part[] = rear.flatMap((l) => legParts(l, h, 0.058, 0.017, 0.07));
  for (const l of rear) rearParts.push(...legThorns(l, h, 1));
  blob(ctx, B, shade(hide, 0.7), rearParts, { h, formK: 0.4, spread: 0.8, creases: legCreases(rear, h, 0.045) });
  legMarks(ctx, rear, h, shade(hide, 0.48));
  // The abdomen: the big rear bulb, spiked, its own contour so the waist reads.
  const abdomen: Part[] = [{ k: 'curve', pts: ring(ax, ay, h * 0.33, h * 0.27, 10, 4), wobble: 0.06, spiky: 0.16, seed: 6, sub: 2 }];
  for (let i = 0; i < 4; i++) {
    const a = -2.7 + i * 0.62, bx = ax + Math.cos(a) * h * 0.3, by = ay + Math.sin(a) * h * 0.25, len = h * (0.11 + (i % 2) * 0.04);
    abdomen.push({ k: 'poly', pts: [bx - h * 0.04, by + h * 0.02, bx + h * 0.04, by, bx + Math.cos(a) * len, by + Math.sin(a) * len] });
  }
  blob(ctx, B, hide, abdomen, { h, formK: 0.45, tex: 'stipple', seed: 21, amount: 0.7, gloss: 0.12, spread: 0.7 });
  // Two pale streaks down the back: a marking with an edge, not a haze.
  patch(ctx, B, shade(mix(p.light, '#b0b068', 0.45), p.tone), [
    { k: 'curve', pts: [ax - h * 0.16, ay - h * 0.22, ax - h * 0.08, ay - h * 0.24, ax - h * 0.03, ay + h * 0.02, ax - h * 0.09, ay + h * 0.05], wobble: 0.06, seed: 19, sub: 2 },
    { k: 'curve', pts: [ax + h * 0.05, ay - h * 0.24, ax + h * 0.13, ay - h * 0.2, ax + h * 0.1, ay + h * 0.03, ax + h * 0.03, ay + h * 0.02], wobble: 0.06, seed: 23, sub: 2 },
  ], { alpha: 0.75, feather: 0.2 });
  // The pedicel, then the knobbly cephalothorax and its mouthparts over the abdomen.
  blob(ctx, B, shade(hide, 0.82), [{ k: 'tube', pts: [ax + h * 0.22, ay + h * 0.14, cx - h * 0.1, cy - h * 0.06], r0: h * 0.075, r1: h * 0.085 }], { h, form: false });
  const nearParts: Part[] = near.flatMap((l) => legParts(l, h, 0.062, 0.018, 0.07));
  for (const l of near) nearParts.push(...legThorns(l, h, 2));
  blob(ctx, B, shade(hide, 0.92), nearParts, { h, formK: 0.5, spread: 0.75, creases: legCreases(near, h, 0.05) });
  legMarks(ctx, near, h, shade(hide, 0.48));
  const front: Part[] = [
    { k: 'curve', pts: ring(cx, cy, h * 0.325, h * 0.26, 9, 7), wobble: 0.06, spiky: 0.04, seed: 9, sub: 2 },
    { k: 'tube', pts: [cx - h * 0.11, cy + h * 0.05, cx - h * 0.23, cy + h * 0.15, cx - h * 0.2, cy + h * 0.3], r0: h * 0.04, r1: h * 0.022, wobble: 0.08, seed: 15 },
    { k: 'tube', pts: [cx + h * 0.12, cy + h * 0.05, cx + h * 0.25, cy + h * 0.14, cx + h * 0.23, cy + h * 0.3], r0: h * 0.04, r1: h * 0.022, wobble: 0.08, seed: 16 },
    { k: 'tube', pts: [cx - h * 0.065, cy + h * 0.1, cx - h * 0.075, cy + h * 0.23], r0: h * 0.06, r1: h * 0.052, wobble: 0.05, seed: 17 },
    { k: 'tube', pts: [cx + h * 0.075, cy + h * 0.1, cx + h * 0.085, cy + h * 0.23], r0: h * 0.06, r1: h * 0.052, wobble: 0.05, seed: 18 },
  ];
  blob(ctx, B, shade(hide, 1.08), front, { h, formK: 0.55, tex: 'stipple', seed: 24, amount: 0.5, creases: [
    { x0: cx - h * 0.02, y0: cy + h * 0.1, x1: cx + h * 0.03, y1: cy + h * 0.1, r: h * 0.022, a: 0.35 },
  ] });
  softLine(ctx, B, [cx - h * 0.19, cy - h * 0.07, cx - h * 0.11, cy - h * 0.15, cx, cy - h * 0.185, cx + h * 0.11, cy - h * 0.16, cx + h * 0.19, cy - h * 0.08], hide, h * 0.03, 0.6);
  // Amber-green eyes and heavy fangs.
  glow(ctx, B, cx, cy - h * 0.1, h * 0.14, '#c0d040', 0.18, '#f0f090');
  eyes(ctx, cx, cy - h * 0.1, h, shade('#d8e048', Math.max(0.6, p.tone)));
  fangs(ctx, cx, cy + h * 0.04, h, h * 0.04, h * 0.17, shade('#e4dcc4', p.tone));
}
