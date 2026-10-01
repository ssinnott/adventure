// Saltreach's walkthrough. Its chapter, The Tide Stone, is #180's, which plays it here; until then,
// the Delta road (C5 and D5, #170) walked: down off Kestrel Edge onto the shore, where the land says
// what it is to a company under its band; the hermit on the islet, who points up the spur; the
// barge under the causeway's arch found from its hint; and the box's groups and its Rift's won at
// its floor. Then west over the fen to Stienwierde (B5, #173): the duckboards to the plinth, empty;
// the hermit who counts the Rifts' lights; the hollow under the landing found from its pole-marks;
// and the box's groups and its two Rifts' won at 11. Then back to the road and down it into
// Saltmouth's box (C6, #176): the Saltings named at the seam, the gate shut until #177 builds the
// town, the smugglers' stair found from the rope that hangs over it, and the quay's and the pans'
// groups won at the box's floor. Then south into the pans (C7, #178): the Scarp across the south and
// its stair's fallen foot, the sealed pan's hoard found from the trodden wall, and the crabs and
// the toads won at 11.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, fight, listen, see } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { GameMap } from '../../../game/map.ts';
import { MAP_DEFS } from '../../index.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';

const D5 = MAP_DEFS.find((d) => d.id === 'delta_d5')!;
const C5 = MAP_DEFS.find((d) => d.id === 'delta_c5')!;
const RIFT = MAP_DEFS.find((d) => d.id === 'c5_rift')!;
const B5 = MAP_DEFS.find((d) => d.id === 'delta_b5')!;
const B5_COUNTER = B5.features!.find((f) => f.kind === 'npc') as Person;
const C6 = MAP_DEFS.find((d) => d.id === 'saltings_c6')!;
const C7 = MAP_DEFS.find((d) => d.id === 'saltings_c7')!;
const HERMIT = D5.features!.find((f) => f.kind === 'npc') as Person;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);

  // Down off the Edge: the Salt Road leaves D4's foot and the shore under it is the Delta's, which
  // tells a company far under its band so, and is never a wall.
  w.world.travel('downs_d4', 1, 30, SOUTH);
  const said: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'delta_d5'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
  ok(w.world.zone?.id === 'delta_d5', 'the Salt Road out of D4 leads onto the shore under the Edge, D5');
  ok(said.some((m) => m.includes('The Delta.') && m.includes('Nothing here would spare you')), `crossing into the Delta at level 1, the land is named and it warns (${said.join(' | ')})`);
  listen(w);
  const milestone = D5.features!.find((f) => f.kind === 'sign');
  ok(milestone?.kind === 'sign' && milestone.text.includes('SALTMOUTH 4') && milestone.text.includes('RIETUM 9') && D5.rows[milestone.y][milestone.x - 1] === '=', 'the milestone stands by the road: Saltmouth 4, Rietum 9');

  w.level = 10;
  // The hermit on the islet saw the barge go by, and sends the company up the spur.
  w.world.travel('delta_d5', HERMIT.x, HERMIT.y);
  const words = meet(HERMIT, w.party, heard(w.world, HERMIT)).text;
  ok(words.includes('Rietum') && words.includes('sacking'), 'the hermit saw the barge go by with a light in its sacking, and sends the company to Rietum');

  // On down the road into C5.
  walkThrough(w, 'delta_d5', 0, 2, WEST, 'delta_c5');

  // The secret: the mast's stump at the arch, then the search, the hollow and the barge's hold.
  w.world.travel('delta_c5', 26, 22, EAST);
  w.world.eventsHere();
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved'), 'searched from the arch, the hollow under it opens, and can be walked into');
  ok(w.world.used('c5_barge'), 'in the hollow, the drowned barge is found');
  const hold = C5.features!.find((f) => f.kind === 'chest' && f.id === 'c5_barge_hold');
  ok(hold?.kind === 'chest' && hold.items.includes('brine_shard') && hold.x === 28 && hold.y === 22, 'in its straw, a Brine Shard');
  listen(w);

  // The box's groups, each won at its floor: the pools' leeches and eels, the bull toad at the far end.
  for (const g of C5.encounters!) fight(w, `delta_c5:${g.id}`);

  // The Rift on its islet: walked into from its neck, and its groups and its warden won at 10.
  walkThrough(w, 'delta_c5', 20, 13, NORTH, 'c5_rift', 2);
  for (const g of RIFT.encounters!) fight(w, `c5_rift:${g.id}`);

  // West off the Delta road over the fen, onto the duckboards of B5.
  w.level = 11;
  walkThrough(w, 'delta_c5', 0, 13, WEST, 'delta_b5', 2);

  // The step: the plinth on Stienwierde, empty, its socket cut clean.
  see(w, 'delta_b5:b5_plinth');
  ok(w.world.used('b5_plinth'), 'on Stienwierde the plinth stands empty');

  // The hermit on the hummock counts the Rifts' lights.
  w.world.travel('delta_b5', B5_COUNTER.x, B5_COUNTER.y);
  const count = meet(B5_COUNTER, w.party, heard(w.world, B5_COUNTER)).text;
  ok(count.includes('Two') && count.includes('island'), 'the hermit on the hummock counts two lights, and sends the company to the island');

  // The secret: the pole-marks on the landing, then the search, the hollow under it and its cache.
  w.world.travel('delta_b5', 13, 13, SOUTH);
  ok(w.world.eventsHere().some((m) => m.includes('barge-poles')), 'on the plinth\'s landing, the barge-poles\' marks');
  let under = false;
  for (let i = 0; i < 20 && !under; i++) under = w.world.search();
  const down = under ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(under && down.every((r) => r.kind === 'moved'), 'searched from the landing, the hollow under it opens, and can be walked into');
  ok(w.world.used('b5_under'), 'under the landing, what the thieves dropped');
  const cache = B5.features!.find((f) => f.kind === 'chest' && f.id === 'b5_under_cache');
  ok(cache?.kind === 'chest' && cache.items.includes('brine_shard') && cache.items.includes('shield+1'), 'in the hollow, a Brine Shard and a Kite Shield +1');
  listen(w);

  // The box's groups, each won at its floor.
  for (const g of B5.encounters!) fight(w, `delta_b5:${g.id}`);

  // The two Rifts, each walked into from its hummock and won at 11.
  for (const [id, x, y, f] of [['b5_rift_n', 16, 6, NORTH], ['b5_rift_s', 26, 25, SOUTH]] as const) {
    walkThrough(w, 'delta_b5', x, y, f, id, 2);
    for (const g of MAP_DEFS.find((d) => d.id === id)!.encounters!) fight(w, `${id}:${g.id}`);
  }

  // On down the road into Saltmouth's box: the fen gives way to the Saltings at the seam.
  w.world.travel('delta_c5', 26, 30, SOUTH);
  const crossed: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'saltings_c6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') crossed.push(...r.messages); }
  ok(w.world.zone?.id === 'saltings_c6' && crossed.some((m) => m.includes('The Saltings')), `the Salt Road out of C5 leads into the Saltings, C6, and the land is named (${crossed.join(' | ')})`);
  listen(w);
  const stone = C6.features!.find((f) => f.kind === 'sign');
  ok(stone?.kind === 'sign' && stone.text.includes('SALTMOUTH 2') && stone.text.includes('RIETUM 7') && C6.rows[stone.y][stone.x + 1] === '=', 'the milestone stands by the road: Saltmouth 2, Rietum 7');

  // The gate is shut until #177 builds the town behind it, and says so by what is seen.
  const gate = C6.features!.find((f) => f.kind === 'event' && f.id === 'c6_gate');
  ok(gate?.kind === 'event' && gate.text.includes('shut') && new GameMap(C6).passable(gate.x, gate.y + 1) !== 'ok', 'the road ends at Saltmouth\'s gate, shut in the wall');

  // The quay's crate, the crews' cargo: the Scale Mail.
  const crate = C6.features!.find((f) => f.kind === 'chest' && f.id === 'c6_crate');
  ok(crate?.kind === 'chest' && crate.items.includes('scale+1'), 'on the quay, a crate of the crews\' cargo holds a Scale Mail +1');

  // The secret: the rope over the sea wall's dry end, then the search, the stair and its cache.
  w.world.travel('saltings_c6', 28, 18, SOUTH);
  w.world.eventsHere();
  let opened = false;
  for (let i = 0; i < 20 && !opened; i++) opened = w.world.search();
  const up = opened ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opened && up.every((r) => r.kind === 'moved'), 'searched under the rope, the sea wall opens, and the stair inside can be walked into');
  ok(w.world.used('c6_stair'), 'inside the wall, the stair up to the barred door and down to the shore');
  const stairCache = C6.features!.find((f) => f.kind === 'chest' && f.id === 'c6_stair_cache');
  ok(stairCache?.kind === 'chest' && C6.rows[stairCache.y][stairCache.x] === '.' && C6.rows[stairCache.y][stairCache.x + 1] === '#', 'at the stair\'s foot, by the barred sea door, the smugglers\' cache');
  listen(w);

  // The box's groups at its floor: the bargemen by day, the Hand's smugglers by night, the crabs.
  for (const g of C6.encounters!) fight(w, `saltings_c6:${g.id}`);

  // South out of Saltmouth's pans into C7's, under the Scarp.
  w.world.travel('saltings_c6', 17, 30, SOUTH);
  for (let i = 0; i < 3 && w.world.zone?.id !== 'saltings_c7'; i++) w.world.move('forward');
  ok(w.world.zone?.id === 'saltings_c7', 'south from Saltmouth\'s box the salt runs on into the pans, C7');
  listen(w);
  const foot = C7.features!.find((f) => f.kind === 'event' && f.id === 'c7_stair');
  ok(foot?.kind === 'event' && C7.rows[foot.y + 1][foot.x] === 'M' && new GameMap(C7).passable(foot.x, foot.y) === 'ok', 'the Scarp stair\'s foot is a notch in the cliff, its lowest flight fallen, walked to and no further');

  // The secret: the one wall trodden, then the search, the crabs' hole and the sealed pan's hoard.
  const hoard = C7.features!.find((f) => f.kind === 'chest' && f.id === 'c7_hoard');
  const shut = new GameMap({ ...C7, rows: C7.rows.map((r) => r.replaceAll('S', '#')) });
  const seen = new Set<string>([`${C7.start.x},${C7.start.y}`]), q = [[C7.start.x, C7.start.y]];
  for (let k = 0; k < q.length; k++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const x = q[k][0] + dx, y = q[k][1] + dy;
    if (!seen.has(`${x},${y}`) && shut.passable(x, y) === 'ok') { seen.add(`${x},${y}`); q.push([x, y]); }
  }
  ok(hoard?.kind === 'chest' && hoard.items.includes('crabshell_buckler') && !seen.has(`${hoard.x},${hoard.y}`), 'the salter\'s hoard, a Crab-Shell Buckler, lies in a pan no lane or sluice reaches');
  w.world.travel('saltings_c7', 31, 5, WEST);
  w.world.eventsHere();
  let holed = false;
  for (let i = 0; i < 20 && !holed; i++) holed = w.world.search();
  const inside = holed ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(holed && inside.every((r) => r.kind === 'moved'), 'searched by the trodden wall, the crabs\' hole opens under it, and the sealed pan can be walked into');
  listen(w);

  // The box's groups at its floor: the crabs in the pans, the bull toads in the last marsh.
  for (const g of C7.encounters!) fight(w, `saltings_c7:${g.id}`);
};
