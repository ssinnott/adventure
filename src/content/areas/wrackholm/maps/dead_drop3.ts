// The Dead-Drop, level three and the last: the counting house. Down the steps from the people's vault
// (WRITER_STAIR) to a door with marks over it like the Kilns'; through it a long hushed room of high desks in
// rows, a ledger open on each, shelves of them to the roof and a stool at every desk that nobody sits on; a
// tally clerk counting by the rail with a loader holding up its crate. Through the gate in the rail, at the
// room's head, the Tallymaster at its desk, writing the Compact's orders in the dead founder's hand; it
// fights only a company that steps to its desk. Beside the desk the in-tray, letters in the hand that
// countersigned the customs seal, and the out-tray, the orders, which a company takes without a fight; the
// Compact's coin and a bin of spent nibs. No way on down. Clerk and loader at 26, the Tallymaster at 28. It
// pays outside any area's budget (EXPANSION §5.2; Wrackholm's `outside`). docs/areas/dead_drop.md §4.3 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const DEAD_DROP3: MapDef = {
  id: 'dead_drop3',
  name: 'The Counting House',
  kind: 'dungeon',
  band: [27, 28],
  region: 'wrackholm',
  start: { x: 16, y: 1, facing: SOUTH },
  // The drop's stone, smooth and cold and lit from nowhere, all the way down.
  palette: { wall: '#8a8c90', wallDark: '#5e6064', floor: '#6a6c70', ceiling: '#4a4c50', door: '#5a5c60', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a3c40' },
  bare: true,
  rows: [
    '################################',
    '################.###############',
    '################.###############',
    '################D###############',
    '##########.............#########',
    '##########.............#########',
    '##########..#.#...#.#..#########',
    '##########.............#########',
    '##########.............#########',
    '##########..#.#...#.#..#########',
    '##########.............#########',
    '##########.............#########',
    '##########..#.#...#.#..#########',
    '##########.............#########',
    '##########.............#########',
    '##########.............#########',
    '################.###############',
    '############.........###########',
    '############.........###########',
    '############.........###########',
    '############.#.#.#.#.###########',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
    '################################',
  ],
  exits: [
    // The way back up the steps, onto the people's vault's 16,29 at their head, facing away from them.
    { x: 16, y: 1, to: 'dead_drop2', tx: 16, ty: 29, tf: NORTH, label: 'Up the steps a long way, and the people\'s vault again.' },
  ],
  features: [
    // Over the door at the steps' foot, the vessel's own word for the room, to a reader of Kiln-script (#538).
    { kind: 'sign', x: 16, y: 2, id: 'dd3_marks', text: 'Over the door, cut fine and even, marks like the Kilns\'.', read: 'MANIFEST. COUNT EVERY ONE.' },
    // The room: the desks in rows, the ledgers on them and on the shelves, the stools nobody sits on.
    { kind: 'event', x: 16, y: 4, id: 'dd3_in', once: true, text: 'A long room, hushed, and the smell of ink. High desks stand in rows down it, and on every desk a ledger lies open.' },
    { kind: 'event', x: 16, y: 10, id: 'dd3_ledgers', once: true, text: 'Desk after desk, the same columns, the same sums, in the same hand. Not one page has a blot.' },
    { kind: 'event', x: 10, y: 8, id: 'dd3_shelves', once: true, text: 'Shelves to the roof along the wall, ledgers on them spine to spine. The highest are grey with dust, the lowest new.' },
    { kind: 'event', x: 22, y: 11, id: 'dd3_stools', once: true, text: 'A stool at every desk, and on every stool dust, thick and smooth. Whatever keeps these ledgers does not sit.' },
    // Through the gate in the rail, the room's head: the Tallymaster seen writing, the once (#448's Thief keys on
    // the event and its flag); the in-tray at the desk's left, the out-tray at its right, the orders in it.
    { kind: 'event', x: 16, y: 16, id: 'dd3_writes', once: true, sets: 'q_writer_seen', text: 'At a desk something tall writes, a pen in each hand, two ledgers at once. Both sign with the knot, and neither hand shakes.' },
    { kind: 'event', x: 14, y: 20, id: 'dd3_intray', once: true, text: 'A tray at the desk\'s left, heaped with letters. Every one is in the hand that countersigned the pages under the Helmstow seal.' },
    { kind: 'event', x: 18, y: 19, id: 'dd3_outtray', once: true, text: 'A tray at the desk\'s right, and in it orders folded in four, each sealed with the knot, ready to go up.' },
    { kind: 'chest', x: 18, y: 20, id: 'dd3_orders', gold: 0, items: ['compact_orders'] },
    // The Compact's coin by the desk, and a bin of spent nibs, a clerk's frame among them.
    { kind: 'event', x: 12, y: 19, id: 'dd3_coin', once: true, text: 'A strongbox in the wall by the desk, stamped with the Compact\'s mark, and too heavy for two of you to lift.' },
    { kind: 'chest', x: 12, y: 20, id: 'dd3_strongbox', gold: 2000, items: [] },
    { kind: 'event', x: 20, y: 19, id: 'dd3_nibs', once: true, text: 'A bin of spent nibs, thousands of them, every one worn flat on the same side.' },
    { kind: 'chest', x: 20, y: 20, id: 'dd3_heap', gold: 0, items: ['clerk_frame', 'tally_nib'] },
  ],
  encounters: [
    // A tally clerk by the rail, counting, a loader beside it holding its crate up: the day's one group.
    { id: 'dd3_clerk', x: 12, y: 14, monsters: ['tally_clerk', 'loader'], aware: 2, respawn: 2880, roams: false },
    // The Tallymaster at its desk, drawn with it, which fights only a company that steps to the desk (16,19).
    { id: 'dd3_tallymaster', x: 16, y: 20, monsters: ['tallymaster'], aware: 1, roams: false,
      slainText: 'The pens stop mid-line. The six lights across its brow go out one at a time, counting down.' },
  ],
};
