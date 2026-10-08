// Rimewater, box L9: the long loch's shore. Country, band 20-21: the drove road west from Rime Lodge's
// box under the pines, the cats' country, up over the ridge between the lochs by a saddle and down for
// the cold loch's foot; Loch Fada's ice along the north rows with the woodcutters' camp on its shore
// and the open water in its middle; the stream off the fells bending north; the high meadow under the
// ridge's north end where the drovers' summer shieling lies drifted over; a drover wintering in his
// bothy by the road; and on the ridge's crest the lookout over both lochs and a cairn.
// In from M9 by the road at 31,20; out by the south edge at 6,31 and 7,31, where the atlas's road runs
// on across parked L10's corner to K10 (#491), taken, not walked (PASS). The west edge meets K9 (#489),
// where Loch Fuar begins.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.4 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

/**
 * The way on to the cold loch (#491): the atlas's road leaves the south edge at 6,31 and 7,31 and runs
 * on across parked L10's corner to K10's east edge, never entering K9, so L9 and K10 meet only at a
 * corner and the road is not walked but taken. The road's last square, 6,31, leads onto K10's bridge
 * at 30,3 (the atlas's 358,289), facing west, beside the road's last square there, 31,3, which is K10's
 * way back (`RIDGE`) and lands on 7,31, facing north, the road's last square here beside the pass. The
 * label leaves the loch's name to the crossing line said after it (World's `crossing`, #166).
 */
export const PASS: Exit = { x: 6, y: 31, to: 'coldmere_k10', tx: 30, ty: 3, tf: WEST, label: 'On down the road to the cold loch.' };

