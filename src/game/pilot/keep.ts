// The quartermaster (#719; docs/PILOT.md): keeps the company fit to fight, on screen. It rests where
// it stands by the harness's rule (`mustRest`), else goes where a need is met, the most urgent first:
// a temple for the dead and the stone, a camp or an inn for the tired, an inn or a shop for the
// hungry, a trainer for those ready and a shop for the best each can wear over the company's reserve,
// worn through the sheet. It reads the world through Known and a menu by its rows as they show
// (`ChoiceScreen.options`), and presses the keys a player would: a goal is the navigator's to walk
// (route.ts), a row is reached by `down` and taken by Space, and nothing is bought off screen.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import type { Feature } from '../map.ts';
import type { Character, Party } from '../party.ts';
import { armorClass, canTrain, canTrainAt, hasCondition, isDown, PRESTIGES, templePrice, trainPrice, weaponOf } from '../party.ts';
import { hits, item, priceIn } from '../items.ts';
import { mustRest, REST_AT } from '../bot.ts';
import { restRefused } from '../wilds.ts';
import { ChoiceScreen, InteriorScreen, SheetScreen, SpellScreen, TRADE } from '../../ui/screens.ts';
import { spell } from '../spells.ts';
import { optionParts } from '../../ui/draw.ts';
import { knownOf, trainsTo, wares } from './known.ts';
import type { Known } from './known.ts';
import { routeLengths, routeMaps } from './route.ts';
import type { Goal } from './route.ts';
import type { Brain, Pilot } from './pilot.ts';
import { reserve, spare } from './purse.ts';

export { reserve, spare };

/** What the company may need, the most urgent first. */
export type Need = 'temple' | 'rest' | 'food' | 'train' | 'gear';
/** The order the quartermaster's aims give way in: the needs, the most urgent first, then a well near. */
const URGENCY: readonly (Need | 'well')[] = ['temple', 'rest', 'food', 'train', 'gear', 'well'];
type Shop = Extract<Feature, { kind: 'shop' }>;
/** The businesses the quartermaster answers in: a guild's spell hall is talk's (#721), as are a guild's work and the people in any. */
type Business = Extract<Feature, { kind: 'inn' | 'temple' | 'shop' | 'trainer' }>;

/** The keys of route a well may be off for the company to go and drink. */
const WELL_KEYS = 6;
/** What ten rations cost at an inn, as its menu says ("Buy 10 rations (20 gold)"). */
const INN_RATIONS = 20;
/** A feature on another map counts this many keys for each map between, so that one on this map comes first. */
const FAR = 1e6;
/** The members the sheet goes round with `left` and `right`. */
const SHEET_ROUND = 6;

const fallen = (c: Character): boolean => hasCondition(c, 'dead') || hasCondition(c, 'stoned');
const hungry = (p: Party): boolean => p.food < 2 * p.members.length;
/** Standing and under half its hit points: whom a well is for. */
const low = (c: Character): boolean => !isDown(c) && c.hp < c.maxHp / 2;
/** Why those standing must rest, or null: the rest rule (`mustRest`) over the company, the dead and the stone left out. */
function tired(p: Party): 'hp' | 'sp' | null {
  const up = p.members.filter((c) => !fallen(c)), why = up.length ? mustRest({ ...p, members: up }) : null;
  return why === 'dead' ? null : why;
}

/** Under this share of their hit points, one standing makes the pilot rest where it stands (#723), where the harness's rule waits for a quarter (`REST_AT`). */
export const REST_HP = 0.75;
/** Under this share of their spell points, a caster makes the pilot rest where it stands (#723), where the harness's rule pools the company's. */
export const REST_SP = 0.5;
/** A member whose spells are its fight: a calling of 'caster' (a cleric, a sorcerer, a druid), as the prestiges have it. */
export const caster = (c: Character): boolean => PRESTIGES[c.cls].calling === 'caster' && c.maxSp > 0;
/**
 * The member the pilot's own rest rule (#723) rests for, and why: one standing under REST_HP of its hit
 * points, else a caster under REST_SP of its spell points; by member, where the harness's rule pools the
 * spell points. It rests where it stands, or takes the room at an inn's door, and goes nowhere for it.
 */
