// The Whitespine's walkthrough. Its chapter, The Bells (#505), is played last (theBells); first,
// Monks' Vale (J11, #499) walked: over the pass from Rimewater's K10 by the road across J10's corner
// (#508), the crossing line said where K10 meets J10, in the range's words to a company under the vale's
// floor and its name alone to one at it, and back; the road square to square from K10's edge over J10's
// corner and on from the pass's foot to the gate's front, the
// bells heard at its foot; the gate and Highcell through it (#500): the cloister, the cells and the
// Novice, the bells rung eleven and the ringer among them who breathes, the chapter house and the
// Abbot on its seat, and the undercroft behind the seat; Spine Summit's camp at the atlas's site, and
// the hermit at it; the herder at his fold; the monks' shrine by the road; the box's groups won at its
// floor; and the store behind the wall, found from the trodden line to the rock. Then the Peak
// Stone's box (I11, #501) walked: over the crest from the summit, the High Spine named in its own words
// to a company under its floor; the crest path to the Stone at the atlas's site, whole, which counts
// toward the Hearth once stood at; the ridge trail leaving north beside it; the shrine, the keeper, the
// cairn and the nest; the lookout over Ashfall and the ground under the Sheer, reached by a climb; the
// camp under the snow line; the box's groups won at its floor; and under the one unfrosted slab of the
// ring, the Lantern's survey marker and her instruments. Then Stairwatch and the Stair's head (I10,
// #502) walked: up the ridge trail from the Stone, nothing said; the trail on north to the edge, the
// road off it west to the head at the atlas's link and the Stair down through the Sheer to the west
// edge; the caravan short of the head, its master and his girl; the toll-stone and the old shrine; the
// box's groups won at its floor, the giants sweeping; the toll put before the fight: refused, the
// fight and the hoard under the seat; paid in gold or in the grey part, the walk down the Stair;
// and Stairwatch's ledge, found up the chimney behind the pines, and the old champion on it. Then the
// ridge north (I9, #503) walked: north along the ridge trail from the Stair's head, Sheer Point named
// in its own words to a company under its floor, and the High Spine's read true coming back; the
// trail square to square to the north edge; the wind warm off the sea, the giants' cairn, the snow
// gone off the rocks, and at the trail's end the Hearth and the causeway; the box's groups won at its
// floor, the masons who never break; the first masons' camp, abandoned, and behind their tally the
// cache of shards; the hermit at the shore, the lamp at the Sheer's edge and the camp in the lee. Then
// Sheer Point (I8, #504) walked: on up the trail from the ridge, nothing said, to its end over the
// tip and the masons' track down to the shore; the causeway of cut stone out over the water, the
// stone carved apart from the rest and its end over deep water; the box's groups won at its floor,
// the foreman's the hardest and a troll by night; Wenna moving from the lodge to Highcell's gate and
// on to the camp on the shingle, and the night she is taken, her knot on the first stone; Rook's Nest
// at the atlas's site and the watcher in it; the Hand's sea cave under it, found from the wet rock at
// the hollow's back; the cairn, the drowned god's shrine and the deserter in the rocks with his tally.
// Then the country behind the road (#508, `spineBehind`): the giants' ground (J10), the Spine's south
// (I12) and the vale's end (J12), each walked into, its one group won and its secret found from its hint.
// Last, the four third prestiges taught here (#448) taken at 27, each for its trainer's quest: the ledge
// held with Edric, the vigil kept with Oswin, the eleven sung to Brother Lark and the Compact's orders
// read to Hereward in Rook's Nest (`thirdPrestiges`).
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen, playChapter, everyGoalWalked, goalFromBegun, quest, type Walk, type Step } from '../../../../tools/walk.ts';
import { xpForLevel, createCharacter, takePrestige, prestigeOf } from '../../../game/party.ts';
import type { ClassId } from '../../../game/party.ts';
import { offers, teach } from '../../../game/prestige.ts';
import { seekId } from '../../../game/seeking.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { NORTH, SOUTH, EAST, WEST } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { stonesRestored } from '../../../game/stones.ts';
import { ATLAS, MAP_DEFS, MONSTERS as MONSTER_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard, answer, barred, SHORT, NONE } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GameMap } from '../../../game/map.ts';
import type { MapDef } from '../../../game/map.ts';
import { readLine } from '../../../game/inscriptions.ts';
import { MONSTERS } from './monsters.ts';
import { GATE, VIGIL_ASKED, VIGIL_KEPT } from './maps/monksvale_j11.ts';
import { WENNA_TAKEN, MASON_PASSAGE, MASON_SWAPPED, ORDERS_ASKED, ORDERS_READ } from './maps/sheerpoint_i8.ts';
import { WENNA_LODGE } from '../rimewater/maps/rime_lodge.ts';
import { STAIR_TOP, TOLL_DONE, LEDGE_ASKED, LEDGE_HELD } from './maps/highspine_i10.ts';
import { NOVICE_TOLD, NOVICE_KEPT, ELEVEN_ASKED, ELEVEN_SUNG } from './maps/monastery.ts';
import { NEST_WATCH, NEST_CELL } from './maps/highspine_i11.ts';
import { questLog } from '../../../game/quests.ts';
import { CHAPTER } from './chapter.ts';

