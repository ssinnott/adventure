// The Rift generator (game/rifts.ts, content/rifts/): eight templates, each sound; the same seed
// giving the same Rift and a new seed a new turn of it with the same ids; every template, turned
// every way and dressed in every material, passing the contract a hand-built map passes; the tear
// on a zone map walked through and back; the groups stopping and the tear going quiet once the
// Stone is restored; and every tear an area places leading into a real map.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import { PLAYED_DEFS } from '../../src/content/maps.ts';
import { TEMPLATES, MATERIALS, RIFT_SAMPLES, rift } from '../../src/content/rifts/index.ts';
import { generateRift, templateFaults, turn, RIFT_SIZE } from '../../src/game/rifts.ts';
import type { RiftSpec } from '../../src/game/rifts.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { EAST } from '../../src/game/types.ts';
import { wallDressing } from '../../src/ui/viewport.ts';
import { judge } from './density.ts';
import { lineFaults, hintFaults, missingGlyphs, americanisms } from './pillars.ts';
import { strandedLocks, respawnsOutOfRange, returningGuardians, presenceFaults, questItems } from './structure.ts';
import { ok, stopsWalk } from './lib.ts';

/** What is wrong with a generated Rift, by the contract's checks on a map as written. */
function faults(def: MapDef, items: ReadonlySet<string>, maps: readonly MapDef[] = MAP_DEFS): string[] {
  const m = new GameMap(def), out: string[] = [];
  if (def.rows.length !== RIFT_SIZE || def.rows.some((r) => r.length !== RIFT_SIZE)) out.push(`not ${RIFT_SIZE} by ${RIFT_SIZE}`);
  if (m.passable(def.start.x, def.start.y) !== 'ok') out.push('the start is not open');
  const ahead = m.ahead(def.start.x, def.start.y, def.start.facing);
  if (m.passable(ahead.x, ahead.y) !== 'ok' && m.at(ahead.x, ahead.y).door === 'none') out.push('the start faces a wall');
  for (const e of m.exits) {
    const to = maps.find((d) => d.id === e.to);
    if (!to) out.push(`its way out leads to no map (${e.to})`);
    else if (new GameMap(to).passable(e.tx, e.ty) !== 'ok') out.push(`its way out lands on a closed square of ${e.to}`);
  }
  for (const e of m.encounters) {
    if (m.passable(e.x, e.y) !== 'ok') out.push(`${e.id} stands in a wall`);
    for (const id of e.monsters) if (!(id in MONSTERS)) out.push(`${e.id}: no monster '${id}'`);
  }
  for (const f of m.features) if (m.passable(f.x, f.y) !== 'ok') out.push(`${f.kind} at ${f.x},${f.y} is not on open floor`);
  for (const f of m.features) if (f.kind === 'chest') for (const i of f.items) if (!(i in ITEMS)) out.push(`no item '${i}'`);
  // Every open square reached from the way in.
  const seen = new Set<number>(), todo = [[def.start.x, def.start.y]];
  while (todo.length) {
    const [x, y] = todo.pop()!, k = y * m.width + x;
    if (seen.has(k) || stopsWalk(m, x, y)) continue;
    seen.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.inBounds(x + dx, y + dy)) todo.push([x + dx, y + dy]);
  }
  let open = 0;
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (!stopsWalk(m, x, y) && m.at(x, y).solid === 'none') open++;
  if (seen.size < open) out.push(`${open - seen.size} open squares out of reach`);
  const dense = judge(def).why;
  if (dense) out.push(`density: ${dense}`);
  out.push(...lineFaults(def), ...hintFaults(def), ...strandedLocks(def).map((l) => `stranded lock ${l}`));
  out.push(...respawnsOutOfRange(def), ...returningGuardians(def, items), ...presenceFaults(def, [...maps, def]));
  return out;
}

