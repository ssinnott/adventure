// The people the party talks to: what a person says, what a hand-in takes and pays and the
// questions they put. It depends on the person, the party and which of their words hold (`heard`),
// so the tests meet anyone as the game does, without a Game. `meet` says what a person says and
// asks, in order, and `answer` prices an answer as the choice screen lists and bars it
// (`answerLabel`, `asked`, `barred`); `handIns`, `personFlags` and `personGives` are what the
// checks and the save list read.
import type { Feature, EncounterDef, Presence } from './mapdef.ts';
import type { Flag } from '../content/index.ts';
import type { Party } from './party.ts';
import type { World } from './world.ts';
import { countItem, takeItem, payXp } from './party.ts';
import { item } from './items.ts';
import type { Items } from './tables.ts';

/**
 * A hand-in: the first time the party meets the NPC carrying `item`, the NPC takes it, says `done`
 * (or `early`, to a company they never hired), pays and sets `setFlag`. See game/people.ts.
 */
export interface NpcQuest {
  item: string;
  /** Gold paid; 0 pays nothing and says no gold line. */
  reward: number;
  /** What the NPC says taking the item from a company they never hired; `done` if not given. */
  early?: string[];
  done: string[];
  setFlag: Flag;
  /** What the NPC says once the quest is complete; of several hand-ins, the last done that has any. */
  after?: string[];
}

/**
 * What a person says once it holds, in place of their first meeting's lines: `after` and `until`
 * are the quest log's conditions and `when` the hours, as a group wears them. The first that holds
 * is said; it sets `sets` and may end in `choice`.
 */
export interface Words extends Presence {
  lines: readonly string[];
  sets?: Flag | readonly Flag[];
  choice?: Choice;
}

/** A question a person puts after their words, answered through the choice screen. Put until one answer's flags are set. */
export interface Choice {
  ask: string;
  answers: readonly Answer[];
}

/**
 * An answer: it sets its flags, hands the company `gives` if it has an item, pays `pay` if it has
 * any (the gold to the company, the xp split among the living, as a fight's is) and the person
 * `says` it. One with a `price` is sold as a ware is: listed at it, barred to a company with less,
 * and paid as it is answered (the thane's for the Anvil Stone, #459). One that `takes` an item hands
 * it over from the pack, barred to a company without it. An answer that gives, pays or costs sets a
 * flag, so it is answered once.
 */
export interface Answer {
  label: string;
  sets?: Flag | readonly Flag[];
  gives?: string;
  pay?: { gold?: number; xp?: number };
  price?: number;
  takes?: string;
  /** Of a group's question (`EncounterDef.choice`), the refusal: said, then the fight. It sets no flag, so the question is put again. */
  fight?: boolean;
  says: readonly string[];
}

export type Person = Extract<Feature, { kind: 'npc' }>;

/** What a meeting says, and the question it ends in, if any. */
export interface Meeting { text: string; choice?: Choice }

const list = <T>(x: T | readonly T[] | undefined): readonly T[] => x === undefined ? [] : Array.isArray(x) ? x : [x as T];

/** A person's hand-ins, in the order they are made. */
export const handIns = (p: Person): readonly NpcQuest[] => list(p.quest);

/** The questions a person can put: the first meeting's and each of their words'. */
export const choices = (p: Person): Choice[] => [p.choice, ...(p.says ?? []).map((w) => w.choice)].filter((c): c is Choice => !!c);

/** Every flag meeting a person can set: the hire, each hand-in's, each of their words' and each answer's. */
export function personFlags(p: Person): string[] {
  return [...list(p.flag), ...handIns(p).map((q) => q.setFlag), ...(p.says ?? []).flatMap((w) => list(w.sets)), ...choices(p).flatMap((c) => c.answers.flatMap((a) => list(a.sets)))];
}

/** Every flag a group can set: its fall's (#636) and its question's (#544). */
export const groupFlags = (e: Pick<EncounterDef, 'sets' | 'choice'>): string[] => [...list(e.sets), ...(e.choice?.answers ?? []).flatMap((a) => [...list(a.sets)])];

/** Every item a person hands the company, by an answer. */
export const personGives = (p: Person): string[] => choices(p).flatMap((c) => c.answers.flatMap((a) => (a.gives ? [a.gives] : [])));

/**
 * Which of a person's words hold, as the game, the tests and the walkthrough all ask it: in their
 * hours, once their `after` holds and not once their `until` does, read as a group's presence is.
 */
export const heard = (world: Pick<World, 'walks' | 'ended'>, p: Person) => (w: Words): boolean => world.walks(w, p.x, p.y) && !world.ended(w);

