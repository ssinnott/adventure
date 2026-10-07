// Feuerstollen, level two: the deep tubes. The steep floor from above comes down into tubes hotter
// than the first, the fire under a crust of floor along them, and a cross tube runs west and east from
// its foot. West, past the salamanders, the tube's walls go square where the heat drops away, and
// behind them a tube that was cut and not run ends at a plate nothing opens; the middle is choked
// with a flow that set; east, past more salamanders, the tube opens into the deepest chamber, its
// floor all fire, where the Great Salamander lies. Band 17-18; docs/areas/kilns.md §4.11 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const LAVA_TUBES2: MapDef = {
  id: 'lava_tubes2',
  name: 'The Deep Tubes',
  kind: 'dungeon',
  band: [17, 18],
  region: 'kilns',
  start: { x: 7, y: 2, facing: SOUTH },
  // The black rock running red nearer the fire, and nothing hung on it.
  palette: { wall: '#4e3a34', wallDark: '#2e1e1a', floor: '#30221e', ceiling: '#1a0e0c', door: '#4a3c2c', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#8a2a1a' },
  bare: true,
  // The plate the square tube ends at: a wall with a seam drawn in it, which nothing opens.
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    '################',
    '#######"########',
    '#######"########',
    '#######"########',
    '#######"########',
    '###""!""""""####',
    '###"###"###"####',
    '###"###"###""###',
    '###"#######""###',
    '##""#######"####',
    '##"#####"!"!"###',
    '##S#####"!!!"###',
    '##.#####"!"!"###',
    '##.######"""####',
    '##Z#############',
    '################',
  ],
  exits: [
    { x: 7, y: 1, to: 'lava_tubes', tx: 7, ty: 2, tf: SOUTH, label: 'You climb the steep floor of the tube, out of the worst of the heat.' },
  ],
  features: [
    { kind: 'event', x: 7, y: 3, id: 'lt2_in', once: true, text: 'The steep floor levels out in tubes hotter than those above. Ahead the fire shows through the floor in the dark.' },
    { kind: 'event', x: 7, y: 5, id: 'lt2_cross', once: true, text: 'A cross tube runs west and east. From the east comes a slow sound, like bellows working.' },
    { kind: 'event', x: 5, y: 5, id: 'lt2_crust', once: true, text: 'The floor here is a crust, and under it the fire moves. It gives a little under your weight.' },
    // The middle: choked with a flow that set before it reached the end.
    { kind: 'event', x: 7, y: 7, id: 'lt2_choked', once: true, text: 'The tube is choked with a flow that cooled where it stopped, set in black ropes to the roof.' },
    // West: the walls go square where the heat drops away; behind them, the tube that was cut and
    // not run, and the plate at its end.
    { kind: 'event', x: 3, y: 9, id: 'lt2_narrow', once: true, text: 'The tube narrows and turns, its glassy walls running with the heat.' },
    { kind: 'event', x: 2, y: 10, id: 'lt2_square', once: true, text: 'Here the tube\'s walls go square, and the heat drops away, as if a door stood open somewhere.' },
    { kind: 'event', x: 2, y: 12, id: 'lt2_cut', once: true, text: 'Past the opening the tube runs on square and straight, its walls flat and cool to the hand.' },
    { kind: 'event', x: 2, y: 13, id: 'lt2_plate', once: true, text: 'The square tube ends at a plate set in the rock, smooth and seamless. Against it, picks worn to stubs.' },
    { kind: 'chest', x: 2, y: 13, id: 'lt2_plate_chest', gold: 600, items: [] },
    // East: the tube to the deepest chamber, and the chamber.
    { kind: 'event', x: 11, y: 5, id: 'lt2_east', once: true, text: 'East the tube bends down, and the bellows sound comes up it, slow, with heat on every breath.' },
    { kind: 'event', x: 11, y: 9, id: 'lt2_chamber', once: true, text: 'The tube opens on the deepest chamber, round, its whole floor fire under a skin of rock.' },
  ],
  secrets: [{ x: 2, y: 11, hint: 'lt2_square' }],
  encounters: [
    // Salamanders in the west tube and the east; in the deepest chamber, the Great Salamander, boss at
    // 18, which never comes back and drops its hide.
    { id: 'lt2_salamanders_w', x: 3, y: 7, monsters: ['salamander', 'salamander', 'salamander', 'salamander'], aware: 3, respawn: 1440, roams: false },
    { id: 'lt2_salamanders_e', x: 12, y: 7, monsters: ['salamander', 'salamander', 'salamander', 'salamander', 'salamander'], aware: 3, respawn: 1440, roams: false },
    { id: 'lt2_great_salamander', x: 10, y: 11, monsters: ['great_salamander'], aware: 2, roams: false, slainText: 'The Great Salamander sinks into its own fire, and the fire goes out of it. Its hide cools grey on the rock.' },
  ],
};
