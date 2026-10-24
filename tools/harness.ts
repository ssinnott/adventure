// The combat test harness (docs/MONSTERS.md §4.4): a company of a given level fights encounters in a
// row from a fresh start, once per seed, and the harness says how many it managed before it had to
// rest. The yardstick is the design's: six or seven standard encounters at the company's own level
// between rests, more past level 10 as its power grows but never fifteen, where a company must rest
// once it has lost someone, once anyone is still under a quarter of their hit points after mending,
// or once it is under a quarter of its spell points. No fight runs past fifteen rounds.
//   node tools/harness.ts                              each role's standard encounter, at every level made
//   node tools/harness.ts --roles soldier,brute --levels 2,6,10 --seeds 400
//   node tools/harness.ts --under 2                    the company two levels under the monsters
//   node tools/harness.ts --map thornmark --level 5    a map's own groups, against a company of 5
//   node tools/harness.ts --stats                      the test monsters' stat lines, as markdown
//   node tools/harness.ts --abilities [--levels 19,20] Act III's trolls, wights, caller and lights on the test monsters (#537, #541),
//                                                      and Act IV's giants and drakes at 23 and 25 (#545), the mesa at 27 (#546),
//                                                      the vines at 24 and its bosses as they stand (#549), and Act V's Heart on its clock at 32 (#748), and as built (#752)
//   node tools/harness.ts --calibrate [--write]        re-derive HP and DAMAGE in tools/testmonster.ts
//   node tools/harness.ts --spell-cap 32 [...]         any of the above as if spells stopped growing elsewhere than 10
//   node tools/harness.ts --gear-grows [...]           ... or as if the company's gear kept growing past 28
//   node tools/harness.ts --level-traits [...]         ... or its fighters gained a blow a promotion (--level-bonus: a bonus)
//   node tools/harness.ts --rank-step 0.25 [...]       ... or a spell rank added another share than play's 15%
//   node tools/harness.ts --tiers [...]                ... or the company took Expert at 13 and Master at 25 (#852), and says them
//   node tools/harness.ts --bot bless,sleep,drink [...] ... or the bots, the gate's too, did any of the three (#853), and counts them
//     (from level 11 only, as the game's bot plays them, `optsFor`: what #865 weighed at 13 to 28)
//   node tools/harness.ts --company newer [...]        ... or the company were the four newer classes' (`newerCompany`)
//   node tools/harness.ts --artifacts erzhemd,akkush [...] ... or the company bore the bounds' artifacts named, or all of them (#847), and says who
// The company is the premade six, trained to the level (to the road's cap, 32), with the prestiges
// that level brings (game/party.ts), and dressed in what the item tables give it by then (GEAR). Beside
// it stands a company of the four newer classes, made the same way, which the harness suite holds to
// the line at four levels; the gate judges the premade six alone (EXPANSION §5.2). A thrifty bot plays it (see `thrifty`), where the gate's
// bot (src/game/bot.ts) spends: it mends whoever is in danger, strikes, and casts a damage spell only when the hit points
// the spell saves outweigh its spell points, each weighed by what the company has left of that pool,
// and counts a spell's element for what it has seen it do to each foe, and fire for the mending it
// stops in what it has seen mend. It aims at a leader, else a caller while its call has room, else
// a light that takes spell points, and reads the fight as it stands each turn, called groups and all.
// It wakes a sleeper or frees one held of the front row, or a caster, where it can (#549), raises
// the front row's fallen first while a foe breathes, cures nothing else and never flees. Behind
// `BotOpts` (#853), off unless `--bot` sets them and from level 11 only (`optsFor`), it blesses
// and sleeps where the cast pays, weighed as a damage spell is, lets the sleepers lie while another
// can strike (`striker`, #865), the whole company once one is past Act I (`letsLie`), and drinks
// where no spell pays and no mender can. Between fights it lifts stone and
// mends as a player would. The report and the calibration run on every core.
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import { makeRng } from '../src/lib/engine/rng.ts';
import type { RngInstance } from '../src/lib/engine/rng.ts';
import { CLASSES, defaultParty, createCharacter, createParty, className, xpForLevel, levelUp, isDown, hasCondition, lift, heal, equip, weaponOf, attackBonus, armsBonus, armorClass, bonus, statOf, hasTrait, spellHeal, rankMult, RANK_STEP, SPELLFIRE_DMG, MAX_LEVEL, PRESTIGE_LEVELS, prestigeOf, takePrestige, borne } from '../src/game/party.ts';
import type { Character, Party, ClassId, RaceId, Stats } from '../src/game/party.ts';
import { linesOf, LINES, TIER_LEVELS, TIER_NAMES, LINE_NAMES } from '../src/game/mastery.ts';
import type { Tier, Tiers } from '../src/game/mastery.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, canReach, sweptRow, asGroup, castOnAlly, castOnParty, toHit, buffHit, traitDamage, monsterAc, monsterHit, seenMult, blowsOf, songDamage, FRONT_ROW, SLUMBER_CHANCE, ROOTS_CHANCE, HOLD_BREAKS } from '../src/game/combat.ts';
import type { CombatState, MonsterInst, PartyAction, Edge, Fighters } from '../src/game/combat.ts';
import { spell, spellDice, SPELLS_GROW_TO } from '../src/game/spells.ts';
import type { SpellDef } from '../src/game/spells.ts';
import { item, hits, chargesLeft, ARTIFACT_LEVEL } from '../src/game/items.ts';
import { ITEMS } from '../src/content/index.ts';
import type { ItemDef } from '../src/game/items.ts';
import type { MonsterDef } from '../src/game/monsters.ts';
import { MAP_DEFS, MONSTERS } from '../src/content/index.ts';
import { ROLES, ROLE_IDS, LEVELS, HP, DAMAGE, xpFor, line, standardEncounter, testMonster, TROLL, WIGHT_CURSE, CALL, LIGHT, SWEEP, trollEncounter, wightEncounter, callerEncounter, lightEncounter, testGiant, giantEncounter, drakeEncounter, BASILISK_STONE, basiliskEncounter, CLOCK, clockEncounter } from './testmonster.ts';
import { areaRows, gather } from './checks.ts';
import type { Role } from './testmonster.ts';
import { wakeWith, markOf, ANSWER, breathGuard, mendLines, REST_AT, pools, mustRest, blessWith, sleepWith, drinkFor, sleeps, wakesMany, striker, optsFor, letsLie, asWritten, type BotAnswer } from '../src/game/bot.ts';
import type { BotOpts } from '../src/game/bot.ts';
import { ROUND_CAP, playOut, type Bot } from './kit/fight.ts';

// The bots' answers, the rest rule and the pools it reads are the game's (src/game/bot.ts), and found here still.
export { wakeWith, markOf, ANSWER, breathGuard, mendLines, REST_AT, pools, mustRest } from '../src/game/bot.ts';
export type { BotOpts } from '../src/game/bot.ts';

/**
 * How many standard encounters at its own level a company should manage between rests: six or seven
 * through level 10, then a fight more every four levels as its power grows, twelve at 32. Never
 * fifteen.
 */
export const fightsPerRest = (level: number): number => Math.min(14, 6.5 + Math.max(0, level - 10) / 4);
/** How far the harness will train a company: the road's cap, as play has it. */
export const CAP = MAX_LEVEL;

