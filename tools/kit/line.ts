// The test monster: one generic monster for each role of docs/MONSTERS.md §4.2, statted at any level
// from 1 to the road's cap, so that a company of that level can fight six or seven of its standard
// encounter between rests (more past level 10), its spell points counted with its hit points (§4.4).
// tools/harness.ts measures that and re-derives HP and DAMAGE, kept in line.json beside this file. None
// of this is content: no map places a test monster, and none has a drawing of its own (each borrows an
// existing kind, so a gallery can still show one). Moved here from tools/testmonster.ts by #984.
import { readFileSync } from 'node:fs';
import type { MonsterDef, MonsterSprite } from '../../src/game/monsters.ts';
import type { Fighters } from '../../src/game/combat.ts';
import { xpForLevel } from '../../src/game/party.ts';
import { MEMBERS } from '../../src/content/progression.ts';

export type Role = 'fodder' | 'skirmisher' | 'soldier' | 'archer' | 'caster' | 'controller' | 'armoured' | 'elite' | 'brute' | 'boss';

export interface RoleShape {
  name: string; plural: string;
  /** How many of it make one standard encounter. */
  group: number;
  /** Against the line: hit points and damage as factors, armour and to-hit as offsets. */
  hp: number; dmg: number; ac: number; hit: number;
  speed: number;
  ranged?: boolean; missile?: boolean;
  inflict?: MonsterDef['inflict'];
  sprite: MonsterSprite; tint: string; size: number;
}

/** The roles as today's monsters play them (docs/MONSTERS.md §4.2), and how many make an encounter. */
export const ROLES: Record<Role, RoleShape> = {
  fodder:     { name: 'Test Fodder', plural: 'Test Fodder', group: 8, hp: 0.6, dmg: 0.6, ac: -1, hit: -1, speed: 12, sprite: 'rat', tint: '#7a6a5a', size: 0.35 },
  skirmisher: { name: 'Test Skirmisher', plural: 'Test Skirmishers', group: 4, hp: 1, dmg: 0.95, ac: 0, hit: 0, speed: 15, sprite: 'wolf', tint: '#8a8a90', size: 0.55 },
  soldier:    { name: 'Test Soldier', plural: 'Test Soldiers', group: 4, hp: 1, dmg: 1, ac: 0, hit: 0, speed: 11, sprite: 'bandit', tint: '#8a6a4a', size: 0.9 },
  archer:     { name: 'Test Archer', plural: 'Test Archers', group: 4, hp: 0.85, dmg: 0.85, ac: 0, hit: 1, speed: 12, ranged: true, missile: true, sprite: 'archer', tint: '#6a7a4a', size: 0.9 },
  caster:     { name: 'Test Caster', plural: 'Test Casters', group: 3, hp: 0.95, dmg: 1.05, ac: 0, hit: 1.5, speed: 12, ranged: true, sprite: 'adept', tint: '#8a4a2a', size: 0.95 },
  controller: { name: 'Test Controller', plural: 'Test Controllers', group: 4, hp: 1, dmg: 0.8, ac: 0, hit: 0, speed: 12, inflict: { cond: 'paralysed', chance: 0.15 }, sprite: 'spider', tint: '#3a3a44', size: 0.45 },
  armoured:   { name: 'Test Armoured', plural: 'Test Armoured', group: 3, hp: 1.25, dmg: 1.05, ac: 2, hit: 0, speed: 8, sprite: 'bone_knight', tint: '#9a9088', size: 1 },
  elite:      { name: 'Test Elite', plural: 'Test Elites', group: 2, hp: 1.45, dmg: 1.25, ac: 0.5, hit: 1, speed: 15, inflict: { cond: 'paralysed', chance: 0.15 }, sprite: 'riftling_elder', tint: '#e0603a', size: 0.9 },
  brute:      { name: 'Test Brute', plural: 'Test Brutes', group: 2, hp: 1.9, dmg: 1.45, ac: -1.5, hit: 1, speed: 8, sprite: 'ogre', tint: '#7a8a5a', size: 1.25 },
  boss:       { name: 'Test Boss', plural: 'Test Bosses', group: 1, hp: 3.5, dmg: 1.7, ac: 1.5, hit: 2, speed: 13, sprite: 'warden', tint: '#e07a3a', size: 1 },
};
export const ROLE_IDS = Object.keys(ROLES) as Role[];

