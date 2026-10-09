// The Whitespine, box I8: Sheer Point, the finger of land toward the Hearth. Core, band 22-24: the
// ridge trail's end on a lip of rock over the tip, and the masons' track down from it; on the tip's
// west shore the Hand's causeway of cut stone running out over the water, a square wide, as far as
// the Hand has built it, every stone glowing the way the shards do, the masons at work on it and
// their tally-house at its root; the camp on the shingle where Wenna waits for the company, and the
// night she is taken (`WENNA_TAKEN`); Rook's Nest, a hollow high in the tip's rock over the causeway
// at the atlas's site, and under it the Hand's sea cave, where its boats are kept; on the east the
// cairn on the last rock, the drowned god's shrine, a snow troll come down to the shore by night and,
// at the end of the pines, the mason who deserted with his tally.
// In from I9 (#503) walked, up the ridge trail: I9's 20,0 is this map's 20,31's neighbour, and the
// pines and shallows at 2 to 6 meet square for square; the same zone, so nothing is said. North, west
// and east the world ends: the sea on the north and west, the void of unbuilt J8 on the east.
// Cut from the atlas by tools/scaffold.ts; docs/areas/whitespine.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';
import { WENNA_LODGE } from '../../rimewater/maps/rime_lodge.ts';

/** Wenna taken from the camp on the night the company sleeps by her fire (§5, §9's 2; #505 reads it). */
export const WENNA_TAKEN = 'q_wenna_taken';

/**
 * The Mason's Tally (#56's 48, #506): the deserter's passage to Cinderport bought, the Compact's fare
 * (he stands in Cinderport's inn after it); or the tally's page swapped, a count chalked short, and he
 * goes back to the causeway with it, so the Hand sends for the wrong count.
 */
export const MASON_PASSAGE = 'q_mason_passage', MASON_SWAPPED = 'q_mason_swapped';

