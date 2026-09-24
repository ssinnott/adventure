// The wild boar, painted: massive shoulders and neck with a stiff bristle crest along the spine, a
// back sloping down to a smaller rump, a big wedge head held low with a wet snout disc, two curved
// ivory tusks, a small mean red eye, small ears, short legs on cloven hooves and a paler belly and
// muzzle. Drawn back to front as sections that must each be nameable: far legs, the barrel with
// its crest, the wedge head over the shoulder, the near legs over the barrel, then the hooves. A
// boar's head IS its own form, so it carries its own contour even though it is the same hide.
// The four legs are four different drawings, never two mirrored pairs: the forelegs drop straight
// under the shoulder, the hind legs bend forward to the stifle and back to a sharp hock, and the
// far pair stands further back on the floor with its feet short of the ground line. The pale belly
// is a fur marking, so it follows the belly line, pinches at the brisket and dies away under the
// hind quarters with a ragged edge. Three-quarter view facing the party. Idle: the chest breathes,
// an ear flicks.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glossBall, softLine, patch } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['boar'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  boar(ctx, x, y, h, p);
};

/**
 * A wild boar's build is the opposite of the wolf's: the withers carry a heavy shoulder hump that
 * is the highest point on the animal, and the back slopes DOWN from there to a lower, narrower
 * rump. The head is a third of the body's length, hung low on almost no neck, so the snout rides
 * near the ground. Legs are short and slender under a deep barrel. Measured in units of h with the
 * height taken up from the ground line, the way the reference photographs read.
 */