export function weary(p: Party): { c: Character; why: 'hp' | 'sp' } | undefined {
  const up = p.members.filter((c) => !fallen(c));
  const hurt = up.filter((c) => c.hp < c.maxHp * REST_HP).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
  if (hurt) return { c: hurt, why: 'hp' };
  const dry = up.find((c) => caster(c) && c.sp < c.maxSp * REST_SP);
  return dry ? { c: dry, why: 'sp' } : undefined;
}
/** Under this share of their hit points, one not dead is mended between fights by a spell, where a member has it and the spell points (#723). */
export const MEND_AT = 0.7;
/** A mending spell to cast off the fight: who casts it, its row in their list off the fight, and on whom (a member's row; -1 for the whole company). */
export interface Mend { who: number; spell: string; row: number; target: number }
/**
 * The mending to cast now, or undefined: the one not dead or stone with the least share of their hit
 * points, under MEND_AT, mended by the member standing and awake with the most spell points who has a
 * mending spell off the fight and the points for it, one for a member before one for the company (#723).
 */
export function mendable(p: Party): Mend | undefined {
  const target = p.members.map((c, i) => ({ c, i })).filter(({ c }) => !fallen(c) && c.hp < c.maxHp * MEND_AT).sort((a, b) => a.c.hp / a.c.maxHp - b.c.hp / b.c.maxHp)[0];
  if (!target) return undefined;
  let best: Mend | undefined, most = -1;
  for (const [who, c] of p.members.entries()) {
    if (isDown(c) || hasCondition(c, 'asleep') || c.sp <= most) continue;
    const list = c.spells.filter((s) => spell(s).context !== 'combat');
    const heals = list.filter((s) => { const d = spell(s); return !!d.heal && !d.raise && d.sp <= c.sp && (d.target === 'ally' || d.target === 'party'); });
    const id = heals.find((s) => spell(s).target === 'ally') ?? heals[0];
    if (id) { best = { who, spell: id, row: list.indexOf(id), target: spell(id).target === 'ally' ? target.i : -1 }; most = c.sp; }
  }
  return best;
}
/** Whether those standing want a rest: the harness's rule (`tired`) or the pilot's own (`weary`). */
const restless = (p: Party): boolean => !!tired(p) || !!weary(p);
/** Whether the rest offered is taken (the rest key's, a camp's): those standing want rest, and there is a ration each. Talk's rule 2 is this one (#721). */
export const restWanted = (p: Party): boolean => restless(p) && p.food >= p.members.length;
/** The first member ready to train whom the company can pay for (`canTrain`, `trainPrice`). */
const ready = (p: Party): Character | undefined => p.members.find((c) => canTrain(c) && !isDown(c) && p.gold >= trainPrice(c));
/** The first of the dead, then of the stone, whom the company can pay a temple to raise (`templePrice`). */
const raise = (p: Party): Character | undefined =>
  [...p.members.filter((c) => hasCondition(c, 'dead')), ...p.members.filter((c) => hasCondition(c, 'stoned'))].find((c) => templePrice(c) <= p.gold);

/**
 * The best item in `stock` for `c` that `gold` buys at `shop`'s prices: by the mean blow (`hits`) for
 * a weapon of the kind it holds (ranged or not, and not two-handed with a shield on), by the armour
 * class it gives (`armorClass`) for armour or a shield, the larger gain first, then the cheaper.
 * `gold` is what the company may spend on it, its gold over the reserve (`spare`). Undefined when
 * nothing within the gold betters what it wears.
 */
