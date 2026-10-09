// The heavy machines: the Stoker first, and of the same make the Sentry and the Sentinel, as Meridian
// Camp's flue walker, the Dead-Drop's loader and the Core's sentry are to be made (MONSTERS §11). Not
// the knockers' smooth shells on rods nor the keepers' grey frames under a robe: the hull's own heavy
// work, in plain plate riveted along ruled seams and joined at drums, each a disc with a hub, at the
// shoulder, the elbow and the knee. Every one stands on the same legs, a rod of a thigh, a drum at the
// knee, a greave of plate and a flat foot, and every one has the same fire in it, seen only where the
// plate opens: the Stoker's furnace door, the Sentry's eye, the Sentinel's visor and the crack down its
// chest. Each carries the chisel's mark once, cut small in its plate (knockers.ts): the makers' mark,
// as on every knocker and keeper. Drawn front on, as masses: the far arm a step darker, the legs, the
// body, then what opens in it, the near arm and the shoulders' drums over all.
//
// The Stoker: a boiler on two short bowed legs, banded and riveted, its dome black with soot and a
// stack on it; in its belly the furnace door, iron-framed and hinged, the fire behind its grille. Its
// near arm is a shovel, a haft from the elbow and a square blade worn bright at the lip; the far arm
// hangs, a clamp for a hand. Idle: it shovels at nothing beside it, the blade lifting and coming
// back, and the fire breathes.
//
// The Sentry: the watcher, leaner and upright on long legs, a keel of a chest on a drum of a waist;
// for a head the eye, a lamp in a drum on a short neck, under a brow of plate. The near arm is long,
// hanging past the knee to an open clamp; the far arm is short and its clamp shut. Idle: the eye
// turns, side to side.
//
// The Sentinel: the door's keeper, and the family at its largest and plainest: a block of plate on
// short legs planted wide, a skirt of plate, the family's drums at their greatest in the block's
// corners and both arms hanging to fists like anvils; the head small and sunk between the shoulders,
// a slit of fire for a visor, and down its chest a line like the one between two doors, the fire
// showing through it. Size 2, drawn inside the tall boss's crown (TALL_REACH,
// src/ui/grouplabels.ts). Idle: the fire in it pulses, slow.
//
// The Loader: the Dead-Drop's porter, and the one that carries. A squat hull on short legs bowed
// under the weight, both arms up and their clamps gripping, over its head, a crate the size of a
// cart: planked, strapped with iron at its ends and chalked with a clerk's tally. It has no head: the
// fire shows through two round ports high in the hull, under the crate, where it looks out. Rust,
// not soot: the hold is wet. Idle: the crate's weight settles, the arms give and the knees with
// them, and it presses the crate back up.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import { appendCurve, blob, glow, lumpy, patch } from './gloss.ts';
import type { Part } from './gloss.ts';
import { chiselMark } from './knockers.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['stoker', 'sentry', 'sentinel', 'loader'];

/**
 * A heavy machine's make, as the Stoker's, the Sentry's and the Sentinel's numbers, so another is a
 * Build and a tint (MONSTERS §11): the body it is built round, its height in the frame and its
 * breadth, the legs it stands on, the fire in it and the soot it has taken.
 */
interface Build {
  /** The body: a boiler, a watcher's keel of a chest, a keeper's block, or a loader's hull under its crate. */
  body: 'boiler' | 'watcher' | 'keeper' | 'loader';
  /** Drawn height, of the frame's; a tall one's crown inside TALL_REACH. */
  reach: number;
  /** Breadth, against the drawing's own (1 = as drawn). */
  wide: number;
  /** The legs' half-thickness, in heights, and the knee's drum against it. */
  leg: number; knee: number;
  /** The fire where the plate opens, and its heart. */
  fire: string; heart: string;
  /** Soot over the plate, 0..1. */
  soot: number;
}
const STOKER: Build = { body: 'boiler', reach: 0.97, wide: 1, leg: 0.055, knee: 1, fire: '#ff8a2a', heart: '#fff0c0', soot: 1 };
const SENTRY: Build = { body: 'watcher', reach: 0.97, wide: 1, leg: 0.04, knee: 1, fire: '#ff8a2a', heart: '#fff0c0', soot: 0.35 };
const SENTINEL: Build = { body: 'keeper', reach: 0.86, wide: 1, leg: 0.068, knee: 0.78, fire: '#ff8a2a', heart: '#fff0c0', soot: 0.2 };
const LOADER: Build = { body: 'loader', reach: 0.97, wide: 1, leg: 0.06, knee: 1.05, fire: '#ff8a2a', heart: '#fff0c0', soot: 0.3 };
const BUILDS: Partial<Record<MonsterSprite, Build>> = { stoker: STOKER, sentry: SENTRY, sentinel: SENTINEL, loader: LOADER };

/** A machine's frame: X and Y take shares of its drawn height to the canvas, x toward the near side and y up from the ground. */
interface Fr { H: number; X: (k: number) => number; Y: (k: number) => number }
type P = readonly [number, number];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  const b = BUILDS[kind] ?? STOKER, H = h * b.reach;
  const f: Fr = { H, X: (k) => x + H * k * b.wide, Y: (k) => y - H * k };
  (b.body === 'boiler' ? stoker : b.body === 'watcher' ? sentry : b.body === 'loader' ? loader : sentinel)(ctx, f, p, b);
};

