// The birds: the Carrion Crow first, on one frame the road's other birds reshape (the great owl, the
// grey heron, the wrack gull, the raven, the spine eagle and the vulture). A carrion crow standing
// in profile, in units of the sprite height taken up from the ground line: the visible leg is a
// fifth of the height, the body leans up some twenty-five degrees to a full breast, the head sits
// on a short thick neck with the crown at 0.88, the bill is as long as the head and slopes down a
// little from a deep base, and the tail is a third of the bird's length, rounded at the end. All
// black, with a blue-violet sheen on the wing and nape; the eye is the one bright thing on it.
// Posed on the ground mid-hop, wings half open, so it reads as a flier at 16 px and stands in the
// stubble. Idle: a hop every few seconds, the legs stretching under it, and a flick of the wings.
// Painted as masses: the far wing and leg in shadow, the tail, the near leg, the plumage (body,
// breast, neck, head, throat hackles) as one, the near wing over it, then the bill as its own
// material, the sheen, the eye.
// The Great Owl is the same frame turned to the party (`face` from 0.5, the `facing` pose): upright,
// the head as wide as the shoulders and sunk in them, ear tufts, a pale facial disc and two big
// orange eyes over a small hooked bill, short legs feathered to the talons, and the wings raised
// wide in threat, their pale undersides barred. Tawny and matte, the breast pale, streaked above
// and barred below. Idle: the wings lift and settle slowly, and now and then the eyes close.
// The Old Rook, the keeper of a rookery, is the crow's frame grown heavy and ragged: bigger, the
// throat and the thighs shaggy, a purple sheen on the black and the rook's bare grey-white face
// round the base of its bill, which is what tells a rook from a crow across a field.
// The Grey Heron is the crow's profile on stilts: the legs two and a half times the crow's, the
// body slim and nearly level, the neck three times as long in a crouched S, and a yellow dagger
// of a bill. Grey, the head and neck white with a black stripe from the eye into a trailing crest,
// the neck's front streaked. Taller than a man, so it is drawn inside 0.74 of its height. It does
// not hop; it stands and watches, and only the wings stir.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['crow', 'owl', 'old_rook', 'grey_heron'];

/**
 * The frame's parts, as proportions of the crow's (1 = the crow, 0 = none). Each is named for the
 * bird that pushes it furthest, so the later birds are a Build and a colouring, not a new drawing.
 */
