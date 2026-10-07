// Cairnmoor's walkthrough. Its chapter, The Ring, is #481's, which plays it here; until then, the
// road up onto the moor (N7, #476) walked: the drove road on out of the Kilns' N6 over the border,
// the crossing line said in snow to a company two under the moor's floor and its name alone to one
// at it; the road square to square over the hills and out south for N8, and the peat-cutter's track
// out east onto O7; the milestone where the hills give out, counted
// along the roads, and the coach that goes by it by day; the drover at the shelter; the box's groups
// won at its floor, the hounds by night; and the drovers' cache under the first cairn, found from
// what the ravens leave on it.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { worldGrid } from '../../../game/atlas.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { GameMap } from '../../../game/map.ts';
import { xpForLevel, createCharacter, className, prestigeOf, takePrestige, PRESTIGES } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { questLog } from '../../../game/quests.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { GATE } from '../kilns/maps/ironfells_n3.ts';

const N7 = MAP_DEFS.find((d) => d.id === 'highmoor_n7')!;
const DROVER = N7.features!.find((f) => f.kind === 'npc' && f.name === 'A drover') as Person;
const MOOR = ATLAS.zones.find((z) => z.id === 'highmoor')!;
const O7 = MAP_DEFS.find((d) => d.id === 'highmoor_o7')!;
const WATCHER = O7.features!.find((f) => f.kind === 'npc' && f.name === 'The Watcher') as Person;
const PIPER = O7.features!.find((f) => f.kind === 'npc' && f.name === 'The piper') as Person;

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
  ok(out.at(n7.x + 31, n7.y + 22).ch === ':' && out.at(n7.x + 7, n7.y + 20).ch === ':' && out.zoneAt(n7.x + 32, n7.y + 22)?.id === 'highmoor_o7' && out.at(n7.x + 32, n7.y + 22).ch === ':', 'the peat-cutter\'s track leaves the road at the fork and N7 by its east edge onto O7\'s 0,22');

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

  stoneRing(ok);
};

/**
 * Fionnlios's box (O7, #477): the peat-cutter's track on from N7 to the ring's west gap; the ring,
 * twelve stones standing and one fallen, the camp at its heart, no snow inside and no group, and the
 * voice there by night, once, and never by day; the Watcher at his hut and the piper at his fire,
 * each teaching a second prestige (#19), off the road and away from every group; the box's groups
 * won at its floor, the lights and the troll by night, the troll's tor a face by day; and the hollow
 * under the fallen stone, found from the bare ground beside it.
 */
