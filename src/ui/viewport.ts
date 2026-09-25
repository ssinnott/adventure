// The first-person viewport: a depth-layered compositor in the Might and Magic III-V tradition.
//
// Geometry. The eye sits at the centre of the party's cell. A plane k cells ahead of the eye
// projects with a half-size unit u(k) = (H/2) * NEAR / (k + 0.5): the near face of the cell
// directly ahead (k = 0.5) fills 90% of the viewport height, and each deeper face shrinks in
// proportion. A cell at depth d (0 = the party's own cell) spans planes d-0.5 .. d+0.5; a cell at
// lateral offset l spans x = cx + (l-0.5)*2u .. cx + (l+0.5)*2u on each plane. Everything is
// painted back to front, outer lateral columns before the centre, so nearer geometry overdraws.
//
// Everything is vector, textured procedurally (stone courses, timber frames, flagstones, tufts of
// grass) with a stable hash so the same wall always has the same darker block. The static scene
// is cached in an offscreen canvas keyed by the world state; monsters and the light flicker are
// drawn over it every frame.
import type { World } from '../game/world.ts';
import type { GameMap, Cell, Terrain, MapPalette } from '../game/map.ts';
import { FACING_DX, FACING_DY } from '../game/types.ts';
import type { Facing } from '../game/types.ts';
import { shade, mix, rgba } from '../lib/art/palettes.ts';
import { TERRAIN_COLORS } from './palette.ts';
import { drawMonsterSprite, drawTreeSprite, drawRockSprite, drawMountainSprite, drawPillarSprite } from './sprites.ts';
import type { MonsterSprite } from '../game/monsters.ts';
import { hash } from './brush.ts';

export const VIEW_W = 400, VIEW_H = 268;
const NEAR = 0.9;
const DEPTH = 4;
const LATERAL = 3;

export interface ViewRect { x: number; y: number; w: number; h: number; }

/** A monster to draw at a cell, resolved by the caller from the world's live groups. */
export interface ViewMonster { sprite: MonsterSprite; tint: string; size: number; count: number; }

function unit(k: number, h: number): number { return (h / 2) * NEAR / (k + 0.5); }

/** Map coordinates of the cell at depth d, lateral l relative to the party. */
function cellAt(px: number, py: number, f: Facing, d: number, l: number): { x: number; y: number } {
  const rf = ((f + 1) & 3) as Facing;
  return { x: px + FACING_DX[f] * d + FACING_DX[rf] * l, y: py + FACING_DY[f] * d + FACING_DY[rf] * l };
}

/** Distance fog: nearer is truer. `haze` is the colour far things fade toward. */
function fog(color: string, d: number, dark: boolean, haze: string | null = null): string {
  // Outdoors (haze given) keeps its colour with distance, as Xeen does; dungeons fall off into dark.
  const f = dark ? Math.max(0.12, 1 - d * 0.3) : haze ? Math.max(0.7, 1 - d * 0.07) : Math.max(0.5, 1 - d * 0.12);
  const c = shade(color, f);
  return haze && !dark ? mix(c, haze, Math.min(0.3, d * 0.06)) : c;
}

interface Flame { x: number; y: number; s: number; }
interface Scene {
  key: string;
  canvas: HTMLCanvasElement;
  flames: Flame[];
}
let scene: Scene | null = null;
/** Filled while a scene is painted: where the torches and lanterns are, for the per-frame flames. */
let flames: Flame[] = [];

function isSolidWall(c: Cell): boolean { return c.solid === 'wall' || c.solid === 'building' || c.door !== 'none'; }

export function drawViewport(
  ctx: CanvasRenderingContext2D, world: World, r: ViewRect,
  monstersAt: (x: number, y: number) => ViewMonster | null, frame: number,
): void {
  const key = [world.state.mapId, world.state.x, world.state.y, world.state.facing, world.sight, Math.round(world.daylight * 20), world.state.light > 0 ? 1 : 0, Object.keys(world.mapState.doors).length, r.w, r.h].join('|');
  if (!scene || scene.key !== key) {
    const canvas = scene?.canvas ?? document.createElement('canvas');
    canvas.width = r.w; canvas.height = r.h;
    flames = [];
    paintScene(canvas.getContext('2d')!, world, { x: 0, y: 0, w: r.w, h: r.h });
    scene = { key, canvas, flames };
  }
  ctx.drawImage(scene.canvas, r.x, r.y);

  // Monsters, every frame, with a line-of-sight check against the cached walls.
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  const map = world.map;
  const { x: px, y: py, facing: f } = world.state;
  const cx = r.x + r.w / 2, horizon = r.y + r.h / 2;
  const dark = world.isDark && map.kind !== 'dungeon';
  for (let d = Math.min(DEPTH, world.sight); d >= 1; d--) {
    for (let l = -LATERAL; l <= LATERAL; l++) {
      const c = cellAt(px, py, f, d, l);
      if (isSolidWall(map.at(c.x, c.y)) || !lineOfSight(map, px, py, f, d, l)) continue;
      const m = monstersAt(c.x, c.y);
      if (!m) continue;
      const u = unit(d, r.h);
      const tone = dark ? 0.5 : Math.max(0.55, 1 - d * 0.12);
      const n = Math.min(m.count, 3);
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * u * 0.8;
        drawMonsterSprite(ctx, m.sprite, cx + l * 2 * u + off, horizon + u * 0.95, u * 2 * m.size, m.tint, tone, frame + i * 7);
      }
    }
  }
  // Torch flicker in the dark: a vignette whose reach breathes a little.
  if (dark || (map.kind === 'dungeon' && world.state.light === 0)) {
    const flick = 0.75 + 0.05 * Math.sin(frame / 5) + 0.03 * Math.sin(frame / 13);
    const g = ctx.createRadialGradient(cx, horizon, r.h * 0.22, cx, horizon, r.h * flick);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
  }
  // Flames on the sconces and lanterns, animated over the cached scene.
  for (const fl of scene.flames) drawFlame(ctx, r.x + fl.x, r.y + fl.y, fl.s, frame + Math.round(fl.x));
  ctx.restore();
}

/** Whether the cell at (d, l) can be seen from the eye: walk the straight line and stop at walls. */
function lineOfSight(map: GameMap, px: number, py: number, f: Facing, d: number, l: number): boolean {
  const steps = Math.max(d, Math.abs(l)) * 2;
  let lastD = 0, lastL = 0;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const dd = Math.round(d * t), ll = Math.round(l * t);
    if (dd === lastD && ll === lastL) continue;
    if (dd === d && ll === l) break;
    lastD = dd; lastL = ll;
    const c = cellAt(px, py, f, dd, ll);
    if (map.blocksView(c.x, c.y)) return false;
  }
  return true;
}

// ------------------------------------------------------------------ the scene ----

