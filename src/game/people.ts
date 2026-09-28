// The people the party talks to: what a person says, and what a hand-in takes and pays. It depends
// on the person and the party alone, so the tests can meet anyone without a Game.
import type { Feature } from './map.ts';
import type { Party } from './party.ts';
import { countItem, takeItem } from './party.ts';

export type Person = Extract<Feature, { kind: 'npc' }>;

/** Meet a person: change the party as the meeting does (hire, take, pay) and return the words. */
export function meet(p: Person, party: Party): string {
  const q = p.quest;
  if (q && party.flags[q.setFlag]) return q.after.join('\n\n');
  if (q && countItem(party, q.item) > 0 && (!q.needFlag || party.flags[q.needFlag])) {
    takeItem(party, q.item);
    party.gold += q.reward;
    party.flags[q.setFlag] = 1;
    return q.done.join('\n\n') + `\n\n(${q.reward} gold.)`;
  }
  if (p.flag && !party.flags[p.flag]) party.flags[p.flag] = 1;
  return p.lines.join('\n\n');
}
