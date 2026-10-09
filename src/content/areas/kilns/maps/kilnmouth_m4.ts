// Kilnmouth, box M4: Kilnmouth's north. Country, band 16-18: the pines down off the Fells under M3,
// the range's crag and trees closed against Lanternwood on the west, the summer grass and the knoll in the middle, and
// the farms' top fields and the old workings' ground on the east against N4. The drovers' track climbs
// from that ground to their shieling under the pines; the drovers' store lies in the knoll behind a
// rock face, and a worm pair under the hills by the range.
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.15 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const KILNMOUTH_M4: MapDef = {
  id: 'kilnmouth_m4',
  name: 'Kilnmouth',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 15, y: 0, facing: SOUTH },
  rows: [
    'TMMMMMMMMMMMppppppppMMrrMMppppp,',
    'rMMMMMMMMMMpppppppppppppppppppp,',
    'rMMMMMMMMMpppppppppppppppppppp,,',
    'rMMMMMMMMMppppppppppppppppppp,,,',
    'rMMMMMMMMpppppppppppppppppp,,,,,',
    'rMMMMMMMMpppppppppppppppppp,,,,,',
    'rMMMMMMM^pppppppppppppppp,,,,,,,',
    'rMMMMMMM^^ppppppppppppp,,,,,,,,,',
    'rMMMMMM^^^pppppppppppp,,,,,,,,,,',
    'rMMMMMM^^^^ppppppppp,,,,,,,,,,,,',
    'rMMMMM^^^,,,ppppp,,,,,,,,,,:,,,,',
    'rMMMMM^^^,,,,,,,,,,,,,,,,,,:,,,,',
    'rMMMMM^^,,^^,,,,,,,,,,,,,,,:,,,,',
    'rMMMM^^^,,^^^,,,,,,,^rSr^^,:,,,,',
    'rMMM^^^,,,^^^^,,,,,^^r.r^^,:,,,,',
    'rMMM^^^^,,^^^^^,,,,^^r.r^^,:,,,,',
    'rMM^^^,,,,^^^^^,,,^^^rrr^^,:,,,,',
    'rMM^^^,,,,,,,,,^^^^^^^^^^^,:,^^,',
    'rM^^^^,,,,,,,,,^^^^^^^^,,,,::^^^',
    'rM^^^,,,,,,,,,,,^^^^^,,,,,,,:^^^',
    'r^^^^,,,,,,,,,,,,,,,,,,,,,,,:,^^',
    'r^^^,,,,,,,,,,,,,,,,,,,,,,,,:,,,',
    'r^^,,,,,,,,,,,,,,,,,,,,,,^^,:,,,',
    'T^^,,,,,,,,,,,,,,,,,,,,,,^^f:fff',
    'T^^^^,,,,,,,,,,,,,,,,,,,,fff:f::',
    'T^^^^,,,,,,,,,,,,,,,,,,,ffff::::',
    'T^^^,,,,,,,,,,,,,,,,ffffffff::::',
    'T,,,,,,,,,,,,,,,,,,fffffffff::::',
    'T,,,,,,,,,,,,,,,,fffffffffff::::',
    'T,,,,,,,,,,,,,,,,fffffffffff::::',
    'T,,,,,,,,,,,,,,,,,fffffffffff:::',
    'T,,,,,,,,,,^,,,,,,fffffffffff:::',
  ],
  features: [
    // Down out of the Fells' pines, past the colliers' clearing.
    { kind: 'event', x: 15, y: 2, id: 'm4_pines', once: true, text: 'The pines thin going down off the Fells, and below them the grass runs on to Kilnmouth\'s farms.' },
    { kind: 'event', x: 22, y: 5, id: 'm4_colliers', once: true, text: 'A colliers\' clearing: turf clamps in a ring, all cold, and charcoal sacked for the kilns that nobody came for.' },
    { kind: 'cairn', x: 11, y: 11, id: 'm4_cairn', text: 'A cairn at the pines\' edge, a cow\'s horn wedged in its top stones for a drover to blow.', gold: 100, items: ['potion_sp_great'] },
    // The drovers' track up from the old workings' ground to the shieling, and the drover there.
    { kind: 'event', x: 30, y: 29, id: 'm4_adit', once: true, text: 'A timbered adit in the old spoil, fallen in, the timbers grey. A dwarf\'s mark on the lintel, worn nearly away.' },
    { kind: 'event', x: 28, y: 21, id: 'm4_track', once: true, text: 'The drovers\' track climbs from the old workings\' ground to the summer grass, cut deep by hooves.' },
    { kind: 'camp', x: 27, y: 9, name: 'The shieling', text: 'The drovers\' shieling on the summer grass: a turf hut, a fold of piled stone and a fire that smells of peat.' },
    { kind: 'npc', x: 29, y: 10, name: 'A drover', lines: [
      'A drover on the summer grass, his dogs at his feet and his cattle spread up to the pines.',
      '"Not under the hills by the range. The ground heaves there, and the beasts won\'t graze it."',
      '"Down to Kilnmouth at the back end. They eat lime with the grass, and it does them no harm."',
    ] },
    // The knoll: the hearth under its rock face, and behind the face the drovers' store.
    { kind: 'event', x: 18, y: 17, id: 'm4_knoll', once: true, text: 'From the knoll the land falls away south to the farms, green and white in squares, and the sea grey past them.' },
    { kind: 'event', x: 22, y: 12, id: 'm4_hearth', once: true, text: 'A hearth at the foot of a rock face on the knoll, cold. Its soot runs up the face and into a crack.' },
    { kind: 'event', x: 22, y: 14, id: 'm4_store', once: true, text: 'A passage of laid stone under the knoll, cold and dry: the drovers\' store. Cheeses on a shelf, and a crock.' },
    { kind: 'chest', x: 22, y: 15, id: 'm4_store_chest', gold: 150, items: ['elixir'] },
    // Under the range, the worms' casts; on the low grass, the stone and the top field.
    { kind: 'event', x: 8, y: 18, id: 'm4_casts', once: true, text: 'Earth thrown up in a ring on the hillside, still wet, and a hole down the middle of it wide enough for a cart.' },
    { kind: 'event', x: 8, y: 27, id: 'm4_stone', once: true, text: 'A standing stone in the grass, older than the farms. The cattle have rubbed it smooth to the height of their shoulders.' },
    { kind: 'event', x: 21, y: 28, id: 'm4_field', once: true, text: 'The top field, oats gone thin in the white soil, and the frost taking its wall down a stone at a time.' },
  ],
  secrets: [{ x: 22, y: 13, hint: 'm4_hearth' }],
  encounters: [
    // Two rock worms under the hills by the range, where the cattle will not graze: the box's group, at 17.
    { id: 'm4_worms', x: 5, y: 21, monsters: ['rock_worm', 'rock_worm'], aware: 3, respawn: 2880, roams: false },
  ],
};
