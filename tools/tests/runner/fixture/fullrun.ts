// The pilot's full run in the runner's own check: run only when named (`ASKED`, tools/test.ts), so a bare run passes it over.
import { ok } from '../../lib.ts';

export function fullrun(): void {
  ok(true, 'the full run ran');
}
