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
// before it strikes. Behind an option each (`BotOpts`, #853), for a member of level 11 or over
// (`FIRST_PAST_ACT_I`), it blesses in a fight's first round against three foes or more, by the knower
// whose turn is worth least, sleeps the group with the most it could put down (a sorcerer's Slumber,
// a druid's Grasping Roots) and lets the sleepers lie while another of the company can strike, and
// gives a draught to the lowest where no one can mend them, or to a sleeper or one held no one can
// free; so its turn is mend, wake, burn, bless, sleep, blast, drink, strike, brace. It cures nothing
// but sleep and a hold, so it is weaker than a player. Plainly: the gate's bot never blesses, sleeps,
// drinks or flees (no option set, #865, and a flight only turns a win into a loss where the gate
// measures whether a fight is winnable); the game's, the auto-fight and the pilot's fights, blesses,
// sleeps and drinks from level 11 (`PLAYED`, #865) and flees a fight lost as #723 built it (`beaten`).
// The gate's knows every monster as written (`asWritten`); the game's knows a sweep, a breath, a
// drain, a call or a leader only once the fight has shown it, and a foe Slumber cannot take once a
// Slumber has taken none of its kind (`asSeen`), as both know an element's work and a mending only
// once seen. The rest rule is here too (`mustRest`), the harness's and the pilot's. Nothing here
// reads tools/ or node: the game is built with it.
import type { RngInstance } from '../lib/engine/rng.ts';
import { isDown, canAct, hasCondition } from './party.ts';
import type { Party, Character, ClassId } from './party.ts';
import { partyAct, aliveMonsters, canAttackFromRow, canReach, isLeader, canCall, sweptRow, seenMult, FRONT_ROW } from './combat.ts';
import type { CombatState, MonsterInst, PartyAction } from './combat.ts';
import { monsterImmune } from './monsters.ts';
import { item } from './items.ts';
import type { ItemDef } from './items.ts';
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

/**
 * What a monster does that a bot answers, and that a player learns only by seeing it done; and what
 * it is proof against of the company's sleep (#853): Slumber (`sleepless`) or the roots (`unheld`).
 */
export type Trait = 'sweep' | 'breath' | 'drain' | 'calls' | 'leader' | 'sleepless' | 'unheld';

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
 * One Slumber cannot take shows once a Slumber has put none of its kind to sleep; one the roots cannot
 * hold never does, since their failure names no one (none is so, as built).
 */
export const asSeen: Sees = (s, m, trait) => {
  if (trait === 'leader' || trait === 'unheld') return false;
  if (trait === 'sleepless') return s.log.some((l) => l.endsWith(`: 0 of the ${m.def.plural} fall asleep.`));
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
  const who = freeFirst(p, (m) => cures.find((x) => x.cure?.some((k) => frees(m, k))));
  return who && { spellId: who.x.id, target: who.j };
}

/** Whether `m` lies under what a cure of `k` lifts that the bots free: sleep, and a hold while ANSWER.hold. */
const frees = (m: Character, k: string): boolean => (k === 'asleep' || (k === 'paralysed' && ANSWER.hold)) && hasCondition(m, k);

/** Of the members not down that `lift` frees, the one the bots free first (`wakeWith`), and with what. */
function freeFirst<T>(p: Party, lift: (m: Character) => T | undefined): { x: T; j: number } | undefined {
  const bound = p.members.map((m, j) => ({ m, j, x: lift(m) })).filter(({ m, x }) => x !== undefined && !isDown(m));
  const who = bound.find(({ j }) => j < FRONT_ROW) ?? bound.find(({ m }) => m.maxSp > 0);
  return who && { x: who.x!, j: who.j };
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

/** Whether a foe sleeps, so that a blow or a spell that reaches it wakes it. */
export const sleeps = (m: MonsterInst): boolean => m.conditions.includes('asleep');

/** Whether a spell over many cast at foe `f` would wake a sleeper (#853): one of its group asleep, or of every foe for a spell at all. */
export function wakesMany(s: CombatState, x: SpellDef, f: number): boolean {
  return x.target !== 'enemy' && aliveMonsters(s).some((g) => sleeps(s.monsters[g]) && (x.target === 'all' || s.monsters[g].group === s.monsters[f].group));
}

/**
 * The damage spell the bot would cast at the fight's first foe, or its mark (by `sees`): none if it
 * can afford none worth casting. Given `at`, the foe it is cast at, it lets sleepers lie (#853): no
 * spell over many that would wake one (`wakesMany`).
 */
export function gateBlast(s: CombatState, c: Character, sees: Sees = asWritten, at?: number): SpellDef | undefined {
  const foes = aliveMonsters(s), foe = at ?? markOf(s, foes, sees) ?? foes[0];
  if (foe === undefined) return undefined;
  const mult = (x: SpellDef): number => seenMult(s, s.monsters[foe], x.element);
  return c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp && x.dice && REACH[x.target] && foes.some((f) => seenMult(s, s.monsters[f], x.element) > 0) && (at === undefined || !wakesMany(s, x, at)))
    .sort((a, b) => mult(b) - mult(a) || REACH[b.target]! - REACH[a.target]! || b.dice! * b.sides! - a.dice! * a.sides!)[0];
}

