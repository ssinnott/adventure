// Talk (#721; docs/PILOT.md): everything the pilot says to anyone. It meets each person it sees near,
// or on the aim's map, by stepping onto them (the game talks on the step), and again once the company
// has set a flag or gained an item since; it answers a question by a fixed policy (`pick`), takes a
// crossing it has been told of where the navigator's way goes by it, joins a guild's hall and works
// its ladder, buys spells and takes a prestige offered; it reads a statue's plinth and tries the words
// it has heard that may answer it (`answers`), and stops itself at the ending's question. It reads the
// world through Known and a menu or a riddle as the screen shows it, and presses the keys a player
// would: `down` to a row and Space, or Esc; a word's letters as the keyboard types them, then Enter.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../../ui/explore.ts';
import type { Action } from '../input.ts';
import type { Feature } from '../../game/mapdef.ts';
import type { Party } from '../../game/party.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import * as passage from '../../game/passage.ts';
import * as prestige from '../../game/prestige.ts';
import { askSkill } from '../../game/skills.ts';
import { askLine, askTier, TIERS } from '../../game/mastery.ts';
import { ANSWER_MAX, normalWord } from '../../game/wilds.ts';
import { ChoiceScreen, InteriorScreen, TRADE, shortName } from '../../ui/screens.ts';
import { RiddleScreen } from '../../ui/riddle.ts';
import { optionParts } from '../../ui/draw.ts';
import { knownOf } from './known.ts';
import type { Known } from './known.ts';
import { route, routeLengths, routeMaps } from './route.ts';
import type { Goal } from './route.ts';
import { restWanted, spare } from './keep.ts';
import type { Brain, Pilot } from './pilot.ts';

