// The bot that plays the party's turns in a fight: the gate's and the harness's measure of every map
// (tools/gate.ts, tools/harness.ts) and the game's own auto-fight (ui/combat.ts, the pilot's, #713).
// It mends the weakest when someone is under 40%, or in the row a foe that sweeps would take under
// the most one sweep could deal them, so that none of the front row falls to one sweep and it never
// turns on the back row, and while a foe breathes, one of the front row fallen first, since a breath
// takes the row with more standing (#549); else the strongest damage spell it can afford, else a
// weapon, else brace. It aims at a leader where it can reach one, since the people break at its fall,
// or at a caller while the fight has room for its call, or at a light whose touch takes spell points,
// since its fall keeps the casters' points, and else a weapon at the first foe it reaches. Once it has
// seen what an element does to a foe it casts the element that foe is weakest to, and never one it
// has seen do nothing to any foe still standing; once it has seen a foe mend, it burns it with fire
// each round before it casts anything else. It reads the fight as it stands each turn, the groups
// called into it too. It wakes a sleeper or frees one held (#549) of the front row, or a caster,
// before it strikes. It never sleeps, blesses or drinks, nor cures anything but sleep and a hold, so
// it is weaker than a player; the gate's never flees, the game's flees a fight lost (`beaten`, #723).
// The gate's knows every monster as written (`asWritten`); the
// game's knows a sweep, a breath, a drain, a call or a leader only once the fight has shown it
// (`asSeen`), as both know an element's work and a mending only once seen. The rest rule is here too
// (`mustRest`), the harness's and the pilot's. Nothing here reads tools/ or node: the game is built
// with it.
import type { RngInstance } from '../lib/engine/rng.ts';
import { isDown, hasCondition } from './party.ts';
import type { Party, Character } from './party.ts';
import { partyAct, aliveMonsters, canAttackFromRow, canReach, isLeader, canCall, sweptRow, seenMult, FRONT_ROW } from './combat.ts';
import type { CombatState, MonsterInst, PartyAction } from './combat.ts';
import { spell } from './spells.ts';
import type { SpellDef, SpellTarget } from './spells.ts';

/**
 * A company must rest once anyone in it is under this share of their hit points after mending, or it
 * is under this share of its spell points.
 */
export const REST_AT = 0.25;

/** What a company has left of its hit points (a fallen member's counting none) and spell points, and what it has whole. */
export function pools(p: Party): { hp: number; maxHp: number; sp: number; maxSp: number } {
  const t = { hp: 0, maxHp: 0, sp: 0, maxSp: 0 };
  for (const c of p.members) { t.maxHp += c.maxHp; t.maxSp += c.maxSp; t.sp += c.sp; if (!isDown(c)) t.hp += Math.min(c.maxHp, c.hp); }
  return t;
}

/**
 * Whether the company must rest before its next fight, and why: someone is dead, someone is still
 * under REST_AT of their hit points once it has mended what it can, or it is under REST_AT of its
 * spell points.
 */
export function mustRest(p: Party): 'dead' | 'hp' | 'sp' | null {
  if (p.members.some((m) => hasCondition(m, 'dead') || hasCondition(m, 'stoned'))) return 'dead';
  if (p.members.some((m) => m.hp < m.maxHp * REST_AT)) return 'hp';
  const t = pools(p);
  if (t.maxSp && t.sp < t.maxSp * REST_AT) return 'sp';
  return null;
}

/** What a monster does that a bot answers, and that a player learns only by seeing it done. */
export type Trait = 'sweep' | 'breath' | 'drain' | 'calls' | 'leader';

/**
 * What a bot knows of a monster: whether it may count on the trait. Where it may not, it plays as if
 * the monster had none. An element's work (`seenMult`) and a mending (`CombatState.mends`) are known
 * only once seen in either reading, since the fight records them.
 */
export type Sees = (s: CombatState, m: MonsterInst, trait: Trait) => boolean;

/** The gate's reading: every monster as written, each trait known before it shows. */
export const asWritten: Sees = () => true;

/**
 * The game's reading, the auto-fight's: a trait once this fight's log shows one of the monster's name
 * at it, as the player reads it (a sweep, a breath, a blow that drinks or takes spell points, a call).
 * A leader shows only in its fall, the people breaking at the last one's, so it is never known first.
 */
export const asSeen: Sees = (s, m, trait) => {
  if (trait === 'leader') return false;
  const n = m.def.name, head = { sweep: `${n} sweeps `, breath: `${n} breathes `, calls: `${n} calls, `, drain: `${n} hits ` }[trait];
  return s.log.some((l) => l.startsWith(head) && (trait !== 'drain' || l.includes(' and drinks') || l.includes(' spell points')));
};

