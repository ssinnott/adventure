// A prestige's trainer (DESIGN §5, #19): a person who teaches one class its first, second or third
// prestige. Once their words are said they offer it to each of the company's members of that class:
// one at its level who has the prestige before takes it for its price, the third for the trainer's
// quest done instead. Pure apart from the party and the world handed in, so the tests take a trainer
// as the game does, without a Game.
import type { Teaching } from './map.ts';
import type { Party, Character } from './party.ts';
import type { WorldState } from './world.ts';
import { PRESTIGES, PRESTIGE_LEVELS, PRESTIGE_PRICES, prestigeOf, takePrestige } from './party.ts';
import { holds } from './quests.ts';

export type { Teaching };

/** One member as the trainer's menu lists it: who, the title it would take, the price, and why not, if not. */
export interface Offer { who: number; title: string; price: number; bar: string }

/** What the prestige costs: its price, or none for the third, which asks a quest. */
export const priceOf = (t: Teaching): number => PRESTIGE_PRICES[t.prestige - 1];

/**
 * Why a member may not take what the trainer teaches, or '' if it may: short of the level, the
 * prestige before not taken, this one taken, the third's quest not done, or short of the gold.
 */
export function barOf(t: Teaching, c: Character, party: Party, world: WorldState): string {
  const n = prestigeOf(c), titles = PRESTIGES[t.cls].titles;
  if (n >= t.prestige) return ALREADY(titles[n - 1]);
  if (n < t.prestige - 1) return FIRST(titles[t.prestige - 2]);
  if (c.level < PRESTIGE_LEVELS[t.prestige - 1]) return AT_LEVEL(PRESTIGE_LEVELS[t.prestige - 1]);
  if (t.prestige === 3 && !(t.done && holds(t.done, world, party))) return NOT_YET;
  if (party.gold < priceOf(t)) return SHORT;
  return '';
}

/** The company's members the trainer would teach, each with its bar: those of the trainer's class. */
export function offers(t: Teaching, party: Party, world: WorldState): Offer[] {
  return party.members.flatMap((c, who) => (c.cls === t.cls ? [{ who, title: PRESTIGES[t.cls].titles[t.prestige - 1], price: priceOf(t), bar: barOf(t, c, party, world) }] : []));
}

/** The menu's line for an offer: the member and the title, then the price or why not. */
export const offerLine = (o: Offer, party: Party): string => `${party.members[o.who].name}: ${o.title}\t${o.bar || (o.price ? `${o.price}g` : QUEST_DONE)}`;

/** Teach a member: the price paid, the prestige taken. Nothing changes, and false, where it may not. */
export function teach(t: Teaching, party: Party, world: WorldState, who: number): { taught: boolean; line: string } {
  const c = party.members[who];
  if (!c || c.cls !== t.cls || barOf(t, c, party, world)) return { taught: false, line: '' };
  party.gold -= priceOf(t);
  takePrestige(c);
  return { taught: true, line: TAUGHT(c.name, PRESTIGES[t.cls].titles[t.prestige - 1]) };
}

// ---- the words ----

/** Put over the trainer's menu, and its way out. */
export const ask = (party: Party): string => `"Who would rise?" (${party.gold} gold.)`;
export const LEAVE = 'Leave';
/** What a trainer says to a company with none of their class in it. */
export const noneHere = (t: Teaching): string => `"I teach ${PLURAL[t.cls]}. I see none here."`;
const PLURAL: Record<Teaching['cls'], string> = {
  knight: 'knights', paladin: 'paladins', ranger: 'rangers', cleric: 'clerics', sorcerer: 'sorcerers',
  thief: 'thieves', barbarian: 'barbarians', monk: 'monks', bard: 'bards', druid: 'druids',
};
const ALREADY = (title: string): string => `${title} already`;
const FIRST = (title: string): string => `${title} first`;
const AT_LEVEL = (level: number): string => `from level ${level}`;
const NOT_YET = 'the quest first';
const SHORT = 'not enough gold';
const QUEST_DONE = 'earned';
const TAUGHT = (name: string, title: string): string => `${name} is ${/^[AEIOU]/.test(title) ? 'an' : 'a'} ${title} now.`;