function paintScene(ctx: CanvasRenderingContext2D, world: World, r: ViewRect): void {
  const map = world.map;
  const { x: px, y: py, facing: f } = world.state;
  const cx = r.x + r.w / 2, horizon = r.y + r.h / 2;
  const dark = world.isDark && map.kind !== 'dungeon';
  const daylight = world.daylight;
  const sight = world.sight;
  const skyBottom = mix('#1a1428', '#c9d6e6', daylight);
  const haze = map.kind === 'dungeon' ? null : skyBottom;

  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();

  if (map.kind === 'dungeon') {
    ctx.fillStyle = shade(map.palette.ceiling, 0.7); ctx.fillRect(r.x, r.y, r.w, r.h / 2);
    ctx.fillStyle = shade(map.palette.floor, 0.5); ctx.fillRect(r.x, horizon, r.w, r.h / 2);
  } else {
    drawSkyBand(ctx, r, { facing: f, hour: (world.state.minutes % 1440) / 60, daylight, dark });
    const farCell = map.at(px + FACING_DX[f] * (DEPTH + 1), py + FACING_DY[f] * (DEPTH + 1));
    const ground = shade(TERRAIN_COLORS[farCell.terrain] ?? map.palette.floor, dark ? 0.2 : 0.55);
    const gg = ctx.createLinearGradient(0, horizon, 0, horizon + unit(DEPTH + 0.5, r.h));
    gg.addColorStop(0, mix(ground, skyBottom, dark ? 0.1 : 0.5)); gg.addColorStop(1, ground);
    ctx.fillStyle = gg; ctx.fillRect(r.x, horizon, r.w, r.h / 2);
  }

  const order: number[] = [];
  for (let l = -LATERAL; l <= LATERAL; l++) order.push(l);
  order.sort((a, b) => Math.abs(b) - Math.abs(a));

  for (let d = DEPTH; d >= 0; d--) {
    if (d > sight) continue;
    for (const l of order) {
      const c = cellAt(px, py, f, d, l);
      const cell = map.at(c.x, c.y);
      // The party's own cell starts at k = -0.5, where u is infinite and the walls beside the party
      // would come out as NaN and not draw at all. Clip them at k = 0 instead: its edges already
      // project past the viewport (u(0) = 241 against a half-width of 200).
      const nearK = Math.max(0, d - 0.5), farK = d + 0.5;
      const uN = unit(nearK, r.h), uF = unit(farK, r.h);
      const xl = (u: number) => cx + (l - 0.5) * 2 * u, xr = (u: number) => cx + (l + 0.5) * 2 * u;
      const seed = c.x * 131 + c.y * 17 + (map.id.length * 7);

      if (!isSolidWall(cell) && d > 0) {
        drawFloor(ctx, cell.terrain, map.kind, cx, horizon, r.h, d, l, seed, dark, haze, map.palette.floor);
        if (map.kind === 'dungeon') drawCeiling(ctx, map.palette, cx, horizon, r.h, d, l, seed, f);
      }

      if (isSolidWall(cell)) {
        const before = d > 0 ? map.at(...toPair(cellAt(px, py, f, d - 1, l))) : null;
        if (d > 0 && before && !isSolidWall(before)) {
          drawFrontFace(ctx, map, cell, c.x, c.y, f, xl(uN), xr(uN), horizon, uN, d, seed, dark, haze, daylight);
        }
        if (l !== 0) {
          const inward = map.at(...toPair(cellAt(px, py, f, d, l - Math.sign(l))));
          if (!isSolidWall(inward)) {
            const xIn = l > 0 ? xl : xr;
            drawSideFace(ctx, map, cell, c.x, c.y, xIn(uN), uN, xIn(uF), uF, horizon, d, seed, dark, haze, l > 0);
          }
        }
      } else if (d > 0 && cell.solid !== 'none') {
        const u = unit(d, r.h);
        const bx = cx + l * 2 * u, by = horizon + u;
        const tone = dark ? 0.3 : Math.max(0.5, 1 - d * 0.12);
        if (cell.solid === 'tree') drawTreeSprite(ctx, bx, by, u, tone, Math.floor(hash(c.x, c.y) * 5));
        else if (cell.solid === 'rock') drawRockSprite(ctx, bx, by, u, tone);
        else if (cell.solid === 'mountain') drawMountainSprite(ctx, bx, by, u, tone, Math.floor(hash(c.x, c.y, 3) * 3));
        else if (cell.solid === 'pillar') drawPillarSprite(ctx, bx, horizon, u, tone);
      }
    }
  }
  ctx.restore();
}

function toPair(p: { x: number; y: number }): [number, number] { return [p.x, p.y]; }

// ------------------------------------------------------------------ sky ----

export interface SkyOpts { facing: number; hour: number; daylight: number; dark: boolean; }

/** The sky, sun or moon, clouds, stars and distant hills for the top half of `r`. Also used by the title. */
export function drawSkyBand(ctx: CanvasRenderingContext2D, r: ViewRect, o: SkyOpts): void {
  const { facing: f, hour, daylight, dark } = o;
  const cx = r.x + r.w / 2, horizon = r.y + r.h / 2;
  const top = mix('#07091a', '#2f7ad8', daylight), bottom = mix('#1a1428', '#bcd8f0', daylight);
  const dusk = daylight > 0.05 && daylight < 0.6 ? 1 - Math.abs(daylight - 0.3) / 0.3 : 0;
  const g = ctx.createLinearGradient(0, r.y, 0, horizon);
  g.addColorStop(0, top); g.addColorStop(0.7, mix(bottom, '#e8905a', dusk * 0.35)); g.addColorStop(1, mix(bottom, '#f0b070', dusk * 0.6));
  ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h / 2);
  // Stars, fixed to the compass so they turn with the party.
  if (daylight < 0.5) {
    const a = 0.9 * (1 - daylight / 0.5);
    for (let i = 0; i < 70; i++) {
      const sx = ((hash(i, 1) * 4 * r.w - f * r.w) % (4 * r.w) + 4 * r.w) % (4 * r.w);
      if (sx > r.w) continue;
      const sy = r.y + hash(i, 2) * (r.h / 2 - 30);
      ctx.fillStyle = rgba('#ffffff', a * (0.4 + 0.6 * hash(i, 3)));
      ctx.fillRect(Math.round(r.x + sx), Math.round(sy), hash(i, 4) > 0.8 ? 2 : 1, 1);
    }
  }
  // Sun by day, moon by night: east at dawn, overhead at noon, west at dusk.
  const drawOrb = (t: number, color: string, glow: string, rad: number) => {
    // t: 0 rising in the east .. 1 setting in the west. Compass bearing from east (90) to west (270).
    const bearing = 90 + t * 180;
    let rel = ((bearing - f * 90) % 360 + 360) % 360; if (rel > 180) rel -= 360;
    if (Math.abs(rel) > 100) return;
    const ox = cx + (rel / 90) * r.w * 0.55, oy = r.y + 24 + (1 - Math.sin(t * Math.PI)) * (r.h / 2 - 40);
    const gg = ctx.createRadialGradient(ox, oy, rad * 0.5, ox, oy, rad * 4);
    gg.addColorStop(0, rgba(glow, 0.35)); gg.addColorStop(1, rgba(glow, 0));
    ctx.fillStyle = gg; ctx.fillRect(ox - rad * 4, oy - rad * 4, rad * 8, rad * 8);
    ctx.beginPath(); ctx.arc(ox, oy, rad, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
  };
  if (hour >= 5.5 && hour <= 19.5) drawOrb((hour - 5.5) / 14, '#fff4c0', '#ffd080', 9);
  if (hour >= 18.5 || hour <= 6.5) drawOrb(((hour + 5.5) % 24) / 12, '#e8ecf4', '#b0c0e0', 6);
  // Clouds: soft blobs with a lit top, fixed to the compass.
  for (let i = 0; i < 7; i++) {
    const cxp = ((hash(i, 11) * 4 * r.w - f * r.w) % (4 * r.w) + 4 * r.w) % (4 * r.w);
    if (cxp < -80 || cxp > r.w + 80) continue;
    const cy = r.y + 18 + hash(i, 12) * (r.h / 2 - 70), w = 40 + hash(i, 13) * 60, h = 8 + hash(i, 14) * 8;
    const cloud = mix('#2a2a44', '#ffffff', daylight), under = mix('#20203a', '#a8bcd8', daylight);
    for (let j = 0; j < 4; j++) {
      const bx = r.x + cxp + (j - 1.5) * w * 0.22, by = cy + (j % 2) * h * 0.3, br = h * (0.7 + hash(i, j) * 0.6);
      ctx.beginPath(); ctx.arc(bx, by + br * 0.3, br, 0, Math.PI * 2); ctx.fillStyle = rgba(under, 0.85); ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fillStyle = rgba(cloud, 0.9); ctx.fill();
    }
  }
  // Distant hills: two silhouette bands with a profile fixed to the compass.
  for (const [layer, col, amp, base] of [[0, mix('#101426', '#6a8ab8', daylight), 26, 30], [1, mix('#0c101e', '#3f8a4a', daylight), 16, 14]] as [number, string, number, number][]) {
    ctx.beginPath(); ctx.moveTo(r.x, horizon + 1);
    for (let x = 0; x <= r.w; x += 8) {
      const wx = (x + f * r.w * 1.0 + layer * 137) / (4 * r.w);
      const hgt = base + amp * (0.5 + 0.5 * Math.sin(wx * Math.PI * 2 * 3 + layer)) * (0.6 + 0.4 * hash(Math.floor(wx * 40), layer));
      ctx.lineTo(r.x + x, horizon - hgt);
    }
    ctx.lineTo(r.x + r.w, horizon + 1); ctx.closePath();
    ctx.fillStyle = dark ? shade(col, 0.5) : col; ctx.fill();
  }
}

