// The outdoors as one map: the zone maps laid in 1:1 where the atlas puts them, the void round them,
// the ridge and its open pass, and every open square reachable.
import { buildMaps, PLAYED_DEFS } from '../../src/content/maps.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { layOutdoors, OUTDOORS } from '../../src/game/outdoors.ts';
import { ATLAS } from '../../src/content/index.ts';
import { mapAt } from '../../src/game/atlas.ts';
import type { AtlasZone } from '../../src/game/atlas.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { EAST } from '../../src/game/types.ts';
import { ok, owed, local, stopsWalk } from './lib.ts';

/**
 * Zone maps laid before the map that joins them to the rest, and whose map that is: their squares
 * are reported as that issue's while none can be walked to, and fail once they all can, so the
 * entry is dropped here. Henlys, I4, is reached through I3 (#215), as H4 between it and H3 is cut.
 */
const CUT_OFF: Record<string, string> = {};

export function outdoors(): void {
  // The outdoors is played as one map the size of the world, every zone map the atlas places laid into it.
  const zoneMaps = MAP_DEFS.filter((d) => d.kind === 'outdoor');
  const played = PLAYED_DEFS.filter((d) => d.kind === 'outdoor');
  ok(played.length === 1 && played[0].id === OUTDOORS, `the outdoors is played as one map (${played.map((d) => d.id).join(', ')})`);
  ok(PLAYED_DEFS[0].id === MAP_DEFS[0].id && PLAYED_DEFS.length === MAP_DEFS.length - zoneMaps.length + 1, 'Helmstow is still the first map, and the towns and dungeons are played as they are written');
  const out = new GameMap(played[0]);
  ok(out.width === ATLAS.width && out.height === ATLAS.height, `the outdoors is the world's size, square for square with the painted map (${out.width}x${out.height})`);
  for (const d of zoneMaps) {
    const z = out.zones.find((q) => q.id === d.id), at = mapAt(ATLAS, d.id);
    ok(!!z && !!at && z.x === at[0] && z.y === at[1] && z.w === d.rows[0].length && z.h === d.rows.length && z.name === d.name, `${d.id}: laid where the atlas puts it, and called ${d.name}`);
    if (!z) continue;
    let same = 0;
    for (let y = 1; y < z.h - 1; y++) for (let x = 1; x < z.w - 1; x++) if (out.at(z.x + x, z.y + y).ch === d.rows[y][x]) same++;
    ok(same === (z.w - 2) * (z.h - 2), `${d.id}: every square inside its ring is the map's own (${same} of ${(z.w - 2) * (z.h - 2)})`);
  }
  let outside = 0, blank = 0;
  for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) if (!out.zoneAt(x, y)) { outside++; if (out.at(x, y).solid === 'void') blank++; }
  ok(outside > 0 && blank === outside, `every square no zone map covers is void: the world ends there for now (${blank} of ${outside})`);
  ok(out.at(0, 0) === out.at(out.width - 1, out.height - 1) && Object.isFrozen(out.at(0, 0)), 'the void is one frozen cell, however much of it there is');
  // The mountains that closed each zone map in are, where they face nothing built, the end of the
  // world too; between the two zones they are the ridge, as they were, with the pass through it.
  const sh = out.zones.find((z) => z.id === 'shelf')!, th = out.zones.find((z) => z.id === 'thornmark')!;
  const line = (x: number, y: number, dx: number, dy: number, n: number): string => Array.from({ length: n }, (_, i) => out.at(x + dx * i, y + dy * i).ch).join('');
  const faces = [line(sh.x, sh.y, 1, 0, sh.w), line(sh.x, sh.y + sh.h - 1, 1, 0, sh.w), line(th.x, th.y, 1, 0, th.w), line(th.x + th.w - 1, th.y, 0, 1, th.h)];
  ok(faces.every((s) => /^%+$/.test(s)), 'the Foreland\'s north and south edges and Thornmark\'s north and east edges are the end of the world');
  // South, the Deepthorn's edge (H3, #214): Thornmark's ring stands against it as mountains, with
  // the elves' road through a gap out of the Grove's hollow; its corner past H3 is the world's end.
  const south = line(th.x, th.y + th.h - 1, 1, 0, th.w);
  ok(south === 'M'.repeat(8) + '=' + 'M'.repeat(22) + '%', `Thornmark's south edge is mountains against the Deepthorn, with the elves' road through a gap (${south})`);
  // West, the Downs: the Foreland's ring stands against F2 as mountains, with the Salt Road's gap.
  const west = line(sh.x, sh.y, 0, 1, sh.h);
  ok(west === '%' + 'M'.repeat(28) + '=M%', `the Foreland's west edge is mountains against the Downs, with the Salt Road through a gap (${west})`);
  const ridge = '%' + 'M'.repeat(8) + '=' + 'M'.repeat(21) + '%';
  ok(line(sh.x + sh.w - 1, sh.y, 0, 1, sh.h) === ridge && line(th.x, th.y, 0, 1, th.h) === ridge.slice(0, -1) + 'M', 'between them the ridge stands two squares thick with the pass through it, and runs out into the void at its north end and on Thornmark\'s side into the Deepthorn\'s edge at its south');
  // The ways: every one lands on open ground; none joins one zone to the next, which is walked; no
  // gate closes the road; and the towns and dungeons open onto the outdoors.
  const maps = buildMaps();
  for (const d of PLAYED_DEFS) for (const e of d.exits ?? []) ok(maps[e.to]?.passable(e.tx, e.ty) === 'ok', `${d.id} -> ${e.to}: lands on an open square (${e.tx},${e.ty})`);
  ok(!out.exits.some((e) => e.to === OUTDOORS), 'no exit joins one zone to the next: the way between them is walked');
  ok(out.gates.length === 0, `no gate closes the road through the outdoors${out.gates.length ? ' -> ' + out.gates.map((g) => `${g.x},${g.y}`).join(', ') : ''}`);
  { // The machinery stays for the story's own locks (EXPANSION §2.3): an exit into the zone next door
    // that asks for flags is laid as a gate on its square, and refuses the party until they are set.
    const defs = MAP_DEFS.map((d) => d.id !== 'shelf' ? d : { ...d, exits: d.exits!.map((e) => e.to !== 'thornmark' ? e : { ...e, needFlag: ['fixture_a', 'fixture_b'], blockedText: 'Fixture gate.' }) });
    const laid = layOutdoors(ATLAS, defs), fx = new GameMap(laid.find((d) => d.id === OUTDOORS)!);
    const g = fx.gates;
    ok(g.length === 1 && g[0].x === sh.x + 31 && g[0].y === sh.y + 9 && [g[0].needFlag].flat().join() === 'fixture_a,fixture_b' && g[0].blockedText === 'Fixture gate.', `an exit with flags into the zone next door is laid as a gate on its square, with its words (${g.map((q) => `${q.x},${q.y}`).join(', ')})`);
    const rng = makeRng(3), party = defaultParty(rng);
    const world = new World(Object.fromEntries(laid.map((d) => [d.id, new GameMap(d)])), party, rng);
    world.travel('shelf', 30, 9, EAST);
    const shut = world.move('forward');
    party.flags.fixture_a = 1;
    const half = world.move('forward');
    party.flags.fixture_b = 1;
    const open = world.move('forward');
    ok(shut.kind === 'blocked' && shut.reason === 'Fixture gate.' && half.kind === 'blocked' && open.kind === 'moved' && local(world).x === 31,
      `the gate refuses the party with its words until every flag is set, then lets it through (${shut.kind}, ${half.kind}, ${open.kind})`);
  }
  { // Helmstow's south gate, its bottom row, opens onto the road; its north gate into the keep's ward.
    const harrow = PLAYED_DEFS.find((d) => d.id === 'harrow')!, south = harrow.exits!.filter((e) => e.y === harrow.rows.length - 1);
    ok(south.length > 0 && south.every((e) => e.to === OUTDOORS && e.tx === sh.x + 16 && e.ty === sh.y + 4), 'Helmstow\'s south gate opens onto the Foreland road, where it always did');
    ok(harrow.exits!.filter((e) => e.y !== harrow.rows.length - 1).every((e) => e.y === 0 && e.to === 'keep'), 'and its only other way out is the north gate, into the keep\'s ward');
  }
  ok(sh.enter?.thornmark === 'Back through the pass to the Foreland.' && th.enter?.shelf === 'The pass opens onto old forest. Thornmark.', 'crossing from one zone to the other says what the exits used to');
  { // Every open square of the outdoors can be walked to from its start, given keys, secrets, water and climbing, and never through the void or the chasm,
    // but for a zone map laid before the one that joins it (CUT_OFF).
    const reached = new Uint8Array(out.width * out.height);
    const stack = [[out.def.start.x, out.def.start.y]];
    while (stack.length) {
      const [x, y] = stack.pop()!, k = y * out.width + x;
      if (reached[k] || stopsWalk(out, x, y)) continue;
      reached[k] = 1;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (out.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
    }
    let open = 0, got = 0;
    const cut = new Map(Object.keys(CUT_OFF).map((id) => [id, { open: 0, got: 0 }]));
    for (let y = 0; y < out.height; y++) for (let x = 0; x < out.width; x++) {
      if (stopsWalk(out, x, y) || out.at(x, y).solid !== 'none') continue;
      const z = out.zones.find((q) => cut.has(q.id) && x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h), tally = z ? cut.get(z.id)! : null;
      if (tally) { tally.open++; if (reached[y * out.width + x]) tally.got++; continue; }
      open++; if (reached[y * out.width + x]) got++;
    }
    ok(open > 1500 && got === open, `every open square of the outdoors is reachable from its start (${got} of ${open})`);
    for (const [id, t] of cut) owed(t.open > 0 && t.got === t.open, `every open square of ${id} is reachable from the outdoors' start (${t.got} of ${t.open})`, CUT_OFF[id]);
  }
  // The composer refuses what the outdoors cannot hold: two zones keeping state under one id, or two zone maps on one square.
  const refusal = (f: () => unknown): string => { try { f(); return ''; } catch (e) { return e instanceof Error ? e.message : String(e); } };
  const clash: MapDef[] = MAP_DEFS.map((d) => (d.id === 'thornmark' ? { ...d, features: [...(d.features ?? []), { kind: 'event', x: 2, y: 2, id: 'coast', text: '' }] } : d));
  ok(/'coast'/.test(refusal(() => layOutdoors(ATLAS, clash))), 'two zones may not share a feature id: the outdoors keeps one record for both');
  const heaped = { ...ATLAS, zones: ATLAS.zones.map((z): AtlasZone => (z.id === 'thornmark' ? { ...z, maps: [{ map: 'thornmark', at: [220, 30] }] } : z)) };
  ok(/laid over/.test(refusal(() => layOutdoors(heaped, MAP_DEFS))), 'nor may two zone maps be laid on the same squares');
}
