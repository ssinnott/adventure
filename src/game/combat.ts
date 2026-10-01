// Turn-based combat resolver. Pure: every function takes the state, the party and the rng, and the
// only randomness is the rng handed in, so a fight replays byte-for-byte from a seed. The UI in
// ui/combat.ts reads CombatState and calls `partyAct` / `monsterAct`; nothing here draws.
import type { RngInstance } from '../lib/engine/rng.ts';
import { monster, monsterImmune, monsterSpells, elementMult, elementDamage, KINDS } from './monsters.ts';
import type { MonsterDef } from './monsters.ts';
import { spell, spellDice, SPELLS_GROW_TO } from './spells.ts';
import type { SpellDef, Element } from './spells.ts';
import { item } from './items.ts';
import {
  armorClass, attackBonus, weaponOf, isDown, canAct, damage, heal, addCondition, removeCondition, hasCondition, bonus, canTrain, killPay,
  hasTrait, spellHeal, rankMult, spellRank, WEAPON_MASTER_DMG, HOLY_STRIKE_DMG, MARKSMAN_DMG, SPELLFIRE_DMG, SNEAK_ATTACK_DMG, RAGE_DMG, INSPIRE_HIT,
} from './party.ts';
import type { ItemDef } from './items.ts';
import type { Party, Character, Condition } from './party.ts';

export interface MonsterInst {
  def: MonsterDef;
  hp: number;
  /** Its rank of its group: a group's front and back are each a group of the fight's (`Ranks`). */
  group: number;
  /** The group on the map it came in with: the index into `groupIds`. */
  band: number;
  /** In the back rank: a weapon of the front row reaches it only once the fight's front is down. */
  back: boolean;
  /** Broke and left the fight (`morale`): no longer in it, and paying nothing. */
  fled: boolean;
  conditions: Condition[];
  /** Set for one render frame when hit. */
  flash: number;
}

export type TurnRef = { side: 'party'; i: number } | { side: 'monster'; i: number };

export type PartyAction =
  | { type: 'attack'; target: number }
  | { type: 'cast'; spellId: string; target: number; element?: Element }
  | { type: 'defend' }
  | { type: 'use'; itemId: string; target: number }
  | { type: 'flee' };

export type Outcome = 'ongoing' | 'victory' | 'defeat' | 'fled';

/**
 * `xp` is what the kills were worth before the split, each by the monster's level against a
 * member's (`killPay`), and `shares` what each living member took, in party order: one share for all
 * where all are of one level. `ready` names who now has the experience to train a level (levels are
 * bought at a trainer).
 */
export interface Loot { xp: number; shares: number[]; gold: number; items: string[]; ready: string[]; }

export interface CombatState {
  monsters: MonsterInst[];
  groupIds: string[];
  /** Each group's leader, by monster id, as `groupIds` lists them (`Ranks`). */
  leaders: (string | undefined)[];
  round: number;
  order: TurnRef[];
  turn: number;
  /** Rounds left on each party buff: Bless (+to-hit), Ward (+AC), Haste (+speed and +to-hit). */
  bless: number;
  shield: number;
  haste: number;
  /** Lampglass: the element the party takes half from, and the rounds left on it. */
  glass?: { element: Element; rounds: number };
  /** Rounds left on Bless and Ward over each group of monsters, by the group it came in with (`band`). */
  foeBless: number[];
  foeShield: number[];
  /**
   * What the company has seen each element do to each kind of monster, by its id: the share of a
   * spell's damage it took (`elementMult`). A bot learns from it; a player from the log.
   */
  seen: Record<string, Partial<Record<Element, number>>>;
  defending: boolean[];
  /** To-hit lost by bows, slings and crossbows on both sides: the weather (see weather.ts). */
  rangedPenalty: number;
  /** The level damage spells stop growing at, where a tool tries another: SPELLS_GROW_TO in play (see `spellDice`). */
  spellsGrowTo?: number;
  /** What a spell rank adds, where a tool tries another: RANK_STEP in play (see `rankMult`). */
  rankStep?: number;
  /** What a tool trying new powers gives each member: none in play (see `Edge`). */
  edge?: (c: Character, s: CombatState) => Edge;
  log: string[];
  outcome: Outcome;
  loot: Loot | null;
}

/**
 * Where the fight happens, as far as the resolver cares: the weather's toll on missiles, and its line
 * for the log. A tool trying a ceiling on spells may also say where they stop growing, and one trying
 * new powers for the company what each member gains.
 */