/**
 * What-ifs on the rules, for weighing a change before it is made; play has none of them. `spellsGrowTo`
 * is another level for damage spells to stop growing at than play's 10 (`--spell-cap`); `gearGrows` keeps the company's gear
 * growing past the ladder's top (`--gear-grows`, see `outfit`); `levelTraits` and `levelBonus` give it
 * powers past level 10 instead (`--level-traits`, `--level-bonus`, see `edgeOf`); `rankStep` is another
share a spell rank adds than play's RANK_STEP (`--rank-step`). The prestiges, their ranks and tiers 6
and 7 are play's, and every company takes them. Two more stand off unless a what-if sets them (#865):
`tiers` gives the company its Expert and Master (`--tiers`, see `tier`), and `bot` the bots' options
(`--bot`, BotOpts: the thrifty bot's in `play`, the gate's in tools/gate.ts `gateTurn`). And `company`
fields the four newer classes' company instead of the premade six (`--company newer`, see `fielded`).
And `artifacts` has it bear the bounds' artifacts named, past the ladder's top (`--artifacts`, see `bear`).
And `answer` turns the bots' answers (`ANSWER`, src/game/bot.ts), as `--abilities` does to see a fight
without one. A value of them is passed to each call that reads one, down to the fight (#946).
 */
export interface Rules { spellsGrowTo?: number; gearGrows?: boolean; levelTraits?: boolean; levelBonus?: boolean; rankStep?: number; tiers?: boolean; bot?: BotOpts; company?: 'newer'; artifacts?: readonly string[]; answer?: BotAnswer }
/** Play's rules, no what-if set: each call's own unless it is passed others. Frozen, so no suite leaves one set for the next (#946). */
export const RULES: Readonly<Rules> = Object.freeze({});
/** The what-ifs `rules` sets, by name. */
export const whatIfs = (rules: Readonly<Rules> = RULES): string[] => (Object.keys(rules) as (keyof Rules)[]).filter((k) => rules[k] !== undefined);
/** Why `--calibrate --write` refuses, while `rules` sets any what-if (a what-if is for weighing), naming them; none else. */
export const writeRefusal = (rules: Readonly<Rules> = RULES): string | undefined => (whatIfs(rules).length ? `a what-if is for weighing, not for writing: drop --write, or the what-ifs (${whatIfs(rules).join(', ')})` : undefined);

/** The classes whose first work is a weapon: the ones `--level-traits` gives more blows. */
export const FIGHTERS: readonly string[] = ['knight', 'paladin', 'ranger', 'thief', 'barbarian', 'monk'];

/**
 * The levels the what-ifs put promotions I and II at: 11, the first past Act I's 10, where Saltreach
 * brings the first, and 29, on Hearth Isle (EXPANSION.md §7).
 */
export const PROMOTIONS: readonly number[] = [11, 29];

/** The levels the prestiges come at (DESIGN.md §5): play's. */
export const PRESTIGES: readonly number[] = PRESTIGE_LEVELS;
/** How many prestiges a member of `level` has taken: one at each of PRESTIGES reached. */
export const prestigesAt = (level: number): number => PRESTIGES.filter((l) => level >= l).length;
/**
 * What the what-ifs give a member in a fight's `round`, past level 10. With `levelTraits` a fighter
 * strikes once more a turn with each promotion, and a sneak attack grows by 2 every two levels. With
 * `levelBonus` every member gains a point of damage and of armour every two levels, each where `rules`
 * sets it. Play gives none: its prestiges' perks are the resolver's own.
 */
export function edgeOf(c: Character, round: number, rules: Readonly<Rules> = RULES): Edge {
  const e: Edge = { blows: 1, damage: 0, ac: 0 }, steps = Math.floor(Math.max(0, c.level - 10) / 2);
  if (rules.levelTraits) {
    if (FIGHTERS.includes(c.cls)) e.blows += PROMOTIONS.filter((l) => c.level >= l).length;
    if (hasTrait(c, 'sneak_attack') && round === 1) e.damage += 2 * steps;
  }
  if (rules.levelBonus) { e.damage += steps; e.ac += steps; }
  return e;
}

/** A ladder's rows: by a level, the items a company has by then. */
type Rungs = readonly (readonly [number, readonly string[]])[];
/** The areas' rungs (`AreaChecks.gear`), in road order. */
const RUNGS = areaRows((c) => c.gear).map(([at, ids]) => [Number(at), ids] as const);
/** What a company wears (a weapon, armour or a shield), as against what it carries in its bag. */
const worn = (id: string): boolean => (ITEMS[id]?.slot ?? 'weapon') !== 'none';
/** The areas' rungs of one kind, worn or carried, in the order of their levels. */
const ladder = (wear: boolean): Rungs =>
  RUNGS.map(([at, ids]) => [at, ids.filter((id) => worn(id) === wear)] as const).filter(([, ids]) => ids.length).sort((a, b) => a[0] - b[0]);

/**
 * The ladder: what a company has in its hands by a level (EXPANSION.md §5.2). Its kit, then by 3
 * the band's gear from Mottram's and the kits' weapons with a plus from the Downs' first boxes, by
 * 5 the kits' armour with a plus and the Downs' last finds, then Thornmark's armoury from 8, where
 * plate is dear, its chests' gear with a plus by 9 and the Deepthorn's +2s by 10. Past them, Act II's
 * (#399): Saltmouth's armourer's step from 11, the same with a plus from Saltreach's and Wrackholm's
 * boxes by 13, Lantern Watch's stores from 14 and theirs with a plus from the Sunder by 16. Then
 * Act III's (#535): Anvilhall's forge from 17, the same with a plus from the Kilns' and Cairnmoor's
 * boxes by 19, Rime Lodge's furrier from 21 and theirs with a plus from Rimewater by 22. Then Act
 * IV's one (#542): Cinderport's armourer from 25. And Act V's, the last (#746): the Hand's steel from
 * 28, found on Hearth Isle and never sold, each piece a point past the armourer's. Each member takes
 * the best its class can use of the kind it already carries, which flatters the company a little
 * (the Old Lantern's Staff is one staff, and every member it is the best for takes it). The
 * harness and the gate check both dress their company from it. Each rung is held by an area in
 * its checks.ts (`AreaChecks.gear`), the last on the road whose items it holds (#968); a level given
 * on two areas is refused (`RUNGS_TWICE`). Each member dresses from it (`outfit`).
 */
export const GEAR: Rungs = ladder(true);
/** The ladder's top: past it, gear grows only in a what-if (`Rules.gearGrows`). */
export const GEAR_TOP = GEAR[GEAR.length - 1][0];

/** The ids `forge` has put in the item table, for `unforge` to take out. */
const forged: string[] = [];

/** A copy of an item with more to it, for a what-if: kept in the item table under its own id until `unforge`. */
function forge(base: ItemDef, more: { bonus?: number; ac?: number; hit?: number }, plus: number): string {
  const id = `${base.id}+${plus}${more.hit ? `^${more.hit}` : ''}`;
  if (!ITEMS[id]) {
    const copy: ItemDef = { ...base, id, name: `${base.name} +${plus}` };
    if (more.bonus !== undefined) copy.bonus = (base.bonus ?? 0) + more.bonus;
    if (more.ac !== undefined) copy.ac = (base.ac ?? 0) + more.ac;
    if (more.hit !== undefined) copy.plus = (base.plus ?? 0) + more.hit;
    // The item table is read-only by type (#945): `forge` and `unforge` write it by this cast, as `withDefs` does.
    (ITEMS as Record<string, ItemDef>)[id] = copy;
    forged.push(id);
  }
  return id;
}

