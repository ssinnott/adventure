// A Game under Node: built with no browser and no storage, and driven by the actions a player
// presses, which is what the pilot's tests stand on (headlessGame and drive, in lib.ts). Plain node
// only strips types, so the screens that once took their arguments as parameter properties are each
// built and read back here as well.
import { Game } from '../../src/game/game.ts';
import { ChoiceScreen } from '../../src/ui/screens.ts';
import type { CombatScreen } from '../../src/ui/combat.ts';
import type { WorldMapScreen } from '../../src/ui/worldmap.ts';
import { ok, headlessGame, drive } from './lib.ts';

/** The screen on top, by its class. */
const top = (g: Game): string => g.top.constructor.name;

export function game(): void {
  // From the title, as a player starts: the premade company, and a new game on Harrow.
  const t = new Game(null);
  ok(top(t) === 'TitleScreen', 'a Game built without storage opens on the title');
  drive(t, ['interact']);
  ok(top(t) === 'CreateScreen', 'New Game on the title opens the company screen');
  drive(t, ['interact']);
  ok(top(t) === 'ExploreScreen' && t.world.state.mapId === 'harrow', 'the premade company on that screen starts the game exploring Harrow');

  const g = headlessGame(4);
  ok(top(g) === 'ExploreScreen' && g.world.state.mapId === 'harrow', `a headless game at seed 4 is exploring ${g.world.state.mapId}`);
  ok(g.party.members.length === 6, `with the premade company of ${g.party.members.length}`);

  // One press, one tick; a null is a tick of nothing, and settle adds more.
  const steps = g.world.state.steps, said = g.said;
  drive(g, ['forward']);
  ok(g.world.state.steps === steps + 1 || g.said > said, `a press of forward takes a step or says why not (${steps} to ${g.world.state.steps} steps, ${g.said - said} lines)`);
  const frame = g.frame;
  drive(g, ['turnLeft', null], 3);
  ok(g.frame - frame === 5, `drive ticks once for each action, null or not, and once for each of settle (${g.frame - frame} ticks for 2 and 3)`);

  // The screens that took parameter properties, each built through the game and read back.
  drive(g, ['journal']);
  ok(top(g) === 'QuestScreen', 'J opens the quest log');
  drive(g, ['cancel']);
  ok(top(g) === 'ExploreScreen', 'Esc takes it off');
  let closed = 0;
  g.message('Well met.', () => closed++);
  ok(top(g) === 'MessageScreen', 'a message goes on top');
  drive(g, ['interact']);
  ok(top(g) === 'ExploreScreen' && closed === 1, 'closing a message calls back once');
  const picked: number[] = [];
  g.push(new ChoiceScreen('Which?', ['One', 'Two'], (i) => picked.push(i)));
  drive(g, ['down', 'interact']);
  ok(top(g) === 'ExploreScreen' && picked.join() === '1', `a choice calls back with the one chosen (${picked.join() || 'none'})`);
  drive(g, ['n3', 'right']);
  ok(top(g) === 'SheetScreen' && g.selected === 3, `a sheet opened on the third member turns to the fourth (${g.selected + 1})`);
  drive(g, ['cancel', 'cast']);
  ok(top(g) === 'SpellScreen', 'C opens the spell list');
  drive(g, ['cancel', 'map']);
  ok(top(g) === 'WorldMapScreen' && (g.top as WorldMapScreen).mode === 'art', 'M opens the world map on the art');
  drive(g, ['cancel']);
  ok(top(g) === 'ExploreScreen', 'and Esc takes it off');

  // Harrow has no groups to fight, so the fight is on the Foreland, where the rats are.
  g.world.travel('shelf', 16, 4);
  g.fight(['road_rats']);
  ok(top(g) === 'CombatScreen' && (g.top as CombatScreen).groupIds.join() === 'road_rats', 'a fight with the road rats puts the combat screen on top');
}
