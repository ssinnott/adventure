// The maps as written, each on its own: every row the same width, exits and features on open
// ground, every monster and item real and placed, every business with a room, and every open cell
// reachable. What a clear of them is worth is the curve's (tools/tests/curve.ts).
import { AREAS, MAP_DEFS, ITEMS, MONSTERS, INTERIORS } from '../../src/content/index.ts';
import { GameMap } from '../../src/game/map.ts';
import { MAX_LEVEL } from '../../src/game/party.ts';
import { ok } from './lib.ts';

export function maps(): void {
  // The maps as written, each on its own, the Foreland and Thornmark included (see `outdoors` for how they are played).
  const maps = Object.fromEntries(MAP_DEFS.map((d) => [d.id, new GameMap(d)]));
  for (const def of MAP_DEFS) {
    const m = maps[def.id];
    ok(def.rows.every((r) => r.length === m.width), `${def.id}: every row is ${m.width} wide`);
    ok(m.passable(def.start.x, def.start.y) === 'ok', `${def.id}: the start cell is passable`);
    for (const e of m.exits) {
      const to = maps[e.to];
      ok(!!to, `${def.id}: exit at ${e.x},${e.y} points at a real map (${e.to})`);
      ok(m.passable(e.x, e.y) === 'ok', `${def.id}: exit cell ${e.x},${e.y} is passable`);
      if (to) ok(to.passable(e.tx, e.ty) === 'ok', `${def.id} -> ${e.to}: arrival cell ${e.tx},${e.ty} is passable`);
    }
    for (const f of m.features) ok(m.passable(f.x, f.y, { swim: true, climb: true, keys: 1 }) !== 'wall', `${def.id}: feature ${f.kind} at ${f.x},${f.y} is not inside a wall`);
    for (const e of m.encounters) {
      ok(m.passable(e.x, e.y) === 'ok', `${def.id}: encounter ${e.id} at ${e.x},${e.y} is passable`);
      for (const id of e.monsters) ok(id in MONSTERS, `${def.id}: encounter ${e.id} monster '${id}' exists`);
    }
    for (const f of m.features) {
      if (f.kind === 'chest') for (const id of f.items) ok(id in ITEMS, `${def.id}: chest ${f.id} item '${id}' exists`);
      if (f.kind === 'shop') for (const id of f.stock) ok(id in ITEMS, `${def.id}: shop stock '${id}' exists`);
      if (f.kind === 'npc' && f.quest) ok(f.quest.item in ITEMS, `${def.id}: quest item '${f.quest.item}' exists`);
    }
    for (const e of m.exits) for (const flag of [e.needFlag ?? []].flat()) ok(MAP_DEFS.some((d) => d.features?.some((f) => f.kind === 'npc' && f.quest?.setFlag === flag)), `${def.id}: gated exit flag '${flag}' is set by some quest`);
  }
  // Every quest item is dropped or found somewhere; every monster is placed on some map.
  const placed = new Set(MAP_DEFS.flatMap((d) => (d.encounters ?? []).flatMap((e) => e.monsters)));
  for (const id of Object.keys(MONSTERS)) ok(placed.has(id), `monster '${id}' appears on a map`);
  const found = new Set([...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'chest' ? f.items : [])), ...Object.values(MONSTERS).flatMap((m) => (m.drops ?? []).map((x) => x.item))]);
  for (const d of MAP_DEFS) for (const f of d.features ?? []) if (f.kind === 'npc' && f.quest) ok(found.has(f.quest.item), `${d.id}: quest item '${f.quest.item}' can be found`);
  // A business is a feature in a town's doorway: you walk into it, so it has a room to show, and
  // no two businesses share one.
  const interiors: string[] = [];
  for (const def of MAP_DEFS) {
    const m = maps[def.id];
    for (const f of m.features) {
      const interior = 'interior' in f ? f.interior : undefined;
      if (m.kind === 'town' && m.at(f.x, f.y).door !== 'none') ok(!!interior, `${def.id}: the business in the doorway at ${f.x},${f.y} has an interior`);
      if (interior) { interiors.push(interior); ok(m.at(f.x, f.y).door !== 'none', `${def.id}: ${interior} is entered through a door`); }
    }
  }
  ok(interiors.length === INTERIORS.length && new Set(interiors).size === interiors.length && INTERIORS.every((i) => interiors.includes(i)), `every business has an interior of its own (${interiors.length}, ${new Set(interiors).size} distinct)`);
  // The trainer ladder: some trainer teaches to the cap, and the cap is what levelUp stops at.
  const trainers = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'trainer'));
  ok(Math.max(...trainers.map((t) => t.kind === 'trainer' ? t.maxLevel : 0)) === MAX_LEVEL, `a trainer teaches to level ${MAX_LEVEL}`);
  const bands = MAP_DEFS.map((d) => d.band?.[1] ?? 0);
  ok(Math.max(...bands) >= MAX_LEVEL, `some map is tuned for level ${MAX_LEVEL}`);
  // Every cell in every map is reachable from the start, given keys and secrets: no orphaned rooms.
  for (const def of MAP_DEFS) {
    const m = maps[def.id];
    const seen = new Set<number>(); const stack = [[def.start.x, def.start.y]];
    while (stack.length) {
      const [x, y] = stack.pop()!; const k = y * m.width + x;
      if (seen.has(k) || m.passable(x, y, { swim: true, climb: true, keys: 1 }) === 'wall') continue;
      if (m.at(x, y).solid === 'tree' || m.at(x, y).solid === 'rock') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
    }
    let open = 0; for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) { const c = m.at(x, y); if (m.passable(x, y, { swim: true, climb: true, keys: 1 }) !== 'wall' && c.solid === 'none') open++; }
    ok(seen.size >= open, `${def.id}: every open cell is reachable from the start (${seen.size} reached of ${open})`);
  }
  // Each area lists what is its own, and the lists are true: its maps share its weather, its monsters
  // are drawn with the sprite kinds it lists, and its businesses paint the rooms it lists.
  const same = (a: readonly string[], b: readonly string[]): boolean => a.every((x) => b.includes(x)) && b.every((x) => a.includes(x));
  for (const area of AREAS) {
    ok(area.maps.every((d) => (d.region ?? 'shelf') === area.id), `${area.id}: its ${area.maps.length} maps share its weather`);
    ok(same(area.monsters.map((m) => m.sprite), area.sprites), `${area.id}: its monsters are drawn with the ${area.sprites.length} sprite kinds it lists`);
    const rooms = area.maps.flatMap((d) => (d.features ?? []).flatMap((f) => 'interior' in f && f.interior ? [f.interior] : []));
    ok(same(rooms, area.interiors), `${area.id}: its businesses paint the ${area.interiors.length} rooms it lists`);
  }
}