/** The line (docs/MONSTERS.md §4.1): a soldier of level L, before the calibration's factors. */
export function line(level: number): { hp: number; ac: number; hit: number; dmg: number } {
  return { hp: 3 * level + 4, ac: 11 + level / 2, hit: 1.5 + level / 2, dmg: 3 + level / 2 };
}

/**
 * The levels the calibration is made at: each one to 10, then every fourth to the road's cap, each
 * of Act III's, 16 to 22, where the company steps at 17, 19, 21 and 22 (#541), Act IV's from 24,
 * where it steps at 25 and 27 (#549), and each of Act V's, 28 to 32, where it steps at 28 (#752,
 * and #793 for 29 and 31). Past 10 the company runs on play's rules: its spells stopped growing, its
 * prestiges taken at 11, 19 and 27 with their spell ranks (#19, #20) and tiers 6 and 7 at 15 and 23
 * (#20), dressed by the ladder: Act II's steps were in when the levels past 10 were made again
 * (#399, #18), Act III's when the levels past 16 were (#535, #541), Act IV's one, at 25 (#542), when
 * 25 to 27 were (#549), and Act V's, the Hand's steel at 28 (#746), when 28, 30 and 32 were (#752)
 * and 29 and 31 after them, the rest as they stood (#793); 22 to 24 are #541's still, since their
 * company has not changed. Levels between are interpolated. The armoured at 29 and 31 are held at
 * 28's and 30's hit points, since no monster has fewer than the one a level under it, while their
 * armour rounds up a point, so they end 38 and 49% of their days badly there (13% free of the hold);
 * no armoured monster stands at either.
 */
export const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32] as const;

/** The calibration's two tables, HP and DAMAGE, each a factor a role at each of LEVELS. */
export interface Tables { HP: Record<Role, readonly number[]>; DAMAGE: Record<Role, readonly number[]> }
/** Where the tables are kept: data, written by the calibration and read here, never by hand. */
export const LINE_FILE = new URL('./line.json', import.meta.url);
/** The tables as LINE_FILE holds them, a role a line, each row as JSON writes it. */
export const lineJson = (t: Tables): string =>
  `{\n${(['HP', 'DAMAGE'] as const).map((k) => `  ${JSON.stringify(k)}: {\n${ROLE_IDS.map((r) => `    ${JSON.stringify(r)}: ${JSON.stringify(t[k][r])}`).join(',\n')}\n  }`).join(',\n')}\n}\n`;
const TABLES = JSON.parse(readFileSync(LINE_FILE, 'utf8')) as Tables;

/**
 * The calibration, two factors on each role's shape at each of LEVELS: HP on its hit points, DAMAGE on
 * its damage. A regular role hits as today's monsters do (damage 1, on the line) and has the hit points
 * that let a company of its level fight its standard encounter six or seven times between rests (a
 * fight more every four levels past 10, twelve at 32). Where those fights would run too long (four
 * rounds at level 1, a round more every eight levels), hit points hold them there and damage rises
 * instead; where the days then end badly more than one in ten (a death, a lost fight, or one broken
 * off at fifteen rounds), fights run longer and softer or shorter and harder, whichever ends fewer;
 * where the line itself is too much, both come down together; and no monster has fewer hit points
 * than the one a level under it. The boss takes one factor for both, set so that a company two levels
 * under it wins half the time, as EXPANSION.md §5.2 asks, and held as the rest are where its hit
 * points would dip. Kept in line.json beside this file, which `node tools/harness.ts --calibrate
 * --write` writes (`lineJson`); do not tune by hand.
 */
