// The explorer (#718; docs/PILOT.md): where the navigator has no seen way, it makes one. It walks to
// the nearest square with an unseen square beside it, searches the walls the seen map suggests a
// secret behind, and comes back to a way found shut once the company may open it. It reads the world
// through Known alone: a secret door is a wall to it until a search finds it, and a gate is learnt by
// trying it, never by its terms. Outdoors it keeps to one zone's box, as the world map draws the boxes.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import { passableCell } from '../map.ts';
import { companyLevel, partyCan } from '../party.ts';
import { NORTH, EAST, SOUTH, WEST, FACING_DX, FACING_DY, turnRight } from '../types.ts';
import type { Facing } from '../types.ts';
import type { Known } from './known.ts';
import type { Brain, Pilot } from './pilot.ts';
import { route, routeLengths } from './route.ts';
import type { Goal } from './route.ts';

interface Square { x: number; y: number }
/** A wall to search, and the facing from the square before it that faces it. */
export interface Suspect { x: number; y: number; facing: Facing }

const SIDES: readonly Facing[] = [NORTH, EAST, SOUTH, WEST];
const at = (q: Square): string => `${q.x},${q.y}`;
const inside = (b: { x: number; y: number; w: number; h: number }, x: number, y: number): boolean => x >= b.x && y >= b.y && x < b.x + b.w && y < b.y + b.h;
/** Whether the company can step onto a cell as Known inks it (`passableCell` for `partyCan`): water with a swimmer, a mountain with a mountaineer, a locked door with a key, a chasm never. */
const stands = (k: Known, map: string, x: number, y: number): boolean => {
  const c = k.cell(map, x, y), pass = c && passableCell(c, partyCan(k.party));
  return pass === 'ok' || pass === 'unlock';
};

/**
 * Seen, passable squares with an unseen 4-neighbour, on `map`: squares Known has a cell for that the
 * company can step onto, with a square of the map beside them that the party has not seen. Not an
 * exit's, a rift's or a business's door, where a step takes the party away or puts it back, so that
 * standing there never shows what lies beyond. On the outdoors the unseen square lies in a zone's box,
 * as the world map draws it: `map`'s for a zone's id, the party's for the outdoors' own; the square
 * itself may stand just outside the box, as the way in. In the reckoning Known's readers take.
 */
export function frontier(k: Known, g: Game, map: string): Square[] {
  const id = g.world.locate(map, 0, 0).mapId, zone = id === map && g.world.state.mapId === id ? g.world.zone : undefined;
  const whole = k.box(id), area = k.box(zone?.id ?? map);
  if (!whole || !area) return [];
  const away = new Set([...k.exits(id), ...k.features(id).filter((f) => f.kind === 'rift' || ('interior' in f && !!f.interior))].map(at));
  const out: Square[] = [];
  for (let y = Math.max(whole.y, area.y - 1); y < Math.min(whole.y + whole.h, area.y + area.h + 1); y++) {
    for (let x = Math.max(whole.x, area.x - 1); x < Math.min(whole.x + whole.w, area.x + area.w + 1); x++) {
      if (away.has(`${x},${y}`) || !stands(k, id, x, y)) continue;
      if (SIDES.some((f) => inside(area, x + FACING_DX[f], y + FACING_DY[f]) && !k.seen(id, x + FACING_DX[f], y + FACING_DY[f]))) out.push({ x, y });
    }
  }
  return out;
}

/**
 * A suspect is a wall with seen floor on both sides of it. A visible secret door counts as a wall, as
 * Known draws it: a cell Known inks a wall, in `map`'s box, between two seen squares the company can
 * step onto, across it east and west or north and south. Each side is one suspect: the wall's square
 * and the facing from that side's square toward it.
 */
export function suspects(k: Known, map: string): Suspect[] {
  const b = k.box(map), out: Suspect[] = [];
  if (!b) return out;
  for (let y = b.y; y < b.y + b.h; y++) {
    for (let x = b.x; x < b.x + b.w; x++) {
      if (k.cell(map, x, y)?.solid !== 'wall') continue;
      for (const f of SIDES) if (stands(k, map, x - FACING_DX[f], y - FACING_DY[f]) && stands(k, map, x + FACING_DX[f], y + FACING_DY[f])) out.push({ x, y, facing: f });
    }
  }
  return out;
}

/** The flags the company had set when the explorer first saw a way found shut: it is tried again once there are more. */
const flagsAt = new WeakMap<object, number>();

/**
 * The brain, with the map on top and no goal walked: (1) a way found shut that the company may open
 * now, a locked door with a key in hand or any other once a flag has been set since; (2) the nearest
 * square of the frontier, on `Pilot.prefer` if the party is on it, else here, outdoors the party's
 * zone; (3) the frontier spent, the nearest wall to search not yet searched from that side; (4) a zone
 * whose band, as Known gives it, starts above the company's level and one is never gone into unless
 * it is `prefer` (#720's to say); (5) nothing left, it says so and gives no key: "<name> is walked
 * out.", or of a zone preferred with nothing of it seen, "No way to <name> that I have seen.". A goal
 * is the navigator's to walk (`route`), and its first key is pressed at once.
 */
