// The Whitespine's walkthrough. Its chapter, The Bells, is #505's, which plays it here; until then,
// Monks' Vale (J11, #499) walked: over the pass from Rimewater's K10, taken across parked J10's
// corner, the crossing line said in the range's words to a company under the vale's floor and its name
// alone to one at it, and back; the road square to square from the pass's foot to the gate's front, the
// bells heard at its foot; the gate barred until Highcell is built; Spine Summit's camp at the atlas's
// site, and the hermit at it; the herder at his fold; the monks' shrine by the road; the box's groups won
// at its floor; and the store behind the wall, found from the trodden line to the rock. Then the Peak
// Stone's box (I11, #501) walked: over the crest from the summit, the High Spine named in its own words
// to a company under its floor; the crest path to the Stone at the atlas's site, whole, which counts
// toward the Hearth once stood at; the ridge trail leaving north beside it; the shrine, the keeper, the
// cairn and the nest; the lookout over Ashfall and the ground under the Sheer, reached by a climb; the
// camp under the snow line; the box's groups won at its floor; and under the one unfrosted slab of the
// ring, the Lantern's survey marker and her instruments.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { stonesRestored } from '../../../game/stones.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { SADDLE } from '../rimewater/maps/coldmere_k10.ts';
import { CLIMB, GATE } from './maps/monksvale_j11.ts';

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
  ok((J11.exits ?? []).length === 1 && J11.exits![0] === CLIMB && CLIMB.x === SADDLE.tx && CLIMB.y === SADDLE.ty - 1 && CLIMB.tx === SADDLE.x + 1 && CLIMB.ty === SADDLE.y,
    'the way back is the road\'s first square at the north edge, above the landing, and lands beside K10\'s way over: the box\'s only way out but its edges');
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

  // The gate, barred until Highcell is built: the brother in it, said at its front each time.
  const gate = J11.features!.find((f) => f.kind === 'event' && f.id === 'j11_gate');
  ok(gate?.kind === 'event' && !gate.once && gate.x === GATE.x && gate.y === GATE.y - 1 && out.passable(j11.x + GATE.x, j11.y + GATE.y) !== 'ok' && !(J11.exits ?? []).includes(GATE) && GATE.to === 'monastery',
    'the gate at 26,24 is barred until Highcell is built (GATE), and the brother in it is met at its front each time');

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
  ok(crestLow.join(' / ') === `The High Spine. ${SPINE.crossing?.warning}`, `at 19, the harsher words, and the way back down open (${crestLow.join(' / ')})`);
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
  ok(road(i11.x + 27, i11.y) && walked.has(at({ x: 27, y: 0 })) && out.passable(i11.x + 27, i11.y - 1) !== 'ok',
    'the ridge trail leaves north beside the Stone at 27,0, and past the edge, for now, the world ends');
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
};
