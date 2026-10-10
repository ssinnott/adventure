// The game under Node: a Game builds on a new game, takes a key, opens the quest log and starts a
// fight, with no browser. The pilot's tests drive a Game this way.
import { ExploreScreen } from '../../src/game/game.ts';
import { QuestScreen } from '../../src/ui/quests.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { ok, headlessGame, drive } from './lib.ts';

export function game(): void {
  const g = headlessGame(4);
  ok(g.top instanceof ExploreScreen && g.world.state.mapId === 'harrow', 'a new game at seed 4 opens on the road in harrow');

  const steps = g.world.state.steps, said = g.said;
  drive(g, ['forward']);
  ok(g.world.state.steps === steps + 1 || g.said > said, 'a forward key takes a step, or says why it cannot');

  const road = g.top;
  drive(g, ['journal']);
  const journal = g.top instanceof QuestScreen;
  drive(g, ['cancel']);
  ok(journal && g.top === road, 'the journal key opens the quest log, and cancel takes it off');

  // Harrow is a town with no encounters: the fight starts on the Shelf road, where road_rats lies.
  g.world.travel('shelf', 16, 4);
  g.fight(['road_rats']);
  ok(g.top instanceof CombatScreen, 'a fight on the Shelf road opens the combat screen');
}