export function better(c: Character, stock: readonly string[], shop: Shop, gold: number): string | undefined {
  const held = weaponOf(c), ac = armorClass(c);
  let best: string | undefined, most = 0, cost = Infinity;
  for (const id of stock) {
    const d = item(id), price = priceIn(shop, id);
    if (price > gold || d.slot === 'none' || (d.classes && !d.classes.includes(c.cls))) continue;
    if (d.slot === 'weapon' ? !!d.ranged !== !!held.ranged || (!!d.twoHanded && !!c.equipment.shield) : d.slot === 'shield' && !!held.twoHanded) continue;
    const gain = d.slot === 'weapon' ? hits(d) - hits(held) : armorClass({ ...c, equipment: { ...c.equipment, [d.slot]: id } }) - ac;
    if (gain > most || (gain === most && gain > 0 && price < cost)) { best = id; most = gain; cost = price; }
  }
  return best;
}

/**
 * Every need the company has now, the most urgent first: 'temple' with one of it dead or stone,
 * 'rest' when the rest rule trips over those standing, 'food' under two rations a head, 'train' with
 * one ready whom it can pay for, 'gear' with a shop seen worth going to (`shops`).
 */
export function needs(g: Game, k: Known = knownOf(g)): Need[] {
  const p = k.party, out: Need[] = [];
  if (mustRest(p) === 'dead') out.push('temple');
  if (restless(p)) out.push('rest');
  if (hungry(p)) out.push('food');
  if (ready(p)) out.push('train');
  if (shops(k).length) out.push('gear');
  return out;
}

/** What the company needs, in order of urgency, or null. */
export function need(g: Game, k?: Known): Need | null {
  return needs(g, k)[0] ?? null;
}

/** A feature where a need is met, its map as played and what the why line says it is for. */
interface Spot { map: string; f: Feature; reason: string }
const spotKey = (s: Spot): string => `${s.map}:${s.f.x},${s.f.y}`;

/** The features Known gives on the maps walked that `ok` holds for, each with its map and `reason`. */
function seen(k: Known, ok: (f: Feature) => boolean, reason: string): Spot[] {
  return k.visited().flatMap((map) => k.features(map).filter(ok).map((f) => ({ map, f, reason })));
}

/**
 * The shops seen worth going to for gear: one whose wares its menu has shown hold something better
 * for one standing that the gold over the reserve buys (`better`), or one not looked in yet while the
 * gold over the reserve is as much again as the reserve, to look.
 */
function shops(k: Known): Spot[] {
  const p = k.party, cash = spare(p);
  return seen(k, (f) => f.kind === 'shop', '').flatMap((s): Spot[] => {
    const f = s.f as Shop;
    if (!f.stock.length) return cash >= reserve(p) ? [{ ...s, reason: 'a look at the stock' }] : [];
    for (const c of p.members) {
      const id = fallen(c) ? undefined : better(c, f.stock, f, cash);
      if (id) return [{ ...s, reason: `${item(id).name} for ${c.name}` }];
    }
    return [];
  });
}

/** Where `n` is met, in groups in the order tried (a camp before an inn), each spot with its reason. */
function spots(k: Known, n: Need): Spot[][] {
  const p = k.party;
  switch (n) {
    case 'temple': {
      const c = raise(p);
      return c ? [seen(k, (f) => f.kind === 'temple', `${c.name} is ${hasCondition(c, 'dead') ? 'dead' : 'stone'}`)] : [];
    }
    case 'rest': return [p.food >= p.members.length ? seen(k, (f) => f.kind === 'camp', "a night's rest") : [], seen(k, (f) => f.kind === 'inn', "a night's rest")];
    case 'food': return [seen(k, (f) => (f.kind === 'inn' && p.gold >= INN_RATIONS) || (f.kind === 'shop' && f.stock.includes('rations') && p.gold >= priceIn(f, 'rations')), 'rations')];
    case 'train': {
      const c = ready(p), can = (top: number): boolean => p.members.some((m) => canTrainAt(m, top) && !isDown(m) && p.gold >= trainPrice(m));
      return c ? [seen(k, (f) => f.kind === 'trainer' && (Number.isNaN(f.maxLevel) || can(f.maxLevel)), `${c.name} is ready to train`)] : [];
    }
    case 'gear': return [shops(k)];
  }
}

