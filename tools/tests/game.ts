// A Game under Node: built with no browser and no storage, and driven by the actions a player
// presses, which is what the pilot's tests stand on (headlessGame and drive, in lib.ts). Plain node
// only strips types, so the screens that once took their arguments as parameter properties are each
// built and read back here as well.
import { Game } from '../../src/app/game.ts';
import { ChoiceScreen, SheetScreen } from '../../src/ui/screens.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import type { WorldMapScreen } from '../../src/ui/worldmap.ts';
import { ok } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { MONSTERS, TABLES } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/mapdef.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { startCombat, currentTurn, monsterAct, partyAct, meetCalled } from '../../src/game/combat.ts';

/** The screen on top, by its class. */
const top = (g: Game): string => g.top.constructor.name;

export function game(): void {
  // From the title, as a player starts: the premade company, and a new game on Harrow.
  const t = new Game(TABLES, null);
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

  // A chest gives by the wilds' rule (`give`, #978) and says what it gave, no gold where it holds none; opened, it is empty.
  const chest = (id: string, gold: number): Feature => ({ kind: 'chest', id, x: 0, y: 0, gold, items: ['potion_heal'] });
  const gold = g.party.gold, bag = g.party.bag.length;
  g.interact(chest('test_chest', 500));
  const opened = g.log.at(-1);
  g.interact(chest('test_chest', 500));
  ok(opened === 'You open the chest: 500 gold, Healing Draught.' && g.party.gold === gold + 500 && g.party.bag.length === bag + 1 && g.log.at(-1) === 'The chest is empty.',
    `a chest gives its gold and its draught and says so, and is then empty (${opened})`);
  g.interact(chest('test_chest_2', 0));
  ok(g.log.at(-1) === 'You open the chest: Healing Draught.' && g.party.gold === gold + 500, `one with no gold names none (${g.log.at(-1)})`);

  // A kind a monster calls into a fight says its look once, after the call, as the first groups' kinds do (`meetCalled`, #978).
  const met = g.world.state.met ?? [], kind = Object.values(MONSTERS).find((d) => d.look && !met.includes(d.id))!;
  const caller: MonsterDef = { ...MONSTERS.bandit, id: 'test_caller', name: 'Caller', calls: { monsters: [kind.id], chance: 1 } };
  const s = startCombat(TABLES, g.party, [{ id: 'test_callers', monsters: [caller] }], makeRng(3)), rng = makeRng(3);
  let bands = s.groupIds.length;
  for (let i = 0; i < 40 && s.groupIds.length === 1 && s.outcome === 'ongoing'; i++) {
    const t = currentTurn(s, g.party, rng);
    if (t?.side === 'monster') { monsterAct(s, g.party, rng); bands = meetCalled(g.world, s, bands); } else if (t) partyAct(s, g.party, rng, { type: 'defend' });
  }
  const called = s.log.findIndex((l) => l.startsWith('Caller calls, and ')), lines = s.log.length, again = meetCalled(g.world, s, bands);
  ok(called >= 0 && s.log[called + 1] === kind.look && s.log.filter((l) => l === kind.look).length === 1 && bands === 2 && again === 2 && s.log.length === lines && !!g.world.state.met?.includes(kind.id),
    `a call of a kind the company has not met (${kind.name}) says its look once, straight after the call`);

  // And through the combat screen, as the game meets them: straight after the monster's turn that called.
  const unmet = Object.values(MONSTERS).find((d) => d.look && !g.world.state.met?.includes(d.id))!;
  const twice: MonsterDef = { ...caller, hp: 400, speed: 40, calls: { monsters: [unmet.id], chance: 1 } };
  const shown = startCombat(TABLES, g.party, [{ id: 'test_callers', monsters: [twice, twice] }], g.rng), screen = new CombatScreen(shown, ['test_callers']), was = CombatScreen.instant;
  CombatScreen.instant = true; screen.auto = true; g.push(screen);
  for (let i = 0; i < 4000 && shown.groupIds.length === 1 && shown.outcome === 'ongoing'; i++) g.update(null);
  CombatScreen.instant = was; g.pop();
  const heard = shown.log.findIndex((l) => l.startsWith('Caller calls, and '));
  ok(heard >= 0 && shown.log[heard + 1] === unmet.look, `the combat screen says a called kind's look straight after the call (${unmet.name})`);

  // The sheet uses an item by the same rule: a draught listed from the bag, on the fourth member, though the first's pack holds one too.
  const [first, , , fourth] = g.party.members;
  first.pack = ['potion_heal']; g.party.bag = ['potion_heal']; fourth.conditions = []; fourth.maxHp = 40; fourth.hp = 1;
  g.push(new SheetScreen(0));
  drive(g, ['down', 'interact', 'n4']);
  ok(first.pack.join() === 'potion_heal' && !g.party.bag.length && fourth.hp === 16 && g.log.at(-1) === `${fourth.name} recovers 15.`, `the sheet gives the bag's draught to the fourth member, not the pack's (${g.log.at(-1)})`);
  g.pop();
}
