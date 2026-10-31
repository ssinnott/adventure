// The road's look (#1030): cobbles packed in a jittered grid out to the third square, each lit along its
// top, and puddles after rain. Its variants (#1101): the cobbles by a town, within `TOWN_STEPS` of a way
// in set in a building or a wall (a town's door or gate, or a hold's) and on a town's own map, and in the
// country a track, two ruts worn into the earth along the road with grass down its middle.

import { shade, mix } from '../../../lib/art/palettes.ts';
import { FACING_DX, FACING_DY } from '../../../game/types.ts';
import { TERRAIN_COLORS } from '../../palette.ts';
import { hash } from '../../paint/brush.ts';
import { fog, unit, unitIn, floorPt, grassColor } from '../common.ts';
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
 * The track: two ruts and the grass between them, along the square where the road runs straight, a quarter
 * round its corner where it bends, and from each side it goes on to into the middle where it forks or ends; a
 * lone square runs as its plot does. Out to the third square; a deep snow leaves the ruts and buries the grass.
 */
function track(p: Paint, base: string, sq: Square): void {
  const { ctx, cx, horizon, h, env } = p, { d, l, plot } = sq;
  if (d > 3) return;
  const verge = plot?.hedge ?? [false, false, true, true], sides = [0, 1, 2, 3].filter((k) => !verge[k]);
  const on = sides.length ? sides : (plot?.away ?? true) ? [0, 1] : [2, 3];
  const rut = fog(p, shade(base, 0.68), d), grass = fog(p, mix(base, grassColor(env.day), 0.6 * (1 - env.cover)), d);
  // A band of the square (s deep, t across) filled in one colour.
  const band = (pts: [number, number][], col: string): void => {
    ctx.beginPath();
    pts.forEach(([s, t], i) => { const [x, y] = floorPt(cx, horizon, h, d, l, s, t); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  };
  // Each line of the track: how far across the way it runs, half its width and its colour; the grass first.
  const lines = [[0.5, 0.07, grass], [0.29, 0.05, rut], [0.71, 0.05, rut]] as const;
  if (on.length === 2 && (on[0] < 2) !== (on[1] < 2)) {
    // A bend: each line a quarter round the corner between the two sides, as far from it as it runs across the way.
    const cs = on.includes(0) ? 0 : 1, ct = on.includes(2) ? 0 : 1, ds = cs ? -1 : 1, dt = ct ? -1 : 1;
    const arc = (r: number, back: boolean): [number, number][] => Array.from({ length: 7 }, (_, i) => (back ? 6 - i : i) * Math.PI / 12).map((a) => [cs + ds * r * Math.sin(a), ct + dt * r * Math.cos(a)]);
    for (const [o, w, col] of lines) band([...arc(o + w, false), ...arc(o - w, true)], col);
    return;
  }
  // Straight on, a fork or an end: from each side it goes on to into the middle; near and far run down the square, left and right across.
  for (const [o, w, col] of lines) for (const k of on) {
    const [from, to] = k % 2 ? [0.5, 1] : [0, 0.5];
    band(k < 2 ? [[from, o - w], [from, o + w], [to, o + w], [to, o - w]] : [[o - w, from], [o + w, from], [o + w, to], [o - w, to]], col);
  }
}

export const road: GroundLook = { color: () => TERRAIN_COLORS.road, snow: 0.72, wets: true, splashes: true, ripples: false, vary: 0.08, lays: cobbles, puddles: true, plot: roadPlot,
  variants: { pick: (map, x, y) => (map.kind === 'town' || doorsOf(map).some((e) => Math.abs(e.x - x) + Math.abs(e.y - y) <= TOWN_STEPS) ? 0 : 1), looks: [
    { name: 'cobbles' },
    { name: 'track', shift: { toward: '#86704c', by: 1 }, lays: track },
  ] } };