export const HP: Record<Role, readonly number[]> = TABLES.HP;
export const DAMAGE: Record<Role, readonly number[]> = TABLES.DAMAGE;

/** A role's factor from a table at a level, straight between the levels it was made at. */
export function scaleAt(table: Record<Role, readonly number[]>, role: Role, level: number): number {
  const row = table[role], i = LEVELS.findIndex((l) => l >= level);
  if (i < 0) return row[row.length - 1];
  if (i === 0) return row[0];
  const [l0, l1] = [LEVELS[i - 1], LEVELS[i]];
  return row[i - 1] + ((row[i] - row[i - 1]) * (level - l0)) / (l1 - l0);
}

/**
 * Dice that average about `avg`, with the dice carrying most of it: d6s, or d8s from 12, their sides
 * moved a step or two where that brings the average closer. Under 4 it is one die and no bonus, from
 * 1d2 up; a bonus under zero would be cut off at no damage and miscount.
 */
export function diceFor(avg: number): { dice: number; sides: number; bonus: number } {
  if (avg < 4) return { dice: 1, sides: Math.max(2, Math.round(2 * avg - 1)), bonus: 0 };
  const base = avg < 12 ? 6 : 8, dice = Math.max(1, Math.round((avg * 0.8) / ((base + 1) / 2)));
  let best = { dice, sides: base, bonus: 0 }, off = Infinity;
  for (const sides of [base, base - 1, base + 1, base - 2, base + 2]) {
    const bonus = Math.max(0, Math.round(avg - (dice * (sides + 1)) / 2)), miss = Math.abs((dice * (sides + 1)) / 2 + bonus - avg);
    if (miss < off - 1e-9) { best = { dice, sides, bonus }; off = miss; }
  }
  return best;
}

/**
 * How many groups a clear holds for each level it climbs, at a level: the built areas' pace as
 * counted for #159, the Foreland's 81 groups over its climb of 4 and Thornmark's 75 over 5, the
 * second kept past it. Pinned, not counted live, so that a map adding a group moves nothing here;
 * Saltreach's first box is where it is weighed again (docs/MONSTERS.md open question 4).
 */
export const groupsPerLevel = (level: number): number => (level < 5 ? 81 / 4 : 75 / 5);
const BOSS_ENCOUNTERS = 4;

/**
 * What one monster of the role pays at the level: its share of an encounter's worth, which is what
 * the curve gives a group (EXPANSION.md §5.2): the company's climb through the level, over three
 * quarters of the groups a clear holds for it (`groupsPerLevel`). A boss pays four encounters.
 */
export function xpFor(role: Role, level: number): number {
  const encounter = (MEMBERS * (xpForLevel(level + 1) - xpForLevel(level))) / (0.75 * groupsPerLevel(level));
  return Math.round(role === 'boss' ? encounter * BOSS_ENCOUNTERS : encounter / ROLES[role].group);
}

/** The test monster of a role at a level, at the calibrated factors unless others are given. */
export function testMonster(role: Role, level: number, hp = scaleAt(HP, role, level), damage = scaleAt(DAMAGE, role, level)): MonsterDef {
  const r = ROLES[role], l = line(level);
  const d = diceFor(Math.max(1, l.dmg * r.dmg * damage));
  return {
    id: `test_${role}_${level}`, name: r.name, plural: r.plural, sprite: r.sprite, kind: 'person', level,
    hp: Math.max(1, Math.round(l.hp * r.hp * hp)), ac: Math.round(l.ac + r.ac), attack: Math.round(l.hit + r.hit),
    dice: d.dice, sides: d.sides, bonus: d.bonus, speed: r.speed,
    xp: xpFor(role, level), gold: [0, 0],
    ...(r.ranged ? { ranged: true } : {}), ...(r.missile ? { missile: true } : {}), ...(r.inflict ? { inflict: r.inflict } : {}),
    tint: r.tint, size: r.size,
  };
}

