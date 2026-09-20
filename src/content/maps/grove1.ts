// Beneath the Grove, level one: the roots. Two halves joined only by a locked door; the key is in
// a room behind a secret door on the west side. The stairs down are in the south-east room.
import type { MapDef } from '../../game/map.ts';
import { NORTH, SOUTH } from '../../game/types.ts';

export const GROVE1: MapDef = {
  id: 'grove1',
  name: 'The Grove Roots',
  kind: 'dungeon',
  band: [6, 9],
  start: { x: 1, y: 1, facing: SOUTH },
  palette: { wall: '#6a5a3a', wallDark: '#463a26', floor: '#3a3628', ceiling: '#2c2418', wallStyle: 'stone', ceilingStyle: 'beams', banner: '#2a6a3a' },
  rows: [
    '################',
    '#......#.......#',
    '#.####.#.#####.#',
    '#.#..#.#.#...#.#',
    '#.#..D.#.#...D.#',
    '#.####.#.#####.#',
    '#......#.......#',
    '####D######D####',
    '#......#.......#',
    '#.####.#.#####.#',
    '#.#..#.#.#...#.#',
    '#.#..S.L.#...#.#',
    '#.####.#.##D##.#',
    '#......#.......#',
    '################',
    '################',
  ],
  exits: [
    { x: 1, y: 1, to: 'thornmark', tx: 7, ty: 28, tf: NORTH, label: 'You climb out of the roots into the Grove.' },
    { x: 11, y: 10, to: 'grove2', tx: 1, ty: 1, tf: SOUTH, label: 'Stairs cut into living stone go down. The hum grows.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 2, id: 'g1_in', once: true, text: 'Roots as thick as pillars hold the earth up. Someone has cut steps into them. Recent work.' },
    { kind: 'chest', x: 3, y: 3, id: 'g1_c1', gold: 120, items: ['elixir', 'potion_sp'] },
    { kind: 'event', x: 6, y: 6, id: 'g1_marks', once: true, text: 'Chisel marks on the root-wall, fresh and white. A trail of stone grit leads south.' },
    { kind: 'event', x: 3, y: 13, id: 'g1_grit', once: true, text: 'The grit trail ends at a blank stretch of root-wall to the north. The roots here have been trained around something.' },
    { kind: 'chest', x: 3, y: 10, id: 'g1_key', gold: 80, items: ['key_iron', 'lantern_oil'] },
    { kind: 'sign', x: 6, y: 11, text: 'Scratched beside the iron door: THE STONE IS A LOCK. WE HAVE THE KEY.' },
    { kind: 'event', x: 8, y: 11, id: 'g1_east', once: true, text: 'The air is warmer past the door, and the roots here are dead and grey.' },
    { kind: 'chest', x: 10, y: 3, id: 'g1_c2', gold: 150, items: ['crossbow', 'potion_heal', 'potion_heal'] },
    { kind: 'chest', x: 12, y: 11, id: 'g1_c3', gold: 200, items: ['brigandine', 'elixir'] },
    { kind: 'event', x: 11, y: 11, id: 'g1_stairs', once: true, text: 'A stair, and beside it a dead elf in Thornhold green, a week gone. Her hands are burned to the wrist.' },
  ],
  encounters: [
    { id: 'g1_spiders', x: 3, y: 1, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 1440 },
    { id: 'g1_wolves', x: 6, y: 3, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'g1_zealots', x: 2, y: 6, monsters: ['zealot', 'zealot', 'zealot', 'ashen_adept'], aware: 5, respawn: 2880 },
    { id: 'g1_knights', x: 4, y: 8, monsters: ['bone_knight', 'bone_knight', 'skeleton', 'skeleton', 'skeleton'], aware: 4, respawn: 2880 },
    { id: 'g1_hounds', x: 6, y: 13, monsters: ['rift_hound', 'rift_hound', 'rift_hound'], aware: 6, respawn: 2880 },
    { id: 'g1_keeper', x: 3, y: 11, monsters: ['wraith', 'bone_knight', 'bone_knight'], aware: 2, roams: false },
    { id: 'g1_zealots2', x: 13, y: 1, monsters: ['zealot', 'zealot', 'zealot', 'zealot', 'ashen_adept', 'ashen_adept'], aware: 5, respawn: 2880 },
    { id: 'g1_elders', x: 13, y: 13, monsters: ['riftling_elder', 'riftling_elder', 'riftling', 'riftling', 'riftling', 'riftling'], aware: 5, respawn: 2880 },
    { id: 'g1_stairguard', x: 10, y: 11, monsters: ['bone_knight', 'bone_knight', 'bone_knight', 'wraith'], aware: 3, roams: false },
  ],
};
