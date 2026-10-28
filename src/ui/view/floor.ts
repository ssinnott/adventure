// The floors (#1028): the ground of each square in view by its terrain and the season, the farmland's
// fields, rows and hedges, the hills (`hillBody`), the chasms and a dungeon's ceiling.

import type { GameMap } from '../../game/map.ts';
import type { Terrain, MapPalette } from '../../game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import type { Facing } from '../../game/types.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { TERRAIN_COLORS } from '../palette.ts';
import { hash } from '../paint/brush.ts';
import { unit, asDrawn, env, fog, SNOW, grassColor, hillColor, steppeColor, groundColor, unitIn, floorPt, quad, line } from './common.ts';
import { SNOW_HOLD, heatherBloom, CROPS, fieldAt, hedgeColor } from './model.ts';

/** How many flowers are out: none before Sowing or after Leafturn. */
function flowering(day: number): number { return Math.max(0, Math.min(1, (day - 12) / 8, (72 - day) / 10)); }

/**
 * A farm square as the view sees it: its field's crop, whether the rows run away from the eye or
 * across it, and where a hedge parts it from the next field, near, far, left and right.
 */
interface Plot { crop: number; away: boolean; hedge: readonly [boolean, boolean, boolean, boolean]; }
export function farmPlot(map: GameMap, x: number, y: number, f: Facing): Plot {
  const here = fieldAt(x, y), rf = ((f + 1) & 3) as Facing;
  const parted = (dx: number, dy: number): boolean => map.at(x + dx, y + dy).terrain === 'farm' && fieldAt(x + dx, y + dy).id !== here.id;
  const fx = FACING_DX[f], fy = FACING_DY[f], rx = FACING_DX[rf], ry = FACING_DY[rf];
  return { crop: here.crop, away: here.rowsEW === (fx !== 0), hedge: [parted(-fx, -fy), parted(fx, fy), parted(-rx, -ry), parted(rx, ry)] };
}

/**
 * How plainly a crop's rows show on a day: furrows plain while the field lies ploughed, rows softer
 * as the crop grows over them. Pasture (crop 2) has none.
 */
function rowDepth(crop: number, day: number): number {
  if (crop % CROPS.length === 2) return 0;
  const [sown, cut, ploughed] = crop % CROPS.length === 3 ? [22, 70, 84] : [18, 60, 78];
  return day < sown || day >= ploughed ? 0.2 : day >= cut ? 0.12 : 0.08;
}

/** Rows of a crop, or furrows, and the hedges round the field. */
function drawFarm(ctx: CanvasRenderingContext2D, base: string, plot: Plot, cx: number, horizon: number, h: number, d: number, l: number, dark: boolean, haze: string | null): void {
  const P = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t);
  const depth = rowDepth(plot.crop, env.day) * (1 - 0.5 * env.cover);
  if (d <= 3 && depth > 0) {
    // Four rows a square, centred so they meet the next square's whichever way the eye faces.
    const row = fog(shade(base, 1 - depth), d, dark, haze);
    for (let k = 0; k < 4; k++) {
      const a = k / 4 + 1 / 16, b = k / 4 + 3 / 16;
      if (plot.away) quad(ctx, P(0, a), P(0, b), P(1, b), P(1, a), row);
      else quad(ctx, P(a, 0), P(a, 1), P(b, 1), P(b, 0), row);
    }
  }
  const [near, far, left, right] = plot.hedge;
  if (!(near || far || left || right)) return;
  const hedge = fog(mix(hedgeColor(env.day), SNOW, env.cover * 0.7), d, dark, haze);
  // Each strip runs a little past the square's ends, as the floor tiles overlap, so a hedge along
  // two squares shows no hairline where they meet.
  const w = 0.07, a = -0.01, b = 1.01;
  if (near) quad(ctx, P(0, a), P(0, b), P(w, b), P(w, a), hedge);
  if (far) quad(ctx, P(1 - w, a), P(1 - w, b), P(1, b), P(1, a), hedge);
  if (left) quad(ctx, P(a, 0), P(a, w), P(b, w), P(b, 0), hedge);
  if (right) quad(ctx, P(a, 1 - w), P(a, 1), P(b, 1), P(b, 1 - w), hedge);
}