// ------------------------------------------------------------------ floors ----

/** Corner of the floor sub-grid: depth fraction s (0 near .. 1 far) and lateral fraction t (0 left .. 1 right). */
function floorPt(cx: number, horizon: number, h: number, d: number, l: number, s: number, t: number): [number, number] {
  const u = unit(d - 0.5 + s, h);
  return [cx + (l - 0.5 + t) * 2 * u, horizon + u];
}

function drawFloor(ctx: CanvasRenderingContext2D, terrain: Terrain, kind: string, cx: number, horizon: number, h: number, d: number, l: number, seed: number, dark: boolean, haze: string | null, floorPal: string): void {
  const base = kind === 'dungeon' ? floorPal : (TERRAIN_COLORS[terrain] ?? floorPal);
  const n = d <= 2 ? 3 : 2;
  const flag = kind === 'dungeon' && terrain === 'floor';
  const mortar = fog(shade(base, 0.55), d, dark, haze);
  // One base fill under the sub-tiles, so their anti-aliased edges never show a seam of background.
  quad(ctx, floorPt(cx, horizon, h, d, l, 0, 0), floorPt(cx, horizon, h, d, l, 0, 1), floorPt(cx, horizon, h, d, l, 1, 1), floorPt(cx, horizon, h, d, l, 1, 0), flag ? mortar : fog(base, d, dark, haze));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = hash(seed, i, j) - 0.5;
    let col = shade(base, 1 + v * (flag ? 0.16 : terrain === 'grass' ? 0.12 : 0.08));
    if (terrain === 'water' || terrain === 'deep') col = shade(base, 1 + v * 0.1 + ((i + j) % 2) * 0.05);
    col = fog(col, d, dark, haze);
    // Flagstones sit inside a mortar gap; other terrains overlap a little so no seam shows.
    const inset = flag ? 0.06 : -0.02;
    const a = floorPt(cx, horizon, h, d, l, i / n + inset / n, j / n + inset / n), b = floorPt(cx, horizon, h, d, l, i / n + inset / n, (j + 1) / n - inset / n);
    const c = floorPt(cx, horizon, h, d, l, (i + 1) / n - inset / n, (j + 1) / n - inset / n), e = floorPt(cx, horizon, h, d, l, (i + 1) / n - inset / n, j / n + inset / n);
    quad(ctx, a, b, c, e, col);
  }
  // Decorations: a few per cell, placed by hash, scaled by depth.
  const u = unit(d, h);
  // Cobbled roads: rounded stones packed in a jittered grid, each with a lit top edge.
  if (terrain === 'road' && d <= 3) {
    const cols = d <= 1 ? 6 : 4, rows = d <= 1 ? 5 : 3;
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const s = (i + 0.5 + (hash(seed, 31, i, j) - 0.5) * 0.4) / rows, t = (j + 0.5 + (hash(seed, 32, i, j) - 0.5) * 0.4) / cols;
      const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
      const sc = unit(d - 0.5 + s, h) / u;
      const rx = (u / cols) * 0.8 * sc * 0.9, ry = rx * 0.45;
      const col = fog(shade(base, 0.85 + hash(seed, 33, i, j) * 0.35), d, dark, haze);
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
      if (rx > 3) { ctx.beginPath(); ctx.ellipse(x, y - ry * 0.35, rx * 0.7, ry * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = fog(shade(base, 1.2), d, dark, haze); ctx.fill(); }
      ctx.strokeStyle = fog(shade(base, 0.55), d, dark, haze); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  const deco = terrain === 'grass' ? 7 : terrain === 'dirt' ? 3 : terrain === 'sand' ? 4 : terrain === 'swamp' ? 3 : terrain === 'water' ? 3 : terrain === 'snow' ? 2 : flag ? 2 : 0;
  for (let i = 0; i < deco; i++) {
    const s = hash(seed, 7, i), t = hash(seed, 9, i);
    const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    const sc = unit(d - 0.5 + s, h) / u;
    if (terrain === 'grass') {
      if (i >= 5) {
        // A flower or two.
        if (hash(seed, 41, i) > 0.45) continue;
        ctx.fillStyle = fog(['#f0e060', '#ffffff', '#e05a6a', '#c080e0'][Math.floor(hash(seed, 42, i) * 4)], d, dark, haze);
        ctx.fillRect(Math.round(x), Math.round(y - 2 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(2 * sc)));
        continue;
      }
      const tuft = fog(shade(base, 1.3), d, dark, haze);
      ctx.strokeStyle = tuft; ctx.lineWidth = Math.max(1, sc);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5 * sc, y - 4 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1 * sc, y - 4.5 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 2.5 * sc, y - 3 * sc); ctx.stroke();
    } else if (flag) {
      if (hash(seed, 51, i) > 0.5) continue;
      if (i === 0) {
        // A crack.
        ctx.strokeStyle = fog(shade(base, 0.5), d, dark, haze); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3 * sc, y - 2 * sc); ctx.lineTo(x + 5 * sc, y - 5 * sc); ctx.lineTo(x + 9 * sc, y - 6 * sc); ctx.stroke();
      } else {
        // A puddle catching the light.
        ctx.beginPath(); ctx.ellipse(x, y, 5 * sc, 1.6 * sc, 0, 0, Math.PI * 2); ctx.fillStyle = fog(shade(base, 0.6), d, dark, haze); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x - sc, y - 0.4 * sc, 2 * sc, 0.5 * sc, 0, 0, Math.PI * 2); ctx.fillStyle = fog('#a0a8c0', d, dark, haze); ctx.fill();
      }
    } else if (terrain === 'dirt') {
      ctx.fillStyle = fog(shade(base, 0.7 + hash(seed, i) * 0.6), d, dark, haze);
      ctx.beginPath(); ctx.ellipse(x, y, 1.5 * sc + 0.5, 1 * sc + 0.4, 0, 0, Math.PI * 2); ctx.fill();
    } else if (terrain === 'sand') {
      ctx.fillStyle = fog(shade(base, 0.8), d, dark, haze); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    } else if (terrain === 'swamp') {
      ctx.strokeStyle = fog('#6a7a3a', d, dark, haze); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.5 * sc, y - 7 * sc); ctx.moveTo(x + 2 * sc, y); ctx.lineTo(x + 1.5 * sc, y - 5 * sc); ctx.stroke();
    } else if (terrain === 'water') {
      ctx.strokeStyle = fog(shade(base, 1.4), d, dark, haze); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 4 * sc, y); ctx.quadraticCurveTo(x, y - 1.5 * sc, x + 4 * sc, y); ctx.stroke();
    } else if (terrain === 'snow') {
      ctx.fillStyle = fog('#ffffff', d, dark, haze); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }
  if (terrain === 'lava') {
    const [x, y] = floorPt(cx, horizon, h, d, l, 0.5, 0.5);
    const gg = ctx.createRadialGradient(x, y, 0, x, y, u * 0.8); gg.addColorStop(0, 'rgba(255,200,80,0.7)'); gg.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = gg; ctx.fillRect(x - u, y - u, u * 2, u * 2);
  }
}