export interface CombatOpts { rangedPenalty?: number; note?: string; spellsGrowTo?: number; rankStep?: number; edge?: (c: Character, s: CombatState) => Edge; }

/**
 * What a tool trying new powers gives a member in a fight (tools/harness.ts): blows a turn with a
 * weapon, damage added to each, and armour. Play gives none: one blow, nothing added.
 */
export interface Edge { blows: number; damage: number; ac: number }

/**
 * How a group stands (docs/MONSTERS.md §3.3): the last `back` of its monsters in the back rank, and
 * the monster id of its leader, whose fall breaks the fight's people (`morale`).
 */
export interface Ranks { back?: number; leader?: string }

/** A group as a fight takes it. Its monsters by id; a tool may hand in defs that no map places (tools/harness.ts). */
export interface CombatGroup extends Ranks { id: string; monsters: readonly (string | MonsterDef)[] }

/** What a tool fights: a group's monsters, or the group with its ranks. */
export type Fighters = readonly (string | MonsterDef)[] | (Ranks & { monsters: readonly (string | MonsterDef)[] });

/** The group a tool's fighters make, under `id`. */
export const asGroup = (id: string, f: Fighters): CombatGroup => ('monsters' in f ? { id, monsters: f.monsters, back: f.back, leader: f.leader } : { id, monsters: f });

export const FRONT_ROW = 3;

/** The log's line when people break at their leader's fall, and when beasts run; given who goes, and whether one. */
export const BREAK_LINE = (names: string, one: boolean): string => one ? `${names} breaks and runs.` : `${names} break and run.`;
export const ROUT_LINE = (names: string, one: boolean): string => one ? `${names} bolts.` : `${names} bolt.`;
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
  if (hasTrait(c, 'holy_strike') && KINDS[m.def.kind].holy) n += HOLY_STRIKE_DMG;
  if (hasTrait(c, 'sneak_attack') && s.round === 1) n += SNEAK_ATTACK_DMG;
  return n;
}

/** Start a fight with up to three groups, twelve monsters at most; each rank of a group is a group of the fight's. */
export function startCombat(party: Party, groups: readonly CombatGroup[], rng: RngInstance, opts: CombatOpts = {}): CombatState {
  const monsters: MonsterInst[] = [];
  let rank = -1;
  groups.forEach((g, band) => {
    const front = g.monsters.length - Math.max(0, Math.min(g.back ?? 0, g.monsters.length - 1));
    g.monsters.forEach((m, k) => {
      if (monsters.length >= 12) return;
      if (k === 0 || k === front) rank++;
      const def = typeof m === 'string' ? monster(m) : m;
      monsters.push({ def, hp: def.hp, group: rank, band, back: k >= front, fled: false, conditions: [], flash: 0 });
    });
  });
  const s: CombatState = {
    monsters, groupIds: groups.map((g) => g.id), leaders: groups.map((g) => g.leader), round: 0, order: [], turn: 0, bless: 0, shield: 0, haste: 0,
    foeBless: groups.map(() => 0), foeShield: groups.map(() => 0), seen: {},
    defending: party.members.map(() => false), rangedPenalty: opts.rangedPenalty ?? 0, log: [], outcome: 'ongoing', loot: null,
    ...(opts.spellsGrowTo !== undefined ? { spellsGrowTo: opts.spellsGrowTo } : {}),
    ...(opts.rankStep !== undefined ? { rankStep: opts.rankStep } : {}),
    ...(opts.edge ? { edge: opts.edge } : {}),
  };
  s.log.push(describeGroups(s) + ' attack!');
  if (opts.note) s.log.push(opts.note);
  newRound(s, party, rng);
  return s;
}

export function describeGroups(s: CombatState): string {
  return describe(s.monsters.filter(standing));
}

/** Monsters as the log names them: "Bandit", "3 Bandits, Bandit Archer". */
function describe(ms: readonly MonsterInst[]): string {
  const counts = new Map<string, { def: MonsterDef; n: number }>();
  for (const m of ms) { const c = counts.get(m.def.id); if (c) c.n++; else counts.set(m.def.id, { def: m.def, n: 1 }); }
  return [...counts.values()].map(({ def, n }) => n === 1 ? def.name : `${n} ${def.plural}`).join(', ');
}

