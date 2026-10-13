// The navigator (#717): the way from where the party stands to a square, over squares it has seen
// and by ways off a map it has seen, or a crossing it has been offered (#721), taken from the seller's
// square as talk answers the seller, pressed as a player would press it, a step or a turn a beat. It
// never steps back or aside, so the viewer sees the party face where it goes. It reads the world only
// through Known: a secret door is a wall to it until a search finds it, a lock a door until it is
// tried, and a gate is learnt by trying it. A way refused three times on one goal is shut and told to
// the explorer (#718); the next goal tries it afresh, as a tide may have gone out. Bound off a map, it
// takes the first way off on a route there with a way it has seen to each way off on it, from where it
// stands and from where the one before lands, so of two into one map, one refused or out of reach on
// any map between, it takes the other. A group seen on a map stands, to it, where it was last seen
// there while it is elsewhere, so it never walks back to a way it turned from. A person, a business, a
// den, a way off and a tear into a Rift are stops: the brain's route (walkOn) ends on one when bound
// there and goes round it else, over a person or a den in the open only where it has seen no way
// round, and the step onto it, taken, ends the trip, so what opens there is another brain's (#719,
// #721); routeOn, as #717 gives it, goes over them. A route is a plan, not a lock: a fight or a message
// on the way plays out and the walk goes on, and wherever the party stands that the plan did not put
// it, it plans again. It presses keys only on the street, but for Esc to the question of a person or a
// den it passes over, as a player passing would: any other menu is another brain's, or the screen's
// own, and it waits on it, bound still.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import { ChoiceScreen } from '../../ui/screens.ts';
import type { Action } from '../../input.ts';
import { passCell } from '../map.ts';
import type { Exit } from '../map.ts';
import { FACING_DX, FACING_DY, turnBack, turnLeft, turnRight } from '../types.ts';
import type { Facing } from '../types.ts';
import type { Known } from './known.ts';
import type { Brain } from './pilot.ts';

export interface Goal {
  map: string; x: number; y: number;
  /** What the why line calls it: "Bound for <here>". */
  name: string;
  /** What the why line says on the way instead, as the explorer's "Looking about Helmstow." (#718). */
  why?: string;
}

/**
 * The navigator's reckoning of its goal, kept between beats: the goal, the lines said before it was
 * set, the squares a step onto was refused on the way, on the map as played, the groups in sight on
 * each map as it last planned there, and where the last key should leave the party, with whether it
 * was a step, and one onto the stop it is bound for, and the steps walked and lines said as it was
 * pressed.
 */
export interface Trip {
  goal: Goal;
  said: number;
  refused: { map: string; x: number; y: number }[];
  groups: { map: string; x: number; y: number }[];
  last?: { map: string; x: number; y: number; facing: Facing; step: boolean; stop: boolean; steps: number; said: number };
}

/** The steps refused on one goal before it is given up as shut. */
export const BLOCKS = 3;

/** What opens as a company steps onto it: a person, a den and a business. A way off and a tear carry it off (Known.exits). */
const OPENS = new Set(['npc', 'den', 'inn', 'temple', 'shop', 'guild', 'trainer']);
/** What a company stands on as it opens, out of a doorway: a person and a den. */
const STANDS = new Set(['npc', 'den']);
/** The why's second line while a menu met on the way waits for the brain whose it is (#721). */
export const HELD = 'A question bars the way.';
/** Wider than any map: a square and a facing as one number. */
const SPAN = 4096;

/**
 * The stops on a map: a way off, a tear, a person, a den and a business; or, not `all`, those no step
 * gets past: a way off and a tear carry the party off, and a business or a person in a doorway turns
 * it back onto the street, where a person or a den in the open is stood on.
 */
export function stops(k: Known, map: string, all = true): { x: number; y: number }[] {
  return [...k.exits(map), ...k.features(map).filter((f) => OPENS.has(f.kind) && (all || !STANDS.has(f.kind) || k.cell(map, f.x, f.y)?.door === 'door'))];
}

/** Whether a route on `map` steps onto a square: seen, passable as the company can cross it, and no group in sight on it and none of `held`. */
function opens(k: Known, map: string, held: readonly { x: number; y: number }[]): (x: number, y: number) => boolean {
  const can = k.can(), sq = (cx: number, cy: number): number => cy * SPAN + cx;
  const wall = new Set([...k.groups(map), ...held].map((q) => sq(q.x, q.y)));
  const open = new Map<number, boolean>();
  return (cx, cy) => {
    const at = sq(cx, cy);
    let ok = open.get(at);
    if (ok === undefined) {
      const c = k.cell(map, cx, cy), pass = c && passCell(c, can);
      ok = (pass === 'ok' || pass === 'unlock') && !wall.has(at);
      open.set(at, ok);
    }
    return ok;
  };
}

