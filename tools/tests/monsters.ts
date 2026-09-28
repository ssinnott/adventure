// Monster groups on the map: stepping toward the party, encounters, respawn, the truce after
// fleeing, the Cut Stone's tear closing on the Warden's death and the Rift that stops coming back
// with it, and the groups that walk only in their hours or only after a step.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World, FOG } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { GameMap } from '../../src/game/map.ts';
import type { EncounterDef } from '../../src/game/map.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { MINUTES_PER_DAY, dateAt } from '../../src/game/calendar.ts';
import { findWeather } from '../../src/game/weather.ts';
import { CLIMATES } from '../../src/content/index.ts';
import { ok } from './lib.ts';

export function monsters(): void {
  const rng = makeRng(3);
  const party = defaultParty(rng);
  const world = new World(buildMaps(), party, rng);
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
  const cut = new World(buildMaps(), defaultParty(makeRng(6)), makeRng(6));
  cut.travel('grove2', 7, 8, 1); cut.killGroups(['g2_hand']);
  const up = cut.move('forward');
  ok(up.kind === 'moved' && !!up.encounter?.includes('g2_warden') && !up.messages.some((m) => /tear closes/.test(m)), 'stepping up to the Warden of the Cut starts the fight, and nothing yet says the tear has closed');
  ok(cut.killGroups(['g2_warden']).some((m) => /tear closes/.test(m)) && cut.killGroups(['g2_hand']).length === 0, 'beating the Warden is what closes the tear, and a group with nothing to say says nothing');
  // The Rift stops coming back once the tear is closed; the rest of Thornmark does not.
  {
    const w = new World(buildMaps(), defaultParty(makeRng(7)), makeRng(7));
    w.travel('thornmark', 13, 18, 2);
    const live = (id: string): boolean => w.liveGroups().some((g) => g.def.id === id);
    w.killGroups(['tm_hounds']); w.advance(2880);
    ok(live('tm_hounds'), 'the rift hounds come back while the Warden of the Cut stands');
    w.ensureMapState('grove2').groups.g2_warden.dead = w.state.minutes;
    ok(live('tm_hounds'), 'and a Rift group standing when the tear closes stays until it is killed');
    w.killGroups(['tm_hounds', 'tm_elders', 'tm_wolves1']); w.advance(2880);
    ok(!live('tm_hounds') && !live('tm_elders') && live('tm_wolves1'), 'once the Warden is dead the hounds and the elders stay dead, and the wolves still come back');
  }
  // A time to walk: a doctored group beside the party in Helmstow, with and without it.
  const beside = (change: Partial<EncounterDef>): { w: World; id: string } => {
    const rng = makeRng(3), maps = buildMaps(), first = new World(buildMaps(), defaultParty(rng), rng);
    const h = maps.harrow.def, rats = maps[OUTDOORS].encounters[0];
    maps.harrow = new GameMap({ ...h, encounters: [...(h.encounters ?? []), { ...rats, id: 'test_rats', x: first.state.x, y: first.state.y - 1, roams: false, respawn: undefined, ...change }] });
    return { w: new World(maps, first.party, makeRng(1), first.state), id: 'test_rats' };
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
    const { w } = beside({ when: { sky: 'fog' } }), c = CLIMATES[w.map.def.region ?? 'shelf'], seed = w.state.weatherSeed!;
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
    const { w } = beside({ after: { flag: 'test_flag' } });
    ok(!there(w) && !fights(w), 'a group with an after is not there before it holds');
    w.party.flags.test_flag = 1;
    const g = w.liveGroups().find((x) => x.def.id === 'test_rats');
    ok(!!g && g.state.dead === -1 && g.state.x === w.state.x && g.state.y === w.state.y - 1, 'and stands alive at its square once it does');
  }
}
