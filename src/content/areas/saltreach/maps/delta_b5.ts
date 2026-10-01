// The Delta, box B5: Stienwierde. Core, band 11-12: duckboards out from the Delta road (C5) west
// across the fen and a channel of the Long Water to the Tide Stone's island, where its plinth stands
// empty; two brine Rifts open in the fen round it because the Stone is gone; fen toads on the boards
// and two bull toads on the island's far side. The toads are new here, and a Stone's plinth without
// its Stone. Cut from the atlas by tools/scaffold.ts; docs/areas/saltreach.md §4.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { WEST, NORTH, SOUTH } from '../../../../game/types.ts';
import { rift } from '../../../rifts/index.ts';

/** The north Rift gone quiet: its warden fallen. #191 adds the Tide Stone home, either to do. */
export const RIFT_N_CLOSED: When = { slain: 'b5_rift_n:b5_rift_n_warden' };
/** The south Rift gone quiet, likewise. */
export const RIFT_S_CLOSED: When = { slain: 'b5_rift_s:b5_rift_s_warden' };

/** The brine Rift on the hummock north of the boards (#165): two tide elders at the tear's heart. */
export const B5_RIFT_N = rift({
  id: 'b5_rift_n', template: 'cells', material: 'brine', seed: 11, band: [11, 12], region: 'saltreach',
  out: { to: 'delta_b5', tx: 16, ty: 6, tf: SOUTH },
  table: { groups: [], warden: ['tide_elder', 'tide_elder'] },
  hoard: { gold: 120, items: ['potion_heal'] },
  until: RIFT_N_CLOSED,
});

/** The brine Rift on the hummock over the channel, south of the boards: two tide elders at its heart. */
export const B5_RIFT_S = rift({
  id: 'b5_rift_s', template: 'breach', material: 'brine', seed: 12, band: [11, 12], region: 'saltreach',
  out: { to: 'delta_b5', tx: 26, ty: 25, tf: NORTH },
  table: { groups: [], warden: ['tide_elder', 'tide_elder'] },
  hoard: { gold: 150, items: ['potion_heal', 'potion_heal'] },
  until: RIFT_S_CLOSED,
});

