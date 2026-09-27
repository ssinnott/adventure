// The atlas: the world map's grid, its zones, places and road of levels.
import { MAP_DEFS } from '../../src/content/index.ts';
import { ATLAS } from '../../src/content/index.ts';
import { worldGrid, worldPoint, progression, reachable, isWater, TI } from '../../src/game/atlas.ts';
import { ok } from './lib.ts';

export function atlas(): void {
  const grid = worldGrid(ATLAS, MAP_DEFS);
  const W = grid.width, H = grid.height;
  ok(W === ATLAS.width && H === ATLAS.height && W % ATLAS.square === 0 && H % ATLAS.square === 0, `the world is ${W}x${H} squares, in whole lettered squares of ${ATLAS.square}`);
  const land = (x: number, y: number): boolean => { const t = grid.t(Math.floor(x), Math.floor(y)); return t !== TI.void && (!isWater(t) || grid.river[Math.floor(y) * W + Math.floor(x)] === 1); };
  const near = (x: number, y: number, r: number, fn: (x: number, y: number) => boolean): boolean => {
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (fn(x + dx, y + dy)) return true;
    return false;
  };
  // Every built outdoor map is placed once, inside the world, stamped 1:1, and no two overlap.
  const placed: { id: string; x: number; y: number; w: number; h: number }[] = [];
  for (const def of MAP_DEFS.filter((d) => d.kind === 'outdoor')) {
    const zs = ATLAS.zones.filter((z) => z.map === def.id);
    ok(zs.length === 1 && !!zs[0].at, `${def.id}: placed on the world map as exactly one zone`);
    const at = zs[0]?.at;
    if (!at) continue;
    const w = def.rows[0].length, h = def.rows.length;
    ok(at[0] >= 0 && at[1] >= 0 && at[0] + w <= W && at[1] + h <= H, `${def.id}: inside the world`);
    let own = 0;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) own += grid.built[(at[1] + y) * W + at[0] + x];
    ok(own === (w - 2) * (h - 2), `${def.id}: every inner square is the map's own (${own} of ${(w - 2) * (h - 2)})`);
    placed.push({ id: def.id, x: at[0], y: at[1], w, h });
  }
  for (const a of placed) for (const b of placed) if (a.id < b.id) ok(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y, `${a.id} and ${b.id} do not overlap`);
  // A way between two placed maps joins neighbouring squares, so the maps meet where the way is.
  for (const def of MAP_DEFS) for (const e of def.exits ?? []) {
    const a = worldPoint(ATLAS, def.id, e.x, e.y), b = worldPoint(ATLAS, e.to, e.tx, e.ty);
    if (a && b) ok(Math.hypot(a[0] - b[0], a[1] - b[1]) <= 2.5, `${def.id} -> ${e.to}: the exit and the arrival are neighbours on the world map`);
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
    const z = s.map ? ATLAS.zones.find((q) => q.map === s.map) : undefined;
    const x = (z?.at?.[0] ?? 0) + s.at[0], y = (z?.at?.[1] ?? 0) + s.at[1];
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
  // The road of levels: numbered once each, every step reachable once the ones before it are done,
  // the gates that make it wind shutting their step out until then, and the bands rising along it.
  const steps = progression(ATLAS, MAP_DEFS);
  ok(steps.every((st, i) => st.order === i + 1), `the steps are numbered 1 to ${steps.length}, once each`);
  for (const st of steps) ok(reachable(ATLAS, MAP_DEFS, st.order - 1).has(st.id), `step ${st.order} (${st.name}) can be reached once the steps before it are done`);
  for (const [id, done] of [['saltreach', 1], ['sunderwood', 3], ['ashfall', 8], ['hearth', 10]] as const) ok(!reachable(ATLAS, MAP_DEFS, done).has(id), `${id} is shut until step ${done + 1}'s way opens`);
  const banded = steps.filter((st) => st.band);
  ok(banded.length === steps.length && banded.every((st, i) => i === 0 || st.band![0] >= banded[i - 1].band![0]), 'every step has a level band, and the bands rise along the road');
}
