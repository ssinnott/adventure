// The combat test harness (docs/MONSTERS.md §4.4): a company of a given level fights encounters in a
// row from a fresh start, once per seed, and the harness says how many it managed before it had to
// rest. The yardstick is the design's: six or seven standard encounters at the company's own level
// between rests, where a company must rest once it has lost someone, once anyone is still under a
// quarter of their hit points after mending, or once it is under a quarter of its spell points.
//   node tools/harness.ts                              each role's standard encounter, at every level made
//   node tools/harness.ts --roles soldier,brute --levels 2,6,10 --seeds 400
//   node tools/harness.ts --under 2                    the company two levels under the monsters
//   node tools/harness.ts --map thornmark --level 5    a map's own groups, against a company of 5
//   node tools/harness.ts --stats                      the test monsters' stat lines, as markdown
//   node tools/harness.ts --calibrate [--write]        re-derive HP and DAMAGE in tools/testmonster.ts
// The company is the premade six, trained to the level (past today's cap if asked) and dressed in what
// the item tables give it by then (GEAR). A thrifty bot plays it (see `thrifty`), where tools/gate.ts's
// bot spends: it mends whoever is in danger, strikes, and casts a damage spell only when the hit points
// the spell saves outweigh its spell points, each weighed by what the company has left of that pool.
// It never blesses, sleeps, cures, drinks or flees. Between fights it mends as a player would. The
// report and the calibration run on every core.
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import { makeRng } from '../src/lib/engine/rng.ts';
import type { RngInstance } from '../src/lib/engine/rng.ts';
import { defaultParty, xpForLevel, levelUp, isDown, hasCondition, heal, equip, weaponOf, attackBonus, armorClass, bonus, hasTrait, spellHeal, SPELLFIRE_DMG, MAX_LEVEL } from '../src/game/party.ts';
import type { Character, Party } from '../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, castOnAlly, toHit, buffHit, traitDamage, FRONT_ROW } from '../src/game/combat.ts';
import type { CombatState, MonsterInst, PartyAction } from '../src/game/combat.ts';
import { spell } from '../src/game/spells.ts';
import type { SpellDef } from '../src/game/spells.ts';
import { item } from '../src/game/items.ts';
import type { ItemDef } from '../src/game/items.ts';
import type { MonsterDef } from '../src/game/monsters.ts';
import { MAP_DEFS } from '../src/content/maps/index.ts';
import { ROLES, ROLE_IDS, LEVELS, HP, DAMAGE, line, standardEncounter, testMonster } from './testmonster.ts';
import type { Role } from './testmonster.ts';

/** How many standard encounters at its own level a company should manage between rests: six or seven. */
export const FIGHTS = 6.5;
/**
 * A company must rest once anyone in it is under this share of their hit points after mending, or it
 * is under this share of its spell points.
 */
export const REST_AT = 0.25;
/** How far the harness will train a company: the road's cap, past today's MAX_LEVEL. */
export const CAP = 32;

/**
 * What the item tables put in a company's hands by a level: its kit, then the Shelf's mid-tier (the
 * Greywater chests and Harrow's shop) from 4, then Thornmark's armoury from 8, where plate is dear.
 * Each member takes the best its class can use of the kind it already carries, which flatters the
 * company a little. The curve's gear (EXPANSION.md §5.2) replaces this when it exists.
 */
export const GEAR: readonly (readonly [number, readonly string[]])[] = [
  [4, ['longsword', 'axe', 'longbow', 'shield', 'scale', 'chain']],
  [8, ['warhammer', 'battleaxe', 'greatsword', 'crossbow', 'elfbow', 'rune_dagger', 'grove_staff', 'runed_robe', 'brigandine', 'plate', 'tower_shield']],
];

const hits = (d: ItemDef): number => ((d.dice ?? 1) * ((d.sides ?? 4) + 1)) / 2 + (d.bonus ?? 0);

