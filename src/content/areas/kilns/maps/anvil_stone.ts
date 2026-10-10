// The Anvil Stone's Rift: the Stone's field torn loose at the cut, one level of slag and iron under
// O5's tear, hand-built in the slag's look (#434's 3). The tear lets a company down into a passage
// under the ridges, and four lanes run up from it: the middle one, the slaglings coming down it, to a
// ridge it cannot pass; the west, past more of them, and the east round to the heart, a pair of slag
// elders at the head of each, and the Stone's cut face beyond, where the Warden of the Anvil stands up
// out of a cut. The fourth is a dead end whose slag has set running up, and behind the slag at its
// head is the hollow where the first cutter's tools lie against the Stone. The tear closes when the
// Warden falls: its groups and O5's slaglings stop coming back, and it never does. Band 17-18;
// docs/areas/kilns.md §4.10 is its brief.
import type { Feature, MapDef } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { NORTH } from '../../../../game/types.ts';
import { SLAG } from '../../../rifts/materials.ts';

/** The Warden of the Anvil fallen in the cut. */
export const WARDEN_SLAIN: When = { slain: 'anvil_stone:as_warden' };

/**
 * The tear closed (#540): the flag the Warden sets as it falls (#636), which the Rift's own groups,
 * O5's slaglings, N3's, N5's and O6's strays and the Hearth's count all read.
 */
export const CLOSED: When = { flag: 'q_anvil_closed' };

/** The tear's quiet said: by any of its three events. */
const QUIET: When = ['as_quiet_lanes', 'as_quiet_cut', 'as_quiet_back'].map((id) => ({ seen: `anvil_stone:${id}` }));

/**
 * The tear gone quiet: said on the first step after the Warden falls, from the square it is fought
 * from into the cut or back out of it, or by a company gone from the Rift another way on its first
 * step back in. The first said, the rest are gone.
 */
const quiet = (x: number, y: number, id: string): Feature =>
  ({ kind: 'event', x, y, id, once: true, after: WARDEN_SLAIN, until: QUIET, text: SLAG.quiet });

export const ANVIL_STONE: MapDef = {
  id: 'anvil_stone',
  name: SLAG.name,
  kind: 'dungeon',
  band: [17, 18],
  region: 'kilns',
  start: { x: 7, y: 14, facing: NORTH },
  palette: SLAG.palette,
  bare: true,
  rows: [
    '################',
    '#######.#####..#',
    '#######.######S#',
    '####.......###.#',
    '###...###...##.#',
    '###.#######.##.#',
    '##..###.###..#.#',
    '##.####.####.#.#',
    '##.####.####.#.#',
    '##..###.###..#.#',
    '###.###.###.##.#',
    '###.###.###.##.#',
    '###.###.###.##.#',
    '###............#',
    '#######.########',
    '################',
  ],
  exits: [
    // The tear, back up onto O5 beside it, facing away (TEAR, kilnsheart_o5.ts).
    { x: 7, y: 14, to: 'kilnsheart_o5', tx: 12, ty: 15, tf: NORTH, label: SLAG.leave },
  ],
  features: [
    // Under the ridges, where the lanes begin.
    { kind: 'event', x: 7, y: 13, id: 'as_lanes', once: true, until: WARDEN_SLAIN, text: 'Lanes run up between the ridges, the light redder at their heads. The ground hums underfoot, low and even.' },
    quiet(7, 13, 'as_quiet_lanes'),
    // The middle lane: the iron run across it, and the ridge at its head.
    { kind: 'event', x: 7, y: 11, id: 'as_iron', once: true, text: 'Iron has run out of the ridge and set across the lane in a bright seam. It rings underfoot like a struck bar.' },
    { kind: 'event', x: 7, y: 6, id: 'as_ridge', once: true, until: WARDEN_SLAIN, text: 'The lane ends at a ridge, red at every crack. The hum comes through it, and heat on the face.' },
    // The west lane and the east, the slag run down each from the back.
    { kind: 'event', x: 3, y: 12, id: 'as_west', once: true, text: 'Slag has run down this lane from the back and set in ripples, lip over lip, like wax down a candle.' },
    { kind: 'event', x: 12, y: 8, id: 'as_east', once: true, text: 'This lane\'s slag has run down from the back too, and set in ripples, lip over lip.' },
    // The back: the Stone's cut face through the slag, and the cut in it where the Warden stands.
    { kind: 'event', x: 7, y: 3, id: 'as_back', once: true, until: WARDEN_SLAIN, text: 'The lanes come up against the Stone\'s cut face, bare through the slag and warm. In a cut in it the red is brightest.' },
    quiet(7, 1, 'as_quiet_cut'),
    quiet(7, 3, 'as_quiet_back'),
    // The secret: the fourth lane's slag set running up; searched at its head, the slag gives on a
    // hollow against the Stone's cut face, and the first cutter's tools.
    { kind: 'event', x: 14, y: 6, id: 'as_ripples', once: true, text: 'Here the ripples run the other way, lip over lip up the lane toward the back, as if poured uphill.' },
    { kind: 'event', x: 14, y: 1, id: 'as_hollow', once: true, text: 'A hollow in the slag, the Stone\'s cut face bare at its back. Against it lie a cutter\'s tools, left when the ground opened.' },
    { kind: 'chest', x: 13, y: 1, id: 'as_hollow_chest', gold: 1910, items: ['cutters_pick', 'cutters_chisel'] },
  ],
  secrets: [{ x: 14, y: 2, hint: 'as_ripples' }],
  encounters: [
    // Slaglings down the middle lane and in the west, and a pair of slag elders at the heads of the
    // west and east lanes, before the cut face: all come back until the tear is closed.
    { id: 'as_slag_lane', x: 7, y: 9, monsters: ['slagling', 'slagling', 'slagling', 'slagling'], aware: 4, respawn: 1440, until: CLOSED },
    { id: 'as_slag_west', x: 3, y: 10, monsters: ['slagling', 'slagling', 'slagling', 'slagling'], aware: 4, respawn: 1440, until: CLOSED },
    { id: 'as_elders_west', x: 3, y: 5, monsters: ['slag_elder', 'slag_elder'], aware: 3, respawn: 2880, roams: false, until: CLOSED },
    { id: 'as_elders_east', x: 11, y: 5, monsters: ['slag_elder', 'slag_elder'], aware: 3, respawn: 2880, roams: false, until: CLOSED },
    // The Warden of the Anvil, standing up out of the cut: it never comes back, and the tear closes
    // when it falls.
    { id: 'as_warden', x: 7, y: 1, monsters: ['anvil_warden'], aware: 2, roams: false, slainText: 'The red goes out of the slag. The ground stops humming. Up at the cut, the Stone is only a stone.', sets: 'q_anvil_closed' },
  ],
};