function drawCeiling(ctx: CanvasRenderingContext2D, pal: MapPalette, cx: number, horizon: number, h: number, d: number, l: number, seed: number, facing: number): void {
  const ceiling = pal.ceiling;
  const P = (s: number, t: number): [number, number] => { const u = unit(d - 0.5 + s, h); return [cx + (l - 0.5 + t) * 2 * u, horizon - u]; };
  if (pal.ceilingStyle === 'beams') {
    // Planks running away from the eye, with a heavy beam across every cell.
    const plank = fog(shade(ceiling, 1.1), d, false), gapCol = fog(shade(ceiling, 0.55), d, false), beam = fog(shade(ceiling, 0.7), d, false);
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
  const mortar = fog(shade(ceiling, 0.5), d, false);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = hash(seed, 21, i, j) - 0.5;
    const col = fog(shade(ceiling, 1 + v * 0.18), d, false);
    quad(ctx, P(i / n, j / n), P(i / n, (j + 1) / n), P((i + 1) / n, (j + 1) / n), P((i + 1) / n, j / n), mortar);
    const k = 0.05 / n;
    quad(ctx, P(i / n + k, j / n + k), P(i / n + k, (j + 1) / n - k), P((i + 1) / n - k, (j + 1) / n - k), P((i + 1) / n - k, j / n + k), col);
  }
}

// ------------------------------------------------------------------ walls ----

function isHouse(c: Cell): boolean { return c.solid === 'building' || c.door === 'door' || c.door === 'locked'; }

function drawFrontFace(ctx: CanvasRenderingContext2D, map: GameMap, cell: Cell, mx: number, my: number, f: Facing, x0: number, x1: number, horizon: number, u: number, d: number, seed: number, dark: boolean, haze: string | null, daylight: number): void {
  const top = horizon - u, bottom = horizon + u;
  const isDoor = cell.door === 'door' || cell.door === 'locked';
  const house = map.kind === 'town' && isHouse(cell);
  if (house) {
    // Does the row of houses continue to either side (screen left / right)? Then the roof runs on.
    const rf = ((f + 1) & 3) as Facing;
    const leftOn = isHouse(map.at(mx - FACING_DX[rf], my - FACING_DY[rf]));
    const rightOn = isHouse(map.at(mx + FACING_DX[rf], my + FACING_DY[rf]));
    drawHouseFront(ctx, x0, x1, top, bottom, d, seed, buildingSeed(map, mx, my), dark, haze, daylight, leftOn, rightOn);
  }
  else drawStoneFront(ctx, map.palette, x0, x1, top, bottom, d, seed, dark, haze, map.kind === 'outdoor');
  if (isDoor) drawDoor(ctx, x0, x1, horizon, u, map.palette.door, d, dark, cell.door === 'locked', map.kind === 'town');
  drawWallDecor(ctx, map, cell, mx, my, x0, x1, top, bottom, d, seed, dark, haze, daylight, house, isDoor);
}

/**
 * Whether a wall carries any dressing. Its hash has to beat those of the four cells around it, so
 * about one wall in five is dressed and two side by side never both are. Nothing past the edge of
 * the map is: outdoors that is the backdrop behind the ring of mountains.
 */
function isDressed(map: GameMap, x: number, y: number): boolean {
  if (!map.inBounds(x, y)) return false;
  const k = map.id.length, v = hash(x, y, k, 78);
  return v > hash(x - 1, y, k, 78) && v > hash(x + 1, y, k, 78) && v > hash(x, y - 1, k, 78) && v > hash(x, y + 1, k, 78);
}