function outfit(c: Character, level: number): void {
  const pool = GEAR.filter(([at]) => at <= level).flatMap(([, ids]) => ids).map(item).filter((d) => !d.classes || d.classes.includes(c.cls));
  const w = weaponOf(c), shielded = !!c.equipment.shield;
  const weapon = pool.filter((d) => d.slot === 'weapon' && !!d.ranged === !!w.ranged && !(shielded && d.twoHanded) && hits(d) > hits(w)).sort((a, b) => hits(b) - hits(a))[0];
  if (weapon) equip(c, weapon.id);
  const worn = c.equipment.armor ? item(c.equipment.armor).ac ?? 0 : 0;
  const armour = pool.filter((d) => d.slot === 'armor' && (d.ac ?? 0) > worn).sort((a, b) => (b.ac ?? 0) - (a.ac ?? 0))[0];
  if (armour) equip(c, armour.id);
  if (shielded) {
    const held = item(c.equipment.shield!).ac ?? 0;
    const shield = pool.filter((d) => d.slot === 'shield' && (d.ac ?? 0) > held).sort((a, b) => (b.ac ?? 0) - (a.ac ?? 0))[0];
    if (shield) equip(c, shield.id);
  }
}

const companies = new Map<string, Party>();
/** The premade six trained to `level` and outfitted for it, whole; a fresh copy every call. */
export function companyAt(level: number, seed: number): Party {
  const key = `${level}:${seed}`;
  let p = companies.get(key);
  if (!p) {
    const rng = makeRng(seed);
    p = defaultParty(rng);
    for (const c of p.members) { c.xp = xpForLevel(level); levelUp(c, rng, CAP); outfit(c, level); c.hp = c.maxHp; c.sp = c.maxSp; }
    companies.set(key, p);
  }
  return structuredClone(p);
}

/** What a company has left of its hit points (a fallen member's counting none) and spell points, and what it has whole. */
export function pools(p: Party): { hp: number; maxHp: number; sp: number; maxSp: number } {
  const t = { hp: 0, maxHp: 0, sp: 0, maxSp: 0 };
  for (const c of p.members) { t.maxHp += c.maxHp; t.maxSp += c.maxSp; t.sp += c.sp; if (!isDown(c)) t.hp += Math.min(c.maxHp, c.hp); }
  return t;
}

const spellDamage = (c: Character, sp: SpellDef): number =>
  ((sp.dice ?? 1) * (sp.perLevel ? Math.max(1, Math.ceil(c.level / 2)) : 1) * ((sp.sides ?? 4) + 1)) / 2 + (hasTrait(c, 'spellfire') ? SPELLFIRE_DMG : 0);

/** A weapon blow's expected damage on a monster; `capped` counts no more than the monster has left. */
function weaponDamage(s: CombatState, p: Party, c: Character, m: MonsterInst, capped = true): number {
  const w = weaponOf(c);
  const chance = toHit(attackBonus(c) + buffHit(s, p) - (w.ranged ? s.rangedPenalty : 0), m.def.ac);
  const blow = Math.max(0, hits(w) + (w.ranged ? 0 : bonus(c.stats.might)) + traitDamage(s, c, w, m));
  return chance * (capped ? Math.min(m.hp, blow) : blow);
}

/** What the monsters still standing deal the company in a round, on average. */
function incoming(s: CombatState, p: Party): number {
  const up = p.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c)), front = up.filter(({ i }) => i < FRONT_ROW);
  let total = 0;
  for (const f of aliveMonsters(s)) {
    const d = s.monsters[f].def, reach = d.ranged || !front.length ? up : front;
    if (!reach.length) continue;
    const ac = reach.reduce((a, { c }) => a + armorClass(c), 0) / reach.length;
    total += toHit(d.attack - (d.missile ? s.rangedPenalty : 0), ac) * Math.max(0, (d.dice * (d.sides + 1)) / 2 + d.bonus);
  }
  return total;
}

export type Bot = (s: CombatState, p: Party, rng: RngInstance, i: number) => void;

/** What a caster's spell point is worth in hit points: what its best mend gives for one, or one if it has none. */
function mendRate(c: Character): number {
  let best = 1;
  for (const x of c.spells.map(spell)) if (x.heal && x.target === 'ally' && !x.raise) best = Math.max(best, spellHeal(c, x.heal) / x.sp);
  return best;
}