const DEEP = '#9c2c0c', SOOT = '#0b0908', BLACK = '#07080a';
/** The Loader's crate, and the clerk's chalk on it: darkened with distance, as the tint is. */
const WOOD = '#6b4f33', CHALK = '#ece6d6';

/** Shares, x and y in turn, to the canvas. */
const at = (f: Fr, ...a: number[]): number[] => a.map((v, i) => (i % 2 ? f.Y(v) : f.X(v)));
/** The same frame lifted by `dy` heights, for what rides on the legs. */
const lifted = (f: Fr, dy: number): Fr => ({ H: f.H, X: f.X, Y: (k) => f.Y(k + dy) });

/** The colours, from the def's tint: the near plate, the far a step darker, the joints darker again, and the fire. */
interface Ink { plate: string; far: string; joint: string; farJoint: string; fire: string; heart: string; deep: string }
function inks(p: Paint, b: Build): Ink {
  const joint = mix(p.dark, '#0e0f12', 0.45), t = Math.max(0.75, p.tone);
  return { plate: p.base, far: shade(p.base, 0.8), joint, farJoint: shade(joint, 0.82), fire: shade(b.fire, t), heart: shade(b.heart, t), deep: shade(DEEP, t) };
}

/** A rod, a thigh's or an upper arm's, from a to b, in the joints' darker iron. */
function rod(ctx: CanvasRenderingContext2D, f: Fr, a: P, b: P, t: number, hex: string): void {
  blob(ctx, B, hex, [{ k: 'cap', x0: f.X(a[0]), y0: f.Y(a[1]), x1: f.X(b[0]), y1: f.Y(b[1]), r0: t * f.H, r1: t * f.H * 0.9 }], { formK: 0.45, spread: 0.7 });
}

/** A plate along a limb from a to b, a greave or a vambrace, half-broad w0 at a and w1 at b, its ridge lit. */
function slab(ctx: CanvasRenderingContext2D, f: Fr, a: P, b: P, w0: number, w1: number, hex: string): void {
  const ax = f.X(a[0]), ay = f.Y(a[1]), bx = f.X(b[0]), by = f.Y(b[1]);
  const l = Math.hypot(bx - ax, by - ay) || 1, nx = (ay - by) / l, ny = (bx - ax) / l, W0 = w0 * f.H, W1 = w1 * f.H;
  blob(ctx, B, hex, [{ k: 'poly', pts: [ax + nx * W0, ay + ny * W0, bx + nx * W1, by + ny * W1, bx - nx * W1, by - ny * W1, ax - nx * W0, ay - ny * W0] }], { formK: 0.25, spread: 0.6 });
  if (B.override || f.H < 48) return;
  ctx.strokeStyle = rgba(mix(hex, '#ffffff', 0.4), 0.45); ctx.lineWidth = Math.max(0.8, f.H * 0.006); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ax + nx * W0 * 0.4, ay + ny * W0 * 0.4); ctx.lineTo(bx + nx * W1 * 0.4, by + ny * W1 * 0.4); ctx.stroke();
}

/** A joint: a drum seen end on, darker than the plate, its rim lit at the upper left and a hub at its heart. */
function drum(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, hex: string): void {
  blob(ctx, B, hex, [{ k: 'ball', x: cx, y: cy, r }], { formK: 0.55, spread: 0.7 });
  if (B.override || r < 2.2) return;
  ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.8, r * 0.16);
  ctx.strokeStyle = rgba(mix(hex, '#ffffff', 0.45), 0.6);
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.7, Math.PI * 0.95, Math.PI * 1.6); ctx.stroke();
  ctx.fillStyle = rgba(mix(hex, BLACK, 0.55), 0.85); ctx.beginPath(); ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba(mix(hex, '#ffffff', 0.55), 0.75); ctx.beginPath(); ctx.arc(cx - r * 0.1, cy - r * 0.1, r * 0.13, 0, Math.PI * 2); ctx.fill();
}

/** A leg of the make: a rod of a thigh, a greave of plate from the knee down to a flat foot, and a drum at the knee. */
function leg(ctx: CanvasRenderingContext2D, f: Fr, hip: P, knee: P, ax: number, b: Build, plate: string, joint: string): void {
  const t = b.leg, ay = t * 1.1;
  rod(ctx, f, hip, knee, t * 0.78, joint);
  slab(ctx, f, knee, [ax, ay], t * 1.12, t * 0.8, plate);
  blob(ctx, B, shade(plate, 0.9), [{ k: 'poly', pts: at(f, ax - t * 1.8, 0, ax + t * 1.8, 0, ax + t * 1.35, ay, ax - t * 1.35, ay) }], { formK: 0.2, spread: 0.6 });
  drum(ctx, f.X(knee[0]), f.Y(knee[1]), t * f.H * b.knee, joint);
}

/** An arm of the make: a rod from the shoulder, a vambrace of plate from the elbow to the wrist and a drum at the elbow. The shoulder's drum is the body's to set on. */
function arm(ctx: CanvasRenderingContext2D, f: Fr, sh: P, el: P, wr: P, t: number, plate: string, joint: string): void {
  rod(ctx, f, sh, el, t * 0.8, joint);
  slab(ctx, f, el, wr, t * 1.05, t * 0.85, plate);
  drum(ctx, f.X(el[0]), f.Y(el[1]), t * f.H * 0.95, joint);
}