/**
 * The nearest of `list` by the navigator's route, and its length in keys: on this map by
 * `routeLengths` (one search for all), on another by the maps between (`routeMaps`), `FAR` keys each.
 * Undefined when the route reaches none.
 */
function nearest(g: Game, k: Known, list: readonly Spot[]): { s: Spot; d: number } | undefined {
  const st = g.world.state;
  let here: Map<string, number> | undefined, best: { s: Spot; d: number } | undefined;
  for (const s of list) {
    const hops = s.map === st.mapId ? undefined : routeMaps(k, st.mapId, s.map);
    const d = s.map === st.mapId ? (here ??= routeLengths(k, st.mapId, st.x, st.y, st.facing)).get(`${s.f.x},${s.f.y}`) : hops ? FAR * hops.length : undefined;
    if (d !== undefined && (!best || d < best.d)) best = { s, d };
  }
  return best;
}

/** A goal the quartermaster set, or a business it went into where it stood (`goal` undefined), for a need, with the gold then. */
interface Aim { need: Need | 'well'; key: string; goal: Goal | undefined; gold: number }
interface Keep {
  aim?: Aim;
  /** Where a need was gone to and nothing came of it, by 'need|map:x,y', with the gold then: not again for that need until the gold moves or the need goes. */
  tried: Map<string, number>;
  /** The wells drunk from that left one standing under half: none restores. */
  dry: Set<string>;
  /** What was bought and for whom, to be worn through the sheet. */
  bought: { who: number; id: string }[];
  /** The mending being cast through the spell menu (#723), from the cast key to the member's row. */
  mend?: Mend;
}
/** What the spell menu has been pressed so far, by the menu: the caster chosen, and the rows gone down. */
const BOOKS = new WeakMap<SpellScreen, { chosen: boolean; downs: number }>();
/** Each company's: a new game's or a load's starts afresh. */
const KEEPS = new WeakMap<Party, Keep>();
function memo(p: Party): Keep {
  let m = KEEPS.get(p);
  if (!m) KEEPS.set(p, (m = { tried: new Map(), dry: new Set(), bought: [] }));
  return m;
}
/** One visit's: the gold its trade was last opened at, whether the Buy list was seen and whom it bought for (one thing each). */
interface Visit { traded?: number; looked: boolean; served: Set<number> }
const VISITS = new WeakMap<InteriorScreen, Visit>();

/**
 * The brain. On the map it rests, goes into a business it stands at, opens the sheet to wear what it
 * bought, or sets the navigator's goal and leaves the key to it; in a business it answers the menus;
 * on the sheet it wears what it bought. On any other screen, nothing.
 */
export const keep: Brain = (g, k, p) => {
  const top = g.top, mem = memo(k.party);
  if (top instanceof SheetScreen) return wear(g, k, p, top, mem);
  if (top instanceof SpellScreen) return spellbook(top, mem);
  if (top instanceof ChoiceScreen) return answer(g, k, p, top, mem);
  return top instanceof ExploreScreen ? onMap(g, k, p, mem) : null;
};

