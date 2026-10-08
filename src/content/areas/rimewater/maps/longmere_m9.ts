// Rimewater, box M9: Rime Lodge's box. Core, band 20-21: the drove road down off the Rimefells from
// the Cairnfield's notch to the lodge's gate, the coach yard outside it and the Lanterns' lamp; the
// lodge's walls on the shore of the long loch's head, frozen, with the ice-hole a few squares out from
// the lake wall, its fire and the one who waits at its foot; the causeway over the head and the road
// on west along the shore for the pass; the pines under the fells; and along the east the glacier's
// edge, the guide's cairn and the one bare face of its foot.
// The road is taken down from N8's notch onto 22,8 (NOTCH, in cairnfield_n8.ts) and back up from 23,8
// (UP); the gate at 18,8 is the way into Rime Lodge (#487, GATE), and the door in the lake wall at
// 13,10 its way onto the ice (LAKE_DOOR), where on the fourth night the hole gives up its fight.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.2 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { EAST, NORTH, WEST } from '../../../../game/types.ts';

/**
 * The way back up to the Cairnfield (#479): N8 and M9 meet only at a corner across parked M8, so the
 * road is taken, not walked. The square above the landing, the road's foot under the fells' cleft,
 * leads onto N8's road at 1,28, facing east, beside the notch; N8's notch lands on 22,8.
 */
export const UP: Exit = { x: 23, y: 8, to: 'cairnfield_n8', tx: 1, ty: 28, tf: EAST, label: 'Up through the notch onto the moor.' };

/**
 * The way into Rime Lodge (#487): the gate in the lodge's east wall at 18,8, onto the town's first
 * square inside its own gate, 14,8, facing west, saying the town's gate line (docs/areas/rimewater.md
 * §4.3) as the company goes in; the town's way back out lands on 19,8, facing east, the road's end
 * before the gate.
 */
export const GATE: Exit = { x: 18, y: 8, to: 'rime_lodge', tx: 14, ty: 8, tf: WEST,
  label: 'Rime Lodge: log walls on the shore, smoke, and a fire kept out on the ice. The keepers carry lanterns.' };

/**
 * The inn yard's door in the lake wall at 13,10 (docs/areas/rimewater.md §9), the second way between
 * town and box: onto the town's yard at 7,14, facing north; the town's way back out lands on 13,11,
 * on the ice.
 */
export const LAKE_DOOR: Exit = { x: 13, y: 10, to: 'rime_lodge', tx: 7, ty: 14, tf: NORTH,
  label: 'In off the ice by the lake wall\'s door, into the inn\'s yard and out of the wind.' };

