// Nick's Locker, Wrackholm's lair (#845, #846): the sea cave under the reef at the east end of F5's
// strand, entered at 16,30. In under the reef where the sea goes in, and up a passage that floods to the
// knee with every wave, to the throat of a great cave, where Old Nick lies across the way, the lair's
// guardian at 32 (MONSTERS §13), the one way on. Past it, the ship it took on her side, stripped to her
// ribs, and against her keel her master, Holdfast on him; behind her bows, kelp grown green over the rock
// where no wave comes, and behind it the master's sea chest in a dry cleft. One level, band 30-32;
// docs/areas/wrackholm.md §12.6 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';

/** Old Nick slain, as the game names a group: Merryn's rumour of it ends with it (wrackholm_f6.ts). */
export const NICK_DOWN = 'nicks_locker:nl_nick';

export const NICKS_LOCKER: MapDef<'nicks_locker'> = {
  id: 'nicks_locker',
  name: 'Nick\'s Locker',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'wrackholm',
  start: { x: 5, y: 14, facing: NORTH },
  // Wet black rock, the kelp's green and the dark of the cave's roof.
  palette: { wall: '#3e4a46', wallDark: '#252e2b', floor: '#2c3833', ceiling: '#141a18', door: '#3e4a46', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#2a4a40' },
  rows: [
    '################',
    '########..######',
    '#########S######',
    '####.........###',
    '###..o.o.o....##',
    '###...........##',
    '###..o.o.o....##',
    '####..........##',
    '######...#######',
    '#######.########',
    '#######.########',
    '#######.########',
    '###~~...########',
    '###~~.##########',
    '#####.##########',
    '################',
  ],
  exits: [
    anchored({ x: 5, y: 14, to: 'wrackholm_f5', at: 'from_nicks_locker', label: 'Out under the reef with the sea at your knees, and onto the strand in the wind.' }),
  ],
  features: [
    // The mouth under the reef and the flooded passage up from it.
    { kind: 'event', x: 5, y: 13, id: 'nl_mouth', once: true, text: 'In under the reef, where the sea goes in. The rock is worn smooth to twice a man\'s height.' },
    { kind: 'event', x: 6, y: 12, id: 'nl_flood', once: true, text: 'The passage floods to the knee with every wave and drains hard, as if something ahead breathed in.' },
    // The cave's throat, where the guardian lies.
    { kind: 'event', x: 7, y: 11, id: 'nl_throat', once: true, text: 'The passage opens ahead on a great cave. Something grey lies across the way in, and its arms move.' },
    // The cave past it: the ship it took, her ribs, and her master against her keel.
    { kind: 'event', x: 7, y: 7, id: 'nl_cave', once: true, text: 'A cave as tall as a church, and in it a ship on her side, stripped to her ribs, far from any water.' },
    { kind: 'event', x: 7, y: 5, id: 'nl_ribs', once: true, text: 'Weed hangs from her ribs like washing. Her name was on her bows, and something has rasped it off.' },
    { kind: 'event', x: 12, y: 5, id: 'nl_master', once: true, text: 'Her master sits against her keel, bones in a sea coat gone green. His belt is still buckled on.' },
    { kind: 'chest', x: 12, y: 6, id: 'nl_belt', gold: 0, items: ['holdfast'] },
    // The secret: kelp grown green behind her bows where no wave comes, and behind it the master's sea
    // chest in a dry cleft.
    { kind: 'event', x: 9, y: 3, id: 'nl_kelp', once: true, text: 'Kelp grows over the rock behind her bows, green and supple, where no wave has come in years.' },
    { kind: 'event', x: 9, y: 1, id: 'nl_cleft', once: true, text: 'A dry cleft behind the kelp, and her master\'s sea chest wedged in it, its lid sealed with pitch.' },
    { kind: 'chest', x: 8, y: 1, id: 'nl_sea_chest', gold: 500, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 9, y: 2, hint: 'nl_kelp' }],
  encounters: [
    // The guardian: Old Nick in the cave's throat, the one way in, a boss at 32 that never comes back.
    { id: 'nl_nick', x: 7, y: 9, monsters: ['old_nick'], roams: false, boss: true, slainText: 'Old Nick sinks down on the wet stone and its arms go slack. The sea comes in, and nothing breathes with it.' },
  ],
};
