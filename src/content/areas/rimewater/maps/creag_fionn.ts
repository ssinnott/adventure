// Creag Fionn, Rimewater's enclave (#845): the cave in the rim's face over L12's pines where the snow
// trolls winter, entered from L12's 11,4 down a ramp of packed snow. Spine eagles sit in the cave's
// mouth and hold the neck behind it; the hall beyond is the trolls' first, its beds trodden in rings,
// with the one stretch of wall they keep bare, and behind it their larder; two snow trolls keep the
// passage to the cave's back, where what they have taken off the dead lies round their bed and
// Trollbrand in it. Band 22-23, a band over Loch Fada's, out of Rimewater's figures;
// docs/areas/rimewater.md §12.4 is its brief (#832).
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const CREAG_FIONN: MapDef = {
  id: 'creag_fionn',
  name: 'Creag Fionn',
  kind: 'dungeon',
  band: [22, 23],
  enclave: true,
  region: 'rimewater',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#a9b4bd', wallDark: '#6c7782', floor: '#4b5159', ceiling: '#171b20', door: '#6d7780', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a4654' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '######...#######',
    '#####.....######',
    '#####.....######',
    '#######.########',
    '#######.########',
    '##.........#####',
    '##..#......S..##',
    '##......#..#..##',
    '##.........#####',
    '#######.########',
    '####.........###',
    '####.........###',
    '################',
  ],
  exits: [
    { x: 7, y: 1, to: 'longmere_l12', tx: 11, ty: 3, tf: NORTH, label: 'Up the ramp and out of the rim\'s face, into the pines and the thin light.' },
  ],
  features: [
    // The cleft down from the door, and the cave's mouth, where the eagles sit to eat.
    { kind: 'event', x: 7, y: 2, id: 'cf_cleft', once: true, text: 'A cleft goes down into the rim, its walls rubbed smooth higher than any man could reach.' },
    { kind: 'event', x: 6, y: 4, id: 'cf_roost', once: true, text: 'Sticks, bones and long grey feathers litter the cave mouth, and the snow is spattered brown where something sits to eat.' },
    // The trolls' hall: their beds in rings, the marrow-bones, the hunter who came with fire, and the one
    // stretch of wall they keep bare, with their larder behind it.
    { kind: 'event', x: 6, y: 8, id: 'cf_hall', once: true, text: 'The cave opens into a hall roofed in ice. Beds of trodden snow lie round it in rings, each as big as a cart.' },
    { kind: 'event', x: 9, y: 8, id: 'cf_hunter', once: true, text: 'A hunter sits against the wall under a skin of ice, the shaft of a spear snapped across his knees and his hands burnt black.' },
    { kind: 'event', x: 3, y: 10, id: 'cf_bones', once: true, text: 'Elk and bullock bones lie cracked for the marrow in a heap against the wall, and the snow is stained under them.' },
    { kind: 'event', x: 10, y: 9, id: 'cf_path', once: true, text: 'Snow lies heaped along every wall of the hall but this stretch, which is trodden bare as a path is.' },
    { kind: 'event', x: 12, y: 9, id: 'cf_larder', once: true, text: 'A larder cut into the rock: carcasses hang frozen from the roof, and under them a traveller\'s strongbox with its lid split.' },
    { kind: 'chest', x: 13, y: 10, id: 'cf_larder_chest', gold: 300, items: ['elixir', 'potion_sp_great'] },
    // The cave's back, the trolls' bed, and the hoard of what they have taken off the dead.
    { kind: 'event', x: 5, y: 13, id: 'cf_nest', once: true, text: 'The cave\'s back. A bed of packed snow as big as a barn floor, and round it everything the trolls have taken off the dead.' },
    { kind: 'chest', x: 11, y: 14, id: 'cf_hoard', gold: 400, items: ['trollbrand'] },
  ],
  secrets: [{ x: 11, y: 9, hint: 'cf_path' }],
  encounters: [
    // Four spine eagles in the neck behind the cave's mouth, every way down past them: the nearer and the
    // gentler, at 22.
    { id: 'cf_eagles', x: 7, y: 6, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 3, roams: false, respawn: RESPAWN.day },
    // Two snow trolls in the one passage to the cave's back, past the hall, where the hoard lies: the
    // farther and the hardest, at 23.
    { id: 'cf_trolls', x: 7, y: 12, monsters: ['snow_troll', 'snow_troll'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
  ],
};
