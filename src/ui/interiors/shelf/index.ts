// The Foreland's businesses, all in Helmstow: a scene to each, keyed by the interior its map feature
// names.
import type { Scene } from '../kit.ts';
import { HEARTHLIGHT } from './hearthlight_inn.ts';
import { LANTERN_CHAPEL } from './lantern_chapel.ts';
import { PROVISIONER } from './harrow_provisioner.ts';
import { GUILDHALL } from './lantern_guildhall.ts';
import { DRILLYARD } from './warden_drillyard.ts';
import { GILDED_EEL } from './gilded_eel.ts';
import { FARM_KITCHEN } from './farm_kitchen.ts';

export const SCENES = {
  hearthlight_inn: HEARTHLIGHT,
  lantern_chapel: LANTERN_CHAPEL,
  harrow_provisioner: PROVISIONER,
  lantern_guildhall: GUILDHALL,
  warden_drillyard: DRILLYARD,
  gilded_eel: GILDED_EEL,
  farm_kitchen: FARM_KITCHEN,
} satisfies Record<string, Scene>;