interface Build {
  /** Bulk of the body and breast: the spine eagle's is the largest. */
  body: number;
  /** Length of the neck: the grey heron's is three times the crow's, the great owl's none. */
  neck: number;
  /** Size of the head: the owl's is the biggest for its body. */
  head: number;
  /**
   * 0 a profile; toward 1 the head turns to the party behind a pale facial disc with both eyes. From
   * 0.5 the whole bird turns to the party, upright with its wings raised wide: the owl's pose.
   */
  face: number;
  /** Length of the bill: the heron's dagger, the raven's heavy one. */
  bill: number;
  /** How far the bill's tip hooks down: the eagle's and the vulture's. */
  hook: number;
  /** Length of the legs: the heron's stilts. */
  leg: number;
  /** Length of the wing: the wrack gull's is long. */
  wing: number;
  /** Depth of the wing and the spread of its fingered primaries: the vulture's is broad. */
  broad: number;
  /** Length of the tail. */
  tail: number;
  /** 0 a square or rounded tail end, 1 a wedge: the raven's. */
  wedge: number;
  /** Hackles at the throat and collar: the raven's shaggy throat, the vulture's ruff. */
  ruff: number;
  /** Bare skin on the head and neck, 0..1: the vulture's. */
  bare: number;
  /** The gloss the black catches (the crow's blue-violet), or null for a matte bird (the owl). */
  sheen: string | null;
  /** How glossy the plumage is, 0 matte (the owl) to 1 (the crow). */
  gloss: number;
  /** 0 bare scaled legs (the crow, the heron), 1 feathered to the talons (the owl, the eagle). */
  feathered: number;
  /** The body's lean in profile, radians: the crow's forward tilt; toward 0 the heron's level back. */
  lean: number;
  /** How far the idle hops, 0 not at all (the heron stalks, the owl stands). */
  hop: number;
  /** Ear tufts, 0 none: the great owl's. */
  tufts: number;
  /** Barring and streaks on a pale breast, 0 none: the owl's, the eagle's. */
  bars: number;
  /** Bare grey-white skin round the base of the bill, 0 none: the rook's. */
  mask: number;
  /** Long plumes trailing from the back of the head, 0 none: the heron's black crest. */
  crest: number;
  /** A pale head and neck, 0 none to 1 white, with a dark stripe over the eye: the heron's. */
  pale: number;
  /** Dark streaks down the front of the neck, 0 none: the heron's. */
  streaks: number;
  /** The bill's colour, or null for horn: the heron's yellow dagger. */
  billHex: string | null;
}
const CROW: Build = {
  body: 1, neck: 1, head: 1, face: 0, bill: 1, hook: 0, leg: 1, wing: 1, broad: 1, tail: 1, wedge: 0.3, ruff: 0.35, bare: 0,
  sheen: '#5a68b0', gloss: 1, feathered: 0, lean: -0.36, hop: 1, tufts: 0, bars: 0, mask: 0,
  crest: 0, pale: 0, streaks: 0, billHex: null,
};
/** Upright and turned to the party, wings raised wide: a big round head sunk in the shoulders, a small hooked bill, short feathered legs. */
const OWL: Build = {
  body: 1.1, neck: 0, head: 1.6, face: 1, bill: 0.35, hook: 0.8, leg: 0.6, wing: 1.4, broad: 1.3, tail: 0.6, wedge: 0, ruff: 0, bare: 0,
  sheen: null, gloss: 0, feathered: 1, lean: -1.2, hop: 0, tufts: 1, bars: 1, mask: 0,
  crest: 0, pale: 0, streaks: 0, billHex: null,
};
/** The old rook: bigger and heavier than the crow, shaggy at the throat and the thighs, the bill long and pale-based. */
const ROOK: Build = {
  body: 1.2, neck: 1, head: 1.08, face: 0, bill: 1.2, hook: 0, leg: 1, wing: 1.08, broad: 1.12, tail: 1, wedge: 0.15, ruff: 1, bare: 0,
  sheen: '#7a5aa8', gloss: 0.8, feathered: 1, lean: -0.3, hop: 0.5, tufts: 0, bars: 0, mask: 1,
  crest: 0, pale: 0, streaks: 0, billHex: null,
};
/**
 * The grey heron: the crow's profile on stilts, the body slim and nearly level, the neck three
 * times the crow's in a crouched S, the head small, and a yellow dagger of a bill. Grey on the back
 * and wings, the head and neck white with a black stripe from the eye back into a trailing crest,
 * and the front of the neck streaked. Matte, and it does not hop: it stands, and watches.
 */
const HERON: Build = {
  body: 0.85, neck: 3, head: 0.8, face: 0, bill: 1.55, hook: 0, leg: 2.6, wing: 1.05, broad: 1.1, tail: 0.45, wedge: 0, ruff: 0, bare: 0,
  sheen: null, gloss: 0.1, feathered: 0, lean: -0.18, hop: 0, tufts: 0, bars: 0, mask: 0,
  crest: 1, pale: 1, streaks: 1, billHex: '#d8b040',
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  const b = kind === 'owl' ? OWL : kind === 'old_rook' ? ROOK : kind === 'grey_heron' ? HERON : CROW;
  // The pose is the Build's `face`. Turned to the party, the raised wings reach higher than the
  // crow's hop: drawn inside 0.85 of its height, as the lampman is, the owl's tips keep clear of the
  // top of the combat canvas (at full height and wing 1.6 they run off it), and the wings as much
  // as the body make its size.
  if (b.face >= 0.5) facing(ctx, x, y, h * 0.85, p, b);
  // The heron's stilts and neck carry its crown to about 1.2 of the crow's frame: drawn inside 0.74
  // of its height, its crown stands where a crow's does.
  else if (b.leg > 2) bird(ctx, x, y, h * 0.74, p, b);
  else bird(ctx, x, y, h, p, b);
};

/**
 * A long neck's spine in sprite units, from the breast (x0, y0) to under the head (x1, y1): back from
 * the breast, then forward and up under the head, a crouched S the length of `nl` allows.
 */
function neckS(x0: number, y0: number, x1: number, y1: number, nl: number): number[] {
  const dy = y1 - y0;
  return [x0, y0, x0 + 0.03, y0 + dy * 0.22, x0 - nl * 0.12, y0 + dy * 0.5, x1 - nl * 0.28, y1 - dy * 0.18, x1, y1];
}

/** A direction back and up from the bird, `a` radians above the horizontal (the bird faces +x). */
const back = (a: number): [number, number] => [-Math.cos(a), Math.sin(a)];

/**
 * A half-open wing in sprite units (up positive): the leading edge from the shoulder to the wrist,
 * five fingered primaries fanning from the wrist, and the scalloped trailing edge of the secondaries
 * coming back into the body at (ax, ay). `th` is how far the arm is raised.
 */