/**
 * Takes every copy `forge` made out of the item table again, and the companies kept that were dressed
 * in them (made under `gearGrows`), so a what-if's gear is left behind nowhere (#946).
 */
export function unforge(): void {
  // Read-only by type: taken out by the cast `forge` put them in by (#945).
  for (const id of forged.splice(0)) delete (ITEMS as Record<string, ItemDef>)[id];
  for (const key of [...companies.keys()]) if (/^(newer:)?\d+:\d+:gear/.test(key)) companies.delete(key);
}

/**
 * Dresses a member in the best of GEAR it can use by `level`. With `rules.gearGrows`, past the
 * ladder's top its weapon and armour are enchanted as the curve's gear would be: the weapon's blow
 * grows as the line's hit points do, and the armour a point every two levels, as the line's to-hit does.
 */
export function outfit(c: Character, level: number, rules: Readonly<Rules> = RULES): void {
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
  if (rules.gearGrows && level > GEAR_TOP) {
    const held = weaponOf(c), blow = Math.round(hits(held) * (line(level).hp / line(GEAR_TOP).hp - 1));
    if (blow > 0) equip(c, forge(held, { bonus: blow }, blow));
    const worn = c.equipment.armor ? item(c.equipment.armor) : null, ac = Math.floor((level - GEAR_TOP) / 2);
    if (worn && ac > 0) equip(c, forge(worn, { ac }, ac));
  }
}

/**
 * The weapon a class's prestige blows want where the ladder's best by its blow is another (combat.ts
 * `blowsOf`), and the kit's own of that kind: the thief's light blade, and the monk's staff (#854), the
 * one of the four newer classes whose blows ask a kind. The ranger's bow is the one it holds.
 */
const BLOWS_WANT: Partial<Record<ClassId, { kind: string; kit: readonly string[] }>> = { thief: { kind: 'light', kit: ['dagger', 'shortsword', 'sling'] }, monk: { kind: 'staff', kit: ['staff'] } };

/**
 * The prestiges a company of its level takes (DESIGN.md §5), as play gives them: each at its level,
 * with its hit points, spell points and perks (game/party.ts, the resolver). The thief takes a light
 * weapon, and the monk a staff, where its blows with it beat one with what it holds (BLOWS_WANT). A
 * caster's and a hybrid's prestiges are its spell ranks, as play reads them (party.ts `rankMult`).
 */
function prestige(p: Party): void {
  for (const c of p.members) {
    for (let n = prestigesAt(c.level); prestigeOf(c) < n;) takePrestige(c);
    const want = BLOWS_WANT[c.cls];
    if (want && prestigeOf(c)) {
      const held = weaponOf(c), best = GEAR.filter(([at]) => at <= c.level).flatMap(([, ids]) => ids).concat(want.kit).map(item)
        .filter((d) => d.kind === want.kind && !!d.ranged === !!held.ranged && (!d.classes || d.classes.includes(c.cls))).sort((a, b) => hits(b) - hits(a))[0];
      if (best && blowsOf({ ...c, equipment: { ...c.equipment, weapon: best.id } }) * hits(best) > blowsOf(c) * hits(held)) equip(c, best.id);
    }
  }
}

/**
 * The tiers a company of its level holds where `rules.tiers` asks (#852; off unless `--tiers`,
 * #865): on each line
 * its class takes (`linesOf`: a fighter's arms, a caster's magic, a hybrid's both), Expert from 13 and
 * Master from 25 (`TIER_LEVELS`), as a company that took each when it could. After the prestiges, as
 * play teaches them; what a tier does is the resolver's (party.ts `armsBonus`, `rankMult`).
 */
function tier(p: Party): void {
  for (const c of p.members) {
    const t: Tier | undefined = c.level >= TIER_LEVELS.master ? 'master' : c.level >= TIER_LEVELS.expert ? 'expert' : undefined;
    if (!t) continue;
    const tiers: Tiers = {};
    for (const line of linesOf(c.cls)) tiers[line] = t;
    c.tiers = tiers;
  }
}

/** The artifacts in the item tables (`ItemDef.artifact`, #847): one of each in the world, on no rung of the ladder. */
export const artifactIds = (): string[] => Object.values(ITEMS).filter((d) => d.artifact).map((d) => d.id);

/**
 * The artifacts a company bears where `rules.artifacts` asks (#847; off unless `--artifacts`): each,
 * one in the world, by the first member in the company's order who may bear it, as `outfit` would
 * dress them (a weapon of the reach they hold, or of the other where none who may bear it holds that
 * reach; a two-hander puts a shield in the pack, but never an artifact's) and with no artifact in its
 * slot already. After the ladder, the prestiges and the tiers; the gate's company stays the plain
 * one (#891).
 */
function bear(p: Party, ids: readonly string[]): void {
  for (const id of ids) {
    const d = item(id), mine = (c: Character): boolean => d.slot !== 'none' && !!c.equipment[d.slot] && !!item(c.equipment[d.slot]!).artifact;
    const may = (m: Character): boolean => (!d.classes || d.classes.includes(m.cls)) && !mine(m) && (d.slot !== 'shield' || !weaponOf(m).twoHanded)
      && !(d.twoHanded && m.equipment.shield && item(m.equipment.shield).artifact);
    // A weapon of the reach they hold where anyone may bear it so, else of the other: its power is borne from either row.
    const c = p.members.find((m) => may(m) && (d.slot !== 'weapon' || !!d.ranged === !!weaponOf(m).ranged)) ?? p.members.find(may);
    if (!c) continue;
    if (d.slot === 'none') c.pack.push(id); else equip(c, id);
  }
}

/**
 * A company trained to `level` on `rng`, as every company the harness plays is: each member trained
 * and dressed by the ladder (`outfit`), the bag's kit (`KIT`), the prestiges (`prestige`) and, where
 * `rules.tiers` asks, the tiers (`tier`), and where `rules.artifacts` does, the artifacts (`bear`); then whole.
 */
function train(p: Party, level: number, rng: RngInstance, rules: Readonly<Rules>): Party {
  for (const c of p.members) { c.xp = xpForLevel(level); levelUp(c, rng); outfit(c, level, rules); }
  p.bag.push(...KIT.filter(([at]) => at <= level).flatMap(([, ids]) => ids));
  prestige(p);
  if (rules.tiers) tier(p);
  if (rules.artifacts) bear(p, rules.artifacts);
  for (const c of p.members) { c.hp = c.maxHp; c.sp = c.maxSp; }
  return p;
}

const companies = new Map<string, Party>();
/** A company's key in the cache: its kind, its level, its seed and the what-ifs of `rules` that make it otherwise. */
const keyOf = (kind: string, level: number, seed: number, rules: Readonly<Rules>): string => `${kind}${level}:${seed}:${rules.gearGrows ? 'gear' : ''}${rules.tiers ? ':tiers' : ''}${rules.artifacts ? `:${rules.artifacts.join('+')}` : ''}`;
/**
 * The premade six trained to `level`, outfitted for it and with the prestiges it brings, whole, under
 * the what-ifs `rules`; a fresh copy every call. The gate's company is this one (tools/gate.ts `gateCompany`).
 */
