// The Spittal, level two: the Infirmary. The stair comes down to a door standing open and a room of
// basins; past it, in the one way into the ward, stands the Infirmarer, the brothers' keeper with no robe,
// the lair's guardian at 32 (MONSTERS §13). In the ward the beds are made up in two rows, the shapes in the
// west row under their sheets; in the last bed a man sits up, long dead, with the Wakerobe in the locker
// beside him (#846). Behind the east wall, where a sheet stirs in the draught, is the cold room where the
// ones who did not wake were laid out with their packs. Band 30-32; docs/areas/rimewater.md §12.5 is its
// brief (#832).
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const SPITTAL2: MapDef<'spittal2'> = {
  id: 'spittal2',
  name: 'The Infirmary',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'rimewater',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#b5b8b4', wallDark: '#7b7e7a', floor: '#575a5c', ceiling: '#1b1d1f', door: '#6d6a62', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#9aa9b2' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '#####.....######',
    '#####.....######',
    '#######.########',
    '#######.########',
    '##........######',
    '##........#..###',
    '##........S..###',
    '##........#..###',
    '##........######',
    '##........######',
    '################',
    '################',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'spittal', at: 'from_spittal2', label: 'You climb the stair out of the warm, round and up, to the cold of the Spittal.' }),
  ],
  features: [
    // The stair's foot and the room of basins before the ward.
    { kind: 'event', x: 7, y: 2, id: 'sp2_foot', once: true, text: 'The stair ends at a door standing open. Beyond it lamps are lit, and the floor is swept.' },
    { kind: 'event', x: 5, y: 3, id: 'sp2_basins', once: true, text: 'Basins along the wall, a towel folded square by each, and the water in them still warm.' },
    // The ward past the Infirmarer: the beds, the shapes in the west row, the man in the last bed and the
    // locker beside him.
    { kind: 'event', x: 6, y: 8, id: 'sp2_ward', once: true, text: 'The ward. Beds in two rows, every one made up tight and turned down, a lamp lit at every head.' },
    { kind: 'event', x: 2, y: 10, id: 'sp2_shapes', once: true, text: 'In the beds along the west wall, shapes under sheets drawn up over their faces. None of them stir.' },
    { kind: 'event', x: 3, y: 12, id: 'sp2_sitter', once: true, text: 'In the last bed a man sits up against the bolster, long dead, his eyes open, a locker beside him.' },
    { kind: 'chest', x: 2, y: 12, id: 'sp2_locker', gold: 0, items: ['wakerobe'] },
    // The secret: the sheet that stirs by the east wall, and the cold room behind the wall.
    { kind: 'event', x: 9, y: 9, id: 'sp2_draught', once: true, text: 'The bed by the east wall is made up like the rest, but its sheet stirs. The draught comes from the wall.' },
    { kind: 'event', x: 11, y: 9, id: 'sp2_cold', once: true, text: 'A cold room behind the ward, where the ones who did not wake were laid out with their packs at their feet.' },
    { kind: 'chest', x: 12, y: 10, id: 'sp2_packs', gold: 500, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 10, y: 9, hint: 'sp2_draught' }],
  encounters: [
    // The guardian: the Infirmarer in the one way into the ward, a boss at 32 that never comes back.
    { id: 'sp2_infirmarer', x: 7, y: 6, monsters: ['infirmarer'], aware: 2, roams: false, boss: true, slainText: 'The Infirmarer stops, its fingers still smoothing a sheet that is not there. The ward is quiet.' },
  ],
};
