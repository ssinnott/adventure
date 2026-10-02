// The wilderness features (EXPANSION §5.3): a shrine or fountain that gives a stat once, a cairn
// with a cache, a statue that gives for its riddle's answer, typed, and a camp to rest at. A spent
// one is its id in the map's `used`, as an opened chest is, so nothing new is saved. Pure, so the
// tests load it; game.ts calls it and says what it returns.
import type { Feature, Gift } from './map.ts';
import type { World } from './world.ts';
import type { Party, Stat } from './party.ts';
import { rest as restMember } from './party.ts';
import { manhattan } from './types.ts';
import { item } from './items.ts';

/** The features this module plays. */
export type Wild = Extract<Feature, { kind: 'shrine' | 'fountain' | 'cairn' | 'statue' | 'camp' }>;

/** What a feature gives when it is used: a chest's, cairn's or den's gold and items, a shrine's stat, a statue's gift. */
export function giftOf(f: Feature): Gift | undefined {
  switch (f.kind) {
    case 'chest': case 'cairn': case 'den': return { gold: f.gold, items: f.items };
    case 'shrine': case 'fountain': return { stat: f.stat, amount: f.amount ?? 1 };
    case 'statue': return f.gift;
    default: return undefined;
  }
}

/** The id a feature is kept by in `used` once spent, or undefined for one that is never spent. */
export function spentId(f: Feature): string | undefined {
  switch (f.kind) {
    case 'chest': case 'cairn': case 'shrine': case 'fountain': case 'statue': case 'den': return f.id;
    case 'event': return f.once ? f.id : undefined;
    default: return undefined;
  }
}

const STAT_NAMES: Record<Stat, string> = { might: 'Might', intellect: 'Intellect', personality: 'Personality', endurance: 'Endurance', accuracy: 'Accuracy', speed: 'Speed', luck: 'Luck' };

/**
 * Hand the party a gift: gold and items to the purse and the bag, and `amount` of `stat` to every
 * member, whatever their state. Returns it in words for the log.
 */
export function give(party: Party, gift: Gift): string[] {
  const words: string[] = [];
  if (gift.gold) { party.gold += gift.gold; words.push(`${gift.gold} gold`); }
  for (const id of gift.items ?? []) { party.bag.push(id); words.push(item(id).name); }
  if (gift.stat) {
    const n = gift.amount ?? 1;
    for (const m of party.members) m.stats[gift.stat] += n;
    words.push(`${n > 0 ? '+' : ''}${n} ${STAT_NAMES[gift.stat]} to each of the company`);
  }
  return words;
}

/** What the log says as the party steps onto one, before Space. */
export function lookLine(f: Wild): string {
  switch (f.kind) {
    case 'shrine': return 'A shrine. Space kneels.';
    case 'fountain': return 'A fountain. Space drinks.';
    case 'cairn': return 'A cairn. Space lifts its stones.';
    case 'statue': return `${f.text} Space reads the plinth.`;
    case 'camp': return `${f.text} R rests here.`;
  }
}

/** The look as the party steps onto one; '' for one spent, or one not there. */
export const stepLine = (world: World, f: Wild): string => (!world.present(f) || (f.kind !== 'camp' && world.used(f.id)) ? '' : lookLine(f));

/**
 * Kneel at a shrine or drink at a fountain: its stat to every member the first time, its `done`
 * after. One out of its presence is not there, says nothing and is not spent.
 */
export function useShrine(world: World, party: Party, f: Extract<Wild, { kind: 'shrine' | 'fountain' }>): string[] {
  if (!world.present(f)) return [];
  if (world.used(f.id)) return [f.done];
  world.markUsed(f.id);
  return [f.text, give(party, giftOf(f)!).join(', ') + '.'];
}

/** Lift a cairn's stones: its cache the first time. */
export function openCairn(world: World, party: Party, f: Extract<Wild, { kind: 'cairn' }>): string[] {
  if (world.used(f.id)) return ['The cairn has been emptied.'];
  world.markUsed(f.id);
  const got = give(party, giftOf(f)!);
  return [...(f.text ? [f.text] : []), got.length ? `Under the stones: ${got.join(', ')}.` : 'Under the stones: nothing.'];
}

/** The longest answer the riddle's box takes, as typed. */
export const ANSWER_MAX = 16;

/** A typed word as it is compared: letters and spaces only, case-blind, trimmed, spaces single. */
export const normalWord = (s: string): string => s.toLowerCase().replace(/[^a-z ]/g, '').trim().replace(/ +/g, ' ');

/**
 * Answer a statue's riddle. The right word gives its gift and spends it; a wrong one says so and
 * spends nothing, so it may be tried again.
 */
export function answerRiddle(world: World, party: Party, f: Extract<Wild, { kind: 'statue' }>, word: string): { right: boolean; lines: string[] } {
  if (world.used(f.id)) return { right: false, lines: [f.done] };
  if (!normalWord(word) || normalWord(word) !== normalWord(f.answer)) return { right: false, lines: ['The statue is silent.'] };
  world.markUsed(f.id);
  const got = give(party, f.gift);
  return { right: true, lines: [f.done, ...(got.length ? [`At its feet: ${got.join(', ')}.`] : [])] };
}

/** Whether the party stands at a camp. */
export const atCamp = (world: World): boolean => world.map.featuresAt(world.state.x, world.state.y).some((f) => f.kind === 'camp');

/**
 * Why the party may not rest here, or '' if it may. Nowhere with a group within two squares; at a
 * camp, only with a group next to the party.
 */
export function restRefused(world: World): string {
  const near = atCamp(world) ? 1 : 2;
  const { x, y } = world.state;
  if (world.adjacentGroups().length || world.liveGroups().some((g) => manhattan(g.state.x, g.state.y, x, y) <= near)) return 'Too dangerous to rest here.';
  return '';
}

/** Eight hours' rest, a ration each, every member rested. False, and nothing changes, without the food. */
export function restParty(world: World, party: Party): boolean {
  if (!world.rest()) return false;
  for (const m of party.members) restMember(m);
  return true;
}