function newRound(s: CombatState, party: Party, rng: RngInstance): void {
  s.round++;
  s.defending = party.members.map(() => false);
  const refs: { ref: TurnRef; speed: number }[] = [];
  const haste = s.haste > 0 ? HASTE_SPEED : 0;
  party.members.forEach((c, i) => { if (!isDown(c)) refs.push({ ref: { side: 'party', i }, speed: c.stats.speed + haste + rng.range(0, 4) }); });
  s.monsters.forEach((m, i) => { if (standing(m)) refs.push({ ref: { side: 'monster', i }, speed: m.def.speed + rng.range(0, 4) }); });
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
        if (standing(m) && !m.conditions.length && !waits(s, m)) return t;
        if (standing(m) && m.conditions.includes('asleep') && rng.chance(0.25)) m.conditions = [];
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
  for (const t of [s.foeBless, s.foeShield]) t.forEach((n, band) => { if (n > 0) t[band] = n - 1; });
  if (s.glass && --s.glass.rounds <= 0) delete s.glass;
  // A monster held by the roots tears free as a member shakes off paralysis.
  const freed = s.monsters.filter((m) => standing(m) && m.conditions.includes('paralysed') && rng.chance(HOLD_BREAKS));
  for (const m of freed) m.conditions = m.conditions.filter((k) => k !== 'paralysed');
  if (freed.length) s.log.push(`${describe(freed)} ${freed.length === 1 ? 'tears' : 'tear'} free.`);
  for (const c of party.members) {
    if (hasCondition(c, 'poisoned') && !isDown(c)) { damage(c, 1); s.log.push(`${c.name} suffers from poison.`); }
    if (hasCondition(c, 'paralysed') && rng.chance(0.35)) { removeCondition(c, 'paralysed'); s.log.push(`${c.name} can move again.`); }
  }
  checkOutcome(s, party, rng);
}

/** The chance a to-hit bonus has against an armour class, for either side. */
export function toHit(bonusValue: number, targetAc: number): number {
  const p = 0.65 + (bonusValue - (targetAc - 10)) * 0.05;
  return Math.max(0.05, Math.min(0.95, p));
}

function roll(rng: RngInstance, dice: number, sides: number, plus: number): number {
  let n = plus;
  for (let i = 0; i < dice; i++) n += rng.int(1, sides);
  return Math.max(0, n);
}

/** Whether the character in party slot `index` may strike with their weapon at all. */
export function canAttackFromRow(c: Character, index: number): boolean {
  return index < FRONT_ROW || !!weaponOf(c).ranged;
}

/** Still in the fight: alive, and not fled. */
export const standing = (m: MonsterInst): boolean => m.hp > 0 && !m.fled;

/** Whether any of the fight's front rank stands: while one does, the back is out of a blade's reach. */
export const frontStands = (s: CombatState): boolean => s.monsters.some((m) => standing(m) && !m.back);

/** Whether the character's weapon reaches the monster: a bow or sling any, a blade the back only once the front is down. */
export function canReach(s: CombatState, c: Character, target: number): boolean {
  const m = s.monsters[target];
  return !!m && standing(m) && (!m.back || !!weaponOf(c).ranged || !frontStands(s));
}

/** A monster of the back rank with no bow or spell waits for the front to fall before it steps up. */
const waits = (s: CombatState, m: MonsterInst): boolean => m.back && !m.def.ranged && !m.def.cast && frontStands(s);

/** A monster's armour, with a Ward over its group. */
export const monsterAc = (s: CombatState, m: MonsterInst): number => m.def.ac + (s.foeShield[m.band] > 0 ? WARD_AC : 0);
/** A monster's to-hit, with a Bless over its group and the weather's toll on its bow. */
export const monsterHit = (s: CombatState, m: MonsterInst): number => m.def.attack + (s.foeBless[m.band] > 0 ? BLESS_HIT : 0) - (m.def.missile ? s.rangedPenalty : 0);
/** What the company has seen the element do to the monster: the share of a spell's damage, or 1 where it has not seen it. */
export const seenMult = (s: CombatState, m: MonsterInst, el: Element | undefined): number => (el ? s.seen[m.def.id]?.[el] ?? 1 : 1);

/** Whether the monster leads its group (`Ranks`). */
export const isLeader = (s: CombatState, m: MonsterInst): boolean => s.leaders[m.band] === m.def.id;

export function aliveMonsters(s: CombatState): number[] {
  const out: number[] = [];
  s.monsters.forEach((m, i) => { if (standing(m)) out.push(i); });
  return out;
}