/**
 * The thrifty bot. It mends whoever is in danger; otherwise it strikes, and casts a damage spell
 * instead only when the spell pays. Each point of damage it deals over the caster's own blow saves
 * the company the monsters' damage rate over its weapons' rate in hit points. A spell point is worth
 * a hit point, or a healer's what its mending gives for one, and the saving and the spell points are
 * each weighed by how much of that pool the company has left above the rest line. So it spends on
 * what hurts and not on what does not, keeps a healer's points for mending, and casts less as its
 * spell points run down. Under the rest line spell points cost nothing: the company rests after this
 * fight whatever it casts.
 */
export const thrifty: Bot = (s, p, rng, i) => {
  const c = p.members[i];
  const known = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
  // Mending reaches the fallen as well as the standing; only the dead are past it.
  const living = p.members.map((m, j) => ({ m, j })).filter(({ m }) => !hasCondition(m, 'dead') && !hasCondition(m, 'stoned'));
  const everyone = known.filter((x) => x.heal && x.target === 'party').sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
  if (everyone && living.filter(({ m }) => m.hp < m.maxHp / 2).length >= 2 && partyAct(s, p, rng, { type: 'cast', spellId: everyone.id, target: i })) return;
  const worst = living.filter(({ m }) => m.hp < m.maxHp * 0.4).sort((a, b) => a.m.hp / a.m.maxHp - b.m.hp / b.m.maxHp)[0];
  const mends = known.filter((x) => x.heal && x.target === 'ally' && !x.raise);
  if (worst && mends.length) {
    // The cheapest mend that closes half the wound, else the biggest there is.
    const wound = worst.m.maxHp - worst.m.hp;
    const pick = mends.filter((x) => spellHeal(c, x.heal ?? 0) >= wound / 2).sort((a, b) => a.sp - b.sp)[0] ?? mends.sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
    if (partyAct(s, p, rng, { type: 'cast', spellId: pick.id, target: worst.j })) return;
  }
  const foes = aliveMonsters(s);
  if (!foes.length) { partyAct(s, p, rng, { type: 'defend' }); return; }
  const weakest = foes.reduce((a, b) => (s.monsters[b].hp < s.monsters[a].hp ? b : a));
  const armed = canAttackFromRow(c, i), blow = armed ? weaponDamage(s, p, c, s.monsters[weakest]) : 0;
  const weapons = p.members.reduce((a, m, j) => a + (!isDown(m) && canAttackFromRow(m, j) ? weaponDamage(s, p, m, s.monsters[weakest], false) : 0), 0);
  const rate = incoming(s, p) / Math.max(1, weapons);
  // How much of each pool is left above the rest line, as a share of all there is above it.
  const t = pools(p), spare = (left: number, whole: number): number => (left - whole * REST_AT) / (whole * (1 - REST_AT));
  const hpSpare = Math.max(0.05, spare(t.hp, t.maxHp)), spSpare = spare(t.sp, t.maxSp), price = mendRate(c);
  let best: PartyAction = armed ? { type: 'attack', target: weakest } : { type: 'defend' }, worth = 0;
  for (const x of known) {
    if (!x.dice || (x.target !== 'enemy' && x.target !== 'group' && x.target !== 'all')) continue;
    // What the spell would do, no target counted for more than it has left.
    const each = spellDamage(c, x), take = (f: number): number => Math.min(each, s.monsters[f].hp);
    let dmg = 0, target = weakest;
    if (x.target === 'all') dmg = foes.reduce((a, f) => a + take(f), 0);
    else if (x.target === 'enemy') { for (const f of foes) if (take(f) > dmg) { dmg = take(f); target = f; } }
    else {
      const byGroup = new Map<number, number>();
      for (const f of foes) byGroup.set(s.monsters[f].group, (byGroup.get(s.monsters[f].group) ?? 0) + take(f));
      for (const f of foes) { const g = byGroup.get(s.monsters[f].group) ?? 0; if (g > dmg) { dmg = g; target = f; } }
    }
    const value = ((dmg - blow) * rate) / hpSpare - (spSpare > 0 ? (x.sp * price) / spSpare : 0);
    if (value > worth) { worth = value; best = { type: 'cast', spellId: x.id, target }; }
  }
  if (!partyAct(s, p, rng, best)) partyAct(s, p, rng, { type: 'defend' });
};

/**
 * What a company has spent of itself, as shares of what it has when whole: hit points (all of a
 * fallen member's), spell points, and the two together.
 */
