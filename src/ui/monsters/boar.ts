// The wild boar, painted: massive shoulders and neck with a stiff bristle crest along the spine, a
// back sloping down to a smaller rump, a big wedge head held low with a wet snout disc, two curved
// ivory tusks, a small mean red eye, small ears, short legs on cloven hooves and a paler belly and
// muzzle. Shoulders, neck, body, head, ears and near legs are ONE bristled mass (blob); the crest
// is a spiky curve merged into its top edge; the far legs a darker mass behind; the hooves, tusks
// and snout their own materials. Three-quarter view facing the party. Idle: the chest breathes, an
// ear flicks.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { blob, glossBall, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['boar'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  boar(ctx, x, y, h, p);
};

/** Scratch for the crest strip (28 numbers), filled in place each frame so nothing is allocated. */
const CREST: number[] = new Array<number>(28).fill(0);

function boar(ctx: CanvasRenderingContext2D, x0: number, y: number, h: number, p: Paint): void {
  const w = h * 1.5, br = p.breathe, tone = p.tone;
  // The head hangs out to the right; shift the mass left so the whole boar is centred on x0.
  const x = x0 - w * 0.1;
  const base = p.base, dark = p.dark, light = p.light;
  // The hide leans on the light tone: the tint is a dark brown and the beast must read on a dark floor.
  const hide = mix(base, light, 0.6);
  const paleHi = mix(light, shade('#d8c0a0', tone), 0.5), pale = mix(hide, paleHi, 0.5), snout = mix(paleHi, shade('#c88078', tone), 0.55);
  const hoof = shade('#2c1e1c', Math.max(0.6, tone)), ivory = shade('#f0e6cc', tone), red = shade('#e04428', Math.max(0.65, tone));
  const ff = p.frame % 140, flick = ff < 9 ? Math.sin(ff / 9 * Math.PI) : 0;
  const b = br * h * 0.008;

  groundShadow(ctx, x, y + 1, w * 0.95);
  // Far legs, far ear and the curled tail: a darker mass behind the body.
  blob(ctx, B, dark, [
    { k: 'cap', x0: x - w * 0.33, y0: y - h * 0.42, x1: x - w * 0.34, y1: y - h * 0.09, r0: h * 0.07, r1: h * 0.055 },
    { k: 'cap', x0: x + w * 0.13, y0: y - h * 0.44, x1: x + w * 0.14, y1: y - h * 0.09, r0: h * 0.075, r1: h * 0.06 },
    { k: 'tube', pts: [x - w * 0.42, y - h * 0.58, x - w * 0.52, y - h * 0.66, x - w * 0.55, y - h * 0.52, x - w * 0.49, y - h * 0.46], r0: h * 0.03, r1: h * 0.015 },
    { k: 'curve', pts: [x + w * 0.13, y - h * 0.8, x + w * 0.15, y - h * 0.98, x + w * 0.25, y - h * 0.84], wobble: 0.05, seed: 8, sub: 2 },
  ], { h, formK: 0.4 });

  // The crest: a strip along the spine, spiky on its top edge, merged into the hide.
  {
    const n = 6; let k = 0;
    for (let i = 0; i <= n; i++) {
      const t = i / n; CREST[k++] = x - w * 0.4 + t * w * 0.6; CREST[k++] = y - h * (0.54 + Math.sin(t * Math.PI * 0.5) * 0.4) + b;
    }
    for (let i = n; i >= 0; i--) {
      const t = i / n; CREST[k++] = x - w * 0.38 + t * w * 0.56; CREST[k++] = y - h * (0.42 + Math.sin(t * Math.PI * 0.5) * 0.38) + b;
    }
  }
  const sx = x + w * 0.62, sy = y - h * 0.3;
  const chest = x + w * 0.42 + b * 2;
  const hideParts: Part[] = [
    { k: 'curve', pts: CREST, wobble: 0.03, spiky: 0.24, seed: 2, sub: 3 },
    { k: 'curve', pts: [
      x - w * 0.42, y - h * 0.56, x - w * 0.24, y - h * 0.74 + b, x - w * 0.02, y - h * 0.9 + b, x + w * 0.18, y - h * 0.97 + b,
      x + w * 0.36, y - h * 0.82 + b, chest, y - h * 0.55, chest - w * 0.04, y - h * 0.34, x + w * 0.2, y - h * 0.22 - b,
      x - w * 0.1, y - h * 0.2 - b, x - w * 0.32, y - h * 0.26, x - w * 0.48, y - h * 0.42,
    ], wobble: 0.035, spiky: 0.025, seed: 1, sub: 3 },
    { k: 'ball', x: x + w * 0.16, y: y - h * 0.62 + b, r: h * 0.33 },
    { k: 'ball', x: x - w * 0.26, y: y - h * 0.46, r: h * 0.27 },
    { k: 'curve', pts: [x + w * 0.25, y - h * 0.78, x + w * 0.3 + flick * h * 0.08, y - h * 1.02 + flick * h * 0.05, x + w * 0.41, y - h * 0.8], wobble: 0.05, seed: 9, sub: 2 },
    { k: 'cap', x0: x + w * 0.3, y0: y - h * 0.62, x1: sx, y1: sy, r0: h * 0.27, r1: h * 0.12 },
    { k: 'cap', x0: x - w * 0.17, y0: y - h * 0.4, x1: x - w * 0.17, y1: y - h * 0.09, r0: h * 0.09, r1: h * 0.07 },
    { k: 'cap', x0: x + w * 0.3, y0: y - h * 0.44, x1: x + w * 0.31, y1: y - h * 0.09, r0: h * 0.095, r1: h * 0.075 },
  ];
  blob(ctx, B, hide, hideParts, { h, tex: 'fur', seed: 3, amount: 0.6, formK: 0.55, spread: 0.9, creases: [
    { x0: x + w * 0.3, y0: y - h * 0.84 + b, x1: x + w * 0.27, y1: y - h * 0.44, r: h * 0.035, a: 0.3 },
    { x0: x - w * 0.3, y0: y - h * 0.52, x1: x - w * 0.18, y1: y - h * 0.34, r: h * 0.03, a: 0.28 },
    { x0: x - w * 0.24, y0: y - h * 0.34, x1: x - w * 0.1, y1: y - h * 0.3, r: h * 0.03, a: 0.25 },
    { x0: x + w * 0.22, y0: y - h * 0.36, x1: x + w * 0.34, y1: y - h * 0.32, r: h * 0.03, a: 0.25 },
    { x0: x + w * 0.42, y0: y - h * 0.34, x1: x + w * 0.56, y1: y - h * 0.26, r: h * 0.025, a: 0.25 },
  ] });
  // Far tusk, from behind the snout.
  blob(ctx, B, shade(ivory, 0.85), [{ k: 'tube', pts: [x + w * 0.48, y - h * 0.3, x + w * 0.53, y - h * 0.3, x + w * 0.545, y - h * 0.46], r0: h * 0.028, r1: h * 0.01, gloss: 0.3 }], { h, formK: 0.5 });
  // Pale belly and muzzle, inside the hide, no line.
  blob(ctx, B, pale, [
    { k: 'ell', x: x + w * 0.02, y: y - h * 0.27, rx: w * 0.3, ry: h * 0.085, rot: 0.03 },
    { k: 'cap', x0: x + w * 0.42, y0: y - h * 0.4, x1: sx + w * 0.01, y1: sy + h * 0.02, r0: h * 0.12, r1: h * 0.09 },
  ], { outline: false, formK: 0.3 });
  // Hooves: the far pair sits clear of the hide, so all four are one mass on top.
  blob(ctx, B, hoof, [
    { k: 'poly', pts: [x - w * 0.4, y - h * 0.11, x - w * 0.27, y - h * 0.11, x - w * 0.265, y - h * 0.02, x - w * 0.405, y - h * 0.02] },
    { k: 'poly', pts: [x + w * 0.07, y - h * 0.11, x + w * 0.21, y - h * 0.11, x + w * 0.215, y - h * 0.02, x + w * 0.065, y - h * 0.02] },
    { k: 'poly', pts: [x - w * 0.25, y - h * 0.11, x - w * 0.09, y - h * 0.11, x - w * 0.085, y, x - w * 0.255, y] },
    { k: 'poly', pts: [x + w * 0.22, y - h * 0.11, x + w * 0.4, y - h * 0.11, x + w * 0.405, y, x + w * 0.215, y] },
  ], { h, formK: 0.35 });
  if (h > 30) { ctx.fillStyle = B.col(shade(hoof, 0.6)); for (const hx of [x - w * 0.17, x + w * 0.31]) ctx.fillRect(Math.round(hx), Math.round(y - h * 0.08), 1, Math.round(h * 0.08)); }
  // The wet snout disc with its nostrils.
  glossBall(ctx, B, sx + h * 0.06, sy, h * 0.11, snout, { gloss: 0.35 });
  if (!B.override) {
    ctx.fillStyle = hoof;
    const nr = Math.max(1, Math.round(h * 0.03));
    ctx.fillRect(Math.round(sx + h * 0.04), Math.round(sy - h * 0.02), nr, nr + 1);
    ctx.fillRect(Math.round(sx + h * 0.1), Math.round(sy - h * 0.02), nr, nr + 1);
  }
  // Near tusk sweeping up past the snout from the lower jaw: glossy ivory.
  blob(ctx, B, ivory, [{ k: 'tube', pts: [x + w * 0.52, y - h * 0.2, x + w * 0.62, y - h * 0.18, x + w * 0.65, y - h * 0.32, x + w * 0.64, y - h * 0.45], r0: h * 0.038, r1: h * 0.012, gloss: 0.5 }], { h, formK: 0.6 });
  // Mouth fold, mean little red eye under a heavy brow, the inner ear.
  softLine(ctx, B, [x + w * 0.44, y - h * 0.24, x + w * 0.56, y - h * 0.2], hide, Math.max(1, h * 0.025), 0.55);
  eye(ctx, x + w * 0.4, y - h * 0.62, h * 0.045, red);
  softLine(ctx, B, [x + w * 0.33, y - h * 0.72, x + w * 0.45, y - h * 0.67], hide, Math.max(1, h * 0.03), 0.7);
  softLine(ctx, B, [x + w * 0.31, y - h * 0.8, x + w * 0.31 + flick * h * 0.06, y - h * 0.96 + flick * h * 0.04], hide, Math.max(1, h * 0.035), 0.5);
}
