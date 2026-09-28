// Dens (#88), on a fixture field, since the boxes place them (#68, #69, #71): a rookery, its keepers
// beside it and three brood groups at their posts. While it stands its brood come back one a pace;
// its keepers dead, it burns once, gives its hoard once and breeds no more, through a save and a
// load. Its look is said once, on first sight. Then the den's rules, held over every map.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { World, MINUTES_PER_DAY } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { serialize, deserialize, SAVE_VERSION } from '../../src/game/save.ts';
import { NORTH, SOUTH, manhattan } from '../../src/game/types.ts';
import { approach, burn, burnt, denBurnt, hoardLine, keepersDead, lookKey } from '../../src/game/dens.ts';
import type { Den } from '../../src/game/dens.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { MAP_DEFS, MONSTERS } from '../../src/content/index.ts';
import { CONTENT, collect, compare } from '../shipped.ts';
import { judge, measure } from './density.ts';
import { lineFaults, texts } from './pillars.ts';
import { condFaults } from './quests.ts';
import { presenceFaults } from './structure.ts';
import { ok } from './lib.ts';

const DEN: Den = {
  kind: 'den', x: 6, y: 3, id: 'r_den', name: 'A rookery', text: 'Nests of sticks crowd the willows, and the crows watch you come.',
  breeds: ['rat'], keepers: 'r_keepers', brood: ['r_brood1', 'r_brood2', 'r_brood3'],
  ask: 'The old birds are dead. Burn the rookery?', burn: 'Burn it.', burnt: 'The nests go up like tinder, and the crows scatter.',
  ruin: 'Black stumps, and no crow left to watch.', gold: 40, items: ['key_iron'],
};
const PACE = 1440, UNTIL = denBurnt('rookery', DEN.id);
const FIXTURE: MapDef = {
  id: 'rookery', name: 'Rookery', kind: 'outdoor', density: 'country',
  start: { x: 0, y: 0, facing: NORTH },
  rows: Array.from({ length: 7 }, () => ','.repeat(13)),
  features: [DEN],
  encounters: [
    { id: 'r_keepers', x: 7, y: 3, monsters: ['wolf', 'wolf', 'wolf'], roams: false },
    { id: 'r_brood1', x: 1, y: 1, monsters: ['rat', 'rat'], respawn: PACE, until: UNTIL },
    { id: 'r_brood2', x: 11, y: 1, monsters: ['rat', 'rat'], respawn: PACE, until: UNTIL },
    { id: 'r_brood3', x: 1, y: 5, monsters: ['rat', 'rat'], respawn: PACE, until: UNTIL },
  ],
};

/**
 * What is wrong with a map's dens: a kind that is no monster; keepers that are no group of the map,
 * stand on it or away from it, or leave it (they roam, come back, walk by the hours or after a step,
 * or have an end); brood that is no group of the map, is the keepers or another den's, never comes
 * back, stops at anything but the den's burning or holds a stranger to its kind.
 */
export function denFaults(def: MapDef): string[] {
  const out: string[] = [], group = (id: string) => def.encounters?.find((e) => e.id === id), bred = new Map<string, string>();
  for (const f of def.features ?? []) {
    if (f.kind !== 'den') continue;
    const at = `${def.id}'s den ${f.id}`, until = JSON.stringify(denBurnt(def.id, f.id));
    if (!f.breeds.length) out.push(`${at} breeds nothing`);
    for (const m of f.breeds) if (!(m in MONSTERS)) out.push(`${at} breeds ${m}, which is no monster`);
    const k = group(f.keepers);
    if (!k) out.push(`${at}: its keepers ${f.keepers} are no group of the map`);
    else {
      const d = manhattan(k.x, k.y, f.x, f.y);
      if (d !== 1) out.push(`${at}: its keepers stand ${d ? `${d} squares off` : 'on it'}, not beside it`);
      if (k.roams !== false) out.push(`${at}: its keepers roam`);
      if (k.respawn) out.push(`${at}: its keepers come back`);
      if (k.when || k.after || k.until) out.push(`${at}: its keepers are not always there`);
    }
    if (!f.brood.length) out.push(`${at} has no brood`);
    for (const id of f.brood) {
      const b = group(id);
      if (!b) { out.push(`${at}: its brood ${id} is no group of the map`); continue; }
      if (id === f.keepers) out.push(`${at}: its keepers are its brood`);
      if (bred.has(id)) out.push(`${at}: its brood ${id} is ${bred.get(id)}'s too`);
      bred.set(id, f.id);
      if (!b.respawn) out.push(`${at}: its brood ${id} never comes back`);
      if (JSON.stringify(b.until) !== until) out.push(`${at}: its brood ${id} does not stop at its burning`);
      const strangers = [...new Set(b.monsters.filter((m) => !f.breeds.includes(m)))];
      if (strangers.length) out.push(`${at}: its brood ${id} holds ${strangers.join(', ')}, not its kind`);
    }
  }
  return out;
}

