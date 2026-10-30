// Shared plumbing for the monster drawings in src/ui/monsters/: the brush every family paints with,
// the small shape helpers the engine lacks, and the humanoid frame the bandit, cultist and ogre
// families are built on. Each family module exports a `draw` of type MonsterDrawer and registers the
// kinds it draws in its SPRITES, which ../index.ts merges, and the dispatcher in ../../sprites.ts picks
// the family by sprite kind. Every monster draws front-facing,
// centred on (x, y) with y the ground line and `h` the intended height.
import type { MonsterSprite } from '../../../game/monsters.ts';
import { shade } from '../../../lib/art/palettes.ts';
import { pathEllipse } from '../../../lib/art/shapes.ts';
import { makeBrush } from '../../paint/brush.ts';
import { INK } from '../../paint/ink.ts';

/** One brush for every monster; `flash` paints the hit frame white. */
export const B = makeBrush(INK, 1);

/** The colours and motion a family draws with, derived once per sprite from the def's tint. */
export interface Paint {
  /** The def's tint, darkened with distance. */
  base: string;
  dark: string;
  light: string;
  /** A warm eye and tooth colour that stays readable in the dark. */
  amber: string;
  /** Distance and sleep darkening, 0..1. */
  tone: number;
  /** The animation frame, already offset per individual. */
  frame: number;
  /** A slow -1..1 idle wave, for breathing. */
  breathe: number;
}
/** A family's entry point: draws `kind` (one of the family's variants) at (x, y) with height h. */
export type MonsterDrawer = (ctx: CanvasRenderingContext2D, kind: MonsterSprite, x: number, y: number, h: number, p: Paint) => void;
/**
 * What a family registers for each kind it draws (its SPRITES): the family's one drawer; how far the
 * drawing reaches left and right of its centre, as shares of its height (SPAN in ../../sprites.ts); and
 * the parts it draws apart from its body by design, with the most pieces they come to and the largest
 * share of its ink they take between them, which the smoke test allows (DETACHED in tools/smoke.ts).
 */
export interface Sprite {
  draw: MonsterDrawer;
  span: readonly [number, number];
  detached?: { what: string; pieces: number; share: number };
}

export function paintFor(tint: string, tone: number, frame: number): Paint {
  return { base: shade(tint, tone), dark: shade(tint, tone * 0.72), light: shade(tint, tone * 1.15), amber: shade('#ffd070', Math.max(0.6, tone)), tone, frame, breathe: Math.sin(frame / 14) };
}

/**
 * An eye: the iris, then a pupil and a catchlight. A pupil drawn as a square of rounded pixels is
 * right at two or three px across, which is all an eye used to get, and reads as a black block
 * once a sprite fills the viewport; so it is a square only while it is small enough to pass for
 * one, and an ellipse above that.
 */
export function eye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, pupil = true): void {
  ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, r), 0, Math.PI * 2); ctx.fillStyle = B.col(color); ctx.fill();
  if (!pupil || r < 1.5 || B.override) return;
  ctx.fillStyle = '#120c14';
  if (r < 2) { ctx.fillRect(Math.round(x - r * 0.3), Math.round(y - r * 0.3), Math.max(1, Math.round(r * 0.7)), Math.max(1, Math.round(r * 0.7))); return; }
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.44, r * 0.52, 0, 0, Math.PI * 2); ctx.fill();
  // A catchlight on the lit side, which is what makes an eye look wet rather than painted on.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.arc(x + B.light.x * r * 0.42, y + B.light.y * r * 0.42, Math.max(0.6, r * 0.2), 0, Math.PI * 2); ctx.fill();
}

export function stroke(ctx: CanvasRenderingContext2D, pts: number[], color: string, w: number): void {
  ctx.strokeStyle = B.col(color); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

/** Contact shadow on the ground under a sprite. */
export function groundShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  pathEllipse(ctx, x, y, w / 2, Math.max(1.5, w * 0.12));
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
}


