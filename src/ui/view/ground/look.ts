// What a ground looks like in the view (#1030): `GroundLook`, what each terrain's module in view/ground/
// answers to the questions the viewport asks of its ground, each once, and the shapes its painters take.
// view/ground/index.ts holds the looks in `GROUND`, a record over every terrain.

import type { GameMap } from '../../../game/map.ts';
import type { Terrain, Solid } from '../../../game/mapdef.ts';
import type { Facing } from '../../../game/types.ts';
import type { Env, Paint } from '../common.ts';
import type { Prop } from '../model.ts';

/**
 * A farm square as the view sees it: its field's crop, whether the rows run away from the eye or
 * across it, and where a hedge parts it from the next field, near, far, left and right.
 */
export interface Plot { crop: number; away: boolean; hedge: readonly [boolean, boolean, boolean, boolean]; }
/** Where ground stands before a drop and beyond it: its lit lip and its far wall. */
export interface Rims { near: boolean; far: boolean }
/**
 * A square of ground as its look's painters take it: how deep and how far across it is in view, its
 * seed and what the scene worked out for it (a field's plot, a drop's rims).
 */
export interface Square { d: number; l: number; seed: number; plot?: Plot; rims?: Rims }
/**
 * A mark lying on a square: its number, where it falls (`s` deep and `t` across the square, `x` and
 * `y` on the screen), its scale there and the square's colour.
 */
export interface Mark extends Square { i: number; s: number; t: number; x: number; y: number; sc: number; base: string }
/**
 * A billboard standing on a square: its foot on the screen, its unit and tone, its square on the
 * map and the frame's cloud over the sun.
 */
interface Board { x: number; y: number; u: number; tone: number; mx: number; my: number; cloud: number }
/**
 * The trees at the sides of a square, the way through it left open: under what hash a side has none,
 * a tree's size and how much a hash adds to it, and the painter of one, its kind picked by a hash.
 */
interface Sides { bare: number; size: number; spread: number; tree: (p: Paint, x: number, y: number, s: number, tone: number, pick: number) => void }

export interface GroundLook {
  /** Its colour on a day of the year (a field's by its crop), before rain and snow. */
  color: (day: number, crop: number) => string;
  /** How white it goes under lying snow, 0 to 1: cobbles and sand show through, water never takes it (`SNOW_HOLD`). */
  snow: number;
  /** Whether rain darkens it. */
  wets: boolean;
  /** Whether rain splashes on it. */
  splashes: boolean;
  /** Whether its tiles shade by a chequer, as water's do, and not by their variation. */
  ripples: boolean;
  /** What it is drawn as where that is another ground at times: the tidal ground is the sea at high water. */
  drawnAs?: (env: Env) => Terrain;
  /** How much its tiles vary in shade, before lying snow evens them out. */
  vary: number;
  /** Whether its tiles are flagstones in mortar: a dark fill under them and a gap round each. */
  mortar?: boolean;
  /** How it is laid in a dungeon, where that differs: the floor's flagstones. */
  dungeon?: GroundLook;
  /** What lies on it: how many marks a square has and the painter of each. */
  lies?: { marks: number; mark: (p: Paint, m: Mark) => void };
  /** What it lays over its tiles, under the marks: a field's rows and hedges, the road's cobbles, the lava's glow. */
  lays?: (p: Paint, base: string, sq: Square) => void;
  /**
   * A drop: painted in place of the floor, nothing lies on it, it has rims where ground stands before it
   * and beyond it, and the ground does not run on to the horizon over it.
   */
  drop?: (p: Paint, sq: Square) => void;
  /** Whether puddles stand on it after rain. */
  puddles?: boolean;
  /** A field square's plot, by its field and the fields beside it. */
  plot?: (map: GameMap, x: number, y: number, f: Facing) => Plot;
  /** A hill: the mound it rises in over its square once the row's floors are down, running on into the hill beside it. */
  mound?: (p: Paint, base: string, d: number, l: number, seed: number, hillL: boolean, hillR: boolean) => void;
  /** The trees at the sides of a woodland square. */
  sides?: Sides;
  /**
   * What stands scattered on it (#1103): its props, each on its rate's share of the squares (`SCATTER_RATES`),
   * one at most to a square, as view/scatter.ts places them. A variant of the ground may stand others.
   */
  scatter?: readonly Prop[];
  /** The billboard it draws, by what stands on it, in place of that solid's own: a glass tree on crystal, a mountain by its rock. */
  boards?: Partial<Record<Solid, (p: Paint, b: Board) => void>>;
}