export const DELTA_B5: MapDef = {
  id: 'delta_b5',
  name: 'The Delta',
  kind: 'outdoor',
  density: 'core',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 31, y: 13, facing: WEST },
  rows: [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwww~~w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwww~~~',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww~~~~',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwww~~~~',
    'wwwwwwww~~~wwww,,,wwwwwwwww~~w~~',
    'wwwwwwww~~~~www,,,wwwwwwww~~www~',
    'wwwwwwwww~~wwwww:wwwwwwww~~~www~',
    'wwwwwwwwwwwwwwww:wwwwwww~~~wwwww',
    'wwwwwwwwwwwwwwww:wwwwwww~~wwwwww',
    'wwwww~~~~~wwwwww:wwwwww~~wwwwwww',
    'wwww~~,,,~~wwwww:wwwww~~wwwwwwww',
    'www~,,,,,,,~wwww:wwww~~~wwwwwwww',
    'ww~,,,,,,,,,~www:wwww~~wwwwwwwww',
    'ww~,,,,,,,,,::::::::::::::::::::',
    'ww~,,,,,,,,WSWwwwwww~~wwwwwwwwww',
    'ww~,,,,,,,,W:Wwwwww~~wwwwwwwwwww',
    'ww~,,,,,,,,W:Wwwwww~~wwwwwwwwwww',
    'www~,,,,,,,WWWwwww~~wwwwwwwwwwww',
    'wwww~~,,,~~wwwwwww~~wwwwwww,wwww',
    'wwwww~~~~~wwwwwwww~~wwwwww,,,www',
    'wwwwwwwwwwwwwwwww~~wwwwwwww,wwww',
    'wwwwwwwwwwwwwwwww~~wwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwww~~www~~wwwwwwww',
    'wwwwwwwwwwwwwwwww~~www~~wwwwwwww',
    'wwwwwwwwwwwwwwwww~~wwwwwwwwwwwww',
    'wwwww~~wwwwwwwwww~~wwwwww,,,wwww',
    'wwwwww~wwwwwwwwww~~wwwwww,,,wwww',
    'wwwwwwwwwwwwwwwww~~wwwwwww,wwwww',
    'wwwwwwwwwwwwwwwww~~wwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwww~~wwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwww~~wwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwww~~wwwwwwwwwwww',
  ],
  features: [
    // The duckboards, from the Delta road.
    { kind: 'event', x: 30, y: 13, id: 'b5_boards', once: true, text: 'Duckboards go out from the dry ground west over the fen, plank on plank, to a mound far off with one upright thing on it.' },
    { kind: 'shrine', x: 30, y: 12, id: 'b5_shrine', text: 'A driftwood shrine to the drowned god at the boards\' start, notched in tally. The notches stop a hand short of the top.', stat: 'luck', done: 'No notch has been cut since.' },
    { kind: 'event', x: 21, y: 13, id: 'b5_channel', once: true, text: 'The boards cross the channel on three planks lashed to posts, the water brown and quick beneath, going south to the sea.' },
    // The island: the landing, the hollow under it, the plinth.
    { kind: 'event', x: 12, y: 13, id: 'b5_landing', text: 'The plinth\'s landing, grey planks scored by barge-poles, every mark dragging south. One is sprung where a pole went down between, and no water under it.' },
    { kind: 'event', x: 12, y: 15, id: 'b5_under', once: true, text: 'Dry mud under the landing, and in it what was dropped in haste: a shield face down, and beside it a green glow through the dark.' },
    { kind: 'chest', x: 12, y: 16, id: 'b5_under_cache', gold: 80, items: ['brine_shard', 'shield+1'] },
    { kind: 'event', x: 8, y: 14, id: 'b5_plinth', once: true, text: 'Stienwierde. The plinth, and nothing on it: a socket cut clean, a man\'s width. You have seen that cut before, a hand-span of it, under the roots.' },
    { kind: 'cairn', x: 5, y: 11, id: 'b5_cairn', text: 'A cairn on the island\'s slope for one the sea kept. Every stone in it is holed through by the water, and the wind speaks in them.', gold: 60, items: ['potion_heal'] },
    { kind: 'event', x: 7, y: 10, id: 'b5_mound', once: true, text: 'House-footings on the mound\'s north slope, a ring of them on heaps of shell above the flood. Homes stood by the Stone, while there was one.' },
    // The Rifts, and the hermit between them who counts their lights.
    B5_RIFT_N.way(16, 5),
    B5_RIFT_S.way(26, 26),
    { kind: 'npc', x: 27, y: 19, name: 'a hermit on the hummock', lines: [
      'An old man of the Tidefolk sits on the hummock with his back to the island, a stick in his hand and a row of notches in the mud before him, and does not turn round.',
      '"Two. There were none before midsummer, and then two, green, out in the fen where nothing should burn. I count them every night when the dark comes down, and every night it is two." He cuts a notch. "Not more. Not yet."',
      '"The one who counts kept the tally once, the tides in and out, and we only sang it after. Now the tally is mine and I have no voice for it." He looks west, to the mound. "Go and see what is on the island. Then you will know why I count."',
    ] },
    // The fen.
    { kind: 'event', x: 12, y: 28, id: 'b5_glass', once: true, text: 'A pool set to brine glass from bank to bank, a fen toad caught in it mid-leap. Walk on it and it rings.' },
    { kind: 'event', x: 4, y: 24, id: 'b5_punt', once: true, text: 'A punt sunk to its gunwales, reed grown up through its boards, its pole still leaning where a hand let it go.' },
    { kind: 'event', x: 0, y: 14, id: 'b5_west', once: true, text: 'The fen\'s west edge. Past the last pool the ground lifts to the rim\'s hills, grey and bare, and no road goes up them.' },
    { kind: 'event', x: 22, y: 27, id: 'b5_bank', once: true, text: 'A Tidefolk washing-stone at the water\'s edge, worn to a dish by hands. The dish holds rain, and the hummock\'s green stands in it.' },
    { kind: 'event', x: 24, y: 1, id: 'b5_north', once: true, text: 'The channel comes down from the north between walls of reed. Far up it a heron stands and does not fish, only watches the water.' },
    { kind: 'event', x: 31, y: 0, id: 'b5_post', once: true, text: 'A Tidefolk marker post by the channel, its top cut to a sign the water has worn to nothing. The channel it marked has moved since.' },
    { kind: 'event', x: 4, y: 3, id: 'b5_trap', once: true, text: 'An eel trap of woven reed in the shallows, set and not lifted. Something in it moves, and it is not an eel.' },
  ],
  secrets: [{ x: 12, y: 14, hint: 'b5_landing' }],
  encounters: [
    // Fen toads on the duckboards; two bull toads, and no toad with them, on the island's far side.
    { id: 'b5_toads_e', x: 26, y: 13, monsters: ['fen_toad', 'fen_toad', 'fen_toad', 'fen_toad', 'fen_toad'], aware: 3, roams: false, respawn: 1440 },
    { id: 'b5_toads_w', x: 17, y: 13, monsters: ['fen_toad', 'fen_toad', 'fen_toad', 'fen_toad', 'fen_toad'], aware: 3, roams: false, respawn: 1440 },
    { id: 'b5_bulls', x: 3, y: 16, monsters: ['bull_toad', 'bull_toad'], aware: 4, respawn: 1440 },
  ],
};
