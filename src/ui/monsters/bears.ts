// The bears: the Pine Bear first, on one frame the Glass Bear frosts and Rimewater's ice bear
// whitens. A bear on all fours, side on to the company with the head turned to it, in units of the
// sprite's height up from the ground line: the shoulder hump is the highest point on it, the back
// runs nearly level to a rump almost as high, and the barrel hangs deep between thick straight legs
// on flat feet, the claws showing pale in front of each forepaw. The head is broad and short-eared
// on a neck as thick as itself, carried low, with a paler muzzle, a black nose and small eyes set
// close. Fur hangs in a ragged fringe under the belly and behind the forelegs, and the hump's long
// hairs are pale at the tips. Drawn as masses: the far legs a step darker, then the hide in one
// blob (body, hump, neck and the near legs), the head as its own form over it, the paws and claws
// on top.
//
// The Pine Bear: a bear, and then the rest of the bear. Brown, grizzled over the hump. Idle: the
// barrel breathes, the head swings low and the nose works, and now and then the bear rocks back
// on its haunches and lifts its forepaws off the ground.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glossBall, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['pine_bear'];

/**
 * The frame's parts, as proportions of the pine bear's (1 = the pine bear, 0 = none), each named
 * for the bear that pushes it furthest, so the glass bear and the ice bear are a Build and a
 * colouring.
 */
interface Build {
  /** Depth of the barrel, the belly's hang under the back. */
  bulk: number;
  /** Height of the shoulder hump over the back: the pine bear's grizzly hump; the ice bear's is low. */
  hump: number;
  /** Size of the head; the ice bear's is smaller on a longer neck. */
  head: number;
  /** Length of the muzzle: the ice bear's is longer. */
  snout: number;
  /** Size of the round ears: the ice bear's are smaller. */
  ears: number;
  /** How far the fur hangs ragged at the belly, the legs and the hump. */
  shag: number;
  /** Length of the claws in front of the forepaws. */
  claws: number;
  /** The pale tips on the hump and the shoulders, 0..1. */
  grizzle: number;
  /** The muzzle's colour, mixed into the tint. */
  muzzle: string;
  /** Glass grown through the fur like frost, 0 for none: the glass bear's (#243). */
  frost: number;
  /** The glass's colour. */
  frostColour: string;
}
const PINE: Build = { bulk: 1, hump: 1, head: 1, snout: 1, shag: 1, claws: 1, grizzle: 0.42, muzzle: '#c8a478', frost: 0, frostColour: '#d8eaf4', ears: 1 };

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  bear(ctx, x, y, h, p, PINE);
};

/** A ring of n points round (cx, cy), the raw contour a 'curve' part lumps further. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number, rot = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, c = Math.cos(a) * rx, s = Math.sin(a) * ry;
    o.push(cx + c * Math.cos(rot) - s * Math.sin(rot), cy + c * Math.sin(rot) + s * Math.cos(rot));
  }
  return o;
}

/**
 * How far the bear has rocked back, 0..1: on all fours most of the time, and once in a long while
 * up off its forepaws for a breath and down again. Held at its height for a moment so it reads.
 */
function rearAt(frame: number): number {
  const t = frame % 200;
  if (t >= 60) return 0;
  const k = t / 60;                      // 0..1 over the rise, the hold and the drop
  const up = k < 0.3 ? k / 0.3 : k < 0.7 ? 1 : (1 - k) / 0.3;
  return up * up * (3 - 2 * up);
}