export const LONGMERE_L9: MapDef = {
  id: 'longmere_l9',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'country',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 31, y: 20, facing: WEST },
  exits: [PASS],
  rows: [
    'iiiiiiiWWWWWWii_pppppp~~~~~~ppp,',
    'iiipiiiiiWWWWiipppppppppppp~~i~p',
    'pppppppiiiWiiipppppppppppppp~i~~',
    'pppppppppiiiippppppppppppppppp~~',
    'ppppppppppipppppppppppppppppppp~',
    'ppppppppppppppppMMMMpppppppppppp',
    'pppppppppppppppMMMMMMpppp,,,**,,',
    'pppppppppppppppMMMMMMpBBB,*,,,,,',
    'ppppppppppppppMMMMMMMpB:S****,,,',
    'ppppppppppppppMMMMMMppBBB,,*,,,,',
    'pppppppppppppMMMMMMMppppppp,^^,,',
    'ppppppppppppMMMMMMMMpppppp^^^^^,',
    'ppppppppppppMMMMMMMppppppp^^^^^^',
    'pppppppppppMMMMMMMMpppppp^^^^^^^',
    'pppppppppppMMMMMMMppppppp^^^^^^^',
    'pppppppppppMMMMMMMppppppp^^^^^^^',
    'pppppppppppMMMMMMpppppppp^^^^^^^',
    'ppppppppppMMMMMMMpppppppp^^^^^^^',
    'ppppppppppMMMMMMppppppppp^^^^^^^',
    'ppppppppppMMMMMMppppppppp,^^,,,^',
    'pppppppppMMMMMMpppppppppp,,,,===',
    'pppppppppMM^^MMpppppppppp,,===,,',
    'pppppppppM^^^MMpppppppppp===,,,,',
    'pppppppppMM^^MMpppppppp===,,,,,,',
    'pppppppppMMM^MMpppppp===pp,,,,,,',
    'ppppppppppMM^MMpppp===ppppp,,,,,',
    'ppppppppppM^^^^Mp===pppppBB,,,,,',
    'ppppppppp=========ppppppppp,,,,,',
    'pppppppp==^^MMMMMpppppppppp,,,,,',
    'ppppppp==ppMMMMMMppppppppp,,,,,,',
    'pppppp==ppppMMMMMppppppppp,,,,,,',
    'pppppp==pppMMMMMMpppppppppp,,,,,',
  ],
  features: [
    // In from M9 by the drove road: the way in, the drovers' stone, the drover wintering in his bothy
    // with his rumour of the bell under the cold loch (#56's 42), and the drovers' stance on the grass.
    { kind: 'event', x: 30, y: 21, id: 'l9_drove', once: true, text: 'The drove road goes in under the pines, a trench in the snow, west for the ridge.' },
    { kind: 'shrine', x: 28, y: 23, id: 'l9_shrine', text: 'A drovers\' stone by the road, a cup cut in its top, and coins frozen into the ice in the cup.', stat: 'luck', done: 'The drovers\' stone, a coin of yours in the ice with theirs.' },
    { kind: 'npc', x: 24, y: 26, name: 'A drover', lines: [
      'A drover at a stone bothy\'s door by the road, two dogs at his feet and a crook across his knees.',
      '"The drove stopped the year the cold loch rose. I stopped with it."',
      '"Still nights, a bell from under the cold loch\'s ice. There is nobody down there to ring it."',
    ] },
    { kind: 'event', x: 29, y: 28, id: 'l9_stance', once: true, text: 'A drovers\' stance: a ring of stones for the beasts to stand in overnight, and the snow in it smooth.' },
    // The pines east of the ridge, the cats' country, and the hills over the road.
    { kind: 'event', x: 17, y: 19, id: 'l9_claws', once: true, text: 'Claw marks down a pine\'s trunk from high up, where something came down it head first.' },
    { kind: 'event', x: 28, y: 15, id: 'l9_hills', once: true, text: 'From the hills the pines go west in a dark roof to the ridge, and the ridge is white above them.' },
    // The high meadow under the ridge's north end, by the stream off the fells: the posts out into the
    // snow, and at their end the drift over the drovers' summer shieling, its door under the snow.
    { kind: 'event', x: 29, y: 3, id: 'l9_stream', once: true, text: 'The stream off the fells bends away north under the pines, frozen across here and black either side.' },
    { kind: 'event', x: 25, y: 8, id: 'l9_posts', once: true, text: 'Fence posts in a line out into the snow, fencing nothing, and a drift at the end of them taller than the rest.' },
    { kind: 'event', x: 23, y: 8, id: 'l9_shieling', once: true, text: 'Under the drift a door, and behind it the drovers\' summer shieling: bunks, a cold hearth, a strongbox.' },
    { kind: 'chest', x: 23, y: 8, id: 'l9_strongbox', gold: 1100, items: ['skinning_knife+1'] },
    // Loch Fada's ice along the north rows: its shore under the pines, the woodcutters' camp, and the
    // open water in the loch's middle, where the pike are.
    { kind: 'event', x: 19, y: 2, id: 'l9_shore', once: true, text: 'Loch Fada\'s shore under the pines, the ice grey out to open water, groaning as it settles.' },
    { kind: 'camp', x: 6, y: 4, name: 'The woodcutters\' camp', text: 'A lean-to of pine boughs by the loch, a saw-horse, and logs stacked under the snow, long left.' },
    { kind: 'event', x: 9, y: 2, id: 'l9_open', once: true, text: 'The ice ends at a lead of black water in the loch\'s middle. Something under it rocks the ice at its lip.' },
    // West of the ridge, Loch Fuar's side: the cats' tracks, the bear's sign and the cold loch below.
    { kind: 'event', x: 4, y: 11, id: 'l9_tracks', once: true, text: 'Tracks under the pines, in pairs a long way apart, and between the pairs nothing: the snow untouched.' },
    { kind: 'event', x: 6, y: 19, id: 'l9_bear_sign', once: true, text: 'A pine torn open for what lived in it, bark flung about, and long white hairs in the splinters.' },
    { kind: 'event', x: 2, y: 21, id: 'l9_west', once: true, text: 'West through the pines the ground falls away, and below it lies the cold loch, white and flat.' },
    // The ridge between the lochs: the saddle the road crosses with its milestone, the path up the crest
    // to the lookout and the cairn, and the road down west for the cold loch's foot.
    { kind: 'event', x: 13, y: 27, id: 'l9_milestone', once: true, text: 'A milestone on the ridge: RIME LODGE 4, THE PASS 5.' },
    { kind: 'event', x: 10, y: 22, id: 'l9_ridge', once: true, text: 'Both lochs from here, white to their far shores. Nothing moves on either.' },
    { kind: 'cairn', x: 12, y: 21, id: 'l9_cairn', text: 'A cairn on the crest, its stones glazed with ice, a drover\'s horn wedged in the top of it.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'event', x: 7, y: 30, id: 'l9_road_on', once: true, text: 'The road goes down off the ridge through the pines, south and west for the cold loch\'s foot.' },
  ],
  secrets: [{ x: 24, y: 8, hint: 'l9_posts' }],
  encounters: [
    // Snow lynxes in the pines, two groups, by the road and by the meadow, leaping at the back row; ice
    // pike under the loch's ice off the woodcutters' camp; and on the ridge's far side the box's hardest,
    // an ice bear alone.
    { id: 'l9_lynx_road', x: 20, y: 21, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'l9_lynx_meadow', x: 22, y: 12, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'l9_pike', x: 5, y: 1, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'l9_bear', x: 5, y: 24, monsters: ['ice_bear'], aware: 3, respawn: 2880 },
  ],
};
