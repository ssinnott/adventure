// The story locks (EXPANSION §2.3): each flag that closes something the quest's progress opens, not
// the company's level or its feet (an exit, a gate, a door, a service), with where it is and why.
// A lock is a thing in plain sight with its reason on it, and never stands between areas. The
// content check (tools/tests/pillars.ts) finds every flag that closes something and holds it to
// this list and its counts; a lock not listed fails until the owner signs it in here and in the
// area's doc. Nothing in the game reads this file.

export interface StoryLock {
  /** The flag that opens it; for a lock of several flags, any one of them. */
  flag: string;
  /** The map and square of the thing it closes. */
  map: string;
  x: number; y: number;
  /** What it is, in the world: a sealed door, a drowned stair, a captain who will not sail. */
  what: string;
  /** Why the story spends a lock here. */
  reason: string;
}

/** No area spends more than one. */
export const MOST_AN_AREA = 1;
/** The road spends about one an act: four, to start. */
export const MOST_ON_THE_ROAD = 4;

/** Empty today: the one lock the road has, the flag on the pass, goes (#40). */
export const LOCKS: readonly StoryLock[] = [];
