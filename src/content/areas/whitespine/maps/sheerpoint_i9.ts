// The Whitespine, box I9: the ridge north, Sheer Point's first. Country, band 22-23: the ridge trail
// along the crest from the Stair's head north toward the Point, the wind off the sea warmer the
// further it goes; the giants' cairn on the crest; the snow trolls in a gully off it, the snow there
// trodden to ice; the first masons' camp on a shelf off the trail, abandoned, their tally cut in the
// rock and their cache behind it; the masons on the trail's end with their sledge, and from the end
// the Hearth over the sea and the causeway running out to it. West of the crest the pines, the eagles
// over them, the camp in the lee, the lamp at the Sheer's edge and the hermit under the peaks by the
// shore, who watches the Hand's boats.
// In from I10 (#502) walked, up the ridge trail: I10's 18,0 is this map's 18,31's neighbour, and the
// pines meet square for square; crossing from the High Spine the log names Sheer Point, and under the
// floor says how it feels in the Point's own words (#166). The trail leaves north at 20,0 for the Point
// (I8, #504); until it is built the world ends past the north edge, as past the west (H9) and the east
// (J9, Loch Fuar's peaks).
// Cut from the atlas by tools/scaffold.ts; docs/areas/whitespine.md §4.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

export const SHEERPOINT_I9: MapDef = {
  id: 'sheerpoint_i9',
  name: 'Sheer Point',
  kind: 'outdoor',
  density: 'country',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 18, y: 31, facing: NORTH },
  rows: [
    'WW~~pppMMMMMMMAAAAAA=MMMMMMMMMMM',
    'W~~ppppMMMMMMAAAAAAA=AAAAMMMMMMM',
    'W~~ppppMMMMMMAAAAAAA=AAAAAMMMMMM',
    'W~~ppppMMMMMMAAAAAAA=AAAAAAMMMMM',
    '~~pppppMMMMMMAAAAAAA=AAAAAAMMMMM',
    '~pppppppMMMMMMAAAAAA=AAAAAAMMMMM',
    '_pppppppMMMMMMAAAAAA=AAAAAAAMMMM',
    'pppppppppMMMMMMAAAA==AAAAAAAMMMM',
    'ppppppppppMMMMMAAAA=AAAAAAAAMMMM',
    'ppppppppppMMMMrrrA*=AAAAAAAAMMMM',
    'ppppppppppMMMr::S**=AAAAAAAAMMMM',
    'pppppppppppMMMrrr**=AAAAAAAAMMMM',
    'pppppppppppMMMMAAAA=AAAAAAAMMMMM',
    'pppppppppppMMMMMAAA=*AAAAAMMMMMM',
    'ppppppppppppMMMMAAA=AAAAAAMMMMMM',
    'ppppppppppppMMMMMA==AAAAAAMMMMMM',
    'pppppppppppppMMMMA=AAAAAAMMMMMMM',
    '|ppppppppppppMMMMA=AAAAAAAMMMMMM',
    '|ppppppppppppMMMMM=AAAAAAAAMMMMM',
    '|ppppppppppppMMM**=MMAAAAAAAAMMM',
    '|pppppppppppp*****=MMMAAAAAAAAAA',
    '|pppppppppppppM***=MMMAAAAAAAAAA',
    '|pppppppppppppMMMM=MMMAAAAAAAAAA',
    '|ppppppppppppppMM==MMMAAAAAAAAAA',
    '|ppppppppppppppMM=MMMMAAAAAAAAAA',
    '|ppppppppppppppMM==MMMMAAAAAAAAM',
    '|pppppppppppppppMM=MMMMMAAAAMMMM',
    '|pppppppppppppppMM=MMMMMMMMMMMMM',
    '|ppppppppppppppppM=MMMMMMMMMMMMM',
    '|ppppppppppppppppp=MMMMMMMMMMMMM',
    '|ppppppppppppppppp=MMMMAAAAAAAAM',
    '|ppppppppppppppppp=MMMMAAAAAAAAM',
  ],
  features: [
    // The ridge trail north from the Stair's head: the wind off the sea warm over the crest, the giants'
    // cairn, the cairns to steer by in cloud and the snow gone off the rocks as the land runs out.
    { kind: 'event', x: 18, y: 28, id: 'i9_wind', once: true, text: 'Over the crest the wind comes out of the north, and it is warm. The snow on the trail is wet with it.' },
    { kind: 'event', x: 18, y: 18, id: 'i9_giants', once: true, text: 'A cairn on the crest twice a man\'s height, of stones a cart could not carry. They were set, not rolled.' },
    { kind: 'cairn', x: 20, y: 13, id: 'i9_cairn', text: 'A cairn by the trail, and north along the crest another, and another, to steer by when the cloud is down.', gold: 0, items: ['potion_sp_great'] },
    { kind: 'event', x: 19, y: 15, id: 'i9_thaw', once: true, text: 'The snow is gone off the rocks here. The air coming over the crest is warm, and smells of the sea.' },
    // The gully off the crest where the snow trolls lie, the snow in it trodden to ice.
    { kind: 'event', x: 12, y: 20, id: 'i9_trodden', once: true, text: 'The snow in the gully is trodden to ice, and nothing else on the ridge is.' },
    // The first masons' camp, on a shelf off the trail, abandoned: their tally cut in the rock face, the
    // last row running on into the crack that is the cache's way in; in the cache, the shards they set
    // by and what else they kept.
    { kind: 'event', x: 18, y: 11, id: 'i9_masons_camp', once: true, text: 'A camp on a shelf off the trail, its fire long out. Hammers lie on a stone, put down and never taken up.' },
    { kind: 'event', x: 17, y: 10, id: 'i9_tally', once: true, text: 'A tally cut in the rock face in fives, row under row. The last row runs on into a crack in the face.' },
    { kind: 'event', x: 15, y: 10, id: 'i9_shards', once: true, text: 'Crates stacked in the dark, packed in straw. In the straw, shards of every colour, laid in fives.' },
    { kind: 'chest', x: 14, y: 10, id: 'i9_cache', gold: 500, items: ['hunters_bow+1'] },
    // The trail's end: the masons' sledge, and over the sea the Hearth and the causeway running out to it.
    { kind: 'event', x: 20, y: 6, id: 'i9_sledge', once: true, text: 'A sledge on the trail, loaded with cut stone under a sheet, its runners grooved deep in the rock.' },
    { kind: 'event', x: 20, y: 2, id: 'i9_hearth', once: true, text: 'Ahead over the sea the Hearth stands up out of the water, so close its heat is on your face.' },
    { kind: 'event', x: 20, y: 1, id: 'i9_causeway', once: true, text: 'From the Point\'s tip a road of cut stone runs out over the sea, and every stone of it catches the light.' },
    // The pines west of the crest: the shore, the hermit, the hollow, the lamp at the Sheer's edge, the
    // camp in the crest's lee and the eagles' kill.
    { kind: 'event', x: 4, y: 2, id: 'i9_shore', once: true, text: 'The pines stop at the sea. The water lies still and grey, and a steam stands on it.' },
    { kind: 'npc', x: 8, y: 7, name: 'A hermit', lines: [
      'A hermit in sewn skins sits against the rock, watching the sea.',
      '"Grey boats go round the Point by night. Low in the water going out, and riding high coming back."',
    ] },
    { kind: 'event', x: 8, y: 14, id: 'i9_hollow', once: true, text: 'Under the pines a hollow melted in the snow, the size of a cart. Something lay here, and it was warm.' },
    { kind: 'shrine', x: 1, y: 19, id: 'i9_shrine', text: 'A niche in a stone at the Sheer\'s edge, and in it a lamp somebody keeps filled. It is burning.', stat: 'luck', done: 'The lamp in the stone at the Sheer\'s edge, still burning.' },
    { kind: 'camp', x: 13, y: 25, name: 'The lee of the crest', text: 'Under the crest and out of the wind, a ring of black stones and a bed of boughs cut this winter.' },
    { kind: 'event', x: 1, y: 27, id: 'i9_sheer', once: true, text: 'The pines stop at the Sheer. Far down, Ashfall\'s coast runs north into the sea under its smoke.' },
    { kind: 'event', x: 8, y: 30, id: 'i9_kill', once: true, text: 'A goat in the snow under the pines, opened from above. No tracks come to it, and none go away.' },
  ],
  secrets: [{ x: 16, y: 10, hint: 'i9_tally' }],
  encounters: [
    // Spine eagles off the peaks over the pines by the way in, the nearest; snow trolls lying in the
    // gully, two together; and on the trail's end the Ashen masons with their sledge, the first of the
    // Hand's on the road, who never break (MONSTERS §8.1).
    { id: 'i9_eagles', x: 15, y: 28, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 5, respawn: 1440 },
    { id: 'i9_trolls', x: 15, y: 20, monsters: ['snow_troll', 'snow_troll'], aware: 3, respawn: 2880, roams: false },
    { id: 'i9_masons', x: 20, y: 4, monsters: ['ashen_mason', 'ashen_mason', 'ashen_mason', 'ashen_mason'], aware: 3, respawn: 2880 },
  ],
};
