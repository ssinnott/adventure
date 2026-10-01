// The seeking quests (#19; DESIGN §5): when a member reaches a prestige's level, the log opens a
// quest to seek the trainer who teaches it, and the world map marks the place. One for each member
// and each prestige, keyed by the member's slot, made at each look from the trainers the content
// places (a person who `teaches`), so nothing is saved and an old save gains one as soon as an area
// places its trainer. Begun at the level with the prestige before; done once the member has taken it,
// or, for a third whose trainer asks a quest (`asks`), once that quest begins.
import type { MapDef, Teaching } from './map.ts';
import type { Party } from './party.ts';
import type { QuestDef, LogQuest, When, QuestView } from './quests.ts';
import { PRESTIGES, PRESTIGE_LEVELS } from './party.ts';

/** A placed trainer: the map they stand on, what the log calls the place, their name and what they teach. */
export interface Trainer { map: string; place: string; name: string; teaches: Teaching }

/** Every person who teaches a prestige, on the maps as written. */
export function trainersIn(defs: readonly MapDef[]): Trainer[] {
  return defs.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'npc' && f.teaches ? [{ map: d.id, place: d.name, name: f.name, teaches: f.teaches }] : [])));
}

/** The quest a seeking quest is for: its id, by slot and prestige. */
export const seekId = (who: number, prestige: number): string => `seek:${who}:${prestige}`;

/** Each member's seeking quests, one a placed trainer of its class, in slot order then prestige order. */
export function seekingQuests(party: Party, trainers: readonly Trainer[], quests: readonly LogQuest[] = []): QuestDef[] {
  const steps = quests.flatMap((q): readonly QuestDef[] => q.chapters ?? [q]);
  return party.members.flatMap((c, who) => trainers.filter((t) => t.teaches.cls === c.cls).sort((a, b) => a.teaches.prestige - b.teaches.prestige).map((t): QuestDef => {
    const n = t.teaches.prestige, title = PRESTIGES[c.cls].titles[n - 1];
    const member = { who, level: PRESTIGE_LEVELS[n - 1], prestige: n - 1 };
    // The trainer's own quest begun hands over, but only for this member once it is its turn: the
    // quest's start is the company's, and another of the class still under the level has not been sent.
    const asked = t.teaches.asks ? steps.find((q) => q.id === t.teaches.asks)?.start : undefined;
    const done: When = [{ member: { who, prestige: n } }, ...(asked ? [asked].flat().map((c) => ({ ...c, member })) : [])];
    const start: When = { member };
    return {
      id: seekId(who, n), title: TITLE(c.name, title), start, done, mark: true, seeker: c.name,
      entries: [{ id: 'told', when: [start, ...[done].flat()], text: t.teaches.seek ?? TOLD(t.name, t.place, title, c.name) }],
      goals: [{ when: start, text: GOAL(t.name, t.place), at: t.map }],
    };
  }));
}

/**
 * The places the world map marks: for each open quest that asks (`mark`), the map its shown goal is
 * done on, and who is to go there (the member a seeking quest is for), places shared listed once.
 */
export function sought(log: readonly QuestView[]): { at: string; who: string[] }[] {
  const out: { at: string; who: string[] }[] = [];
  for (const v of log) {
    if (v.done || v.def.chapters || !v.def.mark || v.goal === null) continue;
    const at = v.def.goals.find((g) => g.text === v.goal)?.at;
    if (!at) continue;
    const who = v.def.seeker ?? v.def.title, here = out.find((p) => p.at === at);
    if (here) { if (!here.who.includes(who)) here.who.push(who); } else out.push({ at, who: [who] });
  }
  return out;
}

// ---- the words ----
const a = (title: string): string => `${/^[AEIOU]/.test(title) ? 'an' : 'a'} ${title}`;
const TITLE = (member: string, title: string): string => `${member}: ${title}`;
const TOLD = (trainer: string, place: string, title: string, member: string): string => `${trainer} in ${place} can make ${a(title)} of ${member}.`;
const GOAL = (trainer: string, place: string): string => `Find ${trainer} in ${place}.`;