const J11 = MAP_DEFS.find((d) => d.id === 'monksvale_j11')!;
const person = (name: string): Person => J11.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const VALE = ATLAS.zones.find((z) => z.id === 'monksvale')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const j11 = out.zones.find((z) => z.id === 'monksvale_j11')!, k10 = out.zones.find((z) => z.id === 'coldmere_k10')!;
  const j10 = out.zones.find((z) => z.id === 'monksvale_j10')!;
  const road = (x: number, y: number): boolean => out.at(x, y).ch === '=';

  // Over the pass: from K10's road at its west edge onto J10's, walked (#508; taken across parked J10's
  // corner until it was laid, SADDLE and CLIMB). Three under the vale's floor the harsher words, two
  // under the range's own, at the floor its name and nothing more.
  const over = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('coldmere_k10', 0, 19, WEST);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const low = over(19), two = over(20), due = over(22);
  ok(w.world.zone?.id === 'monksvale_j10' && w.world.state.x === j10.x + 31 && w.world.state.y === j10.y + 19 && j10.x + j10.w === k10.x && road(k10.x, k10.y + 19) && road(j10.x + 31, j10.y + 19),
    'over the pass west along the road from K10\'s 0,19 onto J10\'s 31,19, walked');
  ok(due.join(' / ') === 'Monks\' Vale.', `at 22, the vale named, no more (${due.join(' / ')})`);
  ok(two.join(' / ') === `Monks' Vale. ${VALE.crossing?.harder}`, `at 20, the rest in the range's own words (${two.join(' / ')})`);
  ok(low.join(' / ') === `Monks' Vale. ${VALE.crossing?.warning}`, `at 19, the harsher words, and the way back over the pass open (${low.join(' / ')})`);
  const K10 = MAP_DEFS.find((d) => d.id === 'coldmere_k10')!, J10 = MAP_DEFS.find((d) => d.id === 'monksvale_j10')!;
  ok(J11.exits?.length === 1 && J11.exits[0] === GATE && !(K10.exits ?? []).length && !(J10.exits ?? []).length,
    'nothing is taken over the pass: the vale\'s only way out but its edges is Highcell\'s gate, and K10 and J10 have none');
  // Back over the pass: straight back within the hour, nothing said.
  const back = w.world.move('back');
  ok(back.kind === 'moved' && w.world.zone?.id === 'coldmere_k10' && w.world.state.x === k10.x && w.world.state.y === k10.y + 19 && !back.messages.length,
    `back from J10's 31,19 onto K10's 0,19, walked; straight back, nothing said (${back.kind === 'moved' ? back.messages.join(' / ') || 'nothing said' : back.kind})`);
  // Down off the pass: J10's road at its south edge onto J11's first square at 20,0, walked, the same
  // land at the same floor, so nothing named.
  w.world.travel('monksvale_j10', 20, 31, SOUTH);
  const offPass = w.world.move('forward');
  ok(offPass.kind === 'moved' && w.world.zone?.id === 'monksvale_j11' && w.world.state.x === j11.x + 20 && w.world.state.y === j11.y && j10.y + j10.h === j11.y && !offPass.messages.some((m) => m.includes(VALE.name)),
    `down the road from J10's 20,31 onto J11's 20,0, walked, and the vale not named again (${offPass.kind === 'moved' ? offPass.messages.join(' / ') || 'nothing said' : offPass.kind})`);
  listen(w);
  w.level = 22;
  for (const m of w.party.members) m.level = 22;

  // The road square to square from K10's edge over J10's corner and down from the pass's foot to the
  // gate's front, the atlas's way into Highcell.
  const onJ11 = (x: number, y: number): boolean => x >= j11.x && x < j11.x + j11.w && y >= j11.y && y < j11.y + j11.h;
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Set<number> => {
    const seen = new Set([fy * out.width + fx]), q = [[fx, fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const way = ATLAS.links.find((l) => l.from === 'monksvale' && l.to === 'monastery')!.a!;
  const onJ10 = (x: number, y: number): boolean => x >= j10.x && x < j10.x + j10.w && y >= j10.y && y < j10.y + j10.h;
  const byRoad = reach(j10.x + 31, j10.y + 19, (x, y) => road(x, y) && (onJ10(x, y) || onJ11(x, y)));
  ok(byRoad.has(j11.y * out.width + j11.x + 20) && byRoad.has((j11.y + GATE.y - 1) * out.width + j11.x + GATE.x) && road(j10.x + 32, j10.y + 19),
    'the road runs square to square from K10\'s edge over J10\'s corner to its south edge at 20,31, and over J11 from the pass\'s foot at 20,0 to the gate\'s front at 26,23');
  ok(Math.floor(way[0]) === j11.x + GATE.x && Math.floor(way[1]) === j11.y + GATE.y, `the gate at 26,24 is the atlas's way into Highcell (${way.join(',')})`);

  // The bells, heard at the pass's foot on the road, the step's first line.
  const bells = J11.features!.find((f) => f.kind === 'event' && f.id === 'j11_bells');
  ok(bells?.kind === 'event' && road(j11.x + bells.x, j11.y + bells.y) && bells.y <= 3 && bells.text.startsWith('Across the snow, bells.'), 'the bells are heard on the road at the pass\'s foot');
  see(w, 'monksvale_j11:j11_bells');

  // The gate (GATE), the way into Highcell, walked in `highcell` below (#500): a door in the wall, the
  // brother in it said as the company passes, and nothing more said at its front.
  ok(GATE.to === 'monastery' && out.at(j11.x + GATE.x, j11.y + GATE.y).door === 'door' && !!J11.exits?.includes(GATE) && !J11.features!.some((f) => f.kind === 'event' && f.x === GATE.x && f.y === GATE.y - 1),
    'the gate at 26,24 is a door in the monastery\'s wall, the way into Highcell, and nothing bars it');
  const before = w.level;
  highcell(w, ok);
  w.level = before;

  // Spine Summit, the atlas's camp, up the path from the hills; the hermit at it.
  const [sx, sy] = ATLAS.sites.find((s) => s.name === 'Spine Summit')!.at;
  const summit = J11.features!.find((f) => f.kind === 'camp' && f.name === 'Spine Summit');
  ok(!!summit && j11.x + summit.x === Math.floor(sx) && j11.y + summit.y === Math.floor(sy) && !ATLAS.sites.find((s) => s.name === 'Spine Summit')!.planned,
    'Spine Summit\'s camp is at the atlas\'s site, 4,10, and the site is built');
  ok(reach(j11.x + 20, j11.y + 1, (x, y) => onJ11(x, y) && out.passable(x, y) === 'ok').has((j11.y + summit!.y) * out.width + j11.x + summit!.x), 'the path goes up from the hills to the summit');
  const hermit = person('Oswin, the summit\'s hermit');
  w.world.travel('monksvale_j11', hermit.x, hermit.y);
  ok(meet(hermit, w.party, heard(w.world, hermit)).text.includes('Eleven, a gap, eleven'), 'the hermit at the summit counts the bells');

  // The herder at his fold, who loses his lambs to the eagles.
  const herder = person('A herder');
  w.world.travel('monksvale_j11', herder.x, herder.y);
  ok(meet(herder, w.party, heard(w.world, herder)).text.includes('eagles take them'), 'the herder at his fold loses his lambs to the eagles');
  see(w, 'monksvale_j11:j11_fold');

  // The monks' shrine by the road, its bell with no rope.
  const shrine = J11.features!.find((f): f is Extract<typeof f, { kind: 'shrine' }> => f.kind === 'shrine' && f.id === 'j11_shrine');
  ok(!!shrine && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => road(j11.x + shrine.x + dx, j11.y + shrine.y + dy)) && shrine.text.includes('no rope'), 'the monks\' shrine stands by the road, its bell on a post with no rope');

  // The box's groups, each won at its floor: the brothers on the road, the eagles over the hills and the
  // snow trolls on the summit's path, the box's group at 23.
  for (const g of J11.encounters!) fight(w, `monksvale_j11:${g.id}`);

  // The secret: the trodden line behind the wall, the search at the rock face where it ends and the
  // store cut into the mountain behind it. Walked, waded, climbed or floated, it is never reached but
  // through the rock.
  const [door] = J11.secrets!;
  const shut = (from: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[j11.x + from[0], j11.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === j11.x + door.x && y === j11.y + door.y) || !onJ11(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((j11.y + prize[1]) * out.width + j11.x + prize[0]) };
  };
  const store = shut([door.x + 1, door.y], [door.x - 2, door.y]);
  ok(store.size > 300 && !store.reached, `the store is shut but for the rock: none of J11's ${store.size} squares walked, waded, climbed or floated reaches it`);
  const walker = J11.features!.find((f) => f.kind === 'event' && f.id === 'j11_walker');
  ok(walker?.kind === 'event' && JSON.stringify(walker.when) === JSON.stringify({ hours: 'night' }), 'by night a brother walks the trodden line');
  see(w, 'monksvale_j11:j11_trodden');
  w.world.travel('monksvale_j11', door.x + 1, door.y, WEST);
  let opens = false;
  for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
  const inside = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opens && inside.every((r) => r.kind === 'moved') && w.world.used('j11_robes'), 'searched at the rock face where the line ends, the rock opens, and the store behind it can be walked into');
  listen(w);
  const cache = J11.features!.find((f) => f.kind === 'chest' && f.id === 'j11_store');
  ok(cache?.kind === 'chest' && cache.items.includes('guides_staff+1') && cache.gold === 400 && cache.x === door.x - 2 && cache.y === door.y, 'in the store, 400 gold and a second Guide\'s Staff +1');

  // I11, the Peak Stone's box (#501). Over the crest from J11's summit path at 0,10 onto I11's 31,10,
  // walked: three under the High Spine's floor the harsher words, two under its own, at the floor its
  // name and nothing more; straight back, nothing.
  const I11 = MAP_DEFS.find((d) => d.id === 'highspine_i11')!, i11 = out.zones.find((z) => z.id === 'highspine_i11')!;
  const SPINE = ATLAS.zones.find((z) => z.id === 'highspine')!;
  const crest = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('monksvale_j11', 0, 10, WEST);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const crestLow = crest(19), crestTwo = crest(20), crestDue = crest(22);
  ok(w.world.zone?.id === 'highspine_i11' && w.world.state.x === i11.x + 31 && w.world.state.y === i11.y + 10 && i11.x + i11.w === j11.x && i11.y === j11.y && I11.start.x === 30 && I11.start.y === 10,
    'over the crest from J11\'s 0,10 onto I11\'s 31,10, walked, the box\'s way in');
  ok(crestDue.join(' / ') === 'The High Spine.', `at 22, the High Spine named, no more (${crestDue.join(' / ')})`);
  ok(crestTwo.join(' / ') === `The High Spine. ${SPINE.crossing?.harder}`, `at 20, the rest in the crest's own words (${crestTwo.join(' / ')})`);
  ok(crestLow.join(' / ') === `The High Spine. ${SPINE.crossing?.warning}`, `at 19, the harsher words, and the way back open (${crestLow.join(' / ')})`);
  w.world.travel('highspine_i11', 31, 10, EAST);
  const crestBack = w.world.move('forward');
  ok(crestBack.kind === 'moved' && w.world.zone?.id === 'monksvale_j11' && crestBack.messages.length === 0, `straight back over the crest onto J11, nothing said (${crestBack.kind === 'moved' ? crestBack.messages.join(' / ') : crestBack.kind})`);
  listen(w);
  for (const m of w.party.members) m.level = 22;

  // The crest path to the ring and the Stone at the atlas's site, built; the ridge trail leaves north
  // beside it at 27,0, where the atlas's trail crosses, and past the edge, for now, the world ends.
  const onI11 = (x: number, y: number): boolean => x >= i11.x && x < i11.x + i11.w && y >= i11.y && y < i11.y + i11.h;
  const at = (f: { x: number; y: number }): number => (i11.y + f.y) * out.width + i11.x + f.x;
  const walked = reach(i11.x + 31, i11.y + 10, (x, y) => onI11(x, y) && out.passable(x, y) === 'ok');
  const peak = ATLAS.sites.find((s) => s.name === 'Peak Stone')!;
  const stone = I11.features!.find((f) => f.kind === 'event' && f.id === 'i11_stone')!;
  ok(i11.x + stone.x === Math.floor(peak.at[0]) && i11.y + stone.y === Math.floor(peak.at[1]) && !peak.planned && walked.has(at(stone)),
    'the Peak Stone stands at the atlas\'s site, 28,0, built, and the crest path reaches it from the crossing');
  ok(road(i11.x + 27, i11.y) && walked.has(at({ x: 27, y: 0 })) && road(i11.x + 27, i11.y - 1),
    'the ridge trail leaves north beside the Stone at 27,0, on into I10 (#502)');
  // The Stone, whole: stood at, it counts toward the Hearth, though nothing was wrong with it.
  const lit = stonesRestored(w.world.state, w.party);
  see(w, 'highspine_i11:i11_stone');
  ok(stone.kind === 'event' && stone.text.includes('Whole, and steady') && stonesRestored(w.world.state, w.party) === lit + 1, 'the Peak Stone is whole and steady, and stood at it counts toward the Hearth');
  // The brother who keeps it, the monks' shrine at its foot, and the cairn where the trail leaves.
  see(w, 'highspine_i11:i11_keeper');
  const foot = I11.features!.find((f) => f.kind === 'shrine' && f.id === 'i11_shrine');
  const cairn = I11.features!.find((f) => f.kind === 'cairn' && f.id === 'i11_cairn');
  ok(!!foot && Math.abs(foot.x - stone.x) + Math.abs(foot.y - stone.y) <= 2 && walked.has(at(foot)) && !!cairn && cairn.x === 27 && cairn.y === 1 && walked.has(at(cairn)),
    'the monks\' shrine at the Stone\'s foot, and the cairn under the trail\'s leaving');

  // The eagles' nest in the peaks above the Stone, up the spur off the crest path, the eagles at it, and
  // in it a Lantern's badge and a smooth grey part (#56's 46, #506's to hand in).
  see(w, 'highspine_i11:i11_shadow');
  see(w, 'highspine_i11:i11_nest');
  const nest = I11.features!.find((f) => f.kind === 'chest' && f.id === 'i11_nest_bones');
  const nesting = I11.encounters!.find((g) => g.id === 'i11_eagles_nest')!;
  ok(nest?.kind === 'chest' && nest.items.includes('lantern_badge') && nest.items.includes('grey_part') && walked.has(at(nest)) && Math.abs(nesting.x - nest.x) + Math.abs(nesting.y - nest.y) <= 2 && nesting.monsters.every((m) => m === 'spine_eagle'),
    'in the nest above the Stone, with the eagles at it, a Lantern\'s badge and a smooth grey part');

  // The lookout over Ashfall at the Sheer's top, Fire Mountain seen; Ashfall's ground at its foot is
  // reached by a climb down it and no other way.
  const lookout = I11.features!.find((f) => f.kind === 'event' && f.id === 'i11_lookout')!;
  ok(lookout.kind === 'event' && lookout.text.includes('Fire Mountain') && walked.has(at(lookout)) && out.at(i11.x + lookout.x - 1, i11.y + lookout.y).ch === '|', 'the lookout at the Sheer\'s top, Fire Mountain seen over Ashfall');
  see(w, 'highspine_i11:i11_lookout');
  const under = I11.features!.find((f) => f.kind === 'event' && f.id === 'i11_ash')!;
  ok(!walked.has(at(under)) && reach(i11.x + 31, i11.y + 10, (x, y) => onI11(x, y) && out.passable(x, y, { climb: true }) === 'ok').has(at(under)),
    'under the Sheer, Ashfall\'s grey pines are reached by a climb down it, and no other way');

  // The camp under the snow line, the pines below it and the snow above.
  const camp = I11.features!.find((f) => f.kind === 'camp' && f.name === 'The last pines');
  ok(!!camp && walked.has(at(camp)) && out.at(i11.x + camp.x, i11.y + camp.y).ch === 'p' && out.at(i11.x + camp.x + 2, i11.y + camp.y).ch === '*', 'the camp under the last pines, the snow above it');

  // The box's groups, each won at its floor: the eagles at the nest and over the snow line, the brothers
  // on the crest path and the snow trolls in the snow at the crest's foot, the box's group at 23.
  for (const g of I11.encounters!) fight(w, `highspine_i11:${g.id}`);

  // The secret: every stone of the ring frosted at its edge but one; searched, the slab lifts, and in
  // the hollow under it the Lanterns' survey marker, lit, and her instruments. Walked, waded, climbed or
  // floated, the hollow is never reached but through the slab.
  const [slab] = I11.secrets!;
  const sealed = new Set<number>(), todo = [[i11.x + slab.x, i11.y + slab.y - 1]];
  while (todo.length) {
    const [x, y] = todo.pop()!, k = y * out.width + x;
    if (sealed.has(k) || (x === i11.x + slab.x && y === i11.y + slab.y) || !onI11(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    sealed.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
  }
  const survey = I11.features!.find((f) => f.kind === 'chest' && f.id === 'i11_survey');
  ok(sealed.size > 300 && !!survey && !sealed.has(at(survey)), `the hollow is shut but for the slab: none of I11's ${sealed.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'highspine_i11:i11_frost');
  w.world.travel('highspine_i11', slab.x, slab.y - 1, SOUTH);
  let lifts = false;
  for (let i = 0; i < 20 && !lifts; i++) lifts = w.world.search();
  const down = lifts ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(lifts && down.every((r) => r.kind === 'moved') && w.world.used('i11_marker'), 'searched at the one slab with no frost, it lifts, and the hollow under it can be walked into');
  listen(w);
  ok(survey?.kind === 'chest' && survey.items.includes('lantern_instruments') && survey.gold === 300 && survey.x === slab.x && survey.y === slab.y + 2, 'in the hollow, the Lantern\'s instruments and 300 gold');

  // I10, Stairwatch and the Stair's head (#502). Up the ridge trail from I11's 27,0 onto I10's 27,31,
  // walked: the same land at the same floor, so nothing is said at any level, nor straight back.
  const I10 = MAP_DEFS.find((d) => d.id === 'highspine_i10')!, i10 = out.zones.find((z) => z.id === 'highspine_i10')!;
  const ridge = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('highspine_i11', 27, 0, NORTH);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const ridgeSaid = [ridge(19), ridge(20), ridge(22)];
  ok(w.world.zone?.id === 'highspine_i10' && w.world.state.x === i10.x + 27 && w.world.state.y === i10.y + 31 && i10.x === i11.x && i10.y + i10.h === i11.y && I10.start.x === 27,
    'up the ridge trail from I11\'s 27,0 onto I10\'s 27,31, walked, the box\'s way in');
  w.world.travel('highspine_i10', 27, 31, SOUTH);
  const ridgeBack = w.world.move('forward');
  ok(ridgeSaid.every((m) => !m.length) && ridgeBack.kind === 'moved' && !ridgeBack.messages.length && w.world.zone?.id === 'highspine_i11',
    `on the trail between I11 and I10 nothing is said either way, the same land at the same floor (${ridgeSaid.map((m) => m.join(' / ') || 'nothing').join('; ')})`);
  listen(w);
  for (const m of w.party.members) m.level = 22;

  // The trail on north to the edge at 18,0, where the atlas's trail crosses, on into I9 (#503); off it
  // west, the road to the Stair's head at the atlas's link, 272,306; and the Stair down through the
  // Sheer to the west edge at 0,20 and on down onto Ashfall's H10 at its 31,20 (#510), whose
  // walkthrough walks it.
  const onI10 = (x: number, y: number): boolean => x >= i10.x && x < i10.x + i10.w && y >= i10.y && y < i10.y + i10.h;
  const at10 = (f: { x: number; y: number }): number => (i10.y + f.y) * out.width + i10.x + f.x;
  const walked10 = reach(i10.x + 27, i10.y + 31, (x, y) => onI10(x, y) && out.passable(x, y) === 'ok');
  ok(road(i10.x + 18, i10.y) && walked10.has(at10({ x: 18, y: 0 })) && road(i10.x + 18, i10.y - 1),
    'the ridge trail leaves north at 18,0, on into I9 (#503)');
  const link = ATLAS.links.find((l) => l.note === 'the Giants\' Stair')!;
  ok(link.b?.[0] === i10.x + 8 && link.b?.[1] === i10.y + 20 && [...Array(16).keys()].every((i) => road(i10.x + 8 + i, i10.y + 20)),
    'the road leaves the trail west for the Stair\'s head, at the atlas\'s link, 272,306');
  ok(road(i10.x, i10.y + 20) && road(i10.x + 1, i10.y + 20) && out.at(i10.x, i10.y + 19).ch === '|' && out.at(i10.x + 1, i10.y + 21).ch === '|' && walked10.has(at10({ x: 0, y: 20 })) && road(i10.x - 1, i10.y + 20) && out.zones.find((z) => z.id === 'cindercoast_h10')?.x === i10.x - 32,
    'the Stair goes down through the Sheer to the west edge at 0,20, and on down onto Ashfall\'s H10 at its 31,20');

  // The caravan drawn up short of the head that cannot pay (#56's 47, #506's), past the Stair in snow:
  // the master by his wagons, and at the head his girl, whom the king keeps (The Toll, #506, `sideQuests`).
  const who10 = (name: string): Person => I10.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const [master, girl, champion] = [who10('A caravan-master'), who10('A girl'), who10('Edric, the old champion')];
  const king = I10.encounters!.find((g) => g.id === 'i10_king')!, stair = I10.encounters!.find((g) => g.id === 'i10_stair')!;
  w.world.travel('highspine_i10', master.x, master.y);
  ok(meet(master, w.party, heard(w.world, master)).text.includes('he has my girl') && master.x > stair.x && stair.x > 7 && walked10.has(at10(master)),
    'the caravan-master waits short of the head, past the Stair in snow, and the king has his girl');
  see(w, 'highspine_i10:i10_caravan');
  see(w, 'highspine_i10:i10_drift');
  w.world.travel('highspine_i10', girl.x, girl.y);
  ok(meet(girl, w.party, heard(w.world, girl)).text.includes('Only ever about the toll') && Math.abs(girl.x - king.x) + Math.abs(girl.y - king.y) > 1, 'his girl sits at the head, out of the road');
  // The head: the step's line, the toll-stone with the mark under its lip, the shrine older than the monks'.
  see(w, 'highspine_i10:i10_head');
  see(w, 'highspine_i10:i10_tollstone');
  const old = I10.features!.find((f) => f.kind === 'shrine' && f.id === 'i10_shrine');
  ok(!!old && walked10.has(at10(old)) && Math.abs(old.x - king.x) <= 5 && old.y >= 19 && old.y <= 21, 'the shrine older than the monks\' at the Stair\'s head');

  // The box's groups, each won at its floor: the eagles in the pines, and the Stair in snow, a giant who
  // sweeps the front row and a snow troll who mends unless burned (MONSTERS §8.1).
  ok(stair.monsters.includes('stair_giant') && stair.monsters.includes('snow_troll') && !!MONSTER_DEFS.stair_giant.sweep && !MONSTER_DEFS.stair_giant.sweep.element && !!MONSTER_DEFS.stair_king.sweep && !!MONSTER_DEFS.snow_troll.regen,
    'on the road short of the head a giant who sweeps the front row with his arm, and a troll who mends');
  fight(w, 'highspine_i10:i10_eagles');
  fight(w, 'highspine_i10:i10_stair');

  // The toll (#544): beside the king's group on the road it asks before it fights. Refused, it is the
  // fight, and asked again until then; won at 23, the king falls, and in the hollow under his seat, its
  // one mouth his square, the hoard.
  const parley = (v: Walk, label: string): string => {
    v.world.travel('highspine_i10', king.x + 2, king.y, WEST);
    const r = v.world.move('forward'), c = v.world.question(king.id), a = c?.answers.find((x) => x.label === label);
    v.ok(r.kind === 'moved' && r.asks === king.id && !r.encounter && !!a, `beside the king's group the toll is put before the fight, and '${label}' is an answer (${c?.ask ?? 'no question'})`);
    const said = a ? answer(a, v.party) : '';
    listen(v);
    return said;
  };
  w.level = 23;
  for (const m of w.party.members) m.level = 23;
  ok(parley(w, 'Refuse.').startsWith('He sighs') && !!w.world.question(king.id) && king.leader === 'stair_king' && king.monsters.filter((m) => m === 'stair_giant').length === 2 && MONSTER_DEFS.stair_giant.kind === 'person',
    'refused, the king and his two giants fight, people who break when he falls, and would ask again');
  fight(w, 'highspine_i10:i10_king');
  const hoard = I10.features!.find((f) => f.kind === 'chest' && f.id === 'i10_hoard');
  const hollow = new Set<number>(), dig = [[i10.x + 2, i10.y + 19]];
  while (dig.length) {
    const [x, y] = dig.pop()!, k = y * out.width + x;
    if (hollow.has(k) || (x === i10.x + king.x && y === i10.y + king.y) || !onI10(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    hollow.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) dig.push([x + dx, y + dy]);
  }
  ok(hoard?.kind === 'chest' && hoard.gold === 1200 && hoard.items.includes('bear_spear+1') && hollow.size === 2 && hollow.has(at10(hoard)),
    `under the seat the hoard, 1,200 gold and a Bear Spear +1, in a hollow of ${hollow.size} squares whose one mouth is the king's square`);
  see(w, 'highspine_i10:i10_hoard_seen');

  // Paid, in gold or in a part from the nest in place of gold, the giants stand aside and the company
  // walks down the Stair past them; short of the price, or with no part to give, the toll is barred.
  const TOLL = king.choice!;
  for (const how of ['Pay the toll.', 'Give him the grey part.']) {
    const v = newWalk(ok);
    v.level = 23;
    v.party.gold = 1499;
    const [gold, part] = [TOLL.answers.find((a) => a.label === 'Pay the toll.')!, TOLL.answers.find((a) => a.label === 'Give him the grey part.')!];
    v.ok(barred(gold, v.party) && answer(gold, v.party) === SHORT && barred(part, v.party) && answer(part, v.party) === NONE && !!TOLL.answers.find((a) => a.takes === 'faceless_coin'),
      'one short of the 1,500 gold, or with no grey part, the toll is barred; the faceless coin is taken too');
    if (how === 'Pay the toll.') v.party.gold = 1500; else v.party.bag.push('grey_part');
    const said = parley(v, how);
    const down = [v.world.move('forward'), v.world.move('forward'), v.world.move('forward')];
    v.ok(said.length > 0 && !v.world.question(king.id) && v.world.standsAside(king) && down.every((r) => r.kind === 'moved' && !r.encounter && !r.asks) && v.world.state.x === i10.x && v.world.state.y === i10.y + 20
      && (how === 'Pay the toll.' ? v.party.gold === 0 : !v.party.bag.includes('grey_part') && said.includes('before anyone came down the sky')),
      `'${how}': the giants stand aside, and the company walks down the Stair past them (${said.split('\n')[0]})`);
  }

  // Stairwatch (#448): smoke over the rock south of the head, where nothing stands, and a rope's wear
  // on one rock at the pines' edge; searched, the chimney behind it, climbed to the ledge at the
  // atlas's site and the old champion's fire. Walked, waded, climbed or floated, the ledge is never
  // reached but up the chimney.
  see(w, 'highspine_i10:i10_smoke');
  see(w, 'highspine_i10:i10_rope');
  const [chimney] = I10.secrets!;
  const ledge = I10.features!.find((f) => f.kind === 'event' && f.id === 'i10_ledge')!;
  const watch = ATLAS.sites.find((s) => s.name === 'Stairwatch')!;
  const sealedLedge = new Set<number>(), go = [[i10.x + chimney.x, i10.y + chimney.y - 1]];
  while (go.length) {
    const [x, y] = go.pop()!, k = y * out.width + x;
    if (sealedLedge.has(k) || (x === i10.x + chimney.x && y === i10.y + chimney.y) || !onI10(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    sealedLedge.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) go.push([x + dx, y + dy]);
  }
  ok(sealedLedge.size > 500 && !sealedLedge.has(at10(ledge)) && i10.x + ledge.x === watch.at[0] && i10.y + ledge.y === watch.at[1] && !watch.planned,
    `the ledge at the atlas's Stairwatch is shut but for the chimney: none of I10's ${sealedLedge.size} squares walked, waded, climbed or floated reaches it`);
  w.world.travel('highspine_i10', chimney.x, chimney.y - 1, SOUTH);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const up = found ? [w.world.move('forward'), w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && up.every((r) => r.kind === 'moved') && w.world.used('i10_ledge'), 'searched at the worn rock, the chimney is found, and climbed to the ledge over the Stair');
  w.world.travel('highspine_i10', champion.x, champion.y);
  ok(meet(champion, w.party, heard(w.world, champion)).text.includes('Forty years') && Math.abs(champion.x - ledge.x) + Math.abs(champion.y - ledge.y) === 1, 'the old champion keeps his watch on the ledge');
  listen(w);

  // The drovers' fire back in the pines.
  const fire = I10.features!.find((f) => f.kind === 'camp' && f.name === 'The drovers\' fire');
  ok(!!fire && walked10.has(at10(fire)) && out.at(i10.x + fire.x, i10.y + fire.y).ch === 'p', 'the drovers\' fire, back in the pines');

  // I9, the ridge north (#503), Sheer Point's first box. North along the ridge trail from I10's 18,0
  // onto I9's 18,31, walked: the same floor, but a new land, so three under it the harsher words, two
  // under its own, at the floor its name and nothing more; straight back, nothing. Coming back south
  // later, the High Spine named in words that say nothing of a crest crossed or a vale behind.
  const I9 = MAP_DEFS.find((d) => d.id === 'sheerpoint_i9')!, i9 = out.zones.find((z) => z.id === 'sheerpoint_i9')!;
  const POINT = ATLAS.zones.find((z) => z.id === 'sheerpoint')!;
  const north = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('highspine_i10', 18, 0, NORTH);
    const r = w.world.move('forward');
    // The crossing line is the step's first entry; the eagles coming down over the pines may follow it.
    return r.kind === 'moved' ? r.messages.slice(0, 1) : [r.kind];
  };
  const northLow = north(19), northTwo = north(20), northDue = north(22);
  ok(w.world.zone?.id === 'sheerpoint_i9' && w.world.state.x === i9.x + 18 && w.world.state.y === i9.y + 31 && i9.x === i10.x && i9.y + i9.h === i10.y && I9.start.x === 18 && I9.start.y === 31 && I9.band?.[0] === I10.band?.[0],
    'north along the ridge trail from I10\'s 18,0 onto I9\'s 18,31, walked, the box\'s way in, at I10\'s floor');
  ok(northDue.join(' / ') === 'Sheer Point.', `at 22, Sheer Point named, no more (${northDue.join(' / ')})`);
  ok(northTwo.join(' / ') === `Sheer Point. ${POINT.crossing?.harder}`, `at 20, the rest in the Point's own words (${northTwo.join(' / ')})`);
  ok(northLow.join(' / ') === `Sheer Point. ${POINT.crossing?.warning}`, `at 19, the harsher words, and the way back open (${northLow.join(' / ')})`);
  w.world.travel('sheerpoint_i9', 18, 31, SOUTH);
  const northBack = w.world.move('forward');
  ok(northBack.kind === 'moved' && w.world.zone?.id === 'highspine_i10' && !northBack.messages.length, `straight back onto I10, nothing said (${northBack.kind === 'moved' ? northBack.messages.join(' / ') : northBack.kind})`);
  for (const m of w.party.members) m.level = 20;
  w.world.travel('highspine_i11', 27, 0, NORTH);
  w.world.move('forward');
  w.world.travel('sheerpoint_i9', 18, 31, SOUTH);
  const south = w.world.move('forward');
  const southSaid = south.kind === 'moved' ? south.messages.join(' / ') : south.kind;
  ok(southSaid === `The High Spine. ${SPINE.crossing?.harder}` && !/over the crest|vale/i.test(`${SPINE.crossing?.harder} ${SPINE.crossing?.warning}`),
    `south along the ridge from the Point into I10 later, the High Spine named in words true of either way in (${southSaid})`);
  listen(w);
  w.level = 22;
  for (const m of w.party.members) m.level = 22;

  // The ridge trail square to square from the way in at 18,31 to the north edge at 20,0, where the
  // atlas's trail crosses, and on into I8 (#504); the pines open across the south edge into I10's.
  const onI9 = (x: number, y: number): boolean => x >= i9.x && x < i9.x + i9.w && y >= i9.y && y < i9.y + i9.h;
  const at9 = (f: { x: number; y: number }): number => (i9.y + f.y) * out.width + i9.x + f.x;
  const trail9 = reach(i9.x + 18, i9.y + 31, (x, y) => onI9(x, y) && road(x, y));
  const walked9 = reach(i9.x + 18, i9.y + 31, (x, y) => onI9(x, y) && out.passable(x, y) === 'ok');
  ok(trail9.has(at9({ x: 20, y: 0 })) && road(i9.x + 20, i9.y) && road(i9.x + 20, i9.y - 1) && out.passable(i9.x + 20, i9.y - 1) === 'ok',
    'the ridge trail runs square to square from 18,31 to the north edge at 20,0, and on into I8');
  ok([...Array(17).keys()].every((i) => out.at(i9.x + 1 + i, i9.y + 31).ch === 'p' && out.passable(i9.x + 1 + i, i9.y + 32) === 'ok'), 'the pines run on across the south edge into I10\'s');

  // Up the trail the wind off the sea warm over the crest, the giants' cairn, the snow gone off the
  // rocks, the masons' sledge, and at the end the Hearth over the sea, its heat on the face, and the
  // causeway running out to it; beside the trail the cairns to steer by in cloud.
  const ev9 = (id: string): { x: number; y: number } => I9.features!.find((f) => f.kind === 'event' && f.id === id)!;
  const upTrail = ['i9_wind', 'i9_giants', 'i9_thaw', 'i9_sledge', 'i9_hearth', 'i9_causeway'];
  ok(upTrail.every((id) => trail9.has(at9(ev9(id)))) && upTrail.every((id, i) => i === 0 || ev9(id).y < ev9(upTrail[i - 1]).y),
    'on the trail north, in order: the warm wind, the giants\' cairn, the snow gone off the rocks, the sledge, the Hearth and the causeway');
  for (const id of upTrail) see(w, `sheerpoint_i9:${id}`);
  const cairn9 = I9.features!.find((f) => f.kind === 'cairn' && f.id === 'i9_cairn');
  ok(cairn9?.kind === 'cairn' && cairn9.items.includes('potion_sp_great') && walked9.has(at9(cairn9)) && trail9.has(at9({ x: cairn9.x - 1, y: cairn9.y })),
    'a cairn beside the trail to steer by in cloud, a Sapphire Vial in it');

  // The box's groups, each won at its floor: the eagles over the pines by the way in, the snow trolls
  // lying in the gully where the snow is trodden to ice, and on the trail's end the Ashen masons, the
  // Hand's people, who never break.
  const masons = I9.encounters!.find((g) => g.id === 'i9_masons')!;
  ok(MONSTER_DEFS.ashen_mason.kind === 'person' && !!MONSTER_DEFS.ashen_mason.steady && masons.monsters.every((m) => m === 'ashen_mason') && trail9.has(at9(masons)) && masons.y < ev9('i9_sledge').y,
    'on the trail\'s end, past their sledge, the Ashen masons, people who never break');
  see(w, 'sheerpoint_i9:i9_trodden');
  fight(w, 'sheerpoint_i9:i9_eagles');
  fight(w, 'sheerpoint_i9:i9_trolls');
  fight(w, 'sheerpoint_i9:i9_masons');

  // The first masons' camp on its shelf off the trail, abandoned, and their tally cut in the rock face,
  // its last row running into a crack; searched, the crack opens on their cache: the shards they set by
  // in the straw, seen and not carried off, and what else they kept. Walked, waded, climbed or floated,
  // the cache is never reached but through the crack.
  see(w, 'sheerpoint_i9:i9_masons_camp');
  see(w, 'sheerpoint_i9:i9_tally');
  const [crack] = I9.secrets!;
  const cache9 = I9.features!.find((f) => f.kind === 'chest' && f.id === 'i9_cache');
  const sealed9 = new Set<number>(), go9 = [[i9.x + 18, i9.y + 31]];
  while (go9.length) {
    const [x, y] = go9.pop()!, k = y * out.width + x;
    if (sealed9.has(k) || (x === i9.x + crack.x && y === i9.y + crack.y) || !onI9(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    sealed9.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) go9.push([x + dx, y + dy]);
  }
  ok(cache9?.kind === 'chest' && sealed9.size > 400 && !sealed9.has(at9(cache9)) && crack.hint === 'i9_tally' && Math.abs(ev9('i9_tally').x - crack.x) + Math.abs(ev9('i9_tally').y - crack.y) === 1,
    `the cache is shut but for the crack beside the tally: none of I9's ${sealed9.size} squares walked, waded, climbed or floated reaches it`);
  w.world.travel('sheerpoint_i9', crack.x + 1, crack.y, WEST);
  let found9 = false;
  for (let i = 0; i < 20 && !found9; i++) found9 = w.world.search();
  const into = found9 ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found9 && into.every((r) => r.kind === 'moved') && w.world.used('i9_shards'), 'searched at the tally, the crack is found, and in the cache shards of every colour in the straw');
  ok(cache9?.kind === 'chest' && cache9.gold === 500 && cache9.items.length === 1 && cache9.items.includes('hunters_bow+1'),
    'and in the cache 500 gold and a Hunter\'s Bow +1, and no shard to carry off: the act has no Rift to take one to');
  listen(w);

  // West of the crest: the pines stopping at the sea with steam on it, the hermit under the peaks who
  // watches the Hand's boats go round the Point, the warm hollow, the eagles' kill, the Sheer's edge
  // and the lamp kept burning at it, and the camp in the crest's lee.
  for (const id of ['i9_shore', 'i9_hollow', 'i9_kill', 'i9_sheer']) see(w, `sheerpoint_i9:${id}`);
  const hermit9 = I9.features!.find((f) => f.kind === 'npc' && f.name === 'A hermit') as Person;
  w.world.travel('sheerpoint_i9', hermit9.x, hermit9.y);
  ok(meet(hermit9, w.party, heard(w.world, hermit9)).text.includes('round the Point') && walked9.has(at9(hermit9)), 'the hermit under the peaks, who watches the Hand\'s boats go round the Point');
  const lamp = I9.features!.find((f) => f.kind === 'shrine' && f.id === 'i9_shrine');
  ok(!!lamp && walked9.has(at9(lamp)) && out.at(i9.x + lamp.x - 1, i9.y + lamp.y).ch === '|', 'the lamp in the stone at the Sheer\'s edge');
  const lee = I9.features!.find((f) => f.kind === 'camp' && f.name === 'The lee of the crest');
  ok(!!lee && walked9.has(at9(lee)) && out.at(i9.x + lee.x, i9.y + lee.y).ch === 'p', 'the camp in the crest\'s lee, in the pines');

  // I8, Sheer Point (#504), the Point's tip. On up the ridge trail from I9's 20,0 onto I8's 20,31,
  // walked: the same land at the same floor, so nothing is said at any level, nor straight back.
  const I8 = MAP_DEFS.find((d) => d.id === 'sheerpoint_i8')!, i8 = out.zones.find((z) => z.id === 'sheerpoint_i8')!;
  const onTo8 = (level: number) => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('sheerpoint_i9', 20, 0, NORTH);
    return w.world.move('forward');
  };
  const tipLow = onTo8(19), tip = onTo8(22);
  ok(tip.kind === 'moved' && w.world.zone?.id === 'sheerpoint_i8' && w.world.state.x === i8.x + 20 && w.world.state.y === i8.y + 31 && i8.x === i9.x && i8.y + i8.h === i9.y && I8.start.x === 20 && I8.start.y === 31 && I8.band?.[0] === I9.band?.[0],
    'on up the ridge trail from I9\'s 20,0 onto I8\'s 20,31, walked, the box\'s way in, at I9\'s floor');
  w.world.travel('sheerpoint_i8', 20, 31, SOUTH);
  const tipBack = w.world.move('forward');
  ok([tipLow, tip, tipBack].every((r) => r.kind === 'moved' && !r.messages.length) && w.world.zone?.id === 'sheerpoint_i9',
    `the same land at the same floor: nothing said onto the Point at 19 or 22, nor straight back (${[tipLow, tip, tipBack].map((r) => (r.kind === 'moved' ? r.messages.join(' / ') : r.kind)).join('; ')})`);
  listen(w);

  // The trail square to square from the way in to its end at the atlas's 286,236, the rock warm under
  // it; from the end the masons' track down through the rock to the tip, and the tip's shores. The sea
  // on the north and west and unbuilt J8 on the east end the world.
  const onI8 = (x: number, y: number): boolean => x >= i8.x && x < i8.x + i8.w && y >= i8.y && y < i8.y + i8.h;
  const at8 = (f: { x: number; y: number }): number => (i8.y + f.y) * out.width + i8.x + f.x;
  const trail8 = reach(i8.x + 20, i8.y + 31, (x, y) => onI8(x, y) && road(x, y));
  const walked8 = reach(i8.x + 20, i8.y + 31, (x, y) => onI8(x, y) && out.passable(x, y) === 'ok');
  const ev8 = (id: string): { x: number; y: number } => I8.features!.find((f) => f.kind === 'event' && f.id === id)!;
  ok(trail8.has(at8({ x: 22, y: 14 })) && i8.x + 22 === 286 && i8.y + 14 === 236 && [21, 23].every((x) => !road(i8.x + x, i8.y + 13)) && !road(i8.x + 22, i8.y + 13),
    'the ridge trail runs square to square from 20,31 to its end at 22,14, the atlas\'s 286,236');
  ok(trail8.has(at8(ev8('i8_warm'))) && ev8('i8_trail_end').x === 22 && ev8('i8_trail_end').y === 14, 'on the trail the rock warm under it, and at its end the Point below');
  for (const id of ['i8_warm', 'i8_trail_end']) see(w, `sheerpoint_i8:${id}`);
  ok(walked8.has(at8({ x: 17, y: 6 })) && walked8.has(at8({ x: 26, y: 3 })) && walked8.has(at8({ x: 31, y: 30 })) && walked8.has(at8({ x: 6, y: 31 }))
    && [...Array(32).keys()].every((i) => [[i8.x + i, i8.y - 1], [i8.x - 1, i8.y + i], [i8.x + 32, i8.y + i]].every(([x, y]) => out.passable(x, y) !== 'ok')),
    'from the trail\'s end the track goes down to the shore, the tip is walked to its last rock and down the pines on both sides, and past the north, west and east edges the world ends');

  // The causeway: cut stone a square wide from the shore at 17,6 out over the water to 17,1, where it
  // stops over deep water short of the north edge; the first stone, the step's line; one stone carved
  // apart from the rest; at its root the masons' tally-house.
  const water = (x: number, y: number): boolean => ['W', '~'].includes(out.at(i8.x + x, i8.y + y).ch);
  ok([1, 2, 3, 4, 5, 6].every((y) => out.at(i8.x + 17, i8.y + y).ch === '"' && water(16, y)) && [1, 2, 3, 4, 5].every((y) => water(18, y)) && out.at(i8.x + 17, i8.y).ch === 'W' && walked8.has(at8({ x: 17, y: 1 })),
    'the causeway runs a square wide from the shore at 17,6 out over the water to 17,1, and stops over deep water');
  ok(ev8('i8_causeway').x === 17 && ev8('i8_causeway').y === 6 && I8.features!.some((f) => f.kind === 'event' && f.id === 'i8_causeway' && f.text.endsWith('the way the shards do.')),
    'its first stone glows a little, the way the shards do');
  for (const id of ['i8_causeway', 'i8_lid', 'i8_end', 'i8_tallyhouse']) see(w, `sheerpoint_i8:${id}`);

  // The box's groups, each won at its floor: the eagles over the tip at the track's foot, the masons at
  // the causeway's root, and on its end the second group with their foreman, the box's hardest, who
  // stand at their work; by night a snow troll come down to the shore. The Hand never breaks.
  const g8 = (id: string) => I8.encounters!.find((g) => g.id === id)!;
  const [masons8, foreman8, troll8] = ['i8_masons', 'i8_foreman', 'i8_troll'].map(g8);
  ok(masons8.x === 17 && masons8.y === 7 && foreman8.x === 17 && foreman8.y === 2 && foreman8.monsters.length > masons8.monsters.length && [...masons8.monsters, ...foreman8.monsters].every((m) => m === 'ashen_mason')
    && foreman8.leader === 'ashen_mason' && foreman8.roams === false && !!MONSTER_DEFS.ashen_mason.steady,
    'the masons at the causeway\'s root, and on its end more of them with their foreman, at work, who never break');
  ok(troll8.monsters.join() === 'snow_troll' && JSON.stringify(troll8.when) === JSON.stringify({ hours: 'night' }) && walked8.has(at8(troll8)) && water(troll8.x + 1, troll8.y), 'by night a snow troll come down to the shore');
  for (const id of ['i8_eagles', 'i8_masons', 'i8_foreman', 'i8_troll']) fight(w, `sheerpoint_i8:${id}`);

  // Wenna, a person who moves (#76; §9's 2), as Rimewater's walk leaves her, spoken at the lodge after
  // the bay: by the lodge's fire until the company comes into the range, then by Highcell's gate until
  // it reaches the Point, then at the camp on the shingle; never two at once, nor before the lodge.
  const LODGE = MAP_DEFS.find((d) => d.id === 'rime_lodge')!;
  const wenna = (d: MapDef): Person => d.features!.find((f) => f.kind === 'npc' && f.name === 'The girl out of the hole') as Person;
  const byLodge = wenna(LODGE), byGate = wenna(J11), byCamp = wenna(I8);
  const v = newWalk(ok);
  const where = (): string => [byLodge, byGate, byCamp].map((p) => (v.world.present(p) ? 1 : 0)).join('');
  const unmet = where();
  v.party.flags[WENNA_LODGE] = 1;
  const lodged = where();
  v.world.travel('monksvale_j11', GATE.x, GATE.y - 1, NORTH);
  const gated = where();
  v.world.travel('sheerpoint_i8', byCamp.x + 1, byCamp.y, WEST);
  const camped = where();
  ok(unmet === '000' && lodged === '100' && gated === '010' && camped === '001' && Math.abs(byGate.x - GATE.x) + Math.abs(byGate.y - (GATE.y - 1)) === 1,
    `Wenna by the lodge's fire, then by Highcell's gate beside its front, then at the Point's camp, one at a time (${[unmet, lodged, gated, camped].join(' ')})`);
  const camp8 = I8.features!.find((f) => f.kind === 'camp' && f.name === 'The shingle fire');
  ok(!!camp8 && walked8.has(at8(camp8)) && Math.abs(camp8.x - byCamp.x) + Math.abs(camp8.y - byCamp.y) === 1 && water(byCamp.x, byCamp.y - 1),
    'the camp on the shingle, Wenna beside it');
  // The night: she puts it, and slept, she is gone; one of the company shouting, the boat going out
  // along the stones from nowhere seen, and her knot on the first stone. Never before she is met.
  const knot = I8.features!.find((f) => f.kind === 'event' && f.id === 'i8_knot')!;
  const unslept = !v.party.flags[WENNA_TAKEN] && !v.world.present(knot);
  const met = meet(byCamp, v.party, heard(v.world, byCamp));
  const sleep = met.choice?.answers.find((a) => a.label === 'Sleep');
  const woke = sleep ? answer(sleep, v.party) : '';
  ok(unslept && met.text.includes('Sleep. I\'ll keep the first watch.') && woke.includes('Her blanket by the fire is cold.') && woke.includes('none of you saw where it put out from')
    && !!v.party.flags[WENNA_TAKEN] && !v.world.present(byCamp) && v.world.present(knot),
    'met at the camp, she keeps the first watch; slept, she is gone, a boat going out along the stones, and the flag is set');
  v.world.travel('sheerpoint_i8', knot.x, knot.y);
  ok(v.world.eventsHere().includes('Scratched fresh, at the height of a girl\'s shoulder, a loop inside a loop.'), 'and on the first stone her knot, scratched fresh');

  // Rook's Nest (#448) at the atlas's site, a hollow high in the tip's rock over the causeway, and the
  // watcher in it, Hereward, who teaches the Thief's third (`thirdPrestiges`).
  const [nx, ny] = ATLAS.sites.find((s) => s.name === 'Rook\'s Nest')!.at;
  const watcher = I8.features!.find((f) => f.kind === 'npc' && f.name === 'Hereward, the watcher') as Person;
  ok(ev8('i8_nest').x + i8.x === nx && ev8('i8_nest').y + i8.y === ny && !ATLAS.sites.find((s) => s.name === 'Rook\'s Nest')!.planned && walked8.has(at8(ev8('i8_nest'))),
    'Rook\'s Nest at the atlas\'s site, 22,8, built');
  see(w, 'sheerpoint_i8:i8_nest');
  w.world.travel('sheerpoint_i8', watcher.x + 1, watcher.y, WEST);
  ok(meet(watcher, w.party, heard(w.world, watcher)).text.includes('They never once look up.'), 'the watcher in the hollow counts the stones');

  // The secret: at the hollow's back the rock is wet and smells of the sea, and by night oars are heard
  // under it; searched, it gives on the Hand's sea cave, its water running out under the rock beside
  // the stones: the boats, the crates under the Hand's seal with shards not yet cut, seen and never
  // carried, and the takings. Walked, waded, climbed or floated, it is never reached but from the nest.
  const [door8] = I8.secrets!;
  const oars = I8.features!.find((f) => f.kind === 'event' && f.id === 'i8_oars');
  ok(door8.hint === 'i8_damp' && ev8('i8_damp').x === door8.x && ev8('i8_damp').y === door8.y + 1 && oars?.kind === 'event' && oars.x === door8.x && oars.y === door8.y + 1 && JSON.stringify(oars.when) === JSON.stringify({ hours: 'night' }),
    'at the back of the nest the rock is wet, and by night oars are heard under it');
  const hold8 = I8.features!.find((f) => f.kind === 'chest' && f.id === 'i8_hold');
  const sealed8 = new Set<number>(), go8 = [[i8.x + 20, i8.y + 31]];
  while (go8.length) {
    const [x, y] = go8.pop()!, k = y * out.width + x;
    if (sealed8.has(k) || (x === i8.x + door8.x && y === i8.y + door8.y) || !onI8(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    sealed8.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) go8.push([x + dx, y + dy]);
  }
  ok(!!hold8 && sealed8.size > 300 && ['i8_boats', 'i8_crates'].every((id) => !sealed8.has(at8(ev8(id)))) && !sealed8.has(at8(hold8)),
    `the sea cave is shut but for the nest's back: none of I8's ${sealed8.size} squares walked, waded, climbed or floated reaches it`);
  w.world.travel('sheerpoint_i8', door8.x, door8.y + 1, NORTH);
  let found8 = false;
  for (let i = 0; i < 20 && !found8; i++) found8 = w.world.search();
  const downIn = found8 ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found8 && downIn.every((r) => r.kind === 'moved') && w.world.state.y === i8.y + door8.y - 1, 'searched at the wet rock, the way down is found, into the cave');
  for (const id of ['i8_crates', 'i8_boats']) see(w, `sheerpoint_i8:${id}`);
  ok(hold8?.kind === 'chest' && hold8.gold === 400 && !hold8.items.length && water(ev8('i8_boats').x, ev8('i8_boats').y - 1),
    'in the cave the Hand\'s boats on the water running out under the rock, and 400 gold; no shard to carry off, the act having no Rift to take one to');

  // The tip's east side: the cairn on its last rock, the drowned god's shrine with its bowl of shells,
  // the troll's leavings and, down the pines, the mason who deserted, in the rocks with his tally
  // (#56's 48, #506's to make the quest). And on the west, the boat's ribs and the pines in the sea.
  const cairn8 = I8.features!.find((f) => f.kind === 'cairn' && f.id === 'i8_cairn');
  ok(cairn8?.kind === 'cairn' && cairn8.items.includes('potion_sp_great') && walked8.has(at8(cairn8)) && [...Array(cairn8.y).keys()].every((y) => [...Array(32).keys()].every((x) => x === 17 || !walked8.has(at8({ x, y })))),
    'a cairn on the last rock of the Point, a Sapphire Vial in it');
  const shrine8 = I8.features!.find((f) => f.kind === 'shrine' && f.id === 'i8_shrine');
  ok(shrine8?.kind === 'shrine' && shrine8.text.includes('heaped with shells') && walked8.has(at8(shrine8)) && water(shrine8.x + 1, shrine8.y), 'the drowned god\'s shrine at the tide\'s edge, its bowl heaped with shells');
  const deserter = I8.features!.find((f) => f.kind === 'npc' && f.name === 'A deserter') as Person;
  w.world.travel('sheerpoint_i8', deserter.x, deserter.y - 1, SOUTH);
  ok(meet(deserter, w.party, heard(w.world, deserter)).text.includes('Eleven more and the road reaches the isle.') && walked8.has(at8(deserter)) && out.at(i8.x + deserter.x, i8.y + deserter.y + 1).ch === 'r',
    'the deserter in the rocks at the end of the pines, who will not set the last stones');
  for (const id of ['i8_tally', 'i8_hammer', 'i8_bones', 'i8_wreck', 'i8_pines']) see(w, `sheerpoint_i8:${id}`);
  listen(w);
  spineBehind(w, ok);
  theBells(ok);
  sideQuests(ok);
  thirdPrestiges(ok);
};

/**
 * The country behind the road (#508). The giants' ground (J10): in over the pass on its road, walked
 * above, nothing taken out of it; the saddle and the vale below; the giants' fire on the slope over
 * I10's trail, kept with nobody at it, and their own with its seats, their prints, their felled pines
 * and the bark rubbed off at their height; the goatherd, who says they ask nothing off the Stair; the
 * giants at their fire, the box's one fight, asking no toll; and behind the rock where the old coins lie
 * in the snow, their cauldron of the toll. The Spine's south (I12): south from I11's pines, walked, the
 * land not named again; the pines along the Sheer, the eagles' nest and the rim, and under the Sheer the
 * ash and the burst pack; the charcoal-burner, who knows where the trolls lie up; the trolls, the box's
 * one fight; and the cleft behind the rock where the old tracks stop. The vale's end (J12): south from
 * J11's hills, walked, the land not named again; the vale run out under the peaks, the bell under the
 * snow, the drop, the eagles, the trolls' bowl and the pilgrim; the trolls, the box's one fight; and the
 * cell behind the bell-rope. Walked, waded, climbed or floated, no prize is reached but through its door.
 */
function spineBehind(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const out = buildMaps()[OUTDOORS];
  const [J10, I12, J12] = ['monksvale_j10', 'highspine_i12', 'monksvale_j12'].map(mapOf);
  const [j10, i11, i12, j11, j12] = [J10.id, 'highspine_i11', I12.id, 'monksvale_j11', J12.id].map((id) => out.zones.find((z) => z.id === id)!);
  const said = (r: ReturnType<typeof w.world.move>): string => (r.kind === 'moved' ? r.messages.join(' / ') || 'nothing said' : r.kind);
  const shut = (z: typeof j10, from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === z.x + door[0] && y === z.y + door[1]) || x < z.x || x >= z.x + z.w || y < z.y || y >= z.y + z.h
        || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((z.y + prize[1]) * out.width + z.x + prize[0]) };
  };
  const search = (map: string, x: number, y: number, facing: Facing, room: string): boolean => {
    w.world.travel(map, x, y, facing);
    let found = false;
    for (let i = 0; i < 20 && !found; i++) found = w.world.search();
    const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
    listen(w);
    return found && into.every((r) => r.kind === 'moved') && w.world.used(room);
  };
  const npc = (def: MapDef, name: string): Person => def.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const chest = (def: MapDef, id: string) => def.features!.find((f) => f.kind === 'chest' && f.id === id);
  w.level = 22;
  for (const m of w.party.members) m.level = 22;

  // The giants' ground: in over the pass on its road at the east edge, walked (above), and nothing
  // taken out of it; the saddle, and below it the vale.
  ok(J10.start.x === 31 && J10.start.y === 19 && J10.start.facing === WEST && !(J10.exits ?? []).length && j10.x + j10.w === out.zones.find((z) => z.id === 'coldmere_k10')!.x,
    'the giants\' ground starts on the road at its east edge, where the pass comes over, and nothing is taken out of it');
  for (const id of ['j10_saddle', 'j10_vale']) see(w, `${J10.id}:${id}`);

  // Their fire on the slope over I10's trail, the one seen from it, kept with nobody at it; their own
  // with its seats; their prints, the pines they snapped off and the bark rubbed off at their height.
  const fire = J10.features!.find((f) => f.kind === 'event' && f.id === 'j10_fire'), seen = mapOf('highspine_i10').features!.find((f) => f.kind === 'event' && f.id === 'i10_fires');
  ok(fire?.kind === 'event' && seen?.kind === 'event' && fire.y === seen.y && fire.text.includes('Nobody sits at it') && seen.text.includes('Nobody sits at it'),
    'the fire on the slope east of I10\'s trail is J10\'s, up the slope on the same row, and nobody sits at it');
  for (const id of ['j10_fire', 'j10_seats', 'j10_tracks', 'j10_felled', 'j10_rubbed', 'j10_goat', 'j10_loch']) see(w, `${J10.id}:${id}`);
  listen(w);

  // The goatherd who grazes their ground, who says they ask nothing off the Stair.
  const goatherd = npc(J10, 'A goatherd');
  w.world.travel(J10.id, goatherd.x, goatherd.y);
  ok(meet(goatherd, w.party, heard(w.world, goatherd)).text.includes('Off the Stair they ask nothing'), 'the goatherd grazes the giants\' ground, and off the Stair they ask nothing of anybody');
  listen(w);

  // The box's one group, won at its floor: the giants at their own fire, who ask no toll, without
  // their king, who is the Stair's and is never met again.
  ok(J10.encounters!.length === 1 && J10.encounters!.every((g) => !g.choice && !g.leader && !g.monsters.includes('stair_king') && g.monsters.every((m) => m === 'stair_giant')),
    'two giants at their fire, the box\'s one group, who ask no toll and have no king with them');
  for (const g of J10.encounters!) fight(w, `${J10.id}:${g.id}`);

  // The secret: old coins in the snow at the foot of the rock, and the search there; behind it the
  // giants' cauldron of the toll, the coins at its bottom without faces.
  const cauldron = shut(j10, [13, 16], [12, 16], [10, 16]);
  ok(cauldron.size > 600 && !cauldron.reached, `the cauldron is shut but for the rock: none of J10's ${cauldron.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${J10.id}:j10_coins`);
  ok(search(J10.id, 13, 16, WEST, 'j10_cave'), 'searched where the coins lie, the rock gives, and the cave behind it can be walked into');
  const tolls = chest(J10, 'j10_tolls');
  ok(tolls?.kind === 'chest' && tolls.gold === 1400 && tolls.x === 10 && tolls.y === 16, 'in the cave, the giants\' cauldron of the toll');

  // The Spine's south: south from I11's pines onto I12's 18,0, walked, in the High Spine still, so the
  // land is not named again.
  w.world.travel('highspine_i11', 18, 31, SOUTH);
  const south = w.world.move('forward');
  ok(south.kind === 'moved' && w.world.zone?.id === I12.id && w.world.state.x === i12.x + 18 && w.world.state.y === i12.y && i11.y + i11.h === i12.y
    && !south.messages.some((m) => m.includes('The High Spine.')), `south from I11's 18,31 onto I12's 18,0 under the pines, walked, and the land not named again (${said(south)})`);
  listen(w);
  ok(I12.start.x === 18 && I12.start.y === 0 && I12.start.facing === SOUTH && !(I12.exits ?? []).length, 'the Spine\'s south starts at its north edge under the pines, and nothing is taken out of it');
  for (const id of ['i12_south', 'i12_edge', 'i12_eyrie', 'i12_rim', 'i12_stripped', 'i12_under', 'i12_pack']) see(w, `${I12.id}:${id}`);
  const burner = npc(I12, 'A charcoal-burner');
  w.world.travel(I12.id, burner.x, burner.y);
  ok(meet(burner, w.party, heard(w.world, burner)).text.includes('where the pines stop'), 'the charcoal-burner at his clamp knows where the trolls lie up');
  listen(w);
  for (const g of I12.encounters!) fight(w, `${I12.id}:${g.id}`);
  const cleft = shut(i12, [17, 19], [17, 20], [17, 22]);
  ok(cleft.size > 600 && !cleft.reached, `the cleft is shut but for the rock: none of I12's ${cleft.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${I12.id}:i12_tracks`);
  ok(search(I12.id, 17, 19, SOUTH, 'i12_cleft'), 'searched where the old tracks stop at the rock, it gives, and the cleft behind it can be walked into');
  const packs = chest(I12, 'i12_packs');
  ok(packs?.kind === 'chest' && packs.gold === 1400 && packs.x === 17 && packs.y === 22, 'in the cleft, the strongbox nobody came back for');

  // The vale's end: south from J11's hills onto J12's 25,0, walked, in Monks' Vale still, so the land
  // is not named again.
  w.world.travel('monksvale_j11', 25, 31, SOUTH);
  const end = w.world.move('forward');
  ok(end.kind === 'moved' && w.world.zone?.id === J12.id && w.world.state.x === j12.x + 25 && w.world.state.y === j12.y && j11.y + j11.h === j12.y
    && !end.messages.some((m) => m.includes(VALE.name)), `south from J11's 25,31 onto J12's 25,0 over the hills, walked, and the land not named again (${said(end)})`);
  listen(w);
  ok(J12.start.x === 25 && J12.start.y === 0 && J12.start.facing === SOUTH && !(J12.exits ?? []).length, 'the vale\'s end starts at its north edge in the hills, and nothing is taken out of it');
  for (const id of ['j12_end', 'j12_under', 'j12_drop', 'j12_eyrie', 'j12_bowl', 'j12_pilgrim']) see(w, `${J12.id}:${id}`);
  for (const g of J12.encounters!) fight(w, `${J12.id}:${g.id}`);
  const cell = shut(j12, [19, 11], [18, 11], [16, 11]);
  ok(cell.size > 600 && !cell.reached, `the cell is shut but for the rock: none of J12's ${cell.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${J12.id}:j12_rope`);
  ok(search(J12.id, 19, 11, WEST, 'j12_cell'), 'searched under the bell-rope, the rock gives, and the cell behind it can be walked into');
  const alms = chest(J12, 'j12_alms');
  ok(alms?.kind === 'chest' && alms.gold === 1400 && alms.x === 16 && alms.y === 11, 'in the cell, its alms box');
}

