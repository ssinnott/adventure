// The game's own generator (#1021): `makeRng` gives each Game a generator with its own state, so two
// Games in one process draw two streams, where they drew on the engine's one singleton.
//
// A copy of engine code, named as one: the singleton's mulberry32 step, its `seed` (a zero falls back
// to 0x9e3779b9) and its start state, closed over and typed as the engine's `Rng`, so a save keeps the
// state as it did. game-engine's own `makeRng` gives up no state and seeds a zero to 1, and src/lib is
// never edited here (DESIGN §13): this file goes, and one import changes, when game-engine ships a
// `makeRng` with a state. tools/tests/rng.ts holds it to the singleton, draw for draw and state for
// state, and to the engine's `makeRng` on the seeds that takes.
import type { Rng } from '../lib/engine/rng.ts';

/** A generator of its own: at `seed` as the singleton's `seed` takes one, or at the singleton's start state with none. */
export function makeRng(seed?: number): Rng {
  let state = 0x2f6e2b1;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    seed(n) { state = (Number(n) | 0) >>> 0 || 0x9e3779b9; },
    next,
    range: (a, b) => a + (b - a) * next(),
    int: (a, b) => a + Math.floor(next() * (b - a + 1)),
    pick: (arr) => (arr.length ? arr[Math.floor(next() * arr.length)] : undefined),
    chance: (p) => next() < p,
    sign: () => (next() < 0.5 ? -1 : 1),
    get state() { return state; },
  };
  if (seed !== undefined) rng.seed(seed);
  return rng;
}