/** The part of a cubic Bézier from t = a to t = b, as a cubic of its own (de Casteljau). */
function subCubic(p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], a: number, b: number): [number, number][] {
  const at = (t: number, q: [number, number][]): [number, number][] => {
    const lerp = (u: [number, number], v: [number, number]): [number, number] => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t];
    const [q0, q1, q2, q3] = q, r0 = lerp(q0, q1), r1 = lerp(q1, q2), r2 = lerp(q2, q3), s0 = lerp(r0, r1), s1 = lerp(r1, r2);
    return [q0, r0, s0, lerp(s0, s1), s1, r2, q3];
  };
  // Split at b, keep the first part; split that at a / b, keep the second.
  const first = at(b, [p0, p1, p2, p3]).slice(0, 4);
  return at(a / b, first).slice(3);
}

/** A hill's outline on the screen: its foot from lx to rx at ly, and the curve over its crest. */
interface HillShape { outline: Path2D; lx: number; ly: number; rx: number; top: number; c1: [number, number]; c2: [number, number] }

/**
 * A hill's body: the mound and the light on its crest, and nothing outside its outline, which is
 * returned for the tufts and for the smoke test to hold it to. The crest light is clipped to the
 * outline, so it cannot float clear of the hill with a sliver of sky beneath, as a line drawn off
 * the outline does.
 */
export function hillBody(ctx: CanvasRenderingContext2D, base: string, cx: number, horizon: number, h: number, d: number, l: number, seed: number, dark: boolean, haze: string | null, hillL: boolean, hillR: boolean): HillShape {
  const [lx, ly] = floorPt(cx, horizon, h, d, l, 0.02, hillL ? -0.25 : 0.02);
  const [rx] = floorPt(cx, horizon, h, d, l, 0.02, hillR ? 1.25 : 0.98);
  const w = rx - lx, rise = unitIn(d, 0.5, h) * (0.4 + 0.5 * hash(seed, 61)), lean = (hash(seed, 62) - 0.5) * 0.4 * w;
  const top = ly - rise / 0.75;
  const c1: [number, number] = [lx + w * 0.3 + lean, top], c2: [number, number] = [rx - w * 0.3 + lean, top];
  const outline = new Path2D();
  outline.moveTo(lx, ly); outline.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], rx, ly); outline.closePath();
  const g = ctx.createLinearGradient(0, ly - rise, 0, ly);
  // Lit on the crest, shadowed down the flank, and at the foot the ground again, so no seam shows
  // where the hill meets the floor in front of it.
  g.addColorStop(0, fog(shade(base, 1.1), d, dark, haze)); g.addColorStop(0.6, fog(shade(base, 0.86), d, dark, haze)); g.addColorStop(1, fog(base, d - 0.5, dark, haze));
  ctx.fillStyle = g; ctx.fill(outline);
  const crest = subCubic([lx, ly], c1, c2, [rx, ly], 0.15, 0.85);
  ctx.save(); ctx.clip(outline);
  ctx.strokeStyle = fog(shade(base, 1.14), d, dark, haze); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(...crest[0]); ctx.bezierCurveTo(...crest[1], ...crest[2], ...crest[3]); ctx.stroke();
  ctx.restore();
  return { outline, lx, ly, rx, top, c1, c2 };
}

/**
 * Rising ground: a round-shouldered mound on the square, lit on its crest, running on into the next
 * hill beside it. What it hides from lower ground (`hillOver`, game/world.ts) the scene leaves undrawn.
 */