/**
 * The four third prestiges taught here (#448), each played by a company of 27 whose member of the class
 * has the second: sent to the trainer by its seeking quest, asked, the quest done as the log says, and
 * the third taken at the trainer's menu, earned and costing no gold. The Ledge: Edric's toll-takers
 * up the shaft by night and never by day, won at 27, and his words at first light. The Vigil: Oswin's
 * brothers up the summit's path by night, won at 27, and his words at dawn. The Eleven: Brother Lark
 * asks; the Tide Bell hung, the miners' hymn heard and the keeper's log taken, and sung to him. Whose
 * Hand: Hereward asks; down the Dead-Drop, the Tallymaster seen writing and the orders taken from its
 * tray without a fight, and read to him from the pack, which keeps them.
 */
function thirdPrestiges(ok: (cond: boolean, msg: string) => void): void {
  const LEVEL = 27, rng = makeRng(448);
  /** A company of 27, its member in `slot` made one of `cls` with the first two prestiges taken. */
  const company = (slot: number, cls: ClassId): Walk => {
    const w = newWalk(ok);
    w.level = LEVEL;
    if (w.party.members[slot].cls !== cls) w.party.members[slot] = createCharacter(w.party.members[slot].name, 'human', cls, { might: 13, speed: 13, personality: 13 }, rng);
    for (const m of w.party.members) { m.level = LEVEL; m.xp = xpForLevel(LEVEL); }
    takePrestige(w.party.members[slot]); takePrestige(w.party.members[slot]);
    return w;
  };
  const npc = (map: string, name: string): Person => mapOf(map).features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const page = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id);
  const hear = (w: Walk, map: string, p: Person): string => { w.world.travel(map, p.x, p.y); const said = meet(p, w.party, heard(w.world, p)).text; listen(w); return said; };
  const ask = (w: Walk, map: string, p: Person, sets: string): string => {
    w.world.travel(map, p.x, p.y);
    const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.sets === sets), not = m.choice?.answers.find((x) => !x.sets);
    ok(!!a && !!not, `${p.name} asks (${m.choice?.ask ?? 'no question'}), and an answer sets ${sets}`);
    const said = a ? answer(a, w.party) : '';
    listen(w);
    return said;
  };
  /** The clock on to the next `hour` o'clock. */
  const until = (w: Walk, hour: number): void => {
    const now = w.world.state.minutes, at = Math.floor(now / 1440) * 1440 + hour * 60;
    w.world.advance((at > now ? at : at + 1440) - now);
  };
  /** The trainer's menu: the member of the class barred by `bar` before, and taught after, for nothing. */
  const taught = (w: Walk, p: Person, slot: number, how: string): void => {
    const t = p.teaches!, gold = w.party.gold, [offer] = offers(t, w.party, w.world.state);
    const r = teach(t, w.party, w.world.state, slot);
    ok(t.prestige === 3 && offer?.who === slot && offer.bar === '' && offer.price === 0 && r.taught && w.party.gold === gold && prestigeOf(w.party.members[slot]) === 3,
      `${how}: ${p.name.split(',')[0]}'s menu offers the third, earned, and teaches it for no gold (${r.line})`);
  };
  /** The quest done once, with no goal, its entries all written. */
  const finished = (w: Walk, id: string, entries: readonly string[], how: string): void => {
    const v = page(w, id), title = v?.def.title ?? id, ids = v?.pages[0].entries.map((e) => e.id) ?? [];
    ok(!!v?.done && v.goal === null && entries.every((e) => ids.includes(e)) && w.news.filter((n) => n === `Quest complete: ${title}.`).length === 1,
      `${how}: done with no goal, its entries ${ids.join(', ')}, and said complete once`);
  };
  const seeking = (w: Walk, slot: number): string | null | undefined => page(w, seekId(slot, 3))?.goal;

  // The two nights: asked by day, each group is not there by day and is by night, the next only once the
  // one before is down; won at 27, the trainer's words at first light set the quest done, and the menu
  // teaches the third.
  const nights = [
    { how: 'The Ledge', cls: 'knight', slot: 0, map: 'highspine_i10', who: 'Edric, the old champion', groups: ['i10_tolltakers', 'i10_tolltakers2'], asked: LEDGE_ASKED, held: LEDGE_HELD, quest: 'ledge', goal: /Hold the ledge/, dawn: 'Not one of them got past us', entries: ['asked', 'night', 'more', 'held'] },
    { how: 'The Vigil', cls: 'monk', slot: 3, map: 'monksvale_j11', who: 'Oswin, the summit\'s hermit', groups: ['j11_vigil'], asked: VIGIL_ASKED, held: VIGIL_KEPT, quest: 'vigil', goal: /Keep the vigil/, dawn: 'You sat it out', entries: ['asked', 'night', 'kept'] },
  ] as const;
  for (const n of nights) {
    const w = company(n.slot, n.cls), p = npc(n.map, n.who), gs = n.groups.map((id) => mapOf(n.map).encounters!.find((e) => e.id === id)!);
    const sent = seeking(w, n.slot);
    ok(sent === `Find ${n.who} in ${mapOf(n.map).name}.`, `${n.how}: at ${LEVEL} with the second, ${w.party.members[n.slot].name} is sent to the trainer (${sent})`);
    until(w, 12);
    ask(w, n.map, p, n.asked);
    ok(!!page(w, n.quest)?.pages[0].begun && n.goal.test(page(w, n.quest)?.goal ?? '') && page(w, seekId(n.slot, 3))?.done === true,
      `${n.how}: asked, it begins and the seeking is done (${page(w, n.quest)?.goal})`);
    ok(offers(p.teaches!, w.party, w.world.state)[0]?.bar === 'the quest first' && !teach(p.teaches!, w.party, w.world.state, n.slot).taught, `${n.how}: and the menu waits on the quest`);
    for (const g of gs) {
      w.world.travel(n.map, p.x, p.y);
      until(w, 12);
      const byDay = w.world.walks(g, g.x, g.y);
      until(w, 1);
      const later = gs.slice(gs.indexOf(g) + 1).some((x) => w.world.walks(x, x.x, x.y));
      ok(!byDay && w.world.walks(g, g.x, g.y) && !later && !g.respawn && g.roams === false,
        `${n.how}: ${g.id}, ${g.monsters.length} of them, come by night and not by day, none after them yet, and never again once down`);
      fight(w, `${n.map}:${g.id}`);
    }
    until(w, 8);
    const dawn = hear(w, n.map, p);
    ok(dawn.includes(n.dawn) && !!w.party.flags[n.held], `${n.how}: at first light the trainer's words set it done (${dawn.split('\n\n')[1] ?? dawn})`);
    finished(w, n.quest, n.entries, n.how);
    taught(w, p, n.slot, n.how);
  }

  // The Eleven: asked in the bell tower, the verses gathered where they are sung, and sung there.
  {
    const w = company(2, 'bard'), lark = npc('monastery', 'Brother Lark');
    ok(seeking(w, 2) === 'Find Brother Lark in Highcell.', `The Eleven: at ${LEVEL} with the second, the bard is sent to the bell tower (${seeking(w, 2)})`);
    ask(w, 'monastery', lark, ELEVEN_ASKED);
    ok(/Find the eleven/.test(page(w, 'eleven')?.goal ?? '') && page(w, seekId(2, 3))?.done === true, `The Eleven: asked, the goal is the verses (${page(w, 'eleven')?.goal})`);
    // The keeper's log off Crowness Light's table; the Tide Bell back to the priestess at the dry door;
    // the hymn's doors heard going down, and the oldest miner's last verse.
    const log = mapOf('downs_e3').features!.find((f) => f.kind === 'chest' && f.id === 'e3_log');
    if (log?.kind === 'chest') { w.world.travel('downs_e3', log.x, log.y); w.world.markUsed(log.id); w.party.bag.push(...log.items); }
    w.party.bag.push('tide_bell');
    hear(w, 'delta_b6', npc('delta_b6', 'a priestess at the dry door'));
    see(w, 'deep_mines:dm1_door3');
    hear(w, 'anvilhall', npc('anvilhall', 'The oldest miner'));
    ok(['count', 'doors', 'light'].every((e) => page(w, 'eleven')?.pages[0].entries.some((x) => x.id === e)) && /Sing the verses/.test(page(w, 'eleven')?.goal ?? ''),
      `The Eleven: the count, the doors and the light gathered, the goal is the bell tower (${page(w, 'eleven')?.goal})`);
    const sung = hear(w, 'monastery', lark);
    ok(sung.includes('every word falls on a stroke') && !!w.party.flags[ELEVEN_SUNG], `The Eleven: sung to him under the bells (${sung.split('\n\n')[1] ?? sung})`);
    finished(w, 'eleven', ['asked', 'count', 'doors', 'light', 'sung'], 'The Eleven');
    taught(w, lark, 2, 'The Eleven');
  }

  // Whose Hand: asked in Rook's Nest; down the Dead-Drop from the stair's foot under the Tide Ship, the
  // levels' groups that stand won at 27; in the counting house the writer seen through the gate in the
  // rail and the orders out of the tray with no group beside, the Tallymaster left at its desk; back up
  // the way down, and read to him from the pack, once, which keeps them.
  {
    const w = company(3, 'thief'), hereward = npc('sheerpoint_i8', 'Hereward, the watcher');
    ok(seeking(w, 3) === 'Find Hereward, the watcher in Sheer Point.', `Whose Hand: at ${LEVEL} with the second, the thief is sent to Rook's Nest (${seeking(w, 3)})`);
    const said = [hear(w, 'sheerpoint_i8', hereward), hear(w, 'sheerpoint_i8', hereward), hear(w, 'sheerpoint_i8', hereward)];
    ok(said[0] === hereward.lines.join('\n\n') && said[1].includes('whose hand writes them') && said[2] === said[0] && !!w.party.flags[ORDERS_ASKED] && page(w, seekId(3, 3))?.done === true
      && offers(hereward.teaches!, w.party, w.world.state)[0]?.bar === 'the quest first' && /Go down the Dead-Drop/.test(page(w, 'whose_hand')?.goal ?? ''),
      `Whose Hand: his own words first, then his ask, once, which begins it and ends the seeking, and the menu waits on it (${page(w, 'whose_hand')?.goal})`);
    const won = (id: string): void => { for (const g of mapOf(id).encounters ?? []) if (w.world.walks(g, g.x, g.y) && !w.world.ended(g)) fight(w, `${id}:${g.id}`); };
    const way = (from: string, to: string) => mapOf(from).exits!.find((e) => e.to === to)!;
    const foot = way('dead_drop_stair', 'dead_drop');
    walkThrough(w, 'dead_drop_stair', foot.x, foot.y + 1, NORTH, 'dead_drop', 1);
    won('dead_drop');
    for (const [from, to] of [['dead_drop', 'dead_drop2'], ['dead_drop2', 'dead_drop3']]) { const e = way(from, to); walkThrough(w, from, e.x, e.y - 1, SOUTH, to, 1); if (to !== 'dead_drop3') won(to); }
    const C = mapOf('dead_drop3'), desk = C.encounters!.find((g) => g.id === 'dd3_tallymaster')!, writes = C.features!.find((f) => f.kind === 'event' && f.id === 'dd3_writes')!;
    const tray = C.features!.find((f) => f.kind === 'chest' && f.id === 'dd3_orders')!;
    see(w, `${C.id}:dd3_writes`);
    const besideWrites = w.world.adjacentGroups().length;
    w.world.travel(C.id, tray.x, tray.y);
    const besideTray = w.world.adjacentGroups().length;
    if (tray.kind === 'chest') { w.world.markUsed(tray.id); w.party.bag.push(...tray.items); }
    listen(w);
    ok(!!w.party.flags.q_writer_seen && w.party.bag.includes('compact_orders') && !besideWrites && !besideTray && !w.world.ended(desk) && writes.x === desk.x
      && page(w, 'whose_hand')?.goal === 'Take the orders up to Hereward in Rook\'s Nest, on Sheer Point.',
      `Whose Hand: through the gate in the rail the Tallymaster seen writing, and the orders out of the tray at its right hand with no group beside, the Tallymaster left at its desk (${page(w, 'whose_hand')?.goal})`);
    for (const [from, to] of [['dead_drop3', 'dead_drop2'], ['dead_drop2', 'dead_drop'], ['dead_drop', 'dead_drop_stair']]) { const s = mapOf(from).start; walkThrough(w, from, s.x, s.y + 1, NORTH, to, 1); }
    const read = hear(w, 'sheerpoint_i8', hereward);
    ok(read.includes('reads the orders through twice') && !!w.party.flags[ORDERS_READ] && w.party.bag.includes('compact_orders'),
      `Whose Hand: in Rook's Nest he reads the orders from the pack, once, and hands them back (${read.split('\n\n')[1] ?? read})`);
    finished(w, 'whose_hand', ['asked', 'writer', 'orders', 'read'], 'Whose Hand');
    // Read once, the third is his to teach though the orders leave the pack after.
    const kept = w.party.bag.splice(w.party.bag.indexOf('compact_orders'), 1);
    ok(kept.join() === 'compact_orders' && offers(hereward.teaches!, w.party, w.world.state)[0]?.bar === '', 'Whose Hand: read once, the third waits on nothing more, the orders carried or not');
    taught(w, hereward, 3, 'Whose Hand');
    w.party.bag.push(...kept);
    const after = hear(w, 'sheerpoint_i8', hereward);
    ok(after.includes('Still counting') && w.party.bag.includes('compact_orders'), `Whose Hand: after, his words of the stones, and the orders still the company's (${after.split('\n\n')[1] ?? after})`);
  }
}

