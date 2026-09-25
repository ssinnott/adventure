// The quest log: which quests the party knows of, what the journal says about each, and what to do
// next, all worked out from the world state and the party. Nothing here is saved: every condition
// reads something the save already holds, so the log comes back whole from any save, old ones
// included. The Game compares one look with the next to announce what changed. The words are in
// content/quests.ts.
import type { WorldState } from './world.ts';
import type { Party } from './party.ts';
import { countItem } from './party.ts';
import { QUESTS } from '../content/quests.ts';

/** Something the save records. Every part given must hold. */
export interface QuestCond {
  /** Party flags that must all be set. */
  flag?: string | readonly string[];
  /** An item someone in the party carries. */
  item?: string;
  /** A once-only event triggered, or a chest opened, on a map: 'map:id'. */
  seen?: string;
  /** A group killed on a map: 'map:id'. Guardians only; a group that respawns comes back to life. */
  slain?: string;
  /** A map the party has set foot on. */
  visited?: string;
}

/** A condition, or a list of them of which any one will do. */
export type When = QuestCond | readonly QuestCond[];

/**
 * A journal entry, written once `when` holds. Once written it must stay written, so `when` has to
 * stay true: an item alone does not, since the hand-in takes it, so pair it with the done flag.
 */
export interface QuestEntry { id: string; when: When; text: string; }

/** What to do next. Goals are tried in order and the first that holds is shown: furthest along first. */
export interface QuestGoal { when: When; text: string; }

export interface QuestDef {
  id: string;
  title: string;
  /** In the log once this holds. */
  start: When;
  /** Finished once this holds. Absent while the quest's end is not built yet: it stays open. */
  done?: When;
  /** In story order. */
  entries: readonly QuestEntry[];
  goals: readonly QuestGoal[];
}

export interface QuestView {
  def: QuestDef;
  done: boolean;
  /** The entries written so far, in story order. */
  entries: readonly QuestEntry[];
  /** The first goal that holds; null once the quest is done. */
  goal: string | null;
}

export function holds(when: When, world: WorldState, party: Party): boolean {
  return [when].flat().some((c) => condHolds(c, world, party));
}

function condHolds(c: QuestCond, w: WorldState, p: Party): boolean {
  if (c.flag !== undefined && ![c.flag].flat().every((k) => p.flags[k])) return false;
  if (c.item !== undefined && countItem(p, c.item) === 0) return false;
  if (c.seen !== undefined) { const [map, id] = c.seen.split(':'); if (!w.maps[map]?.used[id]) return false; }
  if (c.slain !== undefined) { const [map, id] = c.slain.split(':'); if ((w.maps[map]?.groups[id]?.dead ?? -1) < 0) return false; }
  if (c.visited !== undefined && !w.maps[c.visited]) return false;
  return true;
}

/** Every quest the party knows of, in the content's order. */
export function questLog(world: WorldState, party: Party, quests: readonly QuestDef[] = QUESTS): QuestView[] {
  const out: QuestView[] = [];
  for (const q of quests) {
    const done = q.done !== undefined && holds(q.done, world, party);
    if (!done && !holds(q.start, world, party)) continue;
    const entries = q.entries.filter((e) => holds(e.when, world, party));
    const goal = done ? null : q.goals.find((g) => holds(g.when, world, party))?.text ?? null;
    out.push({ def: q, done, entries, goal });
  }
  return out;
}

/** What a look at the log found, as keys: each quest known, each entry written, each quest done. */
export function questMarks(log: readonly QuestView[]): Set<string> {
  const marks = new Set<string>();
  for (const v of log) {
    marks.add(v.def.id);
    for (const e of v.entries) marks.add(`${v.def.id}.${e.id}`);
    if (v.done) marks.add(`${v.def.id}!`);
  }
  return marks;
}

/**
 * A line for each quest begun, written in or finished since `before` was marked, in the content's
 * order. A goal that moves on without a new entry is not news: it happens on every stair.
 */
export function questNews(before: ReadonlySet<string>, log: readonly QuestView[]): { quest: string; text: string }[] {
  const out: { quest: string; text: string }[] = [];
  for (const v of log) {
    const id = v.def.id;
    if (v.done && !before.has(`${id}!`)) out.push({ quest: id, text: `Quest complete: ${v.def.title}.` });
    else if (!before.has(id)) out.push({ quest: id, text: `New quest: ${v.def.title}.` });
    else if (v.entries.some((e) => !before.has(`${id}.${e.id}`))) out.push({ quest: id, text: `Quest log updated: ${v.def.title}.` });
  }
  return out;
}
