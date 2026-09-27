// Three checks owed by two issues, none of them holding yet.
import { ok, owed } from '../../lib.ts';

export function owing(): void {
  ok(true, 'a check that holds');
  owed(false, 'a first thing not yet so', '#43');
  owed(false, 'a second thing not yet so', '#40');
  owed(false, 'a third thing not yet so', '#40');
}
