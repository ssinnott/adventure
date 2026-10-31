// The horizon cast from the atlas (#1095), over the cast alone with no canvas: from Helmstow's road facing south the
// Wyke lies flat; facing Fire Mountain from Ashfall the volcano stands highest; from Monks' Vale the peaks stand over
// the pines; every ray ends at the rim or at the reach; a step moves the skyline by that step and no more. Without a
// cast the sky's hills are main's two bands, call for call, as the title's and the endings' dusk paint them. How the
// land looks is the twelve views' (#1094).
import { createHash } from 'node:crypto';
import { GRID } from '../../src/content/maps.ts';
import { ATLAS } from '../../src/content/index.ts';
import { mapAt, TERRAINS, TI } from '../../src/game/atlas.ts';
import { FACING_DX, FACING_DY } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { castHorizon, heightsOf, standsOver, REACH } from '../../src/ui/view/horizon.ts';
import type { Horizon, Land } from '../../src/ui/view/horizon.ts';
import { unit } from '../../src/ui/view/common.ts';
import { drawSkyBand } from '../../src/ui/view/sky.ts';
import { ok } from './lib.ts';

/** What main's sky painted for its hills without a cast, at 51cef55f: the two bands the title's and the endings' dusk keep. */
const MAIN = '205619fff009';

/** The view's size, as the game draws it. */
const W = 400, H = 268;

/** A world cell: a square of a zone map, where the atlas lays it. */
function on(map: string, x: number, y: number): { x: number; y: number } {
  const at = mapAt(ATLAS, map);
  if (!at) throw new Error(`${map} is not laid in the atlas`);
  return { x: at[0] + x, y: at[1] + y };
}

/** #1094's twelve views, each a world cell and its facing. */
const VIEWS: [string, number, number, Facing][] = [['downs_e2', 14, 26, 0], ['thornmark', 14, 26, 0], ['delta_b5', 22, 19, 0], ['wrackholm_f6', 10, 10, 0],
  ['lanternwood_l3', 9, 10, 3], ['kilnsheart_o5', 22, 19, 0], ['cairnfield_m8', 14, 26, 0], ['longmere_m10', 14, 26, 0],
  ['highspine_i11', 22, 19, 0], ['emberwaste_f11', 22, 19, 0], ['wold_c8', 14, 26, 0], ['hearthisle_h6', 22, 19, 0]];

/** A 2D context that paints nothing and writes down each call and each setting, a gradient by its number and its stops (as tools/tests/air.ts has it). */
function recorder(log: string[]): CanvasRenderingContext2D {
  let n = 0;
  const gradient = (kind: string, a: unknown[]) => {
    const id = `${kind}#${n++}`; log.push(`${id}(${a.join(',')})`);
    return { id, addColorStop: (at: number, c: string) => { log.push(`${id}.stop(${at},${c})`); } };
  };
  return new Proxy({}, {
    get: (_, k) => k === 'createLinearGradient' || k === 'createRadialGradient' ? (...a: unknown[]) => gradient(String(k), a) : (...a: unknown[]) => { log.push(`${String(k)}(${a.join(',')})`); },
    set: (_, k, v) => { log.push(`${String(k)}=${v && typeof v === 'object' ? (v as { id: string }).id : String(v)}`); return true; },
  }) as unknown as CanvasRenderingContext2D;
}

/** Five weathers (clear, overcast, rain, fog, snow lying) at noon, dusk and night, facing each way: 60 skies. */
const SKIES = [[0, 0, 0, 0], [0.8, 0, 0, 0], [0.9, 0.5, 0.8, 0], [0.3, 1, 0, 0], [0.9, 0.4, 0.6, 1]].flatMap(([cloud, murk, heavy, cover]) =>
  [[12, 1], [18.6, 0.45], [23, 0]].flatMap(([hour, daylight]) => [0, 1, 2, 3].map((facing) => ({ cloud, murk, heavy, cover, hour, daylight, facing }))));

