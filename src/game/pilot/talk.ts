// Talk (#721): everything the pilot says to anyone. On the way, the strategist (#720) sends it
// (meeting) to the people it has seen and not met, near it or on the map it is set on, and to those
// where the quest's goal lies again once the company holds more; to a guild; and to a statue with a
// riddle left to try. In a business it has a word with each there once a visit. Every menu it
// answers by a fixed policy (pick), a key a beat: down to the line and Space, or Esc. A crossing it is
// offered it keeps, and the navigator (#717) goes by it; it pays a guild's fee and buys its spells,
// opens a hall's work on every visit and takes all of it, takes a prestige offered, answers a riddle
// from what it has heard, and stops at the ending's choice, which is the player's. A business's own
// trade is the quartermaster's (#719). It reads the world only through Known: a person's crossings
// once offered, and a riddle once put.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import type { Party } from '../party.ts';
import { ChoiceScreen, InteriorScreen, TRADE, ROOM_TALK, shortName } from '../../ui/screens.ts';
import { RiddleScreen } from '../../ui/riddle.ts';
import * as passage from '../passage.ts';
import * as prestige from '../prestige.ts';
import { normalWord, ANSWER_MAX } from '../wilds.ts';
import { knownOf } from './known.ts';
import type { Known, Sighted } from './known.ts';
import type { Brain, Pilot } from './pilot.ts';
import { counsel, press, spare } from './keep.ts';
import { route, nearestOn, routeMaps } from './route.ts';

/** The most route steps off a person, a guild or a statue may be for it to go there, off the map it is set on. */
export const NEAR = 12;
/** The most words it tries on one riddle. */
export const TRIES = 5;
/** Said as it gives a riddle up. */
export const NO_ANSWER = 'I have no answer for the stone.';
/** Said as it leaves the ending's choice to the player, and turns itself off. */
export const YOURS = 'The choice is yours.';

/** The lines that close a menu: none of them is an answer. */
const AWAY = new Set(['Leave', 'Not now', 'Done', 'Back']);
/** The answer of a parley that is the fight, as its label says it. */
const FIGHT = /^(fight|kill|refuse|attack)\b/i;
/** The number words a HOW MANY riddle is answered from, in ascending order. */
const NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** A crossing's terms: pay the fare, or board one that is free. */
const PAY = /^Pay the fare \((\d+) gold\)$/, BOARD = 'Board';
/** A guild's fee, as its first menu offers it. */
const FEE = /^Pay the fee \((\d+) gold\)$/;
/** A guild's spells, as its menu asks. */
const LEARN = '"What would you learn?"';

/** What the company holds, as a meeting counts it: its flags, and the items in its bag and its packs. */
export const holdings = (party: Party): number => Object.keys(party.flags).length + party.bag.length + party.members.reduce((t, m) => t + m.pack.length, 0);

/** A person, or a guild, as `Pilot.met` keeps them: on the map as played, by their square and their name. */
const metKey = (map: string, f: { x: number; y: number; name: string }): string => `${map}:${f.x},${f.y}:${f.name}`;
/** A statue, as `Pilot.tried` keeps it. */
const stoneKey = (map: string, f: { x: number; y: number }): string => `${map}:${f.x},${f.y}`;
/**
 * Whether a person is to be met: never met; or, standing where the quest's goal the strategist is set
 * on lies, not since the company came to hold more, as the goal may wait on their word.
 */
const due = (g: Game, p: Pilot, key: string, goal: boolean): boolean => !p.met.has(key) || (goal && p.met.get(key)! < holdings(g.party));
/** Whether a square, on the map the party is on, lies in the map or the zone the strategist is set on; with `quest`, only one a quest's goal names. */
function aimed(g: Game, k: Known, p: Pilot, quest = false): (f: { x: number; y: number }) => boolean {
  const w = g.world, aim = p.aim?.kind === 'level' ? p.aim.zone : p.aim?.map;
  const box = aim !== undefined && (!quest || p.aim?.kind === 'quest') && k.mapOf(aim) === w.state.mapId ? { ...w.locate(aim, 0, 0), ...k.size(aim) } : undefined;
  return (f) => !!box && f.x >= box.x && f.y >= box.y && f.x < box.x + box.w && f.y < box.y + box.h;
}
/** Whether a guild is to be gone into: never, or not since the company had more gold. */
const unpaid = (g: Game, p: Pilot, key: string): boolean => (p.met.get(key) ?? -1) < g.party.gold;

