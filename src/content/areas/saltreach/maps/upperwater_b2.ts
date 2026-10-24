// The Upper Water, box B2: the valley's head under the rim. Country, band 10-11: the rim closing in on
// the north and west, up out of the willows' last grass from B3 and over the hills from C2, the spring
// at the rim's foot and its trough, the mire below it with a bull toad in it and an eel come up the
// Long Water to its head, a cairn where the valley turns and a beehive hut of dry stone with no door. Cut from the atlas by tools/scaffold.ts, its void
// written in; docs/areas/saltreach.md §12 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const UPPERWATER_B2: MapDef = {
  id: 'upperwater_b2',
  name: 'The Upper Water',
  kind: 'outdoor',
  density: 'country',
  band: [10, 11],
  region: 'saltreach',
  start: { x: 24, y: 31, facing: NORTH },
  rows: [
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%MMMMMMMMMM',
    '%%%%%%%%%%%%%%%%%%%%MMMMMMMMMMMM',
    '%%%%%%%%%%%%%%%%%MMMMMMMMMMMMMMM',
    '%%%%%%%%%%%%%%%MMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%%%%%MMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%%%%%MMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%%%MMMMMMMMMMMMMMMMMMMMM',
    '%%%%%%%%%MMMMMMMMMMMMMMMMMMMMMMM',
    '%%%%%%%%MMMMMMMMMMMMMMMM^^^^^^^^',
    '%%%%%%%MMMMMMMMMMMMMMM^^^^^^^^^^',
    '%%%%%%%MMMMMMMMMMMMMM^^^^^^^^^^^',
    '%%%%%%MMMMMMMMMMMMMMM^^wwww^^^^^',
    '%%%%MMMMMMMMMMMMMMMM^^wwwwww^^^^',
    '%%%%MMMMMMMMMMMMMMM^^^^^^^^^^^^^',
    '%%%%MMMMMMMMMMMMM^^^^^^^,,^^^^^^',
    '%%%MMMMMMMMMMMMM^^BBB^^^,,,^^^^^',
    '%MMMMMMMMMMMMMMT^^B:B^^^^,,,,,,,',
    'MMMMMMMMMMMMMMMT^^BSB^^,,,,,,,,,',
    'MMMMMMMMMMMMMMTT^^^^^^^,,,,,,,,,',
    'MMMMMMMMMMMMMTTTT^^^^^^,,,,,,,,,',
    'MMMMMMMMMMMMTTTTT^^^,,,,,,,,,,,,',
    'MMMMMMMMMMMMTTTTTT^^,,,,,,,,,,,,',
    'MMMMMMMMMMMMTTTTTT^,,,,,,,,,,,,,',
    'MMMMMMMMMMMTTTTTTT,,,,,,,,,,,,,,',
    'MMMMMMMMMTTTTTTTTT,,,,,,,,,,,,,,',
    'MMMMMMMMTTTTTTTTTTT,,,,,,,,,,,,,',
    'MMMMTTTTTTTTTTTTTTT^,,,,,,,,,,,,',
    'MMMTTTTTTTTTTTTTTTT,,,,,,,,,,,,,',
  ],
  features: [
    // Up out of the willows' last grass; the spring at the rim's foot and the mire below it.
    { kind: 'event', x: 24, y: 29, id: 'b2_head', once: true, text: 'The willows give out. Above them the valley closes in under the rim, grass and grey stone, with no path up it but the sheep\'s.' },
    { kind: 'fountain', x: 22, y: 13, id: 'b2_spring', text: 'A spring comes out of the rim\'s foot into a stone trough, kept clear of leaves. Bent pins and a few old coins lie on its floor.', stat: 'luck', done: 'The trough, full and cold, the pins on its floor.' },
    { kind: 'cairn', x: 28, y: 25, id: 'b2_cairn', text: 'A cairn of the rim\'s grey stone where the valley turns, a sheep\'s bell hung from a stick in its top. It rings in the wind.', gold: 40, items: ['potion_heal'] },
    // The secret: the beehive hut with no door, its way in shown by the wrens.
    { kind: 'event', x: 19, y: 22, id: 'b2_hut', text: 'A beehive hut of dry stone, turfed over, with no door in it anywhere. Wrens go in and out low down on this side.' },
    { kind: 'event', x: 19, y: 21, id: 'b2_cell', once: true, text: 'A dry cell under the turf: a shepherd\'s crook, a sharkskin coat in a greased bag and a horn of coin, all of it old.' },
    { kind: 'chest', x: 19, y: 20, id: 'b2_cell_chest', gold: 100, items: ['sharkskin+1', 'potion_heal'] },
  ],
  secrets: [{ x: 19, y: 21, hint: 'b2_hut' }],
  encounters: [
    // A bull toad in the mire under the spring and an eel come up the Long Water to its head, the box's
    // one fight, kept to the mire as the eel is.
    { id: 'b2_toad', x: 24, y: 16, monsters: ['bull_toad', 'fen_eel'], aware: 4, roams: false, respawn: RESPAWN.day },
  ],
};
