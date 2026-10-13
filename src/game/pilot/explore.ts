// The explorer (#718): where the navigator has no goal, it makes one. First a way shut to the
// navigator that the company can open now: a lock once it carries a key, anything else once a flag
// has been set since it was shut. Then the nearest square it has seen with one unseen beside it, by
// the brain's route and round the ways shut. With none left, the nearest wall the seen map suggests a
// secret behind, a wall with seen floor either side or a dead end's end wall with the square past it
// unseen, searched once from each side it is faced from; a door found there is a door to Known, and
// the walk goes on through it. With either left only past a group in sight, it goes at the group, and
// the fight is the bot's. Outdoors it walks the zone it stands in, or the one the strategist prefers
// (#720), and never a zone beyond the company's strength that is not preferred. A way off, a business, a person and a den are not walked to, as
// what opens there is another brain's. It reads the world only through Known (known.ts).
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import { passCell } from '../map.ts';
import { companyLevel } from '../party.ts';
import { BLOCK_TEXT } from '../world.ts';
import { FACING_DX, FACING_DY, NORTH, EAST, SOUTH, WEST, turnRight, turnBack } from '../types.ts';
import type { Facing } from '../types.ts';
import type { Known } from './known.ts';
import type { Brain, Pilot } from './pilot.ts';
import { route, stops, nearestOn } from './route.ts';
import type { Goal } from './route.ts';

/** The why line while it walks to a wall, faces it and searches it. */
export const SEARCHING = 'Searching the wall.';
/** The why line while it goes at a group in sight across the way on. */
export const CLEARING = 'Clearing the way.';

/** Whether the company steps onto a seen square of `map`, as the navigator reads it. */
function floor(k: Known, map: string, x: number, y: number): boolean {
  const c = k.cell(map, x, y), pass = c && passCell(c, k.can());
  return pass === 'ok' || pass === 'unlock';
}

/**
 * Seen, passable squares with an unseen 4-neighbour, on `map`, its edge closed: none that is a stop
 * (route.ts), as what lies past a way off, a business, a person or a den is not walked through, nor
 * a way shut (Pilot.shut).
 */
export function frontier(k: Known, g: Game, map: string): { x: number; y: number }[] {
  const { w, h } = k.size(map), at = g.world.locate(map, 0, 0);
  const shut = (g.pilot?.shut ?? []).filter((s) => s.map === at.mapId).map((s) => ({ x: s.x - at.x, y: s.y - at.y }));
  const barred = new Set([...stops(k, map), ...shut].map((q) => `${q.x},${q.y}`)), out: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!k.seen(map, x, y) || barred.has(`${x},${y}`) || !floor(k, map, x, y)) continue;
    if (FACING_DX.some((dx, f) => { const nx = x + dx, ny = y + FACING_DY[f]; return nx >= 0 && ny >= 0 && nx < w && ny < h && !k.seen(map, nx, ny); })) out.push({ x, y });
  }
  return out;
}

/**
 * A suspect is a wall with seen floor on both sides of it, or a dead end's end wall with an unseen
 * square of the map past it. A visible secret door counts as a wall, as Known draws it. Each is listed
 * once for each side, facing it from the floor there.
 */
export function suspects(k: Known, map: string): { x: number; y: number; facing: Facing }[] {
  const { w, h } = k.size(map), out: { x: number; y: number; facing: Facing }[] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (k.cell(map, x, y)?.solid !== 'wall') continue;
    for (const f of [NORTH, EAST, SOUTH, WEST]) {
      const bx = x - FACING_DX[f], by = y - FACING_DY[f], px = x + FACING_DX[f], py = y + FACING_DY[f];
      if (!floor(k, map, bx, by)) continue;
      // A dead end: the one way on from the square before the wall is the way back.
      const end = px >= 0 && py >= 0 && px < w && py < h && !k.seen(map, px, py)
        && FACING_DX.every((dx, g) => floor(k, map, bx + dx, by + FACING_DY[g]) === (g === turnBack(f)));
      if (end || floor(k, map, px, py)) out.push({ x, y, facing: f });
    }
  }
  return out;
}

/** A name to say in a line: a zone's "The" made "the" within it. */
const within = (s: string): string => s.replace(/^The /, 'the ');
/** A name to begin a line with. */
const upper = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * What it explores, by the id Known reads it by, and its name: on the outdoors a zone, the one the
 * strategist prefers if it lies there, else the one the party stands in, and whether that is beyond
 * the company's strength and not preferred; anywhere else the map.
 */
