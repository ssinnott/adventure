// Sight (#1008, cut from game/world.ts): how far the party sees and what it sees. The view's reach
// and its rule (`VIEW_DEPTH`, `viewCell`, `lineOfSight`), which the viewport draws by and the
// sweep reads; what a hill hides from lower ground (`hillOver`, `hillHiding`, #53); the bits in
// which a map keeps what has been seen; and the members that look: how far the party sees by the
// hour, a light and the weather (`sight`), what it maps as it goes (`reveal`) and whether it sees
// a square (`sees`).
//
// Functions of the world, each called by World's member of the same name; World is a type here
// alone, so nothing here loads game/world.ts. It reads the sky through the world (`world.weather`).
import type { GameMap } from '../map.ts';
import type { Cell } from '../mapdef.ts';
import type { Facing } from '../types.ts';
import { FACING_DX, FACING_DY } from '../types.ts';
import { weatherSight } from '../weather.ts';
import { skilled } from '../skills.ts';
import type { World } from '../world.ts';

/** Whether cell `i` is set in a map's explored bits. */
export const seen = (bits: readonly number[], i: number): boolean => (((bits[i >> 5] ?? 0) >>> (i & 31)) & 1) === 1;
const see = (bits: number[], i: number): void => { bits[i >> 5] = (bits[i >> 5] ?? 0) | (1 << (i & 31)); };
export const bitsFor = (cells: number): number[] => new Array(Math.ceil(cells / 32)).fill(0);

/** How deep and how wide the first-person view reaches: what the viewport draws, and what is seen. */
export const VIEW_DEPTH = 4, VIEW_LATERAL = 3;

/** Map coordinates of the cell at depth d, lateral l relative to the party. */
export function viewCell(px: number, py: number, f: Facing, d: number, l: number): { x: number; y: number } {
  const rf = ((f + 1) & 3) as Facing;
  return { x: px + FACING_DX[f] * d + FACING_DX[rf] * l, y: py + FACING_DY[f] * d + FACING_DY[rf] * l };
}

/** What is drawn as faces rather than as a floor and a sprite: walls, buildings, doors, and the void. */
export function isSolidWall(c: Cell): boolean { return c.solid === 'wall' || c.solid === 'building' || c.solid === 'void' || c.door !== 'none'; }

/**
 * Whether the cell at (d, l) can be seen from the eye: walk the straight line and stop at walls, and
 * at a hill that stands over the eye (`hillOver`).
 */
export function lineOfSight(map: GameMap, px: number, py: number, f: Facing, d: number, l: number): boolean {
  const steps = Math.max(d, Math.abs(l)) * 2;
  let lastD = 0, lastL = 0;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const dd = Math.round(d * t), ll = Math.round(l * t);
    if (dd === lastD && ll === lastL) continue;
    if (dd === d && ll === l) break;
    lastD = dd; lastL = ll;
    const c = viewCell(px, py, f, dd, ll);
    if (map.blocksView(c.x, c.y)) return false;
  }
  return !hillOver(map, px, py, f, d, l);
}

/**
 * The hill that hides the cell at (d, l) from the eye, the nearest, or undefined (#53): a square
 * that stops the view from the eye's ground and from no higher (`GameMap.blocksView`), where the line
 * crosses the middle of a row between. Where the line runs on the seam of two squares, it takes both
 * to hide it. Read row by row, as a hill is drawn over the ground behind it and not in its corners.
 * What stands taller than a hill is seen over one (`GameMap.overtops`).
 */
export function hillOver(map: GameMap, px: number, py: number, f: Facing, d: number, l: number): { x: number; y: number } | undefined {
  if (d < 2) return undefined;
  const t = viewCell(px, py, f, d, l), eye = { x: px, y: py };
  if (map.overtops(t.x, t.y)) return undefined;
  const hill = (k: number, ll: number): { x: number; y: number } | undefined => {
    const c = viewCell(px, py, f, k, ll);
    return map.blocksView(c.x, c.y, eye) && !map.blocksView(c.x, c.y) ? c : undefined;
  };
  for (let k = 1; k < d; k++) {
    const at = (l * k) / d, lo = Math.floor(at);
    const h = at - lo === 0.5 ? (hill(k, lo + 1) ? hill(k, lo) : undefined) : hill(k, Math.round(at));
    if (h) return h;
  }
  return undefined;
}

/**
 * `hillOver` for a square of the map: read in the way the eye looks where the square lies ahead,
 * as the viewport draws it, else in the way the square lies from the eye.
 */
export function hillHiding(map: GameMap, px: number, py: number, f: Facing, x: number, y: number): { x: number; y: number } | undefined {
  const dx = x - px, dy = y - py;
  let g = f, d = dx * FACING_DX[g] + dy * FACING_DY[g];
  if (d < 1) { g = (Math.abs(dy) >= Math.abs(dx) ? (dy < 0 ? 0 : 2) : dx > 0 ? 1 : 3) as Facing; d = dx * FACING_DX[g] + dy * FACING_DY[g]; }
  const rg = ((g + 1) & 3) as Facing;
  return hillOver(map, px, py, g, d, dx * FACING_DX[rg] + dy * FACING_DY[rg]);
}

