// Cairnmoor's walkthrough. First the road up onto the moor (N7, #476) and the Cairnfield (N8, #479)
// walked: the drove road on out of the
// Kilns' N6 over the border, the crossing line said in snow to a company two under the moor's floor
// and its name alone to one at it; the road square to square over the hills and on south into N8, and
// the peat-cutter's track out east onto O7; the milestone where the hills
// give out, counted along the roads, and the coach that goes by it by day; the drover at the shelter;
// the box's groups won at its floor, the hounds by night; and the drovers' cache under the first cairn,
// found from what the ravens leave on it. Then over the seam into the Cairnfield, named; its road
// square to square to its head and the notch, taken down onto M9 once that is built (NOTCH); Carn
// Dubh's door (DOOR) and the Cairns through it (#480): the cairn's passage, its cells of the dead in
// rows and the Watcher's cell with the first page of his tally, the stair down to the smooth hall under
// the cairn, the King on its seat and the door behind it, which nothing opens, and the cell off the
// stair found from the rows, and (#862) the cell south of the end cell, found from a stain of rust,
// with the area's first locked chest, refused to a company with neither a Lockpick standing nor an iron
// key; the milestone at the head; the hermit, who knows the oldest cairn; the
// box's groups won at its floor, the wights cursing; the coach's strongbox, found from the coach's
// open door; and the beacon cairn at the marsh's edge (#862), with a hammer under it whose blows carry
// fire. Last, Fionnlios's box (O7, #477) in a walk of its own: the track on to the ring, the voice
// there by night, the Watcher and the piper, the groups and the hollow (stoneRing); then the bog (O8,
// #478), off the road, in another (theBog), and the country behind, M7 and M8 (#484), in a third
// (theGrazing). Then its chapter, The Ring (#481), played at 18, 19 and 20
// in order and with the road's head taken first, resting inside the ring by night (theRing); and its
// side quests (#482): the Watcher's tally, the ring on the bog body and the faces on the tors, each
// answered every way (sideQuests). The last walk holds the two finds to their rules (offTheLadder, #862).
// Then the bounds (#834), the rim behind O7 and O8, in a walk of their own (theBounds).
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, kneel, listen, meetWho, playChapter, everyGoalWalked, goalFromBegun, quest, type Walk, type Step } from '../../../../tools/walk.ts';
import { NORTH, SOUTH, EAST, WEST } from '../../../game/types.ts';
import { ATLAS, ITEMS, MAP_DEFS, MONSTERS as EVERY_MONSTER } from '../../index.ts';
import { HARDER_IN, WARNING_IN } from '../../../game/world.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { worldGrid } from '../../../game/atlas.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GameMap } from '../../../game/map.ts';
import type { Can, Feature, MapDef, MapZone } from '../../../game/map.ts';
import { LOCKS } from '../../locks.ts';
import { xpForLevel, createCharacter, defaultParty, equip, statOf, className, prestigeOf, takePrestige, PRESTIGES } from '../../../game/party.ts';
import { hits, sellPrice, ELEMENT_DIE } from '../../../game/items.ts';
import { openCairn, answerRiddle } from '../../../game/wilds.ts';
import { startCombat, currentTurn, partyAct, monsterAct } from '../../../game/combat.ts';
import { elementMult } from '../../../game/monsters.ts';
import { CURVE } from '../../progression.ts';
import { GEAR, outfit } from '../../../../tools/harness.ts';
import { headlessGame } from '../../../../tools/tests/lib.ts';
import { teach } from '../../../game/prestige.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { questLog } from '../../../game/quests.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { GATE } from '../kilns/maps/ironfells_n3.ts';
import { DOOR, NOTCH } from './maps/cairnfield_n8.ts';
import { CHAPTER } from './chapter.ts';
import { MONSTERS } from './monsters.ts';
import { GUILD_QUESTS, QUESTS } from '../../index.ts';
import { rankFlag, takenFlag, doneFlag } from '../../guilds.ts';
import { take, rankOf } from '../../../game/guilds.ts';
import type { Party } from '../../../game/party.ts';
import { FOURTH_RANKS_OPEN } from '../kilns/guilds.ts';

/**
 * The Lanterns' fourth rank's ask on High Moor (DESIGN §8, #439), on a copy of the walk's company made
 * a Reader who has copied the Tiefzeche's words, Act II done: the ring heard, the ask is paid at the
 * taking, with the words for a company that came early, and the company is a Luminary.
 */
function luminary(w: Walk): void {
  const p: Party = structuredClone(w.party);
  p.flags[rankFlag('lanterns')] = 3; p.flags[FOURTH_RANKS_OPEN] = 1;
  p.flags[takenFlag('lanterns_niche')] = p.flags[doneFlag('lanterns_niche')] = 1;
  const q = GUILD_QUESTS.find((g) => g.id === 'lanterns_ring')!;
  const said = take(q, w.world.state, p);
  w.ok(said.length === 2 && said[0].startsWith(q.early![0]) && said[1] === 'Your rank with the Lanterns is now Luminary.' && rankOf('lanterns', p) === 4,
    `the ring heard, the Lanterns' ask is paid at the taking, and a company that copied the Tiefzeche's words is made a Luminary (${said.join(' ').replace(/\n+/g, ' ')})`);
}

