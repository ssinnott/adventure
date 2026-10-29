// The game's generator held to the engine's (#1021): src/game/rng.ts against the singleton, draw for
// draw and state for state, from ten seeds and from the start state; against the engine's `makeRng`
// on the nine seeds it takes, a zero being the singleton's and not its; two Games drawing two streams;
// and a save's state carried from one Game into another.
//
// The singleton is a copy of the engine's module of this suite's own, loaded again by its URL with a
// query of its own: it stands at the engine's start state whatever else the process has drawn, and the
// suite draws on no generator another suite reads.
import { makeRng } from '../../src/game/rng.ts';
import type { Rng, RngInstance } from '../../src/lib/engine/rng.ts';
import { serialize } from '../../src/game/save.ts';
import type { Game } from '../../src/app/game.ts';
import { headlessGame, headlessLoad } from '../kit/headless.ts';
import { ok } from './lib.ts';

/** The ten seeds: zero, small ones, the start state, the fallback, the 32-bit edges and a negative. */
const SEEDS = [0, 1, 2, 7, 1187, 0x2f6e2b1, 0x9e3779b9, 0x7fffffff, 0xffffffff, -1187];
/** How many draws each comparison takes. */
const DRAWS = 1000;

type Draw<T> = readonly [name: string, draw: (r: T) => unknown];
const WORDS = ['ash', 'brine', 'cairn', 'den', 'ember'] as const;
/** The five draws the engine's `makeRng` has, in the turn they are taken. */
const FIVE: readonly Draw<RngInstance>[] = [
  ['next', (r) => r.next()],
  ['range', (r) => r.range(-2.5, 7)],
  ['int', (r) => r.int(1, 20)],
  ['pick', (r) => r.pick(WORDS)],
  ['chance', (r) => r.chance(0.3)],
];
/** The singleton's six: the five, then `sign`. */
const SIX: readonly Draw<Rng>[] = [...FIVE, ['sign', (r) => r.sign()]];

const hex = (n: number): string => (n < 0 ? '-0x' : '0x') + Math.abs(n).toString(16);
const shown = (s: number): string => (Math.abs(s) > 0xffff ? hex(s) : String(s));

/**
 * Where `a` first parts from `b` over a thousand draws taken in turn, or '' where it never does; with
 * `state`, their states are compared before the first draw and after each.
 */
function parted<T extends RngInstance>(a: T, b: T, draws: readonly Draw<T>[], state?: (r: T) => number): string {
  if (state && state(a) !== state(b)) return `before a draw, the state ${hex(state(a))} against ${hex(state(b))}`;
  for (let i = 0; i < DRAWS; i++) {
    const [name, draw] = draws[i % draws.length];
    const x = draw(a), y = draw(b);
    if (x !== y) return `draw ${i + 1}, ${name}: ${String(x)} against ${String(y)}`;
    if (state && state(a) !== state(b)) return `after draw ${i + 1}, ${name}, the state ${hex(state(a))} against ${hex(state(b))}`;
  }
  return '';
}

/** A Game as its generator, world and party stand. */
const look = (g: Game): string => `${g.rng.state} ${JSON.stringify(g.world.state)} ${JSON.stringify(g.party)}`;