/**
 * The bots' answer to what mends (`MonsterDef.regen`): once the company has seen a foe mend, the
 * member's widest, strongest fire spell at the first such foe not yet burnt this round, where it can
 * afford one and has not seen fire do nothing to it; none else. With `lie`, none over many that would
 * wake a sleeper (#853).
 */
export function gateBurn(s: CombatState, c: Character, lie = false): { spellId: string; target: number } | undefined {
  const target = aliveMonsters(s).find((f) => { const m = s.monsters[f]; return !!s.mends?.[m.def.id] && !m.burnt && seenMult(s, m, 'fire') > 0; });
  if (target === undefined) return undefined;
  const fire = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp && x.element === 'fire' && REACH[x.target] && !(lie && wakesMany(s, x, target)))
    .sort((a, b) => REACH[b.target]! - REACH[a.target]! || b.dice! * b.sides! - a.dice! * a.sides!)[0];
  return fire && { spellId: fire.id, target };
}

/**
 * What the bots do beyond the turn they have always played, each off unless set (#853): Bless in the
 * first round (`blessWith`), sleep a group (`sleepWith`) and drink a draught (`drinkFor`). Off, a
 * bot plays as it did before them; the game's auto-fight sets all three (`PLAYED`, #865), the gate and
 * the harness none unless a what-if does (`--bot`).
 */
export interface BotOpts { bless?: boolean; sleep?: boolean; drink?: boolean }

/**
 * The bots' options as the game plays them (#865): bless, sleep and drink, all three, in the auto-fight
 * (ui/combat.ts), the pilot's fights with it. The gate's company buys nothing optional and its bot plays
 * plainer than a player, so the gate and the harness pass none unless a what-if sets them.
 */
export const PLAYED: Readonly<BotOpts> = { bless: true, sleep: true, drink: true };

/**
 * The first level past Act I (#865): a member of it or over blesses, sleeps and drinks as the options
 * say, and one under it plays as the bots did before them, so Act I, tuned by the owner's own play,
 * plays as it was made.
 */
export const FIRST_PAST_ACT_I = 11;
/** The options member `c` plays by: `opts` from FIRST_PAST_ACT_I on, none under it. */
export const optsFor = (c: Character, opts: Readonly<BotOpts>): Readonly<BotOpts> => (c.level >= FIRST_PAST_ACT_I ? opts : {});
/**
 * Whether the company lets sleepers lie (#865): sleep set and a member of it at FIRST_PAST_ACT_I or
 * over. The whole company holds it, since one member's spell over many wakes another's sleepers; who
 * casts Bless, sleep and a draught stays each member's own (`optsFor`).
 */
export const letsLie = (p: Party, opts: Readonly<BotOpts>): boolean => !!opts.sleep && p.members.some((m) => m.level >= FIRST_PAST_ACT_I);

/**
 * The bots' Bless (#853): in a fight's first round, three foes or more standing and no Bless running
 * (`s.bless`), member `i`'s Bless where it keeps its share of the rest line after it (REST_AT of its
 * own spell points). A knower whose turn is a blow leaves it to one yet to act this round whose turn
 * is not, one that cannot strike from its row and is past Act I (`FIRST_PAST_ACT_I`). None else.
 */
export function blessWith(s: CombatState, p: Party, i: number): SpellDef | undefined {
  if (s.round !== 1 || s.bless > 0 || aliveMonsters(s).length < 3) return undefined;
  const bless = (m: Character): SpellDef | undefined => m.spells.map(spell).find((x) => x.buff === 'bless' && x.context !== 'explore' && m.sp - x.sp >= m.maxSp * REST_AT);
  const idle = (j: number): boolean => !canAttackFromRow(p.members[j], j);
  const later = s.order.slice(s.turn + 1).some((t) => t.side === 'party' && idle(t.i) && canAct(p.members[t.i]) && p.members[t.i].level >= FIRST_PAST_ACT_I && !!bless(p.members[t.i]));
  return idle(i) || !later ? bless(p.members[i]) : undefined;
}

