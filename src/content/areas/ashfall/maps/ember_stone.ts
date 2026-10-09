// The Ember Stone: down the builders' stair inside the Stone on F11's field of cinders (STONE) into its
// housing, iron that has not rusted after all the years. A gallery runs round the housing: the builders'
// benches in an alcove off its west arm, their tools laid out and a stroke half made; a lookout slit in
// its east arm over the Waste, and under it a bed of earth where the cinders blow in (the Druid's third
// ends here, #448). A doorway in the housing gives on its heart: the core of the Stone, three sockets
// round it, each the shape of something and each empty, and a door in the floor that has never opened.
// Each socket takes its part (the vents', Old Cinder's and the corridors'), in any order; the last part
// in lights the Stone (`q_ember_lit`), the door opens and the Sentinel stands in it, the first thing
// up; once it falls the sentries come up after it. The secret: a chain pin with the Guild's mark at the
// housing's foot, and behind the foot the lower gallery where the Meridian Company camped on its way to
// the vents, the fourth journal left there. Band 25-26, the Sentinel and the sentries the top;
// docs/areas/ashfall.md §4.8 is its brief.
import type { Answer, Feature, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/** The flag the Stone lights on (docs/areas/ashfall.md §9, #548's 1): the Hearth counts it, and the sentries wait on it. */
export const LIT = 'q_ember_lit';

/** Each socket's flag, set as its part goes in: the vents' part's, Old Cinder's and the corridors'. */
export const SOCKETS = ['q_ember_socket1', 'q_ember_socket2', 'q_ember_socket3'] as const;
const PARTS = ['ember_part1', 'ember_part2', 'ember_part3'] as const;
const LABELS = ['The First Part.', 'The Second Part.', 'The Third Part.'] as const;

const SET = ['The part goes in and sits flush, as if it had grown there. Round it the iron is warm.'];
/** Said as the last part goes in, whichever it is: what the company sees, and no more. */
export const LIGHTS = [
  'The last part goes in. Light runs out through the iron from the heart, red and then white, and in the floor the door swings open.',
];

/**
 * A socket in the Stone's heart, a person in the engine's terms with no face: it takes its own part at
 * any meeting, setting its flag, and is gone once the part is in. Once the other two are in, it puts the
 * same question with an answer that lights the Stone as well, so the last part lights it, whichever it is.
 */
function socket(i: 0 | 1 | 2, x: number, y: number, name: string, look: string): Feature {
  const others = SOCKETS.filter((_, k) => k !== i);
  const ask = 'Set something in it?';
  const set = (sets: Answer['sets'], says: readonly string[]): Answer => ({ label: LABELS[i], takes: PARTS[i], sets, says });
  return {
    kind: 'npc', x, y, name, until: { flag: SOCKETS[i] },
    lines: [`${look} It is empty.`],
    choice: { ask, answers: [set(SOCKETS[i], SET)] },
    says: [{ after: { flag: others }, lines: [`${look} It is the last of the three still empty.`], choice: { ask, answers: [set([SOCKETS[i], LIT], LIGHTS)] } }],
  };
}

export const EMBER_STONE: MapDef = {
  id: 'ember_stone',
  name: 'The Ember Stone',
  kind: 'dungeon',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 8, y: 1, facing: SOUTH },
  // The housing's iron, grey and unrusted, one face with no join in it, and the fire it was made for
  // nowhere yet.
  palette: { wall: '#6c7075', wallDark: '#44474b', floor: '#3b3b3d', ceiling: '#151517', door: '#56595e', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#7a3a1e' },
  bare: true,
  rows: [
    '################',
    '########.#######',
    '###..........###',
    '###.####.###.###',
    '###.#......#.###',
    '###.#......#.###',
    '#...#...o..#...#',
    '#...#......#...#',
    '#...#......#...#',
    '#...########...#',
    '###.#......#.###',
    '###.#......#.###',
    '###.#......#.###',
    '###.####S###.###',
    '###..........###',
    '################',
  ],
  exits: [
    // Back up the builders' stair onto the Stone's front on F11, facing away from it.
    { x: 8, y: 1, to: 'emberwaste_f11', tx: 8, ty: 23, tf: NORTH, label: 'You climb the builders\' stair up out of the Stone, onto the field of cinders.' },
  ],
  features: [
    // The gallery round the housing, and the doorway into its heart.
    { kind: 'event', x: 8, y: 2, id: 'es_gallery', once: true, text: 'A gallery runs round the Stone\'s housing. The iron has not rusted. Ahead, a doorway into the housing.' },
    // The builders' benches in an alcove off the west arm, and on them the ladder's staff and coat.
    { kind: 'event', x: 2, y: 7, id: 'es_benches', once: true, text: 'The builders\' benches, their tools laid out in rows. In a vice, a stroke of the file half made.' },
    { kind: 'chest', x: 1, y: 7, id: 'es_bench', gold: 600, items: ['battle_staff+1', 'drakeskin+1'] },
    // The lookout over the Waste in the east arm, and under it the seedling's bed (#448: words only).
    { kind: 'event', x: 14, y: 7, id: 'es_lookout', once: true, text: 'A slit in the housing at eye height. Through it the Waste, grey to the mountain, and the causeway over the flow.' },
    { kind: 'event', x: 14, y: 8, id: 'es_bed', once: true, text: 'Under the slit, where the cinders blow in, a bed of earth carried here and ringed with stones. Nothing grows in it.' },
    // The heart: the Stone's core, its three sockets round it and the door in the floor below it, shut
    // until the Stone is lit.
    { kind: 'event', x: 8, y: 4, id: 'es_heart', once: true, text: 'Three sockets in the Stone\'s heart, each the shape of something, each empty. The builders stopped as if called away.' },
    socket(0, 8, 5, 'A socket the size of a loaf', 'A socket in the Stone\'s core the size of a loaf, its back cut flat and true.'),
    socket(1, 7, 6, 'A socket cut to a wedge', 'A socket cut to a wedge, two of its faces dressed to fit something exactly.'),
    socket(2, 9, 6, 'A long socket', 'A socket as long as a forearm and narrow, its broad face cut true.'),
    { kind: 'event', x: 8, y: 7, id: 'es_door', until: { flag: LIT }, text: 'A door in the floor below the core, two leaves of iron, shut. On this side there is nothing to open it by.' },
    { kind: 'event', x: 8, y: 7, id: 'es_open', once: true, after: { flag: LIT }, text: 'The door in the floor stands open on a shaft. Far down it, iron moves on iron.' },
    // The secret: a chain pin at the housing's foot on the south arm, and behind the foot the lower
    // gallery where the Meridian Company camped, the fourth journal left in it.
    { kind: 'event', x: 8, y: 14, id: 'es_pin', once: true, text: 'A chain pin driven into the foot of the housing, a surveyor\'s. The Guild\'s mark is stamped in its head.' },
    { kind: 'event', x: 8, y: 12, id: 'es_lower', once: true, text: 'Steps go down behind the foot into a gallery under the housing. Bedrolls lie in a row, a dozen, and a cold lamp.' },
    { kind: 'chest', x: 5, y: 11, id: 'es_journal', gold: 0, items: ['meridian_journal4'] },
  ],
  secrets: [{ x: 8, y: 13, hint: 'es_pin' }],
  encounters: [
    // The Sentinel in the door the moment the Stone lights, the first thing up; it never comes back.
    { id: 'es_sentinel', x: 8, y: 7, monsters: ['sentinel'], aware: 3, after: { flag: LIT }, slainText: 'The Sentinel goes down on its knees over the door, and the fire in its visor goes out.' },
    // The sentries up through the door after it, as everywhere once the Stone is lit.
    { id: 'es_sentries', x: 9, y: 8, monsters: ['sentry', 'sentry'], aware: 2, respawn: 2880, after: { flag: LIT, slain: 'ember_stone:es_sentinel' } },
  ],
};
