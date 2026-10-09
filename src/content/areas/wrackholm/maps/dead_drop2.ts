// The Dead-Drop, level two: the vaults. Down the rails' slope from the drop's far end into the shards' vault,
// racks to the roof and the shards on them sorted by colour, loaders among them; the rails run its length to a
// door at its far end that opens for nobody the company has, deep knockers at it and crates under the Hand's
// seal beside it. Off the vault's south aisle, the people's vault: pens with old straw and a pail at every gate,
// hold keepers carrying the water, and on its end wall the count, two columns. An empty pen is the rest. The
// hoist up to the drop is behind the aisle's wall, found by a search; the steps down to the writer's room
// (WRITER_STAIR) are barred until it is built. Loaders at 26, keepers at 27, knockers at 28. It pays outside
// any area's budget (EXPANSION §5.2; Wrackholm's `outside`). docs/areas/dead_drop.md §4.2 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, EAST, SOUTH } from '../../../../game/types.ts';

/**
 * The way down to the writer's room (dead_drop3, #22's third level): the steps at the people's vault's end,
 * 16,30, a door drawn in the wall, onto the room's first square at 16,1, facing south, which this asks that
 * level to give it. An exit leads only to a built map, so the writer's room lists it in this map's exits,
 * opens its square (the `Z` to floor; the legend stays, for the rails' door) and drops or rewrites
 * `dd2_down`; its way back up lands on 16,29, facing north.
 */
export const WRITER_STAIR: Exit = { x: 16, y: 30, to: 'dead_drop3', tx: 16, ty: 1, tf: SOUTH };

/** The cargo hoist (an addition, dead_drop.md §1): behind the secret door at 14,28, the cage, one way up onto the drop's 1,10. */
export const HOIST: Exit = { x: 13, y: 28, to: 'dead_drop', tx: 1, ty: 10, tf: EAST,
  label: 'The cage goes up a long while in the dark, rattling, and stops with a jolt.' };