/** A clamp for a hand: a knuckle and two jaws hooked toward each other, open by `open` (0 shut); `dir` turns it off straight down, toward the near side. */
function clamp(ctx: CanvasRenderingContext2D, f: Fr, w: P, dir: number, open: number, t: number, hex: string): void {
  const T = t * f.H, ex = Math.cos(dir), ey = -Math.sin(dir), dx = Math.sin(dir), dy = Math.cos(dir), wx = f.X(w[0]), wy = f.Y(w[1]);
  const L = (u: number, v: number): [number, number] => [wx + (ex * u + dx * v) * T, wy + (ey * u + dy * v) * T];
  const k = L(0, 0.25), parts: Part[] = [{ k: 'ball', x: k[0], y: k[1], r: T * 0.8 }];
  for (const s of [-1, 1]) parts.push({ k: 'tube', pts: [...L(s * 0.45, 0.4), ...L(s * (0.85 + open), 1.35), ...L(s * (0.3 + open * 0.7), 2.3)], r0: T * 0.42, r1: T * 0.24 });
  blob(ctx, B, hex, parts, { formK: 0.4, spread: 0.7 });
}

/** A seam: a groove ruled in the plate, its lower lip lit. */
function seam(ctx: CanvasRenderingContext2D, pts: readonly number[], plate: string, w: number): void {
  if (B.override || w < 0.5) return;
  ctx.lineCap = 'butt'; ctx.lineJoin = 'round'; ctx.lineWidth = w;
  for (const [col, off, a] of [[mix(plate, '#ffffff', 0.42), w * 0.85, 0.5], [mix(plate, BLACK, 0.72), 0, 0.85]] as const) {
    ctx.strokeStyle = rgba(col, a); ctx.beginPath(); ctx.moveTo(pts[0], pts[1] + off);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1] + off);
    ctx.stroke();
  }
}

/** Rivets at points: a dark head, its upper left lit. */
function rivets(ctx: CanvasRenderingContext2D, pts: readonly number[], r: number, plate: string): void {
  if (B.override || r < 0.7) return;
  for (let i = 0; i < pts.length; i += 2) {
    ctx.fillStyle = rgba(mix(plate, BLACK, 0.6), 0.85); ctx.beginPath(); ctx.arc(pts[i] + r * 0.3, pts[i + 1] + r * 0.3, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(mix(plate, '#ffffff', 0.5), 0.8); ctx.beginPath(); ctx.arc(pts[i] - r * 0.2, pts[i + 1] - r * 0.2, r * 0.6, 0, Math.PI * 2); ctx.fill();
  }
}

/** A band round a round body seen a little from above: its front sags `sag` at the middle, `hw` either side of `cx`, in `n` points. */
function band(f: Fr, y: number, hw: number, sag: number, n = 9, cx = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const u = -1 + (2 * i) / (n - 1); o.push(f.X(cx + u * hw), f.Y(y - sag * (1 - u * u))); }
  return o;
}

/** Draw `fn` clipped to an outline, smooth or ruled, so seams and soot stop at its edge. Not in the hit flash. */
function inside(ctx: CanvasRenderingContext2D, outline: readonly number[], curve: boolean, fn: () => void): void {
  if (B.override) return;
  ctx.save(); ctx.beginPath();
  if (curve) appendCurve(ctx, lumpy(outline, 0, 0, 1));
  else { ctx.moveTo(outline[0], outline[1]); for (let i = 2; i < outline.length; i += 2) ctx.lineTo(outline[i], outline[i + 1]); ctx.closePath(); }
  ctx.clip(); fn(); ctx.restore();
}

/** The fire seen where the plate opens: hot at the heart, deep at the edge, and its light on the plate round it. */
function fire(ctx: CanvasRenderingContext2D, k: Ink, path: () => void, cx: number, cy: number, r: number, heat: number, halo: number): void {
  if (B.override) return;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, r));
  g.addColorStop(0, k.heart); g.addColorStop(0.3 + 0.25 * heat, k.fire); g.addColorStop(1, k.deep);
  ctx.beginPath(); path(); ctx.fillStyle = g; ctx.fill();
  if (halo > 0) glow(ctx, B, cx, cy, halo, k.fire, 0.14 + 0.12 * heat, k.heart);
}

/** The chisel's mark, cut once in the plate (knockers.ts), at shares (cx, cy), `s` heights to its lozenge's tip. */
function mark(ctx: CanvasRenderingContext2D, f: Fr, cx: number, cy: number, s: number, plate: string): void {
  if (s * f.H < 2.5) return;
  chiselMark(ctx, { u: f.H / 100, X: (v) => f.X(v / 100), Y: (v) => f.Y(v / 100) }, { x: cx * 100, y: cy * 100 }, s * 100, 0, plate);
}

/** A rounded rectangle's path, for a slit of fire. */
function rounded(ctx: CanvasRenderingContext2D, cx: number, cy: number, hw: number, hh: number, r: number): void {
  ctx.moveTo(cx - hw + r, cy - hh);
  ctx.arcTo(cx + hw, cy - hh, cx + hw, cy + hh, r); ctx.arcTo(cx + hw, cy + hh, cx - hw, cy + hh, r);
  ctx.arcTo(cx - hw, cy + hh, cx - hw, cy - hh, r); ctx.arcTo(cx - hw, cy - hh, cx + hw, cy - hh, r);
  ctx.closePath();
}

