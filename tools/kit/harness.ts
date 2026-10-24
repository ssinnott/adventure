// The harness's library (#984): the thrifty bot, a fight and a day of fights measured, the line
// calibrated against the company, and the report's cells on every core, a worker each running this
// file. Its command line is tools/harness.ts; the suites take these from here.
import os from 'node:os';
import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import { makeRng } from '../../src/lib/engine/rng.ts';
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import { isDown, hasCondition, lift, heal, weaponOf, attackBonus, armsBonus, armorClass, bonus, statOf, hasTrait, spellHeal, rankMult, SPELLFIRE_DMG, MAX_LEVEL, prestigeOf, borne } from '../../src/game/party.ts';
import type { Character, Party } from '../../src/game/party.ts';
import { startCombat, partyAct, aliveMonsters, canAttackFromRow, canReach, sweptRow, asGroup, castOnAlly, castOnParty, toHit, buffHit, traitDamage, monsterAc, monsterHit, seenMult, blowsOf, songDamage, FRONT_ROW, SLUMBER_CHANCE, ROOTS_CHANCE, HOLD_BREAKS } from '../../src/game/combat.ts';
import type { CombatState, MonsterInst, PartyAction, Edge, Fighters } from '../../src/game/combat.ts';
import { spell, spellDice } from '../../src/game/spells.ts';
import type { SpellDef } from '../../src/game/spells.ts';
import { item, hits, chargesLeft, ARTIFACT_LEVEL } from '../../src/game/items.ts';
import { standardEncounter } from './line.ts';
import type { Role } from './line.ts';
import { wakeWith, markOf, ANSWER, breathGuard, mendLines, REST_AT, pools, mustRest, blessWith, sleepWith, drinkFor, sleeps, wakesMany, striker, optsFor, letsLie, asWritten } from '../../src/game/bot.ts';
import type { BotOpts } from '../../src/game/bot.ts';
import { ROUND_CAP, playOut, type Bot } from './fight.ts';
import { type Rules, RULES, edgeOf, fielded, HARNESS } from './company.ts';

/**
 * How many standard encounters at its own level a company should manage between rests: six or seven
 * through level 10, then a fight more every four levels as its power grows, twelve at 32. Never
 * fifteen.
 */
export const fightsPerRest = (level: number): number => Math.min(14, 6.5 + Math.max(0, level - 10) / 4);
/** How far the harness will train a company: the road's cap, as play has it. */
export const CAP = MAX_LEVEL;

/** An artifact's spell's mean on one foe (#847): rolled at the level held at ARTIFACT_LEVEL, with no rank or trait. */
const heldDamage = (c: Character, sp: SpellDef, rules: Readonly<Rules>): number => (spellDice(sp, Math.min(c.level, ARTIFACT_LEVEL), rules.spellsGrowTo) * ((sp.sides ?? 4) + 1)) / 2;
const spellDamage = (c: Character, sp: SpellDef, rules: Readonly<Rules>): number =>
  ((spellDice(sp, c.level, rules.spellsGrowTo) * ((sp.sides ?? 4) + 1)) / 2) * rankMult(c, rules.rankStep) + (hasTrait(c, 'spellfire') ? SPELLFIRE_DMG : 0);

/** A turn's weapon blows' expected damage on a monster; `capped` counts no more than the monster has left. */
function weaponDamage(s: CombatState, p: Party, c: Character, m: MonsterInst, rules: Readonly<Rules>, capped = true): number {
  const w = weaponOf(s.tables.items, c), e = edgeOf(c, s.round, rules), at = p.members.indexOf(c);
  const chance = toHit(attackBonus(s.tables.items, c) + buffHit(s, p, at) - (w.ranged && !(c.cls === 'ranger' && prestigeOf(c) >= 2) ? s.rangedPenalty : 0), monsterAc(s, m));
  const blow = Math.max(0, hits(w) + (w.ranged ? 0 : bonus(statOf(s.tables.items, c, 'might'))) + traitDamage(s, c, w, m) + armsBonus(c) + songDamage(p) + e.damage);
  return (blowsOf(s.tables.items, c) + e.blows - 1) * chance * (capped ? Math.min(m.hp, blow) : blow);
}

