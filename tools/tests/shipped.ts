// What a save can refer to: the content holds to src/content/shipped.json (EXPANSION §5.5). Nothing
// in it goes or moves unless SAVE_VERSION goes up with an upgrade, and what is new is recorded.
// Then the check itself, broken on purpose: a chest, a spell and a guild hall renamed, a door, a
// zone and a map's edge moved, each caught at this version and let through by a bump with its upgrade.
import type { MapDef, Feature } from '../../src/game/map.ts';
import { SAVE_VERSION } from '../../src/game/save.ts';
import { UPGRADES } from '../../src/game/upgrades.ts';
import type { Upgrade } from '../../src/game/upgrades.ts';
import { CONTENT, collect, compare, readShipped } from '../shipped.ts';
import type { Content } from '../shipped.ts';
import { ok } from './lib.ts';

const list = (xs: readonly string[]): string => xs.length ? ':\n        ' + xs.join('\n        ') : '';

/** The content with one map changed. */
const withMap = (id: string, change: (d: MapDef) => MapDef): Content => ({ ...CONTENT, defs: CONTENT.defs.map((d) => (d.id === id ? change(d) : d)) });
const withFeature = (id: string, change: (f: Feature) => Feature): Content => withMap(id, (d) => ({ ...d, features: d.features?.map(change) }));

export function shipped(): void {
  const was = readShipped(), now = collect(CONTENT);
  const { problems, unrecorded } = compare(was, now);
  ok(problems.length === 0, `nothing a save can refer to has gone or moved${list(problems)}`);
  ok(unrecorded.length === 0, `src/content/shipped.json records all of it, at version ${was.version}${unrecorded.length ? ' (run node tools/shipped.ts)' : ''}${list(unrecorded)}`);
  ok(Object.keys(UPGRADES).map(Number).every((v) => v >= 2 && v <= SAVE_VERSION), 'every upgrade brings a save to a version this build knows');

  // Broken on purpose: each edit is caught, names what it broke, and passes once SAVE_VERSION goes
  // up with an upgrade for the new version. A bump without one is still caught.
  const next = SAVE_VERSION + 1, bumped: Record<number, Upgrade> = { ...UPGRADES, [next]: (d) => d };
  const cases: [string, string, Content][] = [
    ['a chest renamed', 'g1_c1', withFeature('grove1', (f) => (f.kind === 'chest' && f.id === 'g1_c1' ? { ...f, id: 'g1_chest1' } : f))],
    ['a spell renamed', 'thorn', { ...CONTENT, spells: CONTENT.spells.map((s) => (s === 'thorn' ? 'thorn_lash' : s)) }],
    ['a guild hall renamed', 'guild_Lantern Guildhall', withFeature('harrow', (f) => (f.kind === 'guild' && f.name === 'Lantern Guildhall' ? { ...f, name: 'Lantern Hall' } : f))],
    ['a door moved', '5,11', withMap('grove1', (d) => ({ ...d, rows: d.rows.map((r, y) => (y === 11 ? r.slice(0, 4) + 'S.' + r.slice(6) : r)) }))],
    ['a zone moved', 'zone shelf', { ...CONTENT, atlas: { ...CONTENT.atlas, zones: CONTENT.atlas.zones.map((z) => (z.id === 'shelf' ? { ...z, at: [199, 30] as [number, number] } : z)) } }],
    ['a map made taller', 'map harrow', withMap('harrow', (d) => ({ ...d, rows: [...d.rows, d.rows[d.rows.length - 1]] }))],
  ];
  for (const [what, names, content] of cases) {
    const ids = collect(content), same = compare(was, ids).problems;
    ok(same.some((p) => p.includes(names)), `${what} is caught, naming ${names}${list(same)}`);
    ok(compare(was, ids, next, bumped).problems.length === 0, `${what} passes with SAVE_VERSION ${next} and an upgrade to it`);
    ok(compare(was, ids, next, UPGRADES).problems.some((p) => p.includes(`version ${next}`)), `${what} with SAVE_VERSION ${next} and no upgrade to it is caught`);
  }
  { // New content only adds: it passes, and is owed to the list until recorded.
    const more = collect({ ...CONTENT, spells: [...CONTENT.spells, 'new_spell'] });
    const c = compare(was, more);
    ok(c.problems.length === 0 && c.unrecorded.some((u) => u.includes('new_spell')), 'a new spell is no problem, but is to be recorded');
  }
}
