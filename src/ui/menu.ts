// A list's cursor (#1031): the row it is on and how the arrows move it round, the rows barred, the
// first row in view where a narrow layout scrolls, the digits by one rule and the cursor a menu keeps
// when a choice opens it again (DESIGN §11). Each screen that lists rows to choose from holds one and
// asks it, so a cursor wraps in this one place. It knows no screen and no host.
import type { Action } from './actions.ts';
import { is } from './actions.ts';

/** What a key did to a list: moved its cursor or chose the row the cursor is on; null, nothing. */
export type Pressed = 'moved' | 'chosen' | null;

/** A list as a key finds it: its rows now and what its keys do. */
export interface Rows {
  /** How many rows it has. */
  readonly n: number;
  /** Whether a row is barred: drawn dim, the cursor may stand on it as on any, but nothing chooses it. */
  readonly barred?: (row: number) => boolean;
  /**
   * Its digits: each names the row numbered so and moves the cursor there, and on a list that acts by
   * them ('act') chooses it, as Space there would. Unset, a digit is not the list's.
   */
  readonly digits?: 'act' | 'move';
  /** The number a row carries, which its digit names: its place from the top, unless the list says. */
  readonly number?: (row: number) => number;
  /** Whether left and right move the cursor as up and down do: a row of monsters, or of the party. */
  readonly across?: boolean;
}

export class ListMenu {
  /** The row the cursor is on. */
  sel = 0;
  /** The first row in view where a layout shows fewer than all (`scroll`). */
  top = 0;

  /**
   * A key on the list. Up and down (and left and right, across) move the cursor round, from the last
   * row to the first and back; a digit as `Rows.digits` says; Space chooses the row the cursor is on
   * unless it is barred. A list of no rows takes no key.
   */
  press(a: Action | null, rows: Rows): Pressed {
    const { n } = rows;
    if (!a || n <= 0) return null;
    if (is(a, 'up') || (rows.across && is(a, 'left'))) return this.step(-1, n);
    if (is(a, 'down') || (rows.across && is(a, 'right'))) return this.step(1, n);
    if (is(a, 'interact')) return rows.barred?.(this.sel) ? null : 'chosen';
    const digit = /^n([1-9])$/.exec(a);
    if (!digit || !rows.digits) return null;
    const number = rows.number ?? ((row: number): number => row + 1);
    let row = 0;
    while (row < n && number(row) !== Number(digit[1])) row++;
    if (row === n) return null;
    this.sel = row;
    return rows.digits === 'act' && !rows.barred?.(row) ? 'chosen' : 'moved';
  }

  /** The cursor a row up (-1) or down (1) a list of `n`, round: up from the first is the last. */
  private step(by: -1 | 1, n: number): Pressed { this.sel = (n + this.sel + by) % n; return 'moved'; }

  /** The cursor held to the last of `n` rows, where the list has lost rows under it. */
  clamp(n: number): void { this.sel = Math.min(this.sel, n - 1); }

  /**
   * The same menu opened again after a choice: on the row the choice left, held to the `n` rows it
   * has now, so that where that row has gone the cursor is on the one that came after it.
   */
  keep(row: number, n: number): void { this.sel = Math.max(0, Math.min(row, n - 1)); }

  /** The first of `n` rows in view, `shown` at once: moved as little as brings the cursor into view. */
  scroll(shown: number, n: number): number {
    if (this.sel < this.top) this.top = this.sel;
    if (this.sel >= this.top + shown) this.top = this.sel - shown + 1;
    this.top = Math.max(0, Math.min(this.top, n - shown));
    return this.top;
  }
}
