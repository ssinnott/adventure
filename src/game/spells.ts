// Spell definitions: five tiers per spell list, one per level band (tiers unlock at levels 1, 2,
// 4, 6 and 8; see party.ts spellTierAt). `list` is who can learn it; `sp` the cost; the effect
// fields say what it does.

export type SpellList = 'cleric' | 'sorcerer' | 'druid';
export type SpellTarget = 'self' | 'ally' | 'party' | 'enemy' | 'group' | 'all';
export type SpellContext = 'combat' | 'explore' | 'any';

export interface SpellDef {
  id: string;
  name: string;
  list: SpellList;
  level: number;
  sp: number;
  target: SpellTarget;
  context: SpellContext;
  /** Damage dice, scaled per caster level for `perLevel`. */
  dice?: number; sides?: number; perLevel?: boolean;
  heal?: number;
  cure?: readonly string[];
  /** Brings a dead ally back (with `heal` hp). */
  raise?: boolean;
  /** A buff key applied to the party for `turns` rounds. */
  buff?: 'bless' | 'shield' | 'haste';
  turns?: number;
  /** Chance-based condition on enemies. */
  inflict?: 'asleep' | 'paralysed';
  /** Exploration effects. */
  explore?: 'light' | 'wizard_eye' | 'town_portal';
  text: string;
}

