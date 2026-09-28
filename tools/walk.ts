// The one quest walked through (EXPANSION §5.8): a new game played by the game's own moves, one step
// of a chapter at a time, and each step checked before and after. Each area's walkthrough
// (src/content/areas/<area>/walkthrough.ts) writes its chapter's plays with these; Thornmark's plays
// the chain, and again with Thornmark taken early. Nothing in the game imports this.
//
// A step is checked as it comes up: the goal the log shows is one of the chapter's, placed at a
// built map and named in its words; the company's level, the curve's for the step, sits in that
// map's band; the play finishes it (every fight it needs is won at least once in ten by the gate's
// bot at that level, and the goal moves on); and a person who takes an item stands at the step's
// place. Every goal of every chapter has to come up in some run (`everyGoalWalked`).
import { makeRng } from '../src/lib/engine/rng.ts';
import { buildMaps } from '../src/content/maps.ts';
import { AREAS, ATLAS, MAP_DEFS, MONSTERS, THE_QUEST } from '../src/content/index.ts';
import { CURVE } from '../src/content/progression.ts';
import { World } from '../src/game/world.ts';
import { defaultParty } from '../src/game/party.ts';
import type { Party } from '../src/game/party.ts';
import { meet, heard, handIns, personFlags } from '../src/game/people.ts';
import type { Person } from '../src/game/people.ts';
import { questLog, questMarks, questNews } from '../src/game/quests.ts';
import type { Chapter, QuestCond, QuestView } from '../src/game/quests.ts';
import { homeMap } from '../src/game/atlas.ts';
import type { Facing } from '../src/game/types.ts';
import { winRate, gateOpts } from './gate.ts';

type Ok = (cond: boolean, msg: string) => void;

/** A game being walked: the world, the party, the news said so far and the level the curve gives the step. */
export interface Walk {
  world: World;
  party: Party;
  news: string[];
  level: number;
  /** Where the person who took an item this step stood, if one did. */
  handedIn?: string;
  ok: Ok;
  marks: Set<string>;
}

/** One step of a chapter: what is done to finish the goal it shows. */
export interface Step { name: string; play: (w: Walk) => void; }

export function newWalk(ok: Ok, seed = 4): Walk {
  const rng = makeRng(seed), party = defaultParty(rng);
  const world = new World(buildMaps(), party, rng);
  return { world, party, news: [], level: 1, ok, marks: questMarks(questLog(world.state, party)) };
}

/** The one quest as the log shows it now, if it is in the log. */
export const quest = (w: Walk): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def === THE_QUEST);

/** What the log announces since the last look, as the Game does after every action. */
export function listen(w: Walk): string[] {
  const log = questLog(w.world.state, w.party);
  const said = questNews(w.marks, log).map((n) => n.text);
  w.marks = questMarks(log);
  w.news.push(...said);
  return said;
}

const def = (map: string) => MAP_DEFS.find((d) => d.id === map);
const ref = (r: string): [string, string] => r.split(':') as [string, string];

/**
 * Walk from a square, facing a way, until the party is in `to` (a map, or a zone of the outdoors):
 * through a door, or over the land. The way has to let the party by, in at most `steps` steps.
 */
export function walkThrough(w: Walk, map: string, x: number, y: number, facing: Facing, to: string, steps = 8): void {
  w.world.travel(map, x, y, facing);
  const inTo = (): boolean => w.world.state.mapId === to || w.world.zone?.id === to;
  let blocked = '';
  for (let i = 0; i < steps && !inTo() && !blocked; i++) { const r = w.world.move('forward'); if (r.kind === 'blocked') blocked = r.reason; }
  w.ok(inTo(), `the way from ${map} ${x},${y} leads into ${to}${blocked ? ` -> blocked: ${blocked}` : ''}`);
  listen(w);
}

/** Step onto a once-only event, 'map:id'. */
export function see(w: Walk, at: string): void {
  const [map, id] = ref(at);
  const f = def(map)?.features?.find((x) => x.kind === 'event' && x.id === id);
  if (!f) { w.ok(false, `there is an event ${at}`); return; }
  w.world.travel(map, f.x, f.y);
  w.world.eventsHere();
  listen(w);
}

