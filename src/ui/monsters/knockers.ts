// The knockers: the Knocker first, on one frame the Mender and the Foreman carry their trades, as
// Rimewater's tallyman, Meridian Camp's deep knocker and inspector and the Dead-Drop's tally clerk
// are to carry theirs (MONSTERS §11). A machine side on to the company with its head to the right,
// in hundredths of the sprite's height up from the ground line: a body of smooth plates laid one
// over the next along a spine, rounded over the back and flat under the belly, every plate the
// same width and every seam ruled; legs under it in pairs, thin rods on ball joints, all alike,
// stepping in a wave from the tail to the head; at the head a cowl with one lamp in its face; and
// on one plate, cut straight and even, the chisel's mark. The spine is a heading turned along its
// length, so a body lies low and arched, or rears its front half up and bows its cowl. Drawn as
// masses: the far legs a step darker, the near legs, the shell in one blob over their roots, the
// seams and the mark cut into it, the cowl as a plate of its own and its lamp, then whatever its
// trade has it carry.
//
// The Knocker: something small and grey, knocking on the rock as it comes. Two feelers off the
// cowl end in knobs, and it raps the ground ahead with them in turn. Idle: the wave runs down the
// legs, the knobs knock, the lamp burns steady and now and then dims for a moment, as a blink.
//
// The Tallyman: it stops and clicks, once for each of you. A knocker grown bigger and slate-blue,
// its front lifted off the ground so the cowl faces the company square, and every plate of it but
// the one with the mark cut over with tallies, fours and a stroke across, rows of them. Along the
// cowl behind the lamp, a row of six small lights. It has come up through the ice: frost along its
// back and icicles off the lip of its shell. Idle: it stands, and a light comes on with each click,
// six, the lamp dipping at each; then they all go out together and the count begins again.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { blob, glow, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['knocker', 'mender', 'foreman', 'tallyman'];

/**
 * The frame's parts, as proportions of the knocker's where they are numbers (1 = the knocker, 0 =
 * none), each named for the knocker that pushes it furthest, so a kind to come is a Build and a
 * colouring.
 */
interface Build {
  /** The body's length along its spine, tail to cowl. */
  length: number;
  /** How high the back rounds over the spine: the mender's is domed. */
  dome: number;
  /** How much the body thins from its middle to the cowl: the Foreman's neck. */
  taper: number;
  /** How far the body's front rears up off the ground and bows its cowl, 0 flat to 1: the Foreman's. */
  rear: number;
  /** The plates across the back. */
  plates: number;
  /** The pairs of legs under the part of the body on the ground. */
  legs: number;
  /** How long the legs are, and how thick: how high the belly stands. */
  stance: number;
  /** How high the legs lift as they walk in place, 0 standing still: the Foreman only shifts its weight. */
  step: number;
  /** The cowl's size, and the lamp in its face. */
  cowl: number;
  /** The knocking feelers' reach, 0 none: the knocker's knobs. */
  feelers: number;
  /** The spool of wire carried on the back, 0 none: the mender's. */
  spool: number;
  /** The mending arm and its needle, 0 none: the mender's. */
  needle: number;
  /** The slate held up, the list on it, and the stylus that goes down it, 0 none: the Foreman's. */
  slate: number;
  /** The row of lights along the cowl that come on one a click, 0 none: the tallyman's count. */
  count: number;
  /** The tallies cut over every plate but the mark's, 0 none: the tallyman's. */
  tally: number;
  /** Frost along the back and icicles off the shell's lip, 0 none: the tallyman's, up through the ice. */
  rime: number;
  /** How large the mark is cut, and where along the body (0 the tail, 1 the cowl). */
  mark: number;
  markAt: number;
  /** The lamp's light, and its glow. */
  lampHex: string;
  glowHex: string;
  /** The light at the needle's point. */
  arcHex: string;
}
const KNOCKER: Build = {
  length: 1, dome: 1, taper: 0, rear: 0, plates: 6, legs: 6, stance: 1, step: 1, cowl: 1, feelers: 1, spool: 0, needle: 0, slate: 0, count: 0, tally: 0, rime: 0, mark: 1, markAt: 0.42,
  lampHex: '#fff3c4', glowHex: '#ffc860', arcHex: '#d8f0ff',
};
/**
 * The Mender: it stops to mend the others, and they let it. Domed higher, a spool of wire on its
 * back, and an arm off its shoulders that brings a needle down in front of the cowl, a cold light
 * at the point where it works. Its feelers are short: it does not knock. Idle: the needle goes in
 * and out, and the light at its point flares each time.
 */
const MENDER: Build = {
  length: 0.9, dome: 1.22, taper: 0, rear: 0, plates: 5, legs: 5, stance: 1.05, step: 1, cowl: 1, feelers: 0.5, spool: 1, needle: 1, slate: 0, count: 0, tally: 0, rime: 0, mark: 1, markAt: 0.6,
  lampHex: '#fff3c4', glowHex: '#ffc860', arcHex: '#d8f0ff',
};
/**
 * The Foreman: it checks you the way a clerk checks a list, and finds nobody on it. A knocker grown
 * long and dark, its tail on the ground on many legs and its front reared up and bowed over, the
 * cowl at the top turned down to a slate held up in front of it, the list cut on it in rows. A
 * stylus goes down the rows, row by row, and stops at none. Idle: the cowl lifts from the slate to
 * the company and bows to the slate again.
 */
