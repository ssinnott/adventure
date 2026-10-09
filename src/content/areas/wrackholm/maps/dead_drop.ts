// The Dead-Drop, level one: the drop. Down the long way from the stair's foot's far end onto the receiving
// floor, where the Hand's crews leave the cargo and go back up: the crates left in a row, and their boot marks
// going no further. Round the corner, out of sight of the way in, the rails' hall, crates on rails and the
// tally clerks' counting posts; off it the shards stacked by size, small, middling and large; behind the small
// a way down to the counting floor and the Compact's coin; and at the far end the rails going on down to the
// vaults (VAULT_STAIR), a hold keeper come up to fill its pails. By the drop, the top of the vaults' hoist, a
// cage in a shaft (the vaults' HOIST lands in it). Loaders and clerks at 26, the keeper at 27. It pays outside any area's budget (EXPANSION §5.2; Wrackholm's `outside`).
// docs/areas/dead_drop.md §4.1 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

/**
 * The way down to the vaults (dead_drop2, #22's second level): the rails' slope at the drop's far end, 25,30,
 * onto the vaults' first square at 25,1, facing south; their way back up lands on 25,29, facing north, the
 * slope's head.
 */
export const VAULT_STAIR: Exit = { x: 25, y: 30, to: 'dead_drop2', tx: 25, ty: 1, tf: SOUTH,
  label: 'Down the rails\' slope a long way, into air that is dry and still.' };