/** The land moved a step nearer the eye facing `f`: each cell what lay a step beyond it, its height with it. */
function stepped(f: Facing): { land: Land; tall: Uint8Array } {
  const { width, height } = GRID, terrain = new Uint8Array(width * height), tall = new Uint8Array(width * height), was = heightsOf(GRID);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const sx = x + FACING_DX[f], sy = y + FACING_DY[f];
    if (sx < 0 || sy < 0 || sx >= width || sy >= height) continue;
    terrain[y * width + x] = GRID.terrain[sy * width + sx]; tall[y * width + x] = was[sy * width + sx];
  }
  return { land: { width, height, terrain }, tall };
}

/** Where two casts differ: in a column's skyline (each part's top, kind and distance), where its ray ended, or a row of the band (its terrain and distance). */
function differs(a: Horizon, b: Horizon): number {
  let n = 0;
  for (let c = 0; c < W; c++) {
    const p = a.cols[c], q = b.cols[c];
    if (a.end[c] !== b.end[c] || p.length !== q.length || p.some((s, i) => s.top !== q[i].top || s.t !== q[i].t || s.d !== q[i].d)) n++;
  }
  for (let i = 0; i < a.ts.length; i++) if (a.ts[i] !== b.ts[i] || a.ds[i] !== b.ds[i]) n++;
  return n;
}

