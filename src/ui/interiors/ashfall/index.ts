// Ashfall's businesses, all in Cinderport: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { CINDERPORT_INN } from './cinderport_inn.ts';
import { CINDERPORT_TEMPLE } from './cinderport_temple.ts';
import { CINDERPORT_ARMOURER } from './cinderport_armourer.ts';
import { CINDERPORT_CHANDLERY } from './cinderport_chandlery.ts';
import { CINDERPORT_YARD } from './cinderport_yard.ts';
import { CINDERPORT_CARTOGRAPHERS } from './cinderport_cartographers.ts';
import { CINDERPORT_FACTOR } from './cinderport_factor.ts';
import { CINDERPORT_POTTER } from './cinderport_potter.ts';

export const SCENES = {
  cinderport_inn: CINDERPORT_INN,
  cinderport_temple: CINDERPORT_TEMPLE,
  cinderport_armourer: CINDERPORT_ARMOURER,
  cinderport_chandlery: CINDERPORT_CHANDLERY,
  cinderport_yard: CINDERPORT_YARD,
  cinderport_cartographers: CINDERPORT_CARTOGRAPHERS,
  cinderport_factor: CINDERPORT_FACTOR,
  cinderport_potter: CINDERPORT_POTTER,
} satisfies Record<string, Scene>;
