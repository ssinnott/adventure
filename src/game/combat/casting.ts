// The party's spells in a fight (#1007, cut from game/combat.ts): a spell cast at a monster, a
// group, every foe, an ally or the party, an artifact's for a charge; what an element does to a
// monster and what the company learns of it; the hurt a blow or a spell does, which sets `flash`
// for the screen to count down; and the two spells exploration shares, `castOnParty` and
// `castOnAlly`.
import type { RngInstance } from '../../lib/engine/rng.ts';
import { monsterImmune, elementMult, elementDamage } from '../monsters.ts';
import { spellDice } from '../spells.ts';
import type { SpellDef, Element } from '../spells.ts';
import { ARTIFACT_LEVEL } from '../items.ts';
import { heal, removeCondition, hasCondition, hasTrait, spellHeal, rankMult, spellRank, SPELLFIRE_DMG, lift } from '../party.ts';
import type { Party, Character, Condition } from '../party.ts';
import { GLOVE_FLAG } from '../keys.ts';
import type { Items } from '../tables.ts';
import { roll, standing, ROOTS_CHANCE, SLUMBER_CHANCE } from './state.ts';
import type { MonsterInst, CombatState } from './state.ts';
import { GLOVE_LINE, GLASS_WORD } from './lines.ts';

export function hurtMonster(s: CombatState, m: MonsterInst, dmg: number): void {
  m.hp -= dmg;
  m.flash = 2;
  m.conditions = m.conditions.filter((k) => k !== 'asleep');
}

/**
 * What an element does to a monster, a spell's or a blow's die (#855): its damage by `elementDamage`,
 * which the company now has seen; and fire that lands keeps one that mends from mending at this
 * round's end (`regenerate`).
 */
export function elemental(s: CombatState, m: MonsterInst, el: Element | undefined, d: number, pierce = false): number {
  if (el) (s.seen[m.def.id] ??= {})[el] = elementMult(m.def, el);
  const took = elementDamage(m.def, el, d, pierce);
  if (el === 'fire' && took > 0 && m.def.regen) m.burnt = true;
  return took;
}