/** A straight line in one colour. */
function line(ctx: CanvasRenderingContext2D, pts: readonly number[], col: string, w: number, cap: CanvasLineCap = 'round'): void {
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = cap;
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

/** The Stoker, in units of its drawn height: the boiler from 0.24 to its dome at 0.885, the stack to 0.985. */
function stoker(ctx: CanvasRenderingContext2D, f: Fr, p: Paint, b: Build): void {
  const k = inks(p, b), H = f.H;
  const c = Math.max(0, p.breathe) * 0.006, g = lifted(f, c);                    // the boiler lifts on its legs as it draws
  const heat = 0.5 + 0.5 * Math.sin(p.frame / 4.3) * Math.cos(p.frame / 6.9);
  const up = (1 + Math.sin(p.frame / 10)) / 2, s = up * up;                      // the shovel's stroke, long at the bottom
  groundShadow(ctx, f.X(0.06), f.Y(0) + 1, H * 0.84);

  // 1. The far arm, hanging, a clamp for a hand: a step darker.
  arm(ctx, g, [-0.275, 0.645], [-0.365, 0.48], [-0.35, 0.345], 0.035, k.far, k.farJoint);
  clamp(ctx, g, [-0.35, 0.345], 0.06, 0.2, 0.034, k.farJoint);
  // 2. The legs, short and bowed under the weight.
  for (const sd of [-1, 1] as const) leg(ctx, f, [sd * 0.12, 0.32 + c], [sd * 0.185, 0.19 + c / 2], sd * 0.165, b, sd < 0 ? k.far : k.plate, sd < 0 ? k.farJoint : k.joint);
  // 3. The stack, its foot behind the dome.
  blob(ctx, B, k.joint, [
    { k: 'poly', pts: at(g, -0.138, 0.8, -0.062, 0.8, -0.064, 0.95, -0.136, 0.95) },
    { k: 'poly', pts: at(g, -0.152, 0.935, -0.048, 0.935, -0.048, 0.985, -0.152, 0.985) },
  ], { formK: 0.3, spread: 0.6 });
  // 4. The boiler: a drum of plate, domed, banded and riveted, black with soot from the crown down.
  const hull = at(g, 0, 0.885, 0.14, 0.866, 0.25, 0.8, 0.296, 0.7, 0.306, 0.52, 0.296, 0.34, 0.26, 0.278, 0.13, 0.248, 0, 0.242, -0.13, 0.248, -0.26, 0.278, -0.296, 0.34, -0.306, 0.52, -0.296, 0.7, -0.25, 0.8, -0.14, 0.866);
  blob(ctx, B, k.plate, [{ k: 'curve', pts: hull, wobble: 0, sub: 1 }], { h: H, formK: 0.3, spread: 0.85 });
  const w = Math.max(0.7, H * 0.009), rv = H * 0.0075;
  inside(ctx, hull, true, () => {
    for (const [yb, hw, sag] of [[0.355, 0.31, 0.022], [0.665, 0.31, 0.022], [0.79, 0.27, 0.016]] as const) {
      seam(ctx, band(g, yb, hw, sag), k.plate, w);
      rivets(ctx, band(g, yb + 0.022, hw * 0.94, sag, 9).slice(2, -2), rv, k.plate);
    }
    patch(ctx, B, SOOT, [{ k: 'ell', x: g.X(-0.06), y: g.Y(0.87), rx: H * 0.27, ry: H * 0.075 }], { alpha: 0.75 * b.soot, feather: 0.75 });
    patch(ctx, B, SOOT, [{ k: 'ell', x: g.X(0.03), y: g.Y(0.64), rx: H * 0.1, ry: H * 0.05 }], { alpha: 0.6 * b.soot, feather: 0.7 });
    patch(ctx, B, SOOT, [{ k: 'ell', x: g.X(0), y: g.Y(0.262), rx: H * 0.32, ry: H * 0.05 }], { alpha: 0.4 * b.soot, feather: 0.8 });
  });
  mark(ctx, g, -0.2, 0.51, 0.02, k.plate);
  // 5. The furnace door in its belly, iron-framed, hinged at the far side and latched at the near,
  //    the fire through its grille.
  const dx = 0.03, dy = 0.5;
  blob(ctx, B, k.joint, [
    { k: 'poly', pts: at(g, dx - 0.085, dy + 0.1, dx + 0.085, dy + 0.1, dx + 0.115, dy + 0.07, dx + 0.115, dy - 0.07, dx + 0.085, dy - 0.1, dx - 0.085, dy - 0.1, dx - 0.115, dy - 0.07, dx - 0.115, dy + 0.07) },
    { k: 'poly', pts: at(g, dx - 0.132, dy + 0.064, dx - 0.1, dy + 0.064, dx - 0.1, dy + 0.036, dx - 0.132, dy + 0.036) },
    { k: 'poly', pts: at(g, dx - 0.132, dy - 0.036, dx - 0.1, dy - 0.036, dx - 0.1, dy - 0.064, dx - 0.132, dy - 0.064) },
    { k: 'poly', pts: at(g, dx + 0.1, dy + 0.012, dx + 0.152, dy + 0.012, dx + 0.152, dy - 0.012, dx + 0.1, dy - 0.012) },
  ], { formK: 0.25, spread: 0.6 });
  const ox = g.X(dx), oy = g.Y(dy - 0.008), ow = H * 0.082, oh = H * 0.07;
  fire(ctx, k, () => {
    ctx.moveTo(ox - ow, oy + oh); ctx.lineTo(ox + ow, oy + oh); ctx.lineTo(ox + ow, oy - oh * 0.35);
    ctx.quadraticCurveTo(ox + ow, oy - oh, ox, oy - oh); ctx.quadraticCurveTo(ox - ow, oy - oh, ox - ow, oy - oh * 0.35); ctx.closePath();
  }, ox, oy + oh * 0.45, oh * 1.5, heat, H * 0.24);
  if (!B.override && H >= 40) {
    const bw = Math.max(1, H * 0.013);
    for (const u of [-0.5, 0, 0.5]) {
      const top = oy - oh * (u ? 0.82 : 1);
      line(ctx, [ox + u * ow, top, ox + u * ow, oy + oh], k.joint, bw, 'butt');
      line(ctx, [ox + u * ow - bw * 0.3, top, ox + u * ow - bw * 0.3, oy + oh], rgba(mix(k.joint, '#ffffff', 0.35), 0.5), bw * 0.3, 'butt');
    }
  }
  // 6. The shovel arm, the near: the upper arm from its drum, the haft from the elbow and a square
  //    blade, its lip worn bright. It scoops at nothing at its side and lifts it, and back.
  shovel(ctx, g, [0.278, 0.645], [0.385 + 0.01 * s, 0.475 + 0.06 * s], 0.14 - 0.5 * s, k);
  drum(ctx, g.X(-0.278), g.Y(0.645), H * 0.05, k.farJoint);
  drum(ctx, g.X(0.278), g.Y(0.645), H * 0.056, k.joint);
}

/** The shovel arm: `ang` turns the haft off straight down, toward the near side. */
function shovel(ctx: CanvasRenderingContext2D, f: Fr, sh: P, el: P, ang: number, k: Ink): void {
  const H = f.H, ex = f.X(el[0]), ey = f.Y(el[1]), dx = Math.sin(ang), dy = Math.cos(ang), px = Math.cos(ang), py = -Math.sin(ang);
  const L = (u: number, v: number): [number, number] => [ex + (px * u + dx * v) * H, ey + (py * u + dy * v) * H];
  const steel = mix(k.plate, '#a8a49c', 0.3);
  rod(ctx, f, sh, el, 0.03, k.joint);
  blob(ctx, B, k.joint, [{ k: 'poly', pts: [...L(-0.016, 0.08), ...L(0.016, 0.08), ...L(0.015, 0.24), ...L(-0.015, 0.24)] }], { formK: 0.3, spread: 0.6 });
  blob(ctx, B, k.plate, [{ k: 'poly', pts: [...L(-0.038, 0), ...L(0.038, 0), ...L(0.027, 0.1), ...L(-0.027, 0.1)] }], { formK: 0.25, spread: 0.6 });
  blob(ctx, B, steel, [
    { k: 'poly', pts: [...L(-0.026, 0.215), ...L(0.026, 0.215), ...L(0.042, 0.255), ...L(-0.042, 0.255)] },
    { k: 'poly', pts: [...L(-0.08, 0.248), ...L(0.08, 0.248), ...L(0.096, 0.4), ...L(0.088, 0.45), ...L(-0.088, 0.45), ...L(-0.096, 0.4)] },
  ], { formK: 0.2, spread: 0.6 });
  drum(ctx, ex, ey, H * 0.05, k.joint);
  if (B.override || H < 40) return;
  patch(ctx, B, mix(steel, BLACK, 0.5), [{ k: 'poly', pts: [...L(-0.066, 0.27), ...L(0.066, 0.27), ...L(0.08, 0.395), ...L(-0.08, 0.395)] }], { alpha: 0.5, feather: 0.5 });
  line(ctx, [...L(-0.082, 0.44), ...L(0.082, 0.44)], rgba(mix(steel, '#ffffff', 0.6), 0.85), Math.max(1, H * 0.01));
}

/** The Sentry, in units of its drawn height: the hips at 0.46, the shoulders at 0.76 and the eye's hood to 0.96. */
function sentry(ctx: CanvasRenderingContext2D, f: Fr, p: Paint, b: Build): void {
  const k = inks(p, b), H = f.H;
  const c = p.breathe * 0.004, g = lifted(f, c);
  const look = Math.sin(p.frame / 23), heat = 0.6 + 0.4 * Math.sin(p.frame / 5.3);
  groundShadow(ctx, f.X(0.03), f.Y(0) + 1, H * 0.48);

  // 1. The far arm, short, its clamp shut.
  arm(ctx, g, [-0.125, 0.762], [-0.172, 0.615], [-0.16, 0.5], 0.028, k.far, k.farJoint);
  clamp(ctx, g, [-0.16, 0.5], -0.05, 0, 0.028, k.farJoint);
  // 2. The legs, long and straight.
  for (const sd of [-1, 1] as const) leg(ctx, f, [sd * 0.062, 0.46 + c], [sd * 0.084, 0.255 + c / 2], sd * 0.074, b, sd < 0 ? k.far : k.plate, sd < 0 ? k.farJoint : k.joint);
  // 3. The hips' plate and the waist's drum, and the neck.
  blob(ctx, B, k.plate, [{ k: 'poly', pts: at(g, -0.1, 0.505, 0.1, 0.505, 0.086, 0.425, -0.086, 0.425) }], { formK: 0.25, spread: 0.6 });
  drum(ctx, g.X(0), g.Y(0.528), H * 0.04, k.joint);
  rod(ctx, g, [0, 0.79], [0, 0.85], 0.02, k.joint);
  // 4. The chest: a keel of plate, broad at the shoulders and narrow at the waist.
  const chest = at(g, 0, 0.8, 0.1, 0.795, 0.126, 0.765, 0.116, 0.68, 0.088, 0.588, 0.062, 0.548, 0, 0.54, -0.062, 0.548, -0.088, 0.588, -0.116, 0.68, -0.126, 0.765, -0.1, 0.795);
  blob(ctx, B, k.plate, [{ k: 'curve', pts: chest, wobble: 0, sub: 1 }], { h: H, formK: 0.3, spread: 0.7 });
  const w = Math.max(0.7, H * 0.008);
  inside(ctx, chest, true, () => {
    seam(ctx, at(g, 0, 0.8, 0, 0.55), k.plate, w);
    seam(ctx, band(g, 0.712, 0.13, 0.012), k.plate, w);
    rivets(ctx, at(g, -0.09, 0.772, -0.05, 0.779, 0.05, 0.779, 0.09, 0.772), H * 0.0065, k.plate);
    patch(ctx, B, SOOT, [{ k: 'ell', x: g.X(0), y: g.Y(0.56), rx: H * 0.1, ry: H * 0.04 }], { alpha: 0.5 * b.soot, feather: 0.8 });
  });
  mark(ctx, g, -0.058, 0.648, 0.016, k.plate);
  // 5. The eye: a lamp in a drum on the neck under a hood, turning.
  const ex = 0.006 * look, lx = g.X(ex), ly = g.Y(0.884), lr = H * 0.044;
  blob(ctx, B, k.plate, [{ k: 'ball', x: lx, y: g.Y(0.888), r: H * 0.066 }], { formK: 0.45, spread: 0.75 });
  if (!B.override) { ctx.fillStyle = k.joint; ctx.beginPath(); ctx.arc(lx, ly, lr * 1.25, 0, Math.PI * 2); ctx.fill(); }
  fire(ctx, k, () => ctx.arc(lx, ly, lr, 0, Math.PI * 2), g.X(ex + 0.014 * look), ly, lr, heat, H * 0.14);
  if (!B.override && H >= 40) {
    ctx.fillStyle = k.heart; ctx.beginPath(); ctx.arc(g.X(ex + 0.016 * look), ly + lr * 0.08, lr * 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = rgba(mix(k.plate, '#ffffff', 0.4), 0.55); ctx.lineWidth = Math.max(0.8, H * 0.006); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(lx, g.Y(0.888), H * 0.058, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke();
  }
  // its brow: a lid of plate over the lens's top, so it watches from under it
  blob(ctx, B, k.joint, [{ k: 'poly', pts: at(g, ex - 0.07, 0.905, ex - 0.05, 0.93, ex + 0.05, 0.93, ex + 0.07, 0.905, ex + 0.048, 0.912, ex - 0.048, 0.912) }], { formK: 0.3, spread: 0.6 });
  // 6. The long arm, the near: down past the knee to an open clamp.
  arm(ctx, g, [0.125, 0.762], [0.19, 0.545], [0.224, 0.255], 0.03, k.plate, k.joint);
  clamp(ctx, g, [0.224, 0.255], 0.08, 0.35, 0.03, k.joint);
  drum(ctx, g.X(-0.125), g.Y(0.762), H * 0.038, k.farJoint);
  drum(ctx, g.X(0.125), g.Y(0.762), H * 0.042, k.joint);
}

/** The Sentinel, in units of its drawn height: the hips at 0.3, the shoulders at 0.856 and the head's dome to 0.934. */
function sentinel(ctx: CanvasRenderingContext2D, f: Fr, p: Paint, b: Build): void {
  const k = inks(p, b), H = f.H;
  const c = p.breathe * 0.003, g = lifted(f, c);
  const heat = 0.5 + 0.5 * Math.sin(p.frame / 17);
  const w = Math.max(0.8, H * 0.008), rv = H * 0.008;
  groundShadow(ctx, f.X(0), f.Y(0) + 1, H * 0.82);

  // 1. The arms, hanging to fists: rods from the shoulders, gauntlets of plate, the far a step darker.
  for (const sd of [-1, 1] as const) {
    const pl = sd < 0 ? k.far : k.plate, jt = sd < 0 ? k.farJoint : k.joint, ax = sd * 0.3;
    arm(ctx, g, [sd * 0.255, 0.77], [sd * 0.29, 0.575], [ax, 0.39], 0.052, pl, jt);
    blob(ctx, B, pl, [{ k: 'poly', pts: at(g, ax - 0.062, 0.398, ax + 0.062, 0.398, ax + 0.068, 0.33, ax + 0.056, 0.272, ax - 0.056, 0.272, ax - 0.068, 0.33) }], { formK: 0.3, spread: 0.6 });
    seam(ctx, at(g, ax - 0.058, 0.318, ax + 0.058, 0.318), pl, w);
  }
  // 2. The legs, short and planted wide.
  for (const sd of [-1, 1] as const) leg(ctx, f, [sd * 0.11, 0.3 + c], [sd * 0.15, 0.168 + c / 2], sd * 0.14, b, sd < 0 ? k.far : k.plate, sd < 0 ? k.farJoint : k.joint);
  // 3. The skirt of plate over the hips.
  const skirt = at(g, -0.19, 0.425, 0.19, 0.425, 0.205, 0.268, -0.205, 0.268);
  blob(ctx, B, k.plate, [{ k: 'poly', pts: skirt }], { formK: 0.2, spread: 0.6 });
  inside(ctx, skirt, false, () => {
    seam(ctx, at(g, 0, 0.425, 0, 0.268), k.plate, w);
    seam(ctx, at(g, -0.21, 0.345, 0.21, 0.345), k.plate, w);
    rivets(ctx, at(g, -0.15, 0.398, -0.06, 0.398, 0.06, 0.398, 0.15, 0.398), rv, k.plate);
  });
  // 4. The head, small and sunk between the shoulders: a dome, and for a visor a slit of fire.
  blob(ctx, B, shade(k.plate, 0.92), [
    { k: 'ell', x: g.X(0), y: g.Y(0.872), rx: H * 0.088, ry: H * 0.062 },
    { k: 'poly', pts: at(g, -0.088, 0.872, 0.088, 0.872, 0.088, 0.83, -0.088, 0.83) },
  ], { formK: 0.35, spread: 0.7 });
  fire(ctx, k, () => rounded(ctx, g.X(0), g.Y(0.884), H * 0.056, H * 0.0105, H * 0.008), g.X(0), g.Y(0.884), H * 0.056, heat, H * 0.12);
  // 5. The block of the body, plate on plate, and down its middle the line between two doors, the
  //    fire through it.
  const body = at(g, -0.205, 0.856, 0.205, 0.856, 0.246, 0.82, 0.236, 0.62, 0.188, 0.43, 0.17, 0.395, -0.17, 0.395, -0.188, 0.43, -0.236, 0.62, -0.246, 0.82);
  blob(ctx, B, k.plate, [{ k: 'poly', pts: body }], { h: H, formK: 0.22, spread: 0.65 });
  inside(ctx, body, false, () => {
    for (const yb of [0.7, 0.52]) {
      seam(ctx, at(g, -0.25, yb, -0.012, yb), k.plate, w);
      seam(ctx, at(g, 0.012, yb, 0.25, yb), k.plate, w);
      rivets(ctx, at(g, -0.17, yb + 0.024, -0.08, yb + 0.024, 0.08, yb + 0.024, 0.17, yb + 0.024), rv, k.plate);
    }
    patch(ctx, B, SOOT, [{ k: 'ell', x: g.X(0), y: g.Y(0.42), rx: H * 0.2, ry: H * 0.05 }], { alpha: 0.5 * b.soot, feather: 0.8 });
  });
  if (!B.override) {
    const crack = at(g, 0, 0.848, 0, 0.402);
    line(ctx, crack, k.deep, Math.max(1.2, H * 0.013), 'butt');
    line(ctx, crack, k.fire, Math.max(0.8, H * 0.0065), 'butt');
    line(ctx, at(g, 0, 0.74, 0, 0.5), rgba(k.heart, 0.45 + 0.4 * heat), Math.max(0.6, H * 0.003), 'butt');
    glow(ctx, B, g.X(0), g.Y(0.62), H * 0.15, k.fire, 0.08 + 0.08 * heat, k.heart);
  }
  mark(ctx, g, -0.115, 0.61, 0.024, k.plate);
  // 6. The shoulders: the family's drums at their greatest, set in the block's corners.
  for (const sd of [-1, 1] as const) drum(ctx, g.X(sd * 0.25), g.Y(0.776), H * 0.074, sd < 0 ? k.farJoint : k.joint);
}

/** The Loader, in units of its drawn height: the hull from 0.265 to its shoulders at 0.585, the arms raised from them, and the crate from 0.735 to 0.985. */
function loader(ctx: CanvasRenderingContext2D, f: Fr, p: Paint, b: Build): void {
  const k = inks(p, b), H = f.H;
  // Now and then the crate's weight settles: the arms give and the hull sinks on its knees, and it presses the crate back up.
  const sag = Math.pow(Math.max(0, Math.sin(p.frame / 13)), 4) * 0.018;
  const c = Math.max(0, p.breathe) * 0.004 - sag * 0.5, g = lifted(f, c);
  const heat = 0.55 + 0.45 * Math.sin(p.frame / 6.3) * Math.cos(p.frame / 9.1);
  const w = Math.max(0.7, H * 0.008), rv = H * 0.007;
  const S = (sd: number): P => [sd * 0.25, 0.535], E = (sd: number): P => [sd * (0.36 + 2 * sag), 0.632 - 0.6 * sag], W = (sd: number): P => [sd * 0.3, 0.728 - sag];
  groundShadow(ctx, f.X(0), f.Y(0) + 1, H * 0.84);

  // 1. The far arm, raised to the crate's far end: a step darker.
  arm(ctx, g, S(-1), E(-1), W(-1), 0.036, k.far, k.farJoint);
  // 2. The legs, short and bowed under the load.
  for (const sd of [-1, 1] as const) leg(ctx, f, [sd * 0.125, 0.3 + c], [sd * 0.2, 0.17 + c / 2], sd * 0.18, b, sd < 0 ? k.far : k.plate, sd < 0 ? k.farJoint : k.joint);
  // 3. The hull: a squat block chamfered at the shoulders, banded and riveted, rust where soot would be.
  const hull = at(g, -0.2, 0.265, 0.2, 0.265, 0.236, 0.32, 0.25, 0.49, 0.22, 0.558, 0.09, 0.585, -0.09, 0.585, -0.22, 0.558, -0.25, 0.49, -0.236, 0.32);
  blob(ctx, B, k.plate, [{ k: 'poly', pts: hull }], { h: H, formK: 0.25, spread: 0.65 });
  inside(ctx, hull, false, () => {
    seam(ctx, at(g, -0.26, 0.355, 0.26, 0.355), k.plate, w);
    rivets(ctx, at(g, -0.18, 0.33, -0.09, 0.33, 0, 0.33, 0.09, 0.33, 0.18, 0.33), rv, k.plate);
    seam(ctx, at(g, -0.26, 0.535, 0.26, 0.535), k.plate, w);
    patch(ctx, B, mix(k.deep, SOOT, 0.55), [{ k: 'ell', x: g.X(-0.12), y: g.Y(0.29), rx: H * 0.12, ry: H * 0.035 }], { alpha: 0.55 * b.soot, feather: 0.8 });
    patch(ctx, B, mix(k.deep, SOOT, 0.55), [{ k: 'ell', x: g.X(0.17), y: g.Y(0.5), rx: H * 0.05, ry: H * 0.08 }], { alpha: 0.45 * b.soot, feather: 0.8 });
  });
  mark(ctx, g, 0.155, 0.415, 0.02, k.plate);
  // 4. The ports high in the hull, two, ringed in iron with a bar across, the fire behind them:
  //    where it looks out from under its load.
  for (const sd of [-1, 1] as const) {
    const px = g.X(sd * 0.088), py = g.Y(0.452), r = H * 0.043;
    blob(ctx, B, k.joint, [{ k: 'ball', x: px, y: py, r: r * 1.34 }], { formK: 0.5, spread: 0.7 });
    fire(ctx, k, () => ctx.arc(px, py, r, 0, Math.PI * 2), px, py + r * 0.3, r * 1.3, heat, 0);
    if (!B.override && H >= 40) line(ctx, [px - r, py, px + r, py], k.joint, Math.max(1, H * 0.011), 'butt');
  }
  if (!B.override) glow(ctx, B, g.X(0), g.Y(0.452), H * 0.2, k.fire, 0.1 + 0.1 * heat, k.heart);
  // 5. The crate held over it: planks across, the underside in shadow, iron strapped round its ends
  //    and nailed, and on its face a clerk's tally in chalk, four strokes and one across.
  const y0 = 0.735 - sag, y1 = 0.985 - sag, wood = shade(WOOD, p.tone);
  const crate = at(g, -0.37, y0, 0.37, y0, 0.37, y1, -0.37, y1);
  blob(ctx, B, wood, [{ k: 'poly', pts: crate }], { h: H, formK: 0.2, spread: 0.6 });
  inside(ctx, crate, false, () => {
    for (let i = 1; i < 4; i++) seam(ctx, at(g, -0.37, y0 + ((y1 - y0) * i) / 4, 0.37, y0 + ((y1 - y0) * i) / 4), wood, w);
    patch(ctx, B, BLACK, [{ k: 'poly', pts: at(g, -0.37, y0, 0.37, y0, 0.37, y0 + 0.028, -0.37, y0 + 0.028) }], { alpha: 0.4, feather: 0.4 });
    for (const sd of [-1, 1] as const) {
      ctx.fillStyle = k.joint; ctx.fillRect(g.X(sd * 0.315 - 0.024), g.Y(y1), H * 0.048, g.Y(y0) - g.Y(y1));
      rivets(ctx, at(g, sd * 0.315, y0 + 0.05, sd * 0.315, (y0 + y1) / 2, sd * 0.315, y1 - 0.04), rv, k.joint);
    }
    if (H >= 50) {
      const cw = Math.max(1, H * 0.009), ch = rgba(shade(CHALK, p.tone), 0.75);
      for (let i = 0; i < 4; i++) line(ctx, at(g, 0.07 + i * 0.03, y0 + 0.075, 0.075 + i * 0.03, y0 + 0.165), ch, cw);
      line(ctx, at(g, 0.05, y0 + 0.09, 0.2, y0 + 0.15), ch, cw);
    }
  });
  // 6. The near arm, raised to the crate's near end; the clamps gripping it under both ends; the shoulders' drums.
  arm(ctx, g, S(1), E(1), W(1), 0.036, k.plate, k.joint);
  for (const sd of [-1, 1] as const) clamp(ctx, g, W(sd), Math.PI, 0.12, 0.034, sd < 0 ? k.farJoint : k.joint);
  for (const sd of [-1, 1] as const) drum(ctx, g.X(sd * 0.25), g.Y(0.535), H * (sd < 0 ? 0.05 : 0.056), sd < 0 ? k.farJoint : k.joint);
}