export const SHEERPOINT_I8: MapDef = {
  id: 'sheerpoint_i8',
  name: 'Sheer Point',
  kind: 'outdoor',
  density: 'core',
  band: [22, 24],
  region: 'whitespine',
  start: { x: 20, y: 31, facing: NORTH },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWW"WWWWWW~W~WWWWW',
    'WWWWWWWWWWWWWWWWW"WWW~~~~~~~WWWW',
    'WWWWWWWWWWWWWWWWW"WWW~~~~~^~~WWW',
    'WWWWWWWWWWWWWWWWW"WMWrrMM_,_~~WW',
    'WWWWWWWWWWWWWWWW~"WM:::rM,,_~~WW',
    'WWWWWWWWWWWWWW~~~"BrrrSAA^^,~~WW',
    'WWWWWWWWWWW~~~~~_^^MM::AA^^^,~~W',
    'WWWWWWWWWW~~~__^^^^MMM:AM^^^^,~~',
    'WWWWWWWW~~~^^^^^^^^^^^^^^^^^^^~~',
    'WWWWWWW~~~^^^^^^MMMM:MM^^^^^^^^~',
    'WWWWWW~~^^^^^^^MMMMM::MM^^^^^^^^',
    'WWWWW~~^^^^^^^MMMMMMM::MMM^^^^^^',
    'WWWW~~^^^^^^^MMMMMMMMM:MMMM^^^^^',
    'WWWW~~^^^^^^MMMMMMMMM==MMMMM^^^^',
    'WWW~~^^^^^^MMMMAMMMMA=MMMMMMM^^^',
    'WWW~~^^^^^^MMMMAAAAAA=AMMMMMM^^^',
    'WWW~~^^^^^MMMMMAAAAAA=AMMMMMMM^^',
    'WWW~~^^^^MMMMMAAAAAAA=AAMMMMMMp^',
    'WWW~~^^^^MMMMAAAAAAAA=AAMMMMMMpp',
    'WW~~^^^^MMMMAAAAAAAAA=AAAMMMMMpp',
    'WWW~~^^MMMMMAAAAAAAAA=AAMMMMMMpp',
    'WWW~~^^MMMMAAAAAAAAAA=AMMMMMMMpp',
    'WWW~~^pMMMMAAAAAAAAAM=MMMMMMMMpp',
    'WWW~~ppMMMMMAAAAAAMMM=MMMMMMMMpp',
    'WWWW~~pMMMMMAAAAAAAMM=MMMMMMMMMp',
    'WWWW~~pMMMMMAAAAAAAMM=MMMMMMMMMp',
    'WWW~~ppMMMMMAAAAAAAM==MMMMMMMMMp',
    'WWW~~ppMMMMMMMMMMAAM=MMMMMMMMMMp',
    'WW~~pppMMMMMMMMMMAAM=MMMMMMMMMMp',
    'WWW~~ppMMMMMMMMMMAAA=MMMMMMMMMM:',
    'WW~~pppMMMMMMMMMAAAA=MMMMMMMMMMr',
  ],
  features: [
    // The ridge trail's last stretch, the rock warm under it, to its end on a lip over the tip, where
    // the masons' track goes down through the rock to the shore.
    { kind: 'event', x: 21, y: 24, id: 'i8_warm', once: true, text: 'The rock under the trail is warm to the hand. Down here the snow never lies.' },
    { kind: 'event', x: 22, y: 14, id: 'i8_trail_end', once: true, text: 'The trail ends on a lip of rock. Below, the Point runs out into the sea, and the heat comes up off it.' },
    // The causeway: its first stone, the step (§5), where after the night her knot is scratched; the
    // stone carved apart from the rest; and its end over deep water, as far as the Hand has built it.
    { kind: 'event', x: 17, y: 6, id: 'i8_causeway', once: true, text: 'A road out over the water, of cut stone. Every stone glows a little, the way the shards do.' },
    { kind: 'event', x: 17, y: 6, id: 'i8_knot', once: true, after: { flag: WENNA_TAKEN }, text: 'Scratched fresh, at the height of a girl\'s shoulder, a loop inside a loop.' },
    { kind: 'event', x: 17, y: 4, id: 'i8_lid', once: true, text: 'Cut deep into one stone, and into no other: THE SKY IS A LID.' },
    { kind: 'event', x: 17, y: 1, id: 'i8_end', once: true, text: 'The stones stop here, over deep water. Beyond them the Hearth\'s light lies on the sea.' },
    { kind: 'event', x: 18, y: 7, id: 'i8_tallyhouse', once: true, text: 'A hut of the same cut stone at the causeway\'s root. Inside, slates to the roof, each chalked with a count.' },
    // The camp on the shingle, and Wenna at it, a person who moves (#76; §9's 2): there once the company
    // has reached the Point, after the lodge (Rimewater's `WENNA_LODGE`) and Highcell's gate (J11). The
    // engine has no rest hook at a camp, so the night is hers to put, as a stay at the Lodge's inn sets
    // its night: slept, she is taken, and the knot is on the first stone.
    { kind: 'camp', x: 14, y: 8, name: 'The shingle fire', text: 'A fire-ring on the shingle above the tide, driftwood stacked by it, the causeway in sight.' },
    { kind: 'npc', x: 13, y: 8, name: 'The girl out of the hole', after: { flag: WENNA_LODGE, visited: 'sheerpoint_i8' }, until: { flag: WENNA_TAKEN }, lines: [
      'The girl out of the hole, at a fire on the shingle in her lodge blanket, watching the stones go out over the water.',
      '"You came." She makes room by the fire. "Sleep. I\'ll keep the first watch."',
    ], choice: { ask: 'Sleep by her fire?', answers: [
      { label: 'Sleep', sets: WENNA_TAKEN, says: [
        'One of you is shouting at the water. Her blanket by the fire is cold.',
        'Out along the stones a boat is going, rowed hard, and none of you saw where it put out from.',
      ] },
      { label: 'Not yet', says: ['"Then I\'ll keep it alone."'] },
    ] } },
    // Rook's Nest (#448), a hollow high in the tip's rock at the atlas's site, and the one who waits in
    // it, words only: #448 keeps his trainer entry and the Thief's quest. At its back the rock is wet,
    // and by night oars are heard under it.
    { kind: 'event', x: 22, y: 8, id: 'i8_nest', once: true, text: 'A hollow high in the rock of the tip, a bed of bracken in it. Below, the whole causeway, stone by stone.' },
    { kind: 'npc', x: 21, y: 7, name: 'A watcher', lines: [
      'A man lies on the bracken at the back of the hollow, a glass to his eye and the causeway in it.',
      '"A stone a day, and I count every one. They never once look up."',
    ] },
    { kind: 'event', x: 22, y: 7, id: 'i8_damp', once: true, text: 'At the back of the hollow the rock is wet, and smells of the sea.' },
    { kind: 'event', x: 22, y: 7, id: 'i8_oars', once: true, when: { hours: 'night' }, text: 'Under the rock, faint, oars. Then nothing.' },
    // The secret: behind the hollow's wet back wall, the Hand's sea cave, its water running out under
    // the rock beside the stones; the boats, the crates under the Hand's seal with the shards not yet
    // cut in them (seen, never carried: the act has no Rift), and the Hand's takings.
    { kind: 'event', x: 21, y: 5, id: 'i8_crates', once: true, text: 'Crates under the Hand\'s seal, packed in straw. In the straw, shards of every colour, not yet cut.' },
    { kind: 'event', x: 20, y: 5, id: 'i8_boats', once: true, text: 'Grey boats drawn up in the dark, their oars shipped. The water runs out under the rock.' },
    { kind: 'chest', x: 22, y: 5, id: 'i8_hold', gold: 400, items: [] },
    // The tip's east side: the cairn on the last rock, the drowned god's shrine at the tide's edge, the
    // troll's leavings on the hills, and down the pines the mason who deserted, hiding in the rocks
    // with his tally (#56's 48: #506 makes the quest).
    { kind: 'cairn', x: 26, y: 3, id: 'i8_cairn', text: 'A cairn on the last rock of the Point, built tall, as if to be seen from the water.', gold: 0, items: ['potion_sp_great'] },
    { kind: 'shrine', x: 27, y: 5, id: 'i8_shrine', text: 'A shrine of the drowned god at the tide\'s edge, its bowl heaped with shells. Someone keeps bringing them.', stat: 'endurance', done: 'The bowl is heaped with shells.' },
    { kind: 'event', x: 28, y: 12, id: 'i8_bones', once: true, text: 'A goat\'s bones on the hill, cracked for the marrow. Too big a bite for any eagle.' },
    { kind: 'event', x: 30, y: 19, id: 'i8_hammer', once: true, text: 'In the needles a mason\'s hammer, dropped, and boot-marks going on south.' },
    { kind: 'event', x: 31, y: 29, id: 'i8_tally', once: true, text: 'A slate wedged in the rocks, chalked with a tally in fives. Under the last row: ELEVEN.' },
    { kind: 'npc', x: 31, y: 30, name: 'A deserter', flag: 'q_mason', until: [{ flag: MASON_PASSAGE }, { flag: MASON_SWAPPED }], lines: [
      'A mason crouched in the rocks, white with dust to the elbow, a slate held to his chest.',
      '"Eleven more and the road reaches the isle. I won\'t be the one who sets them."',
    ], choice: { ask: '"A passage over the water to Cinderport, and I am gone. Or I take them back a count that is wrong."', answers: [
      { label: 'Buy his passage.', price: 600, sets: MASON_PASSAGE, pay: { xp: 1500 }, says: [
        'He counts the fare into his hat, twice, as if it might be less the second time.',
        '"The Compact\'s boat. They never ask a man where he cut stone." He goes off down the shore.',
      ] },
      { label: 'Swap the page.', sets: MASON_SWAPPED, gives: 'masons_tally', pay: { xp: 1500 }, says: [
        'He chalks a fresh slate from his, row for row, but the last. The true one he gives to you.',
        '"They will send for what this says." He goes back up the pines to the causeway.',
      ] },
    ] } },
    // Gone back with the page swapped, the deserter at work below the tally-house, among the masons.
    { kind: 'npc', x: 18, y: 8, name: 'A mason below the tally-house', after: { flag: MASON_SWAPPED }, lines: [
      'The deserter at work below the tally-house, white with dust again, his eyes on the stone in his hands.',
      '"They read the count I brought back. They have sent for it."',
    ] },
    // The tip's west side: the hills down to the shingle and a grey boat's ribs, and the pines going down
    // into the sea toward I9's.
    { kind: 'event', x: 8, y: 13, id: 'i8_wreck', once: true, text: 'A boat\'s ribs on the shingle, grey paint still on the planks. Nothing else of it came ashore.' },
    { kind: 'event', x: 6, y: 26, id: 'i8_pines', once: true, text: 'The pines grow down into the sea here, and the water among their roots is warm.' },
  ],
  secrets: [{ x: 22, y: 6, hint: 'i8_damp' }],
  encounters: [
    // Spine eagles over the tip at the foot of the masons' track, the nearest; the Ashen masons at the
    // causeway's root, and on its end the second group with their foreman, at work, the box's hardest;
    // and by night a snow troll come down to the shore. The Hand never breaks (MONSTERS §8.1).
    { id: 'i8_eagles', x: 18, y: 9, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 5, respawn: 1440 },
    { id: 'i8_masons', x: 17, y: 7, monsters: ['ashen_mason', 'ashen_mason', 'ashen_mason'], aware: 3, respawn: 2880 },
    { id: 'i8_foreman', x: 17, y: 2, monsters: ['ashen_mason', 'ashen_mason', 'ashen_mason', 'ashen_mason', 'ashen_mason'], leader: 'ashen_mason', aware: 3, respawn: 2880, roams: false },
    { id: 'i8_troll', x: 29, y: 8, monsters: ['snow_troll'], when: { hours: 'night' }, aware: 3, respawn: 2880, roams: false },
  ],
};
