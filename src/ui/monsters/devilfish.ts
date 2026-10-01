// The devilfish, the old sailors' word for the octopus: the Devilfish first, on one frame the Great
// Devilfish scales up. What the company sees of one is what comes over an edge at it: the `lip` (a
// dark, wet edge seen end-on, weed hanging from it and water running off it, so it reads as a rock
// pool's rim in the cove and the ship's side at night alike), the `grip` arms come up over it and
// curled down its face with the suckers holding, the `free` arms reared up and reaching, and behind
// them the head just clearing the lip with its one eye, and the mantle, the bag of the body, rising
// behind the head. The lip is inked as part of it, as the long bodies' pool is, so the arms and the
// body are one piece with it. Everything is laid out in hundredths of the sprite's height up from
// the ground line, so a kind is a Build and a colouring rather than a new drawing.
//
// The Devilfish: arms, coming up over the side. Brick red-brown, mottled darker, wet. Idle: the
// free arms sway and curl, each on its own beat, while the gripping ones hold; the mantle swells
// and falls and the siphon pulses; the eye watches, its lid sliding over now and then; a dark flush
// runs over it and fades; and water runs off the lip.
//
// The Great Devilfish: what the smugglers feed. The same frame nearly twice the size, filling the
// cave's pool: a pale, livid hide gone pallid in the dark, the mantle full, seven arms over the lip
// and reaching along it, white sucker-ring scars and a long healed gash, barnacles along its crown,
// and the eye's gold gone pale.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { blob, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['devilfish', 'great_devilfish'];

/** An arm over the lip: where it crosses the edge, and which way it curls down the face (-1 left, 1 right). */
type Grip = readonly [x: number, s: number];
/** A reared arm: where it leaves the body, where its tip reaches, and its beat. */
type Free = readonly [bx: number, tx: number, ty: number, phase: number, front: number];

/**
 * The frame's parts, as proportions of the devilfish's where they are numbers (1 = the devilfish),
 * each named for the devilfish that pushes it furthest, so the great devilfish is a Build and a
 * colouring.
 */
interface Build {
  /** Half the lip's width, in frame units: the great devilfish fills its pool. */
  span: number;
  /** The lip's top, in frame units. */
  lip: number;
  /** Size of the mantle: the great devilfish's is fuller, fed. */
  mantle: number;
  /** Girth of the arms where they leave the body. */
  girth: number;
  /** The arms over the lip. */
  grip: readonly Grip[];
  /** The arms reared up: behind the body (front 0), or come up over the lip in front of it (1). */
  free: readonly Free[];
  /** Size of the eye. */
  eye: number;
  /** The eye's colour: the devilfish's gold, paled in the great one kept in the dark. */
  iris: string;
  /** Dark mottle on the hide, 0 none. */
  mottle: number;
  /** Old pale scars, sucker rings from its own kind, 0 none. */
  scars: number;
  /** A crust of barnacles along the mantle's crown, 0 none. */
  barnacles: number;
  /** How wet the skin shines, 0..1. */
  gloss: number;
}
const DEVILFISH: Build = {
  span: 46, lip: 15, mantle: 1, girth: 1,
  grip: [[-25, -1], [21, 1]],
  free: [[-6, -36, 92, 0, 0], [12, 38, 80, 2.3, 0], [14, 24, 62, 4.1, 1]],
  eye: 1, iris: '#d8a02a', mottle: 1, scars: 0, barnacles: 0, gloss: 0.7,
};
// Old, fed and kept in the dark: wider and fuller, seven arms showing, its hide scarred and
// barnacled and its eye paled. Its reared arms reach out rather than up, so it keeps a tall boss's
// crown (TALL_REACH in src/ui/grouplabels.ts).
const GREAT: Build = {
  span: 60, lip: 14, mantle: 1.2, girth: 1.25,
  grip: [[-46, -1], [-22, -1], [19, 1], [44, 1]],
  free: [[-8, -54, 72, 0, 0], [14, 56, 66, 2.3, 0], [22, 32, 58, 4.1, 1]],
  eye: 1.3, iris: '#d8c890', mottle: 0.4, scars: 1, barnacles: 1, gloss: 0.5,
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  devilfish(ctx, x, y, h, p, kind === 'great_devilfish' ? GREAT : DEVILFISH);
};