function stoneRing(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok);
  w.level = 18;
  for (const m of w.party.members) { m.level = 18; m.xp = xpForLevel(18); }
  const out = buildMaps()[OUTDOORS], o7 = out.zones.find((z) => z.id === 'highmoor_o7')!;
  const onO7 = (x: number, y: number): boolean => x >= o7.x && x < o7.x + o7.w && y >= o7.y && y < o7.y + o7.h;
  const day = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY;
  const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // The track off N7's east edge onto O7's 0,22, and on square to square into the ring's west gap.
  w.world.state.minutes = day + 12 * 60;
  w.world.travel('highmoor_n7', 31, 22, EAST);
  const step = w.world.move('forward');
  ok(step.kind === 'moved' && w.world.zone?.id === 'highmoor_o7' && w.world.state.x === o7.x && w.world.state.y === o7.y + 22, 'the peat-cutter\'s track crosses from N7\'s 31,22 onto O7\'s 0,22');
  const track = new Set([`${o7.x},${o7.y + 22}`]), q = [[o7.x, o7.y + 22]];
  for (let i = 0; i < q.length; i++) for (const [dx, dy] of steps) {
    const [x, y] = [q[i][0] + dx, q[i][1] + dy];
    if (onO7(x, y) && out.at(x, y).ch === ':' && !track.has(`${x},${y}`)) { track.add(`${x},${y}`); q.push([x, y]); }
  }
  ok(track.has(`${o7.x + 3},${o7.y + 24}`), 'the track runs square to square from 0,22 into the ring\'s west gap at 3,24');

  // Fionnlios: twelve stones standing round the camp and one fallen, no snow inside and no group.
  const ring = O7.features!.find((f) => f.kind === 'camp' && f.name === 'Fionnlios')!;
  const d2 = (x: number, y: number): number => (x - ring.x) ** 2 + (y - ring.y) ** 2;
  let standing = 0, snow = 0;
  O7.rows.forEach((row, y) => [...row].forEach((ch, x) => { if (d2(x, y) >= 8 && d2(x, y) <= 10 && ch === 'r') standing++; if (d2(x, y) < 8 && ch === '*') snow++; }));
  ok(standing === 12 && O7.rows[ring.y][ring.x + 3] === 'S' && !snow && O7.encounters!.every((g) => d2(g.x, g.y) > 10),
    `Fionnlios: twelve stones standing round its camp and the thirteenth fallen, no snow on the ground inside and no group in it (${standing} standing)`);

  // The voice: by day the ring is silent; by night it speaks, the once.
  w.world.travel('highmoor_o7', ring.x, ring.y);
  const noon = w.world.eventsHere();
  w.world.state.minutes = day + 23 * 60;
  w.world.travel('highmoor_o7', ring.x, ring.y);
  const dark = w.world.eventsHere();
  w.world.travel('highmoor_o7', ring.x, ring.y);
  const again = w.world.eventsHere();
  const voice = (said: string[]): boolean => said.some((m) => m.includes('"Crew. Report."'));
  ok(!voice(noon) && voice(dark) && w.world.used('o7_voice') && !voice(again), 'by day the ring is silent; by night a voice in it says "Crew. Report.", the once');
  listen(w);

  // The two seconds (#19): the Watcher's, the Sorcerer's, at his hut, and the piper's, the Bard's, at
  // his fire by the tarn. Each is there from a new game, off every road and group, reached on foot
  // from the way in; his own words come first, then his lesson, once, to the first prestige at 19;
  // and at 19 the member is sent to High Moor and taught. A sorcerer or a bard stands in for the
  // premade company's first member.
  const taught = O7.features!.flatMap((f) => (f.kind === 'npc' && f.teaches ? [`${f.teaches.cls}:${f.teaches.prestige}`] : []));
  ok(taught.join() === 'sorcerer:2,bard:2', `the Watcher teaches the Sorcerer's second and the piper the Bard's (${taught.join(', ')})`);
  const map = new GameMap(O7), reached = new Set([`${O7.start.x},${O7.start.y}`]), todo = [[O7.start.x, O7.start.y]];
  for (let i = 0; i < todo.length; i++) for (const [dx, dy] of steps) {
    const [x, y] = [todo[i][0] + dx, todo[i][1] + dy];
    if (map.inBounds(x, y) && !reached.has(`${x},${y}`) && map.at(x, y).door !== 'secret' && map.passable(x, y) === 'ok') { reached.add(`${x},${y}`); todo.push([x, y]); }
  }
  for (const [who, cls, place] of [[WATCHER, 'sorcerer', 'hut'], [PIPER, 'bard', 'tarn']] as const) {
    const [first, second] = PRESTIGES[cls].titles, [px, py] = [o7.x + who.x, o7.y + who.y];
    const an = (t: string): string => `${/^[AEIOU]/.test(t) ? 'an' : 'a'} ${t}`;
    const near = (x: number, y: number): boolean => Math.abs(x - px) + Math.abs(y - py) <= 10;
    let road = 0;
    for (let y = py - 10; y <= py + 10; y++) for (let x = px - 10; x <= px + 10; x++) if (near(x, y) && out.inBounds(x, y) && out.at(x, y).ch === '=') road++;
    ok(!road && out.encounters.every((g) => !near(g.x, g.y)) && reached.has(`${who.x},${who.y}`), `${who.name} is more than ten squares off any road and from any group, and reached on foot from the way in by no secret door`);
    ok(!!who.teaches?.seek?.includes(who.name) && who.teaches.seek.includes('High Moor') && who.teaches.seek.includes(place) && who.teaches.seek.includes(second), `${who.name}'s seeking names him, his ${place} on High Moor and the title he gives`);
    const at = (level: number): Walk => {
      const v = newWalk(ok);
      v.party.members[0] = createCharacter('Ailsa', 'human', cls, cls === 'sorcerer' ? { intellect: 15, endurance: 12, speed: 12 } : { personality: 15, might: 12, speed: 12 }, makeRng(19));
      for (const c of v.party.members) { c.xp = xpForLevel(level); c.level = level; }
      return v;
    };
    const talk = (v: Walk): string => { v.world.travel('highmoor_o7', who.x, who.y); return meet(who, v.party, heard(v.world, who)).text; };
    const fresh = at(18);
    fresh.world.travel('highmoor_o7', who.x, who.y);
    ok(fresh.world.present(who), `${who.name} is there from a new game`);
    const v = at(19), member = v.party.members[0], words = who.lines[1], lesson = who.says![0].lines[1];
    takePrestige(member);
    const said = [talk(v), talk(v), talk(v)];
    ok(said[0].includes(words) && !said[0].includes(lesson) && said[1].includes(lesson) && said[2].includes(words) && !said[2].includes(lesson), `${who.name}'s own words come first, then his lesson to ${an(first)} of 19, once`);
    const young = at(18);
    ok(![talk(young), talk(young)].some((t) => t.includes(lesson)), `to a company of 18 ${who.name} says no lesson`);
    ok(sought(questLog(v.world.state, v.party)).find((p) => p.at === 'highmoor_o7')?.who.includes(member.name) === true, `at 19 the ${cls} is sent to High Moor`);
    v.party.gold = 4000;
    ok(teach(who.teaches!, v.party, v.world.state, 0).taught && prestigeOf(member) === 2 && className(member) === second && v.party.gold === 0
      && questLog(v.world.state, v.party).find((x) => x.def.id === seekId(0, 2))?.done === true, `${who.name} makes ${an(second)} of ${an(first)} for 4,000 gold, and the seeking is done`);
  }

  // The box's groups, each won at its floor: the ravens on the cairn, the lights round the ring by
  // night with a hound at their front, the bog bodies at the tarn's head, and the troll on the first
  // tor by night, alone, where by day the tor has a face.
  for (const g of O7.encounters!) fight(w, `highmoor_o7:${g.id}`);
  const lights = O7.encounters!.find((g) => g.id === 'o7_lights'), troll = O7.encounters!.find((g) => g.id === 'o7_troll');
  const face = O7.features!.find((f) => f.kind === 'event' && f.id === 'o7_face');
  ok(lights?.monsters[0] === 'moor_hound' && lights.monsters.filter((m) => m === 'bog_light').length === 4 && JSON.stringify(lights.when) === JSON.stringify({ hours: 'night' }), 'by night four bog lights go round the ring, a moor hound at their front');
  ok(troll?.monsters.join() === 'tor_troll' && JSON.stringify(troll.when) === JSON.stringify({ hours: 'night' }) && face?.kind === 'event' && face.x === troll.x && face.y === troll.y && JSON.stringify(face.when) === JSON.stringify({ hours: 'day' }),
    'by night a tor troll alone on the first tor, and by day, there, a tor with a face');

  // The secret: the bare ground by the fallen stone, the search there and the hollow under it.
  // Walked, waded, climbed or floated, it is never reached but through the stone.
  const shut = new Set<number>(), todo2 = [[o7.x + 8, o7.y + 24]];
  while (todo2.length) {
    const [x, y] = todo2.pop()!, k = y * out.width + x;
    if (shut.has(k) || (x === o7.x + 9 && y === o7.y + 24) || !onO7(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    shut.add(k);
    for (const [dx, dy] of steps) todo2.push([x + dx, y + dy]);
  }
  ok(shut.size > 900 && !shut.has((o7.y + 24) * out.width + o7.x + 10), `the hollow is shut but for the fallen stone: none of O7's ${shut.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'highmoor_o7:o7_bare');
  w.world.travel('highmoor_o7', 8, 24, EAST);
  let lifts = false;
  for (let i = 0; i < 20 && !lifts; i++) lifts = w.world.search();
  const under = lifts ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(lifts && under.every((r) => r.kind === 'moved') && w.world.used('o7_hollow'), 'searched by the fallen stone, it lifts, and the hollow under it can be walked into');
  listen(w);
  const cache = O7.features!.find((f) => f.kind === 'chest' && f.id === 'o7_cache');
  ok(cache?.kind === 'chest' && cache.items.includes('banded_staff+1') && cache.x === 10 && cache.y === 24, 'in the hollow, the first Watchers\' tallies and a Banded Staff +1');
}