const N7 = MAP_DEFS.find((d) => d.id === 'highmoor_n7')!, N8 = MAP_DEFS.find((d) => d.id === 'cairnfield_n8')!;
const DROVER = N7.features!.find((f) => f.kind === 'npc' && f.name === 'A drover') as Person;
const HERMIT = N8.features!.find((f) => f.kind === 'npc' && f.name === 'A hermit') as Person;
const MOOR = ATLAS.zones.find((z) => z.id === 'highmoor')!;
const O7 = MAP_DEFS.find((d) => d.id === 'highmoor_o7')!;
const WATCHER = O7.features!.find((f) => f.kind === 'npc' && f.name === 'The Watcher') as Person;
const PIPER = O7.features!.find((f) => f.kind === 'npc' && f.name === 'The piper') as Person;

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
  // east onto O7, walked last (stoneRing).
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
  ok(out.at(n7.x + 31, n7.y + 22).ch === ':' && out.at(n7.x + 7, n7.y + 20).ch === ':' && out.zoneAt(n7.x + 32, n7.y + 22)?.id === 'highmoor_o7' && out.at(n7.x + 32, n7.y + 22).ch === ':', 'the peat-cutter\'s track leaves the road at the fork and N7 by its east edge onto O7\'s 0,22');

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
  ok(coach?.kind === 'event' && coach.x === stone.x && coach.y === stone.y && JSON.stringify(coach.when) === JSON.stringify({ hours: 'day' }) && ![N7, N8, O7].some((d) => d.features!.some((f) => f.kind === 'npc' && f.passage)),
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
  // taken down onto M9's road (NOTCH, the atlas's way); past it, M8's crags at the Rimefells' shoulder (#484).
  ok(reach(n8.x + 7, n8.y, (x, y) => road(x, y) && onN8(x, y)).has((n8.y + 28) * out.width + n8.x + 1), 'the drove road runs square to square over N8 from 7,0 down its west side to its head at 1,28');
  const down = ATLAS.links.find((l) => l.from === 'cairnfield' && l.to === 'longmere');
  ok(NOTCH.x === 0 && NOTCH.y === 28 && NOTCH.to === 'longmere_m9' && !!N8.exits?.includes(NOTCH) && out.passable(n8.x + NOTCH.x, n8.y + NOTCH.y) === 'ok' && out.passable(n8.x + NOTCH.x - 1, n8.y + NOTCH.y) !== 'ok'
    && down?.a?.[0] === n8.x + NOTCH.x && down.a[1] === n8.y + NOTCH.y && down.b?.[0] === 392 + NOTCH.tx && down.b[1] === 254 + NOTCH.ty,
  'the road ends at the notch, 0,28, the atlas\'s way down to M9\'s road at 22,8 written beside the map (NOTCH), and past it M8\'s crags');

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

  // The beacon cairn (#862): at the field's end where the marsh begins, off the road and off every
  // quest's way, its top stones scorched; under them a hammer whose blows carry fire, and no gold. The
  // drove road, built or the atlas's, is more than ten squares from it, and no site of the world map is.
  const beacon = N8.features!.find((f) => f.kind === 'cairn' && f.id === 'n8_beacon');
  const nearRoad = (x: number, y: number, r: number): boolean => {
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (Math.abs(dx) + Math.abs(dy) <= r && drove(x + dx, y + dy)) return true;
    return false;
  };
  const [bx, by] = beacon?.kind === 'cairn' ? [n8.x + beacon.x, n8.y + beacon.y] : [0, 0];
  ok(beacon?.kind === 'cairn' && beacon.items.join() === 'beacon_hammer' && beacon.gold === 0 && onN8(bx, by) && out.passable(bx, by) === 'ok'
    && !nearRoad(bx, by, 10) && nearRoad(bx, by, 30) && ATLAS.sites.every((s) => Math.abs(s.at[0] - bx) + Math.abs(s.at[1] - by) > 10),
  'the beacon cairn at 28,20 holds a hammer and no gold, on open ground more than ten squares from the drove road and from every site of the world map');
  w.world.travel('cairnfield_n8', 28, 20, EAST);
  const stones = beacon?.kind === 'cairn' ? openCairn(w.world, w.party, beacon) : [];
  const again = beacon?.kind === 'cairn' ? openCairn(w.world, w.party, beacon) : [];
  ok(stones.length === 2 && stones[1] === 'Under the stones: Beacon Hammer.' && again.join() === 'The cairn has been emptied.' && w.party.bag.filter((i) => i === 'beacon_hammer').length === 1 && w.world.used('n8_beacon'),
    `lifted at the marsh's edge, the cairn gives the Beacon Hammer the once (${stones.join(' / ')})`);
  ok(w.party.bag.includes('beacon_hammer') && w.party.bag.includes('cairnbuilders_mail'), 'both finds are in the walk\'s bag: the hammer from the cairn and the mail from the locked chest');
  listen(w);

  // Fionnlios's box (O7, #477), in a walk of its own.
  stoneRing(ok);
  // The bog (O8, #478), off the road, in a walk of its own.
  theBog(ok);
  // The country behind (M7 and M8, #484), off the road, in a walk of its own.
  theGrazing(ok);
  // The chapter (#481) and the side quests (#482), each in walks of their own.
  theRing(ok);
  sideQuests(ok);
  // The two finds, held to their rules (#862).
  offTheLadder(ok);
  // The bounds (#834): the rim, off the road, in a walk of its own.
  theBounds(ok);
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

  // The secret of the end cell (#862): a stain of rust runs down its south wall from one joint; searched
  // there, the wall gives on a cell cut in the rock, narrow as a grave, with the area's first locked chest
  // in it. Walked, the cell is never reached but through that wall, and nothing the road or a quest turns
  // on lies in it. The chest opens to a Lockpick standing or a set of picks carried, which keep the key, or
  // to an iron key, which it spends, and to nothing else: the company the test leaves with none of them is
  // refused. The premade six's thief is born to Lockpick, so the "neither", "key" and "picks" companies have
  // her put down, and the "pick" one has her standing.
  const start: [number, number] = [L1.start.x, L1.start.y];
  ok(!reached(L1, start, [13, 11]) && !reached(L1, start, [13, 12]), 'the cell south of the end cell is reached only through its wall: the Watcher\'s cell and the stair are walked, and it is not');
  see(w, 'cairns:cd1_rust');
  w.world.travel('cairns', 13, 9, SOUTH);
  let joint = false;
  for (let i = 0; i < 20 && !joint; i++) joint = w.world.search();
  const cut = joint ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(joint && cut.every((r) => r.kind === 'moved') && w.world.state.x === 13 && w.world.state.y === 11 && w.world.used('cd1_cell'), `searched at the stain, the wall gives on a cell cut in the rock (${at()})`);
  const kist = L1.features!.find((f) => f.kind === 'chest' && f.id === 'cd1_kist');
  ok(kist?.kind === 'chest' && kist.locked === true && kist.x === 13 && kist.y === 12 && kist.gold === 0 && kist.items.join() === 'cairnbuilders_mail',
    'in the cell, a locked chest at 13,12 holding Cairnbuilder\'s Mail and no gold, no key and no quest\'s item');
  /** The chest as the game opens it (a stand on it, then Space), for the company `setup` leaves: what the log says, whether it is spent, the mail taken and the keys left. */
  const opens = (setup: (p: Party) => void): { said: string; spent: boolean; mail: boolean; keys: number } => {
    const g = headlessGame(4), p = g.party;
    setup(p);
    g.world.travel('cairns', 13, 12, SOUTH);
    const here = g.world.featureHere()!, from = g.log.length;
    g.enterCell();
    g.interact(here);
    return { said: g.log.slice(from).join(' '), spent: g.world.used('cd1_kist'), mail: p.bag.includes('cairnbuilders_mail'), keys: p.bag.filter((i) => i === 'key_iron').length };
  };
  const thiefDown = (p: Party): void => { p.members.find((m) => m.cls === 'thief')!.conditions.push('dead'); };
  const neither = opens(thiefDown), keyed = opens((p) => { thiefDown(p); p.bag.push('key_iron'); }), picked = opens(() => undefined);
  const carried = opens((p) => { thiefDown(p); p.members.find((m) => m.cls === 'cleric')!.pack.push('set_of_picks'); });
  ok(neither.said === 'A locked chest. Locked.' && !neither.spent && !neither.mail && neither.keys === 0,
    `a company with neither a Lockpick standing nor an iron key is refused, and the chest stays shut ("${neither.said}")`);
  ok(keyed.said === 'A locked chest. The lock turns. The key crumbles. You open the chest: Cairnbuilder\'s Mail.' && keyed.spent && keyed.mail && keyed.keys === 0,
    `with her down and an iron key carried, the key is spent and the chest gives the mail ("${keyed.said}")`);
  ok(picked.said === 'A locked chest. Ottilie picks the lock. You open the chest: Cairnbuilder\'s Mail.' && picked.spent && picked.mail,
    `with the premade six's thief standing, born to Lockpick, she picks it and no key is needed ("${picked.said}")`);
  ok(carried.said === 'A locked chest. Maren picks the lock. You open the chest: Cairnbuilder\'s Mail.' && carried.spent && carried.mail && carried.keys === 0,
    `with her down and Pender's set of picks in the cleric's pack, the cleric picks it ("${carried.said}")`);
  // The walk's own company, the thief standing: the lock is picked and the mail is in the bag.
  w.world.travel('cairns', 13, 12, SOUTH);
  const lock = w.world.unlock();
  if (lock && kist?.kind === 'chest') { w.world.markUsed(kist.id); w.party.bag.push(...kist.items); }
  ok(lock === 'Ottilie picks the lock.' && w.party.bag.includes('cairnbuilders_mail') && w.world.used('cd1_kist'), 'the walk\'s company, its thief standing, picks the lock and has the mail in the bag');
  listen(w);

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

/**
 * The bog (O8, #478), off the road: over the seams from N8's heather (High Moor named) and from O7's foot, the tarn's
 * stream clipping the corner; the peat-cutter at his hut, who dug up the body laid out beside it, and
 * the stonecutter at his fire under the tors, who cuts their faces (#56's 38 and 39, #482); a tor's
 * face seen by day and not by night; the box's groups won at its floor, every one by night: the bog
 * bodies up out of the body's cutting, two flights of lights, the hounds, and on the tors two trolls
 * and the ravens, mended each round unless burned (#537); and the hoard in the cutting the peat-cutter
 * stopped at, found from its black peat, the lights rising out of it by night.
 */
function theBog(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok);
  w.level = 18;
  for (const m of w.party.members) m.level = 18;
  const O8 = MAP_DEFS.find((d) => d.id === 'highmoor_o8')!;
  const out = buildMaps()[OUTDOORS], o8 = out.zones.find((z) => z.id === 'highmoor_o8')!, n8 = out.zones.find((z) => z.id === 'cairnfield_n8')!;
  const onO8 = (x: number, y: number): boolean => x >= o8.x && x < o8.x + o8.w && y >= o8.y && y < o8.y + o8.h;
  const day = Math.floor(w.world.state.minutes / (24 * 60)) * 24 * 60;
  const at = (hour: number, x: number, y: number): string[] => { w.world.state.minutes = day + hour * 60; w.world.travel('highmoor_o8', x, y); return w.world.eventsHere(); };
  const byNight = (when: unknown): boolean => JSON.stringify(when) === JSON.stringify({ hours: 'night' });

  // Over the seam from N8's heather at 31,10 onto O8's 0,10, where High Moor is named; the tarn's
  // stream at the corner, O8's 0,0 water as N8's 31,0 is.
  w.world.state.minutes = day + 12 * 60;
  w.world.travel('cairnfield_n8', 30, 10, EAST);
  const into: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'highmoor_o8'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') into.push(...r.messages); }
  ok(w.world.zone?.id === 'highmoor_o8' && w.world.state.x === o8.x && w.world.state.y === o8.y + 10 && into.includes('High Moor.'),
    `the heather crosses from N8's 31,10 onto O8's 0,10, and High Moor is named (${into.join(' / ')})`);
  ok(out.at(o8.x, o8.y).ch === '~' && out.at(n8.x + 31, n8.y).ch === '~', 'the tarn\'s stream clips O8\'s corner at 0,0 and runs on into N8\'s 31,0');

  // And over the north seam, O7's heather at 1,31 onto O8's 1,0: the same moor, so no name said.
  w.world.travel('highmoor_o7', 1, 30, SOUTH);
  for (let i = 0; i < 3 && w.world.zone?.id !== 'highmoor_o8'; i++) w.world.move('forward');
  ok(w.world.zone?.id === 'highmoor_o8' && w.world.state.x === o8.x + 1 && w.world.state.y === o8.y, `the heather crosses from O7's 1,31 onto O8's 1,0 (${w.world.state.x},${w.world.state.y})`);

  // The peat-cutter at his hut, the body he dug up laid out beside it and the cutting it lies down in
  // again, where by night the bog bodies are up; and the stonecutter at his fire under the tors.
  const person = (name: string): Person => O8.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const talk = (p: Person): string => { w.world.travel('highmoor_o8', p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  const cutter = talk(person('A peat-cutter')), mason = talk(person('A stonecutter'));
  ok(cutter.includes('rope round his neck') && cutter.includes('a ring') && cutter.includes('stopped at'), 'the peat-cutter at his hut dug the body up with a rope round its neck and a ring, and stopped at a cutting out east');
  ok(mason.includes('has a face') && mason.includes('The last is mine'), 'the stonecutter at his fire under the tors cuts the tors\' faces, and the last is his');
  const ev = (id: string) => O8.features!.find((f) => f.kind === 'event' && f.id === id)!;
  const body = ev('o8_body'), lies = ev('o8_lies'), bodies = O8.encounters!.find((g) => g.id === 'o8_bodies')!;
  ok(O8.rows[body.y][body.x + 1] === 'B' && O8.rows[lies.y][lies.x] === ':' && Math.abs(bodies.x - lies.x) + Math.abs(bodies.y - lies.y) <= 2 && byNight(bodies.when),
    'the body lies beside the peat-cutter\'s hut, and by night the bog bodies are up out of the cutting it lies down in again');

  // A tor's face: not seen by night, seen by day.
  const face = (said: string[]): boolean => said.some((m) => m.includes('a face is cut'));
  const dark = at(23, 12, 26), noon = at(12, 12, 26);
  ok(!face(dark) && face(noon), 'by night the first tor shows no face; by day a face is cut in it');

  // The box's groups, each won at its floor, every one by night: the bog bodies, two flights of
  // lights over the bog, the hounds on the hills, and on the tors two trolls and the ravens, who mend
  // each round unless burned (#537).
  for (const g of O8.encounters!) fight(w, `highmoor_o8:${g.id}`);
  const trolls = O8.encounters!.find((g) => g.id === 'o8_trolls'), last = O8.encounters!.find((g) => g.id === 'o8_last_tor');
  ok(O8.encounters!.every((g) => byNight(g.when)) && O8.encounters!.filter((g) => g.monsters.every((m) => m === 'bog_light')).length === 2
    && O8.encounters!.flatMap((g) => g.monsters).filter((m) => m === 'tor_troll').length === 2 && !!trolls?.monsters.includes('tor_troll') && trolls.monsters.includes('raven')
    && last?.monsters.join() === 'tor_troll' && !!MONSTERS.find((m) => m.id === 'tor_troll')?.regen,
  'by night two flights of lights over the bog, and on the tors two trolls, one with the ravens and one alone at the last tor, mending unless burned');

  // The secret: the cutting the peat-cutter stopped at, its peat black, and by night the lights rising
  // out of it; the search there and the hoard behind its face. Walked, waded, climbed or floated, it is
  // never reached but through the face.
  const rising = (said: string[]): boolean => said.some((m) => m.includes('a light comes up'));
  const still = at(12, 16, 12), lit = at(23, 16, 12);
  ok(!rising(still) && rising(lit) && w.world.used('o8_rising'), 'by day the cutting is still; by night the lights rise out of it and drift north to the ring');
  const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]], shut = new Set<number>(), todo = [[o8.x + 17, o8.y + 12]];
  while (todo.length) {
    const [x, y] = todo.pop()!, k = y * out.width + x;
    if (shut.has(k) || (x === o8.x + 18 && y === o8.y + 12) || !onO8(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    shut.add(k);
    for (const [dx, dy] of steps) todo.push([x + dx, y + dy]);
  }
  ok(shut.size > 900 && [19, 20].every((x) => !shut.has((o8.y + 12) * out.width + o8.x + x)), `the hoard is shut but for the cutting's face: none of O8's ${shut.size} squares walked, waded, climbed or floated reaches it`);
  w.world.state.minutes = day + 12 * 60;
  see(w, 'highmoor_o8:o8_cutting');
  w.world.travel('highmoor_o8', 17, 12, EAST);
  let gives = false;
  for (let i = 0; i < 20 && !gives; i++) gives = w.world.search();
  const dug = gives ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(gives && dug.every((r) => r.kind === 'moved') && w.world.used('o8_gold'), 'searched at the black cutting, its face gives, and the hoard behind it can be reached');
  listen(w);
  const hoard = O8.features!.find((f) => f.kind === 'chest' && f.id === 'o8_hoard');
  ok(hoard?.kind === 'chest' && hoard.items.includes('seax+1') && hoard.gold === 1140 && hoard.x === 20 && hoard.y === 12, 'in the cutting, the hill folk\'s grave-gold and a second Seax +1');
}

/**
 * The country behind (M7 and M8, #484), off the road: over the seams from N7's heather onto M7's and
 * from M6's grass over the Kilns' farms, the Cairnfield named; from M7 onto M8 and from N8's heather
 * onto M8's, the same field, nothing said; and from M8's grass down onto M9's corner, Loch Fada named;
 * the shepherd at the shielings, who knows where the fold's stones came from, and the old man fishing
 * the tarn, who knows the lone tor's troll; the tor's face seen by day and not by night; the boxes'
 * groups won at their floor, the hounds and the troll by night, mending unless burned (#537); and the
 * two secrets, each shut but through its door: the cist behind the fold's back wall, found from the
 * cup and rings on its stone, and the howff under the boulder by the tarn, found from its smoke.
 */
function theGrazing(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok);
  w.level = 18;
  for (const m of w.party.members) m.level = 18;
  const M7 = MAP_DEFS.find((d) => d.id === 'cairnfield_m7')!, M8 = MAP_DEFS.find((d) => d.id === 'cairnfield_m8')!;
  const out = buildMaps()[OUTDOORS], zone = (id: string): MapZone => out.zones.find((z) => z.id === id)!;
  const m7 = zone('cairnfield_m7'), m8 = zone('cairnfield_m8'), m9 = zone('longmere_m9');
  const day = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY;
  const at = (map: string, hour: number, x: number, y: number): string[] => { w.world.state.minutes = day + hour * 60; w.world.travel(map, x, y); return w.world.eventsHere(); };
  const byNight = (when: unknown): boolean => JSON.stringify(when) === JSON.stringify({ hours: 'night' });
  /** From a map's square, forward over its seam until the box is the one named: what was said. */
  const cross = (map: string, x: number, y: number, facing: typeof WEST, into: string): string[] => {
    w.world.travel(map, x, y, facing);
    const said: string[] = [];
    for (let i = 0; i < 3 && w.world.zone?.id !== into; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    return said;
  };
  const named = (said: string[], name: string): boolean => said.some((m) => m.startsWith(name));
  const there = (z: MapZone, x: number, y: number): boolean => w.world.zone?.id === z.id && w.world.state.x === z.x + x && w.world.state.y === z.y + y;

  // Over the seams, by day.
  w.world.state.minutes = day + 12 * 60;
  const fromN7 = cross('highmoor_n7', 0, 24, WEST, 'cairnfield_m7');
  ok(there(m7, 31, 24) && named(fromN7, 'The Cairnfield.'), `the heather crosses from N7's 0,24 onto M7's 31,24, and the Cairnfield is named (${fromN7.join(' / ')})`);
  const fromM6 = cross('kilnmouth_m6', 5, 31, SOUTH, 'cairnfield_m7');
  ok(there(m7, 5, 0) && named(fromM6, 'The Cairnfield.'), `the grass crosses from M6's 5,31 onto M7's 5,0, out of the Kilns' farms, and the Cairnfield is named (${fromM6.join(' / ')})`);
  const fromM7 = cross('cairnfield_m7', 15, 31, SOUTH, 'cairnfield_m8'), fromN8 = cross('cairnfield_n8', 0, 22, WEST, 'cairnfield_m8');
  ok(there(m8, 31, 22) && !named([...fromM7, ...fromN8], 'The Cairnfield.'), 'the grass crosses from M7\'s 15,31 onto M8\'s 15,0, and the heather from N8\'s 0,22 onto M8\'s 31,22: the same field, so no name said');
  const toM9 = cross('cairnfield_m8', 1, 31, SOUTH, 'longmere_m9');
  ok(there(m9, 1, 0) && named(toM9, 'Loch Fada.'), `the grass crosses from M8's 1,31 onto M9's corner at 1,0, and Loch Fada is named (${toM9.join(' / ')})`);

  // The shepherd at the shielings and the old man fishing the tarn.
  const person = (def: MapDef, name: string): Person => def.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const talk = (def: MapDef, p: Person): string => { w.world.travel(def.id, p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  const shepherd = talk(M7, person(M7, 'A shepherd')), fisher = talk(M8, person(M8, 'A fisher'));
  ok(shepherd.includes('Black dogs') && shepherd.includes('old cairn'), 'the shepherd at the shielings: black dogs off the moor by night, and the fold built of an old cairn');
  ok(fisher.includes('troll on the lone tor'), 'the old man fishing the tarn: a troll on the lone tor, as when his father was a boy');

  // The lone tor's face: not seen by night, seen by day.
  const face = (said: string[]): boolean => said.some((m) => m.includes('a face, worn'));
  const dark = at('cairnfield_m8', 23, 15, 17), noon = at('cairnfield_m8', 12, 15, 17);
  ok(!face(dark) && face(noon), 'by night the lone tor shows no face; by day a face is worn in it');

  // The boxes' groups, each won at its floor: the ravens at the ewe and on the crags, and by night
  // the hounds on the grazing and the troll by its tor, alone, mending unless burned (#537).
  for (const [def, id] of [[M7, 'cairnfield_m7'], [M8, 'cairnfield_m8']] as const) for (const g of def.encounters!) fight(w, `${id}:${g.id}`);
  const hounds = M7.encounters!.find((g) => g.id === 'm7_hounds'), troll = M8.encounters!.find((g) => g.id === 'm8_troll');
  ok(byNight(hounds?.when) && byNight(troll?.when) && troll?.monsters.join() === 'tor_troll' && !!MONSTERS.find((m) => m.id === 'tor_troll')?.regen,
    'by night the hounds on the grazing, and the troll alone by its tor, mending unless burned');

  // The secrets: the cup and rings on a stone low in the fold's back wall, and the cist of the old
  // cairn behind it; the smoke on the boulder by the tarn, and the howff under it. Walked, waded,
  // climbed or floated, neither is reached but through its door.
  const secret = (def: MapDef, z: MapZone, hint: string, from: [number, number], door: [number, number], inside: string, prize: [number, number]): void => {
    const steps = [[1, 0], [-1, 0], [0, 1], [0, -1]], seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === z.x + door[0] && y === z.y + door[1]) || x < z.x || x >= z.x + z.w || y < z.y || y >= z.y + z.h || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of steps) todo.push([x + dx, y + dy]);
    }
    ok(seen.size > 700 && !seen.has((z.y + prize[1]) * out.width + z.x + prize[0]), `${def.id}: the prize is shut but through its door: none of ${seen.size} squares walked, waded, climbed or floated reaches it`);
    w.world.state.minutes = day + 12 * 60;
    see(w, `${def.id}:${hint}`);
    w.world.travel(def.id, from[0], from[1], WEST);
    let gives = false;
    for (let i = 0; i < 20 && !gives; i++) gives = w.world.search();
    const dug = gives ? [w.world.move('forward'), w.world.move('forward')] : [];
    ok(gives && dug.every((r) => r.kind === 'moved') && w.world.used(inside), `${def.id}: searched at ${hint}, the wall gives, and what is behind it can be reached`);
    listen(w);
  };
  secret(M7, m7, 'm7_cupmark', [15, 25], [14, 25], 'm7_cist', [13, 24]);
  const rings = M7.features!.find((f) => f.kind === 'chest' && f.id === 'm7_rings');
  ok(rings?.kind === 'chest' && rings.gold === 160 && !rings.items.length && rings.x === 13 && rings.y === 24, 'in the cist, the gold rings slipped from the dead man\'s fingers');
  secret(M8, m8, 'm8_smoke', [7, 27], [6, 27], 'm8_howff', [4, 27]);
  const box = M8.features!.find((f) => f.kind === 'chest' && f.id === 'm8_box');
  ok(box?.kind === 'chest' && box.items.includes('forge_shield+1') && box.gold === 60 && box.x === 4 && box.y === 27, 'in the howff, a box with a little coin and a Forge Shield +1');
}

// ---- the chapter (#481) ----

/** The clock set to an hour of the walk's day. */
const hour = (w: Walk, h: number): void => { w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + h * 60; };

/** Whether the voice is among what was said. */
const crew = (said: readonly string[]): boolean => said.some((m) => m.includes('"Crew. Report."'));

/** Into the ring by night, to its camp: the voice speaks, and the company sleeps there till morning. */
const RING: Step = { name: 'the ring by night', play: (w) => {
  hour(w, 23);
  w.world.travel('highmoor_o7', 6, 24);
  const said = w.world.eventsHere();
  w.ok(crew(said) && !!w.party.flags.q_ring_spoke, `inside Fionnlios by night the voice speaks, and the chapter's flag is set (${said.join(' / ')})`);
  luminary(w);
  w.world.sleepUntilMorning();
  listen(w);
} };

/** Down the drove road to its head above the lakes, by day. */
const HEAD: Step = { name: 'the road\'s head', play: (w) => { hour(w, 12); see(w, 'cairnfield_n8:n8_head'); } };

/** Down through the notch at the road's head onto M9's road (NOTCH). */
const NOTCHED: Step = { name: 'down the notch', play: (w) => walkThrough(w, 'cairnfield_n8', NOTCH.x + 1, NOTCH.y, WEST, NOTCH.to, 2) };

/** A step played at a level, the company levelled to it. */
const atLevel = (level: number, s: Step): Step => ({ name: `${s.name} at ${level}`, play: (w) => {
  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
  w.level = level;
  s.play(w);
} });

/** The entries written on the chapter's page. */
const written = (w: Walk): string[] => (quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries ?? []).map((e) => e.id);

/**
 * The Ring (#481), begun on the drove road up onto the moor: in order, the ring by night, the road's
 * head and the notch; and with the road's head taken first, the goal turning back to the ring. Played
 * at 18, 19 and 20, each reads the same, ends once, down the notch with the voice heard, and the voice
 * is said the once.
 */
function theRing(ok: (cond: boolean, msg: string) => void): void {
  const runs: [string, Step[]][] = [
    ['in order', [atLevel(18, RING), atLevel(19, HEAD), atLevel(20, NOTCHED)]],
    ['the road\'s head first', [atLevel(18, HEAD), atLevel(19, RING), atLevel(20, NOTCHED)]],
  ];
  const read: string[] = [];
  for (const [how, steps] of runs) {
    const w = newWalk(ok);
    for (const m of w.party.members) { m.level = 18; m.xp = xpForLevel(18); }
    walkThrough(w, 'kilnsheart_n6', 3, 29, SOUTH, 'highmoor_n7', 4);
    ok(quest(w)?.goal === CHAPTER.goals.at(-1)!.text, `${how}, on the moor the chapter begins, its goal the ring (${quest(w)?.goal})`);
    playChapter(w, CHAPTER, steps, how);
    goalFromBegun(w, how);
    const ends = w.news.filter((n) => n === `Chapter complete: ${CHAPTER.title}.`).length;
    ok(!!quest(w)?.pages.find((p) => p.def === CHAPTER)?.done && ends === 1 && w.world.zone?.id === NOTCH.to,
      `${how}, down the notch with the voice heard the chapter is done, and said so once (${ends})`);
    hour(w, 23);
    w.world.travel('highmoor_o7', 6, 24);
    ok(!crew(w.world.eventsHere()), `${how}, the ring by night again says nothing`);
    read.push(written(w).join(', '));
  }
  ok(read[0] === 'road, ring, head' && read[1] === read[0], `the chapter reads the same in order and with the road's head first (${read.join(' / ')})`);
  everyGoalWalked(ok, [CHAPTER]);
}

// ---- the side quests (#482) ----

/** A side quest's page as the log shows it now, and its goal. */
const page = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];
const goal = (w: Walk, id: string): string => page(w, id)?.goal ?? '(no goal)';

