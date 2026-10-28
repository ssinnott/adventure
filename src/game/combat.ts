// Turn-based combat resolver. Pure: every function takes the state, the party and the rng, and the
// only randomness is the rng handed in, so a fight replays byte-for-byte from a seed. The UI in
// ui/combat.ts reads CombatState and calls `partyAct` / `monsterAct`; nothing here draws. This is
// the fight's flow, from `startCombat` through the rounds and the turns to `checkOutcome`. Its
// parts, held to the same rule, are in game/combat/ (#1007): the state, the log's lines, the perks,
// the party's casting and the monsters' side; what it exported of theirs, it exports still.
import type { RngInstance } from '../lib/engine/rng.ts';
import { monster, monsterSpells } from './monsters.ts';
import { spell } from './spells.ts';
import { item, ELEMENT_DIE, chargesLeft } from './items.ts';
import {
  attackBonus, weaponOf, isDown, canAct, damage, addCondition, removeCondition, hasCondition, bonus, canTrain, killPay, armsBonus, prestigeOf,
  statOf, borne, useItem,
} from './party.ts';
import type { Party } from './party.ts';
import type { Tables } from './tables.ts';
import { FRONT_ROW, MAX_MONSTERS, HASTE_SPEED, describe, toHit, roll, standing, frontStands, aliveMonsters, HOLD_BREAKS } from './combat/state.ts';
import type { MonsterInst, TurnRef, PartyAction, Loot, CombatState, CombatOpts, CombatGroup } from './combat/state.ts';
import { STONE_LINE, victoryLine } from './combat/lines.ts';
import { blowsOf, vanished, songWards, weatherproof, buffHit, songDamage, traitDamage, canAttackFromRow } from './combat/perks.ts';
import { hurtMonster, elemental, castSpell } from './combat/casting.ts';
import {
  canReach, waits, monsterAc, monsterHit, guard, castable, struck, monsterCast, sweep, regenerate, dim, calledBy, canCall, clocked, beat, call,
  morale,
} from './combat/foes.ts';

// The old path: what this file exported of the parts before, given on, so no importer changed.
export type {
  MonsterInst, TurnRef, PartyAction, Outcome, Loot, CombatState, CombatOpts, Edge, Ranks, Clock, CombatGroup, Fighters,
} from './combat/state.ts';
export {
  asGroup, FRONT_ROW, MAX_MONSTERS, MAX_GROUPS, BLESS_HIT, HASTE_HIT, HASTE_SPEED, WARD_AC, toHit, standing, frontStands, isLeader,
  aliveMonsters, ROOTS_CHANCE, HOLD_BREAKS, SLUMBER_CHANCE,
} from './combat/state.ts';
export {
  BREAK_LINE, ROUT_LINE, GLOVE_LINE, STONE_LINE, GLASS_WORD, RITE_LINE, MEND_LINE, SMOULDER_LINE, CALL_LINE, DIM_LINE, THREAD_LINE, STAND_LINE,
  SWEEP_LINE, shareRange, victoryLine,
} from './combat/lines.ts';
export {
  PRESTIGE_BLOWS, BANNER_HIT, MARKSMAN_MORE, HOLY_STRIKE_RISEN, SNEAK_GROWTH, VANISH_ROUND, SONG_DMG, SONG_RISEN, rageBelow, blowsOf,
  sneakDamage, vanished, songWards, buffHit, songDamage, traitDamage, canAttackFromRow,
} from './combat/perks.ts';
export { pierces, castOnParty, castOnAlly } from './combat/casting.ts';
export { canReach, monsterAc, monsterHit, seenMult, sweptRow, canCall, panelStands, meetCalled } from './combat/foes.ts';
export { GLOVE_FLAG } from './keys.ts';

