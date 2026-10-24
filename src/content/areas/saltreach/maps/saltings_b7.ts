// The Saltings, box B7: the Scarp's foot west of the pans. Country, band 11-12: the last marsh and the
// salters' grass under the Scarp, open to B6 along its north edge and to C7 along its east; a salt-carter
// at the end of the salters' track with word of a fire under the Scarp, a camp, a cairn and a shrine; three
// salt crabs on the grass and the Hand's smugglers at their fire under the rock; and in the Scarp's foot a
// bothy walled up with salt, found from the dead white fan of grass that points at its door. The Scarp and
// the Glasswold's ground above it are the rim's mountain, shut, and so is the west edge against A7, which
// stays cut, its corner with it, as B6's 0,31 and A6's 31,31 beside it are. Cut from the atlas by
// tools/scaffold.ts and closed by hand; docs/areas/saltreach.md §12 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { WEST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const SALTINGS_B7: MapDef<'saltings_b7'> = {
  id: 'saltings_b7',
  name: 'The Saltings',
  kind: 'outdoor',
  density: 'country',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 31, y: 16, facing: WEST },
  rows: [
    'Mwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'MMwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'MMwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'MM,wwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'MM,wwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'MM,,wwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'MM,^^^wwwwwwwwwwwwwwwwwwwwwwwwww',
    'MM,^^^ww^^^ww,,wwwwwwwwwwwwwwwww',
    'MM,,,^^^^^^^^,,wwwwwwwwwwwwwwwww',
    'MM,,,,^^^^^^^,,,wwwwwwwwwwwwwwww',
    'MM,,,,^^^^^^^,,,,,wwwwwwwwwwwwww',
    'MM,,,,,,^^^^^,,,,,,,,wwwwwwwwwww',
    'MM,,,,,,^^^^,,,,,,,,,,,,www,,,,w',
    'MM,,,,,-----,,,,,,,,,,,,,,,,,,,,',
    'MM,,,,,,---,,,,,,,,,,,,,,,,,,,,,',
    'MM,,,,,,,-,,,,,,,,,,,,,,,,,,,,,,',
    'MM,,,,,,BSB,,,,,,,,,,,,:::::::::',
    'MM,,,BBBB:B,,,,,,,,,,,,,,,,,,,,,',
    'MMMMMB::::B,,,,,,,,,,,,,,,,,,,,,',
    'MMMMMBBBBBB,,,,,,,,,,,,,,,,,,,,,',
    'MMMMMMMMMMMMMMM,,,,,,,,,,,,,,,,,',
    'MMMMMMMMMMMMMMMMMMMM,,,,,,,,,,,,',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMM,,,,,',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // In from B6's reeds, and the pans seen over the marsh from C7's side.
    { kind: 'event', x: 16, y: 1, id: 'b7_in', once: true, text: 'The reeds give out to wet grass, and the whole south is the Scarp, sheer and grey. The wind off it smells of brine.' },
    { kind: 'event', x: 28, y: 6, id: 'b7_pans', once: true, text: 'Over the reeds to the east the pans\' walls stand low and white.' },
    // The marsh's edge and the hill over it.
    { kind: 'shrine', x: 15, y: 9, id: 'b7_shrine', text: 'A shrine at the marsh\'s edge to the drowned god: a block of salt with a bowl cut in it, filled by every rain.', stat: 'accuracy', done: 'The bowl is dry. The salt round it has gone to crust.' },
    { kind: 'cairn', x: 9, y: 9, id: 'b7_cairn', text: 'A cairn of salt blocks on the hill, white where the rain has missed it, a tally of nicks cut in the top block.', gold: 75, items: ['potion_heal'] },
    // The salters' halt on the grass, clear of both groups; the track's end and the carter at her cart.
    { kind: 'camp', x: 14, y: 13, name: 'The salters\' halt', text: 'A ring of black stones on the grass and a heap of sacking gone stiff with salt. The turf is cut by wheels.' },
    { kind: 'event', x: 23, y: 16, id: 'b7_track', once: true, text: 'The salters\' track gives out in the grass: ruts, a drift of spilled salt, a cart with its shafts down.' },
    { kind: 'npc', x: 22, y: 16, name: 'a salt-carter at her cart', lines: [
      'A woman sits on the shafts of a salt cart with a crust of white to her elbows, and watches the foot of the Scarp, not you.',
      '"Salt keeps. Rumour does not. There is a fire under the Scarp, west of here, and it is not a salter\'s."',
      '"Four men sit at it and none of them sell anything." She spits. "I load at noon and I am home by daylight."',
    ] },
    // The secret: the bothy in the Scarp's foot, its door built up with salt, found by the fan of dead grass.
    { kind: 'event', x: 9, y: 15, id: 'b7_fan', text: 'The grass at the Scarp\'s foot is dead and white in a fan, burnt to the root, its point at the rock.' },
    { kind: 'event', x: 9, y: 16, id: 'b7_bothy', once: true, text: 'A salters\' bothy, its door built up with salt blocks: a cot, a scale, a damp ledger, and under the cot a strongbox.' },
    { kind: 'chest', x: 6, y: 18, id: 'b7_bothy_chest', gold: 250, items: ['elixir'] },
  ],
  secrets: [{ x: 9, y: 16, hint: 'b7_fan' }],
  encounters: [
    // Three salt crabs on the salters' grass, the nearest.
    { id: 'b7_crabs', x: 20, y: 13, monsters: ['salt_crab', 'salt_crab', 'salt_crab'], aware: 3, roams: false, respawn: RESPAWN.day },
    // The Hand's smugglers at a fire under the Scarp, the farthest and the hardest.
    { id: 'b7_smugglers', x: 15, y: 20, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_bowman', 'wrack_bowman'], back: 2, aware: 3, roams: false, respawn: RESPAWN.day },
  ],
};