/** A person of `map`, by the start of their name. */
const person = (map: string, name: string): Person => MAP_DEFS.find((d) => d.id === map)!.features!.find((f) => f.kind === 'npc' && f.name.startsWith(name)) as Person;

/** What a person says at the next meeting, as the game would have it. */
function hear(w: Walk, map: string, p: Person): string {
  w.world.travel(map, p.x, p.y);
  const said = meet(p, w.party, heard(w.world, p)).text;
  listen(w);
  return said;
}

/** Meet a person and answer the question they put with the answer setting `sets`: what it says. */
function answerTo(w: Walk, map: string, p: Person, sets: string): string {
  w.world.travel(map, p.x, p.y);
  const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.sets === sets);
  w.ok(!!a, `${p.name} asks, and an answer sets ${sets} (${m.choice?.ask ?? 'no question'})`);
  const said = a ? answer(a, w.party) : '';
  listen(w);
  return said;
}

/** Whether a person, an event or a group of `map` is there now. */
const there = (w: Walk, map: string, p: Person): boolean => { w.world.travel(map, p.x, p.y); return w.world.present(p); };
const shows = (w: Walk, map: string, id: string): boolean => {
  const f = MAP_DEFS.find((d) => d.id === map)!.features!.find((x) => x.kind === 'event' && x.id === id)!;
  w.world.travel(map, f.x, f.y);
  return w.world.present(f);
};
const alive = (w: Walk, map: string, id: string): boolean => {
  const g = MAP_DEFS.find((d) => d.id === map)!.encounters!.find((e) => e.id === id)!;
  w.world.travel(map, g.x, g.y);
  return w.world.liveGroups().some((l) => l.def.id === id);
};