/** Who sleeps a group, and with what (#853): a sorcerer with Slumber, a druid with Grasping Roots. */
const SLEEPS: Partial<Record<ClassId, string>> = { sorcerer: 'sleep', druid: 'roots' };

/**
 * The bots' sleep (#853): a sorcerer's Slumber or a druid's Grasping Roots, where the member knows
 * and can afford it, at the group with the most foes standing, awake and held by nothing, where that
 * is two or more: the spell, the foe to cast it at and the foes it could put down. Never a group that
 * holds a foe proof against it as `sees` knows (#865), since the sleepers would bar the group's spells
 * while the one awake foe is struck alone. None else. Given `from`, an artifact's spell the member
 * bears (#847), that one, which costs a charge and no points.
 */
export function sleepWith(s: CombatState, c: Character, sees: Sees = asWritten, from?: SpellDef): { spell: SpellDef; target: number; foes: number[] } | undefined {
  const id = SLEEPS[c.cls], x = from ?? (id && c.spells.includes(id) ? spell(id) : undefined), k = x?.inflict;
  if (!x || !k || (!from && x.sp > c.sp)) return undefined;
  const groups = new Map<number, number[]>(), proof = new Set<number>();
  for (const f of aliveMonsters(s)) {
    const m = s.monsters[f];
    if (monsterImmune(m.def, k) && sees(s, m, k === 'asleep' ? 'sleepless' : 'unheld')) proof.add(m.group);
    else if (!m.conditions.length) groups.set(m.group, [...(groups.get(m.group) ?? []), f]);
  }
  const foes = [...groups].filter(([g]) => !proof.has(g)).map(([, fs]) => fs).sort((a, b) => b.length - a.length)[0];
  return foes && foes.length >= 2 ? { spell: x, target: foes[0], foes } : undefined;
}

/**
 * Whether one of the company besides member `i` can strike (#865): able to act, in a row it strikes
 * from, a foe in its reach. The bots let sleepers lie, and sleep a group, only while one can, since a
 * sleeper bars a spell over many and a caster alone would put its foes down and stand idle while they
 * lie. A blow wakes only the foe it strikes, so a striker fights on among the sleepers.
 */
export function striker(s: CombatState, p: Party, i: number): boolean {
  const foes = aliveMonsters(s);
  return p.members.some((m, j) => j !== i && canAct(m) && canAttackFromRow(m, j) && foes.some((f) => canReach(s, m, f)));
}

/** What a member can drink or give in a fight: its pack's draughts, then the company's bag's, as the resolver takes them. */
const draughts = (p: Party, c: Character): ItemDef[] => [...c.pack, ...p.bag].map(item).filter((d) => d.use);

/**
 * The bots' drink (#853): where no member who can act could mend them, a healing draught for the
 * lowest standing under their mend line (`mendLines`), the least that lifts them to it, else the
 * most; else, where no member who can act could free them by a spell, a cure draught for the one
 * `wakeWith` would free first. From the member's pack or the company's bag; none else.
 */
export function drinkFor(s: CombatState, p: Party, c: Character, sees: Sees = asWritten): PartyAction | undefined {
  const can = (does: (x: SpellDef) => boolean): boolean => p.members.some((o) => canAct(o) && o.spells.map(spell).some((x) => x.context !== 'explore' && x.sp <= o.sp && does(x)));
  const lines = mendLines(s, p, sees), held = draughts(p, c);
  const low = p.members.map((m, j) => ({ m, j })).filter(({ m, j }) => !isDown(m) && m.hp < lines[j]).sort((a, b) => a.m.hp - b.m.hp)[0];
  if (low && !can((x) => !!x.heal && !x.raise)) {
    const heals = held.filter((d) => d.use?.heal).sort((a, b) => a.use!.heal! - b.use!.heal!);
    const d = heals.find((h) => low.m.hp + h.use!.heal! >= lines[low.j]) ?? heals.at(-1);
    if (d) return { type: 'use', itemId: d.id, target: low.j };
  }
  const who = freeFirst(p, (m) => (can((x) => x.target === 'ally' && !!x.cure?.some((k) => frees(m, k))) ? undefined : held.find((d) => d.use?.cure?.some((k) => frees(m, k)))));
  return who && { type: 'use', itemId: who.x.id, target: who.j };
}

