// The monsters' side of a fight (#1007, cut from game/combat.ts): whether a weapon reaches one,
// their armour and their to-hit, the row a sweep or a spell of theirs falls on, their spells,
// sweeps and calls, the Core's clock and its light, their mending at a round's end and their
// morale. The flow in combat.ts calls in at a turn and at a round's end and nothing here calls
// back: the two import one way, as the layers suite asks.
import type { RngInstance } from '../../lib/engine/rng.ts';
import { monster, KINDS } from '../monsters.ts';
import type { MonsterDef } from '../monsters.ts';
import { spellDice, SPELLS_GROW_TO } from '../spells.ts';
import type { SpellDef, Element } from '../spells.ts';
import { armorClass, weaponOf, isDown, damage, addCondition, removeCondition, hasCondition, prestigeOf, deathAt, resists } from '../party.ts';
import type { Party, Character } from '../party.ts';
import type { World } from '../world.ts';
import type { Items, Tables } from '../tables.ts';
import {
  FRONT_ROW, MAX_MONSTERS, MAX_GROUPS, BLESS_HIT, WARD_AC, describe, toHit, roll, standing, frontStands, isLeader, SLUMBER_CHANCE,
} from './state.ts';
import type { MonsterInst, CombatState } from './state.ts';
import {
  BREAK_LINE, ROUT_LINE, names, RITE_LINE, MEND_LINE, SMOULDER_LINE, CALL_LINE, DIM_LINE, THREAD_LINE, STAND_LINE, SWEEP_LINE,
} from './lines.ts';
import { vanished, songWards } from './perks.ts';

/** Whether the character's weapon reaches the monster: a bow or sling any, a blade the back only once the front is down. */
export function canReach(s: CombatState, c: Character, target: number): boolean {
  const m = s.monsters[target];
  return !!m && standing(m) && (!m.back || !!weaponOf(s.tables.items, c).ranged || !frontStands(s));
}

/** A monster of the back rank with no bow, spell, call or breath waits for the front to fall before it steps up. */
export const waits = (s: CombatState, m: MonsterInst): boolean => m.back && !m.def.ranged && !m.def.cast && !m.def.calls && !m.def.sweep?.element && frontStands(s);

/** A monster's armour, with a Ward over its group. */
export const monsterAc = (s: CombatState, m: MonsterInst): number => m.def.ac + (s.foeShield[m.band] > 0 ? WARD_AC : 0);
/** A monster's to-hit, with a Bless over its group and the weather's toll on its bow. */
export const monsterHit = (s: CombatState, m: MonsterInst): number => m.def.attack + (s.foeBless[m.band] > 0 ? BLESS_HIT : 0) - (m.def.missile ? s.rangedPenalty : 0);
/** What the company has seen the element do to the monster: the share of a spell's damage or a blow's die, or 1 where it has not seen it. */
export const seenMult = (s: CombatState, m: MonsterInst, el: Element | undefined): number => (el ? s.seen[m.def.id]?.[el] ?? 1 : 1);

/** The party's members in a row, front or back, still standing. */
const rowOf = (party: Party, back: boolean): { c: Character; i: number }[] =>
  party.members.map((c, i) => ({ c, i })).filter(({ c, i }) => (i >= FRONT_ROW) === back && !isDown(c));

/** The row a monster's spell on a row or its breath falls on: the one with more standing in it (for Slumber, `awake`, more awake), the front on a tie. */
function rowFor(party: Party, awake = false): { c: Character; i: number }[] {
  const count = (back: boolean): number => rowOf(party, back).filter(({ c }) => !awake || !hasCondition(c, 'asleep')).length;
  return rowOf(party, count(true) > count(false));
}

/**
 * The row a sweep falls on (`MonsterDef.sweep`): an arm's the front, the back once the front is down,
 * as its blows reach; a breath's the row with more standing in it, the front on a tie, as a monster's
 * Fire Bolt falls. From under the ice either reaches only the front row over it. Its members still
 * standing, the asleep and the held among them; the fallen are passed over.
 */
