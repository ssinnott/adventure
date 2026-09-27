// An owed check that holds now: it fails, so its entry is dropped.
import { owed } from '../../lib.ts';

export function holds(): void {
  owed(true, 'a thing that is so', '#41');
}
