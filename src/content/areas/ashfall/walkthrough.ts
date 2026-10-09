// Ashfall's walkthrough. Its chapter, The Window, is #518's, which plays it here; until then,
// Cinderport's box (G10, #511) walked: put down at the gate's front, its way in until Cinderport is
// built (#512), since nothing but the Waste's road west of it is; the gate barred and the gate-ward in it
// each time; the road square to square from the gate's front up the wall to the north edge, past which,
// for now, the world ends, and out south-west to the west edge, where F10's road meets it; the trading
// ground: the ground's line, the eldest's story,
// the Riders' fires and horses and their shrine; the milestone; the chandler's racks under the wall; the
// stream forded on its stones and the knoll over it; the hermit and the clay pit under the vines; the
// box's groups won at its floor, the vines never roaming; and the factor's hide, found from the cut vines
// at its mouth. Then the Ember Waste's road (F10 and E10, #517): over G10's west edge, walked, the Waste's
// crossing words and back the coast's; the road square to square over F10 and E10 to the Wold's edge;
// the milestone, the vines' end, the Archdruid at his outcrop, the shrine, the cairn and the camp; over
// onto E10 with nothing said; the notch and its waymark, the hermit, the flow's head; E10 laid whole and
// bare of the Wold's; the groups won at the floor; and the grave, found from the cairn that looks back.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, SOUTH, WEST } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GATE } from './maps/cindercoast_g10.ts';

