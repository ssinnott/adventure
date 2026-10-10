// The Whitespine, box J10: the giants' ground above the Stair's head, behind the road. Country, band
// 22-23: the road over the saddle of the pass from K10 and down through the box's south-east corner
// for Monks' Vale; the pines under the slope of the range, where the giants keep their fires: the one
// on the slope above I10's trail, burning with nobody at it, and their own in a clearing, with its
// ring of stone seats and two giants at it, who ask no toll off the Stair; their tracks, their felled
// pines and the bark rubbed off at their height; the goatherd who grazes their ground, his goat on the
// slope, the hunters' lean-to and the cairn; and behind the rock, the toll they have kept.
// In from K10 (#491) over the pass, walked (#508): K10's road at 0,19 meets this map's at 31,19, and
// the road runs square to square to the south edge at 20,31, on onto J11's 20,0 (until the box was
// laid, the pass was taken across its corner, SADDLE and CLIMB). Crossing from Loch Fuar the log names
// Monks' Vale, and under the floor says how it feels in the range's own words (#166, #616). The north
// edge meets J9 (#497), Loch Fuar's far shore, under the pines; the east edge K10, walked anywhere the
// pines and the hills meet; the south edge J11; the west edge is the range against I10's.
// Cut from the atlas by tools/scaffold.ts; docs/areas/whitespine.md §4.8 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';