/** The keys from (x, y, facing) to the nearest square `at` holds, by the squares `walks` steps onto; none from one itself, and null when there is no way. Turning costs 1, a step 1. */
function keysTo(walks: (x: number, y: number) => boolean, x: number, y: number, facing: Facing, at: (x: number, y: number) => boolean): Action[] | null {
  if (at(x, y)) return [];
  const id = (cx: number, cy: number, f: Facing): number => (cy * SPAN + cx) * 4 + f, first = id(x, y, facing);
  // Breadth first over the square and the facing, each move a key.
  const came = new Map<number, { from: number; key: Action }>([[first, { from: first, key: 'forward' }]]);
  const queue: [number, number, Facing][] = [[x, y, facing]];
  for (let i = 0; i < queue.length; i++) {
    const [cx, cy, f] = queue[i], here = id(cx, cy, f);
    const moves: [Action, number, number, Facing][] = [['forward', cx + FACING_DX[f], cy + FACING_DY[f], f], ['turnLeft', cx, cy, turnLeft(f)], ['turnRight', cx, cy, turnRight(f)]];
    for (const [key, mx, my, mf] of moves) {
      if (key === 'forward' && !walks(mx, my)) continue;
      // Only a step onto it arrives: a turn on it is the party standing there still.
      if (key === 'forward' && at(mx, my)) {
        const keys: Action[] = [key];
        for (let s = here; s !== first; s = came.get(s)!.from) keys.unshift(came.get(s)!.key);
        return keys;
      }
      const there = id(mx, my, mf);
      if (came.has(there)) continue;
      came.set(there, { from: here, key });
      queue.push([mx, my, mf]);
    }
  }
  return null;
}

/**
 * Whether a walk from (x, y), by the squares `walks` steps onto, reaches a square or one beside it, a
 * square and every facing on it as one: it spreads no further than each answer needs, and is kept.
 */
function reaches(walks: (x: number, y: number) => boolean, x: number, y: number): (tx: number, ty: number) => boolean {
  const near = new Set([y * SPAN + x]), queue: [number, number][] = [[x, y]];
  let i = 0;
  return (tx, ty) => {
    if (near.has(ty * SPAN + tx) || FACING_DX.some((dx, d) => near.has((ty - FACING_DY[d]) * SPAN + tx - dx))) return true;
    for (; i < queue.length; i++) {
      for (let f = 0; f < 4; f++) {
        const nx = queue[i][0] + FACING_DX[f], ny = queue[i][1] + FACING_DY[f];
        if (near.has(ny * SPAN + nx) || !walks(nx, ny)) continue;
        near.add(ny * SPAN + nx);
        queue.push([nx, ny]);
        if (Math.abs(nx - tx) + Math.abs(ny - ty) <= 1) return true;
      }
    }
    return false;
  };
}

/** The keys from (x, y, facing) to (tx, ty) over seen, passable squares of one map, round a group in sight; null when none. Turning costs 1, a step 1. */
export function routeOn(k: Known, map: string, x: number, y: number, facing: Facing, tx: number, ty: number): Action[] | null {
  return keysTo(opens(k, map, []), x, y, facing, (cx, cy) => cx === tx && cy === ty);
}

/**
 * The route the brain walks: routeOn's, round the squares in `aside`, and round every stop that is
 * not (tx, ty) while it has seen a way round, else over a person or a den in the open, as Saltmouth's
 * quay is past its stevedore.
 */
export function walkOn(k: Known, map: string, x: number, y: number, facing: Facing, tx: number, ty: number, aside: readonly { x: number; y: number }[] = []): Action[] | null {
  return nearestOn(k, map, x, y, facing, [{ x: tx, y: ty }], aside)?.keys ?? null;
}

/**
 * The nearest of `squares` by the brain's route (walkOn), round the squares in `aside`: the square,
 * and the keys there, none when the party stands on one; null when it reaches none.
 */
