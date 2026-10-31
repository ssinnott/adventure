// Each region's tints of the grounds it shares (#1099): every tint is a colour, cast a quarter of the way at
// most. A ground with no other region within two squares moves as far toward its own region's tint as that
// tint moves its colour of the day and no farther; within two of another it is a blend of the tints round it,
// one step from a border between its own and its neighbour's, and from a square to the next it moves a fifth
// of the way from one to the other at most, so a zone's border fades and is no line. The country past the
// zones has no region and no tint, and blends at its edge as a region with none. The Foreland's view and
// Thornmark's, which have none, are the scenes painted with every tint taken off, call for call, where Hearth
// Isle's is not; a view out past a zone's edge paints. How the tints look is the twelve views' (#1094).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { mix, hexToRgb } from '../../src/lib/art/palettes.ts';
import { AREAS, TABLES, type RegionId } from '../../src/content/index.ts';
import { buildMaps } from '../../src/content/maps.ts';
import type { Terrain } from '../../src/game/mapdef.ts';
import type { GameMap } from '../../src/game/map.ts';
import type { Tables } from '../../src/game/tables.ts';
import { World, regionAt } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { paintScene } from '../../src/ui/view/compositor.ts';
import { paintOn, CLEAR } from '../../src/ui/view/common.ts';
import type { Paint } from '../../src/ui/view/common.ts';
import { GROUND, groundColor } from '../../src/ui/view/ground/index.ts';
import { ok } from './lib.ts';

/** A 2D context that paints nothing and writes down each call and each setting, a gradient by its number and its stops, as air.ts's. */
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

/** Every region's look with its tints taken off. */
const BARE = Object.fromEntries(Object.entries(TABLES.looks).map(([r, l]) => [r, { ...l, tints: undefined }])) as Tables['looks'];