/** A chest of `map` opened: its gold and its items into the company's purse and bag. */
function open(w: Walk, map: string, id: string): void {
  const c = MAP_DEFS.find((d) => d.id === map)!.features!.find((f) => f.kind === 'chest' && f.id === id);
  if (c?.kind !== 'chest') { w.ok(false, `there is a chest ${map}:${id}`); return; }
  w.world.travel(map, c.x, c.y);
  w.world.markUsed(c.id); w.party.gold += c.gold; w.party.bag.push(...c.items);
  listen(w);
}

/** A quest done with no goal, its entries those `want` names and none of `not`, finished once. */
function reads(w: Walk, id: string, title: string, want: readonly string[], not: readonly string[], how: string): void {
  const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [];
  const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
  w.ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
    `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
}

/** The company's experience, summed: an answer's pay is split among the living. */
const xpOf = (w: Walk): number => w.party.members.reduce((t, m) => t + m.xp, 0);

/** A company of 19, as #56 sets the moor's quests. */
function at19(ok: (cond: boolean, msg: string) => void): Walk {
  const w = newWalk(ok);
  w.level = 19;
  for (const m of w.party.members) { m.level = 19; m.xp = xpForLevel(19); }
  return w;
}

/**
 * The side quests (#482), each answered every way: the Watcher's tally, its page under his
 * predecessor's wight in Carn Dubh, taken back and its nights cut in the lintel or sent to the
 * Lanterns, the page brought before the Watcher is met; the bog body's ring sold, carried for the
 * elves or put back, when the body lies down; and the last face left or finished, when its tor never
 * stands, the stonecutter gone home or staying.
 */
function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  const PEAT = person('highmoor_o8', 'A peat-cutter'), MASON = person('highmoor_o8', 'A stonecutter');
  { // The Watcher's Tally: the Watcher asks; his predecessor's wight falls, the page under his hands
    // is read from the pack and taken back, and its nights are cut in the lintel.
    const w = at19(ok);
    meetWho(w, 'o7_watcher_met');
    ok(w.news.includes('New quest: The Watcher\'s Tally.') && /Carn Dubh/.test(goal(w, 'tally')), `the Watcher at his hut asks after his predecessor's page, and the goal is his grave (${goal(w, 'tally')})`);
    fight(w, 'cairns:cd1_watcher');
    open(w, 'cairns', 'cd1_page');
    ok(w.party.bag.includes('watchers_page') && !!ITEMS.watchers_page.text?.some((t) => t.includes('eleven')) && /Watcher at his hut/.test(goal(w, 'tally')),
      `under his hands the first page, read from the pack, and the goal is the Watcher again (${goal(w, 'tally')})`);
    const gold = w.party.gold;
    meetWho(w, 'q_tally_page');
    ok(!w.party.bag.includes('watchers_page') && w.party.gold === gold + 200 && /lintel/.test(goal(w, 'tally')), `the Watcher takes the page and pays, and asks where its nights go (${goal(w, 'tally')})`);
    const xp = xpOf(w), said = answerTo(w, 'highmoor_o7', WATCHER, 'q_tally_lintel');
    ok(said.includes('eleven strokes') && xpOf(w) === xp + 1200, `the nights cut in the lintel, and the page burned (${said.split('\n')[0]})`);
    reads(w, 'tally', 'The Watcher\'s Tally', ['watcher', 'grave', 'page', 'given', 'lintel'], ['lanterns'], 'the lintel');
    ok(shows(w, 'highmoor_o7', 'o7_lintel') && hear(w, 'highmoor_o7', WATCHER).includes('Somebody must.'), 'eleven new strokes at the lintel\'s end, and the Watcher counting');
  }
  { // The page brought before the Watcher is ever met: he takes it all the same, and it goes to the
    // Lanterns; met at last, his lesson can still come.
    const w = at19(ok);
    fight(w, 'cairns:cd1_watcher');
    open(w, 'cairns', 'cd1_page');
    const first = hear(w, 'highmoor_o7', WATCHER);
    ok(first.includes('before you have said a word') && !!w.party.flags.q_tally_page && w.news.includes('New quest: The Watcher\'s Tally.'), 'brought before he is met, the Watcher takes the page all the same, and the quest begins');
    answerTo(w, 'highmoor_o7', WATCHER, 'q_tally_lanterns');
    reads(w, 'tally', 'The Watcher\'s Tally', ['page', 'given', 'lanterns'], ['lintel'], 'the Lanterns, the page brought first');
    ok(!shows(w, 'highmoor_o7', 'o7_lintel') && hear(w, 'highmoor_o7', WATCHER).includes('Somebody must.') && !!w.party.flags.o7_watcher_met, 'nothing new at the lintel, and the Watcher counting, met at last');
  }
  // The Ring on the Bog Body: sold or carried for the elves, the body walks on by night; put back on
  // its hand, it lies down in its cutting and the bog bodies by the hut get up no more.
  for (const [sets, entry, back] of [['q_ring_sold', 'sold', false], ['q_ring_elves', 'elves', false], ['q_ring_back', 'back', true]] as const) {
    const w = at19(ok);
    ok(hear(w, 'highmoor_o8', PEAT).includes('The ring I kept') && w.news.includes('New quest: The Ring on the Bog Body.'), `${entry}: the peat-cutter kept the ring, and the quest begins`);
    const xp = xpOf(w);
    answerTo(w, 'highmoor_o8', PEAT, sets);
    const paid = xpOf(w) - xp;
    reads(w, 'bogring', 'The Ring on the Bog Body', ['cutter', entry], ['sold', 'elves', 'back'].filter((e) => e !== entry), entry);
    // Put down by night, the bog bodies by the hut get up again the next night, or, the body's ring
    // back on its hand, never (`until`).
    hour(w, 23);
    fight(w, 'highmoor_o8:o8_bodies');
    w.world.state.minutes += 3 * MINUTES_PER_DAY;
    hour(w, 23);
    ok(paid === 1200 && alive(w, 'highmoor_o8', 'o8_bodies') === !back && w.party.bag.includes('bog_ring') === (entry === 'elves')
      && shows(w, 'highmoor_o8', 'o8_laid') === back && shows(w, 'highmoor_o8', 'o8_body') === !back,
    `${entry}: put down, the bog bodies ${back ? 'get up no more, the body laid in its cutting' : 'are up again by night, the body walking'}${entry === 'elves' ? ', and the ring is in the pack' : ''}`);
  }
  // The Faces on the Tors: home, the stonecutter is gone and the last tor stands by night; let
  // finish, he stays at his fire, the face is whole and that tor never stands.
  for (const [sets, entry, finished] of [['q_faces_home', 'home', false], ['q_faces_finished', 'finished', true]] as const) {
    const w = at19(ok);
    w.level = 20;
    ok(hear(w, 'highmoor_o8', MASON).includes('The last is mine') && w.news.includes('New quest: The Faces on the Tors.'), `${entry}: the stonecutter's last face, and the quest begins`);
    const xp = xpOf(w);
    answerTo(w, 'highmoor_o8', MASON, sets);
    const paid = xpOf(w) - xp;
    reads(w, 'faces', 'The Faces on the Tors', ['mason', entry], [finished ? 'home' : 'finished'], entry);
    // The last tor's troll put down by night: up again two nights on, or, its face finished, never.
    hour(w, 23);
    fight(w, 'highmoor_o8:o8_last_tor');
    w.world.state.minutes += 3 * MINUTES_PER_DAY;
    hour(w, 23);
    ok(paid === 1800 && there(w, 'highmoor_o8', MASON) === finished && alive(w, 'highmoor_o8', 'o8_last_tor') === !finished && alive(w, 'highmoor_o8', 'o8_trolls')
      && shows(w, 'highmoor_o8', 'o8_whole') === finished && shows(w, 'highmoor_o8', 'o8_half') === !finished,
    `${entry}: ${finished ? 'the stonecutter at his fire, the last face whole, and its tor, put down, stands no more' : 'the stonecutter gone home, the last face half cut, and its tor up again by night'}`);
  }
}

