// The quartermaster (#719): keeps the company fit to fight, on screen. Where the harness would rest
// (bot.ts mustRest) it rests where it stands, if it may and has the rations; else it makes for the
// nearest place it has seen that meets the need, the temple for the dead, a camp or an inn for rest,
// an inn or a shop for rations, a trainer for a level and a shop for gear that betters what is worn.
// In a business it picks from the menus by their labels, as drawn, a key a beat: down to the line and
// Space. What it carries that betters what is worn, bought or found, it takes up through the sheet. A
// well near, it drinks there while any of the company is under half, and remembers one that did
// nothing. It spends only the gold over the reserve, the most a temple asks to raise one of the
// company, which the temple alone draws on. It reads the world only through Known: a shop's wares and
// a trainer's levels once a menu has shown them, an inn's prices once it has been inside.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import type { Feature } from '../map.ts';
import type { Character, Party } from '../party.ts';
import { canTrain, canTrainAt, trainPrice, templePrice, hasCondition, isDown, weaponOf } from '../party.ts';
import { item, priceIn, hits } from '../items.ts';
import type { ItemDef } from '../items.ts';
import { mustRest, REST_AT } from '../bot.ts';
import { restRefused } from '../wilds.ts';
import { ChoiceScreen, InteriorScreen, SheetScreen, TRADE } from '../../ui/screens.ts';
import { knownOf } from './known.ts';
import type { Known, Sighted } from './known.ts';
import type { Brain, Pilot } from './pilot.ts';
import { route, nearestOn, routeMaps } from './route.ts';
import type { Goal } from './route.ts';

/** What the company needs, in order of urgency. */
export type Need = 'temple' | 'rest' | 'food' | 'train' | 'gear';

type Shop = Extract<Feature, { kind: 'shop' }>;
/** A business whose trade is the quartermaster's, as the party knows it. */
type Trade = Extract<Sighted, { kind: 'inn' | 'temple' | 'shop' | 'trainer' }>;
/** A place that meets a need, on a map visited, and what the why line says it is for. */
interface Spot { map: string; f: Sighted; why: string }

/** The most steps a well may be off for the company to go and drink there. */
export const WELL_STEPS = 6;

/** The gold the quartermaster keeps back: the most a temple asks to raise one of the company, 100 a level of its highest (templePrice). */
export const reserve = (p: Party): number => 100 * Math.max(0, ...p.members.map((c) => c.level));
/** What it may spend but at the temple: the purse over the reserve. */
export const spare = (p: Party): number => Math.max(0, p.gold - reserve(p));
/** Short of rations: under two nights' for each of the company. */
const hungry = (p: Party): boolean => p.food < 2 * p.members.length;

/**
 * The best of `ids` that betters what `c` wears, in the first of weapon, armour and shield where one
 * does: a weapon by its blow (`hits`), of the kind held, a bow for a bow, and two-handed only with no
 * shield; armour and a shield by armour class, a shield only beside a one-handed weapon; each one its
 * class may use. Undefined when none does.
 */
function upgrade(c: Character, ids: readonly string[]): string | undefined {
  const held = weaponOf(c), shielded = !!c.equipment.shield, ac = (d: ItemDef | string | null): number => (!d ? 0 : typeof d === 'string' ? item(d).ac ?? 0 : d.ac ?? 0);
  const can = [...new Set(ids)].map(item).filter((d) => !d.classes || d.classes.includes(c.cls));
  const best = (ds: ItemDef[], by: (d: ItemDef) => number): string | undefined => ds.sort((a, b) => by(b) - by(a))[0]?.id;
  return best(can.filter((d) => d.slot === 'weapon' && !!d.ranged === !!held.ranged && !(shielded && d.twoHanded) && hits(d) > hits(held)), hits)
    ?? best(can.filter((d) => d.slot === 'armor' && ac(d) > ac(c.equipment.armor)), ac)
    ?? best(can.filter((d) => d.slot === 'shield' && !held.twoHanded && ac(d) > ac(c.equipment.shield)), ac);
}

/**
 * The best item in `stock` for `c` that `gold`, what the company may spend over its reserve, buys at
 * `shop`'s prices: a weapon by hits() and armour or a shield by armour class; undefined when nothing
 * betters what is worn.
 */