const FOREMAN: Build = {
  length: 1.25, dome: 0.86, taper: 0.38, rear: 1, plates: 10, legs: 6, stance: 1.2, step: 0.35, cowl: 1.1, feelers: 0, spool: 0, needle: 0, slate: 1, count: 0, tally: 0, rime: 0, mark: 1.35, markAt: 0.25,
  lampHex: '#fff3c4', glowHex: '#ffc860', arcHex: '#d8f0ff',
};
const TALLYMAN: Build = {
  length: 1.08, dome: 1.06, taper: 0.12, rear: 0.46, plates: 7, legs: 6, stance: 1.12, step: 0.3, cowl: 1.14, feelers: 0, spool: 0, needle: 0, slate: 0, count: 1, tally: 1, rime: 1, mark: 1.1, markAt: 0.3,
  lampHex: '#fff3c4', glowHex: '#ffc860', arcHex: '#d8f0ff',
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  knocker(ctx, x, y, h, p, kind === 'mender' ? MENDER : kind === 'foreman' ? FOREMAN : kind === 'tallyman' ? TALLYMAN : KNOCKER);
};

interface Pt { x: number; y: number }
/** A frame: hundredths of the height (x right, y up from the ground) to the canvas. */
interface F { u: number; X: (v: number) => number; Y: (v: number) => number }
const flat = (f: F, pts: readonly Pt[]): number[] => pts.flatMap((p) => [f.X(p.x), f.Y(p.y)]);
const add = (a: Pt, b: Pt, k = 1): Pt => ({ x: a.x + b.x * k, y: a.y + b.y * k });

/** Straight between the points of a table of [s, value], s rising from 0 to 1. */
function lerpTable(t: readonly (readonly [number, number])[], s: number): number {
  if (s <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) if (s <= t[i][0]) { const [s0, v0] = t[i - 1], [s1, v1] = t[i]; return v0 + ((v1 - v0) * (s - s0)) / (s1 - s0); }
  return t[t.length - 1][1];
}
const smooth = (a: number, b: number, s: number): number => { const k = Math.max(0, Math.min(1, (s - a) / (b - a))); return k * k * (3 - 2 * k); };

/** The back's height over the spine, and the belly's under it, along the body (the knocker's, at dome 1). */
const BACK: readonly (readonly [number, number])[] = [[0, 0.32], [0.12, 0.7], [0.3, 0.96], [0.5, 1], [0.7, 0.9], [0.86, 0.74], [1, 0.62]];
const BELLY: readonly (readonly [number, number])[] = [[0, 0.55], [0.2, 0.95], [0.6, 1], [0.85, 0.92], [1, 0.82]];
/** Where the cowl's plate begins along the body. */
const COWL = 0.86;
/** The mender's wire, and the Foreman's slate: darkened with distance, as the tint is. */
const COPPER = '#c08a4e', SLATE = '#2a2e34';

/** The body laid out: where the spine runs and which way, and its two edges at any point along it. */
interface Body {
  at: (s: number) => Pt; dir: (s: number) => Pt; up: (s: number) => Pt;
  back: (s: number) => Pt; belly: (s: number) => Pt; r: (s: number) => number; rb: (s: number) => number;
  /** How far along the body still lies on its legs. */
  ground: number;
}

/**
 * The spine: a heading turned along the body from the tail and integrated, so a flat body arches a
 * little from tail to cowl, and a rearing one runs along the ground, turns up and bows over at the
 * top, `bow` deeper or shallower as the cowl looks down or out.
 */
function layout(b: Build, bow: number): Body {
  const L = 84 * b.length, N = 60, dome = 26 * b.dome, belly = 10, bend = 1 - 0.62 * b.rear;
  const heading = (s: number): number => b.rear > 0
    ? 0.04 - 0.08 * s + b.rear * (1.6 * smooth(bend - 0.08, bend + 0.3, s) - (1.5 + 0.7 * bow) * smooth(0.84, 1, s))
    : 0.2 - 0.42 * s;
  const pts: Pt[] = [{ x: 0, y: 0 }];
  for (let i = 1; i <= N; i++) {
    const a = heading((i - 0.5) / N), p = pts[i - 1];
    pts.push({ x: p.x + (Math.cos(a) * L) / N, y: p.y + (Math.sin(a) * L) / N });
  }
  // Centred across, and the belly standing on its legs.
  const lift = 15 * b.stance + belly;
  const xs = pts.map((p) => p.x), mid = (Math.min(...xs) + Math.max(...xs)) / 2 + (b.rear > 0 ? 6 : 2);
  for (const p of pts) { p.x -= mid; p.y += lift; }
  const P = (s: number): Pt => {
    const k = Math.max(0, Math.min(1, s)) * N, i = Math.min(N - 1, Math.floor(k)), f = k - i;
    return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f };
  };
  const D = (s: number): Pt => { const a = heading(Math.max(0, Math.min(1, s))); return { x: Math.cos(a), y: Math.sin(a) }; };
  const U = (s: number): Pt => { const d = D(s); return { x: -d.y, y: d.x }; };
  const thin = (s: number): number => 1 - b.taper * smooth(0.3, 0.8, s);
  const r = (s: number): number => dome * lerpTable(BACK, s) * thin(s), rb = (s: number): number => belly * lerpTable(BELLY, s) * thin(s);
  return {
    at: P, dir: D, up: U, r, rb,
    back: (s) => add(P(s), U(s), r(s)),
    belly: (s) => add(P(s), U(s), -rb(s)),
    ground: b.rear > 0 ? bend - 0.02 : 0.92,
  };
}

