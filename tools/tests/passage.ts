// Crossings (#164; game/passage.ts): a person sells passage by coach or boat. It leaves at its hour,
// lands its days later at its own, costs the company its fare and nothing else, lands it rested, and
// a save made at the far end loads there. Half once its `half` holds, free once its `free` does; a
// warning, never a refusal, to a company under the far end's floor. On the atlas a boat is a way by
// sea and a coach a way of its own, each travelled both ways where a crossing runs back; the gate
// counts its landing as a way in. The crossings between towns (#539, content/crossings.ts) run on
// the atlas's links, are sold at either end once both ends land, and never toward a town not built.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Passage } from '../../src/game/map.ts';
import { NORTH, EAST } from '../../src/game/types.ts';
import { World, MINUTES_PER_DAY } from '../../src/game/world.ts';
import { defaultParty, isDown } from '../../src/game/party.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { clock } from '../../src/game/calendar.ts';
import { departure, arrival, take, terms, offerLine, payLabel, fareOf } from '../../src/game/passage.ts';
import { zoneEdges } from '../../src/game/atlas.ts';
import type { Atlas, LinkKind } from '../../src/game/atlas.ts';
import { ATLAS, MAP_DEFS } from '../../src/content/index.ts';
import { CROSSINGS, sells } from '../../src/content/crossings.ts';
import type { Crossing } from '../../src/content/crossings.ts';
import { landings } from './gate.ts';
import { ok } from './lib.ts';

const BOAT: Passage = { to: 'fx_isle', x: 2, y: 1, facing: NORTH, name: 'The isle', by: 'boat', fare: 150, departs: 20, days: 1, arrives: 6, free: { flag: 'fx_free' }, half: { flag: 'fx_half' } };
const BACK: Passage = { to: 'fx_port', x: 1, y: 1, name: 'The port', by: 'boat', fare: 150, departs: 20, days: 1, arrives: 6 };
const COACH: Passage = { to: 'fx_town', x: 1, y: 1, name: 'The town', by: 'coach', fare: 80, departs: 6, days: 2, arrives: 18, label: 'The coach rattles in.' };

const town = (id: string, band: [number, number], features: MapDef['features'] = [], exits: MapDef['exits'] = []): MapDef =>
  ({ id, name: id, kind: 'town', band, start: { x: 1, y: 1, facing: NORTH }, rows: ['#####', '#...#', '#####'], features, exits });
const PORT = town('fx_port', [1, 4], [{ kind: 'npc', x: 3, y: 1, name: 'A boatman', lines: ['"The isle?"'], passage: [BOAT, COACH] }]);
const ISLE = town('fx_isle', [12, 14], [{ kind: 'npc', x: 3, y: 1, name: 'A boatman', lines: ['"Back?"'], passage: [BACK] }]);
const TOWN = town('fx_town', [5, 10], [], [{ x: 3, y: 1, to: 'thornmark', tx: 23, ty: 5 }]);

// A crossing between two towns (#539), written once with both ends, and sold at each by `sells`.
const DROVE: Crossing = {
  name: 'the fixture coach', by: 'coach', fare: 250, departs: 6, days: 1, arrives: 12,
  ends: [{ at: 'fx_haven', name: 'Haven', landing: { x: 1, y: 1, facing: EAST } }, { at: 'fx_lodge', name: 'Lodge', landing: { x: 1, y: 1, facing: EAST } }],
};
const HAVEN = town('fx_haven', [16, 18], [{ kind: 'npc', x: 2, y: 1, name: 'A coachman', lines: ['"Lodge?"'], passage: sells('fx_haven', DROVE) }], [{ x: 3, y: 1, to: 'thornmark', tx: 23, ty: 5 }]);
const LODGE = town('fx_lodge', [20, 22], [{ kind: 'npc', x: 2, y: 1, name: 'A coachman', lines: ['"Haven?"'], passage: sells('fx_lodge', DROVE) }], [{ x: 3, y: 1, to: 'thornmark', tx: 24, ty: 5 }]);

