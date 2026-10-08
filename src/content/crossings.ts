// The crossings between towns (#539; EXPANSION §2.1, §2.2): a coach or a boat that runs both ways
// on a way the atlas charts, each a fare and never a favour, open to anyone from the start. Each
// end is a town as the atlas names its place. Once its town is built it writes where the crossing
// puts a company down there (`landing`), and only then does the other end sell it: nothing is sold
// to a town that is not there to land in. A town sells a crossing by a person whose `passage` is
// `sells('<town>', ...)` (game/passage.ts takes it from there). A crossing that runs one way is not
// honest (docs/areas/saltreach.md §9, #177's 1), so once both ends land, both sell it. The check
// (tools/tests/passage.ts) holds each crossing to its link on the atlas and its fare to its rule,
// each built end to its landing and, once both ends land, each end to a seller.
//
// A fare is 12.5 gold a level of the dearer end's floor for each day on the way, as Kitto's boat is
// 150 for a night to Wrackholm's 12; the days are the way's length at about his boat's pace, some
// five squares an hour. One fare, one length and one timetable whichever way, though a seller may
// halve the fare for his own guild at his end.
import type { Passage } from '../game/map.ts';
import type { When } from '../game/quests.ts';
import type { Facing } from '../game/types.ts';
import { WEST } from '../game/types.ts';

/** One end of a crossing: a town, and where the crossing puts a company down there once it is built. */
export interface CrossingEnd {
  /** The town, as the atlas names its place: its map's id once built. */
  at: string;
  /** What a menu at the other end calls it. */
  name: string;
  /** Where a company coming the other way is put down here, written by the town once it is built. */
  landing?: { x: number; y: number; facing?: Facing };
  /** The issue whose town writes `landing`, while none does. */
  owed?: string;
  /** Said on landing here; the passage's own line when absent. */
  label?: string;
  /** The seller's words here to a company under the far end's floor; the passage's own when absent. */
  warning?: string;
  /** The seller here halves the fare once this holds, as Kitto halves his for the Compact; `free` waives it. */
  half?: When;
  free?: When;
}

/**
 * A crossing between two towns, on a link the atlas charts (a boat on a `sea` link, a coach on a
 * `coach` one): it leaves either end at the hour `departs`, every day, and lands `days` midnights
 * later at the hour `arrives`, for one fare.
 */
export interface Crossing {
  /** What it is called, after its way on the atlas. */
  name: string;
  by: Passage['by'];
  fare: number;
  departs: number;
  days: number;
  arrives: number;
  ends: readonly [CrossingEnd, CrossingEnd];
}

/**
 * The passages a person at the town `at` sells on these crossings: to each one's other end, landing
 * where that end puts a company down and saying its line there, with this end's warning and halving.
 * A crossing whose other end has nowhere to land yet, its town not built, is not sold. A crossing
 * with no end at `at` is a mistake in the content, and throws.
 */
export function sells(at: string, ...crossings: readonly Crossing[]): Passage[] {
  return crossings.flatMap((c): Passage[] => {
    const k = c.ends.findIndex((e) => e.at === at);
    if (k < 0) throw new Error(`${c.name} does not run from ${at}`);
    const here = c.ends[k], far = c.ends[1 - k];
    if (!far.landing) return [];
    return [{
      to: far.at, x: far.landing.x, y: far.landing.y, facing: far.landing.facing, name: far.name,
      by: c.by, fare: c.fare, departs: c.departs, days: c.days, arrives: c.arrives,
      label: far.label, warning: here.warning, half: here.half, free: here.free,
    }];
  });
}

/** Kilnhaven's ferry, west across the sea to Saltmouth and back: some 290 squares of sea. */
export const FERRY: Crossing = {
  name: 'the ferry', by: 'boat', fare: 400, departs: 8, days: 2, arrives: 16,
  ends: [
    { at: 'kilnhaven', name: 'Kilnhaven', owed: '#469' },
    // On the harbour quay, where Kitto's boat from Wrackholm puts in.
    { at: 'saltmouth', name: 'Saltmouth', landing: { x: 13, y: 10, facing: WEST } },
  ],
};

/** The Salt Compact's ship to Cinderport, the far side's port: some 230 squares, and the quest's way over the sea in Act IV. */
export const COMPACT_SHIP: Crossing = {
  name: 'the Compact ship', by: 'boat', fare: 600, departs: 20, days: 2, arrives: 16,
  ends: [
    { at: 'kilnhaven', name: 'Kilnhaven', owed: '#469' },
    { at: 'cinderport', name: 'Cinderport', owed: '#512' },
  ],
};

/** The drove road's coach over Cairnmoor, which has no town, to Rime Lodge: some 140 squares of road. */
export const DROVE_COACH: Crossing = {
  name: 'the drove road coach', by: 'coach', fare: 250, departs: 6, days: 1, arrives: 12,
  ends: [
    { at: 'kilnhaven', name: 'Kilnhaven', owed: '#469' },
    // In the coach house inside the lodge's gate, where its coachman stands (#487).
    { at: 'rime_lodge', name: 'Rime Lodge', landing: { x: 13, y: 7, facing: WEST }, label: 'Down off the coach in Rime Lodge\'s coach house, stiff with the cold.' },
  ],
};

/** Every crossing between towns. */
export const CROSSINGS: readonly Crossing[] = [FERRY, COMPACT_SHIP, DROVE_COACH];