/** The keys of route a person or a statue may be off for the pilot to go to them, off the aim's map. */
export const NEAR = 12;
/** The words a statue's riddle is tried with at most, each once (§6). */
export const TRIES = 5;
/** What the pilot says at a riddle it has no word left to try for. */
export const NO_ANSWER = 'I have no answer for the stone.';
/** The number words a HOW MANY riddle is tried with, in order. */
const NUMBERS: readonly string[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** The rows that leave a menu, which rule 6 never takes. */
const OUTS: readonly string[] = ['Leave', 'Not now', 'Done', 'Back'];
/** A tavern's first row: its keeper's words. */
const ROOM = 'The talk of the room';

/** What the company has, as the meeting rule counts it: its flags, and the items in the bag and the packs. */
interface Stamp { flags: number; items: number }
const stampOf = (p: Party): Stamp => ({ flags: Object.keys(p.flags).length, items: p.bag.length + p.members.reduce((n, m) => n + m.pack.length, 0) });
/** Whether the company has set a flag or gained an item since `then`. */
const moved = (then: Stamp | undefined, now: Stamp): boolean => !then || now.flags > then.flags || now.items > then.items;

/** What talk keeps between its ticks, by pilot (outside the save, as the rest of the pilot). */
interface Talk {
  /** The goal it set, to a person's square, that square's key and the screens shown when it was set. */
  goal?: Goal; key?: string; shown?: number;
  /** The party's square at the last look on the map ("map:x,y"): a step onto a person since is a meeting. */
  at?: string;
  /** By a square met, what the company had when it was last met there: met again once it has more. */
  when: Map<string, Stamp>;
  /** The squares met in a visit, whose stamp is taken back on the map, so that the meeting's own flags do not count. */
  after: Set<string>;
  /** The crossing chosen on a seller's menu, for its terms. */
  boarding?: string;
  /** By a statue's square, its riddle as its box showed it: read once, so its words heard can be weighed from afar. */
  riddles: Map<string, string>;
  /** By a riddle, the words that may answer it and what was heard when they were weighed (`answersOf`). */
  answers: Map<string, { stamp: string; words: string[] }>;
  /** The word being typed into a riddle's box, and the box. */
  typing?: { screen: RiddleScreen; word: string };
  /** The statues it has said it has no answer for, by square: left until a line heard gives a word not tried. */
  given: Set<string>;
}
const TALKS = new WeakMap<Pilot, Talk>();
function memOf(p: Pilot): Talk {
  let m = TALKS.get(p);
  if (!m) TALKS.set(p, (m = { when: new Map(), after: new Set(), riddles: new Map(), answers: new Map(), given: new Set() }));
  return m;
}
/** Forgets what talk kept: a new game or a load (`Pilot.forget`). */
export function untalk(p: Pilot): void { TALKS.delete(p); }

/** One visit's: the rows of its menus opened (each once a visit), the members a spell was bought for, and whether its people were due a meeting as it began. */
interface Visit { opened: Set<string>; served: Set<string>; due: boolean }
const VISITS = new WeakMap<InteriorScreen, Visit>();

const keyOf = (map: string, q: { x: number; y: number }): string => `${map}:${q.x},${q.y}`;
/** Whether the square `key` is due a meeting: never met, or met before the company last set a flag or gained an item. */
const due = (p: Pilot, mem: Talk, key: string, now: Stamp): boolean => !p.met.has(key) || moved(mem.when.get(key), now);
function meet(p: Pilot, mem: Talk, key: string, now: Stamp): void { p.met.add(key); mem.when.set(key, now); }

/** The visit open, if any, with what talk keeps of it: its people are met as it begins, and their stamp taken back on the map. */
function visitOf(g: Game, k: Known, p: Pilot, mem: Talk): { at: { x: number; y: number }; v: Visit } | undefined {
  const s = g.screens.find((q): q is InteriorScreen => q instanceof InteriorScreen);
  if (!s) return undefined;
  let v = VISITS.get(s);
  if (!v) {
    const key = keyOf(g.world.state.mapId, s.at), now = stampOf(k.party);
    VISITS.set(s, (v = { opened: new Set(), served: new Set(), due: due(p, mem, key, now) }));
    meet(p, mem, key, now);
    mem.after.add(key);
  }
  return { at: s.at, v };
}

/** The map the strategist's aim is on, as played: a quest's or a walk's map, or the zone levelled in. */
function aimMap(g: Game, p: Pilot): string | undefined {
  const a = p.aim, map = a?.kind === 'level' ? a.zone : a?.map;
  return map === undefined ? undefined : g.world.locate(map, 0, 0).mapId;
}

/** What a feature is called in the why line: "A word with Hild.", "A word with an old man mending nets.", "To the Lantern Guildhall.", "To the statue." */
function whyTo(f: Feature): string {
  const name = ('name' in f && f.name ? shortName(f.name) : f.kind).replace(/^(The|An|A) /, (a) => a.toLowerCase());
  return f.kind === 'npc' ? `A word with ${name}.` : `To ${/^(the|an?) /.test(name) ? name : `the ${name}`}.`;
}

/**
 * On the map. The goal to a person it set is walked, every key of it asked of the navigator here (the
 * strategist, asked after, would set its own); once it is over with the meeting shown, the person is
 * met, their stamp taken then, and not before, so the people of a business it goes to are due as its
 * visit begins. A person stepped onto, whoever walked there, is met (the game talks on
 * the step). With no goal walked: one stood on who is due a meeting is spoken to (Space); else the
 * nearest seen who is due, within `NEAR` keys of route or anywhere on the aim's map, or a guild's hall
 * so, is gone to ("A word with Hild."). Due: never met, or met before the company last set a flag or
 * gained an item. A statue is gone to so ("To the statue.") and its plinth read (Space) while it is
 * due a reading (`stoneDue`).
 */
function meeting(g: Game, k: Known, p: Pilot, mem: Talk): Action | null {
  const st = g.world.state, now = stampOf(k.party), at = keyOf(st.mapId, st);
  for (const key of mem.after) mem.when.set(key, now);
  mem.after.clear();
  if (mem.goal) {
    if (p.goal === mem.goal) {
      const a = route(g, k, p);
      if (a) return a;
    }
    // Over: met where the party stands on the person's square or faces it (a visit puts it back before
    // a door, facing it), the meeting shown; given up, or taken by another brain, still due. A statue
    // is never met: it is read once stood on (below).
    const to = mem.goal, ahead = { x: st.x + FACING_DX[st.facing], y: st.y + FACING_DY[st.facing] };
    if (mem.key !== undefined && g.shown !== mem.shown && st.mapId === to.map && ((st.x === to.x && st.y === to.y) || (ahead.x === to.x && ahead.y === to.y))) meet(p, mem, mem.key, now);
    mem.goal = undefined;
  }
  const seen = k.features(st.mapId), people = seen.filter((f) => f.kind === 'npc' || f.kind === 'guild'), stood = people.filter((f) => keyOf(st.mapId, f) === at);
  if (mem.at !== at) for (const f of stood) meet(p, mem, at, now);
  mem.at = at;
  if (p.goal) return null;
  const stones = seen.filter((f) => f.kind === 'statue' && stoneDue(p, mem, keyOf(st.mapId, f), k.heard));
  const want = [...people.filter((f) => due(p, mem, keyOf(st.mapId, f), now)), ...stones];
  const on = want.find((f) => keyOf(st.mapId, f) === at);
  if (on?.kind === 'statue') { p.why = ['Reading the plinth.']; return 'interact'; }
  if (on) { meet(p, mem, at, now); mem.after.add(at); p.why = [whyTo(on)]; return 'interact'; }
  const aim = p.aim, there = aim && aimMap(g, p) === st.mapId ? new Set(k.features(aim.kind === 'level' ? aim.zone : aim.map).map((f) => `${f.x},${f.y}`)) : new Set<string>();
  // A route is no shorter than the squares between: one farther than NEAR off the aim's map is not searched for.
  const near = want.filter((f) => there.has(`${f.x},${f.y}`) || Math.abs(f.x - st.x) + Math.abs(f.y - st.y) <= NEAR);
  if (!near.length) return null;
  const lengths = routeLengths(k, st.mapId, st.x, st.y, st.facing, p.shut.filter((s) => s.map === st.mapId));
  let best: { f: Feature; d: number } | undefined;
  for (const f of near) {
    const d = lengths.get(`${f.x},${f.y}`);
    if (d === undefined || (d > NEAR && !there.has(`${f.x},${f.y}`))) continue;
    if (!best || d < best.d) best = { f, d };
  }
  if (!best) return null;
  // Met once the step has gone through: a business's people, met with its door, are due as its visit begins.
  const f = best.f, key = f.kind === 'statue' ? undefined : keyOf(st.mapId, f), why = whyTo(f);
  const goal: Goal = { map: st.mapId, x: f.x, y: f.y, name: 'name' in f && f.name ? shortName(f.name) : f.kind, why };
  p.goal = goal;
  p.why = [why];
  Object.assign(mem, { goal, key, shown: g.shown });
  return route(g, k, p);
}

/**
 * Whether a statue Known shows (there, and not yet answered) is due a reading: its riddle never read;
 * or not yet given up, so that a reading tries the next word or says there is none; or given up with
 * fewer than `TRIES` words tried, and a word heard since that may answer it and is not tried.
 */
function stoneDue(p: Pilot, mem: Talk, key: string, heard: readonly string[]): boolean {
  const tried = p.tried.get(key), riddle = mem.riddles.get(key);
  if (riddle === undefined || !mem.given.has(key)) return true;
  return (tried?.size ?? 0) < TRIES && answersOf(mem, riddle, heard).some((w) => !tried?.has(w));
}

/** A line's words as typed: lower case, cut at anything not a letter ("Thornhold's" is "thornhold" and "s"). */
const wordsOf = (line: string): string[] => line.toLowerCase().split(/[^a-z]+/).filter(Boolean);

/**
 * The words to try at a riddle, the likeliest first, from the lines heard alone (§6): never the
 * statue's answer, nor anything but the question as its box shows it. A HOW MANY riddle: the number
 * words one to twelve in a line heard that shares a word of four letters or more with the rest of
 * its question, in ascending order. Any other: the words of three letters or more, but the riddle's
 * own, in every line heard that shares two or more words of four letters or more with the question,
 * ranked by that overlap (a word in several lines by its best), then the longer first, then as first
 * heard. Each is `normalWord`ed, and none longer than the box takes.
 */
export function answers(riddle: string, heard: readonly string[]): string[] {
  const own = wordsOf(riddle), many = normalWord(riddle).startsWith('how many ');
  const asks = new Set((many ? own.slice(2) : own).filter((w) => w.length >= 4)), at = new Map<string, number>();
  for (const line of heard) {
    const words = wordsOf(line), shared = new Set(words.filter((w) => asks.has(w))).size;
    if (shared < (many ? 1 : 2)) continue;
    for (const w of words.map(normalWord)) {
      if (many ? !NUMBERS.includes(w) : w.length < 3 || w.length > ANSWER_MAX || own.includes(w)) continue;
      if ((at.get(w) ?? 0) < shared) at.set(w, shared);
    }
  }
  const order = [...at.keys()];
  return many ? order.sort((a, b) => NUMBERS.indexOf(a) - NUMBERS.indexOf(b))
    : order.map((w, i) => ({ w, i })).sort((a, b) => at.get(b.w)! - at.get(a.w)! || b.w.length - a.w.length || a.i - b.i).map((q) => q.w);
}

/** `answers`, weighed again only once something new is heard. */
function answersOf(mem: Talk, riddle: string, heard: readonly string[]): string[] {
  const stamp = `${heard.length}:${heard[0]}:${heard.at(-1)}`, last = mem.answers.get(riddle);
  if (last?.stamp === stamp) return last.words;
  const words = answers(riddle, heard);
  mem.answers.set(riddle, { stamp, words });
  return words;
}

/**
 * A statue's riddle, read off its box (§6): the next word `answers` gives that this statue has not
 * been tried with (`Pilot.tried`, five at most), typed a key a tick into the box as the keyboard types
 * in the text mode (a backspace first where the box holds other letters), then Enter, and only then
 * counted as tried: a word the viewer cuts off is no try. A wrong word costs nothing; Space on the
 * statue again tries the next. None left, or five tried: "I have no answer for the stone." is said
 * (`Game.say`, into the log, as the strategist says it is lost) and Esc pressed, and the statue is
 * given up, not read again until a line heard gives a word not tried while it has tries left.
 */
function riddle(s: RiddleScreen, g: Game, k: Known, p: Pilot, mem: Talk): Action | null {
  const st = g.world.state, ahead = { x: st.x + FACING_DX[st.facing], y: st.y + FACING_DY[st.facing] };
  const stone = k.features(st.mapId).find((f) => f.kind === 'statue' && ((f.x === st.x && f.y === st.y) || (f.x === ahead.x && f.y === ahead.y)));
  const key = keyOf(st.mapId, stone ?? st), keys = g.input?.typed, tried = p.tried.get(key) ?? new Set<string>();
  mem.riddles.set(key, s.riddle);
  if (mem.typing?.screen !== s) {
    const word = keys && tried.size < TRIES ? answersOf(mem, s.riddle, k.heard).find((w) => !tried.has(w)) : undefined;
    if (word === undefined) { mem.typing = undefined; mem.given.add(key); g.say(NO_ANSWER); p.why = [NO_ANSWER]; return 'cancel'; }
    mem.typing = { screen: s, word };
  }
  const word = mem.typing.word;
  p.why = [`Trying ${word.toUpperCase()}.`];
  if (s.word === word) { p.tried.set(key, tried.add(word)); mem.given.delete(key); mem.typing = undefined; return 'interact'; }
  keys?.push(word.startsWith(s.word) ? word[s.word.length] : '\b');
  return null;
}

/** An answer to a menu: the row (-1 for Esc), the why line it is said with and what is kept once the key that answers is pressed. */
interface Answer { i: number; why?: string; then?: () => void }
const ESC: Answer = { i: -1 };

/**
 * The brain. On a menu it answers by `pick`'s rules, `down` to the row and Space, or Esc; under the
 * ending's question it presses nothing and stops itself, the band kept up ("The choice is yours.", the
 * epic's Decided 4). On a statue's riddle it types a word heard and Enter, or Esc (`riddle`). On the
 * map it meets people and reads statues (`meeting`). On any other screen, nothing.
 */
export const talk: Brain = (g, k, p) => {
  const top = g.top, mem = memOf(p);
  if (top instanceof ChoiceScreen) {
    if (top.ends) { p.stop(g, ['The choice is yours.']); return null; }
    const c = choose(top, g, k, p, mem);
    const a: Action = c.i < 0 || top.disabled[c.i] ? 'cancel' : Math.min(top.sel, top.options.length - 1) === c.i ? 'interact' : 'down';
    if (c.why) p.why = [c.why];
    if (a !== 'down') c.then?.();
    return a;
  }
  if (top instanceof RiddleScreen) return riddle(top, g, k, p, mem);
  return top instanceof ExploreScreen ? meeting(g, k, p, mem) : null;
};

/** The index to answer a ChoiceScreen with, or -1 to cancel (`talk`'s rules, in order). */
export function pick(screen: ChoiceScreen, g: Game, p: Pilot): number {
  return choose(screen, g, knownOf(g), p, memOf(p)).i;
}

/** A row's price, as "\t40g" shows it (a crossing's "free" is 0), or undefined where it shows none. */
function priceOf(row: string): number | undefined {
  const { value } = optionParts(row), m = /^(\d+)g$/.exec(value);
  return value === 'free' ? 0 : m ? Number(m[1]) : undefined;
}

/**
 * The rules, in order: (1) a crossing's terms, taken for the route chosen on its seller's menu while the
 * gold over the reserve pays the fare, and the seller's menu itself: the route that is the navigator's
 * way (`routeMaps`' first hop to the goal's map, or the aim's); (2) the rest offered, as the
 * quartermaster rules it; (3) a guild's offer of work, taken; (4) a den's choice, burnt; (5) a group's
 * question, the first answer open that is not the fight, else the fight; a prestige, the first rise
 * open; a guild's hall, its fee and for each member the costliest spell the gold over the reserve
 * pays, one a visit; its work, each offer opened once a visit; a business's first menu, the hall's
 * spells, the guild's work and the people in the room, each once a visit, then Leave; a skill, none
 * (#719); the quartermaster's own menus, their way out; (6) a person's question, the first answer open
 * that is no way out and shows no price, else the cheapest priced within the gold over the reserve;
 * any other, its way out, else Esc.
 */
function choose(c: ChoiceScreen, g: Game, k: Known, p: Pilot, mem: Talk): Answer {
  const rows = c.options, party = k.party, labels = rows.map((r) => optionParts(r).label), st = g.world.state;
  const out = (): Answer => ({ i: labels.findIndex((l) => OUTS.includes(l)) });
  if (c.ends) return ESC;
  // 1. A crossing: the seller's menu, then the terms.
  if (c.words === passage.ask(party)) return crossing(c, g, k, p, mem);
  if (rows.length === 2 && rows[1] === passage.NOT_NOW && (rows[0] === 'Board' || /^Pay the fare \(\d+ gold\)$/.test(rows[0]))) {
    const chosen = mem.boarding, fare = rows[0] === 'Board' ? 0 : Number(/\d+/.exec(rows[0])![0]), then = (): void => { mem.boarding = undefined; };
    return chosen !== undefined && fare <= spare(party) ? { i: 0, why: `Passage to ${chosen}.`, then } : { i: -1, then };
  }
  // 2. The rest offered, by the quartermaster's rule.
  if (rows.join() === 'Rest,Not now') return { i: restWanted(party) ? 0 : 1 };
  // 3. A guild's offer of work.
  if (rows.join() === 'Take it,Not now') return { i: 0, why: 'Taking the work.' };
  const visit = visitOf(g, k, p, mem), ahead = { x: st.x + FACING_DX[st.facing], y: st.y + FACING_DY[st.facing] };
  const here = (f: Feature): boolean => (f.x === st.x && f.y === st.y) || (f.x === ahead.x && f.y === ahead.y) || (!!visit && f.x === visit.at.x && f.y === visit.at.y);
  // 4. A den, its keepers dead, stepped into or faced.
  if (!visit && rows.length === 2 && !c.title && k.features(st.mapId).some((f) => f.kind === 'den' && here(f))) return { i: 0, why: 'Burning the den.' };
  // 5. A group's question: the first answer open that is not the fight; none, the fight.
  if (c.fight >= 0) return { i: rows.findIndex((_, i) => i !== c.fight && !c.disabled[i]) };
  // A prestige trainer: the first rise the game leaves open.
  if (c.words === prestige.ask(party) && rows.at(-1) === prestige.LEAVE) {
    const i = rows.slice(0, -1).findIndex((_, j) => !c.disabled[j]);
    return i < 0 ? out() : { i, why: `${labels[i].slice(0, labels[i].indexOf(':'))} rises.` };
  }
  // A guild's hall: the fee, while the gold over the reserve pays it; then the spells.
  const fee = /^Pay the fee \((\d+) gold\)$/.exec(rows[0] ?? '');
  if (fee && rows.length === 2 && rows[1] === 'Leave') return Number(fee[1]) <= spare(party) ? { i: 0, why: 'Paying the guild\'s fee.' } : { i: 1 };
  if (visit && c.words.startsWith('"What would you learn?"') && rows.at(-1) === 'Leave') return spells(c, labels, party, visit.v);
  // A guild's work: each offer opened once a visit, then Back.
  if (visit && rows.at(-1) === 'Back' && /^(Your rank with|You have no rank with) /.test(c.words)) {
    const i = labels.slice(0, -1).findIndex((l) => !visit.v.opened.has(`work:${l}`));
    return i < 0 ? { i: rows.length - 1 } : { i, then: () => visit.v.opened.add(`work:${labels[i]}`) };
  }
  // A business's first menu: the hall's spells, the guild's work and the people, each once a visit; then Leave.
  if (visit && rows.at(-1) === 'Leave' && (rows[0] === ROOM || Object.values(TRADE).includes(rows[0]))) {
    const i = labels.findIndex((l) => !visit.v.opened.has(l) && (l === TRADE.guild || l.startsWith('Work for ') || (visit.v.due && (l === ROOM || l.startsWith('Talk to ')))));
    return i < 0 ? out() : { i, then: () => visit.v.opened.add(labels[i]) };
  }
  // A skill: none is learnt (#719, decision 12).
  if (c.words === askSkill(party)) return out();
  // A tier: none is taken (#852), at a trainer's menus or a Master's person.
  if (c.words === askLine(party) || TIERS.some((t) => c.words === askTier(t, party))) return out();
  // 6. A person's question, put by one at hand: the party's square, the one ahead or the business's.
  if (c.title && k.features(st.mapId).some((f) => f.kind === 'npc' && f.name === c.title && here(f))) {
    const open = rows.map((_, i) => i).filter((i) => !c.disabled[i] && !OUTS.includes(labels[i]));
    const free = open.find((i) => priceOf(rows[i]) === undefined), cash = spare(party);
    const priced = open.filter((i) => (priceOf(rows[i]) ?? Infinity) <= cash).sort((a, b) => priceOf(rows[a])! - priceOf(rows[b])!)[0];
    const i = free ?? priced ?? -1;
    return i < 0 ? ESC : { i, why: `To ${shortName(c.title)}: ${labels[i]}` };
  }
  // Any other (the quartermaster's menus among them): its way out.
  return out();
}

/**
 * A seller's routes: the one that is the navigator's way, the first hop `routeMaps` gives from here to
 * the goal walked (to the aim's map where none is, or the goal is talk's own, to the seller), while
 * the gold over the reserve pays its fare as the menu shows it; else Not now.
 */
function crossing(c: ChoiceScreen, g: Game, k: Known, p: Pilot, mem: Talk): Answer {
  const goal = p.goal && p.goal !== mem.goal ? p.goal : null, to = goal ? g.world.locate(goal.map, goal.x, goal.y).mapId : aimMap(g, p);
  const hop = to === undefined ? undefined : routeMaps(k, g.world.state.mapId, to)?.[0], name = hop?.crossing;
  const i = name === undefined ? -1 : c.options.findIndex((r) => optionParts(r).label === name);
  if (i < 0 || c.disabled[i] || (priceOf(c.options[i]) ?? Infinity) > spare(k.party)) return ESC;
  return { i, why: `Passage to ${name}.`, then: () => { mem.boarding = name; } };
}

/**
 * A guild's spells: for the first member of the hall's classes not yet served this visit with one the
 * gold over the reserve pays, the costliest such; one a member a visit. None left, Leave.
 */
function spells(c: ChoiceScreen, labels: readonly string[], party: Party, v: Visit): Answer {
  const cash = spare(party), rows = c.options;
  let best = -1, who = '';
  for (let i = 0; i < rows.length - 1; i++) {
    const name = labels[i].slice(0, labels[i].indexOf(': ')), price = priceOf(rows[i]) ?? Infinity;
    if (v.served.has(name) || c.disabled[i] || price > cash || (who && name !== who)) continue;
    if (best < 0 || price > priceOf(rows[best])!) { best = i; who = name; }
  }
  if (best < 0) return { i: rows.length - 1 };
  return { i: best, why: `${who} learns ${labels[best].slice(who.length + 2)}.`, then: () => v.served.add(who) };
}