export async function rng(): Promise<void> {
  const url = new URL('../../src/lib/engine/rng.ts', import.meta.url);
  url.search = '?rng-suite';
  const engine = (await import(url.href)) as typeof import('../../src/lib/engine/rng.ts');
  const singleton = engine.rng;
  const state = (r: Rng): number => r.state;

  // (1) Against the singleton: from where it starts, before anything seeds it, then from each seed, on
  // a generator made at the seed and on one seeded after it was made, as the Game seeds its own.
  const start = makeRng().state, fromStart = parted(makeRng(), singleton, SIX, state);
  ok(fromStart === '', `a generator made with no seed starts where the singleton does (${hex(start)}), and a thousand draws of next, range, int, pick, chance and sign in turn equal its in value and in state${fromStart ? ': ' + fromStart : ''}`);
  const bySeed = SEEDS.map((s) => {
    singleton.seed(s);
    const made = parted(makeRng(s), singleton, SIX, state);
    if (made) return `seed ${shown(s)}, made at it: ${made}`;
    singleton.seed(s);
    const later = makeRng();
    later.seed(s);
    const seeded = parted(later, singleton, SIX, state);
    return seeded && `seed ${shown(s)}, seeded after: ${seeded}`;
  }).filter((p) => p !== '');
  ok(bySeed.length === 0, `from each of ten seeds (${SEEDS.map(shown).join(', ')}), made at it or seeded after, a thousand draws in turn equal the singleton's in value and in state${bySeed.length ? ': ' + bySeed.join('; ') : ''}`);

  // (2) Against the engine's makeRng: its five draws on the nine seeds it takes. A zero it takes to 1,
  // where the singleton falls back to 0x9e3779b9; the game's is the singleton's.
  const taken = SEEDS.filter((s) => (s | 0) >>> 0 !== 0);
  const byMake = taken.map((s) => { const p = parted<RngInstance>(makeRng(s), engine.makeRng(s), FIVE); return p && `seed ${shown(s)}: ${p}`; }).filter((p) => p !== '');
  ok(taken.length === 9 && byMake.length === 0, `on the ${taken.length} seeds the engine's makeRng takes, a thousand of its five draws in turn equal its${byMake.length ? ': ' + byMake.join('; ') : ''}`);
  singleton.seed(0);
  const fallback = singleton.state, zero = makeRng(0), at = zero.state, theirs = engine.makeRng(0), one = engine.makeRng(1);
  const ours = [zero.next(), zero.next()], its = [singleton.next(), singleton.next()], made = [theirs.next(), theirs.next()], ones = [one.next(), one.next()];
  ok(at === fallback && ours.join() === its.join() && ours.join() !== made.join() && made.join() === ones.join(),
    `a seed of 0 is the singleton's (the state ${hex(at)}, its ${hex(fallback)}; the first two draws ${ours.join(', ')}) and not the engine's makeRng's, which takes it to 1 (${made.join(', ')})`);

  // (3) Two Games in one test: building one and drawing on it moves nothing of the other, and a Game
  // on seed 4 built after others have drawn stands where the first stood, built with none beside it.
  const a = headlessGame(4), a4 = look(a), s4 = a.rng.state;
  const b = headlessGame(9), moved: string[] = [];
  if (a.rng.state !== s4) moved.push(`building the Game at 9 took the one at 4 from ${hex(s4)} to ${hex(a.rng.state)}`);
  for (let i = 0; i < 100; i++) b.rng.next();
  if (a.rng.state !== s4) moved.push(`a hundred draws on the Game at 9 took the one at 4 to ${hex(a.rng.state)}`);
  const s9 = b.rng.state, drawn = Array.from({ length: 100 }, () => a.rng.next());
  if (b.rng.state !== s9) moved.push(`a hundred draws on the Game at 4 took the one at 9 from ${hex(s9)} to ${hex(b.rng.state)}`);
  ok(a.rng !== b.rng && moved.length === 0, `two Games, at seeds 4 and 9, draw two streams: building the second and a hundred draws on each move nothing of the other${moved.length ? ': ' + moved.join('; ') : ''}`);
  const c = headlessGame(4), sc = c.rng.state, c4 = look(c), again = Array.from({ length: 100 }, () => c.rng.next());
  ok(c4 === a4 && again.join() === drawn.join(), `a Game at seed 4 built after two others drew stands where the first stood when it was built (the state ${hex(sc)}, the first's ${hex(s4)}), its world and party the same, and draws the first's hundred draws`);

  // (4) A save's state round-trips from one Game into another, and loading it moves nothing of the first.
  const g = headlessGame(4);
  for (let i = 0; i < 37; i++) g.rng.next();
  const saved = g.rng.state, h = headlessLoad(serialize(g.world.state, g.party, saved));
  const left = g.rng.state, loaded = h.rng.state, nextH = h.rng.next(), nextG = g.rng.next();
  ok(h.rng !== g.rng && left === saved && loaded === saved && nextH === nextG,
    `a save of one Game (serialize) loaded into another (headlessLoad) carries its generator's state, ${hex(saved)} to ${hex(loaded)}, and the next draw, ${nextG} to ${nextH}`);
}
