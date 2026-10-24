// The Seestollen, the Kilns' enclave (#845): the dwarves' first quay's galleries under K6's point, cut
// to load the barges out of the weather and given up to the sea when the cutting broke into the grey
// rock and what keeps it came out. Entered by the grate in K6's slipway at 20,16. The loading gallery,
// where two menders keep the pumps; the rail gallery down to the tally-room, where a tallyman counts
// with a mender and its knockers; the drowned quay, its basin under the rock, where two tallymen keep
// the quay-master's strongbox and Durchschlag in it; and behind the one dry wall of the loading gallery
// the dwarves' store, walled up when they left. Band 19-20, a band over Kilnmouth's, out of the Kilns'
// figures; docs/areas/kilns.md §12.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const SEESTOLLEN: MapDef = {
  id: 'seestollen',
  name: 'The Seestollen',
  kind: 'dungeon',
  band: [19, 20],
  enclave: true,
  region: 'kilns',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#4f5450', wallDark: '#30332f', floor: '#3a3d38', ceiling: '#121413', door: '#4a3c2c', wallStyle: 'stone', ceilingStyle: 'beams', banner: '#5a2a24' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '###.........#..#',
    '###.........S..#',
    '#...........####',
    '#..######~~~####',
    '#..#############',
    '#..#######..WWW#',
    '#..#.....#..WWW#',
    '#........#..WWW#',
    '#..#........WWW#',
    '#..#.....#.....#',
    '##########.....#',
    '##########.....#',
    '################',
  ],
  exits: [
    { x: 7, y: 1, to: 'kilnmouth_k6', tx: 20, ty: 17, tf: SOUTH, label: 'Up the rails and out through the grate onto the slipway, into the wind off the sea.' },
  ],
  features: [
    // The loading gallery at the incline's foot, and the pump at the drowned lower gallery's lip.
    { kind: 'event', x: 7, y: 3, id: 'ss_incline', once: true, text: 'The rails come down the incline into a gallery cut square, its walls weeping salt. Somewhere below, water slaps.' },
    { kind: 'event', x: 10, y: 5, id: 'ss_pump', once: true, text: 'The lower gallery is drowned. A pump at the water\'s lip still works its rod up and down, and draws nothing.' },
    // The secret: the one dry stretch of the gallery's wall, and the dwarves' store walled up behind it.
    { kind: 'event', x: 11, y: 4, id: 'ss_dry', once: true, text: 'Every wall of the gallery weeps salt but this stretch, which is dry, its stones laid squarer than the rest.' },
    { kind: 'event', x: 13, y: 4, id: 'ss_store', once: true, text: 'The dwarves\' store, walled up when they left: lamps, a coil of chain and a strongbox under a tarred cloth.' },
    { kind: 'chest', x: 14, y: 3, id: 'ss_store_chest', gold: 300, items: ['elixir', 'potion_sp_great'] },
    // The rail gallery down, and the tally-room off it.
    { kind: 'event', x: 2, y: 8, id: 'ss_gallery', once: true, text: 'The rails turn south down a gallery two carts wide. Where the dwarves\' cuts end, the rock is grey and smooth as glass.' },
    { kind: 'event', x: 5, y: 9, id: 'ss_board', once: true, text: 'A tally-board covers the wall, the barges\' loads chalked on it in fives. Below the chalk the marks go on, cut, not drawn.' },
    // The drowned quay, its basin under the rock, and the quay-master's strongbox at its foot.
    { kind: 'event', x: 10, y: 9, id: 'ss_quay', once: true, text: 'The old quay under the rock: a basin of black water where the barges came in, its mooring rings green. Nothing stirs it.' },
    { kind: 'event', x: 12, y: 13, id: 'ss_post', once: true, text: 'The quay-master\'s post at the basin\'s foot: his stool, his lamp and a strongbox chained to the rock.' },
    { kind: 'chest', x: 14, y: 14, id: 'ss_strongbox', gold: 400, items: ['durchschlag'] },
  ],
  secrets: [{ x: 12, y: 4, hint: 'ss_dry' }],
  encounters: [
    // Four menders at the pumps, the nearest and the gentlest, at 17.
    { id: 'ss_menders', x: 5, y: 4, monsters: ['mender', 'mender', 'mender', 'mender'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
    // The tally-room's tallyman with a mender and its knockers, at 18.5.
    { id: 'ss_counters', x: 7, y: 11, monsters: ['tallyman', 'mender', 'knocker', 'knocker'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
    // Two tallymen at the drowned quay with their knockers, still counting barges: the farthest and the
    // hardest, at 20.
    { id: 'ss_tallymen', x: 11, y: 12, monsters: ['tallyman', 'tallyman', 'knocker', 'knocker', 'knocker'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
  ],
};
