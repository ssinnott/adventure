// Where two grounds meet (#1100): a ranked look (`GroundLook.rank`) spills into a lower one beside it, a
// ragged tongue of its colour and marks (and in the nearest rows its detail, #1102) some fifth of the way into the lower square, so the heather runs
// into the grass and the snow lies in drifts. A tongue's outline is its edge's: hashed from the edge and
// the corners at its ends, never from a square or the eye, so an edge looks the same from both of its
// squares and from every facing. At a corner the tongue runs on into the next edge's where the higher
// ground goes on beyond it, and dies away where it does not. Only open ground of a ranked look takes or
// gives one: a drop, water, the road, a field, a hill, a dungeon's floor and a square something stands on
// have no rank or no open ground.

import type { GameMap } from '../../../game/map.ts';
import type { Terrain } from '../../../game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { hash, hashStr } from '../../paint/brush.ts';
import { drawnAt } from '../model.ts';
import { fog, floorPt, unit, unitIn } from '../common.ts';
import type { Paint } from '../common.ts';
import { GROUND, asDrawn, groundColor, variantAt } from './index.ts';
import type { Square } from './look.ts';
import type { Pixels } from './near.ts';

/** How many stretches a tongue's outline runs in along its edge. */
const STEPS = 16;
/** How far into the square a tongue reaches: at a corner it runs on through, and between, some fifth of the way at most. */
const CORNER = [0.12, 0.18], MIDDLE = [0.1, 0.26];
/** How much each point of the outline is moved in or out by its own hash, so the outline is ragged and not smooth. */
const RAG = 0.035;
/** What share of the higher ground's marks a square of it has lie on a tongue of it. */
const MARKS = 0.3;

type At = { x: number; y: number };
/**
 * A tongue across one edge: the cell it runs from (the higher ground) and its terrain, the cell it runs
 * into, how far into that square it reaches at each of STEPS + 1 points along the edge (west to east or
 * north to south, as the map runs) and the seed its marks are placed by.
 */
export interface Tongue { from: At; into: At; terrain: Terrain; reach: readonly number[]; seed: number }
/** The tongues a square takes, lowest ground first so the highest lies over the rest, and the facing they are seen from. */
export interface Edges { f: Facing; tongues: readonly Tongue[] }

/** A cell's terrain as the floors draw it, where it is open ground of a ranked look; else null. */
function ranked(map: GameMap, x: number, y: number): Terrain | null {
  const c = drawnAt(map, x, y);
  return c.solid === 'none' && c.door === 'none' && GROUND[c.terrain].rank ? c.terrain : null;
}
const rankOf = (t: Terrain | null): number => (t ? GROUND[t].rank ?? 0 : 0);

/**
 * The tongue across the edge between two cells side by side, named either way round, or null where
 * neither spills into the other: a function of the map about the edge alone.
 */
export function tongue(map: GameMap, ax: number, ay: number, bx: number, by: number): Tongue | null {
  if (map.kind === 'dungeon') return null;
  const ta = ranked(map, ax, ay), tb = ranked(map, bx, by);
  if (!ta || !tb || rankOf(ta) === rankOf(tb)) return null;
  const [from, into, terrain] = rankOf(ta) > rankOf(tb) ? [{ x: ax, y: ay }, { x: bx, y: by }, ta] : [{ x: bx, y: by }, { x: ax, y: ay }, tb];
  // The edge on the lattice of doubled cells (a cell's middle at odd x and y, a corner at even): it runs
  // north to south between two cells of a row, west to east between two of a column.
  const ns = from.y === into.y, ex = ns ? 2 * Math.max(from.x, into.x) : 2 * into.x + 1, ey = ns ? 2 * into.y + 1 : 2 * Math.max(from.y, into.y);
  const salt = Math.floor(hashStr(map.id) * 0x7fffffff);
  // At each end, the next edge along: the tongue runs on through the corner where the square beyond this
  // one is of the higher ground, or takes a tongue of it from beside it; else it dies away there.
  const ends = [-1, 1].map((k) => {
    const sx = ns ? 0 : k, sy = ns ? k : 0, beyond = ranked(map, into.x + sx, into.y + sy), beside = ranked(map, from.x + sx, from.y + sy);
    const on = beyond === terrain || (beside === terrain && rankOf(beyond) > 0 && rankOf(beyond) < rankOf(terrain));
    return on ? CORNER[0] + CORNER[1] * hash(salt, ns ? ex : ex + k, ns ? ey + k : ey, 3) : 0;
  });
  // Between them, three points hashed from the edge, eased from one to the next, each step ragged by its own hash.
  const keys = [ends[0], ...[1, 2, 3].map((k) => MIDDLE[0] + MIDDLE[1] * hash(salt, ex, ey, k)), ends[1]];
  if (!ends[0]) keys[1] *= 0.6;
  if (!ends[1]) keys[3] *= 0.6;
  const reach = Array.from({ length: STEPS + 1 }, (_, i) => {
    if (i === 0 || i === STEPS) return keys[i ? 4 : 0];
    const a = (i / STEPS) * 4, j = Math.floor(a), e = (1 - Math.cos((a - j) * Math.PI)) / 2;
    return Math.max(0.02, keys[j] + (keys[j + 1] - keys[j]) * e + RAG * (hash(salt, ex, ey, 10 + i) - 0.5));
  });
  return { from, into, terrain, reach, seed: Math.floor(hash(salt, ex, ey, 99) * 0x7fffffff) };
}