export function tints(): void {
  const colour = /^#[0-9a-f]{6}$/, all = AREAS.flatMap((a) => Object.entries(a.look.tints ?? {}).map(([t, tint]) => ({ area: a.id, t, ...tint })));
  const wrong = all.filter((x) => !(x.t in GROUND) || !colour.test(x.toward) || !(x.by > 0 && x.by <= 0.25));
  ok(all.length > 0 && !wrong.length, `every tint is a colour, on a ground there is, cast a quarter of the way at most (${all.length} tints in ${AREAS.filter((a) => a.look.tints).length} of ${AREAS.length} areas${wrong.length ? '; wrong: ' + wrong.map((x) => `${x.area}'s ${x.t}`).join(', ') : ''})`);

  // A chequer of the squares of the zones, the towns and the country within three of a zone, odd and even so
  // that a zone's border is held from both its sides, and every sixth square of the rest of the country: each
  // ground some region tints at Harvest, and on every sixth square on two more days and with every ground.
  // Each painted with the tables' looks, with the tints taken off and with no looks at all, as a painter given
  // none (the smoke's hill) is; a tint is what the looks add to the last, where no channel ran to black or white.
  const maps = buildMaps(), ctx = {} as CanvasRenderingContext2D, tinted = [...new Set(all.map((x) => x.t as Terrain))];
  const paint = (m: GameMap, day: number, looks?: Tables['looks']): Paint => ({ ...paintOn(ctx, { x: 0, y: 0, w: 400, h: 268 }, m), env: { ...CLEAR, day }, looks });
  const tintOf = (p: Paint, none: Paint, t: Terrain, x: number, y: number): number[] | undefined => {
    const a = hexToRgb(groundColor(p, t, '#000000', x, y)), b = hexToRgb(groundColor(none, t, '#000000', x, y));
    return [...a, ...b].some((v) => v === 0 || v === 255) ? undefined : a.map((v, i) => v - b[i]);
  };
  // How far a region's own tint moves a ground's colour of the day: nowhere for one that does not tint it, nor
  // past the zones, where no region is.
  const shifts = new Map<string, number[]>();
  const shift = (r: RegionId | undefined, t: Terrain, day: number): number[] => {
    const key = `${r}|${t}|${day}`, known = shifts.get(key);
    if (known) return known;
    const tint = r && TABLES.looks[r].tints?.[t], c = GROUND[t].color(day, 0), from = hexToRgb(c);
    const s = tint ? hexToRgb(mix(c, tint.toward, tint.by)).map((v, i) => v - from[i]) : [0, 0, 0];
    shifts.set(key, s);
    return s;
  };
  const alike = (a: number[], b: number[]): boolean => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  let squares = 0, inside = 0, border = 0, past = 0, fringe = 0, pairs = 0, most = 0, steepest = 0;
  const off = new Set<string>(), outside = new Set<string>(), lined = new Set<string>(), steep = new Set<string>(), moved = new Set<string>(), took = new Set<string>();
  for (const m of Object.values(maps)) {
    if (m.kind === 'dungeon') continue;
    // Each square's region as `regionAt` finds it, and the regions within `reach` of a square.
    const at: (RegionId | undefined)[] = [];
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) at.push(regionAt(m, x, y));
    const regionOf = (x: number, y: number) => (m.inBounds(x, y) ? at[y * m.width + x] : regionAt(m, x, y));
    const round = (x: number, y: number, reach = 2): Set<RegionId | undefined> => {
      const s = new Set<RegionId | undefined>();
      for (let dy = -reach; dy <= reach; dy++) for (let dx = -reach; dx <= reach; dx++) s.add(regionOf(x + dx, y + dy));
      return s;
    };
    for (let y = 0; y < m.height; y++) for (let x = y % 2; x < m.width; x += 2) {
      const region = regionOf(x, y), sixth = x % 6 === 0 && y % 6 === 0, near = round(x, y);
      if (!region && !sixth && [...round(x, y, 3)].every((r) => !r)) continue;
      const by = [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([dx, dy]) => regionOf(x + dx, y + dy)).filter((r) => r !== region);
      if (region) { squares++; if (near.size === 1) inside++; } else { past++; if (near.size > 1) fringe++; }
      if (by.some((r) => TABLES.looks[r!]?.tints !== (region && TABLES.looks[region].tints))) border++;
      for (const day of sixth ? [10, 45, 91] : [45]) {
        const p = paint(m, day, TABLES.looks), bare = paint(m, day, BARE), none = paint(m, day);
        for (const t of sixth ? (Object.keys(GROUND) as Terrain[]) : tinted) {
          if (sixth && groundColor(bare, t, '#000000', x, y) !== groundColor(none, t, '#000000', x, y)) moved.add(`${t} with none`);
          const d = tintOf(p, none, t, x, y), own = shift(region, t, day), round2 = [...near].map((r) => shift(r, t, day)), key = `${region ?? 'no region'}'s ${t}`;
          if (!d) continue;
          // No other tint within two squares: its own, to the step, or none.
          if (round2.every((s) => alike(s, own))) {
            if (!alike(d, own)) (own.some(Boolean) ? off : moved).add(key);
            if (!own.some(Boolean)) continue;
            const tint = TABLES.looks[region!].tints![t]!, from = hexToRgb(GROUND[t].color(day, 0)), to = hexToRgb(tint.toward);
            const i = [0, 1, 2].reduce((k, j) => (Math.abs(to[j] - from[j]) > Math.abs(to[k] - from[k]) ? j : k), 0);
            most = Math.max(most, (Math.abs(d[i]) - 0.5) / (Math.abs(to[i] - from[i]) || 1));
            took.add(region!);
            continue;
          }
          // A blend: between the tints round it, and one step from a border neither its own nor its neighbour's.
          if ([0, 1, 2].some((i) => d[i] < Math.min(...round2.map((s) => s[i])) || d[i] > Math.max(...round2.map((s) => s[i])))) outside.add(key);
          for (const r of by) {
            const o = shift(r, t, day);
            if (Math.max(...o.map((v, i) => Math.abs(v - own[i]))) >= 5 && (alike(d, own) || alike(d, o))) lined.add(`${key} by ${r ?? 'no region'}'s`);
          }
          // From the square to the next, east and south: a fifth of the way from one tint round them to another at most, and a step of rounding.
          for (const [dx, dy] of [[1, 0], [0, 1]]) {
            const e = tintOf(p, none, t, x + dx, y + dy);
            if (!e) continue;
            const both = [...new Set([...near, ...round(x + dx, y + dy)])].map((r) => shift(r, t, day));
            pairs++;
            for (let i = 0; i < 3; i++) {
              const span = Math.max(...both.map((s) => s[i])) - Math.min(...both.map((s) => s[i])), jump = Math.abs(e[i] - d[i]);
              if (jump > span / 5 + 1) steep.add(`${key} at ${m.id} ${x},${y}`);
              if (span > 0) steepest = Math.max(steepest, (jump - 1) / span);
            }
          }
        }
      }
    }
  }
  const regions = AREAS.filter((a) => a.look.tints).length;
  ok(!off.size && !outside.size && !lined.size && most <= 0.25 && took.size === regions, `a ground moves toward its own region's tint as far as the tint says and no farther where no other region lies within two squares, and within two of one is a blend of the tints round it, one step from a border between its own and its neighbour's (${squares} squares of the zones and the towns, ${inside} of them three or more from another region, ${border} one step from a border; at most ${Math.round(most * 100)}% of the way, to the step; ${took.size} of ${regions} tinted regions took theirs${off.size + outside.size + lined.size ? '; off: ' + [...off, ...outside, ...lined].slice(0, 6).join(', ') : ''})`);
  ok(!steep.size && pairs > 0, `from a square to the next a tint moves a fifth of the way from one region's to another's at most, so a zone's border fades over two squares either side and is no line (${pairs} steps from a square to the next within two of a border, ground by ground; the steepest ${Math.round(steepest * 100)}% of the way between the tints round them, less a step of rounding${steep.size ? '; steep: ' + [...steep].slice(0, 6).join(', ') : ''})`);
  ok(!moved.size && past > 0 && fringe > 0, `a ground is the colour it was where no region within two squares tints it, as on the country past the zones three or more from one, and every ground is with the tints taken off (${past} squares past the zones, ${fringe} of them within two of a zone, which blend${moved.size ? '; moved: ' + [...moved].slice(0, 6).join(', ') : ''})`);

  // The view: the Foreland's noon scene and Thornmark's, which have no tints, are the scenes painted with every
  // tint taken off, call for call; Hearth Isle's is not, so the first is no accident of the painting. Path2D is the page's.
  (globalThis as { Path2D?: unknown }).Path2D ??= function Path2D() { return new Proxy({}, { get: () => () => {} }); };
  const scene = (looks: Tables['looks'], map: string, x: number, y: number): string => {
    const w = new World({ ...TABLES, looks }, maps, defaultParty(TABLES, makeRng(1)), makeRng(1)), log: string[] = [];
    w.state.weatherSeed = 1; w.travel(map, x, y, 0); w.state.minutes = 90 * 1440 + 11 * 60;
    paintScene(recorder(log), recorder(log), w, { x: 0, y: 0, w: 400, h: 268 });
    return log.join('\n');
  };
  const views: [string, number, number][] = [['downs_e2', 14, 26], ['thornmark', 14, 26]];
  const same = views.filter(([m, x, y]) => scene(TABLES.looks, m, x, y) === scene(BARE, m, x, y));
  const takes = scene(TABLES.looks, 'hearthisle_h6', 22, 19) !== scene(BARE, 'hearthisle_h6', 22, 19);
  ok(same.length === 2 && takes, `with no tints the view is as it was: the Foreland's and Thornmark's noon scenes are the ones painted with every tint taken off, call for call, and Hearth Isle's is not (${same.length} of 2 the same; Hearth Isle's ${takes ? 'differs' : 'the same'})`);

  // A company at a zone's edge facing north, two squares short of the country past the zones where it lies as a
  // ground some region tints: the view paints, those squares naming no region and taking no tint.
  const out = Object.values(maps).find((m) => m.zones.length)!;
  let edge: [number, number] | undefined, threw = '';
  for (let y = 2; y < out.height && !edge; y++) for (let x = 0; x < out.width && !edge; x++) {
    const past = out.at(x, y - 2);
    if (out.zoneAt(x, y) && out.at(x, y).solid === 'none' && !out.zoneAt(x, y - 2) && tinted.includes((past.look ?? past).terrain)) edge = [x, y];
  }
  try { if (edge) scene(TABLES.looks, out.id, ...edge); } catch (e) { threw = String(e); }
  ok(!!edge && !threw, `a view out past a zone's edge, on a ground some region tints, paints${edge ? ` (from ${edge.join(',')} facing north)` : ': no such square'}${threw ? `; it threw ${threw}` : ''}`);
}