export function drawHill(ctx: CanvasRenderingContext2D, base: string, cx: number, horizon: number, h: number, d: number, l: number, seed: number, dark: boolean, haze: string | null, hillL: boolean, hillR: boolean): void {
  const { lx, ly, rx, top, c1, c2 } = hillBody(ctx, base, cx, horizon, h, d, l, seed, dark, haze, hillL, hillR);
  // Tufts on the crest, buried by a deep snow: grass, which stands above the outline.
  if (d > 2 || env.cover > 0.55) return;
  const u = unit(d, h), sc = u / unit(1, h);
  ctx.strokeStyle = fog(shade(hillColor(env.day), env.cover > 0.05 ? 0.85 : 1.25), d, dark, haze); ctx.lineWidth = Math.max(1, sc);
  for (let i = 0; i < 5; i++) {
    const t = 0.2 + 0.6 * hash(seed, 63, i), m = 1 - t;
    const x = m * m * m * lx + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * rx;
    const y = m * m * m * ly + 3 * m * m * t * top + 3 * m * t * t * top + t * t * t * ly + 2 * sc;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5 * sc, y - 4 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1.5 * sc, y - 3.5 * sc); ctx.stroke();
  }
}

/**
 * The chasm: the drop, dark as it goes down. Where ground stands beyond it, its far wall shows under
 * the rim, rock in bands darkening into the depth; where ground stands before it, a lit lip.
 */
function drawChasm(ctx: CanvasRenderingContext2D, base: string, cx: number, horizon: number, h: number, d: number, l: number, seed: number, dark: boolean, haze: string | null, rims: { near: boolean; far: boolean }): void {
  const pt = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t);
  quad(ctx, pt(0, 0), pt(0, 1), pt(1, 1), pt(1, 0), fog(base, d, dark, haze));
  if (rims.far) {
    // The far wall hangs from the rim toward the eye, down past the chasm's own floor; the ground
    // before the chasm is painted after it, over its foot.
    const uF = unitIn(d, 1, h), y0 = horizon + uF, x0 = cx + (l - 0.5) * 2 * uF, x1 = cx + (l + 0.5) * 2 * uF, drop = uF * 2.4, bands = 7;
    const rock = '#9a92a4';
    for (let k = 0; k < bands; k++) {
      const ya = y0 + (drop * k) / bands, yb = y0 + (drop * (k + 1)) / bands + 1;
      ctx.fillStyle = fog(mix(shade(rock, 1 - 0.06 * (k % 2)), base, Math.min(1, (k / bands) * 1.15)), d, dark, haze);
      // Each band spans the column as it widens toward the eye, a half pixel over each edge, so walls
      // side by side meet with no seam.
      const ua = ya - horizon, ub = yb - horizon, col = (u: number, e: number): number => cx + (l - 0.5 + e) * 2 * u + (e - 0.5);
      quad(ctx, [col(ua, 0), ya], [col(ua, 1), ya], [col(ub, 1), yb], [col(ub, 0), yb], ctx.fillStyle as string);
      // Strata: a crack or two across each band.
      if (k < bands - 2) {
        ctx.strokeStyle = fog(mix(shade(rock, 0.6), base, k / bands), d, dark, haze); ctx.lineWidth = 1;
        const yy = ya + (yb - ya) * (0.3 + 0.4 * hash(seed, 83, k));
        const uy = yy - horizon, xa = col(uy, 0), xb = col(uy, 1);
        ctx.beginPath(); ctx.moveTo(xa, yy); for (let q = 1; q <= 4; q++) ctx.lineTo(xa + ((xb - xa) * q) / 4, yy + (hash(seed, 84, k, q) - 0.5) * (yb - ya) * 0.6); ctx.stroke();
      }
    }
    ctx.strokeStyle = fog(shade(rock, 1.3), d, dark, haze); ctx.lineWidth = Math.max(1, uF * 0.02); line(ctx, [x0, y0], [x1, y0]);
  }
  if (rims.near) { ctx.strokeStyle = fog('#8a8290', d, dark, haze); ctx.lineWidth = Math.max(1, unit(d, h) * 0.03); line(ctx, pt(0, 0), pt(0, 1)); }
}

