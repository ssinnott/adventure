// The crack sweep's plan (tools/kit/sweep.ts, #953): on fixture maps, the views it skips and those it
// keeps, as the painter stands them; alike windows as one and a door told from a wall; its shards a
// partition of it; and the plan of every map, its figures printed.
import { GameMap, VOID_CH } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/mapdef.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { NORTH, EAST } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { atlasOf, pairsOf, plan, shard, shardsFor, type Plan, type View } from '../kit/sweep.ts';
import { ok } from './lib.ts';

/** A fixture's plan, all four ways from every open square. */
function planOf(def: Omit<MapDef, 'name' | 'start'>): Plan {
  const m = new GameMap({ name: def.id, start: { x: 1, y: 1, facing: NORTH }, ...def } as MapDef);
  return plan(atlasOf({ [m.id]: m }), [{ id: m.id, all: true }]);
}
const viewAt = (p: Plan, x: number, y: number, f: Facing): View => p.views.find((v) => v.x === x && v.y === y && v.f === f)!;
/** A field of one ground, 13 squares square, with what stands beside its middle (6,6) facing north, on its left (5,6). */
const field = (ground: string, beside = ground, kind: MapDef['kind'] = 'outdoor', extra: Partial<MapDef> = {}): Omit<MapDef, 'name' | 'start'> =>
  ({ id: `sweep_${kind}`, kind, rows: Array.from({ length: 13 }, (_, y) => (y === 6 ? ground.repeat(5) + beside + ground.repeat(7) : ground.repeat(13))), ...extra });
const middle = (p: Plan): View[] => [0, 1, 2, 3].map((f) => viewAt(p, 6, 6, f as Facing));

export function sweep(): void {
  const open = planOf(field(',')), hills = planOf(field('^'));
  ok(middle(open).every((v) => v.win < 0) && middle(hills).every((v) => v.win < 0), `from the middle of an open field and of a field of hills alone every way is skipped: nothing stands in the window, the hills laid flat (${middle(open).filter((v) => v.win < 0).length} and ${middle(hills).filter((v) => v.win < 0).length} of 4)`);
  ok(open.views.every((v) => v.win >= 0 || !v.beside), `no skipped view has a wall beside the party: one beside is a square of the window (${open.views.length} views, ${open.skipped} skipped)`);
  const standing: [string, Omit<MapDef, 'name' | 'start'>][] = [
    ['a wall', field(',', '#')], ['a house', field('=', 'B', 'town')], ['a tent', field(',', 'B', 'outdoor', { palette: { wallStyle: 'tent' } })], ['the void', field(',', VOID_CH)],
  ];
  const kept = standing.map(([what, def]) => { const v = viewAt(planOf(def), 6, 6, NORTH); return { what, kept: v.win >= 0 && v.beside }; });
  ok(kept.every((k) => k.kept), `a wall, a house, a tent and the void beside the party are kept, a wall beside it (${kept.map((k) => `${k.what} ${k.kept ? 'kept' : 'skipped'}`).join(', ')})`);
  // A corridor, bare so that no wall is dressed: east from 5,2 and 6,2 the window is the same, and a
  // door in its north wall at 13,1 is in the window from 9,2 and makes it another.
  const corridor = planOf({ id: 'sweep_corridor', kind: 'dungeon', bare: true, rows: ['#' .repeat(22), '#' .repeat(13) + 'D' + '#'.repeat(8), '#' + '.'.repeat(20) + '#', '#'.repeat(22), '#'.repeat(22)] });
  const [a, b, c] = [5, 6, 9].map((x) => viewAt(corridor, x, 2, EAST));
  ok(a.win >= 0 && a.win === b.win && c.win >= 0 && c.win !== a.win, `two alike windows are one, and a door is told from a wall (east from 5,2 and 6,2 window ${a.win} and ${b.win}; from 9,2, the door in sight, window ${c.win})`);

  // The plan of every map four ways, as SMOKE_SWEEP=all asks it, and its shards.
  const t = Date.now(), all = plan(atlasOf(buildMaps()), MAP_DEFS.map((d) => ({ id: d.id, all: true }))), seconds = (Date.now() - t) / 1000;
  const keptAll = all.views.length - all.skipped, besideSkipped = all.views.filter((v) => v.win < 0 && v.beside).length;
  ok(all.maps === MAP_DEFS.length && keptAll > 0 && besideSkipped === 0 && all.windows <= keptAll && all.refs.every((r, k) => all.views[r].win === k),
    `the plan of every map four ways: ${all.views.length} views of ${all.maps} maps, ${all.skipped} skipped (${(100 * all.skipped / all.views.length).toFixed(1)}%), ${keptAll} kept in ${all.windows} windows, ${all.beside} with a wall beside the party; ${pairsOf(all)} pairs to paint (${shardsFor(all)} shard), ${pairsOf(all, true)} in the audit (${shardsFor(all, true)} shards); planned in ${seconds.toFixed(1)} s`);
  const torn: string[] = [];
  for (const n of [1, 2, 3, 7, shardsFor(all, true)]) {
    const seen = new Map<View, number>();
    for (let i = 1; i <= n; i++) for (const v of shard(all, i, n)) seen.set(v, (seen.get(v) ?? 0) + 1);
    const twice = [...seen.values()].filter((k) => k > 1).length, missed = all.views.length - seen.size;
    const split = new Set(Array.from({ length: n }, (_, i) => shard(all, i + 1, n)).flatMap((s, i) => s.filter((v) => v.win >= 0).map((v) => `${v.win}@${i}`))).size !== all.windows;
    if (twice || missed || split) torn.push(`${n}: ${twice} twice, ${missed} in none${split ? ', a window in two' : ''}`);
  }
  ok(torn.length === 0, `the shards partition the plan, no view in two or in none and each window in one, in 1, 2, 3, 7 and ${shardsFor(all, true)} shards${torn.length ? ' -> ' + torn.join('; ') : ''}`);
}