/** The price a menu's line carries, as a ware's: "\t<n>g". */
const priceOf = (label: string): number | undefined => { const m = /\t(\d+)g(\t|$)/.exec(label); return m ? Number(m[1]) : undefined; };

/** The words of a line as a riddle's answer is compared (normalWord). */
const words = (s: string): string[] => s.split(/[^A-Za-z]+/).map(normalWord).filter(Boolean);

/**
 * The words to try on a riddle, the likeliest first, from the lines heard: those of three letters or
 * more, and no longer than the box takes, in each line that shares two or more of the riddle's words
 * of four letters or more, ranked by how many it shares, then the rarer in all it has heard; none of
 * the riddle's own. A HOW MANY riddle is answered by the numbers one to twelve said in a line that
 * shares one of its words, ascending.
 */
export function answers(riddle: string, heard: readonly string[]): string[] {
  const own = new Set(words(riddle)), keys = new Set([...own].filter((w) => w.length >= 4)), many = /^how many\b/.test(normalWord(riddle));
  if (many) keys.delete('many');
  const score = new Map<string, number>(), lines = new Map<string, number>();
  for (const line of heard) {
    const ws = new Set(words(line)), shared = [...ws].filter((w) => keys.has(w)).length;
    for (const w of ws) lines.set(w, (lines.get(w) ?? 0) + 1);
    if (shared < (many ? 1 : 2)) continue;
    for (const w of ws) if (w.length >= 3 && w.length <= ANSWER_MAX && !own.has(w) && (!many || NUMBERS.includes(w))) score.set(w, Math.max(score.get(w) ?? 0, shared));
  }
  if (many) return NUMBERS.filter((n) => score.has(n));
  return [...score.keys()].sort((a, b) => score.get(b)! - score.get(a)! || lines.get(a)! - lines.get(b)!);
}

/** The words for each riddle from what a pilot has heard, kept until it hears another line or forgets. */
const ANSWERS = new WeakMap<Pilot, Map<string, { at: number; n: number; words: string[] }>>();
function heardFor(p: Pilot, riddle: string): string[] {
  let kept = ANSWERS.get(p);
  if (!kept) ANSWERS.set(p, (kept = new Map()));
  const was = kept.get(riddle);
  if (was && was.at === p.hearings && was.n === p.heard.length) return was.words;
  const found = answers(riddle, p.heard);
  kept.set(riddle, { at: p.hearings, n: p.heard.length, words: found });
  return found;
}

/** Whether a statue has a riddle left to try: one not yet put, or a word heard for it not yet tried, short of TRIES. */
function unsolved(p: Pilot, key: string): boolean {
  const riddle = p.riddles.get(key), tried = p.tried.get(key);
  if (riddle === undefined) return true;
  return (tried?.size ?? 0) < TRIES && heardFor(p, riddle).some((w) => !tried?.has(w));
}

/** On a riddle: the next word heard for it, typed and Space; with none left, or TRIES tried, it says so and leaves. */
function riddle(g: Game, p: Pilot, top: RiddleScreen): Action {
  const st = g.world.state, key = stoneKey(st.mapId, st), tried = p.tried.get(key) ?? new Set<string>();
  p.riddles.set(key, top.riddle);
  p.tried.set(key, tried);
  const word = tried.size < TRIES ? heardFor(p, top.riddle).find((w) => !tried.has(w)) : undefined;
  if (!word) { g.say(NO_ANSWER); p.why = [NO_ANSWER]; return 'cancel'; }
  tried.add(word);
  top.word = word;
  p.why = [`Answering the stone: ${word}.`];
  return 'interact';
}

