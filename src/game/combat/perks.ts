// The prestiges' perks in a fight (#1007, cut from game/combat.ts; DESIGN §5): the blows each
// prestige adds, what the perks are worth, the barbarian's Rage, the thief's sneak attack and its
// vanishing, the bard's song, the knight's banner, the ranger's shot the weather leaves alone, the
// monk's blow from the back row and its follow-through, the damage the traits add to a blow, which
// blows are sneak attacks and whether the company strikes first. Nothing here draws on the rng.
import { KINDS } from '../monsters.ts';
import type { ItemDef } from '../items.ts';
import {
  weaponOf, isDown, hasTrait, WEAPON_MASTER_DMG, HOLY_STRIKE_DMG, MARKSMAN_DMG, SNEAK_ATTACK_DMG, RAGE_DMG, INSPIRE_HIT, prestigeOf,
} from '../party.ts';
import type { ClassId, Party, Character, Condition } from '../party.ts';
import type { Items } from '../tables.ts';
import { FRONT_ROW, BLESS_HIT, HASTE_HIT } from './state.ts';
import type { MonsterInst, CombatState } from './state.ts';

/** The blows each prestige adds a turn: a second at the first and a third at the third. */
export const PRESTIGE_BLOWS: Partial<Record<ClassId, readonly [number, number, number]>> = {
  knight: [1, 0, 1], barbarian: [1, 0, 1], monk: [1, 0, 1], paladin: [1, 0, 1], ranger: [1, 0, 1], thief: [1, 0, 1],
};
/**
 * What the perks are worth: the knight's banner on the front row's to-hit, the ranger's Marksman
 * risen, Holy Strike risen, the thief's sneak attack growing by 2 every two levels past 10, the round
 * it drops from sight, and the bard's song at its first and third.
 */
export const BANNER_HIT = 2, MARKSMAN_MORE = 2, HOLY_STRIKE_RISEN = 6, SNEAK_GROWTH = 2, VANISH_ROUND = 2, SONG_DMG = 1, SONG_RISEN = 2;
/** The share of its hit points a barbarian's Rage starts below: half, three quarters at its second prestige. */
export const rageBelow = (c: Character): number => (c.cls === 'barbarian' && prestigeOf(c) >= 2 ? 0.75 : 0.5);

/**
 * Blows a turn with the weapon in hand: one, and a prestige's more where its weapon suits it, a
 * ranger's with a bow, a thief's with a light weapon, a monk's with a staff or bare hands.
 */
export function blowsOf(items: Items, c: Character): number {
  const more = PRESTIGE_BLOWS[c.cls], w = weaponOf(items, c);
  if (!more) return 1;
  if ((c.cls === 'ranger' && w.kind !== 'bow') || (c.cls === 'thief' && w.kind !== 'light') || (c.cls === 'monk' && c.equipment.weapon && w.kind !== 'staff')) return 1;
  return 1 + more.slice(0, prestigeOf(c)).reduce((a, b) => a + b, 0);
}
/** The thief's sneak attack: its own, and SNEAK_GROWTH more every two levels past 10 from its first prestige. */
export const sneakDamage = (c: Character): number => SNEAK_ATTACK_DMG + (prestigeOf(c) >= 1 ? SNEAK_GROWTH * Math.floor((c.level - 10) / 2) : 0);
/** The thief's second prestige: in VANISH_ROUND it is out of sight, no foe singles it out, and its blows are sneak attacks. */
export const vanished = (s: CombatState, c: Character): boolean => c.cls === 'thief' && prestigeOf(c) >= 2 && s.round === VANISH_ROUND;
/**
 * Whether a blow of `c`'s on `m` is a sneak attack (#1070): `c` has the trait, and `m` is in its first
 * round before its turn, the fight's first with its place in the order at or past the turn's, or the
 * round it is called in, with no place in the order; or `c` has vanished. Read off the round and the
 * order alone: nothing is drawn.
 */
