// The Whitespine's walkthrough. Its chapter, The Bells (#505), is played last (theBells); first,
// Monks' Vale (J11, #499) walked: over the pass from Rimewater's K10, taken across parked J10's
// corner, the crossing line said in the range's words to a company under the vale's floor and its name
// alone to one at it, and back; the road square to square from the pass's foot to the gate's front, the
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
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen, playChapter, everyGoalWalked, goalFromBegun, quest, type Walk, type Step } from '../../../../tools/walk.ts';
import { xpForLevel } from '../../../game/party.ts';
import { NORTH, SOUTH, EAST, WEST } from '../../../game/types.ts';
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
import { SADDLE } from '../rimewater/maps/coldmere_k10.ts';
import { CLIMB, GATE } from './maps/monksvale_j11.ts';
import { WENNA_TAKEN } from './maps/sheerpoint_i8.ts';
import { WENNA_LODGE } from '../rimewater/maps/rime_lodge.ts';
import { STAIR_TOP } from './maps/highspine_i10.ts';
import { CHAPTER } from './chapter.ts';

const J11 = MAP_DEFS.find((d) => d.id === 'monksvale_j11')!;
const person = (name: string): Person => J11.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const VALE = ATLAS.zones.find((z) => z.id === 'monksvale')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const j11 = out.zones.find((z) => z.id === 'monksvale_j11')!, k10 = out.zones.find((z) => z.id === 'coldmere_k10')!;

  // Over the pass: from K10's road at its west edge, taken across parked J10's corner onto J11's road
  // below its north edge. Three under the vale's floor the harsher words, two under the range's own,
  // at the floor its name and nothing more.
  const over = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('coldmere_k10', SADDLE.x + 1, SADDLE.y, WEST);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const low = over(19), two = over(20), due = over(22);
  ok(w.world.zone?.id === 'monksvale_j11' && w.world.state.x === j11.x + SADDLE.tx && w.world.state.y === j11.y + SADDLE.ty && w.world.state.facing === SOUTH && J11.start.x === SADDLE.tx && J11.start.y === SADDLE.ty,
    'over the pass from K10\'s 0,19 onto J11\'s road at 20,1, facing south, the box\'s way in');
  ok(due.join(' / ') === `${SADDLE.label} / Monks' Vale.`, `at 22, the pass's line and then the vale named, no more (${due.join(' / ')})`);
  ok(two.join(' / ') === `${SADDLE.label} / Monks' Vale. ${VALE.crossing?.harder}`, `at 20, the rest in the range's own words (${two.join(' / ')})`);
  ok(low.join(' / ') === `${SADDLE.label} / Monks' Vale. ${VALE.crossing?.warning}`, `at 19, the harsher words, and the way back over the pass open (${low.join(' / ')})`);
  ok(J11.exits?.length === 2 && J11.exits[0] === CLIMB && J11.exits[1] === GATE && CLIMB.x === SADDLE.tx && CLIMB.y === SADDLE.ty - 1 && CLIMB.tx === SADDLE.x + 1 && CLIMB.ty === SADDLE.y,
    'the way back is the road\'s first square at the north edge, above the landing, and lands beside K10\'s way over: the box\'s only way out but its edges and Highcell\'s gate');
  // Back over the pass: straight back, the way's own line alone.
  w.world.travel('monksvale_j11', SADDLE.tx, SADDLE.ty, NORTH);
  const back = w.world.move('forward');
  ok(back.kind === 'moved' && w.world.zone?.id === 'coldmere_k10' && w.world.state.x === k10.x + CLIMB.tx && w.world.state.y === k10.y + CLIMB.ty && w.world.state.facing === NORTH
    && back.messages.join(' / ') === CLIMB.label, `back from J11's 20,0 onto K10's 1,19, facing north; straight back, its own line alone (${back.kind === 'moved' ? back.messages.join(' / ') : back.kind})`);
  listen(w);
  w.level = 22;
  for (const m of w.party.members) m.level = 22;

  // The road square to square from the pass's foot to the gate's front, the atlas's way into Highcell;
  // past the north edge, for now, the world ends.
  const road = (x: number, y: number): boolean => out.at(x, y).ch === '=';
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
  ok(reach(j11.x + CLIMB.x, j11.y + CLIMB.y, (x, y) => road(x, y) && onJ11(x, y)).has((j11.y + GATE.y - 1) * out.width + j11.x + GATE.x) && out.passable(j11.x + CLIMB.x, j11.y - 1) !== 'ok',
    'the road runs square to square over J11 from the pass\'s foot at 20,0 to the gate\'s front at 26,23, and past the north edge, for now, the world ends');
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
  const hermit = person('A hermit');
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
  // the master by his wagons, and at the head his girl, whom the king keeps; people with words only.
  const who10 = (name: string): Person => I10.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const [master, girl, champion] = [who10('A caravan-master'), who10('A girl'), who10('An old champion')];
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
  // watcher in it, words only.
  const [nx, ny] = ATLAS.sites.find((s) => s.name === 'Rook\'s Nest')!.at;
  const watcher = I8.features!.find((f) => f.kind === 'npc' && f.name === 'A watcher') as Person;
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
  theBells(ok);
};

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

  // The Novice in the last cell (#56's 45; his letter is #506's): words only.
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
  const ringer = L1.features!.find((f) => f.kind === 'npc' && f.name === 'A ringer') as Person;
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

/** Over the pass from K10 onto J11's road at its foot, where the bells are heard. */
function overThePass(w: Walk): void {
  w.world.travel('coldmere_k10', SADDLE.x + 1, SADDLE.y, WEST);
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