/**
 * The two finds off the ladder (#862, docs/areas/cairnmoor.md §4.8), held to their rules. The hammer's
 * steel is the plain forge hammer's, a rung under the ladder's plus from 19, so the 1d6 of fire is the
 * gain; the mail is the ladder's dwarf mail with might raised by 3 while it is worn and by nothing in
 * the pack. Each costs more than nothing and no more than the area's window, is sold by no shop, has no
 * row of the ladder (so `outfit` never dresses a company in one and no gate figure moves), sells back at
 * half, and is named by no person, sign or quest.
 */
function offTheLadder(ok: (cond: boolean, msg: string) => void): void {
  const hammer = ITEMS.beacon_hammer, mail = ITEMS.cairnbuilders_mail;
  const plain = ITEMS.forge_hammer, plus = ITEMS['forge_hammer+1'], dwarf = ITEMS.dwarf_mail;
  const rung = (id: string): number | undefined => GEAR.find(([, ids]) => ids.includes(id))?.[0];
  const die = (ELEMENT_DIE + 1) / 2;

  // The hammer: fire, on the forge hammer's steel and wearers, a rung under the ladder's plus.
  ok(hammer.slot === 'weapon' && hammer.element === 'fire' && !hammer.plus && !hammer.stat
    && hammer.dice === plain.dice && hammer.sides === plain.sides && hammer.bonus === plain.bonus && !hammer.twoHanded && hammer.classes?.join() === plain.classes?.join(),
  'the Beacon Hammer is an ordinary one-handed hammer of the forge hammer\'s dice, bonus and wearers, its blows carrying fire, with no plus and no stat');
  const gain = hits(hammer) - hits(plus);
  ok(rung('forge_hammer') === 17 && rung('forge_hammer+1') === 19 && hits(plain) < hits(plus) && hits(hammer) === hits(plain) + die && gain > 0 && gain < die,
    `its steel is a rung under the ladder's: the forge hammer's ${hits(plain)} a blow, where the ladder wears the plus (${hits(plus)}) from 19; with fire's 1d6 at ${die} it hits ${hits(hammer)}, ${gain} over the ladder's at 19 and less than the die`);

  // Fire on the area's own troll, which mends from anything but fire: a blow of the hammer that lands
  // marks it burnt, so it mends not that round, and a plain forge hammer's blow does not. None of the area's
  // seven monsters takes fire amiss: all seven take it at full.
  const troll = MONSTERS.find((m) => m.id === 'tor_troll')!;
  const swing = (seed: number, weapon: string): { dmg: number; burnt: boolean } => {
    const p = defaultParty(makeRng(1)), rng = makeRng(seed);
    for (const c of p.members) c.hp = c.maxHp = 999;
    equip(p.members[0], weapon);
    const s = startCombat(p, [{ id: 'a', monsters: [troll] }], rng);
    for (let guard = 0; guard < 50 && s.outcome === 'ongoing'; guard++) {
      const t = currentTurn(s, p, rng);
      if (!t) break;
      if (t.side === 'monster') monsterAct(s, p, rng);
      else if (t.i !== 0) partyAct(s, p, rng, { type: 'defend' });
      else { const hp = s.monsters[0].hp; partyAct(s, p, rng, { type: 'attack', target: 0 }); return { dmg: hp - s.monsters[0].hp, burnt: !!s.monsters[0].burnt }; }
    }
    throw new Error('Bram never struck');
  };
  const seeds = Array.from({ length: 30 }, (_, i) => i + 1);
  const fire = seeds.map((n) => swing(n, hammer.id)).filter((r) => r.dmg > 0), steel = seeds.map((n) => swing(n, plain.id)).filter((r) => r.dmg > 0);
  ok(!!troll.regen && fire.length >= 6 && fire.every((r) => r.burnt) && steel.length >= 6 && steel.every((r) => !r.burnt) && MONSTERS.every((m) => elementMult(m, 'fire') === 1),
    `a blow of the Beacon Hammer that lands marks a tor troll burnt (${fire.length} of ${fire.length}), so it mends not that round, and a forge hammer's does not (0 of ${steel.length}); no monster of the area is immune to fire, resists it or is weak to it`);

  // The mail: the ladder's, with might.
  ok(mail.slot === 'armor' && mail.ac === dwarf.ac && mail.classes?.join() === dwarf.classes?.join() && !mail.plus && !mail.element
    && Object.keys(mail.stat ?? {}).join() === 'might' && mail.stat?.might === 3 && rung('dwarf_mail') === 17,
  `Cairnbuilder's Mail is the ladder's mail at 17: dwarf mail's armour class ${dwarf.ac} and wearers, raising might by 3 and nothing else`);
  const knight = defaultParty(makeRng(4)).members[0], base = statOf(knight, 'might');
  const worn = equip(knight, mail.id) ? statOf(knight, 'might') : -1;
  knight.equipment.armor = null;
  knight.pack.push(mail.id);
  ok(worn === base + 3 && statOf(knight, 'might') === base, `worn by the knight it raises might from ${base} to ${worn}; carried in the pack it raises nothing (${statOf(knight, 'might')})`);

  // Both: priced in the window, sold by no shop, in no row of the ladder, dressed by none, sold back at half.
  const stocked = new Set(MAP_DEFS.flatMap((m) => (m.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : []))));
  const six = defaultParty(makeRng(4));
  for (const d of [hammer, mail]) {
    ok(d.price > 0 && d.price <= CURVE.cairnmoor.price, `${d.name} costs ${d.price} gold, above nothing and inside Cairnmoor's window of ${CURVE.cairnmoor.price}`);
    ok(!stocked.has(d.id) && rung(d.id) === undefined, `${d.name} is sold by no shop and is in no row of the ladder`);
    ok(sellPrice(six, d.price) === d.price / 2, `${d.name} sells back at half, ${sellPrice(six, d.price)} gold`);
  }
  const dressed = defaultParty(makeRng(4)).members;
  for (const m of dressed) outfit(m, 32);
  ok(dressed.every((m) => m.equipment.weapon !== hammer.id && m.equipment.armor !== mail.id && !m.pack.includes(hammer.id) && !m.pack.includes(mail.id)),
    'dressed from the ladder at any level, a company never wears either: the gate\'s company goes without');

  // Found, never told: no person, sign, event or quest names either, and no site of the atlas is theirs.
  const words = (f: Feature): string[] => ('lines' in f ? [...f.lines] : 'text' in f && f.text ? [f.text] : []);
  const said = [
    ...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap(words)),
    ...QUESTS.flatMap((q) => (q.chapters ?? [q]).flatMap((c) => [...c.entries.map((e) => e.text), ...c.goals.map((g) => g.text)])),
  ];
  const told = said.filter((t) => /beacon hammer|cairnbuilder/i.test(t));
  ok(said.length > 500 && !told.length, `none of ${said.length} lines of the people, signs, events and quests names either find${told.length ? ' -> ' + told[0] : ''}`);
}

