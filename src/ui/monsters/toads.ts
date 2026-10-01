// The toads: the Fen Toad first, on one frame the Bull Toad scales up. A toad squatting square to
// the company, in hundredths of the sprite's height up from the ground line: the body a low dome
// nearly twice as wide as it is tall, the head part of it with no neck between, a mouth as wide as
// the head straight across, and the eyes up on top, bulging, gold, with a bar of a pupil. The front
// legs splay forward with the fingers spread on the ground; the hind legs fold at the sides, the
// thighs the biggest round things on it, the webbed feet turned out. Behind each eye a swollen gland,
// and that is where it weeps: a pale sweat that runs from the glands down the flanks and the skin
// round the runs blotched dark. Drawn as masses: the far legs a step darker, the body and head as
// one hide, the throat and the belly a pale marking on it, the near legs over it, then the glands,
// the warts, the runs, the eyes.
//
// The Fen Toad: a toad the size of a sheep, its skin weeping. Mud-olive, blotched, wet. Idle: the
// throat pumps, the eyes blink now and then, and the sweat gathers and drips.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['fen_toad'];

/**
 * The frame's parts, as proportions of the fen toad's (1 = the fen toad, 0 = none), each named for
 * the toad that pushes it furthest, so the bull toad is a Build and a colouring.
 */
