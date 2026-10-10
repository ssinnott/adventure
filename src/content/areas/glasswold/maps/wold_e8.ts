// The Glasswold, box E8: the shore. Country, band 26-27: the steppe running down to a strand and the
// inland sea, walked into over the west edge from Akordu's box (D8) or over the south edge off the hills
// (E9). The strand narrows north between the grass and the water to nothing; a boat's ribs in the sand
// that no Rider built; black rocks at the water's edge, a rope's end in a crack and a sea-chest wedged in
// the cleft behind it. A pride hunts the mares on the strand, vultures with it and more on the boat's
// ribs; at its north end two basilisks lie in the sun and a gull stands stone. Offshore the island the Riders swim their mares to,
// where no lion goes, and the south end of another; E7 and F8 are the sea and are not built, so the world
// ends past the north and east edges.
// Cut from the atlas by tools/scaffold.ts, with a bar of shallows out to each island for a swimmer;
// docs/areas/glasswold.md §4.9 is its brief (#534).
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const WOLD_E8: MapDef = {
  id: 'wold_e8',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'country',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 0, y: 26, facing: EAST },
  rows: [
    '__~~WWWWWWWW~_,,,,,,~~WWWWWWWWWW',
    's_~~WWWWWWWW~~,,,,,,~~WWWWWWWWWW',
    'ss_~~~~~~~~~~~~~~~~~~WWWWWWWWWWW',
    'sss_~~WWWWWWWW~~~~~~WWWWWWWWWWWW',
    'ss_~~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'ss_~~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    'sss__~~WWWWWWWWWWWWWWWWW~~~WWWWW',
    'sss_~~WWWWWWWWWWWWWWWW~~~~~~WWWW',
    'ssss_~~WWWWWWWWWWWWWW~~~,,,~~WWW',
    'sssss_~~WWWWWWWWWWWW~~,,,,,~~WWW',
    'sssss_~~WWWWWWWWWWWW~~,,,,,,~~WW',
    'sssss_~~WWWWWWWWWWWW~~,,,,,,~~WW',
    'ssssss_~~WWWWWWWWWWWW~~,,,,,~~WW',
    'sssss_~~~~~~~~~~~~~~~~~_~~~~~WWW',
    'ssssss_~~WWWWWWWWWWWWW~~~~~~WWWW',
    'ssssss_~~WWWWWWWWWWWWWW~WWWWWWWW',
    'sssssss_~~WWWWWWWWWWWWWWWWWWWWWW',
    'ssssss_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'sssrrrr_~~WWWWWWWWWWWWWWWWWWWWWW',
    'sssS__rs_~~~~WWWWWWWWWWWWWWWWWWW',
    'sssrrrrss_~~~~WWWWWWWWWWWWWWWWWW',
    'ssssssssss___~~WWWWWWWWWWWWWWWWW',
    'sssssssssssss_~~WWWWWWWWWWWWWWWW',
    'sssssssssssss_~~WWWWWWWWWWWWWWWW',
    'sssssssssssss_~~WWWWWWWWWWWWWWWW',
    'ssssssssssssss_~~WWWWWWWWWWWWWWW',
    'ssssssssssssss_~~~WWWWWWWWWWWWWW',
    'ssssssssssssss,__~~WWWWWWWWWWWWW',
    'ssssssssssssss,,_~~WWWWWWWWWWWWW',
    'sssssssssssssss,,_~~WWWWWWWWWWWW',
    'ssssssssssssssss,,_~~~WWWWWWWWWW',
    'ssssssssssssssss,,,_~~~~WWWWWWWW',
  ],
  features: [
    // In off the steppe east of Akordu: the strand and the sea, a fire-ring above the tide-line, and a mare
    // the lions had.
    { kind: 'event', x: 3, y: 26, id: 'e8_strand', once: true, text: 'The steppe runs down to a strand of grey sand, and past it the sea. The water barely moves.' },
    { kind: 'camp', x: 8, y: 29, text: 'A ring of sea-stones above the tide-line, driftwood stacked beside it, dry.' },
    { kind: 'event', x: 11, y: 28, id: 'e8_mare', once: true, text: 'A mare lies dead above the water, half eaten, the sand round her trodden by big pads.' },
    // Up the strand: a boat nobody on the Wold built; the black rocks at the water's edge, the rope's end in
    // their crack, and the cleft behind with a sea-chest wedged in it.
    { kind: 'event', x: 10, y: 21, id: 'e8_boat', once: true, text: 'A boat\'s ribs stand up out of the sand, grey and split. Nobody on the Wold builds boats.' },
    { kind: 'event', x: 2, y: 19, id: 'e8_rope', once: true, text: 'Black rocks stand at the water\'s edge. A rope\'s end, tarred and white with salt, hangs out of a crack in them.' },
    { kind: 'event', x: 4, y: 19, id: 'e8_cleft', once: true, text: 'Behind the rock a cleft, and wedged in it a sea-chest black with tar, where some storm put it.' },
    { kind: 'chest', x: 5, y: 19, id: 'e8_sea_chest', gold: 1200, items: ['potion_sp_great'] },
    // The Rider who swims the mares to the island, words only, and Akordu's smoke west over the steppe.
    { kind: 'npc', x: 4, y: 13, name: 'A Rider at the water\'s edge', lines: [
      'A Rider sits her horse where the shallows start, a string of mares behind her, looking out at the island.',
      '"In summer we swim the mares out there. That grass has never had a lion on it."',
    ] },
    { kind: 'event', x: 1, y: 12, id: 'e8_smoke', once: true, text: 'West over the steppe the smoke of Akordu\'s fires, and the tents white under the mesa.' },
    // The strand's north end: a gull the basilisks looked at, and the strand narrowing to nothing.
    { kind: 'event', x: 3, y: 10, id: 'e8_gull', once: true, text: 'A gull stands on the strand with one wing half open, grey all through. It is stone.' },
    { kind: 'event', x: 1, y: 2, id: 'e8_narrows', once: true, text: 'North the strand narrows between the grass and the water to nothing.' },
    // Offshore, reached by a swimmer over the bars of shallows: the mares' island, its cairn, and the south
    // end of another island running on north out of the box.
    { kind: 'event', x: 25, y: 10, id: 'e8_island', once: true, text: 'The island\'s grass stands thick and green, cropped only where the mares have grazed. No lion has marked it.' },
    { kind: 'cairn', x: 24, y: 11, id: 'e8_cairn', text: 'A cairn on the island\'s crown, white with the gulls.', gold: 300, items: ['elixir'] },
    { kind: 'event', x: 16, y: 0, id: 'e8_tip', once: true, text: 'The south end of another island. It runs on north out of sight, and there is nothing on it but grass.' },
  ],
  secrets: [{ x: 3, y: 19, hint: 'e8_rope' }],
  encounters: [
    // From the way in: the pride on the strand after the mares, with its vultures, and more vultures on the
    // boat's ribs; and at the strand's north end two basilisks in the sun, the hardest.
    { id: 'e8_pride', x: 9, y: 24, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'vulture', 'vulture', 'vulture'], aware: 4, respawn: 2880 },
    { id: 'e8_vultures', x: 8, y: 21, monsters: ['vulture', 'vulture', 'vulture'], aware: 3, respawn: 2880 },
    { id: 'e8_basilisks', x: 2, y: 6, monsters: ['basilisk', 'basilisk'], aware: 3, respawn: 2880 },
  ],
};
