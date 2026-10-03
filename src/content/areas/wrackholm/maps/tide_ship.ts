// The Tide Ship, the weather deck: the smugglers' ship at anchor under F6's cliffs, boarded by night
// from the oarsman's boat at the west rail (#189's shingle). The rail and the boats tied under it;
// the foremast and the bow; the waist, where devilfish come over the side by night with a bowman on
// the rail (MONSTERS §6.2); the main hatch down; the helm aft. Band 12-13, floored at the area's 12
// as Kelp Hole's levels are; docs/areas/wrackholm.md §4.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, NORTH, SOUTH } from '../../../../game/types.ts';

const NIGHT = { hours: 'night' } as const;

/** The freed on deck with Hale, from his freeing in the hold until he is told where they go (#192). */
const WAITING = { after: { flag: 'q_hale_freed' }, until: [{ flag: 'q_column_saltmouth' }, { flag: 'q_column_road' }] } as const;

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
    // Every Name in the Column (#192): freed from the hold, Hale waits at the rail over the boats with
    // the thirty, Wat's elder boy among them, for the clerk's book from the cabin below, and asks
    // where they go. Answered, they are gone with him.
    { kind: 'npc', x: 5, y: 10, name: 'Captain Hale, Warden of the Scarth', flag: 'q_column', lines: [
      'Hale sits with his back to the rail, over the boats, the freed round him on the wet planks, and rubs his wrists, and looks along them the way he looked along the rows.',
      '"There\'s a book. The clerk had it in the cabin aft, below; they read from it when a cargo went down, name by name, and ticked. I\'ve heard every name in that hold read out once, and I\'ve had nothing to do for a month but remember them."',
      '"Fetch the book. Then we go down the names with it, and every name that\'s here gets sent home, and every name that isn\'t, we\'ll know where it went. I know where it went. I want it in ink, so I\'m not the only one."',
    ],
      says: [
        { after: { item: 'clerks_book' }, sets: 'q_column', lines: [
          'Hale takes the book and reads it by the hooded lamp, a finger down the column, and does not hurry, and does not skip the ticked ones. "That\'s the book. The girl\'s in it."',
        ], choice: { ask: '"Thirty here and the rest below, by the deep mine, and they can\'t stay on a ship or walk past my own post. Saltmouth\'s a day by the boat, the coast road a week and home: where do they go?"', answers: [
          { label: 'Saltmouth, by the boat.', sets: 'q_column_saltmouth', says: [
            '"Saltmouth. Aye. A day, and a roof, and Tallis\'s town, which is a thing I\'ll have to think about later." He gets up, which costs him. "The Compact\'s quay will see thirty of its own cargo walk off a boat onto it. Good. Let it look."',
            '"Somebody there will write their names down again, for kinder reasons. Somebody usually does."',
          ] },
          { label: 'Home, up the coast road.', sets: 'q_column_road', says: [
            '"The road. A week on their feet, and the pass at the end of it, held by men I don\'t know." He almost smiles. "They\'ll know me. Half of them are Foreland. Wat\'s boy from Gullwick is among them."',
            '"Home, then. It\'s further, and it\'s theirs. I\'d have said the same about the pass, once."',
          ] },
        ] } },
        { after: { flag: 'q_column' }, lines: [
          'Hale has not moved from the rail. "The clerk\'s book. The cabin aft, down the hatch. We\'ll wait; none of us is going anywhere without it."',
        ] },
      ], ...WAITING },
    { kind: 'npc', x: 6, y: 11, name: 'Wat\'s elder boy, of Gullwick', lines: [
      'A young man with a boat-builder\'s hands and no flesh on them sits with his back to the rail.',
      '"Gullwick. Wat\'s the boat-builder; I\'m his elder. We took the Patience out the night the light went, and a boat with a shuttered lamp came alongside, and that was that." He looks at his hands. "Is the board up? He\'ll have put it up. He\'d have said the sea had us, and put it up."',
    ], ...WAITING },
    { kind: 'event', x: 7, y: 10, id: 'ts_freed', once: true, ...WAITING, text: 'Thirty on the wet deck, in what they were taken in, close under the rail where the boats are. Nobody goes near the hatch.' },
  ],
  // Over the side by night: four devilfish in the waist. The bowman MONSTERS §6.2 puts on the rail
  // with them is left off, since a group with him in it sits under the deck's top, 13, and alone he
  // stretched the deck's day past the gate's limit.
  encounters: [
    { id: 'ts_over_side', x: 11, y: 8, when: NIGHT, monsters: ['devilfish', 'devilfish', 'devilfish', 'devilfish'], aware: 2, roams: false, respawn: 2880 },
  ],
};
