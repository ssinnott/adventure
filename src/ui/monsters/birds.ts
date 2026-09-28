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
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { mix, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['crow'];

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
  /** 0 a profile; toward 1 the head turns to the party behind a pale facial disc with both eyes (the owl). */
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
}
const CROW: Build = { body: 1, neck: 1, head: 1, face: 0, bill: 1, hook: 0, leg: 1, wing: 1, broad: 1, tail: 1, wedge: 0.3, ruff: 0.35, bare: 0 };

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  bird(ctx, x, y, h, p, CROW);
};

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
  const ht = f % 120, hop = ht < 20 ? Math.sin(ht / 20 * Math.PI) : 0;
  const ft = (f + 64) % 96, flick = ft < 16 ? Math.sin(ft / 16 * Math.PI) : 0;
  const L = 0.2 * b.leg, by = L + hop * 0.07 + p.breathe * 0.004, feet = hop * 0.03;

  const plume = p.base, far = p.dark;
  const sheen = shade('#5a68b0', tone);
  const horn = shade('#1c1a20', tone);
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
  blob(ctx, B, shade(horn, 0.85), farLeg, { h, formK: 0.3 });
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
    ]) }], { h, formK: 0.3, gloss: 0.15 });
    if (h >= 40) softLine(ctx, B, px([rx + d[0] * tl * 0.2, ry + d[1] * tl * 0.2, tx + d[0] * w * 0.8, ty + d[1] * w * 0.8]), plume, Math.max(1, h * 0.008), 0.5);
  }

  // ---- the near leg, scaled horn, under the belly feathers.
  const nearLeg: Part[] = [];
  leg(0, nearLeg);
  blob(ctx, B, horn, nearLeg, { h, formK: 0.3 });

  // ---- the plumage: body, breast, belly, the feathered thigh, neck and head, ONE mass.
  const bare = b.bare > 0;
  const body: Part[] = [
    { k: 'ell', x: X(-0.04), y: U(by + 0.22 * bs), rx: h * 0.32 * bs, ry: h * 0.16 * bs, rot: -0.36 },
    { k: 'ell', x: X(0.12), y: U(by + 0.3 * bs), rx: h * 0.14 * bs, ry: h * 0.15 * bs },
    { k: 'ell', x: X(0.0), y: U(by + 0.1), rx: h * 0.07, ry: h * 0.06 },
    { k: 'cap', x0: X(0.15), y0: U(by + 0.36 * bs), x1: X(hx - rH * 0.2), y1: U(hy - rH * 0.3), r0: h * 0.12 * bs, r1: h * rH * 0.78 },
  ];
  if (!bare) body.push({ k: 'ball', x: X(hx), y: U(hy), r: h * rH, gloss: 0.3 });
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

  // ---- the near wing, half open over the body.
  const nw = wingOutline(sx, sy, th, W, b.broad, ax, ay);
  blob(ctx, B, mix(plume, far, 0.15), [{ k: 'poly', pts: px(nw.pts) }], { h, formK: 0.35, spread: 0.8, gloss: 0.2 });
  // The sheen: blue-violet on the coverts and the nape, where a crow's black catches the light.
  patch(ctx, B, sheen, [
    { k: 'ell', x: X((sx + nw.wrist[0] + ax) / 3), y: U((sy + nw.wrist[1] + ay) / 3), rx: h * 0.1 * W, ry: h * 0.07 * W, rot: -0.9 },
  ], { alpha: 0.3, feather: 0.7 });
  if (!bare) patch(ctx, B, sheen, [{ k: 'ell', x: X(hx - rH * 0.35), y: U(hy + rH * 0.3), rx: h * rH * 0.55, ry: h * rH * 0.4, rot: -0.4 }], { alpha: 0.26, feather: 0.6 });
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
    blob(ctx, B, horn, [{ k: 'poly', pts: px(pts) }], { h, form: false, gloss: 0.35 });
    // The gape, and the bristles that cover a crow's nostrils.
    if (h >= 30) softLine(ctx, B, px([bx0 - rH * 0.1, byb - dp * 0.05, bx0 + bl * 0.7, byb - bl * 0.13]), horn, Math.max(1, h * 0.007), 0.7);
    if (!bare) patch(ctx, B, plume, [{ k: 'ell', x: X(bx0 + bl * 0.12), y: U(byb + dp * 0.25), rx: h * bl * 0.2, ry: h * dp * 0.35 }], { alpha: 0.8, feather: 0.4 });
  }

  // ---- the owl's face: a pale disc, the head turned to the party with both eyes on it.
  if (b.face > 0) patch(ctx, B, mix(p.light, shade('#e8dcc0', tone), 0.5), [{ k: 'ell', x: X(hx + rH * 0.1), y: U(hy), rx: h * rH * 0.85 * b.face, ry: h * rH * 0.95 * b.face }], { alpha: 0.6 * b.face, feather: 0.35 });

  // ---- the eye: bright and watching. In profile one; turned to the party, a pair.
  const er = rH * 0.2 * h;
  if (b.face >= 0.5) for (const s of [-1, 1]) eye(ctx, X(hx + rH * 0.1 + s * rH * 0.42), U(hy + rH * 0.15), er * 1.4, eyeCol);
  else eye(ctx, X(hx + rH * 0.22), U(hy + rH * 0.18), er, eyeCol);
}
