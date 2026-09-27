// Thornmark's businesses, all in Thornhold: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { GREEN_MAN } from './green_man.ts';
import { CHAPTERHOUSE } from './lantern_chapterhouse.ts';
import { ARMOURY } from './thornhold_armoury.ts';
import { LANTERN_HALL } from './lantern_hall.ts';
import { ELDERS_YARD } from './elders_yard.ts';
import { SPLIT_OAK } from './split_oak.ts';

export const SCENES = {
  green_man: GREEN_MAN,
  lantern_chapterhouse: CHAPTERHOUSE,
  thornhold_armoury: ARMOURY,
  lantern_hall: LANTERN_HALL,
  elders_yard: ELDERS_YARD,
  split_oak: SPLIT_OAK,
} satisfies Record<string, Scene>;
