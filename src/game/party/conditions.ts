// What a member's condition answers (#1020, cut from game/party.ts): whether it is down or can act,
// a condition or a trait it has, a condition taken off, a temple's price, the worst for the card,
// the hit points it dies at, a heal, a night's rest and an inn's counted nights, the pack by item
// id (`countItem`, `takeItem`) and whether all are down. It takes the tables alone and reads no
// item's definition, so skills.ts, which asks only `isDown` and `countItem`, loads no item.
import { DIE_HARD_AT, CLASSES, prestigeOf, CONDITION_ORDER, IRONHIDE_AT } from './tables.ts';
import type { TraitId, Condition, Character, Party } from './tables.ts';

export function isDown(c: Character): boolean {
  return c.conditions.some((k) => k === 'dead' || k === 'unconscious' || k === 'stoned');
}
export function canAct(c: Character): boolean {
  return !isDown(c) && !c.conditions.some((k) => k === 'asleep' || k === 'paralysed');
}
export function hasCondition(c: Character, k: Condition): boolean { return c.conditions.includes(k); }
export function hasTrait(c: Character, t: TraitId): boolean { return CLASSES[c.cls].traits.includes(t); }

export function removeCondition(c: Character, k: Condition): void { c.conditions = c.conditions.filter((x) => x !== k); }

/**
 * What any temple asks to restore a member (#546 makes it the rule, not a town's): the dead 100 gold
 * a level, the stoned 80, any other condition 25, the well nothing.
 */
export function templePrice(c: Character): number {
  return hasCondition(c, 'dead') ? 100 * c.level : hasCondition(c, 'stoned') ? 80 * c.level : c.conditions.length ? 25 : 0;
}

/** The worst condition, for the party card. */
export function worstCondition(c: Character): Condition | null {
  for (const k of CONDITION_ORDER) if (c.conditions.includes(k)) return k;
  return null;
}

/** The hit points a member dies at: -10, lower for Die Hard, lower still for an Ironhide. */
export function deathAt(c: Character): number {
  if (!hasTrait(c, 'die_hard')) return -10;
  return c.cls === 'barbarian' && prestigeOf(c) >= 2 ? IRONHIDE_AT : DIE_HARD_AT;
}

export function heal(c: Character, n: number): number {
  if (hasCondition(c, 'dead') || hasCondition(c, 'stoned')) return 0;
  const before = c.hp;
  c.hp = Math.min(c.maxHp, c.hp + n);
  if (c.hp > 0) removeCondition(c, 'unconscious');
  return c.hp - before;
}

/**
 * A night at an inn that counts them (`nights`, Rime Lodge's): the first of its flags the company has
 * not set is set, so each stay is the next night, in order. The flag set, if any.
 */
export function stayNight(party: Party, nights: readonly string[] = []): string | undefined {
  const night = nights.find((n) => !party.flags[n]);
  if (night) party.flags[night] = 1;
  return night;
}

/** Full recovery, as an inn or a night's rest gives, and the end of a blessing kept to it. Does not raise the dead. */
export function rest(c: Character): void {
  delete c.riteSpent;
  c.blessed = c.blessed.filter((b) => !b.until);
  if (hasCondition(c, 'dead') || hasCondition(c, 'stoned')) return;
  c.hp = c.maxHp; c.sp = c.maxSp;
  c.conditions = c.conditions.filter((k) => k === 'poisoned' || k === 'diseased' || k === 'cursed');
}

export function countItem(p: Party, id: string): number {
  let n = p.bag.filter((x) => x === id).length;
  for (const m of p.members) n += m.pack.filter((x) => x === id).length;
  return n;
}

/** Remove one of an item from wherever the party carries it. */
export function takeItem(p: Party, id: string): boolean {
  let i = p.bag.indexOf(id);
  if (i >= 0) { p.bag.splice(i, 1); return true; }
  for (const m of p.members) { i = m.pack.indexOf(id); if (i >= 0) { m.pack.splice(i, 1); return true; } }
  return false;
}

export function allDown(p: Party): boolean { return p.members.every(isDown); }