/** The cowl's front: half an ellipse from the back's edge round to the belly's at the body's end. */
function cowlCap(body: Body, k: number): Pt[] {
  const c = cowlCentre(body), d = body.dir(1), n = body.up(1), an = (body.r(1) + body.rb(1)) / 2, ad = an * 0.72 * k, out: Pt[] = [];
  for (let i = 1; i < 12; i++) { const a = (i / 12) * Math.PI; out.push(add(add(c, n, Math.cos(a) * an), d, Math.sin(a) * ad)); }
  return out;
}
const cowlCentre = (body: Body): Pt => { const q = body.back(1), w = body.belly(1); return { x: (q.x + w.x) / 2, y: (q.y + w.y) / 2 }; };

/**
 * The shell from `from` to `to` along the body, in screen points, as slices across it from back to
 * belly, the tail's point and the cowl's front with them where it reaches them. Slices union without
 * a hole where a rearing body bends tighter than its back is high, which one outline round both
 * edges does not: there the back's edge folds over itself, and the fold is a hole.
 */
function slices(f: F, body: Body, from: number, to: number, k: number): Part[] {
  const out: Part[] = [], n = Math.max(4, Math.round(40 * (to - from)));
  for (let i = 0; i < n; i++) {
    const s0 = from + ((to - from) * i) / n, s1 = from + ((to - from) * (i + 1)) / n;
    out.push({ k: 'poly', pts: flat(f, [body.back(s0), body.back(s1), body.belly(s1), body.belly(s0)]) });
  }
  if (to >= 1) out.push({ k: 'poly', pts: flat(f, [body.back(1), ...cowlCap(body, k), body.belly(1)]) });
  if (from <= 0) out.push({ k: 'poly', pts: flat(f, [body.back(0), body.belly(0), add(body.at(0), body.dir(0), -4)]) });
  return out;
}

/** Stable 0..1 noise; never from the frame, or the marks would crawl. */
function nz(a: number, b: number): number {
  let v = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  v = Math.imul(v ^ (v >>> 13), 1274126177);
  return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
}