export function nearestOn(k: Known, map: string, x: number, y: number, facing: Facing, squares: readonly { x: number; y: number }[], aside: readonly { x: number; y: number }[] = []): { x: number; y: number; keys: Action[] } | null {
  // None to reach is no walk at all, not a search of every square in reach for none.
  if (!squares.length) return null;
  const wanted = new Set(squares.map((q) => q.y * SPAN + q.x)), at = (cx: number, cy: number): boolean => wanted.has(cy * SPAN + cx);
  for (const all of [true, false]) {
    const keys = keysTo(opens(k, map, [...aside, ...stops(k, map, all).filter((q) => !at(q.x, q.y))]), x, y, facing, at);
    if (!keys) continue;
    let ex = x, ey = y, f = facing;
    for (const key of keys) {
      if (key === 'turnLeft') f = turnLeft(f);
      else if (key === 'turnRight') f = turnRight(f);
      else { ex += FACING_DX[f]; ey += FACING_DY[f]; }
    }
    return { x: ex, y: ey, keys };
  }
  return null;
}

/**
 * The keys that step off (x, y) onto an open square beside it, not one in `aside`, and back on, the
 * fewest turns first, as a way off the map the party stands on is taken; null when none beside it is open.
 */
function offAndOn(k: Known, map: string, x: number, y: number, facing: Facing, aside: readonly { x: number; y: number }[] = []): Action[] | null {
  const walks = opens(k, map, [...aside, ...stops(k, map)]);
  const ways: [Facing, Action[]][] = [[facing, []], [turnLeft(facing), ['turnLeft']], [turnRight(facing), ['turnRight']], [turnBack(facing), ['turnLeft', 'turnLeft']]];
  const off = ways.find(([f]) => walks(x + FACING_DX[f], y + FACING_DY[f]));
  return off ? [...off[1], 'forward', 'turnLeft', 'turnLeft', 'forward'] : null;
}

/**
 * The maps and exits from `from` to `to` over visited maps' seen exits and the crossings offered on
 * them (Known.offers), an exit first, by none on a square of `skip` on its map; null when none.
 */
