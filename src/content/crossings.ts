// The crossings (#539, #547; EXPANSION §2.1, §2.2): a coach, a boat or a Rider's horse that runs both
// ways on a way the atlas charts, each a fare and never a favour, open to anyone from the start. Each
// end is a town, or a camp or a shore in a zone, as the atlas names its place. Once that is built it
// writes where the crossing puts a company down there (`landing`), and only then does the other end
// sell it: nothing is sold to a place that is not there to land in. A place sells a crossing by a
// person whose `passage` is `sells('<place>', ...)` (game/passage.ts takes it from there). A crossing
// that runs one way is not honest (docs/areas/saltreach.md §9, #177's 1), so once both ends land,
// both sell it. The check (tools/tests/passage.ts) holds each crossing to its link on the atlas and
// its fare to its rule, each built end to its landing and, once both ends land, each end to a seller.
//
// A fare is 12.5 gold a level of the dearer end's floor for each day on the way, as Kitto's boat is
// 150 for a night to Wrackholm's 12; the days are the way's length at about his boat's pace, some
// five squares an hour. One fare, one length and one timetable whichever way, though a seller may
// halve the fare for his own guild at his end.
import type { Passage } from '../game/map.ts';
import type { When } from '../game/quests.ts';
import type { Facing } from '../game/types.ts';
import { EAST, NORTH, SOUTH, WEST } from '../game/types.ts';