function wingOutline(sx: number, sy: number, th: number, W: number, broad: number, ax: number, ay: number): { pts: number[]; wrist: [number, number]; notches: number[] } {
  const [dx, dy] = back(th), wx = sx + dx * 0.26 * W, wy = sy + dy * 0.26 * W;
  const phi = th - 0.5, len = 0.4 * W, spread = 0.15 * broad;
  const pts = [sx + 0.04, sy - 0.03, sx, sy + 0.035, sx + dx * 0.13 * W, sy + dy * 0.13 * W + 0.03, wx, wy + 0.02];
  const notches: number[] = [];
  for (let i = 0; i < 5; i++) {
    const [tx, ty] = back(phi - i * spread), l = len * (1 - i * 0.08);
    pts.push(wx + tx * l, wy + ty * l);
    if (i < 4) {
      const [nx, ny] = back(phi - (i + 0.5) * spread), l2 = len * (0.82 - i * 0.07);
      pts.push(wx + nx * l2, wy + ny * l2);
      notches.push(wx + nx * l2, wy + ny * l2);
    }
  }
  // The secondaries: a deeper wing brings its trailing edge further out from the wrist.
  const [ex0, ey0] = back(phi - 5 * spread), ex = wx + ex0 * len * 0.62 * broad, ey = wy + ey0 * len * 0.62 * broad - 0.03;
  // They bow out from the straight line back to the body, one scallop to a feather.
  const cx = ex - ax, cy = ey - ay, cl = Math.hypot(cx, cy) || 1, ox = -cy / cl, oy = cx / cl;
  for (let k = 0; k < 5; k++) {
    const t = k / 5, bow = Math.sin(t * Math.PI) * 0.08 * broad - (k % 2 ? 0.016 : 0);
    pts.push(ex + (ax - ex) * t + ox * bow, ey + (ay - ey) * t + oy * bow);
  }
  pts.push(ax, ay);
  return { pts, wrist: [wx, wy], notches };
}

