// What a spell is: five tiers per spell list, one per level band (tiers unlock at levels 1, 2, 4, 6
// and 8; see party.ts spellTierAt). `list` is who can learn it; `sp` the cost; the effect fields say
// what it does. The spells themselves are content (src/content/spells.ts).
import { SPELLS } from '../content/index.ts';

export type SpellList = 'cleric' | 'sorcerer' | 'druid';
export type SpellTarget = 'self' | 'ally' | 'party' | 'enemy' | 'group' | 'all';
export type SpellContext = 'combat' | 'explore' | 'any';
/** What a damage spell is made of, which a monster may resist, be immune to or be weak to (DESIGN §7). */
export type Element = 'fire' | 'cold' | 'lightning' | 'nature' | 'holy';
export const ELEMENTS: readonly Element[] = ['fire', 'cold', 'lightning', 'nature', 'holy'];

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
  /** Every damage spell's, and only theirs (see monsters.ts `elementMult`). */
  element?: Element;
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

export function spell(id: string): SpellDef {
  const d = SPELLS[id];
  if (!d) throw new Error(`unknown spell '${id}'`);
  return d;
}

export function spellsFor(list: SpellList, maxLevel: number): SpellDef[] {
  return Object.values(SPELLS).filter((s) => s.list === list && s.level <= maxLevel).sort((a, b) => a.level - b.level);
}

/** The level damage spells stop growing at: past it they grow by rank alone (DESIGN §7). */
export const SPELLS_GROW_TO = 10;

/**
 * How many dice a damage spell rolls for a caster of `level`: its own, and for the spells that grow
 * with their caster, that many again for every two levels, to SPELLS_GROW_TO. A tool trying another
 * ceiling passes the level they stop growing at (tools/harness.ts).
 */
export function spellDice(sp: SpellDef, level: number, grows = SPELLS_GROW_TO): number {
  return (sp.dice ?? 1) * (sp.perLevel ? Math.max(1, Math.ceil(Math.min(level, grows) / 2)) : 1);
}