// ---- the bounds (#834) ----

/**
 * The hills under the rim (P7) and the ledge under it (P8), off the road, in a walk of their own at 18:
 * east from O7's 31,4 onto P7's 0,4 and from O8's 31,10 onto P8's 0,10, walked, the same moor, so
 * nothing is said; south from P7's 1,31 onto P8's 1,0. The old herd's word on the old folk, the stone
 * on end's riddle, the ledge of pebbles knelt at and each box's groups won at its floor; the earth-house
 * found from the rock face where the wind hoots, bending twice, and the herds' store from the rowan, a
 * chamber along the face, each shut to the four ways but through its door. O7's 31,0 is mountain with
 * P6's corner (#834's 3), and P7's 5,24 in the rim's face is left bare for the lair's door.
 * Then the Cairnfield's shore (L8): west from M8's 0,23 onto its 31,23, the same field, so nothing is
 * said; the wrack-gatherer's word on the drowned cairn, the tideline, the mound and the ice seen, the well
 * knelt at and each group won at its floor; the noost found from the tar, shut to the four ways but
 * through its door; the gap in the mound's face at 22,27, L8's one way out but its edges; and the seams,
 * the south edge onto L9's ice, sand and pines and the corner at 0,31 (#834's 11 and 12).
 * Then Carn Fada, the enclave (#845): west from L8's hills at 23,27 into the gap and down, its door saying
 * its band and how it feels at 17, 18 and 20 and its sign its band; its three groups won at 20, each
 * standing where the way on passes; the Sunwise Mace in the oldest dead's cist, the closed cell found
 * from the spiral that turns against the rest and shut to the four ways but through its stone, and up
 * through the gap onto L8's 23,27 again.
 */
