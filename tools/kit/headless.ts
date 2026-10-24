// The game run headless (#984): a Game on no screen, a save loaded into one and the keys driven
// through it, as the walkthroughs and the suites play the game. Moved from the suites' frame
// (tools/tests/lib.ts), which a walkthrough may not take.
import { Game } from '../../src/game/game.ts';
import type { Party } from '../../src/game/party.ts';
import type { Action } from '../../src/input.ts';
import { drainTyped } from '../../src/input.ts';
import { SAVE_KEY } from '../../src/game/save.ts';

/**
 * A Game under Node, on a new game at `seed` with the premade company, or with `party` (#723: the
 * company P on the title draws, `randomParty(seed)`), with the pilot off.
 */
export function headlessGame(seed = 4, party?: Party): Game {
  const g = typing(new Game(null));
  g.newGame(seed, party);
  return g;
}

/**
 * A Game under Node loaded from a save's text (`serialize`), as F9 loads one (`Game.loadGame`), with
 * the pilot off: the full run's save point before a chapter, played again (#723).
 */
export function headlessLoad(save: string): Game {
  const g = typing(new Game({ getItem: (key) => (key === SAVE_KEY ? save : null), setItem: () => {}, removeItem: () => {} }));
  const loaded = g.loadGame();
  if (loaded !== true) throw new Error(`the save would not load: ${loaded}`);
  return g;
}

/** The keyboard's text mode without a keyboard: what is typed (the pilot's riddle words, #721) is drained as Input drains it. */
function typing(g: Game): Game {
  const typed: string[] = [];
  g.input = { textMode: false, typed, drainText: (c, max) => drainTyped(typed, c, max) };
  return g;
}

/**
 * Presses `actions` into the game one per tick (a null is a tick of nothing), then `settle` ticks of
 * nothing. A tick of nothing is the pilot's, if the game has one, as in src/main.ts: its key, if any.
 */
export function drive(g: Game, actions: readonly (Action | null)[], settle = 0): void {
  for (const a of [...actions, ...Array<null>(settle).fill(null)]) g.update(a ?? g.pilot?.next(g) ?? null);
}
