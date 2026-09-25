// The combat test harness (docs/MONSTERS.md §4.4): a company of a given level fights an encounter
// from full health, once per seed, and the harness says what the fight cost it. The yardstick is the
// design's: a standard encounter at the company's own level costs it about 15% of its hit points and
// spell points together, so six or seven fights between rests.
//   node tools/harness.ts                              each role's standard encounter, at every level made
//   node tools/harness.ts --roles soldier,brute --levels 2,6,10 --seeds 400
//   node tools/harness.ts --under 2                    the company two levels under the monsters
//   node tools/harness.ts --map thornmark --level 5    a map's own groups, against a company of 5
//   node tools/harness.ts --day                        how many encounters in a row before a rest
//   node tools/harness.ts --stats                      the test monsters' stat lines, as markdown
//   node tools/harness.ts --calibrate [--write]        re-derive HP and DAMAGE in tools/testmonster.ts
// The company is the premade six, trained to the level (past today's cap if asked) and dressed in what
// the item tables give it by then (GEAR). A thrifty bot plays it (see `thrifty`), where tools/gate.ts's
// bot spends: it mends whoever is in danger, strikes, and casts a damage spell only when the hit points
// the spell saves outweigh its spell points. It never blesses, sleeps, cures, drinks or flees. A
// fight's cost is read at its end: the hit points and spell points the company no longer has, over
// what it had, a member who is down counting as all of their hit points.
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
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
import { ROLES, ROLE_IDS, LEVELS, HP, DAMAGE, standardEncounter, testMonster } from './testmonster.ts';
import type { Role } from './testmonster.ts';

/** What a standard encounter at the company's own level should cost it. */
export const TARGET = 0.15;
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

/**
 * The thrifty bot. It mends whoever is in danger; otherwise it strikes, and casts a damage spell
 * instead only when the spell pays: each point of damage it deals over the caster's own blow saves
 * the company the monsters' damage rate over its weapons' rate in hit points, and that saving must
 * outweigh the spell points. So it spends freely on what hurts and not at all on what does not.
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
    const value = (dmg - blow) * rate - x.sp;
    if (value > worth) { worth = value; best = { type: 'cast', spellId: x.id, target }; }
  }
  if (!partyAct(s, p, rng, best)) partyAct(s, p, rng, { type: 'defend' });
};

/**
 * What a company has spent of itself, as shares of what it has when whole: hit points (all of a
 * fallen member's), spell points, and the two together, which is the cost the 15% is measured on.
 */
export function spent(p: Party): { cost: number; hp: number; sp: number } {
  const maxHp = p.members.reduce((a, c) => a + c.maxHp, 0), maxSp = p.members.reduce((a, c) => a + c.maxSp, 0);
  const hp = p.members.reduce((a, c) => a + c.maxHp - (isDown(c) ? 0 : Math.min(c.maxHp, c.hp)), 0);
  const sp = p.members.reduce((a, c) => a + c.maxSp - c.sp, 0);
  return { cost: (hp + sp) / (maxHp + maxSp), hp: hp / maxHp, sp: maxSp ? sp / maxSp : 0 };
}

export interface Outcome { won: boolean; cost: number; hp: number; sp: number; rounds: number; down: boolean }

/** One fight to its end from however the company stands: what it cost, read from what it has left. */
export function fight(p: Party, monsters: readonly (string | MonsterDef)[], seed: number, bot: Bot = thrifty): Outcome {
  const rng = makeRng(seed), s = startCombat(p, [{ id: 'harness', monsters }], rng);
  for (let guard = 0; s.outcome === 'ongoing' && guard < 5000; guard++) {
    const t = currentTurn(s, p, rng);
    if (!t) break;
    if (t.side === 'monster') monsterAct(s, p, rng); else bot(s, p, rng, t.i);
  }
  return { won: s.outcome === 'victory', ...spent(p), rounds: s.round, down: p.members.some(isDown) };
}

export interface Tally { cost: number; p90: number; hp: number; sp: number; won: number; rounds: number; down: number }

