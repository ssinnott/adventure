// The Ashcombe cellar: the first dungeon and the tutorial Rift. Four rings of corridor around
// four rooms; a locked door and a secret door decide the order the rings open in.
import type { MapDef } from '../../game/map.ts';
import { SOUTH } from '../../game/types.ts';

export const MILL: MapDef = {
  id: 'mill',
  name: 'Ashcombe Cellar',
  kind: 'dungeon',
  band: [1, 4],
  start: { x: 1, y: 1, facing: SOUTH },
  palette: { wall: '#9a7a5a', wallDark: '#6a5240', floor: '#56463a', ceiling: '#4a3424', wallStyle: 'brick', ceilingStyle: 'beams', banner: '#8a2a22' },
  rows: [
    '################',
    '#......#.......#',
    '#.####.#.#####.#',
    '#.#..#.#.#...#.#',
    '#.#..D.D.#...D.#',
    '#.####.#.#####.#',
    '#......#.......#',
    '####S#######D###',
    '#......#.......#',
    '#.####.#.#####.#',
    '#.#..#.#.#...#.#',
    '#.#..D.L.#...D.#',
    '#.####.#.#####.#',
    '#......#.......#',
    '################',
    '################',
  ],
  exits: [
    { x: 1, y: 1, to: 'shelf', tx: 24, ty: 20, tf: SOUTH, label: 'You climb back into the farmyard.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 2, id: 'mill_in', once: true, text: 'The cellar is far larger than the house above it. The walls are older than the farm.' },
    { kind: 'chest', x: 3, y: 3, id: 'mill_c1', gold: 35, items: ['key_iron', 'potion_heal'] },
    { kind: 'event', x: 10, y: 3, id: 'mill_lantern', once: true, text: 'A dead Lantern in grey robes lies against the wall, a cracked survey wand beside her. A note in her hand: "Not failing. CUT. The Grove Stone is next. Tell Vask nothing."' },
    { kind: 'chest', x: 12, y: 4, id: 'mill_c2', gold: 20, items: ['survey_wand', 'potion_sp', 'antidote'] },
    { kind: 'sign', x: 12, y: 8, text: 'Scratched into the wall in fresh marks: THE HEARTH IS A CAGE.' },
    { kind: 'chest', x: 11, y: 10, id: 'mill_c3', gold: 60, items: ['shortbow', 'potion_heal', 'rations', 'rations'] },
    { kind: 'event', x: 6, y: 11, id: 'mill_rift', once: true, text: 'The air here is wrong. The corridor ahead is lit from below by a red seam in the floor, and the stone around it has gone smooth as glass.' },
    { kind: 'event', x: 3, y: 10, id: 'mill_core', once: true, text: 'The Rift. A tear in the floor the size of a door, breathing heat. Beside it, a fist-sized shard of worked stone that hums against your teeth. A Wardstone shard.' },
    { kind: 'chest', x: 4, y: 10, id: 'mill_shard', gold: 0, items: ['potion_heal', 'potion_heal'] },
  ],
  encounters: [
    { id: 'm_rats', x: 5, y: 1, monsters: ['rat', 'rat', 'rat', 'rat'], aware: 5, respawn: 1440 },
    { id: 'm_slime', x: 1, y: 6, monsters: ['slime', 'slime'], aware: 3, respawn: 1440 },
    { id: 'm_cult1', x: 9, y: 1, monsters: ['cultist', 'cultist'], aware: 5 },
    { id: 'm_cult2', x: 14, y: 6, monsters: ['cultist', 'bandit_archer'], aware: 5 },
    { id: 'm_skel', x: 8, y: 8, monsters: ['skeleton', 'skeleton', 'slime'], aware: 4, respawn: 2880 },
    { id: 'm_skel2', x: 14, y: 13, monsters: ['skeleton', 'skeleton', 'skeleton'], aware: 4, respawn: 2880 },
    { id: 'm_rift1', x: 6, y: 8, monsters: ['riftling', 'riftling'], aware: 5 },
    { id: 'm_rift2', x: 1, y: 13, monsters: ['riftling', 'riftling', 'riftling'], aware: 5 },
    { id: 'm_warden', x: 3, y: 11, monsters: ['rift_warden', 'riftling'], aware: 2, roams: false },
  ],
};