/** Whether a crossing may put a company down on a square of a map: open ground, never tidal (drowned at high water) nor a way out. */
const openGround = (def: MapDef, x: number, y: number): boolean => {
  const m = new GameMap(def);
  return m.passable(x, y) === 'ok' && m.at(x, y).terrain !== 'tidal' && !m.exitAt(x, y);
};

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
      if (!openGround(far, p.x, p.y)) out.push(`${what}: lands on ${p.x},${p.y}, which is not open ground`);
      if (![p.departs, p.arrives].every((h) => h >= 0 && h < 24) || p.days < 0 || p.fare < 0 || (p.days === 0 && p.arrives <= p.departs)) out.push(`${what}: its hours, days or fare are off the clock`);
    }
  }
  return out;
}

/** The kind of way on the atlas a crossing runs on. */
const WAY: Record<Passage['by'], LinkKind> = { boat: 'sea', coach: 'coach' };
/** A fare's rule (#539): 12.5 gold a level of the dearer end's floor for each day, as Kitto's boat is 150 for a night to Wrackholm's 12. */
export const fareRule = (floor: number, days: number): number => Math.round(12.5 * floor * days);

/**
 * What is wrong with the crossings between towns (#539): one on no way of its kind the atlas charts
 * between its two ends, or a crossing way the atlas charts between two towns that runs none; terms
 * off the clock, a crossing that costs no day, or a fare off its rule; an end that is no town on the
 * atlas, a built town that writes nowhere to land or lands off open ground, an end not built that
 * writes a landing or names no issue that owes it, or one that lands and still names one; and a
 * crossing both ends land that nobody at one of them sells.
 */
