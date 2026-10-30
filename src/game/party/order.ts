// The company's order (#1066): two members change places, as the sheet's swap asks (DESIGN §11). A
// place is the member's index in `Party.members`, so the order is the array's and a save keeps it
// with no field of its own; the first `FRONT_ROW` stand in the front row, as the fights, the bots
// and the cards read it. Only the two places change: each member keeps all they are and carry, the
// company its purse, bag and flags, and no time passes.
import { FRONT_ROW } from '../combat/state.ts';
import type { Party } from './tables.ts';

/**
 * The members at places `i` and `j` change places, and the lines that say so: who with whom and,
 * where they cross between the rows, who stands in which now. A member chosen twice stays put.
 */
export function changePlaces(p: Party, i: number, j: number): string[] {
  const a = p.members[i], b = p.members[j];
  if (!a || !b) return [];
  if (i === j) return [`${a.name} stays put.`];
  [p.members[i], p.members[j]] = [b, a];
  const said = `${a.name} and ${b.name} change places.`;
  if ((i < FRONT_ROW) === (j < FRONT_ROW)) return [said];
  const [front, back] = j < FRONT_ROW ? [a, b] : [b, a];
  return [said, `${front.name} takes the front row, ${back.name} the back.`];
}