function onMap(g: Game, k: Known, p: Pilot, mem: Keep): Action | null {
  const party = k.party, list = needs(g, k);
  if (mem.aim && p.goal !== mem.aim.goal) settle(mem, party);
  for (const [key, gold] of mem.tried) if (gold !== party.gold || !list.some((n) => key.startsWith(`${n}|`))) mem.tried.delete(key);
  mem.bought = mem.bought.filter((b) => !!party.members[b.who] && party.bag.includes(b.id));
  if (mem.bought.length) {
    p.why = [`${party.members[mem.bought[0].who].name} takes the ${item(mem.bought[0].id).name}.`];
    return 'inventory';
  }
  // Between fights, one hurt is mended by a spell before any walk (#723), the cast key and then the
  // menus; but where the harness's rule wants rest and a rest or a room can be had here, it rests first.
  const here = (f: Feature): boolean => f.kind === 'inn' && f.x === g.world.state.x && f.y === g.world.state.y;
  const restNow = !!tired(party) && ((restRefused(g.world) === '' && party.food >= party.members.length) || k.features(g.world.state.mapId).some(here));
  const mend = restNow ? undefined : mendable(party);
  if (mend) {
    mem.mend = mend;
    p.why = [mend.target < 0 ? 'Mending the company.' : `Mending ${party.members[mend.target].name}.`];
    return 'cast';
  }
  const plan = choose(g, k, mem, list), own = mem.aim?.goal !== undefined && p.goal === mem.aim.goal;
  // A goal of its own holds while its need does, unless a rest where it stands or a more urgent need
  // can be met now: a place of the same need found nearer on the way does not turn it.
  const holds = own && (mem.aim!.need === 'well' ? party.members.some(low) : list.includes(mem.aim!.need));
  if (holds && (!plan || (!('rest' in plan) && URGENCY.indexOf(plan.need) >= URGENCY.indexOf(mem.aim!.need)))) return null;
  if (!plan || 'rest' in plan) {
    if (own) p.goal = null;
    mem.aim = undefined;
    if (plan) { p.why = [plan.rest]; return 'rest'; }
    // Needs it can meet none of: the band says the most urgent, and why not.
    const want = wanting(k, list);
    if (want) p.why = [want];
    return null;
  }
  const key = spotKey(plan.s), name = place(plan.s.f);
  if (own) p.goal = null;
  p.why = [`To ${name}: ${plan.s.reason}.`];
  // Standing at the business already, it goes in; else the navigator walks there.
  const goal: Goal | undefined = plan.d === 0 ? undefined : { map: plan.s.map, x: plan.s.f.x, y: plan.s.f.y, name, reason: plan.s.reason };
  mem.aim = { need: plan.need, key, goal, gold: party.gold };
  if (!goal) return 'interact';
  p.goal = goal;
  return null;
}

/** An aim is over (reached, dropped by the navigator, or its visit closed): a well that left one standing under half is dry; a place that took no gold is tried for its need. */
function settle(mem: Keep, p: Party): void {
  const a = mem.aim!;
  mem.aim = undefined;
  if (a.need === 'well') { if (p.members.some(low)) mem.dry.add(a.key); }
  else if (p.gold === a.gold) mem.tried.set(`${a.need}|${a.key}`, p.gold);
}

type Plan = { rest: string } | { need: Need | 'well'; s: Spot; d: number };

/**
 * What to do now, in the issue's order: for each need in turn the first it can meet (for rest, the
 * inn it stands at, else a rest where it stands, with no group too near (`restRefused`) and a ration
 * each, else the nearest camp (with the rations), else inn; for any other, the nearest place that
 * meets it and has not been tried for it); else a well within `WELL_KEYS`. Undefined when none.
 */
function choose(g: Game, k: Known, mem: Keep, list: readonly Need[]): Plan | undefined {
  const p = k.party, st = g.world.state, here = (s: Spot): boolean => s.map === st.mapId && s.f.x === st.x && s.f.y === st.y;
  for (const n of list) {
    const free = (s: Spot): boolean => !mem.tried.has(`${n}|${spotKey(s)}`), groups = spots(k, n);
    if (n === 'rest') {
      const door = groups[1].find((s) => here(s) && free(s));
      if (door) return { need: n, s: door, d: 0 };
      if (restRefused(g.world) === '' && p.food >= p.members.length) {
        const who = p.members.find((c) => !fallen(c) && c.hp < c.maxHp * REST_AT), w = weary(p);
        if (tired(p)) return { rest: tired(p) === 'hp' && who ? `Resting: ${who.name} is under a quarter.` : 'Resting: the spell points are low.' };
        return { rest: w!.why === 'hp' ? `Resting: ${w!.c.name} is hurt.` : `Resting: ${w!.c.name} is short of spells.` };
      }
      // Wanted by the pilot's own rule alone: a rest where it stands or none, and no walk for it (#723).
      if (!tired(p)) continue;
    }
    for (const group of groups) {
      const best = nearest(g, k, group.filter((s) => free(s) && !(here(s) && s.f.kind === 'camp')));
      if (best) return { need: n, ...best };
    }
  }
  const well = drink(g, k, mem);
  return well ? { need: 'well', ...well } : undefined;
}