const G10 = MAP_DEFS.find((d) => d.id === 'cindercoast_g10')!;
const person = (name: string): Person => G10.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const COAST = ATLAS.zones.find((z) => z.id === 'cindercoast')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const g10 = out.zones.find((z) => z.id === 'cindercoast_g10')!;
  w.level = 24;
  for (const m of w.party.members) m.level = 24;
  const at = (x: number, y: number): number => (g10.y + y) * out.width + g10.x + x;
  const onG10 = (x: number, y: number): boolean => x >= g10.x && x < g10.x + g10.w && y >= g10.y && y < g10.y + g10.h;
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Set<number> => {
    const seen = new Set([(g10.y + fy) * out.width + g10.x + fx]), q = [[g10.x + fx, g10.y + fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const walk = (x: number, y: number): boolean => onG10(x, y) && out.passable(x, y) === 'ok';

  // The way in: nothing beside the box is built, so the company is put down at the gate's front, where
  // Cinderport's way out will land (#512) and the ship and the ride come in through the town (#547).
  ok(G10.start.x === GATE.x && G10.start.y === GATE.y + 1 && G10.start.facing === SOUTH && !(G10.exits ?? []).length,
    'the box\'s way in is the gate\'s front, 6,3, facing south, and it has no way out but its edges');
  ok(COAST.maps?.length === 1 && COAST.maps[0].map === 'cindercoast_g10' && !!COAST.crossing?.harder && !!COAST.crossing?.warning,
    'Cindercoast holds G10 and has its crossing words, said when a box beside it is built and walked over (#166)');
  w.world.travel('cindercoast_g10', G10.start.x, G10.start.y, SOUTH);
  ok(w.world.zone?.id === 'cindercoast_g10' && w.world.state.x === g10.x + GATE.x && w.world.state.y === g10.y + GATE.y + 1, 'put down at the gate\'s front on G10');

  // The gate, barred until Cinderport is built: the gate-ward in it, said at its front each time.
  const gate = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_gate');
  ok(gate?.kind === 'event' && !gate.once && gate.x === GATE.x && gate.y === GATE.y + 1 && out.passable(g10.x + GATE.x, g10.y + GATE.y) !== 'ok' && GATE.to === 'cinderport',
    'the gate at 6,2 is barred until Cinderport is built (GATE), and the gate-ward in it is met at its front each time');
  const plate = ATLAS.places.find((p) => p.id === 'cinderport')!.at;
  ok(Math.floor(plate[0]) === g10.x + GATE.x && Math.floor(plate[1]) === g10.y + GATE.y, `the gate at 6,2 is Cinderport's plate on the atlas (${plate.join(',')})`);

  // The road square to square from the gate's front, up the wall's west side to the north edge and out
  // south-west through the vines to the west edge; past both, for now, the world ends.
  const road = reach(GATE.x, GATE.y + 1, (x, y) => onG10(x, y) && out.at(x, y).ch === '=');
  ok(road.has(at(3, 0)) && road.has(at(0, 7)) && road.has(at(0, 8)) && out.passable(g10.x + 3, g10.y - 1) !== 'ok' && [7, 8].every((y) => out.at(g10.x - 1, g10.y + y).ch === '='),
    'the road runs square to square from the gate\'s front to the north edge at 3,0, past which, for now, the world ends, and to the west edge at 0,7 and 0,8, where F10\'s road meets it (#517)');
  const stone = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_milestone');
  ok(stone?.kind === 'event' && stone.text.includes('OLD CINDER 4, THE WOLD 6') && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => road.has(at(stone.x + dx, stone.y + dy))),
    'the milestone stands by the road where it leaves the ground: OLD CINDER 4, THE WOLD 6');
  see(w, 'cindercoast_g10:g10_milestone');

  // The trading ground: the ground's line, the eldest's story at the Riders' fire, their horses and shrine.
  see(w, 'cindercoast_g10:g10_ground');
  ok(w.world.used('g10_ground'), 'on the ground outside the gate, the horses and the fires: the Riders come down to trade');
  const eldest = person('The eldest');
  w.world.travel('cindercoast_g10', eldest.x, eldest.y);
  const story = meet(eldest, w.party, heard(w.world, eldest)).text;
  ok(story.includes('pillar of fire') && story.includes('Remember what that cost'), 'the Riders\' eldest tells the oldest story on this side of the sea');
  const fires = G10.features!.find((f) => f.kind === 'camp' && f.name === 'The Riders\' fires');
  ok(!!fires && Math.abs(fires.x - eldest.x) + Math.abs(fires.y - eldest.y) <= 3, 'the Riders\' fires are a camp beside the horse-lines, by the eldest');
  see(w, 'cindercoast_g10:g10_horses');
  const shrine = G10.features!.find((f): f is Extract<typeof f, { kind: 'shrine' }> => f.kind === 'shrine' && f.id === 'g10_shrine');
  ok(!!shrine && out.at(g10.x + shrine.x, g10.y + shrine.y).ch === ',' && shrine.text.includes('horse'), 'the Riders\' shrine stands on the ground, a horse\'s skull on a post');
  const racks = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_racks');
  ok(!!racks && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => out.at(g10.x + racks.x + dx, g10.y + racks.y + dy).solid === 'building'), 'the chandler\'s racks stand under the town\'s wall');
  see(w, 'cindercoast_g10:g10_racks');

  // Over the stream on its stones to the knoll, and the vines along the shore east of the town.
  const dry = reach(GATE.x, GATE.y + 1, walk);
  ok(dry.has(at(21, 2)) && dry.has(at(26, 8)) && !reach(GATE.x, GATE.y + 1, (x, y) => walk(x, y) && out.at(x, y).ch !== '"').has(at(21, 2)),
    'the stream is crossed only on its stones, to the knoll and the vines east of it');
  see(w, 'cindercoast_g10:g10_knoll');

  // Under the west vines, the hermit who came down off the mountain, and the potter's clay pit.
  const hermit = person('A hermit');
  w.world.travel('cindercoast_g10', hermit.x, hermit.y);
  ok(meet(hermit, w.party, heard(w.world, hermit)).text.includes('came down off the mountain'), 'the hermit under the vines came down off the mountain, as the first did');
  see(w, 'cindercoast_g10:g10_clay');

  // The box's groups, each won at its floor: the beetles south of the ground, the vines in the shore's
  // trees, which never roam, and at the far end the salamanders and the drake, the box's group at 25.
  ok(G10.encounters!.filter((g) => g.monsters.includes('strangler_vine')).every((g) => g.roams === false), 'the strangler vines never roam');
  for (const g of G10.encounters!) fight(w, `cindercoast_g10:${g.id}`);
  const overhead = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_overhead');
  ok(overhead?.kind === 'event' && JSON.stringify(overhead.when) === JSON.stringify({ hours: 'day' }), 'by day a drake turns over the ash, a warning of the slopes');

  // The secret: the cut vines at the hide's mouth, the search there and the crates behind the trees.
  // Walked, waded, climbed or floated, the hide is never reached but through its mouth.
  const [door] = G10.secrets!;
  const shut = reach(door.x - 1, door.y, (x, y) => !(x === g10.x + door.x && y === g10.y + door.y) && onG10(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shut.size > 300 && !shut.has(at(door.x + 1, door.y)) && !shut.has(at(door.x + 2, door.y)), `the hide is shut but for its mouth: none of G10's ${shut.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'cindercoast_g10:g10_cut');
  w.world.travel('cindercoast_g10', door.x - 1, door.y, EAST);
  let opens = false;
  for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
  const inside = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opens && inside.every((r) => r.kind === 'moved') && w.world.used('g10_crates'), 'searched where the vines are cut, the trees open, and the crates behind them can be walked to');
  listen(w);
  const hide = G10.features!.find((f) => f.kind === 'chest' && f.id === 'g10_hide');
  ok(hide?.kind === 'chest' && hide.items.includes('longsword+2') && hide.x === door.x + 2 && hide.y === door.y, 'in the hide, among the crates, a Long Sword +2');

  // The Ember Waste's road (#517). Over G10's west edge from 0,7 onto F10's 31,7, walked: three under the
  // Waste's floor its harsher words, two under its own, at the floor its name and nothing more; straight
  // back, nothing; and back over two and three under Cindercoast's floor, the coast's own words.
  const F10 = MAP_DEFS.find((d) => d.id === 'emberwaste_f10')!, f10 = out.zones.find((z) => z.id === 'emberwaste_f10')!;
  const E10 = MAP_DEFS.find((d) => d.id === 'emberwaste_e10')!, e10 = out.zones.find((z) => z.id === 'emberwaste_e10')!;
  const WASTE = ATLAS.zones.find((z) => z.id === 'emberwaste')!;
  const cross = (level: number, from: string, x: number, y: number, facing: Facing): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel(from, x, y, facing);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const wasteLow = cross(21, 'cindercoast_g10', 0, 7, WEST), wasteTwo = cross(22, 'cindercoast_g10', 0, 7, WEST), wasteDue = cross(24, 'cindercoast_g10', 0, 7, WEST);
  ok(w.world.zone?.id === 'emberwaste_f10' && w.world.state.x === f10.x + 31 && w.world.state.y === f10.y + 7 && f10.x + f10.w === g10.x && F10.start.x === 31 && F10.start.y === 7,
    'over G10\'s west edge from 0,7 onto F10\'s 31,7, walked, the box\'s way in');
  ok(WASTE.maps?.map((m) => m.map).join() === 'emberwaste_f10,emberwaste_e10' && wasteDue.join(' / ') === 'The Ember Waste.', `at 24, the Ember Waste named, no more (${wasteDue.join(' / ')})`);
  ok(wasteTwo.join(' / ') === `The Ember Waste. ${WASTE.crossing?.harder}`, `at 22, the rest in the Waste's own words (${wasteTwo.join(' / ')})`);
  ok(wasteLow.join(' / ') === `The Ember Waste. ${WASTE.crossing?.warning}`, `at 21, the harsher words, and the coast behind (${wasteLow.join(' / ')})`);
  const back = cross(24, 'emberwaste_f10', 31, 7, EAST);
  ok(!back.length && w.world.zone?.id === 'cindercoast_g10', `straight back onto G10, nothing more (${back.join(' / ') || 'nothing'})`);
  const coastTwo = cross(22, 'emberwaste_f10', 31, 7, EAST), coastLow = cross(21, 'emberwaste_f10', 31, 7, EAST);
  ok(coastTwo.join(' / ') === `Cindercoast. ${COAST.crossing?.harder}` && coastLow.join(' / ') === `Cindercoast. ${COAST.crossing?.warning}`,
    `back over onto the coast two and three under its floor, Cindercoast's own words (${coastTwo.join(' / ')}; ${coastLow.join(' / ')})`);
  for (const m of w.party.members) m.level = 24;

  // The road square to square from G10's edge at rows 7 and 8, out of the vines and south-west over
  // F10's ash, west along its south rows past F11's corner at columns 5 to 11, over onto E10 at rows 29
  // and 30, through the Hills' notch and down to the west edge at 0,6; past F11 and D10, for now, the
  // world ends.
  const key = (x: number, y: number): number => y * out.width + x;
  const inBox = (z: typeof f10, x: number, y: number): boolean => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;
  const spread = (x0: number, y0: number, along: (x: number, y: number) => boolean): Set<number> => {
    const seen = new Set([key(x0, y0)]), q = [[x0, y0]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = key(x + dx, y + dy); if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const beside = (z: typeof f10, x: number, y: number, set: Set<number>): boolean => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => set.has(key(z.x + x + dx, z.y + y + dy)));
  const wasteRoad = spread(f10.x + 31, f10.y + 7, (x, y) => (inBox(f10, x, y) || inBox(e10, x, y)) && out.at(x, y).ch === '=');
  ok([7, 8].every((y) => wasteRoad.has(key(f10.x + 31, f10.y + y))) && [5, 6, 7, 8, 9, 10, 11].every((x) => wasteRoad.has(key(f10.x + x, f10.y + 31)))
    && [29, 30].every((y) => wasteRoad.has(key(f10.x, f10.y + y)) && wasteRoad.has(key(e10.x + 31, e10.y + y))) && wasteRoad.has(key(e10.x, e10.y + 6))
    && out.passable(f10.x + 8, f10.y + 32) !== 'ok' && out.passable(e10.x - 1, e10.y + 6) !== 'ok',
    'the road runs square to square from G10\'s edge over F10, along its south rows past F11\'s corner and over E10 to its west edge at 0,6, and past F11 and D10, for now, the world ends');
  const mile = F10.features!.find((f) => f.kind === 'event' && f.id === 'f10_milestone');
  ok(mile?.kind === 'event' && mile.text.includes('THE WOLD 2, CINDERPORT 4') && beside(f10, mile.x, mile.y, wasteRoad),
    'the milestone stands by the road where it turns west along the rocks: THE WOLD 2, CINDERPORT 4, as G10\'s THE WOLD 6 has it');
  see(w, 'emberwaste_f10:f10_milestone');

  // F10: the vines' end where the road leaves them and their edge in the north, Cindercoast's; the
  // Archdruid in the lee of the outcrop in the north-west, far from the road (#448 his trainer and
  // quest); the shrine and the cairn on the ash, and the Riders' ring a camp by the road.
  see(w, 'emberwaste_f10:f10_vines');
  see(w, 'emberwaste_f10:f10_edge');
  const druid = F10.features!.find((f) => f.kind === 'npc' && f.name === 'The Archdruid') as Person;
  const far = Math.min(...[...wasteRoad].filter((k) => inBox(f10, k % out.width, Math.floor(k / out.width))).map((k) => Math.abs(k % out.width - f10.x - druid.x) + Math.abs(Math.floor(k / out.width) - f10.y - druid.y)));
  ok(druid.x < 16 && druid.y < 16 && far >= 15 && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => out.at(f10.x + druid.x + dx, f10.y + druid.y + dy).solid === 'rock'),
    `the Archdruid sits in the lee of the outcrop in the north-west, ${far} squares from the road`);
  w.world.travel('emberwaste_f10', druid.x, druid.y);
  ok(meet(druid, w.party, heard(w.world, druid)).text.includes('out of the Grove'), 'the Archdruid came out of the Grove, and stayed');
  const ring = F10.features!.find((f) => f.kind === 'camp');
  ok(['f10_shrine', 'f10_cairn'].every((id) => F10.features!.some((f) => (f.kind === 'shrine' || f.kind === 'cairn') && f.id === id)) && !!ring && beside(f10, ring.x, ring.y, wasteRoad),
    'on the ash a shrine and a cairn, and the Riders\' ring a camp beside the road');
  see(w, 'emberwaste_f10:f10_flow');
  for (const g of F10.encounters!) fight(w, `emberwaste_f10:${g.id}`);

  // Over F10's west edge onto E10, walked: the same land and the same floor, so nothing is said.
  const onto = cross(24, 'emberwaste_f10', 0, 30, WEST);
  ok(w.world.zone?.id === 'emberwaste_e10' && w.world.state.x === e10.x + 31 && w.world.state.y === e10.y + 30 && e10.x + e10.w === f10.x && !onto.length,
    `over F10's west edge at 0,30 onto E10's 31,30, walked, and nothing said: the same land, the same floor (${onto.join(' / ') || 'nothing'})`);

  // E10: the notch the road takes through the Cinder Hills at about 150,306, a Rider's waymark in it;
  // the hermit on the crest; the flow's head at the south edge; the box laid whole, the Wold's steppe
  // and grass with it, and bare of the Wold's monsters, outriders and quests (#524's).
  const mark = E10.features!.find((f) => f.kind === 'event' && f.id === 'e10_waymark')!;
  ok(Math.abs(e10.x + mark.x - 150) <= 2 && Math.abs(e10.y + mark.y - 306) <= 2 && beside(e10, mark.x, mark.y, wasteRoad) && out.at(e10.x + mark.x, e10.y + mark.y).ch === '^',
    `the road takes the Hills by their notch at ${e10.x + mark.x},${e10.y + mark.y}, a Rider's waymark beside it`);
  see(w, 'emberwaste_e10:e10_waymark');
  const hermitE = E10.features!.find((f) => f.kind === 'npc' && f.name === 'A hermit') as Person;
  w.world.travel('emberwaste_e10', hermitE.x, hermitE.y);
  const life = meet(hermitE, w.party, heard(w.world, hermitE)).text;
  ok(life.includes('Stone\'s field') && life.includes('dark') && out.at(e10.x + hermitE.x, e10.y + hermitE.y).ch === '^', 'the hermit on the crest has looked down on the Stone\'s field all his life, and seen it dark');
  const flow = E10.features!.find((f) => f.kind === 'event' && f.id === 'e10_flow')!;
  ok(flow.y === 30 && out.at(e10.x + flow.x, e10.y + 31).ch === '!', 'the lava flow\'s head lies at E10\'s south edge, and is seen from the ash over it');
  see(w, 'emberwaste_e10:e10_flow');
  const ground = E10.rows.join('');
  ok([...ground].filter((c) => c === 's').length > 200 && ground.includes(',') && E10.encounters!.every((g) => g.monsters.every((m) => m === 'cinder_drake'))
    && E10.features!.filter((f) => f.kind === 'npc').length === 1 && !E10.features!.some((f) => f.kind === 'npc' && (f.quest || f.flag)),
    'E10 is laid whole, the Wold\'s steppe and grass with it, and holds nothing of the Wold\'s: its monsters, outriders and crossing line are #524\'s');
  for (const g of E10.encounters!) fight(w, `emberwaste_e10:${g.id}`);

  // The secret: the Hills' cairns all face the steppe but the one that looks back at the Stone, searched
  // where it looks; behind its stones the first Rider who came down to trade, on her saddle. Walked,
  // waded, climbed or floated, the grave is never reached but through its mouth.
  const [grave] = E10.secrets!;
  ok(['e10_cairn', 'e10_cairns'].every((id) => E10.features!.some((f) => (f.kind === 'cairn' || f.kind === 'event') && f.id === id && !!f.text?.includes('west face'))), 'the Hills\' cairns face west, toward the steppe');
  const shutE = spread(e10.x + grave.x + 1, e10.y + grave.y, (x, y) => !(x === e10.x + grave.x && y === e10.y + grave.y) && inBox(e10, x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shutE.size > 300 && !shutE.has(key(e10.x + grave.x - 1, e10.y + grave.y)) && !shutE.has(key(e10.x + grave.x - 2, e10.y + grave.y)),
    `the grave is shut but for its mouth: none of E10's ${shutE.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'emberwaste_e10:e10_back');
  w.world.travel('emberwaste_e10', grave.x + 1, grave.y, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('e10_rider'), 'searched where the cairn looks back, its stones come away, and under them a woman laid out on her saddle');
  listen(w);
  const bow = E10.features!.find((f) => f.kind === 'chest' && f.id === 'e10_grave');
  ok(bow?.kind === 'chest' && bow.items.includes('horn_bow+2') && bow.gold > 0 && bow.x === grave.x - 2 && bow.y === grave.y, 'in the grave, her saddle\'s silver and a Horn Bow +2');
};
