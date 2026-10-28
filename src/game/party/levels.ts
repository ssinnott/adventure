// Levels and the prestiges (#1020, cut from game/party.ts): what the prestiges add and whether the
// next may be taken, the spell tiers, what a member's ranks and its tiers make of its spells and
// its blows (`rankMult`, `armsBonus`, `tierSteps`), the trainer's terms and price, a fight's xp
// shared and what a kill pays, the levels gained (`levelUp`), a company made and its level. It
// takes the tables, the conditions and the spell lists (`spellsFor`).
import type { RngInstance } from '../../lib/engine/rng.ts';
import { spellsFor } from '../spells.ts';
import type { Tables } from '../tables.ts';
import {
  CLASSES, PRESTIGES, PRESTIGE_LEVELS, PRESTIGE_POOLS, prestigeOf, spellRank, bonus, xpForLevel, MAX_LEVEL, LATE_TIERS, HYBRID_LAG, RANK_STEP,
  TIER_ARMS, TIER_STEPS, KILL_PAY,
} from './tables.ts';
import type { Stat, Character, Party } from './tables.ts';
import { hasCondition } from './conditions.ts';

/**
 * The hit points and spell points a member's prestiges add to every level from each one's own on, at
 * its level: each counted from the prestige's level, whenever it was taken.
 */
export function prestigePools(c: Pick<Character, 'cls' | 'prestige' | 'level'>): { hp: number; sp: number } {
  const [hp, sp] = PRESTIGE_POOLS[PRESTIGES[c.cls].calling];
  const levels = PRESTIGE_LEVELS.slice(0, prestigeOf(c)).reduce((t, at) => t + Math.max(0, c.level - at + 1), 0);
  return { hp: hp * levels, sp: CLASSES[c.cls].spStat ? sp * levels : 0 };
}

/**
 * Why a member may not take its next prestige, or '' if it may: three taken already, or short of its
 * level. The price, and the third's quest, are the trainer's to ask.
 */
export function prestigeBar(c: Pick<Character, 'cls' | 'prestige' | 'level'>): string {
  const n = prestigeOf(c);
  if (n >= 3) return 'done';
  return c.level < PRESTIGE_LEVELS[n] ? `level ${PRESTIGE_LEVELS[n]}` : '';
}

/** Take the next prestige: its title, and its hit points and spell points for every level from its own. */
export function takePrestige(c: Character): void {
  const before = prestigePools(c);
  c.prestige = prestigeOf(c) + 1;
  const after = prestigePools(c), hp = after.hp - before.hp, sp = after.sp - before.sp;
  c.maxHp += hp; c.hp += hp; c.maxSp += sp; c.sp += sp;
}

export function spellTierAt(level: number, hybrid = false): number {
  const lag = hybrid ? HYBRID_LAG : 0;
  return level >= LATE_TIERS[1] + lag ? 7 : level >= LATE_TIERS[0] + lag ? 6 : Math.min(5, 1 + Math.floor(level / 2));
}

/**
 * What its ranks make a caster's damage dice and mending: a step a rank and a step for each its tier in
 * magic adds (`tierSteps`), half a step for a hybrid, whose perks carry the rest of its growth. A tool
 * weighing another step passes it.
 */
export function rankMult(c: Character, step = RANK_STEP): number {
  return 1 + step * (PRESTIGES[c.cls].calling === 'hybrid' ? 0.5 : 1) * (spellRank(c) + tierSteps(c));
}

/** What a member's tier at arms adds to its to-hit and its blows' damage, with whatever is in hand: nothing without one. */
export const armsBonus = (c: Pick<Character, 'tiers'>): number => (c.tiers?.arms ? TIER_ARMS[c.tiers.arms] : 0);
/** The rank steps a member's tier in magic adds (`rankMult`): none without one. */
export const tierSteps = (c: Pick<Character, 'tiers'>): number => (c.tiers?.magic ? TIER_STEPS[c.tiers.magic] : 0);
/** Whether the character has the experience for the next level (and is not at the cap). */
export function canTrain(c: Character): boolean { return c.level < MAX_LEVEL && c.xp >= xpForLevel(c.level + 1); }
/** Whether a trainer who teaches to `maxLevel` can teach the character its next level. */
export function canTrainAt(c: Character, maxLevel: number): boolean { return c.level < maxLevel && canTrain(c); }

/** Split xp among the living, as a fight's is; returns who it makes ready to train. */
export function payXp(party: Party, xp: number): string[] {
  const alive = party.members.filter((c) => !hasCondition(c, 'dead'));
  const each = Math.floor(xp / Math.max(1, alive.length)), ready: string[] = [];
  for (const c of alive) { const before = canTrain(c); c.xp += each; if (!before && canTrain(c)) ready.push(c.name); }
  return ready;
}
/** What a trainer charges to teach the next level: 25 a level to 5, 40 a level after, to the cap. */
export function trainPrice(c: Pick<Character, 'level'>): number { return c.level < 5 ? c.level * 25 : c.level * 40; }

export function killPay(monsterLevel: number, memberLevel: number): number {
  return KILL_PAY[Math.max(-3, Math.min(3, Math.round(monsterLevel - memberLevel)))];
}

/**
 * Level up as many times as the xp allows, up to `cap` (MAX_LEVEL in play; tools that look past today's
 * cap pass their own); returns how many levels were gained.
 */
export function levelUp(spells: Tables['spells'], c: Character, rng: RngInstance, cap = MAX_LEVEL): number {
  let gained = 0;
  while (c.level < cap && c.xp >= xpForLevel(c.level + 1)) {
    c.level++; gained++;
    const cd = CLASSES[c.cls];
    // Each prestige taken adds its hit points and spell points to every level after it (DESIGN §5).
    const [php, psp] = PRESTIGE_POOLS[PRESTIGES[c.cls].calling].map((x) => x * prestigeOf(c));
    const hp = Math.max(1, rng.int(1, cd.hpDie) + bonus(c.stats.endurance)) + php;
    c.maxHp += hp; c.hp += hp;
    if (cd.spStat) {
      const sp = Math.max(1, rng.int(1, cd.spDie) + bonus(c.stats[cd.spStat])) + psp;
      c.maxSp += sp; c.sp += sp;
      // A new spell tier every two levels to tier 5 at level 8, then 6 and 7 at 15 and 23.
      const tier = spellTierAt(c.level, PRESTIGES[c.cls].calling === 'hybrid');
      for (const s of spellsFor(spells, cd.spells!, tier)) if (!c.spells.includes(s.id)) c.spells.push(s.id);
    }
    // One stat point in the class's leaning, every other level.
    if (c.level % 2 === 0) {
      const s: Stat = cd.spStat ?? (c.cls === 'thief' || c.cls === 'monk' ? 'speed' : 'might');
      c.stats[s]++;
    }
  }
  return gained;
}

export function createParty(members: Character[]): Party {
  return { members, gold: 200, food: 30, bag: ['torch', 'potion_heal', 'potion_heal'], flags: {} };
}

/** The company's level, as the land judges it: its members' mean, the fallen too, rounded down. */
export function companyLevel(p: Party): number {
  return Math.floor(p.members.reduce((t, m) => t + m.level, 0) / Math.max(1, p.members.length));
}
