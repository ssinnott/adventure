// An async suite that fails after an await: the runner waits for it. What it prints itself before its
// failure prints with it, held back as it is in a suite that passes (#895).
import { ok } from '../../lib.ts';

export async function later(): Promise<void> {
  await new Promise((r) => setTimeout(r, 10));
  console.log('  note: what it said before it failed');
  ok(false, 'a check after an await');
}