export function sweptRow(party: Party, m: Pick<MonsterInst, 'def' | 'under'>): { c: Character; i: number }[] {
  const front = rowOf(party, false);
  if (m.under) return front;
  if (m.def.sweep?.element) return rowFor(party);
  return front.length ? front : rowOf(party, true);
}

/** A member's armour against a monster's blow or sweep: bracing, the Ward over the party and their own edge. */
export const guard = (s: CombatState, c: Character, i: number): number => armorClass(s.tables.items, c) + (s.defending[i] ? 4 : 0) + (s.shield > 0 ? WARD_AC : 0) + (s.edge?.(c, s).ac ?? 0);

/** Whether Lampglass or a member's own resistance halves an element on them: once between them, never to a quarter (#555). */
const dimmed = (s: CombatState, c: Character, el: Element | undefined): boolean => !!el && (s.glass?.element === el || resists(s.tables.items, c).includes(el));

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
export function castable(s: CombatState, party: Party, m: MonsterInst, sp: SpellDef): boolean {
  if (sp.heal) return bandOf(s, m).some(hurt);
  if (sp.buff === 'bless') return !(s.foeBless[m.band] > 0);
  if (sp.buff === 'shield') return !(s.foeShield[m.band] > 0);
  if (sp.inflict) return rowFor(party, true).some(({ c }) => !hasCondition(c, 'asleep'));
  return true;
}

/**
 * A member takes a monster's blow or spell: a sleeper is woken by it, unless it fells them. A blow
 * that would kill is held at 1 hit point, once between rests, by a cleric of the third prestige who is
 * not dead (`riteSpent`). Returns what the line adds.
 */
export function struck(items: Items, party: Party, c: Character, dmg: number): string {
  const slept = hasCondition(c, 'asleep');
  const rite = !isDown(c) && c.hp - dmg <= deathAt(c) ? party.members.find((m) => m.cls === 'cleric' && prestigeOf(m) >= 3 && !m.riteSpent && !hasCondition(m, 'dead')) : undefined;
  if (rite) { rite.riteSpent = true; c.hp = 1; removeCondition(c, 'asleep'); return ` ${RITE_LINE(rite.name, c.name)}`; }
  damage(items, c, dmg);
  if (slept && !isDown(c) && dmg > 0) { removeCondition(c, 'asleep'); return ` ${c.name} wakes.`; }
  return '';
}

/** A monster's turn spent on a spell (`MonsterDef.cast`): at its level held to SPELLS_GROW_TO, unranked, with no Spellfire. */
export function monsterCast(s: CombatState, party: Party, rng: RngInstance, m: MonsterInst, sp: SpellDef): void {
  const who = m.def.name;
  const dmgOf = (k: number): number => {
    let d = roll(rng, spellDice(sp, m.def.level), sp.sides ?? 4, 0);
    if (s.defending[k]) d = Math.ceil(d / 2);
    return dimmed(s, party.members[k], sp.element) ? Math.ceil(d / 2) : d;
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
    for (const { c } of rowFor(party, true)) if (!hasCondition(c, sp.inflict) && !songWards(party, sp.inflict) && rng.chance(SLUMBER_CHANCE)) { const before = c.conditions.length; addCondition(s.tables.items, c, sp.inflict); if (c.conditions.length > before) fell.push(c); }
    s.log.push(fell.length ? `${who} casts ${sp.name}: ${names(fell)} ${fell.length === 1 ? 'falls' : 'fall'} asleep.` : `${who} casts ${sp.name}, but no one sleeps.`);
    return;
  }
  if (sp.target === 'enemy') {
    const up = party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c)), marks = up.filter(({ c }) => !vanished(s, c));
    const pick = rng.pick(marks.length ? marks : up);
    if (!pick) return;
    const d = dmgOf(pick.i), woke = struck(s.tables.items, party, pick.c, d);
    s.log.push(`${who} casts ${sp.name}: ${pick.c.name} takes ${d}.${woke}` + (isDown(pick.c) ? ` ${pick.c.name} falls!` : ''));
    return;
  }
  const row = sp.target === 'all' ? party.members.map((c, i) => ({ c, i })).filter(({ c }) => !isDown(c)) : rowFor(party);
  let total = 0, woke = '';
  for (const { c, i } of row) { const d = dmgOf(i); total += d; woke += struck(s.tables.items, party, c, d); }
  const fell = row.map(({ c }) => c).filter(isDown);
  const where = sp.target === 'all' ? 'the party' : row[0] && row[0].i >= FRONT_ROW ? 'the back row' : 'the front row';
  s.log.push(`${who} casts ${sp.name}: ${total} damage to ${where}.${woke}` + (fell.length ? ` ${names(fell)} ${fell.length === 1 ? 'falls' : 'fall'}!` : ''));
}