/** Resolve the acting character's action. Returns false if the action was not legal (nothing happens). */
export function partyAct(s: CombatState, party: Party, rng: RngInstance, action: PartyAction): boolean {
  const t = currentTurn(s, party, rng);
  if (!t || t.side !== 'party') return false;
  const c = party.members[t.i];
  switch (action.type) {
    case 'attack': {
      let m = s.monsters[action.target];
      if (!m || !canAttackFromRow(c, t.i) || !canReach(s, c, action.target)) return false;
      const w = weaponOf(c), edge = s.edge?.(c, s);
      for (let blow = 0; blow < (edge?.blows ?? 1); blow++) {
        // A later blow, where a tool gives more than one, falls on the weakest foe still standing.
        if (!standing(m)) { const left = aliveMonsters(s).filter((i) => canReach(s, c, i)); if (!left.length) break; m = s.monsters[left.reduce((a, b) => (s.monsters[b].hp < s.monsters[a].hp ? b : a))]; }
        const hit = rng.chance(toHit(attackBonus(c) + buffHit(s, party) - (w.ranged ? s.rangedPenalty : 0), monsterAc(s, m)));
        if (hit) {
          const dmg = roll(rng, w.dice ?? 1, w.sides ?? 4, (w.bonus ?? 0) + (w.ranged ? 0 : bonus(c.stats.might)) + traitDamage(s, c, w, m) + (edge?.damage ?? 0));
          hurtMonster(s, m, dmg);
          s.log.push(`${c.name} hits ${m.def.name} for ${dmg}.` + (m.hp <= 0 ? ` ${m.def.name} dies.` : ''));
        } else s.log.push(`${c.name} misses ${m.def.name}.`);
      }
      break;
    }
    case 'cast': {
      const sp = spell(action.spellId);
      if (!c.spells.includes(sp.id) || c.sp < sp.sp || sp.context === 'explore' || (sp.glass && !action.element)) return false;
      c.sp -= sp.sp;
      castSpell(s, party, rng, c, sp, action.target, action.element);
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
      if (rng.chance(p)) { s.outcome = 'fled'; s.log.push('The party flees!'); wake(party); return true; }
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

function castSpell(s: CombatState, party: Party, rng: RngInstance, c: Character, sp: SpellDef, target: number, element?: Element): void {
  // A damage spell's roll on one monster: its dice lifted by the caster's ranks, then Spellfire, then
  // what its element does to the monster, which the company now has seen.
  const dmgOf = (m: MonsterInst): number => {
    const d = Math.round(roll(rng, spellDice(sp, c.level, s.spellsGrowTo), sp.sides ?? 4, 0) * rankMult(c, s.rankStep)) + (hasTrait(c, 'spellfire') ? SPELLFIRE_DMG : 0);
    if (sp.element) (s.seen[m.def.id] ??= {})[sp.element] = elementMult(m.def, sp.element);
    return elementDamage(m.def, sp.element, d, pierces(c));
  };
  switch (sp.target) {
    case 'enemy': {
      const m = s.monsters[target];
      if (!m || !standing(m)) { s.log.push(`${c.name}'s ${sp.name} fizzles.`); return; }
      const d = dmgOf(m);
      hurtMonster(s, m, d);
      s.log.push(`${c.name} casts ${sp.name}: ${m.def.name} takes ${d}.` + (m.hp <= 0 ? ` ${m.def.name} dies.` : ''));
      return;
    }
    case 'group': {
      const m0 = s.monsters[target];
      if (!m0 || !standing(m0)) { s.log.push(`${c.name}'s ${sp.name} fizzles.`); return; }
      const members = s.monsters.filter((m) => m.group === m0.group && standing(m));
      if (sp.inflict) {
        let n = 0;
        const chance = sp.inflict === 'paralysed' ? ROOTS_CHANCE : SLUMBER_CHANCE;
        for (const m of members) if (!monsterImmune(m.def, sp.inflict) && rng.chance(chance)) { m.conditions = [sp.inflict]; n++; }
        s.log.push(sp.inflict === 'asleep' ? `${c.name} casts ${sp.name}: ${n} of the ${m0.def.plural} fall asleep.`
          : n ? `${c.name} casts ${sp.name}: ${n} of the ${m0.def.plural} ${n === 1 ? 'is' : 'are'} held fast.` : `${c.name} casts ${sp.name}, but no root holds.`);
      } else {
        let total = 0, killed = 0;
        for (const m of members) { const d = dmgOf(m); hurtMonster(s, m, d); total += d; if (m.hp <= 0) killed++; }
        s.log.push(`${c.name} casts ${sp.name}: ${total} damage to the ${m0.def.plural}` + (killed ? `, ${killed} slain.` : '.'));
      }
      return;
    }
    case 'all': {
      const members = s.monsters.filter(standing);
      let total = 0, killed = 0;
      for (const m of members) { const d = dmgOf(m); hurtMonster(s, m, d); total += d; if (m.hp <= 0) killed++; }
      s.log.push(`${c.name} casts ${sp.name}: ${total} damage to every foe` + (killed ? `, ${killed} slain.` : '.'));
      return;
    }
    case 'ally': {
      const a = party.members[target] ?? c;
      s.log.push(castOnAlly(c, sp, a, s.rankStep));
      return;
    }
    case 'party':
      if (sp.buff === 'bless') { s.bless = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. The party is blessed.`); }
      else if (sp.buff === 'shield') { s.shield = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. A ward settles over the party.`); }
      else if (sp.buff === 'haste') { s.haste = sp.turns ?? 5; s.log.push(`${c.name} casts ${sp.name}. The party quickens.`); }
      else if (sp.glass && element) { s.glass = { element, rounds: sp.turns ?? 5 }; s.log.push(`${c.name} casts ${sp.name}. The glass dims the ${GLASS_WORD[element]}.`); }
      else if (sp.heal || sp.cure) s.log.push(castOnParty(c, sp, party, s.rankStep));
      return;
    default:
      s.log.push(`${c.name} casts ${sp.name}.`);
  }
}

/** The sorcerer's third rank (DESIGN §5): its damage spells pass a monster's resistance to their element, never an immunity. */
export const pierces = (c: Character): boolean => c.cls === 'sorcerer' && spellRank(c) >= 3;

/** What Lampglass's line calls each element: the wood for nature, the light for holy. */
export const GLASS_WORD: Record<Element, string> = { fire: 'fire', cold: 'cold', lightning: 'lightning', nature: 'wood', holy: 'light' };
/** The chance Grasping Roots holds each one it falls on, and the chance a round each held monster tears free. */
export const ROOTS_CHANCE = 0.5, HOLD_BREAKS = 0.35;

/**
 * A healing or curing spell on the whole party, shared by combat and exploration: each member not dead
 * or stoned is healed (see spellHeal) and cured. Returns the log line.
 */
export function castOnParty(c: Character, sp: SpellDef, party: Party, step?: number): string {
  for (const a of party.members) {
    if (hasCondition(a, 'dead') || hasCondition(a, 'stoned')) continue;
    if (sp.heal) heal(a, spellHeal(c, sp.heal, step));
    for (const k of sp.cure ?? []) removeCondition(a, k as Condition);
  }
  return `${c.name} casts ${sp.name}. The party is ${sp.heal && sp.cure ? 'healed and cleansed' : sp.heal ? 'healed' : 'cleansed'}.`;
}

/**
 * A healing, curing or raising spell on one ally, shared by combat and exploration. Returns the log
 * line. Raising brings the dead back at `heal` hp; other healing scales with the caster (see spellHeal).
 * Absolve lifts stone and curse: the stoned come back as they were, out cold if their wounds say so.
 */
export function castOnAlly(c: Character, sp: SpellDef, a: Character, step?: number): string {
  if (sp.cure?.includes('stoned')) {
    const stone = hasCondition(a, 'stoned'), curse = hasCondition(a, 'cursed');
    removeCondition(a, 'stoned'); removeCondition(a, 'cursed');
    if (stone && a.hp <= 0 && !hasCondition(a, 'dead')) addCondition(a, 'unconscious');
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
  if (sp.heal) parts.push(`${a.name} recovers ${heal(a, spellHeal(c, sp.heal, step))}`);
  if (sp.cure) { for (const k of sp.cure) removeCondition(a, k as Condition); if (!sp.heal) parts.push(`${a.name} is cleansed`); }
  return `${c.name} casts ${sp.name}: ${parts.join(', ')}.`;
}

/** The party's members in a row, front or back, still standing. */
const rowOf = (party: Party, back: boolean): { c: Character; i: number }[] =>
  party.members.map((c, i) => ({ c, i })).filter(({ c, i }) => (i >= FRONT_ROW) === back && !isDown(c));

/** The row a monster's spell on a row falls on: the one with more standing in it (for Slumber, more awake), the front on a tie. */
function rowFor(party: Party, sp: SpellDef): { c: Character; i: number }[] {
  const count = (back: boolean): number => rowOf(party, back).filter(({ c }) => !sp.inflict || !hasCondition(c, 'asleep')).length;
  return rowOf(party, count(true) > count(false));
}

/** The monster's group still in the fight: those that came in with it. */
const bandOf = (s: CombatState, m: MonsterInst): MonsterInst[] => s.monsters.filter((q) => q.band === m.band && standing(q));
/** A group as a line names it: its kind's plural where it is one kind, else "its group". */
const bandName = (ms: readonly MonsterInst[]): string => (ms.length === 1 ? ms[0].def.name : ms.every((q) => q.def === ms[0].def) ? `The ${ms[0].def.plural}` : 'Its group');
/** The verb a group's line takes: "The Chanters are", "Its group is". */
const isAre = (ms: readonly MonsterInst[]): string => (ms.length > 1 && ms.every((q) => q.def === ms[0].def) ? 'are' : 'is');
/** What a monster's mend restores: the spell's, and its level held to SPELLS_GROW_TO, which stands for a caster's gifts. */
const foeHeal = (m: MonsterInst, sp: SpellDef): number => (sp.heal ?? 0) + Math.min(m.def.level, SPELLS_GROW_TO);
/** Whether any of a monster's group is under three quarters of its hit points. */
const hurt = (q: MonsterInst): boolean => q.hp < q.def.hp * 0.75;

/** Whether the spell would do anything now: a mend with one of its group hurt, a buff not running, Slumber with a row awake. */
function castable(s: CombatState, party: Party, m: MonsterInst, sp: SpellDef): boolean {
  if (sp.heal) return bandOf(s, m).some(hurt);
  if (sp.buff === 'bless') return !(s.foeBless[m.band] > 0);
  if (sp.buff === 'shield') return !(s.foeShield[m.band] > 0);
  if (sp.inflict) return rowFor(party, sp).some(({ c }) => !hasCondition(c, 'asleep'));
  return true;
}

/** Names as a line gives them: "Bram", "Bram and Idris", "Bram, Idris and Wren". */
const names = (cs: readonly Character[]): string => cs.length < 2 ? cs.map((c) => c.name).join('') : `${cs.slice(0, -1).map((c) => c.name).join(', ')} and ${cs[cs.length - 1].name}`;

/** A member takes a monster's blow or spell: a sleeper is woken by it, unless it fells them. Returns what the line adds. */
function struck(c: Character, dmg: number): string {
  const slept = hasCondition(c, 'asleep');
  damage(c, dmg);
  if (slept && !isDown(c) && dmg > 0) { removeCondition(c, 'asleep'); return ` ${c.name} wakes.`; }
  return '';
}

/** A monster's turn spent on a spell (`MonsterDef.cast`): at its level held to SPELLS_GROW_TO, unranked, with no Spellfire. */
function monsterCast(s: CombatState, party: Party, rng: RngInstance, m: MonsterInst, sp: SpellDef): void {
  const who = m.def.name;
  const dmgOf = (k: number): number => {
    let d = roll(rng, spellDice(sp, m.def.level), sp.sides ?? 4, 0);
    if (s.defending[k]) d = Math.ceil(d / 2);
    return s.glass && s.glass.element === sp.element ? Math.ceil(d / 2) : d;
  };
  if (sp.heal) {
    const mine = bandOf(s, m);
    if (sp.target === 'party') { for (const q of mine) q.hp = Math.min(q.def.hp, q.hp + foeHeal(m, sp)); s.log.push(`${who} casts ${sp.name}. ${bandName(mine)} ${isAre(mine)} healed.`); return; }
    const q = mine.reduce((a, b) => (b.hp / b.def.hp < a.hp / a.def.hp ? b : a));
    const n = Math.min(q.def.hp, q.hp + foeHeal(m, sp)) - q.hp;
    q.hp += n;
    s.log.push(q === m ? `${who} casts ${sp.name} and recovers ${n}.` : `${who} casts ${sp.name}: ${q.def.name} recovers ${n}.`);
    return;
  }
  if (sp.buff) {
    const mine = bandOf(s, m), group = bandName(mine);
    if (sp.buff === 'bless') { s.foeBless[m.band] = sp.turns ?? 5; s.log.push(`${who} casts ${sp.name}. ${group} ${isAre(mine)} blessed.`); }
    else { s.foeShield[m.band] = sp.turns ?? 5; s.log.push(`${who} casts ${sp.name}. A ward settles over ${mine.length === 1 ? mine[0].def.name : group === 'Its group' ? 'its group' : `the ${mine[0].def.plural}`}.`); }
    return;
  }
  if (sp.inflict) {
    const fell: Character[] = [];
    for (const { c } of rowFor(party, sp)) if (!hasCondition(c, sp.inflict) && rng.chance(SLUMBER_CHANCE)) { const before = c.conditions.length; addCondition(c, sp.inflict); if (c.conditions.length > before) fell.push(c); }
    s.log.push(fell.length ? `${who} casts ${sp.name}: ${names(fell)} ${fell.length === 1 ? 'falls' : 'fall'} asleep.` : `${who} casts ${sp.name}, but no one sleeps.`);
    return;
  }
  if (sp.target === 'enemy') {
    const pick = rng.pick(party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c)));
    if (!pick) return;
    const d = dmgOf(pick.i), woke = struck(pick.c, d);
    s.log.push(`${who} casts ${sp.name}: ${pick.c.name} takes ${d}.${woke}` + (isDown(pick.c) ? ` ${pick.c.name} falls!` : ''));
    return;
  }
  const row = sp.target === 'all' ? party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c)) : rowFor(party, sp);
  let total = 0, woke = '';
  for (const { c, i } of row) { const d = dmgOf(i); total += d; woke += struck(c, d); }
  const fell = row.map(({ c }) => c).filter(isDown);
  const where = sp.target === 'all' ? 'the party' : row[0] && row[0].i >= FRONT_ROW ? 'the back row' : 'the front row';
  s.log.push(`${who} casts ${sp.name}: ${total} damage to ${where}.${woke}` + (fell.length ? ` ${names(fell)} ${fell.length === 1 ? 'falls' : 'fall'}!` : ''));
}

