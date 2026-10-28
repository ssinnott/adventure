// The one quest walked through (EXPANSION §5.8): a new game played by the game's own moves, one step
// of a chapter at a time, and each step checked before and after. Each area's walkthrough
// (src/content/areas/<area>/walkthrough.ts) writes its chapter's plays with these; Thornmark's plays
// the chain, and again with Thornmark taken early. Nothing in the game imports this. The helpers the
// walkthroughs wrote out each for itself are here once (#985), the floods over a map's squares in
// grid.ts beside it.
//
// A step is checked as it comes up: the goal the log shows is one of the chapter's, placed at a
// built map and named in its words; the company's level, the curve's for the step, sits in that
// map's band; the play finishes it (every fight it needs is won at least once in ten by the gate's
// bot at that level, and the goal moves on); and a person who takes an item stands at the step's
// place. Every goal of every chapter has to come up in some run (`everyGoalWalked`).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { AREAS, ATLAS, MAP_DEFS, MONSTERS, THE_QUEST, TABLES } from '../../src/content/index.ts';
import { CURVE } from '../../src/content/progression.ts';
import { World } from '../../src/game/world.ts';
import type { MoveResult } from '../../src/game/world.ts';
import { MINUTES_PER_DAY } from '../../src/game/calendar.ts';
import { companyLevel, defaultParty, xpForLevel } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { meet, heard, answer, handIns, personFlags } from '../../src/game/people.ts';
import type { Person } from '../../src/game/people.ts';
import { questLog, questMarks, questNews, holds } from '../../src/game/quests.ts';
import type { Chapter, PageView, QuestCond, QuestView, When } from '../../src/game/quests.ts';
import { Pilot } from '../../src/game/pilot/pilot.ts';
import { headlessGame, drive } from './headless.ts';
import { homeMap } from '../../src/game/atlas.ts';
import { useShrine } from '../../src/game/wilds.ts';
import type { EncounterDef, Feature, MapDef } from '../../src/game/mapdef.ts';
import type { Facing } from '../../src/game/types.ts';
import { winRate, gateOpts } from './fight.ts';

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
  const rng = makeRng(seed), party = defaultParty(TABLES, rng);
  const world = new World(TABLES, buildMaps(), party, rng);
  return { world, party, news: [], level: 1, ok, marks: questMarks(questLog(TABLES, world.state, party)) };
}

/** The one quest as the log shows it now, if it is in the log. */
export const quest = (w: Walk): QuestView | undefined => questLog(TABLES, w.world.state, w.party).find((v) => v.def === THE_QUEST);

