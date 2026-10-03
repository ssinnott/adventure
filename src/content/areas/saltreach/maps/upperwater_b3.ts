// The Upper Water, box B3: the willows behind Rietum. Country, band 10-11: the Long Water out of the
// rim's hills in the north-west and down through the willows, Rietum's diep carried on west from C3's
// sluice under its pollards to the river's bank, a plank bridge over it, the willows' quay at its mouth
// where a barge lies up for the sluice with its crew aboard, the boathouse behind it, the ford below,
// the carr on the west bank and a bull toad in it, the withy beds north of the diep and the fields of
// Rietum's west edge running in. Cut from the atlas by tools/scaffold.ts; docs/areas/saltreach.md
// §4.11 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const UPPERWATER_B3: MapDef = {
  id: 'upperwater_b3',
  name: 'The Upper Water',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 31, y: 25, facing: WEST },
  rows: [
    'MMTTTTTTTTTTTTTTTTT,,,,,,,,,,,,f',
    'MMTTTTTTTTTTTTTTTTT,,,,,,,,,,,,f',
    'T~TTTTTTTTTTTTTTTTTT,,,,,,,,,,ff',
    'T~~,,,TTTTTTTTTTTTTTT,,,,,,,,fff',
    'T~,,,,TTTTTTTTTTTtttttt,,,,,,fff',
    'TT~,,,::::::::::::ttttt,,,,,,fff',
    'TT~~TTTTTTTTTTTTTtttttt,,,,,ffff',
    'TTT~TTTTTTTTTTTTTtttttt,,,,,ffff',
    'TTT~~TTTTTTTTTTTTTTTT,,,,,,fffff',
    'TTTT~TTTTTTTTTTTTTTTT,,,,,,fffff',
    'TTTT~~TTTTTTTTTTTTTTT,,,,,,fffff',
    'TTTT~~Tttttttttttttttttttttttttt',
    'TTTTT~~WWWWWWWWWWWWWWWWWW=WWWWWW',
    'TTTTT~~::::::ttttttttttttttttttt',
    'TTTTTT~~TTBBB:TTTTTTT,,,,,,fffff',
    'TTTTTT~~TTB:B:TTTTTTT,,,,,,fffff',
    'TTTTTTT~~TBSB:TTTTTTT,,,,,,fffff',
    'TTTTTTTT~T::::TTTTTT,,,,,,,fffff',
    'TTTTT:::__::TTTTTTTT,,,,,,,fffff',
    'TTTTT:TTT~~:TTTTTTTT,,,,,,,fffff',
    'TTTTT:TTT~~:::::::::,,,,,,,fffff',
    'Twwww:wwTT~~TTTTTTT,,,,,,,ffffff',
    'TwTwwwwwTT~~TTTTTTT,,,,,,,,fffff',
    'TwwwwwTwTTT~~TTTTT,,,,,,,,,fffff',
    'Tw~wwwwwTTT~~TTTT,,,,,,,,,,fffff',
    'TwwTwwwwTTT~~TTTT,,,,,,,,,,,ffff',
    ',wwww~wTTTT~~TTT,,^^^^^,,,,,ffff',
    ',T,wwwwwTTTT~TTT,,^^^^^,,,,,,fff',
    ',,,TTTTTTTTT~~T,,,^^^^^,,,,,,,ff',
    ',,,TTTTTTTTT~~,,,,^^^^^,,,,,,,,f',
    ',,,,TTTTTTTT~~,,,,^^^^^^,,,,,,,,',
    ',,,,TTTTTTTTT~~,,,^^^^^,,,,,,,,,',
  ],
  features: [
    // In from Rietum's west fields; the river's bend under the rim, its shrine and the withy beds.
    { kind: 'event', x: 29, y: 25, id: 'b3_drains', once: true, text: 'Rietum\'s last drain runs out of the fields into the willows and loses its line among them. Beyond, the sound of the river.' },
    { kind: 'event', x: 2, y: 3, id: 'b3_rim', once: true, text: 'The Long Water comes white out of the rim\'s hills and goes brown under the first willows, and bends, and is slow.' },
    { kind: 'shrine', x: 4, y: 5, id: 'b3_shrine', text: 'A shrine at the bend to the drowned god, its bowl cut in the bank where the river fills it. The bowl is full. No tide reaches here.', stat: 'intellect', done: 'The bowl stays full.' },
    { kind: 'npc', x: 20, y: 5, name: 'Hiltje, a withy-cutter of Rietum', lines: [
      'A woman of the Tidefolk stands in the withy bed to her knees with a hook, cutting rods and laying them in a bundle at her hip. She does not stop for you. "Hiltje. You want the quay, keep on down the diep."',
      '"The god on the hill over the broad water, south of here, has had his name cut off his stone. Before my time. My grandmother would not say it. She\'d say he counts now, and go on with her rods."',
      '"The herons on the water go home at dusk to the willows at the river\'s end, the last of them before the broad water. Every crown has a nest. Don\'t go under them in a clean coat."',
    ] },
    // The diep, its bridge and the willows' quay at its mouth.
    { kind: 'event', x: 25, y: 13, id: 'b3_bridge', once: true, text: 'A plank footbridge over the diep, two planks and a rail, the water a long way down between them and barge-green, and still.' },
    { kind: 'event', x: 12, y: 13, id: 'b3_quay', once: true, text: 'The willows\' quay, a timber quay at the diep\'s mouth. One barge lies up for the sluice. Her crew sit on the hatch and watch you come.' },
    // The secret: the boathouse's back room, its way in worn on the back wall.
    { kind: 'event', x: 11, y: 17, id: 'b3_wall', text: 'The boathouse\'s back wall, weeded green from the ground up. In one strip at a hand\'s height the green is worn off to bare board. No door shows.' },
    { kind: 'event', x: 11, y: 16, id: 'b3_boathouse', once: true, text: 'A dry room behind the boathouse: nets, a cask, a coat of brigandine in oilcloth and a purse. Nothing here was ever on a manifest.' },
    { kind: 'chest', x: 11, y: 15, id: 'b3_boathouse_chest', gold: 120, items: ['brigandine+1', 'potion_heal', 'potion_heal'] },
    // The ford below the quay, the carr past it and the hill to the south-east.
    { kind: 'event', x: 10, y: 18, id: 'b3_ford', once: true, text: 'The ford below the quay, the Long Water shallow over gravel, and on the far bank willows standing out into black water.' },
    { kind: 'event', x: 6, y: 22, id: 'b3_carr', once: true, text: 'The carr: willows standing in black water, and between them the mud churned, as if something heavy had lain here and gone in.' },
    { kind: 'cairn', x: 20, y: 28, id: 'b3_cairn', text: 'A cairn on the hill south of the quay, of river stones, with a willow rod stuck in its top and leaves still on it. Somebody tends it.', gold: 60, items: ['potion_heal'] },
  ],
  secrets: [{ x: 11, y: 16, hint: 'b3_wall' }],
  encounters: [
    // The barge lying up at the quay: a master and three bargemen, the Hand's, who break when he
    // falls, and two herons off the willows in their back rank.
    { id: 'b3_quay', x: 9, y: 13, monsters: ['barge_master', 'bargeman', 'bargeman', 'bargeman', 'grey_heron', 'grey_heron'], back: 2, leader: 'barge_master', aware: 2, roams: false, respawn: 2880 },
    // A bull toad alone in the carr past the ford, the farthest and the hardest.
    { id: 'b3_toad', x: 4, y: 25, monsters: ['bull_toad'], aware: 4, respawn: 1440 },
  ],
};