function knocker(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const t = p.frame, u = h / 100;
  const f: F = { u, X: (v) => x + v * u, Y: (v) => y - v * u };
  // The tallyman's count: a click every 14 frames, six of them, the lights held a while and then all
  // put out together. `counted` is how many are lit; `click` jumps at each and dies away.
  const ck = t % 126, counted = b.count > 0 ? (ck < 84 ? Math.floor(ck / 14) + 1 : ck < 110 ? 6 : 0) : 0;
  const click = b.count > 0 && ck < 84 && ck % 14 < 5 ? 1 - (ck % 14) / 5 : 0;
  // The Foreman looks from the slate to the company and back: a slow lift and bow of the cowl. The
  // tallyman faces the company, and nods at each click.
  const look = b.slate > 0 ? smooth(0, 1, 0.5 + 0.5 * Math.sin(t / 23)) : b.count > 0 ? 0.85 - 0.3 * click : 0;
  const body = layout(b, 1 - look);
  const shell = p.base, under = shade(mix(p.dark, '#1c1e24', 0.45), 0.92), joint = shade(mix(p.light, '#e8ecf0', 0.25), 1);
  const ink = shade('#14161a', Math.max(0.6, p.tone));
  const lampOn = b.count > 0 ? 1 - 0.5 * click : (t % 160) < 150 ? 1 : 0.35;   // a blink, now and then; the tallyman's dips at each click
  const g0 = body.at(0), g1 = body.at(body.ground);
  groundShadow(ctx, f.X((g0.x + g1.x) / 2 + 3), y + 1, (g1.x - g0.x + 30) * u);
  // Where the lamp sits, in the cowl's face, and the light it throws on the rock ahead of a body on the ground.
  const cc = cowlCentre(body), d1 = body.dir(1), n1 = body.up(1), an = (body.r(1) + body.rb(1)) / 2;
  const lr = 6 * b.cowl, lampC = add(add(cc, d1, an * 0.42 * b.cowl), n1, -an * 0.08);
  if (!B.override && b.rear === 0) {
    const gx = f.X(lampC.x + 16), gy = y - 1.5 * u;
    ctx.save(); ctx.translate(gx, gy); ctx.scale(1, 0.28);
    glow(ctx, B, 0, 0, 22 * u, b.glowHex, 0.3 * lampOn, b.lampHex);
    ctx.restore();
  }

  // --- the legs: in pairs under the body on the ground, the far ones a step darker and behind -------
  const n = b.legs, legs: { near: Part[]; far: Part[]; knees: Pt[] } = { near: [], far: [], knees: [] };
  // A longer leg is a little thicker, not as much thicker as it is longer: the Foreman stands on rods.
  const st = b.stance, w = 0.55 + 0.45 * st, stride = 3.6 * st * b.step;
  for (let i = 0; i < n; i++) {
    const s = 0.05 + ((body.ground - 0.06) * (i + 0.5)) / n, root = body.belly(s), spread = (i - (n - 1) / 2) / Math.max(1, n - 1);
    // The wave: each leg lifts in turn, tail to head, the far one half a beat after the near.
    for (const side of [0, 1] as const) {
      const ph = t / 4 - i * 0.9 - side * Math.PI, up = Math.max(0, Math.sin(ph)) * stride, fwd = Math.cos(ph) * 1.4 * st * b.step;
      const far = side === 1, dy = far ? 4 * st : 0, dx = far ? 3 * st : 0;
      const foot: Pt = { x: root.x + spread * 9 * st + dx + fwd, y: dy + up };
      const knee: Pt = { x: root.x + spread * 4 * st + dx + 2.2 + fwd * 0.5, y: root.y * 0.42 + dy * 0.6 + up * 0.6 };
      const top: Pt = { x: root.x + dx * 0.5, y: root.y + 3 };
      const r0 = (far ? 1.55 : 1.85) * w, r1 = (far ? 1.1 : 1.3) * w;
      const list = far ? legs.far : legs.near;
      list.push({ k: 'cap', x0: f.X(top.x), y0: f.Y(top.y), x1: f.X(knee.x), y1: f.Y(knee.y), r0: r0 * u, r1: r1 * u });
      list.push({ k: 'cap', x0: f.X(knee.x), y0: f.Y(knee.y), x1: f.X(foot.x), y1: f.Y(foot.y), r0: r1 * u, r1: 0.7 * w * u });
      list.push({ k: 'ball', x: f.X(knee.x), y: f.Y(knee.y), r: r0 * 1.15 * u });
      if (!far) legs.knees.push(knee);
    }
  }
  blob(ctx, B, shade(under, 0.8), legs.far, { h, formK: 0.3, spread: 0.7 });
  blob(ctx, B, under, legs.near, { h, formK: 0.4, spread: 0.7 });
  // The ball of each near knee catches the light.
  if (!B.override && h >= 40) for (const k of legs.knees) { ctx.fillStyle = rgba(joint, 0.7); ctx.beginPath(); ctx.arc(f.X(k.x - 0.6 * w), f.Y(k.y + 0.7 * w), Math.max(0.7, 0.8 * w * u), 0, Math.PI * 2); ctx.fill(); }

  // --- the shell: one smooth mass, the plates ruled across it -------------------------------------
  blob(ctx, B, shell, slices(f, body, 0, 1, b.cowl), { h, form: false, spread: 0.72, gloss: 0.45 });
  if (!B.override) {
    // The belly's rolled lip, in shadow, and a lit line along the back where the light runs.
    const lip: Pt[] = [], crest: Pt[] = [];
    for (let i = 0; i <= 24; i++) { const s = 0.02 + (COWL - 0.03) * (i / 24); lip.push(add(body.belly(s), body.up(s), 2.6)); }
    softLine(ctx, B, flat(f, lip), shell, Math.max(1, 3.2 * u), 0.45);
    for (let i = 0; i <= 20; i++) { const s = 0.06 + (COWL - 0.12) * (i / 20); crest.push(add(body.back(s), body.up(s), -2.4)); }
    line(ctx, flat(f, crest), rgba(mix(shell, '#ffffff', 0.55), 0.5), Math.max(1, 1.1 * u));
    // The seams: each plate laid over the one behind it, a dark gap and the next plate's lit lip.
    for (let k = 1; k < b.plates; k++) {
      const s = (k / b.plates) * COWL, q0 = body.back(s), q1 = body.belly(s), d = body.dir(s);
      const mid = add(body.at(s), d, -3.2);
      const seam = [q0, add({ x: (q0.x + mid.x) / 2, y: (q0.y + mid.y) / 2 }, d, -0.8), mid, q1];
      softLine(ctx, B, flat(f, seam), shell, Math.max(1, 1.5 * u), 0.85);
      line(ctx, flat(f, seam.map((q) => add(q, d, 1.6))), rgba(mix(shell, '#ffffff', 0.4), 0.5), Math.max(1, 0.9 * u));
    }
  }
  // --- the chisel's mark, cut into a plate -------------------------------------------------------
  const markPlate = Math.min(b.plates - 1, Math.floor(b.markAt * b.plates));
  {
    const s = ((markPlate + 0.5) / b.plates) * COWL, d = body.dir(s);
    const c = add(body.at(s), body.up(s), (body.r(s) - body.rb(s)) * 0.5 - 0.5);
    chiselMark(ctx, f, c, 5 * b.mark, Math.atan2(d.y, d.x), shell);
  }
  if (b.tally > 0) tallies(ctx, f, body, b, markPlate, shell);
  if (b.rime > 0) rime(ctx, f, body, b, h, p.tone);

  // --- the cowl: a plate of its own over the shell's front, and the lamp in its face ----------------
  const cowl = shade(shell, 1.07);
  blob(ctx, B, cowl, slices(f, body, COWL, 1, b.cowl), { h, form: false, spread: 0.7, gloss: 0.6 });
  // The brow: the cowl's front edge standing out over the lamp, a lip of the same plate.
  blob(ctx, B, cowl, [{ k: 'cap', x0: f.X(lampC.x - d1.x * lr * 0.6 + n1.x * lr * 1.05), y0: f.Y(lampC.y - d1.y * lr * 0.6 + n1.y * lr * 1.05), x1: f.X(lampC.x + d1.x * lr * 0.9 + n1.x * lr * 0.95), y1: f.Y(lampC.y + d1.y * lr * 0.9 + n1.y * lr * 0.95), r0: 1.5 * b.cowl * u, r1: 1.1 * b.cowl * u }], { h, formK: 0.4, spread: 0.7, gloss: 0.5 });
  blob(ctx, B, shade('#2a2c32', Math.max(0.6, p.tone)), [{ k: 'ball', x: f.X(lampC.x), y: f.Y(lampC.y), r: lr * u }], { h, form: false });
  if (!B.override) {
    glow(ctx, B, f.X(lampC.x), f.Y(lampC.y), lr * 2.6 * u, b.glowHex, 0.4 * lampOn, b.lampHex);
    ctx.fillStyle = mix(shade(b.glowHex, 0.5), b.lampHex, lampOn);
    ctx.beginPath(); ctx.arc(f.X(lampC.x), f.Y(lampC.y), lr * 0.7 * u, 0, Math.PI * 2); ctx.fill();
    glow(ctx, B, f.X(lampC.x), f.Y(lampC.y), lr * 0.78 * u, b.lampHex, 0.9 * lampOn, '#ffffff');
    // The brow's shadow across the top of the lens.
    const sc = add(lampC, n1, lr * 0.5);
    ctx.fillStyle = rgba(ink, 0.32); ctx.beginPath(); ctx.ellipse(f.X(sc.x), f.Y(sc.y), lr * 0.72 * u, lr * 0.26 * u, -Math.atan2(d1.y, d1.x), 0, Math.PI * 2); ctx.fill();
    if (b.count > 0) countLights(ctx, f, body, b, counted, click, ink);
  }

  // --- the feelers, and the knobs on them that knock --------------------------------------------------
  // A feeler reaches forward off the cowl's chin to an elbow and hangs a rod from it to a knob; it
  // lifts the knob and drops it on the rock, sharp, and lifts it again, the far one half a beat on.
  if (b.feelers > 0) {
    const knock = (ph: number): number => { const k = ((t + ph) % 24) / 24; return k < 0.12 ? 1 - k / 0.12 : k < 0.42 ? 0 : smooth(0.42, 1, k); };
    const fk = b.feelers, root = add(add(cc, d1, an * 0.34), n1, -an * 0.74);
    for (const side of [1, 0] as const) {
      const far = side === 1, up = knock(far ? 12 : 0) * 7 * fk, o = far ? 2.6 : 0;
      const elbow: Pt = { x: root.x + 11 * fk + o, y: root.y + 1.5 * fk + up * 0.3 + (far ? 1.2 : 0) };
      const knob: Pt = { x: elbow.x + 4.5 * fk - up * 0.25 + o * 0.4, y: (far ? 4.4 : 2.6) * Math.max(0.6, fk) + up };
      const r = (far ? 1.15 : 1.35) * Math.max(0.7, fk);
      blob(ctx, B, far ? shade(under, 0.85) : shade(under, 1.18), [
        { k: 'cap', x0: f.X(root.x), y0: f.Y(root.y), x1: f.X(elbow.x), y1: f.Y(elbow.y), r0: r * 1.25 * u, r1: r * u },
        { k: 'cap', x0: f.X(elbow.x), y0: f.Y(elbow.y), x1: f.X(knob.x), y1: f.Y(knob.y), r0: r * u, r1: r * 0.85 * u },
        { k: 'ball', x: f.X(elbow.x), y: f.Y(elbow.y), r: r * 1.3 * u },
        { k: 'ell', x: f.X(knob.x), y: f.Y(knob.y), rx: (far ? 2.3 : 2.8) * Math.max(0.7, fk) * u, ry: (far ? 2 : 2.4) * Math.max(0.7, fk) * u },
      ], { h, formK: 0.4, spread: 0.7, gloss: far ? 0 : 0.45 });
    }
  }

  // --- what its trade has it carry -------------------------------------------------------------------
  if (b.spool > 0) spool(ctx, f, body, b, h, t, shell, under, p.tone);
  if (b.needle > 0) needle(ctx, f, body, b, h, t, under, lampC, p.tone);
  if (b.slate > 0) slate(ctx, f, body, b, h, t, shell, under, look, p.tone);
}

