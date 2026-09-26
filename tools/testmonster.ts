// The test monster: one generic monster for each role of docs/MONSTERS.md §4.2, statted at any level
// from 1 to the road's cap, so that a company of that level can fight six or seven of its standard
// encounter between rests (more past level 10), its spell points counted with its hit points (§4.4).
// tools/harness.ts measures that and re-derives HP and DAMAGE below. None of this is content: no map
// places a test monster, and none has a drawing of its own (each borrows an existing kind, so a
// gallery can still show one).
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
 * that let a company of its level fight its standard encounter six or seven times between rests (a
 * fight more every four levels past 10, twelve at 32). Where those fights would run too long (four
 * rounds at level 1, a round more every eight levels), hit points hold them there and damage rises
 * instead; where the days then end badly more than one in ten (a death, a lost fight, or one broken
 * off at fifteen rounds), fights run longer and softer or shorter and harder, whichever ends fewer;
 * where the line itself is too much, both come down together; and no monster has fewer hit points
 * than the one a level under it. The boss takes one factor for both, set so that a company two levels
 * under it wins half the time, as EXPANSION.md §5.2 asks. Written by `node tools/harness.ts
 * --calibrate --write`; do not tune by hand.
 */
export const HP: Record<Role, readonly number[]> = {
  fodder:     [0.83, 1.08, 0.88, 1.4, 1.53, 1.63, 1.83, 2.77, 2.71, 2.69, 2.86, 3.2, 3.56, 5.06, 5.46, 5.57],
  skirmisher: [0.83, 1.25, 1.27, 1.47, 1.4, 1.43, 1.54, 2.05, 2.34, 2.31, 2.28, 2.08, 2.06, 2.43, 2.76, 3.41],
  soldier:    [1.07, 1.45, 1.27, 1.41, 1.35, 1.34, 1.38, 2.09, 2.34, 2.31, 2.1, 2.05, 2.25, 2.43, 3.17, 3.63],
  archer:     [0.93, 1.59, 1.49, 1.73, 1.64, 1.57, 1.82, 2.37, 2.75, 2.78, 2.45, 2.38, 2.6, 3.17, 3.77, 4.06],
  caster:     [1.13, 2.16, 1.91, 2.01, 1.85, 1.84, 1.88, 2.62, 2.76, 2.92, 3.09, 2.54, 2.57, 2.62, 3.38, 3.6],
  controller: [0.98, 1.25, 1.11, 1.28, 1.29, 1.3, 1.34, 2.02, 2.24, 2.25, 2.06, 2, 2, 2.4, 3.11, 3.33],
  armoured:   [1.54, 1.4, 1.26, 1.45, 1.45, 1.28, 1.32, 1.99, 2.14, 1.98, 1.96, 1.78, 2.06, 2.65, 2.82, 2.7],
  elite:      [1.23, 1.82, 1.68, 2.16, 1.87, 1.65, 1.59, 2.16, 2.27, 2.09, 2.09, 1.81, 2.03, 1.96, 1.73, 2.37],
  brute:      [1.99, 1.82, 1.64, 2.19, 2.21, 1.95, 1.75, 2.23, 2.31, 2.21, 1.93, 2, 1.93, 1.92, 1.8, 1.92],
  boss:       [3.95, 2.96, 2.45, 2.47, 2.62, 2.88, 3.03, 3.17, 3.23, 3.46, 3.79, 4.5, 4.5, 4.37, 4.22, 4.21],
};
export const DAMAGE: Record<Role, readonly number[]> = {
  fodder:     [0.83, 1.15, 1.39, 1.42, 1.44, 1.04, 1, 1.13, 2.11, 2.18, 2.18, 1.7, 1.35, 1, 1, 1],
  skirmisher: [0.83, 1, 1.11, 1.38, 1.44, 1.32, 1.06, 1.28, 1.05, 1, 1, 1.6, 1.56, 1.21, 1.13, 1],
  soldier:    [1, 1.06, 1.17, 1.5, 1.55, 1.42, 1.31, 1.22, 1.13, 1.19, 1.58, 1.95, 1.81, 1.64, 1.51, 1],
  archer:     [0.93, 1, 1.11, 1.11, 1.34, 1.29, 1.04, 1.43, 1.18, 1.11, 1.64, 1.95, 1.86, 1.61, 1.7, 1.52],
  caster:     [1, 1, 1, 1.25, 1.3, 1.35, 1.1, 1.16, 1.08, 1.13, 1, 1.53, 1.8, 1.83, 1.69, 1.58],
  controller: [0.98, 1.33, 1.46, 1.87, 1.93, 1.56, 1.64, 1.7, 1.58, 1.17, 1.87, 2.32, 2.25, 1.7, 1.65, 1.42],
  armoured:   [1, 1.79, 1.58, 2, 1.81, 1.66, 1.65, 1.43, 1.33, 1.49, 1.61, 2.32, 1, 1, 1, 2.06],
  elite:      [1, 1.15, 1.33, 1.67, 1.64, 1.4, 1.45, 1.43, 1.44, 1.42, 1.2, 1.43, 1.38, 1.49, 1.53, 1.42],
  brute:      [1, 1.3, 1.45, 1.55, 1.42, 1.21, 1.19, 1.24, 1.25, 1.16, 1.13, 1, 1, 1, 1.64, 1.37],
  boss:       [3.95, 2.96, 2.45, 2.47, 2.62, 2.88, 3.03, 3.17, 3.23, 3.46, 3.79, 4.5, 4.5, 4.37, 4.22, 4.21],
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
 * (EXPANSION.md §5.2); 20 is three rests' worth at six or seven fights a rest, and under two at 32,
 * where a rest comes every twelve. A boss pays four encounters.
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
