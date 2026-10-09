// The Whitespine's walkthrough. Its chapter, The Bells, is #505's, which plays it here; until then,
// Monks' Vale (J11, #499) walked: over the pass from Rimewater's K10, taken across parked J10's
// corner, the crossing line said in the range's words to a company under the vale's floor and its name
// alone to one at it, and back; the road square to square from the pass's foot to the gate's front, the
// bells heard at its foot; the gate and Highcell through it (#500): the cloister, the cells and the
// Novice, the bells rung eleven and the ringer among them who breathes, the chapter house and the
// Abbot on its seat, and the undercroft behind the seat; Spine Summit's camp at the atlas's site, and
// the hermit at it; the herder at his fold; the monks' shrine by the road; the box's groups won at its
// floor; and the store behind the wall, found from the trodden line to the rock.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen, type Walk } from '../../../../tools/walk.ts';
import { NORTH, SOUTH, EAST, WEST } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GameMap } from '../../../game/map.ts';
import type { MapDef } from '../../../game/map.ts';
import { readLine } from '../../../game/inscriptions.ts';
import { MONSTERS } from './monsters.ts';
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
