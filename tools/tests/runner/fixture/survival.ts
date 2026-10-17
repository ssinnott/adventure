// A suite run only when named (`ASKED`, tools/test.ts): a bare run passes it over.
import { ok } from '../../lib.ts';

export function survival(): void {
  ok(true, 'the suite run only when named ran');
}