/**
 * The band's line when the company has needs and can meet none of them: the most urgent, and why
 * not, in the game's voice ("Hurt, and no gold for a room."). Undefined when gear is the only want.
 */
function wanting(k: Known, list: readonly Need[]): string | undefined {
  const p = k.party, any = (ok: (f: Feature) => boolean): boolean => seen(k, ok, '').length > 0;
  for (const n of list) {
    switch (n) {
      case 'temple': {
        const c = p.members.find((m) => hasCondition(m, 'dead')) ?? p.members.find(fallen)!;
        return `${c.name} is ${hasCondition(c, 'dead') ? 'dead' : 'stone'}, and ${raise(p) ? 'no temple seen' : 'no gold for the temple'}.`;
      }
      case 'rest': {
        const hurt = (tired(p) ?? weary(p)?.why) === 'hp' ? 'Hurt' : 'Low on spell points';
        if (p.food >= p.members.length) return `${hurt}, and too dangerous to rest here.`;
        return `${hurt}, and ${any((f) => f.kind === 'inn') ? 'no gold for a room' : 'no rations and no inn seen'}.`;
      }
      case 'food': return `Short of rations, and ${any((f) => f.kind === 'inn' || (f.kind === 'shop' && f.stock.includes('rations'))) ? 'no gold for them' : 'none seen for sale'}.`;
      case 'train': return `${ready(p)!.name} is ready to train, and no trainer seen to teach them.`;
      case 'gear': break;
    }
  }
  return undefined;
}

/** A seen well on this map within `WELL_KEYS` of route and not found dry, while one standing is under half and the automap marks no group near. */
function drink(g: Game, k: Known, mem: Keep): { s: Spot; d: number } | undefined {
  const p = k.party, st = g.world.state;
  if (!p.members.some(low) || k.groups(st.mapId).length) return undefined;
  // A route is no shorter than the squares between, so a well farther than WELL_KEYS is not searched for.
  const wells = k.features(st.mapId).filter((f) => f.kind === 'well' && !(f.x === st.x && f.y === st.y) && Math.abs(f.x - st.x) + Math.abs(f.y - st.y) <= WELL_KEYS)
    .map((f) => ({ map: st.mapId, f, reason: 'a drink' })).filter((s) => !mem.dry.has(spotKey(s)));
  const best = wells.length ? nearest(g, k, wells) : undefined;
  return best && best.d <= WELL_KEYS ? best : undefined;
}

/**
 * In a business of its own (an inn, a temple, a shop or a trainer: the visit's square in Known), its
 * menus; and the rest offered (the rest key's or a camp's) wherever it is. Any other menu is not its.
 */
