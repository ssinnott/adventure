// Greywater, level two: the drowned shrine the Ashen cult has dug beneath the smugglers' caves.
// A ring of galleries around a sealed inner shrine. The iron key is in a vestry behind a secret
// door in the north-east; the Deacon waits in the shrine with the cult's ledger. Band 3-5.
import type { MapDef } from '../../game/map.ts';
import { NORTH, SOUTH } from '../../game/types.ts';

export const GREYWATER2: MapDef = {
  id: 'greywater2',
  name: 'The Drowned Shrine',
  kind: 'dungeon',
  band: [3, 5],
  start: { x: 1, y: 1, facing: SOUTH },
  palette: { wall: '#5a6a6a', wallDark: '#3a4646', floor: '#2e3a3a', ceiling: '#222a2a', door: '#4a5a5a', wallStyle: 'brick', ceilingStyle: 'vault', banner: '#6a2a2a' },
  rows: [
    '################',
    '#......#.......#',
    '#.####.#.#####.#',
    '#.#..#.#.#...#.#',
    '#.#..D.#.#...#.#',
    '#.####.#.##S##.#',
    '#......D.......#',
    '#.###########.##',
    '#.#.........#..#',
    '#.#.#######.#..#',
    '#.#.#.....#.#..#',
    '#.#.#.....L.D..#',
    '#.#.#.....#.#..#',
    '#.#.#######.#..#',
    '#...........#..#',
    '################',
  ],
  exits: [
    { x: 1, y: 1, to: 'greywater1', tx: 14, ty: 13, tf: NORTH, label: 'You climb back up to the caves.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 2, id: 'gw2_in', once: true, text: 'Dressed stone under the sea cliffs, old as the Ashcombe cellar. Water runs down the walls and the floor is ankle-deep in it.' },
    { kind: 'chest', x: 3, y: 3, id: 'gw2_c1', gold: 80, items: ['potion_heal', 'potion_heal', 'antidote'] },
    { kind: 'event', x: 8, y: 6, id: 'gw2_east', once: true, text: 'Cells line this passage, their bars rusted through. The cargo the smugglers brought down was people.' },
    { kind: 'sign', x: 11, y: 6, text: 'Carved deep over a blank stretch of wall: THE HAND OPENS WHAT THE HEARTH SHUTS.' },
    { kind: 'event', x: 11, y: 4, id: 'gw2_vestry', once: true, text: 'A vestry. Grey robes on pegs, and a key on a nail by the door.' },
    { kind: 'chest', x: 12, y: 3, id: 'gw2_key', gold: 100, items: ['key_iron', 'potion_sp'] },
    { kind: 'chest', x: 14, y: 14, id: 'gw2_c2', gold: 90, items: ['chain', 'potion_heal'] },
    { kind: 'event', x: 7, y: 8, id: 'gw2_gallery', once: true, text: 'The gallery rings a sealed chamber. Through a crack in the wall, red light, and chanting.' },
    { kind: 'chest', x: 1, y: 14, id: 'gw2_c3', gold: 70, items: ['longbow', 'elixir'] },
    { kind: 'event', x: 9, y: 11, id: 'gw2_shrine', once: true, text: 'The shrine. A seam in the floor glows red, stitched shut with iron staples. Someone has been prising the staples out, one at a time.' },
    { kind: 'chest', x: 5, y: 11, id: 'gw2_ledger', gold: 250, items: ['greywater_ledger', 'elixir'] },
  ],
  encounters: [
    { id: 'gw2_ghouls', x: 6, y: 1, monsters: ['ghoul', 'ghoul', 'ghoul'], aware: 4, respawn: 1440 },
    { id: 'gw2_drowned', x: 1, y: 6, monsters: ['drowned', 'drowned', 'drowned', 'drowned'], aware: 4, respawn: 2880 },
    { id: 'gw2_acolytes', x: 10, y: 1, monsters: ['ashen_acolyte', 'ashen_acolyte', 'ashen_acolyte'], aware: 5, respawn: 2880 },
    { id: 'gw2_crawlers', x: 14, y: 3, monsters: ['rift_crawler', 'rift_crawler', 'rift_crawler', 'rift_crawler'], aware: 5, respawn: 1440 },
    { id: 'gw2_mixed', x: 13, y: 9, monsters: ['ashen_acolyte', 'ashen_acolyte', 'ghoul', 'ghoul'], aware: 5, respawn: 2880 },
    { id: 'gw2_crawlers2', x: 1, y: 11, monsters: ['rift_crawler', 'rift_crawler', 'rift_crawler', 'rift_crawler', 'rift_crawler'], aware: 5, respawn: 1440 },
    { id: 'gw2_dead', x: 6, y: 14, monsters: ['ghoul', 'ghoul', 'ghoul', 'ghoul', 'drowned', 'drowned'], aware: 4, respawn: 2880 },
    { id: 'gw2_doorguard', x: 11, y: 10, monsters: ['ashen_acolyte', 'ashen_acolyte', 'ashen_acolyte', 'ghoul', 'ghoul'], aware: 3, roams: false },
    { id: 'gw2_deacon', x: 7, y: 11, monsters: ['ashen_deacon', 'ashen_acolyte', 'ashen_acolyte'], aware: 2, roams: false },
  ],
};
