// The stair's foot, under the Tide Ship's hold: one room of the Dead-Drop's country, 26-28, with the
// way back up, and at its far end, 4,1, the way on down into the drop (dead_drop, #22). It holds no group
// and no chest; the sign is the warning, not a wall (EXPANSION §5.2). docs/areas/wrackholm.md §4.5 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const DEAD_DROP_STAIR: MapDef = {
  id: 'dead_drop_stair',
  name: 'The Stair\'s Foot',
  kind: 'dungeon',
  band: [26, 28],
  region: 'wrackholm',
  start: { x: 4, y: 7, facing: NORTH },
  palette: { wall: '#8a8c90', wallDark: '#5e6064', floor: '#6a6c70', ceiling: '#4a4c50', door: '#5a5c60', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a3c40' },
  bare: true,
  rows: [
    '##########',
    '####..####',
    '###....###',
    '###....###',
    '###....###',
    '###....###',
    '####..####',
    '####..####',
    '##########',
  ],
  exits: [
    { x: 4, y: 7, to: 'tide_ship3', tx: 7, ty: 13, tf: NORTH, label: 'You climb the stair back up into the straw and the stink of the hold.' },
    // The far end, on down to the drop's first square, facing in; the drop's way back up lands in front of it.
    { x: 4, y: 1, to: 'dead_drop', tx: 3, ty: 1, tf: SOUTH, label: 'The way goes down a long while, and the light goes with you.' },
  ],
  features: [
    { kind: 'event', x: 4, y: 6, id: 'dd_foot', once: true, text: 'The stair ends on a floor too level to have been laid. The walls are smooth and cold and lit from nowhere. Nothing in the air is yours.' },
    // Its square in front of the way on, one in from it, as dd_foot is from the stair.
    { kind: 'event', x: 4, y: 2, id: 'dd_door', once: true, text: 'At the far end a way goes on, down and down, not a door and not a stair, the light going with it. Low in the walls something says a word, too soft to catch.' },
  ],
};