export function spent(p: Party): { cost: number; hp: number; sp: number } {
  const t = pools(p);
  return { cost: (t.maxHp - t.hp + t.maxSp - t.sp) / (t.maxHp + t.maxSp), hp: 1 - t.hp / t.maxHp, sp: t.maxSp ? 1 - t.sp / t.maxSp : 0 };
}

export type Encounter = readonly (string | MonsterDef)[];
export interface Outcome { won: boolean; cost: number; hp: number; sp: number; rounds: number; down: boolean }

/** One fight to its end from however the company stands: what it cost, read from what it has left. */
export function fight(p: Party, monsters: Encounter, seed: number, bot: Bot = thrifty): Outcome {
  const rng = makeRng(seed), s = startCombat(p, [{ id: 'harness', monsters }], rng);
  for (let guard = 0; s.outcome === 'ongoing' && guard < 5000; guard++) {
    const t = currentTurn(s, p, rng);
    if (!t) break;
    if (t.side === 'monster') monsterAct(s, p, rng); else bot(s, p, rng, t.i);
  }
  return { won: s.outcome === 'victory', ...spent(p), rounds: s.round, down: p.members.some(isDown) };
}

export interface Tally { cost: number; p90: number; hp: number; sp: number; won: number; rounds: number; down: number }

/** Seeds `from` to `from + seeds - 1`: one fight, a company of `level` against the monsters, each time afresh. */
export function measure(level: number, monsters: Encounter, seeds: number, from = 1, bot: Bot = thrifty): Tally {
  const out: Outcome[] = [];
  for (let k = from; k < from + seeds; k++) out.push(fight(companyAt(level, k), monsters, k * 7919 + 13, bot));
  const mean = (f: (o: Outcome) => number): number => out.reduce((a, o) => a + f(o), 0) / out.length;
  const costs = out.map((o) => o.cost).sort((a, b) => a - b);
  return {
    cost: mean((o) => o.cost), p90: costs[Math.min(costs.length - 1, Math.floor(costs.length * 0.9))], hp: mean((o) => o.hp), sp: mean((o) => o.sp),
    won: mean((o) => (o.won ? 1 : 0)), rounds: mean((o) => o.rounds), down: mean((o) => (o.down ? 1 : 0)),
  };
}

/** Between fights, the company mends itself as a player would, while it has the spell points to. */
export function mendBetween(p: Party): void {
  for (let guard = 0; guard < 60; guard++) {
    const hurt = p.members.filter((m) => !hasCondition(m, 'dead') && !hasCondition(m, 'stoned') && m.hp < m.maxHp / 2).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
    if (!hurt.length) return;
    const healers = p.members.filter((c) => !isDown(c)).map((c) => ({ c, known: c.spells.map(spell).filter((x) => x.context === 'any' && x.heal && !x.raise && x.sp <= c.sp) }));
    const all = healers.flatMap(({ c, known }) => known.filter((x) => x.target === 'party').map((x) => ({ c, x }))).sort((a, b) => a.x.sp - b.x.sp)[0];
    const one = healers.flatMap(({ c, known }) => known.filter((x) => x.target === 'ally').map((x) => ({ c, x }))).sort((a, b) => a.x.sp - b.x.sp)[0];
    if (all && hurt.length >= 2) { all.c.sp -= all.x.sp; for (const m of p.members) heal(m, spellHeal(all.c, all.x.heal ?? 0)); }
    else if (one) { one.c.sp -= one.x.sp; castOnAlly(one.c, one.x, hurt[0]); }
    else return;
  }
}

/** What ends a day: a lost fight, someone dead, too few hit points or spell points, or no end in sight. */
export type Why = 'lost' | 'dead' | 'hp' | 'sp' | 'none';

/**
 * Whether the company must rest before its next fight, and why: someone is dead, someone is still
 * under REST_AT of their hit points once it has mended what it can, or it is under REST_AT of its
 * spell points.
 */
export function mustRest(p: Party): 'dead' | 'hp' | 'sp' | null {
  if (p.members.some((m) => hasCondition(m, 'dead') || hasCondition(m, 'stoned'))) return 'dead';
  if (p.members.some((m) => m.hp < m.maxHp * REST_AT)) return 'hp';
  const t = pools(p);
  if (t.maxSp && t.sp < t.maxSp * REST_AT) return 'sp';
  return null;
}