function bear(ctx: CanvasRenderingContext2D, x0: number, y: number, h: number, p: Paint, b: Build): void {
  const t = p.frame, br = p.breathe * h * 0.006, tone = p.tone;
  // The head reaches out to the right; shift the mass left so the whole bear is centred on x0.
  const x = x0 - h * 0.06;
  // Seen three-quarter on, the body runs back from the company: its length is foreshortened.
  const X = (u: number): number => x + u * h * 0.8;
  const U = (u: number): number => y - u * h;
  const hide = p.base, far = shade(p.dark, 0.9);
  const tips = mix(hide, shade('#e6d6b4', tone), 0.6);
  const snoutCol = mix(hide, shade(b.muzzle, tone), 0.7);
  const ink = shade('#16100c', Math.max(0.6, tone));
  const claw = shade('#d8ccb4', Math.max(0.6, tone));

  // The rear: the forequarters lift about the hind feet. `lift` raises a point by how far forward
  // it is, so the hind feet stay put and the head goes up most.
  const r = rearAt(t), pitch = r * 0.3;
  const L = (u: number, v: number): [number, number] => {
    const du = u + 0.5, a = pitch;                  // pivot at the hind feet
    if (a <= 0) return [X(u), U(v)];
    return [X(-0.5 + du * Math.cos(a) - v * Math.sin(a) * 0.35), U(du * Math.sin(a) + v * Math.cos(a))];
  };
  const pt = (pts: readonly number[]): number[] => {
    const o: number[] = [];
    for (let i = 0; i < pts.length; i += 2) o.push(...L(pts[i], pts[i + 1]));
    return o;
  };
  const sway = Math.sin(t / 23) * 0.012, sniff = (t % 90) < 14 ? Math.sin(((t % 90) / 14) * Math.PI * 2) * 0.006 : 0;
  const hm = 0.1 * b.hump, bk = 0.06 * (b.bulk - 1);
  const head = b.head, sn = b.snout;

  groundShadow(ctx, X(0.04), y + 1, h * 1.42);

  // --- the far legs: a step darker, behind everything --------------------------------------------
  const farFore = pt([0.1, 0.56, 0.1, 0.32, 0.09, 0.08]);
  blob(ctx, B, far, [
    { k: 'tube', pts: pt([-0.6, 0.6, -0.6, 0.34, -0.61, 0.08]), r0: h * 0.1, r1: h * 0.068 },
    { k: 'tube', pts: farFore, r0: h * 0.085, r1: h * 0.066 },
    { k: 'ell', x: L(-0.58, 0.04)[0], y: L(-0.58, 0.04)[1], rx: h * 0.085, ry: h * 0.045 },
    { k: 'ell', x: L(0.12, 0.04)[0], y: L(0.12, 0.04)[1], rx: h * 0.08, ry: h * 0.042 },
  ], { h, formK: 0.4, tex: 'fur', seed: 31, amount: 0.4 });

  // --- the hide: barrel, hump, rump and the near legs, one mass ----------------------------------
  const sh = 0.05 * b.shag;
  const body: Part[] = [
    { k: 'curve', pts: pt([
      -0.76, 0.54, -0.75, 0.68, -0.68, 0.79, -0.54, 0.85 + br / h, -0.32, 0.86 + br / h,
      -0.1, 0.88 + hm * 0.4 + br / h, 0.06, 0.88 + hm + br / h, 0.19, 0.86 + hm, 0.31, 0.8 + hm * 0.5, 0.41, 0.68,
      0.4, 0.5, 0.32, 0.4 - bk - sh * 0.4, 0.12, 0.34 - bk - sh, -0.14, 0.32 - bk - sh,
      -0.38, 0.35 - bk - sh * 0.6, -0.58, 0.4, -0.71, 0.46,
    ]), wobble: 0.025, spiky: 0.035 * b.shag, seed: 1, sub: 4 },
    // The haunch, round under the hide.
    { k: 'ell', x: L(-0.54, 0.62)[0], y: L(-0.54, 0.62)[1], rx: h * 0.19, ry: h * 0.2 },
    // The near legs: a pillar at the shoulder, a heavy thigh behind.
    { k: 'tube', pts: pt([0.26, 0.6, 0.27, 0.34, 0.27, 0.09]), r0: h * 0.11, r1: h * 0.08 },
    { k: 'tube', pts: pt([-0.48, 0.6, -0.44, 0.36, -0.46, 0.09]), r0: h * 0.13, r1: h * 0.08 },
    // The neck, as thick as the head, low off the shoulders.
    { k: 'tube', pts: pt([0.24, 0.74, 0.4, 0.7, 0.5, 0.64]), r0: h * 0.17, r1: h * 0.13 * head },
  ];
  // The fringe: long hair hanging behind each foreleg and under the barrel.
  if (b.shag > 0) {
    body.push({ k: 'curve', pts: pt([0.14, 0.46, 0.2, 0.3 - 0.05 * b.shag, 0.24, 0.42, 0.18, 0.55]), wobble: 0.1, spiky: 0.3 * b.shag, seed: 4, sub: 3 });
    body.push({ k: 'curve', pts: pt([-0.4, 0.4, -0.32, 0.26 - 0.03 * b.shag, -0.38, 0.32]), wobble: 0.1, spiky: 0.3 * b.shag, seed: 6, sub: 3 });
  }
  const [cx1, cy1] = L(0.36, 0.86), [cx2, cy2] = L(0.38, 0.42);
  const [hx1, hy1] = L(-0.3, 0.8), [hx2, hy2] = L(-0.32, 0.4);
  const [bx1, by1] = L(-0.3, 0.4), [bx2, by2] = L(0.14, 0.38);
  blob(ctx, B, hide, body, { h, tex: 'fur', seed: 3, amount: 0.65, formK: 0.3, spread: 0.9, creases: [
    { x0: cx1, y0: cy1, x1: cx2, y1: cy2, r: h * 0.03, a: 0.16 },   // behind the jaw, down the neck
    { x0: hx1, y0: hy1, x1: hx2, y1: hy2, r: h * 0.03, a: 0.14 },  // in front of the haunch
    { x0: bx1, y0: by1, x1: bx2, y1: by2, r: h * 0.03, a: 0.12 },    // the belly
  ] });
  // The grizzle: long guard hairs pale at the tips over the hump and down the shoulder.
  if (b.grizzle > 0) {
    patch(ctx, B, tips, [{ k: 'curve', pts: pt([-0.14, 0.84, 0.04, 0.92 + hm, 0.2, 0.9 + hm, 0.32, 0.78, 0.24, 0.62, 0.06, 0.68, -0.1, 0.74]), wobble: 0.12, seed: 45, sub: 2 }], { alpha: b.grizzle, feather: 1 });
    if (!B.override && h >= 56) {
      // A few longer strands, the hump's own, catching the light.
      for (let i = 0; i < 9; i++) {
        const u = -0.08 + i * 0.045, v = 0.86 + hm * Math.sin(Math.PI * (i / 8)) * 0.9;
        const [sx, sy] = L(u, v), [ex, ey] = L(u - 0.03, v - 0.07);
        softLine(ctx, B, [sx, sy, ex, ey], tips, Math.max(1, h * 0.008), 0.9);
        ctx.strokeStyle = rgba(tips, 0.6); ctx.lineWidth = Math.max(1, h * 0.006);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
      }
    }
  }

  // --- the head: broad, turned to the company, carried low ----------------------------------------
  const hc = L(0.6 + sway, 0.6 + sway * 0.5);
  const hr = h * 0.17 * head;
  const mz = L(0.6 + sway + 0.17 * sn, 0.53 + sway * 0.5 + sniff);
  const tilt = -pitch * 0.6;
  // The ears, round and furred, set wide on the crown: drawn first so the skull covers their roots.
  blob(ctx, B, shade(hide, 0.9), [
    { k: 'curve', pts: ring(hc[0] - hr * 0.62, hc[1] - hr * 0.86, hr * 0.3 * b.ears, hr * 0.28 * b.ears, 8), wobble: 0.08, spiky: 0.18, seed: 13, sub: 2 },
    { k: 'curve', pts: ring(hc[0] + hr * 0.5, hc[1] - hr * 0.92, hr * 0.28 * b.ears, hr * 0.27 * b.ears, 8), wobble: 0.08, spiky: 0.18, seed: 14, sub: 2 },
  ], { h, formK: 0.5 });
  if (!B.override) {
    ctx.fillStyle = rgba(ink, 0.45);
    for (const [ex, ey, er] of [[hc[0] - hr * 0.6, hc[1] - hr * 0.85, hr * 0.15 * b.ears], [hc[0] + hr * 0.5, hc[1] - hr * 0.9, hr * 0.14 * b.ears]]) { ctx.beginPath(); ctx.arc(ex, ey + er * 0.2, er, 0, Math.PI * 2); ctx.fill(); }
  }
  // The skull and the cheeks' ruff as one, and the muzzle off it toward the company's right.
  blob(ctx, B, hide, [
    { k: 'curve', pts: ring(hc[0], hc[1], hr * 1.08, hr * 0.92, 12, tilt), wobble: 0.05, spiky: 0.07 * b.shag, seed: 11, sub: 3 },
    { k: 'cap', x0: hc[0] + hr * 0.2, y0: hc[1] + hr * 0.15, x1: mz[0], y1: mz[1], r0: hr * 0.62, r1: hr * 0.42 },
  ], { h, tex: 'fur', seed: 12, amount: 0.45, formK: 0.5, spread: 0.85 });
  // The paler muzzle, and the brow's shadow over the eyes.
  patch(ctx, B, snoutCol, [{ k: 'cap', x0: hc[0] + hr * 0.35, y0: hc[1] + hr * 0.25, x1: mz[0], y1: mz[1], r0: hr * 0.5, r1: hr * 0.4 }], { alpha: 0.75, feather: 0.55 });
  patch(ctx, B, ink, [{ k: 'ell', x: hc[0] + hr * 0.1, y: hc[1] - hr * 0.1, rx: hr * 0.7, ry: hr * 0.18, rot: tilt }], { alpha: 0.18, feather: 0.8 });
  // The nose: black, wet, broad at the end of the muzzle; the mouth a line back under it.
  glossBall(ctx, B, mz[0] + hr * 0.18, mz[1] - hr * 0.06, hr * 0.24, ink, { gloss: 0.6 });
  if (!B.override) {
    ctx.fillStyle = '#060404';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(mz[0] + hr * (0.2 + s * 0.1), mz[1] + hr * 0.04, hr * 0.055, hr * 0.04, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  softLine(ctx, B, [mz[0] + hr * 0.12, mz[1] + hr * 0.22, mz[0] - hr * 0.2, mz[1] + hr * 0.36, hc[0] + hr * 0.25, hc[1] + hr * 0.62], hide, Math.max(1, h * 0.012), 0.75);
  // Small eyes set close, dark, under the brow: a bear's are the smallest thing on its face.
  for (const [ex, ey] of [[hc[0] - hr * 0.05, hc[1] - hr * 0.02], [hc[0] + hr * 0.45, hc[1] - hr * 0.06]]) {
    eye(ctx, ex, ey, Math.max(1, hr * 0.1), shade('#2a1810', Math.max(0.7, tone)), false);
    if (!B.override && hr > 10) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(ex - hr * 0.03, ey - hr * 0.04, Math.max(0.6, hr * 0.03), 0, Math.PI * 2); ctx.fill(); }
  }

  // --- the near paws, and the claws ---------------------------------------------------------------
  const paws: Part[] = [];
  const nearFore = L(0.29, 0.045), nearHind = L(-0.44, 0.045);
  paws.push({ k: 'ell', x: nearFore[0], y: nearFore[1], rx: h * 0.1, ry: h * 0.05, rot: -pitch });
  paws.push({ k: 'ell', x: nearHind[0], y: nearHind[1], rx: h * 0.11, ry: h * 0.048 });
  blob(ctx, B, shade(hide, 0.82), paws, { h, formK: 0.45, tex: 'fur', seed: 21, amount: 0.3 });
  if (b.claws > 0) {
    const cl = h * 0.045 * b.claws;
    for (const [fx, fy, k] of [[nearFore[0] + h * 0.05, nearFore[1], 1], [L(0.14, 0.045)[0] + h * 0.04, L(0.14, 0.045)[1], 0.75], [nearHind[0] + h * 0.06, nearHind[1] + h * 0.005, 0.6]] as const) {
      const parts: Part[] = [];
      for (let i = 0; i < 4; i++) {
        const sx = fx + (i - 1.5) * h * 0.022 * k, sy = fy + h * 0.012;
        parts.push({ k: 'tube', pts: [sx, sy, sx + cl * 0.55 * k, sy + cl * 0.15, sx + cl * 0.85 * k, sy + cl * 0.55 * k], r0: h * 0.009 * k + 0.5, r1: 0.5 });
      }
      blob(ctx, B, k < 1 ? shade(claw, 0.8) : claw, parts, { h, formK: 0.3 });
    }
  }
}
