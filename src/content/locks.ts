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

/**
 * Act I and Act II spend none: the one lock the road had, the flag on the pass, went with #40. Act III
 * spends one (#440, call 4 of #434); Act IV none (#450); Act V one, the Heart's door (#759, call 1 of the
 * Hearth's plan, docs/areas/hearth_isle.md §9).
 */
export const LOCKS: readonly StoryLock[] = [
  {
    flag: 'q_wenna_up', map: 'coldmere_k9', x: 24, y: 30,
    what: 'The door under Loch Fuar\'s ice, at the crack\'s foot: a wall of grey with a door in it, no handle and no seam, which opens under the hand of the girl out of the hole and for nobody before her.',
    reason: 'The Sleepers\' Bay is the act\'s turn, and a door that knows a hand of the line is what the act has been about since the Deep Mines\' CREW ONLY. It waits on her coming up on the fourth night at Rime Lodge, and nothing else in Rimewater does (docs/areas/rimewater.md §5).',
  },
  {
    flag: 'q_ember_lit', map: 'underdeep2', x: 16, y: 1,
    what: 'The last door at the Stair\'s foot, into the Heart: a door of grey with no handle and the Hand\'s last words cut across it, which listens for five voices and opens for nobody before them.',
    reason: 'The heart opens for whoever makes it whole: the five the road sets at the Stones (the Tide home, the Grove closed, the Anvil shut, the Peak stood at and the Ember lit), and nothing else. The act\'s one lock and the road\'s second, the one it was always sure to spend (docs/areas/hearth_isle.md §9, call 1).',
  },
];
