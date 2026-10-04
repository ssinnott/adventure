// The long bodies: the Fen Eel first, on one frame the road's other long things reshape (the leech,
// the rock worm, the ice pike, the glass worm and the ice worm). What the company sees of one is
// never all of it: it lies in something, water or earth or ice, and shows a body that comes up out
// of it in coils, and a head reared up on the last of them. So the frame is a `pool` (the surface
// it lies in, drawn as part of it, so the coils and the head are one piece of ink with it), the
// `coils` (humps of the body breaking that surface, far ones first), a `fin` along their crests, the
// `rise` (the length that rears up, an S from the surface to the head) and the `head`, whose mouth
// is the kind's: the eel's gape of needle teeth, the leech's round sucker, the worm's ringed maw,
// the pike's long jaw. Everything is laid out in hundredths of the sprite's height up from the
// ground line, as the old wood is, so a kind is a Build and a colouring rather than a new drawing.
//
// The Fen Eel: a back as thick as a man's leg, turning in the reeds. Most of it is under the fen's
// water: two humps of its back rolling through the surface with a ragged fin along them, and the
// head come up on its neck, turned to the company, the jaw open. Olive-black on the back, a dirty
// yellow underneath, and wet all over. Idle: the humps roll through the water, the neck sways, and
// rings spread from where the body goes in.
//
// The Leech: black, and as long as your arm. A blunt length with no head to it: one hump in the
// pool and the front end come up out of it, ringed all its length, ending in the round sucker it
// feeds with, three pale jaws inside it. No eyes, no fin, no jaw: a mouth and nothing else for a
// face. Wet black, a muddy stripe down the near side. Idle: it sways and quests, and the sucker
// opens and closes.
//
// The Rock Worm: this tunnel was not dug by dwarves. The thickest of the long bodies, grey as the
// rock it bores, come up through the floor in a ring of broken stone: a hump of its back behind,
// and its front reared up out of the hole, ringed all its length and gritty with the stone it has
// passed. No eyes and no jaw: the front end is a round maw, ring inside ring of teeth turned
// inward, as wide as the body. Idle: it sways, and the maw opens and closes.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['fen_eel', 'leech', 'rock_worm'];

/**
 * The frame's parts, as proportions of the eel's (1 = the eel, 0 = none). Each is named for the
 * long body that pushes it furthest, so the later ones are a Build and a colouring.
 */
interface Build {
  /** Girth of the body: the rock worm's is the thickest, the leech's blunt length a little over the eel's. */
  girth: number;
  /** How high the head rears: the eel's neck, the worm's whole front, the pike barely out of the ice. */
  rise: number;
  /** How many humps break the surface, 0 to 2. */
  coils: number;
  /** A fin along the back, 0 none: the eel's ragged ridge, the pike's sail. */
  fin: number;
  /** Length of the jaw: the pike's, and the eel's gape. 0 is no jaw at all (the leech, the worm). */
  jaw: number;
  /** Needle teeth in the jaw, 0 none. */
  teeth: number;
  /** A round mouth at the head's end, 0 none: the leech's sucker, the worm's maw. */
  sucker: number;
  /** Rings round the body, 0 a smooth skin (the eel) to 1 (the leech's, the worm's annuli). */
  rings: number;
  /** Eyes, 0 none: the worms are blind. */
  eyes: number;
  /** What it lies in: the fen's water, earth, ice. */
  ground: 'water' | 'earth' | 'ice';
  /** How wet the skin shines, 0..1. */
  gloss: number;
  /** The underside's colour, mixed into the tint along the throat and belly. */
  belly: string;
  /** How much of the belly shows, 0..1. */
  pale: number;
  /** Broken rock round where it comes up, 0 none: the worm's, which came up through stone. */
  rubble: number;
}
const EEL: Build = {
  girth: 1, rise: 1, coils: 2, fin: 1, jaw: 1, teeth: 1, sucker: 0, rings: 0, eyes: 1,
  ground: 'water', gloss: 0.7, belly: '#c8b870', pale: 0.7, rubble: 0,
};

