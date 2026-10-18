// The monsters' dispatcher for the viewport and the combat screen. The monsters live in ./monsters/,
// one module per family, each registering the kinds it draws (./monsters/index.ts merges them), and
// `drawMonsterSprite` dispatches to them by sprite kind, cel-shaded with the engine's helpers through
// a Brush. Every sprite draws front-facing, centred on (x, y) with y the ground line and `h` the
// intended height. `tone` darkens with distance; `flash` paints the hit frame white. The scenery is
// ./scenery.ts's.
import type { MonsterSprite } from '../game/monsters.ts';
import { B, paintFor } from './monsters/common.ts';
import type { MonsterDrawer, Sprite } from './monsters/common.ts';
import { SPRITES } from './monsters/index.ts';

export { groundShadow } from './monsters/common.ts';

/** A table of every sprite kind, read off what its family registers for it. */
const byKind = <T>(pick: (s: Sprite) => T): Readonly<Record<MonsterSprite, T>> =>
  Object.fromEntries(Object.entries(SPRITES).map(([kind, s]) => [kind, pick(s)])) as Record<MonsterSprite, T>;

/** Which family module's drawer draws each sprite kind, as the family registers it (./monsters/index.ts). */
export const FAMILY: Readonly<Record<MonsterSprite, MonsterDrawer>> = byKind((s) => s.draw);

/**
 * How far each kind's drawing reaches left and right of its centre, as shares of the height it is
 * drawn at: the most over its idle at combat size. The fight spaces its row by them (ui/row.ts). The
 * smoke test holds every drawing to its span, give or take SPAN_SLACK pixels at any size, and the span
 * to no more than a twentieth of a height wider than the drawing; a kind drawn new or redrawn takes the
 * numbers the test prints, in its entry of its family's SPRITES.
 */
export const SPAN: Readonly<Record<MonsterSprite, readonly [number, number]>> = byKind((s) => s.span);
/** How many pixels a drawing may reach past its span at any size, and so how far inside the view's edge a fight keeps the spans. */
export const SPAN_SLACK = 2;

/**
 * How tall a monster draws on the combat screen. Xeen fills most of the window with the thing you
 * are fighting, so a lone enemy is drawn a quarter taller than the old flat size and a pair nearly
 * so. Every extra monster is width the neighbours do not have, so the height comes back down as the
 * row fills, reaching the old size at five and going under it at six, where the old flat size used to
 * overlap badly. A row too wide for the view even so is drawn smaller as a whole (ui/row.ts).
 * @param size the def's size (1 = a full cell)
 * @param count how many monsters are in the row
 */
export function combatHeight(size: number, count: number): number {
  return (34 + size * 92) * Math.min(1, 1.25 - 0.09 * count);
}

/**
 * Draw a monster. `h` is the intended height in px; `frame` drives a small idle motion.
 */
export function drawMonsterSprite(ctx: CanvasRenderingContext2D, kind: MonsterSprite, x: number, y: number, h: number, tint: string, tone: number, frame: number, flash = false): void {
  B.flash(flash);
  FAMILY[kind](ctx, kind, x, y, h, paintFor(tint, tone, frame));
  B.flash(false);
}
