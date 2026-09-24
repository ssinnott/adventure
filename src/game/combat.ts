// Turn-based combat resolver. Pure: every function takes the state, the party and the rng, and the
// only randomness is the rng handed in, so a fight replays byte-for-byte from a seed. The UI in
// ui/combat.ts reads CombatState and calls `partyAct` / `monsterAct`; nothing here draws.
import type { RngInstance } from '../lib/engine/rng.ts';
import { monster } from './monsters.ts';
import type { MonsterDef } from './monsters.ts';
import { spell } from './spells.ts';
import type { SpellDef } from './spells.ts';
import { item } from './items.ts';
import {
  armorClass, attackBonus, weaponOf, isDown, canAct, damage, heal, addCondition, removeCondition, hasCondition, bonus, canTrain,
  hasTrait, spellHeal, WEAPON_MASTER_DMG, HOLY_STRIKE_DMG, MARKSMAN_DMG, SPELLFIRE_DMG, SNEAK_ATTACK_DMG, RAGE_DMG, INSPIRE_HIT,
} from './party.ts';
import type { ItemDef } from './items.ts';
import type { Party, Character, Condition } from './party.ts';

export interface MonsterInst {
  def: MonsterDef;
  hp: number;
  group: number;
  conditions: Condition[];
  /** Set for one render frame when hit. */
  flash: number;
}

export type TurnRef = { side: 'party'; i: number } | { side: 'monster'; i: number };

export type PartyAction =
  | { type: 'attack'; target: number }
  | { type: 'cast'; spellId: string; target: number }
  | { type: 'defend' }
  | { type: 'use'; itemId: string; target: number }
  | { type: 'flee' };

export type Outcome = 'ongoing' | 'victory' | 'defeat' | 'fled';

/** `ready` names who now has the experience to train a level (levels are bought at a trainer). */
export interface Loot { xp: number; gold: number; items: string[]; ready: string[]; }

export interface CombatState {
  monsters: MonsterInst[];
  groupIds: string[];
  round: number;
  order: TurnRef[];
  turn: number;
  /** Rounds left on each party buff: Bless (+to-hit), Ward (+AC), Haste (+speed and +to-hit). */
  bless: number;
  shield: number;
  haste: number;
  defending: boolean[];
  log: string[];
  outcome: Outcome;
  loot: Loot | null;
}

export const FRONT_ROW = 3;
/** What the buffs are worth while they last. */
export const BLESS_HIT = 2, HASTE_HIT = 1, HASTE_SPEED = 8, WARD_AC = 3;

/** The party's current to-hit bonus from buffs, and from a bard still standing. */
export function buffHit(s: CombatState, party: Party): number {
  const song = party.members.some((m) => !isDown(m) && hasTrait(m, 'inspire')) ? INSPIRE_HIT : 0;
  return (s.bless > 0 ? BLESS_HIT : 0) + (s.haste > 0 ? HASTE_HIT : 0) + song;
}

/** Extra weapon damage from the attacker's traits. */
export function traitDamage(s: CombatState, c: Character, w: ItemDef, m: MonsterInst): number {
  let n = 0;
  if (w.ranged) { if (hasTrait(c, 'marksman')) n += MARKSMAN_DMG; }
  else {
    if (hasTrait(c, 'weapon_master')) n += WEAPON_MASTER_DMG;
    if (hasTrait(c, 'rage') && c.hp < c.maxHp / 2) n += RAGE_DMG;
  }
  if (hasTrait(c, 'holy_strike') && m.def.mindless) n += HOLY_STRIKE_DMG;
  if (hasTrait(c, 'sneak_attack') && s.round === 1) n += SNEAK_ATTACK_DMG;
  return n;
}

export function startCombat(party: Party, groups: { id: string; monsters: string[] }[], rng: RngInstance): CombatState {
  const monsters: MonsterInst[] = [];
  groups.forEach((g, gi) => {
    for (const id of g.monsters) if (monsters.length < 12) monsters.push({ def: monster(id), hp: monster(id).hp, group: gi, conditions: [], flash: 0 });
  });
  const s: CombatState = {
    monsters, groupIds: groups.map((g) => g.id), round: 0, order: [], turn: 0, bless: 0, shield: 0, haste: 0,
    defending: party.members.map(() => false), log: [], outcome: 'ongoing', loot: null,
  };
  s.log.push(describeGroups(s) + ' attack!');
  newRound(s, party, rng);
  return s;
}

