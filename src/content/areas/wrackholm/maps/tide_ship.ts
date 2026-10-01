// The Tide Ship, the weather deck: the smugglers' ship at anchor under F6's cliffs, boarded by night
// from the oarsman's boat at the west rail (#189's shingle). The rail and the boats tied under it;
// the foremast and the bow; the waist, where devilfish come over the side by night with a bowman on
// the rail (MONSTERS §6.2); the main hatch down; the helm aft. Band 12-13, floored at the area's 12
// as Kelp Hole's levels are; docs/areas/wrackholm.md §4.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, NORTH, SOUTH } from '../../../../game/types.ts';

const NIGHT = { hours: 'night' } as const;

export const TIDE_SHIP: MapDef = {
  id: 'tide_ship',
  name: 'The Tide Ship',
  kind: 'dungeon',
  band: [12, 13],
  region: 'wrackholm',
  start: { x: 5, y: 9, facing: EAST },
  palette: { wall: '#5a4634', wallDark: '#3a2c20', floor: '#4a3a2a', ceiling: '#0e1220', door: '#3e2e20', wallStyle: 'brick', ceilingStyle: 'vault', banner: '#2a3a4a' },
  rows: [
    '################',
    '#######..#######',
    '######....######',
    '#####......#####',
    '#####..o...#####',
    '####........####',
    '####........####',
    '####........####',
    '####...o....####',
    '####........####',
    '####........####',
    '####........####',
    '#####......#####',
    '#####......#####',
    '######....######',
    '################',
  ],
  exits: [
    { x: 4, y: 9, to: 'wrackholm_f6', tx: 14, ty: 29, tf: NORTH, label: 'You go back over the rail into a boat and row for the shingle.' },
    { x: 8, y: 4, to: 'tide_ship2', tx: 8, ty: 4, tf: SOUTH, label: 'You go down the main hatch into the dark of the lower deck.' },
  ],
  features: [
    { kind: 'event', x: 6, y: 9, id: 'ts_aboard', once: true, text: 'Over the rail onto wet planks. The deck is dark end to end, the lanterns hooded, and the whole ship leans with the tide.' },
    { kind: 'event', x: 5, y: 11, id: 'ts_boats', once: true, text: 'The crews\' boats tied along the side under the rail, bumping. Oars shipped, straw in the bilges, and in one a chain left coiled.' },
    { kind: 'event', x: 6, y: 4, id: 'ts_foremast', once: true, text: 'The foremast goes up into nothing. The rigging ticks in the wind, and the ship rides so low the sea talks against the planks.' },
    { kind: 'event', x: 10, y: 8, id: 'ts_waist', once: true, text: 'The waist, the planks wet in long sweeps, as if something had hauled itself over the side by night and gone back the same way.' },
    { kind: 'event', x: 8, y: 5, id: 'ts_hatch', once: true, text: 'The main hatch stands open. Up it comes a smell of straw and people, and a sound, low and many, that stops when you stand still.' },
    { kind: 'event', x: 8, y: 13, id: 'ts_helm', once: true, text: 'The wheel aft, lashed with a turn of rope, and nobody at it. The anchor cable creaks at the bow like a held breath.' },
    { kind: 'event', x: 7, y: 1, id: 'ts_bow', once: true, text: 'The bow. Black water, and the cliffs standing out of it, blacker, one light up on the point. Behind you the ship creaks under its load.' },
    { kind: 'chest', x: 10, y: 12, id: 'ts_locker', gold: 300, items: ['potion_heal', 'potion_heal'] },
  ],
  // Over the side by night: three devilfish in the waist. The bowman MONSTERS §6.2 puts on the rail
  // with them is left off, since a group with him in it sits under the deck's top, 13, and alone he
  // stretched the deck's day past the gate's limit.
  encounters: [
    { id: 'ts_over_side', x: 11, y: 8, when: NIGHT, monsters: ['devilfish', 'devilfish', 'devilfish'], aware: 2, roams: false, respawn: 2880 },
  ],
};