/** Rule 6, a person's question: the first open answer that is no way out and has no price; else the cheapest it can pay over the reserve; else -1. */
function reply(top: ChoiceScreen, gold: number): number {
  const opts = top.options, open = (i: number): boolean => !top.disabled[i] && !AWAY.has(opts[i]);
  const free = opts.findIndex((o, i) => open(i) && priceOf(o) === undefined);
  if (free >= 0) return free;
  const priced = opts.map((o, i) => ({ i, at: priceOf(o) })).filter((q) => open(q.i) && q.at !== undefined && q.at <= gold).sort((a, b) => a.at! - b.at!);
  return priced[0]?.i ?? -1;
}

/**
 * The seller's crossings: the first that goes where the navigator's way to its goal goes from here, or
 * to the map, or the zone, the strategist is set on, at a fare over the reserve; -1 with none. And
 * those it wanted and could not pay for.
 */
function crossing(g: Game, k: Known, p: Pilot, top: ChoiceScreen): { i: number; dear: Pilot['offers'] } {
  const w = g.world, st = w.state, gold = spare(g.party), dear: Pilot['offers'] = [];
  const hop = p.goal ? routeMaps(k, st.mapId, w.locate(p.goal.map, p.goal.x, p.goal.y).mapId)?.[0] : undefined;
  const aim = p.aim?.kind === 'level' ? p.aim.zone : p.aim?.map;
  for (const [i, o] of top.options.entries()) {
    const offer = p.offers.find((q) => q.map === st.mapId && q.x === st.x && q.y === st.y && q.passage.name === o.split('\t')[0]);
    if (!offer) continue;
    const at = w.locate(offer.passage.to, offer.passage.x, offer.passage.y), zone = g.maps[at.mapId]?.zoneAt(at.x, at.y)?.id;
    const next = !!hop && hop.map === st.mapId && hop.exit.x === st.x && hop.exit.y === st.y && hop.exit.to === at.mapId && hop.exit.tx === at.x && hop.exit.ty === at.y;
    const there = aim !== undefined && (aim === zone || aim === at.mapId || (k.zoneOf(aim) !== undefined && k.zoneOf(aim) === zone));
    if (!next && !there) continue;
    if ((priceOf(o) ?? 0) <= gold) return { i, dear };
    dear.push(offer);
  }
  return { i: -1, dear };
}

/** Each visit's lines it has opened, and the company's members it has bought a spell for. */
const VISITS = new WeakMap<InteriorScreen, Set<string>>();
const opened = (room: InteriorScreen): Set<string> => { let s = VISITS.get(room); if (!s) VISITS.set(room, (s = new Set())); return s; };

/** What a business's first menu offers for its trade, by its kind as Known sees it. */
const tradeOf = (f: Sighted): string | undefined => (f.kind === 'inn' || f.kind === 'temple' || f.kind === 'shop' || f.kind === 'guild' || f.kind === 'trainer' ? TRADE[f.kind] : undefined);

/**
 * In a business: its first menu opens the hall's work once a visit, a word once a visit with each
 * person there to be met (a tavern's keeper is heard coming in), then the trade: a guild's once a visit
 * with gold over the reserve, any other the quartermaster's; then Leave. A guild's fee is paid where
 * the purse over the reserve allows, and for each of the company it teaches the dearest spell it can
 * pay for is bought, one a visit. The quartermaster's menus are its own, and any other is a person's
 * question (rule 6).
 */