export function crossingFaults(crossings: readonly Crossing[], atlas: Pick<Atlas, 'places' | 'links'>, defs: readonly MapDef[]): string[] {
  const out: string[] = [];
  const same = (a: string, b: string, c: string, d: string): boolean => (a === c && b === d) || (a === d && b === c);
  const town = (id: string): Atlas['places'][number] | undefined => atlas.places.find((p) => p.id === id && p.kind === 'town');
  const built = (id: string): MapDef | undefined => defs.find((d) => d.id === id);
  for (const c of crossings) {
    const [a, b] = c.ends;
    if (!atlas.links.some((l) => l.kind === WAY[c.by] && same(l.from, l.to, a.at, b.at))) out.push(`${c.name}: the atlas charts no ${WAY[c.by]} way between ${a.at} and ${b.at}`);
    if (![c.departs, c.arrives].every((h) => Number.isInteger(h) && h >= 0 && h < 24) || c.days < 1 || c.fare <= 0) out.push(`${c.name}: its hours, days or fare are off the clock, or it costs no day`);
    for (const e of c.ends) {
      const map = built(e.at);
      if (!town(e.at)) out.push(`${c.name}: ${e.at} is no town on the atlas`);
      if (map && !e.landing) out.push(`${c.name}: ${e.name} is built, and writes nowhere to land`);
      if (map && e.landing && !openGround(map, e.landing.x, e.landing.y)) out.push(`${c.name}: lands at ${e.name} on ${e.landing.x},${e.landing.y}, which is not open ground`);
      if (!map && e.landing) out.push(`${c.name}: ${e.name} writes a landing, and is not built`);
      if (!map && !e.landing && !e.owed) out.push(`${c.name}: ${e.name} is not built, and names no issue that owes it`);
      if (e.landing && e.owed) out.push(`${c.name}: ${e.name} lands, and still names ${e.owed}`);
    }
    const floors = c.ends.map((e) => (built(e.at)?.band ?? town(e.at)?.band)?.[0]);
    if (floors.every((f) => f !== undefined)) {
      const want = fareRule(Math.max(...(floors as number[])), c.days);
      if (c.fare !== want) out.push(`${c.name}: its fare is ${c.fare}, where its rule asks ${want}`);
    }
    // A crossing that runs one way is not honest: once both ends land, a person at each sells it.
    if (a.landing && b.landing) for (const [here, there] of [[a, b], [b, a]]) {
      const sold = (built(here.at)?.features ?? []).some((f) => f.kind === 'npc' && (f.passage ?? []).some((p) => p.to === there.at && p.by === c.by && p.fare === c.fare && p.days === c.days));
      if (!sold) out.push(`${c.name}: lands at both ends, and nobody at ${here.name} sells it`);
    }
  }
  for (const l of atlas.links) {
    if (!(l.kind === 'sea' || l.kind === 'coach') || !town(l.from) || !town(l.to)) continue;
    if (!crossings.some((c) => WAY[c.by] === l.kind && same(c.ends[0].at, c.ends[1].at, l.from, l.to))) out.push(`the atlas's ${l.kind} way between ${l.from} and ${l.to} runs no crossing`);
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

  // Half once its `half` holds, and free once its `free` does: the fare cut or waived, never the boat.
  party.flags.fx_half = 1;
  ok(fareOf(BOAT, world) === 75 && offerLine(BOAT, world).includes('75g') && payLabel(BOAT, world) === 'Pay the fare (75 gold)', 'once its half holds the crossing costs half its fare');
  ok(fareOf({ ...BOAT, fare: 25 }, world) === 12, 'an odd fare halved is rounded down');
  party.flags.fx_free = 1;
  ok(fareOf(BOAT, world) === 0 && offerLine(BOAT, world).includes('free') && payLabel(BOAT, world) === 'Board', 'once its free holds the crossing costs nothing, half or not');
  delete party.flags.fx_free; delete party.flags.fx_half;
  ok(fareOf(BOAT, world) === 150, 'and neither holding, the whole fare');

  // The atlas: a boat both ways is one way by sea, travelled both ways; a coach is a way of its own.
  const edges = zoneEdges(ATLAS, [...MAP_DEFS, PORT, ISLE, TOWN]);
  const sea = edges.filter((e) => !e.planned && e.kind === 'sea' && [e.from, e.to].sort().join() === 'fx_isle,fx_port');
  const coach = edges.find((e) => !e.planned && e.kind === 'coach' && e.from === 'fx_port' && e.to === 'fx_town');
  ok(sea.length === 1 && sea[0].both && !!coach && !coach.both, 'a boat each way is one way by sea, both ways; a coach one way is a coach way, one way');

  // The gate: a landing on a map is a way in to it, and so is the gate of a town a crossing lands in.
  const ways = landings([PORT, ISLE, TOWN], 'thornmark');
  ok(ways.length === 1 && ways[0].x === 23 && ways[0].y === 5 && ways[0].by === 'coach from fx_port through fx_town', `a coach to a town makes the town's way out a way in to the zone (${ways.map((w) => `${w.by} ${w.x},${w.y}`).join('; ')})`);
  ok(landings([PORT, ISLE, TOWN], 'fx_isle').length === 1, 'and a boat to the isle makes its landing one');

  // The crossings between towns (#539): written once with both ends, sold at either end on one set
  // of terms, landing where the far end puts a company down, and never toward a town not built.
  const sold = sells('fx_haven', DROVE), one = sold[0];
  ok(sold.length === 1 && one.to === 'fx_lodge' && one.x === 1 && one.y === 1 && one.facing === EAST && one.name === 'Lodge' && one.by === 'coach' && one.fare === 250 && one.departs === 6 && one.days === 1 && one.arrives === 12,
    `a crossing sold at one end goes to the other on its terms, landing where that end puts a company down (${offerLine(one, world).replace(/\t/g, ' | ')})`);
  ok(!sells('fx_haven', { ...DROVE, ends: [DROVE.ends[0], { at: 'fx_lodge', name: 'Lodge', owed: '#0' }] }).length, 'toward a town that writes nowhere to land, its town not built, it is not sold');
  const worded: Crossing = { ...DROVE, ends: [{ ...DROVE.ends[0], warning: '"Lodge is cold."', half: { flag: 'fx_half' }, free: { flag: 'fx_free' } }, { ...DROVE.ends[1], label: 'The coach stops in the yard.' }] };
  const fromHaven = sells('fx_haven', worded)[0], fromLodge = sells('fx_lodge', worded)[0];
  ok(fromHaven.warning === '"Lodge is cold."' && JSON.stringify([fromHaven.half, fromHaven.free]) === '[{"flag":"fx_half"},{"flag":"fx_free"}]' && fromHaven.label === 'The coach stops in the yard.' && !fromLodge.warning && !fromLodge.half && !fromLodge.free && !fromLodge.label,
    'a seller\'s warning and the halving or waiving he gives go with what he sells, and an end\'s landing line with what lands there');
  let threw = '';
  try { sells('fx_nowhere', DROVE); } catch (e) { threw = e instanceof Error ? e.message : String(e); }
  ok(threw === 'the fixture coach does not run from fx_nowhere', `a town at neither end cannot sell it ("${threw}")`);

  // Bought at either end: the fare paid, the clock run to the landing, and a save made there loads there.
  const towns = (): Record<string, GameMap> => Object.fromEntries([HAVEN, LODGE].map((d) => [d.id, new GameMap(d)]));
  const crng = makeRng(539), company = defaultParty(crng), road = new World(towns(), company, crng);
  const coachman = (d: MapDef): Passage => d.features!.flatMap((f) => (f.kind === 'npc' ? f.passage ?? [] : []))[0];
  road.state.minutes = at(1, 7);
  company.gold = 600;
  const up = take(coachman(HAVEN), road, company);
  ok(up.taken && road.state.mapId === 'fx_lodge' && road.state.x === 1 && road.state.y === 1 && road.state.facing === EAST && company.gold === 350 && road.state.minutes === at(3, 12),
    `bought at Haven at 07:00, the coach leaves at 06:00 the next day and sets the company down at Lodge a day on, at 12:00 (day ${road.day}, ${road.hour}:00, ${company.gold} gold left)`);
  const kept = deserialize(serialize(road.state, company, 0)), back = new World(towns(), kept.party, makeRng(1), kept.world);
  ok(back.state.mapId === 'fx_lodge' && back.state.x === 1 && back.state.y === 1 && back.state.minutes === at(3, 12) && kept.party.gold === 350, 'a save made at Lodge loads there, on the day it landed');
  const down = take(coachman(LODGE), road, company);
  ok(down.taken && road.state.mapId === 'fx_haven' && road.state.x === 1 && road.state.y === 1 && company.gold === 100 && road.state.minutes === at(5, 12),
    `and bought back at Lodge, it sets the company down at Haven, its calendar moved again (day ${road.day}, ${road.hour}:00)`);

  // On the atlas: the crossing link the two now sell both ways is that way built, on its course and
  // under its name; sold one way only, the link stays planned beside it.
  const charted: Atlas = { ...ATLAS, links: [...ATLAS.links, { from: 'fx_lodge', to: 'fx_haven', kind: 'coach', via: [[10, 10], [20, 20]], note: 'the fixture coach' }] };
  const between = (defs: readonly MapDef[]): ReturnType<typeof zoneEdges> => zoneEdges(charted, [...MAP_DEFS, ...defs]).filter((e) => [e.from, e.to].sort().join() === 'fx_haven,fx_lodge');
  const built = between([HAVEN, LODGE]), oneWay = between([HAVEN, { ...LODGE, features: [] }]);
  ok(built.length === 1 && !built[0].planned && built[0].both && built[0].kind === 'coach' && built[0].note === 'the fixture coach' && built[0].via?.map((p) => p.join()).join(' ') === (built[0].from === 'fx_haven' ? '20,20 10,10' : '10,10 20,20'),
    `the atlas's link, the crossing sold both ways on it, is one built way, both ways, on the link's course and under its name (${built.map((e) => `${e.from} to ${e.to}, ${e.planned ? 'planned' : 'built'}, via ${e.via?.map((p) => p.join()).join(' ')}`).join('; ')})`);
  ok(oneWay.length === 2 && oneWay.some((e) => e.planned) && oneWay.some((e) => !e.planned && !e.both), 'sold one way only, the link stays planned beside it');
  // The gate: either town is a crossing's landing, so either town's way out is a way in.
  const ins = landings([HAVEN, LODGE], 'thornmark');
  ok(ins.length === 2 && ins.some((w) => w.x === 24 && w.by === 'coach from fx_haven through fx_lodge') && ins.some((w) => w.x === 23 && w.by === 'coach from fx_lodge through fx_haven'),
    `the gate counts each town's way out a way in, the coach landing there from the other (${ins.map((w) => `${w.by} ${w.x},${w.y}`).join('; ')})`);

  // The game's own: each runs on its way on the atlas, lands where its towns are built and waits on
  // those that are not, and is sold at both ends once both land; every crossing way the atlas charts
  // between two towns runs one.
  const found = crossingFaults(CROSSINGS, ATLAS, MAP_DEFS);
  for (const c of CROSSINGS) {
    const mine = found.filter((f) => f.startsWith(`${c.name}:`)), [a, b] = c.ends;
    ok(!mine.length, `${c.name}, ${a.name} and ${b.name} by ${c.by}: ${c.fare} gold and ${c.days} day${c.days === 1 ? '' : 's'}, leaving either end at ${clock(c.departs)} and landing at ${clock(c.arrives)}${mine.length ? ` (${mine.join('; ')})` : ''}`);
    for (const e of c.ends) if (!e.landing) console.log(`  n/a:  ${c.name} lands at ${e.name} once ${e.owed} builds it, and is sold toward it from then`);
  }
  const unrun = found.filter((f) => !CROSSINGS.some((c) => f.startsWith(`${c.name}:`)));
  ok(!unrun.length, `every crossing way the atlas charts between two towns runs a crossing${unrun.length ? `: ${unrun.join('; ')}` : ''}`);
  // And the check catches what it should.
  const fx: Pick<Atlas, 'places' | 'links'> = {
    places: [{ id: 'fx_haven', kind: 'town', at: [0, 0] }, { id: 'fx_lodge', kind: 'town', at: [0, 0] }, { id: 'fx_far', kind: 'town', planned: true, band: [24, 26], at: [0, 0] }, { id: 'fx_deep', kind: 'dungeon', planned: true, band: [24, 26], at: [0, 0] }],
    links: [{ from: 'fx_haven', to: 'fx_lodge', kind: 'coach' }, { from: 'fx_haven', to: 'fx_far', kind: 'sea' }, { from: 'fx_lodge', to: 'fx_far', kind: 'sea' }, { from: 'fx_haven', to: 'fx_deep', kind: 'sea' }],
  };
  const far = (end: Partial<Crossing['ends'][number]> = {}): Crossing['ends'][number] => ({ at: 'fx_far', name: 'Far', owed: '#0', ...end });
  const wrongs = crossingFaults([
    DROVE,
    { ...DROVE, name: 'w1', by: 'boat' },
    { ...DROVE, name: 'w2', fare: 300, days: 0, arrives: 18 },
    { name: 'w3', by: 'boat', fare: 600, departs: 20, days: 2, arrives: 16, ends: [{ ...DROVE.ends[0], landing: undefined }, far({ owed: undefined })] },
    { name: 'w4', by: 'boat', fare: 600, departs: 20, days: 2, arrives: 16, ends: [{ ...DROVE.ends[0], landing: { x: 0, y: 1 } }, far({ landing: { x: 1, y: 1 } })] },
    { name: 'w5', by: 'boat', fare: 600, departs: 20, days: 2, arrives: 16, ends: [{ ...DROVE.ends[0], owed: '#0' }, { at: 'fx_deep', name: 'Deep', owed: '#0' }] },
    { ...DROVE, name: 'w6', fare: 260 },
  ], fx, [HAVEN, LODGE]);
  const caught = ['w1: the atlas charts no sea way', 'w2: its hours, days or fare are off the clock', 'w3: Haven is built, and writes nowhere to land', 'w3: Far is not built, and names no issue',
    'w4: lands at Haven on 0,1', 'w4: Far writes a landing, and is not built', 'w5: fx_deep is no town', 'w5: Haven lands, and still names #0', 'w6: its fare is 260, where its rule asks 250',
    'w6: lands at both ends, and nobody at Haven sells it', 'w6: lands at both ends, and nobody at Lodge sells it', 'between fx_lodge and fx_far runs no crossing'];
  const missed = caught.filter((c) => !wrongs.some((w) => w.includes(c)));
  ok(!missed.length && !wrongs.some((w) => w.startsWith('the fixture coach:')), `the check catches a crossing off the atlas's ways, off the clock, at a town built with nowhere to land or one not built that lands, off its fare's rule or sold at one end only, and a way between towns that runs none${missed.length ? ` (missed: ${missed.join('; ')}; found: ${wrongs.join('; ')})` : ''}`);
}