/**
 * A monster's turn spent on a sweep (`MonsterDef.sweep`, #545): one attack at every member of its row
 * (`sweptRow`), a to-hit and its own dice rolled for each, halved for one bracing and, for a breath,
 * once more where Lampglass or the member's own resistance dims its element. False, and the turn is
 * a blow's, where the row is empty.
 */
export function sweep(s: CombatState, party: Party, rng: RngInstance, m: MonsterInst): boolean {
  const row = sweptRow(party, m), el = m.def.sweep?.element;
  if (!row.length) return false;
  let dealt: number | undefined, woke = '';
  for (const { c, i } of row) {
    if (!rng.chance(toHit(monsterHit(s, m), guard(s, c, i)))) continue;
    let d = roll(rng, m.def.dice, m.def.sides, m.def.bonus);
    if (s.defending[i]) d = Math.ceil(d / 2);
    if (dimmed(s, c, el)) d = Math.ceil(d / 2);
    dealt = (dealt ?? 0) + d;
    woke += struck(s.tables.items, party, c, d);
  }
  const fell = row.map(({ c }) => c).filter(isDown);
  s.log.push(SWEEP_LINE(m.def.name, el, row[0].i >= FRONT_ROW ? 'the back row' : 'the front row', dealt) + woke + (fell.length ? ` ${names(fell)} ${fell.length === 1 ? 'falls' : 'fall'}!` : ''));
  return true;
}

/**
 * The round's end for what mends (`MonsterDef.regen`): each one standing mends its amount, never past
 * its own hit points, unless fire burnt it this round, and the burns are the round's. The company
 * sees each kind mend (`mends`), and the log says who mended and who smouldered.
 */
export function regenerate(s: CombatState): void {
  const mended: MonsterInst[] = [], burnt: MonsterInst[] = [];
  let total = 0;
  for (const m of s.monsters) {
    if (!m.def.regen) continue;
    const fire = !!m.burnt;
    m.burnt = false;
    if (!standing(m) || m.hp >= m.def.hp) continue;
    if (fire) { burnt.push(m); continue; }
    const n = Math.min(m.def.regen, m.def.hp - m.hp), known = (s.mends ??= {});
    m.hp += n; total += n; mended.push(m);
    known[m.def.id] = Math.max(known[m.def.id] ?? 0, n);
  }
  if (mended.length) s.log.push(MEND_LINE(describe(mended), mended.length === 1, total));
  if (burnt.length) s.log.push(SMOULDER_LINE(describe(burnt), burnt.length === 1));
}

/**
 * The light under the clock (`Clock`) at a round's end: a step darker while the panel stands, to
 * `dims`, where it holds at a thread. The log says it every third step and at the last.
 */
export function dim(s: CombatState): void {
  const c = s.clock;
  if (!c || c.dim >= c.dims || !panelStands(s)) return;
  c.dim++;
  if (c.dim === c.dims) s.log.push(THREAD_LINE);
  else if (c.dim % 3 === 0) s.log.push(DIM_LINE);
}

/** The group a caller brings (`MonsterDef.calls`), as defs; none for one that calls nobody. */
export const calledBy = (monsters: Tables['monsters'], d: MonsterDef): MonsterDef[] => (d.calls?.monsters ?? []).map((q) => (typeof q === 'string' ? monster(monsters, q) : q));

/**
 * Whether a monster may call its group now: it stands, it calls someone, and the fight has room for
 * the whole group under MAX_GROUPS and MAX_MONSTERS, those already down counted, so that however long
 * a fight runs it never grows past the cap. A group too big for the room left is not called at all.
 */
