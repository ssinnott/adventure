// A walkthrough of three scenes for the runner's own check (#1018), found by `--walks` (../../check.ts),
// in an order that is not their names': the first starts a walk from a place, a level and a flag,
// plays a step of the Foreland's chapter and opens a secret on its own maps, which a new walk reads
// shut; the second throws, naming a map that is not there; the third reads the maps as built and holds
// the goals to what the scenes say they walk, failing the goals no scene says.
import { newWalk, playChapter, meetWho, mapDef, everyGoalWalked, goalOf, quest, here, same, keys } from '../../../../kit/walk.ts';
import type { Scene, Start } from '../../../../kit/walk.ts';
import { THE_QUEST, TABLES } from '../../../../../src/content/index.ts';
import { buildMaps } from '../../../../../src/content/maps.ts';
import { World } from '../../../../../src/game/world.ts';
import { defaultParty, xpForLevel } from '../../../../../src/game/party.ts';
import type { GameMap } from '../../../../../src/game/map.ts';
import { makeRng } from '../../../../../src/lib/engine/rng.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../../../src/game/types.ts';
import type { Facing } from '../../../../../src/game/types.ts';

const FORELAND = THE_QUEST.chapters.find((c) => c.id === 'ashcombe')!;
/** The Foreland's goal once Vask has hired, which the first scene's step walks. */
const GULLWICK = goalOf(FORELAND, 'Ashcombe is past Gullwick');
const START: Start = { at: { map: 'keep', x: 3, y: 3, facing: EAST }, level: 3, flags: { q_ashcombe: 1 }, bag: ['key_iron'] };

/** The first secret door of the maps as built, and an open square facing it to search from. */
export function secret(): { map: string; x: number; y: number; from: { x: number; y: number; facing: Facing } } {
  for (const m of Object.values(buildMaps()) as GameMap[]) {
    const i = m.cells.findIndex((c) => c.door === 'secret');
    if (i < 0) continue;
    const x = i % m.width, y = Math.floor(i / m.width);
    for (const facing of [NORTH, EAST, SOUTH, WEST]) for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const a = m.ahead(x + dx, y + dy, facing), c = m.at(x + dx, y + dy);
      if (a.x === x && a.y === y && c.solid === 'none' && c.door === 'none') return { map: m.id, x, y, from: { x: x + dx, y: y + dy, facing } };
    }
  }
  throw new Error('no secret door with an open square before it');
}

export const scenes: readonly Scene[] = [
  { name: 'one', walks: [GULLWICK], play: (ok) => {
    const plain = newWalk(ok), rng = makeRng(4), party = defaultParty(TABLES, rng), game = new World(TABLES, buildMaps(), party, rng);
    ok(same(plain.world.state, game.state) && same(plain.party, party) && plain.level === 1, `a walk given no start is a new game, its company at level 1 (${here(plain)})`);
    const w = newWalk(ok, START);
    ok(here(w) === 'keep 3,3' && w.world.state.facing === EAST, `a walk starts at its start's place (${here(w)}, facing ${w.world.state.facing})`);
    ok(w.level === 3 && w.party.members.every((m) => m.level === 3 && m.xp === xpForLevel(3)), `a walk starts at its start's level (${w.party.members.map((m) => m.level).join(',')})`);
    ok(w.party.flags.q_ashcombe === 1 && keys(w) === keys(plain) + 1 && quest(w)?.goal === GULLWICK && !w.news.length, `a walk starts with its start's flags and bag, hired and told nothing (${quest(w)?.goal})`);
    playChapter(w, FORELAND, [{ name: 'to Gullwick', play: (x) => meetWho(x, 'q_wenna') }], 'the fixture');
    const s = secret();
    w.world.travel(s.map, s.from.x, s.from.y, s.from.facing);
    let found = false;
    for (let i = 0; i < 20 && !found; i++) found = w.world.search();
    ok(found && w.world.maps[s.map].at(s.x, s.y).door === 'door', `a secret found opens on the walk's own map (${s.map} ${s.x},${s.y})`);
    ok(newWalk(ok).world.maps[s.map].at(s.x, s.y).door === 'secret', 'a new walk reads that map as built, the secret shut');
  } },
  { name: 'n4', play: (ok) => {
    ok(true, 'the second scene begins');
    mapDef('nowhere');
    ok(true, 'the second scene goes on past a map that is not there');
  } },
  { name: 'three', play: (ok) => {
    const s = secret();
    ok(newWalk(ok).world.maps[s.map].at(s.x, s.y).door === 'secret', 'the third scene reads the maps as built, whatever the first opened');
    everyGoalWalked(ok, [{ ...FORELAND, goals: FORELAND.goals.filter((g) => g.text === GULLWICK) }], scenes);
    everyGoalWalked(ok, [FORELAND], scenes);
  } },
];
