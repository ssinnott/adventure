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
}

/** The blocks on one goal that make it shut to the navigator: at the third it drops the goal. */
const BLOCKS = 3;

/**
 * The keys from (x, y, facing) to (tx, ty) over seen, passable squares of one map; null when none.
 * Turning costs 1, a step 1: breadth-first over (x, y, facing), a step going onto a square Known has a
 * cell for that `passableCell` reads 'ok' or 'unlock' for the company (`partyCan`), where the automap
 * marks no group, and that holds no exit or rift short of the end (a step onto one leaves the map).
 * Of two routes as short, the one that steps first, then the one that turns left.
 */
export function routeOn(k: Known, map: string, x: number, y: number, facing: Facing, tx: number, ty: number): Action[] | null {
  if (!k.cell(map, tx, ty)) return null;
  const can = partyCan(k.party), sq = (q: { x: number; y: number }): string => `${q.x},${q.y}`;
  const held = new Set(k.groups(map).map(sq));
  const leaves = new Set([...k.exits(map), ...k.features(map).filter((f) => f.kind === 'rift')].map(sq));
  const open = (q: { x: number; y: number }): boolean => {
    const c = k.cell(map, q.x, q.y), pass = c && passableCell(c, can), s = sq(q);
    return (pass === 'ok' || pass === 'unlock') && !held.has(s) && (!leaves.has(s) || (q.x === tx && q.y === ty));
  };
  // A state is (y * 65536 + x) * 4 + facing; `from` keeps the state each was reached from, and the key.
  const id = (q: { x: number; y: number; f: Facing }): number => (q.y * 65536 + q.x) * 4 + q.f;
  const start = { x, y, f: facing }, from = new Map<number, [number, Action]>([[id(start), [-1, 'forward']]]);
  const queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const q = queue[i];
    if (q.x === tx && q.y === ty) {
      const keys: Action[] = [];
      for (let s = id(q); s !== id(start); s = from.get(s)![0]) keys.push(from.get(s)![1]);
      return keys.reverse();
    }
    const moves: [Action, { x: number; y: number; f: Facing }][] = [
      ['forward', { x: q.x + FACING_DX[q.f], y: q.y + FACING_DY[q.f], f: q.f }],
      ['turnLeft', { x: q.x, y: q.y, f: turnLeft(q.f) }],
      ['turnRight', { x: q.x, y: q.y, f: turnRight(q.f) }],
    ];
    for (const [a, n] of moves) {
      if ((a === 'forward' && !open(n)) || from.has(id(n))) continue;
      from.set(id(n), [id(q), a]);
      queue.push(n);
    }
  }
  return null;
}

/**
 * The maps and exits from `from` to `to` over visited maps' seen exits; null when none, [] when the
 * two are one map. Both are maps as played (a zone map's is the outdoors', `World.locate`), as
 * `Known.visited` and an exit's `to` give them: breadth-first, an edge for each exit Known gives on a
 * map whose `to` is visited or is `to`.
 */
export function routeMaps(k: Known, from: string, to: string): { map: string; exit: Exit }[] | null {
  if (from === to) return [];
  const visited = new Set(k.visited()), back = new Map<string, { map: string; exit: Exit }>(), queue = [from];
  for (let i = 0; i < queue.length; i++) {
    for (const exit of k.exits(queue[i])) {
      if (exit.to === from || back.has(exit.to) || (!visited.has(exit.to) && exit.to !== to)) continue;
      back.set(exit.to, { map: queue[i], exit });
      if (exit.to !== to) { queue.push(exit.to); continue; }
      const hops: { map: string; exit: Exit }[] = [];
      for (let at = to; at !== from; at = back.get(at)!.map) hops.push(back.get(at)!);
      return hops.reverse();
    }
  }
  return null;
}

/** What the navigator keeps of a goal between its keys: its blocks, the lines said when it was set, and the last key pressed and from where. */
interface Trail {
  goal: Goal; blocks: number; said: number;
  last?: { map: string; x: number; y: number; facing: Facing; key: Action; said: number };
}
const trails = new WeakMap<Pilot, Trail>();