export const explore: Brain = (g, k, p) => {
  if (!(g.top instanceof ExploreScreen)) return null;
  const st = g.world.state, here = st.mapId, zone = g.world.zone?.id;
  const flags = Object.keys(k.party.flags).length, shut = p.shut.filter((s) => s.map === here);
  for (const s of p.shut) if (!flagsAt.has(s)) flagsAt.set(s, flags);
  const pref = p.prefer && g.world.locate(p.prefer, 0, 0).mapId === here ? p.prefer : null;
  const area = pref ?? zone ?? here, name = nameOf(g, area), level = companyLevel(k.party) + 1;
  // Within a line the world map's "The Foreland" is "the Foreland".
  const within = name.replace(/^The /, 'the ');
  // A zone's box as the world map draws it (`zoneAt`), and its band as Known gives it.
  const hard = (z: string | undefined): boolean => { const b = z && z !== pref ? k.band(z) : undefined; return !!b && b[0] > level; };
  const fits = (q: Square): boolean => !hard(g.maps[here]?.zoneAt(q.x, q.y)?.id);
  if (area === zone && hard(zone)) { p.why = [`${name} is too hard for us yet.`]; return null; }

  // 1. A way found shut, now to be opened: retried from the nearest, its square no longer gone round.
  const keys = partyCan(k.party).keys, locked = (s: Square): boolean => k.cell(here, s.x, s.y)?.door === 'locked';
  const open = shut.filter((s) => fits(s) && (locked(s) ? keys > 0 : flags > flagsAt.get(s)!));
  const way = open.length ? nearest(open, routeLengths(k, here, st.x, st.y, st.facing, shut.filter((s) => !open.includes(s)))) : undefined;
  if (way) {
    p.shut.splice(p.shut.indexOf(way), 1);
    return walk(g, k, p, locked(way) ? { map: here, x: way.x, y: way.y, name: 'the locked door' } : { map: here, x: way.x, y: way.y, name: 'the way', why: 'Trying a shut way again.' });
  }

  // 2. The frontier, by the length of the route to it.
  const lengths = routeLengths(k, here, st.x, st.y, st.facing, shut);
  const next = nearest(frontier(k, g, area).filter(fits), lengths);
  if (next) return walk(g, k, p, { map: here, x: next.x, y: next.y, name: 'the unseen', why: `Looking about ${within}.` });

  // 3. The walls: from the square before one, faced, a search; else that square as the goal.
  const before = (s: Suspect): Square => ({ x: s.x - FACING_DX[s.facing], y: s.y - FACING_DY[s.facing] });
  const key = (s: Suspect): string => `${here}:${s.x},${s.y},${s.facing}`;
  const walls = suspects(k, area).filter((s) => !p.searched.has(key(s)) && fits(before(s)));
  const by = walls.filter((s) => before(s).x === st.x && before(s).y === st.y);
  if (by.length) {
    p.why = ['Searching the wall.'];
    const faced = by.find((s) => s.facing === st.facing);
    if (!faced) return by.some((s) => s.facing === turnRight(st.facing)) ? 'turnRight' : 'turnLeft';
    p.searched.add(key(faced));
    return 'search';
  }
  const wall = nearest(walls, lengths, before);
  if (wall) return walk(g, k, p, { map: here, ...before(wall), name: 'the wall', why: 'Searching the wall.' });

  // 5. Nothing left to look at; or, of a zone preferred, nothing seen to start from (#720's to bring the party nearer).
  p.why = [seenIn(k, area) ? `${name} is walked out.` : `No way to ${within} that I have seen.`];
  return null;
};

/** Whether the party has seen any square of a map's or a zone's box. */
function seenIn(k: Known, map: string): boolean {
  const b = k.box(map);
  for (let y = b?.y ?? 0; b && y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) if (k.seen(map, x, y)) return true;
  return false;
}

/** Sets the goal and asks the navigator for its first key. */
function walk(g: Game, k: Known, p: Pilot, goal: Goal): Action | null {
  p.goal = goal;
  return route(g, k, p);
}

/** The first of `xs` whose square the route reaches in the fewest keys (`routeLengths`), or undefined where it reaches none. */
function nearest<T>(xs: readonly T[], lengths: ReadonlyMap<string, number>, square: (t: T) => Square = (t) => t as Square): T | undefined {
  let best: T | undefined, fewest = Infinity;
  for (const t of xs) {
    const n = lengths.get(at(square(t)));
    if (n !== undefined && n < fewest) { best = t; fewest = n; }
  }
  return best;
}

/** What the map's sign or the world map calls a map or a zone. */
function nameOf(g: Game, id: string): string {
  return g.maps[id]?.name ?? g.maps[g.world.locate(id, 0, 0).mapId]?.zones.find((z) => z.id === id)?.name ?? id;
}