export function describeGroups(s: CombatState): string {
  const counts = new Map<string, number>();
  for (const m of s.monsters) if (m.hp > 0) counts.set(m.def.id, (counts.get(m.def.id) ?? 0) + 1);
  return [...counts].map(([id, n]) => n === 1 ? monster(id).name : `${n} ${monster(id).plural}`).join(', ');
}

function newRound(s: CombatState, party: Party, rng: RngInstance): void {
  s.round++;
  s.defending = party.members.map(() => false);
  const refs: { ref: TurnRef; speed: number }[] = [];
  const haste = s.haste > 0 ? HASTE_SPEED : 0;
  party.members.forEach((c, i) => { if (!isDown(c)) refs.push({ ref: { side: 'party', i }, speed: c.stats.speed + haste + rng.range(0, 4) }); });
  s.monsters.forEach((m, i) => { if (m.hp > 0) refs.push({ ref: { side: 'monster', i }, speed: m.def.speed + rng.range(0, 4) }); });
  refs.sort((a, b) => b.speed - a.speed);
  s.order = refs.map((r) => r.ref);
  s.turn = 0;
}

/** Whose turn it is, skipping anyone who cannot act. Advances rounds as needed. Null once the fight is over. */
export function currentTurn(s: CombatState, party: Party, rng: RngInstance): TurnRef | null {
  if (s.outcome !== 'ongoing') return null;
  for (let guard = 0; guard < 4; guard++) {
    while (s.turn < s.order.length) {
      const t = s.order[s.turn];
      if (t.side === 'party') {
        const c = party.members[t.i];
        if (canAct(c)) return t;
        // A sleeper wakes at the top of a later turn with a little luck.
        if (hasCondition(c, 'asleep') && rng.chance(0.3)) { removeCondition(c, 'asleep'); s.log.push(`${c.name} wakes.`); }
      } else {
        const m = s.monsters[t.i];
        if (m.hp > 0 && !m.conditions.length) return t;
        if (m.hp > 0 && m.conditions.includes('asleep') && rng.chance(0.25)) m.conditions = [];
      }
      s.turn++;
    }
    endRound(s, party, rng);
    if (s.outcome !== 'ongoing') return null;
    newRound(s, party, rng);
  }
  return null;
}

function endRound(s: CombatState, party: Party, rng: RngInstance): void {
  if (s.bless > 0) s.bless--;
  if (s.shield > 0) s.shield--;
  if (s.haste > 0) s.haste--;
  for (const c of party.members) {
    if (hasCondition(c, 'poisoned') && !isDown(c)) { damage(c, 1); s.log.push(`${c.name} suffers from poison.`); }
    if (hasCondition(c, 'paralysed') && rng.chance(0.35)) { removeCondition(c, 'paralysed'); s.log.push(`${c.name} can move again.`); }
  }
  checkOutcome(s, party, rng);
}

function toHit(bonusValue: number, targetAc: number): number {
  const p = 0.65 + (bonusValue - (targetAc - 10)) * 0.05;
  return Math.max(0.05, Math.min(0.95, p));
}

function roll(rng: RngInstance, dice: number, sides: number, plus: number): number {
  let n = plus;
  for (let i = 0; i < dice; i++) n += rng.int(1, sides);
  return Math.max(0, n);
}

/** Living monsters the given character may attack with their weapon. */
export function canAttackFromRow(c: Character, index: number): boolean {
  return index < FRONT_ROW || !!weaponOf(c).ranged;
}

export function aliveMonsters(s: CombatState): number[] {
  const out: number[] = [];
  s.monsters.forEach((m, i) => { if (m.hp > 0) out.push(i); });
  return out;
}