export function canCall(s: CombatState, m: MonsterInst): boolean {
  const n = m.def.calls?.monsters.length ?? 0;
  return standing(m) && n > 0 && s.groupIds.length < MAX_GROUPS && s.monsters.length + n <= MAX_MONSTERS;
}

/** Whether a monster the clock's panel names stands (`Clock.panel`): while one does, the clock runs. */
export const panelStands = (s: CombatState): boolean => !!s.clock && s.monsters.some((m) => standing(m) && s.clock!.panel.includes(m.def.id));

/** Whether a monster calls on the clock and never on its own chance: a leader of the group that carries it. */
export const clocked = (s: CombatState, m: MonsterInst): boolean => !!s.clock && m.band === s.clock.band && isLeader(s, m);

/**
 * The clock's call at the end of a round on its beat (`Clock`): while its caller and the panel stand
 * and the fight holds fewer than twelve, those down counted, the caller calls one more, costing it no
 * turn. The calls ignore `calls.chance` and pass MAX_GROUPS, all standing in the one group the first
 * opened, which grows.
 */
export function beat(s: CombatState): void {
  const c = s.clock;
  if (!c || s.round % c.every !== 0 || !panelStands(s) || s.monsters.length >= MAX_MONSTERS) return;
  const caller = s.monsters.find((m) => clocked(s, m) && standing(m));
  if (caller) c.into = call(s, caller, [typeof c.calls === 'string' ? monster(s.tables.monsters, c.calls) : c.calls], c.into);
}

/**
 * A call: `defs` come into the fight whole and act from the next round, in the front rank, as a group
 * of its own with no leader, or into the group `into` (the clock's). The group they stand in.
 */
export function call(s: CombatState, m: MonsterInst, defs: readonly MonsterDef[], into?: number): number {
  const band = into ?? s.groupIds.length, rank = into === undefined ? Math.max(-1, ...s.monsters.map((q) => q.group)) + 1 : s.monsters.find((q) => q.band === into)!.group;
  const come = defs.map((def): MonsterInst => ({ def, hp: def.hp, group: rank, band, back: false, fled: false, conditions: [], flash: 0 }));
  if (into === undefined) { s.groupIds.push(`${s.groupIds[m.band]}:call${band}`); s.leaders.push(undefined); s.foeBless.push(0); s.foeShield.push(0); }
  s.monsters.push(...come);
  s.log.push(CALL_LINE(m.def.name, describe(come), come.length === 1));
  return band;
}

/**
 * A group called into the fight says the look of each kind in it the company has not met, as the
 * fight's first groups do (`World.meet`, #978). `bands` is how many groups the fight held when last
 * looked at; the count it holds now is returned.
 */
export function meetCalled(world: Pick<World, 'meet'>, s: CombatState, bands: number): number {
  if (s.groupIds.length === bands) return bands;
  s.log.push(...world.meet(s.monsters.filter((m) => m.band >= bands).map((m) => m.def.id)));
  return s.groupIds.length;
}

/**
 * Who breaks (docs/MONSTERS.md §2, §3.3): once every leader in the fight is down its people leave it,
 * and those that `obeys` stand down though their kind never breaks; and a group's beasts once three
 * in four of them are down. A `steady` monster never breaks, nor a kind that does not. The fled pay
 * nothing.
 */
export function morale(s: CombatState): void {
  const breaks = (m: MonsterInst, how: 'leader' | 'rout'): boolean => standing(m) && !m.def.steady && KINDS[m.def.kind].breaks === how;
  const leaders = s.monsters.filter((m) => isLeader(s, m));
  if (leaders.length && leaders.every((m) => !standing(m))) {
    const gone = s.monsters.filter((m) => breaks(m, 'leader')), stood = s.monsters.filter((m) => m.def.obeys && standing(m) && !gone.includes(m));
    for (const m of [...gone, ...stood]) m.fled = true;
    if (gone.length) s.log.push(BREAK_LINE(describe(gone), gone.length === 1));
    if (stood.length) s.log.push(STAND_LINE(describe(stood), stood.length === 1));
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
