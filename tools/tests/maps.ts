// The maps as written, each on its own: every row the same width, exits and features on open
// ground, every monster and item real and placed, every business with a room, and every open cell
// reachable. What a clear of them is worth is the curve's (tools/tests/curve.ts).
import { AREAS, ATLAS, MAP_DEFS, ITEMS, MONSTERS, INTERIORS } from '../../src/content/index.ts';
import { GameMap } from '../../src/game/map.ts';
import type { Feature, MapDef } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { MAX_LEVEL } from '../../src/game/party.ts';
import { CURVE, trainerCeiling } from '../../src/content/progression.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { handIns, personFlags, personGives } from '../../src/game/people.ts';
import { ok, owed, stopsWalk } from './lib.ts';

/**
 * What is drawn before the map that places it, and whose map places it: a monster no map puts in a
 * group yet, a room no business opens into yet. Each is reported as that issue's while it waits,
 * and fails once it is placed, so its entry is dropped here.
 */
const UNPLACED: Record<string, string> = {
  brineling: '#170',
  bargeman: '#171', barge_master: '#171',
  drowned_chanter: '#175', choirmaster: '#175',
  fen_eel: '#170', fen_toad: '#170',
  grey_heron: '#171',
  salt_crab: '#176',
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

/** How many open cells of a map the walk from x,y reaches, given keys, secrets, water and climbing, of how many there are. */
function reach(m: GameMap, sx: number, sy: number): { seen: number; open: number } {
  const seen = new Set<number>(), stack = [[sx, sy]];
  while (stack.length) {
    const [x, y] = stack.pop()!, k = y * m.width + x;
    if (seen.has(k) || stopsWalk(m, x, y)) continue;
    seen.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
  }
  let open = 0;
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (!stopsWalk(m, x, y) && m.at(x, y).solid === 'none') open++;
  return { seen: seen.size, open };
}

/**
 * Where a map's tidal ground would cut a place off, or catch what stands on it: the start, an
 * exit's landing, an exit, a feature or a group standing on it; a square of it with no ground beside
 * it that is open at both tides; and an exit, a feature or a group the company reaches at low water
 * but not at high, without a swimmer. The walks start from every way in: the start, every square an
 * exit lands on, and, outdoors, every dry open square on the map's edge, where the next box meets it.
 * The tide opens nothing on the road (EXPANSION §2.2), so the only thing let off is an exit whose
 * place the company still reaches from this map at high water by other ways, as Saltmouth's
 * smugglers' stair leads into a cellar the town's gate reaches too.
 */
export function tidalFaults(m: GameMap, defs: readonly MapDef[]): string[] {
  const out: string[] = [];
  const tidal = (x: number, y: number): boolean => m.at(x, y).terrain === 'tidal';
  let any = false;
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
    if (!tidal(x, y)) continue;
    any = true;
    if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !tidal(x + dx, y + dy) && m.passable(x + dx, y + dy) === 'ok')) out.push(`tidal ground at ${x},${y} has no dry ground beside it`);
  }
  if (!any) return out;
  const landings = [{ x: m.def.start.x, y: m.def.start.y, what: 'the start' }, ...defs.flatMap((d) => (d.exits ?? []).filter((e) => e.to === m.id).map((e) => ({ x: e.tx, y: e.ty, what: `the landing from ${d.id}` })))];
  for (const l of landings) if (tidal(l.x, l.y)) out.push(`${l.what} at ${l.x},${l.y} is on tidal ground`);
  const seeds = landings.map((l) => [l.x, l.y]);
  if (m.kind === 'outdoor') for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
    if ((x === 0 || y === 0 || x === m.width - 1 || y === m.height - 1) && !tidal(x, y) && m.passable(x, y) === 'ok') seeds.push([x, y]);
  }
  const places = [
    ...m.exits.map((e) => ({ x: e.x, y: e.y, what: `the exit to ${e.to}`, to: e.to })),
    ...m.features.map((f) => ({ x: f.x, y: f.y, what: `the ${f.kind}`, to: undefined })),
    ...m.encounters.map((e) => ({ x: e.x, y: e.y, what: `group ${e.id}`, to: undefined })),
  ];
  for (const p of places) if (tidal(p.x, p.y)) out.push(`${p.what} at ${p.x},${p.y} stands on tidal ground`);
  const walk = (tide: 'high' | 'low'): Set<number> => {
    const seen = new Set<number>(), stack = seeds.map((q) => q.slice());
    while (stack.length) {
      const [x, y] = stack.pop()!, k = y * m.width + x, p = m.passable(x, y, { keys: 1, tide });
      if (seen.has(k) || (p !== 'ok' && p !== 'unlock')) continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
    }
    return seen;
  };
  const low = walk('low'), high = walk('high'), at = (p: { x: number; y: number }): number => p.y * m.width + p.x;
  // The maps the company still reaches at high water from here: through the exits it walks to, and on
  // through every way out of the maps beyond, which hold their own tide to this check.
  const onward = new Set<string>(), queue = m.exits.filter((e) => high.has(at(e))).map((e) => e.to);
  while (queue.length) {
    const id = queue.pop()!;
    if (onward.has(id) || id === m.id) continue;
    onward.add(id);
    for (const e of defs.find((d) => d.id === id)?.exits ?? []) queue.push(e.to);
  }
  for (const p of places) {
    if (low.has(at(p)) && !high.has(at(p)) && !(p.to && onward.has(p.to))) out.push(`${p.what} at ${p.x},${p.y} is cut off at high water`);
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
    // A landmark is a building drawn as what it is (#312): it stands on a building's square.
    for (const l of m.landmarks) ok(m.at(l.x, l.y).solid === 'building', `${def.id}: the ${l.kind} at ${l.x},${l.y} stands on a building's square`);
    for (const e of m.encounters) {
      ok(m.passable(e.x, e.y) === 'ok', `${def.id}: encounter ${e.id} at ${e.x},${e.y} is passable`);
      for (const id of e.monsters) ok(id in MONSTERS, `${def.id}: encounter ${e.id} monster '${id}' exists`);
      // Ranks (combat.ts `Ranks`): a back rank leaves a front, and a leader is one of the group.
      if (e.back !== undefined) ok(Number.isInteger(e.back) && e.back >= 1 && e.back < e.monsters.length, `${def.id}: encounter ${e.id}'s back rank of ${e.back} leaves a front of its ${e.monsters.length}`);
      if (e.leader !== undefined) ok(e.monsters.includes(e.leader), `${def.id}: encounter ${e.id}'s leader '${e.leader}' is one of the group`);
    }
    for (const f of m.features) {
      for (const id of giftOf(f)?.items ?? []) ok(id in ITEMS, `${def.id}: ${f.kind} ${spentId(f)} item '${id}' exists`);
      if (f.kind === 'shop') for (const id of f.stock) ok(id in ITEMS, `${def.id}: shop stock '${id}' exists`);
      if (f.kind === 'npc') for (const id of [...handIns(f).map((q) => q.item), ...personGives(f)]) ok(id in ITEMS, `${def.id}: ${f.name.split(',')[0]}'s item '${id}' exists`);
    }
    for (const e of m.exits) for (const flag of [e.needFlag ?? []].flat()) ok(MAP_DEFS.some((d) => d.features?.some((f) => f.kind === 'npc' && personFlags(f).includes(flag))), `${def.id}: gated exit flag '${flag}' is set by some person`);
  }
  // The Deepthorn's monsters are harder, not more: no group on its maps is above eight.
  const deep = new Set(ATLAS.zones.find((z) => z.id === 'deepthorn')?.maps?.map((m) => m.map));
  ok(deep.size > 0, 'the Deepthorn has maps');
  const big = MAP_DEFS.filter((d) => deep.has(d.id)).flatMap((d) => (d.encounters ?? []).filter((e) => e.monsters.length > 8).map((e) => `${e.id} (${e.monsters.length})`));
  ok(!big.length, `no group in the Deepthorn is above eight${big.length ? ' -> ' + big.join(', ') : ''}`);
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
  // The trainer ladder: each town's trainers teach to its area's band's top plus one (EXPANSION
  // §5.2), so the towns built set how far a company can train, and none past the cap.
  for (const area of AREAS) {
    for (const d of area.maps) {
      for (const f of d.features ?? []) {
        if (f.kind !== 'trainer') continue;
        const want = trainerCeiling(CURVE[area.id]);
        ok(f.maxLevel === want && f.maxLevel <= MAX_LEVEL, `${d.id}: ${f.name} teaches to ${f.maxLevel}, its area's band's top plus one (${want})`);
      }
    }
  }
  // Every cell in every map is reachable from the start, given keys and secrets: no orphaned rooms.
  for (const def of MAP_DEFS) {
    const { seen, open } = reach(maps[def.id], def.start.x, def.start.y);
    ok(seen >= open, `${def.id}: every open cell is reachable from the start (${seen} reached of ${open})`);
  }
  { // A room open only across a chasm is not reached: the walk stops at the drop.
    const gorge = new GameMap({ id: 'fx_gorge', name: 'Gorge', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['#######', '#,,v,,#', '#######'] });
    const { seen, open } = reach(gorge, 1, 1);
    ok(seen === 2 && open === 4, `a room open only across a chasm is caught (${seen} reached of ${open})`);
  }
  // The tide cuts nothing off and catches nothing on its ground: every map, then a fixture that
  // breaks each rule and one that keeps them.
  {
    const faults = MAP_DEFS.flatMap((def) => tidalFaults(maps[def.id], MAP_DEFS).map((f) => `${def.id}: ${f}`));
    ok(faults.length === 0, `on every map the tide cuts nothing off and catches nothing on its ground${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    const def = (id: string, rows: string[], extra: Partial<MapDef> = {}): MapDef => ({ id, name: id, kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows, ...extra });
    const faultsOf = (d: MapDef, others: MapDef[] = []): string[] => tidalFaults(new GameMap(d), [d, ...others]);
    // A spit reached only over the flats, with a sign and a group on it, a group on the flats and an
    // island of them with no dry ground beside it.
    const cutOff = faultsOf(def('fx_shore', ['MMMMMMM', 'M,;,,WM', 'MMMMMWM', 'MW;WWWM', 'MMMMMMM'], {
      features: [{ kind: 'sign', x: 3, y: 1, text: 'A post.' }],
      encounters: [{ id: 'crabs', x: 4, y: 1, monsters: ['wolf'] }, { id: 'wet', x: 2, y: 1, monsters: ['wolf'] }],
    }));
    const want = ['tidal ground at 2,3 has no dry ground beside it', 'group wet at 2,1 stands on tidal ground', 'the sign at 3,1 is cut off at high water', 'group crabs at 4,1 is cut off at high water'];
    ok(want.every((w) => cutOff.includes(w)), `flats that cut a spit off, catch a group and lie with no dry ground beside them are caught (${cutOff.join('; ')})`);
    // A start or a landing on the flats is caught; the far side of the flats, reached by a way in of
    // its own, is not cut off.
    const wet = faultsOf(def('fx_shore', ['MMMMMM', 'M;,;,M', 'MMMMMM']), [def('fx_quay', ['MMM', 'M,M', 'MMM'], { exits: [{ x: 1, y: 1, to: 'fx_shore', tx: 3, ty: 1 }] })]);
    const landed = faultsOf(def('fx_shore', ['MMMMMMM', 'M,,;,,M', 'MMMMMMM'], { features: [{ kind: 'sign', x: 5, y: 1, text: 'A post.' }] }), [def('fx_quay', ['MMM', 'M,M', 'MMM'], { exits: [{ x: 1, y: 1, to: 'fx_shore', tx: 5, ty: 1 }] })]);
    ok(wet.includes('the start at 1,1 is on tidal ground') && wet.includes('the landing from fx_quay at 3,1 is on tidal ground') && landed.length === 0, `a start or a landing on the flats is caught, and the far side reached by its own way in passes (${[...wet, ...landed].join('; ') || 'nothing'})`);
    // The same spit with a dry way round it passes. A stair over the flats passes if its place is
    // reached from this map at high water another way (here through a town), and fails if not.
    const round = faultsOf(def('fx_shore', ['MMMMMMM', 'M,;,,WM', 'M,,,,WM', 'MMMMMMM'], { features: [{ kind: 'sign', x: 3, y: 1, text: 'A post.' }] }));
    const shore = (exits: MapDef['exits']): MapDef => def('fx_shore', ['MMMMMM', 'M,;,WM', 'M,MMMM'], { exits });
    const stairOnly = [{ x: 3, y: 1, to: 'fx_cellar', tx: 1, ty: 1 }], gate = { x: 1, y: 2, to: 'fx_town', tx: 1, ty: 1 };
    const town = def('fx_town', ['MMM', 'M,M', 'MMM'], { kind: 'town', exits: [{ x: 1, y: 1, to: 'fx_cellar', tx: 1, ty: 1 }] }), cellar = def('fx_cellar', ['MMM', 'M,M', 'MMM'], { kind: 'dungeon' });
    const stair = faultsOf(shore([...stairOnly, gate]), [town, cellar]);
    const only = faultsOf(shore(stairOnly), [cellar, def('fx_far', ['MMM', 'M,M', 'MMM'], { exits: [{ x: 1, y: 1, to: 'fx_cellar', tx: 1, ty: 1 }] })]);
    ok(round.length === 0 && stair.length === 0 && only.join() === 'the exit to fx_cellar at 3,1 is cut off at high water', `a dry way round passes, and so does a stair over the flats whose place this map reaches at high water through a town, but not one whose place only some other map reaches (${[...round, ...stair, ...only].join('; ') || 'nothing'})`);
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