export interface Day { fights: number; rounds: number; why: Why }

/**
 * Encounters in a row from a fresh company, in turn from `encounters`, mending between them, until it
 * loses one or must rest. The fights it won, the rounds they took on average, and what ended the day.
 */
export function day(level: number, encounters: readonly Encounter[], seed: number, most = 20): Day {
  const p = companyAt(level, seed);
  let rounds = 0;
  for (let n = 0; n < most; n++) {
    const o = fight(p, encounters[n % encounters.length], seed * 104729 + n);
    rounds += o.rounds;
    if (!o.won) return { fights: n, rounds: rounds / (n + 1), why: 'lost' };
    mendBetween(p);
    const why = mustRest(p);
    if (why) return { fights: n + 1, rounds: rounds / (n + 1), why };
  }
  return { fights: most, rounds: rounds / most, why: 'none' };
}

export interface DayTally { fights: number; rounds: number; why: Record<Why, number> }

/** Seeds `from` to `from + seeds - 1` of `day`; with `deal`, the encounters come in a new order each seed. */
export function days(level: number, encounters: readonly Encounter[], seeds: number, from = 1, deal = false): DayTally {
  const why: Record<Why, number> = { lost: 0, dead: 0, hp: 0, sp: 0, none: 0 };
  let fights = 0, rounds = 0;
  for (let k = from; k < from + seeds; k++) {
    const order = [...encounters];
    if (deal) { const rng = makeRng(k * 31 + 7); for (let n = order.length - 1; n > 0; n--) { const j = rng.int(0, n); [order[n], order[j]] = [order[j], order[n]]; } }
    const d = day(level, order, k);
    fights += d.fights; rounds += d.rounds; why[d.why]++;
  }
  for (const w of Object.keys(why) as Why[]) why[w] /= seeds;
  return { fights: fights / seeds, rounds: rounds / seeds, why };
}

/** The level a boss is judged from: EXPANSION.md §5.2's company two levels under it, at the floor. */
export const bossFloor = (level: number): number => Math.max(1, level - 2);

/** Geometric bisection for where a monotone f crosses the target. */
function solve(f: (x: number) => number, target: number, rising: boolean, lo = 0.05, hi = 60, steps = 12): number {
  for (let n = 0; n < steps; n++) { const mid = Math.sqrt(lo * hi); if ((f(mid) < target) === rising) lo = mid; else hi = mid; }
  return Math.sqrt(lo * hi);
}

/** The longest a standard encounter runs before its monsters hit harder instead (DESIGN.md §1: quick). */
export const LONGEST = 4;
/** The most days a standard encounter at the company's level should end in a death or a lost fight. */
export const WORST = 0.1;
/** How long a standard encounter may run instead, where blows hard enough for LONGEST end too many days badly. */
export const SLOWEST = 6;

/**
 * A role's two factors at a level. A regular role hits as today's monsters hit (damage 1, on the
 * line) and takes the hit points that let a company of its level fight FIGHTS of its standard
 * encounter between rests; where the day's fights would run past LONGEST rounds, hit points hold them
 * to LONGEST and damage rises to FIGHTS instead. Where blows that hard end more than WORST of the days
 * in a death or a lost fight, the fights run longer and hit softer, up to SLOWEST rounds: the first
 * that ends no more than WORST badly, or else the one that ends fewest. A role that on the line
 * already leaves the company short of FIGHTS comes down whole, hit points and damage together. A lone
 * boss acts once a round against six, so it takes one factor for both, set so that a company two
 * levels under it wins half the time.
 */
