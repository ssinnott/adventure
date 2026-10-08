// Cairnmoor's walkthrough. Its chapter, The Ring, is #481's, which plays it here; until then, the
// road up onto the moor (N7, #476) and the Cairnfield (N8, #479) walked: the drove road on out of the
// Kilns' N6 over the border, the crossing line said in snow to a company two under the moor's floor
// and its name alone to one at it; the road square to square over the hills and on south into N8, and
// the peat-cutter's track out east for O7, where for now the world ends; the milestone where the hills
// give out, counted along the roads, and the coach that goes by it by day; the drover at the shelter;
// the box's groups won at its floor, the hounds by night; and the drovers' cache under the first cairn,
// found from what the ravens leave on it. Then over the seam into the Cairnfield, named; its road
// square to square to its head and the notch, taken down onto M9 once that is built (NOTCH); Carn
// Dubh's door (DOOR) and the Cairns through it (#480): the cairn's passage, its cells of the dead in
// rows and the Watcher's cell with the first page of his tally, the stair down to the smooth hall under
// the cairn, the King on its seat and the door behind it, which nothing opens, and the cell off the
// stair found from the rows; the milestone at the head; the hermit, who knows the oldest cairn; the
// box's groups won at its floor, the wights cursing; and the coach's strongbox, found from the coach's
// open door.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen, type Walk } from '../../../../tools/walk.ts';
import { NORTH, SOUTH, EAST, WEST } from '../../../game/types.ts';
import { ATLAS, ITEMS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { worldGrid } from '../../../game/atlas.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GameMap } from '../../../game/map.ts';
import type { MapDef, MapZone } from '../../../game/map.ts';
import { LOCKS } from '../../locks.ts';
import { GATE } from '../kilns/maps/ironfells_n3.ts';
import { DOOR, NOTCH } from './maps/cairnfield_n8.ts';
import { MONSTERS } from './monsters.ts';

const N7 = MAP_DEFS.find((d) => d.id === 'highmoor_n7')!, N8 = MAP_DEFS.find((d) => d.id === 'cairnfield_n8')!;
const DROVER = N7.features!.find((f) => f.kind === 'npc' && f.name === 'A drover') as Person;
const HERMIT = N8.features!.find((f) => f.kind === 'npc' && f.name === 'A hermit') as Person;
const MOOR = ATLAS.zones.find((z) => z.id === 'highmoor')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const n7 = out.zones.find((z) => z.id === 'highmoor_n7')!, n8 = out.zones.find((z) => z.id === 'cairnfield_n8')!, n3 = out.zones.find((z) => z.id === 'ironfells_n3')!;

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

  // The road square to square over the hills and on south into N8, and the peat-cutter's track off it
  // east to the east edge for O7, past which, for now, the world ends.
  const road = (x: number, y: number): boolean => out.at(x, y).ch === '=';
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Map<number, number> => {
    const d = new Map([[fy * out.width + fx, 0]]), q = [[fx, fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i], n = d.get(y * out.width + x)!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!d.has(k) && along(x + dx, y + dy)) { d.set(k, n + 1); q.push([x + dx, y + dy]); } }
    }
    return d;
  };
  const on = (z: MapZone) => (x: number, y: number): boolean => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;
  const onN7 = on(n7), onN8 = on(n8);
  ok(reach(n7.x + 3, n7.y, (x, y) => road(x, y) && onN7(x, y)).has((n7.y + 31) * out.width + n7.x + 7), 'the drove road runs square to square over N7 from 3,0 to 7,31');
  ok(road(n7.x + 7, n7.y + 31) && n8.x === n7.x && n8.y === n7.y + 32 && road(n8.x + 7, n8.y), 'the drove road leaves N7 by its south edge at 7,31 and runs on onto N8\'s 7,0');
  ok(out.at(n7.x + 31, n7.y + 22).ch === ':' && out.at(n7.x + 7, n7.y + 20).ch === ':' && out.passable(n7.x + 32, n7.y + 22) !== 'ok', 'the peat-cutter\'s track leaves the road at the fork and N7 by its east edge for O7, and past it, for now, the world ends');

  // The milestones, counted along the roads at 13 squares to the unit, a corner walked where a road
  // turns on a diagonal: north on the built road to the front of Anvilhall's gate, and south on the
  // drove road, the atlas's beyond the boxes built, to its square nearest Rime Lodge and on from it
  // to the lodge.
  const grid = worldGrid(ATLAS, MAP_DEFS);
  const drove = (x: number, y: number): boolean => road(x, y) || (!out.zoneAt(x, y) && !!grid.road[y * out.width + x]);
  const corner = (along: (x: number, y: number) => boolean) => (x: number, y: number): boolean => along(x, y) || ((out.passable(x, y) === 'ok' || !out.zoneAt(x, y)) && [-1, 1].some((d) => along(x + d, y)) && [-1, 1].some((d) => along(x, y + d)));
  const [lx, ly] = ATLAS.sites.find((s) => s.name === 'Rime Lodge')!.at;
  const count = (sx: number, sy: number): { lodge: number; hall: number } => {
    const hall = reach(sx, sy, corner(road)).get((n3.y + GATE.y + 1) * out.width + n3.x + GATE.x) ?? Infinity;
    const end = [...reach(sx, sy, corner(drove))].map(([k, n]) => ({ n, left: Math.abs(k % out.width - lx) + Math.abs(Math.floor(k / out.width) - ly) }))
      .reduce((a, b) => (b.left < a.left || (b.left === a.left && b.n < a.n) ? b : a));
    return { lodge: end.n + end.left, hall };
  };
  const stone = N7.features!.find((f) => f.kind === 'event' && f.id === 'n7_milestone')!;
  const [sx, sy] = [n7.x + stone.x, n7.y + stone.y];
  const { lodge: toLodge, hall: toHall } = count(sx, sy);
  ok(road(sx, sy) && stone.kind === 'event' && stone.text.includes(`RIME LODGE ${Math.round(toLodge / 13)} `) && stone.text.includes(`ANVILHALL ${Math.round(toHall / 13)} `),
    `the milestone says RIME LODGE ${Math.round(toLodge / 13)} and ANVILHALL ${Math.round(toHall / 13)}: ${toLodge} squares along the drove road to the lodge and ${toHall} to Anvilhall's gate`);
  const coach = N7.features!.find((f) => f.kind === 'event' && f.id === 'n7_coach');
  ok(coach?.kind === 'event' && coach.x === stone.x && coach.y === stone.y && JSON.stringify(coach.when) === JSON.stringify({ hours: 'day' }) && ![N7, N8].some((d) => d.features!.some((f) => f.kind === 'npc' && f.passage)),
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
  const shut = (z: MapZone, from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const inside = on(z), seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === z.x + door[0] && y === z.y + door[1]) || !inside(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((z.y + prize[1]) * out.width + z.x + prize[0]) };
  };
  const hollow = shut(n7, [9, 24], [9, 23], [9, 22]);
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

  // N8, the Cairnfield (#479): over the seam from N7's 7,31 onto N8's 7,0, where the Cairnfield is named.
  w.world.travel('highmoor_n7', 7, 30, SOUTH);
  const into: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'cairnfield_n8'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') into.push(...r.messages); }
  ok(w.world.zone?.id === 'cairnfield_n8' && w.world.state.x === n8.x + 7 && w.world.state.y === n8.y && into.some((m) => m.startsWith('The Cairnfield.')),
    `the drove road crosses from N7's 7,31 onto N8's 7,0, and the Cairnfield is named (${into.join(' / ')})`);

  // The road square to square down the west side to its head, and the notch at its end, where it is
  // taken down onto M9's road once M9 is built (NOTCH, the atlas's way); past it, for now, the world ends.
  ok(reach(n8.x + 7, n8.y, (x, y) => road(x, y) && onN8(x, y)).has((n8.y + 28) * out.width + n8.x + 1), 'the drove road runs square to square over N8 from 7,0 down its west side to its head at 1,28');
  const down = ATLAS.links.find((l) => l.from === 'cairnfield' && l.to === 'longmere');
  ok(NOTCH.x === 0 && NOTCH.y === 28 && NOTCH.to === 'longmere_m9' && !N8.exits?.some((e) => e.to === NOTCH.to) && out.passable(n8.x + NOTCH.x, n8.y + NOTCH.y) === 'ok' && out.passable(n8.x + NOTCH.x - 1, n8.y + NOTCH.y) !== 'ok'
    && down?.a?.[0] === n8.x + NOTCH.x && down.a[1] === n8.y + NOTCH.y && down.b?.[0] === 392 + NOTCH.tx && down.b[1] === 254 + NOTCH.ty,
  'the road ends at the notch, 0,28, the atlas\'s way down to M9\'s road at 22,8 written beside the map (NOTCH), and past it, for now, the world ends');

  // Carn Dubh's door in its side, where the atlas puts the Cairns' way in (DOOR), walked in `carnDubh`
  // below (#480).
  const carn = ATLAS.sites.find((s) => s.name === 'Carn Dubh')!.at;
  ok(DOOR.to === 'cairns' && carn[0] === n8.x + DOOR.x && carn[1] === n8.y + DOOR.y && out.at(n8.x + DOOR.x, n8.y + DOOR.y).door === 'door' && !!N8.exits?.includes(DOOR) && road(n8.x + DOOR.x - 1, n8.y + DOOR.y),
    'Carn Dubh\'s door is in its side at 6,18, where the atlas puts the Cairns\' way in, beside the road, and it is a door, the way into the Cairns');
  w.world.travel('cairnfield_n8', DOOR.x - 1, DOOR.y, EAST);
  ok(!w.world.eventsHere().length, 'before the door nothing more is said: it is no longer shut fast');
  const before = w.level;
  carnDubh(w, ok);
  w.level = before;

  // The milestone at the road's head, counted as the first is.
  const head = N8.features!.find((f) => f.kind === 'event' && f.id === 'n8_milestone')!;
  const at = count(n8.x + head.x, n8.y + head.y);
  ok(road(n8.x + head.x, n8.y + head.y) && head.kind === 'event' && head.text.includes(`RIME LODGE ${Math.round(at.lodge / 13)} `) && head.text.includes(`ANVILHALL ${Math.round(at.hall / 13)} `),
    `the milestone at the road's head says RIME LODGE ${Math.round(at.lodge / 13)} and ANVILHALL ${Math.round(at.hall / 13)}: ${at.lodge} squares to the lodge and ${at.hall} to Anvilhall's gate`);

  // The hermit among the cairns, who knows which is oldest.
  w.world.travel('cairnfield_n8', HERMIT.x, HERMIT.y);
  const oldest = meet(HERMIT, w.party, heard(w.world, HERMIT)).text;
  ok(oldest.includes('Carn Dubh is the oldest'), 'the hermit among the cairns knows which is oldest: Carn Dubh');

  // The box's groups, each won at its floor: the ravens on the first cairns and the bog bodies out of
  // the frozen pool, the wights at two cairns, whose touch curses (#537), and the hounds at the road's
  // head by night.
  for (const g of N8.encounters!) fight(w, `cairnfield_n8:${g.id}`);
  const wight = MONSTERS.find((m) => m.id === 'cairn_wight');
  ok(N8.encounters!.filter((g) => g.monsters.includes('cairn_wight')).length === 2 && wight?.inflict?.cond === 'cursed' && JSON.stringify(N8.encounters!.find((g) => g.id === 'n8_hounds')?.when) === JSON.stringify({ hours: 'night' }),
    'cairn wights at two of the cairns, whose touch curses, and the hounds at the road\'s head by night');

  // The secret: the coach's open door and the snow trodden inside it, the search there and the strongbox
  // under the seat. Walked, waded, climbed or floated, it is never reached but through the coach's door.
  const strong = shut(n8, [6, 9], [7, 9], [8, 9]);
  ok(strong.size > 800 && !strong.reached, `the strongbox is shut but for the coach's door: none of N8's ${strong.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'cairnfield_n8:n8_coach_door');
  w.world.travel('cairnfield_n8', 6, 9, EAST);
  let seat = false;
  for (let i = 0; i < 20 && !seat; i++) seat = w.world.search();
  const inside = seat ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(seat && inside.every((r) => r.kind === 'moved') && w.world.used('n8_seat'), 'searched at the coach\'s open door, the seat comes up, and the strongbox under it can be reached');
  listen(w);
  const strongbox = N8.features!.find((f) => f.kind === 'chest' && f.id === 'n8_strongbox');
  ok(strongbox?.kind === 'chest' && strongbox.items.includes('steel_bow+1') && strongbox.gold === 970 && strongbox.x === 8 && strongbox.y === 9, 'in the strongbox, the fare for the lodge and a second Steel Bow +1');
};

/**
 * Carn Dubh (#480): in at the door in the cairn's side and out again; the cairn at 18, the bog's dead
 * in its passage and the count cut in its wall, the cells of the dead in rows and their wights won, the
 * Watcher's cell and his wight, which never comes back, and the first page of his tally under his
 * hands; under the cairn at 19, down the stair through the bedrock to the smooth hall, the wights over
 * the rows won, the King won on its seat and the door behind it, which nothing opens, with nothing
 * beside it; and the cell off the stair, found from the rows, with the Hill Torc.
 */
function carnDubh(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const [L1, L2] = ['cairns', 'cairns2'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  w.level = 18;

  // In at the door: onto the passage's first square, facing in; stepped back into, the door lets the
  // company out onto the road before it, facing the road.
  w.world.travel('cairnfield_n8', DOOR.x - 1, DOOR.y, EAST);
  const inside = w.world.move('forward');
  ok(inside.kind === 'moved' && w.world.state.mapId === 'cairns' && w.world.state.x === L1.start.x && w.world.state.y === L1.start.y && w.world.state.facing === EAST && inside.messages.includes(DOOR.label!),
    `the door takes the company in under the cairn, onto the passage facing in (${at()}: ${inside.kind === 'moved' ? inside.messages.join(' / ') : inside.kind})`);
  const off = w.world.move('forward'), back = w.world.move('back');
  const n8 = w.world.zone;
  ok(off.kind === 'moved' && back.kind === 'moved' && n8?.id === 'cairnfield_n8' && w.world.state.x - n8.x === DOOR.x - 1 && w.world.state.y - n8.y === DOOR.y && w.world.state.facing === WEST,
    `and the door lets it back out onto the road before it, facing the road (${at()})`);
  ok([L1, L2].every((d) => (d.exits ?? []).every((e) => !e.shut && !e.needFlag)), 'nothing shuts a way in Carn Dubh: no flag, no reading');
  ok([L1, L2].every((d) => !d.encounters!.some((g) => g.monsters.includes('bog_light'))), 'no light below ground: the lights are the ring\'s');

  /** Whether a map's square is reached from another without passing its secret doors, or swimming, climbing or floating. */
  const reached = (d: MapDef, from: readonly [number, number], to: readonly [number, number]): boolean => {
    const m = new GameMap(d), seen = new Set<number>(), todo = [[from[0], from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * m.width + x;
      if (seen.has(k) || !m.inBounds(x, y) || m.at(x, y).door === 'secret' || m.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return seen.has(to[1] * m.width + to[0]);
  };

  // The cairn (18): the passage, the count cut in its wall and the bog's dead come in along it; the
  // chamber, and the cells of the dead in rows off it, a wight over each row.
  see(w, 'cairns:cd1_in');
  see(w, 'cairns:cd1_count');
  for (const g of L1.encounters!.filter((e) => e.id !== 'cd1_watcher')) fight(w, `cairns:${g.id}`);
  see(w, 'cairns:cd1_chamber');
  see(w, 'cairns:cd1_north');
  see(w, 'cairns:cd1_south');
  const rows = L1.encounters!.filter((g) => g.id.startsWith('cd1_wights'));
  ok(rows.length === 2 && rows.every((g) => g.monsters.join() === 'cairn_wight,cairn_wight,cairn_wight' && !!g.respawn) && L1.encounters!.filter((g) => g.monsters.includes('bog_body')).length === 2,
    'the bog\'s dead in the passage, twice, and three wights over the three rows of each cell, twice');

  // The Watcher's cell (#56's 37): newer than the rest, his wight over him, which never comes back,
  // and the first page of his tally under his hands, a letter read from the pack (#482 takes it in).
  fight(w, 'cairns:cd1_watcher');
  const watcher = L1.encounters!.find((g) => g.id === 'cd1_watcher')!;
  ok(watcher.monsters.join() === 'cairn_wight' && !watcher.respawn && !!watcher.slainText?.includes('the page'), 'the Watcher\'s wight, alone over him, falls and never comes back');
  see(w, 'cairns:cd1_watcher');
  const page = L1.features!.find((f) => f.kind === 'chest' && f.id === 'cd1_page'), letter = ITEMS.watchers_page;
  ok(page?.kind === 'chest' && page.items.includes('watchers_page') && letter?.slot === 'none' && !!letter.text?.length && letter.text[0].includes('tally'),
    'under his hands, the first page of his tally, a letter read from the pack');
  ok(reached(L1, [L1.start.x, L1.start.y], [14, 3]) && reached(L1, [L1.start.x, L1.start.y], [14, 8]),
    'the cairn is walked from its door to the Watcher\'s cell and to the stair with nothing searched for');

  // Under the cairn (19): the stair down through the bedrock to where the tool marks stop, and the hall
  // opening at its head, its walls smooth and one face with no join.
  walkThrough(w, 'cairns', 13, 8, EAST, 'cairns2', 1);
  w.level = 19;
  ok(w.world.state.x === L2.start.x && w.world.state.y === L2.start.y && w.world.state.facing === NORTH, `the stair comes down through the bedrock to the hall under the cairn (${at()})`);
  const hall = new GameMap(L2);
  ok(hall.palette.wallStyle === 'smooth' && L2.bare === true && L1.bare === true, 'the hall\'s walls are smooth, and nothing hangs on any wall in Carn Dubh');
  see(w, 'cairns2:cd2_stair');
  see(w, 'cairns2:cd2_smooth');
  const court = L2.encounters!.filter((g) => g.id.startsWith('cd2_wights'));
  ok(court.length === 2 && court.every((g) => g.monsters.length === 4 && g.monsters.every((m) => m === 'cairn_wight') && !!g.respawn), 'wights over the rows on either side of the hall, four to a side');
  for (const g of court) fight(w, `cairns2:${g.id}`);

  // The King on its seat, alone, won at the hall's floor: it never comes back, and the door behind it
  // stays shut.
  see(w, 'cairns2:cd2_seat');
  fight(w, 'cairns2:cd2_king');
  const king = L2.encounters!.find((g) => g.id === 'cd2_king')!;
  ok(king.monsters.join() === 'cairn_king' && !king.respawn && !!king.slainText?.includes('the door stays shut') && MONSTERS.find((m) => m.id === 'cairn_king')?.inflict?.cond === 'cursed',
    'the Cairn King, alone on its seat and cursing, falls and never comes back, and the door behind it stays shut');

  // The door behind the seat: a wall with a door in it and nothing to open it by, and beside it, at a
  // girl's shoulder, nothing. No flag, no lock, no exit.
  see(w, 'cairns2:cd2_door');
  const door = L2.features!.find((f) => f.kind === 'event' && f.id === 'cd2_door');
  ok(door?.kind === 'event' && door.text.includes('nothing to open it by') && door.text.endsWith('at a girl\'s shoulder, nothing.'), 'behind the seat a door in the smooth wall, and beside it, at a girl\'s shoulder, nothing');
  w.world.travel('cairns2', 7, 2, NORTH);
  const shut = w.world.move('forward');
  ok(shut.kind === 'blocked' && w.world.state.y === 2 && hall.at(7, 1).door === 'door' && hall.at(7, 1).solid === 'wall' && !hall.exitAt(7, 1) && !LOCKS.some((l) => l.map.startsWith('cairns')),
    `the door does not open, the King dead or alive: it is a wall with a door in it, and no lock (${shut.kind === 'blocked' ? shut.reason : shut.kind})`);

  // The secret: the rows down the hall lie heads to the wall and feet to the stair; searched beside
  // the stair's head, the wall gives on a cell whose dead lie the other way about, with the richest
  // grave-gold and the Hill Torc. Walked, it is never reached but through that wall.
  ok(!reached(L2, [L2.start.x, L2.start.y], [3, 11]) && reached(L2, [L2.start.x, L2.start.y], [7, 2]), 'the cell off the stair is reached only through its wall, and the stair joins the hall to the seat');
  see(w, 'cairns2:cd2_rows');
  const rowsHint = L2.features!.find((f) => f.kind === 'event' && f.id === 'cd2_rows');
  ok(rowsHint?.kind === 'event' && rowsHint.text.includes('heads to the wall and feet to the stair'), 'at the stair\'s head, the dead in rows down the hall, heads to the wall and feet to the stair');
  w.world.travel('cairns2', 7, 10, WEST);
  let wall = false;
  for (let i = 0; i < 20 && !wall; i++) wall = w.world.search();
  const into = wall ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(wall && into.every((r) => r.kind === 'moved') && w.world.used('cd2_cell'), 'searched beside the stair\'s head, the wall gives on a cell of the dead');
  const cell = L2.features!.find((f) => f.kind === 'event' && f.id === 'cd2_cell'), hoard = L2.features!.find((f) => f.kind === 'chest' && f.id === 'cd2_cell_chest');
  ok(cell?.kind === 'event' && cell.text.includes('heads to the stair') && hoard?.kind === 'chest' && hoard.items.includes('hill_torc') && hoard.gold === 900 && ITEMS.hill_torc?.slot === 'none',
    'its dead lie the other way about, heads to the stair, and with them the richest grave-gold, 900, and the Hill Torc');
  listen(w);
}