export function better(c: Character, stock: readonly string[], shop: Pick<Shop, 'prices'>, gold: number): string | undefined {
  return upgrade(c, stock.filter((id) => priceIn(shop, id) <= gold));
}

/** What a member carries in the pack, or the company in the bag, that betters what the member wears. */
const carried = (p: Party, c: Character): string | undefined => upgrade(c, [...c.pack, ...p.bag]);

/** The first of the company a shop it knows the wares of has something for, and what: none for one who carries better already. */
function ware(p: Party, f: Sighted): { id: string; who: Character } | undefined {
  if (f.kind !== 'shop' || !f.stock) return undefined;
  for (const who of p.members) {
    const id = carried(p, who) ? undefined : better(who, f.stock, f, spare(p));
    if (id) return { id, who };
  }
  return undefined;
}

/** What it buys next in a shop: gear for the first of the company it has any for, then rations while short of them. */
function basket(p: Party, f: Extract<Sighted, { kind: 'shop' }>): { id: string; who?: Character } | undefined {
  return ware(p, f) ?? (hungry(p) && f.stock?.includes('rations') && priceIn(f, 'rations') <= spare(p) ? { id: 'rations' } : undefined);
}

/** The first of the company a trainer who teaches to `maxLevel` can teach now, standing, with the gold over the reserve for it; -1 when none. */
const trainee = (p: Party, maxLevel: number): number => p.members.findIndex((c) => canTrainAt(c, maxLevel) && !isDown(c) && trainPrice(c) <= spare(p));

/**
 * What the company needs, in order of urgency, or null: the temple for the dead or the stoned, rest by
 * the harness's rule, rations, a level one of it has the xp and the gold over the reserve for, and
 * gear that a shop it has seen sells and betters what one of it wears.
 */
export function need(g: Game, k: Known = knownOf(g)): Need | null {
  const p = g.party, why = mustRest(p);
  if (why === 'dead') return 'temple';
  if (why) return 'rest';
  if (hungry(p)) return 'food';
  if (p.members.some((c) => canTrain(c) && trainPrice(c) <= spare(p))) return 'train';
  return k.visited().some((map) => k.features(map).some((f) => ware(p, f))) ? 'gear' : null;
}

/** What tripped the rest rule, as the why line says it: the first of the company under a quarter, or the spell points. */
function low(p: Party): string {
  const c = p.members.find((m) => m.hp < m.maxHp * REST_AT);
  return c ? `${c.name} is under a quarter.` : 'the spell points are low.';
}

/** A name to say in a line: "The" made "the" within it. */
const within = (s: string): string => s.replace(/^The /, 'the ');
/** What the why line calls a place. */
const named = (f: Sighted): string => within(('name' in f && f.name) || `the ${f.kind}`);

/** An inn's room or rations the company could not pay for, by its square and the need, and not yet with more gold than it had then. */
const short = (g: Game, p: Pilot, map: string, f: { x: number; y: number }, n: Need): boolean => (p.short.get(`${map}:${f.x},${f.y}:${n}`) ?? -1) >= g.party.gold;

/**
 * The places that meet a need, seen on the maps visited, in groups by preference, each with what it is
 * for: for rest, where the company has the rations, a camp, but the one it stands on, before an inn;
 * for rations an inn or a shop it knows sells them for the gold over the reserve; a trainer it does not
 * know the levels of, or one that teaches one of it now. None that is shut to the navigator, nor an
 * inn's room or rations it could not pay for.
 */
