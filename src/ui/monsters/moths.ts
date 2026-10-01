// The moths: the Lantern Moth first, on one frame the Deathshead darkens and marks and Hearth Isle's
// hearth moth reddens. A moth hanging in the air square to the company, in hundredths of the
// sprite's height up from the ground line, nothing of it touching the ground: a furred thorax with
// the head under it, two great combed antennae, the abdomen hanging below in bands, and the wings
// spread flat to either side. Each forewing is a hand held open, the palm at the shoulder and four
// fingers fanning out to a scalloped edge, a dark vein down each finger; the hindwing is a rounded
// lobe under it. Drawn as masses: the hindwings, then the forewings (one wing each, its own
// contour), the abdomen, the thorax and head over the wings' roots, the antennae, then the dust.
// The dust is the one thing apart: specks shaken off the wings as they beat, glittering as they
// fall, declared detached in tools/smoke.ts.
//
// The Lantern Moth: wings like a pair of hands, and dust that glitters. Pale as ash, the fingers'
// veins grey, a dusky smudge in each palm. Idle: the wings beat slowly, the body bobs with them, the
// antennae sway, and the dust drifts down glittering.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glow, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['lantern_moth', 'deathshead'];

/**
 * The frame's parts, as proportions of the lantern moth's (1 = the lantern moth, 0 = none), each
 * named for the moth that pushes it furthest, so the deathshead and the hearth moth are a Build and
 * a colouring.
 */
interface Build {
  /** The forewings' span: the deathshead's are narrower and swept, the hawk-moth's. */
  fore: number;
  /** How deep the fingers of the forewing are cut, 0 a plain edge: the lantern moth's hands. */
  fingers: number;
  /** How strongly the veins, the fingers' bones, are drawn. */
  veins: number;
  /** The hindwings' size: the heel of the hand. */
  hind: number;
  /** Bands across the hindwings and the abdomen, 0 none: the deathshead's ochre and black. */
  band: number;
  /** Bulk of the thorax and abdomen: the deathshead's is heavy. */
  body: number;
  /** The thorax's fur. */
  fur: number;
  /** Length of the antennae, and how combed: the lantern moth's are feathers. */
  antenna: number;
  /** The smudge in each palm, 0 none. */
  smudge: number;
  /** The skull on the thorax, 0 none: the deathshead's. */
  mark: number;
  /** How far the forewings are swept down and back from the level, in radians: the hawk-moth's. */
  sweep: number;
  /** The scream: now and then the wings shiver, too fast to see, 0 never. */
  scream: number;
  /** How much dust comes off the wings, 0 none. */
  dust: number;
  /** The colour mixed in under the wings and the body: the hearth moth's red, lit from below. */
  underside: string | null;
  /** The bands' colour. */
  bandHex: string;
  /** The skull's colour. */
  markHex: string;
  /** The dust's colour as it glitters: the hearth moth's is embers. */
  dustHex: string;
}
const LANTERN: Build = {
  fore: 1, fingers: 1, veins: 1, hind: 1, band: 0, body: 1, fur: 1, antenna: 1, smudge: 1, mark: 0, sweep: 0, scream: 0, dust: 1,
  underside: null, bandHex: '#b8862e', markHex: '#e6dcbc', dustHex: '#fff4d0',
};
/**
 * The Deathshead: a skull on its back, and a scream in its wings. The hawk-moth: bigger and darker,
 * the body heavy, the forewings long and swept back with their fingers worn nearly to a plain edge,
 * the hindwings and the abdomen banded ochre and black, short antennae, and on the thorax the skull,
 * the one pale thing on it. Now and then its wings shiver: the scream.
 */
const DEATHSHEAD: Build = {
  fore: 1.1, fingers: 0.4, veins: 0.6, hind: 0.85, band: 1, body: 1.4, fur: 1.3, antenna: 0.5, smudge: 0.6, mark: 1, sweep: 0.3, scream: 1, dust: 1,
  underside: null, bandHex: '#b8862e', markHex: '#e6dcbc', dustHex: '#e8d8a8',
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  moth(ctx, x, y, h, p, kind === 'deathshead' ? DEATHSHEAD : LANTERN);
};

