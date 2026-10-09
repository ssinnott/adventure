// The Glasswold, box D9: the steppe. Core, band 26-27: the road in over the south edge from the mesas'
// corner (D10), past the glass in the grass and the Riders' well with their camp beside it, and on
// north-west over the dunes' edge to the west edge, toward the Riders' gap (C9). From the well the
// Riders' track runs north past the watch-mound to the north edge, toward the white tents of Akordu
// (D8), seen from the middle. The lions' country: two prides, vultures over each kill, glass scorpions
// at the dunes' edge and, at the far south-west, a glass walker alone, the first machine seen on the
// Wold. The herd grazes in the north-west under a Rider, all but the grass on the long mound.
// The Wold's first map (#525). Joined to no built box yet: E10 lies south-east, past D10's corner (#527).
// Cut from the atlas by tools/scaffold.ts; docs/areas/glasswold.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const WOLD_D9: MapDef = {
  id: 'wold_d9',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'core',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 22, y: 31, facing: NORTH },
  rows: [
    'ssssssssssssssss:sssssssssssssss',
    'ssssssssssssssss:sssssssssssssss',
    'ssssssssssssssss:sssssssssssssss',
    'sssssssssssssss^:sssssssssssssss',
    'ussssssssssssss^:sssssssssssssss',
    'usssssssssssssss::ssssssssssssss',
    'uusssssssssssssss:ssssssssssssss',
    'uuuusssssssssssss:ssssssssssssss',
    'uuuuuusssssssssss:ssssssssssssss',
    'uuuuuuussssssssss:ssssssssssssss',
    'uuuuuuussssssssss:ssssssssssssss',
    'uuuuuuuusssssssss:ssssssssssssss',
    'uuuuuuuusrrrrsss::ssssssssssssss',
    'uuuuuuussrssSsss:sssssssssssssss',
    'uuuuuuussrrrrsss:sssssssssssssss',
    'uuuuuuuussssssss:sssssssssssssss',
    'uuuuuuuussssssss:sssssssssssssss',
    'uuuuuuuussssssss:sssssssssssssss',
    'uuuuuuuusssssss::sssssssssssssss',
    'uuuuuuuusssssss:ssssssssssssssss',
    'uuuuuuuusssssss:ssssssssssssssss',
    '==uuuuussssssss:ssssssssssssssss',
    'u====uussssssss:ssssssssssssssss',
    'uuuu====sssssss:ssssssssssssssss',
    'uuuuuuu===sssss:s^^sssssssssssss',
    'uuuuuuuss====ss:^^ssssssssssssss',
    'uuuuuuusssss===:ssssssssssssssss',
    'uuuuuuusssssss==ssssssssssssssss',
    'uuuuuuussssssss===ssssssssssssss',
    'uuuuuusssssssssss===ssssssssssss',
    'uuuuuusssssssssssss====ssrrrrsss',
    'uuuuuussssssssssssssss==rrrrrrss',
  ],
  features: [
    // The road in: the glass in the grass, the chapter's (#531), and the Riders' well where their track
    // leaves the road, their camp beside it.
    { kind: 'event', x: 18, y: 29, id: 'd9_glass', once: true, text: 'There is glass in the grass, green, in beads and runs. It glitters away south-west as far as you can see.' },
    { kind: 'fountain', x: 14, y: 24, id: 'd9_well', text: 'A well of the Riders, a stone trough beside it worn smooth by horses\' mouths. The water is cold.', stat: 'endurance', done: 'The Riders\' well, the trough full and the water cold.' },
    { kind: 'camp', x: 13, y: 23, text: 'Rings of black stones by the well, the ash in them old, and dung stacked dry under a hide.' },
    // The track north: the tents seen from the middle, and the cairn on the watch-mound by the track.
    { kind: 'event', x: 16, y: 15, id: 'd9_tents', once: true, text: 'Far off to the north, white tents on the grass, and the smoke of their fires going straight up.' },
    { kind: 'cairn', x: 15, y: 3, id: 'd9_cairn', text: 'A Riders\' cairn on the mound by the track, a horse\'s skull on top of it, looking north.', gold: 300, items: ['potion_sp_great'] },
    // The herd in the north-west under a Rider, and the old Rider in the east, too old to ride.
    { kind: 'event', x: 4, y: 4, id: 'd9_herd', once: true, text: 'Horses graze across the grass, a hundred or more, shaggy and unshod, a Rider sitting his horse among them.' },
    { kind: 'npc', x: 9, y: 8, name: 'A herder', lines: [
      'A Rider sits a short grey horse among the herd, a long pole across his saddle.',
      '"They graze all this side of the grass but one patch, by the long mound. Not one will put its head down there."',
      '"And the lions go round it."',
    ] },
    { kind: 'npc', x: 28, y: 12, name: 'An old Rider', lines: [
      'An old Rider in a hut of hides, a bridle across his knees. His horse grazes by the door, as old as he is.',
      '"It begins: on the day the sky opened, the grass stood still and the birds came down out of the air."',
      '"The rest is the eldest\'s, at Akordu. I was never one for the telling."',
    ] },
    // The prides' kills, the vultures over each.
    { kind: 'event', x: 28, y: 26, id: 'd9_kill', once: true, text: 'A horse pulled down in the grass, half eaten, the grass flattened all round it.' },
    { kind: 'event', x: 24, y: 17, id: 'd9_lie', once: true, text: 'The grass is pressed flat in a hollow here, and warm. Whatever lay in it has gone.' },
    { kind: 'event', x: 29, y: 3, id: 'd9_bones', once: true, text: 'The bones of a wild ass in the grass, picked white. Something dragged the rest of it away.' },
    // The dunes' edge: the horse that came back (#56's 51, the Riders' and the Cartographers' to settle,
    // #532), the cairn where the grass gives out, the Glass seen from the dunes, and the walker's tracks.
    { kind: 'event', x: 8, y: 17, id: 'd9_horse', once: true, text: 'A horse comes in off the dunes alone, glass in its hooves. Something sits its saddle, very still.' },
    { kind: 'cairn', x: 7, y: 21, id: 'd9_edge_cairn', text: 'A cairn where the grass gives out to the dunes, a flat stone set in its west face.', gold: 300, items: ['elixir'] },
    { kind: 'event', x: 2, y: 14, id: 'd9_glass_seen', once: true, text: 'From the dune\'s top the ground beyond goes white to the sky, and shines. It is glass, all of it.' },
    { kind: 'event', x: 7, y: 27, id: 'd9_tracks', once: true, text: 'Tracks across the dunes\' edge, each as long as a man\'s arm, and beside them a furrow, as if something dragged.' },
    // The long mound where the herd will not graze: a walker fallen long ago, grown over, its chest a hollow.
    { kind: 'event', x: 13, y: 13, id: 'd9_ungrazed', once: true, text: 'The grass on the long mound stands long, though the herd has cropped all round it. The lions\' tracks go round it.' },
    { kind: 'event', x: 11, y: 13, id: 'd9_fallen', once: true, text: 'Under the turf, a man of green bronze twice your height, one arm gone to glass. His chest stands open, and hollow.' },
    { kind: 'chest', x: 10, y: 13, id: 'd9_hollow', gold: 750, items: ['elixir', 'etched_glass'] },
  ],
  secrets: [{ x: 12, y: 13, hint: 'd9_ungrazed' }],
  encounters: [
    // The lions' country, from the way in: the near pride at its kill, the vultures down on it; the glass
    // scorpions at the dunes' edge; the glass walker alone at the far south-west, the box's hardest at 27;
    // and the north pride by the track, the vultures with it. The vultures land where something is about
    // to die, so they are in the prides' fights.
    { id: 'd9_pride', x: 27, y: 25, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'vulture', 'vulture', 'vulture'], aware: 4, respawn: 2880 },
    { id: 'd9_scorpions', x: 7, y: 26, monsters: ['glass_scorpion', 'glass_scorpion', 'glass_scorpion', 'glass_scorpion'], aware: 3, respawn: 2880 },
    { id: 'd9_walker', x: 1, y: 30, monsters: ['glass_walker'], aware: 5, respawn: 2880 },
    { id: 'd9_pride_north', x: 23, y: 6, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'vulture', 'vulture', 'vulture'], aware: 4, respawn: 2880 },
  ],
};