const LEECH: Build = {
  girth: 1.1, rise: 0.6, coils: 1, fin: 0, jaw: 0, teeth: 0, sucker: 1, rings: 0.8, eyes: 0,
  ground: 'water', gloss: 0.95, belly: '#7a6a44', pale: 0.25, rubble: 0,
};

const WORM: Build = {
  girth: 1.9, rise: 0.9, coils: 1, fin: 0, jaw: 0, teeth: 1, sucker: 1.2, rings: 1, eyes: 0,
  ground: 'earth', gloss: 0.15, belly: '#9a8e78', pale: 0.3, rubble: 1,
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  longBody(ctx, x, y, h, p, kind === 'leech' ? LEECH : kind === 'rock_worm' ? WORM : EEL);
};

/** A frame: x and y map hundredths of the height (x right, y up from the ground) to the canvas. */
interface F { u: number; X: (v: number) => number; Y: (v: number) => number; h: number }
function frame(x: number, y: number, h: number): F {
  const u = h / 100;
  return { u, h, X: (v) => x + v * u, Y: (v) => y - v * u };
}
function at(f: F, pts: readonly number[]): number[] {
  const o: number[] = [];
  for (let i = 0; i < pts.length; i += 2) o.push(f.X(pts[i]), f.Y(pts[i + 1]));
  return o;
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

/** The surface's colours: the fen's black water, lit along its rings. */
function surface(b: Build, tone: number): { deep: string; face: string; ring: string } {
  if (b.ground === 'earth') return { deep: shade('#2a2018', tone), face: shade('#5a4632', tone), ring: shade('#7a6448', tone) };
  if (b.ground === 'ice') return { deep: shade('#4a6a80', tone), face: shade('#a8c4d4', tone), ring: shade('#e8f4fa', tone) };
  return { deep: shade('#10160e', tone), face: shade('#2a3624', tone), ring: shade('#8a9a78', tone) };
}

function longBody(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  // One hump sits left of the rise, so the frame steps right to keep the whole of it centred.
  const f = frame(x + (b.coils < 2 ? 14 : 0) * h / 100, y, h), u = f.u, s = p.breathe, t = p.frame;
  const skin = p.base, under = shade(mix(p.base, b.belly, b.pale), Math.max(0.5, p.tone));
  const finHex = shade(mix(p.dark, '#2a1c10', 0.3), 0.9);
  const water = surface(b, p.tone);
  const g = 7 * b.girth;                          // the body's radius where it leaves the surface
  groundShadow(ctx, x, y + 1, h * 1.1);

  // --- the pool ---------------------------------------------------------------------------------
  // The surface it lies in, inked as part of it: the coils and the neck rise out of one piece of
  // water and the silhouette is that piece. Flat across, seen from a little above.
  // One hump and the rise want less water than two: the pool closes in round them, to the left.
  // Come up through rock, it is a hole a little wider and deeper than the body, rubble round it.
  const PX = b.coils < 2 ? -14 : 0, PY = 8, RX = (b.coils < 2 ? 42 : 58) * (b.rubble ? 1.12 : 1), RY = 8 * (b.rubble ? 1.25 : 1);
  const pool = (): void => {
    blob(ctx, B, water.face, [{ k: 'curve', pts: ring(f.X(PX), f.Y(PY), RX * u, RY * u, 18), wobble: 0.025, seed: 11, sub: 3 }], { h, form: false, spread: 0.9 });
    if (B.override) return;
    const pg = ctx.createRadialGradient(f.X(PX + 4), f.Y(PY + 1), 0, f.X(PX + 4), f.Y(PY + 1), RX * u);
    pg.addColorStop(0, rgba(water.deep, 0.8)); pg.addColorStop(0.7, rgba(water.deep, 0.4)); pg.addColorStop(1, rgba(water.deep, 0));
    ctx.save(); ctx.beginPath(); ctx.ellipse(f.X(PX), f.Y(PY), RX * u, RY * u, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = pg; ctx.fillRect(f.X(PX - RX), f.Y(PY + RY), RX * 2 * u, RY * 2 * u);
    // The sky on the water, a pale streak along the far side; a hole in rock has none.
    if (!b.rubble) { ctx.fillStyle = rgba(water.ring, 0.18); ctx.beginPath(); ctx.ellipse(f.X(PX - 8), f.Y(PY + RY * 0.55), RX * 0.6 * u, RY * 0.22 * u, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  };
  pool();
  // The rubble on the hole's far rim, behind the body.
  if (b.rubble) rubble(ctx, f, PX, PY + RY * 0.55, RX * 0.8, 5, p.tone, 70, false);
  // Below the ground line there is nothing of it: what goes into the hole stays in it.
  if (b.rubble) { ctx.save(); ctx.beginPath(); ctx.rect(x - h * 3, y - h * 3, h * 6, h * 3); ctx.clip(); }

  // --- the coils --------------------------------------------------------------------------------
  // Each hump is a tube arching out of the water and back in, rolling: it rises and sinks a little
  // out of step with the other, so the body reads as one thing moving under the surface. The worm's
  // one hump is longer and lower, for the thickness of it.
  const COILS: [number, number, number, number][] = b.rubble ? [[-44, 20, 25, 0]] : [[-36, 21, 13, 0], [32, 24, 14, 2.1]];
  const humps: { pts: number[]; r: number }[] = [];
  for (const [cx, top, half, ph] of COILS.slice(0, b.coils)) {
    const roll = Math.sin(t / 19 + ph);
    const tp = top + roll * 1.6, sx = roll * 1.2;
    humps.push({ pts: spine([cx - half, PY - 2, cx - half * 0.6 + sx, tp * 0.88, cx + sx, tp, cx + half * 0.6 + sx, tp * 0.88, cx + half, PY - 2], 4), r: g * (b.rubble ? 0.7 : 0.78) });
  }
  const fins = humps.map((c) => finAlong(f, c.pts, c.r, 4.5 * b.fin, 0.15, 0.85, t));
  if (b.fin > 0) for (const [i, pts] of fins.entries()) fin(ctx, f, pts, finHex, 30 + i);
  // Grit in the worm's hide: the stone it has come through, worked into its skin.
  const grit = b.rubble ? { tex: 'stipple' as const, amount: 0.45 } : {};
  for (const [i, c] of humps.entries()) {
    // The far hump a step darker, so the two stand apart in depth.
    blob(ctx, B, i ? skin : shade(skin, 0.85), [{ k: 'tube', pts: at(f, c.pts), r0: c.r * u, r1: c.r * u, wobble: 0.02, seed: 40 + i }], { h, formK: 0.4, spread: 0.85, seed: 43 + i, ...grit });
    rings(ctx, f, c.pts, c.r, c.r, b.rings, skin, 0);
    wet(ctx, f, c.pts, c.r, b.gloss);
  }

  // --- the rise ---------------------------------------------------------------------------------
  // The neck comes up out of the water in an S and turns the head to the company. It sways.
  const sw = s * 3, R = b.rise;
  const neck = spine([-4, PY - 3, -9 + sw * 0.3, 22 * R, -2 + sw * 0.7, 44 * R, 8 + sw, 60 * R, 10 + sw, 70 * R], 6);
  if (b.fin > 0) fin(ctx, f, finAlong(f, neck, g * 0.9, 4.5 * b.fin, 0.08, 0.7, t), finHex, 37);
  blob(ctx, B, skin, [{ k: 'tube', pts: at(f, neck), r0: g * u, r1: g * 0.88 * u, wobble: 0.02, seed: 45 }], { h, formK: 0.45, spread: 0.85, seed: 46, ...grit });
  rings(ctx, f, neck, g, g * 0.88, b.rings, skin, t / 30);
  wet(ctx, f, neck, g * 0.94, b.gloss);
  // The pale throat and belly, down the near side of the neck: a marking, not a part.
  patch(ctx, B, under, [{ k: 'tube', pts: at(f, neck.slice(0, -4).map((v, i) => v + (i % 2 ? 0 : g * 0.42))), r0: g * 0.55 * u, r1: g * 0.5 * u }], { alpha: 0.75, feather: 0.6 });

  // --- the head ---------------------------------------------------------------------------------
  const hx = 10 + sw, hy = 75 * R;
  head(ctx, f, hx, hy, g * 1.15, b, p, skin, under);

  // --- where it goes in -------------------------------------------------------------------------
  // Through rock: the broken stone of the hole's near rim, heaped over the body's feet.
  if (b.rubble) {
    ctx.restore();
    rubble(ctx, f, PX, PY - RY * 0.45, RX * 0.98, 9, p.tone, 80, true);
    return;
  }
  // The near half of the water again, over the body's feet, so the coils and the neck go into it
  // rather than stand on it; then rings spreading from each place the body breaks the surface.
  ctx.save(); ctx.beginPath(); ctx.rect(f.X(PX - RX - 4), f.Y(PY), (RX + 4) * 2 * u, (PY + 4) * u); ctx.clip();
  pool();
  ctx.restore();
  if (!B.override) {
    const feet: number[] = [neck[0], PY];
    for (const c of humps) feet.push(c.pts[0], PY, c.pts[c.pts.length - 2], PY);
    for (let i = 0; i < feet.length; i += 2) {
      const k = ((t / 40 + i * 0.37) % 1);
      ctx.strokeStyle = rgba(water.ring, 0.4 * (1 - k)); ctx.lineWidth = Math.max(1, u * 0.7);
      ctx.beginPath(); ctx.ellipse(f.X(feet[i]), f.Y(feet[i + 1]), (g + k * 8) * u, (1 + k * 1.4) * u, 0, 0, Math.PI); ctx.stroke();
      ctx.strokeStyle = rgba(water.ring, 0.65); ctx.lineWidth = Math.max(1, u * 0.8);
      ctx.beginPath(); ctx.ellipse(f.X(feet[i]), f.Y(feet[i + 1]), g * 0.95 * u, 0.9 * u, 0, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
    }
  }
}

/**
 * A fin along a spine given in frame units: a ragged ridge standing `tall` off the body's crest
 * (the side away from the ground) from `from` to `to` of its length, its edge rippling with `t`.
 */
function finAlong(f: F, pts: readonly number[], r: number, tall: number, from: number, to: number, t: number): number[] {
  const n = pts.length / 2, a = Math.floor(from * (n - 1)), z = Math.ceil(to * (n - 1));
  const base: number[] = [], edge: number[] = [];
  for (let i = a; i <= z; i++) {
    const j0 = Math.max(0, i - 1), j1 = Math.min(n - 1, i + 1);
    const dx = pts[j1 * 2] - pts[j0 * 2], dy = pts[j1 * 2 + 1] - pts[j0 * 2 + 1], L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L, ny = dx / L;
    if (ny < 0 || (Math.abs(ny) < 0.2 && nx > 0)) { nx = -nx; ny = -ny; }       // the crest, up and back
    const k = (i - a) / Math.max(1, z - a), swell = Math.sin(k * Math.PI);
    const ripple = 1 + 0.18 * Math.sin(i * 1.9 + t / 9) - (i % 2 ? 0.22 : 0);
    base.push(pts[i * 2] + nx * r * 0.6, pts[i * 2 + 1] + ny * r * 0.6);
    edge.unshift(pts[i * 2] + nx * (r + tall * swell * ripple), pts[i * 2 + 1] + ny * (r + tall * swell * ripple));
  }
  return at(f, [...base, ...edge]);
}

/**
 * Wet skin: the light caught in a line along the lit side of a body's spine (frame units), from
 * where it leaves the surface to near its end, rather than a spot that would make a shell of it.
 */
function wet(ctx: CanvasRenderingContext2D, f: F, pts: readonly number[], r: number, gloss: number): void {
  if (B.override || gloss <= 0) return;
  const o: number[] = [], n = pts.length / 2;
  for (let i = 1; i < n - 1; i++) {
    const dx = pts[i * 2 + 2] - pts[i * 2 - 2], dy = pts[i * 2 + 3] - pts[i * 2 - 1], L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L, ny = dx / L;
    // The light is up and to the left: B.light in canvas terms, frame y is flipped.
    if (nx * B.light.x - ny * B.light.y < 0) { nx = -nx; ny = -ny; }
    o.push(pts[i * 2] + nx * r * 0.55, pts[i * 2 + 1] + ny * r * 0.55);
  }
  const q = at(f, o);
  ctx.strokeStyle = rgba('#ffffff', 0.32 * gloss); ctx.lineWidth = Math.max(1, r * f.u * 0.32); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(q[0], q[1]); for (let i = 2; i < q.length; i += 2) ctx.lineTo(q[i], q[i + 1]); ctx.stroke();
}

/** A fin from finAlong's outline: a membrane with its rays, from the base out to each point of the edge. */
function fin(ctx: CanvasRenderingContext2D, f: F, pts: readonly number[], hex: string, seed: number): void {
  blob(ctx, B, hex, [{ k: 'curve', pts: [...pts], wobble: 0.03, seed, sub: 1 }], { h: f.h, form: false, spread: 0.8 });
  if (B.override) return;
  const n = pts.length / 4;
  for (let i = 1; i < n - 1; i += 2) {
    const bx = pts[i * 2], by = pts[i * 2 + 1], ex = pts[pts.length - 2 - i * 2], ey = pts[pts.length - 1 - i * 2];
    softLine(ctx, B, [bx, by, bx + (ex - bx) * 0.92, by + (ey - by) * 0.92], hex, Math.max(1, f.u * 0.6), 0.55);
  }
}

/**
 * Rings round a body along its spine (frame units), its radius r0 to r1: the annuli of the leech
 * and the worm, each a shallow arc across the tube bowed toward the far end, a dark crease with the
 * light caught on the ridge beside it. `k` 0 draws none; `creep` slides them along as it moves.
 */
function rings(ctx: CanvasRenderingContext2D, f: F, pts: readonly number[], r0: number, r1: number, k: number, hex: string, creep: number): void {
  if (B.override || k <= 0) return;
  const n = pts.length / 2, len: number[] = [0];
  for (let i = 1; i < n; i++) len.push(len[i - 1] + Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1]));
  const total = len[n - 1], step = 3.4 / k, crease = rgba(shade(hex, 0.4), Math.min(0.85, 0.8 * k)), ridge = rgba(shade(hex, 2.4), Math.min(0.4, 0.38 * k));
  ctx.lineCap = 'round';
  for (let d = step * (0.6 + (creep % 1)); d < total - step * 0.5; d += step) {
    const i = Math.max(1, len.findIndex((l) => l >= d)), a = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]);
    const cx = pts[i * 2 - 2] + (pts[i * 2] - pts[i * 2 - 2]) * a, cy = pts[i * 2 - 1] + (pts[i * 2 + 1] - pts[i * 2 - 1]) * a;
    const L = len[i] - len[i - 1] || 1, tx = (pts[i * 2] - pts[i * 2 - 2]) / L, ty = (pts[i * 2 + 1] - pts[i * 2 - 1]) / L;
    const r = (r0 + (r1 - r0) * (d / total)) * 0.92, bow = r * 0.3;
    for (const [hexA, off, w] of [[crease, 0, 0.55], [ridge, 0.7, 0.4]] as const) {
      const q = at(f, [cx - ty * r + tx * off, cy + tx * r + ty * off, cx + tx * (bow + off), cy + ty * (bow + off), cx + ty * r + tx * off, cy - tx * r + ty * off]);
      ctx.strokeStyle = hexA; ctx.lineWidth = Math.max(0.6, f.u * w);
      ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[2], q[3], q[4], q[5]); ctx.stroke();
    }
  }
}

