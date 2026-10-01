// The quest log: which quests the party knows of, what the journal says about each, and what to do
// next, all worked out from the world state and the party. Nothing here is saved: every condition
// reads something the save already holds, so the log comes back whole from any save, old ones
// included. The Game compares one look with the next to announce what changed. The words are each
// area's: its chapter of the one quest in content/areas/<area>/chapter.ts, its side quests in
// quests.ts. content/index.ts joins the chapters in road order.
import type { WorldState, MapState } from './world.ts';
import type { Party } from './party.ts';
import { countItem, prestigeOf } from './party.ts';
import type { ClassId } from './party.ts';
import { seekingQuests, trainersIn } from './seeking.ts';
import type { Trainer } from './seeking.ts';
import { OUTDOORS } from './outdoors.ts';
import { QUESTS, MAP_DEFS } from '../content/index.ts';

/** Something the save records. Every part given must hold. */
export interface QuestCond {
  /** Party flags that must all be set. */
  flag?: string | readonly string[];
  /** An item someone in the party carries. */
  item?: string;
  /** A once-only event triggered, or a chest opened, on a map: 'map:id'. */
  seen?: string;
  /** Groups killed on a map, 'map:id', all of them. Guardians only; a group that respawns comes back to life. */
  slain?: string | readonly string[];
  /** A map the party has set foot on, or a zone map of the outdoors it has walked into. */
  visited?: string;
  /**
   * A member (the one in party slot `who`, else any) of the class, at the level or over it, with the
   * prestiges or more (game/seeking.ts). At least, never exactly, so what holds stays held.
   */
  member?: { who?: number; cls?: ClassId; level?: number; prestige?: number };
}

/**
 * The state a map's feature and group ids are kept in: its own, or for a zone map laid into the
 * outdoors (and so one the party has trodden, if anything there is to have happened), the outdoors'.
 */
function stateOf(w: WorldState, map: string): MapState | undefined {
  return w.maps[map] ?? (w.zones?.includes(map) ? w.maps[OUTDOORS] : undefined);
}

/** A condition, or a list of them of which any one will do. */
export type When = QuestCond | readonly QuestCond[];

/**
 * A journal entry, written once `when` holds. Once written it must stay written, so `when` has to
 * stay true: an item alone does not, since the hand-in takes it, so pair it with the done flag.
 */
export interface QuestEntry { id: string; when: When; text: string; }

/** What to do next. Goals are tried in order and the first that holds is shown: furthest along first. */
export interface QuestGoal {
  when: When;
  text: string;
  /** The map the step is done on. A chapter's goals must say; a side quest's may. */
  at?: string;
}

/** A quest with steps of its own: a side quest, or a chapter of the one quest. */
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
  chapters?: undefined;
  /** The world map marks its goal's place (`at`) while it is open: a seeking quest's trainer. */
  mark?: true;
}

/** An area's chapter of the one quest: begun once its start or its end holds, and every step placed. */
export interface Chapter extends QuestDef {
  done: When;
  goals: readonly (QuestGoal & { at: string })[];
}

/** The one quest, joined from the areas' chapters in road order. It has no steps of its own. */
export interface ChapteredQuest {
  id: string;
  title: string;
  chapters: readonly Chapter[];
}

/** What the log lists. Anything reading a quest's steps reads `q.chapters ?? [q]`. */
export type LogQuest = QuestDef | ChapteredQuest;

/** A page of the log: a side quest, or one chapter of the one quest. */
export interface PageView {
  def: QuestDef;
  done: boolean;
  /** The entries written so far, in story order. */
  entries: readonly QuestEntry[];
  /** Its own first goal that holds; null once it is done. */
  goal: string | null;
  /** Its start or its end holds. A chapter not begun is shown only when it holds the quest's goal. */
  begun: boolean;
}

export interface QuestView {
  def: LogQuest;
  done: boolean;
  /** The goal shown for the quest; null once it is done. */
  goal: string | null;
  /** Its pages, in road order: the quest itself, or each chapter begun, and the one the goal is from. */
  pages: readonly PageView[];
  /** The page the goal is from; the last page once there is none. */
  focus: number;
}

export function holds(when: When, world: WorldState, party: Party): boolean {
  return [when].flat().some((c) => condHolds(c, world, party));
}

function condHolds(c: QuestCond, w: WorldState, p: Party): boolean {
  if (c.flag !== undefined && ![c.flag].flat().every((k) => p.flags[k])) return false;
  if (c.item !== undefined && countItem(p, c.item) === 0) return false;
  if (c.seen !== undefined) { const [map, id] = c.seen.split(':'); if (!stateOf(w, map)?.used[id]) return false; }
  if (c.slain !== undefined && ![c.slain].flat().every((ref) => { const [map, id] = ref.split(':'); return (stateOf(w, map)?.groups[id]?.dead ?? -1) >= 0; })) return false;
  if (c.visited !== undefined && !w.maps[c.visited] && !w.zones?.includes(c.visited)) return false;
  if (c.member !== undefined) {
    const m = c.member, who = m.who === undefined ? p.members : [p.members[m.who]].filter((x) => !!x);
    if (!who.some((x) => (m.cls === undefined || x.cls === m.cls) && x.level >= (m.level ?? 0) && prestigeOf(x) >= (m.prestige ?? 0))) return false;
  }
  return true;
}

