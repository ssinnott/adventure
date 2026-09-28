// What a save can refer to: the content holds to src/content/shipped.json (EXPANSION §5.5). Nothing
// in it goes or moves unless SAVE_VERSION goes up with an upgrade, and what is new is recorded.
// Then the check itself, broken on purpose: a chest, a spell and a guild hall renamed, a door, a
// zone and a map's edge moved, each caught at this version and let through by a bump with its
// upgrade. Each edit finds its target in the content as it is, so a rename made properly (a bump,
// its upgrade, the list regenerated) leaves the cases as sharp as before.
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Feature } from '../../src/game/map.ts';
import { layOutdoors } from '../../src/game/outdoors.ts';
import { guildFlag } from '../../src/game/party.ts';
import { SAVE_VERSION } from '../../src/game/save.ts';
import { UPGRADES } from '../../src/game/upgrades.ts';
import type { Upgrade } from '../../src/game/upgrades.ts';
import { CONTENT, collect, compare, readShipped } from '../shipped.ts';
import type { Content } from '../shipped.ts';
import { ok } from './lib.ts';

const list = (xs: readonly string[]): string => xs.length ? ':\n        ' + xs.join('\n        ') : '';
/** A check that lists what it found only when it fails, so a green run reads green. */
const okList = (cond: boolean, msg: string, xs: readonly string[]): void => ok(cond, msg + (cond ? '' : list(xs)));

/** The content with one map changed. */
const withMap = (id: string, change: (d: MapDef) => MapDef): Content => ({ ...CONTENT, defs: CONTENT.defs.map((d) => (d.id === id ? change(d) : d)) });
const withFeature = (id: string, change: (f: Feature) => Feature): Content => withMap(id, (d) => ({ ...d, features: d.features?.map(change) }));
const indoors = CONTENT.defs.filter((d) => d.kind !== 'outdoor');

/** The first chest, renamed. */
function chest(): [string, Content] {
  const d = CONTENT.defs.find((m) => m.features?.some((f) => f.kind === 'chest'))!;
  const id = (d.features!.find((f) => f.kind === 'chest') as { id: string }).id;
  return [`chest or event ${id} is gone`, withFeature(d.id, (f) => (f.kind === 'chest' && f.id === id ? { ...f, id: id + '_renamed' } : f))];
}
/** The first guild hall, renamed: its members' flag goes with the name. */
function guild(): [string, Content] {
  const d = CONTENT.defs.find((m) => m.features?.some((f) => f.kind === 'guild'))!;
  const name = (d.features!.find((f) => f.kind === 'guild') as { name: string }).name;
  return [`flag ${guildFlag(name)} is gone`, withFeature(d.id, (f) => (f.kind === 'guild' && f.name === name ? { ...f, name: name + ' Renamed' } : f))];
}
/** The first locked or secret door of a town or dungeon, swapped with a floor square beside it. */
function door(): [string, Content] {
  for (const d of indoors) {
    const m = new GameMap(d);
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      if (m.at(x, y).door !== 'locked' && m.at(x, y).door !== 'secret') continue;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const c = m.at(nx, ny);
        if (!m.inBounds(nx, ny) || c.door !== 'none' || c.solid !== 'none') continue;
        const rows = d.rows.map((r) => [...r]);
        [rows[y][x], rows[ny][nx]] = [rows[ny][nx], rows[y][x]];
        return [`${d.id} door at ${x},${y} is gone`, withMap(d.id, (q) => ({ ...q, rows: rows.map((r) => r.join('')) }))];
      }
    }
  }
  throw new Error('no town or dungeon has a locked or secret door with floor beside it');
}
/** The first zone the atlas lays, a square along, wherever it still fits. */
function zone(): [string, Content] {
  const z = CONTENT.atlas.zones.find((q) => q.at)!;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const atlas = { ...CONTENT.atlas, zones: CONTENT.atlas.zones.map((q) => (q === z ? { ...q, at: [z.at![0] + dx, z.at![1] + dy] as [number, number] } : q)) };
    try { layOutdoors(atlas, CONTENT.defs); } catch { continue; }
    return [`zone ${z.id} is`, { ...CONTENT, atlas }];
  }
  throw new Error(`zone ${z.id} cannot move a square without overlapping another`);
}

export function shipped(): void {
  const was = readShipped(), now = collect(CONTENT);
  const { problems, unrecorded } = compare(was, now);
  okList(problems.length === 0, 'nothing a save can refer to has gone or moved', problems);
  okList(unrecorded.length === 0, `src/content/shipped.json records all of it, at version ${was.version}${unrecorded.length ? ' (run node tools/shipped.ts)' : ''}`, unrecorded);
  ok(Object.keys(UPGRADES).map(Number).every((v) => v >= 2 && v <= SAVE_VERSION), 'every upgrade brings a save to a version this build knows');

  // Broken on purpose: each edit is caught, names what it broke, and passes once SAVE_VERSION goes
  // up with an upgrade for the new version. A bump without one is still caught.
  const next = SAVE_VERSION + 1, bumped: Record<number, Upgrade> = { ...UPGRADES, [next]: (d) => d };
  const spell = CONTENT.spells[0], taller = indoors[0];
  const cases: [string, [string, Content]][] = [
    ['a chest renamed', chest()],
    ['a spell renamed', [`spell ${spell} is gone`, { ...CONTENT, spells: CONTENT.spells.map((s) => (s === spell ? spell + '_renamed' : s)) }]],
    ['a guild hall renamed', guild()],
    ['a door moved', door()],
    ['a zone moved', zone()],
    ['a map made taller', [`map ${taller.id} is`, withMap(taller.id, (d) => ({ ...d, rows: [...d.rows, d.rows[d.rows.length - 1]] }))]],
  ];
  for (const [what, [names, content]] of cases) {
    const ids = collect(content), same = compare(was, ids).problems;
    okList(same.some((p) => p.includes(names)), `${what} is caught (${names})`, same);
    const up = compare(was, ids, next, bumped);
    okList(up.problems.length === 0 && up.unrecorded.some((u) => u.includes(names)), `${what} passes with SAVE_VERSION ${next} and an upgrade to it, which is told what went`, [...up.problems, ...up.unrecorded]);
    const none = compare(was, ids, next, UPGRADES).problems;
    okList(none.some((p) => p.includes(`version ${next}`)) && none.some((p) => p.includes(names)), `${what} with SAVE_VERSION ${next} and no upgrade to it is caught, naming both`, none);
  }
  { // New content only adds: it passes, and is owed to the list until recorded.
    const more = collect({ ...CONTENT, spells: [...CONTENT.spells, 'new_spell'] });
    const c = compare(was, more);
    ok(c.problems.length === 0 && c.unrecorded.some((u) => u.includes('new_spell')), 'a new spell is no problem, but is to be recorded');
  }
}