export function drawFloor(ctx: CanvasRenderingContext2D, laid: Terrain, kind: string, cx: number, horizon: number, h: number, d: number, l: number, seed: number, dark: boolean, haze: string | null, floorPal: string, plot?: Plot, rims?: { near: boolean; far: boolean }): void {
  const terrain = asDrawn(laid);
  const base = groundColor(terrain, kind, floorPal, plot?.crop);
  // The drop is dark indoors too, not the floor's colour.
  if (terrain === 'chasm') { drawChasm(ctx, TERRAIN_COLORS.chasm, cx, horizon, h, d, l, seed, dark, haze, rims ?? { near: false, far: false }); return; }
  const n = d <= 2 ? 3 : 2;
  const flag = kind === 'dungeon' && terrain === 'floor';
  const mortar = fog(shade(base, 0.55), d, dark, haze);
  // One base fill under the sub-tiles, so their anti-aliased edges never show a seam of background.
  quad(ctx, floorPt(cx, horizon, h, d, l, 0, 0), floorPt(cx, horizon, h, d, l, 0, 1), floorPt(cx, horizon, h, d, l, 1, 1), floorPt(cx, horizon, h, d, l, 1, 0), flag ? mortar : fog(base, d, dark, haze));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = hash(seed, i, j) - 0.5;
    // Tiles vary a little; lying snow evens them out.
    let col = shade(base, 1 + v * (flag ? 0.16 : terrain === 'grass' ? 0.12 : terrain === 'farm' || terrain === 'ice' ? 0.04 : 0.08) * (1 - 0.75 * env.cover));
    if (terrain === 'water' || terrain === 'deep') col = shade(base, 1 + v * 0.1 + ((i + j) % 2) * 0.05);
    col = fog(col, d, dark, haze);
    // Flagstones sit inside a mortar gap; other terrains overlap a little so no seam shows.
    const inset = flag ? 0.06 : -0.02;
    const a = floorPt(cx, horizon, h, d, l, i / n + inset / n, j / n + inset / n), b = floorPt(cx, horizon, h, d, l, i / n + inset / n, (j + 1) / n - inset / n);
    const c = floorPt(cx, horizon, h, d, l, (i + 1) / n - inset / n, (j + 1) / n - inset / n), e = floorPt(cx, horizon, h, d, l, (i + 1) / n - inset / n, j / n + inset / n);
    quad(ctx, a, b, c, e, col);
  }
  if (plot) drawFarm(ctx, base, plot, cx, horizon, h, d, l, dark, haze);
  // Decorations: a few per cell, placed by hash, scaled by depth.
  const u = unit(d, h);
  // Cobbled roads: rounded stones packed in a jittered grid, each with a lit top edge.
  if (terrain === 'road' && d <= 3) {
    const cols = d <= 1 ? 6 : 4, rows = d <= 1 ? 5 : 3;
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const s = (i + 0.5 + (hash(seed, 31, i, j) - 0.5) * 0.4) / rows, t = (j + 0.5 + (hash(seed, 32, i, j) - 0.5) * 0.4) / cols;
      const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
      const sc = unitIn(d, s, h) / u;
      const rx = (u / cols) * 0.8 * sc * 0.9, ry = rx * 0.45;
      const col = fog(shade(base, 0.85 + hash(seed, 33, i, j) * 0.35), d, dark, haze);
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
      if (rx > 3) { ctx.beginPath(); ctx.ellipse(x, y - ry * 0.35, rx * 0.7, ry * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = fog(shade(base, 1.2), d, dark, haze); ctx.fill(); }
      ctx.strokeStyle = fog(shade(base, 0.55), d, dark, haze); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  const deco = terrain === 'grass' ? 7 : terrain === 'woods' ? 6 : terrain === 'deadwood' ? 5 : terrain === 'dirt' ? 3 : terrain === 'sand' ? 4 : terrain === 'salt' ? 5 : terrain === 'heather' ? 7 : terrain === 'tidal' ? 5 : terrain === 'swamp' ? 3 : terrain === 'water' ? 3 : terrain === 'snow' ? 2
    : terrain === 'steppe' ? 7 : terrain === 'dunes' ? 5 : terrain === 'vines' ? 6
    : terrain === 'ash' ? 6 : terrain === 'pine' ? 6 : terrain === 'ice' ? 4 : flag ? 2 : 0;
  for (let i = 0; i < deco; i++) {
    const s = hash(seed, 7, i), t = hash(seed, 9, i);
    const [x, y] = floorPt(cx, horizon, h, d, l, s, t);
    const sc = unitIn(d, s, h) / u;
    if (terrain === 'grass') {
      if (i >= 5) {
        // A flower or two, from Sowing into Leafturn, and none under snow.
        if (hash(seed, 41, i) > 0.45 * flowering(env.day) || env.cover > 0.1) continue;
        ctx.fillStyle = fog(['#f0e060', '#ffffff', '#e05a6a', '#c080e0'][Math.floor(hash(seed, 42, i) * 4)], d, dark, haze);
        ctx.fillRect(Math.round(x), Math.round(y - 2 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(2 * sc)));
        continue;
      }
      // Tufts poke up through a light snow and are buried by a deep one.
      if (env.cover > 0.55) continue;
      const tuft = fog(env.cover > 0.05 ? shade(grassColor(env.day), 0.85) : shade(base, 1.3), d, dark, haze);
      ctx.strokeStyle = tuft; ctx.lineWidth = Math.max(1, sc);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5 * sc, y - 4 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 1 * sc, y - 4.5 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 2.5 * sc, y - 3 * sc); ctx.stroke();
    } else if (terrain === 'woods') {
      // Leaf litter and ferns under the trees, buried by a deep snow.
      if (env.cover > 0.55) continue;
      if (i < 3) {
        ctx.fillStyle = fog(['#6a4a2a', '#8a6a2e', '#4e5a2c'][Math.floor(hash(seed, 43, i) * 3)], d, dark, haze);
        ctx.fillRect(Math.round(x), Math.round(y - sc), Math.max(1, Math.round(3 * sc)), Math.max(1, Math.round(1.5 * sc)));
      } else {
        ctx.strokeStyle = fog(shade(base, 1.45), d, dark, haze); ctx.lineWidth = Math.max(1, sc);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4 * sc, y - 3 * sc); ctx.moveTo(x, y); ctx.lineTo(x, y - 5 * sc); ctx.moveTo(x, y); ctx.lineTo(x + 4 * sc, y - 3 * sc); ctx.stroke();
      }
    } else if (terrain === 'deadwood') {
      // Fallen limbs and bleached twigs, grey on grey, buried by a deep snow.
      if (env.cover > 0.55) continue;
      const a = (hash(seed, 45, i) - 0.5) * 1.2, len = (3 + 4 * hash(seed, 47, i)) * sc;
      ctx.strokeStyle = fog(i % 2 ? '#b0a898' : '#5e5850', d, dark, haze); ctx.lineWidth = Math.max(1, sc * (i < 2 ? 1.2 : 0.7));
      ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len * 0.4); ctx.stroke();
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
    } else if (terrain === 'salt') {
      // The crust cracked into plates, the cracks grey where the brine dried in them; snow hides them.
      if (env.cover > 0.55) continue;
      const a = hash(seed, 53, i) * Math.PI, len = (4 + 4 * hash(seed, 54, i)) * sc, b = a + 0.9 + hash(seed, 55, i);
      ctx.strokeStyle = fog(shade(base, 0.72), d, dark, haze); ctx.lineWidth = Math.max(1, sc * 0.8);
      ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x, y); ctx.lineTo(x + Math.cos(b) * len, y + Math.sin(b) * len * 0.4); ctx.stroke();
    } else if (terrain === 'heather') {
      // Low clumps, dark and wiry, purple-tipped while the heather flowers; a deep snow buries them.
      if (env.cover > 0.55) continue;
      const bloom = heatherBloom(env.day);
      ctx.fillStyle = fog(shade(base, 0.7), d, dark, haze);
      ctx.beginPath(); ctx.ellipse(x, y - sc, 3 * sc + 0.5, 1.6 * sc + 0.5, 0, 0, Math.PI * 2); ctx.fill();
      if (hash(seed, 56, i) < bloom) { ctx.fillStyle = fog('#a05a94', d, dark, haze); ctx.fillRect(Math.round(x - sc), Math.round(y - 2.5 * sc), Math.max(1, Math.round(2 * sc)), Math.max(1, Math.round(sc))); }
    } else if (terrain === 'tidal') {
      // Wet sand the sea has just left: ripples, and a pool that holds the sky.
      if (i === 0 && d <= 3) {
        const pw = unitIn(d, s, h) * (0.16 + 0.12 * hash(seed, 57, i)), ph = pw * 0.22;
        ctx.beginPath(); ctx.ellipse(x, y, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(shade(base, 0.62), d, dark, haze); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x - pw * 0.15, y - ph * 0.2, pw * 0.6, ph * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(fog(haze ?? '#8a94a4', d, dark, haze), 0.6); ctx.fill();
        continue;
      }
      ctx.strokeStyle = fog(shade(base, 0.78), d, dark, haze); ctx.lineWidth = Math.max(1, sc * 0.8);
      ctx.beginPath(); ctx.moveTo(x - 5 * sc, y); ctx.quadraticCurveTo(x - 2.5 * sc, y - 1.2 * sc, x, y); ctx.quadraticCurveTo(x + 2.5 * sc, y + 1.2 * sc, x + 5 * sc, y); ctx.stroke();
    } else if (terrain === 'ash') {
      // Ash drifted and rippled by the wind, a cinder or two in it; now and then an ember, dull by
      // day and glowing by night. A deep snow hides them.
      if (env.cover > 0.55) continue;
      if (i === 0) {
        if (hash(seed, 58) > 0.25) continue;
        const ew = Math.max(1, Math.round(3 * sc)), eh = Math.max(1, Math.round(1.5 * sc)), ex = Math.round(x), ey = Math.round(y - sc);
        if (dark) { ctx.fillStyle = 'rgba(224, 100, 42, 0.3)'; ctx.beginPath(); ctx.ellipse(ex + ew / 2, ey + eh / 2, ew * 1.4, eh * 1.6, 0, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = dark ? '#e0642a' : fog('#7a3a26', d, dark, haze);
        ctx.fillRect(ex, ey, ew, eh);
      } else if (i === 1) {
        // A drift, kept inside its square, so it never reaches the foot of a wall beyond.
        if (d > 2) continue;
        const ds = 0.25 + 0.45 * s, [px, py] = floorPt(cx, horizon, h, d, l, ds, 0.25 + 0.5 * t), pw = unitIn(d, ds, h) * (0.22 + 0.12 * hash(seed, 57)), ph = pw * 0.16;
        ctx.beginPath(); ctx.ellipse(px, py, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(shade(base, 1.22), d, dark, haze); ctx.fill();
      } else if (i < 4) {
        ctx.strokeStyle = fog(shade(base, 1.7), d, dark, haze); ctx.lineWidth = Math.max(1, sc * 0.8);
        ctx.beginPath(); ctx.moveTo(x - 5 * sc, y); ctx.quadraticCurveTo(x, y - 1.4 * sc, x + 5 * sc, y); ctx.stroke();
      } else {
        ctx.fillStyle = fog(i % 2 ? '#181616' : shade(base, 1.5), d, dark, haze);
        ctx.beginPath(); ctx.ellipse(x, y, 1.4 * sc + 0.4, 0.9 * sc + 0.3, 0, 0, Math.PI * 2); ctx.fill();
      }
    } else if (terrain === 'pine') {
      // Cones and needles under the pines, buried by a deep snow.
      if (env.cover > 0.55) continue;
      if (i < 2) {
        ctx.fillStyle = fog(i ? '#6a4a2a' : '#7e5c34', d, dark, haze);
        ctx.beginPath(); ctx.ellipse(x, y - sc, 1.6 * sc + 0.4, 1 * sc + 0.3, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        const a = (hash(seed, 46, i) - 0.5) * 1.4, len = (2 + 3 * hash(seed, 48, i)) * sc;
        ctx.strokeStyle = fog(i % 2 ? '#8a6a3c' : shade(base, 0.7), d, dark, haze); ctx.lineWidth = Math.max(1, sc * 0.7);
        ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len * 0.4); ctx.stroke();
      }
    } else if (terrain === 'ice') {
      // A frozen lake: a patch of black ice, the light lying along it and hairlines frozen into it.
      // A deep snow lies over all of it.
      if (env.cover > 0.55) continue;
      if (i < 2) {
        // The black ice and the light along it, kept inside the square, so neither reaches the foot of a wall beyond.
        if (d > 2) continue;
        const ds = 0.25 + 0.45 * s, [px, py] = floorPt(cx, horizon, h, d, l, ds, 0.25 + 0.5 * t), pw = unitIn(d, ds, h) * (i ? 0.3 : 0.18 + 0.1 * hash(seed, 59)), ph = pw * (i ? 0.08 : 0.2);
        ctx.beginPath(); ctx.ellipse(px, py, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(shade(base, i ? 1.12 : 0.78), d, dark, haze); ctx.fill();
      } else {
        const a = (hash(seed, 60, i) - 0.5) * 1.6, len = (4 + 5 * hash(seed, 61, i)) * sc, b = a + (hash(seed, 62, i) - 0.5);
        ctx.strokeStyle = fog(shade(base, 1.2), d, dark, haze); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len * 0.4); ctx.lineTo(x, y); ctx.lineTo(x + Math.cos(b) * len, y + Math.sin(b) * len * 0.4); ctx.stroke();
      }
    } else if (terrain === 'steppe') {
      // Tall dry grass in tufts, all leaning one way, pale and dark by turns, a seed head on some. A
      // light snow leaves their tops showing; a deep one flattens them.
      if (env.cover > 0.55) continue;
      ctx.strokeStyle = fog(env.cover > 0.05 ? shade(steppeColor(env.day), 0.8) : shade(base, i % 2 ? 1.3 : 0.8), d, dark, haze); ctx.lineWidth = Math.max(1, sc * 0.8);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - 3 * sc, x + 2 * sc, y - 5.5 * sc); ctx.moveTo(x + sc, y); ctx.quadraticCurveTo(x + 1.5 * sc, y - 2.5 * sc, x + 3.5 * sc, y - 4 * sc); ctx.moveTo(x - sc, y); ctx.lineTo(x - 0.5 * sc, y - 4.5 * sc); ctx.stroke();
      if (i < 2 && env.cover <= 0.05) { ctx.fillStyle = fog(shade(base, 1.45), d, dark, haze); ctx.fillRect(Math.round(x + sc), Math.round(y - 6.5 * sc), Math.max(1, Math.round(1.5 * sc)), Math.max(1, Math.round(2 * sc))); }
    } else if (terrain === 'dunes') {
      // Sand in ridges: a dune's crest across the square, lit along its top with its lee in shadow,
      // and the wind's ripples over the rest. A deep snow hides them.
      if (env.cover > 0.55) continue;
      if (i === 0) {
        // The crest, kept inside its square, so it never reaches the foot of a wall beyond.
        if (d > 3) continue;
        const ds = 0.4 + 0.25 * hash(seed, 52), tilt = 0.12 * (hash(seed, 53) - 0.5);
        const a = floorPt(cx, horizon, h, d, l, ds - tilt, 0.04), b = floorPt(cx, horizon, h, d, l, ds + tilt, 0.96), mid = floorPt(cx, horizon, h, d, l, ds + 0.1, 0.5);
        quad(ctx, a, b, floorPt(cx, horizon, h, d, l, ds + tilt - 0.16, 0.96), floorPt(cx, horizon, h, d, l, ds - tilt - 0.16, 0.04), fog(shade(base, 0.8), d, dark, haze));
        ctx.strokeStyle = fog(shade(base, 1.2), d, dark, haze); ctx.lineWidth = Math.max(1, sc * 1.4);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(mid[0], mid[1], b[0], b[1]); ctx.stroke();
      } else {
        ctx.strokeStyle = fog(shade(base, i % 2 ? 1.14 : 0.86), d, dark, haze); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x - 4 * sc, y); ctx.quadraticCurveTo(x, y - 1.2 * sc, x + 4 * sc, y); ctx.stroke();
      }
    } else if (terrain === 'vines') {
      // Fallen leaves and a creeper's runners over the dark ground, buried by a deep snow.
      if (env.cover > 0.55) continue;
      if (i < 3) {
        ctx.fillStyle = fog(['#2e5a26', '#4a3a24', '#4a7a2e'][Math.floor(hash(seed, 54, i) * 3)], d, dark, haze);
        ctx.fillRect(Math.round(x), Math.round(y - sc), Math.max(1, Math.round(3 * sc)), Math.max(1, Math.round(1.5 * sc)));
      } else {
        ctx.strokeStyle = fog(shade(base, 1.5), d, dark, haze); ctx.lineWidth = Math.max(1, sc * 0.8);
        ctx.beginPath(); ctx.moveTo(x - 5 * sc, y); ctx.bezierCurveTo(x - 2 * sc, y - 2 * sc, x + 2 * sc, y + sc, x + 5 * sc, y - sc); ctx.stroke();
      }
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
  // After rain, puddles stand on the roads and the dirt, holding a little of the sky.
  if (env.wet > 0.3 && (terrain === 'road' || terrain === 'dirt') && d <= 3) {
    for (let i = 0; i < 3; i++) {
      if (hash(seed, 91, i) > env.wet - 0.2) continue;
      const s = 0.2 + hash(seed, 92, i) * 0.6, [x, y] = floorPt(cx, horizon, h, d, l, s, 0.15 + hash(seed, 93, i) * 0.7);
      const pw = unitIn(d, s, h) * (0.22 + 0.2 * hash(seed, 94, i)), ph = pw * 0.2;
      ctx.beginPath(); ctx.ellipse(x, y, pw, ph, 0, 0, Math.PI * 2); ctx.fillStyle = fog(shade(base, 0.6), d, dark, haze); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - pw * 0.15, y - ph * 0.2, pw * 0.6, ph * 0.4, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(fog(haze ?? '#8a94a4', d, dark, haze), 0.55); ctx.fill();
    }
  }
  // Lying snow glitters.
  if (env.cover > 0.5 && SNOW_HOLD[terrain] > 0.7) {
    for (let i = 0; i < 4; i++) {
      const [x, y] = floorPt(cx, horizon, h, d, l, hash(seed, 95, i), hash(seed, 96, i));
      ctx.fillStyle = fog(i % 2 ? '#ffffff' : '#c8d8f0', d, dark, haze); ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }
  if (terrain === 'lava') {
    const [x, y] = floorPt(cx, horizon, h, d, l, 0.5, 0.5);
    const gg = ctx.createRadialGradient(x, y, 0, x, y, u * 0.8); gg.addColorStop(0, 'rgba(255,200,80,0.7)'); gg.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = gg; ctx.fillRect(x - u, y - u, u * 2, u * 2);
  }
}

export function drawCeiling(ctx: CanvasRenderingContext2D, pal: MapPalette, cx: number, horizon: number, h: number, d: number, l: number, seed: number, facing: number): void {
  const ceiling = pal.ceiling;
  const P = (s: number, t: number): [number, number] => { const u = unitIn(d, s, h); return [cx + (l - 0.5 + t) * 2 * u, horizon - u]; };
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