function spots(g: Game, k: Known, p: Pilot, n: Need): Spot[][] {
  const party = g.party, st = g.world.state;
  const all = k.visited().flatMap((map) => k.features(map).map((f) => ({ map, f }))).filter(({ map, f }) => !p.shut.some((s) => s.map === map && s.x === f.x && s.y === f.y));
  const inns = (want: Need): { map: string; f: Sighted }[] => all.filter(({ map, f }) => f.kind === 'inn' && !short(g, p, map, f, want));
  const as = (why: string) => (q: { map: string; f: Sighted }): Spot => ({ ...q, why });
  switch (n) {
    case 'temple': {
      const c = party.members.find((m) => hasCondition(m, 'dead')) ?? party.members.find((m) => hasCondition(m, 'stoned'))!;
      return [all.filter(({ f }) => f.kind === 'temple').map(as(`${c.name} is ${hasCondition(c, 'dead') ? 'dead' : 'stone'}.`))];
    }
    case 'rest': {
      const fed = party.food >= party.members.length;
      return [fed ? all.filter(({ map, f }) => f.kind === 'camp' && !(map === st.mapId && f.x === st.x && f.y === st.y)).map(as(low(party))) : [], inns('rest').map(as(low(party)))];
    }
    case 'food':
      return [[...inns('food'), ...all.filter(({ f }) => f.kind === 'shop' && !!f.stock?.includes('rations') && priceIn(f, 'rations') <= spare(party))].map(as('the rations are low.'))];
    case 'train': {
      const c = party.members.find((m) => canTrain(m) && trainPrice(m) <= spare(party))!;
      return [all.filter(({ f }) => f.kind === 'trainer' && (f.maxLevel === undefined || trainee(party, f.maxLevel) >= 0)).map(as(`${c.name} is ready to train.`))];
    }
    case 'gear':
      return [all.flatMap(({ map, f }) => { const w = ware(party, f); return w ? [{ map, f, why: `${item(w.id).name} for ${w.who.name}.` }] : []; })];
  }
}

/** The quartermaster's own goals, told from another brain's: one it no longer wants it lets go. */
const MINE = new WeakSet<Goal>();

/**
 * Bound for `goal`: on by the trip it has where it is bound there already, else afresh. The navigator's
 * first key; or null, what another brain was bound for kept, where it has no way or the way is shut.
 */
function go(g: Game, k: Known, p: Pilot, goal: Goal): Action | null {
  const at = g.world.locate(goal.map, goal.x, goal.y), was = p.goal;
  if (p.shut.some((s) => s.map === at.mapId && s.x === at.x && s.y === at.y)) return null;
  if (was && MINE.has(was) && was.map === goal.map && was.x === goal.x && was.y === goal.y) return route(g, k, p);
  const kept = { goal: p.goal, trip: p.trip, plan: p.plan, why: p.why };
  MINE.add(goal);
  p.goal = goal; p.trip = null; p.plan = [];
  const key = route(g, k, p);
  if (!key) ({ goal: p.goal, trip: p.trip, plan: p.plan, why: p.why } = kept);
  return key;
}

/**
 * The first key towards the nearest of `group` it has a way to: on the map it stands on by the brain's
 * route, else on another by the fewest ways off between. Space on a business it stands on, to go in.
 */
function toNearest(g: Game, k: Known, p: Pilot, group: Spot[]): Action | null {
  if (!group.length) return null;
  const st = g.world.state, goal = (q: Spot): Goal => ({ map: q.map, x: q.f.x, y: q.f.y, name: named(q.f), why: `To ${named(q.f)}: ${q.why}` });
  // Bound for one already: on, without looking again.
  const was = p.goal && MINE.has(p.goal) ? p.goal : null, bound = was && group.find((q) => q.map === was.map && q.f.x === was.x && q.f.y === was.y);
  const on = bound && go(g, k, p, goal(bound));
  if (on) return on;
  const here = group.filter((q) => q.map === st.mapId), near = here.length ? nearestOn(k, st.mapId, st.x, st.y, st.facing, here.map((q) => q.f)) : null;
  const first = near ? here.find((q) => q.f.x === near.x && q.f.y === near.y) : undefined;
  if (first && !near?.keys.length) { p.why = [goal(first).why!]; return 'interact'; }
  const hops = new Map<string, number>(), far = (map: string): number => {
    if (!hops.has(map)) hops.set(map, routeMaps(k, st.mapId, map)?.length ?? Infinity);
    return hops.get(map)!;
  };
  const there = group.filter((q) => q.map !== st.mapId && far(q.map) < Infinity).sort((a, b) => far(a.map) - far(b.map));
  for (const q of first ? [first, ...there] : there) {
    const key = go(g, k, p, goal(q));
    if (key) return key;
  }
  return null;
}

