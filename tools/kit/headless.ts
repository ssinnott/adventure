// The game run headless (#984): a Game on no screen, a save loaded into one and the keys driven
// through it, as the walkthroughs and the suites play the game. Moved from the suites' frame
// (tools/tests/lib.ts), which a walkthrough may not take.
import { Game } from '../../src/game/game.ts';
import type { Party } from '../../src/game/party.ts';
import type { Action } from '../../src/input.ts';
import { drainTyped } from '../../src/input.ts';
import { SAVE_KEY } from '../../src/game/save.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { Tables } from '../../src/game/tables.ts';
import { TABLES } from '../../src/content/index.ts';

/**
 * A Game under Node, on a new game at `seed` with the premade company, or with `party` (#723: the
 * company P on the title draws, `randomParty(seed)`), with the pilot off; on `tables`, content's unless
 * a suite plays its own (#973).
 */
export function headlessGame(seed = 4, party?: Party, tables: Tables = TABLES): Game {
  const g = typing(new Game(tables, null));
  g.newGame(seed, party);
  return g;
}

/**
 * A Game under Node loaded from a save's text (`serialize`), as F9 loads one (`Game.loadGame`), with
 * the pilot off: the full run's save point before a chapter, played again (#723).
 */
export function headlessLoad(save: string, tables: Tables = TABLES): Game {
  const g = typing(new Game(tables, { getItem: (key) => (key === SAVE_KEY ? save : null), setItem: () => {}, removeItem: () => {} }));
  const loaded = g.loadGame();
  if (loaded !== true) throw new Error(`the save would not load: ${loaded}`);
  return g;
}

/**
 * Content's tables with `defs` lent among the items (#973): a table of the suite's own to play, each def
 * under its id over any there, and content's never written. On `base` where it is another's: the
 * harness's (`HARNESS`, tools/kit/company.ts) for the gate's company.
 */
export function tablesWith(defs: readonly ItemDef[], base: Tables = TABLES): Tables {
  return { ...base, items: { ...base.items, ...Object.fromEntries(defs.map((d) => [d.id, d])) } };
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