/** A role's standard encounter at a level: `group` of its test monster. */
export function standardEncounter(role: Role, level: number, hp = scaleAt(HP, role, level), damage = scaleAt(DAMAGE, role, level)): MonsterDef[] {
  const m = testMonster(role, level, hp, damage);
  return Array.from({ length: ROLES[role].group }, () => m);
}

// Act III's abilities on the test monsters (docs/MONSTERS.md §3.3, #537; the light #541's), each at
// the size decided there. None is a role the calibration makes: each stands on a role's numbers.

/** What a troll is made of: TROLL.hp of the test brute's hit points, of which it mends TROLL.regen a round. */
export const TROLL = { hp: 0.75, regen: 0.1 };
/** What a wight's hit curses at, where the test controller's held (MONSTERS §7.2). */
export const WIGHT_CURSE = 0.2;
/** What a caller brings: CALL.monsters of the test fodder, at CALL.chance a turn. */
export const CALL = { monsters: 3, chance: 0.5 };

/** The test troll: the test brute with fewer hit points, which it mends (`regen`). */
export function testTroll(level: number): MonsterDef {
  const m = testMonster('brute', level), hp = Math.round(m.hp * TROLL.hp);
  return { ...m, id: `test_troll_${level}`, name: 'Test Troll', plural: 'Test Trolls', hp, regen: Math.round(hp * TROLL.regen) };
}
/** The test wight: the test controller, its hold a curse. */
export function testWight(level: number): MonsterDef {
  return { ...testMonster('controller', level), id: `test_wight_${level}`, name: 'Test Wight', plural: 'Test Wights', inflict: { cond: 'cursed', chance: WIGHT_CURSE } };
}
/** The test caller: the test soldier, calling a group of the test fodder (`calls`). */
export function testCaller(level: number): MonsterDef {
  const fodder = testMonster('fodder', level);
  return { ...testMonster('soldier', level), id: `test_caller_${level}`, name: 'Test Caller', plural: 'Test Callers', calls: { monsters: Array.from({ length: CALL.monsters }, () => fodder), chance: CALL.chance } };
}
/**
 * Their standard encounters (§4.4): two trolls, as brutes come; four wights, as controllers do; and a
 * caller beside six fodder, a soldier's share and three quarters of fodder's, before it calls.
 */
export const trollEncounter = (level: number): MonsterDef[] => Array.from({ length: ROLES.brute.group }, () => testTroll(level));
export const wightEncounter = (level: number): MonsterDef[] => Array.from({ length: ROLES.controller.group }, () => testWight(level));
export const callerEncounter = (level: number): MonsterDef[] => [testCaller(level), ...Array.from({ length: 6 }, () => testMonster('fodder', level))];

/** What a light is made of: LIGHT.share of the test controller's hit points and blow together, as the bog light comes down whole (#597). */
export const LIGHT = { share: 0.575 };
/**
 * The test light (MONSTERS §7.2's bog light, #541): the test controller come down whole to
 * LIGHT.share of its line, flying and of the Rift, which never runs. Its touch takes spell points
 * before hit points (`drain: 'sp'`, #161) where the controller's held.
 */
export function testLight(level: number): MonsterDef {
  const m = testMonster('controller', level, scaleAt(HP, 'controller', level) * LIGHT.share, scaleAt(DAMAGE, 'controller', level) * LIGHT.share);
  return { ...m, id: `test_light_${level}`, name: 'Test Light', plural: 'Test Lights', kind: 'rift', ranged: true, drain: 'sp', inflict: undefined };
}
/** Lights round the ring with a hound (§7.2's fight): three lights in a controller's three shares and the test skirmisher in its one. */
export const lightEncounter = (level: number): MonsterDef[] => [...Array.from({ length: 3 }, () => testLight(level)), testMonster('skirmisher', level)];

