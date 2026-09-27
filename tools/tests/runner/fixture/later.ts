// An async suite that fails after an await: the runner waits for it.
import { ok } from '../../lib.ts';

export async function later(): Promise<void> {
  await new Promise((r) => setTimeout(r, 10));
  ok(false, 'a check after an await');
}