export const SPELLS: Record<string, SpellDef> = Object.fromEntries(([
  // ---- cleric ----
  { id: 'heal', name: 'Mend', list: 'cleric', level: 1, sp: 2, target: 'ally', context: 'any', heal: 8, text: 'Heals a little.' },
  { id: 'bless', name: 'Bless', list: 'cleric', level: 2, sp: 3, target: 'party', context: 'combat', buff: 'bless', turns: 5, text: 'The party hits more often.' },
  { id: 'ward', name: 'Ward', list: 'cleric', level: 2, sp: 3, target: 'party', context: 'combat', buff: 'shield', turns: 5, text: 'The party is harder to hit.' },
  { id: 'cure', name: 'Cleanse', list: 'cleric', level: 3, sp: 4, target: 'ally', context: 'any', cure: ['poisoned', 'diseased', 'asleep', 'paralysed'], text: 'Removes an affliction.' },
  { id: 'mend_all', name: 'Mending Light', list: 'cleric', level: 3, sp: 6, target: 'party', context: 'any', heal: 10, text: 'Heals everyone a little.' },
  { id: 'smite', name: 'Smite', list: 'cleric', level: 4, sp: 5, target: 'enemy', context: 'combat', dice: 3, sides: 6, text: 'Holy force strikes one foe.' },
  { id: 'restore', name: 'Restore', list: 'cleric', level: 4, sp: 8, target: 'ally', context: 'any', heal: 30, cure: ['poisoned', 'diseased', 'asleep', 'paralysed', 'cursed'], text: 'Heals much and cures all.' },
  { id: 'revive', name: 'Revive', list: 'cleric', level: 5, sp: 12, target: 'ally', context: 'any', raise: true, heal: 10, text: 'Calls the dead back.' },
  { id: 'wrath', name: 'Wrath of the Hearth', list: 'cleric', level: 5, sp: 12, target: 'all', context: 'combat', dice: 4, sides: 6, text: 'Light scours every foe.' },
  // ---- sorcerer ----
  { id: 'spark', name: 'Spark', list: 'sorcerer', level: 1, sp: 2, target: 'enemy', context: 'combat', dice: 1, sides: 6, perLevel: true, text: 'A bolt of lightning at one foe.' },
  { id: 'light', name: 'Light', list: 'sorcerer', level: 1, sp: 1, target: 'party', context: 'explore', explore: 'light', text: 'Lights the way.' },
  { id: 'sleep', name: 'Slumber', list: 'sorcerer', level: 2, sp: 4, target: 'group', context: 'combat', inflict: 'asleep', text: 'A group may fall asleep.' },
  { id: 'firebolt', name: 'Fire Bolt', list: 'sorcerer', level: 3, sp: 5, target: 'group', context: 'combat', dice: 1, sides: 4, perLevel: true, text: 'Fire on a whole group.' },
  { id: 'wizard_eye', name: 'Wizard Eye', list: 'sorcerer', level: 3, sp: 3, target: 'party', context: 'explore', explore: 'wizard_eye', text: 'Reveals the map around you.' },
  { id: 'haste', name: 'Haste', list: 'sorcerer', level: 4, sp: 7, target: 'party', context: 'combat', buff: 'haste', turns: 5, text: 'The party moves first and strikes true.' },
  { id: 'lightning', name: 'Chain Lightning', list: 'sorcerer', level: 4, sp: 9, target: 'all', context: 'combat', dice: 1, sides: 8, perLevel: true, text: 'Lightning leaps to every foe.' },
  { id: 'town_portal', name: 'Town Portal', list: 'sorcerer', level: 5, sp: 10, target: 'party', context: 'explore', explore: 'town_portal', text: 'Returns the party to the last town.' },
  { id: 'meteor', name: 'Meteor Swarm', list: 'sorcerer', level: 5, sp: 14, target: 'all', context: 'combat', dice: 2, sides: 10, perLevel: true, text: 'Stones of fire fall on every foe.' },
  // ---- druid (and ranger) ----
  { id: 'thorn', name: 'Thorn Lash', list: 'druid', level: 1, sp: 2, target: 'enemy', context: 'combat', dice: 2, sides: 4, text: 'Thorns whip one foe.' },
  { id: 'foxfire', name: 'Foxfire', list: 'druid', level: 1, sp: 1, target: 'party', context: 'explore', explore: 'light', text: 'Pale fungus-light shows the way.' },
  { id: 'barkskin', name: 'Barkskin', list: 'druid', level: 2, sp: 3, target: 'party', context: 'combat', buff: 'shield', turns: 5, text: 'The party is harder to hit.' },
  { id: 'salve', name: 'Salve', list: 'druid', level: 2, sp: 3, target: 'ally', context: 'any', heal: 10, cure: ['poisoned'], text: 'Heals and draws out poison.' },
  { id: 'hawk_eye', name: "Hawk's Eye", list: 'druid', level: 3, sp: 3, target: 'party', context: 'explore', explore: 'wizard_eye', text: 'Reveals the map around you.' },
  { id: 'swarm', name: 'Stinging Swarm', list: 'druid', level: 3, sp: 5, target: 'group', context: 'combat', dice: 2, sides: 6, text: 'Insects fall on a whole group.' },
  { id: 'regrowth', name: 'Regrowth', list: 'druid', level: 4, sp: 7, target: 'party', context: 'any', heal: 16, text: 'Heals everyone.' },
  { id: 'hailstorm', name: 'Hailstorm', list: 'druid', level: 4, sp: 9, target: 'all', context: 'combat', dice: 1, sides: 6, perLevel: true, text: 'Hail batters every foe.' },
  { id: 'stag_heart', name: 'Heart of the Stag', list: 'druid', level: 5, sp: 10, target: 'party', context: 'combat', buff: 'haste', turns: 5, text: 'The party moves first and strikes true.' },
  { id: 'tempest', name: 'Tempest', list: 'druid', level: 5, sp: 13, target: 'all', context: 'combat', dice: 2, sides: 8, perLevel: true, text: 'Wind and lightning on every foe.' },
] satisfies SpellDef[]).map((s) => [s.id, s]));

export function spell(id: string): SpellDef {
  const d = SPELLS[id];
  if (!d) throw new Error(`unknown spell '${id}'`);
  return d;
}

export function spellsFor(list: SpellList, maxLevel: number): SpellDef[] {
  return Object.values(SPELLS).filter((s) => s.list === list && s.level <= maxLevel).sort((a, b) => a.level - b.level);
}