/** What the log announces since the last look, as the Game does after every action. */
export function listen(w: Walk): string[] {
  const log = questLog(TABLES, w.world.state, w.party);
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
 * Kneel at a shrine or drink at a fountain, 'map:id': it has to be there, its `after` held, and bless
 * the company the once. It is knelt at as the world holds it, found by its id where the company
 * stands: on a zone map that is a copy moved to the outdoors' cells (see `locate`), not the box's own.
 */
export function kneel(w: Walk, at: string): void {
  const [map, id] = ref(at);
  type Wild = Extract<Feature, { kind: 'shrine' | 'fountain' }>;
  const isIt = (x: Feature | undefined): x is Wild => (x?.kind === 'shrine' || x?.kind === 'fountain') && x.id === id;
  const f = def(map)?.features?.find(isIt);
  if (!f) { w.ok(false, `there is a shrine or a fountain ${at}`); return; }
  w.world.travel(map, f.x, f.y);
  const here = w.world.featureHere();
  w.ok(isIt(here) && w.world.present(here), `${at} is there to kneel at`);
  if (!isIt(here)) return;
  const lines = useShrine(w.world, w.party, here);
  w.ok(lines[0] === f.text, `${at} blesses the company${lines.length ? ` (${lines.join(' ')})` : ''}`);
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
  if (g.leaves && w.world.ended(g)) { w.ok(false, `${at} is there to fight, not gone by the leave rule`); return; }
  const rate = winRate(w.level, g, 10, Infinity, gateOpts(g));
  w.ok(rate > 0, `${at} is won at level ${w.level} (${Math.round(rate * 100)}% of ten fights)`);
  w.world.travel(map, g.x, g.y);
  w.world.killGroups([id]);
  for (const m of g.monsters) for (const d of MONSTERS[m].drops ?? []) if (d.chance >= 1) w.party.bag.push(d.item);
  listen(w);
}

/**
 * A group gone by the leave rule, 'map:id' (#747): it leaves, its `until` holds, and on its map it is
 * not drawn, met or fought, nor in the way of a rest. Found on the world's map first, so a fixture's
 * group is found too.
 */
export function gone(w: Walk, at: string): void {
  const [map, id] = ref(at);
  const g = w.world.maps[map]?.encounters.find((e) => e.id === id) ?? def(map)?.encounters?.find((e) => e.id === id);
  if (!g) { w.ok(false, `there is a group ${at}`); return; }
  w.world.travel(map, g.x, g.y);
  w.ok(!!g.leaves && w.world.ended(g) && !w.world.liveGroups().some((x) => x.def.id === id), `${at} is gone by the leave rule, not there to see, meet or fight`);
  listen(w);
}

/**
 * Meet the person who hires with, finishes with or takes `what` (a flag or an item), found by that
 * and never by their square, and go through the meeting as the game does.
 */
export function meetWho(w: Walk, what: string): void {
  const found = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' && ([f.flag ?? []].flat().some((x) => x === what) || handIns(f).some((q) => q.setFlag === what || q.item === what)) ? [{ map: d.id, p: f as Person }] : []));
  w.ok(found.length === 1, `one person hires, finishes or takes ${what}${found.length === 1 ? ` (${found[0].p.name.split(',')[0]})` : ` -> ${found.length}`}`);
  if (found.length !== 1) return;
  const { map, p } = found[0];
  w.world.travel(map, p.x, p.y);
  w.ok(w.world.present(p), `${p.name.split(',')[0]} is there to meet`);
  const bag = w.party.bag.length;
  meet(p, w.party, heard(w.world, p));
  if (w.party.bag.length < bag) w.handedIn = map;
  listen(w);
}

/** The chapter a goal's words come from, and the goal. */
function chapterOf(text: string): { chapter: Chapter; at: string } | undefined {
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
    const g = goal ? chapterOf(goal) : undefined;
    if (goal) walked(w.ok).add(goal);
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

/**
 * The pilot plays a chapter from a new game (#720, the first of #723's runs): `headlessGame(seed)` with
 * an instant pilot at the helm asking every brain (`BRAINS`), ticked up to `cap` times until `until`
 * holds: the chapter's end, unless a play names where the pilot stops for now. Every key is the
 * pilot's, through `Game.update`; it must hold the helm all the way (no wipe, no stop of its own).
 * The ok line gives the seed, the ticks and the seconds it took, and the company's fall if it fell.
 */
export function pilotPlays(ok: Ok, chapter: Chapter, opts: PilotOpts = {}): void {
  const r = pilotRun(chapter, { budget: PLAY_BUDGET, ...opts });
  const capped = r.capped ? `CAPPED (${r.capped === 'budget' ? 'the budget' : 'the ticks'}) at tick ${r.ticks}, ` : '';
  ok(r.reached && r.on, `the pilot plays ${chapter.title} from a new game on seed ${r.seed} ${r.done ? 'to its end' : 'as far as the play is bounded'}, ${capped}in ${r.ticks} ticks, ${r.secs} s (${r.goal}; "${r.why}")`);
}

/** The wall-clock budget of a walkthrough's play (#723): five minutes, so that no run burns an hour. */
export const PLAY_BUDGET = 5 * 60_000;
/** A pilot's play: where it stops, its tick cap and wall-clock budget in milliseconds, the seed and the company (the premade one unless named, #723). */
export interface PilotOpts { until?: When; cap?: number; budget?: number; seed?: number; party?: Party }
/**
 * What a pilot's play came to: the point reached, the helm still held, the chapter done, the cap that
 * ended it if one did ('ticks' or 'budget'), the time, and where the company stood at the end, at what
 * level, with the journal's goal and the why line.
 */
export interface PilotRun { seed: number; reached: boolean; on: boolean; done: boolean; capped: '' | 'ticks' | 'budget'; ticks: number; secs: string; where: string; level: number; goal: string; why: string }

/** The play `pilotPlays` checks, given back rather than checked: the survival sweep reads it seed by seed (#723). */
export function pilotRun(chapter: Chapter, { until = chapter.done, cap = 200_000, budget = Infinity, seed = 4, party }: PilotOpts = {}): PilotRun {
  const g = headlessGame(seed, party), p = new Pilot({ instant: true });
  g.pilot = p;
  p.toggle(g);
  const t0 = performance.now(), at = (): boolean => holds(until, g.world.state, g.party);
  let ticks = 0, over = false;
  for (; ticks < cap && p.on && !at() && !over; ticks++) { drive(g, [null]); if (ticks % 100 === 0) over = performance.now() - t0 > budget; }
  const st = g.world.state, goal = questLog(TABLES, st, g.party).find((v) => v.def === THE_QUEST)?.goal ?? 'no goal shown', reached = at();
  const capped = reached || !p.on ? '' : over ? 'budget' : ticks >= cap ? 'ticks' : '';
  return { seed, reached, on: p.on, done: holds(chapter.done, st, g.party), capped, ticks, secs: ((performance.now() - t0) / 1000).toFixed(1),
    where: `${g.world.zone?.name ?? g.maps[st.mapId]?.name ?? st.mapId} ${st.x},${st.y}`, level: companyLevel(g.party), goal, why: p.why[0] };
}

/**
 * Every goal a run of `playChapter` has come to, kept under the `ok` its walk was given: the runner
 * gives each walkthrough one of its own, so what one walks is never another's, and a walkthrough run
 * alone is the one the full run runs (#946).
 */
const WALKED = new WeakMap<Ok, Set<string>>();
const walked = (ok: Ok): Set<string> => { let s = WALKED.get(ok); if (!s) WALKED.set(ok, (s = new Set())); return s; };

/**
 * Every goal of every chapter given came up in some run under `ok`, the walkthrough's: none is words
 * no company is ever shown. An area's walkthrough gives the chapters its own runs walk whole.
 */
export function everyGoalWalked(ok: Ok, chapters: readonly Chapter[] = THE_QUEST.chapters): void {
  const seen = walked(ok), missed = chapters.flatMap((c) => c.goals.filter((g) => !seen.has(g.text)).map((g) => `${c.id}: "${g.text}"`));
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

/**
 * The entries written, by chapter, and every end said once: what an order of play must end with.
 * Given `upTo`, it ends there: the chapters to it are done and each end said once, and the quest's
 * own end is said only if no chapter comes after it.
 */
export function ending(w: Walk, how: string, upTo?: Chapter): string[] {
  const v = quest(w), n = upTo ? THE_QUEST.chapters.indexOf(upTo) + 1 : THE_QUEST.chapters.length;
  const upto = THE_QUEST.chapters.slice(0, n), last = n === THE_QUEST.chapters.length, end = `Quest complete: ${THE_QUEST.title}.`;
  if (last) w.ok(!!v?.done && v.goal === null, `${how}: the quest is done, with no goal`);
  else w.ok(n > 0 && upto.every((c) => v?.pages.some((p) => p.def === c && p.done)) && !v?.done, `${how}: the quest is done to ${upTo?.title}, and goes on`);
  const ends = [...upto.map((c) => `Chapter complete: ${c.title}.`), ...(last ? [end] : [])];
  const twice = [...ends.filter((e) => w.news.filter((x) => x === e).length !== 1), ...(last ? [] : [end].filter((e) => w.news.includes(e)))];
  w.ok(!twice.length && w.news.filter((x) => x === `New quest: ${THE_QUEST.title}.`).length === 1, `${how}: the quest begins once, and each chapter's end${last ? ' and the quest\'s' : ` to ${upTo?.title}`} is said once${twice.length ? ' -> ' + twice.join(' ') : ''}`);
  return (v?.pages ?? []).filter((p) => upto.includes(p.def as Chapter)).flatMap((p) => p.entries.map((e) => `${p.def.id}.${e.id}`)).sort();
}

// ---- What the walkthroughs wrote out each for itself (#985) ------------------------------------

/** What a move said, or its kind if it did not move: `World.move`'s answer as one line. */
export const said = (r: MoveResult): string => (r.kind === 'moved' ? r.messages.join(' / ') || 'nothing said' : r.kind);

/** Meet a person who stands at `map`, as the game does, and give back what they say; the log is heard after. */
export function hear(w: Walk, map: string, p: Person): string {
  w.world.travel(map, p.x, p.y);
  const said = meet(p, w.party, heard(w.world, p)).text;
  listen(w);
  return said;
}

/**
 * Meet a person who stands at `map` and give the answer that sets `by` (null: the one that sets
 * nothing), or the one labelled `by.label`; it has to be one of the answers, and the check names
 * the person up to the first comma of their name (`whole`: all of it). Gives back what the answer
 * says; the log is heard after.
 */
export function answerTo(w: Walk, map: string, p: Person, by: string | null | { label: string }, whole = false): string {
  w.world.travel(map, p.x, p.y);
  const m = meet(p, w.party, heard(w.world, p)), name = whole ? p.name : p.name.split(',')[0], asked = m.choice?.ask ?? 'no question';
  const label = by !== null && typeof by === 'object' ? by.label : undefined;
  const a = m.choice?.answers.find((x) => label !== undefined ? x.label === label : (x.sets ?? null) === by);
  w.ok(!!a, label !== undefined ? `${name} asks, and '${label}' is an answer (${asked})` : `${name} asks, and an answer sets ${by ?? 'nothing'} (${asked})`);
  const said = a ? answer(TABLES.items, a, w.party) : '';
  listen(w);
  return said;
}

/** The first page of the quest `id`, as the log shows it now. */
export const page = (w: Walk, id: string): PageView | undefined => questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];

/** The quest `id`'s goal as the log shows it now. */
export const goal = (w: Walk, id: string): string => page(w, id)?.goal ?? '(no goal)';

/** Chapter `c`'s goal whose words begin with `start`. */
export const goalOf = (c: Chapter, start: string): string => c.goals.find((g) => g.text.startsWith(start))!.text;

/** The entries written on chapter `c`'s page, by id. */
export const written = (w: Walk, c: Chapter): string[] => (quest(w)?.pages.find((p) => p.def === c)?.entries ?? []).map((e) => e.id);

/** Whether the quest titled `title` has begun: its news said. */
export const began = (w: Walk, title: string): boolean => w.news.includes(`New quest: ${title}.`);

/**
 * The quest `id` done, with no goal: its entries `want` written and none of `not`, and its end said
 * once. It goes by the title of its first page.
 */
export function reads(w: Walk, id: string, want: readonly string[], not: readonly string[], how: string): void {
  const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [], title = pg?.def.title ?? id;
  const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
  w.ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
    `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
}

/**
 * Whether `f`, a person or a thing on `map`, is there: the company taken to its square, and `f`
 * placed on the map it is written on (a box's square found where the world lays the box).
 */
export const there = (w: Walk, map: string, f: Feature): boolean => { w.world.travel(map, f.x, f.y); return w.world.present(f, map); };

/** Where the company stands: its map and square. */
export const here = (w: Walk): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;

/**
 * Open a chest, 'map:id': the company at its square, the chest marked used and its gold and items
 * taken, then the log heard (not if `listening` is false). A chest already open fails the step
 * (`fresh` 'check', the default), is passed by ('skip') or is opened again ('any'). Gives back the
 * items it held.
 */
export function open(w: Walk, at: string, fresh: 'check' | 'skip' | 'any' = 'check', listening = true): readonly string[] {
  const [map, id] = ref(at);
  const c = def(map)?.features?.find((f) => f.kind === 'chest' && f.id === id);
  if (c?.kind !== 'chest') { w.ok(false, `there is a chest ${at}`); return []; }
  w.world.travel(map, c.x, c.y);
  if (fresh === 'skip' && w.world.used(id)) return [];
  if (fresh === 'check') w.ok(!w.world.used(id), `the chest ${at} is there to open`);
  w.world.markUsed(id);
  w.party.gold += c.gold;
  w.party.bag.push(...c.items);
  if (listening) listen(w);
  return c.items;
}

/**
 * Search from a square, facing a way, up to twenty times; found, walk two steps on through what was
 * found, into the room whose event `room` the stepping in uses. The log is heard after.
 */
export function search(w: Walk, map: string, x: number, y: number, facing: Facing, room: string): boolean {
  w.world.travel(map, x, y, facing);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  listen(w);
  return found && into.every((r) => r.kind === 'moved') && w.world.used(room);
}

/** The map whose id is `id`. */
export const mapOf = (id: string): MapDef => MAP_DEFS.find((d) => d.id === id)!;

/** The `n`th person (the first, unless told) on `map` whose name is `name`. */
export const npc = (map: string, name: string, n = 0): Person => mapOf(map).features!.filter((f) => f.kind === 'npc' && f.name === name)[n] as Person;

/** The person on `map` at x, y whose name begins `name` (and who hires with `flag`, if one is given); there has to be one. */
export function who(map: string, x: number, y: number, name: string, flag?: string): Person {
  const p = MAP_DEFS.find((d) => d.id === map)?.features?.find((f): f is Person => f.kind === 'npc' && f.x === x && f.y === y && f.name.startsWith(name) && (flag === undefined || f.flag === flag));
  if (!p) throw new Error(`no ${name} at ${map} ${x},${y}`);
  return p;
}

/** The features of `kind` on map `d`. */
export const ofKind = <K extends Feature['kind']>(d: MapDef, kind: K): Extract<Feature, { kind: K }>[] => d.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);

/** The event `id` on `map`. */
export const ev = (map: string, id: string): Feature => mapOf(map).features!.find((f) => f.kind === 'event' && f.id === id)!;

/** The chest `id` on map `d`. */
export const chest = (d: MapDef, id: string): Extract<Feature, { kind: 'chest' }> => d.features!.find((f): f is Extract<Feature, { kind: 'chest' }> => f.kind === 'chest' && f.id === id)!;

/** What chest `id` on map `d` holds, its gold and its items, as words. */
export const stock = (d: MapDef, id: string): string => { const c = d.features!.find((f) => f.kind === 'chest' && f.id === id); return c?.kind === 'chest' ? `${c.gold} ${c.items.join()}` : 'none'; };

/** What the people on `map` teach. */
export const taught = (map: string) => (mapOf(map).features ?? []).flatMap((f) => (f.kind === 'npc' && f.teaches ? [f.teaches] : []));

/** The quest `id` as the log shows it now. */
export const log = (w: Walk, id: string): QuestView | undefined => questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === id);

/** Whether event or group `id` of `map` is there: the company taken to its square, and it placed on the map it is written on. */
export function shows(w: Walk, map: string, id: string): boolean {
  const d = MAP_DEFS.find((m) => m.id === map)!;
  const f = [...(d.features ?? []), ...(d.encounters ?? [])].find((x) => 'id' in x && x.id === id) as Feature | EncounterDef;
  w.world.travel(map, f.x, f.y);
  return 'monsters' in f ? w.world.walks(f, f.x, f.y, map) && !w.world.ended(f) : w.world.present(f, map);
}

/** Whether group `id` of `map` still stands there: the company taken to it. */
export function alive(w: Walk, map: string, id: string): boolean {
  const g = MAP_DEFS.find((d) => d.id === map)!.encounters!.find((e) => e.id === id)!;
  w.world.travel(map, g.x, g.y);
  return w.world.liveGroups().some((l) => l.def.id === id);
}

/** Whether group 'map:id' still stands there: the company taken to it. */
export const live = (w: Walk, at: string): boolean => alive(w, ...ref(at));

/** An iron key into the party's bag. */
export const key = (p: Party): void => { p.bag.push('key_iron'); };

/**
 * A locked chest pressed on a game of its own, the company dressed by `dress` first: what the log
 * says, whether the chest is spent, whether its items are taken and how many iron keys are left.
 */
export const press = (map: string, facing: Facing, c: Extract<Feature, { kind: 'chest' }>, dress: (p: Party) => void): string => {
  const g = headlessGame(4), p = g.party;
  dress(p);
  g.world.travel(map, c.x, c.y, facing);
  const there = g.world.featureHere(), from = g.log.length;
  g.enterCell();
  if (there) { g.interact(there); g.interact(there); }
  return `${g.log.slice(from).join(' ')} | ${g.world.used(c.id) ? 'spent' : 'shut'} | ${c.items.every((i) => p.bag.includes(i)) ? 'taken' : 'left'} | ${p.bag.filter((i) => i === 'key_iron').length} keys`;
};

/** Every chest of every map, with its map: read once, when first asked. */
let CHESTS: { map: string; f: Extract<Feature, { kind: 'chest' }> }[] | undefined;
/** The chests that hold item `id`, each 'map:id', joined. */
export const holding = (id: string): string => (CHESTS ??= MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f): f is Extract<Feature, { kind: 'chest' }> => f.kind === 'chest').map((f) => ({ map: d.id, f }))))
  .filter(({ f }) => f.items.includes(id)).map(({ map, f }) => `${map}:${f.id}`).join();

/** How many iron keys the party carries. */
export const keys = (w: Walk): number => w.party.bag.filter((i) => i === 'key_iron').length;

/** The experience the party holds, every member's together. */
export const xpOf = (p: Party): number => p.members.reduce((t, m) => t + m.xp, 0);

/** The party's thief dead. */
export const thiefDown = (p: Party): void => { p.members.find((m) => m.cls === 'thief')!.conditions.push('dead'); };

/** Whether two things are the same, field by field. */
export const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** The clock set on to hour `hour` of the next day. */
export const clock = (w: Walk, hour: number): void => { const m = w.world.state.minutes; w.world.state.minutes = m - (m % 1440) + 1440 + hour * 60; };

/** The clock set to hour `h` of the day it is. */
export const hour = (w: Walk, h: number): void => { w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + h * 60; };

/** A new walk whose company stands at `level`: every member set to it, with the experience it takes. */
export const walkAt = (ok: Ok, level: number): Walk => {
  const w = newWalk(ok);
  w.level = level;
  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
  return w;
};

/** Step `s` played at `level`: every member set to it, with the experience it takes, first. */
export const atLevel = (level: number, s: Step): Step => ({ name: `${s.name} at ${level}`, play: (w) => {
  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
  w.level = level;
  s.play(w);
} });

/** Vask hires the company: before the chapter, or its last step for a company that came early. */
export const HIRE: Step = { name: 'the hire', play: (w) => meetWho(w, 'q_ashcombe') };

/** A new game hired by Vask, the way the chapter begins in order. */
export function hired(w: Walk): void {
  listen(w);
  w.ok(!quest(w), 'a new game has no quest yet');
  HIRE.play(w);
  w.ok(w.news.at(-1) === 'New quest: The Dimming.', `Vask's hire begins the one quest (${w.news.at(-1)})`);
}

/** The Cargo Ledger found in Brandy Hole and given to Hale, as his first hand-in. */
export function ledgerGiven(w: Walk): void {
  open(w, 'greywater2:gw2_ledger');
  meetWho(w, 'q_greywater_done');
  w.ok(!!w.party.flags.q_greywater_done && !w.party.bag.includes('greywater_ledger'), 'Hale takes the ledger');
}