/** Stable 0..1 noise for the rubble's stones; never from the frame, or the stones would shuffle. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

/**
 * Broken rock in a row along a hole's rim, at frame height `cy` from `cx - span` to `cx + span`: `n`
 * stones, each a rough block of a few faces, overlapping so the row is one mass. The near row is
 * heavier and its middle comes down to the ground, so what goes into the hole goes in behind it.
 */
function rubble(ctx: CanvasRenderingContext2D, f: F, cx: number, cy: number, span: number, n: number, tone: number, seed: number, near: boolean): void {
  // Blocks, not spikes: a stone sits on a broad foot with a flat top tipped one way or the other,
  // every corner a little off. The near row stands in two ranks, the rear one higher and smaller and
  // a mass of its own behind the front one, so the stones read one by one.
  const ranks: Part[][] = [[], []];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), q = (k: number): number => nz(seed + k, i), rear = near && i % 2 === 1;
    const lx = cx - span + span * 2 * t + (q(0) - 0.5) * 3;
    const w = (near ? (rear ? 5.5 : 6.5) : 4.2) * (0.7 + q(1) * 0.7), ht = (near ? 8 : 5) * (0.65 + q(2) * 0.6);
    const base = near ? Math.max(0, cy - 4 + Math.abs(t - 0.5) * 7) + (rear ? 3 : 0) : cy - ht * 0.35;
    const j = (k: number): number => 1 + (q(3 + k) - 0.5) * 0.28, tip = (q(14) - 0.5) * 0.5;
    ranks[rear ? 0 : 1].push({ k: 'poly', pts: at(f, [
      lx - w * j(0), base, lx - w * 1.08 * j(1), base + ht * 0.55 * j(2), lx - w * 0.72 * j(3), base + ht * (0.94 - tip) * j(4),
      lx + w * 0.42 * j(5), base + ht * (1 + tip) * j(6), lx + w * 1.02 * j(7), base + ht * 0.58 * j(8), lx + w * 0.94 * j(9), base,
    ]) });
  }
  const rock = shade(near ? '#7c7468' : '#655d54', tone);
  if (ranks[0].length) blob(ctx, B, shade(rock, 0.86), ranks[0], { h: f.h, formK: 0.6, spread: 0.7 });
  blob(ctx, B, rock, ranks[1], { h: f.h, formK: 0.6, spread: 0.7 });
}

