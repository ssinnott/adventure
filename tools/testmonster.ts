// The test monster: one generic monster for each role of docs/MONSTERS.md §4.2, statted at any level
// from 1 to the road's cap, so that a company of that level can fight six or seven of its standard
// encounter between rests, its spell points counted with its hit points (§4.4). tools/harness.ts
// measures that and re-derives HP and DAMAGE below. None of this is content: no map places a test
// monster, and none has a drawing of its own (each borrows an existing kind, so a gallery can still
// show one).
import type { MonsterDef, MonsterSprite } from '../src/game/monsters.ts';
import { xpForLevel } from '../src/game/party.ts';

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
 * The levels the calibration is made at: each one up to today's MAX_LEVEL, then every fourth to the
 * road's cap. Past 10 the company runs on today's rules extended, with no spells, promotions or gear
 * past Thornmark's, so that stretch is provisional until those systems exist and the harness re-runs.
 * Levels between are interpolated.
 */
export const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 24, 28, 32] as const;

/**
 * The calibration, two factors on each role's shape at each of LEVELS: HP on its hit points, DAMAGE on
 * its damage. A regular role hits as today's monsters do (damage 1, on the line) and has the hit points
 * that let a company of its level fight six or seven of its standard encounter between rests. Where
 * those fights would run past four rounds, hit points hold them to four and damage rises instead;
 * where blows that hard end more than one day in ten in a death or a lost fight, fights run up to six
 * rounds to end fewer; where the line itself is too much, both come down together; and no monster has
 * fewer hit points than the one a level under it. The boss takes one factor for both, set so that a
 * company two levels under it wins half the time, as EXPANSION.md §5.2 asks. Written by
 * `node tools/harness.ts --calibrate --write`; do not tune by hand.
 */
export const HP: Record<Role, readonly number[]> = {
  fodder:     [0.83, 0.91, 0.71, 1.4, 1.45, 1.48, 1.7, 2.54, 2.98, 3.02, 3.44, 4.84, 6.2, 7.7, 9, 10.99],
  skirmisher: [0.83, 1.25, 1.11, 1.35, 1.18, 1.2, 1.3, 1.87, 2.11, 2.1, 2.33, 3.4, 3.64, 4.52, 5.36, 6.16],
  soldier:    [1.07, 1.35, 1.11, 1.28, 1.24, 1.2, 1.34, 1.88, 2.11, 2.07, 2.39, 3.43, 3.73, 4.86, 5.67, 6.86],
  archer:     [0.93, 1.59, 1.4, 1.58, 1.52, 1.53, 1.57, 2.16, 2.49, 2.44, 2.71, 3.83, 4.69, 6.04, 7, 8.14],
  caster:     [1.13, 2.15, 1.83, 1.81, 1.69, 1.65, 1.67, 2.24, 2.47, 2.43, 2.73, 3.85, 4.55, 5.26, 5.91, 7.16],
  controller: [0.98, 1.15, 1.04, 1.22, 1.19, 1.16, 1.34, 1.81, 2.08, 2.02, 2.27, 3.34, 3.72, 4.73, 5.55, 6.57],
  armoured:   [1.54, 1.32, 1.14, 1.42, 1.35, 1.3, 1.17, 1.91, 1.97, 1.92, 2.36, 2.75, 3.22, 3.95, 4.34, 5.15],
  elite:      [1.23, 1.76, 1.56, 2.17, 1.82, 1.57, 1.54, 2.25, 2.12, 2, 2.2, 2.67, 3.06, 3.64, 3.35, 4.07],
  brute:      [1.99, 1.76, 1.68, 1.82, 1.92, 1.66, 1.59, 1.91, 1.94, 1.77, 1.93, 2.18, 2.51, 2.83, 3.1, 3.43],
  boss:       [3.95, 2.96, 2.45, 2.47, 2.62, 2.89, 3.03, 3.22, 3.27, 3.59, 3.81, 4.5, 4.5, 4.37, 4.22, 4.21],
};
export const DAMAGE: Record<Role, readonly number[]> = {
  fodder:     [0.83, 1.15, 1.57, 1.42, 1.44, 1.18, 1.22, 1.37, 1.66, 1.37, 1.16, 1.13, 1, 1, 1, 1],
  skirmisher: [0.83, 1, 1.23, 1.58, 1.62, 1.49, 1.37, 1.58, 1.47, 1.38, 1.32, 1.08, 1.36, 1.14, 1.13, 1.07],
  soldier:    [1, 1.19, 1.39, 1.7, 1.73, 1.58, 1.31, 1.61, 1.6, 1.5, 1.33, 1.23, 1.44, 1.25, 1.13, 1.08],
  archer:     [0.93, 1, 1.11, 1.24, 1.34, 1.29, 1.36, 1.6, 1.33, 1.55, 1.47, 1.64, 1.47, 1.28, 1.3, 1.39],
  caster:     [1, 1.01, 1, 1.43, 1.3, 1.35, 1.25, 1.43, 1.33, 1.43, 1.32, 1.24, 1.44, 1.56, 1.52, 1.52],
  controller: [0.98, 1.49, 1.6, 1.87, 1.93, 1.77, 1.44, 1.87, 1.87, 1.76, 1.64, 1.42, 1.66, 1.47, 1.34, 1.3],
  armoured:   [1, 1.79, 1.8, 2, 1.89, 1.66, 1.83, 1.6, 1.58, 1.61, 1.43, 1.66, 1.57, 1.5, 1.56, 1.44],
  elite:      [1, 1.15, 1.51, 1.67, 1.71, 1.5, 1.45, 1.43, 1.62, 1.47, 1.36, 1.29, 1.33, 1.31, 1.57, 1.45],
  brute:      [1, 1.46, 1.45, 1.86, 1.57, 1.35, 1.33, 1.45, 1.45, 1.44, 1.32, 1.29, 1.37, 1.39, 1.36, 1.4],
  boss:       [3.95, 2.96, 2.45, 2.47, 2.62, 2.89, 3.03, 3.22, 3.27, 3.59, 3.81, 4.5, 4.5, 4.37, 4.22, 4.21],
};

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
 * How many standard encounters at their own level a company fights for a level. The curve's to set
 * (EXPANSION.md §5.2); 20 is three rests' worth at six or seven fights a rest. A boss pays four
 * encounters.
 */
export const FIGHTS_PER_LEVEL = 20;
const BOSS_ENCOUNTERS = 4;

/** What one monster of the role pays at the level: its share of an encounter's worth. */
export function xpFor(role: Role, level: number): number {
  const perLevel = 6 * (xpForLevel(level + 1) - xpForLevel(level));
  const encounter = perLevel / FIGHTS_PER_LEVEL;
  return Math.round(role === 'boss' ? encounter * BOSS_ENCOUNTERS : encounter / ROLES[role].group);
}

/** The test monster of a role at a level, at the calibrated factors unless others are given. */
export function testMonster(role: Role, level: number, hp = scaleAt(HP, role, level), damage = scaleAt(DAMAGE, role, level)): MonsterDef {
  const r = ROLES[role], l = line(level);
  const d = diceFor(Math.max(1, l.dmg * r.dmg * damage));
  return {
    id: `test_${role}_${level}`, name: r.name, plural: r.plural, sprite: r.sprite,
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