function boar(ctx: CanvasRenderingContext2D, x0: number, y: number, h: number, p: Paint): void {
  const w = h * 1.5, br = p.breathe, tone = p.tone;
  // The head hangs out to the right; shift the mass left so the whole boar is centred on x0.
  const x = x0 - w * 0.08;
  const base = p.base, dark = p.dark, light = p.light;
  // Boars are dark. The hide leans on the light tone so the animal still reads on a dungeon floor,
  // and the grizzle (the pale-tipped bristles over the shoulder and flank) carries the contrast.
  const hide = mix(base, light, 0.5);
  const grizzle = mix(hide, shade('#cfc3ae', tone), 0.55);
  const paleHi = mix(light, shade('#d8c0a0', tone), 0.5), pale = mix(hide, paleHi, 0.5);
  const snout = mix(paleHi, shade('#c88078', tone), 0.55);
  const hoof = shade('#241a18', Math.max(0.6, tone)), ivory = shade('#f0e6cc', tone);
  const bristle = shade(mix(base, '#1a1210', 0.5), Math.max(0.55, tone));
  const ff = p.frame % 140, flick = ff < 9 ? Math.sin(ff / 9 * Math.PI) : 0;
  const b = br * h * 0.008;
  /** x in units of h from the mass centre. */
  const X = (u: number) => x + u * h;
  /** HEIGHT ABOVE THE GROUND LINE, in units of h. */
  const U = (u: number) => y - u * h;

  groundShadow(ctx, X(0.02), y + 1, w * 0.92);

  // Far legs: their own darker mass behind everything. Short, slender, with a joint apiece.
  blob(ctx, B, dark, [
    { k: 'tube', pts: [X(-0.10), U(0.50), X(-0.085), U(0.30), X(-0.075), U(0.11)], r0: h * 0.052, r1: h * 0.032 },
    { k: 'tube', pts: [X(-0.42), U(0.52), X(-0.355), U(0.34), X(-0.44), U(0.19), X(-0.40), U(0.11)], r0: h * 0.055, r1: h * 0.032 },
  ], { h, formK: 0.4 });

  // The tail: short, hanging, with a tuft on the end; its own small mass behind the rump.
  blob(ctx, B, shade(hide, 0.86), [
    { k: 'tube', pts: [X(-0.50), U(0.70), X(-0.545), U(0.60), X(-0.53) + flick * h * 0.01, U(0.50)], r0: h * 0.018, r1: h * 0.012 },
    { k: 'curve', pts: ring(X(-0.528), U(0.455), h * 0.032, h * 0.045, 7), wobble: 0.1, spiky: 0.25, seed: 27, sub: 2 },
  ], { h, formK: 0.5 });

  // The barrel: highest at the shoulder hump, sloping away to the rump, deep through the chest.
  const body: Part[] = [
    { k: 'curve', pts: [
      X(-0.50), U(0.62), X(-0.45), U(0.735), X(-0.22), U(0.79) + b, X(0.02), U(0.905) + b,
      X(0.22), U(0.86) + b, X(0.33), U(0.62), X(0.27), U(0.44),
      X(0.02), U(0.40), X(-0.24), U(0.42), X(-0.42), U(0.50),
    ], wobble: 0.035, spiky: 0.05, seed: 1, sub: 3 },
    // The shoulder hump itself, and the smaller haunch.
    { k: 'ell', x: X(0.04), y: U(0.72) + b, rx: h * 0.20, ry: h * 0.19, rot: -0.1 },
    { k: 'ell', x: X(-0.32), y: U(0.60), rx: h * 0.15, ry: h * 0.145 },
  ];
  // The bristle mane: tallest over the shoulder, dying away toward the rump. Drawn into the hide so
  // it is the animal's own outline that spikes, not a comb laid on top.
  {
    const n = 7, up: number[] = [], dn: number[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, cx = X(-0.44 + t * 0.66);
      const back = 0.735 + t * 0.175, crest = back + 0.05 + 0.09 * Math.pow(t, 1.4);
      up.push(cx, U(crest) + b); dn.unshift(cx, U(back - 0.03) + b);
    }
    body.push({ k: 'curve', pts: up.concat(dn), wobble: 0.09, spiky: 0.26, seed: 2, sub: 3 });
  }
  // Near legs: a thigh or shoulder, a joint, then a clearly thinner shank.
  for (const [hipX, hipU, midX, midU, kneeX, kneeU, footX] of [
    [0.16, 0.52, 0.17, 0.32, 0.175, 0.16, 0.18],
    [-0.30, 0.55, -0.235, 0.36, -0.335, 0.20, -0.29],
  ]) {
    body.push({ k: 'tube', pts: [X(hipX), U(hipU), X(midX), U(midU), X(kneeX), U(kneeU), X(footX), U(0.105)], r0: h * 0.062, r1: h * 0.034 });
  }
  blob(ctx, B, hide, body, { h, tex: 'bristle', seed: 3, amount: 0.5, formK: 0.5, spread: 0.9, creases: [
    { x0: X(0.19), y0: U(0.85), x1: X(0.17), y1: U(0.50), r: h * 0.03, a: 0.3 },     // behind the shoulder
    { x0: X(-0.21), y0: U(0.76), x1: X(-0.19), y1: U(0.48), r: h * 0.028, a: 0.26 }, // in front of the haunch
    { x0: X(-0.30), y0: U(0.44), x1: X(0.06), y1: U(0.42), r: h * 0.03, a: 0.22 },   // the belly
    { x0: X(-0.245), y0: U(0.36), x1: X(-0.17), y1: U(0.355), r: h * 0.02, a: 0.3 }, // the hock
  ] });

  // Grizzle: the pale-tipped bristles a boar carries over the shoulder and down the flank, which is
  // the only real value break on an otherwise very dark animal.
  patch(ctx, B, grizzle, [{ k: 'curve', pts: [
    X(-0.30), U(0.66), X(-0.10), U(0.76), X(0.08), U(0.82), X(0.22), U(0.74),
    X(0.16), U(0.56), X(-0.06), U(0.54), X(-0.26), U(0.55),
  ], wobble: 0.1, spiky: 0.12, seed: 45, sub: 2 }], { alpha: 0.36, feather: 0.75 });
  patch(ctx, B, pale, [{ k: 'ell', x: X(-0.04), y: U(0.45), rx: h * 0.24, ry: h * 0.055, rot: 0.02 }], { alpha: 0.4, feather: 0.7 });

  // The head: its own wedge, hung low off the shoulder with the snout near the ground.
  const sx = X(0.72), sy = U(0.40);
  // The FAR tusk, drawn BEFORE the head so the muzzle occludes it: in profile that tusk is on the
  // other side of the animal's face, and the only part of it a viewer can see is the tip clearing
  // the top line of the snout. A head seen side on is thin, so the far tusk sits almost directly
  // behind the near one -- a small offset, just enough to read as depth. Set further back up the
  // muzzle it looked like a separate tooth growing out of the animal's cheek.
  blob(ctx, B, shade(ivory, 0.72), [{ k: 'tube', pts: [X(0.578), U(0.30), X(0.644), U(0.40), X(0.624), U(0.62)], r0: h * 0.02, r1: h * 0.0075, gloss: 0.25 }], { h, formK: 0.5 });
  blob(ctx, B, shade(hide, 0.95), [
    { k: 'curve', pts: [
      X(0.22), U(0.86), X(0.40), U(0.80), X(0.55), U(0.63), X(0.68), U(0.48),
      sx + h * 0.06, U(0.42), sx + h * 0.05, U(0.30), X(0.60), U(0.29),
      X(0.44), U(0.34), X(0.30), U(0.46), X(0.21), U(0.60),
    ], wobble: 0.035, spiky: 0.04, seed: 11, sub: 3 },
  ], { h, tex: 'bristle', seed: 12, amount: 0.4, formK: 0.5, spread: 0.85, creases: [
    { x0: X(0.26), y0: U(0.78), x1: X(0.28), y1: U(0.52), r: h * 0.028, a: 0.28 },   // cheek into the neck
  ] });
  // The ears: big, upright and tufted, high on the back of the skull. A boar's ears are most of
  // what tells it apart from a pig at a glance.
  blob(ctx, B, shade(hide, 0.88), [
    { k: 'curve', pts: [X(0.245), U(0.855), X(0.225), U(0.985) + flick * h * 0.02, X(0.315), U(0.945), X(0.33), U(0.845)], wobble: 0.09, spiky: 0.22, seed: 13, sub: 2 },
    { k: 'curve', pts: [X(0.355), U(0.83), X(0.37), U(0.95) + flick * h * 0.015, X(0.45), U(0.90), X(0.44), U(0.80)], wobble: 0.09, spiky: 0.22, seed: 14, sub: 2 },
  ], { h, formK: 0.55 });
  softLine(ctx, B, [X(0.27), U(0.87), X(0.28), U(0.94)], hide, Math.max(1, h * 0.018), 0.45);

  // The pale muzzle ring, the wet snout disc and its nostrils.
  patch(ctx, B, pale, [{ k: 'cap', x0: X(0.56), y0: U(0.40), x1: sx + h * 0.02, y1: U(0.365), r0: h * 0.055, r1: h * 0.05 }], { alpha: 0.5, feather: 0.6 });
  glossBall(ctx, B, sx + h * 0.04, sy - h * 0.025, h * 0.068, snout, { gloss: 0.4 });
  if (!B.override) {
    ctx.fillStyle = B.col(shade('#20161a', tone));
    const nr = Math.max(1, Math.round(h * 0.016));
    ctx.fillRect(Math.round(sx + h * 0.025), Math.round(sy - h * 0.045), nr, nr + 1);
    ctx.fillRect(Math.round(sx + h * 0.065), Math.round(sy - h * 0.04), nr, nr + 1);
  }
  softLine(ctx, B, [X(0.50), U(0.365), X(0.665), U(0.335)], hide, Math.max(1, h * 0.02), 0.5);
  // The NEAR tusk over everything, longer and heavier. Both curve up and BACK toward the eye,
  // which is the way they actually grow; swept forward the tips crossed over the snout disc.
  blob(ctx, B, ivory, [{ k: 'tube', pts: [X(0.60), U(0.295), X(0.668), U(0.40), X(0.648), U(0.585)], r0: h * 0.027, r1: h * 0.008, gloss: 0.5 }], { h, formK: 0.6 });
  // A small dark eye set high and far back, under a heavy brow.
  const ex = X(0.42), ey = U(0.66);
  softLine(ctx, B, [ex - h * 0.03, ey + h * 0.018, ex + h * 0.04, ey - h * 0.004], shade(hide, 0.55), Math.max(1, h * 0.028), 0.55);
  eye(ctx, ex, ey, h * 0.026, shade('#2a1c18', Math.max(0.7, tone)), false);
  if (h > 46 && !B.override) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(Math.round(ex - h * 0.012), Math.round(ey - h * 0.012), 1, 1); }

  // Hooves: cloven wedges, narrower than the shank above them, all four as one mass on top.
  const hooves: Part[] = [];
  for (const [hxc, top] of [[X(-0.075), U(0.115)], [X(-0.40), U(0.115)], [X(0.18), U(0.12)], [X(-0.29), U(0.12)]]) {
    hooves.push({ k: 'poly', pts: [
      hxc - h * 0.036, top, hxc + h * 0.036, top, hxc + h * 0.05, y, hxc + h * 0.012, y, hxc, y - h * 0.03, hxc - h * 0.012, y, hxc - h * 0.05, y,
    ] });
  }
  blob(ctx, B, hoof, hooves, { h, formK: 0.4 });
  void bristle;
}

/** A ring of n points around (cx, cy), the raw contour a 'curve' part lumps further. */
function ring(cx: number, cy: number, rx: number, ry: number, n: number): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}
