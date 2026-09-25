// The party: races, classes, characters, levelling, conditions. Pure data and pure functions; the
// rng is passed in so tests can pin it.
import type { RngInstance } from '../lib/engine/rng.ts';
import { ITEMS, item } from './items.ts';
import type { ItemDef } from './items.ts';
import { spellsFor } from './spells.ts';
import type { SpellList } from './spells.ts';

export type Stat = 'might' | 'intellect' | 'personality' | 'endurance' | 'accuracy' | 'speed' | 'luck';
export const STATS: readonly Stat[] = ['might', 'intellect', 'personality', 'endurance', 'accuracy', 'speed', 'luck'];
export type Stats = Record<Stat, number>;

export type RaceId = 'human' | 'dwarf' | 'elf' | 'gnome' | 'tidefolk' | 'orcblood';
export type ClassId = 'knight' | 'paladin' | 'ranger' | 'cleric' | 'sorcerer' | 'thief' | 'barbarian' | 'monk' | 'bard' | 'druid';

export interface RaceDef {
  id: RaceId; name: string;
  mods: Partial<Stats>;
  /** Innate terrain skill. */
  swim?: boolean;
  /** Finds secrets a cell earlier; cheaper training. */
  perceptive?: boolean;
  resist?: readonly Condition[];
  blurb: string;
}

export interface ClassDef {
  id: ClassId; name: string;
  hpDie: number;
  spDie: number;
  /** The stat SP scales from; none for non-casters. */
  spStat?: Stat;
  spells?: SpellList;
  /** Base to-hit and the martial multiplier on levelling attack bonus. */
  attack: number;
  /** Starting kit. */
  kit: readonly string[];
  /** Passive traits, always on. */
  traits: readonly TraitId[];
  blurb: string;
}

export type TraitId =
  | 'stalwart' | 'weapon_master' | 'holy_strike' | 'divine_health' | 'marksman' | 'keen_eyes' | 'healing_hands'
  | 'faith' | 'spellfire' | 'iron_will' | 'sneak_attack' | 'rage' | 'die_hard' | 'unarmoured' | 'stillness'
  | 'inspire' | 'natures_ward';

export interface TraitDef {
  id: TraitId; name: string; text: string;
  /** Conditions the trait makes its holder immune to. */
  immune?: readonly Condition[];
}

/** What the numeric traits are worth; combat.ts and armorClass read these. */
export const STALWART_AC = 2, WEAPON_MASTER_DMG = 1, HOLY_STRIKE_DMG = 3, MARKSMAN_DMG = 2, HEALING_HANDS = 3,
  SPELLFIRE_DMG = 2, SNEAK_ATTACK_DMG = 4, RAGE_DMG = 3, DIE_HARD_AT = -20, INSPIRE_HIT = 1;

export const TRAITS: Record<TraitId, TraitDef> = {
  stalwart:      { id: 'stalwart', name: 'Stalwart', text: `+${STALWART_AC} AC.` },
  weapon_master: { id: 'weapon_master', name: 'Weapon Master', text: `+${WEAPON_MASTER_DMG} melee damage.` },
  holy_strike:   { id: 'holy_strike', name: 'Holy Strike', text: `+${HOLY_STRIKE_DMG} damage to the mindless dead.` },
  divine_health: { id: 'divine_health', name: 'Divine Health', text: 'Immune to disease.', immune: ['diseased'] },
  marksman:      { id: 'marksman', name: 'Marksman', text: `+${MARKSMAN_DMG} damage with ranged weapons.` },
  keen_eyes:     { id: 'keen_eyes', name: 'Keen Eyes', text: 'Always finds a secret door when searching.' },
  healing_hands: { id: 'healing_hands', name: 'Healing Hands', text: `Healing spells restore ${HEALING_HANDS} more.` },
  faith:         { id: 'faith', name: 'Faith', text: 'Immune to curses.', immune: ['cursed'] },
  spellfire:     { id: 'spellfire', name: 'Spellfire', text: `Damage spells deal +${SPELLFIRE_DMG} to each foe.` },
  iron_will:     { id: 'iron_will', name: 'Iron Will', text: 'Immune to sleep.', immune: ['asleep'] },
  sneak_attack:  { id: 'sneak_attack', name: 'Sneak Attack', text: `+${SNEAK_ATTACK_DMG} damage in a fight's first round.` },
  rage:          { id: 'rage', name: 'Rage', text: `+${RAGE_DMG} melee damage while below half hp.` },
  die_hard:      { id: 'die_hard', name: 'Die Hard', text: `Dies only at ${DIE_HARD_AT} hp, not -10.` },
  unarmoured:    { id: 'unarmoured', name: 'Unarmoured Defence', text: 'In a robe or less, no shield: +1 AC, +1 more every two levels.' },
  stillness:     { id: 'stillness', name: 'Stillness', text: 'Immune to paralysis.', immune: ['paralysed'] },
  inspire:       { id: 'inspire', name: 'Inspiring Song', text: `While standing, the party hits +${INSPIRE_HIT} more often.` },
  natures_ward:  { id: 'natures_ward', name: "Nature's Ward", text: 'Immune to poison.', immune: ['poisoned'] },
};

