// The curve (EXPANSION §5.2): for each area, its band, and the xp and gold a clear of it should
// give. tools/tests/curve.ts checks every area against its row. Nothing in the game imports this
// file: it stays out of the build, and out of index.ts, which src/game/party.ts imports.
//
// The slice's own figures, which the tests used to pin and the curve replaces: one clear of the
// walk to Ashcombe, the Foreland map, F2 and F3 by day and the farm's rats, is worth level 2 a member
// (375 xp; the Foreland's walkthrough holds it, #87), adding Brandy Hole level 4 (1,660),
// one clear of everything 9 (11,997), and two fifths of one more sweep of the Grove reaches 10
// (2,759 a sweep once the Warden of the Cut is dead and the Rift's groups stop).
// Training six members from 5 to 10 costs 8,400 gold. Since #159 a kill pays by level: a clear of
// Act I in road order is worth 15,292 a member, level 10, where the rows' ×1 sum gives 19,957. Act
// II's areas have rows before their maps, owed to the issues that build them.
import type { RegionId } from './index.ts';
import { xpForLevel, trainPrice } from '../game/party.ts';

/** What the curve says of an area. */
export interface AreaCurve {
  /** The levels its maps are tuned for: every map's band sits inside it. */
  band: [number, number];
  /** The next area's floor, which three quarters of a clear here must reach. */
  next: number;
  /** The dearest weapon, armour or shield its chests and its monsters' drops may hold. */
  price: number;
  /**
   * What a clear falls short of, while someone owes it: the curve reports the shortfall and does
   * not fail it. `xp` (a member's share) and `gold` are what a clear gives today, a floor: a clear
   * that pays less fails.
   */
  owed?: { whose: string; why: string; xp?: number; gold?: number };
}

/** The party the curve pays for. */
export const MEMBERS = 6;

/**
 * The areas next on the road that have a row before they have a map, in road order. An area leaves
 * this list when its first map lists it in AREAS; the curve check fails while it is in both.
 */
export const PLANNED = [] as const;

/** Every area's row, and every planned area's: an area without one is a type error. */
export const CURVE: Record<RegionId | (typeof PLANNED)[number], AreaCurve> = {
  shelf: {
    band: [1, 5], next: 5, price: 500,
  },
  thornmark: {
    band: [5, 10], next: 10, price: 1200,
  },
  // Act II (#159). The windows past Saltreach's rise about 500 a band; the ladder past Thornmark's
  // Armoury (#399) fits inside them, its dearest ware 1,600 and its dearest find 1,500.
  saltreach: {
    band: [10, 12], next: 12, price: 2000,
    owed: { whose: '#153', why: 'Saltreach is built box by box', xp: 2770, gold: 710 },
  },
  wrackholm: {
    band: [12, 14], next: 14, price: 2500,
    owed: { whose: '#154', why: 'of Wrackholm only E6, Kelp Hole and F6 are built (#187, #188, #189)', xp: 7026, gold: 2567 },
  },
  sunderwood: {
    band: [14, 16], next: 16, price: 3000,
    owed: { whose: '#155', why: 'Sunderwood is built box by box', xp: 2572, gold: 890 },
  },
};

/** What a town's trainers teach to: its area's band's top plus one (EXPANSION §5.2). */
export const trainerCeiling = (c: AreaCurve): number => c.band[1] + 1;

/** The xp a member should have from a clear: the climb from the floor to the next floor, over 0.75. */
export function xpBudget(c: AreaCurve): number {
  return Math.ceil((xpForLevel(c.next) - xpForLevel(c.band[0])) / 0.75);
}

/** The gold a clear should pay: training the party from the floor to the next floor. */
export function goldBudget(c: AreaCurve): number {
  let gold = 0;
  for (let level = c.band[0]; level < c.next; level++) gold += MEMBERS * trainPrice({ level });
  return gold;
}
