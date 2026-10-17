// The navigator (#717; docs/PILOT.md): takes the party from where it stands to a square, over the
// squares it has seen and the exits it has seen, by the keys a player would press: `forward`,
// `turnLeft` and `turnRight`, never `back` or a strafe, so the viewer sees the party face where it
// goes. It reads the world through Known alone: a secret door is a wall to it until a search finds
// it, and a gate is learnt by trying it, never by its terms.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import type { Exit } from '../map.ts';
import { passableCell } from '../map.ts';
import { partyCan } from '../party.ts';
import { FACING_DX, FACING_DY, turnLeft, turnRight } from '../types.ts';
import type { Facing } from '../types.ts';
import { LAYOUT } from '../../ui/frame.ts';
import { wrap } from '../../ui/draw.ts';
import { measureText } from '../../lib/engine/text.ts';
import type { Known } from './known.ts';
import type { Brain, Pilot } from './pilot.ts';

export interface Goal {
  /** A map's id and one of its squares, or a zone map's id and a square in the zone's own reckoning (`World.locate` places it). */
  map: string; x: number; y: number;
  /** What the why line says: "Bound for <here>". */
  name: string;
  /** The why line's first line while the goal is walked, where "Bound for <name>." is not it (the explorer's, #718). */
  why?: string;
}

/** The blocks on one goal that make it shut to the navigator: at the third it drops the goal. */
const BLOCKS = 3;

/** A state of the search: a square, a facing and the keys it took to stand there so. */
interface State { x: number; y: number; f: Facing; n: number }
/** A square as the search keys it, and a state: y * 65536 + x, and that times 4 plus the facing. */
const sq = (q: { x: number; y: number }): number => q.y * 65536 + q.x;
const id = (q: State): number => sq(q) * 4 + q.f;

/**
 * Breadth-first from (x, y, facing), a step or a turn costing 1: a step goes onto a square Known has a
 * cell for that `passableCell` reads 'ok' or 'unlock' for the company (`partyCan`) and the automap
 * marks no group on. A route may end on an exit or a rift but goes on from none, as a step onto one
 * leaves the map. Each state is reached once, by its fewest keys; of two ways as short, the one that
 * steps first, then the one that turns left. It stops at the first square `end` holds for, if given;
 * `from` keeps the state each was reached from, and the key. A square in `shut` (`Pilot.shut`, #718)
 * is closed to it, as a group's is, until the explorer takes it back to try it again.
 */
function search(k: Known, map: string, x: number, y: number, facing: Facing, end?: (q: State) => boolean, shut: readonly { x: number; y: number }[] = []): { queue: State[]; from: Map<number, [number, Action]>; found?: State } {
  const can = partyCan(k.party), held = new Set([...k.groups(map), ...shut].map(sq));
  const leaves = new Set([...k.exits(map), ...k.features(map).filter((f) => f.kind === 'rift')].map(sq));
  const read = new Map<number, boolean>();
  const open = (q: State): boolean => {
    let o = read.get(sq(q));
    if (o === undefined) {
      const c = k.cell(map, q.x, q.y), pass = c && passableCell(c, can);
      o = (pass === 'ok' || pass === 'unlock') && !held.has(sq(q));
      read.set(sq(q), o);
    }
    return o;
  };
  const start: State = { x, y, f: facing, n: 0 }, from = new Map<number, [number, Action]>([[id(start), [-1, 'forward']]]), queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const q = queue[i];
    if (end?.(q)) return { queue, from, found: q };
    if (i > 0 && leaves.has(sq(q))) continue;
    const moves: [Action, State][] = [
      ['forward', { x: q.x + FACING_DX[q.f], y: q.y + FACING_DY[q.f], f: q.f, n: q.n + 1 }],
      ['turnLeft', { x: q.x, y: q.y, f: turnLeft(q.f), n: q.n + 1 }],
      ['turnRight', { x: q.x, y: q.y, f: turnRight(q.f), n: q.n + 1 }],
    ];
    for (const [a, s] of moves) {
      if ((a === 'forward' && !open(s)) || from.has(id(s))) continue;
      from.set(id(s), [id(q), a]);
      queue.push(s);
    }
  }
  return { queue, from };
}

/**
 * The keys from (x, y, facing) to (tx, ty) over seen, passable squares of one map; null when none.
 * Turning costs 1, a step 1 (`search`): round the groups the automap marks, and onto an exit or a
 * rift only at the end, and never over a square in `shut`.
 */