export const RACES: Record<RaceId, RaceDef> = {
  human:    { id: 'human', name: 'Human', mods: {}, blurb: 'Balanced. Standing rises fastest.' },
  dwarf:    { id: 'dwarf', name: 'Dwarf', mods: { might: 2, endurance: 3, speed: -1, personality: -1 }, resist: ['poisoned'], blurb: 'Hardy. Resists poison. Reads Kiln-script.' },
  elf:      { id: 'elf', name: 'Elf', mods: { intellect: 3, accuracy: 2, might: -2, endurance: -1 }, perceptive: true, blurb: 'Keen. Innate perception.' },
  gnome:    { id: 'gnome', name: 'Gnome', mods: { luck: 3, personality: 1, might: -2 }, perceptive: true, blurb: 'Lucky. Finds secrets sooner.' },
  tidefolk: { id: 'tidefolk', name: 'Tidefolk', mods: { speed: 2, endurance: 2, intellect: -1, luck: -1 }, swim: true, blurb: 'Swims without the skill.' },
  orcblood: { id: 'orcblood', name: 'Orcblood', mods: { might: 3, speed: 1, intellect: -2, personality: -2 }, blurb: 'Strong. Distrusted in Harrow.' },
};

export const CLASSES: Record<ClassId, ClassDef> = {
  knight:   { id: 'knight', name: 'Knight', hpDie: 10, spDie: 0, attack: 3, kit: ['longsword', 'scale', 'buckler'], traits: ['stalwart', 'weapon_master'], blurb: 'The wall. Best weapons and armour.' },
  paladin:  { id: 'paladin', name: 'Paladin', hpDie: 8, spDie: 3, spStat: 'personality', spells: 'cleric', attack: 2, kit: ['mace', 'leather', 'buckler'], traits: ['holy_strike', 'divine_health'], blurb: 'Fights and heals a little.' },
  ranger:   { id: 'ranger', name: 'Ranger', hpDie: 8, spDie: 2, spStat: 'intellect', spells: 'druid', attack: 2, kit: ['shortsword', 'leather', 'shortbow'], traits: ['marksman', 'keen_eyes'], blurb: 'Bows and a little druid magic. Pathfinder.' },
  cleric:   { id: 'cleric', name: 'Cleric', hpDie: 6, spDie: 6, spStat: 'personality', spells: 'cleric', attack: 1, kit: ['mace', 'robe'], traits: ['healing_hands', 'faith'], blurb: 'Heals, cures, protects.' },
  sorcerer: { id: 'sorcerer', name: 'Sorcerer', hpDie: 4, spDie: 8, spStat: 'intellect', spells: 'sorcerer', attack: 0, kit: ['dagger', 'robe', 'sling'], traits: ['spellfire', 'iron_will'], blurb: 'Damage and the spells that open the map.' },
  thief:    { id: 'thief', name: 'Thief', hpDie: 6, spDie: 0, attack: 2, kit: ['shortsword', 'leather', 'sling'], traits: ['sneak_attack', 'keen_eyes'], blurb: 'Locks, traps, and hitting first.' },
  barbarian: { id: 'barbarian', name: 'Barbarian', hpDie: 12, spDie: 0, attack: 3, kit: ['axe', 'leather'], traits: ['rage', 'die_hard'], blurb: 'Most hp of all. Big weapons, light armour.' },
  monk:     { id: 'monk', name: 'Monk', hpDie: 8, spDie: 0, attack: 3, kit: ['staff', 'robe'], traits: ['unarmoured', 'stillness'], blurb: 'Staff and robe, no steel. Quick.' },
  bard:     { id: 'bard', name: 'Bard', hpDie: 6, spDie: 4, spStat: 'personality', spells: 'cleric', attack: 1, kit: ['shortsword', 'leather', 'sling'], traits: ['inspire'], blurb: 'A blade, a song, and some healing.' },
  druid:    { id: 'druid', name: 'Druid', hpDie: 6, spDie: 6, spStat: 'personality', spells: 'druid', attack: 1, kit: ['staff', 'leather'], traits: ['natures_ward', 'healing_hands'], blurb: 'Thorn, storm and mending. Wears leather.' },
};

export type Condition = 'asleep' | 'poisoned' | 'diseased' | 'paralysed' | 'cursed' | 'stoned' | 'unconscious' | 'dead';
export const CONDITION_ORDER: readonly Condition[] = ['dead', 'stoned', 'unconscious', 'paralysed', 'asleep', 'poisoned', 'diseased', 'cursed'];

