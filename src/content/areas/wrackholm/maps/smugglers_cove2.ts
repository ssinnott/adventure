// Kelp Hole, level two: the sea cave under the crews' cave, where the tide breathes in and out
// through pools among the rocks. The third crew at the ledge's foot, devilfish in the pools, and the
// Great Devilfish in the black pool at the back with the boy who feeds it. A flooded passage behind
// the west wall, where the tide-mark stops short of the roof, lets out on the isle's shore: a way
// out and not in. Band 12-14; docs/areas/wrackholm.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const SMUGGLERS_COVE2: MapDef = {
  id: 'smugglers_cove2',
  name: 'The Sea Cave',
  kind: 'dungeon',
  band: [12, 14],
  region: 'wrackholm',
  start: { x: 1, y: 1, facing: SOUTH },
  palette: { wall: '#4a5450', wallDark: '#2e3532', floor: '#33403a', ceiling: '#1e2624', door: '#3a4a44', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#2a5a4a' },
  rows: [
    '################',
    '#..#####~~~~####',
    '#..###~~~~..~###',
    '#.....~~...~..##',
    '##.....~~.....##',
    '###.##.....~~..#',
    '#~~..#~~.##....#',
    '#~~......##~~..#',
    '#~~~......#~~..#',
    '##~~~.~~..#~...#',
    '###......~~~...#',
    '#..S..~~~~.....#',
    '#.###..~~~~~...#',
    '#.###...~~~~~..#',
    '#.####..~~~~~..#',
    '################',
  ],
  exits: [
    { x: 1, y: 1, to: 'smugglers_cove', tx: 4, ty: 3, tf: SOUTH, label: 'You climb the ledge back up to the crews\' cave.' },
    { x: 1, y: 14, to: 'wrackholm_e6', tx: 30, ty: 29, tf: NORTH, label: 'You wade out of the dark onto the sand under the moor.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 2, id: 'kh2_in', once: true, text: 'The sea cave. The tide breathes in and out of it. Something in the dark at the back breathes with it, slower, and bigger.' },
    { kind: 'event', x: 7, y: 7, id: 'kh2_pools', once: true, text: 'Pools among the rocks, deep and still. Kelp lies over them like hair. In one, something draws an arm back under.' },
    { kind: 'chest', x: 13, y: 3, id: 'kh2_purse', gold: 180, items: ['potion_sp'] },
    { kind: 'event', x: 14, y: 9, id: 'kh2_kelp', once: true, text: 'Kelp heaps the east rocks, slick and brown. The floor between is clean, as if something comes through it often.' },
    { kind: 'event', x: 4, y: 11, id: 'kh2_tidemark', once: true, text: 'Dried weed lines the wall at head height, level as a shelf. By the west wall it breaks, and the stone below is scoured bare.' },
    { kind: 'event', x: 1, y: 12, id: 'kh2_passage', once: true, text: 'The water is at your chest and cold through. The roof comes down to meet it. Ahead, a grey light lies on the surface.' },
    { kind: 'event', x: 6, y: 13, id: 'kh2_bones', once: true, text: 'Fish heads heaped by the black pool, eyes gone white. Among them a boot, a buckle, and a thin bone that is not a fish\'s.' },
    // Tam, who feeds it (#56's 28), a square short of it while it lives. His words once it is dead, and
    // his going home, are #192's.
    { kind: 'npc', x: 13, y: 12, name: 'Tam, who feeds it', lines: [
      'A boy of sixteen stands at the edge of the black pool with a bucket of fish heads, and throws them in one at a time, and counts between. Something under the water takes each before it sinks.',
      '"Don\'t. Don\'t come nearer than me. It knows me." He throws another. "Tam. From Saltmouth, off the steps. They put me here in the spring when the last one got careless, and I\'ve not been careless. It spares whoever feeds it. That\'s the whole of the arrangement, and I keep it."',
      '"Mam sent you. Tell her I\'m alive. Tell her the pay stopped because they stopped paying, not because of me. And go back up. If you kill it they\'ll kill me, and if you don\'t, I\'m all right here. I\'m all right."',
    ], until: { slain: 'smugglers_cove2:kh2_great_devilfish' } },
    { kind: 'chest', x: 14, y: 14, id: 'kh2_hoard', gold: 300, items: ['elixir'] },
  ],
  secrets: [{ x: 3, y: 11, hint: 'kh2_tidemark' }],
  encounters: [
    { id: 'kh2_crew', x: 3, y: 4, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'], back: 2, aware: 3, respawn: 2880 },
    { id: 'kh2_devilfish_west', x: 8, y: 8, monsters: ['devilfish', 'devilfish', 'devilfish', 'devilfish'], aware: 2, roams: false, respawn: 2880 },
    { id: 'kh2_devilfish_east', x: 13, y: 6, monsters: ['devilfish', 'devilfish', 'devilfish', 'devilfish'], aware: 2, roams: false, respawn: 2880 },
    { id: 'kh2_great_devilfish', x: 13, y: 13, monsters: ['great_devilfish'], aware: 1, roams: false },
  ],
};
