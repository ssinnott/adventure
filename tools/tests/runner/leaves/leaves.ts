// A suite that leaves the shared tables changed (#946): an item put in, an item taken out and a
// monster's def replaced, none put back. Its checks hold; the runner fails it by name all the same.
import { ITEMS, MONSTERS } from '../../../../src/content/index.ts';
import type { ItemDef } from '../../../../src/game/items.ts';
import type { MonsterDef } from '../../../../src/game/monsters.ts';
import { ok } from '../../lib.ts';

export function leaves(): void {
  // The tables are read-only by type (#945): this suite writes past that by a cast, as a careless
  // one might, for the runner to be seen to catch it.
  const items = ITEMS as Record<string, ItemDef>, monsters = MONSTERS as Record<string, MonsterDef>;
  items.fx_left = { id: 'fx_left', name: 'Left Behind', slot: 'none', price: 0 };
  delete items.torch;
  monsters.rat = { ...MONSTERS.rat, look: 'A rat left as it was not found.' };
  ok(true, 'a check that holds in a suite that leaves the tables changed');
}