/** How far the party can see: 4 by day or with light, 2 by night or in a dungeon without it; fog, driving rain and snow close in on that. */
export function sight(world: World): number {
  const s = world.state.light > 0 ? 4 : world.map.kind === 'dungeon' || world.isDark ? 2 : 4;
  return world.underSky ? Math.min(s, weatherSight(world.weather)) : s;
}

/**
 * Mark cells around the party seen: the four neighbours always, more with sight, but none past what
 * blocks the view (`GameMap.blocksView`), so a company maps nothing behind a wall, a door or a secret
 * door (#889); none a hill hides from the party (`hidden`), so a company below a ridge maps the
 * valley past it once it climbs.
 */
export function reveal(world: World, radius = 1): void {
  const ms = world.mapState, m = world.map, { x: px, y: py } = world.state;
  const base = Math.max(radius, world.map.kind === 'outdoor' && !world.isDark && weatherSight(world.weather) >= 4 ? 2 : 1);
  // A Cartographer standing, or a chart carried, maps a square further: 3 in the open by day, 2 in a
  // dungeon, in the dark or in thick weather (#857).
  const r = base + (skilled(world.tables.items, world.party, 'cartographer') ? 1 : 0);
  // Every square past the first follows sight (#857, #889): it is mapped only where none of the
  // squares between it and the company, taken a step at a time toward the company, blocks the view
  // and no diagonal step on the way slips between two that do, so never past a wall, a door or a
  // secret door, nor round a corner, and the automap tells nothing hidden. One off, a square between
  // two that stop the view is mapped only if it stops the view itself, so the walls still close round
  // the company. A landmark is seen over a wall, as the view draws it (#844); the mountain and the
  // void are not, or the automap would ink a range round a hide and leave the hide a hole.
  const stops = (dx: number, dy: number): boolean => m.blocksView(px + dx, py + dy);
  const cut = (ax: number, ay: number, bx: number, by: number): boolean => ax !== bx && ay !== by && stops(ax, by) && stops(bx, ay);
  const clear = (dx: number, dy: number): boolean => {
    if (Math.max(Math.abs(dx), Math.abs(dy)) === 1) return stops(dx, dy) || !cut(dx, dy, 0, 0);
    for (let d = Math.max(Math.abs(dx), Math.abs(dy)); d > 1; d--) {
      const ax = dx, ay = dy;
      dx -= Math.abs(dx) === d ? Math.sign(dx) : 0; dy -= Math.abs(dy) === d ? Math.sign(dy) : 0;
      if (stops(dx, dy) || cut(ax, ay, dx, dy) || (d === 2 && cut(dx, dy, 0, 0))) return false;
    }
    return true;
  };
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const x = px + dx, y = py + dy;
    if (!m.inBounds(x, y) || world.hidden(x, y) || (!m.landmarkAt(x, y) && !clear(dx, dy))) continue;
    see(ms.explored, y * m.width + x);
  }
  // And the corridor ahead, as far as the eye sees, so the automap matches the viewport: a square
  // beside it as one off the company, between two that stop the view toward the eye only if it does.
  const f = world.state.facing;
  for (let d = 1; d <= world.sight; d++) {
    const x = world.state.x + FACING_DX[f] * d, y = world.state.y + FACING_DY[f] * d;
    if (!m.inBounds(x, y)) break;
    for (let s = -1; s <= 1; s++) {
      const sx = x + (f === 0 || f === 2 ? s : 0), sy = y + (f === 1 || f === 3 ? s : 0);
      if (!m.inBounds(sx, sy) || world.hidden(sx, sy)) continue;
      if (s && m.blocksView(x, y) && m.blocksView(sx - FACING_DX[f], sy - FACING_DY[f]) && !m.blocksView(sx, sy)) continue;
      see(ms.explored, sy * m.width + sx);
    }
    if (m.blocksView(x, y)) break;
  }
}

/** Whether a hill hides the square from the party (#53): `hillHiding`, from where it stands and looks. */
export function hidden(world: World, x: number, y: number): boolean {
  return !!hillHiding(world.map, world.state.x, world.state.y, world.state.facing, x, y);
}

export function revealAll(world: World, radius: number): void {
  const ms = world.mapState, m = world.map;
  for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
    const x = world.state.x + dx, y = world.state.y + dy;
    if (m.inBounds(x, y)) see(ms.explored, y * m.width + x);
  }
}

export function explored(world: World, x: number, y: number): boolean { return world.map.inBounds(x, y) && seen(world.mapState.explored, y * world.map.width + x); }

/** Whether the party sees a square: its own, or one the viewport draws, by the same rule. */
export function sees(world: World, x: number, y: number): boolean {
  const { x: px, y: py, facing: f } = world.state, rf = ((f + 1) & 3) as Facing, m = world.map;
  if (x === px && y === py) return true;
  const d = (x - px) * FACING_DX[f] + (y - py) * FACING_DY[f], l = (x - px) * FACING_DX[rf] + (y - py) * FACING_DY[rf];
  if (d < 1 || d > Math.min(VIEW_DEPTH, world.sight) || Math.abs(l) > VIEW_LATERAL) return false;
  return m.inBounds(x, y) && !isSolidWall(m.at(x, y)) && lineOfSight(m, px, py, f, d, l);
}
