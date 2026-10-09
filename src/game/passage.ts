// Crossings: a coach, a boat or a Rider's horse a person sells passage on (#164; EXPANSION §2.1, §2.2). A crossing
// is open to anyone with the fare. It leaves at its hour every day, so a company that buys outside
// it waits for the next one, and it lands its days later at its own hour: the clock is what it
// costs, as well as the gold. The fare pays board, so the company lands rested and eats nothing on
// the way. Pure apart from the world and the party it is handed, so the tests take one as the game
// does, without a Game.
import type { Passage } from './map.ts';
import type { Party } from './party.ts';
import type { World } from './world.ts';
import { MINUTES_PER_DAY, clock } from './calendar.ts';
import { holds } from './quests.ts';
import { rest, companyLevel } from './party.ts';

export type { Passage };

/** What the crossing costs this company: nothing once its `free` holds, half once its `half` does. */
export function fareOf(p: Passage, world: World): number {
  const by = (w: Passage['free']): boolean => !!w && holds(w, world.state, world.party);
  return by(p.free) ? 0 : by(p.half) ? Math.floor(p.fare / 2) : p.fare;
}

/** The minute of the next departure at or after `minutes`: today's, if its hour has not passed. */
export function departure(p: Passage, minutes: number): number {
  const day = Math.floor(minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY;
  const today = day + p.departs * 60;
  return today >= minutes ? today : today + MINUTES_PER_DAY;
}

/** The minute it lands, leaving at `minutes` or the next departure after: `days` midnights on, at its hour. */
export function arrival(p: Passage, minutes: number): number {
  const leaves = departure(p, minutes);
  return Math.floor(leaves / MINUTES_PER_DAY) * MINUTES_PER_DAY + p.days * MINUTES_PER_DAY + p.arrives * 60;
}

/** The floor of the band where the crossing lands: its zone's on the outdoors, its map's elsewhere. */
export function farFloor(p: Passage, world: World): number | undefined {
  const at = world.locate(p.to, p.x, p.y), m = world.maps[at.mapId];
  return (m.zoneAt(at.x, at.y)?.band ?? m.def.band)?.[0];
}

/** The menu's line for a crossing: where, what it costs and how many days. */
export function offerLine(p: Passage, world: World): string {
  return OFFER(p.name, fareOf(p, world), p.days);
}

/**
 * The words before paying: when it leaves and lands, and to a company under the far end's floor the
 * seller's warning (EXPANSION §5.2: a warning, never a wall).
 */
export function terms(p: Passage, world: World): string {
  const floor = farFloor(p, world);
  const warn = floor !== undefined && companyLevel(world.party) < floor ? p.warning ?? WARNING[p.by] : '';
  const now = world.state.minutes, later = Math.floor(departure(p, now) / MINUTES_PER_DAY) > Math.floor(now / MINUTES_PER_DAY);
  return [TERMS(p.by, `${clock(p.departs)}${later ? ' tomorrow' : ''}`, clock(p.arrives), p.days), warn].filter(Boolean).join(' ');
}

/** The pay option's label. */
export const payLabel = (p: Passage, world: World): string => PAY(fareOf(p, world));

/**
 * Take a crossing: pay the fare, run the clock to the landing, put the company there rested and say
 * so. Nothing changes, and `taken` is false, when the company cannot pay.
 */
export function take(p: Passage, world: World, party: Party): { taken: boolean; lines: string[] } {
  const fare = fareOf(p, world);
  if (party.gold < fare) return { taken: false, lines: [SHORT] };
  party.gold -= fare;
  world.advance(arrival(p, world.state.minutes) - world.state.minutes);
  world.travel(p.to, p.x, p.y, p.facing);
  world.state.truce = 0; world.state.truceGroups = [];
  for (const m of party.members) rest(m);
  return { taken: true, lines: [p.label ?? LANDED[p.by]] };
}

// ---- the words: each crossing's own landing line and warning stand in for these where it has them ----

/** Put over the sellers' menu, with the purse as the shops show it, and its way out. */
export const ask = (party: Party): string => `"Passage to where?" (${party.gold} gold.)`;
export const NOT_NOW = 'Not now';
const days = (n: number): string => (n === 0 ? 'same day' : `${n} day${n === 1 ? '' : 's'}`);
const OFFER = (name: string, fare: number, n: number): string => `${name}\t${fare ? `${fare}g` : 'free'}\t${days(n)}`;
const WHEN = (n: number): string => (n === 0 ? 'the same day' : n === 1 ? 'the next day' : `${n} days on`);
/** How the terms say each kind goes and comes in: a Rider's horse is the Riders' to ride. */
const RUNS: Record<Passage['by'], readonly [string, string]> = {
  coach: ['The coach leaves', 'lands'], boat: ['The boat leaves', 'lands'], horse: ['The Riders ride', 'come in'],
};
const TERMS = (by: Passage['by'], leaves: string, lands: string, n: number): string =>
  `${RUNS[by][0]} at ${leaves} and ${RUNS[by][1]} ${WHEN(n)} at ${lands}. The fare pays your board.`;
const PAY = (fare: number): string => (fare ? `Pay the fare (${fare} gold)` : 'Board');
const WARNING: Record<Passage['by'], string> = {
  coach: 'The coachman looks you over. "I carry you there. I do not carry you back."',
  boat: 'The boatman looks you over. "I land you. What the shore does with you is its own affair."',
  horse: 'The Rider looks you over. "The horse carries you. It does not fight for you."',
};
const SHORT = 'You cannot afford the fare.';
const LANDED: Record<Passage['by'], string> = {
  coach: 'The coach stops and you step down, rested. The road is behind you.',
  boat: 'The boat comes in and you step ashore, rested. The sea is behind you.',
  horse: 'The Rider reins in and you get down, rested. The road is behind you.',
};