/** Resolve the acting character's action. Returns false if the action was not legal (nothing happens). */
export function partyAct(s: CombatState, party: Party, rng: RngInstance, action: PartyAction): boolean {
  const t = currentTurn(s, party, rng);
  if (!t || t.side !== 'party') return false;
  const c = party.members[t.i];
  switch (action.type) {
    case 'attack': {
      const m = s.monsters[action.target];
      if (!m || m.hp <= 0 || !canAttackFromRow(c, t.i)) return false;
      const w = weaponOf(c);
      const hit = rng.chance(toHit(attackBonus(c) + buffHit(s, party), m.def.ac));
      if (hit) {
        const dmg = roll(rng, w.dice ?? 1, w.sides ?? 4, (w.bonus ?? 0) + (w.ranged ? 0 : bonus(c.stats.might)) + traitDamage(s, c, w, m));
        hurtMonster(s, m, dmg);
        s.log.push(`${c.name} hits ${m.def.name} for ${dmg}.` + (m.hp <= 0 ? ` ${m.def.name} dies.` : ''));
      } else s.log.push(`${c.name} misses ${m.def.name}.`);
      break;
    }
    case 'cast': {
      const sp = spell(action.spellId);
      if (!c.spells.includes(sp.id) || c.sp < sp.sp || sp.context === 'explore') return false;
      c.sp -= sp.sp;
      castSpell(s, party, rng, c, sp, action.target);
      break;
    }
    case 'defend':
      s.defending[t.i] = true;
      s.log.push(`${c.name} braces.`);
      break;
    case 'use': {
      const d = item(action.itemId);
      if (!d.use) return false;
      const holder = c.pack.includes(d.id) ? c.pack : party.bag.includes(d.id) ? party.bag : null;
      if (!holder) return false;
      const target = party.members[action.target];
      if (!target) return false;
      holder.splice(holder.indexOf(d.id), 1);
      if (d.use.heal) s.log.push(`${target.name} recovers ${heal(target, d.use.heal)}.`);
      if (d.use.sp) { target.sp = Math.min(target.maxSp, target.sp + d.use.sp); s.log.push(`${target.name} feels sharper.`); }
      if (d.use.cure) { for (const k of d.use.cure) removeCondition(target, k as Condition); s.log.push(`${target.name} is cleansed.`); }
      break;
    }
    case 'flee': {
      const up = party.members.filter((m) => !isDown(m));
      const ps = up.reduce((a, m) => a + m.stats.speed, 0) / Math.max(1, up.length);
      const alive = aliveMonsters(s).map((i) => s.monsters[i]);
      const ms = alive.reduce((a, m) => a + m.def.speed, 0) / Math.max(1, alive.length);
      const p = Math.max(0.15, Math.min(0.9, 0.5 + (ps - ms) * 0.03));
      if (rng.chance(p)) { s.outcome = 'fled'; s.log.push('The party flees!'); return true; }
      s.log.push('The party fails to get away.');
      // A failed flight costs everyone's remaining turn this round.
      s.turn = s.order.length;
      checkOutcome(s, party, rng);
      return true;
    }
  }
  s.turn++;
  checkOutcome(s, party, rng);
  return true;
}

function hurtMonster(s: CombatState, m: MonsterInst, dmg: number): void {
  m.hp -= dmg;
  m.flash = 2;
  m.conditions = m.conditions.filter((k) => k !== 'asleep');
}