export function sneaks(s: CombatState, c: Character, m: MonsterInst): boolean {
  if (!hasTrait(c, 'sneak_attack')) return false;
  if (vanished(s, c)) return true;
  const i = s.monsters.indexOf(m), at = s.order.findIndex((r) => r.side === 'monster' && r.i === i);
  return at < 0 || (s.round === 1 && at >= s.turn);
}
/** The bard standing who sings best: its prestiges, or -1 with none standing. */
const singer = (party: Party): number => Math.max(-1, ...party.members.filter((m) => !isDown(m) && hasTrait(m, 'inspire')).map(prestigeOf));
/** Whether a standing bard of the second prestige keeps sleep and paralysis off the company. */
export const songWards = (party: Party, k: Condition): boolean => (k === 'asleep' || k === 'paralysed') && singer(party) >= 2;
/** Whether the ranger's second prestige keeps the weather off its shots. */
export const weatherproof = (c: Character): boolean => c.cls === 'ranger' && prestigeOf(c) >= 2;

/**
 * The party's current to-hit bonus from buffs, from a bard still standing (more at its third), and
 * for a member of the front row (`at`, its slot) from a knight of the second prestige still standing.
 */
export function buffHit(s: CombatState, party: Party, at?: number): number {
  const sung = singer(party), song = sung < 0 ? 0 : sung >= 3 ? SONG_RISEN : INSPIRE_HIT;
  const banner = at !== undefined && at < FRONT_ROW && party.members.some((m) => !isDown(m) && m.cls === 'knight' && prestigeOf(m) >= 2) ? BANNER_HIT : 0;
  return (s.bless > 0 ? BLESS_HIT : 0) + (s.haste > 0 ? HASTE_HIT : 0) + song + banner;
}
/** The damage a bard's song adds to every blow: 1 from its first prestige, 2 from its third. */
export function songDamage(party: Party): number {
  const sung = singer(party);
  return sung >= 3 ? SONG_RISEN : sung >= 1 ? SONG_DMG : 0;
}

/** Extra weapon damage from the attacker's traits and prestiges. */
export function traitDamage(s: CombatState, c: Character, w: ItemDef, m: MonsterInst): number {
  let n = 0;
  if (w.ranged) { if (hasTrait(c, 'marksman')) n += MARKSMAN_DMG + (prestigeOf(c) >= 2 ? MARKSMAN_MORE : 0); }
  else {
    if (hasTrait(c, 'weapon_master')) n += WEAPON_MASTER_DMG;
    if (hasTrait(c, 'rage') && c.hp < c.maxHp * rageBelow(c)) n += RAGE_DMG;
  }
  if (hasTrait(c, 'holy_strike') && KINDS[m.def.kind].holy) n += c.cls === 'paladin' && prestigeOf(c) >= 2 ? HOLY_STRIKE_RISEN : HOLY_STRIKE_DMG;
  if (sneaks(s, c, m)) n += sneakDamage(c);
  return n;
}

/**
 * Whether the company strikes first (#856, #1070): while an Arms Master stands (game/skills.ts), every
 * standing member acts before any monster, in every round. The skill is read off the member's list;
 * nobody is born to it, and the skills test holds it to `hasSkill`'s answer.
 */
export const strikesFirst = (party: Party): boolean => party.members.some((c) => !isDown(c) && (c.skills?.includes('arms_master') ?? false));

/**
 * The Windwalker's follow-through (#1070): a monk of the second prestige whose blow fells its foe has
 * not spent it, and strikes again at the next foe standing, at most once more for each of the turn's
 * own blows (the attack loop, game/combat.ts).
 */
export const followsThrough = (c: Character): boolean => c.cls === 'monk' && prestigeOf(c) >= 2;

/** Whether the character in party slot `index` may strike with their weapon at all. */
export function canAttackFromRow(items: Items, c: Character, index: number): boolean {
  return index < FRONT_ROW || !!weaponOf(items, c).ranged || (c.cls === 'monk' && prestigeOf(c) >= 2);
}