/** Seeds `from` to `from + seeds - 1`: a company of `level` against the monsters, each time afresh. */
export function measure(level: number, monsters: readonly (string | MonsterDef)[], seeds: number, from = 1, bot: Bot = thrifty): Tally {
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

/**
 * Encounters in a row from a fresh company, mending between them, until it must rest: when a fight
 * is lost, someone is dead, or it is under a quarter of its hit points. The fights it won that day.
 * At 15% a fight the rule means six or seven.
 */
export function day(level: number, monsters: readonly (string | MonsterDef)[], seed: number, most = 20): number {
  const p = companyAt(level, seed), whole = p.members.reduce((a, c) => a + c.maxHp, 0);
  for (let n = 0; n < most; n++) {
    if (!fight(p, monsters, seed * 104729 + n).won) return n;
    if (p.members.some((m) => hasCondition(m, 'dead'))) return n + 1;
    mendBetween(p);
    if (p.members.reduce((a, c) => a + (isDown(c) ? 0 : c.hp), 0) < whole / 4) return n + 1;
  }
  return most;
}

/** The level a boss is judged from: EXPANSION.md §5.2's company two levels under it, at the floor. */
export const bossFloor = (level: number): number => Math.max(1, level - 2);

/** Geometric bisection for where a monotone f crosses the target. */
function solve(f: (x: number) => number, target: number, rising: boolean, lo = 0.05, hi = 60, steps = 18): number {
  for (let n = 0; n < steps; n++) { const mid = Math.sqrt(lo * hi); if ((f(mid) < target) === rising) lo = mid; else hi = mid; }
  return Math.sqrt(lo * hi);
}

/** The longest a standard encounter runs before its monsters hit harder instead (DESIGN.md §1: quick). */
export const LONGEST = 4;

/**
 * A role's two factors at a level. A regular role hits as today's monsters hit (damage 1, on the
 * line) and takes the hit points that make its standard encounter cost 15% of a company of its level;
 * where that would run past LONGEST rounds, hit points hold it to LONGEST and damage rises to the
 * 15% instead. A lone boss acts once a round against six, so it takes one factor for both, set so that
 * a company two levels under it wins half the time.
 */
export function calibrate(role: Role, level: number, seeds: number): [number, number] {
  if (role === 'boss') {
    const s = solve((x) => measure(bossFloor(level), standardEncounter(role, level, x, x), seeds).won, 0.5, false);
    return [s, s];
  }
  const run = (h: number, d: number): Tally => measure(level, standardEncounter(role, level, h, d), seeds);
  const most = solve((x) => run(x, 1).cost, TARGET, true);
  if (run(most, 1).rounds <= LONGEST) return [most, 1];
  // Fewer hit points, and for each the damage that brings the cost back to 15%: the hit points
  // at which that fight lasts LONGEST rounds.
  const damageFor = (h: number): number => Math.max(1, solve((x) => run(h, x).cost, TARGET, true, 1, 60, 14));
  const h = solve((x) => run(x, damageFor(x)).rounds, LONGEST, true, 0.05, most, 14);
  return [h, damageFor(h)];
}

// ---- the command line ------------------------------------------------------------------------

function main(): void {
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
    console.log(`${def.id} (band ${def.band?.join('-') ?? '-'}): each group against a company of ${level}, ${seeds} seeds`);
    console.log('group'.padEnd(20) + 'cost'.padStart(6) + 'p90'.padStart(6) + 'won'.padStart(6) + 'rounds'.padStart(8) + '  monsters');
    let sum = 0;
    for (const g of def.encounters) {
      const t = measure(level, g.monsters, seeds);
      sum += t.cost;
      console.log(g.id.padEnd(20) + `${pct(t.cost)}%`.padStart(6) + `${pct(t.p90)}%`.padStart(6) + `${pct(t.won)}%`.padStart(6) + t.rounds.toFixed(1).padStart(8) + '  ' + g.monsters.join(' '));
    }
    console.log(`mean cost ${pct(sum / def.encounters.length)}% against a target of ${pct(TARGET)}% at the company's own level`);
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
    const t0 = Date.now(), fmt = (x: number): string => x.toFixed(2).replace(/\.?0+$/, '');
    const hp: Record<string, string[]> = {}, dmg: Record<string, string[]> = {};
    for (const r of roles) {
      const pairs = levels.map((l) => calibrate(r, l, seeds));
      hp[r] = pairs.map(([h]) => fmt(h)); dmg[r] = pairs.map(([, d]) => fmt(d));
      console.log(`  ${`${r}:`.padEnd(12)}hp [${hp[r].join(', ')}]  damage [${dmg[r].join(', ')}]`);
    }
    console.log(`(${roles.length * levels.length} points, ${seeds} seeds each, ${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    if (args.includes('--write')) {
      // Only the points just made change; the rest of each table stays as it was.
      const file = new URL('./testmonster.ts', import.meta.url);
      let src = fs.readFileSync(file, 'utf8');
      for (const [name, table, made] of [['HP', HP, hp], ['DAMAGE', DAMAGE, dmg]] as const) {
        const next = Object.fromEntries(ROLE_IDS.map((r) => [r, table[r].map((x) => fmt(x))]));
        for (const r of roles) levels.forEach((l, k) => { const at = LEVELS.indexOf(l as (typeof LEVELS)[number]); if (at < 0) throw new Error(`level ${l} is not one of LEVELS`); next[r][at] = made[r][k]; });
        const body = ROLE_IDS.map((r) => `  ${`${r}:`.padEnd(12)}[${next[r].join(', ')}],`).join('\n');
        const out = src.replace(new RegExp(`(export const ${name}: Record<Role, readonly number\\[\\]> = \\{\\n)[\\s\\S]*?(\\n\\};)`), `$1${body}$2`);
        if (out === src && !src.includes(body)) throw new Error(`${name} block not found in tools/testmonster.ts`);
        src = out;
      }
      fs.writeFileSync(file, src);
      console.log('written to tools/testmonster.ts');
    }
    return;
  }

  if (args.includes('--day')) {
    console.log(`Fights between rests: standard encounters in a row, mending between them, until the company must rest (${seeds} seeds; 15% a fight means six or seven).`);
    row('', levels.map((l) => `L${l}`));
    for (const r of roles.filter((x) => x !== 'boss')) {
      row(`${r} ×${ROLES[r].group}`, levels.map((l) => { let n = 0; for (let k = 1; k <= seeds; k++) n += day(l, standardEncounter(r, l), k); return (n / seeds).toFixed(1); }));
    }
    return;
  }

  console.log(`Standard encounters against a company ${under ? `${under} level${under > 1 ? 's' : ''} under them` : 'of their own level'}, ${seeds} seeds.`);
  console.log(`Cost: the share of the company's hit points and spell points gone at the end (target ${pct(TARGET)}%).`);
  console.log(`The boss is judged from ${under ? 'the same company' : 'two levels under it'}: won (target 50%).`);
  const levelOf = (r: Role, l: number): number => Math.max(1, r === 'boss' && !under ? bossFloor(l) : l - under);
  const tallies = roles.map((r) => ({ r, t: levels.map((l) => measure(levelOf(r, l), standardEncounter(r, l), seeds)) }));
  const block = (title: string, cell: (t: Tally, r: Role) => string): void => {
    console.log(`\n${title}`);
    row('', levels.map((l) => `L${l}`));
    for (const { r, t } of tallies) row(`${r} ×${ROLES[r].group}`, t.map((x) => cell(x, r)));
  };
  block('cost %  (boss: won %)', (t, r) => (r === 'boss' && !under ? pct(t.won) : pct(t.cost)));
  block('p90 cost %', (t) => pct(t.p90));
  block('rounds', (t) => t.rounds.toFixed(1));
  block('someone down at the end %', (t) => pct(t.down));
  block('won %', (t) => pct(t.won));
  if (MAX_LEVEL < Math.max(...levels)) console.log(`\nPast level ${MAX_LEVEL} the company runs on today's rules extended: no new spells, promotions or gear.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