/** A frame: x and y map hundredths of the height (x right, y up from the ground) to the canvas. */
interface F { u: number; X: (v: number) => number; Y: (v: number) => number }
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

/** The forewing, the right-hand one, from the shoulder: a palm and four fingers to a scalloped edge. */
const FORE = [4, 66, 14, 78, 24, 88, 32, 97, 38, 100, 43, 97, 42, 87, 50, 95, 56, 96, 59, 91, 55, 81, 63, 86, 68, 82, 68, 76, 61, 71, 66, 66, 66, 60, 61, 57, 48, 54, 30, 52, 14, 54, 5, 57];
/** The notches between the fingers (indices into FORE), and where a plain edge would put them. */
const NOTCHES = [12, 20, 28];
const PLAIN = [[47, 98], [62, 91], [68, 70]];
/** Where each finger ends, for its vein. */
const TIPS = [[38, 98], [56, 94], [66, 80], [64, 62]];
/** The hindwing, a rounded lobe under the forewing. */
const HIND = [4, 57, 22, 53, 39, 46, 45, 36, 39, 26, 25, 27, 10, 40];

function moth(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const t = p.frame, u = h / 100;
  // The beat: the wings lift and drop about the shoulder, and the body bobs against them.
  // The scream: for a moment in every few seconds the wings shiver, fast and small.
  const sc = t % 130, shiver = b.scream > 0 && sc < 22 ? Math.sin(sc * 2.1) * 0.5 * b.scream * (1 - sc / 22) : 0;
  const beat = Math.sin(t / 5) * (shiver ? 0.3 : 1) + shiver, bob = -beat * 2.2;
  const f: F = { u, X: (v) => x + v * u, Y: (v) => y - (v + bob) * u };
  const under = (hex: string): string => (b.underside ? mix(hex, shade(b.underside, p.tone), 0.35) : hex);
  const wing = under(p.base), vein = shade(mix(p.dark, '#3a3430', 0.4), 1), fur = under(shade(mix(p.base, p.dark, 0.45), 1));
  groundShadow(ctx, x, y + 1, h * 0.7);

  /** A wing's outline on side s, its x spread by `span` and turned about the shoulder by the beat. */
  const shoulder = { x: 4, y: 60 };
  const narrow = 0.86 + 0.14 * Math.cos(t / 5);
  const turn = (pts: readonly number[], s: number, lift: number, k = b.fore): number[] => {
    const a = beat * 0.14 * lift - (lift >= 1 ? b.sweep : 0), c = Math.cos(a), sn = Math.sin(a), o: number[] = [];
    for (let i = 0; i < pts.length; i += 2) {
      const dx = (pts[i] - shoulder.x) * k * narrow, dy = (pts[i + 1] - shoulder.y) * (lift < 1 ? b.hind : 1);
      o.push(s * (shoulder.x + dx * c - dy * sn), shoulder.y + dx * sn + dy * c);
    }
    return o;
  };

  // --- the hindwings, a step darker, behind ------------------------------------------------------
  for (const s of [-1, 1]) {
    blob(ctx, B, shade(wing, 0.86), [{ k: 'curve', pts: at(f, turn(HIND, s, 0.7, b.hind)), wobble: 0.02, seed: 7 + s, sub: 3 }], { h, formK: 0.3, spread: 0.9 });
    if (b.band > 0) patch(ctx, B, b.bandHex, [{ k: 'curve', pts: at(f, turn([12, 45, 30, 44, 38, 36, 30, 31, 16, 38], s, 0.7, b.hind)), wobble: 0.04, seed: 9, sub: 2 }], { alpha: 0.75 * b.band, feather: 0.4 });
  }

  // --- the forewings: a hand each ---------------------------------------------------------------
  // The notches between the fingers, pulled out toward a plain edge as `fingers` falls.
  const fore = FORE.slice();
  for (const i of NOTCHES) { const [nx, ny] = [FORE[i], FORE[i + 1]], [ox, oy] = PLAIN[NOTCHES.indexOf(i)]; fore[i] = ox + (nx - ox) * b.fingers; fore[i + 1] = oy + (ny - oy) * b.fingers; }
  for (const s of [-1, 1]) {
    const outline = turn(fore, s, 1);
    blob(ctx, B, wing, [{ k: 'curve', pts: at(f, outline), wobble: 0.015, seed: 3 + s, sub: 3 }], { h, formK: 0.3, spread: 0.95, tex: 'stipple', seed: 13 + s, amount: 0.12 });
    if (B.override) continue;
    // The palm's smudge, dusky and soft.
    if (b.smudge > 0) {
      const [px, py] = turn([22, 70], s, 1);
      patch(ctx, B, vein, [{ k: 'ell', x: f.X(px), y: f.Y(py), rx: 9 * u, ry: 7 * u, rot: -s * 0.5 }], { alpha: 0.35 * b.smudge, feather: 0.9 });
    }
    // A vein down each finger from the palm, and the edge of the wing a shade paler.
    for (const [tx, ty] of TIPS) {
      const v = turn([8, 62, (8 + tx) * 0.5, (62 + ty) * 0.5 + 2, tx * 0.94, ty * 0.97], s, 1);
      softLine(ctx, B, at(f, v), vein, Math.max(1, 1.1 * u), 0.55 * b.veins);
    }
    softLine(ctx, B, at(f, turn([40, 53, 21, 55, 8, 58], s, 1)), vein, Math.max(1, 0.9 * u), 0.35);
  }

  // --- the body: abdomen hanging in bands, the furred thorax, the head ---------------------------
  const bk = b.body;
  blob(ctx, B, fur, [{ k: 'tube', pts: at(f, [0, 54, 0.6, 42, 0, 30]), r0: 6.5 * bk * u, r1: 2.6 * bk * u }], { h, formK: 0.5, tex: 'fur', seed: 21, amount: 0.4 });
  if (!B.override) for (let i = 0; i < 4; i++) {
    const yy = 49 - i * 4.6, w = (6 - i * 0.9) * bk;
    softLine(ctx, B, at(f, [-w, yy + 0.6, 0, yy - 0.6, w, yy + 0.6]), b.band > 0 ? '#120c08' : vein, Math.max(1, 1.2 * u), 0.5);
    if (b.band > 0) softLine(ctx, B, at(f, [-w * 0.9, yy - 1.6, 0, yy - 2.8, w * 0.9, yy - 1.6]), b.bandHex, Math.max(1, 1.4 * u), 0.85 * b.band);
  }
  blob(ctx, B, fur, [{ k: 'curve', pts: ring(f.X(0), f.Y(61), 7.5 * bk * u, 9 * bk * u, 10), wobble: 0.06, spiky: 0.14 * b.fur, seed: 23, sub: 2 }], { h, formK: 0.55, tex: 'fur', seed: 24, amount: 0.6 * b.fur });
  if (b.mark > 0) skullMark(ctx, f, u, b.mark, b.markHex, p);
  // The head, and its two dark eyes, round and wide.
  blob(ctx, B, shade(fur, 0.9), [{ k: 'ball', x: f.X(0), y: f.Y(71), r: 4.8 * bk * u }], { h, formK: 0.5 });
  for (const s of [-1, 1]) {
    eye(ctx, f.X(s * 3), f.Y(72), Math.max(0.9, 2.3 * bk * u), shade('#1a1214', 1), false);
    if (!B.override && u > 0.8) { ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.beginPath(); ctx.arc(f.X(s * 3 - 0.7), f.Y(73), Math.max(0.6, 0.6 * u), 0, Math.PI * 2); ctx.fill(); }
  }

  // --- the antennae: combed, feathered, swaying ---------------------------------------------------
  const sway = Math.sin(t / 13) * 2;
  const ant: Part[] = [];
  for (const s of [-1, 1]) {
    const len = b.antenna;
    const pts = [s * 2, 75, s * (6 + sway * 0.3), 84 * (len > 0 ? 1 : 0) + 0, s * (13 + sway) * len, 75 + 21 * len];
    ant.push({ k: 'tube', pts: at(f, pts), r0: 1.1 * u, r1: 0.7 * u });
    // The comb: short barbs down the outer side, as a feather's.
    if (!B.override && h >= 40) for (let k = 1; k <= 5; k++) {
      const q = k / 6, ax = s * (2 + (11 + sway) * len * q), ay = 75 + 21 * len * q;
      softLine(ctx, B, at(f, [ax, ay, ax + s * 3.5, ay + 1.2]), fur, Math.max(1, 0.7 * u), 0.6);
    }
  }
  blob(ctx, B, fur, ant, { h, form: false });

  // --- the dust: specks shaken off as the wings beat, falling and glittering ---------------------
  if (b.dust > 0) dust(ctx, f, y, u, t, b);
}