/** On the street: what it carries taken up, rest where it stands, a well near, else the nearest place that meets the need. */
function street(g: Game, k: Known, p: Pilot): Action | null {
  const w = g.world, st = w.state, party = g.party;
  // A well stood on: whether the company stands there whole, as one that restores leaves it.
  if (k.features(st.mapId).some((f) => f.kind === 'well' && f.x === st.x && f.y === st.y)) p.wells.set(`${st.mapId}:${st.x},${st.y}`, !party.members.some((m) => !isDown(m) && m.hp < m.maxHp));
  const fit = party.members.find((c) => carried(party, c));
  if (fit) { p.why = [`Fitting out ${fit.name}.`]; return 'inventory'; }
  const n = need(g, k);
  // Rest where it stands: restRefused says what R would.
  if (n === 'rest' && !restRefused(w) && party.food >= party.members.length) { p.why = [`Resting: ${low(party)}`]; return 'rest'; }
  // A well near while any of the company is under half and no group is in sight; none that did nothing.
  const hurt = party.members.find((m) => !isDown(m) && m.hp < m.maxHp / 2);
  if (hurt && !k.groups(st.mapId).length) {
    const wells = k.features(st.mapId).filter((f) => f.kind === 'well' && !(f.x === st.x && f.y === st.y) && p.wells.get(`${st.mapId}:${f.x},${f.y}`) !== false);
    const near = wells.length ? nearestOn(k, st.mapId, st.x, st.y, st.facing, wells) : null;
    const key = near && near.keys.filter((a) => a === 'forward').length <= WELL_STEPS && go(g, k, p, { map: st.mapId, x: near.x, y: near.y, name: 'the well', why: `To the well: ${hurt.name} is under half.` });
    if (key) return key;
  }
  if (!n) return null;
  for (const group of spots(g, k, p, n)) {
    const key = toNearest(g, k, p, group);
    if (key) return key;
  }
  return null;
}

/** The key that moves a menu's choice down to line `i`, or Space on it. */
const pick = (top: { sel: number; options: string[] }, i: number): Action => (Math.min(top.sel, top.options.length - 1) === i ? 'interact' : 'down');

/** Whether a business's trade has something for the company now, so its first menu opens it rather than Leave. A shop or a trainer it has not seen the wares or levels of it looks in. */
function errand(g: Game, p: Pilot, map: string, f: Trade, n: Need | null): boolean {
  const party = g.party;
  switch (f.kind) {
    case 'inn': return (n === 'rest' && !short(g, p, map, f, 'rest')) || (hungry(party) && !short(g, p, map, f, 'food'));
    case 'temple': return party.members.some((c) => templePrice(c) > 0 && templePrice(c) <= party.gold);
    case 'shop': return !f.stock || !!basket(party, f);
    case 'trainer': return f.maxLevel === undefined || trainee(party, f.maxLevel) >= 0;
  }
}

/**
 * In a business of its own trade: the menu on top read by its labels. The first menu opens the trade
 * while it has something to do, else Leave. The inn: a room for rest, then rations while short; the
 * temple: each of the company it can pay for, the dead first, then the stoned, then the rest; the shop:
 * Buy, and never Sell, gear for each of the company and rations, then Esc; the trainer: each it can
 * pay for. Null in any other.
 */