/** What the monsters still standing deal the company in a round, on average: all of them, or those of `only`. */
function incoming(s: CombatState, p: Party, rules: Readonly<Rules>, only?: readonly number[]): number {
  const up = p.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c)), front = up.filter(({ i }) => i < FRONT_ROW);
  let total = 0;
  for (const f of only ?? aliveMonsters(s)) {
    const d = s.monsters[f].def, reach = d.ranged || !front.length ? up : front;
    if (!reach.length) continue;
    const ac = reach.reduce((a, { c }) => a + armorClass(s.tables.items, c) + edgeOf(c, s.round, rules).ac, 0) / reach.length;
    // A sweeper's turn is, at its chance, a blow at each of the row it would take.
    const many = d.sweep ? 1 + d.sweep.chance * (sweptRow(p, s.monsters[f]).length - 1) : 1;
    total += toHit(monsterHit(s, s.monsters[f]), ac) * Math.max(0, (d.dice * (d.sides + 1)) / 2 + d.bonus) * many;
  }
  return total;
}

/** What a caster's spell point is worth in hit points: what its best mend gives for one, or one if it has none. */
function mendRate(c: Character, rules: Readonly<Rules>): number {
  let best = 1;
  for (const x of c.spells.map((id) => spell(HARNESS.spells, id))) if (x.heal && x.target === 'ally' && !x.raise) best = Math.max(best, spellHeal(HARNESS.items, c, x.heal, rules.rankStep) / x.sp);
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
 * fight whatever it casts. While a foe that sweeps stands it mends the row it would take sooner (#545).
 * Where `opts` asks (#853), from the first level past Act I as the game's bot (`optsFor`, #865), it
 * weighs Bless (`blessWith`) and sleep (`sleepWith`) as it weighs a damage
 * spell, the saving in hit points against the points: Bless saves what the company's blows would land
 * more for its rounds were worth, sleep the blows the foes it could put down would strike, at the
 * spell's chance, for the rounds a sleeper sleeps (SLEEPS_FOR) or a hold holds, either for no more
 * rounds than the fight has left by the company's weapons; the caster's own blow is lost as for a
 * damage spell. And it drinks (`drinkFor`) where no spell pays, before its blow. It plays by the
 * what-ifs `rules`, the bots' answers among them (`rules.answer`, play's unless set, #946).
 */
export const thrifty = (s: CombatState, p: Party, rng: RngInstance, i: number, opts: BotOpts = {}, rules: Readonly<Rules> = RULES): void => {
  const c = p.members[i], o = optsFor(c, opts), answer = rules.answer ?? ANSWER;
  const known = c.spells.map((id) => spell(s.tables.spells, id)).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
  // The artifacts' spells it bears with a charge left (#847): weighed as its own, at no cost in points.
  const charged = borne(s.tables.items, c).filter((id) => item(s.tables.items, id).casts && chargesLeft(s.tables.items, p, id) > 0).map((from) => ({ from, x: spell(s.tables.spells, item(s.tables.items, from).casts!.spell) }));
  // Mending reaches the fallen as well as the standing; only the dead are past it.
  const living = p.members.map((m, j) => ({ m, j })).filter(({ m }) => !hasCondition(m, 'dead') && !hasCondition(m, 'stoned'));
  const everyone = known.filter((x) => x.heal && x.target === 'party').sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
  if (everyone && living.filter(({ m }) => m.hp < m.maxHp / 2).length >= 2 && partyAct(s, p, rng, { type: 'cast', spellId: everyone.id, target: i })) return;
  // The front row's fallen first while a foe breathes (`breathGuard`), so the breath keeps off the casters.
  const lines = mendLines(s, p, asWritten, answer), guard = breathGuard(s, p, asWritten, answer);
  const worst = guard !== undefined ? { m: p.members[guard], j: guard } : living.filter(({ m, j }) => m.hp < lines[j]).sort((a, b) => a.m.hp / a.m.maxHp - b.m.hp / b.m.maxHp)[0];
  const mends = known.filter((x) => x.heal && x.target === 'ally' && !x.raise);
  if (worst && mends.length) {
    // The cheapest mend that closes half the wound, else the biggest there is.
    const wound = worst.m.maxHp - worst.m.hp;
    const pick = mends.filter((x) => spellHeal(s.tables.items, c, x.heal ?? 0, rules.rankStep) >= wound / 2).sort((a, b) => a.sp - b.sp)[0] ?? mends.sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
    if (partyAct(s, p, rng, { type: 'cast', spellId: pick.id, target: worst.j })) return;
  }
  const sleeper = wakeWith(s.tables.spells, p, c, answer);
  if (sleeper && partyAct(s, p, rng, { type: 'cast', ...sleeper })) return;
  const foes = aliveMonsters(s);
  if (!foes.length) { partyAct(s, p, rng, { type: 'defend' }); return; }
  // A blade at a leader or a caller it reaches (`markOf`), else at the weakest it reaches. With sleep
  // on, sleepers are let lie (#853): a blade and a spell at an awake foe where there is one, and no
  // spell over many that would wake one (`wakesMany`); only while another member can strike (`striker`,
  // #865), and only then is a group slept; the whole company once one is past Act I (`letsLie`).
  const lie = letsLie(p, opts) && striker(s, p, i), up = lie ? foes.filter((f) => !sleeps(s.monsters[f])) : [];
  const reach = foes.filter((f) => canReach(s, c, f)), awake = reach.filter((f) => up.includes(f)), near = awake.length ? awake : reach;
  const lead = markOf(s, foes, asWritten, answer), pick = up.length ? up : foes, mark = lead !== undefined && pick.includes(lead) ? lead : undefined;
  const weakest = lead !== undefined && near.includes(lead) ? lead : (near.length ? near : foes).reduce((a, b) => (s.monsters[b].hp < s.monsters[a].hp ? b : a));
  const armed = canAttackFromRow(s.tables.items, c, i), blow = armed ? weaponDamage(s, p, c, s.monsters[weakest], rules) : 0;
  const weapons = p.members.reduce((a, m, j) => a + (!isDown(m) && canAttackFromRow(s.tables.items, m, j) ? weaponDamage(s, p, m, s.monsters[weakest], rules, false) : 0), 0);
  const rate = incoming(s, p, rules) / Math.max(1, weapons);
  // How much of each pool is left above the rest line, as a share of all there is above it.
  const t = pools(p), spare = (left: number, whole: number): number => (left - whole * REST_AT) / (whole * (1 - REST_AT));
  const hpSpare = Math.max(0.05, spare(t.hp, t.maxHp)), spSpare = spare(t.sp, t.maxSp), price = mendRate(c, rules);
  let best: PartyAction = armed ? { type: 'attack', target: weakest } : { type: 'defend' }, worth = 0;
  // Bless and sleep, where `opts` asks: the hit points the cast saves, weighed as a damage spell's.
  const pays = (x: SpellDef, saved: number, free = false): number => (saved - blow * rate) / hpSpare - (spSpare > 0 && !free ? (x.sp * price) / spSpare : 0);
  const left = (): number => foes.reduce((a, f) => a + s.monsters[f].hp, 0) / Math.max(1, weapons);
  const bless = o.bless ? blessWith(s, p, i) : undefined;
  if (bless) {
    const runs = { ...s, bless: bless.turns ?? 1 }, target = s.monsters[weakest];
    const more = p.members.reduce((a, m, j) => a + (!isDown(m) && canAttackFromRow(s.tables.items, m, j) ? weaponDamage(runs, p, m, target, rules, false) - weaponDamage(s, p, m, target, rules, false) : 0), 0);
    const v = pays(bless, more * Math.min(bless.turns ?? 1, left()) * rate);
    if (v > worth) { worth = v; best = { type: 'cast', spellId: bless.id, target: i }; }
  }
  const hold = charged.find(({ x }) => x.inflict);
  // An artifact's hold is weighed whatever `opts` asks (#847): a charge costs no points, and its bearer may strike nothing from their row.
  for (const [sleep, from] of [[o.sleep && lie ? sleepWith(s, c) : undefined], [hold ? sleepWith(s, c, undefined, hold.x) : undefined, hold?.from]] as const) {
    if (!sleep) continue;
    const held = sleep.spell.inflict === 'paralysed';
    const v = pays(sleep.spell, incoming(s, p, rules, sleep.foes) * (held ? ROOTS_CHANCE : SLUMBER_CHANCE) * Math.min(held ? 1 / HOLD_BREAKS : SLEEPS_FOR, left()), !!from);
    if (v > worth) { worth = v; best = { type: 'cast', spellId: sleep.spell.id, target: sleep.target, ...(from ? { from } : {}) }; }
  }
  for (const { x, from } of [...known.map((x) => ({ x, from: undefined })), ...charged]) {
    if (!x.dice || (x.target !== 'enemy' && x.target !== 'group' && x.target !== 'all')) continue;
    // What the spell would do, by what the company has seen its element do to each, no target counted
    // for more than it has left; and fire, the mending it stops this round in each it leaves standing
    // that the company has seen mend and nothing has burnt yet.
    const each = from ? heldDamage(c, x, rules) : spellDamage(c, x, rules), dealt = (f: number): number => Math.min(each * seenMult(s, s.monsters[f], x.element), s.monsters[f].hp);
    const stops = (f: number): number => { const m = s.monsters[f]; return x.element === 'fire' && !m.burnt && dealt(f) > 0 && dealt(f) < m.hp ? s.mends?.[m.def.id] ?? 0 : 0; };
    const take = (f: number): number => dealt(f) + stops(f);
    let dmg = 0, target = weakest;
    if (lie && x.target === 'all' && wakesMany(s, x, foes[0])) continue;
    if (x.target === 'all') dmg = foes.reduce((a, f) => a + take(f), 0);
    else if (x.target === 'enemy') { if (mark !== undefined) { dmg = take(mark); target = mark; } else for (const f of pick) if (take(f) > dmg) { dmg = take(f); target = f; } }
    else {
      const byGroup = new Map<number, number>();
      for (const f of foes) byGroup.set(s.monsters[f].group, (byGroup.get(s.monsters[f].group) ?? 0) + take(f));
      for (const f of foes) { const g = byGroup.get(s.monsters[f].group) ?? 0; if (g > dmg && !(lie && wakesMany(s, x, f))) { dmg = g; target = f; } }
    }
    const value = ((dmg - blow) * rate) / hpSpare - (spSpare > 0 && !from ? (x.sp * price) / spSpare : 0);
    if (value > worth) { worth = value; best = { type: 'cast', spellId: x.id, target, ...(from ? { from } : {}) }; }
  }
  // A draught, where `opts` asks: where no spell pays, before a blow.
  const drink = o.drink && best.type !== 'cast' ? drinkFor(s, p, c, asWritten, answer) : undefined;
  if (drink && partyAct(s, p, rng, drink)) return;
  if (!partyAct(s, p, rng, best)) partyAct(s, p, rng, { type: 'defend' });
};

/**
 * The rounds a foe Slumber takes sleeps, on average: the bots let it lie while a foe stands awake
 * (#853), so it wakes by its own rolls, at a quarter of its turns (`currentTurn`).
 */
const SLEEPS_FOR = 4;

/**
 * What a company has spent of itself, as shares of what it has when whole: hit points (all of a
 * fallen member's), spell points, and the two together.
 */
export function spent(p: Party): { cost: number; hp: number; sp: number } {
  const t = pools(p);
  return { cost: (t.maxHp - t.hp + t.maxSp - t.sp) / (t.maxHp + t.maxSp), hp: 1 - t.hp / t.maxHp, sp: t.maxSp ? 1 - t.sp / t.maxSp : 0 };
}

export type Encounter = Fighters;
export interface Outcome { won: boolean; cost: number; hp: number; sp: number; rounds: number; down: boolean; broken: boolean }

/** One fight to its end from however the company stands, under the what-ifs `rules`, the bot playing it with the options `rules.bot` asks: the fight as it ended, to read. */
export function play(p: Party, monsters: Encounter, seed: number, bot: Bot = thrifty, rules: Readonly<Rules> = RULES): CombatState {
  const edge = rules.levelTraits || rules.levelBonus ? (c: Character, cs: CombatState): Edge => edgeOf(c, cs.round, rules) : undefined;
  const rng = makeRng(seed), s = startCombat(HARNESS, p, [asGroup('harness', monsters)], rng, { spellsGrowTo: rules.spellsGrowTo, rankStep: rules.rankStep, edge });
  return playOut(s, p, rng, bot, rules, ROUND_CAP);
}

/** How often the bots took each of their options (#853) in fights: the share of the fights in which one blessed, slept a group or drank. */
export interface Casts { bless: number; sleep: number; drink: number }
/**
 * Seeds `from` to `from + seeds - 1` of one fight from fresh, as `measure` fights them: the share in
 * which a member cast Bless, Slumber or Grasping Roots, or drank or gave a draught, read from the log.
 */
export function casting(level: number, monsters: Encounter, seeds: number, from = 1, rules: Readonly<Rules> = RULES): Casts {
  const bless = ` casts ${spell(HARNESS.spells, 'bless').name}. `, sleep = [spell(HARNESS.spells, 'sleep').name, spell(HARNESS.spells, 'roots').name].map((n) => [` casts ${n}: `, ` casts ${n}, `]).flat();
  const draught = / (recovers \d+|feels sharper|is flesh again|is cleansed)\.$/;
  const out: Casts = { bless: 0, sleep: 0, drink: 0 };
  for (let k = from; k < from + seeds; k++) {
    const p = fielded(level, k, rules), s = play(p, monsters, k * 7919 + 13, thrifty, rules), ours = s.log.filter((l) => p.members.some((m) => l.startsWith(`${m.name} `)));
    if (ours.some((l) => l.includes(bless))) out.bless++;
    if (ours.some((l) => sleep.some((x) => l.includes(x)))) out.sleep++;
    if (ours.some((l) => !l.includes(' casts ') && draught.test(l))) out.drink++;
  }
  return { bless: out.bless / seeds, sleep: out.sleep / seeds, drink: out.drink / seeds };
}

/** What a fight played came to, read from its end and from what the company has left. */
export const outcomeOf = (s: CombatState, p: Party): Outcome => ({ won: s.outcome === 'victory', ...spent(p), rounds: Math.min(s.round, ROUND_CAP), down: p.members.some(isDown), broken: s.outcome === 'ongoing' });

/** One fight to its end from however the company stands: what it cost, read from what it has left. */
export function fight(p: Party, monsters: Encounter, seed: number, bot: Bot = thrifty, rules: Readonly<Rules> = RULES): Outcome {
  return outcomeOf(play(p, monsters, seed, bot, rules), p);
}

export interface Tally { cost: number; p90: number; hp: number; sp: number; won: number; rounds: number; down: number }

/** Seeds `from` to `from + seeds - 1`: one fight, a company of `level` against the monsters, each time afresh, under the what-ifs `rules`. */
export function measure(level: number, monsters: Encounter, seeds: number, from = 1, bot: Bot = thrifty, rules: Readonly<Rules> = RULES): Tally {
  const out: Outcome[] = [];
  for (let k = from; k < from + seeds; k++) out.push(fight(fielded(level, k, rules), monsters, k * 7919 + 13, bot, rules));
  const mean = (f: (o: Outcome) => number): number => out.reduce((a, o) => a + f(o), 0) / out.length;
  const costs = out.map((o) => o.cost).sort((a, b) => a - b);
  return {
    cost: mean((o) => o.cost), p90: costs[Math.min(costs.length - 1, Math.floor(costs.length * 0.9))], hp: mean((o) => o.hp), sp: mean((o) => o.sp),
    won: mean((o) => (o.won ? 1 : 0)), rounds: mean((o) => o.rounds), down: mean((o) => (o.down ? 1 : 0)),
  };
}

/**
 * Between fights, stone first (#546): each member turned to glass is lifted by Absolve where a member
 * standing knows it and has the points, else by a draught the company carries, the bag's before a
 * pack's. One with neither waits for a temple, and the company must rest (`mustRest`).
 */
export function unstone(p: Party, rules: Readonly<Rules> = RULES): void {
  const absolve = spell(HARNESS.spells, 'absolve'), cures = (id: string): boolean => !!item(HARNESS.items, id).use?.cure?.includes('stoned');
  for (const m of p.members.filter((x) => hasCondition(x, 'stoned'))) {
    const caster = p.members.find((c) => !isDown(c) && c.spells.includes(absolve.id) && c.sp >= absolve.sp);
    if (caster) { caster.sp -= absolve.sp; castOnAlly(HARNESS.items, caster, absolve, m, rules.rankStep); continue; }
    const holder = [p.bag, ...p.members.map((c) => c.pack)].find((h) => h.some(cures)), id = holder?.find(cures);
    if (holder && id) { holder.splice(holder.indexOf(id), 1); lift(HARNESS.items, m, item(HARNESS.items, id).use?.cure ?? []); }
  }
}

/** Between fights, the company lifts stone (`unstone`), then mends itself as a player would, while it has the spell points to, under the what-ifs `rules`. */
export function mendBetween(p: Party, rules: Readonly<Rules> = RULES): void {
  unstone(p, rules);
  for (let guard = 0; guard < 60; guard++) {
    const hurt = p.members.filter((m) => !hasCondition(m, 'dead') && !hasCondition(m, 'stoned') && m.hp < m.maxHp / 2).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
    if (!hurt.length) return;
    const healers = p.members.filter((c) => !isDown(c)).map((c) => ({ c, known: c.spells.map((id) => spell(HARNESS.spells, id)).filter((x) => x.context === 'any' && x.heal && !x.raise && x.sp <= c.sp) }));
    const all = healers.flatMap(({ c, known }) => known.filter((x) => x.target === 'party').map((x) => ({ c, x }))).sort((a, b) => a.x.sp - b.x.sp)[0];
    const one = healers.flatMap(({ c, known }) => known.filter((x) => x.target === 'ally').map((x) => ({ c, x }))).sort((a, b) => a.x.sp - b.x.sp)[0];
    if (all && hurt.length >= 2) { all.c.sp -= all.x.sp; castOnParty(HARNESS.items, all.c, all.x, p, rules.rankStep); }
    else if (one) { one.c.sp -= one.x.sp; castOnAlly(HARNESS.items, one.c, one.x, hurt[0], rules.rankStep); }
    else return;
  }
}

/**
 * What ends a day: a lost fight, a fight broken off at ROUND_CAP, someone dead, too few hit points or
 * spell points, or no end in sight.
 */
export type Why = 'lost' | 'long' | 'dead' | 'hp' | 'sp' | 'none';

export interface Day { fights: number; rounds: number; why: Why }

/**
 * Encounters in a row from a fresh company, in turn from `encounters`, mending between them, until it
 * loses one or must rest; `dress` changes the company first, to try it without something; under the what-ifs `rules`. The fights it won, the rounds they took on average, and what ended the day.
 */
export function day(level: number, encounters: readonly Encounter[], seed: number, most = 30, dress = (p: Party): Party => p, rules: Readonly<Rules> = RULES): Day {
  const p = dress(fielded(level, seed, rules));
  let rounds = 0;
  for (let n = 0; n < most; n++) {
    const o = fight(p, encounters[n % encounters.length], seed * 104729 + n, thrifty, rules);
    rounds += o.rounds;
    if (!o.won) return { fights: n, rounds: rounds / (n + 1), why: o.broken ? 'long' : 'lost' };
    mendBetween(p, rules);
    const why = mustRest(p);
    if (why) return { fights: n + 1, rounds: rounds / (n + 1), why };
  }
  return { fights: most, rounds: rounds / most, why: 'none' };
}

export interface DayTally { fights: number; rounds: number; why: Record<Why, number> }

/** Seeds `from` to `from + seeds - 1` of `day`, under the what-ifs `rules`; with `deal`, the encounters come in a new order each seed. */
export function days(level: number, encounters: readonly Encounter[], seeds: number, from = 1, deal = false, rules: Readonly<Rules> = RULES): DayTally {
  const why: Record<Why, number> = { lost: 0, long: 0, dead: 0, hp: 0, sp: 0, none: 0 };
  let fights = 0, rounds = 0;
  for (let k = from; k < from + seeds; k++) {
    const order = [...encounters];
    if (deal) { const rng = makeRng(k * 31 + 7); for (let n = order.length - 1; n > 0; n--) { const j = rng.int(0, n); [order[n], order[j]] = [order[j], order[n]]; } }
    const d = day(level, order, k, 30, undefined, rules);
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

/**
 * The longest a standard encounter runs before its monsters hit harder instead (DESIGN.md §1: quick):
 * four rounds at level 1, and a round more every eight levels as both sides grow, to eight at 32.
 */
export const longest = (level: number): number => 4 + (level - 1) / 8;
/** The most days a standard encounter at the company's level should end in a death, a lost fight or one broken off. */
export const WORST = 0.1;
/** The hardest a regular monster hits, as a share of the line's damage: two and a half times. */
export const HARDEST = 2.5;
/**
 * How long a standard encounter may run instead, where blows hard enough for `longest` end too many
 * days badly: half as long again, six rounds at level 1 and twelve at 32, and never fifteen.
 */
export const slowest = (level: number): number => Math.min(14, 1.5 * longest(level));

/**
 * A role's two factors at a level. A regular role hits as today's monsters hit (damage 1, on the
 * line) and takes the hit points that let a company of its level fight `fightsPerRest` of its
 * standard encounter between rests; where the day's fights would run past `longest` rounds, hit points
 * hold them to that and damage rises instead. Where the days then end in a death, a lost fight or one
 * broken off more than WORST of the time, it steps along the same curve the way that helps: shorter
 * fights and harder blows where fights are broken off (never past HARDEST), longer and softer ones
 * where members die or fights are lost (never under the line's damage, nor past `slowest` rounds);
 * the first step that ends no more than WORST badly, or else the one that ends fewest. A role that on the line already leaves
 * the company short comes down whole, hit points and damage together. A lone boss acts once a round
 * against six, so it takes one factor for both, set so that a company two levels under it wins half
 * the time.
 */
/**
 * A calibrated point: hit points and damage factors, and what the day at them comes to: the share of
 * days that end in a death, a lost fight or one broken off (a boss's: the fights lost), the fights
 * before a rest (a boss's: won) and the rounds a fight.
 */
export type Point = [hp: number, damage: number, bad: number, fights: number, rounds: number];
const badOf = (t: DayTally): number => t.why.dead + t.why.lost + t.why.long;
export function calibrate(role: Role, level: number, seeds: number, rules: Readonly<Rules> = RULES): Point {
  if (role === 'boss') {
    const s = solve((x) => measure(bossFloor(level), standardEncounter(role, level, x, x), seeds, 1, thrifty, rules).won, 0.5, false), t = measure(bossFloor(level), standardEncounter(role, level, s, s), seeds, 1, thrifty, rules);
    return [s, s, 1 - t.won, t.won, t.rounds];
  }
  const run = (h: number, d: number): DayTally => days(level, [standardEncounter(role, level, h, d)], seeds, 1, false, rules), target = fightsPerRest(level);
  const point = (h: number, d: number): Point => { const t = run(h, d); return [h, d, badOf(t), t.fights, t.rounds]; };
  if (run(1, 1).fights < target) { const whole = solve((x) => run(x, x).fights, target, false, 0.05, 1, 10); return point(whole, whole); }
  const most = solve((x) => run(x, 1).fights, target, false, 1, 60, 10);
  // For hit points under `most`, the damage that brings the day back to its fights.
  const made = new Map<number, number>();
  const damageFor = (h: number): number => {
    if (h >= most) return 1;
    let d = made.get(h);
    if (d === undefined) made.set(h, (d = Math.max(1, solve((x) => run(h, x).fights, target, false, 1, 60, 9))));
    return d;
  };
  const start = run(most, 1).rounds <= longest(level) ? most : solve((x) => run(x, damageFor(x)).rounds, longest(level), true, 0.05, most, 9);
  const bad = badOf;
  const first = run(start, damageFor(start)), shorter = first.why.long > first.why.dead + first.why.lost;
  let pick = start, least = bad(first);
  for (let k = 1, h = start; k <= 8 && least > WORST; k++) {
    h = shorter ? h / 1.1 : h * 1.1;
    if (shorter ? damageFor(h) > HARDEST : h > most) break;
    const t = run(h, damageFor(h));
    if (!shorter && t.rounds > slowest(level)) break;
    if (bad(t) < least) { pick = h; least = bad(t); }
  }
  return point(pick, damageFor(pick));
}

/**
 * A point's damage again with its hit points held at `h`: what brings the day to its fights, or the
 * line's if even that leaves the company short.
 */
export function refit(role: Role, level: number, h: number, seeds: number, rules: Readonly<Rules> = RULES): Point {
  const run = (d: number): number => days(level, [standardEncounter(role, level, h, d)], seeds, 1, false, rules).fights, target = fightsPerRest(level);
  const d = run(1) <= target ? 1 : solve(run, target, false, 1, 60, 10), t = days(level, [standardEncounter(role, level, h, d)], seeds, 1, false, rules);
  return [h, d, badOf(t), t.fights, t.rounds];
}

/**
 * One cell of the report: a role's standard encounter at a level, against a company `under` levels
 * below it, under the what-ifs `rules`; where `rules.bot` asks, with how often the bots took their options in its fights from fresh.
 */
export interface Cell { day?: DayTally; fresh: Tally; casts?: Casts }
/** The level a role's encounter at `level` is fought from: `under` below it, or a boss's floor. */
export const fieldedAt = (role: Role, level: number, under = 0): number => (role === 'boss' && !under ? bossFloor(level) : Math.max(1, level - under));
export function cell(role: Role, level: number, seeds: number, under = 0, rules: Readonly<Rules> = RULES): Cell {
  const enc = standardEncounter(role, level), at = fieldedAt(role, level, under), casts = rules.bot ? { casts: casting(at, enc, seeds, 1, rules) } : {};
  if (role === 'boss') return { fresh: measure(at, enc, seeds, 1, thrifty, rules), ...casts };
  return { day: days(at, [enc], seeds, 1, false, rules), fresh: measure(at, enc, seeds, 1, thrifty, rules), ...casts };
}

/** A job for a worker; its what-ifs travel in it, as `rules`. */
export interface Job { kind: 'calibrate' | 'refit' | 'cell'; role: Role; level: number; seeds: number; under: number; hp?: number; rules: Readonly<Rules> }
export const work = (j: Job): Point | Cell =>
  j.kind === 'calibrate' ? calibrate(j.role, j.level, j.seeds, j.rules) : j.kind === 'refit' ? refit(j.role, j.level, j.hp ?? 1, j.seeds, j.rules) : cell(j.role, j.level, j.seeds, j.under, j.rules);

/**
 * The jobs on a worker per core, each taking the next as it finishes one; the results in the jobs' order.
 * A worker that throws, or stops with a job unfinished, fails the lot, and so does a job that runs past
 * `limit` milliseconds: every worker is stopped then, so a run never hangs on one.
 */
export function onCores<T>(jobs: readonly Job[], each?: (j: Job, r: T) => void, limit = Infinity): Promise<T[]> {
  const out: T[] = new Array(jobs.length), workers: Worker[] = [];
  let next = 0, left = jobs.length, over = false;
  return new Promise((resolve, reject) => {
    if (!left) return resolve(out);
    const fail = (e: Error): void => { if (over) return; over = true; for (const w of workers) void w.terminate(); reject(e); };
    const said = (j: Job): string => `${j.kind} ${j.role} at ${j.level}`;
    // The cores the test runner gives it beside its other jobs (TEST_CORES, tools/test.ts --jobs, #954), else every core.
    for (let w = 0; w < Math.min(jobs.length, Math.max(1, Number(process.env.TEST_CORES) || os.availableParallelism())); w++) {
      const worker = new Worker(new URL(import.meta.url));
      let at = -1, busy = false, timer: ReturnType<typeof setTimeout> | undefined;
      workers.push(worker);
      const feed = (): void => {
        if (over || next >= jobs.length) { void worker.terminate(); return; }
        worker.postMessage(jobs[(at = next++)]);
        busy = true;
        if (Number.isFinite(limit)) timer = setTimeout(() => fail(new Error(`a worker ran past ${limit} ms on ${said(jobs[at])}`)), limit);
      };
      worker.on('message', (r: T) => { clearTimeout(timer); busy = false; out[at] = r; each?.(jobs[at], r); if (--left === 0) { over = true; resolve(out); } feed(); });
      worker.on('error', (e: Error) => { clearTimeout(timer); fail(e); });
      worker.on('exit', (code) => { clearTimeout(timer); if (busy) fail(new Error(`a worker stopped (code ${code}) on ${said(jobs[at])}`)); });
      feed();
    }
  });
}

/**
 * The report's cells on every core, under the what-ifs `rules`: each of `roles` at each of `levels`, in
 * that order; a cell past `limit` milliseconds fails them (`onCores`).
 */
export const cellsOnCores = (roles: readonly Role[], levels: readonly number[], seeds: number, under = 0, limit = Infinity, rules: Readonly<Rules> = RULES): Promise<Cell[]> =>
  onCores<Cell>(roles.flatMap((role) => levels.map((level): Job => ({ kind: 'cell', role, level, seeds, under, rules }))), undefined, limit);

/** A worker, run on this file by `onCores`: each job it is handed done here, its result posted back. */
if (!isMainThread) parentPort?.on('message', (j: Job) => { parentPort?.postMessage(work(j)); });