export function calibrate(role: Role, level: number, seeds: number): [number, number] {
  if (role === 'boss') {
    const s = solve((x) => measure(bossFloor(level), standardEncounter(role, level, x, x), seeds).won, 0.5, false);
    return [s, s];
  }
  const run = (h: number, d: number): DayTally => days(level, [standardEncounter(role, level, h, d)], seeds);
  if (run(1, 1).fights < FIGHTS) { const whole = solve((x) => run(x, x).fights, FIGHTS, false, 0.05, 1, 10); return [whole, whole]; }
  const most = solve((x) => run(x, 1).fights, FIGHTS, false, 1, 60, 10);
  if (run(most, 1).rounds <= LONGEST) return [most, 1];
  // Fewer hit points, and for each the damage that brings the day back to FIGHTS: the hit points at
  // which those fights last LONGEST rounds.
  const made = new Map<number, number>();
  const damageFor = (h: number): number => {
    let d = made.get(h);
    if (d === undefined) made.set(h, (d = Math.max(1, solve((x) => run(h, x).fights, FIGHTS, false, 1, 60, 9))));
    return d;
  };
  const quick = solve((x) => run(x, damageFor(x)).rounds, LONGEST, true, 0.05, most, 9);
  // Where their blows end too many days badly, a tenth more hit points a step and softer blows, while
  // the fights stay within SLOWEST rounds and until a step ends no more than WORST of the days badly.
  const bad = (t: DayTally): number => t.why.dead + t.why.lost;
  let pick = quick, least = bad(run(quick, damageFor(quick)));
  for (let h = quick * 1.1; least > WORST && h < most; h *= 1.1) {
    const t = run(h, damageFor(h));
    if (t.rounds > SLOWEST) break;
    if (bad(t) < least) { pick = h; least = bad(t); }
  }
  return [pick, damageFor(pick)];
}

/**
 * A point's damage again with its hit points held at `h`: what brings the day to FIGHTS, or the
 * line's if even that leaves the company short.
 */
export function refit(role: Role, level: number, h: number, seeds: number): [number, number] {
  const run = (d: number): number => days(level, [standardEncounter(role, level, h, d)], seeds).fights;
  return [h, run(1) <= FIGHTS ? 1 : solve(run, FIGHTS, false, 1, 60, 10)];
}

/** One cell of the report: a role's standard encounter at a level, against a company `under` levels below it. */
export interface Cell { day?: DayTally; fresh: Tally }
export function cell(role: Role, level: number, seeds: number, under = 0): Cell {
  const enc = standardEncounter(role, level);
  if (role === 'boss') return { fresh: measure(under ? Math.max(1, level - under) : bossFloor(level), enc, seeds) };
  const at = Math.max(1, level - under);
  return { day: days(at, [enc], seeds), fresh: measure(at, enc, seeds) };
}

// ---- every core ------------------------------------------------------------------------------

interface Job { kind: 'calibrate' | 'refit' | 'cell'; role: Role; level: number; seeds: number; under: number; hp?: number }
const work = (j: Job): [number, number] | Cell =>
  j.kind === 'calibrate' ? calibrate(j.role, j.level, j.seeds) : j.kind === 'refit' ? refit(j.role, j.level, j.hp ?? 1, j.seeds) : cell(j.role, j.level, j.seeds, j.under);

/** The jobs on a worker per core, each taking the next as it finishes one; the results in the jobs' order. */
function onCores<T>(jobs: readonly Job[], each?: (j: Job, r: T) => void): Promise<T[]> {
  const out: T[] = new Array(jobs.length);
  let next = 0, left = jobs.length;
  return new Promise((resolve, reject) => {
    if (!left) return resolve(out);
    for (let w = 0; w < Math.min(jobs.length, os.availableParallelism()); w++) {
      const worker = new Worker(new URL(import.meta.url));
      let at = -1;
      const feed = (): void => { if (next < jobs.length) worker.postMessage(jobs[(at = next++)]); else void worker.terminate(); };
      worker.on('message', (r: T) => { out[at] = r; each?.(jobs[at], r); if (--left === 0) resolve(out); feed(); });
      worker.on('error', reject);
      feed();
    }
  });
}

if (!isMainThread) parentPort?.on('message', (j: Job) => parentPort?.postMessage(work(j)));

