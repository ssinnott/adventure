// The Glasswold's business, at Akordu (#526): the Riders' trader's tent, keyed by the interior
// its map feature names.
import type { Scene } from '../kit.ts';
import { AKORDU_TRADER } from './akordu_trader.ts';

export const SCENES = {
  akordu_trader: AKORDU_TRADER,
} satisfies Record<string, Scene>;
