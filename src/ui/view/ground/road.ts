// The road's look (#1030): cobbles packed in a jittered grid out to the third square, each lit along its
// top, and puddles after rain. Its variants (#1101): the cobbles by a town, within `TOWN_STEPS` of a way
// in set in a building or a wall (a town's door or gate, or a hold's) and on a town's own map, and in the
// country a track, two ruts worn into the earth along the road with grass down its middle.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { FACING_DX, FACING_DY } from '../../../game/types.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unit, unitIn, floorPt, quad, grassColor } from '../common.ts';
import type { GameMap } from '../../../game/map.ts';
import type { Facing } from '../../../game/types.ts';
import type { Paint } from '../common.ts';
import type { GroundLook, Plot, Square } from './look.ts';

/** Cobbles: rounded stones packed in a jittered grid, each with a lit top edge. */
function cobbles(p: Paint, base: string, sq: Square): void {
  const { ctx, cx, horizon, h } = p, { d, l, seed } = sq;
  if (d > 3) return;
  const u = unit(d, h);
  const cols = d <= 1 ? 6 : 4, rows = d <= 1 ? 5 : 3;
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    const s = (i + 0.5 + (hash(seed, 31, i, j) - 0.5) * 0.4) / rows, t = (j + 0.5 + (hash(seed, 32, i, j) - 0.5) * 0.4) / cols;
    const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    const sc = unitIn(d, s, h) / u;
    const rx = (u / cols) * 0.8 * sc * 0.9, ry = rx * 0.45;
    const col = fog(p, shade(base, 0.85 + hash(seed, 33, i, j) * 0.35), d);
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    if (rx > 3) { ctx.beginPath(); ctx.ellipse(x, y - ry * 0.35, rx * 0.7, ry * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, 1.2), d); ctx.fill(); }
    ctx.strokeStyle = fog(p, shade(base, 0.55), d); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
  }
}

/** How many steps from a way in set in a building or a wall the road is still cobbled. */
export const TOWN_STEPS = 12;
const doors = new WeakMap<GameMap, readonly { x: number; y: number }[]>();
/** A map's ways in set in a building or a wall: a town's door or gate, or a hold's. Found once a map, from its exits. */
function doorsOf(map: GameMap): readonly { x: number; y: number }[] {
  let found = doors.get(map);
  if (!found) {
    const built = (x: number, y: number): boolean => map.inBounds(x, y) && (map.at(x, y).solid === 'building' || map.at(x, y).solid === 'wall');
    doors.set(map, found = map.exits.filter((e) => built(e.x - 1, e.y) || built(e.x + 1, e.y) || built(e.x, e.y - 1) || built(e.x, e.y + 1)));
  }
  return found;
}

/** The road's plot, seen facing `f`: its verge on each side, near, far, left and right, where the road does not go on. */
function roadPlot(map: GameMap, x: number, y: number, f: Facing): Plot {
  const rf = ((f + 1) & 3) as Facing, fx = FACING_DX[f], fy = FACING_DY[f], rx = FACING_DX[rf], ry = FACING_DY[rf];
  const off = (dx: number, dy: number): boolean => { if (!map.inBounds(x + dx, y + dy)) return true; const c = map.at(x + dx, y + dy); return (c.look ?? c).terrain !== 'road'; };
  const hedge = [off(-fx, -fy), off(fx, fy), off(-rx, -ry), off(rx, ry)] as const;
  return { crop: 0, away: !hedge[0] || !hedge[1] || (hedge[2] && hedge[3]), hedge };
}

/**
 * The track: from the middle of the square out to each side the road goes on to, two ruts and the grass
 * between them, running through the middle so that a bend or a fork joins up; a lone square runs as its
 * plot does. Out to the third square; a deep snow leaves the ruts and buries the grass.
 */
function track(p: Paint, base: string, sq: Square): void {
  const { ctx, cx, horizon, h, env } = p, { d, l, plot } = sq;
  if (d > 3) return;
  const P = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t);
  const verge = plot?.hedge ?? [false, false, true, true], sides = [0, 1, 2, 3].filter((k) => !verge[k]);
  const on = sides.length ? sides : (plot?.away ?? true) ? [0, 1] : [2, 3];
  const rut = fog(p, shade(base, 0.68), d), grass = fog(p, mix(base, grassColor(env.day), 0.6 * (1 - env.cover)), d);
  for (const [a, b, col] of [[0.43, 0.57, grass], [0.24, 0.34, rut], [0.66, 0.76, rut]] as const) for (const k of on) {
    // An arm along the square to its side, from just past the middle: near and far run down it, left and right across.
    const [from, to] = k % 2 ? [0.24, 1] : [0, 0.76];
    if (k < 2) quad(ctx, P(from, a), P(from, b), P(to, b), P(to, a), col);
    else quad(ctx, P(a, from), P(b, from), P(b, to), P(a, to), col);
  }
}

export const road: GroundLook = { color: () => TERRAIN_COLORS.road, snow: 0.72, wets: true, splashes: true, ripples: false, vary: 0.08, lays: cobbles, puddles: true, plot: roadPlot,
  variants: { pick: (map, x, y) => (map.kind === 'town' || doorsOf(map).some((e) => Math.abs(e.x - x) + Math.abs(e.y - y) <= TOWN_STEPS) ? 0 : 1), looks: [
    { name: 'cobbles' },
    { name: 'track', shift: { toward: '#86704c', by: 1 }, lays: track },
  ] } };
