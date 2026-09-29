// Beneath the Grove, level one: the roots. Two halves joined only by a locked door; the key is in
// a room behind a secret door on the west side. The stairs down are in the south-east room.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { TEAR_CLOSED } from './grove2.ts';

export const GROVE1: MapDef = {
  id: 'grove1',
  name: 'The Grove Roots',
  kind: 'dungeon',
  band: [6, 9],
  region: 'thornmark',
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
    { kind: 'chest', x: 3, y: 3, id: 'g1_c1', gold: 120, items: ['grove_staff+1', 'elixir', 'potion_sp'] },
    { kind: 'event', x: 6, y: 6, id: 'g1_marks', once: true, text: 'Chisel marks on the root-wall, fresh and white. A trail of stone grit leads south.' },
    { kind: 'chest', x: 3, y: 10, id: 'g1_key', gold: 80, items: ['key_iron', 'lantern_oil'] },
    { kind: 'sign', x: 6, y: 11, text: 'Scratched beside the iron door: THE STONE IS A LOCK. WE HAVE THE KEY.' },
    { kind: 'event', x: 6, y: 11, id: 'g1_grit', once: true, text: 'The grit trail ends here, heaped against the root-wall to the west. The roots there have been trained around something.' },
    { kind: 'event', x: 8, y: 11, id: 'g1_east', once: true, text: 'The air is warmer past the door, and the roots here are dead and grey.' },
    { kind: 'chest', x: 10, y: 3, id: 'g1_c2', gold: 150, items: ['elfbow+1', 'potion_heal', 'potion_heal'] },
    { kind: 'chest', x: 12, y: 11, id: 'g1_c3', gold: 200, items: ['brigandine+1', 'elixir'] },
    { kind: 'event', x: 11, y: 11, id: 'g1_stairs', once: true, text: 'A stair, and beside it a dead elf in Thornhold green, a week gone. Her hands are burned to the wrist.' },
    // The Elder's Four (#219): the other two dead, one in each half, and Meva, the fourth, alive in
    // the east half's dead end until the company answers her. Keyne, in Thornhold, asked.
    { kind: 'event', x: 1, y: 12, id: 'g1_ruan', once: true, text: 'An elf in Thornhold green, face down in the dead roots, a bow beside him with the string still on. He is nineteen, or was.' },
    { kind: 'event', x: 14, y: 10, id: 'g1_mylor', once: true, text: 'A third, in green, curled against the grey roots as if they were warm. His hands are burned, like the woman\'s at the stair.' },
    { kind: 'npc', x: 12, y: 4, name: 'Meva, the fourth', lines: [
      'In a dead end of the roots a young elf sits in a grey robe too big for her, with her Thornhold green folded beside her, very neatly, as if she meant to give it back.',
      '"Don\'t. I know what I\'m wearing. They gave it me when I stopped screaming, and they were kind, the way people are kind to a dog they\'ve decided to keep." Her hands are not burned. "I went under with Ruan and Breaca and Mylor. I watched the tear take Breaca. I put my hands up, and the grey men put a robe on me, and I found I was still alive, and I have not worked out since whether that was a thing I chose."',
      '"I\'m not going home. Not in this, and not in that. Tell my mother I died by the stair with Breaca. Tell her it was quick. It\'s the only true thing left to say."',
    ], until: [{ flag: 'q_four_truth' }, { flag: 'q_four_lie' }], choice: {
      ask: '"Well? Will you tell them I\'m dead?"',
      answers: [
        { label: 'We\'ll tell them the truth.', sets: 'q_four_truth', says: [
          '"The truth." She picks up the folded green and holds it, and does not put it on. "Then tell it all. That I put my hands up. That I was fed. That I am alive, and I know what that cost." She turns her face to the roots. "Go on. I\'d like to be alone with it before they are."',
        ] },
        { label: 'We\'ll tell them you died there.', sets: 'q_four_lie', says: [
          '"Thank you." She says it the way you would thank someone for closing a door. "Breaca and I, by the stair. Quick." She holds the folded green against her. "Go on. Before I change my mind about which of us is dead."',
        ] },
      ],
    } },
  ],
  secrets: [{ x: 5, y: 11, hint: 'g1_grit' }],
  encounters: [
    { id: 'g1_spiders', x: 3, y: 1, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 1440 },
    { id: 'g1_wolves', x: 6, y: 3, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'g1_zealots', x: 2, y: 6, monsters: ['zealot', 'ashen_adept', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand'], aware: 5, respawn: 2880 },
    { id: 'g1_knights', x: 4, y: 8, monsters: ['bone_knight', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton'], aware: 4, respawn: 2880 },
    { id: 'g1_hounds', x: 6, y: 13, monsters: ['rift_hound', 'rift_hound', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 6, respawn: 2880, until: TEAR_CLOSED },
    { id: 'g1_keeper', x: 3, y: 11, monsters: ['wraith', 'bone_knight', 'bone_knight'], aware: 2, roams: false },
    { id: 'g1_zealots2', x: 13, y: 1, monsters: ['zealot', 'ashen_adept', 'ashen_adept', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand'], aware: 5, respawn: 2880 },
    { id: 'g1_elders', x: 13, y: 13, monsters: ['riftling_elder', 'riftling', 'riftling', 'riftling', 'riftling', 'riftling', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 2880, until: TEAR_CLOSED },
    { id: 'g1_stairguard', x: 10, y: 11, monsters: ['bone_knight', 'bone_knight', 'bone_knight', 'wraith'], aware: 3, roams: false },
  ],
};