/** What hangs on, grows on, or is scratched into a wall: chosen per cell by hash, so it is stable. */
function drawWallDecor(ctx: CanvasRenderingContext2D, map: GameMap, cell: Cell, mx: number, my: number, x0: number, x1: number, top: number, bottom: number, d: number, seed: number, dark: boolean, haze: string | null, daylight: number, house: boolean, isDoor: boolean): void {
  const w = x1 - x0, h = bottom - top;
  if (w < 14) return;
  const roll = hash(seed, 77);
  const feature = map.featuresAt(mx, my)[0];
  const cx = (x0 + x1) / 2;
  const dressed = isDressed(map, mx, my);
  if (house) {
    // A shop sign for service doors and a lantern by every door; a flower box or ivy on the odd wall.
    if (isDoor && feature) {
      const sw = w * 0.34, sh = h * 0.14, sx = x1 - sw - w * 0.06, sy = top + h * 0.1;
      ctx.strokeStyle = fog('#3a2a20', d, dark, haze); ctx.lineWidth = Math.max(1, w * 0.02);
      ctx.beginPath(); ctx.moveTo(sx + sw, sy - h * 0.06); ctx.lineTo(sx + sw, sy + sh); ctx.moveTo(sx, sy); ctx.lineTo(sx + sw, sy - h * 0.06); ctx.stroke();
      ctx.fillStyle = fog('#c9a34a', d, dark, haze); ctx.fillRect(Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh));
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(sx) + 0.5, Math.round(sy) + 0.5, Math.round(sw), Math.round(sh));
      drawSignGlyph(ctx, feature.kind, sx + sw / 2, sy + sh / 2, Math.min(sw, sh) * 0.7, fog('#3a2a20', d, dark, haze));
    }
    if (isDoor) {
      const lx = x0 + w * 0.16, ly = top + h * 0.42;
      ctx.fillStyle = fog('#3a3a40', d, dark, haze); ctx.fillRect(Math.round(lx - w * 0.03), Math.round(ly), Math.max(2, Math.round(w * 0.06)), Math.max(3, Math.round(h * 0.1)));
      if (daylight < 0.5) flames.push({ x: lx, y: ly + h * 0.06, s: Math.max(2, w * 0.05) });
    } else if (dressed && roll < 0.64) {
      // Flower box under the window.
      const bw = w * 0.3, bx = cx - bw / 2 + (hash(seed, 3) - 0.5) * w * 0.3, by = top + h * 0.43;
      ctx.fillStyle = fog('#5a3a24', d, dark, haze); ctx.fillRect(Math.round(bx), Math.round(by), Math.round(bw), Math.max(2, Math.round(h * 0.05)));
      for (let i = 0; i < 5; i++) { ctx.fillStyle = fog(['#e05a6a', '#f0e060', '#ffffff', '#c080e0'][i % 4], d, dark, haze); ctx.fillRect(Math.round(bx + bw * (i + 0.5) / 5) - 1, Math.round(by) - 2, 2, 2); }
    } else if (dressed) {
      // Ivy climbing a corner.
      const side = hash(seed, 4) > 0.5 ? x0 + w * 0.08 : x1 - w * 0.08;
      ctx.fillStyle = fog('#3f8a3a', d, dark, haze);
      for (let i = 0; i < 12; i++) { const iy = bottom - i * h * 0.075, ix = side + Math.sin(i * 1.7 + seed) * w * 0.05; ctx.beginPath(); ctx.arc(ix, iy, Math.max(1, w * 0.025), 0, Math.PI * 2); ctx.fill(); }
    }
    return;
  }
  // Stone walls: mostly bare, and a door is dressing enough. Nearly half of what is dressed is a
  // sconce, so dungeons stay lit; banners, cobwebs, cracks, drips, rings, grates and carvings share
  // the rest.
  if (!dressed || isDoor) return;
  if (roll < 0.45) {
    // Torch sconce: iron bracket, then a flame drawn per frame.
    const sx = cx + (hash(seed, 5) - 0.5) * w * 0.4, sy = top + h * 0.38;
    ctx.fillStyle = fog('#2a2a30', d, dark, null);
    ctx.fillRect(Math.round(sx - w * 0.025), Math.round(sy), Math.max(2, Math.round(w * 0.05)), Math.max(3, Math.round(h * 0.14)));
    ctx.fillRect(Math.round(sx - w * 0.05), Math.round(sy + h * 0.1), Math.max(3, Math.round(w * 0.1)), Math.max(1, Math.round(h * 0.03)));
    // Torch head.
    ctx.fillStyle = fog('#6a4a2a', d, dark, null); ctx.fillRect(Math.round(sx - w * 0.02), Math.round(sy - h * 0.06), Math.max(2, Math.round(w * 0.04)), Math.max(2, Math.round(h * 0.08)));
    flames.push({ x: sx, y: sy - h * 0.06, s: Math.max(3, w * 0.07) });
  } else if (roll < 0.53) {
    // A banner hung from a rod.
    const bw = w * 0.28, bx = cx - bw / 2 + (hash(seed, 6) - 0.5) * w * 0.3, by = top + h * 0.12, bh = h * 0.5;
    const col = fog(map.palette.banner, d, dark, haze);
    ctx.fillStyle = fog('#3a3a40', d, dark, haze); ctx.fillRect(Math.round(bx - w * 0.03), Math.round(by), Math.round(bw + w * 0.06), Math.max(1, Math.round(h * 0.02)));
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bh * 0.8); ctx.lineTo(bx + bw / 2, by + bh); ctx.lineTo(bx, by + bh * 0.8); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = fog(shade(map.palette.banner, 0.6), d, dark, haze); ctx.fillRect(Math.round(bx + bw * 0.15), Math.round(by + bh * 0.2), Math.max(1, Math.round(bw * 0.7)), Math.max(1, Math.round(h * 0.02)));
    // The Lantern emblem: a ring.
    if (bw > 10) { ctx.strokeStyle = fog('#e8d090', d, dark, haze); ctx.lineWidth = Math.max(1, bw * 0.08); ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh * 0.5, bw * 0.2, 0, Math.PI * 2); ctx.stroke(); }
  } else if (roll < 0.61) {
    // Cobweb in a top corner.
    const left = hash(seed, 8) > 0.5, ox = left ? x0 : x1, s = left ? 1 : -1, r = Math.min(w, h) * 0.28;
    ctx.strokeStyle = fog('#d8d8e0', d, dark, haze); ctx.lineWidth = 1; ctx.globalAlpha = 0.55;
    for (let i = 0; i <= 4; i++) { const a = (i / 4) * Math.PI / 2; ctx.beginPath(); ctx.moveTo(ox, top); ctx.lineTo(ox + s * Math.cos(a) * r, top + Math.sin(a) * r); ctx.stroke(); }
    for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(ox, top, r * k / 3, left ? 0 : Math.PI / 2, left ? Math.PI / 2 : Math.PI); ctx.stroke(); }
    ctx.globalAlpha = 1;
  } else if (roll < 0.69) {
    // A crack running down.
    const sx = x0 + w * (0.2 + hash(seed, 9) * 0.6);
    ctx.strokeStyle = fog(shade(map.palette.wallDark, 0.5), d, dark, haze); ctx.lineWidth = Math.max(1, w * 0.012);
    ctx.beginPath(); ctx.moveTo(sx, top + h * 0.1);
    for (let i = 1; i <= 5; i++) ctx.lineTo(sx + (hash(seed, 10, i) - 0.5) * w * 0.14, top + h * (0.1 + i * 0.13));
    ctx.stroke();
  } else if (roll < 0.76) {
    // Damp streak with moss at the foot.
    const sx = x0 + w * (0.25 + hash(seed, 11) * 0.5), sw = w * 0.08;
    ctx.fillStyle = rgba('#000000', 0.22); ctx.fillRect(Math.round(sx), Math.round(top), Math.round(sw), Math.round(h * 0.8));
    ctx.fillStyle = fog('#4f8a3a', d, dark, haze); ctx.beginPath(); ctx.ellipse(sx + sw / 2, bottom - h * 0.06, sw * 1.4, h * 0.05, 0, 0, Math.PI * 2); ctx.fill();
  } else if (roll < 0.84) {
    // Iron ring on a plate.
    const rx = cx + (hash(seed, 12) - 0.5) * w * 0.5, ry = top + h * 0.5, r = Math.max(2, w * 0.05);
    ctx.fillStyle = fog('#3a3a40', d, dark, haze); ctx.fillRect(Math.round(rx - r * 0.8), Math.round(ry - r * 1.2), Math.round(r * 1.6), Math.round(r * 0.8));
    ctx.strokeStyle = fog('#6a6a74', d, dark, haze); ctx.lineWidth = Math.max(1, r * 0.3); ctx.beginPath(); ctx.arc(rx, ry, r, 0, Math.PI * 2); ctx.stroke();
  } else if (roll < 0.92) {
    // A barred grate into the dark.
    const gw = w * 0.26, gh = h * 0.2, gx = cx - gw / 2 + (hash(seed, 13) - 0.5) * w * 0.3, gy = top + h * 0.25;
    ctx.fillStyle = '#0c0a10'; ctx.fillRect(Math.round(gx), Math.round(gy), Math.round(gw), Math.round(gh));
    ctx.fillStyle = fog('#5a5a64', d, dark, haze);
    for (let i = 1; i < 4; i++) ctx.fillRect(Math.round(gx + gw * i / 4), Math.round(gy), Math.max(1, Math.round(w * 0.012)), Math.round(gh));
    ctx.strokeStyle = fog('#3a3a40', d, dark, haze); ctx.lineWidth = 1; ctx.strokeRect(Math.round(gx) + 0.5, Math.round(gy) + 0.5, Math.round(gw), Math.round(gh));
  } else if (cell.door === 'none') {
    // A carved panel of old glyphs.
    const pw = w * 0.36, ph = h * 0.26, px = cx - pw / 2, py = top + h * 0.3;
    ctx.fillStyle = fog(shade(map.palette.wall, 0.85), d, dark, haze); ctx.fillRect(Math.round(px), Math.round(py), Math.round(pw), Math.round(ph));
    ctx.strokeStyle = fog(shade(map.palette.wallDark, 0.6), d, dark, haze); ctx.lineWidth = 1; ctx.strokeRect(Math.round(px) + 0.5, Math.round(py) + 0.5, Math.round(pw), Math.round(ph));
    if (pw > 16) for (let i = 0; i < 6; i++) {
      const gx = px + pw * (0.12 + (i % 3) * 0.3), gy = py + ph * (0.15 + Math.floor(i / 3) * 0.45), gs = pw * 0.12;
      ctx.beginPath(); ctx.moveTo(gx, gy + gs); ctx.lineTo(gx + gs * 0.5, gy); ctx.lineTo(gx + gs, gy + gs); if (hash(seed, 14, i) > 0.5) ctx.moveTo(gx, gy + gs * 0.5), ctx.lineTo(gx + gs, gy + gs * 0.5); ctx.stroke();
    }
  }
}

