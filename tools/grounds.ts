// The ground underfoot laid out small, a sample to a ground, for the checks that must see a ground
// before a built map holds it: the smoke test paints each and sweeps it for cracks, and the contact
// sheet shows each (`--ground`), as the Rift samples show the templates. Each has a ruin or a hut, so
// the sweep has wall faces to look between, and is seen from its start. No area places them.
import type { MapDef } from '../src/game/map.ts';
import { NORTH } from '../src/game/types.ts';

export const GROUND_SAMPLES: readonly MapDef[] = [
  {
    // The ash under the vents, running out of the grass, a ruin and a rock in it.
    id: 'ground_ash', name: 'Ash', kind: 'outdoor', start: { x: 6, y: 7, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'M,,,aaaaaarM',
      'M,,aaaaaaaaM',
      'M,aaa###aaaM',
      'M,aaa#aaaaaM',
      'M,,aaaaaraaM',
      'M,,aaaaaaaaM',
      'M,,,aaaaaaaM',
      'M,,,,aaaaaaM',
      'MMMMMMMMMMMM',
    ],
  },
  {
    // A pinewood with a track through it, a woodcutters' hut and a rock among the pines.
    id: 'ground_pine', name: 'Pine', kind: 'outdoor', start: { x: 7, y: 8, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'Mppppp:ppppM',
      'Mpp##p:prppM',
      'Mpp#pp:ppppM',
      'Mppppp:ppppM',
      'Mprppp::pppM',
      'Mppppppp:ppM',
      'Mpppppp::ppM',
      'Mpppppp:pppM',
      'MMMMMMMMMMMM',
    ],
  },
  {
    // A frozen lake seen from its shore, with snow lying here and there and a fishing hut; a pike
    // under the ice two squares out, as a group placed on ice is drawn.
    id: 'ground_ice', name: 'Ice', kind: 'outdoor', start: { x: 5, y: 8, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'M**,,,,,,**M',
      'M*iiiiiiii,M',
      'M,iiiiiiii,M',
      'M,iiiiiiii*M',
      'M,iiiiiiii,M',
      'M,,iiiiii,,M',
      'M,##,,,,,,,M',
      'M,,,,,,,*,,M',
      'MMMMMMMMMMMM',
    ],
    encounters: [{ id: 'ground_pike', x: 5, y: 6, monsters: ['fen_eel', 'fen_eel'], roams: false, under: 'ice' }],
  },
];