function castSpell(s: CombatState, party: Party, rng: RngInstance, c: Character, sp: SpellDef, target: number): void {
  const dmgOf = () => roll(rng, (sp.dice ?? 1) * (sp.perLevel ? Math.max(1, Math.ceil(c.level / 2)) : 1), sp.sides ?? 4, hasTrait(c, 'spellfire') ? SPELLFIRE_DMG : 0);
  switch (sp.target) {
    case 'enemy': {
      const m = s.monsters[target];
      if (!m || m.hp <= 0) { s.log.push(`${c.name}'s ${sp.name} fizzles.`); return; }
      const d = dmgOf();
      hurtMonster(s, m, d);
      s.log.push(`${c.name} casts ${sp.name}: ${m.def.name} takes ${d}.` + (m.hp <= 0 ? ` ${m.def.name} dies.` : ''));
      return;
    }
    case 'group': {
      const m0 = s.monsters[target];
      if (!m0 || m0.hp <= 0) { s.log.push(`${c.name}'s ${sp.name} fizzles.`); return; }
      const members = s.monsters.filter((m) => m.group === m0.group && m.hp > 0);
      if (sp.inflict) {
        let n = 0;
        for (const m of members) if (!m.def.mindless && rng.chance(0.7)) { m.conditions = [sp.inflict]; n++; }
        s.log.push(`${c.name} casts ${sp.name}: ${n} of the ${monster(m0.def.id).plural} fall ${sp.inflict}.`);
      } else {
        let total = 0, killed = 0;
        for (const m of members) { const d = dmgOf(); hurtMonster(s, m, d); total += d; if (m.hp <= 0) killed++; }
        s.log.push(`${c.name} casts ${sp.name}: ${total} damage to the ${m0.def.plural}` + (killed ? `, ${killed} slain.` : '.'));
      }
      return;
    }
    case 'all': {
      const members = s.monsters.filter((m) => m.hp > 0);
      let total = 0, killed = 0;
      for (const m of members) { const d = dmgOf(); hurtMonster(s, m, d); total += d; if (m.hp <= 0) killed++; }
      s.log.push(`${c.name} casts ${sp.name}: ${total} damage to every foe` + (killed ? `, ${killed} slain.` : '.'));
      return;
    }
    case 'ally': {
      const a = party.members[target] ?? c;
      s.log.push(castOnAlly(c, sp, a));
      return;
    }
    case 'party':
      if (sp.buff === 'bless') { s.bless = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. The party is blessed.`); }
      else if (sp.buff === 'shield') { s.shield = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. A ward settles over the party.`); }
      else if (sp.buff === 'haste') { s.haste = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. The party quickens.`); }
      else if (sp.heal) { for (const a of party.members) heal(a, spellHeal(c, sp.heal)); s.log.push(`${c.name} casts ${sp.name}. The party is healed.`); }
      return;
    default:
      s.log.push(`${c.name} casts ${sp.name}.`);
  }
}

/**
 * A healing, curing or raising spell on one ally, shared by combat and exploration. Returns the log
 * line. Raising brings the dead back at `heal` hp; other healing scales with the caster (see spellHeal).
 */
export function castOnAlly(c: Character, sp: SpellDef, a: Character): string {
  if (sp.raise) {
    if (!hasCondition(a, 'dead')) return `${c.name} casts ${sp.name}, but ${a.name} is not dead.`;
    a.conditions = a.conditions.filter((k) => k === 'cursed');
    a.hp = Math.min(a.maxHp, Math.max(1, sp.heal ?? 1));
    return `${c.name} casts ${sp.name}: ${a.name} draws breath again.`;
  }
  const parts: string[] = [];
  if (sp.heal) parts.push(`${a.name} recovers ${heal(a, spellHeal(c, sp.heal))}`);
  if (sp.cure) { for (const k of sp.cure) removeCondition(a, k as Condition); if (!sp.heal) parts.push(`${a.name} is cleansed`); }
  return `${c.name} casts ${sp.name}: ${parts.join(', ')}.`;
}

/** Resolve the acting monster's turn. */
export function monsterAct(s: CombatState, party: Party, rng: RngInstance): boolean {
  const t = currentTurn(s, party, rng);
  if (!t || t.side !== 'monster') return false;
  const m = s.monsters[t.i];
  const front = party.members.map((c, i) => ({ c, i })).filter(({ c, i }) => i < FRONT_ROW && !isDown(c));
  const any = party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c));
  const pool = m.def.ranged || front.length === 0 ? any : front;
  const pick = rng.pick(pool);
  if (!pick) { s.turn++; checkOutcome(s, party, rng); return true; }
  const ac = armorClass(pick.c) + (s.defending[pick.i] ? 4 : 0) + (s.shield > 0 ? WARD_AC : 0);
  if (rng.chance(toHit(m.def.attack, ac))) {
    let dmg = roll(rng, m.def.dice, m.def.sides, m.def.bonus);
    if (s.defending[pick.i]) dmg = Math.ceil(dmg / 2);
    damage(pick.c, dmg);
    let line = `${m.def.name} hits ${pick.c.name} for ${dmg}.`;
    if (m.def.inflict && !isDown(pick.c) && rng.chance(m.def.inflict.chance)) { addCondition(pick.c, m.def.inflict.cond); line += ` ${pick.c.name} is ${m.def.inflict.cond}!`; }
    if (isDown(pick.c)) line += ` ${pick.c.name} falls!`;
    s.log.push(line);
  } else s.log.push(`${m.def.name} misses ${pick.c.name}.`);
  s.turn++;
  checkOutcome(s, party, rng);
  return true;
}

function checkOutcome(s: CombatState, party: Party, rng: RngInstance): void {
  if (s.outcome !== 'ongoing') return;
  if (party.members.every(isDown)) { s.outcome = 'defeat'; s.log.push('The party has fallen.'); return; }
  if (s.monsters.every((m) => m.hp <= 0)) {
    s.outcome = 'victory';
    const loot: Loot = { xp: 0, gold: 0, items: [], ready: [] };
    for (const m of s.monsters) {
      loot.xp += m.def.xp;
      loot.gold += rng.int(m.def.gold[0], m.def.gold[1]);
      for (const d of m.def.drops ?? []) if (rng.chance(d.chance)) loot.items.push(d.item);
    }
    const alive = party.members.filter((c) => !hasCondition(c, 'dead'));
    const each = Math.floor(loot.xp / Math.max(1, alive.length));
    for (const c of alive) { const before = canTrain(c); c.xp += each; if (!before && canTrain(c)) loot.ready.push(c.name); }
    party.gold += loot.gold;
    party.bag.push(...loot.items);
    s.loot = loot;
    s.log.push(`Victory! ${loot.xp} experience, ${loot.gold} gold.`);
  }
}
