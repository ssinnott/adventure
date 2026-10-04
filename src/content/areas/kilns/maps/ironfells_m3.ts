// The Kilns, box M3: the Iron Fells' way in. Country, band 16: the east road out of Lanternwood's M2,
// down through the last of its trees with pines at the verge, over the pass between the Fells' first
// tops and out onto the trail's head; then the pinewood under the mountain, with the woodcutters' camp
// under the shoulder; at the box's far end a crag with the old adit in it, walled, and the first spoil
// heap below it. The road runs on out of the east edge for N3 and Anvilhall.
// Lanternwood's trees close the west against L3, and the ridge under M2 the north but for the road.
// Cut from the atlas by tools/scaffold.ts; docs/areas/kilns.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const IRONFELLS_M3: MapDef = {
  id: 'ironfells_m3',
  name: 'The Iron Fells',
  kind: 'outdoor',
  density: 'country',
  band: [16, 16],
  region: 'kilns',
  start: { x: 1, y: 0, facing: SOUTH },
  rows: [
    'T==ppTTTTTTTTTTTTMMMMMMMMMM^^^^^',
    'Tp==ppTTTTTTTTTTTMMMMMMMMMMpp^^^',
    'Tpp==ppTTTTTTTTTMMMMMMMMMMpppp,,',
    'TTpp===ppTTTTpTMMMMMMMMMMMpppp,,',
    'TTTTpp==ppTTppMMMMMMMMMMMppppp,,',
    'TTTTTpp===ppppMMMMMMMMMMppppppp,',
    'TTTTTTTpp==pppMMMMMMMMMppppppp,,',
    'TTTTTTTTpp==pMMMMMMMMMMpppppppp,',
    'TTTTTTTTTpp==MMMMMMMMMpppppppp,,',
    'TTTTTTTTTppp==MMMMMMMppppppppp,,',
    'TTTTTTTTppppM==MMMMMMppppppppp,,',
    'TTTTTTTTpppMMM==MMMMpppppppppp,,',
    'TTTTTTTT^pMMMMM==MMMpppppppppp,,',
    'TTTTTTTTppMMMMMM==Mpppppppppp,,,',
    'TTTTTTTTTMMMMMMMM===ppppppppp,,,',
    'TTTTTTTTTMMMMMMMMMM==ppppppppp,,',
    'TTTTTTTTMMMMMMMMMMpp==pppppppp,,',
    'TTTTTTTTMMMMMMMMMMppp==ppppppp,,',
    'TTTTTTTTMMMMMMMMMMpppp==pppppppp',
    'TTTTTTTMMMMMMMMMMpppppp==ppppppp',
    'TTTTTTTMMMMMMMMMpppppppp==pppppp',
    'TTTTTTMMMMMMMMMMppppppppp==ppppp',
    'TTTTTTMMMMMMMMMppppppp"""p==pppp',
    'TTTTTMMMMMMMMMMpppppp"""ppp==ppp',
    'TTTTTMMMMMMMMMMppppppp"r"ppp==pp',
    'TTTTMMMMMMMMMMpppppppp"""pppp==p',
    'TTTTMMMMMMMMMMpppppppp"""ppppp=p',
    'TTTTMMMMMMMMMppppppppMM:MMpppp==',
    'TTTMMMMMMMMMMpppppppMMr:rMMpppp=',
    'TTTMMMMMMMMMppppppppMMrSrMMpppp,',
    'TTMMMMMMMMMMppppppppMr::rMMpppp,',
    'TMMMMMMMMMMMppppppppMMrrMMppppp,',
  ],
  exits: [
    { x: 1, y: 0, to: 'lanternwood_m2', tx: 1, ty: 31, tf: NORTH },
  ],
  features: [
    // The pass: a knoll at the pines' edge, and the way back west over Lanternwood.
    { kind: 'event', x: 8, y: 12, id: 'm3_lookout', once: true, when: { hours: 'day' }, text: 'West from the knoll the land falls away, and Lanternwood is one roof of green the whole way to the Watch\'s tower.' },
    { kind: 'event', x: 8, y: 12, id: 'm3_lookout_night', once: true, when: { hours: 'night' }, text: 'West, Lanternwood lies black under you. One light stands up out of it, high: the Watch.' },
    // Down the trail: the milestone, and below it the ruts off the road.
    { kind: 'event', x: 24, y: 20, id: 'm3_milestone', once: true, text: 'A milestone by the trail, ANVILHALL 5 on its face and LANTERN WATCH 6 on its back.' },
    { kind: 'event', x: 26, y: 22, id: 'm3_ruts', once: true, text: 'Wheel ruts turn off the road here and go south into the pines, where no track runs.' },
    // The woodcutters, their camp under the shoulder and their felling in the pines below the pass; the cairn on the shoulder.
    { kind: 'camp', x: 25, y: 8, name: 'The woodcutters\' camp', text: 'A woodcutters\' camp under the shoulder: a fire pit, a lean-to of boughs and pine stacked to dry. Here the hammering is plainer.' },
    { kind: 'npc', x: 26, y: 8, name: 'A woodcutter', lines: [
      'A woodcutter trims pit-props by the fire, and talks without looking up.',
      '"Dwarves sell iron. Always have. Now they sell something in little boxes as well, heavy, and it goes down the road by night."',
      '"Stone, one told me, and laughed. None of the others laughed."',
    ] },
    { kind: 'cairn', x: 29, y: 1, id: 'm3_cairn', text: 'A cairn on the shoulder under the first tops, and every stone in it ore, rust-red and heavy for its size.', gold: 240, items: ['potion_sp_great'] },
    { kind: 'event', x: 16, y: 26, id: 'm3_felling', once: true, text: 'Stumps sawn level in the pines, and poles stacked for carting, every one cut to a pit-prop\'s length.' },
    // The old adit in the crag at the box's far end, the spoil heap below it: the dwarves' hearth by
    // its mouth, the swept wall in its cut, and behind the wall the Hand's stage.
    { kind: 'shrine', x: 24, y: 26, id: 'm3_shrine', text: 'A niche in the rock by the adit\'s mouth, a hearth in it, cold, the ash swept out. The stone over it is black with old smoke.', stat: 'might', done: 'The hearth in the niche, cold and swept.' },
    { kind: 'event', x: 23, y: 28, id: 'm3_needles', once: true, text: 'Dry stone walls the adit\'s mouth, old work and tight. Needles lie thick on the spoil, but the foot of the wall is swept clean.' },
    { kind: 'event', x: 23, y: 30, id: 'm3_stage', once: true, text: 'A cage-wagon in the dark, its door pinned open. Shackles on the bench, and in the straw a boot and a net-needle.' },
    { kind: 'chest', x: 22, y: 30, id: 'm3_stage_chest', gold: 500, items: ['drovers_goad'] },
  ],
  secrets: [{ x: 23, y: 29, hint: 'm3_needles' }],
  encounters: [
    // Fire beetles on the spoil, the Kilns' gentlest: three at the heap's toe, where they see the
    // trail, and three on its west side; and a rock worm in the adit's cut, the box's group at 17.
    { id: 'm3_beetles1', x: 23, y: 22, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 4, respawn: 1440 },
    { id: 'm3_beetles2', x: 21, y: 23, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440, roams: false },
    { id: 'm3_worm', x: 23, y: 28, monsters: ['rock_worm'], aware: 2, respawn: 2880, roams: false },
  ],
};
