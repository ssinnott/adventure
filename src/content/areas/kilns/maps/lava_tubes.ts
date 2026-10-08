// Feuerstollen, level one: the fire adit. The dwarves' adit comes in from O6's ridge, timbered, and
// breaks into a lava tube, round and black and glassy, running west and east. West, the tube goes
// down past a cooled side tube, where the beetles keep, to a chamber where the fire shows through the
// floor in pools and the salamanders lie on it; east, it climbs to a fork, where a bore no fire made
// goes off to the worm's hollow, and the tube winds on north. The two ways meet in the north tube,
// whose floor drops away steeply down to the deep tubes. Band 16-17; docs/areas/kilns.md §4.11 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH, WEST } from '../../../../game/types.ts';

export const LAVA_TUBES: MapDef = {
  id: 'lava_tubes',
  name: 'Feuerstollen',
  kind: 'dungeon',
  band: [16, 17],
  region: 'kilns',
  start: { x: 7, y: 14, facing: NORTH },
  // Black rock, glassy where the fire ran, and the fire under the floor in places; nothing hangs on
  // the walls of a tube no dwarf dug past the adit.
  palette: { wall: '#4a4240', wallDark: '#2a2422', floor: '#2e2826', ceiling: '#18120f', door: '#4a3c2c', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#8a2a1a' },
  bare: true,
  rows: [
    '################',
    '#######"########',
    '####"""""""#####',
    '#""""#####"#####',
    '#"!!"#####"#####',
    '#""""#####""####',
    '#"!""######""###',
    '##"#########"""#',
    '##"#########"#"#',
    '##"#########"#"#',
    '##"#########"#"#',
    '##""!""""""""#"#',
    '####"##:#####""#',
    '##"""##:#####"##',
    '#######:########',
    '################',
  ],
  exits: [
    // The adit's foot, back up to the ridge on O6, out under the words (ADIT, kilnsheart_o6.ts).
    { x: 7, y: 14, to: 'kilnsheart_o6', tx: 21, ty: 20, tf: WEST, label: 'You climb the adit, the rock going from glass to timber, and come out under the words into the ash.' },
    { x: 7, y: 1, to: 'lava_tubes2', tx: 7, ty: 2, tf: SOUTH, label: 'You go down the steep floor of the tube, the heat rising round you, into the deep tubes.' },
  ],
  features: [
    { kind: 'event', x: 7, y: 13, id: 'lt1_adit', once: true, text: 'The dwarves\' adit, cut square and timbered, the props charred black. Ahead the rock turns dark and glassy.' },
    { kind: 'event', x: 7, y: 11, id: 'lt1_break', once: true, text: 'The adit ends where the picks broke into a tube: round, black and smooth as glass, running off both ways.' },
    // West: the floor thin over the fire, the cooled side tube and what the cutters left in it.
    { kind: 'event', x: 4, y: 11, id: 'lt1_floor', once: true, text: 'The floor of the tube is thin here. The fire shows red through it, and the heat comes up through your boots.' },
    { kind: 'event', x: 4, y: 12, id: 'lt1_cooled', once: true, text: 'A side tube, cooled and dark, its floor set in ropes where the rock stopped running.' },
    { kind: 'event', x: 2, y: 13, id: 'lt1_pack', once: true, text: 'A cutter\'s pack against the wall, scorched through, and under it a strongbox nobody came back for.' },
    { kind: 'chest', x: 2, y: 13, id: 'lt1_pack_chest', gold: 300, items: ['potion_heal'] },
    // Up the west tube to the chamber where the salamanders lie on the fire.
    { kind: 'event', x: 2, y: 9, id: 'lt1_tracks', once: true, text: 'Tracks in the soot on the tube\'s walls, small hands spread wide, all going up toward the heat.' },
    { kind: 'event', x: 3, y: 3, id: 'lt1_chamber', once: true, text: 'The tube opens into a chamber, the fire showing through its floor in pools. Things have lain on them.' },
    // The north tube, and the slope down.
    { kind: 'event', x: 5, y: 2, id: 'lt1_north', once: true, text: 'The tube runs on east, its roof low and black, glazed in drips that hang like teeth.' },
    { kind: 'event', x: 7, y: 2, id: 'lt1_slope', once: true, text: 'The tube\'s floor drops away here, steep and hot, down into the dark.' },
    // East: the climb, the fork and the bore no fire made, and the worm's hollow at its end.
    { kind: 'event', x: 12, y: 9, id: 'lt1_climb', once: true, text: 'The tube climbs, its floor worn smooth in a groove down the middle, as if something heavy goes up and down it.' },
    { kind: 'event', x: 12, y: 7, id: 'lt1_bore', once: true, text: 'Off the tube a bore goes into the rock, round as a barrel, its walls polished and not glazed.' },
    { kind: 'event', x: 14, y: 9, id: 'lt1_rubble', once: true, text: 'Rubble at the bore\'s lip, fresh, and the polish on its walls unscratched by any pick.' },
    { kind: 'event', x: 11, y: 5, id: 'lt1_bend', once: true, text: 'The tube winds, and the air in it moves, hot, up from somewhere below and out toward the adit.' },
  ],
  encounters: [
    // Fire beetles in the cooled side tube; salamanders on the chamber's fire and in the north tube; at
    // the bore's end a rock worm in its hollow, the level's group at 17.
    { id: 'lt1_beetles', x: 3, y: 13, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440, roams: false },
    { id: 'lt1_salamanders', x: 2, y: 5, monsters: ['salamander', 'salamander', 'salamander', 'salamander'], aware: 3, respawn: 1440, roams: false },
    { id: 'lt1_salamanders_n', x: 10, y: 4, monsters: ['salamander', 'salamander', 'salamander', 'salamander'], aware: 3, respawn: 1440, roams: false },
    { id: 'lt1_worm', x: 13, y: 13, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
