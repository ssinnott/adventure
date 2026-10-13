// The crypt under Hearthfane, the temple's first: down the stair behind the altar (the temple's 8,1) to
// its foot, 8,14, and a vaulted passage north into a round chamber with eleven lamp niches in its wall,
// where the Cleric's third keeps the eleven (§6, #763); a side vault off its west where the Hand laid
// its dead and the rats come up for them; and north through the chamber's door a short passage, a keeper
// in it, to the grey door down into the Ways (#757) with Wenna's knot on its frame (§5). Band 29;
// docs/areas/hearth_isle.md §4.5 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/** The eleven kept in the crypt's niches (the Cleric's third, §6): `hf2_eleven` sets it. */
export const ELEVEN_KEPT = 'q_eleven_kept';
/** The keeper's log given to Hereswith at Anchorhold (#763), which sets it and should export it. */
const LOG_GIVEN = 'q_eleven_log';

/**
 * The grey door down into the Ways, `underdeep` (#757), whose way back up lands on the knot's square,
 * 8,2, facing south. The door's sign stays on its square.
 */
export const GREY_DOOR: Exit = { x: 8, y: 1, to: 'underdeep', tx: 16, ty: 30, tf: NORTH, label: 'Through the grey door she opened, and the ice of the crypt gives way to the hum. Light comes from the walls, and no lamp.' };

const many = (n: number, id: string): string[] => Array.from({ length: n }, () => id);

export const HEARTHFANE2: MapDef = {
  id: 'hearthfane2',
  name: 'The Crypt',
  kind: 'dungeon',
  band: [29, 29],
  region: 'hearth',
  // At the stair's foot, facing up the passage.
  start: { x: 8, y: 14, facing: NORTH },
  // The temple's rock going grey toward the bottom, cold, and nothing hung on it.
  palette: { wall: '#a49c90', wallDark: '#6c665e', floor: '#7a766c', ceiling: '#262422', door: '#7a7874', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#6a6866' },
  bare: true,
  rows: [
    '################',
    '########D#######',
    '########.#######',
    '########.#######',
    '########D#######',
    '#######...######',
    '#...##.....#####',
    '#...#.......####',
    '#...D.......####',
    '#...#.......####',
    '######.....#####',
    '#######...######',
    '########.#######',
    '########.#######',
    '########.#######',
    '########.#######',
  ],
  exits: [
    // Up the stair onto the altar's square in the temple's court, facing away from the stair.
    { x: 8, y: 15, to: 'hearthfane', tx: 8, ty: 2, tf: SOUTH, label: 'Up the stair behind the altar into the court.' },
    // Through the grey door down into the Ways (#757).
    GREY_DOOR,
  ],
  features: [
    // The vaulted passage from the stair's foot.
    { kind: 'event', x: 8, y: 12, id: 'hf2_vault', once: true, text: 'The crypt: the rim\'s rock cut into a vault, and under the vault, cold. The pilgrims\' dead lie in the walls with their cups.' },
    // The round chamber and its eleven niches, each a lamp in the wall; the Cleric's third keeps them.
    { kind: 'event', x: 8, y: 8, id: 'hf2_niches', once: true, text: 'Eleven niches round the chamber, and in each a lamp, cold. Over them, cut in the old hand: ONCE FOR EACH, AND THE GAPS BETWEEN.' },
    { kind: 'event', x: 8, y: 7, id: 'hf2_eleven', once: true, after: { flag: LOG_GIVEN }, sets: ELEVEN_KEPT, text: 'You light the eleven as the log has them, a grace between each, the pairs even. On the eleventh the hum changes key, and holds.' },
    { kind: 'chest', x: 10, y: 10, id: 'hf2_cups', gold: 600, items: [] },
    // The side vault, where the Hand laid its dead, and the pack of one of them.
    { kind: 'event', x: 2, y: 7, id: 'hf2_dead', once: true, text: 'Three of the Hand dead in the side vault, laid in a row by their own. Whatever caught them did it below, and they were carried up to here, and no further.' },
    { kind: 'chest', x: 1, y: 8, id: 'hf2_pack', gold: 200, items: ['grey_robe'] },
    // The chamber's north door on the passage: the keeper, and the Hand's last man up here beside it.
    { kind: 'event', x: 8, y: 4, id: 'hf2_last', once: true, text: 'A keeper in the passage, and beside it the Hand\'s last man up here, dead on his feet.' },
    // The grey door down, and her knot on its frame.
    { kind: 'event', x: 8, y: 2, id: 'hf2_knot', once: true, text: 'On the grey door\'s frame, at a girl\'s shoulder: a loop inside a loop. She has left you a trail.' },
    { kind: 'sign', x: 8, y: 1, id: 'hf2_door', text:'A door of grey with no handle, standing open. It opened for her, and nobody has shut it since.' },
  ],
  encounters: [
    // The Hand's best in the chamber, never roaming; the rats in the side vault, come up for the dead;
    // and the keeper at the grey door, the first machine met on the isle, the Hand's last man beside it.
    { id: 'hf2_champions', x: 8, y: 10, monsters: many(3, 'ashen_champion'), aware: 2, roams: false, respawn: 2880 },
    { id: 'hf2_rats', x: 2, y: 9, monsters: many(10, 'deep_rat'), aware: 3, respawn: 1440 },
    { id: 'hf2_keeper', x: 8, y: 3, monsters: ['keeper', 'ashen_champion'], aware: 2, roams: false, respawn: 2880 },
  ],
};
