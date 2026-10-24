// Karaordu, the Glasswold's enclave (#845): the barrow in the hills over Akordu's box where the Riders laid
// their khans before the sky opened, entered from D7's 8,30 down a cut diggers made in the hill's face. At
// the passage's head the diggers stand in stone and four basilisks lair in the cool; the passage of slabs
// runs south to the khans' chamber under the mound, the khans on their biers and their horses laid with
// them, held by eight deep rats among the bones; and behind the chamber's end wall, found from the skulls
// of the horses set in rows and turned to it, the eldest khan's cell and the Khan's Sabre. Band 28-29, a
// band over the Wold's, out of the Glasswold's figures; docs/areas/glasswold.md §12.4 is its brief (#833).
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const KARAORDU: MapDef<'karaordu'> = {
  id: 'karaordu',
  name: 'Karaordu',
  kind: 'dungeon',
  band: [28, 29],
  enclave: true,
  region: 'glasswold',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#8c7b62', wallDark: '#5e5242', floor: '#4e4438', ceiling: '#1c1814', door: '#3e3226', wallStyle: 'stone', ceilingStyle: 'beams', banner: '#6a3a24' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '#####.....######',
    '#####.....######',
    '#######.########',
    '#######.########',
    '#######.########',
    '##...........###',
    '##...........###',
    '##...........###',
    '##...........###',
    '##...........###',
    '#######S########',
    '######...#######',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'wold_d7', at: 'from_karaordu', label: 'Up the cut and out of the hill\'s face, into the light and the wind off the grass.' }),
  ],
  features: [
    // The diggers' cut down through the hill, and the passage's head, where they stand in stone.
    { kind: 'event', x: 7, y: 2, id: 'kr_cut', once: true, text: 'A cut dug down through the hill into the mound, its sides shored with horse ribs. The spoil at its foot is fresh.' },
    { kind: 'event', x: 5, y: 3, id: 'kr_diggers', once: true, text: 'Three diggers stand in the passage, grey stone to the eyes, one with his pick still raised. Their eyes are open.' },
    // The passage of slabs, south under the mound.
    { kind: 'event', x: 7, y: 6, id: 'kr_slabs', once: true, text: 'Slabs stand along the passage, each cut with a running horse. The air is dry and does not move.' },
    // The khans' chamber: the khans on their biers, their horses laid with them, the rats' work and the
    // khans' gold.
    { kind: 'event', x: 2, y: 9, id: 'kr_khans', once: true, text: 'Khans lie on stone biers round the chamber, the felt rotted from their bones and gold at their throats.' },
    { kind: 'event', x: 12, y: 9, id: 'kr_horses', once: true, text: 'Their horses were laid with them, a ring of bones in rotted harness. No skull lies with any of them.' },
    { kind: 'event', x: 3, y: 12, id: 'kr_gnawed', once: true, text: 'Bones lie gnawed along the wall, and the dust is tracked with small feet.' },
    { kind: 'chest', x: 12, y: 11, id: 'kr_grave', gold: 1400, items: ['elixir'] },
    // The secret: the horses' skulls set in rows, every one turned to the end wall; the eldest khan's cell
    // behind it, with his sabre.
    { kind: 'event', x: 7, y: 12, id: 'kr_skulls', text: 'The horses\' skulls are set on the floor in rows, and every one is turned to face the end wall.' },
    { kind: 'event', x: 7, y: 14, id: 'kr_eldest', once: true, text: 'A cell of its own: the eldest khan sits upright on a bench, a sabre across his knees and his horse\'s skull at his feet.' },
    { kind: 'chest', x: 8, y: 14, id: 'kr_sabre', gold: 300, items: ['khans_sabre'] },
  ],
  secrets: [{ x: 7, y: 13, hint: 'kr_skulls' }],
  encounters: [
    // At the passage's head, where the diggers met their eyes: four basilisks laired in the cool, the nearer.
    { id: 'kr_basilisks', x: 7, y: 4, monsters: ['basilisk', 'basilisk', 'basilisk', 'basilisk'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
    // Among the bones of the khans' chamber, the rats come down the diggers' cut: the farther and the hardest, on the
    // square before the hint's, so that the hint is searched from beside them and the sabre is had past them.
    { id: 'kr_rats', x: 7, y: 11, monsters: ['deep_rat', 'deep_rat', 'deep_rat', 'deep_rat', 'deep_rat', 'deep_rat', 'deep_rat', 'deep_rat'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
  ],
};
