// What a press means: the actions (`Action`), the keys that press each (`KEYS`: a key's first
// action is its primary, the rest aliases a screen may read) and `is`, which asks whether a press
// was any of those named. It imports nothing, so the screens take it from below the app (#1022);
// the keyboard (app/input.ts) reads its table.

export type Action =
  | 'forward' | 'back' | 'turnLeft' | 'turnRight' | 'strafeLeft' | 'strafeRight'
  | 'interact' | 'cancel' | 'map' | 'rest' | 'search' | 'cast' | 'inventory' | 'journal'
  | 'up' | 'down' | 'left' | 'right'
  | 'n1' | 'n2' | 'n3' | 'n4' | 'n5' | 'n6' | 'n7' | 'n8' | 'n9' | 'n0'
  | 'save' | 'load' | 'next' | 'zoom'
  /** X on the sheet: the member changes places with another (#1066, DESIGN §11). */
  | 'swap'
  /** P hands the game to the pilot and takes it back; T sets its tempo (src/main.ts takes both before any screen). */
  | 'pilot' | 'tempo';

export const KEYS: Record<string, Action[]> = {
  ArrowUp: ['forward', 'up'], KeyW: ['forward', 'up'],
  ArrowDown: ['back', 'down'], KeyS: ['back', 'down'],
  ArrowLeft: ['turnLeft', 'left'], KeyA: ['turnLeft', 'left'],
  ArrowRight: ['turnRight', 'right'], KeyD: ['turnRight', 'right'],
  KeyQ: ['strafeLeft'], KeyE: ['strafeRight'],
  Space: ['interact'], Enter: ['interact'], NumpadEnter: ['interact'],
  Escape: ['cancel'], Backspace: ['cancel'], Tab: ['next'],
  KeyM: ['map'], KeyR: ['rest'], KeyF: ['search'], KeyC: ['cast'], KeyI: ['inventory'], KeyJ: ['journal'],
  Digit1: ['n1'], Digit2: ['n2'], Digit3: ['n3'], Digit4: ['n4'], Digit5: ['n5'], Digit6: ['n6'], Digit7: ['n7'], Digit8: ['n8'], Digit9: ['n9'], Digit0: ['n0'],
  F5: ['save'], F9: ['load'], KeyZ: ['zoom'], KeyX: ['swap'],
  KeyP: ['pilot'], KeyT: ['tempo'],
};

/** The alias table, so screens can ask "was this press an 'up'?" for a key that is also 'forward'. */
function aliases(a: Action): Action[] {
  for (const list of Object.values(KEYS)) if (list[0] === a) return list;
  return [a];
}
export function is(a: Action | null, ...any: Action[]): boolean {
  if (!a) return false;
  const al = aliases(a);
  return any.some((x) => al.includes(x));
}