/** One end of a crossing: a town, or a camp or a shore in a zone, and where the crossing puts a company down there once it is built. */
export interface CrossingEnd {
  /** The town or the zone, as the atlas names its place: a town's is its map's id once built. */
  at: string;
  /** What a menu at the other end calls it. */
  name: string;
  /**
   * Where a company coming the other way is put down here, written by the place once it is built: in
   * a zone, which is built a box at a time, on the map of the box that holds it (`map`).
   */
  landing?: { map?: string; x: number; y: number; facing?: Facing };
  /** The issue (or the phase) that writes `landing`, while none does. */
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
 * A crossing between two places, on a link the atlas charts (a boat on a `sea` link, a coach or a
 * Rider's horse on a `coach` one): it leaves either end at the hour `departs`, every day, and lands
 * `days` midnights later at the hour `arrives`, for one fare.
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
 * The passages a person at the place `at` sells on these crossings: to each one's other end, landing
 * where that end puts a company down and saying its line there, with this end's warning and halving.
 * A crossing whose other end has nowhere to land yet, its place not built, is not sold. A crossing
 * with no end at `at` is a mistake in the content, and throws.
 */
export function sells(at: string, ...crossings: readonly Crossing[]): Passage[] {
  return crossings.flatMap((c): Passage[] => {
    const k = c.ends.findIndex((e) => e.at === at);
    if (k < 0) throw new Error(`${c.name} does not run from ${at}`);
    const here = c.ends[k], far = c.ends[1 - k];
    if (!far.landing) return [];
    return [{
      to: far.landing.map ?? far.at, x: far.landing.x, y: far.landing.y, facing: far.landing.facing, name: far.name,
      by: c.by, fare: c.fare, departs: c.departs, days: c.days, arrives: c.arrives,
      label: far.label, warning: here.warning, half: here.half, free: here.free,
    }];
  });
}

/** Kilnhaven's ferry, west across the sea to Saltmouth and back: some 290 squares of sea. */
export const FERRY: Crossing = {
  name: 'the ferry', by: 'boat', fare: 400, departs: 8, days: 2, arrives: 16,
  ends: [
    // At the ferry's steps on the quay, where the street comes down to it (#469).
    { at: 'kilnhaven', name: 'Kilnhaven', landing: { x: 4, y: 7, facing: EAST },
      label: 'The ferry warps in under Kilnhaven\'s wall, and you step onto the quay, rested. The air tastes of iron.' },
    // On the harbour quay, where Kitto's boat from Wrackholm puts in.
    { at: 'saltmouth', name: 'Saltmouth', landing: { x: 13, y: 10, facing: WEST },
      warning: 'Dunstan looks you over. "Over there they sell you iron, and the hills take it back off you."' },
  ],
};

/** The Salt Compact's ship to Cinderport, the far side's port: some 230 squares, and the quest's way over the sea in Act IV. */
export const COMPACT_SHIP: Crossing = {
  name: 'the Compact ship', by: 'boat', fare: 600, departs: 20, days: 2, arrives: 16,
  ends: [
    // On the Compact's steps down the quay, where the ship's boat comes in (#469).
    { at: 'kilnhaven', name: 'Kilnhaven', landing: { x: 4, y: 12, facing: EAST },
      label: 'The ship\'s boat puts you on the Compact\'s steps, rested. Nobody on the quay looks up.',
      warning: 'Jago looks you over. "Cinderport is ash and worse. I put you ashore; I don\'t come back for you."' },
    // On the Compact's steps at Cinderport's quay, under the factor's house, where she ties up; her
    // master there halves the fare for a member of the Compact, as Kitto does (#512).
    { at: 'cinderport', name: 'Cinderport', landing: { x: 13, y: 2, facing: SOUTH }, half: { flag: 'q_compact_run_done' },
      label: 'The ship ties up at Cinderport\'s quay, and you step ashore, rested. Ash settles on your sleeves.' },
  ],
};

/** The drove road's coach over Cairnmoor, which has no town, to Rime Lodge: some 140 squares of road. */
export const DROVE_COACH: Crossing = {
  name: 'the drove road coach', by: 'coach', fare: 250, departs: 6, days: 1, arrives: 12,
  ends: [
    // In the inn yard just inside the east gate, on the town's own map: L6's yard outside the wall is
    // where the coach turns and the carters wait (#469).
    { at: 'kilnhaven', name: 'Kilnhaven', landing: { x: 12, y: 8, facing: WEST },
      label: 'The coach comes in at the east gate and stops in the inn yard. You step down, rested, into red dust.',
      warning: 'Murdo looks you over. "I drive the coach. What comes off the moor at it, you see to."' },
    // In the coach house inside the lodge's gate, where its coachman stands (#487).
    { at: 'rime_lodge', name: 'Rime Lodge', landing: { x: 13, y: 7, facing: WEST }, label: 'Down off the coach in Rime Lodge\'s coach house, stiff with the cold.' },
  ],
};

/** The Rider's ride, on a Rider's horse west from Cinderport to Akordu, the Wold Riders' camp, and back: some 95 squares of ash and grass. */
export const RIDERS_RIDE: Crossing = {
  name: 'the Rider\'s ride', by: 'horse', fare: 325, departs: 14, days: 1, arrives: 9,
  ends: [
    // Just inside the gate, on the town's own map, by the Riders' rail: G10's trading ground outside it
    // is where the Riders come down to trade and their horses wait (#512).
    { at: 'cinderport', name: 'Cinderport', landing: { x: 9, y: 14, facing: NORTH },
      label: 'The Rider sets you down at Cinderport\'s gate, rested, and turns back for the grass.',
      warning: 'The Rider looks you over. "There are lions in the grass. I outride them. You will not."' },
    // At Akordu's horse-lines, on the map of D8, the Wold's box that holds the camp (#526).
    { at: 'wold', name: 'Akordu', owed: '#526',
      label: 'You ride into Akordu behind a Rider and get down, rested, among the white tents.' },
  ],
};

/** The last crossing, over the Sound from Cinderport to Hearth Isle, Act V's, and back: some 110 squares of sea. */
export const LAST_CROSSING: Crossing = {
  name: 'the last crossing', by: 'boat', fare: 350, departs: 20, days: 1, arrives: 16,
  ends: [
    // On the steps the Compact's ship uses, at Cinderport's quay (#512).
    { at: 'cinderport', name: 'Cinderport', landing: { x: 13, y: 2, facing: SOUTH },
      label: 'The boat puts you back on Cinderport\'s steps, rested. The light stands behind you.',
      warning: 'The harbourmaster looks you over. "Folk go over strong and come back quiet. You are not strong."' },
    // On the isle's shore under its rim, where Act V begins (Phase 1.5).
    { at: 'hearthisle', name: 'Hearth Isle', owed: 'Phase 1.5',
      label: 'The boat grounds on Hearth Isle under the rim, and you wade ashore, rested. Light rises from within.' },
  ],
};

/** Every crossing. */
export const CROSSINGS: readonly Crossing[] = [FERRY, COMPACT_SHIP, DROVE_COACH, RIDERS_RIDE, LAST_CROSSING];