/** Sleep is a fight's: its sleepers wake once it is over, won or fled. */
function wake(party: Party): void { for (const c of party.members) removeCondition(c, 'asleep'); }

/** The chance Slumber puts each one it falls on to sleep, cast by either side. */
export const SLUMBER_CHANCE = 0.7;

/** Resolve the acting monster's turn. */
export function monsterAct(s: CombatState, party: Party, rng: RngInstance): boolean {
  const t = currentTurn(s, party, rng);
  if (!t || t.side !== 'monster') return false;
  const m = s.monsters[t.i];
  // A caster may spend its turn on a spell; one in the back rank with nothing to cast and no bow holds.
  if (m.def.cast && rng.chance(m.def.cast.chance)) {
    const sp = monsterSpells(m.def).find((x) => castable(s, party, m, x));
    if (sp) { monsterCast(s, party, rng, m, sp); s.turn++; checkOutcome(s, party, rng); return true; }
  }
  if (m.back && !m.def.ranged && frontStands(s)) { s.turn++; checkOutcome(s, party, rng); return true; }
  const front = party.members.map((c, i) => ({ c, i })).filter(({ c, i }) => i < FRONT_ROW && !isDown(c));
  const any = party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c));
  const pool = m.def.ranged || front.length === 0 ? any : front;
  const pick = rng.pick(pool);
  if (!pick) { s.turn++; checkOutcome(s, party, rng); return true; }
  const ac = armorClass(pick.c) + (s.defending[pick.i] ? 4 : 0) + (s.shield > 0 ? WARD_AC : 0) + (s.edge?.(pick.c, s).ac ?? 0);
  if (rng.chance(toHit(monsterHit(s, m), ac))) {
    let dmg = roll(rng, m.def.dice, m.def.sides, m.def.bonus);
    if (s.defending[pick.i]) dmg = Math.ceil(dmg / 2);
    // A drain on spell points takes what it can of them, and the rest from hit points.
    const fromSp = m.def.drain === 'sp' ? Math.min(pick.c.sp, dmg) : 0;
    pick.c.sp -= fromSp;
    // A drain on hit points drinks what the member lost, never more than it had to lose.
    const had = pick.c.hp, woke = struck(pick.c, dmg - fromSp);
    if (m.def.drain === 'hp') m.hp = Math.min(m.def.hp, m.hp + Math.max(0, had - pick.c.hp));
    let line = fromSp === 0 ? `${m.def.name} hits ${pick.c.name} for ${dmg}${m.def.drain === 'hp' ? ' and drinks' : ''}.`
      : fromSp === dmg ? `${m.def.name} hits ${pick.c.name} for ${dmg} spell points.` : `${m.def.name} hits ${pick.c.name} for ${fromSp} spell points and ${dmg - fromSp}.`;
    line += woke;
    if (m.def.inflict && !isDown(pick.c) && rng.chance(m.def.inflict.chance)) { addCondition(pick.c, m.def.inflict.cond); line += ` ${pick.c.name} is ${m.def.inflict.cond}!`; }
    if (isDown(pick.c)) line += ` ${pick.c.name} falls!`;
    s.log.push(line);
  } else s.log.push(`${m.def.name} misses ${pick.c.name}.`);
  s.turn++;
  checkOutcome(s, party, rng);
  return true;
}

