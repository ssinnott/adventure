// Monster groups on the map: stepping toward the party, encounters, respawn, the truce after
// fleeing, the Cut Stone's tear closing on the Warden's death and the Rift that stops coming back
// with it, the groups that walk only in their hours or only after a step, the flags a group sets as
// it falls, the groups that leave once their `until` holds, standing or not, and a kind's look said
// the first time it is seen or fought, and never again.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World, FOG } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { GameMap } from '../../src/game/map.ts';
import type { EncounterDef } from '../../src/game/map.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { MINUTES_PER_DAY, dateAt } from '../../src/game/calendar.ts';
import { findWeather } from '../../src/game/weather.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { CLIMATES, MONSTERS, TABLES } from '../../src/content/index.ts';
import { restRefused } from '../../src/game/wilds.ts';
import { NORTH } from '../../src/game/types.ts';
import { newWalk, gone } from '../kit/walk.ts';
import { ok, withDefs, fxFlag } from './lib.ts';

export function monsters(): void {
  const rng = makeRng(3);
  const party = defaultParty(TABLES, rng);
  const world = new World(TABLES, buildMaps(), party, rng);
  world.travel('shelf', 16, 4, 2);
  const shelf = world.zone!;
  const rats = world.liveGroups().find((g) => g.def.id === 'road_rats')!;
  ok(rats.state.x === shelf.x + 16 && rats.state.y === shelf.y + 7, 'the road rats start where the Foreland puts them, on the outdoors');
  const r = world.move('forward');
  ok(rats.state.y === shelf.y + 6, `an aware group steps toward the party (${rats.state.x - shelf.x},${rats.state.y - shelf.y} on the Foreland)`);
  ok(r.kind === 'moved' && !!r.encounter && r.encounter.includes('road_rats'), 'a group that reaches the party triggers an encounter');
  world.killGroups(['road_rats']);
  ok(!world.liveGroups().some((g) => g.def.id === 'road_rats'), 'a killed group is gone');
  world.advance(1440);
  ok(world.liveGroups().some((g) => g.def.id === 'road_rats'), 'and returns after its respawn time');
  // Truce after fleeing.
  const back = world.state.y;
  world.flee(['road_rats']);
  ok(world.state.truce === 4 && world.state.y === back - 1, 'fleeing steps the party back and grants a truce');
  ok(world.adjacentGroups().length === 0, 'the fled group does not re-engage during the truce');
  // The Cut Stone: the tear closes when the Warden of the Cut dies, not as the party walks up to it.
  const cut = new World(TABLES, buildMaps(), defaultParty(TABLES, makeRng(6)), makeRng(6));
  cut.travel('grove2', 7, 8, 1); cut.killGroups(['g2_hand']);
  const up = cut.move('forward');
  ok(up.kind === 'moved' && !!up.encounter?.includes('g2_warden') && !up.messages.some((m) => /tear closes/.test(m)), 'stepping up to the Warden of the Cut starts the fight, and nothing yet says the tear has closed');
  ok(cut.killGroups(['g2_warden']).some((m) => /tear closes/.test(m)) && cut.killGroups(['g2_hand']).length === 0, 'beating the Warden is what closes the tear, and a group with nothing to say says nothing');
  // The Rift stops coming back once the tear is closed; the rest of Thornmark does not.
  {
    const w = new World(TABLES, buildMaps(), defaultParty(TABLES, makeRng(7)), makeRng(7));
    w.travel('thornmark', 13, 18, 2);
    const live = (id: string): boolean => w.liveGroups().some((g) => g.def.id === id);
    w.killGroups(['tm_hounds']); w.advance(2880);
    ok(live('tm_hounds'), 'the rift hounds come back while the Warden of the Cut stands');
    w.ensureMapState('grove2').groups.g2_warden.dead = w.state.minutes;
    ok(live('tm_hounds'), 'and a Rift group standing when the tear closes stays until it is killed');
    w.killGroups(['tm_hounds', 'tm_elders', 'tm_wolves1']); w.advance(2880);
    ok(!live('tm_hounds') && !live('tm_elders') && live('tm_wolves1'), 'once the Warden is dead the hounds and the elders stay dead, and the wolves still come back');
  }
  // A time to walk: a doctored group beside the party in Helmstow, with and without it (and others
  // in its square, by their ids, for a fall's flags).
  const beside = (change: Partial<EncounterDef>, others: Record<string, Partial<EncounterDef>> = {}): { w: World; id: string } => {
    const rng = makeRng(3), maps = buildMaps(), first = new World(TABLES, buildMaps(), defaultParty(TABLES, rng), rng);
    const h = maps.harrow.def, rats = maps[OUTDOORS].encounters[0];
    const group = (id: string, c: Partial<EncounterDef>): EncounterDef => ({ ...rats, id, x: first.state.x, y: first.state.y - 1, roams: false, respawn: undefined, ...c });
    maps.harrow = new GameMap({ ...h, encounters: [...(h.encounters ?? []), group('test_rats', change), ...Object.entries(others).map(([id, c]) => group(id, c))] });
    return { w: new World(TABLES, maps, first.party, makeRng(1), first.state), id: 'test_rats' };
  };
  const at = (w: World, minutes: number): void => { w.state.minutes = minutes; };
  const there = (w: World): boolean => w.liveGroups().some((g) => g.def.id === 'test_rats');
  const fights = (w: World): boolean => w.adjacentGroups().includes('test_rats') && !!w.groupAt(w.state.x, w.state.y - 1);
  const noon = 12 * 60 + 10 * MINUTES_PER_DAY, midnight = 10 * MINUTES_PER_DAY;
  {
    const { w } = beside({ when: { hours: 'night' } });
    at(w, noon);
    ok(!there(w) && !fights(w), 'a group that walks by night is not there at noon: not drawn, in the way or fought');
    at(w, midnight);
    ok(there(w) && fights(w), 'and is there at midnight, where it stood');
    const plain = beside({}).w;
    at(plain, noon); const a = there(plain); at(plain, midnight);
    ok(a && there(plain), 'the same group with no time to walk is there at both');
    const day = beside({ when: { hours: 'day' } }).w;
    at(day, noon); const b = there(day); at(day, midnight);
    ok(b && !there(day), 'and one that walks by day, the other way round');
  }
  {
    const { w } = beside({ when: { sky: 'fog' } }), c = w.climate, seed = w.state.weatherSeed!;
    const foggy = findWeather(seed, noon, c, (x) => x.fog >= FOG), clear = findWeather(seed, noon, c, (x) => x.fog < 0.1);
    at(w, foggy); const a = there(w); at(w, clear);
    ok(foggy > 0 && clear > 0 && a && !there(w), `a group that walks in fog is there in fog (at minute ${foggy}) and not in the clear (${clear})`);
  }
  {
    const { w } = beside({ when: { season: 'winter' } });
    let winter = 0, summer = 0;
    for (let d = 0; d < 400 && (!winter || !summer); d++) { const m = noon + d * MINUTES_PER_DAY, s = dateAt(m).season; if (s === 'winter') winter ||= m; if (s === 'summer') summer ||= m; }
    at(w, winter); const a = there(w); at(w, summer);
    ok(a && !there(w), 'a group that walks in winter is there in winter and not in summer');
    const either = beside({ when: [{ season: 'summer', hours: 'night' }, { season: 'winter' }] }).w;
    at(either, winter); const b = there(either); at(either, summer); const c = there(either); at(either, summer - 12 * 60);
    ok(b && !c && there(either), 'of a list any entry will do, and an entry\'s parts all hold');
  }
  {
    const { w } = beside({ after: { flag: fxFlag('test_flag') } });
    ok(!there(w) && !fights(w), 'a group with an after is not there before it holds');
    w.party.flags.test_flag = 1;
    const g = w.liveGroups().find((x) => x.def.id === 'test_rats');
    ok(!!g && g.state.dead === -1 && g.state.x === w.state.x && g.state.y === w.state.y - 1, 'and stands alive at its square once it does');
  }
  // A group's fall sets its flags (#636): in the call that marks it dead, before any step, kept in a
  // save as any flag is, and read at the very next look by the groups held until or after one.
  {
    const { w } = beside({ sets: fxFlag('test_flag') }, {
      test_list: { sets: [fxFlag('test_a'), fxFlag('test_b')], slainText: 'The test falls.' },
      test_plain: { respawn: 60 },
      test_held: { respawn: 60, until: { flag: fxFlag('test_flag') } },
      test_after: { after: { flag: fxFlag('test_flag') } },
    });
    const flags = (x: World): string => Object.keys(x.party.flags).filter((f) => f.startsWith('test_')).sort().join();
    const live = (x: World): string => x.liveGroups().map((g) => g.def.id).filter((id) => id.startsWith('test_')).sort().join();
    const before = JSON.stringify(w.party.flags);
    ok(!w.killGroups(['test_plain', 'test_held']).length && JSON.stringify(w.party.flags) === before, 'a group with no flags to set sets none as it falls, and says nothing');
    w.state.minutes += 60; // both are due back, and nothing has looked
    ok(!w.killGroups(['test_rats']).length && flags(w) === 'test_flag', 'a group\'s fall sets its flag in the call that marks it dead, before any step');
    ok(live(w) === 'test_after,test_list,test_plain', `and at the very next look the group held until it stays dead and the one held after it is there, as the one held by nothing comes back (${live(w)})`);
    ok(w.killGroups(['test_list']).join() === 'The test falls.' && flags(w) === 'test_a,test_b,test_flag', 'a group with a list sets every flag on it, as its slainText is said');
    const saved = deserialize(serialize(w.state, w.party, 1)), again = new World(TABLES, w.maps, saved.party, makeRng(1), saved.world);
    ok(flags(again) === 'test_a,test_b,test_flag' && live(again) === 'test_after,test_plain', `and the flags a fall sets are kept in a save and a load, as any flag is (${flags(again)}; ${live(again)})`);
  }
  // The leave rule (#747): a group that leaves is gone once its `until` holds, standing or killed,
  // while one beside it that does not stays standing. Leaving is no kill, and nothing is saved.
  {
    const { w } = beside({ leaves: true, until: { flag: fxFlag('test_flag') }, sets: fxFlag('test_fell'), slainText: 'The test falls.' }, {
      test_stays: { until: { flag: fxFlag('test_flag') } },
      test_back: { leaves: true, respawn: 60, until: { flag: fxFlag('test_flag') } },
      test_swarm: { leaves: true, after: { flag: fxFlag('test_wrong') }, until: { flag: fxFlag('test_flag') } },
    });
    const live = (x: World): string => x.liveGroups().map((g) => g.def.id).filter((id) => id.startsWith('test_')).sort().join();
    const seen = (): boolean => w.groupsInSight().some((g) => g.def.id === 'test_rats');
    w.state.facing = NORTH; w.party.flags.test_wrong = 1;
    ok(live(w) === 'test_back,test_rats,test_stays,test_swarm' && seen() && fights(w) && !!restRefused(w), `before its until holds a group that leaves stands as any: drawn, in the way, fought and in the way of a rest (${live(w)})`);
    const record = JSON.stringify(w.mapState.groups.test_rats);
    w.killGroups(['test_back']); w.party.flags.test_flag = 1; w.state.minutes += 60; // the killed one is due back
    ok(live(w) === 'test_stays' && !seen() && !w.adjacentGroups().includes('test_rats'), `once it holds the groups that leave are gone, standing or killed, and the one that does not stays standing (${live(w)})`);
    w.killGroups(['test_stays']);
    ok(!live(w) && !w.groupAt(w.state.x, w.state.y - 1) && !restRefused(w), 'and with that one killed nothing is drawn, met, in the way or in the way of a rest');
    ok(!w.party.flags.test_fell && JSON.stringify(w.mapState.groups.test_rats) === record, 'a group that has left was not killed: its flag is not set and its record is as it stood');
    const saved = deserialize(serialize(w.state, w.party, 1)), again = new World(TABLES, w.maps, saved.party, makeRng(1), saved.world);
    ok(!live(again) && JSON.stringify(again.mapState.groups.test_rats) === record, `and after a save and a load it is gone still, with nothing new saved (${live(again)})`);
  }
  // The leave rule walked as tools/kit/walk.ts walks the road: Helmstow as a fixture, a guard beside the
  // company and, on the company's square, the word that sends it off.
  {
    const w = newWalk(ok), world = w.world, { x, y } = world.state, h = world.maps.harrow.def, rats = world.maps[OUTDOORS].encounters[0];
    const word = 'Word comes up the street. The guard goes with it.';
    world.maps.harrow = new GameMap({ ...h,
      features: [...(h.features ?? []), { kind: 'event', id: 'test_word', x, y, once: true, text: word, sets: fxFlag('test_word') }],
      encounters: [...(h.encounters ?? []), { ...rats, id: 'test_guard', x, y: y - 1, roams: false, respawn: undefined, leaves: true, until: { flag: fxFlag('test_word') }, sets: fxFlag('test_fell'), slainText: 'The guard falls.' }] });
    world.ensureMapState('harrow');
    ok(world.adjacentGroups().includes('test_guard') && !!restRefused(world), 'the guard stands beside the company in Helmstow, in the way of a rest');
    const said = world.eventsHere();
    ok(said.includes(word) && !said.includes('The guard falls.') && !restRefused(world) && !w.party.flags.test_fell, `the word comes and the guard goes with no fight: its fall unsaid, its flag unset and nothing in the way of a rest (${said.join(' ')})`);
    gone(w, 'harrow:test_guard');
  }
  // A look: said once, the first time a group of the kind comes into sight or into a fight. The
  // content has none yet, so the rat and the wolf are given one for the while.
  withDefs(MONSTERS, [{ ...MONSTERS.rat, look: 'A rat the size of a dog.' }, { ...MONSTERS.wolf, look: 'A grey wolf, lean with hunger.' }], () => {
    const fresh = (facing: 0 | 2): World => { const r = makeRng(3), w = new World(TABLES, buildMaps(), defaultParty(TABLES, r), r); w.travel('shelf', 16, 4, facing); return w; };
    const behind = fresh(0);
    ok(!behind.sightings().length && !behind.state.met!.includes('rat'), 'the road rats behind the party are not seen, nor met');
    const w = fresh(2);
    const first = w.sightings();
    ok(first.join() === 'A rat the size of a dog.' && w.state.met!.join() === 'rat', `the road rats three squares ahead are seen, and said (${first.join() || 'nothing'})`);
    ok(!w.sightings().length && fresh(2).sightings().length === 1, 'and not said again, though a new company sees them anew');
    const sees = (x: World): string[] => x.groupsInSight().map((g) => g.def.id);
    const night = fresh(2); night.state.minutes = 10 * 1440;
    ok(night.sight === 2 && !sees(night).includes('road_rats') && !night.sightings().length, 'at midnight the same rats, three squares off in two of sight, are not seen');
    const mill = fresh(2); mill.travel('mill', 8, 1, 1); mill.state.light = 50;
    ok(sees(mill).includes('m_cult1'), 'the mill\'s cultists are seen from the square beside them, lit');
    mill.travel('mill', 6, 1, 1);
    ok(mill.sight === 4 && !sees(mill).includes('m_cult1'), 'and not through the wall between, from 6,1 facing east, lit though it is');
    const again = new World(TABLES, buildMaps(), w.party, makeRng(1), deserialize(serialize(w.state, w.party, 1)).world);
    ok(!again.sightings().length && again.state.met!.includes('rat'), 'nor after a save and a load');
    ok(w.meet(['rat', 'rat', 'wolf']).join() === 'A grey wolf, lean with hunger.' && !w.meet(['wolf']).length, 'a fight says the kinds in it not met before, once');
    const step = fresh(2), moved = step.move('forward');
    const at = moved.kind === 'moved' ? moved.messages.indexOf('A rat the size of a dog.') : -1;
    ok(at >= 0 && moved.kind === 'moved' && !!moved.encounter, 'a step that brings a group into sight and into a fight says its look with the step, before the fight');
  });
}