/**
 * The bot's turn for member `i`: the action it took, in gateTurn's order (mend, wake, burn, bless,
 * sleep, blast, drink, strike, brace), bless, sleep and drink only where `opts` asks (#853), and from
 * level 11 (`optsFor`, #865), the sleepers let lie by the whole company once one is (`letsLie`). Each
 * is tried on the resolver in turn and the first it takes is the turn; bracing it always takes. `sees`
 * is what it knows of the monsters: the gate's every trait as written, the game's auto-fight only
 * what the fight has shown (`asSeen`).
 */
export function botTurn(s: CombatState, p: Party, rng: RngInstance, i: number, sees: Sees = asWritten, opts: Readonly<BotOpts> = {}): PartyAction {
  // The game's bot flees a fight it has lost (#723); the gate's never does, since a flight only turns
  // a win into a loss and the gate measures whether a fight is winnable.
  if (sees !== asWritten && beaten(s, p) && partyAct(s, p, rng, { type: 'flee' })) return { type: 'flee' };
  const c = p.members[i], o = optsFor(c, opts), foes = aliveMonsters(s), lead = markOf(s, foes, sees), foe = lead ?? foes[0];
  // With sleep on, sleepers are let lie (#853): a blade at an awake foe it reaches where there is one,
  // a spell at an awake foe where one stands, and none over many that would wake a sleeper; only while
  // another of the company can strike (`striker`, #865), and only then does it sleep a group. The
  // whole company lets them lie once one member is past Act I (`letsLie`); only such a one sleeps.
  const lie = letsLie(p, opts) && striker(s, p, i), up = lie ? foes.filter((f) => !sleeps(s.monsters[f])) : [], near = up.filter((f) => canReach(s, c, f));
  const aim = up.length ? (lead !== undefined && up.includes(lead) ? lead : up[0]) : foe;
  const blade = near.length ? (lead !== undefined && near.includes(lead) ? lead : near[0]) : lead !== undefined && canReach(s, c, lead) ? lead : foes.find((f) => canReach(s, c, f)) ?? foe;
  const known = c.spells.map(spell).filter((x) => x.context !== 'explore' && x.sp <= c.sp);
  const lines = mendLines(s, p, sees), guard = breathGuard(s, p, sees);
  const low = guard !== undefined ? { m: p.members[guard], j: guard } : p.members.map((m, j) => ({ m, j })).filter(({ m, j }) => !isDown(m) && m.hp < lines[j]).sort((a, b) => a.m.hp - b.m.hp)[0];
  const mend = known.filter((x) => x.heal && !x.raise).sort((a, b) => (b.heal ?? 0) - (a.heal ?? 0))[0];
  const blast = gateBlast(s, c, sees, lie ? aim : undefined);
  const took = (a: PartyAction): PartyAction | undefined => (partyAct(s, p, rng, a) ? a : undefined);
  let a: PartyAction | undefined;
  if (low && mend && (a = took({ type: 'cast', spellId: mend.id, target: low.j }))) return a;
  const sleeper = wakeWith(p, c);
  if (sleeper && (a = took({ type: 'cast', ...sleeper }))) return a;
  const burn = gateBurn(s, c, lie);
  if (burn && (a = took({ type: 'cast', ...burn }))) return a;
  const bless = o.bless ? blessWith(s, p, i) : undefined;
  if (bless && (a = took({ type: 'cast', spellId: bless.id, target: i }))) return a;
  const sleep = o.sleep && lie ? sleepWith(s, c, sees) : undefined;
  if (sleep && (a = took({ type: 'cast', spellId: sleep.spell.id, target: sleep.target }))) return a;
  if (blast && (a = took({ type: 'cast', spellId: blast.id, target: aim }))) return a;
  const drink = o.drink ? drinkFor(s, p, c, sees) : undefined;
  if (drink && (a = took(drink))) return a;
  if (canAttackFromRow(c, i) && (a = took({ type: 'attack', target: blade }))) return a;
  const brace: PartyAction = { type: 'defend' };
  partyAct(s, p, rng, brace);
  return brace;
}

/**
 * Whether a fight is lost, as the screen shows it (#723): one of the company fallen in this fight (one
 * who came into it down is no sign), and as many foes standing as members. The game's bot then flees
 * (`botTurn` with any reading but `asWritten`).
 */
export function beaten(s: CombatState, p: Party): boolean {
  const down = p.members.filter(isDown).length;
  return down > (s.downAtStart ?? 0) && aliveMonsters(s).length >= p.members.length - down;
}

/** The bot's turn for member `i`, as the gate plays it: `botTurn`, the action not wanted. */
export function gateTurn(s: CombatState, p: Party, rng: RngInstance, i: number): void { botTurn(s, p, rng, i); }
