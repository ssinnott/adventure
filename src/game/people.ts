// The people the party talks to: what a person says, what a hand-in takes and pays and the
// questions they put. It depends on the person, the party and which of their words hold (`heard`),
// so the tests meet anyone as the game does, without a Game.
import type { Feature, NpcQuest, Words, Choice, Answer } from './map.ts';
import type { Party } from './party.ts';
import type { World } from './world.ts';
import { countItem, takeItem, payXp } from './party.ts';
import { item } from './items.ts';

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

/** Every item a person hands the company, by an answer. */
export const personGives = (p: Person): string[] => choices(p).flatMap((c) => c.answers.flatMap((a) => (a.gives ? [a.gives] : [])));

/**
 * Which of a person's words hold, as the game, the tests and the walkthrough all ask it: in their
 * hours, once their `after` holds and not once their `until` does, read as a group's presence is.
 */
export const heard = (world: Pick<World, 'walks' | 'ended'>, p: Person) => (w: Words): boolean => world.walks(w, p.x, p.y) && !world.ended(w);

/** An item's words to read, if it has any: a letter. */
export const readText = (id: string): readonly string[] | undefined => item(id).text;

const set = (party: Party, flags: string | readonly string[] | undefined): void => { for (const f of list(flags)) party.flags[f] = 1; };
/** A question is put until one of its answers has set its flags. */
const open = (c: Choice | undefined, party: Party): Choice | undefined =>
  c && !c.answers.some((a) => list(a.sets).length > 0 && list(a.sets).every((f) => party.flags[f])) ? c : undefined;

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
export function answerNote(a: Answer): string[] {
  const what = [a.price ? `${a.price} gold paid` : '', a.pay?.gold ? `${a.pay.gold} gold` : '', a.pay?.xp ? `${a.pay.xp} experience` : '', a.gives ? item(a.gives).name : ''].filter(Boolean);
  return what.length ? [`(${what.join(', ')}.)`] : [];
}

/** An answer as the choice screen lists it: its label, and its price where it has one, as a ware's. */
export const answerLabel = (a: Answer): string => (a.price ? `${a.label}\t${a.price}g` : a.label);

/** Whether an answer's price is more than the company has: the choice screen bars it. */
export const barred = (a: Answer, party: Party): boolean => (a.price ?? 0) > party.gold;

/** A question as the choice screen puts it: with the purse after it where an answer has a price, as a shop's is. */
export const asked = (c: Choice, party: Pick<Party, 'gold'>): string => (c.answers.some((a) => a.price) ? `${c.ask} (${party.gold} gold.)` : c.ask);

/** Said for an answer the company cannot pay for, which changes nothing. */
export const SHORT = 'You cannot afford it.';

/**
 * Answer a person's question: pay its price, set its flags, hand over its item, pay and return what
 * the person says. Short of the price, nothing changes, and it says so.
 */
export function answer(a: Answer, party: Party): string {
  if (barred(a, party)) return SHORT;
  party.gold -= a.price ?? 0;
  set(party, a.sets);
  if (a.gives) party.bag.push(a.gives);
  party.gold += a.pay?.gold ?? 0;
  const ready = a.pay?.xp ? payXp(party, a.pay.xp) : [];
  return [...a.says, ...answerNote(a), ...(ready.length ? [`Ready to train: ${ready.join(', ')}.`] : [])].join('\n\n');
}
