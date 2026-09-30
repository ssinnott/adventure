// The curve (EXPANSION §5.2): for each area, its band, and the xp and gold a clear of it should
// give. tools/tests/curve.ts checks every area against its row. Nothing in the game imports this
// file: it stays out of the build, and out of index.ts, which src/game/party.ts imports.
//
// The slice's own figures, which the tests used to pin and the curve replaces: one clear of the
// walk to Ashcombe, the Foreland map, F2 and F3 by day and the farm's rats, is worth level 2 a member
// (375 xp; the Foreland's walkthrough holds it, #87), adding Brandy Hole level 4 (1,660),
// one clear of everything 9 (11,997), and two fifths of one more sweep of the Grove reaches 10
// (2,759 a sweep once the Warden of the Cut is dead and the Rift's groups stop).
// Training six members from 5 to 10 costs 8,400 gold.
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

/** Every area's row: an area without one is a type error. */
export const CURVE: Record<RegionId, AreaCurve> = {
  shelf: {
    band: [1, 5], next: 5, price: 500,
    owed: { whose: '#26', why: 'Act I falls short until the pilot fills it', xp: 1660 },
  },
  thornmark: {
    band: [5, 10], next: 10, price: 1200,
    owed: { whose: '#26', why: 'Act I falls short until the pilot fills it', xp: 6039 },
  },
};

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