/** A ring of n points round (cx, cy). */
function ring(cx: number, cy: number, rx: number, ry: number, n: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/**
 * The head, at (hx, hy) in frame units, turned three-quarters to the company and down at it: a
 * blunt wedge as wide as the neck, the eyes small and high, and the mouth the kind's.
 */
function head(ctx: CanvasRenderingContext2D, f: F, hx: number, hy: number, g: number, b: Build, p: Paint, skin: string, under: string): void {
  if (b.jaw <= 0 && b.sucker > 0) { sucker(ctx, f, hx, hy, g, b, p, skin); return; }
  const u = f.u, gape = 0.5 + 0.5 * Math.sin(p.frame / 17);
  const W = g * 1.25, L = g * 2.2 * Math.max(0.6, b.jaw);
  // The jaw first, under the skull, hanging open; the mouth's inside, then the teeth along both.
  const drop = (3.5 + gape * 2.5) * b.jaw;
  const jaw: number[] = [hx - W * 0.85, hy - 1, hx + L * 0.75, hy - drop - 2, hx + L * 0.9, hy - drop - 3.5, hx + L * 0.45, hy - drop - 5, hx - W * 0.6, hy - 5];
  if (b.jaw > 0) {
    blob(ctx, B, mix(skin, under, 0.6), [{ k: 'curve', pts: at(f, jaw), wobble: 0.02, seed: 50, sub: 2 }], { h: f.h, formK: 0.3, spread: 0.8 });
  }
  // The skull: a blunt wedge from the neck to a rounded snout, a little down toward the company.
  const skull: number[] = [hx - W, hy + 1, hx - W * 0.7, hy + W * 0.85, hx + L * 0.3, hy + W * 0.75, hx + L * 0.85, hy + 1.5, hx + L, hy - 0.5, hx + L * 0.7, hy - 1.6, hx - W * 0.2, hy - 1.2];
  blob(ctx, B, skin, [{ k: 'curve', pts: at(f, skull), wobble: 0.02, seed: 52, sub: 2, gloss: b.gloss }], { h: f.h, formK: 0.45, spread: 0.85 });
  if (B.override) return;
  if (b.jaw > 0) {
    // The mouth's inside: dark, wet, between the jaws.
    const mouth = at(f, [hx - W * 0.4, hy - 1.1, hx + L * 0.68, hy - 1.4, hx + L * 0.8, hy - drop - 2.2, hx + L * 0.4, hy - drop - 3.4, hx - W * 0.3, hy - 3]);
    ctx.fillStyle = shade('#2a0c10', Math.max(0.5, p.tone));
    ctx.beginPath(); ctx.moveTo(mouth[0], mouth[1]); for (let i = 2; i < mouth.length; i += 2) ctx.lineTo(mouth[i], mouth[i + 1]); ctx.closePath(); ctx.fill();
    if (b.teeth > 0) {
      const tooth = shade('#ece4c8', Math.max(0.55, p.tone));
      for (let i = 0; i < 6; i++) {
        const k = i / 5;
        // Along the upper jaw, pointing down, and the lower, pointing up and back.
        for (const [x0, y0, x1, y1, dir] of [[hx - W * 0.2, hy - 1.3, hx + L * 0.72, hy - 1.5, -1], [hx - W * 0.1, hy - 3.1, hx + L * 0.74, hy - drop - 2.4, 1]] as const) {
          const tx = x0 + (x1 - x0) * k, ty = y0 + (y1 - y0) * k, len = (1.4 + (i % 2) * 0.7) * b.teeth;
          const pts = at(f, [tx - 0.45, ty, tx + 0.45, ty, tx + 0.2 * dir, ty + dir * len]);
          ctx.fillStyle = tooth; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.lineTo(pts[2], pts[3]); ctx.lineTo(pts[4], pts[5]); ctx.closePath(); ctx.fill();
        }
      }
    }
  }
  // The pale of the throat under the skull, and a gill slit behind the jaw.
  patch(ctx, B, under, [{ k: 'ell', x: f.X(hx - W * 0.15), y: f.Y(hy + 0.4), rx: W * 0.7 * u, ry: 1.6 * u }], { alpha: 0.5, feather: 0.7 });
  softLine(ctx, B, at(f, [hx - W * 0.75, hy + W * 0.55, hx - W * 0.95, hy - 0.6, hx - W * 0.7, hy - 3.5]), skin, Math.max(1, u * 0.9), 0.7);
  if (b.eyes > 0) {
    // Small, high and forward, one each side of the snout's ridge: the far one smaller.
    eye(ctx, f.X(hx + L * 0.28), f.Y(hy + W * 0.5), Math.max(0.8, 1.35 * u * b.eyes), p.amber);
    eye(ctx, f.X(hx + L * 0.52), f.Y(hy + W * 0.42), Math.max(0.8, 1.05 * u * b.eyes), p.amber);
  }
}

/**
 * A round mouth on the end of the body, with no head round it: the end swells a little into a cup
 * tipped to the company, and the cup is the face. Dark and wet inside, its lip lit, it opens and
 * closes; three pale jaws meet in it (the leech's), and with `teeth` a ring of them (the worm's maw).
 */
function sucker(ctx: CanvasRenderingContext2D, f: F, hx: number, hy: number, g: number, b: Build, p: Paint, skin: string): void {
  const u = f.u, open = 0.55 + 0.45 * Math.sin(p.frame / 13), R = g * 0.82 * b.sucker, cy = hy - 3;
  // The cup: the body's end swelling, then the lip, flattened toward the company.
  blob(ctx, B, skin, [
    { k: 'cap', x0: f.X(hx - 0.5), y0: f.Y(cy - 5), x1: f.X(hx), y1: f.Y(cy), r0: g * 0.82 * u, r1: R * 0.95 * u },
    { k: 'ell', x: f.X(hx), y: f.Y(cy), rx: R * u, ry: R * 0.62 * u, gloss: b.gloss * 0.6 },
  ], { h: f.h, formK: 0.4, spread: 0.85 });
  if (B.override) return;
  // The lip's light along its top edge, then the mouth inside it.
  ctx.strokeStyle = rgba('#ffffff', 0.3 * b.gloss); ctx.lineWidth = Math.max(1, u * 0.7); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(f.X(hx), f.Y(cy), R * 0.86 * u, R * 0.5 * u, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  const mr = R * (0.55 + 0.25 * open);
  // A rim of raw flesh round the dark of the throat, so the cup reads as a mouth and not a face.
  ctx.fillStyle = shade('#8a3a38', Math.max(0.5, p.tone));
  ctx.beginPath(); ctx.ellipse(f.X(hx), f.Y(cy - 0.3), mr * u, mr * 0.58 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = shade('#2a0c12', Math.max(0.5, p.tone));
  ctx.beginPath(); ctx.ellipse(f.X(hx), f.Y(cy - 0.3), mr * 0.72 * u, mr * 0.42 * u, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rgba(shade('#7a2a2a', Math.max(0.5, p.tone)), 0.6);
  ctx.beginPath(); ctx.ellipse(f.X(hx), f.Y(cy - 0.3 - mr * 0.18), mr * 0.55 * u, mr * 0.28 * u, 0, 0, Math.PI * 2); ctx.fill();
  const jaw = shade('#e0d4b4', Math.max(0.55, p.tone));
  if (b.rubble && b.teeth > 0) {
    // The worm's maw: no jaws, but ring inside ring of teeth all round it, each turned inward, so
    // whatever goes in only goes one way.
    ctx.fillStyle = shade('#d4c8aa', Math.max(0.55, p.tone));
    for (const [n, rr, len, w] of [[16, 1.0, 0.3, 0.1], [11, 0.66, 0.26, 0.11]] as const) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rr, ex = Math.cos(a), ey = Math.sin(a) * 0.58, tx = -Math.sin(a), ty = Math.cos(a) * 0.58;
        const r0 = mr * rr, r1 = mr * (rr - len), half = mr * w;
        const q = at(f, [hx + ex * r0 + tx * half, cy - 0.3 + ey * r0 + ty * half, hx + ex * r0 - tx * half, cy - 0.3 + ey * r0 - ty * half, hx + ex * r1, cy - 0.3 + ey * r1]);
        ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[2], q[3]); ctx.lineTo(q[4], q[5]); ctx.closePath(); ctx.fill();
      }
    }
    return;
  }
  ctx.strokeStyle = jaw; ctx.lineWidth = Math.max(0.8, u * 0.55);
  for (const a of [Math.PI / 2, Math.PI / 2 + (Math.PI * 2) / 3, Math.PI / 2 + (Math.PI * 4) / 3]) {
    const q = at(f, [hx + Math.cos(a) * mr * 0.25, cy - 0.3 + Math.sin(a) * mr * 0.58 * 0.25, hx + Math.cos(a) * mr * 0.85, cy - 0.3 + Math.sin(a) * mr * 0.58 * 0.85]);
    ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(q[2], q[3]); ctx.stroke();
  }
  if (b.teeth > 0) {
    ctx.fillStyle = jaw;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, ex = Math.cos(a), ey = Math.sin(a) * 0.58, len = 1.2 * b.teeth;
      const q = at(f, [hx + ex * mr, cy - 0.3 + ey * mr, hx + ex * (mr - len), cy - 0.3 + ey * (mr - len)]);
      ctx.beginPath(); ctx.arc(q[2], q[3], Math.max(0.5, u * 0.35), 0, Math.PI * 2); ctx.fill();
    }
  }
}
