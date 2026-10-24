// How far the Hearth has steadied: the Stones restored, read from the save's flags and nothing else
// (DESIGN §9, #168), and once the company has answered at the Heart, the ending's state beside the
// count (#750). It moves only with the story, never with the clock. The title reads it from the save
// in storage, the sky and the almanac from the world, the world map from either.
import { STONES } from '../content/stones.ts';
import { ENDINGS } from '../content/endings.ts';
import type { Ending, EndingId } from '../content/endings.ts';
import type { Answer } from './mapdef.ts';
import { ATLAS } from '../content/index.ts';
import { holds } from './quests.ts';
import type { WorldState } from './world.ts';
import type { Party } from './party.ts';
import { load } from './save.ts';
import type { Store } from './save.ts';

/** The most there are to restore: read on use, not as this module loads (#896). */
export const MOST = (): number => STONES.length;

/** How many Stones the company has restored. */
export function stonesRestored(world: WorldState, party: Party): number {
  return STONES.filter((s) => s.restored && holds(s.restored, world, party)).length;
}

/** The count in the save in storage; 0 with none, or one that cannot be read. */
export function savedStones(store: Store | null): number { return savedHearth(store).stones; }

/** The ending the company has taken, by its flag alone; none before the Heart, and the table's first should two be held. */
export function endingOf(flags: Readonly<Record<string, number>>): EndingId | undefined {
  return (Object.keys(ENDINGS) as EndingId[]).find((id) => flags[ENDINGS[id].flag]);
}

/** The ending an answer would take, whatever the company holds: one whose flag it sets. No pilot answers such a question (#721). */
export function endsIn(a: Pick<Answer, 'sets'>): Ending | undefined {
  const sets = a.sets === undefined ? [] : typeof a.sets === 'string' ? [a.sets] : a.sets;
  return Object.values(ENDINGS).find((e) => sets.includes(e.flag));
}

/** The ending an answer takes: one whose flag it sets, once the company holds it (an answer it could not pay for takes none). */
export function endingTaken(a: Pick<Answer, 'sets'>, flags: Readonly<Record<string, number>>): Ending | undefined {
  const sets = a.sets === undefined ? [] : typeof a.sets === 'string' ? [a.sets] : a.sets;
  return Object.values(ENDINGS).find((e) => sets.includes(e.flag) && flags[e.flag]);
}

/** The Hearth as the company has left it: the Stones restored, and the ending once one is taken. */
export interface Hearth { stones: number; ending?: EndingId }

/** The Hearth in the save in storage, for the title: none restored and no ending with no save, or one that cannot be read. */
export function savedHearth(store: Store | null): Hearth {
  const data = store ? load(store) : null;
  return data && typeof data !== 'string' ? { stones: stonesRestored(data.world, data.party), ending: endingOf(data.party.flags) } : { stones: 0 };
}

/**
 * How the Hearth is drawn: the step its height and light take (a Stone a step, five at full),
 * how hard it flickers, and the sky's cast where the ending changed the sky. A company that has
 * taken no ending sees the count's; relit is at full and still; opened is as it was at five, under
 * a sky of another colour; finished is still and a step past full and more.
 */
export interface HearthLook { step: number; flicker: number; cast?: { top: string; foot: string } }
export function hearthLook(h: Hearth): HearthLook {
  const n = Math.min(h.stones, 5);
  switch (h.ending) {
    case 'reignite': return { step: 5, flicker: 0 };
    case 'arrive': return { step: 5, flicker: flickerOf(5), cast: OPENED_SKY };
    case 'finish': return { step: 7, flicker: 0 };
    default: return { step: n, flicker: flickerOf(n) };
  }
}
/** The sky after the hull is opened: violet over a rose foot, by day the wrong colour. */
const OPENED_SKY = { top: '#5c3a94', foot: '#e2a6c4' };

let hearth: readonly [number, number] | undefined;
/** Where the Hearth burns, in world cells: its site on the atlas, read on first use and kept, not as this module loads (#896). */
export const HEARTH = (): readonly [number, number] => (hearth ??= hearthIn(ATLAS.sites));

/** The square of the `hearth` site among an atlas's sites. None throws: the compass is never left pointing at an old square (#945). */
export function hearthIn(sites: typeof ATLAS.sites): readonly [number, number] {
  const site = sites.find((s) => s.icon === 'hearth');
  if (!site) throw new Error('the atlas has no hearth site, so nothing says where the Hearth burns');
  return site.at;
}

/** The compass bearing of the Hearth from a world cell, in degrees: 0 north, 90 east. */
export function hearthBearing(x: number, y: number): number {
  const [hx, hy] = HEARTH();
  return ((Math.atan2(hx - x, -(hy - y)) * 180) / Math.PI + 360) % 360;
}

/** How hard the Hearth flickers with `n` Stones restored, 0 to 1: a fifth at none, almost still at all. */
export function flickerOf(n: number): number {
  return [0.2, 0.15, 0.11, 0.07, 0.04, 0.02][Math.min(n, 5)];
}

/** The almanac's word on it once a Stone is restored; nothing before. */
export function steadier(n: number): string {
  return n <= 0 ? '' : STEADIER[Math.min(n, STEADIER.length) - 1];
}
/** The almanac's word on the Hearth: what the ending left of it, else how far the Stones have steadied it. */
export function hearthWord(h: Hearth): string { return (h.ending && AFTER[h.ending]) || steadier(h.stones); }
const AFTER: Readonly<Record<EndingId, string>> = {
  reignite: 'It burns steady, and the tears are closed.',
  arrive: 'It burns as it did. The sky is another colour, and there is wind.',
  finish: 'It burns harder than it ever has, and the ground hums.',
};
const STEADIER = [
  'It burns a little steadier now.',
  'It burns steadier than it did.',
  'It holds its light most nights.',
  'It hardly wavers now.',
  'It burns steady again.',
];