/** A ring of n points round (cx, cy), the raw contour a 'curve' part lumps further. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/** The deathshead's skull on the thorax: the one pale thing on it (#242). */
function skullMark(ctx: CanvasRenderingContext2D, f: F, u: number, k: number, hex: string, p: Paint): void {
  if (B.override) return;
  const bone = shade(hex, Math.max(0.7, p.tone));
  patch(ctx, B, bone, [{ k: 'ell', x: f.X(0), y: f.Y(62), rx: 5 * u * k, ry: 4.6 * u * k }], { alpha: 0.9, feather: 0.25 });
  ctx.fillStyle = rgba('#140c08', 0.85);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(f.X(s * 2), f.Y(62.5), 1.3 * u * k, 1.5 * u * k, 0, 0, Math.PI * 2); ctx.fill(); }
  // The nose, and the jaw's teeth under it: a row of dark ticks across the bone.
  ctx.beginPath(); ctx.moveTo(f.X(0), f.Y(61)); ctx.lineTo(f.X(-0.7), f.Y(59.8)); ctx.lineTo(f.X(0.7), f.Y(59.8)); ctx.closePath(); ctx.fill();
  if (u * k > 0.7) for (let i = -2; i <= 2; i++) ctx.fillRect(Math.round(f.X(i * 1.1)), Math.round(f.Y(58.6)), 1, Math.max(1, Math.round(1.2 * u * k)));
}