export function horizon(): void {
  const cast = (at: { x: number; y: number }, f: Facing): Horizon => castHorizon(GRID, at, f, W, H);
  const top = (h: Horizon, c: number): number => h.cols[c].at(-1)?.top ?? 0;

  // Helmstow's road south, over the Wyke to the inland sea: the middle third of the view stands nothing near, and the
  // band's rows inside the Wyke, some 30 to 50 squares off, are water.
  {
    const h = cast(on('shelf', 16, 5), 2), mid = Array.from({ length: W / 3 }, (_, i) => Math.round(W / 3) + i);
    const near = Math.max(...mid.map((c) => standsOver(h, c, 100)));
    const kinds = [...new Set(mid.flatMap((c) => h.cols[c].filter((p) => p.d < 100).map((p) => TERRAINS[p.t])))];
    const rows = [2, 3], wet = rows.flatMap((j) => mid.map((c) => h.ts[j * W + c])).filter((t) => t === TI.sea || t === TI.shallow).length;
    const share = Math.round((100 * wet) / (rows.length * mid.length));
    ok(near <= 4 && share >= 90, `from Helmstow's road facing south the Wyke lies flat: over the middle third of the view nothing within a hundred squares stands over ${near} px (${kinds.join(', ') || 'nothing'}; the bands stood 30 to 56), and the band's rows ${Math.round(unit(0, H) / 2 / 3.5 - 0.5)} to ${Math.round(unit(0, H) / 2 / 2.5 - 0.5)} squares off are ${share}% water`);
  }

  // Ashfall: from the Ember Waste facing east, Fire Mountain on the left of the view and the Whitespine far off ahead.
  {
    const h = cast(on('emberwaste_f11', 22, 19), 1);
    let best = 0;
    for (let c = 1; c < W; c++) if (top(h, c) > top(h, best)) best = c;
    const kind = TERRAINS[h.cols[best].at(-1)?.t ?? 0];
    const other = Math.max(...h.cols.map((s) => Math.max(0, ...s.filter((p) => p.t !== TI.volcano).map((p) => p.top))));
    ok(kind === 'volcano', `facing Fire Mountain from Ashfall the volcano stands highest: from the Ember Waste's 22,19 facing east the highest column is ${kind}, ${top(h, best)} px, ${h.cols[best].at(-1)?.d} squares off; nothing else stands over ${other} px`);
  }

  // Monks' Vale: from its road through the pinewood north of the vale, facing west to the High Spine.
  {
    const h = cast(on('monksvale_j10', 26, 23), 3);
    const over = h.cols.filter((s) => {
      const pine = s.find((p) => p.t === TI.pine), peak = [...s].reverse().find((p) => p.t === TI.peak);
      return pine && peak && peak.d > pine.d && peak.top > pine.top;
    }).length;
    ok(over >= W / 4, `from Monks' Vale the peaks stand over the pines: from its road at the pinewood's 26,23 facing west, in ${over} of ${W} columns a peak stands over pines nearer it`);
  }

  // Every ray, from each of the twelve views facing each way: walked again here, square by square through the square its
  // column shows at each depth, it ends on the first square past the world's edge, or at the reach.
  {
    const U = unit(0, H) / 2, casts: Horizon[] = [], wrong: string[] = [];
    let rim = 0, reach = 0;
    const t0 = performance.now();
    for (const [map, x, y] of VIEWS) for (const f of [0, 1, 2, 3] as Facing[]) casts.push(cast(on(map, x, y), f));
    const ms = (performance.now() - t0) / casts.length;
    casts.forEach((h, n) => {
      const at = on(VIEWS[n >> 2][0], VIEWS[n >> 2][1], VIEWS[n >> 2][2]), f = (n & 3) as Facing, r = ((f + 1) & 3) as Facing;
      for (let c = 0; c < W; c++) {
        const s = (c + 0.5 - W / 2) / (2 * U);
        let end = REACH;
        for (let k = 5; k <= REACH; k++) {
          const l = Math.round(s * (k + 0.5)), wx = at.x + k * FACING_DX[f] + l * FACING_DX[r], wy = at.y + k * FACING_DY[f] + l * FACING_DY[r];
          if (GRID.t(wx, wy) === TI.void) { end = k; break; }
        }
        if (end < REACH) rim++; else reach++;
        if (h.end[c] !== end && wrong.length < 3) wrong.push(`${VIEWS[n >> 2][0]} facing ${f}, column ${c}: ${h.end[c]}, not ${end}`);
      }
    });
    ok(wrong.length === 0 && rim > 0 && reach > 0, `every ray ends at the rim, the first square past the world's edge, or at the reach of ${REACH} squares: of the ${rim + reach} rays from the twelve views facing each way, ${rim} at the rim and ${reach} at the reach; the cast costs ${ms.toFixed(1)} ms a scene${wrong.length ? '; wrong: ' + wrong.join('; ') : ''}`);
  }

  // A step: the horizon a step ahead is the horizon from the square before it over the land moved a step nearer, so it
  // reads nothing but the land about it (not the eye's square, the compass or the screen) and nothing flickers as the
  // company walks. Twelve steps up the High Spine's road and twelve down Helmstow's.
  {
    let steps = 0, off = 0, moved = 0, cols = 0;
    for (const [map, x, y, f] of [['highspine_i11', 22, 19, 0], ['shelf', 16, 5, 2]] as [string, number, number, Facing][]) {
      const { land, tall } = stepped(f), from = on(map, x, y);
      for (let i = 0; i < 12; i++) {
        const a = { x: from.x + i * FACING_DX[f], y: from.y + i * FACING_DY[f] }, b = { x: a.x + FACING_DX[f], y: a.y + FACING_DY[f] };
        const ahead = cast(b, f), before = cast(a, f);
        off += differs(ahead, castHorizon(land, a, f, W, H, tall));
        for (let c = 0; c < W; c++) moved += Math.abs(top(ahead, c) - top(before, c));
        steps++; cols += W;
      }
    }
    ok(off === 0, `a step moves the skyline by that step and no more: over ${steps} steps up the High Spine's road and down Helmstow's, the horizon a step ahead is the horizon from the square before it over the land moved a step nearer, in every column and every row of the band (${off} differ); the skyline moves ${(moved / cols).toFixed(2)} px a column a step`);
  }

  // Without a cast the sky's hills are main's, call for call: the bands of the title's and the endings' dusk.
  {
    const log: string[] = [];
    for (const { cloud, murk, heavy, cover, hour, daylight, facing } of SKIES) {
      drawSkyBand(recorder(log), { x: 0, y: 0, w: W, h: H }, { facing, hour, daylight, dark: daylight < 0.25, cloud, murk, heavy, drift: 140, cover, day: 91, hearth: { bearing: 190, step: 2 }, part: 'hills' });
      drawSkyBand(recorder(log), { x: 8, y: 8, w: 624, h: 344 }, { facing, hour, daylight, dark: false, cloud, murk, part: 'hills' });
    }
    const digest = createHash('sha256').update(log.join('\n')).digest('hex').slice(0, 12);
    ok(digest === MAIN, `without a cast the sky's hills are main's two bands, call for call, as the title's and the endings' dusk paint them (${SKIES.length} skies, ${log.length} calls, ${digest})`);
  }
}