/** A frame: x and y map hundredths of the height (x right, y up from the ground) to the canvas. */
interface F { u: number; X: (v: number) => number; Y: (v: number) => number; h: number }
function at(f: F, pts: readonly number[]): number[] {
  const o: number[] = [];
  for (let i = 0; i < pts.length; i += 2) o.push(f.X(pts[i]), f.Y(pts[i + 1]));
  return o;
}

/** Stable 0..1 noise; never seeded from the frame, or the marks would crawl. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/** A smooth spine through the given points in frame units, `n` samples to a span. */
function spine(pts: readonly number[], n = 5): number[] {
  const o: number[] = [], k = pts.length / 2;
  const P = (i: number): [number, number] => { const j = Math.max(0, Math.min(k - 1, i)); return [pts[j * 2], pts[j * 2 + 1]]; };
  for (let i = 0; i < k - 1; i++) {
    const [x0, y0] = P(i - 1), [x1, y1] = P(i), [x2, y2] = P(i + 1), [x3, y3] = P(i + 2);
    for (let s = 0; s < n; s++) {
      const t = s / n, t2 = t * t, t3 = t2 * t;
      o.push(0.5 * (2 * x1 + (-x0 + x2) * t + (2 * x0 - 5 * x1 + 4 * x2 - x3) * t2 + (-x0 + 3 * x1 - 3 * x2 + x3) * t3),
        0.5 * (2 * y1 + (-y0 + y2) * t + (2 * y0 - 5 * y1 + 4 * y2 - y3) * t2 + (-y0 + 3 * y1 - 3 * y2 + y3) * t3));
    }
  }
  o.push(pts[pts.length - 2], pts[pts.length - 1]);
  return o;
}

/** An arm along its spine: the hide tapering to a fine tip, and its suckers on the side `side` picks. */
interface Arm { pts: number[]; r0: number; r1: number }

