// The roster (tools/kit/roster.ts, #1024): the committed docs/ROSTER.md is what the monsters' defs
// make, with a row to every def and to every family, and it fails on a copy of the defs with a def
// changed, one added, one taken away and one drawn by another family, each row named. What a def can
// do is said in words from its own fields.
import { ROSTER_FILE, abilities, keysOf, render, rows, stale, treeDefs, written, type Defs } from '../kit/roster.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { ok } from './lib.ts';

export function roster(): void {
  const defs = treeDefs(), all = defs.areas.flatMap((a) => a.monsters);

  // The words: each field a def can carry, said; a def with none says nothing.
  const at = (id: string): MonsterDef => all.find((d) => d.id === id)!;
  const base = at('rat');
  const words = abilities({ ...base, ranged: true, missile: true, inflict: { cond: 'paralysed', chance: 0.15 }, cast: { spells: ['sleep', 'heal'], chance: 1 },
    drain: 'sp', regen: 40, calls: { monsters: ['knocker', 'knocker', 'core_sentry'], chance: 0.5 }, sweep: { chance: 0.25, element: 'fire' },
    immune: ['asleep', 'cold'], resist: ['fire'], weak: ['lightning'], steady: true, obeys: true }, defs);
  ok(words === 'reaches the back row with a bow; paralyses, 0.15 a hit; casts Slumber or Mend, every turn; its hits take spell points first; '
    + 'mends 40 a round unless burnt; calls 2 Knockers and a Core Sentry, 0.5 a turn; breathes fire on a row, 0.25 a turn; shrugs off sleep and cold; '
    + 'resists fire; weak to lightning; never breaks; leaves once its leaders fall'
    && abilities({ ...base, inflict: undefined }, defs) === '' && abilities({ ...base, inflict: undefined, sweep: { chance: 0.25 } }, defs) === 'sweeps a row, 0.25 a turn',
  `what a def can do is said from its own fields, in words, and a def with none says nothing (${words})`);

  // The tree: the roster written is the roster made, a row to each def and to each family.
  const made = render(defs), was = written(), off = stale(was, made);
  ok(!off.length, `${ROSTER_FILE} is what the defs make${off.length ? '; run node tools/roster.ts: ' + off.join('; ') : ''}`);
  const keys = keysOf(was), ids = new Set(all.map((d) => d.id)), families = new Set(all.map((d) => defs.family[d.sprite]));
  const missing = all.filter((d) => !keys.includes(d.id)).map((d) => d.id), extra = keys.filter((k) => !ids.has(k) && !k.startsWith('the family '));
  ok(all.length > 150 && !missing.length && !extra.length && keys.length === all.length + families.size,
    `every one of the ${all.length} defs of the ${defs.areas.length} areas has its row, and each of the ${families.size} families its own${missing.length ? '; no row for ' + missing.join(', ') : ''}${extra.length ? '; a row for no def: ' + extra.join(', ') : ''}`);

  // A copy of the defs: a def changed, one added, one taken away and one drawn by another family.
  const copy = (f: (ms: readonly MonsterDef[], area: string) => readonly MonsterDef[], family = defs.family): Defs =>
    ({ ...defs, family, areas: defs.areas.map((a) => ({ ...a, monsters: f(a.monsters, a.id) })) });
  const wolf = at('wolf');
  const changed = copy((ms) => ms.map((d) => (d.id === wolf.id ? { ...d, hp: d.hp + 1 } : d)));
  ok(stale(made, render(changed)).join('; ') === 'wolf: the row is not what its def makes', 'a copy with a def changed fails, its row named');
  const last = defs.areas[defs.areas.length - 1];
  const added = copy((ms, area) => (area === last.id ? [...ms, { ...wolf, id: 'added_wolf', name: 'Added Wolf' }] : ms));
  ok(stale(made, render(added)).join('; ') === 'added_wolf: no row; the family wolf: the row is not what its defs make',
    `a copy with a def added in ${last.name} lacks its row, and its family's row changes: ${stale(made, render(added)).join('; ')}`);
  const gone = copy((ms) => ms.filter((d) => d.id !== 'slime'));
  ok(stale(made, render(gone)).join('; ') === 'slime: a row for no def; the family slime: a row for no family',
    `a copy with a def taken away, its family's only one, names the def's row and the family's as rows for nothing: ${stale(made, render(gone)).join('; ')}`);
  const moved = copy((ms) => ms, { ...defs.family, [wolf.sprite]: 'boar' });
  ok(stale(made, render(moved)).join('; ') === 'wolf: the row is not what its def makes; the family boar: the row is not what its defs make; the family wolf: the row is not what its defs make',
    `a copy with a kind drawn by another family changes its row and both families': ${stale(made, render(moved)).join('; ')}`);
  ok(rows(defs).length === keys.length, `the roster's rows are its defs and families, ${rows(defs).length}`);
}
