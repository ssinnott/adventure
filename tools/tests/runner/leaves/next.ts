// The suite after one that left the tables changed: it changes nothing, and is not blamed for it.
import { ok } from '../../lib.ts';

export function next(): void {
  ok(true, 'a check that holds after a suite that left the tables changed');
}