export const DEAD_DROP2: MapDef = {
  id: 'dead_drop2',
  name: 'The Vaults',
  kind: 'dungeon',
  band: [27, 28],
  region: 'wrackholm',
  start: { x: 25, y: 1, facing: SOUTH },
  // The drop's stone, smooth and cold and lit from nowhere, all the way down.
  palette: { wall: '#8a8c90', wallDark: '#5e6064', floor: '#6a6c70', ceiling: '#4a4c50', door: '#5a5c60', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a3c40' },
  bare: true,
  // The rails' sealed door, which opens for nobody the company has, and the door at the foot of the steps
  // down to the writer's room until it is built (WRITER_STAIR): walls drawn as doors.
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    '################################',
    '#########################.######',
    '#########################.######',
    '#########################.######',
    '#########################.######',
    '####.........................###',
    '####.#####.#####.#####.#####.###',
    '####.#####.#####.#####.#####.###',
    '###Z.........................###',
    '####.#####.#####.#####.#####.###',
    '####.#####.#####.#####.#####.###',
    '####.........................###',
    '################.###############',
    '################.###############',
    '################.###############',
    '###############...##############',
    '############.........###########',
    '############..#...#..###########',
    '###############...##############',
    '###############...##############',
    '############.........###########',
    '############..#...#..###########',
    '###############...##############',
    '###############...##############',
    '############.........###########',
    '############..#...#..###########',
    '###############...##############',
    '###############...##############',
    '#############.S...##############',
    '###############...##############',
    '################Z###############',
    '################################',
  ],
  exits: [
    // The way back up the rails' slope, onto the drop's 25,29 at the head of its way down, facing away from it.
    { x: 25, y: 1, to: 'dead_drop', tx: 25, ty: 29, tf: NORTH, label: 'Up the rails\' slope a long way, and the drop\'s far end again.' },
    HOIST,
  ],
  features: [
    // The way in and the shards' vault: racks in rows, the shards on them sorted by colour, the rails between.
    { kind: 'event', x: 25, y: 2, id: 'dd2_in', once: true, text: 'The slope levels out. Ahead, racks go up into the dark in rows, and something glints on every shelf.' },
    { kind: 'event', x: 25, y: 5, id: 'dd2_vault', once: true, text: 'Racks to the roof in rows, and on them shards sorted by colour: red at this end, then every colour on down to violet.' },
    { kind: 'event', x: 10, y: 5, id: 'dd2_bare', once: true, text: 'One rack stands bare, swept clean to the wood. Chalked on its end post, a count, and a line ruled under it.' },
    { kind: 'event', x: 16, y: 8, id: 'dd2_rails', once: true, text: 'The rails come down the middle of the vault between the racks, polished bright, and run on west.' },
    { kind: 'event', x: 26, y: 11, id: 'dd2_coin', once: true, text: 'Two strongboxes on a sledge by the rails, stamped with the Compact\'s mark, too heavy for one of you to tip.' },
    { kind: 'chest', x: 27, y: 11, id: 'dd2_box1', gold: 1000, items: [] },
    { kind: 'chest', x: 28, y: 11, id: 'dd2_box2', gold: 1000, items: [] },
    // The vault's far end: the rails under a door that opens for nobody the company has, the knockers at it,
    // and beside it crates under the Hand's seal, as in Sheer Point's sea cave.
    { kind: 'event', x: 4, y: 8, id: 'dd2_door', once: true, text: 'The rails run on under a door flush in the stone, with no handle and no hinge. Low on its face, a thousand dents.' },
    { kind: 'event', x: 4, y: 9, id: 'dd2_seal', once: true, text: 'Crates stacked by the door under the Hand\'s seal, packed in straw. In the straw, shards of every colour, not yet cut.' },
    // The people's vault: the pens, and a pail at every gate.
    { kind: 'event', x: 16, y: 15, id: 'dd2_pens', once: true, text: 'Pens down both sides, their gates standing open and old straw in every one. By each gate, a pail of clean water.' },
    { kind: 'chest', x: 12, y: 21, id: 'dd2_straw', gold: 0, items: ['fishers_spike'] },
    { kind: 'chest', x: 12, y: 25, id: 'dd2_heap', gold: 0, items: ['keeper_yoke', 'keeper_pail'] },
    // An empty pen is the level's rest.
    { kind: 'camp', x: 20, y: 21, name: 'An empty pen', text: 'Old straw, dry, pressed flat in the shape of whoever slept on it last. The gate stands open.' },
    // The count on the end wall, two columns, in the founder's hand.
    { kind: 'event', x: 17, y: 26, id: 'dd2_count', once: true, text: 'Names cut into the wall in two columns, the Compact\'s knot at the head, in a hand that never once shakes.' },
    { kind: 'event', x: 17, y: 27, id: 'dd2_left', once: true, text: 'The left column runs down to the floor: names and homes, Gullwick, Reedholm, Brockholt, Ashcombe, and on.' },
    { kind: 'event', x: 17, y: 28, id: 'dd2_right', once: true, text: 'The right is short: a name, then three, then a family. Last, Wenna, of Gullwick, and by hers alone a loop inside a loop.' },
    // The hoist's chains, going into the wall (the hint, each time), and the steps down to the writer's room,
    // barred until it is built (WRITER_STAIR): its line at its head, each time.
    { kind: 'event', x: 15, y: 28, id: 'dd2_chains', text: 'Two chains come down the wall out of a slot in the roof and go into the stone at the floor. They are greased.' },
    { kind: 'event', x: 16, y: 29, id: 'dd2_down', text: 'Steps go down at the aisle\'s end to a door, shut fast. Through it, faint and steady, a nib scratching.' },
  ],
  secrets: [{ x: 14, y: 28, hint: 'dd2_chains' }],
  encounters: [
    // A loader on the rails, its crate held up; two at the racks; four deep knockers at the door, knocking.
    { id: 'dd2_loader', x: 22, y: 8, monsters: ['loader'], aware: 2, respawn: 1440 },
    { id: 'dd2_loaders', x: 10, y: 8, monsters: ['loader', 'loader'], aware: 2, respawn: 2880, roams: false },
    { id: 'dd2_knockers', x: 5, y: 8, monsters: ['deep_knocker', 'deep_knocker', 'deep_knocker', 'deep_knocker'], aware: 2, respawn: 2880, roams: false },
    // The hold keepers at the pens, carrying water to nobody.
    { id: 'dd2_keepers', x: 16, y: 18, monsters: ['hold_keeper', 'hold_keeper', 'hold_keeper'], aware: 2, respawn: 2880, roams: false },
    { id: 'dd2_keepers2', x: 16, y: 24, monsters: ['hold_keeper', 'hold_keeper', 'hold_keeper', 'hold_keeper'], aware: 2, respawn: 2880, roams: false },
  ],
};
