// Keyboard input as a queue of presses. Grid movement wants one step per press (with the browser's
// own key repeat for holding a key), so the game consumes discrete events rather than polling a
// held-state table. `held` is kept for the few places that want it (skipping a log).

export type Action =
  | 'forward' | 'back' | 'turnLeft' | 'turnRight' | 'strafeLeft' | 'strafeRight'
  | 'interact' | 'cancel' | 'map' | 'rest' | 'search' | 'cast' | 'inventory'
  | 'up' | 'down' | 'left' | 'right'
  | 'n1' | 'n2' | 'n3' | 'n4' | 'n5' | 'n6' | 'n7' | 'n8' | 'n9' | 'n0'
  | 'save' | 'load';

const KEYS: Record<string, Action[]> = {
  ArrowUp: ['forward', 'up'], KeyW: ['forward', 'up'],
  ArrowDown: ['back', 'down'], KeyS: ['back', 'down'],
  ArrowLeft: ['turnLeft', 'left'], KeyA: ['turnLeft', 'left'],
  ArrowRight: ['turnRight', 'right'], KeyD: ['turnRight', 'right'],
  KeyQ: ['strafeLeft'], KeyE: ['strafeRight'],
  Space: ['interact'], Enter: ['interact'], NumpadEnter: ['interact'],
  Escape: ['cancel'], Backspace: ['cancel'],
  KeyM: ['map'], KeyR: ['rest'], KeyF: ['search'], KeyC: ['cast'], KeyI: ['inventory'],
  Digit1: ['n1'], Digit2: ['n2'], Digit3: ['n3'], Digit4: ['n4'], Digit5: ['n5'], Digit6: ['n6'], Digit7: ['n7'], Digit8: ['n8'], Digit9: ['n9'], Digit0: ['n0'],
  F5: ['save'], F9: ['load'],
};

export class Input {
  private queue: Action[] = [];
  readonly held = new Set<Action>();
  /** Raw key codes seen this frame, for text entry later. */
  constructor(target: EventTarget = window) {
    target.addEventListener('keydown', (e) => {
      const ev = e as KeyboardEvent;
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
  /** Next queued press, or null. */
  next(): Action | null { return this.queue.shift() ?? null; }
  clear(): void { this.queue.length = 0; }
}

/** The alias table, so screens can ask "was this press an 'up'?" for a key that is also 'forward'. */
export function aliases(a: Action): Action[] {
  for (const list of Object.values(KEYS)) if (list[0] === a) return list;
  return [a];
}
export function is(a: Action | null, ...any: Action[]): boolean {
  if (!a) return false;
  const al = aliases(a);
  return any.some((x) => al.includes(x));
}