export const MONKSVALE_J10: MapDef = {
  id: 'monksvale_j10',
  name: 'Monks\' Vale',
  kind: 'outdoor',
  density: 'country',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 31, y: 19, facing: WEST },
  rows: [
    'MMMMpppppppppppppppppppppppppppp',
    'MMMMMppppppppppppppppppppppppppp',
    'MMMMMppppppppppppppppppppppppppp',
    'MMMMMppppppppppppppppppppppppppp',
    'AMMMMMpppppppppppppppppppppppppp',
    'AMMMMMMppppppppp*****ppppppppppp',
    'AAMMMMMpppppppp*******pppppppppp',
    'AAMMMMMMpppppppp*****ppppppppppp',
    'AAAMMMM**ppppppppppppppppppppppp',
    'AAAMMM*****ppppppppppppppppppppp',
    'AAAMMMM***pppppppppppppppppppppp',
    'AAAAMMMMMMpppppppppppppppppppppp',
    'AAAAMMMMMMMppppppppppppppppppppp',
    'AAAAAMMMMMMMpppppppppppppppppppp',
    'AAAAAMMMMMMMpppppppppppppppppppp',
    'AAAAAAMMMMrrMppppppppppppppppppp',
    'AAAAAAMMMr::Sppppppppppppppppppp',
    'AAAAAAAMMMrrMppppppppppppppppppp',
    'AAAAAAAMMMMMMMpppppppppppppppppp',
    'AAAMMMMMMMMMMMpppppppppppppppp==',
    'AAMMMMMMMMMMMMppppppppppppppp==p',
    'AAMMMMMMMMMMMMpppppppppppppp==pp',
    'AMMMMMMMMMMMMpppppppppppppp==ppp',
    'MMMMMMMMMMMMMppppppppppppp==pppp',
    'MMMMMMMMMMMMMpppppppppppp==ppppp',
    'MMMMMMMMMMMMMppppppppppp==pppppp',
    'MMMMMMMMMMMMMpppppppppp==ppppppp',
    'MMMMMMMMMMMMMppppppppp==pppppppp',
    'MMMMMMMMMMMMMpppppppp==ppMMppppp',
    'MMMMMMMMMMMMMppppppp==pMMMMMMppp',
    'MMMMMMMAMMMMMppppppp=ppMMAAAMMpp',
    'MMMMAAAAMMMMMpp^^^,p=ppMAAAAAMMM',
  ],
  features: [
    // The road over the saddle of the pass and down the far side through the pines for the vale.
    { kind: 'event', x: 30, y: 20, id: 'j10_saddle', once: true, text: 'Over the saddle the road drops down through the pines, and ahead the range stands up white into the cloud.' },
    { kind: 'event', x: 20, y: 30, id: 'j10_vale', once: true, text: 'Below, the road goes down out of the pines into a white vale, and far off a bell is ringing.' },
    { kind: 'shrine', x: 28, y: 28, id: 'j10_pool', text: 'A stone seat fallen on its side by the road, and in its hollow a pool that does not freeze.', stat: 'might', done: 'The fallen seat, its pool unfrozen.' },
    // The giants' ground: their fire on the slope above I10's trail, kept with nobody at it; their own
    // in the clearing, its stone seats and the giants at it; their prints, their felled pines and the
    // bark rubbed off at their height.
    { kind: 'event', x: 7, y: 9, id: 'j10_fire', once: true, text: 'The fire on the slope: whole pines laid end to end, burning. Nobody sits at it, but somebody keeps it fed.' },
    { kind: 'event', x: 17, y: 6, id: 'j10_seats', once: true, text: 'Slabs stood on end round a fire, each as high as a man, their tops worn smooth by sitting.' },
    { kind: 'event', x: 18, y: 21, id: 'j10_tracks', once: true, text: 'Prints in the snow a long stride apart, each as long as a man is tall, going up the slope.' },
    { kind: 'event', x: 21, y: 25, id: 'j10_felled', once: true, text: 'Pines snapped off above a man\'s reach and dragged away up the slope. The stumps are torn, not cut.' },
    { kind: 'event', x: 14, y: 24, id: 'j10_rubbed', once: true, text: 'A pine rubbed bare of its bark to twice a man\'s height, and grey hairs stuck in the resin.' },
    // The goatherd who grazes their ground, and his goat on the slope; the hunters' lean-to; the loch
    // through the pines to the north; and the cairn.
    { kind: 'npc', x: 16, y: 28, name: 'A goatherd', lines: [
      'A goatherd leans on his crook under the pines, his goats nosing the snow off the grass.',
      '"The big ones let me graze up here. Off the Stair they ask nothing of anybody."',
      '"Keep off their fire, though. And never sit on their stones."',
    ] },
    { kind: 'event', x: 6, y: 3, id: 'j10_goat', once: true, text: 'A goat on a ledge of the slope above the pines, a bell at its neck, watching you.' },
    { kind: 'camp', x: 27, y: 4, name: 'The lean-to', text: 'A lean-to of boughs against a pine, a fire ring before it, and meat hung from pegs higher than you can reach.' },
    { kind: 'event', x: 20, y: 1, id: 'j10_loch', once: true, text: 'North through the pines the cold loch lies white to its far shore, and a thread of smoke goes up from it.' },
    { kind: 'cairn', x: 25, y: 13, id: 'j10_cairn', text: 'A cairn of boulders no man could lift, set one on another, and a goat\'s skull on the top.', gold: 300, items: ['potion_sp_great'] },
    // The secret: old coins dropped in the snow at the foot of the rock; the search there, and behind it
    // the giants' cauldron of the toll, the oldest coin at the bottom.
    { kind: 'event', x: 13, y: 16, id: 'j10_coins', once: true, text: 'Old coins in the snow at the foot of the rock, a few here and a few there, black with age.' },
    { kind: 'event', x: 11, y: 16, id: 'j10_cave', once: true, text: 'Behind the rock a cauldron the size of a cart, heaped with coin. The coins at the bottom have no faces.' },
    { kind: 'chest', x: 10, y: 16, id: 'j10_tolls', gold: 1400, items: ['elixir'] },
  ],
  secrets: [{ x: 12, y: 16, hint: 'j10_coins' }],
  encounters: [
    // The box's one fight: two giants at their own fire in the clearing, the hardest and the only group.
    // They are people, as the Stair's are, and ask no toll here (#443, call 1).
    { id: 'j10_giants', x: 19, y: 6, monsters: ['stair_giant', 'stair_giant'], aware: 3, respawn: 2880, roams: false },
  ],
};