export interface Equipment { weapon: string | null; armor: string | null; shield: string | null; }

export interface Character {
  name: string;
  race: RaceId;
  cls: ClassId;
  level: number;
  xp: number;
  stats: Stats;
  hp: number; maxHp: number;
  sp: number; maxSp: number;
  conditions: Condition[];
  equipment: Equipment;
  /** Spell ids known. */
  spells: string[];
  /** Personal pack, item ids. */
  pack: string[];
}

export interface Party {
  members: Character[];
  gold: number;
  food: number;
  /** Shared items not carried by anyone in particular. */
  bag: string[];
  /** Quest and dialogue flags. */
  flags: Record<string, number>;
}

export const BASE_STATS: Stats = { might: 10, intellect: 10, personality: 10, endurance: 10, accuracy: 10, speed: 10, luck: 10 };

/** Stat bonus in the +/-4 range that the tables use. */
export function bonus(v: number): number { return Math.floor((v - 10) / 3); }

export function xpForLevel(level: number): number { return Math.floor(100 * Math.pow(level - 1, 2) * 1.5) + (level - 1) * 100; }

/** The level cap for now. Levels are bought at a trainer; no trainer teaches past this. */
export const MAX_LEVEL = 10;
/** Spell tiers unlock at levels 1, 2, 4, 6 and 8; five tiers exist. */
export const MAX_SPELL_TIER = 5;
export function spellTierAt(level: number): number { return Math.min(MAX_SPELL_TIER, 1 + Math.floor(level / 2)); }
/** Whether the character has the experience for the next level (and is not at the cap). */
export function canTrain(c: Character): boolean { return c.level < MAX_LEVEL && c.xp >= xpForLevel(c.level + 1); }

export function createCharacter(name: string, race: RaceId, cls: ClassId, base: Partial<Stats>, rng: RngInstance): Character {
  const stats = { ...BASE_STATS, ...base };
  for (const s of STATS) stats[s] += RACES[race].mods[s] ?? 0;
  const c: Character = {
    name, race, cls, level: 1, xp: 0, stats,
    hp: 0, maxHp: 0, sp: 0, maxSp: 0,
    conditions: [], equipment: { weapon: null, armor: null, shield: null },
    spells: [], pack: [],
  };
  const cd = CLASSES[cls];
  c.maxHp = Math.max(4, cd.hpDie + bonus(stats.endurance) + 2);
  c.maxSp = cd.spStat ? Math.max(0, cd.spDie + bonus(stats[cd.spStat])) : 0;
  c.hp = c.maxHp; c.sp = c.maxSp;
  for (const id of cd.kit) equip(c, id) || c.pack.push(id);
  if (cd.spells) c.spells = spellsFor(cd.spells, 1).map((s) => s.id);
  void rng;
  return c;
}

/** Equip an item from anywhere; returns false if the class cannot use it. */
export function equip(c: Character, id: string): boolean {
  const d = item(id);
  if (d.slot === 'none') return false;
  if (d.classes && !d.classes.includes(c.cls)) return false;
  if (d.slot === 'shield' && c.equipment.weapon && item(c.equipment.weapon).twoHanded) return false;
  if (d.slot === 'weapon' && d.twoHanded && c.equipment.shield) { c.pack.push(c.equipment.shield); c.equipment.shield = null; }
  const old = c.equipment[d.slot];
  if (old) c.pack.push(old);
  c.equipment[d.slot] = id;
  const i = c.pack.indexOf(id);
  if (i >= 0) c.pack.splice(i, 1);
  return true;
}

export function armorClass(c: Character): number {
  let ac = 10 + bonus(c.stats.speed);
  for (const slot of ['armor', 'shield'] as const) { const id = c.equipment[slot]; if (id) ac += ITEMS[id].ac ?? 0; }
  if (hasTrait(c, 'stalwart')) ac += STALWART_AC;
  if (hasTrait(c, 'unarmoured') && !c.equipment.shield && (ITEMS[c.equipment.armor ?? '']?.ac ?? 0) <= 1) ac += 1 + Math.floor(c.level / 2);
  return ac;
}

export function weaponOf(c: Character): ItemDef { return c.equipment.weapon ? item(c.equipment.weapon) : ITEMS.club; }

export function attackBonus(c: Character): number {
  return CLASSES[c.cls].attack + Math.floor(c.level / 2) + bonus(c.stats.accuracy);
}