/**
 * The brain: walks `p.goal`, pressing one key a call, and only with the map on top (a menu, a box or
 * a fight opened on the way is another brain's or the frame's, and the plan waits for it). It plans
 * afresh when the plan is spent and whenever the party is not where the last key should have left
 * it (an exit taken, a flight, a push). A step that left the party where it stood was blocked: the
 * plan goes, and at the third block on one goal the goal goes too, its square told to the explorer
 * (`Pilot.shut`, #718).
 */
export const route: Brain = (g, k, p) => {
  const goal = p.goal;
  if (!goal || !(g.top instanceof ExploreScreen)) return null;
  const st = g.world.state, at = g.world.locate(goal.map, goal.x, goal.y);
  let t = trails.get(p);
  if (!t || t.goal !== goal) { t = { goal, blocks: 0, said: g.said }; trails.set(p, t); p.plan = []; }
  if (st.mapId === at.mapId && st.x === at.x && st.y === at.y) { p.goal = null; p.plan = []; return null; }
  const last = t.last;
  t.last = undefined;
  if (last) {
    const f = last.key === 'turnLeft' ? turnLeft(last.facing) : last.key === 'turnRight' ? turnRight(last.facing) : last.facing;
    const ahead = last.key === 'forward' ? { x: last.x + FACING_DX[f], y: last.y + FACING_DY[f] } : { x: last.x, y: last.y };
    const stood = st.mapId === last.map && st.x === last.x && st.y === last.y && st.facing === last.facing;
    if (last.key === 'forward' && stood) {
      p.plan = [];
      if (++t.blocks >= BLOCKS) {
        p.shut.push({ map: last.map, ...ahead, why: saidSince(g, last.said)[0] ?? '' });
        p.why = [`${goal.name[0].toUpperCase()}${goal.name.slice(1)} is shut to me.`];
        p.goal = null;
        return null;
      }
    } else if (st.mapId !== last.map || st.x !== ahead.x || st.y !== ahead.y || st.facing !== f) p.plan = [];
  }
  if (!p.plan.length) {
    const plan = st.mapId === at.mapId ? routeOn(k, st.mapId, st.x, st.y, st.facing, at.x, at.y) : toExit(k, st, at.mapId);
    if (!plan?.length) { p.why = [`No way to ${goal.name} that I have seen.`]; p.goal = null; return null; }
    p.plan = plan;
  }
  const key = p.plan.shift()!, heard = saidSince(g, t.said).at(-1);
  t.last = { map: st.mapId, x: st.x, y: st.y, facing: st.facing, key, said: g.said };
  p.why = heard === undefined ? [`Bound for ${goal.name}.`] : [`Bound for ${goal.name}.`, fit(heard)];
  return key;
};

/** The keys to the nearest seen exit of this map that is the first of `routeMaps`'s way to `to`, or null. */
function toExit(k: Known, st: { mapId: string; x: number; y: number; facing: Facing }, to: string): Action[] | null {
  const next = routeMaps(k, st.mapId, to)?.[0]?.exit.to;
  let best: Action[] | null = null;
  for (const e of next === undefined ? [] : k.exits(st.mapId)) {
    const keys = e.to === next ? routeOn(k, st.mapId, st.x, st.y, st.facing, e.x, e.y) : null;
    if (keys && (!best || keys.length < best.length)) best = keys;
  }
  return best;
}

/** The lines the log has had since it had said `said` (`Game.said`), oldest first. */
const saidSince = (g: Game, said: number): string[] => (g.said > said ? g.log.slice(-(g.said - said)) : []);

/** The band's width for a line, as the log's (`logLines`). */
const BAND = LAYOUT.view.w - 12;
/** A line as the band's one line can hold it: whole where it fits, else cut at a word with '...'. */
function fit(line: string): string {
  return measureText(line) <= BAND ? line : `${wrap(line, BAND - measureText('...'))[0]}...`;
}
