// The first-person viewport: a depth-layered compositor in the Might and Magic III-V tradition.
//
// Geometry. The eye sits at the centre of the party's cell. A plane k cells ahead of the eye
// projects with a half-size unit u(k) = (H/2) * NEAR / (k + 0.5): the near face of the cell
// directly ahead (k = 0.5) fills 90% of the viewport height, and each deeper face shrinks in
// proportion. A cell at depth d (0 = the party's own cell) spans planes d-0.5 .. d+0.5; a cell at
// lateral offset l spans x = cx + (l-0.5)*2u .. cx + (l+0.5)*2u on each plane. Everything is
// painted back to front, outer lateral columns before the centre, so nearer geometry overdraws.
//
// Everything is vector: walls are trapezoids, trees and monsters are shape sprites scaled by u.
// There are no bitmaps, so the viewport re-skins per map palette and time of day for free.
import type { World } from '../game/world.ts';
import type { GameMap, Cell } from '../game/map.ts';
import { FACING_DX, FACING_DY } from '../game/types.ts';
import type { Facing } from '../game/types.ts';
import { shade, mix, rgba } from '../lib/art/palettes.ts';
import { TERRAIN_COLORS } from './palette.ts';
import { drawMonsterSprite, drawTreeSprite, drawRockSprite, drawMountainSprite, drawPillarSprite } from './sprites.ts';
import type { MonsterSprite } from '../game/monsters.ts';

export const VIEW_W = 400, VIEW_H = 240;
const NEAR = 0.9;
const DEPTH = 4;
const LATERAL = 3;

export interface ViewRect { x: number; y: number; w: number; h: number; }

/** A monster to draw at a cell, resolved by the caller from the world's live groups. */
export interface ViewMonster { sprite: MonsterSprite; tint: string; size: number; count: number; }

function unit(k: number, h: number): number { return (h / 2) * NEAR / (k + 0.5); }

/** Map coordinates of the cell at depth d, lateral l relative to the party. */
function cellAt(px: number, py: number, f: Facing, d: number, l: number): { x: number; y: number } {
  // Lateral +1 is to the right of the facing.
  const rf = ((f + 1) & 3) as Facing;
  return { x: px + FACING_DX[f] * d + FACING_DX[rf] * l, y: py + FACING_DY[f] * d + FACING_DY[rf] * l };
}

/** Distance fog: nearer is truer. */
function fog(color: string, d: number, dark: boolean): string {
  const f = dark ? Math.max(0.15, 1 - d * 0.3) : Math.max(0.45, 1 - d * 0.14);
  return shade(color, f);
}

