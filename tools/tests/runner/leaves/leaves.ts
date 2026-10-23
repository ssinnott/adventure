// A suite that leaves the shared tables changed (#946): an item put in, an item taken out and a
// monster's def replaced, none put back. Its checks hold; the runner fails it by name all the same.
import { ITEMS, MONSTERS } from '../../../../src/content/index.ts';
import { ok } from '../../lib.ts';

export function leaves(): void {
  ITEMS.fx_left = { id: 'fx_left', name: 'Left Behind', slot: 'none', price: 0 };
  delete ITEMS.torch;
  MONSTERS.rat = { ...MONSTERS.rat, look: 'A rat left as it was not found.' };
  ok(true, 'a check that holds in a suite that leaves the tables changed');
}