function visit(g: Game, k: Known, p: Pilot, top: ChoiceScreen, room: InteriorScreen): number {
  const st = g.world.state, opts = top.options, gold = spare(g.party), done = opened(room), leave = opts.length - 1;
  const here = k.features(st.mapId).filter((f) => f.x === room.at.x && f.y === room.at.y);
  const trade = here.find((f) => tradeOf(f) === opts[0]);
  if (opts.at(-1) === 'Leave' && (trade || opts[0] === ROOM_TALK)) {
    const person = (name: string): Sighted | undefined => here.find((f) => f.kind === 'npc' && shortName(f.name) === name);
    const goal = aimed(g, k, p, true)(room.at);
    const row = opts.findIndex((o) => {
      if (done.has(o)) return false;
      if (o.startsWith('Work for ')) return true;
      const f = o.startsWith('Talk to ') ? person(o.slice('Talk to '.length)) : undefined;
      return !!f && 'name' in f && !!f.name && due(g, p, metKey(st.mapId, { x: f.x, y: f.y, name: f.name }), goal);
    });
    if (row >= 0) return row;
    if (trade?.kind === 'guild') return !done.has(opts[0]) && gold > 0 ? 0 : leave;
    return (trade && counsel(g, k, p, top)) ?? leave;
  }
  const kept = counsel(g, k, p, top);
  if (kept !== null) return kept;
  const fee = FEE.exec(opts[0]);
  if (fee && opts.length === 2) return Number(fee[1]) <= gold ? 0 : leave;
  if (top.words.startsWith(LEARN)) {
    const best = opts.map((o, i) => ({ i, who: o.split(':')[0], at: priceOf(o) }))
      .filter((q) => !top.disabled[q.i] && q.at !== undefined && q.at <= gold && !done.has(`spell:${q.who}`)).sort((a, b) => b.at! - a.at!)[0];
    return best?.i ?? leave;
  }
  return reply(top, gold);
}

/**
 * The line to answer a menu with, or -1 for Esc. In order: a seller's crossings, the one it is bound
 * by or set on at a fare over the reserve, and its terms; the guild's work offered, taken; in a
 * business, as `visit` says; the offer of rest, the quartermaster's; a den stood on, burnt; a parley,
 * the first answer that is not the fight, with none Esc, which is; a prestige's trainer, the first of
 * the company it can pay to raise over the reserve; a person's question, the first answer with no
 * price, else the cheapest it can pay over the reserve; anything else, Esc.
 */
function answer(g: Game, k: Known, p: Pilot, top: ChoiceScreen): number {
  const st = g.world.state, opts = top.options, party = g.party, gold = spare(party);
  if (top.ending) return -1;
  if (top.words === passage.ask(party) && opts.at(-1) === passage.NOT_NOW) return crossing(g, k, p, top).i;
  if (opts.length === 2 && opts[1] === passage.NOT_NOW && (opts[0] === BOARD || PAY.test(opts[0]))) return Number(PAY.exec(opts[0])?.[1] ?? 0) <= gold ? 0 : -1;
  if (opts.join() === 'Take it,Not now') return 0;
  const room = g.screens.find((s): s is InteriorScreen => s instanceof InteriorScreen);
  if (room) return visit(g, k, p, top, room);
  const rest = counsel(g, k, p, top);
  if (rest !== null) return rest;
  const all = k.features(st.mapId);
  if (!top.title && opts.length === 2 && all.some((f) => f.kind === 'den' && !f.ash && f.x === st.x && f.y === st.y)) return 0;
  const person = !!top.title && all.some((f) => f.kind === 'npc' && f.name === top.title);
  if (top.title && !person) return opts.findIndex((o, i) => !top.disabled[i] && !FIGHT.test(o));
  if (person && top.words === prestige.ask(party)) return opts.findIndex((o, i) => !top.disabled[i] && !AWAY.has(o) && (priceOf(o) ?? 0) <= gold);
  return person ? reply(top, gold) : -1;
}

/** The index to answer a ChoiceScreen with, or -1 to cancel. */
export function pick(screen: ChoiceScreen, g: Game, p: Pilot): number {
  return answer(g, knownOf(g), p, screen);
}

/** Space pressed on a line: a hall's work, a guild's trade and a word with one there opened this visit, and a spell bought for that member. */
function chosen(g: Game, k: Known, p: Pilot, top: ChoiceScreen, i: number): void {
  const room = g.screens.find((s): s is InteriorScreen => s instanceof InteriorScreen), o = top.options[i];
  if (!room) return;
  const done = opened(room), st = g.world.state;
  if (o.startsWith('Work for ') || o === TRADE.guild || o.startsWith('Talk to ')) done.add(o);
  if (top.words.startsWith(LEARN)) done.add(`spell:${o.split(':')[0]}`);
  // A guild is gone into as its trade opens, with the gold the company has then.
  const guild = o === TRADE.guild && k.features(st.mapId).find((f): f is Extract<Sighted, { kind: 'guild' }> => f.kind === 'guild' && f.x === room.at.x && f.y === room.at.y);
  if (guild) p.met.set(metKey(st.mapId, guild), g.party.gold);
}