function bird(ctx: CanvasRenderingContext2D, x0: number, y: number, h: number, p: Paint, b: Build): void {
  const f = p.frame, tone = p.tone, bs = b.body;
  // The bird runs from the tail's end at -0.66 to the bill's tip at +0.58; centre it on x0.
  const x = x0 + h * 0.04;
  const X = (u: number) => x + u * h;
  const U = (u: number) => y - u * h;
  /** Sprite units (up positive) to px, pairwise. */
  const px = (u: readonly number[]): number[] => u.map((v, i) => (i % 2 ? U(v) : X(v)));

  // The hop, every 120 frames: the body springs up and the feet just leave the ground. The wing
  // flick comes between hops.
  const ht = f % 120, hop = ht < 20 ? Math.sin(ht / 20 * Math.PI) * b.hop : 0;
  const ft = (f + 64) % 96, flick = ft < 16 ? Math.sin(ft / 16 * Math.PI) : 0;
  const L = 0.2 * b.leg, by = L + hop * 0.07 + p.breathe * 0.004, feet = hop * 0.03;

  const plume = p.base, far = p.dark;
  const sheen = b.sheen ? shade(b.sheen, tone) : null;
  const horn = shade('#1c1a20', tone);
  // Bare legs are horn, or the bill's colour dulled where the bill has one: the heron's yellow-brown.
  const shank = b.feathered ? plume : b.billHex ? mix(shade(b.billHex, tone), horn, 0.55) : horn;
  const skin = shade('#c8807a', tone);
  const eyeCol = shade('#f0d890', Math.max(0.7, tone));

  groundShadow(ctx, X(-0.08), y + 1, h * 0.95 * (1 - hop * 0.2));

  // Where the parts join, in sprite units.
  const nl = 0.06 * b.neck, rH = 0.115 * b.head;
  const hx = 0.24 + nl * 0.6, hy = by + 0.4 * bs + nl + 0.07;
  const sx = 0.08, sy = by + 0.4 * bs;
  const ax = -0.18, ay = by + 0.22 * bs;
  // The flick and the hop both lift the wings, never more than one at a time's worth: together they
  // would raise the far wing's tip past the top of the combat canvas.
  const th = 0.8 + 0.3 * Math.max(flick, hop);
  const W = b.wing;

  /** A leg from the hip down to the foot, with three toes forward and one back, all one piece. */
  const leg = (dx: number, out: Part[]) => {
    const fx = 0.02 + dx, fy = feet + 0.01, r = 0.02 * h, t = 0.012 * h;
    out.push({ k: 'tube', pts: px([0.01 + dx, by + 0.07, -0.015 + dx, (by + feet) / 2 + 0.02, fx, fy]), r0: r, r1: r * 0.78 });
    out.push({ k: 'tube', pts: px([fx, fy, fx + 0.06, feet + 0.004, fx + 0.11, feet + 0.006]), r0: t, r1: t * 0.8 });
    out.push({ k: 'tube', pts: px([fx, fy, fx + 0.08, feet + 0.02]), r0: t, r1: t * 0.8 });
    out.push({ k: 'tube', pts: px([fx, fy, fx - 0.07, feet + 0.006]), r0: t, r1: t * 0.8 });
  };

  // ---- far side, in shadow: the far wing raised a little higher than the near, and the far leg.
  const farLeg: Part[] = [];
  leg(-0.09, farLeg);
  blob(ctx, B, shade(shank, 0.85), farLeg, { h, formK: 0.3 });
  const fw = wingOutline(sx - 0.05, sy + 0.02, th + 0.15, W, b.broad, ax, ay + 0.04);
  blob(ctx, B, far, [{ k: 'poly', pts: px(fw.pts) }], { h, formK: 0.3 });

  // ---- the tail: its own mass behind the rump, angled down, fanned a little toward its end.
  {
    const rx = -0.26, ry = by + 0.17 * bs, tl = 0.34 * b.tail, d = [-0.894, -0.447], n = [0.447, -0.894];
    const tx = rx + d[0] * tl, ty = ry + d[1] * tl, r0 = 0.04 * bs, r1 = 0.085 * b.broad, w = 0.03 + b.wedge * 0.07;
    blob(ctx, B, mix(plume, far, 0.3), [{ k: 'poly', pts: px([
      rx + n[0] * r0, ry + n[1] * r0, tx + n[0] * r1, ty + n[1] * r1,
      tx + d[0] * w * 0.5 + n[0] * r1 * 0.5, ty + d[1] * w * 0.5 + n[1] * r1 * 0.5,
      tx + d[0] * w, ty + d[1] * w,
      tx + d[0] * w * 0.5 - n[0] * r1 * 0.5, ty + d[1] * w * 0.5 - n[1] * r1 * 0.5,
      tx - n[0] * r1, ty - n[1] * r1, rx - n[0] * r0, ry - n[1] * r0,
    ]) }], { h, formK: 0.3, gloss: 0.15 * b.gloss });
    if (h >= 40) softLine(ctx, B, px([rx + d[0] * tl * 0.2, ry + d[1] * tl * 0.2, tx + d[0] * w * 0.8, ty + d[1] * w * 0.8]), plume, Math.max(1, h * 0.008), 0.5);
  }

  // ---- the near leg, scaled horn, under the belly feathers.
  const nearLeg: Part[] = [];
  leg(0, nearLeg);
  blob(ctx, B, shank, nearLeg, { h, formK: 0.3 });

  // ---- the plumage: body, breast, belly, the feathered thigh, neck and head, ONE mass.
  const bare = b.bare > 0;
  const body: Part[] = [
    { k: 'ell', x: X(-0.04), y: U(by + 0.22 * bs), rx: h * 0.32 * bs, ry: h * 0.16 * bs, rot: b.lean },
    { k: 'ell', x: X(0.12), y: U(by + 0.3 * bs), rx: h * 0.14 * bs, ry: h * 0.15 * bs },
    { k: 'ell', x: X(0.0), y: U(by + 0.1), rx: h * 0.07, ry: h * 0.06 },
    // A long neck is a crouched S, back from the breast and forward again under the head; a short
    // one is a straight piece of the mass.
    b.neck > 1.5
      ? { k: 'tube', pts: px(neckS(0.15, by + 0.36 * bs, hx - rH * 0.2, hy - rH * 0.3, nl)), r0: h * 0.07 * bs, r1: h * rH * 0.62 }
      : { k: 'cap', x0: X(0.15), y0: U(by + 0.36 * bs), x1: X(hx - rH * 0.2), y1: U(hy - rH * 0.3), r0: h * 0.12 * bs, r1: h * rH * 0.78 },
  ];
  if (!bare) body.push({ k: 'ball', x: X(hx), y: U(hy), r: h * rH, gloss: 0.3 * b.gloss });
  // Hackles: the loose feathers of the throat, a ragged edge under the chin.
  if (b.ruff > 0) {
    const rr = rH * (0.4 + 0.5 * b.ruff), cx = hx - rH * 0.15, cy = hy - rH * 1.05;
    const ring: number[] = [];
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ring.push(X(cx + Math.cos(a) * rr), U(cy + Math.sin(a) * rr * 0.8)); }
    body.push({ k: 'curve', pts: ring, wobble: 0.05, spiky: 0.1 * b.ruff, seed: 7, sub: 2 });
  }
  blob(ctx, B, plume, body, { h, formK: 0.4, spread: 0.8, creases: [
    { x0: X(0.2), y0: U(by + 0.5 * bs), x1: X(0.14), y1: U(by + 0.36 * bs), r: h * 0.03, a: 0.22 },   // where the neck meets the breast
    { x0: X(-0.02), y0: U(by + 0.1), x1: X(0.05), y1: U(by + 0.05), r: h * 0.02, a: 0.25 },            // the thigh into the belly
  ] });
  if (bare) blob(ctx, B, mix(plume, skin, b.bare), [{ k: 'ball', x: X(hx), y: U(hy), r: h * rH }], { h, formK: 0.4 });
  // The heron's white head and neck, a marking on the one mass, and the streaks down its front.
  if (b.pale > 0) {
    const white = mix(plume, shade('#f2f0ea', tone), b.pale);
    const nk = neckS(0.15, by + 0.36 * bs, hx - rH * 0.2, hy - rH * 0.3, nl);
    patch(ctx, B, white, [
      { k: 'tube', pts: px(nk.slice(2)), r0: h * 0.06 * bs, r1: h * rH * 0.6 },
      { k: 'ball', x: X(hx), y: U(hy), r: h * rH * 1.04 },
    ], { alpha: 0.9, feather: 0.25 });
    if (b.streaks > 0 && h >= 30) {
      // Down the front of the neck, the side toward the bill: short dark dashes in a line.
      for (let i = 1; i < nk.length / 2 - 1; i++) {
        const [ax0, ay0, ax1, ay1] = [nk[i * 2] + 0.022, nk[i * 2 + 1] + 0.008, nk[i * 2 + 2] + 0.02, nk[i * 2 + 3] + 0.012];
        softLine(ctx, B, px([ax0, ay0, ax0 + (ax1 - ax0) * 0.55, ay0 + (ay1 - ay0) * 0.55]), far, Math.max(1, h * 0.009 * b.streaks), 0.7);
      }
    }
  }

  // ---- the near wing, half open over the body.
  const nw = wingOutline(sx, sy, th, W, b.broad, ax, ay);
  blob(ctx, B, mix(plume, far, 0.15), [{ k: 'poly', pts: px(nw.pts) }], { h, formK: 0.35, spread: 0.8, gloss: 0.2 * b.gloss });
  // The sheen: blue-violet on the coverts and the nape, where a crow's black catches the light.
  if (sheen) patch(ctx, B, sheen, [
    { k: 'ell', x: X((sx + nw.wrist[0] + ax) / 3), y: U((sy + nw.wrist[1] + ay) / 3), rx: h * 0.1 * W, ry: h * 0.07 * W, rot: -0.9 },
  ], { alpha: 0.3, feather: 0.7 });
  if (sheen && !bare) patch(ctx, B, sheen, [{ k: 'ell', x: X(hx - rH * 0.35), y: U(hy + rH * 0.3), rx: h * rH * 0.55, ry: h * rH * 0.4, rot: -0.4 }], { alpha: 0.26, feather: 0.6 });
  // The primaries' separations, and the edge of the coverts over them.
  if (h >= 36) {
    const lw = Math.max(1, h * 0.008);
    for (let i = 0; i < nw.notches.length; i += 2) {
      const nx = nw.notches[i], ny = nw.notches[i + 1];
      softLine(ctx, B, px([nw.wrist[0] + (nx - nw.wrist[0]) * 0.45, nw.wrist[1] + (ny - nw.wrist[1]) * 0.45, nx, ny]), plume, lw, 0.6);
    }
    softLine(ctx, B, px([sx - 0.02, sy - 0.02, nw.wrist[0] + 0.02, nw.wrist[1] - 0.06, ax + 0.02, ay + 0.04]), plume, lw, 0.45);
  }

  // ---- the bill: its own material, deep at the base and sloping a little down to the tip.
  {
    const bl = 0.17 * b.bill, dp = 0.06 * Math.sqrt(b.bill), bx0 = hx + rH * 0.7, byb = hy - rH * 0.12;
    const tip = [bx0 + bl, byb - bl * 0.2 - b.hook * bl * 0.15];
    const pts = [bx0 - rH * 0.2, byb + dp * 0.6, bx0 + bl * 0.45, byb + dp * 0.45 - bl * 0.05, tip[0], tip[1]];
    if (b.hook > 0) pts.push(tip[0] - b.hook * bl * 0.12, tip[1] - b.hook * bl * 0.25);
    pts.push(bx0 + bl * 0.5, byb - dp * 0.35 - bl * 0.12, bx0 - rH * 0.15, byb - dp * 0.6);
    const billCol = b.billHex ? shade(b.billHex, Math.max(0.6, tone)) : horn;
    blob(ctx, B, billCol, [{ k: 'poly', pts: px(pts) }], { h, form: false, gloss: b.billHex ? 0.3 : 0.35 * b.gloss });
    // The gape, and the bristles that cover a crow's nostrils.
    if (h >= 30) softLine(ctx, B, px([bx0 - rH * 0.1, byb - dp * 0.05, bx0 + bl * 0.7, byb - bl * 0.13]), b.billHex ? shade(billCol, 0.6) : horn, Math.max(1, h * 0.007), 0.7);
    if (!bare && !b.mask && !b.billHex) patch(ctx, B, plume, [{ k: 'ell', x: X(bx0 + bl * 0.12), y: U(byb + dp * 0.25), rx: h * bl * 0.2, ry: h * dp * 0.35 }], { alpha: 0.8, feather: 0.4 });
    // The rook's bare face: grey-white skin round the base of the bill and under the chin.
    if (b.mask > 0) patch(ctx, B, shade('#cfcac4', Math.max(0.6, tone)), [
      { k: 'ell', x: X(bx0 + bl * 0.05), y: U(byb), rx: h * (rH * 0.5 + bl * 0.15), ry: h * rH * 0.55, rot: 0.15 },
      { k: 'ell', x: X(bx0 - rH * 0.15), y: U(byb - rH * 0.45), rx: h * rH * 0.4, ry: h * rH * 0.3 },
    ], { alpha: 0.85 * b.mask, feather: 0.3 });
  }

  // ---- a face half turned to the party: a pale disc about the eye (a full turn is the `facing` pose).
  if (b.face > 0) patch(ctx, B, mix(p.light, shade('#e8dcc0', tone), 0.5), [{ k: 'ell', x: X(hx + rH * 0.1), y: U(hy), rx: h * rH * 0.85 * b.face, ry: h * rH * 0.95 * b.face }], { alpha: 0.6 * b.face, feather: 0.35 });

  // ---- the crest: a black stripe from over the eye back to the nape, and plumes trailing from it.
  if (b.crest > 0) {
    const ink = shade('#1a1820', tone);
    patch(ctx, B, ink, [{ k: 'cap', x0: X(hx + rH * 0.35), y0: U(hy + rH * 0.35), x1: X(hx - rH * 0.75), y1: U(hy + rH * 0.45), r0: h * rH * 0.2, r1: h * rH * 0.3 }], { alpha: 0.9, feather: 0.2 });
    const sway = p.breathe * 0.01;
    const plumes: Part[] = [0, 1].map((i) => ({ k: 'tube', pts: px([
      hx - rH * 0.6, hy + rH * 0.45, hx - rH * 0.6 - 0.07 * b.crest, hy + rH * (0.3 - i * 0.25) + sway, hx - rH * 0.6 - (0.14 - i * 0.03) * b.crest, hy + rH * (0.05 - i * 0.45) + sway * 2,
    ]), r0: h * rH * 0.16, r1: h * 0.003 }));
    blob(ctx, B, ink, plumes, { h, form: false });
  }

  // ---- the eye: bright and watching. In profile only the one (a bird turned to the party is `facing`).
  const er = rH * 0.2 * h;
  eye(ctx, X(hx + rH * 0.22), U(hy + rH * 0.18), er, eyeCol);
}

