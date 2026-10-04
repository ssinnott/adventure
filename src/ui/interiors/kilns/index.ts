// The Kilns' businesses, Anvilhall's and Kilnhaven's: a scene to each, keyed by the interior its
// map feature names.
import type { Scene } from '../kit.ts';
import { GREAT_HALL } from './anvilhall_great_hall.ts';
import { FORGE } from './anvilhall_forge.ts';
import { ANVILHALL_TRAINING } from './anvilhall_training_hall.ts';
import { ANVILHALL_INN } from './anvilhall_inn.ts';
import { SURGEON } from './anvilhall_surgeon.ts';
import { STORES } from './anvilhall_stores.ts';
import { KILNHAVEN_INN } from './kilnhaven_inn.ts';
import { SMITH } from './kilnhaven_smith.ts';
import { KILNHAVEN_TRAINING } from './kilnhaven_training_hall.ts';
import { HARBOURMASTER } from './kilnhaven_harbourmaster.ts';
import { CHAPEL } from './kilnhaven_chapel.ts';
import { CHANDLERY } from './kilnhaven_chandlery.ts';

export const SCENES = {
  anvilhall_great_hall: GREAT_HALL,
  anvilhall_forge: FORGE,
  anvilhall_training_hall: ANVILHALL_TRAINING,
  anvilhall_inn: ANVILHALL_INN,
  anvilhall_surgeon: SURGEON,
  anvilhall_stores: STORES,
  kilnhaven_inn: KILNHAVEN_INN,
  kilnhaven_smith: SMITH,
  kilnhaven_training_hall: KILNHAVEN_TRAINING,
  kilnhaven_harbourmaster: HARBOURMASTER,
  kilnhaven_chapel: CHAPEL,
  kilnhaven_chandlery: CHANDLERY,
} satisfies Record<string, Scene>;
