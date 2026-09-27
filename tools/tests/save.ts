// Saves: a round trip, the outdoors kept small, a save from before the weather, and a version 1
// save loaded onto the outdoors.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World, seen } from '../../src/game/world.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { defaultParty } from '../../src/game/party.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
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
  { // A version 1 save, from when the Shelf and Thornmark were maps of their own, each cell seen a
    // number apiece: it loads onto the outdoors, everything where it was.
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
    const loaded = deserialize(JSON.stringify(v1));
    const up = new World(buildMaps(), loaded.party, makeRng(1), loaded.world);
    const at = local(up), ms = up.state.maps[OUTDOORS], z = (id: string) => up.map.zones.find((q) => q.id === id)!;
    const sh = z('shelf'), th = z('thornmark');
    ok(up.state.mapId === OUTDOORS && at.map === 'thornmark' && at.x === 13 && at.y === 12, `the party stands where it stood, on the outdoors now (${at.map} ${at.x},${at.y})`);
    ok(!('shelf' in up.state.maps) && !('thornmark' in up.state.maps) && JSON.stringify(up.state.zones) === '["shelf","thornmark"]', 'the Shelf and Thornmark keep no state of their own, and count as set foot in');
    ok(up.explored(sh.x + 16, sh.y + 4) && up.explored(sh.x + 30, sh.y + 9) && up.explored(th.x + 13, th.y + 12) && !up.explored(sh.x + 17, sh.y + 4), 'what was seen on each is seen where it now lies');
    ok(seen(up.state.maps.harrow.explored, 14 * 16 + 7) && !seen(up.state.maps.harrow.explored, 14 * 16 + 8), 'and Harrow\'s cells seen are packed into bits');
    ok(ms.used.coast === 1 && ms.used.tm_tower === 1, 'the Shelf\'s event and Thornmark\'s chest stay used');
    ok(ms.groups.road_rats.dead === 2000 && ms.groups.tm_ogre.dead === 2500 && ms.groups.hill_wolves.x === sh.x + 20 && ms.groups.hill_wolves.y === sh.y + 10 && ms.groups.tm_wolves1.dead === -1, 'the dead stay dead, the living stand where they stood, and groups never met are where their maps put them');
    ok(holds({ visited: 'thornmark' }, up.state, up.party) && !holds({ visited: 'grove1' }, up.state, up.party) && up.region === 'thornmark', 'the quest log still knows the party has been to Thornmark, and the weather is Thornmark\'s');
    const again = new World(buildMaps(), loaded.party, makeRng(1), deserialize(serialize(up.state, up.party, 1)).world);
    ok(JSON.stringify(again.state) === JSON.stringify(up.state), 'saved again, it loads as it is');
    ok((() => { try { deserialize(JSON.stringify({ ...v1, version: 99 })); return false; } catch { return true; } })(), 'a save from a newer build is refused');
  }
}
