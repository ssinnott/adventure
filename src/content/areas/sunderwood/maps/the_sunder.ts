// The Sunder, level one: the ledges. Through the way cut into the rock on K3's first landing, a stair
// comes out lower on the gorge's east face, onto ledges a square wide that go down it in the rain; black glass grown out of
// the face at the first landing; glass threads strung across the drop from face to face, one thick
// enough to walk and the spiders on it; the west face's ledges, north to the gleaners' cleft and south
// to the last landing, where a stair goes down to the floor. Band 14-15; docs/areas/sunderwood.md
// §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH, WEST } from '../../../../game/types.ts';

export const THE_SUNDER: MapDef = {
  id: 'the_sunder',
  name: 'The Sunder',
  kind: 'dungeon',
  band: [14, 15],
  region: 'sunderwood',
  start: { x: 28, y: 2, facing: SOUTH },
  palette: { wall: '#4a4850', wallDark: '#2e2c34', floor: '#3a3840', ceiling: '#0c0b10', door: '#3a3840', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#2c2e38' },
  bare: true,
  // The glass threads strung across the drop: walked a square wide.
  legend: { x: { terrain: 'crystal' } },
  rows: [
    '###########vvvvvvvvvv###########',
    '###########vvvvvvvvvv#######.###',
    '###########vvvvvvvvvv#######.###',
    '###########vvvvvvvvvv#######.###',
    '###########vvvvvvvvvv"######.###',
    '###########vvvvvvvvvv"######.###',
    '########..."vvvvvvvvv".......###',
    '########..."vvvvvvvvv"##########',
    '###########"vvvvvvvvv"##########',
    '###########"vvvvvvvvv"##########',
    '###########"vvvvvvvvv"ccc#######',
    '###########"vvvvvvvvv""""c######',
    '###########"vvvvvvvvv""""c######',
    '###########"vvvvvvvvv""""c######',
    '###########"vvvvvvvvv"ccc#######',
    '###########"vvvvvvvvv"##########',
    '###########""vvvvvvv""##########',
    '############"vvvvvvv"###########',
    '############"vvvvvvv"###########',
    '############"vvvvvvv"###########',
    '############"xxxxxxx"###########',
    '############"vvvvvvv############',
    '############"vvvvvvv############',
    '############"vvvvvvv############',
    '############"vvvvvvv############',
    '############"vvvvvvv############',
    '############"vvvvvvv############',
    '########"""""vvvvvvv############',
    '########"""""vvvvvvv############',
    '#####..."""""vvvvvvv############',
    '#####.######vvvvvvvv############',
    '############vvvvvvvv############',
  ],
  exits: [
    { x: 28, y: 1, to: 'eaves_k3', tx: 9, ty: 8, tf: WEST, label: 'Back up the stair, out onto the landing and the rain.' },
    { x: 5, y: 30, to: 'the_sunder2', tx: 8, ty: 2, tf: SOUTH, label: 'Down the cut stair, to the floor.' },
  ],
  features: [
    { kind: 'event', x: 28, y: 3, id: 'su1_in', once: true, text: 'A stair cut down inside the rock, the chipping fresh and white on every step. The rain is a sound now, not a weight.' },
    { kind: 'event', x: 23, y: 6, id: 'su1_face', once: true, text: 'The stair comes out lower on the east face, onto a ledge a square wide. Rain on one hand, the drop on the other, and still no bottom to it.' },
    { kind: 'event', x: 22, y: 12, id: 'su1_glass', once: true, text: 'The first landing. Black glass has grown out of the face round it, and in the glass the white light, low and steady, lighting the rain as it passes.' },
    { kind: 'event', x: 20, y: 17, id: 'su1_threads', once: true, text: 'Threads of glass strung across the gorge, face to face, fine as hair, more than you can count. The rain beads on them and they do not sway.' },
    { kind: 'event', x: 20, y: 20, id: 'su1_thread', once: true, text: 'One thread is thick enough to walk, a square wide, out over the drop. Things are on it, further out, and they stop moving when you do.' },
    { kind: 'event', x: 11, y: 12, id: 'su1_chipped', once: true, text: 'The face is chipped through to the glass in holes the size of a fist, row on row, the light looking out of each. Somebody has been at this a long time.' },
    { kind: 'event', x: 10, y: 7, id: 'su1_cleft', once: true, text: 'A cleft off the ledge, a hide pegged over its mouth, the pegs new. Under it, dry, a chest, and a sack of shards lit through the cloth.' },
    { kind: 'chest', x: 8, y: 6, id: 'su1_cache', gold: 250, items: ['plate+2'] },
    { kind: 'event', x: 12, y: 24, id: 'su1_below', once: true, text: 'Still no bottom. But a sound now, under the rain: water falling a long way, and landing, small.' },
    { kind: 'event', x: 10, y: 28, id: 'su1_landing', once: true, text: 'The last landing, and the ledges end. A stair goes down into the rock, cut square, chip marks on the treads, and the rain stays above it.' },
  ],
  encounters: [
    { id: 'su1_spiders', x: 16, y: 20, monsters: ['glass_spider', 'glass_spider', 'glass_spider', 'glass_spider'], aware: 3, respawn: 2880, roams: false },
  ],
};
