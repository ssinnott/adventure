// The atlas: the world map's grid, its zones, places and road of levels.
import { MAP_DEFS } from '../../src/content/index.ts';
import { ATLAS } from '../../src/content/index.ts';
import { LEGEND } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { worldGrid, worldPoint, progression, reachable, isWater, TI, MAP_TERRAIN, mapAt, zoneOfMap, areaOf, gridCuts, boxAt, box } from '../../src/game/atlas.ts';
import type { AtlasZone } from '../../src/game/atlas.ts';
import { layOutdoors, OUTDOORS } from '../../src/game/outdoors.ts';
import { GameMap } from '../../src/game/map.ts';
import { ok } from './lib.ts';

export function atlas(): void {
  // A built map's hills and farmland are hills and farmland on the world map, square for square.
  const fixture: MapDef = { id: 'fixture_downs', name: 'Downs fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMMMM', 'M^^ffM', 'M^,ffM', 'MMMMMM'] };
  // Laid where no zone map is: a map built there moves it.
  const [fx, fy] = [64, 52];
  const under = MAP_DEFS.find((d) => { const m = mapAt(ATLAS, d.id); return m && fx + 6 > m[0] && fx < m[0] + d.rows[0].length && fy + 4 > m[1] && fy < m[1] + d.rows.length; });
  if (under) throw new Error(`the hills fixture lies on ${under.id}: move it to land no zone map covers`);
  const fixtureZone: AtlasZone = { id: 'fixture_downs', name: 'Downs fixture', area: ATLAS.zones[0].area, maps: [{ map: 'fixture_downs', at: [fx, fy] }] };
  const withFixture = { ...ATLAS, zones: [...ATLAS.zones, fixtureZone] };
  const fg = worldGrid(withFixture, [...MAP_DEFS, fixture]), fw = (x: number, y: number): number => fg.t(fx + x, fy + y);
  ok(fw(1, 1) === TI.hills && fw(2, 1) === TI.hills && fw(1, 2) === TI.hills && fw(2, 2) === TI.grass, 'a map\'s hills are hills on the world map');
  ok(fw(3, 1) === TI.farm && fw(4, 1) === TI.farm && fw(3, 2) === TI.farm && fw(4, 2) === TI.farm, 'and its farmland is farmland');
  ok(Object.entries(LEGEND).every(([ch, c]) => c.solid !== 'none' || c.door !== 'none' || ch in MAP_TERRAIN), 'every open ground in the legend has its world-map terrain');
  const grid = worldGrid(ATLAS, MAP_DEFS);
  const W = grid.width, H = grid.height;
  ok(W === ATLAS.width && H === ATLAS.height, `the world is ${W}x${H} squares, the atlas's size`);
  const land = (x: number, y: number): boolean => { const t = grid.t(Math.floor(x), Math.floor(y)); return t !== TI.void && (!isWater(t) || grid.river[Math.floor(y) * W + Math.floor(x)] === 1); };
  const near = (x: number, y: number, r: number, fn: (x: number, y: number) => boolean): boolean => {
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (fn(x + dx, y + dy)) return true;
    return false;
  };
  // Every built outdoor map is laid once, by one zone, inside the world, stamped 1:1, and no two overlap.
  const placed: { id: string; x: number; y: number; w: number; h: number }[] = [];
  for (const def of MAP_DEFS.filter((d) => d.kind === 'outdoor')) {
    const times = ATLAS.zones.flatMap((z) => z.maps ?? []).filter((m) => m.map === def.id).length;
    ok(times === 1, `${def.id}: laid on the world map once, by one zone (${times})`);
    const at = mapAt(ATLAS, def.id);
    if (!at) continue;
    const w = def.rows[0].length, h = def.rows.length;
    ok(at[0] >= 0 && at[1] >= 0 && at[0] + w <= W && at[1] + h <= H, `${def.id}: inside the world`);
    let own = 0;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) own += grid.built[(at[1] + y) * W + at[0] + x];
    ok(own === (w - 2) * (h - 2), `${def.id}: every inner square is the map's own (${own} of ${(w - 2) * (h - 2)})`);
    placed.push({ id: def.id, x: at[0], y: at[1], w, h });
  }
  for (const a of placed) for (const b of placed) if (a.id < b.id) ok(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y, `${a.id} and ${b.id} do not overlap`);
  // A way between two placed maps joins neighbouring squares, so the maps meet where the way is, but
  // where it takes one of the atlas's own ways between its ends, as N8's notch is taken down onto M9
  // and back up across parked M8 (#486), or the road across a parked box's corner, as L9's pass is
  // taken on onto K10 and back across parked L10 (#488, #491).
  const besides = (end: readonly number[], q: readonly number[]): boolean => Math.hypot(end[0] + 0.5 - q[0], end[1] + 0.5 - q[1]) <= 1.5;
  const across = (from: string, to: string): boolean => [from, to].sort().join() === 'coldmere_k10,longmere_l9';
  for (const def of MAP_DEFS) for (const e of def.exits ?? []) {
    const a = worldPoint(ATLAS, def.id, e.x, e.y), b = worldPoint(ATLAS, e.to, e.tx, e.ty);
    const taken = !!a && !!b && ATLAS.links.some((l) => !!l.a && !!l.b && ((besides(l.a, a) && besides(l.b, b)) || (besides(l.b, a) && besides(l.a, b))));
    const corner = across(def.id, e.to);
    if (a && b) ok(taken || corner || Math.hypot(a[0] - b[0], a[1] - b[1]) <= 2.5, `${def.id} -> ${e.to}: the exit and the arrival are neighbours on the world map${taken ? ', or the atlas\'s own way between them' : corner ? ', or the road across parked L10\'s corner' : ''}`);
  }
  // The grid: boxes of 32 from A1's corner, lettered A-P by 1-12, the strips at the edges rim.
  const { cols, rows } = gridCuts(ATLAS);
  ok(cols.map((c) => c.name).join('') === 'ABCDEFGHIJKLMNOP' && rows.map((c) => c.name).join() === '1,2,3,4,5,6,7,8,9,10,11,12', `the grid is A-P by 1-12 (${cols[0]?.name}-${cols.at(-1)?.name} by ${rows[0]?.name}-${rows.at(-1)?.name})`);
  const g2 = box(ATLAS, 'G2');
  ok(g2?.x === 200 && g2.y === 30 && g2.w === 32 && g2.h === 32, `G2 spans x 200-231 and y 30-61 (${g2 && `${g2.x},${g2.y} ${g2.w}x${g2.h}`})`);
  ok(rows[0].at === 0 && rows[0].len === 30 && cols.at(-1)!.at === 488 && cols.at(-1)!.len === 24, 'row 1 and column P are boxes cut to the world, 30 tall and 24 wide');
  const named = cols.flatMap((c) => rows.map((r) => c.name + r.name));
  ok(named.every((n) => { const b = box(ATLAS, n); return !!b && boxAt(ATLAS, b.x, b.y) === n && boxAt(ATLAS, b.x + b.w - 1, b.y + b.h - 1) === n; }), `every box's name gives the box back (${named.length} boxes)`);
  ok(box(ATLAS, 'Q1') === undefined && box(ATLAS, 'A13') === undefined && box(ATLAS, 'A0') === undefined, 'and no box is named beyond them');
  let strip = 0, stripLand = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!boxAt(ATLAS, x, y)) { strip++; if (land(x, y)) stripLand++; }
  ok(strip === 8 * H + 2 * (W - 8) && stripLand === 0, `the strips, x 0-7 and y 382-383, are in no box and hold no land (${stripLand} of ${strip} squares)`);
  ok(boxAt(ATLAS, ...mapAt(ATLAS, 'shelf')!) === 'G2' && boxAt(ATLAS, ...mapAt(ATLAS, 'thornmark')!) === 'H2', 'the Foreland\'s map is G2 and Thornmark\'s H2');
  { // A zone of two maps: two grass boxes of the Downs, F2 and F3, laid and drawn as one zone. A
    // rival zone seeded beside F3 would take it, were F3 not a seed of the Downs in its own right.
    const grass = (id: string, name: string): MapDef => ({ id, name, kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: Array(32).fill(','.repeat(32)) });
    const f2 = grass('fixture_f2', 'Downs F2'), f3 = grass('fixture_f3', 'Downs F3'), defs = [...MAP_DEFS, f2, f3];
    const two = (third?: AtlasZone): typeof ATLAS => ({ ...ATLAS, zones: [...ATLAS.zones.map((z): AtlasZone => (z.id !== 'downs' ? z : { ...z, maps: third ? [{ map: 'fixture_f2', at: [168, 30] }] : [{ map: 'fixture_f2', at: [168, 30] }, { map: 'fixture_f3', at: [168, 62] }] })), { id: 'fixture_rival', name: 'Rival', area: 'shelf', seeds: [[167, 78]] }, ...(third ? [third] : [])] });
    const inDowns = (atlas: typeof ATLAS): number => {
      const g = worldGrid(atlas, defs), k = atlas.zones.findIndex((z) => z.id === 'downs');
      let n = 0;
      for (let y = 30; y < 94; y++) for (let x = 168; x < 200; x++) if (g.zone[y * g.width + x] === k) n++;
      return n;
    };
    const both = two(), held = inDowns(both);
    ok(held === 2048, `the world puts every square of both in the Downs (${held} of 2048)`);
    const apart = inDowns(two({ id: 'fixture_other', name: 'Other', area: 'shelf', maps: [{ map: 'fixture_f3', at: [168, 62] }] }));
    ok(apart <= 1024, `and gives F3 to another zone, it holds only F2 (${apart})`);
    ok(['fixture_f2', 'fixture_f3'].every((m) => zoneOfMap(both, m)?.id === 'downs' && areaOf(both, m)?.id === 'shelf'), 'either map finds the Downs, and the Foreland');
    const p2 = worldPoint(both, 'fixture_f2', 0, 0), p3 = worldPoint(both, 'fixture_f3', 0, 0);
    ok(p2?.join() === '168.5,30.5' && p3?.join() === '168.5,62.5', `each map's squares lie from its own corner (${p2?.join()} and ${p3?.join()})`);
    const out = new GameMap(layOutdoors(both, defs).find((d) => d.id === OUTDOORS)!);
    const z2 = out.zones.find((q) => q.id === 'fixture_f2'), z3 = out.zones.find((q) => q.id === 'fixture_f3');
    ok(z2?.name === 'Downs F2' && z2.x === 168 && z2.y === 30 && z3?.name === 'Downs F3' && z3.x === 168 && z3.y === 62, 'played, each is a zone of the outdoors under its own name, at its box');
  }
  // Every zone holds land and its seeds, every area is made of zones, and every land square is in one.
  const size = new Map<number, number>();
  for (let i = 0; i < W * H; i++) if (grid.zone[i] >= 0) size.set(grid.zone[i], (size.get(grid.zone[i]) ?? 0) + 1);
  ATLAS.zones.forEach((z, k) => {
    ok((size.get(k) ?? 0) >= 300, `zone ${z.id}: holds land (${size.get(k) ?? 0} squares)`);
    for (const [sx, sy] of z.seeds ?? []) ok(grid.zone[Math.floor(sy) * W + Math.floor(sx)] === k, `zone ${z.id}: its seed at ${sx},${sy} lies in it`);
    ok(ATLAS.areas.some((a) => a.id === z.area), `zone ${z.id}: its area '${z.area}' exists`);
  });
  for (const a of ATLAS.areas) ok(ATLAS.zones.some((z) => z.area === a.id), `area ${a.id}: is made of zones`);
  let squares = 0, claimed = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (land(x, y)) { squares++; if (grid.zone[y * W + x] >= 0) claimed++; }
  ok(claimed === squares, `every land square is in a zone (${claimed} of ${squares})`);
  // Sites stand on land and name waters on water; ports stand on the coast.
  for (const s of ATLAS.sites) {
    const at = s.map ? mapAt(ATLAS, s.map) : undefined;
    const x = (at?.[0] ?? 0) + s.at[0], y = (at?.[1] ?? 0) + s.at[1];
    if (s.icon === 'water') ok(isWater(grid.t(Math.floor(x), Math.floor(y))), `${s.name}: lettered on water`);
    else if (s.icon !== 'label' && s.icon !== 'wreck') ok(near(x, y, 1, land), `${s.name}: stands on land`);
  }
  const ports = ATLAS.sites.filter((s) => s.icon === 'port');
  ok(ports.length === 3, `three port cities (${ports.map((p) => p.name).join(', ')})`);
  for (const p of ports) ok(near(p.at[0], p.at[1], 4, (x, y) => grid.t(Math.floor(x), Math.floor(y)) === TI.sea || grid.t(Math.floor(x), Math.floor(y)) === TI.shallow), `${p.name}: on the coast`);
  // Every way's ends exist, and a crossing's course stays at sea.
  const ids = new Set([...ATLAS.areas.map((a) => a.id), ...ATLAS.zones.map((z) => z.id), ...ATLAS.places.map((q) => q.id), ...MAP_DEFS.map((d) => d.id)]);
  for (const l of ATLAS.links) ok(ids.has(l.from) && ids.has(l.to), `way ${l.from} -> ${l.to}: both ends exist`);
  for (const l of ATLAS.links.filter((q) => q.kind === 'sea')) for (const [x, y] of l.via ?? []) ok(grid.t(Math.floor(x), Math.floor(y)) === TI.sea, `crossing ${l.from} -> ${l.to}: passes ${x},${y} at sea`);
  // Places: a built one is a map, a planned one is not yet; every town and dungeon has one.
  for (const q of ATLAS.places) ok(q.planned ? !MAP_DEFS.some((d) => d.id === q.id) : MAP_DEFS.some((d) => d.id === q.id), `place ${q.id}: ${q.planned ? 'planned and not built yet' : 'a built map'}`);
  for (const d of MAP_DEFS.filter((q) => q.kind !== 'outdoor')) ok(ATLAS.places.some((q) => q.id === d.id), `${d.id}: has a plate on the world map`);
  // A town entered only from another town (the keep's ward, behind Helmstow) has its plate by that
  // town's, where the party is drawn while it is inside.
  const plate = (id: string): readonly number[] | undefined => ATLAS.places.find((q) => q.id === id)?.at;
  for (const d of MAP_DEFS.filter((q) => q.kind === 'town' && q.exits?.length && q.exits.every((e) => MAP_DEFS.find((m) => m.id === e.to)?.kind === 'town'))) {
    const at = plate(d.id), by = [...new Set(d.exits!.map((e) => e.to))];
    const near = by.filter((id) => { const p = plate(id); return !!at && !!p && Math.hypot(p[0] - at[0], p[1] - at[1]) <= 8; });
    ok(near.length > 0, `${d.id}: its plate sits within 8 of ${by.join(', ')}'s`);
  }
  // The road of levels: numbered once each, every step reachable from the start, since no way on it
  // is shut, and the bands rising along it.
  const steps = progression(ATLAS, MAP_DEFS);
  ok(steps.every((st, i) => st.order === i + 1), `the steps are numbered 1 to ${steps.length}, once each`);
  const open = reachable(ATLAS, MAP_DEFS, 0);
  for (const st of steps) ok(open.has(st.id), `step ${st.order} (${st.name}) can be reached from the start`);
  const banded = steps.filter((st) => st.band);
  ok(banded.length === steps.length && banded.every((st, i) => i === 0 || st.band![0] >= banded[i - 1].band![0]), 'every step has a level band, and the bands rise along the road');
}