export function companyAt(level: number, seed: number, rules: Readonly<Rules> = RULES): Party {
  const key = keyOf('', level, seed, rules);
  let p = companies.get(key);
  if (!p) {
    const rng = makeRng(seed);
    p = train(defaultParty(rng), level, rng, rules);
    companies.set(key, p);
  }
  return structuredClone(p);
}

/**
 * The four newer classes' company (#854): a barbarian, a monk and a paladin in front; a bard, a
 * druid and a sorcerer behind. Each of the four takes a premade member's place and raises, on its own
 * class's stats and of a people that suits it (the barbarian Bram's, the monk Wren's, the bard
 * Ottilie's, the druid Maren's); the paladin and the sorcerer are the premade's Idris and Cassian, so
 * the two companies differ by the four alone.
 */
export const NEWER: readonly (readonly [name: string, race: RaceId, cls: ClassId, raised: Partial<Stats>])[] = [
  ['Rook', 'dwarf', 'barbarian', { might: 15, endurance: 14, accuracy: 12 }],
  ['Hollis', 'tidefolk', 'monk', { accuracy: 14, speed: 13, might: 11 }],
  ['Idris', 'orcblood', 'paladin', { might: 13, personality: 13, endurance: 12 }],
  ['Aveline', 'gnome', 'bard', { personality: 15, speed: 13, accuracy: 12 }],
  ['Sable', 'human', 'druid', { personality: 15, endurance: 12 }],
  ['Cassian', 'human', 'sorcerer', { intellect: 16, luck: 11, speed: 11 }],
];

/**
 * NEWER trained to `level` as `companyAt`'s six are (`train`): dressed, prestiged and, where
 * `rules.tiers` asks, tiered; a fresh copy every call. The harness suite holds it to the line at
 * four levels (EXPANSION §5.2); the gate judges the premade six alone.
 */
export function newerCompany(level: number, seed: number, rules: Readonly<Rules> = RULES): Party {
  const key = keyOf('newer:', level, seed, rules);
  let p = companies.get(key);
  if (!p) {
    const rng = makeRng(seed);
    p = train(createParty(NEWER.map(([name, race, cls, raised]) => createCharacter(name, race, cls, raised, rng))), level, rng, rules);
    companies.set(key, p);
  }
  return structuredClone(p);
}

/** The company the harness fields: the premade six (`companyAt`), or the newer six where `rules.company` asks (`newerCompany`). */
export const fielded = (level: number, seed: number, rules: Readonly<Rules> = RULES): Party => (rules.company === 'newer' ? newerCompany(level, seed, rules) : companyAt(level, seed, rules));

/** An artifact's spell's mean on one foe (#847): rolled at the level held at ARTIFACT_LEVEL, with no rank or trait. */
const heldDamage = (c: Character, sp: SpellDef, rules: Readonly<Rules>): number => (spellDice(sp, Math.min(c.level, ARTIFACT_LEVEL), rules.spellsGrowTo) * ((sp.sides ?? 4) + 1)) / 2;
const spellDamage = (c: Character, sp: SpellDef, rules: Readonly<Rules>): number =>
  ((spellDice(sp, c.level, rules.spellsGrowTo) * ((sp.sides ?? 4) + 1)) / 2) * rankMult(c, rules.rankStep) + (hasTrait(c, 'spellfire') ? SPELLFIRE_DMG : 0);

/** A turn's weapon blows' expected damage on a monster; `capped` counts no more than the monster has left. */
function weaponDamage(s: CombatState, p: Party, c: Character, m: MonsterInst, rules: Readonly<Rules>, capped = true): number {
  const w = weaponOf(c), e = edgeOf(c, s.round, rules), at = p.members.indexOf(c);
  const chance = toHit(attackBonus(c) + buffHit(s, p, at) - (w.ranged && !(c.cls === 'ranger' && prestigeOf(c) >= 2) ? s.rangedPenalty : 0), monsterAc(s, m));
  const blow = Math.max(0, hits(w) + (w.ranged ? 0 : bonus(statOf(c, 'might'))) + traitDamage(s, c, w, m) + armsBonus(c) + songDamage(p) + e.damage);
  return (blowsOf(c) + e.blows - 1) * chance * (capped ? Math.min(m.hp, blow) : blow);
}

/** What the monsters still standing deal the company in a round, on average: all of them, or those of `only`. */
function incoming(s: CombatState, p: Party, rules: Readonly<Rules>, only?: readonly number[]): number {
  const up = p.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c)), front = up.filter(({ i }) => i < FRONT_ROW);
  let total = 0;
  for (const f of only ?? aliveMonsters(s)) {
    const d = s.monsters[f].def, reach = d.ranged || !front.length ? up : front;
    if (!reach.length) continue;
    const ac = reach.reduce((a, { c }) => a + armorClass(c) + edgeOf(c, s.round, rules).ac, 0) / reach.length;
    // A sweeper's turn is, at its chance, a blow at each of the row it would take.
    const many = d.sweep ? 1 + d.sweep.chance * (sweptRow(p, s.monsters[f]).length - 1) : 1;
    total += toHit(monsterHit(s, s.monsters[f]), ac) * Math.max(0, (d.dice * (d.sides + 1)) / 2 + d.bonus) * many;
  }
  return total;
}

/** What a caster's spell point is worth in hit points: what its best mend gives for one, or one if it has none. */
function mendRate(c: Character, rules: Readonly<Rules>): number {
  let best = 1;
  for (const x of c.spells.map(spell)) if (x.heal && x.target === 'ally' && !x.raise) best = Math.max(best, spellHeal(c, x.heal, rules.rankStep) / x.sp);
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
  const known = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
  // The artifacts' spells it bears with a charge left (#847): weighed as its own, at no cost in points.
  const charged = borne(c).filter((id) => item(id).casts && chargesLeft(p, id) > 0).map((from) => ({ from, x: spell(item(from).casts!.spell) }));
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
    const pick = mends.filter((x) => spellHeal(c, x.heal ?? 0, rules.rankStep) >= wound / 2).sort((a, b) => a.sp - b.sp)[0] ?? mends.sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
    if (partyAct(s, p, rng, { type: 'cast', spellId: pick.id, target: worst.j })) return;
  }
  const sleeper = wakeWith(p, c, answer);
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
  const armed = canAttackFromRow(c, i), blow = armed ? weaponDamage(s, p, c, s.monsters[weakest], rules) : 0;
  const weapons = p.members.reduce((a, m, j) => a + (!isDown(m) && canAttackFromRow(m, j) ? weaponDamage(s, p, m, s.monsters[weakest], rules, false) : 0), 0);
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
    const more = p.members.reduce((a, m, j) => a + (!isDown(m) && canAttackFromRow(m, j) ? weaponDamage(runs, p, m, target, rules, false) - weaponDamage(s, p, m, target, rules, false) : 0), 0);
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
  const rng = makeRng(seed), s = startCombat(p, [asGroup('harness', monsters)], rng, { spellsGrowTo: rules.spellsGrowTo, rankStep: rules.rankStep, edge });
  return playOut(s, p, rng, bot, rules, ROUND_CAP);
}

/** How often the bots took each of their options (#853) in fights: the share of the fights in which one blessed, slept a group or drank. */
export interface Casts { bless: number; sleep: number; drink: number }
/**
 * Seeds `from` to `from + seeds - 1` of one fight from fresh, as `measure` fights them: the share in
 * which a member cast Bless, Slumber or Grasping Roots, or drank or gave a draught, read from the log.
 */
