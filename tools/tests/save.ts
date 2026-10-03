// Saves: a round trip, the outdoors kept small, a save from before the weather, a version 1 save
// loaded onto the outdoors and onto a map that has since grown, a version 2 save's yes to Vask
// brought to his no, a version 3 save given its members' blessings, none, the upgrades run by version, and what a save meets on content changed since:
// a group added, a door moved off its square.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World, seen } from '../../src/game/world.ts';
import { GameMap } from '../../src/game/map.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { defaultParty } from '../../src/game/party.ts';
import { serialize, deserialize, upgrade, SAVE_VERSION } from '../../src/game/save.ts';
import { UPGRADES } from '../../src/game/upgrades.ts';
import type { SaveData } from '../../src/game/save.ts';
import { holds } from '../../src/game/quests.ts';
import { LEGACY_WEATHER_SEED } from '../../src/game/world.ts';
import type { WorldState } from '../../src/game/world.ts';
import { ok, local } from './lib.ts';

export function save(): void {
  const rng = makeRng(9);
  const party = defaultParty(rng);
  const world = new World(buildMaps(), party, rng);
  world.move('forward'); world.turn('right'); world.move('forward');
  party.flags.q_ashcombe = 1;
  world.travel('mill', 6, 11, 1); party.bag.push('key_iron'); world.move('forward');
  const text = serialize(world.state, party, 12345);
  const data = deserialize(text);
  ok(JSON.stringify(data.world) === JSON.stringify(world.state) && JSON.stringify(data.party) === JSON.stringify(party) && data.rng === 12345, 'a save round-trips the world, the party and the rng');
  const world2 = new World(buildMaps(), data.party, makeRng(1), data.world);
  ok(world2.map.at(7, 11).door === 'door', 'loading re-applies the unlocked door to fresh map content');
  ok(seen(world2.state.maps.harrow.explored, 14 * 16 + 7) && world2.state.mapId === 'mill' && world2.state.x === 7, 'loading keeps the explored cells and the position');
  { // The outdoors saves small: its cells seen are kept a bit apiece.
    world.travel('shelf', 16, 8, 2);
    const outdoors = JSON.stringify(world.state.maps[OUTDOORS]).length;
    ok(outdoors < 20_000 && seen(world.state.maps[OUTDOORS].explored, world.state.y * world.map.width + world.state.x), `the whole outdoors' state saves in ${outdoors} characters, and it knows where the party has been`);
  }
  ok(data.world.weatherSeed === world.state.weatherSeed && JSON.stringify(world2.weather) === JSON.stringify(world.weather), 'the weather seed round-trips, and with it the weather');
  // A save from before there was weather has no seed: it loads with the legacy one and keeps it.
  const old = JSON.parse(text) as { world: WorldState };
  delete old.world.weatherSeed;
  const world3 = new World(buildMaps(), data.party, makeRng(1), old.world);
  ok(world3.state.weatherSeed === LEGACY_WEATHER_SEED && world3.weather.precip >= 0 && world3.date.gameDay === world.date.gameDay, 'a save from before the weather loads, on the same date, with the legacy weather seed');
  // A version 1 save, from when the Foreland and Thornmark were maps of their own, each cell seen a
  // number apiece.
  const cells = (w: number, h: number, at: [number, number][]): number[] => { const a = new Array(w * h).fill(0); for (const [x, y] of at) a[y * w + x] = 1; return a; };
  const v1 = {
    version: 1, savedAt: 0, rng: 7, party: defaultParty(makeRng(2)),
    world: {
      mapId: 'thornmark', x: 13, y: 12, facing: 2, minutes: 3000, light: 0, truce: 2, truceGroups: ['tm_spiders1'], steps: 40, lastTown: 'harrow', weatherSeed: 99,
      maps: {
        harrow: { explored: cells(16, 16, [[7, 14]]), used: {}, groups: {}, doors: {} },
        shelf: { explored: cells(32, 32, [[16, 4], [30, 9]]), used: { coast: 1 }, groups: { road_rats: { x: 16, y: 6, dead: 2000 }, hill_wolves: { x: 20, y: 10, dead: -1 } }, doors: {} },
        thornmark: { explored: cells(32, 32, [[13, 12]]), used: { tm_tower: 1 }, groups: { tm_ogre: { x: 5, y: 7, dead: 2500 } }, doors: {} },
      },
    },
  };
  { // It loads onto the outdoors, everything where it was.
    const loaded = deserialize(JSON.stringify(v1));
    const up = new World(buildMaps(), loaded.party, makeRng(1), loaded.world);
    const at = local(up), ms = up.state.maps[OUTDOORS], z = (id: string) => up.map.zones.find((q) => q.id === id)!;
    const sh = z('shelf'), th = z('thornmark');
    ok(up.state.mapId === OUTDOORS && at.map === 'thornmark' && at.x === 13 && at.y === 12, `the party stands where it stood, on the outdoors now (${at.map} ${at.x},${at.y})`);
    ok(!('shelf' in up.state.maps) && !('thornmark' in up.state.maps) && JSON.stringify(up.state.zones) === '["shelf","thornmark"]', 'the Foreland and Thornmark keep no state of their own, and count as set foot in');
    ok(up.explored(sh.x + 16, sh.y + 4) && up.explored(sh.x + 30, sh.y + 9) && up.explored(th.x + 13, th.y + 12) && !up.explored(sh.x + 17, sh.y + 4), 'what was seen on each is seen where it now lies');
    ok(seen(up.state.maps.harrow.explored, 14 * 16 + 7) && !seen(up.state.maps.harrow.explored, 14 * 16 + 8), 'and Helmstow\'s cells seen are packed into bits');
    ok(ms.used.coast === 1 && ms.used.tm_tower === 1, 'the Foreland\'s event and Thornmark\'s chest stay used');
    ok(ms.groups.road_rats.dead === 2000 && ms.groups.tm_ogre.dead === 2500 && ms.groups.hill_wolves.x === sh.x + 20 && ms.groups.hill_wolves.y === sh.y + 10 && ms.groups.tm_wolves1.dead === -1, 'the dead stay dead, the living stand where they stood, and groups never met are where their maps put them');
    ok(holds({ visited: 'thornmark' }, up.state, up.party) && !holds({ visited: 'grove1' }, up.state, up.party) && up.region === 'thornmark', 'the quest log still knows the party has been to Thornmark, and the weather is Thornmark\'s');
    const again = new World(buildMaps(), loaded.party, makeRng(1), deserialize(serialize(up.state, up.party, 1)).world);
    ok(JSON.stringify(again.state) === JSON.stringify(up.state), 'saved again, it loads as it is');
    ok((() => { try { deserialize(JSON.stringify({ ...v1, version: 99 })); return false; } catch { return true; } })(), 'a save from a newer build is refused');
  }
  { // A map that has grown since does not stop a version 1 save loading: the save's version, not the
    // length of what it kept, says what it needs. Helmstow here is four rows taller.
    const maps = buildMaps(), h = maps.harrow.def;
    maps.harrow = new GameMap({ ...h, rows: [...h.rows, ...new Array(4).fill(h.rows[h.rows.length - 1])] });
    const loaded = deserialize(JSON.stringify(v1));
    const up = new World(maps, loaded.party, makeRng(1), loaded.world), hs = up.state.maps.harrow.explored;
    ok(up.map.id === OUTDOORS && local(up).map === 'thornmark' && up.state.x === 245 && up.state.y === 42, 'on a taller Helmstow, a version 1 save still loads, the party where it stood');
    ok(hs.length === 8 && seen(hs, 14 * 16 + 7) && !seen(hs, 14 * 16 + 8), 'and Helmstow\'s cells seen are packed into bits, as seen as they were');
  }
  { // A version 2 save that told Vask yes (#452) loads having told him no, the act still ended.
    const v2 = upgrade(JSON.parse(JSON.stringify(v1)) as SaveData, UPGRADES, 2);
    v2.party.flags = { q_vask_rain: 1, q_vask_yes: 1, q_salt_done: 1 };
    const up = deserialize(JSON.stringify(v2));
    ok(up.version === SAVE_VERSION && !up.party.flags.q_vask_yes && up.party.flags.q_vask_no === 1 && up.party.flags.q_salt_done === 1 && up.party.flags.q_vask_rain === 1, `a save that told Vask yes loads having told him no (${Object.keys(up.party.flags).join(', ')})`);
    const no = deserialize(JSON.stringify({ ...v1, party: { ...v1.party, flags: { q_vask_no: 1, q_salt_done: 1 } } }));
    ok(JSON.stringify(no.party.flags) === '{"q_vask_no":1,"q_salt_done":1}', 'and one that told him no loads as it was');
  }
  { // A version 3 save, from before a blessing kept an element off (#555), loads with none kept off.
    const v3 = upgrade(JSON.parse(JSON.stringify(v1)) as SaveData, UPGRADES, 3);
    for (const m of v3.party.members) delete (m as { blessed?: unknown }).blessed;
    const up = deserialize(JSON.stringify(v3));
    ok(up.version === SAVE_VERSION && up.party.members.every((m) => Array.isArray(m.blessed) && m.blessed.length === 0), 'a version 3 save loads with no member blessed against anything');
  }
  { // The upgrades run by version, each registered with the version it brings a save to.
    const to3 = (d: SaveData): SaveData => ({ ...d, world: { ...d.world, steps: d.world.steps + 1 } });
    const three = upgrade(JSON.parse(JSON.stringify(v1)) as SaveData, { ...UPGRADES, [SAVE_VERSION + 1]: to3 }, SAVE_VERSION + 1);
    ok(three.version === SAVE_VERSION + 1 && three.world.steps === 41 && OUTDOORS in three.world.maps, `a version 1 save goes through every upgrade in turn, to version ${SAVE_VERSION + 1}`);
    ok((() => { try { upgrade(JSON.parse(JSON.stringify(v1)) as SaveData, UPGRADES, SAVE_VERSION + 1); return false; } catch { return true; } })(), 'and is refused where a version has no upgrade');
  }
  { // The kinds met: kept by a save, and empty in one made before there was a record of them.
    const rng = makeRng(5), p = defaultParty(rng), w = new World(buildMaps(), p, rng);
    w.state.met = ['rat', 'wolf'];
    const kept = deserialize(serialize(w.state, p, 1));
    ok(new World(buildMaps(), kept.party, makeRng(1), kept.world).state.met!.join() === 'rat,wolf', 'a save keeps the kinds the company has met');
    const old = deserialize(serialize(w.state, p, 1)); delete old.world.met;
    ok(JSON.stringify(new World(buildMaps(), old.party, makeRng(1), old.world).state.met) === '[]', 'and one with no record of them loads having met none');
  }
  { // A group a visited map has gained since the save stands where the map puts it.
    const rng = makeRng(3), p = defaultParty(rng), w = new World(buildMaps(), p, rng);
    const data = deserialize(serialize(w.state, p, 1));
    const maps = buildMaps(), h = maps.harrow.def, rats = maps[OUTDOORS].encounters[0];
    maps.harrow = new GameMap({ ...h, encounters: [...(h.encounters ?? []), { ...rats, id: 'test_rats', x: w.state.x, y: w.state.y - 1 }] });
    const again = new World(maps, data.party, makeRng(1), data.world);
    ok(w.state.mapId === 'harrow' && again.state.maps.harrow.groups.test_rats?.dead === -1 && again.liveGroups().some((g) => g.def.id === 'test_rats'), 'a group added to a map the save has been on is there, alive');
  }
  { // A door saved on a square that has since moved off the map, into the void or onto a wall is
    // not put back: the save still loads, and keeps the door in case the square comes back.
    const rng = makeRng(4), p = defaultParty(rng), w = new World(buildMaps(), p, rng);
    w.ensureMapState(OUTDOORS);
    w.state.maps.harrow.doors = { '40,40': 'door', '0,0': 'door' };
    w.state.maps[OUTDOORS].doors = { '5,5': 'door' };
    const data = deserialize(serialize(w.state, p, 1));
    let again: World | undefined;
    try { again = new World(buildMaps(), data.party, makeRng(1), data.world); } catch { /* reported below */ }
    ok(!!again && again.map.at(0, 0).door === 'none' && again.state.maps.harrow.doors['40,40'] === 'door', 'a save with doors off the map, in the void and on a wall loads, and none is put on a wall');
  }
}
