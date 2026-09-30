// The maps as written, each on its own: every row the same width, exits and features on open
// ground, every monster and item real and placed, every business with a room, and every open cell
// reachable. What a clear of them is worth is the curve's (tools/tests/curve.ts).
import { AREAS, MAP_DEFS, ITEMS, MONSTERS, INTERIORS } from '../../src/content/index.ts';
import { GameMap } from '../../src/game/map.ts';
import type { Feature } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { MAX_LEVEL } from '../../src/game/party.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { handIns, personFlags, personGives } from '../../src/game/people.ts';
import { ok, owed } from './lib.ts';

/**
 * What is drawn before the map that places it, and whose map places it: a monster no map puts in a
 * group yet, a room no business opens into yet. Each is reported as that issue's while it waits,
 * and fails once it is placed, so its entry is dropped here.
 */
const UNPLACED: Record<string, string> = {
  black_dog: '#69', barrow_guard: '#70', barrow_captain: '#70',
  farm_kitchen: '#87',
  great_owl: '#49', heartwood: '#49', eldest: '#49',
};

/**
 * What is wrong with a town's doorways: the business must come first on its square (the game
 * opens the first feature there, and the door's sign is drawn from it), and after it only people
 * with no room of their own and events.
 */
export function doorwayFaults(m: GameMap): string[] {
  if (m.kind !== 'town') return [];
  const out: string[] = [];
  const squares = new Map<string, Feature[]>();
  for (const f of m.features) if (m.at(f.x, f.y).door !== 'none') squares.set(`${f.x},${f.y}`, [...(squares.get(`${f.x},${f.y}`) ?? []), f]);
  for (const [at, [first, ...rest]] of squares) {
    if (!('interior' in first && first.interior)) out.push(`the doorway at ${at} opens on the ${first.kind} there, which has no room`);
    // A business is always there: gone, its doorway would open on the person after it.
    else if ('when' in first || 'after' in first || 'until' in first) out.push(`the business at ${at} comes and goes`);
    for (const f of rest) if (!(f.kind === 'event' || (f.kind === 'npc' && !f.interior))) out.push(`the doorway at ${at} holds the ${f.kind}${'interior' in f && f.interior ? ' with a room' : ''} after its business`);
  }
  return out;
}

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
      for (const id of giftOf(f)?.items ?? []) ok(id in ITEMS, `${def.id}: ${f.kind} ${spentId(f)} item '${id}' exists`);
      if (f.kind === 'shop') for (const id of f.stock) ok(id in ITEMS, `${def.id}: shop stock '${id}' exists`);
      if (f.kind === 'npc') for (const id of [...handIns(f).map((q) => q.item), ...personGives(f)]) ok(id in ITEMS, `${def.id}: ${f.name.split(',')[0]}'s item '${id}' exists`);
    }
    for (const e of m.exits) for (const flag of [e.needFlag ?? []].flat()) ok(MAP_DEFS.some((d) => d.features?.some((f) => f.kind === 'npc' && personFlags(f).includes(flag))), `${def.id}: gated exit flag '${flag}' is set by some person`);
  }
  // Every quest item is dropped or found somewhere; every monster is placed on some map.
  const placed = new Set(MAP_DEFS.flatMap((d) => (d.encounters ?? []).flatMap((e) => e.monsters)));
  for (const id of Object.keys(MONSTERS)) {
    if (Object.hasOwn(UNPLACED, id)) owed(placed.has(id), `monster '${id}' appears on a map`, UNPLACED[id]);
    else ok(placed.has(id), `monster '${id}' appears on a map`);
  }
  const found = new Set([...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => [...(giftOf(f)?.items ?? []), ...(f.kind === 'npc' ? personGives(f) : [])])), ...Object.values(MONSTERS).flatMap((m) => (m.drops ?? []).map((x) => x.item))]);
  for (const d of MAP_DEFS) for (const f of d.features ?? []) if (f.kind === 'npc') for (const q of handIns(f)) ok(found.has(q.item), `${d.id}: quest item '${q.item}' can be found`);
  // A business is a feature in a town's doorway: you walk into it, so it has a room to show, and
  // no two businesses share one. People in it stand on its doorway after it.
  const interiors: string[] = [];
  for (const def of MAP_DEFS) {
    const m = maps[def.id], bad = doorwayFaults(m);
    ok(!bad.length, `${def.id}: every doorway opens into its business first, with only people and events after it${bad.length ? ' -> ' + bad.join('; ') : ''}`);
    for (const f of m.features) {
      const interior = 'interior' in f ? f.interior : undefined;
      if (interior) { interiors.push(interior); ok(m.at(f.x, f.y).door !== 'none', `${def.id}: ${interior} is entered through a door`); }
    }
  }
  { // The doorway rule, on a fixture town with an inn: a person after it passes, and so do an event
    // and a tavern keeper who is the business; a person before it, or a second business, fails.
    const inn: Feature = { kind: 'inn', x: 2, y: 1, name: 'The Fixture', price: 1, interior: INTERIORS[0] };
    const person: Feature = { kind: 'npc', x: 2, y: 1, name: 'Hob', lines: ['Hm.'] };
    const event: Feature = { kind: 'event', x: 2, y: 1, id: 'fx_chair', text: 'An empty chair.' };
    const keeper: Feature = { ...person, name: 'The Keeper', interior: INTERIORS[1] };
    const town = (features: Feature[]): GameMap => new GameMap({ id: 'fx_town', name: 'Fixture', kind: 'town', start: { x: 1, y: 2, facing: NORTH }, rows: ['#####', '#,D,#', '#,,,#', '#####'], features });
    ok(!doorwayFaults(town([inn, person, event])).length && !doorwayFaults(town([keeper, person])).length, 'a person or an event after the business on its doorway passes, a tavern keeper who is the business too');
    ok(doorwayFaults(town([person, inn])).length > 0 && doorwayFaults(town([inn, keeper])).length === 1 && doorwayFaults(town([person])).length === 1 && doorwayFaults(town([{ ...keeper, until: { flag: 'fx_gone' } }, person])).length === 1,
      'a person before the business, a second business, a doorway with no business and a business that comes and goes each fail');
  }
  const opened = INTERIORS.filter((i) => !Object.hasOwn(UNPLACED, i));
  ok(interiors.length === opened.length && new Set(interiors).size === interiors.length && opened.every((i) => interiors.includes(i)), `every business has an interior of its own (${interiors.length}, ${new Set(interiors).size} distinct)`);
  for (const i of INTERIORS.filter((i) => Object.hasOwn(UNPLACED, i))) owed(interiors.includes(i), `a business opens into ${i}`, UNPLACED[i]);
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
    const lists = area.interiors.filter((i) => !Object.hasOwn(UNPLACED, i));
    ok(same(rooms, lists), `${area.id}: its businesses paint the ${lists.length} rooms it lists`);
  }
}
