// The giants of the Stair: the Stair Giant first, and on his frame the Stair-king, older and broader
// and crowned in the toll. A man as tall as a house, standing as a man stands, upright and his weight
// on both feet: nothing of the ogre's stoop or the troll's knuckles on the ground. He wears his
// working clothes kept four hundred years: a long coat of felted wool belted at the waist and split
// from the belt to the hem, a patch let into its skirt, a fleece collar, leggings bound with straps
// and heavy boots, and on the shoulder a worn round badge whose mark is long gone. His head is small
// for his height and bowed to look down at the company, the hair long and iron-grey and the beard on
// his chest, the face weathered and the eyes deep under the brow, in no hurry. His near arm is held
// out from the elbow, the hand open and cupped at the end of it, the thumb and the fingers turned up
// for the toll: the arm is the bar across the road. His far arm hangs, the hand bigger than a man's
// head. Drawn as masses: the far arm a step darker, the legs and the boots, the coat in one blob, the
// near sleeve and the hand in front of it, then the head, the hair and the beard. A tall one, size 2:
// drawn inside the tall boss's crown (TALL_REACH, src/ui/grouplabels.ts). Idle: he breathes, slow,
// and the held-out hand lifts a little and settles.
//
// The Stair-king: he has taken the toll here since before Helmstow. The frame broader by an eighth
// and drawn to the crown's limit, so he stands over his giants at their size, his head sunk lower
// between his shoulders under a mantle of dark fur that falls behind him to the knee. His hair and
// beard are white, the beard to his belt. The toll is his crown: coin of every age set on edge in a
// band at his brow, gold and silver either side and at the front the oldest, dull and with no face;
// more of it studs his belt. Idle: he breathes, the hand weighs, and the beard stirs.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow, stroke } from './common.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';
import { blob, patch, softLine } from './gloss.ts';
import type { Part } from './gloss.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['stair_giant', 'stair_king'];

/**
 * What a giant is made of, as the Stair Giant's numbers, so another giant is a Build and a colouring
 * (MONSTERS §11): his height in the frame, his breadth, his bow, his beard, his cloth and his crown.
 */
interface Build {
  /** Drawn height, of the frame's: the crown of his head stands at this share of it, inside TALL_REACH. */
  reach: number;
  /** Breadth through the shoulders and the coat, and the reach of the arms (1 = the Stair Giant). */
  wide: number;
  /** How far the head sinks between the shoulders, bowed with age, in heights. */
  bow: number;
  /** The beard's foot, in heights up from the ground. */
  beard: number;
  /** Hair grown long behind, to the shoulders (the king's), or cropped at the ears. */
  mane: boolean;
  skin: string; hair: string; legs: string; boot: string; strap: string; belt: string;
  /** The fleece of the collar, or the fur of the mantle. */
  fleece: string;
  /** A mantle of fur over the shoulders, falling behind to the knee, in place of the collar. */
  mantle: boolean;
  /** The toll worn: coin set on edge in a band at the brow, and studding the belt. */
  coins: boolean;
}
const GIANT: Build = {
  reach: 0.745, wide: 1, bow: 0, beard: 0.77, mane: false,
  skin: '#b07e5e', hair: '#5a524b', legs: '#4c4642', boot: '#3b2f27', strap: '#806c52', belt: '#3e2c20', fleece: '#cfc1a0',
  mantle: false, coins: false,
};
const KING: Build = {
  reach: 0.81, wide: 1.12, bow: 0.014, beard: 0.6, mane: true,
  skin: '#aa7c62', hair: '#e6e2da', legs: '#3e3834', boot: '#33291f', strap: '#6e5e48', belt: '#2e2018', fleece: '#3c3129',
  mantle: true, coins: true,
};

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  const g = kind === 'stair_king' ? KING : GIANT;
  giant(ctx, x, y, h * g.reach, p, g);
};

const GOLD = '#d8b04c', SILVER = '#c9c7bd', OLD = '#8c7a5a', IRON = '#7e8188';

