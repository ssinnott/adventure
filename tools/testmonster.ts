// The test monster: one generic monster for each role of docs/MONSTERS.md §4.2, statted at any level
// from 1 to the road's cap, so that a standard encounter at a company's own level costs it about 15%
// of its hit points and spell points together (§4.4). tools/harness.ts measures that and re-derives
// HP and DAMAGE below. None of this is content: no map places a test monster, and none has a drawing
// of its own (each borrows an existing kind, so a gallery can still show one).
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
 * that make its standard encounter cost a company of its level 15%; where that would run a fight past
 * four rounds, hit points hold it to four and damage rises to the 15% instead. The boss takes one
 * factor for both, set so that a company two levels under it wins half the time, as EXPANSION.md §5.2
 * asks. Written by `node tools/harness.ts --calibrate --write`; do not tune by hand.
 */
export const HP: Record<Role, readonly number[]> = {
  fodder:     [1.31, 1.08, 0.96, 2.45, 2.94, 2.84, 3.7, 5.68, 6.75, 6.4, 6.73, 8.29, 8.82, 9.4, 11.16, 11.23],
  skirmisher: [1.79, 1.45, 1.35, 2.16, 2.18, 2.07, 2.02, 3.55, 4.24, 3.96, 4.09, 4.87, 5.45, 5.72, 6.76, 6.87],
  soldier:    [1.93, 1.45, 1.35, 2.16, 2.29, 1.98, 2.26, 3.84, 4.27, 4.13, 4.44, 5.39, 5.99, 6.84, 7.05, 7.27],
  archer:     [2.27, 1.71, 1.58, 2.02, 2.2, 1.9, 2.33, 4.18, 4.76, 4.52, 4.72, 6.01, 6.46, 7.93, 8.31, 8.72],
  caster:     [2.63, 2.16, 1.98, 2.34, 2.35, 2.08, 2.25, 3.85, 4.36, 4.29, 4.49, 5.62, 6.08, 7.38, 7.77, 8.7],
  controller: [1.79, 1.35, 1.27, 1.97, 2.13, 2.25, 2.54, 3.8, 4.34, 4.16, 4.66, 5.39, 6.46, 6.98, 7.2, 7.89],
  armoured:   [1.89, 1.56, 1.45, 2.07, 1.92, 2.09, 2.32, 3.53, 3.73, 3.56, 4.23, 4.95, 5.76, 6.05, 6.8, 7.17],
  elite:      [2.71, 2.1, 2.04, 2, 1.98, 2.08, 2.3, 3.39, 4.08, 3.82, 4.01, 3.92, 4.51, 5.01, 5.25, 5.77],
  brute:      [2.37, 1.76, 1.8, 1.69, 1.7, 1.85, 2.09, 3.05, 3.47, 3.41, 3.64, 3.45, 3.94, 4.05, 4.62, 5.13],
  boss:       [3.95, 2.93, 2.47, 2.46, 2.62, 2.9, 3.03, 3.19, 3.25, 3.93, 4.12, 4.67, 4.57, 4.41, 4.26, 4.26],
};
export const DAMAGE: Record<Role, readonly number[]> = {
  fodder:     [1.43, 1.25, 1.48, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  skirmisher: [1.5, 1.58, 1.17, 1.05, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  soldier:    [1.43, 1.5, 1.67, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  archer:     [1.01, 1.18, 1.05, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  caster:     [1.09, 1.43, 1.27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  controller: [1.79, 1.88, 1.67, 1.5, 1.14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  armoured:   [2.04, 2.26, 2.01, 1.14, 1.47, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  elite:      [1.94, 1.7, 1.51, 2.25, 1.96, 1.4, 1.17, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  brute:      [2.36, 2.42, 1.92, 2.62, 2.26, 1.38, 1.11, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  boss:       [3.95, 2.93, 2.47, 2.46, 2.62, 2.9, 3.03, 3.19, 3.25, 3.93, 4.12, 4.67, 4.57, 4.41, 4.26, 4.26],
};

/** A role's factor from a table at a level, straight between the levels it was made at. */
export function scaleAt(table: Record<Role, readonly number[]>, role: Role, level: number): number {
  const row = table[role], i = LEVELS.findIndex((l) => l >= level);
  if (i < 0) return row[row.length - 1];
  if (i === 0) return row[0];
  const [l0, l1] = [LEVELS[i - 1], LEVELS[i]];
  return row[i - 1] + ((row[i] - row[i - 1]) * (level - l0)) / (l1 - l0);
}

/** Dice that average about `avg`, with the dice carrying most of it. */
export function diceFor(avg: number): { dice: number; sides: number; bonus: number } {
  const sides = avg < 4 ? 4 : avg < 12 ? 6 : 8;
  const dice = Math.max(1, Math.round((avg * 0.8) / ((sides + 1) / 2)));
  return { dice, sides, bonus: Math.round(avg - (dice * (sides + 1)) / 2) };
}

/**
 * How many standard encounters at their own level a company fights for a level. The curve's to set
 * (EXPANSION.md §5.2); 20 is three rests' worth at 15% a fight. A boss pays four encounters.
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
