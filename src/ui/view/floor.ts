// The floors (#1028): each square's ground in view as its look gives it (view/ground/, #1030): the tiles
// and how they are laid, what the look lays over them and what lies on them, puddles after rain and the
// glitter of lying snow; and a dungeon's ceiling.

import type { Terrain, MapPalette } from '../../game/mapdef.ts';
import { shade, rgba } from '../../lib/art/palettes.ts';
import { hash } from '../paint/brush.ts';
import { unit, fog, LIT, unitIn, floorPt, quad } from './common.ts';
import type { Paint } from './common.ts';
import { GROUND, asDrawn, groundColor } from './ground/index.ts';
import type { Plot, Rims, Square } from './ground/look.ts';
import { drawEdges } from './ground/edges.ts';
import type { Edges } from './ground/edges.ts';

export function drawFloor(p: Paint, laid: Terrain, d: number, l: number, cell: { x: number; y: number }, seed: number, floorPal: string, plot?: Plot, rims?: Rims, edges?: Edges): void {
  const { ctx, cx, horizon, h, haze, env } = p, kind = p.map.kind;
  const terrain = asDrawn(p, laid), ground = GROUND[terrain];
  // One colour a square, its cell's: the tiles vary from it by their hash alone.
  const base = groundColor(p, terrain, floorPal, cell.x, cell.y, plot?.crop);
  const sq: Square = { d, l, mx: cell.x, my: cell.y, seed, plot, rims };
  // A drop is a floor of its own, in its own colour underground too, and nothing lies on it.
  if (ground.drop) { ground.drop(p, sq); return; }
  const n = d <= 2 ? 3 : 2;
  // A ground laid otherwise in a dungeon: the floor's flagstones.
  const look = (kind === 'dungeon' && ground.dungeon) || ground;
  const mortar = fog(p, shade(base, 0.55), d);
  // One base fill under the sub-tiles, so their anti-aliased edges never show a seam of background.
  quad(ctx, floorPt(cx, horizon, h, d, l, 0, 0), floorPt(cx, horizon, h, d, l, 0, 1), floorPt(cx, horizon, h, d, l, 1, 1), floorPt(cx, horizon, h, d, l, 1, 0), look.mortar ? mortar : fog(p, base, d));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = hash(seed, i, j) - 0.5;
    // Tiles vary a little; lying snow evens them out. Where the look ripples, they shade by a chequer.
    let col = shade(base, 1 + v * look.vary * (1 - 0.75 * env.cover));
    if (look.ripples) col = shade(base, 1 + v * 0.1 + ((i + j) % 2) * 0.05);
    col = fog(p, col, d);
    // Flagstones sit inside a mortar gap; other grounds overlap a little so no seam shows.
    const inset = look.mortar ? 0.06 : -0.02;
    const a = floorPt(cx, horizon, h, d, l, i / n + inset / n, j / n + inset / n), b = floorPt(cx, horizon, h, d, l, i / n + inset / n, (j + 1) / n - inset / n);
    const c = floorPt(cx, horizon, h, d, l, (i + 1) / n - inset / n, (j + 1) / n - inset / n), e = floorPt(cx, horizon, h, d, l, (i + 1) / n - inset / n, j / n + inset / n);
    quad(ctx, a, b, c, e, col);
  }
  // What the look lays over its tiles: a field's rows and hedges, cobbles, a glow.
  look.lays?.(p, base, sq);
  // What lies on it: a few marks a square, placed by hash, scaled by depth, each painted by the look.
  const u = unit(d, h);
  if (look.lies) for (let i = 0; i < look.lies.marks; i++) {
    const s = hash(seed, 7, i), t = hash(seed, 9, i);
    const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    look.lies.mark(p, { ...sq, i, s, t, x, y, sc: unitIn(d, s, h) / u, base });
  }
  // Where a higher ground lies beside it, a tongue of that ground over its edge (ground/edges.ts, #1100).
  if (edges) drawEdges(p, sq, edges, floorPal);
  // After rain, puddles stand on the grounds that hold them (the roads and the dirt), holding a little of the sky.
  if (env.wet > 0.3 && look.puddles && d <= 3) {
    for (let i = 0; i < 3; i++) {
      if (hash(seed, 91, i) > env.wet - 0.2) continue;
      const s = 0.2 + hash(seed, 92, i) * 0.6, [x, y] = floorPt(cx, horizon, h, d, l, s, 0.15 + hash(seed, 93, i) * 0.7);
      const pw = unitIn(d, s, h) * (0.22 + 0.2 * hash(seed, 94, i)), ph = pw * 0.2;
      ctx.beginPath(); ctx.ellipse(x, y, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(p, shade(base, 0.6), d); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - pw * 0.15, y - ph * 0.2, pw * 0.6, ph * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(fog(p, haze ?? '#8a94a4', d), 0.55); ctx.fill();
    }
  }
  // Lying snow glitters.
  if (env.cover > 0.5 && look.snow > 0.7) {
    for (let i = 0; i < 4; i++) {
      const [x, y] = floorPt(cx, horizon, h, d, l, hash(seed, 95, i), hash(seed, 96, i));
      ctx.fillStyle = fog(p, i % 2 ? '#ffffff' : '#c8d8f0', d); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }
}

export function drawCeiling(p: Paint, pal: MapPalette, d: number, l: number, seed: number, facing: number): void {
  const { ctx, cx, horizon, h } = p;
  const ceiling = pal.ceiling;
  const P = (s: number, t: number): [number, number] => { const u = unitIn(d, s, h); return [cx + (l - 0.5 + t) * 2 * u, horizon - u]; };
  if (pal.ceilingStyle === 'beams') {
    // Planks running away from the eye, with a heavy beam across every cell.
    const plank = fog(LIT, shade(ceiling, 1.1), d), gapCol = fog(LIT, shade(ceiling, 0.55), d), beam = fog(LIT, shade(ceiling, 0.7), d);
    quad(ctx, P(0, 0), P(0, 1), P(1, 1), P(1, 0), gapCol);
    const planks = 4;
    for (let j = 0; j < planks; j++) {
      const g = 0.04 / planks;
      quad(ctx, P(0, j / planks + g), P(0, (j + 1) / planks - g), P(1, (j + 1) / planks - g), P(1, j / planks + g), shade(plank, 1 + (hash(seed, 61, j) - 0.5) * 0.12));
    }
    // The beam is at a fixed world position, so it reads the same from every facing.
    const along = (facing % 2 === 0) ? 0.5 : 0.5;
    quad(ctx, P(along - 0.08, -0.02), P(along - 0.08, 1.02), P(along + 0.08, 1.02), P(along + 0.08, -0.02), beam);
    const [ax, ay] = P(along - 0.08, 0), [bx] = P(along - 0.08, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(Math.round(ax), Math.round(ay), Math.round(bx - ax), 1);
    return;
  }
  const n = d <= 2 ? 3 : 2;
  const mortar = fog(LIT, shade(ceiling, 0.5), d);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = hash(seed, 21, i, j) - 0.5;
    const col = fog(LIT, shade(ceiling, 1 + v * 0.18), d);
    quad(ctx, P(i / n, j / n), P(i / n, (j + 1) / n), P((i + 1) / n, (j + 1) / n), P((i + 1) / n, j / n), mortar);
    const k = 0.05 / n;
    quad(ctx, P(i / n + k, j / n + k), P(i / n + k, (j + 1) / n - k), P((i + 1) / n - k, (j + 1) / n - k), P((i + 1) / n - k, j / n + k), col);
  }
}