function counter(g: Game, k: Known, p: Pilot, top: ChoiceScreen): Action | null {
  const room = g.screens.find((s): s is InteriorScreen => s instanceof InteriorScreen)!, st = g.world.state;
  const f = k.features(st.mapId).find((q): q is Trade => q.x === room.at.x && q.y === room.at.y && (q.kind === 'inn' || q.kind === 'temple' || q.kind === 'shop' || q.kind === 'trainer'));
  if (!f) return null;
  // In at the door, the trip there is over.
  if (p.goal && MINE.has(p.goal) && p.goal.map === st.mapId && p.goal.x === f.x && p.goal.y === f.y) { p.goal = null; p.trip = null; p.plan = []; }
  const party = g.party, opts = top.options, n = need(g, k), gold = spare(party), leave = opts.lastIndexOf('Leave');
  if (opts[0] === TRADE[f.kind] && leave === opts.length - 1) {
    if (!errand(g, p, st.mapId, f, n)) return pick(top, leave);
    p.why = [`In ${named(f)}.`];
    return pick(top, 0);
  }
  switch (f.kind) {
    case 'inn': {
      const stay = opts.findIndex((o) => o.startsWith('Stay the night')), buy = opts.findIndex((o) => o.startsWith('Buy 10 rations'));
      if (stay < 0 || buy < 0) return null;
      // What each costs, as its line says: the inn's prices are known only once inside.
      const cost = (i: number): number => Number(/\((\d+) gold\)/.exec(opts[i])?.[1] ?? Infinity), owed = (want: Need): void => void p.short.set(`${st.mapId}:${f.x},${f.y}:${want}`, party.gold);
      if (n === 'rest' && !short(g, p, st.mapId, f, 'rest')) {
        if (cost(stay) <= gold) { p.why = ['Taking a room.']; return pick(top, stay); }
        owed('rest');
      }
      if (hungry(party) && !short(g, p, st.mapId, f, 'food')) {
        if (cost(buy) <= gold) { p.why = ['Buying rations.']; return pick(top, buy); }
        owed('food');
      }
      return pick(top, leave);
    }
    case 'temple': {
      if (!opts.includes('Donate 10 gold')) return null;
      const worst = (c: Character): number => (hasCondition(c, 'dead') ? 0 : hasCondition(c, 'stoned') ? 1 : 2);
      const due = party.members.map((c, i) => ({ c, i })).filter(({ c }) => templePrice(c) > 0 && templePrice(c) <= party.gold).sort((a, b) => worst(a.c) - worst(b.c))[0];
      if (!due) return pick(top, leave);
      p.why = [`${hasCondition(due.c, 'dead') ? 'Raising' : 'Restoring'} ${due.c.name}.`];
      return pick(top, due.i);
    }
    case 'shop': {
      if (opts.join() === 'Buy,Sell,Leave') return pick(top, errand(g, p, st.mapId, f, n) ? 0 : leave);
      if (!top.words.startsWith('What will it be?')) return 'cancel';
      const want = basket(party, f);
      if (!want) return 'cancel';
      p.why = [want.who ? `Buying ${item(want.id).name} for ${want.who.name}.` : 'Buying rations.'];
      return pick(top, f.stock!.indexOf(want.id));
    }
    case 'trainer': {
      if (!top.words.startsWith(`"${f.name}. I train`)) return null;
      const i = trainee(party, f.maxLevel ?? 0);
      if (i < 0) return pick(top, leave);
      p.why = [`Training ${party.members[i].name}.`];
      return pick(top, i);
    }
  }
}

/** At the sheet: across to the first of the company who carries what betters what they wear, down to it and Space; Esc once none does. */
function sheet(g: Game, p: Pilot, top: SheetScreen): Action {
  const party = g.party, n = party.members.length, who = party.members.findIndex((c) => carried(party, c)), at = g.selected;
  if (who < 0) return 'cancel';
  if (at !== who) return (who - at + n) % n <= (at - who + n) % n ? 'right' : 'left';
  const c = party.members[who];
  p.why = [`Fitting out ${c.name}.`];
  return pick({ sel: top.sel, options: [...c.pack, ...party.bag] }, [...c.pack, ...party.bag].indexOf(carried(party, c)!));
}

/** The offer of rest it asked for with R: Rest while the harness's rule wants it, else Not now. Null for any other question. */
function restOffer(g: Game, top: ChoiceScreen): Action | null {
  if (top.options.join() !== 'Rest,Not now' || !top.words.startsWith('Rest for eight hours?')) return null;
  const why = mustRest(g.party);
  return pick(top, why === 'hp' || why === 'sp' ? 0 : 1);
}

/** The brain: the sheet, a business's menus and the offer of rest, and on the street what the company needs. */
export const keep: Brain = (g, k, p) => {
  const top = g.top;
  if (top instanceof SheetScreen) return sheet(g, p, top);
  if (top instanceof ChoiceScreen) return g.screens.some((s) => s instanceof InteriorScreen) ? counter(g, k, p, top) : restOffer(g, top);
  if (!(top instanceof ExploreScreen)) return null;
  const mine = p.goal && MINE.has(p.goal) ? p.goal : null, key = street(g, k, p);
  // A goal of its own it no longer wants it lets go, so another brain may make one.
  if (!key && mine && p.goal === mine) { p.goal = null; p.trip = null; p.plan = []; }
  return key;
};