/**
 * Fight a group, 'map:id', at the step's level: the gate's bot must win it at least once in ten
 * seeded fights. Won, it dies there and its sure drops go into the bag.
 */
export function fight(w: Walk, at: string): void {
  const [map, id] = ref(at);
  const g = def(map)?.encounters?.find((e) => e.id === id);
  if (!g) { w.ok(false, `there is a group ${at}`); return; }
  const rate = winRate(w.level, g.monsters, 10, Infinity, gateOpts(g));
  w.ok(rate > 0, `${at} is won at level ${w.level} (${Math.round(rate * 100)}% of ten fights)`);
  w.world.travel(map, g.x, g.y);
  w.world.killGroups([id]);
  for (const m of g.monsters) for (const d of MONSTERS[m].drops ?? []) if (d.chance >= 1) w.party.bag.push(d.item);
  listen(w);
}

/**
 * Meet the person who hires with, finishes with or takes `what` (a flag or an item), found by that
 * and never by their square, and go through the meeting as the game does.
 */
export function meetWho(w: Walk, what: string): void {
  const found = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' && ([f.flag ?? []].flat().includes(what) || handIns(f).some((q) => q.setFlag === what || q.item === what)) ? [{ map: d.id, p: f as Person }] : []));
  w.ok(found.length === 1, `one person hires, finishes or takes ${what}${found.length === 1 ? ` (${found[0].p.name.split(',')[0]})` : ` -> ${found.length}`}`);
  if (found.length !== 1) return;
  const { map, p } = found[0];
  w.world.travel(map, p.x, p.y);
  const bag = w.party.bag.length;
  meet(p, w.party, heard(w.world, p));
  if (w.party.bag.length < bag) w.handedIn = map;
  listen(w);
}

/** The chapter a goal's words come from, and the goal. */
function goalOf(text: string): { chapter: Chapter; at: string } | undefined {
  for (const c of THE_QUEST.chapters) { const g = c.goals.find((x) => x.text === text); if (g) return { chapter: c, at: g.at }; }
  return undefined;
}

/** The names a place goes by: its map's, and its built atlas sites', on it or on the outdoor map it opens onto. "The" dropped. */
export function placeNames(map: string): string[] {
  const d = def(map);
  const home = d?.kind === 'outdoor' ? d : homeMap(MAP_DEFS, map);
  // A map with no outdoor map to open onto takes no site's name but its own.
  const on = new Set([map, ...(home ? [home.id] : [])]);
  const own = [d?.name, ...ATLAS.sites.filter((s) => !s.planned && s.map !== undefined && on.has(s.map)).map((s) => s.name)];
  return [...new Set(own.filter((n): n is string => !!n).map((n) => n.replace(/^The /, '').toLowerCase()))];
}

/** Whether a goal's words name its place (loose by design: it stops a goal naming a place not built). */
export const namesPlace = (text: string, map: string): boolean => placeNames(map).some((n) => text.toLowerCase().includes(n));

/**
 * The curve's level for a step (the footprint's default): the chapter's area floor, raised to the
 * step's place's floor, capped at the area's next floor and never falling within the chapter.
 */
export function levelFor(chapter: Chapter, at: string, before: number): number {
  const area = AREAS.find((a) => a.chapter === chapter);
  const curve = area ? CURVE[area.id] : undefined;
  if (!curve) return before;
  const floor = def(at)?.band?.[0] ?? curve.band[0];
  return Math.max(before, curve.band[0], Math.min(curve.next, floor));
}

/** The flags a person sets: hires, hand-ins, words and answers. An entry keyed to one alone is the person's words. */
const PERSON_FLAGS = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' ? personFlags(f) : [])));
const personal = (e: { when: QuestCond | readonly QuestCond[] }): boolean => [e.when].flat().every((c) => Object.keys(c).length === 1 && [c.flag ?? []].flat().some((f) => PERSON_FLAGS.has(f)));

/**
 * Play a chapter's steps, checking each as it comes up. The level is the chapter's own (a level
 * carried from another chapter would not fit its bands), and each step's play must move the goal on.
 */