function drawSignGlyph(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, s: number, ink: string): void {
  ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.lineWidth = Math.max(1, s * 0.12); ctx.lineCap = 'round';
  switch (kind) {
    case 'inn': // a tankard
      ctx.fillRect(Math.round(x - s * 0.3), Math.round(y - s * 0.35), Math.round(s * 0.5), Math.round(s * 0.7));
      ctx.beginPath(); ctx.arc(x + s * 0.3, y, s * 0.2, -Math.PI / 2, Math.PI / 2); ctx.stroke(); break;
    case 'shop': // a scale
      ctx.beginPath(); ctx.moveTo(x, y - s * 0.4); ctx.lineTo(x, y + s * 0.4); ctx.moveTo(x - s * 0.4, y - s * 0.2); ctx.lineTo(x + s * 0.4, y - s * 0.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x - s * 0.4, y + s * 0.05, s * 0.15, 0, Math.PI); ctx.arc(x + s * 0.4, y + s * 0.05, s * 0.15, 0, Math.PI); ctx.stroke(); break;
    case 'temple': // a lantern ring
      ctx.beginPath(); ctx.arc(x, y, s * 0.3, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, s * 0.1, 0, Math.PI * 2); ctx.fill(); break;
    case 'guild': // an open book
      ctx.beginPath(); ctx.moveTo(x - s * 0.4, y - s * 0.25); ctx.lineTo(x, y - s * 0.1); ctx.lineTo(x + s * 0.4, y - s * 0.25); ctx.lineTo(x + s * 0.4, y + s * 0.3); ctx.lineTo(x, y + s * 0.4); ctx.lineTo(x - s * 0.4, y + s * 0.3); ctx.closePath(); ctx.stroke(); break;
    case 'trainer': // crossed swords
      ctx.beginPath(); ctx.moveTo(x - s * 0.4, y - s * 0.4); ctx.lineTo(x + s * 0.4, y + s * 0.4); ctx.moveTo(x + s * 0.4, y - s * 0.4); ctx.lineTo(x - s * 0.4, y + s * 0.4); ctx.stroke(); break;
    default: // a mug for the tavern and anything else
      ctx.fillRect(Math.round(x - s * 0.25), Math.round(y - s * 0.3), Math.round(s * 0.5), Math.round(s * 0.6));
  }
}

/** A flame: two tones and a glow, flickering with the frame. */
function drawFlame(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number): void {
  const f1 = Math.sin(frame / 3.1), f2 = Math.sin(frame / 5.3 + 1);
  const hgt = s * (2.2 + 0.4 * f1), lean = s * 0.25 * f2;
  const g = ctx.createRadialGradient(x, y - s * 0.5, s * 0.2, x, y - s * 0.5, s * 5);
  g.addColorStop(0, `rgba(255,180,80,${0.35 + 0.05 * f1})`); g.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = g; ctx.fillRect(x - s * 5, y - s * 5.5, s * 10, s * 10);
  ctx.beginPath(); ctx.moveTo(x - s * 0.55, y); ctx.quadraticCurveTo(x - s * 0.7, y - hgt * 0.5, x + lean, y - hgt); ctx.quadraticCurveTo(x + s * 0.7, y - hgt * 0.5, x + s * 0.55, y); ctx.closePath();
  ctx.fillStyle = '#ff8a30'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - s * 0.3, y); ctx.quadraticCurveTo(x - s * 0.35, y - hgt * 0.35, x + lean * 0.6, y - hgt * 0.6); ctx.quadraticCurveTo(x + s * 0.35, y - hgt * 0.35, x + s * 0.3, y); ctx.closePath();
  ctx.fillStyle = '#ffe090'; ctx.fill();
}

/** Stone block courses on an axis-aligned face. */
function drawStoneFront(ctx: CanvasRenderingContext2D, pal: MapPalette, x0: number, x1: number, top: number, bottom: number, d: number, seed: number, dark: boolean, haze: string | null, mossy: boolean): void {
  const wall = pal.wall, wallDark = pal.wallDark;
  const w = x1 - x0, h = bottom - top;
  ctx.fillStyle = fog(wallDark, d, dark, haze); ctx.fillRect(Math.round(x0), Math.round(top), Math.round(w), Math.round(h));
  const brick = pal.wallStyle === 'brick';
  const rows = brick ? 9 : 6, cols = brick ? 4 : 3;
  const rh = h / rows, cw = w / cols;
  const gap = rh > 6 ? 1 : 0;
  for (let i = 0; i < rows; i++) {
    const off = (i % 2) * cw * 0.5;
    for (let j = -1; j < cols; j++) {
      const bx = x0 + j * cw + off, bw = cw;
      const cx0 = Math.max(x0, bx), cx1 = Math.min(x1, bx + bw);
      if (cx1 - cx0 < 1) continue;
      const v = hash(seed, i, j) - 0.5;
      let col = shade(wall, 1 + v * (brick ? 0.3 : 0.22));
      if (brick && hash(seed, i, j, 6) > 0.85) col = mix(col, '#7a3a2a', 0.5);
      if (mossy && hash(seed, i, j, 5) > 0.8) col = mix(col, '#4a6a3a', 0.4);
      ctx.fillStyle = fog(col, d, dark, haze);
      ctx.fillRect(Math.round(cx0) + gap, Math.round(top + i * rh) + gap, Math.round(cx1 - cx0) - gap, Math.round(rh) - gap);
      if (rh > 10) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(Math.round(cx0) + gap, Math.round(top + i * rh) + gap, Math.round(cx1 - cx0) - gap, 1); }
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x0) + 0.5, Math.round(top) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
}

/** A timber-framed house front with a window and a gable roof above. */
/** A seed shared by every cell of one building: the hash of its top-left cell. */
function buildingSeed(map: GameMap, mx: number, my: number): number {
  let x = mx, y = my;
  while (isHouse(map.at(x - 1, y))) x--;
  while (isHouse(map.at(x, y - 1))) y--;
  return x * 977 + y * 31 + map.id.length;
}

/** The roof colour for a house: terracotta, slate or thatch, fixed per building. */
function roofColor(bseed: number): string {
  const r = hash(bseed, 2);
  return r < 0.55 ? '#a8503a' : r < 0.8 ? '#5a6070' : '#b89050';
}

function drawHouseFront(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, bottom: number, d: number, seed: number, bseed: number, dark: boolean, haze: string | null, daylight: number, leftOn: boolean, rightOn: boolean): void {
  const w = x1 - x0, h = bottom - top;
  const plaster = fog(shade('#d8c8a8', 1 + (hash(bseed, 1) - 0.5) * 0.15), d, dark, haze), beam = fog('#4a3020', d, dark, haze);
  ctx.fillStyle = plaster; ctx.fillRect(Math.round(x0), Math.round(top), Math.round(w), Math.round(h));
  drawRoofFront(ctx, x0, x1, top, w, h, d, seed, bseed, dark, haze, leftOn, rightOn);
  // Timber frame: posts, a sill beam, a mid beam and braces.
  const bw = Math.max(1, Math.round(w * 0.035));
  ctx.fillStyle = beam;
  ctx.fillRect(Math.round(x0), Math.round(top), bw, Math.round(h));
  ctx.fillRect(Math.round(x1) - bw, Math.round(top), bw, Math.round(h));
  ctx.fillRect(Math.round(x0), Math.round(top), Math.round(w), bw);
  ctx.fillRect(Math.round(x0), Math.round(top + h * 0.55), Math.round(w), bw);
  if (w > 30) {
    ctx.strokeStyle = beam; ctx.lineWidth = bw;
    ctx.beginPath(); ctx.moveTo(x0 + bw, top + h * 0.55); ctx.lineTo(x0 + w * 0.25, top + bw); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1 - bw, top + h * 0.55); ctx.lineTo(x1 - w * 0.25, top + bw); ctx.stroke();
  }
  // Window: frame, four panes, warm at night.
  const ww = w * 0.22, wh = h * 0.22, wx = x0 + w * 0.5 - ww / 2 + (hash(seed, 3) - 0.5) * w * 0.3, wy = top + h * 0.2;
  const lit = daylight < 0.4 && hash(seed, 4) > 0.3;
  ctx.fillStyle = beam; ctx.fillRect(Math.round(wx) - 1, Math.round(wy) - 1, Math.round(ww) + 2, Math.round(wh) + 2);
  ctx.fillStyle = lit ? fog('#f0b860', d, false, null) : fog('#2a3040', d, dark, haze); ctx.fillRect(Math.round(wx), Math.round(wy), Math.round(ww), Math.round(wh));
  if (ww > 8) { ctx.fillStyle = beam; ctx.fillRect(Math.round(wx + ww / 2), Math.round(wy), 1, Math.round(wh)); ctx.fillRect(Math.round(wx), Math.round(wy + wh / 2), Math.round(ww), 1); }
  if (lit) { const gg = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 1, wx + ww / 2, wy + wh / 2, ww); gg.addColorStop(0, 'rgba(255,190,100,0.25)'); gg.addColorStop(1, 'rgba(255,190,100,0)'); ctx.fillStyle = gg; ctx.fillRect(wx - ww, wy - ww, ww * 3, ww * 3); }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.strokeRect(Math.round(x0) + 0.5, Math.round(top) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
}