function answer(g: Game, k: Known, p: Pilot, c: ChoiceScreen, mem: Keep): Action | null {
  const party = k.party, rows = c.options;
  if (rows.join() === 'Rest,Not now') return pick(c, restWanted(party) ? 'Rest' : 'Not now');
  // The member a mending is cast on (#723): the spell menu's "on whom?", a row a member.
  if (mem.mend && rows.length === party.members.length && rows.every((r, i) => r.startsWith(`${i + 1}. ${party.members[i].name}  `))) {
    const a = go(c, mem.mend.target);
    if (a === 'interact') mem.mend = undefined;
    return a;
  }
  const visit = g.screens.find((s): s is InteriorScreen => s instanceof InteriorScreen);
  if (!visit) return null;
  const { x, y } = visit.at, f = k.features(g.world.state.mapId).find((q): q is Business => q.x === x && q.y === y && (q.kind === 'inn' || q.kind === 'temple' || q.kind === 'shop' || q.kind === 'trainer'));
  if (!f) return null;
  let v = VISITS.get(visit);
  if (!v) VISITS.set(visit, (v = { looked: false, served: new Set() }));
  // The business's first menu: its trade while there is something to do there and the last opening
  // spent something (so a trade that can do nothing is not opened twice), else Leave; but a guild's
  // work and the people in the room are talk's, where the pilot asks it, which leaves once done (#721).
  if (rows.at(-1) === 'Leave' && rows.includes(TRADE[f.kind])) {
    if (v.traded === party.gold || !wants(f, party, v)) return p.talks && rows.some((r) => r.startsWith('Work for ') || r.startsWith('Talk to ')) ? null : pick(c, 'Leave');
    const a = pick(c, TRADE[f.kind]);
    if (a === 'interact') v.traded = party.gold;
    return a;
  }
  switch (f.kind) {
    case 'inn': return inn(c, party, p);
    case 'temple': return temple(c, party, p);
    case 'shop': return shop(c, party, p, f, v, mem);
    case 'trainer': return trainer(c, party, p);
  }
}

/** Whether the company has something to do at `f` now: a night or rations at an inn, a fee it can pay at a temple, one look at a shop's wares a visit, one ready to train at a trainer. */
function wants(f: Business, p: Party, v: Visit): boolean {
  switch (f.kind) {
    case 'inn': return restless(p) || hungry(p);
    case 'temple': return p.members.some((c) => templePrice(c) > 0 && templePrice(c) <= p.gold);
    case 'shop': return !v.looked;
    case 'trainer': return !!ready(p);
  }
}

/** The gold a row asks, as "(72 gold)", or Infinity. */
const asks = (row: string): number => Number(/\((\d+) gold\)/.exec(row)?.[1] ?? Infinity);

/** An inn: the night while those standing need rest, then ten rations while under two a head, each while the gold holds; then Leave. */
function inn(c: ChoiceScreen, p: Party, pilot: Pilot): Action | null {
  const stay = c.options.findIndex((o) => o.startsWith('Stay the night')), buy = c.options.findIndex((o) => o.startsWith('Buy 10 rations'));
  if (stay < 0 || buy < 0) return null;
  if (restless(p) && p.gold >= asks(c.options[stay])) { pilot.why = ['A room for the night.']; return go(c, stay); }
  if (hungry(p) && p.gold >= asks(c.options[buy])) { pilot.why = ['Rations for the road.']; return go(c, buy); }
  return pick(c, 'Leave');
}

/** A temple: the row of each member it can pay for (one with a fee shown), the dead first, then the stone, then the rest; then Leave. */
function temple(c: ChoiceScreen, p: Party, pilot: Pilot): Action | null {
  const rows = c.options;
  if (rows.at(-2) !== 'Donate 10 gold') return null;
  let best = -1, worst = 3;
  rows.slice(0, -2).forEach((row, i) => {
    const { label, value } = optionParts(row), fee = /^(\d+)g$/.exec(value), ails = label.slice(label.indexOf(': ') + 2);
    const rank = /\bdead\b/.test(ails) ? 0 : /\bstoned\b/.test(ails) ? 1 : 2;
    if (fee && Number(fee[1]) <= p.gold && rank < worst) { best = i; worst = rank; }
  });
  if (best < 0) return pick(c, 'Leave');
  const { label } = optionParts(rows[best]);
  pilot.why = [`${['Raising', 'Restoring', 'Healing'][worst]} ${label.slice(0, label.indexOf(':'))}.`];
  return go(c, best);
}

/**
 * A shop: Buy, once a visit; in the Buy list, rations while under two a head, then for each member
 * standing the best it can wear over the reserve (`better`, one thing each a visit), noted to be worn;
 * then Esc. Nothing is sold: the pack is kept.
 */
