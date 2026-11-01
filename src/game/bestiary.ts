// What a monster can do, in words (#1024's, moved here): its own fields alone, its kind's being its
// kind's (MONSTERS §2). The roster (tools/kit/roster.ts) writes it into docs/ROSTER.md and the wiki
// (src/app/wiki/) under each monster's picture, so the two say the same and neither copies the other.
// It takes the spells' names and a lookup of the monsters a def may call, and loads no table itself.
import type { MonsterDef } from './monsters.ts';

/** What the words need beside the def: each spell's name by id, and a def by id, for the monsters it calls by id. */
interface Words {
  spells: Readonly<Record<string, { name: string }>>;
  monster: (id: string) => MonsterDef | undefined;
}

/** A list in words: `a, b and c`, or `or` for the last. */
export const and = (xs: readonly string[], last = 'and'): string => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${last} ${xs[xs.length - 1]}`);
const share = (chance: number, per: string): string => (chance >= 1 ? `every ${per}` : `${chance} a ${per}`);
/** What a condition it inflicts does, as a verb. */
const DOES: Record<string, string> = { poisoned: 'poisons', diseased: 'diseases', asleep: 'puts to sleep', paralysed: 'paralyses', cursed: 'curses', stoned: 'turns to stone' };
/** A condition or an element as the thing shrugged off; an element is its own name. */
const NOUN: Record<string, string> = { asleep: 'sleep', poisoned: 'poison', diseased: 'disease', paralysed: 'paralysis', cursed: 'a curse', stoned: 'stone' };
/** A condition or an element as a noun: `sleep`, `a curse`, `fire`. */
export const noun = (k: string): string => NOUN[k] ?? k;
/** A count of a monster, by its name or its plural: `a Core Sentry`, `3 Knockers`. */
const counted = (n: number, d: { name: string; plural: string }): string =>
  (n > 1 ? `${n} ${d.plural}` : d.name.startsWith('The ') ? d.name : `${/^[AEIOU]/.test(d.name) ? 'an' : 'a'} ${d.name}`);

/**
 * What a def can do, in words, its own fields alone: its reach; what it inflicts, casts, drains,
 * mends, calls and sweeps; what it shrugs off, resists or is weak to; how it holds. '' where it does
 * none of them.
 */
export function abilities(d: MonsterDef, w: Words): string {
  const out: string[] = [];
  if (d.ranged) out.push(d.missile ? 'reaches the back row with a bow' : 'reaches the back row');
  if (d.inflict) out.push(`${DOES[d.inflict.cond] ?? d.inflict.cond}, ${share(d.inflict.chance, 'hit')}`);
  if (d.cast) out.push(`casts ${and(d.cast.spells.map((s) => w.spells[s]?.name ?? s), 'or')}, ${share(d.cast.chance, 'turn')}`);
  if (d.drain) out.push(d.drain === 'hp' ? 'its hits heal it' : 'its hits take spell points first');
  if (d.regen) out.push(`mends ${d.regen} a round unless burnt`);
  if (d.calls) {
    const group = new Map<string, { n: number; d: { name: string; plural: string } }>();
    for (const m of d.calls.monsters) {
      const id = typeof m === 'string' ? m : m.id, def = typeof m === 'string' ? w.monster(m) : m;
      const at = group.get(id) ?? { n: 0, d: def ?? { name: id, plural: id } };
      group.set(id, { ...at, n: at.n + 1 });
    }
    out.push(`calls ${and([...group.values()].map((g) => counted(g.n, g.d)))}, ${share(d.calls.chance, 'turn')}`);
  }
  if (d.sweep) out.push(d.sweep.element ? `breathes ${d.sweep.element} on a row, ${share(d.sweep.chance, 'turn')}` : `sweeps a row, ${share(d.sweep.chance, 'turn')}`);
  if (d.immune?.length) out.push(`shrugs off ${and(d.immune.map(noun))}`);
  if (d.resist?.length) out.push(`resists ${and(d.resist.map(noun))}`);
  if (d.weak?.length) out.push(`weak to ${and(d.weak.map(noun))}`);
  if (d.steady) out.push('never breaks');
  if (d.obeys) out.push('leaves once its leaders fall');
  return out.join('; ');
}
