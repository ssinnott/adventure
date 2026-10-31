// What stands scattered on open ground (#1103): where a prop stands, `scatterAt`, a pure function of the map
// and the square that the scene and the suites read alike (no frame, no game generator), and `drawScatter`,
// which stands it on its square in the scene. A ground's look names its props (`GroundLook.scatter`),
// view/model.ts gives their rates (`SCATTER_RATES`) and scenery.ts draws each. A prop is seen past and
// walked through: nothing of sight, the automap or the pilot reads it.

import type { GameMap } from '../../game/map.ts';
import type { Terrain } from '../../game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import type { Facing } from '../../game/types.ts';
import { isSolidWall } from '../../game/world.ts';
import { shade } from '../../lib/art/palettes.ts';
import { drawPropSprite } from '../scenery.ts';
import { hash } from '../paint/brush.ts';
import { fog, floorPt, unitIn } from './common.ts';
import type { Paint } from './common.ts';
import { drawnAt, SCATTER_RATES } from './model.ts';
import type { Prop } from './model.ts';
import { GROUND } from './ground/index.ts';
import { flowering } from './ground/grass.ts';

/** The props that stand only beside water, and the grounds that are water to them. */
const BY_WATER: ReadonlySet<Prop> = new Set<Prop>(['reeds', 'driftwood']);
const WATER: ReadonlySet<Terrain> = new Set<Terrain>(['water', 'deep', 'tidal']);
/** A square's corners, east and south of its middle. */
const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const;

/**
 * A prop standing on a square: what it is, where on the square (`ox` east and `oy` south of its middle,
 * in squares), its size against its kind's and a hash for its shape.
 */
interface Scattered { prop: Prop; ox: number; oy: number; size: number; pick: number }

/**
 * The prop on the square at x,y, or null. Only an outdoor map's open ground stands one, by its look's props
 * at their rates, chosen by a hash of the square; none stands on a door, an exit or a gate, a feature's
 * square or a group's start, and reeds and driftwood only beside water. It stands in a corner of its
 * square whose two sides are open, so from every side it is off the way through and never in front of a
 * wall beside it; with no such corner, none stands. It reads the squares beside its own and no further.
 */
export function scatterAt(map: GameMap, x: number, y: number): Scattered | null {
  if (map.kind !== 'outdoor' || !map.inBounds(x, y)) return null;
  const cell = map.at(x, y), props = GROUND[cell.terrain].scatter;
  if (!props || cell.solid !== 'none' || cell.door !== 'none') return null;
  const roll = hash(x, y, 1103);
  let top = 0;
  const prop = props.find((k) => roll < (top += SCATTER_RATES[k]));
  if (!prop || map.exitAt(x, y) || map.gateAt(x, y) || map.featuresAt(x, y).length || map.encounters.some((e) => e.x === x && e.y === y)) return null;
  if (BY_WATER.has(prop) && ![[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([nx, ny]) => map.inBounds(nx, ny) && WATER.has(map.at(nx, ny).terrain))) return null;
  const open = (nx: number, ny: number): boolean => map.inBounds(nx, ny) && !isSolidWall(drawnAt(map, nx, ny));
  const first = Math.floor(hash(x, y, 1104) * 4);
  for (let i = 0; i < 4; i++) {
    const [sx, sy] = CORNERS[(first + i) % 4];
    if (open(x + sx, y) && open(x, y + sy)) return { prop, ox: sx * (0.28 + 0.1 * hash(x, y, 1105)), oy: sy * (0.28 + 0.1 * hash(x, y, 1106)), size: 1.65 + 0.45 * hash(x, y, 1107), pick: hash(x, y, 1108) };
  }
  return null;
}

/**
 * The prop on the square at x,y, seen d deep and l across by the eye facing f, if one stands there: in its
 * corner, the same spot from every side, coloured as the ground under it is.
 */
export function drawScatter(p: Paint, x: number, y: number, d: number, l: number, f: Facing): void {
  const s = scatterAt(p.map, x, y);
  if (!s) return;
  const { env } = p, rf = ((f + 1) & 3) as Facing, look = GROUND[p.map.at(x, y).terrain];
  // How far along the square and across it its corner is, as the eye faces.
  const along = 0.5 + s.ox * FACING_DX[f] + s.oy * FACING_DY[f], across = 0.5 + s.ox * FACING_DX[rf] + s.oy * FACING_DY[rf];
  const [px, py] = floorPt(p.cx, p.horizon, p.h, d, l, along, across);
  const ink = (c: string): string => fog(p, env.wet > 0 && look.wets ? shade(c, 1 - 0.18 * env.wet) : c, d);
  // Inside save and restore: the caps and joins a prop's strokes set must not reach the nearer rows' marks.
  p.ctx.save();
  drawPropSprite(p.ctx, s.prop, px, py, unitIn(d, along, p.h) * s.size, { ink, ground: look.color(env.day, 0), snow: env.cover * look.snow, bloom: flowering(env.day), pick: s.pick });
  p.ctx.restore();
}