/** An item's words to read, if it has any: a letter. */
export const readText = (items: Items, id: string): readonly string[] | undefined => item(items, id).text;

const set = (party: Party, flags: string | readonly string[] | undefined): void => { for (const f of list(flags)) party.flags[f] = 1; };
/** Whether an answer has been given: it sets flags, and the company holds them all. */
export const given = (a: Answer, party: Pick<Party, 'flags'>): boolean => list(a.sets).length > 0 && list(a.sets).every((f) => party.flags[f]);
/** A question is put until one of its answers has set its flags: a person's, and a group's (#544). */
export const open = (c: Choice | undefined, party: Pick<Party, 'flags'>): Choice | undefined => (c && !c.answers.some((a) => given(a, party)) ? c : undefined);

/**
 * Meet a person: change the party as the meeting does and return the words. In order: a hand-in
 * the company can make (one a meeting, in list order); the first of their words that `holds` (the
 * game passes `heard`); the
 * after-lines of the last hand-in done that has any; the first meeting, which hires. A company the
 * person never hired hears a hand-in's `early` words, and is not hired by it, so the log never says
 * it was.
 */
export function meet(p: Person, party: Party, holds: (w: Words) => boolean): Meeting {
  const hires = list(p.flag), quests = handIns(p);
  const q = quests.find((x) => !party.flags[x.setFlag] && countItem(party, x.item) > 0);
  if (q) {
    const early = hires.length > 0 && !hires.every((f) => party.flags[f]);
    takeItem(party, q.item);
    party.gold += q.reward;
    party.flags[q.setFlag] = 1;
    return { text: [...(early && q.early ? q.early : q.done), ...(q.reward ? [`(${q.reward} gold.)`] : [])].join('\n\n') };
  }
  const w = (p.says ?? []).find(holds);
  if (w) { set(party, w.sets); return { text: w.lines.join('\n\n'), choice: open(w.choice, party) }; }
  const after = quests.filter((x) => party.flags[x.setFlag] && x.after?.length).at(-1);
  if (after) return { text: after.after!.join('\n\n') };
  set(party, hires);
  return { text: p.lines.join('\n\n'), choice: open(p.choice, party) };
}

/**
 * What an answer costs, hands over and pays, as its line says it: "(6000 gold paid.)", "(300 gold,
 * 660 experience, A Sealed Letter.)"; none if nothing.
 */
export function answerNote(items: Items, a: Answer): string[] {
  const what = [a.price ? `${a.price} gold paid` : '', a.takes ? `${item(items, a.takes).name} given` : '', a.pay?.gold ? `${a.pay.gold} gold` : '', a.pay?.xp ? `${a.pay.xp} experience` : '', a.gives ? item(items, a.gives).name : ''].filter(Boolean);
  return what.length ? [`(${what.join(', ')}.)`] : [];
}

/** An answer as the choice screen lists it: its label, and its price where it has one, as a ware's. */
export const answerLabel = (a: Answer): string => (a.price ? `${a.label}\t${a.price}g` : a.label);

/** Whether an answer's price is more than the company has, or it takes an item nobody carries: the choice screen bars it. */
export const barred = (a: Answer, party: Party): boolean => (a.price ?? 0) > party.gold || (!!a.takes && countItem(party, a.takes) === 0);

/** A question as the choice screen puts it: with the purse after it where an answer has a price, as a shop's is. */
export const asked = (c: Choice, party: Pick<Party, 'gold'>): string => (c.answers.some((a) => a.price) ? `${c.ask} (${party.gold} gold.)` : c.ask);

/** Said for an answer the company cannot pay for, which changes nothing. */
export const SHORT = 'You cannot afford it.';
/** Said for an answer that takes an item nobody carries, which changes nothing. */
export const NONE = 'You have none to give.';

/**
 * Answer a person's question, or a group's: pay its price, take its item, set its flags, hand over
 * its item, pay and return what is said. Short of the price or the item, nothing changes, and it
 * says so.
 */
export function answer(items: Items, a: Answer, party: Party): string {
  if (barred(a, party)) return (a.price ?? 0) > party.gold ? SHORT : NONE;
  party.gold -= a.price ?? 0;
  if (a.takes) takeItem(party, a.takes);
  set(party, a.sets);
  if (a.gives) party.bag.push(a.gives);
  party.gold += a.pay?.gold ?? 0;
  const ready = a.pay?.xp ? payXp(party, a.pay.xp) : [];
  return [...a.says, ...answerNote(items, a), ...(ready.length ? [`Ready to train: ${ready.join(', ')}.`] : [])].join('\n\n');
}