/**
 * A pitched roof seen from the front: the eaves overhang the wall, the slope recedes up and away
 * to a ridge set back from the face, tile rows converge toward the ridge, and the eave throws a
 * shadow on the wall. Where the row of houses continues to a side, the roof runs on unhipped.
 */
function drawRoofFront(ctx: CanvasRenderingContext2D, x0: number, x1: number, top: number, w: number, h: number, d: number, seed: number, bseed: number, dark: boolean, haze: string | null, leftOn: boolean, rightOn: boolean): void {
  const base = roofColor(bseed);
  const tile = fog(base, d, dark, haze), tileDark = fog(shade(base, 0.72), d, dark, haze), tileLight = fog(shade(base, 1.18), d, dark, haze);
  const ov = w * 0.08;                        // eave overhang
  const rise = h * 0.42;                      // how far up the ridge sits above the eave
  const hip = w * 0.22;                       // how far in the ridge ends where the roof is hipped
  const eL = leftOn ? x0 : x0 - ov, eR = rightOn ? x1 : x1 + ov;   // eave ends
  const rL = leftOn ? x0 : x0 + hip, rR = rightOn ? x1 : x1 - hip;   // ridge ends
  const eaveY = top, ridgeY = top - rise;
  // Eave shadow on the wall below.
  const sh = ctx.createLinearGradient(0, eaveY, 0, eaveY + h * 0.12);
  sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh; ctx.fillRect(Math.round(x0), Math.round(eaveY), Math.round(w), Math.round(h * 0.12));
  // The slope.
  ctx.beginPath(); ctx.moveTo(eL, eaveY); ctx.lineTo(rL, ridgeY); ctx.lineTo(rR, ridgeY); ctx.lineTo(eR, eaveY); ctx.closePath();
  ctx.fillStyle = tile; ctx.fill();
  if (h > 20) {
    ctx.save(); ctx.clip();
    // Tile rows: bands that converge toward the ridge, darker under each row's lip, with staggered joints.
    const rows = Math.max(3, Math.min(9, Math.round(rise / 5)));
    for (let i = 0; i < rows; i++) {
      const t0 = i / rows, t1 = (i + 1) / rows;
      const yA = eaveY + (ridgeY - eaveY) * t0, yB = eaveY + (ridgeY - eaveY) * t1;
      const lA = eL + (rL - eL) * t0, rA = eR + (rR - eR) * t0, lB = eL + (rL - eL) * t1, rB = eR + (rR - eR) * t1;
      ctx.beginPath(); ctx.moveTo(lA, yA); ctx.lineTo(rA, yA); ctx.lineTo(rB, yB); ctx.lineTo(lB, yB); ctx.closePath();
      ctx.fillStyle = i % 2 ? tile : fog(shade(base, 1 + (hash(seed, 3, i) - 0.5) * 0.1), d, dark, haze); ctx.fill();
      // The lip of the row above casts a line onto this one.
      ctx.strokeStyle = tileDark; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lA, yA + 0.5); ctx.lineTo(rA, yA + 0.5); ctx.stroke();
      // Joints between tiles, staggered per row.
      const cols = Math.max(3, Math.round(w / 9));
      ctx.strokeStyle = rgba('#000000', 0.22);
      for (let j = 0; j <= cols; j++) {
        const fx = (j + (i % 2) * 0.5) / cols;
        const xa = lA + (rA - lA) * fx, xb = lB + (rB - lB) * fx;
        ctx.beginPath(); ctx.moveTo(xa, yA); ctx.lineTo(xb, yB); ctx.stroke();
      }
    }
    ctx.restore();
  }
  // Ridge cap and outline.
  ctx.strokeStyle = tileLight; ctx.lineWidth = Math.max(1, h * 0.02); ctx.beginPath(); ctx.moveTo(rL, ridgeY); ctx.lineTo(rR, ridgeY); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(eL, eaveY); ctx.lineTo(rL, ridgeY); ctx.lineTo(rR, ridgeY); ctx.lineTo(eR, eaveY); ctx.closePath(); ctx.stroke();
  // Eave board along the bottom edge.
  ctx.fillStyle = fog('#4a3020', d, dark, haze); ctx.fillRect(Math.round(eL), Math.round(eaveY) - 1, Math.round(eR - eL), Math.max(1, Math.round(h * 0.03)));
  // A chimney on some houses.
  if (hash(seed, 4) > 0.55 && w > 24) {
    const cw = w * 0.09, cxp = x0 + w * (0.25 + hash(seed, 5) * 0.5), ch = rise * 0.55;
    const cy = ridgeY - ch * 0.5;
    ctx.fillStyle = fog('#7a6a60', d, dark, haze); ctx.fillRect(Math.round(cxp), Math.round(cy), Math.round(cw), Math.round(ridgeY - cy + rise * 0.35));
    ctx.fillStyle = fog('#5a4a44', d, dark, haze); ctx.fillRect(Math.round(cxp) - 1, Math.round(cy), Math.round(cw) + 2, Math.max(1, Math.round(h * 0.025)));
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.strokeRect(Math.round(cxp) + 0.5, Math.round(cy) + 0.5, Math.round(cw), Math.round(ridgeY - cy + rise * 0.35));
  }
}

