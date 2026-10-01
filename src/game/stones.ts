// How far the Hearth has steadied: the Stones restored, read from the save's flags and nothing else
// (DESIGN §9, #168). It moves only with the story, never with the clock. The title reads it from
// the save in storage, the sky and the almanac from the world, the world map from either.
import { STONES } from '../content/stones.ts';
import { ATLAS } from '../content/index.ts';
import { holds } from './quests.ts';
import type { WorldState } from './world.ts';
import type { Party } from './party.ts';
import { load } from './save.ts';
import type { Store } from './save.ts';

/** The most there are to restore. */
export const MOST = STONES.length;

/** How many Stones the company has restored. */
export function stonesRestored(world: WorldState, party: Party): number {
  return STONES.filter((s) => s.restored && holds(s.restored, world, party)).length;
}

/** The count in the save in storage; 0 with none, or one that cannot be read. */
export function savedStones(store: Store | null): number {
  const data = store ? load(store) : null;
  return data ? stonesRestored(data.world, data.party) : 0;
}

/** Where the Hearth burns, in world cells: its site on the atlas. */
export const HEARTH: readonly [number, number] = ATLAS.sites.find((s) => s.icon === 'hearth')?.at ?? [256, 174];

/** The compass bearing of the Hearth from a world cell, in degrees: 0 north, 90 east. */
export function hearthBearing(x: number, y: number): number {
  return ((Math.atan2(HEARTH[0] - x, -(HEARTH[1] - y)) * 180) / Math.PI + 360) % 360;
}

/** How hard the Hearth flickers with `n` Stones restored, 0 to 1: a fifth at none, almost still at all. */
export function flickerOf(n: number): number {
  return [0.2, 0.15, 0.11, 0.07, 0.04, 0.02][Math.min(n, 5)];
}

/** The almanac's word on it once a Stone is restored; nothing before. */
export function steadier(n: number): string {
  return n <= 0 ? '' : STEADIER[Math.min(n, STEADIER.length) - 1];
}
const STEADIER = [
  'It burns a little steadier now.',
  'It burns steadier than it did.',
  'It holds its light most nights.',
  'It hardly wavers now.',
  'It burns steady again.',
];