export function rifts(): void {
  const items = questItems();
  // The templates: eight, each sound, no two alike.
  ok(TEMPLATES.length === 8, `eight templates (${TEMPLATES.map((t) => t.id).join(', ')})`);
  ok(new Set(TEMPLATES.map((t) => t.id)).size === 8 && new Set(TEMPLATES.map((t) => t.rows.join('\n'))).size === 8, 'no two templates share an id or a plan');
  for (const t of TEMPLATES) {
    const f = templateFaults(t);
    ok(!f.length, `${t.id}: 12 by 12, walled round, one way in, one tear with its warden beside it, one hoard, and every square reached${f.length ? ' -> ' + f.join('; ') : ''}`);
  }
  ok(templateFaults({ id: 'fx', rows: [...TEMPLATES[0].rows.slice(0, 11), '#'.repeat(11)] }).join() === 'not 12 by 12'
    && templateFaults({ id: 'fx', rows: TEMPLATES[0].rows.map((r) => r.replace('W', '.')) }).some((f) => f.includes("not one 'W'"))
    && templateFaults({ id: 'fx', rows: TEMPLATES[0].rows.map((r, y) => (y === 2 ? '#'.repeat(12) : r)) }).some((f) => f.startsWith('squares the way in does not reach')),
  'and a template short a row, without its warden or with rooms walled off is refused');
  // The eight turns of a square are eight, and each keeps it on the grid.
  const corner = new Set(Array.from({ length: 8 }, (_, k) => { const p = turn(k, 1, 2); return `${p.x},${p.y}`; }));
  ok(corner.size === 8, `a square turned the eight ways lands on eight squares (${[...corner].join(' ')})`);

  // Pure: the same seed, the same Rift; another seed, another turn of it, with the same ids.
  const spec = (seed: number, template = TEMPLATES[0]): RiftSpec => ({
    id: 'fx_rift', template, material: MATERIALS[1], seed, band: [10, 11],
    out: { to: 'downs_e3', tx: 21, ty: 4 },
    table: { groups: [['riftling', 'riftling'], ['rift_crawler', 'rift_crawler', 'rift_crawler'], ['riftling', 'rift_crawler']], warden: ['riftling_elder', 'riftling'] },
    hoard: { gold: 120, items: ['potion_heal'] },
    until: { slain: 'fx_rift:fx_rift_warden' },
  });
  ok(JSON.stringify(generateRift(spec(5))) === JSON.stringify(generateRift(spec(5))), 'the same template, material, table and seed give the same Rift');
  const ids = (d: MapDef): string => [...(d.features ?? []).map((f) => ('id' in f ? f.id : '')), ...(d.encounters ?? []).map((e) => e.id)].sort().join();
  const turns = new Set(Array.from({ length: 40 }, (_, s) => generateRift(spec(s + 1)).rows.join('\n')));
  ok(turns.size === 8, `forty seeds turn the ring all eight ways (${turns.size})`);
  ok(Array.from({ length: 40 }, (_, s) => ids(generateRift(spec(s + 1)))).every((x) => x === ids(generateRift(spec(1)))), 'and every seed gives it the same ids, so a save keeps them');
  const slots = new Set(Array.from({ length: 40 }, (_, s) => generateRift(spec(s + 1)).encounters!.filter((e) => e.id !== 'fx_rift_warden').map((e) => `${e.x},${e.y}`).sort().join()));
  ok(slots.size > 1, `the seed puts the groups in different slots (${slots.size} ways in forty)`);
  ok(generateRift(spec(5)).encounters!.length === 4 && generateRift(spec(5)).features!.filter((f) => f.kind === 'chest').length === 1, 'the table\'s three groups and its warden, and one hoard, whatever the seed');
  let threw = '';
  try { generateRift({ ...spec(1), table: { groups: Array.from({ length: 5 }, () => ['riftling']) } }); } catch (e) { threw = String(e); }
  ok(threw.includes('5 groups for 4 slots'), `a table with more groups than the template has slots is refused (${threw})`);
  threw = '';
  try { rift({ ...spec(1), template: 'nowhere', material: 'brine' }); } catch (e) { threw = String(e); }
  ok(threw.includes("no template 'nowhere'"), 'and a template that does not exist');

  // Every template, every way it turns, in every material: the contract a hand-built map passes.
  const bad: string[] = [];
  let made = 0;
  for (const template of TEMPLATES) for (const material of MATERIALS) for (let s = 1; s <= 24; s++) {
    const def = generateRift({ ...spec(s, template), material, id: 'fx_rift' });
    made++;
    for (const f of faults(def, items)) bad.push(`${template.id}/${material.id}/${s}: ${f}`);
  }
  ok(!bad.length, `${made} Rifts, every template turned every way in every material, each pass the contract: reached, dense, its texts short, nothing stranded, its groups' comings and goings real${bad.length ? ' -> ' + [...new Set(bad)].slice(0, 6).join('; ') : ''}`);
  const words = MATERIALS.flatMap((m) => [m.name, m.enter, m.leave, m.tear, m.quiet, ...m.looks]);
  const glyphs = [...new Set(words.flatMap(missingGlyphs))], us = [...new Set(words.flatMap(americanisms))];
  ok(!glyphs.length && !us.length, `every material's words are in the font and spelt as the game spells${glyphs.length || us.length ? ' -> ' + [...glyphs, ...us].join(' ') : ''}`);
  ok(MATERIALS.map((m) => m.id).join() === 'ember,brine,glass,slag', 'four materials, the Stones\' Rifts up to the Kilns: ember, brine, black glass and slag');
  // The samples the sheet draws pass too, and are in no save.
  const sampleBad = RIFT_SAMPLES.flatMap((d) => faults(d, items).map((f) => `${d.id}: ${f}`));
  ok(RIFT_SAMPLES.length === 8 && !sampleBad.length, `the eight samples pass the contract${sampleBad.length ? ' -> ' + sampleBad.join('; ') : ''}`);
  ok(!RIFT_SAMPLES.some((d) => MAP_DEFS.some((m) => m.id === d.id)), 'and no area places them');
  const hung = RIFT_SAMPLES.flatMap((d) => { const m = new GameMap(d); return d.rows.flatMap((r, y) => [...r].flatMap((_, x) => (wallDressing(m, x, y) ? [`${d.id} ${x},${y}`] : []))); });
  ok(RIFT_SAMPLES.every((d) => d.bare) && !hung.length, `nothing hangs on a Rift's walls, not even a banner${hung.length ? ' -> ' + hung.slice(0, 4).join(', ') : ''}`);

  // A brine Rift on a box of the Delta: its tear walked into, the Rift walked, and back out.
  {
    const DELTA = rift({ ...spec(7), id: 'fx_delta_rift', material: 'brine', template: 'cells', until: { slain: 'fx_delta_rift:fx_delta_rift_warden' }, out: { to: 'fx_delta', tx: 3, ty: 2, tf: EAST } });
    const box: MapDef = { id: 'fx_delta', name: 'Fixture Fen', kind: 'outdoor', density: 'core', start: { x: 1, y: 2, facing: EAST }, rows: ['MMMMMMM', 'M,,,,,M', 'M,,,,,M', 'M,,,,,M', 'MMMMMMM'], features: [DELTA.way(4, 2)] };
    const maps = { fx_delta: new GameMap(box), fx_delta_rift: new GameMap(DELTA.map) };
    const r = makeRng(3), w = new World(maps, defaultParty(r), r);
    w.move('forward'); w.move('forward');
    const inside = w.move('forward');
    ok(w.state.mapId === 'fx_delta_rift' && w.state.x === DELTA.map.start.x && w.state.y === DELTA.map.start.y && w.state.facing === DELTA.map.start.facing
      && inside.kind === 'moved' && inside.messages.includes(MATERIALS[1].enter),
      `stepping on the tear takes the party into the Rift, at its way in, saying so (${w.state.mapId} ${w.state.x},${w.state.y})`);
    const ahead = w.map.ahead(w.state.x, w.state.y, w.state.facing);
    w.travel('fx_delta_rift', ahead.x, ahead.y, w.state.facing);
    w.turn('back');
    const out = w.move('forward');
    ok(w.state.mapId === 'fx_delta' && w.state.x === 3 && w.state.y === 2 && out.kind === 'moved' && out.messages.includes(MATERIALS[1].leave),
      `and stepping back on the way in takes it out beside the tear, saying so (${w.state.mapId} ${w.state.x},${w.state.y})`);
    const delta = faults(DELTA.map, items, [...MAP_DEFS, box]);
    ok(!delta.length, `the Delta's Rift passes the contract${delta.length ? ' -> ' + delta.join('; ') : ''}`);

    // The Stone restored (here, the warden fallen): the groups stop coming back, the tear goes quiet,
    // and the way in stays open.
    const groups = DELTA.map.encounters!.filter((e) => e.id !== 'fx_delta_rift_warden');
    const ms = w.ensureMapState('fx_delta_rift');
    const tear = DELTA.map.features!.find((f) => f.kind === 'event' && f.id === 'fx_delta_rift_tear')!;
    const quiet = DELTA.map.features!.find((f) => f.kind === 'event' && f.id === 'fx_delta_rift_quiet')!;
    ok(w.present(tear) && !w.present(quiet) && groups.every((e) => !w.ended(e)), 'while the warden stands the tear is open and its groups come back');
    ms.groups.fx_delta_rift_warden.dead = w.state.minutes;
    ok(!w.present(tear) && w.present(quiet) && groups.every((e) => w.ended(e)), 'once it falls the tear is quiet and the groups come back no more');
    ok(new GameMap(box).exitAt(4, 2)?.to === 'fx_delta_rift', 'and the tear on the box still leads in');
  }

  // Every tear an area places leads into a real map, onto an open square.
  const played = Object.fromEntries(PLAYED_DEFS.map((d) => [d.id, new GameMap(d)]));
  const tears = PLAYED_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'rift' ? [{ from: d.id, f }] : [])));
  const wrong = tears.filter(({ f }) => played[f.to]?.passable(f.tx, f.ty) !== 'ok').map(({ from, f }) => `${from} ${f.x},${f.y} -> ${f.to}`);
  ok(!wrong.length, `every tear on a map leads into a real Rift, onto an open square (${tears.length})${wrong.length ? ' -> ' + wrong.join(', ') : ''}`);
}