// ---- the command line ------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
  const seeds = Number(opt('seeds') ?? 200);
  const levels = (opt('levels')?.split(',').map(Number) ?? [...LEVELS]);
  const roles = (opt('roles')?.split(',') ?? ROLE_IDS) as Role[];
  const under = Number(opt('under') ?? 0);
  const pct = (x: number): string => `${Math.round(x * 100)}`;
  const row = (label: string, cells: readonly string[]): void => console.log(label.padEnd(14) + cells.map((c) => c.padStart(6)).join(''));
  if (levels.some((l) => !(l >= 1 && l <= CAP)) || roles.some((r) => !ROLES[r])) throw new Error(`levels run from 1 to ${CAP}; roles are ${ROLE_IDS.join(', ')}`);

  const map = opt('map');
  if (map) {
    const level = Number(opt('level') ?? 5);
    const def = MAP_DEFS.find((d) => d.id === map);
    if (!def?.encounters?.length) throw new Error(`no map '${map}' with groups`);
    console.log(`${def.id} (band ${def.band?.join('-') ?? '-'}): its groups against a company of ${level}, ${seeds} seeds.`);
    console.log('Fights: that group again and again from fresh, until the company must rest. One fight: from fresh.');
    console.log('group'.padEnd(20) + 'fights'.padStart(7) + 'cost'.padStart(6) + 'won'.padStart(6) + 'rounds'.padStart(8) + '  monsters');
    for (const g of def.encounters) {
      const d = days(level, [g.monsters], seeds), t = measure(level, g.monsters, seeds);
      console.log(g.id.padEnd(20) + d.fights.toFixed(1).padStart(7) + `${pct(t.cost)}%`.padStart(6) + `${pct(t.won)}%`.padStart(6) + t.rounds.toFixed(1).padStart(8) + '  ' + g.monsters.join(' '));
    }
    const all = days(level, def.encounters.map((g) => g.monsters), seeds, 1, true);
    const why = (Object.entries(all.why) as [Why, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([w, n]) => `${{ lost: 'a lost fight', dead: 'a death', hp: 'hit points', sp: 'spell points', none: 'none' }[w]} ${pct(n)}%`);
    console.log(`\nIts groups in a new order each seed: ${all.fights.toFixed(1)} fights before a rest, against ${FIGHTS} at the company's own level. What ended the day: ${why.join(', ')}.`);
    return;
  }

  if (args.includes('--stats')) {
    for (const r of roles) {
      const shape = ROLES[r];
      console.log(`\n${shape.name} (${shape.group} to an encounter${shape.ranged ? ', ranged' : ''}${shape.missile ? ', bows' : ''}${shape.inflict ? `, ${shape.inflict.cond} ${shape.inflict.chance}` : ''}; speed ${shape.speed})`);
      console.log('| Level | Hit points | Armour | To-hit | Damage | Experience |\n|---|---|---|---|---|---|');
      for (const l of levels) {
        const m = testMonster(r, l);
        console.log(`| ${l} | ${m.hp} | ${m.ac} | ${m.attack} | ${m.dice}d${m.sides}${m.bonus ? (m.bonus > 0 ? '+' : '') + m.bonus : ''} (${(m.dice * (m.sides + 1) / 2 + m.bonus).toFixed(1)}) | ${m.xp} |`);
      }
    }
    return;
  }

  if (args.includes('--calibrate')) {
    const t0 = Date.now(), secs = (): string => `${((Date.now() - t0) / 1000).toFixed(0)}s`;
    const fmt = (x: number): string => x.toFixed(2).replace(/\.?0+$/, '');
    const at = (l: number): number => { const k = LEVELS.indexOf(l as (typeof LEVELS)[number]); if (k < 0) throw new Error(`level ${l} is not one of LEVELS`); return k; };
    levels.forEach(at);
    const say = (j: Job, [h, d]: [number, number]): void => console.log(`  ${j.role} ${j.level}: hp ${fmt(h)}, damage ${fmt(d)} (${secs()})`);
    const jobs = roles.flatMap((role) => levels.map((level): Job => ({ kind: 'calibrate', role, level, seeds, under: 0 })));
    const made = await onCores<[number, number]>(jobs, say);
    // The tables with the points just made, as they will be written; the rest stay as they were.
    const next = { hp: {} as Record<Role, number[]>, dmg: {} as Record<Role, number[]> };
    for (const r of ROLE_IDS) { next.hp[r] = [...HP[r]]; next.dmg[r] = [...DAMAGE[r]]; }
    const put = (j: Job, [h, d]: [number, number]): void => { next.hp[j.role][at(j.level)] = Number(fmt(h)); next.dmg[j.role][at(j.level)] = Number(fmt(d)); };
    jobs.forEach((j, k) => put(j, made[k]));
    // A monster never has fewer hit points than the one a level under it: where a point just made has
    // fewer, it keeps that level's, and its damage is solved again (`refit`).
    const held: Job[] = [];
    for (const r of roles.filter((x) => x !== 'boss')) {
      let most = 0;
      LEVELS.forEach((l, k) => {
        const hp = testMonster(r, l, next.hp[r][k], next.dmg[r][k]).hp;
        if (hp < most && levels.includes(l)) held.push({ kind: 'refit', role: r, level: l, seeds, under: 0, hp: Math.ceil((most / (line(l).hp * ROLES[r].hp)) * 100) / 100 });
        most = Math.max(most, hp);
      });
    }
    if (held.length) {
      console.log(`  holding hit points at the level under's: ${held.map((j) => `${j.role} ${j.level}`).join(', ')}`);
      const again = await onCores<[number, number]>(held, say);
      held.forEach((j, k) => put(j, again[k]));
    }
    for (const r of roles) console.log(`  ${`${r}:`.padEnd(12)}hp [${levels.map((l) => fmt(next.hp[r][at(l)])).join(', ')}]  damage [${levels.map((l) => fmt(next.dmg[r][at(l)])).join(', ')}]`);
    console.log(`(${jobs.length} points${held.length ? `, ${held.length} held` : ''}, ${seeds} seeds each, ${secs()})`);
    if (args.includes('--write')) {
      const file = new URL('./testmonster.ts', import.meta.url);
      let src = fs.readFileSync(file, 'utf8');
      for (const [name, table] of [['HP', next.hp], ['DAMAGE', next.dmg]] as const) {
        const body = ROLE_IDS.map((r) => `  ${`${r}:`.padEnd(12)}[${table[r].map(fmt).join(', ')}],`).join('\n');
        const out = src.replace(new RegExp(`(export const ${name}: Record<Role, readonly number\\[\\]> = \\{\\n)[\\s\\S]*?(\\n\\};)`), `$1${body}$2`);
        if (out === src && !src.includes(body)) throw new Error(`${name} block not found in tools/testmonster.ts`);
        src = out;
      }
      fs.writeFileSync(file, src);
      console.log('written to tools/testmonster.ts');
    }
    return;
  }

  console.log(`Standard encounters against a company ${under ? `${under} level${under > 1 ? 's' : ''} under them` : 'of their own level'}, ${seeds} seeds.`);
  console.log(`Fights before a rest: encounters in a row from fresh, mending between them, until the company loses one or must rest:`);
  console.log(`someone dead, anyone under ${pct(REST_AT)}% of their hit points after mending, or the company under ${pct(REST_AT)}% of its spell points.`);
  console.log(`Target ${FIGHTS}: six or seven, with no more than ${pct(WORST)}% of days ending in a death or a lost fight.`);
  console.log(`The boss is fought alone, from ${under ? 'the same company' : 'two levels under it'}: won (target 50%).`);
  const cells = await onCores<Cell>(roles.flatMap((role) => levels.map((level): Job => ({ kind: 'cell', role, level, seeds, under }))));
  const block = (title: string, show: (c: Cell, r: Role) => string, dayOnly = false): void => {
    console.log(`\n${title}`);
    row('', levels.map((l) => `L${l}`));
    roles.forEach((r, i) => { if (!dayOnly || r !== 'boss') row(`${r} ×${ROLES[r].group}`, levels.map((_, k) => show(cells[i * levels.length + k], r))); });
  };
  block('fights before a rest  (boss: won %)', (c) => (c.day ? c.day.fights.toFixed(1) : pct(c.fresh.won)));
  block('rested for spell points %', (c) => pct(c.day!.why.sp), true);
  block('rested for hit points %', (c) => pct(c.day!.why.hp), true);
  block('ended by a death or a lost fight %', (c) => pct(c.day!.why.dead + c.day!.why.lost), true);
  block('rounds a fight, over the day', (c) => c.day!.rounds.toFixed(1), true);
  block('one fight from fresh: cost %', (c) => pct(c.fresh.cost));
  block('one fight from fresh: someone down at the end %', (c) => pct(c.fresh.down));
  if (MAX_LEVEL < Math.max(...levels)) console.log(`\nPast level ${MAX_LEVEL} the company runs on today's rules extended: no new spells, promotions or gear.`);
}

if (isMainThread && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e: unknown) => { console.error(e); process.exit(1); });