export function drawViewport(
  ctx: CanvasRenderingContext2D, world: World, r: ViewRect,
  monstersAt: (x: number, y: number) => ViewMonster | null, frame: number,
): void {
  const map = world.map;
  const { x: px, y: py, facing: f } = world.state;
  const cx = r.x + r.w / 2, horizon = r.y + r.h / 2;
  const dark = world.isDark && map.kind !== 'dungeon';
  const daylight = world.daylight;
  const sight = world.sight;

  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();

  // ---- sky and ground ----
  if (map.kind === 'dungeon') {
    ctx.fillStyle = map.palette.ceiling; ctx.fillRect(r.x, r.y, r.w, r.h / 2);
    ctx.fillStyle = shade(map.palette.floor, 0.6); ctx.fillRect(r.x, horizon, r.w, r.h / 2);
  } else {
    const top = mix('#0a0c1e', '#4f86c6', daylight), bottom = mix('#1a1428', '#c9d6e6', daylight);
    const g = ctx.createLinearGradient(0, r.y, 0, horizon);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h / 2);
    if (daylight < 0.4) {
      // Stars, fixed per position so they do not twinkle randomly on every frame.
      ctx.fillStyle = rgba('#ffffff', 0.7 * (1 - daylight / 0.4));
      for (let i = 0; i < 40; i++) { const sx = r.x + ((i * 97 + 13) % r.w), sy = r.y + ((i * 61 + 7) % (r.h / 2 - 20)); ctx.fillRect(sx, sy, 1, 1); }
    }
    // Distant ground: the terrain ahead, hazed toward the sky so the far edge of the view reads as distance.
    const farCell = map.at(px + FACING_DX[f] * (DEPTH + 1), py + FACING_DY[f] * (DEPTH + 1));
    const ground = shade(TERRAIN_COLORS[farCell.terrain] ?? map.palette.floor, dark ? 0.25 : 0.55);
    const gg = ctx.createLinearGradient(0, horizon, 0, horizon + unit(DEPTH + 0.5, r.h));
    gg.addColorStop(0, mix(ground, bottom, dark ? 0.15 : 0.45)); gg.addColorStop(1, ground);
    ctx.fillStyle = gg; ctx.fillRect(r.x, horizon, r.w, r.h / 2);
  }

  // ---- cells, back to front ----
  const order: number[] = [];
  for (let l = -LATERAL; l <= LATERAL; l++) order.push(l);
  order.sort((a, b) => Math.abs(b) - Math.abs(a));
  const visible = (d: number) => d <= sight;

  for (let d = DEPTH; d >= 0; d--) {
    if (!visible(d) && d > 0) continue;
    for (const l of order) {
      const c = cellAt(px, py, f, d, l);
      const cell = map.at(c.x, c.y);
      const nearK = d - 0.5, farK = d + 0.5;
      const uN = unit(nearK, r.h), uF = unit(farK, r.h);
      const xl = (k: number, u: number) => cx + (l - 0.5) * 2 * u, xr = (k: number, u: number) => cx + (l + 0.5) * 2 * u;
      const face = fog(map.palette.wall, d, dark), side = fog(map.palette.wallDark, d, dark);

      // Floor patch (outdoors and dungeon alike), so terrain reads at a distance.
      if (!isSolidWall(cell) && d > 0) {
        const col = fog(TERRAIN_COLORS[cell.terrain] ?? map.palette.floor, d, dark);
        quad(ctx, xl(farK, uF), horizon + uF, xr(farK, uF), horizon + uF, xr(nearK, uN), horizon + uN, xl(nearK, uN), horizon + uN, col, map.kind === 'dungeon' ? 0.35 : 0.12);
        if (map.kind === 'dungeon') {
          quad(ctx, xl(farK, uF), horizon - uF, xr(farK, uF), horizon - uF, xr(nearK, uN), horizon - uN, xl(nearK, uN), horizon - uN, fog(map.palette.ceiling, d, false), 0.35);
        }
      }

      if (isSolidWall(cell)) {
        // Front face: the near plane of the cell, if the cell before it is open (else it is hidden).
        const before = d > 0 ? map.at(...toPair(cellAt(px, py, f, d - 1, l))) : null;
        if (d > 0 && before && !isSolidWall(before)) {
          quad(ctx, xl(nearK, uN), horizon - uN, xr(nearK, uN), horizon - uN, xr(nearK, uN), horizon + uN, xl(nearK, uN), horizon + uN, cell.door !== 'none' ? face : face);
          if (cell.door === 'door' || cell.door === 'locked') drawDoor(ctx, xl(nearK, uN), xr(nearK, uN), horizon, uN, map.palette.door, d, dark, cell.door === 'locked');
          if (cell.solid === 'building' && map.kind === 'town') drawBuildingFace(ctx, xl(nearK, uN), xr(nearK, uN), horizon, uN, d, dark);
        }
        // Side face toward the centre column, if the laterally-inward neighbour is open.
        if (l !== 0) {
          const inward = map.at(...toPair(cellAt(px, py, f, d, l - Math.sign(l))));
          if (!isSolidWall(inward)) {
            const xIn = l > 0 ? xl : xr;
            quad(ctx, xIn(nearK, uN), horizon - uN, xIn(farK, uF), horizon - uF, xIn(farK, uF), horizon + uF, xIn(nearK, uN), horizon + uN, side);
          }
        }
      } else if (d > 0 && cell.solid !== 'none') {
        // Billboards: trees, rocks, mountains, pillars, drawn at the cell centre.
        const u = unit(d, r.h);
        const bx = cx + l * 2 * u, by = horizon + u;
        const tone = dark ? 0.35 : Math.max(0.5, 1 - d * 0.12);
        if (cell.solid === 'tree') drawTreeSprite(ctx, bx, by, u, tone, (c.x * 7 + c.y * 13) % 5);
        else if (cell.solid === 'rock') drawRockSprite(ctx, bx, by, u, tone);
        else if (cell.solid === 'mountain') drawMountainSprite(ctx, bx, by, u, tone, (c.x * 3 + c.y) % 3);
        else if (cell.solid === 'pillar') drawPillarSprite(ctx, bx, horizon, u, tone);
      }

      // Monsters stand in open cells.
      if (d > 0 && !isSolidWall(cell)) {
        const m = monstersAt(c.x, c.y);
        if (m) {
          const u = unit(d, r.h);
          const tone = dark ? 0.5 : Math.max(0.55, 1 - d * 0.12);
          const n = Math.min(m.count, 3);
          for (let i = 0; i < n; i++) {
            const off = (i - (n - 1) / 2) * u * 0.8;
            drawMonsterSprite(ctx, m.sprite, cx + l * 2 * u + off, horizon + u * 0.95, u * 2 * m.size, m.tint, tone, frame + i * 7);
          }
        }
      }
    }
  }

  // Darkness vignette in unlit places.
  if (dark || (map.kind === 'dungeon' && world.state.light === 0)) {
    const g = ctx.createRadialGradient(cx, horizon, r.h * 0.25, cx, horizon, r.h * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
  }
  ctx.restore();
}

