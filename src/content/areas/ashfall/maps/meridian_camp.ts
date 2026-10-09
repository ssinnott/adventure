// Meridian Camp, level one: the vents. Down the middle of G11's three mouths (VENTS) into the flue hall
// under them, the drift under the west mouth and the stokers' path worn bright under the east; west
// from the hall the Company's trail, a Guild chain pin at the flue's head and chalked arrows down the
// west flue past the first of their camps, cold, to the stair at the far end (STAIR, barred until the
// iron corridors are built); down the middle the grates, with a stoker and a salamander on their round,
// and a stoker alone on the east flue's; at the bottom the lower gallery and the stokers' furnace room,
// where two stokers with their salamanders shovel nothing into nothing and the Ember Stone's first part
// lies in the furnace's mouth beside a heap of their parts; behind it the scavenger's hole, up his rope
// to his ledge on G11 (HOLE). Once the Stone is lit a sentry comes up the stair. Band 25, the area's
// own; docs/areas/meridian_camp.md §4.1 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { EAST, SOUTH, WEST } from '../../../../game/types.ts';

/**
 * The way down to the iron corridors (meridian_camp2, #22's second level): the stair at the far end,
 * 4,30, onto the corridors' first square at 4,1, facing south, which this asks that level to give it. An
 * exit leads only to a built map, so the corridors list it in this map's exits, open the stair's square
 * and drop or rewrite `mc1_stair`; their way back up lands on 4,29, facing north, the stair's head.
 */
export const STAIR: Exit = { x: 4, y: 30, to: 'meridian_camp2', tx: 4, ty: 1, tf: SOUTH };