export function routeOn(k: Known, map: string, x: number, y: number, facing: Facing, tx: number, ty: number, shut: readonly { x: number; y: number }[] = []): Action[] | null {
  if (!k.cell(map, tx, ty)) return null;
  const { from, found } = search(k, map, x, y, facing, (q) => q.x === tx && q.y === ty, shut);
  if (!found) return null;
  const keys: Action[] = [];
  for (let s = id(found); from.get(s)![0] !== -1; s = from.get(s)![0]) keys.push(from.get(s)![1]);
  return keys.reverse();
}

/**
 * The length of `routeOn`'s route from (x, y, facing) to every square it reaches, in one search: by
 * square ("x,y"), the fewest keys over the facings it may stand there in. For a brain that wants the
 * nearest of many squares (#718's frontier, #719's businesses), where a `routeOn` for each would
 * search the map once a square. A square in `shut` is closed, as it is to `routeOn`.
 */
export function routeLengths(k: Known, map: string, x: number, y: number, facing: Facing, shut: readonly { x: number; y: number }[] = []): Map<string, number> {
  const out = new Map<string, number>();
  for (const q of search(k, map, x, y, facing, undefined, shut).queue) if (!out.has(`${q.x},${q.y}`)) out.set(`${q.x},${q.y}`, q.n);
  return out;
}

/**
 * The square of `goals` ("x,y") that `routeOn`'s route reaches in the fewest keys, or undefined where
 * it reaches none: one search, stopped at the first it reaches (#718's frontier, walls and ways found
 * shut). A square in `shut` is barred, as it is to `routeOn`.
 */
export function routeNearest(k: Known, map: string, x: number, y: number, facing: Facing, goals: ReadonlySet<string>, shut: readonly { x: number; y: number }[] = []): { x: number; y: number } | undefined {
  const { found } = search(k, map, x, y, facing, (q) => goals.has(`${q.x},${q.y}`), shut);
  return found && { x: found.x, y: found.y };
}

/**
 * The maps and exits from `from` to `to` over the exits seen; null when none, [] when the two are one
 * map. Both are maps as played (a zone map's is the outdoors', `World.locate`), as `Known.visited` and
 * an exit's `to` give them: breadth-first, an edge for each exit Known gives. A map not walked has no
 * square seen, so the way goes over visited maps alone, as the issue has it; an omniscient pilot's
 * (#723) goes over any.
 */
export function routeMaps(k: Known, from: string, to: string): { map: string; exit: Exit }[] | null {
  if (from === to) return [];
  const back = new Map<string, { map: string; exit: Exit }>(), queue = [from];
  for (let i = 0; i < queue.length; i++) {
    for (const exit of k.exits(queue[i])) {
      if (exit.to === from || back.has(exit.to)) continue;
      back.set(exit.to, { map: queue[i], exit });
      if (exit.to !== to) { queue.push(exit.to); continue; }
      const hops: { map: string; exit: Exit }[] = [];
      for (let at = to; at !== from; at = back.get(at)!.map) hops.push(back.get(at)!);
      return hops.reverse();
    }
  }
  return null;
}

/**
 * What the navigator keeps of a goal between its keys, by the goal's square (a brain may set an equal
 * goal afresh each tick): its blocks, the lines said when it was set and the last key pressed, from
 * where, with the lines said and the screens shown by then.
 */
interface Trail {
  map: string; x: number; y: number; blocks: number; said: number;
  last?: { map: string; x: number; y: number; facing: Facing; key: Action; said: number; shown: number };
}
const trails = new WeakMap<Pilot, Trail>();

/** Forgets what the navigator kept of its goal: the helm taken back, a new game or a load (`Pilot`). */
export function unroute(p: Pilot): void { trails.delete(p); }

/**
 * The brain: walks `p.goal`, pressing one key a call, and only with the map on top (a menu, a box or
 * a fight opened on the way is another brain's or the frame's, and the plan waits for it). The goal
 * is reached by standing on it or by a step onto it that went through (it took an exit, or opened a
 * visit or a fight), looked for first whatever is on top. It plans afresh when the plan is spent and
 * whenever the party is not where the last key should have left it (an exit taken, a flight, a
 * push). A step that left the party where it stood, with no screen shown since, was refused: the
 * plan goes, and at the third on one goal the goal goes too, its square told to the explorer
 * (`Pilot.shut`, #718), and gone round from then on until the explorer takes it back to try again.
 */
