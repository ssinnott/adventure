// Crossings (#164; game/passage.ts): a person sells passage by coach or boat. It leaves at its hour,
// lands its days later at its own, costs the company its fare and nothing else, lands it rested, and
// a save made at the far end loads there. Free once its `free` holds; a warning, never a refusal, to
// a company under the far end's floor. On the atlas a boat is a way by sea and a coach a way of its
// own, each travelled both ways where a crossing runs back; the gate counts its landing as a way in.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Passage } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { World, MINUTES_PER_DAY } from '../../src/game/world.ts';
import { defaultParty, isDown } from '../../src/game/party.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { departure, arrival, take, terms, offerLine, payLabel, fareOf } from '../../src/game/passage.ts';
import { zoneEdges } from '../../src/game/atlas.ts';
import { ATLAS, MAP_DEFS } from '../../src/content/index.ts';
import { landings } from './gate.ts';
import { ok } from './lib.ts';

const BOAT: Passage = { to: 'fx_isle', x: 2, y: 1, facing: NORTH, name: 'The isle', by: 'boat', fare: 150, departs: 20, days: 1, arrives: 6, free: { flag: 'fx_free' } };
const BACK: Passage = { to: 'fx_port', x: 1, y: 1, name: 'The port', by: 'boat', fare: 150, departs: 20, days: 1, arrives: 6 };
const COACH: Passage = { to: 'fx_town', x: 1, y: 1, name: 'The town', by: 'coach', fare: 80, departs: 6, days: 2, arrives: 18, label: 'The coach rattles in.' };

const town = (id: string, band: [number, number], features: MapDef['features'] = [], exits: MapDef['exits'] = []): MapDef =>
  ({ id, name: id, kind: 'town', band, start: { x: 1, y: 1, facing: NORTH }, rows: ['#####', '#...#', '#####'], features, exits });
const PORT = town('fx_port', [1, 4], [{ kind: 'npc', x: 3, y: 1, name: 'A boatman', lines: ['"The isle?"'], passage: [BOAT, COACH] }]);
const ISLE = town('fx_isle', [12, 14], [{ kind: 'npc', x: 3, y: 1, name: 'A boatman', lines: ['"Back?"'], passage: [BACK] }]);
const TOWN = town('fx_town', [5, 10], [], [{ x: 3, y: 1, to: 'thornmark', tx: 23, ty: 5 }]);

/**
 * What is wrong with the crossings of some maps: a far end that is no map, a landing that is not open
 * ground (or is tidal, and drowned at high water), hours off the clock, a fare or days below nothing.
 */
export function passageFaults(defs: readonly MapDef[]): string[] {
  const out: string[] = [];
  for (const d of defs) for (const f of d.features ?? []) {
    if (f.kind !== 'npc') continue;
    for (const p of f.passage ?? []) {
      const what = `${d.id}'s ${f.name} to ${p.name}`, far = defs.find((q) => q.id === p.to);
      if (!far) { out.push(`${what}: no map '${p.to}'`); continue; }
      const m = new GameMap(far);
      if (m.passable(p.x, p.y) !== 'ok' || m.at(p.x, p.y).terrain === 'tidal' || m.exitAt(p.x, p.y)) out.push(`${what}: lands on ${p.x},${p.y}, which is not open ground`);
      if (![p.departs, p.arrives].every((h) => h >= 0 && h < 24) || p.days < 0 || p.fare < 0 || (p.days === 0 && p.arrives <= p.departs)) out.push(`${what}: its hours, days or fare are off the clock`);
    }
  }
  return out;
}

const at = (day: number, hour: number): number => (day - 1) * MINUTES_PER_DAY + hour * 60;

