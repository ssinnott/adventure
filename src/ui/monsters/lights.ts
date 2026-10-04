// The lights: the Bog Light first, on one frame the Ice Caves' rime light is to cool (MONSTERS §10.2,
// §11). A light hung in the air with nothing under it, in hundredths of the sprite's height up from
// the ground line: the Rift at its thinnest, with no body left and no shard, only light (MONSTERS
// §2.1). It hangs where a lantern is carried, at a walker's hip, and swings and bobs as a lantern
// carried does, and there is nobody carrying it. Drawn as light, never as a thing: no outline and
// no shadow. A pool of its light lies on the ground under it where a shadow would be; a halo stands
// round it; its body is an orb drawn up at the top into a tongue, as a flame is, white at the heart;
// and out of the ground under it motes of light rise into it, the one thing of it apart from the
// rest, declared detached in tools/smoke.ts. The hit flash is the orb and the motes.
//
// The Bog Light: a light over the bog, where nobody is. Pale green, and cold. Idle: it swings and
// bobs on a walker's step, the tongue trailing the swing; it shimmers; now and then it gutters
// nearly out and flares again; and the motes come up out of the peat into it, one and then another.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B } from './common.ts';
import { appendCurve, glow } from './gloss.ts';
import { mix, rgba } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bog_light'];

/**
 * The frame's parts, as proportions of the bog light's where they are numbers (1 = the bog light,
 * 0 = none), so the rime light is a Build and a colouring.
 */
interface Build {
  /** How high the orb hangs, of the sprite's height: the bog light where a lantern is carried. */
  hang: number;
  /** The orb's size. */
  orb: number;
  /** How tall the tongue off the orb's top stands, of the orb's height, 0 a round orb. */
  tongue: number;
  /** How far it swings, as a carried light swings, and how far it bobs, on a walker's step. */
  swing: number;
  bob: number;
  /** How often it gutters nearly out and flares again, 0 never. */
  gutter: number;
  /** How many motes rise into it out of the ground, and how big. */
  motes: number;
  mote: number;
  /** How wide its light lies on the ground under it, and how bright. */
  pool: number;
  /** Its heart's colour, and the colour its outer flame is taken toward; the halo is the def's tint. */
  heartHex: string;
  deepHex: string;
}
const BOG: Build = { hang: 0.75, orb: 1, tongue: 1, swing: 1, bob: 1, gutter: 1, motes: 2, mote: 1, pool: 1, heartHex: '#fbfff4', deepHex: '#52c46c' };

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  light(ctx, x, y, h, p, BOG);
};

/** A frame: hundredths of the height (x right, y up from the ground) to the canvas. */
interface F { u: number; X: (v: number) => number; Y: (v: number) => number }

/** Stable 0..1 noise; never from the frame, or the motes would jump. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

function light(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const t = p.frame, u = h / 100;
  const f: F = { u, X: (v) => x + v * u, Y: (v) => y - v * u };
  // The light is its own colour at any distance: the tint brightened, never darkened by the tone.
  const tint = mix(p.light, '#ffffff', 0.2), edge = p.light, heart = b.heartHex;
  // A walker's step: the swing from side to side, the bob twice to a stride, and the shimmer.
  const swing = Math.sin(t / 17) * 2.4 * b.swing;
  const bob = Math.abs(Math.sin(t / 17)) * 1.8 * b.bob;
  const shimmer = 1 + 0.05 * Math.sin(t * 1.7) + 0.035 * Math.sin(t * 2.9 + 1);
  // Now and then it gutters to a third and flares again: in for a few frames, out over a few more.
  const gt = b.gutter > 0 ? (t + 60) % 150 : 999, gut = gt < 18 ? Math.sin((gt / 18) * Math.PI) : 0;
  const bright = (1 - 0.68 * gut) * shimmer;
  const cx = swing, cy = 100 * b.hang - 9 + bob;
  const rx = 11.5 * b.orb * (1 - 0.3 * gut) * shimmer, ry = 12.5 * b.orb * (1 - 0.3 * gut) * shimmer;

  // --- its light on the ground, where a shadow would be --------------------------------------------
  if (!B.override) {
    ctx.save(); ctx.translate(f.X(cx * 0.6), y - 0.5 * u); ctx.scale(1, 0.24);
    glow(ctx, B, 0, 0, 34 * b.pool * u, edge, 0.32 * bright, tint);
    ctx.restore();
  }

  // --- the halo, wide and faint, and close and bright ----------------------------------------------
  glow(ctx, B, f.X(cx), f.Y(cy + 2), 46 * u, edge, 0.3 * bright, tint);
  glow(ctx, B, f.X(cx), f.Y(cy + 2), 24 * u, tint, 0.6 * bright, heart);

  // --- the motes, rising out of the ground into it, and none while it gutters ----------------------
  if (gut < 0.3) motes(ctx, f, b, t, cx, cy, ry, edge, heart);

  // --- the flame: an orb drawn up into a tongue, a lesser tongue either side, and a white flame in it -
  // The tongues flicker taller and shorter, each on its own beat, and the tips trail the swing.
  const lean = -swing * 1.2 + Math.sin(t / 4.3) * 1.2;
  const fl = (k: number, ph: number): number => ry * k * (1 + 0.28 * Math.sin(t / 2.3 + ph) + 0.14 * Math.sin(t / 1.3 + ph * 2)) * b.tongue;
  const outer = flame(cx, cy, rx, ry, fl(1.05, 0), fl(0.42, 2), fl(0.36, 4.1), lean);
  ctx.beginPath(); appendCurve(ctx, outer.map((v, i) => (i % 2 ? f.Y(v) : f.X(v))));
  if (B.override) { ctx.fillStyle = B.override; ctx.fill(); return; }
  ctx.fillStyle = mix(edge, b.deepHex, 0.38 + 0.25 * gut); ctx.fill();
  // The white flame inside, low in the orb, its tongue shorter.
  const ix = cx + lean * 0.15, iy = cy - ry * 0.18;
  const inner = flame(ix, iy, rx * 0.56, ry * 0.56, fl(0.62, 1), fl(0.2, 3), fl(0.16, 5), lean * 0.6);
  ctx.beginPath(); appendCurve(ctx, inner.map((v, i) => (i % 2 ? f.Y(v) : f.X(v))));
  ctx.fillStyle = mix(heart, tint, 0.15 + 0.5 * gut); ctx.fill();
  glow(ctx, B, f.X(ix), f.Y(iy), rx * 0.9 * u, heart, 0.7 * bright, '#ffffff');
}

/**
 * A flame's contour in hundredths, round the orb's foot and up its flanks to the lesser tongue on the
 * left, the main tongue and the lesser on the right, as points for a smooth closed curve. `tip`,
 * `left` and `right` are how far each tongue stands over the orb's top; `lean` moves the tips over.
 */