/** Start a fight with up to three groups, twelve monsters at most; each rank of a group is a group of the fight's. */
export function startCombat(tables: Tables, party: Party, groups: readonly CombatGroup[], rng: RngInstance, opts: CombatOpts = {}): CombatState {
  const monsters: MonsterInst[] = [];
  let rank = -1;
  groups.forEach((g, band) => {
    const front = g.monsters.length - Math.max(0, Math.min(g.back ?? 0, g.monsters.length - 1));
    g.monsters.forEach((m, k) => {
      if (monsters.length >= MAX_MONSTERS) return;
      if (k === 0 || k === front) rank++;
      const def = typeof m === 'string' ? monster(tables.monsters, m) : m;
      monsters.push({ def, hp: def.hp, group: rank, band, back: k >= front, fled: false, ...(g.under ? { under: g.under } : {}), conditions: [], flash: 0 });
    });
  });
  const ticking = groups.findIndex((g) => g.clock);
  const s: CombatState = {
    tables, monsters, groupIds: groups.map((g) => g.id), leaders: groups.map((g) => g.leader), round: 0, order: [], turn: 0, downAtStart: party.members.filter(isDown).length, bless: 0, shield: 0, haste: 0,
    ...(ticking >= 0 ? { clock: { ...groups[ticking].clock!, band: ticking, dim: 0 } } : {}),
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

function newRound(s: CombatState, party: Party, rng: RngInstance): void {
  s.round++;
  s.defending = party.members.map(() => false);
  const refs: { ref: TurnRef; speed: number }[] = [];
  const haste = s.haste > 0 ? HASTE_SPEED : 0;
  party.members.forEach((c, i) => { if (!isDown(c)) refs.push({ ref: { side: 'party', i }, speed: statOf(s.tables.items, c, 'speed') + haste + rng.range(0, 4) }); });
  s.monsters.forEach((m, i) => { if (standing(m)) refs.push({ ref: { side: 'monster', i }, speed: m.def.speed + rng.range(0, 4) }); });
  // A monk of the second prestige always acts first in a round; in the first, while an Arms Master
  // stands (game/skills.ts; #856), every member acts before any monster. The skill is read off the
  // member's list; nobody is born to it, and the skills test holds it to `hasSkill`'s answer.
  const armsMaster = s.round === 1 && party.members.some((c) => !isDown(c) && (c.skills?.includes('arms_master') ?? false));
  const first = (r: TurnRef): number => (r.side !== 'party' ? 0 : party.members[r.i].cls === 'monk' && prestigeOf(party.members[r.i]) >= 2 ? 2 : armsMaster ? 1 : 0);
  refs.sort((a, b) => first(b.ref) - first(a.ref) || b.speed - a.speed);
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
  regenerate(s);
  beat(s);
  dim(s);
  for (const c of party.members) {
    if (hasCondition(c, 'poisoned') && !isDown(c)) { damage(s.tables.items, c, 1); s.log.push(`${c.name} suffers from poison.`); }
    if (hasCondition(c, 'paralysed') && rng.chance(0.35)) { removeCondition(c, 'paralysed'); s.log.push(`${c.name} can move again.`); }
  }
  checkOutcome(s, party, rng);
}

/** Resolve the acting character's action. Returns false if the action was not legal (nothing happens). */
export function partyAct(s: CombatState, party: Party, rng: RngInstance, action: PartyAction): boolean {
  const t = currentTurn(s, party, rng);
  if (!t || t.side !== 'party') return false;
  const c = party.members[t.i];
  switch (action.type) {
    case 'attack': {
      let m = s.monsters[action.target];
      if (!m || !canAttackFromRow(s.tables.items, c, t.i) || !canReach(s, c, action.target)) return false;
      const w = weaponOf(s.tables.items, c), edge = s.edge?.(c, s);
      const blows = blowsOf(s.tables.items, c) + (edge ? edge.blows - 1 : 0), song = songDamage(party);
      for (let blow = 0; blow < blows; blow++) {
        // A later blow falls on the weakest foe still standing, once the first's has fallen.
        if (!standing(m)) { const left = aliveMonsters(s).filter((i) => canReach(s, c, i)); if (!left.length) break; m = s.monsters[left.reduce((a, b) => (s.monsters[b].hp < s.monsters[a].hp ? b : a))]; }
        const hit = rng.chance(toHit(attackBonus(s.tables.items, c) + buffHit(s, party, t.i) - (w.ranged && !weatherproof(c) ? s.rangedPenalty : 0), monsterAc(s, m)));
        if (hit) {
          // An elemental weapon adds a die of its element to the steel, which lands as ever.
          const dmg = roll(rng, w.dice ?? 1, w.sides ?? 4, (w.bonus ?? 0) + (w.ranged ? 0 : bonus(statOf(s.tables.items, c, 'might'))) + traitDamage(s, c, w, m) + armsBonus(c) + song + (edge?.damage ?? 0))
            + (w.element ? elemental(s, m, w.element, roll(rng, 1, ELEMENT_DIE, 0)) : 0);
          hurtMonster(s, m, dmg);
          s.log.push(`${c.name} hits ${m.def.name} for ${dmg}.` + (m.hp <= 0 ? ` ${m.def.name} dies.` : ''));
        } else s.log.push(`${c.name} misses ${m.def.name}.`);
      }
      break;
    }
    case 'cast': {
      const sp = spell(s.tables.spells, action.spellId);
      if (sp.context === 'explore' || (sp.glass && !action.element)) return false;
      // An artifact's spell (#847): its bearer casts it for a charge, not spell points, whatever they know.
      if (action.from) {
        if (item(s.tables.items, action.from).casts?.spell !== sp.id || !borne(s.tables.items, c).includes(action.from) || chargesLeft(s.tables.items, party, action.from) < 1) return false;
        (party.spent ??= {})[action.from] = (party.spent[action.from] ?? 0) + 1;
        castSpell(s, party, rng, c, sp, action.target, action.element, true);
        break;
      }
      if (!c.spells.includes(sp.id) || c.sp < sp.sp) return false;
      c.sp -= sp.sp;
      castSpell(s, party, rng, c, sp, action.target, action.element);
      break;
    }
    case 'defend':
      s.defending[t.i] = true;
      s.log.push(`${c.name} braces.`);
      break;
    case 'use': {
      const d = item(s.tables.items, action.itemId), target = party.members[action.target];
      const said = target ? useItem(s.tables.items, party, c, d.id, target) : null;
      if (!said) return false;
      s.log.push(...said);
      break;
    }
    case 'flee': {
      const up = party.members.filter((m) => !isDown(m));
      const ps = up.reduce((a, m) => a + statOf(s.tables.items, m, 'speed'), 0) / Math.max(1, up.length);
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

/** Sleep is a fight's: its sleepers wake once it is over, won or fled. */
function wake(party: Party): void { for (const c of party.members) removeCondition(c, 'asleep'); }

/** Resolve the acting monster's turn. */
export function monsterAct(s: CombatState, party: Party, rng: RngInstance): boolean {
  const t = currentTurn(s, party, rng);
  if (!t || t.side !== 'monster') return false;
  const m = s.monsters[t.i];
  // A caller may spend its turn bringing its group in, while the fight has room for the whole of it;
  // the clock's caller never does, calling on the clock's beat instead (`beat`).
  if (m.def.calls && !clocked(s, m) && canCall(s, m) && rng.chance(m.def.calls.chance)) { call(s, m, calledBy(s.tables.monsters, m.def)); s.turn++; checkOutcome(s, party, rng); return true; }
  // A caster may spend its turn on a spell; one in the back rank with nothing to cast or call and no bow holds.
  if (m.def.cast && rng.chance(m.def.cast.chance)) {
    const sp = monsterSpells(s.tables.spells, m.def).find((x) => castable(s, party, m, x));
    if (sp) { monsterCast(s, party, rng, m, sp); s.turn++; checkOutcome(s, party, rng); return true; }
  }
  // A sweeper may spend its turn on a row: a breath from either rank, as a spell, an arm only where its blows reach.
  const holds = m.back && !m.def.ranged && frontStands(s);
  if (m.def.sweep && (m.def.sweep.element || !holds) && rng.chance(m.def.sweep.chance) && sweep(s, party, rng, m)) { s.turn++; checkOutcome(s, party, rng); return true; }
  if (holds) { s.turn++; checkOutcome(s, party, rng); return true; }
  // A thief gone from sight is no one's mark, while anyone else is.
  const seen = party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c) && !vanished(s, c));
  const front = seen.filter(({ i }) => i < FRONT_ROW);
  const any = seen.length ? seen : party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c));
  // From under the ice it reaches one square, the front row over it, bow or none; with that row down, nobody.
  const pool = m.under ? front : m.def.ranged || front.length === 0 ? any : front;
  const pick = rng.pick(pool);
  if (!pick) { s.turn++; checkOutcome(s, party, rng); return true; }
  if (rng.chance(toHit(monsterHit(s, m), guard(s, pick.c, pick.i)))) {
    let dmg = roll(rng, m.def.dice, m.def.sides, m.def.bonus);
    if (s.defending[pick.i]) dmg = Math.ceil(dmg / 2);
    // A drain on spell points takes what it can of them, and the rest from hit points.
    const fromSp = m.def.drain === 'sp' ? Math.min(pick.c.sp, dmg) : 0;
    pick.c.sp -= fromSp;
    // A drain on hit points drinks what the member lost, never more than it had to lose.
    const had = pick.c.hp, woke = struck(s.tables.items, party, pick.c, dmg - fromSp);
    if (m.def.drain === 'hp') m.hp = Math.min(m.def.hp, m.hp + Math.max(0, had - pick.c.hp));
    let line = fromSp === 0 ? `${m.def.name} hits ${pick.c.name} for ${dmg}${m.def.drain === 'hp' ? ' and drinks' : ''}.`
      : fromSp === dmg ? `${m.def.name} hits ${pick.c.name} for ${dmg} spell points.` : `${m.def.name} hits ${pick.c.name} for ${fromSp} spell points and ${dmg - fromSp}.`;
    line += woke;
    // The line says only what takes: not on one it cannot touch (Faith keeps a curse off a cleric), nor again;
    // one turned to glass is said so, and not as fallen.
    if (m.def.inflict && !isDown(pick.c) && !songWards(party, m.def.inflict.cond) && rng.chance(m.def.inflict.chance)) {
      const k = m.def.inflict.cond, had = hasCondition(pick.c, k);
      addCondition(s.tables.items, pick.c, k);
      if (!had && hasCondition(pick.c, k)) line += ` ${k === 'stoned' ? STONE_LINE(pick.c.name) : `${pick.c.name} is ${k}!`}`;
    }
    if (isDown(pick.c) && !hasCondition(pick.c, 'stoned')) line += ` ${pick.c.name} falls!`;
    s.log.push(line);
  } else s.log.push(`${m.def.name} misses ${pick.c.name}.`);
  s.turn++;
  checkOutcome(s, party, rng);
  return true;
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
