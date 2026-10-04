// Rimewater's businesses, all in Rime Lodge: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { RIME_INN } from './rime_inn.ts';
import { RIME_HALL } from './rime_hall.ts';
import { RIME_TEMPLE } from './rime_temple.ts';
import { RIME_FURRIER } from './rime_furrier.ts';
import { RIME_PROVISIONER } from './rime_provisioner.ts';
import { RIME_YARD } from './rime_yard.ts';

export const SCENES = {
  rime_inn: RIME_INN,
  rime_hall: RIME_HALL,
  rime_temple: RIME_TEMPLE,
  rime_furrier: RIME_FURRIER,
  rime_provisioner: RIME_PROVISIONER,
  rime_yard: RIME_YARD,
} satisfies Record<string, Scene>;