function shop(c: ChoiceScreen, p: Party, pilot: Pilot, f: Shop, v: Visit, mem: Keep): Action | null {
  if (c.options.join() === 'Buy,Sell,Leave') return pick(c, v.looked ? 'Leave' : 'Buy');
  const ws = wares(c);
  if (!ws) return c.options.at(-1) === 'Done' ? 'cancel' : null;
  v.looked = true;
  if (hungry(p)) {
    const r = ws.findIndex((w) => w.id === 'rations' && w.price <= p.gold);
    if (r >= 0) { pilot.why = ['Rations for the road.']; return go(c, r); }
  }
  const stock = ws.map((w) => w.id), cash = spare(p);
  for (const [i, m] of p.members.entries()) {
    const id = v.served.has(i) || fallen(m) ? undefined : better(m, stock, f, cash);
    if (!id) continue;
    const a = go(c, stock.indexOf(id));
    if (a === 'interact') { v.served.add(i); mem.bought.push({ who: i, id }); }
    pilot.why = [`${item(id).name} for ${m.name}.`];
    return a;
  }
  return 'cancel';
}

/** A trainer: each row that offers training (one ready, the trainer's level above theirs) while the gold holds; then Leave. */
function trainer(c: ChoiceScreen, p: Party, pilot: Pilot): Action | null {
  if (trainsTo(c) === undefined) return null;
  const r = c.options.slice(0, -1).findIndex((o) => { const fee = /^train (\d+)g$/.exec(optionParts(o).value); return !!fee && Number(fee[1]) <= p.gold; });
  if (r < 0) return pick(c, 'Leave');
  pilot.why = [`${p.members[r].name} trains.`];
  return go(c, r);
}

/**
 * On the sheet, what was bought is worn: `right` or `left` to its member (the sheet goes round),
 * `down` to it (the pack listed first, then the bag), Space to wear it; Esc once all is worn.
 */
function wear(g: Game, k: Known, p: Pilot, s: SheetScreen, mem: Keep): Action {
  const party = k.party;
  for (let b = mem.bought[0]; b; b = mem.bought[0]) {
    const c = party.members[b.who], at = party.bag.indexOf(b.id);
    if (!c || at < 0) { mem.bought.shift(); continue; }
    p.why = [`${c.name} takes the ${item(b.id).name}.`];
    if (g.selected !== b.who) return (b.who - g.selected + SHEET_ROUND) % SHEET_ROUND <= SHEET_ROUND / 2 ? 'right' : 'left';
    if (s.sel !== c.pack.length + at) return 'down';
    mem.bought.shift();
    return 'interact';
  }
  return 'cancel';
}

/**
 * The spell menu, for a mending (#723): the caster by their number, `down` to the spell's row, Space;
 * a spell for one member then asks on whom (`answer`). Esc on a spell menu not its own.
 */
function spellbook(s: SpellScreen, mem: Keep): Action {
  const m = mem.mend;
  if (!m) return 'cancel';
  let b = BOOKS.get(s);
  if (!b) BOOKS.set(s, (b = { chosen: false, downs: 0 }));
  if (!b.chosen) { b.chosen = true; return `n${m.who + 1}` as Action; }
  if (b.downs < m.row) { b.downs++; return 'down'; }
  if (m.target < 0) mem.mend = undefined;
  return 'interact';
}

/** The key toward row `i`: Space when it is the row chosen, else down (a menu wraps, so down reaches any row). */
const go = (c: ChoiceScreen, i: number): Action => (Math.min(c.sel, c.options.length - 1) === i ? 'interact' : 'down');
/** The key toward the row labelled `label`, or null when the menu has none. */
function pick(c: ChoiceScreen, label: string): Action | null {
  const i = c.options.findIndex((o) => optionParts(o).label === label);
  return i < 0 ? null : go(c, i);
}

/** A feature as the why line names it: "the Hearthlight Inn", "Mottram's Stores", "the well". */
function place(f: Feature): string {
  const name = ('name' in f && f.name) || f.kind;
  return /^the /i.test(name) ? `the ${name.slice(4)}` : /^\S+'s /.test(name) ? name : `the ${name}`;
}
