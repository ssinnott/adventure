// Keyboard input as a queue of presses. Grid movement wants one step per press (with the browser's
// own key repeat for holding a key), so the game consumes discrete events rather than polling a
// held-state table. `held` is kept for the few places that want it (skipping a log).
import { KEYS } from '../ui/actions.ts';
import type { Action } from '../ui/actions.ts';

// What a press means is the screens' (ui/actions.ts); the suites and the pilot take it here too.
export type { Action } from '../ui/actions.ts';
export { is } from '../ui/actions.ts';

export class Input {
  private queue: Action[] = [];
  readonly held = new Set<Action>();
  /** While set, printable keys go to `typed` instead of the action table (name entry). */
  textMode = false;
  /** Characters typed in text mode; '\b' is a backspace. Screens drain it. */
  typed: string[] = [];
  constructor(target: EventTarget = window) {
    target.addEventListener('keydown', (e) => {
      const ev = e as KeyboardEvent;
      if (this.textMode) {
        if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) { this.typed.push(ev.key); ev.preventDefault(); return; }
        if (ev.code === 'Backspace') { this.typed.push('\b'); ev.preventDefault(); return; }
        if (ev.code !== 'Enter' && ev.code !== 'NumpadEnter' && ev.code !== 'Escape' && ev.code !== 'Tab' && !ev.code.startsWith('Arrow')) return;
      }
      const acts = KEYS[ev.code];
      if (!acts) return;
      ev.preventDefault();
      // The first action of a chord is the "primary" one; the rest are aliases screens may read.
      this.queue.push(acts[0]);
      for (const a of acts) this.held.add(a);
    });
    target.addEventListener('keyup', (e) => {
      const acts = KEYS[(e as KeyboardEvent).code];
      if (acts) for (const a of acts) this.held.delete(a);
    });
    window.addEventListener('blur', () => this.held.clear());
  }
  /** Inject an action (tests, on-screen buttons). */
  push(a: Action): void { this.queue.push(a); }
  /** Apply the typed characters to a string and clear them. */
  drainText(current: string, max = 12): string { return drainTyped(this.typed, current, max); }
  /** Next queued press, or null. */
  next(): Action | null { return this.queue.shift() ?? null; }
  clear(): void { this.queue.length = 0; }
}

/**
 * Apply typed characters to a string, each to at most `max` long ('\b' a backspace), and clear them:
 * the keyboard's text mode, and a headless game's (tools/tests/lib.ts), where the pilot types (#721).
 */
export function drainTyped(typed: string[], current: string, max = 12): string {
  for (const ch of typed) current = ch === '\b' ? current.slice(0, -1) : current.length < max ? current + ch : current;
  typed.length = 0;
  return current;
}
