// A suite that ends, before the one that never does: its line of seconds is not the run's last.
import { ok } from '../../lib.ts';

export function before(): void {
  ok(true, 'a check that holds before the suite that never ends');
}