/** The tongues the square at x, y takes, seen facing f, or none. */
export function edgesOf(map: GameMap, x: number, y: number, f: Facing): Edges | undefined {
  const own = rankOf(ranked(map, x, y));
  if (!own) return undefined;
  const tongues: Tongue[] = [];
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    if (rankOf(ranked(map, x + dx, y + dy)) <= own) continue;
    const t = tongue(map, x, y, x + dx, y + dy);
    if (t) tongues.push(t);
  }
  return tongues.length ? { f, tongues: tongues.sort((a, b) => rankOf(a.terrain) - rankOf(b.terrain)) } : undefined;
}

/** How far a tongue reaches at a point `a` of the way along its edge. */
function reachAt(t: Tongue, a: number): number {
  const i = Math.min(STEPS - 1, Math.floor(a * STEPS)), w = a * STEPS - i;
  return t.reach[i] + (t.reach[i + 1] - t.reach[i]) * w;
}

/**
 * Which of a square's tongues lies over a point of it, `s` deep and `t` across as seen facing `edges.f`: the
 * highest there, as they are painted, or -1. A function of the edges alone, as the outline is (#1102: a piece of
 * the square's detail rooted there is the tongue's).
 */
export function under(edges: Edges, s: number, t: number): number {
  const f = edges.f, rf = ((f + 1) & 3) as Facing, fx = FACING_DX[f], fy = FACING_DY[f], rx = FACING_DX[rf], ry = FACING_DY[rf];
  // The point u east and v south of the square's north-west corner: `drawEdges`'s turned about.
  const u = fx ? (fx > 0 ? s : 1 - s) : rx > 0 ? t : 1 - t, v = fy ? (fy > 0 ? s : 1 - s) : ry > 0 ? t : 1 - t;
  let top = -1;
  edges.tongues.forEach((tg, k) => {
    const dx = tg.from.x - tg.into.x, dy = tg.from.y - tg.into.y, [a, r] = dx ? [v, dx > 0 ? 1 - u : u] : [u, dy > 0 ? 1 - v : v];
    if (a >= 0 && a <= 1 && r < reachAt(tg, a)) top = k;
  });
  return top;
}

/**
 * The tongues on a square, over its tiles, its marks and what of its detail lies flat: each in its ground's
 * colour at the cell it runs from, as the floors draw that cell, and a share of that ground's marks on it,
 * placed by the edge. In the nearest rows that ground's detail too (#1102), on a lattice laid along the edge and
 * rooted only under the tongue: what lies flat kept to the tongue, what stands up filled once every tongue is down.
 */
export function drawEdges(p: Paint, sq: Square, edges: Edges, floorPal: string): void {
  const { ctx, cx, horizon, h } = p, { d, l } = sq, f = edges.f, rf = ((f + 1) & 3) as Facing;
  const fx = FACING_DX[f], fy = FACING_DY[f], rx = FACING_DX[rf], ry = FACING_DY[rf];
  // A point of the square, u east and v south of its north-west corner, as the view's depth and across.
  const st = (u: number, v: number): [number, number] => [fx ? (fx > 0 ? u : 1 - u) : fy > 0 ? v : 1 - v, rx ? (rx > 0 ? u : 1 - u) : ry > 0 ? v : 1 - v];
  const u0 = unit(d, h), standing: Pixels[] = [];
  for (const [k, t] of edges.tongues.entries()) {
    const dx = t.from.x - t.into.x, dy = t.from.y - t.into.y;
    // A point `a` of the way along the edge and `r` in from it.
    const uv = (a: number, r: number): [number, number] => (dx ? [dx > 0 ? 1 - r : r, a] : [a, dy > 0 ? 1 - r : r]);
    const pt = (a: number, r: number): [number, number] => { const [s, tt] = st(...uv(a, r)); return floorPt(cx, horizon, h, d, l, s, tt); };
    const v = variantAt(asDrawn(p, t.terrain), t.from.x, t.from.y, p.map), base = groundColor(p, t.terrain, floorPal, t.from.x, t.from.y, 0, v), last = t.reach.length - 1;
    // Its outline runs a little past the edge, under the next square's tiles, and past each end it runs on through.
    const e0 = t.reach[0] ? 0.01 : 0, e1 = t.reach[last] ? 0.01 : 0;
    ctx.beginPath();
    ctx.moveTo(...pt(-e0, -0.01)); ctx.lineTo(...pt(1 + e1, -0.01)); ctx.lineTo(...pt(1 + e1, t.reach[last]));
    for (let i = last; i >= 0; i--) ctx.lineTo(...pt(i / last, t.reach[i]));
    ctx.lineTo(...pt(-e0, t.reach[0])); ctx.closePath();
    ctx.fillStyle = fog(p, base, d); ctx.fill();
    // In the nearest rows, the higher ground's detail (#1102): seeded and laid along the edge, rooted under this tongue alone.
    const near = d <= 1 ? v?.near ?? GROUND[t.terrain].near : undefined;
    if (near) {
      const span = Math.max(...t.reach), px = near(p, base, { ...sq, seed: t.seed, foot: { keep: (s, tt) => under(edges, s, tt) === k, lattice: { span, at: (x, y) => st(...uv(y, x * span)) } } });
      ctx.save(); ctx.clip(); px.flat.fill(p); ctx.restore();
      standing.push(px);
    }
    const lies = v?.lies ?? GROUND[t.terrain].lies;
    if (!lies) continue;
    for (let i = 0; i < Math.round(lies.marks * MARKS); i++) {
      const a = 0.1 + 0.8 * hash(t.seed, 7, i), [s, tt] = st(...uv(a, reachAt(t, a) * (0.3 + 0.5 * hash(t.seed, 9, i))));
      const [x, y] = floorPt(cx, horizon, h, d, l, s, tt);
      lies.mark(p, { ...sq, seed: t.seed, i, s, t: tt, x, y, sc: unitIn(d, s, h) / u0, base });
    }
  }
  for (const px of standing) px.up.fill(p);
}