const fresh = (def: MapDef = FIXTURE): { world: World; party: Party } => {
  const rng = makeRng(5), party = defaultParty(rng);
  return { world: new World({ [def.id]: new GameMap(def) }, party, rng), party };
};
const abroad = (w: World): number => w.liveGroups().filter((g) => DEN.brood.includes(g.def.id)).length;
const later = (w: World, minutes: number): number => { w.advance(minutes); return abroad(w); };
const withDen = (patch: Partial<Den>, groups?: (e: NonNullable<MapDef['encounters']>[number]) => NonNullable<MapDef['encounters']>[number]): MapDef =>
  ({ ...FIXTURE, features: [{ ...DEN, ...patch }], encounters: groups ? FIXTURE.encounters!.map(groups) : FIXTURE.encounters });

export function dens(): void {
  // Placed: parsed, a point of interest and no sign, its lines fitting the log, its rules held.
  const m = new GameMap(FIXTURE);
  ok(m.passable(DEN.x, DEN.y) === 'ok', 'a den stands on open ground of a parsed map');
  const r = measure(FIXTURE);
  ok(r.points === 5 && r.signs === 0 && !judge(FIXTURE).why, `it and its keepers count as points, and neither as a sign (${r.points} points, ${r.signs} signs, ${judge(FIXTURE).why || 'inside the country floor'})`);
  ok(!denFaults(FIXTURE).length && !presenceFaults(FIXTURE, [FIXTURE]).length, `its keepers and brood keep the den's rules${[...denFaults(FIXTURE), ...presenceFaults(FIXTURE, [FIXTURE])].map((l) => '; ' + l).join('')}`);
  ok(!lineFaults(FIXTURE).length, `its lines fit the log${lineFaults(FIXTURE).map((l) => '; ' + l).join('')}`);
  const long = 'Nests of sticks crowd every willow along the bank, rook upon rook, and the whole black parliament of them turns its heads to watch you come.';
  ok(lineFaults(withDen({ text: long })).some((l) => l.includes("den's look")), 'a look of three lines is caught');
  ok(lineFaults(withDen({ burnt: long })).some((l) => l.includes("den's burning")), 'and a burning of three with its hoard');
  const said = texts([FIXTURE]).map((t) => t.text);
  ok([DEN.text, DEN.ask, DEN.burn, DEN.burnt, DEN.ruin!].every((t) => said.includes(t)), 'its look, its question, its answer, its burning and its ruin are among the texts the company reads');

  // Kept by its id: the brood's `until` names it, a save could hold it, its hoard is a gift.
  ok(spentId(DEN) === DEN.id && !condFaults(UNTIL, [FIXTURE]).length, `its brood's until, ${UNTIL.seen}, names it`);
  const gift = giftOf(DEN);
  ok(gift?.gold === DEN.gold && gift.items?.join() === DEN.items.join(), 'its hoard is its gift, as a chest\'s is, so the curve and the item checks count it');
  const got = collect({ ...CONTENT, defs: [FIXTURE] });
  ok(!!got.maps.rookery?.used.includes(DEN.id), `the shipped list records the den (${got.maps.rookery?.used.join(', ')})`);
  const renamed = collect({ ...CONTENT, defs: [withDen({ id: 'r_den2' })] });
  ok(compare({ version: SAVE_VERSION, ...got }, renamed).problems.some((p) => p.includes(`${DEN.id} is gone`)), 'and a den renamed is caught');

  // The pace: while it stands, its brood come back one a day, whenever they were killed.
  {
    const { world } = fresh();
    ok(abroad(world) === 3, 'three brood abroad at the start');
    world.killGroups([...DEN.brood]);
    const back = [later(world, PACE - 1), later(world, 1), later(world, PACE - 1), later(world, 1), later(world, PACE), later(world, PACE)];
    ok(back.join() === '0,1,1,2,3,3', `killed together, they come back one a pace: none before a day, one at a day, two at two, three at three (${back.join(', ')})`);
    world.killGroups(['r_brood2']); later(world, 600); world.killGroups(['r_brood1']);
    const again = [later(world, PACE - 600), later(world, 600), later(world, PACE)];
    ok(again.join() === '2,2,3', `killed apart, each is back a pace after the one before (${again.join(', ')})`);
    const away = fresh().world;
    away.killGroups([...DEN.brood]);
    ok(later(away, 5 * MINUTES_PER_DAY) === 3, 'after five days away all three are back');
  }

  // Burning it: not while its keepers live; once, with its hoard, and then it breeds no more.
  {
    const { world, party } = fresh();
    const gold = party.gold, bag = party.bag.length;
    ok(!keepersDead(world, DEN) && !approach(world, DEN).ask && !burn(world, party, DEN).length && !burnt(world, DEN), 'its keepers alive, it puts no choice and does not burn');
    world.killGroups(['r_brood1', 'r_brood2', 'r_brood3']);
    later(world, PACE);
    world.killGroups([DEN.keepers]);
    ok(keepersDead(world, DEN) && approach(world, DEN).ask, 'its keepers dead, stepping in puts the choice');
    const lines = burn(world, party, DEN);
    ok(burnt(world, DEN) && lines.join('\n') === `${DEN.burnt}\n${hoardLine(DEN)}` && party.gold === gold + DEN.gold && party.bag.length === bag + 1 && party.bag.includes('key_iron'), `it burns, and its hoard is the company's (${lines.join(' ')})`);
    ok(!burn(world, party, DEN).length && party.gold === gold + DEN.gold && party.bag.length === bag + 1, 'once');
    const ruin = approach(world, DEN);
    ok(!ruin.ask && ruin.lines.join() === DEN.ruin, 'and a ruin puts no choice again, only its line');
    ok(later(world, 30 * MINUTES_PER_DAY) === 1, 'thirty days on, none killed before it burnt has come back; the one abroad stays');
    world.killGroups(DEN.brood.filter((id) => world.mapState.groups[id].dead < 0));
    ok(later(world, 30 * MINUTES_PER_DAY) === 0, 'killed, it never comes back');
    // Through a save: still burnt, the brood still gone, the hoard not given twice.
    const data = deserialize(serialize(world.state, party, 0));
    const loaded = new World({ rookery: new GameMap(FIXTURE) }, data.party, makeRng(1), data.world), lgold = data.party.gold;
    ok(burnt(loaded, DEN) && later(loaded, 30 * MINUTES_PER_DAY) === 0, 'through a save and a load it stays burnt, and breeds no more');
    ok(!burn(loaded, data.party, DEN).length && data.party.gold === lgold, 'and its hoard is not given again');
  }

  // Its look: said on first sight, once, and never for a ruin.
  {
    const { world, party } = fresh();
    world.state.x = DEN.x; world.state.y = DEN.y + 3; world.state.facing = NORTH;
    world.state.minutes = 12 * 60;
    const first = world.sightings();
    ok(first[0] === DEN.text, `three squares off, facing it, the company hears its look (${first.join(' | ')})`);
    ok(!world.sightings().includes(DEN.text), 'once');
    const data = deserialize(serialize(world.state, party, 0));
    const loaded = new World({ rookery: new GameMap(FIXTURE) }, data.party, makeRng(1), data.world);
    ok(loaded.used(lookKey(DEN)) && !loaded.sightings().includes(DEN.text), 'nor again after a save and a load');
    const side = fresh().world;
    side.state.x = DEN.x; side.state.y = DEN.y + 3; side.state.facing = SOUTH;
    ok(!side.sightings().includes(DEN.text), 'not with its back to it');
    const ash = fresh().world;
    ash.markUsed(DEN.id); ash.state.x = DEN.x; ash.state.y = DEN.y + 3; ash.state.facing = NORTH;
    ok(!ash.sightings().includes(DEN.text), 'and not for a den already burnt');
  }

  // The den's rules, each broken on purpose.
  const keepers = (patch: object) => (e: NonNullable<MapDef['encounters']>[number]) => (e.id === DEN.keepers ? { ...e, ...patch } : e);
  const brood = (patch: object) => (e: NonNullable<MapDef['encounters']>[number]) => (e.id === 'r_brood2' ? { ...e, ...patch } : e);
  const broken: [string, MapDef, string][] = [
    ['keepers on the den', withDen({}, keepers({ x: DEN.x, y: DEN.y })), 'on it'],
    ['keepers that roam', withDen({}, keepers({ roams: true })), 'roam'],
    ['keepers that come back', withDen({}, keepers({ respawn: PACE })), 'come back'],
    ['keepers that walk by night', withDen({}, keepers({ when: { hours: 'night' } })), 'not always there'],
    ['a brood group without its until', withDen({}, brood({ until: undefined })), 'does not stop'],
    ['a brood group with a stranger', withDen({}, brood({ monsters: ['rat', 'wolf'] })), 'holds wolf'],
    ['a brood group that never comes back', withDen({}, brood({ respawn: undefined })), 'never comes back'],
    ['a kind that is no monster', withDen({ breeds: ['rook'] }), 'no monster'],
  ];
  for (const [what, def, needle] of broken) {
    const f = denFaults(def);
    ok(f.some((l) => l.includes(needle)), `${what} is caught (${f.join('; ') || 'passes'})`);
  }

  // Every den placed keeps them.
  const placed = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'den'));
  const faults = MAP_DEFS.flatMap(denFaults);
  ok(!faults.length, `every den in the content keeps the den's rules (${placed.length} placed)${faults.map((l) => '; ' + l).join('')}`);
}