export const MERIDIAN_CAMP: MapDef = {
  id: 'meridian_camp',
  name: 'Meridian Camp',
  kind: 'dungeon',
  band: [25, 25],
  region: 'ashfall',
  start: { x: 16, y: 1, facing: SOUTH },
  // Iron flues black with soot, smooth as a stove, and nothing hung on them.
  palette: { wall: '#4c4642', wallDark: '#2c2826', floor: '#38322e', ceiling: '#121010', door: '#5c3c26', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#7a2e1a' },
  bare: true,
  rows: [
    '################################',
    '###########.####.####.##########',
    '#########....................###',
    '###.....................####.###',
    '###.############.###########.###',
    '###.############.###########.###',
    '###.############.###########.###',
    '###.############.###########.###',
    '###.########.........#######.###',
    '###.########..o...o..#######.###',
    '###..........................###',
    '###.########..o...o..#######.###',
    '###.########.........#######.###',
    '###.#....#######.###########.###',
    '###.D....#######.###########.###',
    '###.#....#######.###########.###',
    '###.############.###########.###',
    '###.############.###########.###',
    '###.############.###########.###',
    '###..........................###',
    '###.###################D########',
    '###.###############.........####',
    '###.###############.........####',
    '###.###############.........####',
    '###.###############.........####',
    '###.###############...###...####',
    '##......###########...###...####',
    '##......###########...###.....##',
    '##......###########.........#.##',
    '##......#####################.##',
    '#############################.##',
    '################################',
  ],
  exits: [
    // The middle mouth, up the rungs onto G11's vents' front, facing away from them (VENTS).
    { x: 16, y: 1, to: 'firemount_g11', tx: 27, ty: 16, tf: EAST, label: 'Up the rungs, out of the heat, and into the ash beside the mouths.' },
    // The scavenger's rope, up his hole onto his ledge on G11 (HOLE).
    { x: 29, y: 30, to: 'firemount_g11', tx: 31, ty: 16, tf: WEST, label: 'Up the rope, hand over hand, onto the scavenger\'s ledge.' },
  ],
  features: [
    // The flue hall under the three mouths: the drift under the west one, the stokers' path under the east.
    { kind: 'event', x: 16, y: 2, id: 'mc1_in', once: true, text: 'A hall of iron under the mouths, black with soot and warm as an oven wall. Two more flues come down into it.' },
    { kind: 'cairn', x: 11, y: 1, id: 'mc1_drift', name: 'The drift', text: 'Under the west mouth, a drift of what has fallen down it: ash, bones, a helmet, coins black with soot.', gold: 900, items: ['potion_sp_great'] },
    { kind: 'event', x: 21, y: 2, id: 'mc1_path', once: true, text: 'Under the east mouth the floor is worn bright in a path, out of the flue and back into it.' },
    // The Company's trail: the Guild's chain pin at the west flue's head, and chalked arrows down past
    // their camp to the stair.
    { kind: 'event', x: 6, y: 3, id: 'mc1_pin', once: true, text: 'A chain pin driven into the iron at the flue\'s head, a ring through it. On its head, the Guild\'s mark.' },
    { kind: 'event', x: 3, y: 8, id: 'mc1_arrow', once: true, text: 'An arrow chalked on the iron at shoulder height, pointing on down the flue.' },
    { kind: 'camp', x: 7, y: 14, name: 'A cold camp', text: 'Hollows in the soot where people slept against the wall, and a ring of stones round ash long cold.' },
    { kind: 'event', x: 3, y: 18, id: 'mc1_arrow2', once: true, text: 'Another chalk arrow, lower on the iron, as if whoever drew it was tired. It points down.' },
    { kind: 'event', x: 2, y: 29, id: 'mc1_arrow3', once: true, text: 'By the stair\'s head, a last chalk arrow, pointing down it.' },
    // The stair down to the iron corridors, barred until they are built (STAIR): its line at its head, each time.
    { kind: 'event', x: 4, y: 29, id: 'mc1_stair', text: 'Steps cut down through the floor into a red dark. The heat coming up them stops you on the first.' },
    // The stokers' rounds: the slag swept into heaps, the grates and what breathes under them, the tracks.
    { kind: 'event', x: 7, y: 10, id: 'mc1_slag', once: true, text: 'Slag swept into heaps along the wall, each heap the same size and a hand from the next.' },
    { kind: 'event', x: 16, y: 10, id: 'mc1_grates', once: true, text: 'Grates in the floor, and heat coming up through them from somewhere a long way down.' },
    { kind: 'event', x: 24, y: 10, id: 'mc1_glow', once: true, text: 'Through a grate, far below, a red light and a sound like breathing, slow and very large.' },
    { kind: 'event', x: 28, y: 15, id: 'mc1_tracks', once: true, text: 'Tracks in the soot, flat-footed and deep, round and round the same way. Whatever walks here never stops.' },
    { kind: 'event', x: 16, y: 16, id: 'mc1_scrape', once: true, text: 'The flue narrows and the iron sweats. Ahead, a shovel scrapes and scrapes.' },
    { kind: 'event', x: 9, y: 19, id: 'mc1_boots', once: true, text: 'Under the machines\' flat tracks, boot prints, old, going west. Nothing on boots has come since.' },
    // The furnace room: the Ember Stone's first part in the furnace's mouth (#548), and the stokers'
    // parts in a heap, which no shop buys.
    { kind: 'event', x: 23, y: 21, id: 'mc1_furnace', once: true, text: 'The furnace room. Stokers feed a furnace the size of a house, shovelling nothing into nothing.' },
    { kind: 'chest', x: 23, y: 24, id: 'mc1_part', gold: 0, items: ['ember_part1'] },
    { kind: 'chest', x: 20, y: 27, id: 'mc1_heap', gold: 0, items: ['stoker_firebar', 'stoker_blade'] },
    // Behind the furnace room, the foot of the scavenger's hole (HOLE).
    { kind: 'event', x: 29, y: 28, id: 'mc1_hole', once: true, text: 'A crawl dug up through the slag, a rope of vine hanging down it. The slag at its foot is picked over.' },
  ],
  encounters: [
    // The stokers' rounds: one with a salamander at its heel by the grates, and one alone on the east
    // flue; the furnace room's two with their salamanders, the level's hardest, at the furnace; and,
    // once the Ember Stone is lit, a sentry come up the stair, the level's top, at 26.
    { id: 'mc1_round', x: 19, y: 10, monsters: ['stoker', 'ember_salamander'], aware: 3, respawn: 1440 },
    { id: 'mc1_flue', x: 28, y: 8, monsters: ['stoker'], aware: 3, respawn: 1440 },
    { id: 'mc1_stokers', x: 23, y: 23, monsters: ['stoker', 'ember_salamander', 'stoker', 'ember_salamander'], aware: 2, respawn: 2880, roams: false },
    { id: 'mc1_sentry', x: 6, y: 27, monsters: ['sentry'], aware: 4, respawn: 2880, after: { flag: 'q_ember_lit' } },
  ],
};