/** Esc pressed: on a seller's crossings, those it wanted and could not pay for are not taken again till it has more gold. */
function declined(g: Game, k: Known, p: Pilot, top: ChoiceScreen): void {
  if (top.words !== passage.ask(g.party)) return;
  for (const o of crossing(g, k, p, top).dear) o.short = g.party.gold;
}

/** The brain: a riddle answered; a menu answered by `pick`, down to the line and Space, or Esc; the ending's choice, left to the player. */
export const talk: Brain = (g, k, p) => {
  const top = g.top;
  if (top instanceof RiddleScreen) return riddle(g, p, top);
  if (!(top instanceof ChoiceScreen)) return null;
  if (top.ending) { p.stop(YOURS); return null; }
  const i = answer(g, k, p, top);
  if (i < 0) declined(g, k, p, top);
  const key = press(top, i);
  if (key === 'interact') chosen(g, k, p, top, i);
  return key;
};

/** A name to say in a line: "The", "A" or "An" made small within it. */
const within = (s: string): string => s.replace(/^(The|An?) /, (w) => w.toLowerCase());

/**
 * On the way, on the street (the strategist's, #720): Space on a statue stood on with a riddle left to
 * try; else to the nearest person seen and to be met (`due`), a guild to be met with gold over the
 * reserve, or a statue with a riddle left to try, within NEAR steps of the party or on the map, or the
 * zone, the strategist is set on: the navigator's first key there. None past a way shut to it; null
 * with none.
 */
export function meeting(g: Game, k: Known, p: Pilot): Action | null {
  if (!(g.top instanceof ExploreScreen)) return null;
  const w = g.world, st = w.state, all = k.features(st.mapId);
  const stone = all.find((f) => f.kind === 'statue' && f.x === st.x && f.y === st.y);
  if (stone && unsolved(p, stoneKey(st.mapId, stone))) { p.why = ['Reading the stone.']; return 'interact'; }
  const set = aimed(g, k, p), goal = aimed(g, k, p, true);
  const shut = p.shut.filter((s) => s.map === st.mapId), gold = spare(g.party);
  const wanted = all.filter((f) => !(f.x === st.x && f.y === st.y) && !shut.some((s) => s.x === f.x && s.y === f.y)
    && (set(f) || Math.abs(f.x - st.x) + Math.abs(f.y - st.y) <= NEAR)
    && ((f.kind === 'npc' && due(g, p, metKey(st.mapId, f), goal(f))) || (f.kind === 'guild' && gold > 0 && unpaid(g, p, metKey(st.mapId, f))) || (f.kind === 'statue' && unsolved(p, stoneKey(st.mapId, f)))));
  // Those never met first, so a word that sets a flag does not send it back to all it has met for another.
  const fresh = wanted.filter((f) => f.kind !== 'npc' || !p.met.has(metKey(st.mapId, f)));
  for (const group of [fresh, wanted, wanted.filter(set)]) {
    const to = group.length ? nearestOn(k, st.mapId, st.x, st.y, st.facing, group, shut) : null;
    const f = to && group.find((q) => q.x === to.x && q.y === to.y);
    if (!to || !f || (!set(f) && to.keys.filter((a) => a === 'forward').length > NEAR)) continue;
    const name = within(f.kind === 'statue' ? f.name ?? 'the statue' : 'name' in f && f.name ? shortName(f.name) : 'them');
    p.goal = { map: st.mapId, x: f.x, y: f.y, name, why: f.kind === 'npc' ? `A word with ${name}.` : `To ${name}.` };
    const key = route(g, k, p);
    if (key) return key;
  }
  return null;
}
