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
  {
    // An escarpment across the way, the road cut up through its face to the hills above it; a ruin
    // and a rock under the face.
    id: 'ground_cliff', name: 'Cliff', kind: 'outdoor', start: { x: 6, y: 7, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'M^^^^^=^^^^M',
      'M^^^^^=^^^^M',
      'M|||||=||||M',
      'M|||||=||||M',
      'M,,,,,=,,r,M',
      'M,##,,=,,,,M',
      'M,#,,,=,,,,M',
      'M,,,,,=,,,,M',
      'MMMMMMMMMMMM',
    ],
  },
  {
    // The road up to a pass cut between two peaks, the mountain about them and lower, snow lying by
    // the road under them; a herder's hut by the road.
    id: 'ground_peak', name: 'Peak', kind: 'outdoor', start: { x: 6, y: 8, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'MAAAAA=AAAAM',
      'MAAAAA=AAAAM',
      'MAAAAA=AAAAM',
      'MAAMMA=AMMAM',
      'MAAM**=**MAM',
      'MM,##,=,,r,M',
      'M,,#,,=,,,,M',
      'M,,,,,=,,,,M',
      'MMMMMMMMMMMM',
    ],
  },
  {
    // The open steppe, a track over it, a Riders' hut and an outcrop of rock.
    id: 'ground_steppe', name: 'Steppe', kind: 'outdoor', start: { x: 5, y: 8, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'MssssssssrrM',
      'MsssssssssrM',
      'Mss##ssssssM',
      'Mss#sss:sssM',
      'Mssssss:sssM',
      'Msssss::sssM',
      'Mssss::ssssM',
      'Mssss:sssssM',
      'MMMMMMMMMMMM',
    ],
  },
  {
    // The dunes' edge: the steppe running out into sand in ridges, a ruin and a rock in the sand.
    id: 'ground_dunes', name: 'Dunes', kind: 'outdoor', start: { x: 6, y: 8, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'MuuuuuuuuuuM',
      'MuuuuuuuuuuM',
      'Muuu##uuuuuM',
      'Muuu#uuuuruM',
      'MsuuuuuuuuuM',
      'MssuuuuuuusM',
      'MsssuuuuussM',
      'MssssssssssM',
      'MMMMMMMMMMMM',
    ],
  },
  {
    // The shore's hanging vines, a path through them down to the sand and the Sound; a hut and a
    // rock among them, and a strangler vine standing in them, as it does, never roaming.
    id: 'ground_vines', name: 'Vines', kind: 'outdoor', start: { x: 6, y: 8, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'M~~~~~~~~~~M',
      'M__________M',
      'M&&&&&_&&&&M',
      'M&&##&_&&&&M',
      'M&&#&&_&r&&M',
      'M&&&&&:&&&&M',
      'M&&&&&:&&&&M',
      'M&&&&&:&&&&M',
      'MMMMMMMMMMMM',
    ],
    encounters: [{ id: 'ground_strangler', x: 7, y: 6, monsters: ['strangler_vine'], roams: false }],
  },
  {
    // The volcano's flank: the cone over its ash foot with a vent in it ahead, a flow of lava down
    // from the cone opening into a field; a forge's ruin and a rock on the ash.
    id: 'ground_volcano', name: 'Volcano', kind: 'outdoor', start: { x: 5, y: 6, facing: NORTH },
    rows: [
      'MMMMMMMMMMMM',
      'MVVVVVVVVVVM',
      'MVVVVVVVVVVM',
      'MaVVV@VV!VaM',
      'MaaVaaaa!aaM',
      'Maaaaaa!!!aM',
      'Ma##aaa!!!!M',
      'Ma#aaraa!!aM',
      'Maaaaaaaa!aM',
      'MMMMMMMMMMMM',
    ],
  },
];