export function playChapter(w: Walk, chapter: Chapter, steps: readonly Step[], how: string): void {
  let level = 0;
  for (const s of steps) {
    const v = quest(w), goal = v?.goal ?? null;
    const g = goal ? goalOf(goal) : undefined;
    if (goal) WALKED.add(goal);
    const tag = `${how}, ${chapter.title}, ${s.name}`;
    w.ok(!!g && g.chapter === chapter, `${tag}: the goal is the chapter's (${goal})`);
    if (!g || g.chapter !== chapter) return;
    const d = def(g.at);
    w.ok(!!d, `${tag}: the goal is at a built map (${g.at})`);
    w.ok(namesPlace(goal!, g.at), `${tag}: its words name the place (${placeNames(g.at).join(' or ')})`);
    level = levelFor(chapter, g.at, level);
    w.level = level;
    w.ok(!!d?.band && d.band[0] <= level && level <= d.band[1], `${tag}: level ${level} sits in ${g.at}'s band (${d?.band?.join('-')})`);
    // What the chapters already finished say must not change: nothing a person's words key is
    // written into a chapter that is done.
    const closed = new Map((v?.pages ?? []).filter((p) => p.done).map((p) => [p.def.id, new Set(p.entries.map((e) => e.id))]));
    w.handedIn = undefined;
    s.play(w);
    const after = quest(w);
    w.ok(after?.goal !== goal, `${tag}: the play finishes the step (then: ${after?.goal ?? (after?.done ? 'the quest done' : 'none')})`);
    if (w.handedIn !== undefined) w.ok(w.handedIn === g.at, `${tag}: the person it goes to stands at the step's place (${w.handedIn})`);
    const late = (after?.pages ?? []).flatMap((p) => closed.has(p.def.id) ? p.entries.filter((e) => !closed.get(p.def.id)!.has(e.id) && personal(e)).map((e) => `${p.def.id}.${e.id}`) : []);
    w.ok(!late.length, `${tag}: nothing a person says is written into a chapter already done${late.length ? ' -> ' + late.join(', ') : ''}`);
  }
}

/** Every goal a run of `playChapter` has come to, in this process. */
const WALKED = new Set<string>();

/** Every goal of every chapter came up in some run: none is words no company is ever shown. */
export function everyGoalWalked(ok: Ok): void {
  const missed = THE_QUEST.chapters.flatMap((c) => c.goals.filter((g) => !WALKED.has(g.text)).map((g) => `${c.id}: "${g.text}"`));
  ok(!missed.length, `every goal of the one quest comes up in a run${missed.length ? ' -> ' + missed.join('; ') : ''}`);
}

/** The quest's goal comes only from a chapter begun, or one before a chapter begun. */
export function goalFromBegun(w: Walk, how: string): void {
  const v = quest(w);
  if (!v?.goal) return;
  const i = THE_QUEST.chapters.findIndex((c) => c.goals.some((g) => g.text === v.goal));
  const last = THE_QUEST.chapters.reduce((n, c, k) => (v.pages.some((p) => p.def === c && p.begun) ? k : n), -1);
  w.ok(i >= 0 && i <= last, `${how}: the goal comes from no chapter past the last begun (${v.goal})`);
}

/** The entries written, by chapter, and every end said once: what an order of play must end with. */
export function ending(w: Walk, how: string): string[] {
  const v = quest(w);
  w.ok(!!v?.done && v.goal === null, `${how}: the quest is done, with no goal`);
  const ends = [...THE_QUEST.chapters.map((c) => `Chapter complete: ${c.title}.`), `Quest complete: ${THE_QUEST.title}.`];
  const twice = ends.filter((e) => w.news.filter((n) => n === e).length !== 1);
  w.ok(!twice.length && w.news.filter((n) => n === `New quest: ${THE_QUEST.title}.`).length === 1, `${how}: the quest begins once, and each chapter's end and the quest's is said once${twice.length ? ' -> ' + twice.join(' ') : ''}`);
  return (v?.pages ?? []).flatMap((p) => p.entries.map((e) => `${p.def.id}.${e.id}`)).sort();
}