/**
 * The frame turned to the party, upright, both wings raised wide: the owl's threat, and the pose a
 * bird that faces the company takes. The same Build and parts as the profile: the wings are the
 * profile's wing outline, one of them mirrored; the eyes, bill and colours are the same. Painted
 * back to front: both wings (their undersides, barred), the tail, the feathered legs and talons, the
 * plumage (body, head and ear tufts) as one, the pale breast and its bars, the facial disc, the bill,
 * the eyes. Idle: the wings lift and settle slowly, and now and then the eyes close.
 */
function facing(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const f = p.frame, tone = p.tone, bs = b.body;
  const X = (u: number) => x + u * h;
  const U = (u: number) => y - u * h;
  const px = (u: readonly number[]): number[] => u.map((v, i) => (i % 2 ? U(v) : X(v)));
  /** The same points on the bird's other side. */
  const mirror = (u: readonly number[]): number[] => u.map((v, i) => (i % 2 ? v : -v));

  const lift = 0.5 + 0.5 * Math.sin(f / 30);
  const blink = (f + 75) % 150 < 7;
  const L = 0.2 * b.leg, by = L + p.breathe * 0.004;

  const plume = p.base, far = p.dark;
  const pale = mix(p.light, shade('#efe2c4', tone), 0.55);
  const under = mix(plume, pale, 0.4);
  const horn = shade('#2a2420', tone);
  const bar = shade(plume, 0.5);
  const eyeCol = shade('#ff9a2a', Math.max(0.75, tone));

  groundShadow(ctx, X(0), y + 1, h * 0.9);

  const nl = 0.06 * b.neck, rH = 0.115 * b.head;
  const hy = by + 0.6 * bs + rH * 0.5 + nl;
  const sx = -0.2 * bs, sy = by + 0.48 * bs;
  const ax = -0.16 * bs, ay = by + 0.2 * bs;
  const th = 0.85 + 0.2 * lift;
  const W = b.wing;

  // ---- the wings, raised wide to either side: the undersides show, pale, the flight feathers barred.
  const wing = wingOutline(sx, sy, th, W, b.broad, ax, ay);
  for (const side of [-1, 1]) {
    const u = side < 0 ? wing.pts : mirror(wing.pts);
    blob(ctx, B, side < 0 ? under : shade(under, 0.9), [{ k: 'poly', pts: px(u) }], { h, formK: 0.35, spread: 0.8 });
    // Dark coverts along the leading edge.
    const [wx, wy] = wing.wrist;
    patch(ctx, B, far, [{ k: 'cap', x0: X(side * -sx), y0: U(sy + 0.02), x1: X(side * -wx), y1: U(wy + 0.01), r0: h * 0.06 * W, r1: h * 0.04 * W }], { alpha: 0.45, feather: 0.65 });
    if (h >= 30 && b.bars > 0) {
      // Bars across the primaries: arcs about the wrist, one feather's width apart.
      const lw = Math.max(1, h * 0.01);
      const phi = th - 0.5, spread = 0.15 * b.broad, len = 0.4 * W;
      for (const r of [0.45, 0.68, 0.9]) {
        const arc: number[] = [];
        for (let i = 0; i <= 4; i++) { const [tx, ty] = back(phi - i * spread); const l = len * r * (1 - i * 0.08); arc.push(side * -(wx + tx * l), wy + ty * l); }
        softLine(ctx, B, px(arc), bar, lw, 0.55 * b.bars);
      }
      for (let i = 0; i < wing.notches.length; i += 2) {
        const nx = wing.notches[i], ny = wing.notches[i + 1];
        softLine(ctx, B, px([side * -(wx + (nx - wx) * 0.4), wy + (ny - wy) * 0.4, side * -nx, ny]), plume, lw, 0.5);
      }
    }
  }

  // ---- the tail: a short fan behind the legs.
  {
    const t = 0.12 * b.tail, w = 0.07 * b.broad;
    blob(ctx, B, far, [{ k: 'poly', pts: px([-w * 0.6, by + 0.12, w * 0.6, by + 0.12, w, by + 0.1 - t, 0, by + 0.08 - t - b.wedge * 0.05, -w, by + 0.1 - t]) }], { h, formK: 0.3 });
  }

  // ---- the legs, feathered to the talons (or bare), and the talons, hooked, horn.
  for (const s of [-1, 1]) {
    const fx = s * 0.085 * bs;
    blob(ctx, B, horn, [
      { k: 'tube', pts: px([fx, 0.02, fx + s * 0.03, 0.012, fx + s * 0.06, -0.008]), r0: 0.014 * h, r1: 0.008 * h },
      { k: 'tube', pts: px([fx, 0.02, fx + s * 0.005, 0.01, fx + s * 0.01, -0.012]), r0: 0.014 * h, r1: 0.008 * h },
      { k: 'tube', pts: px([fx, 0.02, fx - s * 0.03, 0.012, fx - s * 0.05, -0.006]), r0: 0.013 * h, r1: 0.008 * h },
    ], { h, form: false });
    blob(ctx, B, b.feathered ? mix(plume, pale, 0.4) : horn, [{ k: 'tube', pts: px([s * 0.07 * bs, by + 0.12, fx, 0.03]), r0: 0.06 * h * (0.5 + 0.5 * b.feathered), r1: 0.035 * h }], { h, formK: 0.35 });
  }

  // ---- the plumage: body, head and ear tufts, ONE mass. The head sits in the shoulders.
  const body: Part[] = [
    { k: 'ell', x: X(0), y: U(by + 0.3 * bs), rx: h * 0.25 * bs, ry: h * 0.3 * bs },
    { k: 'ell', x: X(0), y: U(by + 0.48 * bs), rx: h * 0.22 * bs, ry: h * 0.14 * bs },
    { k: 'ell', x: X(0), y: U(hy), rx: h * rH * 1.12, ry: h * rH * 0.96 },
  ];
  if (b.tufts > 0) for (const s of [-1, 1]) {
    const t = b.tufts;
    body.push({ k: 'poly', pts: px([s * rH * 0.3, hy + rH * 0.8, s * rH * 0.95, hy + rH * 0.55, s * rH * 0.98, hy + rH * (0.75 + 0.75 * t), s * rH * 0.72, hy + rH * (0.8 + 0.45 * t)]) });
  }
  blob(ctx, B, plume, body, { h, formK: 0.4, spread: 0.8, creases: [
    { x0: X(-rH * 0.8), y0: U(hy - rH * 0.85), x1: X(rH * 0.8), y1: U(hy - rH * 0.85), r: h * 0.02, a: 0.2 },   // the head into the shoulders
  ] });

  // ---- the breast: pale, streaked above and barred below.
  patch(ctx, B, pale, [{ k: 'ell', x: X(0), y: U(by + 0.28 * bs), rx: h * 0.17 * bs, ry: h * 0.25 * bs }], { alpha: 0.75, feather: 0.45 });
  if (b.bars > 0) {
    if (h >= 30) {
      const lw = Math.max(1, h * 0.01);
      for (let i = -2; i <= 2; i++) softLine(ctx, B, px([i * 0.055 * bs, by + 0.46 * bs, i * 0.06 * bs, by + 0.36 * bs]), bar, lw, 0.6 * b.bars);
      for (let k = 0; k < 4; k++) {
        const yy = by + (0.28 - k * 0.065) * bs, w = 0.13 * bs * (1 - k * 0.12);
        softLine(ctx, B, px([-w, yy + 0.01, -w * 0.4, yy - 0.008, w * 0.1, yy + 0.008, w * 0.6, yy - 0.006, w, yy + 0.01]), bar, lw, 0.5 * b.bars);
      }
    } else patch(ctx, B, bar, [{ k: 'ell', x: X(0), y: U(by + 0.2 * bs), rx: h * 0.12 * bs, ry: h * 0.1 * bs }], { alpha: 0.3 * b.bars, feather: 0.6 });
  }

  // ---- the facial disc: two pale lobes about the eyes, rimmed dark, a dark V between them.
  const ey = hy + rH * 0.05, ex = rH * 0.42;
  patch(ctx, B, mix(pale, shade('#f4ead4', tone), 0.4), [
    { k: 'ell', x: X(-ex), y: U(ey), rx: h * rH * 0.52 * b.face, ry: h * rH * 0.56 * b.face },
    { k: 'ell', x: X(ex), y: U(ey), rx: h * rH * 0.52 * b.face, ry: h * rH * 0.56 * b.face },
  ], { alpha: 0.8 * b.face, feather: 0.3 });
  if (h >= 30) softLine(ctx, B, px([-rH * 0.95, hy + rH * 0.2, -rH * 0.85, hy - rH * 0.5, -rH * 0.3, hy - rH * 0.75, 0, hy - rH * 0.55, rH * 0.3, hy - rH * 0.75, rH * 0.85, hy - rH * 0.5, rH * 0.95, hy + rH * 0.2]), far, Math.max(1, h * 0.012), 0.6);
  softLine(ctx, B, px([-rH * 0.62, hy + rH * 0.52, 0, hy + rH * 0.12, rH * 0.62, hy + rH * 0.52]), far, Math.max(1, h * 0.016), 0.65);

  // ---- the bill: small, hooked, pointing down between the eyes.
  {
    const bl = 0.17 * b.bill, bw = 0.035 * Math.sqrt(b.bill) + 0.012, top = hy - rH * 0.05;
    const pts = [-bw, top, bw, top, bw * 0.4, top - bl * 0.8, 0, top - bl - b.hook * bl * 0.3, -bw * 0.4, top - bl * 0.8];
    blob(ctx, B, horn, [{ k: 'poly', pts: px(pts) }], { h, form: false });
  }

  // ---- the eyes: big, orange and staring; shut for a moment now and then.
  const er = rH * 0.24 * h;
  for (const s of [-1, 1]) {
    if (blink) softLine(ctx, B, px([s * ex - rH * 0.22, ey, s * ex + rH * 0.22, ey]), plume, Math.max(1, er * 0.5), 0.9);
    else eye(ctx, X(s * ex), U(ey), er, eyeCol);
  }
}
