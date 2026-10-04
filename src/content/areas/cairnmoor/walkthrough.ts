// Cairnmoor's walkthrough. Its chapter, The Ring, is #481's, which plays it here; until then, the
// road up onto the moor (N7, #476) walked: the drove road on out of the Kilns' N6 over the border,
// the crossing line said in snow to a company two under the moor's floor and its name alone to one
// at it; the road square to square over the hills and out south for N8, and the peat-cutter's track
// out east for O7, where for now the world ends; the milestone where the hills give out, counted
// along the roads, and the coach that goes by it by day; the drover at the shelter; the box's groups
// won at its floor, the hounds by night; and the drovers' cache under the first cairn, found from
// what the ravens leave on it.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { NORTH, SOUTH } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { worldGrid } from '../../../game/atlas.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GATE } from '../kilns/maps/ironfells_n3.ts';

const N7 = MAP_DEFS.find((d) => d.id === 'highmoor_n7')!;
const DROVER = N7.features!.find((f) => f.kind === 'npc' && f.name === 'A drover') as Person;
const MOOR = ATLAS.zones.find((z) => z.id === 'highmoor')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const n7 = out.zones.find((z) => z.id === 'highmoor_n7')!, n3 = out.zones.find((z) => z.id === 'ironfells_n3')!;

  // The crossing: down N6's drove road over the border and onto the moor. Two levels under its
  // floor the moor's own words, in snow; at the floor its name and nothing more.
  const cross = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('kilnsheart_n6', 3, 29, SOUTH);
    const said: string[] = [];
    for (let i = 0; i < 4 && w.world.zone?.id !== 'highmoor_n7'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    ok(w.world.zone?.id === 'highmoor_n7' && w.world.state.x === n7.x + 3 && w.world.state.y === n7.y, `the drove road crosses from N6's 3,31 onto N7's 3,0 at ${level}`);
    return said;
  };
  const early = cross(16), due = cross(18);
  ok(early.includes(`High Moor. ${MOOR.crossing?.harder}`), `a company of 16 hears High Moor named, and the snow beginning, harder than the road behind (${early.join(' / ')})`);
  ok(due.includes('High Moor.') && !due.some((m) => /snow begins|harder|spare you/.test(m)), `a company of 18 hears High Moor named, and no warning (${due.join(' / ')})`);
  listen(w);
  w.level = 18;

  // The road square to square over the hills and out by the south edge for N8, and the peat-cutter's
  // track off it east to the east edge for O7; past each, for now, the world ends.
  const road = (x: number, y: number): boolean => out.at(x, y).ch === '=';
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Map<number, number> => {
    const d = new Map([[fy * out.width + fx, 0]]), q = [[fx, fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i], n = d.get(y * out.width + x)!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!d.has(k) && along(x + dx, y + dy)) { d.set(k, n + 1); q.push([x + dx, y + dy]); } }
    }
    return d;
  };
  const onN7 = (x: number, y: number): boolean => x >= n7.x && x < n7.x + n7.w && y >= n7.y && y < n7.y + n7.h;
  ok(reach(n7.x + 3, n7.y, (x, y) => road(x, y) && onN7(x, y)).has((n7.y + 31) * out.width + n7.x + 7), 'the drove road runs square to square over N7 from 3,0 to 7,31');
  ok(road(n7.x + 7, n7.y + 31) && out.passable(n7.x + 7, n7.y + 32) !== 'ok', 'the drove road leaves N7 by its south edge for N8, and past it, for now, the world ends');
  ok(out.at(n7.x + 31, n7.y + 22).ch === ':' && out.at(n7.x + 7, n7.y + 20).ch === ':' && out.passable(n7.x + 32, n7.y + 22) !== 'ok', 'the peat-cutter\'s track leaves the road at the fork and N7 by its east edge for O7, and past it, for now, the world ends');

  // The milestone where the hills give out, counted along the roads at 13 squares to the unit, a corner
  // walked where a road turns on a diagonal: north on the built road to the front of Anvilhall's gate,
  // and south on the drove road, the atlas's beyond the boxes built, to Rime Lodge.
  const grid = worldGrid(ATLAS, MAP_DEFS);
  const drove = (x: number, y: number): boolean => road(x, y) || (!out.zoneAt(x, y) && !!grid.road[y * out.width + x]);
  const corner = (along: (x: number, y: number) => boolean) => (x: number, y: number): boolean => along(x, y) || ((out.passable(x, y) === 'ok' || !out.zoneAt(x, y)) && [-1, 1].some((d) => along(x + d, y)) && [-1, 1].some((d) => along(x, y + d)));
  const stone = N7.features!.find((f) => f.kind === 'event' && f.id === 'n7_milestone')!;
  const [sx, sy] = [n7.x + stone.x, n7.y + stone.y];
  const toHall = reach(sx, sy, corner(road)).get((n3.y + GATE.y + 1) * out.width + n3.x + GATE.x) ?? Infinity;
  // The road's square nearest the lodge, and the steps on from it to the lodge's door.
  const [lx, ly] = ATLAS.sites.find((s) => s.name === 'Rime Lodge')!.at;
  const end = [...reach(sx, sy, corner(drove))].map(([k, n]) => ({ n, left: Math.abs(k % out.width - lx) + Math.abs(Math.floor(k / out.width) - ly) }))
    .reduce((a, b) => (b.left < a.left || (b.left === a.left && b.n < a.n) ? b : a));
  const toLodge = end.n + end.left;
  ok(road(sx, sy) && stone.kind === 'event' && stone.text.includes(`RIME LODGE ${Math.round(toLodge / 13)} `) && stone.text.includes(`ANVILHALL ${Math.round(toHall / 13)} `),
    `the milestone says RIME LODGE ${Math.round(toLodge / 13)} and ANVILHALL ${Math.round(toHall / 13)}: ${toLodge} squares along the drove road to the lodge and ${toHall} to Anvilhall's gate`);
  const coach = N7.features!.find((f) => f.kind === 'event' && f.id === 'n7_coach');
  ok(coach?.kind === 'event' && coach.x === stone.x && coach.y === stone.y && JSON.stringify(coach.when) === JSON.stringify({ hours: 'day' }) && !N7.features!.some((f) => f.kind === 'npc' && f.passage),
    'by day the coach goes by the milestone, and nobody on the moor sells its passage: it does not stop');

  // The drover at the shelter, with his rumour of the lights and the ring.
  w.world.travel('highmoor_n7', DROVER.x, DROVER.y);
  const rumour = meet(DROVER, w.party, heard(w.world, DROVER)).text;
  ok(rumour.includes('lights were out') && rumour.includes('ring was lit'), 'the drover at the shelter says the lights were out over the bog last night, and the ring was lit');

  // The box's groups, each won at its floor: the ravens on the first cairn, the bog bodies in the
  // marsh and the hounds on the road's southern reach by night.
  for (const g of N7.encounters!) fight(w, `highmoor_n7:${g.id}`);
  const hounds = N7.encounters!.find((g) => g.id === 'n7_hounds');
  ok(JSON.stringify(hounds?.when) === JSON.stringify({ hours: 'night' }), 'the hounds walk the moor by night');

  // The secret: the droppings on the cairn's top, the search at its foot and the hollow under it behind
  // the stone that lifts. Walked, waded, climbed or floated, it is never reached but through the stone.
  const shut = (from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[n7.x + from[0], n7.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === n7.x + door[0] && y === n7.y + door[1]) || !onN7(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((n7.y + prize[1]) * out.width + n7.x + prize[0]) };
  };
  const hollow = shut([9, 24], [9, 23], [9, 22]);
  ok(hollow.size > 900 && !hollow.reached, `the hollow is shut but for the stone: none of N7's ${hollow.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'highmoor_n7:n7_droppings');
  w.world.travel('highmoor_n7', 9, 24, NORTH);
  let lifts = false;
  for (let i = 0; i < 20 && !lifts; i++) lifts = w.world.search();
  const under = lifts ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(lifts && under.every((r) => r.kind === 'moved') && w.world.used('n7_hollow'), 'searched at the cairn\'s foot, a stone lifts, and the hollow under it can be walked into');
  listen(w);
  const cache = N7.features!.find((f) => f.kind === 'chest' && f.id === 'n7_cache');
  ok(cache?.kind === 'chest' && cache.items.includes('forge_hammer+1') && cache.gold === 1150 && cache.x === 9 && cache.y === 22, 'in the hollow, the drovers\' takings and a second Forge Hammer +1');
};