export const route: Brain = (g, k, p) => {
  const goal = p.goal;
  if (!goal) return null;
  const st = g.world.state, at = g.world.locate(goal.map, goal.x, goal.y);
  let t = trails.get(p);
  if (!t || t.map !== goal.map || t.x !== goal.x || t.y !== goal.y) {
    t = { map: goal.map, x: goal.x, y: goal.y, blocks: 0, said: g.said };
    trails.set(p, t);
    p.plan = [];
  }
  const last = t.last, f = !last ? st.facing : last.key === 'turnLeft' ? turnLeft(last.facing) : last.key === 'turnRight' ? turnRight(last.facing) : last.facing;
  const ahead = !last ? st : last.key === 'forward' ? { x: last.x + FACING_DX[f], y: last.y + FACING_DY[f] } : { x: last.x, y: last.y };
  const stood = !!last && st.mapId === last.map && st.x === last.x && st.y === last.y && st.facing === last.facing;
  const shown = !!last && g.shown !== last.shown;
  const onto = !!last && last.key === 'forward' && last.map === at.mapId && ahead.x === at.x && ahead.y === at.y && (!stood || shown);
  if ((st.mapId === at.mapId && st.x === at.x && st.y === at.y) || onto) { p.goal = null; p.plan = []; trails.delete(p); return null; }
  if (!(g.top instanceof ExploreScreen)) return null;
  t.last = undefined;
  if (last && last.key === 'forward' && stood && !shown) {
    p.plan = [];
    if (++t.blocks >= BLOCKS) {
      p.shut.push({ map: last.map, x: ahead.x, y: ahead.y, why: saidSince(g, last.said)[0] ?? '' });
      p.why = [`${goal.name.charAt(0).toUpperCase()}${goal.name.slice(1)} is shut to me.`];
      p.goal = null;
      trails.delete(p);
      return null;
    }
  } else if (last && (st.mapId !== last.map || st.x !== ahead.x || st.y !== ahead.y || st.facing !== f)) p.plan = [];
  if (!p.plan.length) {
    // A square found shut is gone round until the explorer tries it again (#718).
    const shut = p.shut.filter((s) => s.map === st.mapId);
    const plan = st.mapId === at.mapId ? routeOn(k, st.mapId, st.x, st.y, st.facing, at.x, at.y, shut) : toExit(k, st, at.mapId, shut);
    if (!plan?.length) { p.why = [`No way to ${goal.name} that I have seen.`]; p.goal = null; trails.delete(p); return null; }
    p.plan = plan;
  }
  const key = p.plan.shift()!, heard = saidSince(g, t.said).at(-1);
  t.last = { map: st.mapId, x: st.x, y: st.y, facing: st.facing, key, said: g.said, shown: g.shown };
  const say = goal.why ?? `Bound for ${goal.name}.`;
  p.why = heard === undefined ? [say] : [say, fit(heard)];
  return key;
};

/** The keys to the nearest seen exit of this map that is the first of `routeMaps`'s way to `to`, or null; none over a square in `shut`. */
function toExit(k: Known, st: { mapId: string; x: number; y: number; facing: Facing }, to: string, shut: readonly { x: number; y: number }[]): Action[] | null {
  const next = routeMaps(k, st.mapId, to)?.[0]?.exit.to;
  let best: Action[] | null = null;
  for (const e of next === undefined ? [] : k.exits(st.mapId)) {
    const keys = e.to === next ? routeOn(k, st.mapId, st.x, st.y, st.facing, e.x, e.y, shut) : null;
    if (keys && (!best || keys.length < best.length)) best = keys;
  }
  return best;
}

/** The lines the log has had since it had said `said` (`Game.said`), oldest first. */
const saidSince = (g: Game, said: number): string[] => (g.said > said ? g.log.slice(-(g.said - said)) : []);

/** The width a line of the band has: the view's, less a margin each side, as a line of the log has. */
const BAND = LAYOUT.view.w - 12;
/** A line as the band's one line can hold it: whole where it fits, else cut at a word with '...'. */
function fit(line: string): string {
  return measureText(line) <= BAND ? line : `${wrap(line, BAND - measureText('...'))[0]}...`;
}