/** The least and the most share a fight paid, the same where all took one. */
export function shareRange(loot: Loot): [number, number] {
  return loot.shares.length ? [Math.min(...loot.shares), Math.max(...loot.shares)] : [0, 0];
}

/** The log's line for a won fight: what it was worth, or the least and most share where levels made them differ. */
export function victoryLine(loot: Loot): string {
  const [least, most] = shareRange(loot);
  return least === most ? `Victory! ${loot.xp} experience, ${loot.gold} gold.` : `Victory! ${least} to ${most} experience by level, ${loot.gold} gold.`;
}

/**
 * Who breaks (docs/MONSTERS.md §2, §3.3): once every leader in the fight is down its people leave it,
 * and a group's beasts once three in four of them are down; a `steady` monster never does, nor a kind
 * that does not break. The fled pay nothing.
 */
function morale(s: CombatState): void {
  const breaks = (m: MonsterInst, how: 'leader' | 'rout'): boolean => standing(m) && !m.def.steady && KINDS[m.def.kind].breaks === how;
  const leaders = s.monsters.filter((m) => isLeader(s, m));
  if (leaders.length && leaders.every((m) => !standing(m))) {
    const gone = s.monsters.filter((m) => breaks(m, 'leader'));
    for (const m of gone) m.fled = true;
    if (gone.length) s.log.push(BREAK_LINE(describe(gone), gone.length === 1));
  }
  s.groupIds.forEach((_, band) => {
    const beasts = s.monsters.filter((m) => m.band === band && !m.def.steady && KINDS[m.def.kind].breaks === 'rout');
    const down = beasts.filter((m) => !standing(m)).length;
    if (down * 4 < beasts.length * 3) return;
    const gone = beasts.filter((m) => breaks(m, 'rout'));
    for (const m of gone) m.fled = true;
    if (gone.length) s.log.push(ROUT_LINE(describe(gone), gone.length === 1));
  });
}