function toPair(p: { x: number; y: number }): [number, number] { return [p.x, p.y]; }

function isSolidWall(c: Cell): boolean { return c.solid === 'wall' || c.solid === 'building' || c.door !== 'none'; }

function quad(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, fill: string, edge = 0.35): void {
  ctx.beginPath();
  ctx.moveTo(Math.round(x0), Math.round(y0)); ctx.lineTo(Math.round(x1), Math.round(y1));
  ctx.lineTo(Math.round(x2), Math.round(y2)); ctx.lineTo(Math.round(x3), Math.round(y3));
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (edge > 0) { ctx.strokeStyle = `rgba(0,0,0,${edge})`; ctx.lineWidth = 1; ctx.stroke(); }
}

function drawDoor(ctx: CanvasRenderingContext2D, xl: number, xr: number, horizon: number, u: number, color: string, d: number, dark: boolean, locked: boolean): void {
  const w = xr - xl, dw = w * 0.5, dh = u * 1.6;
  const x = xl + (w - dw) / 2, y = horizon + u - dh;
  ctx.fillStyle = fog(color, d, dark); ctx.fillRect(Math.round(x), Math.round(y), Math.round(dw), Math.round(dh));
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(dw), Math.round(dh));
  // Planks and a handle.
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let i = 1; i < 3; i++) ctx.fillRect(Math.round(x + dw * i / 3), Math.round(y), 1, Math.round(dh));
  ctx.fillStyle = fog(locked ? '#c9a34a' : '#b9b9c0', d, dark);
  ctx.fillRect(Math.round(x + dw * 0.72), Math.round(y + dh * 0.55), Math.max(1, Math.round(u * 0.12)), Math.max(1, Math.round(u * 0.12)));
}

function drawBuildingFace(ctx: CanvasRenderingContext2D, xl: number, xr: number, horizon: number, u: number, d: number, dark: boolean): void {
  // A window or two, so town blocks read as houses rather than dungeon walls.
  const w = xr - xl;
  const ww = w * 0.18, wh = u * 0.4;
  ctx.fillStyle = fog(dark ? '#e0b060' : '#2a3040', d, false);
  ctx.fillRect(Math.round(xl + w * 0.2), Math.round(horizon - u * 0.45), Math.round(ww), Math.round(wh));
  ctx.fillRect(Math.round(xr - w * 0.2 - ww), Math.round(horizon - u * 0.45), Math.round(ww), Math.round(wh));
  // Roof line.
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(Math.round(xl), Math.round(horizon - u), Math.round(w), Math.max(1, Math.round(u * 0.08)));
}

/** Which cells the viewport can show, for the automap's field-of-view highlight. */
export function viewCells(map: GameMap, px: number, py: number, f: Facing, sight: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let d = 0; d <= Math.min(DEPTH, sight); d++) for (let l = -LATERAL; l <= LATERAL; l++) {
    const c = cellAt(px, py, f, d, l);
    if (map.inBounds(c.x, c.y)) out.push(c);
  }
  return out;
}