// Act IV's sweep on the test monsters (docs/MONSTERS.md §3.3, #545), at the size decided there.

/** What a sweeper is made of: the test brute come down whole to SWEEP.share of its line, sweeping its row at SWEEP.chance a turn. */
export const SWEEP = { chance: 0.25, share: 0.85 };

/** The test giant: the test brute on SWEEP.share of its hit points and blow, its arm sweeping the front row (`sweep`); `heavier` times the blow, to try one. */
export function testGiant(level: number, heavier = 1): MonsterDef {
  const m = testMonster('brute', level, scaleAt(HP, 'brute', level) * SWEEP.share, scaleAt(DAMAGE, 'brute', level) * SWEEP.share * heavier);
  return { ...m, id: `test_giant_${level}`, name: 'Test Giant', plural: 'Test Giants', sweep: { chance: SWEEP.chance } };
}
/** The test drake: the test giant, its sweep a breath of fire on a row. */
export function testDrake(level: number): MonsterDef {
  return { ...testGiant(level), id: `test_drake_${level}`, name: 'Test Drake', plural: 'Test Drakes', sweep: { chance: SWEEP.chance, element: 'fire' } };
}
/** Their standard encounters (§4.4): two giants and two drakes, as brutes come. */
export const giantEncounter = (level: number): MonsterDef[] => Array.from({ length: ROLES.brute.group }, () => testGiant(level));
export const drakeEncounter = (level: number): MonsterDef[] => Array.from({ length: ROLES.brute.group }, () => testDrake(level));

// Act IV's stone on the test monsters (docs/MONSTERS.md §3.3, #546), at the size decided there.

/** What a basilisk's hit glasses at, where the test controller's held (MONSTERS §8.3). */
export const BASILISK_STONE = 0.15;
/**
 * The test basilisk (MONSTERS §8.3; the Basilisk is #533's to draw): the test controller, its hold a
 * stone, its gaze reaching the back row as a bow does (`ranged`).
 */
export function testBasilisk(level: number): MonsterDef {
  return { ...testMonster('controller', level), id: `test_basilisk_${level}`, name: 'Test Basilisk', plural: 'Test Basilisks', ranged: true, inflict: { cond: 'stoned', chance: BASILISK_STONE } };
}
/** The mesa (§8.3's fight): a basilisk in a controller's one share behind three lions in a skirmisher's three, the test skirmisher. */
export const basiliskEncounter = (level: number): MonsterDef[] => [...Array.from({ length: 3 }, () => testMonster('skirmisher', level)), testBasilisk(level)];

// Act V's clock on the test monsters (docs/MONSTERS.md §9.3, #748), as the plan gives it.

/** The Core's clock (docs/areas/hearth.md §4.8): a call every CLOCK.every rounds, the light at a thread in CLOCK.dims. */
export const CLOCK = { every: 2, dims: 8 };

/**
 * The Heart's fight (§9.3), whose Vask, Grey Hands and Core Sentries the plan sizes as the test boss,
 * elite and soldier, the last two a level under: the test boss leading three of the test elite at the
 * clock's panel, both steady, calling the test soldier, a machine that obeys, while one of them stands.
 */
export function clockEncounter(level: number): Fighters {
  const lord: MonsterDef = { ...testMonster('boss', level), id: `test_lord_${level}`, name: 'Test Lord', plural: 'Test Lords', steady: true };
  const hand: MonsterDef = { ...testMonster('elite', level - 1), id: `test_hand_${level - 1}`, name: 'Test Hand', plural: 'Test Hands', steady: true };
  const sentry: MonsterDef = { ...testMonster('soldier', level - 1), id: `test_sentry_${level - 1}`, name: 'Test Sentry', plural: 'Test Sentries', kind: 'machine', obeys: true };
  return { monsters: [lord, hand, hand, hand], leader: lord.id, clock: { calls: sentry, every: CLOCK.every, dims: CLOCK.dims, panel: [hand.id] } };
}