function checkOutcome(s: CombatState, party: Party, rng: RngInstance): void {
  if (s.outcome !== 'ongoing') return;
  if (party.members.every(isDown)) { s.outcome = 'defeat'; s.log.push('The party has fallen.'); return; }
  morale(s);
  if (s.monsters.every((m) => !standing(m))) {
    s.outcome = 'victory';
    wake(party);
    const loot: Loot = { xp: 0, shares: [], gold: 0, items: [], ready: [] };
    const slain = s.monsters.filter((q) => !q.fled);
    for (const m of slain) {
      loot.gold += rng.int(m.def.gold[0], m.def.gold[1]);
      for (const d of m.def.drops ?? []) if (rng.chance(d.chance)) loot.items.push(d.item);
    }
    // A kill pays each member by the monster's level against theirs, split among the living; the fled pay nothing.
    const alive = party.members.filter((c) => !hasCondition(c, 'dead'));
    const worth = alive.map((c) => slain.reduce((t, m) => t + m.def.xp * killPay(m.def.level, c.level), 0));
    loot.xp = Math.round(worth.reduce((t, w) => t + w, 0) / Math.max(1, worth.length));
    alive.forEach((c, k) => {
      const each = Math.floor(worth[k] / alive.length), before = canTrain(c);
      c.xp += each; loot.shares.push(each);
      if (!before && canTrain(c)) loot.ready.push(c.name);
    });
    party.gold += loot.gold;
    party.bag.push(...loot.items);
    s.loot = loot;
    s.log.push(victoryLine(loot));
  }
}
