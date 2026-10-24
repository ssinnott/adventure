// The enclave (#845): a place of its own beside the road, held to its own band. Here are the fixture
// lair the checks hold an enclave by before any area places one, and its door: crossing in says its
// band and how it feels by the company's level, as a border's line does (#166), and its sign gives its
// band. The gate, the curve, the quest and the pilot hold the fixture in their own suites (gate.ts,
// curve.ts, quests.ts, pilot.ts). None of it is content: no area lists the lair, and no save holds it.
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { World, enclaveLine, HARDER_IN, WARNING_IN } from '../../src/game/world.ts';
import { EAST, NORTH } from '../../src/game/types.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { gateCompany } from '../kit/company.ts';
import { ok, fxMap } from './lib.ts';
import { LAIR } from '../kit/rules/enclave.ts';

export function enclave(): void {
  // Its door, crossing in from a hollow: its band, as its sign gives it, and how it feels by the
  // company's level, as a border's line: a warning three or more under, harder one or two, then nothing.
  const DOWN = 'Down into the dark.';
  const hollow: MapDef = { id: 'fx_hollow', name: 'Fixture Hollow', kind: 'dungeon', region: 'shelf', start: { x: 1, y: 1, facing: EAST }, rows: ['####', '#..#', '####'],
    exits: [{ x: 2, y: 1, to: fxMap(LAIR.id), tx: LAIR.start.x, ty: LAIR.start.y, tf: NORTH, label: DOWN }] };
  const enter = (level: number, into: MapDef = LAIR, from: MapDef = hollow): { said: string[]; w: World } => {
    const w = new World({ [from.id]: new GameMap(from), [into.id]: new GameMap(into) }, gateCompany(level, 1), makeRng(1));
    const r = w.move('forward');
    return { said: r.kind === 'moved' ? r.messages : [r.kind], w };
  };
  const band = 'The Fixture Lair: levels 30-32.';
  const low = enter(12), near = enter(28), at = enter(30), over = enter(32);
  ok(low.said.join('|') === `${DOWN}|${band} ${WARNING_IN}` && low.w.state.mapId === LAIR.id,
    `crossing into the fixture lair at 12 says the way's own line, then its band and a warning, as one entry (${low.said.join(' | ')})`);
  ok(near.said.join('|') === `${DOWN}|${band} ${HARDER_IN}` && at.said.join('|') === `${DOWN}|${band}` && over.said.join('|') === `${DOWN}|${band}`,
    `two under its floor it says harder, and at its floor or over its band alone (${near.said[1]}; ${at.said[1]}; ${over.said[1]})`);
  ok(low.w.here.name === LAIR.name && low.w.here.band?.join('-') === '30-32', `inside, its sign gives its own band (${low.w.here.name}, ${low.w.here.band?.join('-')})`);
  // Nothing more from a level of an enclave whose floor is at or over this one's, nor into a map
  // that is no enclave; from one whose floor is under it, the door speaks, as a border does where
  // the floor rises.
  const deeper = enter(12, LAIR, { ...hollow, band: [30, 32], enclave: true }), plain = enter(12, { ...LAIR, enclave: undefined });
  const up = enter(12, { ...LAIR, band: [28, 30] }, { ...hollow, band: [30, 32], enclave: true });
  ok(deeper.said.join('|') === DOWN && up.said.join('|') === DOWN && plain.said.join('|') === DOWN,
    `from a level of an enclave at or over its floor, or into a map that is no enclave, only the way's own line is said (${deeper.said.join(' | ')}; ${up.said.join(' | ')}; ${plain.said.join(' | ')})`);
  const hall = enter(14, LAIR, { ...hollow, name: 'Fixture Hall', band: [14, 16], enclave: true });
  ok(hall.said.join('|') === `${DOWN}|${band} ${WARNING_IN}`,
    `from an enclave at 14-16 into the lair at 30-32, a company at 14 hears its band and the warning (${hall.said.join(' | ')})`);
  ok(enclaveLine(LAIR, 27) === `${band} ${WARNING_IN}` && enclaveLine({ ...LAIR, band: undefined }, 12) === undefined && enclaveLine(hollow, 12) === undefined,
    'an enclave with no band, or a map that is none, has no door line');
}
