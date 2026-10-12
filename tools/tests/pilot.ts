// The pilot's frame (#716): what Known lets it see and keeps from it, P's line in what it has heard,
// a fight handed to the bot, a message read and closed, and the why line with no brain to ask.
import { GameMap } from '../../src/game/map.ts';
import type { Feature, MapDef } from '../../src/game/map.ts';
import { EAST } from '../../src/game/types.ts';
import { ExploreScreen } from '../../src/game/game.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { MessageScreen } from '../../src/ui/screens.ts';
import { Pilot, BRAINS, IDLE } from '../../src/game/pilot/pilot.ts';
import { knownOf } from '../../src/game/pilot/known.ts';
import { ok, headlessGame } from './lib.ts';

export function pilot(): void {
  const g = headlessGame(4), p = (g.pilot = new Pilot({ instant: true }));
  const { x, y } = g.world.state, m = g.maps.harrow;
  const corner = [[0, 0], [m.width - 1, 0], [0, m.height - 1], [m.width - 1, m.height - 1]].sort(([ax, ay], [bx, by]) => Math.abs(bx - x) + Math.abs(by - y) - Math.abs(ax - x) - Math.abs(ay - y))[0];
  ok(knownOf(g).seen('harrow', x, y) && !knownOf(g).seen('harrow', corner[0], corner[1]), `Known has the start square in Helmstow seen and its far corner, ${corner.join(',')}, not`);

  // What the automap draws: a chest on the start square, and not the event beside it.
  (m.features as Feature[]).push({ kind: 'chest', x, y, id: 'fx_chest', gold: 5, items: [] }, { kind: 'event', x, y, id: 'fx_event', text: 'A cold wind.' });
  const drawn = knownOf(g).features('harrow');
  ok(drawn.some((f) => f.kind === 'chest' && f.id === 'fx_chest') && !drawn.some((f) => f.kind === 'event'), `Known's features hold a chest on a seen square and leave out the event on it (${drawn.map((f) => f.kind).join(', ')})`);

  // What is said or shown only by talking or a menu: a statue's riddle and answer, a person's question and crossings.
  (m.features as Feature[]).push(
    { kind: 'statue', x, y, id: 'fx_statue', name: 'A fixture statue', text: 'A stone face.', riddle: 'What has ten toes and no feet?', answer: 'ten', gift: { gold: 5 }, done: 'The face is still.' },
    { kind: 'npc', x, y, name: 'A fixture boatman', lines: ['"Over the water?"'], choice: { ask: 'Cross?', answers: [{ label: 'Yes', sets: 'fx_cross', says: ['"Then come."'] }] },
      passage: [{ to: 'thornhold', x: 7, y: 14, name: 'Thornhold', by: 'boat', fare: 10, departs: 6, days: 1, arrives: 18 }] },
  );
  const told = knownOf(g).features('harrow');
  const statue = told.find((f) => f.kind === 'statue' && f.id === 'fx_statue'), boatman = told.find((f) => f.kind === 'npc' && f.name === 'A fixture boatman');
  ok(!!statue && !('riddle' in statue) && !('answer' in statue) && !!boatman && !('choice' in boatman) && !('passage' in boatman),
    `Known's features hold no statue's riddle or answer and no person's question or crossings (${JSON.stringify([statue, boatman])})`);

  // A secret door, as movement's fixtures build a map: inked as a wall.
  const vault: MapDef = { id: 'fx_vault', name: 'Vault', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.S.#', '#####'] };
  const v = headlessGame(4);
  v.maps.fx_vault = new GameMap(vault);
  v.world.travel('fx_vault', 1, 1, EAST);
  const door = knownOf(v).cell('fx_vault', 2, 1);
  ok(door?.solid === 'wall' && door.door === 'none' && !('ch' in door), `Known inks a seen secret door as a wall (${JSON.stringify(door)})`);

  const k = knownOf(g);
  ok(!!k.placeOf('thornmark') && k.placeOf('no_such_map') === undefined, `Known places Thornmark on the world map, at ${k.placeOf('thornmark')?.map((n) => n.toFixed(1)).join(',')}, and no map that is not`);

  p.toggle(g);
  ok(p.on && knownOf(g).heard.includes('The pilot takes the helm.'), 'P hands the pilot the helm, and it hears its own line');

  g.world.travel('shelf', 16, 4);
  g.fight(['road_rats']);
  const fight = g.top, handed = p.next(g);
  ok(handed === null && fight instanceof CombatScreen && fight.auto, 'a fight on top the pilot hands to the bot, and presses nothing');
  let ticks = 0;
  for (; ticks < 4000 && g.top === fight; ticks++) g.update(null);
  ok(g.top !== fight && g.top instanceof ExploreScreen, `ticked with nothing pressed, the fight plays itself out, in ${ticks} ticks (${fight instanceof CombatScreen ? fight.state.outcome : '?'})`);

  g.message('A fixture note.');
  ok(g.top instanceof MessageScreen && p.next(g) === 'interact', 'a message on top the pilot reads and closes with Space');
  g.pop();

  const brains = BRAINS.splice(0);
  p.why = ['Bound for nowhere.'];
  const idle = p.next(g);
  BRAINS.push(...brains);
  ok(idle === null && p.why[0] === IDLE && IDLE === 'Nothing to do.', `with no brain to ask, it presses nothing and says so (${p.why.join(' ')})`);
}