/**
 * The bots' answer to sleep and to a hold (#549: the bells, the vines and the machines' clamps): the
 * sleeper to wake or the held to free, a member of the front row first and then a caster, and the
 * cheapest spell the member can afford that lifts it; none if no one need be freed. One of the back
 * row with no spells is left to wake or break free of itself.
 */
export function wakeWith(p: Party, c: Character): { spellId: string; target: number } | undefined {
  const cures = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.target === 'ally' && x.sp <= c.sp).sort((a, b) => a.sp - b.sp);
  const lifts = (m: Character): SpellDef | undefined => cures.find((x) => x.cure?.some((k) => (k === 'asleep' || (k === 'paralysed' && ANSWER.hold)) && hasCondition(m, k)));
  const bound = p.members.map((m, j) => ({ m, j, x: lifts(m) })).filter(({ m, x }) => x && !isDown(m));
  const who = bound.find(({ j }) => j < FRONT_ROW) ?? bound.find(({ m }) => m.maxSp > 0);
  return who && { spellId: who.x!.id, target: who.j };
}

/**
 * The foe the bots aim at first among `foes`: under the clock, one at its panel, since their fall
 * stops the calls and holds the light (`Clock`, ANSWER.clock); then a leader, since the people break
 * at its fall, else a caller while the fight has room for its call, since its fall stops the fight
 * growing (`canCall`), else one whose touch takes spell points (`drain: 'sp'`, the lights), since its
 * fall keeps the casters' points. A leader, a caller and a light only where `sees` knows them so.
 */
export function markOf(s: CombatState, foes: readonly number[], sees: Sees = asWritten): number | undefined {
  const c = s.clock, called = c && (typeof c.calls === 'string' ? c.calls : c.calls.id);
  const first = !c || ANSWER.clock === 'leader' ? undefined : foes.find((f) => (ANSWER.clock === 'panel' ? c.panel.includes(s.monsters[f].def.id) : s.monsters[f].def.id === called));
  const knows = (f: number, t: Trait): boolean => sees(s, s.monsters[f], t);
  return first ?? foes.find((f) => isLeader(s, s.monsters[f]) && knows(f, 'leader')) ?? foes.find((f) => canCall(s, s.monsters[f]) && knows(f, 'calls')) ?? foes.find((f) => s.monsters[f].def.drain === 'sp' && knows(f, 'drain'));
}

/**
 * The bots' answers a tool may switch off to see a fight without one: the sweep's (`mendLines`,
 * #545), the hold's (`wakeWith`, #549) and the breath's (`breathGuard`, #549); and the clock's
 * (`markOf`, #748), the panel first, which a tool may turn to the leader first or to what the clock
 * calls as it comes, letting the clock run.
 */
export const ANSWER = { sweep: true, hold: true, breath: true, clock: 'panel' as 'panel' | 'leader' | 'called' };

/**
 * The fallen member of the front row the bots raise first while a foe that breathes stands (#549): a
 * breath falls on the row with more standing in it, so one of the front row down turns it on the
 * casters, and raised it takes the front again. None where the front row has as many standing as the
 * back, or none of it is only fallen. A breather only where `sees` knows it breathes.
 */
export function breathGuard(s: CombatState, p: Party, sees: Sees = asWritten): number | undefined {
  if (!ANSWER.breath || !aliveMonsters(s).some((f) => s.monsters[f].def.sweep?.element && !s.monsters[f].under && sees(s, s.monsters[f], 'breath'))) return undefined;
  const up = (back: boolean): number => p.members.filter((m, j) => (j >= FRONT_ROW) === back && !isDown(m)).length;
  if (up(true) <= up(false)) return undefined;
  const j = p.members.findIndex((m, k) => k < FRONT_ROW && hasCondition(m, 'unconscious') && !hasCondition(m, 'dead') && !hasCondition(m, 'stoned'));
  return j < 0 ? undefined : j;
}

/**
 * The hit points under which the bots mend each member, by their slot: 40% of their own, or, in the
 * row a foe that sweeps would take (`sweptRow`, #545), the most one sweep of it could deal them where
 * that is more. So the front row's hit points are spread, none of it falls to one sweep, and the
 * sweep never turns on the back row. A sweep or a breath only where `sees` knows it.
 */
export function mendLines(s: CombatState, p: Party, sees: Sees = asWritten): number[] {
  const at = p.members.map((m) => m.maxHp * 0.4);
  for (const f of ANSWER.sweep ? aliveMonsters(s) : []) {
    const m = s.monsters[f], d = m.def;
    if (d.sweep && sees(s, m, d.sweep.element ? 'breath' : 'sweep')) for (const { i } of sweptRow(p, m)) at[i] = Math.max(at[i], d.dice * d.sides + d.bonus);
  }
  return at;
}

