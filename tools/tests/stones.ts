// The Hearth's measure (#168; DESIGN §9): the Stones the atlas names are listed, each restored on a
// condition something in the game makes true, or owed by the issue that will; the count is read
// from the save's flags alone, and the almanac, the title and the night sky read the count.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { ATLAS } from '../../src/content/index.ts';
import { STONES, WHOLE } from '../../src/content/stones.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { save } from '../../src/game/save.ts';
import type { Store } from '../../src/game/save.ts';
import { stonesRestored, savedStones, hearthBearing, flickerOf, steadier, MOST } from '../../src/game/stones.ts';
import { condFaults } from './quests.ts';
import { ok, owed } from './lib.ts';

export function stones(): void {
  // Every Stone the atlas names is listed, but the one whole from the start, and no other.
  const named = ATLAS.areas.flatMap((a) => (a.stone && a.stone !== WHOLE ? [`${a.stone}/${a.id}`] : [])).sort().join();
  ok(named === STONES.map((s) => `${s.name}/${s.area}`).sort().join(), `the Stones listed are the atlas's, but the ${WHOLE} (${STONES.map((s) => s.name).join(', ')})`);
  // Each one restored on something the game makes true, or owed by the issue that will.
  for (const s of STONES) {
    if (!s.restored) { console.log(`  n/a:  the ${s.name} has no condition yet; ${s.area} writes it`); continue; }
    const faults = condFaults(s.restored), msg = `the ${s.name} is restored on something the game makes true${faults.length ? ` (not: ${faults.join(', ')})` : ''}`;
    if (s.owed) owed(!faults.length, msg, s.owed); else ok(!faults.length, msg);
  }

  // The count is read from the flags: the Grove's end alone is not its mending.
  const rng = makeRng(168), party = defaultParty(rng), world = new World(buildMaps(), party, rng);
  const plain = world.almanac().split('\n')[0];
  party.flags.q_grove_done = 1;
  ok(stonesRestored(world.state, party) === 0 && world.stones === 0 && world.almanac().split('\n')[0] === plain, `the Grove's end restores nothing, and the almanac says only the day ("${plain}")`);
  party.flags.q_tide_home = 1;
  const one = world.almanac().split('\n')[0];
  ok(world.stones === 1 && one === `${plain} ${steadier(1)}`, `the Tide Stone home is one, and the almanac says the Hearth burns steadier ("${one}")`);
  party.flags.q_grove_mended = 1;
  ok(world.stones === 2 && steadier(2) !== steadier(1) && MOST === STONES.length, `the Grove mended by a Lantern is a second ("${steadier(2)}")`);
  // The Anvil Stone counts once its Warden has fallen and its tear is closed (#540), bought back or taken alike
  // (docs/areas/kilns.md §9): the thane's choice restores nothing by itself, and the tear closed is a third either way.
  for (const [how, flag] of [['bought', 'anvil_bought'], ['taken', 'anvil_taken']] as const) {
    party.flags[flag] = 1;
    const chosen = world.stones;
    party.flags.q_anvil_closed = 1;
    ok(chosen === 2 && world.stones === 3 && steadier(3) !== steadier(2) && world.almanac().split('\n')[0] === `${plain} ${steadier(3)}`,
      `the Anvil Stone ${how} counts once its tear is closed and not before, and the almanac says the Hearth holds its light ("${steadier(3)}")`);
    delete party.flags[flag]; delete party.flags.q_anvil_closed;
  }
  party.flags.q_anvil_closed = 1;
  ok(world.stones === 3, 'a tear closed before the thane was spoken to counts too: the choice is how the Stone came to the company, not what restores it');
  ok([0, 1, 2, 3, 4, 5].every((n, i, a) => i === 0 || flickerOf(n) < flickerOf(a[i - 1])) && flickerOf(9) === flickerOf(5), 'each Stone steadies the flicker, and past the last it holds');

  // The title reads the save in storage: none, or one that cannot be read, is none restored.
  const box = new Map<string, string>(), store: Store = { getItem: (k) => box.get(k) ?? null, setItem: (k, v) => void box.set(k, v), removeItem: (k) => void box.delete(k) };
  const empty = savedStones(store);
  save(store, world.state, party, 0);
  const kept = savedStones(store);
  box.set([...box.keys()][0], '{not a save');
  ok(empty === 0 && kept === 3 && savedStones(store) === 0 && savedStones(null) === 0, `the title reads the saved company's count (${kept}), and none from no save or a broken one`);

  // The night sky's Hearth lies where the Hearth does: south of Helmstow, east from the far west shore.
  world.travel('harrow', 7, 14);
  const from = world.worldCell, b = from ? hearthBearing(from.x, from.y) : -1;
  ok(!!from && b > 135 && b < 180 && Math.round(hearthBearing(100, 174)) === 90, `from Helmstow's gate (${from?.x},${from?.y}) the Hearth lies south-south-east (${b.toFixed(0)}°), and due east from the west shore`);
  world.travel('greywater1', 1, 1);
  ok(world.worldCell === undefined, 'underground there is no sky to see it in');
}