/** A stroke along screen points, no ink of its own. */
function line(ctx: CanvasRenderingContext2D, pts: readonly number[], col: string, w: number): void {
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

/**
 * The chisel's mark: a lozenge on a stem, cut straight and even into the plate, the same on every
 * knocker and every keeper (keepers.ts). A cut is a dark groove with its far wall lit; under a few
 * pixels it is the groove alone.
 */
export function chiselMark(ctx: CanvasRenderingContext2D, f: F, c: Pt, s: number, rot: number, shell: string): void {
  if (B.override) return;
  const ca = Math.cos(rot), sa = Math.sin(rot);
  const P = (dx: number, dy: number): [number, number] => [f.X(c.x + dx * ca - dy * sa), f.Y(c.y + dx * sa + dy * ca)];
  const strokes: [number, number][][] = [[[0, 1], [0.55, 0], [0, -1], [-0.55, 0], [0, 1]], [[0, 1.75], [0, -1.75]]];
  const w = Math.max(1, s * 0.16 * f.u), cut = mix(shell, '#08090c', 0.75), lit = mix(shell, '#ffffff', 0.62);
  ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
  for (const [col, off, a] of [[lit, 0.7, 0.8], [cut, 0, 0.9]] as const) {
    if (col === lit && s * f.u < 4) continue;
    ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w;
    for (const st of strokes) {
      ctx.beginPath();
      st.forEach(([dx, dy], i) => { const [px, py] = P(dx * s, dy * s); (i ? ctx.lineTo(px + off, py + off) : ctx.moveTo(px + off, py + off)); });
      ctx.stroke();
    }
  }
}

/**
 * The tallyman's tallies: on every plate but the one with the mark, rows of them scratched across
 * the plate, bright where the scratch goes through, four strokes and one across, the last of a row
 * left short. Finer than the mark, and under a few pixels no more than a scuffing of the plate.
 */
function tallies(ctx: CanvasRenderingContext2D, f: F, body: Body, b: Build, markPlate: number, shell: string): void {
  if (B.override) return;
  const cut = rgba(mix(shell, '#ffffff', 0.55), 0.5), w = Math.max(1, 0.34 * f.u), L = 84 * b.length;
  for (let k = 0; k < b.plates; k++) {
    if (k === markPlate) continue;
    const s0 = (k / b.plates) * COWL, span = (COWL / b.plates) * L;
    for (const [row, v] of [[1, 0.36], [2, 0.64]] as const) {
      // Groups of four strokes and one across, a row begun at a different place on each plate, and
      // the last group of a row left short.
      for (let at0 = 1.6 + nz(k, row) * 1.8, g = 0; at0 + 2.6 < span - 1.4; at0 += 4.3 + nz(k + g, row + 5) * 0.8, g++) {
        const last = at0 + 7 >= span - 1.4, strokes = last ? 1 + Math.floor(nz(k * 7 + g, row) * 5) : 5;
        const ends: Pt[][] = [];
        for (let i = 0; i < Math.min(4, strokes); i++) {
          const s = s0 + (at0 + i * 0.95) / L, n = body.up(s);
          const c = add(body.at(s), n, -body.rb(s) + v * (body.r(s) + body.rb(s)));
          ends.push([add(c, n, -1.1), add(c, n, 1.1)]);
        }
        for (const [a, z] of ends) line(ctx, flat(f, [a, z]), cut, w);
        if (strokes === 5 && ends.length === 4) line(ctx, flat(f, [add(ends[0][0], body.dir(s0), -0.5), add(ends[3][1], body.dir(s0), 0.5)]), cut, w);
      }
    }
  }
}

/**
 * The tallyman's rime, from coming up through the ice: frost lying along the crest of its back, and
 * icicles hanging off the lip of the shell between the legs, rooted in it so they are one piece with it.
 */
function rime(ctx: CanvasRenderingContext2D, f: F, body: Body, b: Build, h: number, tone: number): void {
  const frost = shade('#eef6fa', Math.max(0.6, tone)), crest: Pt[] = [];
  for (let i = 0; i <= 14; i++) { const s = 0.06 + (COWL - 0.1) * (i / 14); crest.push(add(body.back(s), body.up(s), -1.6)); }
  if (!B.override) {
    for (let i = 0; i < crest.length - 1; i += 2) {
      const r = (1.5 + 1.4 * nz(i, 11)) * b.rime * f.u;
      ctx.fillStyle = rgba(frost, 0.55); ctx.beginPath(); ctx.ellipse(f.X(crest[i].x), f.Y(crest[i].y), r * 1.8, r, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  const icicles: Part[] = [];
  for (let i = 0; i < 7; i++) {
    const s = 0.08 + (body.ground - 0.14) * ((i + 0.3 * nz(i, 19)) / 6.3), root = add(body.belly(s), body.up(s), 1.4), len = (1.6 + 4.6 * nz(i, 13)) * b.rime, wd = 0.5 + 0.35 * nz(i, 17);
    icicles.push({ k: 'poly', pts: flat(f, [add(root, { x: -wd, y: 0 }), add(root, { x: wd, y: 0 }), { x: root.x + 0.15, y: root.y - 1.4 - len }]) });
  }
  blob(ctx, B, mix(frost, '#a8c8dc', 0.3), icicles, { h, form: false, spread: 0.6, gloss: 0.7 });
}

/**
 * The tallyman's count: six small lights in a row along the side of the cowl, behind the lamp, each
 * in a dark socket; `counted` of them lit, the newest flaring as it clicks on.
 */
function countLights(ctx: CanvasRenderingContext2D, f: F, body: Body, b: Build, counted: number, click: number, ink: string): void {
  for (let i = 0; i < 6; i++) {
    const s = COWL + 0.018 + (1 - COWL - 0.03) * (i / 5), q = add(body.at(s), body.up(s), -body.rb(s) + 0.6 * (body.r(s) + body.rb(s)));
    const r = Math.max(0.7, 0.95 * b.count * f.u), lit = i < counted;
    ctx.fillStyle = rgba(ink, 0.75); ctx.beginPath(); ctx.arc(f.X(q.x), f.Y(q.y), r * 1.3, 0, Math.PI * 2); ctx.fill();
    if (!lit) continue;
    const fresh = i === counted - 1 ? click : 0;
    glow(ctx, B, f.X(q.x), f.Y(q.y), r * (3 + 2 * fresh), b.glowHex, 0.35 + 0.4 * fresh, b.lampHex);
    ctx.fillStyle = mix(b.glowHex, b.lampHex, 0.6 + 0.4 * fresh); ctx.beginPath(); ctx.arc(f.X(q.x), f.Y(q.y), r, 0, Math.PI * 2); ctx.fill();
  }
}

/**
 * The mender's spool: a drum of wire on a bracket over its back, side on, its two flanges turned a
 * little to the company and the wire wound between them in rows.
 */
function spool(ctx: CanvasRenderingContext2D, f: F, body: Body, b: Build, h: number, t: number, shell: string, under: string, tone: number): void {
  const u = f.u, s = 0.32, top = body.back(s), n = body.up(s), d = body.dir(s);
  const c = add(top, n, 8.5 * b.spool), half = 6.5 * b.spool, ry = 9 * b.spool, rx = 3.6 * b.spool;
  const a = add(c, d, -half), z = add(c, d, half);
  // The bracket, from the back up to the axle at either end.
  blob(ctx, B, under, [
    { k: 'cap', x0: f.X(top.x - d.x * half * 0.7), y0: f.Y(top.y - d.y * half * 0.7 - 1), x1: f.X(a.x), y1: f.Y(a.y), r0: 1.8 * u, r1: 1.5 * u },
    { k: 'cap', x0: f.X(top.x + d.x * half * 0.7), y0: f.Y(top.y + d.y * half * 0.7 - 1), x1: f.X(z.x), y1: f.Y(z.y), r0: 1.8 * u, r1: 1.5 * u },
  ], { h, formK: 0.3, spread: 0.7 });
  const flange = shade(shell, 1.02), wire = mix(shell, shade(COPPER, tone), 0.62);
  const rot = -Math.atan2(d.y, d.x);
  blob(ctx, B, shade(flange, 0.82), [{ k: 'ell', x: f.X(a.x), y: f.Y(a.y), rx: rx * u, ry: ry * u, rot }], { h, formK: 0.4, spread: 0.7 });
  blob(ctx, B, wire, [{ k: 'poly', pts: flat(f, [add(a, n, ry * 0.78), add(z, n, ry * 0.78), add(z, n, -ry * 0.78), add(a, n, -ry * 0.78)]) }], { h, formK: 0.5, spread: 0.7, gloss: 0.3 });
  if (!B.override && h >= 34) {
    // The rows of wire, and the turn of the drum.
    const turn = (t / 6) % 1;
    for (let k = 0; k < 6; k++) {
      const w = -half + ((k + turn) / 6) * half * 2, q0 = add(add(c, d, w), n, ry * 0.76), q1 = add(add(c, d, w + 1.2), n, -ry * 0.76);
      line(ctx, flat(f, [q0, q1]), rgba(shade(wire, 0.6), 0.55), Math.max(1, 0.6 * u));
    }
  }
  blob(ctx, B, flange, [{ k: 'ell', x: f.X(z.x), y: f.Y(z.y), rx: rx * u, ry: ry * u, rot }], { h, formK: 0.45, spread: 0.7, gloss: 0.45 });
  if (!B.override) { ctx.fillStyle = rgba('#14161a', 0.7); ctx.beginPath(); ctx.ellipse(f.X(z.x), f.Y(z.y), Math.max(0.8, rx * 0.32 * u), Math.max(0.8, ry * 0.2 * u), rot, 0, Math.PI * 2); ctx.fill(); }
}

/**
 * The mender's arm: up off its shoulders over the cowl, and down in front of it to a needle, a
 * cold light at the point. The needle goes in and out, and the light flares as it goes in.
 */
function needle(ctx: CanvasRenderingContext2D, f: F, body: Body, b: Build, h: number, t: number, under: string, lampC: Pt, tone: number): void {
  const u = f.u, k = (t % 30) / 30, dip = k < 0.5 ? Math.sin(k * Math.PI * 2) : 0;
  const shoulder = add(body.back(0.7), body.up(0.7), -1.5);
  const elbow: Pt = { x: lampC.x - 2, y: shoulder.y + 13 - dip * 1.5 };
  const wrist: Pt = { x: lampC.x + 13, y: lampC.y + 8 - dip * 3 };
  const tip: Pt = { x: wrist.x + 3, y: wrist.y - 13 - dip * 3 };
  const arm = shade(under, 1.25);
  blob(ctx, B, arm, [
    { k: 'cap', x0: f.X(shoulder.x), y0: f.Y(shoulder.y), x1: f.X(elbow.x), y1: f.Y(elbow.y), r0: 2.6 * u, r1: 2.2 * u },
    { k: 'cap', x0: f.X(elbow.x), y0: f.Y(elbow.y), x1: f.X(wrist.x), y1: f.Y(wrist.y), r0: 2.2 * u, r1: 1.9 * u },
    { k: 'ball', x: f.X(shoulder.x), y: f.Y(shoulder.y), r: 3.4 * u },
    { k: 'ball', x: f.X(elbow.x), y: f.Y(elbow.y), r: 2.8 * u },
    { k: 'ell', x: f.X(wrist.x), y: f.Y(wrist.y - 1.5), rx: 2.6 * u, ry: 3.4 * u },
    { k: 'cap', x0: f.X(wrist.x), y0: f.Y(wrist.y - 3), x1: f.X(tip.x), y1: f.Y(tip.y), r0: 1.2 * u, r1: 0.45 * u },
  ], { h, formK: 0.4, spread: 0.7, gloss: 0.35 });
  if (B.override) return;
  // The wire, off the spool along the back and down the arm to the needle, a thread of copper.
  if (h >= 40) {
    const wire: Pt[] = [];
    for (let i = 0; i <= 8; i++) { const s = 0.38 + (0.68 - 0.38) * (i / 8); wire.push(add(body.back(s), body.up(s), -1.6)); }
    wire.push(shoulder, add(elbow, { x: 0.6, y: -0.6 }), add(wrist, { x: -0.4, y: 0.2 }));
    line(ctx, flat(f, wire), rgba(mix(under, shade(COPPER, tone), 0.8), 0.85), Math.max(1, 0.6 * u));
  }
  const flare = k < 0.5 ? 0.55 + 0.45 * Math.sin(k * Math.PI * 2) : 0.2;
  glow(ctx, B, f.X(tip.x), f.Y(tip.y), 9 * u * (0.7 + flare * 0.5), b.arcHex, 0.5 * flare, '#ffffff');
  ctx.fillStyle = rgba('#ffffff', 0.6 + 0.4 * flare); ctx.beginPath(); ctx.arc(f.X(tip.x), f.Y(tip.y), Math.max(0.8, 1.2 * u), 0, Math.PI * 2); ctx.fill();
}

/**
 * The Foreman's slate, held up before it on one arm, the list cut on it in rows (a mark, a name and
 * an empty box at each row's end), and the stylus in the other going down the boxes a row at a time
 * and ticking none. The lamp's light falls on it while the cowl is bowed.
 */
function slate(ctx: CanvasRenderingContext2D, f: F, body: Body, b: Build, h: number, t: number, shell: string, under: string, look: number, tone: number): void {
  const u = f.u, chest = body.belly(0.74);
  const c: Pt = { x: chest.x + 15 * b.slate, y: chest.y - 6 };
  const w = 20 * b.slate, hh = 26 * b.slate, tilt = -0.18;
  const corner = (dx: number, dy: number): Pt => ({ x: c.x + dx * Math.cos(tilt) - dy * Math.sin(tilt), y: c.y + dx * Math.sin(tilt) + dy * Math.cos(tilt) });
  // The arm that holds it, from the chest to its near edge.
  const hold = body.belly(0.62), grip = corner(-w * 0.42, -hh * 0.05);
  blob(ctx, B, shade(under, 1.15), [
    { k: 'cap', x0: f.X(hold.x - 1), y0: f.Y(hold.y + 1), x1: f.X(grip.x - 5), y1: f.Y(grip.y - 3), r0: 2.4 * u, r1: 2.1 * u },
    { k: 'cap', x0: f.X(grip.x - 5), y0: f.Y(grip.y - 3), x1: f.X(grip.x), y1: f.Y(grip.y), r0: 2.1 * u, r1: 1.8 * u },
    { k: 'ball', x: f.X(grip.x - 5), y: f.Y(grip.y - 3), r: 2.6 * u },
  ], { h, formK: 0.4, spread: 0.7 });
  const plate = [corner(-w / 2, hh / 2), corner(w / 2, hh / 2), corner(w / 2, -hh / 2), corner(-w / 2, -hh / 2)];
  blob(ctx, B, shade(SLATE, Math.max(0.6, tone)), [{ k: 'poly', pts: flat(f, plate) }], { h, formK: 0.3, spread: 0.8, gloss: 0.25 });
  // The list, and the stylus at the box of the row it has come to.
  const rows = 6, row = Math.floor(t / 14) % rows, rowY = (r: number): number => hh / 2 - 4.5 - r * ((hh - 9) / (rows - 1));
  const bx = w / 2 - 5.5;
  if (!B.override) {
    const cut = rgba(mix(shell, '#ffffff', 0.55), 0.85), lw = Math.max(1, 0.9 * u);
    for (let r = 0; r < rows; r++) {
      const yy = rowY(r), name = 4.5 + nz(r, 3) * 3.5;
      line(ctx, flat(f, [corner(-w / 2 + 2.5, yy), corner(-w / 2 + 4.5, yy)]), cut, lw);
      line(ctx, flat(f, [corner(-w / 2 + 6.5, yy), corner(-w / 2 + 6.5 + name, yy)]), cut, lw);
      const q = [corner(bx - 1.2, yy + 1.2), corner(bx + 1.2, yy + 1.2), corner(bx + 1.2, yy - 1.2), corner(bx - 1.2, yy - 1.2), corner(bx - 1.2, yy + 1.2)];
      line(ctx, flat(f, q), cut, Math.max(1, 0.7 * u));
    }
    // The lamp's light, on the slate while the cowl is bowed over it.
    glow(ctx, B, f.X(c.x), f.Y(c.y + 3), w * 0.8 * u, b.glowHex, 0.2 * (1 - look), b.lampHex);
  }
  // The stylus arm: from low on the chest to an elbow under the slate, and up across it to the box.
  const point = corner(bx + 0.4, rowY(row) + 0.4), root = body.belly(0.68), elbow = corner(-w * 0.05, -hh / 2 - 6);
  blob(ctx, B, shade(under, 1.3), [
    { k: 'cap', x0: f.X(root.x), y0: f.Y(root.y), x1: f.X(elbow.x), y1: f.Y(elbow.y), r0: 2.2 * u, r1: 1.9 * u },
    { k: 'ball', x: f.X(elbow.x), y: f.Y(elbow.y), r: 2.4 * u },
    { k: 'cap', x0: f.X(elbow.x), y0: f.Y(elbow.y), x1: f.X(point.x - 2), y1: f.Y(point.y - 3.5), r0: 1.9 * u, r1: 1.4 * u },
    { k: 'cap', x0: f.X(point.x - 2), y0: f.Y(point.y - 3.5), x1: f.X(point.x), y1: f.Y(point.y), r0: 1.1 * u, r1: 0.45 * u },
  ], { h, formK: 0.4, spread: 0.7, gloss: 0.3 });
}