export const LONGMERE_M9: MapDef = {
  id: 'longmere_m9',
  name: 'Loch Fada',
  kind: 'outdoor',
  density: 'core',
  band: [20, 21],
  region: 'rimewater',
  start: { x: 22, y: 8, facing: WEST },
  rows: [
    ',,,^^MMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'pppppMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '~ppppMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '~~pp^MMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '~~~p^^MMMMMMMMMMMMMMMMMMMMMMMMMM',
    'p~~~^^^^^^^^^^^^^^^^^^MMMMMMMMMM',
    ',~~~pp*ppp^BBBBBBBB:::MMMMMMMMMM',
    ',,~~~ppppp,BBBBBBBB:::MMMMMMMMMM',
    ',*,~~~ppp,,BBBBBBBD=====MMMMMMMM',
    ',,*,~~p,,,,BBBBBBBB=,pppppppMMMM',
    ',,,^,~~,,,,BBDBBBBB=,,ppppppMMMM',
    ',^^_~~iiiiiiiiiiii*=^^pppp***MMM',
    '^^^_iiiiiiiiiiiiii_=^^pp*piiiMMM',
    '^^^_iiiiiiiiiiiiii_=^^ppppiiiMMM',
    '^^^_iiiiiiiiWiiiii_=^^*pppiiiMMM',
    '^^^_iiiiiiiiiiiiii_=^^ppppiiiMMM',
    '^^==================^^^pppiiiMMM',
    '^^=_iiiiiiiiiiiii_,^^^^pppiiiMMM',
    '^^=_iiiiiiiiiiii_,,^^^^p*piiiMMM',
    '^^=_iiWWWWWWWiii_,,^^^ppppiiiMMM',
    '===_i~WWWWWWW~i_,,,^^^ppppiiiMMM',
    ',,,_~~WWWWWWW~~_,,^^^^ppppiiiMMM',
    ',,,_~~WWWWWWW~~_,,^^^^pp*piiiMMM',
    ',,_~~WWWWWWWW~~_,,^^^^ppppiiiMrM',
    ',,_~~WWWWWWWW~~_,,^^^^ppppiiiSiM',
    ',_~~WWWWWWWWW~~_,,^^^^ppppiiiMrM',
    ',_~~WWWWWWWWWW~~_,^^^^pppp*iiMMM',
    ',_~~WWWWWWWWWW~~_,^^^^ppppiiiMMM',
    ',_~~WWWWWWWWWW~~_,^^^^pppp*i*MMM',
    ',_~~WWWWWWWWWW~~,,^^^^ppppp**MMM',
    ',_~~WWWWWWWWW~~,,,^^^^pppppppMMM',
    ',_~~WWWWWWWWW~~,,,^^^MMpppppppMM',
  ],
  exits: [UP, GATE, LAKE_DOOR],
  features: [
    // Down off the fells: the road's foot under the cleft, the milestone, the coach yard and the gate,
    // shut, with the Lanterns' lamp before it.
    { kind: 'event', x: 21, y: 8, id: 'm9_milestone', once: true, text: 'A milestone where the road comes off the fells: RIME LODGE 1, THE PASS 9.' },
    { kind: 'event', x: 20, y: 7, id: 'm9_yard', once: true, text: 'The coach yard outside the gate: a trough frozen to the bottom, a mounting block, and the ruts of the coach for Kilnhaven.' },
    { kind: 'shrine', x: 20, y: 9, id: 'm9_shrine', text: 'A lantern on a post by the gate, in a box of glass, lit by day as by night.', stat: 'personality', done: 'The Lanterns\' lamp by the gate, lit.' },
    { kind: 'event', x: 25, y: 9, id: 'm9_pines', once: true, text: 'Pines under the fells, snow to their lowest boughs, and every trunk scored at the height of a man\'s chest.' },
    // Under the fells to the west: the stream into the loch and a cairn at the fells' foot.
    { kind: 'event', x: 1, y: 7, id: 'm9_stream', once: true, text: 'The stream off the fells runs into the loch under a skin of ice, and talks under it.' },
    { kind: 'cairn', x: 8, y: 5, id: 'm9_cairn', text: 'A cairn at the fells\' foot, its stones white with rime.', gold: 320, items: ['potion_sp_great'] },
    // The loch's head, frozen: the lake wall's door, the hole a few squares out with its fire and its
    // keeper, a Lantern, and at its foot, on a shelf of ice under the lip, the one who waits.
    { kind: 'event', x: 13, y: 14, id: 'm9_hole', once: true, text: 'A ring of black water in the ice, and a fire kept beside it. Somebody is coming up.' },
    { kind: 'npc', x: 14, y: 14, name: 'A lodge-keeper', lines: [
      'A lodge-keeper on the ice, a lantern at her belt, feeding the fire beside the hole with pine.',
      '"We keep the hole open, and the fire lit. Every night, all night."',
      '"Out east the glacier gives nothing back. Not a glove, in forty years."',
    ] },
    { kind: 'npc', x: 11, y: 14, name: 'A man at the hole', lines: [
      'On a shelf of ice under the hole\'s lip a man sits, his boots over the black water.',
      '"She came up with the others. Then she went back down."',
      '"Somebody has to be here when she comes up."',
    ] },
    // The fourth night (#487): after the hole's fight, the last one out, who will not go home (§5).
    { kind: 'npc', x: 12, y: 13, name: 'A girl out of the hole', flag: 'q_wenna_up', after: { slain: 'longmere_m9:m9_night_4' }, lines: [
      'A girl of fifteen with a nail in her fist and her hair frozen to her face. "Are you the ones my mother sent?"',
      'She will not go to the fire. "There are two hundred more of us down there. I\'m going back for them. The doors know me."',
    ] },
    // The causeway over the head, the road on west along the shore for the pass, and the shore camp.
    { kind: 'event', x: 10, y: 16, id: 'm9_causeway', once: true, text: 'Under the ice beside the causeway something long and pale turns over, and is gone.' },
    { kind: 'event', x: 1, y: 20, id: 'm9_road_west', once: true, text: 'The road runs on along the loch\'s shore, west for the pass.' },
    { kind: 'event', x: 1, y: 24, id: 'm9_far_shore', once: true, text: 'The far shore under snow, and no track on it but a fox\'s, down to the water.' },
    { kind: 'camp', x: 16, y: 19, name: 'The shore camp', text: 'A ring of stones on the shore, out of the wind, and driftwood stacked dry under bark.' },
    { kind: 'event', x: 16, y: 26, id: 'm9_open_water', once: true, text: 'The ice gives out here. Beyond it the loch lies black, and smokes in the cold.' },
    // The hills over the loch, and the lookout on them, south down its length.
    { kind: 'event', x: 21, y: 18, id: 'm9_lookout', once: true, text: 'From the hilltop the loch runs away south between the hills, white at its head, black beyond.' },
    { kind: 'event', x: 23, y: 22, id: 'm9_prints', once: true, text: 'Prints in the snow under the pines, round, each as wide as a plate, and no claws in them.' },
    // The glacier's edge: its snout, the guide and the cairn she builds, the face the snow will not lie
    // on, and behind it the hollow where a guide of the lodge's made camp forty years ago.
    { kind: 'event', x: 27, y: 12, id: 'm9_snout', once: true, text: 'The glacier\'s snout, blue in its cracks. The cold comes off it like a draught under a door.' },
    { kind: 'npc', x: 27, y: 19, name: 'A guide', lines: [
      'A guide at the glacier\'s foot, her hands bound in rags, her fingers black with frost.',
      '"I took a party up to where the sky meets the ice. I came down."',
      '"I am building them a cairn. They will want the way."',
    ] },
    { kind: 'event', x: 27, y: 20, id: 'm9_guide_cairn', once: true, text: 'A cairn on the ice, half built, every stone set with care. It points east, at nothing.' },
    { kind: 'event', x: 28, y: 24, id: 'm9_glacier', once: true, text: 'The ice comes down from the rim in a wall. Snow lies on every face of it but one.' },
    { kind: 'event', x: 30, y: 24, id: 'm9_hollow', once: true, text: 'Behind the bare face, a hollow, and a camp in it forty years cold: a bedroll, a stove, an axe.' },
    { kind: 'chest', x: 30, y: 24, id: 'm9_hollow_kit', gold: 1200, items: ['ice_axe+1'] },
  ],
  secrets: [{ x: 29, y: 24, hint: 'm9_glacier' }],
  encounters: [
    // Snow lynxes in the pines under the fells, three groups, the nearest the road's foot the gentlest;
    // ice pike under the loch's ice between the lake wall and the hole and beside the causeway; and the
    // box's hardest, ice bears at the glacier's edge. On the fourth night (#487), up through the hole
    // onto the ice, the tallyman and six knockers, the fire at the company's back, the tallyman
    // calling more (#537): once, and never again.
    { id: 'm9_lynx_pines', x: 23, y: 10, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'm9_lynx_fells', x: 7, y: 8, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'm9_pike_wall', x: 13, y: 12, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'm9_pike_loch', x: 9, y: 18, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'm9_lynx_south', x: 23, y: 26, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'm9_bear_north', x: 27, y: 17, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
    { id: 'm9_bear_south', x: 27, y: 28, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
    { id: 'm9_night_4', x: 12, y: 13, monsters: ['tallyman', 'knocker', 'knocker', 'knocker', 'knocker', 'knocker', 'knocker'], aware: 3, roams: false, after: { flag: 'night_4' },
      slainText: 'The last of them goes back into the black water, and the clicking stops. Then a hand comes up out of the hole.' },
  ],
};
