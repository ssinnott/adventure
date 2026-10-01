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
import { logLines } from '../../src/ui/frame.ts';

/**
 * Zone maps laid before the map that joins them to the rest, and whose map that is: their squares
 * are reported as that issue's while none can be walked to, and fail once they all can, so the
 * entry is dropped here. Henlys, I4, is reached through I3 (#215), as H4 between it and H3 is cut.
 * Wrackholm's isle is reached by the smugglers' boat from Saltmouth (#177), a crossing's landing.
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
  const faces = [line(sh.x, sh.y, 1, 0, sh.w), line(sh.x, sh.y + sh.h - 1, 1, 0, sh.w), line(th.x, th.y, 1, 0, th.w)];
  ok(faces.every((s) => /^%+$/.test(s)), 'the Foreland\'s north and south edges and Thornmark\'s north edge are the end of the world');
  // South, the Deepthorn's edge (H3, #214): Thornmark's ring stands against it as mountains, with
  // the elves' road through a gap out of the Grove's hollow, and against I2 at its corner.
  const south = line(th.x, th.y + th.h - 1, 1, 0, th.w);
  ok(south === 'M'.repeat(8) + '=' + 'M'.repeat(23), `Thornmark's south edge is mountains against the Deepthorn, with the elves' road through a gap (${south})`);
  // East, the Eaves' way in (I2, #195): Thornmark's ring stands against it as mountains, with the
  // east road through a gap over the Hoarhills; its corner under the rim is the world's end.
  const eaves = out.zones.find((z) => z.id === 'eaves_i2')!;
  const east = line(th.x + th.w - 1, th.y, 0, 1, th.h);
  ok(east === '%' + 'M'.repeat(9) + '=' + 'M'.repeat(21), `Thornmark's east edge is mountains against the Eaves, with the east road through a gap (${east})`);
  // I2 and J2 (#196) meet in one wood, pines on both sides of the seam with the road through them;
  // the rim over both is the world's end.
  const j2 = out.zones.find((z) => z.id === 'eaves_j2')!, k2 = out.zones.find((z) => z.id === 'eaves_k2')!;
  const rim = line(eaves.x, eaves.y, 1, 0, eaves.w * 3), seam = line(eaves.x + eaves.w - 1, eaves.y, 0, 1, eaves.h);
  ok(/^%+$/.test(rim) && seam === '%MM' + 'T'.repeat(8) + '=' + 'T'.repeat(19) + 'M', `I2's north edge, J2's and K2's, the rim, are the end of the world, and I2's east edge is the wood on into J2, with the road through it (${seam})`);
  // J2 and K2 (#197) meet in the gorge: chasm on both sides of the seam north of the road, the east
  // road onto the rope bridge, and the west lip's dead wood and glass south of it. Past K2 the world
  // ends at L2 and K3, which are not built: the road on east through a gap in the ring.
  const lip = line(j2.x + j2.w - 1, j2.y, 0, 1, j2.h), gorge = line(k2.x, k2.y, 0, 1, k2.h);
  const k2east = line(k2.x + k2.w - 1, k2.y, 0, 1, k2.h), ends = [j2, k2].map((z) => line(z.x, z.y + z.h - 1, 1, 0, z.w));
  ok(lip === '%' + 'v'.repeat(22) + '==' + 'T'.repeat(6) + '%' && gorge === '%' + 'v'.repeat(23) + '=cddcdc%', `J2's east edge and K2's west edge are the gorge, but for the road onto the bridge and the woods south of it (${lip}; ${gorge})`);
  ok(k2east === '%'.repeat(22) + '=' + '%'.repeat(9) && ends.every((l) => /^%+$/.test(l)), `J2's and K2's south edges are the world's end, and K2's east edge, but for the east road on into L2 (${k2east})`);
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
    // but for a zone map laid before the one that joins it (CUT_OFF). A crossing a person sells
    // (game/passage.ts) puts the company down on its landing, so each landing on a zone map is
    // walked from too, as the gate counts it a way in (`landings`, tools/tests/gate.ts).
    const reached = new Uint8Array(out.width * out.height);
    const stack = [[out.def.start.x, out.def.start.y]];
    for (const d of MAP_DEFS) for (const f of d.features ?? []) if (f.kind === 'npc') for (const p of f.passage ?? []) {
      const z = out.zones.find((q) => q.id === p.to);
      if (z) stack.push([z.x + p.x, z.y + p.y]);
    }
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

  // The line at a border (#166): the company's level against the floor of the land it steps into.
  // Three boxes in a row, the road's (the Downs, 4 to 5) then two of the Delta (10 to 11, 11 to 12),
  // laid on a strip of world of their own with the atlas's own rows for the two zones.
  {
    const row = (id: string): AtlasZone => ATLAS.zones.find((z) => z.id === id)!;
    const box = (id: string, rows: string[], band: [number, number], exits: MapDef['exits'] = []): MapDef => ({ id, name: id, kind: 'outdoor', density: 'country', band, start: { x: 2, y: 1, facing: EAST }, rows, exits });
    const strip = (crossing?: AtlasZone['crossing'], label?: string): Record<string, GameMap> => {
      const atlas = { ...ATLAS, width: 18, height: 3, zones: [
        { ...row('downs'), maps: [{ map: 'fx_road', at: [0, 0] as const }] },
        { ...row('delta'), ...(crossing ? { crossing } : {}), maps: [{ map: 'fx_fen', at: [6, 0] as const }, { map: 'fx_deeper', at: [12, 0] as const }] },
      ] };
      const defs = [
        box('fx_road', ['MMMMMM', 'M,,,,,', 'MMMMMM'], [4, 5], label ? [{ x: 5, y: 1, to: 'fx_fen', tx: 0, ty: 1, label }] : []),
        box('fx_fen', ['MMMMMM', ',,,,,,', 'MMMMMM'], [10, 11]),
        box('fx_deeper', ['MMMMMM', ',,,,,M', 'MMMMMM'], [11, 12]),
      ];
      return Object.fromEntries(layOutdoors(atlas, defs).map((d) => [d.id, new GameMap(d)]));
    };
    /** What a company of `level` reads walking east from x0 to x1 along the strip. */
    const walk = (level: number, x0: number, x1: number, maps = strip()): string[] => {
      const party = defaultParty(makeRng(3));
      for (const m of party.members) m.level = level;
      const w = new World(maps, party, makeRng(3));
      w.travel(OUTDOORS, x0, 1, x1 > x0 ? EAST : 3);
      const said: string[] = [];
      for (let i = 0; i < Math.abs(x1 - x0); i++) { const r = w.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
      return said;
    };
    const warning = 'Nothing here would spare you. The road behind is still open.', harder = 'The land here is harder than the road behind.';
    const at7 = walk(7, 4, 7), at10 = walk(10, 4, 7), at9 = walk(9, 4, 7), at12 = walk(12, 4, 7);
    ok(at7.includes(`The Delta. ${warning}`), `a level-7 company stepping into the Delta reads the warning (${at7.join(' / ')})`);
    ok(at10.includes('The Delta.') && !at10.some((t) => t.includes(harder) || t.includes(warning)), `a level-10 one reads the name (${at10.join(' / ')})`);
    ok(at9.includes(`The Delta. ${harder}`) && at12.includes('The Delta.'), `one under, the land is harder than the road behind; over the band, the name alone (${at9.join(' / ')}; ${at12.join(' / ')})`);
    // Deeper into the same land: no name again, and only a floor that rises over the company is said.
    const deeper = walk(10, 8, 13), level = walk(11, 8, 13), down = walk(9, 13, 9);
    ok(deeper.length === 1 && deeper[0] === harder && level.length === 0, `deeper into the Delta a rising floor is said without the name, and a company at it hears nothing (${deeper.join(' / ')}; ${level.join(' / ') || 'nothing'})`);
    ok(down.length === 0, `and back down to a lower floor, still over the company, nothing is said (${down.join(' / ') || 'nothing'})`);
    // Straight back over the line and on again within the hour: nothing more.
    {
      const party = defaultParty(makeRng(3));
      for (const m of party.members) m.level = 7;
      const w = new World(strip(), party, makeRng(3));
      w.travel(OUTDOORS, 5, 1, EAST);
      const over = w.move('forward'), back = w.move('back'), again = w.move('forward');
      const lines = [over, back, again].map((r) => (r.kind === 'moved' ? r.messages.length : -1));
      ok(lines[0] === 1 && lines[1] === 0 && lines[2] === 0, `stepping back over the line and on again says nothing more (${lines.join(', ')} lines)`);
    }
    // The way's own arrival line names the place, so the feel follows it alone; and a zone's own words stand in for the world's.
    const arrival = walk(7, 4, 7, strip(undefined, 'The road drops into the fen.'));
    const own = walk(7, 4, 7, strip({ warning: 'The reeds close in.' })), ownHarder = walk(9, 4, 7, strip({ harder: 'The fen sucks at the boots.' }));
    ok(arrival.join(' / ') === `The road drops into the fen. ${warning}`, `after the way's own line, the feel alone, in the same entry of the log (${arrival.join(' / ')})`);
    // Every zone's line, its name and the longer feel, its own or the world's, wraps to two lines of the log at most.
    const long = ATLAS.zones.map((z) => [z.crossing?.harder ?? harder, z.crossing?.warning ?? warning].map((f) => `${z.name}. ${f}`)).flat().sort((a, b) => logLines(b).length - logLines(a).length)[0];
    ok(logLines(long).length <= 2, `every zone's crossing line fits two lines of the log (the longest ${logLines(long).length}: ${long})`);
    // And every way's arrival line between zone maps, with the longer feel folded in, keeps to the cap of three.
    const laid = layOutdoors(ATLAS, MAP_DEFS).find((d) => d.id === OUTDOORS)!.zones ?? [];
    const arrivals = laid.flatMap((z) => Object.values(z.enter ?? {}).map((a) => `${a} ${z.land?.crossing?.warning ?? warning}`)).sort((a, b) => logLines(b).length - logLines(a).length);
    ok(arrivals.length > 0 && logLines(arrivals[0]).length <= 3, `every arrival line with the warning after it fits three lines of the log (the longest ${logLines(arrivals[0] ?? '').length}: ${arrivals[0]})`);
    ok(own.includes('The Delta. The reeds close in.') && ownHarder.includes('The Delta. The fen sucks at the boots.'), `a zone's own words stand in for the world's (${own.join(' / ')}; ${ownHarder.join(' / ')})`);
  }
}