function pageOf(q: QuestDef, world: WorldState, party: Party): PageView {
  const done = q.done !== undefined && holds(q.done, world, party);
  return {
    def: q, done, begun: done || holds(q.start, world, party),
    entries: q.entries.filter((e) => holds(e.when, world, party)),
    goal: done ? null : q.goals.find((g) => holds(g.when, world, party))?.text ?? null,
  };
}

/** The trainers the content places, each by its map: what the seeking quests are made from. */
export const TRAINERS: readonly Trainer[] = trainersIn(MAP_DEFS);

/**
 * Every quest the party knows of, in the content's order, then each member's seeking quests, by its
 * slot (game/seeking.ts). The one quest is known once a chapter is
 * begun and done once every one is. Its goal is tried furthest along first, from the last chapter
 * back, passing over a chapter done and one with no chapter begun at or after it: so a company that
 * walked into Thornmark early is not sent to the Grove Stone before anyone has spoken of it.
 */
export function questLog(world: WorldState, party: Party, quests: readonly LogQuest[] = QUESTS, trainers: readonly Trainer[] = TRAINERS): QuestView[] {
  const out: QuestView[] = [];
  for (const q of [...quests, ...seekingQuests(party, trainers, quests)]) {
    if (!q.chapters) {
      const page = pageOf(q, world, party);
      if (page.begun) out.push({ def: q, done: page.done, goal: page.goal, pages: [page], focus: 0 });
      continue;
    }
    const all = q.chapters.map((c) => pageOf(c, world, party));
    if (!all.some((p) => p.begun)) continue;
    const done = all.every((p) => p.done);
    // A page's own goal is its first that holds, so the quest's is the first page's tried that has one.
    let from = -1;
    for (let i = all.length - 1; i >= 0 && from < 0; i--) if (all[i].goal !== null && all.slice(i).some((p) => p.begun)) from = i;
    const pages = all.filter((p, i) => p.begun || i === from);
    out.push({ def: q, done, goal: from < 0 ? null : all[from].goal, pages, focus: from < 0 ? pages.length - 1 : pages.indexOf(all[from]) });
  }
  return out;
}

/**
 * What a look at the log found, as keys: each quest known, each entry written, each quest done; for
 * the one quest, each chapter begun (`quest/chapter`), its entries and its end (`quest/chapter!`).
 */
export function questMarks(log: readonly QuestView[]): Set<string> {
  const marks = new Set<string>();
  for (const v of log) {
    marks.add(v.def.id);
    if (v.done) marks.add(`${v.def.id}!`);
    for (const p of v.pages) {
      if (!p.begun) continue;
      const key = v.def.chapters ? `${v.def.id}/${p.def.id}` : v.def.id;
      marks.add(key);
      for (const e of p.entries) marks.add(`${key}.${e.id}`);
      if (p.done) marks.add(`${key}!`);
    }
  }
  return marks;
}

/**
 * A line for each quest begun, written in or finished since `before` was marked, in the content's
 * order; for the one quest, also each chapter begun or finished, though not the first beside "New
 * quest". A goal that moves on without a new entry is not news: it happens on every stair.
 */
export function questNews(before: ReadonlySet<string>, log: readonly QuestView[]): { quest: string; text: string }[] {
  const out: { quest: string; text: string }[] = [];
  for (const v of log) {
    const id = v.def.id, title = v.def.title;
    const say = (text: string): void => { out.push({ quest: id, text }); };
    const fresh = (p: PageView, key: string): boolean => p.entries.some((e) => !before.has(`${key}.${e.id}`));
    if (!v.def.chapters) {
      if (v.done && !before.has(`${id}!`)) say(`Quest complete: ${title}.`);
      else if (!before.has(id)) say(`New quest: ${title}.`);
      else if (fresh(v.pages[0], id)) say(`Quest log updated: ${title}.`);
      continue;
    }
    const n = out.length;
    const known = before.has(id);
    if (!known) say(`New quest: ${title}.`);
    let updated = false;
    for (const p of v.pages) {
      if (!p.begun) continue;
      const key = `${id}/${p.def.id}`;
      if (p.done && !before.has(`${key}!`)) say(`Chapter complete: ${p.def.title}.`);
      else if (known && !before.has(key)) say(`New chapter: ${p.def.title}.`);
      else if (fresh(p, key)) updated = true;
    }
    if (v.done && !before.has(`${id}!`)) say(`Quest complete: ${title}.`);
    if (out.length === n && updated) say(`Quest log updated: ${title}.`);
  }
  return out;
}