interface Build {
  /** Width of the body against its height: the bull toad's is wider still. */
  width: number;
  /** Height of the dome: the bull toad's back is higher. */
  dome: number;
  /** Size of the eyes. */
  eyes: number;
  /** The throat's sac, how far it swells as it pumps: the bull toad's bellows. */
  throat: number;
  /** How big the glands behind the eyes are. */
  glands: number;
  /** Warts on the back, 0 a smooth skin. */
  warts: number;
  /** Dark blotches on the hide. */
  blotch: number;
  /** The pale sweat running from the glands: the fen toad's weeping. */
  weep: number;
  /** How wet the skin shines, 0..1. */
  gloss: number;
  /** The throat's and the belly's colour, mixed into the tint. */
  belly: string;
}
const FEN: Build = {
  width: 1, dome: 1, eyes: 1, throat: 1, glands: 1, warts: 1, blotch: 1, weep: 1, gloss: 0.8, belly: '#d8cc98',
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  toad(ctx, x, y, h, p, FEN);
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

function toad(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const u = h / 100, f: F = { u, h, X: (v) => x + v * u, Y: (v) => y - v * u };
  const t = p.frame, pump = 0.5 + 0.5 * Math.sin(t / 7);
  const W = 92 * b.width, D = 62 * b.dome;                 // the body's width and the dome's top
  const hide = p.base, far = shade(p.dark, 0.85);
  const pale = shade(mix(p.base, b.belly, 0.72), Math.max(0.55, p.tone));
  const mark = shade(mix(p.dark, '#140e08', 0.5), 1);
  groundShadow(ctx, x, y + 1, W * u * 1.05);

  // --- the hind legs: the thigh folded up against the flank, the shin under it, the foot out ----
  const hind = (s: number, hex: string): void => {
    blob(ctx, B, hex, [
      { k: 'ell', x: f.X(s * W * 0.4), y: f.Y(17), rx: 17 * u, ry: 14 * u, rot: s * 0.35 },
      { k: 'cap', x0: f.X(s * W * 0.5), y0: f.Y(8), x1: f.X(s * W * 0.36), y1: f.Y(4), r0: 6.5 * u, r1: 5 * u },
    ], { h, formK: 0.5, spread: 0.85 });
    webbed(ctx, f, s * W * 0.5, 2.5, s, 1.15, hex);
  };
  hind(-1, far); hind(1, far);

  // --- the body and the head, one hide ----------------------------------------------------------
  // A low dome, widest a little above the ground, the head's front edge flattened where the mouth is.
  const body: number[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI * (i / 16), c = Math.cos(a), sn = Math.sin(a);
    // Flatter on top, fuller at the flanks: a superellipse of the dome.
    const k = Math.pow(sn, 0.72);
    body.push(c * W * 0.5 * (1 + 0.04 * sn), 6 + k * (D - 6) + (Math.abs(c) < 0.25 ? 1.5 : 0));
  }
  body.push(-W * 0.44, 4, -W * 0.2, 2, W * 0.2, 2, W * 0.44, 4);
  const hidePart: Part = { k: 'curve', pts: at(f, body), wobble: 0.03, seed: 5, sub: 2 };
  // The swelling of the back over each thigh, so the haunches show through the hide.
  const haunch = (s: number): Part => ({ k: 'ell', x: f.X(s * W * 0.33), y: f.Y(24), rx: 16 * u, ry: 13 * u, rot: s * 0.4 });
  blob(ctx, B, hide, [hidePart, haunch(-1), haunch(1)], { h, formK: 0.35, spread: 0.9, tex: 'stipple', seed: 7, amount: 0.5 });
  if (!B.override) {
    // The blotches, dark and soft-edged, the skin's own colour.
    if (b.blotch > 0) {
      const BL: [number, number, number, number][] = [[-33, 44, 8, 6], [30, 47, 7, 5], [-4, 57, 6, 3], [38, 28, 7, 8], [-40, 24, 6, 7], [17, 56, 5, 3]];
      for (const [bx, by, rx, ry] of BL) patch(ctx, B, mark, [{ k: 'curve', pts: blot(f, bx * b.width, by * b.dome, rx, ry, bx), wobble: 0.2, seed: bx + 100, sub: 2 }], { alpha: 0.32 * b.blotch, feather: 0.7 });
    }
    // The throat and the belly between the front legs: pale, and the throat swelling as it pumps.
    const sac = (5 + pump * 3.5 * b.throat);
    patch(ctx, B, pale, [{ k: 'ell', x: f.X(0), y: f.Y(13), rx: W * 0.3 * u, ry: sac * u }], { alpha: 0.85, feather: 0.55 });
  }

  // --- the mouth: a line as wide as the head, curving down at its ends ----------------------------
  const my = 36 * b.dome, mw = W * 0.38;
  if (!B.override) {
    const lip = at(f, [-mw, my - 3, -mw * 0.7, my - 0.6, -mw * 0.3, my, 0, my + 0.4, mw * 0.3, my, mw * 0.7, my - 0.6, mw, my - 3]);
    softLine(ctx, B, lip, mark, Math.max(1, 2 * u), 0.95);
    // The upper lip catches the light along its ridge.
    softLine(ctx, B, at(f, [-mw * 0.66, my + 1.6, 0, my + 2.2, mw * 0.66, my + 1.6]), shade(hide, 1.5), Math.max(1, 0.8 * u), 0.5);
    // Nostrils, two dark points at the front of the snout.
    ctx.fillStyle = rgba(mark, 0.8);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(f.X(s * 4.5), f.Y(my + 7), 1.1 * u, 0.8 * u, 0, 0, Math.PI * 2); ctx.fill(); }
  }

  // --- the front legs: down from the shoulders, splayed, fingers spread on the ground ---------------
  for (const s of [-1, 1]) {
    blob(ctx, B, hide, [
      { k: 'cap', x0: f.X(s * W * 0.27), y0: f.Y(22), x1: f.X(s * W * 0.3), y1: f.Y(9), r0: 6 * u, r1: 4.5 * u },
      { k: 'cap', x0: f.X(s * W * 0.3), y0: f.Y(9), x1: f.X(s * W * 0.26), y1: f.Y(3), r0: 4.5 * u, r1: 3.5 * u },
    ], { h, formK: 0.45, spread: 0.85 });
    webbed(ctx, f, s * W * 0.26, 1.6, s, 0.8, hide, false);
  }

  // --- the glands behind the eyes, and the warts --------------------------------------------------
  const ey = D - 9 * b.dome, ex = W * 0.2, er = 8.5 * b.eyes;
  for (const s of [-1, 1]) {
    blob(ctx, B, shade(hide, 1.05), [{ k: 'ell', x: f.X(s * (ex + 12)), y: f.Y(ey - 3), rx: 9 * b.glands * u, ry: 5 * b.glands * u, rot: s * -0.45 }], { h, formK: 0.6, spread: 0.8, gloss: b.gloss * 0.6 });
  }
  if (!B.override && b.warts > 0 && h >= 36) {
    for (let i = 0; i < 26; i++) {
      const wx = (nz(i, 3) - 0.5) * W * 0.9, wy = 18 + nz(i, 7) * (D - 22);
      // Only on the back and the flanks, not on the face between the eyes and the mouth.
      if (Math.abs(wx) < W * 0.3 && wy < ey + 4 && wy > my - 2) continue;
      const domeAt = 6 + Math.pow(Math.sqrt(Math.max(0, 1 - (2 * wx / W) ** 2)), 0.72) * (D - 6);
      if (wy > domeAt - 3) continue;
      const r = (0.9 + nz(i, 11) * 1.2) * b.warts * u;
      ctx.fillStyle = rgba(shade(hide, 1.35), 0.75); ctx.beginPath(); ctx.arc(f.X(wx) - r * 0.25, f.Y(wy) - r * 0.25, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba(mark, 0.3); ctx.beginPath(); ctx.arc(f.X(wx) + r * 0.35, f.Y(wy) + r * 0.3, r * 0.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // --- the weeping: a pale sweat from each gland down the flank, gathering into a drop -----------
  if (!B.override && b.weep > 0) {
    const sweat = shade(mix(b.belly, '#f4f0d0', 0.5), Math.max(0.6, p.tone));
    const RUNS: [number, number, number][] = [[0, 0.9, 0], [1, 1.1, 1.7], [2, 0.75, 3.1]];
    for (const s of [-1, 1]) for (const [i, len, ph] of RUNS) {
      const sx = s * (ex + 9 + i * 4.5), sy = ey - 5 - i * 1.5, ln = (16 + i * 4) * len * b.weep;
      const run = at(f, [sx, sy, sx + s * 2, sy - ln * 0.4, sx + s * (3 + i), sy - ln * 0.75, sx + s * (3.5 + i), sy - ln]);
      softLine(ctx, B, run, sweat, Math.max(1, 1.5 * u), 0.08);           // the wet track it has left
      ctx.strokeStyle = rgba(sweat, 0.55); ctx.lineWidth = Math.max(1, 1.1 * u); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(run[0], run[1]); for (let k = 2; k < run.length; k += 2) ctx.lineTo(run[k], run[k + 1]); ctx.stroke();
      // The drop at its end swells, and lets go.
      const g = ((t / 60 + ph * 0.31 + (s > 0 ? 0.5 : 0)) % 1);
      const dr = (0.9 + g * 1.3) * u, dy = g > 0.8 ? (g - 0.8) * 30 * u : 0;
      ctx.fillStyle = rgba(sweat, 0.85); ctx.beginPath(); ctx.arc(run[6], run[7] + dy, dr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba('#ffffff', 0.6); ctx.beginPath(); ctx.arc(run[6] - dr * 0.3, run[7] + dy - dr * 0.35, dr * 0.35, 0, Math.PI * 2); ctx.fill();
    }
    // Wet light on the back, a long soft streak rather than a spot.
    ctx.save(); ctx.beginPath(); ctx.ellipse(f.X(-W * 0.12), f.Y(D - 7), W * 0.22 * u, 3 * u, -0.08, 0, Math.PI * 2);
    const sg = ctx.createRadialGradient(f.X(-W * 0.12), f.Y(D - 7), 0, f.X(-W * 0.12), f.Y(D - 7), W * 0.22 * u);
    sg.addColorStop(0, rgba('#ffffff', 0.38 * b.gloss)); sg.addColorStop(1, rgba('#ffffff', 0));
    ctx.fillStyle = sg; ctx.fill(); ctx.restore();
  }

  // --- the eyes: up on the top of the head, bulging out of their sockets, gold, barred ------------
  const blink = (t + 40) % 170 < 8;
  for (const s of [-1, 1]) {
    // The socket's lid: a ridge of the hide over the top of the eye.
    blob(ctx, B, hide, [{ k: 'ell', x: f.X(s * ex), y: f.Y(ey + 1.5), rx: er * 1.25 * u, ry: er * 1.05 * u }], { h, formK: 0.5, spread: 0.8 });
    if (B.override) continue;
    const cx = f.X(s * ex + s * 0.6), cy = f.Y(ey + 0.6), r = er * 0.92 * u;
    if (blink) {
      // The lower lid comes up: a pale crescent closes the eye from below.
      ctx.fillStyle = shade(hide, 1.1); ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.86, 0, 0, Math.PI * 2); ctx.fill();
      softLine(ctx, B, [cx - r * 0.8, cy - r * 0.1, cx, cy - r * 0.3, cx + r * 0.8, cy - r * 0.1], hide, Math.max(1, u), 0.7);
      continue;
    }
    const gold = shade('#d8a02a', Math.max(0.7, p.tone));
    eye(ctx, cx, cy, r, gold, false);
    // The iris flecked darker, and the pupil a black bar across it.
    ctx.fillStyle = rgba(shade('#6a4410', 1), 0.5); ctx.beginPath(); ctx.arc(cx, cy, r * 0.98, Math.PI * 0.1, Math.PI * 0.9); ctx.fill();
    ctx.fillStyle = '#120c14'; ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.05, r * 0.62, r * 0.24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(cx - r * 0.38, cy - r * 0.42, Math.max(0.7, r * 0.2), 0, Math.PI * 2); ctx.fill();
    // The upper lid's edge, heavy over the eye: the toad's frown.
    softLine(ctx, B, [cx - r * 1.05, cy - r * 0.42 + s * r * 0.15, cx, cy - r * 0.95, cx + r * 1.05, cy - r * 0.42 - s * r * 0.15], hide, Math.max(1, 1.4 * u), 0.85);
  }
}

/** A blotch: a rough ring of points round (bx, by), `rx` by `ry`, in frame units. */
function blot(f: F, bx: number, by: number, rx: number, ry: number, seed: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, k = 0.75 + nz(seed, i) * 0.5;
    o.push(bx + Math.cos(a) * rx * k, by + Math.sin(a) * ry * k);
  }
  return at(f, o);
}

/**
 * A foot on the ground at (fx, fy) in frame units: four fingers (or webbed toes, `webbed`) fanning
 * out to the `s` side, `k` its size. The hind foot is webbed; the hand's fingers are free.
 */
function webbed(ctx: CanvasRenderingContext2D, f: F, fx: number, fy: number, s: number, k: number, hex: string, web = true): void {
  const u = f.u, toes: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const a = (-0.25 + i * 0.32) * Math.PI * 0.5;          // from inward to outward
    const len = (7 + (i === 2 ? 2 : 0)) * k;
    const tx = fx + s * Math.sin(a + 0.35) * len, ty = fy - 1.2 + Math.cos(a) * 0.5;
    toes.push([tx, ty]);
  }
  const parts: Part[] = toes.map(([tx, ty]) => ({ k: 'cap', x0: f.X(fx), y0: f.Y(fy), x1: f.X(tx), y1: f.Y(ty), r0: 2 * k * u, r1: 1.2 * k * u }));
  if (web) parts.push({ k: 'poly', pts: at(f, [fx, fy + 1.4 * k, ...toes.flatMap(([tx, ty]) => [tx, ty + 0.4])]) });
  // The toe tips, round pads where they meet the ground.
  for (const [tx, ty] of toes) parts.push({ k: 'ball', x: f.X(tx), y: f.Y(ty), r: 1.5 * k * u });
  blob(ctx, B, hex, parts, { h: f.h, formK: 0.3, spread: 0.8 });
}
