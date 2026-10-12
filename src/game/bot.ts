// The bot: a plain player's fight, the game's and the gate's alike. The combat screen plays the
// party's turns by it while auto is on (ui/combat.ts, #714), and tools/gate.ts measures every map by
// it. It mends the weakest when someone is under 40%, or in the row a foe that sweeps would take
// under the most one sweep could deal them, so that none of the front row falls to one sweep and it
// never turns on the back row, and while a foe breathes, one of the front row fallen first, since a
// breath takes the row with more standing (#549); else the strongest damage spell it can afford,
// else a weapon, else brace. It aims at a leader where it can reach one, since the people break at
// its fall, or at a caller while the fight has room for its call, or at a light whose touch takes
// spell points, since its fall keeps the casters' points, and else a weapon at the first foe it
// reaches. Once it has seen what an element does to a foe it casts the element that foe is weakest
// to, and never one it has seen do nothing to any foe still standing; once it has seen a foe mend, it
// burns it with fire each round before it casts anything else. It reads the fight as it stands each
// turn, the groups called into it too. It wakes a sleeper or frees one held (#549) of the front row,
// or a caster, before it strikes. It never sleeps, blesses, drinks or flees, nor cures anything but
// sleep and a hold, so it is weaker than a player. In the game it knows a foe's sweep, breath, drain
// and call only once the company has seen them (`shown`), and no leader, which shows only in its
// fall; the gate reads them all from the first turn. Between fights the company rests by `mustRest`,
// the harness's rule and the pilot's.
import type { RngInstance } from '../lib/engine/rng.ts';
import { isDown, hasCondition } from './party.ts';
import type { Party, Character } from './party.ts';
import { partyAct, aliveMonsters, canAttackFromRow, canReach, isLeader, canCall, sweptRow, seenMult, FRONT_ROW } from './combat.ts';
import type { CombatState, PartyAction } from './combat.ts';
import { spell } from './spells.ts';
import type { SpellDef, SpellTarget } from './spells.ts';

/** How far a damage spell reaches; the bot casts the widest it can afford. */
const REACH: Partial<Record<SpellTarget, number>> = { all: 3, group: 2, enemy: 1 };

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
 * The foe the bots aim at first among `foes`: a leader, since the people break at its fall, else a
 * caller while the fight has room for its call, since its fall stops the fight growing (`canCall`),
 * else one whose touch takes spell points (`drain: 'sp'`, the lights), since its fall keeps the
 * casters' points.
 */
export function markOf(s: CombatState, foes: readonly number[]): number | undefined {
  return foes.find((f) => isLeader(s, s.monsters[f])) ?? foes.find((f) => canCall(s, s.monsters[f])) ?? foes.find((f) => s.monsters[f].def.drain === 'sp');
}

/**
 * The bots' answers a tool may switch off to see a fight without one: the sweep's (`mendLines`,
 * #545), the hold's (`wakeWith`, #549) and the breath's (`breathGuard`, #549).
 */
export const ANSWER = { sweep: true, hold: true, breath: true };

/**
 * The fallen member of the front row the bots raise first while a foe that breathes stands (#549): a
 * breath falls on the row with more standing in it, so one of the front row down turns it on the
 * casters, and raised it takes the front again. None where the front row has as many standing as the
 * back, or none of it is only fallen.
 */
export function breathGuard(s: CombatState, p: Party): number | undefined {
  if (!ANSWER.breath || !aliveMonsters(s).some((f) => s.monsters[f].def.sweep?.element && !s.monsters[f].under)) return undefined;
  const up = (back: boolean): number => p.members.filter((m, j) => (j >= FRONT_ROW) === back && !isDown(m)).length;
  if (up(true) <= up(false)) return undefined;
  const j = p.members.findIndex((m, k) => k < FRONT_ROW && hasCondition(m, 'unconscious') && !hasCondition(m, 'dead') && !hasCondition(m, 'stoned'));
  return j < 0 ? undefined : j;
}

/**
 * The hit points under which the bots mend each member, by their slot: 40% of their own, or, in the
 * row a foe that sweeps would take (`sweptRow`, #545), the most one sweep of it could deal them where
 * that is more. So the front row's hit points are spread, none of it falls to one sweep, and the
 * sweep never turns on the back row.
 */
export function mendLines(s: CombatState, p: Party): number[] {
  const at = p.members.map((m) => m.maxHp * 0.4);
  for (const f of ANSWER.sweep ? aliveMonsters(s) : []) {
    const m = s.monsters[f], d = m.def;
    if (d.sweep) for (const { i } of sweptRow(p, m)) at[i] = Math.max(at[i], d.dice * d.sides + d.bonus);
  }
  return at;
}

/** The damage spell the bot would cast at the fight's first foe, or its mark: none if it can afford none worth casting. */
export function gateBlast(s: CombatState, c: Character): SpellDef | undefined {
  const foes = aliveMonsters(s), foe = markOf(s, foes) ?? foes[0];
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
 * The fight as the company has seen it: each foe's sweep or breath, drain and call only once it has
 * shown them (`shown`), and no leader, which shows only in its fall. What it has seen mend and what
 * the elements do it reads as it is (`mends`, `seen`).
 */
function sighted(s: CombatState): CombatState {
  return {
    ...s,
    leaders: s.leaders.map(() => undefined),
    monsters: s.monsters.map((m) => {
      const k = s.shown?.[m.def.id] ?? {};
      return { ...m, def: { ...m.def, sweep: k.sweep && m.def.sweep, drain: k.drain && m.def.drain, calls: k.calls && m.def.calls } };
    }),
  };
}

/**
 * The bot's turn for member `i`: the action it took, in gateTurn's order (mend, wake, burn, blast,
 * strike, brace). It reads the fight as the company has seen it (`sighted`); `omniscient`, every
 * foe's traits from the first turn, as the gate does.
 */
export function botTurn(s: CombatState, p: Party, rng: RngInstance, i: number, omniscient = false): PartyAction {
  const v = omniscient ? s : sighted(s);
  const c = p.members[i], foes = aliveMonsters(v), lead = markOf(v, foes), foe = lead ?? foes[0];
  const blade = lead !== undefined && canReach(v, c, lead) ? lead : foes.find((f) => canReach(v, c, f)) ?? foe;
  const known = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
  const lines = mendLines(v, p), guard = breathGuard(v, p);
  const low = guard !== undefined ? { m: p.members[guard], j: guard } : p.members.map((m, j) => ({ m, j })).filter(({ m, j }) => !isDown(m) && m.hp < lines[j]).sort((a, b) => a.m.hp - b.m.hp)[0];
  const mend = known.filter((x) => x.heal && !x.raise).sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
  const blast = gateBlast(v, c), sleeper = wakeWith(p, c), burn = gateBurn(v, c);
  // A refused action changes nothing, so each is weighed before any is tried.
  const tries: (PartyAction | false | undefined)[] = [
    low && mend && { type: 'cast', spellId: mend.id, target: low.j },
    sleeper && { type: 'cast', ...sleeper },
    burn && { type: 'cast', ...burn },
    blast && { type: 'cast', spellId: blast.id, target: foe },
    canAttackFromRow(c, i) && { type: 'attack', target: blade },
  ];
  for (const a of tries) if (a && partyAct(s, p, rng, a)) return a;
  const brace: PartyAction = { type: 'defend' };
  partyAct(s, p, rng, brace);
  return brace;
}

/** The gate's turn for member `i`: the bot's, reading every foe's traits from the first turn. */
export function gateTurn(s: CombatState, p: Party, rng: RngInstance, i: number): void { botTurn(s, p, rng, i, true); }

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