/** A coin on edge or on a belt: a disc in its metal, outlined, its lit rim; `face` false for the oldest. */
function coin(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, hex: string, face = true): void {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = B.col(hex); ctx.fill();
  ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = Math.max(0.8, r * 0.3); ctx.stroke();
  if (B.override || r < 1.6) return;
  ctx.fillStyle = rgba(mix(hex, '#ffffff', 0.55), 0.8);
  ctx.beginPath(); ctx.arc(cx - r * 0.3, cy - r * 0.32, r * 0.34, 0, Math.PI * 2); ctx.fill();
  if (face) { ctx.fillStyle = rgba(shade(hex, 0.6), 0.7); ctx.beginPath(); ctx.arc(cx + r * 0.12, cy + r * 0.1, r * 0.3, 0, Math.PI * 2); ctx.fill(); }
}

/**
 * A giant, in units of `H` (his drawn height) up from the ground line: the crown of his head at 1,
 * the shoulders at 0.84, the belt at 0.6, the coat's hem at 0.23 and the boots on the ground. x runs
 * toward the near side, where the hand is held out, and is broadened by the Build's `wide`.
 */
function giant(ctx: CanvasRenderingContext2D, x: number, y: number, H: number, p: Paint, g: Build): void {
  const w = g.wide, tone = p.tone;
  const X = (k: number): number => x + H * k * w, Y = (k: number): number => y - H * k;
  const b = p.breathe * H * 0.005;                     // a slow breath: the shoulders and the head rise
  const lift = Math.sin(p.frame / 37) * H * 0.004;     // the held-out hand, weighing what is not in it yet
  const skin = shade(g.skin, tone), hair = shade(g.hair, tone), legs = shade(g.legs, tone), boot = shade(g.boot, tone);
  const strap = shade(g.strap, tone), belt = shade(g.belt, tone), fleece = shade(g.fleece, tone);
  const farHex = shade(p.dark, 0.82), farSkin = shade(skin, 0.8);
  const sy = 0.838 + g.bow;                            // the top of the shoulders, by the neck
  const hr = H * 0.054 * (1 + (w - 1) * 0.4);          // half the head's breadth
  const hx = x + H * 0.004, hy = y - H * (1 - g.bow) + hr * 1.3 - b;   // the head's centre, its crown at 1 less the bow
  // The face and the hair are laid out in head units around (hx, hy), so nothing drifts off the skull:
  // P maps (right, down) in those units to the canvas.
  const P = (px: number, py: number): [number, number] => [hx + px * hr, hy + py * hr];
  const M = (a: readonly number[]): number[] => { const o: number[] = []; for (let i = 0; i < a.length; i += 2) o.push(...P(a[i], a[i + 1])); return o; };

  groundShadow(ctx, x + H * 0.03, y + 1, H * 0.5 * w);

  // 1. The king's mantle, behind him: dark fur from the shoulders to the knee, showing either side.
  if (g.mantle) blob(ctx, B, shade(fleece, 0.84), [
    { k: 'curve', pts: [
      X(-0.1), Y(sy + 0.02) - b, X(-0.212), Y(sy - 0.02) - b, X(-0.25), Y(0.66), X(-0.262), Y(0.46), X(-0.25), Y(0.29),
      X(-0.12), Y(0.27), X(0.12), Y(0.27), X(0.25), Y(0.29), X(0.262), Y(0.46), X(0.25), Y(0.66), X(0.212), Y(sy - 0.02) - b,
      X(0.1), Y(sy + 0.02) - b,
    ], wobble: 0.02, spiky: 0.018, seed: 61, sub: 3 },
  ], { h: H, tex: 'fur', seed: 62, amount: 0.6, formK: 0.3 });

  // 2. The far arm, hanging: the sleeve a step darker than the coat, its cuff turned back, and the
  //    hand, a mitten of a hand with the thumb toward the company and the fingers loose.
  blob(ctx, B, farHex, [
    { k: 'tube', pts: [X(-0.165), Y(sy - 0.042) - b, X(-0.206), Y(0.615), X(-0.202), Y(0.48)], r0: H * 0.062 * w, r1: H * 0.047 * w, wobble: 0.03, seed: 3 },
  ], { h: H, tex: 'folds', seed: 4, amount: 0.4, formK: 0.45, creases: [
    { x0: X(-0.19), y0: Y(0.64), x1: X(-0.212), y1: Y(0.595), r: H * 0.012, a: 0.4 },
  ] });
  blob(ctx, B, shade(farHex, 0.9), [{ k: 'ell', x: X(-0.202), y: Y(0.474), rx: H * 0.053 * w, ry: H * 0.021, rot: 0.04 }], { h: H, formK: 0.4 });
  const F = (dx: number, dy: number): [number, number] => [X(-0.202) + dx * H * w * 1.25, Y(0.466) - dy * H * 1.25];
  blob(ctx, B, farSkin, [
    { k: 'curve', pts: [...F(-0.022, 0.006), ...F(0.026, 0.006), ...F(0.034, -0.036), ...F(0.028, -0.092), ...F(0.012, -0.116), ...F(-0.013, -0.112), ...F(-0.03, -0.078), ...F(-0.031, -0.028)], wobble: 0.03, seed: 5, sub: 2 },
    { k: 'tube', pts: [...F(0.026, -0.006), ...F(0.042, -0.04), ...F(0.038, -0.068)], r0: H * 0.019, r1: H * 0.014 },
  ], { h: H, formK: 0.5, creases: [
    { x0: F(-0.008, -0.068)[0], y0: F(-0.008, -0.068)[1], x1: F(-0.01, -0.102)[0], y1: F(-0.01, -0.102)[1], r: H * 0.005, a: 0.5 },
    { x0: F(0.007, -0.071)[0], y0: F(0.007, -0.071)[1], x1: F(0.005, -0.106)[0], y1: F(0.005, -0.106)[1], r: H * 0.005, a: 0.5 },
  ] });

  // 3. The legs below the coat, bound with straps from the boot to the knee, and the boots: heavy
  //    hide, broad in the sole, the toes turned out.
  for (const s of [-1, 1] as const) {
    const lx = s < 0 ? -0.077 : 0.08, near = s > 0;
    blob(ctx, B, near ? legs : shade(legs, 0.84), [
      { k: 'tube', pts: [X(lx), Y(0.4), X(lx + s * 0.005), Y(0.24), X(lx + s * 0.008), Y(0.07)], r0: H * 0.052 * w, r1: H * 0.041 * w, wobble: 0.03, seed: 7 + s },
    ], { h: H, formK: 0.4, creases: [
      { x0: X(lx - 0.02), y0: Y(0.236), x1: X(lx + 0.02), y1: Y(0.232), r: H * 0.006, a: 0.35 },
    ] });
    for (const sy0 of [0.1, 0.145, 0.19]) stroke(ctx, [X(lx + s * 0.005 - 0.04), Y(sy0 + 0.018), X(lx + s * 0.005 + 0.04), Y(sy0 - 0.012)], near ? strap : shade(strap, 0.84), Math.max(1, H * 0.009));
    blob(ctx, B, near ? boot : shade(boot, 0.84), [
      { k: 'curve', pts: [
        X(lx - s * 0.03), Y(0.092), X(lx + s * 0.05), Y(0.092), X(lx + s * 0.062), Y(0.046), X(lx + s * 0.082), Y(0.016),
        X(lx + s * 0.068), Y(-0.003), X(lx - s * 0.03), Y(-0.003), X(lx - s * 0.042), Y(0.03),
      ], wobble: 0.04, seed: 9 + s, sub: 2 },
    ], { h: H, formK: 0.45, creases: [
      { x0: X(lx - s * 0.03), y0: Y(0.012), x1: X(lx + s * 0.07), y1: Y(0.012), r: H * 0.005, a: 0.5 },
    ] });
    stroke(ctx, [X(lx - s * 0.032), Y(0.078), X(lx + s * 0.052), Y(0.078)], near ? strap : shade(strap, 0.84), Math.max(1, H * 0.01));
  }

  // 4. The hair behind, long, falling to the shoulders either side of the neck.
  if (g.mane) blob(ctx, B, shade(hair, 0.8), [
    { k: 'curve', pts: M([-1.06, -0.9, -1.22, 0.2, -1.4, 1.5, -1.3, 2.4, -0.6, 2.2, 0.6, 2.2, 1.3, 2.4, 1.4, 1.5, 1.22, 0.2, 1.06, -0.9]), wobble: 0.05, spiky: 0.02, seed: 11, sub: 3 },
  ], { h: H, tex: 'bristle', seed: 12, amount: 0.5, formK: 0.3 });

  // 5. The coat, one mass from the collar to the hem: square in the shoulder, drawn in at the belt,
  //    the skirt falling straight and split at the front.
  const coat: Part[] = [
    { k: 'curve', pts: [
      X(-0.05), Y(sy + 0.012) - b, X(-0.136), Y(sy) - b, X(-0.19), Y(sy - 0.03) - b, X(-0.202), Y(sy - 0.08) - b,
      X(-0.176), Y(0.71), X(-0.142), Y(0.62), X(-0.148), Y(0.52), X(-0.164), Y(0.41), X(-0.178), Y(0.302),
      X(-0.1), Y(0.29), X(-0.008), Y(0.298), X(0.006), Y(0.326), X(0.018), Y(0.298), X(0.1), Y(0.288), X(0.18), Y(0.3),
      X(0.166), Y(0.41), X(0.15), Y(0.52), X(0.144), Y(0.62), X(0.178), Y(0.71), X(0.204), Y(sy - 0.08) - b,
      X(0.192), Y(sy - 0.03) - b, X(0.138), Y(sy) - b, X(0.05), Y(sy + 0.012) - b,
    ], wobble: 0.012, seed: 13, sub: 3 },
  ];
  blob(ctx, B, p.base, coat, { h: H, tex: 'folds', seed: 14, amount: 0.5, formK: 0.4, creases: [
    { x0: X(-0.07), y0: Y(0.54), x1: X(-0.094), y1: Y(0.32), r: H * 0.008, a: 0.28 },
    { x0: X(0.086), y0: Y(0.54), x1: X(0.108), y1: Y(0.32), r: H * 0.008, a: 0.28 },
    { x0: X(-0.152), y0: Y(0.75), x1: X(-0.158), y1: Y(0.66), r: H * 0.012, a: 0.32 },
    { x0: X(0.15), y0: Y(0.75), x1: X(0.156), y1: Y(0.66), r: H * 0.012, a: 0.32 },
  ] });
  softLine(ctx, B, [X(0.004), Y(sy - 0.05) - b, X(0.008), Y(0.6)], p.dark, Math.max(1, H * 0.006), 0.5);
  softLine(ctx, B, [X(0.008), Y(0.58), X(0.012), Y(0.33)], p.dark, Math.max(1, H * 0.008), 0.6);
  // The patch let into the far skirt, in a cloth that was another colour once, and its stitches.
  const pc = shade(mix(p.base, g.strap, 0.45), 1.05);
  blob(ctx, B, pc, [{ k: 'poly', pts: [X(-0.136), Y(0.43), X(-0.08), Y(0.436), X(-0.077), Y(0.372), X(-0.132), Y(0.366)] }], { h: H, formK: 0.3 });
  if (!B.override && H >= 80) {
    ctx.strokeStyle = rgba(mix(pc, '#f0e6d0', 0.4), 0.55); ctx.lineWidth = Math.max(0.6, H * 0.003);
    for (let i = 0; i < 5; i++) {
      const t = (i + 0.5) / 5;
      ctx.beginPath(); ctx.moveTo(X(-0.132 + 0.052 * t), Y(0.44)); ctx.lineTo(X(-0.132 + 0.052 * t), Y(0.428)); ctx.stroke();
    }
  }

  // 6. The belt, broad leather, an iron ring at the buckle; the king's studded with the toll.
  blob(ctx, B, belt, [
    { k: 'curve', pts: [X(-0.148), Y(0.633), X(0.0), Y(0.624), X(0.15), Y(0.633), X(0.152), Y(0.586), X(0.0), Y(0.577), X(-0.15), Y(0.586)], wobble: 0.01, seed: 15, sub: 2 },
  ], { h: H, formK: 0.35 });
  ctx.strokeStyle = B.col(shade(IRON, tone)); ctx.lineWidth = Math.max(1.2, H * 0.008);
  ctx.beginPath(); ctx.ellipse(X(0.006), Y(0.605), H * 0.017 * w, H * 0.021, 0, 0, Math.PI * 2); ctx.stroke();
  if (g.coins) for (const [cx, hex] of [[-0.11, GOLD], [-0.064, SILVER], [0.072, GOLD], [0.118, SILVER]] as const) coin(ctx, X(cx), Y(0.605), H * 0.012, shade(hex, tone));

  // 7. The near arm, held out from the elbow: the sleeve from the shoulder down and out to the wrist,
  //    its cuff, and the worn badge on the shoulder.
  const el: [number, number] = [X(0.252), Y(0.648)];
  const wr: [number, number] = [X(0.338), Y(0.596) + lift];
  blob(ctx, B, shade(p.base, 1.04), [
    { k: 'tube', pts: [X(0.165), Y(sy - 0.042) - b, el[0], el[1], wr[0], wr[1]], r0: H * 0.062 * w, r1: H * 0.046 * w, wobble: 0.03, seed: 16 },
  ], { h: H, tex: 'folds', seed: 17, amount: 0.4, formK: 0.45, creases: [
    { x0: el[0] - H * 0.014, y0: el[1] - H * 0.014, x1: el[0] + H * 0.008, y1: el[1] + H * 0.004, r: H * 0.01, a: 0.42 },
  ] });
  blob(ctx, B, shade(p.base, 0.92), [{ k: 'ell', x: wr[0] - H * 0.004, y: wr[1], rx: H * 0.021 * w, ry: H * 0.05 * w, rot: 0.56 }], { h: H, formK: 0.4 });
  if (!g.mantle) {
    const [bx, by] = [X(0.186), Y(0.758) - b];
    patch(ctx, B, shade(p.dark, 0.8), [{ k: 'ball', x: bx, y: by, r: H * 0.017 }], { alpha: 0.85, feather: 0.2 });
    if (!B.override) {
      ctx.strokeStyle = rgba(p.light, 0.45); ctx.lineWidth = Math.max(0.7, H * 0.004);
      ctx.beginPath(); ctx.arc(bx, by, H * 0.009, 0, Math.PI * 2); ctx.stroke();
    }
  }

  // 8. The hand, open and held out: the palm edge on, the fingers together and turned up at its end,
  //    the thumb up by the wrist, and the hollow between them where the toll goes.
  const u = H * w * 1.3, v = H * 1.3, [ax, ay] = wr;
  blob(ctx, B, skin, [
    { k: 'cap', x0: ax + u * 0.006, y0: ay + v * 0.002, x1: ax + u * 0.07, y1: ay - v * 0.002, r0: v * 0.025, r1: v * 0.021 },
    { k: 'tube', pts: [ax + u * 0.066, ay - v * 0.002, ax + u * 0.096, ay - v * 0.01, ax + u * 0.11, ay - v * 0.034], r0: v * 0.019, r1: v * 0.013 },
    { k: 'tube', pts: [ax + u * 0.02, ay - v * 0.012, ax + u * 0.032, ay - v * 0.034, ax + u * 0.046, ay - v * 0.044], r0: v * 0.014, r1: v * 0.01 },
  ], { h: H, formK: 0.5, creases: [
    { x0: ax + u * 0.084, y0: ay - v * 0.012, x1: ax + u * 0.1, y1: ay - v * 0.03, r: v * 0.0035, a: 0.5 },
    { x0: ax + u * 0.074, y0: ay - v * 0.006, x1: ax + u * 0.09, y1: ay - v * 0.028, r: v * 0.0035, a: 0.45 },
  ] });
  softLine(ctx, B, [ax + u * 0.04, ay - v * 0.018, ax + u * 0.058, ay - v * 0.02, ax + u * 0.074, ay - v * 0.016], skin, Math.max(1, H * 0.009), 0.55);

  // 9. The collar, fleece round the neck; or the king's mantle over his shoulders and the tops of his arms.
  if (g.mantle) blob(ctx, B, fleece, [
    { k: 'curve', pts: [
      X(-0.07), Y(sy + 0.03) - b, X(-0.17), Y(sy + 0.01) - b, X(-0.226), Y(sy - 0.04) - b, X(-0.238), Y(0.71), X(-0.18), Y(0.69),
      X(-0.1), Y(0.716), X(0.0), Y(0.73), X(0.1), Y(0.716), X(0.18), Y(0.69), X(0.238), Y(0.71), X(0.226), Y(sy - 0.04) - b,
      X(0.17), Y(sy + 0.01) - b, X(0.07), Y(sy + 0.03) - b,
    ], wobble: 0.025, spiky: 0.022, seed: 63, sub: 3 },
  ], { h: H, tex: 'fur', seed: 64, amount: 0.8, formK: 0.35 });
  else blob(ctx, B, fleece, [
    { k: 'curve', pts: [X(-0.112), Y(sy + 0.004) - b, X(-0.06), Y(sy + 0.03) - b, X(0.06), Y(sy + 0.03) - b, X(0.112), Y(sy + 0.004) - b, X(0.09), Y(sy - 0.032) - b, X(0.0), Y(sy - 0.05) - b, X(-0.09), Y(sy - 0.032) - b], wobble: 0.07, seed: 18, sub: 3 },
  ], { h: H, tex: 'fur', seed: 19, amount: 0.7, formK: 0.3 });

  // 10. The neck and the head: a heavy skull, small for the height of him, the ears under the hair.
  blob(ctx, B, skin, [
    { k: 'cap', x0: hx, y0: Y(sy - 0.01) - b, x1: hx, y1: hy, r0: H * 0.04, r1: H * 0.042 },
    { k: 'ell', x: hx, y: hy, rx: hr, ry: hr * 1.2 },
    { k: 'ell', x: P(-0.98, 0.1)[0], y: P(-0.98, 0.1)[1], rx: hr * 0.2, ry: hr * 0.34, rot: -0.2 },
    { k: 'ell', x: P(0.98, 0.1)[0], y: P(0.98, 0.1)[1], rx: hr * 0.2, ry: hr * 0.34, rot: 0.2 },
  ], { h: H, formK: 0.45, tex: 'stipple', seed: 20, amount: 0.2 });

  // 11. The hair, swept back off a high forehead and down past the ears.
  blob(ctx, B, hair, [
    { k: 'curve', pts: M([-1.1, 0.3, -1.12, -0.6, -0.74, -1.16, 0.0, -1.3, 0.76, -1.16, 1.12, -0.6, 1.1, 0.3, 0.94, 0.12, 0.86, -0.36, 0.5, -0.58, 0.0, -0.66, -0.5, -0.58, -0.86, -0.36, -0.94, 0.12]), wobble: 0.05, spiky: 0.012, seed: 21, sub: 3 },
  ], { h: H, tex: 'bristle', seed: 22, amount: 0.5, formK: 0.4 });

  // 12. The face, looking down: a brow like a shelf lit along its top, the eyes deep in the shadow
  //     under it with a pale glint in each, a long nose, the cheeks burnt by four hundred winters.
  const fill = (a: readonly number[], hex: string): void => {
    ctx.beginPath(); ctx.moveTo(...P(a[0], a[1]));
    for (let k = 2; k < a.length; k += 2) ctx.lineTo(...P(a[k], a[k + 1]));
    ctx.closePath(); ctx.fillStyle = B.col(hex); ctx.fill();
  };
  patch(ctx, B, shade('#c4664c', tone), [{ k: 'ball', x: P(-0.5, 0.36)[0], y: P(-0.5, 0.36)[1], r: hr * 0.28 }, { k: 'ball', x: P(0.52, 0.36)[0], y: P(0.52, 0.36)[1], r: hr * 0.28 }], { alpha: 0.32 });
  fill([-0.78, -0.12, -0.3, -0.26, 0.3, -0.26, 0.8, -0.12, 0.76, -0.04, 0.3, -0.14, -0.3, -0.14, -0.74, -0.04], mix(skin, '#ffffff', 0.14));
  ctx.fillStyle = B.col(shade(skin, 0.58));
  for (const sx of [-0.38, 0.4]) { const [ex, ey] = P(sx, 0.06); ctx.beginPath(); ctx.ellipse(ex, ey, hr * 0.22, hr * 0.11, 0, 0, Math.PI * 2); ctx.fill(); }
  for (const sx of [-0.38, 0.4]) eye(ctx, ...P(sx, 0.08), hr * 0.1, shade('#d4dcdc', tone), false);
  fill([-0.1, -0.08, 0.1, -0.08, 0.2, 0.48, -0.16, 0.5], mix(skin, '#ffffff', 0.1));
  fill([-0.2, 0.48, 0.24, 0.46, 0.18, 0.58, -0.14, 0.6], shade(skin, 0.62));

  // 13. The beard, from the cheekbones to its foot, the moustache over the mouth; it stirs.
  const sway = Math.sin(p.frame / 41) * H * (g.mantle ? 0.006 : 0.003);
  const bw = H * (g.mantle ? 0.06 : 0.05), mid = (Y(g.beard) + hy + hr) / 2;
  blob(ctx, B, hair, [
    { k: 'curve', pts: [
      ...P(-0.98, 0.12), ...P(-1.02, 0.6), ...P(-0.9, 1.08), hx - bw, mid, hx - bw * 0.55 + sway, Y(g.beard) - hr * 0.5,
      hx + sway * 1.4, Y(g.beard), hx + bw * 0.55 + sway, Y(g.beard) - hr * 0.5, hx + bw, mid,
      ...P(0.9, 1.08), ...P(1.02, 0.6), ...P(0.98, 0.12), ...P(0.74, 0.36), ...P(0.42, 0.62), ...P(0.0, 0.55), ...P(-0.42, 0.62), ...P(-0.74, 0.36),
    ], wobble: 0.03, spiky: 0.012, seed: 23, sub: 3 },
  ], { h: H, tex: 'bristle', seed: 24, amount: 0.6, formK: 0.4 });
  softLine(ctx, B, M([-0.32, 0.86, 0.0, 0.92, 0.34, 0.86]), shade(hair, 0.55), Math.max(1, hr * 0.12), 0.7);
  softLine(ctx, B, [hx - bw * 0.3, mid - hr * 0.2, hx - bw * 0.2 + sway, Y(g.beard) + hr * 0.4], hair, Math.max(1, hr * 0.08), 0.35);
  softLine(ctx, B, [hx + bw * 0.32, mid - hr * 0.2, hx + bw * 0.22 + sway, Y(g.beard) + hr * 0.4], hair, Math.max(1, hr * 0.08), 0.35);

  // 14. The king's crown: coin set on edge in a band round his brow, from the sides to the front,
  //     the oldest at the front with no face.
  if (g.coins) {
    const at = (t: number): [number, number] => P(Math.sin(t) * 1.02, -0.66 - (1 - Math.cos(t)) * 0.26);
    const band: number[] = [];
    for (let t = -1.4; t <= 1.401; t += 0.2) band.push(...at(t));
    stroke(ctx, band, shade('#4a3826', tone), Math.max(1.2, hr * 0.16));
    const ring: [number, string][] = [[-1.2, SILVER], [1.2, GOLD], [-0.8, GOLD], [0.8, SILVER], [-0.4, SILVER], [0.4, GOLD]];
    for (const [t, hex] of ring) { const [cx, cy] = at(t); coin(ctx, cx, cy - hr * 0.24, hr * 0.25, shade(hex, tone)); }
    const [cx, cy] = at(0); coin(ctx, cx, cy - hr * 0.28, hr * 0.3, shade(OLD, tone), false);
  }
}