export function routeMaps(k: Known, from: string, to: string, skip: readonly { map: string; x: number; y: number }[] = []): { map: string; exit: Exit }[] | null {
  // A zone's id is the outdoors': from one zone to the next is walking, no exit.
  from = k.mapOf(from); to = k.mapOf(to);
  if (from === to) return [];
  const visited = new Set(k.visited()), came = new Map<string, { map: string; exit: Exit }>(), queue = [from];
  for (let i = 0; i < queue.length; i++) {
    for (const exit of [...k.exits(queue[i]), ...k.offers(queue[i])]) {
      const next = exit.to;
      if (next === from || came.has(next) || (next !== to && !visited.has(next)) || skip.some((q) => q.map === queue[i] && q.x === exit.x && q.y === exit.y)) continue;
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

/**
 * The keys from where the party stands to `at`, round the squares in `aside` on each map: on its map,
 * to it; off it, to the first way off on a route there with a way it has seen to each way off on it,
 * from where it stands and from where the one before lands; null when none.
 */
export function wayTo(k: Known, st: { mapId: string; x: number; y: number; facing: Facing }, at: { mapId: string; x: number; y: number }, aside: readonly { map: string; x: number; y: number }[]): Action[] | null {
  const here = (map: string): { x: number; y: number }[] => aside.filter((q) => q.map === map);
  // A route is sought only to a square in reach, as a search for one out of reach is long: where a walk
  // round every stop no step gets past, as walkOn goes at its widest, stands on it, or reaches beside it
  // and it is open. The walk from each square is kept for every way off sought from there.
  const walked = new Map<string, (tx: number, ty: number) => boolean>();
  const on = (map: string, x: number, y: number, f: Facing, tx: number, ty: number): Action[] | null => {
    const from = `${map} ${x} ${y}`, near = walked.get(from) ?? reaches(opens(k, map, [...here(map), ...stops(k, map, false)]), x, y);
    walked.set(from, near);
    return near(tx, ty) && ((tx === x && ty === y) || opens(k, map, here(map))(tx, ty)) ? walkOn(k, map, x, y, f, tx, ty, here(map)) : null;
  };
  if (at.mapId === st.mapId) return on(st.mapId, st.x, st.y, st.facing, at.x, at.y);
  const skip: { map: string; x: number; y: number }[] = [];
  for (let hops = routeMaps(k, st.mapId, at.mapId); hops; hops = routeMaps(k, st.mapId, at.mapId, skip)) {
    // The first way off on it with no way it has seen to it, from where it stands or where the way
    // before lands it; where that way gives no facing, any will do, as the party can always turn.
    const keys = on(st.mapId, st.x, st.y, st.facing, hops[0].exit.x, hops[0].exit.y), by = (i: number): Exit => hops[i - 1].exit;
    const cut = keys ? hops.findIndex((h, i) => i > 0 && !on(h.map, by(i).tx, by(i).ty, by(i).tf ?? st.facing, h.exit.x, h.exit.y)) : 0;
    if (cut < 0) return keys;
    skip.push({ map: hops[cut].map, x: hops[cut].exit.x, y: hops[cut].exit.y });
  }
  return null;
}

/** A name to begin a line with. */
const upper = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** The brain: walks p.goal, pressing one key a call. */
export const route: Brain = (g, k, p) => {
  const goal = p.goal;
  if (!goal) return null;
  const st = g.world.state, at = g.world.locate(goal.map, goal.x, goal.y);
  // A goal of its own: what was planned, refused and said on the way to another is not this one's.
  if (!p.trip || p.trip.goal.map !== goal.map || p.trip.goal.x !== goal.x || p.trip.goal.y !== goal.y) {
    p.trip = { goal, said: g.said, refused: [], groups: [] };
    p.plan = [];
  }
  const trip = p.trip, last = trip.last, bound = goal.why ?? `Bound for ${goal.name}.`, done = (): null => { p.goal = null; p.trip = null; p.plan = []; return null; };
  if (st.mapId === at.mapId && st.x === at.x && st.y === at.y) return done();
  // The step onto a stop it is bound for, taken: what opens there, or where it leads, is not the
  // navigator's. Refused, it is counted as any step refused.
  if (last?.stop && (st.mapId !== last.map || st.steps !== last.steps)) return done();
  const top = g.top;
  if (!(top instanceof ExploreScreen)) {
    // The question of a person or a den stepped over, where it had seen no way round, it answers with
    // nothing, as a player passing would, and it comes again when they are met (#721).
    const over = last?.step && st.mapId === last.map && st.x === last.x && st.y === last.y && st.steps !== last.steps
      && k.features(st.mapId).find((f) => STANDS.has(f.kind) && f.x === st.x && f.y === st.y);
    if (over && top instanceof ChoiceScreen && top.title === (over.kind === 'npc' ? over.name : '')) return 'cancel';
    p.why = [bound, HELD];
    return null;
  }
  // Where the last key left the party: a step that went nowhere was refused, and anywhere else the
  // plan did not put it (an exit taken, a flight), it plans again.
  trip.last = undefined;
  if (last && (st.mapId !== last.map || st.x !== last.x || st.y !== last.y || st.facing !== last.facing)) {
    p.plan = [];
    if (last.step && st.mapId === last.map && st.steps === last.steps && trip.refused.push({ map: last.map, x: last.x, y: last.y }) >= BLOCKS) {
      // Told to the explorer once, with the line it was refused with, if the log has it still.
      if (!p.shut.some((q) => q.map === last.map && q.x === last.x && q.y === last.y)) p.shut.push({ map: last.map, x: last.x, y: last.y, why: g.log[g.log.length - (g.said - last.said)] ?? '' });
      p.why = [`${upper(goal.name)} is shut to me.`];
      return done();
    }
  }
  if (!p.plan.length) {
    // The groups in sight here are those it saw here last: Known has none on another map, so a way it
    // turned from for one stays out of reach from there, and it never walks back to it.
    trip.groups = [...trip.groups.filter((q) => q.map !== st.mapId), ...k.groups(st.mapId).map((q) => ({ map: st.mapId, ...q }))];
    // Round the squares refused on the way and the groups seen while it has seen a way round; else at
    // those refused again.
    let keys = wayTo(k, st, at, [...trip.refused, ...trip.groups]) ?? (trip.refused.length ? wayTo(k, st, at, trip.groups) : null);
    // Landed on the way off it must take, as Brandy Hole lands a company on the square it climbs out
    // by: it steps off onto an open square beside it and back on, round those refused while it can.
    if (keys?.length === 0) keys = offAndOn(k, st.mapId, st.x, st.y, st.facing, trip.refused.filter((q) => q.map === st.mapId)) ?? offAndOn(k, st.mapId, st.x, st.y, st.facing);
    if (!keys?.length) { p.why = [`No way to ${goal.name} that I have seen.`]; return done(); }
    p.plan = keys;
  }
  const key = p.plan.shift()!, step = key === 'forward';
  const facing = key === 'turnLeft' ? turnLeft(st.facing) : key === 'turnRight' ? turnRight(st.facing) : st.facing;
  const x = step ? st.x + FACING_DX[facing] : st.x, y = step ? st.y + FACING_DY[facing] : st.y;
  const stop = step && st.mapId === at.mapId && x === at.x && y === at.y && stops(k, st.mapId).some((q) => q.x === x && q.y === y);
  trip.last = { map: st.mapId, x, y, facing, step, stop, steps: st.steps, said: g.said };
  p.why = g.said > trip.said ? [bound, g.log[g.log.length - 1]] : [bound];
  return key;
};