/** A side face in perspective: stone courses that converge, or a plain plastered wall for houses. */
function drawSideFace(ctx: CanvasRenderingContext2D, map: GameMap, cell: Cell, mx: number, my: number, xN: number, uN: number, xF: number, uF: number, horizon: number, d: number, seed: number, dark: boolean, haze: string | null, onRight: boolean): void {
  const house = map.kind === 'town' && isHouse(cell);
  const bseed = house ? buildingSeed(map, mx, my) : 0;
  const baseCol = house ? shade('#d8c8a8', 0.8 * (1 + (hash(bseed, 1) - 0.5) * 0.15)) : map.palette.wallDark;
  const shadeSide = onRight ? 0.85 : 0.75;
  const P = (s: number, t: number): [number, number] => {
    // s along depth (0 near .. 1 far), t along height (0 top .. 1 bottom); x follows the true projection.
    const u = uN + (uF - uN) * s; // straight edge in screen space
    const x = xN + (xF - xN) * s;
    return [x, horizon - u + 2 * u * t];
  };
  quad(ctx, P(0, 0), P(1, 0), P(1, 1), P(0, 1), fog(shade(baseCol, shadeSide), d, dark, haze));
  if (house) {
    const beam = fog('#4a3020', d, dark, haze);
    ctx.strokeStyle = beam; ctx.lineWidth = Math.max(1, uN * 0.03); ctx.lineCap = 'butt';
    // Sill and mid beams, a post at each end and the middle, and braces in the lower panels.
    line(ctx, P(0, 0.55), P(1, 0.55)); line(ctx, P(0, 0), P(1, 0)); line(ctx, P(0, 1), P(1, 1));
    line(ctx, P(0, 0), P(0, 1)); line(ctx, P(0.5, 0), P(0.5, 1)); line(ctx, P(1, 0), P(1, 1));
    line(ctx, P(0.02, 1), P(0.48, 0.57)); line(ctx, P(0.98, 1), P(0.52, 0.57));
    // A window in the upper half, shuttered dark by day and lit at night.
    if (uN > 30) {
      const wl = 0.62, wr = 0.88, wt = 0.14, wb = 0.42;
      quad(ctx, P(wl, wt), P(wr, wt), P(wr, wb), P(wl, wb), beam);
      const lit = hash(bseed, 9) > 0.4 && (haze === null || hash(bseed, 10) > 0.5);
      quad(ctx, P(wl + 0.02, wt + 0.03), P(wr - 0.02, wt + 0.03), P(wr - 0.02, wb - 0.03), P(wl + 0.02, wb - 0.03), lit && dark ? fog('#f0b860', d, false, null) : fog('#2a3040', d, dark, haze));
      ctx.strokeStyle = beam; ctx.lineWidth = 1; line(ctx, P((wl + wr) / 2, wt), P((wl + wr) / 2, wb)); line(ctx, P(wl, (wt + wb) / 2), P(wr, (wt + wb) / 2));
    }
    // The roof seen from the side: the eave runs along the wall top and the slope climbs inward
    // (away from the eye laterally) to a ridge, both lines receding in perspective.
    const base = roofColor(bseed);
    // The slope climbs toward the building's centre: rightward for a house on the right of the street.
    const dir = onRight ? 1 : -1;
    const eave = (s: number): [number, number] => { const u = uN + (uF - uN) * s; return [xN + (xF - xN) * s - dir * u * 0.16, horizon - u]; };
    const ridge = (s: number): [number, number] => { const u = uN + (uF - uN) * s; return [xN + (xF - xN) * s + dir * u * 1.0, horizon - u - u * 0.84]; };
    quad(ctx, eave(0), eave(1), ridge(1), ridge(0), fog(shade(base, onRight ? 0.85 : 0.75), d, dark, haze));
    // Tile rows as lines from the near edge to the far edge, converging.
    ctx.strokeStyle = fog(shade(base, 0.6), d, dark, haze); ctx.lineWidth = 1;
    const rows = Math.max(3, Math.min(8, Math.round(uN * 0.15)));
    for (let i = 1; i < rows; i++) {
      const t = i / rows;
      const a = eave(0), b = ridge(0), c2 = eave(1), e2 = ridge(1);
      line(ctx, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], [c2[0] + (e2[0] - c2[0]) * t, c2[1] + (e2[1] - c2[1]) * t]);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath(); const a = eave(0), b = eave(1), c = ridge(1), e = ridge(0); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(e[0], e[1]); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = fog(shade(base, 1.18), d, dark, haze); line(ctx, ridge(0), ridge(1));
    return;
  }
  const brick = map.palette.wallStyle === 'brick';
  const rows = brick ? 9 : 6;
  const cols = brick ? 4 : 3;
  const mortar = fog(shade(map.palette.wallDark, 0.55), d, dark, haze);
  for (let i = 0; i < rows; i++) {
    const t0 = i / rows, t1 = (i + 1) / rows;
    const off = (i % 2) * 0.5 / cols;
    for (let j = -1; j <= cols; j++) {
      const s0 = Math.max(0, j / cols + off), s1 = Math.min(1, (j + 1) / cols + off);
      if (s1 - s0 <= 0.01) continue;
      const v = hash(seed, i, j, 2) - 0.5;
      const col = fog(shade(map.palette.wallDark, shadeSide * (1 + v * 0.22)), d, dark, haze);
      quad(ctx, P(s0, t0), P(s1, t0), P(s1, t1), P(s0, t1), mortar);
      const g = uN > 40 ? 0.04 : 0.02;
      quad(ctx, P(s0 + g / cols, t0 + g / rows), P(s1 - g / cols, t0 + g / rows), P(s1 - g / cols, t1 - g / rows), P(s0 + g / cols, t1 - g / rows), col);
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); const a = P(0, 0), b = P(1, 0), c = P(1, 1), e = P(0, 1); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(e[0], e[1]); ctx.closePath(); ctx.stroke();
}

function drawDoor(ctx: CanvasRenderingContext2D, xl: number, xr: number, horizon: number, u: number, color: string, d: number, dark: boolean, locked: boolean, arched: boolean): void {
  const w = xr - xl, dw = w * 0.42, dh = u * 1.55;
  const x = xl + (w - dw) / 2, y = horizon + u - dh;
  const wood = fog(color, d, dark), darkWood = fog(shade(color, 0.7), d, dark), iron = fog('#6a6a74', d, dark);
  // Frame stones.
  ctx.fillStyle = fog('#5a5560', d, dark);
  ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, Math.round(dw) + 4, Math.round(dh) + 2);
  // The door, arched in towns.
  ctx.beginPath();
  if (arched) { ctx.moveTo(x, y + dh); ctx.lineTo(x, y + dw * 0.5); ctx.arc(x + dw / 2, y + dw * 0.5, dw / 2, Math.PI, 0); ctx.lineTo(x + dw, y + dh); }
  else ctx.rect(x, y, dw, dh);
  ctx.closePath();
  ctx.fillStyle = wood; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.save(); ctx.clip();
  // Planks and two iron bands with rivets.
  ctx.fillStyle = darkWood;
  for (let i = 1; i < 4; i++) ctx.fillRect(Math.round(x + dw * i / 4), Math.round(y), 1, Math.round(dh));
  ctx.fillStyle = iron;
  for (const t of [0.3, 0.7]) {
    ctx.fillRect(Math.round(x), Math.round(y + dh * t), Math.round(dw), Math.max(1, Math.round(u * 0.05)));
    if (dw > 16) for (let i = 0; i < 4; i++) { ctx.fillStyle = fog('#a0a0a8', d, dark); ctx.fillRect(Math.round(x + dw * (i + 0.5) / 4), Math.round(y + dh * t), 1, 1); ctx.fillStyle = iron; }
  }
  ctx.restore();
  // Handle: a ring, or a padlock when locked.
  if (locked) {
    const px = x + dw * 0.72, py = y + dh * 0.5;
    ctx.fillStyle = fog('#c9a34a', d, dark); ctx.fillRect(Math.round(px - u * 0.05), Math.round(py), Math.max(2, Math.round(u * 0.1)), Math.max(2, Math.round(u * 0.09)));
    ctx.strokeStyle = fog('#8a8a94', d, dark); ctx.lineWidth = Math.max(1, u * 0.02); ctx.beginPath(); ctx.arc(px, py, Math.max(1.5, u * 0.04), Math.PI, 0); ctx.stroke();
  } else if (dw > 10) {
    ctx.strokeStyle = iron; ctx.lineWidth = Math.max(1, u * 0.02);
    ctx.beginPath(); ctx.arc(x + dw * 0.72, y + dh * 0.55, Math.max(1.5, u * 0.04), 0, Math.PI * 2); ctx.stroke();
  }
}

function quad(ctx: CanvasRenderingContext2D, a: [number, number], b: [number, number], c: [number, number], e: [number, number], fill: string): void {
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(e[0], e[1]); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
}
function line(ctx: CanvasRenderingContext2D, a: [number, number], b: [number, number]): void { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }

/** Which cells the viewport can show, for the automap's field-of-view highlight. */
export function viewCells(map: GameMap, px: number, py: number, f: Facing, sight: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let d = 0; d <= Math.min(DEPTH, sight); d++) for (let l = -LATERAL; l <= LATERAL; l++) {
    const c = cellAt(px, py, f, d, l);
    if (map.inBounds(c.x, c.y)) out.push(c);
  }
  return out;
}