export function casting(level: number, monsters: Encounter, seeds: number, from = 1, rules: Readonly<Rules> = RULES): Casts {
  const bless = ` casts ${spell('bless').name}. `, sleep = [spell('sleep').name, spell('roots').name].map((n) => [` casts ${n}: `, ` casts ${n}, `]).flat();
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
 * What the company carries beside its gear, by a level: from 25 a Quickening Draught, the stone cure
 * Cinderport's chandler sells by the ladder's step (#546), for a glassed member no one standing can
 * absolve: what the areas' rungs carry rather than wear. tools/tests/ladder.ts holds it to the band's
 * window.
 */
export const KIT: Rungs = ladder(false);
/** The levels whose rung is given on two areas: tools/tests/ladder.ts refuses them. */
export const RUNGS_TWICE: readonly string[] = gather(RUNGS.map(([at, ids]) => [`${at}`, ids] as const)).twice;

/**
 * Between fights, stone first (#546): each member turned to glass is lifted by Absolve where a member
 * standing knows it and has the points, else by a draught the company carries, the bag's before a
 * pack's. One with neither waits for a temple, and the company must rest (`mustRest`).
 */
export function unstone(p: Party, rules: Readonly<Rules> = RULES): void {
  const absolve = spell('absolve'), cures = (id: string): boolean => !!item(id).use?.cure?.includes('stoned');
  for (const m of p.members.filter((x) => hasCondition(x, 'stoned'))) {
    const caster = p.members.find((c) => !isDown(c) && c.spells.includes(absolve.id) && c.sp >= absolve.sp);
    if (caster) { caster.sp -= absolve.sp; castOnAlly(caster, absolve, m, rules.rankStep); continue; }
    const holder = [p.bag, ...p.members.map((c) => c.pack)].find((h) => h.some(cures)), id = holder?.find(cures);
    if (holder && id) { holder.splice(holder.indexOf(id), 1); lift(m, item(id).use?.cure ?? []); }
  }
}

/** Between fights, the company lifts stone (`unstone`), then mends itself as a player would, while it has the spell points to, under the what-ifs `rules`. */
export function mendBetween(p: Party, rules: Readonly<Rules> = RULES): void {
  unstone(p, rules);
  for (let guard = 0; guard < 60; guard++) {
    const hurt = p.members.filter((m) => !hasCondition(m, 'dead') && !hasCondition(m, 'stoned') && m.hp < m.maxHp / 2).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
    if (!hurt.length) return;
    const healers = p.members.filter((c) => !isDown(c)).map((c) => ({ c, known: c.spells.map(spell).filter((x) => x.context === 'any' && x.heal && !x.raise && x.sp <= c.sp) }));
    const all = healers.flatMap(({ c, known }) => known.filter((x) => x.target === 'party').map((x) => ({ c, x }))).sort((a, b) => a.x.sp - b.x.sp)[0];
    const one = healers.flatMap(({ c, known }) => known.filter((x) => x.target === 'ally').map((x) => ({ c, x }))).sort((a, b) => a.x.sp - b.x.sp)[0];
    if (all && hurt.length >= 2) { all.c.sp -= all.x.sp; castOnParty(all.c, all.x, p, rules.rankStep); }
    else if (one) { one.c.sp -= one.x.sp; castOnAlly(one.c, one.x, hurt[0], rules.rankStep); }
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

// ---- every core ------------------------------------------------------------------------------

/** A job for a worker; its what-ifs travel in it, as `rules`. */
interface Job { kind: 'calibrate' | 'refit' | 'cell'; role: Role; level: number; seeds: number; under: number; hp?: number; rules: Readonly<Rules> }
const work = (j: Job): Point | Cell =>
  j.kind === 'calibrate' ? calibrate(j.role, j.level, j.seeds, j.rules) : j.kind === 'refit' ? refit(j.role, j.level, j.hp ?? 1, j.seeds, j.rules) : cell(j.role, j.level, j.seeds, j.under, j.rules);

/**
 * The jobs on a worker per core, each taking the next as it finishes one; the results in the jobs' order.
 * A worker that throws, or stops with a job unfinished, fails the lot, and so does a job that runs past
 * `limit` milliseconds: every worker is stopped then, so a run never hangs on one.
 */
function onCores<T>(jobs: readonly Job[], each?: (j: Job, r: T) => void, limit = Infinity): Promise<T[]> {
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

if (!isMainThread) parentPort?.on('message', (j: Job) => { parentPort?.postMessage(work(j)); });

// ---- the command line ------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
  const seeds = Number(opt('seeds') ?? 200);
  const levels = (opt('levels')?.split(',').map(Number) ?? [...LEVELS]);
  const roles = (opt('roles')?.split(',') ?? ROLE_IDS) as Role[];
  const under = Number(opt('under') ?? 0);
  const pct = (x: number): string => `${Math.round(x * 100)}`;
  // The what-ifs the flags ask, passed to each call that reads one (#946).
  const rules: Rules = {};
  const cap = opt('spell-cap');
  if (cap !== undefined) {
    rules.spellsGrowTo = Number(cap);
    if (!(rules.spellsGrowTo >= 1)) throw new Error('--spell-cap takes the level damage spells stop growing at');
    console.log(`What if: damage spells stop growing at level ${rules.spellsGrowTo}, not ${SPELLS_GROW_TO}.`);
  }
  if (args.includes('--gear-grows')) {
    rules.gearGrows = true;
    console.log(`What if: past level ${GEAR_TOP}, the ladder's top, the company's weapons hit harder as the line's hit points grow, and its armour gains a point every two levels.`);
  }
  if (args.includes('--level-traits')) {
    rules.levelTraits = true;
    console.log(`What if: fighters strike once more a turn with each promotion, at ${PROMOTIONS.join(' and ')}, and past level 10 sneak attacks grow 2 every two levels.`);
  }
  if (args.includes('--level-bonus')) {
    rules.levelBonus = true;
    console.log(`What if: past level 10 every member gains a point of weapon damage and of armour every two levels.`);
  }
  const step = opt('rank-step');
  if (step !== undefined) {
    rules.rankStep = Number(step);
    if (!(rules.rankStep >= 0)) throw new Error('--rank-step takes a share, 0 or more');
    console.log(`What if: each spell rank adds ${pct(rules.rankStep)}% to a spell's damage and mending, not ${pct(RANK_STEP)}%.`);
  }
  const and = (xs: readonly string[]): string => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs.join(''));
  if (args.includes('--tiers')) {
    rules.tiers = true;
    console.log(`What if: the company takes Expert at ${TIER_LEVELS.expert} and Master at ${TIER_LEVELS.master} (#852), its fighters at arms, its casters in magic and its hybrids both.`);
  }
  const bots = opt('bot');
  if (bots !== undefined) {
    const asked = bots.split(','), known: readonly string[] = ['bless', 'sleep', 'drink'];
    if (asked.some((x) => !known.includes(x))) throw new Error('--bot takes bless, sleep and drink, any of them, with commas between');
    rules.bot = Object.fromEntries(asked.map((x) => [x, true]));
    console.log(`What if: the bots, the gate's too, also ${and(known.filter((x) => asked.includes(x)))} (#853).`);
  }
  const fields = opt('company');
  if (fields !== undefined) {
    if (fields !== 'newer') throw new Error("--company takes newer, the four newer classes' company; the premade six are the default");
    rules.company = fields;
    const who = NEWER.map(([name, , cls]) => `${name} the ${CLASSES[cls].name.toLowerCase()}`);
    console.log(`What if: the company is the four newer classes': ${and(who.slice(0, FRONT_ROW))} in front, ${and(who.slice(FRONT_ROW))} behind.`);
  }
  const bears = opt('artifacts');
  if (bears !== undefined) {
    const all = artifactIds(), asked = bears === 'all' ? all : bears.split(',');
    if (!asked.length || asked.some((x) => !all.includes(x)) || new Set(asked).size < asked.length) throw new Error(`--artifacts takes all, or the artifacts' ids, each once, with commas between: ${all.join(', ')}`);
    rules.artifacts = asked;
    console.log(`What if: the company bears ${and(asked.map((x) => item(x).name.replace(/^The /, 'the ')))}, each by the first member who may (#847), found past the ladder's top and on no rung of it.`);
  }
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
      const d = days(level, [g], seeds, 1, false, rules), t = measure(level, g, seeds, 1, thrifty, rules);
      console.log(g.id.padEnd(20) + d.fights.toFixed(1).padStart(7) + `${pct(t.cost)}%`.padStart(6) + `${pct(t.won)}%`.padStart(6) + t.rounds.toFixed(1).padStart(8) + '  ' + g.monsters.join(' '));
    }
    const all = days(level, def.encounters, seeds, 1, true, rules);
    const why = (Object.entries(all.why) as [Why, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([w, n]) => `${{ lost: 'a lost fight', long: 'a fight broken off', dead: 'a death', hp: 'hit points', sp: 'spell points', none: 'none' }[w]} ${pct(n)}%`);
    console.log(`\nIts groups in a new order each seed: ${all.fights.toFixed(1)} fights before a rest, against ${fightsPerRest(level)} at the company's own level. What ended the day: ${why.join(', ')}.`);
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

  if (args.includes('--abilities')) {
    // Act III's abilities on the test monsters (docs/MONSTERS.md §3.3, #537, #541): the figures their sizes were decided on.
    const at = opt('levels') ? levels : [19, 20];
    const forget = (keep: (sp: SpellDef) => boolean) => (p: Party): Party => { for (const c of p.members) c.spells = c.spells.filter((id) => keep(spell(id))); return p; };
    const fireless = forget((x) => x.element !== 'fire'), unarmed = forget((x) => !x.dice);
    /** Seeds of one fight from fresh, as `measure` fights them, each fight's end kept to read; `how` the what-ifs, an answer turned among them. */
    const fights = (level: number, enc: Encounter, dress = (p: Party): Party => p, how: Readonly<Rules> = rules): { s: CombatState; p: Party; o: Outcome }[] => Array.from({ length: seeds }, (_, n) => {
      const p = dress(fielded(level, n + 1, how)), s = play(p, enc, (n + 1) * 7919 + 13, thrifty, how);
      return { s, p, o: outcomeOf(s, p) };
    });
    /** The fights before a rest, `days` under the what-ifs, or `how`. */
    const toRest = (level: number, enc: Encounter, how: Readonly<Rules> = rules): number => days(level, [enc], seeds, 1, false, how).fights;
    /** The what-ifs with one of the bots' answers turned (`ANSWER`). */
    const turned = (answer: Partial<BotAnswer>): Rules => ({ ...rules, answer: { ...ANSWER, ...answer } });
    const mean = (fs: { o: Outcome }[], f: (o: Outcome) => number): number => fs.reduce((t, x) => t + f(x.o), 0) / fs.length;
    const one = (fs: { o: Outcome }[]): string => `${mean(fs, (o) => o.rounds).toFixed(1)} rounds, ${pct(mean(fs, (o) => o.cost))}%, won ${pct(mean(fs, (o) => (o.won ? 1 : 0)))}%`;
    const rest = (level: number, enc: Encounter, beside?: [string, Encounter]): string => `${toRest(level, enc).toFixed(1)} to a rest (${beside ? `${beside[0]} ${toRest(level, beside[1]).toFixed(1)}, ` : ''}${fightsPerRest(level)} asked)`;
    console.log(`Act III's abilities on the test monsters, ${seeds} seeds: one fight from fresh (its rounds, its cost, won) and fights before a rest.`);
    console.log(`Two trolls: the test brute on ${TROLL.hp} of its hit points, mending ${TROLL.regen} of them a round but a round fire struck it.`);
    for (const l of at) {
      const brute = testMonster('brute', l), whole: MonsterDef = { ...brute, regen: Math.round(brute.hp * TROLL.regen) }, enc = trollEncounter(l);
      console.log(`  ${l}: with fire ${one(fights(l, enc))}, ${rest(l, enc, ['plain brutes', standardEncounter('brute', l)])}; with none ${one(fights(l, enc, fireless))}; weapons alone ${one(fights(l, enc, unarmed))}; weapons alone on a brute's whole hit points ${one(fights(l, [whole, whole], unarmed))}`);
    }
    console.log(`Four wights: the test controller, its hold a curse at ${WIGHT_CURSE} a hit.`);
    for (const l of at) {
      const fs = fights(l, wightEncounter(l)), cursed = fs.filter(({ p }) => p.members.some((m) => hasCondition(m, 'cursed'))).length;
      console.log(`  ${l}: ${one(fs)}, ${cursed} of ${seeds} leaving someone cursed; ${rest(l, wightEncounter(l))}`);
    }
    console.log(`A caller beside six fodder: the test soldier, calling ${CALL.monsters} of the test fodder at ${CALL.chance} a turn.`);
    for (const l of at) {
      const fs = fights(l, callerEncounter(l)), mute = callerEncounter(l).map((m) => (m.calls ? { ...m, calls: undefined } : m));
      console.log(`  ${l}: ${one(fs)}, the fight holding ${(fs.reduce((t, { s }) => t + s.monsters.length, 0) / seeds).toFixed(1)} monsters; ${rest(l, callerEncounter(l))}, and ${toRest(l, mute).toFixed(1)} with no call`);
    }
    console.log(`Three lights and a hound: the test controller come down whole to ${LIGHT.share} of its line, flying, its touch taking spell points where it held, beside the test skirmisher (#541).`);
    for (const l of at) {
      const enc = lightEncounter(l), fs = fights(l, enc), houndFirst = { monsters: enc, leader: enc[enc.length - 1].id };
      const plain = [...Array.from({ length: 3 }, () => testMonster('controller', l)), testMonster('skirmisher', l)];
      const whole = enc.map((m): MonsterDef => (m.drain ? { ...testMonster('controller', l), id: m.id, kind: m.kind, ranged: true, drain: m.drain, inflict: undefined } : m));
      console.log(`  ${l}: ${one(fs)}, its spell points ${pct(mean(fs, (o) => o.sp))}% spent or taken (${pct(mean(fights(l, houndFirst), (o) => o.sp))}% with the hound marked first); ${rest(l, enc, ['the hound marked first', houndFirst])}; ${toRest(l, plain).toFixed(1)} for three test controllers and the hound, and ${toRest(l, whole).toFixed(1)} for lights on the controller's whole line`);
    }
    // Act IV's sweep (#545), where the road first meets it: the giants at 23, the drakes at 25.
    console.log(`Two giants and two drakes: the test brute come down whole to ${SWEEP.share} of its line, its arm sweeping the front row or its breath burning a row with fire at ${SWEEP.chance} a turn.`);
    const felled = (fs: { s: CombatState }[]): number => fs.filter(({ s }) => s.log.some((l) => / (sweeps|breathes) /.test(l) && /falls?!$/.test(l))).length;
    for (const l of opt('levels') ? levels : [23, 25]) {
      const g = testGiant(l), front = fielded(l, 1, rules).members.slice(0, FRONT_ROW).map((m) => m.maxHp), heavy = [testGiant(l, 2), testGiant(l, 2)];
      const answered = felled(fights(l, heavy)), bare = felled(fights(l, heavy, undefined, turned({ sweep: false })));
      console.log(`  ${l}: giants ${one(fights(l, giantEncounter(l)))}, ${rest(l, giantEncounter(l), ['plain brutes', standardEncounter('brute', l)])}; drakes ${one(fights(l, drakeEncounter(l)))}, ${rest(l, drakeEncounter(l))}; a sweep at its worst ${g.dice * g.sides + g.bonus} to each of a front row of ${front.join(', ')}; giants of twice the blow fell one of a row in ${answered} of ${seeds} fights, ${bare} with no answer`);
    }
    // Act IV's stone (#546), where the road first meets it: the mesas at 27.
    console.log(`The mesa: the test controller, its hold a stone at ${BASILISK_STONE} a hit and its gaze reaching the back row, behind three of the test skirmisher.`);
    const glassed = (fs: { p: Party }[]): number => fs.filter(({ p }) => p.members.some((m) => hasCondition(m, 'stoned'))).length;
    const uncured = (p: Party): Party => { forget((x) => x.id !== 'absolve')(p); p.bag = p.bag.filter((id) => !item(id).use?.cure?.includes('stoned')); return p; };
    for (const l of opt('levels') ? levels : [27]) {
      const enc = basiliskEncounter(l), held = enc.map((m): MonsterDef => (m.inflict?.cond === 'stoned' ? { ...m, inflict: { cond: 'paralysed', chance: BASILISK_STONE } } : m));
      const fs = fights(l, enc), cureless = Array.from({ length: seeds }, (_, n) => day(l, [enc], n + 1, 30, uncured, rules)).reduce((t, d) => t + d.fights, 0) / seeds;
      console.log(`  ${l}: ${one(fs)}, ${glassed(fs)} of ${seeds} leaving someone glassed; ${rest(l, enc, ['its hold a paralysis', held])}, and ${cureless.toFixed(1)} with neither Absolve nor a draught`);
    }
    // Act V's clock (#748), where the road meets it: the Heart at 32, the company killing the Hands
    // first, going for the lord, or fighting what the clock calls as it comes.
    console.log(`The Heart: the test boss leading three of the test elite at a clock's panel, calling the test soldier, a machine that obeys, every ${CLOCK.every} rounds while one of them stands.`);
    for (const l of opt('levels') ? levels : [32]) {
      const plays = (['panel', 'leader', 'called'] as const).map((k) => {
        const fs = fights(l, clockEncounter(l), undefined, turned({ clock: k })), come = fs.reduce((t, { s }) => t + s.monsters.length - 4, 0) / seeds, dark = fs.reduce((t, { s }) => t + (s.clock?.dim ?? 0), 0) / seeds;
        return `${{ panel: 'the Hands first', leader: 'the lord first', called: 'the sentries as they come' }[k]} ${one(fs)}, ${come.toFixed(1)} sentries called, the light ${dark.toFixed(1)} of ${CLOCK.dims} steps down`;
      });
      console.log(`  ${l}: ${plays.join('; ')}`);
    }
    // And the Heart as built (#759): Vask, his three Hands at the panel and his sentries, on the gate's bot,
    // which the plan sizes him by (#752); the gate judges the Hands first on its own (tools/tests/gate.ts).
    const heart = MAP_DEFS.find((d) => d.id === 'core')?.encounters?.find((e) => e.id === 'core_vask');
    if (heart) {
      const { winRate, gateOpts } = await import('./gate.ts');
      const won = (enc: Encounter, clock: BotAnswer['clock'] = 'panel'): string => `${pct(winRate(32, enc, seeds, ROUND_CAP, gateOpts(heart), turned({ clock })))}%`;
      const plays = (['panel', 'leader', 'called'] as const).map((k) => `${{ panel: 'the Hands first', leader: 'Vask first', called: 'the sentries as they come' }[k]} ${won(heart, k)}`);
      console.log(`  Vask's own group at 32, won: ${plays.join(', ')}, and ${won({ ...heart, clock: undefined })} with no clock`);
    }
    // Act IV's holds (#549): the bells, the vines and the machines' clamps, which the bots free.
    console.log(`Four vines: the test controller, its hold at 0.3 a hit as the Strangler Vine's, the held freed by the bots' cure (#549).`);
    for (const l of opt('levels') ? levels : [24]) {
      const vines = Array.from({ length: 4 }, (): MonsterDef => ({ ...testMonster('controller', l), inflict: { cond: 'paralysed', chance: 0.3 } }));
      const freed = one(fights(l, vines)), plain = toRest(l, standardEncounter('controller', l)), held = turned({ hold: false });
      const left = one(fights(l, vines, undefined, held)), plainLeft = toRest(l, standardEncounter('controller', l), held);
      console.log(`  ${l}: freed ${freed}, ${rest(l, vines)}; left ${left}; four test controllers ${plain.toFixed(1)} to a rest freed, ${plainLeft.toFixed(1)} left`);
    }
    // Act IV's bosses as they stand, the large dungeons' among them (#549): each from two under, beside the test boss of its level.
    console.log(`Act IV's bosses, alone, won from two under (the test boss of its level beside it):`);
    for (const m of Object.values(MONSTERS).filter((x) => x.level >= 23 && x.level <= 28 && x.xp >= xpFor('boss', x.level) * 0.9)) {
      const at2 = bossFloor(m.level);
      console.log(`  ${m.name} at ${m.level}: ${pct(measure(at2, [m], seeds, 1, thrifty, rules).won)}% (the test boss ${pct(measure(at2, standardEncounter('boss', m.level), seeds, 1, thrifty, rules).won)}%), ${pct(measure(m.level, [m], seeds, 1, thrifty, rules).won)}% at its own level`);
    }
    return;
  }

  if (args.includes('--calibrate')) {
    const t0 = Date.now(), secs = (): string => `${((Date.now() - t0) / 1000).toFixed(0)}s`;
    const fmt = (x: number): string => x.toFixed(2).replace(/\.?0+$/, '');
    const at = (l: number): number => { const k = LEVELS.indexOf(l as (typeof LEVELS)[number]); if (k < 0) throw new Error(`level ${l} is not one of LEVELS`); return k; };
    levels.forEach(at);
    const say = (j: Job, [h, d, bad, fights, rounds]: Point): void => console.log(`  ${j.role} ${j.level}: hp ${fmt(h)}, damage ${fmt(d)}; ${j.role === 'boss' ? `won ${pct(fights)}%` : `${fights.toFixed(1)} fights, ${rounds.toFixed(1)} rounds, ${pct(bad)}% of days end badly`} (${secs()})`);
    const refused = writeRefusal(rules);
    if (args.includes('--write') && refused) throw new Error(refused);
    const jobs = roles.flatMap((role) => levels.map((level): Job => ({ kind: 'calibrate', role, level, seeds, under: 0, rules })));
    const made = await onCores<Point>(jobs, say);
    // The tables with the points just made, as they will be written; the rest stay as they were.
    const next = { hp: {} as Record<Role, number[]>, dmg: {} as Record<Role, number[]>, bad: {} as Record<Role, number[]> };
    for (const r of ROLE_IDS) { next.hp[r] = [...HP[r]]; next.dmg[r] = [...DAMAGE[r]]; next.bad[r] = HP[r].map(() => NaN); }
    const put = (j: Job, [h, d, bad]: Point): void => { next.hp[j.role][at(j.level)] = Number(fmt(h)); next.dmg[j.role][at(j.level)] = Number(fmt(d)); next.bad[j.role][at(j.level)] = bad; };
    jobs.forEach((j, k) => put(j, made[k]));
    // A monster never has fewer hit points than the one a level under it, at the levels made or any
    // between: where a point's factor falls so fast from the one before that the hit points drawn
    // between them would dip, it is raised until they would not, and its damage is solved again. A
    // boss's one factor is both, so held it hits a little harder as well, and is not solved again.
    // And where the next level made is one up and is not made now, but stands as it was, the point's
    // hit points never pass that level's: its factor comes down until they would not, and is solved
    // again as a held one is (#793, 29 between 28 and 30). Where the next level made is two or more
    // up, a bound on the point alone would not keep the levels drawn between from dipping, so none is
    // set there.
    const held: Job[] = [], bosses: string[] = [];
    for (const r of roles) {
      LEVELS.forEach((b, k) => {
        if (k === 0 || !levels.includes(b)) return;
        const a = LEVELS[k - 1], grow = line(b).hp - line(b - 1).hp;
        const least = (next.hp[r][k - 1] * line(b).hp) / (line(b).hp + grow * (b - a));
        const c = LEVELS[k + 1];
        const most = c !== b + 1 || levels.includes(c) ? Infinity : (next.hp[r][k + 1] * line(c).hp) / line(b).hp;
        const h = next.hp[r][k] < least - 1e-9 ? Math.ceil(least * 100) / 100 : next.hp[r][k] > most + 1e-9 ? Math.floor(most * 100) / 100 : undefined;
        if (h === undefined) return;
        next.hp[r][k] = h;
        if (r === 'boss') { next.dmg[r][k] = h; bosses.push(`boss ${b}`); }
        else held.push({ kind: 'refit', role: r, level: b, seeds, under: 0, hp: h, rules });
      });
    }
    if (held.length || bosses.length) console.log(`  holding hit points at the level under's, or the level over's where it stands: ${[...held.map((j) => `${j.role} ${j.level}`), ...bosses].join(', ')}`);
    if (held.length) {
      const again = await onCores<Point>(held, say);
      held.forEach((j, k) => put(j, again[k]));
    }
    for (const r of roles) console.log(`  ${`${r}:`.padEnd(12)}hp [${levels.map((l) => fmt(next.hp[r][at(l)])).join(', ')}]  damage [${levels.map((l) => fmt(next.dmg[r][at(l)])).join(', ')}]`);
    console.log(`\nDays that end in a death, a lost fight or one broken off, at the points made (%; the boss: fights lost from two under)`);
    row('', levels.map((l) => `L${l}`));
    for (const r of roles) row(r, levels.map((l) => pct(next.bad[r][at(l)])));
    console.log(`(${jobs.length} points${held.length + bosses.length ? `, ${held.length + bosses.length} held` : ''}, ${seeds} seeds each, ${secs()})`);
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
  console.log(`A fight still going after ${ROUND_CAP} rounds is broken off, and the company rests.`);
  console.log(`Target: six or seven fights to level 10, a fight more every four levels after (${fightsPerRest(CAP)} at ${CAP}), with no more than ${pct(WORST)}% of days`);
  console.log(`ending in a death, a lost fight or one broken off, in fights of ${longest(1)} rounds at level 1 to ${longest(CAP).toFixed(1)} at ${CAP}`);
  console.log(`(up to ${slowest(1)} and ${slowest(CAP).toFixed(1)} where blows that hard kill too often).`);
  console.log(`The boss is fought alone, from ${under ? 'the same company' : 'two levels under it'}: won (target 50%).`);
  if (rules.tiers || rules.company || rules.artifacts) {
    // The company the what-ifs make, as it stands at each level it fights from: each member's title, tiers and artifacts.
    const tiersOf = (t: Tiers): string => (['master', 'expert'] as const).map((x) => ({ x, on: LINES.filter((l) => t[l] === x) })).filter(({ on }) => on.length).map(({ x, on }) => `${TIER_NAMES[x]} ${on.map((l) => LINE_NAMES[l]).join(' and ')}`).join(', ');
    const arts = (m: Character): string => borne(m).filter((id) => item(id).artifact).map((id) => item(id).name).join(' and ');
    console.log(`\nThe company${rules.tiers ? ' and its tiers' : ''}${rules.artifacts ? ' and who bears the artifacts' : ''}, at each level it fights from:`);
    for (const l of [...new Set(roles.flatMap((r) => levels.map((v) => fieldedAt(r, v, under))))].sort((a, b) => a - b)) {
      console.log(`  L${l}: ${fielded(l, 1, rules).members.map((m) => `${m.name} ${className(m)}${m.tiers ? `, ${tiersOf(m.tiers)}` : ''}${arts(m) ? `, ${arts(m)}` : ''}`).join('; ')}`);
    }
  }
  const cells = await cellsOnCores(roles, levels, seeds, under, Infinity, rules);
  const block = (title: string, show: (c: Cell, r: Role) => string, dayOnly = false): void => {
    console.log(`\n${title}`);
    row('', levels.map((l) => `L${l}`));
    if (title.startsWith('fights')) row('target', levels.map((l) => fightsPerRest(l).toFixed(1)));
    roles.forEach((r, i) => { if (!dayOnly || r !== 'boss') row(`${r} ×${ROLES[r].group}`, levels.map((_, k) => show(cells[i * levels.length + k], r))); });
  };
  block('fights before a rest  (boss: won %)', (c) => (c.day ? c.day.fights.toFixed(1) : pct(c.fresh.won)));
  block('rested for spell points %', (c) => pct(c.day!.why.sp), true);
  block('rested for hit points %', (c) => pct(c.day!.why.hp), true);
  block('ended by a death, a lost fight or one broken off %', (c) => pct(c.day!.why.dead + c.day!.why.lost + c.day!.why.long), true);
  block('rounds a fight, over the day', (c) => c.day!.rounds.toFixed(1), true);
  block('one fight from fresh: cost %', (c) => pct(c.fresh.cost));
  block('one fight from fresh: someone down at the end %', (c) => pct(c.fresh.down));
  const took = { bless: 'blessed', sleep: 'slept a group', drink: 'drank' } as const;
  for (const k of ['bless', 'sleep', 'drink'] as const) if (rules.bot?.[k]) block(`one fight from fresh: the bots ${took[k]} %`, (c) => pct(c.casts?.[k] ?? 0));
  if (Math.max(...levels) > SPELLS_GROW_TO) console.log(`\nPast level ${SPELLS_GROW_TO} the company runs on play's rules: its spells stop growing, it takes its prestiges at ${PRESTIGES.join(', ')} and their spell ranks, and tiers 6 and 7 at 15 and 23, and it wears the ladder's gear to ${GEAR_TOP} and none past it.`);
}

if (isMainThread && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e: unknown) => { console.error(e); process.exit(1); });