function devilfish(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const u = h / 100, f: F = { u, h, X: (v) => x + v * u, Y: (v) => y - v * u };
  const t = p.frame, LY = b.lip, L = b.span, m = b.mantle, g = 5 * b.girth;
  // The flush: now and then the whole hide darkens and comes back, a colour change, not marks.
  const flush = Math.pow(Math.max(0, Math.sin(t / 47)), 6);
  const hide = shade(p.base, 1 - 0.22 * flush), far = shade(hide, 0.8);
  const pale = shade(mix(p.base, '#f0d8c8', 0.55), Math.max(0.55, p.tone));
  const mark = shade(mix(p.dark, '#1a0806', 0.5), 1);
  const rock = shade('#2c3032', Math.max(0.5, p.tone)), weed = shade('#34452a', Math.max(0.5, p.tone));
  groundShadow(ctx, x, y + 1, L * 2.1 * u);

  // --- the reared arms behind the body ---------------------------------------------------------
  // Each leaves the body low behind the head, rises and reaches out, and curls at its tip. It sways
  // from the root, the tip most, and the curl tightens and opens on its own beat.
  const reared = (bx: number, by: number, tx: number, ty: number, ph: number, r0: number): Arm => {
    const sw = Math.sin(t / 23 + ph), cu = 0.5 + 0.5 * Math.sin(t / 31 + ph * 1.7), s = Math.sign(tx - bx) || 1;
    const ex = tx + sw * 4, ey = ty + sw * 1.5;
    const pts = spine([bx, by, bx + (tx - bx) * 0.3 + sw, by + (ty - by) * 0.45, bx + (tx - bx) * 0.75 + sw * 2.5, ty - 9, ex, ey,
      ex + s * (3.5 + cu * 2), ey - 3.5 - cu, ex + s * (1 + cu * 3), ey - 7 - cu * 1.5], 5);
    return { pts, r0, r1: 1.3 };
  };
  const arm = (a: Arm, hex: string, seed: number, side: (nx: number) => boolean, gloss: number): void => {
    blob(ctx, B, hex, [{ k: 'tube', pts: at(f, a.pts), r0: a.r0 * u, r1: a.r1 * u, wobble: 0.02, seed }], { h, formK: 0.4, spread: 0.85 });
    suckers(ctx, f, a, pale, mark, side);
    wet(ctx, f, a.pts, a.r0 * 0.8, gloss);
  };
  const inward = (a: Arm) => (nx: number): boolean => nx * Math.sign(a.pts[a.pts.length - 2] - a.pts[0]) < 0;
  for (const [i, [bx, tx, ty, ph, front]] of b.free.entries()) {
    if (front) continue;
    const a = reared(bx, LY + 10, tx, ty, ph, g * 1.15);
    arm(a, far, 20 + i, inward(a), b.gloss * 0.6);
  }

  // --- the head and the mantle, one hide --------------------------------------------------------
  // The head barely clears the lip, broad and low, the eye's socket a knuckle on it; the mantle
  // rises behind it, leaning back, and swells and falls as it breathes. The siphon at its side.
  const br = 1 + 0.035 * p.breathe, pulse = 0.5 + 0.5 * Math.sin(t / 9);
  const MX = 8 * m, MY = LY + 25 * m, RX = 14 * m, RY = 18 * m;
  const ex = -7 * m, ey = LY + 7 + 2 * m, er = 4.2 * b.eye;
  const body: Part[] = [
    { k: 'ell', x: f.X(1), y: f.Y(LY + 3), rx: 18 * m * u, ry: 8 * m * u },
    { k: 'cap', x0: f.X(2), y0: f.Y(LY + 4), x1: f.X(MX - 2 * m), y1: f.Y(MY - 6 * m), r0: 12 * m * u, r1: 13 * m * u },
    { k: 'ell', x: f.X(MX), y: f.Y(MY), rx: RX * br * u, ry: RY * br * u, rot: 0.38 },
    { k: 'ball', x: f.X(ex), y: f.Y(ey), r: er * 1.5 * u },
    { k: 'cap', x0: f.X(13 * m), y0: f.Y(LY + 5), x1: f.X(18 * m + pulse), y1: f.Y(LY + 8 + pulse * 0.5), r0: 3.5 * u, r1: (2.3 + pulse * 0.7) * u },
  ];
  blob(ctx, B, shade(hide, 0.92), body, { h, formK: 0.4, spread: 0.85 });
  if (!B.override) {
    // The mottle: soft dark blotches over the mantle, fixed to it.
    if (b.mottle > 0) {
      for (let i = 0; i < 8; i++) {
        const a = nz(i, 3) * Math.PI * 2, d = 0.25 + Math.sqrt(nz(i, 5)) * 0.55;
        patch(ctx, B, mark, [{ k: 'ell', x: f.X(MX + Math.cos(a) * RX * d), y: f.Y(MY + Math.sin(a) * RY * d), rx: (2.5 + nz(i, 7) * 3) * u, ry: (2 + nz(i, 9) * 2.5) * u, rot: nz(i, 11) * 3 }], { alpha: 0.28 * b.mottle, feather: 0.75 });
      }
    }
    // The old scars: pale rings where something its own size once held it, and a long healed gash.
    if (b.scars > 0) {
      ctx.strokeStyle = rgba(pale, 0.55 * b.scars); ctx.lineWidth = Math.max(1, 0.7 * u);
      for (let i = 0; i < 7; i++) {
        const a = nz(i, 21) * Math.PI * 2, d = Math.sqrt(nz(i, 23)) * 0.7, r = (1.4 + nz(i, 25) * 1.2) * u;
        ctx.beginPath(); ctx.arc(f.X(MX + Math.cos(a) * RX * d), f.Y(MY + Math.sin(a) * RY * d), r, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.strokeStyle = rgba(pale, 0.45 * b.scars); ctx.lineWidth = Math.max(1, 0.9 * u);
      const sc = at(f, [MX - RX * 0.5, MY + RY * 0.35, MX, MY - RY * 0.05, MX + RX * 0.55, MY - RY * 0.2]);
      ctx.beginPath(); ctx.moveTo(sc[0], sc[1]); ctx.lineTo(sc[2], sc[3]); ctx.lineTo(sc[4], sc[5]); ctx.stroke();
    }
    // Barnacles along the crown of the mantle: little grey cones, each with its dark mouth.
    if (b.barnacles > 0) {
      for (let i = 0; i < 9; i++) {
        const a = 1.1 + (i / 8) * 1.4 + (nz(i, 31) - 0.5) * 0.15, k = 0.74 + nz(i, 33) * 0.14;
        const bx = MX + Math.cos(a) * RX * k, by = MY + Math.sin(a) * RY * k;
        const r = (1 + nz(i, 35) * 0.9) * b.barnacles * u;
        ctx.fillStyle = shade('#c4c0b4', Math.max(0.55, p.tone)); ctx.beginPath(); ctx.arc(f.X(bx), f.Y(by), r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba('#20201c', 0.7); ctx.beginPath(); ctx.arc(f.X(bx), f.Y(by), r * 0.4, 0, Math.PI * 2); ctx.fill();
      }
    }
    // Wet light on the mantle, a long streak down its lit side.
    ctx.strokeStyle = rgba('#ffffff', 0.3 * b.gloss); ctx.lineWidth = Math.max(1, 1.8 * u); ctx.lineCap = 'round';
    const wl = at(f, [MX - RX * 0.75, MY - RY * 0.1, MX - RX * 0.65, MY + RY * 0.45, MX - RX * 0.25, MY + RY * 0.8]);
    ctx.beginPath(); ctx.moveTo(wl[0], wl[1]); ctx.quadraticCurveTo(wl[2], wl[3], wl[4], wl[5]); ctx.stroke();
    // The siphon's mouth, dark, opening as it pulses.
    ctx.fillStyle = rgba(mark, 0.8); ctx.beginPath(); ctx.ellipse(f.X(18 * m + pulse), f.Y(LY + 8 + pulse * 0.5), (0.9 + pulse * 0.5) * u, (1.2 + pulse * 0.5) * u, 0.3, 0, Math.PI * 2); ctx.fill();
  }

  // --- the eye: one, on its knuckle, gold and barred, watching the company ----------------------
  if (!B.override) {
    const cx = f.X(ex), cy = f.Y(ey), r = er * u;
    const lid = (t + 25) % 150;
    const shut = lid < 12 ? Math.sin((lid / 12) * Math.PI) : 0;          // the lid slides down and back up
    ctx.fillStyle = shade(b.iris, Math.max(0.7, p.tone)); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(shade(b.iris, 0.45), 0.5); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.05, Math.PI * 0.95); ctx.fill();
    // The pupil: a thick black bar across it, the octopus's.
    ctx.fillStyle = '#120c14'; ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.05, r * 0.7, r * 0.22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(cx - r * 0.4, cy - r * 0.42, Math.max(0.7, r * 0.18), 0, Math.PI * 2); ctx.fill();
    if (shut > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r * 1.04, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = shade(hide, 0.92); ctx.fillRect(cx - r * 1.1, cy - r * 1.1, r * 2.2, r * 2.2 * shut);
      ctx.restore();
    }
    // The heavy brow of the socket over it.
    softLine(ctx, B, [cx - r * 1.2, cy - r * 0.35, cx - r * 0.3, cy - r * 1.05, cx + r * 0.7, cy - r * 0.95, cx + r * 1.25, cy - r * 0.3], hide, Math.max(1, 1.3 * u), 0.8);
  }

  // --- the lip ----------------------------------------------------------------------------------
  // Over the body's base: a dark, wet edge seen end-on, a little rounded, with no grain to say rock
  // or plank. The light runs along its top; weed hangs down its face; water runs off it.
  const lipPts = [-L, 0, -L - 1, LY - 4, -L * 0.75, LY - 0.5, -L * 0.3, LY + 0.6, L * 0.2, LY + 0.8, L * 0.7, LY - 0.3, L + 1, LY - 4, L, 0];
  blob(ctx, B, rock, [{ k: 'curve', pts: at(f, lipPts), wobble: 0.015, seed: 3, sub: 2 }], { h, formK: 0.3, spread: 0.75, gloss: 0.15 });
  if (!B.override) {
    ctx.strokeStyle = rgba('#d8e4e8', 0.35); ctx.lineWidth = Math.max(1, 0.9 * u); ctx.lineCap = 'round';
    const top = at(f, [-L * 0.9, LY - 1.6, -L * 0.3, LY - 0.6, L * 0.3, LY - 0.5, L * 0.85, LY - 1.8]);
    ctx.beginPath(); ctx.moveTo(top[0], top[1]); for (let i = 2; i < top.length; i += 2) ctx.lineTo(top[i], top[i + 1]); ctx.stroke();
    // Weed: dark green fronds from the edge down the face, between the arms.
    for (let i = 0; i < 9; i++) {
      const wx = -L * 0.92 + (i / 8) * L * 1.84 + (nz(i, 41) - 0.5) * 6, wl = 5 + nz(i, 43) * (LY - 6);
      const sway = Math.sin(t / 37 + i) * 0.8;
      patch(ctx, B, weed, [{ k: 'tube', pts: at(f, [wx, LY - 0.5, wx + 0.5 + sway * 0.4, LY - wl * 0.5, wx + 1 + sway, LY - wl]), r0: (1.6 + nz(i, 45)) * u, r1: 0.6 * u }], { alpha: 0.8, feather: 0.3 });
    }
    // Runs of water down the face, each ending in a drop that swells at the foot and lets go.
    const runs = Math.max(3, Math.round(L / 10));
    for (let i = 0; i < runs; i++) {
      const rx = -L * 0.8 + (i / (runs - 1)) * L * 1.6 + (nz(i, 51) - 0.5) * 5;
      const run = at(f, [rx, LY - 1, rx + 0.4, LY * 0.5, rx + 0.2, 1.5]);
      ctx.strokeStyle = rgba('#c8d8dc', 0.22); ctx.lineWidth = Math.max(1, 0.8 * u);
      ctx.beginPath(); ctx.moveTo(run[0], run[1]); ctx.lineTo(run[2], run[3]); ctx.lineTo(run[4], run[5]); ctx.stroke();
      // Falling, the drop is faint: under the ink's alpha, so it never stands apart from the sprite.
      const k = (t / 50 + nz(i, 53)) % 1, dr = (0.6 + k * 0.8) * u, dy = k > 0.75 ? (k - 0.75) * 14 * u : 0;
      ctx.fillStyle = rgba('#d8e8ec', dy > 0 ? 0.3 : 0.45); ctx.beginPath(); ctx.arc(run[4], run[5] + dy, dr, 0, Math.PI * 2); ctx.fill();
    }
  }

  // --- the gripping arms, over the edge and down its face ---------------------------------------
  // Each comes from behind the head, over the lip's top, and down the face, its tip curled under;
  // they hold still, but for the tip working a little.
  for (const [i, [gx, s]] of b.grip.entries()) {
    const w = Math.sin(t / 29 + i * 1.9) * 0.6;
    const pts = spine([gx - s * 7, LY + 9, gx - s * 1.5, LY + 3.5, gx + s * 2.5, LY + 0.5, gx + s * 5, LY - 5, gx + s * 6, LY - 10,
      gx + s * (4 + w), LY - 13.5, gx + s * (1.5 + w), LY - 12.5], 5);
    arm({ pts, r0: g, r1: 1.4 }, hide, 60 + i, (nx) => nx * s < 0, b.gloss);
  }

  // --- the arm reared in front, come up over the edge at the company ----------------------------
  for (const [i, [bx, tx, ty, ph, front]] of b.free.entries()) {
    if (!front) continue;
    const a = reared(bx, LY + 4, tx, ty, ph, g * 1.1);
    arm(a, hide, 70 + i, inward(a), b.gloss);
  }
}

/**
 * The suckers along an arm, from a third of its length to its tip: pale rings with a dark centre,
 * shrinking with the arm, on the side `side` picks from each point's normal (frame x).
 */
function suckers(ctx: CanvasRenderingContext2D, f: F, a: Arm, pale: string, mark: string, side: (nx: number, ny: number) => boolean): void {
  if (B.override || f.h < 40) return;
  const n = a.pts.length / 2, u = f.u;
  for (let i = Math.floor(n * 0.3); i < n - 1; i += 2) {
    const dx = a.pts[i * 2 + 2] - a.pts[i * 2 - 2], dy = a.pts[i * 2 + 3] - a.pts[i * 2 - 1], L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L, ny = dx / L;
    if (!side(nx, ny)) { nx = -nx; ny = -ny; }
    const r = a.r0 + (a.r1 - a.r0) * (i / (n - 1));
    const sx = a.pts[i * 2] + nx * r * 0.62, sy = a.pts[i * 2 + 1] + ny * r * 0.62, sr = Math.max(0.5, r * 0.4) * u;
    ctx.fillStyle = rgba(pale, 0.85); ctx.beginPath(); ctx.arc(f.X(sx), f.Y(sy), sr, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(mark, 0.55); ctx.beginPath(); ctx.arc(f.X(sx), f.Y(sy), sr * 0.45, 0, Math.PI * 2); ctx.fill();
  }
}

/**
 * Wet skin: the light caught in a line along the lit side of a spine (frame units), rather than a
 * spot that would make a shell of it.
 */
function wet(ctx: CanvasRenderingContext2D, f: F, pts: readonly number[], r: number, gloss: number): void {
  if (B.override || gloss <= 0) return;
  const n = pts.length / 2, o: number[] = [];
  // One side for the whole run, the one the light falls on at the middle, so a curl never zigzags it.
  const nrm = (i: number): [number, number] => {
    const dx = pts[i * 2 + 2] - pts[i * 2 - 2], dy = pts[i * 2 + 3] - pts[i * 2 - 1], L = Math.hypot(dx, dy) || 1;
    return [-dy / L, dx / L];
  };
  const [mx, my] = nrm(Math.floor(n / 3));
  // The light is up and to the left: B.light in canvas terms, frame y is flipped.
  const side = mx * B.light.x - my * B.light.y < 0 ? -1 : 1;
  for (let i = 1; i < Math.floor(n * 0.6); i++) {
    const [nx, ny] = nrm(i), k = 1 - i / n;
    o.push(pts[i * 2] + side * nx * r * 0.55 * k, pts[i * 2 + 1] + side * ny * r * 0.55 * k);
  }
  if (o.length < 4) return;
  const q = at(f, o);
  ctx.strokeStyle = rgba('#ffffff', 0.3 * gloss); ctx.lineWidth = Math.max(1, r * f.u * 0.28); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(q[0], q[1]); for (let i = 2; i < q.length; i += 2) ctx.lineTo(q[i], q[i + 1]); ctx.stroke();
}
