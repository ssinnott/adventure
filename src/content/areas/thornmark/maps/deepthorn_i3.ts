// The Deepthorn, box I3: Deepthorn Lodge. Country, band 8-10: the upper Dowrdu down the box's west
// side out of Lyngwyn, the Hoarhills crossing it from the north-west corner to the south-east with
// the Eaves' forest closed over them, and the hunters' lodge on its rise above the river, on the
// cutters' way over the hills. The elves' road comes in from H3 and goes on south for Henlys (I4).
// Cut from the atlas by tools/scaffold.ts; docs/areas/thornmark.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { EAST, WEST } from '../../../../game/types.ts';
import { denBurnt } from '../../../../game/dens.ts';
import { TEAR_CLOSED } from './grove2.ts';

/** The den under the fallen oak burnt: its brood stops coming. */
const DEN_BURNT = denBurnt('deepthorn_i3', 'i3_den');
/** The lodge's yard open: its brambles cut down. */
const YARD_OPEN: When = { slain: 'deepthorn_i3:lodge_brambles' };

export const DEEPTHORN_I3: MapDef = {
  id: 'deepthorn_i3',
  name: 'The Deepthorn',
  kind: 'outdoor',
  density: 'country',
  band: [8, 10],
  region: 'thornmark',
  // Bark, as Henlys's halls are: the lodge is the one building, a long house under the oaks.
  palette: { wall: '#6e5a3e', wallDark: '#4a3c28' },
  start: { x: 1, y: 23, facing: EAST },
  rows: [
    'TTT~^ttt^^MMM^^tTTTTTTTTTTTTTTTT',
    'TTT~^ttt^^^^^^^^tTTTTTTTTTTTTTTT',
    'TTT~T^tt^^^MMM^^TTTTTTTTTTTTTTTT',
    'TTT~TTTtt^^MMMM^^TTTTTTTTTTTTTTT',
    'TTT~TTTtt^^MMMMM^^TTTTTTTTTTTTTT',
    'TT~~TTTTtt^^MMMM^^^TTTTTTTTTTTTT',
    'TT~~TTTTTt^^MMMMM^^^TTTTTTTTTTTT',
    'TT~~TTTTT:::^MMMMM^^^TTTTTTTTTTT',
    'TT~~TTTTTTT:^MMMMMMM^TTTTTTTTTTT',
    'TT~~TTTTTTT:TTMMMMMMMTTTTTTTTTTT',
    'TT~~TTTTTTT:TTMMMMMMMMTTTTTTTTTT',
    'TT~TTTTTTTT:TTTMMMMMMMMTTTTTTTTT',
    'T~~TTTTBBBB:TTTMMMMMMMMTTTTTTTTT',
    'T~~TTTTBBBB:TTTTMMMMMMMMTTTTTTTT',
    '~~TTTT,,,,,,TTTTMMMMMMMMMTTTTTTT',
    '~~TTTT,,,,,,S,,TTMMMMMMMMMTTTTTT',
    '~TTTTT,,,,,,TT,TTTMMMMMMMMTTTTTT',
    'TTTTTT:TTTTTTT,TTTTMMMMMMMMTTTTT',
    'TTTTTT:TTTTTTT,TTTTTMMMMMMMTTTTT',
    'T,,,TT:TTTTTTT,TTTTTTMMMMMMMTTTT',
    'T,,,TT:TTTTTTT,TTTTTTTMMMMMMMTTT',
    'T,,,TT:TTTTTTT,TTTTTTTTTMMMMMTTT',
    'T,,,TT:TTTTTTT,TTTTTTTTTMMMMMMTT',
    '=============T,TTTTTTTTTTMMMMMTT',
    'TTTTTTTTTTTT=T,TTTTTTTTTTTMMMMMT',
    'TTTTTTTTTTTT=T,TTTTTTTTTTTMMMMMT',
    'TTTTTTTTTTTT=T,T,,,,TTTTTTTMMMMM',
    'TTTTTTTTTTTT=:::,,,,TTTTTTTTMMMM',
    'TTTTTTTTTTTT=TTT,,,,TTTTTTTTMMMM',
    'TTTTTTTTTTTT=TTTTTTTTTTTTTTTTMMM',
    'TTTTTTTTTTTT=TTTTTTTTTTTTTTTTTMM',
    'TTTTTTTTTTTT=TTTTTTTTTTTTTTTTTTM',
  ],
  exits: [
    { x: 0, y: 23, to: 'deepthorn_h3', tx: 30, ty: 23, tf: WEST },
  ],
  features: [
    // The lodge on its rise, its yard shut by brambles.
    { kind: 'event', x: 6, y: 16, id: 'i3_lodge', once: true, text: 'The lodge: a long house under the elves\' oaks, and brambles standing in the yard where the dogs should be.' },
    { kind: 'event', x: 11, y: 14, id: 'i3_cellar', once: true, until: YARD_OPEN, text: 'A cellar door in the lodge\'s flank, barred from within. Someone behind it goes still when you knock.' },
    { kind: 'event', x: 10, y: 16, id: 'i3_well', once: true, text: 'The lodge\'s well, its bucket rotted off the rope, and a month\'s boot prints in the mud round it, none of them going far.' },
    // The game trail up the ridge's foot to the saddle, and the cutters' boot prints over it.
    { kind: 'camp', x: 7, y: 4, name: 'The hunters\' hide', text: 'A hide of boughs over the game trail, dry inside, with a stack of wood the hunters never came back to burn.' },
    { kind: 'fountain', x: 10, y: 4, id: 'i3_spring', text: 'A spring out of the ridge\'s foot, cold enough to ache, in a basin the deer have worn.', stat: 'endurance', done: 'The spring runs on, cold as ever.' },
    { kind: 'cairn', x: 12, y: 1, id: 'i3_cairn', text: 'A cairn on the saddle, older than the lodge, a stone on it for every hunter who crossed.', gold: 70, items: ['potion_sp_great'] },
    { kind: 'event', x: 14, y: 1, id: 'i3_saddle', once: true, text: 'Boot prints a month old, many and deep, come over the saddle from the east and go down towards the lodge.' },
    // The secret: the hunters' path, behind the blazed oak at the thicket's edge.
    { kind: 'event', x: 11, y: 15, id: 'i3_blaze', once: true, text: 'An oak at the thicket\'s edge blazed with three notches, old and grown over. Nothing else in the deep is marked by a hand.' },
    { kind: 'event', x: 14, y: 20, id: 'i3_path', once: true, text: 'A path through the thicket, kept open by feet and not by hooves. It runs south, towards the old groves.' },
    // The dire wolves' den under a fallen oak's root plate (#88).
    { kind: 'den', x: 18, y: 27, id: 'i3_den', name: 'A wolves\' den', text: 'A fallen oak, and under its root plate a den worn smooth. The pack lies out along the trunk, and does not get up yet.',
      breeds: ['dire_wolf'], keepers: 'i3_pack', brood: ['i3_brood1', 'i3_brood2'],
      ask: 'The pack is dead. Fire the den under the roots, and bring the oak down over it?', burn: 'Bring it down.', leave: 'Leave it.',
      burnt: 'The roots catch, and the trunk settles over the den with a sound like a door. In the ash, Lantern grey.',
      ruin: 'The oak lies flat on its own den. Nothing howls under the Hoarhills.', gold: 110, items: ['runed_robe+2'] },
    // The Hunters' Bargain (#56's 15): Godric at the cellar door once the yard is open.
    { kind: 'npc', x: 11, y: 14, name: 'Godric, eldest of the lodge\'s hunters', lines: [
      'The bar comes off the cellar door and a grey man comes up into the light with a boar-spear, and lowers it when he sees you are not made of wood.',
      '"Godric. Eldest of the lodge, which is to say eldest of six men in a cellar. The door\'s been barred a month. The wood came up the yard the night the Stone was cut and sat down in it and waited, and we were not going to fight trees."',
      '"You\'ll want to know why we\'re alive. Salt pork, and shame. I\'ll tell you straight, because you\'ll hear it crooked in Thornhold otherwise. Men came over the hills in the summer, in grey, with a chisel each, and paid us to be looking at the river when they passed. We looked at the river."',
      '"Then the Stone was cut, and the wood woke, and here we are."',
    ], flag: 'q_hunters', after: YARD_OPEN, choice: {
      ask: '"Two things I\'ll ask. The first was the door, and you\'ve done it. The second is that none of this goes to Thornhold. Sylvane would take the lodge off us, and she\'d be right to. Will you hold it?"',
      answers: [
        { label: 'We\'ll hold it.', sets: 'q_hunters_kept', says: [
          '"Then I owe you the one thing I\'ve got that\'s worth having." He walks you to the thicket\'s edge and puts his hand on an oak blazed with three notches. "Hunters\' mark. There\'s a way through here the brambles don\'t cross; we cut it when the lodge was built, and the elves have never found it. It runs south to the old groves and the hold. Nobody outside the lodge knew it. Now somebody does."',
        ] },
        { label: 'Sylvane will hear it.', sets: 'q_hunters_told', says: [
          '"Aye. I thought you might be that sort." He leans the spear against the door. "Tell her, then. Tell her the men were paid and the men looked away, and that the eldest of them said so himself, and didn\'t ask you twice." A breath. "The door\'s open. That\'s your doing, and I\'ll not forget it either way."',
        ] },
      ],
    }, says: [
      { after: { flag: 'q_hunters_told' }, until: { flag: 'q_hunters_shut' }, lines: [
        '"Tell her, then. Tell her the men were paid and the men looked away, and that the eldest of them said so himself, and didn\'t ask you twice." A breath. "The door\'s open. That\'s your doing, and I\'ll not forget it either way."',
      ] },
      { after: { flag: 'q_hunters_shut' }, lines: [
        '"Word came. The gate\'s shut to us till the Stone\'s whole." He is skinning a hare, badly, with the boar-spear. "She\'s right. I\'d have done the same, and hated whoever told me, and got over it. Give me a winter."',
      ] },
      { after: { flag: 'q_hunters_kept' }, lines: [
        '"Still here. Still nobody\'s business but ours." He nods south, towards the thicket. "Use the path. It\'s what it\'s for, and it\'s had nobody on it a month. A path that isn\'t walked forgets it\'s a path."',
      ] },
    ] },
  ],
  secrets: [{ x: 12, y: 15, hint: 'i3_blaze' }],
  encounters: [
    // The gentlest first: thorn spiders in the river brakes by the way in, the den's pack and brood
    // off the road, the ogre alone on it, the lodge's brambles and its owl by night, and the
    // heartwood on the game trail, the hardest.
    { id: 'i3_spiders', x: 2, y: 20, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 4, respawn: 1440 },
    { id: 'i3_brood1', x: 12, y: 25, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440, until: DEN_BURNT },
    { id: 'i3_brood2', x: 19, y: 26, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440, until: DEN_BURNT },
    { id: 'i3_pack', x: 17, y: 27, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 3, roams: false },
    { id: 'i3_ogre', x: 12, y: 29, monsters: ['ogre'], aware: 3, respawn: 2880 },
    { id: 'lodge_brambles', x: 8, y: 15, monsters: ['bramble', 'bramble', 'bramble', 'bramble'], aware: 1, roams: false },
    { id: 'i3_owl', x: 9, y: 14, monsters: ['great_owl', 'great_owl', 'great_owl', 'great_owl'], aware: 5, respawn: 1440, when: { hours: 'night' }, until: TEAR_CLOSED },
    { id: 'i3_heartwood', x: 11, y: 9, monsters: ['heartwood', 'heartwood'], aware: 3, respawn: 2880, until: TEAR_CLOSED },
  ],
};