/**
 * Highcell (#500): in at the gate past the brother in it, and out again; the upper house at 23, the
 * cloister swept bare round its garth, the well no foot goes to, the board of the hours read the old
 * way, the refectory with nothing eaten in it, the cells with a brother standing in each and the Novice
 * in the last, and the brothers at their hours won; the bell tower's foot, its stair winding up and the
 * bells rung eleven, a gap and eleven, one ringer among them breathing; down the night stair to the
 * lower house, the chapter house's brothers and bells won and the Abbot on its seat, which never comes
 * back and whose robe falls open as it falls; and the undercroft behind the seat, found from the seat
 * stood a hand off its own worn place, every niche full and the last cut with a count a reader reads.
 */
function highcell(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const [L1, L2] = ['monastery', 'monastery2'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  const def = (id: string) => MONSTERS.find((m) => m.id === id)!;
  w.level = 23;

  // In at the gate, past the brother in it, onto the first square inside, facing in; stepped back into,
  // the gate lets the company out onto the road's end before it, facing the road.
  w.world.travel('monksvale_j11', GATE.x, GATE.y - 1, SOUTH);
  const inside = w.world.move('forward');
  ok(inside.kind === 'moved' && w.world.state.mapId === 'monastery' && w.world.state.x === L1.start.x && w.world.state.y === L1.start.y && w.world.state.facing === SOUTH && inside.messages.includes(GATE.label!),
    `the gate takes the company in past the brother in it, onto the cloister's way in, facing in (${at()}: ${inside.kind === 'moved' ? inside.messages.join(' / ') : inside.kind})`);
  const off = w.world.move('forward'), back = w.world.move('back');
  const vale = w.world.zone;
  ok(off.kind === 'moved' && back.kind === 'moved' && vale?.id === 'monksvale_j11' && w.world.state.x - vale.x === GATE.x && w.world.state.y - vale.y === GATE.y - 1 && w.world.state.facing === NORTH,
    `and the gate lets it back out onto the road's end before it, facing the road (${at()})`);
  ok([L1, L2].every((d) => (d.exits ?? []).every((e) => !e.shut && !e.needFlag) && !d.features!.some((f) => ['inn', 'temple', 'shop', 'guild', 'trainer', 'camp'].includes(f.kind))),
    'nothing shuts a way in Highcell, and nothing in it sells, teaches or rests a company (#443, call 7)');

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
  /** What a square says to a company whose fifth member reads the old script, and who that is. */
  const read = (map: string, x: number, y: number): { said: string[]; who: string } => {
    const reader = w.party.members[4], skills = reader.skills;
    w.world.travel(map, x, y);
    reader.skills = ['linguist'];
    const said = w.world.eventsHere();
    reader.skills = skills;
    return { said, who: reader.name };
  };

  // The upper house (23): the cloister swept bare round its garth, the well no foot goes to, the board
  // of the hours by the refectory door in the old script, the refectory and the cells.
  see(w, 'monastery:hc1_gate');
  const well = L1.features!.find((f) => f.kind === 'well');
  ok(well?.kind === 'well' && !well.heal && well.text.includes('no foot has crossed the snow'), 'the well in the garth hangs dry, no foot crosses the snow to it, and it mends nobody');
  const board = L1.features!.find((f) => f.kind === 'sign' && f.id === 'hc1_board');
  const hours = read('monastery', board!.x, board!.y);
  ok(board?.kind === 'sign' && !!board.read && hours.said.includes(readLine(hours.who, board.read)) && w.world.used('hc1_board'), `by the refectory door the board of the hours, which a reader reads the old way (${hours.said.join(' / ')})`);
  see(w, 'monastery:hc1_refectory');
  see(w, 'monastery:hc1_cells');
  const [walk, stair] = L1.encounters!;
  ok(L1.encounters!.length === 2 && walk.monsters.join() === 'brother,brother,brother' && stair.monsters.join() === 'bell_ringer,bell_ringer,bell_ringer,bell_ringer' && L1.encounters!.every((g) => !!g.respawn),
    'brothers at their hours by the cells, three, and four ringers on the tower\'s stair');
  fight(w, `monastery:${walk.id}`);

  // The Novice in the last cell (#56's 45): his letter and his answer are The Novice's (#506, `sideQuests`).
  const novice = L1.features!.find((f) => f.kind === 'npc' && f.name === 'A novice') as Person;
  w.world.travel('monastery', novice.x, novice.y);
  ok(meet(novice, w.party, heard(w.world, novice)).text.includes('never once seen a brother break one'), 'the Novice in the last cell keeps the fasts with the brothers');

  // The bell tower: its foot, the stair winding up beside the ropes, and the bells, rung eleven, a gap
  // and eleven, with one ringer among them who breathes (the Laureate; the Bard's third is #448's).
  see(w, 'monastery:hc1_tower');
  fight(w, `monastery:${stair.id}`);
  see(w, 'monastery:hc1_stair');
  w.world.travel('monastery', 4, 13);
  const bells = w.world.eventsHere();
  ok(bells.some((t) => t.includes('they ring: eleven, a gap, eleven')), `under the bells the ringers ring the eleven (${bells.join(' / ')})`);
  const ringer = L1.features!.find((f) => f.kind === 'npc' && f.name === 'Brother Lark') as Person;
  w.world.travel('monastery', ringer.x, ringer.y);
  ok(meet(ringer, w.party, heard(w.world, ringer)).text.includes('There are no words for it'), 'among the ringers one breathes, and has found no words for the bells');
  ok([[ringer.x, ringer.y], [novice.x, novice.y], [13, 13]].every(([x, y]) => reached(L1, [L1.start.x, L1.start.y], [x, y])),
    'the upper house is walked from the gate to the bells, the Novice\'s cell and the night stair with nothing searched for');

  // Down the night stair to the lower house (23): the chapter house, brothers in front of two
  // bell-ringers whose bells hold from the back, machines all, which the Hearth's light passes through.
  walkThrough(w, 'monastery', 12, 13, EAST, 'monastery2', 1);
  ok(w.world.state.x === L2.start.x && w.world.state.y === L2.start.y && w.world.state.facing === SOUTH, `the night stair comes down into the lower house (${at()})`);
  see(w, 'monastery2:hc2_stair');
  see(w, 'monastery2:hc2_chapter');
  const chapter = L2.encounters!.find((g) => g.id === 'hc2_chapter')!;
  ok(chapter.monsters.join() === 'brother,brother,bell_ringer,bell_ringer' && !!chapter.respawn && !!def('bell_ringer').ranged && def('bell_ringer').inflict?.cond === 'paralysed'
    && ['brother', 'bell_ringer', 'abbot'].every((m) => def(m).kind === 'machine'), 'the chapter house: brothers in front of two bell-ringers, whose bells hold from the back; machines all');
  fight(w, 'monastery2:hc2_chapter');

  // The Abbot on its seat, won at the house's floor: it never comes back, and its robe falls open.
  fight(w, 'monastery2:hc2_abbot');
  const abbot = L2.encounters!.find((g) => g.id === 'hc2_abbot')!;
  ok(abbot.monsters.join() === 'abbot' && !abbot.respawn && !!abbot.slainText?.includes('its robe falls open'), 'the Abbot, alone on its seat, falls and never comes back, and its robe falls open as it falls');

  // The secret: the seat stands a hand off the hollows its feet have worn in the floor; searched behind
  // it, the wall gives on the undercroft. Walked, it is never reached but through that wall.
  ok(!reached(L2, [L2.start.x, L2.start.y], [2, 13]) && reached(L2, [L2.start.x, L2.start.y], [7, 10]), 'the undercroft is reached only through the wall behind the seat, and the stair joins the chapter house to the seat');
  see(w, 'monastery2:hc2_seat');
  w.world.travel('monastery2', 7, 10, SOUTH);
  let wall = false;
  for (let i = 0; i < 20 && !wall; i++) wall = w.world.search();
  const into = wall ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(wall && into.every((r) => r.kind === 'moved') && w.world.used('hc2_niches'), 'searched behind the seat, the wall gives on the undercroft, every niche in it full');

  // The undercroft: the last niche's lip cut with a count, which a reader reads the old way to eleven;
  // and by the niches the monks' things, Rimewater's rung with a plus.
  const tally = L2.features!.find((f) => f.kind === 'sign' && f.id === 'hc2_tally');
  const count = read('monastery2', tally!.x, tally!.y);
  ok(tally?.kind === 'sign' && !!tally.read?.endsWith('ELEVEN.') && count.said.includes(readLine(count.who, tally.read)) && w.world.used('hc2_tally'),
    `the last niche's lip, cut with a count that a reader reads to eleven (${count.said.join(' / ')})`);
  const things = L2.features!.find((f) => f.kind === 'chest' && f.id === 'hc2_things');
  ok(things?.kind === 'chest' && things.gold === 600 && things.items.join() === 'ice_axe+1,skinning_knife+1', 'by the niches the monks\' things: 600 gold, an Ice Axe +1 and a Skinning Knife +1');
  listen(w);
}

// ---- the chapter (#505) ----

const mapOf = (id: string): MapDef => MAP_DEFS.find((d) => d.id === id)!;
const KING = mapOf('highspine_i10').encounters!.find((g) => g.id === 'i10_king')!;

/** A step played at a level, the company levelled to it. */
const atLevel = (level: number, s: Step): Step => ({ name: `${s.name} at ${level}`, play: (w) => {
  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
  w.level = level;
  s.play(w);
} });

/** The entries written on the chapter's page. */
const written = (w: Walk): string[] => (quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries ?? []).map((e) => e.id);

/**
 * Over the pass from K10 onto J10's road, and down it across J10's corner onto J11's road at its foot,
 * where the bells are heard (the road walked square to square in the walkthrough's opening).
 */
function overThePass(w: Walk): void {
  w.world.travel('coldmere_k10', 0, 19, WEST);
  w.world.move('forward');
  w.world.travel('monksvale_j10', 20, 31, SOUTH);
  w.world.move('forward');
  listen(w);
  see(w, 'monksvale_j11:j11_bells');
}

/** Over the pass, the bells, and down the road to Highcell's gate and in. */
const TO_THE_GATE: Step = { name: 'over the pass to Highcell', play: (w) => {
  overThePass(w);
  walkThrough(w, 'monksvale_j11', GATE.x, GATE.y - 1, SOUTH, 'monastery', 1);
} };

/**
 * Highcell, in at the gate: the cells, the board of the hours read the old way by a reader, the night
 * stair down to the chapter house and its brothers and bells and the Abbot on its seat won.
 */
const HIGHCELL: Step = { name: 'Highcell', play: (w) => {
  walkThrough(w, 'monksvale_j11', GATE.x, GATE.y - 1, SOUTH, 'monastery', 1);
  see(w, 'monastery:hc1_cells');
  const board = mapOf('monastery').features!.find((f) => f.kind === 'sign' && f.id === 'hc1_board')!;
  const reader = w.party.members[4], skills = reader.skills;
  reader.skills = ['linguist'];
  w.world.travel('monastery', board.x, board.y);
  w.world.eventsHere();
  reader.skills = skills;
  listen(w);
  walkThrough(w, 'monastery', 12, 13, EAST, 'monastery2', 1);
  see(w, 'monastery2:hc2_chapter');
  fight(w, 'monastery2:hc2_chapter');
  fight(w, 'monastery2:hc2_abbot');
} };

/** Over the crest past the Peak Stone, north along the ridge trail to Sheer Point, and the causeway's first stone. */
const POINT: Step = { name: 'the Point', play: (w) => {
  see(w, 'highspine_i11:i11_stone');
  see(w, 'sheerpoint_i9:i9_causeway');
  see(w, 'sheerpoint_i8:i8_causeway');
} };

/** The night: met at her fire on the shingle and slept by, she is gone, and on the first stone her knot. */
const NIGHT: Step = { name: 'the night', play: (w) => {
  const her = mapOf('sheerpoint_i8').features!.find((f) => f.kind === 'npc' && f.name === 'The girl out of the hole') as Person;
  w.world.travel('sheerpoint_i8', her.x + 1, her.y, WEST);
  const there = w.world.present(her);
  const sleep = meet(her, w.party, heard(w.world, her)).choice?.answers.find((a) => a.label === 'Sleep');
  const woke = sleep ? answer(sleep, w.party) : '';
  listen(w);
  see(w, 'sheerpoint_i8:i8_knot');
  w.ok(there && woke.includes('Her blanket by the fire is cold.') && !!w.party.flags[WENNA_TAKEN] && w.level === 24 && ['night', 'knot', 'heart', 'far'].every((e) => written(w).includes(e)),
    `at ${w.level} she is met at her fire and slept by, and taken: the night, her knot and the line read again are written (${written(w).join(', ')})`);
} };

/** South along the ridge to the Stair's head, where the king holds out his hand. */
const HEAD: Step = { name: 'the Stair\'s head', play: (w) => see(w, 'highspine_i10:i10_head') };

/** Beside the king's group on the head the toll is put before the fight: answered, the answer's words. */
function parley(w: Walk, label: string): string {
  w.world.travel('highspine_i10', KING.x + 2, KING.y, WEST);
  const r = w.world.move('forward'), a = w.world.question(KING.id)?.answers.find((x) => x.label === label);
  w.ok(r.kind === 'moved' && r.asks === KING.id && !!a, `beside the king the toll is put before the fight, and '${label}' answers it`);
  const said = a ? answer(a, w.party) : '';
  listen(w);
  return said;
}

const PAY: Step = { name: 'the toll paid', play: (w) => {
  const purse = w.party.gold, said = parley(w, 'Pay the toll.');
  w.ok(purse - w.party.gold === 1500 && !!w.party.flags.toll_paid && said.includes('stand aside'), `the toll paid, 1,500 gold, and the giants stand aside (${said})`);
} };

const REFUSE: Step = { name: 'the toll refused', play: (w) => {
  const said = parley(w, 'Refuse.');
  fight(w, 'highspine_i10:i10_king');
  w.ok(said.startsWith('He sighs') && !w.party.flags.toll_paid, `the toll refused, the king fights and falls (${said})`);
} };

/** Past the king's square onto the Stair below it, looking down into the ash. */
const DOWN: Step = { name: 'onto the Stair', play: (w) => {
  w.world.travel('highspine_i10', KING.x + 1, KING.y, WEST);
  const steps = [w.world.move('forward'), w.world.move('forward')];
  const said = [...steps.flatMap((r) => (r.kind === 'moved' ? r.messages : [])), ...w.world.eventsHere()];
  listen(w);
  w.ok(steps.every((r) => r.kind === 'moved' && !r.encounter && !r.asks) && said.some((t) => t.startsWith('Below the head the Stair goes down')) && !!w.party.flags[STAIR_TOP],
    `past the king's square onto the Stair, the way down into the ash, and ${STAIR_TOP} is set`);
} };

/**
 * The Bells (#505), begun where Rimewater's chapter ends: in order, over the pass at 22, Highcell and
 * the Point at 23, the night and the Stair at 24, the toll paid; and with the Point reached first, the
 * night before Highcell and the toll refused, where the journal holds nothing of Highcell until it is
 * walked and the goal stays on the Stair, and at the end it reads the same but for the toll. Nobody
 * on the Stair below the king is told anything before the toll is answered or the king falls.
 */
function theBells(ok: (cond: boolean, msg: string) => void): void {
  const early = newWalk(ok);
  early.world.travel('highspine_i10', 1, 20, WEST);
  ok(!early.world.eventsHere().length && !early.party.flags[STAIR_TOP], 'on the Stair below the king before the toll is answered or the king falls, nothing is said or set');
  const south = CHAPTER.goals.at(-1)!.text, stair = CHAPTER.goals.find((g) => g.text.startsWith('South again'))!.text;
  const read: string[] = [];
  for (const [how, pointFirst] of [['in order, the toll paid', false], ['the Point first, the toll refused', true]] as const) {
    const w = newWalk(ok);
    for (const m of w.party.members) { m.level = 22; m.xp = xpForLevel(22); }
    w.level = 22;
    w.party.gold = 1500;
    // Where The Sleepers ends (#492): her words at K9's door after the beds, the beds and the pass's mouth.
    w.party.flags[WENNA_LODGE] = 1;
    see(w, 'sleepers_bay2:sb2_beds');
    see(w, 'coldmere_k10:k10_mouth');
    ok(quest(w)?.goal === south && !!quest(w)?.pages.find((p) => p.def === CHAPTER)?.begun && !written(w).length,
      `${how}, The Sleepers done at the pass's mouth, the chapter begins, its goal south to Highcell's gate (${quest(w)?.goal})`);
    if (!pointFirst) {
      playChapter(w, CHAPTER, [atLevel(22, TO_THE_GATE), atLevel(23, HIGHCELL), atLevel(23, POINT), atLevel(24, NIGHT), atLevel(24, HEAD), atLevel(24, PAY), atLevel(24, DOWN)], how);
    } else {
      overThePass(w);
      playChapter(w, CHAPTER, [atLevel(23, POINT), atLevel(24, NIGHT)], how);
      ok(written(w).join(', ') === 'bells, stone, causeway, night, knot, heart, far' && quest(w)?.goal === stair,
        `${how}, after the night the journal holds nothing of Highcell, and the goal is the Stair (${written(w).join(', ')}: ${quest(w)?.goal})`);
      atLevel(24, HIGHCELL).play(w);
      ok(written(w).join(', ') === 'bells, cells, board, abbot, stone, causeway, night, knot, heart, far' && quest(w)?.goal === stair,
        `${how}, Highcell walked after the night writes its own in their place, and the goal stays on the Stair (${written(w).join(', ')})`);
      playChapter(w, CHAPTER, [atLevel(24, HEAD), atLevel(24, REFUSE), atLevel(24, DOWN)], how);
    }
    goalFromBegun(w, how);
    const ends = w.news.filter((n) => n === `Chapter complete: ${CHAPTER.title}.`).length;
    ok(!!quest(w)?.pages.find((p) => p.def === CHAPTER)?.done && ends === 1 && w.level === 24,
      `${how}, down onto the Stair, the chapter is done at 24, and said so once (${ends})`);
    read.push(written(w).join(', '));
  }
  ok(read[0] === 'bells, cells, board, abbot, stone, causeway, night, knot, heart, far, stair, paid, top' && read[1] === read[0].replace('paid', 'fought'),
    `the chapter reads the same in order and with the Point first, but for the toll (${read.join(' / ')})`);
  everyGoalWalked(ok, [CHAPTER]);
}

/**
 * The side quests (#506), each at its level and answered every way: the novice's letter carried from
 * Highcell's last cell to his mother at Anvilhall, and on the company's return he is told and walks home
 * to her, or is told she is well and sweeps on; the badge from the eagles' nest given to the Reader at
 * Lantern Watch, who may be refused, or to the brother in Highcell's first cell; the king's toll paid in
 * gold, the grey part or the faceless coin, or refused and the king fought, and each way the girl walks
 * down to the wagons; and the deserter's passage bought, the Compact's 600, after which he is by the
 * fire in Cinderport's inn, or the tally's page swapped and he is back at the causeway. Each pays its
 * xp whichever way it goes.
 */
function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  const at = (level: number): Walk => {
    const w = newWalk(ok);
    w.level = level;
    for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
    return w;
  };
  const npc = (map: string, name: string): Person => mapOf(map).features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const page = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];
  const goal = (w: Walk, id: string): string => page(w, id)?.goal ?? '(no goal)';
  const began = (w: Walk, title: string): boolean => w.news.includes(`New quest: ${title}.`);
  const there = (w: Walk, map: string, p: Person): boolean => { w.world.travel(map, p.x, p.y); return w.world.present(p); };
  const hear = (w: Walk, map: string, p: Person): string => { w.world.travel(map, p.x, p.y); const said = meet(p, w.party, heard(w.world, p)).text; listen(w); return said; };
  const answerTo = (w: Walk, map: string, p: Person, sets: string): string => {
    w.world.travel(map, p.x, p.y);
    const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.sets === sets);
    ok(!!a, `${p.name} asks, and an answer sets ${sets} (${m.choice?.ask ?? 'no question'})`);
    const said = a ? answer(a, w.party) : '';
    listen(w);
    return said;
  };
  const reads = (w: Walk, id: string, want: readonly string[], not: readonly string[], how: string): void => {
    const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [], title = pg?.def.title ?? id;
    const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
    ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
      `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
  };
  const xpOf = (w: Walk): number => w.party.members.reduce((t, m) => t + m.xp, 0);

  // The Novice (#56's 45), at 23: the boy in the last cell asks, and a company that says not now is
  // asked again; his letter carried to the woman knitting on Anvilhall's terrace, she reads it at the
  // first meeting; back in his cell he is told, and is gone home to the step below her, or is told
  // she is well and sweeps on. Either way 1,200 xp, 200 a member.
  const NOVICE = npc('monastery', 'A novice'), MOTHER = npc('anvilhall', 'A woman knitting'), BOY = npc('anvilhall', 'The boy from Highcell');
  for (const [how, sets] of [['told', NOVICE_TOLD], ['kept', NOVICE_KEPT]] as const) {
    const w = at(23);
    ok(there(w, 'anvilhall', MOTHER) && !there(w, 'anvilhall', BOY) && hear(w, 'anvilhall', MOTHER).includes('Not a word since') && !page(w, 'novice'),
      `${how}: the woman knits on Anvilhall's terrace with nobody beside her, and met first she begins nothing`);
    w.world.travel('monastery', NOVICE.x, NOVICE.y);
    const first = meet(NOVICE, w.party, heard(w.world, NOVICE)), not = first.choice?.answers.find((a) => !a.sets);
    ok(!!not && answer(not, w.party).includes('Another day') && !w.party.bag.includes('novice_letter'), `${how}: not now, and he keeps his letter`);
    listen(w);
    ok(began(w, 'The Novice') && /last cell/.test(goal(w, 'novice')), `${how}: he begins it, and the goal is his answer (${goal(w, 'novice')})`);
    ok(answerTo(w, 'monastery', NOVICE, 'q_novice_letter').includes('candle wax') && w.party.bag.includes('novice_letter') && /Anvilhall/.test(goal(w, 'novice')),
      `${how}: asked again, he gives his letter for his mother (${goal(w, 'novice')})`);
    const read = hear(w, 'anvilhall', MOTHER);
    ok(read.includes('reads it twice') && read.includes('come home') && !w.party.bag.includes('novice_letter') && /back up to the novice/.test(goal(w, 'novice')),
      `${how}: his mother takes the letter at the first meeting and reads it (${goal(w, 'novice')})`);
    const xp = xpOf(w), said = answerTo(w, 'monastery', NOVICE, sets);
    ok(xpOf(w) - xp === 1200, `${how}: answered, 1,200 xp between the six (${said.split('\n\n')[0]})`);
    reads(w, 'novice', ['cell', 'letter', 'read', how], [how === 'told' ? 'kept' : 'told'], how);
    ok(there(w, 'monastery', NOVICE) === (how === 'kept') && there(w, 'anvilhall', BOY) === (how === 'told') && hear(w, 'anvilhall', MOTHER).includes(how === 'told' ? 'forgotten how' : 'write again'),
      `${how}: ${how === 'told' ? 'he is gone from his cell and on the step below his mother' : 'he sweeps on in his cell, and his mother knits alone'}`);
  }

  // The Eagles' Nest (#56's 46), at 23: the herder at his fold begins it; the nest above the Peak Stone
  // opened, he remembers the Lantern who went up for the Stone, and the badge goes to the Reader at
  // Lantern Watch, who is refused once and asks again, or to the brother in Highcell's first cell, who
  // holds out its hand only to a company carrying it. Either way 1,200 xp, 200 a member.
  const HERDER = npc('monksvale_j11', 'A herder'), READER = npc('lantern_watch', 'Hester Dunmore, Reader of the Watch'), BROTHER = npc('monastery', 'A brother in its cell');
  const nest = mapOf('highspine_i11').features!.find((f) => f.kind === 'chest' && f.id === 'i11_nest_bones');
  const NEST = nest?.kind === 'chest' ? nest : undefined;
  ok(!!NEST && NEST.items.includes('lantern_badge'), 'the nest above the Peak Stone holds the Lantern\'s badge');
  for (const [how, who, map, sets] of [['watch', READER, 'lantern_watch', NEST_WATCH], ['cell', BROTHER, 'monastery', NEST_CELL]] as const) {
    if (!NEST) break;
    const w = at(23);
    ok(hear(w, 'monksvale_j11', HERDER).includes('eagles take them') && began(w, 'The Eagles\' Nest') && /eagles nest/.test(goal(w, 'nest')),
      `${how}: the herder at his fold begins it (${goal(w, 'nest')})`);
    ok(!hear(w, map, who).includes('badge'), `${how}: carrying nothing, ${who.name.split(',')[0]} says nothing of a badge`);
    w.world.travel('highspine_i11', NEST.x, NEST.y);
    w.world.markUsed(NEST.id);
    w.party.bag.push(...NEST.items);
    listen(w);
    ok(/Lantern Watch, or to Highcell/.test(goal(w, 'nest')) && hear(w, 'monksvale_j11', HERDER).includes('A Lantern came up the vale'),
      `${how}: the nest opened, the herder remembers the Lantern who went up, and the goal is the badge's (${goal(w, 'nest')})`);
    if (who === READER) {
      // The instruments from under the Stone's slab, carried with the badge, she takes first, at the
      // first meeting, and pays nothing; the badge she asks for at the next.
      w.party.bag.push('lantern_instruments');
      const gold = w.party.gold, took = hear(w, map, who);
      ok(took.includes('not ticked') && !w.party.bag.includes('lantern_instruments') && w.party.gold === gold && !!w.party.flags.q_nest_instruments && w.party.bag.includes('lantern_badge'),
        'watch: the Reader takes the Lantern\'s Instruments at the first meeting, for nothing, and leaves the badge for the next');
      w.world.travel(map, who.x, who.y);
      const keep = meet(who, w.party, heard(w.world, who)).choice?.answers.find((a) => !a.sets);
      ok(!!keep && answer(keep, w.party).includes('keep it close') && w.party.bag.includes('lantern_badge') && !page(w, 'nest')?.done, 'watch: refused, the Reader lets the company keep the badge');
    }
    const xp = xpOf(w), said = answerTo(w, map, who, sets);
    ok(xpOf(w) - xp === 1200 && !w.party.bag.includes('lantern_badge'), `${how}: the badge given, 1,200 xp between the six (${said.split('\n\n')[0]})`);
    reads(w, 'nest', ['herder', 'nest', how], [how === 'watch' ? 'cell' : 'watch'], how);
    ok(!hear(w, map, who).includes('badge'), `${how}: given, ${who.name.split(',')[0]} asks for it no more`);
  }

  // The Toll (#56's 47), at 24: the caravan-master short of the head begins it, his girl at the head
  // and nobody by the wagons; the king's toll paid in gold, given the grey part or the faceless coin,
  // which are barred to a company without them, or refused and the king fought: each way the girl is
  // gone from the head and by the wagons, and her father's thanks pay 1,500 xp, 250 a member.
  const MASTER = npc('highspine_i10', 'A caravan-master'), GIRL = npc('highspine_i10', 'A girl'), FREED = npc('highspine_i10', 'The caravan-master\'s girl');
  const TOLLS = [['paid', 'Pay the toll.', ''], ['part', 'Give him the grey part.', 'grey_part'], ['coin', 'Give him the faceless coin.', 'faceless_coin'], ['fought', 'Refuse.', '']] as const;
  for (const [how, label, item] of TOLLS) {
    const w = at(24);
    w.party.gold = 1500;
    ok(hear(w, 'highspine_i10', MASTER).includes('he has my girl') && began(w, 'The Toll') && /toll at the Stair/.test(goal(w, 'toll')) && there(w, 'highspine_i10', GIRL) && !there(w, 'highspine_i10', FREED),
      `${how}: the caravan-master begins it, his girl at the head and nobody by the wagons (${goal(w, 'toll')})`);
    if (item) {
      const a = KING.choice!.answers.find((x) => x.takes === item)!;
      ok(barred(a, w.party) && answer(a, w.party) === NONE, `${how}: without ${item} its answer is barred`);
      w.party.bag.push(item);
    }
    const said = parley(w, label);
    if (how === 'fought') fight(w, 'highspine_i10:i10_king');
    ok(!there(w, 'highspine_i10', GIRL) && there(w, 'highspine_i10', FREED) && /caravan-master at his wagons/.test(goal(w, 'toll')),
      `${how}: the girl is gone from the head and by the wagons, and the goal is her father (${said.split('\n\n')[0]})`);
    const xp = xpOf(w), thanks = answerTo(w, 'highspine_i10', MASTER, TOLL_DONE);
    ok(xpOf(w) - xp === 1500 && thanks.includes('your names'), `${how}: thanked for nothing, 1,500 xp between the six`);
    reads(w, 'toll', ['caravan', how, 'down'], TOLLS.map(([h]) => h).filter((h) => h !== how), how);
    ok(hear(w, 'highspine_i10', MASTER).includes('when the snow lets us'), `${how}: after, he waits on the snow`);
  }

  // The Mason's Tally (#56's 48), at 24: the deserter in the rocks asks, and a company short of the
  // Compact's fare cannot buy his passage; bought, 600 gold, he is gone from the rocks and by the fire
  // in Cinderport's inn; or the page swapped, the true tally is the company's and he is at work below
  // the tally-house. Either way 1,500 xp, 250 a member.
  const DESERTER = npc('sheerpoint_i8', 'A deserter'), BACK = npc('sheerpoint_i8', 'A mason below the tally-house'), PORT = npc('cinderport', 'A mason off the Point');
  for (const [how, sets] of [['passage', MASON_PASSAGE], ['swapped', MASON_SWAPPED]] as const) {
    const w = at(24);
    w.party.gold = 599;
    w.world.travel('sheerpoint_i8', DESERTER.x, DESERTER.y);
    const buy = meet(DESERTER, w.party, heard(w.world, DESERTER)).choice?.answers.find((a) => a.sets === MASON_PASSAGE);
    listen(w);
    ok(!!buy && buy.price === 600 && barred(buy, w.party) && answer(buy, w.party) === SHORT && !w.party.flags[MASON_PASSAGE] && began(w, 'The Mason\'s Tally') && /deserter/.test(goal(w, 'mason')),
      `${how}: the deserter begins it, and a company with 599 gold cannot buy his passage (${goal(w, 'mason')})`);
    w.party.gold = 600;
    const xp = xpOf(w), said = answerTo(w, 'sheerpoint_i8', DESERTER, sets);
    ok(xpOf(w) - xp === 1500 && w.party.gold === (how === 'passage' ? 0 : 600) && w.party.bag.includes('masons_tally') === (how === 'swapped'),
      `${how}: answered, 1,500 xp between the six${how === 'passage' ? ', the fare paid' : ', and the true tally the company\'s'} (${said.split('\n\n')[0]})`);
    reads(w, 'mason', ['deserter', how], [how === 'passage' ? 'swapped' : 'passage'], how);
    ok(!there(w, 'sheerpoint_i8', DESERTER) && there(w, 'cinderport', PORT) === (how === 'passage') && there(w, 'sheerpoint_i8', BACK) === (how === 'swapped'),
      `${how}: he is gone from the rocks, and ${how === 'passage' ? 'by the fire in Cinderport\'s inn' : 'at work below the tally-house'}`);
  }
}