/** How far a damage spell reaches; the bot casts the widest it can afford. */
const REACH: Partial<Record<SpellTarget, number>> = { all: 3, group: 2, enemy: 1 };

/** The damage spell the bot would cast at the fight's first foe, or its mark (by `sees`): none if it can afford none worth casting. */
export function gateBlast(s: CombatState, c: Character, sees: Sees = asWritten): SpellDef | undefined {
  const foes = aliveMonsters(s), foe = markOf(s, foes, sees) ?? foes[0];
  if (foe === undefined) return undefined;
  const mult = (x: SpellDef): number => seenMult(s, s.monsters[foe], x.element);
  return c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp && x.dice && REACH[x.target] && foes.some((f) => seenMult(s, s.monsters[f], x.element) > 0))
    .sort((a, b) => mult(b) - mult(a) || REACH[b.target]! - REACH[a.target]! || b.dice! * b.sides! - a.dice! * a.sides!)[0];
}

/**
 * The bots' answer to what mends (`MonsterDef.regen`): once the company has seen a foe mend, the
 * member's widest, strongest fire spell at the first such foe not yet burnt this round, where it can
 * afford one and has not seen fire do nothing to it; none else.
 */
export function gateBurn(s: CombatState, c: Character): { spellId: string; target: number } | undefined {
  const target = aliveMonsters(s).find((f) => { const m = s.monsters[f]; return !!s.mends?.[m.def.id] && !m.burnt && seenMult(s, m, 'fire') > 0; });
  if (target === undefined) return undefined;
  const fire = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp && x.element === 'fire' && REACH[x.target])
    .sort((a, b) => REACH[b.target]! - REACH[a.target]! || b.dice! * b.sides! - a.dice! * a.sides!)[0];
  return fire && { spellId: fire.id, target };
}

/**
 * The bot's turn for member `i`: the action it took, in gateTurn's order (mend, wake, burn, blast,
 * strike, brace). Each is tried on the resolver in turn and the first it takes is the turn; bracing
 * it always takes. `sees` is what it knows of the monsters: the gate's every trait as written, the
 * game's auto-fight only what the fight has shown (`asSeen`).
 */
export function botTurn(s: CombatState, p: Party, rng: RngInstance, i: number, sees: Sees = asWritten): PartyAction {
  // The game's bot flees a fight it has lost (#723); the gate's never does, so its figures stand.
  if (sees !== asWritten && beaten(s, p) && partyAct(s, p, rng, { type: 'flee' })) return { type: 'flee' };
  const c = p.members[i], foes = aliveMonsters(s), lead = markOf(s, foes, sees), foe = lead ?? foes[0];
  const blade = lead !== undefined && canReach(s, c, lead) ? lead : foes.find((f) => canReach(s, c, f)) ?? foe;
  const known = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
  const lines = mendLines(s, p, sees), guard = breathGuard(s, p, sees);
  const low = guard !== undefined ? { m: p.members[guard], j: guard } : p.members.map((m, j) => ({ m, j })).filter(({ m, j }) => !isDown(m) && m.hp < lines[j]).sort((a, b) => a.m.hp - b.m.hp)[0];
  const mend = known.filter((x) => x.heal && !x.raise).sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
  const blast = gateBlast(s, c, sees);
  const took = (a: PartyAction): PartyAction | undefined => (partyAct(s, p, rng, a) ? a : undefined);
  let a: PartyAction | undefined;
  if (low && mend && (a = took({ type: 'cast', spellId: mend.id, target: low.j }))) return a;
  const sleeper = wakeWith(p, c);
  if (sleeper && (a = took({ type: 'cast', ...sleeper }))) return a;
  const burn = gateBurn(s, c);
  if (burn && (a = took({ type: 'cast', ...burn }))) return a;
  if (blast && (a = took({ type: 'cast', spellId: blast.id, target: foe }))) return a;
  if (canAttackFromRow(c, i) && (a = took({ type: 'attack', target: blade }))) return a;
  const brace: PartyAction = { type: 'defend' };
  partyAct(s, p, rng, brace);
  return brace;
}

/**
 * Whether a fight is lost, as the screen shows it (#723): one of the company down, and as many foes
 * standing as members. The game's bot then flees (`botTurn` with any reading but `asWritten`).
 */
export function beaten(s: CombatState, p: Party): boolean {
  const up = p.members.filter((m) => !isDown(m)).length;
  return up < p.members.length && aliveMonsters(s).length >= up;
}

/** The bot's turn for member `i`, as the gate plays it: `botTurn`, the action not wanted. */
export function gateTurn(s: CombatState, p: Party, rng: RngInstance, i: number): void { botTurn(s, p, rng, i); }