function theBounds(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok);
  w.level = 18;
  for (const m of w.party.members) m.level = 18;
  const [P7, P8] = ['highmoor_p7', 'highmoor_p8'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const out = buildMaps()[OUTDOORS], zone = (id: string): MapZone => out.zones.find((z) => z.id === id)!;
  const p7 = zone(P7.id), p8 = zone(P8.id), o7 = zone('highmoor_o7'), o8 = zone('highmoor_o8'), p6 = zone('kilnsheart_p6');
  const ALL: Can = { swim: true, climb: true, float: true };
  const said = (r: ReturnType<typeof w.world.move>): string => (r.kind === 'moved' ? r.messages.join(' / ') || 'nothing said' : r.kind);
  const at = (z: MapZone, x: number, y: number): number => (z.y + y) * out.width + z.x + x;
  /** The squares of a box reached from one of its own, inside the box: on foot, or every way with its secret door shut. */
  const reach = (z: MapZone, from: readonly [number, number], can: Can, door?: readonly [number, number]): Set<number> => {
    const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (door && x === z.x + door[0] && y === z.y + door[1]) || x < z.x || x >= z.x + z.w || y < z.y || y >= z.y + z.h || out.passable(x, y, can) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return seen;
  };
  /** Searched from a square facing the face, the wall gives and the room behind it is walked into. */
  const search = (map: string, x: number, y: number, facing: typeof EAST, room: string): boolean => {
    w.world.travel(map, x, y, facing);
    let found = false;
    for (let i = 0; i < 20 && !found; i++) found = w.world.search();
    const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
    listen(w);
    return found && into.every((r) => r.kind === 'moved') && w.world.used(room);
  };
  const open = (n: number, f: (i: number) => boolean): string => Array.from({ length: n }, (_, i) => f(i)).join();

  // The hills under the rim (P7): east from O7's 31,4 onto P7's 0,4, walked, nothing said.
  w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 12 * 60;
  w.world.travel('highmoor_o7', 31, 4, EAST);
  const east = w.world.move('forward');
  ok(east.kind === 'moved' && w.world.zone?.id === P7.id && w.world.state.x === p7.x && w.world.state.y === p7.y + 4 && !east.messages.some((m) => m.startsWith('High Moor.') || m.includes('harder')),
    `east from O7's 31,4 onto P7's 0,4, walked, and the moor not named again (${said(east)})`);
  listen(w);
  const hills = reach(p7, [P7.start.x, P7.start.y], {});
  ok(hills.size > 130 && [[2, 2], [7, 2], [6, 7], [0, 13], [1, 19], [4, 24], [1, 29], [1, 31]].every(([x, y]) => hills.has(at(p7, x, y))),
    `the hills (${hills.size} squares), the bothy, the cairn, the rock face, the narrows, the long cairns, the rim's face at 5,24, the ledge of pebbles and the south edge are all walked to on foot from the way in`);
  see(w, `${P7.id}:p7_hills`);

  // The old herd at the bothy and his word on the old folk; the stone on end's riddle; the long cairns
  // and the ledge of pebbles; the box's groups won at its floor.
  const herd = P7.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'An old herd')!;
  w.world.travel(P7.id, herd.x, herd.y);
  const told = meet(herd, w.party, heard(w.world, herd)).text;
  ok(told.includes('went up to the tops') && told.includes('do not lie still'), `the old herd: his folk went up to the tops when their time came and lie past the narrows, and some do not lie still (${told.replace(/\n+/g, ' ')})`);
  listen(w);
  const stone = P7.features!.find((f): f is Extract<Feature, { kind: 'statue' }> => f.kind === 'statue' && f.id === 'p7_stone')!;
  w.world.travel(P7.id, stone.x, stone.y);
  ok(!answerRiddle(w.world, w.party, stone, 'wall').right && answerRiddle(w.world, w.party, stone, 'Cairn').right, 'the stone on end\'s riddle is answered cairn, which every one who passes adds a stone to, and not wall');
  see(w, `${P7.id}:p7_graves`);
  kneel(w, `${P7.id}:p7_pebbles`);
  for (const g of P7.encounters!) fight(w, `${P7.id}:${g.id}`);

  // The secret: the wind hooting at the rock face, the search there and the earth-house behind it,
  // bending twice into the hill. Walked, waded, climbed or floated, it is never reached but through its door.
  const house = reach(p7, [P7.start.x, P7.start.y], ALL, [6, 8]);
  ok(house.size > 130 && ![[6, 9], [7, 9], [7, 10]].some(([x, y]) => house.has(at(p7, x, y))), `the earth-house is shut but for its door in the rock: none of P7's ${house.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${P7.id}:p7_hoot`);
  ok(search(P7.id, 6, 7, SOUTH, 'p7_house'), 'searched at the rock face where the wind hoots, the rock gives, and the earth-house behind it can be walked into');
  ok(out.passable(p7.x + 6, p7.y + 10) !== 'ok' && out.passable(p7.x + 7, p7.y + 9) === 'ok' && out.passable(p7.x + 7, p7.y + 10) === 'ok', 'the passage bends east a square in and south again, as an earth-house goes into the hill');
  const kist = P7.features!.find((f) => f.kind === 'chest' && f.id === 'p7_house_chest');
  ok(kist?.kind === 'chest' && kist.gold === 250 && kist.items.join() === 'elixir' && kist.x === 7 && kist.y === 10, 'at the earth-house\'s end, a chest with 250 gold and an Elixir');

  // The lair's door (docs §12.6) is left bare: the rim's face at 5,24, mountain, its way the hills of
  // row 24, with nothing within four squares.
  const near = [...(P7.features ?? []), ...(P7.encounters ?? [])].filter((f) => Math.abs(f.x - 5) + Math.abs(f.y - 24) <= 4);
  ok(P7.rows[24][5] === 'M' && hills.has(at(p7, 4, 24)) && !near.length, `the rim's face at 5,24 is left bare for the lair's door, walked to along row 24, nothing within four squares${near.length ? ' (not ' + near.map((f) => `${f.x},${f.y}`).join(' ') + ')' : ''}`);

  // P7's seams: O7's hills open onto it at rows 1 to 29, O7's corner square 31,0 shut with P6's 0,31
  // (#834's 3), and the north edge shut along P6's mountain.
  ok(open(32, (i) => out.passable(p7.x, p7.y + i) === 'ok') === open(32, (i) => i >= 1 && i <= 29) && out.passable(o7.x + 31, o7.y) !== 'ok' && out.passable(p6.x, p6.y + 31) !== 'ok'
    && open(24, (i) => out.passable(p7.x + i, p7.y) === 'ok') === open(24, () => false),
    'P7 opens onto O7 at rows 1 to 29; O7\'s 31,0 is mountain with P6\'s 0,31, and P7\'s north edge is shut along P6\'s mountain');

  // The ledge under the rim (P8): south from P7's 1,31 onto its 1,0, and east from O8's 31,10 onto
  // its 0,10, both walked, the same moor.
  walkThrough(w, P7.id, 1, 31, SOUTH, P8.id, 2);
  w.world.travel('highmoor_o8', 31, 10, EAST);
  const ledge = w.world.move('forward');
  ok(ledge.kind === 'moved' && w.world.zone?.id === P8.id && w.world.state.x === p8.x && w.world.state.y === p8.y + 10 && !ledge.messages.some((m) => m.startsWith('High Moor.') || m.includes('harder')),
    `east from O8's 31,10 onto P8's 0,10, walked, and the moor not named again (${said(ledge)})`);
  listen(w);
  const shelf = reach(p8, [P8.start.x, P8.start.y], {});
  ok(shelf.size > 45 && [[1, 0], [2, 3], [3, 7], [0, 19]].every(([x, y]) => shelf.has(at(p8, x, y))), `the ledge (${shelf.size} squares), the north edge, the cairn, the rowan and the ledge's end are all walked to on foot from the way in`);
  for (const id of ['p8_ledge', 'p8_bones']) see(w, `${P8.id}:${id}`);
  for (const g of P8.encounters!) fight(w, `${P8.id}:${g.id}`);

  // The secret: the rowan out of the bare face, the search there and the herds' store behind it, a
  // chamber of three along the face with its door at the middle. Shut as P7's is.
  const store = reach(p8, [P8.start.x, P8.start.y], ALL, [4, 7]);
  ok(store.size > 45 && ![[5, 6], [5, 7], [5, 8]].some(([x, y]) => store.has(at(p8, x, y))), `the store is shut but for its door in the face: none of P8's ${store.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${P8.id}:p8_rowan`);
  ok(search(P8.id, 3, 7, EAST, 'p8_store'), 'searched at the rowan, the face gives, and the store behind it can be walked into');
  ok(out.passable(p8.x + 5, p8.y + 6) === 'ok' && out.passable(p8.x + 5, p8.y + 8) === 'ok' && out.passable(p8.x + 6, p8.y + 7) !== 'ok', 'the store runs along the face a square either way from its door, where P7\'s earth-house bends into the hill');
  const winter = P8.features!.find((f) => f.kind === 'chest' && f.id === 'p8_store_chest');
  ok(winter?.kind === 'chest' && winter.gold === 200 && winter.items.join() === 'elixir' && winter.x === 5 && winter.y === 8, 'in the store, a chest with 200 gold and an Elixir');

  // P8's seams: O8's hills open onto it at rows 2 to 19, its corner squares shut as O8's are; P7's
  // south edge meets its north at 1 to 3; its south edge is the rim's mountain.
  ok(open(32, (i) => out.passable(p8.x, p8.y + i) === 'ok') === open(32, (i) => i >= 2 && i <= 19) && open(24, (i) => out.passable(p8.x + i, p8.y) === 'ok') === open(24, (i) => i >= 1 && i <= 3)
    && open(24, (i) => out.passable(p8.x + i, p8.y + 31, ALL) === 'ok') === open(24, () => false) && out.passable(o8.x + 31, o8.y + 1) !== 'ok',
    'P8 opens onto O8 at rows 2 to 19 and onto P7 at 1 to 3 of its north edge; its south edge is the rim\'s mountain, and past it the world ends');

  // The Cairnfield's shore (L8): west from M8's 0,23 onto its 31,23, walked, the same field.
  const L8 = MAP_DEFS.find((d) => d.id === 'cairnfield_l8')!;
  const l8 = zone(L8.id), l9 = zone('longmere_l9');
  w.world.travel('cairnfield_m8', 0, L8.start.y, WEST);
  const shore = w.world.move('forward');
  ok(shore.kind === 'moved' && w.world.zone?.id === L8.id && w.world.state.x === l8.x + 31 && w.world.state.y === l8.y + L8.start.y && !shore.messages.some((m) => m.startsWith('The Cairnfield.')),
    `west from M8's 0,${L8.start.y} onto L8's 31,${L8.start.y}, walked, and the field not named again (${said(shore)})`);
  listen(w);
  const strand = reach(l8, [L8.start.x, L8.start.y], {});
  ok(strand.size > 110 && [[30, 16], [28, 19], [27, 21], [25, 22], [30, 22], [25, 25], [28, 25], [23, 27], [25, 29], [17, 31], [9, 30], [0, 31]].every(([x, y]) => strand.has(at(l8, x, y))),
    `the shore (${strand.size} squares), the strand's north end, the tideline, the hut, the wrack-gatherer, the well, the mound's way, the bank, the cairn, the loch's foot, the ice and the lip of it at 0,31 are all walked to on foot from the way in`);

  // The wrack-gatherer's word on the drowned cairn, in words only; the tideline, the mound and the ice
  // seen; the well knelt at; the box's groups won at its floor.
  const gatherer = L8.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'A wrack-gatherer')!;
  w.world.travel(L8.id, gatherer.x, gatherer.y);
  const word = meet(gatherer, w.party, heard(w.world, gatherer)).text;
  ok(word.includes('half drowned') && word.includes('oldest dead') && !/noost|tar\b|boat|door/.test(word), `the wrack-gatherer: a cairn in the hills over the strand that the sea has half drowned, the oldest dead's, in words only (${word.replace(/\n+/g, ' ')})`);
  listen(w);
  for (const id of ['l8_tide', 'l8_mound', 'l8_ice']) see(w, `${L8.id}:${id}`);
  kneel(w, `${L8.id}:l8_well`);
  for (const g of L8.encounters!) fight(w, `${L8.id}:${g.id}`);
  const crest = L8.features!.find((f) => f.kind === 'cairn' && f.id === 'l8_cairn');
  ok(crest?.kind === 'cairn' && crest.gold === 120 && crest.items.join() === 'potion_sp_great', 'the cairn on the hills holds 120 gold and a Sapphire Vial');

  // The secret: the tar coming out of the bank, the search there and the noost behind it, a room of three
  // by two with the boat upturned in it. Walked, waded, climbed or floated, it is never reached but through its door.
  const cut = reach(l8, [L8.start.x, L8.start.y], ALL, [28, 26]);
  ok(cut.size > 110 && ![[27, 27], [28, 27], [29, 27], [27, 28], [28, 28], [29, 28]].some(([x, y]) => cut.has(at(l8, x, y))), `the noost is shut but for its door in the bank: none of L8's ${cut.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${L8.id}:l8_tar`);
  ok(search(L8.id, 28, 25, SOUTH, 'l8_noost'), 'searched where the tar smells, the bank gives, and the noost behind it can be walked into');
  ok(out.passable(l8.x + 27, l8.y + 27) === 'ok' && out.passable(l8.x + 29, l8.y + 28) === 'ok' && out.passable(l8.x + 26, l8.y + 27) !== 'ok' && out.passable(l8.x + 30, l8.y + 28) !== 'ok' && out.passable(l8.x + 28, l8.y + 29) !== 'ok',
    'the noost is a room of three by two cut into the bank, walled all round');
  const hoard = L8.features!.find((f) => f.kind === 'chest' && f.id === 'l8_noost_chest');
  ok(hoard?.kind === 'chest' && hoard.gold === 220 && hoard.items.join() === 'elixir' && hoard.x === 29 && hoard.y === 28, 'in the noost, under the boat, a chest with 220 gold and an Elixir');

  // The enclave's door (docs §12.5): the gap in the mound's face at 22,27, drawn as its stone, the mound's
  // mountain either side of it and behind it, walked into from the hills at 23,27, with nothing within
  // four squares: L8's one way out but its edges, into Carn Fada.
  const door = [...(L8.features ?? []), ...(L8.encounters ?? [])].filter((f) => Math.abs(f.x - 22) + Math.abs(f.y - 27) <= 4);
  ok(L8.exits?.length === 1 && L8.exits[0].x === 22 && L8.exits[0].y === 27 && L8.exits[0].to === 'carn_fada' && L8.rows[27][22] === '"'
    && ['M', 'M', 'M'].join() === [L8.rows[26][22], L8.rows[28][22], L8.rows[27][21]].join() && L8.rows[27][23] === '^' && strand.has(at(l8, 23, 27)) && !door.length,
    `the gap in the mound's face at 22,27 is L8's one way out but its edges, into Carn Fada, walked to from the hills at 23,27, nothing within four squares${door.length ? ' (not ' + door.map((f) => `${f.x},${f.y}`).join(' ') + ')' : ''}`);

  // L8's seams: M8's grass opens onto it at rows 15 to 31; its north edge is the sea along L7's; its south
  // edge meets L9's ice at 0 to 6 and 13 and 14, sand at 15, pines at 16 to 21 and 28 to 30 and grass at 31,
  // with L9's sea and shallows between; the west edge is the sea but for the corner, 0,31, where L9's ice
  // runs up, facing K8's sea (#834's 11 and 12).
  ok(open(32, (i) => out.passable(l8.x + 31, l8.y + i) === 'ok') === open(32, (i) => i >= 15) && open(32, (i) => out.passable(l8.x + i, l8.y) === 'ok') === open(32, () => false)
    && open(32, (i) => out.passable(l8.x + i, l8.y + 31) === 'ok') === open(32, (i) => i <= 6 || (i >= 13 && i <= 21) || i >= 28)
    && open(32, (i) => out.passable(l9.x + i, l9.y) === 'ok') === open(32, (i) => i <= 6 || (i >= 13 && i <= 21) || i >= 28)
    && open(32, (i) => out.passable(l8.x, l8.y + i) === 'ok') === open(32, (i) => i === 31) && out.passable(l8.x - 1, l8.y + 31) !== 'ok',
    'L8 opens onto M8 at rows 15 to 31 and onto L9 along its south edge square for square; its north edge is the sea along L7\'s, and its west edge the sea but for 0,31, where L9\'s ice runs up beside K8\'s sea');
  walkThrough(w, L8.id, 30, 31, SOUTH, l9.id, 2);
  ok(w.world.state.x === l9.x + 30 && w.world.state.y === l9.y, 'south from L8\'s 30,31 onto L9\'s 30,0, walked, into Loch Fada');

  // Carn Fada, the enclave (#845): west from L8's hills at 23,27 into the gap and down. Its door says its
  // band and how it feels, as a border's line: the warning at 17, harder at 18 and its band alone at 20.
  {
    const CF = MAP_DEFS.find((d) => d.id === 'carn_fada')!, gap = L8.exits!.find((e) => e.to === CF.id)!;
    const levels = w.party.members.map((m) => m.level);
    const enter = (level: number): string => {
      for (const m of w.party.members) m.level = level;
      w.world.travel(L8.id, 23, 27, WEST);
      const r = w.world.move('forward');
      return r.kind === 'moved' && w.world.state.mapId === CF.id && w.world.state.x === CF.start.x && w.world.state.y === CF.start.y ? r.messages.join(' | ') : r.kind;
    };
    const band = 'Carn Fada: levels 20-21.', low = enter(17), close = enter(18), at20 = enter(20);
    ok(low === `${gap.label} | ${band} ${WARNING_IN}` && close === `${gap.label} | ${band} ${HARDER_IN}` && at20 === `${gap.label} | ${band}`,
      `west from the hills at 23,27 into the gap and down into Carn Fada, the way's own line and then its band, with the warning at 17, harder at 18 and nothing more at 20 (${low}; ${close}; ${at20})`);
    ok(!!CF.enclave && w.world.here.name === 'Carn Fada' && w.world.here.band?.join('-') === '20-21', `inside, its sign gives its own band, over L8's 18-19 (${w.world.here.name}, ${w.world.here.band?.join('-')})`);
    listen(w);
    // Each group stands where the way on passes, so none is walked round: past the bodies at the tide's
    // head lie the passage and all the rest, past the wights at the chamber's mouth the chamber and its
    // spirals, and past the bears in the end cell's mouth the cist. Walked, waded, climbed or floated.
    const hold = new GameMap(CF);
    const flood = (...shut: (readonly [number, number])[]): Set<string> => {
      const seen = new Set<string>(), todo: [number, number][] = [[CF.start.x, CF.start.y]];
      while (todo.length) {
        const [x, y] = todo.pop()!;
        if (seen.has(`${x},${y}`) || shut.some(([sx, sy]) => sx === x && sy === y) || hold.passable(x, y, ALL) !== 'ok') continue;
        seen.add(`${x},${y}`);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
      }
      return seen;
    };
    const groups = CF.encounters!.map((g) => `${g.id} ${g.x},${g.y} ${g.monsters.length} ${[...new Set(g.monsters)].join('+')}`).join('; ');
    ok(groups === 'cf_bodies 9,3 6 bog_body; cf_wights 11,10 4 cairn_wight; cf_bears 4,10 2 ice_bear' && CF.encounters!.every((g) => g.respawn === 2880 && g.roams === false && !g.slainText)
      && !flood([7, 8], [9, 3]).has('12,3') && !flood([7, 8], [11, 10]).has('7,9') && !flood([7, 8], [4, 10]).has('1,10'),
      `six bog bodies at the tide's head, four cairn wights at the chamber's mouth and two ice bears in the end cell's, each back in two days, none roaming or a guardian, and none walked round (${groups})`);
    // Its three groups won at its floor, rising from the bodies to the bears; every sight; and the oldest
    // dead's cist with the Sunwise Mace in it, which no other chest or cairn holds, no shop sells and no
    // monster drops: the ice axe's numbers with a die of holy, off the ladder and inside its window.
    w.level = 20;
    for (const g of CF.encounters!) fight(w, `${CF.id}:${g.id}`);
    for (const id of ['cf_gap', 'cf_tide', 'cf_lintels', 'cf_chamber', 'cf_robbed', 'cf_den', 'cf_cist']) see(w, `${CF.id}:${id}`);
    const cist = CF.features!.find((f) => f.kind === 'chest' && f.id === 'cf_cist_chest'), mace = ITEMS.sunwise_mace;
    ok(cist?.kind === 'chest' && cist.gold === 400 && cist.items.join() === 'sunwise_mace'
      && !MAP_DEFS.some((d) => (d.features ?? []).some((f) => (f.kind === 'shop' && f.stock.includes(mace.id)) || ((f.kind === 'chest' || f.kind === 'cairn') && f !== cist && f.items.includes(mace.id))))
      && !Object.values(EVERY_MONSTER).some((m) => m.drops?.some((d) => d.item === mace.id)),
      'in the end cell, the oldest dead\'s cist: 400 gold and the Sunwise Mace; no other chest or cairn holds it, no shop sells it and no monster drops it');
    ok(mace.element === 'holy' && hits(mace) === hits(ITEMS.ice_axe) + (ELEMENT_DIE + 1) / 2 && mace.price <= CURVE.rimewater.price && !GEAR.some(([, ids]) => ids.includes(mace.id)),
      `the Sunwise Mace is the ice axe's numbers with a die of holy, ${hits(mace)} a blow to the ladder's Ice Axe +1's ${hits(ITEMS['ice_axe+1'])} at 22, on no rung, at ${mace.price} inside its window, Rimewater's ${CURVE.rimewater.price}`);
    // The secret: the one spiral turned against the rest, the search there and the cell behind it, never
    // opened. Walked, waded, climbed or floated, it is never reached but through its stone.
    const closed = flood([7, 8]);
    ok(closed.size > 50 && !['6,6', '7,6', '6,7', '7,7'].some((k) => closed.has(k)), `the closed cell is shut but for its stone: none of Carn Fada's ${closed.size} squares walked, waded, climbed or floated reaches it`);
    see(w, `${CF.id}:cf_spirals`);
    ok(search(CF.id, 7, 9, NORTH, 'cf_sealed'), 'searched at the spiral that turns against the rest, the stone gives, and the closed cell behind it can be walked into');
    const kept = CF.features!.find((f) => f.kind === 'chest' && f.id === 'cf_sealed_chest');
    ok(kept?.kind === 'chest' && kept.gold === 300 && kept.items.join() === 'elixir,potion_sp_great', 'in the closed cell, a chest with 300 gold, an Elixir and a Sapphire Vial');
    // And out: up through the gap onto L8's 23,27, with the way's own line and no other.
    w.world.travel(CF.id, CF.start.x, CF.start.y + 1, NORTH);
    const up = w.world.move('forward');
    ok(up.kind === 'moved' && w.world.zone?.id === L8.id && w.world.state.x === l8.x + 23 && w.world.state.y === l8.y + 27 && w.world.state.facing === EAST && up.messages.join(' | ') === CF.exits![0].label,
      `up out of Carn Fada onto L8's 23,27, facing the land, the way's own line alone (${up.kind === 'moved' ? up.messages.join(' | ') : up.kind})`);
    listen(w);
    w.party.members.forEach((m, i) => { m.level = levels[i]; });
    w.level = 18;
  }
}