export function isDown(c: Character): boolean {
  return c.conditions.some((k) => k === 'dead' || k === 'unconscious' || k === 'stoned');
}
export function canAct(c: Character): boolean {
  return !isDown(c) && !c.conditions.some((k) => k === 'asleep' || k === 'paralysed');
}
export function hasCondition(c: Character, k: Condition): boolean { return c.conditions.includes(k); }
export function hasTrait(c: Character, t: TraitId): boolean { return CLASSES[c.cls].traits.includes(t); }
/** Whether race or class keeps the condition off entirely. */
export function immuneTo(c: Character, k: Condition): boolean {
  return !!RACES[c.race].resist?.includes(k) || CLASSES[c.cls].traits.some((t) => TRAITS[t].immune?.includes(k));
}
export function addCondition(c: Character, k: Condition): void {
  if (immuneTo(c, k)) return;
  if (!c.conditions.includes(k)) c.conditions.push(k);
}
export function removeCondition(c: Character, k: Condition): void { c.conditions = c.conditions.filter((x) => x !== k); }

/** The worst condition, for the party card. */
export function worstCondition(c: Character): Condition | null {
  for (const k of CONDITION_ORDER) if (c.conditions.includes(k)) return k;
  return null;
}

export function damage(c: Character, n: number): void {
  if (isDown(c)) return;
  c.hp -= n;
  const deadAt = hasTrait(c, 'die_hard') ? DIE_HARD_AT : -10;
  if (c.hp <= deadAt) { c.hp = deadAt; removeCondition(c, 'unconscious'); addCondition(c, 'dead'); }
  else if (c.hp <= 0) addCondition(c, 'unconscious');
  if (c.hp <= 0) { removeCondition(c, 'asleep'); }
}

/** What a healing spell of `base` restores when this caster casts it. */
export function spellHeal(caster: Character, base: number): number {
  return base + bonus(caster.stats.personality) + (hasTrait(caster, 'healing_hands') ? HEALING_HANDS : 0);
}

export function heal(c: Character, n: number): number {
  if (hasCondition(c, 'dead') || hasCondition(c, 'stoned')) return 0;
  const before = c.hp;
  c.hp = Math.min(c.maxHp, c.hp + n);
  if (c.hp > 0) removeCondition(c, 'unconscious');
  return c.hp - before;
}

/** Full recovery, as an inn or a night's rest gives. Does not raise the dead. */
export function rest(c: Character): void {
  if (hasCondition(c, 'dead') || hasCondition(c, 'stoned')) return;
  c.hp = c.maxHp; c.sp = c.maxSp;
  c.conditions = c.conditions.filter((k) => k === 'poisoned' || k === 'diseased' || k === 'cursed');
}

/**
 * Level up as many times as the xp allows, up to `cap` (MAX_LEVEL in play; tools that look past today's
 * cap pass their own); returns how many levels were gained.
 */
export function levelUp(c: Character, rng: RngInstance, cap = MAX_LEVEL): number {
  let gained = 0;
  while (c.level < cap && c.xp >= xpForLevel(c.level + 1)) {
    c.level++; gained++;
    const cd = CLASSES[c.cls];
    const hp = Math.max(1, rng.int(1, cd.hpDie) + bonus(c.stats.endurance));
    c.maxHp += hp; c.hp += hp;
    if (cd.spStat) {
      const sp = Math.max(1, rng.int(1, cd.spDie) + bonus(c.stats[cd.spStat]));
      c.maxSp += sp; c.sp += sp;
      // A new spell tier every two levels: tier 5 lands at level 8.
      const tier = spellTierAt(c.level);
      for (const s of spellsFor(cd.spells!, tier)) if (!c.spells.includes(s.id)) c.spells.push(s.id);
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

/** Whether anyone standing can do the thing. */
export function partyCan(p: Party): { swim: boolean; climb: boolean; keys: number } {
  const up = p.members.filter((m) => !isDown(m));
  return {
    swim: up.some((m) => RACES[m.race].swim) || (p.flags.skill_swim ?? 0) > 0,
    climb: (p.flags.skill_mountaineer ?? 0) > 0,
    keys: countItem(p, 'key_iron'),
  };
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

/** The six that come with a new game: one of each class, so every system is exercised in the slice. */
export function defaultParty(rng: RngInstance): Party {
  const m = [
    createCharacter('Bram', 'human', 'knight', { might: 15, endurance: 14, accuracy: 12 }, rng),
    createCharacter('Idris', 'orcblood', 'paladin', { might: 13, personality: 13, endurance: 12 }, rng),
    createCharacter('Wren', 'elf', 'ranger', { accuracy: 14, speed: 13, intellect: 11 }, rng),
    createCharacter('Ottilie', 'gnome', 'thief', { speed: 15, luck: 13, accuracy: 12 }, rng),
    createCharacter('Maren', 'tidefolk', 'cleric', { personality: 15, endurance: 12 }, rng),
    createCharacter('Cassian', 'human', 'sorcerer', { intellect: 16, luck: 11, speed: 11 }, rng),
  ];
  return createParty(m);
}
