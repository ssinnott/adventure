// Saltmouth, the free port: Act II's first town, band 10-12, entered from C6's land gate at 26,19.
// The inn, the Telhus (the drowned god's town shrine, which cures), the Seawall Armoury with the
// band's step on the ladder (#399), the Quay Chandlery, the Sail Loft (training to 13), the
// locksmith's, the Keel (the harbour tavern, the Compact's hall to come, #182) and the
// Cartographers' map room (#181). Four first prestiges are taught here, each by a person at their
// trade: the astrologer, the locksmith, the stevedore and the ferryman. Jory Tallis stands at his
// house front on the quay, and Kitto sells the boat to Wrackholm at the quay's end.
// docs/areas/saltreach.md §4.9 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const SALTMOUTH: MapDef = {
  id: 'saltmouth',
  name: 'Saltmouth',
  kind: 'town',
  band: [10, 12],
  region: 'saltreach',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#a8a294', wallDark: '#6a665c', floor: '#7e7a70', banner: '#2a5a6a' },
  rows: [
    '#######==#######',
    '#,T....==......#',
    '#.BBBB.==.BBBBB#',
    '#.BBBB.==.BBBBB#',
    '#.BBDB.==.BBDBB#',
    '#......==......#',
    '#==============#',
    '#......==......#',
    '#.BBBB.==.BBBBB#',
    '#.BDBD.==.DBDBD#',
    '#......==""""""#',
    '#.BBB.BB""WWWWW#',
    '#.BDB.BB""WWWWW#',
    '#.......""WWWWW#',
    '#.BBBB..""WWWWW#',
    '#########WWWWWW#',
  ],
  exits: [
    { x: 7, y: 0, to: 'saltings_c6', tx: 26, ty: 18, tf: NORTH, label: 'You leave Saltmouth by the land gate.' },
    { x: 8, y: 0, to: 'saltings_c6', tx: 26, ty: 18, tf: NORTH, label: 'You leave Saltmouth by the land gate.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Tide Table', price: 25, interior: 'saltmouth_inn' },
    // The harbour tavern: the Compact's hall to those who know, its hall and its back room #182's.
    { kind: 'npc', x: 12, y: 4, name: 'The Keel', interior: 'harbour_tavern', lines: [
      'A low vault against the sea wall, casks for tables and sawdust underfoot. Nobody looks up when you come in, which takes practice.',
      'A bargeman, loud: "Dues? The warehouse can whistle. There\'s a better paymaster on the river now, and he pays in grey."',
      'A pilot, quieter: "Tallis has three hulls in the roads and a fourth fitting out. For what, with the river empty?"',
      'The door at the back opens for a man you did not see come in, and shuts on the next who tries it.',
    ] },
    { kind: 'shop', x: 3, y: 9, name: 'Seawall Armoury', stock: ['morning_star', 'stiletto', 'horn_bow', 'long_axe', 'ironshod_staff', 'sharkskin', 'tidefolk_robe'], interior: 'saltmouth_armourer' },
    // The Thief's first prestige (DESIGN §5): the locksmith keeps his shop, and sells no picks.
    { kind: 'npc', x: 5, y: 9, name: 'Pender the locksmith', interior: 'saltmouth_locksmith', lines: [
      'A narrow walnut room and a wall of keys. A man with a glass in his eye bends under a water-globe lamp and does not stop for the bell.',
      '"Pender. Locks and keys, and the mending of either. I don\'t sell picks. I have not yet met anyone I would sell them to." He looks up at last.',
      '"But a thief who has learned all a lock can teach wants the lesson after that. I keep it, for a price."',
    ], teaches: { cls: 'thief', prestige: 1 } },
    { kind: 'shop', x: 10, y: 9, name: 'Quay Chandlery', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great'], interior: 'saltmouth_chandlery' },
    { kind: 'temple', x: 12, y: 9, name: 'The Telhus', interior: 'saltmouth_shrine' },
    { kind: 'trainer', x: 14, y: 9, name: 'The Sail Loft', maxLevel: 13, interior: 'training_loft' },
    // The Cartographers' map room: its hall and its first task are #181's.
    { kind: 'npc', x: 3, y: 12, name: 'Ysolde Carrow, Geographer of the Guild', interior: 'cartographers_room', lines: [
      'Pale plaster and north light. One wall is Caldera, ruled box by box, and a third of the boxes are empty. A globe, a plotting table, a journal under glass.',
      '"The Cartographers\' Guild. We go where the chart is blank and come back, mostly." She does not look up from her rule. "Look, if you like. Touch nothing under glass."',
      '"That is a Meridian journal. Thirty years, and still the last word from under the world." A pause. "The empty boxes are not empty. We have not been yet."',
    ] },
    // The other three first prestiges, taught in the street by people who keep no shop.
    { kind: 'npc', x: 10, y: 7, name: 'Hiske the astrologer', lines: [
      'A woman in the street with charts rolled under her arm and ink on her thumb, stood where the pilots pass, looking up though it is day.',
      '"Hiske. I draw the sky for the pilots, where the stars stand and where they will stand. Lately I draw it twice to be sure."',
      '"One of you has gone as far as rote takes anyone. There is a next part. It is not cheap and it is not comfortable."',
    ], teaches: { cls: 'sorcerer', prestige: 1 } },
    { kind: 'npc', x: 11, y: 10, name: 'Baukje the stevedore', lines: [
      'A woman the size of a door stands among the bales with a hook in her belt and a bale on her shoulder she has forgotten about.',
      '"Baukje. I lift what comes off the boats and put it where it goes, and when the crews get loud I put them where they go." She sets the bale down.',
      '"One of you carries themselves like a fight waiting to happen. I know the look. I can teach it where to go."',
    ], teaches: { cls: 'barbarian', prestige: 1 } },
    { kind: 'npc', x: 9, y: 14, name: 'Tjerk the ferryman', lines: [
      'An old man sits in a flat boat at the steps with the oars across his knees. The boat does not move, though the water does.',
      '"Tjerk. Across and back, a penny, or your company for the crossing, and I\'ll take the company." He looks at one of you longer than the rest.',
      '"Row against the tide, you lose. Row with it, you lose later. There is a third way. Sit. I\'ll show you where to put your hands."',
    ], teaches: { cls: 'monk', prestige: 1 } },
    // Jory Tallis, at his house front on the quay (DESIGN §10.1): the throne touched, not opened.
    { kind: 'npc', x: 8, y: 11, name: 'Jory Tallis, dockmaster of Saltmouth', lines: [
      'A big man in a good coat before the one stone house on the quay, his door open behind him. He looks at ships the way other men look at money.',
      '"Tallis. Dockmaster, and the hulls in the roads are mine, which in a free port is the same as mayor." He names three ships without turning to look at them.',
      '"Mine is an old name, older than the port. Helmstow\'s chair stands empty, and its Council counts on its fingers. A port counts hulls." He wishes you a good tide.',
    ] },
    // The boat to Wrackholm's landing (#164): a fare, never a favour, at the quay's end.
    { kind: 'npc', x: 14, y: 10, name: 'Kitto, who has a boat', lines: [
      'A man at the quay\'s end with a boat under him, coiling a line. He has seen you coming and not stopped coiling.',
      '"Kitto. Wrackholm, the landing, a hundred and fifty the boat. We go out at eight tonight and you step off at six, with the light."',
      '"A fare is a fare. I don\'t do favours and I don\'t ask why. The one leads to the other." He goes back to his line.',
    ], passage: [{ to: 'wrackholm_e6', x: 16, y: 15, facing: NORTH, name: 'Wrackholm', by: 'boat', fare: 150, departs: 20, days: 1, arrives: 6,
      label: 'The boat grounds at the stage with the first light and you step ashore, rested. The cliff is already between you and the sea.' }] },
    { kind: 'event', x: 8, y: 11, id: 'sm_lineage', text: 'Through Tallis\'s door a hall, and on its wall a lineage framed, name over name up to a crown. The ink is one shade from top to bottom.' },
    { kind: 'event', x: 7, y: 1, id: 'saltmouth_intro', once: true, text: 'Saltmouth. Grey stone, tarred wood, gulls on everything, and under the gate\'s noise the slap of water that never stops.' },
    { kind: 'sign', x: 6, y: 1, text: 'Saltmouth. Land gate: the Salt Road, the barge quay, Rietum.' },
    { kind: 'well', x: 4, y: 7, text: 'An iron pump in the square with a trough under it. The water comes up brown and tastes of the harbour.' },
    { kind: 'event', x: 13, y: 10, id: 'sm_quay', once: true, text: 'The quay. Hulls two deep, bales under tarpaulin, a crane and the horse that works it. Everyone is busy and nobody is in a hurry.' },
    { kind: 'event', x: 14, y: 7, id: 'sm_wall', once: true, text: 'The sea wall. Beyond it the harbour mouth, a lamp on a post either side, and Sylmeer going out grey to no edge at all.' },
    { kind: 'event', x: 8, y: 14, id: 'sm_steps', once: true, text: 'Stone steps down to the water, green from the third one. A flat boat rides at them, and across the harbour the far quay.' },
    { kind: 'event', x: 1, y: 8, id: 'sm_nets', once: true, text: 'Nets hung to dry along the wall, and women with needles going along the holes. The fish on the slabs behind are few and small.' },
    { kind: 'event', x: 3, y: 13, id: 'sm_customs', once: true, text: 'The customs house, shut, the Crown\'s arms over the door and the brass gone green. A chalk mark on the step that somebody renews.' },
  ],
};