/**
 * The dust: specks shaken off the wings as they beat, falling clear of the moth and glittering as
 * they fall. The fine glints are a pixel or two, under what the silhouette check counts; three
 * specks are bigger, and those are the pieces it is told of (tools/smoke.ts).
 */
function dust(ctx: CanvasRenderingContext2D, f: F, y: number, u: number, t: number, b: Build): void {
  const n = Math.round(8 * b.dust);
  for (let i = 0; i < n; i++) {
    const big = i < 3, cyc = 60 + nz(i, 1) * 40, ph = ((t + nz(i, 2) * cyc) % cyc) / cyc;
    const x0 = (nz(i, 3) - 0.5) * 70 + Math.sin(t / 11 + i) * 3, yy = 22 - ph * 14;
    const cx = Math.round(f.X(x0)), cy = Math.round(y - yy * u);   // falling free: no bob
    const tw = 0.5 + 0.5 * Math.sin(t / 3 + i * 2.1), r = big ? 3 : 1;
    if (B.override) { ctx.fillStyle = B.override; ctx.fillRect(cx - 1, cy - 1, r, r); continue; }
    glow(ctx, B, cx, cy, (big ? 5 : 3) * Math.max(1, u), b.dustHex, 0.3 * (1 - ph * 0.6), '#ffffff');
    ctx.fillStyle = rgba(tw > 0.5 ? '#ffffff' : b.dustHex, 1);
    ctx.fillRect(cx - 1, cy - 1, r, r);
  }
}