export function castSpell(s: CombatState, party: Party, rng: RngInstance, c: Character, sp: SpellDef, target: number, element?: Element, held = false): void {
  // A damage spell's roll on one monster: its dice lifted by the caster's ranks, then Spellfire, then
  // what its element does to the monster (`elemental`). An artifact's (`held`) rolls at the caster's
  // level held at ARTIFACT_LEVEL, with no rank, tier or trait (DESIGN §9).
  let gloved = 0;
  const dmgOf = (m: MonsterInst): number => {
    const d = held ? roll(rng, spellDice(sp, Math.min(c.level, ARTIFACT_LEVEL), s.spellsGrowTo), sp.sides ?? 4, 0)
      : Math.round(roll(rng, spellDice(sp, c.level, s.spellsGrowTo), sp.sides ?? 4, 0) * rankMult(c, s.rankStep)) + (hasTrait(c, 'spellfire') ? SPELLFIRE_DMG : 0);
    const took = elemental(s, m, sp.element, d, !held && pierces(c));
    // The Hearth's light passes through a machine, doing nothing.
    if (sp.element === 'holy' && took === 0 && m.def.kind === 'machine') gloved++;
    return took;
  };
  // The first time it does, the log says so, once a game.
  const glove = (): void => {
    if (!gloved || party.flags[GLOVE_FLAG]) return;
    party.flags[GLOVE_FLAG] = 1;
    s.log.push(GLOVE_LINE(gloved === 1));
  };
  switch (sp.target) {
    case 'enemy': {
      const m = s.monsters[target];
      if (!m || !standing(m)) { s.log.push(`${c.name}'s ${sp.name} fizzles.`); return; }
      const d = dmgOf(m);
      hurtMonster(s, m, d);
      s.log.push(`${c.name} casts ${sp.name}: ${m.def.name} takes ${d}.` + (m.hp <= 0 ? ` ${m.def.name} dies.` : ''));
      glove();
      return;
    }
    case 'group': {
      const m0 = s.monsters[target];
      if (!m0 || !standing(m0)) { s.log.push(`${c.name}'s ${sp.name} fizzles.`); return; }
      const members = s.monsters.filter((m) => m.group === m0.group && standing(m));
      if (sp.inflict) {
        let n = 0;
        const chance = sp.inflict === 'paralysed' ? ROOTS_CHANCE : SLUMBER_CHANCE;
        // Slumber's line counts the kind it names, the target's, so that a kind it cannot take shows in a mixed group (#853).
        let kin = 0;
        for (const m of members) if (!monsterImmune(m.def, sp.inflict) && rng.chance(chance)) { m.conditions = [sp.inflict]; n++; if (m.def.id === m0.def.id) kin++; }
        s.log.push(sp.inflict === 'asleep' ? `${c.name} casts ${sp.name}: ${kin} of the ${m0.def.plural} fall asleep.`
          : n ? `${c.name} casts ${sp.name}: ${n} of the ${m0.def.plural} ${n === 1 ? 'is' : 'are'} held fast.` : `${c.name} casts ${sp.name}, but no root holds.`);
      } else {
        let total = 0, killed = 0;
        for (const m of members) { const d = dmgOf(m); hurtMonster(s, m, d); total += d; if (m.hp <= 0) killed++; }
        s.log.push(`${c.name} casts ${sp.name}: ${total} damage to the ${m0.def.plural}` + (killed ? `, ${killed} slain.` : '.'));
        glove();
      }
      return;
    }
    case 'all': {
      const members = s.monsters.filter(standing);
      let total = 0, killed = 0;
      for (const m of members) { const d = dmgOf(m); hurtMonster(s, m, d); total += d; if (m.hp <= 0) killed++; }
      s.log.push(`${c.name} casts ${sp.name}: ${total} damage to every foe` + (killed ? `, ${killed} slain.` : '.'));
      glove();
      return;
    }
    case 'ally': {
      const a = party.members[target] ?? c;
      s.log.push(castOnAlly(s.tables.items, c, sp, a, s.rankStep));
      return;
    }
    case 'party':
      if (sp.buff === 'bless') { s.bless = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. The party is blessed.`); }
      else if (sp.buff === 'shield') { s.shield = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. A ward settles over the party.`); }
      else if (sp.buff === 'haste') { s.haste = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. The party quickens.`); }
      else if (sp.glass && element) { s.glass = { element, rounds: sp.turns ?? 5 }; s.log.push(`${c.name} casts ${sp.name}. The glass dims the ${GLASS_WORD[element]}.`); }
      else if (sp.heal || sp.cure) s.log.push(castOnParty(s.tables.items, c, sp, party, s.rankStep));
      return;
    default:
      s.log.push(`${c.name} casts ${sp.name}.`);
  }
}

/** The sorcerer's third rank (DESIGN §5): its damage spells pass a monster's resistance to their element, never an immunity. */
export const pierces = (c: Character): boolean => c.cls === 'sorcerer' && spellRank(c) >= 3;

/**
 * A healing or curing spell on the whole party, shared by combat and exploration: each member not dead
 * or stoned is healed (see spellHeal) and cured. Returns the log line.
 */
export function castOnParty(items: Items, c: Character, sp: SpellDef, party: Party, step?: number): string {
  for (const a of party.members) {
    if (hasCondition(a, 'dead') || hasCondition(a, 'stoned')) continue;
    if (sp.heal) heal(a, spellHeal(items, c, sp.heal, step));
    for (const k of sp.cure ?? []) removeCondition(a, k as Condition);
  }
  return `${c.name} casts ${sp.name}. The party is ${sp.heal && sp.cure ? 'healed and cleansed' : sp.heal ? 'healed' : 'cleansed'}.`;
}

/**
 * A healing, curing or raising spell on one ally, shared by combat and exploration. Returns the log
 * line. Raising brings the dead back at `heal` hp; other healing scales with the caster (see spellHeal).
 * Absolve lifts stone and curse: the stoned come back as they were, out cold if their wounds say so.
 */
export function castOnAlly(items: Items, c: Character, sp: SpellDef, a: Character, step?: number): string {
  if (sp.cure?.includes('stoned')) {
    const curse = hasCondition(a, 'cursed'), stone = lift(items, a, sp.cure);
    return stone && curse ? `${c.name} casts ${sp.name}: ${a.name} is flesh again, and the curse lifts.` : stone ? `${c.name} casts ${sp.name}: ${a.name} is flesh again.`
      : curse ? `${c.name} casts ${sp.name}: the curse lifts from ${a.name}.` : `${c.name} casts ${sp.name}, but ${a.name} needs no absolving.`;
  }
  if (sp.raise) {
    if (!hasCondition(a, 'dead')) return `${c.name} casts ${sp.name}, but ${a.name} is not dead.`;
    a.conditions = a.conditions.filter((k) => k === 'cursed');
    a.hp = Math.min(a.maxHp, Math.max(1, sp.heal ?? 1));
    return `${c.name} casts ${sp.name}: ${a.name} draws breath again.`;
  }
  const parts: string[] = [];
  if (sp.heal) parts.push(`${a.name} recovers ${heal(a, spellHeal(items, c, sp.heal, step))}`);
  if (sp.cure) { for (const k of sp.cure) removeCondition(a, k as Condition); if (!sp.heal) parts.push(`${a.name} is cleansed`); }
  return `${c.name} casts ${sp.name}: ${parts.join(', ')}.`;
}