export function passage(): void {
  // Every crossing in the game goes somewhere real and lands on open ground.
  const faults = passageFaults(MAP_DEFS);
  ok(!faults.length, `every crossing sold lands on open ground of a real map${faults.length ? `: ${faults.join('; ')}` : ''}`);
  const wrong = passageFaults([{ ...PORT, features: [{ kind: 'npc', x: 3, y: 1, name: 'A boatman', lines: [], passage: [{ ...BOAT, to: 'nowhere' }, { ...COACH, x: 0 }, { ...BACK, days: 0, arrives: 6 }] }] }, ISLE, TOWN]);
  ok(wrong.length === 3, `a crossing to no map, onto a wall or landing before it leaves is caught (${wrong.join('; ')})`);

  // Its hours: today's departure if it is still to come, else tomorrow's; it lands `days` midnights on.
  ok(departure(BOAT, at(1, 7)) === at(1, 20) && departure(BOAT, at(1, 20)) === at(1, 20) && departure(BOAT, at(1, 21)) === at(2, 20), 'a boat that sails at 20:00 leaves today until 20:00, and tomorrow after');
  ok(arrival(BOAT, at(1, 7)) === at(2, 6) && arrival(BOAT, at(1, 21)) === at(3, 6) && arrival(COACH, at(1, 5)) === at(3, 18), 'and lands at 06:00 the next day; a coach that leaves at 06:00 for two days lands on the third at 18:00');

  const maps = (): Record<string, GameMap> => Object.fromEntries([PORT, ISLE, TOWN].map((d) => [d.id, new GameMap(d)]));
  const rng = makeRng(164), party = defaultParty(rng);
  const world = new World(maps(), party, rng);
  world.state.minutes = at(1, 7);
  party.gold = 200;
  const food = party.food, hurt = party.members[0], dead = party.members[1];
  hurt.hp = 1; hurt.sp = 0; dead.hp = -20; dead.conditions = ['dead'];

  // To a company under the far end's floor the terms carry a warning; never to one at it.
  const words = terms(BOAT, world);
  ok(/leaves at 20:00 and lands the next day at 06:00/.test(words) && words.includes('"'), `the terms say when it leaves and lands, and warn a company under the isle's floor ("${words}")`);
  ok(!terms(BACK, world).includes('"'), `and none for the way back to the port, whose floor is the company's ("${terms(BACK, world)}")`);
  ok(offerLine(BOAT, world) === 'The isle\t150g\t1 day' && payLabel(BOAT, world) === 'Pay the fare (150 gold)', `the menu shows the fare and the days (${offerLine(BOAT, world).replace(/\t/g, ' | ')})`);

  world.state.minutes = at(1, 21);
  ok(/leaves at 20:00 tomorrow/.test(terms(BOAT, world)), 'after its hour the terms say it leaves tomorrow');
  world.state.minutes = at(1, 7);

  // Short of the fare, nothing changes.
  party.gold = 149;
  const short = take(BOAT, world, party);
  ok(!short.taken && party.gold === 149 && world.state.mapId === 'fx_port' && world.state.minutes === at(1, 7), `a company short of the fare goes nowhere and keeps its gold ("${short.lines.join(' ')}")`);

  // Taken: the fare paid, the clock run to the landing, the company there and rested; no food eaten,
  // the dead still dead.
  party.gold = 200;
  const went = take(BOAT, world, party);
  ok(went.taken && party.gold === 50 && world.state.mapId === 'fx_isle' && world.state.x === 2 && world.state.y === 1, 'the boat taken costs its fare and lands the company on the isle');
  ok(world.state.minutes === at(2, 6) && world.day === 2 && world.hour === 6, `the calendar has moved: day ${world.day}, ${world.hour}:00`);
  ok(hurt.hp === hurt.maxHp && hurt.sp === hurt.maxSp && isDown(dead) && dead.conditions.includes('dead') && party.food === food, 'the company lands rested, eats nothing on the way, and the dead stay dead');
  ok(went.lines.length === 1 && /ashore/.test(went.lines[0]), `it says it landed ("${went.lines[0]}")`);

  // A save made on the isle loads there.
  const data = deserialize(serialize(world.state, party, 0));
  const loaded = new World(maps(), data.party, makeRng(1), data.world);
  ok(loaded.state.mapId === 'fx_isle' && loaded.state.x === 2 && loaded.state.minutes === at(2, 6) && data.party.gold === 50, 'a save made on the isle loads there, on the day it landed');

  // Free once its `free` holds: the fare waived, never the boat.
  party.flags.fx_free = 1;
  ok(fareOf(BOAT, world) === 0 && offerLine(BOAT, world).includes('free') && payLabel(BOAT, world) === 'Board', 'once its free holds the crossing costs nothing');
  delete party.flags.fx_free;

  // The atlas: a boat both ways is one way by sea, travelled both ways; a coach is a way of its own.
  const edges = zoneEdges(ATLAS, [...MAP_DEFS, PORT, ISLE, TOWN]);
  const sea = edges.filter((e) => !e.planned && e.kind === 'sea' && [e.from, e.to].sort().join() === 'fx_isle,fx_port');
  const coach = edges.find((e) => !e.planned && e.kind === 'coach' && e.from === 'fx_port' && e.to === 'fx_town');
  ok(sea.length === 1 && sea[0].both && !!coach && !coach.both, 'a boat each way is one way by sea, both ways; a coach one way is a coach way, one way');

  // The gate: a landing on a map is a way in to it, and so is the gate of a town a crossing lands in.
  const ways = landings([PORT, ISLE, TOWN], 'thornmark');
  ok(ways.length === 1 && ways[0].x === 23 && ways[0].y === 5 && ways[0].by === 'coach from fx_port through fx_town', `a coach to a town makes the town's way out a way in to the zone (${ways.map((w) => `${w.by} ${w.x},${w.y}`).join('; ')})`);
  ok(landings([PORT, ISLE, TOWN], 'fx_isle').length === 1, 'and a boat to the isle makes its landing one');
}