function flame(cx: number, cy: number, rx: number, ry: number, tip: number, left: number, right: number, lean: number): number[] {
  const out: number[] = [];
  for (let i = 0; i <= 4; i++) { const a = -(i / 4) * Math.PI; out.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  out.push(
    cx - rx * 0.86, cy + ry * 0.58,
    cx - rx * 0.66 + lean * 0.4, cy + ry * 0.92 + left * 0.4,
    cx - rx * 0.62 + lean * 0.55, cy + ry + left,
    cx - rx * 0.3 + lean * 0.6, cy + ry * 1.04,
    cx - rx * 0.12 + lean * 0.85, cy + ry + tip * 0.6,
    cx + lean, cy + ry + tip,
    cx + rx * 0.16 + lean * 0.85, cy + ry + tip * 0.55,
    cx + rx * 0.34 + lean * 0.6, cy + ry * 1.0,
    cx + rx * 0.6 + lean * 0.55, cy + ry + right,
    cx + rx * 0.7 + lean * 0.4, cy + ry * 0.9 + right * 0.4,
    cx + rx * 0.88, cy + ry * 0.56,
  );
  return out;
}

/**
 * The motes: points of light coming up out of the ground under it, each on its own long beat,
 * drifting a little as they rise, until they reach the orb and are lost in it. Each is a square of
 * light big enough to count as a piece of the drawing apart from the orb on its way up: those are
 * the pieces the silhouette check is told of (tools/smoke.ts).
 */
function motes(ctx: CanvasRenderingContext2D, f: F, b: Build, t: number, cx: number, cy: number, ry: number, edge: string, heart: string): void {
  for (let i = 0; i < b.motes; i++) {
    const cyc = 96 + nz(i, 1) * 40, ph = ((t + nz(i, 2) * cyc) % cyc) / cyc;
    // Half the beat it rises, from the ground to the orb's foot; the other half there is none.
    if (ph > 0.5) continue;
    const k = ph / 0.5, top = cy - ry * 0.6;
    const mx = cx + (nz(i, 3) - 0.5) * 18 * (1 - k) + Math.sin(t / 6 + i * 2) * 1.2, my = 2 + (top - 2) * k;
    // A mote is a fleck of light a little taller than it is wide, as a flame's is.
    const px = Math.round(f.X(mx)), py = Math.round(f.Y(my)), w = Math.max(2, Math.round(2.6 * f.u * b.mote)), t2 = Math.max(3, Math.round(3.6 * f.u * b.mote));
    if (B.override) { ctx.fillStyle = B.override; ctx.fillRect(px - 1, py - 1, w, t2); continue; }
    glow(ctx, B, px, py, Math.max(3, 6 * f.u), edge, 0.35 * Math.sin(k * Math.PI), heart);
    ctx.fillStyle = rgba(mix(heart, edge, 0.3), 1);
    ctx.fillRect(px - 1, py - 1, w, t2);
  }
}