export const DEAD_DROP: MapDef = {
  id: 'dead_drop',
  name: 'The Drop',
  kind: 'dungeon',
  band: [26, 27],
  region: 'wrackholm',
  start: { x: 3, y: 1, facing: SOUTH },
  // The stair's foot's stone, smooth and cold and lit from nowhere, all the way down.
  palette: { wall: '#8a8c90', wallDark: '#5e6064', floor: '#6a6c70', ceiling: '#4a4c50', door: '#5a5c60', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a3c40' },
  bare: true,
  rows: [
    '################################',
    '###.############################',
    '###.############################',
    '###.############################',
    '###.############################',
    '###.############################',
    '###.############################',
    '###.############################',
    '###.############################',
    '##.....#########################',
    '#.........######################',
    '##.....##.######################',
    '#########.######################',
    '###..........................###',
    '###..........o.......o.......###',
    '###..........................###',
    '######.#####.#####.########..###',
    '#####...###...###...#######..###',
    '#####...###...###...#######..###',
    '#####...###...###...#######..###',
    '#####...###...###...#######..###',
    '######.####################..###',
    '######.####################..###',
    '######.####################..###',
    '###......#############.......###',
    '###......#############.......###',
    '###..o.......................###',
    '###..........................###',
    '###....o.#############.......###',
    '###......#############.......###',
    '#########################.######',
    '################################',
  ],
  exits: [
    // The way back up, onto the stair's foot in front of its far end, facing away from it.
    { x: 3, y: 1, to: 'dead_drop_stair', tx: 4, ty: 2, tf: SOUTH, label: 'Up the long way, and the stair\'s foot again, cold and empty.' },
    // The rails' slope at the far end, down to the vaults (VAULT_STAIR).
    VAULT_STAIR,
  ],
  features: [
    // The way in and the drop: the cargo left where the crews stop, and nothing past it in sight.
    { kind: 'event', x: 3, y: 2, id: 'dd_in', once: true, text: 'The way levels out. Ahead, steady as a mill, something heavy is set down, and lifted, and set down again.' },
    { kind: 'event', x: 4, y: 10, id: 'dd_drop', once: true, text: 'Crates in a row across the floor, nailed shut and chalked. Boot marks come this far in the dust and turn back.' },
    // Beside the drop, the top of the vaults' hoist: the cage its HOIST comes up into, worked from below.
    { kind: 'event', x: 1, y: 10, id: 'dd_cage', once: true, text: 'A cage in a shaft in the wall, hung on two chains greased black. They run down into the dark.' },
    // Round the corner, the rails' hall: crates on rails, and where the rails end a loader's pieces heaped.
    { kind: 'event', x: 9, y: 13, id: 'dd_rails', once: true, text: 'Two rails run the length of a long hall, polished bright. On them stand crates nose to tail, each the size of a cart.' },
    { kind: 'event', x: 4, y: 14, id: 'dd_buffer', once: true, text: 'The rails end against a block of stone, scored deep. Whatever hit it last lies in pieces by the wall.' },
    { kind: 'chest', x: 3, y: 15, id: 'dd_heap', gold: 0, items: ['loader_port', 'loader_iron'] },
    { kind: 'event', x: 12, y: 14, id: 'dd_post', once: true, text: 'A post of the same stone, cut all round with tallies in fives, thousands of them. The newest, at the top, are sharp.' },
    // The shards stacked by size.
    { kind: 'event', x: 6, y: 18, id: 'dd_small', once: true, text: 'Shards no bigger than a thumbnail, sorted into trays by the hundred, each tray chalked with its count.' },
    { kind: 'event', x: 12, y: 18, id: 'dd_middling', once: true, text: 'Shards the size of a fist, packed in straw like eggs, row on row, every row the same length to a finger.' },
    { kind: 'event', x: 18, y: 18, id: 'dd_large', once: true, text: 'Shards as tall as a man, stood on end and roped to the wall. One is cracked, and beside the crack is a chalk mark.' },
    // Down behind the small, the counting floor, and the Compact's coin under its posts.
    { kind: 'event', x: 6, y: 25, id: 'dd_floor', once: true, text: 'Two more posts, and round them a ring worn into the floor, where something has walked and walked, counting.' },
    { kind: 'event', x: 4, y: 28, id: 'dd_coin', once: true, text: 'A strongbox under the posts, stamped with the Compact\'s mark, and so heavy that two of you cannot shift it.' },
    { kind: 'chest', x: 3, y: 29, id: 'dd_strongbox', gold: 2000, items: [] },
    // The aisle east, worn by the walking.
    { kind: 'event', x: 15, y: 26, id: 'dd_tread', once: true, text: 'Two grooves are worn into the floor here, a stride apart, by feet that have come this way more times than anyone could count.' },
    // The far end: the keeper's trough, and the rails going on down to the vaults (VAULT_STAIR): its line at
    // its head, the once.
    { kind: 'event', x: 24, y: 25, id: 'dd_water', once: true, text: 'A stone trough by the wall, full and clean. A wet track runs from it to the way down, worn into the floor.' },
    { kind: 'event', x: 25, y: 29, id: 'dd_down', once: true, text: 'The rails go on down a long slope into the dark. The air that comes up it smells of nothing at all.' },
  ],
  encounters: [
    // The first, out of sight of the way in, round the corner: a loader on the rails, its crate held up.
    { id: 'dd_loader1', x: 11, y: 15, monsters: ['loader'], aware: 2, respawn: 1440, roams: false },
    // The clerks at their posts, each calling two loaders; the loaders on the rails and at the stacks, the
    // large shards taking two.
    { id: 'dd_clerk1', x: 14, y: 13, monsters: ['tally_clerk'], aware: 3, respawn: 1440, roams: false },
    { id: 'dd_loader2', x: 18, y: 15, monsters: ['loader'], aware: 2, respawn: 1440 },
    { id: 'dd_clerk2', x: 22, y: 13, monsters: ['tally_clerk'], aware: 3, respawn: 1440, roams: false },
    { id: 'dd_loader3', x: 12, y: 19, monsters: ['loader'], aware: 2, respawn: 1440, roams: false },
    { id: 'dd_pair', x: 18, y: 19, monsters: ['loader', 'loader'], aware: 2, respawn: 2880, roams: false },
    { id: 'dd_loader4', x: 28, y: 19, monsters: ['loader'], aware: 2, respawn: 1440 },
    { id: 'dd_clerk3', x: 4, y: 25, monsters: ['tally_clerk'], aware: 3, respawn: 1440, roams: false },
    { id: 'dd_clerk4', x: 8, y: 27, monsters: ['tally_clerk'], aware: 3, respawn: 1440, roams: false },
    // At the far end, a hold keeper come up from the vaults to fill its pails, the level's top at 27.
    { id: 'dd_keeper', x: 25, y: 27, monsters: ['hold_keeper'], aware: 2, respawn: 2880, roams: false },
  ],
};