function ground(g: Game, p: Pilot): { id: string; name: string; beyond: boolean } {
  const w = g.world, here = w.state.mapId;
  const z = w.map.zones.find((q) => q.id === p.prefer) ?? w.zone;
  if (!z) return { id: here, name: w.map.name, beyond: false };
  return { id: z.id, name: z.name, beyond: z.id !== p.prefer && !!z.band && z.band[0] > companyLevel(g.party) + 1 };
}

/** Bound for `goal`: the navigator's first key there, or null when it has no way, the goal given up. */
function go(g: Game, k: Known, p: Pilot, goal: Goal): Action | null {
  p.goal = goal;
  return route(g, k, p);
}

/** The brain: a goal where the navigator has none, and the keys to search a wall it stands before. */
export const explore: Brain = (g, k, p) => {
  if (p.goal || !(g.top instanceof ExploreScreen)) return null;
  const st = g.world.state, flags = Object.keys(g.party.flags).length, keys = k.can().keys;
  for (const s of p.shut) s.flags ??= flags;
  // A way shut that the company can open now, tried again and no longer shut.
  for (const s of p.shut.filter((q) => q.map === st.mapId && (q.why === BLOCK_TEXT.locked ? keys > 0 : flags > (q.flags ?? flags)))) {
    p.shut.splice(p.shut.indexOf(s), 1);
    const key = go(g, k, p, { map: s.map, x: s.x, y: s.y, name: s.why === BLOCK_TEXT.locked ? 'the locked door' : 'the closed way' });
    if (key) return key;
  }
  const { id, name, beyond } = ground(g, p);
  if (beyond) { p.why = [`${upper(within(name))} is beyond us yet.`]; return null; }
  const at = g.world.locate(id, 0, 0), shut = p.shut.filter((s) => s.map === st.mapId);
  // The nearest square with one unseen beside it.
  const edge = frontier(k, g, id).map((q) => ({ x: q.x + at.x, y: q.y + at.y }));
  const near = nearestOn(k, st.mapId, st.x, st.y, st.facing, edge, shut);
  const key = near && go(g, k, p, { map: st.mapId, x: near.x, y: near.y, name: 'the edge of the map', why: `Looking about ${within(name)}.` });
  if (key) return key;
  // The walls not yet searched from where they are faced, from a square it may stand on.
  const barred = new Set([...stops(k, st.mapId), ...shut].map((q) => `${q.x},${q.y}`));
  const walls = suspects(k, id).map((s) => ({ ...s, x: s.x + at.x, y: s.y + at.y, bx: s.x + at.x - FACING_DX[s.facing], by: s.y + at.y - FACING_DY[s.facing] }))
    .filter((s) => !p.searched.has(`${st.mapId}:${s.x},${s.y},${s.facing}`) && !barred.has(`${s.bx},${s.by}`));
  const before = walls.filter((s) => s.bx === st.x && s.by === st.y), wall = before.find((s) => s.facing === st.facing) ?? before[0];
  if (wall) {
    p.why = [SEARCHING];
    if (wall.facing !== st.facing) return wall.facing === turnRight(st.facing) ? 'turnRight' : 'turnLeft';
    p.searched.add(`${st.mapId}:${wall.x},${wall.y},${wall.facing}`);
    return 'search';
  }
  const next = nearestOn(k, st.mapId, st.x, st.y, st.facing, walls.map((s) => ({ x: s.bx, y: s.by })), shut);
  const step = next && go(g, k, p, { map: st.mapId, x: next.x, y: next.y, name: 'the wall', why: SEARCHING });
  if (step) return step;
  // With what is left out of reach, it goes at the nearest group in sight on a square it may stand on,
  // which the route goes round: the step beside it starts the fight, the bot's. One that does not
  // fight as it is stood before, fled from or stood aside, it steps over.
  if (edge.length || walls.length) {
    const foes = k.groups(id).map((q) => ({ x: q.x + at.x, y: q.y + at.y })).filter((q) => floor(k, st.mapId, q.x, q.y) && !barred.has(`${q.x},${q.y}`));
    if (foes.some((q) => q.x === st.x + FACING_DX[st.facing] && q.y === st.y + FACING_DY[st.facing])) { p.why = [CLEARING]; return 'forward'; }
    const by = nearestOn(k, st.mapId, st.x, st.y, st.facing, foes.flatMap((q) => FACING_DX.map((dx, f) => ({ x: q.x + dx, y: q.y + FACING_DY[f] }))), shut);
    const on = by && go(g, k, p, { map: st.mapId, x: by.x, y: by.y, name: 'the group', why: CLEARING });
    if (on) return on;
  }
  p.why = [`${upper(within(name))} is walked out.`];
  return null;
};
