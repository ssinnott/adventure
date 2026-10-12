// The navigator (#717): the way from where the party stands to a square, over squares it has seen
// and by ways off a map it has seen, pressed as a player would press it, a step or a turn a beat. It
// never steps back or aside, so the viewer sees the party face where it goes. It reads the world only
// through Known: a secret door is a wall to it until a search finds it, a lock a door until it is
// tried, and a gate is learnt by trying it. A route is a plan, not a lock: a fight or a message on
// the way plays out and the walk goes on, and wherever the party stands that the plan did not put
// it, it plans again.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import { passCell } from '../map.ts';
import type { Exit } from '../map.ts';
import { FACING_DX, FACING_DY, turnLeft, turnRight } from '../types.ts';
import type { Facing } from '../types.ts';
import type { Known } from './known.ts';
import type { Brain } from './pilot.ts';

export interface Goal { map: string; x: number; y: number; /** What the why line says: "Bound for <here>". */ name: string }

/**
 * The navigator's reckoning of its goal, kept between beats: the goal, the lines said before it was
 * set, the steps refused on the way, and where the last key was pressed from.
 */
export interface Trip {
  goal: Goal;
  said: number;
  blocks: number;
  last?: { key: Action; map: string; x: number; y: number; facing: Facing; steps: number; said: number };
}

/** The steps refused on one goal before it is given up as shut. */
export const BLOCKS = 3;

/** What a step onto opens before the walk can go on: a person's words, a business's menus, a den's question. */
const STOPS = new Set(['npc', 'inn', 'temple', 'shop', 'guild', 'trainer', 'den']);
/** Wider than any map: a square and a facing as one number. */
const SPAN = 4096;

/** The keys from (x, y, facing) to (tx, ty) over seen, passable squares of one map; null when none. Turning costs 1, a step 1. */
export function routeOn(k: Known, map: string, x: number, y: number, facing: Facing, tx: number, ty: number): Action[] | null {
  if (x === tx && y === ty) return [];
  const can = k.can(), sq = (cx: number, cy: number): number => cy * SPAN + cx;
  const held = new Set(k.groups(map).map((q) => sq(q.x, q.y)));
  // A way off the map carries the party off it, and a person or a business stops it: each is walked to, never over.
  const aside = new Set([...k.exits(map), ...k.features(map).filter((f) => STOPS.has(f.kind))].map((q) => sq(q.x, q.y)));
  const open = new Map<number, boolean>();
  const walks = (cx: number, cy: number): boolean => {
    const at = sq(cx, cy);
    let ok = open.get(at);
    if (ok === undefined) {
      const c = k.cell(map, cx, cy), pass = c && passCell(c, can);
      ok = (pass === 'ok' || pass === 'unlock') && !held.has(at) && (!aside.has(at) || (cx === tx && cy === ty));
      open.set(at, ok);
    }
    return ok;
  };
  // Breadth first over the square and the facing, each move a key.
  const id = (cx: number, cy: number, f: Facing): number => sq(cx, cy) * 4 + f;
  const first = id(x, y, facing), came = new Map<number, { from: number; key: Action }>([[first, { from: first, key: 'forward' }]]);
  const queue: [number, number, Facing][] = [[x, y, facing]];
  for (let i = 0; i < queue.length; i++) {
    const [cx, cy, f] = queue[i], here = id(cx, cy, f);
    const moves: [Action, number, number, Facing][] = [['forward', cx + FACING_DX[f], cy + FACING_DY[f], f], ['turnLeft', cx, cy, turnLeft(f)], ['turnRight', cx, cy, turnRight(f)]];
    for (const [key, mx, my, mf] of moves) {
      if (key === 'forward' && !walks(mx, my)) continue;
      const there = id(mx, my, mf);
      if (came.has(there)) continue;
      came.set(there, { from: here, key });
      if (mx === tx && my === ty) {
        const keys: Action[] = [];
        for (let s = there; s !== first; s = came.get(s)!.from) keys.unshift(came.get(s)!.key);
        return keys;
      }
      queue.push([mx, my, mf]);
    }
  }
  return null;
}

/** The maps and exits from `from` to `to` over visited maps' seen exits; null when none. */
export function routeMaps(k: Known, from: string, to: string): { map: string; exit: Exit }[] | null {
  if (from === to) return [];
  const visited = new Set(k.visited()), came = new Map<string, { map: string; exit: Exit }>(), queue = [from];
  for (let i = 0; i < queue.length; i++) {
    for (const exit of k.exits(queue[i])) {
      const next = exit.to;
      if (next === from || came.has(next) || (next !== to && !visited.has(next))) continue;
      came.set(next, { map: queue[i], exit });
      if (next === to) {
        const hops: { map: string; exit: Exit }[] = [];
        for (let m = to; m !== from; m = came.get(m)!.map) hops.unshift(came.get(m)!);
        return hops;
      }
      queue.push(next);
    }
  }
  return null;
}

/** A name to begin a line with. */
const upper = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** The brain: walks p.goal, pressing one key a call. */
export const route: Brain = (g, k, p) => {
  const goal = p.goal;
  // Its keys are the explorer's: anything else on top is another brain's, or the screen's own.
  if (!goal || !(g.top instanceof ExploreScreen)) return null;
  const st = g.world.state;
  let trip = p.trip;
  if (!trip || trip.goal.map !== goal.map || trip.goal.x !== goal.x || trip.goal.y !== goal.y) {
    trip = p.trip = { goal, said: g.said, blocks: 0 };
    p.plan = [];
  }
  trip.goal = goal;
  // Where the last key left the party: a step that went nowhere was refused, and anywhere the plan
  // did not put it (an exit taken, a flight), it plans again.
  const last = trip.last;
  trip.last = undefined;
  if (last?.key === 'forward' && st.mapId === last.map && st.steps === last.steps) {
    p.plan = [];
    if (++trip.blocks >= BLOCKS) {
      const told = g.log[g.log.length - (g.said - last.said)] ?? '';
      p.shut.push({ map: last.map, x: last.x + FACING_DX[last.facing], y: last.y + FACING_DY[last.facing], why: told });
      p.why = [`${upper(goal.name)} is shut to me.`];
      p.goal = null; p.trip = null;
      return null;
    }
  } else if (last) {
    const step = last.key === 'forward' ? 1 : 0, f = last.key === 'turnLeft' ? turnLeft(last.facing) : last.key === 'turnRight' ? turnRight(last.facing) : last.facing;
    if (st.mapId !== last.map || st.x !== last.x + FACING_DX[f] * step || st.y !== last.y + FACING_DY[f] * step || st.facing !== f) p.plan = [];
  }
  const at = g.world.locate(goal.map, goal.x, goal.y);
  if (st.mapId === at.mapId && st.x === at.x && st.y === at.y) { p.goal = null; p.trip = null; p.plan = []; return null; }
  if (!p.plan.length) {
    const to = at.mapId === st.mapId ? at : routeMaps(k, st.mapId, at.mapId)?.[0]?.exit;
    const keys = to && routeOn(k, st.mapId, st.x, st.y, st.facing, to.x, to.y);
    if (!keys?.length) { p.why = [`No way to ${goal.name} that I have seen.`]; p.goal = null; p.trip = null; return null; }
    p.plan = keys;
  }
  const key = p.plan.shift()!;
  trip.last = { key, map: st.mapId, x: st.x, y: st.y, facing: st.facing, steps: st.steps, said: g.said };
  p.why = g.said > trip.said ? [`Bound for ${goal.name}.`, g.log[g.log.length - 1]] : [`Bound for ${goal.name}.`];
  return key;
};
