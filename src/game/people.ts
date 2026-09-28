// The people the party talks to: what a person says, what a hand-in takes and pays, and the
// questions they put. It depends on the person and the party alone, so the tests can meet anyone
// without a Game; where words wear a presence, the caller says which hold.
import type { Feature, NpcQuest, Words, Choice, Answer } from './map.ts';
import type { Party } from './party.ts';
import { countItem, takeItem } from './party.ts';
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

/** An item's words to read, if it has any: a letter. */
export const readText = (id: string): readonly string[] | undefined => item(id).text;

const set = (party: Party, flags: string | readonly string[] | undefined): void => { for (const f of list(flags)) party.flags[f] = 1; };
/** A question is put until one of its answers has set its flags. */
const open = (c: Choice | undefined, party: Party): Choice | undefined =>
  c && !c.answers.some((a) => list(a.sets).length > 0 && list(a.sets).every((f) => party.flags[f])) ? c : undefined;

/**
 * Meet a person: change the party as the meeting does and return the words. In order: a hand-in
 * the company can make (one a meeting, in list order); the first of their words that `holds`; the
 * after-lines of the last hand-in done that has any; the first meeting, which hires. A company the
 * person never hired hears a hand-in's `early` words, and is not hired by it, so the log never says
 * it was.
 */
export function meet(p: Person, party: Party, holds: (w: Words) => boolean = () => true): Meeting {
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

/** Answer a person's question: set its flags, hand over its item, and return what the person says. */
export function answer(a: Answer, party: Party): string {
  set(party, a.sets);
  if (a.gives) party.bag.push(a.gives);
  return [...a.says, ...(a.gives ? [`(${item(a.gives).name}.)`] : [])].join('\n\n');
}
