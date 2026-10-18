// A suite that takes a while and prints a line of its own: the slowest in the table, its line held
// back but under --list (#895).
import { ok } from '../../lib.ts';

export async function slow(): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  console.log('  note: a line of its own');
  ok(true, 'a check that holds after a while');
}
